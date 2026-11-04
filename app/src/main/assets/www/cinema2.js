/* ============================================================
   TERROR: monstro, esconderijos, sustos e eventos aleatórios
   ============================================================ */

/* ---------- o monstro ----------
   alto, magro, braços compridos, cabeça inclinada, olhos que brilham */
function monstro(x, y, h, o = {}) {
  const { fase = 0, anda = 0, dir = 1, olhos = .6, cor = "#010102", aro = "rgba(200,200,220,.16)", olhosRgb = "255,235,210", quatro = false, touca = false, cabeca = .35 } = o;
  const s = h / 100, agora = performance.now() / 1000;
  if (h > 20) { ctx.fillStyle = "rgba(0,0,0,.4)"; ctx.beginPath(); ctx.ellipse(x, y + 1, h * (quatro ? .3 : .14), h * .025, 0, 0, 7); ctx.fill(); }
  ctx.save(); ctx.translate(x, y); ctx.scale(dir * s, s);
  const sw = Math.sin(fase) * anda, tre = Math.sin(fase * 7.3) * .6 + Math.sin(agora * 23) * .15;
  const peito = Math.sin(agora * 1.3) * 1.5;
  const p = new Path2D(), t = new Path2D();
  const seg2 = (x0, y0, a1, l1, a2, l2) => { const x1 = x0 + Math.sin(a1) * l1, y1 = y0 + Math.cos(a1) * l1, x2 = x1 + Math.sin(a2) * l2, y2 = y1 + Math.cos(a2) * l2; p.moveTo(x0, y0); p.lineTo(x1, y1); p.lineTo(x2, y2); return [x2, y2]; };
  let hx, hy;
  if (quatro) { // anda de quatro, como bicho
    t.moveTo(-28, -38); t.lineTo(26, -44);
    [[-26, 1], [-22, -1], [22, 1], [26, -1]].forEach(([bx, k]) => seg2(bx, -40, sw * .5 * k - .3, 24, sw * .4 * k + .4, 26));
    hx = 40; hy = -50;
  } else {
    const hip = -60, sh = -100;
    [1, -1].forEach(k => { const w = sw * k; seg2(0, hip, w * .45, 31, w * .45 - .1 - Math.max(0, -w) * .7, 31); });
    t.moveTo(0, hip); t.quadraticCurveTo(4 - peito, (hip + sh) / 2, 10, sh);
    [1, -1].forEach(k => { const a = -sw * k * .25 + .12 + tre * .02; const m = seg2(10, sh + 3, a, 33, a - .05, 33); for (let d = -1; d <= 1; d++) { p.moveTo(m[0], m[1]); p.lineTo(m[0] + d * 4, m[1] + 12 + Math.abs(d) * -2); } });
    hx = 18; hy = sh - 10;
  }
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.strokeStyle = aro; ctx.lineWidth = 7; ctx.stroke(p); ctx.lineWidth = 11; ctx.stroke(t);
  ctx.strokeStyle = cor; ctx.lineWidth = 4.5; ctx.stroke(p); ctx.lineWidth = 8.5; ctx.stroke(t);
  if (!quatro) { // costelas aparecendo
    ctx.strokeStyle = aro; ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) { const yy = -88 + i * 6; ctx.beginPath(); ctx.moveTo(3 - peito * .3, yy); ctx.quadraticCurveTo(7, yy + 2, 10, yy - 1); ctx.stroke(); }
  }
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(cabeca + tre * .03);
  ctx.fillStyle = aro; ctx.beginPath(); ctx.ellipse(0, 0, 9, 14, 0, 0, 7); ctx.fill();
  ctx.fillStyle = cor; ctx.beginPath(); ctx.ellipse(0, 0, 7.5, 12.5, 0, 0, 7); ctx.fill();
  if (touca) { ctx.fillStyle = "rgba(220,225,215,.55)"; ctx.fillRect(-9, -14, 18, 6); ctx.fillStyle = "rgba(200,40,40,.6)"; ctx.fillRect(-2, -13, 4, 4); }
  else { // cabelo comprido e ralo caindo
    ctx.strokeStyle = cor; ctx.lineWidth = 1.4;
    for (let i = 0; i < 7; i++) { const bx = -6 + i * 1.6; ctx.beginPath(); ctx.moveTo(bx, -10); ctx.quadraticCurveTo(bx - 4 + Math.sin(agora * 1.5 + i) * 2, 8, bx - 2 + Math.sin(agora + i) * 3, 22 + i % 3 * 4); ctx.stroke(); }
  }
  ctx.fillStyle = "rgba(0,0,0,.9)"; ctx.beginPath(); ctx.ellipse(2, 6, 3.5, 2 + Math.abs(Math.sin(agora * 2)) * 1.5, 0, 0, 7); ctx.fill(); // boca
  if (olhos > .02) {
    luzCor(3, -2, 26, olhos * .55, olhosRgb);
    ctx.fillStyle = `rgba(${olhosRgb},${olhos})`; ctx.beginPath(); ctx.arc(-1, -3, 1.9, 0, 7); ctx.arc(6, -2, 1.9, 0, 7); ctx.fill();
  }
  ctx.restore();
  ctx.restore();
}

/* deitado na cama (de barriga para cima) e depois sentado na beira, com o quadril no colchão */
function deitaESenta(sen, beiraX, topo, hp, aro, cabeca) {
  if (sen < 1) { ctx.save(); ctx.globalAlpha = 1 - sen; ctx.translate(beiraX - hp * .03, topo - hp * .075); ctx.rotate(-PI / 2); pessoa(0, 0, hp, { aro }); ctx.restore(); }
  if (sen > 0) { ctx.save(); ctx.globalAlpha = sen; pessoa(beiraX - hp * .2, topo + hp * .27, hp, { sentado: true, cabeca, aro }); ctx.restore(); }
}

