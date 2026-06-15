const STORAGE_KEY = "cellarium-v21";

const seedBottles = [
  { id: "rayas-2016", nom: "Chateau Rayas", millesime: "2016", region: "Chateauneuf-du-Pape", couleur: "Rouge", stock: 3, prixAchat: 1200, valeurEstimee: 2040, emplacement: "Cave principale - Etagere 3", dateAcquisition: "12 avril 2026", note: "Race fauve, tanins droits. Le temps revele ce que l'emotion preserve." },
  { id: "yquem-2001", nom: "Yquem", millesime: "2001", region: "Sauternes", couleur: "Blanc", stock: 4, prixAchat: 520, valeurEstimee: 980, emplacement: "Armoire doree", dateAcquisition: "3 mai 2024", note: "L'or lent du matin." },
  { id: "romanee-conti-2010", nom: "Romanee Conti", millesime: "2010", region: "Bourgogne", couleur: "Rouge", stock: 1, prixAchat: 9800, valeurEstimee: 22500, emplacement: "Reserve", dateAcquisition: "18 juin 2023", note: "Le silence avant la page." },
  { id: "clos-rougeard-2020", nom: "Clos Rougeard", millesime: "2020", region: "Saumur Champigny", couleur: "Rouge", stock: 12, prixAchat: 180, valeurEstimee: 420, emplacement: "Cave basse", dateAcquisition: "7 octobre 2025", note: "Craie, conversation, patience." },
  { id: "masseto-2015", nom: "Masseto", millesime: "2015", region: "Toscane", couleur: "Rouge", stock: 2, prixAchat: 620, valeurEstimee: 1050, emplacement: "Italie", dateAcquisition: "22 janvier 2025", note: "Velours sombre, pierre chaude." },
  { id: "latour-2009", nom: "Chateau Latour", millesime: "2009", region: "Pauillac", couleur: "Rouge", stock: 6, prixAchat: 760, valeurEstimee: 1320, emplacement: "Bordeaux", dateAcquisition: "9 septembre 2024", note: "Architecture, graphite, grande garde." },
  { id: "gaja-2017", nom: "Gaja", millesime: "2017", region: "Barbaresco", couleur: "Rouge", stock: 5, prixAchat: 230, valeurEstimee: 360, emplacement: "Italie", dateAcquisition: "14 mars 2024", note: "Rose fanee, tanins droits." },
  { id: "krug-2010", nom: "Krug Grande Cuvee", millesime: "2010", region: "Champagne", couleur: "Effervescent", stock: 8, prixAchat: 190, valeurEstimee: 310, emplacement: "Champagnes", dateAcquisition: "1 decembre 2025", note: "Noisette, craie, fete retenue." },
  { id: "jamet-2010", nom: "Domaine Jamet", millesime: "2010", region: "Cote-Rotie", couleur: "Rouge", stock: 4, prixAchat: 170, valeurEstimee: 390, emplacement: "Rhone", dateAcquisition: "29 aout 2025", note: "Fumee, violette, tension noble." }
];

let bottles = loadBottles();
let screen = "home";
let selectedBottleId = bottles[0].id;
let query = "";

const app = document.querySelector("#app");

function loadBottles() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || structuredClone(seedBottles);
  } catch {
    return structuredClone(seedBottles);
  }
}

function saveBottles() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bottles));
}

function selectedBottle() {
  return bottles.find((bottle) => bottle.id === selectedBottleId) || bottles[0];
}

function totalStock() {
  return bottles.reduce((sum, bottle) => sum + Number(bottle.stock || 0), 0);
}

function totalValue() {
  return bottles.reduce((sum, bottle) => sum + Number(bottle.valeurEstimee || 0) * Number(bottle.stock || 0), 0);
}

function euro(value) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(Number(value || 0));
}

function render() {
  app.innerHTML = screen === "home" ? renderHome() : screen === "detail" ? renderDetail() : renderCave();
  bindEvents();
}

function goTo(nextScreen) {
  screen = nextScreen;
  render();
}

function goBack() {
  if (screen === "detail") {
    goTo("cave");
    return;
  }
  if (screen === "cave") goTo("home");
}

