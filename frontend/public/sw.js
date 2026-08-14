const CACHE_NAME = "bingou-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  // Apenas passa as requisições normais por enquanto
  event.respondWith(fetch(event.request));
});
