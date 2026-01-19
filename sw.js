const CACHE = "diccionario-griego-core-v1";

const CORE = [
  "./",
  "index.html",
  "manifest.json"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(CORE))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
  const url = event.request.url;

  // 👉 El JSON SIEMPRE intenta red primero
  if (url.endsWith("datos.json")) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copia = response.clone();
          caches.open(CACHE).then(cache => {
            cache.put(event.request, copia);
          });
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 👉 Todo lo demás: cache first
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
