/* ============================================================
   CINEMÁTICAS
   Cada cena pode ter  cine: ["nome", { parâmetros }]
   A animação roda inteira antes do texto e das opções. Quando acaba,
   ela continua desenhando o quadro final com movimento ambiente,
   e vira o fundo da cena (chuva, escuro, vermelho etc. continuam por cima).
   ============================================================ */
const PI = Math.PI;
const cvCl = v => v < 0 ? 0 : v > 1 ? 1 : v;
const cvSeg = (t, a, b) => cvCl((t - a) / (b - a));
const cvSuave = x => { x = cvCl(x); return x * x * (3 - 2 * x); };
const cvMix = (a, b, x) => a + (b - a) * x;
const cvRnd = i => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

/* ---------- personagem ----------
   x, y = posição dos pés; h = altura em px
   fase = ciclo da passada; anda = 0..1 (amplitude); dir = 1 direita / -1 esquerda */
function pessoa(x, y, h, o = {}) {
  const { fase = 0, anda = 0, dir = 1, cor = "#04060a", aro = "rgba(175,190,215,.28)", luz = false, luzRgb = "255,240,200",
    sentado = false, subir = 0, capacete = false, inclina = 0, escalar = 0, vermelha = false, cabeca = 0, mochila = false } = o;
  const s = h / 100, agora = performance.now() / 1000;
  // sombra no chão
  if (!sentado && !escalar && h > 14) { ctx.fillStyle = "rgba(0,0,0,.38)"; ctx.beginPath(); ctx.ellipse(x, y + 1, h * (.15 + anda * .06), h * .025, 0, 0, 7); ctx.fill(); }
  ctx.save(); ctx.translate(x, y); ctx.scale(dir * s, s); ctx.rotate(inclina);
  const sw = Math.sin(fase) * anda, bob = anda ? Math.abs(Math.cos(fase)) * 3 * anda : 0;
  const resp = anda || escalar ? 0 : Math.sin(agora * 1.7 + x * .013) * 1.1; // respiração parada
  const hipY = sentado ? -42 : -50 - bob, shY = hipY - 32 + resp, cabY = shY - 13 + resp * .3;
  const pernas = new Path2D(), bracos = new Path2D(), pes = [], maos = [];
  const linha = (P, x0, y0, a1, l1, a2, l2) => {
    const x1 = x0 + Math.sin(a1) * l1, y1 = y0 + Math.cos(a1) * l1, x2 = x1 + Math.sin(a2) * l2, y2 = y1 + Math.cos(a2) * l2;
    P.moveTo(x0, y0); P.lineTo(x1, y1); P.lineTo(x2, y2); return [x2, y2, a2];
  };
  [1, -1].forEach(k => {
    if (sentado) { pes.push(linha(pernas, 0, hipY, 1.5, 24, .08, 25)); return; }
    const w = sw * k;
    let a1 = w * .55, dobra = .12 + Math.max(0, -w) * .9;
    if (escalar) { const e = Math.sin(fase + (k > 0 ? 0 : PI)); a1 = .35 + .35 * Math.max(0, e); dobra = .4 + .9 * Math.max(0, e); }
    else if (subir) { a1 = w > 0 ? w * .9 + .15 : w * .4; dobra = .15 + Math.max(0, w) * 1.1; }
    pes.push(linha(pernas, 0, hipY, a1, 25, a1 - dobra, 25));
  });
  let mao = null;
  const ox = 2 + inclina * 10;
  [1, -1].forEach(k => {
    if (escalar) { const e = Math.sin(fase + (k > 0 ? PI : 0)); const a = 2.75 + .28 * e; maos.push(linha(bracos, ox, shY + 3, a, 17, a + .15, 16)); return; }
    if (luz && k > 0) { mao = linha(bracos, ox, shY + 3, 1.15, 17, 1.5, 15); maos.push(mao); return; }
    const a = -sw * k * .6 + (anda ? 0 : .06 * k);
    maos.push(linha(bracos, ox, shY + 3, a, 17, a + .35, 15));
  });
  if (mao) {
    const g = ctx.createLinearGradient(mao[0], mao[1], mao[0] + 230, mao[1] + 25);
    g.addColorStop(0, `rgba(${luzRgb},.42)`); g.addColorStop(1, `rgba(${luzRgb},0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(mao[0], mao[1]); ctx.lineTo(mao[0] + 240, mao[1] - 55); ctx.lineTo(mao[0] + 240, mao[1] + 95); ctx.fill();
    // poeira dentro do feixe
    ctx.fillStyle = `rgba(${luzRgb},.5)`;
    for (let i = 0; i < 7; i++) { const d = ((agora * 18 + i * 37) % 200) + 20, yy = mao[1] + Math.sin(agora + i * 2.1) * d * .25; ctx.fillRect(mao[0] + d, yy, 1.6, 1.6); }
  }
  // tronco como jaqueta (mais largo no ombro), pescoço, cabeça com cabelo e nariz
  const tronco = new Path2D();
  tronco.moveTo(-6.5, hipY + 2); tronco.lineTo(6.5, hipY + 2); tronco.lineTo(ox + 8.5, shY + 4); tronco.lineTo(ox - 7.5, shY + 3); tronco.closePath();
  if (mochila) { tronco.moveTo(ox - 8, shY + 6); tronco.lineTo(ox - 15, shY + 9); tronco.lineTo(ox - 14, hipY - 2); tronco.lineTo(-6, hipY - 2); tronco.closePath(); }
  const hx = ox + 1 + cabeca * 2;
  const cab = new Path2D();
  cab.arc(hx, cabY, 9.5, 0, 7);
  cab.moveTo(hx + 9, cabY - 1); cab.lineTo(hx + 12.5, cabY + 2.5); cab.lineTo(hx + 8.5, cabY + 4); // nariz
  cab.ellipse(hx - 2.5, cabY - 3.5, 9.5, 7.5, -.35, 0, 7); // cabelo
  const desenha = (c2, extra) => {
    ctx.strokeStyle = c2; ctx.fillStyle = c2;
    ctx.lineWidth = 7.5 + extra; ctx.stroke(pernas);
    ctx.lineWidth = 6 + extra; ctx.stroke(bracos);
    ctx.lineWidth = 4 + extra; ctx.stroke(tronco); ctx.fill(tronco);
    ctx.lineWidth = 5 + extra; ctx.beginPath(); ctx.moveTo(ox, shY + 3); ctx.lineTo(hx - 1, cabY + 6); ctx.stroke();
    if (extra) { ctx.lineWidth = extra; ctx.stroke(cab); } ctx.fill(cab);
    pes.forEach(([fx, fy, a]) => { ctx.lineWidth = 5 + extra; ctx.beginPath(); ctx.moveTo(fx - 2, fy); ctx.lineTo(fx + 7 + Math.sin(a) * 2, fy + Math.cos(a) * .5); ctx.stroke(); });
    maos.forEach(([mx, my]) => { ctx.beginPath(); ctx.arc(mx, my, 3.6 + extra / 2, 0, 7); ctx.fill(); });
  };
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  desenha(aro, 3); desenha(cor, 0);
  // costura da jaqueta e zíper pegando a luz
  ctx.strokeStyle = "rgba(255,255,255,.06)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(ox + 1, shY + 6); ctx.lineTo(1, hipY + 1); ctx.stroke();
  if (capacete) {
    ctx.fillStyle = cor; ctx.beginPath(); ctx.arc(hx, cabY - 2, 11, PI, 0); ctx.fill(); ctx.fillRect(hx - 13, cabY - 3, 27, 3);
    ctx.fillStyle = "rgba(255,236,170,.9)"; ctx.fillRect(hx + 8, cabY - 7, 4, 4);
    luzCor(hx + 12, cabY - 5, 34, .7, "255,236,170");
  }
  ctx.restore();
  if (vermelha) luzVermelha(x + dir * h * .2, y - h * .5, h * .5, .7);
  if (mao && h > 30) luzCor(x + dir * h * .3, y - h * .62, h * .35, .12, luzRgb);
}
const passo = (dist, h) => dist / (h * .2);

/* ---------- peças de cenário ---------- */
function relampago(t, tempos, xs) {
  let a = 0, xi = 0;
  tempos.forEach((ti, i) => { if (t >= ti) { const v = Math.exp(-(t - ti) * 7); if (v > a) { a = v; xi = i; } } });
  if (a < .02) return 0;
  ctx.fillStyle = `rgba(220,230,255,${a * .45})`; ctx.fillRect(0, 0, W, H);
  if (a > .3) {
    const x0 = (xs ? xs[xi] : .5) * W; let x = x0, y = 0;
    ctx.strokeStyle = `rgba(240,245,255,${a})`; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x, y);
    for (let i = 1; i <= 9; i++) { x = x0 + (cvRnd(i + xi * 13) - .5) * 60; y = i * H * .045; ctx.lineTo(x, y); }
    ctx.stroke();
  }
  return a;
}
function arvore(x, base, h, cor, larg = .32) {
  ctx.fillStyle = cor; ctx.fillRect(x - h * .025, base - h * .35, h * .05, h * .35);
  for (let i = 0; i < 4; i++) {
    const y = base - h * (.22 + i * .2), w = h * larg * (1 - i * .2);
    ctx.beginPath(); ctx.moveTo(x - w, y); ctx.lineTo(x, y - h * .32); ctx.lineTo(x + w, y); ctx.fill();
  }
}
function floresta(t, scroll, chaoY, escura) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, escura ? "#040507" : "#0a0d16"); g.addColorStop(.6, escura ? "#07080c" : "#121827"); g.addColorStop(1, "#05060a");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // lua atrás das nuvens
  if (!escura) luzCor(W * .78, H * .12, H * .14, .18, "200,210,240");
  const camadas = [[.25, "#0c111b", .55], [.5, "#090d15", .75], [1, "#05070b", 1]];
  camadas.forEach(([vel, cor, esc], c) => {
    const passo = W * .28 * esc, desl = (scroll * vel) % passo;
    for (let i = -1; i < W / passo + 2; i++) {
      const id = Math.floor((scroll * vel) / passo) + i;
      const x = i * passo - desl + cvRnd(id + c * 50) * passo * .5;
      arvore(x, chaoY + (2 - c) * 6, H * (.32 + .22 * esc) * (.8 + cvRnd(id * 3 + c) * .5), cor);
    }
  });
  ctx.fillStyle = "#05070a"; ctx.fillRect(0, chaoY, W, H - chaoY);
  // neblina
  for (let i = 0; i < 3; i++) {
    const y = chaoY - H * .05 - i * H * .06, x = ((t * 12 * (i + 1) - scroll * .3) % (W * 2)) - W * .5;
    const n = ctx.createLinearGradient(0, y - 30, 0, y + 30);
    n.addColorStop(0, "rgba(150,160,185,0)"); n.addColorStop(.5, `rgba(150,160,185,${.07 - i * .015})`); n.addColorStop(1, "rgba(150,160,185,0)");
    ctx.fillStyle = n; ctx.fillRect(x - W, y - 30, W * 3, 60);
  }
}
function fogueira(x, y, t, forca = 1) {
  luzCor(x, y - 10, H * .3 * forca, .38 * forca, "255,140,60");
  for (let i = 0; i < 5; i++) {
    const h = (26 + 16 * Math.sin(t * 9 + i * 2)) * forca, w = 8 + i;
    ctx.fillStyle = i % 2 ? "rgba(255,190,90,.85)" : "rgba(255,110,40,.8)";
    ctx.beginPath(); ctx.moveTo(x - w + (i - 2) * 5, y); ctx.quadraticCurveTo(x + (i - 2) * 4 + Math.sin(t * 11 + i) * 4, y - h * 1.4, x + w + (i - 2) * 5, y); ctx.fill();
  }
  ctx.strokeStyle = "#2a1a10"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x - 20, y + 2); ctx.lineTo(x + 20, y - 4); ctx.moveTo(x - 18, y - 4); ctx.lineTo(x + 18, y + 2); ctx.stroke();
}
function olhosNoEscuro(x, y, a, t) {
  if (a <= .02) return;
  const pis = Math.sin(t * 1.7 + x) > .93 ? .1 : 1;
  ctx.fillStyle = `rgba(230,230,200,${a * pis})`;
  ctx.beginPath(); ctx.arc(x - 6, y, 2.2, 0, 7); ctx.arc(x + 6, y, 2.2, 0, 7); ctx.fill();
}
function onibus(x, y, w, h, t, o = {}) { // x = frente do ônibus (lado direito), y = chão
  const x0 = x - w;
  ctx.fillStyle = "#18211b"; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x0, y - h, w, h - 10, 10) : ctx.rect(x0, y - h, w, h - 10); ctx.fill();
  ctx.fillStyle = "#0f1511"; ctx.fillRect(x0, y - h * .32, w, 6);
  const flick = Math.random() < .06 ? .2 : 1;
  for (let i = 0; i < 8; i++) {
    const wx = x0 + 14 + i * (w - 28) / 8, ww = (w - 28) / 8 - 8;
    ctx.fillStyle = `rgba(150,220,150,${.22 * flick})`; ctx.fillRect(wx, y - h * .86, ww, h * .38);
    if (o.passageiros && i % 3 !== 1 && i < 7) { ctx.fillStyle = "#070a08"; ctx.beginPath(); ctx.arc(wx + ww * .5, y - h * .56, h * .07, 0, 7); ctx.fill(); ctx.fillRect(wx + ww * .3, y - h * .52, ww * .4, h * .06); }
  }
  // porta da frente
  const pa = o.porta || 0;
  ctx.fillStyle = `rgba(190,255,190,${.12 + .5 * pa})`; ctx.fillRect(x - w * .13, y - h * .86, w * .08, h * .74);
  if (pa > .1) luzCor(x - w * .09, y - h * .2, h * .6 * pa, .25 * pa, "190,255,190");
  // letreiro
  const a = Math.random() < .08 ? .2 : .95;
  ctx.fillStyle = `rgba(155,216,107,${a})`; ctx.font = `800 ${Math.max(12, h * .13)}px "Big Shoulders Display", sans-serif`;
  ctx.textAlign = "right"; ctx.fillText("13 · VIA SERRA", x - 10, y - h * .9); ctx.textAlign = "start";
  // rodas e farol
  ctx.fillStyle = "#050605"; [x0 + w * .16, x - w * .2].forEach(rx => { ctx.beginPath(); ctx.arc(rx, y - 8, h * .12, 0, 7); ctx.fill(); });
  if (o.farol !== false) { luzCor(x + 4, y - h * .22, h * 1.1, .5, "255,240,200"); ctx.fillStyle = "rgba(255,250,230,.95)"; ctx.fillRect(x - 4, y - h * .28, 6, h * .1); }
}
function sub(x, y, s, t, luz = true, inclina = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(inclina); ctx.scale(s, s);
  if (luz) {
    const g = ctx.createLinearGradient(40, 0, 320, 40); g.addColorStop(0, "rgba(255,240,190,.35)"); g.addColorStop(1, "rgba(255,240,190,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(40, -4); ctx.lineTo(330, -70); ctx.lineTo(330, 110); ctx.fill();
  }
  ctx.fillStyle = "#c7a03a"; ctx.beginPath(); ctx.ellipse(0, 0, 46, 20, 0, 0, 7); ctx.fill();
  ctx.fillStyle = "#8a6d24"; ctx.fillRect(-16, -30, 22, 14); ctx.fillRect(-50, -4, 10, 8);
  ctx.fillStyle = `rgba(255,230,150,${.7 + .3 * Math.sin(t * 2)})`; ctx.beginPath(); ctx.arc(22, -2, 8, 0, 7); ctx.fill();
  ctx.strokeStyle = "#5c4816"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-50, -12); ctx.lineTo(-62, -18); ctx.moveTo(-50, 12); ctx.lineTo(-62, 18); ctx.stroke();
  ctx.restore();
}
function horizonteCidade(t, baseY, apagadas) {
  // prédios distantes, usando o mesmo desenho da cidade, mas deslocados
  ctx.save(); ctx.translate(0, baseY - H); cidade(); ctx.restore();
}
function cenaTexto(txt, x, y, cor, tam) {
  ctx.fillStyle = cor; ctx.font = `600 ${tam}px "JetBrains Mono", monospace`; ctx.fillText(txt, x, y);
}

/* ---------- prédio em corte (escadas, andares, personagem subindo/descendo) ---------- */
function posEscada(u, de, ate, fh, xL, xR) {
  const sobe = ate >= de, n = Math.abs(ate - de); u = Math.max(0, Math.min(n, u));
  let k, f;
  if (sobe) { k = de + Math.min(Math.floor(u), n - 1); f = u - (k - de); if (n === 0) { k = de; f = 0; } }
  else { k = de - Math.min(Math.floor(u), n - 1) - 1; f = 1 - (u - (de - 1 - k)); if (n === 0) { k = de; f = 0; } }
  const par = ((k % 2) + 2) % 2 === 0;
  const xa = par ? xL : xR, xb = par ? xR : xL;
  return { x: cvMix(xa, xb, f), y: -(k * fh) - f * fh, dir: (xb > xa ? 1 : -1) * (sobe ? 1 : -1) };
}
function predioCorte(t, p) {
  const fh = Math.max(120, H * .2), xL = W * .3, xR = W * .84, ph = Math.max(46, fh * .45);
  const n = Math.abs(p.ate - p.de), durMov = p.mov || Math.max(2.6, n * 1.15);
  const u = cvSuave(cvSeg(t, .7, .7 + durMov)) * n;
  const eu = posEscada(u, p.de, p.ate, fh, xL, xR);
  const cam = eu.y - (-H * .02);
  const sy = wy => wy - cam + H * .42;
  ctx.fillStyle = "#121722"; ctx.fillRect(0, 0, W, H);
  const k0 = Math.floor(-(cam + H) / fh) - 1, k1 = Math.ceil(-(cam - H) / fh) + 1;
  for (let k = Math.max(-1, k0); k <= Math.min(p.andares || 14, k1); k++) {
    const y = sy(-k * fh);
    ctx.fillStyle = "#1b2130"; ctx.fillRect(0, y, W, 10);
    if (k === (p.andares || 14)) { ctx.fillStyle = "#070a10"; ctx.fillRect(0, y - fh, W, fh); continue; }
    // porta do andar e placa
    ctx.fillStyle = "#151a26"; ctx.fillRect(W * .05, y - fh * .62, W * .14, fh * .62);
    ctx.fillStyle = "#2b3346"; ctx.fillRect(W * .16, y - fh * .33, 4, 4);
    ctx.fillStyle = "rgba(233,228,216,.1)"; ctx.font = `800 ${fh * .42}px "Big Shoulders Display", sans-serif`;
    ctx.fillText(k < 0 ? "S" : k === 0 ? "T" : String(k), W * .04, y - fh * .7);
    const verde = .5 + .5 * Math.sin(t * 2 + k);
    ctx.fillStyle = `rgba(90,220,120,${.35 + .2 * verde})`; ctx.fillRect(W * .07, y - fh * .78, 22, 8);
    // lance de escada deste andar até o próximo
    const par = ((k % 2) + 2) % 2 === 0, xa = par ? xL : xR, xb = par ? xR : xL;
    ctx.strokeStyle = "#3a4560"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xa, y);
    for (let d = 1; d <= 10; d++) { const xx = cvMix(xa, xb, d / 10); ctx.lineTo(xx - (xb - xa) / 10, y - fh * d / 10); ctx.lineTo(xx, y - fh * d / 10); }
    ctx.stroke();
    ctx.strokeStyle = "#232a3a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(xa, y - ph); ctx.lineTo(xb, y - fh - ph); ctx.stroke();
  }
  const fase = passo(u * Math.hypot(xR - xL, fh), ph * 1.6), andando = u > 0 && u < n ? 1 : 0;
  if (p.outro) {
    const o = p.outro, n2 = Math.abs(o.ate - o.de), u2 = cvSuave(cvSeg(t, o.ini ?? .7, (o.ini ?? .7) + (o.mov || durMov))) * n2;
    const ou = posEscada(u2, o.de, o.ate, fh, xL, xR);
    pessoa(ou.x, sy(ou.y), ph * 1.7, { fase: passo(u2 * fh * 2, ph * 1.6), anda: u2 > 0 && u2 < n2 ? .9 : 0, subir: 1, dir: ou.dir, vermelha: o.vermelha });
  }
  if (p.junto) {
    const uj = Math.max(0, u - .55), ju = posEscada(uj, p.de, p.ate, fh, xL, xR);
    pessoa(ju.x, sy(ju.y), ph * 1.6, { fase: fase - 1, anda: andando * .9, subir: 1, dir: ju.dir, vermelha: true });
  }
  pessoa(eu.x, sy(eu.y), ph * 1.75, { fase, anda: andando, subir: 1, dir: eu.dir, luz: p.luz !== false });
  // escuridão ao redor da lanterna
  const g = ctx.createRadialGradient(eu.x, sy(eu.y) - ph, 20, eu.x, sy(eu.y) - ph, Math.max(W, H) * .55);
  g.addColorStop(0, "rgba(4,6,10,0)"); g.addColorStop(1, "rgba(4,6,10,.7)");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

/* ---------- registro ---------- */
const CINE = {
  /* ===== A NOITE DO APAGÃO ===== */
  janela: { dur: 6, f(t, p) {
    const wx = W * .1, wy = H * .08, ww = W * .8, wh = H * .44;
    ctx.save(); ctx.beginPath(); ctx.rect(wx, wy, ww, wh); ctx.clip();
    ceu(false);
    if (p.apaga) acesas = t < 2.2 ? .55 : t < 2.8 ? (Math.random() < .5 ? .55 : .02) : .02;
    else acesas = .02;
    ctx.save(); ctx.translate(0, wy + wh - H); cidade(); ctx.restore();
    ctx.restore();
    ctx.fillStyle = "#0a0d13"; ctx.fillRect(0, 0, W, wy); ctx.fillRect(0, wy + wh, W, H); ctx.fillRect(0, 0, wx, H); ctx.fillRect(wx + ww, 0, W, H);
    ctx.strokeStyle = "#1a2030"; ctx.lineWidth = 6; ctx.strokeRect(wx, wy, ww, wh); ctx.beginPath(); ctx.moveTo(W / 2, wy); ctx.lineTo(W / 2, wy + wh); ctx.stroke();
    const vib = p.apaga ? t > 3.2 : t > .8, tel = vib ? (Math.sin(t * 20) > 0 ? 1 : .6) : 0;
    const x = W * .56, y = wy + wh + H * .08;
    pessoa(x, y, H * .3, { dir: -1, cabeca: vib ? 1 : 0 });
    if (vib) { luzCor(x - H * .05, y - H * .17, H * .09, .55 * tel, "170,200,255"); ctx.fillStyle = `rgba(200,220,255,${.9 * tel})`; ctx.fillRect(x - H * .06, y - H * .18, 6, 10); }
  } },
  predio: { dur: 6, f: predioCorte, durDe: p => .9 + (p.mov || Math.max(2.6, Math.abs(p.ate - p.de) * 1.15)) },
  olhoMagico: { dur: 6.5, f(t, p) {
    let dx = 0;
    [.6, .9, 1.2, 3.6, 3.9, 4.2].forEach(b => { if (t > b && t < b + .12) dx = (Math.random() - .5) * 12; });
    ctx.save(); ctx.translate(dx, 0);
    corredor(t);
    const vira = p.vira ? cvSeg(t, 5, 6) : 0;
    pessoa(W / 2, H * .08 + Math.min(W * .42, 200) * 2.1, H * .3, { dir: vira > .5 ? -1 : 1, cor: "#020305", aro: "rgba(255,90,70,.35)" });
    ctx.restore();
    const g = ctx.createRadialGradient(W / 2, H * .34, Math.min(W, H) * .18, W / 2, H * .34, Math.min(W, H) * .5);
    g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,.97)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  } },
  portaAbre: { dur: 6, f(t, p) {
    const chao = H * .6, dw = Math.min(W * .34, 150), dx = W * .5 - dw / 2;
    ctx.fillStyle = "#0b0e15"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#161b26"; ctx.fillRect(0, chao, W, H);
    const ab = cvSuave(cvSeg(t, .8, 2.2));
    // corredor do outro lado (vermelho)
    ctx.fillStyle = "#1c0d0d"; ctx.fillRect(dx, chao - dw * 2.1, dw, dw * 2.1);
    luzCor(dx + dw / 2, chao - dw, dw * 1.6 * ab, .35 * ab, "226,72,61");
    const entra = cvSuave(cvSeg(t, 2.6, 4.6));
    if (ab > .2) pessoa(dx + dw / 2 + (p.entra ? -entra * W * .2 : 0), chao - (p.entra ? 0 : 6), H * .27, { dir: -1, vermelha: true, anda: p.entra && entra < 1 && entra > 0 ? .7 : 0, fase: entra * 9 });
    ctx.fillStyle = "#222a39"; ctx.fillRect(dx - 10, chao - dw * 2.1 - 10, 10, dw * 2.1 + 10); ctx.fillRect(dx + dw, chao - dw * 2.1 - 10, 10, dw * 2.1 + 10); ctx.fillRect(dx - 10, chao - dw * 2.1 - 10, dw + 20, 10);
    ctx.fillStyle = "#121722"; ctx.fillRect(dx, chao - dw * 2.1, dw * (1 - ab * .85), dw * 2.1);
    ctx.fillStyle = "#3a4150"; ctx.beginPath(); ctx.arc(dx + dw * (1 - ab * .85) - 14, chao - dw, 4, 0, 7); ctx.fill();
    pessoa(W * .22 + (p.entra ? -entra * W * .05 : 0), chao + H * .02, H * .3, { dir: 1 });
  } },
  terraco: { dur: 6.5, f(t, p) {
    ceu(false); acesas = p.acesas ?? .04;
    ctx.save(); ctx.translate(0, -H * .2); cidade(); ctx.restore();
    const chao = H * .6;
    ctx.fillStyle = "#0e121a"; ctx.fillRect(0, chao, W, H - chao);
    ctx.fillStyle = "#151a25"; ctx.fillRect(0, chao - 6, W, 6); ctx.fillRect(W * .9, chao - H * .05, W * .1, H * .05);
    // casinha da porta
    ctx.fillStyle = "#131824"; ctx.fillRect(W * .02, chao - H * .2, W * .2, H * .2);
    const ab = cvSuave(cvSeg(t, .3, 1));
    ctx.fillStyle = `rgba(120,140,170,${.2 * ab})`; ctx.fillRect(W * .1, chao - H * .14, W * .08, H * .14);
    const ca = cvSuave(cvSeg(t, 1, 4.4)), x = cvMix(W * .14, W * .66, ca);
    if (p.lanterna !== false) { luzVermelha(W * .86, chao - H * .07, H * .12, .55 + .2 * Math.sin(t * 3)); ctx.fillStyle = "#2a1514"; ctx.fillRect(W * .84, chao - H * .075, 14, 22); }
    ctx.fillStyle = "#1d2230"; ctx.fillRect(W * .72, chao - H * .05, 30, 20);
    ctx.fillStyle = `rgba(255,200,120,${.5 + .5 * Math.sin(t * 9)})`; ctx.fillRect(W * .72 + 22, chao - H * .05 + 4, 4, 4);
    pessoa(x, chao, H * .27, { fase: passo(x, H * .27), anda: ca > 0 && ca < 1 ? 1 : 0, inclina: -.06 });
    relampago(t, [2.7, 9.5, 15], [.2, .7, .4]);
  } },
  feixe: { dur: 6.5, f(t, p) {
    ceu(false); acesas = .02; cidade();
    const x = -W * .4 + cvSuave(cvSeg(t, .3, 6.5)) * W * 1.8, y = H * .1;
    ctx.fillStyle = "rgba(2,3,5,.95)"; ctx.beginPath(); ctx.ellipse(x, y, W * .55, H * .07, -.05, 0, 7); ctx.fill();
    for (let i = 0; i < 9; i++) luzCor(x - W * .4 + i * W * .1, y + H * .03, 10, .5 + .5 * Math.sin(t * 4 + i), "200,220,255");
    const g = ctx.createLinearGradient(x, y, x, H);
    g.addColorStop(0, "rgba(230,235,245,.3)"); g.addColorStop(1, "rgba(230,235,245,.04)");
    const bx = x + Math.sin(t * 1.2) * W * .3;
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - 8, y); ctx.lineTo(x + 8, y); ctx.lineTo(bx + W * .16, H); ctx.lineTo(bx - W * .16, H); ctx.fill();
    // janela em primeiro plano com duas pessoas se abaixando
    const ab = cvSuave(cvSeg(t, 2.5, 3.3));
    ctx.fillStyle = "#06080c"; ctx.fillRect(0, H * .5, W, H * .5);
    ctx.fillStyle = "#0c1018"; ctx.fillRect(W * .08, H * .5, W * .84, H * .03);
    pessoa(W * .35, H * .5 + H * .2 * ab + H * .17, H * .28, { dir: 1 });
    pessoa(W * .6, H * .5 + H * .2 * ab + H * .17, H * .25, { dir: -1, vermelha: false });
  } },
  lanternas: { dur: 6, f(t, p) {
    ceu(false); acesas = .02;
    ctx.save(); ctx.translate(0, -H * .14); cidade();
    for (const te of tetos) {
      const atraso = (Math.abs(te.x - W / 2) / W) * 2.2 + .4, a = cvSeg(t, atraso, atraso + .4);
      if (p.sync) { const s = Math.sin(t * 2.2) > -.2 ? .95 : .1; luzVermelha(te.x, H + te.y, 18, a * s); }
      else if (a > 0) luzVermelha(te.x, H + te.y, 18, a * (.85 + .15 * Math.sin(t * 6 + te.ph)));
    }
    ctx.restore();
    // seu terraço escuro em primeiro plano
    ctx.fillStyle = "#04060a"; ctx.fillRect(0, H * .62, W, H);
    pessoa(W * .5, H * .62, H * .22, { dir: 1, luz: !!p.voce, luzRgb: "255,90,70" });
    if (p.voce) luzVermelha(W * .5 + H * .06, H * .62 - H * .14, 40, .6 + .3 * Math.sin(t * 3));
  } },
  tvs: { dur: 6.5, f(t, p) {
    const chao = H * .6, ca = cvSuave(cvSeg(t, .4, 5)), cam = ca * W * 1.6;
    ctx.fillStyle = "#090b10"; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "#12151d"; ctx.fillRect(0, chao, W, H);
    const d = nimg.data;
    for (let i = 0; i < d.length; i += 4) { const v = Math.random() * 190 | 0; d[i] = v; d[i + 1] = v; d[i + 2] = v + 10; d[i + 3] = 255; }
    nctx.putImageData(nimg, 0, 0);
    for (let i = 0; i < 6; i++) {
      const x = i * W * .45 - cam + W * .3, dw = W * .2;
      if (x < -dw * 2 || x > W + dw) continue;
      ctx.fillStyle = "#151924"; ctx.fillRect(x, chao - H * .26, dw, H * .26);
      ctx.globalAlpha = .6; ctx.drawImage(ncv, x + dw * .15, chao - H * .2, dw * .7, H * .1); ctx.globalAlpha = 1;
      luzCor(x + dw / 2, chao - H * .15, dw, .2, "150,170,230");
      if (i === 5 || p.sofa) { ctx.fillStyle = "rgba(4,5,8,.9)"; ctx.beginPath(); ctx.arc(x + dw / 2, chao - H * .16, H * .015, 0, 7); ctx.fill(); }
    }
    pessoa(W * .4, chao, H * .27, { fase: passo(cam, H * .27), anda: ca > 0 && ca < 1 ? .8 : 0, luz: true });
  } },
  casaMaquinas: { dur: 6, f(t, p) {
    const chao = H * .6;
    ctx.fillStyle = "#0a0c10"; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "#14171e"; ctx.fillRect(0, chao, W, H);
    for (let i = 0; i < 6; i++) {
      const x = W * .08 + i * W * .15, lig = p.terraco && i === 4;
      ctx.fillStyle = "#1c212c"; ctx.fillRect(x, chao - H * .3, W * .12, H * .3);
      ctx.fillStyle = lig ? `rgba(255,110,80,${.6 + .4 * Math.sin(t * 5)})` : "#2a303c"; ctx.fillRect(x + W * .04, chao - H * .22, W * .04, H * .06);
      if (lig) luzCor(x + W * .06, chao - H * .19, 40, .4, "255,110,80");
    }
    const ca = cvSuave(cvSeg(t, .5, 3.5)), x = cvMix(-W * .1, W * .45, ca);
    pessoa(x, chao, H * .28, { fase: passo(x, H * .28), anda: ca > 0 && ca < 1 ? 1 : 0, luz: true });
    if (p.junto) pessoa(x - W * .16, chao, H * .25, { fase: passo(x, H * .25) - 1, anda: ca > 0 && ca < 1 ? 1 : 0, vermelha: true });
    const g = ctx.createRadialGradient(x + W * .1, chao - H * .15, 30, x, chao - H * .1, W * .9);
    g.addColorStop(0, "rgba(4,5,8,0)"); g.addColorStop(1, "rgba(4,5,8,.85)"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  } },
  rua: { dur: 6, f(t, p) {
    const chao = H * .6;
    ctx.fillStyle = "#07090d"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#0d1016"; ctx.fillRect(0, chao, W, H);
    luzCor(W * .5, chao - H * .45, W * .9, .14, "226,72,61");
    for (let i = 0; i < 9; i++) {
      const x = W * .06 + i * W * .11, vira = p.viram ? cvSuave(cvSeg(t, 3 + i * .08, 3.3 + i * .08)) : 0;
      pessoa(x, chao - (i % 2) * 6, H * (.2 + (i % 3) * .02), { dir: vira > .5 ? -1 : 1, cabeca: -1, cor: "#020304", aro: "rgba(226,72,61,.3)" });
    }
    // vidro da portaria em primeiro plano
    ctx.fillStyle = "rgba(140,160,190,.06)"; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#1c2230"; ctx.lineWidth = 12; ctx.strokeRect(6, 6, W - 12, H * .66);
    ctx.fillStyle = "rgba(200,215,240,.05)"; ctx.beginPath(); ctx.moveTo(W * .2, 0); ctx.lineTo(W * .35, 0); ctx.lineTo(W * .05, H * .6); ctx.lineTo(-W * .1, H * .6); ctx.fill();
  } },

  /* ===== ÚLTIMO ÔNIBUS ===== */
  ponto: { dur: 7, f(t, p) {
    const chao = H * .6;
    ctx.fillStyle = "#06080c"; ctx.fillRect(0, 0, W, H);
    const sg = ctx.createLinearGradient(0, 0, 0, chao); sg.addColorStop(0, "#05070b"); sg.addColorStop(1, "#141a24");
    ctx.fillStyle = sg; ctx.fillRect(0, 0, W, chao);
    ctx.fillStyle = "#0b0e14"; ctx.beginPath(); ctx.moveTo(0, chao - H * .1);
    for (let i = 0; i <= 10; i++) ctx.lineTo(i / 10 * W, chao - H * .1 - Math.abs(Math.sin(i * 1.7)) * 40);
    ctx.lineTo(W, chao); ctx.lineTo(0, chao); ctx.fill();
    ctx.fillStyle = "#111419"; ctx.fillRect(0, chao, W, H);
    ctx.fillStyle = "rgba(230,220,180,.4)"; for (let i = 0; i < 8; i++) ctx.fillRect(i * W * .16, chao + H * .05, W * .08, 3);
    // abrigo do ponto
    const ax = W * .08;
    ctx.fillStyle = "#151922"; ctx.fillRect(ax, chao - H * .25, W * .3, 8); ctx.fillRect(ax + 4, chao - H * .25, 5, H * .25); ctx.fillRect(ax + W * .3 - 9, chao - H * .25, 5, H * .25);
    ctx.fillStyle = "rgba(155,216,107,.8)"; ctx.font = `800 ${Math.min(W * .045, 18)}px "Big Shoulders Display", sans-serif`; ctx.fillText("PONTO", ax + 6, chao - H * .26);
    const chega = p.sem ? 0 : cvSuave(cvSeg(t, .6, 4.2)), bx = cvMix(W * 2.4, W * 1.02, 1 - Math.pow(1 - chega, 2));
    const porta = p.sem ? 0 : cvSeg(t, 4.3, 4.9);
    const entra = p.entra ? cvSuave(cvSeg(t, 5, 6.4)) : 0;
    const px = cvMix(W * .23, W * .85, entra);
    if (entra < .97) pessoa(px, chao, H * .24, { fase: passo(px, H * .24), anda: entra > 0 && entra < 1 ? 1 : 0, dir: entra > 0 ? 1 : (Math.sin(t * .7) > .6 ? -1 : 1), luz: !!p.celular, luzRgb: "170,200,255" });
    if (!p.sem) onibus(bx, chao + 4, W * 1.15, H * .26, t, { porta, passageiros: true });
  } },
  correr: { dur: 6, f(t, p) {
    const chao = H * .6, sc = t * W * .9;
    ctx.fillStyle = "#05070b"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#0b0e14"; ctx.beginPath(); ctx.moveTo(0, chao - H * .08);
    for (let i = 0; i <= 12; i++) ctx.lineTo(i / 12 * W, chao - H * .08 - Math.abs(Math.sin(i * 1.3 + sc * .0006)) * 35);
    ctx.lineTo(W, chao); ctx.lineTo(0, chao); ctx.fill();
    ctx.fillStyle = "#101318"; ctx.fillRect(0, chao, W, H);
    for (let i = 0; i < 6; i++) { const x = ((i * W * .4 - sc) % (W * 2.4) + W * 2.4) % (W * 2.4) - W * .2; ctx.fillStyle = "#1a1e27"; ctx.fillRect(x, chao - H * .3, 5, H * .3); }
    ctx.fillStyle = "rgba(230,220,180,.4)"; for (let i = 0; i < 9; i++) { const x = ((i * W * .2 - sc * 1.0) % (W * 1.8) + W * 1.8) % (W * 1.8) - W * .2; ctx.fillRect(x, chao + H * .05, W * .08, 3); }
    const posto = cvSeg(t, 3.5, 6);
    if (posto > 0) { ctx.fillStyle = `rgba(155,216,107,${posto})`; ctx.font = `800 ${Math.min(W * .07, 30)}px "Big Shoulders Display", sans-serif`; ctx.fillText("POSTO 24H", W * 1.05 - posto * W * .42, chao - H * .28); luzCor(W * 1.1 - posto * W * .3, chao - H * .2, W * .3, .25 * posto, "190,255,200"); }
    const dist = .3 + .1 * Math.sin(t * 1.3);
    luzCor(W * (.02 - dist * .2), chao - H * .06, H * .55, .55, "255,240,200");
    pessoa(W * .5, chao, H * .25, { fase: t * 13, anda: 1.25, inclina: .12 });
  } },
  posto: { dur: 5.5, f(t, p) {
    posto(t, false);
    const hy = H * .42, ca = cvSuave(cvSeg(t, .3, 3.6)), x = cvMix(-W * .1, W * .5, ca);
    ctx.fillStyle = "rgba(190,255,200,.12)"; ctx.fillRect(W * .62, hy - H * .1, W * .18, H * .1);
    pessoa(W * .72, hy, H * .18, { dir: -1, capacete: false });
    pessoa(x, hy + H * .03, H * .21, { fase: passo(x, H * .21), anda: ca > 0 && ca < 1 ? 1 : 0 });
  } },
  dentroOnibus: { dur: 6.5, f(t, p) {
    const chao = H * .6, ate = p.ate || "catraca";
    const alvo = { catraca: .76, frente: .84, fundo: .1, cordinha: .4 }[ate];
    const ca = cvSuave(cvSeg(t, .6, ate === "fundo" ? 5.4 : 2.6)), xm = cvMix(.92, alvo, ca);
    const cam = Math.max(0, Math.min(W * 1.2, xm * W * 2.2 - W * .5));
    const X = f => f * W * 2.2 - cam;
    ctx.fillStyle = "#0b100c"; ctx.fillRect(0, 0, W, H);
    const flick = Math.random() < .07 ? .3 : 1;
    ctx.fillStyle = `rgba(190,255,190,${.16 * flick})`; ctx.fillRect(0, H * .1, W, 4);
    ctx.fillStyle = "#151c17"; ctx.fillRect(0, chao, W, H);
    for (let i = 0; i < 9; i++) {
      const x = X(.05 + i * .1);
      ctx.fillStyle = "rgba(20,30,24,1)"; ctx.fillRect(x, H * .18, W * .16, H * .15);
      const ph = (t * .6 + i * .37) % 1; luzCor(x + W * .16 * ph, H * .25, 30, .14, "255,230,170");
      ctx.fillStyle = "#1d2620"; ctx.fillRect(x, chao - H * .12, W * .16, H * .12);
      if (i < 7 && i % 3 !== 2) pessoa(x + W * .08, chao - H * .01, H * .23, { sentado: true, cor: "#050705", aro: "rgba(140,220,140,.25)", cabeca: p.viram && t > 3 ? -1 : 0, dir: p.viram && t > 3 ? -1 : 1 });
    }
    // catraca e cobrador
    ctx.fillStyle = "#26302a"; ctx.fillRect(X(.79), chao - H * .1, 6, H * .1);
    pessoa(X(.74), chao, H * .22, { sentado: true, cor: "#050705", aro: "rgba(140,220,140,.25)" });
    pessoa(X(.97), chao, H * .22, { sentado: true, cor: "#050705", aro: "rgba(140,220,140,.25)" });
    const sentar = ate === "frente" || ate === "fundo";
    pessoa(X(xm), chao, H * .25, { fase: ca * 30, anda: ca > 0 && ca < 1 ? 1 : 0, dir: alvo < .92 ? -1 : 1, sentado: sentar && ca >= 1 });
    ctx.fillStyle = `rgba(140,220,140,${.04 * flick})`; ctx.fillRect(0, 0, W, H);
  } },
  ponte: { dur: 6.5, f(t, p) {
    ctx.fillStyle = "#04060a"; ctx.fillRect(0, 0, W, H);
    const py = H * .42;
    ctx.fillStyle = "#0a1018"; ctx.fillRect(0, py + H * .08, W, H);
    for (let i = 0; i < 14; i++) { const y = py + H * .12 + i * 10; ctx.fillStyle = `rgba(120,160,200,${.05 + .03 * Math.sin(t * 2 + i)})`; ctx.fillRect(0, y, W, 2); }
    ctx.strokeStyle = "#1c2330"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W, py);
    for (let i = 0; i <= 8; i++) { const x = i * W / 8; ctx.moveTo(x, py); ctx.lineTo(x + W / 16, py - H * .08); ctx.lineTo(x + W / 8, py); }
    ctx.moveTo(0, py - H * .08); ctx.lineTo(W, py - H * .08); ctx.stroke();
    ctx.fillStyle = "#1c2330"; for (let i = 0; i < 4; i++) ctx.fillRect(i * W * .33 + W * .1, py, 8, H * .2);
    const bx = cvMix(-W * .1, W * 1.4, cvSuave(cvSeg(t, .3, 6.2)));
    onibus(bx, py - 2, W * .5, H * .1, t, { passageiros: true });
    // reflexo do ônibus na água
    ctx.save(); ctx.globalAlpha = .25; ctx.translate(0, py * 2 + H * .2); ctx.scale(1, -1); onibus(bx, py, W * .5, H * .1, t, { farol: false }); ctx.restore();
    for (let i = 0; i < 3; i++) { const x = ((t * 20 * (i + 1)) % (W * 2)) - W * .5; ctx.fillStyle = "rgba(160,170,190,.05)"; ctx.fillRect(x - W * .5, py - H * .05 - i * 20, W * 1.4, 40); }
  } },

  /* ===== ABISMO ===== */
  descida: { dur: 6.5, f(t, p) {
    mar(t, false);
    const y = cvMix(-H * .1, H * .3, cvSuave(cvSeg(t, 0, 4.5))) + Math.sin(t * 1.4) * 4;
    if (p.criatura !== false) criatura(t * .8 + 6, true);
    sub(W * .35, y, Math.min(1.1, W / 420), t, true, .15 * (1 - cvSeg(t, 3, 4.5)));
    cenaTexto(Math.round(cvMix(p.de ?? 380, p.ate ?? 410, cvSeg(t, 0, 4.5))) + " m", W * .06, H * .52, "rgba(79,207,217,.7)", 14);
  } },
  criaturaPerto: { dur: 6, f(t, p) {
    mar(t, false);
    const x = cvMix(W * 1.8, -W * .9, cvSuave(cvSeg(t, .3, 6))), y = H * .2;
    sub(W * .3 + Math.sin(t * 9) * (t > 2 && t < 4 ? 3 : 0), H * .36, Math.min(1, W / 440), t);
    ctx.fillStyle = "rgba(0,2,4,.94)"; ctx.beginPath(); ctx.ellipse(x, y, W * .9, H * .13, -.05, 0, 7); ctx.fill();
    for (let i = 0; i < 16; i++) { const a = .5 + .5 * Math.sin(t * 3 + i); luzCor(x - W * .8 + i * W * .1, y + H * .07, 14, a * .8, "79,220,230"); }
    if (p.boca) { const ab = cvSeg(t, 2.5, 3.5); ctx.fillStyle = "#000"; ctx.beginPath(); ctx.ellipse(x - W * .75, y + H * .04, W * .12, H * .06 * ab, 0, 0, 7); ctx.fill();
      for (let i = 0; i < 8; i++) luzCor(x - W * .82 + i * W * .02, y + H * .04, 6, ab, "255,220,170"); }
  } },
  doca: { dur: 7, f(t, p) {
    if (t < 3.4) {
      mar(t, false); estacao(t);
      const s = cvSuave(cvSeg(t, .2, 3.2));
      sub(cvMix(-W * .2, W * .5, s), cvMix(H * .45, H * .3, s), Math.min(.9, W / 480), t, true, -.08);
      return;
    }
    const tt = t - 3.4, chao = H * .6;
    ctx.fillStyle = "#081217"; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "#0d1a20"; ctx.fillRect(0, chao, W, H);
    for (let i = 0; i < 5; i++) { const x = i * W * .25 + W * .05, a = Math.sin(t * 4 + i) > 0 ? .5 : .2; luzCor(x, H * .1, 60, a, "226,72,61"); ctx.fillStyle = "#0f2129"; ctx.fillRect(x - W * .08, H * .16, W * .16, H * .36); }
    ctx.fillStyle = "rgba(240,230,200,.8)"; ctx.fillRect(W * .62, H * .3, W * .1, H * .08);
    const ca = cvSuave(cvSeg(tt, .2, 3.2)), x = cvMix(-W * .05, W * .55, ca);
    pessoa(x, chao, H * .27, { fase: passo(x, H * .27), anda: ca > 0 && ca < 1 ? 1 : 0, luz: true });
    if (tt < .3) { ctx.fillStyle = `rgba(0,0,0,${1 - tt / .3})`; ctx.fillRect(0, 0, W, H); }
  } },
  fenda: { dur: 6, f(t, p) {
    mar(t, false); fenda(t);
    const s = cvSuave(cvSeg(t, .2, 5));
    sub(cvMix(W * .2, W * .52, s), cvMix(H * .08, H * .5, s), Math.min(.8, W / 520), t, true, .5);
    cenaTexto(Math.round(cvMix(450, 780, s)) + " m", W * .06, H * .52, "rgba(79,207,217,.7)", 14);
  } },
  salaControle: { dur: 6, f(t, p) {
    const chao = H * .6;
    ctx.fillStyle = "#071015"; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "#0c1920"; ctx.fillRect(0, chao, W, H);
    // janela para o mar
    ctx.save(); ctx.beginPath(); ctx.arc(W * .25, H * .25, H * .12, 0, 7); ctx.clip(); mar(t, false); if (p.olho) olho(t); else criatura(t, true); ctx.restore();
    ctx.strokeStyle = "#1d313a"; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(W * .25, H * .25, H * .12, 0, 7); ctx.stroke();
    ctx.fillStyle = "#102028"; ctx.fillRect(W * .5, chao - H * .2, W * .45, H * .2);
    [["rgba(226,72,61,", .6], ["rgba(79,207,217,", .82]].forEach(([c, fx], i) => { const a = .55 + .35 * Math.sin(t * 3 + i * 2); ctx.fillStyle = c + a + ")"; ctx.beginPath(); ctx.arc(W * fx, chao - H * .14, H * .03, 0, 7); ctx.fill(); luzCor(W * fx, chao - H * .14, H * .07, a * .5, i ? "79,207,217" : "226,72,61"); });
    if (p.capsulas) for (let i = 0; i < 4; i++) { const x = W * (.1 + i * .22); ctx.fillStyle = "rgba(120,220,230,.12)"; ctx.beginPath(); ctx.ellipse(x, chao - H * .14, W * .07, H * .14, 0, 0, 7); ctx.fill(); pessoa(x, chao - H * .03, H * .2, { cor: "#04151a", aro: "rgba(79,207,217,.4)" }); }
    const ca = cvSuave(cvSeg(t, .3, 3.2)), x = cvMix(-W * .05, W * .45, ca);
    pessoa(x, chao, H * .27, { fase: passo(x, H * .27), anda: ca > 0 && ca < 1 ? 1 : 0 });
  } },

  /* ===== TURNO DA NOITE ===== */
  subestacao: { dur: 7, f(t, p) {
    const chao = H * .6;
    ctx.fillStyle = "#06080c"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#0a0d12"; ctx.beginPath(); ctx.moveTo(0, chao - H * .1); ctx.quadraticCurveTo(W * .6, chao - H * .2, W, chao - H * .08); ctx.lineTo(W, chao); ctx.lineTo(0, chao); ctx.fill();
    // torres e transformadores
    ctx.strokeStyle = "#1a1f2a"; ctx.lineWidth = 2;
    [W * .62, W * .9].forEach((x, i) => { const h = H * (.26 - i * .06), y = chao - H * .14 - i * 4; ctx.beginPath(); ctx.moveTo(x - 14, y); ctx.lineTo(x, y - h); ctx.lineTo(x + 14, y); ctx.moveTo(x - 22, y - h * .8); ctx.lineTo(x + 22, y - h * .8); ctx.stroke(); });
    ctx.beginPath(); ctx.moveTo(W * .62 - 22, chao - H * .14 - H * .21); ctx.quadraticCurveTo(W * .76, chao - H * .3, W * .9 - 22, chao - H * .14 - H * .16); ctx.stroke();
    for (let i = 0; i < 4; i++) { const x = W * (.35 + i * .15); ctx.fillStyle = "#141821"; ctx.fillRect(x, chao - H * .1, W * .08, H * .1); ctx.fillRect(x + W * .02, chao - H * .14, 4, H * .04); ctx.fillRect(x + W * .055, chao - H * .14, 4, H * .04); }
    // cerca
    ctx.strokeStyle = "#232937"; ctx.lineWidth = 1;
    for (let x = W * .3; x < W; x += 12) { ctx.beginPath(); ctx.moveTo(x, chao); ctx.lineTo(x + 12, chao - H * .06); ctx.moveTo(x + 12, chao); ctx.lineTo(x, chao - H * .06); ctx.stroke(); }
    ctx.fillStyle = "#11141b"; ctx.fillRect(0, chao, W, H);
    const pt = cvSeg(t, 1.6, 2.6);
    ctx.fillStyle = "#232937"; ctx.fillRect(W * .3 - 4, chao - H * .08, 6, H * .08);
    ctx.save(); ctx.translate(W * .3, chao); ctx.scale(1 - pt * .8, 1); ctx.fillStyle = "rgba(35,41,55,.9)"; ctx.fillRect(0, -H * .06, W * .12, 2); ctx.fillRect(0, -2, W * .12, 2); ctx.restore();
    // caminhonete
    const cx = cvMix(-W * .5, W * .02, cvSuave(cvSeg(t, 0, 1.6)));
    ctx.fillStyle = "#1a1d22"; ctx.fillRect(cx, chao - H * .07, W * .24, H * .05); ctx.fillRect(cx + W * .12, chao - H * .11, W * .1, H * .05);
    ctx.fillStyle = "#050607"; [cx + W * .05, cx + W * .19].forEach(x => { ctx.beginPath(); ctx.arc(x, chao - H * .015, H * .018, 0, 7); ctx.fill(); });
    luzCor(cx + W * .25, chao - H * .05, H * .35, .45, "255,240,200");
    ctx.fillStyle = "rgba(255,190,60,.9)"; ctx.fillRect(cx + W * .15, chao - H * .118, 8, 4);
    const ca = cvSuave(cvSeg(t, 2.4, 5.6)), x = cvMix(W * .28, W * .52, ca);
    if (t > 2.2) pessoa(x, chao, H * .24, { fase: passo(x, H * .24), anda: ca > 0 && ca < 1 ? 1 : 0, luz: true, capacete: true, inclina: -.04 });
    relampago(t, [1.1, 4.4, 11, 17], [.75, .5, .85, .6]);
  } },
  painelUsina: { dur: 6, f(t, p) {
    const chao = H * .6, pisca = Math.random() < .05 ? .4 : 1;
    ctx.fillStyle = "#0b0d10"; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "#131519"; ctx.fillRect(0, chao, W, H);
    ctx.fillStyle = "#1b2128"; ctx.fillRect(W * .05, H * .08, W * .9, H * .36);
    for (let i = 0; i < 5; i++) {
      const x = W * (.14 + i * .18), y = H * .17, r = Math.min(W * .065, 30);
      ctx.fillStyle = "#d8d2bd"; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
      const a = -2.3 + 1.6 * (.5 + .5 * Math.sin(t * (.6 + i * .3) + i)) * (i === 2 && p.alerta ? 2 : 1);
      ctx.strokeStyle = i === 2 && p.alerta ? "#c22" : "#222"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * r * .85, y + Math.sin(a) * r * .85); ctx.stroke();
    }
    ctx.strokeStyle = `rgba(255,210,77,${.5 * pisca})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(W * .1, H * .34); ctx.lineTo(W * .5, H * .34); ctx.lineTo(W * .5, H * .4); ctx.lineTo(W * .9, H * .4); ctx.stroke();
    const al = p.alerta ? (Math.sin(t * 8) > 0 ? 1 : .2) : .3;
    ctx.fillStyle = `rgba(226,72,61,${al})`; ctx.beginPath(); ctx.arc(W * .5, H * .37, 7, 0, 7); ctx.fill(); luzCor(W * .5, H * .37, 30, al * .5, "226,72,61");
    ctx.fillStyle = "#1e1a14"; ctx.fillRect(W * .55, chao - H * .1, W * .4, H * .03); ctx.fillStyle = "#d9cfae"; ctx.fillRect(W * .62, chao - H * .107, W * .1, H * .008);
    if (p.alavanca) { const ang = -.6 + Math.sin(t * 6) * .25; ctx.save(); ctx.translate(W * .25, chao - H * .16); ctx.rotate(ang); ctx.fillStyle = "#c22"; ctx.fillRect(-4, -H * .1, 8, H * .1); ctx.restore(); ctx.fillStyle = "#2a2f38"; ctx.fillRect(W * .18, chao - H * .18, W * .14, H * .05); }
    const ca = cvSuave(cvSeg(t, .3, 3)), x = cvMix(-W * .05, W * .4, ca);
    pessoa(x, chao, H * .27, { fase: passo(x, H * .27), anda: ca > 0 && ca < 1 ? 1 : 0, capacete: true });
    if (p.vulto) pessoa(W * .85, chao, H * .26, { dir: -1, cor: "#020203", aro: "rgba(255,210,77,.18)", capacete: true });
    ctx.fillStyle = `rgba(0,0,0,${(1 - pisca) * .6})`; ctx.fillRect(0, 0, W, H);
  } },
  patio: { dur: 6.5, f(t, p) {
    const chao = H * .6;
    ctx.fillStyle = "#06080c"; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "#101318"; ctx.fillRect(0, chao, W, H);
    for (let i = 0; i < 5; i++) {
      const x = W * (.05 + i * .2);
      ctx.fillStyle = "#161a22"; ctx.fillRect(x, chao - H * .16, W * .12, H * .16);
      ctx.fillStyle = "#222835"; for (let k = 0; k < 3; k++) ctx.fillRect(x + W * .015 + k * W * .04, chao - H * .24, 5, H * .08);
    }
    ctx.strokeStyle = "#1e2430"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(W * .52, chao - H * .16); ctx.lineTo(W * .52, chao - H * .4); ctx.stroke();
    const fl = relampago(t, [2.6, 9, 14], [.52, .3, .7]);
    if (fl > .05 || p.vultos) for (let i = 0; i < 5; i++) pessoa(W * (.15 + i * .18), chao, H * .22, { capacete: true, cor: `rgba(2,3,4,${Math.max(fl * 2, p.vultos ? .8 : 0)})`, aro: `rgba(255,236,170,${fl * .5})`, dir: i % 2 ? -1 : 1 });
    const ca = cvSuave(cvSeg(t, .3, 4)), x = cvMix(-W * .05, W * .42, ca);
    pessoa(x, chao + H * .04, H * .26, { fase: passo(x, H * .26), anda: ca > 0 && ca < 1 ? 1 : 0, luz: true, capacete: true });
  } },
  torre: { dur: 7, f(t, p) {
    const chao = H * .62, sub = !!p.subindo;
    const ca = sub ? cvSuave(cvSeg(t, .3, 6.2)) : 0, alt = H * 1.5;
    const cam = sub ? ca * alt * .55 : 0;
    const Y = y => y + cam;
    ctx.fillStyle = "#05070a"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#0b0e13"; ctx.beginPath(); ctx.moveTo(0, Y(chao)); ctx.quadraticCurveTo(W * .5, Y(chao - H * .08), W, Y(chao)); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
    const tx = W * .62, base = Y(chao - H * .04), topo = base - alt * .62, lb = W * .22, lt = W * .05;
    ctx.strokeStyle = "#232a37"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(tx - lb, base); ctx.lineTo(tx - lt, topo); ctx.moveTo(tx + lb, base); ctx.lineTo(tx + lt, topo); ctx.stroke();
    ctx.lineWidth = 1.5; ctx.beginPath();
    for (let i = 0; i < 12; i++) { const f1 = i / 12, f2 = (i + 1) / 12, y1 = cvMix(base, topo, f1), y2 = cvMix(base, topo, f2), w1 = cvMix(lb, lt, f1), w2 = cvMix(lb, lt, f2); ctx.moveTo(tx - w1, y1); ctx.lineTo(tx + w2, y2); ctx.moveTo(tx + w1, y1); ctx.lineTo(tx - w2, y2); }
    ctx.stroke();
    ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(tx - W * .3, topo + 20); ctx.lineTo(tx + W * .3, topo + 20); ctx.stroke();
    ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, topo + 50); ctx.quadraticCurveTo(tx - W * .3, topo + 70, tx - W * .3, topo + 22); ctx.moveTo(tx + W * .3, topo + 22); ctx.quadraticCurveTo(tx + W * .4, topo + 70, W, topo + 60); ctx.stroke();
    ctx.fillStyle = "#2e2a1f"; ctx.font = `800 ${Math.min(W * .06, 26)}px "Big Shoulders Display", sans-serif`; ctx.fillText("7", tx - 6, base - 20);
    if (!p.vazia) for (let i = 0; i < 5; i++) pessoa(tx - W * .26 + i * W * .13, topo + 20, H * .07, { capacete: true, cor: "#020304", aro: "rgba(255,236,170,.2)", dir: i % 2 ? 1 : -1 });
    if (sub) {
      const yb = cvMix(base, topo + 40, ca), x = tx - cvMix(lb, lt, ca) * .2;
      pessoa(x, yb, H * .2, { escalar: 1, fase: t * 6, capacete: true });
      if (ca > .8) { const a = Math.random() < .3 ? 1 : 0; if (a) luzCor(tx + W * .28, topo + 20, 40, .8, "160,200,255"); }
    } else {
      const cw = cvSuave(cvSeg(t, .3, 4.5)), x = cvMix(-W * .05, tx - lb - W * .05, cw);
      pessoa(x, Y(chao) + 4, H * .24, { fase: passo(x, H * .24), anda: cw > 0 && cw < 1 ? 1 : 0, luz: true, capacete: true, inclina: -.04 });
    }
    relampago(t, [3, 8, 13], [.3, .8, .5]);
  } },

  /* ===== A TRILHA ===== */
  acampamento: { dur: 7, f(t, p) {
    const chao = H * .6;
    floresta(t, 0, chao, false);
    ctx.fillStyle = "rgba(220,110,40,.9)"; ctx.beginPath(); ctx.moveTo(W * .12, chao); ctx.lineTo(W * .27, chao - H * .14); ctx.lineTo(W * .42, chao); ctx.fill();
    ctx.fillStyle = "rgba(80,30,10,.9)"; ctx.beginPath(); ctx.moveTo(W * .24, chao); ctx.lineTo(W * .27, chao - H * .08); ctx.lineTo(W * .3, chao); ctx.fill();
    fogueira(W * .6, chao, t, p.fraca ? .5 : 1);
    pessoa(W * .76, chao, H * .24, { sentado: true, dir: -1, cabeca: t > 3 && t < 4.5 ? -1 : t > 4.5 ? 1 : 0, aro: "rgba(255,150,80,.35)" });
    if (p.vozes !== false) { olhosNoEscuro(W * .08, chao - H * .2, cvSeg(t, 3, 3.6), t); olhosNoEscuro(W * .94, chao - H * .23, cvSeg(t, 4.5, 5.1), t); }
    if (p.passos) for (let i = 0; i < 3; i++) { const a = t * .6 + i * 2.1; olhosNoEscuro(W * .5 + Math.cos(a) * W * .45, chao - H * .2 + Math.sin(a) * H * .05, .7, t); }
  } },
  trilha: { dur: 6.5, f(t, p) {
    const chao = H * .6, corre = !!p.corre, vel = corre ? W * .75 : W * .28;
    const ca = cvSeg(t, .3, p.para ? 4.5 : 99), sc = (p.para ? cvSuave(ca) * 4.2 : Math.max(0, t - .3)) * vel;
    floresta(t, sc, chao, true);
    if (p.riacho) { const rx = W * 1.3 - Math.min(sc, W * .9); ctx.fillStyle = "rgba(90,120,160,.25)"; ctx.fillRect(rx - W * .1, chao, W * .5, 12); ctx.fillStyle = "rgba(150,180,220,.1)"; ctx.fillRect(rx, chao + 4, W * .3, 2);
      const a = cvSeg(t, 3.5, 4.5); if (a > 0) { pessoa(rx + W * .3, chao, H * .36, { cor: `rgba(1,1,2,${a})`, aro: `rgba(200,210,230,${a * .3})`, dir: -1, cabeca: -1 }); } }
    if (p.mochila) { const mx = W * 1.4 - Math.min(sc, W * .8); ctx.strokeStyle = "#2a2f38"; ctx.beginPath(); ctx.moveTo(mx, chao - H * .5); ctx.lineTo(mx, chao - H * .38); ctx.stroke(); ctx.fillStyle = "#3a2a1a"; ctx.fillRect(mx - 10, chao - H * .38, 20, 26); }
    const andando = p.para ? ca > 0 && ca < 1 : t > .3;
    pessoa(W * .4, chao, H * .25, { fase: sc / (H * .05), anda: andando ? (corre ? 1.25 : 1) : 0, luz: true, inclina: corre ? .1 : 0, mochila: true });
    if (corre) olhosNoEscuro(W * .04 + Math.sin(t * 3) * 10, chao - H * .22, .8, t);
    const g = ctx.createRadialGradient(W * .62, chao - H * .14, 30, W * .45, chao - H * .1, W * .8);
    g.addColorStop(0, "rgba(2,3,5,0)"); g.addColorStop(1, "rgba(2,3,5,.72)"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  } },
  cabana: { dur: 6.5, f(t, p) {
    const chao = H * .6;
    floresta(t, 0, chao, false);
    const cx = W * .55, cw = W * .4, ch = H * .14;
    ctx.fillStyle = "#0b0a09"; ctx.fillRect(cx, chao - ch, cw, ch);
    ctx.beginPath(); ctx.moveTo(cx - 12, chao - ch); ctx.lineTo(cx + cw / 2, chao - ch - H * .09); ctx.lineTo(cx + cw + 12, chao - ch); ctx.fill();
    const lj = .7 + .3 * Math.sin(t * 7) * Math.sin(t * 3.1);
    ctx.fillStyle = p.guarita ? `rgba(120,220,140,${.5 * lj})` : `rgba(255,200,110,${.8 * lj})`; ctx.fillRect(cx + cw * .15, chao - ch * .75, cw * .3, ch * .38);
    luzCor(cx + cw * .3, chao - ch * .55, H * .2, .25 * lj, p.guarita ? "120,220,140" : "255,190,100");
    if (!p.guarita) pessoa(cx + cw * .3, chao - ch * .25, H * .1, { sentado: true, cor: "#1a1008", aro: "rgba(0,0,0,0)", dir: -1 });
    ctx.fillStyle = "#050404"; ctx.fillRect(cx + cw * .62, chao - ch * .8, cw * .22, ch * .8);
    const ca = cvSuave(cvSeg(t, .3, 4)), x = cvMix(-W * .05, W * .45, ca);
    pessoa(x, chao + 4, H * .25, { fase: passo(x, H * .25), anda: ca > 0 && ca < 1 ? 1 : 0, luz: true, mochila: true });
  } },
};
