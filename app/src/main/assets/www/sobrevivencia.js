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

/* ---------- ícones ---------- */
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
    ctx.fillStyle = "#3a5a2a"; for (let i = 0; i < 6; i++) for (let k = 0; k < 4; k++) { const px = W * .05 + i * W * .09, py = chao + H * .03 + k * H * .025; ctx.beginPath(); ctx.arc(px + Math.sin(t + i) * 1.5, py, 4 + Math.min(3, (SOB.horta || []).filter(h => h).length), 0, 7); ctx.fill(); }
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
