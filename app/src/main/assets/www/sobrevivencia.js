/* ============================================================
   MODO SOBREVIVÊNCIA · APOCALIPSE ZUMBI (infinito, premium)
   Turnos: cada dia tem energia; ações gastam energia; dormir passa a noite.
   Salvo em localStorage "pv_sob" a cada ação. Morrer apaga o jogo (fica o recorde).
   ============================================================ */

/* ---------- zumbi ---------- */
function zumbi(x, y, h, o = {}) {
  const { fase = 0, anda = 0, dir = 1, olhos = .35, cor = "#0a0d08", aro = "rgba(150,200,120,.26)", olhosRgb = "220,255,180", cabeca = .5, quatro = false } = o;
  const s = h / 100, ag = performance.now() / 1000, sw = Math.sin(fase) * anda, manca = Math.max(0, Math.sin(fase)) * anda * 4;
  if (h > 14) { ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.beginPath(); ctx.ellipse(x, y + 1, h * .15, h * .025, 0, 0, 7); ctx.fill(); }
  ctx.save(); ctx.translate(x, y); ctx.scale(dir * s, s);
  const p = new Path2D(), t = new Path2D();
  const seg = (x0, y0, a1, l1, a2, l2) => { const x1 = x0 + Math.sin(a1) * l1, y1 = y0 + Math.cos(a1) * l1, x2 = x1 + Math.sin(a2) * l2, y2 = y1 + Math.cos(a2) * l2; p.moveTo(x0, y0); p.lineTo(x1, y1); p.lineTo(x2, y2); return [x2, y2]; };
  const hip = -48 + manca, sh = hip - 30;
  seg(0, hip, sw * .45, 25, sw * .45 - .2, 25);           // perna boa
  seg(0, hip, -sw * .2 + .1, 25, -sw * .2 + .35, 24);     // perna que arrasta
  t.moveTo(-6, hip + 2); t.lineTo(6, hip + 2); t.lineTo(14, sh + 4); t.lineTo(-1, sh + 2); t.closePath();
  const tre = Math.sin(ag * 9 + x) * .05;
  const m1 = seg(10, sh + 4, 1.55 + tre + Math.sin(fase * .5) * .1, 17, 1.7 + tre, 16); // braços esticados
  const m2 = seg(8, sh + 6, 1.35 - tre, 17, 1.55 - tre, 15);
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  [[aro, 3], [cor, 0]].forEach(([c, e]) => {
    ctx.strokeStyle = c; ctx.fillStyle = c;
    ctx.lineWidth = 7 + e; ctx.stroke(p); ctx.lineWidth = 3 + e; ctx.stroke(t); ctx.fill(t);
    ctx.lineWidth = 5 + e; ctx.beginPath(); ctx.moveTo(10, sh + 2); ctx.lineTo(15, sh - 6); ctx.stroke();
    ctx.beginPath(); ctx.arc(18, sh - 10 + cabeca * 3, 9.5 + e / 2, 0, 7); ctx.fill();
    [m1, m2].forEach(([mx, my]) => { ctx.beginPath(); ctx.arc(mx, my, 3.4 + e / 2, 0, 7); ctx.fill(); });
  });
  ctx.strokeStyle = "rgba(60,20,15,.55)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(2, sh + 10); ctx.lineTo(8, hip - 4); ctx.stroke(); // roupa rasgada
  if (olhos > .02) { ctx.fillStyle = `rgba(${olhosRgb},${olhos})`; ctx.beginPath(); ctx.arc(21, sh - 12 + cabeca * 3, 1.6, 0, 7); ctx.arc(25, sh - 11 + cabeca * 3, 1.4, 0, 7); ctx.fill(); }
  ctx.restore();
}

