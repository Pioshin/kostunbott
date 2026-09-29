(function () {
  var KB = window.KB;
  var el = KB.el;

  var NAV = [
    ["index.html", "Collezione"],
    ["torneo.html", "Il Torneo"],
    ["assistenza.html", "Assistenza"]
  ];

  var SLOGAN = [
    "Kostunbott: indossa il disappunto",
    "Campione assoluto: 72 ore, record battuto di 42 minuti",
    "Saldi di domani applicati ai prezzi di ieri",
    "Spedizione in tutta la Galassia Ephemera",
    "Ora con il 50% di invisibilità",
    "Innumerevoli e insondabili tasche",
    "Se non lo sai, FALLO! (ma con stile)",
    "Accettiamo karmiPay e crediti karmici"
  ];

  function paginaCorrente() {
    var f = location.pathname.split("/").pop();
    return f || "index.html";
  }

  function costruisciTestata() {
    var host = document.getElementById("testata");
    if (!host) return;
    host.className = "testata";
    var barra = el("div", "barra-annunci", "Anno 36535 dalla Secessione Spaziale · Spedizione gratuita entro 46 Giga-anni luce (e mezzo, se svolti alla seconda luna di Peta415)");
    host.appendChild(barra);

    var cont = el("div", "contenitore testata-int");
    var marchio = el("a", "marchio");
    marchio.href = "index.html";
    marchio.setAttribute("aria-label", "Kostunbott, pagina iniziale");
    var logo = el("img");
    logo.src = KB.IMG.logo;
    logo.alt = "";
    logo.width = 44;
    logo.height = 44;
    marchio.appendChild(logo);
    var nome = el("span", "marchio-nome");
    nome.appendChild(el("b", null, "Kostunbott"));
    nome.appendChild(el("small", null, "Terrax outerwear division"));
    marchio.appendChild(nome);
    cont.appendChild(marchio);

    var nav = el("nav", "nav");
    nav.setAttribute("aria-label", "Principale");
    NAV.forEach(function (v) {
      var a = el("a", null, v[1]);
      a.href = v[0];
      if (v[0] === paginaCorrente()) a.setAttribute("aria-current", "page");
      nav.appendChild(a);
    });
    cont.appendChild(nav);

    var carr = el("a", "carrello-link");
    carr.href = "carrello.html";
    carr.appendChild(document.createTextNode("Carrello "));
    var b = el("span", "badge", "0");
    b.setAttribute("data-conta", "");
    carr.appendChild(b);
    cont.appendChild(carr);
    host.appendChild(cont);
    aggiornaBadge();
  }

  function aggiornaBadge() {
    var n = String(KB.carrello.conta());
    document.querySelectorAll("[data-conta]").forEach(function (e) { e.textContent = n; });
  }

  function costruisciTicker() {
    var host = document.getElementById("ticker");
    if (!host) return;
    host.className = "ticker";
    host.setAttribute("aria-hidden", "true");
    var pista = el("div", "ticker-pista");
    SLOGAN.concat(SLOGAN).forEach(function (s) { pista.appendChild(el("span", null, s)); });
    host.appendChild(pista);
  }

  function costruisciPiede() {
    var host = document.getElementById("piede");
    if (!host) return;
    host.className = "piede";
    var cont = el("div", "contenitore");
    var griglia = el("div", "piede-griglia");

    var c1 = el("div");
    c1.appendChild(el("h4", null, "Kostunbott®"));
    c1.appendChild(el("p", null, "Capi tecnici di lusso per Umanidi, Spaziali e Spaziali rotti. Dal Torneo Mondiale di Disappunto alla vostra spalla."));
    griglia.appendChild(c1);

    var c2 = el("div");
    c2.appendChild(el("h4", null, "Esplora"));
    var ul = el("ul");
    NAV.concat([["carrello.html", "Carrello"]]).forEach(function (v) {
      var li = el("li");
      var a = el("a", null, v[1]);
      a.href = v[0];
      li.appendChild(a);
      ul.appendChild(li);
    });
    c2.appendChild(ul);
    griglia.appendChild(c2);

    var c3 = el("div");
    c3.appendChild(el("h4", null, "Pagamenti"));
    c3.appendChild(el("p", null, "karmiPay · crediti karmici · Bronze Minus Card"));
    griglia.appendChild(c3);

    cont.appendChild(griglia);
    cont.appendChild(el("p", "finzione",
      "Kostunbott® è un marchio immaginario tratto dal romanzo «Galactic Powder Ephemera». " +
      "Questo sito è un'opera di finzione: nessun acquisto è reale, nessun pagamento viene elaborato, nessun dato viene raccolto o inviato. " +
      "Nessun cavetto USB è stato inserito correttamente durante la realizzazione."));
    host.appendChild(cont);
  }

  function toast(testo) {
    var t = document.getElementById("toast");
    if (!t) {
      t = el("div", "toast");
      t.id = "toast";
      t.setAttribute("role", "status");
      document.body.appendChild(t);
    }
    t.textContent = testo;
    t.classList.add("visibile");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove("visibile"); }, 2400);
  }
  KB.toast = toast;

  function easterEgg() {
    // Parola chiave di riespansione del Kostunbott (POST 23).
    var parola = "azghebepnai";
    var buffer = "";
    document.addEventListener("keydown", function (e) {
      var tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key.length !== 1) return;
      buffer = (buffer + e.key.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")).slice(-parola.length);
      if (buffer === parola) {
        buffer = "";
        document.body.classList.add("pop");
        toast("*pop* idraulico");
        setTimeout(function () { document.body.classList.remove("pop"); }, 800);
      }
    });
  }

  document.addEventListener("kb:carrello", aggiornaBadge);
  costruisciTestata();
  costruisciTicker();
  costruisciPiede();
  easterEgg();
})();
