const KEY = "cellarium-reference-v1";

const seed = [
  ["rayas-2016", "Château Rayas", "2016", "Château Rayas", "Châteauneuf-du-Pape", "Rhône", 3, 1200, 2400, "Cave principale - Étagère 3", "12 avril 2024", "Le temps révèle ce que l'émotion préserve.", "Grenache", "75 cl", "rouge"],
  ["yquem-2001", "Yquem", "2001", "Château d'Yquem", "Sauternes", "Sauternes", 4, 520, 980, "Armoire dorée", "1 janvier 2025", "L'or lent du matin.", "Sémillon, Sauvignon", "75 cl", "liquoreux"],
  ["romanee-conti-2010", "Romanée Conti", "2010", "Domaine de la Romanée-Conti", "Grand Cru", "Bourgogne", 1, 9800, 22500, "Niche scellée", "18 octobre 2023", "Le silence avant la page.", "Pinot noir", "75 cl", "rouge"],
  ["clos-rougeard-2020", "Clos Rougeard", "2020", "Foucault", "Saumur Champigny", "Loire", 12, 180, 420, "Travée Loire", "6 juin 2024", "Craie, conversation, patience.", "Cabernet franc", "75 cl", "rouge"],
  ["masseto-2015", "Masseto", "2015", "Tenuta dell'Ornellaia", "Toscana", "Toscane", 2, 620, 1050, "Italie - Rayon bas", "9 septembre 2022", "Velours sombre, pierre chaude.", "Merlot", "75 cl", "rouge"],
  ["latour-2009", "Château Latour", "2009", "Château Latour", "Pauillac", "Pauillac", 6, 760, 1320, "Bordeaux - Travée royale", "22 mars 2024", "Architecture, graphite, grande garde.", "Cabernet Sauvignon, Merlot", "75 cl", "rouge"],
  ["gaja-2017", "Gaja", "2017", "Gaja", "Barbaresco", "Barbaresco", 5, 230, 360, "Italie - Rayon haut", "14 juillet 2025", "Rose fanée, tanins droits.", "Nebbiolo", "75 cl", "rouge"],
  ["krug-2010", "Krug Grande Cuvée", "2010", "Krug", "Champagne", "Champagne", 8, 190, 310, "Arche fraîche", "21 juin 2025", "Noisette, craie, fête retenue.", "Chardonnay, Pinot noir, Meunier", "75 cl", "champagne"],
  ["dom-jamet-2010", "Domaine Jamet", "2010", "Domaine Jamet", "Côte-Rôtie", "Rhône", 4, 170, 390, "Rhône - Casier 2", "5 mai 2023", "Fumée, violette, tension noble.", "Syrah", "75 cl", "rouge"]
].map(([id, nom, millesime, domaine, appellation, region, stock, prixAchat, valeurEstimee, emplacement, dateAcquisition, note, cepages, format, couleur]) =>
  ({ id, nom, millesime, domaine, appellation, region, stock, prixAchat, valeurEstimee, emplacement, dateAcquisition, note, cepages, format, couleur })
);

