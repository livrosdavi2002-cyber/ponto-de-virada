/* ============================================================
   MODOS INFINITOS · palco separado do painel + animação de cada ação
   O cenário é desenhado só na parte de cima da tela (acima do painel),
   usando uma altura "virtual" para todas as funções de desenho.
   ============================================================ */
let sobTopoPainel = 0;
function medirPalco() { const el = document.querySelector("#sob .sob-in"); sobTopoPainel = el ? el.getBoundingClientRect().top : innerHeight * .5; }
window.sobHv = () => document.body.classList.contains("modo-sob") && sobTopoPainel > 50 ? sobTopoPainel / .66 : 0;
addEventListener("resize", () => setTimeout(medirPalco, 150));

/* executa uma ação com animação; o resultado aparece quando ela termina */
function sobFazer(acao, ms, depois, extra = {}) {
  sobOcupado = true; fecharPainel();
  $s("sobAcoes").innerHTML = "";
  const rotulo = { fortificar: "Pregando tábuas…", descansar: "Descansando…", comer: "Comendo…", plantar: "Plantando…", colher: "Colhendo…", regar: "Regando a horta…", cacar: "Caçando…", vigiar: "Vigiando…", radio: "Procurando uma frequência…", curar: "Fazendo um curativo…", saquear: "Entrando nos apartamentos…", comprar: "Negociando…", dormir: "Indo dormir…" }[acao];
  if (rotulo) { const el = $s("sobTexto"); el.innerHTML = `<span class="sb-fazendo">${rotulo}</span>`; el.classList.add("in"); }
  sobCena = { tipo: "acao", acao, t0: performance.now(), ...extra };
  cineAtual = { def: CINE.sobrevivencia, p: {}, dur: 0, chave: "acao" + Math.random(), t0: performance.now(), vel: 1, fim: null };
  setTimeout(() => { sobOcupado = false; depois(); }, reduz ? 0 : ms);
}

