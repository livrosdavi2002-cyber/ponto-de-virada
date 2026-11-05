/* ============================================================
   ROÇA ASSOMBRADA
   Um sítio aconchegante para plantar, regar, pescar e vender...
   até a mata começar a estalar. Mecânicas de sobrevivência com
   regras: cada assombração tem um som e um jeito de escapar.
   Objetivo: consertar a caminhonete e ir embora.
   ============================================================ */
(() => {
const MW = 52, MH = 38;                       // mapa em "quadradinhos"
const CERCA = { x0: 6, y0: 5, x1: 46, y1: 33 };
const CASA = { x: 10, y: 7, w: 6, h: 4.4, porta: { x: 13, y: 11.6 } };
const POCO = { x: 19.5, y: 9.6 }, CAIXOTE = { x: 16.8, y: 12 }, CAMINHONETE = { x: 25.2, y: 31.2 };
const CEMITERIO = { x0: 39, y0: 24, x1: 45, y1: 31 }, CRUZ = { x: 42, y: 27.2 };
const GALINHEIRO = { x: 27, y: 6.6, w: 4, h: 3, porta: { x: 29, y: 9.8 } }, CERCADO = { x0: 25.5, y0: 6.2, x1: 33, y1: 12 };
const CELEIRO = { x: 36, y: 6.5, w: 7, h: 5 }, TRATOR = { x: 44, y: 13.2 };
const CASINHA = { x: 7.6, y: 9.6 }, CATAVENTO = { x: 23, y: 17.4 }, VARAL = { x0: 17.4, x1: 21.6, y: 6.8 };
const DOCA = { x: 31.4, y: 27.4 };
const LAGO = { x0: 32, y0: 24, x1: 38.4, y1: 31 };
const POMAR = [[36, 16.5], [39, 16.5], [42, 16.5], [36, 19.8], [39, 19.8], [42, 19.8]];
const CANTEIROS = [
  { x: 9, y: 15, w: 4, h: 3, preco: 0 }, { x: 14.5, y: 15, w: 4, h: 3, preco: 30 }, { x: 25, y: 15, w: 4, h: 3, preco: 60 },
  { x: 9, y: 20, w: 4, h: 3, preco: 100 }, { x: 14.5, y: 20, w: 4, h: 3, preco: 150 }, { x: 25, y: 20, w: 4, h: 3, preco: 220 }];
const PLANTAS = {
  milho: { nome: "Milho", tempo: 7, preco: 4, cor: "#e8c84a" },
  mandioca: { nome: "Mandioca", tempo: 10, preco: 8, cor: "#c89a6a" },
  abobora: { nome: "Abóbora", tempo: 14, preco: 17, cor: "#e07a2a", custo: 40 },
  melancia: { nome: "Melancia", tempo: 18, preco: 30, cor: "#4a9a3a", custo: 90 } };
const EXTRAS = { ovo: ["Ovo", 3], laranja: ["Laranja", 4] };
const PEIXES = [["Lambari", 6, .55], ["Tilápia", 12, .33], ["Traíra", 22, .12]];
const DIA = 160, NOITE = 85, CICLO = DIA + NOITE;
const PLACAS = [
  { x: 8.2, y: 13.4, txt: "Quando a mata estalar, entre em casa. Ele corre de quatro. Não olhe para trás." },
  { x: 33.6, y: 13.6, txt: "Não chegue perto do cachorro preto." },
  { x: 38.4, y: 27.6, txt: "Toda noite uma alma pede uma vela. Traga a vela até a cruz do cemitério antes do sol nascer." },
  { x: 16.6, y: 25.4, txt: "Lamparina apagada, não durma. Ela sobe pelo pé da cama." },
  { x: 30.8, y: 10.6, txt: "As galinhas botam toda manhã. Laranja madura no pomar dá dinheiro." }];
const COSMETICOS = [["palha", "Chapéu de palha", 0, "#d8b860"], ["vermelho", "Chapéu vermelho", 2, "#b8382a"], ["azul", "Chapéu azul", 3, "#3a5a9a"], ["preto", "Chapéu preto", 4, "#1e1e22"], ["branco", "Chapéu branco", 6, "#e8e4d8"]];
// a casa por dentro (vista de cima): 10 x 7
const SALA = { w: 10, h: 7, porta: { x: 5, y: 6.6 } };
const MOVEIS = [[.4, .5, 2.6, 2.1, "cama"], [3.6, .4, 1.6, 1.1, "fogao"], [7.4, .4, 2.2, 1.1, "bancada"], [4.1, 2.9, 1.8, 1.2, "mesa"], [8.7, 2.4, .9, 2.4, "armario"], [.4, 4.6, 1, 1, "balanco"]];

let cv, c, W = 0, H = 0, DPRr = 1, TS = 48, luzCv, lc, chaoCv, rodando = false, ultimo = 0, R = null, painelAberto = false;
const ls = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } };
const rnd = (a, b) => a + Math.random() * (b - a), cl = (v, a, b) => Math.max(a, Math.min(b, v)), mix = (a, b, k) => a + (b - a) * k;
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
let semente = 1; const srnd = () => { semente = (semente * 16807) % 2147483647; return (semente - 1) / 2147483646; };

/* ---------- som (WebAudio, com posição no espaço) ---------- */
function somEm(x, y) { if (!R) return [1, 0]; const p = R.dentro ? CASA.porta : R.eu, d = Math.hypot(x - p.x, y - p.y); return [cl(1 - d / 16, 0, 1), cl((x - p.x) / 9, -1, 1)]; }
function tocarTom(f, dur, o = {}) {
  if (!AC || mudo) return; const { tipo = "sine", vol = .1, ate = null, quando = 0, atk = .01, pan = 0, lp = null, wet = .3 } = o;
  const t = AC.currentTime + quando, os = AC.createOscillator(), g = AC.createGain(), p = AC.createStereoPanner();
  os.type = tipo; os.frequency.setValueAtTime(f, t); if (ate) os.frequency.exponentialRampToValueAtTime(ate, t + dur);
  let n = os; if (lp) { const fl = AC.createBiquadFilter(); fl.type = "lowpass"; fl.frequency.value = lp; os.connect(fl); n = fl; }
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(Math.max(.0002, vol), t + atk); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  p.pan.value = pan; n.connect(g).connect(p).connect(OUT); if (wet) { const s = AC.createGain(); s.gain.value = wet; p.connect(s).connect(REV); }
  os.start(t); os.stop(t + dur + .05);
}
function tocarRuido(dur, o = {}) {
  if (!AC || mudo || !NB) return; const { filtro = "bandpass", f = 800, q = 1, vol = .2, quando = 0, atk = .005, pan = 0, ate = null, wet = .3 } = o;
  const t = AC.currentTime + quando, s = AC.createBufferSource(), fl = AC.createBiquadFilter(), g = AC.createGain(), p = AC.createStereoPanner();
  s.buffer = NB; s.loop = true; fl.type = filtro; fl.frequency.setValueAtTime(f, t); fl.Q.value = q; if (ate) fl.frequency.exponentialRampToValueAtTime(ate, t + dur);
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(Math.max(.0002, vol), t + atk); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  p.pan.value = pan; s.connect(fl).connect(g).connect(p).connect(OUT); if (wet) { const w = AC.createGain(); w.gain.value = wet; p.connect(w).connect(REV); }
  s.start(t, Math.random()); s.stop(t + dur + .05);
}
const S = {
  passo() { tocarRuido(.06, { filtro: "lowpass", f: 420, vol: .05, wet: 0 }); },
  plantar() { tocarRuido(.12, { filtro: "lowpass", f: 300, vol: .2 }); tocarTom(180, .12, { vol: .08, ate: 90 }); },
  regar() { tocarRuido(.5, { filtro: "highpass", f: 2600, vol: .07, atk: .05 }); },
  colher() { tocarTom(660, .12, { vol: .08 }); tocarTom(990, .18, { vol: .06, quando: .07 }); },
  pronto(x, y) { const [v, p] = somEm(x, y); tocarTom(1320, .4, { vol: .05 * v + .01, pan: p, wet: .6 }); tocarTom(1760, .5, { vol: .035 * v + .008, pan: p, quando: .12, wet: .6 }); },
  moedas() { [1200, 1500, 1800].forEach((f, i) => tocarTom(f, .12, { tipo: "triangle", vol: .06, quando: i * .07 })); },
  poco() { tocarRuido(.9, { filtro: "lowpass", f: 500, vol: .12, atk: .2 }); tocarTom(300, .2, { vol: .05, quando: .7, wet: .8 }); },
  miau(x, y) { const [v, p] = somEm(x, y); tocarTom(700, .35, { tipo: "triangle", vol: .05 * v, ate: 520, pan: p, lp: 2000 }); },
  queda() { tocarRuido(.08, { filtro: "lowpass", f: 600, vol: .1 }); },
  estalos(x, y) { const [v, p] = somEm(x, y); for (let i = 0; i < 7; i++) tocarRuido(.05, { f: 1400 + Math.random() * 900, q: 4, vol: (.25 + Math.random() * .2) * (v * .7 + .3), pan: p, quando: i * .18 + Math.random() * .1, wet: .5 }); tocarTom(70, 1.6, { tipo: "sawtooth", vol: .06 * (v * .6 + .4), ate: 55, pan: p, lp: 300, quando: .8, atk: .4 }); },
  suspiro(x, y) { const [v, p] = somEm(x, y); tocarRuido(1.8, { filtro: "bandpass", f: 500, ate: 220, q: .8, vol: .1 * (v * .6 + .4), atk: .5, pan: p, wet: .7 }); },
  rosnado(x, y) { const [v, p] = somEm(x, y); tocarTom(65, 1.2, { tipo: "sawtooth", vol: .14 * (v * .5 + .5), ate: 95, pan: p, lp: 500 }); tocarRuido(1.2, { filtro: "lowpass", f: 300, vol: .2 * (v * .5 + .5), pan: p }); },
  uivo(x, y) { const [v, p] = somEm(x, y); tocarTom(380, 1.8, { vol: .06 * (v * .5 + .5), ate: 620, pan: p, atk: .4, wet: .8 }); },
  sino(x, y) { const [v, p] = somEm(x, y); [523, 1046, 1571].forEach((f, i) => tocarTom(f, 2.4, { vol: (.06 / (i + 1)) * (v * .9 + .1), pan: p, wet: .8 })); },
  apaga() { tocarRuido(.4, { filtro: "highpass", f: 1500, vol: .08, atk: .02 }); },
  respira() { tocarRuido(1.2, { filtro: "bandpass", f: 700, vol: .1, atk: .5, wet: .4 }); },
  susto() { tocarRuido(1.2, { filtro: "bandpass", f: 2000, ate: 600, vol: .5, wet: .4 }); tocarTom(900, 1, { tipo: "sawtooth", vol: .2, ate: 200, lp: 3000 }); tocarTom(45, 1.4, { vol: .5, ate: 30 }); },
  peixe() { tocarRuido(.3, { filtro: "highpass", f: 1500, vol: .12 }); tocarTom(440, .1, { vol: .06, quando: .05 }); },
  fisga() { tocarTom(880, .08, { vol: .08 }); tocarTom(1100, .1, { vol: .08, quando: .09 }); },
  porta() { tocarTom(130, .5, { tipo: "sawtooth", vol: .04, ate: 190, lp: 800, atk: .1 }); },
  vitoria() { [523, 659, 784, 1046].forEach((f, i) => tocarTom(f, .6, { tipo: "triangle", vol: .08, quando: i * .15, wet: .5 })); },
  uivoSeco(x, y) { const [v, p] = somEm(x, y); tocarTom(700, 1.4, { tipo: "sawtooth", vol: .08 * (v * .6 + .4), ate: 160, lp: 2400, pan: p, wet: .7 }); tocarRuido(1.2, { f: 1600, ate: 400, q: 2, vol: .18 * (v * .6 + .4), pan: p, wet: .6 }); },
  motor() { tocarTom(45, 2.5, { tipo: "sawtooth", vol: .1, ate: 70, lp: 300, atk: .3 }); },
};
// música baixinha: dedilhado de dia, grilos e um zumbido grave de noite
let musicaT = 0, notaI = 0;
const ESCALA = [196, 220, 246.9, 293.7, 329.6, 392, 440, 493.9];
function musicaPasso(dt) {
  if (!R || !AC || mudo) return; musicaT -= dt; if (musicaT > 0) return;
  const noite = horaNoite() > .5;
  if (!noite) { musicaT = .62; const padrao = [0, 2, 4, 2, 5, 4, 2, 1, 0, 3, 5, 3, 6, 5, 3, 1]; const n = ESCALA[padrao[notaI % padrao.length]] * (notaI % 32 < 16 ? 1 : .89); tocarTom(n, 1.4, { tipo: "triangle", vol: .014, lp: 1400, wet: .4 }); if (notaI % 4 === 0) tocarTom(n / 2, 2.4, { vol: .012, lp: 600, wet: .5 }); if (Math.random() < .08) { const f = rnd(2400, 3400); tocarTom(f, .08, { vol: .012, ate: f * 1.3, pan: rnd(-1, 1) }); tocarTom(f * 1.1, .07, { vol: .01, quando: .1, pan: rnd(-1, 1) }); } }
  else { musicaT = .9; if (notaI % 6 === 0) tocarTom(55, 5.6, { tipo: "sawtooth", vol: .012, lp: 180, atk: 1.5, wet: .5 }); if (Math.random() < .55) { const pp = rnd(-1, 1); for (let i = 0; i < 3; i++) tocarTom(4200, .03, { vol: .006, quando: i * .06, pan: pp, wet: .2 }); } }
  notaI++;
}

/* ---------- estado ---------- */
function novoJogo() {
  semente = 7;
  const solido = Array.from({ length: MH }, (_, y) => Array.from({ length: MW }, (_, x) => x < CERCA.x0 || x >= CERCA.x1 || y < CERCA.y0 || y >= CERCA.y1));
  const bloq = (x0, y0, w, h) => { for (let y = Math.floor(y0); y < y0 + h; y++) for (let x = Math.floor(x0); x < x0 + w; x++) if (solido[y] && x >= 0 && x < MW) solido[y][x] = true; };
  bloq(CASA.x, CASA.y, CASA.w, CASA.h - .4); bloq(19, 9, 1, 1); bloq(LAGO.x0, LAGO.y0, LAGO.x1 - LAGO.x0, LAGO.y1 - LAGO.y0); bloq(24, 30.4, 3, 1.4);
  bloq(GALINHEIRO.x, GALINHEIRO.y, GALINHEIRO.w, GALINHEIRO.h - .2); bloq(CELEIRO.x, CELEIRO.y, CELEIRO.w, CELEIRO.h - .3); bloq(43, 12.6, 2, 1);
  bloq(7, 9, 1, 1); bloq(23, 17, 1, 1); bloq(41.6, 26.8, 1, 1);
  // cercadinho das galinhas (com portãozinho embaixo)
  for (let y = 6; y < 12; y++) { solido[y][25] = true; solido[y][32] = true; } for (let x = 25; x <= 32; x++) if (x !== 28 && x !== 29) solido[11][x] = true;
  POMAR.forEach(([x, y]) => bloq(x - .2, y - .2, .4, .4));
  const arvores = [];
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { const fora = x < CERCA.x0 || x >= CERCA.x1 || y < CERCA.y0 || y >= CERCA.y1; if (fora && !(x >= 22 && x <= 28 && y >= CERCA.y1) && srnd() < .55) arvores.push({ x: x + .5 + (srnd() - .5) * .6, y: y + .5 + (srnd() - .5) * .6, r: .7 + srnd() * .55, c: Math.floor(srnd() * 5) }); }
  [[8, 7], [44.4, 21], [7.6, 31], [21.8, 31.4], [33.2, 21.6], [7.4, 25]].forEach(([x, y]) => { arvores.push({ x, y, r: .9, c: Math.floor(srnd() * 5) }); solido[Math.floor(y)][Math.floor(x)] = true; });
  const pedras = [], flores = [], cogumelos = [];
  for (let i = 0; i < 70; i++) { const x = rnd(CERCA.x0 + .5, CERCA.x1 - .5), y = rnd(CERCA.y0 + .5, CERCA.y1 - .5); if (solido[Math.floor(y)][Math.floor(x)]) continue; (i % 3 === 0 ? pedras : i % 3 === 1 ? flores : cogumelos).push({ x, y, k: Math.random() }); }
  R = {
    t: 18, dia: 1, eu: { x: 13, y: 12.8, dir: 1, anda: 0, fase: 0 }, dentro: false, sala: { x: 5, y: 5.6 },
    solido, arvores, pedras, flores, cogumelos, moedas: 0, agua: 5, aguaMax: 5, oleo: 100, lanterna: false, folego: 100, correndo: false, vel: 3.1,
    lanternaBoa: false, sementes: ["milho", "mandioca"], semente: 0, canteiros: CANTEIROS.map((k, i) => ({ ...k, aberto: i === 0, covas: Array.from({ length: k.w * k.h }, () => null) })),
    inv: { graveto: 0, folha: 0 }, colheita: {}, peixes: {}, extra: {}, vara: false, pecas: 0, vela: null, velaCom: false, velaEntregue: false, velaHoje: false,
    gato: { x: 15, y: 12.6, alvo: null, prox: 25 }, cachorro: null, seco: { prox: 80, fase: "longe", t: 0, x: 0, y: 0 },
    galinhas: Array.from({ length: 5 }, (_, i) => ({ x: 26.5 + i * 1.1, y: 10.4 + (i % 2) * .5, alvo: null, t: rnd(0, 3), dir: 1 })), ovos: 2,
    frutas: POMAR.map(() => ({ n: 1, t: rnd(0, 20) })), vulto: null, vultoT: 40,
    lamparinas: [1, 1, 1], lampT: 0, pisadeira: null, pesca: null, fx: [], msg: null, tutorial: 0, morto: null, venceu: null, tempoTotal: 0, ouro: +(ls("roca_ouro") || 0),
    chapeu: ls("roca_chapeu") || "palha", susto: 0, perto: 0, tremor: 0, poeira: [],
  };
  falar(["Miau. Quer dizer... oi! Eu sou o Fumaça, o gato do sítio.", "Escolha a semente no botão da direita e plante no canteiro. Depois regue com água do poço.", "Colha e venda no caixote do lado da porta. As galinhas botam ovos e o pomar dá laranja: tudo vira dinheiro.", "Com o dinheiro, compre as peças na bancada e conserte a caminhonete lá no portão para ir embora.", "Ah... e se ouvir a mata estalar, corre pra dentro de casa. Ele corre de quatro. Não pergunta por quê."], () => { R.tutorial = 1; });
  gerarChao();
}
const horaNoite = () => { const k = R.t % CICLO; if (k < DIA - 12) return 0; if (k < DIA) return (k - (DIA - 12)) / 12; if (k > CICLO - 10) return (CICLO - k) / 10; return 1; };
const ehNoite = () => (R.t % CICLO) >= DIA;

/* ---------- chão desenhado uma vez ---------- */
function gerarChao() {
  const P = 32; chaoCv = document.createElement("canvas"); chaoCv.width = MW * P; chaoCv.height = MH * P; const g = chaoCv.getContext("2d");
  g.fillStyle = "#26301a"; g.fillRect(0, 0, MW * P, MH * P);
  g.fillStyle = "#6a7a36"; g.fillRect(CERCA.x0 * P, CERCA.y0 * P, (CERCA.x1 - CERCA.x0) * P, (CERCA.y1 - CERCA.y0) * P);
  semente = 99;
  const dentro = (x, y) => x > CERCA.x0 * P && x < CERCA.x1 * P && y > CERCA.y0 * P && y < CERCA.y1 * P;
  for (let i = 0; i < 2200; i++) { const x = srnd() * MW * P, y = srnd() * MH * P; g.fillStyle = dentro(x, y) ? (srnd() < .5 ? "rgba(150,160,76,.35)" : "rgba(60,80,30,.3)") : "rgba(16,24,10,.45)"; g.beginPath(); g.ellipse(x, y, 6 + srnd() * 24, 4 + srnd() * 13, srnd() * 3, 0, 7); g.fill(); }
  for (let i = 0; i < 4200; i++) { const x = srnd() * MW * P, y = srnd() * MH * P; g.strokeStyle = srnd() < .5 ? "rgba(160,170,86,.5)" : "rgba(46,66,28,.55)"; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (srnd() - .5) * 3, y - 3 - srnd() * 4); g.stroke(); }
  for (let i = 0; i < 900; i++) { const x = srnd() * MW * P, y = srnd() * MH * P; g.fillStyle = ["#c8662a", "#d89a2a", "#a8401e", "#e0b040", "#8a3018"][Math.floor(srnd() * 5)]; g.beginPath(); g.ellipse(x, y, 2.4, 1.4, srnd() * 3, 0, 7); g.fill(); } // folhas secas
  // caminhos de terra com pedrinhas
  const trilha = (pts, w) => { g.strokeStyle = "#8a6a44"; g.lineWidth = w * P; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x * P, y * P) : g.moveTo(x * P, y * P)); g.stroke(); g.strokeStyle = "rgba(170,140,96,.45)"; g.lineWidth = w * P * .45; g.stroke(); g.strokeStyle = "rgba(60,40,24,.25)"; g.lineWidth = 2; g.setLineDash([3, 9]); g.stroke(); g.setLineDash([]); };
  trilha([[13, 11.8], [13, 13.6], [25.2, 13.6], [25.2, 30.2]], 1.15);
  trilha([[13, 13.6], [17.4, 12.6], [19.5, 10.8]], .8); trilha([[13, 12.4], [8.4, 11], [7.8, 10.6]], .6);
  trilha([[25.2, 13.6], [28.6, 13.4], [28.6, 12.2]], .7); trilha([[28.6, 13.4], [39, 13.4], [39, 12]], .8); trilha([[39, 13.4], [39, 21]], .7);
  trilha([[25.2, 27.4], [31.2, 27.4]], .7); trilha([[25.2, 24.2], [38.6, 23.6], [42, 25.6]], .7);
  trilha([[25.2, 33], [25.2, 38]], 1.4); // estrada que sai pelo portão
  // cemitério: terra mais escura
  g.fillStyle = "rgba(30,26,16,.5)"; g.fillRect(CEMITERIO.x0 * P, CEMITERIO.y0 * P, (CEMITERIO.x1 - CEMITERIO.x0) * P, (CEMITERIO.y1 - CEMITERIO.y0) * P);
  for (let i = 0; i < 9; i++) { const gx = (CEMITERIO.x0 + .8 + (i % 3) * 1.9) * P, gy = (CEMITERIO.y0 + 1.6 + Math.floor(i / 3) * 1.9) * P; if (Math.abs(gx / P - CRUZ.x) < 1 && Math.abs(gy / P - CRUZ.y) < 1) continue; g.fillStyle = "#4a3a24"; g.fillRect(gx - 10, gy, 20, 30); }
  // cercadinho das galinhas: chão de terra batida com palha
  g.fillStyle = "#8a7448"; g.fillRect(25.4 * P, 6.2 * P, 7.4 * P, 5.6 * P); for (let i = 0; i < 160; i++) { g.strokeStyle = "rgba(220,190,110,.6)"; g.beginPath(); const x = (25.6 + srnd() * 7) * P, y = (6.4 + srnd() * 5.2) * P; g.moveTo(x, y); g.lineTo(x + srnd() * 8 - 4, y + srnd() * 3); g.stroke(); }
  // margem do lago
  g.fillStyle = "#4a5a2a"; g.beginPath(); g.ellipse((LAGO.x0 + LAGO.x1) / 2 * P, (LAGO.y0 + LAGO.y1) / 2 * P, (LAGO.x1 - LAGO.x0) / 2 * P + 10, (LAGO.y1 - LAGO.y0) / 2 * P + 10, 0, 0, 7); g.fill();
  for (let i = 0; i < 40; i++) { const a = srnd() * 7, rx = (LAGO.x1 - LAGO.x0) / 2 * P + 8, ry = (LAGO.y1 - LAGO.y0) / 2 * P + 8; g.fillStyle = "#3a6a2a"; g.fillRect((LAGO.x0 + LAGO.x1) / 2 * P + Math.cos(a) * rx, (LAGO.y0 + LAGO.y1) / 2 * P + Math.sin(a) * ry, 2, -8 - srnd() * 8); } // juncos
}

