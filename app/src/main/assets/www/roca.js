/* ============================================================
   ROÇA ASSOMBRADA
   Um sítio aconchegante para plantar, regar, pescar e vender...
   até a mata começar a estalar. Mecânicas de sobrevivência com
   regras: cada assombração tem um som e um jeito de escapar.
   Objetivo: consertar a caminhonete e ir embora.
   ============================================================ */
(() => {
const MW = 64, MH = 38;                       // mapa em "quadradinhos"
const CERCA = { x0: 6, y0: 5, x1: 58, y1: 33 };
// lado leste (depois do riacho): milharal, capela, chiqueiro e colmeias
const RIACHO = { x0: 47.1, x1: 48.7 }, PONTES = [13.4, 23.6];
const MILHARAL = { x0: 50, y0: 5.6, x1: 57, y1: 11.6 };
const CAPELA = { x: 51.2, y: 16.6, w: 4.2, h: 3.6, porta: { x: 53.3, y: 20.6 } };
const CHIQUEIRO = { x0: 50.2, y0: 25, x1: 55.4, y1: 29.4 };
const COLMEIAS = [[51.4, 31.6], [53, 31.8], [54.6, 31.6]];
const BALANCO = { x: 9.6, y: 28 }, CARRIOLA = { x: 21.8, y: 14.4 }, LENHA = { x: 17.6, y: 9.4 };
const FENOS = [[45, 8.4], [45.6, 10.4], [44, 9.6]];
const ESPANTALHO = { x: 20.2, y: 18.6 };
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
const EXTRAS = { ovo: ["Ovo", 3], laranja: ["Laranja", 4], mel: ["Mel", 9] };
const PEIXES = [["Lambari", 6, .55], ["Tilápia", 12, .33], ["Traíra", 22, .12]];
const DIA = 160, NOITE = 85, CICLO = DIA + NOITE;
const PLACAS = [
  { x: 8.2, y: 13.4, txt: "Quando a mata estalar, entre em casa. Ele corre de quatro. Não olhe para trás." },
  { x: 33.6, y: 13.6, txt: "Não chegue perto do cachorro preto." },
  { x: 38.4, y: 27.6, txt: "Toda noite uma alma pede uma vela. Traga a vela até a cruz do cemitério antes do sol nascer." },
  { x: 16.6, y: 25.4, txt: "Lamparina apagada, não durma. Ela sobe pelo pé da cama." },
  { x: 30.8, y: 10.6, txt: "As galinhas botam toda manhã. Laranja madura no pomar dá dinheiro." },
  { x: 46.2, y: 14.4, txt: "Ouviu juntas estalando lá no alto? É a Pernuda. Apague a lanterna e NÃO SE MEXA. Ela só vê o que brilha e o que anda. No milharal ela não te enxerga." },
  { x: 22, y: 19.2, txt: "O espantalho só anda no escuro. Ilumine ele com a lanterna e ele congela." },
  { x: 46.2, y: 22.8, txt: "Viu o chão brilhar em linha reta? Saia da linha. A mula-sem-cabeça não faz curva. Os porcos gritam antes dela passar." },
  { x: 24, y: 13, txt: "Redemoinho assobiando de dia é o Saci: seca a plantação e rouba moedas. Com uma peneira da bancada dá para pegar ele." },
  { x: 50.6, y: 21.6, txt: "O sino da capela espanta o Corpo-Seco e manda o espantalho de volta. Só funciona uma vez por noite." }];
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
  juntas(x, y, forca = .8) { const [v, p] = somEm(x, y), k = v * .75 + .25; for (let i = 0; i < 6; i++) tocarRuido(.03, { f: 2600 + Math.random() * 2600, q: 9, vol: (.28 + Math.random() * .2) * k * forca, pan: p, quando: i * .11 + Math.random() * .07, wet: .6 }); tocarTom(95, .9, { tipo: "sawtooth", vol: .04 * k * forca, ate: 70, lp: 380, pan: p, quando: .2, atk: .3 }); },
  gritoAranha(x, y) { const [v, p] = somEm(x, y), k = v * .5 + .5; tocarTom(1500, 1.8, { tipo: "sawtooth", vol: .14 * k, ate: 260, lp: 3600, pan: p, wet: .7 }); tocarTom(1180, 1.6, { tipo: "square", vol: .05 * k, ate: 330, lp: 2400, pan: p, quando: .05 }); tocarRuido(1.6, { f: 2400, ate: 500, q: 1.5, vol: .3 * k, pan: p, wet: .5 }); },
  galope(x, y, n = 1) { const [v, p] = somEm(x, y), k = v * .7 + .3; for (let i = 0; i < n * 3; i++) tocarRuido(.07, { filtro: "lowpass", f: 240, vol: .35 * k * (n > 1 ? .4 + i / (n * 3) * .6 : 1), pan: p, quando: Math.floor(i / 3) * .42 + (i % 3) * .1, wet: .3 }); },
  relincho(x, y) { const [v, p] = somEm(x, y), k = v * .6 + .4; tocarTom(980, .9, { tipo: "sawtooth", vol: .08 * k, ate: 620, lp: 2600, pan: p, wet: .6 }); tocarTom(1240, .5, { tipo: "sawtooth", vol: .05 * k, ate: 760, lp: 2600, pan: p, quando: .15, wet: .6 }); tocarRuido(1.4, { filtro: "highpass", f: 1800, vol: .12 * k, pan: p, wet: .4 }); },
  porcos() { const [v, p] = somEm(52.8, 27.2), k = v * .7 + .3; for (let i = 0; i < 5; i++) tocarTom(rnd(500, 700), .3, { tipo: "square", vol: .05 * k, ate: rnd(1000, 1400), lp: 1600, pan: p, quando: i * .28 }); },
  assobio(x, y) { const [v, p] = somEm(x, y), k = v * .8 + .2; tocarTom(1700, .5, { vol: .06 * k, ate: 2700, pan: p, wet: .5 }); tocarTom(2600, .6, { vol: .05 * k, ate: 1500, pan: p, quando: .55, wet: .5 }); },
  risada(x, y) { const [v, p] = somEm(x, y), k = v * .7 + .3; [760, 700, 660, 600, 560].forEach((f, i) => tocarTom(f, .1, { tipo: "triangle", vol: .07 * k, pan: p, quando: i * .13, lp: 2200 })); },
  palha(x, y) { const [v, p] = somEm(x, y); tocarRuido(.18, { filtro: "highpass", f: 2600, vol: .14 * (v * .8 + .2), pan: p, wet: .3 }); },
  sinoCapela(x, y) { const [v, p] = somEm(x, y), k = v * .5 + .5; [0, 1.2, 2.4].forEach(q => [330, 660, 990, 1320].forEach((f, i) => tocarTom(f, 3.2, { vol: (.08 / (i + 1)) * k, pan: p, wet: .9, quando: q }))); },
  abelhas(x, y) { const [v, p] = somEm(x, y); tocarTom(220, .9, { tipo: "sawtooth", vol: .02 * v, ate: 240, lp: 900, pan: p, atk: .2 }); },
  oinc(x, y) { const [v, p] = somEm(x, y); tocarTom(380, .18, { tipo: "square", vol: .05 * v + .01, ate: 240, lp: 1200, pan: p }); tocarTom(330, .16, { tipo: "square", vol: .05 * v + .01, ate: 200, lp: 1200, pan: p, quando: .2 }); },
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
  bloq(19, 9, 1, 1); bloq(LAGO.x0, LAGO.y0, LAGO.x1 - LAGO.x0, LAGO.y1 - LAGO.y0); bloq(24, 30.4, 3, 1.4);
  bloq(GALINHEIRO.x, GALINHEIRO.y, GALINHEIRO.w, GALINHEIRO.h - .2); bloq(43, 12.6, 2, 1);
  bloq(7, 9, 1, 1); bloq(23, 17, 1, 1); bloq(41.6, 26.8, 1, 1);
  // riacho (só passa pelas pontes)
  for (let y = CERCA.y0; y < CERCA.y1; y++) for (let x = Math.floor(RIACHO.x0); x < RIACHO.x1; x++) if (!PONTES.some(p => y >= Math.floor(p - .7) && y <= Math.floor(p + .7))) solido[y][x] = true;
  // cercadinho das galinhas (com portãozinho embaixo)
  for (let y = 6; y < 12; y++) { solido[y][25] = true; solido[y][32] = true; } for (let x = 25; x <= 32; x++) if (x !== 28 && x !== 29) solido[11][x] = true;
  // caixas de colisão do tamanho do desenho (ninguém entra dentro da casa, do caixote, do poço...)
  const caixas = [[CASA.x - .25, CERCA.y0, CASA.x + CASA.w + .25, CASA.y + CASA.h + .4], [CAIXOTE.x - .38, CAIXOTE.y - .45, CAIXOTE.x + .38, CAIXOTE.y + .1], [POCO.x - .5, POCO.y - .35, POCO.x + .5, POCO.y + .35],
    [CASINHA.x - .38, CASINHA.y - .25, CASINHA.x + .38, CASINHA.y + .75], [GALINHEIRO.x, CERCADO.y0, GALINHEIRO.x + GALINHEIRO.w, GALINHEIRO.y + GALINHEIRO.h + .05], [CELEIRO.x - .2, CERCA.y0, CELEIRO.x + CELEIRO.w + .2, CELEIRO.y + CELEIRO.h + .05],
    [TRATOR.x - .8, TRATOR.y - .5, TRATOR.x + .6, TRATOR.y + .1], [CAMINHONETE.x - 1.3, CAMINHONETE.y - .3, CAMINHONETE.x + 1.3, CAMINHONETE.y + 1], [CAPELA.x - .2, CAPELA.y - 1.5, CAPELA.x + CAPELA.w + .2, CAPELA.y + CAPELA.h + .05],
    [CHIQUEIRO.x0, CHIQUEIRO.y0, CHIQUEIRO.x1, CHIQUEIRO.y1], [BALANCO.x - .75, BALANCO.y - .2, BALANCO.x + .75, BALANCO.y + .05], [LENHA.x - .55, LENHA.y - .35, LENHA.x + .55, LENHA.y + .05], [CARRIOLA.x - .5, CARRIOLA.y - .25, CARRIOLA.x + .5, CARRIOLA.y + .05]];
  COLMEIAS.forEach(([x, y]) => caixas.push([x - .32, y - .4, x + .32, y + .05])); FENOS.forEach(([x, y]) => caixas.push([x - .6, y - .4, x + .6, y + .05]));
  POMAR.forEach(([x, y]) => bloq(x - .2, y - .2, .4, .4));
  const arvores = [];
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { const fora = x < CERCA.x0 || x >= CERCA.x1 || y < CERCA.y0 || y >= CERCA.y1; if (fora && !(x >= 22 && x <= 28 && y >= CERCA.y1) && srnd() < .55) arvores.push({ x: x + .5 + (srnd() - .5) * .6, y: y + .5 + (srnd() - .5) * .6, r: .7 + srnd() * .55, c: Math.floor(srnd() * 5) }); }
  [[8, 7], [44.4, 21], [7.6, 31], [21.8, 31.4], [33.2, 21.6], [7.4, 25]].forEach(([x, y]) => { arvores.push({ x, y, r: .9, c: Math.floor(srnd() * 5) }); solido[Math.floor(y)][Math.floor(x)] = true; });
  const pedras = [], flores = [], cogumelos = [];
  for (let i = 0; i < 70; i++) { const x = rnd(CERCA.x0 + .5, CERCA.x1 - .5), y = rnd(CERCA.y0 + .5, CERCA.y1 - .5); if (solido[Math.floor(y)][Math.floor(x)]) continue; (i % 3 === 0 ? pedras : i % 3 === 1 ? flores : cogumelos).push({ x, y, k: Math.random() }); }
  R = {
    t: 18, dia: 1, vidas: 2, cor: 0, semente: 0, caido: null, outro: null, online: null, eu: { x: 13, y: 12.8, dir: 1, anda: 0, fase: 0 }, dentro: false, sala: { x: 5, y: 5.6 },
    solido, caixas, arvores, pedras, flores, cogumelos, moedas: 0, agua: 5, aguaMax: 5, oleo: 100, lanterna: false, folego: 100, correndo: false, vel: 3.1,
    diario: !!ls("roca_diario"), lanternaBoa: false, sementes: ["milho", "mandioca"], semente: 0, canteiros: CANTEIROS.map((k, i) => ({ ...k, aberto: i === 0, covas: Array.from({ length: k.w * k.h }, () => null) })),
    inv: { graveto: 0, folha: 0 }, colheita: {}, peixes: {}, extra: {}, vara: false, pecas: 0, vela: null, velaCom: false, velaEntregue: false, velaHoje: false,
    gato: { x: 15, y: 12.6, alvo: null, prox: 25 }, cachorro: null, seco: { prox: rnd(45, 150), fase: "longe", t: 0, x: 0, y: 0 },
    galinhas: Array.from({ length: 5 }, (_, i) => ({ x: 26.5 + i * 1.1, y: 10.4 + (i % 2) * .5, alvo: null, t: rnd(0, 3), dir: 1 })), ovos: 2,
    frutas: POMAR.map(() => ({ n: 1, t: rnd(0, 20) })), vulto: null, vultoT: 40,
    lamparinas: [1, 1, 1], lampT: 0, pisadeira: null, pesca: null, fx: [], msg: null, tutorial: 0, morto: null, venceu: null, tempoTotal: 0, ouro: +(ls("roca_ouro") || 0),
    chapeu: ls("roca_chapeu") || "palha", susto: 0, perto: 0, tremor: 0, poeira: [],
    aranha: { fase: "longe", prox: 0, x: 0, y: 0, t: 0, alerta: 0 }, mula: { fase: "longe", prox: 0, t: 0 }, saci: { fase: "longe", prox: rnd(20, 120), t: 0, x: 0, y: 0 },
    esp: { x: ESPANTALHO.x, y: ESPANTALHO.y, fase: "poste", t: 0 }, peneira: false, sinoUsado: false, queimado: [], mel: COLMEIAS.map(() => 1),
    porcos: Array.from({ length: 3 }, (_, i) => ({ x: 51.4 + i * 1.5, y: 27 + (i % 2) * .8, alvo: null, t: rnd(0, 3), dir: 1 })), fxR: [],
  };
  gerarChao();
}
function tutorial() {
  falar(["Miau. Yasmin? Sou eu, a Sombrinha. Respira. Vamos fazer do jeito que a sua vó fazia.", "Primeiro: escolha a semente no botão da direita, plante no canteiro e regue com a água do poço.", "Colha e venda no caixote do lado da porta. Ovo, laranja, peixe e o mel das colmeias lá depois do riacho também valem moeda.", "Com o dinheiro, compre as peças na bancada lá dentro e conserte a caminhonete no portão. Aí a gente vai embora daqui. Juntas.", "E as regras... estão nas placas. Leia todas. Se ouvir a mata estalar, corre pra dentro de casa. Ele corre de quatro."], () => { R.tutorial = 1; }, "Sombrinha");
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
  trilha([[39, 13.4], [50.4, 13.4], [50.4, 22.2], [53.3, 22.2], [53.3, 21]], .8); trilha([[42, 25.6], [44, 23.6], [50.4, 23.6], [50.4, 30.6], [55, 30.6]], .7); trilha([[50.4, 13.4], [53.4, 12.4]], .6);
  // milharal: terra arada em fileiras
  g.fillStyle = "#6a5232"; g.fillRect(MILHARAL.x0 * P, MILHARAL.y0 * P, (MILHARAL.x1 - MILHARAL.x0) * P, (MILHARAL.y1 - MILHARAL.y0) * P);
  for (let y = MILHARAL.y0; y < MILHARAL.y1; y += .5) { g.fillStyle = "rgba(40,28,14,.45)"; g.fillRect(MILHARAL.x0 * P, y * P, (MILHARAL.x1 - MILHARAL.x0) * P, 5); }
  // chiqueiro: lama
  g.fillStyle = "#4a3620"; g.fillRect(CHIQUEIRO.x0 * P, CHIQUEIRO.y0 * P, (CHIQUEIRO.x1 - CHIQUEIRO.x0) * P, (CHIQUEIRO.y1 - CHIQUEIRO.y0) * P);
  for (let i = 0; i < 26; i++) { g.fillStyle = srnd() < .5 ? "rgba(30,20,10,.5)" : "rgba(120,90,60,.3)"; g.beginPath(); g.ellipse((CHIQUEIRO.x0 + srnd() * 5) * P, (CHIQUEIRO.y0 + srnd() * 4.2) * P, 8 + srnd() * 16, 4 + srnd() * 7, 0, 0, 7); g.fill(); }
  // pátio de pedra da capela
  g.fillStyle = "#6a6458"; g.fillRect((CAPELA.x - .4) * P, (CAPELA.y + CAPELA.h) * P, (CAPELA.w + .8) * P, 1.2 * P); g.strokeStyle = "rgba(0,0,0,.25)"; for (let i = 0; i < 12; i++) { g.strokeRect((CAPELA.x - .4 + (i % 6) * .85) * P, (CAPELA.y + CAPELA.h + Math.floor(i / 6) * .6) * P, .85 * P, .6 * P); }
  // riacho com pedras e as pontes de tábua
  g.fillStyle = "#3a4a26"; g.fillRect((RIACHO.x0 - .25) * P, CERCA.y0 * P, (RIACHO.x1 - RIACHO.x0 + .5) * P, (CERCA.y1 - CERCA.y0) * P);
  g.fillStyle = "#1e4250"; g.beginPath(); g.moveTo(RIACHO.x0 * P, (CERCA.y0 - 1) * P); for (let y = CERCA.y0 - 1; y <= CERCA.y1 + 5; y += .5) g.lineTo((RIACHO.x0 + Math.sin(y * .7) * .12) * P, y * P); for (let y = CERCA.y1 + 5; y >= CERCA.y0 - 1; y -= .5) g.lineTo((RIACHO.x1 + Math.sin(y * .7 + 1) * .12) * P, y * P); g.fill();
  for (let i = 0; i < 70; i++) { g.fillStyle = srnd() < .5 ? "#7a7468" : "#5a564e"; g.beginPath(); g.ellipse((srnd() < .5 ? RIACHO.x0 : RIACHO.x1) * P + (srnd() - .5) * 10, (CERCA.y0 + srnd() * (CERCA.y1 - CERCA.y0)) * P, 3 + srnd() * 5, 2 + srnd() * 3, 0, 0, 7); g.fill(); }
  PONTES.forEach(py => { g.fillStyle = "#6a4a2a"; g.fillRect((RIACHO.x0 - .5) * P, (py - .8) * P, (RIACHO.x1 - RIACHO.x0 + 1) * P, 1.6 * P); g.strokeStyle = "rgba(0,0,0,.35)"; g.lineWidth = 2; for (let k = 0; k < 9; k++) { g.beginPath(); g.moveTo((RIACHO.x0 - .5 + k * .29) * P, (py - .8) * P); g.lineTo((RIACHO.x0 - .5 + k * .29) * P, (py + .8) * P); g.stroke(); } g.fillStyle = "#4a3018"; g.fillRect((RIACHO.x0 - .5) * P, (py - .85) * P, (RIACHO.x1 - RIACHO.x0 + 1) * P, 4); g.fillRect((RIACHO.x0 - .5) * P, (py + .75) * P, (RIACHO.x1 - RIACHO.x0 + 1) * P, 4); });
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
      <div class="rc-vidas" id="rcVidas"></div><div class="rc-itens" id="rcItens"></div><button class="rc-menu rc-moch rc-chatbt" id="rcChat" type="button" aria-label="Chat" hidden><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 8a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v9a4 4 0 0 1-4 4h-7l-6 5v-5h-3a4 4 0 0 1-4-4z" fill="rgba(255,255,255,.12)" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="11" cy="12.5" r="1.6" fill="currentColor"/><circle cx="16" cy="12.5" r="1.6" fill="currentColor"/><circle cx="21" cy="12.5" r="1.6" fill="currentColor"/></svg><i id="rcChatN" hidden></i></button><button class="rc-menu rc-moch" id="rcMoch" type="button" aria-label="Mochila"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M12 8V6a4 4 0 0 1 8 0v2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="7" y="8" width="18" height="20" rx="6" fill="#8a5a32" stroke="currentColor" stroke-width="1.6"/><rect x="10.5" y="17" width="11" height="8" rx="2.5" fill="#6a4224" stroke="currentColor" stroke-width="1.2"/><path d="M10.5 19.5h11" stroke="currentColor" stroke-width="1"/><circle cx="16" cy="21.5" r="1.1" fill="#f2c94a"/></svg></button><button class="rc-menu" id="rcMenu" type="button">Pausa</button></div>
    <div class="rc-obj" id="rcObj"></div><div class="rc-chatlog" id="rcChatLog"></div>
    <div class="rc-chatbar" id="rcChatBar" hidden><div class="rc-rapidas">${["Socorro!", "Vem aqui!", "Corre!", "Tô indo!", "Apaga a lanterna!", "Vou vender", "Cuidado!", "Valeu!"].map(t => `<button type="button" data-r="${t}">${t}</button>`).join("")}</div>
      <form id="rcChatF"><input id="rcChatIn" maxlength="80" autocomplete="off" placeholder="Escreva para o seu amigo..."><button type="submit">Enviar</button><button type="button" id="rcChatX" aria-label="Fechar">✕</button></form></div>
    <div class="rc-joy" id="rcJoy"><i id="rcJoyK"></i></div>
    <div class="rc-bts"><button id="rcSem" type="button" class="rc-bt sem"></button><button id="rcLuz" type="button" class="rc-bt luz" aria-label="Lanterna"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M11 9a5 5 0 0 1 10 0" fill="none" stroke="currentColor" stroke-width="2"/><rect x="10" y="9" width="12" height="3" rx="1" fill="currentColor"/><path d="M11 12h10l1 11H10z" fill="rgba(255,255,255,.12)" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path class="chama" d="M16 14c2 2.5 2.6 4 2.6 5.3a2.6 2.6 0 0 1-5.2 0c0-1.3.6-2.8 2.6-5.3z" fill="#f2c94a"/><rect x="9" y="23" width="14" height="3" rx="1" fill="currentColor"/></svg></button><button id="rcCorre" type="button" class="rc-bt corre" aria-label="Correr"><svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="19" cy="6.5" r="3" fill="currentColor"/><path d="M16.5 5.5c-2 1-3 3-3.4 5.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><ellipse cx="19" cy="3.6" rx="4.6" ry="1.2" fill="currentColor"/><path d="M18 10l-3 7h6z" fill="currentColor"/><path d="M17 11l-5 2.5M19 11l4.5 3.5M16 17l-4.5 4 -3 .5M19 17l2.5 5 4 1.2" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 12h5M2 16h6M4 20h4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity=".6"/></svg></button><button id="rcAcao" type="button" class="rc-bt acao">Ação</button></div>
    <div class="rc-fala" id="rcFala" hidden></div><div class="rc-dica" id="rcDica"></div>
    <div class="rc-painel" id="rcPainel" hidden></div>
    <div class="rc-gire" id="rcGire" hidden><b>Vire o celular</b><span>Este modo é jogado com o celular deitado.</span></div>`;
  document.body.appendChild(d);
  ["rcMoedas", "rcDia", "rcAgua", "rcOleo", "rcFolego", "rcItens", "rcMenu", "rcJoy", "rcJoyK", "rcSem", "rcLuz", "rcCorre", "rcAcao", "rcFala", "rcDica", "rcPainel", "rcGire", "rcChat", "rcChatN", "rcChatLog", "rcChatBar", "rcChatIn", "rcChatF", "rcChatX", "rcObj", "rcVidas", "rcMoch"].forEach(i => el[i] = document.getElementById(i));
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
  .rc-bt svg{width:34px;height:34px;display:block;margin:auto}.rc-bt.luz.on .chama{filter:drop-shadow(0 0 4px #f2c94a)}.rc-bt.luz:not(.on) .chama{fill:rgba(255,255,255,.25)}
  .rc-moch{margin-left:auto;padding:4px 8px}.rc-moch svg{width:28px;height:28px;display:block}.rc-moch + .rc-menu{margin-left:0}
  .rc-obj{position:absolute;left:max(12px,env(safe-area-inset-left));top:52px;max-width:38vw;color:#f2c94a;font:600 10.5px/1.3 var(--f-mono,monospace);text-shadow:0 1px 4px #000;pointer-events:none;letter-spacing:.02em}
  .rc-vidas{display:flex;flex-direction:column;gap:2px;color:#f4efe4;font-size:10px;text-shadow:0 1px 4px #000}.rc-vidas b{color:#e2483d;font-size:13px;letter-spacing:1px}
  .rc-dia-pg{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px}.rc-bicho{display:flex;gap:10px;background:#e8dcc0;color:#2a1e12;border-radius:6px;padding:8px;box-shadow:0 2px 0 rgba(0,0,0,.3)}
  .rc-bicho canvas{width:84px;height:100px;flex:none;background:#111;border:4px solid #f4efe4;border-bottom-width:12px;transform:rotate(-2deg);filter:sepia(.55) contrast(1.15) grayscale(.2)}
  .rc-bicho b{display:block;font:800 17px "Big Shoulders Display",sans-serif;color:#5a1a10}.rc-bicho span{font:13px/1.35 var(--f-body,serif)}.rc-bicho i{display:block;font:italic 12px/1.3 var(--f-body,serif);color:#6a5a40;margin-top:4px}
  .rc-caixa.rc-diario{background:#d8ccae;color:#2a1e12}.rc-caixa.rc-diario h2{color:#3a2410}.rc-caixa.rc-diario p,.rc-caixa.rc-diario li{color:#3a2a18;font:15px/1.45 var(--f-body,serif)}.rc-caixa.rc-diario .rc-op{color:#2a1e12;background:rgba(0,0,0,.06);border-color:rgba(0,0,0,.15)}.rc-caixa.rc-diario .rc-op.dest{background:rgba(120,40,20,.18);border-color:rgba(120,40,20,.5)}
  .rc-caixa.rc-diario table{width:100%;border-collapse:collapse;font:14px var(--f-body,serif)}.rc-caixa.rc-diario td{padding:4px 6px;border-bottom:1px dashed rgba(60,40,20,.3)}.rc-caixa.rc-diario td:last-child{text-align:right;font-weight:700;color:#7a3a10}.rc-caixa.rc-diario h3{margin:10px 0 4px;font:800 16px "Big Shoulders Display",sans-serif;color:#5a1a10;letter-spacing:.04em}
  .rc-caixa.rc-diario ul{margin:0;padding-left:18px}.rc-caixa.rc-diario li{margin-bottom:5px}
  .rc-moch-l{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:6px}.rc-moch-l div{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:7px 10px;font:13px var(--f-body,serif)}.rc-moch-l b{color:#f2c94a;font:700 15px var(--f-mono,monospace);float:right}
  .rc-chatbt{position:relative}.rc-chatbt + .rc-moch{margin-left:0}.rc-chatbt i{position:absolute;top:2px;right:3px;width:9px;height:9px;border-radius:50%;background:#e2483d}
  .rc-chatlog{position:absolute;left:max(12px,env(safe-area-inset-left));top:84px;max-width:36vw;display:flex;flex-direction:column;gap:3px;pointer-events:none}
  .rc-chatlog div{background:rgba(6,8,12,.62);color:#f4efe4;border-radius:9px;padding:3px 8px;font:13px/1.3 var(--f-body,serif);transition:opacity .6s;word-break:break-word}.rc-chatlog b{font:700 10.5px var(--f-mono,monospace);color:#9bd86b;margin-right:4px}.rc-chatlog div.eu b{color:#f2c94a}
  .rc-chatbar{position:absolute;left:50%;transform:translateX(-50%);top:46px;width:min(560px,60vw);background:rgba(10,12,16,.9);border:1px solid rgba(255,255,255,.15);border-radius:14px;padding:8px;z-index:3}
  .rc-rapidas{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:6px}.rc-rapidas button{background:rgba(242,163,58,.16);border:1px solid rgba(242,163,58,.45);color:#f4efe4;border-radius:10px;padding:4px 9px;font:600 12px var(--f-mono,monospace)}
  .rc-chatbar form{display:flex;gap:6px}.rc-chatbar input{flex:1;min-width:0;background:#05070a;border:1px solid rgba(255,255,255,.2);border-radius:10px;color:#f4efe4;padding:7px 10px;font:15px var(--f-body,serif)}
  .rc-chatbar form button{background:rgba(242,163,58,.3);border:1px solid rgba(242,163,58,.7);color:#f4efe4;border-radius:10px;padding:0 12px;font:700 12px var(--f-mono,monospace)}.rc-chatbar #rcChatX{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.2)}
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
  .rc-hist{position:absolute;inset:0;z-index:20;background:#000}.rc-hist canvas{position:absolute;inset:0;width:100%;height:100%}
  .rc-hist-txt{position:absolute;left:50%;bottom:16px;transform:translateX(-50%);width:min(760px,84vw);background:rgba(6,7,10,.8);border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:12px 18px;color:#f4efe4;font:17px/1.45 var(--f-body,serif);min-height:4.4em}
  .rc-hist-txt p{margin:0}.rc-hist-txt small{display:block;margin-top:6px;color:#e07a2a;font:600 10px var(--f-mono,monospace);letter-spacing:.12em;text-transform:uppercase}
  .rc-pular{position:absolute;top:12px;right:max(14px,env(safe-area-inset-right));background:rgba(10,12,16,.6);border:1px solid rgba(255,255,255,.2);color:#f4efe4;border-radius:12px;padding:8px 14px;font:600 12px var(--f-mono,monospace)}
  .rc-codigo{font:900 54px "Big Shoulders Display",sans-serif;letter-spacing:.18em;color:#f2c94a;text-align:center;background:rgba(242,201,74,.08);border:1px dashed rgba(242,201,74,.5);border-radius:14px;padding:6px 0;margin:6px 0 10px;user-select:text;-webkit-user-select:text}
  .rc-input{width:100%;box-sizing:border-box;background:#0a0c10;border:1px solid rgba(255,255,255,.2);border-radius:12px;color:#f2c94a;font:800 34px "Big Shoulders Display",sans-serif;letter-spacing:.2em;text-align:center;padding:8px;text-transform:uppercase}
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
  bt(el.rcAcao, acao); bt(el.rcLuz, () => alternarLanterna()); bt(el.rcCorre, () => correr()); bt(el.rcChat, () => abrirChat(!el.rcChatBar.hidden ? false : true));
  el.rcChatBar.addEventListener("pointerdown", e => e.stopPropagation()); el.rcChatIn.addEventListener("keydown", e => e.stopPropagation()); el.rcChatIn.addEventListener("keyup", e => e.stopPropagation());
  el.rcChatF.addEventListener("submit", e => { e.preventDefault(); mandarChat(el.rcChatIn.value); el.rcChatIn.value = ""; abrirChat(false); });
  el.rcChatX.addEventListener("click", () => abrirChat(false));
  el.rcChatBar.querySelectorAll("[data-r]").forEach(b => b.addEventListener("click", () => { mandarChat(b.dataset.r); abrirChat(false); }));
  bt(el.rcMoch, () => { if (R && !R.menu && !painelAberto) abrirMochila(); }); bt(el.rcSem, () => { R.semente = (R.semente + 1) % R.sementes.length; tocarTom(900, .05, { vol: .05 }); hud(); });
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
function falar(lista, depois, quem = "Sombrinha") { R.msg = { lista: [...lista], depois, quem }; mostrarFala(); }
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
  if (R.caido) return null;
  if (R.pesca) return R.pesca.fisgou ? { t: "Puxar!", fn: puxarPeixe, loc: 1 } : { t: "...", fn: () => {}, loc: 1 };
  if (R.dentro) {
    const s = R.sala;
    if (s.y > 5.9 && Math.abs(s.x - SALA.porta.x) < 1.1) return { t: "Sair", fn: sair, loc: 1 };
    if (s.x > 7 && s.y < 2.4) return { t: "Bancada", fn: abrirBancada, loc: 1 };
    if (Math.hypot(s.x - 5, s.y - 3.5) < 1.6 && !R.lamparinas.every(v => v)) return { t: "Acender", fn: () => { if (R.oleo >= 10) { R.oleo -= 10; R.lamparinas = R.lamparinas.map(() => 1); R.lampT = 0; S.colher(); efeito("Lamparinas acesas", "#f2c94a"); } else efeito("Sem óleo para acender", "#e8e2d4"); } };
    if (Math.hypot(s.x - 4.4, s.y - 1.6) < 1.2) return { t: "Fogão", fn: () => efeito("O fogo estala. Por um instante, parece a voz da vó.", "#e8e2d4"), loc: 1 };
    if (Math.hypot(s.x - 5, s.y - 4.5) < 1.3) return { t: "Diário da vó", fn: () => abrirDiario(), loc: 1 };
    const lc2 = lembrancaPerto(s, LEMB_CASA); if (lc2) return { t: "Olhar", fn: () => lembrar(lc2), loc: 1 };
    return null;
  }
  const p = R.eu;
  if (R.outro && R.outro.caido && !R.outro.caido.fora && !R.outro.dentro && dist(p, R.outro.eu) < 1.4) return { t: "Levantar", fn: () => { R.outro.caido = null; S.colher(); efeito("De pé! Corre!", "#9bd86b"); } };
  if (dist(p, CASA.porta) < 1.1) return { t: "Entrar", fn: entrar, loc: 1 };
  if (dist(p, CAIXOTE) < 1.2) { const v = valorVenda(); return { t: v ? `Vender ${v}` : "Caixote", fn: vender }; }
  if (dist(p, POCO) < 1.4) return { t: "Tirar água", fn: tirarAgua };
  if (R.vela && !velaNaMao() && dist(p, R.vela) < 1.1) return { t: "Pegar vela", fn: pegarVela };
  if (dist(p, CRUZ) < 1.5 && R.velaCom) return { t: "Deixar vela", fn: entregarVela };
  if (dist(p, CAMINHONETE) < 2) return { t: R.pecas >= 3 ? "Ir embora!" : "Caminhonete", fn: () => R.pecas >= 3 ? irEmbora() : efeito(`Faltam ${3 - R.pecas} peças (na bancada)`, "#e8e2d4") };
  if (dist(p, DOCA) < 1.3) return { t: R.vara ? "Pescar" : "Sem vara", fn: () => R.vara ? pescar() : efeito("Faça uma vara na bancada: 3 gravetos e 2 folhas", "#e8e2d4"), loc: 1 };
  if (dist(p, CAPELA.porta) < 1.3) return { t: "Tocar o sino", fn: tocarSino };
  for (let i = 0; i < COLMEIAS.length; i++) { const [cx, cy] = COLMEIAS[i]; if (Math.hypot(p.x - cx, p.y - (cy + .4)) < .9) return { t: R.mel[i] ? "Tirar mel" : "Colmeia", fn: () => { if (ehNoite()) return efeito("As abelhas dormem. Melhor não.", "#e8e2d4"); if (!R.mel[i]) return efeito("Amanhã tem mais", "#e8e2d4"); R.mel[i] = 0; R.extra.mel = (R.extra.mel || 0) + 1; S.abelhas(cx, cy); efeito("+1 mel", "#f2c94a"); hud(); } }; }
  if (p.x > CHIQUEIRO.x0 && p.x < CHIQUEIRO.x1 && Math.abs(p.y - CHIQUEIRO.y1 - .3) < .6) return { t: "Porcos", fn: () => { S.oinc(p.x, CHIQUEIRO.y1); falar([R.mula.hoje && ehNoite() ? "Eles não param de olhar para a mata. Porco sabe das coisas." : ["Oi, porquinhos! A vó dava nome para todos. Esse é o Torresmo... coitado.", "A vó dizia que porco grita antes de coisa ruim chegar.", "Eles estão com fome. Eu também."][Math.floor(Math.random() * 3)]], null, "Yasmin"); }, loc: 1 };
  if (dist(p, { x: BALANCO.x, y: BALANCO.y + .3 }) < 1.1) return { t: "Balanço", fn: () => falar([ehNoite() ? "O balanço está quente. Como se alguém tivesse acabado de levantar." : "A vó me balançava aqui e cantava a música do sabiá. Eu pedia mais alto, mais alto..."], null, "Yasmin"), loc: 1 };
  if (dist(p, GALINHEIRO.porta) < 1.3) return { t: R.ovos ? `Pegar ${R.ovos} ovos` : "Sem ovos", fn: () => { if (!R.ovos) return efeito("Elas botam de manhã", "#e8e2d4"); R.extra.ovo = (R.extra.ovo || 0) + R.ovos; efeito(`+${R.ovos} ovos`); R.ovos = 0; S.colher(); tocarTom(900, .12, { tipo: "square", vol: .02, ate: 1300, lp: 2000 }); hud(); } };
  for (let i = 0; i < POMAR.length; i++) { const [fx, fy] = POMAR[i]; if (Math.hypot(p.x - fx, p.y - (fy + .6)) < 1.1) { const f = R.frutas[i]; return { t: f.n ? `Colher ${f.n} laranja${f.n > 1 ? "s" : ""}` : "Laranjeira", fn: () => { if (!f.n) return efeito("Ainda verdes", "#e8e2d4"); R.extra.laranja = (R.extra.laranja || 0) + f.n; efeito(`+${f.n} laranja`); f.n = 0; f.t = 0; S.colher(); hud(); } }; } }
  if (dist(p, { x: CASINHA.x, y: CASINHA.y + .7 }) < 1.2) return { t: "Casinha", loc: 1, fn: () => { if (ehNoite()) { tocarRuido(.1, { f: 200, vol: .5, wet: .4 }); tocarRuido(.1, { f: 200, vol: .5, wet: .4, quando: .35 }); tocarRuido(.1, { f: 200, vol: .5, wet: .4, quando: .7 }); efeito("Alguém bateu de dentro.", "#e2483d"); } else efeito("Melhor não.", "#e8e2d4"); } };
  for (const pl of PLACAS) if (dist(p, pl) < 1.2) return { t: "Ler", fn: () => falar([pl.txt], null, "Placa"), loc: 1 };
  const lb = lembrancaPerto(p, LEMBRANCAS); if (lb && !covaPerto()) return { t: "Olhar", fn: () => lembrar(lb), loc: 1 };
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
function acao() { if (!R || R.menu) return; if (R.msg) return proximaFala(); if (painelAberto) return; const o = oQueFazer(); if (!o) return; if (R.online === "guest" && !o.loc) { enviar({ t: "acao", nome: o.t }); tocarTom(700, .04, { vol: .03 }); return; } o.fn(); }
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
function puxarPeixe() { const r = Math.random(); let acc = 0, pe = PEIXES[0]; for (const p of PEIXES) { acc += p[2]; if (r < acc) { pe = p; break; } } if (R.online === "guest") enviar({ t: "peixe", nome: pe[0] }); else R.peixes[pe[0]] = (R.peixes[pe[0]] || 0) + 1; R.pesca = null; S.peixe(); efeito(`Pegou um ${pe[0].toLowerCase()}!`, "#5ab0e0"); hud(); }
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
  if (!R.peneira) item("Peneira", "Para pegar o Saci no redemoinho", 20, true, () => { R.peneira = true; });
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
  el.rcPainel.querySelectorAll("[data-i]").forEach(b => b.addEventListener("click", () => { const x = o[+b.dataset.i]; if (R.online === "guest") { enviar({ t: "compra", nome: x.nome }); b.disabled = true; tocarTom(900, .05, { vol: .05 }); setTimeout(() => painelAberto && document.getElementById("rcFechar") && abrirBancada(), 350); return; } R.moedas -= x.preco; x.fn(); S.moedas(); hud(); abrirBancada(); }));
  document.getElementById("rcFechar").addEventListener("click", fecharPainel);
  document.getElementById("rcVisual").addEventListener("click", abrirVisual);
}
function abrirVisual() {
  const tem = JSON.parse(ls("roca_chapeus") || '["palha"]');
  el.rcPainel.innerHTML = `<div class="rc-caixa"><h2>Visual</h2><p>A Sombrinha às vezes traz moedas douradas. Elas ficam guardadas mesmo se você morrer. Você tem ${R.ouro}.</p>
    <div class="rc-grade">${COSMETICOS.map(([id, n, p, cor]) => `<button type="button" class="rc-op ${R.chapeu === id ? "dest" : ""}" data-c="${id}" ${tem.includes(id) || R.ouro >= p ? "" : "disabled"}><span style="color:${cor}">●</span> ${n}<small>${tem.includes(id) ? (R.chapeu === id ? "Usando" : "Usar") : p + " douradas"}</small></button>`).join("")}</div>
    <div class="rc-linha"><button type="button" class="rc-op dest" id="rcFechar">Voltar</button></div></div>`;
  el.rcPainel.querySelectorAll("[data-c]").forEach(b => b.addEventListener("click", () => { const id = b.dataset.c, cs = COSMETICOS.find(x => x[0] === id); if (!tem.includes(id)) { R.ouro -= cs[2]; ls("roca_ouro", R.ouro); tem.push(id); ls("roca_chapeus", JSON.stringify(tem)); } R.chapeu = id; ls("roca_chapeu", id); S.moedas(); abrirVisual(); }));
  document.getElementById("rcFechar").addEventListener("click", abrirBancada);
}
function fecharPainel() { painelAberto = false; el.rcPainel.hidden = true; el.rcPainel.innerHTML = ""; }
/* ---------- diário da vó, mochila e lembranças da Yasmin ---------- */
const BICHOS = [
  ["seco", "Corpo-Seco", "Mora na mata. Quando a mata estalar, CORRA para dentro de casa: ele vem de quatro, mais rápido que você andando. Dentro de casa ele não entra. O sino da capela espanta ele.", "Ele nunca foi enterrado. A terra não quis."],
  ["aranha", "A Pernuda", "Juntas estalando lá no alto = ela está perto. Ela só enxerga LUZ e MOVIMENTO: apague a lanterna e fique parada até as juntas sumirem. No milharal ela não te vê.", "Seu avô viu ela uma vez, da altura do pé de manga. Nunca mais dormiu de luz acesa."],
  ["lobo", "O cachorro preto", "Não deixe ele chegar perto: de perto ele vira lobisomem. Se virar, corra para casa. Depois de um tempo ele desiste e volta para a mata.", "Ele aparece no segundo dia. Não dê comida."],
  ["mula", "Mula-sem-cabeça", "O chão brilha em linha reta e os porcos gritam: SAIA DA LINHA. Ela não faz curva. Queima a plantação por onde passa.", "Dizem que é castigo. Eu digo que é só uma mula muito brava."],
  ["esp", "Seu Tonico, o espantalho", "Só anda no escuro. Ilumine ele com a lanterna e ele congela. Na madrugada, fique de olho no poste vazio.", "Eu mesma costurei a boca dele. Ele não gostou."],
  ["saci", "Saci", "Redemoinho assobiando de dia. Seca a plantação e rouba moedas. Com a peneira da bancada, entre no redemoinho e pegue ele: ele paga para ser solto.", "Deixe um fuminho na janela e ele fica mais manso."],
  ["pisadeira", "Pisadeira", "Dentro de casa, as lamparinas apagam com o tempo. Quando a última apagar, ela sai de baixo da cama. Mantenha as lamparinas acesas (use óleo na mesa) ou saia de casa.", "Ela gosta de quem dorme de barriga cheia."],
  ["alma", "A alma da vela", "Toda noite aparece uma vela acesa em algum lugar do sítio. Siga o som do sininho, pegue a vela e deixe na cruz do cemitério antes de amanhecer. Se esquecer, ela vem buscar todo mundo.", "É a bisa. Ela só quer companhia."],
  ["poco", "O rosto do poço", "De noite, às vezes tem alguém olhando lá do fundo do poço. Ele não sobe. Só assusta.", "Não responda quando ele chamar seu nome."]];
function fotoMonstro(cvF, quem) {
  const g = cvF.getContext("2d"), cS = c, WS = W, HS = H; cvF.width = 168; cvF.height = 200;
  c = g; W = cvF.width; H = cvF.height;
  try { g.fillStyle = "#0c0a08"; g.fillRect(0, 0, W, H); const gr = g.createRadialGradient(W / 2, H * .45, 4, W / 2, H * .45, W * .8); gr.addColorStop(0, "rgba(90,80,60,.35)"); gr.addColorStop(1, "rgba(0,0,0,.6)"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    g.save(); g.translate(W / 2, H * .5); if (quem === "aranha") g.scale(.55, .55); rostoMonstro(quem, W * .38, .75, 1.3); g.restore();
    for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(255,255,255,${Math.random() * .07})`; g.fillRect(Math.random() * W, Math.random() * H, 1, 1); } // grão da foto velha
  } finally { c = cS; W = WS; H = HS; }
}
function abrirDiario(aba = "bichos") {
  painelAberto = true; el.rcPainel.hidden = false; if (!R.diario) { R.diario = true; ls("roca_diario", 1); }
  const abas = [["bichos", "Os bichos"], ["precos", "O que vale"], ["guia", "Guia do sítio"], ["obj", "O que fazer"]];
  let corpo = "";
  if (aba === "bichos") corpo = `<p>Coisas que vivem por aqui. Leia tudo, Yasmin. Uma regra esquecida é uma noite a menos.</p><div class="rc-dia-pg">${BICHOS.map(([q, n, r, nota]) => `<div class="rc-bicho"><canvas data-q="${q}"></canvas><div><b>${n}</b><span>${r}</span><i>${nota}</i></div></div>`).join("")}</div>`;
  if (aba === "precos") corpo = `<p>Tudo se vende no caixote do lado da porta. Venda antes de escurecer.</p>
    <h3>Da horta</h3><table>${Object.values(PLANTAS).map(p => `<tr><td>${p.nome}${p.custo ? ` <small>(semente ${p.custo} moedas na bancada)</small>` : ""}</td><td>${p.preco} moedas</td></tr>`).join("")}</table>
    <h3>Do sítio</h3><table><tr><td>Ovo (galinheiro, toda manhã)</td><td>${EXTRAS.ovo[1]} moedas</td></tr><tr><td>Laranja (pomar, amadurece de novo)</td><td>${EXTRAS.laranja[1]} moedas</td></tr><tr><td>Mel (colmeias depois do riacho, 1 por dia cada)</td><td>${EXTRAS.mel[1]} moedas</td></tr></table>
    <h3>Do lago</h3><table>${PEIXES.map(p => `<tr><td>${p[0]}</td><td>${p[1]} moedas</td></tr>`).join("")}</table>`;
  if (aba === "guia") corpo = `<ul>
    <li><b>Água:</b> o regador enche no poço. Planta sem água não cresce.</li>
    <li><b>Óleo:</b> a lanterna e as lamparinas de casa gastam óleo. Quando acabar, compre <b>Óleo da lanterna</b> na bancada (dentro de casa) por 5 moedas. Lamparina apagada? Chegue perto da mesa e acenda (gasta um pouco de óleo).</li>
    <li><b>Lanterna:</b> serve para ver de noite e congelar o espantalho, mas a Pernuda enxerga a luz. Saiba a hora de apagar.</li>
    <li><b>Fôlego:</b> correr cansa. Ande um pouco que ele volta.</li>
    <li><b>Gravetos e folhas:</b> a Sombrinha traz quando passeia. Com 3 gravetos e 2 folhas a bancada faz a vara de pesca. A doca fica no lago.</li>
    <li><b>Canteiros:</b> tem mais canteiros pelo sítio. Pague para abrir e plante mais de uma vez.</li>
    <li><b>Bancada:</b> regador grande, botas, lanterna reforçada, peneira, sementes novas e as peças da caminhonete.</li>
    <li><b>Capela:</b> o sino espanta o Corpo-Seco e manda o espantalho de volta. Só uma vez por noite.</li>
    <li><b>Milharal:</b> esconderijo contra a Pernuda.</li>
    <li><b>Mochila:</b> o botão da mochila mostra tudo o que você carrega. Este diário fica guardado nela.</li>
    <li><b>Com amigo:</b> cada uma tem sua água e 2 vidas. Quem for pega cai no chão e só a outra consegue levantar. Sem vidas, não levanta mais.</li></ul>`;
  if (aba === "obj") corpo = `<p><b>Agora:</b> ${objetivo()}.</p><ul><li>Plante, regue, colha e venda para juntar moedas.</li><li>Compre as três peças na bancada: bateria (120), pneu (170) e motor de arranque (240).</li><li>Leve tudo até a caminhonete no portão e vá embora deste sítio.</li><li>De noite, siga as regras dos bichos. Toda noite tem uma vela para levar até a cruz.</li></ul><p><i>Se encontrar seu pai, diga que eu sinto muito. — Benedita</i></p>`;
  el.rcPainel.innerHTML = `<div class="rc-caixa rc-diario"><h2>Diário da Vó Benedita</h2><div class="rc-linha" style="margin:4px 0 10px">${abas.map(([k, n]) => `<button type="button" class="rc-op${k === aba ? " dest" : ""}" data-aba="${k}">${n}</button>`).join("")}</div>${corpo}<div class="rc-linha"><button type="button" class="rc-op" id="rcFechar">Fechar</button></div></div>`;
  el.rcPainel.querySelectorAll("[data-aba]").forEach(b => b.addEventListener("click", () => { tocarRuido(.25, { filtro: "highpass", f: 2500, vol: .05 }); abrirDiario(b.dataset.aba); }));
  el.rcPainel.querySelectorAll("canvas[data-q]").forEach(k => fotoMonstro(k, k.dataset.q));
  document.getElementById("rcFechar").addEventListener("click", fecharPainel);
}
function abrirMochila() {
  painelAberto = true; el.rcPainel.hidden = false;
  const l = [], add = (n, v) => { if (v) l.push(`<div>${n}<b>${v}</b></div>`); };
  add("Água no regador", `${R.agua}/${R.aguaMax}`); add("Óleo", Math.round(R.oleo) + "%"); add("Moedas", R.moedas);
  Object.entries(R.colheita).forEach(([k, n]) => add(PLANTAS[k].nome, n)); Object.entries(R.peixes).forEach(([k, n]) => add(k, n)); Object.entries(R.extra).forEach(([k, n]) => add(EXTRAS[k][0], n));
  add("Gravetos", R.inv.graveto); add("Folhas", R.inv.folha); add("Sementes", R.sementes.map(k => PLANTAS[k].nome).join(", "));
  if (R.vara) add("Vara de pesca", "✓"); if (R.peneira) add("Peneira", "✓"); if (R.lanternaBoa) add("Lanterna reforçada", "✓"); if (R.vel > 3.2) add("Botas de borracha", "✓"); if (R.velaCom) add("Vela acesa", "✓"); add("Peças da caminhonete", R.pecas ? `${R.pecas}/3` : "0/3");
  const venda = valorVenda();
  el.rcPainel.innerHTML = `<div class="rc-caixa"><h2>Mochila</h2><p>${venda ? `O que você carrega vale <b style="color:#f2c94a">${venda} moedas</b> no caixote.` : "Nada para vender por enquanto."} Objetivo: ${objetivo()}.</p><div class="rc-moch-l">${l.join("")}</div>
    <div class="rc-linha">${R.diario ? `<button type="button" class="rc-op dest" id="rcLerDiario">Ler o diário da vó</button>` : `<span style="color:#b8b2a4;font-size:13px">Tem um diário em cima da mesa da casa...</span>`}<button type="button" class="rc-op" id="rcFechar">Fechar</button></div></div>`;
  if (R.diario) document.getElementById("rcLerDiario").addEventListener("click", () => abrirDiario());
  document.getElementById("rcFechar").addEventListener("click", fecharPainel);
}
// lugares onde a Yasmin lembra de coisas (tocar em "Olhar")
const LEMBRANCAS = [
  { x: 19.5, y: 7.5, r: 1.4, dia: ["A vó estendia a roupa aqui e eu brincava de esconde-esconde entre os lençóis. Ela sempre fingia que não me achava. Que saudade dela...", "Ainda tem um vestido dela no varal. Cheira a sabão de coco."], noite: ["Os lençóis estão se mexendo... e não tem vento nenhum."] },
  { x: 23, y: 18.3, r: 1, dia: ["O vô fez esse catavento antes de eu nascer. A vó dizia que, quando ele para de girar, é porque alguém está olhando."], noite: ["Ele parou de girar."] },
  { x: 44, y: 13.9, r: 1.3, dia: ["O trator do vô. A vó me sentava no colo dela e me deixava fingir que dirigia."], noite: ["O banco do trator está quente."] },
  { x: 39.5, y: 12.1, r: 1.3, dia: ["O celeiro sempre teve cheiro de milho e poeira. Agora tem cheiro de outra coisa."], noite: ["Tem alguma coisa respirando lá dentro. Melhor não abrir."] },
  { x: 40.4, y: 25.6, r: 1.3, dia: ["Aqui estão o vô e a bisa. A vó trazia flores todo domingo. Eu devia trazer também."], noite: ["A terra desse túmulo está remexida... de dentro para fora."] },
  { x: 35.2, y: 23.5, r: 1.3, dia: ["A vó dizia para nunca nadar no lago depois que escurece. Eu nunca perguntei por quê."], noite: ["Tem bolhas subindo no meio do lago. Como se alguém respirasse lá embaixo."] },
  { x: 17.6, y: 10, r: 1, dia: ["O machado do pai. Ele rachava lenha cantando. Ele vai voltar. Ele tem que voltar."], noite: ["Alguém empilhou a lenha de novo. Não fui eu."] },
  { x: 45.2, y: 11.2, r: 1.1, dia: ["A gente pulava no feno até ficar com coceira. A vó ria tanto que tinha que sentar."], noite: ["Tem um buraco no meio do feno. Do tamanho de uma pessoa deitada."] },
  { x: 21.8, y: 14.9, r: .9, dia: ["A vó me levava na carriola até a horta. Ela dizia que eu era a colheita especial dela."], noite: ["A roda da carriola ainda está girando."] },
  { x: 20.2, y: 19.2, r: 1, dia: ["A vó chamava ele de Seu Tonico. Eu tinha medo dele. Ainda tenho."], noite: ["Não olha pra ele. Não olha pra ele. Não olha pra ele."] },
  { x: 53.5, y: 12.2, r: 1.2, dia: ["O milho ficou mais alto que eu. Quando o vento passa, parece que alguém sussurra meu nome."], noite: ["Alguém está andando no meio do milho. Devagar. Do meu lado."] },
  { x: 46.4, y: 18, r: 1.2, dia: ["A água do riacho é gelada. A vó dizia que ela vem lá de dentro da mata, de onde ninguém volta."], noite: ["Tem dois pontinhos brilhando na água. Piscando."] },
  { x: 25.2, y: 33.6, r: 1.2, dia: ["A estrada some na curva. Lá longe tem a cidade, o colégio, a minha cama. Parece outro mundo."], noite: ["Tem uma luz parada lá longe na estrada. Não é carro."] },
  { x: 29, y: 11.4, r: .9, dia: ["A galinha pintadinha se chama Dona Cocó. Fui eu que dei o nome."], noite: ["As galinhas não fazem barulho nenhum. Galinha sempre faz barulho."] }];
