/* BFMiDi · Manual do Usuário — motor da SPA
   Navegação por hash (#secao ou #secao/card), busca por palavras-chave,
   sidebar responsiva e popups (i) por campo. Sem dependências externas. */

"use strict";

(function () {
  const $ = (sel, root) => (root || document).querySelector(sel);
  const main = $("#mnMain");
  const sidebarInner = $("#mnSidebarInner");
  const sidebar = $("#mnSidebar");
  const sidebarBackdrop = $("#mnSidebarBackdrop");
  const burger = $("#mnBurger");
  const searchInput = $("#mnSearch");
  const searchPop = $("#mnSearchPop");
  const modalBackdrop = $("#mnModalBackdrop");
  const modalTitle = $("#mnModalTitle");
  const modalBody = $("#mnModalBody");
  const modalCrumb = $("#mnModalCrumb");

  // Resolvido por idioma em applyContentLang() (logo após mnLang ser definido).
  // Começa apontando para a árvore crua (folhas {pt,en,es}); só é usado após
  // applyContentLang(), que roda antes do primeiro route().
  let SECTIONS = MN_CONTENT.sections;

  /* ───────────────────── i18n (interface) ─────────────────────
     A CASCA do manual (topbar, sidebar, rótulos de bloco, busca,
     paginação) é traduzida via MN_UI/t(). O CONTEÚDO dos cards
     (títulos/textos/campos em content.js) é traduzido via lang-maps
     {pt,en,es} resolvidas por resolveLang()/applyContentLang(). t()
     e resolveLang() caem no PT como fallback. */
  const MN_LANGS = ["pt", "en", "es"];
  const LANG_HTML = { pt: "pt-BR", en: "en", es: "es" };
  const MN_UI = {
    pt: {
      home: "Início",
      searchPlaceholder: "Buscar no manual…",
      searchAria: "Buscar no manual",
      burgerTitle: "Índice",
      burgerOpenAria: "Abrir índice",
      brandAria: "Início do manual",
      modalCloseAria: "Fechar",
      topicOne: "tópico",
      topicMany: "tópicos",
      topicsHere: "Tópicos desta seção",
      prev: "Anterior",
      next: "Próxima",
      howToUse: "Como usar",
      whatEachField: "O que é cada campo",
      notesLimits: "Observações e limitações",
      exampleMeta: "EXEMPLO",
      previewReal: "Como aparece no app — prévia em CSS do card real",
      previewStomp: "Como aparece no app — card real do modo STOMP",
      previewMode: "Como aparece no app — card real do modo {m}",
      noDescription: "Sem descrição.",
      nothingFound: "Nada encontrado para “{q}”.",
      sectionKind: "Seção",
      eyebrow: "BFMIDI · CONTROLADORA MIDI",
      heroPre: "Manual do",
      heroAccent: "Usuário",
      docHome: "BFMiDi · Manual do Usuário",
      docSuffix: "· Manual BFMiDi",
      infoTitle: "O que é este campo?",
      infoAria: "Explicação do campo",
      cardAppFallback: "CARD DO APP",
      tagFieldTitle: "Ver explicação do campo {n}",
      tagFieldAria: "Explicação do campo {n}",
      themeLight: "Modo claro",
      themeDark: "Modo escuro",
      langTitle: "Idioma",
      langAria: "Trocar idioma",
      pageBasics: "Primeiros Passos",
      pageFull: "Manual Completo"
    },
    en: {
      home: "Home",
      searchPlaceholder: "Search the manual…",
      searchAria: "Search the manual",
      burgerTitle: "Index",
      burgerOpenAria: "Open index",
      brandAria: "Manual home",
      modalCloseAria: "Close",
      topicOne: "topic",
      topicMany: "topics",
      topicsHere: "Topics in this section",
      prev: "Previous",
      next: "Next",
      howToUse: "How to use",
      whatEachField: "What each field does",
      notesLimits: "Notes and limitations",
      exampleMeta: "EXAMPLE",
      previewReal: "How it looks in the app — CSS preview of the real card",
      previewStomp: "How it looks in the app — real STOMP mode card",
      previewMode: "How it looks in the app — real {m} mode card",
      noDescription: "No description.",
      nothingFound: "Nothing found for “{q}”.",
      sectionKind: "Section",
      eyebrow: "BFMIDI · MIDI CONTROLLER",
      heroPre: "User",
      heroAccent: "Manual",
      docHome: "BFMiDi · User Manual",
      docSuffix: "· BFMiDi Manual",
      infoTitle: "What is this field?",
      infoAria: "Field explanation",
      cardAppFallback: "APP CARD",
      tagFieldTitle: "See field {n} explanation",
      tagFieldAria: "Field {n} explanation",
      themeLight: "Light mode",
      themeDark: "Dark mode",
      langTitle: "Language",
      langAria: "Switch language",
      pageBasics: "Getting Started",
      pageFull: "Full Manual"
    },
    es: {
      home: "Inicio",
      searchPlaceholder: "Buscar en el manual…",
      searchAria: "Buscar en el manual",
      burgerTitle: "Índice",
      burgerOpenAria: "Abrir índice",
      brandAria: "Inicio del manual",
      modalCloseAria: "Cerrar",
      topicOne: "tema",
      topicMany: "temas",
      topicsHere: "Temas de esta sección",
      prev: "Anterior",
      next: "Siguiente",
      howToUse: "Cómo usar",
      whatEachField: "Qué hace cada campo",
      notesLimits: "Notas y limitaciones",
      exampleMeta: "EJEMPLO",
      previewReal: "Cómo se ve en la app — vista previa CSS de la tarjeta real",
      previewStomp: "Cómo se ve en la app — tarjeta real del modo STOMP",
      previewMode: "Cómo se ve en la app — tarjeta real del modo {m}",
      noDescription: "Sin descripción.",
      nothingFound: "No se encontró nada para «{q}».",
      sectionKind: "Sección",
      eyebrow: "BFMIDI · CONTROLADORA MIDI",
      heroPre: "Manual del",
      heroAccent: "Usuario",
      docHome: "BFMiDi · Manual del Usuario",
      docSuffix: "· Manual BFMiDi",
      infoTitle: "¿Qué es este campo?",
      infoAria: "Explicación del campo",
      cardAppFallback: "TARJETA DE LA APP",
      tagFieldTitle: "Ver explicación del campo {n}",
      tagFieldAria: "Explicación del campo {n}",
      themeLight: "Modo claro",
      themeDark: "Modo oscuro",
      langTitle: "Idioma",
      langAria: "Cambiar idioma",
      pageBasics: "Primeros Pasos",
      pageFull: "Manual Completo"
    }
  };
  let mnLang = (localStorage.getItem("mn-lang") || "").toLowerCase();
  if (!MN_LANGS.includes(mnLang)) mnLang = "pt";
  function t(key, vars) {
    let s = MN_UI[mnLang] && MN_UI[mnLang][key];
    if (s == null) s = MN_UI.pt[key];
    if (s == null) return key;
    if (vars) for (const k in vars) s = s.split("{" + k + "}").join(vars[k]);
    return s;
  }

  /* ─────────── i18n (CONTEÚDO dos cards — content.js) ───────────
     As strings traduzíveis em content.js viram objetos {pt,en,es}
     (uma "lang-map"). resolveLang() clona a árvore de seções trocando
     cada lang-map pela string do idioma atual; strings cruas (ids,
     mockType, kind, etc.) passam intactas. Assim o render continua
     lendo sec.title/card.purpose/... como string, sem mudar nada. */
  function isLangMap(o) {
    if (!o || typeof o !== "object" || Array.isArray(o)) return false;
    if (typeof o.pt !== "string") return false;
    for (const k in o) if (k !== "pt" && k !== "en" && k !== "es") return false;
    return true;
  }
  function pickLang(v) { return isLangMap(v) ? (v[mnLang] || v.pt) : v; }
  function resolveLang(node) {
    if (Array.isArray(node)) return node.map(resolveLang);
    if (node && typeof node === "object") {
      if (isLangMap(node)) return node[mnLang] || node.pt;
      const out = {};
      for (const k in node) out[k] = resolveLang(node[k]);
      return out;
    }
    return node;
  }
  function applyContentLang() {
    SECTIONS = MN_CONTENT.sections.map(resolveLang);
    buildSearchIndex();
  }

  /* ─────────── ícones das abas (SVGs reais do app.jsx) ─────────── */
  const MN_TAB_ICONS = {
    midi: '<svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle class="bf-tab-shape" cx="12" cy="12" r="8.5"/><path class="bf-tab-shape" d="M10.4 3.8 L13.6 3.8" stroke-width="1.8"/><circle class="bf-tab-fill" cx="5.8" cy="11.3" r="1.15"/><circle class="bf-tab-fill" cx="6.5" cy="15.4" r="1.15"/><circle class="bf-tab-fill" cx="12" cy="17" r="1.15"/><circle class="bf-tab-fill" cx="17.5" cy="15.4" r="1.15"/><circle class="bf-tab-fill" cx="18.2" cy="11.3" r="1.15"/></svg>',
    tela: '<svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect class="bf-tab-shape" x="2.5" y="4" width="19" height="13" rx="1.8"/><rect class="bf-tab-fill" x="5" y="6.6" width="14" height="2.1" rx="0.6" opacity="0.85"/><rect class="bf-tab-fill" x="5" y="10.2" width="3.8" height="3.8" rx="0.7"/><rect class="bf-tab-fill" x="10.1" y="10.2" width="3.8" height="3.8" rx="0.7"/><rect class="bf-tab-fill" x="15.2" y="10.2" width="3.8" height="3.8" rx="0.7"/><path class="bf-tab-shape" d="M9 20.5h6 M12 17v3.5"/></svg>',
    ledsTab: '<svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" aria-hidden="true"><path class="bf-tab-shape" d="M 16.7 18.47 A 8 8 0 0 1 7.3 18.47" stroke-width="2"/><path class="bf-tab-shape" d="M 4.04 12.84 A 8 8 0 0 1 8.75 4.69" stroke-width="2"/><path class="bf-tab-shape" d="M 15.25 4.69 A 8 8 0 0 1 19.96 12.84" stroke-width="2"/><circle class="bf-tab-fill" cx="12" cy="12" r="2.3"/></svg>',
    bancosTab: '<svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect class="bf-tab-shape" x="2.6" y="8" width="3.2" height="11" rx="0.9" opacity="0.45"/><rect class="bf-tab-shape" x="6.6" y="7" width="3.2" height="12" rx="0.9" opacity="0.70"/><rect class="bf-tab-fill" x="10.4" y="4.5" width="3.2" height="14.5" rx="0.9"/><rect class="bf-tab-shape" x="14.2" y="7" width="3.2" height="12" rx="0.9" opacity="0.70"/><rect class="bf-tab-shape" x="18.2" y="8" width="3.2" height="11" rx="0.9" opacity="0.45"/></svg>',
    gearTab: '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle class="bf-tab-shape" cx="12" cy="12" r="3.1"/><path class="bf-tab-shape" d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V15z"/></svg>',
    wifiTab: '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path class="bf-tab-shape" d="M2 8.5 Q12 0 22 8.5"/><path class="bf-tab-shape" d="M5 13 Q12 6 19 13"/><path class="bf-tab-shape" d="M8.5 17.5 Q12 14 15.5 17.5"/><circle class="bf-tab-dot" cx="12" cy="21" r="1.5"/></svg>',
    usbTab: '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle class="bf-tab-dot" cx="12" cy="20" r="1.6"/><path class="bf-tab-shape" d="M12 20V4"/><path class="bf-tab-line" d="M12 4l-2.5 3 5 0z"/><path class="bf-tab-shape" d="M12 14l-4-3v-2"/><rect class="bf-tab-dot" x="6" y="6.5" width="4" height="3"/><path class="bf-tab-shape" d="M12 10l4 3v3"/><circle class="bf-tab-dot" cx="16" cy="16.5" r="1.6"/></svg>',
    copiaTab: '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect class="bf-tab-shape" x="3" y="3" width="18" height="18" rx="2"/><rect class="bf-tab-dot" x="6" y="3" width="12" height="6.5"/><rect class="bf-tab-shape" x="14" y="4.5" width="2" height="3.5"/><rect class="bf-tab-shape" x="6.5" y="13" width="11" height="6"/></svg>'
  };
  // aba ativa por seção (GLOBAL/SYSTEM) — não persiste; o card navegado define
  const mnSecTab = {};

  /* ───────────────────── helpers ───────────────────── */
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const stripHtml = (s) => String(s || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

  // remove acentos pra busca tolerante (preset == prését)
  const fold = (s) => String(s).toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "");

  function parseHash() {
    const h = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
    if (!h) return { sec: null, card: null };
    const [sec, card] = h.split("/");
    return { sec: sec || null, card: card || null };
  }

  function sectionById(id) { return SECTIONS.find((s) => s.id === id) || null; }

  /* ───────────────────── sidebar ───────────────────── */
  function renderSidebar(activeSec, activeCard) {
    let html = `<a class="mn-side-home${!activeSec ? " is-active" : ""}" href="#">${MN_ICONS.home}<span>${esc(t("home"))}</span></a>`;
    let lastPage = null;
    for (const sec of SECTIONS) {
      const pg = secPage(sec);
      if (pg !== lastPage) {
        html += `<div class="mn-side-page-label">${esc(pg === 1 ? t("pageBasics") : t("pageFull"))}</div>`;
        lastPage = pg;
      }
      const isActive = sec.id === activeSec;
      html += `
        <div class="mn-side-sec${isActive ? " is-open is-active" : ""}" data-sec="${sec.id}">
          <button class="mn-side-sec-btn" type="button" data-goto="${sec.id}" aria-expanded="${isActive}">
            <span class="ico">${MN_ICONS[sec.icon] || ""}</span>
            <span>${esc(sec.title)}</span>
            <span class="chev"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg></span>
          </button>
          <div class="mn-side-cards">
            ${Array.isArray(sec.tabs) && sec.tabs.length
              ? sec.tabs.map((tb) => {
                  const tabCards = sec.cards.filter((c) => (c.tab || sec.tabs[0].id) === tb.id);
                  if (!tabCards.length) return "";
                  return `<div class="mn-side-tab-label">${esc(tb.label)}</div>` +
                    tabCards.map((c) => `
                      <a class="mn-side-card${isActive && c.id === activeCard ? " is-active" : ""}"
                         href="#${sec.id}/${c.id}">${esc(c.title)}</a>`).join("");
                }).join("")
              : sec.cards.map((c) => `
                  <a class="mn-side-card${isActive && c.id === activeCard ? " is-active" : ""}"
                     href="#${sec.id}/${c.id}">${esc(c.title)}</a>`).join("")}
          </div>
        </div>`;
    }
    sidebarInner.innerHTML = html;

    sidebarInner.querySelectorAll(".mn-side-sec-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const wrap = btn.closest(".mn-side-sec");
        const secId = btn.dataset.goto;
        // já aberto e ativo? só recolhe/expande; senão navega
        if (wrap.classList.contains("is-open") && parseHash().sec === secId) {
          wrap.classList.toggle("is-open");
        } else {
          location.hash = "#" + secId;
        }
      });
    });
    sidebarInner.querySelectorAll(".mn-side-card").forEach((a) => {
      a.addEventListener("click", closeSidebarMobile);
    });
  }

  function openSidebarMobile() {
    sidebar.classList.add("is-open");
    sidebarBackdrop.hidden = false;
  }
  function closeSidebarMobile() {
    sidebar.classList.remove("is-open");
    sidebarBackdrop.hidden = true;
  }
  burger.addEventListener("click", () =>
    sidebar.classList.contains("is-open") ? closeSidebarMobile() : openSidebarMobile());
  sidebarBackdrop.addEventListener("click", closeSidebarMobile);

  /* ───────────────────── home (2 páginas) ─────────────────────
     Página 1 = Primeiros Passos (seções com page:1); Página 2 = Manual
     Completo (as demais). O seletor fixo no rodapé troca na hora, sem
     recarregar; a Página 1 é a inicial. */
  let mnHomePage = 1;

  function secPage(sec) { return sec.page === 1 ? 1 : 2; }

  function renderHome(keepScroll) {
    const tiles = SECTIONS.filter((sec) => secPage(sec) === mnHomePage).map((sec) => `
      <a class="mn-home-tile" href="#${sec.id}">
        <span class="ico">${MN_ICONS[sec.icon] || ""}</span>
        <h3>${esc(sec.title)}</h3>
        <p>${esc(sec.summary)}</p>
        <span class="meta">${sec.cards.length} ${sec.cards.length === 1 ? esc(t("topicOne")) : esc(t("topicMany"))}</span>
      </a>`).join("");

    main.innerHTML = `
      <div class="mn-hero">
        <div class="mn-eyebrow"><span class="dot"></span>${esc(t("eyebrow"))}</div>
        <h1 class="mn-title">${esc(t("heroPre"))} <span class="accent">${esc(t("heroAccent"))}</span></h1>
        <p class="mn-subtitle">${esc(pickLang(MN_CONTENT.tagline))}</p>
      </div>
      <div class="mn-section-label">${esc(mnHomePage === 1 ? t("pageBasics") : t("pageFull"))}</div>
      <div class="mn-home-grid">${tiles}</div>
      <div class="mn-page-switch-spacer"></div>
      <div class="mn-page-switch" role="tablist" aria-label="Páginas do manual">
        <button type="button" class="mn-page-btn${mnHomePage === 1 ? " is-on" : ""}" data-page="1" role="tab" aria-selected="${mnHomePage === 1}">
          <span class="dot"></span>${esc(t("pageBasics"))}
        </button>
        <button type="button" class="mn-page-btn${mnHomePage === 2 ? " is-on" : ""}" data-page="2" role="tab" aria-selected="${mnHomePage === 2}">
          <span class="dot"></span>${esc(t("pageFull"))}
        </button>
      </div>`;

    main.querySelectorAll(".mn-page-btn").forEach((b) =>
      b.addEventListener("click", () => {
        const p = Number(b.dataset.page);
        if (p === mnHomePage) return;
        mnHomePage = p;
        renderHome(true);
      }));

    document.title = t("docHome");
    if (!keepScroll) window.scrollTo(0, 0);
    setupScrollSpy(null);
  }

  /* ───────────────────── seção ───────────────────── */
  function infoButton(secIdx, cardIdx, fieldIdx) {
    return `<button class="mn-info" type="button" title="${esc(t("infoTitle"))}"
      aria-label="${esc(t("infoAria"))}"
      data-info="${secIdx}.${cardIdx}.${fieldIdx}">i</button>`;
  }

  /* ─────────── mockup do card do app (markup REAL do webApp) ───────────
     Emite as MESMAS classes do app.css real (bf-card, bf-extras-row,
     bf-input, bf-select, bf-color-bar, bf-tap-action, bf-fsw…), então o
     visual é idêntico ao editor. As tags numeradas (.mk-tag) ficam
     sobrepostas por cima. */
  function mockTag(cell, secIdx, cardIdx) {
    return cell.tag
      ? `<button class="mk-tag" type="button" data-info="${secIdx}.${cardIdx}.${cell.tag - 1}"
           title="${esc(t("tagFieldTitle", { n: cell.tag }))}" aria-label="${esc(t("tagFieldAria", { n: cell.tag }))}">${cell.tag}</button>`
      : "";
  }

  // Arco do FootswitchArc real (3 segmentos, r=30, ±36°, igual app.jsx)
  function fswArcSvg(color) {
    const r = 30, cx = 36, cy = 36;
    const seg = (a) => {
      const a1 = (a - 36) * Math.PI / 180, a2 = (a + 36) * Math.PI / 180;
      const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
      return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
    };
    return `<svg class="bf-fsw-arcs" viewBox="0 0 72 72">
      ${[90, 210, 330].map((a) => `<path d="${seg(a)}" stroke="${color}"/>`).join("")}
    </svg>`;
  }

  function swIcon(name) {
    const common = 'class="bf-tab-ico" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
    if (name === "gear") {
      return `<svg viewBox="0 0 24 24" ${common}><circle class="bf-tab-shape" cx="12" cy="12" r="3"/><path class="bf-tab-shape" d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`;
    }
    if (name === "display") {
      return `<svg viewBox="0 0 24 24" ${common}><rect class="bf-tab-shape" x="2.5" y="4.5" width="19" height="12" rx="1.6"/><rect class="bf-tab-dot" x="6" y="11" width="1.6" height="3.5"/><rect class="bf-tab-dot" x="9" y="9" width="1.6" height="5.5"/><rect class="bf-tab-dot" x="12" y="7" width="1.6" height="7.5"/><rect class="bf-tab-dot" x="15" y="10" width="1.6" height="4.5"/><path class="bf-tab-shape" d="M9 21h6M12 16.5v4.5"/></svg>`;
    }
    if (name === "copy") {
      return `<svg viewBox="0 0 24 24" ${common}><rect class="bf-tab-shape" x="8" y="8" width="11" height="13" rx="2"/><path class="bf-tab-shape" d="M16 8V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h1"/></svg>`;
    }
    if (name === "paste") {
      return `<svg viewBox="0 0 24 24" ${common}><path class="bf-tab-shape" d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect class="bf-tab-shape" x="8" y="2" width="8" height="4" rx="1"/><path class="bf-tab-shape" d="M12 11v6M9 14l3 3 3-3"/></svg>`;
    }
    return `<svg viewBox="0 0 24 24" ${common}><path class="bf-tab-shape" d="M9 18h6M12 6v12"/><rect class="bf-tab-shape" x="8" y="3" width="8" height="5" rx="2"/><path class="bf-tab-shape" d="M5 21h14M7 21a5 5 0 0 1 10 0"/></svg>`;
  }

  /* ─────────── Fluxo da chamada de preset (SVG ilustrativo) ───────────
     Layout VERTICAL, etapa por etapa: ① o card PRINCIPAL chama o preset →
     ② a pedaleira carrega o preset → ③ dispara o estado dos 6 SWs e
     sincroniza efeitos/parâmetros (linhas tracejadas animadas, cor = LED).
     Cores fixas = LEDs; o resto tematiza via var() (responde ao tema claro). */
  function renderIntroFlowSvg(card, secIdx, cardIdx) {
    const tag = mockTagFactory(card, secIdx, cardIdx);
    const rows = [
      { sw: "SW1", fn: "DRIVE",  fx: "DRIVE",  st: "ON",      c: "#30d158", on: true },
      { sw: "SW2", fn: "DELAY",  fx: "DELAY",  st: "OFF",     c: "#6e6e76", on: false },
      { sw: "SW3", fn: "REVERB", fx: "REVERB", st: "ON",      c: "#0a84ff", on: true },
      { sw: "SW4", fn: "VOL",    fx: "VOLUME", st: "90",      c: "#bf5af2", on: true },
      { sw: "SW5", fn: "TAP",    fx: "TEMPO",  st: "120 BPM", c: "#ff6a1f", on: true },
      { sw: "SW6", fn: "BOOST",  fx: "BOOST",  st: "OFF",     c: "#6e6e76", on: false }
    ];
    const mono = 'font-family="JetBrains Mono, ui-monospace, monospace"';
    const sysf = 'font-family="-apple-system, Segoe UI, sans-serif"';

    // cabeçalho de etapa: anel laranja numerado + título + subtítulo
    const step = (n, y, title, sub) => `
      <circle cx="44" cy="${y}" r="12" fill="none" stroke="#ff6a1f" stroke-width="2.4"/>
      <text x="44" y="${y + 4.5}" ${mono} font-size="13" font-weight="800" text-anchor="middle" fill="#ff8a3a">${n}</text>
      <text x="66" y="${y - 1}" ${mono} font-size="11.5" font-weight="700" letter-spacing="1" style="fill:var(--text)">${title}</text>
      <text x="66" y="${y + 14}" ${sysf} font-size="10.5" style="fill:var(--muted)">${sub}</text>`;

    // seta vertical grossa entre etapas
    const downArrow = (y1, y2, label) => `
      <line x1="280" y1="${y1}" x2="280" y2="${y2 - 10}" stroke="url(#mnFlowAccentV)" stroke-width="6" stroke-linecap="round" filter="url(#mnFlowGlow)"/>
      <path d="M 280 ${y2} l -7 -12 h 14 z" fill="#ff6a1f" filter="url(#mnFlowGlow)"/>
      ${label ? `<text x="296" y="${(y1 + y2) / 2 + 3}" ${mono} font-size="9" letter-spacing="1" fill="#ff8a3a">${label}</text>` : ""}`;

    // linhas de sincronia da etapa 3
    const rowY = (i) => 560 + i * 42;
    const syncRows = rows.map((r, i) => {
      const y = rowY(i);
      return `
        <g>
          <rect x="48" y="${y}" width="196" height="30" rx="8" style="fill:var(--card-2);stroke:${r.on ? r.c : "var(--hair-strong)"};stroke-width:1.2" opacity="${r.on ? 1 : 0.6}"/>
          <circle cx="64" cy="${y + 15}" r="4.5" fill="${r.c}" opacity="${r.on ? 1 : 0.4}">${r.on ? `<animate attributeName="opacity" values="1;0.55;1" dur="2.4s" begin="${i * 0.2}s" repeatCount="indefinite"/>` : ""}</circle>
          <text x="78" y="${y + 19}" ${mono} font-size="10.5" font-weight="700" style="fill:var(--text)">${r.sw}</text>
          <text x="112" y="${y + 19}" ${mono} font-size="10" style="fill:var(--muted)">${r.fn}</text>
          <text x="236" y="${y + 19}" ${mono} font-size="9.5" text-anchor="end" font-weight="700" fill="${r.on ? r.c : "#8a8a92"}">${r.st}</text>

          <g opacity="${r.on ? 1 : 0.35}">
            <line x1="248" y1="${y + 15}" x2="308" y2="${y + 15}" stroke="${r.c}" stroke-width="1.8" stroke-dasharray="5 4">
              ${r.on ? `<animate attributeName="stroke-dashoffset" values="18;0" dur="1.2s" repeatCount="indefinite"/>` : ""}
            </line>
            <path d="M 310 ${y + 15} l -7 -4 v 8 z" fill="${r.c}"/>
          </g>

          <rect x="316" y="${y}" width="196" height="30" rx="8" style="fill:var(--card-2);stroke:${r.on ? r.c : "var(--hair-strong)"};stroke-width:1.2" opacity="${r.on ? 1 : 0.6}"/>
          <text x="330" y="${y + 19}" ${mono} font-size="10.5" font-weight="700" style="fill:var(--text)">${r.fx}</text>
          <text x="498" y="${y + 19}" ${mono} font-size="9.5" text-anchor="end" font-weight="700" fill="${r.on ? r.c : "#8a8a92"}">${r.st}</text>
        </g>`;
    }).join("");

    const svg = `
    <svg viewBox="0 0 560 880" xmlns="http://www.w3.org/2000/svg" role="img"
         aria-label="Fluxo vertical: o PRINCIPAL chama o preset, a pedaleira carrega e os 6 switches sincronizam efeitos e parâmetros">
      <defs>
        <linearGradient id="mnFlowAccentV" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ff8a3a"/>
          <stop offset="1" stop-color="#ff6a1f"/>
        </linearGradient>
        <filter id="mnFlowGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <!-- ETAPA 1: a controladora chama o preset -->
      ${step(1, 36, "O PRINCIPAL CHAMA O PRESET", "Você pisa num preset no modo BANK — o card PRINCIPAL é enviado")}
      <rect x="96" y="64" width="368" height="92" rx="12" style="fill:var(--card);stroke:var(--hair-strong);stroke-width:1.4"/>
      <text x="280" y="82" ${mono} font-size="8.5" letter-spacing="1.5" text-anchor="middle" style="fill:var(--faint)">CONTROLADORA · BFMiDi</text>
      <rect x="112" y="90" width="336" height="54" rx="9" style="fill:var(--card-2);stroke:rgba(255,106,31,0.45);stroke-width:1.4"/>
      <rect x="112" y="98" width="4" height="38" rx="2" fill="url(#mnFlowAccentV)"/>
      <text x="128" y="106" ${mono} font-size="8" letter-spacing="1.5" fill="#ff8a3a">• PRINCIPAL</text>
      <text x="128" y="124" ${sysf} font-size="14" font-weight="800" style="fill:var(--text)">Fender Clean</text>
      <text x="128" y="138" ${mono} font-size="9" style="fill:var(--muted)">PC 24 · CH 01 · +extras</text>

      ${downArrow(168, 214, "PC 24 + EXTRAS · CH 01")}

      <!-- ETAPA 2: a pedaleira carrega o preset -->
      ${step(2, 244, "A PEDALEIRA CARREGA O PRESET", "O aparelho alvo troca para o timbre da música")}
      <rect x="96" y="272" width="368" height="92" rx="12" style="fill:var(--card);stroke:var(--hair-strong);stroke-width:1.4"/>
      <text x="280" y="290" ${mono} font-size="8.5" letter-spacing="1.5" text-anchor="middle" style="fill:var(--faint)">PEDALEIRA / STOMP ALVO</text>
      <rect x="112" y="298" width="336" height="54" rx="9" fill="#0b0b0e" stroke="rgba(255,106,31,0.5)" stroke-width="1.4"/>
      <text x="280" y="318" ${mono} font-size="8.5" letter-spacing="1.5" text-anchor="middle" fill="#8a8a92">PRESET CARREGADO</text>
      <text x="280" y="340" ${sysf} font-size="16" font-weight="800" text-anchor="middle" fill="#ff8a3a" filter="url(#mnFlowGlow)">24 · LEAD</text>

      ${downArrow(376, 422, "NA MESMA CHAMADA…")}

      <!-- ETAPA 3: dispara os 6 SWs e sincroniza -->
      ${step(3, 452, "DISPARA OS 6 SWs E SINCRONIZA", "Cada switch envia seu estado inicial — efeitos e parâmetros ficam iguais ao LED e à tela")}
      <rect x="28" y="482" width="504" height="${6 * 42 + 78}" rx="14" style="fill:var(--card);stroke:var(--hair-strong);stroke-width:1.4"/>
      <text x="146" y="510" ${mono} font-size="8.5" letter-spacing="1.5" text-anchor="middle" style="fill:var(--faint)">SWITCHES (CONTROLADORA)</text>
      <text x="414" y="510" ${mono} font-size="8.5" letter-spacing="1.5" text-anchor="middle" style="fill:var(--faint)">EFEITOS (PEDALEIRA)</text>
      <line x1="48" y1="522" x2="244" y2="522" style="stroke:var(--hair-strong)" stroke-width="1"/>
      <line x1="316" y1="522" x2="512" y2="522" style="stroke:var(--hair-strong)" stroke-width="1"/>
      <text x="280" y="544" ${mono} font-size="8" letter-spacing="1" text-anchor="middle" fill="#ff8a3a">ESTADO INICIAL (CC/PC)</text>
      ${syncRows}

      <!-- legenda -->
      <text x="280" y="858" ${mono} font-size="9.5" letter-spacing="0.8" text-anchor="middle" style="fill:var(--muted)">TUDO NA CHAMADA DO PRESET — LED · TELA · PEDALEIRA NASCEM SINCRONIZADOS</text>
    </svg>`;

    return `<div class="mn-block-label">${esc(t("previewReal"))}</div>
      <div class="mn-mock mn-mock-flow bf-screen">
        <div class="mn-flow-wrap">
          ${svg}
          <span class="mn-flow-tag" style="left:84%;top:2.8%">${tag("chamada")}</span>
          <span class="mn-flow-tag" style="left:2.5%;top:62%">${tag("pedais")}</span>
          <span class="mn-flow-tag" style="left:90%;top:51.5%">${tag("sincronia")}</span>
        </div>
      </div>`;
  }


  /* ─────────── Conexão pelo celular (SVG ilustrativo, 4 passos) ───────────
     Passo a passo PRA LEIGOS: celular vendo as redes WiFi → senha →
     navegador com 192.168.4.1 → editor aberto. Mesmo estilo vertical do
     intro-flow (step numerado + seta), com desenhos de celular. */
  function renderAccessFlowSvg(card, secIdx, cardIdx) {
    const tag = mockTagFactory(card, secIdx, cardIdx);
    const mono = 'font-family="JetBrains Mono, ui-monospace, monospace"';
    const sysf = 'font-family="-apple-system, Segoe UI, sans-serif"';

    const step = (n, y, title, sub) => `
      <circle cx="44" cy="${y}" r="12" fill="none" stroke="#ff6a1f" stroke-width="2.4"/>
      <text x="44" y="${y + 4.5}" ${mono} font-size="13" font-weight="800" text-anchor="middle" fill="#ff8a3a">${n}</text>
      <text x="66" y="${y - 1}" ${mono} font-size="11.5" font-weight="700" letter-spacing="1" style="fill:var(--text)">${title}</text>
      <text x="66" y="${y + 14}" ${sysf} font-size="10.5" style="fill:var(--muted)">${sub}</text>`;

    const downArrow = (y1, y2, label) => `
      <line x1="280" y1="${y1}" x2="280" y2="${y2 - 10}" stroke="url(#mnAccAccentV)" stroke-width="6" stroke-linecap="round" filter="url(#mnAccGlow)"/>
      <path d="M 280 ${y2} l -7 -12 h 14 z" fill="#ff6a1f" filter="url(#mnAccGlow)"/>
      ${label ? `<text x="296" y="${(y1 + y2) / 2 + 3}" ${mono} font-size="9" letter-spacing="1" fill="#ff8a3a">${label}</text>` : ""}`;

    // Moldura de celular (frame + tela + alto-falante). A tela segue o TEMA
    // do manual (--mock-phone-*): o celular é o aparelho do usuário, nao a
    // tela do pedal (que nos mocks bf-* fica dark de proposito). var() so
    // funciona em style="", nunca em atributo fill/stroke de SVG.
    const phone = (x, y, w, h) => `
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="24" style="fill:var(--card);stroke:var(--hair-strong);stroke-width:1.6"/>
      <rect x="${x + 9}" y="${y + 18}" width="${w - 18}" height="${h - 28}" rx="14" style="fill:var(--mock-phone-screen);stroke:var(--mock-phone-hair)"/>
      <rect x="${x + w / 2 - 20}" y="${y + 8}" width="40" height="4.5" rx="2.25" style="fill:var(--mock-phone-speaker)"/>`;

    // Cursor de toque animado (dedo).
    const tap = (cx, cy) => `
      <circle cx="${cx}" cy="${cy}" r="9" fill="rgba(255,106,31,0.22)" stroke="#ff6a1f" stroke-width="2">
        <animate attributeName="r" values="7;12;7" dur="1.6s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0.5;1" dur="1.6s" repeatCount="indefinite"/>
      </circle>
      <circle cx="${cx}" cy="${cy}" r="3.2" fill="#ff6a1f"/>`;

    // Ícone de sinal WiFi (3 arcos + ponto). Cores via style (aceita var()).
    const wifiIco = (x, y, c, op) => `
      <g style="stroke:${c}" fill="none" stroke-width="1.8" stroke-linecap="round" opacity="${op || 1}">
        <path d="M ${x - 8} ${y} q 8 -8 16 0"/>
        <path d="M ${x - 5} ${y + 4} q 5 -5 10 0"/>
      </g>
      <circle cx="${x}" cy="${y + 8}" r="1.8" style="fill:${c}" opacity="${op || 1}"/>`;

    // Cadeado pequeno (rede protegida).
    const lock = (x, y, c) => `
      <rect x="${x - 4}" y="${y}" width="8" height="6.5" rx="1.5" style="fill:${c}"/>
      <path d="M ${x - 2.4} ${y} v -2.2 a 2.4 2.4 0 0 1 4.8 0 v 2.2" style="stroke:${c}" stroke-width="1.4" fill="none"/>`;

    // Linha de rede WiFi na lista (passo 1).
    const netRow = (x, y, w, name, hot) => `
      <rect x="${x}" y="${y}" width="${w}" height="30" rx="8"
        style="fill:${hot ? "rgba(255,106,31,0.12)" : "var(--card-2)"};stroke:${hot ? "#ff6a1f" : "var(--hair-strong)"};stroke-width:${hot ? 1.8 : 1.1}"/>
      <text x="${x + 12}" y="${y + 19}" ${sysf} font-size="${hot ? 11.5 : 10.5}" font-weight="${hot ? 800 : 500}" style="fill:${hot ? "var(--accent)" : "var(--muted)"}">${name}</text>
      ${lock(x + w - 34, y + 11, hot ? "var(--accent)" : "var(--faint)")}
      ${wifiIco(x + w - 16, y + 13, hot ? "var(--accent)" : "var(--faint)", hot ? 1 : 0.8)}`;

    // Geometria vertical das 4 etapas.
    const p1y = 64, p1h = 218;            // passo 1: lista de redes
    const p2y = p1y + p1h + 96, p2h = 212; // passo 2: senha
    const p3y = p2y + p2h + 96, p3h = 196; // passo 3: navegador
    const p4y = p3y + p3h + 96, p4h = 214; // passo 4: editor
    const total = p4y + p4h + 44;
    const px = 168, pw = 224;             // celular centrado (x/largura)

    const svg = `
    <svg viewBox="0 0 560 ${total}" xmlns="http://www.w3.org/2000/svg" role="img"
         aria-label="Passo a passo: conectar o celular na rede BFMIDI_WIFI, digitar a senha, abrir o navegador em 192.168.4.1 e usar o editor">
      <defs>
        <linearGradient id="mnAccAccentV" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ff8a3a"/>
          <stop offset="1" stop-color="#ff6a1f"/>
        </linearGradient>
        <filter id="mnAccGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <!-- PASSO 1: abrir o WiFi do celular e tocar na rede do pedal -->
      ${step(1, 36, "ABRA O WIFI DO CELULAR", "Ajustes › Wi-Fi — a rede do pedal aparece na lista")}
      ${phone(px, p1y, pw, p1h)}
      <text x="${px + 22}" y="${p1y + 44}" ${sysf} font-size="13" font-weight="800" style="fill:var(--text)">Wi-Fi</text>
      <rect x="${px + pw - 52}" y="${p1y + 32}" width="30" height="16" rx="8" fill="#30d158"/>
      <circle cx="${px + pw - 30}" cy="${p1y + 40}" r="6.5" fill="#fff"/>
      ${netRow(px + 20, p1y + 60, pw - 40, "Casa_2G", false)}
      ${netRow(px + 20, p1y + 98, pw - 40, "BFMIDI_WIFI", true)}
      ${netRow(px + 20, p1y + 136, pw - 40, "Vizinho_5G", false)}
      ${tap(px + pw - 58, p1y + 113)}
      <text x="280" y="${p1y + p1h - 14}" ${mono} font-size="9" letter-spacing="1" text-anchor="middle" style="fill:var(--accent)">TOQUE EM “BFMIDI_WIFI”</text>

      ${downArrow(p1y + p1h + 14, p2y - 14, "")}

      <!-- PASSO 2: digitar a senha -->
      ${step(2, p2y - 28, "DIGITE A SENHA", "A senha é fixa, igual para todos os pedais")}
      ${phone(px, p2y, pw, p2h)}
      <text x="${px + pw / 2}" y="${p2y + 46}" ${sysf} font-size="12.5" font-weight="800" text-anchor="middle" style="fill:var(--text)">BFMIDI_WIFI</text>
      <text x="${px + 22}" y="${p2y + 72}" ${mono} font-size="8" letter-spacing="1.2" style="fill:var(--faint)">SENHA</text>
      <rect x="${px + 20}" y="${p2y + 80}" width="${pw - 40}" height="34" rx="9" style="fill:var(--card-2);stroke:#ff6a1f;stroke-width:1.6"/>
      <text x="${px + 32}" y="${p2y + 102}" ${mono} font-size="12.5" font-weight="700" style="fill:var(--accent)">bfmidi@editor</text>
      <rect x="${px + 20}" y="${p2y + 128}" width="${pw - 40}" height="32" rx="9" fill="#ff6a1f"/>
      <text x="${px + pw / 2}" y="${p2y + 148}" ${mono} font-size="11" font-weight="800" letter-spacing="1.5" text-anchor="middle" fill="#16161a">CONECTAR</text>
      ${tap(px + pw - 48, p2y + 144)}
      <text x="280" y="${p2y + p2h - 12}" ${sysf} font-size="9.5" text-anchor="middle" style="fill:var(--muted)">“Sem internet”? Normal — continue conectado.</text>

      ${downArrow(p2y + p2h + 14, p3y - 14, "")}

      <!-- PASSO 3: abrir o navegador e digitar o endereço -->
      ${step(3, p3y - 28, "ABRA O NAVEGADOR", "Chrome, Safari ou Edge — digite o endereço e confirme")}
      ${phone(px, p3y, pw, p3h)}
      <rect x="${px + 18}" y="${p3y + 34}" width="${pw - 36}" height="34" rx="17" style="fill:var(--card-2);stroke:#ff6a1f;stroke-width:1.8"/>
      <circle cx="${px + 36}" cy="${p3y + 51}" r="7" fill="none" style="stroke:var(--faint)" stroke-width="1.5"/>
      <path d="M ${px + 29} ${p3y + 51} h 14 M ${px + 36} ${p3y + 44} a 10 10 0 0 1 0 14 M ${px + 36} ${p3y + 44} a 10 10 0 0 0 0 14" style="stroke:var(--faint)" stroke-width="1.1" fill="none"/>
      <text x="${px + 52}" y="${p3y + 56}" ${mono} font-size="13.5" font-weight="800" style="fill:var(--accent)">192.168.4.1<tspan fill="#ff6a1f"><animate attributeName="opacity" values="1;0;1" dur="1.1s" repeatCount="indefinite"/>|</tspan></text>
      <text x="${px + pw / 2}" y="${p3y + 96}" ${sysf} font-size="9.5" text-anchor="middle" style="fill:var(--muted)">Só números e pontos — sem “www”.</text>
      ${[0, 1, 2].map((r) => `<rect x="${px + 22}" y="${p3y + 116 + r * 20}" width="${pw - 44}" height="13" rx="4" style="fill:var(--mock-phone-key)"/>`).join("")}
      ${tap(px + pw / 2, p3y + 142)}

      ${downArrow(p3y + p3h + 14, p4y - 14, "")}

      <!-- PASSO 4: o editor abre -->
      ${step(4, p4y - 28, "PRONTO — O EDITOR ABRE", "Sem instalar nada: o app roda dentro do pedal")}
      ${phone(px, p4y, pw, p4h)}
      <rect x="${px + 18}" y="${p4y + 32}" width="${pw - 36}" height="22" rx="7" style="fill:var(--card-2);stroke:var(--hair-strong);stroke-width:1"/>
      <text x="${px + pw / 2}" y="${p4y + 47}" ${mono} font-size="9.5" font-weight="800" letter-spacing="2" text-anchor="middle" style="fill:var(--accent)">BFMiDi · EDITOR</text>
      ${[0, 1, 2, 3, 4, 5].map((i) => {
        const col = i % 3, row = (i / 3) | 0;
        const tx = px + 22 + col * ((pw - 44 - 16) / 3 + 8);
        const ty = p4y + 66 + row * 54;
        const tw = (pw - 44 - 16) / 3;
        return `<rect x="${tx}" y="${ty}" width="${tw}" height="46" rx="9"
            style="fill:var(--card-2);stroke:${i === 0 ? "#ff6a1f" : "var(--hair-strong)"};stroke-width:${i === 0 ? 1.8 : 1.1}"/>
          <text x="${tx + tw / 2}" y="${ty + 28}" ${mono} font-size="10" font-weight="800" text-anchor="middle" style="fill:${i === 0 ? "var(--accent)" : "var(--faint)"}">${i + 1}</text>`;
      }).join("")}
      <text x="${px + pw / 2}" y="${p4y + p4h - 16}" ${sysf} font-size="9.5" text-anchor="middle" style="fill:var(--muted)">Edite presets, cores e tudo mais por aqui.</text>

      <text x="280" y="${total - 12}" ${mono} font-size="9.5" letter-spacing="0.8" text-anchor="middle" style="fill:var(--muted)">REDE: BFMIDI_WIFI · SENHA: bfmidi@editor · ENDEREÇO: 192.168.4.1</text>
    </svg>`;

    return `<div class="mn-block-label">${esc(t("previewReal"))}</div>
      <div class="mn-mock mn-mock-flow bf-screen">
        <div class="mn-flow-wrap">
          ${svg}
          <span class="mn-flow-tag" style="left:78%;top:6%">${tag("wifi")}</span>
          <span class="mn-flow-tag" style="left:78%;top:32.5%">${tag("senha")}</span>
          <span class="mn-flow-tag" style="left:78%;top:57.5%">${tag("navegador")}</span>
          <span class="mn-flow-tag" style="left:78%;top:82%">${tag("editor")}</span>
        </div>
      </div>`;
  }

  /* ─────────── Modo Amigável (SVG ilustrativo, antes/depois) ───────────
     Mesmo estilo vertical do fluxo: ① seletor com números crus → escolha do
     aparelho em GLOBAL›MIDI → ② o mesmo seletor com nomes amigáveis. */
  function renderMatchFlowSvg(card, secIdx, cardIdx) {
    const tag = mockTagFactory(card, secIdx, cardIdx);
    const mono = 'font-family="JetBrains Mono, ui-monospace, monospace"';
    const sysf = 'font-family="-apple-system, Segoe UI, sans-serif"';

    const step = (n, y, title, sub) => `
      <circle cx="44" cy="${y}" r="12" fill="none" stroke="#ff6a1f" stroke-width="2.4"/>
      <text x="44" y="${y + 4.5}" ${mono} font-size="13" font-weight="800" text-anchor="middle" fill="#ff8a3a">${n}</text>
      <text x="66" y="${y - 1}" ${mono} font-size="11.5" font-weight="700" letter-spacing="1" style="fill:var(--text)">${title}</text>
      <text x="66" y="${y + 14}" ${sysf} font-size="10.5" style="fill:var(--muted)">${sub}</text>`;

    const downArrow = (y1, y2) => `
      <line x1="280" y1="${y1}" x2="280" y2="${y2 - 10}" stroke="url(#mnMatchAccentV)" stroke-width="6" stroke-linecap="round" filter="url(#mnMatchGlow)"/>
      <path d="M 280 ${y2} l -7 -12 h 14 z" fill="#ff6a1f" filter="url(#mnMatchGlow)"/>`;

    // painel de seletor aberto (lista de opções). named=false → números crus.
    const itensCrus = [
      { t: "CC", v: "47", n: "" },
      { t: "CC", v: "48", n: "" },
      { t: "CC", v: "49", n: "", sel: true },
      { t: "CC", v: "50", n: "" },
      { t: "PC", v: "12", n: "" }
    ];
    const itensNomes = [
      { t: "CC", v: "47", n: "Volume Pedal" },
      { t: "CC", v: "48", n: "Boost" },
      { t: "CC", v: "49", n: "Stomp A", sel: true },
      { t: "CC", v: "50", n: "Stomp B" },
      { t: "PC", v: "12", n: "Lead Solo" }
    ];
    const painel = (y, itens, named) => {
      const rowsH = itens.length * 30 - 4;
      let out = `
      <rect x="96" y="${y}" width="368" height="${rowsH + 46}" rx="12" style="fill:var(--card);stroke:var(--hair-strong);stroke-width:1.4"/>
      <text x="280" y="${y + 19}" ${mono} font-size="8.5" letter-spacing="1.5" text-anchor="middle" style="fill:var(--faint)">SELETOR DE CC / PC DO SWITCH</text>`;
      itens.forEach((it, i) => {
        const ry = y + 30 + i * 30;
        const sel = !!it.sel;
        const chipC = it.t === "PC" ? "#30d158" : "#2fc6da";
        out += `
        <rect x="112" y="${ry}" width="336" height="26" rx="7"
              style="fill:var(--card-2);stroke:${sel ? "#ff6a1f" : "var(--hair-strong)"};stroke-width:${sel ? 1.6 : 1}"
              ${sel ? 'filter="url(#mnMatchGlow)"' : ""} opacity="${sel ? 1 : 0.8}"/>
        <rect x="120" y="${ry + 5}" width="26" height="16" rx="5" fill="none" stroke="${chipC}" stroke-width="1.2"/>
        <text x="133" y="${ry + 16.5}" ${mono} font-size="8" font-weight="700" text-anchor="middle" fill="${chipC}">${it.t}</text>
        <text x="156" y="${ry + 17.5}" ${mono} font-size="11" font-weight="700" style="fill:${named ? "var(--muted)" : "var(--text)"}">${it.v}</text>`;
        if (named) {
          out += `
        <text x="184" y="${ry + 17.5}" ${sysf} font-size="11.5" font-weight="${sel ? 800 : 600}" fill="${sel ? "#ff8a3a" : ""}" style="${sel ? "" : "fill:var(--text)"}">${it.n}</text>`;
        } else {
          out += `
        <text x="436" y="${ry + 17.5}" ${mono} font-size="11" text-anchor="end" style="fill:var(--faint)">?</text>`;
        }
      });
      return out;
    };

    const svg = `
    <svg viewBox="0 0 560 668" xmlns="http://www.w3.org/2000/svg" role="img"
         aria-label="Modo Amigável: o mesmo seletor de MIDI antes (números crus) e depois (nomes do aparelho)">
      <defs>
        <linearGradient id="mnMatchAccentV" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ff8a3a"/>
          <stop offset="1" stop-color="#ff6a1f"/>
        </linearGradient>
        <filter id="mnMatchGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <!-- ETAPA 1: sem o modo amigável -->
      ${step(1, 36, "SEM MODO AMIGÁVEL", "Números crus — configurar exige a tabela MIDI da pedaleira na mão")}
      ${painel(64, itensCrus, false)}

      ${downArrow(264, 296)}

      <!-- escolha do aparelho (a causa da transformação) -->
      <rect x="140" y="302" width="280" height="58" rx="11" style="fill:var(--card-2)" stroke="rgba(255,106,31,0.55)" stroke-width="1.6" filter="url(#mnMatchGlow)"/>
      <text x="280" y="322" ${mono} font-size="8" letter-spacing="1.5" text-anchor="middle" style="fill:var(--faint)">GLOBAL › MIDI — ALVO DO MAPEAMENTO</text>
      <text x="272" y="344" ${sysf} font-size="14" font-weight="800" text-anchor="middle" fill="#ff8a3a">AMPERO AS2</text>
      <text x="404" y="344" ${mono} font-size="10" text-anchor="end" style="fill:var(--muted)">▾</text>

      ${downArrow(366, 398)}

      <!-- ETAPA 2: com o modo amigável -->
      ${step(2, 428, "COM MODO AMIGÁVEL", "Os mesmos comandos — agora com os nomes do seu aparelho")}
      ${painel(456, itensNomes, true)}

      <!-- legenda -->
      <text x="280" y="650" ${mono} font-size="9.5" letter-spacing="0.8" text-anchor="middle" style="fill:var(--muted)">O MIDI É O MESMO — MAS CONFIGURAR VIRA ALGO LEGÍVEL E INTUITIVO</text>
    </svg>`;

    return `<div class="mn-block-label">${esc(t("previewReal"))}</div>
      <div class="mn-mock mn-mock-flow bf-screen">
        <div class="mn-flow-wrap">
          ${svg}
          <span class="mn-flow-tag" style="left:88%;top:66.5%">${tag("nomes")}</span>
          <span class="mn-flow-tag" style="left:73%;top:46.5%">${tag("canal")}</span>
        </div>
      </div>`;
  }

  /* ─────────── Modos de SW — editores REAIS (markup do app.jsx) ───────────
     Um renderer por modo, dispatch por card.mockType ("sw-stomp", "sw-macros",
     "sw-momentary", "sw-tap", "sw-spin", "sw-ramp", "sw-single", "sw-mute",
     "sw-display"), todos dentro da casca real bf-sw-card. Tags via mockTags. */
  function renderSwRealMock(card, secIdx, cardIdx) {
    const tag = mockTagFactory(card, secIdx, cardIdx);
    const modeName = (card.title || "SW").replace(/\s*\(.+\)\s*$/, "");
    // blocos reais reutilizados pelos editores
    const selCell = (label, value, tagHtml) => `
      <label class="bf-extras-cell mn-cell">${tagHtml || ""}
        <span class="bf-field-label">${esc(label)}</span>
        <div class="bf-select-wrap">
          <button type="button" class="bf-input bf-select bf-select-btn" tabindex="-1"><span class="value">${esc(value)}</span></button>
          <span class="bf-select-chev">▾</span>
        </div>
      </label>`;
    const typeBtn = (isPc, tagHtml) => `
      <button type="button" class="bf-input bf-input-num bf-macros-slot-type ${isPc ? "is-pc" : "is-cc"} mn-cell" tabindex="-1">${tagHtml || ""}${isPc ? "ENVIAR PC" : "ENVIAR CC"}</button>`;
    const slotHead = (isPc, ch, tagHtml) => `
      <div class="bf-macros-slot-head">
        ${typeBtn(isPc, tagHtml)}
        <div class="bf-select-wrap bf-macros-slot-ch">
          <button type="button" class="bf-input bf-select bf-select-btn" tabindex="-1"><span class="value">${esc(ch)}</span></button>
          <span class="bf-select-chev">▾</span>
        </div>
      </div>`;
    const arcLed = (label, color, tagHtml) => `
      <div class="bf-sw-opt-led mn-cell">${tagHtml || ""}
        <div class="bf-sw-fx1-led">
          <div class="bf-fsw">
            <span class="bf-fsw-glyph" style="--led-c:${color}">${fswArcSvg(color)}</span>
            <span class="bf-fsw-label">${esc(label)}</span>
          </div>
        </div>
      </div>`;
    const toggleOpt = (name, sub, on) => `
      <div class="bf-sw-opt-row">
        <div class="bf-sw-opt-text">
          <span class="bf-sw-opt-name">${esc(name)}</span>
          <span class="bf-sw-opt-sub">${esc(sub)}</span>
        </div>
        <button type="button" class="bf-toggle${on ? " is-on" : ""}" tabindex="-1"><span class="bf-toggle-knob"></span></button>
      </div>`;
    const optCard = (opts) => `
      <div class="bf-sw-studio bf-sw-opt-card mn-cell">${opts.tagCard || ""}
        <div class="bf-sw-studio-head">
          <span class="bf-sw-studio-title">Opções</span>
          <span class="bf-sw-studio-eyebrow">DISPARO · LED</span>
        </div>
        <div class="bf-sw-opt-body${opts.fav ? " has-fav" : ""}">
          <div class="bf-sw-opt-toggles">
            ${opts.noFires ? "" : toggleOpt("Dispara no preset", "MIDI no load", true)}
            ${opts.noStart ? "" : toggleOpt("Começa ON", "Estado inicial", false)}
          </div>
          ${opts.fav ? `
          <button type="button" class="bf-sw-opt-fav mn-cell" tabindex="-1">${opts.tagFav || ""}
            <svg viewBox="0 0 24 24" class="bf-sw-opt-fav-ico" aria-hidden="true">
              <path d="M12 2.5 L14.7 9 L21.5 9.6 L16.3 14.2 L17.9 21 L12 17.3 L6.1 21 L7.7 14.2 L2.5 9.6 L9.3 9 Z"/>
            </svg>
            <span class="bf-sw-opt-fav-label">FAVORITO</span>
          </button>` : ""}
          ${arcLed("LED", opts.ledColor || "#30d158", opts.tagLed)}
        </div>
      </div>`;
    const slotActions = (removeLbl, addLbl, tagHtml) => `
      <div class="bf-tap-slot-actions mn-cell">${tagHtml || ""}
        <button type="button" class="bf-tap-action bf-tap-action-remove" tabindex="-1">${esc(removeLbl)}</button>
        <button type="button" class="bf-tap-action bf-tap-action-add" tabindex="-1">${esc(addLbl)}</button>
      </div>`;
    const studio = (title, eyebrow, inner, tagHtml, cls) => `
      <div class="bf-sw-studio${cls ? " " + cls : ""} mn-cell">${tagHtml || ""}
        <div class="bf-sw-studio-head">
          <span class="bf-sw-studio-title">${esc(title)}</span>
          <span class="bf-sw-studio-eyebrow">${esc(eyebrow)}</span>
        </div>
        ${inner}
      </div>`;

    let body = "";
    let displayTab = false;
    switch (card.mockType) {
      case "sw-stomp":
        body = `<div class="bf-sw-fx1">
          <div class="bf-seg mn-stomp-seg mn-cell">${tag("secoes")}
            <button type="button" class="is-active" tabindex="-1">CLICK CURTO</button>
            <button type="button" tabindex="-1">CLICK LONGO</button>
            <button type="button" tabindex="-1">RECLICK</button>
          </div>
          <div class="bf-extras-row">
            ${selCell("CC", "49 - Stomp A", tag("cc"))}
            ${selCell("Canal", "1", tag("canal"))}
          </div>
          <div class="bf-extras-row">
            ${typeBtn(false, tag("tipo"))}
            <button type="button" class="bf-input bf-input-num mn-cell" tabindex="-1">${tag("custom")}CUSTOM</button>
          </div>
          ${optCard({ fav: true, tagCard: tag("opcoes"), tagFav: tag("favorito"), tagLed: tag("led") })}
        </div>`;
        break;

      case "sw-macros":
        body = `<div class="bf-sw-fx1 bf-sw-macros">
          <div class="bf-macros-slot mn-cell">${tag("slot")}
            <div class="bf-slot-title">Slot 1</div>
            ${slotHead(false, "CH 1", tag("tipo"))}
            <div class="bf-extras-row bf-macros-slot-fields">
              ${selCell("CC", "49")}
              ${selCell("ON", "127", tag("valores"))}
              ${selCell("OFF", "0")}
            </div>
          </div>
          <div class="bf-macros-slot">
            <div class="bf-slot-title">Slot 2</div>
            ${slotHead(true, "CH 2")}
            <div class="bf-extras-row bf-macros-slot-fields is-pc">
              ${selCell("PC ON", "5")}
              ${selCell("PC OFF", "OFF")}
            </div>
          </div>
          ${slotActions("REMOVER SLOT", "ADICIONAR SLOT", tag("slots"))}
          ${optCard({ tagCard: tag("opcoes"), tagLed: tag("led") })}
        </div>`;
        break;

      case "sw-momentary":
        body = `<div class="bf-sw-fx1 bf-sw-macros bf-sw-single bf-sw-tap">
          <div class="bf-macros-slot bf-tap-slot bf-mom-slot mn-cell">${tag("slot")}
            <div class="bf-slot-title">Slot 1</div>
            <div class="bf-extras-row bf-tap-slot-row bf-mom-slot-row">
              ${selCell("CC", "64 - Sustain")}
              ${selCell("Canal", "1")}
            </div>
            <div class="bf-extras-row bf-tap-slot-row bf-mom-slot-row2">
              ${selCell("ON", "127", tag("valores"))}
              ${selCell("OFF", "0")}
            </div>
          </div>
          <div class="bf-extras-row bf-sw-fx1-test">
            <button type="button" class="bf-input bf-input-num mn-cell" tabindex="-1">${tag("pulso")}PULSO</button>
            <div class="bf-sw-fx1-led mn-cell">${tag("led")}
              <div class="bf-fsw">
                <span class="bf-fsw-glyph" style="--led-c:#0a84ff">${fswArcSvg("#0a84ff")}</span>
                <span class="bf-fsw-label">LED</span>
              </div>
            </div>
          </div>
          ${slotActions("REMOVER SLOT", "ADICIONAR SLOT", tag("slots"))}
        </div>`;
        break;

      case "sw-tap":
        body = `<div class="bf-sw-fx1 bf-sw-macros bf-sw-single bf-sw-tap">
          <div class="bf-macros-slot bf-tap-slot mn-cell">${tag("slot")}
            <div class="bf-slot-title">Slot 1</div>
            <div class="bf-extras-row bf-tap-slot-row bf-tap-cc-row">
              ${selCell("CC", "64 - Tap Tempo")}
              ${selCell("Canal", "1")}
            </div>
            <div class="bf-extras-row bf-tap-slot-row bf-tap-mode-row">
              <button type="button" class="bf-tap-mode-btn is-mode-1 mn-cell" tabindex="-1">${tag("modo")}MODE 1</button>
            </div>
          </div>
          <div class="bf-macros-slot bf-tap-slot bf-tap-lp-slot mn-cell">${tag("segurar")}
            <div class="bf-tap-lp-title">SEGURAR</div>
            <div class="bf-extras-row bf-tap-slot-row bf-tap-lp-row">
              ${selCell("CC", "31")}
              ${selCell("Canal", "2")}
            </div>
            <div class="bf-extras-row bf-tap-slot-row bf-tap-lp-row2">
              ${selCell("ON", "127")}
              ${selCell("OFF", "0")}
            </div>
          </div>
          ${optCard({ tagCard: tag("opcoes"), tagLed: tag("led") })}
          ${slotActions("REMOVER", "ADICIONAR TAP", tag("slots"))}
        </div>`;
        break;

      case "sw-spin": {
        const cyc = (n, val, pct, active) => `
          <div class="bf-spin-cyc-row${active ? " is-active" : ""}">
            <button type="button" class="bf-spin-cyc-px" tabindex="-1"><span class="bf-spin-cyc-dot" aria-hidden="true"></span>PX ${n}</button>
            <div class="bf-select-wrap bf-spin-cyc-sel">
              <button type="button" class="bf-input bf-select bf-select-btn" tabindex="-1"><span class="value">${val}</span></button>
              <span class="bf-select-chev">▾</span>
            </div>
            <input type="range" class="bf-spin-slider bf-spin-cyc-slider" min="0" max="127" value="${val}" style="--pct:${pct}%" tabindex="-1">
            <span class="bf-spin-cyc-pct">${pct}%</span>
          </div>`;
        body = `<div class="bf-sw-fx1 bf-sw-spin">
          <div class="bf-seg bf-sw-fx2-tabs bf-spin-tabs mn-cell">${tag("slots")}
            <button type="button" class="is-active" tabindex="-1">SLOT 1 •</button>
            <button type="button" tabindex="-1">SLOT 2</button>
            <button type="button" tabindex="-1">SLOT 3</button>
          </div>
          ${studio("Mensagem MIDI", "CC · Canal", `
            <div class="bf-extras-row">
              ${selCell("CC", "7 - Volume")}
              ${selCell("Canal", "1")}
            </div>`, tag("msg"))}
          ${studio("Ciclo de 3 estados", "PX 1 → 2 → 3", `
            ${cyc(1, 0, 0, true)}
            ${cyc(2, 64, 50, false)}
            ${cyc(3, 127, 100, false)}
            <button type="button" class="bf-input bf-input-num bf-spin-atpreset is-active mn-cell" tabindex="-1">${tag("atpreset")}DISPARA NO PRESET</button>`, tag("ciclo"))}
          ${studio("LED", "COR DO PIXEL ATIVO", `
            <div class="bf-spin-led-body">
              <div class="bf-sw-fx1-led">
                <div class="bf-fsw">
                  <span class="bf-fsw-glyph" style="--led-c:#ff6a1f">${fswArcSvg("#ff6a1f")}</span>
                  <span class="bf-fsw-label">ATIVO</span>
                </div>
              </div>
              <p class="bf-spin-led-desc">Cada press cicla PX 1 → 2 → 3. O LED mostra o estado atual com a cor do pixel ativo.</p>
            </div>`, tag("led"), "bf-spin-card-led")}
          ${studio("SEGURAR", "CC · Canal", `
            <div class="bf-extras-row">
              ${selCell("CC", "31")}
              ${selCell("Canal", "2")}
            </div>
            <div class="bf-extras-row">
              ${selCell("ON", "127")}
              ${selCell("OFF", "0")}
            </div>
            <div class="bf-spin-led-body" style="margin-top:12px">
              <div class="bf-sw-fx1-led">
                <div class="bf-fsw">
                  <span class="bf-fsw-glyph" style="--led-c:#bf5af2">${fswArcSvg("#bf5af2")}</span>
                  <span class="bf-fsw-label">SEGURAR</span>
                </div>
              </div>
              <p class="bf-spin-led-desc">Quando o long-press está ON, os 2 pixels que o SPIN não está usando acendem nesta cor.</p>
            </div>`, tag("segurar"))}
        </div>`;
        break;
      }

      case "sw-ramp":
        body = `<div class="bf-sw-fx1 bf-sw-macros bf-sw-single bf-sw-ramp">
          <div class="bf-extras-row">
            ${selCell("CC", "7 - Volume", tag("cccanal"))}
            ${selCell("Canal", "1")}
          </div>
          <div class="bf-extras-row">
            ${selCell("MIN", "0", tag("minmax"))}
            ${selCell("MAX", "127")}
          </div>
          <div class="bf-ramp-time-grid mn-cell">${tag("tempos")}
            <div class="bf-ramp-time-col">
              <label class="bf-extras-cell">
                <span class="bf-field-label">SUBIDA (ms)</span>
                <div class="bf-input bf-input-num"><span class="value">1000</span></div>
              </label>
              <input type="range" class="bf-spin-slider bf-ramp-time-slider" min="100" max="3000" value="1000" tabindex="-1">
            </div>
            <div class="bf-ramp-time-col">
              <label class="bf-extras-cell">
                <span class="bf-field-label">DESCIDA (ms)</span>
                <div class="bf-input bf-input-num"><span class="value">500</span></div>
              </label>
              <input type="range" class="bf-spin-slider bf-ramp-time-slider" min="100" max="3000" value="500" tabindex="-1">
            </div>
          </div>
          <div class="bf-extras-row bf-ramp-segmented mn-cell">${tag("curva")}
            <button type="button" class="bf-input bf-input-num is-active" tabindex="-1">LINEAR</button>
            <button type="button" class="bf-input bf-input-num" tabindex="-1">EXP</button>
            <button type="button" class="bf-input bf-input-num" tabindex="-1">LOG</button>
            <button type="button" class="bf-input bf-input-num" tabindex="-1">SINE</button>
          </div>
          <div class="bf-extras-row bf-ramp-segmented mn-cell">${tag("trigger")}
            <button type="button" class="bf-input bf-input-num is-active" tabindex="-1">TOGGLE</button>
            <button type="button" class="bf-input bf-input-num" tabindex="-1">HOLD</button>
            <button type="button" class="bf-input bf-input-num" tabindex="-1">LOOP</button>
          </div>
          <div class="bf-extras-row bf-sw-fx1-test">
            <button type="button" class="bf-input bf-input-num mn-cell" tabindex="-1">${tag("sweep")}SWEEP</button>
            <div class="bf-sw-fx1-led mn-cell">${tag("led")}
              <div class="bf-fsw">
                <span class="bf-fsw-glyph" style="--led-c:#30d158">${fswArcSvg("#30d158")}</span>
                <span class="bf-fsw-label">LED</span>
              </div>
            </div>
          </div>
        </div>`;
        break;

      case "sw-single":
        body = `<div class="bf-sw-fx1 bf-sw-macros bf-sw-single">
          <div class="bf-macros-slot mn-cell">${tag("slot")}
            <div class="bf-slot-title">Slot 1</div>
            ${slotHead(false, "CH 1", tag("tipo"))}
            <div class="bf-extras-row bf-macros-slot-fields is-pc">
              ${selCell("CC", "49 - Boost")}
              ${selCell("Valor", "127", tag("valor"))}
            </div>
          </div>
          <div class="bf-macros-slot">
            <div class="bf-slot-title">Slot 2</div>
            ${slotHead(true, "CH 2")}
            <div class="bf-extras-row bf-macros-slot-fields is-pc">
              <label class="bf-extras-cell">
                <span class="bf-field-label">PC</span>
                <div class="bf-input"><span class="value">128</span></div>
              </label>
            </div>
          </div>
          ${slotActions("REMOVER SLOT", "ADICIONAR SLOT", tag("slots"))}
          ${optCard({ noStart: true, tagCard: tag("opcoes"), tagLed: tag("led") })}
        </div>`;
        break;

      case "sw-mute":
        body = `<div class="bf-sw-card-empty">MUTE — sem disparo. Escolha um modo acima.</div>`;
        break;

      case "sw-display": {
        displayTab = true;
        const colorCell = (state, bg) => `
          <div class="bf-sw-disp-color-cell">
            <span class="bf-sw-disp-color-state">${state}</span>
            <button type="button" class="bf-color-bar" tabindex="-1" style="background:${bg}"></button>
          </div>`;
        const colorRow = (label, offBg, onBg) => `
          <div class="bf-sw-disp-color">
            <div class="bf-sw-disp-color-label">${esc(label)}</div>
            <div class="bf-sw-disp-color-swatches">
              ${colorCell("OFF", offBg)}
              <span class="bf-sw-disp-color-sep">—</span>
              ${colorCell("ON", onBg)}
            </div>
          </div>`;
        body = `<div class="bf-sw-disp">
          <div class="bf-sw-disp-colors mn-cell">${tag("cores")}
            ${colorRow("ÍCONE", "#6e6e76", "#ff453a")}
            ${colorRow("FUNDO", "transparent", "transparent")}
            ${colorRow("BORDA", "#6e6e76", "#ff453a")}
          </div>
          <div class="bf-sw-disp-preview-row">
            <button type="button" class="bf-sw-disp-preview mn-cell" tabindex="-1">${tag("preview")}
              <span class="mn-disp-tile">
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#ff453a" stroke-width="2" stroke-linecap="round">
                  <circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.4" fill="#ff453a" stroke="none"/>
                </svg>
                <span class="mn-disp-sigla">DRV</span>
              </span>
            </button>
            <div class="bf-sw-disp-toggles">
              <button type="button" class="bf-input bf-input-num is-active mn-cell" tabindex="-1">${tag("previa")}PRÉVIA ON</button>
              <label class="bf-field bf-sw-disp-sigla mn-cell">${tag("sigla")}
                <span class="bf-field-label">NOME DO ÍCONE / SIGLA</span>
                <div class="bf-input"><span class="value">DRV</span></div>
              </label>
            </div>
          </div>
        </div>`;
        break;
      }
    }

    return `<div class="mn-block-label">${esc(t("previewMode", { m: modeName }))}</div>
      <div class="mn-mock mn-mock-sw bf-screen">
        <div class="bf-content-bank">
        <div class="bf-sw-card">
          <div class="bf-sw-card-tabs">
            <div class="bf-sw-card-iconrow">
              <button type="button" class="bf-sw-card-tab${displayTab ? "" : " is-active"}" tabindex="-1">${swIcon("gear")}</button>
              <button type="button" class="bf-sw-card-tab${displayTab ? " is-active" : ""}" tabindex="-1">${swIcon("display")}</button>
              <div class="bf-sw-card-copypaste">
                <button type="button" class="bf-sw-card-cp" tabindex="-1">${swIcon("copy")}</button>
                <button type="button" class="bf-sw-card-cp" tabindex="-1" disabled>${swIcon("paste")}</button>
              </div>
            </div>
            <button type="button" class="bf-sw-mode-field" tabindex="-1">
              ${swIcon("mode")}
              <span class="bf-sw-mode-field-name">${esc(card.mockMode || modeName)}</span>
            </button>
          </div>
          <div class="bf-sw-card-body">${body}</div>
        </div>
        </div>
      </div>`;
  }

  // SYSTEM > WIFI — os 3 cards REAIS do webApp (Estado da conexão / Conexão /
  // Redes próximas), markup bf-wifi-* e bfg-wifi-* idêntico ao app.jsx,
  // embrulhado em .bf-content-system (escopo dos estilos Studio). As tags
  // numeradas vêm de card.mockTags = { estado, status, ssid, senha, buscar,
  // conectar, redes } — chave ausente = sem tag (permite reusar o mock com
  // listas de campos diferentes em seções diferentes).
  function renderWifiSysMock(card, secIdx, cardIdx) {
    const tags = card.mockTags || {};
    const tag = (k) => {
      const n = tags[k];
      return n ? `<button class="mk-tag" type="button" data-info="${secIdx}.${cardIdx}.${n - 1}"
        title="${esc(t("tagFieldTitle", { n }))}" aria-label="${esc(t("tagFieldAria", { n }))}">${n}</button>` : "";
    };
    // Ícones reais dos 4 estados (copiados do app.jsx, atributos em kebab-case)
    const icoCommon = 'width="46" height="46" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"';
    const stateIcos = [
      `<svg viewBox="0 0 48 48" ${icoCommon} stroke-width="2.4"><path d="M9 19 Q24 6 39 19"/><path d="M14 25 Q24 16 34 25" opacity="0.85"/><path d="M19 31 Q24 26 29 31"/><circle cx="24" cy="37" r="1.7" fill="currentColor" stroke="none"/><line x1="9" y1="9" x2="39" y2="39"/></svg>`,
      `<svg viewBox="0 0 48 48" ${icoCommon} stroke-width="2.2"><rect x="4" y="16" width="15" height="17" rx="2.5"/><line x1="8" y1="20.5" x2="15" y2="20.5"/><rect x="31" y="13" width="13" height="22" rx="2.5"/><line x1="34.5" y1="31.5" x2="40.5" y2="31.5"/><path d="M22 25 Q24 22 26 25"/><path d="M20.5 27 Q24 21 27.5 27" opacity="0.55"/></svg>`,
      `<svg viewBox="0 0 48 48" ${icoCommon} stroke-width="2.2"><rect x="16" y="5" width="16" height="9" rx="1.5"/><line x1="20" y1="5" x2="20" y2="1.5"/><line x1="28" y1="5" x2="28" y2="1.5"/><circle cx="24" cy="9.5" r="1.1" fill="currentColor" stroke="none"/><rect x="4" y="31" width="15" height="12" rx="2.5"/><line x1="8" y1="35" x2="15" y2="35"/><rect x="32" y="29" width="12" height="15" rx="2.5"/><path d="M18 14 L12 31" opacity="0.6"/><path d="M30 14 L37 29" opacity="0.6"/></svg>`,
      `<svg viewBox="0 0 48 48" ${icoCommon} stroke-width="2.2"><line x1="24" y1="40" x2="24" y2="9"/><path d="M20 13 L24 7 L28 13"/><circle cx="24" cy="41" r="2.1" fill="currentColor" stroke="none"/><path d="M24 23 L31.5 18.5"/><circle cx="33" cy="17.5" r="2.4"/><path d="M24 29 L16.5 24.5"/><rect x="12.5" y="21.5" width="5.2" height="5.2" rx="0.6" fill="currentColor" stroke="none"/></svg>`
    ];
    const stateTxts = [
      "Sua controladora não está conectada a nenhum WiFi. Conecte-se ao WiFi BFMIDI_WIFI com a senha bfmidi@editor.",
      "Sua controladora está conectada diretamente ao WiFi da controladora.",
      "Sua controladora está conectada ao seu roteador.",
      "Sua controladora está se comunicando via USB."
    ];
    const states = stateTxts.map((txt, i) => `
      <div class="bf-wifi-state${i === 0 ? " is-active" : ""}">
        <div class="bf-wifi-state-ico">${stateIcos[i]}</div>
        <p class="bf-wifi-state-txt">${esc(txt)}</p>
      </div>`).join("");

    return `<div class="mn-block-label">${esc(t("previewReal"))}</div>
      <div class="mn-mock mn-mock-wifi bf-screen">
        <div class="bf-content-system">

          <div class="bf-card">
            ${tag("estado")}
            <div class="bf-card-head"><h3>Estado da conexão</h3></div>
            <div class="bf-wifi-states">${states}</div>
          </div>

          <div class="bf-card">
            <div class="bf-card-head"><h3>Conexão</h3><span class="meta">AP · OFFLINE</span></div>
            <div class="bfg-wifi-status mn-cell">${tag("status")}
              <div class="bfg-wifi-status-ico">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 8.5 Q12 0 22 8.5"/><path d="M5 13 Q12 6 19 13"/><path d="M8.5 17.5 Q12 14 15.5 17.5"/><circle cx="12" cy="21" r="1.2" fill="currentColor"/>
                </svg>
              </div>
              <div class="bfg-wifi-status-text">
                <span class="bfg-wifi-status-ssid">Apenas AP</span>
                <span class="bfg-wifi-status-sub">192.168.4.1</span>
              </div>
            </div>
            <div class="bfg-select-box mn-cell" style="margin-top:12px">${tag("ssid")}
              <span class="bfg-select-eyebrow">SSID</span>
              <button type="button" class="bf-input bf-select bfg-select-lg" tabindex="-1">SELECIONAR REDE</button>
              <span class="bf-select-chev bfg-select-chev">▾</span>
            </div>
            <div class="bfg-select-box mn-cell" style="margin-top:8px">${tag("senha")}
              <span class="bfg-select-eyebrow">SENHA</span>
              <input class="bf-input bfg-select-lg" type="text" placeholder="senha da rede" readonly tabindex="-1">
            </div>
            <div class="bfg-wifi-actions">
              <span class="mn-cell">${tag("buscar")}<button type="button" class="bfg-btn" tabindex="-1">BUSCAR</button></span>
              <span class="mn-cell">${tag("conectar")}<button type="button" class="bfg-btn bfg-btn-primary" tabindex="-1">CONECTAR</button></span>
            </div>
            <div class="bfg-wifi-warn">BUSCAR disponível só em modo AP ou USB — em STA ele derrubaria a conexão atual.</div>
            <p class="bf-hint">Só redes 2,4 GHz aparecem (limitação do chip). Se a sua rede não aparecer, ative a banda 2,4 GHz no roteador ou use o nome da rede 2,4.</p>
          </div>

          <div class="bf-card">
            ${tag("redes")}
            <div class="bf-card-head"><h3>Redes próximas</h3><span class="meta">0 ENCONTRADAS</span></div>
            <div class="bfg-wifi-list">
              <div class="bfg-wifi-empty">Nenhuma rede — clique em BUSCAR.</div>
            </div>
          </div>

        </div>
      </div>`;
  }

  /* ─────────── GLOBAL — cards reais do webApp (Studio bfg-*) ───────────
     Replica os cards da página GLOBAL com o markup verdadeiro do app.jsx,
     embrulhados em .bf-content-global (escopo dos estilos Studio + tema
     claro). Dispatch por card.mockType ("g-match", "g-kemper", …); as tags
     numeradas vêm de card.mockTags { chave: n } como no wifi-sys. */
  function renderGlobalMock(card, secIdx, cardIdx) {
    const tags = card.mockTags || {};
    // span (não <button>): a tag mora dentro de botões reais do app
    // (bfg-toggle-card, bfg-media-tile, bfg-sum-pill) e um <button> aninhado
    // fecharia o pai no parser HTML, derramando o conteúdo pra fora.
    const tag = (k) => {
      const n = tags[k];
      return n ? `<span class="mk-tag" role="button" tabindex="0" data-info="${secIdx}.${cardIdx}.${n - 1}"
        title="${esc(t("tagFieldTitle", { n }))}" aria-label="${esc(t("tagFieldAria", { n }))}">${n}</span>` : "";
    };
    // blocos reutilizados (markup real do app)
    const toggleRow = (k, label, sub, on) => `
      <div class="bf-auto-row mn-cell">${tag(k)}
        <div class="bfg-toggle-text">
          <span class="label">${esc(label)}</span>
          ${sub ? `<span class="bfg-toggle-sub">${esc(sub)}</span>` : ""}
        </div>
        <button type="button" class="bf-switch is-accent${on ? " is-on" : ""}" tabindex="-1"></button>
      </div>`;
    const seg = (k, opts, activeIdx) => `
      <div class="bf-seg mn-cell">${tag(k)}
        ${opts.map((o, i) => `<button type="button"${i === activeIdx ? ' class="is-active"' : ""} tabindex="-1">${esc(o)}</button>`).join("")}
      </div>`;
    const toggleCard = (k, label, sub, on, variant) => `
      <button type="button" class="bfg-toggle-card ${variant || "bfg-layer-toggle"} mn-cell${on ? " is-on" : ""}" tabindex="-1">${tag(k)}
        <div class="bfg-toggle-text">
          <span class="label">${esc(label)}</span>
          <span class="bfg-toggle-sub">${esc(sub)}</span>
        </div>
        <span class="bfg-toggle-pill" aria-hidden="true">
          <span class="bfg-toggle-state">${on ? "ON" : "OFF"}</span>
          <span class="bfg-toggle-dot"></span>
        </span>
      </button>`;
    const bright = (k, pct, mid) => `
      <div class="mn-cell">${tag(k)}
        <div class="bfg-bright">
          <input type="range" class="bfg-bright-input" min="0" max="100" value="${pct}" style="--p:${pct}%" tabindex="-1">
          <div class="bfg-bright-marks"><span>MIN</span><span class="bfg-bright-now">${esc(mid)}</span><span>MAX</span></div>
        </div>
      </div>`;
    const fswArc = (label, color, off) => `
      <div class="bf-fsw">
        <span class="bf-fsw-glyph" style="--led-c:${color}">
          <svg class="bf-fsw-arcs" viewBox="0 0 72 72">${[90, 210, 330].map((a) => {
            const a1 = (a - 36) * Math.PI / 180, a2 = (a + 36) * Math.PI / 180;
            const x1 = 36 + 30 * Math.cos(a1), y1 = 36 + 30 * Math.sin(a1);
            const x2 = 36 + 30 * Math.cos(a2), y2 = 36 + 30 * Math.sin(a2);
            return `<path d="M ${x1} ${y1} A 30 30 0 0 1 ${x2} ${y2}" stroke="${off ? "#26262a" : color}"/>`;
          }).join("")}</svg>
        </span>
        <span class="bf-fsw-label">${esc(label)}</span>
      </div>`;
    // mini-sketch dos 4 layouts (porte do GLayoutMiniSketch, iconShape padrão)
    const sketch = (layout, sel) => {
      const stroke = sel ? "var(--accent)" : "color-mix(in srgb, var(--text) 55%, transparent)";
      const fill = sel ? "var(--accent)" : "color-mix(in srgb, var(--text) 45%, transparent)";
      const op = sel ? 1 : 0.6;
      const tile = (x, y, tw, th) => `<rect x="${x}" y="${y}" width="${tw}" height="${th}" rx="1.5" fill="none" stroke="${stroke}" stroke-width="0.9" opacity="${op}"/>`;
      const band = (x, y, tw, th) => `<rect x="${x}" y="${y}" width="${tw}" height="${th}" rx="1" fill="${fill}" opacity="${sel ? 0.9 : 0.5}"/>`;
      let c = "";
      if (layout === 0) c = `<line x1="25" y1="25" x2="53" y2="25" stroke="${stroke}" stroke-width="1.4" stroke-linecap="round" opacity="${op}"/>`;
      else if (layout === 1) c = [0, 1, 2].map((i) => tile(4 + i * 24, 4, 20, 14)).join("") + band(4, 20, 70, 7) + [0, 1, 2].map((i) => tile(4 + i * 24, 30, 20, 14)).join("");
      else if (layout === 2) c = [0, 1, 2].map((i) => tile(4 + i * 24, 4, 20, 19)).join("") + [0, 1, 2].map((i) => tile(4 + i * 24, 26, 20, 19)).join("");
      else if (layout === 3) c = band(4, 4, 70, 13) + [0, 1, 2, 3, 4, 5].map((i) => tile(4 + i * 12, 20, 9, 25)).join("");
      else if (layout === 5) c = [0, 1, 2].map((i) => band(24, 4.5 + i * 5, 30, 2.5)).join("") + `<rect x="8" y="20.5" width="62" height="9" rx="2" fill="none" stroke="${stroke}" stroke-width="1.1" opacity="${op}"/>` + band(18, 23.5, 42, 3) + [0, 1, 2].map((i) => band(24, 33 + i * 5, 30, 2.5)).join("");
      else c = band(4, 4, 70, 10) + [0, 1, 2, 3, 4, 5].map((i) => tile(4 + i * 12, 16, 9, 13)).join("") + [0, 1, 2, 3, 4, 5].map((i) => tile(4 + i * 12, 31, 9, 13)).join("");
      return `<svg width="78" height="50" viewBox="0 0 78 50" style="display:block">
        <rect x="0" y="0" width="78" height="50" rx="3" fill="${sel ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "rgba(255,255,255,0.025)"}" stroke="${sel ? "color-mix(in srgb, var(--accent) 50%, transparent)" : "rgba(255,255,255,0.07)"}" stroke-width="0.8"/>${c}</svg>`;
    };
    const head = (title, meta) => `<div class="bf-card-head"><h3>${esc(title)}</h3>${meta ? `<span class="meta">${esc(meta)}</span>` : ""}</div>`;

    let body = "";
    switch (card.mockType) {
      case "g-match":
        body = `
          <div class="bf-card">
            ${head("MODO AMIGÁVEL", "MULTIPLE MODE")}
            <div class="bfg-select-box mn-cell">${tag("alvo")}
              <span class="bfg-select-eyebrow">ALVO DO MAPEAMENTO PC/CC</span>
              <button type="button" class="bf-input bf-select bfg-select-lg" tabindex="-1">MULTIPLE MODE — por canal</button>
              <span class="bf-select-chev bfg-select-chev">▾</span>
            </div>
            <div style="height:10px"></div>
            <div class="bfg-ch-grid">
              <div style="display:flex;align-items:stretch;gap:8px">
                <label class="bfg-ch-tile mn-cell" style="flex:1;min-width:0">${tag("canais")}
                  <span class="bfg-ch-cap">CH 1</span>
                  <span class="bfg-ch-val">AMPERO AS2</span>
                </label>
                <div class="mn-glivecc mn-cell">${tag("livecc")}
                  <span class="mn-glivecc-cap">CC no LIVE</span>
                  <span class="mn-glivecc-box">48</span>
                </div>
              </div>
              <div style="display:flex;align-items:stretch;gap:8px">
                <label class="bfg-ch-tile" style="flex:1;min-width:0">
                  <span class="bfg-ch-cap">CH 2</span>
                  <span class="bfg-ch-val">KEMPER PLAYER</span>
                </label>
                <div class="mn-glivecc">
                  <span class="mn-glivecc-cap">CC no LIVE</span>
                  <span class="mn-glivecc-box">—</span>
                </div>
              </div>
            </div>
            <p class="bf-hint" style="margin-top:6px">CC enviado no canal ao ENTRAR no LIVE (127) e SAIR (0) — pra pedais que acompanham a tela.</p>
            <div style="height:12px"></div>
            ${toggleRow("omitir", "Omitir PC/CC sem nome", "ESCONDE COMANDOS NÃO MAPEADOS", true)}
          </div>`;
        break;

      case "g-kemper":
        body = `
          <div class="bf-card">
            ${head("Kemper Player", "EXCLUSIVO")}
            ${toggleRow("getnames", "GET NAMES", "Pega o nome do rig no Kemper Player e mostra no display", true)}
            <div style="height:12px"></div>
            ${toggleRow("seguir", "SEGUIR O KEMPER", "Quando o Kemper troca de rig, a controladora muda pro preset salvo que casa", false)}
            <div style="height:12px"></div>
            <div class="bfg-toggle-text" style="margin-bottom:8px">
              <span class="label">TELA DO AFINADOR</span>
              <span class="bfg-toggle-sub">Estilo da tela do afinador do Kemper no display</span>
            </div>
            ${seg("afinador", ["ARCO", "BARRA", "LEDS"], 0)}
            <div style="height:12px"></div>
            <div class="mn-cell">${tag("aquisicao")}
              <div class="bfg-toggle-text" style="margin-bottom:8px">
                <span class="label">AQUISIÇÃO DE DADOS</span>
                <span class="bfg-toggle-sub">Quanto do que o Kemper envia é mostrado — Suave = 1 de cada 10, Rápido = todos</span>
              </div>
              <div style="padding:16px 16px 12px;border-radius:14px;border:2px solid transparent;background:linear-gradient(180deg, rgba(0,0,0,0.18), rgba(0,0,0,0.30)) padding-box, var(--bevel-edge) border-box;box-shadow:var(--bevel-relief)">
                <div class="bfg-bright">
                  <input type="range" class="bfg-bright-input" min="0" max="4" value="2" style="--p:50%" tabindex="-1">
                  <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--muted);margin-top:10px">
                    <span>Suave</span><span>Nível 3</span><span>Rápido</span>
                  </div>
                </div>
              </div>
            </div>
          </div>`;
        break;

      case "g-swglobal": {
        // editor STOMP real embutido (SW Global usa hideAtPreset: o card
        // OPÇÕES tem só "Começa ON" + FAVORITO + LED — nunca dispara no preset)
        const cell = (label, value) => `
          <label class="bf-extras-cell">
            <span class="bf-field-label">${esc(label)}</span>
            <div class="bf-select-wrap">
              <button type="button" class="bf-input bf-select bf-select-btn" tabindex="-1"><span class="value">${esc(value)}</span></button>
              <span class="bf-select-chev">▾</span>
            </div>
          </label>`;
        body = `
          <div class="bf-card">
            ${head("SW Global", "STOMP")}
            <div class="bf-sw-card-tabs mn-cell">${tag("modo")}
              <button type="button" class="bf-sw-mode-field" tabindex="-1">
                ${swIcon("mode")}
                <span class="bf-sw-mode-field-name">STOMP</span>
              </button>
            </div>
            <div class="bf-sw-global-body">
              <div class="bf-sw-fx1">
                <div class="bf-seg mn-stomp-seg mn-cell">${tag("corpo")}
                  <button type="button" class="is-active" tabindex="-1">CLICK CURTO</button>
                  <button type="button" tabindex="-1">CLICK LONGO</button>
                  <button type="button" tabindex="-1">RECLICK</button>
                </div>
                <div class="bf-extras-row">
                  ${cell("CC", "0")}
                  ${cell("Canal", "OFF")}
                </div>
                <div class="bf-extras-row">
                  <button type="button" class="bf-input bf-input-num bf-macros-slot-type is-cc" tabindex="-1">ENVIAR CC</button>
                  <button type="button" class="bf-input bf-input-num" tabindex="-1">CUSTOM</button>
                </div>
                <div class="bf-sw-studio bf-sw-opt-card">
                  <div class="bf-sw-studio-head">
                    <span class="bf-sw-studio-title">Opções</span>
                    <span class="bf-sw-studio-eyebrow">DISPARO · LED</span>
                  </div>
                  <div class="bf-sw-opt-body has-fav">
                    <div class="bf-sw-opt-toggles">
                      <div class="bf-sw-opt-row">
                        <div class="bf-sw-opt-text">
                          <span class="bf-sw-opt-name">Começa ON</span>
                          <span class="bf-sw-opt-sub">Estado inicial</span>
                        </div>
                        <button type="button" class="bf-toggle" tabindex="-1"><span class="bf-toggle-knob"></span></button>
                      </div>
                    </div>
                    <button type="button" class="bf-sw-opt-fav" tabindex="-1">
                      <svg viewBox="0 0 24 24" class="bf-sw-opt-fav-ico" aria-hidden="true">
                        <path d="M12 2.5 L14.7 9 L21.5 9.6 L16.3 14.2 L17.9 21 L12 17.3 L6.1 21 L7.7 14.2 L2.5 9.6 L9.3 9 Z"/>
                      </svg>
                      <span class="bf-sw-opt-fav-label">FAVORITO</span>
                    </button>
                    <div class="bf-sw-opt-led">
                      <div class="bf-sw-fx1-led">
                        <div class="bf-fsw">
                          <span class="bf-fsw-glyph" style="--led-c:#30d158">${fswArcSvg("#30d158")}</span>
                          <span class="bf-fsw-label">LED</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>`;
        break;
      }

      case "g-exp":
        body = `
          <div class="bf-card">
            ${head("Expressão Externa", "CC7 · CH 01")}
            <div class="bfg-exp-head">
              <span class="mn-cell">${tag("ativar")}<button type="button" class="bf-switch is-accent is-on" tabindex="-1"></button></span>
              <div class="bfg-exp-live mn-cell">${tag("leitura")}
                <span class="bfg-exp-live-cap">LEITURA AO VIVO</span>
                <span class="bfg-exp-live-num">64<span class="bfg-exp-live-of"> / 127</span></span>
              </div>
            </div>
            <div class="bfg-exp-bar"><div class="bfg-exp-bar-fill" style="width:50%"></div></div>
            <button type="button" class="bfg-sum-pill is-open mn-cell" style="margin-top:12px" tabindex="-1">${tag("resumo")}
              <span class="bfg-sum-text">
                <span class="bfg-sum-cap">CC · CANAL · CALIBRAÇÃO</span>
                <span class="bfg-sum-title">CC 7 · CH 01</span>
              </span>
              <span class="bfg-sum-cta">FECHAR ›</span>
            </button>
            <div class="bf-extras-section-title mn-cell" style="display:flex;gap:12px;margin-top:12px">${tag("cccanal")}
              <span style="flex:1">CC</span><span style="flex:1">CANAL</span>
            </div>
            <div style="display:flex;gap:12px">
              <div class="bf-select-wrap" style="flex:1">
                <button type="button" class="bf-input bf-select bf-select-btn" tabindex="-1"><span class="value">7 - Volume</span></button>
                <span class="bf-select-chev">▾</span>
              </div>
              <div class="bf-select-wrap" style="flex:1">
                <button type="button" class="bf-input bf-select bf-select-btn" tabindex="-1"><span class="value">1</span></button>
                <span class="bf-select-chev">▾</span>
              </div>
            </div>
            <div style="height:16px"></div>
            <div class="bf-extras-section-title mn-cell">${tag("calibracao")}CALIBRAÇÃO</div>
            <div class="bf-actions" style="grid-template-columns:1fr 1fr;margin-top:6px">
              <button type="button" class="bf-btn" tabindex="-1">MÍN (0) · 120</button>
              <button type="button" class="bf-btn" tabindex="-1">MÁX (127) · 3980</button>
            </div>
            <div style="display:flex;gap:12px;margin-top:10px">
              <label class="bf-extras-cell" style="flex:1">
                <span class="bf-field-label">MÍN (ADC → 0)</span>
                <div class="bf-input bf-input-num"><span class="value">120</span></div>
              </label>
              <label class="bf-extras-cell" style="flex:1">
                <span class="bf-field-label">MÁX (ADC → 127)</span>
                <div class="bf-input bf-input-num"><span class="value">3980</span></div>
              </label>
            </div>
            <button type="button" class="bf-btn" style="width:100%;margin-top:10px" tabindex="-1">REDEFINIR CALIBRAÇÃO</button>
          </div>`;
        break;

      case "g-extdual": {
        const modeBtns = (active) => `
          <div class="bf-sw-global-modes">
            <button type="button" class="bf-sw-global-mode${active === 0 ? " is-active" : ""}" tabindex="-1">${swIcon("mode")}<span>STOMP</span></button>
            <button type="button" class="bf-sw-global-mode${active === 1 ? " is-active" : ""}" tabindex="-1">${swIcon("mode")}<span>SINGLE</span></button>
          </div>`;
        body = `
          <div class="bf-card">
            ${tag("modo1")}
            ${head("External SW1", "sem LED · só MIDI")}
            ${modeBtns(1)}
            <div class="mk-note">…campos do modo escolhido (iguais ao editor de switch)…</div>
          </div>
          <div class="bf-card">
            ${tag("modo2")}
            ${head("External SW2", "sem LED · só MIDI")}
            ${modeBtns(0)}
            <div class="mk-note">…campos do modo escolhido (iguais ao editor de switch)…</div>
          </div>`;
        break;
      }

      case "g-display":
        body = `
          <div class="bf-card">
            ${head("Gig View", "PADRÃO")}
            ${seg("gig", ["PADRÃO", "SÓ PRESET", "SÓ LIVE"], 0)}
            <div style="height:14px"></div>
            ${toggleRow("nomelive", "Mostrar nome do preset em LIVE", "NAME PRESET · LIVE", true)}
            <div style="height:10px"></div>
            ${toggleRow("nomebank", "Mostrar nome do preset em BANK", "NAME PRESET · BANK", true)}
          </div>
          <div class="bf-card">
            ${head("Layout do modo LIVE", "LAYOUT 3")}
            <div class="bfg-layout-grid mn-cell">${tag("liveLayout")}
              ${[1, 2, 3, 4].map((n) => `
                <button type="button" class="bfg-layout-btn${n === 3 ? " is-on" : ""}" tabindex="-1">
                  ${sketch(n, n === 3)}
                  <span class="bfg-layout-lbl">L${n}</span>
                </button>`).join("")}
            </div>
            <div class="bfg-eyebrow-row mn-cell" style="margin-top:16px">${tag("formato")}FORMATO DO ÍCONE</div>
            ${seg("", ["PADRÃO", "CÍRCULO", "OCTÓGONO"], 0)}
          </div>
          <div class="bf-card">
            ${head("Layout do modo PRESET", "LAYOUT 4")}
            <div class="bfg-layout-grid mn-cell">${tag("presetLayout")}
              ${[[0, "NENHUM"], [1, "L1"], [2, "L2"], [3, "L3"], [4, "L4"], [5, "LISTA"]].map(([n, lbl]) => `
                <button type="button" class="bfg-layout-btn${n === 4 ? " is-on" : ""}" tabindex="-1">
                  ${sketch(n, n === 4)}
                  <span class="bfg-layout-lbl">${lbl}</span>
                </button>`).join("")}
            </div>
            <div class="bfg-eyebrow-row">NENHUM = TELA CLÁSSICA (NOME DO PRESET). LAYOUTS 1–4 MOSTRAM OS ÍCONES DOS SW. LISTA = PRESET ATUAL AO CENTRO, PRÓXIMOS ACIMA E ANTERIORES ABAIXO.</div>
            <div class="bfg-eyebrow-row" style="margin-top:14px">FORMATO DO ÍCONE</div>
            ${seg("", ["PADRÃO", "CÍRCULO", "OCTÓGONO"], 0)}
          </div>`;
        break;

      case "g-media":
        body = `
          <div class="bf-card">
            ${head("Imagens & Ícones", "UPLOAD")}
            <div class="bfg-media-grid">
              <button type="button" class="bfg-media-tile mn-cell" tabindex="-1">${tag("imagens")}
                <span class="bfg-media-ico">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="5" width="18" height="14" rx="1.5"/><circle cx="9" cy="11" r="1.6" fill="currentColor"/><path d="M3 17 L9 12 L14 16 L21 9"/>
                  </svg>
                </span>
                <span class="bfg-media-text">
                  <span class="bfg-media-lbl">Fundo BANK</span>
                  <span class="bfg-media-cnt">03 / 10</span>
                </span>
              </button>
              <button type="button" class="bfg-media-tile mn-cell" tabindex="-1">${tag("icones")}
                <span class="bfg-media-ico">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3" fill="currentColor"/>
                  </svg>
                </span>
                <span class="bfg-media-text">
                  <span class="bfg-media-lbl">Ícones SW</span>
                  <span class="bfg-media-cnt">02 / 10</span>
                </span>
              </button>
            </div>
            <div class="mk-note">Tocar num tile abre o card de upload daquele tipo de mídia (slots, enviar, editar, excluir).</div>
          </div>`;
        break;

      case "g-leds":
        body = `
          <div class="bf-card bfg-led-card bfg-led-card-brightness">
            ${head("Brilho dos LEDs", "PWM · 70%")}
            ${bright("brilho", 70, "70%")}
          </div>
          <div class="bf-card bfg-led-card bfg-led-card-banks">
            ${head("Bancos & Presets", "POR LETRA A-E")}
            ${seg("modo", ["POR LETRA", "POR SWITCH"], 0)}
            <div class="bf-fsw-grid mn-cell">${tag("cores")}
              ${fswArc("BANCO A", "#ff6a1f")}
              ${fswArc("BANCO B", "#0a84ff")}
              ${fswArc("BANCO C", "#30d158")}
              ${fswArc("BANCO D", "#bf5af2")}
              ${fswArc("BANCO E", "#ff453a")}
            </div>
          </div>
          <div class="bf-card bfg-led-card bfg-led-card-preview">
            ${head("Prévia do LED no LIVE", "ON")}
            <div class="bfg-preview-row">
              ${fswArc("SW DESLIGADO", "#ff453a")}
              ${toggleCard("previa", "Prévia do SW desligado", "LED PREVIEW · LIVE", true, "bfg-preview-toggle")}
            </div>
          </div>
          <div class="bf-card bfg-led-card bfg-led-card-dedicated">
            ${head("LEDs Dedicados", "MODO LIVE & LAYER 2")}
            <div class="bf-fsw-grid bfg-fsw-2cols">
              <span class="mn-cell">${tag("ledlive")}${fswArc("MODO LIVE", "#30d158")}</span>
              <span class="mn-cell">${tag("ledlayer")}${fswArc("LAYER 2", "#bf5af2")}</span>
            </div>
            ${toggleCard("layer2", "Ativar Layer 2", "SEGUNDA CAMADA DE FOOTSWITCHES", false)}
          </div>`;
        break;

      case "g-banks":
        body = `
          <div class="bf-card">
            ${head("Início Automático", "PRESET NO BOOT")}
            <div class="bf-auto-row mn-cell">${tag("autostart")}
              <span class="label">Iniciar com preset</span>
              <button type="button" class="bf-switch is-accent is-on" tabindex="-1"></button>
            </div>
            <div style="height:12px"></div>
            ${seg("modo", ["BANCO", "LIVE"], 1)}
            <div class="bf-cycle mn-cell">${tag("alvo")}
              <button type="button" class="is-on" tabindex="-1"><span class="cap">BANCO</span>A</button>
              <button type="button" class="is-on" tabindex="-1"><span class="cap">PRESET</span>1</button>
            </div>
          </div>
          <div class="bf-card">
            ${head("Trocar de Banco", "SELEÇÃO DE PRESETS")}
            ${seg("troca", ["MODO 1 · HÍBRIDO", "MODO 2 · SINGLE"], 0)}
          </div>
          <div class="bf-card">
            ${head("Bancos Ativos", "PULAR DESATIVADOS")}
            <div class="bf-letter-chips mn-cell">${tag("chips")}
              <button type="button" class="is-on" tabindex="-1">A</button>
              <button type="button" class="is-on" tabindex="-1">B</button>
              <button type="button" class="is-on" tabindex="-1">C</button>
              <button type="button" class="is-off" tabindex="-1">D</button>
              <button type="button" class="is-off" tabindex="-1">E</button>
            </div>
          </div>`;
        break;
    }

    return `<div class="mn-block-label">${esc(t("previewReal"))}</div>
      <div class="mn-mock mn-mock-global bf-screen">
        <div class="bf-content-global">${body}</div>
      </div>`;
  }

  // tag-span comum aos mocks de página (mesma razão do g-*: a tag mora
  // dentro de botões reais; <button> aninhado quebraria o parser).
  function mockTagFactory(card, secIdx, cardIdx) {
    const tags = card.mockTags || {};
    return (k) => {
      const n = tags[k];
      return n ? `<span class="mk-tag" role="button" tabindex="0" data-info="${secIdx}.${cardIdx}.${n - 1}"
        title="${esc(t("tagFieldTitle", { n }))}" aria-label="${esc(t("tagFieldAria", { n }))}">${n}</span>` : "";
    };
  }
  const mockHead = (title, meta) => `<div class="bf-card-head"><h3>${esc(title)}</h3>${meta ? `<span class="meta">${esc(meta)}</span>` : ""}</div>`;
  const mockToggleRow = (tagHtml, label, sub, on) => `
    <div class="bf-auto-row mn-cell">${tagHtml}
      <div class="bfg-toggle-text">
        <span class="label">${esc(label)}</span>
        ${sub ? `<span class="bfg-toggle-sub">${esc(sub)}</span>` : ""}
      </div>
      <button type="button" class="bf-switch is-accent${on ? " is-on" : ""}" tabindex="-1"></button>
    </div>`;
  const mockSeg = (tagHtml, opts, activeIdx) => `
    <div class="bf-seg mn-cell">${tagHtml}
      ${opts.map((o, i) => `<button type="button"${i === activeIdx ? ' class="is-active"' : ""} tabindex="-1">${esc(o)}</button>`).join("")}
    </div>`;
  const MN_CONNECTION_MODELS = [
    { id: "BFMIDI-1 7S_A1", tag: "BFMIDI-1", switches: 8, size: "3x3 GRID" },
    { id: "BFMIDI-1 7S_B1", tag: "BFMIDI-1", switches: 8, size: "3x3 GRID" },
    { id: "BFMIDI-1 7S_C1", tag: "BFMIDI-1", switches: 8, size: "3x3 GRID" },
    { id: "BFMIDI-1 4S", tag: "BFMIDI-1", switches: 4, size: "1x4 LAYOUT" },
    { id: "BFMIDI-2 NANO", tag: "BFMIDI-2", switches: 6, size: "2x3 LAYOUT" },
    { id: "BFMIDI-2 MICRO", tag: "BFMIDI-2", switches: 4, size: "2x2 LAYOUT" },
    { id: "BFMIDI-2 4S", tag: "BFMIDI-2", switches: 4, size: "1x4 LAYOUT" },
    { id: "BFMIDI-2 6S", tag: "BFMIDI-2", switches: 6, size: "2x3 LAYOUT" },
    { id: "BFMIDI-2 7S", tag: "BFMIDI-2", switches: 8, size: "3x3 GRID" },
    { id: "BFMIDI-3 NANO", tag: "BFMIDI-3", switches: 6, size: "2x3 LAYOUT" },
    { id: "BFMIDI-3 NANO+", tag: "BFMIDI-3", switches: 6, size: "2x3 LAYOUT" },
    { id: "BFMIDI-3 MICRO", tag: "BFMIDI-3", switches: 4, size: "2x2 LAYOUT" },
    { id: "BFMIDI-3 6SW+", tag: "BFMIDI-3", switches: 6, size: "2x3 LAYOUT" },
    { id: "BFMIDI-3 7S", tag: "BFMIDI-3", switches: 8, size: "3x3 GRID" },
    { id: "BFMIDI-3 7SW+", tag: "BFMIDI-3", switches: 8, size: "3x3 GRID" }
  ];
  const MN_CONNECTION_FAMILIES = ["BFMIDI-1", "BFMIDI-2", "BFMIDI-3"];
  let mnConnectionsModel = "BFMIDI-3 7S";

  function renderConnectionsHardwareMock(card, secIdx, cardIdx) {
    const tag = mockTagFactory(card, secIdx, cardIdx);
    const current = MN_CONNECTION_MODELS.find((m) => m.id === mnConnectionsModel) || MN_CONNECTION_MODELS[13];
    const family = current.tag;
    const variants = MN_CONNECTION_MODELS.filter((m) => m.tag === family);
    const svgSlot = (key, title, sub) => `
      <div class="mn-svg-slot mn-cell">
        ${tag(key)}
        <div class="mn-svg-slot-head">
          <span>${esc(title)}</span>
          <small>${esc(sub)}</small>
        </div>
        <div class="mn-svg-placeholder" aria-label="${esc(title)}">
          <svg viewBox="0 0 320 150" role="img" aria-hidden="true">
            <rect x="18" y="18" width="284" height="114" rx="14"></rect>
            <path d="M62 58h196M62 84h196M112 108h96"></path>
            <circle cx="72" cy="112" r="9"></circle>
            <circle cx="248" cy="112" r="9"></circle>
          </svg>
          <span>SVG entra aqui</span>
        </div>
      </div>`;

    return `<div class="mn-block-label">${esc(t("previewReal"))}</div>
      <div class="mn-mock mn-mock-connections bf-screen">
        <div class="bf-content-system">
          <div class="bf-card">
            ${mockHead(card.mockTitle || "Conexões físicas", current.id)}
            <span class="bfg-select-eyebrow">FAMÍLIA</span>
            <div class="bfg-family-grid mn-cell">
              ${tag("modelo")}
              ${MN_CONNECTION_FAMILIES.map((f) => {
                const num = (f.split("-")[1] || f).trim();
                const on = family === f;
                const first = MN_CONNECTION_MODELS.find((m) => m.tag === f);
                return `
                  <button type="button" class="bfg-family-btn${on ? " is-on" : ""}"
                          data-mn-connections-model="${esc(first ? first.id : "")}">
                    <span class="bfg-family-num">${esc(num)}</span>
                    <span class="bfg-family-lbl">BFMIDI</span>
                  </button>`;
              }).join("")}
            </div>
            <span class="bfg-select-eyebrow bfg-model-eyebrow-2">VARIANTE · ${esc(family)}</span>
            <div class="bfg-variant-list">
              ${variants.map((v) => {
                const on = current.id === v.id;
                const name = v.id.replace(/^BFMIDI-\d+\s*/, "");
                const sub = `${v.switches} SW · ${v.size}`;
                return `
                  <button type="button" class="bfg-variant-row${on ? " is-on" : ""}"
                          data-mn-connections-model="${esc(v.id)}">
                    <span class="bfg-variant-radio${on ? " is-on" : ""}">${on ? "<span></span>" : ""}</span>
                    <span class="bfg-variant-text">
                      <span class="bfg-variant-name">${esc(name)}</span>
                      <span class="bfg-variant-sub">${esc(sub)}</span>
                    </span>
                  </button>`;
              }).join("")}
            </div>
            <div class="mn-svg-grid">
              ${svgSlot("vista1", "Vista superior/frontal", "desenho SVG do hardware")}
              ${svgSlot("vista2", "Vista traseira/conectores", "desenho SVG das portas")}
            </div>
          </div>
        </div>
      </div>`;
  }
  const npPill = (l, v, accent) => `
    <button type="button" class="bf-studio-np-pill bf-studio-np-pill-lg${accent ? " is-accent" : ""}" tabindex="-1">
      <span class="bf-studio-np-pill-l">${esc(l)}</span>
      <span class="bf-studio-np-pill-v">${esc(v)}</span>
      <span class="bf-studio-np-pill-chev">▾</span>
    </button>`;

  /* ─────────── PRESET — componentes reais (Studio bank) ─────────── */
  function renderBankMock(card, secIdx, cardIdx) {
    const tag = mockTagFactory(card, secIdx, cardIdx);
    const ico = (paths) => `<svg class="bf-conn-mode-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
    let body = "";
    switch (card.mockType) {
      case "p-top": {
        const preset = (n, active) => `
          <button type="button" class="bf-preset${active ? " is-active" : ""}" tabindex="-1">
            <span class="led"></span><span class="num">${n}</span><span class="label">PRESET</span>
          </button>`;
        body = `
          <div class="bf-conn-icons mn-cell-row">
            <button type="button" class="bf-conn-mode bf-conn-theme" tabindex="-1">${tag("tema")}
              ${ico('<path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8z"/>')}
              <span class="bf-conn-mode-label">TEMA</span>
            </button>
            <button type="button" class="bf-conn-mode bf-conn-monitor" tabindex="-1">${tag("monitor")}
              ${ico('<rect x="3" y="5" width="18" height="13" rx="2"/><path d="M7 12h2l1.5-3 2 6 1.5-3h3"/>')}
              <span class="bf-conn-mode-label">MON</span>
            </button>
            <button type="button" class="bf-conn-mode bf-conn-wifi is-online is-mode-ap" tabindex="-1">${tag("wifi")}
              ${ico('<path d="M2 8.5 Q12 0 22 8.5"/><path d="M5 13 Q12 6 19 13"/><path d="M8.5 17.5 Q12 14 15.5 17.5"/><circle cx="12" cy="21" r="1.2" fill="currentColor"/>')}
              <span class="bf-conn-mode-label">AP</span>
            </button>
            <button type="button" class="bf-conn-mode" tabindex="-1">${tag("usb")}
              ${ico('<line x1="12" y1="20" x2="12" y2="5"/><path d="M9.5 8 12 5l2.5 3"/><circle cx="12" cy="21" r="1.4" fill="currentColor"/><path d="M12 13l4 2.5"/><circle cx="17.3" cy="16" r="1.6"/><path d="M12 16l-4-2.5"/><rect x="5.6" y="11" width="3.4" height="3.4" rx="0.5" fill="currentColor"/>')}
              <span class="bf-conn-mode-label">USB</span>
            </button>
          </div>
          <div class="bf-bank-row">
            <button type="button" class="bf-bank-tile mn-cell" tabindex="-1">${tag("tile")}
              <span class="led"></span>
              <span class="letter">A</span>
              <span class="bf-bank-name">MY SOLO</span>
            </button>
            <span class="mn-cell mn-cell-flex">${tag("presets")}${preset(1, false)}</span>
            ${preset(2, true)}${preset(3, false)}${preset(4, false)}${preset(5, false)}${preset(6, false)}
          </div>
          <div class="bf-studio-toggle-row bf-studio-toggle-row-top">
            <div class="bf-studio-toggle has-center mn-cell">${tag("toggle")}
              <button type="button" class="bf-studio-toggle-btn is-active" tabindex="-1">MODO PRESET</button>
              <button type="button" class="bf-studio-toggle-btn" tabindex="-1">MODO LIVE</button>
              <div class="bf-studio-toggle-center">
                <button type="button" class="bf-studio-layer-badge is-locked" tabindex="-1">${tag("layer")}1</button>
              </div>
            </div>
          </div>`;
        break;
      }

      case "p-main":
        body = `
          <section class="bf-studio-now-playing">
            <div class="bf-studio-np-head">
              <span class="bf-studio-np-eyebrow">• PRINCIPAL</span>
              <div class="bf-studio-np-head-right bf-studio-np-head-right-stack">
                <button type="button" class="bf-studio-np-tela-sq" tabindex="-1">${tag("tela")}
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2.5" y="4.5" width="19" height="12" rx="1.6"/>
                    <rect x="6" y="11" width="1.6" height="3.5" fill="currentColor" stroke="none"/>
                    <rect x="9" y="9" width="1.6" height="5.5" fill="currentColor" stroke="none"/>
                    <rect x="12" y="7" width="1.6" height="7.5" fill="currentColor" stroke="none"/>
                    <rect x="15" y="10" width="1.6" height="4.5" fill="currentColor" stroke="none"/>
                    <path d="M9 21h6 M12 16.5v4.5"/>
                  </svg>
                </button>
                <button type="button" class="bf-studio-np-slot-sq" tabindex="-1">${tag("add")}
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
                </button>
              </div>
            </div>
            <div class="bf-studio-np-title-row bf-studio-np-title-row-accent">
              <span class="bf-studio-np-accent-bar" aria-hidden="true"></span>
              <div class="bf-studio-np-title-wrap mn-cell">${tag("nome")}
                <h2 class="bf-studio-np-title">Fender Clean</h2>
              </div>
            </div>
            <div class="bf-studio-np-meta">
              <div class="bf-studio-picker mn-cell">${tag("pc")}${npPill("PC", "1")}</div>
              <div class="bf-studio-np-extra-wrap is-no-x">
                <div class="bf-studio-picker mn-cell">${tag("canal")}${npPill("Canal", "CH 02", true)}</div>
              </div>
            </div>
            <div class="bf-studio-np-extras-list">
              <div class="bf-studio-np-meta bf-studio-np-meta-extra bf-studio-np-meta-cc mn-cell">${tag("extras")}
                <div class="bf-studio-np-extra-wrap">
                  ${npPill("CC", "5")}
                  <button type="button" class="bf-studio-np-extra-type mn-cell" tabindex="-1">${tag("badge")}PC</button>
                </div>
                <button type="button" class="bf-studio-np-cc-val is-on mn-cell" tabindex="-1">${tag("ccval")}
                  <span class="bf-studio-np-cc-val-l">127</span>
                  <span class="bf-studio-np-cc-val-v">ON</span>
                </button>
                <div class="bf-studio-np-extra-wrap">
                  ${npPill("Canal", "CH 03", true)}
                  <button type="button" class="bf-studio-np-extra-x mn-cell" tabindex="-1">${tag("remover")}
                    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </section>`;
        break;

      case "p-tela": {
        const colorBar = (label, bg, tagHtml) => `
          <div class="bf-field mn-cell">${tagHtml || ""}
            <span class="bf-field-label">${esc(label)}</span>
            <button type="button" class="bf-color-bar" tabindex="-1" style="background:${bg}"></button>
          </div>`;
        body = `
          <section class="bf-studio-now-playing">
            <div class="bf-studio-np-head">
              <span class="bf-studio-np-eyebrow">• PRINCIPAL · TELA</span>
              <div class="bf-studio-np-head-right bf-studio-np-head-right-stack">
                <button type="button" class="bf-studio-np-tela-sq is-open" tabindex="-1">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2.5" y="4.5" width="19" height="12" rx="1.6"/>
                    <rect x="6" y="11" width="1.6" height="3.5" fill="currentColor" stroke="none"/>
                    <rect x="9" y="9" width="1.6" height="5.5" fill="currentColor" stroke="none"/>
                    <rect x="12" y="7" width="1.6" height="7.5" fill="currentColor" stroke="none"/>
                    <rect x="15" y="10" width="1.6" height="4.5" fill="currentColor" stroke="none"/>
                    <path d="M9 21h6 M12 16.5v4.5"/>
                  </svg>
                </button>
              </div>
            </div>
            <div class="bf-display-grid">
              <label class="bf-field bf-grid-tamanho mn-cell">${tag("tamanho")}
                <span class="bf-field-label">TAMANHO</span>
                <button type="button" class="bf-input bf-input-num" tabindex="-1">18pt</button>
              </label>
              <label class="bf-field bf-grid-negrito mn-cell">${tag("negrito")}
                <span class="bf-field-label">NEGRITO</span>
                <button type="button" class="bf-input bf-input-num" tabindex="-1">NÃO</button>
              </label>
              <div class="bf-grid-namecolor-top">${colorBar("COR DO NOME", "linear-gradient(180deg,#ffffff 0%,#cfd2da 100%)", tag("nome"))}</div>
              <div class="bf-grid-namecolor">${colorBar("BORDA DO NOME", "linear-gradient(180deg,#a02ec4 0%,#7b1fa2 100%)", tag("borda"))}</div>
              <div class="bf-grid-background">${colorBar("FUNDO", "linear-gradient(180deg,#ff2424 0%,#c62828 100%)", tag("fundo"))}</div>
              <label class="bf-field bf-grid-alinhamento mn-cell">${tag("alinhamento")}
                <span class="bf-field-label">ALINHAMENTO</span>
                <div class="bf-align-grid bf-align-grid-large">
                  ${Array.from({ length: 9 }, (_, i) => `<button type="button" class="bf-align-cell${i === 4 ? " is-active" : ""}" tabindex="-1"></button>`).join("")}
                </div>
              </label>
              <div class="bf-grid-tagcolor">${colorBar("COR DA SIGLA", "linear-gradient(180deg,#ffb340 0%,#f57c00 100%)", tag("sigla"))}</div>
              <div class="bf-grid-backlayers">${colorBar("BACK LAYERS", "linear-gradient(180deg,#2b50ff 0%,#1230c8 100%)", tag("camadas"))}</div>
            </div>
          </section>`;
        break;
      }

      case "p-dash": {
        const dash = (sw, mode, color, on, tagHtml) => `
          <div class="bf-preset-dash-card mn-cell" style="--dash-accent:${color}">${tagHtml || ""}
            <span class="bf-preset-dash-accent" aria-hidden="true"></span>
            <div class="bf-preset-dash-main">
              <span class="bf-preset-dash-top"><span class="bf-preset-dash-sw">SW${sw}</span></span>
              <p class="bf-preset-dash-mode-name ${on ? "is-on" : "is-off"}">${esc(mode)}</p>
            </div>
          </div>`;
        body = `
          <section class="bf-preset-dash">
            <div class="bf-preset-dash-grid">
              ${dash(1, "STOMP", "#30d158", true, tag("linha"))}
              ${dash(2, "SINGLE", "#0a84ff", false, tag("nomes"))}
              ${dash(3, "TAP TEMPO", "#ff6a1f", false)}
              ${dash(4, "SPIN", "#bf5af2", false)}
              ${dash(5, "MACROS", "#ff453a", false)}
              ${dash(6, "MUTE", "#26262a", false)}
            </div>
          </section>`;
        break;
      }

      case "p-grid": {
        const tile = (n, color, lit, tagHtml) => `
          <button type="button" class="bf-studio-sw-tile is-compact${lit ? " is-lit" : ""} mn-cell" style="--sw-color:${color}" tabindex="-1">${tagHtml || ""}
            <span class="bf-studio-sw-tile-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round">
                <circle cx="12" cy="12" r="7" opacity="${lit ? 1 : 0.45}"/>
                <circle cx="12" cy="12" r="2.4" fill="${color}" stroke="none" opacity="${lit ? 1 : 0.45}"/>
              </svg>
            </span>
            <span class="bf-studio-sw-tile-stripe"></span>
            <span class="bf-studio-sw-tile-label">SW${n}</span>
          </button>`;
        body = `
          <section class="bf-studio-sw-preview">
            <div class="bf-studio-sw-preview-head">
              <span class="bf-studio-sw-preview-eyebrow"><span class="bf-studio-sw-preview-eyebrow-dot"></span>Footswitches</span>
            </div>
            <div class="bf-studio-sw-preview-grid is-compact">
              ${tile(1, "#30d158", true, tag("tile"))}
              ${tile(2, "#0a84ff", false)}
              ${tile(3, "#ff6a1f", false)}
              ${tile(4, "#bf5af2", false)}
              ${tile(5, "#ff453a", false)}
              ${tile(6, "#6e6e76", false)}
            </div>
          </section>
          <div class="bf-card" style="margin-top:14px">
            ${mockHead("Monitor MIDI", "ÚLTIMO DISPARO")}
            <div class="mk-note" style="margin-top:0;font-family:var(--font-mono);font-style:normal">PC 24 · CH 1&nbsp;&nbsp;|&nbsp;&nbsp;CC 49 = 127 · CH 1</div>
            <div class="bf-actions" style="grid-template-columns:1fr 1fr;margin-top:10px">
              <span class="mn-cell mn-cell-block">${tag("copiar")}<button type="button" class="bf-btn" tabindex="-1" style="width:100%">COPIAR</button></span>
              <button type="button" class="bf-btn" tabindex="-1">FECHAR</button>
            </div>
          </div>`;
        break;
      }

      case "p-tabbar":
        body = `
          <div class="bf-tabbar mn-tabbar-static">
            <button type="button" class="bf-tab preset_config is-active" tabindex="-1">PRESET</button>
            <button type="button" class="bf-tab" tabindex="-1">GLOBAL</button>
            <button type="button" class="bf-tab" tabindex="-1">SISTEMA</button>
            <div class="bf-tabbar-plus-wrap mn-cell">${tag("mais")}
              <button type="button" class="bf-tabbar-plus is-open" tabindex="-1">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14 M5 12h14"/></svg>
              </button>
            </div>
            <button type="button" class="bf-save is-idle mn-cell" tabindex="-1">${tag("save")}SAVE</button>
          </div>
          <div class="bf-tabbar-plus-menu mn-plus-menu-static" role="menu">
            <button type="button" class="bf-tabbar-plus-item mn-cell" tabindex="-1">${tag("preset")}${swIcon("copy")}<span>COPIAR PRESET</span></button>
            <button type="button" class="bf-tabbar-plus-item" tabindex="-1">${swIcon("paste")}<span>COLAR PRESET</span></button>
            <button type="button" class="bf-tabbar-plus-item mn-cell" tabindex="-1">${tag("layer")}${swIcon("copy")}<span>COPIAR LAYER (L1)</span></button>
            <button type="button" class="bf-tabbar-plus-item mn-cell" tabindex="-1">${tag("bank")}${swIcon("copy")}<span>COPIAR BANCO</span></button>
            <button type="button" class="bf-tabbar-plus-item" tabindex="-1">${swIcon("paste")}<span>COLAR BANCO</span></button>
          </div>
          <div class="mk-note mn-cell">${tag("sw")}Dentro do painel LIVE, os botões de copiar/colar <strong>entre switches</strong> ficam no card do SW (ícones de copy/paste ao lado das abas).</div>`;
        break;
    }
    return `<div class="mn-block-label">${esc(t("previewReal"))}</div>
      <div class="mn-mock mn-mock-bank bf-screen">
        <div class="bf-content-bank">${body}</div>
      </div>`;
  }

  /* ─────────── SYSTEM — cards reais (PRINCIPAL / USB HOST / BACKUP) ─────────── */
  function renderSystemMock(card, secIdx, cardIdx) {
    const tag = mockTagFactory(card, secIdx, cardIdx);
    let body = "";
    switch (card.mockType) {
      case "s-principal":
        body = `
          <div class="bf-card">
            ${mockHead("Modelo da Controladora", "BFMIDI-3 7S")}
            <span class="bfg-select-eyebrow">FAMÍLIA</span>
            <div class="bfg-family-grid mn-cell">${tag("modelo")}
              ${[1, 2, 3].map((n) => `
                <button type="button" class="bfg-family-btn${n === 3 ? " is-on" : ""}" tabindex="-1">
                  <span class="bfg-family-num">${n}</span>
                  <span class="bfg-family-lbl">BFMIDI</span>
                </button>`).join("")}
            </div>
            <span class="bfg-select-eyebrow bfg-model-eyebrow-2">VARIANTE · BFMIDI-3</span>
            <div class="bfg-variant-list">
              ${[["NANO", "6 SW · 2x3 LAYOUT", false], ["7S", "8 SW · 3x3 GRID", true], ["7SW+", "8 SW · 3x3 GRID", false]].map(([nm, sub, on]) => `
                <button type="button" class="bfg-variant-row${on ? " is-on" : ""}" tabindex="-1">
                  <span class="bfg-variant-radio${on ? " is-on" : ""}">${on ? "<span></span>" : ""}</span>
                  <span class="bfg-variant-text">
                    <span class="bfg-variant-name">${nm}</span>
                    <span class="bfg-variant-sub">${sub}</span>
                  </span>
                </button>`).join("")}
            </div>
          </div>
          <div class="bf-card">
            ${mockHead("Idioma", "PT")}
            <div class="bfg-lang-list mn-cell">${tag("idioma")}
              ${[["BR", "PORTUGUÊS", "Brasil · default", true], ["US", "ENGLISH", "English (worldwide)", false], ["ES", "ESPAÑOL", "Castellano", false]].map(([code, nm, sub, on]) => `
                <button type="button" class="bfg-lang-row${on ? " is-on" : ""}" tabindex="-1">
                  <span class="bfg-lang-code">${code}</span>
                  <span class="bfg-lang-text">
                    <span class="bfg-lang-name">${nm}</span>
                    <span class="bfg-lang-sub">${sub}</span>
                  </span>
                  <span class="bfg-lang-radio${on ? " is-on" : ""}">${on ? "<span></span>" : ""}</span>
                </button>`).join("")}
            </div>
          </div>
          <div class="bf-card">
            ${mockHead("SW6 = SW Global", "OFF")}
            ${mockToggleRow(tag("sw6"), "SW6 vira o footswitch do SW Global", "SÓ NOS MODELOS NANO · REINICIA", false)}
          </div>
          <div class="bf-card">
            ${mockHead("Remapping", "0°")}
            <div class="bf-remap-grid mn-cell">${tag("remap")}
              ${[0, 90, 180, 270].map((g, i) => `
                <button type="button" class="bf-remap-opt${i === 0 ? " is-active" : ""}" tabindex="-1">
                  <svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true">
                    <g transform="rotate(${g} 24 24)" stroke="currentColor" fill="none">
                      <rect x="10" y="15" width="28" height="18" rx="3" stroke-width="2"/>
                      <line x1="19" y1="15" x2="29" y2="15" stroke-width="3" stroke-linecap="round"/>
                      <circle cx="14" cy="39" r="3.4" fill="#ff6a1f" stroke="none"/>
                      <circle cx="34" cy="39" r="2.4" fill="currentColor" stroke="none" opacity="0.35"/>
                      <circle cx="14" cy="9" r="2.4" fill="currentColor" stroke="none" opacity="0.35"/>
                      <circle cx="34" cy="9" r="2.4" fill="currentColor" stroke="none" opacity="0.35"/>
                    </g>
                  </svg>
                  <span>${g}°</span>
                </button>`).join("")}
            </div>
            <p class="bf-hint">Só nos modelos MICRO — gira a tela e remapeia os footswitches. Reinicia ao alterar.</p>
          </div>
          <div class="bf-card">
            ${mockHead("Teste de Hardware", "10 s")}
            <div class="bfg-test-grid mn-cell">${tag("teste")}
              ${["LEDS", "DISPLAY", "MIDI"].map((nm) => `
                <button type="button" class="bfg-test-btn" tabindex="-1">
                  <span class="bfg-test-ico">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                      <circle cx="12" cy="12" r="8" opacity="0.7"/><circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none"/>
                    </svg>
                  </span>
                  <span>${nm}</span>
                </button>`).join("")}
            </div>
            ${mockSeg(tag("tema"), ["ESCURO", "CLARO"], 0)}
          </div>`;
        break;

      case "s-usbhost":
        body = `
          <div class="bf-card">
            ${mockHead("USB Host", "ONLINE")}
            <div class="bfg-usbh-rows mn-cell">${tag("status")}
              ${[["Fabricante", "IK Multimedia"], ["Produto", "ToneX One"], ["Status", "CONECTADO"], ["Último frame", "há 2 s"]].map(([l, v]) => `
                <div class="bfg-usbh-row">
                  <span class="bfg-usbh-l">${l}</span>
                  <span class="bfg-usbh-v">${v}</span>
                </div>`).join("")}
            </div>
            <button type="button" class="bfg-btn" style="width:100%;margin-top:12px" tabindex="-1">ATUALIZAR</button>
          </div>
          <div class="bf-card">
            ${mockHead("Modo de operação", "USB HOST")}
            ${mockSeg(tag("modo"), ["TONEX ONE", "USB HOST"], 1)}
            <span class="mn-cell mn-cell-block" style="margin-top:10px">${tag("atualizar")}
              <button type="button" class="bfg-btn-outline" style="width:100%" tabindex="-1">MODO DE ATUALIZAÇÃO DO MÓDULO</button>
            </span>
          </div>
          <div class="bf-card">
            ${mockHead("Filtro MIDI", "OMNI")}
            <div class="bfg-select-box mn-cell">${tag("filtro")}
              <span class="bfg-select-eyebrow">CANAL DO FILTRO</span>
              <button type="button" class="bf-input bf-select bfg-select-lg" tabindex="-1">OMNI — todos os canais</button>
              <span class="bf-select-chev bfg-select-chev">▾</span>
            </div>
          </div>
          <div class="bf-card">
            ${mockHead("Teclado BLE", "OFF")}
            ${mockSeg(tag("ble"), ["DESLIGADO", "LIGADO"], 0)}
          </div>
          <div class="bf-card">
            ${mockHead("MIDI BFMiDi")}
            ${mockToggleRow(tag("bfmidi"), "MIDI reverso", "RE-EMITE O MIDI DO HOST NAS SAÍDAS", true)}
            ${mockToggleRow("", "Control Host", "PC 0–29 CHAMA PRESETS · CC 81–85 NAVEGA", true)}
          </div>`;
        break;

      case "s-backup": {
        const sbar = (label, color, pct, used, free, cap, tagHtml) => `
          <div class="mn-cell" style="margin-bottom:14px">${tagHtml || ""}
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:5px">
              <span style="display:inline-flex;align-items:center;gap:7px;font-weight:600">
                <span class="bf-storage-dot" style="background:${color}"></span>${label}
              </span>
              <span style="font-size:12px;color:var(--muted)">${pct}%</span>
            </div>
            <div class="bf-storage-bar"><span class="bf-storage-seg" style="width:${pct}%;background:${color}"></span></div>
            <div class="bf-storage-totals">
              <span><b>${used}</b> usado</span>
              <span class="bf-storage-free"><b>${free}</b> livre</span>
              <span class="bf-storage-of">de ${cap}</span>
            </div>
          </div>`;
        body = `
          <div class="bf-card">
            ${mockHead("Backup & Restore", "PRESETS · LITTLEFS")}
            ${mockToggleRow(tag("incluir"), "Incluir imagens e ícones", "ARQUIVO MAIOR · RESTAURAÇÃO COMPLETA", true)}
            <p class="bf-hint">A config global (WiFi, modelo, LEDs) não entra no backup — ela vive na memória protegida.</p>
            <div class="bfg-backup-actions">
              <button type="button" class="bfg-backup-btn bfg-backup-btn-primary mn-cell" tabindex="-1">${tag("exportar")}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12 M7 10l5 5 5-5"/><path d="M4 17v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/></svg>
                <span>FAZER BACKUP</span>
              </button>
              <button type="button" class="bfg-backup-btn mn-cell" tabindex="-1">${tag("importar")}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21V9 M7 14l5-5 5 5"/><path d="M4 7V4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3"/></svg>
                <span>RESTAURAR</span>
              </button>
            </div>
            <div class="bfg-backup-pill">
              <span class="bfg-backup-pill-dot"></span>
              <span class="bfg-backup-pill-txt">PRONTO PARA INICIAR</span>
            </div>
          </div>
          <div class="bf-card">
            ${mockHead("Zona de Perigo")}
            <p class="bfg-danger-desc">Ações sem desfazer — exporte um backup antes.</p>
            <div class="bfg-danger-grid mn-cell">${tag("apagar")}
              <button type="button" class="bfg-danger-btn" tabindex="-1">
                <span class="bfg-danger-lbl">APAGAR PRESETS</span>
                <span class="bfg-danger-sub">bank_memory.txt</span>
              </button>
              <button type="button" class="bfg-danger-btn" tabindex="-1">
                <span class="bfg-danger-lbl">APAGAR CONFIG GLOBAL</span>
                <span class="bfg-danger-sub">config NVS</span>
              </button>
            </div>
          </div>
          <div class="bf-card">
            ${mockHead("STORAGE", "LITTLEFS · NVS")}
            ${sbar("Presets", "#ff7a1a", 38, "364 KB", "596 KB", "960 KB", tag("storage"))}
            ${sbar("Imagens", "#3a6dff", 61, "244 KB", "156 KB", "400 KB")}
            ${sbar("Ícones", "#22cc44", 22, "44 KB", "156 KB", "200 KB")}
            ${sbar("Globais (NVS)", "#a855f7", 45, "10.8 KB", "13.2 KB", "24 KB")}
            <button type="button" class="bf-btn bf-storage-refresh" tabindex="-1">Atualizar</button>
          </div>`;
        break;
      }
    }
    return `<div class="mn-block-label">${esc(t("previewReal"))}</div>
      <div class="mn-mock mn-mock-system bf-screen">
        <div class="bf-content-system">${body}</div>
      </div>`;
  }


  function mockCell(cell, secIdx, cardIdx) {
    const tag = mockTag(cell, secIdx, cardIdx);
    const lbl = cell.label ? `<span class="bf-field-label">${esc(cell.label)}</span>` : "";
    const span = cell.span ? ` style="grid-column:span ${cell.span}"` : "";
    const wrap = (inner) =>
      `<div class="bf-extras-cell mn-cell"${span}>${tag}${lbl}${inner}</div>`;

    switch (cell.kind) {
      case "select":
        return wrap(`<div class="bf-select-wrap">
            <button type="button" class="bf-input bf-select bf-select-btn" tabindex="-1">
              <span class="value">${esc(cell.value ?? "")}</span>
            </button>
            <span class="bf-select-chev">▾</span>
          </div>`);
      case "input":
        return wrap(`<div class="bf-input"><span class="value">${esc(cell.value ?? "")}</span></div>`);
      case "btn": {
        // Badges de tipo de slot (CC ciano / PC verde) — visual real do app
        const isType = /^(CC|PC|ENVIAR CC|ENVIAR PC)$/.test(cell.value || "");
        const cls = isType
          ? `bf-input bf-input-num bf-macros-slot-type ${/PC$/.test(cell.value) ? "is-pc" : "is-cc"}`
          : `bf-input bf-input-num${cell.on ? " is-active" : ""}`;
        return wrap(`<button type="button" class="${cls}" tabindex="-1">${esc(cell.value ?? "")}</button>`);
      }
      case "toggle":
        return wrap(`<button type="button" class="bf-input bf-input-num${cell.on ? " is-active" : ""}" tabindex="-1">${cell.on ? "ON" : "OFF"}</button>`);
      case "pill":
        return `<span class="mn-cell mn-pill-cell">${tag}<button type="button" class="bf-tap-action" tabindex="-1">${esc(cell.value ?? "")}</button></span>`;
      case "color":
        return wrap(`<button type="button" class="bf-color-bar" tabindex="-1"
            style="background:${cell.value || "linear-gradient(90deg,#050507,#ff6a1f,#050507)"}"></button>`);
      case "arc": {
        const color = cell.value || "#ff6a1f";
        return `<div class="bf-sw-fx1-led mn-cell"${span}>${tag}
            <div class="bf-fsw">
              <span class="bf-fsw-glyph" style="--led-c:${color}">${fswArcSvg(color)}</span>
              <span class="bf-fsw-label">${esc(cell.label || "LED")}</span>
            </div>
          </div>`;
      }
      case "fader": {
        const vals = cell.value || [];
        const pts = vals.map((v) =>
          `<span class="pt" style="left:${8 + (Number(v) / 127) * 84}%">${esc(v)}</span>`).join("");
        return wrap(`<div class="mk-fader">${pts}</div>`);
      }
      case "tile":
        return wrap(`<div class="mk-tile"><span class="glyph">${cell.glyph || "▣"}</span><span class="sig">${esc(cell.value || "FX")}</span></div>`);
      case "text":
        return wrap(`<div class="bf-input"><span class="placeholder">${esc(cell.value ?? "")}</span></div>`);
      default:
        return wrap(`<div class="bf-input"><span class="value">${esc(cell.value ?? "")}</span></div>`);
    }
  }

  function renderMock(card, secIdx, cardIdx) {
    if (card.mockType === "intro-flow") return renderIntroFlowSvg(card, secIdx, cardIdx);
    if (card.mockType === "acesso-flow") return renderAccessFlowSvg(card, secIdx, cardIdx);
    if (card.mockType === "match-flow") return renderMatchFlowSvg(card, secIdx, cardIdx);
    if (card.mockType === "connections-hardware") return renderConnectionsHardwareMock(card, secIdx, cardIdx);
    if (card.mockType === "wifi-sys") return renderWifiSysMock(card, secIdx, cardIdx);
    if (/^g-/.test(card.mockType || "")) return renderGlobalMock(card, secIdx, cardIdx);
    if (/^p-/.test(card.mockType || "")) return renderBankMock(card, secIdx, cardIdx);
    if (/^s-/.test(card.mockType || "")) return renderSystemMock(card, secIdx, cardIdx);
    if (/^sw-/.test(card.mockType || "")) return renderSwRealMock(card, secIdx, cardIdx);
    let html = `<div class="mn-block-label">${esc(t("previewReal"))}</div>
      <div class="mn-mock bf-screen">
        <div class="bf-card">
          <div class="bf-card-head"><h3>${esc(card.mockTitle || card.title)}</h3><span class="meta">${esc(t("exampleMeta"))}</span></div>
          <div class="bf-sw-fx1">`;
    for (const block of card.mock) {
      if (block.sec) {
        html += `<div class="bf-section-label">${esc(block.sec)}</div>`;
      } else if (block.note) {
        html += `<div class="mk-note">${block.note}</div>`;
      } else if (block.row) {
        const pills = block.row.every((c) => c.kind === "pill");
        if (pills) {
          html += `<div class="bf-tap-slot-actions">
            ${block.row.map((c) => mockCell(c, secIdx, cardIdx)).join("")}
          </div>`;
        } else {
          const cols = block.row.reduce((n, c) => n + (c.span || 1), 0);
          html += `<div class="bf-extras-row" style="grid-template-columns:repeat(${cols},minmax(0,1fr))">
            ${block.row.map((c) => mockCell(c, secIdx, cardIdx)).join("")}
          </div>`;
        }
      }
    }
    html += `</div></div></div>`;
    return html;
  }

  function renderAutoMock(card, secIdx, cardIdx) {
    const rows = [];
    const fields = Array.isArray(card.fields) ? card.fields : [];
    if (fields.length) {
      rows.push(...fields.slice(0, 6).map((f, i) => ({
        tag: i + 1,
        label: f.type || "campo",
        value: f.name || `Campo ${i + 1}`
      })));
    } else {
      const steps = Array.isArray(card.howto) && card.howto.length
        ? card.howto
        : Array.isArray(card.notes) ? card.notes : [];
      rows.push(...steps.slice(0, 4).map((text, i) => ({
        tag: i + 1,
        label: i === 0 ? "fluxo" : "etapa",
        value: stripHtml(text).slice(0, 42)
      })));
    }
    if (!rows.length) {
      rows.push({ tag: 1, label: "referência", value: card.title });
    }

    return `<div class="mn-block-label">${esc(t("previewReal"))}</div>
      <div class="mn-mock mn-mock-auto bf-screen">
        <div class="bf-card">
          <div class="bf-card-head"><h3>${esc(card.mockTitle || card.title)}</h3><span class="meta">${esc(t("exampleMeta"))}</span></div>
          <div class="bf-sw-fx1">
            <div class="bf-section-label">${esc(card.chip || t("cardAppFallback"))}</div>
            <div class="bf-extras-row" style="grid-template-columns:repeat(2,minmax(0,1fr))">
              ${rows.map((row) => `
                <div class="bf-extras-cell mn-cell">
                  ${row.tag && fields.length ? `<button class="mk-tag" type="button" data-info="${secIdx}.${cardIdx}.${row.tag - 1}" title="${esc(t("tagFieldTitle", { n: row.tag }))}" aria-label="${esc(t("tagFieldAria", { n: row.tag }))}">${row.tag}</button>` : ""}
                  <span class="bf-field-label">${esc(row.label)}</span>
                  <div class="bf-input"><span class="value">${esc(row.value)}</span></div>
                </div>`).join("")}
            </div>
          </div>
        </div>
      </div>`;
  }

  function renderLegend(card, cardId) {
    return `<div class="mn-block-label">${esc(t("whatEachField"))}</div>
      <div class="mn-legend">
        ${card.fields.map((f, fi) => `
          <div class="mn-legend-item" id="legend-${cardId}-${fi + 1}">
            <span class="mk-tag">${fi + 1}</span>
            <div class="body">
              <div class="head">
                <span class="name">${esc(f.name)}</span>
                <span class="type">${esc(f.type)}</span>
              </div>
              <div class="desc">${f.desc}</div>
            </div>
          </div>`).join("")}
      </div>`;
  }

  function renderCard(sec, card, secIdx, cardIdx) {
    let html = `<article class="mn-card" id="card-${card.id}">
      <div class="mn-card-head">
        <h3><a href="#${sec.id}/${card.id}">${esc(card.title)}</a></h3>
        ${card.chip ? `<span class="mn-chip">${esc(card.chip)}</span>` : ""}
        <span class="meta">${esc(sec.title)}</span>
      </div>`;

    if (card.purpose) {
      html += `<p class="mn-purpose">${card.purpose}</p>`;
    }
    if (card.howto && card.howto.length) {
      html += `<div class="mn-block-label">${esc(t("howToUse"))}</div>
        <ol class="mn-howto">${card.howto.map((s) => `<li>${s}</li>`).join("")}</ol>`;
    }

    if (!card.noMock) {
      html += card.mockType || (card.mock && card.mock.length)
        ? renderMock(card, secIdx, cardIdx)
        : renderAutoMock(card, secIdx, cardIdx);
    }

    if (card.fields && card.fields.length) {
      html += renderLegend(card, card.id);
    }
    if (card.notes && card.notes.length) {
      html += `<div class="mn-block-label">${esc(t("notesLimits"))}</div>
        <ul class="mn-notes">${card.notes.map((s) => `<li><span>${s}</span></li>`).join("")}</ul>`;
    }
    html += `</article>`;
    return html;
  }
  function renderSection(sec, cardId, keepScroll) {
    const secIdx = SECTIONS.indexOf(sec);
    const prev = SECTIONS[secIdx - 1];
    const next = SECTIONS[secIdx + 1];

    // Sub-seções (abas) — espelha as bf-icon-tabs do app (GLOBAL/SYSTEM).
    // O card navegado define a aba ativa; trocar de aba filtra os cards.
    let tabsHtml = "";
    let cardsToShow = sec.cards.map((c, ci) => ({ c, ci }));
    if (Array.isArray(sec.tabs) && sec.tabs.length) {
      if (cardId) {
        const tgt = sec.cards.find((c) => c.id === cardId);
        if (tgt && tgt.tab) mnSecTab[sec.id] = tgt.tab;
      }
      if (!sec.tabs.some((tb) => tb.id === mnSecTab[sec.id])) {
        mnSecTab[sec.id] = sec.tabs[0].id;
      }
      const act = mnSecTab[sec.id];
      cardsToShow = cardsToShow.filter(({ c }) => (c.tab || sec.tabs[0].id) === act);
      const scope = sec.id === "system" ? "bf-content-system" : "bf-content-global";
      tabsHtml = `
        <div class="mn-mock mn-sec-tabs bf-screen${mnTheme === "light" ? " is-theme-light" : ""}">
          <div class="${scope}">
            <div class="bf-icon-tabs${sec.id === "system" ? " cols-4" : ""}">
              ${sec.tabs.map((tb) => `
                <button type="button" class="bf-icon-tab${tb.id === act ? " is-on" : ""}" data-tab="${tb.id}">
                  ${MN_TAB_ICONS[tb.icon] || ""}
                  <span>${esc(tb.label)}</span>
                </button>`).join("")}
            </div>
          </div>
        </div>`;
    }

    main.innerHTML = `
      <nav class="mn-crumbs">
        <a href="#">${esc(t("home"))}</a><span class="sep">›</span><span class="here">${esc(sec.title)}</span>
      </nav>
      <div class="mn-hero">
        <h1 class="mn-title">${esc(sec.title)}</h1>
      </div>
      <div class="mn-sec-intro">${sec.intro || ""}</div>
      ${tabsHtml}
      <div class="mn-section-label">${esc(t("topicsHere"))}</div>
      ${cardsToShow.map(({ c, ci }) => renderCard(sec, c, secIdx, ci)).join("")}
      <div class="mn-pager">
        ${prev ? `<a href="#${prev.id}"><span class="dir">‹ ${esc(t("prev"))}</span><span class="lbl">${esc(prev.title)}</span></a>` : ""}
        ${next ? `<a class="next" href="#${next.id}"><span class="dir">${esc(t("next"))} ›</span><span class="lbl">${esc(next.title)}</span></a>` : ""}
      </div>`;

    document.title = `${sec.title} ${t("docSuffix")}`;

    // troca de aba: re-renderiza a seção mantendo o scroll, e atualiza a
    // sidebar (a aba ativa muda o destaque dos cards agrupados)
    main.querySelectorAll(".mn-sec-tabs .bf-icon-tab").forEach((b) => {
      b.addEventListener("click", () => {
        mnSecTab[sec.id] = b.dataset.tab;
        // sidebar antes da seção: o scrollspy (no fim do renderSection)
        // marca o card ativo na sidebar recém-renderizada
        renderSidebar(sec.id, null);
        renderSection(sec, null, true);
      });
    });

    main.querySelectorAll("[data-mn-connections-model]").forEach((b) => {
      b.addEventListener("click", () => {
        const nextModel = b.dataset.mnConnectionsModel;
        if (!nextModel || nextModel === mnConnectionsModel) return;
        mnConnectionsModel = nextModel;
        renderSection(sec, null, true);
      });
    });

    // liga os botões (i) e os badges numerados do mockup
    main.querySelectorAll(".mn-info, .mk-tag[data-info]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const [si, ci, fi] = btn.dataset.info.split(".").map(Number);
        const s = SECTIONS[si], c = s.cards[ci], f = c.fields[fi];
        openModal(`${fi + 1} · ${f.name}`, f.desc, `${s.title} › ${c.title}`);
        // destaca o item correspondente na legenda (visível ao fechar o popup)
        const leg = $("#legend-" + c.id + "-" + (fi + 1));
        if (leg) {
          leg.classList.remove("is-flash");
          void leg.offsetWidth;
          leg.classList.add("is-flash");
        }
      });
    });

    // rola até o card pedido (ou topo; troca de aba mantém o scroll)
    if (cardId) {
      const el = $("#card-" + cardId);
      if (el) {
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          el.classList.remove("is-flash");
          void el.offsetWidth; // reinicia a animação
          el.classList.add("is-flash");
        });
      }
    } else if (!keepScroll) {
      window.scrollTo(0, 0);
    }
    syncMockTheme();
    setupScrollSpy(sec);
  }

  /* ───────────── scrollspy: a sidebar segue o scroll ─────────────
     Conforme a página rola, o card "corrente" (o último cujo topo passou
     da linha de leitura, logo abaixo da topbar) vira o ativo na sidebar —
     e o hash é atualizado silenciosamente (replaceState, sem disparar
     hashchange/re-render). A sidebar rola junto pra manter o item à vista. */
  let spySec = null;
  let spyCards = [];
  let spyLastId = null;
  let spyTicking = false;

  function setupScrollSpy(sec) {
    spySec = sec || null;
    spyLastId = null;
    spyCards = spySec
      ? [...main.querySelectorAll(".mn-card")].map((el) => ({
          id: el.id.replace(/^card-/, ""), el
        }))
      : [];
    if (spySec) updateScrollSpy();
  }

  function updateScrollSpy() {
    if (!spySec || !spyCards.length) return;
    const probe = 58 + 90;   // topbar + folga de leitura
    let cur = spyCards[0];
    for (const c of spyCards) {
      if (c.el.getBoundingClientRect().top <= probe) cur = c;
      else break;
    }
    // fim da página: o último card vence (senão nunca ativa)
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      cur = spyCards[spyCards.length - 1];
    }
    if (cur.id === spyLastId) return;
    spyLastId = cur.id;

    const want = `#${spySec.id}/${cur.id}`;
    sidebarInner.querySelectorAll(".mn-side-card").forEach((a) => {
      const on = a.getAttribute("href") === want;
      a.classList.toggle("is-active", on);
      if (on) {
        // mantém o item visível dentro da rolagem própria da sidebar
        // (sem scrollIntoView, que rolaria a página junto)
        const top = a.getBoundingClientRect().top - sidebar.getBoundingClientRect().top + sidebar.scrollTop;
        if (top < sidebar.scrollTop + 70) {
          sidebar.scrollTop = Math.max(0, top - 70);
        } else if (top > sidebar.scrollTop + sidebar.clientHeight - 90) {
          sidebar.scrollTop = top - sidebar.clientHeight + 90;
        }
      }
    });
    // hash silencioso: deep-link acompanha a leitura sem re-render
    if (location.hash !== want) history.replaceState(null, "", want);
  }

  // throttle por setTimeout (não rAF: rAF congela com a aba em segundo
  // plano e deixaria o spy travado ao voltar)
  window.addEventListener("scroll", () => {
    if (spyTicking) return;
    spyTicking = true;
    setTimeout(() => { spyTicking = false; updateScrollSpy(); }, 80);
  }, { passive: true });

  /* ───────────────────── modal (i) ───────────────────── */
  function openModal(title, bodyHtml, crumb) {
    modalTitle.textContent = title;
    modalBody.innerHTML = bodyHtml || `<p>${esc(t("noDescription"))}</p>`;
    modalCrumb.textContent = crumb || "";
    modalBackdrop.hidden = false;
    document.body.style.overflow = "hidden";
    $("#mnModalClose").focus();
  }
  function closeModal() {
    modalBackdrop.hidden = true;
    document.body.style.overflow = "";
  }
  $("#mnModalClose").addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  /* ───────────────────── busca ───────────────────── */
  // índice plano: seções, cards e campos (reconstruído a cada troca de idioma)
  const searchIndex = [];
  function buildSearchIndex() {
   searchIndex.length = 0;
   SECTIONS.forEach((sec, si) => {
    searchIndex.push({
      kind: "sec", si,
      label: sec.title,
      crumb: "",
      text: fold(sec.title + " " + sec.summary + " " + stripHtml(sec.intro)),
      snippet: sec.summary,
      href: "#" + sec.id
    });
    sec.cards.forEach((card, ci) => {
      const cardText = [
        card.title, card.purpose,
        (card.howto || []).join(" "),
        (card.notes || []).join(" ")
      ].map(stripHtml).join(" ");
      searchIndex.push({
        kind: "card", si, ci,
        label: card.title,
        crumb: sec.title,
        text: fold(cardText),
        snippet: stripHtml(card.purpose).slice(0, 140),
        href: `#${sec.id}/${card.id}`
      });
      (card.fields || []).forEach((f, fi) => {
        searchIndex.push({
          kind: "field", si, ci, fi,
          label: f.name,
          crumb: `${sec.title} › ${card.title}`,
          text: fold(f.name + " " + f.type + " " + stripHtml(f.desc)),
          snippet: stripHtml(f.desc).slice(0, 140),
          href: `#${sec.id}/${card.id}`
        });
      });
    });
   });
  }

  let searchSel = -1;
  let searchHits = [];

  function highlight(text, terms) {
    let out = esc(text);
    for (const t of terms) {
      if (t.length < 2) continue;
      // marca a primeira ocorrência (sem regex sobre acentos — best effort)
      const idx = fold(out).indexOf(t);
      if (idx >= 0) {
        out = out.slice(0, idx) + "<mark>" + out.slice(idx, idx + t.length) + "</mark>" + out.slice(idx + t.length);
      }
    }
    return out;
  }

  function runSearch(q) {
    const terms = fold(q).split(/\s+/).filter(Boolean);
    if (!terms.length) { hideSearch(); return; }

    const scored = [];
    for (const item of searchIndex) {
      let score = 0;
      let all = true;
      for (const t of terms) {
        if (fold(item.label).includes(t)) score += 10;
        else if (item.text.includes(t)) score += 3;
        else { all = false; break; }
      }
      if (!all) continue;
      if (item.kind === "field") score += 2;   // campos são o alvo típico
      if (item.kind === "sec") score -= 1;
      scored.push({ item, score });
    }
    scored.sort((a, b) => b.score - a.score);
    searchHits = scored.slice(0, 18).map((s) => s.item);
    searchSel = -1;

    if (!searchHits.length) {
      searchPop.innerHTML = `<div class="mn-search-empty">${esc(t("nothingFound", { q }))}</div>`;
    } else {
      searchPop.innerHTML = searchHits.map((h, i) => `
        <button class="mn-search-hit" type="button" data-i="${i}">
          <span class="crumb">${esc(h.kind === "sec" ? t("sectionKind") : h.crumb)}</span>
          <span class="label">${highlight(h.label, terms)}</span>
          ${h.snippet ? `<span class="snip">${highlight(h.snippet, terms)}</span>` : ""}
        </button>`).join("");
      searchPop.querySelectorAll(".mn-search-hit").forEach((b) => {
        b.addEventListener("click", () => gotoHit(Number(b.dataset.i)));
      });
    }
    searchPop.hidden = false;
  }

  function gotoHit(i) {
    const hit = searchHits[i];
    if (!hit) return;
    hideSearch();
    searchInput.blur();
    if (location.hash === hit.href) {
      route(); // mesma âncora: força re-render pra rolar/flashear de novo
    } else {
      location.hash = hit.href;
    }
    // se for um campo, abre o popup (i) direto depois da navegação
    if (hit.kind === "field") {
      setTimeout(() => {
        const s = SECTIONS[hit.si], c = s.cards[hit.ci], f = c.fields[hit.fi];
        if (f) openModal(f.name, f.desc, `${s.title} › ${c.title}`);
      }, 350);
    }
  }

  function hideSearch() {
    searchPop.hidden = true;
    searchSel = -1;
  }

  searchInput.addEventListener("input", () => runSearch(searchInput.value));
  searchInput.addEventListener("focus", () => {
    if (searchInput.value.trim()) runSearch(searchInput.value);
  });
  searchInput.addEventListener("keydown", (e) => {
    if (searchPop.hidden) return;
    const hits = searchPop.querySelectorAll(".mn-search-hit");
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!hits.length) return;
      searchSel = e.key === "ArrowDown"
        ? Math.min(searchSel + 1, hits.length - 1)
        : Math.max(searchSel - 1, 0);
      hits.forEach((h, i) => h.classList.toggle("is-sel", i === searchSel));
      hits[searchSel].scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      e.preventDefault();
      gotoHit(searchSel >= 0 ? searchSel : 0);
    } else if (e.key === "Escape") {
      hideSearch();
      searchInput.blur();
    }
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#mnSearchWrap")) hideSearch();
  });

  /* ───────────────────── atalhos de teclado ───────────────────── */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!modalBackdrop.hidden) { closeModal(); return; }
      closeSidebarMobile();
    }
    // "/" foca a busca (fora de inputs)
    if (e.key === "/" && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
  });

  /* ───────────────────── roteamento ───────────────────── */
  function route() {
    const { sec: secId, card: cardId } = parseHash();
    const sec = secId ? sectionById(secId) : null;
    // entrar numa seção lembra a página dela — o "Início" volta pra certa
    if (sec) mnHomePage = secPage(sec);
    renderSidebar(sec ? sec.id : null, cardId);
    if (!sec) renderHome();
    else renderSection(sec, cardId);
    syncMockTheme();
    closeSidebarMobile();
  }

  /* ───────────────────── tema (claro/escuro) ───────────────────── */
  let mnTheme = localStorage.getItem("mn-theme");
  if (mnTheme !== "light" && mnTheme !== "dark") mnTheme = "dark";
  // Os mockups são .bf-screen — espelha o tema neles pra ativar as regras
  // .bf-screen.is-theme-light do app.css (mesmo comportamento do app).
  function syncMockTheme() {
    document.querySelectorAll(".mn-mock.bf-screen").forEach((el) =>
      el.classList.toggle("is-theme-light", mnTheme === "light"));
  }
  function applyTheme() {
    document.body.classList.toggle("is-theme-light", mnTheme === "light");
    syncMockTheme();
    const l = $("#mnThemeLight"), d = $("#mnThemeDark");
    if (l) l.classList.toggle("is-on", mnTheme === "light");
    if (d) d.classList.toggle("is-on", mnTheme === "dark");
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", mnTheme === "light" ? "#f8fafd" : "#0a0a0c");
  }
  function setTheme(v) {
    mnTheme = v === "light" ? "light" : "dark";
    localStorage.setItem("mn-theme", mnTheme);
    applyTheme();
  }
  const themeLightBtn = $("#mnThemeLight"), themeDarkBtn = $("#mnThemeDark");
  if (themeLightBtn) themeLightBtn.addEventListener("click", () => setTheme("light"));
  if (themeDarkBtn) themeDarkBtn.addEventListener("click", () => setTheme("dark"));

  /* ───────────────────── idioma (PT/EN/ES) ───────────────────── */
  // Atualiza os textos estáticos (atributos/labels que não passam pelo render)
  function applyStaticLang() {
    document.documentElement.lang = LANG_HTML[mnLang] || "pt-BR";
    const setAttr = (sel, attr, val) => { const el = $(sel); if (el) el.setAttribute(attr, val); };
    setAttr("#mnSearch", "placeholder", t("searchPlaceholder"));
    setAttr("#mnSearch", "aria-label", t("searchAria"));
    setAttr("#mnBurger", "title", t("burgerTitle"));
    setAttr("#mnBurger", "aria-label", t("burgerOpenAria"));
    setAttr(".mn-brand", "aria-label", t("brandAria"));
    setAttr("#mnModalClose", "aria-label", t("modalCloseAria"));
    setAttr("#mnThemeLight", "title", t("themeLight"));
    setAttr("#mnThemeLight", "aria-label", t("themeLight"));
    setAttr("#mnThemeDark", "title", t("themeDark"));
    setAttr("#mnThemeDark", "aria-label", t("themeDark"));
    setAttr("#mnLang", "title", t("langTitle"));
    setAttr("#mnLang", "aria-label", t("langAria"));
    const code = $("#mnLangCode");
    if (code) code.textContent = mnLang.toUpperCase();
  }
  function setLang(l) {
    mnLang = MN_LANGS.includes(l) ? l : "pt";
    localStorage.setItem("mn-lang", mnLang);
    applyStaticLang();
    applyContentLang(); // re-resolve o conteúdo dos cards + reconstrói a busca
    route(); // re-renderiza tudo traduzido
  }
  const langBtn = $("#mnLang");
  if (langBtn) langBtn.addEventListener("click", () => {
    const i = MN_LANGS.indexOf(mnLang);
    setLang(MN_LANGS[(i + 1) % MN_LANGS.length]);
  });

  applyTheme();
  applyStaticLang();
  applyContentLang();

  window.addEventListener("hashchange", route);
  route();
})();