let bottles = load();
let screen = "home";
let selected = bottles[0]?.id || "";
let query = "";
let region = "Toutes";
let color = "Toutes";
const app = document.querySelector("#app");

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || structuredClone(seed); }
  catch { return structuredClone(seed); }
}
function save() { localStorage.setItem(KEY, JSON.stringify(bottles)); }
function euro(v) { return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(+v || 0); }
function esc(v) { return String(v ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
function bottle() { return bottles.find(v => v.id === selected) || bottles[0]; }
function go(next) { screen = next; render(); }
function band(text) { return `<div class="reference-band">${text}</div>`; }

function render() {
  app.innerHTML = screen === "home" ? home() : screen === "detail" ? detail() : cave();
  app.querySelectorAll("[data-go]").forEach(b => b.onclick = () => go(b.dataset.go));
  if (screen === "home") app.querySelector(".enter-cave").onclick = () => go("cave");
  if (screen === "cave") bindCave();
  if (screen === "detail") bindDetail();
}

function home() {
  return `<main class="reference-screen accueil-screen">
    ${band("01 - ACCUEIL - REFERENCE")}
    <button class="corner-gear" aria-label="Réglages">✥</button>
    <section class="home-stage">
      <div class="left-library" aria-hidden="true">${Array.from({ length: 18 }, (_, i) => `<i style="--h:${70 + (i % 7) * 7}%"></i>`).join("")}</div>
      <div class="stone-arch" aria-hidden="true"><span></span></div><div class="distant-vines" aria-hidden="true"></div>
      <div class="table-round" aria-hidden="true"></div><div class="candle" aria-hidden="true"></div><div class="glass" aria-hidden="true"></div>
      <div class="grape-cluster" aria-hidden="true">${"<i></i>".repeat(12)}</div><div class="open-manuscript" aria-hidden="true"><span></span><span></span></div>
      <div class="home-title"><div class="rose-window">✧</div><h1>CELLARIUM</h1><p>Bibliothèque du goût et du temps</p>
        <blockquote>"Le véritable voyage<br>ne consiste pas à chercher<br>de nouveaux paysages<br>mais à avoir de nouveaux yeux."<cite>- Marcel Proust</cite></blockquote>
      </div>
      <button class="parchment-button enter-cave">ENTRER DANS LA CAVE</button>
    </section>
  </main>`;
}

function cave() {
  const regions = ["Toutes", ...new Set(bottles.map(v => v.region))];
  const colors = ["Toutes", ...new Set(bottles.map(v => v.couleur))];
  const shown = bottles.filter(v => `${v.nom} ${v.millesime} ${v.domaine} ${v.region}`.toLowerCase().includes(query.toLowerCase()) && (region === "Toutes" || v.region === region) && (color === "Toutes" || v.couleur === color));
  const stock = bottles.reduce((s, v) => s + (+v.stock || 0), 0);
  const value = bottles.reduce((s, v) => s + (+v.stock || 0) * (+v.valeurEstimee || 0), 0);
  return `<main class="reference-screen cave-screen">
    ${band("02 - CAVE - REFERENCE")}
    <aside class="reference-nav"><div class="nav-compass">✧</div><h2>CELLARIUM</h2><p>Bibliothèque du goût<br>et du temps</p>
      ${nav("♜", "CAVE", true)}${nav("▤", "CARNET")}${nav("✦", "TRACES")}${nav("☼", "SOUVENIR DU JOUR")}${nav("♧", "COMPAGNONS")}${nav("⌘", "ASSOCIATIONS")}${nav("⚜", "PANTHÉON")}${nav("⌛", "DESTINS")}${nav("♙", "PORTRAIT")}
    </aside>
    <section class="cave-board">
      <div class="cave-tools"><label class="search-chamber">⌕<input id="searchInput" value="${esc(query)}" placeholder="Rechercher un vin, un domaine, une région..."></label>
        ${select("regionSelect", regions, region)}${select("colorSelect", colors, color)}<button class="filter-button">⚱ FILTRES</button></div>
      <div class="bottle-library">${shown.map(book).join("")}<button class="secret-book" id="openAdd" title="Ajouter une bouteille">✧</button></div>
      <footer class="cave-ledger">${ledger(bottles.length, "RÉFÉRENCES")}${ledger(stock, "BOUTEILLES")}${ledger(euro(value), "VALEUR TOTALE")}<button class="add-plaque" id="openAddBottom">+ AJOUTER<br>UNE BOUTEILLE</button></footer>
    </section>${dialog()}
  </main>`;
}
function nav(icon, label, active = false) { return `<button class="nav-plaque ${active ? "active" : ""}"><span>${icon}</span>${label}</button>`; }
function select(id, values, selectedValue) { return `<select id="${id}">${values.map(v => `<option ${v === selectedValue ? "selected" : ""}>${esc(v)}</option>`).join("")}</select>`; }
function ledger(value, label) { return `<div class="ledger-cell"><strong>${esc(value)}</strong><span>${label}</span></div>`; }
function book(v) { return `<button class="reference-book" data-bottle="${v.id}"><span class="book-glyph">✦</span><strong>${esc(v.nom)}</strong><em>${esc(v.millesime)}</em><small>${esc(v.appellation)}</small><b>${esc(v.region)}</b></button>`; }

function detail() {
  const v = bottle();
  if (!v) return cave();
  return `<main class="reference-screen detail-screen">
    ${band("03 - FICHE BOUTEILLE - REFERENCE")}<button class="back-seal" data-go="cave">‹ CAVE</button>
    <section class="ancient-book"><div class="page-left"><h1>${esc(v.nom)}</h1><h2>${esc(v.millesime)}</h2><h3>${esc(v.appellation)}</h3><h4>${esc(v.region)}</h4>
      <div class="bottle-label"><div class="tilted-label"><span>${esc(v.nom)}</span><b>${esc(v.millesime)}</b></div></div>
      <dl class="identity-list">${field("Domaine", v.domaine)}${field("Cépages", v.cepages)}${field("Format", v.format)}</dl></div>
      <div class="book-fold"></div><div class="page-right"><h2>INFORMATIONS</h2><div class="stock-line"><span>Stock</span><button class="stock-button" data-stock="-1">−</button><strong>${esc(v.stock)}</strong><button class="stock-button" data-stock="1">+</button></div>
      <dl class="info-list">${field("Prix d'achat", euro(v.prixAchat))}${field("Valeur estimée", euro(v.valeurEstimee))}${field("Emplacement", v.emplacement)}${field("Date d'acquisition", v.dateAcquisition)}</dl>
      <label class="personal-note">Note personnelle<textarea id="noteInput">${esc(v.note)}</textarea></label><p class="signature">— Cellarium</p></div></section>
    <aside class="ribbon-tabs">${["DÉGUSTATIONS", "SOUVENIRS", "COMPAGNONS", "ASSOCIATIONS", "PANTHÉON", "DESTINS"].map(t => `<button>${t}</button>`).join("")}</aside>
  </main>`;
}
function field(k, v) { return `<dt>${esc(k)} :</dt><dd>${esc(v)}</dd>`; }
function dialog() {
  return `<dialog id="addDialog" class="add-dialog"><form id="addForm" method="dialog"><h2>Ajouter une bouteille</h2>
    ${["nom:Nom", "millesime:Millésime", "domaine:Domaine", "appellation:Appellation", "region:Région"].map(x => { const [n, p] = x.split(":"); return `<input name="${n}" placeholder="${p}" ${n === "nom" || n === "millesime" ? "required" : ""}>`; }).join("")}
    <input name="stock" type="number" min="0" value="1" placeholder="Stock"><input name="prixAchat" type="number" min="0" value="0" placeholder="Prix d'achat"><input name="valeurEstimee" type="number" min="0" value="0" placeholder="Valeur estimée">
    <div><button class="plaque-action" value="save">AJOUTER</button><button class="plaque-secondary" value="cancel">FERMER</button></div>
  </form></dialog>`;
}

function bindCave() {
  app.querySelector("#searchInput").oninput = e => { query = e.target.value; const p = e.target.selectionStart; render(); const n = app.querySelector("#searchInput"); n.focus(); n.setSelectionRange(p, p); };
  app.querySelector("#regionSelect").onchange = e => { region = e.target.value; render(); };
  app.querySelector("#colorSelect").onchange = e => { color = e.target.value; render(); };
  app.querySelectorAll("[data-bottle]").forEach(b => b.onclick = () => { selected = b.dataset.bottle; go("detail"); });
  app.querySelectorAll("#openAdd,#openAddBottom").forEach(b => b.onclick = () => app.querySelector("#addDialog").showModal());
  app.querySelector("#addForm").onsubmit = e => {
    if (e.submitter?.value !== "save") return;
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget));
    const v = { id: `bottle-${Date.now()}`, nom: d.nom, millesime: d.millesime, domaine: d.domaine || d.nom, appellation: d.appellation || "Appellation", region: d.region || "Cave", stock: +d.stock || 0, prixAchat: +d.prixAchat || 0, valeurEstimee: +d.valeurEstimee || 0, emplacement: "Nouvelle travée", dateAcquisition: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }), note: "Nouvelle page à écrire.", cepages: "À préciser", format: "75 cl", couleur: "rouge" };
    bottles.push(v); selected = v.id; save(); go("detail");
  };
}
function bindDetail() {
  const v = bottle();
  app.querySelectorAll("[data-stock]").forEach(b => b.onclick = () => { v.stock = Math.max(0, (+v.stock || 0) + +b.dataset.stock); save(); render(); });
  app.querySelector("#noteInput").onchange = e => { v.note = e.target.value; save(); };
}

render();
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));