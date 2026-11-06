/* deixa a Roça Assombrada funcionar sem internet (menos o online) */
const VERSAO = "ra-1";
const ARQUIVOS = ["./", "index.html", "base.js", "roca.js", "lib/peerjs.min.js", "manifest.webmanifest", "icones/icone-192.png", "icones/icone-512.png", "icones/icone-180.png",
  "fonts/big-shoulders-display-latin-500-normal.woff2", "fonts/big-shoulders-display-latin-800-normal.woff2", "fonts/newsreader-latin-400-normal.woff2", "fonts/newsreader-latin-500-normal.woff2", "fonts/newsreader-latin-400-italic.woff2", "fonts/jetbrains-mono-latin-400-normal.woff2", "fonts/jetbrains-mono-latin-600-normal.woff2"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(l => Promise.all(l.filter(k => k !== VERSAO).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.open(VERSAO).then(async c => { const tem = await c.match(e.request, { ignoreSearch: true }); const rede = fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => tem); return tem || rede; }));
});
