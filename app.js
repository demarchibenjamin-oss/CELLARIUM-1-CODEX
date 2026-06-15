const STORAGE_KEY = "cellarium-reference-screens-v2";

const references = {
  home: "assets/reference/01-accueil-reference.png",
  cave: "assets/reference/02-cave-reference.png",
  detail: "assets/reference/03-fiche-bouteille-reference.png"
};

const seedBottles = [
  { id: "rayas-2016", nom: "Chateau Rayas", millesime: "2016", region: "Rhone", stock: 3, note: "Le temps revele ce que l'emotion preserve." },
  { id: "yquem-2001", nom: "Yquem", millesime: "2001", region: "Sauternes", stock: 4, note: "L'or lent du matin." },
  { id: "romanee-conti-2010", nom: "Romanee Conti", millesime: "2010", region: "Bourgogne", stock: 1, note: "Le silence avant la page." },
  { id: "clos-rougeard-2020", nom: "Clos Rougeard", millesime: "2020", region: "Loire", stock: 12, note: "Craie, conversation, patience." },
  { id: "masseto-2015", nom: "Masseto", millesime: "2015", region: "Toscane", stock: 2, note: "Velours sombre, pierre chaude." },
  { id: "latour-2009", nom: "Chateau Latour", millesime: "2009", region: "Pauillac", stock: 6, note: "Architecture, graphite, grande garde." },
  { id: "gaja-2017", nom: "Gaja", millesime: "2017", region: "Barbaresco", stock: 5, note: "Rose fanee, tanins droits." },
  { id: "krug-2010", nom: "Krug Grande Cuvee", millesime: "2010", region: "Champagne", stock: 8, note: "Noisette, craie, fete retenue." },
  { id: "jamet-2010", nom: "Domaine Jamet", millesime: "2010", region: "Cote-Rotie", stock: 4, note: "Fumee, violette, tension noble." }
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

function render() {
  app.innerHTML = screen === "home" ? renderHome() : screen === "detail" ? renderDetail() : renderCave();
  bindEvents();
}

function referenceImage(name, label) {
  return `<img class="reference-bg" src="${references[name]}" alt="${label}" draggable="false">`;
}

function renderHome() {
  return `
    <main class="home-screen" aria-label="Accueil Cellarium">
      <div class="home-vineyard" aria-hidden="true"></div>
      <div class="home-vine-rows" aria-hidden="true">
        ${Array.from({ length: 9 }, (_, index) => `<span class="home-vine-row home-vine-row-${index + 1}"></span>`).join("")}
      </div>
      <div class="home-library" aria-hidden="true">
        ${Array.from({ length: 42 }, (_, index) => `<span class="home-book home-book-${index + 1}"></span>`).join("")}
      </div>
      <div class="home-arch" aria-hidden="true">
        ${Array.from({ length: 18 }, (_, index) => `<span class="home-stone home-stone-${index + 1}"></span>`).join("")}
      </div>
      <div class="home-table" aria-hidden="true"></div>
      <div class="home-candle" aria-hidden="true"></div>
      <div class="home-glass" aria-hidden="true"></div>
      <div class="home-open-book" aria-hidden="true">
        <span class="home-page home-page-left"></span>
        <span class="home-page home-page-right"></span>
        <span class="home-book-spine"></span>
      </div>
      <button class="home-settings settings-hotspot" type="button" aria-label="Settings"></button>
      <section class="home-brand" aria-label="Cellarium">
        <span class="home-logo-mark" aria-hidden="true"></span>
        <h1>CELLARIUM</h1>
        <p>Bibliotheque du gout et du temps</p>
      </section>
      <blockquote class="home-quote">
        <p>"Le veritable voyage<br>ne consiste pas a chercher<br>de nouveaux paysages<br>mais a avoir de nouveaux yeux."</p>
        <cite>Marcel Proust</cite>
      </blockquote>
      <button class="home-enter enter-hotspot" type="button">Entrer dans la cave</button>
    </main>
  `;
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
  if (screen === "cave") {
    goTo("home");
  }
}

function renderCave() {
  const visible = bottles.filter((bottle) =>
    `${bottle.nom} ${bottle.millesime} ${bottle.region}`.toLowerCase().includes(query.toLowerCase())
  );

  return `
    <main class="reference-screen screen-cave" aria-label="Cave Cellarium">
      ${referenceImage("cave", "Maquette officielle cave Cellarium")}
      <button class="screen-back" type="button" aria-label="Retour a l'ecran precedent"></button>
      <button class="hotspot settings-hotspot" type="button" aria-label="Settings"></button>
      <button class="hotspot cave-tab-hotspot" type="button" aria-label="Cave"></button>
      <input class="reference-input" id="search" value="${escapeAttr(query)}" aria-label="Recherche">
      ${visible.slice(0, 9).map((bottle, index) => `
        <button class="hotspot book-hotspot book-${index + 1}" type="button" data-bottle="${bottle.id}" aria-label="${escapeAttr(bottle.nom)}"></button>
      `).join("")}
      <button class="hotspot add-bottle-hotspot" id="addBottle" type="button" aria-label="Ajouter une bouteille"></button>
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
    </main>
  `;
}

function renderDetail() {
  const bottle = selectedBottle();

  return `
    <main class="reference-screen screen-detail" aria-label="Fiche bouteille Cellarium">
      ${referenceImage("detail", "Maquette officielle fiche bouteille Cellarium")}
      <button class="screen-back" type="button" aria-label="Retour a l'ecran precedent"></button>
      <button class="hotspot back-hotspot" type="button" aria-label="Retour Cave"></button>
      <button class="hotspot settings-hotspot" type="button" aria-label="Settings"></button>
      <button class="hotspot stock-minus-hotspot" type="button" aria-label="Retirer une bouteille"></button>
      <button class="hotspot stock-plus-hotspot" type="button" aria-label="Ajouter une bouteille au stock"></button>
      <output class="stock-value">${bottle.stock}</output>
      <textarea class="reference-note" id="note" aria-label="Note">${escapeHtml(bottle.note)}</textarea>
      ${["degustations", "souvenirs", "compagnons", "associations", "pantheon", "destins"].map((name, index) => `
        <button class="hotspot side-tab side-tab-${index + 1}" type="button" aria-label="${name}"></button>
      `).join("")}
    </main>
  `;
}

function bindEvents() {
  document.querySelector(".settings-hotspot")?.addEventListener("click", () => {
    goTo("home");
  });

  document.querySelector(".enter-hotspot")?.addEventListener("click", () => {
    goTo("cave");
  });

  document.querySelector(".back-hotspot")?.addEventListener("click", () => {
    goTo("cave");
  });

  document.querySelector(".screen-back")?.addEventListener("click", () => {
    goBack();
  });

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

  document.querySelector("#addBottle")?.addEventListener("click", () => {
    document.querySelector("#addDialog").showModal();
  });

  document.querySelector("#addForm")?.addEventListener("submit", (event) => {
    if (event.submitter?.value !== "save") return;
    event.preventDefault();

    const data = Object.fromEntries(new FormData(event.currentTarget));
    const bottle = {
      id: `bottle-${Date.now()}`,
      nom: data.nom,
      millesime: data.millesime,
      region: data.region || "Cave",
      stock: Number(data.stock || 0),
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
    const bottle = selectedBottle();
    bottle.note = event.target.value;
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
