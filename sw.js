const CACHE = "diccionario-griego-core";

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
  const request = event.request;

  // 👉 CUALQUIER archivo JSON: network first
  if (request.url.includes(".json")) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copia = response.clone();
          caches.open(CACHE).then(cache => {
            cache.put(request, copia);
          });
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // 👉 resto: cache first
  event.respondWith(
    caches.match(request).then(response => {
      return response || fetch(request);
    })
  );
});
