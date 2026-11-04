/* ============================================================
   ÚLTIMO ÔNIBUS: animações refeitas com mais detalhe
   (ônibus com rodas girando, suspensão, porta sanfonada,
    motorista, faróis na chuva, reflexo no asfalto molhado,
    relâmpagos, balanço dentro do ônibus e paisagem passando)
   ============================================================ */

// relâmpago de tempos em tempos (determinístico pelo tempo da cena)
function relampago(t, periodo = 9, fase = 3.3) {
  const k = (t + fase) % periodo;
  if (k < .08) return .55; if (k > .16 && k < .22) return .35; if (k < .5) return Math.max(0, .15 - (k - .22));
  return 0;
}
function gotasNoFarol(x, y, comp, abre, t, n = 28) { // pingos de chuva iluminados dentro do facho
  ctx.strokeStyle = "rgba(255,250,230,.55)"; ctx.lineWidth = 1.2; ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const u = cvRnd(i * 7.1), dx = u * comp, larg = (abre * .2 + dx * abre / comp) ;
    const yy = y + (((t * 380 + i * 61) % (larg * 2 + 40)) - larg - 20);
    if (Math.abs(yy - y) > larg) continue;
    ctx.moveTo(x + dx, yy); ctx.lineTo(x + dx - 2.5, yy + 9);
  }
  ctx.stroke();
}

