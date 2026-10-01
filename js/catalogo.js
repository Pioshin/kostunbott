(function () {
  // Immagini: logo dal retro di copertina, Hector dai fogli "HectorCinema" e "Hector FinalOK".
  var IMG = {
    logo: "assets/logo-emblema.webp",
    fronte: "assets/hector-fronte.jpg",
    retro: "assets/hector-retro.jpg",
    primo: "assets/hector-primo-piano.jpg",
    studioFronte: "assets/studio-fronte.jpg",
    studioRetro: "assets/studio-retro.jpg",
    studioPrimo: "assets/studio-primo-piano.jpg",
    studioProfilo: "assets/studio-profilo.jpg",
    cavetto: "assets/cavetto.svg",
    pendolo: "assets/pendolo.svg",
    maglietta: "assets/maglietta.jpg"
  };

  var TAGLIE = ["Umanide S", "Umanide M", "Umanide L", "Spaziale", "Spaziale rotto"];

  // Testi basati sul manoscritto; il numero tra parentesi nei commenti è il POST.
  var PRODOTTI = [
    {
      id: "mk1-disappunto",
      nome: "Kostunbott Mk I «Disappunto»",
      sotto: "Il premio del Torneo Mondiale di Disappunto. Non si compra: si vince.",
      prezzo: 72000,
      prezzoBarrato: 144000,
      esaurito: true,
      img: "studioFronte",
      descrizione:
        "Il capostipite, assegnato al campione assoluto del Torneo Mondiale di Disappunto: 72 ore di espressione facciale immutabile, " +
        "42 minuti in più del precedente record di 71 ore e 18 minuti. Eventuali paresi del sopracciglio destro non sono coperte da garanzia.", // 5
      specifiche: [
        "Pelle Terraxiana multi-tasche, giudicata «discutibile» dalle forze speciali Spaziali", // 32
        "Innumerevoli e insondabili tasche", // 30, 66
        "Toppa dorsale sbiadita «Nosce te ipsum, baby!», da leggere come manifesto esistenziale", // 30
        "Taschino per pendolo di alluminio riciclato", // 41, 68
        "Profumo di serie: silicio caldo ed elettronica stanca; in situazioni di tensione, cuoio e panico" // 30, 33
      ],
      recensioni: [
        { autore: "H. Starborne, tecnico dell'Help Desk", stelle: 5, testo: "Ne esiste uno solo e ce l'ho io. Il sopracciglio è rimasto in posizione da gara." },
        { autore: "Agente Spaziale (anonimo)", stelle: 1, testo: "Discutibile giubbotto di pelle Terraxiana multi-tasche. Chi lo indossa è certamente colpevole di qualcosa." }
      ]
    },
    {
      id: "mk2-antiborseggio",
      nome: "Kostunbott Mk II Antiborseggio",
      sotto: "Il tessuto diventa rigido come il titanio. Il borseggiatore deruba se stesso.",
      prezzo: 48500,
      img: "studioPrimo",
      descrizione:
        "Sensori di prossimità che curvano lo spazio locale: la mano del borseggiatore finisce nella tasca del borseggiatore. " +
        "Collaudato tra i bazar fluttuanti di Malaffare: quarantotto tentativi sventati in cinquanta metri, mentre il cliente ammirava le lanterne.", // 41
      specifiche: [
        "Tessuto a irrigidimento istantaneo, classe titanio",
        "Micro-scariche elettrostatiche repellenti",
        "Ologrammi di formiche carnivore proiettati sulle dita indiscrete",
        "Sibili idraulici di disappunto dopo ogni borseggio sventato" // 45
      ],
      recensioni: [
        { autore: "Mercante di tappeti fluttuanti, Malaffare", stelle: 1, testo: "Mi sono derubato il portafogli da solo. Non so ancora come sentirmi." },
        { autore: "Cliente verificato (karma 3/10)", stelle: 5, testo: "Camminavo beato. Intorno a me un'epopea di dita tese e imprecazioni in dialetto locale." }
      ]
    },
    {
      id: "protocollo-tergicristallo",
      nome: "Kostunbott Protocollo Tergicristallo",
      sotto: "Con l'umidità spuntano due spazzole sulle spalle. Ritmo a terzina.",
      prezzo: 39900,
      img: "studioRetro",
      descrizione:
        "Pensato per le nebbie giallognole di Malaffare: al primo accenno di umidità il capo attiva il Protocollo Tergicristallo " +
        "e due piccole spazzole meccaniche iniziano a lavorare sulle spalle, a ritmo di terzina.", // 47
      specifiche: [
        "Due spazzole meccaniche a scomparsa sulle spalle",
        "Cadenza a terzina, non modificabile (abbiamo provato)",
        "Spalla idrorepellente, adatta anche ad abbracci liberatori", // 69
        "Residui energetici del tessuto potenzialmente ionizzanti nelle pozzanghere chimiche" // 47
      ],
      recensioni: [
        { autore: "Passante, Malaffare", stelle: 4, testo: "Funziona. Il mio cane ora mi segue a distanza di sicurezza." }
      ]
    },
    {
      id: "sottovuoto",
      nome: "Kostunbott Sottovuoto",
      sotto: "Si riduce a un volume minimo. Si riespande con la parola chiave.",
      prezzo: 52000,
      img: "studioProfilo",
      effetto: "sottovuoto",
      descrizione:
        "Grazie al sistema autosottovuotante integrato il capo assume un volume ridottissimo: un vero prodigio di occultamento, " +
        "collaudato nello scarico di una cabina di lusso. Il ritorno al volume originale avviene con un «pop» idraulico.", // 23
      specifiche: [
        "Sistema autosottovuotante integrato",
        "Riespansione a parola chiave, che per ragioni di sicurezza non viene comunicata per iscritto",
        "Valvola di scarico dal fischio simile a un merlo stonato", // 31
        "Chiusura a doppia mandata" // 67
      ],
      recensioni: [
        { autore: "Passeggero, Celestial Voyager Lines", stelle: 5, testo: "L'ho nascosto in un posto inconfessabile. Zero problemi. Un po' di odore, ma di lusso." }
      ]
    },
    {
      id: "rifrazione-50",
      nome: "Kostunbott Rifrazione 50%",
      sotto: "Invisibile al 50%. Si consiglia di non inciampare nell'altra metà.",
      prezzo: 61000,
      img: "fronte",
      effetto: "rifrazione",
      descrizione:
        "Per chi ha bisogno di sparire a metà. L'efficacia è dichiarata al 50%: la metà invisibile del capo resta comunque presente, " +
        "e ci si inciampa con facilità.", // 37
      specifiche: [
        "Rifrazione selettiva al 50%, cifra tonda per correttezza commerciale",
        "Metà visibile garantita",
        "Non si applica ai sensori olfattivi",
        "Sconsigliato durante i furti interplanetari di droidi di porcellana" // 37
      ],
      recensioni: [
        { autore: "Un ospite della Singolarità", stelle: 3, testo: "Metà del problema risolta. L'altra metà mi ha visto benissimo." }
      ]
    },
    {
      id: "maglietta-nosce",
      nome: "Maglietta «Nosce te ipsum, baby!»",
      sotto: "La citazione della toppa dorsale, su cotone di pianeta non dichiarato.",
      prezzo: 7700,
      img: "maglietta",
      interesse: true,
      descrizione:
        "Per chi non può permettersi un Kostunbott ma vuole comunque conoscere se stesso. KNOW THY SELF, come urlava qualcuno " + // 50
        "a occhi chiusi indicando la propria schiena.",
      specifiche: [
        "Emblema Kostunbott sul petto",
        "Sulla schiena «Nosce te ipsum, baby!» e il circuito del retro di copertina",
        "Cotone certificato da un ente che nessuno ha mai visto",
        "Lavabile a 36.535 gradi (consigliamo di non verificare)",
        "Non contiene tasche: è un limite, lo sappiamo"
      ],
      recensioni: [
        { autore: "Lettore, Sabedì mattina", stelle: 5, testo: "L'ho indossata e mi sono conosciuto. Non so se ne sono felice." }
      ]
    },
    {
      id: "cavetto-usb",
      nome: "Cavetto USB di servizio",
      sotto: "Si inserisce sempre al contrario. Al terzo tentativo, la fisica si arrende.",
      prezzo: 890,
      img: "cavetto",
      descrizione:
        "Pende dal giubbotto come un intrico di fili che ricorda un nido di uccelli elettrici. Lo si inserisce al contrario, lo si gira, " +
        "è ancora al contrario: al terzo tentativo la fisica quantistica si arrende e il connettore entra.", // 25
      specifiche: [
        "Compatibile con serrature, porte di servizio e terminali sospetti", // 35, 47
        "Inserimento corretto garantito al terzo tentativo",
        "Inefficace sui Pelandroidi (respinge a tre metri)" // 61
      ],
      recensioni: [
        { autore: "Tecnico, Help Desk di Terrax", stelle: 5, testo: "Non è il cavetto: sono io. Ma è anche il cavetto." }
      ]
    },
    {
      id: "pendolo-riciclato",
      nome: "Pendolo di alluminio riciclato",
      sotto: "Per assoggettare i robot con la sola forza dell'ipnosi. Forse.",
      prezzo: 1490,
      img: "pendolo",
      descrizione:
        "Ispirato al metodo del paragnosta Juke Ashkas Hellà, che nella puntata più iconica di Computation Island " +
        "alterò le sorti della partita ipnotizzando il concorrente Andro. Da estrarre dal taschino al momento giusto.", // 68
      specifiche: [
        "Alluminio riciclato al 100%",
        "Si ripone nell'apposito taschino del Kostunbott",
        "Formula d'uso consigliata: «It's showtime!»",
        "Risultati non garantiti su droidi che non guardano la TV"
      ],
      recensioni: [
        { autore: "Cliente anonimo", stelle: 4, testo: "Non ha funzionato sul barista. Ha funzionato sul suo terminale." }
      ]
    }
  ];

  function trova(id) {
    for (var i = 0; i < PRODOTTI.length; i++) if (PRODOTTI[i].id === id) return PRODOTTI[i];
    return null;
  }

  function prezzo(n) {
    return n.toLocaleString("it-IT") + " CK";
  }

  function el(tag, cls, testo) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (testo != null) e.textContent = testo;
    return e;
  }

  function immagine(p) {
    var img = el("img", p.effetto ? "effetto-" + p.effetto : null);
    img.src = IMG[p.img];
    img.alt = p.nome;
    return img;
  }

  function card(p) {
    var a = el("a", "card");
    a.href = "prodotto.html?id=" + encodeURIComponent(p.id);
    var boxImg = el("div", "img");
    var img = immagine(p);
    img.loading = "lazy";
    boxImg.appendChild(img);
    if (p.esaurito) boxImg.appendChild(el("span", "tag-esaurito", "Esaurito"));
    var corpo = el("div", "corpo");
    corpo.appendChild(el("h3", null, p.nome));
    corpo.appendChild(el("div", "sotto", p.sotto));
    var pr = el("div", "prezzo");
    if (p.prezzoBarrato) pr.appendChild(el("s", null, prezzo(p.prezzoBarrato)));
    pr.appendChild(document.createTextNode(prezzo(p.prezzo)));
    corpo.appendChild(pr);
    a.appendChild(boxImg);
    a.appendChild(corpo);
    return a;
  }

  window.KB = window.KB || {};
  window.KB.IMG = IMG;
  window.KB.TAGLIE = TAGLIE;
  window.KB.PRODOTTI = PRODOTTI;
  window.KB.trova = trova;
  window.KB.prezzo = prezzo;
  window.KB.el = el;
  window.KB.immagine = immagine;
  window.KB.card = card;
})();
