(function () {
  // Widget decorativo: disegna un segnale su ogni canvas[data-onda].
  // In fase 2 la forma d'onda potrà portare un messaggio (vedi segreto.config.js).
  var ridotto = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function colore(nome, riserva) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(nome).trim();
    return v || riserva;
  }

  function Onda(canvas) {
    this.c = canvas;
    this.ctx = canvas.getContext("2d");
    this.t = 0;
    this.visibile = true;
    this.seme = Math.random() * 1000;
    this.colori = [colore("--bronzo", "#c08a4d"), colore("--fucsia", "#ff2e93"), colore("--linea", "#2b3037")];
    canvas.setAttribute("aria-hidden", "true");
    this.misura();
  }

  Onda.prototype.misura = function () {
    var dpr = window.devicePixelRatio || 1;
    var r = this.c.getBoundingClientRect();
    this.w = Math.max(1, r.width);
    this.h = Math.max(1, r.height);
    this.c.width = Math.round(this.w * dpr);
    this.c.height = Math.round(this.h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.disegna();
  };

  Onda.prototype.segnale = function (x, t) {
    // Somma di sinusoidi con un inviluppo a sette colpi.
    var s = this.seme;
    var colpi = Math.pow(Math.abs(Math.sin(x * 7 * Math.PI + t * 0.6)), 6);
    return (
      Math.sin(x * 23 + t * 2.1 + s) * 0.45 +
      Math.sin(x * 61 - t * 3.3 + s * 2) * 0.2 +
      Math.sin(x * 7 + t * 0.7) * 0.25
    ) * (0.35 + 0.65 * colpi);
  };

  Onda.prototype.disegna = function () {
    var ctx = this.ctx, w = this.w, h = this.h, mezzo = h / 2;
    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = this.colori[2];
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (var g = 0; g <= w; g += 24) { ctx.moveTo(g + 0.5, 0); ctx.lineTo(g + 0.5, h); }
    ctx.moveTo(0, mezzo + 0.5); ctx.lineTo(w, mezzo + 0.5);
    ctx.stroke();

    var tracce = [
      { col: this.colori[1], amp: 0.3, sfasa: 1.7, spessore: 1, alfa: 0.55 },
      { col: this.colori[0], amp: 0.42, sfasa: 0, spessore: 1.6, alfa: 1 }
    ];
    for (var k = 0; k < tracce.length; k++) {
      var tr = tracce[k];
      ctx.globalAlpha = tr.alfa;
      ctx.strokeStyle = tr.col;
      ctx.lineWidth = tr.spessore;
      ctx.beginPath();
      for (var x = 0; x <= w; x += 2) {
        var y = mezzo + this.segnale(x / w, this.t + tr.sfasa) * h * tr.amp;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };

  var onde = [];
  document.querySelectorAll("canvas[data-onda]").forEach(function (c) { onde.push(new Onda(c)); });
  if (!onde.length) return;

  if ("ResizeObserver" in window) {
    var ro = new ResizeObserver(function (voci) {
      voci.forEach(function (v) {
        onde.forEach(function (o) { if (o.c === v.target) o.misura(); });
      });
    });
    onde.forEach(function (o) { ro.observe(o.c); });
  } else {
    window.addEventListener("resize", function () { onde.forEach(function (o) { o.misura(); }); });
  }

  if (ridotto) return;

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (voci) {
      voci.forEach(function (v) {
        onde.forEach(function (o) { if (o.c === v.target) o.visibile = v.isIntersecting; });
      });
    });
    onde.forEach(function (o) { io.observe(o.c); });
  }

  var prima = null;
  function ciclo(ora) {
    var dt = prima == null ? 0 : Math.min(0.05, (ora - prima) / 1000);
    prima = ora;
    onde.forEach(function (o) {
      if (!o.visibile || document.hidden) return;
      o.t += dt;
      o.disegna();
    });
    requestAnimationFrame(ciclo);
  }
  requestAnimationFrame(ciclo);
})();