/* ---------- interface ---------- */
let el = {}, joy = { on: false, id: null, x0: 0, y0: 0, dx: 0, dy: 0 }, teclas = {};
function montarUI() {
  if (document.getElementById("roca")) return;
  const d = document.createElement("div"); d.id = "roca"; d.hidden = true;
  d.innerHTML = `<canvas id="rocaCv"></canvas>
    <div class="rc-hud"><div class="rc-l"><b id="rcMoedas">0</b><span id="rcDia">Dia 1</span></div>
      <div class="rc-barras"><i class="rc-b agua"><s id="rcAgua"></s></i><i class="rc-b oleo"><s id="rcOleo"></s></i><i class="rc-b folego"><s id="rcFolego"></s></i></div>
      <div class="rc-itens" id="rcItens"></div><button class="rc-menu" id="rcMenu" type="button">Pausa</button></div>
    <div class="rc-joy" id="rcJoy"><i id="rcJoyK"></i></div>
    <div class="rc-bts"><button id="rcSem" type="button" class="rc-bt sem"></button><button id="rcLuz" type="button" class="rc-bt luz">Lanterna</button><button id="rcCorre" type="button" class="rc-bt corre">Correr</button><button id="rcAcao" type="button" class="rc-bt acao">Ação</button></div>
    <div class="rc-fala" id="rcFala" hidden></div><div class="rc-dica" id="rcDica"></div>
    <div class="rc-painel" id="rcPainel" hidden></div>
    <div class="rc-gire" id="rcGire" hidden><b>Vire o celular</b><span>Este modo é jogado com o celular deitado.</span></div>`;
  document.body.appendChild(d);
  ["rcMoedas", "rcDia", "rcAgua", "rcOleo", "rcFolego", "rcItens", "rcMenu", "rcJoy", "rcJoyK", "rcSem", "rcLuz", "rcCorre", "rcAcao", "rcFala", "rcDica", "rcPainel", "rcGire"].forEach(i => el[i] = document.getElementById(i));
  cv = document.getElementById("rocaCv"); c = cv.getContext("2d"); luzCv = document.createElement("canvas"); lc = luzCv.getContext("2d");
  const st = document.createElement("style"); st.textContent = `
  #roca{position:fixed;inset:0;z-index:300;background:#000;touch-action:none;user-select:none;-webkit-user-select:none;font-family:var(--f-mono,monospace)}
  #rocaCv{position:absolute;inset:0;width:100%;height:100%}
  .rc-hud{position:absolute;left:max(12px,env(safe-area-inset-left));right:max(12px,env(safe-area-inset-right));top:10px;display:flex;align-items:center;gap:12px;pointer-events:none}
  .rc-l{display:flex;flex-direction:column;line-height:1.05;color:#f4efe4;text-shadow:0 2px 6px #000}
  .rc-l b{font:800 22px "Big Shoulders Display",sans-serif;color:#f2c94a}.rc-l b::before{content:"";display:inline-block;width:12px;height:12px;border-radius:50%;background:#f2c94a;box-shadow:inset -2px -2px 0 #b8902a;margin-right:6px}
  .rc-l span{font-size:11px;letter-spacing:.1em;text-transform:uppercase;opacity:.85}
  .rc-barras{display:flex;flex-direction:column;gap:4px}.rc-b{display:block;width:74px;height:6px;border-radius:3px;background:rgba(0,0,0,.45);overflow:hidden;position:relative}
  .rc-b s{display:block;height:100%;width:50%;border-radius:3px}.rc-b.agua s{background:#5ab0e0}.rc-b.oleo s{background:#f2a33a}.rc-b.folego s{background:#9bd86b}
  .rc-itens{display:flex;gap:6px;flex-wrap:wrap;color:#e8e2d4;font-size:11px;text-shadow:0 1px 4px #000}.rc-itens span{background:rgba(0,0,0,.35);padding:2px 7px;border-radius:8px}
  .rc-menu{margin-left:auto;pointer-events:auto;background:rgba(10,12,16,.6);border:1px solid rgba(255,255,255,.15);color:#f4efe4;border-radius:12px;padding:8px 14px;font:600 12px var(--f-mono,monospace)}
  .rc-joy{position:absolute;left:max(18px,env(safe-area-inset-left));bottom:18px;width:128px;height:128px;border-radius:50%;background:rgba(255,255,255,.06);border:2px solid rgba(255,255,255,.12)}
  .rc-joy i{position:absolute;left:50%;top:50%;width:54px;height:54px;margin:-27px;border-radius:50%;background:rgba(255,255,255,.22);border:2px solid rgba(255,255,255,.3)}
  .rc-bts{position:absolute;right:max(18px,env(safe-area-inset-right));bottom:16px;display:grid;grid-template-columns:auto auto;grid-template-rows:auto auto;gap:10px;align-items:end}
  .rc-bt{border:2px solid rgba(255,255,255,.18);background:rgba(12,14,18,.55);color:#f4efe4;border-radius:50%;width:62px;height:62px;font:700 10px var(--f-mono,monospace);letter-spacing:.04em;text-transform:uppercase}
  .rc-bt.acao{width:88px;height:88px;grid-row:1/3;grid-column:2;background:rgba(242,163,58,.28);border-color:rgba(242,163,58,.65);font-size:11px}
  .rc-bt.on{background:rgba(242,201,74,.4);border-color:#f2c94a}.rc-bt.sem{font-size:9px;line-height:1.1}
  .rc-bts .luz{grid-column:1;grid-row:1}.rc-bts .corre{grid-column:1;grid-row:2}.rc-bts .sem{position:absolute;right:0;bottom:100px;width:88px;height:42px;border-radius:14px}
  .rc-fala{position:absolute;left:50%;transform:translateX(-50%);bottom:18px;width:min(520px,52vw);background:rgba(12,14,18,.88);border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:12px 16px;color:#f4efe4;font:15px/1.4 var(--f-body,serif)}
  .rc-fala small{display:block;margin-top:6px;color:#9bd86b;font:600 10px var(--f-mono,monospace);letter-spacing:.1em;text-transform:uppercase}
  .rc-dica{position:absolute;left:50%;top:14px;transform:translateX(-50%);color:#f4efe4;font:600 12px var(--f-mono,monospace);text-shadow:0 2px 6px #000;pointer-events:none;text-align:center;max-width:46vw}
  .rc-painel{position:absolute;inset:0;background:rgba(4,5,8,.72);display:flex;align-items:center;justify-content:center;padding:16px}
  .rc-caixa{background:#12151b;border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:18px;width:min(640px,92vw);max-height:88vh;overflow:auto;color:#f4efe4}
  .rc-caixa h2{margin:0 0 4px;font:800 28px "Big Shoulders Display",sans-serif;letter-spacing:.02em}.rc-caixa p{margin:0 0 12px;color:#b8b2a4;font:15px/1.4 var(--f-body,serif)}
  .rc-grade{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px}
  .rc-op{display:flex;flex-direction:column;gap:2px;text-align:left;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:10px 12px;color:#f4efe4;font:600 14px var(--f-body,serif)}
  .rc-op small{color:#b8b2a4;font:11px var(--f-mono,monospace)}.rc-op em{font-style:normal;color:#f2c94a;font:700 12px var(--f-mono,monospace)}.rc-op:disabled{opacity:.4}
  .rc-op.dest{background:rgba(242,163,58,.2);border-color:rgba(242,163,58,.6)}
  .rc-linha{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap}
  .rc-gire{position:absolute;inset:0;background:#05070b;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:#f4efe4;text-align:center;padding:24px}
  .rc-gire b{font:800 32px "Big Shoulders Display",sans-serif}.rc-gire span{color:#b8b2a4}
  .rc-gire::before{content:"";width:44px;height:74px;border:3px solid #f2a33a;border-radius:10px;animation:rcgira 1.6s ease-in-out infinite}
  @keyframes rcgira{0%,30%{transform:rotate(0)}60%,100%{transform:rotate(-90deg)}}`;
  document.head.appendChild(st);
  // joystick
  const jz = el.rcJoy, pos = e => { const r = jz.getBoundingClientRect(); return [e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)]; };
  const mover = e => { const [x, y] = pos(e), m = Math.hypot(x, y), k = Math.min(1, m / 48); joy.dx = m ? x / m * k : 0; joy.dy = m ? y / m * k : 0; el.rcJoyK.style.transform = `translate(${joy.dx * 40}px,${joy.dy * 40}px)`; };
  jz.addEventListener("pointerdown", e => { joy.on = true; joy.id = e.pointerId; jz.setPointerCapture(e.pointerId); mover(e); });
  jz.addEventListener("pointermove", e => { if (joy.on && e.pointerId === joy.id) mover(e); });
  const solta = () => { joy.on = false; joy.dx = joy.dy = 0; el.rcJoyK.style.transform = ""; };
  jz.addEventListener("pointerup", solta); jz.addEventListener("pointercancel", solta);
  const bt = (b, fn) => b.addEventListener("pointerdown", e => { e.preventDefault(); initAudio(); fn(); });
  bt(el.rcAcao, acao); bt(el.rcLuz, () => alternarLanterna()); bt(el.rcCorre, () => correr()); bt(el.rcSem, () => { R.semente = (R.semente + 1) % R.sementes.length; tocarTom(900, .05, { vol: .05 }); hud(); });
  el.rcMenu.addEventListener("click", () => pausar());
  el.rcFala.addEventListener("pointerdown", e => { e.preventDefault(); proximaFala(); });
  addEventListener("keydown", e => { if (document.getElementById("roca").hidden) return; teclas[e.key.toLowerCase()] = true; const k = e.key.toLowerCase(); if (["f", "e", " "].includes(k)) { e.preventDefault(); if (R.msg) proximaFala(); else acao(); } if (k === "r") alternarLanterna(); if (k === "shift") correr(); if (k === "q") el.rcSem.dispatchEvent(new Event("pointerdown")); if (k === "escape") pausar(); });
  addEventListener("keyup", e => { teclas[e.key.toLowerCase()] = false; });
  addEventListener("resize", medir);
  document.addEventListener("visibilitychange", () => { if (document.hidden && rodando && R && !R.morto && !R.venceu) pausar(); });
}
function medir() {
  if (!cv) return; DPRr = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
  cv.width = Math.round(W * DPRr); cv.height = Math.round(H * DPRr); luzCv.width = Math.round(W * DPRr * .5); luzCv.height = Math.round(H * DPRr * .5);
  TS = Math.max(30, Math.min(W, H) / 9.2);
  el.rcGire.hidden = !(H > W * 1.1);
}

/* ---------- falas (gato e placas) ---------- */
function falar(lista, depois, quem = "Fumaça") { R.msg = { lista: [...lista], depois, quem }; mostrarFala(); }
function mostrarFala() { if (!R.msg) { el.rcFala.hidden = true; return; } el.rcFala.hidden = false; el.rcFala.innerHTML = `${R.msg.lista[0]}<small>${R.msg.quem} · toque para continuar</small>`; }
function proximaFala() { if (!R.msg) return; R.msg.lista.shift(); tocarTom(700, .04, { vol: .04 }); if (!R.msg.lista.length) { const d = R.msg.depois; R.msg = null; el.rcFala.hidden = true; d && d(); } else mostrarFala(); }

/* ---------- ações ---------- */
function covaPerto() {
  const p = R.eu;
  for (const k of R.canteiros) { if (p.x < k.x - .6 || p.x > k.x + k.w + .6 || p.y < k.y - .6 || p.y > k.y + k.h + .6) continue;
    if (!k.aberto) return { k, fechado: true };
    let melhor = null, md = 9; for (let i = 0; i < k.covas.length; i++) { const cx = k.x + (i % k.w) + .5, cy = k.y + Math.floor(i / k.w) + .5, d = Math.hypot(cx - p.x, cy - (p.y - .15)); if (d < md) { md = d; melhor = i; } }
    if (md < 1.05) return { k, i: melhor }; }
  return null;
}
function oQueFazer() {
  if (!R || R.morto || R.venceu) return null;
  if (R.pesca) return R.pesca.fisgou ? { t: "Puxar!", fn: puxarPeixe } : { t: "...", fn: () => {} };
  if (R.dentro) {
    const s = R.sala;
    if (s.y > 5.9 && Math.abs(s.x - SALA.porta.x) < 1.1) return { t: "Sair", fn: sair };
    if (s.x > 7 && s.y < 2.4) return { t: "Bancada", fn: abrirBancada };
    if (Math.hypot(s.x - 5, s.y - 3.5) < 1.6 && !R.lamparinas.every(v => v)) return { t: "Acender", fn: () => { if (R.oleo >= 10) { R.oleo -= 10; R.lamparinas = R.lamparinas.map(() => 1); R.lampT = 0; S.colher(); efeito("Lamparinas acesas", "#f2c94a"); } else efeito("Sem óleo para acender", "#e8e2d4"); } };
    if (Math.hypot(s.x - 4.4, s.y - 1.6) < 1.2) return { t: "Fogão", fn: () => efeito("O fogo estala. Por um instante, parece uma voz.", "#e8e2d4") };
    return null;
  }
  const p = R.eu;
  if (dist(p, CASA.porta) < 1.1) return { t: "Entrar", fn: entrar };
  if (dist(p, CAIXOTE) < 1.2) { const v = valorVenda(); return { t: v ? `Vender ${v}` : "Caixote", fn: vender }; }
  if (dist(p, POCO) < 1.4) return { t: "Tirar água", fn: tirarAgua };
  if (R.vela && !R.velaCom && dist(p, R.vela) < 1.1) return { t: "Pegar vela", fn: pegarVela };
  if (dist(p, CRUZ) < 1.5 && R.velaCom) return { t: "Deixar vela", fn: entregarVela };
  if (dist(p, CAMINHONETE) < 2) return { t: R.pecas >= 3 ? "Ir embora!" : "Caminhonete", fn: () => R.pecas >= 3 ? irEmbora() : efeito(`Faltam ${3 - R.pecas} peças (na bancada)`, "#e8e2d4") };
  if (dist(p, DOCA) < 1.3) return { t: R.vara ? "Pescar" : "Sem vara", fn: () => R.vara ? pescar() : efeito("Faça uma vara na bancada: 3 gravetos e 2 folhas", "#e8e2d4") };
  if (dist(p, GALINHEIRO.porta) < 1.3) return { t: R.ovos ? `Pegar ${R.ovos} ovos` : "Sem ovos", fn: () => { if (!R.ovos) return efeito("Elas botam de manhã", "#e8e2d4"); R.extra.ovo = (R.extra.ovo || 0) + R.ovos; efeito(`+${R.ovos} ovos`); R.ovos = 0; S.colher(); tocarTom(900, .12, { tipo: "square", vol: .02, ate: 1300, lp: 2000 }); hud(); } };
  for (let i = 0; i < POMAR.length; i++) { const [fx, fy] = POMAR[i]; if (Math.hypot(p.x - fx, p.y - (fy + .6)) < 1.1) { const f = R.frutas[i]; return { t: f.n ? `Colher ${f.n} laranja${f.n > 1 ? "s" : ""}` : "Laranjeira", fn: () => { if (!f.n) return efeito("Ainda verdes", "#e8e2d4"); R.extra.laranja = (R.extra.laranja || 0) + f.n; efeito(`+${f.n} laranja`); f.n = 0; f.t = 0; S.colher(); hud(); } }; } }
  if (dist(p, { x: CASINHA.x, y: CASINHA.y + .7 }) < 1) return { t: "Casinha", fn: () => { if (ehNoite()) { tocarRuido(.1, { f: 200, vol: .5, wet: .4 }); tocarRuido(.1, { f: 200, vol: .5, wet: .4, quando: .35 }); tocarRuido(.1, { f: 200, vol: .5, wet: .4, quando: .7 }); efeito("Alguém bateu de dentro.", "#e2483d"); } else efeito("Melhor não.", "#e8e2d4"); } };
  for (const pl of PLACAS) if (dist(p, pl) < 1.2) return { t: "Ler", fn: () => falar([pl.txt], null, "Placa") };
  const cp = covaPerto();
  if (cp) {
    if (cp.fechado) return { t: `Abrir · ${cp.k.preco}`, fn: () => abrirCanteiro(cp.k) };
    const cova = cp.k.covas[cp.i];
    if (!cova) return { t: `Plantar ${PLANTAS[R.sementes[R.semente]].nome}`, fn: () => plantar(cp) };
    if (cova.est >= 3) return { t: "Colher", fn: () => colher(cp) };
    if (cova.seca) return { t: R.agua > 0 ? "Regar" : "Sem água", fn: () => regar(cp) };
    return { t: "Crescendo", fn: () => {} };
  }
  return null;
}
function acao() { if (!R) return; if (R.msg) return proximaFala(); if (painelAberto) return; const o = oQueFazer(); if (o) o.fn(); }
function efeito(txt, cor = "#9bd86b") { R.fx.push({ txt, cor, t: 0, x: R.dentro ? null : R.eu.x, y: R.dentro ? null : R.eu.y }); }
function plantar(cp) { const tipo = R.sementes[R.semente]; cp.k.covas[cp.i] = { tipo, est: 0, seca: true, t: 0 }; S.plantar(); }
function regar(cp) { if (R.agua <= 0) return efeito("O regador está vazio. Vá ao poço.", "#5ab0e0"); R.agua--; const cv2 = cp.k.covas[cp.i]; cv2.seca = false; cv2.t = 0; R.regando = .6; S.regar(); hud(); }
function colher(cp) { const cv2 = cp.k.covas[cp.i]; R.colheita[cv2.tipo] = (R.colheita[cv2.tipo] || 0) + 1; cp.k.covas[cp.i] = null; S.colher(); efeito(`+1 ${PLANTAS[cv2.tipo].nome}`); hud(); }
function tirarAgua() { R.agua = R.aguaMax; S.poco(); efeito("Regador cheio", "#5ab0e0"); if (ehNoite() && Math.random() < .25) setTimeout(() => { R.susto = 1.1; S.susto(); R.rostoPoco = 1; }, 600); hud(); }
function valorVenda() { let v = 0; for (const [k, n] of Object.entries(R.colheita)) v += PLANTAS[k].preco * n; for (const [k, n] of Object.entries(R.peixes)) v += PEIXES.find(p => p[0] === k)[1] * n; for (const [k, n] of Object.entries(R.extra)) v += EXTRAS[k][1] * n; if (R.vara) v += R.inv.graveto + R.inv.folha; return v; }
function vender() { const v = valorVenda(); if (!v) return efeito("Nada para vender", "#e8e2d4"); R.moedas += v; R.colheita = {}; R.peixes = {}; R.extra = {}; if (R.vara) { R.inv.graveto = 0; R.inv.folha = 0; } S.moedas(); efeito(`+${v} moedas`, "#f2c94a"); hud(); }
function abrirCanteiro(k) { if (R.moedas < k.preco) return efeito(`Precisa de ${k.preco} moedas`, "#e8e2d4"); R.moedas -= k.preco; k.aberto = true; S.moedas(); efeito("Canteiro novo!"); hud(); }
function entrar() { R.dentro = true; R.sala = { x: SALA.porta.x, y: 5.9, dir: -1 }; S.porta(); hud(); }
function sair() { R.dentro = false; R.eu.x = CASA.porta.x; R.eu.y = CASA.porta.y + .55; S.porta(); if (R.pisadeira) R.pisadeira = null; hud(); }
function alternarLanterna() { if (!R || R.morto) return; if (!R.lanterna && R.oleo <= 0) return efeito("Sem óleo na lanterna", "#f2a33a"); R.lanterna = !R.lanterna; tocarTom(R.lanterna ? 900 : 500, .05, { vol: .05 }); hud(); }
function correr() { if (!R || R.correndo || R.folego < 25) return; R.correndo = true; hud(); }
function pescar() { R.pesca = { t: 0, morde: rnd(2.2, 5.5), fisgou: false }; tocarRuido(.3, { filtro: "highpass", f: 1800, vol: .05 }); }
function puxarPeixe() { const r = Math.random(); let acc = 0, pe = PEIXES[0]; for (const p of PEIXES) { acc += p[2]; if (r < acc) { pe = p; break; } } R.peixes[pe[0]] = (R.peixes[pe[0]] || 0) + 1; R.pesca = null; S.peixe(); efeito(`Pegou um ${pe[0].toLowerCase()}!`, "#5ab0e0"); hud(); }
function pegarVela() { R.velaCom = true; S.colher(); efeito("Leve a vela até a cruz do cemitério", "#f2c94a"); hud(); }
function entregarVela() { R.velaCom = false; R.vela = null; R.velaEntregue = true; S.sino(CRUZ.x, CRUZ.y); efeito("A alma agradece. Esta noite ela não vem.", "#e8e2d4"); hud(); }
function irEmbora() { R.venceu = { t: 0 }; R.lanterna = false; S.motor(); setTimeout(S.vitoria, 1600); const best = +(ls("roca_melhor") || 0); if (!best || R.tempoTotal < best) ls("roca_melhor", Math.round(R.tempoTotal)); ls("roca_venceu", 1); }

