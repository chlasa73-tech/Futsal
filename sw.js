const CACHE_NAME = 'futsal-pwa-v3.1'; // Cambiamos a v3 para forzar la actualización
const assets = [
  'index.html',
  'manifest.json',
  'img/icon-192.png',
  'img/icon-512.png'
];

// Evento de instalación: guarda en caché los archivos básicos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    }).then(() => self.skipWaiting())
  );
});

// Evento de activación: destruye cualquier caché vieja de versiones anteriores
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Evento fetch: responde desde la caché o va a la red si no existe
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      return cachedResponse || fetch(e.request);
    })
  );
});
