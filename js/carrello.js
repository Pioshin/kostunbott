(function () {
  var CHIAVE = "kostunbott.carrello";
  var inMemoria = [];

  function leggi() {
    try {
      var g = localStorage.getItem(CHIAVE);
      if (g) {
        var v = JSON.parse(g);
        if (Array.isArray(v)) return v.filter(function (r) { return window.KB.trova(r.id); });
      }
    } catch (e) {
      return inMemoria;
    }
    return inMemoria;
  }

  function scrivi(righe) {
    inMemoria = righe;
    try {
      localStorage.setItem(CHIAVE, JSON.stringify(righe));
    } catch (e) {
      /* archiviazione non disponibile: si resta in memoria */
    }
    document.dispatchEvent(new CustomEvent("kb:carrello"));
  }

  function aggiungi(id, taglia) {
    var p = window.KB.trova(id);
    if (!p || p.esaurito) return false;
    var righe = leggi().slice();
    for (var i = 0; i < righe.length; i++) {
      if (righe[i].id === id && righe[i].taglia === taglia) {
        righe[i].qta += 1;
        scrivi(righe);
        return true;
      }
    }
    righe.push({ id: id, taglia: taglia, qta: 1 });
    scrivi(righe);
    return true;
  }

  function cambiaQta(indice, delta) {
    var righe = leggi().slice();
    if (!righe[indice]) return;
    righe[indice].qta += delta;
    if (righe[indice].qta < 1) righe.splice(indice, 1);
    scrivi(righe);
  }

  function rimuovi(indice) {
    var righe = leggi().slice();
    righe.splice(indice, 1);
    scrivi(righe);
  }

  function svuota() {
    scrivi([]);
  }

  function conta() {
    return leggi().reduce(function (s, r) { return s + r.qta; }, 0);
  }

  function totale() {
    return leggi().reduce(function (s, r) {
      var p = window.KB.trova(r.id);
      return s + (p ? p.prezzo * r.qta : 0);
    }, 0);
  }

  window.KB.carrello = { leggi: leggi, aggiungi: aggiungi, cambiaQta: cambiaQta, rimuovi: rimuovi, svuota: svuota, conta: conta, totale: totale };
})();