/* ---------- dados ---------- */
const SOB_LOCAIS = {
  cidade: { nome: "Cidade", cor: "#f2a33a", base: "Apartamento no 4º andar",
    desc: "Muita coisa para saquear e muitos zumbis nas ruas. Começa com pouca defesa.",
    ini: { defesa: 15, comida: 3, remedio: 1, material: 2, municao: 4, sucata: 6 }, perigo: 1.3,
    especial: { nome: "Saquear o prédio", desc: "Apartamentos vizinhos, pouco risco", icone: "porta" },
    lugares: [
      { id: "mercado", nome: "Supermercado", desc: "Muita comida, muitos zumbis", loot: { comida: [1, 4], sucata: [0, 2] }, risco: .5, cena: "mercado" },
      { id: "farmacia", nome: "Farmácia", desc: "Remédios, vitrines quebradas", loot: { remedio: [1, 3], sucata: [0, 1] }, risco: .55, cena: "loja" },
      { id: "delegacia", nome: "Delegacia", desc: "Munição, mas é perigosa", loot: { municao: [2, 6] }, risco: .65, cena: "loja" },
      { id: "obra", nome: "Construção", desc: "Materiais para barricadas", loot: { material: [2, 4] }, risco: .35, cena: "rua" } ] },
  floresta: { nome: "Floresta", cor: "#9bd86b", base: "Cabana de caça",
    desc: "Poucos zumbis e comida na mata. Remédio e munição são raros.",
    ini: { defesa: 10, comida: 4, remedio: 0, material: 3, municao: 2, sucata: 3 }, perigo: .8,
    especial: { nome: "Caçar", desc: "Comida, mas pode se machucar", icone: "caca" },
    lugares: [
      { id: "rio", nome: "Rio", desc: "Peixe e água limpa", loot: { comida: [1, 3] }, risco: .2, cena: "mata" },
      { id: "acamp", nome: "Acampamento abandonado", desc: "Um pouco de tudo", loot: { comida: [0, 2], remedio: [0, 1], municao: [0, 2], sucata: [1, 3] }, risco: .4, cena: "mata" },
      { id: "torre", nome: "Torre de vigia", desc: "Munição e ferramentas", loot: { municao: [1, 3], material: [1, 2] }, risco: .45, cena: "mata" },
      { id: "ervas", nome: "Mata fechada", desc: "Ervas que curam", loot: { remedio: [1, 2] }, risco: .35, cena: "mata" } ] },
  fazenda: { nome: "Fazenda", cor: "#e3b46b", base: "Casa da fazenda",
    desc: "Horta e animais garantem comida. Aparece muita gente pela estrada.",
    ini: { defesa: 20, comida: 6, remedio: 1, material: 3, municao: 2, sucata: 4 }, perigo: 1,
    especial: { nome: "Cuidar da horta", desc: "Comida sem sair de casa", icone: "horta" },
    lugares: [
      { id: "celeiro", nome: "Celeiro", desc: "Materiais e ferramentas", loot: { material: [1, 3], sucata: [0, 2] }, risco: .3, cena: "campo" },
      { id: "vila", nome: "Vila vizinha", desc: "Um pouco de tudo, bem perigosa", loot: { comida: [0, 2], remedio: [0, 2], municao: [0, 3], sucata: [1, 3] }, risco: .55, cena: "rua" },
      { id: "plantacao", nome: "Plantação", desc: "Milho e mandioca", loot: { comida: [2, 4] }, risco: .25, cena: "campo" },
      { id: "posto", nome: "Posto da estrada", desc: "Sucata e munição", loot: { sucata: [2, 4], municao: [0, 2] }, risco: .45, cena: "rua" } ] },
  presidio: { nome: "Presídio", cor: "#4fcfd9", base: "Bloco C",
    desc: "Muros altos e arsenal. Quase nada para comer.",
    ini: { defesa: 45, comida: 1, remedio: 1, material: 2, municao: 8, sucata: 4 }, perigo: 1.1,
    especial: { nome: "Vigiar a muralha", desc: "Menos chance de ataque à noite", icone: "torre" },
    lugares: [
      { id: "enfermaria", nome: "Enfermaria", desc: "Remédios", loot: { remedio: [1, 3] }, risco: .5, cena: "presidio" },
      { id: "arsenal", nome: "Arsenal", desc: "Muita munição", loot: { municao: [2, 6] }, risco: .55, cena: "presidio" },
      { id: "refeitorio", nome: "Refeitório", desc: "Comida enlatada", loot: { comida: [1, 3] }, risco: .5, cena: "presidio" },
      { id: "oficina", nome: "Oficina", desc: "Materiais", loot: { material: [2, 3] }, risco: .35, cena: "presidio" } ] },
};
const SOB_ITENS = { comida: "Comida", remedio: "Remédios", material: "Materiais", municao: "Munição", sucata: "Sucata" };
const SOB_NOMES = ["Rita", "Jonas", "Dona Lurdes", "Caio", "Bia", "Seu Antônio", "Marcela", "Tiago", "Nina", "Paulo", "Iara", "Ruan"];
const SOB_ICONES = {
  saude: '<path d="M12 21s-7-4.5-9.3-9A5 5 0 0 1 12 6a5 5 0 0 1 9.3 6c-2.3 4.5-9.3 9-9.3 9z"/>',
  fome: '<path d="M7 3v8a3 3 0 0 0 6 0V3M10 3v18M17 3c-2 2-2 6 0 8v10"/>',
  defesa: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  energia: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  comida: '<path d="M5 11h14l-1.5 9h-11zM8 11V8a4 4 0 0 1 8 0v3"/>',
  remedio: '<rect x="4" y="8" width="16" height="10" rx="5"/><path d="M12 8v10"/>',
  material: '<path d="M3 7h18M3 12h18M3 17h18M7 5v14M17 5v14"/>',
  municao: '<path d="M8 21V9l2-5 2 5v12zM14 21V9l2-5 2 5v12z"/>',
  sucata: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.5"/>',
  grupo: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-4 3-6 6-6s6 2 6 6M15 14c3 0 6 2 6 6"/>',
  busca: '<circle cx="10" cy="10" r="6"/><path d="M15 15l6 6"/>', martelo: '<path d="M4 20l9-9M11 7l4-4 6 6-4 4z"/>',
  cama: '<path d="M3 18V8M3 14h18v4M7 11h6v3"/>', lua: '<path d="M20 14A8 8 0 1 1 10 4a6 6 0 0 0 10 10z"/>',
  porta: '<rect x="6" y="3" width="12" height="18"/><circle cx="15" cy="12" r="1"/>', caca: '<path d="M4 20L20 4M14 4h6v6M4 14l6 6"/>',
  horta: '<path d="M12 21V11M12 11c-4 0-6-3-6-7 4 0 6 3 6 7zM12 14c3 0 5-2 5-5-3 0-5 2-5 5z"/>', torre: '<path d="M8 21V9h8v12M6 9h12l-2-5H8zM10 13h4"/>',
};
const ic = (n, cls = "") => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${SOB_ICONES[n] || ""}</svg>`;

/* ---------- estado ---------- */
let SOB = null, sobCena = { tipo: "base" }, sobOcupado = false;
const sobRnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const sobChance = p => Math.random() < p;
const sobLer = () => { try { return JSON.parse(localStorage.getItem("pv_sob")); } catch (e) { return null; } };
const sobGravar = () => { try { localStorage.setItem("pv_sob", JSON.stringify(SOB)); } catch (e) {} };
const sobRecorde = () => { try { return +(localStorage.getItem("pv_sob_rec") || 0); } catch (e) { return 0; } };
window.temPremium = () => { try { if (window.Android && Android.premium && Android.premium()) return true; return localStorage.getItem("pv_premium") === "1"; } catch (e) { return false; } };
const energiaMax = () => 3 + Math.min(2, SOB.grupo.length);
const L = () => SOB_LOCAIS[SOB.local];
const horaNome = () => ["Manhã", "Meio-dia", "Tarde", "Fim de tarde", "Anoitecer", "Noite"][Math.min(5, SOB.gasta)];

function sobNovo(local) {
  const l = SOB_LOCAIS[local];
  SOB = { local, dia: 1, gasta: 0, energia: 3, saude: 100, fome: 80, ...l.ini, grupo: [], vigia: false, log: [], mordido: null, versao: 1 };
  sobGravar();
}

/* ---------- desenho das cenas ---------- */
function sobCeu(f) { // f: 0 manhã → 1 noite
  const cores = [["#5f7690", "#c9b9a0"], ["#6d86a4", "#d9c8a8"], ["#4a5a78", "#e0956a"], ["#2a2c48", "#a85a50"], ["#141729", "#3b2a40"], ["#05070b", "#111724"]];
  const i = Math.min(4, Math.floor(f * 5)), k = f * 5 - i, a = cores[i], b = cores[Math.min(5, i + 1)];
  const mixc = (c1, c2) => { const p = s => [1, 3, 5].map(j => parseInt(s.slice(j, j + 2), 16)); const x = p(c1), y = p(c2); return `rgb(${x.map((v, j) => Math.round(v + (y[j] - v) * k)).join(",")})`; };
  const g = ctx.createLinearGradient(0, 0, 0, H * .62); g.addColorStop(0, mixc(a[0], b[0])); g.addColorStop(1, mixc(a[1], b[1]));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const sy = H * (.12 + f * .5), sol = f < .7;
  if (sol) { luzCor(W * .75, sy, H * .2, .35 * (1 - f), "255,220,160"); ctx.fillStyle = `rgba(255,235,200,${.85 * (1 - f)})`; ctx.beginPath(); ctx.arc(W * .75, sy, H * .03, 0, 7); ctx.fill(); }
  if (f > .6) { const a2 = cvSeg(f, .6, 1); ctx.fillStyle = `rgba(220,225,240,${a2 * .7})`; for (let i2 = 0; i2 < 40; i2++) ctx.fillRect(cvRnd(i2 * 3.1) * W, cvRnd(i2 * 7.7) * H * .4, 1.3, 1.3); }
  for (let i2 = 0; i2 < 3; i2++) { const x = ((performance.now() / 1000 * (5 + i2 * 3) + cvRnd(i2) * W * 2) % (W * 1.8)) - W * .4; ctx.fillStyle = `rgba(20,20,30,${.18 + f * .25})`; ctx.beginPath(); ctx.ellipse(x, H * (.08 + i2 * .06), W * .25, H * .016, 0, 0, 7); ctx.fill(); }
  // fumaça de incêndios ao longe
  for (let i2 = 0; i2 < 2; i2++) { const bx = W * (.15 + i2 * .55); for (let k2 = 0; k2 < 6; k2++) { const kk = ((performance.now() / 4000 + k2 / 6 + i2 * .3) % 1); ctx.fillStyle = `rgba(30,25,25,${.25 * (1 - kk)})`; ctx.beginPath(); ctx.arc(bx + kk * 30, H * .5 - kk * H * .3, 10 + kk * 35, 0, 7); ctx.fill(); } }
}
function sobTabuas(x, y, w, h, n) { // barricadas: quanto mais defesa, mais tábuas
  for (let i = 0; i < n; i++) { ctx.save(); ctx.translate(x + w / 2, y + h * (.2 + (i % 4) * .2)); ctx.rotate((i % 2 ? .25 : -.22) + (i > 3 ? .1 : 0)); ctx.fillStyle = i % 2 ? "#5a4028" : "#4a3220"; ctx.fillRect(-w * .62, -4, w * 1.24, 8); ctx.fillStyle = "#222"; ctx.fillRect(-w * .55, -1, 2, 2); ctx.fillRect(w * .53, -1, 2, 2); ctx.restore(); }
}
function sobZumbis(t, chao, n, de = -.1, ate = 1.1, escala = 1) {
  for (let i = 0; i < n; i++) {
    const vel = .015 + cvRnd(i * 5) * .02, dir = cvRnd(i) < .5 ? 1 : -1, span = ate - de;
    const k = ((t * vel + cvRnd(i * 9)) % 1), x = W * (de + (dir > 0 ? k : 1 - k) * span);
    zumbi(x, chao + (i % 3) * 6, H * (.17 + cvRnd(i * 2) * .05) * escala, { fase: t * 2.2 + i, anda: .6, dir, olhos: .3 });
  }
}
function sobBase(t, p) {
  const f = p.noite ? 1 : Math.min(.95, SOB.gasta / Math.max(3, energiaMax()) * .9), chao = H * .6, nivel = Math.round(SOB.defesa / 15);
  sobCeu(f);
  const lc = SOB.local, luz = f > .55;
  if (lc === "cidade") {
    acesas = .02; ctx.save(); ctx.translate(0, -H * .1); cidade(); ctx.restore();
    const bx = W * .28, bw = W * .44, bh = H * .4;
    ctx.fillStyle = "#14161c"; ctx.fillRect(bx, chao - bh, bw, bh);
    for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) { const wx = bx + 12 + c * (bw - 24) / 4, wy = chao - bh + 12 + r * bh / 5.4, eu = r === 1 && c === 1;
      ctx.fillStyle = eu ? (luz ? "rgba(255,200,120,.75)" : "rgba(170,190,220,.25)") : "#0a0b0e"; ctx.fillRect(wx, wy, (bw - 24) / 4 - 10, bh / 8);
      if (eu) { sobTabuas(wx, wy, (bw - 24) / 4 - 10, bh / 8, Math.min(4, nivel)); if (luz) luzCor(wx + 18, wy + 12, 50, .35, "255,200,120"); SOB.grupo.forEach((_, i) => pessoa(wx + 8 + i * 9, wy + bh / 8, bh / 9, { cor: "#000", aro: "rgba(0,0,0,0)" })); } }
    ctx.fillStyle = "#0b0c10"; ctx.fillRect(bx + bw * .4, chao - H * .07, bw * .2, H * .07); sobTabuas(bx + bw * .4, chao - H * .07, bw * .2, H * .07, Math.min(6, nivel + 1));
    ctx.fillStyle = "#0d0e12"; ctx.fillRect(0, chao, W, H);
    carro(W * .1, chao + H * .03, t, { farol: false }); ctx.fillStyle = "rgba(255,120,40,.6)"; fogueira(W * .9, chao + H * .02, t, .45);
  } else if (lc === "floresta") {
    floresta(t, 0, chao, f > .6);
    const cx = W * .5, cw = W * .42, ch = H * .14;
    ctx.fillStyle = "#1a120b"; ctx.fillRect(cx - cw / 2, chao - ch, cw, ch);
    ctx.beginPath(); ctx.moveTo(cx - cw / 2 - 14, chao - ch); ctx.lineTo(cx, chao - ch - H * .09); ctx.lineTo(cx + cw / 2 + 14, chao - ch); ctx.fill();
    for (let i = 0; i < 5; i++) { ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.fillRect(cx - cw / 2, chao - ch + i * ch / 5, cw, 2); }
    ctx.fillStyle = luz ? "rgba(255,190,100,.8)" : "rgba(140,150,170,.3)"; ctx.fillRect(cx - cw * .3, chao - ch * .7, cw * .2, ch * .35); sobTabuas(cx - cw * .3, chao - ch * .7, cw * .2, ch * .35, Math.min(4, nivel));
    if (luz) luzCor(cx - cw * .2, chao - ch * .5, 70, .3, "255,190,100");
    ctx.fillStyle = "#0a0705"; ctx.fillRect(cx + cw * .1, chao - ch * .75, cw * .16, ch * .75); sobTabuas(cx + cw * .1, chao - ch * .75, cw * .16, ch * .75, Math.min(6, nivel));
    ctx.strokeStyle = "#2a1c10"; ctx.lineWidth = 3; for (let i = 0; i < Math.min(12, nivel * 2); i++) { const sx = W * .05 + i * W * .08; ctx.beginPath(); ctx.moveTo(sx, chao + 6); ctx.lineTo(sx + 6, chao - H * .06); ctx.stroke(); }
    fogueira(W * .82, chao + 2, t, .5);
  } else if (lc === "fazenda") {
    ctx.fillStyle = "#1c1a12"; ctx.beginPath(); ctx.moveTo(0, chao - H * .05); ctx.quadraticCurveTo(W * .5, chao - H * .1, W, chao - H * .04); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
    ctx.fillStyle = "#3a1612"; ctx.fillRect(W * .62, chao - H * .17, W * .3, H * .17); ctx.beginPath(); ctx.moveTo(W * .6, chao - H * .17); ctx.lineTo(W * .77, chao - H * .25); ctx.lineTo(W * .94, chao - H * .17); ctx.fill();
    ctx.strokeStyle = "#5a2a20"; ctx.lineWidth = 2; ctx.strokeRect(W * .72, chao - H * .1, W * .1, H * .1); ctx.beginPath(); ctx.moveTo(W * .72, chao - H * .1); ctx.lineTo(W * .82, chao); ctx.moveTo(W * .82, chao - H * .1); ctx.lineTo(W * .72, chao); ctx.stroke();
    const hx = W * .1, hw = W * .42, hh = H * .14;
    ctx.fillStyle = "#24201a"; ctx.fillRect(hx, chao - hh, hw, hh); ctx.fillStyle = "#1a1612"; ctx.beginPath(); ctx.moveTo(hx - 12, chao - hh); ctx.lineTo(hx + hw / 2, chao - hh - H * .08); ctx.lineTo(hx + hw + 12, chao - hh); ctx.fill();
    [[.15, .3], [.62, .3]].forEach(([fx, fy]) => { ctx.fillStyle = luz ? "rgba(255,200,120,.75)" : "rgba(170,190,220,.25)"; ctx.fillRect(hx + hw * fx, chao - hh + hh * fy, hw * .2, hh * .3); sobTabuas(hx + hw * fx, chao - hh + hh * fy, hw * .2, hh * .3, Math.min(4, nivel)); });
    ctx.fillStyle = "#3a5a2a"; for (let i = 0; i < 6; i++) for (let k = 0; k < 4; k++) { const px = W * .05 + i * W * .09, py = chao + H * .03 + k * H * .025; ctx.beginPath(); ctx.arc(px + Math.sin(t + i) * 1.5, py, 4 + (SOB.horta || 0), 0, 7); ctx.fill(); }
    ctx.strokeStyle = "#3a2c1c"; ctx.lineWidth = 3; ctx.beginPath(); for (let i = 0; i < 10; i++) { ctx.moveTo(i * W / 9, chao + H * .015); ctx.lineTo(i * W / 9, chao - H * .03); } ctx.moveTo(0, chao - H * .018); ctx.lineTo(W, chao - H * .018); ctx.stroke();
    if (nivel > 2) { ctx.strokeStyle = "#555"; ctx.lineWidth = 1; for (let i = 0; i < 40; i++) { ctx.beginPath(); ctx.moveTo(i * W / 40, chao - H * .035); ctx.lineTo(i * W / 40 + 6, chao - H * .045); ctx.stroke(); } }
  } else {
    ctx.fillStyle = "#16181c"; ctx.fillRect(0, chao - H * .22, W, H * .22);
    for (let i = 0; i < 12; i++) { ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.fillRect(i * W / 12, chao - H * .22, 2, H * .22); }
    ctx.strokeStyle = "#555a60"; ctx.lineWidth = 1; for (let i = 0; i < 30; i++) { const x = i * W / 30; ctx.beginPath(); ctx.arc(x, chao - H * .23, 5, 0, 7); ctx.stroke(); }
    ctx.fillStyle = "#1c1f24"; ctx.fillRect(W * .76, chao - H * .4, W * .12, H * .4); ctx.fillRect(W * .72, chao - H * .42, W * .2, H * .04);
    const ang = Math.sin(t * .6) * .9; const g = ctx.createLinearGradient(W * .82, chao - H * .4, W * .82 + Math.sin(ang) * W, chao); g.addColorStop(0, `rgba(240,245,255,${luz ? .3 : .12})`); g.addColorStop(1, "rgba(240,245,255,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(W * .82, chao - H * .39); ctx.lineTo(W * .82 + Math.sin(ang - .15) * W * 1.2, chao + H * .1); ctx.lineTo(W * .82 + Math.sin(ang + .15) * W * 1.2, chao + H * .1); ctx.fill();
    ctx.fillStyle = "#101216"; ctx.fillRect(W * .3, chao - H * .14, W * .2, H * .14); sobTabuas(W * .3, chao - H * .14, W * .2, H * .14, Math.min(6, Math.round(nivel / 2)));
    ctx.strokeStyle = "#2a2e34"; ctx.lineWidth = 3; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(W * .32 + i * W * .03, chao - H * .14); ctx.lineTo(W * .32 + i * W * .03, chao); ctx.stroke(); }
    if (SOB.vigia) pessoa(W * .82, chao - H * .42, H * .08, { luz: true });
    ctx.fillStyle = "#0c0d10"; ctx.fillRect(0, chao, W, H);
  }
  // personagem e grupo na frente da base
  const sx = W * .45 + Math.sin(t * .3) * W * .02;
  pessoa(sx, chao + H * .045, H * .2, { cabeca: Math.sin(t * .5) > .7 ? -1 : 0 });
  SOB.grupo.forEach((g2, i) => pessoa(sx - W * .12 - i * W * .1, chao + H * .045, H * (.17 + (i % 2) * .02), { cor: "#06080c", dir: i % 2 ? -1 : 1, aro: "rgba(175,190,215,.22)" }));
  const nz = Math.min(7, 1 + Math.floor(SOB.dia / 3) + (p.noite ? 3 : 0) + (lc === "cidade" ? 2 : 0) - (lc === "floresta" ? 1 : 0));
  sobZumbis(t, chao + H * .07, nz, -.15, 1.15, .9);
  if (f > .6) { ctx.fillStyle = `rgba(5,7,12,${(f - .6) * .9})`; ctx.fillRect(0, 0, W, H); }
}
function sobLugar(t, p) {
  const chao = H * .6, k = cvSuave(cvSeg(t, .3, 3.5)), x = cvMix(-W * .05, W * .4, k), c = p.cena;
  sobCeu(Math.min(.9, SOB.gasta / Math.max(3, energiaMax()) * .9));
  if (c === "mata") floresta(t, k * W * .8, chao, false);
  else if (c === "campo") { ctx.fillStyle = "#1c1a12"; ctx.fillRect(0, chao - H * .03, W, H); for (let i = 0; i < 60; i++) { ctx.strokeStyle = "#3a3a1a"; ctx.lineWidth = 2; const gx = i * W / 50 - (k * W * .3) % (W / 50); ctx.beginPath(); ctx.moveTo(gx, chao + H * .05); ctx.lineTo(gx + Math.sin(t + i) * 3, chao - H * .06); ctx.stroke(); } }
  else if (c === "presidio") { paredeHosp(chao, t); ctx.fillStyle = "rgba(0,0,0,.35)"; for (let i = 0; i < 9; i++) ctx.fillRect(W * .05 + i * W * .11, H * .1, 4, chao - H * .1); }
  else if (c === "mercado" || c === "loja") {
    ctx.fillStyle = "#14161a"; ctx.fillRect(0, 0, W, chao); ctx.fillStyle = "#0f1013"; ctx.fillRect(0, chao, W, H);
    lampadas(t, [W * .25, W * .75], H * .04, "230,235,220");
    for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) { const px = W * (.05 + i * .24), py = H * (.15 + r * .13); ctx.fillStyle = "#23262c"; ctx.fillRect(px, py + H * .08, W * .2, 5);
      for (let j = 0; j < 6; j++) if (cvRnd(r * 30 + i * 7 + j) < .45) { ctx.fillStyle = ["#5a2a20", "#2a4a5a", "#5a5a2a", "#3a2a4a"][j % 4]; ctx.fillRect(px + j * W * .032, py + H * .04, W * .022, H * .04); } }
    ctx.fillStyle = "rgba(200,220,230,.1)"; for (let i = 0; i < 8; i++) { ctx.save(); ctx.translate(cvRnd(i) * W, chao + 8 + cvRnd(i * 3) * 30); ctx.rotate(cvRnd(i * 2) * 3); ctx.fillRect(-10, -2, 20, 4); ctx.restore(); }
  } else { acesas = .03; ctx.save(); ctx.translate(-k * W * .3, -H * .12); cidade(); ctx.restore(); ctx.fillStyle = "#0e0f12"; ctx.fillRect(0, chao, W, H); carro(W * .8 - k * W * .3, chao + H * .03, t, { farol: false }); }
  pessoa(x, chao + H * .03, H * .24, { fase: passo(x, H * .24), anda: k > 0 && k < 1 ? .9 : 0, luz: c !== "campo", mochila: true });
  if (p.zumbis && !ameaca) sobZumbis(t, chao + H * .03, p.zumbis, .55, 1.1);
}
function sobVisita(t, p) {
  sobBase(t, { noite: p.noite });
  const chao = H * .6, k = cvSuave(cvSeg(t, .3, 3)), x = cvMix(W * 1.1, W * .72, k);
  if (p.quem === "mercador") {
    ctx.fillStyle = "#3a2c1c"; ctx.fillRect(x - W * .02, chao - H * .06, W * .2, H * .05); ctx.fillStyle = "#5a4630"; ctx.beginPath(); ctx.moveTo(x - W * .03, chao - H * .06); ctx.quadraticCurveTo(x + W * .08, chao - H * .14, x + W * .19, chao - H * .06); ctx.fill();
    ctx.fillStyle = "#050505"; [x, x + W * .15].forEach(r => { ctx.beginPath(); ctx.arc(r, chao - H * .008, H * .013, 0, 7); ctx.fill(); });
    luzCor(x - W * .04, chao - H * .1, 50, .5, "255,200,110"); ctx.fillStyle = "rgba(255,210,120,.9)"; ctx.fillRect(x - W * .045, chao - H * .11, 6, 8);
    pessoa(x - W * .06, chao + H * .02, H * .22, { fase: t * 4, anda: k < 1 ? .8 : 0, dir: -1, capacete: false, mochila: true });
  } else if (p.quem === "bandidos") {
    for (let i = 0; i < 3; i++) pessoa(x + i * W * .07 - W * .06, chao + H * .02 + (i % 2) * 4, H * .23, { fase: t * 4 + i, anda: k < 1 ? .9 : 0, dir: -1, cor: "#030303", aro: "rgba(226,72,61,.3)", luz: i === 1, luzRgb: "255,220,200" });
  } else {
    pessoa(x, chao + H * .02, H * .22, { fase: t * 4, anda: k < 1 ? .8 : 0, dir: -1, luz: !!p.noite });
    if (p.crianca) pessoa(x + W * .06, chao + H * .02, H * .13, { fase: t * 4 + 1, anda: k < 1 ? .8 : 0, dir: -1 });
  }
}
function sobDesenhar(t) {
  if (!SOB) return;
  const c = sobCena;
  if (c.tipo === "lugar") sobLugar(t, c);
  else if (c.tipo === "visita") sobVisita(t, c);
  else sobBase(t, c);
}
CINE.sobrevivencia = { dur: 0, f(t) { sobDesenhar(t); } };

/* ---------- interface ---------- */
const $s = id => document.getElementById(id);
function sobLigarCena(c) {
  sobCena = c;
  cineAtual = { def: CINE.sobrevivencia, p: {}, dur: 0, chave: "sob" + Math.random(), t0: performance.now(), vel: 1, fim: null };
}
function sobHud() {
  if (!SOB) return;
  const barra = (n, v, cor, icone, txt) => `<div class="sb-barra ${v < 25 ? "baixo" : ""}"><span class="sb-l">${ic(icone)}${n}</span><span class="sb-b"><i style="width:${Math.max(0, Math.min(100, v))}%;background:${cor}"></i></span><span class="sb-v">${txt ?? Math.round(v)}</span></div>`;
  const pips = Array.from({ length: energiaMax() }, (_, i) => `<i class="${i < SOB.energia ? "on" : ""}">${ic("energia")}</i>`).join("");
  $s("sobHud").innerHTML =
    `<div class="sb-topo"><span class="sb-dia">Dia ${SOB.dia}</span><span class="sb-hora">${horaNome()} · ${L().nome}</span><span class="sb-en" aria-label="Energia ${SOB.energia} de ${energiaMax()}">${pips}</span></div>` +
    barra("Saúde", SOB.saude, "#e2483d", "saude") + barra("Fome", SOB.fome, "#f2a33a", "fome", SOB.fome < 25 ? "Faminto" : Math.round(SOB.fome)) + barra("Defesa", SOB.defesa, "#4fcfd9", "defesa") +
    `<div class="sb-inv">${Object.keys(SOB_ITENS).map(k => `<span class="sb-chip" id="sbi-${k}">${ic(k)}<b>${SOB[k]}</b><small>${SOB_ITENS[k]}</small></span>`).join("")}<span class="sb-chip">${ic("grupo")}<b>${SOB.grupo.length}</b><small>Grupo</small></span></div>`;
}
function sobFlutua(txt, bom = true) {
  const el = document.createElement("div"); el.className = "sb-flutua " + (bom ? "bom" : "ruim"); el.textContent = txt;
  el.style.left = (20 + Math.random() * 50) + "%"; $s("sob").appendChild(el); setTimeout(() => el.remove(), 1700);
}
function sobMuda(campo, v, mostrar = true) {
  const antes = SOB[campo];
  if (campo === "saude" || campo === "fome" || campo === "defesa") SOB[campo] = Math.max(0, Math.min(100, antes + v)); else SOB[campo] = Math.max(0, antes + v);
  const d = SOB[campo] - antes;
  if (mostrar && d) sobFlutua((d > 0 ? "+" : "") + d + " " + ({ saude: "Saúde", fome: "Fome", defesa: "Defesa" }[campo] || SOB_ITENS[campo]), d > 0);
  return d;
}
function sobTexto(html, narrarTambem = true) {
  const el = $s("sobTexto"); el.classList.remove("in"); void el.offsetWidth; el.innerHTML = html; el.classList.add("in");
  if (narrarTambem && typeof narrar === "function") narrar(html);
}
function sobBotoes(lista) { // [{t, sub, icone, custo, on, desat, cls}]
  const box = $s("sobAcoes"); box.innerHTML = "";
  lista.forEach((b, i) => {
    const e = document.createElement("button"); e.type = "button"; e.className = "sb-acao " + (b.cls || ""); e.disabled = !!b.desat;
    e.innerHTML = `${b.icone ? ic(b.icone) : ""}<span class="sb-at"><b>${b.t}</b>${b.sub ? `<small>${b.sub}</small>` : ""}</span>${b.custo ? `<span class="sb-custo">${b.custo}</span>` : ""}`;
    e.addEventListener("click", ev => { ev.stopPropagation(); if (sobOcupado) return; tocar("clique"); b.on(); });
    box.appendChild(e); setTimeout(() => e.classList.add("show"), 60 * i);
  });
}
function sobAnimar(cena, ms, depois) { sobOcupado = true; sobLigarCena(cena); setTimeout(() => { sobOcupado = false; depois(); }, reduz ? 0 : ms); }

/* ---------- loop do dia ---------- */
function sobDia(msg) {
  if (!SOB) return;
  sobGravar(); sobHud(); sobLigarCena({ tipo: "base" });
  setAmb({ drone: .35 + SOB.gasta * .1, vento: .4 });
  const l = L(), sem = SOB.energia <= 0;
  sobTexto(msg || (sem ? `Você está exausto. Não dá para fazer mais nada hoje.` : `${l.base}. ${["O dia nasce cinza.", "O sol está alto.", "A tarde avança.", "O céu começa a escurecer.", "Logo vai anoitecer."][Math.min(4, SOB.gasta)]} O que você vai fazer?`), !!msg);
  const b = [];
  if (!sem) {
    b.push({ t: "Vasculhar", sub: "Buscar suprimentos", icone: "busca", custo: "1 ⚡", on: sobEscolherLugar });
    b.push({ t: "Fortificar", sub: SOB.material >= 2 ? "2 materiais · +12 defesa" : "Sem materiais: +4", icone: "martelo", custo: "1 ⚡", on: sobFortificar });
    b.push({ t: l.especial.nome, sub: l.especial.desc, icone: l.especial.icone, custo: "1 ⚡", on: sobEspecial });
    b.push({ t: "Descansar", sub: "+12 saúde", icone: "cama", custo: "1 ⚡", on: sobDescansar });
  }
  b.push({ t: "Comer", sub: `${SOB.comida} · +30`, icone: "comida", cls: "mini", desat: SOB.comida < 1 || SOB.fome >= 100, on: () => { sobMuda("comida", -1); sobMuda("fome", 30); tocar("item"); sobDia("Você come em silêncio, de olho na janela."); } });
  b.push({ t: "Remédio", sub: `${SOB.remedio} · +30`, icone: "remedio", cls: "mini", desat: SOB.remedio < 1 || SOB.saude >= 100, on: () => { sobMuda("remedio", -1); sobMuda("saude", 30); tocar("sucesso"); sobDia("O remédio arde, mas você se sente melhor."); } });
  b.push({ t: "Dormir", sub: sem ? "Passar a noite" : "Encerrar o dia", icone: "lua", cls: sem ? "destaque" : "mini", on: sobNoite });
  sobBotoes(b);
}
function sobGastar() { SOB.energia--; SOB.gasta++; sobMuda("fome", -5, false); }
function sobEscolherLugar() {
  const l = L();
  sobTexto("Para onde você vai?", false);
  sobBotoes([...l.lugares.map(g => ({ t: g.nome, sub: g.desc + " · risco " + (g.risco < .35 ? "baixo" : g.risco < .5 ? "médio" : "alto"), icone: "busca", on: () => sobVasculhar(g) })),
    { t: "Voltar", icone: "porta", cls: "mini", on: () => sobDia() }]);
}
function sobRisco(base) { return Math.min(.92, base * L().perigo * (1 + SOB.dia * .045)); }
function sobLoot(loot, mult = 1) {
  const ganhos = [];
  for (const [k, [a, b]] of Object.entries(loot)) { const n = Math.round(sobRnd(a, b) * mult); if (n > 0) { sobMuda(k, n); ganhos.push(n + " " + SOB_ITENS[k].toLowerCase()); } }
  return ganhos.length ? ganhos.join(", ") : "nada que preste";
}
function sobVasculhar(g) {
  sobGastar(); sobGravar(); tocar("passos");
  sobTexto(`Você sai em direção a: <em>${g.nome}</em>…`, false); $s("sobAcoes").innerHTML = "";
  sobAnimar({ tipo: "lugar", cena: g.cena, zumbis: 0 }, 3200, () => {
    if (sobChance(sobRisco(g.risco))) return sobEncontro(g);
    const achou = sobLoot(g.loot);
    const extras = ["Silêncio total. Só o vento nas janelas quebradas.", "Você encontra um bilhete: \"fomos para o norte\".", "Um cachorro magro te segue por um tempo e some.", "Marcas de unha na porta. Faz tempo que ninguém passa aqui."];
    tocar("item"); sobHud();
    sobTexto(`${extras[sobRnd(0, extras.length - 1)]} Você volta com <em>${achou}</em>.`);
    sobBotoes([{ t: "Voltar para a base", icone: "porta", on: () => sobDia() }]);
  });
}
function sobEncontro(g) {
  const n = sobRnd(1, Math.min(5, 1 + Math.floor(SOB.dia / 4))), l = L();
  sobLigarCena({ tipo: "lugar", cena: g.cena, zumbis: n });
  tocar("gemido"); vibrar(120);
  sobTexto(`${n > 1 ? n + " zumbis" : "Um zumbi"} sai${n > 1 ? "em" : ""} de trás das prateleiras e vem${n > 1 ? "m" : ""} na sua direção, gemendo.`);
  sobBotoes([
    { t: "Atirar", sub: `Gasta ${n} munição · você tem ${SOB.municao}`, icone: "municao", desat: SOB.municao < n, on: () => {
      sobMuda("municao", -n); tocar("impacto"); tremer(0, .3);
      const achou = sobLoot(g.loot, 1.2); sobTexto(`Os tiros ecoam pela rua. Você ganha tempo para pegar o que veio buscar: <em>${achou}</em>. Mas o barulho atrai mais deles para a sua área.`);
      SOB.barulho = (SOB.barulho || 0) + 1; sobHud(); sobBotoes([{ t: "Voltar para a base", icone: "porta", on: () => sobDia() }]); } },
    { t: "Se esconder", sub: "Segure quando eles olharem", icone: "busca", on: () => sobMiniEsconder(n, ok => {
      if (ok) { const achou = sobLoot(g.loot, .8); sobTexto(`Eles passam arrastando os pés. Quando somem, você pega <em>${achou}</em> e sai devagar.`); }
      else { const d = sobMuda("saude", -sobRnd(18, 30)); sobTexto(`Um deles te agarra pelo braço. Você se solta com um tranco e foge, sangrando. ${sobChance(.25) ? "<span class='msg'>Tem uma marca de dente no seu braço.</span>" : ""}`); if (sobChance(.25)) SOB.mordido = SOB.dia; }
      sobHud(); sobFim() || sobBotoes([{ t: "Voltar para a base", icone: "porta", on: () => sobDia() }]); }) },
    { t: "Fugir", sub: "Volta sem nada", icone: "porta", on: () => {
      if (sobChance(.75)) { sobTexto("Você corre sem olhar para trás e só para quando chega na base."); }
      else { sobMuda("saude", -sobRnd(8, 15)); sobTexto("Na fuga, você tropeça e se corta feio no vidro de uma vitrine."); }
      sobHud(); sobFim() || sobBotoes([{ t: "Voltar para a base", icone: "porta", on: () => sobDia() }]); } },
  ]);
}
function sobFortificar() {
  sobGastar(); tocar("batidas");
  let ganho; if (SOB.material >= 2) { sobMuda("material", -2); ganho = sobMuda("defesa", 12); } else ganho = sobMuda("defesa", 4);
  sobAnimar({ tipo: "base" }, 1200, () => sobDia(ganho > 4 ? "Você prega tábuas nas janelas e reforça a porta. A base parece mais segura." : "Sem materiais, você só arrasta móveis para a porta. Ajuda um pouco."));
}
function sobDescansar() { sobGastar(); sobMuda("saude", 12); tocar("respira"); sobDia("Você fecha os olhos por algumas horas. O corpo agradece."); }
function sobEspecial() {
  sobGastar(); const lc = SOB.local;
  if (lc === "cidade") { const achou = sobLoot({ comida: [0, 2], remedio: [0, 1], sucata: [1, 2] }); tocar("item"); return sobDia(`Você arromba os apartamentos vizinhos, um por um. Encontra <em>${achou}</em>.`); }
  if (lc === "floresta") { if (sobChance(.7)) { sobMuda("comida", sobRnd(2, 4)); tocar("sucesso"); return sobDia("Você caça um tatu e um par de aves. Vai ter comida por uns dias."); } sobMuda("saude", -sobRnd(8, 14)); tocar("erro"); return sobDia("Você escorrega num barranco e volta mancando, sem nada."); }
  if (lc === "fazenda") { SOB.horta = Math.min(3, (SOB.horta || 0) + 1); sobMuda("comida", sobRnd(1, 2) + SOB.horta); tocar("item"); return sobDia("Você capina, rega e colhe o que dá. A horta está crescendo."); }
  SOB.vigia = true; tocar("sucesso"); sobDia("Você sobe na torre e marca as brechas no muro. Esta noite vai ser mais tranquila.");
}

/* ---------- noite ---------- */
function sobNoite() {
  sobOcupado = true; $s("sobAcoes").innerHTML = "";
  sobTexto("Você tranca tudo e apaga as luzes.", false);
  sobLigarCena({ tipo: "base", noite: true }); setAmb({ drone: .9, vento: .6 });
  setTimeout(() => {
    sobOcupado = false;
    // grupo come
    let fugiu = null;
    SOB.grupo.forEach(g => { if (SOB.comida > 0) SOB.comida--; else g.fome = (g.fome || 0) + 1; });
    const sai = SOB.grupo.find(g => g.fome >= 2); if (sai) { SOB.grupo = SOB.grupo.filter(g => g !== sai); fugiu = sai.nome; }
    sobMuda("fome", -28, false);
    let chance = .4 * L().perigo * (1 + SOB.dia * .06) + (SOB.barulho || 0) * .15 - SOB.defesa / 260 - (SOB.vigia ? .2 : 0);
    const infectado = SOB.grupo.find(g => g.mordido);
    const r = Math.random();
    const pos = msg => sobAmanhecer((fugiu ? `${fugiu} foi embora durante a noite: não tinha comida para todos. ` : "") + msg);
    if (infectado && sobChance(.7)) return sobInfectado(infectado, pos);
    if (r < Math.max(.08, chance)) return sobHorda(pos);
    if (r < chance + .14) return sobBarulho(pos);
    if (r < chance + .24) return sobVisitante(true, pos);
    sobMuda("saude", 5, false);
    pos("A noite passa sem nada além de gemidos ao longe.");
  }, reduz ? 0 : 2200);
}
function sobHorda(pos) {
  const n = sobRnd(3, 6 + Math.floor(SOB.dia / 2));
  tocar("batidas"); tocar("gemido"); vibrar(300);
  const forca = n * 9, segura = SOB.defesa >= forca;
  if (segura) { sobMuda("defesa", -Math.round(forca / 3)); sobTexto(`Você acorda com uma horda de ${n} batendo nas paredes. As barricadas aguentam, mas ficam bem danificadas.`); return sobBotoes([{ t: "Esperar amanhecer", icone: "lua", on: () => pos("A horda se dispersa com o sol.") }]); }
  sobMuda("defesa", -Math.round(forca / 2));
  sobTexto(`Uma horda de ${n} arrebenta a barricada. Eles estão entrando!`);
  sobBotoes([
    { t: "Atirar", sub: `Gasta ${Math.ceil(n / 2)} munição`, icone: "municao", desat: SOB.municao < Math.ceil(n / 2), on: () => { sobMuda("municao", -Math.ceil(n / 2)); sobMuda("saude", -sobRnd(0, 10)); tocar("impacto"); sobHud(); sobFim() || pos("Você atira até o último cair na porta. O cheiro não sai mais da casa."); } },
    { t: "Segurar a porta", sub: "Toque rápido!", icone: "defesa", on: () => sobMiniTocar(14 + Math.floor(n / 2), 5, ok => { if (!ok) sobMuda("saude", -sobRnd(25, 40)); else sobMuda("saude", -sobRnd(0, 8)); sobHud(); sobFim() || pos(ok ? "Você segura a porta com o ombro até eles desistirem." : "Eles empurram a porta e te derrubam. Você luta no escuro e sobrevive, por pouco."); }) },
    { t: "Fugir pelos fundos", sub: "Perde parte dos suprimentos", icone: "porta", on: () => { ["comida", "material", "sucata"].forEach(k => sobMuda(k, -Math.ceil(SOB[k] / 2))); sobHud(); pos("Você foge e volta de manhã. Eles levaram metade de tudo, ou pisotearam."); } },
  ]);
}
function sobBarulho(pos) {
  tocar("arranhar");
  sobTexto("Um barulho no quintal. Algo arrastando, metal batendo em metal.");
  sobBotoes([
    { t: "Investigar", sub: "Pode ser bom… ou não", icone: "busca", on: () => { if (sobChance(.55)) { const a = sobLoot({ comida: [0, 2], municao: [0, 2], material: [1, 2] }); tocar("item"); sobHud(); pos(`Era uma mochila caída de alguém que não teve sorte. Você pega ${a}.`); } else sobMiniEsconder(2, ok => { if (!ok) sobMuda("saude", -sobRnd(15, 25)); sobHud(); sobFim() || pos(ok ? "Era um zumbi preso na cerca. Você volta sem ser visto." : "Era um zumbi. Ele te pega de raspão antes de você trancar a porta."); }); } },
    { t: "Ignorar", sub: "Voltar a dormir", icone: "lua", on: () => pos("Você cobre a cabeça e espera o barulho passar.") },
  ]);
}
function sobInfectado(g, pos) {
  tocar("susto"); susto = performance.now(); vibrar(400);
  SOB.grupo = SOB.grupo.filter(x => x !== g);
  const d = sobMuda("saude", -sobRnd(15, 30));
  sobHud();
  sobTexto(`No meio da noite, ${g.nome} levanta da cama. Os olhos estão brancos. A mordida que ninguém viu.`);
  sobBotoes([{ t: "…", icone: "lua", on: () => sobFim() || pos(`Você não teve escolha. De manhã, enterra ${g.nome} no quintal.`) }]);
}
function sobAmanhecer(msgNoite) {
  if (sobFim()) return;
  if (SOB.fome <= 0) sobMuda("saude", -18, false); else if (SOB.fome < 25) sobMuda("saude", -6, false);
  if (SOB.mordido && SOB.dia - SOB.mordido >= 1) { if (SOB.remedio > 0) { SOB.remedio--; SOB.mordido = null; } else { sobMuda("saude", -25, false); SOB.mordido = null; } }
  if (sobFim()) return;
  SOB.dia++; SOB.gasta = 0; SOB.energia = energiaMax(); SOB.vigia = false; SOB.barulho = 0;
  sobMuda("defesa", -4, false); // barricadas se desgastam
  if (SOB.local === "fazenda" && SOB.horta) sobMuda("comida", 1, false);
  try { if (SOB.dia > sobRecorde()) localStorage.setItem("pv_sob_rec", SOB.dia); } catch (e) {}
  sobGravar(); sobHud();
  sobTexto(`${msgNoite} <br><b class="sb-novo-dia">Dia ${SOB.dia}</b>`);
  sobBotoes([{ t: "Começar o dia", icone: "energia", cls: "destaque", on: sobManha }]);
}
function sobManha() {
  const r = Math.random();
  if (SOB.dia > 2 && r < .17) return sobMercador();
  if (SOB.dia > 2 && r < .3) return sobVisitante(false, m => sobDia(m));
  if (SOB.dia > 4 && r < .4) return sobBandidos();
  if (r < .48) { const a = sobLoot({ comida: [1, 3], remedio: [0, 2], municao: [0, 3] }); tocar("item"); sobHud(); return sobDia(`Um helicóptero passa baixo e larga uma caixa de suprimentos perto da base. Dentro: ${a}.`); }
  sobDia();
}
function sobVisitante(noite, depois) {
  const nome = SOB_NOMES[sobRnd(0, SOB_NOMES.length - 1)], crianca = sobChance(.3), mordido = sobChance(.3);
  sobLigarCena({ tipo: "visita", quem: "pessoa", noite, crianca });
  tocar("batidas");
  sobTexto(`${noite ? "No meio da noite, alguém" : "Alguém"} bate na porta. É ${nome}${crianca ? ", com uma criança no colo" : ""}. ${mordido ? "Está com o braço enrolado num pano sujo." : "Está magro, mas parece bem."} Pede para entrar.`);
  const cheio = SOB.grupo.length >= 3;
  sobBotoes([
    { t: "Deixar entrar", sub: cheio ? "O grupo já está cheio" : "+1 energia por dia, mas come", icone: "grupo", desat: cheio, on: () => { SOB.grupo.push({ nome, mordido }); if (sobChance(.5)) sobLoot({ comida: [0, 2], municao: [0, 2] }); tocar("sucesso"); sobHud(); depois(`${nome} entra e agradece mil vezes. Agora vocês são ${SOB.grupo.length + 1}.`); } },
    { t: "Revistar antes", sub: "Ver se tem mordida", icone: "busca", desat: cheio, on: () => { if (mordido) { sobTexto(`Debaixo do pano, uma mordida roxa. ${nome} chora e implora.`); sobBotoes([{ t: "Mandar embora", icone: "porta", on: () => depois(`${nome} vai embora pela estrada, sem olhar para trás.`) }, { t: "Deixar entrar mesmo assim", icone: "grupo", on: () => { SOB.grupo.push({ nome, mordido: true }); sobHud(); depois(`${nome} entra. Você tenta não pensar na mordida.`); } }]); } else { SOB.grupo.push({ nome, mordido: false }); tocar("sucesso"); sobHud(); depois(`Nenhuma mordida. ${nome} entra para o grupo.`); } } },
    { t: "Mandar embora", icone: "porta", on: () => depois(`${nome} xinga baixinho e some ${noite ? "no escuro" : "pela estrada"}.`) },
  ]);
}
function sobMercador() {
  sobLigarCena({ tipo: "visita", quem: "mercador" });
  tocar("campainha");
  const ofertas = [
    { d: "3 comida", da: { comida: 3 }, custo: { sucata: 4 } }, { d: "2 remédios", da: { remedio: 2 }, custo: { sucata: 5 } },
    { d: "6 munição", da: { municao: 6 }, custo: { comida: 2 } }, { d: "3 materiais", da: { material: 3 }, custo: { sucata: 3 } },
    { d: "4 sucata", da: { sucata: 4 }, custo: { municao: 3 } }, { d: "2 comida", da: { comida: 2 }, custo: { municao: 2 } },
  ].sort(() => Math.random() - .5).slice(0, 3);
  const mostrarOfertas = msg => {
    sobTexto(msg || "Um mercador chega puxando uma carroça, com um lampião pendurado. \"Tenho o que você precisa. Se tiver com o que pagar.\"", !msg);
    sobBotoes([...ofertas.map(o => { const [ck, cv] = Object.entries(o.custo)[0]; return { t: "Comprar " + o.d, sub: `Paga ${cv} ${SOB_ITENS[ck].toLowerCase()} · você tem ${SOB[ck]}`, icone: Object.keys(o.da)[0], desat: SOB[ck] < cv, on: () => { sobMuda(ck, -cv); for (const [k, v] of Object.entries(o.da)) sobMuda(k, v); tocar("item"); sobHud(); mostrarOfertas("Negócio fechado. \"Mais alguma coisa?\""); } }; }),
      { t: "Dispensar o mercador", icone: "porta", on: () => sobDia("A carroça vai embora rangendo pela estrada.") }]);
  };
  mostrarOfertas();
}
function sobBandidos() {
  sobLigarCena({ tipo: "visita", quem: "bandidos" });
  tocar("passos"); vibrar(80);
  sobTexto("Três homens armados param na frente da base. \"Metade da sua comida, e ninguém se machuca.\"");
  sobBotoes([
    { t: "Entregar a comida", sub: `Perde ${Math.ceil(SOB.comida / 2)} comida`, icone: "comida", on: () => { sobMuda("comida", -Math.ceil(SOB.comida / 2)); sobHud(); sobDia("Eles pegam a comida e vão embora rindo."); } },
    { t: "Ameaçar com a arma", sub: "Precisa de 3 munição", icone: "municao", desat: SOB.municao < 3, on: () => { if (sobChance(.6 + SOB.grupo.length * .1)) { sobMuda("municao", -1); tocar("impacto"); sobDia("Você dá um tiro para o alto. Eles recuam e somem."); } else { sobMuda("municao", -3); sobMuda("saude", -sobRnd(15, 30)); tocar("impacto"); sobHud(); sobFim() || sobDia("Troca de tiros. Eles fogem, mas você leva um tiro de raspão."); } } },
    { t: "Oferecer sucata", sub: "Paga 4 sucata", icone: "sucata", desat: SOB.sucata < 4, on: () => { sobMuda("sucata", -4); sobHud(); sobDia("\"Serve.\" Eles pegam a sucata e seguem a estrada."); } },
  ]);
}

/* ---------- minijogos ---------- */
function sobMiniEsconder(n, fim) {
  const dur = 7 + Math.min(5, n);
  sobTexto("Você se encolhe atrás do que encontra. Segure quando eles olharem.", false);
  const box = $s("sobAcoes"); box.innerHTML = `<button type="button" class="big sb-big" id="sobBig"><i class="fill"></i><span>Segure</span></button><div class="timer"><i></i></div>`;
  const b = $s("sobBig"), bar = box.querySelector(".timer i");
  ameaca = { tipo: "esconder", estado: "anda", ate: performance.now() + 1500, passo: Math.random() * 6, escondido: false, zumbi: true };
  let seg = false, folego = 1, bloq = 0, ult = performance.now(); const t0 = ult;
  b.addEventListener("pointerdown", e => { e.preventDefault(); if (performance.now() > bloq) seg = true; try { b.setPointerCapture(e.pointerId); } catch (_) {} });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach(ev => b.addEventListener(ev, () => { seg = false; }));
  b.addEventListener("contextmenu", e => e.preventDefault());
  const acaba = ok => { ameaca = null; tocar(ok ? "sucesso" : "susto"); if (!ok) { susto = performance.now(); vibrar(350); } setTimeout(() => fim(ok), 400); };
  (function loop(now) {
    if (!ameaca) return;
    const dt = Math.min(.1, (now - ult) / 1000); ult = now;
    if (now > ameaca.ate) {
      if (ameaca.estado === "anda") { ameaca.estado = "aviso"; ameaca.ate = now + 700; tocar("aviso"); vibrar(60); }
      else if (ameaca.estado === "aviso") { ameaca.estado = "olha"; ameaca.ate = now + 1000 + Math.random() * 800; tocar("gemido"); }
      else { ameaca.estado = "anda"; ameaca.ate = now + 1200 + Math.random() * 1600; }
    }
    if (ameaca.estado === "anda") ameaca.passo += dt;
    if (seg) folego -= dt / 3.3; else folego = Math.min(1, folego + dt / 2.2);
    if (seg && folego <= 0) { seg = false; bloq = now + 900; tocar("respira"); }
    ameaca.escondido = seg;
    if (ameaca.estado === "olha" && !seg) return acaba(false);
    b.firstChild.style.width = Math.max(0, folego) * 100 + "%";
    b.lastChild.textContent = seg ? (folego < .3 ? "Sem ar!" : "Escondido") : ameaca.estado === "aviso" ? "Esconda-se!" : now < bloq ? "Sem fôlego…" : "Segure";
    b.classList.toggle("perigo", ameaca.estado !== "anda" && !seg);
    const rest = 1 - (now - t0) / 1000 / dur; bar.style.width = Math.max(0, rest) * 100 + "%";
    if (rest <= 0) return acaba(true);
    requestAnimationFrame(loop);
  })(ult);
}
function sobMiniTocar(n, limite, fim) {
  const box = $s("sobAcoes"); box.innerHTML = `<button type="button" class="big sb-big" id="sobBig"><i class="fill"></i><span>0 / ${n}</span></button><div class="timer"><i></i></div>`;
  const b = $s("sobBig"), bar = box.querySelector(".timer i"); let c = 0, acabou = false; const t0 = performance.now();
  const acaba = ok => { if (acabou) return; acabou = true; tocar(ok ? "sucesso" : "erro"); setTimeout(() => fim(ok), 300); };
  b.addEventListener("pointerdown", e => { e.preventDefault(); if (acabou) return; c++; tocar("toque"); tremer(0, .06); b.firstChild.style.width = c / n * 100 + "%"; b.lastChild.textContent = c + " / " + n; b.classList.remove("bate"); void b.offsetWidth; b.classList.add("bate"); if (c >= n) acaba(true); });
  (function loop(now) { if (acabou) return; const rest = 1 - (now - t0) / 1000 / limite; bar.style.width = Math.max(0, rest) * 100 + "%"; if (rest <= 0) return acaba(false); requestAnimationFrame(loop); })(t0);
}

/* ---------- morte ---------- */
function sobFim() {
  if (!SOB || SOB.saude > 0) return false;
  const dias = SOB.dia, rec = Math.max(sobRecorde(), dias);
  try { localStorage.setItem("pv_sob_rec", rec); localStorage.removeItem("pv_sob"); } catch (e) {}
  tocar("fimRuim"); vibrar(500);
  sobLigarCena({ tipo: "base", noite: true });
  $s("sobHud").innerHTML = `<div class="sb-morte"><span>Você não resistiu</span><b>${dias} ${dias === 1 ? "dia" : "dias"}</b><small>Recorde: ${rec} dias · ${L().nome}</small></div>`;
  sobTexto(`Sua saúde chegou a zero. ${SOB.grupo.length ? "O grupo te enterra no quintal e segue viagem." : "Ninguém fica sabendo."} O mundo continua acabando sem você.`);
  SOB = null;
  sobBotoes([{ t: "Começar de novo", icone: "energia", cls: "destaque", on: sobInicio }, { t: "Voltar ao menu", icone: "porta", on: () => abrirHub() }]);
  return true;
}

/* ---------- entrada no modo ---------- */
function sobInicio() {
  sobLigarCena({ tipo: "base" });
  SOB = null;
  $s("sobHud").innerHTML = `<div class="sb-titulo"><span>Modo sobrevivência</span><b>Apocalipse</b><small>Recorde: ${sobRecorde()} dias</small></div>`;
  sobTexto("O mundo acabou há três semanas. Escolha onde você vai tentar sobreviver.", false);
  sobBotoes(Object.entries(SOB_LOCAIS).map(([k, l]) => ({ t: l.nome, sub: l.desc, icone: { cidade: "porta", floresta: "caca", fazenda: "horta", presidio: "torre" }[k], cls: "local", on: () => { sobNovo(k); sobDia(`Você chega: ${l.base}. Por enquanto, está vivo.`); } })));
}
function entrarSob() {
  if (!temPremium()) return abrirPremium();
  tok++; pararTudo(); calar(); S = null; NOS = null; ameaca = null;
  $s("hub").hidden = true; $s("drawer").hidden = true; $s("premium").hidden = true;
  document.body.classList.remove("no-hub", "cine"); document.body.classList.add("modo-sob");
  $s("sob").hidden = false;
  try { initAudio(); } catch (e) {}
  corDestaque("#e2483d"); setVer([]);
  SOB = sobLer();
  if (SOB && SOB_LOCAIS[SOB.local]) { sobLigarCena({ tipo: "base" }); sobDia(`Dia ${SOB.dia}. Você volta para ${L().base.toLowerCase()}. Tudo está como você deixou.`); }
  else sobInicio();
}
window.sairSob = () => { if ($s("sob").hidden) return; if (SOB) sobGravar(); ameaca = null; $s("sob").hidden = true; document.body.classList.remove("modo-sob"); };
function abrirPremium() { $s("premium").hidden = false; }
$s("btnSobMenu").addEventListener("click", () => abrirHub());
$s("btnPremiumTeste").addEventListener("click", () => { try { localStorage.setItem("pv_premium", "1"); } catch (e) {} $s("premium").hidden = true; tocar("sucesso"); entrarSob(); });
$s("btnPremiumFechar").addEventListener("click", () => { $s("premium").hidden = true; });
