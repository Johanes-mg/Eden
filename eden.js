(function () {
  "use strict";

  const app = document.getElementById("app");
  const searchInput = document.getElementById("searchInput");
  const navLinks = document.querySelectorAll("[data-nav]");
  const langTrigger = document.getElementById("langTrigger");
  const langList = document.getElementById("langList");
  const langLabel = document.getElementById("langLabel");

  let DB = { categories: [] };
  let query = "";
  let currentLang = "en";
  let currentPlatform = "windows";

  const I18N = {
    en: {
      "nav.home": "Home",
      "nav.alternatives": "Alternatives",
      "nav.about": "About",
      "footer.tagline": "© 2026 Eden - The garden of alternatives.",
      "search.placeholder": "Search a software...",
      "hero.title.pre": "Cultivate your",
      "hero.title.em": "digital freedom.",
      "hero.subtitle": "The garden where tools grow freely.",
      "platform.windows": "Windows",
      "platform.android": "Android",
      "platform.linux": "Linux",
      "platform.os": "OS",
      "about.title": "About Eden",
      "about.lead":
        "Eden is not just a directory of software. It is a demanding selection of tools chosen for what they truly bring: freedom, sobriety, quality.",
      "about.block1.title": "Our mission",
      "about.block1.text":
        "Gather the best digital tools, whether free, open source or paid. Price is not the criterion — the quality of the experience is.",
      "about.block2.title": "Our method",
      "about.block2.text":
        "Every entry is tested, documented, maintained. We clearly distinguish what is free, what is open source, and what is paid. A red dot marks the commercial software we kept anyway, because it is worth it.",
      "about.block3.title": "Tagline",
      "about.block3.text":
        "Productivity is our ultimate driver. We list the tools you actually need — not just famous commercial software, but true quality.",
      "about.stack.title": "Under the hood",
      "about.stack.l1": "Minimalist interface",
      "about.stack.l2": "Data loaded from a single source",
      "about.stack.l3": "No external dependency",
      "about.github": "johanes.github.io",
      "empty.noresult": "No result for",
    },
    fr: {
      "nav.home": "Accueil",
      "nav.alternatives": "Alternatives",
      "nav.about": "À propos",
      "footer.tagline": "© 2026 Eden - Le jardin des alternatives.",
      "search.placeholder": "Rechercher un logiciel...",
      "hero.title.pre": "Cultivez votre",
      "hero.title.em": "liberté numérique.",
      "hero.subtitle": "Le jardin où les outils poussent librement.",
      "platform.windows": "Windows",
      "platform.android": "Android",
      "platform.linux": "Linux",
      "platform.os": "OS",
      "about.title": "À propos d'Eden",
      "about.lead":
        "Eden n'est pas un simple annuaire de logiciels. C'est une sélection exigeante d'outils choisis pour ce qu'ils apportent vraiment : liberté, sobriété, qualité.",
      "about.block1.title": "Notre mission",
      "about.block1.text":
        "Rassembler les meilleurs outils numériques, qu'ils soient libres, gratuits ou payants. Le prix n'est pas un critère, la qualité de l'expérience l'est.",
      "about.block2.title": "Notre méthode",
      "about.block2.text":
        "Chaque entrée est testée, documentée, maintenue. Nous distinguons clairement ce qui est libre, ce qui est gratuit, et ce qui est payant. Un point rouge signale les logiciels commerciaux retenus malgré tout, parce qu'ils valent le détour.",
      "about.block3.title": "Slogan",
      "about.block3.text":
        "La productivité est notre moteur absolu. On répertorie les outils dont vous avez réellement besoin, pas juste des outils commerciaux célèbres, mais de la haute qualité.",
      "about.stack.title": "Sous le capot",
      "about.stack.l1": "Interface minimaliste",
      "about.stack.l2": "Données chargées depuis une seule source",
      "about.stack.l3": "Aucune dépendance externe",
      "about.github": "johanes.github.io",
      "empty.noresult": "Aucun résultat pour",
    },
  };

  function t(key) {
    return (I18N[currentLang] && I18N[currentLang][key]) || key;
  }

  function categoryName(cat) {
    return currentLang === "en" && cat.nameEn ? cat.nameEn : cat.name;
  }

  function groupName(item) {
    return currentLang === "en" && item.groupEn ? item.groupEn : item.group;
  }

  function applyLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    langLabel.textContent = lang === "fr" ? "Français" : "English";

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.getAttribute("data-i18n");
      node.textContent = t(key);
    });

    searchInput.placeholder = t("search.placeholder");

    langList.querySelectorAll("li").forEach((li) => {
      li.classList.toggle("active", li.dataset.lang === lang);
    });

    navigate();
  }

  function setLang(lang) {
    localStorage.setItem("eden.lang", lang);
    applyLang(lang);
    closeLangMenu();
  }

  function openLangMenu() {
    langList.classList.add("open");
    langTrigger.setAttribute("aria-expanded", "true");
  }

  function closeLangMenu() {
    langList.classList.remove("open");
    langTrigger.setAttribute("aria-expanded", "false");
  }

  function toggleLangMenu() {
    if (langList.classList.contains("open")) closeLangMenu();
    else openLangMenu();
  }

  langTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleLangMenu();
  });

  langList.querySelectorAll("li").forEach((li) => {
    li.addEventListener("click", () => setLang(li.dataset.lang));
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".lang-menu")) closeLangMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLangMenu();
  });

  function getRoute() {
    const hash = window.location.hash.replace(/^#\/?/, "");
    return hash || "home";
  }

  function setActiveNav(route) {
    navLinks.forEach((link) => {
      const target = link.getAttribute("data-nav");
      const match =
        (route === "home" && target === "home") ||
        (route !== "home" && target === route);
      link.classList.toggle("active", match);
    });
  }

  function navigate() {
    const route = getRoute();
    setActiveNav(route);

    if (route === "alternatives") renderAll();
    else if (route === "about") renderAbout();
    else renderHome();

    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function itemMatchesPlatform(item, platform) {
    if (platform === "os") return true;
    if (!item.platform) return false;
    if (Array.isArray(item.platform)) return item.platform.includes(platform);
    return item.platform === platform;
  }

  function buildItem(item) {
    const box = el("div", "item");

    if (item.payant) {
      const dot = el("span", "item-dot");
      dot.title = currentLang === "fr" ? "Payant" : "Paid";
      box.appendChild(dot);
    }

    const logo = document.createElement("img");
    logo.src = item.image || "images/placeholder.png";
    logo.alt = "";
    logo.className = "item-logo";
    logo.width = 40;
    logo.height = 40;
    logo.loading = "lazy";
    box.appendChild(logo);

    const info = el("div", "item-info");
    info.appendChild(el("div", "item-title", item.name));
    box.appendChild(info);

    return box;
  }

  function buildGroupBlock(groupLabel, items) {
    const wrap = el("div", "subgroup");
    wrap.appendChild(el("h3", "subgroup-title", groupLabel));
    const grid = el("div", "items-grid");
    items.forEach((it) => grid.appendChild(buildItem(it)));
    wrap.appendChild(grid);
    return wrap;
  }

  function buildCategorySection(category) {
    let filtered;

    if (currentPlatform === "os") {
      if (category.id !== "os") return null;
      filtered = category.items;
    } else {
      filtered = category.items.filter((it) =>
        itemMatchesPlatform(it, currentPlatform),
      );
    }

    if (filtered.length === 0) return null;

    const section = el("section", "category-section");
    const header = el("div", "category-header");
    header.appendChild(el("h2", "category-title", categoryName(category)));
    section.appendChild(header);

    const hasGroups = filtered.some((it) => it.group);

    if (!hasGroups) {
      const grid = el("div", "items-grid");
      filtered.forEach((it) => grid.appendChild(buildItem(it)));
      section.appendChild(grid);
      return section;
    }

    const buckets = new Map();
    filtered.forEach((it) => {
      const key = groupName(it) || "";
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(it);
    });

    buckets.forEach((items, label) => {
      if (label) section.appendChild(buildGroupBlock(label, items));
      else {
        const grid = el("div", "items-grid");
        items.forEach((it) => grid.appendChild(buildItem(it)));
        section.appendChild(grid);
      }
    });

    return section;
  }

  function filteredCategories() {
    if (!query) return DB.categories;
    const q = query.toLowerCase();
    return DB.categories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (it) =>
            it.name.toLowerCase().includes(q) ||
            (it.tags || []).some((t) => t.toLowerCase().includes(q)) ||
            (it.group || "").toLowerCase().includes(q) ||
            (it.groupEn || "").toLowerCase().includes(q),
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }

  function renderEmpty() {
    const wrap = el("div", "empty");
    const icon = document.createElement("img");
    icon.src = "images/search.png";
    icon.alt = "";
    icon.className = "empty-icon";
    wrap.appendChild(icon);
    wrap.appendChild(el("p", null, t("empty.noresult") + " « " + query + " »"));
    return wrap;
  }

  function buildPlatformTabs() {
    const wrap = el("div", "platform-tabs");
    const platforms = [
      { id: "os", logo: "images/os.png" },
      { id: "windows", logo: "images/windows.png" },
      { id: "android", logo: "images/android.png" },
      { id: "linux", logo: "images/linux.png" },
    ];

    platforms.forEach((p) => {
      const btn = el("button", "platform-tab");
      btn.type = "button";
      btn.dataset.platform = p.id;
      btn.classList.toggle("active", p.id === currentPlatform);

      const img = document.createElement("img");
      img.src = p.logo;
      img.alt = "";
      img.className = "platform-logo";
      img.width = 16;
      img.height = 16;
      btn.appendChild(img);

      btn.appendChild(el("span", "platform-label", t("platform." + p.id)));

      btn.addEventListener("click", () => {
        currentPlatform = p.id;
        localStorage.setItem("eden.platform", currentPlatform);
        renderAll();
      });

      wrap.appendChild(btn);
    });

    return wrap;
  }

  function renderHome() {
    app.innerHTML = "";
    app.classList.remove("app-top");
    app.classList.add("app-centered");

    const hero = el("section", "hero");
    const h1 = document.createElement("h1");
    h1.innerHTML = t("hero.title.pre") + " <em>" + t("hero.title.em") + "</em>";
    const p = el("p", null, t("hero.subtitle"));
    hero.appendChild(h1);
    hero.appendChild(p);
    app.appendChild(hero);
  }

  function renderAll() {
    app.innerHTML = "";
    app.classList.remove("app-centered");
    app.classList.add("app-top");

    app.appendChild(buildPlatformTabs());

    const cats = filteredCategories();
    let rendered = 0;

    cats.forEach((cat) => {
      const section = buildCategorySection(cat);
      if (section) {
        app.appendChild(section);
        rendered++;
      }
    });

    if (rendered === 0) {
      app.appendChild(renderEmpty());
    }
  }

  function renderAbout() {
    app.innerHTML = "";
    app.classList.remove("app-centered");
    app.classList.add("app-top");

    const wrap = el("div", "about-content");

    const intro = el("div", "about-intro");
    intro.appendChild(el("h2", null, t("about.title")));
    intro.appendChild(el("p", "about-lead", t("about.lead")));
    wrap.appendChild(intro);

    const sections = [
      { title: t("about.block1.title"), text: t("about.block1.text") },
      { title: t("about.block2.title"), text: t("about.block2.text") },
      { title: t("about.block3.title"), text: t("about.block3.text") },
    ];

    sections.forEach((sec) => {
      const block = el("div", "about-block");
      block.appendChild(el("h3", "about-block-title", sec.title));
      block.appendChild(el("p", null, sec.text));
      wrap.appendChild(block);
    });

    const stack = el("div", "about-block");
    stack.appendChild(el("h3", "about-block-title", t("about.stack.title")));
    const stackList = el("ul", "about-stack");
    [t("about.stack.l1"), t("about.stack.l2"), t("about.stack.l3")].forEach(
      (line) => {
        const li = el("li");
        li.appendChild(el("span", "about-bullet", "—"));
        li.appendChild(document.createTextNode(" " + line));
        stackList.appendChild(li);
      },
    );
    stack.appendChild(stackList);
    wrap.appendChild(stack);

    const cta = el("div", "about-cta");
    const btn = el("a", "github-btn");
    btn.href = "https://johanes.github.io";
    btn.target = "_blank";
    btn.rel = "noopener noreferrer";

    const ghIcon = document.createElement("img");
    ghIcon.src = "images/github.png";
    ghIcon.alt = "";
    ghIcon.className = "github-btn-icon";
    ghIcon.width = 20;
    ghIcon.height = 20;
    btn.appendChild(ghIcon);

    btn.appendChild(el("span", "github-btn-label", t("about.github")));

    const arrow = document.createElement("img");
    arrow.src = "images/arrow-right.png";
    arrow.alt = "";
    arrow.className = "github-btn-arrow";
    arrow.width = 16;
    arrow.height = 16;
    btn.appendChild(arrow);

    cta.appendChild(btn);
    wrap.appendChild(cta);

    app.appendChild(wrap);
  }

  function resetSearch() {
    query = "";
    if (searchInput.value !== "") {
      searchInput.value = "";
    }
    if (getRoute() !== "alternatives") {
      window.location.hash = "#/alternatives";
    } else {
      renderAll();
    }
  }

  let searchTimer;
  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      const value = e.target.value.trim();

      if (value === "") {
        resetSearch();
        return;
      }

      query = value;

      if (getRoute() !== "alternatives") {
        window.location.hash = "#/alternatives";
      } else {
        renderAll();
      }
    }, 180);
  });

  searchInput.addEventListener("search", () => {
    resetSearch();
  });

  const savedLang = localStorage.getItem("eden.lang");
  currentLang = savedLang === "fr" || savedLang === "en" ? savedLang : "en";

  const savedPlatform = localStorage.getItem("eden.platform");
  currentPlatform =
    savedPlatform === "windows" ||
    savedPlatform === "android" ||
    savedPlatform === "linux" ||
    savedPlatform === "os"
      ? savedPlatform
      : "windows";

  applyLang(currentLang);

  fetch("eden.json")
    .then((r) => r.json())
    .then((data) => {
      DB = data;
      window.addEventListener("hashchange", navigate);
      navigate();
    })
    .catch((err) => {
      console.error("Détail erreur:", err);
      app.innerHTML =
        '<p style="text-align:center;color:#c96442;padding:40px;">Erreur de chargement : ' +
        err.message +
        "</p>";
    });
})();