const LEMB_CASA = [
  { x: 1.7, y: 3, r: 1, dia: ["A cama da vó. O travesseiro ainda tem o cheiro dela.", "Eu dormia aqui quando tinha pesadelo. Ela contava histórias até eu dormir."], noite: ["Não olha embaixo da cama. Por favor, não olha embaixo da cama."] },
  { x: 8.1, y: 3.6, r: .9, dia: ["No armário tem o xale da vó e uma caixinha de música que não toca mais."], noite: ["A caixinha de música tocou sozinha. Só uma nota."] },
  { x: 1.6, y: 5.3, r: .9, dia: ["A cadeira de balanço da vó. Ela tricotava aqui ouvindo o rádio."], noite: ["Ela está balançando. Eu não encostei."] }];
function lembrancaPerto(p, lista) { for (let i = 0; i < lista.length; i++) if (Math.hypot(p.x - lista[i].x, p.y - lista[i].y) < lista[i].r) return lista[i]; return null; }
function lembrar(l) { const arr = ehNoite() ? l.noite : l.dia; l.i = ((l.i || 0) + 1) % arr.length; falar([arr[l.i]], null, "Yasmin"); }
function pausar() {
  if (!R || R.morto || R.venceu) return; painelAberto = true; el.rcPainel.hidden = false;
  el.rcPainel.innerHTML = `<div class="rc-caixa"><h2>Pausa</h2><p>Dia ${R.dia}. Se sair agora, a partida é perdida.</p>
    <p style="font-size:13px">Controles: mexa com o círculo da esquerda. <b>Ação</b> faz o que aparece escrito (plantar, regar, colher, vender, entrar...). <b>Lanterna</b> gasta óleo. <b>Correr</b> vai até o fôlego acabar. O botão da semente troca o que você planta.</p>
    ${R.online ? `<p style="font-size:13px;color:#9bd86b">Jogando online${R.online === "host" ? (R.outro ? " · amigo conectado" : " · sozinha agora") : " · na sala do amigo"}. O jogo não para no online.</p>` : ""}
    <div class="rc-linha"><button type="button" class="rc-op dest" id="rcVoltar">Continuar</button><button type="button" class="rc-op" id="rcSair">Sair da partida</button></div></div>`;
  document.getElementById("rcVoltar").addEventListener("click", fecharPainel);
  document.getElementById("rcSair").addEventListener("click", () => { fecharPainel(); R.menu = true; menuInicial(); });
}
function telaFim(tipo) {
  painelAberto = true; el.rcPainel.hidden = false;
  const mins = Math.floor(R.tempoTotal / 60), segs = Math.round(R.tempoTotal % 60);
  const txt = tipo === "venceu" ? `<h2 style="color:#9bd86b">Você foi embora</h2><p>A caminhonete pega na terceira tentativa. Pelo retrovisor, o sítio fica pequeno... e alguém acena da janela da casa vazia.</p><p>Dia ${R.dia} · ${mins} min ${segs} s</p>`
    : `<h2 style="color:#e2483d">Você morreu</h2><p>${R.morto.porque}</p><p style="font-size:13px;color:#9bd86b">${R.morto.dica}</p><p>Chegou ao dia ${R.dia}.</p>`;
  const conv = R.online === "guest";
  el.rcPainel.innerHTML = `<div class="rc-caixa">${txt}${conv ? `<p style="font-size:13px">Esperando o anfitrião começar outra partida...</p>` : ""}<div class="rc-linha">${conv ? "" : `<button type="button" class="rc-op dest" id="rcDeNovo">Jogar de novo</button>`}<button type="button" class="rc-op" id="rcSair">Menu</button></div></div>`;
  if (!conv) document.getElementById("rcDeNovo").addEventListener("click", () => { const m = R.online && R.outro ? "host" : "solo"; fecharPainel(); iniciarJogo(m); });
  document.getElementById("rcSair").addEventListener("click", () => { fecharPainel(); R.menu = true; menuInicial(); });
}
function morrer(quem, porque, dica) { if (R.morto || R.venceu || R.caido) return;
  if (R.online === "host" && quem !== "alma" && jogadores().filter(P => !P.caido).length > 1) {
    const fora = R.vidas <= 0; if (!fora) R.vidas--;
    R.caido = { quem, porque, dica, t: 0, fora }; R.correndo = false; R.lanterna = false; R.dentro = false;
    if (R.trocado) enviar({ t: "caiu", quem }); else { S.susto(); try { vibrar(400); } catch (e) {} }
    efeito(fora ? "Sem vidas! Agora é com a outra" : "Caiu! Só a outra pode levantar", "#e2483d"); hud(); return;
  } R.morto = { quem, porque, dica, t: 0 }; R.correndo = false; S.susto(); try { vibrar(500); } catch (e) {} setTimeout(() => telaFim("morreu"), 2300); }

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
  const comAmigo = !!(R.online && R.outro && !R.menu); el.rcChat.hidden = !comAmigo; if (!comAmigo && !el.rcChatBar.hidden) abrirChat(false);
  el.rcObj.textContent = R.menu ? "" : "Objetivo: " + objetivo();
  const cor = n => "♥".repeat(Math.max(0, n)) + "♡".repeat(Math.max(0, 2 - n));
  el.rcVidas.innerHTML = R.online && R.outro ? `<span>Você <b>${cor(R.vidas)}</b></span><span>${R.online === "host" ? "Amigo" : "Yasmin"} <b>${cor(R.outro.vidas)}</b></span>` : "";
}
function objetivo() {
  if (R.pecas >= 3) return "leve tudo até a caminhonete no portão e vá embora!";
  const falta = [["Bateria nova", 120], ["Pneu", 170], ["Motor de arranque", 240]][R.pecas];
  return `juntar ${falta[1]} moedas e comprar ${falta[0].toLowerCase()} na bancada (peças ${R.pecas}/3)` + (ehNoite() ? " · sobreviva até amanhecer" : "");
}

