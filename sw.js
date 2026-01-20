const CACHE = "diccionario-griego-v2";

const ARCHIVOS = [
  "./",
  "index.html",
  "manifest.json",
  "datos.json"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      c.addAll(ARCHIVOS)
    )
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r =>
      r || fetch(e.request)
    )
  );
});

