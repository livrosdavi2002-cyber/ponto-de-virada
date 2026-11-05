/* ============================================================
   SAQUEAR O PRÉDIO: escadaria em corte, você sobe os andares
   com a lanterna, arromba um apartamento e desce com o saque
   ============================================================ */
function cenaEscadas(t, ch) {
  const F = H * .27, xa = W * .15, xb = W * .85, hp = H * .19;
  // caminho: subir 3 lances, parar, arrombar, entrar, sair com o saco e descer
  const sobe = cvSuave(cvSeg(t, .15, 2.5)), desce = cvSuave(cvSeg(t, 3.75, 4.7));
  const u = t < 3.75 ? sobe * 3 : 3 - desce * 1.7;
  const fl = Math.min(2, Math.floor(u)), fr = u - fl, ida = fl % 2 === 0;
  const subindo = t < 2.5, descendo = t >= 3.75 && t < 4.7, andando = (subindo && sobe < 1) || descendo;
  const px = u >= 3 ? xb : cvMix(ida ? xa : xb, ida ? xb : xa, fr), pyW = -u * F; // y no "mundo" (0 = térreo)
  const base = 0, cam = H * .62 - pyW; // a câmera acompanha você (seus pés ficam sempre no mesmo lugar da tela)
  const Y = yw => cam + yw;
  // parede de fundo
  ctx.fillStyle = ch ? "#2a3326" : "#24252b"; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = ch ? "#3a4436" : "#2c2d34"; for (let i = -2; i < 7; i++) { const y = Y(-i * F) + base - F; ctx.fillRect(0, y + F * .55, W, F * .45); } // barra pintada
  ctx.fillStyle = "rgba(0,0,0,.18)"; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.ellipse(W * cvRnd(i + 2), (H * 2 * cvRnd(i + 7) + cam * .3) % (H * 1.4), W * .08, H * .05, 0, 0, 7); ctx.fill(); } // manchas
  for (let i = -1; i < 6; i++) {
    const yl = Y(-i * F) + base; // nível do andar i
    if (yl < -F || yl > H + F) continue;
    const lado = i % 2 === 0 ? 0 : 1, lx = lado ? xb : xa; // patamar onde o lance começa
    // porta de apartamento em cada patamar (dos dois lados)
    [0, 1].forEach(sd => {
      const dx = sd ? W * .88 : W * .02, dw = W * .1, dh = H * .19, aberto = i === 3 && sd === 1 ? cvSuave(cvSeg(t, 2.75, 3)) * (1 - cvSeg(t, 3.55, 3.75)) : 0;
      ctx.fillStyle = "#0a0b0d"; ctx.fillRect(dx, yl - dh, dw, dh);
      if (aberto > 0) { ctx.fillStyle = `rgba(255,220,160,${.08 + .25 * aberto * (cvRnd(Math.floor(t * 8)) < .3 ? .6 : 1)})`; ctx.fillRect(dx, yl - dh, dw, dh); }
      ctx.fillStyle = ch ? "#4a2a20" : (i + sd) % 3 === 0 ? "#3a2c22" : "#2e3238"; ctx.fillRect(dx + (sd ? 0 : dw * aberto * .8), yl - dh, dw * (1 - aberto * .8), dh);
      ctx.fillStyle = "#c8b080"; ctx.beginPath(); ctx.arc(sd ? dx + 5 : dx + dw - 5, yl - dh * .5, 1.8, 0, 7); ctx.fill();
      ctx.fillStyle = "rgba(220,210,180,.55)"; ctx.font = `700 8px "JetBrains Mono", monospace`; ctx.fillText(String((i + 1) * 10 + sd + 1), dx + dw * .3, yl - dh * .82);
      if (i === 1 && sd === 0) { ctx.fillStyle = "#020202"; ctx.fillRect(dx + dw * .55, yl - dh, dw * .45, dh); const pis = Math.sin(t * 1.3) > .2 ? .85 : 0; ctx.fillStyle = `rgba(220,255,180,${pis})`; ctx.fillRect(dx + dw * .7, yl - dh * .7, 2, 2); ctx.fillRect(dx + dw * .8, yl - dh * .69, 2, 2); } // olhos numa porta entreaberta
    });
    // número do andar pintado na parede
    ctx.fillStyle = ch ? "rgba(200,220,190,.18)" : "rgba(230,225,210,.16)"; ctx.font = `800 ${Math.round(F * .34)}px "Big Shoulders Display", sans-serif`;
    ctx.fillText(ch ? `${i + 1}` : `${i + 1}º`, lado ? W * .62 : W * .26, yl - F * .45);
    if (ch) { ctx.font = `700 9px "JetBrains Mono", monospace`; ctx.fillText("ЭТАЖ", lado ? W * .62 : W * .26, yl - F * .35); }
    // lâmpada do andar (umas falham)
    const pisca = cvRnd(Math.floor(t * 6) + i * 13) < (i % 3 === 1 ? .4 : .06) ? .1 : 1;
    ctx.fillStyle = `rgba(255,230,180,${.7 * pisca})`; ctx.fillRect(W * .5 - 8, yl - F + 6, 16, 4); luzCor(W * .5, yl - F + 20, W * .35, .14 * pisca, "255,225,170");
    // patamares
    ctx.fillStyle = ch ? "#454a40" : "#3a3b42"; ctx.fillRect(0, yl, W * .2, 8); ctx.fillRect(W * .8, yl, W * .2, 8);
    ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.fillRect(0, yl + 8, W * .2, 4); ctx.fillRect(W * .8, yl + 8, W * .2, 4);
    // lance de escada até o próximo andar
    const x0 = lx, x1 = lado ? xa : xb, y0 = yl, y1 = yl - F, n = 11, sgn = x1 > x0 ? 1 : -1;
    ctx.fillStyle = ch ? "#4a4f44" : "#3e3f46"; ctx.beginPath(); ctx.moveTo(x0, y0 + 8);
    for (let k = 0; k < n; k++) { const xs = cvMix(x0, x1, k / n), xe = cvMix(x0, x1, (k + 1) / n), ys = cvMix(y0, y1, (k + 1) / n); ctx.lineTo(xs, ys); ctx.lineTo(xe, ys); }
    ctx.lineTo(x1, y1 + 8); ctx.lineTo(x1, y1 + 16); ctx.lineTo(x0, y0 + 16); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.06)"; ctx.lineWidth = 1; for (let k = 0; k < n; k++) { const xs = cvMix(x0, x1, k / n), ys = cvMix(y0, y1, (k + 1) / n); ctx.beginPath(); ctx.moveTo(xs, ys); ctx.lineTo(xs + sgn * (x1 - x0) / n * sgn, ys); ctx.stroke(); }
    // corrimão com grades
    const ry = H * .09; ctx.strokeStyle = ch ? "#6a4a2a" : "#55585e"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x0, y0 - ry); ctx.lineTo(x1, y1 - ry); ctx.stroke();
    ctx.lineWidth = 1.2; for (let k = 1; k < n; k += 2) { const xs = cvMix(x0, x1, k / n), ys = cvMix(y0, y1, k / n); ctx.beginPath(); ctx.moveTo(xs, ys - ry); ctx.lineTo(xs, ys - 2); ctx.stroke(); }
    // lixo e entulho nos degraus
    ctx.fillStyle = "rgba(20,18,16,.9)"; ctx.beginPath(); ctx.ellipse(cvMix(x0, x1, .3), cvMix(y0, y1, .3) - 3, 6, 3, 0, 0, 7); ctx.fill();
    if (i % 2) { ctx.fillStyle = "rgba(200,190,170,.25)"; ctx.fillRect(cvMix(x0, x1, .7), cvMix(y0, y1, .7) - 2, 8, 2); }
  }
  // você
  const yP = Y(pyW) + base;
  const arromba = t >= 2.5 && t < 2.8, dentro = t >= 3 && t < 3.55;
  if (!dentro) {
    const dirP = u >= 3 && !descendo ? 1 : descendo ? (fl % 2 === 0 ? -1 : 1) : (ida ? 1 : -1);
    const xP = arromba ? xb + Math.sin(cvSeg(t, 2.5, 2.8) * PI) * W * .03 : t >= 2.8 && t < 3 ? cvMix(xb, W * .93, cvSeg(t, 2.8, 3)) : t >= 3.55 && t < 3.75 ? cvMix(W * .93, xb, cvSeg(t, 3.55, 3.75)) : px;
    pessoa(xP, yP, hp, { fase: (subindo || descendo) ? u * 16 : t * 9, anda: andando ? .9 : (t >= 2.8 && t < 3.75 ? .7 : 0), subir: andando ? 1 : 0, dir: dirP, luz: true, luzRgb: "255,240,200", mochila: true, inclina: arromba ? .25 : 0 });
    if (t > 3.5) { ctx.fillStyle = "#3a3024"; ctx.beginPath(); ctx.ellipse(xP - dirP * hp * .14, yP - hp * .62, hp * .1, hp * .13, 0, 0, 7); ctx.fill(); ctx.strokeStyle = "#2a2018"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(xP - dirP * hp * .14, yP - hp * .75); ctx.lineTo(xP - dirP * hp * .1, yP - hp * .8); ctx.stroke(); } // saco do saque
  }
  if (arromba && cvSeg(t, 2.5, 2.8) > .5 && cvSeg(t, 2.5, 2.8) < .7) { tremerTela(); ctx.fillStyle = "rgba(255,240,210,.12)"; ctx.fillRect(0, 0, W, H); }
  if (dentro) { ctx.fillStyle = "rgba(255,230,180,.5)"; for (let i = 0; i < 3; i++) { const k = ((t * 3 + i / 3) % 1); ctx.fillRect(W * .9 + Math.sin(i * 3 + t * 5) * 8, yP - hp * (.3 + k * .4), 2, 2); } } // barulho lá dentro
  // poeira caindo
  ctx.fillStyle = "rgba(220,210,190,.25)"; for (let i = 0; i < 18; i++) { const k = ((t * .15 + cvRnd(i) ) % 1); ctx.fillRect(W * cvRnd(i + 40), k * H, 1.3, 1.3); }
}
function tremerTela() { if (typeof tremer === "function" && !tremerTela.ok) { tremer(0, .12); tremerTela.ok = true; setTimeout(() => tremerTela.ok = false, 300); } }
const _desenhaAcaoPredio = desenhaAcao;
desenhaAcao = function (t, c) {
  if (c.acao === "saquear" && SOB && L().especial && L().especial.loot) return cenaEscadas(t, SOB.modo === "cherno");
  return _desenhaAcaoPredio(t, c);
};