/* ---------- atualização ---------- */
function anda(p, dx, dy, vel, dt, sala) {
  const rr = .28, livre = (x, y) => {
    if (sala) { if (x < .5 || x > SALA.w - .5 || y < 1.1 || y > SALA.h - .3) return false; for (const [mx, my, mw, mh] of MOVEIS) if (x > mx - .2 && x < mx + mw + .2 && y > my && y < my + mh + .25) return false; return true; }
    for (const [ox, oy] of [[-rr, 0], [rr, 0], [0, -rr * .6], [0, rr * .4]]) { const tx = Math.floor(x + ox), ty = Math.floor(y + oy); if (ty < 0 || ty >= MH || tx < 0 || tx >= MW || R.solido[ty][tx]) return false; }
    for (const [x0, y0, x1, y1] of R.caixas) if (x > x0 - rr && x < x1 + rr && y > y0 - .12 && y < y1 + .12) return false; return true; };
  const nx = p.x + dx * vel * dt, ny = p.y + dy * vel * dt;
  const preso = !livre(p.x, p.y); if (preso || livre(nx, p.y)) p.x = nx; if (preso || livre(p.x, ny)) p.y = ny;
}
function atualizarPesca(dt) {
  if (R.pesca) { R.pesca.t += dt; if (!R.pesca.fisgou && R.pesca.t > R.pesca.morde) { R.pesca.fisgou = true; R.pesca.ft = 0; S.fisga(); } if (R.pesca.fisgou) { R.pesca.ft += dt; if (R.pesca.ft > .9) { R.pesca = null; efeito("O peixe escapou", "#e8e2d4"); } } }
}
function moverLocal(dt) {
  // movimento
  let dx = joy.dx, dy = joy.dy;
  if (teclas["a"] || teclas["arrowleft"]) dx = -1; if (teclas["d"] || teclas["arrowright"]) dx = 1; if (teclas["w"] || teclas["arrowup"]) dy = -1; if (teclas["s"] || teclas["arrowdown"]) dy = 1;
  if (R.caido || (R.msg && R.online) || (painelAberto && R.online)) { dx = 0; dy = 0; }
  const m = Math.hypot(dx, dy); if (m > 1) { dx /= m; dy /= m; }
  if (R.pesca && m > .2) R.pesca = null;
  if (R.correndo) { R.folego -= 30 * dt; if (R.folego <= 0) { R.folego = 0; R.correndo = false; } } else R.folego = Math.min(100, R.folego + 14 * dt);
  const vel = R.vel * (R.correndo ? 1.75 : 1) * (R.dentro ? .8 : 1);
  if (R.dentro) anda(R.sala, dx, dy, vel, dt, true); else anda(R.eu, dx, dy, vel, dt, false);
  const pp = R.dentro ? R.sala : R.eu;
  if (m > .1) { pp.dir = dx < -.1 ? -1 : dx > .1 ? 1 : (pp.dir || 1); R.eu.fase += dt * vel * 3.2; R.eu.anda = Math.min(1, m); if ((R.eu.fase % PI) < dt * vel * 3.2) S.passo(); } else R.eu.anda = 0;
  if (R.regando > 0) R.regando -= dt;
}
function atualizar(dt) {
  if (R.menu) return;
  if (painelAberto && !R.online) return;
  R.fx.forEach(f => f.t += dt); R.fx = R.fx.filter(f => f.t < 1.8);
  R.poeira.forEach(q => { q.t += dt; q.y -= dt * .3; }); R.poeira = R.poeira.filter(q => q.t < .8);
  if (R.susto > 0) R.susto -= dt; if (R.tremor > 0) R.tremor -= dt;
  if (R.morto) { R.morto.t += dt; return; }
  if (R.venceu) { R.venceu.t += dt; if (R.venceu.t > 4.5 && !R.venceu.tela) { R.venceu.tela = true; telaFim("venceu"); } return; }
  if (R.msg && !R.online) return;
  R.tempoTotal += dt;
  jogadores().forEach(P => { if (P.caido) P.caido.t += dt; });
  const antesNoite = ehNoite(); R.t += dt; const agoraNoite = ehNoite();
  if (!antesNoite && agoraNoite) comecaNoite();
  if (antesNoite && !agoraNoite) amanhece();
  moverLocal(dt);
  const nLuz = jogadores().filter(P => P.lanterna).length;
  if (nLuz) { R.oleo -= (R.lanternaBoa ? .5 : .9) * dt * nLuz; if (R.oleo <= 0) { R.oleo = 0; if (R.lanterna) efeito("A lanterna apagou", "#f2a33a"); R.lanterna = false; if (R.outro) R.outro.lanterna = false; } }
  if (R.outro && R.outro.regando > 0) R.outro.regando -= dt;
  // plantas, pomar e galinhas
  for (const k of R.canteiros) k.covas.forEach((cv2, i) => { if (!cv2 || cv2.seca || cv2.est >= 3) return; cv2.t += dt; if (cv2.t >= PLANTAS[cv2.tipo].tempo) { cv2.est++; cv2.t = 0; if (cv2.est < 3) cv2.seca = true; else S.pronto(k.x + i % k.w, k.y + Math.floor(i / k.w)); } });
  R.frutas.forEach(f => { if (f.n >= 3) return; f.t += dt; if (f.t > 45) { f.t = 0; f.n++; } });
  R.galinhas.forEach(g => { g.t -= dt; if (!g.alvo || g.t <= 0) { g.alvo = { x: rnd(26, 31.6), y: rnd(9.9, 10.9) }; g.t = rnd(1.5, 4); } const d = dist(g, g.alvo); if (d > .1) { g.x += (g.alvo.x - g.x) / d * .9 * dt; g.y += (g.alvo.y - g.y) / d * .9 * dt; g.dir = g.alvo.x > g.x ? 1 : -1; g.anda = 1; } else g.anda = 0; if (Math.random() < dt * .04) { const [v, pn] = somEm(g.x, g.y); tocarTom(rnd(700, 900), .09, { tipo: "square", vol: .012 * v, ate: 1200, lp: 1800, pan: pn }); } });
  atualizarPesca(dt);
  // o vulto parado na beira da mata à noite (só olha; some quando você chega perto ou ilumina)
  if (ehNoite() && !R.dentro) { R.vultoT -= dt; if (!R.vulto && R.vultoT <= 0) { const lado = Math.floor(rnd(0, 3)); R.vulto = lado === 0 ? { x: CERCA.x0 - .7, y: rnd(10, 28) } : lado === 1 ? { x: CERCA.x1 + .7, y: rnd(10, 28) } : { x: rnd(10, 40), y: CERCA.y0 - .7 }; R.vulto.t = 0; } if (R.vulto) { R.vulto.t += dt; const d = dist(R.vulto, R.eu); if (d < (R.lanterna ? 7 : 4) || R.vulto.t > 14) { R.vulto = null; R.vultoT = rnd(25, 45); } } } else R.vulto = null;
  atualizarGato(dt);
  comJogador(alvoPara(R.seco.x, R.seco.y), () => atualizarSeco(dt));
  if (R.cachorro) comJogador(alvoPara(R.cachorro.x, R.cachorro.y), () => atualizarCachorro(dt));
  atualizarAlma(dt);
  comJogador(jogadores().find(P => P.dentro && !P.caido) || R, () => atualizarCasa(dt));
  atualizarAranha(dt); atualizarMula(dt); atualizarSaci(dt); atualizarEspantalho(dt); atualizarBichos(dt);
  R.perto = calcPerto();
  musicaPasso(dt);
  if (Math.floor(R.t * 2) !== Math.floor((R.t - dt) * 2)) hud();
  const o = oQueFazer(); el.rcAcao.textContent = o ? o.t : "Ação"; el.rcAcao.style.opacity = o ? 1 : .5;
}
function comecaNoite() { R.velaHoje = true; R.velaEntregue = false; R.velaT = rnd(8, 18); R.sinoUsado = false;
  // cada noite é sorteada: quem vem, quando vem e quantas vezes (nada de padrão)
  R.aranha.hoje = R.dia >= 2 && Math.random() < .65; R.aranha.prox = rnd(4, 70);
  R.mula.hoje = R.dia >= 2 && Math.random() < (R.dia >= 3 ? .6 : .3); R.mula.prox = rnd(6, 60); R.mula.vezes = 0; R.mula.max = 1 + Math.floor(Math.random() * 3);
  R.esp.dorme = !(R.dia >= 2 && Math.random() < .6); R.esp.limiar = rnd(.1, .65);
  R.velaT = rnd(3, 40); efeito("Anoiteceu", "#9aa8c8"); tocarTom(220, 2, { vol: .04, ate: 165, wet: .8 }); }
function amanhece() {
  if (R.velaHoje && !R.velaEntregue) { R.alma = { t: 0 }; return; } // a alma vem cobrar
  R.dia++; R.velaHoje = false; R.vela = null; R.velaCom = false; if (R.outro) R.outro.velaCom = false; R.ovos = Math.min(8, R.ovos + 3); R.mel = R.mel.map(() => 1); R.saci.pego = false; efeito(`Dia ${R.dia}`, "#f2c94a");
  Object.assign(R.esp, { x: ESPANTALHO.x, y: ESPANTALHO.y, fase: "poste" }); if (R.aranha.fase !== "longe") R.aranha.fase = "sai"; R.mula.fase = "longe";

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
  if (s.fase === "sai") { const dd = s.x < (CERCA.x0 + CERCA.x1) / 2 ? -1 : 1; s.x += dd * 3.6 * dt; s.dir = dd; s.fase2 = (s.fase2 || 0) + dt * 11; if (s.t > 6) { s.fase = "longe"; s.prox = Math.random() < .2 ? rnd(25, 60) : rnd(70, 260) - Math.min(50, R.dia * 6); /* sem padrão: às vezes volta logo */ efeito("Ouviu o suspiro. Já pode sair.", "#9aa8c8"); } }
}
function atualizarCachorro(dt) {
  const k = R.cachorro; if (!k) return; k.t += dt; if (k.calma > 0) k.calma -= dt;
  const alvo = R.eu, d = dist(k, alvo);
  if (k.fase === "calmo") {
    const quer = 6.5; if (!R.dentro && d > quer + .5) { k.x += (alvo.x - k.x) / d * 1.4 * dt; k.y += (alvo.y - k.y) / d * 1.4 * dt; k.dir = alvo.x > k.x ? 1 : -1; k.anda = 1; }
    else if (dist(k, CASA.porta) < 6) { const dd = dist(k, CASA.porta) || 1; k.x += (k.x - CASA.porta.x) / dd * 1.6 * dt; k.y += (k.y - CASA.porta.y) / dd * 1.6 * dt; k.anda = 1; } // não fica plantado na porta
    else { k.anda = 0; k.dir = alvo.x > k.x ? 1 : -1; }
    k.x = cl(k.x, CERCA.x0 + .6, CERCA.x1 - .6); k.y = cl(k.y, CERCA.y0 + .6, CERCA.y1 - .6);
    if (!R.dentro && !(k.calma > 0) && d < 2.8) { k.fase = "vira"; k.t = 0; S.rosnado(k.x, k.y); R.tremor = .6; }
  } else if (k.fase === "vira") { if (k.t > 1.3) { k.fase = "lobo"; k.t = 0; k.porta = 0; S.uivo(k.x, k.y); } }
  else if (k.fase === "lobo") {
    const alvo2 = R.dentro ? { x: CASA.porta.x, y: CASA.porta.y + 1 } : alvo, d2 = dist(k, alvo2);
    if (d2 > .1) { k.x += (alvo2.x - k.x) / d2 * 5.9 * dt; k.y += (alvo2.y - k.y) / d2 * 5.9 * dt; k.dir = alvo2.x > k.x ? 1 : -1; k.anda = 1; if (Math.random() < dt * 10) R.poeira.push({ x: k.x, y: k.y, t: 0 }); }
    if (k.t % 1.3 < dt) S.rosnado(k.x, k.y);
    if (!R.dentro && d < .8) morrer("lobo", "O cachorro preto virou lobisomem.", "Fique longe do cachorro. Se ele virar, corra para casa: ele desiste e volta para a mata.");
    if (R.dentro) k.porta += dt;
    if (k.t > 8 || k.porta > 2.5 || R.caido) { // desiste: arranha a porta, uiva e corre de volta para a mata
      k.fase = "foge"; k.t = 0; const lados = [{ x: CERCA.x0 + 1, y: rnd(20, 31) }, { x: rnd(30, 46), y: CERCA.y1 - 1 }, { x: rnd(30, 44), y: CERCA.y0 + 1 }]; k.fuga = lados[Math.floor(Math.random() * 3)]; S.uivo(k.x, k.y); }
  } else if (k.fase === "foge") {
    const dd = dist(k, k.fuga); if (dd > .2) { k.x += (k.fuga.x - k.x) / dd * 4.6 * dt; k.y += (k.fuga.y - k.y) / dd * 4.6 * dt; k.dir = k.fuga.x > k.x ? 1 : -1; k.anda = 1; }
    if (dd < .3 || k.t > 7) { k.fase = "calmo"; k.t = 0; k.calma = rnd(25, 50); }
  }
}
function atualizarAlma(dt) {
  if (R.alma) { R.alma.t += dt; if (R.alma.t > 1.4) morrer("alma", "Ninguém levou a vela até a cruz. A alma veio buscar.", "Toda noite, siga o som do sino, pegue a vela e deixe na cruz do cemitério antes de amanhecer."); return; }
  if (!ehNoite() || !R.velaHoje || R.velaEntregue) return;
  if (!R.vela && !velaNaMao()) { R.velaT -= dt; if (R.velaT <= 0) { let x, y; do { x = rnd(CERCA.x0 + 1, CERCA.x1 - 1); y = rnd(CERCA.y0 + 1, CERCA.y1 - 1); } while (R.solido[Math.floor(y)][Math.floor(x)] || R.caixas.some(([x0, y0, x1, y1]) => x > x0 - .5 && x < x1 + .5 && y > y0 - .3 && y < y1 + .5) || dist({ x, y }, R.eu) < 7); R.vela = { x, y, som: 0 }; efeito("Um sino tocou em algum lugar...", "#e8e2d4"); } }
  if (R.vela && !velaNaMao()) { R.vela.som -= dt; if (R.vela.som <= 0) { S.sino(R.vela.x, R.vela.y); R.vela.som = 3.2; } }
}
function atualizarCasa(dt) {
  if (R.dentro) {
    if (!R.pisadeira) { R.lampT += dt; if (R.lampT > (R.lampLim || 20)) { R.lampT = 0; R.lampLim = rnd(9, 34); const i = R.lamparinas.lastIndexOf(1); if (i >= 0) { R.lamparinas[i] = 0; S.apaga(); if (i === 0) { R.pisadeira = { t: 0, x: 1.7, y: 2.8 }; S.respira(); R.tremor = .5; efeito("Algo se mexe debaixo da cama", "#e2483d"); } } } }
    else { const p = R.pisadeira; p.t += dt; if (p.t > 1.8) { const d = dist(p, R.sala), v = 2.2 * (.6 + .8 * Math.abs(Math.sin(p.t * 3))); if (d > .05) { p.x += (R.sala.x - p.x) / d * v * dt; p.y += (R.sala.y - p.y) / d * v * dt; p.dir = R.sala.x > p.x ? 1 : -1; } if (p.t % 2.2 < dt) S.respira(); if (d < .6) morrer("pisadeira", "A Pisadeira saiu de baixo da cama.", "Não fique muito tempo dentro de casa: quando as lamparinas apagam, saia. Elas acendem de novo com o tempo."); } if (p.t > 30) R.pisadeira = null; }
  } else { R.pisadeira = null; R.lampT += dt; if (R.lampT > 12) { R.lampT = 0; const i = R.lamparinas.indexOf(0); if (i >= 0) R.lamparinas[i] = 1; } }
}

/* ---------- jogadores (sozinha ou online) ---------- */
// No online, o anfitrião simula tudo. O convidado é guardado em R.outro com os mesmos campos do jogador local,
// e comJogador troca os campos por um instante para reaproveitar as regras escritas para R.eu.
const CAMPOS = ["agua", "vidas", "eu", "dentro", "sala", "lanterna", "correndo", "regando", "velaCom", "pesca", "perto", "caido", "folego", "chapeu", "semente", "cor"];
const jogadores = () => R.outro && R.online === "host" ? [R, R.outro] : [R];
function comJogador(P, fn) {
  if (!P || P === R || !R.outro) return fn();
  const o = R.outro; for (const k of CAMPOS) { const v = R[k]; R[k] = o[k]; o[k] = v; } R.trocado = true;
  try { return fn(); } finally { for (const k of CAMPOS) { const v = R[k]; R[k] = o[k]; o[k] = v; } R.trocado = false; }
}
function alvoPara(x, y) { // quem a assombração persegue: o mais perto, de preferência do lado de fora
  let melhor = R, md = 1e9; for (const P of jogadores()) { if (P.caido) continue; const d = Math.hypot(P.eu.x - x, P.eu.y - y) + (P.dentro ? 40 : 0); if (d < md) { md = d; melhor = P; } } return melhor;
}
const velaNaMao = () => R.velaCom || (R.outro && R.outro.velaCom);
const noMilharal = p => p.x > MILHARAL.x0 && p.x < MILHARAL.x1 && p.y > MILHARAL.y0 && p.y < MILHARAL.y1;
const progNoite = () => cl(((R.t % CICLO) - DIA) / NOITE, 0, 1);
const raioLuz = P => P.lanterna ? (R.lanternaBoa ? 5.4 : 4.4) : 1.7;
function calcPerto() {
  if (R.dentro && !R.pisadeira) return 0;
  let p = 0; const e = R.eu;
  if (R.seco.fase === "anda") p = Math.max(p, 1 - dist(e, R.seco) / 9);
  if (R.cachorro && (R.cachorro.fase === "lobo" || R.cachorro.fase === "vira")) p = 1;
  if (R.vulto) p = Math.max(p, .5); if (R.pisadeira) p = 1;
  const a = R.aranha; if (a.fase === "anda") p = Math.max(p, .55 + a.alerta * .45); if (a.fase === "ataque") p = 1;
  if (R.mula.fase === "aviso" || R.mula.fase === "corre") p = Math.max(p, .7);
  if (R.esp.fase === "vivo") p = Math.max(p, 1 - dist(e, R.esp) / 10);
  return cl(p, 0, 1);
}
const BORDA = () => { const l = Math.floor(rnd(0, 3)); return l === 0 ? { x: CERCA.x0 - 1.5, y: rnd(CERCA.y0 + 3, CERCA.y1 - 3) } : l === 1 ? { x: CERCA.x1 + 1.5, y: rnd(CERCA.y0 + 3, CERCA.y1 - 3) } : { x: rnd(CERCA.x0 + 4, CERCA.x1 - 4), y: CERCA.y0 - 1.5 }; };
function irAte(o, alvo, v, dt) { const d = dist(o, alvo); if (d > .05) { const k = Math.min(d, v * dt); o.x += (alvo.x - o.x) / d * k; o.y += (alvo.y - o.y) / d * k; o.dir = alvo.x > o.x ? 1 : -1; } return d; }

