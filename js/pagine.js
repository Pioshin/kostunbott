(function () {
  var KB = window.KB;
  var el = KB.el;
  var ridotto = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function stelle(n) {
    return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);
  }

  var imgProdotto = KB.immagine;

  /* ---------- collezione ---------- */
  function home() {
    var g = document.getElementById("griglia");
    if (!g) return;
    KB.PRODOTTI.forEach(function (p) { g.appendChild(KB.card(p)); });
    var saldi = document.getElementById("saldi");
    if (saldi) saldi.addEventListener("click", function () {
      KB.toast("Saldi di domani applicati ai prezzi di ieri. Tornate ieri.");
    });
  }

  /* ---------- scheda prodotto ---------- */
  function prodotto() {
    var host = document.getElementById("scheda");
    var id = new URLSearchParams(location.search).get("id");
    var p = id ? KB.trova(id) : null;

    if (!p) {
      document.title = "Capo non trovato · Kostunbott";
      var box = el("div", "pagina-testo");
      box.appendChild(el("p", "mono", "ERRORE 404 · MODULO Z-99Z"));
      box.appendChild(el("h1", null, "Questo capo si è perso in una tasca"));
      box.appendChild(el("p", null,
        "Il prodotto richiesto è finito in una delle innumerevoli e insondabili tasche del Kostunbott. " +
        "Le tasche restituiscono gli oggetti in ordine non garantito, di solito il Giobedì successivo."));
      var torna = el("a", "btn", "Torna alla collezione");
      torna.href = "index.html";
      box.appendChild(torna);
      host.appendChild(box);
      return;
    }

    document.title = p.nome + " · Kostunbott";
    var d = el("div", "dettaglio");

    var colImg = el("div", "hero-img");
    colImg.appendChild(imgProdotto(p));
    if (p.esaurito) colImg.appendChild(el("span", "tag-esaurito", "Esaurito"));
    d.appendChild(colImg);

    var info = el("div");
    info.appendChild(el("p", "mono", "Collezione Terrax · Rif. " + p.id.toUpperCase()));
    info.appendChild(el("h1", null, p.nome));
    var pr = el("p", "prezzo");
    if (p.prezzoBarrato) pr.appendChild(el("s", null, KB.prezzo(p.prezzoBarrato)));
    pr.appendChild(document.createTextNode(KB.prezzo(p.prezzo)));
    info.appendChild(pr);
    info.appendChild(el("p", null, p.descrizione));

    var ul = el("ul", "specifiche");
    p.specifiche.forEach(function (s) { ul.appendChild(el("li", null, s)); });
    info.appendChild(ul);

    var riga = el("div", "riga-acquisto");
    if (p.esaurito) {
      info.appendChild(el("p", "avviso",
        "Esaurito dal Torneo Mondiale di Disappunto. Iscrivendosi alla lista d'attesa riceverete il vostro numero di posizione."));
      var attesa = el("button", "btn", "Lista d'attesa");
      attesa.type = "button";
      attesa.addEventListener("click", function () {
        KB.toast("Siete il numero: INFINITO");
        attesa.textContent = "In lista · posizione ∞";
        attesa.disabled = true;
      });
      riga.appendChild(attesa);
    } else {
      var lab = el("label", "sr-only", "Taglia");
      lab.htmlFor = "taglia";
      var sel = el("select");
      sel.id = "taglia";
      KB.TAGLIE.forEach(function (t) {
        var o = el("option", null, t);
        o.value = t;
        sel.appendChild(o);
      });
      var agg = el("button", "btn", "Aggiungi al carrello");
      agg.type = "button";
      agg.addEventListener("click", function () {
        if (KB.carrello.aggiungi(p.id, sel.value)) KB.toast("Aggiunto: " + p.nome + " · " + sel.value);
      });
      riga.appendChild(lab);
      riga.appendChild(sel);
      riga.appendChild(agg);
    }
    info.appendChild(riga);

    if (p.interesse) {
      var int = el("div", "avviso");
      int.appendChild(el("p", null,
        "Produzione in attesa di approvazione da parte del Consiglio Galattico dei Tessuti. " +
        "Se vi interessa davvero, fatecelo sapere: il Consiglio si convince solo con i numeri."));
      var bInt = el("button", "btn secondario", "Mi interessa");
      bInt.type = "button";
      bInt.addEventListener("click", function () {
        KB.toast("Interesse annotato nel registro karmico (solo sul vostro dispositivo)");
        bInt.textContent = "Interesse annotato";
        bInt.disabled = true;
      });
      int.appendChild(bInt);
      info.appendChild(int);
    }

    d.appendChild(info);
    host.appendChild(d);

    var rec = el("section", "sezione");
    rec.setAttribute("aria-labelledby", "titolo-recensioni");
    var h = el("h2", null, "Recensioni verificate (più o meno)");
    h.id = "titolo-recensioni";
    rec.appendChild(h);
    var lista = el("div", "recensioni");
    p.recensioni.forEach(function (r) {
      var box = el("div", "recensione");
      var s = el("div", "stelle", stelle(r.stelle));
      s.setAttribute("aria-label", r.stelle + " stelle su 5");
      box.appendChild(s);
      box.appendChild(el("p", null, "«" + r.testo + "»"));
      box.appendChild(el("b", null, r.autore));
      lista.appendChild(box);
    });
    rec.appendChild(lista);
    host.appendChild(rec);
  }

  /* ---------- carrello ---------- */
  function carrello() {
    var host = document.getElementById("righe");

    function disegna() {
      host.textContent = "";
      var righe = KB.carrello.leggi();
      if (!righe.length) {
        var v = el("div", "vuoto");
        v.appendChild(el("p", null, "Il carrello è vuoto, come le tasche dopo un acquisto Kostunbott."));
        var a = el("a", "btn", "Vai alla collezione");
        a.href = "index.html";
        v.appendChild(a);
        host.appendChild(v);
        return;
      }

      var t = el("table", "tabella");
      var cap = el("caption", "sr-only", "Articoli nel carrello");
      t.appendChild(cap);
      var th = el("thead");
      var trh = el("tr");
      ["", "Articolo", "Quantità", "Subtotale", ""].forEach(function (s, i) {
        var c = el("th", null, s);
        c.scope = "col";
        if (i === 0) c.appendChild(el("span", "sr-only", "Immagine"));
        if (i === 4) c.appendChild(el("span", "sr-only", "Azioni"));
        trh.appendChild(c);
      });
      th.appendChild(trh);
      t.appendChild(th);

      var tb = el("tbody");
      righe.forEach(function (r, i) {
        var p = KB.trova(r.id);
        if (!p) return;
        var tr = el("tr");
        var c0 = el("td");
        var im = imgProdotto(p);
        im.alt = "";
        c0.appendChild(im);
        tr.appendChild(c0);

        var c1 = el("td");
        var link = el("a", null, p.nome);
        link.href = "prodotto.html?id=" + encodeURIComponent(p.id);
        c1.appendChild(link);
        c1.appendChild(el("div", "mono", "Taglia: " + r.taglia));
        tr.appendChild(c1);

        var c2 = el("td");
        var q = el("div", "qta");
        var meno = el("button", null, "−");
        meno.type = "button";
        meno.setAttribute("aria-label", "Diminuisci quantità di " + p.nome);
        meno.addEventListener("click", function () { KB.carrello.cambiaQta(i, -1); });
        var n = el("span", "mono", String(r.qta));
        n.setAttribute("aria-live", "polite");
        var piu = el("button", null, "+");
        piu.type = "button";
        piu.setAttribute("aria-label", "Aumenta quantità di " + p.nome);
        piu.addEventListener("click", function () { KB.carrello.cambiaQta(i, 1); });
        q.appendChild(meno); q.appendChild(n); q.appendChild(piu);
        c2.appendChild(q);
        tr.appendChild(c2);

        tr.appendChild(el("td", "prezzo", KB.prezzo(p.prezzo * r.qta)));

        var c4 = el("td");
        var rm = el("button", "link-btn", "Rimuovi");
        rm.type = "button";
        rm.setAttribute("aria-label", "Rimuovi " + p.nome);
        rm.addEventListener("click", function () { KB.carrello.rimuovi(i); });
        c4.appendChild(rm);
        tr.appendChild(c4);
        tb.appendChild(tr);
      });
      t.appendChild(tb);
      host.appendChild(t);

      host.appendChild(el("p", "totale", "Totale: " + KB.prezzo(KB.carrello.totale())));
      var azioni = el("div", "riga-acquisto");
      var sv = el("button", "btn secondario", "Svuota carrello");
      sv.type = "button";
      sv.addEventListener("click", function () {
        KB.carrello.svuota();
        KB.toast("Carrello svuotato. Il disappunto resta.");
      });
      var co = el("a", "btn", "Procedi al checkout");
      co.href = "checkout.html";
      azioni.appendChild(sv);
      azioni.appendChild(co);
      host.appendChild(azioni);
    }

    document.addEventListener("kb:carrello", disegna);
    disegna();
  }

  /* ---------- checkout ---------- */
  function checkout() {
    var passi = document.querySelectorAll(".passo");
    var vuoto = document.getElementById("checkout-vuoto");
    if (!KB.carrello.conta()) {
      vuoto.hidden = false;
      return;
    }

    function mostra(n) {
      passi.forEach(function (p) { p.hidden = p.getAttribute("data-passo") !== String(n); });
      var attivo = document.querySelector('.passo[data-passo="' + n + '"]');
      var tit = attivo.querySelector("h2");
      tit.setAttribute("tabindex", "-1");
      tit.focus();
      if (n === 1) passoKarma();
      if (n === 2) passoEula();
      if (n === 4) passoPagamento();
    }

    document.getElementById("riepilogo").textContent =
      KB.carrello.conta() + " articoli · " + KB.prezzo(KB.carrello.totale());

    // 1. verifica del karma
    function passoKarma() {
      var reg = document.getElementById("registro-karma");
      var avanti = document.getElementById("avanti-1");
      reg.textContent = "";
      avanti.disabled = true;
      var voci = [
        ["ok", "Connessione al registro karmico di Terrax"],
        ["ok", "Lettura delle azioni commesse negli ultimi 36.535 anni"],
        ["att", "Rilevata una pizza lasciata fredda di proposito"],
        ["ok", "Compensazione con 3 ticket di help desk chiusi senza imprecare"],
        ["att", "Saldo karmico: sufficiente, per un pelo"],
        ["ok", "Verifica completata. Il Consiglio vi osserva con moderata fiducia"]
      ];
      var i = 0;
      (function prossima() {
        if (i >= voci.length) { avanti.disabled = false; return; }
        var li = el("li", voci[i][0], voci[i][1]);
        reg.appendChild(li);
        i++;
        setTimeout(prossima, ridotto ? 0 : 550);
      })();
    }

    // 2. EULA
    var PAGINE_EULA = 36535;
    function passoEula() {
      var box = document.getElementById("eula");
      var cont = document.getElementById("pagina-eula");
      var cb = document.getElementById("accetto-eula");
      var avanti = document.getElementById("avanti-2");
      if (!box.childElementCount) {
        var clausole = [
          "Il presente Contratto di Licenza per l'Utente Finale (di seguito «il Contratto», «la Cosa» o «quel malloppo») disciplina l'acquisto, l'indossamento e il rimpianto relativi ai capi Kostunbott.",
          "L'Utente dichiara di aver letto per intero il Contratto presso la Sala di Lettura Volontaria dei Termini e Condizioni d'Uso (EULA), oppure di averlo fatto scorrere velocemente come chiunque altro.",
          "Le tasche del capo sono innumerevoli e insondabili. Kostunbott non risponde di oggetti smarriti al loro interno, compresi chiavi, crediti karmici, animali domestici e parenti di secondo grado.",
          "Il sistema autosottovuotante riduce il capo a un volume ridottissimo. La parola chiave di riespansione non verrà comunicata per iscritto. Kostunbott declina ogni responsabilità per capi nascosti negli scarichi.",
          "Il cavetto USB in dotazione si inserisce sempre al contrario. Tale comportamento è da considerarsi una caratteristica e non un difetto.",
          "L'efficacia del modulo di rifrazione è dichiarata al 50%. L'Utente che inciampa nella metà invisibile del proprio capo ne risponde personalmente.",
          "Qualsiasi cosa faccia la HUAZZAMERICANGIRLS, la fa in modo pericoloso e, con ogni probabilità, causando un sacco di ticket all'help desk. Kostunbott non ha alcun rapporto con la HUAZZAMERICANGIRLS, né intende averne.",
          "I Saldi di domani vengono applicati ai prezzi di ieri. Eventuali paradossi temporali derivanti dall'acquisto vanno segnalati alla Boutique del Paradosso entro il Vendolì precedente.",
          "La licenza d'uso del software di bordo è di tipo shareware. L'Utente si impegna a registrarla prima della scadenza, che potrebbe già essere avvenuta.",
          "Per tutto quanto non previsto dal presente Contratto si applica il principio generale della Galassia Ephemera: «Se non lo sai, FALLO!»."
        ];
        for (var k = 0; k < 3; k++) {
          clausole.forEach(function (c, j) {
            box.appendChild(el("p", null, "Art. " + (k * clausole.length + j + 1) + ". " + c));
          });
        }
        box.appendChild(el("p", "mono", "— Fine delle pagine visualizzabili. Le restanti 36.505 pagine sono consultabili presso la Sala di Lettura Volontaria dei Termini e Condizioni d'Uso, dove nessun essere senziente è mai entrato volontariamente. —"));
      }
      cb.checked = false;
      cb.disabled = true;
      avanti.disabled = true;

      function aggiorna() {
        var max = box.scrollHeight - box.clientHeight;
        var frazione = max > 0 ? box.scrollTop / max : 1;
        var pagina = Math.max(1, Math.ceil(frazione * PAGINE_EULA));
        cont.textContent = "Pagina " + pagina.toLocaleString("it-IT") + " di " + PAGINE_EULA.toLocaleString("it-IT");
        if (frazione > 0.98) cb.disabled = false;
      }
      box.addEventListener("scroll", aggiorna, { passive: true });
      cb.addEventListener("change", function () { avanti.disabled = !cb.checked; });
      aggiorna();
    }

    // 3. modulo H7-25: niente viene inviato
    var modulo = document.getElementById("modulo-h725");
    modulo.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!modulo.checkValidity()) { modulo.reportValidity(); return; }
      KB.toast("Modulo H7-25 timbrato (in un cassetto)");
      mostra(4);
    });

    // 4. pagamento karmiPay
    function passoPagamento() {
      var paga = document.getElementById("paga");
      var reg = document.getElementById("registro-paga");
      var blu = document.getElementById("schermata-blu");
      reg.textContent = "";
      blu.hidden = true;
      paga.disabled = false;
      paga.onclick = function () {
        paga.disabled = true;
        var voci = [
          ["ok", "Apertura del portafoglio karmiPay"],
          ["ok", "Conversione in crediti karmici al cambio di ieri"],
          ["att", "Controllo della licenza shareware del terminale…"]
        ];
        var i = 0;
        (function prossima() {
          if (i < voci.length) {
            reg.appendChild(el("li", voci[i][0], voci[i][1]));
            i++;
            setTimeout(prossima, ridotto ? 0 : 700);
            return;
          }
          blu.hidden = false;
          blu.setAttribute("tabindex", "-1");
          blu.focus();
        })();
      };
    }

    document.getElementById("avanti-1").addEventListener("click", function () { mostra(2); });
    document.getElementById("avanti-2").addEventListener("click", function () { mostra(3); });
    mostra(1);
  }

  /* ---------- assistenza ---------- */
  function normalizza(s) {
    return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
  }

  function assistenza() {
    var f = document.getElementById("modulo-ticket");
    var esito = document.getElementById("esito-ticket");
    var argomento = document.getElementById("t-argomento");
    var boxDesc = document.getElementById("box-descrizione");
    var desc = document.getElementById("t-descrizione");
    var boxEsp = document.getElementById("box-espansione");
    var esp = document.getElementById("t-espansione");
    var segreto = window.KB_SEGRETO || {};
    var errori = 0;

    function modoEspansione() {
      return segreto.attivo && argomento.value === "Sottovuoto";
    }

    argomento.addEventListener("change", function () {
      var on = modoEspansione();
      boxDesc.hidden = on;
      desc.required = !on;
      boxEsp.hidden = !on;
      esp.required = on;
      esito.hidden = true;
      if (on) esp.focus();
    });

    function mostraEsito(righe) {
      esito.textContent = "";
      righe.forEach(function (r) { esito.appendChild(el("p", r[0], r[1])); });
      esito.hidden = false;
    }

    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }

      if (modoEspansione()) {
        if (normalizza(esp.value) === normalizza(segreto.parola)) {
          document.body.classList.add("pop");
          KB.toast("*pop* idraulico");
          mostraEsito([[null, "Password accettata. Riespansione in corso…"]]);
          setTimeout(function () { location.href = segreto.pagina; }, ridotto ? 0 : 1100);
          return;
        }
        errori++;
        var righe = [[null, "Password di espansione errata. Il giubbotto resta sottovuoto."]];
        if (errori >= 3) righe.push(["mono", "Suggerimento dell'help desk: la parola va pronunciata con convinzione, come in cabina 237."]);
        mostraEsito(righe);
        esp.select();
        return;
      }

      var n = "#237-" + String(Math.floor(1000 + Math.random() * 9000));
      esito.textContent = "";
      esito.appendChild(el("p", null, "Ticket " + n + " aperto con successo."));
      esito.appendChild(el("p", null, "Posizione in coda: ∞. Tempo di risposta stimato: al terzo tentativo."));
      esito.appendChild(el("p", "mono", "Il ticket non è stato inviato a nessuno. È l'help desk più onesto della Galassia."));
      esito.hidden = false;
      f.reset();
    });
  }

  /* ---------- pagina nascosta ---------- */
  function segreta() {
    var video = (window.KB_SEGRETO || {}).video;
    if (!video) return;
    var box = document.getElementById("trasmissione");
    box.textContent = "";
    box.appendChild(el("p", null, "Trasmissione autorizzata. Il messaggio che segue è riservato a chi è arrivato fin qui."));
    var a = el("a", "btn", "Apri la trasmissione");
    a.href = video;
    a.target = "_blank";
    a.rel = "noopener";
    box.appendChild(a);
  }

  var PAGINE = { home: home, prodotto: prodotto, carrello: carrello, checkout: checkout, assistenza: assistenza, segreta: segreta };
  var pagina = document.body.getAttribute("data-pagina");
  if (PAGINE[pagina]) PAGINE[pagina]();
})();
