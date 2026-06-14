const STORAGE_KEY = "cellarium-reference-bg-v1";

const seedBottles = [
  { id: "rayas-2016", nom: "Château Rayas", millesime: "2016", region: "Rhône", stock: 3, prixAchat: 1200, valeurEstimee: 2400, note: "Le temps révèle ce que l'émotion préserve." },
  { id: "yquem-2001", nom: "Yquem", millesime: "2001", region: "Sauternes", stock: 4, prixAchat: 520, valeurEstimee: 980, note: "L'or lent du matin." },
  { id: "romanee-conti-2010", nom: "Romanée Conti", millesime: "2010", region: "Bourgogne", stock: 1, prixAchat: 9800, valeurEstimee: 22500, note: "Le silence avant la page." },
  { id: "clos-rougeard-2020", nom: "Clos Rougeard", millesime: "2020", region: "Loire", stock: 12, prixAchat: 180, valeurEstimee: 420, note: "Craie, conversation, patience." },
  { id: "masseto-2015", nom: "Masseto", millesime: "2015", region: "Toscane", stock: 2, prixAchat: 620, valeurEstimee: 1050, note: "Velours sombre, pierre chaude." },
  { id: "latour-2009", nom: "Château Latour", millesime: "2009", region: "Pauillac", stock: 6, prixAchat: 760, valeurEstimee: 1320, note: "Architecture, graphite, grande garde." },
  { id: "gaja-2017", nom: "Gaja", millesime: "2017", region: "Barbaresco", stock: 5, prixAchat: 230, valeurEstimee: 360, note: "Rose fanée, tanins droits." },
  { id: "krug-2010", nom: "Krug Grande Cuvée", millesime: "2010", region: "Champagne", stock: 8, prixAchat: 190, valeurEstimee: 310, note: "Noisette, craie, fête retenue." },
  { id: "jamet-2010", nom: "Domaine Jamet", millesime: "2010", region: "Côte-Rôtie", stock: 4, prixAchat: 170, valeurEstimee: 390, note: "Fumée, violette, tension noble." }
];

let bottles = loadBottles();
let screen = "home";
let selectedBottleId = bottles[0].id;
let query = "";
const app = document.querySelector("#app");

function loadBottles() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || structuredClone(seedBottles); } catch { return structuredClone(seedBottles); } }
function saveBottles() { localStorage.setItem(STORAGE_KEY, JSON.stringify(bottles)); }
function selectedBottle() { return bottles.find((bottle) => bottle.id === selectedBottleId) || bottles[0]; }
function euro(value) { return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(Number(value || 0)); }
function escapeHtml(value) { return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
function escapeAttr(value) { return escapeHtml(value); }

function render() {
  app.innerHTML = screen === "home" ? renderHome() : screen === "detail" ? renderDetail() : renderCave();
  bind();
}

function renderHome() {
  return `<main class="mockup mockup-home" aria-label="Accueil Cellarium"><button class="hotspot home-settings" aria-label="Réglages"></button><button class="hotspot home-enter" aria-label="Entrer dans la cave"></button></main>`;
}

function renderCave() {
  const visible = bottles.filter((bottle) => `${bottle.nom} ${bottle.millesime} ${bottle.region}`.toLowerCase().includes(query.toLowerCase()));
  return `<main class="mockup mockup-cave" aria-label="Cave Cellarium"><input class="overlay-search" id="search" value="${escapeAttr(query)}" aria-label="Recherche"><button class="hotspot nav-cave" aria-label="Cave"></button>${visible.slice(0, 9).map((bottle, index) => `<button class="hotspot book-hotspot book-${index + 1}" data-bottle="${bottle.id}" aria-label="${escapeAttr(bottle.nom)}"></button>`).join("")}<button class="hotspot add-bottle-hotspot" id="addBottle" aria-label="Ajouter une bouteille"></button><dialog class="cellarium-dialog" id="addDialog"><form method="dialog" id="addForm"><h2>Ajouter une bouteille</h2><input name="nom" placeholder="Nom" required><input name="millesime" placeholder="Millésime" required><input name="region" placeholder="Région"><input name="stock" type="number" min="0" value="1" placeholder="Stock"><div><button value="save">Ajouter</button><button value="cancel">Fermer</button></div></form></dialog></main>`;
}

function renderDetail() {
  const bottle = selectedBottle();
  return `<main class="mockup mockup-detail" aria-label="Fiche bouteille Cellarium"><button class="hotspot back-cave" aria-label="Retour cave"></button><button class="hotspot stock-minus" aria-label="Retirer une bouteille"></button><button class="hotspot stock-plus" aria-label="Ajouter une bouteille au stock"></button><output class="stock-overlay">${bottle.stock}</output><textarea class="note-overlay" id="note">${escapeHtml(bottle.note)}</textarea><div class="selected-overlay"><strong>${escapeHtml(bottle.nom)}</strong><span>${escapeHtml(bottle.millesime)} · ${escapeHtml(bottle.region)} · ${euro(bottle.valeurEstimee)}</span></div>${["degustations", "souvenirs", "compagnons", "associations", "pantheon", "destins"].map((name, index) => `<button class="hotspot tab-hotspot tab-${index + 1}" aria-label="${name}"></button>`).join("")}</main>`;
}

function bind() {
  if (screen === "home") document.querySelector(".home-enter").onclick = () => { screen = "cave"; render(); };
  if (screen === "cave") {
    document.querySelector("#search").oninput = (event) => { query = event.target.value; render(); const input = document.querySelector("#search"); input.focus(); input.setSelectionRange(query.length, query.length); };
    document.querySelectorAll("[data-bottle]").forEach((button) => { button.onclick = () => { selectedBottleId = button.dataset.bottle; screen = "detail"; render(); }; });
    document.querySelector("#addBottle").onclick = () => document.querySelector("#addDialog").showModal();
    document.querySelector("#addForm").onsubmit = (event) => {
      if (event.submitter?.value !== "save") return;
      event.preventDefault();
      const data = Object.fromEntries(new FormData(event.currentTarget));
      const bottle = { id: `bottle-${Date.now()}`, nom: data.nom, millesime: data.millesime, region: data.region || "Cave", stock: Number(data.stock || 0), prixAchat: 0, valeurEstimee: 0, note: "Nouvelle page à écrire." };
      bottles.push(bottle); selectedBottleId = bottle.id; saveBottles(); screen = "detail"; render();
    };
  }
  if (screen === "detail") {
    const bottle = selectedBottle();
    document.querySelector(".back-cave").onclick = () => { screen = "cave"; render(); };
    document.querySelector(".stock-minus").onclick = () => changeStock(bottle, -1);
    document.querySelector(".stock-plus").onclick = () => changeStock(bottle, 1);
    document.querySelector("#note").onchange = (event) => { bottle.note = event.target.value; saveBottles(); };
  }
}

function changeStock(bottle, delta) { bottle.stock = Math.max(0, Number(bottle.stock || 0) + delta); saveBottles(); render(); }
render();