/* A Pernuda: aranha-girafa gigante. Só enxerga luz e movimento. */
function atualizarAranha(dt) {
  const a = R.aranha; if (R.tutorial === 0) return; a.t += dt;
  if (a.fase === "longe") { if (!a.hoje || !ehNoite()) return; a.prox -= dt; if (a.prox > 0) return; Object.assign(a, BORDA(), { fase: "aviso", t: 0, alerta: 0, alvo: null, passo: 0 }); S.juntas(a.x, a.y); efeito("Juntas estalando lá no alto...", "#e2483d"); return; }
  if (a.fase === "aviso") { if (a.t % 1.3 < dt) S.juntas(a.x, a.y); if (a.t > 5) { a.fase = "anda"; a.t = 0; } irAte(a, { x: cl(a.x, CERCA.x0 + 1, CERCA.x1 - 1), y: cl(a.y, CERCA.y0 + 1, CERCA.y1 - 1) }, 1, dt); a.passo += dt * 1.6; return; }
  if (a.fase === "anda") {
    const P = alvoPara(a.x, a.y);
    if (!a.alvo || dist(a, a.alvo) < .6) a.alvo = { x: cl(P.eu.x + rnd(-6, 6), CERCA.x0 + 1, CERCA.x1 - 1), y: cl(P.eu.y + rnd(-5, 5), CERCA.y0 + 1, CERCA.y1 - 1) };
    irAte(a, a.alvo, 1.35, dt); a.passo += dt * 2.2;
    let viu = 0, quem = null;
    for (const J of jogadores()) { if (J.dentro || J.caido || noMilharal(J.eu)) continue; const d = dist(J.eu, a); if (d > 11) continue;
      const v = ((J.lanterna ? 1.3 : 0) + (J.eu.anda > .15 ? (J.correndo ? 1.2 : .7) : 0)) * (1 - d / 11); if (v > viu) { viu = v; quem = J; } }
    a.alerta = cl(a.alerta + (viu ? viu * .85 : -.22) * dt, 0, 1);
    if (a.t % 1.6 < dt) S.juntas(a.x, a.y, .6);
    if (a.alerta >= 1 && quem) { a.fase = "ataque"; a.t = 0; a.quem = quem === R ? 0 : 1; S.gritoAranha(a.x, a.y); R.tremor = .8; efeito("Ela te viu!", "#e2483d"); }
    if (a.t > 30) { a.fase = "sai"; a.t = 0; a.alvo = BORDA(); }
    return;
  }
  if (a.fase === "ataque") {
    const P = a.quem ? (R.outro || R) : R; const alvo = P.dentro ? { x: CASA.porta.x, y: CASA.porta.y + 1.2 } : P.eu;
    irAte(a, alvo, 6.1, dt); a.passo += dt * 7; if (a.t % .9 < dt) S.juntas(a.x, a.y, 1);
    if (!P.dentro && !P.caido && dist(a, P.eu) < 1.25) comJogador(P, () => morrer("aranha", "A Pernuda te viu. Lá do alto, a boca abriu até o chão.", "Quando as juntas estalarem, apague a lanterna e fique parada. Ou se esconda no milharal."));
    if (P.caido || (P.dentro && a.t > 5) || a.t > 13) { a.fase = "sai"; a.t = 0; a.alvo = BORDA(); }
    return;
  }
  if (a.fase === "sai") { irAte(a, a.alvo || BORDA(), 2.2, dt); a.passo += dt * 3; if (a.t > 9) { a.fase = "longe"; a.hoje = false; efeito("As juntas se afastaram...", "#9aa8c8"); } }
}
/* Mula-sem-cabeça: avisa com o chão brilhando em linha reta e passa como um raio. */
function atualizarMula(dt) {
  const m = R.mula; if (R.tutorial === 0) return; m.t += dt;
  if (m.fase === "longe") { if (!m.hoje || !ehNoite() || m.vezes >= (m.max || 3)) return; m.prox -= dt; if (m.prox > 0) return;
    const P = alvoPara(rnd(CERCA.x0, CERCA.x1), rnd(CERCA.y0, CERCA.y1)); const fora = !P.dentro && !P.caido;
    m.horiz = Math.random() < .6; m.linha = m.horiz ? (fora ? P.eu.y : rnd(CERCA.y0 + 2, CERCA.y1 - 2)) : (fora ? P.eu.x : rnd(CERCA.x0 + 2, CERCA.x1 - 2)); m.dir = Math.random() < .5 ? 1 : -1;
    m.fase = "aviso"; m.t = 0; S.porcos(); S.galope(m.horiz ? (m.dir > 0 ? CERCA.x0 : CERCA.x1) : m.linha, m.horiz ? m.linha : (m.dir > 0 ? CERCA.y0 : CERCA.y1), 6); efeito("Os porcos estão gritando...", "#f2a33a"); return; }
  const ini = m.horiz ? (m.dir > 0 ? CERCA.x0 - 3 : CERCA.x1 + 3) : (m.dir > 0 ? CERCA.y0 - 3 : CERCA.y1 + 3), fim = m.horiz ? (m.dir > 0 ? CERCA.x1 + 3 : CERCA.x0 - 3) : (m.dir > 0 ? CERCA.y1 + 3 : CERCA.y0 - 3);
  if (m.fase === "aviso") { m.pos = ini; if (m.t > 2.6) { m.fase = "corre"; m.t = 0; m.x = m.horiz ? ini : m.linha; m.y = m.horiz ? m.linha : ini; S.relincho(m.horiz ? ini : m.linha, m.horiz ? m.linha : ini); } }
  else if (m.fase === "corre") {
    const antes = m.pos; m.pos += m.dir * 15 * dt; m.x = m.horiz ? m.pos : m.linha; m.y = m.horiz ? m.linha : m.pos;
    if (m.t % .22 < dt) S.galope(m.x, m.y, 1);
    for (let q = Math.min(antes, m.pos); q <= Math.max(antes, m.pos); q += .5) R.queimado.push({ x: m.horiz ? q : m.linha + rnd(-.3, .3), y: m.horiz ? m.linha + rnd(-.3, .3) : q, t: 0 });
    for (const k of R.canteiros) k.covas.forEach((cv2, i) => { if (!cv2) return; const cx = k.x + i % k.w + .5, cy = k.y + Math.floor(i / k.w) + .5, ao = m.horiz ? cy : cx, ao2 = m.horiz ? cx : cy;
      if (Math.abs(ao - m.linha) < .7 && (ao2 - antes) * (ao2 - m.pos) <= 0) { k.covas[i] = null; R.fx.push({ txt: "Queimou!", cor: "#f2a33a", t: 0, x: cx, y: cy }); } });
    for (const J of jogadores()) { if (J.dentro || J.caido) continue; if (Math.abs((m.horiz ? J.eu.y : J.eu.x) - m.linha) < .75 && Math.abs((m.horiz ? J.eu.x : J.eu.y) - m.pos) < 1.1) comJogador(J, () => morrer("mula", "A mula-sem-cabeça passou por cima de você.", "Quando o chão brilhar em linha reta, saia da linha. Ela não faz curva.")); }
    if ((m.pos - fim) * m.dir > 0) { m.fase = "longe"; m.prox = rnd(10, 55); m.vezes++; }
  }
}
/* Saci: redemoinho de dia. Seca a plantação e rouba moedas. Com peneira, dá para pegar. */
function atualizarSaci(dt) {
  const s = R.saci; if (R.tutorial === 0) return; s.t += dt; s.giro = (s.giro || 0) + dt * 9;
  if (s.fase === "longe") { if (ehNoite() || R.dia < 2 || s.pego) return; s.prox -= dt; if (s.prox > 0) return; Object.assign(s, BORDA(), { fase: "anda", t: 0, alvo: null, secou: 0 }); S.assobio(s.x, s.y); efeito("Um assobio no vento...", "#e8e2d4"); return; }
  if (s.fase === "anda") {
    if (!s.alvo || dist(s, s.alvo) < .4) { const pl = []; R.canteiros.forEach(k => k.covas.forEach((cv2, i) => { if (cv2 && cv2.est < 3) pl.push({ x: k.x + i % k.w + .5, y: k.y + Math.floor(i / k.w) + .5 }); }));
      const P = alvoPara(s.x, s.y); s.alvo = pl.length && Math.random() < .7 ? pl[Math.floor(Math.random() * pl.length)] : { x: P.eu.x + rnd(-1, 1), y: P.eu.y + rnd(-1, 1) }; }
    irAte(s, { x: s.alvo.x + Math.sin(s.t * 3) * .6, y: s.alvo.y + Math.cos(s.t * 2.4) * .4 }, 2.7, dt);
    if (Math.random() < dt * 8) R.poeira.push({ x: s.x + rnd(-.3, .3), y: s.y, t: 0 });
    R.canteiros.forEach(k => k.covas.forEach((cv2, i) => { if (!cv2 || cv2.est >= 3 || cv2.seca) return; if (Math.hypot(k.x + i % k.w + .5 - s.x, k.y + Math.floor(i / k.w) + .5 - s.y) < .7) { cv2.seca = true; cv2.t = 0; if (s.t - s.secou > 3) { s.secou = s.t; R.fx.push({ txt: "Secou!", cor: "#d8b860", t: 0, x: s.x, y: s.y }); } } }));
    if (s.t % 3.4 < dt) S.assobio(s.x, s.y);
    for (const J of jogadores()) { if (J.dentro || J.caido || dist(J.eu, s) > .8) continue;
      if (R.peneira) { R.moedas += 30; s.pego = true; s.fase = "longe"; s.prox = 999; S.risada(s.x, s.y); S.moedas(); R.fx.push({ txt: "Pegou o Saci na peneira! +30", cor: "#f2c94a", t: 0, x: s.x, y: s.y }); hud(); return; }
      const n = Math.min(15, Math.ceil(R.moedas * .15)); R.moedas -= n; S.risada(s.x, s.y); R.fx.push({ txt: n ? `O Saci levou ${n} moedas!` : "O Saci riu de você", cor: "#e2483d", t: 0, x: s.x, y: s.y }); s.fase = "sai"; s.t = 0; s.alvo = BORDA(); hud(); return; }
    if (s.t > 38 || ehNoite()) { s.fase = "sai"; s.t = 0; s.alvo = BORDA(); }
    return;
  }
  if (s.fase === "sai") { irAte(s, s.alvo, 4, dt); if (s.t > 5) { s.fase = "longe"; s.prox = rnd(30, 170); } }
}
/* Espantalho: só anda no escuro. Com a luz da lanterna em cima, congela. */
function atualizarEspantalho(dt) {
  const e = R.esp; if (R.tutorial === 0) return; e.t += dt;
  const ativo = ehNoite() && R.dia >= 2 && progNoite() > (e.limiar || .3) && !e.dorme;
  if (!ativo) { if (e.fase === "vivo") { e.fase = "volta"; } if (e.fase === "volta") { if (irAte(e, ESPANTALHO, 3, dt) < .1) e.fase = "poste"; } return; }
  const P = alvoPara(e.x, e.y), d = dist(e, P.eu);
  if (e.fase === "poste" || e.fase === "volta") { if (!P.dentro && !P.caido && d < 8) { e.fase = "vivo"; e.t = 0; S.palha(e.x, e.y); } return; }
  e.luz = jogadores().some(J => J.lanterna && !J.dentro && dist(J.eu, e) < raioLuz(J) + .3);
  e.parado = e.luz || R.aranha.fase === "anda" || R.aranha.fase === "ataque";
  if (e.parado) return;
  const alvo = P.dentro ? { x: CASA.porta.x, y: CASA.porta.y + 1.3 } : P.eu, pulo = .5 + .9 * Math.abs(Math.sin(e.t * 4));
  irAte(e, alvo, 2.1 * pulo, dt); if (e.t % .55 < dt) S.palha(e.x, e.y);
  if (!P.dentro && !P.caido && dist(e, P.eu) < .8) comJogador(P, () => morrer("esp", "O espantalho te pegou no escuro.", "Ilumine o espantalho com a lanterna: com a luz em cima ele não se mexe. O sino da capela manda ele de volta."));
}
function tocarSino() {
  if (!ehNoite()) return efeito("O sino está frio. De noite ele serve para alguma coisa.", "#e8e2d4");
  if (R.sinoUsado) return efeito("O sino já tocou esta noite", "#e8e2d4");
  R.sinoUsado = true; R.sinoT = 4; S.sinoCapela(CAPELA.porta.x, CAPELA.y);
  if (R.seco.fase === "aviso" || R.seco.fase === "anda") { R.seco.fase = "sai"; R.seco.t = 0; S.suspiro(R.seco.x, R.seco.y); }
  if (R.esp.fase === "vivo") { R.esp.fase = "volta"; } R.esp.dorme = true;
  efeito("O sino ecoou pela mata", "#f2c94a");
}
function atualizarBichos(dt) {
  if (R.sinoT > 0) R.sinoT -= dt;
  R.queimado.forEach(q => q.t += dt); R.queimado = R.queimado.filter(q => q.t < 3.5);
  R.porcos.forEach(g => { g.t -= dt; if (!g.alvo || g.t <= 0) { g.alvo = { x: rnd(CHIQUEIRO.x0 + .6, CHIQUEIRO.x1 - .6), y: rnd(CHIQUEIRO.y0 + 1.4, CHIQUEIRO.y1 - .4) }; g.t = rnd(2, 5); } g.anda = irAte(g, g.alvo, .7, dt) > .1 ? 1 : 0;
    if (Math.random() < dt * .03) { const [v, pn] = somEm(g.x, g.y); tocarTom(rnd(180, 240), .25, { tipo: "sawtooth", vol: .02 * v, ate: 140, lp: 700, pan: pn }); } });
  if (ehNoite() && Math.random() < dt * .05 && dist(R.eu, BALANCO) < 9) { const [v, pn] = somEm(BALANCO.x, BALANCO.y); tocarTom(420, .7, { tipo: "sawtooth", vol: .025 * v, ate: 300, lp: 1200, pan: pn, wet: .6 }); } // o balanço range sozinho
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
// Yasmin (e quem joga com ela): menina de tranças, jardineira e chapéu. q = jogador desenhado.
const ROUPAS = [{ jard: "#b8485a", jard2: "#963848", blusa: "#e8c860", cabelo: "#3a2216", fita: "#e2483d", pele: "#e8c0a0" }, { jard: "#3a6a9a", jard2: "#2e5478", blusa: "#e8e4d8", cabelo: "#1a1210", fita: "#f2c94a", pele: "#c8946a" }];
function desenharVoce(x, y, tm, o = {}) {
  const q = o.q || R, s = (o.s || TS) / 48, e = q.eu, dir = o.dir ?? (q.dentro ? (q.sala && q.sala.dir) || 1 : e.dir || 1), andaK = o.anda ?? (e.anda || 0), f = e.fase || 0, p = q.perto || 0, rp = ROUPAS[q.cor || 0];
  const ch = (COSMETICOS.find(k => k[0] === q.chapeu) || COSMETICOS[0])[3];
  if (q.caido) { // desmaiada no chão
    sombra(x, y, 16 * s, 5 * s); c.save(); c.translate(x, y); c.scale(s, s);
    c.fillStyle = rp.jard; c.fillRect(-12, -9, 18, 8); c.fillStyle = rp.blusa; c.fillRect(4, -9, 6, 8); c.fillStyle = rp.pele; c.beginPath(); c.arc(14, -6, 6, 0, 7); c.fill(); c.fillStyle = rp.cabelo; c.beginPath(); c.arc(16, -7, 6, PI * .6, PI * 1.9); c.fill(); c.fillRect(17, -3, 9, 3);
    c.fillStyle = "#2a1a12"; c.fillRect(-18, -6, 7, 4); c.strokeStyle = "#1a1210"; c.lineWidth = 1; c.beginPath(); c.moveTo(12, -7); c.lineTo(14, -5); c.moveTo(14, -7); c.lineTo(12, -5); c.stroke();
    c.fillStyle = `rgba(226,72,61,${.5 + .3 * Math.sin(tm * 4)})`; c.font = `800 ${Math.round(11)}px "Big Shoulders Display", sans-serif`; c.textAlign = "center"; c.fillText(q.caido.fora ? "SEM VIDAS" : q === R ? "VOCÊ CAIU" : "AJUDE!", 0, -22); c.textAlign = "start"; c.restore(); return;
  }
  sombra(x, y, 13 * s, 4.5 * s);
  c.save(); c.translate(x, y); c.scale(dir * s, s);
  const sw = Math.sin(f) * 7 * andaK, bob = Math.abs(Math.cos(f)) * 2 * andaK, tremeK = p > .6 ? Math.sin(tm * 40) * .8 : 0;
  c.translate(tremeK, 0);
  // trança de trás (balança quando anda)
  const tr = Math.sin(f * .5 + tm * 2) * 2 * (andaK + .3);
  c.fillStyle = rp.cabelo; for (let i = 0; i < 4; i++) { c.beginPath(); c.ellipse(-7 - i * .6 + tr * i * .3, -36 - bob + i * 4, 2.6, 2.4, 0, 0, 7); c.fill(); } c.fillStyle = rp.fita; c.fillRect(-9.5 + tr, -21 - bob, 4, 2.5);
  c.fillStyle = "#7a4a28"; c.beginPath(); c.roundRect ? c.roundRect(-13, -32 - bob, 7, 14, 2.5) : c.rect(-13, -32 - bob, 7, 14); c.fill(); c.fillStyle = "#5a3418"; c.fillRect(-13, -32 - bob, 7, 4); c.fillStyle = "#f2c94a"; c.fillRect(-10.2, -28.6 - bob, 1.4, 1.4); c.fillStyle = "#5a3418"; c.fillRect(-12.5, -23 - bob, 6, 4); // mochila
  // pernas, meias e botinhas
  c.fillStyle = rp.pele; c.fillRect(-5 + sw * .4, -12, 4, 9); c.fillRect(1 - sw * .4, -12, 4, 9);
  c.fillStyle = "#e8e4d8"; c.fillRect(-5 + sw * .4, -6, 4, 3); c.fillRect(1 - sw * .4, -6, 4, 3);
  c.fillStyle = "#5a2a1a"; c.fillRect(-6 + sw * .4, -3, 6, 3); c.fillRect(0 - sw * .4, -3, 6, 3);
  // jardineira com saia
  c.fillStyle = rp.blusa; c.beginPath(); c.roundRect ? c.roundRect(-8, -31 - bob, 16, 12, 4) : c.rect(-8, -31 - bob, 16, 12); c.fill();
  c.fillStyle = rp.jard; c.beginPath(); c.moveTo(-6, -26 - bob); c.lineTo(6, -26 - bob); c.lineTo(10, -11 - bob * .5); c.lineTo(-10, -11 - bob * .5); c.closePath(); c.fill();
  c.fillStyle = rp.jard2; c.fillRect(-10, -13 - bob * .5, 20, 2.5); c.fillRect(-3, -23 - bob, 6, 5); // barra e bolso
  c.fillStyle = rp.jard; c.fillRect(-6, -31 - bob, 3, 6); c.fillRect(3, -31 - bob, 3, 6); c.fillStyle = "#e8d070"; c.fillRect(-5.5, -26.5 - bob, 2, 2); c.fillRect(3.5, -26.5 - bob, 2, 2);
  // braços
  const braco = q.regando > 0 ? -1.1 : Math.sin(f + PI) * .5 * andaK;
  [[7, braco], [-7, -Math.sin(f + PI) * .5 * andaK]].forEach(([bx, rot]) => { c.save(); c.translate(bx, -29 - bob); c.rotate(rot); c.fillStyle = rp.blusa; c.fillRect(-2.5, 0, 5, 5); c.fillStyle = rp.pele; c.fillRect(-2, 5, 4, 6); c.restore(); });
  if (q.regando > 0) { c.fillStyle = "#8a9aa8"; c.fillRect(12, -24 - bob, 9, 6); c.fillRect(20, -25 - bob, 6, 2); c.fillStyle = "rgba(120,190,230,.8)"; for (let i = 0; i < 4; i++) c.fillRect(25 + i * 2, -22 - bob + ((tm * 60 + i * 5) % 14), 1.5, 3); }
  else if (q.lanterna && !q.dentro) { c.strokeStyle = "#2a2a2a"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(10, -18 - bob); c.lineTo(10, -14 - bob); c.stroke(); c.fillStyle = "#3a3a3a"; c.fillRect(7, -14 - bob, 7, 8); c.fillStyle = "rgba(255,220,140,.95)"; c.fillRect(8.5, -12.5 - bob, 4, 5); }
  // cabeça
  c.fillStyle = rp.pele; c.beginPath(); c.arc(0, -38 - bob, 8.2, 0, 7); c.fill();
  c.fillStyle = rp.cabelo; c.beginPath(); c.arc(-1, -39.5 - bob, 8.6, PI * .95, PI * 2.12); c.fill(); c.beginPath(); c.ellipse(-6, -36 - bob, 3.4, 6, .2, 0, 7); c.fill(); // franja e lateral
  c.fillStyle = rp.pele; c.beginPath(); c.ellipse(3.5, -36.5 - bob, 5.2, 5, 0, 0, 7); c.fill(); // rosto
  c.fillStyle = "#1a1210"; const ol = 1.4 + p * 1.2; c.beginPath(); c.arc(2.6, -38 - bob, ol, 0, 7); c.arc(6.6, -38 - bob, ol * .9, 0, 7); c.fill(); c.fillStyle = "#fff"; c.beginPath(); c.arc(3, -38.6 - bob, .55, 0, 7); c.arc(7, -38.6 - bob, .5, 0, 7); c.fill();
  c.strokeStyle = "#1a1210"; c.lineWidth = .9; c.beginPath(); c.moveTo(1.4, -40.4 - bob); c.lineTo(2.4, -40.9 - bob); c.moveTo(6, -40.9 - bob); c.lineTo(7.2, -40.4 - bob); c.stroke(); // cílios
  if (p > .45) { c.fillStyle = "#1a1210"; c.beginPath(); c.ellipse(4.6, -33.6 - bob, 1.4, 2.1, 0, 0, 7); c.fill(); c.fillStyle = "rgba(160,200,230,.85)"; c.fillRect(1.5, -37 - bob + ((tm * 20) % 6), 1.3, 2.4); }
  else { c.strokeStyle = "#8a3a2a"; c.lineWidth = 1.1; c.beginPath(); c.arc(4.6, -34.6 - bob, 1.7, .2, PI - .2); c.stroke(); }
  c.fillStyle = "rgba(230,110,100,.4)"; c.beginPath(); c.arc(.6, -35 - bob, 1.8, 0, 7); c.arc(8, -35 - bob, 1.4, 0, 7); c.fill();
  // chapéu de aba larga (cosmético)
  c.fillStyle = ch; c.beginPath(); c.ellipse(0, -45 - bob, 14, 3.6, 0, 0, 7); c.fill(); c.beginPath(); c.ellipse(0, -48.5 - bob, 7.5, 5.5, 0, PI, 0); c.fill(); c.fillRect(-7.5, -48.5 - bob, 15, 4);
  c.fillStyle = rp.fita; c.fillRect(-7.5, -46.6 - bob, 15, 1.8); c.fillStyle = "#e8e2d8"; c.beginPath(); c.arc(6.5, -46 - bob, 1.8, 0, 7); c.fill(); // fitinha e florzinha
  c.strokeStyle = "rgba(0,0,0,.15)"; c.lineWidth = .8; for (let i = -12; i < 13; i += 4) { c.beginPath(); c.moveTo(i, -46 - bob); c.lineTo(i * .9, -44 - bob); c.stroke(); }
  c.restore();
  if (o.nome) { c.fillStyle = "rgba(240,235,220,.85)"; c.font = `700 ${Math.round(Math.max(10, TS * .2))}px "JetBrains Mono", monospace`; c.textAlign = "center"; c.strokeStyle = "rgba(0,0,0,.6)"; c.lineWidth = 3; c.strokeText(o.nome, x, y - 58 * s); c.fillText(o.nome, x, y - 58 * s); c.textAlign = "start"; }
}
function desenharGato(g, tm) {
  const s = TS / 48, x = PX(g.x), y = PY(g.y); sombra(x, y, 9 * s, 3 * s);
  c.save(); c.translate(x, y); c.scale((g.dir || 1) * s, s); const pa = g.anda ? Math.sin(tm * 14) * 2 : 0;
  c.fillStyle = "#2a2a30"; c.fillRect(-7 + pa, -5, 2.5, 5); c.fillRect(4 - pa, -5, 2.5, 5);
  c.beginPath(); c.ellipse(0, -8, 9, 5, 0, 0, 7); c.fill(); c.beginPath(); c.arc(8, -13, 5, 0, 7); c.fill();
  c.beginPath(); c.moveTo(5, -16); c.lineTo(6, -21); c.lineTo(9, -17); c.moveTo(9, -17); c.lineTo(12, -21); c.lineTo(12, -15); c.fill();
  c.strokeStyle = "#2a2a30"; c.lineWidth = 3; c.lineCap = "round"; c.beginPath(); c.moveTo(-8, -9); c.quadraticCurveTo(-15, -14 + Math.sin(tm * 2) * 3, -13, -20); c.stroke();
  c.fillStyle = "#c8e86a"; c.fillRect(9, -14, 1.6, 1.6); c.fillRect(12, -14, 1.6, 1.6); c.fillStyle = "#d88a8a"; c.fillRect(12.5, -11.5, 1.2, 1);
  c.fillStyle = "#e86a9a"; c.beginPath(); c.moveTo(5, -10); c.lineTo(2.5, -12.5); c.lineTo(2.5, -7.5); c.closePath(); c.moveTo(5, -10); c.lineTo(7.5, -12.5); c.lineTo(7.5, -7.5); c.closePath(); c.fill(); c.fillStyle = "#c84a7a"; c.beginPath(); c.arc(5, -10, 1.2, 0, 7); c.fill(); // lacinho da Sombrinha
  c.strokeStyle = "rgba(230,230,230,.5)"; c.lineWidth = .6; c.beginPath(); c.moveTo(12, -12); c.lineTo(16, -13); c.moveTo(12, -11.4); c.lineTo(16, -11); c.stroke(); // bigodes
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
/* ---------- lado leste e detalhes novos ---------- */
function desenharCapela(tm) {
  const x = PX(CAPELA.x), y = PY(CAPELA.y), w = CAPELA.w * TS, h = CAPELA.h * TS; if (!naTela(x + w / 2, y + h / 2, w * 1.4)) return;
  sombra(x + w / 2, y + h + 3, w * .6, TS * .28, .35);
  c.fillStyle = "#b8b0a0"; c.fillRect(x, y + h * .12, w, h * .88); // parede caiada, suja
  c.fillStyle = "rgba(70,60,40,.35)"; for (let i = 0; i < 7; i++) { c.beginPath(); c.ellipse(x + w * ((i * .37) % 1), y + h * (.4 + (i % 3) * .18), w * .12, h * .06, 0, 0, 7); c.fill(); } // manchas e mofo
  c.strokeStyle = "rgba(40,30,20,.5)"; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x + w * .15, y + h * .3); c.lineTo(x + w * .22, y + h * .5); c.lineTo(x + w * .18, y + h * .7); c.moveTo(x + w * .82, y + h * .2); c.lineTo(x + w * .76, y + h * .42); c.stroke(); // rachaduras
  c.fillStyle = "#5a3020"; c.beginPath(); c.moveTo(x - TS * .25, y + h * .18); c.lineTo(x + w / 2, y - TS * 1.1); c.lineTo(x + w + TS * .25, y + h * .18); c.closePath(); c.fill(); // telhado
  c.strokeStyle = "#3a1e12"; c.lineWidth = 2; for (let i = 1; i < 5; i++) { const k = i / 5; c.beginPath(); c.moveTo(mix(x - TS * .25, x + w / 2, k), mix(y + h * .18, y - TS * 1.1, k)); c.lineTo(mix(x + w + TS * .25, x + w / 2, k), mix(y + h * .18, y - TS * 1.1, k)); c.stroke(); }
  // torre do sino
  const tx = x + w / 2, ty = y - TS * 1.05; c.fillStyle = "#b8b0a0"; c.fillRect(tx - TS * .42, ty - TS * 1.1, TS * .84, TS * 1.1); c.fillStyle = "#14100c"; c.beginPath(); c.moveTo(tx - TS * .26, ty - TS * .15); c.lineTo(tx - TS * .26, ty - TS * .7); c.arc(tx, ty - TS * .7, TS * .26, PI, 0); c.lineTo(tx + TS * .26, ty - TS * .15); c.fill();
  const bal = R.sinoT > 0 ? Math.sin(tm * 9) * .5 * Math.min(1, R.sinoT) : Math.sin(tm * .8) * .03; c.save(); c.translate(tx, ty - TS * .9); c.rotate(bal); c.fillStyle = "#8a6a2a"; c.beginPath(); c.moveTo(-TS * .16, TS * .36); c.quadraticCurveTo(-TS * .16, 0, 0, 0); c.quadraticCurveTo(TS * .16, 0, TS * .16, TS * .36); c.fill(); c.fillStyle = "#5a4418"; c.beginPath(); c.arc(0, TS * .38, 3, 0, 7); c.fill(); c.restore();
  c.fillStyle = "#5a3020"; c.beginPath(); c.moveTo(tx - TS * .55, ty - TS * 1.05); c.lineTo(tx, ty - TS * 1.5); c.lineTo(tx + TS * .55, ty - TS * 1.05); c.fill();
  c.fillStyle = "#3a2a1a"; c.fillRect(tx - 2, ty - TS * 2.1, 4, TS * .62); c.fillRect(tx - TS * .17, ty - TS * 1.9, TS * .34, 4); // cruz
  // porta em arco entreaberta e janelinhas
  const px = x + w / 2, py = y + h; c.fillStyle = "#0c0806"; c.beginPath(); c.moveTo(px - TS * .45, py); c.lineTo(px - TS * .45, py - TS * .9); c.arc(px, py - TS * .9, TS * .45, PI, 0); c.lineTo(px + TS * .45, py); c.fill();
  c.fillStyle = "#4a2a18"; c.beginPath(); c.moveTo(px - TS * .45, py); c.lineTo(px - TS * .45, py - TS * .9); c.arc(px, py - TS * .9, TS * .45, PI, PI * 1.5); c.lineTo(px - TS * .1, py); c.fill();
  [[.16, .4], [.72, .4]].forEach(([fx, fy]) => { c.fillStyle = horaNoite() > .5 && Math.sin(tm * .5 + fx * 9) > .9 ? "rgba(255,200,120,.8)" : "#1a2030"; c.beginPath(); c.moveTo(x + w * fx, y + h * (fy + .2)); c.lineTo(x + w * fx, y + h * fy); c.arc(x + w * (fx + .06), y + h * fy, w * .06, PI, 0); c.lineTo(x + w * (fx + .12), y + h * (fy + .2)); c.fill(); });
  for (let i = 0; i < 4; i++) { c.fillStyle = "#e8e2d0"; c.fillRect(px - TS * .9 + i * TS * .55, py + 2, 4, -8); c.fillStyle = `rgba(255,200,90,${.6 + .3 * Math.sin(tm * 11 + i)})`; c.beginPath(); c.ellipse(px - TS * .9 + i * TS * .55 + 2, py - 9, 1.6, 3, 0, 0, 7); c.fill(); } // velinhas na entrada
}
function milhoPes() { // pés de milho em fileiras (cada um vira um objeto para o milharal esconder quem passa)
  const l = []; for (let y = MILHARAL.y0 + .45; y < MILHARAL.y1; y += .5) for (let x = MILHARAL.x0 + .3; x < MILHARAL.x1; x += .62) l.push({ x: x + Math.sin(y * 7 + x) * .12, y, k: (Math.sin(x * 13 + y * 7) + 1) / 2 }); return l;
}
let PES_MILHO = null;
function desenharPeMilho(m, tm) {
  const x = PX(m.x), y = PY(m.y); if (!naTela(x, y, 60)) return; const h = TS * (1.3 + m.k * .35), bal = Math.sin(tm * 1.6 + m.x * .8 + m.y) * TS * .06 * (1 + (R.aranha.fase === "anda" ? 1.5 : 0));
  c.strokeStyle = m.k > .5 ? "#8a8a3a" : "#7a7a30"; c.lineWidth = 2.4; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + bal * .5, y - h * .5, x + bal, y - h); c.stroke();
  c.strokeStyle = m.k > .3 ? "#9a9a44" : "#6a7a2a"; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x, y - h * .35); c.quadraticCurveTo(x - TS * .25, y - h * .45, x - TS * .32 + bal, y - h * .25); c.moveTo(x, y - h * .55); c.quadraticCurveTo(x + TS * .25, y - h * .68, x + TS * .32 + bal, y - h * .48); c.moveTo(x, y - h * .75); c.quadraticCurveTo(x - TS * .2, y - h * .9, x - TS * .26 + bal, y - h * .72); c.stroke();
  if (m.k > .55) { c.fillStyle = "#d8b850"; c.beginPath(); c.ellipse(x + 3 + bal * .6, y - h * .6, 2.4, 5, .35, 0, 7); c.fill(); }
  c.strokeStyle = "#c8a860"; c.lineWidth = 1; c.beginPath(); c.moveTo(x + bal, y - h); c.lineTo(x + bal - 3, y - h - 5); c.moveTo(x + bal, y - h); c.lineTo(x + bal + 3, y - h - 5); c.stroke();
}
function desenharChiqueiro(tm, ce) {
  const C = CHIQUEIRO, l = [];
  for (let x = C.x0; x <= C.x1 + .01; x += 1) { l.push([C.y0, () => ce.post(x, C.y0)]); l.push([C.y1, () => ce.post(x, C.y1)]); if (x + 1 <= C.x1 + .01) { l.push([C.y0, () => ce.trilho(x, C.y0, x + 1, C.y0)]); l.push([C.y1, () => ce.trilho(x, C.y1, x + 1, C.y1)]); } }
  for (let y = C.y0; y <= C.y1 + .01; y += 1.1) { l.push([y, () => ce.post(C.x0, y)]); l.push([y, () => ce.post(C.x1, y)]); }
  l.push([C.y0 + 1.2, () => { const x = PX(C.x1 - 2), y = PY(C.y0 + 1.2); if (!naTela(x, y)) return; c.fillStyle = "#5a3e24"; c.fillRect(x - TS * .9, y - TS * 1.1, 4, TS * 1.1); c.fillRect(x + TS * .9, y - TS * 1.1, 4, TS * 1.1); c.fillStyle = "#6a4a2a"; c.beginPath(); c.moveTo(x - TS * 1.1, y - TS * 1); c.lineTo(x, y - TS * 1.45); c.lineTo(x + TS * 1.1, y - TS * 1); c.fill(); c.fillStyle = "#3a2a1a"; c.fillRect(x - TS * .7, y - TS * .25, TS * 1.4, TS * .25); c.fillStyle = "#6a5a3a"; c.fillRect(x - TS * .6, y - TS * .22, TS * 1.2, TS * .1); }]); // abrigo e cocho
  R.porcos.forEach(g => l.push([g.y, () => desenharPorco(g, tm)]));
  return l;
}
function desenharPorco(g, tm) {
  const s = TS / 48, x = PX(g.x), y = PY(g.y); if (!naTela(x, y, 40)) return; sombra(x, y, 12 * s, 3.5 * s);
  c.save(); c.translate(x, y); c.scale((g.dir || 1) * s, s); const pa = g.anda ? Math.sin(tm * 10) * 1.6 : 0, medo = R.mula.fase === "aviso" ? Math.sin(tm * 50) * 1.2 : 0; c.translate(medo, 0);
  c.fillStyle = "#c88a88"; c.fillRect(-9 + pa, -6, 3.5, 6); c.fillRect(5 - pa, -6, 3.5, 6); c.fillRect(-4 - pa, -6, 3, 5); c.fillRect(1 + pa, -6, 3, 5);
  c.fillStyle = "#e8a8a4"; c.beginPath(); c.ellipse(0, -10, 12, 7, 0, 0, 7); c.fill(); c.fillStyle = "rgba(90,60,30,.55)"; c.beginPath(); c.ellipse(-4, -7, 5, 3, .3, 0, 7); c.ellipse(5, -12, 3, 2, 0, 0, 7); c.fill(); // lama
  c.fillStyle = "#e8a8a4"; c.beginPath(); c.arc(11, -12, 5.5, 0, 7); c.fill(); c.fillStyle = "#d88a88"; c.beginPath(); c.ellipse(16, -11, 2.6, 2.2, 0, 0, 7); c.fill(); c.fillStyle = "#8a4a48"; c.fillRect(15.4, -12, 1, 1); c.fillRect(17, -12, 1, 1);
  c.fillStyle = "#d88a88"; c.beginPath(); c.moveTo(8, -16); c.lineTo(9, -20); c.lineTo(12, -16.5); c.fill(); c.fillStyle = "#1a1210"; c.fillRect(12.5, -14, 1.4, 1.4);
  c.strokeStyle = "#d88a88"; c.lineWidth = 1.4; c.beginPath(); c.arc(-13, -12, 2, 0, PI * 1.6); c.stroke(); c.restore();
}
function desenharColmeia(i, tm) {
  const [cx, cy] = COLMEIAS[i], x = PX(cx), y = PY(cy); if (!naTela(x, y)) return; sombra(x, y, TS * .32, TS * .1);
  c.fillStyle = "#5a3e24"; c.fillRect(x - TS * .28, y - TS * .12, TS * .56, TS * .12);
  ["#e8d8a0", "#d8c890", "#e8d8a0"].forEach((cor, k) => { c.fillStyle = cor; c.fillRect(x - TS * .26, y - TS * (.32 + k * .2), TS * .52, TS * .2); c.strokeStyle = "rgba(90,70,30,.5)"; c.lineWidth = 1; c.strokeRect(x - TS * .26, y - TS * (.32 + k * .2), TS * .52, TS * .2); });
  c.fillStyle = "#6a4a2a"; c.fillRect(x - TS * .32, y - TS * .78, TS * .64, TS * .08); c.fillStyle = "#1a1208"; c.fillRect(x - TS * .08, y - TS * .2, TS * .16, 3);
  if (!ehNoite()) for (let k = 0; k < 5; k++) { const a = tm * 3 + k * 1.3 + i; c.fillStyle = "#f2c94a"; c.fillRect(x + Math.cos(a) * TS * .45, y - TS * .5 + Math.sin(a * 1.7) * TS * .3, 2.5, 2); }
  if (R.mel[i]) { c.fillStyle = "#e8a020"; c.beginPath(); c.arc(x + TS * .2, y - TS * .22, 3, 0, 7); c.fill(); }
}
function desenharBalanco(tm) {
  const x = PX(BALANCO.x), y = PY(BALANCO.y); if (!naTela(x, y)) return; sombra(x, y, TS * .7, TS * .12);
  c.strokeStyle = "#5a3e24"; c.lineWidth = 4; c.beginPath(); c.moveTo(x - TS * .7, y); c.lineTo(x - TS * .55, y - TS * 1.6); c.lineTo(x - TS * .4, y); c.moveTo(x + TS * .7, y); c.lineTo(x + TS * .55, y - TS * 1.6); c.lineTo(x + TS * .4, y); c.moveTo(x - TS * .62, y - TS * 1.6); c.lineTo(x + TS * .62, y - TS * 1.6); c.stroke();
  const a = Math.sin(tm * 1.7) * (horaNoite() > .5 ? .45 : .06); c.save(); c.translate(x, y - TS * 1.58); c.rotate(a); c.strokeStyle = "#c8b890"; c.lineWidth = 1.2; c.beginPath(); c.moveTo(-TS * .22, 0); c.lineTo(-TS * .22, TS * 1.2); c.moveTo(TS * .22, 0); c.lineTo(TS * .22, TS * 1.2); c.stroke(); c.fillStyle = "#7a5a32"; c.fillRect(-TS * .28, TS * 1.18, TS * .56, 5); c.restore();
}
function desenharDecor(tm, qual) {
  if (qual === 0) { const x = PX(CARRIOLA.x), y = PY(CARRIOLA.y); if (naTela(x, y)) { sombra(x, y, TS * .45, TS * .1); c.fillStyle = "#6a6a6a"; c.beginPath(); c.moveTo(x - TS * .4, y - TS * .45); c.lineTo(x + TS * .2, y - TS * .45); c.lineTo(x + TS * .1, y - TS * .15); c.lineTo(x - TS * .32, y - TS * .15); c.fill(); c.fillStyle = "#4a3a2a"; c.beginPath(); c.ellipse(x - TS * .1, y - TS * .48, TS * .28, TS * .07, 0, 0, 7); c.fill(); c.fillStyle = "#1a1a1a"; c.beginPath(); c.arc(x + TS * .24, y - TS * .1, TS * .1, 0, 7); c.fill(); c.strokeStyle = "#5a3e24"; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x - TS * .35, y - TS * .3); c.lineTo(x - TS * .7, y - TS * .2); c.stroke(); } }
  if (qual === 1) { const x = PX(LENHA.x), y = PY(LENHA.y); if (naTela(x, y)) { sombra(x, y, TS * .55, TS * .12); for (let i = 0; i < 9; i++) { const r = i < 4 ? 0 : i < 7 ? 1 : 2, k = i < 4 ? i : i < 7 ? i - 4 : i - 7; const lx = x - TS * .36 + k * TS * .24 + r * TS * .12, ly = y - TS * (.1 + r * .19); c.fillStyle = "#6a4a2a"; c.beginPath(); c.arc(lx, ly, TS * .11, 0, 7); c.fill(); c.fillStyle = "#c8a070"; c.beginPath(); c.arc(lx, ly, TS * .07, 0, 7); c.fill(); c.strokeStyle = "rgba(90,60,30,.6)"; c.lineWidth = .8; c.beginPath(); c.arc(lx, ly, TS * .035, 0, 7); c.stroke(); } c.strokeStyle = "#8a8a8a"; c.lineWidth = 2; c.beginPath(); c.moveTo(x + TS * .45, y - TS * .7); c.lineTo(x + TS * .3, y - TS * .2); c.stroke(); c.fillStyle = "#8a8a8a"; c.fillRect(x + TS * .38, y - TS * .78, 9, 5); } } // e um machado
  FENOS.forEach(([fx, fy], i) => { if (qual !== 2 + i) return; const x = PX(fx), y = PY(fy); if (!naTela(x, y)) return; sombra(x, y, TS * .6, TS * .14); c.fillStyle = "#c8a850"; c.fillRect(x - TS * .55, y - TS * .7, TS * 1.1, TS * .7); c.fillStyle = "#d8b860"; c.beginPath(); c.ellipse(x - TS * .55, y - TS * .35, TS * .14, TS * .35, 0, 0, 7); c.fill(); c.strokeStyle = "rgba(120,90,30,.6)"; c.lineWidth = 1; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(x - TS * .4 + i * TS * .17, y - TS * .7); c.lineTo(x - TS * .44 + i * TS * .17, y); c.stroke(); } c.strokeStyle = "#8a2a1e"; c.lineWidth = 2; c.beginPath(); c.moveTo(x - TS * .1, y - TS * .7); c.lineTo(x - TS * .1, y); c.moveTo(x + TS * .25, y - TS * .7); c.lineTo(x + TS * .25, y); c.stroke(); });
}
function desenharRiacho(tm) {
  const x0 = PX(RIACHO.x0), x1 = PX(RIACHO.x1); if (x1 < -20 || x0 > W + 20) return;
  c.strokeStyle = "rgba(200,230,240,.25)"; c.lineWidth = 1.2; for (let i = 0; i < 26; i++) { const yy = ((tm * .9 + i * 1.3) % (CERCA.y1 - CERCA.y0 + 2)) + CERCA.y0 - 1; if (PONTES.some(p => Math.abs(yy - p) < .9)) continue; const xx = mix(RIACHO.x0, RIACHO.x1, ((i * .37) % 1) * .7 + .15); c.beginPath(); c.moveTo(PX(xx), PY(yy)); c.lineTo(PX(xx + .1), PY(yy + .35)); c.stroke(); }
  if (horaNoite() > .5 && Math.sin(tm * .27) > .96) { c.fillStyle = "rgba(230,230,230,.6)"; const yy = PY(19 + Math.sin(tm) * 2); c.fillRect(PX(47.6), yy, 2.5, 2.5); c.fillRect(PX(48.05), yy, 2.5, 2.5); } // olhos no riacho
}
function desenharEspantalho(e, tm) {
  const x = PX(e.x), y = PY(e.y); if (!naTela(x, y)) return; const vivo = e.fase === "vivo" && !e.parado, tr = vivo ? Math.sin(tm * 30) * 1.5 : 0, inc = vivo ? Math.sin(tm * 8) * .12 : 0;
  if (e.fase !== "poste") { const px = PX(ESPANTALHO.x), py = PY(ESPANTALHO.y); c.fillStyle = "#5a3a22"; c.fillRect(px - 2, py - TS * 1.2, 4, TS * 1.2); c.fillRect(px - TS * .4, py - TS * .95, TS * .8, 4); }
  sombra(x, y, TS * .3, TS * .1); c.save(); c.translate(x + tr, y); c.rotate(inc);
  if (e.fase === "poste") { c.fillStyle = "#5a3a22"; c.fillRect(-2, -TS * 1.2, 4, TS * 1.2); c.fillRect(-TS * .4, -TS * .95, TS * .8, 4); }
  else { c.strokeStyle = "#5a4a30"; c.lineWidth = 3; const pe = vivo ? Math.sin(tm * 9) * TS * .12 : 0; c.beginPath(); c.moveTo(0, -TS * .5); c.lineTo(-TS * .12 + pe, 0); c.moveTo(0, -TS * .5); c.lineTo(TS * .12 - pe, 0); c.stroke(); } // pernas de palha
  c.fillStyle = "#4a6a8a"; c.fillRect(-TS * .18, -TS * .95, TS * .36, TS * .45); c.fillStyle = "#3a5070"; c.fillRect(-TS * .18, -TS * .6, TS * .36, TS * .1);
  c.strokeStyle = "#c8a050"; c.lineWidth = 1.5; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(-TS * .4, -TS * .93 + i * 1.5); c.lineTo(-TS * .5, -TS * .9 + i * 3 + (vivo ? Math.sin(tm * 12 + i) * 2 : 0)); c.moveTo(TS * .4, -TS * .93 + i * 1.5); c.lineTo(TS * .5, -TS * .9 + i * 3); c.stroke(); } // palha nas mãos
  c.fillStyle = "#5a3a22"; c.fillRect(-TS * .4, -TS * .95, TS * .8, 4);
  c.fillStyle = "#d8c8a0"; c.beginPath(); c.arc(0, -TS * 1.1, TS * .15, 0, 7); c.fill(); c.strokeStyle = "rgba(90,70,40,.6)"; c.lineWidth = .8; c.beginPath(); c.moveTo(-TS * .14, -TS * 1.05); c.lineTo(TS * .14, -TS * 1.12); c.stroke(); // saco
  c.fillStyle = "#c8a050"; c.beginPath(); c.ellipse(0, -TS * 1.2, TS * .27, TS * .06, 0, 0, 7); c.fill(); c.fillRect(-TS * .13, -TS * 1.36, TS * .26, TS * .14);
  const olhos = horaNoite() > .5 && (e.fase === "vivo" || Math.sin(tm * .6) > .8); c.fillStyle = olhos ? "#e2483d" : "#1a1a1a"; c.fillRect(-4, -TS * 1.13, 2.4, 2.4); c.fillRect(2, -TS * 1.13, 2.4, 2.4);
  c.strokeStyle = "#1a1a1a"; c.lineWidth = 1; c.beginPath(); c.moveTo(-5, -TS * 1.04); for (let i = 0; i < 6; i++) c.lineTo(-5 + i * 2, -TS * 1.04 + (i % 2) * 2 + (vivo ? 1 : 0)); c.stroke(); // boca costurada
  c.restore();
}
function desenharAranha(a, tm) {
  if (a.fase === "longe") return; const x = PX(a.x), y = PY(a.y); if (!naTela(x, y, TS * 7)) return;
  const k = TS / 48, H = TS * 4.6, ab = a.fase === "ataque" ? 1 : .35 + .3 * Math.abs(Math.sin(tm * 2)), passo = a.passo || 0, dirx = a.dir || 1;
  const corpo = { x: x, y: y - H + Math.sin(passo * 2) * 4 * k };
  sombra(x, y, TS * 1.9, TS * .45, .5);
  c.lineCap = "round"; c.lineJoin = "round";
  // quatro pernas compridíssimas, joelhos lá no alto
  const pernas = [[-1.6, 0], [1.6, PI], [-.8, PI * .5], [.9, PI * 1.5]];
  pernas.forEach(([ox, fase], i) => { const ciclo = passo + fase, lev = Math.max(0, Math.sin(ciclo)) * TS * .5, pex = x + ox * TS + Math.cos(ciclo) * TS * .5 * dirx, pey = y + (i < 2 ? TS * .25 : -TS * .25) - lev;
    const jx = mix(corpo.x, pex, .5) + ox * TS * .55, jy = corpo.y - TS * 1.3 - lev * .3;
    c.strokeStyle = i < 2 ? "#151210" : "#0c0a08"; c.lineWidth = 5 * k; c.beginPath(); c.moveTo(corpo.x + ox * TS * .2, corpo.y); c.lineTo(jx, jy); c.lineTo(pex, pey); c.stroke();
    c.fillStyle = "#24201a"; c.beginPath(); c.arc(jx, jy, 4.5 * k, 0, 7); c.fill(); // junta inchada
    c.strokeStyle = "#0c0a08"; c.lineWidth = 2 * k; c.beginPath(); c.moveTo(pex, pey); c.lineTo(pex + 6 * k, pey + 2 * k); c.moveTo(pex, pey); c.lineTo(pex - 5 * k, pey + 2 * k); c.stroke(); });
  // corpo pequeno, peludo
  c.fillStyle = "#1a1612"; c.beginPath(); c.ellipse(corpo.x - dirx * TS * .3, corpo.y, TS * .75, TS * .45, 0, 0, 7); c.fill();
  c.strokeStyle = "#2a2420"; c.lineWidth = 1.2 * k; for (let i = 0; i < 14; i++) { const an = i / 14 * PI * 2; c.beginPath(); c.moveTo(corpo.x - dirx * TS * .3 + Math.cos(an) * TS * .7, corpo.y + Math.sin(an) * TS * .4); c.lineTo(corpo.x - dirx * TS * .3 + Math.cos(an) * TS * .85, corpo.y + Math.sin(an) * TS * .5 + 3); c.stroke(); }
  // pescoço de girafa, curvado para baixo, procurando
  const bus = Math.sin(tm * .9) * TS * .4, nx = corpo.x + dirx * TS * 1.1 + bus * dirx, ny = corpo.y - TS * 1.5, hx = corpo.x + dirx * TS * 1.9 + bus * dirx, hy = corpo.y - TS * .2 + (a.fase === "ataque" ? TS * .9 : Math.sin(tm * 1.3) * TS * .3);
  c.strokeStyle = "#1e1a14"; c.lineWidth = 9 * k; c.beginPath(); c.moveTo(corpo.x + dirx * TS * .3, corpo.y - TS * .1); c.quadraticCurveTo(nx, ny, hx, hy - TS * .3); c.stroke();
  c.strokeStyle = "#2e2820"; c.lineWidth = 2 * k; for (let i = 1; i < 6; i++) { const t2 = i / 6, bx = mix(mix(corpo.x + dirx * TS * .3, nx, t2), mix(nx, hx, t2), t2), by = mix(mix(corpo.y - TS * .1, ny, t2), mix(ny, hy - TS * .3, t2), t2); c.beginPath(); c.arc(bx, by, 3 * k, 0, 7); c.stroke(); } // vértebras
  // cabeça: quase só boca, larga, cheia de dentes
  c.save(); c.translate(hx, hy); c.scale(dirx, 1); const bw = TS * 1.15, bh = TS * (.25 + ab * .55);
  c.fillStyle = "#1a1510"; c.beginPath(); c.ellipse(0, -TS * .1, bw * .62, TS * .28, 0, PI, 0); c.fill();
  c.fillStyle = "#200606"; c.beginPath(); c.moveTo(-bw * .6, 0); c.quadraticCurveTo(0, -TS * .12, bw * .6, 0); c.quadraticCurveTo(bw * .5, bh, 0, bh * 1.05); c.quadraticCurveTo(-bw * .5, bh, -bw * .6, 0); c.fill();
  const gg = c.createRadialGradient(0, bh * .5, 1, 0, bh * .5, bw * .5); gg.addColorStop(0, "rgba(150,20,20,.85)"); gg.addColorStop(1, "rgba(40,0,0,0)"); c.fillStyle = gg; c.fill();
  c.fillStyle = "#e8e0c8"; for (let i = 0; i < 16; i++) { const tx = -bw * .55 + i * bw * 1.1 / 15, top = -TS * .04 - Math.sin(i / 15 * PI) * TS * .06; c.beginPath(); c.moveTo(tx - 2.6 * k, top); c.lineTo(tx, top + (7 + (i % 3) * 3) * k); c.lineTo(tx + 2.6 * k, top); c.fill(); } // dentes de cima
  for (let i = 0; i < 14; i++) { const tx = -bw * .48 + i * bw * .96 / 13, bot = bh * (.75 + .3 * Math.sin(i / 13 * PI)); c.beginPath(); c.moveTo(tx - 2.4 * k, bot); c.lineTo(tx, bot - (6 + (i % 2) * 3) * k); c.lineTo(tx + 2.4 * k, bot); c.fill(); } // dentes de baixo
  c.strokeStyle = "rgba(220,220,200,.45)"; c.lineWidth = 1; c.beginPath(); c.moveTo(-bw * .2, bh * .8); c.quadraticCurveTo(-bw * .22, bh * 1.4, -bw * .18, bh * 1.8 + Math.sin(tm * 3) * 4); c.stroke(); // baba
  const brilho = a.fase === "ataque" ? 1 : .55 + a.alerta * .45; [[-.25, -.22], [-.1, -.3], [.06, -.32], [.2, -.26], [-.17, -.12], [.13, -.15]].forEach(([ex, ey], i) => { c.fillStyle = `rgba(${i % 2 ? "240,240,225" : "230,60,40"},${brilho})`; c.beginPath(); c.arc(ex * bw, ey * TS, (2 + (i % 3)) * k, 0, 7); c.fill(); }); // olhinhos
  c.restore();
}
function desenharMula(m, tm) {
  if (m.fase === "aviso") { // o chão brilha em linha reta
    const k = Math.min(1, m.t / 1.2), pis = .5 + .5 * Math.sin(tm * 18); c.save(); c.globalCompositeOperation = "lighter";
    if (m.horiz) { const yy = PY(m.linha), g = c.createLinearGradient(0, yy - TS * .7, 0, yy + TS * .7); g.addColorStop(0, "rgba(255,90,20,0)"); g.addColorStop(.5, `rgba(255,120,30,${.35 * k * (.6 + .4 * pis)})`); g.addColorStop(1, "rgba(255,90,20,0)"); c.fillStyle = g; c.fillRect(PX(CERCA.x0), yy - TS * .7, (CERCA.x1 - CERCA.x0) * TS, TS * 1.4); }
    else { const xx = PX(m.linha), g = c.createLinearGradient(xx - TS * .7, 0, xx + TS * .7, 0); g.addColorStop(0, "rgba(255,90,20,0)"); g.addColorStop(.5, `rgba(255,120,30,${.35 * k * (.6 + .4 * pis)})`); g.addColorStop(1, "rgba(255,90,20,0)"); c.fillStyle = g; c.fillRect(xx - TS * .7, PY(CERCA.y0), TS * 1.4, (CERCA.y1 - CERCA.y0) * TS); }
    c.restore(); return;
  }
  if (m.fase !== "corre") return; const x = PX(m.x), y = PY(m.y); if (!naTela(x, y, 200)) return;
  const k = TS / 48 * 1.3, dx = m.horiz ? m.dir : 1, gal = tm * 26;
  sombra(x, y, 26 * k, 6 * k, .5); c.save(); c.translate(x, y); c.scale(dx * k, k); c.lineCap = "round";
  const perna = (px, f) => { c.strokeStyle = "#1a1210"; c.lineWidth = 4.5; c.beginPath(); c.moveTo(px, -22); c.lineTo(px + Math.sin(gal + f) * 8, -10); c.lineTo(px + Math.sin(gal + f + 1) * 10, 0); c.stroke(); c.fillStyle = "#c8c8c8"; c.fillRect(px + Math.sin(gal + f + 1) * 10 - 3, -1, 6, 2.5); };
  perna(-14, 0); perna(-8, 2); perna(10, 3); perna(16, 5);
  c.fillStyle = "#2a1e16"; c.beginPath(); c.ellipse(0, -28, 22, 10, 0, 0, 7); c.fill(); c.strokeStyle = "#2a1e16"; c.lineWidth = 3; c.beginPath(); c.moveTo(-21, -30); c.quadraticCurveTo(-34, -28 + Math.sin(gal) * 4, -36, -14); c.stroke(); // rabo
  c.fillStyle = "#2a1e16"; c.beginPath(); c.moveTo(14, -34); c.lineTo(26, -50); c.lineTo(32, -44); c.lineTo(20, -26); c.fill(); // pescoço sem cabeça
  for (let i = 0; i < 9; i++) { const ff = (tm * 6 + i * .37) % 1; c.fillStyle = `rgba(255,${120 + i * 14},30,${.9 * (1 - ff)})`; c.beginPath(); c.ellipse(29 + Math.sin(i * 2.3 + tm * 9) * 4 + ff * 10, -48 - ff * 26, (6 - ff * 4) * 1.2, (10 - ff * 6) * 1.2, .3, 0, 7); c.fill(); } // fogo saindo do pescoço
  c.fillStyle = "#5a4a3a"; c.fillRect(-8, -38, 12, 3); c.restore();
}
function desenharSaci(s, tm) {
  if (s.fase === "longe") return; const x = PX(s.x), y = PY(s.y); if (!naTela(x, y, 120)) return; const g = s.giro || 0;
  for (let i = 0; i < 18; i++) { const h = i / 18, r = TS * (.15 + h * .55), an = g * (1.4 - h * .5) + i * 1.7; c.fillStyle = `rgba(${150 + i * 3},${120 + i * 2},80,${.35 - h * .12})`; c.beginPath(); c.ellipse(x + Math.cos(an) * r * .5, y - h * TS * 1.9, r * .9, r * .22, 0, 0, 7); c.fill(); } // funil de poeira
  for (let i = 0; i < 10; i++) { const an = g * 1.3 + i * .63, h = (i * .11 + g * .02) % 1; c.fillStyle = ["#c8662a", "#d89a2a", "#7a9a3a"][i % 3]; c.save(); c.translate(x + Math.cos(an) * TS * (.2 + h * .5), y - h * TS * 1.8); c.rotate(an); c.fillRect(-3, -1.5, 6, 3); c.restore(); } // folhas girando
  const vis = .5 + .5 * Math.sin(tm * 3); c.globalAlpha = .55 + vis * .4; c.fillStyle = "#2a1a12"; c.beginPath(); c.ellipse(x, y - TS * .9, TS * .1, TS * .22, 0, 0, 7); c.fill(); c.beginPath(); c.arc(x, y - TS * 1.2, TS * .1, 0, 7); c.fill(); c.fillRect(x - 1.5, y - TS * .7, 3, TS * .45); // uma perna só
  c.fillStyle = "#c8281e"; c.beginPath(); c.moveTo(x - TS * .1, y - TS * 1.26); c.lineTo(x + TS * .22, y - TS * 1.5); c.lineTo(x + TS * .1, y - TS * 1.22); c.fill(); // gorro vermelho
  c.fillStyle = "#e8c070"; c.fillRect(x + TS * .08, y - TS * 1.16, TS * .12, 2.5); c.fillStyle = `rgba(255,140,40,${.6 + .4 * Math.sin(tm * 8)})`; c.beginPath(); c.arc(x + TS * .21, y - TS * 1.17, 2.2, 0, 7); c.fill(); // cachimbo
  c.fillStyle = "#f2e8c8"; c.fillRect(x - 3, y - TS * 1.22, 2, 2); c.fillRect(x + 1, y - TS * 1.22, 2, 2); c.globalAlpha = 1;
}
function desenharQueimado() { R.queimado.forEach(q => { const x = PX(q.x), y = PY(q.y); if (!naTela(x, y, 20)) return; const a = 1 - q.t / 3.5; c.fillStyle = `rgba(40,20,10,${.5 * a})`; c.beginPath(); c.ellipse(x, y, TS * .3, TS * .12, 0, 0, 7); c.fill(); c.fillStyle = `rgba(255,${130 + Math.random() * 80},40,${a})`; c.beginPath(); c.ellipse(x + Math.random() * 4 - 2, y - 4 - Math.random() * 8 * a, 2.4, 4 + 5 * a, 0, 0, 7); c.fill(); }); }
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
  desenharRiacho(tm); desenharQueimado(); if (R.mula.fase === "aviso") desenharMula(R.mula, tm);
  // objetos ordenados pela altura na tela
  const obj = [];
  R.arvores.forEach(a => obj.push([a.y, () => desenharArvore(a, tm)]));
  POMAR.forEach(([x, y], i) => obj.push([y, () => desenharArvore({ x, y, r: .8, c: 1 }, tm, R.frutas[i])]));
  obj.push([CASA.y + CASA.h + .4, () => desenharCasa(tm)]);
  obj.push([CAPELA.y + CAPELA.h, () => desenharCapela(tm)]);
  if (!PES_MILHO) PES_MILHO = milhoPes(); PES_MILHO.forEach(m => obj.push([m.y, () => desenharPeMilho(m, tm)]));
  obj.push(...desenharChiqueiro(tm, desenharCerca()));
  COLMEIAS.forEach(([, y], i) => obj.push([y, () => desenharColmeia(i, tm)])); obj.push([BALANCO.y, () => desenharBalanco(tm)]);
  obj.push([CARRIOLA.y, () => desenharDecor(tm, 0)]); obj.push([LENHA.y, () => desenharDecor(tm, 1)]); FENOS.forEach(([, y], i) => obj.push([y, () => desenharDecor(tm, 2 + i)]));
  obj.push([R.esp.y, () => desenharEspantalho(R.esp, tm)]);
  if (R.aranha.fase !== "longe") obj.push([R.aranha.y, () => desenharAranha(R.aranha, tm)]);
  if (R.mula.fase === "corre") obj.push([R.mula.y, () => desenharMula(R.mula, tm)]);
  if (R.saci.fase !== "longe") obj.push([R.saci.y, () => desenharSaci(R.saci, tm)]);
  const ou = R.outro; if (ou && !ou.dentro && !(R.venceu && R.venceu.t > 1)) obj.push([ou.eu.y, () => { desenharVoce(PX(ou.eu.x), PY(ou.eu.y), tm, { q: ou, nome: R.online === "host" ? "Amigo(a)" : "Yasmin" }); if (ou.velaCom) desenharVela(PX(ou.eu.x) - TS * .28, PY(ou.eu.y) - TS * .35, tm); }]);
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
  const ce = desenharCerca();
  for (let x = CERCA.x0; x <= CERCA.x1; x++) { obj.push([CERCA.y0, () => ce.post(x, CERCA.y0)]); if (x < CERCA.x1) obj.push([CERCA.y0, () => ce.trilho(x, CERCA.y0, x + 1, CERCA.y0)]); obj.push([CERCA.y1, () => ce.post(x, CERCA.y1)]); if (x < CERCA.x1 && (x < 24 || x > 26)) obj.push([CERCA.y1, () => ce.trilho(x, CERCA.y1, x + 1, CERCA.y1)]); }
  for (let y = CERCA.y0; y <= CERCA.y1; y++) { obj.push([y, () => ce.post(CERCA.x0, y)]); obj.push([y, () => ce.post(CERCA.x1, y)]); if (y < CERCA.y1) { obj.push([y + 1, () => ce.trilho(CERCA.x0, y, CERCA.x0, y + 1)]); obj.push([y + 1, () => ce.trilho(CERCA.x1, y, CERCA.x1, y + 1)]); } }
  for (let y = 6; y <= 11; y++) { obj.push([y, () => ce.post(25.5, y)]); obj.push([y, () => ce.post(32.5, y)]); } for (let x = 25.5; x <= 32.5; x++) if (x < 28 || x > 29.5) obj.push([11.6, () => ce.post(x, 11.6)]); // cercadinho
  obj.push([R.gato.y, () => desenharGato(R.gato, tm)]);
  if (R.cachorro) obj.push([R.cachorro.y, () => desenharCachorro(R.cachorro, tm)]);
  obj.push([R.seco.y, () => desenharSeco(R.seco, tm)]);
  if (R.vulto) obj.push([R.vulto.y, () => desenharVulto(R.vulto, tm)]);
  if (R.vela && !velaNaMao()) obj.push([R.vela.y, () => desenharVela(PX(R.vela.x), PY(R.vela.y), tm)]);
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
  const ou = R.outro; if (ou && !ou.dentro) furo(PX(ou.eu.x), PY(ou.eu.y) - TS * .4, TS * raioLuz(ou), ou.lanterna ? 1 : .7);
  furo(PX(CAPELA.porta.x), PY(CAPELA.porta.y) - 6, TS * 1.5, .75); // velinhas da capela
  if (R.mula.fase === "corre") furo(PX(R.mula.x), PY(R.mula.y) - TS, TS * 2.4, 1);
  if (R.mula.fase === "aviso") { if (R.mula.horiz) for (let x = CERCA.x0; x < CERCA.x1; x += 2) furo(PX(x), PY(R.mula.linha), TS * 1.1, .5); else for (let y = CERCA.y0; y < CERCA.y1; y += 2) furo(PX(R.mula.linha), PY(y), TS * 1.1, .5); }
  R.queimado.forEach((q, i) => { if (i % 3 === 0) furo(PX(q.x), PY(q.y), TS * .8, .6 * (1 - q.t / 3.5)); });
  if (R.vela && !velaNaMao()) furo(PX(R.vela.x), PY(R.vela.y) - 16, TS * 1.4, .9);
  if (R.velaEntregue) furo(PX(CRUZ.x), PY(CRUZ.y) - 20, TS * 1.6, .9);
  for (let i = 0; i < 22; i++) { const fx = CERCA.x0 + 1 + (i * 7.3) % (CERCA.x1 - CERCA.x0 - 2) + Math.sin(tm * .4 + i) * 1.2, fy = CERCA.y0 + 1 + (i * 5.1) % (CERCA.y1 - CERCA.y0 - 2) + Math.cos(tm * .5 + i * 2) * .8, a = .5 + .5 * Math.sin(tm * 3 + i * 1.7); if (a > .3) furo(PX(fx), PY(fy), TS * .35, a * .8); }
  c.drawImage(luzCv, 0, 0, W, H);
  c.globalCompositeOperation = "lighter";
  const brilho = (x, y, r, rgb, a) => { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); };
  if (R.lanterna) brilho(ex, ey, TS * 3, "255,200,120", .14 * nt);
  if (R.vela && !velaNaMao()) brilho(PX(R.vela.x), PY(R.vela.y) - 16, TS * .9, "255,190,90", .35 * nt);
  for (let i = 0; i < 22; i++) { const fx = CERCA.x0 + 1 + (i * 7.3) % (CERCA.x1 - CERCA.x0 - 2) + Math.sin(tm * .4 + i) * 1.2, fy = CERCA.y0 + 1 + (i * 5.1) % (CERCA.y1 - CERCA.y0 - 2) + Math.cos(tm * .5 + i * 2) * .8, a = .5 + .5 * Math.sin(tm * 3 + i * 1.7); if (a > .3) brilho(PX(fx), PY(fy), 6, "200,255,140", a * nt); }
  if (R.seco.fase === "anda" || R.seco.fase === "sai") brilho(PX(R.seco.x) + (R.seco.dir || 1) * TS * .9, PY(R.seco.y) - TS * .9, TS * .5, "255,140,60", .5 * nt);
  if (R.mula.fase === "corre") brilho(PX(R.mula.x), PY(R.mula.y) - TS * 1.2, TS * 1.6, "255,120,30", .5);
  if (R.aranha.fase !== "longe") brilho(PX(R.aranha.x) + (R.aranha.dir || 1) * TS * 1.9, PY(R.aranha.y) - TS * 4.6, TS * .9, "230,60,40", (.2 + R.aranha.alerta * .4) * nt);
  if (R.esp.fase === "vivo") brilho(PX(R.esp.x), PY(R.esp.y) - TS * 1.1, TS * .35, "255,40,30", .6 * nt);
  if (ou && ou.lanterna && !ou.dentro) brilho(PX(ou.eu.x), PY(ou.eu.y) - TS * .4, TS * 3, "255,200,120", .14 * nt);
  if (R.cachorro) brilho(PX(R.cachorro.x) + (R.cachorro.dir || 1) * TS * .35, PY(R.cachorro.y) - TS * (R.cachorro.fase === "lobo" ? 1.2 : .45), TS * .35, "255,40,30", .6 * nt);
  c.globalCompositeOperation = "source-over";
  if (R.mula.fase === "aviso") desenharMula(R.mula, tm);
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
  { const bx = X(5), by = Y(3.35), u = s / 40; c.save(); c.translate(bx, by); c.rotate(-.12); c.fillStyle = "rgba(0,0,0,.35)"; c.fillRect(-15 * u, -8 * u, 32 * u, 20 * u); c.fillStyle = "#5a2a1a"; c.fillRect(-16 * u, -10 * u, 32 * u, 20 * u); c.fillStyle = "#e8dcc0"; c.fillRect(-14 * u, -8.5 * u, 13 * u, 17 * u); c.fillRect(1 * u, -8.5 * u, 13 * u, 17 * u); c.strokeStyle = "rgba(60,40,20,.6)"; c.lineWidth = 1; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(-12 * u, (-5 + i * 3) * u); c.lineTo(-3 * u, (-5 + i * 3) * u); c.moveTo(3 * u, (-5 + i * 3) * u); c.lineTo(12 * u, (-5 + i * 3) * u); c.stroke(); }
    if (!R.diario) { c.strokeStyle = `rgba(242,201,74,${.4 + .4 * Math.sin(tm * 4)})`; c.lineWidth = 2; c.strokeRect(-18 * u, -12 * u, 36 * u, 24 * u); } c.restore(); } // o diário da vó em cima da mesa
  const ou = R.outro; if (ou && ou.dentro && ou.sala) desenharVoce(X(ou.sala.x), Y(ou.sala.y), tm, { q: ou, dir: ou.sala.dir || 1, s: s * 1.05, nome: R.online === "host" ? "Amigo(a)" : "Yasmin" });
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
function rostoMonstro(quem, r, ab, tm) { // desenha o rosto centrado na origem (susto e fotos do diário)
  const dentes = (y0, larg, n, alt, cima) => { c.fillStyle = "#e8e0c8"; for (let i = 0; i < n; i++) { const tx = -larg / 2 + (i + .5) * larg / n; c.beginPath(); c.moveTo(tx - larg / n * .45, y0); c.lineTo(tx, y0 + (cima ? 1 : -1) * alt * (.7 + .3 * ((i * 7) % 3) / 2)); c.lineTo(tx + larg / n * .45, y0); c.fill(); } };
  const olhos = (ex, ey, rr, rgb) => { c.fillStyle = "rgba(0,0,0,.75)"; c.beginPath(); c.ellipse(-ex, ey, rr * 1.5, rr * 1.7, 0, 0, 7); c.ellipse(ex, ey, rr * 1.5, rr * 1.7, 0, 0, 7); c.fill(); c.fillStyle = `rgb(${rgb})`; c.beginPath(); c.arc(-ex, ey, rr * .5, 0, 7); c.arc(ex, ey, rr * .5, 0, 7); c.fill(); const g = c.createRadialGradient(0, ey, 0, 0, ey, ex * 2.4); g.addColorStop(0, `rgba(${rgb},.25)`); g.addColorStop(1, `rgba(${rgb},0)`); c.fillStyle = g; c.fillRect(-ex * 3, ey - ex * 2, ex * 6, ex * 4); };
  if (quem === "seco") { // boca gigante que ocupa o rosto
    c.fillStyle = "#3e3020"; c.beginPath(); c.ellipse(0, -r * .1, r * .8, r * .95, 0, 0, 7); c.fill();
    c.strokeStyle = "rgba(200,170,120,.2)"; c.lineWidth = 2; for (let i = 0; i < 12; i++) { c.beginPath(); c.moveTo(-r * .7 + i * r * .12, -r * .9); c.lineTo(-r * .65 + i * r * .12 + Math.sin(i) * 8, -r * .3); c.stroke(); }
    olhos(r * .28, -r * .55, r * .08, "255,150,70");
    c.fillStyle = "#1a0404"; c.beginPath(); c.ellipse(0, r * .25, r * .62, r * .5 * ab, 0, 0, 7); c.fill(); const g = c.createRadialGradient(0, r * .3, 0, 0, r * .3, r * .5); g.addColorStop(0, "rgba(140,10,10,.8)"); g.addColorStop(1, "rgba(40,0,0,0)"); c.fillStyle = g; c.beginPath(); c.ellipse(0, r * .25, r * .6, r * .48 * ab, 0, 0, 7); c.fill();
    dentes(r * .25 - r * .5 * ab, r * 1.15, 13, r * .26, true); dentes(r * .25 + r * .5 * ab, r * 1.1, 12, r * .22, false); dentes(r * .25 - r * .32 * ab, r * .8, 10, r * .16, true); // fileiras de dentes
    c.strokeStyle = "rgba(220,220,200,.5)"; c.lineWidth = 2; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(-r * .3 + i * r * .2, r * .05); c.quadraticCurveTo(-r * .3 + i * r * .2, r * .3, -r * .28 + i * r * .2, r * .55); c.stroke(); } // baba
  } else if (quem === "aranha") { // a boca larga que não cabe na tela
    olhos(r * .5, -r * .95, r * .05, "230,60,40"); olhos(r * .22, -r * 1.08, r * .04, "240,240,225"); olhos(r * .8, -r * .78, r * .035, "240,240,225");
    const bw = Math.max(W, H) * .62, bh = r * (.45 + .45 * ab);
    c.fillStyle = "#1a1510"; c.beginPath(); c.ellipse(0, -r * .35, bw * 1.05, r * .55, 0, PI, 0); c.fill();
    c.fillStyle = "#1a0303"; c.beginPath(); c.moveTo(-bw, -r * .3); c.quadraticCurveTo(0, -r * .55, bw, -r * .3); c.quadraticCurveTo(bw * .8, bh + r * .3, 0, bh + r * .45); c.quadraticCurveTo(-bw * .8, bh + r * .3, -bw, -r * .3); c.fill();
    const g = c.createRadialGradient(0, r * .2, 0, 0, r * .2, bw * .7); g.addColorStop(0, "rgba(150,15,15,.85)"); g.addColorStop(1, "rgba(40,0,0,0)"); c.fillStyle = g; c.fill();
    for (let f = 0; f < 3; f++) { dentes(-r * .36 + f * r * .14, bw * (1.9 - f * .35), 26 - f * 5, r * (.24 - f * .05), true); dentes(bh + r * .3 - f * r * .15, bw * (1.6 - f * .3), 22 - f * 4, r * (.2 - f * .04), false); } // fileiras e fileiras de dentes
    c.strokeStyle = "rgba(220,220,200,.5)"; c.lineWidth = 2; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(-bw * .6 + i * bw * .24, -r * .1); c.quadraticCurveTo(-bw * .6 + i * bw * .24, r * .3, -bw * .58 + i * bw * .24, r * .7 + Math.sin(tm * 3 + i) * 8); c.stroke(); }
  } else if (quem === "mula") { // fogo no lugar da cabeça
    for (let i = 0; i < 26; i++) { const ff = (tm * 2.5 + i * .13) % 1; c.fillStyle = `rgba(255,${90 + (i % 6) * 25},${20 + (i % 3) * 20},${.8 * (1 - ff)})`; c.beginPath(); c.ellipse(Math.sin(i * 2.7 + tm * 4) * r * .5, r * .6 - ff * r * 1.8, r * (.32 - ff * .2), r * (.5 - ff * .25), Math.sin(i) * .4, 0, 7); c.fill(); }
    c.fillStyle = "#2a1e16"; c.beginPath(); c.moveTo(-r * .45, r * 1.2); c.lineTo(-r * .3, r * .5); c.lineTo(r * .3, r * .5); c.lineTo(r * .45, r * 1.2); c.fill();
    c.fillStyle = "#c8c8c8"; [[-.7, .9], [.7, .9]].forEach(([fx, fy]) => { c.beginPath(); c.arc(fx * r, fy * r, r * .14, PI * .1, PI * 1.9); c.lineWidth = r * .06; c.strokeStyle = "#c8c8c8"; c.stroke(); }); // ferraduras
  } else if (quem === "esp") { // rosto de saco costurado que rasga
    c.fillStyle = "#c8b890"; c.beginPath(); c.ellipse(0, 0, r * .62, r * .78, 0, 0, 7); c.fill(); c.strokeStyle = "rgba(90,70,40,.5)"; c.lineWidth = 2; for (let i = 0; i < 9; i++) { c.beginPath(); c.moveTo(-r * .6, -r * .6 + i * r * .15); c.lineTo(r * .6, -r * .55 + i * r * .15); c.stroke(); }
    c.fillStyle = "#c8a050"; c.beginPath(); c.ellipse(0, -r * .7, r * 1.1, r * .2, 0, 0, 7); c.fill(); c.fillRect(-r * .45, -r * 1.1, r * .9, r * .4);
    olhos(r * .24, -r * .2, r * .09, "226,40,30"); c.strokeStyle = "#1a1a1a"; c.lineWidth = 3; for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(-r * .24 + i * r * .05, -r * .2 - r * .1); c.lineTo(-r * .24 + i * r * .05 + r * .04, -r * .2 + r * .1); c.stroke(); }
    c.fillStyle = "#140404"; c.beginPath(); c.ellipse(0, r * .35, r * .42, r * .22 * ab + r * .05, 0, 0, 7); c.fill(); dentes(r * .35 - r * .22 * ab, r * .8, 11, r * .14, true); dentes(r * .35 + r * .22 * ab, r * .7, 10, r * .12, false);
    c.strokeStyle = "#1a1a1a"; c.lineWidth = 2; for (let i = 0; i < 9; i++) { c.beginPath(); c.moveTo(-r * .4 + i * r * .1, r * .3 - r * .25 * ab); c.lineTo(-r * .4 + i * r * .1, r * .4 + r * .25 * ab); c.stroke(); } // linha arrebentando
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
  } else if (quem === "saci") { // carinha de moleque com gorro vermelho e cachimbo
    c.fillStyle = "#3a2216"; c.beginPath(); c.ellipse(0, 0, r * .55, r * .68, 0, 0, 7); c.fill();
    c.fillStyle = "#c8281e"; c.beginPath(); c.moveTo(-r * .62, -r * .35); c.quadraticCurveTo(-r * .2, -r * 1.25, r * .75, -r * 1.05); c.quadraticCurveTo(r * .3, -r * .7, r * .62, -r * .35); c.fill();
    olhos(r * .22, -r * .1, r * .08, "255,230,160"); c.fillStyle = "#1a0a06"; c.beginPath(); c.ellipse(0, r * .3, r * .32, r * .14 + r * .08 * ab, 0, 0, Math.PI); c.fill(); dentes(r * .3, r * .5, 6, r * .08, true);
    c.fillStyle = "#c89a5a"; c.fillRect(r * .25, r * .32, r * .5, r * .06); c.fillRect(r * .68, r * .18, r * .12, r * .18); c.fillStyle = `rgba(255,140,40,${.6 + .4 * Math.sin(tm * 8)})`; c.beginPath(); c.arc(r * .74, r * .17, r * .05, 0, 7); c.fill();
    c.fillStyle = "rgba(200,200,200,.3)"; for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(r * (.8 + i * .08), r * (.05 - i * .14), r * (.06 + i * .03), 0, 7); c.fill(); }
  } else { // rosto no fundo do poço
    c.fillStyle = "#9aa4a8"; c.beginPath(); c.ellipse(0, 0, r * .55, r * .75, 0, 0, 7); c.fill(); olhos(r * .22, -r * .15, r * .08, "10,14,18"); c.fillStyle = "#1a2024"; c.beginPath(); c.ellipse(0, r * .35, r * .14, r * .22 * ab, 0, 0, 7); c.fill();
    c.strokeStyle = "rgba(20,30,30,.8)"; c.lineWidth = 2; for (let i = 0; i < 14; i++) { c.beginPath(); c.moveTo(-r * .5 + i * r * .08, -r * .7); c.lineTo(-r * .55 + i * r * .085, r * .2); c.stroke(); }
  }
}
function desenharSusto(tm) {
  const cai = !R.morto && R.caido && R.caido.t < 2.4 ? R.caido : null;
  const quem = R.morto ? R.morto.quem : cai ? cai.quem : R.rostoPoco ? "poco" : null; if (!quem) return;
  const k = R.morto ? Math.min(1, R.morto.t / .2) : cai ? cl(Math.min(cai.t / .2, (2.4 - cai.t) / .5), 0, 1) : cl(R.susto / 1.1, 0, 1); if (k <= 0) { R.rostoPoco = 0; return; }
  c.fillStyle = `rgba(0,0,0,${.88 * k})`; c.fillRect(0, 0, W, H);
  const tr = R.morto && R.morto.t < 1 ? rnd(-10, 10) : 0, r = Math.min(W, H) * .38 * (.75 + .25 * k), x = W / 2 + tr, y = H / 2 + tr * .6;
  c.save(); c.globalAlpha = k; c.translate(x, y); const ab = .6 + .4 * Math.abs(Math.sin(tm * 18));
  rostoMonstro(quem, r, ab, tm);
  c.restore();
  if (R.morto) { c.fillStyle = `rgba(226,40,30,${.3 * Math.max(0, 1 - R.morto.t)})`; c.fillRect(0, 0, W, H); }
}
function desenharFx() {
  R.fx.forEach(f => { const a = 1 - f.t / 1.8, x = f.x == null ? W / 2 : PX(f.x), y = (f.y == null ? H * .3 : PY(f.y) - TS * 1.3) - f.t * 30; c.globalAlpha = Math.max(0, a); c.fillStyle = f.cor; c.font = `800 ${Math.round(Math.max(14, TS * .34))}px "Big Shoulders Display", sans-serif`; c.textAlign = "center"; c.strokeStyle = "rgba(0,0,0,.7)"; c.lineWidth = 3; c.strokeText(f.txt, x, y); c.fillText(f.txt, x, y); c.textAlign = "start"; c.globalAlpha = 1; });
  R.fxR && R.fxR.forEach(f => { const a = 1 - f.t / 1.8, x = f.x == null ? W / 2 : PX(f.x), y = (f.y == null ? H * .3 : PY(f.y) - TS * 1.3) - f.t * 30; if (R.dentro && f.x != null) return; c.globalAlpha = Math.max(0, a); c.fillStyle = f.cor; c.font = `800 ${Math.round(Math.max(14, TS * .34))}px "Big Shoulders Display", sans-serif`; c.textAlign = "center"; c.strokeStyle = "rgba(0,0,0,.7)"; c.lineWidth = 3; c.strokeText(f.txt, x, y); c.fillText(f.txt, x, y); c.textAlign = "start"; c.globalAlpha = 1; });
  const a = R.aranha, m = R.mula;
  el.rcDica.textContent = R.caido ? (R.caido.fora ? "Você não tem mais vidas. Agora é com a sua amiga." : "Você caiu. Só a sua amiga pode te levantar!") : a.fase === "ataque" ? "Ela te viu! Corra para dentro de casa!" : (a.fase === "aviso" || a.fase === "anda") && !R.dentro ? (noMilharal(R.eu) ? "No milharal ela não te enxerga. Fique quieta." : "Juntas estalando... apague a lanterna e fique parada!")
    : m.fase === "aviso" && !R.dentro ? "O chão está brilhando! Saia da linha!" : R.dentro ? "" : R.seco.fase === "anda" || R.seco.fase === "aviso" ? "A mata estalou. Corra para dentro de casa!" : R.cachorro && R.cachorro.fase === "lobo" ? "Corra para casa!"
    : R.esp.fase === "vivo" && !R.esp.parado ? "O espantalho está andando. Ilumine ele!" : R.saci.fase === "anda" ? (R.peneira ? "Redemoinho! Pegue o Saci com a peneira!" : "Redemoinho! Fuja dele: o Saci rouba moedas") : R.vela && !velaNaMao() ? "Siga o som do sino e ache a vela" : velaNaMao() ? "Leve a vela até a cruz do cemitério" : "";
  if ((a.fase === "anda" || a.fase === "ataque") && !R.dentro) { // olho que mostra o quanto ela já te notou
    const w = Math.min(180, W * .24), x = W / 2 - w / 2, y = 36, v = a.fase === "ataque" ? 1 : a.alerta; c.fillStyle = "rgba(0,0,0,.5)"; c.fillRect(x, y, w, 7); c.fillStyle = v > .7 ? "#e2483d" : v > .35 ? "#f2a33a" : "#e8e2d4"; c.fillRect(x, y, w * v, 7);
    c.strokeStyle = "rgba(255,255,255,.5)"; c.lineWidth = 1.5; c.beginPath(); c.ellipse(x - 14, y + 3.5, 9, 5, 0, 0, 7); c.stroke(); c.fillStyle = c.strokeStyle; c.beginPath(); c.arc(x - 14, y + 3.5, 2.4, 0, 7); c.fill(); }
  if (!R.dentro) { if (CHAT.meu) balaoChat(R.eu, CHAT.meu); if (CHAT.dele && R.outro && !R.outro.dentro) balaoChat(R.outro.eu, CHAT.dele); }
  if (R.caido) { c.fillStyle = `rgba(120,10,10,${.25 + .1 * Math.sin(performance.now() / 300)})`; c.fillRect(0, 0, W, H); }
}
function desenharVitoria(tm) { if (!R.venceu) return; const k = R.venceu.t; if (k < 1) return; c.fillStyle = `rgba(0,0,0,${cl((k - 3) / 1.4, 0, 1)})`; c.fillRect(0, 0, W, H); }
function loop(ts) {
  if (!rodando || !R) return;
  requestAnimationFrame(loop); // agenda antes: um erro de desenho não congela o jogo
  const dt = Math.min(.05, (ts - ultimo) / 1000 || 0); ultimo = ts;
  if (R.online === "guest") atualizarConvidado(dt); else atualizar(dt);
  if (R.online === "host" && R.outro) { Net.envT -= dt; if (Net.envT <= 0) { Net.envT = .1; enviar(estadoPara()); } }
  const tm = ts / 1000;
  c.setTransform(DPRr, 0, 0, DPRr, 0, 0);
  if (R.dentro) desenharDentro(tm); else { if (R.venceu && R.venceu.t > 1) { CAMINHONETE.x += .0; } desenharMundo(tm); desenharLuz(tm); }
  if (R.venceu && R.venceu.t > 1 && !R.dentro) { const x = PX(CAMINHONETE.x), y = PY(CAMINHONETE.y + .9 + Math.max(0, R.venceu.t - 1.5) * 2.2); c.globalCompositeOperation = "lighter"; c.fillStyle = "rgba(255,240,200,.18)"; c.beginPath(); c.moveTo(x - TS * .8, y); c.lineTo(x - TS * 2, y + TS * 6); c.lineTo(x + TS * 2, y + TS * 6); c.lineTo(x + TS * .8, y); c.fill(); c.globalCompositeOperation = "source-over"; }
  desenharFx(); desenharSusto(tm); desenharVitoria(tm);
  // vinheta
  const vg = c.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .35, W / 2, H / 2, Math.max(W, H) * .75); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,.55)"); c.fillStyle = vg; c.fillRect(0, 0, W, H);
}

