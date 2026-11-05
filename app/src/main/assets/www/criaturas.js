/* ============================================================
   CRIATURAS COM MAIS DETALHE
   zumbi: pele acinzentada, roupa rasgada, costelas, sangue,
          mandíbula mexendo, cabelo ralo, dedos, perna mancando
   monstro: magro e comprido, juntas marcadas, coluna saltada,
          trapos balançando, garras, dentes, brilho nos olhos
   mutante (quatro patas): cão deformado com costelas, espinhos,
          focinho aberto e cauda
   ============================================================ */

function zumbi(x, y, h, o = {}) {
  const { fase = 0, anda = 0, dir = 1, olhos = .35, aro = "rgba(150,200,120,.26)", olhosRgb = "220,255,180", cabeca = .5, bater = 0 } = o;
  const s = h / 100, ag = performance.now() / 1000, sd = (x * 7.13) % 1; // semente por zumbi
  const sw = Math.sin(fase) * anda, manca = Math.max(0, Math.sin(fase)) * anda * 4;
  const pele = ["#5d6b55", "#6b6a58", "#56644f", "#706a5c"][Math.floor(sd * 4) % 4], roupa = ["#2c2a28", "#23303a", "#3a2a24", "#2a3328"][Math.floor(sd * 7) % 4];
  const calca = ["#1e2228", "#2a241c", "#1c2420"][Math.floor(sd * 5) % 3];
  if (h > 14) { ctx.fillStyle = "rgba(0,0,0,.38)"; ctx.beginPath(); ctx.ellipse(x, y + 1, h * .17, h * .028, 0, 0, 7); ctx.fill(); }
  ctx.save(); ctx.translate(x, y); ctx.scale(dir * s, s);
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  const hip = -48 + manca, sh = hip - 29, tre = Math.sin(ag * 9 + x) * .05, tw = Math.sin(ag * 3.1 + x) > .93 ? Math.sin(ag * 40) * .25 : 0; // tique na cabeça
  const pt = (x0, y0, a, l) => [x0 + Math.sin(a) * l, y0 + Math.cos(a) * l];
  const membro = (x0, y0, a1, l1, a2, l2, w1, w2, c1, c2) => { // segmento grosso com contorno
    const [x1, y1] = pt(x0, y0, a1, l1), [x2, y2] = pt(x1, y1, a2, l2);
    ctx.strokeStyle = aro; ctx.lineWidth = w1 + 3; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.strokeStyle = c1; ctx.lineWidth = w1; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    ctx.strokeStyle = c2; ctx.lineWidth = w2; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    return [x1, y1, x2, y2];
  };
  // perna de trás (a que arrasta), com a canela à mostra e sem sapato
  const pa = membro(0, hip, -sw * .2 + .1, 25, -sw * .2 + .35, 24, 8, 6, calca, pele);
  ctx.fillStyle = pele; ctx.beginPath(); ctx.ellipse(pa[2] + 3, pa[3] - 1, 6, 2.6, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,.35)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pa[0] - 3, pa[1] + 2); ctx.lineTo(pa[0] + 3, pa[1] + 5); ctx.lineTo(pa[0] - 2, pa[1] + 7); ctx.stroke(); // barra rasgada
  // braço de trás
  const soco = bater ? Math.max(0, Math.sin(ag * 9 + x)) * .35 : 0, soco2 = bater ? Math.max(0, Math.sin(ag * 9 + x + PI)) * .35 : 0;
  const m2 = bater ? membro(7, sh + 6, 2.0 + soco2, 16, 2.2 + soco2, 15, 6, 5, roupa, pele) : membro(7, sh + 6, 1.32 - tre, 16, 1.52 - tre, 15, 6, 5, roupa, pele);
  // perna da frente
  const pf = membro(0, hip, sw * .45, 25, sw * .45 - .2, 25, 8.5, 7.5, calca, calca);
  ctx.fillStyle = "#151515"; ctx.beginPath(); ctx.ellipse(pf[2] + 4, pf[3] - 1, 7.5, 3.2, 0, 0, 7); ctx.fill();
  // tronco curvado para frente, camisa rasgada
  ctx.fillStyle = aro; ctx.beginPath(); ctx.moveTo(-8, hip + 3); ctx.lineTo(8, hip + 3); ctx.lineTo(17, sh + 3); ctx.quadraticCurveTo(6, sh - 4, -3, sh + 2); ctx.closePath(); ctx.fill();
  ctx.fillStyle = roupa; ctx.beginPath(); ctx.moveTo(-6.5, hip + 2); ctx.lineTo(-3, hip + 6); ctx.lineTo(0, hip + 1); ctx.lineTo(3, hip + 7); ctx.lineTo(7, hip + 2); ctx.lineTo(15.5, sh + 3.5); ctx.quadraticCurveTo(6, sh - 2.5, -1.5, sh + 2.5); ctx.closePath(); ctx.fill();
  // buraco na camisa com as costelas
  ctx.fillStyle = pele; ctx.beginPath(); ctx.ellipse(6, hip - 14, 4.5, 6.5, -.5, 0, 7); ctx.fill();
  ctx.strokeStyle = "rgba(30,20,15,.6)"; ctx.lineWidth = .9; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(3, hip - 18 + i * 3.4); ctx.quadraticCurveTo(6.5, hip - 16 + i * 3.4, 9.5, hip - 18.5 + i * 3.4); ctx.stroke(); }
  // manchas de sangue
  ctx.fillStyle = "rgba(90,14,10,.75)"; ctx.beginPath(); ctx.ellipse(11, sh + 8, 3.4, 5, .4, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(-2, hip - 6, 2.4, 3.4, 0, 0, 7); ctx.fill();
  ctx.fillRect(10.5, sh + 11, 1.2, 6 + Math.sin(ag * 2 + x) * 1); // escorrendo
  // pescoço e cabeça caída
  ctx.strokeStyle = aro; ctx.lineWidth = 7.5; ctx.beginPath(); ctx.moveTo(11, sh + 1); ctx.lineTo(16, sh - 6); ctx.stroke();
  ctx.strokeStyle = pele; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(11, sh + 1); ctx.lineTo(16, sh - 6); ctx.stroke();
  ctx.save(); ctx.translate(18, sh - 10 + cabeca * 3); ctx.rotate(.25 + cabeca * .2 + tw);
  ctx.fillStyle = aro; ctx.beginPath(); ctx.ellipse(0, 0, 10.5, 11.5, 0, 0, 7); ctx.fill();
  ctx.fillStyle = pele; ctx.beginPath(); ctx.ellipse(0, 0, 9, 10, 0, 0, 7); ctx.fill();
  ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(-3, 2, 6, 7.5, 0, 0, 7); ctx.fill(); // sombra no rosto
  ctx.fillStyle = "rgba(255,255,255,.06)"; ctx.beginPath(); ctx.ellipse(3, -4, 4, 3, .4, 0, 7); ctx.fill();
  // cabelo ralo e ferida na cabeça
  ctx.strokeStyle = "#1a1612"; ctx.lineWidth = 1.2; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-7 + i * 2.2, -8.5); ctx.quadraticCurveTo(-9 + i * 2 + Math.sin(ag + i) * 1.5, -3, -10 + i * 1.5, 1 + (i % 3) * 2); ctx.stroke(); }
  ctx.fillStyle = "rgba(110,20,14,.8)"; ctx.beginPath(); ctx.ellipse(-2, -7, 3, 2, 0, 0, 7); ctx.fill();
  ctx.fillStyle = "#2a1a14"; ctx.beginPath(); ctx.arc(-6.5, 0, 2.2, 0, 7); ctx.fill(); // orelha
  // olhos fundos
  ctx.fillStyle = "rgba(0,0,0,.75)"; ctx.beginPath(); ctx.ellipse(3.5, -2, 2.6, 2.1, 0, 0, 7); ctx.ellipse(8.2, -1.4, 2.2, 1.9, 0, 0, 7); ctx.fill();
  if (olhos > .02) { if (olhos > .4) luzCor(6, -2, 12, olhos * .35, olhosRgb); ctx.fillStyle = `rgba(${olhosRgb},${Math.min(1, olhos + .15)})`; ctx.beginPath(); ctx.arc(3.8, -2, 1.1, 0, 7); ctx.arc(8.4, -1.4, 1, 0, 7); ctx.fill(); }
  // nariz e mandíbula que abre e fecha
  ctx.fillStyle = "rgba(0,0,0,.55)"; ctx.beginPath(); ctx.ellipse(9.2, 2, 1, 1.4, 0, 0, 7); ctx.fill();
  const boca = 2 + Math.abs(Math.sin(ag * 2.6 + x)) * 3.2;
  ctx.fillStyle = "#120806"; ctx.beginPath(); ctx.ellipse(6, 6 + boca * .3, 3.6, boca * .55 + .8, 0, 0, 7); ctx.fill();
  ctx.fillStyle = "rgba(220,210,170,.8)"; for (let i = 0; i < 3; i++) ctx.fillRect(3.6 + i * 1.7, 5.2, 1, 1.4);
  ctx.restore();
  // braço da frente esticado, com dedos
  const m1 = bater ? membro(10, sh + 4, 2.05 + soco, 17, 2.25 + soco, 16, 6.5, 5, roupa, pele) : membro(10, sh + 4, 1.58 + tre + Math.sin(fase * .5) * .1, 17, 1.72 + tre, 16, 6.5, 5, roupa, pele);
  [m1, m2].forEach(([, , mx, my], k) => { ctx.fillStyle = pele; ctx.beginPath(); ctx.arc(mx, my, 3, 0, 7); ctx.fill(); ctx.strokeStyle = pele; ctx.lineWidth = 1.4;
    for (let d = -1; d <= 1; d++) { ctx.beginPath(); ctx.moveTo(mx + 1, my); ctx.lineTo(mx + 5.5, my + d * 2.2 + Math.sin(ag * 5 + k + d) * .6); ctx.stroke(); } });
  // manga rasgada
  ctx.strokeStyle = roupa; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(m1[0] - 1, m1[1] + 2); ctx.lineTo(m1[0] + 1, m1[1] + 5); ctx.stroke();
  ctx.restore();
}