function renderHome() {
  return `
    <main class="screen home-screen" aria-label="Accueil Cellarium">
      <div class="home-library" aria-hidden="true">${Array.from({ length: 36 }, (_, index) => `<span class="library-book b${index + 1}"></span>`).join("")}</div>
      <div class="home-arch" aria-hidden="true"><span></span></div>
      <div class="home-vineyard" aria-hidden="true">${Array.from({ length: 9 }, (_, index) => `<i class="vine-row r${index + 1}"></i>`).join("")}</div>
      <div class="home-still-life" aria-hidden="true">
        <div class="wine-glass"></div>
        <div class="candle"></div>
        <div class="open-book"><i></i><i></i></div>
        <div class="grapes">${Array.from({ length: 14 }, (_, index) => `<span class="grape g${index + 1}"></span>`).join("")}</div>
      </div>
      <button class="settings-button settings-hotspot" type="button" aria-label="Settings"></button>
      <section class="home-copy">
        <img class="brand-icon" src="icon.png" alt="">
        <h1>CELLARIUM</h1>
        <p>Bibliotheque du gout et du temps</p>
        <blockquote>
          "Le veritable voyage<br>
          ne consiste pas a chercher<br>
          de nouveaux paysages<br>
          mais a avoir de nouveaux yeux."
          <cite>Marcel Proust</cite>
        </blockquote>
      </section>
      <button class="parchment-button enter-hotspot" type="button">Entrer dans la cave</button>
    </main>
  `;
}

function renderCave() {
  const visible = bottles.filter((bottle) =>
    `${bottle.nom} ${bottle.millesime} ${bottle.region} ${bottle.couleur}`.toLowerCase().includes(query.toLowerCase())
  );

  return `
    <main class="screen cave-screen" aria-label="Cave Cellarium">
      <button class="screen-back" type="button" aria-label="Retour"></button>
      <aside class="cave-sidebar">
        <img src="icon.png" alt="">
        <strong>Cellarium</strong>
        ${["Cave", "Carnet", "Traces", "Compagnons", "Associations", "Pantheon", "Destins", "Portrait"].map((item, index) => `<span class="${index === 0 ? "active" : ""}">${item}</span>`).join("")}
      </aside>
      <section class="cave-main">
        <input class="cave-search" id="search" value="${escapeAttr(query)}" placeholder="Rechercher un vin, un domaine, une region..." aria-label="Recherche">
        <div class="filters"><button>Regions</button><button>Appellations</button><button>Couleurs</button><button>Annees</button></div>
        <div class="shelves">
          ${visible.slice(0, 9).map((bottle, index) => renderBottleBook(bottle, index)).join("")}
        </div>
        <footer class="cave-stats">
          <span><strong>${bottles.length}</strong> references</span>
          <span><strong>${totalStock()}</strong> bouteilles</span>
          <span><strong>${euro(totalValue())}</strong> valeur totale</span>
          <button id="addBottle">Ajouter une bouteille</button>
        </footer>
      </section>
      ${renderAddDialog()}
    </main>
  `;
}

function renderBottleBook(bottle, index) {
  return `
    <button class="bottle-book tone-${index % 5}" type="button" data-bottle="${bottle.id}" aria-label="${escapeAttr(bottle.nom)}">
      <span class="book-emblem"></span>
      <strong>${escapeHtml(bottle.nom)}</strong>
      <em>${escapeHtml(bottle.millesime)}</em>
      <small>${escapeHtml(bottle.region)}</small>
    </button>
  `;
}

function renderAddDialog() {
  return `
    <dialog class="cellarium-dialog" id="addDialog">
      <form method="dialog" id="addForm">
        <h2>Ajouter une bouteille</h2>
        <input name="nom" placeholder="Nom" required>
        <input name="millesime" placeholder="Millesime" required>
        <input name="region" placeholder="Region">
        <input name="stock" type="number" min="0" value="1" placeholder="Stock">
        <div>
          <button value="save">Ajouter</button>
          <button value="cancel">Fermer</button>
        </div>
      </form>
    </dialog>
  `;
}