/* ---------- a história antes do jogo ---------- */
const HIST = [
  { cena: "chuva", txt: "Choveu a viagem inteira. A caminhonete morreu bem na porteira do sítio da Vó Benedita, e o rádio continuou tocando uma música que ninguém conhecia." },
  { cena: "casa", txt: "A casa estava aberta. A mesa posta para três, o café ainda quente no bule. Mas a vó não respondia. Em lugar nenhum." },
  { cena: "mata", txt: "O pai pegou a lanterna. — Fica na varanda, Yasmin. Eu volto já. — E entrou na mata, chamando pela mãe." },
  { cena: "lanterna", txt: "Yasmin contou os estalos da mata até perder a conta. Perto da meia-noite, a lanterna voltou. Rolando sozinha pela trilha. Ainda acesa." },
  { cena: "caderno", txt: "No caderno da vó, uma página com a letra tremida: AS REGRAS DO SÍTIO. Quem esquece uma regra não vê o dia seguinte." },
  { cena: "sombrinha", txt: "Foi aí que uma gatinha preta subiu na varanda. — Não chora. Eu sou a Sombrinha. Sua vó me ensinou tudo. Agora eu ensino você." },
  { cena: "fim", txt: "Plante. Colha. Junte dinheiro para consertar a caminhonete. E aprenda as regras... antes que a noite aprenda o seu nome." }];
