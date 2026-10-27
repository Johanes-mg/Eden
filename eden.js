(function () {
  "use strict";

  const app = document.getElementById("app");
  const searchInput = document.getElementById("searchInput");
  const navLinks = document.querySelectorAll("[data-nav]");

  let DB = { categories: [] };
  let query = "";

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

    if (route === "alternatives") {
      renderAll();
    } else if (route === "about") {
      renderAbout();
    } else {
      renderHome();
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function buildItem(item) {
    const box = el("div", "item");

    if (item.payant) {
      const dot = el("span", "item-dot");
      dot.title = "Payant";
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

  function buildGroupBlock(groupName, items) {
    const wrap = el("div", "subgroup");
    wrap.appendChild(el("h3", "subgroup-title", groupName));
    const grid = el("div", "items-grid");
    items.forEach((it) => grid.appendChild(buildItem(it)));
    wrap.appendChild(grid);
    return wrap;
  }

  function buildCategorySection(category) {
    const section = el("section", "category-section");

    const header = el("div", "category-header");
    header.appendChild(el("h2", "category-title", category.name));
    section.appendChild(header);

    const hasGroups = category.items.some((it) => it.group);

    if (!hasGroups) {
      const grid = el("div", "items-grid");
      category.items.forEach((it) => grid.appendChild(buildItem(it)));
      section.appendChild(grid);
      return section;
    }

    const buckets = new Map();
    category.items.forEach((it) => {
      const key = it.group || "";
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(it);
    });

    buckets.forEach((items, groupName) => {
      if (groupName) {
        section.appendChild(buildGroupBlock(groupName, items));
      } else {
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
            (it.group || "").toLowerCase().includes(q),
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
    wrap.appendChild(el("p", null, "Aucun résultat pour « " + query + " »"));
    return wrap;
  }

  function renderHome() {
    app.innerHTML = "";

    const hero = el("section", "hero");
    const h1 = document.createElement("h1");
    h1.innerHTML = "Cultivez votre <em>liberté numérique.</em>";
    const p = el("p", null, "Aucune limite n'est un obstacle.");
    hero.appendChild(h1);
    hero.appendChild(p);
    app.appendChild(hero);
  }

  function renderAll() {
    app.innerHTML = "";
    const cats = filteredCategories();

    if (cats.length === 0) {
      app.appendChild(renderEmpty());
      return;
    }

    cats.forEach((cat) => app.appendChild(buildCategorySection(cat)));
  }

  function renderAbout() {
    app.innerHTML = "";

    const wrap = el("div", "about-content");

    const intro = el("div", "about-intro");
    intro.appendChild(el("h2", null, "À propos d'Eden"));
    intro.appendChild(
      el(
        "p",
        "about-lead",
        "Eden n'est pas un simple annuaire de logiciels gratuits. C'est une sélection exigeante d'outils choisis pour ce qu'ils apportent vraiment : liberté, sobriété, respect de l'utilisateur. Un graal, pas un catalogue.",
      ),
    );
    wrap.appendChild(intro);

    const sections = [
      {
        title: "Notre mission",
        text: "Rassembler les meilleurs outils numériques — libres, gratuits ou payants — à condition qu'ils soient honnêtes, sans bloatware, sans suivi, et qu'ils rendent le contrôle à l'utilisateur. Le prix n'est pas un critère, la qualité de l'expérience l'est.",
      },
      {
        title: "Notre méthode",
        text: "Chaque entrée est testée, documentée, maintenue. Nous distinguons clairement ce qui est libre, ce qui est gratuit, et ce qui est payant — un point rouge signale les logiciels commerciaux retenus malgré tout, parce qu'ils valent le détour.",
      },
      {
        title: "Nos principes",
        text: "Aucune publicité, aucun tracking, aucun classement sponsorisé. Vie privée par défaut. Aucune dépendance imposée à un écosystème fermé. Eden est un site statique : un fichier HTML, un CSS, un JS, un JSON.",
      },
    ];

    sections.forEach((sec) => {
      const block = el("div", "about-block");
      block.appendChild(el("h3", "about-block-title", sec.title));
      block.appendChild(el("p", null, sec.text));
      wrap.appendChild(block);
    });

    const stack = el("div", "about-block");
    stack.appendChild(el("h3", "about-block-title", "Sous le capot"));
    const stackList = el("ul", "about-stack");
    [
      "Interface minimaliste",
      "Données chargées depuis une seule source",
      "Aucune dépendance externe",
    ].forEach((line) => {
      const li = el("li");
      li.appendChild(el("span", "about-bullet", "—"));
      li.appendChild(document.createTextNode(" " + line));
      stackList.appendChild(li);
    });
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

    btn.appendChild(el("span", "github-btn-label", "johanes.github.io"));

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

  let searchTimer;
  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      query = e.target.value.trim();
      if (query === "") return;
      const route = getRoute();
      if (route !== "alternatives") {
        window.location.hash = "#/alternatives";
      } else {
        renderAll();
      }
    }, 180);
  });

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