/* ---------- bancada (melhorias, vara, peças, visual) ---------- */
function opcoesBancada() {
  const o = [];
  const item = (nome, desc, preco, ok, fn, dest) => o.push({ nome, desc, preco, ok: ok && R.moedas >= preco, fn, dest });
  if (!R.vara) o.push({ nome: "Vara de pesca", desc: `3 gravetos e 2 folhas · tem ${R.inv.graveto} e ${R.inv.folha}`, preco: 0, ok: R.inv.graveto >= 3 && R.inv.folha >= 2, fn: () => { R.inv.graveto -= 3; R.inv.folha -= 2; R.vara = true; } });
  item("Óleo da lanterna", "Enche a lanterna e as lamparinas", 5, R.oleo < 100, () => { R.oleo = 100; });
  if (R.aguaMax < 10) item("Regador grande", "Carrega 10 de água", 25, true, () => { R.aguaMax = 10; R.agua = 10; });
  else if (R.aguaMax < 16) item("Regador de lata", "Carrega 16 de água", 70, true, () => { R.aguaMax = 16; R.agua = 16; });
  if (R.vel < 3.6) item("Botas de borracha", "Anda e corre mais rápido", 40, true, () => { R.vel = 3.75; });
  if (!R.lanternaBoa) item("Lanterna reforçada", "Ilumina mais e gasta menos óleo", 35, true, () => { R.lanternaBoa = true; });
  Object.entries(PLANTAS).forEach(([k, p]) => { if (p.custo && !R.sementes.includes(k)) item(`Sementes de ${p.nome.toLowerCase()}`, `Vende por ${p.preco} cada`, p.custo, true, () => { R.sementes.push(k); }); });
  const nomesPecas = [["Bateria nova", 120], ["Pneu", 170], ["Motor de arranque", 240]];
  if (R.pecas < 3) item(`Peça: ${nomesPecas[R.pecas][0]}`, `Caminhonete ${R.pecas}/3 · leve até ela para ir embora`, nomesPecas[R.pecas][1], true, () => { R.pecas++; }, true);
  return o;
}
function abrirBancada() {
  painelAberto = true; const o = opcoesBancada();
  el.rcPainel.hidden = false;
  el.rcPainel.innerHTML = `<div class="rc-caixa"><h2>Bancada</h2><p>Você tem <b style="color:#f2c94a">${R.moedas} moedas</b>${R.ouro ? ` e ${R.ouro} moeda${R.ouro > 1 ? "s" : ""} dourada${R.ouro > 1 ? "s" : ""}` : ""}.</p>
    <div class="rc-grade">${o.map((x, i) => `<button type="button" class="rc-op ${x.dest ? "dest" : ""}" data-i="${i}" ${x.ok ? "" : "disabled"}>${x.nome}<small>${x.desc}</small>${x.preco ? `<em>${x.preco} moedas</em>` : ""}</button>`).join("")}</div>
    <div class="rc-linha"><button type="button" class="rc-op" id="rcVisual">Visual<small>Chapéus com moedas douradas</small></button><button type="button" class="rc-op dest" id="rcFechar">Voltar</button></div></div>`;
  el.rcPainel.querySelectorAll("[data-i]").forEach(b => b.addEventListener("click", () => { const x = o[+b.dataset.i]; R.moedas -= x.preco; x.fn(); S.moedas(); hud(); abrirBancada(); }));
  document.getElementById("rcFechar").addEventListener("click", fecharPainel);
  document.getElementById("rcVisual").addEventListener("click", abrirVisual);
}
function abrirVisual() {
  const tem = JSON.parse(ls("roca_chapeus") || '["palha"]');
  el.rcPainel.innerHTML = `<div class="rc-caixa"><h2>Visual</h2><p>O Fumaça às vezes traz moedas douradas. Elas ficam guardadas mesmo se você morrer. Você tem ${R.ouro}.</p>
    <div class="rc-grade">${COSMETICOS.map(([id, n, p, cor]) => `<button type="button" class="rc-op ${R.chapeu === id ? "dest" : ""}" data-c="${id}" ${tem.includes(id) || R.ouro >= p ? "" : "disabled"}><span style="color:${cor}">●</span> ${n}<small>${tem.includes(id) ? (R.chapeu === id ? "Usando" : "Usar") : p + " douradas"}</small></button>`).join("")}</div>
    <div class="rc-linha"><button type="button" class="rc-op dest" id="rcFechar">Voltar</button></div></div>`;
  el.rcPainel.querySelectorAll("[data-c]").forEach(b => b.addEventListener("click", () => { const id = b.dataset.c, cs = COSMETICOS.find(x => x[0] === id); if (!tem.includes(id)) { R.ouro -= cs[2]; ls("roca_ouro", R.ouro); tem.push(id); ls("roca_chapeus", JSON.stringify(tem)); } R.chapeu = id; ls("roca_chapeu", id); S.moedas(); abrirVisual(); }));
  document.getElementById("rcFechar").addEventListener("click", abrirBancada);
}
function fecharPainel() { painelAberto = false; el.rcPainel.hidden = true; el.rcPainel.innerHTML = ""; }
function pausar() {
  if (!R || R.morto || R.venceu) return; painelAberto = true; el.rcPainel.hidden = false;
  el.rcPainel.innerHTML = `<div class="rc-caixa"><h2>Pausa</h2><p>Dia ${R.dia}. Se sair agora, a partida é perdida.</p>
    <p style="font-size:13px">Controles: mexa com o círculo da esquerda. <b>Ação</b> faz o que aparece escrito (plantar, regar, colher, vender, entrar...). <b>Lanterna</b> gasta óleo. <b>Correr</b> vai até o fôlego acabar. O botão da semente troca o que você planta.</p>
    <div class="rc-linha"><button type="button" class="rc-op dest" id="rcVoltar">Continuar</button><button type="button" class="rc-op" id="rcSair">Sair para o menu</button></div></div>`;
  document.getElementById("rcVoltar").addEventListener("click", fecharPainel);
  document.getElementById("rcSair").addEventListener("click", () => { fecharPainel(); sairRoca(); });
}
function telaFim(tipo) {
  painelAberto = true; el.rcPainel.hidden = false;
  const mins = Math.floor(R.tempoTotal / 60), segs = Math.round(R.tempoTotal % 60);
  const txt = tipo === "venceu" ? `<h2 style="color:#9bd86b">Você foi embora</h2><p>A caminhonete pega na terceira tentativa. Pelo retrovisor, o sítio fica pequeno... e alguém acena da janela da casa vazia.</p><p>Dia ${R.dia} · ${mins} min ${segs} s</p>`
    : `<h2 style="color:#e2483d">Você morreu</h2><p>${R.morto.porque}</p><p style="font-size:13px;color:#9bd86b">${R.morto.dica}</p><p>Chegou ao dia ${R.dia}.</p>`;
  el.rcPainel.innerHTML = `<div class="rc-caixa">${txt}<div class="rc-linha"><button type="button" class="rc-op dest" id="rcDeNovo">Jogar de novo</button><button type="button" class="rc-op" id="rcSair">Menu</button></div></div>`;
  document.getElementById("rcDeNovo").addEventListener("click", () => { fecharPainel(); novoJogo(); hud(); });
  document.getElementById("rcSair").addEventListener("click", () => { fecharPainel(); sairRoca(); });
}
function morrer(quem, porque, dica) { if (R.morto || R.venceu) return; R.morto = { quem, porque, dica, t: 0 }; R.correndo = false; S.susto(); try { vibrar(500); } catch (e) {} setTimeout(() => telaFim("morreu"), 2300); }

/* ---------- HUD ---------- */
function hud() {
  if (!R) return;
  el.rcMoedas.textContent = R.moedas; el.rcDia.textContent = `Dia ${R.dia} · ${ehNoite() ? "noite" : "dia"}`;
  el.rcAgua.style.width = (R.agua / R.aguaMax * 100) + "%"; el.rcOleo.style.width = R.oleo + "%"; el.rcFolego.style.width = R.folego + "%";
  const it = []; const col = Object.values(R.colheita).reduce((a, b) => a + b, 0), pe = Object.values(R.peixes).reduce((a, b) => a + b, 0);
  if (col) it.push(`${col} colheita`); if (pe) it.push(`${pe} peixe`); if (R.inv.graveto || R.inv.folha) it.push(`${R.inv.graveto} graveto · ${R.inv.folha} folha`); if (R.velaCom) it.push("vela acesa"); if (R.pecas) it.push(`peças ${R.pecas}/3`);
  el.rcItens.innerHTML = it.map(x => `<span>${x}</span>`).join("");
  const sm = PLANTAS[R.sementes[R.semente]]; el.rcSem.innerHTML = `<span style="color:${sm.cor}">●</span><br>${sm.nome}`;
  el.rcLuz.classList.toggle("on", R.lanterna); el.rcCorre.classList.toggle("on", R.correndo);
}

/* ---------- atualização ---------- */
function anda(p, dx, dy, vel, dt, sala) {
  const rr = .28, livre = (x, y) => {
    if (sala) { if (x < .5 || x > SALA.w - .5 || y < 1.1 || y > SALA.h - .3) return false; for (const [mx, my, mw, mh] of MOVEIS) if (x > mx - .2 && x < mx + mw + .2 && y > my && y < my + mh + .25) return false; return true; }
    for (const [ox, oy] of [[-rr, 0], [rr, 0], [0, -rr * .6], [0, rr * .4]]) { const tx = Math.floor(x + ox), ty = Math.floor(y + oy); if (ty < 0 || ty >= MH || tx < 0 || tx >= MW || R.solido[ty][tx]) return false; } return true; };
  const nx = p.x + dx * vel * dt, ny = p.y + dy * vel * dt;
  if (livre(nx, p.y)) p.x = nx; if (livre(p.x, ny)) p.y = ny;
}
function atualizar(dt) {
  if (painelAberto) return;
  R.fx.forEach(f => f.t += dt); R.fx = R.fx.filter(f => f.t < 1.8);
  R.poeira.forEach(q => { q.t += dt; q.y -= dt * .3; }); R.poeira = R.poeira.filter(q => q.t < .8);
  if (R.susto > 0) R.susto -= dt; if (R.tremor > 0) R.tremor -= dt;
  if (R.morto) { R.morto.t += dt; return; }
  if (R.venceu) { R.venceu.t += dt; if (R.venceu.t > 4.5 && !R.venceu.tela) { R.venceu.tela = true; telaFim("venceu"); } return; }
  if (R.msg) return;
  R.tempoTotal += dt;
  const antesNoite = ehNoite(); R.t += dt; const agoraNoite = ehNoite();
  if (!antesNoite && agoraNoite) comecaNoite();
  if (antesNoite && !agoraNoite) amanhece();
  // movimento
  let dx = joy.dx, dy = joy.dy;
  if (teclas["a"] || teclas["arrowleft"]) dx = -1; if (teclas["d"] || teclas["arrowright"]) dx = 1; if (teclas["w"] || teclas["arrowup"]) dy = -1; if (teclas["s"] || teclas["arrowdown"]) dy = 1;
  const m = Math.hypot(dx, dy); if (m > 1) { dx /= m; dy /= m; }
  if (R.pesca && m > .2) R.pesca = null;
  if (R.correndo) { R.folego -= 30 * dt; if (R.folego <= 0) { R.folego = 0; R.correndo = false; } } else R.folego = Math.min(100, R.folego + 14 * dt);
  const vel = R.vel * (R.correndo ? 1.75 : 1) * (R.dentro ? .8 : 1);
  if (R.dentro) anda(R.sala, dx, dy, vel, dt, true); else anda(R.eu, dx, dy, vel, dt, false);
  const pp = R.dentro ? R.sala : R.eu;
  if (m > .1) { pp.dir = dx < -.1 ? -1 : dx > .1 ? 1 : (pp.dir || 1); R.eu.fase += dt * vel * 3.2; R.eu.anda = Math.min(1, m); if ((R.eu.fase % PI) < dt * vel * 3.2) S.passo(); } else R.eu.anda = 0;
  if (R.regando > 0) R.regando -= dt;
  if (R.lanterna) { R.oleo -= (R.lanternaBoa ? .5 : .9) * dt; if (R.oleo <= 0) { R.oleo = 0; R.lanterna = false; efeito("A lanterna apagou", "#f2a33a"); } }
  // plantas, pomar e galinhas
  for (const k of R.canteiros) k.covas.forEach((cv2, i) => { if (!cv2 || cv2.seca || cv2.est >= 3) return; cv2.t += dt; if (cv2.t >= PLANTAS[cv2.tipo].tempo) { cv2.est++; cv2.t = 0; if (cv2.est < 3) cv2.seca = true; else S.pronto(k.x + i % k.w, k.y + Math.floor(i / k.w)); } });
  R.frutas.forEach(f => { if (f.n >= 3) return; f.t += dt; if (f.t > 45) { f.t = 0; f.n++; } });
  R.galinhas.forEach(g => { g.t -= dt; if (!g.alvo || g.t <= 0) { g.alvo = { x: rnd(26, 31.6), y: rnd(9.9, 10.9) }; g.t = rnd(1.5, 4); } const d = dist(g, g.alvo); if (d > .1) { g.x += (g.alvo.x - g.x) / d * .9 * dt; g.y += (g.alvo.y - g.y) / d * .9 * dt; g.dir = g.alvo.x > g.x ? 1 : -1; g.anda = 1; } else g.anda = 0; if (Math.random() < dt * .04) { const [v, pn] = somEm(g.x, g.y); tocarTom(rnd(700, 900), .09, { tipo: "square", vol: .012 * v, ate: 1200, lp: 1800, pan: pn }); } });
  // pesca
  if (R.pesca) { R.pesca.t += dt; if (!R.pesca.fisgou && R.pesca.t > R.pesca.morde) { R.pesca.fisgou = true; R.pesca.ft = 0; S.fisga(); } if (R.pesca.fisgou) { R.pesca.ft += dt; if (R.pesca.ft > .9) { R.pesca = null; efeito("O peixe escapou", "#e8e2d4"); } } }
  // o vulto parado na beira da mata à noite (só olha; some quando você chega perto ou ilumina)
  if (ehNoite() && !R.dentro) { R.vultoT -= dt; if (!R.vulto && R.vultoT <= 0) { const lado = Math.floor(rnd(0, 3)); R.vulto = lado === 0 ? { x: CERCA.x0 - .7, y: rnd(10, 28) } : lado === 1 ? { x: CERCA.x1 + .7, y: rnd(10, 28) } : { x: rnd(10, 40), y: CERCA.y0 - .7 }; R.vulto.t = 0; } if (R.vulto) { R.vulto.t += dt; const d = dist(R.vulto, R.eu); if (d < (R.lanterna ? 7 : 4) || R.vulto.t > 14) { R.vulto = null; R.vultoT = rnd(25, 45); } } } else R.vulto = null;
  atualizarGato(dt); atualizarSeco(dt); atualizarCachorro(dt); atualizarAlma(dt); atualizarCasa(dt);
  let perto = 0; if (R.seco.fase === "anda") perto = Math.max(perto, 1 - dist(R.eu, R.seco) / 9); if (R.cachorro && (R.cachorro.fase === "lobo" || R.cachorro.fase === "vira")) perto = 1; if (R.vulto) perto = Math.max(perto, .5); if (R.pisadeira) perto = 1; R.perto = R.dentro && !R.pisadeira ? 0 : cl(perto, 0, 1);
  musicaPasso(dt);
  if (Math.floor(R.t * 2) !== Math.floor((R.t - dt) * 2)) hud();
  const o = oQueFazer(); el.rcAcao.textContent = o ? o.t : "Ação"; el.rcAcao.style.opacity = o ? 1 : .5;
}
function comecaNoite() { R.velaHoje = true; R.velaEntregue = false; R.velaT = rnd(8, 18); efeito("Anoiteceu", "#9aa8c8"); tocarTom(220, 2, { vol: .04, ate: 165, wet: .8 }); }
function amanhece() {
  if (R.velaHoje && !R.velaEntregue) { R.alma = { t: 0 }; return; } // a alma vem cobrar
  R.dia++; R.velaHoje = false; R.vela = null; R.velaCom = false; R.ovos = Math.min(8, R.ovos + 3); efeito(`Dia ${R.dia}`, "#f2c94a");
  tocarTom(523, 1.5, { tipo: "triangle", vol: .04, wet: .6 }); tocarTom(659, 1.5, { tipo: "triangle", vol: .035, quando: .2, wet: .6 }); tocarTom(780, .4, { tipo: "square", vol: .02, ate: 1100, lp: 2000, quando: 1 }); // galo
  if (R.dia === 2 && !R.cachorro) { R.cachorro = { x: 34, y: 14, fase: "calmo", t: 0 }; setTimeout(() => R && R.cachorro && S.uivo(R.cachorro.x, R.cachorro.y), 1200); }
}
function atualizarGato(dt) {
  const g = R.gato; if (R.tutorial === 0) return;
  g.prox -= dt;
  if (!g.alvo && g.prox <= 0 && !R.dentro) { g.alvo = { x: cl(R.eu.x + rnd(-2, 2), CERCA.x0 + 1, CERCA.x1 - 1), y: cl(R.eu.y + rnd(-1.5, 1.5), CERCA.y0 + 1, CERCA.y1 - 1) }; }
  if (g.alvo) { const d = dist(g, g.alvo); if (d > .2) { g.x += (g.alvo.x - g.x) / d * 2.8 * dt; g.y += (g.alvo.y - g.y) / d * 2.8 * dt; g.dir = g.alvo.x > g.x ? 1 : -1; g.anda = 1; }
    else { const r = Math.random(); let q; if (r < .05) { q = "dourada"; R.ouro++; ls("roca_ouro", R.ouro); } else if (r < .2) { q = "moedas"; R.moedas += 3; } else if (r < .58) { q = "graveto"; R.inv.graveto++; } else { q = "folha"; R.inv.folha++; }
      R.fx.push({ txt: q === "dourada" ? "Moeda dourada!" : q === "moedas" ? "+3 moedas" : `+1 ${q}`, cor: q === "dourada" ? "#ffe680" : "#e8e2d4", t: 0, x: g.x, y: g.y }); S.miau(g.x, g.y); S.queda(); g.alvo = null; g.prox = rnd(20, 30); g.anda = 0; hud(); } }
}
function atualizarSeco(dt) {
  const s = R.seco; if (R.tutorial === 0) return;
  if (s.fase === "longe") { s.prox -= dt; if (s.prox <= 0) { s.fase = "aviso"; s.t = 0; const lado = Math.random() < .5; s.x = lado ? CERCA.x0 - 1.6 : CERCA.x1 + 1.6; s.y = rnd(CERCA.y0 + 4, CERCA.y1 - 4); S.estalos(s.x, s.y); efeito("A mata estalou...", "#e2483d"); } return; }
  s.t += dt;
  if (s.fase === "aviso") { if (s.t > 1 && s.t % 2.2 < dt) S.estalos(s.x, s.y); if (s.t > 7) { s.fase = "anda"; s.t = 0; S.uivoSeco(s.x, s.y); } return; }
  if (s.fase === "anda") {
    const alvo = R.dentro ? CASA.porta : R.eu, d = dist(s, alvo), v = 3.3; // de quatro, mais rápido que andando
    if (d > .05) { s.x += (alvo.x - s.x) / d * v * dt; s.y += (alvo.y - s.y) / d * v * dt; s.dir = alvo.x > s.x ? 1 : -1; s.fase2 = (s.fase2 || 0) + dt * 11; if (Math.random() < dt * 14) R.poeira.push({ x: s.x - s.dir * .5, y: s.y, t: 0 }); }
    if (s.t % 1.6 < dt) { const [vv, pn] = somEm(s.x, s.y); tocarRuido(.12, { filtro: "lowpass", f: 260, vol: .3 * vv, pan: pn }); tocarTom(80, .5, { tipo: "sawtooth", vol: .06 * vv, ate: 50, lp: 300, pan: pn }); } // mandíbula batendo
    if (!R.dentro && d < 4) R.tremor = .1;
    if (!R.dentro && dist(s, R.eu) < .9) morrer("seco", "O Corpo-Seco te alcançou correndo de quatro.", "Quando a mata estalar, corra para dentro de casa e espere o suspiro. Use o Correr: andando ele te alcança.");
    if (s.t > 22) { s.fase = "sai"; s.t = 0; S.suspiro(s.x, s.y); }
    return;
  }
  if (s.fase === "sai") { const dd = s.x < (CERCA.x0 + CERCA.x1) / 2 ? -1 : 1; s.x += dd * 3.6 * dt; s.dir = dd; s.fase2 = (s.fase2 || 0) + dt * 11; if (s.t > 6) { s.fase = "longe"; s.prox = rnd(150, 210) - Math.min(60, R.dia * 8); efeito("Ouviu o suspiro. Já pode sair.", "#9aa8c8"); } }
}
function atualizarCachorro(dt) {
  const k = R.cachorro; if (!k) return; k.t += dt;
  const alvo = R.eu, d = dist(k, alvo);
  if (k.fase === "calmo") {
    const quer = 6.5; if (!R.dentro && d > quer + .5) { k.x += (alvo.x - k.x) / d * 1.4 * dt; k.y += (alvo.y - k.y) / d * 1.4 * dt; k.dir = alvo.x > k.x ? 1 : -1; k.anda = 1; } else { k.anda = 0; k.dir = alvo.x > k.x ? 1 : -1; }
    k.x = cl(k.x, CERCA.x0 + .6, CERCA.x1 - .6); k.y = cl(k.y, CERCA.y0 + .6, CERCA.y1 - .6);
    if (!R.dentro && d < 2.8) { k.fase = "vira"; k.t = 0; S.rosnado(k.x, k.y); R.tremor = .6; }
  } else if (k.fase === "vira") { if (k.t > 1.3) { k.fase = "lobo"; k.t = 0; S.uivo(k.x, k.y); } }
  else if (k.fase === "lobo") {
    const alvo2 = R.dentro ? { x: CASA.porta.x, y: CASA.porta.y + 1 } : alvo, d2 = dist(k, alvo2);
    if (d2 > .1) { k.x += (alvo2.x - k.x) / d2 * 5.9 * dt; k.y += (alvo2.y - k.y) / d2 * 5.9 * dt; k.dir = alvo2.x > k.x ? 1 : -1; k.anda = 1; if (Math.random() < dt * 10) R.poeira.push({ x: k.x, y: k.y, t: 0 }); }
    if (k.t % 1.3 < dt) S.rosnado(k.x, k.y);
    if (!R.dentro && d < .8) morrer("lobo", "O cachorro preto virou lobisomem.", "Fique longe do cachorro. Se ele virar, corra para casa: em 8 segundos ele volta ao normal.");
    if (k.t > 8) { k.fase = "calmo"; k.t = 0; }
  }
}
function atualizarAlma(dt) {
  if (R.alma) { R.alma.t += dt; if (R.alma.t > 1.4) morrer("alma", "Ninguém levou a vela até a cruz. A alma veio buscar.", "Toda noite, siga o som do sino, pegue a vela e deixe na cruz do cemitério antes de amanhecer."); return; }
  if (!ehNoite() || !R.velaHoje || R.velaEntregue) return;
  if (!R.vela && !R.velaCom) { R.velaT -= dt; if (R.velaT <= 0) { let x, y; do { x = rnd(CERCA.x0 + 1, CERCA.x1 - 1); y = rnd(CERCA.y0 + 1, CERCA.y1 - 1); } while (R.solido[Math.floor(y)][Math.floor(x)] || dist({ x, y }, R.eu) < 7); R.vela = { x, y, som: 0 }; efeito("Um sino tocou em algum lugar...", "#e8e2d4"); } }
  if (R.vela && !R.velaCom) { R.vela.som -= dt; if (R.vela.som <= 0) { S.sino(R.vela.x, R.vela.y); R.vela.som = 3.2; } }
}
function atualizarCasa(dt) {
  if (R.dentro) {
    if (!R.pisadeira) { R.lampT += dt; if (R.lampT > 20) { R.lampT = 0; const i = R.lamparinas.lastIndexOf(1); if (i >= 0) { R.lamparinas[i] = 0; S.apaga(); if (i === 0) { R.pisadeira = { t: 0, x: 1.7, y: 2.8 }; S.respira(); R.tremor = .5; efeito("Algo se mexe debaixo da cama", "#e2483d"); } } } }
    else { const p = R.pisadeira; p.t += dt; if (p.t > 1.8) { const d = dist(p, R.sala), v = 2.2 * (.6 + .8 * Math.abs(Math.sin(p.t * 3))); if (d > .05) { p.x += (R.sala.x - p.x) / d * v * dt; p.y += (R.sala.y - p.y) / d * v * dt; p.dir = R.sala.x > p.x ? 1 : -1; } if (p.t % 2.2 < dt) S.respira(); if (d < .6) morrer("pisadeira", "A Pisadeira saiu de baixo da cama.", "Não fique muito tempo dentro de casa: quando as lamparinas apagam, saia. Elas acendem de novo com o tempo."); } if (p.t > 30) R.pisadeira = null; }
  } else { R.lampT += dt; if (R.lampT > 12) { R.lampT = 0; const i = R.lamparinas.indexOf(0); if (i >= 0) R.lamparinas[i] = 1; } }
}

