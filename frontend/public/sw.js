const CACHE_NAME = "bingou-v1";
const ASSETS_TO_CACHE = ["/", "/index.html"];

// Instalação: Salva os arquivos básicos no cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }),
  );
  self.skipWaiting();
});

// Ativação: Limpa caches antigos se houver
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

// Fetch: Tenta buscar da rede, se falhar (offline), pega do cache
self.addEventListener("fetch", (event) => {
  // Ignora requisições que não sejam GET
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    }),
  );
});