/* ---------- o ônibus visto de lado ---------- */
function onibus(x, y, w, h, t, o = {}) { // x = frente do ônibus (lado direito), y = chão
  t = Math.max(0, t);
  const x0 = x - w, bal = o.balanco || 0, giro = o.giro ?? t * 2, chuva = o.chuva !== false;
  ctx.save(); ctx.translate(0, bal);
  const topo = y - h, base = y - h * .14;
  // farol: facho comprido para frente, com chuva dentro
  if (o.farol !== false) {
    const fy = y - h * .24, comp = h * 3.2;
    const g = ctx.createLinearGradient(x, 0, x + comp, 0); g.addColorStop(0, "rgba(255,245,215,.34)"); g.addColorStop(1, "rgba(255,245,215,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, fy - 4); ctx.lineTo(x + comp, fy - h * .55); ctx.lineTo(x + comp, fy + h * .5); ctx.lineTo(x, fy + 4); ctx.fill();
    if (chuva) gotasNoFarol(x + 6, fy, comp * .8, h * .5, t);
  }
  // carroceria em duas cores
  ctx.fillStyle = "#1a241d"; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x0, topo, w, h - h * .14, [h * .12, h * .2, 6, 6]) : ctx.rect(x0, topo, w, h - h * .14); ctx.fill();
  ctx.fillStyle = "#24331f"; ctx.fillRect(x0 + 4, topo + h * .02, w - 8, h * .05); // teto mais claro
  ctx.fillStyle = "#6a5a2a"; ctx.fillRect(x0, y - h * .4, w, h * .05); // faixa amarela desbotada
  ctx.fillStyle = "#0f1511"; ctx.fillRect(x0, y - h * .32, w, h * .04);
  // ferrugem escorrendo embaixo das janelas
  ctx.fillStyle = "rgba(110,60,30,.35)"; for (let i = 0; i < 9; i++) { const rx = x0 + w * (.06 + i * .1) + cvRnd(i) * 10; ctx.fillRect(rx, y - h * .44, 2, h * (.05 + cvRnd(i * 3) * .1)); }
  // janelas com luz verde de dentro, passageiros e água escorrendo
  const flick = cvRnd(Math.floor(t * 9)) < .06 ? .25 : 1, nj = 7, jy = topo + h * .12, jh = h * .36;
  for (let i = 0; i < nj; i++) {
    const wx = x0 + w * .04 + i * (w * .76) / nj, ww = (w * .76) / nj - 6;
    ctx.fillStyle = `rgba(150,220,150,${.24 * flick})`; ctx.fillRect(wx, jy, ww, jh);
    ctx.fillStyle = `rgba(200,255,200,${.08 * flick})`; ctx.fillRect(wx, jy, ww, jh * .3);
    if (o.passageiros && i % 3 !== 1) { ctx.fillStyle = "#070a08"; ctx.beginPath(); ctx.arc(wx + ww * .5, jy + jh * .55, h * .065, 0, 7); ctx.fill(); ctx.fillRect(wx + ww * .25, jy + jh * .68, ww * .5, jh * .4); }
    if (chuva) { ctx.strokeStyle = "rgba(200,230,210,.25)"; ctx.lineWidth = 1; for (let k = 0; k < 2; k++) { const gx = wx + cvRnd(i * 5 + k) * ww, gy = jy + ((t * 18 + cvRnd(i + k * 9) * jh) % jh); ctx.beginPath(); ctx.moveTo(gx, gy - 6); ctx.lineTo(gx, gy); ctx.stroke(); } }
    ctx.fillStyle = "#121a14"; ctx.fillRect(wx + ww, jy - 2, 6, jh + 4);
  }
  // para-brisa e motorista
  const pbx = x - w * .085;
  ctx.fillStyle = `rgba(150,220,150,${.18 * flick})`; ctx.beginPath(); ctx.moveTo(pbx, jy - h * .04); ctx.lineTo(x - 3, jy); ctx.lineTo(x - 2, jy + jh * 1.1); ctx.lineTo(pbx, jy + jh * 1.1); ctx.fill();
  if (o.motorista !== false) { ctx.fillStyle = "#050705"; ctx.beginPath(); ctx.arc(pbx + w * .04, jy + jh * .45, h * .07, 0, 7); ctx.fill(); ctx.fillRect(pbx + w * .02, jy + jh * .6, w * .04, jh * .5); ctx.strokeStyle = "#050705"; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(pbx + w * .065, jy + jh * .85, 3, h * .06, .3, 0, 7); ctx.stroke(); }
  if (chuva) { const lim = Math.sin(t * 3.2) * .7; ctx.strokeStyle = "#0a0f0b"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(pbx + w * .04, jy + jh * 1.08); ctx.lineTo(pbx + w * .04 + Math.sin(lim) * jh * .9, jy + jh * 1.08 - Math.cos(lim) * jh * .9); ctx.stroke(); } // limpador
  ctx.fillStyle = "#0f1511"; ctx.fillRect(x - 4, jy + h * .05, 10, 4); ctx.fillRect(x + 4, jy + h * .02, 4, h * .1); // retrovisor
  // letreiro de LED
  ctx.fillStyle = "#050806"; ctx.fillRect(x - w * .42, topo + h * .02, w * .4, h * .1);
  const a = cvRnd(Math.floor(t * 12)) < .08 ? .25 : .95;
  ctx.fillStyle = `rgba(155,216,107,${a})`; ctx.font = `800 ${Math.max(10, h * .09)}px "Big Shoulders Display", sans-serif`;
  ctx.textAlign = "right"; ctx.fillText("13 · VIA SERRA", x - w * .035, topo + h * .1); ctx.textAlign = "start";
  // porta sanfonada da frente
  const pa = o.porta || 0, px = x - w * .15, pw = w * .07, ph = h * .72;
  ctx.fillStyle = `rgba(190,255,190,${.1 + .55 * pa})`; ctx.fillRect(px, y - h * .86, pw, ph);
  const folha = pw / 2 * (1 - pa * .8); ctx.fillStyle = "#1e2a21";
  ctx.fillRect(px, y - h * .86, folha, ph); ctx.fillRect(px + pw - folha, y - h * .86, folha, ph);
  ctx.fillStyle = `rgba(150,220,150,${.2 * flick})`; ctx.fillRect(px + 2, y - h * .82, Math.max(0, folha - 4), ph * .45); ctx.fillRect(px + pw - folha + 2, y - h * .82, Math.max(0, folha - 4), ph * .45);
  if (pa > .1) { luzCor(px + pw / 2, y - h * .15, h * .7 * pa, .3 * pa, "190,255,190"); ctx.fillStyle = `rgba(190,255,190,${.25 * pa})`; ctx.fillRect(px - 4, y - h * .16, pw + 8, 4); } // degrau aceso
  // lanternas laterais âmbar e luz de freio
  for (let i = 0; i < 5; i++) { ctx.fillStyle = "rgba(242,163,58,.85)"; ctx.fillRect(x0 + w * (.1 + i * .18), y - h * .3, 4, 3); }
  const freio = o.freio || 0; ctx.fillStyle = `rgba(255,40,30,${.5 + .5 * freio})`; ctx.fillRect(x0 + 1, y - h * .36, 5, h * .1);
  if (freio > .05) luzCor(x0, y - h * .3, h * .7, .35 * freio, "255,40,30");
  // para-choque e placa
  ctx.fillStyle = "#0b0f0c"; ctx.fillRect(x - 6, y - h * .19, 10, h * .06); ctx.fillRect(x0 - 3, y - h * .19, 8, h * .06);
  // rodas girando
  [x0 + w * .16, x - w * .22].forEach(rx => {
    const r = h * .13, ry = y - r * .85;
    ctx.fillStyle = "#0a0e0b"; ctx.beginPath(); ctx.arc(rx, ry, r * 1.25, PI, 0); ctx.fill(); // caixa de roda
    ctx.fillStyle = "#050605"; ctx.beginPath(); ctx.arc(rx, ry, r, 0, 7); ctx.fill();
    ctx.fillStyle = "#2a302c"; ctx.beginPath(); ctx.arc(rx, ry, r * .5, 0, 7); ctx.fill();
    ctx.strokeStyle = "#0a0c0a"; ctx.lineWidth = 2; for (let k = 0; k < 5; k++) { const an = giro + k * 1.2566; ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx + Math.cos(an) * r * .48, ry + Math.sin(an) * r * .48); ctx.stroke(); }
  });
  // farol
  if (o.farol !== false) { luzCor(x + 2, y - h * .24, h * .9, .55, "255,240,200"); ctx.fillStyle = "rgba(255,250,230,.95)"; ctx.fillRect(x - 5, y - h * .28, 7, h * .09); }
  // fumaça do escapamento
  if (o.fumaca) for (let i = 0; i < 6; i++) { const k = ((t * .7 + i / 6) % 1); ctx.fillStyle = `rgba(150,160,155,${.18 * (1 - k)})`; ctx.beginPath(); ctx.arc(x0 - 6 - k * h * .8, y - h * .12 - k * h * .3, 4 + k * h * .25, 0, 7); ctx.fill(); }
  ctx.restore();
}