/* ---------- desenho das ações ---------- */
function ferramenta(x, y, ang, len, cor = "#8a6d3a", cabeca = null) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  ctx.strokeStyle = cor; ctx.lineWidth = Math.max(2, len * .09); ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(len, 0); ctx.stroke();
  if (cabeca) { ctx.fillStyle = cabeca; ctx.fillRect(len - 3, -len * .16, len * .14, len * .32); }
  ctx.restore();
}
function particulas(x, y, t, cor, n = 8, forca = 1) {
  for (let i = 0; i < n; i++) { const k = (t * 1.6 + i / n) % 1, a = -1.6 + (cvRnd(i) - .5) * 2.2; ctx.fillStyle = cor.replace("A", (1 - k).toFixed(2)); ctx.fillRect(x + Math.cos(a) * k * 30 * forca, y + Math.sin(a) * k * 26 * forca + k * k * 30, 2.2, 2.2); }
}
function plantinha(x, y, s, cor = "#5a8a3a") {
  ctx.strokeStyle = cor; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 14 * s); ctx.stroke();
  ctx.fillStyle = cor; ctx.beginPath(); ctx.ellipse(x - 5 * s, y - 12 * s, 5 * s, 2.5 * s, -.5, 0, 7); ctx.ellipse(x + 5 * s, y - 14 * s, 5 * s, 2.5 * s, .5, 0, 7); ctx.fill();
}
function desenhaAcao(t, c) {
  const ch = SOB.modo === "cherno";
  (ch ? chernoBase : sobBase)(t, { semEu: true, noite: c.acao === "dormir" && t > 1.2 });
  const chao = H * .6, y = chao + H * .045, h = H * .2, x = W * .45;
  const aro = "rgba(175,190,215,.28)";
  switch (c.acao) {
    case "fortificar": {
      const bx = x + h * .32;
      ctx.fillStyle = "#4a3220"; ctx.fillRect(bx - 4, y - h * .95, 8, h * .95);
      const tabuas = Math.min(4, Math.floor(t / .55) + 1);
      for (let i = 0; i < tabuas; i++) { ctx.save(); ctx.translate(bx, y - h * (.25 + i * .18)); ctx.rotate(i % 2 ? .12 : -.1); ctx.fillStyle = i % 2 ? "#6a4a2a" : "#5a3c22"; ctx.fillRect(-h * .3, -5, h * .6, 10); ctx.fillStyle = "#222"; ctx.fillRect(-h * .26, -1.5, 3, 3); ctx.fillRect(h * .24, -1.5, 3, 3); ctx.restore(); }
      pessoa(x, y, h, { dir: 1 });
      const ph = (t * 2.6) % 1, ang = ph < .55 ? cvMix(-1.9, -.2, ph / .55) : cvMix(-.2, -1.9, (ph - .55) / .45);
      ferramenta(x + h * .06, y - h * .66, ang + 1.2, h * .36, "#7a5a32", "#2a2e34");
      if (ph > .5 && ph < .62) particulas(bx - 4, y - h * .5, t * 3, "rgba(255,210,120,A)", 6, .6);
      break; }
    case "descansar": {
      fogueira(x + h * .55, y - 2, t, .55);
      ctx.fillStyle = "#2a2a3a"; ctx.fillRect(x - h * .75, y - 4, h * 1.05, 6);
      ctx.save(); ctx.translate(x + h * .25, y - h * .07); ctx.rotate(-PI / 2); pessoa(0, 0, h, { aro }); ctx.restore();
      ctx.fillStyle = "rgba(230,230,240,.8)"; ctx.font = `800 ${Math.max(12, h * .12)}px "Big Shoulders Display", sans-serif`;
      for (let i = 0; i < 3; i++) { const k = (t * .5 + i / 3) % 1; ctx.globalAlpha = 1 - k; ctx.fillText("z", x - h * .7 + k * 20, y - h * .2 - k * h * .5); } ctx.globalAlpha = 1;
      break; }
    case "comer": {
      const it = ITENS[c.item] || {};
      pessoa(x, y, h, { sentado: true, cabeca: Math.sin(t * 10) * .4 });
      ctx.fillStyle = "#3a2a18"; ctx.beginPath(); ctx.ellipse(x - h * .02, y - h * .14, h * .2, h * .12, 0, 0, 7); ctx.fill();
      const k = .5 + .5 * Math.sin(t * 5), fx = cvMix(x + h * .2, x + h * .15, k), fy = cvMix(y - h * .45, y - h * .78, k);
      ctx.fillStyle = it.planta === undefined && c.item === "cenoura" || c.item === "cenoura" ? "#e07a2a" : c.item === "cebola" ? "#d8c08a" : c.item === "peixe" ? "#9ab0c0" : c.item && c.item.includes("carne") || c.item === "javali" ? "#8a3a2a" : "#b8a070";
      ctx.beginPath(); ctx.ellipse(fx, fy, h * .045, h * .028, .4, 0, 7); ctx.fill();
      if (k > .9) particulas(x + h * .14, y - h * .8, t * 4, "rgba(200,180,140,A)", 4, .3);
      break; }
    case "plantar": case "colher": {
      ctx.fillStyle = "#2a1c10"; ctx.fillRect(x + h * .1, y - 3, h * .9, 8);
      for (let i = 0; i < 4; i++) plantinha(x + h * (.25 + i * .22), y, c.acao === "colher" ? 1 : (i === 0 ? cvSeg(t, .8, 2) : .9), "#5a8a3a");
      if (c.acao === "plantar") { pessoa(x, y, h * .9, { sentado: true, inclina: .45 }); particulas(x + h * .3, y - 4, t, "rgba(110,80,50,A)", 6, .5); }
      else { const k = cvSuave(cvSeg(t, .5, 1.6)); pessoa(x, y, h, { inclina: .55 - k * .4 }); ctx.save(); ctx.translate(x + h * .3, y - 2 - k * h * .5); ctx.fillStyle = c.item === "cebola" ? "#d8c08a" : c.item === "batata" ? "#a8845a" : c.item === "beterraba" ? "#7a1a3a" : c.item === "milho" ? "#e8c050" : "#e07a2a";
        ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(5, 0); ctx.lineTo(0, 20); ctx.closePath(); ctx.fill(); plantinha(0, 0, .9); ctx.restore(); if (k < 1) particulas(x + h * .3, y, t, "rgba(110,80,50,A)", 8, .6); }
      break; }
    case "regar": {
      ctx.fillStyle = "#2a1c10"; ctx.fillRect(x + h * .1, y - 3, h * 1.1, 8);
      for (let i = 0; i < 5; i++) plantinha(x + h * (.3 + i * .2), y, .7 + .3 * cvSeg(t, .5 + i * .2, 1.5 + i * .2));
      pessoa(x, y, h, { luz: false, inclina: .1 });
      ctx.save(); ctx.translate(x + h * .2, y - h * .5); ctx.rotate(.4 + Math.sin(t * 3) * .1); ctx.fillStyle = "#5a6a7a"; ctx.fillRect(-h * .06, -h * .05, h * .12, h * .1); ctx.fillRect(h * .05, -h * .03, h * .14, 3); ctx.restore();
      ctx.fillStyle = "rgba(140,190,240,.7)"; for (let i = 0; i < 10; i++) { const k = (t * 1.8 + i / 10) % 1; ctx.fillRect(x + h * (.38 + (i % 4) * .1), y - h * .45 + k * h * .42, 2, 5); }
      break; }
    case "cacar": {
      const k = cvSeg(t, .3, 2.2), ax = cvMix(W * 1.05, x + h * .9, k);
      ctx.save(); ctx.translate(ax, y - h * .12); const cai = t > 2.2 ? 1 : 0; ctx.rotate(cai * 1.3);
      ctx.fillStyle = ch ? "#3a2a20" : "#4a3420"; ctx.beginPath(); ctx.ellipse(0, 0, h * .2, h * .1, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(-h * .2, -h * .03, h * .07, h * .05, 0, 0, 7); ctx.fill();
      ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = 4; for (let i = 0; i < 4; i++) { const sw = Math.sin(t * 14 + i * 1.6) * (1 - cai) * 6; ctx.beginPath(); ctx.moveTo(-h * .12 + i * h * .08, h * .05); ctx.lineTo(-h * .12 + i * h * .08 + sw, h * .14); ctx.stroke(); } ctx.restore();
      pessoa(x, y, h, { luz: true, luzRgb: "255,255,255", inclina: .05 });
      ferramenta(x + h * .15, y - h * .62, -.08, h * .55, "#6a4a2a", "#9aa0a8");
      if (t > 2 && t < 2.3) particulas(ax, y - h * .2, t * 5, "rgba(180,30,20,A)", 8, .7);
      break; }
    case "vigiar": {
      ctx.fillStyle = "#1c1f24"; ctx.fillRect(x - h * .25, y - h * .55, h * .5, h * .55); ctx.fillRect(x - h * .35, y - h * .6, h * .7, 8);
      pessoa(x, y - h * .6, h * .85, { cabeca: Math.sin(t * .8) * 1.5 });
      ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(x + h * .1, y - h * 1.35, 4, 0, 7); ctx.arc(x + h * .17, y - h * 1.35, 4, 0, 7); ctx.fill();
      const a = Math.sin(t * .8); const g = ctx.createLinearGradient(x, y - h * 1.35, x + W * .6, y - h * 1.2 + a * 40); g.addColorStop(0, "rgba(240,240,220,.15)"); g.addColorStop(1, "rgba(240,240,220,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x + h * .2, y - h * 1.35); ctx.lineTo(x + W * .7, y - h * 1.6 + a * 50); ctx.lineTo(x + W * .7, y - h * 1.05 + a * 50); ctx.fill();
      break; }
    case "radio": {
      ctx.fillStyle = "#2a2418"; ctx.fillRect(x + h * .12, y - h * .3, h * .35, h * .2); ctx.fillStyle = "rgba(255,190,90,.8)"; ctx.fillRect(x + h * .18, y - h * .25, h * .1, h * .05);
      ctx.strokeStyle = "#555"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + h * .4, y - h * .3); ctx.lineTo(x + h * .5, y - h * .7); ctx.stroke();
      for (let i = 0; i < 3; i++) { const k = (t * .8 + i / 3) % 1; ctx.strokeStyle = `rgba(255,220,160,${.5 * (1 - k)})`; ctx.beginPath(); ctx.arc(x + h * .5, y - h * .7, 8 + k * h * .6, -1.2, .2); ctx.stroke(); }
      pessoa(x, y, h, { sentado: true, cabeca: .5 });
      break; }
    case "curar": {
      pessoa(x, y, h, { sentado: true, cabeca: .8 });
      const k = t * 3; ctx.strokeStyle = "rgba(240,240,235,.9)"; ctx.lineWidth = 3; ctx.beginPath();
      for (let i = 0; i < 5; i++) { const a = k + i * 1.3; ctx.moveTo(x + h * .12 + Math.cos(a) * 6, y - h * .5 + i * 3); ctx.lineTo(x + h * .12 - Math.cos(a) * 6, y - h * .5 + i * 3 + 2); } ctx.stroke();
      ctx.fillStyle = "rgba(255,80,70,.9)"; ctx.fillRect(x + h * .35, y - h * .16, h * .14, h * .1); ctx.fillStyle = "#fff"; ctx.fillRect(x + h * .4, y - h * .15, 3, h * .08); ctx.fillRect(x + h * .37, y - h * .115, h * .1, 3);
      break; }
    case "saquear": {
      const k = cvSuave(cvSeg(t, .2, 1.6)), px = cvMix(x, x + h * .8, k);
      ctx.fillStyle = "#08090b"; ctx.fillRect(x + h * .75, y - h * .95, h * .4, h * .95); ctx.fillStyle = "rgba(255,220,160,.12)"; ctx.fillRect(x + h * .75, y - h * .95, h * .4 * (t > 1.6 ? 1 : k), h * .95);
      if (t < 1.8 || t > 2.6) pessoa(t > 2.6 ? cvMix(x + h * .8, x, cvSeg(t, 2.6, 3.4)) : px, y, h, { fase: t * 9, anda: (t < 1.6 || (t > 2.6 && t < 3.4)) ? .9 : 0, dir: t > 2.6 ? -1 : 1, luz: true, mochila: true });
      break; }
    case "comprar": {
      pessoa(x - h * .1, y, h, { dir: 1 });
      pessoa(x + h * .75, y, h * 1.02, { dir: -1, capacete: ch, mochila: true, cor: "#06080c" });
      luzCor(x + h * 1.05, y - h * .55, 50, .4, "255,200,110");
      const k = (t * .8) % 1, bx = cvMix(x + h * .6, x + h * .1, cvSuave(k)), by = y - h * .45 - Math.sin(k * PI) * h * .2;
      ctx.fillStyle = "#8a6a3a"; ctx.fillRect(bx - 8, by - 6, 16, 12); ctx.strokeStyle = "#3a2a18"; ctx.lineWidth = 1; ctx.strokeRect(bx - 8, by - 6, 16, 12);
      break; }
    case "dormir": {
      const k = cvSuave(cvSeg(t, .1, 1.2)); if (k < 1) pessoa(cvMix(x, x - h * .9, k), y, h, { fase: t * 9, anda: .9, dir: -1 });
      ctx.fillStyle = `rgba(0,0,0,${.45 * cvSeg(t, 1, 2)})`; ctx.fillRect(0, 0, W, H);
      break; }
    default: pessoa(x, y, h, {});
  }
}

/* sobDesenhar com palco: tudo desenhado acima do painel */
function sobDesenhar(t) {
  if (!sobTopoPainel) medirPalco();
  const hv = sobHv(), H0 = H;
  if (hv) H = hv;
  try {
    if (!SOB) {
      if (sobModo === "cherno") { chernoCeu(.3, false); reator(W * .7, H * .6, W * .5, t); ctx.fillStyle = "#11120e"; ctx.fillRect(0, H * .6, W, H); particulasRad(t, 20); pessoa(W * .3, H * .645, H * .2, {}); }
      else { sobCeu(.4); acesas = .02; ctx.save(); ctx.translate(0, -H * .1); cidade(); ctx.restore(); ctx.fillStyle = "#0d0e12"; ctx.fillRect(0, H * .6, W, H); sobZumbis(t, H * .63, 5); pessoa(W * .3, H * .645, H * .2, {}); }
    } else {
      const c = sobCena, ch = SOB.modo === "cherno";
      if (c.tipo === "acao") desenhaAcao((performance.now() - c.t0) / 1000, c);
      else if (c.tipo === "lugar") (ch ? chernoLugar : sobLugar)(t, c);
      else if (c.tipo === "visita") (ch ? chernoVisita : sobVisita)(t, c);
      else (ch ? chernoBase : sobBase)(t, c);
      if (SOB.clima === "neblina") sobNevoa(t, .12);
    }
    // borda inferior do palco
    const g = ctx.createLinearGradient(0, sobTopoPainel - 40, 0, sobTopoPainel);
    g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,.5)"); ctx.fillStyle = g; ctx.fillRect(0, sobTopoPainel - 40, W, 40);
  } finally { H = H0; }
}