const CENAS = {
  ceu(g, w, h, a, b) { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(0, 0, w, h); },
  chuvaFina(g, w, h, t, n, a = .35) { g.strokeStyle = `rgba(170,190,220,${a})`; g.lineWidth = 1; g.beginPath(); for (let i = 0; i < n; i++) { const x = ((i * 97.3 + t * 220) % (w + 80)) - 40, y = ((i * 53.7 + t * 900) % (h + 40)) - 20; g.moveTo(x, y); g.lineTo(x - 5, y + 16); } g.stroke(); },
  arvores(g, w, y, h, cor, sem) { g.fillStyle = cor; for (let i = 0; i < 26; i++) { const x = ((i * 113 + sem * 37) % (w + 120)) - 60, hh = h * (.55 + ((i * 7 + sem) % 5) / 10); g.beginPath(); g.moveTo(x - hh * .28, y); g.lineTo(x, y - hh); g.lineTo(x + hh * .28, y); g.fill(); g.fillRect(x - 2, y - 4, 4, 8); } g.fillRect(0, y - 2, w, h); },
  menina(g, x, y, s, sentada) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = "#0a0a0c"; if (sentada) { g.beginPath(); g.ellipse(0, -14, 13, 15, 0, 0, 7); g.fill(); } else { g.fillRect(-5, -14, 4, 14); g.fillRect(1, -14, 4, 14); g.beginPath(); g.moveTo(-9, -12); g.lineTo(9, -12); g.lineTo(6, -34); g.lineTo(-6, -34); g.fill(); } g.beginPath(); g.arc(0, sentada ? -36 : -41, 8, 0, 7); g.fill(); for (const k of [-1, 1]) { g.beginPath(); g.ellipse(k * 8, sentada ? -30 : -35, 2.6, 8, k * .2, 0, 7); g.fill(); } g.restore(); },
  gata(g, x, y, s, t, olho = 1) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = "#050506"; g.beginPath(); g.ellipse(0, -9, 9, 9, 0, 0, 7); g.fill(); g.beginPath(); g.arc(0, -22, 7, 0, 7); g.fill(); g.beginPath(); g.moveTo(-6, -26); g.lineTo(-5, -33); g.lineTo(-1, -28); g.moveTo(6, -26); g.lineTo(5, -33); g.lineTo(1, -28); g.fill(); g.strokeStyle = "#050506"; g.lineWidth = 3; g.lineCap = "round"; g.beginPath(); g.moveTo(8, -4); g.quadraticCurveTo(20, -6 + Math.sin(t * 2) * 4, 16, -20); g.stroke();
    if (olho > .1) { g.fillStyle = "#b8f06a"; g.beginPath(); g.ellipse(-3, -22, 1.8, 1.8 * olho, 0, 0, 7); g.ellipse(3, -22, 1.8, 1.8 * olho, 0, 0, 7); g.fill(); } g.fillStyle = "#e86a9a"; g.beginPath(); g.moveTo(0, -15); g.lineTo(-4, -18); g.lineTo(-4, -12); g.moveTo(0, -15); g.lineTo(4, -18); g.lineTo(4, -12); g.fill(); g.restore(); },
  chuva(g, w, h, t) {
    const raio = (t % 5.2) > 4.9; CENAS.ceu(g, w, h, raio ? "#5a6488" : "#0a0e1c", raio ? "#2a2e40" : "#141a24");
    CENAS.arvores(g, w, h * .58, h * .3, "#05070c", 3);
    g.fillStyle = "#1a1a1c"; g.beginPath(); g.moveTo(w * .42, h * .58); g.lineTo(w * .58, h * .58); g.lineTo(w * .95, h); g.lineTo(w * .05, h); g.fill(); // estrada
    g.fillStyle = "#3a2a1a"; g.fillRect(w * .3, h * .45, 6, h * .17); g.fillRect(w * .7 - 6, h * .45, 6, h * .17); for (let i = 0; i < 5; i++) g.fillRect(w * .3, h * (.48 + i * .025), w * .4, 3); // porteira
    g.fillStyle = "#4a3420"; g.fillRect(w * .36, h * .37, w * .28, h * .07); g.fillStyle = "#d8c8a0"; g.font = `700 ${Math.round(h * .03)}px "JetBrains Mono", monospace`; g.textAlign = "center"; g.fillText("SÍTIO DA VÓ BENEDITA", w * .5, h * .415);
    const cx = w * .5, cy = h * .9, cw = w * .34; g.fillStyle = "#200806"; g.fillRect(cx - cw / 2, cy - h * .2, cw, h * .16); g.fillRect(cx - cw * .35, cy - h * .3, cw * .7, h * .12); g.fillStyle = "rgba(160,190,220,.25)"; g.fillRect(cx - cw * .3, cy - h * .28, cw * .6, h * .08);
    g.fillStyle = "#e2201a"; g.fillRect(cx - cw / 2 + 6, cy - h * .16, 14, 9); g.fillRect(cx + cw / 2 - 20, cy - h * .16, 14, 9); g.fillStyle = "#050505"; g.fillRect(cx - cw / 2, cy - h * .05, cw, h * .05);
    g.globalCompositeOperation = "lighter"; const fa = g.createRadialGradient(w * .5, h * .55, 0, w * .5, h * .55, w * .3); fa.addColorStop(0, "rgba(255,240,190,.28)"); fa.addColorStop(1, "rgba(255,240,190,0)"); g.fillStyle = fa; g.fillRect(0, 0, w, h); g.globalCompositeOperation = "source-over";
    CENAS.chuvaFina(g, w, h, t, 260, .4); if (raio) { g.fillStyle = "rgba(220,230,255,.25)"; g.fillRect(0, 0, w, h); }
  },
  casa(g, w, h, t) {
    CENAS.ceu(g, w, h, "#070a14", "#121620"); CENAS.arvores(g, w, h * .7, h * .35, "#04060a", 8);
    const x = w * .28, y = h * .3, cw = w * .44, ch = h * .5; g.fillStyle = "#1e140c"; g.fillRect(x, y + ch * .2, cw, ch * .8); g.strokeStyle = "rgba(0,0,0,.4)"; for (let i = 1; i < 9; i++) { g.beginPath(); g.moveTo(x, y + ch * .2 + i * ch * .09); g.lineTo(x + cw, y + ch * .2 + i * ch * .09); g.stroke(); }
    g.fillStyle = "#120a06"; g.beginPath(); g.moveTo(x - w * .03, y + ch * .24); g.lineTo(x + cw / 2, y - ch * .25); g.lineTo(x + cw + w * .03, y + ch * .24); g.fill();
    const lu = .75 + .15 * Math.sin(t * 7); g.fillStyle = `rgba(255,190,100,${lu})`; g.fillRect(x + cw * .12, y + ch * .4, cw * .18, ch * .2); g.fillStyle = "#0a0604"; g.fillRect(x + cw * .7, y + ch * .4, cw * .18, ch * .2);
    g.fillStyle = "#050302"; g.fillRect(x + cw * .43, y + ch * .52, cw * .14, ch * .48); g.fillStyle = `rgba(255,190,100,${lu * .9})`; g.beginPath(); g.moveTo(x + cw * .43, y + ch * .52); g.lineTo(x + cw * .49, y + ch * .55); g.lineTo(x + cw * .49, y + ch); g.lineTo(x + cw * .43, y + ch); g.fill(); // porta entreaberta
    g.globalCompositeOperation = "lighter"; const fa = g.createLinearGradient(0, y + ch, 0, h); fa.addColorStop(0, "rgba(255,170,80,.25)"); fa.addColorStop(1, "rgba(255,170,80,0)"); g.fillStyle = fa; g.beginPath(); g.moveTo(x + cw * .43, y + ch); g.lineTo(x + cw * .49, y + ch); g.lineTo(x + cw * .62, h); g.lineTo(x + cw * .3, h); g.fill(); g.globalCompositeOperation = "source-over";
    if (Math.sin(t * .9) > .93) { g.fillStyle = "rgba(0,0,0,.9)"; g.beginPath(); g.arc(x + cw * .79, y + ch * .48, ch * .04, 0, 7); g.fill(); } // alguém na janela escura
    for (let i = 0; i < 3; i++) { g.fillStyle = `rgba(150,160,180,${.06 + i * .02})`; g.beginPath(); g.ellipse(((t * 20 + i * 300) % (w + 400)) - 200, h * (.82 + i * .05), w * .4, h * .05, 0, 0, 7); g.fill(); }
    CENAS.chuvaFina(g, w, h, t, 120, .2);
  },
  mata(g, w, h, t) {
    CENAS.ceu(g, w, h, "#05070c", "#0c1008"); CENAS.arvores(g, w, h * .82, h * .7, "#020304", 1);
    const k = Math.min(1, t / 6), px = w * (.4 + k * .16), py = h * (.8 - k * .12), s = 1 - k * .5;
    g.globalCompositeOperation = "lighter"; const lg = g.createRadialGradient(px + 10 * s, py - 20 * s, 0, px + 10 * s, py - 20 * s, 140 * s); lg.addColorStop(0, `rgba(255,210,130,${.5 * (1 - k * .6)})`); lg.addColorStop(1, "rgba(255,210,130,0)"); g.fillStyle = lg; g.fillRect(0, 0, w, h); g.globalCompositeOperation = "source-over";
    g.save(); g.globalAlpha = 1 - k * .7; g.translate(px, py); g.scale(s * 1.4, s * 1.4); g.fillStyle = "#000"; g.fillRect(-6, -30, 12, 30); g.beginPath(); g.arc(0, -36, 7, 0, 7); g.fill(); g.fillStyle = "rgba(255,220,140,.95)"; g.fillRect(9, -20, 5, 6); g.restore();
    CENAS.menina(g, w * .14, h * .97, 1.6, true); g.fillStyle = "#1a120c"; g.fillRect(0, h * .97, w * .3, h * .03);
    if (t > 3 && Math.sin(t * 2.1) > .3) { g.fillStyle = "rgba(255,140,70,.8)"; g.fillRect(w * .78, h * .5, 3, 3); g.fillRect(w * .78 + 9, h * .5, 3, 3); }
  },
  lanterna(g, w, h, t) {
    CENAS.ceu(g, w, h, "#030406", "#0a0c08"); CENAS.arvores(g, w, h * .7, h * .6, "#010102", 5);
    g.fillStyle = "#1a140c"; g.beginPath(); g.moveTo(w * .45, h * .7); g.lineTo(w * .55, h * .7); g.lineTo(w * .8, h); g.lineTo(w * .2, h); g.fill();
    const k = Math.min(1, t / 7), lx = w * (.5 + Math.sin(t * 1.3) * .02), ly = h * (.72 + k * .2), s = .6 + k * .9, rot = t * 2.2;
    g.globalCompositeOperation = "lighter"; const lg = g.createRadialGradient(lx, ly, 0, lx, ly, 120 * s); lg.addColorStop(0, "rgba(255,210,130,.45)"); lg.addColorStop(1, "rgba(255,210,130,0)"); g.fillStyle = lg; g.fillRect(0, 0, w, h); g.globalCompositeOperation = "source-over";
    g.save(); g.translate(lx, ly); g.rotate(Math.PI / 2 + Math.sin(rot) * .3); g.scale(s, s); g.fillStyle = "#2a2a2a"; g.fillRect(-9, -14, 18, 24); g.fillStyle = "rgba(255,220,140,.95)"; g.fillRect(-6, -10, 12, 16); g.strokeStyle = "#2a2a2a"; g.lineWidth = 2; g.beginPath(); g.arc(0, -16, 7, PI, 0); g.stroke(); g.restore();
    for (let i = 0; i < 9; i++) { if (Math.sin(t * (1 + i * .3) + i * 2) < .2 || t < i * .6) continue; const ex = w * (.08 + ((i * .37) % 1) * .84), ey = h * (.35 + ((i * .23) % 1) * .3); g.fillStyle = i % 3 ? "rgba(240,240,230,.85)" : "rgba(230,60,40,.9)"; g.fillRect(ex, ey, 3, 3); g.fillRect(ex + 8, ey, 3, 3); }
  },
  caderno(g, w, h, t) {
    g.fillStyle = "#1a100a"; g.fillRect(0, 0, w, h); for (let i = 0; i < 9; i++) { g.fillStyle = i % 2 ? "rgba(0,0,0,.2)" : "rgba(255,255,255,.02)"; g.fillRect(0, i * h / 9, w, h / 9); }
    const x = w * .2, y = h * .1, pw = w * .3, ph = h * .62; g.fillStyle = "rgba(0,0,0,.5)"; g.fillRect(x + 8, y + 10, pw * 2, ph);
    g.fillStyle = "#d8ccae"; g.fillRect(x, y, pw, ph); g.fillStyle = "#cfc2a2"; g.beginPath(); g.moveTo(x + pw, y); g.lineTo(x + pw * 2, y); for (let i = 0; i <= 12; i++) g.lineTo(x + pw * 2 - (i % 2 ? 14 : 0) - pw * (i / 12) * .35, y + ph * i / 12); g.lineTo(x + pw, y + ph); g.fill(); // página rasgada
    g.strokeStyle = "rgba(60,40,20,.7)"; g.fillStyle = "#3a2410"; g.font = `700 ${Math.round(h * .042)}px "Big Shoulders Display", sans-serif`; g.fillText("AS REGRAS DO SÍTIO", x + pw * .08, y + ph * .12);
    g.lineWidth = 1.3; for (let i = 0; i < 11; i++) { const ly = y + ph * (.22 + i * .07), lw = pw * (.6 + ((i * 7) % 4) / 10), k = cl((t - i * .35) / .5, 0, 1); g.beginPath(); for (let j = 0; j < 30 * k; j++) g.lineTo(x + pw * .1 + j * lw / 30, ly + Math.sin(j * 1.9 + i) * 2.5); g.stroke(); }
    g.lineWidth = 1.3; for (let i = 0; i < 8; i++) { const ly = y + ph * (.12 + i * .08); g.beginPath(); for (let j = 0; j < 24; j++) g.lineTo(x + pw * 1.08 + j * pw * .022, ly + Math.sin(j * 2.3 + i) * 3 + (i > 5 ? Math.sin(t * 8 + j) : 0)); g.stroke(); }
    g.fillStyle = "rgba(120,20,10,.5)"; g.beginPath(); g.ellipse(x + pw * 1.5, y + ph * .82, 14, 8, .4, 0, 7); g.fill(); // mancha
    const vx = w * .82, vy = h * .5; g.fillStyle = "#e8e2d0"; g.fillRect(vx - 7, vy, 14, h * .22); g.fillStyle = `rgba(255,${190 + Math.sin(t * 20) * 30},90,.95)`; g.beginPath(); g.ellipse(vx + Math.sin(t * 9), vy - 10, 5, 10, 0, 0, 7); g.fill();
    g.globalCompositeOperation = "lighter"; const lg = g.createRadialGradient(vx, vy - 10, 0, vx, vy - 10, w * .5); lg.addColorStop(0, `rgba(255,180,90,${.3 + .05 * Math.sin(t * 13)})`); lg.addColorStop(1, "rgba(255,180,90,0)"); g.fillStyle = lg; g.fillRect(0, 0, w, h); g.globalCompositeOperation = "source-over";
  },
  sombrinha(g, w, h, t) {
    CENAS.ceu(g, w, h, "#060810", "#0e1018"); CENAS.arvores(g, w, h * .55, h * .3, "#030406", 4);
    g.fillStyle = "#2a1a10"; g.fillRect(0, h * .62, w, h * .38); g.strokeStyle = "rgba(0,0,0,.45)"; for (let i = 0; i < 14; i++) { g.beginPath(); g.moveTo(i * w / 14, h * .62); g.lineTo(i * w / 14 - w * .05, h); g.stroke(); }
    g.fillStyle = "#1a100a"; g.fillRect(w * .05, h * .2, 10, h * .44); g.fillRect(w * .95 - 10, h * .2, 10, h * .44); g.fillRect(0, h * .18, w, 10);
    const lu = g.createRadialGradient(w * .22, h * .3, 0, w * .22, h * .3, w * .4); lu.addColorStop(0, "rgba(255,190,110,.25)"); lu.addColorStop(1, "rgba(255,190,110,0)"); g.fillStyle = lu; g.fillRect(0, 0, w, h); g.fillStyle = "#3a3a3a"; g.fillRect(w * .22 - 6, h * .26, 12, 16); g.fillStyle = `rgba(255,210,130,${.8 + .1 * Math.sin(t * 8)})`; g.fillRect(w * .22 - 3, h * .27, 6, 10);
    CENAS.menina(g, w * .4, h * .86, 2.6, true);
    const k = Math.min(1, t / 3.5), gx = mix(w * 1.05, w * .58, k), pis = (t % 4) > 3.85 ? .1 : 1; CENAS.gata(g, gx, h * .86 + (k < 1 ? Math.abs(Math.sin(t * 8)) * -4 : 0), 2.6, t, pis);
  },
  fim(g, w, h, t) {
    CENAS.ceu(g, w, h, "#2a1830", "#c8662a"); const sol = g.createRadialGradient(w * .5, h * .72, 0, w * .5, h * .72, w * .4); sol.addColorStop(0, "rgba(255,210,140,.7)"); sol.addColorStop(1, "rgba(255,210,140,0)"); g.fillStyle = sol; g.fillRect(0, 0, w, h);
    CENAS.arvores(g, w, h * .74, h * .25, "#140a0c", 9); g.fillStyle = "#140a0c"; g.fillRect(w * .62, h * .6, w * .12, h * .14); g.beginPath(); g.moveTo(w * .6, h * .61); g.lineTo(w * .68, h * .53); g.lineTo(w * .76, h * .61); g.fill(); g.fillRect(w * .3, h * .5, 3, h * .24);
    for (let i = 0; i < 8; i++) { const an = t * 1.5 + i * PI / 4; g.beginPath(); g.moveTo(w * .3 + 1, h * .5); g.lineTo(w * .3 + 1 + Math.cos(an) * 22, h * .5 + Math.sin(an) * 22); g.lineWidth = 3; g.strokeStyle = "#140a0c"; g.stroke(); }
    g.fillStyle = "#0a0506"; g.fillRect(0, h * .8, w, h * .2); CENAS.menina(g, w * .46, h * .93, 2.3, false); CENAS.gata(g, w * .53, h * .93, 1.7, t);
    const k = cl((t - .8) / 1.6, 0, 1); g.globalAlpha = k; g.fillStyle = "#f4efe4"; g.font = `900 ${Math.round(Math.min(w * .09, h * .15))}px "Big Shoulders Display", sans-serif`; g.textAlign = "center"; g.fillText("ROÇA ASSOMBRADA", w / 2, h * .3); g.fillStyle = "#e07a2a"; g.font = `700 ${Math.round(h * .035)}px "JetBrains Mono", monospace`; g.fillText("YASMIN E SOMBRINHA", w / 2, h * .38); g.globalAlpha = 1; g.textAlign = "start";
  },
};
function somCena(cena) {
  if (!AC || mudo) return;
  if (cena === "chuva" || cena === "casa") { tocarRuido(7, { filtro: "bandpass", f: 2600, q: .5, vol: cena === "chuva" ? .09 : .05, atk: .6, wet: .2 }); if (cena === "chuva") tocarRuido(2.4, { filtro: "lowpass", f: 180, vol: .35, quando: 4.9, atk: .05, wet: .7 }); }
  if (cena === "casa") for (let i = 0; i < 8; i++) tocarRuido(.03, { f: 3000, q: 6, vol: .05, quando: i * .6 + .3 }); // relógio
  if (cena === "mata") { S.estalos(60, 12); tocarTom(55, 6, { tipo: "sawtooth", vol: .02, lp: 160, atk: 2 }); }
  if (cena === "lanterna") { tocarTom(48, 7, { tipo: "sawtooth", vol: .03, lp: 140, atk: 1.5 }); for (let i = 0; i < 5; i++) tocarRuido(.08, { filtro: "lowpass", f: 600, vol: .08, quando: 1 + i * 1.1 }); }
  if (cena === "caderno") { tocarRuido(.5, { filtro: "highpass", f: 2500, vol: .06, atk: .1 }); tocarTom(220, 5, { tipo: "triangle", vol: .015, lp: 800, atk: 1.5, wet: .6 }); }
  if (cena === "sombrinha") { tocarTom(720, .4, { tipo: "triangle", vol: .05, ate: 540, lp: 2000, quando: 3.4 }); }
  if (cena === "fim") [196, 247, 294, 392].forEach((f, i) => tocarTom(f, 4, { tipo: "triangle", vol: .03, quando: i * .25, wet: .6, atk: .3 }));
}
function historia(depois) {
  const d = document.createElement("div"); d.className = "rc-hist"; d.innerHTML = `<canvas></canvas><div class="rc-hist-txt"><p></p><small>Toque para continuar</small></div><button type="button" class="rc-pular">Pular</button>`;
  document.getElementById("roca").appendChild(d);
  const hc = d.querySelector("canvas"), g = hc.getContext("2d"), pt = d.querySelector("p");
  let i = 0, ch = 0, t0 = performance.now(), vivo = true;
  const tam = () => { const dp = Math.min(devicePixelRatio || 1, 2); hc.width = Math.round(innerWidth * dp); hc.height = Math.round(innerHeight * dp); g.setTransform(dp, 0, 0, dp, 0, 0); };
  tam(); addEventListener("resize", tam);
  const mostrar = () => { ch = 0; t0 = performance.now(); try { if (typeof narrar === "function") narrar(HIST[i].txt); } catch (e) {} somCena(HIST[i].cena); };
  const fim = () => { if (!vivo) return; vivo = false; removeEventListener("resize", tam); try { calar(); } catch (e) {} d.remove(); ls("roca_hist", 1); depois && depois(); };
  const avancar = () => { if (ch < HIST[i].txt.length) { ch = HIST[i].txt.length; return; } i++; tocarTom(600, .05, { vol: .04 }); if (i >= HIST.length) return fim(); mostrar(); };
  d.addEventListener("pointerdown", e => { if (e.target.classList.contains("rc-pular")) return; e.preventDefault(); initAudio(); avancar(); });
  d.querySelector(".rc-pular").addEventListener("click", fim);
  window.rocaHistAvancar = avancar; // usado nos testes
  const caixa = d.querySelector(".rc-hist-txt");
  const quadro = ts => { if (!vivo) return; const w = innerWidth, H0 = innerHeight, h = Math.max(H0 * .55, H0 - caixa.offsetHeight - 22), tt = (ts - t0) / 1000; ch = Math.max(ch, Math.min(HIST[i].txt.length, Math.floor(tt * 34)));
    pt.textContent = HIST[i].txt.slice(0, ch); g.fillStyle = "#000"; g.fillRect(0, 0, w, H0); g.save(); g.beginPath(); g.rect(0, 0, w, h); g.clip(); CENAS[HIST[i].cena](g, w, h, tt); g.restore();
    const vg = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * .3, w / 2, h / 2, Math.max(w, h) * .7); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,.6)"); g.fillStyle = vg; g.fillRect(0, 0, w, h);
    requestAnimationFrame(quadro); };
  mostrar(); requestAnimationFrame(quadro);
}