/* ---------- desenho ---------- */
const PX = x => (x - cam.x) * TS + W / 2, PY = y => (y - cam.y) * TS + H / 2;
let cam = { x: 13, y: 12 };
const naTela = (x, y, m = 120) => x > -m && x < W + m && y > -m && y < H + m;
function sombra(x, y, rx, ry, a = .32) { c.fillStyle = `rgba(0,0,0,${a})`; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, 7); c.fill(); }
function desenharArvore(a, tm, fruta) {
  const x = PX(a.x), y = PY(a.y), r = a.r * TS; if (x < -r * 2 || x > W + r * 2 || y < -r * 3 || y > H + r * 2) return;
  sombra(x + r * .2, y + r * .05, r * .9, r * .35, .35);
  c.fillStyle = "#3a2a1a"; c.fillRect(x - r * .12, y - r * 1.1, r * .24, r * 1.1); c.fillStyle = "rgba(0,0,0,.25)"; c.fillRect(x, y - r * 1.1, r * .12, r * 1.1);
  const cores = fruta ? ["#2e5a24", "#3a6a2a", "#4a7a32"] : [["#a8401e", "#c8662a", "#e09a3a"], ["#5a6a2a", "#6a7a36", "#8a9a46"], ["#b8862a", "#d8a83a", "#e8c85a"], ["#7a2a1e", "#9a3a24", "#b85a2a"], ["#3a4a24", "#4a5a2a", "#5a6a32"]][a.c];
  const bal = Math.sin(tm * 1.1 + a.x) * r * .04;
  [[0, -1.5, 1], [-.45, -1.25, .75], [.45, -1.3, .72], [0, -1.95, .7]].forEach(([ox, oy, s], i) => { c.fillStyle = cores[i % 3]; c.beginPath(); c.arc(x + ox * r + bal, y + oy * r, r * .62 * s, 0, 7); c.fill(); });
  c.fillStyle = "rgba(255,240,200,.12)"; c.beginPath(); c.arc(x - r * .2 + bal, y - r * 1.9, r * .28, 0, 7); c.fill();
  if (fruta) for (let i = 0; i < 6; i++) { const on = i < fruta.n * 2; c.fillStyle = on ? "#f29a2a" : "#7a9a3a"; c.beginPath(); c.arc(x + Math.cos(i * 2.4) * r * .45 + bal, y - r * 1.5 + Math.sin(i * 2.4) * r * .35, r * .1, 0, 7); c.fill(); }
}
function desenharCasa(tm) {
  const x = PX(CASA.x), y = PY(CASA.y), w = CASA.w * TS, h = CASA.h * TS; if (!naTela(x + w / 2, y + h / 2, w)) return;
  sombra(x + w / 2, y + h + 4, w * .6, TS * .32, .35);
  // varanda
  c.fillStyle = "#5a3e24"; c.fillRect(x - TS * .2, y + h - TS * .1, w + TS * .4, TS * .5); c.strokeStyle = "rgba(0,0,0,.3)"; c.lineWidth = 1; for (let i = 0; i < 12; i++) { c.beginPath(); c.moveTo(x - TS * .2 + i * (w + TS * .4) / 12, y + h - TS * .1); c.lineTo(x - TS * .2 + i * (w + TS * .4) / 12, y + h + TS * .4); c.stroke(); }
  c.fillStyle = "#6a4a2a"; c.fillRect(x, y + h * .18, w, h * .82); // parede de tábuas
  c.strokeStyle = "rgba(0,0,0,.25)"; for (let i = 1; i < 10; i++) { c.beginPath(); c.moveTo(x, y + h * .18 + i * h * .082); c.lineTo(x + w, y + h * .18 + i * h * .082); c.stroke(); }
  c.fillStyle = "rgba(255,255,255,.05)"; c.fillRect(x, y + h * .18, w * .12, h * .82);
  c.fillStyle = "#4a2a1a"; c.beginPath(); c.moveTo(x - TS * .35, y + h * .24); c.lineTo(x + w / 2, y - h * .34); c.lineTo(x + w + TS * .35, y + h * .24); c.closePath(); c.fill(); // telhado
  c.strokeStyle = "#3a2012"; c.lineWidth = 2; for (let i = 1; i < 6; i++) { const k = i / 6; c.beginPath(); c.moveTo(mix(x - TS * .35, x + w / 2, k), mix(y + h * .24, y - h * .34, k)); c.lineTo(mix(x + w + TS * .35, x + w / 2, k), mix(y + h * .24, y - h * .34, k)); c.stroke(); } // telhas
  c.fillStyle = "#3a3a3a"; c.fillRect(x + w * .74, y - h * .22, TS * .42, h * .32);
  for (let i = 0; i < 4; i++) { const k = (tm * .3 + i / 4) % 1; c.fillStyle = `rgba(200,200,200,${.22 * (1 - k)})`; c.beginPath(); c.arc(x + w * .74 + TS * .2 + Math.sin(tm + i) * 6, y - h * .27 - k * TS * 1.6, 6 + k * 14, 0, 7); c.fill(); }
  const lit = R.lamparinas.filter(v => v).length / 3;
  [[.1, .42], [.7, .42]].forEach(([fx, fy]) => { c.fillStyle = `rgba(255,${190 + lit * 30},110,${.2 + lit * .7})`; c.fillRect(x + w * fx, y + h * fy, w * .2, h * .22); c.strokeStyle = "#2a1a0e"; c.lineWidth = 3; c.strokeRect(x + w * fx, y + h * fy, w * .2, h * .22); c.beginPath(); c.moveTo(x + w * (fx + .1), y + h * fy); c.lineTo(x + w * (fx + .1), y + h * (fy + .22)); c.stroke();
    c.fillStyle = "#4a2a1a"; c.fillRect(x + w * fx - 3, y + h * (fy + .22), w * .2 + 6, 5); for (let i = 0; i < 4; i++) { c.fillStyle = ["#c83a2a", "#e8c84a", "#e8e2d8", "#b8582a"][i]; c.beginPath(); c.arc(x + w * fx + 4 + i * w * .05, y + h * (fy + .22) - 2, 2.6, 0, 7); c.fill(); } }); // janelas com floreira
  // vulto na janela, às vezes, de noite
  if (horaNoite() > .6 && !R.dentro && Math.sin(tm * .37) > .985) { c.fillStyle = "rgba(0,0,0,.85)"; c.beginPath(); c.arc(x + w * .8, y + h * .5, h * .06, 0, 7); c.fill(); c.fillRect(x + w * .77, y + h * .55, w * .06, h * .1); }
  c.fillStyle = "#3a2214"; c.fillRect(x + w * .42, y + h * .5, w * .16, h * .5); c.strokeStyle = "rgba(0,0,0,.4)"; c.strokeRect(x + w * .42, y + h * .5, w * .16, h * .5); c.fillStyle = "#c8a860"; c.beginPath(); c.arc(x + w * .55, y + h * .76, 2.5, 0, 7); c.fill(); // porta
  c.fillStyle = "#e8e0c8"; c.fillRect(x + w * .47, y + h * .42, w * .06, h * .05); // ferradura/plaquinha
  c.fillStyle = "#2a2a2a"; c.fillRect(x + w * .62, y + h * .46, 6, 9); c.fillStyle = `rgba(255,200,110,${.7 + .2 * Math.sin(tm * 7)})`; c.fillRect(x + w * .62 + 1.5, y + h * .46 + 2, 3, 5); // lampião da porta
  c.fillStyle = "#6a4a2a"; c.fillRect(x + w * .08, y + h * .8, w * .18, 5); c.fillRect(x + w * .1, y + h * .8, 3, h * .2); c.fillRect(x + w * .24, y + h * .8, 3, h * .2); // banco da varanda
  c.fillStyle = "#3a3a3a"; c.fillRect(x + w * .82, y + h * .82, 10, h * .18); c.fillStyle = "#5a5a5a"; c.fillRect(x + w * .82 - 2, y + h * .82, 14, 3); // galão
}
function desenharCerca() {
  const post = (tx, ty) => { const x = PX(tx), y = PY(ty); if (!naTela(x, y, 30)) return; c.fillStyle = "#6a4a2a"; c.fillRect(x - 3, y - TS * .55, 6, TS * .55); c.fillStyle = "#4a3018"; c.fillRect(x - 3, y - TS * .58, 6, 4); };
  const trilho = (x0, y0, x1, y1) => { if (!naTela(PX(x0), PY(y0), 60)) return; c.strokeStyle = "#7a5a32"; c.lineWidth = 3; c.beginPath(); c.moveTo(PX(x0), PY(y0) - TS * .42); c.lineTo(PX(x1), PY(y1) - TS * .42); c.moveTo(PX(x0), PY(y0) - TS * .22); c.lineTo(PX(x1), PY(y1) - TS * .22); c.stroke(); };
  return { post, trilho };
}
function desenharPlanta(cv2, x, y, tm) {
  const p = PLANTAS[cv2.tipo], s = TS, e = cv2.est;
  if (cv2.seca && e < 3) { c.fillStyle = "rgba(200,170,120,.35)"; c.beginPath(); c.arc(x, y, s * .22, 0, 7); c.fill(); }
  else { c.fillStyle = "rgba(40,24,14,.5)"; c.beginPath(); c.arc(x, y, s * .22, 0, 7); c.fill(); }
  const bal = Math.sin(tm * 2 + x * .05) * 1.5;
  if (e === 0) { c.fillStyle = "#7a9a3a"; c.fillRect(x - 1, y - s * .12, 2, s * .12); c.beginPath(); c.ellipse(x + 3, y - s * .12, 3, 1.6, -.4, 0, 7); c.fill(); return; }
  if (cv2.tipo === "milho") { const hh = s * (.25 + e * .2); c.strokeStyle = "#6a8a2a"; c.lineWidth = 3; c.beginPath(); c.moveTo(x, y); c.lineTo(x + bal, y - hh); c.stroke(); c.lineWidth = 2; c.beginPath(); c.moveTo(x, y - hh * .5); c.quadraticCurveTo(x - s * .2, y - hh * .6, x - s * .26 + bal, y - hh * .4); c.moveTo(x, y - hh * .7); c.quadraticCurveTo(x + s * .2, y - hh * .8, x + s * .24 + bal, y - hh * .62); c.stroke(); if (e >= 3) { c.fillStyle = p.cor; c.beginPath(); c.ellipse(x + 4, y - hh * .62, 3, 6, .3, 0, 7); c.fill(); c.strokeStyle = "#c8a050"; c.lineWidth = 1; c.beginPath(); c.moveTo(x + 4, y - hh * .62 - 6); c.lineTo(x + 6, y - hh * .62 - 10); c.stroke(); } }
  else if (cv2.tipo === "mandioca") { c.fillStyle = "#4a7a2a"; for (let i = 0; i < 3 + e; i++) { const a = i / (3 + e) * PI * 2; c.beginPath(); c.ellipse(x + Math.cos(a) * s * .1 * e + bal * .5, y - s * .1 * e - 2 + Math.sin(a) * s * .05, s * .07, s * .03, a, 0, 7); c.fill(); } c.strokeStyle = "#8a3a2a"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - s * .1 * e); c.stroke(); if (e >= 3) { c.fillStyle = p.cor; c.beginPath(); c.ellipse(x - 4, y + 1, 5, 2.4, .2, 0, 7); c.fill(); } }
  else { const r = s * (.05 + e * .06); c.strokeStyle = "#5a8a2a"; c.lineWidth = 2; c.beginPath(); c.moveTo(x - s * .25, y - 2); c.quadraticCurveTo(x, y - s * .12, x + s * .25, y - 1); c.stroke(); c.fillStyle = "#4a7a2a"; c.beginPath(); c.ellipse(x - s * .16, y - 4, s * .07, s * .04, 0, 0, 7); c.ellipse(x + s * .16, y - 4, s * .07, s * .04, 0, 0, 7); c.fill();
    if (e >= 2) { c.fillStyle = e >= 3 ? p.cor : "#8aa84a"; c.beginPath(); c.ellipse(x, y - r * .8, r * (cv2.tipo === "melancia" ? 1.25 : 1.05), r * .85, 0, 0, 7); c.fill(); c.strokeStyle = cv2.tipo === "melancia" ? "rgba(20,60,20,.6)" : "rgba(120,50,10,.5)"; c.lineWidth = 1.2; for (let i = -1; i <= 1; i++) { c.beginPath(); c.ellipse(x + i * r * .4, y - r * .8, r * .2, r * .8, 0, 0, 7); c.stroke(); } c.fillStyle = "#4a6a2a"; c.fillRect(x - 1, y - r * 1.7, 2, r * .3); } }
  if (e >= 3) { c.fillStyle = `rgba(255,240,180,${.35 + .25 * Math.sin(tm * 4 + x)})`; c.beginPath(); c.arc(x, y - s * .5, 2, 0, 7); c.fill(); }
}
function desenharVoce(x, y, tm, o = {}) {
  const s = (o.s || TS) / 48, e = R.eu, dir = o.dir ?? (R.dentro ? R.sala.dir || 1 : e.dir), andaK = o.anda ?? e.anda, f = e.fase, p = R.perto;
  const ch = (COSMETICOS.find(k => k[0] === R.chapeu) || COSMETICOS[0])[3];
  sombra(x, y, 13 * s, 4.5 * s);
  c.save(); c.translate(x, y); c.scale(dir * s, s);
  const sw = Math.sin(f) * 7 * andaK, bob = Math.abs(Math.cos(f)) * 2 * andaK, tremeK = p > .6 ? Math.sin(tm * 40) * .8 : 0;
  c.translate(tremeK, 0);
  c.fillStyle = "#3a2a1e"; c.fillRect(-6 + sw * .4, -12, 5, 12); c.fillRect(1 - sw * .4, -12, 5, 12);
  c.fillStyle = "#2a1a12"; c.fillRect(-7 + sw * .4, -3, 7, 3); c.fillRect(0 - sw * .4, -3, 7, 3);
  c.fillStyle = "#3a5a8a"; c.beginPath(); c.roundRect ? c.roundRect(-9, -31 - bob, 18, 21, 5) : c.rect(-9, -31 - bob, 18, 21); c.fill();
  c.fillStyle = "#2e4a72"; c.fillRect(-4, -22 - bob, 8, 6); c.fillStyle = "#c8a070"; c.fillRect(-9, -31 - bob, 18, 6); c.fillStyle = "#a8805a"; for (let i = 0; i < 3; i++) c.fillRect(-9 + i * 6, -31 - bob, 3, 6); c.fillStyle = "#3a5a8a"; c.fillRect(-6, -31 - bob, 3, 6); c.fillRect(3, -31 - bob, 3, 6); c.fillStyle = "#d8c060"; c.fillRect(-5.5, -26 - bob, 2, 2); c.fillRect(3.5, -26 - bob, 2, 2);
  c.fillStyle = "#e8c8a0"; const braco = R.regando > 0 ? -1.1 : Math.sin(f + PI) * .5 * andaK; c.save(); c.translate(7, -27 - bob); c.rotate(braco); c.fillStyle = "#c8a070"; c.fillRect(-2.5, 0, 5, 6); c.fillStyle = "#e8c8a0"; c.fillRect(-2, 6, 4, 6); c.restore(); c.save(); c.translate(-7, -27 - bob); c.rotate(-Math.sin(f + PI) * .5 * andaK); c.fillStyle = "#c8a070"; c.fillRect(-2.5, 0, 5, 6); c.fillStyle = "#e8c8a0"; c.fillRect(-2, 6, 4, 6); c.restore();
  if (R.regando > 0) { c.fillStyle = "#8a9aa8"; c.fillRect(12, -24 - bob, 9, 6); c.fillRect(20, -25 - bob, 6, 2); c.fillStyle = "rgba(120,190,230,.8)"; for (let i = 0; i < 4; i++) c.fillRect(25 + i * 2, -22 - bob + ((tm * 60 + i * 5) % 14), 1.5, 3); }
  else if (R.lanterna && !R.dentro) { c.strokeStyle = "#2a2a2a"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(10, -16 - bob); c.lineTo(10, -12 - bob); c.stroke(); c.fillStyle = "#3a3a3a"; c.fillRect(7, -12 - bob, 7, 8); c.fillStyle = "rgba(255,220,140,.95)"; c.fillRect(8.5, -10.5 - bob, 4, 5); }
  c.fillStyle = "#e8c8a0"; c.beginPath(); c.arc(0, -38 - bob, 8.5, 0, 7); c.fill(); c.fillStyle = "rgba(0,0,0,.08)"; c.beginPath(); c.arc(-2, -36 - bob, 7, 0, 7); c.fill();
  c.fillStyle = "#1a1210"; const ol = 1.3 + p * 1.3; c.beginPath(); c.arc(3, -39 - bob, ol, 0, 7); c.arc(7, -39 - bob, ol * .9, 0, 7); c.fill();
  if (p > .45) { c.fillStyle = "#fff"; c.beginPath(); c.arc(3.3, -39.4 - bob, .6, 0, 7); c.arc(7.2, -39.4 - bob, .6, 0, 7); c.fill(); c.fillStyle = "#1a1210"; c.beginPath(); c.ellipse(5, -34 - bob, 1.6, 2.4, 0, 0, 7); c.fill(); c.fillStyle = "rgba(160,200,230,.8)"; c.fillRect(-4, -40 - bob + ((tm * 20) % 6), 1.5, 2.5); c.strokeStyle = "#1a1210"; c.lineWidth = 1; c.beginPath(); c.moveTo(1.5, -42 - bob); c.lineTo(4, -43.2 - bob); c.moveTo(6, -43.2 - bob); c.lineTo(8.5, -42 - bob); c.stroke(); }
  else { c.strokeStyle = "#7a3a2a"; c.lineWidth = 1.2; c.beginPath(); c.arc(5, -35 - bob, 2, .2, PI - .2); c.stroke(); }
  c.fillStyle = "rgba(220,120,100,.35)"; c.beginPath(); c.arc(1, -35 - bob, 2, 0, 7); c.fill();
  c.fillStyle = ch; c.beginPath(); c.ellipse(0, -44 - bob, 15, 4, 0, 0, 7); c.fill(); c.beginPath(); c.ellipse(0, -48 - bob, 8, 6, 0, PI, 0); c.fill(); c.fillRect(-8, -48 - bob, 16, 4);
  c.fillStyle = "rgba(0,0,0,.22)"; c.fillRect(-8, -46 - bob, 16, 2); c.strokeStyle = "rgba(0,0,0,.15)"; c.lineWidth = .8; for (let i = -12; i < 13; i += 4) { c.beginPath(); c.moveTo(i, -45 - bob); c.lineTo(i * .9, -43 - bob); c.stroke(); }
  c.restore();
}
function desenharGato(g, tm) {
  const s = TS / 48, x = PX(g.x), y = PY(g.y); sombra(x, y, 9 * s, 3 * s);
  c.save(); c.translate(x, y); c.scale((g.dir || 1) * s, s); const pa = g.anda ? Math.sin(tm * 14) * 2 : 0;
  c.fillStyle = "#2a2a30"; c.fillRect(-7 + pa, -5, 2.5, 5); c.fillRect(4 - pa, -5, 2.5, 5);
  c.beginPath(); c.ellipse(0, -8, 9, 5, 0, 0, 7); c.fill(); c.beginPath(); c.arc(8, -13, 5, 0, 7); c.fill();
  c.beginPath(); c.moveTo(5, -16); c.lineTo(6, -21); c.lineTo(9, -17); c.moveTo(9, -17); c.lineTo(12, -21); c.lineTo(12, -15); c.fill();
  c.strokeStyle = "#2a2a30"; c.lineWidth = 3; c.lineCap = "round"; c.beginPath(); c.moveTo(-8, -9); c.quadraticCurveTo(-15, -14 + Math.sin(tm * 2) * 3, -13, -20); c.stroke();
  c.fillStyle = "#c8e86a"; c.fillRect(9, -14, 1.6, 1.6); c.fillRect(12, -14, 1.6, 1.6); c.fillStyle = "#d88a8a"; c.fillRect(12.5, -11.5, 1.2, 1);
  c.restore();
}
function desenharGalinha(g, tm) {
  const s = TS / 48, x = PX(g.x), y = PY(g.y); if (!naTela(x, y, 30)) return; sombra(x, y, 6 * s, 2 * s);
  c.save(); c.translate(x, y); c.scale((g.dir || 1) * s, s); const bic = g.anda ? 0 : Math.max(0, Math.sin(tm * 5 + g.x * 3)) * 3;
  c.strokeStyle = "#d8a030"; c.lineWidth = 1.2; c.beginPath(); c.moveTo(-1, -3); c.lineTo(-1, 0); c.moveTo(2, -3); c.lineTo(2, 0); c.stroke();
  c.fillStyle = "#f0ece0"; c.beginPath(); c.ellipse(0, -7, 6, 4.5, 0, 0, 7); c.fill(); c.beginPath(); c.moveTo(-5, -8); c.lineTo(-9, -12); c.lineTo(-5, -5); c.fill();
  c.beginPath(); c.arc(5, -11 + bic, 3, 0, 7); c.fill(); c.fillStyle = "#d83a2a"; c.beginPath(); c.arc(5, -14.5 + bic, 1.6, 0, 7); c.fill(); c.fillRect(6.5, -10 + bic, 1.4, 2.4);
  c.fillStyle = "#e8a020"; c.beginPath(); c.moveTo(7.5, -11.5 + bic); c.lineTo(10, -10.5 + bic); c.lineTo(7.5, -9.6 + bic); c.fill(); c.fillStyle = "#1a1a1a"; c.fillRect(5.5, -12 + bic, 1.2, 1.2);
  c.restore();
}
function desenharGalinheiro(tm) {
  const G = GALINHEIRO, x = PX(G.x), y = PY(G.y), w = G.w * TS, h = G.h * TS; if (!naTela(x + w / 2, y, w)) return;
  sombra(x + w / 2, y + h, w * .55, TS * .2, .3);
  c.fillStyle = "#8a5a32"; c.fillRect(x, y + h * .3, w, h * .7); c.strokeStyle = "rgba(0,0,0,.25)"; c.lineWidth = 1; for (let i = 1; i < 6; i++) { c.beginPath(); c.moveTo(x + i * w / 6, y + h * .3); c.lineTo(x + i * w / 6, y + h); c.stroke(); }
  c.fillStyle = "#5a3a22"; c.beginPath(); c.moveTo(x - 8, y + h * .34); c.lineTo(x + w / 2, y - h * .1); c.lineTo(x + w + 8, y + h * .34); c.fill();
  c.fillStyle = "#1a1210"; c.fillRect(x + w * .4, y + h * .55, w * .2, h * .45); c.strokeStyle = "#c8a860"; c.lineWidth = 2; c.beginPath(); c.moveTo(x + w * .5, y + h); c.lineTo(x + w * .62, y + h * 1.2); c.stroke();
  for (let i = 0; i < Math.min(R.ovos, 5); i++) { c.fillStyle = "#f4ecd8"; c.beginPath(); c.ellipse(x + w * .45 + i * 7, y + h * 1.08, 3, 4, 0, 0, 7); c.fill(); }
  c.fillStyle = "#e8d8a0"; c.font = `800 ${Math.round(TS * .2)}px "Big Shoulders Display", sans-serif`; c.textAlign = "center"; c.fillText("GALINHEIRO", x + w / 2, y + h * .5); c.textAlign = "start";
}
function desenharCeleiro(tm) {
  const C = CELEIRO, x = PX(C.x), y = PY(C.y), w = C.w * TS, h = C.h * TS; if (!naTela(x + w / 2, y + h / 2, w)) return;
  sombra(x + w / 2, y + h, w * .58, TS * .3, .35);
  c.fillStyle = "#8a2a1e"; c.fillRect(x, y + h * .28, w, h * .72); c.strokeStyle = "rgba(0,0,0,.22)"; c.lineWidth = 1; for (let i = 1; i < 14; i++) { c.beginPath(); c.moveTo(x + i * w / 14, y + h * .28); c.lineTo(x + i * w / 14, y + h); c.stroke(); }
  c.fillStyle = "#5a1a12"; c.beginPath(); c.moveTo(x - 10, y + h * .32); c.lineTo(x + w * .2, y); c.lineTo(x + w * .8, y); c.lineTo(x + w + 10, y + h * .32); c.fill();
  c.fillStyle = "#1a0e0a"; c.fillRect(x + w * .36, y + h * .48, w * .28, h * .52); c.strokeStyle = "#e8e0d0"; c.lineWidth = 3; c.strokeRect(x + w * .36, y + h * .48, w * .28, h * .52); c.beginPath(); c.moveTo(x + w * .36, y + h * .48); c.lineTo(x + w * .64, y + h); c.moveTo(x + w * .64, y + h * .48); c.lineTo(x + w * .36, y + h); c.stroke();
  c.fillStyle = "#f2e8c8"; c.fillRect(x + w * .44, y + h * .14, w * .12, h * .14); c.fillStyle = "#1a0e0a"; c.fillRect(x + w * .46, y + h * .16, w * .08, h * .1);
  if (horaNoite() > .5 && Math.sin(tm * .5) > .9) { c.fillStyle = "rgba(255,240,200,.9)"; c.fillRect(x + w * .48, y + h * .2, 2, 2); c.fillRect(x + w * .51, y + h * .2, 2, 2); } // olhos no alto do celeiro
  // fardos de feno
  [[-.6, .95], [-.3, 1.05], [1.05, 1]].forEach(([fx, fy]) => { const bx = x + w * (fx < 0 ? 0 : 1) + fx * TS, by = y + h * fy; c.fillStyle = "#d8b860"; c.beginPath(); c.ellipse(bx, by - TS * .2, TS * .34, TS * .26, 0, 0, 7); c.fill(); c.strokeStyle = "rgba(120,90,30,.6)"; c.lineWidth = 1.5; c.beginPath(); c.ellipse(bx, by - TS * .2, TS * .2, TS * .26, 0, 0, 7); c.stroke(); });
}
function desenharTrator() { const x = PX(TRATOR.x), y = PY(TRATOR.y); if (!naTela(x, y)) return; sombra(x, y, TS * .9, TS * .2); c.fillStyle = "#3a6a3a"; c.fillRect(x - TS * .7, y - TS * .8, TS * 1.1, TS * .5); c.fillRect(x - TS * .2, y - TS * 1.25, TS * .5, TS * .5); c.fillStyle = "rgba(150,180,200,.4)"; c.fillRect(x - TS * .12, y - TS * 1.18, TS * .34, TS * .3); c.fillStyle = "#111"; c.beginPath(); c.arc(x - TS * .45, y - TS * .3, TS * .32, 0, 7); c.fill(); c.beginPath(); c.arc(x + TS * .35, y - TS * .2, TS * .22, 0, 7); c.fill(); c.fillStyle = "#c8a030"; c.beginPath(); c.arc(x - TS * .45, y - TS * .3, TS * .12, 0, 7); c.fill(); c.fillStyle = "rgba(110,60,30,.6)"; c.fillRect(x - TS * .5, y - TS * .7, TS * .3, TS * .2); c.fillStyle = "#3a3a3a"; c.fillRect(x + TS * .1, y - TS * 1.5, 4, TS * .3); }
function desenharCasinha() { const x = PX(CASINHA.x), y = PY(CASINHA.y + .7); if (!naTela(x, y)) return; sombra(x, y, TS * .4, TS * .12); c.fillStyle = "#7a5a32"; c.fillRect(x - TS * .35, y - TS * 1.2, TS * .7, TS * 1.2); c.fillStyle = "#5a3a22"; c.beginPath(); c.moveTo(x - TS * .45, y - TS * 1.15); c.lineTo(x, y - TS * 1.45); c.lineTo(x + TS * .45, y - TS * 1.15); c.fill(); c.fillStyle = "#1a1210"; c.fillRect(x - TS * .2, y - TS * .95, TS * .4, TS * .95); c.fillStyle = "#e8d8a0"; c.beginPath(); c.arc(x, y - TS * .8, 3.5, 0, 7); c.fill(); c.fillStyle = "#1a1210"; c.beginPath(); c.arc(x + 1, y - TS * .8, 2.6, -1, 2); c.fill(); }
function desenharCatavento(tm) { const x = PX(CATAVENTO.x + .5), y = PY(CATAVENTO.y + .6); if (!naTela(x, y, 200)) return; sombra(x, y, TS * .3, TS * .1); c.strokeStyle = "#5a5a5a"; c.lineWidth = 3; c.beginPath(); c.moveTo(x - TS * .3, y); c.lineTo(x, y - TS * 2.6); c.lineTo(x + TS * .3, y); c.moveTo(x - TS * .2, y - TS * .9); c.lineTo(x + TS * .2, y - TS * .9); c.moveTo(x - TS * .12, y - TS * 1.7); c.lineTo(x + TS * .12, y - TS * 1.7); c.stroke(); const a = tm * 2.2; c.fillStyle = "#c8c0b0"; for (let i = 0; i < 8; i++) { const an = a + i * PI / 4; c.beginPath(); c.moveTo(x, y - TS * 2.7); c.lineTo(x + Math.cos(an) * TS * .7, y - TS * 2.7 + Math.sin(an) * TS * .7); c.lineTo(x + Math.cos(an + .3) * TS * .6, y - TS * 2.7 + Math.sin(an + .3) * TS * .6); c.fill(); } c.fillStyle = "#3a3a3a"; c.beginPath(); c.arc(x, y - TS * 2.7, 4, 0, 7); c.fill(); c.fillStyle = "#8a2a1e"; c.beginPath(); c.moveTo(x, y - TS * 2.7); c.lineTo(x - TS * .7, y - TS * 2.8); c.lineTo(x - TS * .7, y - TS * 2.55); c.fill(); }
function desenharVaral(tm) { const x0 = PX(VARAL.x0), x1 = PX(VARAL.x1), y = PY(VARAL.y); if (!naTela(x0, y, 300)) return; c.fillStyle = "#5a3a22"; c.fillRect(x0 - 2, y - TS * 1.3, 4, TS * 1.3); c.fillRect(x1 - 2, y - TS * 1.3, 4, TS * 1.3); c.strokeStyle = "#cfc8b8"; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, y - TS * 1.25); c.quadraticCurveTo((x0 + x1) / 2, y - TS * 1.1, x1, y - TS * 1.25); c.stroke();
  [["#c83a2a", .15], ["#e8e2d8", .38], ["#3a5a8a", .6], ["#e8c84a", .82]].forEach(([cor, k], i) => { const px = mix(x0, x1, k), py = y - TS * 1.2 + Math.sin(k * PI) * TS * .1, bal = Math.sin(tm * 2.2 + i) * 4; c.fillStyle = cor; c.beginPath(); c.moveTo(px - TS * .18, py); c.lineTo(px + TS * .18, py); c.lineTo(px + TS * .16 + bal, py + TS * .42); c.lineTo(px - TS * .16 + bal, py + TS * .42); c.fill(); }); }