function renderDetail() {
  const bottle = selectedBottle();

  return `
    <main class="screen detail-screen" aria-label="Fiche bouteille Cellarium">
      <button class="screen-back" type="button" aria-label="Retour"></button>
      <section class="open-ledger">
        <article class="ledger-page left-page">
          <h1>${escapeHtml(bottle.nom)}</h1>
          <h2>${escapeHtml(bottle.millesime)}</h2>
          <p>${escapeHtml(bottle.region)}</p>
          <div class="bottle-visual"><span>${escapeHtml(bottle.nom)}</span></div>
          <dl>
            <div><dt>Domaine</dt><dd>${escapeHtml(bottle.nom)}</dd></div>
            <div><dt>Couleur</dt><dd>${escapeHtml(bottle.couleur || "Rouge")}</dd></div>
            <div><dt>Format</dt><dd>75 cl</dd></div>
          </dl>
        </article>
        <article class="ledger-page right-page">
          <h2>Informations</h2>
          <div class="stock-row">
            <span>Stock</span>
            <button class="stock-minus-hotspot" type="button">-</button>
            <output class="stock-value">${bottle.stock}</output>
            <button class="stock-plus-hotspot" type="button">+</button>
          </div>
          <dl class="info-list">
            <div><dt>Prix d'achat</dt><dd>${euro(bottle.prixAchat)}</dd></div>
            <div><dt>Valeur estimee</dt><dd>${euro(bottle.valeurEstimee)}</dd></div>
            <div><dt>Emplacement</dt><dd>${escapeHtml(bottle.emplacement)}</dd></div>
            <div><dt>Date d'acquisition</dt><dd>${escapeHtml(bottle.dateAcquisition)}</dd></div>
          </dl>
          <label class="note-label" for="note">Note personnelle</label>
          <textarea class="reference-note" id="note">${escapeHtml(bottle.note)}</textarea>
        </article>
      </section>
      <nav class="detail-tabs" aria-label="Sections">
        ${["Degustations", "Souvenirs", "Compagnons", "Associations", "Pantheon", "Destins"].map((tab) => `<button type="button">${tab}</button>`).join("")}
      </nav>
    </main>
  `;
}

function bindEvents() {
  document.querySelector(".settings-hotspot")?.addEventListener("click", () => goTo("home"));
  document.querySelector(".enter-hotspot")?.addEventListener("click", () => goTo("cave"));
  document.querySelector(".screen-back")?.addEventListener("click", () => goBack());

  document.querySelector("#search")?.addEventListener("input", (event) => {
    query = event.target.value;
    render();
    const search = document.querySelector("#search");
    search.focus();
    search.setSelectionRange(query.length, query.length);
  });

  document.querySelectorAll("[data-bottle]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedBottleId = button.dataset.bottle;
      goTo("detail");
    });
  });

  document.querySelector("#addBottle")?.addEventListener("click", () => document.querySelector("#addDialog").showModal());
  document.querySelector("#addForm")?.addEventListener("submit", (event) => {
    if (event.submitter?.value !== "save") return;
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const bottle = {
      id: `bottle-${Date.now()}`,
      nom: data.nom,
      millesime: data.millesime,
      region: data.region || "Cave",
      couleur: "Rouge",
      stock: Number(data.stock || 0),
      prixAchat: 0,
      valeurEstimee: 0,
      emplacement: "Nouvelle entree",
      dateAcquisition: "A renseigner",
      note: "Nouvelle page a ecrire."
    };
    bottles.push(bottle);
    selectedBottleId = bottle.id;
    saveBottles();
    goTo("detail");
  });

  document.querySelector(".stock-minus-hotspot")?.addEventListener("click", () => changeStock(-1));
  document.querySelector(".stock-plus-hotspot")?.addEventListener("click", () => changeStock(1));
  document.querySelector("#note")?.addEventListener("change", (event) => {
    selectedBottle().note = event.target.value;
    saveBottles();
  });
}

function changeStock(delta) {
  const bottle = selectedBottle();
  bottle.stock = Math.max(0, Number(bottle.stock || 0) + delta);
  saveBottles();
  render();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

render();
