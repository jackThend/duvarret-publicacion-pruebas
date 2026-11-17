// Duvarret — caché sin conexión de la obra (el-faro-de-papel-1.0.0-28792c8c)
const PREFIX = 'duvarret:' + encodeURIComponent(self.registration.scope) + ':';
const CACHE = PREFIX + 'el-faro-de-papel-1.0.0-28792c8c';
// El reproductor y el manifiesto son imprescindibles. Los sonidos e imágenes se precargan uno a uno:
// si alguno falla (red, tamaño, espacio), el resto de la obra sigue disponible sin conexión.
const CORE = ["./","./index.html","./icons/duvarret-256.png","./assets/player-DfPZbdSc.css","./icons/duvarret-512.png","./assets/resonance-audio-uYksMKFF.js","./assets/player-pWKBF_sq.js","./manifest/story_manifest.json","./manifest.webmanifest"];
const MEDIA = [];
self.addEventListener('install', (e) => e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE).then(() => Promise.allSettled(MEDIA.map((f) => c.add(f))))).then(() => self.skipWaiting())));
self.addEventListener('activate', (e) => e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith(PREFIX) && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.registration.scope)) return;
  e.respondWith(read(e.request));
});
async function read(request) {
  const cache = await caches.open(CACHE).catch(() => null);
  try {
    // Pages puede mantener el script del worker en la CDN. Revalida la obra aunque siga
    // activo el worker de una publicación anterior y conserva la respuesta para leer sin red.
    const response = await fetch(request, { cache: 'no-cache' });
    if (response.ok) {
      if (cache) await cache.put(request, response.clone()).catch(() => {});
      return response;
    }
    return (await cache?.match(request, { ignoreSearch: true })) ?? response;
  } catch (error) {
    const saved = await cache?.match(request, { ignoreSearch: true });
    if (saved) return saved;
    throw error;
  }
}