/* ---------- online: salas com código (PeerJS) ---------- */
// Quem cria a sala é o anfitrião e roda o jogo; o amigo manda os movimentos e recebe o mundo ~10 vezes por segundo.
// Nos testes automáticos (?bc) a conexão é feita por BroadcastChannel entre duas abas.
const Net = { peer: null, conn: null, bc: null, papel: null, envT: 0 };
const PREFIXO = "ultimaescolha-roca-";
const usarBC = () => /[?&]bc\b/.test(location.search);
const novoCodigo = () => Array.from({ length: 5 }, () => "ABCDEFGHJKMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 31)]).join("");
const ICE = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }, { urls: "stun:global.stun.twilio.com:3478" }] };
function enviar(o) { try { if (Net.bc) Net.bc.postMessage(o); else if (Net.conn && Net.conn.open) Net.conn.send(o); } catch (e) {} }
function netFechar() { try { if (Net.conn) Net.conn.close(); } catch (e) {} try { if (Net.peer) Net.peer.destroy(); } catch (e) {} try { if (Net.bc) { Net.bc.postMessage({ t: "tchau" }); Net.bc.close(); } } catch (e) {} Net.peer = Net.conn = Net.bc = null; Net.papel = null; }
function ligarConn(conn, aoAbrir) { Net.conn = conn; conn.on("open", () => aoAbrir && aoAbrir()); conn.on("data", netReceber); conn.on("close", netCaiu); conn.on("error", netCaiu); }
function netCriar(aoCodigo, aoEntrar, aoErro) {
  netFechar(); Net.papel = "host"; const cod = novoCodigo();
  if (usarBC()) { Net.bc = new BroadcastChannel("roca-" + cod); Net.bc.onmessage = e => { if (e.data && e.data.t === "oi" && !Net.ligado) { Net.ligado = true; aoEntrar(); } else netReceber(e.data); }; setTimeout(() => aoCodigo(cod), 50); return; }
  if (typeof Peer !== "function") return aoErro("O online não carregou. Confira a internet e tente de novo.");
  const peer = new Peer(PREFIXO + cod, { debug: 0, config: ICE }); Net.peer = peer;
  peer.on("open", () => aoCodigo(cod));
  peer.on("connection", conn => { if (Net.conn && Net.conn.open) { conn.on("open", () => { conn.send({ t: "cheia" }); setTimeout(() => conn.close(), 300); }); return; } ligarConn(conn, () => aoEntrar()); });
  peer.on("disconnected", () => { try { peer.reconnect(); } catch (e) {} });
  peer.on("error", e => { if (e.type === "unavailable-id") return netCriar(aoCodigo, aoEntrar, aoErro); aoErro(e.type === "network" || e.type === "server-error" || e.type === "socket-error" ? "Sem conexão com o servidor do online. Confira a internet." : "Erro no online: " + e.type); });
}
function netEntrar(cod, aoConectar, aoErro) {
  netFechar(); Net.papel = "guest"; cod = cod.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (cod.length !== 5) return aoErro("O código tem 5 letras/números.");
  if (usarBC()) { Net.bc = new BroadcastChannel("roca-" + cod); Net.bc.onmessage = e => netReceber(e.data); Net.bc.postMessage({ t: "oi" }); aoConectar(); return; }
  if (typeof Peer !== "function") return aoErro("O online não carregou. Confira a internet e tente de novo.");
  const peer = new Peer(undefined, { debug: 0, config: ICE }); Net.peer = peer; let ok = false;
  const desiste = setTimeout(() => { if (!ok) aoErro("Não consegui falar com essa sala. Às vezes a rede (4G ou Wi-Fi) bloqueia; tente outra rede."); }, 20000);
  peer.on("open", () => ligarConn(peer.connect(PREFIXO + cod, { reliable: true, serialization: "json" }), () => { ok = true; clearTimeout(desiste); enviar({ t: "oi" }); aoConectar(); }));
  peer.on("error", e => { clearTimeout(desiste); aoErro(e.type === "peer-unavailable" ? "Não achei essa sala. Confira o código (e se o amigo ainda está esperando)." : e.type === "network" || e.type === "server-error" || e.type === "socket-error" ? "Sem conexão com o servidor do online. Confira a internet." : "Erro no online: " + e.type); });
}
function netCaiu() {
  if (!Net.papel) return; const era = Net.papel; netFechar();
  if (!R || !window.rocaAtiva) return;
  if (era === "host") { R.outro = null; R.online = null; efeito("Seu amigo saiu. Você continua sozinha.", "#e8e2d4"); return; }
  painelAberto = true; el.rcPainel.hidden = false; el.rcPainel.innerHTML = `<div class="rc-caixa"><h2>A conexão caiu</h2><p>Perdemos o contato com a sala do seu amigo.</p><div class="rc-linha"><button type="button" class="rc-op dest" id="rcSair">Voltar</button></div></div>`;
  document.getElementById("rcSair").addEventListener("click", () => { fecharPainel(); menuInicial(); });
}
const novoOutro = () => ({ eu: { x: 14.2, y: 12.9, dir: 1, anda: 0, fase: 0 }, dentro: false, sala: { x: 5.6, y: 5.6, dir: 1 }, lanterna: false, correndo: false, regando: 0, velaCom: false, pesca: null, perto: 0, caido: null, folego: 100, chapeu: "palha", semente: 0, cor: 1, agua: 5, vidas: 2 });
function netReceber(d) {
  if (!d || !d.t) return;
  if (d.t === "tchau") return netCaiu();
  if (d.t === "chat") return receberChat(d.txt);
  if (Net.papel === "host") {
    if (!R || !R.outro) return; const o = R.outro;
    if (d.t === "eu") { if (!o.caido) { Object.assign(o.eu, d.eu); o.dentro = d.dentro; o.sala = d.sala; } o.lanterna = d.lanterna && R.oleo > 0 && !o.caido; o.correndo = d.correndo; o.chapeu = d.chapeu; o.semente = cl(d.semente | 0, 0, R.sementes.length - 1); }
    else if (d.t === "acao") { comJogador(o, () => { const a = oQueFazer(); if (a && !a.loc && a.t.split(" ")[0] === String(d.nome).split(" ")[0]) a.fn(); }); hud(); }
    else if (d.t === "compra") { const op = opcoesBancada().find(x => x.nome === d.nome); if (op && op.ok) { R.moedas -= op.preco; comJogador(o, op.fn); S.moedas(); hud(); } }
    else if (d.t === "peixe") { R.peixes[d.nome] = (R.peixes[d.nome] || 0) + 1; hud(); }
    return;
  }
  if (Net.papel === "guest") {
    if (d.t === "cheia") { aoErroLobby && aoErroLobby("Essa sala já tem dois jogadores."); netFechar(); return; }
    if (d.t === "inicio") { iniciarJogo("guest"); return; }
    if (!R || R.online !== "guest") return;
    if (d.t === "s") aplicarEstado(d);
    else if (d.t === "som" && SOM_ORIG[d.k]) SOM_ORIG[d.k](...(d.a || []));
    else if (d.t === "caiu") cairLocal(d.quem);
    else if (d.t === "pos") { R.eu.x = d.x; R.eu.y = d.y; R.dentro = false; R.caido = null; }
  }
}
let aoErroLobby = null;
// os sons do anfitrião tocam também no celular do amigo (menos os passos)
const SOM_ORIG = {}; Object.keys(S).forEach(k => { SOM_ORIG[k] = S[k]; if (k === "passo") return; S[k] = (...a) => { SOM_ORIG[k](...a); if (R && R.online === "host" && R.outro) enviar({ t: "som", k, a }); }; });
function cairLocal(quem) { if (R.caido) return; R.caido = { quem, t: 0 }; R.dentro = false; R.lanterna = false; R.correndo = false; SOM_ORIG.susto(); try { vibrar(400); } catch (e) {} }
function estadoPara() {
  const pl = q => ({ eu: { x: q.eu.x, y: q.eu.y, dir: q.eu.dir, anda: q.eu.anda, fase: q.eu.fase }, dentro: q.dentro, sala: q.sala, lanterna: q.lanterna, regando: q.regando, chapeu: q.chapeu, caido: q.caido ? { quem: q.caido.quem, fora: q.caido.fora } : null, velaCom: q.velaCom, cor: q.cor, perto: q.perto, vidas: q.vidas, agua: q.agua });
  const o = R.outro;
  return { t: "s", T: R.t, dia: R.dia, moedas: R.moedas, agua: R.agua, aguaMax: R.aguaMax, oleo: R.oleo, vel: R.vel, lanternaBoa: R.lanternaBoa, sementes: R.sementes, vara: R.vara, pecas: R.pecas, peneira: R.peneira,
    inv: R.inv, colheita: R.colheita, peixes: R.peixes, extra: R.extra, ovos: R.ovos, frutas: R.frutas, mel: R.mel, lamparinas: R.lamparinas, pisadeira: R.pisadeira, canteiros: R.canteiros.map(k => [k.aberto, k.covas]),
    gato: R.gato, cachorro: R.cachorro, seco: R.seco, vulto: R.vulto, vela: R.vela, velaEntregue: R.velaEntregue, velaHoje: R.velaHoje, alma: R.alma, galinhas: R.galinhas, porcos: R.porcos,
    aranha: R.aranha, mula: R.mula, saci: R.saci, esp: R.esp, queimado: R.queimado, sinoT: R.sinoT, sinoUsado: R.sinoUsado, fx: R.fx, morto: R.morto, venceu: R.venceu ? { t: R.venceu.t } : null, tempoTotal: R.tempoTotal,
    outro: pl(R), voce: o ? { caido: o.caido ? { quem: o.caido.quem, fora: o.caido.fora } : null, velaCom: o.velaCom, regando: o.regando, agua: o.agua, vidas: o.vidas } : null };
}
const SUAVE = ["gato", "cachorro", "seco", "aranha", "esp", "saci", "vulto", "mula"];
function aplicarEstado(d) {
  const suave = (velho, novo) => { if (velho && novo && novo.x != null && velho.x != null && Math.hypot(novo.x - velho.x, novo.y - velho.y) < 4) { novo.ax = novo.x; novo.ay = novo.y; novo.x = velho.x; novo.y = velho.y; } };
  SUAVE.forEach(k => suave(R[k], d[k])); ["galinhas", "porcos"].forEach(k => d[k] && d[k].forEach((g, i) => suave(R[k] && R[k][i], g)));
  if (d.outro && R.outro) { const a = d.outro.eu, b = R.outro.eu; suave(b, a); if (d.outro.sala && R.outro.sala) suave(R.outro.sala, d.outro.sala); }
  ["dia", "moedas", "aguaMax", "oleo", "vel", "lanternaBoa", "sementes", "vara", "pecas", "peneira", "inv", "colheita", "peixes", "extra", "ovos", "frutas", "mel", "lamparinas", "pisadeira",
    "gato", "cachorro", "seco", "vulto", "vela", "velaEntregue", "velaHoje", "alma", "galinhas", "porcos", "aranha", "mula", "saci", "esp", "queimado", "sinoT", "sinoUsado", "outro", "tempoTotal"].forEach(k => { R[k] = d[k]; });
  R.t = d.T; R.fxR = d.fx || []; R.semente = cl(R.semente, 0, R.sementes.length - 1);
  d.canteiros.forEach(([a, cv2], i) => { R.canteiros[i].aberto = a; R.canteiros[i].covas = cv2; });
  if (d.voce) { R.agua = d.voce.agua; R.vidas = d.voce.vidas; if (d.voce.caido) { cairLocal(d.voce.caido.quem); R.caido.fora = d.voce.caido.fora; } else if (R.caido && R.caido.t > 2.5) R.caido = null; R.velaCom = d.voce.velaCom; if (d.voce.regando > 0) R.regando = d.voce.regando; }
  if (d.morto && !R.morto) { R.morto = { ...d.morto, t: 0 }; SOM_ORIG.susto(); try { vibrar(500); } catch (e) {} setTimeout(() => R && R.morto && telaFim("morreu"), 2300); }
  if (d.venceu && !R.venceu) { R.venceu = { t: d.venceu.t }; R.lanterna = false; }
  if (!d.morto && !d.venceu && (R.morto || R.venceu)) { R.morto = null; R.venceu = null; }
}
function atualizarConvidado(dt) {
  if (R.menu) return;
  R.fx.forEach(f => f.t += dt); R.fx = R.fx.filter(f => f.t < 1.8); (R.fxR || []).forEach(f => f.t += dt);
  R.poeira.forEach(q => { q.t += dt; q.y -= dt * .3; }); R.poeira = R.poeira.filter(q => q.t < .8);
  if (R.susto > 0) R.susto -= dt; if (R.tremor > 0) R.tremor -= dt;
  const k = Math.min(1, dt * 10), lerp = o => { if (o && o.ax != null) { o.x = mix(o.x, o.ax, k); o.y = mix(o.y, o.ay, k); } };
  SUAVE.forEach(n => lerp(R[n])); R.galinhas.forEach(lerp); R.porcos.forEach(lerp); if (R.outro) { lerp(R.outro.eu); lerp(R.outro.sala); }
  if (R.morto) { R.morto.t += dt; return; }
  if (R.venceu) { R.venceu.t += dt; if (R.venceu.t > 4.5 && !R.venceu.tela) { R.venceu.tela = true; telaFim("venceu"); } return; }
  if (R.caido) R.caido.t += dt;
  R.t += dt; // o relógio anda entre um pacote e outro
  moverLocal(dt); atualizarPesca(dt);
  if (R.oleo <= 0) R.lanterna = false;
  R.perto = calcPerto(); musicaPasso(dt);
  Net.envT -= dt; if (Net.envT <= 0) { Net.envT = .066; enviar({ t: "eu", eu: { x: R.eu.x, y: R.eu.y, dir: R.eu.dir, anda: R.eu.anda, fase: R.eu.fase }, dentro: R.dentro, sala: R.sala, lanterna: R.lanterna, correndo: R.correndo, chapeu: R.chapeu, semente: R.semente }); }
  if (Math.floor(R.t * 2) !== Math.floor((R.t - dt) * 2)) hud();
  const o = oQueFazer(); el.rcAcao.textContent = o ? o.t : "Ação"; el.rcAcao.style.opacity = o ? 1 : .5;
}

