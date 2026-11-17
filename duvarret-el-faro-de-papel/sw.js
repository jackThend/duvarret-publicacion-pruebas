// Duvarret — caché sin conexión de la obra (el-faro-de-papel-1.0.0-a60f454e)
const PREFIX = 'duvarret:' + self.registration.scope + ':';
const CACHE = PREFIX + 'el-faro-de-papel-1.0.0-a60f454e';
// El reproductor y el manifiesto son imprescindibles. Los sonidos e imágenes se precargan uno a uno:
// si alguno falla (red, tamaño, espacio), el resto de la obra sigue disponible sin conexión.
const CORE = ["./","./assets/player-DfPZbdSc.css","./assets/player-pWKBF_sq.js","./assets/resonance-audio-uYksMKFF.js","./icons/duvarret-256.png","./icons/duvarret-512.png","./index.html","./manifest/story_manifest.json","./manifest.webmanifest"];
const MEDIA = [];
self.addEventListener('install', (e) => e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE).then(() => Promise.allSettled(MEDIA.map((f) => c.add(f))))).then(() => self.skipWaiting())));
self.addEventListener('activate', (e) => e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith(PREFIX) && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.registration.scope)) return;
  e.respondWith(caches.open(CACHE).then((cache) => cache.match(e.request, { ignoreSearch: true })).then((hit) => hit || fetch(e.request).then((res) => {
    // Lo que no se pudo precargar se guarda la primera vez que se usa.
    if (res.ok && new URL(e.request.url).origin === self.location.origin) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {}); }
    return res;
  })));
});
