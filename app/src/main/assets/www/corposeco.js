/* ============================================================
   FASE: CORPO-SECO (floresta) · entra como 3ª fase do menu
   Folclore: um homem tão ruim que nem a terra quis o corpo dele.
   Ele anda pela mata secando as árvores que toca.
   ============================================================ */
const SECO = { cor: "#140d07", aro: "rgba(210,170,120,.22)", olhosRgb: "255,190,120" };

function arvoreSeca(x, base, h, sem, cor = "#0b0907") {
  ctx.strokeStyle = cor; ctx.lineCap = "round";
  const galho = (x0, y0, ang, len, w, n) => {
    if (n > 4 || len < 6) return;
    const x1 = x0 + Math.sin(ang) * len, y1 = y0 - Math.cos(ang) * len;
    ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    const r = cvRnd(sem * 7 + n * 3 + len);
    galho(x1, y1, ang - .35 - r * .4, len * (.62 + r * .15), w * .62, n + 1);
    galho(x1, y1, ang + .3 + r * .45, len * (.55 + r * .2), w * .6, n + 1);
  };
  galho(x, base, (cvRnd(sem) - .5) * .15, h * .42, Math.max(3, h * .045), 0);
}
function mataSeca(t, chaoY, desl = 0) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#07080c"); g.addColorStop(.55, "#12141a"); g.addColorStop(1, "#060606");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ceu(false);
  ctx.fillStyle = "rgba(8,8,10,.55)"; ctx.fillRect(0, 0, W, H);
  [[.35, "#101116", .7], [.7, "#0b0b0e", .9], [1, "#060505", 1.1]].forEach(([vel, cor, esc], c) => {
    const passoX = W * .3 * esc, d = (desl * vel) % passoX;
    for (let i = -1; i < W / passoX + 2; i++) {
      const id = Math.floor((desl * vel) / passoX) + i + c * 40;
      arvoreSeca(i * passoX - d + cvRnd(id) * passoX * .4, chaoY + (2 - c) * 5, H * (.28 + .2 * esc) * (.8 + cvRnd(id * 3) * .4), id, cor);
    }
  });
  ctx.fillStyle = "#070605"; ctx.fillRect(0, chaoY, W, H - chaoY);
  ctx.fillStyle = "rgba(60,45,30,.25)"; for (let i = 0; i < 30; i++) ctx.fillRect(((cvRnd(i) * W * 2 - desl) % W + W) % W, chaoY + 4 + cvRnd(i * 5) * (H - chaoY) * .4, 3 + cvRnd(i * 2) * 5, 2);
  for (let i = 0; i < 3; i++) {
    const y = chaoY - H * .04 - i * H * .05, x = ((t * 10 * (i + 1) - desl * .3) % (W * 2)) - W * .5;
    const n = ctx.createLinearGradient(0, y - 26, 0, y + 26);
    n.addColorStop(0, "rgba(160,150,140,0)"); n.addColorStop(.5, `rgba(160,150,140,${.07 - i * .015})`); n.addColorStop(1, "rgba(160,150,140,0)");
    ctx.fillStyle = n; ctx.fillRect(x - W, y - 26, W * 3, 52);
  }
  // folhas secas caindo
  for (let i = 0; i < 8; i++) { const fx = ((cvRnd(i) * W + t * 12 + Math.sin(t + i) * 20) % W + W) % W, fy = ((t * 25 + cvRnd(i * 3) * H) % (chaoY));
    ctx.save(); ctx.translate(fx, fy); ctx.rotate(t * 2 + i); ctx.fillStyle = "rgba(120,80,40,.5)"; ctx.fillRect(-3, -1.5, 6, 3); ctx.restore(); }
}
function carro(x, chao, t, o = {}) {
  ctx.fillStyle = "#1a1c20"; ctx.beginPath();
  ctx.moveTo(x - W * .2, chao - H * .03); ctx.lineTo(x - W * .19, chao - H * .065); ctx.lineTo(x - W * .1, chao - H * .07); ctx.lineTo(x - W * .06, chao - H * .11);
  ctx.lineTo(x + W * .08, chao - H * .11); ctx.lineTo(x + W * .13, chao - H * .07); ctx.lineTo(x + W * .2, chao - H * .062); ctx.lineTo(x + W * .21, chao - H * .03); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "rgba(120,140,160,.18)"; ctx.fillRect(x - W * .045, chao - H * .102, W * .055, H * .03); ctx.fillRect(x + W * .02, chao - H * .102, W * .055, H * .03);
  ctx.fillStyle = "#050505"; [x - W * .12, x + W * .12].forEach(r => { ctx.beginPath(); ctx.arc(r, chao - H * .025, H * .022, 0, 7); ctx.fill(); ctx.fillStyle = "#2a2a2a"; ctx.beginPath(); ctx.arc(r, chao - H * .025, H * .008, 0, 7); ctx.fill(); ctx.fillStyle = "#050505"; });
  const fl = o.farol === false ? 0 : (cvRnd(Math.floor(t * 6)) < .2 ? .15 : 1);
  if (fl) { const g = ctx.createLinearGradient(x + W * .2, 0, x + W * .7, 0); g.addColorStop(0, `rgba(255,240,200,${.35 * fl})`); g.addColorStop(1, "rgba(255,240,200,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x + W * .2, chao - H * .055); ctx.lineTo(x + W * .8, chao - H * .12); ctx.lineTo(x + W * .8, chao + H * .02); ctx.lineTo(x + W * .2, chao - H * .04); ctx.fill();
    ctx.fillStyle = `rgba(255,250,230,${fl})`; ctx.fillRect(x + W * .195, chao - H * .056, 6, 6); }
  ctx.fillStyle = "rgba(255,60,40,.8)"; ctx.fillRect(x - W * .2, chao - H * .055, 5, 6); luzCor(x - W * .2, chao - H * .052, 22, .4, "255,60,40");
  if (o.fumaca) for (let i = 0; i < 6; i++) { const k = ((t * .5 + i / 6) % 1); ctx.fillStyle = `rgba(150,150,150,${.18 * (1 - k)})`; ctx.beginPath(); ctx.arc(x + W * .15 + k * 20, chao - H * .075 - k * H * .1, 8 + k * 22, 0, 7); ctx.fill(); }
}

Object.assign(CINE, {
  carro: { dur: 6.5, f(t, p) {
    const chao = H * .6; mataSeca(t, chao);
    ctx.fillStyle = "#0d0b09"; ctx.beginPath(); ctx.moveTo(0, chao + H * .02); ctx.lineTo(W, chao + H * .01); ctx.lineTo(W, chao + H * .09); ctx.lineTo(0, chao + H * .1); ctx.fill();
    const chega = p.parado ? 1 : cvSuave(cvSeg(t, 0, 2)), cx = cvMix(-W * .4, W * .42, chega);
    carro(cx, chao + H * .04, t, { fumaca: chega >= 1, farol: !p.apagado });
    if (p.sai) { const k = cvSuave(cvSeg(t, 2.6, 5.5)), x = cvMix(cx + W * .05, W * .95, k); if (t > 2.4) pessoa(x, chao + H * .04, H * .24, { fase: passo(x, H * .24), anda: k > 0 && k < 1 ? .9 : 0, luz: true }); }
    if (p.vem) { const k = cvSuave(cvSeg(t, 2.5, 6.5)); monstro(cvMix(-W * .1, cx - W * .26, k), chao + H * .04, H * .4, { fase: t * 2.5, anda: k < 1 ? .5 : 0, olhos: .6 + .4 * k, ...SECO }); }
    if (p.arvore) { const a = cvSeg(t, 3, 4.5); ctx.save(); ctx.translate(W * .9, chao); ctx.rotate(-.05 + Math.sin(t * 3) * .03 * a); arvoreSeca(0, 0, H * .45, 99, "#120c08"); ctx.restore(); olhosNoEscuro(W * .9, chao - H * .32, a, t); }
  } },
  capela: { dur: 6.5, f(t, p) {
    const chao = H * .6;
    if (p.dentro) {
      ctx.fillStyle = "#0e0a08"; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "#130e0a"; ctx.fillRect(0, chao, W, H);
      ctx.fillStyle = "#1a130d"; ctx.beginPath(); ctx.moveTo(W * .5, H * .02); ctx.lineTo(W * .75, H * .12); ctx.lineTo(W * .75, chao); ctx.lineTo(W * .25, chao); ctx.lineTo(W * .25, H * .12); ctx.fill();
      ctx.fillStyle = "rgba(160,190,230,.12)"; ctx.beginPath(); ctx.ellipse(W * .5, H * .2, W * .06, H * .06, 0, 0, 7); ctx.fill();
      ctx.strokeStyle = "#3a2a18"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(W * .5, H * .3); ctx.lineTo(W * .5, H * .42); ctx.moveTo(W * .46, H * .34); ctx.lineTo(W * .54, H * .34); ctx.stroke();
      ctx.fillStyle = "#241a10"; ctx.fillRect(W * .38, chao - H * .08, W * .24, H * .08);
      const lamp = p.lampiao ? cvSeg(t, .5, 1.2) : 0;
      ctx.fillStyle = `rgba(255,200,110,${.3 + .7 * lamp})`; ctx.fillRect(W * .58, chao - H * .11, 8, 12); luzCor(W * .58 + 4, chao - H * .1, H * .35 * (.3 + lamp), .4 * (.3 + lamp), "255,190,100");
      for (let i = 0; i < 4; i++) { ctx.fillStyle = "#1c140c"; ctx.fillRect(W * (.04 + (i % 2) * .7), chao - H * (.05 + (i > 1 ? .0 : 0)) + (i > 1 ? H * .06 : 0), W * .22, H * .025); }
      // sino e corda
      const bal = p.sino ? Math.sin(t * 5) * .5 * cvSeg(t, .8, 1.5) : Math.sin(t * .8) * .03;
      ctx.save(); ctx.translate(W * .5, H * .06); ctx.rotate(bal); ctx.fillStyle = "#5a4520"; ctx.beginPath(); ctx.moveTo(-16, 22); ctx.quadraticCurveTo(-14, 0, 0, 0); ctx.quadraticCurveTo(14, 0, 16, 22); ctx.fill(); ctx.restore();
      ctx.strokeStyle = "#6a5030"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(W * .5, H * .09); ctx.lineTo(W * .3 + bal * 30, chao - H * .14); ctx.stroke();
      if (p.sino) { pessoa(W * .3 + bal * 20, chao, H * .26, { inclina: -.15 + bal * .2, aro: "rgba(255,190,100,.3)" }); for (let i = 0; i < 3; i++) { const k = ((t * .8 + i / 3) % 1); ctx.strokeStyle = `rgba(255,220,160,${.25 * (1 - k)})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(W * .5, H * .08, 20 + k * W * .5, 0, 7); ctx.stroke(); } }
      else { const k = cvSuave(cvSeg(t, .3, 3)), x = cvMix(-W * .05, W * .32, k); pessoa(x, chao, H * .26, { fase: passo(x, H * .26), anda: k > 0 && k < 1 ? .8 : 0, luz: !p.lampiao, aro: "rgba(255,190,100,.3)" }); }
      if (p.porta) { const a = cvSeg(t, 2, 3.5); ctx.save(); ctx.globalAlpha = a; monstro(W * .88, chao, H * .4, { dir: -1, olhos: 1, cabeca: .2, ...SECO }); ctx.restore(); }
      return;
    }
    mataSeca(t, chao);
    const cx = W * .55, cw = W * .34, ch = H * .16;
    luzCor(cx, chao - ch, W * .7, .12, "200,190,170");
    ctx.fillStyle = "#221d18"; ctx.fillRect(cx - cw / 2, chao - ch, cw, ch);
    ctx.fillStyle = "#1a1612"; ctx.beginPath(); ctx.moveTo(cx - cw / 2 - 10, chao - ch); ctx.lineTo(cx, chao - ch - H * .08); ctx.lineTo(cx + cw / 2 + 10, chao - ch); ctx.fill();
    ctx.fillRect(cx - W * .04, chao - ch - H * .17, W * .08, H * .1);
    ctx.beginPath(); ctx.moveTo(cx - W * .05, chao - ch - H * .17); ctx.lineTo(cx, chao - ch - H * .22); ctx.lineTo(cx + W * .05, chao - ch - H * .17); ctx.fill();
    ctx.strokeStyle = "rgba(210,200,180,.22)"; ctx.lineWidth = 1.5; ctx.strokeRect(cx - cw / 2, chao - ch, cw, ch);
    ctx.beginPath(); ctx.moveTo(cx - cw / 2 - 10, chao - ch); ctx.lineTo(cx, chao - ch - H * .08); ctx.lineTo(cx + cw / 2 + 10, chao - ch); ctx.stroke();
    ctx.strokeRect(cx - W * .04, chao - ch - H * .17, W * .08, H * .1);
    ctx.strokeStyle = "#221d18"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, chao - ch - H * .22); ctx.lineTo(cx, chao - ch - H * .26); ctx.moveTo(cx - 7, chao - ch - H * .245); ctx.lineTo(cx + 7, chao - ch - H * .245); ctx.stroke();
    ctx.fillStyle = "rgba(90,70,40,.7)"; ctx.beginPath(); ctx.arc(cx, chao - ch - H * .125, 7, 0, 7); ctx.fill();
    const lj = .6 + .4 * Math.sin(t * 6) * Math.sin(t * 2.3);
    ctx.fillStyle = `rgba(255,190,100,${.65 * lj})`; ctx.beginPath(); ctx.ellipse(cx - cw * .25, chao - ch * .55, 7, 13, 0, 0, 7); ctx.ellipse(cx + cw * .25, chao - ch * .55, 7, 13, 0, 0, 7); ctx.fill();
    luzCor(cx, chao - ch * .5, H * .25, .18 * lj, "255,190,100");
    ctx.fillStyle = "#050404"; ctx.fillRect(cx - cw * .08, chao - ch * .55, cw * .16, ch * .55);
    ctx.fillStyle = "#2a2a2a"; ctx.fillRect(cx - 4, chao - ch * .32, 8, 8);
    const k = cvSuave(cvSeg(t, .3, 4)), x = cvMix(-W * .05, cx - cw * .45, k);
    pessoa(x, chao + 4, H * .24, { fase: passo(x, H * .24), anda: k > 0 && k < 1 ? .9 : 0, luz: true });
    if (p.cerco) for (let i = 0; i < 4; i++) olhosNoEscuro(W * (.08 + i * .27), chao - H * (.25 + (i % 2) * .08), cvSeg(t, 2 + i * .5, 2.5 + i * .5), t);
  } },
  cemiterio: { dur: 6.5, f(t, p) {
    const chao = H * .6; mataSeca(t, chao);
    for (let i = 0; i < 7; i++) {
      const x = W * (.06 + i * .14), y = chao + H * (i % 2 ? .02 : .05), h = H * (.05 + cvRnd(i) * .03), inc = (cvRnd(i * 3) - .5) * .25;
      ctx.save(); ctx.translate(x, y); ctx.rotate(inc); ctx.fillStyle = "#1a1816";
      if (i % 3) { ctx.fillRect(-3, -h, 6, h); ctx.fillRect(-11, -h * .75, 22, 5); } else { ctx.beginPath(); ctx.moveTo(-12, 0); ctx.lineTo(-12, -h * .7); ctx.quadraticCurveTo(0, -h * 1.2, 12, -h * .7); ctx.lineTo(12, 0); ctx.fill(); }
      ctx.restore();
    }
    const gx = W * .5, gy = chao + H * .07;
    ctx.fillStyle = "#020202"; ctx.beginPath(); ctx.ellipse(gx, gy, W * .14, H * .022, 0, 0, 7); ctx.fill();
    ctx.fillStyle = "#1e1710"; ctx.beginPath(); ctx.ellipse(gx + W * .2, gy - 4, W * .07, H * .02, 0, 0, 7); ctx.fill();
    ctx.fillStyle = "#24211d"; ctx.fillRect(gx - 14, gy - H * .085, 28, H * .07); ctx.fillStyle = "rgba(0,0,0,.6)"; ctx.font = `600 ${Math.max(9, H * .012)}px "JetBrains Mono", monospace`; ctx.fillText("1888", gx - 13, gy - H * .045);
    if (p.ele) { const k = cvSuave(cvSeg(t, 1, 4)); ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, gy); ctx.clip(); monstro(gx, gy + H * .4 * (1 - k), H * .4, { olhos: k, cabeca: .3, ...SECO }); ctx.restore(); }
    if (p.agachado !== false) { const k = cvSuave(cvSeg(t, .3, 3)), x = cvMix(-W * .05, W * .2, k); pessoa(x, chao + H * .06, H * .22, { fase: passo(x, H * .22), anda: k > 0 && k < 1 ? .8 : 0, luz: true, inclina: k >= 1 ? .35 : 0 }); }
  } },
  mataSeca: { dur: 6.5, f(t, p) {
    const chao = H * .6, corre = !!p.corre, k = p.para ? cvSuave(cvSeg(t, .3, 4.5)) : 1, sc = p.para ? k * W * 1.2 : Math.max(0, t - .3) * W * (corre ? .7 : .25);
    mataSeca(t, chao, sc);
    if (p.abraco) { const ax = W * 1.5 - Math.min(sc, W * .85); ctx.save(); ctx.translate(ax, chao); arvoreSeca(0, 0, H * .5, 33, "#120c08"); ctx.restore(); if (!ameaca) monstro(ax + 14, chao, H * .38, { dir: 1, olhos: 0, cabeca: 1.1, ...SECO }); }
    if (p.mao && t > 3) { const a = cvSeg(t, 3, 3.6); ctx.strokeStyle = "#140d07"; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(W * .75, chao - H * .2); ctx.lineTo(W * .75 - a * W * .25, chao - H * .19); ctx.stroke(); for (let d = -1; d <= 1; d++) { ctx.beginPath(); ctx.moveTo(W * .75 - a * W * .25, chao - H * .19); ctx.lineTo(W * .75 - a * W * .25 - 12, chao - H * .19 + d * 7); ctx.stroke(); } }
    const andando = p.para ? k > 0 && k < 1 : t > .3;
    pessoa(W * .38, chao, H * .25, { fase: sc / (H * .05), anda: andando ? (corre ? 1.25 : .9) : 0, luz: true, inclina: corre ? .1 : 0 });
    if (corre && !ameaca) { const mx = W * .02 + Math.sin(t * 2) * 15; monstro(mx, chao, H * .42, { fase: t * 6, anda: 1, olhos: .9, ...SECO }); }
    const g = ctx.createRadialGradient(W * .6, chao - H * .14, 30, W * .45, chao - H * .1, W * .85);
    g.addColorStop(0, "rgba(2,2,2,0)"); g.addColorStop(1, "rgba(2,2,2,.75)"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  } },
});

const CORPOSECO = {
  inicio: {
    hora: "23:40", lugar: "Estrada de terra · Mata do Cedro", cine: ["carro", { arvore: true }],
    texto: "O carro morre no meio da Mata do Cedro. Sem sinal no celular. Na beira da estrada, todas as árvores estão secas, cinzentas, como se algo tivesse bebido a vida delas. E uma delas acabou de se mexer.",
    escolhas: [op("Tentar dar partida de novo", "partida"), op("Trancar as portas e apagar os faróis", "trancar"), op("Sair e andar até a luz ao longe", "luz")],
    fx: { ver: [], sons: ["galho"], amb: { drone: .7, vento: .6 } },
  },
  partida: {
    hora: "23:41", lugar: "Dentro do carro", cine: ["carro", { parado: true, vem: true }],
    texto: "O motor tosse e não pega. Pelo retrovisor, uma figura magra, cor de casca de árvore, vem andando pelo meio da estrada. Sem pressa. Cada passo estala como galho seco.",
    acao: { tipo: "tocar", rotulo: "Gire a chave! Toque rápido!", n: 15, limite: 5, ok: "partida2", falha: "trancar" },
    fx: { ver: [], sons: ["passos", "coracao"], amb: { drone: .9, vento: .4 } },
  },
  partida2: {
    hora: "23:42", lugar: "Estrada de terra", cine: ["carro", { parado: true, vem: true }],
    texto: "O motor pega por três segundos e morre. Os faróis piscam e iluminam ele de corpo inteiro: pele seca colada nos ossos, olhos fundos, a boca aberta como um buraco de árvore.",
    escolhas: [op("Correr para a mata", "corre_mata"), op("Se esconder no banco de trás", "trancar")],
    fx: { ver: ["vermelho"], sons: ["coracao"], amb: { drone: 1 }, susto: true },
  },
  trancar: {
    hora: "23:43", lugar: "Banco de trás", cine: ["carro", { parado: true, apagado: true }],
    texto: "Você se deita no banco de trás, com a respiração presa. Passos secos rodeiam o carro. Ele para do lado da sua janela e encosta o rosto no vidro.",
    acao: { tipo: "esconder", rotulo: "Segure para não respirar quando ele olhar", dur: 10, folego: 3.2, ok: "passou", falha: "f_seco", ...SECO },
    fx: { ver: [], sons: ["respira", "coracao"], amb: { drone: 1, vento: .3 } },
  },
  passou: {
    hora: "23:50", lugar: "Estrada de terra", ganha: "Terço de madeira", cine: ["carro", { parado: true, apagado: true }],
    texto: "Ele segue estrada abaixo e entra na mata. A árvore em que encostou ficou preta, rachada. No chão, perto da sua porta, ficou um terço de madeira, velho, quebrado numa ponta.",
    escolhas: [op("Abrir o porta-malas", "portamalas"), op("Seguir a luz ao longe", "luz"), op("Esperar o dia amanhecer no carro", "f_galhos")],
    fx: { ver: [], sons: ["item"], amb: { drone: .7, vento: .5 } },
  },
  portamalas: {
    hora: "23:52", lugar: "Porta-malas", ganha: "Sal grosso", cine: ["carro", { parado: true, sai: true }],
    texto: "Lá no fundo do porta-malas, o saco de sal grosso do churrasco de domingo. Você não sabe por quê, mas leva junto. Sua avó dizia que sal espanta coisa ruim.",
    escolhas: [op("Seguir a luz ao longe", "luz")],
    fx: { ver: [], sons: ["item"], amb: { drone: .7, vento: .5 } },
  },
  corre_mata: {
    hora: "23:43", lugar: "Mata fechada", cine: ["mataSeca", { corre: true }],
    texto: "Você corre para dentro da mata. Galhos batem no seu rosto. Atrás de você, os estalos vêm cada vez mais rápidos. Ele também está correndo.",
    acao: { tipo: "tocar", rotulo: "Corra! Toque rápido!", n: 18, limite: 6, ok: "luz", falha: "f_seco" },
    fx: { ver: [], sons: ["correndo", "galho"], amb: { drone: 1, vento: .7 } },
  },
  luz: {
    hora: "00:05", lugar: "Mata do Cedro", cine: ["mataSeca", { para: true }],
    texto: "A luz vem de uma capela no meio de uma clareira. No caminho até lá, a mata fica cada vez mais seca, e os galhos se mexem sem vento nenhum.",
    escolhas: [op("Ir pela trilha", "trilha_c"), op("Cortar caminho pelo mato fechado", "mato")],
    fx: { ver: [], sons: ["galho"], amb: { drone: .8, vento: .6 } },
  },
  trilha_c: {
    hora: "00:12", lugar: "Trilha da clareira", cine: ["mataSeca", { para: true, abraco: true }],
    texto: "No meio da trilha, ele está de costas, abraçado numa árvore verde. A árvore está secando enquanto você olha, as folhas caindo todas de uma vez. Você precisa passar por trás dele.",
    acao: { tipo: "avancar", rotulo: "Passe por trás dele sem ser visto", n: 12, limite: 30, ok: "capela", falha: "f_seco", ...SECO },
    fx: { ver: [], sons: ["coracao"], amb: { drone: 1, vento: .4 } },
  },
  mato: {
    hora: "00:10", lugar: "Mato fechado", cine: ["mataSeca", { para: true, mao: true }],
    texto: "O mato fechado arranha seus braços. Então, de dentro de um tronco oco, sai um braço seco e comprido, tateando o ar a um palmo do seu rosto.",
    acao: { tipo: "esconder", rotulo: "Segure para ficar imóvel", dur: 8, folego: 3.2, ok: "cemiterio", falha: "f_seco", ...SECO },
    fx: { ver: [], sons: ["respira"], amb: { drone: 1 }, susto: true },
  },
  cemiterio: {
    hora: "00:18", lugar: "Cemitério da capela", cine: ["cemiterio", {}],
    texto: "Atrás da capela, um cemitério abandonado. Uma cova está aberta, vazia, com a terra revirada. Na lápide, nenhum nome. Só um ano: <span class='msg'>1888</span>.",
    escolhas: [op("Ler as outras lápides", "lapides"), op("Ir para a porta da capela", "capela")],
    fx: { ver: [], sons: ["galho"], amb: { drone: .8, vento: .5 } },
  },
  lapides: {
    hora: "00:20", lugar: "Cemitério", cine: ["cemiterio", { agachado: true }],
    texto: "Todas as lápides têm o mesmo sobrenome. A mais nova, de mármore rachado, diz: <span class='msg'>CORONEL TIBÚRCIO · 1888 · A TERRA NÃO O QUIS</span>.",
    escolhas: [op("Esperar escondido perto da cova vazia", "emboscada"), op("Ir para a capela", "capela")],
    fx: { ver: [], amb: { drone: .9, vento: .4 } },
  },
  emboscada: {
    hora: "01:00", lugar: "Atrás de uma lápide", cine: ["cemiterio", { ele: true, agachado: false }],
    texto: "Você se agacha atrás de uma lápide. À uma da manhã em ponto, ele volta para a cova, como faz todas as noites, cheirando o ar, procurando quem está ali.",
    acao: { tipo: "esconder", rotulo: "Segure para não ser visto", dur: 10, folego: 3.2, ok: "cova", falha: "f_seco", ...SECO },
    fx: { ver: [], sons: ["passos", "coracao"], amb: { drone: 1 } },
  },
  cova: {
    hora: "01:04", lugar: "Cova aberta", cine: ["cemiterio", { ele: true, agachado: false }],
    texto: "Ele deita na cova. Mas a terra se mexe e o empurra de volta para fora, como se cuspisse. Ele se levanta devagar. E vira a cabeça direto para a sua lápide.",
    tempo: 6, aoAcabar: "f_seco",
    escolhas: [op("Jogar o sal grosso na terra da cova", "f_descanso", { req: "Sal grosso" }), op("Correr para a capela", "corrida")],
    fx: { ver: ["vermelho"], sons: ["coracao"], amb: { drone: 1 }, susto: true },
  },
  corrida: {
    hora: "01:05", lugar: "Entre as lápides", cine: ["mataSeca", { corre: true }],
    texto: "Você corre entre as lápides. Ele vem atrás, de quatro, rápido demais para algo tão seco.",
    acao: { tipo: "tocar", rotulo: "Corra até a capela!", n: 16, limite: 5, ok: "dentro", falha: "f_seco" },
    fx: { ver: [], sons: ["correndo", "coracao"], amb: { drone: 1 } },
  },
  capela: {
    hora: "00:25", lugar: "Porta da capela", cine: ["capela", {}],
    texto: "A porta da capela está fechada com um cadeado antigo, de quatro números. Alguém riscou na madeira, com a unha: <span class='msg'>o ano em que a terra o recusou</span>.",
    acao: { tipo: "codigo", rotulo: "Digite o código do cadeado", resposta: "1888", tentativas: 2, ok: "dentro", falha: "cerco" },
    fx: { ver: [], sons: ["galho"], amb: { drone: .8, vento: .5 } },
  },
  cerco: {
    hora: "00:27", lugar: "Clareira", cine: ["capela", { cerco: true }],
    texto: "O cadeado trava. Em volta da clareira, galhos estalam um atrás do outro. Ele está chegando, pulando de árvore em árvore. Você se encolhe no canto escuro da capela.",
    acao: { tipo: "esconder", rotulo: "Segure para ficar no escuro", dur: 10, folego: 3.2, ok: "lateral", falha: "f_seco", ...SECO },
    fx: { ver: [], sons: ["galho", "coracao"], amb: { drone: 1, vento: .5 } },
  },
  lateral: {
    hora: "00:30", lugar: "Lateral da capela", cine: ["capela", {}],
    texto: "Quando ele some na mata, você percebe: uma janelinha lateral da capela está quebrada. Dá para entrar.",
    escolhas: [op("Entrar pela janela", "dentro")],
    fx: { ver: [], amb: { drone: .8 } },
  },
  dentro: {
    hora: "00:32", lugar: "Dentro da capela", cine: ["capela", { dentro: true }],
    texto: "Bancos de madeira podre. Um sino pendurado no teto, com a corda descendo até o chão. No altar, um livro antigo e um lampião apagado.",
    escolhas: [op("Ler o livro do altar", "livro"), op("Acender o lampião", "lampiao"), op("Tocar o sino", "sino")],
    fx: { ver: [], sons: ["rangido"], amb: { drone: .6 } },
  },
  livro: {
    hora: "00:33", lugar: "Altar", cine: ["capela", { dentro: true }],
    texto: "O padre escreveu com letra apressada: <span class='msg'>O Corpo-Seco só descansa em terra santa. Sal na cova, terço nas mãos, e o sino tocando até ele deitar. Nunca deixe o sino parar.</span>",
    escolhas: [op("Acender o lampião", "lampiao"), op("Tocar o sino", "sino")],
    fx: { ver: [], sons: ["papel"], amb: { drone: .6 } },
  },
  lampiao: {
    hora: "00:35", lugar: "Dentro da capela", ganha: "Lampião", cine: ["capela", { dentro: true, lampiao: true, porta: true }],
    texto: "Uma luz amarela enche a capela. Na porta, parado, ele olha a chama e não entra. Ele não gosta de luz. Mas também não vai embora.",
    escolhas: [op("Tocar o sino", "sino"), op("Sair com o lampião pelo cemitério", "emboscada")],
    fx: { ver: [], sons: ["religar"], amb: { drone: .7 } },
  },
  sino: {
    hora: "00:38", lugar: "Corda do sino", cine: ["capela", { dentro: true, sino: true, porta: true }],
    texto: "Você puxa a corda com toda a força. O sino toca alto, e o som corre pela mata inteira. Na porta, ele grita, um som de madeira rachando, e se arrasta para dentro.",
    acao: { tipo: "segurar", rotulo: "Segure a corda! Não deixe o sino parar!", dur: 6, limite: 11, ok: "caido", falha: "f_badalada" },
    fx: { ver: [], sons: ["campainha", "coracao"], amb: { drone: 1 } },
  },
  caido: {
    hora: "00:40", lugar: "Dentro da capela", cine: ["capela", { dentro: true, porta: true, lampiao: true }],
    texto: "Ele cai de joelhos no chão da capela, tremendo a cada badalada que ainda ecoa. Os dedos secos arranham a madeira, tentando chegar até você.",
    escolhas: [op("Colocar o terço nas mãos dele", "f_terco", { req: "Terço de madeira" }), op("Arrastá-lo até a cova com sal", "f_descanso", { req: "Sal grosso" }), op("Fugir pela estrada", "f_estrada"), op("Lembrar quem ele foi", "lembranca", { minFinais: 4 })],
    fx: { ver: [], sons: ["respira"], amb: { drone: .8 } },
  },
  lembranca: {
    hora: "00:41", lugar: "Dentro da capela",
    texto: "Você lembra de cada noite nesta estrada, de cada final. E entende o que o livro não diz: ninguém nunca rezou por ele. Nem quando ele morreu. Ele não quer te matar. Quer que alguém faça isso.",
    escolhas: [op("Rezar por ele, segurando a mão seca", "f_perdao")],
    fx: { ver: [], sons: ["fimEstranho"], amb: { drone: .5 } },
  },
  f_seco: { fim: true, tipo: "ruim", titulo: "Seco", hora: "00:??", lugar: "Mata do Cedro", cine: ["mataSeca", { para: true }],
    texto: "A mão seca fecha no seu braço. Você sente a vida escorrendo como água em terra rachada. Amanhã, na beira da estrada, vai ter uma árvore seca a mais, com o formato de alguém correndo.",
    fx: { ver: ["vermelho"], sons: ["fimRuim"], amb: { drone: 1 } } },
  f_badalada: { fim: true, tipo: "ruim", titulo: "Última Badalada", hora: "00:39", lugar: "Dentro da capela", cine: ["capela", { dentro: true, porta: true }],
    texto: "A corda escorrega da sua mão. O sino para. No silêncio, os passos secos atravessam a capela, um por um, até parar bem atrás de você.",
    fx: { ver: ["vermelho"], sons: ["fimRuim"], amb: { drone: 1 } } },
  f_descanso: { fim: true, tipo: "bom", titulo: "Terra Santa", hora: "01:10", lugar: "Cemitério da capela", cine: ["cemiterio", { agachado: true }],
    texto: "O sal cai na terra e a cova para de tremer. Ele deita, e desta vez a terra aceita. Ela se fecha devagar sobre ele. Ao redor, as árvores secas soltam brotos verdes, pequenos, novos.",
    fx: { ver: [], sons: ["fimBom"], amb: { drone: .3 } } },
  f_terco: { fim: true, tipo: "bom", titulo: "O Terço", hora: "00:42", lugar: "Dentro da capela", cine: ["capela", { dentro: true, lampiao: true }],
    texto: "Você fecha os dedos secos em volta do terço. Ele para de tremer. O corpo se desfaz em poeira de madeira, devagar, como quem finalmente pode descansar. Lá fora, o vento volta a soprar.",
    fx: { ver: [], sons: ["fimBom"], amb: { drone: .3 } } },
  f_estrada: { fim: true, tipo: "estranho", titulo: "Estrada de Terra", hora: "01:30", lugar: "Estrada de terra", cine: ["carro", { parado: true }],
    texto: "Você corre até o carro. Desta vez o motor pega de primeira. Você acelera sem olhar para trás. Mas, pelo retrovisor, uma árvore seca anda pela estrada atrás de você, até a última curva.",
    fx: { ver: [], sons: ["fimEstranho"], amb: { drone: .5 } } },
  f_galhos: { fim: true, tipo: "estranho", titulo: "Galhos", hora: "06:10", lugar: "Algum lugar da Mata do Cedro", cine: ["mataSeca", { para: true }],
    texto: "Você espera o sol nascer. Quando abre a porta, o carro não está mais na estrada. Está no meio da mata fechada, a quilômetros de tudo, cercado de árvores secas que não estavam ali ontem.",
    fx: { ver: ["manha"], sons: ["fimEstranho"], amb: { drone: .4 } } },
  f_perdao: { fim: true, tipo: "secreto", titulo: "Perdão", hora: "01:00", lugar: "Dentro da capela", cine: ["capela", { dentro: true, lampiao: true }],
    texto: "Você reza baixinho, segurando a mão seca. Ela fica quente. Por um instante, você vê um homem velho, chorando, pedindo desculpas a alguém que não está ali. Depois, só poeira. E a mata inteira fica verde de novo antes de o sol nascer.",
    fx: { ver: [], sons: ["fimBom"], amb: { drone: .3 } } },
};

/* entra como 3ª fase do menu */
(() => {
  const nova = { titulo: "Corpo-Seco", genero: "Folclore", cor: "#e3b46b", libera: 1,
    gancho: "Seu carro morre numa estrada de terra no meio da mata. Todas as árvores em volta estão secas. E uma delas se mexe.",
    mec: "Esconder · passar sem ser visto · sino", nos: CORPOSECO, terror: true };
  const ordem = Object.keys(FASES), tudo = Object.assign({}, FASES, { corposeco: nova });
  ordem.splice(2, 0, "corposeco");
  for (const k of Object.keys(FASES)) delete FASES[k];
  ordem.forEach(k => { FASES[k] = tudo[k]; });
})();