/* ---------- o ponto na serra ---------- */
CINE.ponto = { dur: 7.5, f(t, p) {
  t = Math.max(0, t);
  const chao = H * .6, rel = relampago(t, 8.5, 2);
  // céu, morros e serra
  const sg = ctx.createLinearGradient(0, 0, 0, chao); sg.addColorStop(0, "#04060a"); sg.addColorStop(1, "#151c27");
  ctx.fillStyle = sg; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 3; i++) { const x = ((i * W * .45 + t * 6) % (W * 1.6)) - W * .3; ctx.fillStyle = "rgba(30,36,48,.5)"; ctx.beginPath(); ctx.ellipse(x, H * (.1 + i * .05), W * .35, H * .04, 0, 0, 7); ctx.fill(); } // nuvens
  if (rel) { ctx.fillStyle = `rgba(200,215,255,${rel * .6})`; ctx.fillRect(0, 0, W, chao); if (rel > .5) { ctx.strokeStyle = "rgba(230,240,255,.9)"; ctx.lineWidth = 2; ctx.beginPath(); let lx = W * .78, ly = 0; ctx.moveTo(lx, ly); for (let i = 0; i < 6; i++) { lx += (cvRnd(i + Math.floor(t / 8.5)) - .5) * 30; ly += H * .05; ctx.lineTo(lx, ly); } ctx.stroke(); } }
  ctx.fillStyle = "#0a0d13"; ctx.beginPath(); ctx.moveTo(0, chao - H * .14); for (let i = 0; i <= 10; i++) ctx.lineTo(i / 10 * W, chao - H * .14 - Math.abs(Math.sin(i * 1.7)) * 46); ctx.lineTo(W, chao); ctx.lineTo(0, chao); ctx.fill();
  for (let i = 0; i < 9; i++) arvore(W * (i / 8) + cvRnd(i) * 20, chao - H * .02, H * (.12 + cvRnd(i * 2) * .08), "#07090d", .26);
  // asfalto molhado
  ctx.fillStyle = "#0f1217"; ctx.fillRect(0, chao, W, H);
  ctx.fillStyle = "rgba(230,220,180,.35)"; for (let i = 0; i < 8; i++) ctx.fillRect(i * W * .16, chao + H * .06, W * .08, 3);
  // poste com lâmpada que falha
  const px0 = W * .58, pl = cvRnd(Math.floor(t * 5)) < .1 ? .15 : 1;
  ctx.fillStyle = "#141820"; ctx.fillRect(px0, chao - H * .36, 4, H * .36); ctx.fillRect(px0, chao - H * .36, W * .08, 4);
  ctx.fillStyle = `rgba(255,220,150,${.85 * pl})`; ctx.fillRect(px0 + W * .06, chao - H * .355, 14, 4);
  const cg = ctx.createLinearGradient(0, chao - H * .35, 0, chao); cg.addColorStop(0, `rgba(255,220,150,${.2 * pl})`); cg.addColorStop(1, "rgba(255,220,150,0)");
  ctx.fillStyle = cg; ctx.beginPath(); ctx.moveTo(px0 + W * .06, chao - H * .35); ctx.lineTo(px0 + W * .06 + 14, chao - H * .35); ctx.lineTo(px0 + W * .22, chao); ctx.lineTo(px0 - W * .08, chao); ctx.fill();
  gotasNoFarol(px0 - W * .02, chao - H * .2, W * .2, H * .15, t, 14);
  for (let i = 0; i < 5; i++) { const a = t * 3 + i * 1.7; ctx.fillStyle = "rgba(255,240,200,.6)"; ctx.fillRect(px0 + W * .065 + Math.cos(a) * 14, chao - H * .34 + Math.sin(a * 1.3) * 10, 2, 2); } // mariposas
  // abrigo do ponto com banco, placa de horários e lixeira
  const ax = W * .06;
  ctx.fillStyle = "rgba(120,150,180,.07)"; ctx.fillRect(ax + 6, chao - H * .24, W * .3 - 12, H * .2); // vidro
  ctx.fillStyle = "#151922"; ctx.fillRect(ax - 4, chao - H * .26, W * .32, 8); ctx.fillRect(ax + 4, chao - H * .26, 5, H * .26); ctx.fillRect(ax + W * .3 - 9, chao - H * .26, 5, H * .26);
  ctx.fillRect(ax + W * .04, chao - H * .07, W * .2, 5); ctx.fillRect(ax + W * .06, chao - H * .07, 3, H * .07); ctx.fillRect(ax + W * .21, chao - H * .07, 3, H * .07); // banco
  ctx.fillStyle = "rgba(230,225,200,.25)"; ctx.fillRect(ax + W * .22, chao - H * .2, W * .05, H * .07); ctx.fillStyle = "rgba(20,20,20,.6)"; for (let i = 0; i < 4; i++) ctx.fillRect(ax + W * .225, chao - H * .19 + i * 7, W * .04, 2); // horários
  ctx.fillStyle = "rgba(155,216,107,.85)"; ctx.font = `800 ${Math.min(W * .045, 18)}px "Big Shoulders Display", sans-serif`; ctx.fillText("PONTO", ax + 6, chao - H * .27);
  // pingos caindo do telhado do ponto
  for (let i = 0; i < 6; i++) { const k = (t * 1.6 + i / 6) % 1; ctx.fillStyle = "rgba(190,205,225,.55)"; ctx.fillRect(ax + i * W * .055, chao - H * .25 + k * H * .25, 1.5, 5); }
  // poças com ondinhas
  [[.15, .09], [.45, .12], [.78, .08]].forEach(([fx, fy], j) => { ctx.fillStyle = "rgba(150,170,200,.1)"; ctx.beginPath(); ctx.ellipse(W * fx, chao + H * fy, W * .09, H * .012, 0, 0, 7); ctx.fill();
    for (let k = 0; k < 2; k++) { const r = (((t * .9 + k * .5 + j * .3) % 1) + 1) % 1; ctx.strokeStyle = `rgba(190,205,225,${.35 * (1 - r)})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(W * fx + (cvRnd(j + k) - .5) * W * .1, chao + H * fy, 2 + r * 12, (2 + r * 12) * .3, 0, 0, 7); ctx.stroke(); } });
  // chegada do ônibus: freia, balança e abre a porta soltando vapor
  const chega = p.sem ? 0 : cvSeg(t, .6, 4.2), ease = 1 - Math.pow(1 - chega, 2.4), bx = cvMix(W * 2.6, W * 1.02, ease);
  const vel = p.sem ? 0 : (1 - chega) * 2.4, parado = chega >= 1;
  const balanco = parado ? Math.sin((t - 4.2) * 9) * Math.exp(-(t - 4.2) * 2.5) * H * .012 : 0;
  const porta = p.sem ? 0 : cvSuave(cvSeg(t, 4.5, 5.1));
  const entra = p.entra ? cvSuave(cvSeg(t, 5.3, 6.6)) : 0, px = cvMix(W * .23, W * .87, entra);
  if (!p.sem) {
    // reflexo do ônibus no asfalto molhado
    ctx.save(); ctx.globalAlpha = .18; ctx.translate(0, chao * 2 + 8); ctx.scale(1, -.9); onibus(bx, chao + 4, W * 1.15, H * .26, t, { porta, passageiros: true, farol: false, giro: -bx / (H * .034), chuva: false }); ctx.restore();
    ctx.fillStyle = "rgba(255,240,200,.08)"; ctx.fillRect(bx, chao + 4, W * .3, H * .06); // farol refletindo
  }
  if (entra < .97) pessoa(px, chao, H * .24, { fase: passo(px, H * .24), anda: entra > 0 && entra < 1 ? 1 : 0, dir: entra > 0 ? 1 : (Math.sin(t * .7) > .6 ? -1 : 1), luz: !!p.celular, luzRgb: "170,200,255", cabeca: !p.sem && t > 1.2 && t < 4 ? .6 : 0 });
  if (!p.sem) {
    onibus(bx, chao + 4, W * 1.15, H * .26, t, { porta, passageiros: true, giro: -bx / (H * .034), balanco, freio: vel > .2 && vel < 1.4 ? 1 : parado ? .3 : 0, fumaca: true });
    // água espirrando das rodas enquanto freia
    if (vel > .15) for (let i = 0; i < 10; i++) { const k = (t * 3 + i / 10) % 1, rx = bx - W * 1.15 * .22; ctx.fillStyle = `rgba(190,205,225,${.4 * (1 - k) * Math.min(1, vel)})`; ctx.fillRect(rx + k * W * .12 * (cvRnd(i) + .3), chao - k * H * .06 + k * k * H * .08, 2, 2); }
    // vapor da porta abrindo
    if (porta > 0 && t < 6.5) for (let i = 0; i < 6; i++) { const k = cvSeg(t, 4.5 + i * .08, 6.2 + i * .1); ctx.fillStyle = `rgba(200,220,210,${.16 * (1 - k)})`; ctx.beginPath(); ctx.arc(bx - W * .13 + (cvRnd(i) - .5) * 30 - k * 20, chao - H * .05 - k * H * .12, 8 + k * 24, 0, 7); ctx.fill(); }
  }
  if (rel) { ctx.fillStyle = `rgba(200,215,255,${rel * .15})`; ctx.fillRect(0, 0, W, H); }
} };

/* ---------- dentro do ônibus: balanço, paisagem passando nas janelas ---------- */
const _dentroOnibusOrig = CINE.dentroOnibus.f;
CINE.dentroOnibus = { dur: 6.5, f(t, p) {
  t = Math.max(0, t);
  window.sobEmCasaT = performance.now(); // a chuva fica só do lado de fora das janelas
  const chao = H * .6, ate = p.ate || "catraca", hp = H * .23, rel = relampago(t, 7.5, 1.5);
  const alvo = { catraca: .755, frente: .83, fundo: .33, cordinha: .47 }[ate];
  const ca = cvSuave(cvSeg(t, .6, ate === "fundo" ? 5.4 : 2.6)), xm = cvMix(.95, alvo, ca);
  const cam = Math.max(0, Math.min(W * 1.2, xm * W * 2.2 - W * .5)), X = f => f * W * 2.2 - cam;
  const flick = cvRnd(Math.floor(t * 9)) < .07 ? .3 : 1;
  const freada = p.viram ? cvSeg(t, 2.6, 3) * (1 - cvSeg(t, 3, 3.6)) : 0;
  const swx = Math.sin(t * 1.3) * 2 + freada * 10, swy = Math.abs(Math.sin(t * 7.3)) * 1.2 + Math.sin(t * 2.7) * 1.2, rot = Math.sin(t * 1.1) * .004;
  ctx.fillStyle = "#0b100c"; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(W / 2 + swx, H / 2 + swy); ctx.rotate(rot); ctx.translate(-W / 2, -H / 2);
  ctx.fillStyle = "#0f1611"; ctx.fillRect(-20, -20, W + 40, H * .1 + 20);
  // luzes do teto
  for (let i = 0; i < 7; i++) { const x = X(.06 + i * .16), f2 = cvRnd(Math.floor(t * 8) + i * 13) < .08 ? .2 : flick;
    ctx.fillStyle = `rgba(200,255,200,${.55 * f2})`; ctx.fillRect(x - 30, H * .088, 60, 5); luzCor(x, H * .12, 100, .13 * f2, "190,255,190"); }
  // janelas: céu, serra e árvores passando, poste com luz varrendo, chuva no vidro
  const y0 = H * .17, jh = H * .17, scroll = t * W * .9;
  for (let i = 0; i < 10; i++) {
    const x = X(.04 + i * .1), w = W * .19;
    ctx.save(); ctx.beginPath(); ctx.rect(x, y0, w, jh); ctx.clip();
    ctx.fillStyle = rel ? `rgb(${40 + rel * 120},${50 + rel * 120},${70 + rel * 130})` : "#060a0e"; ctx.fillRect(x, y0, w, jh);
    for (let k = 0; k < 3; k++) { const lx = ((k * 90 - scroll * .25 + i * 53) % (w + 40) + w + 40) % (w + 40) + x - 20; ctx.fillStyle = "rgba(255,210,130,.7)"; ctx.fillRect(lx, y0 + jh * (.5 + cvRnd(k + i) * .1), 2, 2); luzCor(lx, y0 + jh * .52, 10, .3, "255,210,130"); } // casas distantes
    ctx.fillStyle = "#0a1018"; ctx.beginPath(); ctx.moveTo(x, y0 + jh * .7); for (let k = 0; k <= 6; k++) { const gx = x + k * w / 6; ctx.lineTo(gx, y0 + jh * (.55 + .15 * Math.sin((gx + scroll * .2) * .02))); } ctx.lineTo(x + w, y0 + jh); ctx.lineTo(x, y0 + jh); ctx.fill();
    for (let k = 0; k < 4; k++) { const tx = ((k * 70 - scroll * .9 + i * 37) % (w + 60) + w + 60) % (w + 60) + x - 30; ctx.fillStyle = "#020304"; ctx.beginPath(); ctx.moveTo(tx, y0 + jh * .2); ctx.lineTo(tx - 12, y0 + jh); ctx.lineTo(tx + 12, y0 + jh); ctx.fill(); }
    const pp = ((scroll * 1.4 + i * 140) % (W * 1.3)) / (W * 1.3), postX = x + w - pp * w * 2.2;
    ctx.fillStyle = "#020304"; ctx.fillRect(postX, y0 + jh * .1, 3, jh); luzCor(postX + 6, y0 + jh * .15, 40, .5, "255,220,150");
    ctx.restore();
    const ph = (t * .6 + i * .37) % 1; luzCor(x + w * ph, y0 + jh * .55, 36, .14, "255,230,170");
    ctx.fillStyle = "rgba(170,200,190,.07)"; ctx.fillRect(x, y0 + jh * .7, w, jh * .3); // vidro embaçado
    ctx.strokeStyle = "rgba(170,210,190,.3)"; ctx.lineWidth = 1;
    for (let k = 0; k < 7; k++) { const gx = x + cvRnd(i * 9 + k) * w, gy = y0 + ((t * 26 * (1 + cvRnd(k + i)) + cvRnd(k * 3 + i) * jh) % jh); ctx.beginPath(); ctx.moveTo(gx + 6, gy); ctx.lineTo(gx - 3, gy + 3); ctx.stroke(); } // água correndo para trás
    ctx.fillStyle = "#17201a"; ctx.fillRect(x - 4, y0 - 2, 8, jh + 4);
    ctx.fillStyle = i % 3 ? "rgba(155,216,107,.1)" : "rgba(242,163,58,.1)"; ctx.fillRect(x + w * .1, y0 - H * .05, w * .8, H * .032); // anúncios antigos
  }
  // barra e alças balançando com o ônibus
  ctx.strokeStyle = "#2c3a30"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-20, H * .145); ctx.lineTo(W + 20, H * .145); ctx.stroke();
  for (let i = 0; i < 16; i++) { const x = X(.02 + i * .065), a = Math.sin(t * 2.1 + i * .35) * .2 - swx * .03 - freada * .6;
    ctx.save(); ctx.translate(x, H * .145); ctx.rotate(a); ctx.strokeStyle = "#26332a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, H * .03); ctx.stroke(); ctx.beginPath(); ctx.arc(0, H * .03 + 6, 6, 0, 7); ctx.stroke(); ctx.restore(); }
  ctx.strokeStyle = "#2a3a2e"; ctx.lineWidth = 2; for (let i = 0; i < 5; i++) { const x = X(.18 + i * .2); ctx.beginPath(); ctx.moveTo(x, H * .145); ctx.lineTo(x, chao); ctx.stroke(); } // barras verticais
  // cordinha da campainha
  ctx.strokeStyle = "rgba(200,180,120,.5)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-20, H * .16); for (let k = 0; k <= 12; k++) ctx.lineTo(k * W / 12, H * .16 + Math.sin(k + t * 2) * 1.5); ctx.stroke();
  // piso com água acumulada que balança
  ctx.fillStyle = "#141b16"; ctx.fillRect(-20, chao, W + 40, H);
  ctx.fillStyle = "rgba(190,255,190,.06)"; ctx.fillRect(-20, chao, W + 40, 2);
  ctx.strokeStyle = "rgba(0,0,0,.4)"; ctx.lineWidth = 1; for (let i = 0; i < 24; i++) { const x = X(i * .05); ctx.beginPath(); ctx.moveTo(x, chao); ctx.lineTo(x - 20, H); ctx.stroke(); }
  [.2, .5, .78].forEach((f, j) => { const x = X(f) + Math.sin(t * 1.3 + j) * 8 - swx * 2; ctx.fillStyle = "rgba(160,230,170,.07)"; ctx.beginPath(); ctx.ellipse(x, chao + H * .05, W * .12, H * .01, 0, 0, 7); ctx.fill(); ctx.fillStyle = `rgba(200,255,200,${.08 * flick})`; ctx.fillRect(x - 10, chao + H * .048, 20, 2); });
  // bancos e passageiros (balançam um pouco atrasados)
  const banco = cx => { const sh = hp * .27;
    ctx.fillStyle = "#1e2921"; ctx.fillRect(cx - hp * .16, chao - sh - hp * .42, hp * .07, hp * .44);
    ctx.fillStyle = "#26332a"; ctx.fillRect(cx - hp * .16, chao - sh - hp * .42, hp * .07, 4);
    ctx.fillStyle = "#223026"; ctx.fillRect(cx - hp * .16, chao - sh, hp * .42, hp * .055);
    ctx.fillStyle = "#101511"; ctx.fillRect(cx + hp * .02, chao - sh + hp * .055, 5, sh - hp * .055); ctx.fillRect(cx - hp * .15, chao - 3, hp * .4, 3); };
  const lugares = [.13, .23, .33, .43, .53, .63, .73, .83], ocupados = [0, 1, 3, 4, 6];
  lugares.forEach((f, i) => { banco(X(f)); if (ocupados.includes(i)) { ctx.save(); ctx.translate(X(f), chao); ctx.rotate(Math.sin(t * 1.3 - .6 + i) * .012 + freada * .08); pessoa(0, 0, hp, { sentado: true, cor: "#050705", aro: "rgba(140,220,140,.25)", cabeca: p.viram && t > 3 ? -2.2 : Math.sin(t * .3 + i * 2) * .15 }); ctx.restore();
    ctx.fillStyle = "rgba(140,220,140,.25)"; ctx.fillRect(X(f) + 2, chao - 2, 1.5, 1.5 + ((t * 3 + i) % 1) * 3); } }); // pingando das roupas molhadas
  // catraca e cobrador
  ctx.fillStyle = "#26302a"; ctx.fillRect(X(.785), chao - H * .1, 6, H * .1); ctx.fillRect(X(.775), chao - H * .072, W * .06, 4);
  ctx.save(); ctx.translate(X(.795), chao - H * .07); ctx.rotate(t * .3 % 1.2); ctx.fillStyle = "#3a463e"; for (let k = 0; k < 3; k++) { ctx.rotate(2.094); ctx.fillRect(0, -1.5, W * .035, 3); } ctx.restore();
  pessoa(X(.8), chao, hp * 1.04, { cor: "#050705", aro: "rgba(140,220,140,.25)", dir: -1 });
  // motorista com volante virando
  banco(X(.97)); pessoa(X(.97), chao, hp, { sentado: true, cor: "#050705", aro: "rgba(140,220,140,.25)" });
  ctx.save(); ctx.translate(X(.97) + hp * .34, chao - hp * .5); ctx.rotate(Math.sin(t * .9) * .5); ctx.strokeStyle = "#1a221c"; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, 0, hp * .1, 0, 7); ctx.moveTo(-hp * .1, 0); ctx.lineTo(hp * .1, 0); ctx.stroke(); ctx.restore();
  // painel com luzes
  ctx.fillStyle = "#0e140f"; ctx.fillRect(X(1.0), chao - hp * .55, W * .12, hp * .55); for (let k = 0; k < 4; k++) { ctx.fillStyle = cvRnd(Math.floor(t * 2) + k) < .5 ? "rgba(155,216,107,.8)" : "rgba(242,163,58,.7)"; ctx.fillRect(X(1.0) + 6 + k * 8, chao - hp * .5, 4, 3); }
  // você
  const sentou = (ate === "frente" || ate === "fundo") && ca >= 1;
  if (sentou) pessoa(X(alvo), chao, hp, { sentado: true, cabeca: Math.sin(t * .5) > .7 ? -1 : 0 });
  else pessoa(X(xm), chao, H * .25, { fase: ca * 30, anda: ca > 0 && ca < 1 ? 1 : 0, dir: alvo < .95 && ca < 1 ? -1 : 1, inclina: -swx * .004 });
  ctx.restore();
  // luz de um poste varrendo o interior de tempos em tempos
  const sweep = ((t * .45) % 1.6) / 1.6; if (sweep < .6) { const sx = cvMix(W * 1.3, -W * .4, sweep / .6); const g = ctx.createLinearGradient(sx - 60, 0, sx + 60, 0); g.addColorStop(0, "rgba(255,220,150,0)"); g.addColorStop(.5, "rgba(255,220,150,.07)"); g.addColorStop(1, "rgba(255,220,150,0)"); ctx.fillStyle = g; ctx.fillRect(sx - 60, 0, 120, H); }
  if (rel) { ctx.fillStyle = `rgba(200,215,255,${rel * .12})`; ctx.fillRect(0, 0, W, H); }
  ctx.fillStyle = `rgba(140,220,140,${.04 * flick})`; ctx.fillRect(0, 0, W, H);
} };

/* ---------- a ponte sobre a represa ---------- */
CINE.ponte = { dur: 7, f(t, p) {
  t = Math.max(0, t);
  const py = H * .42, rel = relampago(t, 6.5, 2.8);
  const sg = ctx.createLinearGradient(0, 0, 0, py); sg.addColorStop(0, "#03050a"); sg.addColorStop(1, "#0c121c"); ctx.fillStyle = sg; ctx.fillRect(0, 0, W, H);
  if (rel) { ctx.fillStyle = `rgba(190,205,255,${rel * .55})`; ctx.fillRect(0, 0, W, py); }
  // serra ao fundo
  ctx.fillStyle = rel ? "#1a2230" : "#070a10"; ctx.beginPath(); ctx.moveTo(0, py); for (let i = 0; i <= 10; i++) ctx.lineTo(i / 10 * W, py - H * .08 - Math.abs(Math.sin(i * 1.3 + 2)) * H * .1); ctx.lineTo(W, py); ctx.fill();
  // água escura com ondulação e chuva batendo
  ctx.fillStyle = "#081018"; ctx.fillRect(0, py + H * .06, W, H);
  for (let i = 0; i < 16; i++) { const y = py + H * .1 + i * 10; ctx.fillStyle = `rgba(120,160,200,${.04 + .03 * Math.sin(t * 2 + i)})`; ctx.fillRect(((i * 37 + t * 15) % 40) - 40, y, W + 80, 2); }
  for (let i = 0; i < 14; i++) { const r = (((t * 1.5 + i / 14) % 1) + 1) % 1, x = cvRnd(i * 3 + Math.floor(t * 1.5 + i / 14)) * W, y = py + H * .1 + cvRnd(i * 5) * H * .3; ctx.strokeStyle = `rgba(170,190,215,${.3 * (1 - r)})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x, y, 1 + r * 8, (1 + r * 8) * .3, 0, 0, 7); ctx.stroke(); }
  // ônibus atravessando (com reflexo tremido na água)
  const k = cvSuave(cvSeg(t, .3, 6.6)), bx = cvMix(-W * .1, W * 1.5, k), bw = W * .5, bh = H * .1;
  ctx.save(); ctx.globalAlpha = .22; ctx.translate(Math.sin(t * 3) * 3, py * 2 + H * .14); ctx.scale(1, -1); onibus(bx, py, bw, bh, t, { farol: false, chuva: false, giro: bx / (bh * .13) }); ctx.restore();
  luzCor(bx + W * .1, py + H * .2, W * .2, .12, "255,240,200"); // farol batendo na água
  // treliça de trás
  ctx.strokeStyle = "#141a24"; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i <= 8; i++) { const x = i * W / 8; ctx.moveTo(x, py); ctx.lineTo(x + W / 16, py - H * .09); ctx.lineTo(x + W / 8, py); } ctx.moveTo(0, py - H * .09); ctx.lineTo(W, py - H * .09); ctx.stroke();
  onibus(bx, py - 2, bw, bh, t, { passageiros: true, giro: bx / (bh * .13), fumaca: true });
  // pista e pilares
  ctx.fillStyle = "#1a212c"; ctx.fillRect(0, py - 2, W, 6); ctx.fillStyle = "#151b25"; for (let i = 0; i < 4; i++) ctx.fillRect(i * W * .33 + W * .1, py + 4, 10, H * .22);
  // treliça da frente e luzes da ponte piscando
  ctx.strokeStyle = "#1e2633"; ctx.lineWidth = 3; ctx.beginPath(); for (let i = 0; i <= 8; i++) { const x = i * W / 8 + W / 32; ctx.moveTo(x, py + 2); ctx.lineTo(x + W / 16, py - H * .1); ctx.lineTo(x + W / 8, py + 2); } ctx.moveTo(0, py - H * .1); ctx.lineTo(W, py - H * .1); ctx.stroke();
  for (let i = 0; i < 5; i++) { const a = cvRnd(Math.floor(t * 2) + i) < .2 ? .1 : .8; ctx.fillStyle = `rgba(255,80,60,${a})`; ctx.fillRect(i * W * .25 + W * .05, py - H * .105, 4, 4); luzCor(i * W * .25 + W * .05, py - H * .1, 14, a * .4, "255,80,60"); }
  // neblina passando
  for (let i = 0; i < 3; i++) { const x = ((t * 20 * (i + 1)) % (W * 2)) - W * .5; ctx.fillStyle = "rgba(160,170,190,.05)"; ctx.fillRect(x - W * .5, py - H * .05 - i * 20, W * 1.4, 40); }
  if (rel) { ctx.fillStyle = `rgba(200,215,255,${rel * .12})`; ctx.fillRect(0, 0, W, H); }
} };