/* ---------- chat do online ---------- */
const CHAT = { meu: null, dele: null, log: [] };
function abrirChat(abrir) { el.rcChatBar.hidden = !abrir; el.rcChatN.hidden = true; if (abrir) setTimeout(() => { try { el.rcChatIn.focus(); } catch (e) {} }, 50); else try { el.rcChatIn.blur(); } catch (e) {} }
function limparTexto(t) { return String(t || "").replace(/[\u0000-\u001f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80); }
function mandarChat(t) { t = limparTexto(t); if (!t || !R || !R.online) return; enviar({ t: "chat", txt: t }); CHAT.meu = { txt: t, t: performance.now() }; logChat(t, true); tocarTom(820, .06, { vol: .04 }); }
function receberChat(t) { t = limparTexto(t); if (!t || !R || !R.online) return; CHAT.dele = { txt: t, t: performance.now() }; logChat(t, false); tocarTom(660, .08, { tipo: "triangle", vol: .06 }); tocarTom(990, .08, { tipo: "triangle", vol: .05, quando: .09 }); if (el.rcChatBar.hidden) el.rcChatN.hidden = false; }
function logChat(t, eu) {
  const d = document.createElement("div"); d.className = eu ? "eu" : ""; const b = document.createElement("b"); b.textContent = eu ? "Você:" : (R.online === "host" ? "Amigo(a):" : "Yasmin:"); d.append(b, document.createTextNode(t));
  el.rcChatLog.appendChild(d); while (el.rcChatLog.children.length > 4) el.rcChatLog.firstChild.remove();
  setTimeout(() => { d.style.opacity = "0"; setTimeout(() => d.remove(), 700); }, 12000);
}
function balaoChat(p, m) {
  const idade = (performance.now() - m.t) / 1000; if (idade > 5) return; const a = Math.min(1, (5 - idade) / .6), x = PX(p.x), y = PY(p.y) - TS * 1.55;
  c.save(); c.globalAlpha = a; c.font = `600 ${Math.round(Math.max(12, TS * .27))}px "Source Serif 4", Georgia, serif`;
  const pal = m.txt.split(" "), linhas = []; let l = ""; for (const w of pal) { const t2 = l ? l + " " + w : w; if (c.measureText(t2).width > TS * 3.6 && l) { linhas.push(l); l = w; } else l = t2; } if (l) linhas.push(l);
  const lh = Math.max(14, TS * .32), w = Math.max(...linhas.map(t2 => c.measureText(t2).width)) + 16, h = linhas.length * lh + 10;
  c.fillStyle = "rgba(244,239,228,.95)"; c.beginPath(); c.roundRect ? c.roundRect(x - w / 2, y - h, w, h, 9) : c.rect(x - w / 2, y - h, w, h); c.fill(); c.beginPath(); c.moveTo(x - 6, y); c.lineTo(x, y + 7); c.lineTo(x + 6, y); c.fill();
  c.fillStyle = "#1a1410"; c.textAlign = "center"; linhas.forEach((t2, i) => c.fillText(t2, x, y - h + 5 + lh * (i + .78))); c.textAlign = "start"; c.restore();
}
window.rocaChat = mandarChat; // usado nos testes

/* ---------- menu do modo: sozinha, criar sala, entrar ---------- */
function menuInicial() {
  netFechar(); if (!R || !R.menu) { novoJogo(); R.menu = true; R.t = DIA - 20; } hud();
  painelAberto = true; el.rcPainel.hidden = false;
  el.rcPainel.innerHTML = `<div class="rc-caixa"><h2>Roça Assombrada</h2><p>Yasmin, a gatinha Sombrinha e um sítio cheio de regras. Jogue sozinha ou chame um amigo pela internet.</p>
    <div class="rc-grade"><button type="button" class="rc-op dest" id="rcSolo">Jogar sozinha<small>Você e a Sombrinha</small></button>
    <button type="button" class="rc-op" id="rcCriar">Criar sala online<small>Gera um código para mandar ao amigo</small></button>
    <button type="button" class="rc-op" id="rcEntrarSala">Entrar numa sala<small>Digite o código do amigo</small></button>
    <button type="button" class="rc-op" id="rcHistBt">Ver a história<small>Como tudo começou</small></button></div>
    <div class="rc-linha"><button type="button" class="rc-op" id="rcSair">Voltar ao menu do jogo</button></div></div>`;
  document.getElementById("rcSolo").addEventListener("click", () => iniciarJogo("solo"));
  document.getElementById("rcCriar").addEventListener("click", criarSala);
  document.getElementById("rcEntrarSala").addEventListener("click", entrarSala);
  document.getElementById("rcHistBt").addEventListener("click", () => { fecharPainel(); historia(menuInicial); });
  document.getElementById("rcSair").addEventListener("click", () => { fecharPainel(); sairRoca(); });
}
function telaSala(html) { painelAberto = true; el.rcPainel.hidden = false; el.rcPainel.innerHTML = `<div class="rc-caixa">${html}<div class="rc-linha"><button type="button" class="rc-op" id="rcCancelar">Cancelar</button></div></div>`; document.getElementById("rcCancelar").addEventListener("click", () => { netFechar(); menuInicial(); }); }
function criarSala() {
  telaSala(`<h2>Criando sala...</h2><p id="rcSt">Conectando ao servidor do online.</p>`);
  const st = t => { const e = document.getElementById("rcSt"); if (e) e.textContent = t; };
  netCriar(cod => telaSala(`<h2>Sala criada</h2><p>Mande este código para o seu amigo. Ele abre a Roça Assombrada, toca em <b>Entrar numa sala</b> e digita:</p>
      <div class="rc-codigo" id="rcCodigo">${cod}</div><p id="rcSt" style="font-size:13px">Esperando o amigo entrar... (os dois precisam de internet)</p>`),
    () => iniciarJogo("host"), err => st(err));
}
function entrarSala() {
  telaSala(`<h2>Entrar numa sala</h2><p>Digite o código de 5 letras que seu amigo recebeu ao criar a sala.</p>
    <input class="rc-input" id="rcCod" maxlength="5" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="ABC12">
    <div class="rc-linha"><button type="button" class="rc-op dest" id="rcIr">Entrar</button></div><p id="rcSt" style="font-size:13px"></p>`);
  const inp = document.getElementById("rcCod"), st = t => { const e = document.getElementById("rcSt"); if (e) e.textContent = t; };
  inp.addEventListener("input", () => { inp.value = inp.value.toUpperCase().replace(/[^A-Z0-9]/g, ""); });
  setTimeout(() => { try { inp.focus(); } catch (e) {} }, 100);
  aoErroLobby = st;
  const ir = () => { st("Procurando a sala..."); netEntrar(inp.value, () => st("Conectado! Esperando o anfitrião começar..."), st); };
  document.getElementById("rcIr").addEventListener("click", ir); inp.addEventListener("keydown", e => { e.stopPropagation(); if (e.key === "Enter") ir(); });
}
function iniciarJogo(modo) {
  fecharPainel(); novoJogo(); R.online = modo === "solo" ? null : modo; R.cor = modo === "guest" ? 1 : 0;
  if (modo === "guest") { R.eu.x = 14.2; R.eu.y = 12.9; }
  if (modo === "host") { R.outro = novoOutro(); enviar({ t: "inicio" }); }
  hud();
  const comeca = () => { if (!R) return; R.menu = false; tutorial(); };
  if (!ls("roca_hist")) { R.menu = modo === "solo"; historia(comeca); } else comeca();
}

/* ---------- entrar e sair ---------- */
window.entrarRoca = function () {
  montarUI(); initAudio();
  try { if (window.Android && Android.orientacao) Android.orientacao("paisagem"); } catch (e) {}
  if (typeof calar === "function") calar(); if (typeof pararTudo === "function") pararTudo(); setAmb({});
  document.getElementById("roca").hidden = false; window.rocaAtiva = true;
  setTimeout(medir, 50); setTimeout(medir, 400); medir();
  R = null; menuInicial(); rodando = true; ultimo = performance.now(); requestAnimationFrame(loop);
};
window.sairRoca = function () {
  netFechar(); rodando = false; window.rocaAtiva = false; R = null; painelAberto = false;
  const d = document.getElementById("roca"); if (d) d.hidden = true;
  try { if (window.Android && Android.orientacao) Android.orientacao("retrato"); } catch (e) {}
  if (typeof abrirHub === "function") abrirHub();
};
window.rocaVoltar = () => { if (!window.rocaAtiva) return false; if (el.rcChatBar && !el.rcChatBar.hidden) { abrirChat(false); return true; } if (document.querySelector(".rc-hist")) return true; if (R && R.menu) { if (painelAberto && document.getElementById("rcCancelar")) { netFechar(); menuInicial(); } else { fecharPainel(); sairRoca(); } return true; } if (painelAberto) { if (R && (R.morto || R.venceu)) return true; fecharPainel(); } else pausar(); return true; };
window.rocaNet = Net; window.rocaHistoria = () => historia(() => {});
window.rocaEstado = () => R; // usado nos testes
window.morrerTeste = () => morrer("seco", "teste", "teste");
})();