function monstro(x, y, h, o = {}) {
  const { fase = 0, anda = 0, dir = 1, olhos = .6, cor = "#010102", aro = "rgba(200,200,220,.16)", olhosRgb = "255,235,210", quatro = false, touca = false, cabeca = .35 } = o;
  const s = h / 100, ag = performance.now() / 1000;
  if (h > 20) { ctx.fillStyle = "rgba(0,0,0,.4)"; ctx.beginPath(); ctx.ellipse(x, y + 1, h * (quatro ? .3 : .14), h * .025, 0, 0, 7); ctx.fill(); }
  ctx.save(); ctx.translate(x, y); ctx.scale(dir * s, s);
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  const sw = Math.sin(fase) * anda, tre = Math.sin(fase * 7.3) * .6 + Math.sin(ag * 23) * .15, peito = Math.sin(ag * 1.3) * 1.5;
  const pt = (x0, y0, a, l) => [x0 + Math.sin(a) * l, y0 + Math.cos(a) * l];
  const osso = (x0, y0, a1, l1, a2, l2, w) => { // membro magro com joelho/cotovelo saltado
    const [x1, y1] = pt(x0, y0, a1, l1), [x2, y2] = pt(x1, y1, a2, l2);
    for (const [c, e] of [[aro, 2.6], [cor, 0]]) { ctx.strokeStyle = c; ctx.fillStyle = c; ctx.lineWidth = w + e; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.beginPath(); ctx.arc(x1, y1, w * .75 + e / 2, 0, 7); ctx.fill(); }
    return [x1, y1, x2, y2];
  };
  const garras = (mx, my, a, n = 4, l = 13) => { // dedos compridos e curvos
    for (let d = 0; d < n; d++) { const aa = a + (d - (n - 1) / 2) * .28, cx = mx + Math.sin(aa) * l * .6, cy = my + Math.cos(aa) * l * .6, ex = mx + Math.sin(aa + .35) * l, ey = my + Math.cos(aa + .35) * l;
      for (const [c, e] of [[aro, 1.6], [cor, 0]]) { ctx.strokeStyle = c; ctx.lineWidth = 1.8 + e; ctx.beginPath(); ctx.moveTo(mx, my); ctx.quadraticCurveTo(cx, cy, ex, ey); ctx.stroke(); } }
  };
  const brilhoOlhos = (ex, ey, r, sep) => { if (olhos <= .02) return; luzCor(ex + sep / 2, ey, 28, olhos * .6, olhosRgb); ctx.fillStyle = `rgba(${olhosRgb},${olhos})`; ctx.beginPath(); ctx.arc(ex, ey, r, 0, 7); ctx.arc(ex + sep, ey + .5, r, 0, 7); ctx.fill(); ctx.fillStyle = `rgba(255,255,255,${olhos * .8})`; ctx.beginPath(); ctx.arc(ex, ey, r * .4, 0, 7); ctx.arc(ex + sep, ey + .5, r * .4, 0, 7); ctx.fill(); };
  if (quatro) {
    // ===== mutante de quatro patas =====
    const resp = Math.sin(ag * 4) * 1.2;
    osso(-24, -40, -sw * .5 + .3, 22, -sw * .4 - .5, 22, 4.5); osso(22, -42, sw * .5 - .2, 22, sw * .4 + .3, 22, 4.5); // patas de trás do desenho
    // corpo: costas arqueadas, barriga funda
    for (const [c, e] of [[aro, 2.5], [cor, 0]]) { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(-34 - e, -36); ctx.quadraticCurveTo(-20, -58 - e - resp, 6, -52 - e); ctx.quadraticCurveTo(24, -58 - e, 34 + e, -46); ctx.lineTo(30, -36); ctx.quadraticCurveTo(10, -30 + resp, -10, -34 + e); ctx.quadraticCurveTo(-26, -28, -34 - e, -36); ctx.fill(); }
    ctx.strokeStyle = aro; ctx.lineWidth = 1; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-4 + i * 5, -50); ctx.quadraticCurveTo(-2 + i * 5, -41, -6 + i * 5, -34); ctx.stroke(); } // costelas
    ctx.fillStyle = cor; for (let i = 0; i < 6; i++) { const bx = -24 + i * 8; ctx.beginPath(); ctx.moveTo(bx - 3, -53 + Math.abs(i - 2.5) * 1.2); ctx.lineTo(bx, -61 + Math.abs(i - 2.5) * 1.5 - (i % 2) * 2); ctx.lineTo(bx + 3, -53 + Math.abs(i - 2.5) * 1.2); ctx.fill(); } // espinhos
    ctx.strokeStyle = cor; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-33, -38); ctx.quadraticCurveTo(-46, -44 + Math.sin(ag * 3) * 4, -52, -36 + Math.sin(ag * 3 + 1) * 5); ctx.stroke(); // cauda
    osso(-20, -38, sw * .5 + .25, 22, sw * .4 - .45, 23, 5); osso(26, -42, -sw * .5 - .15, 22, -sw * .4 + .35, 23, 5);
    // cabeça baixa com focinho aberto
    ctx.save(); ctx.translate(36, -46); ctx.rotate(.25 + Math.sin(ag * 2) * .05 + cabeca * .1);
    for (const [c, e] of [[aro, 2.4], [cor, 0]]) { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(-6 - e, -9 - e); ctx.quadraticCurveTo(10, -12 - e, 22 + e, -3); ctx.lineTo(20, 1); ctx.quadraticCurveTo(8, 3, -4, 8 + e); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-2, 5); ctx.lineTo(18, 6 + Math.abs(Math.sin(ag * 3)) * 5); ctx.lineTo(16, 9 + Math.abs(Math.sin(ag * 3)) * 5); ctx.lineTo(-4, 9 + e); ctx.fill(); // mandíbula
      ctx.beginPath(); ctx.moveTo(-4, -8); ctx.lineTo(-9 - e, -19 - e); ctx.lineTo(1, -10); ctx.fill(); } // orelha rasgada
    ctx.fillStyle = "rgba(230,220,190,.85)"; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(4 + i * 3.4, 1.5); ctx.lineTo(5.5 + i * 3.4, 4.5); ctx.lineTo(7 + i * 3.4, 1.5); ctx.fill(); }
    ctx.fillStyle = "rgba(120,20,14,.7)"; ctx.fillRect(14, 7 + Math.abs(Math.sin(ag * 3)) * 5, 1.3, 4 + Math.sin(ag * 4) * 2); // baba
    brilhoOlhos(6, -6, 1.8, 4);
    ctx.restore();
    ctx.restore(); return;
  }
  // ===== monstro alto =====
  const hip = -60, sh = -100;
  // perna de trás e braço de trás
  osso(0, hip, -sw * .45, 31, -sw * .45 - .1 - Math.max(0, sw) * .7, 31, 4.2);
  const bt = osso(9, sh + 4, sw * .25 + .1 + tre * .02, 33, sw * .25 + .02, 33, 3.6); garras(bt[2], bt[3], .1);
  // trapos pendurados atrás
  ctx.fillStyle = "rgba(38,36,40,.85)"; for (let i = 0; i < 4; i++) { const tx = -2 + i * 3.5, ond = Math.sin(ag * 1.8 + i) * 3; ctx.beginPath(); ctx.moveTo(tx, sh + 8); ctx.lineTo(tx + 4, sh + 8); ctx.lineTo(tx + 3 + ond, hip + 6 + i * 3); ctx.lineTo(tx + ond * .5, hip + 2 + (i % 2) * 6); ctx.fill(); }
  // tronco: cintura fina, peito largo, coluna saltada nas costas
  for (const [c, e] of [[aro, 2.6], [cor, 0]]) { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(-3 - e, hip); ctx.quadraticCurveTo(-4 - e - peito, (hip + sh) / 2, 2 - e, sh + 2); ctx.quadraticCurveTo(10, sh - 5 - e, 17 + e, sh + 3); ctx.quadraticCurveTo(10 + peito, (hip + sh) / 2 + 4, 4 + e, hip); ctx.closePath(); ctx.fill(); }
  ctx.fillStyle = cor; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(-1.6 - peito * .3 - Math.sin(i / 5 * PI) * 1, hip - 6 - i * 6, .9, 0, 7); ctx.fill(); } // vértebras
  ctx.strokeStyle = aro; ctx.lineWidth = 1; for (let i = 0; i < 5; i++) { const yy = -91 + i * 5.5; ctx.beginPath(); ctx.moveTo(2 - peito * .3, yy); ctx.quadraticCurveTo(8, yy + 2.5, 12, yy - 1); ctx.stroke(); } // costelas
  ctx.beginPath(); ctx.moveTo(3, hip - 4); ctx.quadraticCurveTo(6, hip - 12, 4, hip - 20); ctx.stroke(); // barriga funda
  // perna da frente
  osso(0, hip, sw * .45, 31, sw * .45 - .1 - Math.max(0, -sw) * .7, 31, 4.6);
  [[sw, 1], [-sw, -1]].forEach(([w], k) => { const [fx, fy] = (() => { const a1 = (k ? -sw : sw) * .45, [x1, y1] = pt(0, hip, a1, 31); return pt(x1, y1, a1 - .1, 31); })(); ctx.strokeStyle = cor; ctx.lineWidth = 2; for (let d = 0; d < 3; d++) { ctx.beginPath(); ctx.moveTo(fx, fy - 1); ctx.lineTo(fx + 5 + d * 2.5, fy + (d - 1) * .8); ctx.stroke(); } }); // dedos dos pés
  // trapo na cintura
  ctx.fillStyle = "rgba(48,44,46,.9)"; ctx.beginPath(); ctx.moveTo(-5, hip - 4); ctx.lineTo(7, hip - 6); ctx.lineTo(8 + Math.sin(ag * 2) * 2, hip + 10); ctx.lineTo(4, hip + 5); ctx.lineTo(1, hip + 13 + Math.sin(ag * 2.3) * 2); ctx.lineTo(-2, hip + 4); ctx.lineTo(-6, hip + 9); ctx.closePath(); ctx.fill();
  // braço da frente, comprido até abaixo do joelho, com garras
  const bf = osso(11, sh + 3, -sw * .25 + .12 + tre * .02, 33, -sw * .25 + .07, 33, 4); garras(bf[2], bf[3], .15 + Math.sin(ag * 1.7) * .1);
  // pescoço e cabeça comprida, inclinada
  for (const [c, e] of [[aro, 2.4], [cor, 0]]) { ctx.strokeStyle = c; ctx.lineWidth = 4 + e; ctx.beginPath(); ctx.moveTo(11, sh + 1); ctx.quadraticCurveTo(15, sh - 4, 17, sh - 7); ctx.stroke(); }
  ctx.save(); ctx.translate(18, sh - 10); ctx.rotate(cabeca + tre * .03);
  for (const [c, e] of [[aro, 1.6], [cor, 0]]) { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(0, -14 - e); ctx.quadraticCurveTo(8.5 + e, -12, 8 + e, 0); ctx.quadraticCurveTo(7, 11, 2, 16 + e); ctx.quadraticCurveTo(-5, 13, -7.5 - e, 2); ctx.quadraticCurveTo(-8 - e, -11, 0, -14 - e); ctx.fill(); }
  if (touca) { ctx.fillStyle = "rgba(220,225,215,.55)"; ctx.fillRect(-9, -15, 18, 6); ctx.fillStyle = "rgba(200,40,40,.6)"; ctx.fillRect(-2, -14, 4, 4); }
  else { ctx.strokeStyle = cor; ctx.lineWidth = 1.3; for (let i = 0; i < 9; i++) { const bx = -7 + i * 1.6; ctx.beginPath(); ctx.moveTo(bx, -11); ctx.quadraticCurveTo(bx - 5 + Math.sin(ag * 1.5 + i) * 2, 8, bx - 3 + Math.sin(ag + i) * 3, 24 + (i % 3) * 5); ctx.stroke(); } } // cabelo comprido
  ctx.strokeStyle = aro; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(-4, 3); ctx.quadraticCurveTo(-1, 6, 0, 10); ctx.moveTo(6, 3); ctx.quadraticCurveTo(5, 6, 5, 9); ctx.stroke(); // maçãs do rosto fundas
  const ab = 2.5 + Math.abs(Math.sin(ag * 2)) * 2.5; // boca que abre devagar
  ctx.fillStyle = "rgba(0,0,0,.95)"; ctx.beginPath(); ctx.ellipse(2, 8, 3.8, ab, 0, 0, 7); ctx.fill();
  ctx.fillStyle = "rgba(225,215,190,.75)"; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-1 + i * 2, 8 - ab + .5); ctx.lineTo(-.3 + i * 2, 8 - ab + 2.6); ctx.lineTo(.4 + i * 2, 8 - ab + .5); ctx.fill(); ctx.beginPath(); ctx.moveTo(-1 + i * 2, 8 + ab - .5); ctx.lineTo(-.3 + i * 2, 8 + ab - 2.4); ctx.lineTo(.4 + i * 2, 8 + ab - .5); ctx.fill(); }
  ctx.fillStyle = "rgba(0,0,0,.6)"; ctx.beginPath(); ctx.ellipse(-1, -3, 2.8, 2.2, 0, 0, 7); ctx.ellipse(6, -2, 2.6, 2.2, 0, 0, 7); ctx.fill(); // órbitas
  brilhoOlhos(-1, -3, 1.9, 7);
  ctx.restore();
  ctx.restore();
}