/* ---------- cenários novos ---------- */
function paredeHosp(chao, t) {
  ctx.fillStyle = "#0c1412"; ctx.fillRect(0, 0, W, chao);
  ctx.fillStyle = "#101a17"; ctx.fillRect(0, chao * .62, W, chao * .38);
  ctx.fillStyle = "#1a2522"; ctx.fillRect(0, chao * .62, W, 3);
  ctx.fillStyle = "#0a0f0e"; ctx.fillRect(0, chao, W, H - chao);
  ctx.fillStyle = "rgba(160,200,180,.05)"; for (let i = 0; i < 6; i++) ctx.fillRect(0, chao + 8 + i * 14, W, 1);
  ctx.strokeStyle = "rgba(160,200,180,.06)"; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(i * W / 8, chao); ctx.lineTo(i * W / 8 - W * .3, H); ctx.stroke(); }
  // manchas de umidade e tinta descascando
  for (let i = 0; i < 6; i++) { const x = cvRnd(i * 7) * W, y = chao * (.15 + cvRnd(i * 3) * .4), r = 14 + cvRnd(i) * 30;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, "rgba(40,30,20,.35)"); g.addColorStop(1, "rgba(40,30,20,0)"); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
    ctx.strokeStyle = "rgba(20,15,10,.4)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y + r * .4); ctx.lineTo(x + 2, y + r * 1.6); ctx.stroke(); }
  // corrimão na parede
  ctx.fillStyle = "#24302c"; ctx.fillRect(0, chao * .7, W, 4); ctx.fillStyle = "rgba(200,255,225,.08)"; ctx.fillRect(0, chao * .7, W, 1);
  for (let x = W * .08; x < W; x += W * .22) { ctx.fillStyle = "#1a2421"; ctx.fillRect(x, chao * .7, 3, 9); }
  // placa de saída piscando
  const sa = cvRnd(Math.floor(t * 3)) < .15 ? .15 : .8;
  ctx.fillStyle = `rgba(90,230,140,${sa})`; ctx.fillRect(W * .82, H * .07, W * .12, H * .022);
  ctx.fillStyle = "#06140c"; ctx.font = `800 ${Math.max(9, H * .016)}px "JetBrains Mono", monospace`; ctx.fillText("SAÍDA", W * .835, H * .088);
  luzCor(W * .88, H * .08, 40, .2 * sa, "90,230,140");
  // papéis e fios no chão
  ctx.fillStyle = "rgba(220,225,215,.14)"; for (let i = 0; i < 5; i++) { ctx.save(); ctx.translate(cvRnd(i * 11) * W, chao + 10 + cvRnd(i * 5) * (H - chao) * .5); ctx.rotate(cvRnd(i) * 3); ctx.fillRect(-7, -5, 14, 10); ctx.restore(); }
  // suporte de soro e cadeira de rodas abandonados no canto
  const sx = W * .93; ctx.strokeStyle = "#2a3532"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx, chao); ctx.lineTo(sx, chao - H * .2); ctx.moveTo(sx - 8, chao - H * .2); ctx.lineTo(sx + 8, chao - H * .2); ctx.moveTo(sx - 10, chao); ctx.lineTo(sx + 10, chao); ctx.stroke();
  ctx.fillStyle = "rgba(200,230,220,.18)"; ctx.fillRect(sx + 3, chao - H * .19, 8, 14);
  const cx = W * .02; ctx.strokeStyle = "#1f2926"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx + 20, chao - 16, 16, 0, 7); ctx.moveTo(cx + 6, chao - 38); ctx.lineTo(cx + 6, chao - 70); ctx.lineTo(cx + 14, chao - 70); ctx.moveTo(cx + 6, chao - 38); ctx.lineTo(cx + 40, chao - 38); ctx.stroke();
}
function lampadas(t, xs, y, cor = "200,255,225") {
  xs.forEach((x, i) => {
    const fl = cvRnd(Math.floor(t * 9) + i * 31) < .12 ? .08 : cvRnd(Math.floor(t * 2) + i) < .1 ? .35 : 1;
    ctx.fillStyle = `rgba(${cor},${.7 * fl})`; ctx.fillRect(x - 22, y, 44, 4);
    const g = ctx.createLinearGradient(0, y, 0, y + H * .5); g.addColorStop(0, `rgba(${cor},${.16 * fl})`); g.addColorStop(1, `rgba(${cor},0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - 22, y); ctx.lineTo(x + 22, y); ctx.lineTo(x + 90, y + H * .5); ctx.lineTo(x - 90, y + H * .5); ctx.fill();
  });
}
function carrinho(x, chao) {
  ctx.fillStyle = "#28302d"; ctx.fillRect(x - 30, chao - 46, 60, 6); ctx.fillRect(x - 30, chao - 18, 60, 5);
  ctx.fillRect(x - 28, chao - 46, 3, 40); ctx.fillRect(x + 25, chao - 46, 3, 40);
  ctx.fillStyle = "#050605"; [x - 24, x + 24].forEach(r => { ctx.beginPath(); ctx.arc(r, chao - 4, 4, 0, 7); ctx.fill(); });
  ctx.fillStyle = "rgba(220,230,220,.4)"; ctx.fillRect(x - 20, chao - 54, 10, 8); ctx.fillRect(x + 4, chao - 52, 6, 6);
}
function frestas(a = 1) { // vista de dentro do armário
  ctx.fillStyle = `rgba(2,2,3,${.97 * a})`;
  const n = 9, w = W / n;
  for (let i = 0; i < n; i++) ctx.fillRect(i * w, 0, w * .62, H);
  const g = ctx.createRadialGradient(W / 2, H * .4, H * .1, W / 2, H * .4, H * .7);
  g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, `rgba(0,0,0,${.9 * a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function paredeCasa(chao, t, papel = "#191512") {
  ctx.fillStyle = papel; ctx.fillRect(0, 0, W, chao);
  ctx.strokeStyle = "rgba(255,230,200,.035)"; ctx.lineWidth = 1;
  for (let x = 10; x < W; x += 24) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, chao); ctx.stroke(); }
  ctx.fillStyle = "#0e0b09"; ctx.fillRect(0, chao, W, H - chao);
  ctx.strokeStyle = "rgba(255,220,180,.03)"; ctx.lineWidth = 1; for (let y = chao + 12; y < H; y += 16) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.fillStyle = "#231c17"; ctx.fillRect(0, chao - 8, W, 8);
  for (let i = 0; i < 5; i++) { const x = cvRnd(i * 13 + 2) * W, r = 18 + cvRnd(i * 4) * 34;
    const g = ctx.createRadialGradient(x, 0, 0, x, 0, r * 2); g.addColorStop(0, "rgba(10,6,3,.5)"); g.addColorStop(1, "rgba(10,6,3,0)"); ctx.fillStyle = g; ctx.fillRect(x - r * 2, 0, r * 4, r * 2); }
  [[.1, .09, -.08], [.4, .07, .12]].forEach(([fx, fy, rot], i) => {
    ctx.save(); ctx.translate(W * fx, H * fy); ctx.rotate(rot + Math.sin(t * .7 + i) * .01);
    ctx.fillStyle = "#2a1f16"; ctx.fillRect(-W * .055, 0, W * .11, H * .075); ctx.fillStyle = "#3a3026"; ctx.fillRect(-W * .045, H * .007, W * .09, H * .06);
    ctx.fillStyle = "rgba(0,0,0,.55)"; ctx.beginPath(); ctx.arc(-W * .015, H * .03, H * .011, 0, 7); ctx.arc(W * .018, H * .032, H * .011, 0, 7); ctx.fill();
    ctx.restore(); });
  const rx = W * .94, ry = H * .06, ang = Math.sin(t * 3.1) * .35;
  ctx.fillStyle = "#231a12"; ctx.fillRect(rx - 14, ry, 28, H * .2); ctx.fillStyle = "#d9cfae"; ctx.beginPath(); ctx.arc(rx, ry + 16, 10, 0, 7); ctx.fill();
  ctx.strokeStyle = "#111"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(rx, ry + 16); ctx.lineTo(rx + 5, ry + 11); ctx.moveTo(rx, ry + 16); ctx.lineTo(rx, ry + 9); ctx.stroke();
  ctx.strokeStyle = "#8a6d24"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(rx, ry + 30); ctx.lineTo(rx + Math.sin(ang) * H * .1, ry + 30 + Math.cos(ang) * H * .1); ctx.stroke();
  ctx.fillStyle = "#8a6d24"; ctx.beginPath(); ctx.arc(rx + Math.sin(ang) * H * .1, ry + 30 + Math.cos(ang) * H * .1, 5, 0, 7); ctx.fill();
}
function porta(x, chao, w, h, ab = 0, cor = "#0f0c0a", luz = null) {
  ctx.fillStyle = "#050404"; ctx.fillRect(x, chao - h, w, h);
  if (luz) luzCor(x + w / 2, chao - h / 2, w * 1.3 * ab, .3 * ab, luz);
  ctx.fillStyle = cor; ctx.fillRect(x, chao - h, w * (1 - ab * .85), h);
  ctx.fillStyle = "rgba(200,180,140,.25)"; ctx.beginPath(); ctx.arc(x + w * (1 - ab * .85) - 9, chao - h * .48, 3, 0, 7); ctx.fill();
}

Object.assign(CINE, {
  /* ===== ALA 4 ===== */
  quartoHosp: { dur: 6.5, f(t, p) {
    const chao = H * .6; paredeHosp(chao, t); lampadas(t, [W * .3], H * .05);
    // porta com janelinha
    const dx = W * .66, dw = W * .26;
    ctx.fillStyle = "#16201d"; ctx.fillRect(dx, chao - H * .32, dw, H * .32);
    ctx.fillStyle = "#050807"; ctx.fillRect(dx + dw * .3, chao - H * .27, dw * .4, H * .07);
    const pas = cvSeg(t, 3, 5.2);
    if (pas > 0 && pas < 1) { ctx.save(); ctx.beginPath(); ctx.rect(dx + dw * .3, chao - H * .27, dw * .4, H * .07); ctx.clip(); luzCor(dx + dw * (.2 + pas * .6), chao - H * .23, 40, .6, "255,230,190"); monstro(dx + dw * (pas * 1.2 - .1), chao - H * .02, H * .4, { olhos: .3, touca: true, cabeca: .9 }); ctx.restore(); }
    // cama
    ctx.fillStyle = "#1f2a27"; ctx.fillRect(W * .06, chao - H * .1, W * .5, H * .035); ctx.fillRect(W * .07, chao - H * .065, 5, H * .065); ctx.fillRect(W * .53, chao - H * .065, 5, H * .065);
    ctx.fillStyle = "#2c3a36"; ctx.fillRect(W * .06, chao - H * .14, 8, H * .08);
    const sen = cvSuave(cvSeg(t, 1, 2.4));
    if (p.vazia) return;
    deitaESenta(sen, W * .56, chao - H * .1, H * .2, "rgba(150,220,190,.25)", t > 3 ? 1 : 0);
  } },
  corredorHosp: { dur: 6.5, f(t, p) {
    const chao = H * .58, m = p.m || "nada";
    paredeHosp(chao, t); lampadas(t, [W * .15, W * .5, W * .85], H * .04);
    for (let i = 0; i < 3; i++) { const x = W * (.05 + i * .34); ctx.fillStyle = "#121b18"; ctx.fillRect(x, chao - H * .3, W * .16, H * .3); ctx.fillStyle = "rgba(140,200,170,.08)"; ctx.fillRect(x + W * .04, chao - H * .26, W * .08, H * .05); ctx.fillStyle = "rgba(220,230,220,.25)"; ctx.font = `600 ${Math.min(13, W * .03)}px "JetBrains Mono", monospace`; ctx.fillText(String(41 + i), x + 4, chao - H * .31); }
    ctx.fillStyle = "rgba(143,227,176,.5)"; ctx.font = `600 ${Math.min(12, W * .03)}px "JetBrains Mono", monospace`; ctx.fillText("← NECROTÉRIO   ELEVADOR →", W * .2, H * .13);
    let mx = null, md = 1, man = 0, olhos = .5;
    if (m === "passa") { const k = cvSeg(t, .5, 6.3); mx = cvMix(-W * .2, W * 1.2, k); man = k > 0 && k < 1 ? .6 : 0; }
    if (m === "costas") { mx = W * .82; md = 1; olhos = 0; }
    if (m === "vem") { const k = cvSuave(cvSeg(t, .4, 5)); mx = cvMix(W * 1.2, W * .62, k); md = -1; man = k > 0 && k < 1 ? .8 : 0; olhos = .9; }
    if (m === "olha") { mx = W * .7; md = -1; olhos = cvSeg(t, 1, 2); }
    if (mx !== null && !ameaca) { monstro(mx, chao, H * .36, { fase: t * 3, anda: man, dir: md, olhos, touca: true }); if (p.carrinho !== false) carrinho(mx + md * W * .14, chao); }
    if (p.eu) { const k = cvSuave(cvSeg(t, .3, 3.5)), x = cvMix(-W * .05, W * .25, k); pessoa(x, chao + 4, H * .24, { fase: passo(x, H * .24), anda: k > 0 && k < 1 ? .8 : 0, aro: "rgba(150,220,190,.25)" }); }
  } },
  debaixoCama: { dur: 6.5, f(t, p) {
    const chao = H * .64;
    ctx.fillStyle = "#070a09"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = p.casa ? "#140f0c" : "#0d1311"; ctx.fillRect(0, H * .3, W, chao - H * .3);
    luzCor(W * .7, H * .34, W * .5, .15, p.casa ? "255,200,140" : "200,255,225");
    ctx.fillStyle = p.casa ? "#0e0b09" : "#0a0f0d"; ctx.fillRect(0, chao, W, H);
    // pés compridos entrando
    const ent = cvSuave(cvSeg(t, .8, 3)), sai = p.sai ? cvSuave(cvSeg(t, 4.8, 6.4)) : 0;
    const x = cvMix(W * 1.2, W * .55, ent) + sai * W * .8, f = t * 3;
    if (!ameaca) [-1, 1].forEach(k => {
      const fx = x + k * 16 + Math.sin(f + (k > 0 ? 0 : PI)) * 10 * (ent < 1 || sai > 0 ? 1 : 0);
      ctx.strokeStyle = "#010101"; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(fx + 4, H * .3); ctx.lineTo(fx, chao - 6); ctx.lineTo(fx - 34, chao - 2); ctx.stroke();
    });
    // estrado da cama (moldura)
    ctx.fillStyle = "#020303"; ctx.fillRect(0, 0, W, H * .3); ctx.fillRect(0, H * .29, W, 8);
    ctx.fillRect(0, 0, W * .05, H); ctx.fillRect(W * .95, 0, W * .05, H);
    ctx.fillStyle = "#010101"; ctx.fillRect(0, chao + H * .05, W, H);
    pessoa(W * .25, chao + H * .045, H * .12, { inclina: -1.5, cor: "#030404", aro: "rgba(150,220,190,.15)" });
  } },
  salaEnf: { dur: 6, f(t, p) {
    const chao = H * .6; paredeHosp(chao, t); lampadas(t, [W * .5], H * .04);
    ctx.fillStyle = "#18221f"; ctx.fillRect(W * .08, H * .12, W * .36, H * .22);
    for (let i = 0; i < 5; i++) { ctx.fillStyle = "rgba(220,230,210,.3)"; ctx.fillRect(W * .1 + i * W * .065, H * .15, W * .05, H * .06 + (i % 2) * 10); }
    ctx.fillStyle = "#1d2522"; ctx.fillRect(W * .45, chao - H * .1, W * .48, H * .025); ctx.fillRect(W * .47, chao - H * .075, 5, H * .075); ctx.fillRect(W * .9, chao - H * .075, 5, H * .075);
    const r = p.radioOff ? 0 : .6 + .4 * Math.sin(t * 6);
    ctx.fillStyle = "#2c241a"; ctx.fillRect(W * .74, chao - H * .14, W * .12, H * .04);
    ctx.fillStyle = `rgba(255,180,80,${r})`; ctx.fillRect(W * .76, chao - H * .13, 6, 6); luzCor(W * .77, chao - H * .125, 30, r * .5, "255,180,80");
    const k = cvSuave(cvSeg(t, .3, 3.2)), x = cvMix(-W * .05, W * .58, k);
    pessoa(x, chao, H * .26, { fase: passo(x, H * .26), anda: k > 0 && k < 1 ? .8 : 0, aro: "rgba(150,220,190,.25)" });
  } },
  elevador: { dur: 6, f(t, p) {
    const chao = H * .6; paredeHosp(chao, t); lampadas(t, [W * .3, W * .8], H * .04);
    const ex = W * .5, ew = W * .34, eh = H * .34;
    ctx.fillStyle = "#1a2320"; ctx.fillRect(ex - ew / 2 - 8, chao - eh - 8, ew + 16, eh + 8);
    const ab = p.sobe ? 1 - cvSuave(cvSeg(t, .5, 3)) : p.abre ? cvSuave(cvSeg(t, 1, 2.5)) : 0;
    ctx.fillStyle = "rgba(220,240,230,.3)"; ctx.fillRect(ex - ew / 2, chao - eh, ew, eh);
    ctx.fillStyle = "#2a3632"; ctx.fillRect(ex - ew / 2, chao - eh, ew / 2 * (1 - ab), eh); ctx.fillRect(ex + ew / 2 * ab, chao - eh, ew / 2 * (1 - ab), eh);
    if (p.sobe && t > 2.2 && t < 4.5) { const d = cvSeg(t, 2.2, 3); ctx.strokeStyle = "#020202"; ctx.lineWidth = 5; ctx.lineCap = "round"; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(ex - 2, chao - eh * (.55 + i * .06)); ctx.lineTo(ex - 2 - 30 * d, chao - eh * (.53 + i * .06)); ctx.stroke(); } }
    const pl = p.luz ? .9 : .25 + .2 * Math.sin(t * 4);
    ctx.fillStyle = `rgba(255,120,90,${pl})`; ctx.fillRect(ex + ew / 2 + 14, chao - eh * .6, 10, 16);
    if (!p.sobe) { const k = cvSuave(cvSeg(t, .3, 3)), x = cvMix(-W * .05, W * .25, k); pessoa(x, chao + 4, H * .26, { fase: passo(x, H * .26), anda: k > 0 && k < 1 ? .8 : 0, aro: "rgba(150,220,190,.25)" }); }
    else pessoa(ex, chao - 4, H * .26, { aro: "rgba(220,240,230,.35)" });
  } },
  necroterio: { dur: 6.5, f(t, p) {
    const chao = H * .6;
    ctx.fillStyle = "#090d0d"; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "#0c1111"; ctx.fillRect(0, chao, W, H);
    lampadas(t, [W * .5], H * .03, "190,230,240");
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
      const x = W * (.06 + c * .23), y = H * (.12 + r * .14);
      ctx.fillStyle = "#1c2425"; ctx.fillRect(x, y, W * .2, H * .12); ctx.fillStyle = "#2c3637"; ctx.fillRect(x + W * .08, y + H * .05, W * .04, 5);
      ctx.fillStyle = "rgba(230,230,220,.35)"; ctx.fillRect(x + W * .02, y + H * .015, W * .05, H * .014);
      ctx.fillStyle = "rgba(0,0,0,.6)"; ctx.font = `600 ${Math.max(7, H * .009)}px "JetBrains Mono", monospace`; ctx.fillText(String(40 + r * 4 + c), x + W * .025, y + H * .026);
    }
    ctx.fillStyle = "#050707"; ctx.beginPath(); ctx.ellipse(W * .7, chao + H * .06, 18, 5, 0, 0, 7); ctx.fill();
    const gt = (t * .9) % 1; ctx.fillStyle = "rgba(190,230,240,.6)"; ctx.fillRect(W * .7, H * .05 + gt * (chao - H * .02), 2, 5);
    if (gt > .95) { ctx.strokeStyle = "rgba(190,230,240,.4)"; ctx.beginPath(); ctx.ellipse(W * .7, chao + H * .06, 10 + (gt - .95) * 300, 3, 0, 0, 7); ctx.stroke(); }
    const ab = cvSuave(cvSeg(t, 2.5, 4.5)) * (p.aberta !== false ? 1 : 0);
    if (ab > 0) { const x = W * .52, y = H * .26; ctx.fillStyle = "#26302f"; ctx.fillRect(x, y, W * .2 + ab * W * .25, H * .12); ctx.fillStyle = "rgba(220,225,220,.55)"; ctx.beginPath(); ctx.ellipse(x + W * .16 + ab * W * .2, y + H * .05, W * .14, H * .03, 0, 0, 7); ctx.fill(); }
    const k = cvSuave(cvSeg(t, .3, 3.4)), x = cvMix(-W * .05, W * .32, k);
    pessoa(x, chao, H * .26, { fase: passo(x, H * .26), anda: k > 0 && k < 1 ? .8 : 0, luz: true, aro: "rgba(190,230,240,.25)" });
  } },
  armario: { dur: 7, f(t, p) {
    const chao = H * .62;
    if (p.casa) paredeCasa(chao, t); else { paredeHosp(chao, t); lampadas(t, [W * .5], H * .04); }
    const ent = cvSuave(cvSeg(t, 1, 3.4)), x = cvMix(W * 1.15, W * .5, ent);
    const procura = t > 3.4 ? Math.sin((t - 3.4) * 1.3) : 0;
    if (!ameaca) monstro(x + procura * W * .12, chao, H * .44, { fase: t * 3, anda: ent < 1 ? .6 : .15, dir: procura > 0 ? 1 : -1, olhos: .8, touca: !p.casa, quatro: false, cabeca: .5 + procura * .3 });
    if (p.casa) { ctx.fillStyle = "#1c1612"; ctx.fillRect(W * .05, chao - H * .1, W * .35, H * .04); }
    frestas(1);
  } },

  /* ===== O INQUILINO ===== */
  quartoCasa: { dur: 6.5, f(t, p) {
    const chao = H * .6; paredeCasa(chao, t);
    // janela com lua
    ctx.fillStyle = "#0a0d14"; ctx.fillRect(W * .62, H * .1, W * .26, H * .2); luzCor(W * .75, H * .17, 50, .2, "190,200,230");
    ctx.strokeStyle = "#2a211a"; ctx.lineWidth = 5; ctx.strokeRect(W * .62, H * .1, W * .26, H * .2);
    if (p.rosto && t > 3) { const a = cvSeg(t, 3, 3.6) * (1 - cvSeg(t, 5, 5.4)); ctx.save(); ctx.globalAlpha = a; monstro(W * .75, H * .38, H * .3, { olhos: 1, cabeca: 0 }); ctx.restore(); }
    // abajur
    const ab = .7 + .3 * Math.sin(t * 5) * (cvRnd(Math.floor(t * 6)) < .2 ? 1 : 0);
    ctx.fillStyle = "#3a2c1c"; ctx.fillRect(W * .07, chao - H * .14, 26, 18); luzCor(W * .07 + 13, chao - H * .14, H * .28, .35 * ab, "255,200,130");
    // cama
    ctx.fillStyle = "#3b2d22"; ctx.fillRect(W * .16, chao - H * .075, W * .44, H * .04);
    ctx.fillStyle = "#2a2018"; ctx.fillRect(W * .17, chao - H * .035, 6, H * .035); ctx.fillRect(W * .58, chao - H * .035, 6, H * .035);
    ctx.fillStyle = "#4d3b2c"; ctx.fillRect(W * .15, chao - H * .17, 12, H * .17); ctx.fillRect(W * .15, chao - H * .17, W * .04, 6);
    ctx.fillStyle = "#6b5a49"; ctx.fillRect(W * .18, chao - H * .1, W * .42, H * .028);
    ctx.fillStyle = "#8a7864"; ctx.beginPath(); ctx.ellipse(W * .23, chao - H * .108, W * .045, H * .012, 0, 0, 7); ctx.fill();
    ctx.fillStyle = "rgba(120,100,80,.6)"; ctx.fillRect(W * .34, chao - H * .1, W * .26, H * .05);
    const sen = cvSuave(cvSeg(t, 1.2, 2.6));
    deitaESenta(sen, W * .58, chao - H * .1, H * .19, "rgba(255,200,130,.28)", sen > .5 ? 1 : 0);
    // algo andando dentro da parede (arranhões que se movem)
    const ax = ((t * .12) % 1) * W * 1.2 - W * .1;
    ctx.strokeStyle = "rgba(0,0,0,.55)"; ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(ax + i * 6, H * .36 + Math.sin(t * 9 + i) * 6); ctx.lineTo(ax + i * 6 - 14, H * .44 + Math.sin(t * 8 + i) * 6); ctx.stroke(); }
    ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(ax, H * .4, 30, 46, 0, 0, 7); ctx.fill();
  } },
  cozinha: { dur: 7, f(t, p) {
    const chao = H * .6; paredeCasa(chao, t, "#15130f");
    luzCor(W * .3, H * .1, W * .4, .14 + .05 * Math.sin(t * 9), "255,210,150");
    ctx.fillStyle = "#e9e4d8"; ctx.fillRect(W * .3 - 3, H * .04, 6, 8);
    ctx.fillStyle = "#211b16"; ctx.fillRect(W * .05, chao - H * .12, W * .4, H * .035); ctx.fillRect(W * .07, chao - H * .085, 5, H * .085); ctx.fillRect(W * .42, chao - H * .085, 5, H * .085);
    ctx.fillStyle = "#1a1511"; ctx.fillRect(W * .5, chao - H * .2, W * .16, H * .2); ctx.fillStyle = "#2a221b"; ctx.fillRect(W * .5, chao - H * .2, W * .16, 6);
    // porta do porão, aberta, escada descendo
    const px = W * .72, pw = W * .22, ph = H * .32;
    ctx.fillStyle = "#020202"; ctx.fillRect(px, chao - ph, pw, ph);
    ctx.strokeStyle = "#1a1410"; ctx.lineWidth = 3; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(px + 6, chao - ph * .2 + i * 14); ctx.lineTo(px + pw - 6, chao - ph * .2 + i * 14); ctx.stroke(); }
    ctx.fillStyle = "#14100c"; ctx.fillRect(px - 6, chao - ph - 6, 6, ph + 6); ctx.fillRect(px + pw, chao - ph - 6, 6, ph + 6);
    const sobe = p.sobe !== false ? cvSuave(cvSeg(t, 2, 5.5)) : 0;
    if (sobe > 0) { ctx.save(); ctx.beginPath(); ctx.rect(px, chao - ph, pw, ph); ctx.clip(); monstro(px + pw / 2, chao + H * .3 * (1 - sobe), H * .4, { olhos: sobe, cabeca: .2, quatro: false }); ctx.restore(); }
    if (p.mesa) { pessoa(W * .25, chao - H * .01, H * .12, { inclina: -.4, sentado: true, aro: "rgba(255,200,130,.2)" }); ctx.fillStyle = "rgba(60,40,30,.85)"; ctx.fillRect(W * .05, chao - H * .12, W * .4, H * .07); }
    else { const k = cvSuave(cvSeg(t, .2, 2)), x = cvMix(-W * .05, W * .3, k); pessoa(x, chao, H * .25, { fase: passo(x, H * .25), anda: k > 0 && k < 1 ? .8 : 0, aro: "rgba(255,200,130,.25)", cabeca: t > 2.5 ? 1 : 0 }); }
  } },
  corredorCasa: { dur: 6.5, f(t, p) {
    const chao = H * .6; paredeCasa(chao, t);
    luzCor(W * .5, H * .05, W * .6, .12, "255,200,130");
    for (let i = 0; i < 4; i++) porta(W * (.04 + i * .25), chao, W * .16, H * .3, 0);
    ctx.fillStyle = "#2a211a"; for (let i = 0; i < 3; i++) ctx.fillRect(W * (.22 + i * .25), H * .14, W * .05, H * .07);
    if (p.m === "costas" && !ameaca) monstro(W * .62, chao, H * .4, { dir: -1, olhos: 0, cabeca: 1.1 });
    if (p.m === "teto") { const k = cvSeg(t, 1, 5); ctx.save(); ctx.translate(cvMix(W * 1.1, W * .4, k), H * .04); ctx.scale(1, -1); monstro(0, 0, H * .3, { quatro: true, fase: t * 4, anda: .8, dir: -1, olhos: .8 }); ctx.restore(); }
    if (p.eu !== false) { const k = cvSuave(cvSeg(t, .3, 3)), x = cvMix(-W * .05, W * .18, k); pessoa(x, chao + 4, H * .25, { fase: passo(x, H * .25), anda: k > 0 && k < 1 ? .7 : 0, aro: "rgba(255,200,130,.25)" }); }
  } },
  porao: { dur: 7, f(t, p) {
    const chao = H * .62;
    ctx.fillStyle = "#0b0908"; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "#120f0c"; ctx.fillRect(0, chao, W, H);
    for (let i = 0; i < 8; i++) { ctx.fillStyle = "#16120e"; ctx.fillRect(i * W * .14, 0, W * .1, H * .05); }
    // escada
    ctx.strokeStyle = "#2a2118"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(W * .02, H * .05);
    for (let i = 0; i < 9; i++) { ctx.lineTo(W * (.02 + i * .045), H * .05 + i * (chao - H * .05) / 9); ctx.lineTo(W * (.065 + i * .045), H * .05 + i * (chao - H * .05) / 9); }
    ctx.stroke();
    // lâmpada pendurada
    const bx = W * .6 + Math.sin(t * 1.1) * 10, acesa = p.luz ? cvSeg(t, 2, 2.6) : 0;
    ctx.strokeStyle = "#3a2e22"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(W * .6, 0); ctx.lineTo(bx, H * .2); ctx.stroke();
    ctx.fillStyle = acesa ? `rgba(255,220,150,${.6 + .4 * acesa})` : "#2a2520"; ctx.beginPath(); ctx.arc(bx, H * .21, 6, 0, 7); ctx.fill();
    if (acesa) luzCor(bx, H * .22, H * .5 * acesa, .45 * acesa, "255,210,140");
    ctx.fillStyle = "#2a231c"; ctx.fillRect(W * .55, chao - H * .03, W * .35, H * .03);
    ctx.fillStyle = "#4a2a1e"; ctx.fillRect(W * .62, chao - H * .055, 14, 14); ctx.fillStyle = "#2a3a4a"; ctx.fillRect(W * .8, chao - H * .05, 18, 12);
    ctx.fillStyle = "#1c1814"; ctx.fillRect(W * .2, chao - H * .2, W * .14, H * .2);
    const k = cvSuave(cvSeg(t, .3, 3.6)), u = Math.min(8, k * 8);
    const x = W * (.04 + u * .045), y = H * .05 + u * (chao - H * .05) / 9 + (k >= 1 ? (chao - (H * .05 + 8 * (chao - H * .05) / 9)) : 0);
    pessoa(Math.min(x + (k >= 1 ? W * .06 : 0), W * .45), Math.min(y, chao), H * .25, { fase: u * 3, anda: k > 0 && k < 1 ? .8 : 0, subir: 1, luz: !p.luz, aro: "rgba(255,200,130,.25)" });
    if (p.atras && !ameaca) { const a = cvSeg(t, 4.5, 5.5); monstro(W * .12, chao * (.3 + .7 * a), H * .38, { olhos: a, dir: 1, cabeca: .6 }); }
    if (!acesa) { const g = ctx.createRadialGradient(x + W * .1, y - H * .1, 20, x, y, W * .9); g.addColorStop(0, "rgba(3,2,2,0)"); g.addColorStop(1, "rgba(3,2,2,.85)"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
  } },
  casaFora: { dur: 6, f(t, p) {
    const chao = H * .62, manha = !!p.manha;
    const g = ctx.createLinearGradient(0, 0, 0, chao); g.addColorStop(0, manha ? "#36405a" : "#05070b"); g.addColorStop(1, manha ? "#b08a78" : "#121620");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, chao); ctx.fillStyle = "#0a0908"; ctx.fillRect(0, chao, W, H);
    const hx = W * .2, hw = W * .6, hh = H * .2;
    ctx.fillStyle = "#0e0c0b"; ctx.fillRect(hx, chao - hh, hw, hh);
    ctx.beginPath(); ctx.moveTo(hx - 16, chao - hh); ctx.lineTo(hx + hw / 2, chao - hh - H * .12); ctx.lineTo(hx + hw + 16, chao - hh); ctx.fill();
    [[.12, .3], [.6, .3], [.12, .65], [.6, .65]].forEach(([fx, fy], i) => {
      const on = p.janelas ? cvSeg(t, 1 + i * .6, 1.3 + i * .6) : (i === 0 ? .8 : 0);
      ctx.fillStyle = on ? `rgba(255,200,120,${.75 * on})` : "#060505"; ctx.fillRect(hx + hw * fx, chao - hh + hh * fy - 10, hw * .22, hh * .22);
      if (on && p.janelas) monstro(hx + hw * (fx + .11), chao - hh + hh * fy + 14, hh * .3, { olhos: on, cor: "#020101" });
    });
    ctx.fillStyle = "#050404"; ctx.fillRect(hx + hw * .42, chao - hh * .5, hw * .16, hh * .5);
    const k = cvSuave(cvSeg(t, .4, 4)), x = cvMix(hx + hw * .5, W * 1.05, p.sai ? k : 0);
    pessoa(p.sai ? x : W * .1 + k * W * .25, chao + 6, H * .24, { fase: passo(k * W, H * .24), anda: k > 0 && k < 1 ? .9 : 0, dir: 1, luz: !manha });
  } },
});

/* ---------- poeira no ar e granulado de filme ---------- */
const poeira = Array.from({ length: 28 }, (_, i) => ({ x: Math.random(), y: Math.random(), v: .004 + Math.random() * .01, r: .6 + Math.random() * 1.4, f: Math.random() * 6 }));
const grao = document.createElement("canvas"); grao.width = grao.height = 96;
const gctx = grao.getContext("2d"), gimg = gctx.createImageData(96, 96);
let gPadrao = null, gQuadro = 0;
function detalhesFilme(now) {
  const t = now / 1000;
  for (const p of poeira) {
    p.y -= p.v * .016; p.x += Math.sin(t * .4 + p.f) * .0004;
    if (p.y < -.02) { p.y = 1.02; p.x = Math.random(); }
    const a = .08 + .12 * (.5 + .5 * Math.sin(t * 1.3 + p.f));
    ctx.fillStyle = `rgba(220,225,235,${a})`; ctx.beginPath(); ctx.arc(p.x * W, p.y * H, p.r, 0, 7); ctx.fill();
  }
  if (++gQuadro % 3 === 0 || !gPadrao) {
    const d = gimg.data;
    for (let i = 0; i < d.length; i += 4) { const v = Math.random() * 255 | 0; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
    gctx.putImageData(gimg, 0, 0); gPadrao = ctx.createPattern(grao, "repeat");
  }
  ctx.save(); ctx.globalAlpha = .045; ctx.fillStyle = gPadrao; ctx.translate(Math.random() * 96, Math.random() * 96); ctx.fillRect(-96, -96, W + 192, H + 192); ctx.restore();
  // vinheta de lente nos cantos
  const v = ctx.createRadialGradient(W / 2, H * .4, Math.min(W, H) * .35, W / 2, H * .4, Math.max(W, H) * .75);
  v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,.45)"); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
}

/* ---------- ameaça (minijogos esconder/avançar), susto e eventos ---------- */
let ameaca = null, susto = 0, evento = null, proxEvento = 0;
function desenhaAmeaca(now) {
  const a = ameaca; if (!a) return;
  const chao = H * .6, t = now / 1000;
  if (a.tipo === "esconder") {
    const x = W * (.5 + .38 * Math.sin(a.passo * .35)), dir = Math.cos(a.passo * .35) > 0 ? 1 : -1;
    const olhando = a.estado === "olha", aviso = a.estado === "aviso";
    if (a.pes) { // visto de baixo da cama/mesa: só os pés andando e parando
      const fx0 = x, chaoP = H * .64, f = a.passo * 6;
      [-1, 1].forEach(k => { const fx = fx0 + k * 16 + (a.estado === "anda" ? Math.sin(f + (k > 0 ? 0 : PI)) * 10 : 0);
        ctx.strokeStyle = "#010101"; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(fx + 4, H * .3); ctx.lineTo(fx, chaoP - 6); ctx.lineTo(fx - 34 * dir, chaoP - 2); ctx.stroke(); });
      if (olhando) { const g = ctx.createRadialGradient(W / 2, H * .5, 10, W / 2, H * .5, W); g.addColorStop(0, "rgba(255,235,210,.22)"); g.addColorStop(1, "rgba(255,235,210,0)"); ctx.fillStyle = g; ctx.fillRect(0, H * .3, W, H * .4);
        ctx.save(); ctx.translate(x, H * .3); monstro(0, H * .3, H * .3, { olhos: 1, cabeca: -1.2, dir: -1 }); ctx.restore(); }
      ctx.fillStyle = "#020303"; ctx.fillRect(0, 0, W, H * .3); ctx.fillRect(0, H * .29, W, 8);
      if (olhando && !a.escondido) { ctx.fillStyle = "rgba(226,72,61,.25)"; ctx.fillRect(0, 0, W, H); }
      return;
    }
    if (olhando) { const g = ctx.createLinearGradient(x, chao - H * .3, W / 2, H); g.addColorStop(0, "rgba(255,235,210,.3)"); g.addColorStop(1, "rgba(255,235,210,0)"); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - 6, chao - H * .32); ctx.lineTo(x + 6, chao - H * .32); ctx.lineTo(W * .9, H); ctx.lineTo(W * .1, H); ctx.fill(); }
    monstro(x, chao, H * .42, { fase: a.passo * 2, anda: a.estado === "anda" ? .6 : .05, dir: olhando ? -1 : dir, olhos: olhando ? 1 : aviso ? .5 + .5 * Math.sin(t * 30) : .25, touca: a.touca, cabeca: olhando ? 0 : .5, quatro: a.quatro, cor: a.cor, aro: a.aro, olhosRgb: a.olhosRgb });
    if (a.escondido) frestas(.85);
    if (olhando && !a.escondido) { ctx.fillStyle = "rgba(226,72,61,.25)"; ctx.fillRect(0, 0, W, H); }
  }
  if (a.tipo === "avancar") {
    const mx = W * .78, olhando = a.estado === "olha", aviso = a.estado === "aviso";
    monstro(mx, chao - H * .02, H * .34, { dir: olhando ? -1 : 1, olhos: olhando ? 1 : aviso ? .4 : 0, cabeca: olhando ? 0 : aviso ? .9 + Math.sin(t * 25) * .2 : 1.1, touca: a.touca, quatro: a.quatro, cor: a.cor, aro: a.aro, olhosRgb: a.olhosRgb });
    const px = cvMix(W * .06, W * .62, a.prog);
    pessoa(px, chao + 6, H * .24, { fase: a.prog * 30, anda: a.andando > now ? .7 : 0, inclina: .15 });
    if (olhando) { const g = ctx.createRadialGradient(mx, chao - H * .3, 10, mx, chao - H * .3, W); g.addColorStop(0, "rgba(255,235,210,.18)"); g.addColorStop(1, "rgba(255,235,210,0)"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
  }
}
function desenhaSusto(now) {
  if (!susto) return;
  const d = (now - susto) / 1000;
  if (d > .45) { susto = 0; return; }
  const a = d < .05 ? d / .05 : 1 - (d - .05) / .4;
  ctx.fillStyle = `rgba(0,0,0,${a})`; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = a; ctx.translate(W / 2 + (Math.random() - .5) * 18, H * .34 + (Math.random() - .5) * 18);
  const r = Math.min(W, H) * .42;
  ctx.fillStyle = "#cfc9bd"; ctx.beginPath(); ctx.ellipse(0, 0, r * .62, r, 0, 0, 7); ctx.fill();
  ctx.fillStyle = "#000"; ctx.beginPath(); ctx.ellipse(-r * .24, -r * .18, r * .14, r * .2, -.2, 0, 7); ctx.ellipse(r * .24, -r * .18, r * .14, r * .2, .2, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.ellipse(0, r * .42, r * .2, r * .32, 0, 0, 7); ctx.fill();
  luzCor(-r * .24, -r * .18, r * .1, .9, "255,60,40"); luzCor(r * .24, -r * .18, r * .1, .9, "255,60,40");
  ctx.restore();
}
function desenhaEvento(now, ativo) {
  if (!ativo) { evento = null; return; }
  if (!proxEvento) proxEvento = now + 15000 + Math.random() * 10000;
  if (!evento && now > proxEvento) {
    const tipos = ["piscar", "olhos", "olhos"];
    evento = { tipo: tipos[Math.floor(Math.random() * tipos.length)], t0: now, lado: Math.random() < .5 ? -1 : 1, y: H * (.2 + Math.random() * .3) };
    if (evento.tipo !== "piscar" && Math.random() < .6) tocar("sussurro");
    proxEvento = now + 20000 + Math.random() * 15000;
  }
  if (!evento) return;
  const d = (now - evento.t0) / 1000;
  if (evento.tipo === "piscar") { if (d < .09 || (d > .18 && d < .26)) { ctx.fillStyle = "rgba(0,0,0,.92)"; ctx.fillRect(0, 0, W, H); } if (d > .3) evento = null; }
  if (!evento) return;
  if (evento.tipo === "sombra") { const k = d / 1.1, x = evento.lado > 0 ? cvMix(-W * .2, W * 1.2, k) : cvMix(W * 1.2, -W * .2, k); ctx.save(); ctx.globalAlpha = .55; monstro(x, H * .6, H * .45, { fase: d * 9, anda: 1, dir: evento.lado, olhos: .3 }); ctx.restore(); if (k > 1) evento = null; }
  if (!evento) return;
  if (evento.tipo === "olhos") { const a = Math.sin(Math.min(1, d / 1.8) * PI); olhosNoEscuro(evento.lado > 0 ? W * .9 : W * .1, evento.y, a, now / 1000); if (d > 1.8) evento = null; }
}
