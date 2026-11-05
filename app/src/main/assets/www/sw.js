/* Funciona sem internet depois da primeira visita (versão para iPhone / navegador) */
const VERSAO = "ue-1";
const ARQUIVOS = ["./", "index.html", "manifest.webmanifest", "historias.js", "cinema.js", "cinema2.js", "cinema3.js", "historias2.js", "corposeco.js",
  "sobrevivencia.js", "modos.js", "acoes.js", "mundo.js", "casa.js", "criaturas.js", "grupo.js", "predio.js", "roca.js",
  "fonts/big-shoulders-display-latin-500-normal.woff2", "fonts/big-shoulders-display-latin-800-normal.woff2", "fonts/newsreader-latin-400-normal.woff2",
  "fonts/newsreader-latin-500-normal.woff2", "fonts/newsreader-latin-400-italic.woff2", "fonts/jetbrains-mono-latin-400-normal.woff2", "fonts/jetbrains-mono-latin-600-normal.woff2",
  "icones/icone-180.png", "icones/icone-192.png", "icones/icone-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
// usa o que está guardado e busca a versão nova por trás (na próxima abertura já vem atualizado)
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.open(VERSAO).then(async c => {
    const guardado = await c.match(e.request, { ignoreSearch: true });
    const rede = fetch(e.request).then(r => { if (r && r.ok) c.put(e.request, r.clone()); return r; }).catch(() => guardado);
    return guardado || rede;
  }));
});