function desenharCemiterio(tm) {
  const C = CEMITERIO;
  for (let i = 0; i < 9; i++) { const gx = C.x0 + .8 + (i % 3) * 1.9, gy = C.y0 + 1.6 + Math.floor(i / 3) * 1.9; if (Math.abs(gx - CRUZ.x) < 1 && Math.abs(gy - CRUZ.y) < 1) continue; const x = PX(gx), y = PY(gy); if (!naTela(x, y)) continue; sombra(x, y, TS * .2, TS * .06);
    if (i % 2) { c.fillStyle = "#7a7a7a"; c.beginPath(); c.moveTo(x - TS * .2, y); c.lineTo(x - TS * .2, y - TS * .5); c.arc(x, y - TS * .5, TS * .2, PI, 0); c.lineTo(x + TS * .2, y); c.fill(); c.fillStyle = "rgba(0,0,0,.3)"; c.fillRect(x - TS * .1, y - TS * .5, TS * .2, 2); }
    else { c.fillStyle = "#4a3420"; c.fillRect(x - 2, y - TS * .7, 4, TS * .7); c.fillRect(x - TS * .18, y - TS * .55, TS * .36, 4); } }
  const ce = desenharCerca(); for (let x = C.x0; x <= C.x1; x += 1) { [C.y0, C.y1].forEach(y => { const sx = PX(x), sy = PY(y); if (!naTela(sx, sy)) return; c.fillStyle = "#2a2a2e"; c.fillRect(sx - 1.5, sy - TS * .4, 3, TS * .4); c.beginPath(); c.moveTo(sx - 3, sy - TS * .4); c.lineTo(sx, sy - TS * .5); c.lineTo(sx + 3, sy - TS * .4); c.fill(); }); }
  for (let y = C.y0; y <= C.y1; y++) [C.x0, C.x1].forEach(x => { const sx = PX(x), sy = PY(y); if (!naTela(sx, sy)) return; c.fillStyle = "#2a2a2e"; c.fillRect(sx - 1.5, sy - TS * .4, 3, TS * .4); });
  c.strokeStyle = "#2a2a2e"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(PX(C.x0), PY(C.y0) - TS * .3); c.lineTo(PX(C.x1), PY(C.y0) - TS * .3); c.stroke();
}
function desenharSeco(s, tm) {
  if (s.fase === "longe" || s.fase === "aviso") { if (s.fase === "aviso") { const x = PX(s.x), y = PY(s.y); if (naTela(x, y)) { c.fillStyle = "rgba(255,150,70,.9)"; c.fillRect(x - 4, y - TS * .5, 2.5, 2.5); c.fillRect(x + 2, y - TS * .5, 2.5, 2.5); } } return; }
  const sc = TS / 48 * 1.35, x = PX(s.x), y = PY(s.y); if (!naTela(x, y, 200)) return;
  const f = s.fase2 || 0, sw = Math.sin(f), sw2 = Math.sin(f + PI), boca = .25 + .75 * Math.abs(Math.sin(tm * 5.5));
  sombra(x, y, 30 * sc, 6 * sc, .45); c.save(); c.translate(x, y); c.scale((s.dir || 1) * sc, sc); c.lineCap = "round"; c.lineJoin = "round";
  const pele = "#4a3a26", escura = "#2e2216", membro = (pts, w, cor = pele) => { c.strokeStyle = cor; c.lineWidth = w; c.beginPath(); pts.forEach(([px, py], i) => i ? c.lineTo(px, py) : c.moveTo(px, py)); c.stroke(); c.fillStyle = cor; pts.slice(1, -1).forEach(([px, py]) => { c.beginPath(); c.arc(px, py, w * .75, 0, 7); c.fill(); }); };
  // pernas de trás (juntas para cima, como aranha)
  membro([[-30, -30], [-42 + sw * 6, -54 - Math.max(0, sw) * 6], [-48 + sw * 10, 0]], 5, escura);
  membro([[30 - 18, -34], [24 + sw2 * 6, -56], [34 + sw2 * 12, 0]], 4.5, escura);
  // corpo: costas arqueadas, barriga funda
  c.fillStyle = pele; c.beginPath(); c.moveTo(-34, -30); c.quadraticCurveTo(-12, -58, 14, -40); c.lineTo(18, -32); c.quadraticCurveTo(-6, -36, -32, -24); c.closePath(); c.fill();
  c.fillStyle = escura; for (let i = 0; i < 8; i++) { const k = i / 7, bx = mix(-30, 12, k), by = -32 - Math.sin(k * PI) * 16; c.beginPath(); c.arc(bx, by - 2, 2.2, 0, 7); c.fill(); } // coluna saltada
  c.strokeStyle = "rgba(20,14,8,.7)"; c.lineWidth = 1.2; for (let i = 0; i < 6; i++) { const bx = -14 + i * 4.4; c.beginPath(); c.moveTo(bx, -45 + Math.abs(i - 2.5)); c.quadraticCurveTo(bx + 3, -36, bx - 1, -31); c.stroke(); } // costelas
  c.strokeStyle = "rgba(200,170,120,.18)"; c.lineWidth = 1; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(-26 + i * 8, -38 + (i % 2) * 3); c.lineTo(-20 + i * 8, -34); c.stroke(); } // rachaduras da pele seca
  // braços da frente e garras
  const mao1 = [40 + sw * 12, 0], mao2 = [30 + sw2 * 10, 0];
  membro([[12, -38], [22 + sw * 5, -58 - Math.max(0, -sw) * 6], mao1], 4.5);
  membro([[10, -36], [16 + sw2 * 5, -54], mao2], 4, escura);
  [mao1, mao2].forEach(([mx, my]) => { c.strokeStyle = "#1a120a"; c.lineWidth = 1.6; for (let d = -2; d <= 2; d++) { c.beginPath(); c.moveTo(mx, my - 2); c.quadraticCurveTo(mx + 5 + d, my - 2, mx + 9 + d * 1.5, my + 1); c.stroke(); } });
  // pescoço e cabeça baixa com a boca enorme
  membro([[14, -38], [26, -36], [34, -30]], 6);
  c.save(); c.translate(38, -28); c.rotate(-.1 + Math.sin(tm * 8) * .04);
  const ab = boca * .9; // mandíbula
  c.fillStyle = "#1a0606"; c.beginPath(); c.moveTo(-4, 0); c.lineTo(24, -6 - ab * 3); c.lineTo(26, 6 + ab * 12); c.lineTo(-2, 8); c.closePath(); c.fill(); // fundo da boca
  const g = c.createRadialGradient(10, 2, 1, 10, 2, 20); g.addColorStop(0, "rgba(120,10,10,.9)"); g.addColorStop(1, "rgba(30,0,0,0)"); c.fillStyle = g; c.beginPath(); c.moveTo(-4, 0); c.lineTo(24, -6 - ab * 3); c.lineTo(26, 6 + ab * 12); c.lineTo(-2, 8); c.fill();
  c.fillStyle = pele; c.beginPath(); c.moveTo(-8, -14); c.quadraticCurveTo(10, -22, 28, -10 - ab * 3); c.lineTo(26, -5 - ab * 3); c.quadraticCurveTo(10, -6, -4, 0); c.closePath(); c.fill(); // crânio/mandíbula de cima
  c.save(); c.translate(-2, 6); c.rotate(ab * .55); c.fillStyle = pele; c.beginPath(); c.moveTo(0, 0); c.lineTo(28, 2); c.lineTo(26, 7); c.quadraticCurveTo(10, 10, -2, 6); c.fill(); // mandíbula de baixo
  c.fillStyle = "#e8e0c8"; for (let i = 0; i < 8; i++) { c.beginPath(); c.moveTo(3 + i * 3.1, 1); c.lineTo(4.5 + i * 3.1, -5 - (i % 2) * 2); c.lineTo(6 + i * 3.1, 1); c.fill(); } c.restore();
  c.fillStyle = "#e8e0c8"; for (let i = 0; i < 9; i++) { const tx = -2 + i * 3, ty = -3 + (i / 8) * (-3 - ab * 3); c.beginPath(); c.moveTo(tx, ty - 1); c.lineTo(tx + 1.5, ty + 6 + (i % 2) * 3); c.lineTo(tx + 3, ty - 1); c.fill(); } // dentes de cima, compridos
  c.strokeStyle = "rgba(220,220,200,.5)"; c.lineWidth = .8; c.beginPath(); c.moveTo(14, 2); c.quadraticCurveTo(15, 8 + ab * 6, 13, 12 + Math.sin(tm * 3) * 3); c.stroke(); // baba
  c.fillStyle = "rgba(255,150,70,1)"; c.beginPath(); c.arc(8, -15, 1.9, 0, 7); c.arc(14, -15, 1.6, 0, 7); c.fill(); c.fillStyle = "rgba(255,150,70,.25)"; c.beginPath(); c.arc(11, -15, 9, 0, 7); c.fill();
  c.strokeStyle = "#1e160c"; c.lineWidth = 1.2; for (let i = 0; i < 9; i++) { c.beginPath(); c.moveTo(-6 + i * 2.6, -17); c.quadraticCurveTo(-10 + i * 2.6, -6, -12 + i * 2.4 + Math.sin(tm * 6 + i) * 2, 6 + (i % 3) * 4); c.stroke(); } // cabelo sujo caindo
  c.restore();
  c.restore();
}
function desenharCachorro(k, tm) {
  const sc = TS / 48, x = PX(k.x), y = PY(k.y), lobo = k.fase === "lobo", vira = k.fase === "vira"; if (!naTela(x, y, 200)) return;
  const cresce = vira ? cl(k.t / 1.3, 0, 1) : lobo ? 1 : 0;
  sombra(x, y, (11 + cresce * 8) * sc, 4 * sc, .42); c.save(); c.translate(x + (vira ? Math.sin(tm * 60) * 2 : 0), y); c.scale((k.dir || 1) * sc, sc); c.lineCap = "round"; c.lineJoin = "round";
  const f = tm * (lobo ? 14 : 8), sw = Math.sin(f) * (k.anda ? 4 : 0);
  if (!lobo && cresce < .5) { // cachorro preto: magro demais, pernas compridas demais, sorriso
    c.fillStyle = "#0e0e10"; c.strokeStyle = "#0e0e10"; c.lineWidth = 2.6; [[-9, sw], [-5, -sw], [6, -sw], [10, sw]].forEach(([lx, s2]) => { c.beginPath(); c.moveTo(lx, -10); c.lineTo(lx + s2 * .5, -5); c.lineTo(lx + s2, 0); c.stroke(); });
    c.beginPath(); c.ellipse(0, -13, 12, 5.5, 0, 0, 7); c.fill(); c.strokeStyle = "rgba(60,60,70,.6)"; c.lineWidth = .8; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(-3 + i * 3, -17); c.lineTo(-4 + i * 3, -10); c.stroke(); }
    c.fillStyle = "#0e0e10"; c.beginPath(); c.ellipse(12, -19, 6, 5, .2, 0, 7); c.fill(); c.beginPath(); c.moveTo(14, -18); c.lineTo(22, -16); c.lineTo(15, -13); c.fill();
    c.beginPath(); c.moveTo(9, -23); c.lineTo(10, -29); c.lineTo(13, -23); c.fill(); c.strokeStyle = "#0e0e10"; c.lineWidth = 3; c.beginPath(); c.moveTo(-11, -14); c.quadraticCurveTo(-17, -17, -18, -11); c.stroke();
    c.strokeStyle = "#e8e0d0"; c.lineWidth = .9; c.beginPath(); c.moveTo(15, -15.4); c.quadraticCurveTo(18, -14, 21, -15.5); c.stroke(); // sorriso
    c.fillStyle = `rgba(230,40,30,${vira ? 1 : .85})`; c.fillRect(14, -21, 1.9, 1.9); c.fillStyle = "rgba(230,40,30,.25)"; c.beginPath(); c.arc(15, -20, 5, 0, 7); c.fill();
    if (vira) { c.fillStyle = "rgba(230,40,30,.18)"; c.beginPath(); c.arc(0, -16, 22 + Math.sin(tm * 30) * 4, 0, 7); c.fill(); }
  } else { // lobisomem: corcunda, peludo, braços até o chão, focinho aberto
    c.save(); const e = (.7 + .3 * cresce) * 1.25; c.scale(e, e);
    const pelo = "#17120e", pelo2 = "#2a2018", m = (pts, w, cor = pelo) => { c.strokeStyle = cor; c.lineWidth = w; c.beginPath(); pts.forEach(([px, py], i) => i ? c.lineTo(px, py) : c.moveTo(px, py)); c.stroke(); };
    m([[-2, -34], [-9 + sw, -16], [-4 + sw * 1.4, 0], [2 + sw * 1.4, 0]], 7, pelo2); m([[2, -34], [8 - sw, -17], [12 - sw * 1.4, 0], [18 - sw * 1.4, 0]], 7.5); // pernas de bicho
    c.fillStyle = pelo; c.beginPath(); c.moveTo(-12, -34); for (let i = 0; i <= 14; i++) { const a = PI + i / 14 * PI, r = 17 + (i % 2) * 4; c.lineTo(4 + Math.cos(a) * r * 1.05, -46 + Math.sin(a) * r * 1.15); } c.lineTo(16, -30); c.quadraticCurveTo(2, -26, -12, -34); c.fill(); // tronco peludo e corcunda
    c.fillStyle = "#3a2a1e"; c.beginPath(); c.ellipse(9, -42, 6, 8, .3, 0, 7); c.fill(); c.strokeStyle = "rgba(0,0,0,.4)"; c.lineWidth = 1; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(5, -46 + i * 4); c.lineTo(13, -45 + i * 4); c.stroke(); } // peito
    m([[12, -54], [24, -40 + sw], [28, -22], [30, -6]], 6); m([[4, -54], [14, -38 - sw], [18, -20], [20, -6]], 5.5, pelo2); // braços compridos
    [[30, -6], [20, -6]].forEach(([mx, my]) => { c.strokeStyle = "#e8dcc8"; c.lineWidth = 1.6; for (let d = -1; d <= 1.5; d++) { c.beginPath(); c.moveTo(mx, my); c.quadraticCurveTo(mx + 4, my + 3, mx + 3 + d * 2.5, my + 7); c.stroke(); } });
    // cabeça com focinho e mandíbula aberta
    c.save(); c.translate(16, -62); c.rotate(.15 + Math.sin(tm * 6) * .05);
    const ab = .3 + .5 * Math.abs(Math.sin(tm * 4));
    c.fillStyle = pelo; c.beginPath(); c.ellipse(0, 0, 10, 9, 0, 0, 7); c.fill();
    c.beginPath(); c.moveTo(-5, -6); c.lineTo(-9, -20); c.lineTo(0, -8); c.fill(); c.beginPath(); c.moveTo(2, -8); c.lineTo(4, -21); c.lineTo(8, -6); c.fill(); // orelhas
    c.fillStyle = "#4a1010"; c.beginPath(); c.moveTo(5, 0); c.lineTo(24, -2); c.lineTo(23, 4 + ab * 10); c.lineTo(5, 6); c.fill();
    c.fillStyle = pelo; c.beginPath(); c.moveTo(4, -6); c.lineTo(25, -4); c.lineTo(24, 0); c.lineTo(4, 1); c.fill(); c.fillStyle = "#0a0a0a"; c.beginPath(); c.arc(24, -3, 2, 0, 7); c.fill();
    c.save(); c.translate(5, 4); c.rotate(ab * .5); c.fillStyle = pelo; c.beginPath(); c.moveTo(0, 0); c.lineTo(18, 1); c.lineTo(16, 5); c.lineTo(0, 4); c.fill(); c.fillStyle = "#f0e8d8"; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(3 + i * 3, 1); c.lineTo(4.4 + i * 3, -3); c.lineTo(5.8 + i * 3, 1); c.fill(); } c.restore();
    c.fillStyle = "#f0e8d8"; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(6 + i * 3, 0); c.lineTo(7.4 + i * 3, 4.5 + (i === 0 || i === 4 ? 3 : 0)); c.lineTo(8.8 + i * 3, 0); c.fill(); }
    c.fillStyle = "rgba(255,40,30,1)"; c.beginPath(); c.arc(4, -3, 2.1, 0, 7); c.fill(); c.fillStyle = "rgba(255,40,30,.3)"; c.beginPath(); c.arc(4, -3, 10, 0, 7); c.fill();
    if (horaNoite() > .3) for (let i = 0; i < 3; i++) { const kk = (tm * .8 + i / 3) % 1; c.fillStyle = `rgba(220,220,230,${.25 * (1 - kk)})`; c.beginPath(); c.arc(26 + kk * 10, 2 - kk * 6, 2 + kk * 5, 0, 7); c.fill(); } // bafo no frio
    c.restore();
    c.strokeStyle = pelo; c.lineWidth = 2; for (let i = 0; i < 10; i++) { c.beginPath(); c.moveTo(-10 + i * 2.5, -58 + Math.abs(i - 4) * 1.6); c.lineTo(-14 + i * 2.5, -64 + Math.abs(i - 4) * 1.6); c.stroke(); } // pelo arrepiado nas costas
    c.restore();
  }
  c.restore();
}
function desenharVulto(v, tm) { const x = PX(v.x), y = PY(v.y); if (!naTela(x, y)) return; const a = Math.min(1, v.t / 2) * .95; c.save(); c.globalAlpha = a; c.fillStyle = "#020203"; c.beginPath(); c.ellipse(x, y - TS * 1.1, TS * .22, TS * .9, 0, 0, 7); c.fill(); c.beginPath(); c.arc(x, y - TS * 2.1, TS * .16, 0, 7); c.fill(); c.strokeStyle = "#020203"; c.lineWidth = 3; c.beginPath(); c.moveTo(x - TS * .2, y - TS * 1.6); c.lineTo(x - TS * .3, y - TS * .5); c.moveTo(x + TS * .2, y - TS * 1.6); c.lineTo(x + TS * .3, y - TS * .5); c.stroke(); c.fillStyle = "rgba(240,240,235,.95)"; c.fillRect(x - 4, y - TS * 2.14, 2.6, 2.6); c.fillRect(x + 1.6, y - TS * 2.14, 2.6, 2.6); c.restore(); }
function desenharVela(x, y, tm) { c.fillStyle = "#e8e2d0"; c.fillRect(x - 3, y - 14, 6, 14); c.fillStyle = "rgba(200,190,170,.8)"; c.fillRect(x - 3, y - 14, 2, 8); c.fillStyle = `rgba(255,${200 + Math.sin(tm * 20) * 30},90,.95)`; c.beginPath(); c.ellipse(x + Math.sin(tm * 9) * .8, y - 18, 2.6, 4.5, 0, 0, 7); c.fill(); }
function desenharCruz(tm) {
  const x = PX(CRUZ.x), y = PY(CRUZ.y); if (!naTela(x, y)) return; sombra(x, y, TS * .3, TS * .1);
  c.fillStyle = "#5a4028"; c.fillRect(x - 4, y - TS * 1.5, 8, TS * 1.5); c.fillRect(x - TS * .42, y - TS * 1.15, TS * .84, 7);
  c.fillStyle = "rgba(240,235,220,.6)"; c.fillRect(x - TS * .3, y - TS * .95, TS * .1, TS * .3);
  for (let i = 0; i < 5; i++) { c.fillStyle = "#e8e2d0"; c.fillRect(x - TS * .5 + i * TS * .25, y - 7, 4, 7); } // tocos de velas antigas
  if (R.velaEntregue) desenharVela(x + TS * .35, y, tm);
  for (let i = 0; i < 3; i++) { c.fillStyle = ["#c83a2a", "#e8c84a", "#e8e2d4"][i]; c.beginPath(); c.arc(x - TS * .25 + i * TS * .2, y + 4, 3, 0, 7); c.fill(); }
}
function desenharMundo(tm) {
  const offC = R.venceu ? Math.max(0, R.venceu.t - 1.5) * 2.2 : 0, alvo = R.venceu ? { x: CAMINHONETE.x, y: CAMINHONETE.y + offC } : R.eu; cam.x = mix(cam.x, alvo.x, .12); cam.y = mix(cam.y, alvo.y - .6, .12);
  if (R.tremor > 0) { cam.x += rnd(-.06, .06); cam.y += rnd(-.06, .06); }
  c.fillStyle = "#1a2210"; c.fillRect(0, 0, W, H);
  c.drawImage(chaoCv, PX(0), PY(0), MW * TS, MH * TS);
  // detalhes do chão: pedras, flores, cogumelos
  R.pedras.forEach(p => { const x = PX(p.x), y = PY(p.y); if (!naTela(x, y, 20)) return; c.fillStyle = "#7a7468"; c.beginPath(); c.ellipse(x, y, TS * .12 * (1 + p.k), TS * .08 * (1 + p.k), 0, 0, 7); c.fill(); c.fillStyle = "rgba(255,255,255,.15)"; c.beginPath(); c.ellipse(x - 2, y - 2, TS * .05, TS * .03, 0, 0, 7); c.fill(); });
  R.flores.forEach(p => { const x = PX(p.x), y = PY(p.y); if (!naTela(x, y, 20)) return; c.strokeStyle = "#4a6a2a"; c.lineWidth = 1; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - 6); c.stroke(); c.fillStyle = ["#e8c84a", "#e8e2d8", "#c86ab8", "#e07a2a"][Math.floor(p.k * 4)]; c.beginPath(); c.arc(x, y - 7, 2.4, 0, 7); c.fill(); });
  R.cogumelos.forEach(p => { const x = PX(p.x), y = PY(p.y); if (!naTela(x, y, 20)) return; c.fillStyle = "#e8e0d0"; c.fillRect(x - 1, y - 4, 2, 4); c.fillStyle = p.k < .5 ? "#c83a2a" : "#a8804a"; c.beginPath(); c.arc(x, y - 4, 3.4, PI, 0); c.fill(); if (p.k < .5) { c.fillStyle = "#fff"; c.fillRect(x - 1.5, y - 6, 1, 1); c.fillRect(x + 1, y - 5.5, 1, 1); } });
  // lago
  const lx = PX((LAGO.x0 + LAGO.x1) / 2), ly = PY((LAGO.y0 + LAGO.y1) / 2), lrx = (LAGO.x1 - LAGO.x0) / 2 * TS, lry = (LAGO.y1 - LAGO.y0) / 2 * TS;
  if (naTela(lx, ly, lrx + 50)) { const lg = c.createRadialGradient(lx, ly, 4, lx, ly, lrx); lg.addColorStop(0, "#2a5a6a"); lg.addColorStop(1, "#1e3e4a"); c.fillStyle = lg; c.beginPath(); c.ellipse(lx, ly, lrx, lry, 0, 0, 7); c.fill();
    c.fillStyle = "rgba(255,255,255,.06)"; c.beginPath(); c.ellipse(lx - lrx * .3, ly - lry * .4, lrx * .4, lry * .12, -.2, 0, 7); c.fill();
    c.strokeStyle = "rgba(200,230,240,.22)"; c.lineWidth = 1.2; for (let i = 0; i < 8; i++) { const r = ((tm * .25 + i / 8) % 1); c.beginPath(); c.ellipse(lx + Math.sin(i * 3) * lrx * .5, ly + Math.cos(i * 2) * lry * .5, r * TS * .7, r * TS * .25, 0, 0, 7); c.stroke(); }
    c.fillStyle = "#3a6a2a"; [[.7, .1], [-.6, .6], [.3, -.7], [-.2, .2]].forEach(([fx, fy]) => { c.beginPath(); c.ellipse(lx + fx * lrx * .8, ly + fy * lry * .8, TS * .2, TS * .11, 0, 0, 7); c.fill(); }); c.fillStyle = "#e8a8c8"; c.beginPath(); c.arc(lx + .3 * lrx * .8, ly - .7 * lry * .8, 3, 0, 7); c.fill();
    if (horaNoite() > .5 && Math.sin(tm * .3) > .93) { c.fillStyle = "rgba(240,240,240,.7)"; c.beginPath(); c.arc(lx + lrx * .2, ly + lry * .1, 3, 0, 7); c.arc(lx + lrx * .2 + 8, ly + lry * .1, 3, 0, 7); c.fill(); } // olhos na água
  }
  c.fillStyle = "#7a5a32"; c.fillRect(PX(DOCA.x - .2), PY(DOCA.y - .3), TS * 1.5, TS * .6); c.strokeStyle = "rgba(0,0,0,.3)"; c.lineWidth = 1; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(PX(DOCA.x - .2 + i * .26), PY(DOCA.y - .3)); c.lineTo(PX(DOCA.x - .2 + i * .26), PY(DOCA.y + .3)); c.stroke(); }
  // canteiros
  R.canteiros.forEach(k => {
    const x = PX(k.x), y = PY(k.y); if (!naTela(x + k.w * TS / 2, y + k.h * TS / 2, k.w * TS)) return;
    if (k.aberto) { c.fillStyle = "#5a3a22"; c.fillRect(x - 3, y - 3, k.w * TS + 6, k.h * TS + 6); c.fillStyle = "#4a2e1a"; for (let r = 0; r < k.h; r++) c.fillRect(x, y + r * TS + TS * .38, k.w * TS, TS * .24); c.strokeStyle = "#6a4a2a"; c.lineWidth = 3; c.strokeRect(x - 3, y - 3, k.w * TS + 6, k.h * TS + 6); }
    else { c.fillStyle = "rgba(60,50,30,.5)"; c.fillRect(x, y, k.w * TS, k.h * TS); c.strokeStyle = "rgba(240,230,200,.35)"; c.setLineDash([6, 6]); c.lineWidth = 2; c.strokeRect(x, y, k.w * TS, k.h * TS); c.setLineDash([]);
      c.fillStyle = "rgba(240,230,200,.8)"; c.font = `700 ${Math.round(TS * .3)}px "JetBrains Mono", monospace`; c.textAlign = "center"; c.fillText(`${k.preco} moedas`, x + k.w * TS / 2, y + k.h * TS / 2 + 4); c.textAlign = "start";
      for (let i = 0; i < 8; i++) { c.strokeStyle = "#4a5a2a"; c.lineWidth = 2; const gx = x + ((i * 37) % (k.w * TS)), gy = y + ((i * 23) % (k.h * TS)); c.beginPath(); c.moveTo(gx, gy + 6); c.lineTo(gx - 3, gy - 4); c.moveTo(gx, gy + 6); c.lineTo(gx + 4, gy - 3); c.stroke(); } }
  });
  // objetos ordenados pela altura na tela
  const obj = [];
  R.arvores.forEach(a => obj.push([a.y, () => desenharArvore(a, tm)]));
  POMAR.forEach(([x, y], i) => obj.push([y, () => desenharArvore({ x, y, r: .8, c: 1 }, tm, R.frutas[i])]));
  obj.push([CASA.y + CASA.h, () => desenharCasa(tm)]);
  obj.push([GALINHEIRO.y + GALINHEIRO.h, () => desenharGalinheiro(tm)]);
  obj.push([CELEIRO.y + CELEIRO.h, () => desenharCeleiro(tm)]);
  obj.push([TRATOR.y, () => desenharTrator()]); obj.push([CASINHA.y + .7, () => desenharCasinha()]); obj.push([CATAVENTO.y + .6, () => desenharCatavento(tm)]); obj.push([VARAL.y, () => desenharVaral(tm)]);
  obj.push([CEMITERIO.y0 + 1, () => desenharCemiterio(tm)]);
  R.galinhas.forEach(g => obj.push([g.y, () => desenharGalinha(g, tm)]));
  R.canteiros.forEach(k => k.aberto && k.covas.forEach((cv2, i) => cv2 && obj.push([k.y + Math.floor(i / k.w) + .55, () => desenharPlanta(cv2, PX(k.x + i % k.w + .5), PY(k.y + Math.floor(i / k.w) + .55), tm)])));
  obj.push([POCO.y + .3, () => { const x = PX(POCO.x), y = PY(POCO.y + .3); if (!naTela(x, y)) return; sombra(x, y, TS * .55, TS * .2); c.fillStyle = "#6a6a6a"; c.beginPath(); c.ellipse(x, y - TS * .3, TS * .45, TS * .18, 0, 0, 7); c.fill(); c.fillRect(x - TS * .45, y - TS * .3, TS * .9, TS * .3); c.strokeStyle = "rgba(0,0,0,.25)"; c.lineWidth = 1; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(x - TS * .45 + i * TS * .3, y - TS * .3); c.lineTo(x - TS * .45 + i * TS * .3, y); c.stroke(); } c.fillStyle = "#0a0c10"; c.beginPath(); c.ellipse(x, y - TS * .32, TS * .34, TS * .12, 0, 0, 7); c.fill(); c.fillStyle = "#5a3a22"; c.fillRect(x - TS * .42, y - TS * 1.1, 5, TS * .8); c.fillRect(x + TS * .38, y - TS * 1.1, 5, TS * .8); c.fillRect(x - TS * .46, y - TS * 1.15, TS * .92, 6); c.strokeStyle = "#ccc"; c.beginPath(); c.moveTo(x, y - TS * 1.1); c.lineTo(x, y - TS * .6); c.stroke(); c.fillStyle = "#7a7a7a"; c.fillRect(x - 5, y - TS * .62, 10, 8); }]);
  obj.push([CAIXOTE.y, () => { const x = PX(CAIXOTE.x), y = PY(CAIXOTE.y); if (!naTela(x, y)) return; sombra(x, y, TS * .4, TS * .12); c.fillStyle = "#8a6a3a"; c.fillRect(x - TS * .35, y - TS * .5, TS * .7, TS * .5); c.strokeStyle = "#5a3a1a"; c.lineWidth = 2; c.strokeRect(x - TS * .35, y - TS * .5, TS * .7, TS * .5); c.beginPath(); c.moveTo(x - TS * .35, y - TS * .25); c.lineTo(x + TS * .35, y - TS * .25); c.stroke(); c.fillStyle = "#f2c94a"; c.font = `800 ${Math.round(TS * .22)}px "Big Shoulders Display", sans-serif`; c.textAlign = "center"; c.fillText("VENDA", x, y - TS * .56); c.textAlign = "start"; }]);
  obj.push([CRUZ.y, () => desenharCruz(tm)]);
  obj.push([CAMINHONETE.y + .9 + offC, () => { const x = PX(CAMINHONETE.x), y = PY(CAMINHONETE.y + .9 + offC), w = TS * 2.6, h = TS * 1; if (!naTela(x, y, 200)) return; sombra(x, y, w * .55, TS * .2, .4); c.fillStyle = "#8a2a1e"; c.fillRect(x - w / 2, y - h * .9, w, h * .6); c.fillRect(x - w * .1, y - h * 1.35, w * .5, h * .5); c.fillStyle = "rgba(150,180,200,.5)"; c.fillRect(x + w * .02, y - h * 1.28, w * .32, h * .32); c.fillStyle = "#3a1a14"; c.fillRect(x - w / 2, y - h * .9, w * .42, 4); c.fillStyle = "#111"; [-.32, .32].forEach(o => { c.beginPath(); c.arc(x + o * w, y - h * .26, h * .26, 0, 7); c.fill(); c.fillStyle = "#666"; c.beginPath(); c.arc(x + o * w, y - h * .26, h * .1, 0, 7); c.fill(); c.fillStyle = "#111"; });
    c.fillStyle = "rgba(110,60,30,.6)"; c.fillRect(x - w * .3, y - h * .62, w * .2, h * .2); c.fillStyle = "#d8d0c0"; c.fillRect(x + w * .46, y - h * .7, 5, 6); if (R.pecas < 3) { c.fillStyle = "rgba(240,230,200,.8)"; c.font = `700 ${Math.round(TS * .26)}px "JetBrains Mono", monospace`; c.textAlign = "center"; c.fillText(`${R.pecas}/3 peças`, x, y - h * 1.5); c.textAlign = "start"; } }]);
  PLACAS.forEach(pl => obj.push([pl.y, () => { const x = PX(pl.x), y = PY(pl.y); if (!naTela(x, y)) return; sombra(x, y, TS * .2, TS * .07); c.fillStyle = "#5a3a22"; c.fillRect(x - 2, y - TS * .7, 4, TS * .7); c.fillStyle = "#8a6a3a"; c.fillRect(x - TS * .3, y - TS * .85, TS * .6, TS * .32); c.fillStyle = "rgba(30,20,10,.7)"; for (let i = 0; i < 3; i++) c.fillRect(x - TS * .22, y - TS * .78 + i * TS * .08, TS * (.3 + (i % 2) * .14), 2); }]));
  obj.push([18.6, () => { const x = PX(20.2), y = PY(18.6); if (!naTela(x, y)) return; sombra(x, y, TS * .3, TS * .1); c.fillStyle = "#5a3a22"; c.fillRect(x - 2, y - TS * 1.2, 4, TS * 1.2); c.fillRect(x - TS * .4, y - TS * .95, TS * .8, 4); c.fillStyle = "#4a6a8a"; c.fillRect(x - TS * .18, y - TS * .95, TS * .36, TS * .42); c.fillStyle = "#e8d8a0"; c.beginPath(); c.arc(x, y - TS * 1.1, TS * .14, 0, 7); c.fill(); c.fillStyle = "#c8a050"; c.beginPath(); c.ellipse(x, y - TS * 1.2, TS * .26, TS * .06, 0, 0, 7); c.fill(); const ol = horaNoite() > .5 && Math.sin(tm * .6) > .8; c.fillStyle = ol ? "#e2483d" : "#1a1a1a"; c.fillRect(x - 3, y - TS * 1.12, 2, 2); c.fillRect(x + 2, y - TS * 1.12, 2, 2); c.strokeStyle = "#1a1a1a"; c.lineWidth = 1; c.beginPath(); c.moveTo(x - 4, y - TS * 1.04); for (let i = 0; i < 5; i++) c.lineTo(x - 4 + i * 2, y - TS * 1.04 + (i % 2) * 2); c.stroke(); }]); // espantalho
  const ce = desenharCerca();
  for (let x = CERCA.x0; x <= CERCA.x1; x++) { obj.push([CERCA.y0, () => ce.post(x, CERCA.y0)]); if (x < CERCA.x1) obj.push([CERCA.y0, () => ce.trilho(x, CERCA.y0, x + 1, CERCA.y0)]); obj.push([CERCA.y1, () => ce.post(x, CERCA.y1)]); if (x < CERCA.x1 && (x < 24 || x > 26)) obj.push([CERCA.y1, () => ce.trilho(x, CERCA.y1, x + 1, CERCA.y1)]); }
  for (let y = CERCA.y0; y <= CERCA.y1; y++) { obj.push([y, () => ce.post(CERCA.x0, y)]); obj.push([y, () => ce.post(CERCA.x1, y)]); if (y < CERCA.y1) { obj.push([y + 1, () => ce.trilho(CERCA.x0, y, CERCA.x0, y + 1)]); obj.push([y + 1, () => ce.trilho(CERCA.x1, y, CERCA.x1, y + 1)]); } }
  for (let y = 6; y <= 11; y++) { obj.push([y, () => ce.post(25.5, y)]); obj.push([y, () => ce.post(32.5, y)]); } for (let x = 25.5; x <= 32.5; x++) if (x < 28 || x > 29.5) obj.push([11.6, () => ce.post(x, 11.6)]); // cercadinho
  obj.push([R.gato.y, () => desenharGato(R.gato, tm)]);
  if (R.cachorro) obj.push([R.cachorro.y, () => desenharCachorro(R.cachorro, tm)]);
  obj.push([R.seco.y, () => desenharSeco(R.seco, tm)]);
  if (R.vulto) obj.push([R.vulto.y, () => desenharVulto(R.vulto, tm)]);
  if (R.vela && !R.velaCom) obj.push([R.vela.y, () => desenharVela(PX(R.vela.x), PY(R.vela.y), tm)]);
  if (!R.dentro && !(R.venceu && R.venceu.t > 1)) obj.push([R.eu.y, () => { desenharVoce(PX(R.eu.x), PY(R.eu.y), tm); if (R.velaCom) desenharVela(PX(R.eu.x) - TS * .28, PY(R.eu.y) - TS * .35, tm); }]);
  obj.sort((a, b) => a[0] - b[0]).forEach(o => o[1]());
  R.poeira.forEach(q => { c.fillStyle = `rgba(150,120,80,${.4 * (1 - q.t / .8)})`; c.beginPath(); c.arc(PX(q.x), PY(q.y) - 4, 3 + q.t * 10, 0, 7); c.fill(); });
  if (R.pesca) { const bx = PX(DOCA.x + 1.8), by = PY(DOCA.y + .3) + Math.sin(tm * 3) * 2 + (R.pesca.fisgou ? 6 : 0); c.strokeStyle = "rgba(230,230,230,.6)"; c.lineWidth = 1; c.beginPath(); c.moveTo(PX(R.eu.x) + TS * .3, PY(R.eu.y) - TS * .7); c.quadraticCurveTo(bx, by - TS, bx, by); c.stroke(); c.fillStyle = "#e2483d"; c.beginPath(); c.arc(bx, by, 4, 0, 7); c.fill(); if (R.pesca.fisgou) { c.fillStyle = "#f2c94a"; c.font = `900 ${Math.round(TS * .6)}px "Big Shoulders Display", sans-serif`; c.fillText("!", bx - 5, by - TS * .6); } }
  const nt = horaNoite();
  if (nt < .5) for (let i = 0; i < 18; i++) { const k = (tm * .08 + i / 18) % 1, x = ((i * 137 + tm * 18) % (W + 40)) - 20, y = k * H; c.fillStyle = ["#c8662a", "#d89a2a", "#a8401e"][i % 3]; c.save(); c.translate(x + Math.sin(tm * 2 + i) * 10, y); c.rotate(tm * 2 + i); c.fillRect(-3, -1.5, 6, 3); c.restore(); }
  else for (let i = 0; i < 4; i++) { const k = (tm * .04 + i / 4) % 1; c.fillStyle = "rgba(170,180,200,.05)"; c.beginPath(); c.ellipse(((i * 290 + tm * 12) % (W + 400)) - 200, H * (.3 + i * .18), W * .35, H * .06, 0, 0, 7); c.fill(); } // neblina
}
function desenharLuz(tm) {
  const nt = horaNoite(), lw = luzCv.width, lh = luzCv.height, k = lw / W;
  const tarde = cl(1 - Math.abs(((R.t % CICLO) - (DIA - 14)) / 22), 0, 1) * (1 - nt);
  if (tarde > .02) { c.fillStyle = `rgba(255,140,60,${.16 * tarde})`; c.fillRect(0, 0, W, H); }
  if (nt <= .02) return;
  lc.setTransform(1, 0, 0, 1, 0, 0); lc.globalCompositeOperation = "source-over"; lc.clearRect(0, 0, lw, lh);
  lc.fillStyle = `rgba(6,10,24,${.92 * nt})`; lc.fillRect(0, 0, lw, lh);
  lc.globalCompositeOperation = "destination-out";
  const furo = (x, y, r, a = 1) => { const g = lc.createRadialGradient(x * k, y * k, 0, x * k, y * k, r * k); g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(.55, `rgba(0,0,0,${a * .7})`); g.addColorStop(1, "rgba(0,0,0,0)"); lc.fillStyle = g; lc.beginPath(); lc.arc(x * k, y * k, r * k, 0, 7); lc.fill(); };
  const ex = PX(R.eu.x), ey = PY(R.eu.y) - TS * .4;
  furo(ex, ey, TS * (R.lanterna ? (R.lanternaBoa ? 5.4 : 4.4) : 1.7) * (1 + Math.sin(tm * 9) * .01), R.lanterna ? 1 : .75);
  const lit = R.lamparinas.filter(v => v).length / 3;
  if (lit) [[.2, .53], [.8, .53]].forEach(([fx, fy]) => furo(PX(CASA.x + CASA.w * fx), PY(CASA.y + CASA.h * fy) + TS * .6, TS * 1.7 * lit, .8));
  furo(PX(CASA.x + CASA.w * .62), PY(CASA.y + CASA.h * .5), TS * 1.1, .8); // lampião da porta
  if (R.vela && !R.velaCom) furo(PX(R.vela.x), PY(R.vela.y) - 16, TS * 1.4, .9);
  if (R.velaEntregue) furo(PX(CRUZ.x), PY(CRUZ.y) - 20, TS * 1.6, .9);
  for (let i = 0; i < 22; i++) { const fx = CERCA.x0 + 1 + (i * 7.3) % (CERCA.x1 - CERCA.x0 - 2) + Math.sin(tm * .4 + i) * 1.2, fy = CERCA.y0 + 1 + (i * 5.1) % (CERCA.y1 - CERCA.y0 - 2) + Math.cos(tm * .5 + i * 2) * .8, a = .5 + .5 * Math.sin(tm * 3 + i * 1.7); if (a > .3) furo(PX(fx), PY(fy), TS * .35, a * .8); }
  c.drawImage(luzCv, 0, 0, W, H);
  c.globalCompositeOperation = "lighter";
  const brilho = (x, y, r, rgb, a) => { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); };
  if (R.lanterna) brilho(ex, ey, TS * 3, "255,200,120", .14 * nt);
  if (R.vela && !R.velaCom) brilho(PX(R.vela.x), PY(R.vela.y) - 16, TS * .9, "255,190,90", .35 * nt);
  for (let i = 0; i < 22; i++) { const fx = CERCA.x0 + 1 + (i * 7.3) % (CERCA.x1 - CERCA.x0 - 2) + Math.sin(tm * .4 + i) * 1.2, fy = CERCA.y0 + 1 + (i * 5.1) % (CERCA.y1 - CERCA.y0 - 2) + Math.cos(tm * .5 + i * 2) * .8, a = .5 + .5 * Math.sin(tm * 3 + i * 1.7); if (a > .3) brilho(PX(fx), PY(fy), 6, "200,255,140", a * nt); }
  if (R.seco.fase === "anda" || R.seco.fase === "sai") brilho(PX(R.seco.x) + (R.seco.dir || 1) * TS * .9, PY(R.seco.y) - TS * .9, TS * .5, "255,140,60", .5 * nt);
  if (R.cachorro) brilho(PX(R.cachorro.x) + (R.cachorro.dir || 1) * TS * .35, PY(R.cachorro.y) - TS * (R.cachorro.fase === "lobo" ? 1.2 : .45), TS * .35, "255,40,30", .6 * nt);
  c.globalCompositeOperation = "source-over";
  if (nt > .6) for (let i = 0; i < 6; i++) { const on = Math.sin(tm * .7 + i * 2.3) > .8; if (!on) continue; const ox = PX(i % 2 ? CERCA.x0 - 1.5 : CERCA.x1 + 1.5), oy = PY(CERCA.y0 + 3 + i * 4); c.fillStyle = "rgba(255,80,60,.8)"; c.fillRect(ox - 4, oy, 2.5, 2.5); c.fillRect(ox + 2, oy, 2.5, 2.5); }
}
/* ---------- dentro de casa (vista de cima, cheia de coisas) ---------- */
function desenharDentro(tm) {
  const s = Math.min(W / (SALA.w + 1.2), H / (SALA.h + 1.4)), ox = W / 2 - SALA.w / 2 * s, oy = H / 2 - SALA.h / 2 * s + s * .1, X = x => ox + x * s, Y = y => oy + y * s;
  c.fillStyle = "#06070a"; c.fillRect(0, 0, W, H);
  // piso de tábuas
  c.fillStyle = "#5a3e26"; c.fillRect(X(0), Y(.9), SALA.w * s, (SALA.h - .9) * s);
  for (let i = 0; i < 14; i++) { c.fillStyle = i % 2 ? "rgba(0,0,0,.08)" : "rgba(255,255,255,.03)"; c.fillRect(X(0), Y(.9 + i * .44), SALA.w * s, .44 * s); c.strokeStyle = "rgba(0,0,0,.2)"; c.lineWidth = 1; for (let k = 0; k < 4; k++) { const px = X(((i * 3.7 + k * 2.6) % SALA.w)); c.beginPath(); c.moveTo(px, Y(.9 + i * .44)); c.lineTo(px, Y(1.34 + i * .44)); c.stroke(); } }
  // parede do fundo com janelas, quadro e relógio
  c.fillStyle = "#4a3220"; c.fillRect(X(0), Y(0), SALA.w * s, .9 * s); c.fillStyle = "rgba(0,0,0,.2)"; for (let i = 0; i < 20; i++) c.fillRect(X(i * .5), Y(0), 1, .9 * s);
  const noite = horaNoite(); [[2.5, .15], [6.3, .15]].forEach(([jx, jy]) => { c.fillStyle = noite > .5 ? "#0a1020" : "#8aa8c0"; c.fillRect(X(jx), Y(jy), .9 * s, .55 * s); c.strokeStyle = "#2a1a0e"; c.lineWidth = 3; c.strokeRect(X(jx), Y(jy), .9 * s, .55 * s); c.beginPath(); c.moveTo(X(jx + .45), Y(jy)); c.lineTo(X(jx + .45), Y(jy + .55)); c.stroke(); c.fillStyle = "rgba(200,60,50,.6)"; c.fillRect(X(jx - .12), Y(jy - .05), .14 * s, .65 * s); c.fillRect(X(jx + .88), Y(jy - .05), .14 * s, .65 * s);
    if (noite > .5 && Math.sin(tm * .45 + jx) > .97) { c.fillStyle = "rgba(240,240,230,.9)"; c.fillRect(X(jx + .3), Y(jy + .25), 3, 3); c.fillRect(X(jx + .5), Y(jy + .25), 3, 3); } }); // olhos na janela
  c.fillStyle = "#c8a860"; c.fillRect(X(5.1), Y(.15), .55 * s, .6 * s); c.fillStyle = "#3a5a8a"; c.fillRect(X(5.17), Y(.22), .41 * s, .46 * s); c.fillStyle = "#e8d8a0"; c.beginPath(); c.arc(X(5.37), Y(.36), .08 * s, 0, 7); c.fill(); c.fillStyle = "rgba(255,230,150,.5)"; c.beginPath(); c.arc(X(5.37), Y(.36), .14 * s, 0, 7); c.fill(); // quadro de santo
  const rx = X(8.4), ry = Y(.45); c.fillStyle = "#6a4a2a"; c.fillRect(rx - .18 * s, ry - .3 * s, .36 * s, .7 * s); c.fillStyle = "#e8e0c8"; c.beginPath(); c.arc(rx, ry - .08 * s, .13 * s, 0, 7); c.fill(); c.strokeStyle = "#1a1a1a"; c.lineWidth = 1.2; c.beginPath(); c.moveTo(rx, ry - .08 * s); c.lineTo(rx + Math.sin(tm * .1) * .1 * s, ry - .08 * s - Math.cos(tm * .1) * .1 * s); c.stroke(); c.strokeStyle = "#c8a030"; c.beginPath(); c.moveTo(rx, ry + .08 * s); c.lineTo(rx + Math.sin(tm * 3) * .08 * s, ry + .3 * s); c.stroke(); // relógio de pêndulo
  // paredes laterais
  c.fillStyle = "#3a2a1a"; c.fillRect(X(-.2), Y(0), .2 * s, SALA.h * s); c.fillRect(X(SALA.w), Y(0), .2 * s, SALA.h * s); c.fillRect(X(-.2), Y(SALA.h), (SALA.porta.x - .6 + .2) * s, .2 * s); c.fillRect(X(SALA.porta.x + .6), Y(SALA.h), (SALA.w - SALA.porta.x - .6 + .2) * s, .2 * s);
  c.fillStyle = "#2a1a0e"; c.fillRect(X(SALA.porta.x - .6), Y(SALA.h - .05), 1.2 * s, .25 * s); c.fillStyle = "rgba(240,230,200,.6)"; c.font = `700 ${Math.round(s * .17)}px "JetBrains Mono", monospace`; c.textAlign = "center"; c.fillText("PORTA", X(SALA.porta.x), Y(SALA.h + .5)); c.textAlign = "start";
  // tapete
  c.fillStyle = "#7a3a3a"; c.beginPath(); c.ellipse(X(5), Y(4.6), 1.8 * s, .9 * s, 0, 0, 7); c.fill(); c.strokeStyle = "rgba(230,200,120,.5)"; c.lineWidth = 2; c.beginPath(); c.ellipse(X(5), Y(4.6), 1.5 * s, .7 * s, 0, 0, 7); c.stroke();
  // cama (de onde ela sai)
  c.fillStyle = "#4a3020"; c.fillRect(X(.4), Y(.7), 2.6 * s, 2.1 * s); c.fillStyle = "#c8c0b0"; c.fillRect(X(.5), Y(.8), 2.4 * s, 1.9 * s); c.fillStyle = "#6a5a8a"; c.fillRect(X(.5), Y(1.5), 2.4 * s, 1.2 * s); c.fillStyle = "rgba(255,255,255,.08)"; for (let i = 0; i < 5; i++) c.fillRect(X(.5 + i * .5), Y(1.5), .2 * s, 1.2 * s); c.fillStyle = "#e8e2d8"; c.fillRect(X(.7), Y(.9), .9 * s, .45 * s); c.fillRect(X(1.8), Y(.9), .9 * s, .45 * s);
  c.fillStyle = "#020203"; c.fillRect(X(.4), Y(2.8), 2.6 * s, .14 * s); // o escuro debaixo da cama
  if (!R.pisadeira && R.lamparinas.filter(v => v).length <= 1 && Math.sin(tm * 1.3) > .6) { c.fillStyle = "rgba(240,220,170,.8)"; c.fillRect(X(1.4), Y(2.86), 2.5, 2); c.fillRect(X(1.6), Y(2.86), 2.5, 2); } // olhos debaixo da cama
  // fogão a lenha com fogo
  c.fillStyle = "#2a2a2a"; c.fillRect(X(3.6), Y(.4), 1.6 * s, 1.1 * s); c.fillStyle = "#3a3a3a"; c.fillRect(X(3.65), Y(.45), 1.5 * s, .35 * s); c.fillStyle = "#1a1a1a"; c.beginPath(); c.arc(X(4), Y(.62), .13 * s, 0, 7); c.arc(X(4.6), Y(.62), .13 * s, 0, 7); c.fill();
  c.fillStyle = "#120a06"; c.fillRect(X(3.9), Y(1.0), .9 * s, .4 * s); for (let i = 0; i < 5; i++) { c.fillStyle = `rgba(255,${120 + i * 25},40,${.6 + .3 * Math.sin(tm * 12 + i)})`; c.beginPath(); c.ellipse(X(4.05 + i * .15), Y(1.3), .06 * s, (.1 + .08 * Math.abs(Math.sin(tm * 9 + i))) * s, 0, 0, 7); c.fill(); }
  c.fillStyle = "#3a3a3a"; c.fillRect(X(4.25), Y(0), .2 * s, .45 * s); // chaminé
  c.fillStyle = "#5a3a1a"; for (let i = 0; i < 6; i++) { c.beginPath(); c.arc(X(3.3 + (i % 2) * .2), Y(1.3 - Math.floor(i / 2) * .16), .09 * s, 0, 7); c.fill(); } // lenha
  c.fillStyle = "#6a6a6a"; c.beginPath(); c.arc(X(4.6), Y(.62), .1 * s, 0, 7); c.fill(); for (let i = 0; i < 3; i++) { const k = (tm * .5 + i / 3) % 1; c.fillStyle = `rgba(220,220,220,${.25 * (1 - k)})`; c.beginPath(); c.arc(X(4.6) + Math.sin(tm + i) * 3, Y(.5) - k * s * .4, 3 + k * 6, 0, 7); c.fill(); } // chaleira
  // prateleira com potes
  c.fillStyle = "#6a4a2a"; c.fillRect(X(.6), Y(.05), 1.7 * s, .12 * s); ["#c8a050", "#a83a2a", "#e8e0c8", "#4a7a3a", "#c87a2a"].forEach((cor, i) => { c.fillStyle = cor; c.fillRect(X(.7 + i * .32), Y(-.18), .2 * s, .23 * s); });
  // bancada de ferramentas
  c.fillStyle = "#6a4a2a"; c.fillRect(X(7.4), Y(.4), 2.2 * s, 1.1 * s); c.fillStyle = "#7a5a32"; c.fillRect(X(7.4), Y(.4), 2.2 * s, .2 * s); c.fillStyle = "#8a8a8a"; c.fillRect(X(7.6), Y(.75), .5 * s, .12 * s); c.fillStyle = "#5a3a22"; c.fillRect(X(7.6), Y(.87), .2 * s, .3 * s); c.fillStyle = "#c8a050"; c.fillRect(X(8.4), Y(.7), .6 * s, .4 * s); c.fillStyle = "#2a2a2a"; c.fillRect(X(9.1), Y(.65), .3 * s, .5 * s);
  c.fillStyle = "rgba(242,201,74,.95)"; c.font = `800 ${Math.round(s * .2)}px "Big Shoulders Display", sans-serif`; c.fillText("BANCADA", X(7.55), Y(1.85));
  for (let i = 0; i < R.pecas; i++) { c.fillStyle = ["#3a3a3a", "#111", "#7a7a7a"][i]; c.beginPath(); c.arc(X(7.8 + i * .5), Y(1.3), .14 * s, 0, 7); c.fill(); } // peças compradas
  // armário
  c.fillStyle = "#5a3a22"; c.fillRect(X(8.7), Y(2.4), .9 * s, 2.4 * s); c.strokeStyle = "rgba(0,0,0,.4)"; c.lineWidth = 2; c.beginPath(); c.moveTo(X(9.15), Y(2.4)); c.lineTo(X(9.15), Y(4.8)); c.stroke(); const fresta = Math.max(0, Math.sin(tm * .4)) > .95 ? .06 : 0; c.fillStyle = "#020203"; c.fillRect(X(9.15), Y(2.5), fresta * s, 2.2 * s); c.fillStyle = "#c8a860"; c.beginPath(); c.arc(X(9.05), Y(3.6), 2.5, 0, 7); c.arc(X(9.25), Y(3.6), 2.5, 0, 7); c.fill();
  // mesa com cadeiras e lamparina
  c.fillStyle = "#5a3a22"; [[3.7, 3.5], [6.3, 3.5]].forEach(([cx, cy]) => { c.fillRect(X(cx - .25), Y(cy - .25), .5 * s, .5 * s); c.fillStyle = "#4a2e1a"; c.fillRect(X(cx - .25), Y(cy - .35), .5 * s, .12 * s); c.fillStyle = "#5a3a22"; });
  c.fillStyle = "#7a5a32"; c.fillRect(X(4.1), Y(2.9), 1.8 * s, 1.2 * s); c.fillStyle = "#e8e2d8"; c.fillRect(X(4.3), Y(3.1), 1.4 * s, .8 * s); c.fillStyle = "#c8c0b0"; c.beginPath(); c.arc(X(5.4), Y(3.5), .15 * s, 0, 7); c.fill(); c.fillStyle = "#8a6a3a"; c.fillRect(X(4.5), Y(3.3), .3 * s, .3 * s);
  // cadeira de balanço que balança sozinha
  const bal = Math.sin(tm * 1.6) * (horaNoite() > .5 ? .25 : .05); c.save(); c.translate(X(.9), Y(5.1)); c.rotate(bal); c.fillStyle = "#6a4a2a"; c.fillRect(-.35 * s, -.35 * s, .7 * s, .7 * s); c.fillStyle = "#4a2e1a"; c.fillRect(-.4 * s, -.45 * s, .8 * s, .14 * s); c.strokeStyle = "#4a2e1a"; c.lineWidth = 3; c.beginPath(); c.arc(0, -.9 * s, 1.2 * s, 1.25, 1.9); c.stroke(); c.restore();
  // caminha do gato e vassoura
  c.fillStyle = "#8a3a3a"; c.beginPath(); c.ellipse(X(8.2), Y(6.1), .42 * s, .26 * s, 0, 0, 7); c.fill(); c.fillStyle = "#2a2a30"; c.beginPath(); c.ellipse(X(8.2), Y(6.05), .25 * s, .14 * s, 0, 0, 7); c.fill(); c.fillStyle = "#c8e86a"; c.fillRect(X(8.32), Y(5.98), 2, 2);
  c.strokeStyle = "#a8804a"; c.lineWidth = 3; c.beginPath(); c.moveTo(X(9.7), Y(5.2)); c.lineTo(X(9.4), Y(6.6)); c.stroke(); c.fillStyle = "#d8b860"; c.beginPath(); c.moveTo(X(9.25), Y(6.5)); c.lineTo(X(9.55), Y(6.5)); c.lineTo(X(9.6), Y(6.9)); c.lineTo(X(9.2), Y(6.9)); c.fill();
  // lamparinas (mesa, parede esquerda, parede direita)
  const L = [[X(5), Y(3.2)], [X(.15), Y(4)], [X(9.85), Y(5.6)]];
  R.lamparinas.forEach((v, i) => { const [lx, ly] = L[i]; c.fillStyle = "#3a3a3a"; c.fillRect(lx - 4, ly - 6, 8, 10); c.fillStyle = "#c8a050"; c.fillRect(lx - 5, ly + 3, 10, 2); if (v) { c.fillStyle = "rgba(255,210,120,.95)"; c.beginPath(); c.ellipse(lx + Math.sin(tm * 9 + i) * .6, ly - 9, 3, 5, 0, 0, 7); c.fill(); } else { c.fillStyle = "rgba(200,200,200,.3)"; c.beginPath(); c.arc(lx, ly - 10 - (tm * 8 % 6), 2, 0, 7); c.fill(); } });
  // você
  desenharVoce(X(R.sala.x), Y(R.sala.y), tm, { dir: R.sala.dir || 1, s: s * 1.05 });
  // escuridão conforme as lamparinas
  const lit = R.lamparinas.filter(v => v).length;
  c.fillStyle = `rgba(4,5,10,${[.74, .55, .3, .06][lit]})`; c.fillRect(0, 0, W, H);
  c.globalCompositeOperation = "lighter"; R.lamparinas.forEach((v, i) => { if (!v) return; const [lx, ly] = L[i], g = c.createRadialGradient(lx, ly, 0, lx, ly, s * 2); g.addColorStop(0, "rgba(255,190,110,.3)"); g.addColorStop(1, "rgba(255,190,110,0)"); c.fillStyle = g; c.beginPath(); c.arc(lx, ly, s * 2, 0, 7); c.fill(); });
  const gf = c.createRadialGradient(X(4.4), Y(1.2), 0, X(4.4), Y(1.2), s * 1.6); gf.addColorStop(0, `rgba(255,130,50,${.25 + .08 * Math.sin(tm * 11)})`); gf.addColorStop(1, "rgba(255,130,50,0)"); c.fillStyle = gf; c.beginPath(); c.arc(X(4.4), Y(1.2), s * 1.6, 0, 7); c.fill(); c.globalCompositeOperation = "source-over";
  // a Pisadeira: rasteja de baixo da cama, magra, cabelo branco, unhas compridas
  if (R.pisadeira) desenharPisadeira(R.pisadeira, X, Y, s * 1.6, tm);
  c.fillStyle = "rgba(240,230,210,.65)"; c.font = `600 ${Math.round(Math.max(11, s * .16))}px "JetBrains Mono", monospace`; c.textAlign = "center"; c.fillText(lit === 3 ? "Lá fora você ouve o vento." : lit ? `Uma lamparina apagou. Restam ${lit}.` : "Saia. Agora.", W / 2, Y(SALA.h + .95)); c.textAlign = "start";
}
function desenharPisadeira(p, X, Y, s, tm) {
  const sai = Math.min(1, p.t / 1.8), x = X(p.x), y = Y(p.y), d = p.dir || 1, rast = Math.sin(tm * 9);
  c.save(); c.globalAlpha = sai; c.translate(x, y); c.scale(d, 1);
  c.fillStyle = "rgba(0,0,0,.45)"; c.beginPath(); c.ellipse(0, s * .15, s * .6, s * .2, 0, 0, 7); c.fill();
  c.fillStyle = "#2a2622"; c.beginPath(); c.ellipse(-s * .15, 0, s * .42, s * .2, 0, 0, 7); c.fill(); // corpo e vestido rasgado
  c.fillStyle = "#1c1916"; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(-s * .5 + i * s * .1, s * .05); c.lineTo(-s * .45 + i * s * .1 + Math.sin(tm * 5 + i) * 3, s * .28); c.lineTo(-s * .4 + i * s * .1, s * .05); c.fill(); }
  c.strokeStyle = "#cfc6b4"; c.lineCap = "round"; c.lineWidth = s * .06;
  [[1, rast], [-1, -rast]].forEach(([k, r]) => { c.beginPath(); c.moveTo(s * .1, k * s * .06); c.lineTo(s * (.45 + r * .08), k * s * (.22 + r * .05)); c.lineTo(s * (.75 + r * .1), k * s * .12); c.stroke(); // braços magros
    c.lineWidth = s * .018; c.strokeStyle = "#e8e2d4"; for (let i = -1; i <= 1; i++) { c.beginPath(); c.moveTo(s * (.75 + r * .1), k * s * .12); c.lineTo(s * (.95 + r * .1), k * s * .12 + i * s * .05); c.stroke(); } c.lineWidth = s * .06; c.strokeStyle = "#cfc6b4"; }); // unhas compridas
  c.strokeStyle = "#cfc6b4"; c.lineWidth = s * .05; [[1, -rast], [-1, rast]].forEach(([k, r]) => { c.beginPath(); c.moveTo(-s * .5, k * s * .05); c.lineTo(-s * (.75 + r * .06), k * s * .25); c.lineTo(-s * .95, k * s * .2); c.stroke(); }); // pernas
  // cabeça
  c.fillStyle = "#d8d0c0"; c.beginPath(); c.ellipse(s * .3, 0, s * .17, s * .14, 0, 0, 7); c.fill();
  c.strokeStyle = "#e8e4dc"; c.lineWidth = 1.2; for (let i = 0; i < 18; i++) { const a = -1.2 + i * .14; c.beginPath(); c.moveTo(s * .24, 0); c.quadraticCurveTo(s * (.05 + Math.cos(a) * .1), s * Math.sin(a) * .3, -s * (.2 + (i % 4) * .08), s * Math.sin(a) * .42 + Math.sin(tm * 3 + i) * 2); c.stroke(); } // cabelo branco espalhado
  c.fillStyle = "#0a0806"; c.beginPath(); c.ellipse(s * .38, -s * .05, s * .045, s * .04, 0, 0, 7); c.ellipse(s * .38, s * .05, s * .045, s * .04, 0, 0, 7); c.fill();
  c.fillStyle = "#fffbe8"; c.beginPath(); c.arc(s * .385, -s * .05, s * .018, 0, 7); c.arc(s * .385, s * .05, s * .018, 0, 7); c.fill();
  c.fillStyle = "#120606"; c.beginPath(); c.ellipse(s * .44, 0, s * .03, s * (.05 + .03 * Math.abs(Math.sin(tm * 6))), 0, 0, 7); c.fill(); // boca
  const g = c.createRadialGradient(s * .35, 0, 0, s * .35, 0, s * .6); g.addColorStop(0, "rgba(240,220,170,.2)"); g.addColorStop(1, "rgba(240,220,170,0)"); c.fillStyle = g; c.beginPath(); c.arc(s * .35, 0, s * .6, 0, 7); c.fill();
  c.restore();
}
function desenharSusto(tm) {
  const quem = R.morto ? R.morto.quem : R.rostoPoco ? "poco" : null; if (!quem) return;
  const k = R.morto ? Math.min(1, R.morto.t / .2) : cl(R.susto / 1.1, 0, 1); if (k <= 0) { R.rostoPoco = 0; return; }
  c.fillStyle = `rgba(0,0,0,${.88 * k})`; c.fillRect(0, 0, W, H);
  const tr = R.morto && R.morto.t < 1 ? rnd(-10, 10) : 0, r = Math.min(W, H) * .38 * (.75 + .25 * k), x = W / 2 + tr, y = H / 2 + tr * .6;
  c.save(); c.globalAlpha = k; c.translate(x, y); const ab = .6 + .4 * Math.abs(Math.sin(tm * 18));
  const dentes = (y0, larg, n, alt, cima) => { c.fillStyle = "#e8e0c8"; for (let i = 0; i < n; i++) { const tx = -larg / 2 + (i + .5) * larg / n; c.beginPath(); c.moveTo(tx - larg / n * .45, y0); c.lineTo(tx, y0 + (cima ? 1 : -1) * alt * (.7 + .3 * ((i * 7) % 3) / 2)); c.lineTo(tx + larg / n * .45, y0); c.fill(); } };
  const olhos = (ex, ey, rr, rgb) => { c.fillStyle = "rgba(0,0,0,.75)"; c.beginPath(); c.ellipse(-ex, ey, rr * 1.5, rr * 1.7, 0, 0, 7); c.ellipse(ex, ey, rr * 1.5, rr * 1.7, 0, 0, 7); c.fill(); c.fillStyle = `rgb(${rgb})`; c.beginPath(); c.arc(-ex, ey, rr * .5, 0, 7); c.arc(ex, ey, rr * .5, 0, 7); c.fill(); const g = c.createRadialGradient(0, ey, 0, 0, ey, ex * 2.4); g.addColorStop(0, `rgba(${rgb},.25)`); g.addColorStop(1, `rgba(${rgb},0)`); c.fillStyle = g; c.fillRect(-ex * 3, ey - ex * 2, ex * 6, ex * 4); };
  if (quem === "seco") { // boca gigante que ocupa o rosto
    c.fillStyle = "#3e3020"; c.beginPath(); c.ellipse(0, -r * .1, r * .8, r * .95, 0, 0, 7); c.fill();
    c.strokeStyle = "rgba(200,170,120,.2)"; c.lineWidth = 2; for (let i = 0; i < 12; i++) { c.beginPath(); c.moveTo(-r * .7 + i * r * .12, -r * .9); c.lineTo(-r * .65 + i * r * .12 + Math.sin(i) * 8, -r * .3); c.stroke(); }
    olhos(r * .28, -r * .55, r * .08, "255,150,70");
    c.fillStyle = "#1a0404"; c.beginPath(); c.ellipse(0, r * .25, r * .62, r * .5 * ab, 0, 0, 7); c.fill(); const g = c.createRadialGradient(0, r * .3, 0, 0, r * .3, r * .5); g.addColorStop(0, "rgba(140,10,10,.8)"); g.addColorStop(1, "rgba(40,0,0,0)"); c.fillStyle = g; c.beginPath(); c.ellipse(0, r * .25, r * .6, r * .48 * ab, 0, 0, 7); c.fill();
    dentes(r * .25 - r * .5 * ab, r * 1.15, 13, r * .26, true); dentes(r * .25 + r * .5 * ab, r * 1.1, 12, r * .22, false); dentes(r * .25 - r * .32 * ab, r * .8, 10, r * .16, true); // fileiras de dentes
    c.strokeStyle = "rgba(220,220,200,.5)"; c.lineWidth = 2; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(-r * .3 + i * r * .2, r * .05); c.quadraticCurveTo(-r * .3 + i * r * .2, r * .3, -r * .28 + i * r * .2, r * .55); c.stroke(); } // baba
  } else if (quem === "lobo") {
    c.fillStyle = "#16120f"; c.beginPath(); c.moveTo(-r * .7, -r * .3); c.lineTo(-r * .55, -r * 1.1); c.lineTo(-r * .2, -r * .7); c.lineTo(r * .2, -r * .7); c.lineTo(r * .55, -r * 1.1); c.lineTo(r * .7, -r * .3); c.lineTo(r * .5, r * .8); c.lineTo(-r * .5, r * .8); c.fill();
    c.strokeStyle = "#2a2018"; c.lineWidth = 3; for (let i = 0; i < 16; i++) { c.beginPath(); c.moveTo(-r * .7 + i * r * .09, -r * .4); c.lineTo(-r * .75 + i * r * .1, -r * .2); c.stroke(); }
    olhos(r * .3, -r * .35, r * .07, "255,40,30");
    c.fillStyle = "#3a0a0a"; c.beginPath(); c.ellipse(0, r * .32, r * .45, r * .4 * ab, 0, 0, 7); c.fill(); dentes(r * .32 - r * .4 * ab, r * .85, 9, r * .24, true); dentes(r * .32 + r * .4 * ab, r * .8, 8, r * .2, false);
    c.fillStyle = "#0a0a0a"; c.beginPath(); c.ellipse(0, -r * .05, r * .14, r * .09, 0, 0, 7); c.fill();
  } else if (quem === "pisadeira" || quem === "alma") {
    const pele = quem === "alma" ? "#d8dce4" : "#cfc6b4"; c.fillStyle = pele; c.beginPath(); c.ellipse(0, 0, r * .62, r * .9, 0, 0, 7); c.fill();
    c.fillStyle = "rgba(0,0,0,.25)"; c.beginPath(); c.ellipse(-r * .3, r * .1, r * .15, r * .3, 0, 0, 7); c.ellipse(r * .3, r * .1, r * .15, r * .3, 0, 0, 7); c.fill(); // bochechas fundas
    olhos(r * .26, -r * .2, r * .09, quem === "alma" ? "10,10,20" : "255,250,230");
    c.fillStyle = "#0a0404"; c.beginPath(); c.ellipse(0, r * .45, r * .2, r * .35 * ab, 0, 0, 7); c.fill(); dentes(r * .45 - r * .3 * ab, r * .3, 5, r * .1, true);
    c.strokeStyle = quem === "alma" ? "rgba(230,230,240,.85)" : "#e8e4dc"; c.lineWidth = 2.4; for (let i = 0; i < 26; i++) { const sx = -r * .75 + i * r * .06; c.beginPath(); c.moveTo(sx * .7, -r * .85); c.quadraticCurveTo(sx * 1.2, -r * .2, sx * 1.4 + Math.sin(tm * 4 + i) * 6, r * 1.1); c.stroke(); }
  } else { // rosto no fundo do poço
    c.fillStyle = "#9aa4a8"; c.beginPath(); c.ellipse(0, 0, r * .55, r * .75, 0, 0, 7); c.fill(); olhos(r * .22, -r * .15, r * .08, "10,14,18"); c.fillStyle = "#1a2024"; c.beginPath(); c.ellipse(0, r * .35, r * .14, r * .22 * ab, 0, 0, 7); c.fill();
    c.strokeStyle = "rgba(20,30,30,.8)"; c.lineWidth = 2; for (let i = 0; i < 14; i++) { c.beginPath(); c.moveTo(-r * .5 + i * r * .08, -r * .7); c.lineTo(-r * .55 + i * r * .085, r * .2); c.stroke(); }
  }
  c.restore();
  if (R.morto) { c.fillStyle = `rgba(226,40,30,${.3 * Math.max(0, 1 - R.morto.t)})`; c.fillRect(0, 0, W, H); }
}
function desenharFx() {
  R.fx.forEach(f => { const a = 1 - f.t / 1.8, x = f.x == null ? W / 2 : PX(f.x), y = (f.y == null ? H * .3 : PY(f.y) - TS * 1.3) - f.t * 30; c.globalAlpha = Math.max(0, a); c.fillStyle = f.cor; c.font = `800 ${Math.round(Math.max(14, TS * .34))}px "Big Shoulders Display", sans-serif`; c.textAlign = "center"; c.strokeStyle = "rgba(0,0,0,.7)"; c.lineWidth = 3; c.strokeText(f.txt, x, y); c.fillText(f.txt, x, y); c.textAlign = "start"; c.globalAlpha = 1; });
  el.rcDica.textContent = R.dentro ? "" : R.seco.fase === "anda" || R.seco.fase === "aviso" ? "A mata estalou. Corra para dentro de casa!" : R.cachorro && R.cachorro.fase === "lobo" ? "Corra para casa!" : R.vela && !R.velaCom ? "Siga o som do sino e ache a vela" : R.velaCom ? "Leve a vela até a cruz do cemitério" : "";
}
function desenharVitoria(tm) { if (!R.venceu) return; const k = R.venceu.t; if (k < 1) return; c.fillStyle = `rgba(0,0,0,${cl((k - 3) / 1.4, 0, 1)})`; c.fillRect(0, 0, W, H); }
function loop(ts) {
  if (!rodando) return;
  const dt = Math.min(.05, (ts - ultimo) / 1000 || 0); ultimo = ts;
  atualizar(dt);
  const tm = ts / 1000;
  c.setTransform(DPRr, 0, 0, DPRr, 0, 0);
  if (R.dentro) desenharDentro(tm); else { if (R.venceu && R.venceu.t > 1) { CAMINHONETE.x += .0; } desenharMundo(tm); desenharLuz(tm); }
  if (R.venceu && R.venceu.t > 1 && !R.dentro) { const x = PX(CAMINHONETE.x), y = PY(CAMINHONETE.y + .9 + Math.max(0, R.venceu.t - 1.5) * 2.2); c.globalCompositeOperation = "lighter"; c.fillStyle = "rgba(255,240,200,.18)"; c.beginPath(); c.moveTo(x - TS * .8, y); c.lineTo(x - TS * 2, y + TS * 6); c.lineTo(x + TS * 2, y + TS * 6); c.lineTo(x + TS * .8, y); c.fill(); c.globalCompositeOperation = "source-over"; }
  desenharFx(); desenharSusto(tm); desenharVitoria(tm);
  // vinheta
  const vg = c.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .35, W / 2, H / 2, Math.max(W, H) * .75); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,.55)"); c.fillStyle = vg; c.fillRect(0, 0, W, H);
  requestAnimationFrame(loop);
}

/* ---------- entrar e sair ---------- */
window.entrarRoca = function () {
  montarUI(); initAudio();
  try { if (window.Android && Android.orientacao) Android.orientacao("paisagem"); } catch (e) {}
  if (typeof calar === "function") calar(); if (typeof pararTudo === "function") pararTudo(); setAmb({});
  document.getElementById("roca").hidden = false; window.rocaAtiva = true;
  setTimeout(medir, 50); setTimeout(medir, 400); medir();
  novoJogo(); hud(); rodando = true; ultimo = performance.now(); requestAnimationFrame(loop);
};
window.sairRoca = function () {
  rodando = false; window.rocaAtiva = false; R = null; painelAberto = false;
  const d = document.getElementById("roca"); if (d) d.hidden = true;
  try { if (window.Android && Android.orientacao) Android.orientacao("retrato"); } catch (e) {}
  if (typeof abrirHub === "function") abrirHub();
};
window.rocaVoltar = () => { if (!window.rocaAtiva) return false; if (painelAberto) { if (R && (R.morto || R.venceu)) return true; fecharPainel(); } else pausar(); return true; };
window.rocaEstado = () => R; // usado nos testes
})();

