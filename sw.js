const CACHE_NAME = "cellarium-v21-cache";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./style.css?v=21",
  "./app.js",
  "./app.js?v=21",
  "./manifest.json",
  "./manifest.json?v=21",
  "./icon.png",
  "./icon.png?v=21",
  "./assets/reference/01-accueil-reference.png",
  "./assets/reference/02-cave-reference.png",
  "./assets/reference/03-fiche-bouteille-reference.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
