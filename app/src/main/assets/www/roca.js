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
const POCO = { x: 19.5, y: 9.6 }, CAIXOTE = { x: 16.8, y: 12 }, CAMINHONETE = { x: 28.8, y: 31.2 };
const CEMITERIO = { x0: 39, y0: 24, x1: 45, y1: 31 }, CRUZ = { x: 42, y: 27.2 };
const GALINHEIRO = { x: 27, y: 6.6, w: 4, h: 3, porta: { x: 29, y: 9.8 } }, CERCADO = { x0: 25.5, y0: 6.2, x1: 33, y1: 12 };
const CELEIRO = { x: 36, y: 6.5, w: 7, h: 5 }, TRATOR = { x: 45.2, y: 16.6 };
const CASINHA = { x: 7.6, y: 9.6 }, CATAVENTO = { x: 23, y: 17.4 }, VARAL = { x0: 17.4, x1: 21.6, y: 6.8 };
const DOCA = { x: 31.4, y: 27.4 };
const LAGO = { x0: 32, y0: 24, x1: 38.4, y1: 31 };
const POMAR = [[35.6, 16.5], [38.3, 16.5], [42.8, 16.5], [35.6, 19.8], [38.3, 19.8], [42.8, 19.8]];
const CANTEIROS = [
  { x: 9, y: 15, w: 4, h: 3, preco: 0 }, { x: 14.5, y: 15, w: 4, h: 3, preco: 30 }, { x: 26.4, y: 15, w: 4, h: 3, preco: 60 },
  { x: 9, y: 20, w: 4, h: 3, preco: 100 }, { x: 14.5, y: 20, w: 4, h: 3, preco: 150 }, { x: 26.4, y: 20, w: 4, h: 3, preco: 220 }];
const PLANTAS = {
  milho: { nome: "Milho", tempo: 7, preco: 4, cor: "#e8c84a" },
  mandioca: { nome: "Mandioca", tempo: 10, preco: 8, cor: "#c89a6a" },
  abobora: { nome: "Abóbora", tempo: 14, preco: 17, cor: "#e07a2a", custo: 40 },
  melancia: { nome: "Melancia", tempo: 18, preco: 30, cor: "#4a9a3a", custo: 90 } };
const EXTRAS = { ovo: ["Ovo", 3], laranja: ["Laranja", 4], mel: ["Mel", 9], leite: ["Balde de leite", 7], lenha: ["Feixe de lenha", 3] };
const PEIXES = [["Lambari", 6, .55], ["Tilápia", 12, .33], ["Traíra", 22, .12]];
const DIA = 160, NOITE = 85, CICLO = DIA + NOITE;
const PLACAS = [
  { x: 8.1, y: 16.7, txt: "A MATA. Não entre depois que escurecer. Se ouvir assobio, não responda. E nunca, nunca siga as pegadas." },
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
// o grito do susto: ruído e serras desafinadas passando por uma distorção, bem alto, com um baque grave por baixo
let DIST = null;
function gritoForte() {
  if (!AC || mudo) return; const t = AC.currentTime;
  if (!DIST) { DIST = AC.createWaveShaper(); const n = 2048, cur = new Float32Array(n); for (let i = 0; i < n; i++) { const x = i / n * 2 - 1; cur[i] = Math.tanh(x * 6); } DIST.curve = cur; const g = AC.createGain(); g.gain.value = .55; DIST.connect(g).connect(AC.destination); }
  const env = (g, a, d, v) => { g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + a); g.gain.exponentialRampToValueAtTime(.0001, t + d); };
  [[680, 260], [745, 300], [1180, 420], [1520, 600]].forEach(([f, f2], i) => { const o = AC.createOscillator(), g = AC.createGain(); o.type = i % 2 ? "square" : "sawtooth"; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f2, t + 1.6); const lfo = AC.createOscillator(), lg = AC.createGain(); lfo.frequency.value = 9 + i * 3; lg.gain.value = f * .06; lfo.connect(lg).connect(o.frequency); lfo.start(t); lfo.stop(t + 1.8); o.connect(g).connect(DIST); env(g, .01, 1.7, .5); o.start(t); o.stop(t + 1.8); });
  const s = AC.createBufferSource(), fl = AC.createBiquadFilter(), g2 = AC.createGain(); s.buffer = NB; s.loop = true; fl.type = "bandpass"; fl.frequency.setValueAtTime(3200, t); fl.frequency.exponentialRampToValueAtTime(700, t + 1.4); fl.Q.value = .8; s.connect(fl).connect(g2).connect(DIST); env(g2, .005, 1.5, 1); s.start(t); s.stop(t + 1.6);
  const b = AC.createOscillator(), gb = AC.createGain(); b.frequency.setValueAtTime(90, t); b.frequency.exponentialRampToValueAtTime(28, t + .9); b.connect(gb).connect(AC.destination); env(gb, .005, 1, .9); b.start(t); b.stop(t + 1.1); // baque
  tocarRuido(2.4, { filtro: "lowpass", f: 300, vol: .4, wet: .9, quando: .3 }); // eco
}
// batidas fortes na porta (três pancadas)
function bater(v = 1, pan = 0) { for (let i = 0; i < 3; i++) { tocarRuido(.11, { filtro: "lowpass", f: 220, vol: .55 * v, pan, wet: .5, quando: i * .27 }); tocarTom(68, .18, { vol: .3 * v, ate: 40, pan, quando: i * .27 }); } }
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
  susto() { gritoForte(); },
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
  cascos(x, y) { const [v, pn] = somEm(x, y); for (let i = 0; i < 4; i++) tocarRuido(.05, { filtro: "bandpass", f: 900, vol: .35 * v + .05, pan: pn, wet: .7, quando: i * .32 }); },
  gritoTinhoso(x, y) { const [v, pn] = somEm(x, y), k = .4 + v * .6; tocarTom(210, 1.3, { tipo: "sawtooth", vol: .22 * k, ate: 70, lp: 1600, pan: pn, wet: .6 }); tocarTom(223, 1.3, { tipo: "square", vol: .12 * k, ate: 75, lp: 1200, pan: pn }); tocarRuido(1.1, { filtro: "bandpass", f: 800, vol: .45 * k, pan: pn, wet: .7 }); tocarTom(48, 1, { vol: .4 * k, ate: 30 }); },
  assobio(v = 1, pan = 0) { if (v < .03) return; const f0 = rnd(1500, 2100); tocarTom(f0, .5, { vol: .09 * v, ate: f0 * 1.45, pan, lp: 5000 }); tocarTom(f0 * 1.4, .7, { vol: .08 * v, ate: f0 * .7, pan, lp: 5000, quando: .55 }); },
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
  for (let y = 16; y <= 17; y++) for (let x = 0; x < CERCA.x0; x++) solido[y][x] = false; // trilha da mata
  bloq(19, 9, 1, 1); bloq(LAGO.x0, LAGO.y0, LAGO.x1 - LAGO.x0, LAGO.y1 - LAGO.y0); bloq(27.5, 30.4, 3, 1.4); for (let y = CERCA.y1; y < MH; y++) for (let x = 24; x <= 26; x++) solido[y][x] = false; // a estrada para a vila
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
    [CHIQUEIRO.x0, CHIQUEIRO.y0, CHIQUEIRO.x1, CHIQUEIRO.y1], [BALANCO.x - .75, BALANCO.y - .2, BALANCO.x + .75, BALANCO.y + .05], [VACA.x - .9, VACA.y - .45, VACA.x + 1.3, VACA.y + .1], [COCHO.x - .6, COCHO.y - .3, COCHO.x + .6, COCHO.y + .05], [LENHA.x - .55, LENHA.y - .35, LENHA.x + .55, LENHA.y + .05], [CARRIOLA.x - .5, CARRIOLA.y - .25, CARRIOLA.x + .5, CARRIOLA.y + .05]];
  COLMEIAS.forEach(([x, y]) => caixas.push([x - .32, y - .4, x + .32, y + .05])); FENOS.forEach(([x, y]) => caixas.push([x - .6, y - .4, x + .6, y + .05]));
  POMAR.forEach(([x, y]) => bloq(x - .2, y - .2, .4, .4));
  const arvores = [];
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { const fora = x < CERCA.x0 || x >= CERCA.x1 || y < CERCA.y0 || y >= CERCA.y1; if (fora && !(x >= 22 && x <= 28 && y >= CERCA.y1) && !(x < CERCA.x0 && y >= 15 && y <= 18) && srnd() < .55) arvores.push({ x: x + .5 + (srnd() - .5) * .6, y: y + .5 + (srnd() - .5) * .6, r: .7 + srnd() * .55, c: Math.floor(srnd() * 5) }); }
  [[8, 7], [44.4, 21], [7.6, 31], [21.8, 31.4], [33.2, 21.6], [7.4, 25]].forEach(([x, y]) => { arvores.push({ x, y, r: .9, c: Math.floor(srnd() * 5) }); solido[Math.floor(y)][Math.floor(x)] = true; });
  const pedras = [], flores = [], cogumelos = [];
  for (let i = 0; i < 70; i++) { const x = rnd(CERCA.x0 + .5, CERCA.x1 - .5), y = rnd(CERCA.y0 + .5, CERCA.y1 - .5); if (solido[Math.floor(y)][Math.floor(x)]) continue; (i % 3 === 0 ? pedras : i % 3 === 1 ? flores : cogumelos).push({ x, y, k: Math.random() }); }
  R = {
    t: 18, dia: 1, vidas: 1, lugar: "sitio", predio: null, andar: 0, int: { x: 4.5, y: 5.2, dir: 1 }, roupa: null, garrafada: 0, broa: 0, conv: {}, fade: 0,
    enxada: false, lampiao: false, ferradura: false, sal: false, arruda: false, aguaBenta: 0, missoes: {}, mprog: {}, apito: false, guizo: false, isca: false, medalha: false, cor: 0, semente: 0, caido: null, outro: null, online: null, eu: { x: 13, y: 12.8, dir: 1, anda: 0, fase: 0 }, dentro: false, sala: { x: 5, y: 5.6 },
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
/* ---------- chão nítido: pintado em pedaços na resolução da tela (antes era uma imagem pequena esticada e ficava borrado) ---------- */
const CHUNK = 8;
let CLIPV = null; const vis = (x, y, m = 64) => !CLIPV || (x > CLIPV[0] - m && x < CLIPV[2] + m && y > CLIPV[1] - m && y < CLIPV[3] + m);
const semInd = i => (100003 + i * 7919) % 2147483647; // semente própria de cada item: dá para pular o que está fora sem mudar o resto
const Chao = (pintar, mw, mh) => ({ pintar, mw, mh, cache: new Map(), P: 0, base: null });
function baseChao(ch) { if (!ch.base) { const cv = document.createElement("canvas"); cv.width = ch.mw * 16; cv.height = ch.mh * 16; const g = cv.getContext("2d", { willReadFrequently: true }); g.scale(.5, .5); CLIPV = null; ch.pintar(g); ch.base = cv; try { const im = g.getImageData(0, 0, cv.width, cv.height).data, m = new Uint8Array(cv.width * cv.height); for (let i = 0; i < m.length; i++) { const R2 = im[i * 4], G = im[i * 4 + 1], B = im[i * 4 + 2]; m[i] = G > R2 + 4 && G > B + 10 ? 1 : 0; } ch.mask = m; } catch (e) { ch.mask = null; } } return ch.base; }
function fazerPedaco(ch, cx, cy, P, lim) {
  const k = cx + "," + cy, pc = document.createElement("canvas"); pc.width = pc.height = CHUNK * P; pc.ch = ch; const g = pc.getContext("2d"); g.scale(P / 32, P / 32); g.translate(-cx * CHUNK * 32, -cy * CHUNK * 32); g.beginPath(); g.rect(cx * CHUNK * 32, cy * CHUNK * 32, CHUNK * 32, CHUNK * 32); g.clip();
  CLIPV = [cx * CHUNK * 32, cy * CHUNK * 32, (cx + 1) * CHUNK * 32, (cy + 1) * CHUNK * 32]; try { ch.pintar(g); } finally { CLIPV = null; } detalheChao(g, pc, cx, cy, P); ch.cache.set(k, pc); if (ch.cache.size > lim) ch.cache.delete(ch.cache.keys().next().value); return pc;
}
function desenharChaoChunks(ch) {
  const P = Math.min(96, Math.max(24, Math.round(TS * DPRr))); if (ch.P !== P) { ch.cache.clear(); ch.P = P; }
  const lim = Math.max(12, Math.floor(70e6 / (CHUNK * P * CHUNK * P * 4)));
  const tx0 = cam.x - W / 2 / TS, ty0 = cam.y - H / 2 / TS, cx0 = Math.max(0, Math.floor(tx0 / CHUNK)), cy0 = Math.max(0, Math.floor(ty0 / CHUNK)), cx1 = Math.min(Math.ceil(ch.mw / CHUNK) - 1, Math.floor((tx0 + W / TS) / CHUNK)), cy1 = Math.min(Math.ceil(ch.mh / CHUNK) - 1, Math.floor((ty0 + H / TS) / CHUNK));
  let feitos = 0; const base = baseChao(ch);
  for (let cy = cy0; cy <= cy1; cy++) for (let cx = cx0; cx <= cx1; cx++) {
    const k = cx + "," + cy; let pc = ch.cache.get(k);
    if (!pc && (feitos < 1 || ch.cache.size < 2)) { feitos++; pc = fazerPedaco(ch, cx, cy, P, lim); }
    if (pc) { ch.cache.delete(k); ch.cache.set(k, pc); c.drawImage(pc, PX(cx * CHUNK), PY(cy * CHUNK), CHUNK * TS + .6, CHUNK * TS + .6); }
    else c.drawImage(base, cx * CHUNK * 16, cy * CHUNK * 16, CHUNK * 16, CHUNK * 16, PX(cx * CHUNK), PY(cy * CHUNK), CHUNK * TS + .6, CHUNK * TS + .6); // enquanto o pedaço nítido não fica pronto
  }
  if (!feitos) { const mx = Math.ceil(ch.mw / CHUNK) - 1, my = Math.ceil(ch.mh / CHUNK) - 1; outer: for (let cy = Math.max(0, cy0 - 1); cy <= Math.min(my, cy1 + 1); cy++) for (let cx = Math.max(0, cx0 - 1); cx <= Math.min(mx, cx1 + 1); cx++) if (!ch.cache.has(cx + "," + cy)) { fazerPedaco(ch, cx, cy, P, lim); break outer; } } // adianta o vizinho antes de ele aparecer
}
let CHAO_SITIO = null, CHAO_VILA = null;
// detalhe fino só no pedaço: tufos de capim, trevos, pedrinhas e florzinhas, onde o chão é de grama
function detalheChao(g, pc, cx, cy, P) {
  let sd = (cx * 7919 + cy * 104729 + 13) % 2147483647 || 7; const r = () => { sd = (sd * 16807) % 2147483647; return (sd - 1) / 2147483646; };
  const ch = pc.ch, m = ch && ch.mask, mw = ch ? ch.mw * 16 : 0, ox = cx * CHUNK * 32, oy = cy * CHUNK * 32;
  const grama = (x, y) => !m || m[Math.floor(y / 2) * mw + Math.floor(x / 2)] === 1;
  for (let n = 0; n < CHUNK * CHUNK * 9; n++) {
    const x = ox + r() * CHUNK * 32, y = oy + r() * CHUNK * 32, t = r(), v = r(); if (!grama(x, y)) continue;
    if (t < .62) { g.strokeStyle = v < .5 ? "rgba(150,170,80,.55)" : "rgba(40,60,22,.5)"; g.lineWidth = .55; g.beginPath(); for (let f = -1; f <= 1; f++) { g.moveTo(x + f * .8, y); g.quadraticCurveTo(x + f * 1.6, y - 2.5, x + f * 2.2 + (v - .5), y - 3.5 - v * 2.5); } g.stroke(); }
    else if (t < .78) { g.fillStyle = "rgba(70,110,40,.6)"; for (let f = 0; f < 3; f++) { g.beginPath(); g.arc(x + Math.cos(f * 2.1) * .9, y + Math.sin(f * 2.1) * .9, .9, 0, 7); g.fill(); } }
    else if (t < .9) { g.fillStyle = v < .5 ? "rgba(120,116,104,.7)" : "rgba(80,76,68,.7)"; g.beginPath(); g.ellipse(x, y, .9 + v * 1.4, .6 + v, v * 3, 0, 7); g.fill(); g.fillStyle = "rgba(255,255,255,.12)"; g.beginPath(); g.ellipse(x - .3, y - .3, .4 + v * .5, .3, 0, 0, 7); g.fill(); }
    else { g.fillStyle = ["#e8e0c8", "#d8b84a", "#c87aa0", "#e8e2d8"][Math.floor(v * 4)]; g.beginPath(); g.arc(x, y, .7, 0, 7); g.fill(); g.strokeStyle = "rgba(60,90,30,.6)"; g.lineWidth = .4; g.beginPath(); g.moveTo(x, y + .7); g.lineTo(x, y + 2.4); g.stroke(); }
  }
}
function gerarChao() { CHAO_SITIO = Chao(pintarChaoSitio, MW, MH); }
// caminhos de terra batida: beirada irregular, grama amassada, sulcos de roda e poucas pedras.
// Todos os caminhos de um mapa são pintados juntos, camada por camada, para as emendas ficarem limpas.
const CORES_TERRA = { sitio: ["rgba(46,58,18,.22)", "#7e5c3a", "#94704a", "rgba(58,38,20,.42)"], mata: ["rgba(10,14,6,.45)", "#4e3a22", "#5e4830", "rgba(24,16,8,.45)"], vila: ["rgba(40,50,20,.24)", "#7a5a38", "#8e6c46", "rgba(54,36,18,.45)"] };
function caminhosTerra(g, P, lista) {
  const tr = lista.map(([pts, w, tipo = "sitio"]) => { const base = Math.round(pts[0][0] * 131 + pts[0][1] * 977 + w * 50) + 7; const T = { sd: base }; const r = () => { T.sd = (T.sd * 16807) % 2147483647; return (T.sd - 1) / 2147483646; }; const am = [];
    for (let i = 1; i < pts.length; i++) { const [ax, ay] = pts[i - 1], [bx, by] = pts[i], L = Math.hypot(bx - ax, by - ay) || 1, nx = -(by - ay) / L, ny = (bx - ax) / L; for (let d = 0; d < L; d += .14) { const t = d / L; am.push({ x: ax + (bx - ax) * t, y: ay + (by - ay) * t, nx, ny, d: am.length * .14 }); } }
    const [lx, ly] = pts[pts.length - 1], ul = am[am.length - 1] || { nx: 0, ny: 1 }; am.push({ x: lx, y: ly, nx: ul.nx, ny: ul.ny, d: am.length * .14 }); return Object.assign(T, { am: am.filter(p => vis(p.x * P, p.y * P, 80)), w, cor: CORES_TERRA[tipo], tipo, r, base }); });
  const ond = (p, k) => 1 + .1 * Math.sin(p.d * 2.3 + k) + .06 * Math.sin(p.d * 6.1 + k * 2);
  const bola = (x, y, rr, cor) => { g.fillStyle = cor; g.beginPath(); g.arc(x * P, y * P, rr * P, 0, 7); g.fill(); };
  tr.forEach(t => t.am.forEach(p => bola(p.x, p.y, t.w * .62 * ond(p, 1), t.cor[0]))); // grama amassada em volta
  tr.forEach(t => t.am.forEach(p => bola(p.x, p.y, t.w * .5 * ond(p, 3), t.cor[1]))); // terra
  tr.forEach(t => t.am.forEach(p => { const o = Math.sin(p.d * 1.3) * t.w * .06; bola(p.x + p.nx * o, p.y + p.ny * o, t.w * .3 * ond(p, 5), t.cor[2]); })); // meio mais batido
  g.lineCap = g.lineJoin = "round"; tr.forEach(t => { if (t.w < .95) return; for (const lado of [-1, 1]) { g.strokeStyle = t.cor[3]; g.lineWidth = .07 * P; g.beginPath(); let ant = null; t.am.forEach(p => { const o = lado * t.w * .2 + Math.sin(p.d * 1.7 + lado) * .03, X2 = (p.x + p.nx * o) * P, Y2 = (p.y + p.ny * o) * P; if (ant && Math.hypot(p.x - ant.x, p.y - ant.y) < .4) g.lineTo(X2, Y2); else g.moveTo(X2, Y2); ant = p; }); g.stroke(); } }); // sulcos das rodas
  tr.forEach(t => t.am.forEach((p, i) => { const r = t.r; t.sd = (t.base * 31 + Math.round(p.x * 97) * 7919 + Math.round(p.y * 89) * 104729) % 2147483646 + 1;
    for (let k = 0; k < 2; k++) { const o = (r() - .5) * t.w * .85; g.fillStyle = r() < .5 ? "rgba(40,24,10,.22)" : "rgba(150,120,84,.18)"; g.beginPath(); g.ellipse((p.x + p.nx * o) * P, (p.y + p.ny * o) * P, 1.5 + r() * 3, 1 + r() * 1.5, r() * 3, 0, 7); g.fill(); } // torrões
    if (r() < .1) { const o = (r() - .5) * t.w * .75, px = (p.x + p.nx * o) * P, py = (p.y + p.ny * o) * P, rr = 1.8 + r() * 2; g.fillStyle = "rgba(30,20,10,.35)"; g.beginPath(); g.ellipse(px + .8, py + 1, rr, rr * .7, 0, 0, 7); g.fill(); g.fillStyle = ["#8a8272", "#76705f", "#9a907c"][Math.floor(r() * 3)]; g.beginPath(); g.ellipse(px, py, rr, rr * .7, r() * 3, 0, 7); g.fill(); g.fillStyle = "rgba(255,255,255,.25)"; g.fillRect(px - rr * .4, py - rr * .4, 1.2, 1.2); } // pedrinha
    if (r() < .55) { const lado = r() < .5 ? -1 : 1, o = lado * t.w * (.42 + r() * .12), bx = (p.x + p.nx * o) * P, by = (p.y + p.ny * o) * P; g.strokeStyle = t.tipo === "mata" ? "rgba(40,56,22,.9)" : r() < .5 ? "#5e8a2e" : "#78a43c"; g.lineWidth = 1.5; g.beginPath(); for (let k = 0; k < 3; k++) { g.moveTo(bx + (k - 1) * 2, by + 1); g.lineTo(bx + (k - 1) * 3 + (r() - .5) * 2, by - 4 - r() * 5); } g.stroke(); } // capim na beira
    if (t.w > 1 && i % 15 === 7 && i > 20 && i < t.am.length - 20) { g.strokeStyle = t.tipo === "mata" ? "rgba(40,56,22,.6)" : "rgba(94,138,46,.8)"; g.lineWidth = 1.3; const bx = p.x * P, by = p.y * P; g.beginPath(); g.moveTo(bx, by); g.lineTo(bx - 2, by - 5); g.moveTo(bx + 1, by); g.lineTo(bx + 3, by - 5); g.moveTo(bx + 2, by); g.lineTo(bx + 2, by - 4); g.stroke(); } // capim no meio, entre os sulcos
  }));
}
const caminhoTerra = (g, P, pts, w, tipo) => caminhosTerra(g, P, [[pts, w, tipo]]);
// o chão é pintado aos pedaços: sempre com a mesma semente, para os pedaços casarem e não mexer no sorteio do jogo
function pintarChaoSitio(g) { const s0 = semente; semente = 4242; try { _pintarChaoSitio(g); } finally { semente = s0; } }
function _pintarChaoSitio(g) {
  const P = 32;
  g.fillStyle = "#26301a"; g.fillRect(0, 0, MW * P, MH * P);
  g.fillStyle = "#6a7a36"; g.fillRect(CERCA.x0 * P, CERCA.y0 * P, (CERCA.x1 - CERCA.x0) * P, (CERCA.y1 - CERCA.y0) * P);
  semente = 99;
  const dentro = (x, y) => x > CERCA.x0 * P && x < CERCA.x1 * P && y > CERCA.y0 * P && y < CERCA.y1 * P;
  const s0 = semente;
  for (let i = 0; i < 2200; i++) { semente = semInd(i); const x = srnd() * MW * P, y = srnd() * MH * P; if (!vis(x, y)) continue; g.fillStyle = dentro(x, y) ? (srnd() < .5 ? "rgba(150,160,76,.35)" : "rgba(60,80,30,.3)") : "rgba(16,24,10,.45)"; g.beginPath(); g.ellipse(x, y, 6 + srnd() * 24, 4 + srnd() * 13, srnd() * 3, 0, 7); g.fill(); }
  for (let i = 0; i < 4200; i++) { semente = semInd(i + 5e4); const x = srnd() * MW * P, y = srnd() * MH * P; if (!vis(x, y)) continue; g.strokeStyle = srnd() < .5 ? "rgba(160,170,86,.5)" : "rgba(46,66,28,.55)"; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (srnd() - .5) * 3, y - 3 - srnd() * 4); g.stroke(); }
  for (let i = 0; i < 900; i++) { semente = semInd(i + 1e5); const x = srnd() * MW * P, y = srnd() * MH * P; if (!vis(x, y)) continue; g.fillStyle = ["#c8662a", "#d89a2a", "#a8401e", "#e0b040", "#8a3018"][Math.floor(srnd() * 5)]; g.beginPath(); g.ellipse(x, y, 2.4, 1.4, srnd() * 3, 0, 7); g.fill(); } // folhas secas
  semente = s0;
  // caminhos de terra com pedrinhas
  const TRL = [], trilha = (pts, w, escura) => TRL.push([pts, w * 1.12, escura ? "mata" : "sitio"]);

  trilha([[8.6, 13.75], [6.9, 15.1], [6.6, 16.9], [-1, 17]], .85, true); // trilha escura que entra na mata
  trilha([[13, 11.8], [13, 13.6], [25.2, 13.6], [25.2, 30.2]], 1.15); trilha([[13, 13.6], [8.6, 13.75]], .85);
  trilha([[17.2, 13.6], [18.7, 12.3], [19.5, 10.9]], .75); trilha([[9.8, 13.7], [8.5, 12.5], [7.8, 10.9]], .6);
  trilha([[25.2, 13.6], [28.6, 13.4], [28.6, 12.2]], .7); trilha([[28.6, 13.4], [39, 13.4], [39, 12]], .8); trilha([[39, 13.4], [40.55, 14.6], [40.55, 21.2]], .7);
  trilha([[25.2, 27.4], [31.2, 27.4]], .7); trilha([[25.2, 23.75], [31, 23.5], [38.8, 23.05], [42, 23.3], [42, 24.9]], .7);
  trilha([[25.2, 33], [25.2, 38]], 1.4); // estrada que sai pelo portão
  trilha([[39, 13.4], [50.4, 13.4], [50.4, 22.2], [53.3, 22.2], [53.3, 21]], .8); trilha([[42, 23.2], [44.6, 23.3], [49.7, 23.6], [49.7, 30.4], [55, 30.4]], .7); trilha([[50.4, 13.4], [53.4, 12.4]], .6);
  caminhosTerra(g, P, TRL);
  { const tx = 13 * P, ty = 12.85 * P; g.fillStyle = CORES_TERRA.sitio[1]; g.beginPath(); for (let a = 0; a <= 6.3; a += .2) { const k = 1 + .06 * Math.sin(a * 5) + .04 * Math.sin(a * 9); g.lineTo(tx + Math.cos(a) * 2.2 * P * k, ty + Math.sin(a) * 1.05 * P * k); } g.fill(); g.fillStyle = CORES_TERRA.sitio[2]; g.beginPath(); g.ellipse(tx, ty + 2, 1.5 * P, .62 * P, 0, 0, 7); g.fill();
    let sd2 = 91; const r3 = () => { sd2 = (sd2 * 16807) % 2147483647; return (sd2 - 1) / 2147483646; }; for (let i = 0; i < 40; i++) { const a = r3() * 6.3, d = r3(); g.fillStyle = r3() < .5 ? "rgba(40,24,10,.22)" : "rgba(150,120,84,.2)"; g.beginPath(); g.ellipse(tx + Math.cos(a) * d * 2 * P, ty + Math.sin(a) * d * .9 * P, 2 + r3() * 3, 1.2 + r3() * 1.5, 0, 0, 7); g.fill(); } } // terreiro de terra batida na frente da casa
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
      <div class="rc-vidas" id="rcVidas"></div><div class="rc-sala" id="rcSala" hidden></div><div class="rc-itens" id="rcItens"></div><button class="rc-menu rc-moch rc-chatbt" id="rcChat" type="button" aria-label="Chat" hidden><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 8a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v9a4 4 0 0 1-4 4h-7l-6 5v-5h-3a4 4 0 0 1-4-4z" fill="rgba(255,255,255,.12)" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="11" cy="12.5" r="1.6" fill="currentColor"/><circle cx="16" cy="12.5" r="1.6" fill="currentColor"/><circle cx="21" cy="12.5" r="1.6" fill="currentColor"/></svg><i id="rcChatN" hidden></i></button><button class="rc-menu rc-moch" id="rcMoch" type="button" aria-label="Mochila"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M12 8V6a4 4 0 0 1 8 0v2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="7" y="8" width="18" height="20" rx="6" fill="#8a5a32" stroke="currentColor" stroke-width="1.6"/><rect x="10.5" y="17" width="11" height="8" rx="2.5" fill="#6a4224" stroke="currentColor" stroke-width="1.2"/><path d="M10.5 19.5h11" stroke="currentColor" stroke-width="1"/><circle cx="16" cy="21.5" r="1.1" fill="#f2c94a"/></svg></button><button class="rc-menu" id="rcMenu" type="button">Pausa</button></div>
    <div class="rc-obj" id="rcObj"></div><div class="rc-chatlog" id="rcChatLog"></div>
    <div class="rc-chatbar" id="rcChatBar" hidden><div class="rc-rapidas">${["Socorro!", "Vem aqui!", "Corre!", "Tô indo!", "Apaga a lanterna!", "Vou vender", "Cuidado!", "Valeu!"].map(t => `<button type="button" data-r="${t}">${t}</button>`).join("")}</div>
      <form id="rcChatF"><input id="rcChatIn" maxlength="80" autocomplete="off" placeholder="Escreva para o seu amigo..."><button type="submit">Enviar</button><button type="button" id="rcChatX" aria-label="Fechar">✕</button></form></div>
    <div class="rc-joy" id="rcJoy"><i id="rcJoyK"></i></div>
    <div class="rc-bts"><button id="rcSem" type="button" class="rc-bt sem"></button><button id="rcLuz" type="button" class="rc-bt luz" aria-label="Lanterna"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M11 9a5 5 0 0 1 10 0" fill="none" stroke="currentColor" stroke-width="2"/><rect x="10" y="9" width="12" height="3" rx="1" fill="currentColor"/><path d="M11 12h10l1 11H10z" fill="rgba(255,255,255,.12)" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path class="chama" d="M16 14c2 2.5 2.6 4 2.6 5.3a2.6 2.6 0 0 1-5.2 0c0-1.3.6-2.8 2.6-5.3z" fill="#f2c94a"/><rect x="9" y="23" width="14" height="3" rx="1" fill="currentColor"/></svg></button><button id="rcCorre" type="button" class="rc-bt corre" aria-label="Correr"><svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="19" cy="6.5" r="3" fill="currentColor"/><path d="M16.5 5.5c-2 1-3 3-3.4 5.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><ellipse cx="19" cy="3.6" rx="4.6" ry="1.2" fill="currentColor"/><path d="M18 10l-3 7h6z" fill="currentColor"/><path d="M17 11l-5 2.5M19 11l4.5 3.5M16 17l-4.5 4 -3 .5M19 17l2.5 5 4 1.2" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 12h5M2 16h6M4 20h4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity=".6"/></svg></button><button id="rcAcao" type="button" class="rc-bt acao">Ação</button></div>
    <div class="rc-fala" id="rcFala" hidden></div><div class="rc-dica" id="rcDica"></div>
    <div class="rc-titulo" id="rcTitulo" hidden><canvas id="rcTitCv"></canvas><nav class="rc-tit-menu" id="rcTitMenu"></nav><div class="rc-tit-rod" id="rcTitRod"></div></div>
    <div class="rc-painel" id="rcPainel" hidden></div>
    <div class="rc-gire" id="rcGire" hidden><b>Vire o celular</b><span>Este modo é jogado com o celular deitado.</span></div>`;
  document.body.appendChild(d);
  ["rcMoedas", "rcDia", "rcAgua", "rcOleo", "rcFolego", "rcItens", "rcMenu", "rcJoy", "rcJoyK", "rcSem", "rcLuz", "rcCorre", "rcAcao", "rcFala", "rcDica", "rcPainel", "rcGire", "rcChat", "rcChatN", "rcChatLog", "rcChatBar", "rcChatIn", "rcChatF", "rcChatX", "rcObj", "rcVidas", "rcSala", "rcMoch", "rcTitulo", "rcTitMenu", "rcTitRod"].forEach(i => el[i] = document.getElementById(i));
  el.rcSala.addEventListener("click", () => { const c = Net.codigo; if (!c) return; try { navigator.clipboard.writeText(c).then(() => R && efeito("Código " + c + " copiado", "#f2c94c"), () => {}); } catch (e) {} });
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
  .rc-ic{width:30px;height:30px;vertical-align:middle;margin-right:6px;flex:none;filter:drop-shadow(0 1px 1px rgba(0,0,0,.8))}.rc-op:has(>.rc-ic){position:relative;padding-left:52px;min-height:52px;justify-content:center}.rc-op>.rc-ic{position:absolute;left:10px;top:50%;transform:translateY(-50%);width:34px;height:34px;margin:0}.rc-moch-l div{display:flex;align-items:center;gap:2px}.rc-moch-l div span{flex:1}.rc-bt.sem .rc-ic{width:20px;height:20px;margin:0}.rc-bt.on{background:rgba(242,201,74,.4);border-color:#f2c94a}.rc-bt.sem{font-size:9px;line-height:1.1}
  #roca.rc-pc .rc-joy,#roca.rc-controle .rc-joy,#roca.rc-controle .rc-bts{display:none}
  .rc-caixa button:focus-visible,.rc-caixa button:focus{outline:3px solid #f2c94a;outline-offset:2px}
  .rc-bt svg{width:34px;height:34px;display:block;margin:auto}.rc-bt.luz.on .chama{filter:drop-shadow(0 0 4px #f2c94a)}.rc-bt.luz:not(.on) .chama{fill:rgba(255,255,255,.25)}
  .rc-moch{margin-left:auto;padding:4px 8px}.rc-moch svg{width:28px;height:28px;display:block}.rc-moch + .rc-menu{margin-left:0}
  .rc-obj{position:absolute;left:max(12px,env(safe-area-inset-left));top:52px;max-width:38vw;color:#f2c94a;font:600 10.5px/1.3 var(--f-mono,monospace);text-shadow:0 1px 4px #000;pointer-events:none;letter-spacing:.02em}
  .rc-sala{color:#f4efe4;font-size:11px;text-shadow:0 1px 4px #000;background:#0008;border:1px solid #ffffff30;padding:2px 6px;align-self:flex-start;pointer-events:auto;cursor:pointer;letter-spacing:.5px}.rc-sala b{color:#f2c94c;font-size:13px;letter-spacing:2px}.rc-vidas{display:flex;flex-direction:column;gap:2px;color:#f4efe4;font-size:10px;text-shadow:0 1px 4px #000}.rc-vidas b{color:#e2483d;font-size:13px;letter-spacing:1px}
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

  /* ===== visual quadrado: madeira, papel e botões de bloco ===== */
  #roca{--mad:#2a1b10;--mad2:#3d2816;--borda:#0f0905;--creme:#f6ead0;--ouro:#f2c94a;--abob:#d8641e}
  .rc-caixa{border-radius:0;background:linear-gradient(rgba(255,255,255,.02),rgba(0,0,0,.08)),repeating-linear-gradient(0deg,#2a1b10 0 38px,#25180e 38px 40px);border:3px solid var(--borda);box-shadow:inset 0 0 0 2px #7a5432,inset 0 0 0 5px var(--borda),8px 8px 0 rgba(0,0,0,.5);padding:22px}
  .rc-caixa h2{font:800 32px "Big Shoulders Display",sans-serif;text-transform:uppercase;letter-spacing:.05em;color:var(--creme);text-shadow:3px 3px 0 #000}
  .rc-caixa p{color:#d8c8a8}
  .rc-op{border-radius:0;background:var(--mad2);border:2px solid var(--borda);box-shadow:inset 0 2px 0 rgba(255,226,170,.14),inset 0 -4px 0 rgba(0,0,0,.35),3px 3px 0 #000;font:700 16px var(--f-body,serif);color:var(--creme);transition:transform .06s,background .1s;cursor:pointer}
  .rc-op small{color:#c8b48e}.rc-op:not(:disabled):hover,.rc-op:focus-visible{background:#55381e;border-color:var(--ouro);transform:translate(-1px,-1px);box-shadow:inset 0 2px 0 rgba(255,226,170,.2),inset 0 -4px 0 rgba(0,0,0,.35),4px 4px 0 #000}
  .rc-op:not(:disabled):active{transform:translate(2px,2px);box-shadow:inset 0 2px 0 rgba(255,226,170,.1),1px 1px 0 #000}
  .rc-op.dest{background:var(--abob);border-color:var(--borda);color:#fff6e4}.rc-op.dest small{color:#ffe2c0}.rc-op.dest:not(:disabled):hover,.rc-op.dest:focus-visible{background:#ec7a2c}
  .rc-caixa button:focus-visible,.rc-caixa button:focus{outline:3px solid var(--ouro);outline-offset:0}
  .rc-caixa.rc-diario{border-radius:0;background:#e2d4b0;box-shadow:inset 0 0 0 2px #a8865a,8px 8px 0 rgba(0,0,0,.5);border-color:#3a2410}
  .rc-caixa.rc-diario .rc-op{box-shadow:2px 2px 0 rgba(0,0,0,.3);color:#2a1e12}.rc-caixa.rc-diario .rc-op.dest{color:#3a1206}
  .rc-bicho{border-radius:0;box-shadow:3px 3px 0 rgba(0,0,0,.35)}
  .rc-moch-l div{border-radius:0;background:rgba(0,0,0,.25);border:2px solid #120a05;box-shadow:inset 0 1px 0 rgba(255,226,170,.1)}
  .rc-painel{background:rgba(10,6,2,.66);z-index:8}
  .rc-bt{border-radius:0;border:3px solid #120a05;background:rgba(42,27,16,.82);box-shadow:inset 0 0 0 2px rgba(232,200,138,.28),inset 0 -4px 0 rgba(0,0,0,.35),3px 3px 0 rgba(0,0,0,.6);color:var(--creme)}
  .rc-bt.acao{background:rgba(216,100,30,.82);box-shadow:inset 0 0 0 2px rgba(255,220,150,.5),inset 0 -5px 0 rgba(0,0,0,.3),3px 3px 0 rgba(0,0,0,.6);border-color:#120a05}
  .rc-bt.on{background:rgba(242,201,74,.7);color:#2a1a0a}.rc-bt:active{transform:translate(2px,2px);box-shadow:inset 0 0 0 2px rgba(232,200,138,.28),1px 1px 0 rgba(0,0,0,.6)}
  .rc-bts .sem{border-radius:0}
  .rc-menu{border-radius:0;border:3px solid #120a05;background:rgba(42,27,16,.85);box-shadow:inset 0 0 0 2px rgba(232,200,138,.25),3px 3px 0 rgba(0,0,0,.6);text-transform:uppercase;letter-spacing:.06em}
  .rc-joy{border-radius:0;background:rgba(42,27,16,.35);border:3px solid rgba(15,9,5,.7);box-shadow:inset 0 0 0 2px rgba(232,200,138,.22)}
  .rc-joy::before,.rc-joy::after{content:"";position:absolute;background:rgba(232,200,138,.18)}.rc-joy::before{left:50%;top:12px;bottom:12px;width:3px;margin-left:-1.5px}.rc-joy::after{top:50%;left:12px;right:12px;height:3px;margin-top:-1.5px}
  .rc-joy i{border-radius:0;background:rgba(246,234,208,.35);border:3px solid rgba(15,9,5,.75);box-shadow:inset 0 -4px 0 rgba(0,0,0,.25);z-index:1}
  .rc-b{border-radius:0;height:8px;border:2px solid rgba(0,0,0,.7);box-sizing:content-box}.rc-b s{border-radius:0}
  .rc-itens span{border-radius:0;border:1px solid rgba(0,0,0,.5)}
  .rc-l b::before{border-radius:0;transform:rotate(45deg) scale(.8)}
  .rc-obj{font-size:12px;background:rgba(20,12,6,.55);padding:3px 7px;border-left:3px solid var(--ouro)}
  .rc-dica{font-size:14px;background:rgba(20,12,6,.6);padding:4px 10px}.rc-dica:empty{display:none}
  .rc-chatlog div,.rc-chatbar,.rc-rapidas button,.rc-chatbar input,.rc-chatbar form button,.rc-codigo,.rc-input,.rc-pular{border-radius:0}
  .rc-chatbar{border:3px solid #120a05;background:rgba(42,27,16,.95);box-shadow:4px 4px 0 rgba(0,0,0,.5)}
  /* falas: caixa grande de papel com nome e retrato */
  .rc-fala{width:max(64vw,min(1040px,calc(100vw - 290px)));box-sizing:border-box;border-radius:0;background:#f6ead0;color:#2a1a0c;border:4px solid #2a1a0c;box-shadow:inset 0 0 0 3px #d4b888,7px 7px 0 rgba(0,0,0,.55);padding:24px 26px 14px;font:500 clamp(21px,2.9vw,34px)/1.36 var(--f-body,serif);bottom:12px;cursor:pointer;min-height:4.1em}
  .rc-fala.com-ret{padding-left:calc(clamp(78px,10.5vw,132px) + 36px)}
  .rc-fala p{margin:0}.rc-fala-ret{position:absolute;left:14px;top:50%;transform:translateY(-50%);width:clamp(78px,10.5vw,132px);height:clamp(78px,10.5vw,132px);border:3px solid #2a1a0c;box-shadow:3px 3px 0 rgba(0,0,0,.35);image-rendering:auto}
  .rc-fala-quem{position:absolute;left:12px;top:-20px;background:#d8641e;color:#fff6e4;border:3px solid #2a1a0c;padding:3px 14px;font:800 clamp(16px,2vw,23px)/1.2 "Big Shoulders Display",sans-serif;letter-spacing:.08em;text-transform:uppercase;box-shadow:3px 3px 0 rgba(0,0,0,.4)}
  .rc-fala-quem:empty{display:none}.rc-fala.com-ret .rc-fala-quem{left:calc(clamp(78px,10.5vw,132px) + 32px)}
  .rc-fala small{display:block;text-align:right;margin-top:6px;color:#9a4a14;font:700 clamp(11px,1.3vw,15px) var(--f-mono,monospace);letter-spacing:.12em;text-transform:uppercase;animation:rcpisca 1.2s steps(2) infinite}
  .rc-hist-txt{border-radius:0;font-size:clamp(18px,2.3vw,26px);width:min(980px,90vw);background:rgba(246,234,208,.95);color:#2a1a0c;border:4px solid #2a1a0c;box-shadow:inset 0 0 0 3px #d4b888,7px 7px 0 rgba(0,0,0,.55)}.rc-hist-txt small{color:#9a4a14}
  @keyframes rcpisca{50%{opacity:.35}}
  /* capa */
  .rc-titulo{position:absolute;inset:0;z-index:6;background:#5fb4e6;overflow:hidden}
  .rc-titulo canvas{position:absolute;inset:0;width:100%;height:100%}
  .rc-tit-menu{position:absolute;right:max(22px,env(safe-area-inset-right));top:50%;transform:translateY(-50%);width:clamp(230px,30vw,340px);display:flex;flex-direction:column;gap:10px;padding:18px 16px 16px;background:repeating-linear-gradient(0deg,#9a6434 0 30px,#8a5a2e 30px 32px);border:4px solid #3a2210;box-shadow:inset 0 0 0 3px #c08a52,8px 8px 0 rgba(30,40,10,.35)}
  .rc-tit-menu::before,.rc-tit-menu::after{content:"";position:absolute;top:-36px;width:4px;height:36px;background:#7a5a3a}.rc-tit-menu::before{left:22%}.rc-tit-menu::after{right:22%}
  .rc-tit-menu h3{margin:0 0 2px;text-align:center;font:800 22px "Big Shoulders Display",sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#fff4d8;text-shadow:2px 2px 0 #3a1e0a}
  .rc-tbt{display:flex;align-items:center;gap:12px;width:100%;text-align:left;cursor:pointer;background:#f6ead0;color:#3a2210;border:3px solid #3a2210;border-radius:0;padding:9px 12px;box-shadow:inset 0 -5px 0 rgba(120,80,40,.25),inset 0 2px 0 #fff,4px 4px 0 #3a2210;font:800 clamp(17px,2vw,22px)/1.05 "Big Shoulders Display",sans-serif;letter-spacing:.06em;text-transform:uppercase;transition:transform .06s}
  .rc-tbt i{flex:none;width:34px;height:34px;display:grid;place-items:center;background:#3a2210;color:#f6ead0}.rc-tbt svg{width:20px;height:20px;fill:currentColor;shape-rendering:crispEdges}
  .rc-tbt small{display:block;margin-top:2px;font:600 11px var(--f-mono,monospace);letter-spacing:.02em;text-transform:none;color:#7a5a3a}
  .rc-tbt.dest{background:#ffd25a}.rc-tbt.dest i{background:#d8641e}
  .rc-tbt:hover,.rc-tbt:focus-visible{outline:none;background:#fff8e6;transform:translate(-2px,-2px);box-shadow:inset 0 -5px 0 rgba(120,80,40,.25),inset 0 2px 0 #fff,6px 6px 0 #3a2210}.rc-tbt.dest:hover,.rc-tbt.dest:focus-visible{background:#ffe07e}
  .rc-tbt:focus-visible{border-color:#d8641e}.rc-tbt:active{transform:translate(3px,3px);box-shadow:inset 0 -2px 0 rgba(120,80,40,.25),1px 1px 0 #3a2210}
  .rc-tit-rod{position:absolute;left:max(14px,env(safe-area-inset-left));bottom:10px;display:flex;gap:14px;flex-wrap:wrap;font:600 11px var(--f-mono,monospace);color:#1e3a10;text-shadow:0 1px 0 rgba(255,255,255,.5)}.rc-tit-rod.cel{left:auto;right:max(14px,env(safe-area-inset-right));bottom:6px}.rc-tit-rod.cel span{font-size:9px;padding:1px 5px}.rc-tit-rod span{background:rgba(246,234,208,.75);padding:3px 8px;border:2px solid rgba(58,34,16,.6)}
  @media (max-height:430px){.rc-tit-menu{gap:7px;padding:12px 12px 12px}.rc-tbt{padding:6px 10px}.rc-tbt i{width:28px;height:28px}.rc-tbt small{display:none}}
  @keyframes rcgira{0%,30%{transform:rotate(0)}60%,100%{transform:rotate(-90deg)}}`;
  document.head.appendChild(st);
  addEventListener("keydown", e => { if (!el.rcTitulo || el.rcTitulo.hidden || painelAberto) return; const k = e.key; if (k === "ArrowDown" || k === "ArrowUp" || k === "s" || k === "w") { e.preventDefault(); moverFoco(k === "ArrowDown" || k === "s" ? 1 : -1); } if (k === "Escape") { const v = document.getElementById("rcTVolta"); if (v) v.click(); } });
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
  if (matchMedia("(pointer: fine)").matches && !("ontouchstart" in window)) document.getElementById("roca").classList.add("rc-pc");
  bt(el.rcMoch, () => { if (R && !R.menu && !painelAberto) abrirMochila(); }); bt(el.rcSem, () => { R.semente = (R.semente + 1) % R.sementes.length; tocarTom(900, .05, { vol: .05 }); hud(); });
  el.rcMenu.addEventListener("click", () => pausar());
  el.rcFala.addEventListener("pointerdown", e => { e.preventDefault(); proximaFala(); });
  addEventListener("keydown", e => { if (document.getElementById("roca").hidden) return; teclas[e.key.toLowerCase()] = true; const k = e.key.toLowerCase(); if (["f", "e", " "].includes(k)) { e.preventDefault(); if (R.msg) proximaFala(); else acao(); } if (k === "r") alternarLanterna(); if (k === "shift") correr(); if (k === "q") el.rcSem.dispatchEvent(new Event("pointerdown")); if (k === "escape") { if (!el.rcChatBar.hidden) abrirChat(false); else if (painelAberto && document.getElementById("rcFechar")) fecharPainel(); else pausar(); } if (k === "enter" && R && R.online && R.outro && el.rcChatBar.hidden) { e.preventDefault(); abrirChat(true); } if ((k === "m" || k === "tab") && R && !R.menu && !painelAberto) { e.preventDefault(); abrirMochila(); } });
  addEventListener("keyup", e => { teclas[e.key.toLowerCase()] = false; });
  addEventListener("resize", medir);
  document.addEventListener("visibilitychange", () => { if (document.hidden && rodando && R && !R.morto && !R.venceu) pausar(); });
}
let VINHETA = null;
function medir() {
  if (!cv) return; const suave = window.fpsAlvo && fpsAlvo() === 60; DPRr = Math.min(devicePixelRatio || 1, suave ? 2 : 1.5); W = innerWidth; H = innerHeight;
  cv.width = Math.round(W * DPRr); cv.height = Math.round(H * DPRr); luzCv.width = Math.round(W * (suave ? .8 : .5)); luzCv.height = Math.round(H * (suave ? .8 : .5)); VINHETA = null;
  TS = Math.max(30, Math.min(W, H) / 9.2);
  el.rcGire.hidden = !(H > W * 1.1);
}

/* ---------- falas (gato e placas) ---------- */
function falar(lista, depois, quem = "Sombrinha") { R.msg = { lista: [...lista], depois, quem }; mostrarFala(); }
function mostrarFala() { if (!R.msg) { el.rcFala.hidden = true; return; } el.rcFala.hidden = false; const rt = retratoFala(R.msg.quem || ""); el.rcFala.classList.toggle("com-ret", !!rt); el.rcFala.innerHTML = `${rt}<b class="rc-fala-quem">${R.msg.quem || ""}</b><p>${R.msg.lista[0]}</p><small>${R.msg.lista.length > 1 ? "continuar" : "fechar"} ▶</small>`; }
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
  if (R.lugar === "vila") return oQueFazerVila();
  if (R.lugar === "mata") return oQueFazerMata();
  if (R.lugar === "esgoto") return oQueFazerEsgoto();
  if (R.pesca) return R.pesca.fisgou ? { t: "Puxar!", fn: puxarPeixe, loc: 1 } : { t: "...", fn: () => {}, loc: 1 };
  if (R.dentro) {
    const s = R.sala;
    if (R.espiar) return { t: "Parar de espiar", fn: () => { R.espiar = 0; }, loc: 1 };
    if (Math.hypot(s.x - 8.35, s.y - 6) < .62) return { t: "Caminha da Sombrinha", fn: abrirCoresGato, loc: 1 };
    if (s.y > 5.5 && Math.abs(s.x - JANELA_F.x) < .55) return { t: "Espiar pela janela", fn: espiar, loc: 1 };
    if (s.y > 5.9 && Math.abs(s.x - SALA.porta.x) < 1.1) return { t: "Sair", fn: sair, loc: 1 };
    if (s.x > 7 && s.y < 2.4) return { t: "Bancada", fn: abrirBancada, loc: 1 };
    if (Math.hypot(s.x - 5, s.y - 3.5) < 1.6 && !R.lamparinas.every(v => v)) return { t: "Acender", fn: () => { if (R.oleo >= 10) { R.oleo -= 10; R.lamparinas = R.lamparinas.map(() => 1); R.lampT = 0; S.colher(); efeito("Lamparinas acesas", "#f2c94a"); } else efeito("Sem óleo para acender", "#e8e2d4"); } };
    if (Math.hypot(s.x - 4.4, s.y - 1.6) < 1.2) return { t: "Fogão", fn: () => efeito("O fogo estala. Por um instante, parece a voz da vó.", "#e8e2d4"), loc: 1 };
    if (Math.hypot(s.x - 5, s.y - 4.5) < 1.3) return { t: "Diário da vó", fn: () => abrirDiario(), loc: 1 };
    const lc2 = lembrancaPerto(s, LEMB_CASA); if (lc2) return { t: "Olhar", fn: () => lembrar(lc2), loc: 1 };
    return null;
  }
  const p = R.eu;
  if (R.outro && R.outro.caido && !R.outro.caido.fora && !R.outro.dentro && (R.outro.lugar || "sitio") === (R.lugar || "sitio") && dist(p, R.outro.eu) < 1.4) return { t: "Levantar", fn: () => { R.outro.caido = null; S.colher(); efeito("De pé! Corre!", "#9bd86b"); } };
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
  { const af = acaoFazenda(p); if (af) return af; }
  if (ls("roca_alcapao_visto") && !R.chaveVo && !ls("roca_alcapao") && dist(p, TUMULO_VO) < 1.3) return { t: "Cavar", loc: 1, fn: () => { R.chaveVo = true; S.colher(); tocarRuido(.5, { filtro: "lowpass", f: 500, vol: .2 }); efeito("Uma chave enferrujada!", "#f2c94a"); falar(["Debaixo da cruz do vô, bem rasinho, tem uma latinha de goiabada enferrujada.", "Dentro tem uma chave pequena. Embrulhada num papel: \"Pra quem for do meu sangue. — S.\""], null, "Yasmin"); hud(); } };
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
function efeito(txt, cor = "#9bd86b") { const dentro = R.dentro || R.predio; R.fx.push({ txt, cor, t: 0, x: dentro ? null : R.eu.x, y: dentro ? null : R.eu.y, lugar: R.lugar || "sitio" }); }
function plantar(cp) { const tipo = R.sementes[R.semente]; cp.k.covas[cp.i] = { tipo, est: 0, seca: true, t: 0 }; S.plantar(); }
function regar(cp) { if (R.agua <= 0) return efeito("O regador está vazio. Vá ao poço.", "#5ab0e0"); R.agua--; const cv2 = cp.k.covas[cp.i]; cv2.seca = false; cv2.t = 0; R.regando = .6; S.regar(); hud(); }
function colher(cp) { const cv2 = cp.k.covas[cp.i]; R.colheita[cv2.tipo] = (R.colheita[cv2.tipo] || 0) + 1; cp.k.covas[cp.i] = null; S.colher(); efeito(`+1 ${PLANTAS[cv2.tipo].nome}`); hud(); }
function tirarAgua() { R.agua = R.aguaMax; S.poco(); efeito("Regador cheio", "#5ab0e0"); if (ehNoite() && Math.random() < .25) setTimeout(() => { R.susto = 1.1; S.susto(); R.rostoPoco = 1; }, 600); hud(); }
function valorVenda() { let v = 0; for (const [k, n] of Object.entries(R.colheita)) v += PLANTAS[k].preco * n; for (const [k, n] of Object.entries(R.peixes)) v += PEIXES.find(p => p[0] === k)[1] * n; for (const [k, n] of Object.entries(R.extra)) v += EXTRAS[k][1] * n; if (R.vara) v += R.inv.graveto + R.inv.folha; return v; }
function vender() { const v = valorVenda(); if (!v) return efeito("Nada para vender", "#e8e2d4"); R.moedas += v; R.colheita = {}; R.peixes = {}; R.extra = {}; if (R.vara) { R.inv.graveto = 0; R.inv.folha = 0; } S.moedas(); efeito(`+${v} moedas`, "#f2c94a"); hud(); }
function abrirCanteiro(k) { if (R.moedas < k.preco) return efeito(`Precisa de ${k.preco} moedas`, "#e8e2d4"); R.moedas -= k.preco; k.aberto = true; S.moedas(); efeito("Canteiro novo!"); hud(); }
// a janela da frente, do lado da porta: dá para ver se tem bicho no terreiro antes de sair
const JANELA_F = { x: 7.45 };
function espiar() { R.espiar = { t: 0, maos: [] }; cam.x = CASA.porta.x + .6; cam.y = CASA.porta.y + 1.4; tocarRuido(.4, { filtro: "lowpass", f: 600, vol: .06 }); }
function bichosNaPorta() { const ms = [R.seco, R.cachorro, R.aranha, R.mula, R.saci, R.esp && R.esp.fase !== "poste" ? R.esp : null, R.vulto].filter(m => m && m.fase !== "longe" && isFinite(m.x) && isFinite(m.y)); let d = 99; ms.forEach(m => { d = Math.min(d, dist(m, CASA.porta)); }); return d; }
function desenharEspiar(tm) {
  const e = R.espiar, naMata = R.lugar === "mata"; if (naMata) desenharMata(tm); else { desenharMundo(tm); desenharLuz(tm); }
  const ww = Math.min(W * .78, H * 1.05), wh = Math.min(H * .74, ww * .7), wx = (W - ww) / 2, wy = (H - wh) / 2 - H * .03;
  // vidro sujo e embaçado
  c.fillStyle = "rgba(160,180,200,.06)"; c.fillRect(wx, wy, ww, wh);
  const emb = c.createRadialGradient(W / 2, wy + wh / 2, Math.min(ww, wh) * .3, W / 2, wy + wh / 2, Math.max(ww, wh) * .62); emb.addColorStop(0, "rgba(200,210,220,0)"); emb.addColorStop(1, `rgba(200,210,220,${.32 + .06 * Math.sin(tm * 1.3)})`); c.fillStyle = emb; c.fillRect(wx, wy, ww, wh);
  const bafo = .12 + .1 * Math.max(0, Math.sin(tm * 1.6)); c.fillStyle = `rgba(220,225,230,${bafo})`; c.beginPath(); c.ellipse(W / 2, wy + wh * .92, ww * .22, wh * .16, 0, 0, 7); c.fill(); // a respiração dela no vidro
  let sd = 5; const rr2 = () => { sd = (sd * 16807) % 2147483647; return (sd - 1) / 2147483646; };
  for (let i = 0; i < 40; i++) { const x = wx + rr2() * ww, y = wy + ((rr2() * wh + tm * (20 + rr2() * 40)) % wh); c.fillStyle = "rgba(220,230,240,.25)"; c.fillRect(x, y, 1.5, 5 + rr2() * 6); } // gotas escorrendo
  c.strokeStyle = "rgba(240,240,240,.35)"; c.lineWidth = 1.2; c.beginPath(); c.moveTo(wx + ww * .78, wy); c.lineTo(wx + ww * .7, wy + wh * .2); c.lineTo(wx + ww * .74, wy + wh * .34); c.moveTo(wx + ww * .7, wy + wh * .2); c.lineTo(wx + ww * .6, wy + wh * .26); c.stroke(); // trinca
  // marcas de mão aparecendo do lado de fora, de noite
  if (ehNoite() && e.t > 4 && e.maos.length < 6 && Math.random() < .006) { e.maos.push({ x: wx + ww * (.15 + Math.random() * .7), y: wy + wh * (.15 + Math.random() * .6), t: 0 }); tocarRuido(.08, { f: 220, vol: .4, wet: .5 }); tocarRuido(.08, { f: 200, vol: .35, wet: .5, quando: .22 }); R.tremor = .3; }
  e.maos.forEach(m => { m.t += 1 / 30; const a = Math.min(.55, m.t * 2); c.fillStyle = `rgba(120,20,20,${a})`; const r = Math.min(ww, wh) * .05; c.beginPath(); c.ellipse(m.x, m.y, r, r * 1.2, 0, 0, 7); c.fill(); for (let f = 0; f < 5; f++) { const ang = -2.4 + f * .42; c.beginPath(); c.ellipse(m.x + Math.cos(ang) * r * 1.8, m.y + Math.sin(ang) * r * 1.9, r * .28, r * .7, ang + PI / 2, 0, 7); c.fill(); } c.fillRect(m.x - r * .2, m.y + r, r * .3, Math.min(r * 4, m.t * r * 2)); });
  // parede, moldura, cruzeta e cortinas
  c.fillStyle = "#1a120a"; c.beginPath(); c.rect(0, 0, W, H); c.rect(wx + ww, wy, -ww, wh); c.fill("evenodd");
  c.fillStyle = "rgba(0,0,0,.25)"; for (let i = 0; i < W; i += 22) c.fillRect(i, 0, 2, H);
  const f = Math.max(8, ww * .02); c.fillStyle = "#3a2614"; c.fillRect(wx - f, wy - f, ww + f * 2, f); c.fillRect(wx - f, wy + wh, ww + f * 2, f * 1.8); c.fillRect(wx - f, wy, f, wh); c.fillRect(wx + ww, wy, f, wh);
  c.fillRect(wx + ww / 2 - f * .4, wy, f * .8, wh); c.fillRect(wx, wy + wh * .48 - f * .4, ww, f * .8);
  c.fillStyle = "#5a2a2a"; for (const lado of [0, 1]) { const x0 = lado ? wx + ww - ww * .09 : wx - f * 1.5; c.beginPath(); c.moveTo(x0, wy - f * 2); c.lineTo(x0 + ww * .09 + f * 1.5, wy - f * 2); for (let y = 0; y <= 1; y += .1) c.lineTo(x0 + (lado ? 0 : ww * .09 + f * 1.5) + (lado ? 1 : -1) * Math.sin(y * 9 + tm * .7) * 3, wy + y * wh * 1.1); c.lineTo(x0 + (lado ? ww * .09 + f * 1.5 : 0), wy + wh * 1.1); c.fill(); }
  // o que dá para ver
  const d = naMata ? (R.curu && R.curu.fase !== "longe" && R.curu.fase !== "sai" ? dist(R.curu, CABANA.porta) : 99) : bichosNaPorta(), nt = ehNoite(); c.font = `700 ${Math.round(Math.max(13, H * .028))}px "JetBrains Mono", monospace`; c.textAlign = "center";
  const txt = d < 5 ? "Tem alguma coisa bem perto da porta." : d < 11 ? "Tem alguma coisa no terreiro..." : nt ? "Não dá para ver nada. Escuro demais." : "Parece livre lá fora.";
  c.fillStyle = d < 5 ? "#e2483d" : d < 11 ? "#f2a33a" : "#c8c2b4"; c.fillText(txt, W / 2, wy + wh + f * 1.8 + H * .05); c.fillStyle = "rgba(200,194,180,.6)"; c.font = `${Math.round(Math.max(11, H * .02))}px "JetBrains Mono", monospace`; c.fillText("Ação: parar de espiar", W / 2, wy + wh + f * 1.8 + H * .09); c.textAlign = "start";
  if (d < 5 && Math.random() < .05) R.tremor = .15;
}
function entrar() { R.dentro = true; R.sala = { x: SALA.porta.x, y: 5.9, dir: -1 }; S.porta(); hud(); }
function sair() { R.espiar = 0; R.dentro = false; R.eu.x = CASA.porta.x; R.eu.y = CASA.porta.y + .55; S.porta(); if (R.pisadeira) R.pisadeira = null; hud(); }
function alternarLanterna() { if (!R || R.morto) return; if (!R.lanterna && R.oleo <= 0) return efeito("Sem óleo na lanterna", "#f2a33a"); R.lanterna = !R.lanterna; tocarTom(R.lanterna ? 900 : 500, .05, { vol: .05 }); hud(); }
function correr() { if (!R || R.correndo || R.folego < 25) return; R.correndo = true; hud(); }
function pescar() { R.pesca = { t: 0, morde: R.isca ? rnd(.7, 2) : rnd(2.2, 5.5), fisgou: false }; tocarRuido(.3, { filtro: "highpass", f: 1800, vol: .05 }); }
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
    <div class="rc-grade">${o.map((x, i) => `<button type="button" class="rc-op ${x.dest ? "dest" : ""}" data-i="${i}" ${x.ok ? "" : "disabled"}>${icDe(x.nome)}${x.nome}<small>${x.desc}</small>${x.preco ? `<em>${x.preco} moedas</em>` : ""}</button>`).join("")}</div>
    <div class="rc-linha"><button type="button" class="rc-op" id="rcVisual">Visual<small>Chapéus com moedas douradas</small></button><button type="button" class="rc-op dest" id="rcFechar">Voltar</button></div></div>`;
  el.rcPainel.querySelectorAll("[data-i]").forEach(b => b.addEventListener("click", () => { const x = o[+b.dataset.i]; if (R.online === "guest") { enviar({ t: "compra", nome: x.nome }); b.disabled = true; tocarTom(900, .05, { vol: .05 }); setTimeout(() => painelAberto && document.getElementById("rcFechar") && abrirBancada(), 350); return; } R.moedas -= x.preco; x.fn(); S.moedas(); hud(); abrirBancada(); }));
  document.getElementById("rcFechar").addEventListener("click", fecharPainel);
  document.getElementById("rcVisual").addEventListener("click", abrirVisual);
}
function abrirVisual() {
  const tem = JSON.parse(ls("roca_chapeus") || '["palha"]');
  el.rcPainel.innerHTML = `<div class="rc-caixa"><h2>Visual</h2><p>A Sombrinha às vezes traz moedas douradas. Elas ficam guardadas mesmo se você morrer. Você tem ${R.ouro}.</p>
    <div class="rc-grade">${COSMETICOS.map(([id, n, p, cor]) => `<button type="button" class="rc-op ${R.chapeu === id ? "dest" : ""}" data-c="${id}" ${tem.includes(id) || R.ouro >= p ? "" : "disabled"}>${icDe("chapéu")}<span style="color:${cor}">●</span> ${n}<small>${tem.includes(id) ? (R.chapeu === id ? "Usando" : "Usar") : p + " douradas"}</small></button>`).join("")}</div>
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
  ["cuca", "A Cuca", "Algumas noites ela sai do mato cantando cantiga de ninar, com um saco nas costas. É lenta e quase cega: se perde no escuro. Mas ouve tudo. Lanterna acesa ou correr perto dela faz ela disparar atrás de você. Ouviu a cantiga? Apague a luz e ande devagar.", "Cabeça de jacaré, cabelo de palha. A vó cantava a música dela pra eu dormir. Agora eu sei por quê."],
  ["tinhoso", "O Tinhoso", "Mora no esgoto da vila, embaixo da rua de baixo. Bate casco na pedra. É mais rápido que você, até correndo: se ele te ver, corra até um barril, um cano ou um buraco na parede e se esconda até ele ir embora. O mapa do Seu Valdemar ajuda a não se perder.", "Chifre de bode, cara de caveira e olho de brasa. O Valdemar diz que ele vigia alguém lá embaixo."],
  ["curupira", "Curupira", "Mora na mata, depois da cerca da esquerda. De dia só assobia e deixa pegada ao contrário. DE NOITE ele caça na trilha, mais rápido que você andando: corra para a casinha do lago (ele não entra) ou volte para o sítio.", "O Sebastião dizia que ele é o dono da mata. E que dono cobra."],
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
  const abas = [["bichos", "Os bichos"], ["pistas", "Pistas"], ...(paginasVo().length || ls("roca_fita") ? [["vo", "Vô Sebastião"]] : []), ...(achadosEsgoto().length ? [["esg", "Esgoto"]] : []), ["missoes", "Missões"], ["precos", "O que vale"], ["guia", "Guia do sítio"], ["obj", "O que fazer"]];
  let corpo = "";
  if (aba === "bichos") corpo = `<p>Coisas que vivem por aqui. Leia tudo, Yasmin. Uma regra esquecida é uma noite a menos.</p><div class="rc-dia-pg">${BICHOS.map(([q, n, r, nota]) => `<div class="rc-bicho"><canvas data-q="${q}"></canvas><div><b>${n}</b><span>${r}</span><i>${nota}</i></div></div>`).join("")}</div>`;
  if (aba === "esg") { const l = achadosEsgoto(); corpo = `<p>O que o pai deixou no esgoto da vila (${l.filter(k => EVID_ESG[k]).length}/5).</p>${Object.entries(EVID_ESG).map(([k, e]) => l.includes(k) ? `<h3>${e.nome}</h3>${e.txt.map(t => `<p style="font-style:italic">${t}</p>`).join("")}` : "").join("")}`; }
  if (aba === "vo") { const l = paginasVo(); corpo = (ls("roca_fita") ? `<h3>A fita do porão</h3>${FITA_VO.map(t => `<p style="font-style:italic">${t}</p>`).join("")}<h3>As páginas</h3>` : "") + `<p>Páginas do diário do vô, achadas na casinha do lago (${l.length}/${PAGINAS_VO.length}).</p>${PAGINAS_VO.map((p, i) => l.includes(i) ? `<p style="font-style:italic">"${p.txt}"</p>` : "").join("")}${l.length < PAGINAS_VO.length ? `<p style="opacity:.7">Ainda falta coisa na casinha. Procure perto dos móveis.</p>` : ""}`; }
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
    <li><b>Vila Sossego:</b> desça a estrada do portão. Os bichos não vão lá. De dia as lojas abrem; à noite a vila apaga e todos dormem no quarto de cima.</li><li><b>Com amigo:</b> cada uma tem sua água e 1 coração. Quem for pega cai e só a outra levanta. Sem coração, fica fora até amanhecer. Toda manhã o coração volta. Se as duas caírem, o sítio volta para o dia 1.</li></ul>`;
  if (aba === "pistas") { const p = pistas(), l = Object.values(p); corpo = `<p><i>Páginas em branco no fim do caderno. Aqui a Yasmin anota o que descobre na Vila Sossego, descendo a estrada do portão.</i></p><p><b>${l.length} de ${NPISTAS} pistas</b>${l.length >= NPISTAS ? " · agora você sabe a verdade." : ""}</p><ul>${l.map(t => `<li>${t}</li>`).join("") || "<li>Nada ainda. Converse com os moradores da vila (de dia: de noite todos dormem).</li>"}</ul>`; }
  if (aba === "missoes") { const mi = R.missoes || {}, l = Object.entries(MISSOES); corpo = `<p><i>Favores pedidos pelos moradores da Vila Sossego. Cada um paga com alguma coisa útil.</i></p><ul>${l.filter(([k]) => mi[k]).map(([k, m]) => `<li><b>${m.titulo}</b> (${npc(m.npc).nome}): ${mi[k] === "feita" ? "<b style='color:#2a6a1a'>feita ✓</b>" : m.falta()} · <i>${m.premio}</i></li>`).join("") || "<li>Nenhuma ainda. Converse mais de uma vez com os moradores: alguns vão pedir ajuda.</li>"}</ul><p style="font-size:13px">Quem pede favor: o carteiro, a professora, o mecânico, o dono da pensão, a viúva, a mulher dos gatos e a benzedeira.</p>`; }
  if (aba === "obj") corpo = `<p><b>Agora:</b> ${objetivo()}.</p><ul><li>Plante, regue, colha e venda para juntar moedas.</li><li>Compre as três peças na bancada: bateria (120), pneu (170) e motor de arranque (240).</li><li>Leve tudo até a caminhonete no portão e vá embora deste sítio.</li><li>De noite, siga as regras dos bichos. Toda noite tem uma vela para levar até a cruz.</li></ul><p><i>Se encontrar seu pai, diga que eu sinto muito. — Benedita</i></p>`;
  el.rcPainel.innerHTML = `<div class="rc-caixa rc-diario"><h2>Diário da Vó Benedita</h2><div class="rc-linha" style="margin:4px 0 10px">${abas.map(([k, n]) => `<button type="button" class="rc-op${k === aba ? " dest" : ""}" data-aba="${k}">${n}</button>`).join("")}</div>${corpo}<div class="rc-linha"><button type="button" class="rc-op" id="rcFechar">Fechar</button></div></div>`;
  el.rcPainel.querySelectorAll("[data-aba]").forEach(b => b.addEventListener("click", () => { tocarRuido(.25, { filtro: "highpass", f: 2500, vol: .05 }); abrirDiario(b.dataset.aba); }));
  el.rcPainel.querySelectorAll("canvas[data-q]").forEach(k => fotoMonstro(k, k.dataset.q));
  document.getElementById("rcFechar").addEventListener("click", fecharPainel);
}
/* ---------- ícones desenhados de cada item (mochila, lojas, bancada) ---------- */
const ICO = {};
function icone(k) {
  if (ICO[k]) return ICO[k];
  const cv = document.createElement("canvas"); cv.width = cv.height = 64; const g = cv.getContext("2d"); g.lineJoin = g.lineCap = "round";
  const el2 = (x, y, rx, ry, cor, rot = 0) => { g.fillStyle = cor; g.beginPath(); g.ellipse(x, y, rx, ry, rot, 0, 7); g.fill(); };
  const ln = (cor, w, ...p) => { g.strokeStyle = cor; g.lineWidth = w; g.beginPath(); g.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) g.lineTo(p[i], p[i + 1]); g.stroke(); };
  const rr = (x, y, w, h, r, cor) => { g.fillStyle = cor; g.beginPath(); g.roundRect ? g.roundRect(x, y, w, h, r) : g.rect(x, y, w, h); g.fill(); };
  const contorno = () => { g.globalCompositeOperation = "destination-over"; g.shadowColor = "rgba(0,0,0,.9)"; g.shadowBlur = 0; g.filter = "none"; };
  const brilho = (x, y, r) => el2(x, y, r, r * .6, "rgba(255,255,255,.45)", -.6);
  const peixe = (c1, c2, pint) => { g.fillStyle = c1; g.beginPath(); g.moveTo(52, 32); g.quadraticCurveTo(34, 14, 14, 30); g.quadraticCurveTo(34, 50, 52, 32); g.fill(); g.beginPath(); g.moveTo(50, 32); g.lineTo(62, 22); g.lineTo(60, 32); g.lineTo(62, 42); g.fill(); g.fillStyle = c2; g.beginPath(); g.moveTo(48, 33); g.quadraticCurveTo(34, 46, 16, 32); g.quadraticCurveTo(34, 40, 48, 33); g.fill(); if (pint) for (let i = 0; i < 5; i++) el2(24 + i * 5, 28 + (i % 2) * 4, 1.6, 1.6, pint); el2(20, 29, 2.6, 2.6, "#fff"); el2(20, 29, 1.3, 1.3, "#000"); ln("rgba(0,0,0,.35)", 1.5, 28, 22, 28, 40); };
  const moeda = (c1, c2) => { el2(32, 34, 20, 20, c2); el2(32, 32, 20, 20, c1); el2(32, 32, 14, 14, c2); el2(32, 32, 12, 12, c1); g.fillStyle = c2; g.font = "bold 16px serif"; g.textAlign = "center"; g.fillText("$", 32, 38); brilho(25, 24, 5); };
  const D = {
    milho: () => { g.save(); g.translate(32, 32); g.rotate(-.5); el2(0, 0, 9, 22, "#e8c84a"); g.fillStyle = "#b8961e"; for (let y = -18; y < 18; y += 5) for (let x = -6; x <= 6; x += 4) g.fillRect(x - 1, y, 2.4, 3); g.fillStyle = "#5a9a2a"; g.beginPath(); g.moveTo(-10, 20); g.quadraticCurveTo(-14, -4, -4, -16); g.quadraticCurveTo(-6, 6, 2, 24); g.fill(); g.beginPath(); g.moveTo(10, 20); g.quadraticCurveTo(14, -2, 6, -12); g.quadraticCurveTo(6, 8, 0, 24); g.fill(); g.restore(); },
    mandioca: () => { g.save(); g.translate(32, 32); g.rotate(.6); el2(0, 0, 8, 24, "#8a5a32"); el2(0, 0, 6, 22, "#a8763e"); for (let y = -16; y < 18; y += 7) ln("#6a4220", 1.4, -6, y, 6, y + 2); el2(0, -24, 5, 3, "#f2e6c8"); g.restore(); el2(20, 46, 7, 9, "#7a4e2a", .5); el2(20, 46, 4, 6, "#f2e6c8", .5); },
    abobora: () => { [[-12, 10], [12, 10], [-5, 13], [5, 13], [0, 14]].forEach(([dx, rx]) => el2(32 + dx, 36, rx, 17, "#e07a2a")); for (const dx of [-8, 0, 8]) ln("rgba(120,40,0,.45)", 1.6, 32 + dx, 22, 32 + dx * 1.3, 50); rr(29, 12, 6, 10, 2, "#4a6a1e"); brilho(22, 28, 4); },
    melancia: () => { g.fillStyle = "#2a6a22"; g.beginPath(); g.arc(32, 26, 26, 0, PI); g.fill(); g.fillStyle = "#f2f0c8"; g.beginPath(); g.arc(32, 26, 22, 0, PI); g.fill(); g.fillStyle = "#e03a3a"; g.beginPath(); g.arc(32, 26, 19, 0, PI); g.fill(); for (let i = 0; i < 7; i++) el2(18 + i * 4.6, 32 + (i % 2) * 6, 1.4, 2.4, "#1a1010"); },
    semente: () => { rr(12, 16, 40, 40, 8, "#c8a878"); rr(12, 16, 40, 10, 4, "#a8865a"); ln("#6a4a2a", 2, 18, 21, 46, 21); g.fillStyle = "#4a2e12"; g.font = "bold 11px sans-serif"; g.textAlign = "center"; g.fillText("SEM", 32, 44); for (const [x, y] of [[20, 52], [30, 56], [42, 53]]) el2(x, y, 3, 2, "#e8c84a"); },
    lambari: () => peixe("#b8c4c8", "#e8eef0"), tilapia: () => peixe("#7a8a7a", "#c8d0b8", "rgba(40,50,40,.4)"), traira: () => peixe("#4a4a2a", "#8a8a5a", "rgba(20,20,10,.6)"),
    ovo: () => { el2(32, 36, 15, 19, "#f2ead8"); el2(32, 38, 13, 16, "#e8dcc0"); brilho(26, 28, 5); },
    laranja: () => { el2(32, 36, 19, 18, "#e8861e"); for (let i = 0; i < 12; i++) el2(20 + (i * 7) % 24, 26 + (i * 11) % 22, 1, 1, "rgba(150,60,0,.4)"); g.fillStyle = "#3a7a2a"; g.beginPath(); g.ellipse(38, 16, 9, 4, -.5, 0, 7); g.fill(); ln("#5a3a1a", 2.5, 32, 18, 32, 14); brilho(25, 28, 5); },
    mel: () => { rr(16, 22, 32, 34, 8, "#e8a01e"); rr(19, 26, 26, 26, 6, "#f2c04a"); rr(14, 14, 36, 10, 3, "#c8a878"); ln("#8a6a3a", 2, 14, 19, 50, 19); g.fillStyle = "#8a4a0a"; g.font = "bold 12px serif"; g.textAlign = "center"; g.fillText("MEL", 32, 44); brilho(22, 32, 4); },
    graveto: () => { ln("#5a3a1e", 6, 10, 52, 54, 12); ln("#5a3a1e", 4, 30, 33, 22, 16); ln("#5a3a1e", 3, 40, 24, 50, 30); ln("#8a6a3e", 2, 12, 50, 52, 14); },
    folha: () => { g.fillStyle = "#4a8a2a"; g.beginPath(); g.moveTo(10, 54); g.quadraticCurveTo(8, 14, 54, 10); g.quadraticCurveTo(50, 54, 10, 54); g.fill(); ln("#2a5a1a", 2, 12, 52, 48, 16); for (let i = 0; i < 4; i++) ln("#2a5a1a", 1.3, 20 + i * 7, 44 - i * 7, 16 + i * 8, 30 - i * 6); },
    agua: () => { g.fillStyle = "#4aa0e0"; g.beginPath(); g.moveTo(32, 6); g.bezierCurveTo(46, 26, 50, 34, 50, 40); g.arc(32, 40, 18, 0, PI); g.bezierCurveTo(14, 34, 18, 26, 32, 6); g.fill(); el2(26, 40, 4, 7, "rgba(255,255,255,.5)", .3); },
    regador: () => { rr(14, 26, 30, 26, 5, "#7a9aa8"); ln("#7a9aa8", 5, 42, 34, 58, 18); el2(58, 17, 5, 3, "#5a7a88", -.8); g.strokeStyle = "#5a7a88"; g.lineWidth = 4; g.beginPath(); g.arc(29, 24, 11, PI, 0); g.stroke(); brilho(20, 32, 4); },
    oleo: () => { rr(16, 18, 32, 38, 4, "#a02a1e"); rr(20, 24, 24, 20, 2, "#f2c94a"); rr(28, 10, 8, 8, 2, "#5a5a5a"); g.fillStyle = "#1a1a1a"; g.beginPath(); g.moveTo(32, 28); g.quadraticCurveTo(38, 36, 32, 40); g.quadraticCurveTo(26, 36, 32, 28); g.fill(); },
    moeda: () => moeda("#d8a830", "#9a7418"), ouro: () => { moeda("#fff0a0", "#e8b828"); for (const [x, y] of [[50, 12], [12, 50]]) { ln("#fff", 2, x - 5, y, x + 5, y); ln("#fff", 2, x, y - 5, x, y + 5); } },
    venda: () => { el2(32, 40, 20, 17, "#a8865a"); g.fillStyle = "#a8865a"; g.beginPath(); g.moveTo(22, 26); g.lineTo(42, 26); g.lineTo(38, 16); g.lineTo(26, 16); g.fill(); ln("#6a4a2a", 3, 22, 26, 42, 26); g.fillStyle = "#5a3a1a"; g.font = "bold 18px serif"; g.textAlign = "center"; g.fillText("$", 32, 47); },
    vara: () => { ln("#8a5a2e", 4, 8, 58, 50, 8); ln("#ccc", 1.2, 50, 8, 52, 44); g.strokeStyle = "#ccc"; g.beginPath(); g.arc(49, 44, 3, 0, PI); g.stroke(); el2(16, 50, 5, 5, "#5a5a5a"); },
    peneira: () => { el2(32, 34, 24, 18, "#a8865a"); el2(32, 34, 20, 14, "#5a4630"); g.strokeStyle = "rgba(200,180,140,.7)"; g.lineWidth = 1; for (let i = -18; i <= 18; i += 4) { ln(g.strokeStyle, 1, 32 + i, 22, 32 + i, 46); ln(g.strokeStyle, 1, 14, 34 + i * .7, 50, 34 + i * .7); } },
    lanterna: () => { rr(20, 22, 18, 30, 4, "#4a4a52"); rr(16, 12, 26, 12, 3, "#6a6a72"); el2(29, 14, 9, 3, "#fff3b0"); g.fillStyle = "rgba(255,240,150,.4)"; g.beginPath(); g.moveTo(20, 12); g.lineTo(4, 0); g.lineTo(56, 0); g.lineTo(38, 12); g.fill(); rr(26, 32, 6, 8, 2, "#c8302a"); },
    lampiao: () => { ln("#3a3a3a", 3, 22, 14, 32, 6, 42, 14); rr(20, 14, 24, 6, 2, "#3a3a3a"); rr(22, 20, 20, 24, 3, "rgba(255,220,120,.55)"); el2(32, 32, 4, 7, "#f2a020"); el2(32, 34, 2, 4, "#fff3b0"); rr(18, 44, 28, 8, 2, "#3a3a3a"); ln("#3a3a3a", 2, 24, 20, 24, 44); ln("#3a3a3a", 2, 40, 20, 40, 44); },
    botas: () => { for (const dx of [0, 18]) { rr(10 + dx, 10, 14, 34, 3, "#2a2a2a"); rr(10 + dx, 38, 22, 12, 4, "#2a2a2a"); rr(10 + dx, 48, 22, 4, 2, "#a02a1e"); ln("#4a4a4a", 2, 12 + dx, 14, 22 + dx, 14); } },
    vela: () => { rr(24, 26, 16, 30, 3, "#f2ead0"); ln("#2a2a2a", 2, 32, 26, 32, 20); el2(32, 14, 5, 9, "#f2a020"); el2(32, 16, 2.5, 5, "#fff3b0"); el2(36, 30, 2, 5, "#e8dcb8"); },
    garrafada: () => { rr(20, 24, 24, 32, 6, "#3a6a2a"); rr(26, 10, 12, 16, 2, "#3a6a2a"); rr(25, 6, 14, 6, 2, "#8a5a2e"); rr(22, 34, 20, 14, 2, "#e8dcb0"); ln("#6a2a1a", 1.5, 26, 40, 38, 40); for (let i = 0; i < 4; i++) el2(26 + i * 4, 30, 1.6, 3, "#6a9a3a"); },
    aguabenta: () => { rr(22, 22, 20, 34, 6, "rgba(160,200,240,.8)"); rr(27, 10, 10, 14, 2, "rgba(160,200,240,.8)"); rr(26, 6, 12, 6, 2, "#c8c8d0"); ln("#fff", 3, 32, 30, 32, 48); ln("#fff", 3, 25, 36, 39, 36); },
    broa: () => { el2(32, 38, 22, 16, "#c8902e"); el2(32, 34, 20, 13, "#e0aa4a"); for (let i = 0; i < 9; i++) el2(18 + (i * 9) % 28, 28 + (i * 7) % 12, 1.4, 1.4, "#a8761e"); ln("rgba(120,70,10,.6)", 2, 20, 32, 30, 28); ln("rgba(120,70,10,.6)", 2, 34, 28, 44, 32); },
    enxada: () => { ln("#8a5a2e", 4, 14, 58, 44, 14); g.fillStyle = "#9aa4aa"; g.beginPath(); g.moveTo(38, 10); g.lineTo(58, 16); g.lineTo(56, 28); g.lineTo(44, 20); g.fill(); },
    ferradura: () => { g.strokeStyle = "#7a7a82"; g.lineWidth = 9; g.beginPath(); g.arc(32, 30, 17, PI * .85, PI * 2.15); g.stroke(); g.fillStyle = "#2a2a2a"; for (const a of [1, 1.3, 1.7, 2]) el2(32 + Math.cos(a * PI) * 17, 30 + Math.sin(a * PI) * 17, 1.6, 1.6, "#2a2a2a"); },
    sal: () => { rr(18, 18, 28, 38, 4, "#e8e8f0"); rr(16, 12, 32, 8, 3, "#3a6aa8"); g.fillStyle = "#3a6aa8"; g.font = "bold 12px sans-serif"; g.textAlign = "center"; g.fillText("SAL", 32, 42); for (let i = 0; i < 6; i++) el2(10 + i * 9, 58, 2, 1.5, "#fff"); },
    arruda: () => { ln("#3a6a22", 2.5, 32, 60, 32, 10); for (let i = 0; i < 6; i++) { const y = 14 + i * 7, d = i % 2 ? 1 : -1; el2(32 + d * 8, y, 7, 3.5, "#5a9a3a", d * .5); } },
    pista: () => { g.save(); g.translate(32, 32); g.rotate(-.12); rr(-18, -22, 36, 44, 2, "#e8dcb8"); for (let y = -14; y < 16; y += 6) ln("#7a6a50", 1.4, -12, y, 12, y); g.restore(); el2(44, 44, 9, 9, "rgba(0,0,0,0)"); g.strokeStyle = "#4a3a2a"; g.lineWidth = 3; g.beginPath(); g.arc(42, 42, 9, 0, 7); g.stroke(); ln("#4a3a2a", 4, 48, 48, 58, 58); },
    apito: () => { rr(10, 24, 34, 16, 8, "#8a8a92"); el2(44, 32, 11, 11, "#8a8a92"); el2(44, 32, 5, 5, "#3a3a3a"); rr(14, 28, 10, 4, 2, "#2a2a2a"); g.strokeStyle = "#6a6a72"; g.lineWidth = 2; g.beginPath(); g.arc(12, 20, 5, 0, 7); g.stroke(); },
    guizo: () => { el2(32, 36, 16, 16, "#d8a830"); el2(32, 40, 10, 3, "#6a4a10"); el2(32, 46, 2, 2, "#3a2a08"); rr(28, 12, 8, 8, 3, "#9a7418"); ln("#a02a1e", 3, 10, 14, 54, 14); brilho(26, 30, 4); },
    isca: () => { g.strokeStyle = "#d87a7a"; g.lineWidth = 6; g.beginPath(); g.moveTo(10, 40); g.bezierCurveTo(20, 20, 28, 56, 38, 34); g.bezierCurveTo(44, 20, 52, 32, 56, 24); g.stroke(); ln("#b05a5a", 1, 22, 36, 24, 40); el2(56, 24, 2, 2, "#5a2a2a"); },
    medalha: () => { g.fillStyle = "#3a5aa8"; g.beginPath(); g.moveTo(22, 4); g.lineTo(32, 24); g.lineTo(42, 4); g.fill(); el2(32, 38, 16, 16, "#d8a830"); el2(32, 38, 11, 11, "#f2d070"); ln("#9a7418", 2, 32, 30, 32, 46); ln("#9a7418", 2, 26, 36, 38, 36); },
    carta: () => { rr(8, 16, 48, 34, 3, "#e8dcb8"); ln("#a8987a", 2, 8, 18, 32, 36, 56, 18); el2(32, 36, 5, 5, "#a02a1e"); },
    missao: () => { rr(14, 10, 36, 46, 3, "#e8dcb8"); ln("#a02a1e", 3, 20, 20, 24, 24, 30, 16); for (let y = 30; y < 52; y += 7) ln("#7a6a50", 1.6, 20, y, 44, y); },
    bateria: () => { rr(10, 20, 44, 32, 4, "#2a2a2a"); rr(14, 14, 8, 8, 2, "#c8302a"); rr(42, 14, 8, 8, 2, "#888"); g.fillStyle = "#f2c94a"; g.beginPath(); g.moveTo(34, 26); g.lineTo(26, 38); g.lineTo(32, 38); g.lineTo(28, 48); g.lineTo(38, 34); g.lineTo(32, 34); g.fill(); },
    pneu: () => { el2(32, 32, 26, 26, "#1e1e1e"); for (let i = 0; i < 12; i++) { const a = i / 12 * PI * 2; ln("#3a3a3a", 3, 32 + Math.cos(a) * 20, 32 + Math.sin(a) * 20, 32 + Math.cos(a) * 25, 32 + Math.sin(a) * 25); } el2(32, 32, 12, 12, "#9aa4aa"); el2(32, 32, 4, 4, "#4a4a4a"); },
    motor: () => { rr(12, 18, 34, 30, 4, "#6a6a72"); for (let x = 16; x < 44; x += 6) rr(x, 12, 4, 8, 1, "#4a4a52"); el2(50, 33, 8, 8, "#4a4a52"); el2(50, 33, 3, 3, "#9aa4aa"); rr(16, 46, 26, 6, 2, "#3a3a3a"); },
    vestido: () => { g.fillStyle = k.cor || "#a02a2a"; g.beginPath(); g.moveTo(24, 8); g.lineTo(40, 8); g.lineTo(42, 24); g.lineTo(54, 58); g.lineTo(10, 58); g.lineTo(22, 24); g.fill(); ln("rgba(0,0,0,.3)", 2, 22, 26, 42, 26); },
    chapeu: () => { el2(32, 44, 28, 9, "#c8a46a"); el2(32, 32, 15, 14, "#d8b47a"); rr(17, 34, 30, 5, 1, "#7a2a1a"); },
    dica: () => { el2(32, 26, 16, 18, "#f2e07a"); rr(26, 42, 12, 12, 2, "#8a8a92"); ln("#c8a01e", 1.5, 28, 30, 32, 22, 36, 30); },
    leite: () => { rr(16, 20, 32, 36, 3, "#9aa4aa"); rr(18, 22, 28, 8, 2, "#f6f2ea"); ln("#6a747a", 2.5, 16, 34, 48, 34); g.strokeStyle = "#6a747a"; g.lineWidth = 3; g.beginPath(); g.arc(32, 20, 14, PI, 0); g.stroke(); brilho(22, 38, 4); },
    lenha: () => { for (const [y, k] of [[46, 0], [36, 1], [26, 2]]) { rr(10 + k * 3, y, 44 - k * 6, 10, 4, "#8a5a2e"); el2(12 + k * 3, y + 5, 5, 5, "#d8b880"); el2(12 + k * 3, y + 5, 2.5, 2.5, "#a8804a"); } ln("#5a3a1e", 3, 8, 58, 56, 58); },
    mapa: () => { rr(8, 12, 48, 40, 2, "#e8dcb8"); ln("#7a5a32", 2.5, 14, 20, 14, 44, 28, 44, 28, 30, 42, 30, 42, 20, 50, 20); ln("#c8281e", 3, 44, 38, 50, 44); ln("#c8281e", 3, 50, 38, 44, 44); },
    terco: () => { g.strokeStyle = "#8a5a3a"; g.lineWidth = 2; g.beginPath(); g.arc(32, 26, 16, 0, 7); g.stroke(); g.fillStyle = "#6a3a2a"; for (let i = 0; i < 14; i++) { const a = i / 14 * PI * 2; el2(32 + Math.cos(a) * 16, 26 + Math.sin(a) * 16, 3, 3, i % 4 ? "#7a4a2e" : "#c8a050"); } ln("#c8a050", 3, 32, 42, 32, 60); ln("#c8a050", 3, 25, 49, 39, 49); },
    chave: () => { g.strokeStyle = "#a8864a"; g.lineWidth = 6; g.beginPath(); g.arc(20, 22, 10, 0, 7); g.stroke(); ln("#a8864a", 6, 28, 30, 52, 54); ln("#a8864a", 5, 44, 46, 50, 40); ln("#a8864a", 5, 50, 52, 56, 46); el2(18, 20, 3, 3, "rgba(255,255,255,.4)"); },
    gravador: () => { rr(8, 16, 48, 34, 4, "#3a3a3e"); rr(12, 20, 40, 14, 2, "#c8b898"); el2(24, 27, 5, 5, "#2a2a2a"); el2(40, 27, 5, 5, "#2a2a2a"); ln("#5a4a3a", 2, 24, 32, 40, 32); for (let i = 0; i < 4; i++) rr(12 + i * 10, 38, 8, 6, 1, i === 1 ? "#c8302a" : "#8a8a8e"); },
    olho: () => { el2(32, 32, 26, 15, "#f2ead0"); el2(32, 32, 11, 11, "#7a2a1a"); el2(32, 32, 5, 5, "#000"); }
  };
  (D[typeof k === "string" ? k : "vestido"] || D.dica)(); if (typeof k === "string") ICO[k] = cv.toDataURL(); return ICO[k] || cv.toDataURL();
}
// adivinha o ícone pelo nome do item
const IC_MAP = [[/miss[ãa]o/i, "missao"], [/semente/i, "semente"], [/milho/i, "milho"], [/mandioca/i, "mandioca"], [/ab[óo]bora/i, "abobora"], [/melancia/i, "melancia"], [/lambari/i, "lambari"], [/til[áa]pia/i, "tilapia"], [/tra[íi]ra/i, "traira"], [/ovo/i, "ovo"], [/laranja/i, "laranja"], [/mel\b|^mel/i, "mel"], [/graveto/i, "graveto"], [/folha/i, "folha"], [/regador/i, "regador"], [/[áa]gua benta/i, "aguabenta"], [/[áa]gua/i, "agua"], [/[óo]leo/i, "oleo"], [/dourad/i, "ouro"], [/vender/i, "venda"], [/moeda/i, "moeda"], [/vara/i, "vara"], [/peneira/i, "peneira"], [/lampi[ãa]o/i, "lampiao"], [/lanterna/i, "lanterna"], [/bota/i, "botas"], [/vela/i, "vela"], [/garrafada/i, "garrafada"], [/broa/i, "broa"], [/enxada/i, "enxada"], [/ferradura/i, "ferradura"], [/sal\b/i, "sal"], [/arruda/i, "arruda"], [/pista/i, "pista"], [/leite/i, "leite"], [/lenha/i, "lenha"], [/mapa/i, "mapa"], [/terço|terco/i, "terco"], [/chave/i, "chave"], [/gravador|fita/i, "gravador"], [/apito/i, "apito"], [/guizo/i, "guizo"], [/isca/i, "isca"], [/medalha/i, "medalha"], [/miss[ãa]o/i, "missao"], [/carta/i, "carta"], [/bateria|pe[çc]as/i, "bateria"], [/pneu/i, "pneu"], [/motor/i, "motor"], [/vestido|jardineira/i, "vestido"], [/chap[ée]u|visual/i, "chapeu"]];
function icDe(nome, cor) { const t = String(nome).replace(/<[^>]+>/g, ""); const m = IC_MAP.find(([re]) => re.test(t)); if (!m) return ""; const k = m[1] === "vestido" && cor ? "vestido:" + cor : m[1]; if (k.startsWith("vestido:") && !ICO[k]) { ICO[k] = icone({ cor }); } return `<img class="rc-ic" alt="" src="${ICO[k] || icone(k)}">`; }
function abrirMochila() {
  painelAberto = true; el.rcPainel.hidden = false;
  const l = [], add = (n, v) => { if (v) l.push(`<div>${icDe(n)}<span>${n}</span><b>${v}</b></div>`); };
  add("Água no regador", `${R.agua}/${R.aguaMax}`); add("Óleo", Math.round(R.oleo) + "%"); add("Moedas", R.moedas);
  Object.entries(R.colheita).forEach(([k, n]) => add(PLANTAS[k].nome, n)); Object.entries(R.peixes).forEach(([k, n]) => add(k, n)); Object.entries(R.extra).forEach(([k, n]) => add(EXTRAS[k][0], n));
  add("Gravetos", R.inv.graveto); add("Folhas", R.inv.folha); R.sementes.forEach(k => add(`Sementes de ${PLANTAS[k].nome.toLowerCase()}`, "✓"));
  if (R.vara) add("Vara de pesca", "✓"); if (R.peneira) add("Peneira", "✓"); if (R.lanternaBoa) add("Lanterna reforçada", "✓"); if (R.vel > 3.2) add("Botas de borracha", "✓"); if (R.velaCom) add("Vela acesa", "✓"); if (R.garrafada) add("Garrafada", "✓"); if (R.aguaBenta) add("Água benta", "✓"); if (R.broa > 0) add("Broa (fôlego)", Math.ceil(R.broa) + " s"); if (R.enxada) add("Enxada de aço", "✓"); if (R.lampiao) add("Lampião de ferro", "✓"); if (R.ferradura) add("Ferradura na porta", "✓"); if (R.sal) add("Sal na soleira", "✓"); if (R.arruda) add("Arruda", "✓"); add("Pistas", `${Object.keys(pistas()).length}/${NPISTAS}`); if (R.apito) add("Apito de ferro", "✓"); if (R.guizo) add("Guizo da Sombrinha", "✓"); if (R.isca) add("Isca boa", "✓"); if (R.medalha) add("Medalha de Santa Luzia", "✓"); Object.entries(R.missoes || {}).forEach(([k, v]) => { if (v === "ativa") add("Missão: " + MISSOES[k].titulo, MISSOES[k].falta()); }); if (R.chaveVo) add("Chave do alçapão", "✓"); if (ls("roca_fita")) add("Gravador do vô", "✓"); if (temMapaEsgoto()) add("Mapa do esgoto", "✓"); if (R.terco) add("Terço do vô", "✓"); add("Peças da caminhonete", R.pecas ? `${R.pecas}/3` : "0/3");
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
  el.rcPainel.querySelector("#rcSair").addEventListener("click", () => { fecharPainel(); R.menu = true; menuInicial(); });
}
function telaFim(tipo) {
  painelAberto = true; el.rcPainel.hidden = false;
  const mins = Math.floor(R.tempoTotal / 60), segs = Math.round(R.tempoTotal % 60);
  const verdade = Object.keys(pistas()).length >= NPISTAS;
  const txt = tipo === "venceu" ? `<h2 style="color:#9bd86b">Você foi embora</h2><p>A caminhonete pega na terceira tentativa. Pelo retrovisor, o sítio fica pequeno... e alguém acena da janela da casa vazia.</p>${verdade ? `<p style="color:#f2c94a">Você sabe a verdade: a mata cobra alguém do sítio a cada trinta anos, e a vó foi duas vezes para que não fosse você. Na porteira, uma voz igual à do seu pai chama o seu nome. Você não olha para trás.</p>` : `<p style="font-size:13px;color:#b8b2a4">Ainda há perguntas sem resposta na Vila Sossego.</p>`}<p>Dia ${R.dia} · ${mins} min ${segs} s</p>`
    : `<h2 style="color:#e2483d">Você morreu</h2><p>${R.morto.porque}</p><p style="font-size:13px;color:#9bd86b">${R.morto.dica}</p><p>Chegou ao dia ${R.dia}.</p>`;
  const conv = R.online === "guest", reinicia = R.online === "host" && R.outro && tipo === "morreu";
  if (reinicia) setTimeout(() => { if (R && R.morto && R.online === "host" && R.outro) { fecharPainel(); iniciarJogo("host", true); } }, 6500);
  el.rcPainel.innerHTML = `<div class="rc-caixa">${txt}${conv ? `<p style="font-size:13px">${tipo === "morreu" ? "As duas caíram. A sala continua aberta: o sítio volta para o dia 1 em instantes..." : "Esperando o anfitrião começar outra partida..."}</p>` : reinicia ? `<p style="font-size:13px;color:#f2c94a">As duas caíram. A sala continua aberta: voltando para o dia 1 em 6 segundos...</p>` : ""}<div class="rc-linha">${conv ? "" : `<button type="button" class="rc-op dest" id="rcDeNovo">Jogar de novo</button>`}<button type="button" class="rc-op" id="rcSair">Menu</button></div></div>`;
  if (!conv) document.getElementById("rcDeNovo").addEventListener("click", () => { const m = R.online && R.outro ? "host" : "solo"; fecharPainel(); iniciarJogo(m); });
  el.rcPainel.querySelector("#rcSair").addEventListener("click", () => { fecharPainel(); R.menu = true; menuInicial(); });
}
function morrer(quem, porque, dica) { if (R.morto || R.venceu || R.caido) return;
  if (quem === "seco" && R.aguaBenta > 0) { R.aguaBenta = 0; R.seco.fase = "sai"; R.seco.t = 0; S.suspiro(R.seco.x, R.seco.y); efeito("A água benta queimou o Corpo-Seco! Ele fugiu", "#9ad0f0"); hud(); return; }
  if (quem !== "alma" && R.garrafada > 0) { R.garrafada = 0; R.susto = 1.1; S.susto(); R.lanterna = false; R.dentro = false; R.lugar = "sitio"; R.predio = null; R.eu.x = CASA.porta.x; R.eu.y = CASA.porta.y + .7; if (R.trocado) enviar({ t: "pos", x: R.eu.x, y: R.eu.y }); efeito("A garrafada da Dona Cida te trouxe de volta!", "#9bd86b"); hud(); return; }
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
  const sm = PLANTAS[R.sementes[R.semente]]; if (el.rcSem.dataset.k !== sm.nome) { el.rcSem.dataset.k = sm.nome; el.rcSem.innerHTML = `${icDe(sm.nome)}<br>${sm.nome}`; }
  el.rcLuz.classList.toggle("on", R.lanterna); el.rcCorre.classList.toggle("on", R.correndo);
  const comAmigo = !!(R.online && R.outro && !R.menu); el.rcChat.hidden = !comAmigo; if (!comAmigo && !el.rcChatBar.hidden) abrirChat(false);
  el.rcObj.textContent = R.menu ? "" : "Objetivo: " + objetivo();
  const cor = n => n > 0 ? "♥" : "♡";
  const sala = R.online && Net.codigo && !R.menu ? `SALA <b>${Net.codigo}</b>${R.online === "host" ? (R.outro ? " · amigo junto" : " · esperando amigo") : ""}` : "";
  if (el.rcSala.dataset.k !== sala) { el.rcSala.dataset.k = sala; el.rcSala.innerHTML = sala; el.rcSala.hidden = !sala; }
  el.rcVidas.innerHTML = R.online && R.outro ? `<span>Você <b>${cor(R.vidas)}</b></span><span>${R.online === "host" ? "Amigo" : "Yasmin"} <b>${cor(R.outro.vidas)}</b></span>` : "";
}
function objetivo() {
  const np = Object.keys(pistas()).length, pp = np < NPISTAS ? ` · pistas ${np}/${NPISTAS} na vila` : "";
  if (R.lugar === "mata" && R.predio === "porao") return "vasculhar o porão do vô";
  if (R.lugar === "esgoto") return `achar o que o pai deixou no esgoto (${achadosEsgoto().filter(k => EVID_ESG[k]).length}/5)` + (temMapaEsgoto() ? "" : " · sem mapa: o Seu Valdemar tem um");
  if (R.lugar === "mata") return `achar o diário do vô na casinha do lago (páginas ${paginasVo().length}/${PAGINAS_VO.length})` + (ehNoite() ? " · DE NOITE NÃO: o Curupira anda na trilha" : "");
  if (R.lugar === "vila") return `descobrir o que aconteceu (pistas ${np}/${NPISTAS})` + (ehNoite() ? " · a vila dorme: volte de dia" : "");
  if (R.pecas >= 3) return "leve tudo até a caminhonete no portão e vá embora!";
  const falta = [["Bateria nova", 120], ["Pneu", 170], ["Motor de arranque", 240]][R.pecas];
  return `juntar ${falta[1]} moedas e comprar ${falta[0].toLowerCase()} na bancada (peças ${R.pecas}/3)` + (ehNoite() ? " · sobreviva até amanhecer" : "") + pp;
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
  let dx = joy.dx, dy = joy.dy; if (CONTROLE.dx || CONTROLE.dy) { dx = CONTROLE.dx; dy = CONTROLE.dy; }
  if (teclas["a"] || teclas["arrowleft"]) dx = -1; if (teclas["d"] || teclas["arrowright"]) dx = 1; if (teclas["w"] || teclas["arrowup"]) dy = -1; if (teclas["s"] || teclas["arrowdown"]) dy = 1;
  if (R.caido || (R.msg && R.online) || (painelAberto && R.online)) { dx = 0; dy = 0; }
  const m = Math.hypot(dx, dy); if (m > 1) { dx /= m; dy /= m; }
  if (R.pesca && m > .2) R.pesca = null;
  if (R.correndo) { R.folego -= 30 * dt; if (R.folego <= 0) { R.folego = 0; R.correndo = false; } } else R.folego = Math.min(100, R.folego + 14 * dt);
  if (R.broa > 0) { R.broa -= dt; R.folego = 100; }
  const vel = R.vel * (R.correndo ? 1.75 : 1) * (R.dentro || R.predio ? .8 : 1);
  if (R.lugar === "esgoto") { if (!ESG) montarEsgoto(); if (!R.escondido) andaLivre(R.eu, dx, dy, vel, dt, livreEsgoto); }
  else if (R.lugar === "mata") { if (!MATA) montarMata(); if (R.predio) { if (R.espiar) { R.espiar.t += dt; if (Math.abs(dx) + Math.abs(dy) > .3) R.espiar = 0; } else andaLivre(R.int, dx, dy, vel * .8, dt, R.predio === "porao" ? livrePorao : livreCabana); } else { andaLivre(R.eu, dx, dy, vel, dt, livreMata); if (R.eu.x > MTW - .3) voltarDaMata(); } }
  else if (R.lugar === "vila") { if (R.predio) andaLivre(R.int, dx, dy, vel, dt, livrePredio); else { andaLivre(R.eu, dx, dy, vel, dt, livreVila); if (R.eu.y < .5) voltarSitio(); } }
  else if (R.dentro) { if (R.espiar) { R.espiar.t += dt; if (Math.abs(dx) + Math.abs(dy) > .3) R.espiar = 0; } else anda(R.sala, dx, dy, vel, dt, true); } else { anda(R.eu, dx, dy, vel, dt, false); if (R.eu.y > 36.7 && !R.venceu) irVila(); else if (R.eu.x < .7 && !R.venceu) irMata(); }
  const pp = R.predio ? R.int : R.dentro ? R.sala : R.eu; // (a casinha da mata também usa R.int)
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
  moverLocal(dt); if (R.lugar === "esgoto") atualizarEsgoto(dt); if (MATA || jogadores().some(J => J.lugar === "mata")) { if (!MATA) montarMata(); atualizarMata(dt); }
  const nLuz = jogadores().filter(P => P.lanterna).length;
  if (nLuz) { R.oleo -= (R.lanternaBoa ? .5 : .9) * (R.lampiao ? .5 : 1) * dt * nLuz; if (R.oleo <= 0) { R.oleo = 0; if (R.lanterna) efeito("A lanterna apagou", "#f2a33a"); R.lanterna = false; if (R.outro) R.outro.lanterna = false; } }
  if (R.outro && R.outro.regando > 0) R.outro.regando -= dt;
  // plantas, pomar e galinhas
  for (const k of R.canteiros) k.covas.forEach((cv2, i) => { if (!cv2 || cv2.seca || cv2.est >= 3) return; cv2.t += dt * (R.enxada ? 1.35 : 1); if (cv2.t >= PLANTAS[cv2.tipo].tempo) { cv2.est++; cv2.t = 0; if (cv2.est < 3) cv2.seca = true; else S.pronto(k.x + i % k.w, k.y + Math.floor(i / k.w)); } });
  R.frutas.forEach(f => { if (f.n >= 3) return; f.t += dt; if (f.t > 45) { f.t = 0; f.n++; } });
  R.galinhas.forEach(g => { g.t -= dt; if (!g.alvo || g.t <= 0) { g.alvo = { x: rnd(26, 31.6), y: rnd(9.9, 10.9) }; g.t = rnd(1.5, 4); } const d = dist(g, g.alvo); if (d > .1) { g.x += (g.alvo.x - g.x) / d * .9 * dt; g.y += (g.alvo.y - g.y) / d * .9 * dt; g.dir = g.alvo.x > g.x ? 1 : -1; g.anda = 1; } else g.anda = 0; if (Math.random() < dt * .04) { const [v, pn] = somEm(g.x, g.y); tocarTom(rnd(700, 900), .09, { tipo: "square", vol: .012 * v, ate: 1200, lp: 1800, pan: pn }); } });
  atualizarPesca(dt);
  const naFaz = jogadores().some(P => (P.lugar || "sitio") === "sitio"); // ninguém no sítio = os bichos de lá esperam
  // o vulto parado na beira da mata à noite (só olha; some quando você chega perto ou ilumina)
  if (naFaz && ehNoite() && !R.dentro) { R.vultoT -= dt; if (!R.vulto && R.vultoT <= 0) { const lado = Math.floor(rnd(0, 3)); R.vulto = lado === 0 ? { x: CERCA.x0 - .7, y: rnd(10, 28) } : lado === 1 ? { x: CERCA.x1 + .7, y: rnd(10, 28) } : { x: rnd(10, 40), y: CERCA.y0 - .7 }; R.vulto.t = 0; } if (R.vulto) { R.vulto.t += dt; const d = dist(R.vulto, R.eu); if (d < (R.lanterna ? 7 : 4) || R.vulto.t > 14) { R.vulto = null; R.vultoT = rnd(25, 45); } } } else R.vulto = null;
  atualizarGato(dt);
  if (naFaz) {
    comAlvo(alvoPara(R.seco.x, R.seco.y), () => atualizarSeco(dt));
    if (R.cachorro) comAlvo(alvoPara(R.cachorro.x, R.cachorro.y), () => atualizarCachorro(dt));
    atualizarAlma(dt);
    comJogador(jogadores().find(P => P.dentro && !P.caido) || R, () => atualizarCasa(dt));
    atualizarAranha(dt); atualizarMula(dt); atualizarSaci(dt); atualizarEspantalho(dt); atualizarBichos(dt); atualizarCuca(dt);
  }
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
  R.cuca = R.cuca || { fase: "longe" }; R.cuca.hoje = R.dia >= 2 && Math.random() < .4; R.cuca.prox = rnd(20, 100);
  R.velaT = rnd(3, 40); efeito("Anoiteceu", "#9aa8c8"); tocarTom(220, 2, { vol: .04, ate: 165, wet: .8 }); }
function amanhece() {
  if (R.velaHoje && !R.velaEntregue && jogadores().some(P => (P.lugar || "sitio") === "sitio")) { R.alma = { t: 0 }; return; } // a alma vem cobrar (só se tem alguém no sítio)
  R.dia++; R.leiteHoje = 0; R.vacaComeu = 0; R.lenhaHoje = 0; R.velaHoje = false; R.vela = null; R.velaCom = false; if (R.outro) R.outro.velaCom = false; R.ovos = Math.min(8, R.ovos + 3); R.mel = R.mel.map(() => 1); R.saci.pego = false;
  jogadores().forEach(P => { P.vidas = 1; if (P.caido && P.caido.fora) { P.caido = null; P.lugar = "sitio"; P.predio = null; P.dentro = false; P.eu.x = CASA.porta.x + (P === R ? -.5 : .5); P.eu.y = CASA.porta.y + .7; if (P !== R) enviar({ t: "pos", x: P.eu.x, y: P.eu.y }); } });
  if (R.online) efeito("Amanheceu: o coração voltou", "#e2483d"); efeito(`Dia ${R.dia}`, "#f2c94a");
  Object.assign(R.esp, { x: ESPANTALHO.x, y: ESPANTALHO.y, fase: "poste" }); if (R.aranha.fase !== "longe") R.aranha.fase = "sai"; R.mula.fase = "longe";

  tocarTom(523, 1.5, { tipo: "triangle", vol: .04, wet: .6 }); tocarTom(659, 1.5, { tipo: "triangle", vol: .035, quando: .2, wet: .6 }); tocarTom(780, .4, { tipo: "square", vol: .02, ate: 1100, lp: 2000, quando: 1 }); // galo
  if (R.dia === 2 && !R.cachorro) { R.cachorro = { x: 34, y: 14, fase: "calmo", t: 0 }; setTimeout(() => R && R.cachorro && S.uivo(R.cachorro.x, R.cachorro.y), 1200); }
}
function atualizarGato(dt) {
  const g = R.gato; if (R.tutorial === 0 || (R.lugar || "sitio") !== "sitio") return;
  g.prox -= dt * (R.guizo ? 2 : 1);
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
    const alvo = R.dentro ? { x: CASA.porta.x, y: CASA.porta.y + .85 } : R.eu, d = dist(s, alvo), v = 3.3; // de quatro, mais rápido que andando; na porta ele fica do lado de fora, visível pela janela
    if (d > .05) { s.x += (alvo.x - s.x) / d * v * dt; s.y += (alvo.y - s.y) / d * v * dt; s.dir = alvo.x > s.x ? 1 : -1; s.fase2 = (s.fase2 || 0) + dt * 11; if (Math.random() < dt * 14) R.poeira.push({ x: s.x - s.dir * .5, y: s.y, t: 0 }); }
    if (s.t % 1.6 < dt) { const [vv, pn] = somEm(s.x, s.y); tocarRuido(.12, { filtro: "lowpass", f: 260, vol: .3 * vv, pan: pn }); tocarTom(80, .5, { tipo: "sawtooth", vol: .06 * vv, ate: 50, lp: 300, pan: pn }); } // mandíbula batendo
    if (!R.dentro && d < 4) R.tremor = .1;
    if (R.dentro && d < .4) { s.bate = (s.bate || 0) - dt; if (s.bate <= 0) { s.bate = rnd(1.4, 2.6); bater(.9); R.tremor = .25; } }
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
    if (!R.dentro && !(k.calma > 0) && d < 2.8 && !(R.ferradura && dist(k, CASA.porta) < 8)) { k.fase = "vira"; k.t = 0; S.rosnado(k.x, k.y); R.tremor = .6; }
  } else if (k.fase === "vira") { if (k.t > 1.3) { k.fase = "lobo"; k.t = 0; k.porta = 0; S.uivo(k.x, k.y); } }
  else if (k.fase === "lobo") {
    const alvo2 = R.dentro ? { x: CASA.porta.x, y: CASA.porta.y + 1 } : alvo, d2 = dist(k, alvo2);
    if (d2 > .1) { k.x += (alvo2.x - k.x) / d2 * 5.9 * dt; k.y += (alvo2.y - k.y) / d2 * 5.9 * dt; k.dir = alvo2.x > k.x ? 1 : -1; k.anda = 1; if (Math.random() < dt * 10) R.poeira.push({ x: k.x, y: k.y, t: 0 }); }
    if (k.t % 1.3 < dt) S.rosnado(k.x, k.y);
    if (!R.dentro && d < .8) morrer("lobo", "O cachorro preto virou lobisomem.", "Fique longe do cachorro. Se ele virar, corra para casa: ele desiste e volta para a mata.");
    if (R.dentro) k.porta += dt;
    if (k.t > (R.apito ? 4 : 8) || k.porta > 2.5 || R.caido) { // desiste: arranha a porta, uiva e corre de volta para a mata
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
    if (!R.pisadeira) { R.lampT += dt; if (R.lampT > (R.lampLim || 20)) { R.lampT = 0; R.lampLim = rnd(9, 34) * (R.sal ? 2 : 1); const i = R.lamparinas.lastIndexOf(1); if (i >= 0) { R.lamparinas[i] = 0; S.apaga(); if (i === 0) { R.pisadeira = { t: 0, x: 1.7, y: 2.8 }; S.respira(); R.tremor = .5; efeito("Algo se mexe debaixo da cama", "#e2483d"); } } } }
    else { const p = R.pisadeira; p.t += dt; if (p.t > 1.8) { const d = dist(p, R.sala), v = 2.2 * (.6 + .8 * Math.abs(Math.sin(p.t * 3))); if (d > .05) { p.x += (R.sala.x - p.x) / d * v * dt; p.y += (R.sala.y - p.y) / d * v * dt; p.dir = R.sala.x > p.x ? 1 : -1; } if (p.t % 2.2 < dt) S.respira(); if (d < .6) morrer("pisadeira", "A Pisadeira saiu de baixo da cama.", "Não fique muito tempo dentro de casa: quando as lamparinas apagam, saia. Elas acendem de novo com o tempo."); } if (p.t > 30) R.pisadeira = null; }
  } else { R.pisadeira = null; R.lampT += dt; if (R.lampT > 12) { R.lampT = 0; const i = R.lamparinas.indexOf(0); if (i >= 0) R.lamparinas[i] = 1; } }
}

/* ---------- jogadores (sozinha ou online) ---------- */
// No online, o anfitrião simula tudo. O convidado é guardado em R.outro com os mesmos campos do jogador local,
// e comJogador troca os campos por um instante para reaproveitar as regras escritas para R.eu.
const CAMPOS = ["lugar", "predio", "andar", "int", "roupa", "garrafada", "broa", "conv", "agua", "vidas", "eu", "dentro", "sala", "lanterna", "correndo", "regando", "velaCom", "pesca", "perto", "caido", "folego", "chapeu", "semente", "cor"];
const jogadores = () => R.outro && R.online === "host" ? [R, R.outro] : [R];
function comJogador(P, fn) {
  if (!P || P === R || !R.outro) return fn();
  const o = R.outro; for (const k of CAMPOS) { const v = R[k]; R[k] = o[k]; o[k] = v; } R.trocado = true;
  try { return fn(); } finally { for (const k of CAMPOS) { const v = R[k]; R[k] = o[k]; o[k] = v; } R.trocado = false; }
}
function comAlvo(P, fn) { comJogador(P, () => { if ((R.lugar || "sitio") === "sitio") return fn(); const d = R.dentro; R.dentro = true; try { fn(); } finally { R.dentro = d; } }); } // na vila os bichos agem como se você estivesse trancada em casa
function alvoPara(x, y) { // quem a assombração persegue: o mais perto, de preferência do lado de fora
  let melhor = R, md = 1e9; for (const P of jogadores()) { if (P.caido) continue; const d = Math.hypot(P.eu.x - x, P.eu.y - y) + (P.dentro ? 40 : 0) + ((P.lugar || "sitio") !== "sitio" ? 1e5 : 0); if (d < md) { md = d; melhor = P; } } return melhor;
}
const velaNaMao = () => R.velaCom || (R.outro && R.outro.velaCom);
const noMilharal = p => p.x > MILHARAL.x0 && p.x < MILHARAL.x1 && p.y > MILHARAL.y0 && p.y < MILHARAL.y1;
const progNoite = () => cl(((R.t % CICLO) - DIA) / NOITE, 0, 1);
const raioLuz = P => P.lanterna ? (R.lanternaBoa ? 5.4 : 4.4) + (R.lampiao ? 1 : 0) : 1.7;
function calcPerto() {
  if ((R.lugar || "sitio") !== "sitio") return 0;
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
    for (const J of jogadores()) { if (J.dentro || J.caido || (J.lugar || "sitio") !== "sitio" || noMilharal(J.eu)) continue; const d = dist(J.eu, a); if (d > 11) continue;
      const v = ((J.lanterna ? 1.3 : 0) + (J.eu.anda > .15 ? (J.correndo ? 1.2 : .7) : 0)) * (1 - d / 11); if (v > viu) { viu = v; quem = J; } }
    a.alerta = cl(a.alerta + (viu ? viu * .85 * (R.medalha ? .6 : 1) : -.22) * dt, 0, 1);
    if (a.t % 1.6 < dt) S.juntas(a.x, a.y, .6);
    if (a.alerta >= 1 && quem) { a.fase = "ataque"; a.t = 0; a.quem = quem === R ? 0 : 1; S.gritoAranha(a.x, a.y); R.tremor = .8; efeito("Ela te viu!", "#e2483d"); }
    if (a.t > 30) { a.fase = "sai"; a.t = 0; a.alvo = BORDA(); }
    return;
  }
  if (a.fase === "ataque") {
    const P = a.quem ? (R.outro || R) : R; const alvo = (P.dentro || (P.lugar || "sitio") !== "sitio") ? { x: CASA.porta.x, y: CASA.porta.y + 1.2 } : P.eu;
    irAte(a, alvo, 6.1, dt); a.passo += dt * 7; if (a.t % .9 < dt) S.juntas(a.x, a.y, 1);
    if (!(P.dentro || (P.lugar || "sitio") !== "sitio") && !P.caido && dist(a, P.eu) < 1.25) comJogador(P, () => morrer("aranha", "A Pernuda te viu. Lá do alto, a boca abriu até o chão.", "Quando as juntas estalarem, apague a lanterna e fique parada. Ou se esconda no milharal."));
    if (P.caido || ((P.dentro || (P.lugar || "sitio") !== "sitio") && a.t > 5) || a.t > 13) { a.fase = "sai"; a.t = 0; a.alvo = BORDA(); }
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
    for (const J of jogadores()) { if (J.dentro || J.caido || (J.lugar || "sitio") !== "sitio") continue; if (Math.abs((m.horiz ? J.eu.y : J.eu.x) - m.linha) < .75 && Math.abs((m.horiz ? J.eu.x : J.eu.y) - m.pos) < 1.1) comJogador(J, () => morrer("mula", "A mula-sem-cabeça passou por cima de você.", "Quando o chão brilhar em linha reta, saia da linha. Ela não faz curva.")); }
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
    for (const J of jogadores()) { if (J.dentro || J.caido || (J.lugar || "sitio") !== "sitio" || dist(J.eu, s) > .8) continue;
      if (R.peneira) { R.moedas += 30; s.pego = true; s.fase = "longe"; s.prox = 999; S.risada(s.x, s.y); S.moedas(); R.fx.push({ txt: "Pegou o Saci na peneira! +30", cor: "#f2c94a", t: 0, x: s.x, y: s.y }); hud(); return; }
      const n = R.arruda ? 0 : Math.min(15, Math.ceil(R.moedas * .15)); R.moedas -= n; S.risada(s.x, s.y); R.fx.push({ txt: n ? `O Saci levou ${n} moedas!` : "O Saci riu de você", cor: "#e2483d", t: 0, x: s.x, y: s.y }); s.fase = "sai"; s.t = 0; s.alvo = BORDA(); hud(); return; }
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
  if (e.fase === "poste" || e.fase === "volta") { if (!(P.dentro || (P.lugar || "sitio") !== "sitio") && !P.caido && d < 8) { e.fase = "vivo"; e.t = 0; S.palha(e.x, e.y); } return; }
  e.luz = jogadores().some(J => J.lanterna && !J.dentro && (J.lugar || "sitio") === "sitio" && dist(J.eu, e) < raioLuz(J) + .3);
  e.parado = e.luz || R.aranha.fase === "anda" || R.aranha.fase === "ataque";
  if (e.parado) return;
  const alvo = (P.dentro || (P.lugar || "sitio") !== "sitio") ? { x: CASA.porta.x, y: CASA.porta.y + 1.3 } : P.eu, pulo = .5 + .9 * Math.abs(Math.sin(e.t * 4));
  irAte(e, alvo, 2.1 * pulo, dt); if (e.t % .55 < dt) S.palha(e.x, e.y);
  if (!(P.dentro || (P.lugar || "sitio") !== "sitio") && !P.caido && dist(e, P.eu) < .8) comJogador(P, () => morrer("esp", "O espantalho te pegou no escuro.", "Ilumine o espantalho com a lanterna: com a luz em cima ele não se mexe. O sino da capela manda ele de volta."));
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
  let q = o.q || R, s = (o.s || TS) / 48, e = q.eu, dir = o.dir ?? (q.dentro ? (q.sala && q.sala.dir) || 1 : e.dir || 1), andaK = o.anda ?? (e.anda || 0), f = e.fase || 0, p = q.perto || 0, rp = ROUPAS[q.cor || 0];
  const ch = (COSMETICOS.find(k => k[0] === q.chapeu) || COSMETICOS[0])[3]; { const rl = q.roupa && ROUPAS_LOJA.find(x => x[0] === q.roupa); if (rl) rp = { ...rp, jard: rl[2], jard2: rl[3] }; }
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
function desenharGato(g, tm) { const s = TS / 48, x = PX(g.x), y = PY(g.y); sombra(x, y, 9 * s, 3 * s); gatoEm(x, y, s, g.dir, g.anda, tm); }
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
  const ce = desenharCerca(); for (let x = C.x0; x <= C.x1; x += 1) { [C.y0, C.y1].forEach(y => { if (y === C.y0 && x === 42) return; const sx = PX(x), sy = PY(y); if (!naTela(sx, sy)) return; c.fillStyle = "#2a2a2e"; c.fillRect(sx - 1.5, sy - TS * .4, 3, TS * .4); c.beginPath(); c.moveTo(sx - 3, sy - TS * .4); c.lineTo(sx, sy - TS * .5); c.lineTo(sx + 3, sy - TS * .4); c.fill(); }); }
  for (let y = C.y0; y <= C.y1; y++) [C.x0, C.x1].forEach(x => { const sx = PX(x), sy = PY(y); if (!naTela(sx, sy)) return; c.fillStyle = "#2a2a2e"; c.fillRect(sx - 1.5, sy - TS * .4, 3, TS * .4); });
  c.strokeStyle = "#2a2a2e"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(PX(C.x0), PY(C.y0) - TS * .3); c.lineTo(PX(41.4), PY(C.y0) - TS * .3); c.moveTo(PX(42.6), PY(C.y0) - TS * .3); c.lineTo(PX(C.x1), PY(C.y0) - TS * .3); c.stroke(); c.fillStyle = "#2a2a2e"; for (const gx of [41.4, 42.6]) c.fillRect(PX(gx) - 2.5, PY(C.y0) - TS * .65, 5, TS * .65); c.lineWidth = 2; c.beginPath(); c.arc(PX(42), PY(C.y0) - TS * .62, TS * .6, PI * 1.15, PI * 1.85); c.stroke(); // portãozinho
}
function _desenharSeco(s, tm) {
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
function _desenharCachorro(k, tm) {
  const sc = TS / 48, x = PX(k.x), y = PY(k.y), lobo = k.fase === "lobo", vira = k.fase === "vira"; if (!naTela(x, y, 200)) return;
  const cresce = vira ? cl(k.t / 1.3, 0, 1) : lobo ? 1 : 0;
  sombra(x, y, (11 + cresce * 8) * sc, 4 * sc, .42); c.save(); c.translate(x + (vira ? Math.sin(tm * 60) * 2 : 0), y); c.scale((k.dir || 1) * sc, sc); c.lineCap = "round"; c.lineJoin = "round";
  const f = tm * (lobo ? 14 : 8), sw = Math.sin(f) * (k.anda ? 4 : 0);
  if (!lobo && cresce < .5) { cachorroMagro(sw, vira, tm);
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
function _desenharVulto(v, tm) { _desenharVultoNovo(v, tm); }
function desenharVela(x, y, tm) { c.fillStyle = "#e8e2d0"; c.fillRect(x - 3, y - 14, 6, 14); c.fillStyle = "rgba(200,190,170,.8)"; c.fillRect(x - 3, y - 14, 2, 8); c.fillStyle = `rgba(255,${200 + Math.sin(tm * 20) * 30},90,.95)`; c.beginPath(); c.ellipse(x + Math.sin(tm * 9) * .8, y - 18, 2.6, 4.5, 0, 0, 7); c.fill(); }
function desenharCruz(tm) {
  const x = PX(CRUZ.x), y = PY(CRUZ.y); if (!naTela(x, y)) return; sombra(x, y, TS * .3, TS * .1);
  c.fillStyle = "#5a4028"; c.fillRect(x - 4, y - TS * 1.5, 8, TS * 1.5); c.fillRect(x - TS * .42, y - TS * 1.15, TS * .84, 7);
  c.fillStyle = "rgba(240,235,220,.6)"; c.fillRect(x - TS * .3, y - TS * .95, TS * .1, TS * .3);
  for (let i = 0; i < 5; i++) { c.fillStyle = "#e8e2d0"; c.fillRect(x - TS * .5 + i * TS * .25, y - 7, 4, 7); } // tocos de velas antigas
  if (R.velaEntregue) desenharVela(x + TS * .35, y, tm);
  for (let i = 0; i < 3; i++) { c.fillStyle = ["#c83a2a", "#e8c84a", "#e8e2d4"][i]; c.beginPath(); c.arc(x - TS * .25 + i * TS * .2, y + 4, 3, 0, 7); c.fill(); }
}
/* ---------- monstros maiores: cada desenho é ampliado a partir do pé ---------- */
function maior(fn, o, k, tm) { const x = PX(o.x), y = PY(o.y); c.save(); c.translate(x, y); c.scale(k, k); c.translate(-x, -y); fn(o, tm); c.restore(); }
const desenharSeco = (o, tm) => maior(_desenharSeco, o, 1.35, tm);
const desenharCachorro = (o, tm) => maior(_desenharCachorro, o, o.fase === "lobo" ? 1.6 : o.fase === "vira" ? 1 + .6 * cl(o.t / 1.3, 0, 1) : 1, tm);
const desenharEspantalho = (o, tm) => maior(_desenharEspantalho, o, 1.4, tm);
const desenharAranha = (o, tm) => o.fase === "longe" ? 0 : maior(_desenharAranha, o, 1.3, tm);
const desenharMula = (o, tm) => o.fase === "corre" ? maior(_desenharMula, o, 1.35, tm) : _desenharMula(o, tm);
const desenharVulto = (o, tm) => maior(_desenharVulto, o, 1.3, tm);
/* ---------- desenhos novos dos bichos: menos bola, mais osso, casca, rasgo e garra ---------- */
const poli = (pts, cor) => { c.fillStyle = cor; c.beginPath(); pts.forEach(([px, py], i) => i ? c.lineTo(px, py) : c.moveTo(px, py)); c.closePath(); c.fill(); };
const traco = (pts, cor, w) => { c.strokeStyle = cor; c.lineWidth = w; c.beginPath(); pts.forEach(([px, py], i) => i ? c.lineTo(px, py) : c.moveTo(px, py)); c.stroke(); };
function chamas(x0, y0, larg, alt, tm, n = 9, cores = ["#7a0e06", "#d8320e", "#ff7a1e", "#ffd25a"]) { // fogo em pontas, nada de bolinhas
  cores.forEach((cor, camada) => { const k = 1 - camada * .2; c.fillStyle = cor; c.beginPath(); c.moveTo(x0 - larg / 2 * k, y0);
    for (let i = 0; i <= n; i++) { const t = i / n, px = x0 - larg / 2 * k + larg * k * t, osc = Math.sin(tm * 17 + i * 2.1 + camada) * .2 + Math.sin(tm * 9 + i) * .15, h = alt * k * (.55 + .45 * Math.sin(t * PI)) * (1 + osc); c.lineTo(px - larg * k / n * .25, y0 - h * (i % 2 ? .45 : 1)); }
    c.lineTo(x0 + larg / 2 * k, y0); c.closePath(); c.fill(); });
  for (let i = 0; i < 4; i++) { const f = (tm * .9 + i * .27) % 1; c.fillStyle = `rgba(255,${150 + i * 20},60,${1 - f})`; c.fillRect(x0 + Math.sin(tm * 3 + i * 2) * larg * .4, y0 - alt * (1 + f * 1.2), 1.6, 1.6); } // brasas subindo
}
function desenharCurupira(cu, tm) {
  const x = PX(cu.x), y = PY(cu.y); if (!naTela(x, y, 220)) return; const s = TS / 48 * 1.55, f = cu.fase2 || 0, sw = Math.sin(f), d = cu.dir || 1, corre = cu.fase === "vem";
  c.save(); c.translate(x, y); c.globalCompositeOperation = "lighter"; const lz = c.createRadialGradient(0, -62 * s, 4, 0, -62 * s, 70 * s); lz.addColorStop(0, "rgba(255,110,30,.28)"); lz.addColorStop(1, "rgba(255,110,30,0)"); c.fillStyle = lz; c.fillRect(-80 * s, -140 * s, 160 * s, 160 * s); c.globalCompositeOperation = "source-over"; c.restore();
  sombra(x, y, 22 * s, 5 * s, .55); c.save(); c.translate(x, y); c.scale(d * s, s); c.lineCap = "round"; c.lineJoin = "round";
  const casca = "#3a2e1a", casca2 = "#2a2012", musgo = "#3e5a22";
  // pernas finas com joelho saltado e pés virados pra trás (calcanhar na frente, dedos atrás)
  [[-1, sw], [1, -sw]].forEach(([l, a]) => { const hx = l * 3, kx = hx + 5 + a * 6, ky = -16 - Math.max(0, a) * 3, fx = hx + a * 9;
    traco([[hx, -34], [kx, ky], [fx, -2]], l < 0 ? casca2 : casca, 4.2); c.fillStyle = casca2; c.beginPath(); c.arc(kx, ky, 2.6, 0, 7); c.fill();
    poli([[fx + 3, -3], [fx - 9, -2], [fx - 11, 0], [fx + 4, 0]], "#1e160c"); for (let k = 0; k < 3; k++) traco([[fx - 9, -1], [fx - 13 - k, -1 + k * .8]], "#1e160c", 1.2); });
  // tronco de casca de árvore, magro, costelas e cipó
  poli([[-8, -34], [-11, -46], [-9, -60], [-5, -66], [6, -66], [10, -58], [9, -46], [7, -34], [0, -31]], casca);
  c.strokeStyle = casca2; c.lineWidth = .9; for (let i = 0; i < 7; i++) { c.beginPath(); c.moveTo(-8 + i * 2.6, -64); c.lineTo(-9 + i * 2.6 + (i % 2), -36); c.stroke(); } // veios da casca
  traco([[-9, -44], [-2, -41], [8, -44]], casca2, 1.2); traco([[-9, -49], [-1, -46], [9, -49]], casca2, 1.2); traco([[-8, -54], [0, -51], [9, -54]], casca2, 1.2); // costelas
  poli([[-9, -58], [-4, -55], [-6, -50], [-11, -52]], musgo); poli([[4, -40], [9, -42], [8, -36], [3, -36]], musgo); // musgo
  c.strokeStyle = "#4a6a2a"; c.lineWidth = 1.4; c.beginPath(); c.moveTo(-9, -36); c.bezierCurveTo(3, -42, -6, -52, 9, -60); c.stroke(); for (let i = 0; i < 4; i++) poli([[-5 + i * 4, -42 - i * 5], [-2 + i * 4, -45 - i * 5], [-1 + i * 4, -41 - i * 5]], "#5a8a2a"); // cipó com folhinhas
  // braços compridos esticados pra frente com dedos de galho
  const alc = corre ? 1 : .5; [[-1, -sw * .4, casca2], [1, sw * .4, casca]].forEach(([l, a, cor]) => { const ox = l * 6, oy = -62, ex = ox + 16 + alc * 10 + a * 4, ey = -50 + a * 6, mx = ex + 13 + alc * 6, my = -44 + a * 8;
    traco([[ox, oy], [ex, ey], [mx, my]], cor, 3.2); c.fillStyle = cor; c.beginPath(); c.arc(ex, ey, 2, 0, 7); c.fill();
    for (let k = -2; k <= 2; k++) { traco([[mx, my], [mx + 6, my + k * 2.6], [mx + 10, my + k * 3.6 + (k % 2) * 2]], "#1e160c", 1.1); traco([[mx + 6, my + k * 2.6], [mx + 8, my + k * 2.6 - 2]], "#1e160c", .8); } });
  // cabeça: crânio comprido, órbitas fundas com brasa, presas pra cima
  c.save(); c.translate(4, -72); c.rotate(corre ? .2 : .05);
  poli([[-8, 4], [-9, -6], [-5, -12], [5, -12], [10, -6], [12, 2], [10, 8], [3, 11], [-4, 9]], "#4a3a22");
  c.strokeStyle = "rgba(20,14,6,.7)"; c.lineWidth = .8; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(-6 + i * 4, -11); c.lineTo(-7 + i * 4, -4); c.stroke(); }
  poli([[1, -5], [5, -6], [5, -1], [1, -1]], "#050200"); poli([[7, -5], [10, -5], [10, -1], [7, -1]], "#050200");
  const br = .7 + .3 * Math.sin(tm * 11); c.fillStyle = `rgba(255,${corre ? 60 : 150},20,${br})`; c.fillRect(2.4, -4, 2, 2); c.fillRect(8, -4, 1.8, 1.8);
  poli([[8, 1], [13, 2], [12, 4]], "#2a1c0e"); // narina de bicho
  poli([[0, 5], [12, 4], [11, 9], [1, 10]], "#140804"); c.fillStyle = "#e8dcc0"; for (let i = 0; i < 6; i++) poli([[1.5 + i * 1.8, 5], [2.4 + i * 1.8, 7.5], [3.3 + i * 1.8, 5]], "#e8dcc0");
  poli([[2, 10], [0, 1], [3.5, 9]], "#efe2c0"); poli([[10, 9], [12, 0], [11.8, 9]], "#efe2c0"); // presas
  // cabelo de fogo em pontas
  c.save(); c.rotate(-.15); chamas(1, -10, 26, 22 + (corre ? 8 : 0), tm, 11); c.restore();
  c.restore();
  c.restore();
}
function espantalhoCorpo(e, tm, vivo) { // usa TS como unidade, igual ao desenho antigo
  const T = TS; c.lineJoin = "round";
  // casaco esfarrapado com barra rasgada e remendos
  poli([[-T * .22, -T * .98], [T * .22, -T * .98], [T * .26, -T * .55], [T * .2, -T * .5], [T * .16, -T * .42], [T * .1, -T * .5], [T * .03, -T * .4], [-T * .04, -T * .5], [-T * .1, -T * .42], [-T * .16, -T * .5], [-T * .24, -T * .46]], "#3a4a5a");
  poli([[-T * .08, -T * .9], [T * .02, -T * .9], [T * .02, -T * .78], [-T * .08, -T * .78]], "#7a3a2a"); poli([[T * .08, -T * .7], [T * .17, -T * .72], [T * .18, -T * .62], [T * .09, -T * .6]], "#8a7a4a");
  c.strokeStyle = "rgba(230,220,190,.6)"; c.lineWidth = 1; c.setLineDash([2, 2]); c.strokeRect(-T * .08, -T * .9, T * .1, T * .12); c.setLineDash([]);
  c.strokeStyle = "#c8a050"; c.lineWidth = 1.2; for (let i = 0; i < 9; i++) { const bx = -T * .22 + i * T * .055; c.beginPath(); c.moveTo(bx, -T * .47 - (i % 2) * 4); c.lineTo(bx + (i % 3 - 1) * 2, -T * .36 + (vivo ? Math.sin(tm * 14 + i) * 2 : 0)); c.stroke(); } // palha saindo da barra
  // braços de pau com palha, e uma foice enferrujada
  c.fillStyle = "#4a3018"; c.fillRect(-T * .46, -T * .96, T * .92, 4);
  for (const l of [-1, 1]) { c.strokeStyle = "#c8a050"; c.lineWidth = 1.3; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(l * T * .44, -T * .95); c.lineTo(l * T * (.52 + (i % 3) * .03), -T * .98 + i * 3 + (vivo ? Math.sin(tm * 12 + i) * 2 : 0)); c.stroke(); } }
  if (vivo) { c.save(); c.translate(T * .5, -T * .95); c.rotate(Math.sin(tm * 6) * .3); c.fillStyle = "#4a3018"; c.fillRect(-2, 0, 4, T * .35); c.fillStyle = "#7a6a5a"; c.beginPath(); c.moveTo(0, T * .33); c.quadraticCurveTo(T * .3, T * .35, T * .32, T * .1); c.quadraticCurveTo(T * .22, T * .28, 0, T * .27); c.fill(); c.fillStyle = "rgba(120,40,20,.6)"; c.fillRect(T * .12, T * .27, 4, 3); c.restore(); }
  // cabeça de saco torta, costurada
  c.save(); c.translate(0, -T * 1.12); c.rotate(vivo ? Math.sin(tm * 5) * .2 : .18);
  poli([[-T * .15, T * .1], [-T * .17, -T * .04], [-T * .12, -T * .16], [T * .02, -T * .19], [T * .15, -T * .12], [T * .17, T * .02], [T * .12, T * .12], [0, T * .14]], "#b8a478");
  c.strokeStyle = "rgba(80,60,30,.5)"; c.lineWidth = .8; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(-T * .15, -T * .12 + i * T * .05); c.lineTo(T * .15, -T * .13 + i * T * .05); c.stroke(); } // trama do saco
  c.strokeStyle = "#3a2a1a"; c.lineWidth = 1.2; c.beginPath(); c.moveTo(-T * .14, T * .1); c.lineTo(T * .13, T * .11); c.stroke(); for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(-T * .12 + i * T * .05, T * .08); c.lineTo(-T * .11 + i * T * .05, T * .13); c.stroke(); } // amarrado no pescoço
  const olhos = horaNoite() > .5 && (e.fase === "vivo" || Math.sin(tm * .6) > .8);
  poli([[-T * .1, -T * .06], [-T * .03, -T * .07], [-T * .06, 0]], olhos ? "#ff5a1e" : "#140c06"); poli([[T * .03, -T * .07], [T * .1, -T * .05], [T * .06, 0]], olhos ? "#ff5a1e" : "#140c06");
  if (olhos) { c.fillStyle = "rgba(255,90,30,.25)"; c.beginPath(); c.arc(0, -T * .04, T * .14, 0, 7); c.fill(); }
  c.fillStyle = "#140806"; c.beginPath(); c.moveTo(-T * .1, T * .04); c.quadraticCurveTo(0, T * (vivo ? .12 : .08), T * .11, T * .03); c.quadraticCurveTo(0, T * .07, -T * .1, T * .04); c.fill();
  c.strokeStyle = "#d8ccb0"; c.lineWidth = .9; for (let i = 0; i < 8; i++) { c.beginPath(); c.moveTo(-T * .09 + i * T * .026, T * .02); c.lineTo(-T * .09 + i * T * .026, T * .09); c.stroke(); } // a boca costurada com linha
  // chapéu rasgado
  poli([[-T * .3, -T * .13], [T * .28, -T * .16], [T * .2, -T * .11], [-T * .24, -T * .09]], "#a8843a"); poli([[-T * .13, -T * .14], [-T * .11, -T * .3], [T * .02, -T * .33], [T * .13, -T * .25], [T * .12, -T * .15]], "#b89448");
  c.fillStyle = "#3a2a14"; c.beginPath(); c.arc(T * .04, -T * .24, T * .03, 0, 7); c.fill(); c.strokeStyle = "rgba(60,40,20,.6)"; c.lineWidth = 1; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(-T * .28 + i * T * .15, -T * .12); c.lineTo(-T * .3 + i * T * .15, -T * .06); c.stroke(); }
  c.restore();
  // um corvo no braço
  if (!vivo) { const cx2 = -T * .38, cy2 = -T * .98; poli([[cx2 - 6, cy2], [cx2 + 4, cy2 - 1], [cx2 + 7, cy2 - 6], [cx2 + 2, cy2 - 9], [cx2 - 4, cy2 - 6]], "#0e0e12"); poli([[cx2 + 6, cy2 - 7], [cx2 + 11, cy2 - 6], [cx2 + 6, cy2 - 5]], "#3a3a3a"); c.fillStyle = horaNoite() > .5 ? "#e2483d" : "#c8c8c8"; c.fillRect(cx2 + 4, cy2 - 8, 1.4, 1.4); poli([[cx2 - 6, cy2 - 1], [cx2 - 12, cy2 + 2], [cx2 - 5, cy2 - 3]], "#0e0e12"); }
}
function _desenharVultoNovo(v, tm) { const x = PX(v.x), y = PY(v.y); if (!naTela(x, y)) return; const a = Math.min(1, v.t / 2) * .95, T = TS;
  c.save(); c.globalAlpha = a; c.translate(x, y);
  const borda = []; for (let i = 0; i <= 12; i++) borda.push([-T * .32 + i * T * .053, -T * (.02 + (i % 2) * .14 + Math.abs(Math.sin(tm * 2 + i)) * .08)]); // barra rasgada que se mexe
  poli([[-T * .14, -T * 1.9], [T * .14, -T * 1.9], [T * .22, -T * 1.2], [T * .32, -T * .1], ...borda.reverse(), [-T * .32, -T * .1], [-T * .22, -T * 1.2]], "#030304");
  for (const l of [-1, 1]) { traco([[l * T * .15, -T * 1.75], [l * T * .3, -T * 1.1], [l * T * .27, -T * .45]], "#030304", 3); for (let k = -1; k <= 1; k++) traco([[l * T * .27, -T * .45], [l * T * (.27 + k * .04), -T * .2]], "#030304", 1.4); } // braços com dedos compridos
  c.save(); c.translate(0, -T * 2.08); c.rotate(.25 + Math.sin(tm * .7) * .05); poli([[-T * .14, T * .1], [-T * .15, -T * .08], [-T * .05, -T * .18], [T * .08, -T * .16], [T * .15, -T * .05], [T * .12, T * .12]], "#030304");
  c.fillStyle = "rgba(240,240,235,.95)"; c.fillRect(-T * .07, -T * .04, 2.6, 3.4); c.fillRect(T * .04, -T * .04, 2.6, 3.4); c.fillStyle = "rgba(200,200,200,.5)"; c.fillRect(-T * .04, T * .05, T * .08, 1.4); c.restore();
  for (let i = 0; i < 5; i++) { const f = (tm * .5 + i * .2) % 1; c.fillStyle = `rgba(10,10,14,${.5 * (1 - f)})`; c.beginPath(); c.moveTo(-T * .1 + i * T * .05, -T * (1 + f)); c.lineTo(-T * .07 + i * T * .05, -T * (1.15 + f)); c.lineTo(-T * .04 + i * T * .05, -T * (1 + f)); c.fill(); } // fiapos de sombra subindo
  c.restore(); }
function cachorroMagro(sw, vira, tm) { // o cachorro preto: osso, espinha, pernas compridas demais e um sorriso de gente
  const preto = "#0c0c0e";
  [[-10, sw], [-6, -sw], [7, -sw], [11, sw]].forEach(([lx, s2]) => { traco([[lx, -12], [lx - 2 + s2 * .5, -6], [lx + s2, 0]], preto, 2); c.fillStyle = preto; c.beginPath(); c.arc(lx - 2 + s2 * .5, -6, 1.3, 0, 7); c.fill(); });
  poli([[-14, -13], [-12, -17], [-4, -18], [4, -17], [10, -18], [14, -15], [12, -11], [4, -11], [-2, -9], [-8, -11]], preto);
  for (let i = 0; i < 7; i++) poli([[-11 + i * 3.4, -17.5], [-9.6 + i * 3.4, -20.5], [-8.2 + i * 3.4, -17.5]], preto); // espinha saltada
  c.strokeStyle = "rgba(80,80,90,.7)"; c.lineWidth = .7; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(-3 + i * 2.6, -16.5); c.lineTo(-4 + i * 2.6, -11.5); c.stroke(); } // costelas
  traco([[-13, -15], [-19, -18], [-21, -12]], preto, 1.6); // rabo pelado
  poli([[11, -16], [13, -23], [17, -24], [26, -19], [26, -16], [16, -14]], preto); poli([[13, -22], [13, -30], [16, -23]], preto); poli([[16, -23], [18, -29], [19, -22]], preto); // cabeça comprida e orelhas
  c.strokeStyle = "#e8e0d0"; c.lineWidth = .8; c.beginPath(); c.moveTo(15, -17); c.quadraticCurveTo(20, -14.5, 25.5, -17); c.stroke(); c.fillStyle = "#e8e0d0"; for (let i = 0; i < 6; i++) poli([[15.5 + i * 1.7, -16.8 + (i > 2 ? .3 : 0)], [16.2 + i * 1.7, -15.6], [16.9 + i * 1.7, -16.6]], "#e8e0d0"); // sorriso cheio de dente
  c.fillStyle = `rgba(230,40,30,${vira ? 1 : .9})`; c.fillRect(18, -21.5, 2, 1.6); c.fillStyle = "rgba(230,40,30,.25)"; c.beginPath(); c.arc(19, -21, 5, 0, 7); c.fill();
  if (vira) { c.fillStyle = "rgba(230,40,30,.18)"; c.beginPath(); c.arc(0, -16, 22 + Math.sin(tm * 30) * 4, 0, 7); c.fill(); }
}
function mulaCorpo(gal, tm) {
  const couro = "#24180f", osso = "#d8ccb0";
  const perna = (px, fz, cor) => { const a = Math.sin(gal + fz), b = Math.sin(gal + fz + 1); traco([[px, -24], [px + a * 8, -12], [px + b * 10, -1]], cor, 3.6); c.fillStyle = cor; c.beginPath(); c.arc(px + a * 8, -12, 2.2, 0, 7); c.fill(); poli([[px + b * 10 - 3, -2], [px + b * 10 + 3, -2], [px + b * 10 + 4, 1], [px + b * 10 - 4, 1]], "#8a8a8a"); if (b > .8) { c.fillStyle = "#ffd25a"; c.fillRect(px + b * 10 + 4, -1, 2, 2); c.fillRect(px + b * 10 + 7, -3, 1.4, 1.4); } };
  perna(-15, 0, "#170f0a"); perna(9, 3, "#170f0a");
  poli([[-24, -30], [-20, -38], [-6, -40], [8, -39], [18, -40], [24, -34], [22, -24], [12, -22], [-2, -24], [-14, -22], [-22, -24]], couro);
  c.strokeStyle = "rgba(0,0,0,.6)"; c.lineWidth = 1.1; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(-6 + i * 3.6, -37); c.quadraticCurveTo(-4 + i * 3.6, -31, -7 + i * 3.6, -25); c.stroke(); } // costelas
  poli([[-22, -36], [-18, -42], [-14, -36]], osso); poli([[-20, -27], [-17, -31], [-14, -26]], "#3a2a1c"); // osso do quadril saindo
  for (let i = 0; i < 5; i++) poli([[-14 + i * 6, -39.5], [-12 + i * 6, -42], [-10 + i * 6, -39.5]], couro); // espinha
  perna(-9, 2, couro); perna(15, 5, couro);
  traco([[-23, -32], [-32, -30 + Math.sin(gal) * 4], [-35, -16]], "#140c08", 2.4); for (let i = 0; i < 4; i++) traco([[-35, -16], [-37 + i * 1.6, -9 + (i % 2) * 2]], "#140c08", 1); // rabo desfiado
  poli([[14, -38], [20, -48], [26, -54], [33, -49], [28, -40], [22, -28]], couro); // pescoço sem cabeça
  poli([[24, -53], [33, -50], [31, -47], [25, -50]], "#7a1a10"); c.fillStyle = osso; c.beginPath(); c.arc(29, -50.5, 1.6, 0, 7); c.fill(); // o toco, com o osso aparecendo
  c.strokeStyle = "#7a7a72"; c.lineWidth = 1.4; for (let i = 0; i < 6; i++) { c.beginPath(); c.ellipse(19 + i * 1.6, -36 - i * 2.4, 2.2, 1.4, .8, 0, 7); c.stroke(); } traco([[29, -24], [32, -14 + Math.sin(gal * 2) * 3], [30, -4]], "#7a7a72", 1.3); // corrente arrastando
  c.save(); c.translate(29, -52); c.rotate(.5); chamas(0, 0, 14, 30, tm, 7); c.restore();
}
/* ---------- bicho novo: a Cuca ---------- */
// De noite, a partir do segundo dia, às vezes ela sai do mato cantando a cantiga de ninar. Ela é lenta,
// mas ouve barulho: se você corre ou está de lanterna acesa perto dela, ela dispara. Parada e no escuro, ela se perde.
function atualizarCuca(dt) {
  const k = R.cuca || (R.cuca = { fase: "longe", prox: rnd(30, 90), t: 0, x: 0, y: 0 });
  if (!ehNoite()) { if (k.fase !== "longe") { k.fase = "longe"; } k.prox = rnd(25, 80); return; }
  const fora = jogadores().filter(P => (P.lugar || "sitio") === "sitio" && !P.dentro && !P.caido);
  if (k.fase === "longe") { if (R.dia < 2 || !k.hoje) return; k.prox -= dt; if (k.prox > 0 || !fora.length) return; const J = fora[0], lado = Math.random() < .5 ? -1 : 1;
    Object.assign(k, { fase: "anda", t: 0, x: cl(J.eu.x + lado * 12, CERCA.x0 + 1, CERCA.x1 - 1), y: cl(J.eu.y + rnd(-5, 5), CERCA.y0 + 1, CERCA.y1 - 1), canto: 0 }); efeito("Alguém está cantando... uma cantiga de ninar.", "#c8b8e8"); return; }
  k.t += dt; if (k.t > 45 || !fora.length) { k.fase = "longe"; k.prox = rnd(40, 110); return; }
  let alvo = fora[0], md = 1e9; fora.forEach(P => { const d = dist(P.eu, k); if (d < md) { md = d; alvo = P; } });
  const barulho = (alvo.correndo || alvo.lanterna) && md < 8; k.fase = barulho ? "ataca" : "anda";
  const v = barulho ? 4.1 : (md < 3 ? .6 : 1.5), ang = Math.atan2(alvo.eu.y - k.y, alvo.eu.x - k.x) + (barulho ? 0 : Math.sin(k.t * .7) * .9);
  k.x += Math.cos(ang) * v * dt; k.y += Math.sin(ang) * v * dt; k.dir = Math.cos(ang) > 0 ? 1 : -1; k.passo = (k.passo || 0) + dt * v * 3;
  k.canto -= dt; if (k.canto <= 0) { k.canto = 2.6; const [vv, pn] = somEm(k.x, k.y); [0, 3, 7, 3, 5, 3].forEach((n, i) => tocarTom(330 * Math.pow(2, n / 12) * (barulho ? 1.06 : 1), .36, { tipo: "triangle", vol: .06 * vv, pan: pn, wet: .7, quando: i * .38 })); }
  if (md < .8) comJogador(alvo, () => morrer("cuca", "A Cuca te pegou. \"Nana, neném, que a Cuca vem pegar...\" Ela cantou até o fim.", "Quando ouvir a cantiga, apague a lanterna e não corre: ela é lenta e se perde no escuro. Só dispara atrás de barulho e de luz."));
}
function desenharCuca(k, tm) {
  if (!k || k.fase === "longe") return; const x = PX(k.x), y = PY(k.y); if (!naTela(x, y, 200)) return; const s = TS / 48 * 1.5, p = k.passo || 0, sw = Math.sin(p), d = k.dir || 1, ataca = k.fase === "ataca";
  sombra(x, y, 20 * s, 5 * s, .5); c.save(); c.translate(x, y); c.scale(d * s, s); c.lineCap = "round"; c.lineJoin = "round";
  const pele = "#4a5a2a", pele2 = "#34421c", ventre = "#a8a070";
  [[-4, sw], [4, -sw]].forEach(([lx, a]) => { traco([[lx, -26], [lx + a * 5 + 3, -12], [lx + a * 7, -1]], pele2, 4); poli([[lx + a * 7 - 2, -2], [lx + a * 7 + 7, -1], [lx + a * 7 + 8, 1], [lx + a * 7 - 3, 1]], pele2); for (let i = 0; i < 3; i++) traco([[lx + a * 7 + 6, 0], [lx + a * 7 + 10, -1 + i]], "#d8ccb0", 1); });
  poli([[-12, -26], [-10, -40], [-14, -52], [-8, -58], [6, -58], [10, -48], [12, -36], [10, -24], [4, -14], [-4, -12], [-10, -16]], "#3a2a3a"); // vestido velho
  for (let i = 0; i < 9; i++) poli([[-10 + i * 2.4, -14 + (i % 2) * 2], [-9 + i * 2.4, -9 - (i % 3)], [-8 + i * 2.4, -14]], "#3a2a3a"); // barra rasgada
  c.fillStyle = "rgba(200,180,140,.25)"; for (let i = 0; i < 6; i++) c.fillRect(-8 + (i * 3.1) % 14, -50 + i * 5, 3, 1.2); // remendos
  poli([[-16, -54], [-22, -44], [-20, -30], [-12, -28], [-10, -44]], "#6a5a3a"); traco([[-14, -52], [-6, -58]], "#3a2a1a", 1.2); c.fillStyle = "rgba(40,30,20,.5)"; c.fillRect(-19, -42, 6, 1.2); // o saco nas costas
  // braços compridos com garras
  [[-1, -sw * .4, pele2], [1, sw * .4, pele]].forEach(([l, a, cor]) => { const ox = 4 + l * 2, ex = ox + 10 + (ataca ? 8 : 2), ey = -42 + a * 6, mx = ex + (ataca ? 12 : 4), my = ataca ? -46 : -30 + a * 4; traco([[ox, -54], [ex, ey], [mx, my]], cor, 3); for (let i = -1; i <= 1; i++) traco([[mx, my], [mx + 5, my + i * 2.5 + 2], [mx + 7, my + i * 3 + 4]], "#d8ccb0", 1); });
  // cabeça de jacaré com cabelo de palha
  c.save(); c.translate(4, -66); c.rotate(ataca ? .15 : -.05 + Math.sin(tm * 1.3) * .05); const ab = ataca ? .3 + .3 * Math.abs(Math.sin(tm * 9)) : .08;
  for (let i = 0; i < 14; i++) traco([[-6 + i * .9, -6], [-14 + i * 1.2 + Math.sin(tm * 2 + i) * 1.5, 6 + (i % 4) * 4]], i % 2 ? "#b8b0a0" : "#8a8478", 1.3); // cabelo comprido e ralo
  poli([[-8, -2], [-7, -9], [0, -12], [8, -9], [24, -6], [30, -3], [29, 0], [8, 1]], pele); // focinho comprido de cima
  c.fillStyle = pele2; for (let i = 0; i < 6; i++) poli([[2 + i * 4, -9 + i * .5], [4 + i * 4, -12 + i * .5], [6 + i * 4, -8.5 + i * .5]], pele2); // escamas em ponta
  c.save(); c.translate(6, 1); c.rotate(ab); poli([[0, 0], [24, 0], [22, 4], [0, 5]], pele2); c.fillStyle = "#e8e0c8"; for (let i = 0; i < 8; i++) poli([[1 + i * 2.8, 0], [2.2 + i * 2.8, -3], [3.4 + i * 2.8, 0]], "#e8e0c8"); c.restore();
  c.fillStyle = "#e8e0c8"; for (let i = 0; i < 9; i++) poli([[6 + i * 2.6, 0], [7.2 + i * 2.6, 3.5 + (i % 3 === 0 ? 1.5 : 0)], [8.4 + i * 2.6, 0]], "#e8e0c8");
  c.fillStyle = "#1a1408"; c.beginPath(); c.arc(28, -3, .9, 0, 7); c.fill();
  poli([[0, -8], [6, -9], [5, -5], [0, -5]], "#e8c820"); c.fillStyle = "#050200"; c.fillRect(2.6, -8.6, 1, 3.6); // olho de cobra
  c.strokeStyle = pele2; c.lineWidth = 1; c.beginPath(); c.moveTo(-1, -9.5); c.lineTo(6.5, -10.5); c.stroke();
  c.restore();
  c.restore();
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
function _desenharEspantalho(e, tm) {
  const x = PX(e.x), y = PY(e.y); if (!naTela(x, y)) return; const vivo = e.fase === "vivo" && !e.parado, tr = vivo ? Math.sin(tm * 30) * 1.5 : 0, inc = vivo ? Math.sin(tm * 8) * .12 : 0;
  if (e.fase !== "poste") { const px = PX(ESPANTALHO.x), py = PY(ESPANTALHO.y); c.fillStyle = "#5a3a22"; c.fillRect(px - 2, py - TS * 1.2, 4, TS * 1.2); c.fillRect(px - TS * .4, py - TS * .95, TS * .8, 4); }
  sombra(x, y, TS * .3, TS * .1); c.save(); c.translate(x + tr, y); c.rotate(inc);
  if (e.fase === "poste") { c.fillStyle = "#5a3a22"; c.fillRect(-2, -TS * 1.2, 4, TS * 1.2); c.fillRect(-TS * .4, -TS * .95, TS * .8, 4); }
  else { c.strokeStyle = "#5a4a30"; c.lineWidth = 3; const pe = vivo ? Math.sin(tm * 9) * TS * .12 : 0; c.beginPath(); c.moveTo(0, -TS * .5); c.lineTo(-TS * .12 + pe, 0); c.moveTo(0, -TS * .5); c.lineTo(TS * .12 - pe, 0); c.stroke(); } // pernas de palha
  espantalhoCorpo(e, tm, vivo);
  c.restore();
}
function _desenharAranha(a, tm) {
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
function _desenharMula(m, tm) {
  if (m.fase === "aviso") { // o chão brilha em linha reta
    const k = Math.min(1, m.t / 1.2), pis = .5 + .5 * Math.sin(tm * 18); c.save(); c.globalCompositeOperation = "lighter";
    if (m.horiz) { const yy = PY(m.linha), g = c.createLinearGradient(0, yy - TS * .7, 0, yy + TS * .7); g.addColorStop(0, "rgba(255,90,20,0)"); g.addColorStop(.5, `rgba(255,120,30,${.35 * k * (.6 + .4 * pis)})`); g.addColorStop(1, "rgba(255,90,20,0)"); c.fillStyle = g; c.fillRect(PX(CERCA.x0), yy - TS * .7, (CERCA.x1 - CERCA.x0) * TS, TS * 1.4); }
    else { const xx = PX(m.linha), g = c.createLinearGradient(xx - TS * .7, 0, xx + TS * .7, 0); g.addColorStop(0, "rgba(255,90,20,0)"); g.addColorStop(.5, `rgba(255,120,30,${.35 * k * (.6 + .4 * pis)})`); g.addColorStop(1, "rgba(255,90,20,0)"); c.fillStyle = g; c.fillRect(xx - TS * .7, PY(CERCA.y0), TS * 1.4, (CERCA.y1 - CERCA.y0) * TS); }
    c.restore(); return;
  }
  if (m.fase !== "corre") return; const x = PX(m.x), y = PY(m.y); if (!naTela(x, y, 200)) return;
  const k = TS / 48 * 1.3, dx = m.horiz ? m.dir : 1, gal = tm * 26;
  sombra(x, y, 26 * k, 6 * k, .5); c.save(); c.translate(x, y); c.scale(dx * k, k); c.lineCap = "round";
  mulaCorpo(gal, tm); c.restore();
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
  const offC = R.venceu ? Math.max(0, R.venceu.t - 1.5) * 2.2 : 0, alvo = R.venceu ? { x: CAMINHONETE.x, y: CAMINHONETE.y + offC } : R.espiar ? { x: CASA.porta.x + .6, y: CASA.porta.y + 2 } : R.eu; cam.x = mix(cam.x, alvo.x, .12); cam.y = mix(cam.y, alvo.y - .6, .12);
  if (R.tremor > 0) { cam.x += rnd(-.06, .06); cam.y += rnd(-.06, .06); }
  c.fillStyle = "#1a2210"; c.fillRect(0, 0, W, H);
  desenharChaoChunks(CHAO_SITIO);
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
  obj.push([VACA.y, () => desenharVaca(tm)]); obj.push([CARRIOLA.y, () => desenharDecor(tm, 0)]); obj.push([LENHA.y, () => desenharDecor(tm, 1)]); FENOS.forEach(([, y], i) => obj.push([y, () => desenharDecor(tm, 2 + i)]));
  obj.push([R.esp.y, () => desenharEspantalho(R.esp, tm)]);
  if (R.aranha.fase !== "longe") obj.push([R.aranha.y, () => desenharAranha(R.aranha, tm)]);
  if (R.mula.fase === "corre") obj.push([R.mula.y, () => desenharMula(R.mula, tm)]);
  if (R.saci.fase !== "longe") obj.push([R.saci.y, () => desenharSaci(R.saci, tm)]);
  const ou = R.outro; if (ou && !ou.dentro && (ou.lugar || "sitio") === "sitio" && !(R.venceu && R.venceu.t > 1)) obj.push([ou.eu.y, () => { desenharVoce(PX(ou.eu.x), PY(ou.eu.y), tm, { q: ou, nome: R.online === "host" ? "Amigo(a)" : "Yasmin" }); if (ou.velaCom) desenharVela(PX(ou.eu.x) - TS * .28, PY(ou.eu.y) - TS * .35, tm); }]);
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
  for (let y = CERCA.y0; y <= CERCA.y1; y++) { if (y !== 17) obj.push([y, () => ce.post(CERCA.x0, y)]); obj.push([y, () => ce.post(CERCA.x1, y)]); if (y < CERCA.y1) { if (y < 15.5 || y > 17.5) obj.push([y + 1, () => ce.trilho(CERCA.x0, y, CERCA.x0, y + 1)]); obj.push([y + 1, () => ce.trilho(CERCA.x1, y, CERCA.x1, y + 1)]); } }
  for (let y = 6; y <= 11; y++) { obj.push([y, () => ce.post(25.5, y)]); obj.push([y, () => ce.post(32.5, y)]); } for (let x = 25.5; x <= 32.5; x++) if (x < 28 || x > 29.5) obj.push([11.6, () => ce.post(x, 11.6)]); // cercadinho
  obj.push([R.gato.y, () => desenharGato(R.gato, tm)]);
  if (R.cachorro) obj.push([R.cachorro.y, () => desenharCachorro(R.cachorro, tm)]);
  obj.push([R.seco.y, () => desenharSeco(R.seco, tm)]); if (R.cuca && R.cuca.fase !== "longe") obj.push([R.cuca.y, () => desenharCuca(R.cuca, tm)]);
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
  if (R.dentro) furo(PX(CASA.porta.x + 1.6), PY(CASA.porta.y + .9), TS * 2.2, .55); else furo(ex, ey, TS * (R.lanterna ? (R.lanternaBoa ? 5.4 : 4.4) : 1.7) * (1 + Math.sin(tm * 9) * .01), R.lanterna ? 1 : .75);
  const lit = R.lamparinas.filter(v => v).length / 3;
  if (lit) [[.2, .53], [.8, .53]].forEach(([fx, fy]) => furo(PX(CASA.x + CASA.w * fx), PY(CASA.y + CASA.h * fy) + TS * .6, TS * 1.7 * lit, .8));
  furo(PX(CASA.x + CASA.w * .62), PY(CASA.y + CASA.h * .5), TS * 1.1, .8); // lampião da porta
  const ou = R.outro; if (ou && !ou.dentro && (ou.lugar || "sitio") === "sitio") furo(PX(ou.eu.x), PY(ou.eu.y) - TS * .4, TS * raioLuz(ou), ou.lanterna ? 1 : .7);
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
  if (ou && ou.lanterna && !ou.dentro && (ou.lugar || "sitio") === "sitio") brilho(PX(ou.eu.x), PY(ou.eu.y) - TS * .4, TS * 3, "255,200,120", .14 * nt);
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
  c.fillStyle = "#7a5a3e"; c.fillRect(X(0), Y(0), SALA.w * s, .9 * s);
  for (let i = 0; i < 40; i++) { c.fillStyle = i % 2 ? "rgba(255,230,190,.07)" : "rgba(0,0,0,.05)"; c.fillRect(X(i * .25), Y(0), .25 * s, .58 * s); } // listras do papel de parede
  for (let i = 0; i < 20; i++) for (let j = 0; j < 2; j++) { const fx = X(i * .5 + (j ? .25 : 0) + .12), fy = Y(.14 + j * .24); c.fillStyle = "rgba(200,120,90,.35)"; for (let p2 = 0; p2 < 4; p2++) { c.beginPath(); c.arc(fx + Math.cos(p2 * 1.57) * 2.2, fy + Math.sin(p2 * 1.57) * 2.2, 1.6, 0, 7); c.fill(); } c.fillStyle = "rgba(240,210,120,.45)"; c.fillRect(fx - 1, fy - 1, 2, 2); } // florzinhas
  c.fillStyle = "#4a3020"; c.fillRect(X(0), Y(.58), SALA.w * s, .32 * s); for (let i = 0; i < 40; i++) { c.fillStyle = "rgba(0,0,0,.25)"; c.fillRect(X(i * .25), Y(.58), 1.5, .32 * s); } c.fillStyle = "#6a4a2c"; c.fillRect(X(0), Y(.56), SALA.w * s, .05 * s); // lambri
  c.fillStyle = "#2a1a0e"; c.fillRect(X(0), Y(.86), SALA.w * s, .07 * s); // rodapé
  { const so = c.createLinearGradient(0, Y(.93), 0, Y(1.6)); so.addColorStop(0, "rgba(0,0,0,.35)"); so.addColorStop(1, "rgba(0,0,0,0)"); c.fillStyle = so; c.fillRect(X(0), Y(.93), SALA.w * s, .7 * s); } // sombra no pé da parede
  const noite = horaNoite(); [[2.5, .15], [6.3, .15]].forEach(([jx, jy]) => { c.fillStyle = noite > .5 ? "#0a1020" : "#8aa8c0"; c.fillRect(X(jx), Y(jy), .9 * s, .55 * s); c.strokeStyle = "#2a1a0e"; c.lineWidth = 3; c.strokeRect(X(jx), Y(jy), .9 * s, .55 * s); c.beginPath(); c.moveTo(X(jx + .45), Y(jy)); c.lineTo(X(jx + .45), Y(jy + .55)); c.stroke(); c.fillStyle = "rgba(200,60,50,.6)"; c.fillRect(X(jx - .12), Y(jy - .05), .14 * s, .65 * s); c.fillRect(X(jx + .88), Y(jy - .05), .14 * s, .65 * s);
    if (noite > .5 && Math.sin(tm * .45 + jx) > .97) { c.fillStyle = "rgba(240,240,230,.9)"; c.fillRect(X(jx + .3), Y(jy + .25), 3, 3); c.fillRect(X(jx + .5), Y(jy + .25), 3, 3); } }); // olhos na janela
  c.fillStyle = "#c8a860"; c.fillRect(X(5.1), Y(.15), .55 * s, .6 * s); c.fillStyle = "#3a5a8a"; c.fillRect(X(5.17), Y(.22), .41 * s, .46 * s); c.fillStyle = "#e8d8a0"; c.beginPath(); c.arc(X(5.37), Y(.36), .08 * s, 0, 7); c.fill(); c.fillStyle = "rgba(255,230,150,.5)"; c.beginPath(); c.arc(X(5.37), Y(.36), .14 * s, 0, 7); c.fill(); // quadro de santo
  const rx = X(8.4), ry = Y(.45); c.fillStyle = "#6a4a2a"; c.fillRect(rx - .18 * s, ry - .3 * s, .36 * s, .7 * s); c.fillStyle = "#e8e0c8"; c.beginPath(); c.arc(rx, ry - .08 * s, .13 * s, 0, 7); c.fill(); c.strokeStyle = "#1a1a1a"; c.lineWidth = 1.2; c.beginPath(); c.moveTo(rx, ry - .08 * s); c.lineTo(rx + Math.sin(tm * .1) * .1 * s, ry - .08 * s - Math.cos(tm * .1) * .1 * s); c.stroke(); c.strokeStyle = "#c8a030"; c.beginPath(); c.moveTo(rx, ry + .08 * s); c.lineTo(rx + Math.sin(tm * 3) * .08 * s, ry + .3 * s); c.stroke(); // relógio de pêndulo
  // paredes laterais
  c.fillStyle = "#3a2a1a"; c.fillRect(X(-.2), Y(0), .2 * s, SALA.h * s); c.fillRect(X(SALA.w), Y(0), .2 * s, SALA.h * s); c.fillRect(X(-.2), Y(SALA.h), (SALA.porta.x - .6 + .2) * s, .2 * s); c.fillRect(X(SALA.porta.x + .6), Y(SALA.h), (SALA.w - SALA.porta.x - .6 + .2) * s, .2 * s);
  c.fillStyle = "#2a1a0e"; c.fillRect(X(SALA.porta.x - .6), Y(SALA.h - .05), 1.2 * s, .25 * s); c.fillStyle = "rgba(240,230,200,.6)"; c.font = `700 ${Math.round(s * .17)}px "JetBrains Mono", monospace`; c.textAlign = "center"; c.fillText("PORTA", X(SALA.porta.x), Y(SALA.h + .5));
  { const jx = X(JANELA_F.x - .5), jw = s, jy = Y(SALA.h - .12), jh = .36 * s, nt2 = horaNoite(); c.fillStyle = "#2a1a0e"; c.fillRect(jx - 3, jy - 3, jw + 6, jh + 6); c.fillStyle = nt2 > .5 ? "#060a14" : "#7a98b0"; c.fillRect(jx, jy, jw, jh); c.fillStyle = "#2a1a0e"; c.fillRect(jx + jw / 2 - 1.5, jy, 3, jh); c.fillStyle = "#5a2a2a"; c.fillRect(jx - 4, jy - 4, jw * .18, jh + 8); c.fillRect(jx + jw * .82 + 4, jy - 4, jw * .18, jh + 8);
    if (nt2 > .5 && bichosNaPorta() < 6 && Math.sin(tm * 2.3) > .2) { c.fillStyle = "rgba(0,0,0,.9)"; c.beginPath(); c.ellipse(jx + jw * .62, jy + jh * .7, jw * .12, jh * .5, 0, 0, 7); c.fill(); c.fillStyle = "rgba(255,60,40,.9)"; c.fillRect(jx + jw * .58, jy + jh * .55, 2, 2); c.fillRect(jx + jw * .65, jy + jh * .55, 2, 2); } // uma sombra na janela
    c.fillText("JANELA", X(JANELA_F.x), Y(SALA.h + .5)); } c.textAlign = "start";
  // tapete
  { const tx = X(3.3), ty = Y(4.0), tw = 3.4 * s, th = 1.5 * s; c.fillStyle = "rgba(0,0,0,.25)"; c.fillRect(tx + 3, ty + 3, tw, th); const fx = ["#a83a3a", "#e8c860", "#3a6a8a", "#e8e2d0", "#6a8a3a"]; for (let i = 0; i < 10; i++) { c.fillStyle = fx[i % 5]; c.fillRect(tx, ty + i * th / 10, tw, th / 10 + .5); } c.fillStyle = "rgba(0,0,0,.12)"; for (let i = 0; i < 34; i++) c.fillRect(tx + i * tw / 34, ty, 1, th); c.strokeStyle = "#5a2a1a"; c.lineWidth = 3; c.strokeRect(tx, ty, tw, th); c.strokeStyle = "#e8dcc0"; c.lineWidth = 1.5; for (let i = 0; i <= 16; i++) { const fx2 = tx + i * tw / 16; c.beginPath(); c.moveTo(fx2, ty); c.lineTo(fx2, ty - 5); c.moveTo(fx2, ty + th); c.lineTo(fx2, ty + th + 5); c.stroke(); } } // tapete de retalho
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
  c.fillStyle = "rgba(0,0,0,.3)"; c.fillRect(X(4.15), Y(3), 1.8 * s, 1.2 * s); c.fillStyle = "#7a5a32"; c.fillRect(X(4.1), Y(2.9), 1.8 * s, 1.2 * s); c.fillStyle = "#f2ece0"; c.fillRect(X(4.2), Y(2.98), 1.6 * s, 1.04 * s); c.fillStyle = "rgba(200,50,40,.55)"; for (let i = 0; i < 8; i++) { c.fillRect(X(4.2 + i * .2), Y(2.98), .1 * s, 1.04 * s); } for (let j = 0; j < 5; j++) c.fillRect(X(4.2), Y(2.98 + j * .208), 1.6 * s, .1 * s); c.fillStyle = "#f2ece0"; for (let i = 0; i < 8; i++) { c.beginPath(); c.moveTo(X(4.2 + i * .2), Y(4.02)); c.lineTo(X(4.3 + i * .2), Y(4.1)); c.lineTo(X(4.4 + i * .2), Y(4.02)); c.fill(); } // toalha xadrez
  { const fx = X(4.5), fy = Y(3.25); c.fillStyle = "#c8b898"; c.beginPath(); c.ellipse(fx, fy, .22 * s, .1 * s, 0, 0, 7); c.fill(); [["#e8861e", -.08, -.04], ["#e8861e", .07, -.05], ["#c8302a", 0, -.1], ["#e8c84a", .1, -.12]].forEach(([cor, dx, dy]) => { c.fillStyle = cor; c.beginPath(); c.arc(fx + dx * s, fy + dy * s, .07 * s, 0, 7); c.fill(); }); // fruteira
    for (const [cx3, cy3] of [[5.65, 3.75], [4.45, 3.78]]) { c.fillStyle = "#e8e4d8"; c.fillRect(X(cx3 - .07), Y(cy3 - .07), .14 * s, .14 * s); c.fillStyle = "#5a3418"; c.fillRect(X(cx3 - .05), Y(cy3 - .06), .1 * s, .04 * s); c.strokeStyle = "#e8e4d8"; c.lineWidth = 1.5; c.beginPath(); c.arc(X(cx3 + .09), Y(cy3), .04 * s, -1.4, 1.4); c.stroke(); } // canecas de café
    c.fillStyle = "#3a6a8a"; c.fillRect(X(5.6), Y(3.05), .1 * s, .18 * s); c.fillStyle = "#e86a8a"; c.beginPath(); c.arc(X(5.62), Y(3.0), .05 * s, 0, 7); c.arc(X(5.7), Y(2.97), .05 * s, 0, 7); c.fill(); c.fillStyle = "#f2e04a"; c.beginPath(); c.arc(X(5.55), Y(2.96), .04 * s, 0, 7); c.fill(); } // vasinho de flor
  c.fillStyle = "#7a5a32"; c.fillStyle = "#c8c0b0"; c.beginPath(); c.arc(X(5.4), Y(3.5), .15 * s, 0, 7); c.fill(); c.fillStyle = "#8a6a3a"; c.fillRect(X(4.5), Y(3.3), .3 * s, .3 * s);
  // cadeira de balanço que balança sozinha
  const bal = Math.sin(tm * 1.6) * (horaNoite() > .5 ? .25 : .05); c.save(); c.translate(X(.9), Y(5.1)); c.rotate(bal); c.fillStyle = "#6a4a2a"; c.fillRect(-.35 * s, -.35 * s, .7 * s, .7 * s); c.fillStyle = "#4a2e1a"; c.fillRect(-.4 * s, -.45 * s, .8 * s, .14 * s); c.strokeStyle = "#4a2e1a"; c.lineWidth = 3; c.beginPath(); c.arc(0, -.9 * s, 1.2 * s, 1.25, 1.9); c.stroke(); c.restore();
  // caminha do gato e vassoura
  { const cg = corGato(); c.fillStyle = "rgba(0,0,0,.3)"; c.beginPath(); c.ellipse(X(8.25), Y(6.2), .5 * s, .26 * s, 0, 0, 7); c.fill(); c.fillStyle = "#8a3a3a"; c.beginPath(); c.ellipse(X(8.2), Y(6.1), .48 * s, .3 * s, 0, 0, 7); c.fill(); c.fillStyle = "#c85a5a"; c.beginPath(); c.ellipse(X(8.2), Y(6.12), .36 * s, .2 * s, 0, 0, 7); c.fill(); c.strokeStyle = "rgba(255,255,255,.35)"; c.lineWidth = 1; c.setLineDash([3, 3]); c.beginPath(); c.ellipse(X(8.2), Y(6.1), .42 * s, .25 * s, 0, 0, 7); c.stroke(); c.setLineDash([]);
    if (!R.gato || dist(R.gato, CASA.porta) > 3 || !R.dentro) { c.fillStyle = cg[1]; c.beginPath(); c.ellipse(X(8.2), Y(6.05), .27 * s, .15 * s, 0, 0, 7); c.fill(); c.beginPath(); c.arc(X(8.42), Y(5.98), .1 * s, 0, 7); c.fill(); c.fillStyle = cg[3]; c.fillRect(X(8.44), Y(5.96), 2, Math.sin(tm * .8) > .9 ? .5 : 2); } // a Sombrinha dormindo
    c.fillStyle = "#e86a9a"; c.beginPath(); c.arc(X(7.82), Y(6.25), .07 * s, 0, 7); c.fill(); c.strokeStyle = "#f2c94a"; c.lineWidth = 1; c.beginPath(); c.arc(X(7.82), Y(6.25), .07 * s, 0, 3); c.stroke(); // bolinha de lã
    c.fillStyle = `rgba(242,201,74,${.35 + .3 * Math.sin(tm * 3)})`; c.beginPath(); c.arc(X(8.2), Y(5.68), .05 * s, 0, 7); c.fill(); }
  c.strokeStyle = "#a8804a"; c.lineWidth = 3; c.beginPath(); c.moveTo(X(9.7), Y(5.2)); c.lineTo(X(9.4), Y(6.6)); c.stroke(); c.fillStyle = "#d8b860"; c.beginPath(); c.moveTo(X(9.25), Y(6.5)); c.lineTo(X(9.55), Y(6.5)); c.lineTo(X(9.6), Y(6.9)); c.lineTo(X(9.2), Y(6.9)); c.fill();
  // lamparinas (mesa, parede esquerda, parede direita)
  const L = [[X(5), Y(3.2)], [X(.15), Y(4)], [X(9.85), Y(5.6)]];
  R.lamparinas.forEach((v, i) => { const [lx, ly] = L[i]; c.fillStyle = "#3a3a3a"; c.fillRect(lx - 4, ly - 6, 8, 10); c.fillStyle = "#c8a050"; c.fillRect(lx - 5, ly + 3, 10, 2); if (v) { c.fillStyle = "rgba(255,210,120,.95)"; c.beginPath(); c.ellipse(lx + Math.sin(tm * 9 + i) * .6, ly - 9, 3, 5, 0, 0, 7); c.fill(); } else { c.fillStyle = "rgba(200,200,200,.3)"; c.beginPath(); c.arc(lx, ly - 10 - (tm * 8 % 6), 2, 0, 7); c.fill(); } });
  // você
  { // ainda mais detalhes
    // cabeceira, travesseiro, colcha de retalhos e boneca de pano
    c.fillStyle = "#3a2214"; c.fillRect(X(.35), Y(.45), 2.7 * s, .22 * s); for (const bx of [.35, 3.0]) { c.fillRect(X(bx), Y(.3), .1 * s, .5 * s); c.fillStyle = "#c8a050"; c.beginPath(); c.arc(X(bx + .05), Y(.3), .06 * s, 0, 7); c.fill(); c.fillStyle = "#3a2214"; }
    c.fillStyle = "#f2ece0"; c.fillRect(X(.7), Y(.82), .9 * s, .45 * s); c.fillRect(X(1.75), Y(.82), .9 * s, .45 * s); c.fillStyle = "rgba(0,0,0,.08)"; c.fillRect(X(.7), Y(1.18), .9 * s, .09 * s); c.fillRect(X(1.75), Y(1.18), .9 * s, .09 * s);
    const cq = ["#c84a4a", "#e8c860", "#5a8ac8", "#8ac86a", "#e88ab0", "#f2ece0"]; for (let i = 0; i < 8; i++) for (let j = 0; j < 4; j++) { c.fillStyle = cq[(i * 3 + j * 2) % 6]; c.fillRect(X(.5 + i * .3), Y(1.5 + j * .3), .3 * s + .5, .3 * s + .5); } c.strokeStyle = "rgba(255,255,255,.35)"; c.lineWidth = 1; c.setLineDash([3, 3]); for (let i = 1; i < 8; i++) { c.beginPath(); c.moveTo(X(.5 + i * .3), Y(1.5)); c.lineTo(X(.5 + i * .3), Y(2.7)); c.stroke(); } c.setLineDash([]); // colcha
    c.fillStyle = "#e8c8a0"; c.beginPath(); c.arc(X(2.35), Y(1.02), .1 * s, 0, 7); c.fill(); c.fillStyle = "#c84a6a"; c.fillRect(X(2.25), Y(1.1), .2 * s, .2 * s); c.fillStyle = "#3a2216"; c.fillRect(X(2.28), Y(.98), 2, 2); c.fillRect(X(2.38), Y(.98), 2, 2); c.fillStyle = "#6a3a1a"; c.fillRect(X(2.22), Y(.9), .26 * s, .05 * s); // boneca de pano
    // a mala da Yasmin, que ela nem desfez
    c.fillStyle = "rgba(0,0,0,.3)"; c.fillRect(X(3.08), Y(2.12), .5 * s, .4 * s); c.fillStyle = "#3a6a8a"; c.fillRect(X(3.05), Y(2.08), .5 * s, .4 * s); c.fillStyle = "#2a4a6a"; c.fillRect(X(3.05), Y(2.24), .5 * s, .05 * s); c.fillStyle = "#e8c860"; c.fillRect(X(3.27), Y(2.02), .08 * s, .07 * s); c.fillStyle = "#e86a8a"; c.beginPath(); c.arc(X(3.15), Y(2.38), .04 * s, 0, 7); c.fill(); c.fillStyle = "#f2e04a"; c.beginPath(); c.arc(X(3.42), Y(2.16), .035 * s, 0, 7); c.fill(); // com adesivos
    // panelas penduradas e utensílios
    c.fillStyle = "#3a2a1a"; c.fillRect(X(3.5), Y(.08), .65 * s, .04 * s); c.strokeStyle = "#8a6a3a"; c.lineWidth = 2; c.beginPath(); c.moveTo(X(3.6), Y(.12)); c.lineTo(X(3.6), Y(.42)); c.stroke(); c.fillStyle = "#8a6a3a"; c.beginPath(); c.ellipse(X(3.6), Y(.46), .04 * s, .07 * s, 0, 0, 7); c.fill(); c.strokeStyle = "#9a9a9a"; c.beginPath(); c.moveTo(X(3.8), Y(.12)); c.lineTo(X(3.8), Y(.36)); c.stroke(); c.beginPath(); c.arc(X(3.8), Y(.41), .06 * s, 0, PI); c.stroke(); c.fillStyle = "#4a4a4a"; c.beginPath(); c.arc(X(4.02), Y(.32), .12 * s, 0, 7); c.fill(); c.fillStyle = "#5a5a5a"; c.beginPath(); c.arc(X(4.02), Y(.32), .08 * s, 0, 7); c.fill();
    c.fillStyle = "#2a2a2a"; c.beginPath(); c.ellipse(X(4.05), Y(.66), .14 * s, .1 * s, 0, 0, 7); c.fill(); c.fillStyle = "#6a6a6a"; c.fillRect(X(3.92), Y(.56), .26 * s, .04 * s); // panela no fogo
    // desenhos da Yasmin presos na parede
    [[7.55, .16, -.08, "#e8e2d0"], [9.0, .2, .1, "#f2e8a8"]].forEach(([dx, dy, rot, cor], i) => { c.save(); c.translate(X(dx), Y(dy)); c.rotate(rot); c.fillStyle = cor; c.fillRect(0, 0, .42 * s, .32 * s); c.fillStyle = "#c83a2a"; c.fillRect(.18 * s, -.02 * s, .05 * s, .05 * s); c.lineWidth = 1.5;
      if (!i) { c.strokeStyle = "#3a6aca"; c.beginPath(); c.moveTo(.04 * s, .26 * s); c.lineTo(.38 * s, .26 * s); c.stroke(); c.fillStyle = "#e8a020"; c.beginPath(); c.arc(.32 * s, .08 * s, .04 * s, 0, 7); c.fill(); c.strokeStyle = "#c84a6a"; c.beginPath(); c.moveTo(.1 * s, .26 * s); c.lineTo(.12 * s, .14 * s); c.lineTo(.16 * s, .26 * s); c.stroke(); c.beginPath(); c.arc(.12 * s, .11 * s, .03 * s, 0, 7); c.stroke(); c.strokeStyle = "#2a2a30"; c.beginPath(); c.moveTo(.22 * s, .26 * s); c.lineTo(.26 * s, .2 * s); c.lineTo(.3 * s, .26 * s); c.stroke(); } // ela, a vó e a gata
      else { c.strokeStyle = "#2a2a30"; c.beginPath(); c.arc(.21 * s, .18 * s, .08 * s, 0, 7); c.stroke(); c.fillStyle = "#2a2a30"; c.fillRect(.15 * s, .06 * s, .03 * s, .05 * s); c.fillRect(.25 * s, .06 * s, .03 * s, .05 * s); c.fillStyle = "#8ac83a"; c.fillRect(.18 * s, .16 * s, 2, 2); c.fillRect(.23 * s, .16 * s, 2, 2); } c.restore(); });
    // samambaia num vaso perto do armário
    { const vx = X(9.45), vy = Y(2.2); c.fillStyle = "#a8583a"; c.beginPath(); c.moveTo(vx - .17 * s, vy - .18 * s); c.lineTo(vx + .17 * s, vy - .18 * s); c.lineTo(vx + .12 * s, vy); c.lineTo(vx - .12 * s, vy); c.fill(); c.fillStyle = "#8a4a2a"; c.fillRect(vx - .18 * s, vy - .21 * s, .36 * s, .05 * s); for (let i = 0; i < 9; i++) { const a = -PI * .95 + i / 8 * PI * .9 + Math.sin(tm * .8 + i) * .04; c.strokeStyle = i % 2 ? "#4a8a3a" : "#5aa04a"; c.lineWidth = 2.5; c.beginPath(); c.moveTo(vx, vy - .2 * s); c.quadraticCurveTo(vx + Math.cos(a) * .25 * s, vy - .2 * s + Math.sin(a) * .35 * s, vx + Math.cos(a) * .42 * s, vy - .2 * s + Math.sin(a) * .2 * s + .12 * s); c.stroke(); } }
    // cesto de milho e abóbora perto da porta
    { const bx = X(2.1), by = Y(6.35); c.fillStyle = "#a8804a"; c.fillRect(bx - .3 * s, by - .22 * s, .6 * s, .3 * s); c.strokeStyle = "rgba(90,60,30,.6)"; c.lineWidth = 1; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(bx - .3 * s + i * .1 * s, by - .22 * s); c.lineTo(bx - .3 * s + i * .1 * s, by + .08 * s); c.stroke(); } c.fillStyle = "#f2cc4a"; for (let i = 0; i < 3; i++) { c.beginPath(); c.ellipse(bx - .15 * s + i * .14 * s, by - .26 * s, .05 * s, .12 * s, -.3 + i * .3, 0, 7); c.fill(); } c.fillStyle = "#e8861e"; c.beginPath(); c.ellipse(bx + .45 * s, by, .16 * s, .12 * s, 0, 0, 7); c.fill(); c.fillStyle = "#4a7a2a"; c.fillRect(bx + .43 * s, by - .16 * s, .04 * s, .06 * s); }
    // tigelinha da Sombrinha
    c.fillStyle = "#c84a6a"; c.beginPath(); c.ellipse(X(7.55), Y(6.3), .16 * s, .07 * s, 0, 0, 7); c.fill(); c.fillStyle = "#8ab8e0"; c.beginPath(); c.ellipse(X(7.55), Y(6.28), .11 * s, .04 * s, 0, 0, 7); c.fill();
    // ganchos na parede da esquerda com o casaco
    c.fillStyle = "#c8a050"; c.fillRect(X(-.05), Y(3.1), .1 * s, .05 * s); c.fillStyle = "#6a8ab8"; c.fillRect(X(-.02), Y(3.15), .14 * s, .55 * s); c.fillStyle = "#4a6a98"; c.fillRect(X(-.02), Y(3.6), .14 * s, .1 * s);
    // nós e pregos no piso
    for (let i = 0; i < 26; i++) { const nx = X(((i * 2.71) % SALA.w)), ny = Y(1 + ((i * 1.93) % (SALA.h - 1.2))); c.fillStyle = "rgba(40,24,12,.4)"; c.beginPath(); c.ellipse(nx, ny, .06 * s, .03 * s, 0, 0, 7); c.fill(); c.fillStyle = "rgba(160,160,150,.4)"; c.fillRect(nx + .3 * s, ny - .1 * s, 1.5, 1.5); }
    // luz do dia entrando pelas janelas, com poeirinha
    if (horaNoite() < .4) [[2.5], [6.3]].forEach(([jx]) => { c.fillStyle = "rgba(255,240,200,.1)"; c.beginPath(); c.moveTo(X(jx), Y(.9)); c.lineTo(X(jx + .9), Y(.9)); c.lineTo(X(jx + 1.6), Y(2.6)); c.lineTo(X(jx + .5), Y(2.6)); c.fill(); for (let i = 0; i < 6; i++) { c.fillStyle = "rgba(255,250,220,.5)"; c.fillRect(X(jx + .3 + ((i * .37 + tm * .03) % .9)), Y(1.1 + ((i * .53 + tm * .05) % 1.3)), 1.5, 1.5); } });
  }
  { // detalhes da casa da vó
    teias(X, Y, s, SALA.w); retrato(X, Y, s, 2.1, .5, "#c8c8c8", tm, R.sala.x); calendario(X, Y, s, 5.75); cruzParede(X, Y, s, 3.45, .2); vaso(X, Y, s, 9.4, 6.6, tm, true); ratinho(X, Y, s, SALA.w, SALA.h, tm, .5);
    c.fillStyle = "#b8784a"; c.fillRect(X(3.1), Y(1.25), .35 * s, .45 * s); c.fillStyle = "#9a5a32"; c.beginPath(); c.ellipse(X(3.27), Y(1.25), .19 * s, .08 * s, 0, 0, 7); c.fill(); c.fillStyle = "#5a3a22"; c.fillRect(X(3.05), Y(1.7), .45 * s, .08 * s); // filtro de barro
    c.fillStyle = "#c8a070"; c.beginPath(); c.ellipse(X(3.25), Y(2.95), .11 * s, .05 * s, 0, 0, 7); c.ellipse(X(3.5), Y(3.0), .11 * s, .05 * s, 0, 0, 7); c.fill(); // os chinelos da vó
    c.fillStyle = "#5a4a3a"; c.fillRect(X(8.85), Y(2.12), .55 * s, .3 * s); c.fillStyle = "#c8a050"; c.beginPath(); c.arc(X(9.0), Y(2.27), .07 * s, 0, 7); c.fill(); c.fillStyle = "#2a2a2a"; for (let i = 0; i < 3; i++) c.fillRect(X(9.12 + i * .08), Y(2.18), 2, .18 * s); // rádio velho
    c.fillStyle = "#e8e2c8"; for (let i = 0; i < 5; i++) { c.beginPath(); c.arc(X(.08), Y(SALA.h - 1.5 + i * .18), .07 * s, 0, 7); c.fill(); } c.strokeStyle = "#5a7a2a"; c.lineWidth = 2; c.beginPath(); c.moveTo(X(.08), Y(SALA.h - 1.65)); c.lineTo(X(.08), Y(SALA.h - .7)); c.stroke(); // réstia de alho e arruda na porta
    [[2.5, .15], [6.3, .15]].forEach(([jx], i) => { const bal = horaNoite() > .5 ? Math.sin(tm * 1.3 + i) * 2 : 0; c.fillStyle = "#7a2a2a"; c.fillRect(X(jx - .12), Y(.1), .14 * s, .7 * s + bal); c.fillRect(X(jx + .88), Y(.1), .14 * s, .7 * s - bal); }); // cortinas
    if (horaNoite() > .6) for (let i = 0; i < 6; i++) { c.fillStyle = "rgba(20,30,40,.35)"; c.beginPath(); c.ellipse(X(SALA.porta.x - .2 + (i % 2) * .35), Y(SALA.h - .5 - i * .62), .1 * s, .17 * s, 0, 0, 7); c.fill(); } // pegadas molhadas da porta até a cama
  }
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
  if (R.pisadeira) desenharPisadeira(R.pisadeira, X, Y, s * 2, tm);
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
  const dentes = (y0, larg, n, alt, cima) => { const d = cima ? 1 : -1;
    c.fillStyle = "#5a0a0a"; c.fillRect(-larg / 2, y0 - d * alt * .12, larg, d * alt * .22); // gengiva
    for (let i = 0; i < n; i++) { const tx = -larg / 2 + (i + .5) * larg / n, w2 = larg / n * (.38 + ((i * 5) % 3) * .05), al = alt * (.6 + .4 * (((i * 7) % 5) / 4)) * (i % 4 === 2 ? .45 : 1);
      const gt = c.createLinearGradient(0, y0, 0, y0 + d * al); gt.addColorStop(0, "#c8b878"); gt.addColorStop(.5, "#e8dcb0"); gt.addColorStop(1, i % 3 ? "#f2ead0" : "#8a7a40"); c.fillStyle = gt;
      c.beginPath(); c.moveTo(tx - w2, y0); c.quadraticCurveTo(tx - w2 * .6, y0 + d * al * .7, tx + (i % 2 ? 1 : -1) * w2 * .2, y0 + d * al); c.quadraticCurveTo(tx + w2 * .6, y0 + d * al * .7, tx + w2, y0); c.fill();
      c.strokeStyle = "rgba(60,30,10,.55)"; c.lineWidth = Math.max(1, larg / n * .05); c.stroke();
      if (i % 3 === 1) { c.fillStyle = "rgba(120,0,0,.75)"; c.beginPath(); c.ellipse(tx, y0 + d * al * .55, w2 * .25, al * .3, 0, 0, 7); c.fill(); } } }; // dentes podres e sujos de sangue
  const olhos = (ex, ey, rr, rgb) => { for (const sx2 of [-1, 1]) { const x0 = sx2 * ex, tremeO = Math.sin(tm * 31 + sx2) * rr * .06;
      c.fillStyle = "rgba(0,0,0,.85)"; c.beginPath(); c.ellipse(x0, ey, rr * 1.7, rr * 1.9, 0, 0, 7); c.fill(); // olheira funda
      const gs = c.createRadialGradient(x0, ey, 0, x0, ey, rr * 1.15); gs.addColorStop(0, "#f2e8c8"); gs.addColorStop(.7, "#d8c890"); gs.addColorStop(1, "#8a2a1a"); c.fillStyle = gs; c.beginPath(); c.ellipse(x0, ey, rr * 1.15, rr * 1.05, 0, 0, 7); c.fill();
      c.strokeStyle = "rgba(170,20,20,.75)"; c.lineWidth = Math.max(1, rr * .05); for (let v = 0; v < 9; v++) { const a = v / 9 * PI * 2; c.beginPath(); c.moveTo(x0 + Math.cos(a) * rr * 1.1, ey + Math.sin(a) * rr); c.quadraticCurveTo(x0 + Math.cos(a + .3) * rr * .8, ey + Math.sin(a - .2) * rr * .7, x0 + Math.cos(a) * rr * .45, ey + Math.sin(a) * rr * .42); c.stroke(); } // veias
      c.fillStyle = `rgb(${rgb})`; c.beginPath(); c.arc(x0 + tremeO, ey, rr * .5, 0, 7); c.fill(); c.fillStyle = "#050000"; c.beginPath(); c.arc(x0 + tremeO, ey, rr * .12, 0, 7); c.fill(); // pupila pequenininha
      c.fillStyle = "rgba(255,255,255,.8)"; c.beginPath(); c.arc(x0 + tremeO - rr * .15, ey - rr * .18, rr * .09, 0, 7); c.fill(); } };
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
  } else if (quem === "cuca") { // jacaré velho de boca aberta
    for (let i = 0; i < 26; i++) { c.strokeStyle = i % 2 ? "#b8b0a0" : "#8a8478"; c.lineWidth = r * .02; c.beginPath(); c.moveTo(-r * .5 + i * r * .04, -r * .55); c.quadraticCurveTo(-r * .9 + i * r * .07, r * .1, -r * .95 + i * r * .075 + Math.sin(tm * 2 + i) * r * .03, r * .9); c.stroke(); }
    const pg = c.createLinearGradient(0, -r * .7, 0, r * .9); pg.addColorStop(0, "#5a6a32"); pg.addColorStop(1, "#2a3416"); c.fillStyle = pg; c.beginPath(); c.moveTo(-r * .55, -r * .2); c.lineTo(-r * .4, -r * .65); c.lineTo(r * .4, -r * .65); c.lineTo(r * .55, -r * .2); c.lineTo(r * .5, r * .2); c.lineTo(-r * .5, r * .2); c.fill();
    c.fillStyle = "#2a3416"; for (let i = 0; i < 8; i++) { c.beginPath(); c.moveTo(-r * .38 + i * r * .11, -r * .62); c.lineTo(-r * .33 + i * r * .11, -r * .8); c.lineTo(-r * .28 + i * r * .11, -r * .62); c.fill(); } // escamas em ponta
    for (const l of [-1, 1]) { c.fillStyle = "#e8c820"; c.beginPath(); c.ellipse(l * r * .26, -r * .35, r * .14, r * .1, 0, 0, 7); c.fill(); c.fillStyle = "#050200"; c.fillRect(l * r * .26 - r * .02, -r * .44, r * .04, r * .18); }
    c.fillStyle = "#120404"; c.beginPath(); c.moveTo(-r * .48, r * .15); c.lineTo(r * .48, r * .15); c.lineTo(r * .4, r * .35 + r * .3 * ab); c.lineTo(-r * .4, r * .35 + r * .3 * ab); c.fill(); dentes(r * .17, r * .9, 13, r * .14, true); dentes(r * .33 + r * .3 * ab, r * .8, 12, r * .12, false);
    c.fillStyle = "#3a4a1e"; c.beginPath(); c.moveTo(-r * .45, r * .36 + r * .3 * ab); c.lineTo(r * .45, r * .36 + r * .3 * ab); c.lineTo(r * .35, r * .55 + r * .3 * ab); c.lineTo(-r * .35, r * .55 + r * .3 * ab); c.fill();
  } else if (quem === "tinhoso") { // caveira de bode, chifres, olho de brasa
    for (const l of [-1, 1]) { c.strokeStyle = "#140c0a"; c.lineWidth = r * .16; c.lineCap = "round"; c.beginPath(); c.moveTo(l * r * .3, -r * .45); c.bezierCurveTo(l * r * 1.1, -r * .9, l * r * 1.15, -r * 1.6, l * r * .45, -r * 1.75); c.stroke(); c.strokeStyle = "rgba(255,255,255,.12)"; c.lineWidth = r * .03; for (let k = 0; k < 6; k++) { c.beginPath(); c.arc(l * r * (.55 + k * .08), -r * (.65 + k * .17), r * .1, 0, PI); c.stroke(); } }
    const gc = c.createRadialGradient(0, -r * .2, r * .1, 0, 0, r * .8); gc.addColorStop(0, "#e0d4b8"); gc.addColorStop(1, "#8a7a5a"); c.fillStyle = gc; c.beginPath(); c.moveTo(-r * .5, -r * .5); c.quadraticCurveTo(-r * .65, r * .2, -r * .22, r * .85); c.lineTo(r * .22, r * .85); c.quadraticCurveTo(r * .65, r * .2, r * .5, -r * .5); c.quadraticCurveTo(0, -r * .8, -r * .5, -r * .5); c.fill();
    c.strokeStyle = "rgba(40,20,10,.55)"; c.lineWidth = r * .015; for (let k = 0; k < 7; k++) { c.beginPath(); c.moveTo((k - 3) * r * .12, -r * .55); c.lineTo((k - 3) * r * .09 + r * .03, -r * .2); c.stroke(); } // rachaduras
    c.fillStyle = "#050000"; c.beginPath(); c.ellipse(-r * .22, -r * .1, r * .17, r * .14, -.2, 0, 7); c.ellipse(r * .22, -r * .1, r * .17, r * .14, .2, 0, 7); c.fill();
    const br = c.createRadialGradient(0, 0, 0, 0, 0, r * .1); br.addColorStop(0, "#fff0a0"); br.addColorStop(.4, "#ff3a0a"); br.addColorStop(1, "rgba(120,0,0,0)"); for (const l of [-1, 1]) { c.save(); c.translate(l * r * .22, -r * .1); c.fillStyle = br; c.beginPath(); c.arc(0, 0, r * .1, 0, 7); c.fill(); c.restore(); }
    c.fillStyle = "#1a0a06"; c.beginPath(); c.moveTo(-r * .06, r * .2); c.lineTo(r * .06, r * .2); c.lineTo(0, r * .36); c.fill();
    c.fillStyle = "#120404"; c.beginPath(); c.ellipse(0, r * .62, r * .26, r * .1 + r * .12 * ab, 0, 0, 7); c.fill(); dentes(r * .62 - (r * .1 + r * .12 * ab) * .8, r * .48, 9, r * .12, true); dentes(r * .62 + (r * .1 + r * .12 * ab) * .8, r * .44, 8, r * .1, false);
  } else if (quem === "curupira") { // cabelo de fogo, pele verde, presas
    for (let i = 0; i < 22; i++) { const a = -PI + i / 21 * PI, fl = 1 + .25 * Math.sin(tm * 20 + i * 1.7); c.fillStyle = i % 3 === 0 ? "#ffb02a" : i % 2 ? "#ff5a1e" : "#c8180e"; c.beginPath(); c.moveTo(Math.cos(a) * r * .5, Math.sin(a) * r * .55 - r * .1); c.quadraticCurveTo(Math.cos(a) * r * 1.1 * fl, Math.sin(a) * r * 1.15 * fl - r * .2, Math.cos(a + .14) * r * .58, Math.sin(a + .14) * r * .6 - r * .1); c.fill(); }
    c.fillStyle = "#3a5a24"; c.beginPath(); c.ellipse(0, r * .05, r * .55, r * .7, 0, 0, 7); c.fill(); c.fillStyle = "rgba(10,30,5,.4)"; c.beginPath(); c.ellipse(-r * .28, r * .18, r * .14, r * .26, 0, 0, 7); c.ellipse(r * .28, r * .18, r * .14, r * .26, 0, 0, 7); c.fill();
    olhos(r * .23, -r * .12, r * .1, "255,200,30");
    c.fillStyle = "#1a0606"; c.beginPath(); c.ellipse(0, r * .42, r * .34, r * .2 + r * .14 * ab, 0, 0, 7); c.fill(); dentes(r * .42 - (r * .2 + r * .14 * ab) * .8, r * .55, 8, r * .12, true);
    c.fillStyle = "#efe4c0"; for (const sx of [-1, 1]) { c.beginPath(); c.moveTo(sx * r * .24, r * .34); c.lineTo(sx * r * .3, r * .02); c.lineTo(sx * r * .16, r * .34); c.fill(); } // presas
  } else { // rosto no fundo do poço
    c.fillStyle = "#9aa4a8"; c.beginPath(); c.ellipse(0, 0, r * .55, r * .75, 0, 0, 7); c.fill(); olhos(r * .22, -r * .15, r * .08, "10,14,18"); c.fillStyle = "#1a2024"; c.beginPath(); c.ellipse(0, r * .35, r * .14, r * .22 * ab, 0, 0, 7); c.fill();
    c.strokeStyle = "rgba(20,30,30,.8)"; c.lineWidth = 2; for (let i = 0; i < 14; i++) { c.beginPath(); c.moveTo(-r * .5 + i * r * .08, -r * .7); c.lineTo(-r * .55 + i * r * .085, r * .2); c.stroke(); }
  }
}
function desenharSusto(tm) {
  const cai = !R.morto && R.caido && R.caido.t < 2.4 ? R.caido : null;
  const quem = R.morto ? R.morto.quem : cai ? cai.quem : R.rostoPoco ? "poco" : null; if (!quem) return;
  const t = R.morto ? R.morto.t : cai ? cai.t : 1.1 - R.susto;
  const k = R.morto ? Math.min(1, R.morto.t / .12) : cai ? cl(Math.min(cai.t / .12, (2.4 - cai.t) / .5), 0, 1) : cl(R.susto / 1.1, 0, 1); if (k <= 0) { R.rostoPoco = 0; return; }
  if (t < .07) { c.fillStyle = "#f4f0e8"; c.fillRect(0, 0, W, H); return; } // clarão
  c.fillStyle = `rgba(0,0,0,${.92 * k})`; c.fillRect(0, 0, W, H);
  const avanca = t < .18 ? .55 + (t / .18) * .85 : 1.4 - Math.min(.3, (t - .18) * 1.6), forca = t < 1.2 ? 24 * (1 - t / 1.2) + 3 : 3, tr = rnd(-forca, forca);
  const r = Math.min(W, H) * .5 * avanca, x = W / 2 + tr, y = H / 2 + rnd(-forca, forca) * .7 + r * .05;
  c.save(); c.globalAlpha = k; c.translate(x, y); c.rotate(rnd(-.03, .03) * forca / 10); const ab = .55 + .45 * Math.abs(Math.sin(tm * 22));
  rostoMonstro(quem, r, ab, tm);
  // pele: manchas, rachaduras e veias por cima do rosto
  c.globalCompositeOperation = "source-atop";
  c.restore(); c.save(); c.globalAlpha = k * .55; c.translate(x, y);
  let sd = 9; const rr2 = () => { sd = (sd * 16807) % 2147483647; return (sd - 1) / 2147483646; };
  for (let i = 0; i < 22; i++) { c.fillStyle = i % 2 ? "rgba(40,20,10,.5)" : "rgba(90,30,20,.35)"; c.beginPath(); c.ellipse((rr2() - .5) * r * 1.6, (rr2() - .6) * r * 1.6, r * (.03 + rr2() * .08), r * (.02 + rr2() * .06), rr2() * 3, 0, 7); c.fill(); }
  c.strokeStyle = "rgba(20,8,4,.55)"; c.lineWidth = Math.max(1, r * .006); for (let i = 0; i < 14; i++) { let px = (rr2() - .5) * r * 1.4, py = (rr2() - .7) * r * 1.2; c.beginPath(); c.moveTo(px, py); for (let j2 = 0; j2 < 5; j2++) { px += (rr2() - .5) * r * .15; py += (rr2() - .3) * r * .1; c.lineTo(px, py); } c.stroke(); } // rugas e rachaduras
  c.restore();
  // sangue escorrendo do alto da tela
  c.fillStyle = `rgba(120,0,0,${.85 * k})`; for (let i = 0; i < 14; i++) { const bx = (i * 137) % W, comp = Math.min(H * (.15 + ((i * 53) % 40) / 100), t * H * (.4 + (i % 3) * .2)); c.fillRect(bx, 0, 6 + (i % 4) * 3, comp); c.beginPath(); c.arc(bx + 4 + (i % 4) * 1.5, comp, 5 + (i % 4) * 1.5, 0, 7); c.fill(); }
  // grão de filme e linhas piscando
  for (let i = 0; i < 260; i++) { c.fillStyle = `rgba(${Math.random() < .5 ? "255,255,255" : "0,0,0"},${Math.random() * .25})`; c.fillRect(Math.random() * W, Math.random() * H, 2, 2); }
  if (Math.random() < .35) { c.fillStyle = "rgba(255,255,255,.06)"; for (let yy = (tm * 400) % 6; yy < H; yy += 6) c.fillRect(0, yy, W, 1); }
  if (Math.random() < .12) { c.fillStyle = "rgba(200,0,0,.25)"; c.fillRect(0, 0, W, H); }
  const vg = c.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .2, W / 2, H / 2, Math.max(W, H) * .7); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, `rgba(60,0,0,${.75 * k})`); c.fillStyle = vg; c.fillRect(0, 0, W, H);
  if (R.morto) { c.fillStyle = `rgba(226,40,30,${.3 * Math.max(0, 1 - R.morto.t)})`; c.fillRect(0, 0, W, H); }
}
function desenharFx() {
  R.fx.forEach(f => { if (f.x != null && ((f.lugar || "sitio") !== (R.lugar || "sitio") || R.predio)) return; const a = 1 - f.t / 1.8, x = f.x == null ? W / 2 : PX(f.x), y = (f.y == null ? H * .3 : PY(f.y) - TS * 1.3) - f.t * 30; c.globalAlpha = Math.max(0, a); c.fillStyle = f.cor; c.font = `800 ${Math.round(Math.max(14, TS * .34))}px "Big Shoulders Display", sans-serif`; c.textAlign = "center"; c.strokeStyle = "rgba(0,0,0,.7)"; c.lineWidth = 3; c.strokeText(f.txt, x, y); c.fillText(f.txt, x, y); c.textAlign = "start"; c.globalAlpha = 1; });
  R.fxR && R.fxR.forEach(f => { if (f.x != null && ((f.lugar || "sitio") !== (R.lugar || "sitio") || R.predio)) return; const a = 1 - f.t / 1.8, x = f.x == null ? W / 2 : PX(f.x), y = (f.y == null ? H * .3 : PY(f.y) - TS * 1.3) - f.t * 30; if (R.dentro && f.x != null) return; c.globalAlpha = Math.max(0, a); c.fillStyle = f.cor; c.font = `800 ${Math.round(Math.max(14, TS * .34))}px "Big Shoulders Display", sans-serif`; c.textAlign = "center"; c.strokeStyle = "rgba(0,0,0,.7)"; c.lineWidth = 3; c.strokeText(f.txt, x, y); c.fillText(f.txt, x, y); c.textAlign = "start"; c.globalAlpha = 1; });
  const a = R.aranha, m = R.mula;
  el.rcDica.textContent = R.lugar === "esgoto" ? (R.tin && R.tin.fase === "caca" ? "ELE TE VIU! Corre pro esconderijo mais perto!" : "Ele é mais rápido que você. Se ouvir casco, se esconda.") : R.lugar === "mata" && !R.caido ? (ehNoite() && !R.predio ? "Tem alguém assobiando na trilha. Corre pra casinha ou volta pro sítio." : "") : R.lugar === "vila" && !R.caido ? (ehNoite() && !luzesVila() ? "A vila apagou. Todo mundo dorme... menos você." : "") : R.caido ? (R.caido.fora ? "Você não tem mais vidas. Agora é com a sua amiga." : "Você caiu. Só a sua amiga pode te levantar!") : a.fase === "ataque" ? "Ela te viu! Corra para dentro de casa!" : (a.fase === "aviso" || a.fase === "anda") && !R.dentro ? (noMilharal(R.eu) ? "No milharal ela não te enxerga. Fique quieta." : "Juntas estalando... apague a lanterna e fique parada!")
    : m.fase === "aviso" && !R.dentro ? "O chão está brilhando! Saia da linha!" : R.dentro ? "" : R.seco.fase === "anda" || R.seco.fase === "aviso" ? "A mata estalou. Corra para dentro de casa!" : R.cachorro && R.cachorro.fase === "lobo" ? "Corra para casa!"
    : R.esp.fase === "vivo" && !R.esp.parado ? "O espantalho está andando. Ilumine ele!" : R.saci.fase === "anda" ? (R.peneira ? "Redemoinho! Pegue o Saci com a peneira!" : "Redemoinho! Fuja dele: o Saci rouba moedas") : R.vela && !velaNaMao() ? "Siga o som do sino e ache a vela" : velaNaMao() ? "Leve a vela até a cruz do cemitério" : "";
  if ((a.fase === "anda" || a.fase === "ataque") && !R.dentro && (R.lugar || "sitio") === "sitio") { // olho que mostra o quanto ela já te notou
    const w = Math.min(180, W * .24), x = W / 2 - w / 2, y = 36, v = a.fase === "ataque" ? 1 : a.alerta; c.fillStyle = "rgba(0,0,0,.5)"; c.fillRect(x, y, w, 7); c.fillStyle = v > .7 ? "#e2483d" : v > .35 ? "#f2a33a" : "#e8e2d4"; c.fillRect(x, y, w * v, 7);
    c.strokeStyle = "rgba(255,255,255,.5)"; c.lineWidth = 1.5; c.beginPath(); c.ellipse(x - 14, y + 3.5, 9, 5, 0, 0, 7); c.stroke(); c.fillStyle = c.strokeStyle; c.beginPath(); c.arc(x - 14, y + 3.5, 2.4, 0, 7); c.fill(); }
  if (!R.dentro && !R.predio) { if (CHAT.meu) balaoChat(R.eu, CHAT.meu); if (CHAT.dele && R.outro && !R.outro.dentro && !R.outro.predio && R.outro.lugar === R.lugar) balaoChat(R.outro.eu, CHAT.dele); }
  if (R.caido) { c.fillStyle = `rgba(120,10,10,${.25 + .1 * Math.sin(performance.now() / 300)})`; c.fillRect(0, 0, W, H); }
}
function desenharVitoria(tm) { if (!R.venceu) return; const k = R.venceu.t; if (k < 1) return; c.fillStyle = `rgba(0,0,0,${cl((k - 3) / 1.4, 0, 1)})`; c.fillRect(0, 0, W, H); }
function loop(ts) {
  if (!rodando || !R) return;
  requestAnimationFrame(loop); // agenda antes: um erro de desenho não congela o jogo
  lerControle(); const fps = window.fpsAlvo ? fpsAlvo() : 30; if (ultimo && ts - ultimo < 1000 / fps - 4) return; // 30 quadros por segundo bastam: o celular esquenta bem menos
  const t0 = performance.now(); window.rocaPerfN = (window.rocaPerfN || 0) + 1;
  const dt = Math.min(.07, (ts - ultimo) / 1000 || 0); ultimo = ts;
  if (R.online === "guest") atualizarConvidado(dt); else atualizar(dt);
  if (R.online === "host" && R.outro) { Net.envT -= dt; if (Net.envT <= 0) { Net.envT = .1; enviar(estadoPara()); } }
  const tm = ts / 1000;
  c.setTransform(DPRr, 0, 0, DPRr, 0, 0);
  if (R.lugar === "esgoto") desenharEsgoto(tm);
  else if (R.lugar === "mata") { if (R.predio === "porao") desenharPorao(tm); else if (R.predio) { if (R.espiar) desenharEspiar(tm); else desenharCabanaDentro(tm); } else desenharMata(tm); }
  else if (R.lugar === "vila") { if (R.predio) desenharPredio(tm); else { desenharVila(tm); desenharLuzVila(tm); desenharVagalumesENevoa(tm); } }
  else if (R.dentro) { if (R.espiar) desenharEspiar(tm); else desenharDentro(tm); } else { if (R.venceu && R.venceu.t > 1) { CAMINHONETE.x += .0; } desenharMundo(tm); desenharLuz(tm); }
  if (R.fade > 0) { c.fillStyle = `rgba(0,0,0,${Math.min(1, R.fade)})`; c.fillRect(0, 0, W, H); R.fade -= .05; }
  if (R.venceu && R.venceu.t > 1 && !R.dentro && (R.lugar || "sitio") === "sitio") { const x = PX(CAMINHONETE.x), y = PY(CAMINHONETE.y + .9 + Math.max(0, R.venceu.t - 1.5) * 2.2); c.globalCompositeOperation = "lighter"; c.fillStyle = "rgba(255,240,200,.18)"; c.beginPath(); c.moveTo(x - TS * .8, y); c.lineTo(x - TS * 2, y + TS * 6); c.lineTo(x + TS * 2, y + TS * 6); c.lineTo(x + TS * .8, y); c.fill(); c.globalCompositeOperation = "source-over"; }
  desenharFx(); desenharSusto(tm); desenharVitoria(tm);
  // vinheta
  if (!VINHETA) { VINHETA = c.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .35, W / 2, H / 2, Math.max(W, H) * .75); VINHETA.addColorStop(0, "rgba(0,0,0,0)"); VINHETA.addColorStop(1, "rgba(0,0,0,.55)"); } c.fillStyle = VINHETA; c.fillRect(0, 0, W, H);
  { const dtq = performance.now() - t0; window.rocaMs = (window.rocaMs || 0) * .95 + dtq * .05; if (window.rocaTempos) { rocaTempos.push(dtq); if (rocaTempos.length > 400) rocaTempos.shift(); } }
}

/* =====================================================================
   VILA SOSSEGO: a cidadezinha no fim da estrada. Os bichos não vêm aqui.
   De dia tem loja e conversa; de noite tudo apaga e cada um dorme no
   quarto de cima da própria casa.
   ===================================================================== */
const VW = 60, VH = 61, OY = 16, ROOM = { w: 9, h: 6 };
const VPREDIOS = [
  { id: "armazem", nome: "Armazém do Joaquim", placa: "ARMAZÉM", x: 3, y: 7, w: 6, h: 4.4, cor: "#7a5a3a", cor2: "#c8b89a", tel: "#5a2a1a", npc: "joaquim", vit: ["#c8a050", "#8a5a2a", "#e8d8a0"] },
  { id: "padaria", nome: "Padaria da Lurdes", placa: "PADARIA", x: 11, y: 7, w: 6, h: 4.4, cor: "#a8704a", cor2: "#e8d0b0", tel: "#6a3020", npc: "lurdes", vit: ["#d8a050", "#c88a3a", "#f2e0b0"], chamine: 1 },
  { id: "costura", nome: "Costuras da Zuleica", placa: "COSTURA", x: 27, y: 7, w: 6, h: 4.4, cor: "#6a5a7a", cor2: "#d8c8d0", tel: "#3a2a3a", npc: "zuleica", vit: ["#a02a2a", "#2a3a6a", "#e8e2d8"] },
  { id: "ferreiro", nome: "Ferraria do Bento", placa: "FERRARIA", x: 35, y: 7, w: 6, h: 4.4, cor: "#4a4440", cor2: "#a89a88", tel: "#2a2220", npc: "bento", vit: ["#6a6a6a", "#8a8a8a", "#4a4a4a"], chamine: 1 },
  { id: "botica", nome: "Botica da Dona Cida", placa: "BOTICA", x: 3, y: 15.4, w: 6, h: 4.4, cor: "#4a6a4a", cor2: "#c8d0b0", tel: "#2a3a22", npc: "cida", vit: ["#5a8a3a", "#8a3a6a", "#c8c860"] },
  { id: "barbearia", nome: "Barbearia do Zé", placa: "BARBEARIA", x: 11, y: 15.4, w: 6, h: 4.4, cor: "#8a3a3a", cor2: "#e8e2d8", tel: "#4a1a1a", npc: "ze", vit: ["#e8e2d8", "#a02a2a", "#3a5a8a"] },
  { id: "delegacia", nome: "Delegacia", placa: "DELEGACIA", x: 29, y: 15.4, w: 6, h: 4.4, cor: "#5a5a4a", cor2: "#c8c0a8", tel: "#2a2a22", npc: "ramos", vit: ["#3a3a3a", "#6a6a5a", "#2a2a2a"] },
  { id: "coveiro", nome: "Casa do coveiro", placa: "", x: 36, y: 15.4, w: 6, h: 4.4, cor: "#3a3228", cor2: "#8a8070", tel: "#1e1a14", npc: "damiao", vit: ["#2a2a2a", "#3a3a3a", "#1a1a1a"] },
  { id: "igreja", nome: "Igreja de Santa Luzia", placa: "", x: 18, y: 24.4, w: 10, h: 5.2, cor: "#c8c0b0", cor2: "#e8e2d8", tel: "#4a2a1e", npc: "anselmo", igreja: 1 }];
const PORTA = p => ({ x: p.x + p.w / 2, y: p.y + p.h + .25 });
const VPOSTES = [[5.6, 12], [12.4, 12], [19.8, 12], [26.2, 12], [33, 12], [40.4, 12], [6, 20.2], [13.4, 20.2], [19.6, 20.2], [26.4, 20.2], [32.6, 20.2], [39.8, 20.2], [21, 31.4], [25, 31.4]];
const VBANCOS = [[19.4, 16.4], [26.6, 16.4], [19.4, 18.6], [26.6, 18.6]], VFONTE = { x: 23, y: 17.6 };
const VCEM = { x0: 31.5, y0: 24, x1: 43, y1: 31.5 };
// moradores: casa = onde dorme; rota = por onde anda de dia (quem não fica no balcão)
const NPCS = [
  { id: "joaquim", nome: "Seu Joaquim", casa: "armazem", loja: 1, look: { pele: "#d8a888", roupa: "#3a6a3a", cabelo: "#c8c8c8", bigode: 1, velho: 1, avental: "#e8e2d0" },
    conversas: [["Ah... a neta da Benedita. Tem os olhos dela. Pena.", "Compro o que você colher pagando melhor que o caixote do sítio. Dinheiro aqui é o que não falta. Gente é que falta."],
      ["Sua vó esteve aqui na semana que sumiu. Levou dez litros de óleo e um saco de sal grosso.", "Eu perguntei se ia ter festa. Ela disse: \"É pra segurar a porta até a menina chegar.\"", "Eu nunca soube de menina nenhuma. Até hoje."]],
    pista: [1, "oleo", "Seu Joaquim: a vó comprou óleo e sal grosso \"para segurar a porta até a menina chegar\". Ela sabia que eu vinha."],
    extra: ["Não ande na estrada depois que o sol baixar. De dia ela é curta. De noite ela fica comprida.", "Fecho às cinco. Sempre fechei. Quem abre de noite não abre mais nada."],
    sono: ["...não fui eu que vendi a corda... não fui eu...", "...dez litros... ela pediu dez litros..."] },
  { id: "lurdes", nome: "Dona Lurdes", casa: "padaria", loja: 1, look: { pele: "#c8946a", roupa: "#e8e2d8", cabelo: "#3a2216", coque: 1, avental: "#f2f0e8" },
    conversas: [["Broa quentinha, menina? Dá fôlego pra correr. Lá no sítio você vai precisar.", "Não repara no Tião. Ele fala coisa que não devia."], "carta"],
    pista: [1, "carta", "Dona Lurdes guardava uma carta da vó: \"Não procure seu pai na mata. O que voltar com a cara dele não é ele. Conserte a caminhonete e vá. Não olhe para trás na porteira.\""],
    extra: ["Pão de ontem eu jogo pro mato. Amanhece sempre comido.", "Reze antes de dormir. Não por você. Por quem está do lado de fora."],
    sono: ["...Tião... sai da janela... não acena pra ele...", "(Ela dorme de olhos abertos.)"] },
  { id: "zuleica", nome: "Dona Zuleica", casa: "costura", loja: 1, look: { pele: "#e8c0a0", roupa: "#6a3a5a", cabelo: "#8a8a8a", oculos: 1, magra: 1 },
    conversas: [["Roupa nova muda tudo. Até o jeito que as coisas te enxergam no escuro.", "Escolhe uma. Faço no seu tamanho. Eu sei o seu tamanho."],
      ["Sua avó encomendou uma roupa comigo antes de sumir. Preta. Toda fechada.", "Uma mortalha, menina. No tamanho dela mesma.", "Ela provou, disse que serviu e falou: \"Não vou precisar de caixão. A mata não devolve.\""]],
    pista: [1, "mortalha", "Dona Zuleica: a vó mandou fazer a própria mortalha. Disse que \"a mata não devolve\"."],
    extra: ["Tem gente nessa vila que eu costuro do batizado ao enterro. Gente demais.", "Não pegue linha preta do chão. Não é linha."],
    sono: ["...a manga ficou curta... os braços dele cresceram...", "...medida errada... de novo..."] },
  { id: "bento", nome: "Seu Bento", casa: "ferreiro", loja: 1, look: { pele: "#a8744a", roupa: "#4a3a2a", cabelo: "#2a1a10", barba: 1, grande: 1, avental: "#6a4a2a" },
    conversas: [["Ferro frio espanta coisa ruim. Por isso eu durmo em cima da bigorna, ha.", "Precisa de ferramenta? Faço enxada que planta sozinha. Quase."],
      ["Teu pai passou aqui. Não na noite que sumiu... três noites DEPOIS.", "De madrugada. Batendo de porta em porta, chamando teu nome. Com a voz dele, igualzinha.", "Ninguém abriu. Aqui ninguém abre de noite. Ele bateu até o galo cantar. Depois foi pra mata andando de costas. De costas, menina."]],
    pista: [1, "pai_porta", "Seu Bento: três noites depois, \"meu pai\" bateu nas portas da vila me chamando. Foi embora andando de costas."],
    extra: ["Ferradura na porta segura cachorro grande. Daquele tipo.", "Se ouvir martelada de noite, não sou eu. Eu durmo."],
    sono: ["...não abre... não abre... ele sabe teu nome...", "(Ronco alto. Ele aperta um martelo contra o peito.)"] },
  { id: "cida", nome: "Dona Cida", casa: "botica", loja: 1, look: { pele: "#8a5a3a", roupa: "#5a3a6a", cabelo: "#e8e2d8", lenco: "#c8a030", velho: 1 },
    conversas: [["Benedita e eu aprendemos a benzer com a mesma madrinha. Ela era melhor. Por isso foi ela.", "Leva uma garrafada. Se a coisa te pegar, ela te devolve uma vez."],
      ["As regras do caderno não são da sua vó. São mais velhas que a vila.", "A mata tem fome de trinta em trinta anos. Alguém do sítio tem que ir. Se ninguém vai, ela vem buscar.", "Trinta anos atrás seria a sua mãe. A Benedita foi no lugar dela... e a mata deixou ela voltar. Agora o prazo venceu."]],
    pista: [1, "trinta", "Dona Cida: a mata cobra alguém do sítio a cada 30 anos. A vó já tinha ido uma vez, no lugar da minha mãe, e voltou."],
    extra: ["Arruda atrás da orelha e o Saci passa reto. Ele odeia o cheiro.", "Não diga seu nome em voz alta no sítio. Elas anotam."],
    sono: ["...Benedita, devolve a menina... não é a vez dela...", "(Ela reza dormindo, numa língua que você não conhece.)"] },
  { id: "ze", nome: "Seu Zé", casa: "barbearia", look: { pele: "#d8a888", roupa: "#e8e2d8", cabelo: "#1a1210", careca: 1, bigode: 1 },
    conversas: [["Cortar o cabelo? Não? Melhor. Cabelo cortado no sítio não se joga fora. Elas usam.", "Aqui todo mundo conversa na cadeira. E eu escuto tudo."],
      ["Vou te contar o que a vila não conta: ninguém daqui vai no sítio da Benedita. Nem de dia.", "Mas toda semana alguém deixa comida na porteira. Pão, ovo, uma vela acesa.", "Não é pra sua vó. Nunca foi. É pra manter ELA quieta lá dentro da mata."]],
    pista: [1, "oferenda", "Seu Zé: a vila deixa comida e vela na porteira toda semana para manter quieta a coisa da mata."],
    extra: ["O delegado tem uma lista. Pergunta pra ele. Ou melhor: não pergunta.", "Meu espelho mostra quem entra. Às vezes mostra quem não entrou."],
    sono: ["...a tesoura... quem tirou a tesoura da gaveta?...", "...cabelo comprido... no milharal..."] },
  { id: "ramos", nome: "Delegado Ramos", casa: "delegacia", look: { pele: "#c8946a", roupa: "#4a5a3a", cabelo: "#2a1a10", bigode: 1, chapeu: "#3a3a2a" },
    rota: [[8, 13.2], [20, 13.2], [20.6, 21.4], [40, 21.4], [40, 13.2], [26, 13.2]],
    conversas: [["Menina sozinha na vila? Vá pra casa antes de escurecer. É lei. Minha lei.", "Desaparecido? Nessa vila ninguém desaparece. No papel, nunca sumiu ninguém."],
      ["...Tá bom. Mas você não viu isso.", "(Ele mostra uma folha velha.) 1936: Antônio, do sítio. 1966: Maria, do sítio. 1996: Benedita, do sítio, riscado. 2026: em branco.", "A Benedita foi e voltou. Ninguém volta. Por isso o nome está riscado. E por isso 2026 ainda está em branco."]],
    pista: [1, "lista", "Delegado Ramos: uma lista com um nome do sítio a cada 30 anos. 1996: Benedita (riscado). 2026: em branco."],
    extra: ["Ronda? Eu faço ronda até as cinco. Depois a vila é delas.", "Se vir seu pai, não fale com ele. É uma ordem."],
    sono: ["...2026... em branco... alguém escreve de noite...", "...a mata não é minha jurisdição..."] },
  { id: "anselmo", nome: "Padre Anselmo", casa: "igreja", loja: 1, look: { pele: "#e8c0a0", roupa: "#141218", cabelo: "#c8c8c8", careca: 1, velho: 1, batina: 1 },
    conversas: [["Que Santa Luzia guarde seus olhos, filha. No sítio você vai precisar deles abertos.", "Água benta afasta o Corpo-Seco. Uma vez. Ele não volta duas vezes para o mesmo frasco."],
      ["Sua avó veio se confessar na véspera. Eu não posso contar o que ela disse.", "...Mas posso contar o que ela pediu: que eu tocasse o sino da capela do sítio quando você chegasse.", "Eu não fui. Ninguém sobe a estrada de noite. Me perdoe. A capela ficou muda, e alguma coisa acordou."]],
    pista: [1, "sino", "Padre Anselmo: a vó pediu que ele tocasse o sino da capela do sítio quando eu chegasse. Ele teve medo e não foi."],
    extra: ["A missa é às três da tarde. Ninguém vem às seis.", "Os santos da igreja estão sem rosto. Amanheceram assim."],
    sono: ["...perdão, Benedita... eu tive medo...", "(Ele dorme de joelhos ao lado da cama.)"] },
  { id: "damiao", nome: "Damião, o coveiro", casa: "coveiro", look: { pele: "#a8846a", roupa: "#5a4a3a", cabelo: "#3a2a1a", palha: 1, magra: 1, pa: 1 },
    rota: [[39, 21.6], [39, 23.2], [33, 23.2], [33, 32.4], [42, 32.4], [42, 23.2]],
    conversas: [["Coveiro. Damião. Não aperto a mão de ninguém, nem dos vivos.", "Na vila só se morre de velho. Quem morre de outro jeito, morre lá no sítio."],
      ["Mês passado a Benedita me pagou pra abrir uma cova no cemitério do sítio. Sem nome.", "Eu cavei de tarde. De manhã estava fechada. Cavei de novo. Fechou de novo.", "Na terceira vez tinha marca de unha na terra. De dentro pra fora."]],
    pista: [1, "cova", "Damião, o coveiro: a vó mandou abrir uma cova sem nome no sítio. Ela fechava sozinha, com marcas de unha por dentro."],
    extra: ["Não pise em túmulo. Eles sentem o peso.", "Tem cova aberta no meu cemitério para 2026. Ninguém me mandou abrir."],
    sono: ["...fecha... fecha de novo... quem fecha?...", "(Ele dorme de botas, sujas de terra fresca.)"] },
  { id: "tiao", nome: "Tiãozinho", casa: "padaria", cama: 1, look: { pele: "#c8946a", roupa: "#3a6a9a", cabelo: "#1a1210", bone: "#c8281e", crianca: 1 },
    rota: [[19, 15.4], [27, 15.4], [27.6, 19.6], [18.6, 19.6]],
    conversas: [["Você é a menina do sítio? Lá tem um homem bonzinho no milharal. Ele acena.", "A mãe diz que o homem não tem rosto. Mas tem sim. Ele pegou um emprestado."],
      ["Ontem ele me chamou pelo nome. Disse que é o seu pai. Que está com saudade.", "Ele pediu pra eu te avisar: \"Fala pra Yasmin abrir a porta quando eu bater.\"", "Você vai abrir?"]],
    pista: [1, "milharal", "Tiãozinho: um homem sem rosto no milharal diz que é meu pai. Pediu que eu \"abra a porta quando ele bater\"."],
    extra: ["Brinca de esconde-esconde? Eu sempre ganho. As coisas daqui me ajudam a esconder.", "Sabe por que a vila apaga tudo de noite? Pra ELA achar que aqui não tem ninguém."],
    sono: ["...pai da Yasmin... não... não vou abrir...", "(Ele dorme virado para a parede, cantando baixinho uma música que ninguém ensinou.)"] }];
// ---- vila maior: a cidade desceu 16 quadrinhos para caber a estrada da mata, e cresceu para o leste e para baixo ----
VPREDIOS.forEach(p => { p.y += OY; if (p.npc !== "anselmo") p.balcao = 1; });
VPREDIOS.push(
  { id: "correio", nome: "Correio", placa: "CORREIO", x: 43, y: 23, w: 6, h: 4.4, cor: "#b89030", cor2: "#e8e0c0", tel: "#6a3a1a", npc: "arlindo", vit: ["#e8e2d0", "#c8a050", "#3a5a8a"], balcao: 1 },
  { id: "escola", nome: "Escola Santa Luzia", placa: "ESCOLA", x: 50.5, y: 22.6, w: 8, h: 4.8, cor: "#8a9aaa", cor2: "#e0e0d8", tel: "#5a2a1e", npc: "helena", vit: ["#2a4a2a", "#e8e2d0", "#c8a050"] },
  { id: "oficina", nome: "Oficina do Juvêncio", placa: "OFICINA", x: 43, y: 31.4, w: 6, h: 4.4, cor: "#5a5a5a", cor2: "#a8a8a0", tel: "#2a2a2a", npc: "juvencio", vit: ["#3a3a3a", "#8a8a8a", "#c8a050"] },
  { id: "pensao", nome: "Pensão do Tonho", placa: "PENSÃO", x: 50.5, y: 31.4, w: 7, h: 4.4, cor: "#7a4a5a", cor2: "#e0c8c8", tel: "#3a1e28", npc: "tonho", vit: ["#e8e2d0", "#8a3a3a", "#c8a050"], balcao: 1 },
  { id: "gemeas", nome: "Casa das gêmeas", placa: "", x: 3, y: 40.4, w: 6, h: 4.4, cor: "#8a7a5a", cor2: "#d8d0b8", tel: "#4a3020", npc: "gemeas", casa: 1, vit: ["#e8e2d0", "#a85a5a", "#5a7a9a"] },
  { id: "viuva", nome: "Casa da Dona Eulália", placa: "", x: 10, y: 40.4, w: 6, h: 4.4, cor: "#3a3a44", cor2: "#a8a8b0", tel: "#1e1e24", npc: "eulalia", casa: 1, vit: ["#141218", "#5a5a6a", "#2a2a30"] },
  { id: "nena", nome: "Casa da Dona Nena", placa: "", x: 45.5, y: 40.4, w: 6, h: 4.4, cor: "#a87a8a", cor2: "#e8d8d8", tel: "#5a2a3a", npc: "nena", casa: 1, vit: ["#e8e2d0", "#c8a050", "#8a8a8a"] });
VPOSTES.forEach(q => { q[1] += OY; }); VPOSTES.push([47, 28], [54, 28], [46.6, 36.2], [53.4, 36.2], [20.8, 39.4], [44.2, 46]);
VBANCOS.forEach(q => { q[1] += OY; }); VBANCOS.push([7.2, 47.8], [55, 38.9]);
VFONTE.y += OY; VCEM.y0 += OY; VCEM.y1 += OY;
const ESTRADA = [[23, -1], [23, 3], [20.6, 6.4], [20.6, 9.6], [24.6, 12.6], [24.6, 16], [23, 18.6], [23, 22.4]];
const RIO_V = { y0: 7.3, y1: 8.6 }, PONTE_V = { x0: 19.3, x1: 21.9 };
const CAPELINHA = { x: 26.9, y: 4.6 }, TAPERA = { x: 29.4, y: 11 }, FUSCA = { x: 16.3, y: 14.4 }, CRUZES = [[18.6, 10.8, "Antônio · 1936"], [26.6, 15, "sem nome, com uma fita vermelha igual à sua"]];
const ORELHAO = { x: 17.4, y: 31 }, CARTAZES = [2, 9], CARROCA = { x: 58.3, y: 33.8 }, BARRIS = [[9.9, 27.1], [10.5, 27.2]], VARAL_V = { x0: 6.2, x1: 13.8, y: 47.6 }, TOBIAS = { x: 32.4, y: VCEM.y0 - .2 };
const novosNpcs = [
  { id: "arlindo", nome: "Seu Arlindo", casa: "correio", look: { pele: "#c8946a", roupa: "#3a5a8a", cabelo: "#5a4a3a", chapeu: "#2a3a6a", bolsa: 1 }, rota: [[44, 29], [57, 29], [57, 37.2], [30, 37.2], [30, 29]], missao: "cartas",
    conversas: [["Carta pra Yasmin? Não... ainda não. Mas vai ter. Aqui as cartas chegam antes das pessoas sumirem.", "Sou o Arlindo, do correio. Trinta anos entregando. Só não entrego no sítio. Lá eu deixo na porteira."]],
    extra: ["As cartas daqui não têm remetente. Eu entrego mesmo assim.", "Tem uma carta parada no correio há trinta anos, endereçada a você. Ainda não chegou o dia."], sono: ["...não tem remetente... não tem remetente...", "(Ele dorme abraçado na bolsa de cartas.)"] },
  { id: "helena", nome: "Professora Helena", casa: "escola", posto: [4.5, 1.45], look: { pele: "#e8c0a0", roupa: "#8a3a4a", cabelo: "#6a3a1a", coque: 1, oculos: 1 }, missao: "merenda",
    conversas: [["Bem-vinda à Escola Santa Luzia. Já fomos quarenta alunos. Hoje são três. Ninguém fica depois das três da tarde.", "As crianças desenham sempre a mesma coisa: uma moça alta, de pescoço comprido. Eu peço pra pararem. Elas não param."]],
    extra: ["Não deixe as crianças daqui te ensinarem músicas.", "De manhã aparecem palavras no quadro-negro. Eu apago. No outro dia aparecem de novo."], sono: ["...apaguem o quadro... apaguem...", "(Ela dorme com um giz apertado na mão.)"] },
  { id: "juvencio", nome: "Seu Juvêncio", casa: "oficina", posto: [3.6, 3.1], look: { pele: "#a8744a", roupa: "#3a4a5a", cabelo: "#1a1210", bone: "#3a3a3a", grande: 1 }, missao: "egua",
    conversas: [["Caminhonete da Benedita? Conheço. Fui eu que vendi pra ela. Ela nunca saiu do sítio com ela.", "Peça eu até tenho. Mas aqui nada é de graça."]],
    extra: ["A estrada até o sítio tem um quilômetro de dia. De noite eu já andei três e não cheguei.", "Tem um fusca largado na estrada. Ninguém sabe de quem é. A cada ano ele aparece mais perto da vila."], sono: ["...Estrela... para de bater na parede...", "(Ele dorme de botas, com uma chave inglesa no peito.)"] },
  { id: "tonho", nome: "Seu Tonho", casa: "pensao", look: { pele: "#d8a888", roupa: "#6a4a3a", cabelo: "#8a8a8a", bigode: 1, grande: 1, avental: "#d8d0c0" }, missao: "peixe",
    conversas: [["Pensão do Tonho. Tem quarto, tem sopa e não tem pergunta.", "O último hóspede chegou faz um mês. Um homem da cidade. Saiu pro sítio de madrugada e deixou a mala aqui."],
      ["Era o seu pai, não era? Marcos. A mala ficou no quarto 3.", "Eu abri. Desculpa. Tinha uma foto sua, roupa pra três dias e um bilhete:", "\"Se eu não voltar até domingo, não deixe a Yasmin entrar na mata. Nem se for eu chamando.\""]],
    pista: [1, "mala", "Seu Tonho: o pai deixou uma mala na pensão com um bilhete: \"não deixe a Yasmin entrar na mata, nem se for eu chamando\"."],
    extra: ["O quarto 3 está trancado. Não fui eu que tranquei.", "Sopa? Hoje é de... melhor não perguntar."], sono: ["...quarto 3... alguém tá batendo por dentro...", "(Ele dorme sentado, de frente para a porta, no escuro.)"] },
  { id: "eulalia", nome: "Dona Eulália", casa: "viuva", posto: [1.7, 3.2], look: { pele: "#e8d0c0", roupa: "#141218", cabelo: "#c8c8c8", lenco: "#141218", velho: 1 }, missao: "flores",
    conversas: [["Entra, menina. Fecha a porta. Não, deixa aberta. O Tobias gostava de porta aberta.", "Meu marido. Morreu faz vinte anos. Todo dia ele toma café comigo. A xícara amanhece vazia."]],
    extra: ["Duas xícaras. Sempre duas.", "Viúva é quem perdeu o marido. E quem o marido não deixa ir, é o quê?"], sono: ["...Tobias, sai do pé da cama...", "(Ao lado dela, o travesseiro tem a marca de uma cabeça.)"] },
  { id: "nena", nome: "Dona Nena", casa: "nena", posto: [5, 4.1], look: { pele: "#c8946a", roupa: "#a8708a", cabelo: "#e8e2d8", coque: 1, velho: 1 }, missao: "novelo",
    conversas: [["Cuidado onde pisa. São catorze gatos. Ontem eram quinze.", "Gato vê o que a gente não vê. Por isso a sua Sombrinha fala. A Benedita ensinou ela."]],
    extra: ["Quando os gatos olham todos pro mesmo canto, eu saio do quarto.", "Gato preto não dá azar. Dá aviso."], sono: ["...quinze... catorze... treze...", "(Os gatos dormem em volta dela. Todos virados para a janela.)"] },
  { id: "gemeas", nome: "Ana e Lia", casa: "gemeas", cama: 1, look: { pele: "#e8c0a0", roupa: "#e8e2d8", cabelo: "#c8a060", gemeas: 1, crianca: 1 }, rota: [[5.2, 45.8], [7.2, 45.8], [7.2, 46.6], [5.2, 46.6]],
    conversas: [["— Oi, Yasmin. — A gente sabe seu nome. — Todo mundo sabe.", "— Quer brincar? — De quê? — De quem some primeiro."],
      ["— A vó Benedita dava doce pra gente. — Doce de leite. — Ela disse que ia voltar com mais.", "— Ela voltou uma vez. — De noite. — Bateu aqui. — A gente não abriu. — Ela não tinha os pés no chão."]],
    pista: [1, "gemeas", "Ana e Lia: a vó \"voltou\" uma noite e bateu na casa delas. Ela não tinha os pés no chão."],
    extra: ["— Shhh. — Ela está ouvindo.", "— A gente conta até cem. — Você corre. — Mas não pro sítio."], sono: ["— ...noventa e oito... — ...noventa e nove...", "(As duas dormem de mãos dadas, de uma cama para a outra, de olhos abertos.)"] },
  { id: "maria", nome: "A menina da estrada", fantasma: 1, look: { pele: "#d8dce0", roupa: "#e8e8f0", cabelo: "#2a2a30", crianca: 1, fantasma: 1 },
    conversas: [["Você também veio pela estrada de noite? Eu vim. Em 1966.", "Meu nome era Maria. Ainda é? Ninguém fala mais."], ["Eu fui a de 1966. A mata não devolve, sabia? Ela só empresta.", "A sua vó ela emprestou. Por trinta anos. Agora quer de volta... com juros."]],
    pista: [1, "maria", "Maria, a menina da estrada (1966): a mata não devolve, só empresta. A vó foi \"emprestada\" por 30 anos e agora a mata quer de volta."],
    extra: ["Não pisa na sombra da cruz.", "Você tem cheiro de casa. Eu esqueci o cheiro da minha."], sono: ["..."] }];
NPCS.forEach(n => { if (n.rota) n.rota = n.rota.map(([x, y]) => [x, y + OY]); });
NPCS.push(...novosNpcs); NPCS.find(n => n.id === "cida").missao = "mel";
// mais gente (e coisa) na vila
const dormindo = k => k >= DIA - 2 || k < 5;
NPCS.push(
  { id: "quirino", nome: "Quirino, o sacristão", casa: "igreja", look: { pele: "#e8c8a8", roupa: "#2a2a2a", cabelo: "#5a4a3a", oculos: 1, magra: 1 },
    onde: k => dormindo(k) ? { dentro: true, predio: "igreja", andar: 0, x: 8.3, y: 1.6, dir: -1 } : { dentro: true, predio: "igreja", andar: 0, x: 7.6, y: 3.6, dir: -1 },
    conversas: [["Psiu. Fala baixo. O sino escuta.", "Eu toco ele pros mortos. Um toque pra cada um. Faz quarenta anos que eu não erro a conta."],
      ["Na noite que a sua vó sumiu, o sino tocou sozinho. Três vezes.", "Eu contei nos meus papéis: um toque em 1966, um em 1996... e o terceiro é agora.", "Ele não toca pra quem morreu, menina. Ele toca pra quem vai."]],
    pista: [1, "sino", "Quirino: o sino tocou sozinho três vezes — 1966, 1996 e agora. Ele não toca pra quem morreu, toca pra quem vai."],
    extra: ["Não sento de costas pra porta da igreja. Nunca.", "Já reparou que a sombra da cruz aponta pro sítio? Toda hora do dia."] },
  { id: "filo", nome: "Filó", casa: "igreja", look: { pele: "#d8c0a8", roupa: "#d8d0c0", cabelo: "#9a9a9a", magra: 1, velho: 1 },
    onde: k => dormindo(k) || ehNoite() ? { dentro: false, x: VFONTE.x + Math.sin(R.t * .2) * .15, y: VFONTE.y + 1.25, dir: -1 } : { dentro: false, x: VBANCOS[0][0], y: VBANCOS[0][1] + .05, dir: 1 },
    conversas: [["Menina do sítio, menina do mato, quem entra na trilha não volta no sapato.", "Hihi. Desculpa. Eu falo rimando. Assim eles não entendem."],
      ["A Benedita sentava aqui comigo. Antes. Antes de ela voltar.", "Depois que voltou, ela sentava do mesmo jeito, falava do mesmo jeito... mas os passarinhos não chegavam mais perto dela.", "Passarinho sabe. Passarinho sempre sabe."]],
    pista: [1, "filo", "Filó: depois que a vó \"voltou\" da mata, os passarinhos nunca mais chegaram perto dela."],
    extra: ["Na fonte de noite tem mais um rosto na água. Conta comigo: um, dois... três.", "Eu não durmo. Quem dorme na praça, a praça leva."] },
  { id: "josias", nome: "Seu Josias", casa: "pensao", look: { pele: "#c8946a", roupa: "#5a2a2a", cabelo: "#1a1a1a", avental: "#a83a3a", grande: 1, careca: 1 },
    onde: k => dormindo(k) ? { dentro: true, predio: "pensao", andar: 1, x: 6.4, y: 1.8, dorme: true } : (() => { const r = [[16.6, 31], [29.4, 31], [29.4, 36.2], [16.6, 36.2]], t = (k * .35) % 4, i = Math.floor(t), f = t - i, a = r[i], b = r[(i + 1) % 4]; return { dentro: false, x: mix(a[0], b[0], f), y: mix(a[1], b[1], f), dir: b[0] >= a[0] ? 1 : -1, anda: 1 }; })(),
    conversas: [["Açougueiro. Carne boa, fresquinha. Não pergunta de quê.", "Brincadeira. É porco. Quase sempre é porco."],
      ["Os bichos do sítio da sua vó nunca adoeceram. Nunca. Nem na seca de 96.", "Ela vinha comprar osso. Muito osso. Dizia que era pros cachorros. A Benedita nunca teve cachorro."]],
    pista: [1, "osso", "Seu Josias: a vó comprava muito osso \"pros cachorros\", mas nunca teve cachorro nenhum."],
    extra: ["Já viu um porco ficar parado olhando pra mata? Eu já. Todos juntos.", "Esse avental? É tinta. Claro que é tinta."], sono: ["...faca... faca no lugar...", "(Ele dorme com o cutelo debaixo do travesseiro.)"] },
  { id: "forasteiro", nome: "O homem de chapéu", casa: "pensao", look: { pele: "#a8a098", roupa: "#1e1e22", cabelo: "#1a1a1a", chapeu: "#2a2420", grande: 1 },
    onde: k => dormindo(k) || ehNoite() ? { dentro: false, x: 52.4, y: 37.6, dir: -1 } : { dentro: true, predio: "pensao", andar: 0, x: 6.2, y: 3.4, dir: -1 },
    conversas: [["...", "Você não devia estar acordada, Yasmin."],
      ["Eu conheço a sua voz. Conheço do telefone. Você me ligava todo domingo.", "Não. Não chega perto. Eu ainda não lembro direito como é ter rosto.", "Quando eu lembrar, eu te busco. Promessa de pai."]],
    pista: [1, "chapeu", "O homem de chapéu, parado na frente da pensão: ele fala como o pai. Ele diz que ainda \"não lembra como é ter rosto\"."],
    extra: ["Não olha embaixo do chapéu.", "A mata me deixou sair pra te chamar. Não vem, filha. Não vem."] });
/* ---------- a cor da Sombrinha ---------- */
const GATO_CORES = { preto: ["Preta", "#2a2a30", "#3c3c46", "#c8e86a", 0], branco: ["Branca", "#eeeae2", "#d6cfc4", "#5aa8e8", 0], pardo: ["Parda", "#8a7c68", "#55483a", "#d8c040", 1], marrom: ["Marrom", "#6e4628", "#482c16", "#e8b84a", 1], amarelo: ["Amarela", "#e8a040", "#c0761e", "#6ac86a", 1] };
const corGato = () => GATO_CORES[ls("roca_gato_cor") || "preto"] || GATO_CORES.preto;
function abrirCoresGato() {
  painelAberto = true; el.rcPainel.hidden = false; const atual = ls("roca_gato_cor") || "preto";
  const foto = k => { const cv2 = document.createElement("canvas"); cv2.width = 96; cv2.height = 72; const g = cv2.getContext("2d"); g.fillStyle = "#c8a878"; g.fillRect(0, 0, 96, 72); g.fillStyle = "#8a3a3a"; g.beginPath(); g.ellipse(48, 58, 40, 12, 0, 0, 7); g.fill(); const c0 = ls("roca_gato_cor"); ls("roca_gato_cor", k); gatoEm(44, 60, 3.4, 1, 0, 0, g); ls("roca_gato_cor", c0 || "preto"); return cv2.toDataURL(); };
  el.rcPainel.innerHTML = `<div class="rc-caixa"><h2>A caminha da Sombrinha</h2><p>"Miau. Eu posso ficar do jeito que você quiser, Yasmin. Só não me deixa sozinha de noite."</p>
    <div class="rc-grade">${Object.entries(GATO_CORES).map(([k, v]) => `<button type="button" class="rc-op ${k === atual ? "dest" : ""}" data-g="${k}"><img alt="" src="${foto(k)}" style="width:100%;max-width:150px;image-rendering:auto;border:2px solid #120a05;margin-bottom:6px">${v[0]}${k === atual ? "<small>assim que ela está</small>" : ""}</button>`).join("")}</div>
    <div class="rc-linha"><button type="button" class="rc-op" id="rcFechar">Fechar</button></div></div>`;
  el.rcPainel.querySelectorAll("[data-g]").forEach(b => b.addEventListener("click", () => { ls("roca_gato_cor", b.dataset.g); delete RETRATOS.g; S.miau && R.gato ? S.miau(R.gato.x, R.gato.y) : tocarTom(900, .2, { vol: .05, ate: 600 }); fecharPainel(); efeito(`A Sombrinha agora é ${GATO_CORES[b.dataset.g][0].toLowerCase()}!`, "#f2c94a"); }));
  document.getElementById("rcFechar").addEventListener("click", fecharPainel); focarPrimeiro();
}
/* ---------- mais coisas pra fazer no sítio: a vaca Mimosa e a lenha ---------- */
const VACA = { x: 15.6, y: 30.2 }, COCHO = { x: 18, y: 30.7 };
function acaoFazenda(p) {
  if (dist(p, { x: VACA.x, y: VACA.y + .55 }) < 1.4) {
    const max = R.vacaComeu ? 2 : 1, feito = R.leiteHoje || 0;
    if (!R.vacaComeu && (R.colheita.milho || 0) > 0 && feito < 1) return { t: "Dar milho pra Mimosa", fn: () => { R.colheita.milho--; R.vacaComeu = 1; tocarTom(150, .6, { tipo: "sawtooth", vol: .06, ate: 110, lp: 700 }); efeito("A Mimosa comeu! Hoje ela dá mais leite", "#9bd86b"); hud(); } };
    if (feito < max) return { t: "Ordenhar a Mimosa", fn: () => { R.leiteHoje = feito + 1; R.extra.leite = (R.extra.leite || 0) + 1; for (let i = 0; i < 5; i++) tocarRuido(.05, { filtro: "highpass", f: 2500, vol: .06, quando: i * .14 }); efeito("+1 balde de leite", "#f4efe4"); hud(); } };
    return { t: "Mimosa", loc: 1, fn: () => { tocarTom(130, 1, { tipo: "sawtooth", vol: .07, ate: 95, lp: 600 }); falar(ehNoite() ? ["A Mimosa não tira o olho da mata. Ela parou de mastigar.", "As vacas sabem quando tem alguma coisa olhando de volta."] : ["Muuu. A Mimosa já deu todo o leite de hoje. Amanhã tem mais.", "Se der milho pra ela antes de ordenhar, ela dá dois baldes."], null, "Yasmin"); } };
  }
  if (dist(p, { x: LENHA.x, y: LENHA.y + .75 }) < 1.25) {
    if ((R.lenhaHoje || 0) < 4) return { t: "Rachar lenha", fn: () => { R.lenhaHoje = (R.lenhaHoje || 0) + 1; R.extra.lenha = (R.extra.lenha || 0) + 1; R.machado = 1; tocarRuido(.08, { filtro: "lowpass", f: 700, vol: .45 }); tocarTom(95, .12, { vol: .2, ate: 60 }); R.tremor = .12; efeito(`+1 feixe de lenha (${R.lenhaHoje}/4 hoje)`, "#c8a070"); hud(); } };
    return { t: "Lenha", loc: 1, fn: () => efeito("Já rachou bastante hoje. Amanhã tem mais", "#e8e2d4") };
  }
  return null;
}
function desenharVaca(tm) {
  const x = PX(VACA.x), y = PY(VACA.y), s = TS / 48; if (!naTela(x, y, 120)) return;
  // cerquinha e cocho
  c.fillStyle = "#7a5a32"; for (const [ax, ay, bx2] of [[13.4, 28.7, 18.8]]) { c.fillRect(PX(ax), PY(ay), (bx2 - ax) * TS, 3); for (let fx = ax; fx <= bx2 + .01; fx += 1.35) c.fillRect(PX(fx) - 2, PY(ay) - TS * .4, 4, TS * .45); }
  const cx = PX(COCHO.x), cy = PY(COCHO.y); sombra(cx, cy, TS * .6, TS * .1); c.fillStyle = "#6a4a2a"; c.fillRect(cx - TS * .55, cy - TS * .35, TS * 1.1, TS * .35); c.fillStyle = "#4a2e18"; c.fillRect(cx - TS * .48, cy - TS * .32, TS * .96, TS * .14); if (R.vacaComeu) { c.fillStyle = "#e8c84a"; for (let i = 0; i < 6; i++) c.fillRect(cx - TS * .4 + i * TS * .14, cy - TS * .3, 3, 3); }
  const mast = Math.sin(tm * 4) * 1.2 * s, rabo = Math.sin(tm * 2.2) * 6 * s, nt = ehNoite();
  sombra(x, y, 30 * s, 7 * s); c.save(); c.translate(x, y); c.scale(s, s);
  c.fillStyle = "#e8e2d8"; [[-16, 0], [-8, 0], [10, 0], [17, 0]].forEach(([lx]) => c.fillRect(lx, -16, 5, 16)); c.fillStyle = "#3a2a22"; [[-16], [-8], [10], [17]].forEach(([lx]) => c.fillRect(lx, -3, 5, 3)); // pernas e cascos
  c.fillStyle = "#f2ede4"; c.beginPath(); c.roundRect ? c.roundRect(-22, -36, 46, 24, 10) : c.rect(-22, -36, 46, 24); c.fill();
  c.fillStyle = "#2a2420"; c.beginPath(); c.ellipse(-8, -28, 7, 5, .3, 0, 7); c.ellipse(9, -22, 6, 4, -.2, 0, 7); c.ellipse(16, -31, 4, 3, 0, 0, 7); c.fill(); // manchas
  c.fillStyle = "#f2b8b8"; c.beginPath(); c.ellipse(4, -12, 6, 3.5, 0, 0, 7); c.fill(); // úbere
  c.strokeStyle = "#e8e2d8"; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-22, -32); c.quadraticCurveTo(-30, -24 + rabo * .3, -28 + rabo, -12); c.stroke(); c.fillStyle = "#2a2420"; c.beginPath(); c.ellipse(-28 + rabo, -11, 2.5, 4, 0, 0, 7); c.fill();
  c.save(); c.translate(26, -34); c.fillStyle = "#f2ede4"; c.beginPath(); c.roundRect ? c.roundRect(-4, -6, 16, 18, 6) : c.rect(-4, -6, 16, 18); c.fill(); c.fillStyle = "#f2c8b8"; c.beginPath(); c.roundRect ? c.roundRect(-3, 6 + mast * .3, 14, 8, 4) : c.rect(-3, 6, 14, 8); c.fill(); c.fillStyle = "#6a3a2a"; c.fillRect(1, 9 + mast * .3, 2, 2); c.fillRect(7, 9 + mast * .3, 2, 2);
  c.fillStyle = "#d8c8a0"; c.beginPath(); c.moveTo(-3, -5); c.lineTo(-7, -11); c.lineTo(-1, -6); c.moveTo(10, -5); c.lineTo(14, -11); c.lineTo(8, -6); c.fill(); c.fillStyle = "#2a2420"; c.beginPath(); c.ellipse(-6, -2, 4, 2.2, -.4, 0, 7); c.ellipse(14, -2, 4, 2.2, .4, 0, 7); c.fill();
  if (nt) { c.fillStyle = "rgba(220,255,200,.95)"; c.fillRect(0, -1, 2.4, 2.4); c.fillRect(6.5, -1, 2.4, 2.4); } else { c.fillStyle = "#1a1210"; c.beginPath(); c.arc(1.5, 0, 1.6, 0, 7); c.arc(7.5, 0, 1.6, 0, 7); c.fill(); c.fillStyle = "#fff"; c.fillRect(1.6, -1, .8, .8); c.fillRect(7.6, -1, .8, .8); }
  c.fillStyle = "#c8a050"; c.beginPath(); c.arc(4, 16, 3, 0, 7); c.fill(); c.restore(); // sininho
  c.restore();
  if (!nt && (R.leiteHoje || 0) < (R.vacaComeu ? 2 : 1)) { c.fillStyle = `rgba(242,201,74,${.4 + .3 * Math.sin(tm * 3)})`; c.beginPath(); c.arc(x, y - TS * 1.05, 3, 0, 7); c.fill(); }
}
/* ---------- a rua nova da vila ---------- */
VPREDIOS.push(
  { id: "valdemar", nome: "Casa do Seu Valdemar", placa: "", x: 3, y: 53.6, w: 6, h: 4.2, cor: "#5a7a8a", cor2: "#d8dcd8", tel: "#2a3a44", npc: "valdemar", casa: 1, vit: ["#e8e2d0", "#c8641e", "#5a5a5a"] },
  { id: "iracema", nome: "Casa da Dona Iracema", placa: "", x: 11, y: 53.6, w: 6, h: 4.2, cor: "#8a5a7a", cor2: "#e8d8e0", tel: "#4a2a3a", npc: "iracema", casa: 1, vit: ["#e8e2d0", "#6a9a4a", "#a83a6a"] },
  { id: "fechada", nome: "Casa fechada", placa: "", x: 19, y: 53.6, w: 6, h: 4.2, cor: "#4a4440", cor2: "#8a8478", tel: "#1e1a16", casa: 1, abandonada: 1, vit: ["#14120e", "#2a2620", "#1a1612"] },
  { id: "prado", nome: "Casa dos Prado", placa: "", x: 41, y: 53.6, w: 6, h: 4.2, cor: "#9a8a5a", cor2: "#e8e0c0", tel: "#5a3a1e", casa: 1, abandonada: 1, vit: ["#2a2a2a", "#8a6a3a", "#3a3a3a"] },
  { id: "armarinho", nome: "Armarinho da Dona Celeste", placa: "ARMARINHO", x: 49, y: 53.6, w: 7, h: 4.2, cor: "#c87a5a", cor2: "#f2e0c8", tel: "#6a2a1a", vit: ["#e8c84a", "#a83a3a", "#3a6a9a"] });
VPOSTES.push([8, 49.55], [24.6, 49.55], [47, 49.55], [33.6, 52]);
NPCS.push(
  { id: "valdemar", nome: "Seu Valdemar", casa: "valdemar", posto: [3.6, 3.2], look: { pele: "#b8845a", roupa: "#4a6a8a", cabelo: "#3a3a3a", bone: "#c8641e", bigode: 1, grande: 1 }, missao: "mapa",
    conversas: [["Valdemar, encanador aposentado. Quarenta anos limpando o esgoto dessa vila.", "Fecharam o esgoto em 96. Um menino entrou no bueiro da rua de baixo e não saiu mais. Antônio, o nome dele."],
      ["Lá embaixo é um labirinto. Os canos velhos, as galerias, tudo igual. Sem mapa, ninguém volta.", "E tem ele. Bate casco na pedra. Não adianta correr, menina. Ele corre mais. Tem que se esconder."]],
    pista: [1, "esgoto", "Seu Valdemar: o esgoto foi fechado em 1996, quando o Antônio entrou no bueiro e não saiu. Lá embaixo \"ele\" bate casco na pedra."],
    extra: ["Mês passado eu vi um homem descendo no bueiro. Jaqueta jeans. Parecia procurar alguém.", "Se ouvir casco, procura um barril, um cano grande, um buraco na parede. E prende a respiração."], sono: ["...toc... toc... ele tá no cano...", "(Ele dorme de botas, com uma lanterna na mão.)"] },
  { id: "iracema", nome: "Dona Iracema", casa: "iracema", posto: [5.2, 3], look: { pele: "#8a5a3a", roupa: "#e8e2d8", cabelo: "#e8e2d8", lenco: "#a83a6a", velho: 1, magra: 1 },
    conversas: [["Benzedeira. Benzo quebranto, mau-olhado, espinhela caída. Já benzi metade dessa vila.", "Sua vó vinha aqui todo domingo pra eu benzer. Trinta anos. E a reza nunca pegou nela. Nunca."],
      ["Ramo de arruda murcha na mão de quem tem coisa ruim por perto. Na mão da Benedita, murchava na hora.", "Mas ela chorava, menina. Chorava de verdade. Eu acho que ela também tinha medo do que era."]],
    pista: [1, "arruda", "Dona Iracema: a reza nunca pegou na vó, e a arruda murchava na mão dela. Mas ela chorava de medo do que era."],
    extra: ["Leva um raminho de arruda atrás da orelha. Não resolve, mas ajuda a dormir.", "Quem anda com gato preto nunca anda sozinho. Ou anda com quem não devia."], sono: ["...Pai Nosso que estais... no céu... e não aqui embaixo...", "(Ela dorme com um terço enrolado nos dedos.)"] },
  { id: "celeste", nome: "Dona Celeste", casa: "armarinho", posto: [3.4, 1.75], look: { pele: "#e8c0a0", roupa: "#c87a5a", cabelo: "#6a3a1a", coque: 1, oculos: 1 },
    conversas: [["Armarinho! Linha, botão, fita, agulha. Tudo que a vila precisa pra remendar o que rasga.", "E rasga muito, viu? Toda semana alguém aparece com a roupa rasgada nas costas. Quatro rasgos. Ninguém lembra como foi."]],
    pista: [1, "rasgos", "Dona Celeste: toda semana alguém aparece com a roupa rasgada nas costas, quatro rasgos de garra, e ninguém lembra como foi."],
    extra: ["Fita vermelha eu não vendo mais. A última quem levou foi sua vó.", "Volta outra hora, querida. Mas não depois que escurecer."] });
// coisas pra olhar dentro de algumas casas
const ACOES_INT = {
  fechada: (s, a) => a === 0 && Math.hypot(s.x - 2.4, s.y - 3.2) < 1.1 ? { t: "Olhar", loc: 1, fn: () => falar(["A mesa ainda está posta. Quatro pratos, comida seca, as cadeiras puxadas como se todo mundo tivesse levantado ao mesmo tempo.", "Na parede tem um cartaz amarelado: DESAPARECIDO. ANTÔNIO, 9 ANOS. 1996. Do lado, um cartaz novinho: DESAPARECIDO. MARCOS, 38 ANOS.", "Marcos. O meu pai."], null, "Yasmin") } : null,
  prado: (s, a) => a === 0 && Math.hypot(s.x - 5.8, s.y - 2.2) < 1.1 ? { t: "Olhar", loc: 1, fn: () => falar(["Malas feitas e largadas no chão. A família Prado foi embora com pressa.", "Num bilhete na geladeira: \"Ela bateu de novo. Não dá mais. Vamos antes da lua nova.\""], null, "Yasmin") } : null };
function desenharBueiro(tm) {
  const x = PX(BUEIRO.x), y = PY(BUEIRO.y); if (!naTela(x, y)) return;
  c.fillStyle = "#2a2a28"; c.beginPath(); c.ellipse(x, y, TS * .62, TS * .32, 0, 0, 7); c.fill(); c.fillStyle = "#4a4a44"; c.beginPath(); c.ellipse(x, y, TS * .55, TS * .27, 0, 0, 7); c.fill();
  c.strokeStyle = "#1a1a18"; c.lineWidth = 2; for (let i = -3; i <= 3; i++) { c.beginPath(); c.moveTo(x + i * TS * .13, y - TS * .22 * Math.sqrt(1 - (i / 4) ** 2)); c.lineTo(x + i * TS * .13, y + TS * .22 * Math.sqrt(1 - (i / 4) ** 2)); c.stroke(); }
  for (let i = 0; i < 3; i++) { const f = (tm * .4 + i / 3) % 1; c.fillStyle = `rgba(200,210,200,${(ehNoite() ? .2 : .1) * (1 - f)})`; c.beginPath(); c.arc(x + Math.sin(tm + i) * 6, y - f * TS * 1.2, TS * (.15 + f * .3), 0, 7); c.fill(); } // vapor
  if (ehNoite() && Math.sin(tm * .5) > .93) { c.fillStyle = "rgba(255,40,10,.9)"; c.fillRect(x - 5, y - 1, 2.5, 2.5); c.fillRect(x + 3, y - 1, 2.5, 2.5); } // olhos lá dentro
}
// detalhes a mais dentro de casas e lojas
function detalhesPredio(p, A, X, Y, s, tm) {
  const nt = horaNoite();
  // luminária pendurada no teto com luz amarelada
  { const lx = X(4.5), ly = Y(1.6); c.strokeStyle = "rgba(20,14,8,.8)"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(lx, Y(-.05)); c.lineTo(lx, ly - .2 * s); c.stroke(); c.fillStyle = "#3a3a32"; c.beginPath(); c.moveTo(lx - .18 * s, ly); c.lineTo(lx + .18 * s, ly); c.lineTo(lx + .08 * s, ly - .2 * s); c.lineTo(lx - .08 * s, ly - .2 * s); c.fill(); const on = !p.abandonada && (!nt || luzesVila()); if (on) { c.globalCompositeOperation = "lighter"; const g = c.createRadialGradient(lx, ly + .3 * s, 0, lx, ly + .3 * s, 2.6 * s); g.addColorStop(0, "rgba(255,200,120,.18)"); g.addColorStop(1, "rgba(255,200,120,0)"); c.fillStyle = g; c.fillRect(lx - 2.6 * s, ly - 2.3 * s, 5.2 * s, 5.2 * s); c.globalCompositeOperation = "source-over"; c.fillStyle = "#fff0b0"; c.beginPath(); c.arc(lx, ly + .02 * s, .05 * s, 0, 7); c.fill(); } }
  // rodapé e sombra no pé da parede
  c.fillStyle = "#2a1a0e"; c.fillRect(X(0), Y(.9), ROOM.w * s, .06 * s); { const so = c.createLinearGradient(0, Y(.96), 0, Y(1.6)); so.addColorStop(0, "rgba(0,0,0,.3)"); so.addColorStop(1, "rgba(0,0,0,0)"); c.fillStyle = so; c.fillRect(X(0), Y(.96), ROOM.w * s, .64 * s); }
  // nós e pregos nas tábuas
  for (let i = 0; i < 18; i++) { const nx = X((i * 2.37 + p.x) % ROOM.w), ny = Y(1.1 + ((i * 1.71 + p.x * .3) % (ROOM.h - 1.3))); c.fillStyle = "rgba(30,18,8,.35)"; c.beginPath(); c.ellipse(nx, ny, .06 * s, .028 * s, 0, 0, 7); c.fill(); }
  if (A === 0 && !p.casa && !p.igreja && p.id !== "escola" && p.id !== "oficina") { // lojas: mercadoria no balcão, sacos e caixotes no canto, plantinha
    const bal = { armazem: ["#c8a050", "#8a5a2a", "#e8d8a0"], padaria: ["#d8a050", "#c88a3a", "#f2e0b0"], costura: ["#a02a2a", "#2a3a6a", "#e8c84a"], ferreiro: ["#6a6a6a", "#8a8a8a", "#4a4a4a"], botica: ["#5a8a3a", "#8a3a6a", "#c8c860"], barbearia: ["#e8e2d8", "#a02a2a", "#3a5a8a"] }[p.id] || ["#c8a050", "#a83a3a", "#3a6a9a"];
    for (let i = 0; i < 5; i++) { const bx = X(1.5 + i * .85), by = Y(2.28); c.fillStyle = bal[i % 3]; if (i % 2) { c.fillRect(bx, by - .16 * s, .22 * s, .18 * s); c.fillStyle = "rgba(255,255,255,.3)"; c.fillRect(bx + 2, by - .14 * s, .06 * s, .14 * s); } else { c.beginPath(); c.arc(bx + .1 * s, by - .07 * s, .09 * s, 0, 7); c.fill(); } }
    c.fillStyle = "#6a5a3a"; c.fillRect(X(5.05), Y(2.05), .45 * s, .25 * s); c.fillStyle = "#3a3a32"; c.fillRect(X(5.12), Y(2.1), .3 * s, .08 * s); c.fillStyle = "#c8a050"; c.fillRect(X(5.2), Y(2.0), .14 * s, .05 * s); // caixa registradora
    for (let i = 0; i < 3; i++) { c.fillStyle = "rgba(0,0,0,.3)"; c.beginPath(); c.ellipse(X(.75 + i * .5), Y(5.5), .24 * s, .07 * s, 0, 0, 7); c.fill(); c.fillStyle = ["#c8b088", "#b8a078", "#d8c098"][i]; c.beginPath(); c.moveTo(X(.55 + i * .5), Y(5.5)); c.quadraticCurveTo(X(.5 + i * .5), Y(5.05), X(.75 + i * .5), Y(5.0)); c.quadraticCurveTo(X(1 + i * .5), Y(5.05), X(.95 + i * .5), Y(5.5)); c.fill(); c.strokeStyle = "#7a5a32"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(X(.62 + i * .5), Y(5.12)); c.lineTo(X(.88 + i * .5), Y(5.12)); c.stroke(); } // sacos de mantimento
    c.fillStyle = "#7a5a32"; c.fillRect(X(7.6), Y(5.0), .7 * s, .55 * s); c.fillRect(X(7.8), Y(4.55), .55 * s, .45 * s); c.strokeStyle = "rgba(0,0,0,.35)"; c.lineWidth = 1.5; c.strokeRect(X(7.6), Y(5.0), .7 * s, .55 * s); c.strokeRect(X(7.8), Y(4.55), .55 * s, .45 * s); c.beginPath(); c.moveTo(X(7.6), Y(5.0)); c.lineTo(X(8.3), Y(5.55)); c.stroke(); // caixotes
  }
  if (p.casa && A === 0) { // casas: quadros, cristaleira, cadeira de balanço e bichinhos de pelúcia
    c.fillStyle = "#6a4a2a"; c.fillRect(X(6.3), Y(.15), .55 * s, .45 * s); c.fillStyle = p.abandonada ? "#2a2620" : "#8aa8c0"; c.fillRect(X(6.36), Y(.21), .43 * s, .33 * s); c.fillStyle = p.abandonada ? "#14120e" : "#6a9a4a"; c.beginPath(); c.moveTo(X(6.36), Y(.54)); c.lineTo(X(6.55), Y(.35)); c.lineTo(X(6.79), Y(.54)); c.fill(); // quadrinho de paisagem
    c.fillStyle = "#c8a050"; c.fillRect(X(4.95), Y(.25), .3 * s, .3 * s); c.fillStyle = "#3a5a8a"; c.fillRect(X(5), Y(.3), .2 * s, .2 * s); // santinho
    c.fillStyle = "#5a3a22"; c.fillRect(X(7.9), Y(4.3), .75 * s, 1.1 * s); c.fillStyle = "rgba(180,210,220,.35)"; c.fillRect(X(7.97), Y(4.38), .6 * s, .4 * s); c.fillRect(X(7.97), Y(4.85), .6 * s, .4 * s); c.fillStyle = "#e8e2d0"; for (let i = 0; i < 4; i++) c.fillRect(X(8.02 + i * .14), Y(4.62), .08 * s, .12 * s); // cristaleira
    c.fillStyle = "#6a8a4a"; c.beginPath(); c.arc(X(.7), Y(5.2), .22 * s, 0, 7); c.fill(); c.fillStyle = "#a8583a"; c.fillRect(X(.55), Y(5.25), .3 * s, .3 * s); // vaso
  }
  if (p.abandonada) { // poeira, pano no móvel, rachaduras, vidro quebrado
    c.fillStyle = "rgba(200,190,170,.06)"; c.fillRect(X(0), Y(0), ROOM.w * s, ROOM.h * s); c.strokeStyle = "rgba(10,6,2,.5)"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(X(1.2), Y(0)); c.lineTo(X(1.5), Y(.4)); c.lineTo(X(1.3), Y(.8)); c.moveTo(X(5.6), Y(0)); c.lineTo(X(5.4), Y(.5)); c.stroke();
    for (let i = 0; i < 12; i++) { c.fillStyle = "rgba(230,220,200,.35)"; c.fillRect(X((i * 1.9 + tm * .02) % ROOM.w), Y(1 + ((i * 1.3 + tm * .03) % (ROOM.h - 1))), 1.5, 1.5); }
    if (A === 0) { c.fillStyle = "rgba(220,215,200,.75)"; c.beginPath(); c.moveTo(X(1.5), Y(2.6)); c.lineTo(X(3.3), Y(2.6)); c.lineTo(X(3.5), Y(3.9)); c.lineTo(X(1.3), Y(3.9)); c.fill(); [[1.75, 2.9], [3, 2.9], [1.75, 3.55], [3, 3.55]].forEach(([px, py]) => { c.fillStyle = "#e8e2d0"; c.beginPath(); c.ellipse(X(px), Y(py), .17 * s, .1 * s, 0, 0, 7); c.fill(); c.fillStyle = "#5a4a2a"; c.beginPath(); c.ellipse(X(px), Y(py), .08 * s, .05 * s, 0, 0, 7); c.fill(); }); // mesa posta abandonada
      if (p.id === "fechada") { c.fillStyle = "#e8d890"; c.fillRect(X(2.1), Y(.12), .42 * s, .55 * s); c.fillRect(X(2.7), Y(.12), .42 * s, .55 * s); c.fillStyle = "#3a3a3a"; c.fillRect(X(2.2), Y(.25), .22 * s, .18 * s); c.fillRect(X(2.8), Y(.25), .22 * s, .18 * s); c.fillStyle = "#a02a2a"; c.fillRect(X(2.1), Y(.14), .42 * s, .06 * s); c.fillRect(X(2.7), Y(.14), .42 * s, .06 * s); } // cartazes de desaparecido
      if (p.id === "prado") { c.fillStyle = "#6a3a2a"; c.fillRect(X(5.5), Y(2.4), .6 * s, .4 * s); c.fillStyle = "#3a5a7a"; c.fillRect(X(6.2), Y(2.3), .5 * s, .5 * s); c.fillStyle = "#c8a050"; c.fillRect(X(5.75), Y(2.36), .1 * s, .06 * s); } } // malas largadas
  }
}

/* =====================================================================
   O ESGOTO DA VILA: um labirinto embaixo da rua nova, e o Tinhoso.
   ===================================================================== */
const ECW = 17, ECH = 12, ECEL = 3, EW = ECW * ECEL + 1, EH = ECH * ECEL + 1; // células de 2x2 com parede de 1
const BUEIRO = { x: 36.2, y: 50.8 };
let ESG = null, CHAO_ESG = null;
const temMapaEsgoto = () => !!ls("roca_mapa_esgoto");
const achadosEsgoto = () => { try { return JSON.parse(ls("roca_esgoto") || "[]"); } catch (e) { return []; } };
const EVID_ESG = {
  carteira: { nome: "A carteira do pai", txt: ["A carteira do meu pai. Molhada, mas é a dele.", "Dentro tem a minha foto da escola... e um papel dobrado: \"Lua nova. Figueira. Não deixa ela ir.\""] },
  riscos: { nome: "Riscos na parede", txt: ["Riscos na parede, contando dias. Muitos. Muitos mesmo.", "Do lado, com a letra do meu pai: \"Marcos esteve aqui. Ela não me deixa subir.\""] },
  jaqueta: { nome: "A jaqueta rasgada", txt: ["A jaqueta jeans do meu pai, a que ele usava pra me levar na escola.", "Rasgada nas costas. Quatro rasgos compridos, retinhos. De garra."] },
  desenho: { nome: "Desenho de carvão", txt: ["Um desenho na parede, feito com carvão. Uma mulher de tranças entregando um menino pra uma coisa de chifres.", "Embaixo: \"1996\". E do lado, mais novo, o mesmo desenho... com uma menina de chapéu."] },
  cofre: { nome: "Latinha do pai", txt: ["Uma latinha de biscoito escondida num cano. Dentro tem moedas, muitas, e um bilhete do meu pai:", "\"Pra caminhonete. Vai embora, filha. Não olha pra trás.\""] } };
function montarEsgoto() {
  let sd = 9091; const r = () => { sd = (sd * 16807) % 2147483647; return (sd - 1) / 2147483646; };
  const sol = Array.from({ length: EH }, () => Array(EW).fill(true)), vis2 = Array.from({ length: ECH }, () => Array(ECW).fill(false));
  const abre = (cx, cy) => { for (let y = 0; y < ECEL - 1; y++) for (let x = 0; x < ECEL - 1; x++) sol[cy * ECEL + 1 + y][cx * ECEL + 1 + x] = false; };
  const liga = (ax, ay, bx, by) => { if (ax === bx) { const y = Math.max(ay, by) * ECEL; for (let x = 0; x < ECEL - 1; x++) sol[y][ax * ECEL + 1 + x] = false; } else { const x = Math.max(ax, bx) * ECEL; for (let y = 0; y < ECEL - 1; y++) sol[ay * ECEL + 1 + y][x] = false; } };
  const pilha = [[0, 0]]; vis2[0][0] = true; abre(0, 0); const viz = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (pilha.length) { const [cx, cy] = pilha[pilha.length - 1], op = viz.map(([dx, dy]) => [cx + dx, cy + dy]).filter(([x, y]) => x >= 0 && y >= 0 && x < ECW && y < ECH && !vis2[y][x]);
    if (!op.length) { pilha.pop(); continue; } const [nx, ny] = op[Math.floor(r() * op.length)]; vis2[ny][nx] = true; abre(nx, ny); liga(cx, cy, nx, ny); pilha.push([nx, ny]); }
  for (let i = 0; i < 26; i++) { const cx = Math.floor(r() * (ECW - 1)), cy = Math.floor(r() * (ECH - 1)); if (r() < .5) liga(cx, cy, cx + 1, cy); else liga(cx, cy, cx, cy + 1); } // alguns atalhos
  // becos sem saída (para as pistas), do mais longe pro mais perto da escada
  const grauDe = (cx, cy) => viz.filter(([dx, dy]) => { const x = cx + dx, y = cy + dy; if (x < 0 || y < 0 || x >= ECW || y >= ECH) return false; return dx ? !sol[cy * ECEL + 1][Math.max(cx, x) * ECEL] : !sol[Math.max(cy, y) * ECEL][cx * ECEL + 1]; }).length;
  const becos = []; for (let cy = 0; cy < ECH; cy++) for (let cx = 0; cx < ECW; cx++) if ((cx || cy) && grauDe(cx, cy) === 1) becos.push({ cx, cy, d: cx + cy * 1.2 + r() * 3 });
  becos.sort((a, b) => b.d - a.d);
  const cel = (cx, cy) => ({ x: cx * ECEL + 2, y: cy * ECEL + 2 });
  const evid = ["cofre", "jaqueta", "desenho", "riscos", "carteira"].map((k, i) => { const b = becos[Math.min(becos.length - 1, i * 3 + (i > 2 ? 2 : 0))]; return { k, ...cel(b.cx, b.cy) }; });
  const usados = new Set(evid.map(e => e.x + "," + e.y));
  const escond = []; becos.forEach((b, i) => { const p = cel(b.cx, b.cy); if (!usados.has(p.x + "," + p.y) && i % 2 === 0) escond.push({ ...p, tipo: "cano" }); });
  for (let i = 0; i < 60 && escond.length < 30; i++) { const cx = Math.floor(r() * ECW), cy = Math.floor(r() * ECH), p = cel(cx, cy); if (cx + cy < 2 || escond.some(e => Math.hypot(e.x - p.x, e.y - p.y) < 6) || usados.has(p.x + "," + p.y)) continue; escond.push({ ...p, x: p.x + (r() < .5 ? -.45 : .45), tipo: r() < .55 ? "barril" : "nicho" }); }
  const ratos = Array.from({ length: 10 }, () => ({ ...cel(Math.floor(r() * ECW), Math.floor(r() * ECH)), f: r() * 9 }));
  ESG = { sol, evid, escond, ratos, escada: { x: 2, y: 1.7 } }; CHAO_ESG = Chao(pintarChaoEsgoto, EW, EH);
}
function pintarChaoEsgoto(g) {
  const P = 32, S2 = ESG.sol;
  g.fillStyle = "#16130f"; g.fillRect(0, 0, EW * P, EH * P);
  for (let y = 0; y < EH; y++) for (let x = 0; x < EW; x++) { if (!vis(x * P + 16, y * P + 16, 48)) continue;
    if (S2[y][x]) { // parede de tijolo
      g.fillStyle = "#3a2e26"; g.fillRect(x * P, y * P, P, P); for (let row = 0; row < 4; row++) for (let k = -1; k < 3; k++) { const bx = x * P + k * 16 + (row % 2) * 8, by = y * P + row * 8; g.fillStyle = ["#6a4e3a", "#5e4432", "#765640"][(x * 7 + y * 3 + row + k) % 3]; g.fillRect(bx + 1, by + 1, 14, 6); }
      if ((x * 13 + y * 7) % 5 === 0) { g.fillStyle = "rgba(60,90,40,.45)"; g.beginPath(); g.ellipse(x * P + 16, y * P + 28, 12, 5, 0, 0, 7); g.fill(); } // limo
    } else { // chão molhado de pedra com canaleta
      g.fillStyle = (x + y) % 2 ? "#3e3a32" : "#433e35"; g.fillRect(x * P, y * P, P, P); g.strokeStyle = "rgba(0,0,0,.35)"; g.lineWidth = 1; g.strokeRect(x * P + .5, y * P + .5, P - 1, P - 1);
      if ((x * 31 + y * 17) % 7 === 0) { g.fillStyle = "rgba(60,80,70,.35)"; g.beginPath(); g.ellipse(x * P + 14, y * P + 18, 10, 5, .3, 0, 7); g.fill(); } // poça
      if ((x * 11 + y * 5) % 9 === 0) { g.fillStyle = "rgba(90,70,40,.4)"; g.fillRect(x * P + 6, y * P + 20, 5, 3); }
      if (S2[y - 1] && S2[y - 1][x]) { g.fillStyle = "rgba(0,0,0,.45)"; g.fillRect(x * P, y * P, P, 7); } // sombra da parede de cima
    } }
  g.fillStyle = "rgba(40,70,60,.5)"; for (let y = 1; y < EH - 1; y++) for (let x = 1; x < EW - 1; x++) if (!S2[y][x] && (x % ECEL === 2 || y % ECEL === 2) && vis(x * P + 16, y * P + 16)) { if (x % ECEL === 2 && !S2[y][x]) g.fillRect(x * P + 13, y * P, 6, P); } // canaleta de água no meio
}
function livreEsgoto(x, y) { const rr = .3; for (const [ox, oy] of [[-rr, 0], [rr, 0], [0, -rr * .5], [0, rr * .5]]) { const tx = Math.floor(x + ox), ty = Math.floor(y + oy); if (ty < 0 || ty >= EH || tx < 0 || tx >= EW || ESG.sol[ty][tx]) return false; } return true; }
function irEsgoto() {
  if (!ESG) montarEsgoto(); R.lugar = "esgoto"; R.predio = null; R.eu.x = ESG.escada.x; R.eu.y = ESG.escada.y + .6; cam.x = R.eu.x; cam.y = R.eu.y; R.fade = 1; R.escondido = null;
  R.tin = { fase: "longe", t: 0, prox: 14, x: 0, y: 0, cam: null, alvo: null, rep: 0 }; S.porta(); tocarRuido(1.2, { filtro: "lowpass", f: 300, vol: .2, wet: .9 }); efeito("O esgoto", "#9ab8a8"); hud();
  if (!ls("roca_esgoto_visto")) { ls("roca_esgoto_visto", 1); setTimeout(() => R && falar(temMapaEsgoto() ? ["Tá escuro e fede. Mas eu tenho o mapa do Seu Valdemar.", "Ele disse: \"Se ouvir casco batendo na pedra, se esconde. Não corre. Ele corre mais.\""] : ["Tá escuro, fede, e é tudo igual. Sem um mapa eu vou me perder aqui embaixo.", "Lá longe, alguma coisa bate casco na pedra. Toc. Toc. Toc."], null, "Yasmin"), 600); }
}
function sairEsgoto() { R.lugar = "vila"; R.predio = null; R.escondido = null; R.tin = null; R.eu.x = BUEIRO.x; R.eu.y = BUEIRO.y + .7; cam.x = R.eu.x; cam.y = R.eu.y; R.fade = 1; S.porta(); hud(); }
function oQueFazerEsgoto() {
  const p = R.eu;
  if (R.escondido) return { t: "Sair do esconderijo", loc: 1, fn: () => { R.escondido = null; tocarRuido(.3, { filtro: "lowpass", f: 500, vol: .1 }); } };
  if (dist(p, ESG.escada) < 1.3) return { t: "Subir", fn: sairEsgoto, loc: 1 };
  const ach = achadosEsgoto(); for (const e of ESG.evid) if (dist(p, e) < 1.1 && !(e.k === "cofre" && R.cofreEsg)) return { t: ach.includes(e.k) && e.k !== "cofre" ? "Olhar de novo" : "Vasculhar", loc: 1, fn: () => pegarEvidEsgoto(e) };
  for (const h of ESG.escond) if (dist(p, h) < 1.05) return { t: h.tipo === "barril" ? "Esconder no barril" : h.tipo === "cano" ? "Entrar no cano" : "Esconder no buraco", loc: 1, fn: () => { R.escondido = h; R.correndo = false; R.lanterna = false; tocarRuido(.25, { filtro: "lowpass", f: 400, vol: .12 }); hud(); } };
  return null;
}
function pegarEvidEsgoto(e) {
  const l = achadosEsgoto(), nova = !l.includes(e.k); if (nova) { l.push(e.k); ls("roca_esgoto", JSON.stringify(l)); }
  if (e.k === "cofre" && !R.cofreEsg) { R.cofreEsg = 1; R.moedas += 150; S.moedas(); efeito("+150 moedas", "#f2c94a"); hud(); }
  falar(EVID_ESG[e.k].txt, () => { if (nova && l.filter(k => EVID_ESG[k]).length === 5) setTimeout(() => R && falar(["O pai tá vivo. Ou tava. Aqui embaixo, preso.", "\"Ela não me deixa subir.\" Ela quem? A vó? A coisa que voltou no lugar da vó?", "Eu preciso sair daqui. Agora."], null, "Yasmin"), 300); }, "Yasmin");
  if (nova) { tocarTom(70, 1.4, { vol: .2, ate: 40 }); }
}
// visão do Tinhoso: enxerga você em linha reta pelo corredor, e ouve quando você corre
function linhaLivre(a, b) { const d = dist(a, b), n = Math.ceil(d * 3); for (let i = 1; i < n; i++) { const x = mix(a.x, b.x, i / n), y = mix(a.y, b.y, i / n); if (ESG.sol[Math.floor(y)][Math.floor(x)]) return false; } return true; }
function caminhoEsg(a, b) { // busca em largura a partir do alvo; devolve o próximo ladrilho do caminho
  const sx = Math.floor(a.x), sy = Math.floor(a.y), tx = Math.floor(b.x), ty = Math.floor(b.y); if (sx === tx && sy === ty) return b;
  if (ty < 0 || tx < 0 || ty >= EH || tx >= EW || ESG.sol[ty][tx]) return null;
  const prev = new Int32Array(EW * EH).fill(-1), ini = sy * EW + sx, q = [ty * EW + tx]; prev[q[0]] = q[0];
  for (let h = 0; h < q.length; h++) { const i = q[h]; if (i === ini) break; const x = i % EW, y = (i / EW) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= EW || ny >= EH || ESG.sol[ny][nx]) continue; const j = ny * EW + nx; if (prev[j] < 0) { prev[j] = i; q.push(j); } } }
  if (prev[ini] < 0) return null; const j = prev[ini]; return { x: (j % EW) + .5, y: ((j / EW) | 0) + .5 };
}
function atualizarEsgoto(dt) {
  const T = R.tin; if (!T || R.morto) return;
  T.t += dt; const eu = R.eu, esc = R.escondido;
  if (T.fase === "longe") { T.prox -= dt; if (T.prox > 0) return; // aparece longe, num beco
    const op = ESG.escond.filter(h => dist(h, eu) > 16); const h = op[Math.floor(Math.random() * op.length)] || { x: EW - 3, y: EH - 3 }; Object.assign(T, { fase: "ronda", t: 0, x: h.x, y: h.y, alvo: null }); S.cascos && S.cascos(T.x, T.y); return; }
  const d = dist(T, eu), ve = !esc && d < 10 && linhaLivre(T, eu), ouve = !esc && (d < 3.2 || (R.correndo && d < 7));
  if (T.fase === "ronda" || T.fase === "fareja") {
    if (ve || ouve) { T.fase = "caca"; T.t = 0; T.cam = null; S.gritoTinhoso && S.gritoTinhoso(T.x, T.y); R.tremor = .5; efeito("Ele te viu. CORRE E SE ESCONDE!", "#e2483d"); }
    else if (T.fase === "fareja" && T.t > 4.5) { T.fase = "ronda"; T.alvo = null; }
    else { if (!T.alvo || dist(T, T.alvo) < .4) { if (T.fase === "fareja") T.alvo = { x: T.fx + rnd(-1.5, 1.5), y: T.fy + rnd(-1.5, 1.5) }; else { const cx = Math.floor(Math.random() * ECW), cy = Math.floor(Math.random() * ECH); T.alvo = Math.random() < .35 ? { x: eu.x + rnd(-6, 6), y: eu.y + rnd(-6, 6) } : { x: cx * ECEL + 2, y: cy * ECEL + 2 }; T.alvo.x = cl(T.alvo.x, 1.5, EW - 1.5); T.alvo.y = cl(T.alvo.y, 1.5, EH - 1.5); } }
      T.rep -= dt; if (T.rep <= 0 || !T.prox2) { T.rep = .35; T.prox2 = caminhoEsg(T, T.alvo); if (!T.prox2) T.alvo = null; } andarTin(T, T.prox2, T.fase === "fareja" ? 1.6 : 2.3, dt); }
  } else if (T.fase === "caca") {
    if (esc) { T.fase = "fareja"; T.t = 0; T.fx = esc.x; T.fy = esc.y; T.alvo = null; efeito("Não respira...", "#c8c2b4"); }
    else { T.rep -= dt; if (T.rep <= 0 || !T.prox2) { T.rep = .25; T.prox2 = caminhoEsg(T, eu); } andarTin(T, T.prox2, 4.25, dt);
      if (!ve && T.t > 1 && d > 11) { T.fase = "ronda"; T.alvo = null; efeito("Ele perdeu você de vista.", "#c8c2b4"); }
      if (d < .75) pegoTinhoso(); }
  }
  // passos de casco, respiração e o coração
  T.passo = (T.passo || 0) - dt; if (T.passo <= 0) { T.passo = T.fase === "caca" ? .22 : .5; const [v, pn] = somEm(T.x, T.y); if (v > .02) { tocarRuido(.05, { filtro: "bandpass", f: 900, q: 3, vol: .25 * v, pan: pn }); tocarTom(140, .06, { vol: .08 * v, ate: 90, pan: pn }); } }
  if (d < 8) { R.coracao = (R.coracao || 0) - dt; if (R.coracao <= 0) { R.coracao = .25 + d * .09; tocarTom(55, .12, { vol: .22 * (1 - d / 8), ate: 40 }); tocarTom(50, .1, { vol: .16 * (1 - d / 8), ate: 35, quando: .14 }); } }
  if (Math.random() < dt * .25) { const [v, pn] = somEm(T.x, T.y); if (v > .05) tocarTom(rnd(70, 95), 1.2, { tipo: "sawtooth", vol: .05 * v, ate: 50, lp: 500, pan: pn, wet: .7 }); } // respiração rouca
}
function andarTin(T, alvo, v, dt) { if (!alvo) return; const dd = dist(T, alvo); if (dd < .02) return; const k = Math.min(1, v * dt / dd); T.dir = alvo.x > T.x ? 1 : alvo.x < T.x ? -1 : T.dir; T.x += (alvo.x - T.x) * k; T.y += (alvo.y - T.y) * k; T.fase2 = (T.fase2 || 0) + dt * v * 2.4; }
function pegoTinhoso() {
  if (R.online) { R.tin = null; R.moedas = Math.floor(R.moedas * .7); R.susto = 1.1; R.rostoPoco = 0; R.morto = null; S.susto(); R.tremor = 1; sairEsgoto(); R.tin = null; efeito("O Tinhoso te arrastou pra fora e levou suas moedas", "#e2483d"); setTimeout(() => R && falar(["Eu acordei na rua, do lado do bueiro. Com a roupa toda arranhada.", "Ele podia ter me levado. Não levou. Ainda não é a hora, foi o que ele sussurrou."], null, "Yasmin"), 1400); hud(); return; }
  morrer("tinhoso", "O Tinhoso te pegou no escuro do esgoto. Ele era mais rápido, e você não se escondeu a tempo.", "No esgoto, não dá pra fugir correndo: quando ele te ver, corra até o esconderijo mais perto (barril, cano ou buraco) e fique quieta até ele ir embora. O Seu Valdemar tem um mapa.");
}
function desenharTinhoso(T, tm) {
  const x = PX(T.x), y = PY(T.y); if (!naTela(x, y, 300)) return; const s = TS * 1.7, f = T.fase2 || 0, an = Math.sin(f), d = T.dir || 1, caca = T.fase === "caca";
  sombra(x, y, s * .4, s * .1, .6); c.save(); c.translate(x, y); c.scale(d, 1);
  // pernas de bode com cascos
  [[-1, an], [1, -an]].forEach(([l, a]) => { c.fillStyle = "#2a0e0c"; c.save(); c.translate(l * s * .09, -s * .55); c.rotate(a * .35); c.beginPath(); c.moveTo(-s * .05, 0); c.lineTo(s * .05, 0); c.lineTo(s * .07, s * .25); c.lineTo(-s * .02, s * .32); c.lineTo(s * .02, s * .55); c.lineTo(-s * .05, s * .55); c.lineTo(-s * .1, s * .3); c.fill(); c.fillStyle = "#0a0404"; c.fillRect(-s * .06, s * .52, s * .1, s * .05); c.restore(); });
  // rabo com ponta
  c.strokeStyle = "#1e0806"; c.lineWidth = s * .025; c.beginPath(); c.moveTo(-s * .1, -s * .6); c.bezierCurveTo(-s * .45, -s * .55 + Math.sin(tm * 3) * s * .05, -s * .35, -s * .2, -s * .55, -s * .15 + Math.sin(tm * 3) * s * .08); c.stroke(); c.fillStyle = "#1e0806"; c.beginPath(); c.moveTo(-s * .55, -s * .22 + Math.sin(tm * 3) * s * .08); c.lineTo(-s * .65, -s * .12 + Math.sin(tm * 3) * s * .08); c.lineTo(-s * .5, -s * .08 + Math.sin(tm * 3) * s * .08); c.fill();
  // tronco magro e curvado, costelas
  c.save(); c.rotate(.18); const tg = c.createLinearGradient(0, -s * 1.25, 0, -s * .55); tg.addColorStop(0, "#4a1410"); tg.addColorStop(1, "#2a0a08"); c.fillStyle = tg; c.beginPath(); c.moveTo(-s * .14, -s * .55); c.quadraticCurveTo(-s * .2, -s * .95, -s * .1, -s * 1.22); c.lineTo(s * .14, -s * 1.22); c.quadraticCurveTo(s * .2, -s * .9, s * .12, -s * .55); c.fill();
  c.strokeStyle = "rgba(10,2,2,.65)"; c.lineWidth = Math.max(1, s * .012); for (let i = 0; i < 5; i++) { const yy = -s * (.75 + i * .085); c.beginPath(); c.moveTo(-s * .13, yy); c.quadraticCurveTo(0, yy + s * .04, s * .13, yy); c.stroke(); }
  c.fillStyle = "rgba(120,20,10,.35)"; c.beginPath(); c.ellipse(s * .05, -s * .62, s * .05, s * .02, 0, 0, 7); c.fill();
  // braços compridos com garras arrastando
  [[-1, -an], [1, an]].forEach(([l, a]) => { c.save(); c.translate(l * s * .13, -s * 1.15); c.rotate(l * .15 + a * .25 + (caca ? -.5 * l : 0)); c.strokeStyle = "#3a0e0a"; c.lineWidth = s * .045; c.lineCap = "round"; c.beginPath(); c.moveTo(0, 0); c.lineTo(l * s * .06, s * .38); c.lineTo(l * s * .03, s * .74); c.stroke(); c.strokeStyle = "#d8ccb0"; c.lineWidth = Math.max(1, s * .012); for (let k = -1; k <= 1; k++) { c.beginPath(); c.moveTo(l * s * .03, s * .74); c.quadraticCurveTo(l * s * .03 + k * s * .05, s * .84, l * s * .05 + k * s * .07, s * .9); c.stroke(); } c.restore(); });
  // cabeça de bode-caveira, chifres enormes
  c.translate(s * .02, -s * 1.3); c.fillStyle = "#c8bca0"; c.beginPath(); c.moveTo(-s * .1, -s * .08); c.quadraticCurveTo(-s * .12, s * .1, -s * .04, s * .2); c.lineTo(s * .06, s * .2); c.quadraticCurveTo(s * .14, s * .08, s * .1, -s * .08); c.quadraticCurveTo(0, -s * .15, -s * .1, -s * .08); c.fill(); c.fillStyle = "rgba(60,30,20,.4)"; c.fillRect(-s * .02, s * .04, s * .04, s * .12);
  for (const l of [-1, 1]) { c.strokeStyle = "#1a1210"; c.lineWidth = s * .05; c.lineCap = "round"; c.beginPath(); c.moveTo(l * s * .06, -s * .08); c.bezierCurveTo(l * s * .3, -s * .3, l * s * .32, -s * .55, l * s * .12, -s * .62); c.stroke(); c.strokeStyle = "rgba(255,255,255,.15)"; c.lineWidth = s * .012; for (let k = 0; k < 5; k++) { c.beginPath(); c.arc(l * s * (.16 + k * .03), -s * (.2 + k * .08), s * .03, 0, PI); c.stroke(); } }
  c.fillStyle = "#050000"; c.beginPath(); c.ellipse(-s * .05, -s * .01, s * .035, s * .03, 0, 0, 7); c.ellipse(s * .05, -s * .01, s * .035, s * .03, 0, 0, 7); c.fill();
  const brilho = .7 + .3 * Math.sin(tm * 8); c.fillStyle = `rgba(255,${caca ? 30 : 70},10,${brilho})`; c.beginPath(); c.arc(-s * .05, -s * .01, s * .016, 0, 7); c.arc(s * .05, -s * .01, s * .016, 0, 7); c.fill();
  c.fillStyle = "#1a0404"; c.beginPath(); c.ellipse(0, s * .17, s * .05, s * .03 + (caca ? s * .02 * Math.abs(Math.sin(tm * 9)) : 0), 0, 0, 7); c.fill(); c.fillStyle = "#e8dcc0"; for (let k = -2; k <= 2; k++) { c.beginPath(); c.moveTo(k * s * .018 - s * .007, s * .15); c.lineTo(k * s * .018, s * .19); c.lineTo(k * s * .018 + s * .007, s * .15); c.fill(); }
  c.restore(); c.restore();
}
function desenharEsgoto(tm) {
  if (!ESG) montarEsgoto();
  const alvoC = R.eu; cam.x += (alvoC.x - cam.x) * .14; cam.y += (alvoC.y - .4 - cam.y) * .14; cam.x = cl(cam.x, W / TS / 2, EW - W / TS / 2); cam.y = cl(cam.y, H / TS / 2, EH - H / TS / 2);
  if (R.tremor > 0) { cam.x += rnd(-.05, .05); cam.y += rnd(-.05, .05); }
  c.fillStyle = "#0a0806"; c.fillRect(0, 0, W, H); desenharChaoChunks(CHAO_ESG);
  // água correndo na canaleta
  c.fillStyle = "rgba(120,160,150,.12)"; for (let i = 0; i < 40; i++) { const x = PX(((i * 7.13) % (EW - 2)) + 1), y = PY(((i * 3.7 + tm * .6) % (EH - 2)) + 1); c.fillRect(x, y, 2, 6); }
  const obj = [];
  // canos nas paredes de cima, grades, escada
  for (let y = 1; y < EH - 1; y++) for (let x = 1; x < EW - 1; x++) { if (!ESG.sol[y][x] || ESG.sol[y + 1][x]) continue; const sx = PX(x), sy = PY(y); if (sx < -TS || sx > W + TS || sy < -TS || sy > H + TS) continue; if ((x * 7 + y * 3) % 4 === 0) obj.push([y + .99, () => { c.fillStyle = "#5a5a52"; c.fillRect(sx, sy + TS * .45, TS, TS * .16); c.fillStyle = "rgba(255,255,255,.12)"; c.fillRect(sx, sy + TS * .46, TS, TS * .04); c.fillStyle = "#4a4a44"; c.fillRect(sx + TS * .45, sy + TS * .4, TS * .1, TS * .26); }]); if ((x * 5 + y * 11) % 13 === 0) obj.push([y + .99, () => { const f = (tm * .8 + x) % 1; c.fillStyle = `rgba(150,180,170,${.7 * (1 - f)})`; c.fillRect(sx + TS * .6, sy + TS * .9 + f * TS * .5, 2, 4); }]); }
  { const e = ESG.escada; obj.push([e.y + .3, () => { const x = PX(e.x), y = PY(e.y); c.fillStyle = "rgba(200,220,200,.16)"; c.beginPath(); c.moveTo(x - TS * .5, y - TS * 1.5); c.lineTo(x + TS * .5, y - TS * 1.5); c.lineTo(x + TS * 1, y + TS * .5); c.lineTo(x - TS * 1, y + TS * .5); c.fill(); c.strokeStyle = "#7a7a70"; c.lineWidth = 3; c.beginPath(); c.moveTo(x - TS * .3, y - TS * 1.4); c.lineTo(x - TS * .3, y + TS * .2); c.moveTo(x + TS * .3, y - TS * 1.4); c.lineTo(x + TS * .3, y + TS * .2); for (let i = 0; i < 6; i++) { c.moveTo(x - TS * .3, y - TS * 1.3 + i * TS * .26); c.lineTo(x + TS * .3, y - TS * 1.3 + i * TS * .26); } c.stroke(); }]); }
  const ach = achadosEsgoto();
  ESG.evid.forEach(e => obj.push([e.y, () => { const x = PX(e.x), y = PY(e.y); if (!naTela(x, y)) return; const ja = ach.includes(e.k);
    if (e.k === "carteira") { c.fillStyle = "#4a2a14"; c.fillRect(x - TS * .14, y - TS * .1, TS * .28, TS * .18); c.fillStyle = "#e8dcc0"; c.fillRect(x - TS * .08, y - TS * .14, TS * .14, TS * .06); }
    else if (e.k === "jaqueta") { c.fillStyle = "#3a5a8a"; c.beginPath(); c.moveTo(x - TS * .35, y - TS * .25); c.lineTo(x + TS * .35, y - TS * .25); c.lineTo(x + TS * .3, y + TS * .1); c.lineTo(x - TS * .3, y + TS * .1); c.fill(); c.strokeStyle = "#1a0a06"; c.lineWidth = 2; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(x - TS * .2 + i * TS * .12, y - TS * .22); c.lineTo(x - TS * .15 + i * TS * .12, y + TS * .06); c.stroke(); } }
    else if (e.k === "riscos" || e.k === "desenho") { const wy = y - TS * 1.1; c.strokeStyle = "rgba(230,225,210,.6)"; c.lineWidth = 1.5; if (e.k === "riscos") for (let i = 0; i < 14; i++) { const gx = x - TS * .5 + (i % 7) * TS * .14, gy = wy + Math.floor(i / 7) * TS * .28; c.beginPath(); c.moveTo(gx, gy); c.lineTo(gx, gy + TS * .22); c.stroke(); if (i % 5 === 4) { c.beginPath(); c.moveTo(gx - TS * .5, gy + TS * .18); c.lineTo(gx + .05 * TS, gy + .04 * TS); c.stroke(); } } else { c.strokeStyle = "rgba(20,14,10,.9)"; c.lineWidth = 2; c.beginPath(); c.arc(x - TS * .3, wy, TS * .08, 0, 7); c.moveTo(x - TS * .3, wy + TS * .08); c.lineTo(x - TS * .3, wy + TS * .35); c.moveTo(x + TS * .3, wy - TS * .2); c.lineTo(x + TS * .2, wy - TS * .35); c.moveTo(x + TS * .3, wy - TS * .2); c.lineTo(x + TS * .4, wy - TS * .35); c.arc(x + TS * .3, wy - TS * .1, TS * .1, 0, 7); c.moveTo(x + TS * .3, wy); c.lineTo(x + TS * .3, wy + TS * .35); c.moveTo(x, wy + TS * .1); c.arc(x, wy + TS * .1, TS * .05, 0, 7); c.stroke(); } }
    else if (e.k === "cofre" && !R.cofreEsg) { c.fillStyle = "#3a5a8a"; c.fillRect(x - TS * .16, y - TS * .22, TS * .32, TS * .24); c.fillStyle = "#c8a050"; c.fillRect(x - TS * .16, y - TS * .24, TS * .32, TS * .05); }
    if (!ja) { c.fillStyle = `rgba(242,201,74,${.35 + .3 * Math.sin(tm * 3 + e.x)})`; c.beginPath(); c.arc(x, y - TS * .45, 3, 0, 7); c.fill(); } }]));
  ESG.escond.forEach(h => obj.push([h.y, () => { const x = PX(h.x), y = PY(h.y); if (!naTela(x, y)) return; const dentro = R.escondido === h;
    if (h.tipo === "barril") { sombra(x, y, TS * .3, TS * .08); c.fillStyle = "#5a3a1e"; c.fillRect(x - TS * .28, y - TS * .75, TS * .56, TS * .75); c.fillStyle = "#3a3a3a"; c.fillRect(x - TS * .3, y - TS * .62, TS * .6, TS * .06); c.fillRect(x - TS * .3, y - TS * .2, TS * .6, TS * .06); c.fillStyle = "#2a1a0e"; c.beginPath(); c.ellipse(x, y - TS * .75, TS * .28, TS * .08, 0, 0, 7); c.fill(); if (dentro) { c.fillStyle = "rgba(240,240,230,.9)"; c.fillRect(x - TS * .06, y - TS * .78, 2, 2); c.fillRect(x + TS * .04, y - TS * .78, 2, 2); } }
    else if (h.tipo === "cano") { c.fillStyle = "#4a4a44"; c.beginPath(); c.arc(x, y - TS * .35, TS * .42, 0, 7); c.fill(); c.fillStyle = "#0a0a08"; c.beginPath(); c.arc(x, y - TS * .35, TS * .32, 0, 7); c.fill(); c.strokeStyle = "rgba(255,255,255,.12)"; c.lineWidth = 2; c.beginPath(); c.arc(x, y - TS * .35, TS * .38, PI * 1.1, PI * 1.7); c.stroke(); if (dentro) { c.fillStyle = "rgba(240,240,230,.9)"; c.fillRect(x - TS * .06, y - TS * .4, 2, 2); c.fillRect(x + TS * .04, y - TS * .4, 2, 2); } }
    else { c.fillStyle = "#14100c"; c.fillRect(x - TS * .32, y - TS * .9, TS * .64, TS * .85); c.strokeStyle = "#5a4232"; c.lineWidth = 3; c.strokeRect(x - TS * .32, y - TS * .9, TS * .64, TS * .85); c.strokeStyle = "#6a6a62"; c.lineWidth = 2; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(x - TS * .24 + i * TS * .16, y - TS * .88); c.lineTo(x - TS * .24 + i * TS * .16, y - TS * .08); c.stroke(); } if (dentro) { c.fillStyle = "rgba(240,240,230,.9)"; c.fillRect(x - TS * .06, y - TS * .55, 2, 2); c.fillRect(x + TS * .04, y - TS * .55, 2, 2); } } }]));
  ESG.ratos.forEach(rt => obj.push([rt.y, () => { const x = PX(rt.x + Math.sin(tm * .7 + rt.f) * .8), y = PY(rt.y + .3); if (!naTela(x, y)) return; c.fillStyle = "#3a3430"; c.beginPath(); c.ellipse(x, y, TS * .1, TS * .05, 0, 0, 7); c.fill(); c.strokeStyle = "#5a4a44"; c.lineWidth = 1; c.beginPath(); c.moveTo(x - TS * .1, y); c.quadraticCurveTo(x - TS * .2, y - TS * .05, x - TS * .25, y + TS * .02); c.stroke(); c.fillStyle = "#e82020"; c.fillRect(x + TS * .07, y - TS * .02, 1.5, 1.5); }]));
  const ou = R.outro; if (ou && ou.lugar === "esgoto") obj.push([ou.eu.y, () => desenharVoce(PX(ou.eu.x), PY(ou.eu.y), tm, { q: ou, nome: R.online === "host" ? "Amigo(a)" : "Yasmin" })]);
  if (R.tin && R.tin.fase !== "longe") obj.push([R.tin.y, () => desenharTinhoso(R.tin, tm)]);
  if (!R.escondido) obj.push([R.eu.y, () => desenharVoce(PX(R.eu.x), PY(R.eu.y), tm)]);
  obj.sort((a, b) => a[0] - b[0]).forEach(o => o[1]());
  // escuridão total, só a lanterna
  const lw = luzCv.width, lh = luzCv.height, k = lw / W; lc.setTransform(1, 0, 0, 1, 0, 0); lc.globalCompositeOperation = "source-over"; lc.clearRect(0, 0, lw, lh); lc.fillStyle = "rgba(1,2,2,.93)"; lc.fillRect(0, 0, lw, lh); lc.globalCompositeOperation = "destination-out";
  const furo = (x, y, r, f = 1) => { const g = lc.createRadialGradient(x * k, y * k, 0, x * k, y * k, r * k); g.addColorStop(0, `rgba(0,0,0,${f})`); g.addColorStop(1, "rgba(0,0,0,0)"); lc.fillStyle = g; lc.fillRect((x - r) * k, (y - r) * k, r * 2 * k, r * 2 * k); };
  const ex = PX(R.eu.x), ey = PY(R.eu.y) - TS * .4; furo(ex, ey, TS * (R.escondido ? 1.3 : R.lanterna ? (R.lanternaBoa ? 5.4 : 4.6) : 3) * (1 + Math.sin(tm * 9) * .01), R.lanterna ? 1 : .85);
  furo(PX(ESG.escada.x), PY(ESG.escada.y) - TS, TS * 2.2, .55); if (ou && ou.lugar === "esgoto") furo(PX(ou.eu.x), PY(ou.eu.y) - TS * .4, TS * 2.4, .8);
  c.drawImage(luzCv, 0, 0, W, H);
  if (R.tin && R.tin.fase !== "longe") { const x = PX(R.tin.x), y = PY(R.tin.y) - TS * 2.2, a = .55 + .35 * Math.sin(tm * 8); c.fillStyle = `rgba(255,40,10,${a})`; c.beginPath(); c.arc(x - TS * .09, y, 2.5, 0, 7); c.arc(x + TS * .09, y, 2.5, 0, 7); c.fill(); } // os olhos brilham no escuro
  if (R.escondido) { c.fillStyle = "rgba(0,0,0,.55)"; c.fillRect(0, 0, W, H); c.fillStyle = "#000"; for (let i = 0; i < 9; i++) c.fillRect(0, i * H / 9, W, H / 9 * .62); c.fillStyle = "rgba(240,230,210,.75)"; c.font = `600 ${Math.round(Math.max(13, H * .028))}px "JetBrains Mono", monospace`; c.textAlign = "center"; c.fillText(R.tin && R.tin.fase === "fareja" ? "Ele está farejando aqui perto. Não se mexe." : "Escondida. Saia quando ficar quieto.", W / 2, H * .9); c.textAlign = "start"; }
  if (temMapaEsgoto()) desenharMapaEsgoto(tm);
}
function desenharMapaEsgoto(tm) { // o mapa do Seu Valdemar, no canto da tela
  const u = Math.max(2, Math.min(W * .22 / EW, H * .3 / EH)), mw = EW * u, mh = EH * u, x0 = W - mw - 14, y0 = 62;
  c.fillStyle = "rgba(232,220,190,.9)"; c.fillRect(x0 - 6, y0 - 6, mw + 12, mh + 12); c.strokeStyle = "#3a2410"; c.lineWidth = 2; c.strokeRect(x0 - 6, y0 - 6, mw + 12, mh + 12);
  c.fillStyle = "rgba(90,60,30,.85)"; for (let y = 0; y < EH; y++) for (let x = 0; x < EW; x++) if (ESG.sol[y][x]) c.fillRect(x0 + x * u, y0 + y * u, u + .3, u + .3);
  c.fillStyle = "#2a7a2a"; c.fillRect(x0 + ESG.escada.x * u - 2, y0 + ESG.escada.y * u - 2, 5, 5);
  const ach = achadosEsgoto(); ESG.evid.forEach(e => { if (ach.includes(e.k) && e.k !== "cofre") return; c.strokeStyle = "#c8281e"; c.lineWidth = 1.5; const ex = x0 + e.x * u, ey = y0 + e.y * u; c.beginPath(); c.moveTo(ex - 3, ey - 3); c.lineTo(ex + 3, ey + 3); c.moveTo(ex + 3, ey - 3); c.lineTo(ex - 3, ey + 3); c.stroke(); });
  if (Math.sin(tm * 6) > -.3) { c.fillStyle = "#e2483d"; c.beginPath(); c.arc(x0 + R.eu.x * u, y0 + R.eu.y * u, 3.2, 0, 7); c.fill(); }
  c.fillStyle = "#3a2410"; c.font = `700 ${Math.round(Math.max(10, u * 4))}px "JetBrains Mono", monospace`; c.fillText("MAPA DO VALDEMAR", x0, y0 + mh + 18);
}

const NPISTAS = NPCS.filter(n => n.pista).length;
/* ---------- missões secundárias ---------- */
const somaPeixes = () => Object.values(R.peixes).reduce((a, b) => a + b, 0);
const MISSOES = {
  cartas: { npc: "arlindo", titulo: "Cartas sem dono", premio: "Botas de couro (mais velocidade) e 20 moedas",
    pede: ["Me faz um favor? Tem três cartas velhas que eu nunca tive coragem de entregar.", "Uma pra Dona Zuleica, uma pro Delegado Ramos e uma pra Dona Cida. São todas da sua vó, de 1996.", "Entrega pra mim? Te dou as minhas botas de couro. Correm que é uma beleza."],
    lembra: "Ainda faltam cartas: Dona Zuleica, Delegado Ramos e Dona Cida.", feito: ["Entregou todas? Então eles leram.", "Toma as botas. E vinte moedas. Se alguém perguntar o que tinha nas cartas, diga que você não leu."],
    falta: () => `${((R.mprog.cartas) || []).length}/3 cartas entregues`, pode: () => ((R.mprog.cartas) || []).length >= 3, consome: () => {}, da: () => { R.vel += .35; R.moedas += 20; } },
  merenda: { npc: "helena", titulo: "Merenda da escola", premio: "Apito de ferro (o lobisomem desiste mais rápido)",
    pede: ["A merenda acabou. A prefeitura não manda nada desde 2016.", "Me traz cinco laranjas do pomar do sítio? Eu te dou o meu apito. É de ferro. O cachorro preto da sua vó odeia esse som."],
    lembra: "Cinco laranjas, querida. Do pomar do sítio.", feito: ["Laranja do pomar da Benedita... elas nunca apodrecem, sabia?", "Toma o apito. Se aquele cachorro virar bicho, ele desiste bem mais rápido."],
    falta: () => `${R.extra.laranja || 0}/5 laranjas`, pode: () => (R.extra.laranja || 0) >= 5, consome: () => { R.extra.laranja -= 5; }, da: () => { R.apito = true; } },
  egua: { npc: "juvencio", titulo: "A égua do Juvêncio", premio: "Uma peça da caminhonete",
    pede: ["Minha égua, a Estrela, só come milho do sítio. O daqui ela cospe.", "Me traz dez milhos? Em troca eu te dou uma peça da caminhonete. Das boas."],
    lembra: "Dez milhos, menina. A Estrela tá ficando magra. E nervosa.", feito: ["(Lá no fundo da oficina, alguma coisa come o milho. Você nunca vê a égua. Só ouve.)", "Trato é trato. Toma a peça. Instala na caminhonete e some daqui."],
    falta: () => `${R.colheita.milho || 0}/10 milhos`, pode: () => (R.colheita.milho || 0) >= 10, consome: () => { R.colheita.milho -= 10; }, da: () => { if (R.pecas < 3) R.pecas++; else R.moedas += 80; } },
  peixe: { npc: "tonho", titulo: "Sopa da pensão", premio: "Isca boa (o peixe morde rápido) e 15 moedas",
    pede: ["A sopa da pensão é de peixe. E o lago do sítio é o único que ainda tem peixe por aqui.", "Me traz três peixes? Te dou uma isca que faz o peixe morder na hora. E umas moedas."],
    lembra: "Três peixes do lago do sítio. Qualquer um serve.", feito: ["Peixe do lago da Benedita... ainda se mexendo. Ótimo.", "Toma a isca boa e quinze moedas. E não coma nada que você pescar depois das seis."],
    falta: () => `${somaPeixes()}/3 peixes`, pode: () => somaPeixes() >= 3, consome: () => { let n = 3; for (const k of Object.keys(R.peixes)) { const t = Math.min(n, R.peixes[k]); R.peixes[k] -= t; n -= t; if (!R.peixes[k]) delete R.peixes[k]; } }, da: () => { R.isca = true; R.moedas += 15; } },
  flores: { npc: "eulalia", titulo: "Flores para o Tobias", premio: "Medalha de Santa Luzia (a Pernuda demora mais para te notar)",
    pede: ["Leva estas flores pro túmulo do Tobias, no cemitério da vila? É o da cruz torta, perto do portão.", "Eu não consigo mais ir. Toda vez que eu vou, ele me pede pra ficar.", "Faz isso e eu te dou a medalhinha de Santa Luzia que era dele. Ela engana os olhos das coisas que procuram a gente."],
    lembra: "As flores, menina. No túmulo da cruz torta, perto do portão do cemitério.", feito: ["Ele recebeu? ...Eu sei que recebeu. A xícara amanheceu cheia hoje.", "Toma a medalhinha. Com ela, a coisa alta do sítio demora mais pra te enxergar."],
    falta: () => R.mprog.flores ? "flores entregues" : "levar as flores ao túmulo da cruz torta", pode: () => !!R.mprog.flores, consome: () => {}, da: () => { R.medalha = true; } },
  novelo: { npc: "nena", titulo: "Cadê o Novelo?", premio: "Guizo da Sombrinha (ela traz coisas mais rápido)",
    pede: ["O Novelo sumiu. Meu gatinho cinza. Ele sempre foge pro mesmo lugar: a tapera caída na estrada do sítio.", "Me traz ele? Te dou o guizo da coleira da mãe dele. A Sombrinha vai adorar: com ele ela traz as coisas bem mais rápido."],
    lembra: "O Novelo, menina. Na tapera caída da estrada. Não fala alto: ele se assusta. E outras coisas acordam.", feito: ["Novelo! Você tá gelado... e com cheiro de terra.", "Toma o guizo. Põe na Sombrinha. Gato com guizo ninguém pega de surpresa."],
    falta: () => R.mprog.novelo ? "o Novelo está com você" : "procurar o Novelo na tapera da estrada", pode: () => !!R.mprog.novelo, consome: () => {}, da: () => { R.guizo = true; } },
  mel: { npc: "cida", titulo: "Mel para os remédios", premio: "Garrafada e ramo de arruda",
    pede: ["Meus remédios precisam de mel. Mel de verdade, das colmeias do sítio.", "Me traz três potes e eu te dou uma garrafada e um ramo de arruda, de graça."],
    lembra: "Três potes de mel das colmeias do sítio, depois do riacho.", feito: ["Mel da Benedita. Ela conversava com as abelhas, sabia? Elas respondiam.", "Toma a garrafada e a arruda. Que Santa Luzia te guarde."],
    falta: () => `${R.extra.mel || 0}/3 potes de mel`, pode: () => (R.extra.mel || 0) >= 3, consome: () => { R.extra.mel -= 3; }, da: () => { R.garrafada = 1; R.arruda = true; } } };
MISSOES.mapa = { npc: "valdemar", titulo: "O mapa do esgoto", premio: "O mapa do esgoto (mostra o labirinto e onde estão as coisas)",
  pede: ["Você quer descer no esgoto? Ficou doida, menina?", "...Tá bom. Eu tenho o mapa. Desenhei quando trabalhava lá embaixo. Mas não dou de graça.", "Me traz três feixes de lenha do sítio e um balde de leite. Meu fogão tá frio e eu não tomo café puro."],
  lembra: "Três feixes de lenha e um balde de leite. A lenha você racha no sítio, e o leite é da vaca da sua vó.", feito: ["Lenha boa. Leite gordo. A Mimosa ainda tá viva, então.", "Toma o mapa. O bueiro é aquele da rua de baixo. Se ouvir casco... se esconde. Não corre."],
  falta: () => `${R.extra.lenha || 0}/3 lenha · ${R.extra.leite || 0}/1 leite`, pode: () => (R.extra.lenha || 0) >= 3 && (R.extra.leite || 0) >= 1, consome: () => { R.extra.lenha -= 3; R.extra.leite -= 1; }, da: () => { ls("roca_mapa_esgoto", 1); } };

const CARTA_FALAS = { zuleica: "(Ela lê a carta e esconde no bolso do avental.) Ela pediu desculpas. Por uma coisa que eu nunca vou contar.", ramos: "(Ele lê e risca alguma coisa na lista.) A letra é dela. Mas a data... essa carta foi escrita depois que ela voltou da mata.", cida: "(Ela beija a carta.) Benedita, sua teimosa. Você sabia que ia ter que voltar pra lá." };
function aplicarMissao(id, op, alvo) { // roda no anfitrião (ou sozinha)
  const m = MISSOES[id]; if (!m) return; R.missoes = R.missoes || {}; R.mprog = R.mprog || {};
  if (op === "aceitar" && !R.missoes[id]) { R.missoes[id] = "ativa"; R.mprog[id] = id === "cartas" ? [] : 0; }
  else if (op === "prog" && R.missoes[id] === "ativa") { if (id === "cartas") { if (!R.mprog.cartas.includes(alvo) && CARTA_FALAS[alvo]) R.mprog.cartas.push(alvo); } else R.mprog[id] = 1; }
  else if (op === "entregar" && R.missoes[id] === "ativa" && m.pode()) { m.consome(); m.da(); R.missoes[id] = "feita"; S.moedas(); }
  hud();
}
function missaoOp(id, op, alvo) { if (R.online === "guest") enviar({ t: "missao", id, op, alvo }); else aplicarMissao(id, op, alvo); }

const pistas = () => { try { return JSON.parse(ls("roca_pistas") || "{}"); } catch (e) { return {}; } };
function ganharPista(n) { const p = pistas(); if (p[n.pista[1]]) return; p[n.pista[1]] = n.pista[2]; ls("roca_pistas", JSON.stringify(p)); efeito(`Pista nova no diário (${Object.keys(p).length}/${NPISTAS})`, "#f2c94a"); tocarTom(523, .3, { tipo: "triangle", vol: .05, wet: .6 }); tocarTom(784, .5, { tipo: "triangle", vol: .04, quando: .2, wet: .6 }); }
const predio = id => VPREDIOS.find(p => p.id === id);
const npc = id => NPCS.find(n => n.id === id);

/* ---------- agenda dos moradores (só depende do relógio: todo mundo vê igual no online) ---------- */
function rotaPonto(rota, d) { let tot = 0; const seg = []; for (let i = 0; i < rota.length; i++) { const a = rota[i], b = rota[(i + 1) % rota.length], l = Math.hypot(b[0] - a[0], b[1] - a[1]); seg.push([a, b, l]); tot += l; }
  let r = ((d % tot) + tot) % tot; for (const [a, b, l] of seg) { if (r <= l) { const k = r / l; return { x: mix(a[0], b[0], k), y: mix(a[1], b[1], k), dir: b[0] >= a[0] ? 1 : -1 }; } r -= l; } return { x: rota[0][0], y: rota[0][1], dir: 1 }; }
function npcOnde(n) {
  const k = R.t % CICLO, p = predio(n.casa);
  if (n.onde) return n.onde(k);
  if (n.fantasma) return ehNoite() && progNoite() > .12 ? { dentro: false, x: CAPELINHA.x - .6 + Math.sin(R.t * .3) * .25, y: CAPELINHA.y + 1.4, dir: -1 } : { ausente: true };
  const cama = n.cama ? { x: 3.9, y: 1.7 } : { x: 1.6, y: 1.75 };
  if (k >= DIA - 2 || k < 5) return { dentro: true, predio: n.casa, andar: 1, x: cama.x, y: cama.y, dorme: true };
  if (k >= DIA - 9) { // fim de tarde: todo mundo vai para casa
    if (!n.rota) return { dentro: true, predio: n.casa, andar: 1, x: 5.4, y: 3.2, dir: -1 };
    const a = rotaPonto(n.rota, (DIA - 9) * .9), b = PORTA(p), q = cl((k - (DIA - 9)) / 6, 0, 1); if (q >= 1) return { dentro: true, predio: n.casa, andar: 1, x: 5.4, y: 3.2, dir: -1 };
    return { dentro: false, x: mix(a.x, b.x, q), y: mix(a.y, b.y, q), dir: b.x > a.x ? 1 : -1, anda: 1 };
  }
  if (n.rota) { const a = rotaPonto(n.rota, k * .9), a2 = rotaPonto(n.rota, k * .9 + .1); return { dentro: false, x: a.x, y: a.y, dir: a2.x >= a.x ? 1 : -1, anda: 1 }; }
  if (n.posto) return { dentro: true, predio: n.casa, andar: 0, x: n.posto[0], y: n.posto[1], dir: 1 };
  if (n.casa === "igreja") return { dentro: true, predio: "igreja", andar: 0, x: 4.5, y: 2.2, dir: 1 };
  return { dentro: true, predio: n.casa, andar: 0, x: 3.5, y: 1.75, dir: 1 };
}
function distEstrada(x, y) { let md = 1e9; for (let i = 0; i < ESTRADA.length - 1; i++) { const [ax, ay] = ESTRADA[i], [bx, by] = ESTRADA[i + 1], dx = bx - ax, dy = by - ay, t = cl(((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy), 0, 1); md = Math.min(md, Math.hypot(x - ax - dx * t, y - ay - dy * t)); } return md; }
const CLAREIRAS = () => [[CAPELINHA.x, CAPELINHA.y + .6, 3], [TAPERA.x, TAPERA.y + .4, 3.5], [FUSCA.x, FUSCA.y + .3, 2.7], [CRUZES[0][0], CRUZES[0][1], 1], [CRUZES[1][0], CRUZES[1][1], 1]];
const lojaAberta = id => { const k = R.t % CICLO; return k >= 5 && k < DIA - 9; };

/* ---------- mapa da vila (colisão) ---------- */
let VILA = null;
function montarVila() {
  let sd = 4242; const r = () => { sd = (sd * 16807) % 2147483647; return (sd - 1) / 2147483646; };
  const sol = Array.from({ length: VH }, (_, y) => Array.from({ length: VW }, (_, x) => x < 1 || x >= VW - 1 || y >= VH - 1));
  const caixas = [], arv = [], cl2 = CLAREIRAS();
  VPREDIOS.forEach(p => caixas.push([p.x - .1, p.y - 1.9, p.x + p.w + .1, p.y + p.h + .05]));
  VPOSTES.forEach(([x, y]) => caixas.push([x - .14, y - .2, x + .14, y + .05]));
  VBANCOS.forEach(([x, y]) => caixas.push([x - .6, y - .25, x + .6, y + .08]));
  caixas.push([VFONTE.x - 1.3, VFONTE.y - .9, VFONTE.x + 1.3, VFONTE.y + .7], [VCEM.x0, VCEM.y0, VCEM.x1, VCEM.y1]);
  caixas.push([CAPELINHA.x - .45, CAPELINHA.y - .3, CAPELINHA.x + .45, CAPELINHA.y + .1], [TAPERA.x - 1.4, TAPERA.y - 1, TAPERA.x + 1.4, TAPERA.y + .15], [FUSCA.x - 1, FUSCA.y - .45, FUSCA.x + 1, FUSCA.y + .15]);
  CRUZES.forEach(([x, y]) => caixas.push([x - .12, y - .1, x + .12, y + .05]));
  caixas.push([25.1, 20.6, 26.2, 21.05], [24.1, 2.1, 25.1, 2.55], [ORELHAO.x - .3, ORELHAO.y - .25, ORELHAO.x + .3, ORELHAO.y + .05], [CARROCA.x - .9, CARROCA.y - .5, CARROCA.x + .9, CARROCA.y + .1], [21.2, 20.2, 21.6, 20.55], [24.4, 20.2, 24.8, 20.55]);
  BARRIS.forEach(([x, y]) => caixas.push([x - .26, y - .3, x + .26, y + .05]));
  for (let y = 0; y < VH; y++) for (let x = 0; x < VW; x++) {
    const cx = x + .5, cy = y + .5;
    if (y < 21) { // a estrada pela mata
      if (y >= Math.floor(RIO_V.y0) && y < RIO_V.y1 && !(x >= Math.floor(PONTE_V.x0) && x < PONTE_V.x1)) { sol[y][x] = true; continue; }
      if (y >= Math.floor(RIO_V.y0) && y < RIO_V.y1) continue;
      const dEst = distEstrada(cx, cy), clar = cl2.some(([qx, qy, rr]) => Math.hypot(cx - qx, cy - qy) < rr);
      if (dEst > 1.35 && !clar) { sol[y][x] = true; if (r() < .85) arv.push({ x: cx + (r() - .5) * .7, y: cy + (r() - .5) * .6, r: .7 + r() * .6, c: Math.floor(r() * 5) }); }
      else if (dEst > 1.1 && !clar && r() < .3) arv.push({ x: cx, y: cy, r: .5, c: Math.floor(r() * 5) });
      continue;
    }
    const borda = x < 2 || x > VW - 3 || y > VH - 3, atras = y >= 21 && y < 22.4 && !(x > 21 && x < 25) && !(x >= 50 && x < 59);
    if (borda && r() < .8) { arv.push({ x: cx + (r() - .5) * .6, y: cy + (r() - .5) * .5, r: .7 + r() * .5, c: Math.floor(r() * 5) }); sol[y][x] = true; }
    else if (atras && r() < .45) { arv.push({ x: cx, y: cy - .2, r: .6 + r() * .4, c: Math.floor(r() * 5) }); }
  }
  [[15.6, 46], [16.8, 44], [2.4, 47.6], [27.6, 59], [44.2, 39.4], [1.6, 38], [57.8, 46.6], [52, 47.8]].forEach(([x, y]) => { arv.push({ x, y, r: .9, c: Math.floor(r() * 5) }); caixas.push([x - .3, y - .25, x + .3, y + .1]); });
  const tumulos = []; for (let gx = VCEM.x0 + 1; gx < VCEM.x1 - .6; gx += 1.6) for (let gy = VCEM.y0 + 1.2; gy < VCEM.y1 - .4; gy += 1.5) tumulos.push({ x: gx + (r() - .5) * .3, y: gy, k: r(), aberta: Math.abs(gx - (VCEM.x1 - 2.2)) < .9 && Math.abs(gy - (VCEM.y0 + 4.2)) < .8 });
  const vaga = Array.from({ length: 26 }, () => ({ x: rnd(14, 32), y: rnd(0, 20), f: r() * 9 }));
  VILA = { sol, caixas, arv, tumulos, vaga };
  gerarChaoVila();
}
let vilaCv = null;
function gerarChaoVila() { CHAO_VILA = Chao(pintarChaoVila, VW, VH); }
function pintarChaoVila(g) {
  const P = 32;
  let sd = 77; const r = () => { sd = (sd * 16807) % 2147483647; return (sd - 1) / 2147483646; };
  g.fillStyle = "#4e5a2e"; g.fillRect(0, 0, VW * P, VH * P);
  g.fillStyle = "#26301a"; g.fillRect(0, 0, VW * P, 21.5 * P); // chão da mata
  const s0 = sd;
  for (let i = 0; i < 3600; i++) { sd = semInd(i); const y = r() * VH, x = r() * VW; if (!vis(x * P, y * P)) continue; g.fillStyle = y < 21 ? (r() < .5 ? "rgba(60,70,30,.35)" : "rgba(14,20,8,.4)") : (r() < .5 ? "rgba(110,120,60,.35)" : "rgba(30,40,20,.35)"); g.beginPath(); g.ellipse(x * P, y * P, 5 + r() * 18, 3 + r() * 9, r() * 3, 0, 7); g.fill(); }
  for (let i = 0; i < 1400; i++) { sd = semInd(i + 5e4); const x = r() * VW * P, y = r() * VH * P; if (!vis(x, y)) continue; g.fillStyle = ["#c8662a", "#8a3018", "#d89a2a", "#6a4a1a"][Math.floor(r() * 4)]; g.beginPath(); g.ellipse(x, y, 2.4, 1.3, r() * 3, 0, 7); g.fill(); } // folhas secas
  sd = s0;
  // a estrada de terra com sulcos de roda
  g.lineCap = "round"; g.lineJoin = "round"; const caminho = () => { g.beginPath(); ESTRADA.forEach(([x, y], i) => i ? g.lineTo(x * P, y * P) : g.moveTo(x * P, y * P)); };
  caminhoTerra(g, P, ESTRADA, 1.9, "vila");
  for (let i = 0; i < 160; i++) { const k = r() * (ESTRADA.length - 1.001), j = Math.floor(k), f = k - j, [ax, ay] = ESTRADA[j], [bx, by] = ESTRADA[j + 1]; g.fillStyle = r() < .5 ? "#8a7a66" : "#5a4a3a"; g.beginPath(); g.ellipse((mix(ax, bx, f) + (r() - .5) * 1.2) * P, mix(ay, by, f) * P, 2 + r() * 3, 1.5 + r() * 2, 0, 0, 7); g.fill(); } // pedrinhas
  // clareiras
  CLAREIRAS().forEach(([x, y, rr]) => { g.fillStyle = "rgba(90,100,50,.55)"; g.beginPath(); g.ellipse(x * P, y * P, rr * P * .9, rr * P * .7, 0, 0, 7); g.fill(); });
  // riacho atravessando a mata
  g.fillStyle = "#1e3a44"; g.beginPath(); g.moveTo(0, RIO_V.y0 * P); for (let x = 0; x <= VW; x += .5) g.lineTo(x * P, (RIO_V.y0 + Math.sin(x * .6) * .12) * P); for (let x = VW; x >= 0; x -= .5) g.lineTo(x * P, (RIO_V.y1 + Math.sin(x * .6 + 1) * .12) * P); g.fill();
  for (let i = 0; i < 90; i++) { g.fillStyle = r() < .5 ? "#7a7468" : "#5a564e"; g.beginPath(); g.ellipse(r() * VW * P, (r() < .5 ? RIO_V.y0 : RIO_V.y1) * P + (r() - .5) * 8, 3 + r() * 5, 2 + r() * 3, 0, 0, 7); g.fill(); }
  g.fillStyle = "#6a4a2a"; g.fillRect(PONTE_V.x0 * P, (RIO_V.y0 - .4) * P, (PONTE_V.x1 - PONTE_V.x0) * P, (RIO_V.y1 - RIO_V.y0 + .8) * P); g.strokeStyle = "rgba(0,0,0,.35)"; g.lineWidth = 2; for (let y = RIO_V.y0 - .4; y < RIO_V.y1 + .4; y += .28) { g.beginPath(); g.moveTo(PONTE_V.x0 * P, y * P); g.lineTo(PONTE_V.x1 * P, y * P); g.stroke(); }
  g.fillStyle = "#1a1208"; g.fillRect((PONTE_V.x0 + 1) * P, (RIO_V.y0 + .2) * P, .3 * P, .25 * P); // tábua faltando
  // mata-burro na entrada da vila
  g.fillStyle = "#141008"; g.fillRect(21.9 * P, 18.4 * P, 2.2 * P, .7 * P); g.fillStyle = "#5a5a5a"; for (let i = 0; i < 6; i++) g.fillRect(21.9 * P, (18.45 + i * .11) * P, 2.2 * P, 2);
  // ruas de pedra, praça e adro da igreja
  const pedra = (x0, y0, x1, y1, cor = "#6a6458") => { g.fillStyle = cor; g.fillRect(x0 * P, y0 * P, (x1 - x0) * P, (y1 - y0) * P); g.strokeStyle = "rgba(0,0,0,.28)"; g.lineWidth = 1;
    for (let y = y0; y < y1; y += .42) for (let x = x0 + ((Math.round(y / .42) % 2) * .3); x < x1; x += .6) g.strokeRect(x * P, y * P, .6 * P, .42 * P);
    for (let i = 0; i < (x1 - x0) * (y1 - y0) * 2; i++) { g.fillStyle = r() < .5 ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.08)"; g.fillRect((x0 + r() * (x1 - x0)) * P, (y0 + r() * (y1 - y0)) * P, .6 * P, .42 * P); }
    for (let i = 0; i < (x1 - x0) * .6; i++) { g.strokeStyle = "rgba(90,110,40,.6)"; const xx = (x0 + r() * (x1 - x0)) * P, yy = (y0 + r() * (y1 - y0)) * P; g.beginPath(); g.moveTo(xx, yy); g.lineTo(xx + 2, yy - 5); g.stroke(); } };
  pedra(1, 27.5, VW - 1, 29.55); pedra(1, 35.9, VW - 1, 38.5); pedra(21.6, 21.4, 24.4, 40.6); pedra(16.6, 29.55, 29.4, 35.9, "#7a7262"); pedra(17, 45.6, 29, 48.8, "#7a7262"); pedra(1, 49.8, VW - 1, 51.8); pedra(28.9, 38.5, 31.3, 49.8); g.fillStyle = "#8a8478"; g.fillRect(1 * P, 49.65 * P, (VW - 2) * P, .15 * P); g.fillRect(1 * P, 51.8 * P, (VW - 2) * P, .15 * P); // a rua de baixo e o beco
  g.fillStyle = "#8a8478"; for (const yy of [27.35, 29.55, 35.75, 38.5]) g.fillRect(1 * P, yy * P, (VW - 2) * P, .15 * P); // meio-fio
  [[17, 30.6], [28.4, 30.6], [17, 34.8], [28.4, 34.8]].forEach(([x, y]) => { g.fillStyle = "#3a2a1a"; g.fillRect(x * P, y * P, .9 * P, .9 * P); for (let i = 0; i < 8; i++) { g.fillStyle = ["#a02a2a", "#e8d8a0", "#8a3a8a", "#e8e2d8"][i % 4]; g.beginPath(); g.arc((x + .15 + r() * .6) * P, (y + .15 + r() * .6) * P, 3, 0, 7); g.fill(); } }); // canteiros murchos
  g.fillStyle = "#3a3222"; g.fillRect(VCEM.x0 * P, VCEM.y0 * P, (VCEM.x1 - VCEM.x0) * P, (VCEM.y1 - VCEM.y0) * P);
  g.fillStyle = "rgba(60,40,20,.55)"; g.fillRect((CARROCA.x - 1.2) * P, (CARROCA.y + .1) * P, 2.4 * P, .5 * P);
}
function livreVila(x, y) {
  const rr = .28; for (const [ox, oy] of [[-rr, 0], [rr, 0], [0, -rr * .6], [0, rr * .4]]) { const tx = Math.floor(x + ox), ty = Math.floor(y + oy); if (ty < -2 || tx < 0 || tx >= VW || ty >= VH) return false; if (ty >= 0 && VILA.sol[ty][tx]) return false; }
  for (const [x0, y0, x1, y1] of VILA.caixas) if (x > x0 - rr && x < x1 + rr && y > y0 - .12 && y < y1 + .12) return false; return true;
}
function moveisPredio(id, andar) {
  const p = predio(id), l = [[7.1, .9, 1.6, 1.5]]; // escada
  if (andar === 1) { l.push([.5, 1, 2.2, 1.7], [.4, 4.1, 1, 1.3], [4.4, 3.9, 1.3, .8]); if (id === "padaria" || id === "gemeas") l.push([3.1, 1, 1.7, 1.4]); return l; }
  if (id === "igreja") { l.push([3.2, 1.1, 2.6, .7], [.9, 3.1, 2.8, .45], [5.3, 3.1, 2.8, .45], [.9, 4.2, 2.8, .45], [5.3, 4.2, 2.8, .45]); return l; }
  if (id === "escola") { l.push([3.4, 1.9, 2.2, .55]); [[.8, 3.3], [2.2, 3.3], [5.7, 3.3], [.8, 4.5], [2.2, 4.5], [5.7, 4.5]].forEach(([x, y]) => l.push([x, y, 1, .55])); return l; }
  if (id === "oficina") { l.push([5.3, 2.6, 2.2, 1.3], [.5, 1, 1.1, 1.1], [.5, 3.7, 1.2, .8]); return l; }
  if (p && p.casa) { l.push([.5, 1, 1.3, .8], [.6, 3.7, 2.2, .7], [4.2, 2.6, 1.5, .9], [5.9, 1, 1, .7]); return l; }
  l.push([1.2, 2.3, 4.6, .6]); // balcão
  const extra = { armazem: [6, 3.6, 1.6, 1], padaria: [6.1, 3.4, 1.3, 1.1], costura: [6.2, 3.8, 1.5, .6], ferreiro: [5.9, 3.5, 1.4, 1.1], botica: [6.2, 3.6, 1, 1], barbearia: [5.9, 3.4, 1, 1], delegacia: [5.6, 3.2, 2.8, 2.1], coveiro: [5.4, 3.5, 2.6, .8], correio: [6, 3.6, 1.6, .9], pensao: [5.8, 3.7, 2.2, .7] }[id];
  if (extra) l.push(extra); return l;
}
function livrePredio(x, y) { if (x < .5 || x > ROOM.w - .5 || y < 1.1 || y > ROOM.h - .25) return false; for (const [mx, my, mw, mh] of moveisPredio(R.predio, R.andar)) if (x > mx - .2 && x < mx + mw + .2 && y > my && y < my + mh + .25) return false; return true; }
function andaLivre(p, dx, dy, vel, dt, livre) { const nx = p.x + dx * vel * dt, ny = p.y + dy * vel * dt, preso = !livre(p.x, p.y); if (preso || livre(nx, p.y)) p.x = nx; if (preso || livre(p.x, ny)) p.y = ny; }

/* ---------- a mata: trilha até o lago e a casinha do vô Sebastião ---------- */
const MTW = 46, MTH = 34;
const TRILHA_M = [[46.5, 25], [41, 24.6], [37, 26.5], [32, 27.4], [27.5, 25.5], [25, 21.5], [26.5, 17], [31, 14], [30, 9.5], [25.5, 7.2], [20.5, 8.6], [17.5, 12], [15.6, 13.4]];
const CLAREIRA_M = { x: 12.4, y: 17.2, rx: 11.2, ry: 9.6 };
const LAGO_M = { x: 8.4, y: 21, rx: 7, ry: 4.6 }, ILHA_M = { x: 6.6, y: 21.6 };
const CABANA = { x: 13.2, y: 9, w: 5, h: 3.4, porta: { x: 15.7, y: 12.7 } };
const PIER_M = { x: 12.5, y: 16.2 }, PIER_FIM = { x: 12.5, y: 19.4 }, BARCO_M = { x: 3.6, y: 16.6 }, CADEIRA_M = { x: 15.4, y: 18.6 };
const CAB = { w: 8, h: 5.6, porta: { x: 4, y: 5.3 } };
const TUMULO_VO = { x: 40.4, y: 25.6 }, JANELA_C = { x: 6.3 }, ALCAPAO = { x: 2.9, y: 3.4 };
const CAB_MOVEIS = [[.4, .6, 2.1, 1.5], [3.1, .6, 1.8, 1], [6.5, .5, 1.1, 1.3], [.5, 3.9, 1.3, .8], [6.4, 3.7, 1.2, .9]];
const COISAS_MATA = [
  { x: 40, y: 23.6, tipo: "fita", dia: ["Fitas vermelhas amarradas nos troncos. A vó amarrava uma igual no meu pulso quando eu era pequena. \"Pra mata saber que você é nossa.\""], noite: ["As fitas estão se mexendo. Não tem vento."] },
  { x: 34, y: 25.6, tipo: "boneca", dia: ["Uma boneca de palha com um vestidinho igual ao que eu usava com cinco anos. Tem o meu nome bordado nela.", "Quem fez isso sabia o meu nome antes de eu nascer?"], noite: ["A boneca virou a cabeça pra mim. Eu tenho certeza que ela estava olhando pro outro lado."] },
  { x: 27.6, y: 23.6, tipo: "caveira", dia: ["Uma caveira de boi espetada numa estaca. Alguém riscou uma data no osso: 1966."], noite: ["Tem alguma coisa escorrendo dos olhos da caveira."] },
  { x: 23.6, y: 18.6, tipo: "circulo", dia: ["Um círculo de pedras com cinza no meio. Alguém fazia fogueira aqui. Tem ossinhos bem pequenos no meio da cinza."], noite: ["A cinza ainda está quente."] },
  { x: 32.6, y: 12.8, tipo: "cruz", dia: ["Uma cruz com uma foto desbotada: uma moça de tranças. Atrás está escrito: \"Benedita, 1966. Voltou.\"", "Voltou? A vó nunca me contou que se perdeu na mata."], noite: ["O rosto da foto está riscado. Não estava assim de dia."] },
  { x: 27.6, y: 7.4, tipo: "sapato", dia: ["Um sapatinho de criança, ainda molhado. Como se alguém tivesse acabado de perder ele."], noite: ["Tem pegadas pequenas saindo dele. Indo pra dentro da mata."] },
  { x: 21.4, y: 7, tipo: "volta", dia: ["Alguém escreveu VOLTA no tronco. Fundo. Parece que foi com a unha."], noite: ["Agora está escrito VOLTA PRA CASA, YASMIN."] },
  { x: 19.6, y: 15.8, tipo: "balanco", dia: ["Um balanço de corda num galho. O vô fazia balanço pra todo mundo da família."], noite: ["O balanço está indo e vindo. Sozinho. Devagar."] }];
// as páginas do diário do vô, escondidas dentro da casinha
const PAGINAS_VO = [
  { x: 4, y: 1.9, onde: "mesa", txt: "Sebastião, março de 1966. A Benedita sumiu na mata faz três dias. O povo da vila parou de procurar. Eu não paro." },
  { x: 1.5, y: 2.4, onde: "cama", txt: "Ela voltou hoje cedo, pelo trilho do lago. Descalça, sem um arranhão, com o vestido seco. Sorriu pra mim. A Benedita nunca sorriu daquele jeito." },
  { x: 1.2, y: 4.1, onde: "baú", txt: "Ela não aparece direito no espelho do lago. A sombra dela chega antes dela nos lugares. Ninguém mais repara. Eu reparo." },
  { x: 7, y: 2.1, onde: "estante", txt: "Ouvi ela conversando com a mata de madrugada. Combinaram um preço: a cada trinta anos, alguém do sangue dela vai pra mata. Pra ela poder ficar com a gente." },
  { x: 7, y: 3.6, onde: "fogareiro", txt: "1996. A mata levou o Antônio, nosso menino. Enterro sem caixão. A Benedita chorou bonito. Depois eu vi ela secar o rosto e sorrir pro mato." },
  { x: 5.6, y: .9, onde: "retrato", txt: "Ela não atravessa a água. Por isso eu vim morar aqui, do lado do lago. Enquanto eu estiver aqui, a criança tem pra onde correr." },
  { x: 2.8, y: .9, onde: "janela", txt: "Às vezes eu acho que ela fez o trato pra proteger a gente de coisa pior que mora lá dentro. Às vezes eu acho que eu enlouqueci. Que Deus me perdoe se eu estiver errado sobre ela." },
  { x: 5.3, y: 2.6, onde: "cadeira", txt: "Se alguém da família ler isso: em 2026 é a vez de novo. Não deixem a criança vir pro sítio. E se ela vier... a Benedita não morreu. Ela só voltou pra casa. — Sebastião" }];
const paginasVo = () => { try { return JSON.parse(ls("roca_vo") || "[]"); } catch (e) { return []; } };
let MATA = null, CHAO_MATA = null;
function distSeg(px, py, ax, ay, bx, by) { const dx = bx - ax, dy = by - ay, l = dx * dx + dy * dy, t = l ? cl(((px - ax) * dx + (py - ay) * dy) / l, 0, 1) : 0; return Math.hypot(px - ax - t * dx, py - ay - t * dy); }
function naTrilha(x, y) { let d = 99; for (let i = 1; i < TRILHA_M.length; i++) d = Math.min(d, distSeg(x, y, ...TRILHA_M[i - 1], ...TRILHA_M[i])); return d; }
const noElipse = (x, y, e, k = 1) => ((x - e.x) / (e.rx * k)) ** 2 + ((y - e.y) / (e.ry * k)) ** 2 < 1;
function montarMata() {
  let sd = 31; const r2 = () => { sd = (sd * 16807) % 2147483647; return (sd - 1) / 2147483646; };
  const sol = Array.from({ length: MTH }, (_, y) => Array.from({ length: MTW }, (_, x) => { const cx = x + .5, cy = y + .5; if (naTrilha(cx, cy) < 1.25) return false; if (noElipse(cx, cy, CLAREIRA_M)) return noElipse(cx, cy, LAGO_M) && !(Math.abs(cx - PIER_M.x) < .6 && cy < PIER_FIM.y + .3); return true; }));
  const arv = [], mortas = [], caixas = [[CABANA.x - .1, CABANA.y, CABANA.x + CABANA.w + .1, CABANA.y + CABANA.h + .1]];
  for (let y = -2; y < MTH + 1; y++) for (let x = -1; x < MTW; x++) { const cx = x + .5, cy = y + .5; if (naTrilha(cx, cy) < 1.7 || noElipse(cx, cy, CLAREIRA_M, 1.05)) { if (naTrilha(cx, cy) > 1.5 && !noElipse(cx, cy, CLAREIRA_M, .8) && r2() < .12) mortas.push({ x: cx, y: cy }); continue; } if (r2() < .7) arv.push({ x: cx + (r2() - .5) * .7, y: cy + (r2() - .5) * .7, r: .8 + r2() * .7, k: r2(), m: r2() < .14 }); }
  COISAS_MATA.forEach(o => caixas.push([o.x - .3, o.y - .25, o.x + .3, o.y + .05])); caixas.push([CADEIRA_M.x - .3, CADEIRA_M.y - .3, CADEIRA_M.x + .3, CADEIRA_M.y + .05]);
  const pedras = []; for (let i = 0; i < 260 && pedras.length < 45; i++) { const x = r2() * MTW, y = r2() * MTH; if (sol[Math.floor(y)] && sol[Math.floor(y)][Math.floor(x)]) continue; if (noElipse(x, y, LAGO_M, 1.25)) continue; pedras.push({ x, y, k: r2() }); }
  const taboas = []; for (let i = 0; i < 46; i++) { const a = r2() * PI * 2; if (Math.abs(a - 4.85) < .25) continue; const k = 1.02 + r2() * .1; taboas.push({ x: LAGO_M.x + Math.cos(a) * LAGO_M.rx * k, y: LAGO_M.y + Math.sin(a) * LAGO_M.ry * k, n: 2 + Math.floor(r2() * 4), k: r2() }); }
  MATA = { sol, arv, mortas, caixas, pedras, taboas }; CHAO_MATA = Chao(pintarChaoMata, MTW, MTH);
}
function pintarChaoMata(g) {
  const P = 32; let sd = 77; const r2 = () => { sd = (sd * 16807) % 2147483647; return (sd - 1) / 2147483646; };
  g.fillStyle = "#141a0e"; g.fillRect(0, 0, MTW * P, MTH * P);
  const s0 = sd;
  for (let i = 0; i < 900; i++) { sd = semInd(i); const x = r2() * MTW * P, y = r2() * MTH * P; if (!vis(x, y)) continue; g.fillStyle = ["rgba(30,40,18,.6)", "rgba(10,14,8,.6)", "rgba(40,34,20,.5)"][i % 3]; g.beginPath(); g.ellipse(x, y, 6 + r2() * 30, 4 + r2() * 18, r2() * 3, 0, 7); g.fill(); }
  sd = s0;
  // clareira com capim alto e seco
  g.fillStyle = "#2a3218"; g.beginPath(); g.ellipse(CLAREIRA_M.x * P, CLAREIRA_M.y * P, CLAREIRA_M.rx * P, CLAREIRA_M.ry * P, 0, 0, 7); g.fill();
  g.fillStyle = "rgba(70,74,36,.5)"; g.beginPath(); g.ellipse(CLAREIRA_M.x * P, CLAREIRA_M.y * P, CLAREIRA_M.rx * P * .85, CLAREIRA_M.ry * P * .8, 0, 0, 7); g.fill();
  // trilha de terra com raízes atravessando
  g.lineCap = g.lineJoin = "round"; const tr = (w, cor) => { g.strokeStyle = cor; g.lineWidth = w * P; g.beginPath(); TRILHA_M.forEach(([x, y], i) => i ? g.lineTo(x * P, y * P) : g.moveTo(x * P, y * P)); g.stroke(); };
  caminhoTerra(g, P, TRILHA_M, 1.75, "mata");
  g.strokeStyle = "#2a1c10"; g.lineWidth = 3; for (let i = 1; i < TRILHA_M.length; i++) { const [ax, ay] = TRILHA_M[i - 1], [bx, by] = TRILHA_M[i]; for (let k = .2; k < 1; k += .3) { const x = (ax + (bx - ax) * k) * P, y = (ay + (by - ay) * k) * P, a = Math.atan2(by - ay, bx - ax) + PI / 2 + (r2() - .5); g.beginPath(); g.moveTo(x - Math.cos(a) * P, y - Math.sin(a) * P); g.quadraticCurveTo(x + (r2() - .5) * 10, y + (r2() - .5) * 10, x + Math.cos(a) * P, y + Math.sin(a) * P); g.stroke(); } }
  // lago escuro com lama na beira
  g.fillStyle = "#2a2416"; g.beginPath(); g.ellipse(LAGO_M.x * P, LAGO_M.y * P, (LAGO_M.rx + .5) * P, (LAGO_M.ry + .45) * P, 0, 0, 7); g.fill();
  const ag = g.createRadialGradient(LAGO_M.x * P, LAGO_M.y * P, 0, LAGO_M.x * P, LAGO_M.y * P, LAGO_M.rx * P); ag.addColorStop(0, "#04080a"); ag.addColorStop(.7, "#0c1a1c"); ag.addColorStop(1, "#1a2a26");
  g.fillStyle = ag; g.beginPath(); g.ellipse(LAGO_M.x * P, LAGO_M.y * P, LAGO_M.rx * P, LAGO_M.ry * P, 0, 0, 7); g.fill();
  for (let i = 0; i < 26; i++) { const a = r2() * PI * 2, x = LAGO_M.x + Math.cos(a) * LAGO_M.rx * (.75 + r2() * .2), y = LAGO_M.y + Math.sin(a) * LAGO_M.ry * (.75 + r2() * .2); g.fillStyle = "#1e3a1e"; g.beginPath(); g.ellipse(x * P, y * P, 7, 5, 0, .3, 6.1); g.fill(); } // aguapés
  const s1 = sd;
  for (let i = 0; i < 300; i++) { sd = semInd(i + 5e4); const x = r2() * MTW * P, y = r2() * MTH * P; if (!vis(x, y)) continue; g.fillStyle = ["#5a2a14", "#7a4a1e", "#3a2a14", "#6a5a2a"][i % 4]; g.beginPath(); g.ellipse(x, y, 2.6, 1.4, r2() * 3, 0, 7); g.fill(); } // folha podre
  for (let i = 0; i < 2600; i++) { sd = semInd(i + 1e5); const x = r2() * MTW * P, y = r2() * MTH * P; if (!vis(x, y)) continue; g.strokeStyle = r2() < .5 ? "rgba(60,74,34,.5)" : "rgba(20,28,12,.6)"; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r2() - .5) * 3, y - 3 - r2() * 4); g.stroke(); }
  sd = s1;
}
function livreMata(x, y) {
  const rr = .28; for (const [ox, oy] of [[-rr, 0], [rr, 0], [0, -rr * .6], [0, rr * .4]]) { const tx = Math.floor(x + ox), ty = Math.floor(y + oy); if (ty < 0 || ty >= MTH || tx < 0) return false; if (tx >= MTW) continue; if (MATA.sol[ty][tx]) return false; }
  for (const [x0, y0, x1, y1] of MATA.caixas) if (x > x0 - rr && x < x1 + rr && y > y0 - .12 && y < y1 + .12) return false; return true;
}
function livreCabana(x, y) { if (x < .5 || x > CAB.w - .5 || y < 1.1 || y > CAB.h - .3) return false; for (const [mx, my, mw, mh] of CAB_MOVEIS) if (x > mx - .2 && x < mx + mw + .2 && y > my && y < my + mh + .25) return false; return true; }
function irMata() { if (!MATA) montarMata(); R.lugar = "mata"; R.predio = null; R.eu.x = MTW - .8; R.eu.y = 25; cam.x = R.eu.x; cam.y = R.eu.y; R.fade = 1; S.porta(); efeito("A Mata", "#c8c2b4"); hud();
  if (!ls("roca_mata")) { ls("roca_mata", 1); setTimeout(() => R && falar(["A trilha da mata. A vó dizia que o vô morava lá no fim dela, perto do lago, nos últimos anos.", "Ela nunca deixou eu vir aqui. Nem de dia."], null, "Yasmin"), 900); }
  else if (ehNoite()) setTimeout(() => R && R.lugar === "mata" && falar(["Miau! Yasmin, de noite não! Ele anda pela trilha de noite!"], null, "Sombrinha"), 700); }
function voltarDaMata() { R.lugar = "sitio"; R.predio = null; R.eu.x = 1.2; R.eu.y = 17; cam.x = 6; cam.y = 17; R.fade = 1; S.porta(); hud(); }
function entrarCabana() { R.predio = "cabana"; R.int = { x: CAB.porta.x, y: CAB.h - .6, dir: -1 }; S.porta(); hud(); if (!ls("roca_cabana")) { ls("roca_cabana", 1); setTimeout(() => R && falar(["A casinha do vô. Tem poeira em tudo... menos numa cadeira. Alguém senta aqui.", "Ele escrevia todo dia. A vó dizia que ele escrevia pra não esquecer. Será que ele deixou alguma coisa?"], null, "Yasmin"), 600); } }
function sairCabana() { R.espiar = 0; R.predio = null; R.eu.x = CABANA.porta.x; R.eu.y = CABANA.porta.y + .5; S.porta(); hud(); }
function lerPagina(i) {
  const l = paginasVo(), nova = !l.includes(i); if (nova) { l.push(i); ls("roca_vo", JSON.stringify(l)); }
  painelAberto = true; el.rcPainel.hidden = false;
  el.rcPainel.innerHTML = `<div class="rc-caixa rc-diario"><h2>Diário do vô Sebastião</h2><p style="font-size:12px;opacity:.7">Página achada no(a) ${PAGINAS_VO[i].onde} · ${l.length}/${PAGINAS_VO.length}</p><p style="font-style:italic">"${PAGINAS_VO[i].txt}"</p><div class="rc-linha"><button type="button" class="rc-op dest" id="rcFechar">Guardar</button></div></div>`;
  document.getElementById("rcFechar").addEventListener("click", () => { fecharPainel(); if (nova && l.length === PAGINAS_VO.length) setTimeout(() => R && falar(["A vó... era a vó o tempo todo? Não. Não pode ser.", "Ela me amava. Eu sei que ela me amava. Ou será que ela só estava esperando eu crescer?", "Miau. Yasmin. A gente precisa ir embora daqui. Hoje."], null, "Yasmin"), 300); });
  if (nova) { S.colher(); tocarTom(70, 1.4, { vol: .2, ate: 40 }); }
}
const FITA_VO = ["(chiado) ...tá gravando? Tá. Meu nome é Sebastião. Se alguém achou isso, eu já fui.",
  "A Benedita que voltou da mata não é a minha Benedita. A minha morreu lá, em 1966. Eu achei os ossos dela debaixo da figueira grande, com o vestido azul. Enterrei sozinho. Nunca contei pra ninguém.",
  "A coisa que voltou usa o rosto dela. Cuidou da casa, criou os meninos, me fez café por sessenta anos. Às vezes eu juro que ela amava a gente de verdade.",
  "Mas a cada trinta anos a mata cobra. Se ela não entregar alguém do sangue, a mata leva ela de volta. Em 96 ela entregou o Antônio. Chorou a noite inteira. Eu ouvi.",
  "Se for a Yasmin agora... a Benedita vai tentar dar outra pessoa no lugar. Ela vai tentar te salvar, menina. Do jeito dela. Não confia nisso. Alguém sempre paga.",
  "(três batidas na porta, na gravação) ...Benedita? É você? Eu não vou abrir. Eu não vou... (chiado)"];
/* ---------- o porão debaixo da casinha do vô ---------- */
const PORAO = { w: 9, h: 6.2, escada: { x: 1.25, y: 1.7 } };
const PORAO_MOVEIS = [[.75, .2, 1, 1.15], [3.6, 3.0, 1.5, .9], [6.15, 3.9, 1.35, .95], [.95, 4.4, 1.4, .8], [8.1, 1, .9, 1.4]];
const lerPorao = () => { try { return JSON.parse(ls("roca_porao") || "[]"); } catch (e) { return []; } };
function marcaPorao(k) { const l = lerPorao(); if (!l.includes(k)) { l.push(k); ls("roca_porao", JSON.stringify(l)); } }
const PORAO_COISAS = [
  { k: "escada", x: 1.25, y: 1.75, t: () => "Subir", fn: () => { R.predio = "cabana"; R.int = { x: ALCAPAO.x, y: ALCAPAO.y + .9, dir: 1 }; S.porta(); hud(); } },
  { k: "conservas", x: 4.3, y: 1.45, t: () => "Vasculhar", fn: () => { marcaPorao("conservas"); falar(["Prateleiras cheias de vidros de conserva. Mas não é pepino.", "São dentes de leite. Um vidro pra cada criança da família, com nome e ano na tampa.", "Tem um vidro novo, limpinho, sem nenhum dente dentro. A tampa diz: YASMIN — 2026."], null, "Yasmin"); R.tremor = .3; tocarTom(60, 1, { vol: .2, ate: 40 }); } },
  { k: "mural", x: 7.1, y: 1.45, t: () => "Vasculhar", fn: () => { marcaPorao("mural"); falar(["Uma parede inteira de fotos, recortes e barbante vermelho. O vô investigou isso a vida toda.", "1966: a vó de tranças, sorrindo. Embaixo ele escreveu: \"Não é ela.\"", "1996: um menino de uns nove anos. \"Antônio. Levado na primeira noite de lua nova.\"", "2026: a minha foto da escola. A do dente faltando. Com um círculo vermelho em volta."], null, "Yasmin"); } },
  { k: "mesa", x: 4.35, y: 4.25, t: () => "Vasculhar", fn: () => { marcaPorao("mapa"); falar(["Um mapa da mata desenhado à mão. A trilha, o lago, a casinha... e um X bem no meio do mato, longe da trilha.", "Do lado do X: \"a figueira grande. Onde eu achei a minha Benedita.\"", "Tem uma lupa, um lampião e uma xícara de café que ainda está morna. Morna."], null, "Yasmin"); } },
  { k: "cova", x: 6.85, y: 5.3, t: () => "Olhar", fn: () => { marcaPorao("cova"); falar(["Um monte de terra comprido, do tamanho de uma pessoa. Uma cruzinha de galho, com flores secas.", "Escrito com faca na cruz: \"B. 1966. A de verdade.\"", "O vô trouxe ela pra cá. Pra perto dele. Escondida de quem voltou no lugar dela."], null, "Yasmin"); } },
  { k: "bau", x: 1.65, y: 3.95, t: () => ls("roca_fita") ? (R.terco ? "Ouvir a fita" : "Vasculhar") : "Abrir o baú", fn: () => { const primeira = !ls("roca_fita"); ls("roca_fita", 1); marcaPorao("bau");
      if (!R.terco && !R.tercoPego) { R.terco = 1; R.tercoPego = 1; efeito("Terço do vô: o Curupira não te leva uma vez", "#f2c94a"); hud(); }
      if (primeira) falar(["Um baú de madeira com cheiro de cânfora. Dentro: o terço do vô, enrolado num lenço...", "...e uma caixa de lata com um gravadorzinho de fita. A fita está escrita \"PRA YASMIN\".", "O vô sabia o meu nome. Ele gravou isso pra mim."], () => setTimeout(ouvirFita, 300), "Yasmin"); else ouvirFita(); } },
  { k: "canto", x: 8.3, y: 5.3, t: () => "Olhar o canto", fn: () => { marcaPorao("canto"); if (!R.cantoSusto) { R.cantoSusto = 1; R.rostoPoco = 1; R.susto = 1.1; S.susto(); efeito("Tinha alguém sentado no escuro.", "#e2483d"); setTimeout(() => R && falar(["Tinha alguém ali. Sentado no canto, de costas. De vestido azul.", "Quando a luz chegou... não tinha mais ninguém. Só a marca no chão de terra, de alguém que ficou sentado ali muito tempo."], null, "Yasmin"), 1300); } else falar(["Só terra e escuro. E a marca no chão, de alguém sentado."], null, "Yasmin"); } }];
function livrePorao(x, y) { if (x < .4 || x > PORAO.w - .4 || y < 1.15 || y > PORAO.h - .3) return false; for (const [mx, my, mw, mh] of PORAO_MOVEIS) if (x > mx - .2 && x < mx + mw + .2 && y > my && y < my + mh + .25) return false; return true; }
function descerPorao() { R.predio = "porao"; R.int = { x: PORAO.escada.x + .2, y: PORAO.escada.y + .4, dir: 1 }; S.porta(); tocarRuido(.8, { filtro: "lowpass", f: 400, vol: .1 }); hud();
  if (!ls("roca_porao_visto")) { ls("roca_porao_visto", 1); setTimeout(() => R && falar(["A escada range a cada degrau. Lá embaixo é frio, cheira a terra molhada e a vela apagada.", "Um porão inteiro. Ninguém nunca me falou desse porão.", "Miau... Yasmin, eu vou ficar aqui em cima. Olha tudo rápido. E não olha pro canto escuro."], null, "Yasmin"), 500); } }
function oQueFazerPorao() { const s = R.int; let m = null, md = 1.05; for (const o of PORAO_COISAS) { const d = Math.hypot(s.x - o.x, s.y - o.y); if (d < md) { md = d; m = o; } } return m ? { t: m.t(), fn: m.fn, loc: 1 } : null; }
function desenharPorao(tm) {
  const s = Math.min(W / (PORAO.w + 1.2), H / (PORAO.h + 1.4)), ox = W / 2 - PORAO.w / 2 * s, oy = H / 2 - PORAO.h / 2 * s + s * .1, X = x => ox + x * s, Y = y => oy + y * s, vistos = lerPorao();
  c.fillStyle = "#030303"; c.fillRect(0, 0, W, H);
  // chão de terra batida com lajes de pedra
  c.fillStyle = "#2e241a"; c.fillRect(X(0), Y(1), PORAO.w * s, (PORAO.h - 1) * s);
  let sd = 5; const r2 = () => { sd = (sd * 16807) % 2147483647; return (sd - 1) / 2147483646; };
  for (let i = 0; i < 26; i++) { const lx = r2() * (PORAO.w - .8), ly = 1.2 + r2() * (PORAO.h - 1.6); c.fillStyle = r2() < .5 ? "#3e3428" : "#36302a"; c.beginPath(); c.moveTo(X(lx), Y(ly)); c.lineTo(X(lx + .5 + r2() * .3), Y(ly + .05)); c.lineTo(X(lx + .55), Y(ly + .4)); c.lineTo(X(lx - .05), Y(ly + .35)); c.fill(); c.strokeStyle = "rgba(0,0,0,.35)"; c.lineWidth = 1; c.stroke(); }
  for (let i = 0; i < 120; i++) { c.fillStyle = r2() < .5 ? "rgba(0,0,0,.25)" : "rgba(120,100,70,.12)"; c.fillRect(X(r2() * PORAO.w), Y(1 + r2() * (PORAO.h - 1)), 2, 2); }
  // parede de pedra do fundo, com raízes descendo
  for (let row = 0; row < 3; row++) for (let i = 0; i < 14; i++) { const bx = X(i * .7 - (row % 2) * .35), by = Y(row * .34); c.fillStyle = ["#4a443a", "#3e3a32", "#544c40"][(i + row) % 3]; c.fillRect(bx + 1, by + 1, .7 * s - 2, .34 * s - 2); c.fillStyle = "rgba(0,0,0,.3)"; c.fillRect(bx + 1, by + .3 * s, .7 * s - 2, .04 * s); }
  c.save(); c.beginPath(); c.rect(X(0), Y(0), PORAO.w * s, PORAO.h * s); c.clip();
  for (let i = 0; i < 9; i++) { const rx = X(.5 + i * 1.03), bal = Math.sin(tm * .8 + i) * 2; c.strokeStyle = "#5a3e24"; c.lineWidth = 3 - (i % 3) * .6; c.beginPath(); c.moveTo(rx, Y(0)); c.bezierCurveTo(rx + 6 + bal, Y(.35), rx - 8, Y(.7), rx + bal, Y(.95 + (i % 3) * .15)); c.stroke(); } c.restore(); // raízes
  c.fillStyle = "#1a1612"; c.fillRect(X(-.2), Y(0), .2 * s, PORAO.h * s); c.fillRect(X(PORAO.w), Y(0), .2 * s, PORAO.h * s); c.fillRect(X(-.2), Y(PORAO.h), (PORAO.w + .4) * s, .2 * s);
  // escada até o alçapão, com a luz de cima
  { const ex = X(.8), ey = Y(.2); const gl = c.createLinearGradient(0, Y(-.2), 0, Y(2.6)); gl.addColorStop(0, "rgba(255,220,150,.35)"); gl.addColorStop(1, "rgba(255,220,150,0)"); c.fillStyle = gl; c.beginPath(); c.moveTo(X(.75), Y(-.1)); c.lineTo(X(1.75), Y(-.1)); c.lineTo(X(2.4), Y(2.6)); c.lineTo(X(.3), Y(2.6)); c.fill();
    c.fillStyle = "#5a4024"; c.fillRect(ex, ey - .2 * s, .12 * s, 1.35 * s); c.fillRect(ex + .78 * s, ey - .2 * s, .12 * s, 1.35 * s); for (let i = 0; i < 5; i++) c.fillRect(ex, ey + i * .25 * s, .9 * s, .07 * s); }
  // prateleiras de conservas
  { const px = X(3), py = Y(.08); c.fillStyle = "#4a3018"; for (let i = 0; i < 3; i++) c.fillRect(px, py + i * .3 * s + .24 * s, 2.8 * s, .05 * s); for (let i = 0; i < 3; i++) for (let j = 0; j < 8; j++) { const jx = px + (.12 + j * .34) * s, jy = py + i * .3 * s + .05 * s; c.fillStyle = "rgba(200,220,210,.28)"; c.fillRect(jx, jy, .2 * s, .2 * s); c.fillStyle = ["rgba(200,190,150,.7)", "rgba(160,60,40,.6)", "rgba(120,140,60,.6)", "rgba(230,230,220,.8)"][(i * 3 + j) % 4]; c.fillRect(jx + 1, jy + .08 * s, .2 * s - 2, .12 * s - 1); c.fillStyle = "#6a5a3a"; c.fillRect(jx - 1, jy - .03 * s, .2 * s + 2, .04 * s); c.fillStyle = "#e8dcb8"; c.fillRect(jx + .03 * s, jy + .09 * s, .14 * s, .05 * s); }
    const vx = px + (.12 + 7 * .34) * s, vy = py + 2 * .3 * s + .05 * s; c.strokeStyle = `rgba(242,201,74,${.3 + .3 * Math.sin(tm * 3)})`; c.lineWidth = 1.5; c.strokeRect(vx - 2, vy - 2, .2 * s + 4, .2 * s + 4); } // o vidro vazio
  // mural com fotos e barbante vermelho
  { const mx = X(6), my = Y(.06), mw = 2.4 * s, mh = .85 * s; c.fillStyle = "#8a6a44"; c.fillRect(mx, my, mw, mh); c.fillStyle = "rgba(0,0,0,.15)"; for (let i = 0; i < 30; i++) c.fillRect(mx + r2() * mw, my + r2() * mh, 2, 2);
    const fotos = [[.15, .12, "#c8b898"], [.6, .5, "#b8a888"], [1.1, .1, "#d8c8a8"], [1.6, .45, "#c8b898"], [2.0, .12, "#e8dcb8"], [.35, .55, "#e8e2d8"], [1.35, .55, "#e8e2d8"]];
    fotos.forEach(([fx, fy, cor], i) => { const x = mx + fx * s, y = my + fy * s; c.fillStyle = cor; c.fillRect(x, y, .3 * s, .26 * s); if (i < 5) { c.fillStyle = "#5a5048"; c.beginPath(); c.arc(x + .15 * s, y + .11 * s, .05 * s, 0, 7); c.fill(); c.fillRect(x + .08 * s, y + .16 * s, .14 * s, .08 * s); } else { c.strokeStyle = "#5a5048"; c.lineWidth = 1; for (let k = 0; k < 3; k++) { c.beginPath(); c.moveTo(x + .04 * s, y + (.06 + k * .07) * s); c.lineTo(x + .26 * s, y + (.06 + k * .07) * s); c.stroke(); } } c.fillStyle = "#c8302a"; c.beginPath(); c.arc(x + .15 * s, y + .02 * s, 2, 0, 7); c.fill(); });
    const yf = mx + 2.0 * s, yy = my + .12 * s; c.strokeStyle = "#e2201a"; c.lineWidth = 2; c.beginPath(); c.arc(yf + .15 * s, yy + .13 * s, .2 * s, 0, 7); c.stroke(); // o círculo na foto da Yasmin
    c.strokeStyle = "rgba(220,30,30,.8)"; c.lineWidth = 1.2; c.beginPath(); c.moveTo(mx + .3 * s, my + .14 * s); c.lineTo(mx + .75 * s, my + .52 * s); c.lineTo(mx + 1.25 * s, my + .12 * s); c.lineTo(mx + 1.75 * s, my + .47 * s); c.lineTo(mx + 2.15 * s, my + .14 * s); c.stroke(); }
  // mesa com mapa, lupa e lampião
  c.fillStyle = "rgba(0,0,0,.35)"; c.fillRect(X(3.65), Y(3.08), 1.5 * s, .9 * s); c.fillStyle = "#5a3e24"; c.fillRect(X(3.6), Y(3.0), 1.5 * s, .9 * s); c.fillStyle = "#d8c8a0"; c.fillRect(X(3.75), Y(3.1), .9 * s, .65 * s); c.strokeStyle = "#7a5a3a"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(X(3.85), Y(3.6)); c.quadraticCurveTo(X(4.1), Y(3.2), X(4.5), Y(3.35)); c.stroke(); c.strokeStyle = "#c8302a"; c.lineWidth = 2; c.beginPath(); c.moveTo(X(4.15), Y(3.3)); c.lineTo(X(4.27), Y(3.42)); c.moveTo(X(4.27), Y(3.3)); c.lineTo(X(4.15), Y(3.42)); c.stroke(); c.fillStyle = "#4a7a9a"; c.beginPath(); c.ellipse(X(4.2), Y(3.7), .1 * s, .06 * s, 0, 0, 7); c.fill();
  c.strokeStyle = "#8a8a8a"; c.lineWidth = 2; c.beginPath(); c.arc(X(4.85), Y(3.55), .07 * s, 0, 7); c.stroke(); c.beginPath(); c.moveTo(X(4.9), Y(3.6)); c.lineTo(X(4.98), Y(3.7)); c.stroke(); c.fillStyle = "#3a3a3a"; c.fillRect(X(4.8), Y(3.08), .14 * s, .2 * s); c.fillStyle = `rgba(255,200,110,${.85 + .15 * Math.sin(tm * 9)})`; c.beginPath(); c.ellipse(X(4.87), Y(3.04), .04 * s, .07 * s, 0, 0, 7); c.fill();
  // a cova com a cruzinha
  c.fillStyle = "#3a2c1e"; c.beginPath(); c.ellipse(X(6.82), Y(4.38), .68 * s, .42 * s, 0, 0, 7); c.fill(); c.fillStyle = "#4a3828"; c.beginPath(); c.ellipse(X(6.82), Y(4.3), .55 * s, .3 * s, 0, 0, 7); c.fill(); c.fillStyle = "#6a4a2a"; c.fillRect(X(6.8), Y(3.62), .06 * s, .55 * s); c.fillRect(X(6.65), Y(3.78), .36 * s, .06 * s); c.fillStyle = "#8a6a4a"; for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(X(6.6 + i * .14), Y(4.48), .04 * s, 0, 7); c.fill(); }
  // o baú
  { const aberto = ls("roca_fita"), bx = X(.95), by = Y(4.4); c.fillStyle = "rgba(0,0,0,.35)"; c.fillRect(bx + 3, by + 3, 1.4 * s, .8 * s); c.fillStyle = "#5a3a1e"; c.fillRect(bx, by, 1.4 * s, .8 * s); c.fillStyle = "#3a2410"; c.fillRect(bx, by + .3 * s, 1.4 * s, .06 * s); c.fillStyle = "#8a7a4a"; c.fillRect(bx + .2 * s, by, .06 * s, .8 * s); c.fillRect(bx + 1.14 * s, by, .06 * s, .8 * s); if (aberto) { c.fillStyle = "#1a0e06"; c.fillRect(bx + .06 * s, by + .06 * s, 1.28 * s, .22 * s); c.fillStyle = "#4a2e16"; c.fillRect(bx, by - .3 * s, 1.4 * s, .3 * s); } else { c.fillStyle = "#c8a050"; c.fillRect(bx + .64 * s, by + .24 * s, .12 * s, .14 * s); } }
  // canto escuro
  { const g = c.createRadialGradient(X(8.4), Y(5.4), 0, X(8.4), Y(5.4), 1.6 * s); g.addColorStop(0, "rgba(0,0,0,.95)"); g.addColorStop(1, "rgba(0,0,0,0)"); c.fillStyle = g; c.fillRect(X(6.8), Y(3.8), 2.4 * s, 2.6 * s); if (!R.cantoSusto && Math.sin(tm * .7) > .9) { c.fillStyle = "rgba(230,230,220,.85)"; c.fillRect(X(8.35), Y(5.05), 2, 2); c.fillRect(X(8.48), Y(5.05), 2, 2); } }
  // gotas pingando
  for (let i = 0; i < 4; i++) { const gx = X(1.6 + i * 2.1), f = (tm * .6 + i * .27) % 1; c.fillStyle = `rgba(160,190,200,${.6 * (1 - f)})`; c.fillRect(gx, Y(1 + f * 2.4), 1.5, 4); if (f > .92) { c.strokeStyle = "rgba(160,190,200,.4)"; c.beginPath(); c.ellipse(gx, Y(3.4), 4, 1.5, 0, 0, 7); c.stroke(); } }
  // marcadores do que ainda falta olhar
  PORAO_COISAS.forEach(o => { if (o.k === "escada" || vistos.includes(o.k === "mesa" ? "mapa" : o.k)) return; c.fillStyle = `rgba(242,201,74,${.35 + .3 * Math.sin(tm * 3 + o.x)})`; c.beginPath(); c.arc(X(o.x), Y(o.y - .25), .06 * s, 0, 7); c.fill(); });
  // gente
  const ou = R.outro; if (ou && ou.lugar === "mata" && ou.predio === "porao") desenharVoce(X(ou.int.x), Y(ou.int.y), tm, { q: ou, dir: ou.int.dir || 1, s: s * 1.05, nome: R.online === "host" ? "Amigo(a)" : "Yasmin" });
  desenharVoce(X(R.int.x), Y(R.int.y), tm, { dir: R.int.dir || 1, s: s * 1.05 });
  // escuro: só a luz da lanterna, do lampião e do alçapão
  const lw = luzCv.width, lh = luzCv.height, k = lw / W; lc.setTransform(1, 0, 0, 1, 0, 0); lc.globalCompositeOperation = "source-over"; lc.clearRect(0, 0, lw, lh); lc.fillStyle = "rgba(2,2,4,.9)"; lc.fillRect(0, 0, lw, lh); lc.globalCompositeOperation = "destination-out";
  const furo = (x, y, r, f = 1) => { const g = lc.createRadialGradient(x * k, y * k, 0, x * k, y * k, r * k); g.addColorStop(0, `rgba(0,0,0,${f})`); g.addColorStop(1, "rgba(0,0,0,0)"); lc.fillStyle = g; lc.fillRect((x - r) * k, (y - r) * k, r * 2 * k, r * 2 * k); };
  furo(X(R.int.x), Y(R.int.y - .5), s * (R.lanterna ? 3.6 : 2.3) * (1 + Math.sin(tm * 9) * .01), R.lanterna ? 1 : .85); furo(X(1.25), Y(.8), s * 1.8, .7); furo(X(4.87), Y(3.1), s * 1.5 * (.95 + .05 * Math.sin(tm * 11)), .8);
  if (ou && ou.lugar === "mata" && ou.predio === "porao") furo(X(ou.int.x), Y(ou.int.y - .5), s * 2.2, .8);
  c.drawImage(luzCv, 0, 0, W, H);
  c.fillStyle = "rgba(240,230,210,.6)"; c.font = `600 ${Math.round(Math.max(11, s * .16))}px "JetBrains Mono", monospace`; c.textAlign = "center"; const falta = PORAO_COISAS.length - 1 - PORAO_COISAS.filter(o => o.k !== "escada" && vistos.includes(o.k === "mesa" ? "mapa" : o.k)).length; c.fillText(falta ? `Ainda tem ${falta} coisa(s) pra vasculhar aqui embaixo.` : "Você viu tudo. Sobe. Agora.", W / 2, Y(PORAO.h + .75)); c.textAlign = "start";
}
function abrirAlcapao() {
  R.chaveVo = false; ls("roca_alcapao", 1); S.porta(); tocarTom(90, 1.2, { tipo: "sawtooth", vol: .08, ate: 40, lp: 400 }); R.tremor = .4;
  falar(["A chave entrou. O cadeado abriu com um estalo.", "A tampa é pesada. Embaixo dela tem uma escada de madeira descendo pro escuro.", "Sobe um ar frio lá de baixo. Cheiro de terra molhada."], () => setTimeout(descerPorao, 200), "Yasmin");
}
function ouvirFita() { tocarRuido(1.2, { filtro: "highpass", f: 2500, vol: .05 }); falar(FITA_VO, () => { efeito("A fita do vô está no diário", "#f2c94a"); }, "Fita do vô"); }
function oQueFazerMata() {
  if (R.predio === "porao") return oQueFazerPorao();
  if (R.predio === "cabana") { const s = R.int;
    if (R.espiar) return { t: "Parar de espiar", fn: () => { R.espiar = 0; }, loc: 1 };
    if (s.y > CAB.h - 1.2 && Math.abs(s.x - JANELA_C.x) < .8) return { t: "Espiar pela janela", fn: () => { R.espiar = { t: 0, maos: [] }; tocarRuido(.4, { filtro: "lowpass", f: 600, vol: .06 }); }, loc: 1 };
    if (s.y > CAB.h - 1 && Math.abs(s.x - CAB.porta.x) < 1) return { t: "Sair", fn: sairCabana, loc: 1 };
    if (Math.hypot(s.x - ALCAPAO.x, s.y - ALCAPAO.y) < 1) return ls("roca_alcapao") ? { t: "Descer no porão", fn: descerPorao, loc: 1 } : R.chaveVo ? { t: "Abrir o alçapão", fn: abrirAlcapao, loc: 1 } : { t: "Alçapão", loc: 1, fn: () => { ls("roca_alcapao_visto", 1); falar(["Um alçapão no chão, trancado com um cadeado.", "Tem uma coisa gravada no cadeado: \"A chave fica comigo. Até debaixo da terra.\"", "Comigo... o vô está enterrado no cemitério do sítio, do lado da bisa."], null, "Yasmin"); } };
    const l = paginasVo(); for (let i = 0; i < PAGINAS_VO.length; i++) { const p = PAGINAS_VO[i]; if (Math.hypot(s.x - p.x, s.y - p.y) < 1.05) return { t: l.includes(i) ? "Reler página" : "Procurar", fn: () => lerPagina(i), loc: 1 }; }
    return null; }
  const p = R.eu;
  if (R.outro && R.outro.caido && !R.outro.caido.fora && R.outro.lugar === "mata" && !R.outro.predio && dist(p, R.outro.eu) < 1.4) return { t: "Levantar", fn: () => { R.outro.caido = null; S.colher(); efeito("De pé! Corre!", "#9bd86b"); } };
  if (dist(p, CABANA.porta) < 1.2) return { t: "Entrar", fn: entrarCabana, loc: 1 };
  if (dist(p, CADEIRA_M) < 1.1) return { t: "Olhar", loc: 1, fn: () => falar(ehNoite() ? ["A cadeira do vô está balançando. Virada pro lago. Como se alguém estivesse esperando alguém sair da água."] : ["A cadeira de balanço do vô, virada pro lago. A vó dizia que ele passava a tarde toda aqui, olhando a água.", "Do que ele tinha tanto medo que saísse dali?"], null, "Yasmin") };
  if (dist(p, BARCO_M) < 1.6) return { t: "Olhar", loc: 1, fn: () => falar(["Um barquinho afundado pela metade. Tem arranhão de unha por dentro do casco. Muitos."], null, "Yasmin") };
  if (dist(p, PIER_FIM) < 1.1) return { t: "Olhar o lago", loc: 1, fn: () => { if (ehNoite()) { R.rostoPoco = 1; R.susto = 1.1; S.susto(); efeito("Tinha uma moça de tranças embaixo d'água.", "#e2483d"); } else falar(["A água é preta. Não dá pra ver o fundo. O meu reflexo demora um pouquinho pra piscar depois de mim."], null, "Yasmin"); } };
  for (const o of COISAS_MATA) if (dist(p, o) < 1.2) return { t: "Olhar", fn: () => lembrar(o), loc: 1 };
  return null;
}
/* o Curupira: de noite, na trilha, vem por trás. Os pés dele apontam pra trás. */
function atualizarMata(dt) {
  const cu = R.curu || (R.curu = { fase: "longe", t: 0, x: 0, y: 0, prox: 6, pegadas: [] });
  const naMata = jogadores().filter(J => J.lugar === "mata" && !J.predio && !J.caido);
  if (cu.fase === "longe") { if (!naMata.length) return; cu.prox -= dt * (ehNoite() ? 1 : .15);
    if (Math.random() < dt * .05) { const [v, pn] = somEm(naMata[0].eu.x + rnd(-8, 8), naMata[0].eu.y + rnd(-6, 6)); S.assobio && S.assobio(v * .6, pn); }
    if (cu.prox <= 0) { if (!ehNoite()) { cu.prox = rnd(8, 20); const J = naMata[0]; cu.pegadas = Array.from({ length: 6 }, (_, i) => ({ x: J.eu.x + 1.5 + i * .5, y: J.eu.y + (i % 2 ? .25 : -.25) })); efeito("Pegadas... ao contrário.", "#c8c2b4"); return; }
      const J = naMata[0]; let melhor = null; for (const [x, y] of TRILHA_M) { const d = dist({ x, y }, J.eu); if (d > 9 && d < 16 && (!melhor || d < melhor.d)) melhor = { x, y, d }; } if (!melhor) melhor = { x: J.eu.x + 10, y: J.eu.y };
      Object.assign(cu, { fase: "vem", t: 0, x: melhor.x, y: melhor.y }); S.assobio && S.assobio(1, 0); efeito("Um assobio. Bem perto.", "#e2483d"); R.tremor = .4; } return; }
  cu.t += dt;
  const naCabana = jogadores().filter(J => J.lugar === "mata" && J.predio === "cabana" && !J.caido);
  if (cu.fase === "porta") { if (naMata.length) { cu.fase = "vem"; cu.t = 1.2; } else if (!naCabana.length || !ehNoite() || cu.t > 11) { cu.fase = "sai"; cu.t = 0; } else { const a = { x: CABANA.porta.x + .3, y: CABANA.porta.y + .9 }, dd = dist(cu, a); if (dd > .1) { cu.x += (a.x - cu.x) / dd * 3.4 * dt; cu.y += (a.y - cu.y) / dd * 3.4 * dt; cu.dir = a.x > cu.x ? 1 : -1; cu.fase2 = (cu.fase2 || 0) + dt * 12; } else { cu.bate = (cu.bate || 0) - dt; if (cu.bate <= 0) { cu.bate = rnd(1.6, 3); bater(.8); if (Math.random() < .5) S.assobio(.9, 0); R.tremor = .3; } } return; } }
  if (cu.fase === "vem" && !naMata.length && naCabana.length && ehNoite()) { cu.fase = "porta"; cu.t = 0; return; }
  if (cu.fase !== "sai" && (!naMata.length || !ehNoite())) { cu.fase = "sai"; cu.t = 0; }
  if (cu.fase === "sai") { cu.x += 4 * dt; if (cu.t > 3 || cu.x > MTW + 2) { cu.fase = "longe"; cu.prox = rnd(10, 25); } return; }
  let alvo = naMata[0], md = 1e9; naMata.forEach(J => { const d = dist(J.eu, cu); if (d < md) { md = d; alvo = J; } });
  const v = cu.t < 1.2 ? 0 : 3.45 + Math.min(.8, cu.t * .02); const d = md;
  if (d > .05 && v) { const ax = alvo.eu.x - cu.x, ay = alvo.eu.y - cu.y, nx = cu.x + ax / d * v * dt, ny = cu.y + ay / d * v * dt; cu.dir = ax > 0 ? 1 : -1; cu.x = nx; cu.y = ny; cu.fase2 = (cu.fase2 || 0) + dt * 12; if (Math.random() < dt * 5) { cu.pegadas.push({ x: cu.x, y: cu.y + .1, dir: cu.dir }); if (cu.pegadas.length > 18) cu.pegadas.shift(); } }
  if (Math.random() < dt * .6) { const [vv, pn] = somEm(cu.x, cu.y); S.assobio && S.assobio(vv, pn); }
  if (d < .8) comJogador(alvo, () => R.terco ? (R.terco = 0, cu.fase = "sai", cu.t = 0, S.susto(), R.tremor = .8, efeito("O terço do vô esquentou na sua mão. Ele recuou!", "#f2c94a"), hud()) : morrer("curupira", "O Curupira te alcançou. Os pés dele apontavam pro lado errado, mas ele sabia muito bem onde você estava.", "De noite, não fique na mata. Se ouvir o assobio, corra pra casinha do lago ou volte pro sítio."));
}
function arvoreMata(a, tm) {
  const x = PX(a.x), y = PY(a.y), r = a.r * TS; if (x < -r * 2 || x > W + r * 2 || y < -r * 3.2 || y > H + r * 2) return;
  sombra(x + r * .2, y + r * .05, r * .9, r * .35, .45);
  c.fillStyle = "#1e140c"; c.beginPath(); c.moveTo(x - r * .2, y); c.lineTo(x - r * .1, y - r * 1.4); c.lineTo(x + r * .1, y - r * 1.4); c.lineTo(x + r * .22, y); c.fill(); c.fillStyle = "rgba(0,0,0,.35)"; c.fillRect(x, y - r * 1.3, r * .1, r * 1.3);
  c.strokeStyle = "#1e140c"; c.lineWidth = Math.max(2, r * .07); c.beginPath(); c.moveTo(x - r * .15, y - r * .05); c.quadraticCurveTo(x - r * .4, y, x - r * .5, y + r * .12); c.moveTo(x + r * .18, y - r * .05); c.quadraticCurveTo(x + r * .45, y - r * .02, x + r * .55, y + r * .1); c.stroke(); // raízes
  if (a.m) { c.lineWidth = Math.max(1.5, r * .05); c.beginPath(); c.moveTo(x, y - r * 1.3); c.lineTo(x - r * .6, y - r * 2.1); c.moveTo(x - r * .3, y - r * 1.7); c.lineTo(x - r * .5, y - r * 1.5); c.moveTo(x, y - r * 1.35); c.lineTo(x + r * .5, y - r * 2.3); c.moveTo(x + r * .3, y - r * 1.9); c.lineTo(x + r * .65, y - r * 1.85); c.stroke(); return; } // árvore morta
  const cores = a.k < .33 ? ["#16200e", "#1e2a12", "#263418"] : a.k < .66 ? ["#121a0c", "#1a2410", "#222e14"] : ["#1e1a0e", "#2a2412", "#342c16"], bal = Math.sin(tm * .9 + a.x) * r * .05;
  [[0, -1.6, 1], [-.5, -1.3, .8], [.5, -1.35, .78], [0, -2.1, .75], [-.3, -1.9, .6], [.32, -1.85, .6]].forEach(([ox, oy, s], i) => { c.fillStyle = cores[i % 3]; c.beginPath(); c.arc(x + ox * r + bal, y + oy * r, r * .62 * s, 0, 7); c.fill(); });
  if (a.k > .9 && ehNoite() && Math.sin(tm * .7 + a.x * 3) > .92) { c.fillStyle = "rgba(255,240,200,.85)"; c.fillRect(x - r * .12, y - r * 1.5, 2.5, 2.5); c.fillRect(x + r * .02, y - r * 1.5, 2.5, 2.5); } // olhos entre as folhas
}
function coisaMata(o, tm) {
  const x = PX(o.x), y = PY(o.y), s = TS; if (!naTela(x, y)) return; const nt = ehNoite();
  if (o.tipo === "fita") { c.fillStyle = "#c8201e"; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(x - s * .1, y - s * (.9 + i * .25)); c.quadraticCurveTo(x + s * .3, y - s * (.85 + i * .25) + Math.sin(tm * 2 + i) * 4, x + s * .5, y - s * (.7 + i * .25) + Math.sin(tm * 3 + i) * 6); c.lineTo(x + s * .45, y - s * (.65 + i * .25)); c.lineTo(x - s * .1, y - s * (.82 + i * .25)); c.fill(); } }
  else if (o.tipo === "boneca") { c.fillStyle = "#3a2a1a"; c.fillRect(x - s * .25, y - s * .25, s * .5, s * .25); c.fillStyle = "#c8a860"; c.beginPath(); c.arc(x + (nt ? s * .03 : 0), y - s * .48, s * .1, 0, 7); c.fill(); c.fillStyle = "#c86a8a"; c.beginPath(); c.moveTo(x - s * .12, y - s * .25); c.lineTo(x + s * .12, y - s * .25); c.lineTo(x + s * .06, y - s * .4); c.lineTo(x - s * .06, y - s * .4); c.fill(); c.fillStyle = "#000"; c.fillRect(x - s * .04 + (nt ? s * .05 : 0), y - s * .5, 2, 2); c.fillRect(x + s * .02 + (nt ? s * .05 : 0), y - s * .5, 2, 2); }
  else if (o.tipo === "caveira") { c.fillStyle = "#4a3018"; c.fillRect(x - 2, y - s * .9, 4, s * .9); c.fillStyle = "#d8d0b8"; c.beginPath(); c.ellipse(x, y - s * .95, s * .16, s * .2, 0, 0, 7); c.fill(); c.strokeStyle = "#d8d0b8"; c.lineWidth = 4; c.beginPath(); c.moveTo(x - s * .14, y - s * 1.05); c.quadraticCurveTo(x - s * .4, y - s * 1.1, x - s * .45, y - s * 1.35); c.moveTo(x + s * .14, y - s * 1.05); c.quadraticCurveTo(x + s * .4, y - s * 1.1, x + s * .45, y - s * 1.35); c.stroke(); c.fillStyle = "#1a0a0a"; c.beginPath(); c.arc(x - s * .06, y - s * 1, s * .04, 0, 7); c.arc(x + s * .06, y - s * 1, s * .04, 0, 7); c.fill(); if (nt) { c.fillStyle = "#7a0a0a"; c.fillRect(x - s * .07, y - s * .97, 2, s * .2); c.fillRect(x + s * .05, y - s * .97, 2, s * .25); } }
  else if (o.tipo === "circulo") { for (let i = 0; i < 9; i++) { const a = i / 9 * PI * 2; c.fillStyle = "#5a5a52"; c.beginPath(); c.ellipse(x + Math.cos(a) * s * .5, y + Math.sin(a) * s * .25 - s * .1, s * .1, s * .07, 0, 0, 7); c.fill(); } c.fillStyle = "#2a2622"; c.beginPath(); c.ellipse(x, y - s * .1, s * .3, s * .14, 0, 0, 7); c.fill(); if (nt) { c.fillStyle = `rgba(255,90,20,${.4 + .3 * Math.sin(tm * 6)})`; c.beginPath(); c.arc(x, y - s * .12, 3, 0, 7); c.fill(); } }
  else if (o.tipo === "cruz") { c.fillStyle = "#3a2a1a"; c.fillRect(x - 3, y - s * 1.1, 6, s * 1.1); c.fillRect(x - s * .28, y - s * .85, s * .56, 6); c.fillStyle = "#c8c0a8"; c.fillRect(x - s * .1, y - s * .78, s * .2, s * .24); c.fillStyle = nt ? "#1a0a0a" : "#6a6050"; c.beginPath(); c.arc(x, y - s * .68, s * .05, 0, 7); c.fill(); }
  else if (o.tipo === "sapato") { c.fillStyle = "#6a2a2a"; c.beginPath(); c.ellipse(x, y - s * .06, s * .14, s * .07, .2, 0, 7); c.fill(); c.fillStyle = "#4a1a1a"; c.fillRect(x - s * .08, y - s * .14, s * .1, s * .08); if (nt) { c.fillStyle = "rgba(20,10,5,.6)"; for (let i = 0; i < 5; i++) c.fillRect(x - s * (.4 + i * .3), y - s * .05 + (i % 2) * 3, 4, 3); } }
  else if (o.tipo === "volta") { c.fillStyle = "#2a1c10"; c.fillRect(x - s * .25, y - s * 1.6, s * .5, s * 1.6); c.fillStyle = nt ? "#9a1a1a" : "#c8b088"; c.font = `700 ${Math.round(s * .16)}px "JetBrains Mono", monospace`; c.textAlign = "center"; c.fillText("VOLTA", x, y - s * .9); if (nt) { c.fillText("PRA", x, y - s * .72); c.fillText("CASA", x, y - s * .54); } c.textAlign = "start"; }
  else if (o.tipo === "balanco") { const bal = Math.sin(tm * (nt ? 1.2 : .4)) * s * (nt ? .25 : .05); c.strokeStyle = "#8a7a5a"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x - s * .2, y - s * 1.8); c.lineTo(x - s * .2 + bal, y - s * .45); c.moveTo(x + s * .2, y - s * 1.8); c.lineTo(x + s * .2 + bal, y - s * .45); c.stroke(); c.fillStyle = "#5a3e24"; c.fillRect(x - s * .26 + bal, y - s * .48, s * .52, s * .08); c.fillStyle = "#1e140c"; c.fillRect(x - s * .5, y - s * 1.85, s, 5); }
}
function desenharCabanaFora(tm) {
  const B = CABANA, x0 = PX(B.x), y0 = PY(B.y), w = B.w * TS, h = B.h * TS; if (!naTela(x0 + w / 2, y0 + h / 2, w)) return;
  sombra(x0 + w / 2, y0 + h, w * .55, TS * .3, .5);
  c.fillStyle = "#3a2a1a"; c.fillRect(x0, y0 + h * .25, w, h * .75); c.fillStyle = "rgba(0,0,0,.25)"; for (let i = 0; i < 12; i++) c.fillRect(x0, y0 + h * .25 + i * h * .065, w, 1.5);
  c.fillStyle = "#2a1e14"; c.beginPath(); c.moveTo(x0 - TS * .3, y0 + h * .3); c.lineTo(x0 + w / 2, y0 - h * .2); c.lineTo(x0 + w + TS * .3, y0 + h * .3); c.fill(); // telhado
  c.fillStyle = "#1a1410"; for (let i = 0; i < 8; i++) c.fillRect(x0 + w * (.1 + i * .1), y0 + h * (.02 + Math.abs(i - 4) * .06), w * .08, 3); c.fillStyle = "#2a3a1a"; c.beginPath(); c.ellipse(x0 + w * .25, y0 + h * .2, w * .12, h * .06, -.3, 0, 7); c.fill(); // musgo
  c.fillStyle = "#1a140e"; c.fillRect(x0 + w * .78, y0 - h * .2, TS * .35, h * .35); // chaminé torta
  const pt = PX(B.porta.x) - TS * .4; c.fillStyle = "#140e08"; c.fillRect(pt, y0 + h * .48, TS * .8, h * .52); c.fillStyle = "#5a4a2a"; c.fillRect(pt + TS * .62, y0 + h * .75, 4, 4);
  const luz = paginasVo().length && !ehNoite() ? 0 : 1; [[.08], [.7]].forEach(([fx]) => { const jx = x0 + w * fx, jy = y0 + h * .45, jw = TS * .9, jh = TS * .65; c.fillStyle = ehNoite() ? `rgba(240,170,70,${.55 + .15 * Math.sin(tm * 7 + fx * 9)})` : "#1a2228"; c.fillRect(jx, jy, jw, jh); c.fillStyle = "#2a1a0e"; c.fillRect(jx + jw / 2 - 1.5, jy, 3, jh); c.fillRect(jx, jy + jh / 2 - 1.5, jw, 3); if (ehNoite() && luz && Math.sin(tm * .5 + fx * 4) > .9) { c.fillStyle = "rgba(0,0,0,.85)"; c.beginPath(); c.ellipse(jx + jw * .5, jy + jh * .65, jw * .2, jh * .45, 0, 0, 7); c.fill(); } }); // alguém passa na janela
  c.fillStyle = "#5a4a3a"; c.fillRect(x0 + w * .88, y0 + h * .78, TS * .3, TS * .35); // balde
  if (ehNoite()) for (let i = 0; i < 3; i++) { c.fillStyle = `rgba(160,160,150,${.08 + .04 * i})`; c.beginPath(); c.arc(x0 + w * .82 + Math.sin(tm + i) * 6, y0 - h * .3 - i * TS * .35 - (tm * 8 % 12), TS * (.18 + i * .07), 0, 7); c.fill(); } // fumaça: tem fogo aceso lá dentro
}
function desenharMata(tm) {
  if (!MATA) montarMata();
  const alvoC = R.espiar && R.predio ? { x: CABANA.porta.x, y: CABANA.porta.y + 2.4 } : R.eu; cam.x += (alvoC.x - cam.x) * .12; cam.y += (alvoC.y - .6 - cam.y) * .12; cam.x = cl(cam.x, W / TS / 2, MTW - W / TS / 2 + 1); cam.y = cl(cam.y, H / TS / 2, MTH - H / TS / 2);
  if (R.tremor > 0) { cam.x += rnd(-.05, .05); cam.y += rnd(-.05, .05); }
  c.fillStyle = "#0c1008"; c.fillRect(0, 0, W, H);
  desenharChaoChunks(CHAO_MATA);
  // brilho na água do lago
  for (let i = 0; i < 7; i++) { const lx = PX(LAGO_M.x + Math.cos(i * 1.7 + tm * .1) * LAGO_M.rx * .55), ly = PY(LAGO_M.y + Math.sin(i * 2.3) * LAGO_M.ry * .5); c.strokeStyle = "rgba(180,200,210,.12)"; c.lineWidth = 1.5; c.beginPath(); c.ellipse(lx, ly, TS * (.3 + .2 * Math.sin(tm + i)), TS * .06, 0, 0, 7); c.stroke(); }
  for (let i = 0; i < 4; i++) { const nx = LAGO_M.x + Math.sin(tm * .07 + i * 1.6) * LAGO_M.rx * .6, ny = LAGO_M.y + Math.cos(i * 2.1) * LAGO_M.ry * .4, x = PX(nx), y = PY(ny); const g = c.createRadialGradient(x, y, 0, x, y, TS * 2.6); g.addColorStop(0, "rgba(190,200,200,.12)"); g.addColorStop(1, "rgba(190,200,200,0)"); c.fillStyle = g; c.fillRect(x - TS * 2.6, y - TS * 2.6, TS * 5.2, TS * 5.2); } // névoa em cima da água
  if (ehNoite()) for (let i = 0; i < 14; i++) { const a = tm * .3 + i * 2.4, x = PX(LAGO_M.x + Math.cos(a + i) * LAGO_M.rx * 1.1), y = PY(LAGO_M.y + Math.sin(a * 1.3) * LAGO_M.ry * 1.2), on = Math.sin(tm * 3 + i * 5) > .2; if (on) { c.fillStyle = "rgba(200,255,120,.8)"; c.beginPath(); c.arc(x, y, 2, 0, 7); c.fill(); } } // vaga-lumes
  if (Math.random() < .01 && dist(R.eu, LAGO_M) < 14) { const [v, pn] = somEm(LAGO_M.x + rnd(-5, 5), LAGO_M.y + rnd(-3, 3)); tocarTom(rnd(140, 220), .12, { tipo: "square", vol: .03 * v, lp: 600, pan: pn }); tocarTom(rnd(120, 180), .12, { tipo: "square", vol: .03 * v, lp: 600, pan: pn, quando: .16 }); } // sapos
  if (ehNoite()) { const bx = PX(LAGO_M.x - 1.5), by = PY(LAGO_M.y + .6); c.fillStyle = `rgba(220,220,200,${.25 + .25 * Math.sin(tm * .8)})`; c.beginPath(); c.arc(bx, by, 3, 0, 7); c.arc(bx + TS * .3, by, 3, 0, 7); c.fill(); } // dois olhos boiando
  (R.curu && R.curu.pegadas || []).forEach(p => { const x = PX(p.x), y = PY(p.y); if (!naTela(x, y)) return; c.fillStyle = "rgba(10,6,2,.55)"; c.save(); c.translate(x, y); c.scale(-(p.dir || 1), 1); c.beginPath(); c.ellipse(0, 0, TS * .1, TS * .045, 0, 0, 7); c.fill(); for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(-TS * .12, -TS * .04 + i * TS * .027, TS * .016, 0, 7); c.fill(); } c.restore(); }); // pegadas ao contrário
  const obj = [];
  MATA.arv.forEach(a => obj.push([a.y, () => arvoreMata(a, tm)])); MATA.mortas.forEach(a => obj.push([a.y, () => arvoreMata({ ...a, r: .7, m: true, k: 0 }, tm)]));
  MATA.pedras.forEach(p => obj.push([p.y, () => { const x = PX(p.x), y = PY(p.y); if (!naTela(x, y)) return;
    if (p.k < .5) { c.fillStyle = "#2e2e2a"; c.beginPath(); c.moveTo(x - TS * .2, y); c.lineTo(x - TS * .14, y - TS * .14); c.lineTo(x + TS * .04, y - TS * .2); c.lineTo(x + TS * .2, y - TS * .08); c.lineTo(x + TS * .18, y); c.fill(); c.fillStyle = "#4a4a44"; c.beginPath(); c.moveTo(x - TS * .12, y - TS * .12); c.lineTo(x + TS * .03, y - TS * .18); c.lineTo(x + TS * .1, y - TS * .1); c.fill(); c.fillStyle = "#2a3a1a"; c.fillRect(x - TS * .2, y - TS * .03, TS * .16, TS * .03); }
    else for (let i = 0; i < 3; i++) { const mx = x + (i - 1) * TS * .12, h = TS * (.12 + (i % 2) * .06); c.fillStyle = "#c8b8a0"; c.fillRect(mx - 1.2, y - h, 2.4, h); c.fillStyle = p.k > .8 ? "#a02a1e" : "#b8a080"; c.beginPath(); c.ellipse(mx, y - h, TS * .07, TS * .045, 0, PI, 0); c.fill(); if (p.k > .8) { c.fillStyle = "#f2e8d8"; c.fillRect(mx - 2, y - h - 2, 1.5, 1.5); } } }])); // pedras e cogumelos
  COISAS_MATA.forEach(o => obj.push([o.y, () => coisaMata(o, tm)]));
  obj.push([CABANA.y + CABANA.h, () => desenharCabanaFora(tm)]);
  MATA.taboas.forEach(t => obj.push([t.y, () => { const x = PX(t.x), y = PY(t.y); if (!naTela(x, y)) return; for (let i = 0; i < t.n; i++) { const ox = (i - t.n / 2) * 4, h = TS * (.6 + ((i * 7 + t.k * 10) % 5) * .08), b = Math.sin(tm * 1.4 + t.x + i) * 3; c.strokeStyle = "#3a5a24"; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x + ox, y); c.quadraticCurveTo(x + ox, y - h * .5, x + ox + b, y - h); c.stroke(); c.fillStyle = "#5a3a1e"; c.beginPath(); c.ellipse(x + ox + b, y - h + 4, 2.4, 6, 0, 0, 7); c.fill(); } }]));
  obj.push([BARCO_M.y + .4, () => { const x = PX(BARCO_M.x), y = PY(BARCO_M.y); if (!naTela(x, y)) return; c.save(); c.translate(x, y); c.rotate(-.25); c.fillStyle = "#3a2a1a"; c.beginPath(); c.moveTo(-TS * .9, -TS * .1); c.quadraticCurveTo(0, TS * .35, TS * .9, -TS * .2); c.lineTo(TS * .7, -TS * .3); c.lineTo(-TS * .7, -TS * .25); c.fill(); c.fillStyle = "rgba(8,20,22,.85)"; c.beginPath(); c.ellipse(TS * .25, -TS * .05, TS * .6, TS * .16, 0, 0, 7); c.fill(); c.strokeStyle = "#5a4630"; c.lineWidth = 3; c.beginPath(); c.moveTo(-TS * .3, -TS * .25); c.lineTo(-TS * 1.2, -TS * .9); c.stroke(); c.restore(); }]);
  obj.push([CADEIRA_M.y, () => { const x = PX(CADEIRA_M.x), y = PY(CADEIRA_M.y), bal = ehNoite() ? Math.sin(tm * 1.6) * 3 : 0; if (!naTela(x, y)) return; sombra(x, y, TS * .3, TS * .08); c.fillStyle = "#5a3e24"; c.fillRect(x - TS * .25 + bal, y - TS * .5, TS * .5, TS * .08); c.fillRect(x - TS * .25 + bal, y - TS * 1.05, TS * .08, TS * .6); c.fillRect(x + TS * .17 + bal, y - TS * 1.05, TS * .08, TS * .6); c.fillRect(x - TS * .25 + bal, y - TS * 1.05, TS * .5, TS * .08); c.fillRect(x - TS * .22, y - TS * .45, 3, TS * .45); c.fillRect(x + TS * .19, y - TS * .45, 3, TS * .45); c.strokeStyle = "#5a3e24"; c.lineWidth = 2; c.beginPath(); c.arc(x, y + TS * .02, TS * .32, PI * .15, PI * .85); c.stroke(); c.fillStyle = "#6a5a3a"; c.fillRect(x + TS * .3, y - TS * .1, TS * .14, TS * .1); }]); // a cadeira de balanço do vô, virada pro lago
  obj.push([ILHA_M.y, () => { const x = PX(ILHA_M.x), y = PY(ILHA_M.y); if (!naTela(x, y)) return; c.fillStyle = "#2a2618"; c.beginPath(); c.ellipse(x, y, TS * .7, TS * .3, 0, 0, 7); c.fill(); c.fillStyle = "#3a3a24"; c.beginPath(); c.ellipse(x, y - 2, TS * .55, TS * .2, 0, 0, 7); c.fill(); c.fillStyle = "#1a1410"; c.fillRect(x - 2, y - TS * 1.1, 4, TS * 1.1); c.fillRect(x - TS * .25, y - TS * .85, TS * .5, 4); if (ehNoite()) { c.fillStyle = `rgba(255,200,120,${.6 + .3 * Math.sin(tm * 7)})`; c.beginPath(); c.arc(x + TS * .2, y - TS * .2, 2.5, 0, 7); c.fill(); } }]); // ilhota com uma cruz (e uma vela que ninguém acendeu)
  obj.push([PIER_M.y - .6, () => { const x = PX(PIER_M.x - 1.3), y = PY(PIER_M.y - .6); if (!naTela(x, y)) return; c.fillStyle = "#3a2a1a"; c.fillRect(x - 2, y - TS * .8, 4, TS * .8); c.fillStyle = "#c8b898"; c.fillRect(x - TS * .45, y - TS * 1.05, TS * .9, TS * .32); c.fillStyle = "#7a1a1a"; c.font = `700 ${Math.round(TS * .11)}px "JetBrains Mono", monospace`; c.textAlign = "center"; c.fillText("NÃO NADE", x, y - TS * .9); c.fillText("NÃO RESPONDA", x, y - TS * .78); c.textAlign = "start"; }]);
  obj.push([PIER_M.y - .2, () => { const x = PX(PIER_M.x), y = PY(PIER_M.y), L = (PIER_FIM.y - PIER_M.y + .5) * TS; c.fillStyle = "#4a3620"; c.fillRect(x - TS * .45, y - TS * .2, TS * .9, L); c.fillStyle = "rgba(0,0,0,.3)"; for (let i = 0; i * TS * .3 < L; i++) c.fillRect(x - TS * .45, y - TS * .2 + i * TS * .3, TS * .9, 2); c.fillStyle = "#2a1e12"; for (const yy of [L * .45, L - TS * .3]) { c.fillRect(x - TS * .5, y + yy, 5, TS * .4); c.fillRect(x + TS * .45, y + yy, 5, TS * .4); } c.fillStyle = "#6a5a3a"; c.fillRect(x + TS * .1, y + L - TS * .6, TS * .25, TS * .18); }]);
  const placa = { x: 43.6, y: 23.4 }; obj.push([placa.y, () => { const x = PX(placa.x), y = PY(placa.y); if (!naTela(x, y)) return; c.fillStyle = "#3a2a1a"; c.fillRect(x - 2, y - TS * .9, 4, TS * .9); c.fillStyle = "#5a4630"; c.fillRect(x - TS * .5, y - TS * 1.1, TS, TS * .34); c.fillStyle = "#e8dcb8"; c.font = `700 ${Math.round(TS * .13)}px "JetBrains Mono", monospace`; c.textAlign = "center"; c.fillText("LAGO ←", x, y - TS * .88); c.textAlign = "start"; }]);
  const ou = R.outro; if (ou && ou.lugar === "mata" && !ou.predio) obj.push([ou.eu.y, () => desenharVoce(PX(ou.eu.x), PY(ou.eu.y), tm, { q: ou, nome: R.online === "host" ? "Amigo(a)" : "Yasmin" })]);
  if (R.curu && R.curu.fase !== "longe") obj.push([R.curu.y, () => desenharCurupira(R.curu, tm)]);
  if (!R.predio) obj.push([R.eu.y, () => desenharVoce(PX(R.eu.x), PY(R.eu.y), tm)]);
  obj.sort((a, b) => a[0] - b[0]).forEach(o => o[1]());
  // névoa rasteira
  for (let i = 0; i < 9; i++) { const nx = ((i * 7.3 + tm * .25) % (MTW + 10)) - 5, ny = (i * 5.7) % MTH; const x = PX(nx), y = PY(ny); if (!naTela(x, y, 300)) continue; const g = c.createRadialGradient(x, y, 0, x, y, TS * 4); g.addColorStop(0, "rgba(170,180,170,.13)"); g.addColorStop(1, "rgba(170,180,170,0)"); c.fillStyle = g; c.fillRect(x - TS * 4, y - TS * 4, TS * 8, TS * 8); }
  // escuro: a mata é escura até de dia
  const nt = horaNoite(), esc = .5 + .45 * nt, lw = luzCv.width, lh = luzCv.height, k = lw / W;
  lc.setTransform(1, 0, 0, 1, 0, 0); lc.globalCompositeOperation = "source-over"; lc.clearRect(0, 0, lw, lh); lc.fillStyle = `rgba(4,8,6,${esc})`; lc.fillRect(0, 0, lw, lh); lc.globalCompositeOperation = "destination-out";
  const furo = (x, y, r, f = 1) => { const g = lc.createRadialGradient(x * k, y * k, 0, x * k, y * k, r * k); g.addColorStop(0, `rgba(0,0,0,${f})`); g.addColorStop(1, "rgba(0,0,0,0)"); lc.fillStyle = g; lc.fillRect((x - r) * k, (y - r) * k, r * 2 * k, r * 2 * k); };
  if (R.predio) furo(PX(CABANA.porta.x), PY(CABANA.porta.y + .6), TS * 2, .5); else furo(PX(R.eu.x), PY(R.eu.y) - TS * .4, TS * raioLuz(R) * (R.lanterna ? 1 : 1.3), R.lanterna ? 1 : .75);
  if (ou && ou.lugar === "mata" && !ou.predio) furo(PX(ou.eu.x), PY(ou.eu.y) - TS * .4, TS * raioLuz(ou), ou.lanterna ? 1 : .7);
  if (nt > .3) furo(PX(CABANA.x + CABANA.w / 2), PY(CABANA.y + CABANA.h * .7), TS * 3, .6);
  if (R.curu && R.curu.fase === "vem") furo(PX(R.curu.x), PY(R.curu.y) - TS, TS * 1.3, .8); // o cabelo de fogo ilumina
  c.drawImage(luzCv, 0, 0, W, H);
  c.fillStyle = "rgba(40,20,10,.08)"; c.fillRect(0, 0, W, H);
}
function desenharCabanaDentro(tm) {
  const s = Math.min(W / (CAB.w + 1.2), H / (CAB.h + 1.4)), ox = W / 2 - CAB.w / 2 * s, oy = H / 2 - CAB.h / 2 * s + s * .1, X = x => ox + x * s, Y = y => oy + y * s, nt = horaNoite();
  c.fillStyle = "#050505"; c.fillRect(0, 0, W, H);
  c.fillStyle = "#3a2a1a"; c.fillRect(X(0), Y(.9), CAB.w * s, (CAB.h - .9) * s); for (let i = 0; i < 11; i++) { c.fillStyle = i % 2 ? "rgba(0,0,0,.12)" : "rgba(255,255,255,.02)"; c.fillRect(X(0), Y(.9 + i * .43), CAB.w * s, .43 * s); }
  c.fillStyle = "#2a1e12"; c.fillRect(X(0), Y(0), CAB.w * s, .9 * s); for (let i = 0; i < 16; i++) { c.fillStyle = "rgba(0,0,0,.3)"; c.fillRect(X(i * .5), Y(0), 1.5, .9 * s); }
  c.fillStyle = nt > .5 ? "#04060c" : "#4a5a60"; c.fillRect(X(2.4), Y(.15), .9 * s, .55 * s); c.strokeStyle = "#140c06"; c.lineWidth = 3; c.strokeRect(X(2.4), Y(.15), .9 * s, .55 * s); // janela
  if (nt > .5 && Math.sin(tm * .6) > .85) { c.fillStyle = "rgba(255,255,255,.75)"; c.beginPath(); c.ellipse(X(2.85), Y(.45), .12 * s, .17 * s, 0, 0, 7); c.fill(); c.fillStyle = "#000"; c.fillRect(X(2.8), Y(.42), 2, 2); c.fillRect(X(2.9), Y(.42), 2, 2); } // rosto pálido na janela
  c.fillStyle = "#8a7a5a"; c.fillRect(X(5.3), Y(.12), .6 * s, .7 * s); c.fillStyle = "#c8b898"; c.fillRect(X(5.36), Y(.18), .48 * s, .58 * s); c.fillStyle = "#3a2a1a"; c.beginPath(); c.ellipse(X(5.6), Y(.4), .1 * s, .13 * s, 0, 0, 7); c.fill(); c.strokeStyle = "#1a0a0a"; c.lineWidth = 2; c.beginPath(); c.moveTo(X(5.45), Y(.3)); c.lineTo(X(5.75), Y(.5)); c.moveTo(X(5.75), Y(.3)); c.lineTo(X(5.45), Y(.5)); c.stroke(); // retrato da moça com o rosto riscado
  c.fillStyle = "#2a1a0e"; c.fillRect(X(-.2), Y(0), .2 * s, CAB.h * s); c.fillRect(X(CAB.w), Y(0), .2 * s, CAB.h * s); c.fillRect(X(-.2), Y(CAB.h), (CAB.porta.x - .6 + .2) * s, .2 * s); c.fillRect(X(CAB.porta.x + .6), Y(CAB.h), (CAB.w - CAB.porta.x - .6 + .2) * s, .2 * s);
  // móveis
  c.fillStyle = "#3a2414"; c.fillRect(X(.4), Y(.6), 2.1 * s, 1.5 * s); c.fillStyle = "#8a8070"; c.fillRect(X(.5), Y(.7), 1.9 * s, 1.3 * s); c.fillStyle = "#5a4a3a"; c.fillRect(X(.5), Y(1.2), 1.9 * s, .8 * s); c.fillStyle = "#c8c0b0"; c.fillRect(X(.6), Y(.75), .7 * s, .35 * s); c.fillStyle = "rgba(90,20,10,.6)"; c.beginPath(); c.ellipse(X(1.2), Y(1.5), .3 * s, .14 * s, .4, 0, 7); c.fill(); // cama com mancha
  c.fillStyle = "#4a3018"; c.fillRect(X(3.1), Y(.6), 1.8 * s, 1 * s); c.fillStyle = "#6a4a2a"; c.fillRect(X(3.1), Y(.6), 1.8 * s, .25 * s); c.fillStyle = "#e8dcb8"; c.fillRect(X(3.5), Y(.9), .5 * s, .35 * s); c.fillStyle = `rgba(255,190,90,${.8 + .2 * Math.sin(tm * 9)})`; c.beginPath(); c.arc(X(4.5), Y(.85), .08 * s, 0, 7); c.fill(); // mesa, papel e lamparina
  c.fillStyle = "#3a2414"; c.fillRect(X(6.5), Y(.5), 1.1 * s, 1.3 * s); for (let i = 0; i < 3; i++) { c.fillStyle = "#2a1a0e"; c.fillRect(X(6.5), Y(.8 + i * .35), 1.1 * s, 3); for (let b = 0; b < 4; b++) { c.fillStyle = ["#5a2a1a", "#2a3a4a", "#4a4a2a", "#6a5a3a"][(b + i) % 4]; c.fillRect(X(6.58 + b * .24), Y(.52 + i * .35), .18 * s, .26 * s); } } // estante
  c.fillStyle = "#4a3018"; c.fillRect(X(.5), Y(3.9), 1.3 * s, .8 * s); c.fillStyle = "#6a5030"; c.fillRect(X(.5), Y(3.9), 1.3 * s, .2 * s); c.fillStyle = "#8a7a4a"; c.fillRect(X(1.08), Y(4.1), .14 * s, .14 * s); // baú
  c.fillStyle = "#2a2a2a"; c.fillRect(X(6.4), Y(3.7), 1.2 * s, .9 * s); c.fillStyle = `rgba(255,120,30,${.5 + .3 * Math.sin(tm * 11)})`; c.fillRect(X(6.6), Y(4.1), .8 * s, .3 * s); // fogareiro aceso
  { const ax = X(ALCAPAO.x - .45), ay = Y(ALCAPAO.y - .3), aw = .9 * s, ah = .6 * s, aberto = ls("roca_alcapao"); c.fillStyle = "#1e140a"; c.fillRect(ax - 2, ay - 2, aw + 4, ah + 4);
    if (aberto) { c.fillStyle = "#020101"; c.fillRect(ax, ay, aw, ah); c.fillStyle = "#3a2614"; c.fillRect(ax, ay - ah * .9, aw, ah * .9); c.fillStyle = "#4a3018"; for (let i = 0; i < 3; i++) c.fillRect(ax + aw * .1, ay + ah * (.2 + i * .25), aw * .8, 2); if (Math.sin(tm * .9) > .93) { c.fillStyle = "rgba(240,240,230,.85)"; c.fillRect(ax + aw * .4, ay + ah * .6, 2, 2); c.fillRect(ax + aw * .55, ay + ah * .6, 2, 2); } }
    else { c.fillStyle = "#4a3220"; c.fillRect(ax, ay, aw, ah); c.fillStyle = "rgba(0,0,0,.35)"; for (let i = 1; i < 4; i++) c.fillRect(ax + aw * i / 4, ay, 1.5, ah); c.strokeStyle = "#6a6a6a"; c.lineWidth = 2; c.beginPath(); c.arc(ax + aw / 2, ay + ah * .5, .07 * s, 0, 7); c.stroke(); c.fillStyle = "#8a7a4a"; c.fillRect(ax + aw / 2 - .06 * s, ay + ah * .62, .12 * s, .12 * s); c.fillStyle = "rgba(0,0,0,.6)"; c.fillRect(ax, ay + ah - 2, aw, 2); } } // alçapão
  { const jx = X(JANELA_C.x - .5), jw = s, jy = Y(CAB.h - .12), jh = .36 * s; c.fillStyle = "#140c06"; c.fillRect(jx - 3, jy - 3, jw + 6, jh + 6); c.fillStyle = nt > .5 ? "#04060c" : "#5a6a70"; c.fillRect(jx, jy, jw, jh); c.fillStyle = "#140c06"; c.fillRect(jx + jw / 2 - 1.5, jy, 3, jh);
    if (R.curu && R.curu.fase === "porta" && Math.sin(tm * 2.3) > -.3) { c.fillStyle = "rgba(255,90,20,.8)"; c.beginPath(); c.ellipse(jx + jw * .35, jy + jh * .4, jw * .12, jh * .45, 0, 0, 7); c.fill(); } // o cabelo de fogo passando na janela
    c.fillStyle = "rgba(240,230,200,.6)"; c.font = `700 ${Math.round(s * .17)}px "JetBrains Mono", monospace`; c.textAlign = "center"; c.fillText("JANELA", X(JANELA_C.x), Y(CAB.h + .5)); c.textAlign = "start"; }
  c.fillStyle = "#5a4a3a"; c.fillRect(X(4.6), Y(1.9), .5 * s, .5 * s); // a cadeira sem poeira
  if (nt > .5) { const b = Math.sin(tm * 1.5) * .04 * s; c.save(); c.translate(X(4.85), Y(2.2)); c.rotate(b * .02); c.restore(); }
  const l = paginasVo(); PAGINAS_VO.forEach((p, i) => { if (l.includes(i)) return; const x = X(p.x), y = Y(p.y); c.fillStyle = `rgba(242,201,74,${.35 + .3 * Math.sin(tm * 3 + i)})`; c.beginPath(); c.arc(x, y, .07 * s, 0, 7); c.fill(); }); // brilhinho onde tem página
  c.fillStyle = "rgba(240,230,200,.6)"; c.font = `700 ${Math.round(s * .17)}px "JetBrains Mono", monospace`; c.textAlign = "center"; c.fillText("PORTA", X(CAB.porta.x), Y(CAB.h + .5)); c.fillText(`PÁGINAS ${l.length}/${PAGINAS_VO.length}`, X(CAB.w / 2), Y(-.25)); c.textAlign = "start";
  // poeira no ar e escuro nos cantos
  for (let i = 0; i < 30; i++) { c.fillStyle = "rgba(230,220,190,.25)"; c.fillRect(X((i * 1.37 + tm * .05) % CAB.w), Y(.9 + ((i * .73 + tm * .03) % (CAB.h - .9))), 1.5, 1.5); }
  const ou = R.outro; if (ou && ou.lugar === "mata" && ou.predio === "cabana") desenharVoce(X(ou.int.x), Y(ou.int.y), tm, { q: ou, dir: ou.int.dir || 1, s: s * 1.05, nome: R.online === "host" ? "Amigo(a)" : "Yasmin" });
  desenharVoce(X(R.int.x), Y(R.int.y), tm, { dir: R.int.dir || 1, s: s * 1.05 });
  const vg = c.createRadialGradient(X(4.5), Y(1), s, X(4), Y(3), s * 6); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, `rgba(0,0,0,${.55 + .25 * nt})`); c.fillStyle = vg; c.fillRect(0, 0, W, H);
}

/* ---------- ir e voltar ---------- */
function irVila() { if (!VILA) montarVila(); R.lugar = "vila"; R.predio = null; R.eu.x = 23; R.eu.y = .9; R.lanterna = R.lanterna && ehNoite(); cam.x = 23; cam.y = 6; R.fade = 1; S.porta(); efeito("Vila Sossego", "#e8e2d4"); hud(); if (!ls("roca_vila")) { ls("roca_vila", 1); setTimeout(() => R && falar(["Vila Sossego. A vó falava daqui como se fosse longe. É só descer a estrada.", "Alguém aqui tem que saber o que aconteceu com ela. E com o meu pai."], null, "Yasmin"), 900); } }
function voltarSitio() { R.lugar = "sitio"; R.predio = null; R.eu.x = 25.2; R.eu.y = 35.6; cam.x = 25.2; cam.y = 32; R.fade = 1; S.porta(); hud(); }
function entrarPredio(p) { R.predio = p.id; R.andar = 0; R.int = { x: 4.5, y: 5.4, dir: -1 }; S.porta(); if (ehNoite()) tocarTom(180, .8, { tipo: "sawtooth", vol: .03, ate: 120, lp: 600, wet: .6 }); hud(); }
function sairPredio() { const p = predio(R.predio), d = PORTA(p); R.predio = null; R.eu.x = d.x; R.eu.y = d.y + .3; S.porta(); hud(); }
function trocarAndar() { R.andar = R.andar ? 0 : 1; R.int = { x: 7.9, y: 2.9, dir: -1 }; R.fade = .6; for (let i = 0; i < 6; i++) tocarRuido(.06, { filtro: "lowpass", f: 500, vol: .12, quando: i * .13 }); }

/* ---------- conversar ---------- */
function conversar(n) {
  const o = npcOnde(n);
  if (o.dorme) { falar([n.sono[Math.floor(Math.random() * n.sono.length)]], null, n.nome + " (dormindo)"); return; }
  R.conv = R.conv || {}; const i = R.conv[n.id] || 0;
  const m = n.missao && MISSOES[n.missao], st = m && (R.missoes || {})[n.missao];
  if (m && !st && i >= 1) { falar([...m.pede, `(Missão: ${m.titulo}. Recompensa: ${m.premio}.)`], () => { missaoOp(n.missao, "aceitar"); efeito("Missão nova: " + m.titulo, "#f2c94a"); tocarTom(660, .2, { tipo: "triangle", vol: .05 }); }, n.nome); return; }
  if (m && st === "ativa" && m.pode()) { falar(m.feito, () => { missaoOp(n.missao, "entregar"); efeito("Missão cumprida! " + m.premio, "#9bd86b"); tocarTom(523, .25, { tipo: "triangle", vol: .05 }); tocarTom(784, .4, { tipo: "triangle", vol: .05, quando: .18 }); }, n.nome); return; }
  let lista = n.conversas[i];
  if (lista === "carta") { const p = pistas(); if (!p.pai_porta && !p.milharal) { falar(["Hoje não, querida. Volta outro dia.", "(Ela olha para a gaveta do balcão e não diz mais nada. Talvez ela fale se você souber mais do seu pai.)"], null, n.nome); return; }
    lista = ["Você andou perguntando do seu pai... então chegou a hora.", "A Benedita deixou isso comigo. Disse pra só entregar quando você perguntasse dele.", "CARTA: \"Yasmin, se você está lendo, eu já fui. Não procure seu pai na mata. O que voltar com a cara dele não é ele. Conserte a caminhonete e vá embora. Não olhe para trás na porteira. Te amo. — Vó\""]; }
  if (!lista) lista = [n.extra[Math.floor(Math.random() * n.extra.length)]];
  R.conv[n.id] = i + 1;
  if (m && st === "ativa") lista = [...lista, m.lembra];
  falar(lista, () => { if (n.pista && n.pista[0] === i) ganharPista(n); }, n.nome);
}
function cartaPara(n) { const mi = R.missoes || {}; if (mi.cartas !== "ativa" || !CARTA_FALAS[n.id] || ((R.mprog || {}).cartas || []).includes(n.id) || npcOnde(n).dorme) return null; return { t: "Entregar carta", loc: 1, fn: () => { falar([CARTA_FALAS[n.id]], null, n.nome); missaoOp("cartas", "prog", n.id); } }; }
function npcAqui() { // morador mais perto de você (no mesmo lugar)
  let melhor = null, md = 9; for (const n of NPCS) { const o = npcOnde(n); if (o.ausente) continue;
    if (R.predio) { if (!o.dentro || o.predio !== R.predio || o.andar !== R.andar) continue; const alvo = o.dorme ? { x: o.x, y: o.y + 1.3 } : R.predio === "igreja" ? { x: o.x, y: o.y + .9 } : (o.y < 2.3 ? { x: o.x, y: 3.25 } : o); const d = Math.hypot(alvo.x - R.int.x, alvo.y - R.int.y); if (d < 1.35 && d < md) { md = d; melhor = n; } }
    else { if (o.dentro) continue; const d = Math.hypot(o.x - R.eu.x, o.y - R.eu.y); if (d < 1.2 && d < md) { md = d; melhor = n; } } }
  return melhor;
}
function oQueFazerVila() {
  if (!R.predio && dist(R.eu, BUEIRO) < 1.3) return { t: "Descer no bueiro", fn: irEsgoto, loc: 1 };
  if (R.predio && ACOES_INT[R.predio]) { const a = ACOES_INT[R.predio](R.int, R.andar); if (a) return a; }
  if (R.predio) {
    const s = R.int;
    if (R.andar === 0 && s.y > 5.2 && Math.abs(s.x - 4.5) < 1) return { t: "Sair", fn: sairPredio, loc: 1 };
    if (Math.hypot(s.x - 7.9, s.y - 2.85) < 1) return { t: R.andar ? "Descer" : "Subir", fn: trocarAndar, loc: 1 };
    const n = npcAqui();
    if (n && cartaPara(n)) return cartaPara(n);
    if (n) { const o = npcOnde(n); if (o.dorme) return { t: "Ouvir", fn: () => conversar(n), loc: 1 }; if (n.loja && lojaAberta(n.casa)) return { t: "Loja", fn: () => abrirLoja(n), loc: 1 }; return { t: "Conversar", fn: () => conversar(n), loc: 1 }; }
    if (R.andar === 0 && Math.hypot(s.x - 3.5, s.y - 3.25) < 1.4 && predio(R.predio).balcao && !npcAqui()) return { t: "Balcão", fn: () => falar([ehNoite() ? "Não tem ninguém no balcão. Lá em cima, alguma coisa range." : "O balcão está vazio. Fechou cedo hoje."], null, "Yasmin"), loc: 1 };
    return null;
  }
  const p = R.eu;
  if (p.y < .7) return null;
  for (const q of VPREDIOS) { const d = PORTA(q); if (Math.hypot(p.x - d.x, p.y - d.y) < 1) return { t: ehNoite() ? "Entrar (escuro)" : "Entrar", fn: () => entrarPredio(q), loc: 1 }; }
  const n = npcAqui(); if (n && cartaPara(n)) return cartaPara(n); if (n) return { t: "Conversar", fn: () => conversar(n), loc: 1 };
  const mi = R.missoes || {}, mp = R.mprog || {}, yas = l => falar(l, null, "Yasmin");
  if (mi.flores === "ativa" && !mp.flores && Math.hypot(p.x - TOBIAS.x, p.y - TOBIAS.y) < 1.4) return { t: "Deixar flores", loc: 1, fn: () => { yas(["Você deixa as flores no túmulo da cruz torta.", "Por um instante, a terra parece respirar fundo. Lá de baixo, alguém diz: \"Obrigado.\""]); missaoOp("flores", "prog"); } };
  if (mi.novelo === "ativa" && !mp.novelo && Math.hypot(p.x - TAPERA.x, p.y - (TAPERA.y + .6)) < 1.7) return { t: "Pegar o Novelo", loc: 1, fn: () => { yas(["Um gatinho cinza, tremendo, encolhido dentro de um berço velho.", "Quando você pega o Novelo, o berço começa a balançar sozinho."]); missaoOp("novelo", "prog"); } };
  if (Math.hypot(p.x - CAPELINHA.x, p.y - (CAPELINHA.y + .7)) < 1.3) return { t: "Olhar", loc: 1, fn: () => yas([ehNoite() ? "As velas da capelinha estão acesas. Quem acendeu? Estavam apagadas de dia." : "Um oratório de beira de estrada. Dentro, uma santinha e a foto de uma menina de tranças. Embaixo: \"Maria, 1966\"."]) };
  if (Math.hypot(p.x - TAPERA.x, p.y - (TAPERA.y + .6)) < 1.7) return { t: "Olhar", loc: 1, fn: () => yas(["Uma tapera caída. Lá dentro tem um berço de madeira. Ainda tem lençol nele."]) };
  if (Math.hypot(p.x - FUSCA.x, p.y - (FUSCA.y + .5)) < 1.5) return { t: "Olhar", loc: 1, fn: () => yas(["Um fusca velho, comido de ferrugem. No banco de trás, um ursinho de pelúcia. Novo demais."]) };
  for (const [cx, cy, txt] of CRUZES) if (Math.hypot(p.x - cx, p.y - cy) < 1.1) return { t: "Olhar", loc: 1, fn: () => yas([`Uma cruz de beira de estrada: ${txt}.`]) };
  if (Math.hypot(p.x - 24.6, p.y - 2.9) < 1.1) return { t: "Ler", loc: 1, fn: () => falar(["VILA SOSSEGO · 1 KM. Embaixo, escrito à mão: \"DE DIA\"."], null, "Placa") };
  if (Math.hypot(p.x - ORELHAO.x, p.y - (ORELHAO.y + .4)) < 1.1) return orelhaoTocando() ? { t: "Atender", loc: 1, fn: () => falar(["(Chiado...)", "...Yasmin? Filha? É o pai. Eu tô pertinho. Deixa a porta aberta hoje, tá?", "(A voz ri. Não é a risada dele.)"], null, "Telefone") } : { t: "Telefone", loc: 1, fn: () => falar(["Você tira do gancho. Só chiado. E, do outro lado, alguém respirando bem devagar."], null, "Telefone") };
  for (const i of CARTAZES) { const [px, py] = VPOSTES[i]; if (Math.hypot(p.x - px, p.y - (py + .4)) < .9) return { t: "Ler cartaz", loc: 1, fn: () => falar(["DESAPARECIDA: Benedita Alves, 66 anos. Vista pela última vez no próprio sítio.", "DESAPARECIDO: Marcos Alves, 38 anos. Entrou na mata com uma lanterna. QUEM SOUBER, NÃO PROCURE."], null, "Cartaz") }; }
  if (Math.hypot(p.x - (VARAL_V.x0 + VARAL_V.x1) / 2, p.y - (VARAL_V.y + .3)) < 1.4) return { t: "Olhar", loc: 1, fn: () => yas(["No varal das gêmeas tem um vestido igualzinho ao meu. Do meu tamanho. Ainda molhado."]) };
  if (Math.hypot(p.x - CARROCA.x, p.y - (CARROCA.y + .5)) < 1.3) return { t: "Olhar", loc: 1, fn: () => yas(["Uma carroça cheia de palha. Por baixo, a ponta de uma botina. Melhor não mexer."]) };
  if (Math.hypot(p.x - 25.6, p.y - 21.4) < 1.1) return { t: "Ler", fn: () => falar(["VILA SOSSEGO · POPULAÇÃO 47. Alguém riscou o 47 e escreveu 46 com tinta vermelha. Embaixo: \"VOLTE ANTES DO ESCURO\"."], null, "Placa"), loc: 1 };
  if (Math.hypot(p.x - VFONTE.x, p.y - (VFONTE.y + 1)) < 1.4) return { t: "Olhar", fn: () => falar([ehNoite() ? "A fonte está cheia de novo. Mas não choveu. E a água está morna." : "A fonte está seca. A santa no meio dela não tem rosto. Alguém raspou com faca."], null, "Yasmin"), loc: 1 };
  if (p.x > VCEM.x0 - .6 && p.x < VCEM.x1 + .6 && Math.abs(p.y - VCEM.y0 + .3) < .7) return { t: "Olhar", fn: () => falar(["O cemitério da vila. Lá no fundo tem uma cova aberta, com uma plaquinha: 2026."], null, "Yasmin"), loc: 1 };
  return null;
}
function opcoesLoja(id) {
  const l = [], item = (nome, desc, preco, ok, fn) => l.push({ nome, desc, preco, ok: ok && R.moedas >= preco, fn });
  if (id === "armazem") { const v = Math.round(valorVenda() * 1.25); l.push({ nome: "Vender tudo", desc: v ? `O Joaquim paga ${v} moedas (25% a mais)` : "Você não tem nada para vender", preco: 0, ok: v > 0, fn: () => { R.moedas += Math.round(valorVenda() * 1.25); R.colheita = {}; R.peixes = {}; R.extra = {}; if (R.vara) { R.inv.graveto = 0; R.inv.folha = 0; } } });
    item("Lata de óleo", "Enche a lanterna e as lamparinas", 4, R.oleo < 100, () => { R.oleo = 100; R.lamparinas = R.lamparinas.map(() => 1); }); item("Sal grosso", "Na soleira: a Pisadeira demora o dobro para vir", 25, !R.sal, () => { R.sal = true; }); }
  if (id === "padaria") item("Broa de milho", "Fôlego sem fim por um tempo", 6, !(R.broa > 0), () => { R.broa = 45; });
  if (id === "costura") ROUPAS_LOJA.forEach(([k, nome, cor, , preco]) => { const tem = roupasCompradas().includes(k); l.push({ cor, nome: (R.roupa === k ? "✓ " : "") + nome, desc: tem ? "Já é sua: toque para vestir" : "Vestido feito no seu tamanho", preco: tem ? 0 : preco, ok: R.roupa !== k && (tem || R.moedas >= preco), fn: () => { R.roupa = k; const c2 = roupasCompradas(); if (!c2.includes(k)) { c2.push(k); ls("roca_roupas", JSON.stringify(c2)); } } }); });
  if (id === "ferreiro") { item("Enxada de aço", "As plantas crescem mais rápido", 70, !R.enxada, () => { R.enxada = true; }); item("Lampião de ferro", "Ilumina mais e gasta metade do óleo", 90, !R.lampiao, () => { R.lampiao = true; }); item("Ferradura na porta", "O lobisomem não vira perto da casa", 50, !R.ferradura, () => { R.ferradura = true; }); }
  if (id === "botica") { item("Garrafada", "Se um bicho te pegar, você volta uma vez", 40, !(R.garrafada > 0), () => { R.garrafada = 1; }); item("Raminho de arruda", "O Saci não rouba mais suas moedas", 30, !R.arruda, () => { R.arruda = true; }); }
  if (id === "igreja") item("Água benta", "O Corpo-Seco foge em vez de te pegar (uma vez)", 20, !(R.aguaBenta > 0), () => { R.aguaBenta = 1; });
  return l;
}
const ROUPAS_LOJA = [["vermelho", "Vestido vermelho", "#a02a2a", "#7a1e1e", 30], ["azul", "Vestido azul-noite", "#2a3a6a", "#1e2a50", 30], ["musgo", "Vestido verde-musgo", "#4a5a2a", "#38461e", 30], ["amarela", "Jardineira amarela", "#c8a030", "#a07e20", 30], ["luto", "Vestido de luto", "#1e1a1e", "#141014", 45]];
const roupasCompradas = () => { try { return JSON.parse(ls("roca_roupas") || "[]"); } catch (e) { return []; } };
function abrirLoja(n) {
  painelAberto = true; el.rcPainel.hidden = false; const id = n.casa, o = opcoesLoja(id), p = predio(id);
  el.rcPainel.innerHTML = `<div class="rc-caixa"><h2>${p.nome}</h2><p>${n.nome} · você tem <b style="color:#f2c94a">${R.moedas} moedas</b></p><div class="rc-grade">${o.map((x, i) => `<button type="button" class="rc-op" data-i="${i}" ${x.ok ? "" : "disabled"}>${icDe(x.nome, x.cor)}${x.nome}<small>${x.desc}${x.preco ? ` · ${x.preco} moedas` : ""}</small></button>`).join("")}</div>
    <div class="rc-linha"><button type="button" class="rc-op dest" id="rcConversar">Conversar</button><button type="button" class="rc-op" id="rcFechar">Fechar</button></div></div>`;
  el.rcPainel.querySelectorAll("[data-i]").forEach(b => b.addEventListener("click", () => { const x = o[+b.dataset.i];
    if (R.online === "guest") { enviar({ t: "compra", nome: x.nome.replace(/^✓ /, ""), loja: id }); b.disabled = true; tocarTom(900, .05, { vol: .05 }); setTimeout(() => painelAberto && document.getElementById("rcConversar") && abrirLoja(n), 400); return; }
    R.moedas -= x.preco; x.fn(); S.moedas(); hud(); abrirLoja(n); }));
  document.getElementById("rcConversar").addEventListener("click", () => { fecharPainel(); conversar(n); });
  document.getElementById("rcFechar").addEventListener("click", fecharPainel);
}

/* ---------- enfeites da estrada e da vila ---------- */
const orelhaoTocando = () => ehNoite() && (R.t % 41) < 7;
let ultimoToque = 0;
function decorVila(tm, obj) {
  const noite = horaNoite() > .5, at = (y, f) => obj.push([y, f]);
  // estrada: placa do quilômetro, capelinha, cruzes, fusca, tapera, ponte e portal
  at(2.5, () => { const x = PX(24.6), y = PY(2.5); if (!naTela(x, y)) return; c.fillStyle = "#3a2a1a"; c.fillRect(x - 2, y - TS * 1.1, 4, TS * 1.1); c.fillStyle = "#e8e2d0"; c.fillRect(x - TS * .55, y - TS * 1.15, TS * 1.1, TS * .42); c.fillStyle = "#1a1a1a"; c.font = `800 ${Math.round(TS * .13)}px "JetBrains Mono", monospace`; c.textAlign = "center"; c.fillText("VILA SOSSEGO", x, y - TS * .98); c.fillText("1 KM", x, y - TS * .82); c.fillStyle = "#a01e1e"; c.fillText("DE DIA", x + TS * .2, y - TS * .66); c.textAlign = "start"; });
  at(CAPELINHA.y + .1, () => { const x = PX(CAPELINHA.x), y = PY(CAPELINHA.y); if (!naTela(x, y)) return; sombra(x, y, TS * .4, TS * .1); c.fillStyle = "#5a3e24"; c.fillRect(x - 3, y - TS * .7, 6, TS * .7); c.fillStyle = "#d8d0c0"; c.fillRect(x - TS * .36, y - TS * 1.45, TS * .72, TS * .8); c.fillStyle = "#6a2a1e"; c.beginPath(); c.moveTo(x - TS * .46, y - TS * 1.42); c.lineTo(x, y - TS * 1.85); c.lineTo(x + TS * .46, y - TS * 1.42); c.fill();
    c.fillStyle = "#2a1e14"; c.fillRect(x - 1.5, y - TS * 2.15, 3, TS * .35); c.fillRect(x - TS * .12, y - TS * 2.05, TS * .24, 3); c.fillStyle = "#1a1410"; c.beginPath(); c.moveTo(x - TS * .22, y - TS * .75); c.lineTo(x - TS * .22, y - TS * 1.2); c.arc(x, y - TS * 1.2, TS * .22, PI, 0); c.lineTo(x + TS * .22, y - TS * .75); c.fill();
    c.fillStyle = "#e8e2d0"; c.beginPath(); c.arc(x, y - TS * 1.12, 3, 0, 7); c.fill(); c.fillRect(x - 3, y - TS * 1.06, 6, TS * .26); c.fillStyle = "#c8b890"; c.fillRect(x + TS * .06, y - TS * .95, TS * .12, TS * .15); // santinha e a foto
    for (let i = 0; i < 4; i++) { c.fillStyle = "#e8e2d0"; c.fillRect(x - TS * .5 + i * TS * .32, y + 2, 3, -7); if (noite) { c.fillStyle = `rgba(255,200,90,${.6 + .3 * Math.sin(tm * 11 + i)})`; c.beginPath(); c.ellipse(x - TS * .5 + i * TS * .32 + 1.5, y - 8, 1.6, 3, 0, 0, 7); c.fill(); } }
    for (let i = 0; i < 5; i++) { c.fillStyle = ["#a02a2a", "#e8d8a0", "#8a3a8a"][i % 3]; c.beginPath(); c.arc(x - TS * .3 + i * 6, y - TS * .62, 2.5, 0, 7); c.fill(); } });
  CRUZES.forEach(([cx, cy]) => at(cy, () => { const x = PX(cx), y = PY(cy); if (!naTela(x, y)) return; sombra(x, y, 7, 2.5); c.fillStyle = "#4a3420"; c.save(); c.translate(x, y); c.rotate(.12); c.fillRect(-2, -TS * .9, 4, TS * .9); c.fillRect(-TS * .22, -TS * .7, TS * .44, 4); c.fillStyle = "#c8281e"; c.fillRect(-1, -TS * .66, 3, TS * .3); c.restore(); for (let i = 0; i < 3; i++) { c.fillStyle = ["#e8d8a0", "#a02a2a", "#e8e2d8"][i]; c.beginPath(); c.arc(x - 5 + i * 5, y - 2, 2.4, 0, 7); c.fill(); } }));
  at(FUSCA.y + .1, () => { const x = PX(FUSCA.x), y = PY(FUSCA.y); if (!naTela(x, y, 80)) return; sombra(x, y, TS * 1.05, TS * .18); c.fillStyle = "#7a4a2a"; c.beginPath(); c.moveTo(x - TS * .95, y - TS * .1); c.quadraticCurveTo(x - TS * .95, y - TS * .6, x - TS * .5, y - TS * .7); c.quadraticCurveTo(x, y - TS * 1.15, x + TS * .5, y - TS * .7); c.quadraticCurveTo(x + TS * .95, y - TS * .6, x + TS * .95, y - TS * .1); c.fill();
    c.fillStyle = "rgba(60,30,14,.6)"; for (let i = 0; i < 7; i++) { c.beginPath(); c.arc(x - TS * .7 + i * TS * .23, y - TS * (.25 + (i % 3) * .14), 4 + (i % 2) * 3, 0, 7); c.fill(); } // ferrugem
    c.fillStyle = "#1a2028"; c.beginPath(); c.moveTo(x - TS * .42, y - TS * .68); c.quadraticCurveTo(x, y - TS * 1.02, x + TS * .42, y - TS * .68); c.fill(); c.strokeStyle = "rgba(220,230,240,.4)"; c.lineWidth = 1; c.beginPath(); c.moveTo(x - TS * .2, y - TS * .9); c.lineTo(x - TS * .05, y - TS * .72); c.lineTo(x + TS * .1, y - TS * .86); c.stroke(); // vidro quebrado
    c.fillStyle = "#141414"; c.fillRect(x - TS * .7, y - TS * .14, TS * .3, TS * .12); c.fillRect(x + TS * .4, y - TS * .14, TS * .3, TS * .12); c.fillStyle = "#c8a050"; c.beginPath(); c.arc(x + TS * .18, y - TS * .78, 3, 0, 7); c.fill(); // ursinho no banco de trás
    c.strokeStyle = "#4a6a2a"; c.lineWidth = 1.6; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(x - TS * .9 + i * TS * .35, y); c.quadraticCurveTo(x - TS * .85 + i * TS * .35, y - TS * .4, x - TS * .8 + i * TS * .35 + 3, y - TS * .55); c.stroke(); } });
  at(TAPERA.y + .1, () => { const x = PX(TAPERA.x), y = PY(TAPERA.y); if (!naTela(x, y, 120)) return; sombra(x, y, TS * 1.4, TS * .25); c.fillStyle = "#5a4430"; c.fillRect(x - TS * 1.3, y - TS * 1.1, TS * .9, TS * 1.1); c.fillRect(x + TS * .5, y - TS * .7, TS * .8, TS * .7);
    c.fillStyle = "#3a2a1a"; c.save(); c.translate(x - TS * .2, y - TS * .9); c.rotate(.35); c.fillRect(-TS * 1.2, -TS * .14, TS * 2.4, TS * .28); c.restore(); c.save(); c.translate(x + TS * .3, y - TS * .5); c.rotate(-.5); c.fillRect(-TS * .9, -TS * .1, TS * 1.8, TS * .2); c.restore();
    c.fillStyle = "#0a0806"; c.fillRect(x - TS * .4, y - TS * .8, TS * .9, TS * .8); c.strokeStyle = "#6a5a40"; c.lineWidth = 2; c.beginPath(); c.arc(x + TS * .05, y - TS * .25, TS * .22, 0, PI); c.stroke(); // berço lá dentro
    const nov = R.missoes && R.missoes.novelo === "ativa" && !R.mprog.novelo; if (nov) { c.fillStyle = "#8a8a8a"; c.beginPath(); c.ellipse(x + TS * .05, y - TS * .32, 7, 5, 0, 0, 7); c.fill(); c.beginPath(); c.arc(x + TS * .15, y - TS * .4, 4.5, 0, 7); c.fill(); c.fillStyle = "#c8f06a"; c.fillRect(x + TS * .12, y - TS * .42, 1.6, 1.6); c.fillRect(x + TS * .18, y - TS * .42, 1.6, 1.6); }
    else if (noite) { c.fillStyle = "rgba(240,240,230,.85)"; c.fillRect(x - TS * .1, y - TS * .55, 2.5, 2.5); c.fillRect(x + TS * .05, y - TS * .55, 2.5, 2.5); } });
  at(RIO_V.y1 + .4, () => { const x0 = PX(PONTE_V.x0), x1 = PX(PONTE_V.x1); c.fillStyle = "#4a3018"; for (const yy of [RIO_V.y0 - .35, RIO_V.y1 + .35]) { for (let x = PONTE_V.x0; x <= PONTE_V.x1 + .01; x += .65) c.fillRect(PX(x) - 2, PY(yy) - TS * .4, 4, TS * .4); c.fillRect(x0, PY(yy) - TS * .38, x1 - x0, 3); } });
  at(20.5, () => { const x0 = PX(21.4), x1 = PX(24.6), y = PY(20.4); if (!naTela((x0 + x1) / 2, y, 200)) return; c.fillStyle = "#4a3420"; c.fillRect(x0 - 4, y - TS * 2.2, 8, TS * 2.2); c.fillRect(x1 - 4, y - TS * 2.2, 8, TS * 2.2); c.fillRect(x0 - TS * .3, y - TS * 2.25, x1 - x0 + TS * .6, 7);
    c.fillStyle = "#5a4028"; c.fillRect((x0 + x1) / 2 - TS * .95, y - TS * 2.05, TS * 1.9, TS * .42); c.fillStyle = "#e8d8b0"; c.font = `800 ${Math.round(TS * .2)}px "Big Shoulders Display", sans-serif`; c.textAlign = "center"; c.fillText("VILA SOSSEGO", (x0 + x1) / 2, y - TS * 1.75); c.textAlign = "start";
    c.strokeStyle = "rgba(200,190,170,.5)"; c.lineWidth = 1; c.beginPath(); c.moveTo((x0 + x1) / 2 + TS * .6, y - TS * 1.63); c.lineTo((x0 + x1) / 2 + TS * .6, y - TS * 1.2 + Math.sin(tm) * 3); c.stroke(); c.fillStyle = "#c8b890"; c.fillRect((x0 + x1) / 2 + TS * .55, y - TS * 1.2 + Math.sin(tm) * 3, 4, 7); }); // um sapatinho pendurado
  at(21, () => { const x = PX(25.6), y = PY(21); if (!naTela(x, y)) return; c.fillStyle = "#3a2a1a"; c.fillRect(x - 2, y - TS * 1.2, 4, TS * 1.2); c.fillStyle = "#5a4028"; c.fillRect(x - TS * .7, y - TS * 1.25, TS * 1.4, TS * .55); c.fillStyle = "#e8d8b0"; c.font = `700 ${Math.round(TS * .14)}px "JetBrains Mono", monospace`; c.textAlign = "center"; c.fillText("POP. 47", x, y - TS * .95); c.strokeStyle = "#a01e1e"; c.lineWidth = 2; c.beginPath(); c.moveTo(x - TS * .1, y - TS * .99); c.lineTo(x + TS * .42, y - TS * .92); c.stroke(); c.fillStyle = "#c82a1e"; c.fillText("46", x + TS * .3, y - TS * .78); c.textAlign = "start"; });
  // vila: orelhão, cartazes, carroça, barris, varal, bandeirinhas, a cruz do Tobias, gato no telhado
  at(ORELHAO.y, () => { const x = PX(ORELHAO.x), y = PY(ORELHAO.y); if (!naTela(x, y)) return; const tr = orelhaoTocando() ? Math.sin(tm * 60) * 1.2 : 0; sombra(x, y, 8, 3); c.fillStyle = "#4a4a4a"; c.fillRect(x - 2, y - TS * 1.1, 4, TS * 1.1); c.fillStyle = "#e07a1a"; c.beginPath(); c.ellipse(x + tr, y - TS * 1.35, TS * .36, TS * .42, 0, PI, 0); c.fill(); c.fillRect(x - TS * .36 + tr, y - TS * 1.36, TS * .72, TS * .32);
    c.fillStyle = "#2a3a6a"; c.fillRect(x - TS * .12 + tr, y - TS * 1.3, TS * .24, TS * .26); c.fillStyle = "#1a1a1a"; c.fillRect(x - TS * .06 + tr, y - TS * 1.05 + (orelhaoTocando() ? Math.sin(tm * 30) * 2 : 0), TS * .12, TS * .3); });
  CARTAZES.forEach(i => { const [px, py] = VPOSTES[i]; at(py + .01, () => { const x = PX(px), y = PY(py); if (!naTela(x, y)) return; c.fillStyle = "#e8e2c8"; c.fillRect(x - 6, y - TS * 1.25, 12, 15); c.fillStyle = "#2a2a2a"; c.fillRect(x - 4, y - TS * 1.22, 8, 6); c.fillStyle = "#a01e1e"; c.fillRect(x - 5, y - TS * 1.25 + 10, 10, 2); }); });
  at(CARROCA.y, () => { const x = PX(CARROCA.x), y = PY(CARROCA.y); if (!naTela(x, y, 80)) return; sombra(x, y, TS * .9, TS * .15); c.fillStyle = "#6a4a2a"; c.fillRect(x - TS * .8, y - TS * .75, TS * 1.6, TS * .4); c.strokeStyle = "#4a3018"; c.lineWidth = 2; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(x - TS * .8 + i * TS * .4, y - TS * .75); c.lineTo(x - TS * .8 + i * TS * .4, y - TS * .35); c.stroke(); }
    c.strokeStyle = "#3a2414"; c.lineWidth = 3; c.beginPath(); c.arc(x - TS * .45, y - TS * .25, TS * .25, 0, 7); c.stroke(); c.beginPath(); c.arc(x + TS * .45, y - TS * .25, TS * .25, 0, 7); c.stroke(); c.beginPath(); c.moveTo(x - TS * .8, y - TS * .5); c.lineTo(x - TS * 1.4, y - TS * .2); c.stroke();
    c.fillStyle = "#c8a050"; c.beginPath(); c.ellipse(x, y - TS * .82, TS * .6, TS * .16, 0, 0, 7); c.fill(); });
  BARRIS.forEach(([bx, by]) => at(by, () => { const x = PX(bx), y = PY(by); if (!naTela(x, y)) return; sombra(x, y, 9, 3); c.fillStyle = "#6a4426"; c.fillRect(x - TS * .22, y - TS * .55, TS * .44, TS * .55); c.fillStyle = "#3a3a3a"; c.fillRect(x - TS * .23, y - TS * .48, TS * .46, 3); c.fillRect(x - TS * .23, y - TS * .14, TS * .46, 3); c.fillStyle = "#8a6036"; c.beginPath(); c.ellipse(x, y - TS * .55, TS * .22, TS * .07, 0, 0, 7); c.fill(); }));
  at(VARAL_V.y, () => { const x0 = PX(VARAL_V.x0), x1 = PX(VARAL_V.x1), y = PY(VARAL_V.y); if (!naTela((x0 + x1) / 2, y, 300)) return; c.fillStyle = "#4a3420"; c.fillRect(x0 - 2, y - TS * 1.3, 4, TS * 1.3); c.fillRect(x1 - 2, y - TS * 1.3, 4, TS * 1.3); c.strokeStyle = "#c8c0b0"; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, y - TS * 1.25); c.quadraticCurveTo((x0 + x1) / 2, y - TS * 1.1, x1, y - TS * 1.25); c.stroke();
    [["#e8e2d8", .14], ["#a85a5a", .3], ["#b8485a", .5], ["#e8e2d8", .68], ["#5a7a9a", .84]].forEach(([cor, f], i) => { const xx = mix(x0, x1, f), bal = Math.sin(tm * 1.5 + i) * 3; c.fillStyle = cor; if (i === 2) { c.beginPath(); c.moveTo(xx - 6, y - TS * 1.18); c.lineTo(xx + 6, y - TS * 1.18); c.lineTo(xx + 10 + bal, y - TS * .6); c.lineTo(xx - 10 + bal, y - TS * .6); c.fill(); } else c.fillRect(xx - 9 + bal * .3, y - TS * 1.18, 18, TS * .38); }); }); // tem um vestido igual ao seu
  at(VCEM.y0 + .95, () => { const x = PX(TOBIAS.x), y = PY(VCEM.y0 + .95); if (!naTela(x, y)) return; c.save(); c.translate(x, y); c.rotate(.3); c.fillStyle = "#6a6458"; c.fillRect(-2.5, -TS * .75, 5, TS * .75); c.fillRect(-TS * .2, -TS * .58, TS * .4, 4); c.restore(); if (R.mprog && R.mprog.flores) for (let i = 0; i < 5; i++) { c.fillStyle = ["#e8e2d8", "#e8d8a0", "#c87aa0"][i % 3]; c.beginPath(); c.arc(x - 8 + i * 4, y - 2, 2.6, 0, 7); c.fill(); } });
  at(99, () => { // bandeirinhas rasgadas sobre a praça (por cima de tudo)
    const fio = (xa, ya, xb, yb, sem) => { c.strokeStyle = "rgba(30,30,30,.7)"; c.lineWidth = 1; c.beginPath(); c.moveTo(PX(xa), PY(ya) - TS * 1.6); c.quadraticCurveTo(PX((xa + xb) / 2), PY((ya + yb) / 2) - TS * 1.2, PX(xb), PY(yb) - TS * 1.6); c.stroke();
      for (let i = 1; i < 14; i++) { if ((i * 7 + sem) % 5 === 0) continue; const f = i / 14, x = mix(PX(xa), PX(xb), f), y = mix(PY(ya), PY(yb), f) - TS * 1.6 + Math.sin(f * PI) * TS * .4 * .95, bal = Math.sin(tm * 2 + i) * 2; c.fillStyle = ["#c8281e", "#e8c030", "#2a6aa8", "#3a8a3a", "#e8e2d8"][(i + sem) % 5]; c.beginPath(); c.moveTo(x - 4, y); c.lineTo(x + 4, y); c.lineTo(x + bal, y + 9 + (i % 4 === 0 ? 6 : 0)); c.fill(); } };
    fio(16.8, 30.4, 29.2, 30.4, 1); fio(16.8, 35.8, 29.2, 35.8, 3); fio(16.8, 30.4, 29.2, 35.8, 2); });
  [["costura", .3], ["nena", .7]].forEach(([id, fx]) => { const p = predio(id); at(p.y - 1.5, () => { const x = PX(p.x + p.w * fx), y = PY(p.y) - TS * 1.45; if (!naTela(x, y)) return; c.fillStyle = "#0a0a0c"; c.beginPath(); c.ellipse(x, y, 8, 5, 0, 0, 7); c.fill(); c.beginPath(); c.arc(x + 7, y - 5, 4.5, 0, 7); c.fill(); c.beginPath(); c.moveTo(x + 4, y - 8); c.lineTo(x + 5, y - 12); c.lineTo(x + 7, y - 9); c.moveTo(x + 8, y - 9); c.lineTo(x + 10, y - 12); c.lineTo(x + 10.5, y - 8); c.fill(); c.strokeStyle = "#0a0a0c"; c.lineWidth = 2; c.beginPath(); c.moveTo(x - 7, y); c.quadraticCurveTo(x - 14, y + 2 + Math.sin(tm * 2) * 3, x - 12, y + 9); c.stroke(); if (horaNoite() > .3) { c.fillStyle = "#c8f06a"; c.fillRect(x + 5.5, y - 6, 1.6, 1.6); c.fillRect(x + 8.5, y - 6, 1.6, 1.6); } }); });
  { const p = predio("coveiro"); at(p.y + p.h + .01, () => { const x = PX(p.x + p.w * .5), y = PY(p.y + p.h * .3); if (!naTela(x, y)) return; c.fillStyle = "rgba(160,20,20,.75)"; c.font = `900 ${Math.round(TS * .3)}px "Big Shoulders Display", sans-serif`; c.textAlign = "center"; c.fillText("ELA VÊ", x, y); c.textAlign = "start"; }); }
}
function desenharVagalumesENevoa(tm) {
  const nt = horaNoite(); if (nt < .4) return;
  c.save(); c.globalCompositeOperation = "lighter";
  VILA.vaga.forEach(v => { const x = PX(v.x + Math.sin(tm * .4 + v.f) * .8), y = PY(v.y + Math.cos(tm * .33 + v.f) * .6); if (!naTela(x, y, 20)) return; const a = (.5 + .5 * Math.sin(tm * 3 + v.f * 3)) * nt; c.fillStyle = `rgba(200,255,120,${a * .9})`; c.beginPath(); c.arc(x, y, 1.8, 0, 7); c.fill(); c.fillStyle = `rgba(200,255,120,${a * .2})`; c.beginPath(); c.arc(x, y, 6, 0, 7); c.fill(); });
  c.restore();
  if (R.eu.y < 23) for (let i = 0; i < 7; i++) { const x = PX(((tm * .3 + i * 7.3) % 40) - 8), y = PY(3 + i * 2.6); c.fillStyle = `rgba(170,180,200,${.06 * nt})`; c.beginPath(); c.ellipse(x, y, TS * 4, TS * .7, 0, 0, 7); c.fill(); }
}

/* ---------- desenho da vila ---------- */
const luzesVila = () => { const k = R.t % CICLO; return k > DIA - 16 && k < DIA + 6; }; // acendem no fim da tarde e APAGAM quando a noite fecha
const apagaUm = i => { const k = R.t % CICLO; return k > DIA + 1 + i * .6; };
function desenharNpc(n, x, y, s, tm, o = {}) {
  if (n.look.gemeas && !o.uma) { desenharNpc(n, x - s * .17, y, s, tm, { ...o, uma: 1 }); desenharNpc(n, x + s * .17, y + 1, s, tm + 1.3, { ...o, uma: 1 }); return; }
  if (n.look.fantasma) { c.save(); c.globalAlpha = .6 + .2 * Math.sin(tm * 2); y -= 4 + Math.sin(tm * 1.5) * 3; }
  const L = n.look, k = s / 48 * (L.crianca ? .8 : L.grande ? 1.1 : 1), dir = o.dir || 1, an = o.anda ? Math.sin(tm * 9 + n.id.length) : 0, bob = o.anda ? Math.abs(an) * 1.2 : Math.sin(tm * 2 + n.id.length) * .35;
  const rr = (x0, y0, w, h, r) => { c.beginPath(); c.roundRect ? c.roundRect(x0, y0, w, h, r) : c.rect(x0, y0, w, h); c.fill(); };
  const escurece = (hex, f = .72) => { const v = parseInt(hex.slice(1), 16); return `rgb(${Math.round((v >> 16) * f)},${Math.round(((v >> 8) & 255) * f)},${Math.round((v & 255) * f)})`; };
  sombra(x, y, 12 * k, 4 * k); c.save(); c.translate(x, y); c.scale(dir * k, k); if (L.velho) c.rotate(.05 * dir);
  const larg = L.magra ? 7 : L.grande ? 10.5 : 8.5, sapato = "#3a2214";
  // pernas e sapatos
  if (!L.batina) { c.fillStyle = L.crianca || L.saia ? L.pele : (L.calca || "#3e3a44"); c.fillRect(-5 + an * 2.4, -12, 4, 9); c.fillRect(1 - an * 2.4, -12, 4, 9); if (L.crianca) { c.fillStyle = "#e8e4d8"; c.fillRect(-5 + an * 2.4, -6, 4, 3); c.fillRect(1 - an * 2.4, -6, 4, 3); } }
  c.fillStyle = sapato; rr(-6.5 + an * 2.4, -3.5, 6.5, 3.5, 1.5); rr(-.5 - an * 2.4, -3.5, 6.5, 3.5, 1.5);
  // corpo
  c.fillStyle = L.roupa; if (L.batina) rr(-larg, -31 - bob, larg * 2, 29, 4); else rr(-larg, -31 - bob, larg * 2, 20, 4.5);
  if (L.saia) { c.beginPath(); c.moveTo(-larg + 1, -18 - bob); c.lineTo(larg - 1, -18 - bob); c.lineTo(larg + 2, -9 - bob * .5); c.lineTo(-larg - 2, -9 - bob * .5); c.fill(); }
  c.fillStyle = "rgba(255,255,255,.16)"; c.fillRect(-larg + 2, -30 - bob, larg * 2 - 4, 2); c.fillStyle = "rgba(0,0,0,.14)"; c.fillRect(-larg, -14 - bob, larg * 2, 3); // luz e sombra na roupa
  c.fillStyle = escurece(L.roupa, .6); c.beginPath(); c.moveTo(-3, -31 - bob); c.lineTo(0, -27 - bob); c.lineTo(3, -31 - bob); c.fill(); // golinha
  if (!L.avental && !L.batina) { c.fillStyle = "rgba(255,255,255,.55)"; c.fillRect(-.6, -26 - bob, 1.2, 1.2); c.fillRect(-.6, -22 - bob, 1.2, 1.2); }
  if (L.batina) { c.fillStyle = "#e8e2d8"; c.fillRect(-2, -31 - bob, 4, 2.5); c.fillStyle = "#c8a050"; c.fillRect(-.7, -24 - bob, 1.4, 6); c.fillRect(-2.5, -22 - bob, 5, 1.4); }
  if (L.avental) { c.fillStyle = L.avental; rr(-larg + 2, -25 - bob, larg * 2 - 4, 16, 3); c.fillStyle = escurece(L.avental, .82); c.fillRect(-3, -19 - bob, 6, 4); c.fillRect(-larg + 2, -25 - bob, larg * 2 - 4, 1.5); }
  // braços com mãozinhas
  [[larg - .5, an * .5], [-larg + .5, -an * .5]].forEach(([bx, rot]) => { c.save(); c.translate(bx, -29.5 - bob); c.rotate(rot); c.fillStyle = L.roupa; rr(-2.8, 0, 5.6, 7, 2.2); c.fillStyle = L.pele; c.beginPath(); c.arc(0, 9.5, 2.4, 0, 7); c.fill(); c.restore(); });
  if (L.pa) { c.strokeStyle = "#6a4a2a"; c.lineWidth = 2; c.beginPath(); c.moveTo(larg + 2, -34); c.lineTo(larg + 5, -2); c.stroke(); c.fillStyle = "#7a7a7a"; c.fillRect(larg + 2, -4, 7, 6); }
  if (L.bolsa) { c.fillStyle = "#6a4a2a"; rr(-13, -24, 8, 9, 2); c.strokeStyle = "#4a3018"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-8, -24); c.lineTo(5, -33); c.stroke(); c.fillStyle = "#e8e2d0"; c.fillRect(-11, -26, 6, 3); }
  // cabeça (do mesmo jeitinho da Yasmin)
  const hy = -38 - bob; c.fillStyle = L.pele; c.beginPath(); c.arc(0, hy, 8.2, 0, 7); c.fill();
  if (!L.careca) { c.fillStyle = L.cabelo; c.beginPath(); c.arc(-1, hy - 1.5, 8.6, PI * .95, PI * 2.12); c.fill(); c.beginPath(); c.ellipse(-6, hy + 2, 3.4, L.curto ? 4 : 6, .2, 0, 7); c.fill(); if (L.coque) { c.beginPath(); c.arc(-5, hy - 9, 4.2, 0, 7); c.fill(); c.fillStyle = "rgba(255,255,255,.18)"; c.beginPath(); c.arc(-6, hy - 10, 1.6, 0, 7); c.fill(); } }
  else { c.fillStyle = L.cabelo; c.beginPath(); c.ellipse(-6.6, hy + 1, 2.4, 3.6, .2, 0, 7); c.fill(); c.fillStyle = "rgba(255,255,255,.25)"; c.beginPath(); c.ellipse(-1, hy - 5.5, 3, 1.4, -.3, 0, 7); c.fill(); }
  c.fillStyle = L.pele; c.beginPath(); c.ellipse(3.5, hy + 1.5, 5.2, 5, 0, 0, 7); c.fill(); // rosto
  if (!L.careca) { c.fillStyle = L.cabelo; c.beginPath(); c.ellipse(4, hy - 4.6, 5.4, 2.2, -.1, PI, 0); c.fill(); } // franjinha
  const olha = Math.sign((R.predio ? R.int.x : R.eu.x) - (o.wx ?? 0)) * dir * .5, pisca = Math.sin(tm * 1.3 + n.id.length * 2) > .985;
  if (L.fantasma) { c.fillStyle = "#050507"; c.beginPath(); c.ellipse(2.6, hy, 1.7, 2.3, 0, 0, 7); c.ellipse(6.6, hy, 1.5, 2.1, 0, 0, 7); c.fill(); }
  else if (pisca) { c.strokeStyle = "#1a1210"; c.lineWidth = 1; c.beginPath(); c.moveTo(1.4, hy); c.lineTo(3.8, hy); c.moveTo(5.5, hy); c.lineTo(7.7, hy); c.stroke(); }
  else { const ol = L.velho ? 1.05 : 1.35; c.fillStyle = "#1a1210"; c.beginPath(); c.arc(2.6 + olha, hy, ol, 0, 7); c.arc(6.6 + olha, hy, ol * .9, 0, 7); c.fill(); c.fillStyle = "#fff"; c.beginPath(); c.arc(3 + olha, hy - .6, .5, 0, 7); c.arc(7 + olha, hy - .6, .45, 0, 7); c.fill(); }
  c.strokeStyle = L.careca ? "rgba(60,40,30,.7)" : escurece(L.cabelo, .8); c.lineWidth = .9; c.beginPath(); c.moveTo(1.3, hy - 2.6); c.lineTo(3.7, hy - 2.9); c.moveTo(5.6, hy - 2.9); c.lineTo(7.8, hy - 2.6); c.stroke(); // sobrancelhas
  if (L.velho) { c.strokeStyle = "rgba(120,70,50,.45)"; c.lineWidth = .7; c.beginPath(); c.moveTo(8.6, hy - .5); c.lineTo(9.6, hy - 1.2); c.moveTo(8.6, hy + .6); c.lineTo(9.6, hy + .9); c.stroke(); }
  c.fillStyle = "rgba(230,110,100,.38)"; c.beginPath(); c.arc(.8, hy + 3, 1.7, 0, 7); c.arc(8, hy + 3, 1.3, 0, 7); c.fill(); // bochechas
  c.strokeStyle = "#8a3a2a"; c.lineWidth = 1; c.beginPath(); c.moveTo(3.3, hy + 3.9); c.quadraticCurveTo(4.6, hy + 4.3, 5.9, hy + 3.9); c.stroke(); // boquinha séria
  if (L.oculos) { c.strokeStyle = "#5a5a62"; c.lineWidth = .9; c.beginPath(); c.arc(2.6, hy, 2.3, 0, 7); c.moveTo(8.9, hy); c.arc(6.6, hy, 2.3, 0, 7); c.moveTo(4.9, hy); c.lineTo(4.3, hy); c.stroke(); c.fillStyle = "rgba(255,255,255,.2)"; c.beginPath(); c.arc(2, hy - .8, 1, 0, 7); c.fill(); }
  if (L.bigode) { c.fillStyle = L.cabelo === "#c8c8c8" ? "#e0e0e0" : escurece(L.cabelo, .9); c.beginPath(); c.ellipse(3.6, hy + 3.1, 2.4, 1.2, .2, 0, 7); c.ellipse(6.4, hy + 3.1, 2.2, 1.1, -.2, 0, 7); c.fill(); }
  if (L.barba) { c.fillStyle = L.cabelo; c.beginPath(); c.ellipse(4, hy + 4.6, 5.6, 3.4, 0, 0, PI); c.fill(); c.beginPath(); c.ellipse(-.5, hy + 2.5, 1.8, 3, 0, 0, 7); c.fill(); }
  if (L.lenco) { c.fillStyle = L.lenco; c.beginPath(); c.arc(0, hy - 1.8, 9, PI * .9, PI * 2.08); c.fill(); c.beginPath(); c.moveTo(-8, hy); c.lineTo(-12, hy + 4); c.lineTo(-9, hy + 5); c.fill(); c.fillStyle = "rgba(255,255,255,.35)"; for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(-5 + i * 3.4, hy - 6 + Math.abs(i - 1.5) * .8, .8, 0, 7); c.fill(); } }
  if (L.chapeu || L.palha) { const ch = L.chapeu || "#d8b060"; c.fillStyle = ch; c.beginPath(); c.ellipse(0, hy - 7, 13.5, 3.4, 0, 0, 7); c.fill(); c.beginPath(); c.ellipse(0, hy - 10.5, 7.2, 5.2, 0, PI, 0); c.fill(); c.fillRect(-7.2, hy - 10.5, 14.4, 4); c.fillStyle = escurece(ch, .6); c.fillRect(-7.2, hy - 8.6, 14.4, 1.8); if (L.palha) { c.strokeStyle = "rgba(0,0,0,.15)"; c.lineWidth = .8; for (let i = -12; i < 13; i += 4) { c.beginPath(); c.moveTo(i, hy - 8); c.lineTo(i * .9, hy - 6); c.stroke(); } } }
  if (L.bone) { c.fillStyle = L.bone; c.beginPath(); c.arc(0, hy - 2.5, 8.7, PI, 0); c.fill(); c.beginPath(); c.ellipse(8, hy - 3, 6.5, 1.8, .05, 0, 7); c.fill(); c.fillStyle = "rgba(255,255,255,.3)"; c.beginPath(); c.arc(0, hy - 11, 1.2, 0, 7); c.fill(); }
  if (L.fantasma) { c.fillStyle = L.cabelo; for (const k2 of [-1, 1]) { c.beginPath(); c.ellipse(k2 * 7, hy + 5, 2.4, 8, 0, 0, 7); c.fill(); } }
  c.restore(); if (L.fantasma) c.restore();
}
function desenharPredioFora(p, tm) {
  const x = PX(p.x), y = PY(p.y), w = p.w * TS, h = p.h * TS; if (!naTela(x + w / 2, y + h / 2, w * 1.3)) return;
  sombra(x + w / 2, y + h + 3, w * .58, TS * .3, .35);
  const lit = luzesVila() && !apagaUm(VPREDIOS.indexOf(p)), noite = horaNoite();
  if (p.igreja) return desenharIgrejaFora(p, x, y, w, h, tm, lit);
  const meio = y + h * .46;
  c.fillStyle = p.cor2; c.fillRect(x, y, w, h * .46); c.fillStyle = "rgba(0,0,0,.12)"; for (let i = 0; i < 6; i++) c.fillRect(x + (i * .37 % 1) * w, y + h * (.05 + (i % 3) * .12), w * .1, h * .04); // reboco descascando
  c.fillStyle = p.cor; c.fillRect(x, meio, w, h * .54); c.strokeStyle = "rgba(0,0,0,.25)"; c.lineWidth = 1; for (let i = 1; i < 6; i++) { c.beginPath(); c.moveTo(x, meio + i * h * .09); c.lineTo(x + w, meio + i * h * .09); c.stroke(); }
  c.fillStyle = "rgba(0,0,0,.35)"; c.fillRect(x, meio - 3, w, 5); // beiral entre os andares
  // telhado
  c.fillStyle = p.tel; c.beginPath(); c.moveTo(x - TS * .3, y + 4); c.lineTo(x + TS * .5, y - TS * 1.7); c.lineTo(x + w - TS * .5, y - TS * 1.7); c.lineTo(x + w + TS * .3, y + 4); c.fill();
  c.strokeStyle = "rgba(0,0,0,.3)"; c.lineWidth = 2; for (let i = 1; i < 5; i++) { const yy = y - TS * 1.7 + i * TS * .36; c.beginPath(); c.moveTo(x - TS * .3 + (1 - i / 5) * TS * .8, yy); c.lineTo(x + w + TS * .3 - (1 - i / 5) * TS * .8, yy); c.stroke(); }
  if (p.chamine) { c.fillStyle = "#5a4a3a"; c.fillRect(x + w * .74, y - TS * 2.1, TS * .4, TS * .8); if (!ehNoite()) for (let i = 0; i < 4; i++) { const f = (tm * .4 + i * .25) % 1; c.fillStyle = `rgba(200,200,200,${.25 * (1 - f)})`; c.beginPath(); c.arc(x + w * .74 + TS * .2 + f * 14, y - TS * 2.2 - f * TS * 1.2, 5 + f * 10, 0, 7); c.fill(); } }
  // janelas de cima (o quarto)
  [[.18, .1], [.62, .1]].forEach(([fx, fy], i) => { const jx = x + w * fx, jy = y + h * fy, jw = w * .2, jh = h * .26;
    c.fillStyle = lit ? `rgba(255,${190 + Math.sin(tm * 6 + i) * 10},110,.9)` : "#0c1018"; c.fillRect(jx, jy, jw, jh); c.strokeStyle = "#2a1a10"; c.lineWidth = 2.5; c.strokeRect(jx, jy, jw, jh); c.beginPath(); c.moveTo(jx + jw / 2, jy); c.lineTo(jx + jw / 2, jy + jh); c.stroke();
    c.fillStyle = p.tel; c.fillRect(jx - 5, jy, 5, jh); c.fillRect(jx + jw, jy, 5, jh); // venezianas
    if (!lit && noite > .6 && Math.sin(tm * .35 + VPREDIOS.indexOf(p) * 2.1 + i) > .985) { c.fillStyle = "rgba(0,0,0,.95)"; c.beginPath(); c.arc(jx + jw / 2, jy + jh * .5, jw * .22, 0, 7); c.fill(); c.fillRect(jx + jw * .3, jy + jh * .6, jw * .4, jh * .4); } }); // alguém olhando
  // térreo: porta, vitrine e placa
  const px = x + w / 2, py = y + h; c.fillStyle = "#2a180e"; c.fillRect(px - TS * .42, py - h * .42, TS * .84, h * .42); c.fillStyle = "#4a2a18"; c.fillRect(px - TS * .36, py - h * .4, TS * .72, h * .4); c.fillStyle = "#c8a050"; c.beginPath(); c.arc(px + TS * .22, py - h * .2, 2.4, 0, 7); c.fill();
  const vx = x + w * .07, vy = meio + h * .12, vw = w * .26, vh = h * .24; c.fillStyle = lit ? "rgba(255,200,120,.85)" : ehNoite() ? "#0a0c10" : "#8aa0b0"; c.fillRect(vx, vy, vw, vh);
  if (!ehNoite() || lit) for (let i = 0; i < 6; i++) { c.fillStyle = p.vit[i % 3]; c.fillRect(vx + 3 + (i % 3) * vw * .31, vy + vh * (i < 3 ? .2 : .6), vw * .22, vh * .26); }
  c.strokeStyle = "#2a1a10"; c.lineWidth = 3; c.strokeRect(vx, vy, vw, vh);
  c.fillStyle = "#0a0c10"; c.fillRect(x + w * .72, vy, w * .18, vh); c.strokeRect(x + w * .72, vy, w * .18, vh);
  if (p.balcao || p.id === "oficina") { const tx = vx - 4, tw = vw + 8, ty = vy - TS * .32; for (let i = 0; i < 6; i++) { c.fillStyle = i % 2 ? "#e8e2d0" : p.tel === "#2a2a2a" ? "#5a5a5a" : p.vit[1]; c.beginPath(); c.moveTo(tx + i * tw / 6, ty); c.lineTo(tx + (i + 1) * tw / 6, ty); c.lineTo(tx + (i + 1) * tw / 6 + 3, ty + TS * .3); c.lineTo(tx + i * tw / 6 + 3, ty + TS * .3); c.fill(); } c.fillStyle = "rgba(0,0,0,.25)"; c.fillRect(tx, ty + TS * .3, tw + 3, 3); }
  if (p.casa) [[.18], [.62]].forEach(([fx]) => { const fxx = x + w * fx, fyy = y + h * .36 + 2; c.fillStyle = "#5a3a22"; c.fillRect(fxx - 4, fyy, w * .2 + 8, 6); for (let i = 0; i < 5; i++) { c.fillStyle = ["#a02a2a", "#e8d8a0", "#c87aa0"][i % 3]; c.beginPath(); c.arc(fxx + i * w * .05, fyy - 1, 2.6, 0, 7); c.fill(); } });
  if (p.id === "escola") { c.fillStyle = "#8a6a2a"; c.beginPath(); c.arc(x + w / 2, y - TS * 1.9, 6, PI, 0); c.fill(); c.fillRect(x + w / 2 - 1, y - TS * 1.9, 2, 6); c.fillStyle = "#e8e2d0"; for (let i = 0; i < 3; i++) c.fillRect(x + w * (.38 + i * .1), y + h * .05, 6, 8); } // sino e desenhos colados na janela
  if (p.placa) { c.fillStyle = "#3a2414"; c.fillRect(px - w * .3, meio + 3, w * .6, TS * .36); c.fillStyle = "#e8d8b0"; c.font = `800 ${Math.round(TS * .22)}px "Big Shoulders Display", sans-serif`; c.textAlign = "center"; c.fillText(p.placa, px, meio + 3 + TS * .27); c.textAlign = "start"; }
  if (p.id === "ferreiro") { c.fillStyle = "#3a3a3a"; c.fillRect(x + w + 4, py - TS * .55, TS * .5, TS * .3); c.fillRect(x + w + TS * .12, py - TS * .3, TS * .26, TS * .3); if (!ehNoite()) { c.fillStyle = `rgba(255,120,40,${.5 + .3 * Math.sin(tm * 9)})`; c.beginPath(); c.arc(x + w * .14, py - h * .1, 5, 0, 7); c.fill(); } }
  if (p.id === "barbearia") { const bx = x + w * .95, by = py - h * .5; for (let i = 0; i < 5; i++) { c.fillStyle = (i + Math.floor(tm * 3)) % 2 ? "#c8281e" : "#e8e2d8"; c.fillRect(bx, by + i * 6, 6, 6); } }
  if (p.id === "coveiro") { c.fillStyle = "#3a2a1a"; c.fillRect(x + w + 6, py - TS * .9, TS * .3, TS * .9); c.fillRect(x + w + 2, py - TS * .7, TS * .5, TS * .18); }
  if (lit) { c.save(); c.globalCompositeOperation = "lighter"; const g = c.createRadialGradient(px, py, 2, px, py, TS * 1.6); g.addColorStop(0, "rgba(255,180,90,.18)"); g.addColorStop(1, "rgba(255,180,90,0)"); c.fillStyle = g; c.fillRect(px - TS * 2, py - TS * 2, TS * 4, TS * 3); c.restore(); }
}
function desenharIgrejaFora(p, x, y, w, h, tm, lit) {
  c.fillStyle = "#b8b0a0"; c.fillRect(x, y, w, h); c.fillStyle = "rgba(60,50,40,.3)"; for (let i = 0; i < 9; i++) { c.beginPath(); c.ellipse(x + w * ((i * .41) % 1), y + h * (.3 + (i % 3) * .22), w * .07, h * .05, 0, 0, 7); c.fill(); }
  c.fillStyle = "#4a2a1e"; c.beginPath(); c.moveTo(x - TS * .3, y + 4); c.lineTo(x + w / 2, y - TS * 2); c.lineTo(x + w + TS * .3, y + 4); c.fill();
  const tx = x + w / 2; c.fillStyle = "#c8c0b0"; c.fillRect(tx - TS * .7, y - TS * 4.2, TS * 1.4, TS * 2.6); c.fillStyle = "#141010"; c.beginPath(); c.moveTo(tx - TS * .4, y - TS * 2.2); c.lineTo(tx - TS * .4, y - TS * 3.3); c.arc(tx, y - TS * 3.3, TS * .4, PI, 0); c.lineTo(tx + TS * .4, y - TS * 2.2); c.fill();
  c.fillStyle = "#8a6a2a"; const bal = Math.sin(tm * .7) * .05; c.save(); c.translate(tx, y - TS * 3.4); c.rotate(bal); c.beginPath(); c.moveTo(-TS * .22, TS * .5); c.quadraticCurveTo(-TS * .22, 0, 0, 0); c.quadraticCurveTo(TS * .22, 0, TS * .22, TS * .5); c.fill(); c.restore();
  c.fillStyle = "#4a2a1e"; c.beginPath(); c.moveTo(tx - TS * .85, y - TS * 4.2); c.lineTo(tx, y - TS * 5); c.lineTo(tx + TS * .85, y - TS * 4.2); c.fill(); c.fillStyle = "#2a1a10"; c.fillRect(tx - 2.5, y - TS * 5.9, 5, TS * .95); c.fillRect(tx - TS * .25, y - TS * 5.6, TS * .5, 5);
  c.fillStyle = lit ? "rgba(255,190,110,.8)" : "#1a1e2a"; c.beginPath(); c.arc(tx, y + h * .28, TS * .5, 0, 7); c.fill(); c.strokeStyle = "#5a4a3a"; c.lineWidth = 2; for (let i = 0; i < 8; i++) { c.beginPath(); c.moveTo(tx, y + h * .28); c.lineTo(tx + Math.cos(i * PI / 4) * TS * .5, y + h * .28 + Math.sin(i * PI / 4) * TS * .5); c.stroke(); } // rosácea
  [[.12], [.78]].forEach(([fx]) => { c.fillStyle = lit ? "rgba(255,190,110,.75)" : "#141820"; c.beginPath(); c.moveTo(x + w * fx, y + h * .85); c.lineTo(x + w * fx, y + h * .45); c.arc(x + w * (fx + .05), y + h * .45, w * .05, PI, 0); c.lineTo(x + w * (fx + .1), y + h * .85); c.fill(); });
  const py = y + h; c.fillStyle = "#1a0e08"; c.beginPath(); c.moveTo(tx - TS * .7, py); c.lineTo(tx - TS * .7, py - TS * 1.3); c.arc(tx, py - TS * 1.3, TS * .7, PI, 0); c.lineTo(tx + TS * .7, py); c.fill(); c.fillStyle = "#4a2a18"; c.fillRect(tx - TS * .62, py - TS * 1.3, TS * .6, TS * 1.3); c.fillRect(tx + TS * .02, py - TS * 1.3, TS * .6, TS * 1.3);
  c.fillStyle = "#e8e2d0"; c.font = `700 ${Math.round(TS * .2)}px "JetBrains Mono", monospace`; c.textAlign = "center"; c.fillText("SANTA LUZIA", tx, y + h * .55); c.textAlign = "start";
}
function desenharVilaObjetos(tm) {
  const obj = [];
  VILA.arv.forEach(a => obj.push([a.y, () => desenharArvore(a, tm)]));
  VPREDIOS.forEach(p => obj.push([p.y + p.h, () => desenharPredioFora(p, tm)]));
  VPOSTES.forEach(([px, py], i) => obj.push([py, () => { const x = PX(px), y = PY(py); if (!naTela(x, y)) return; sombra(x, y, 6, 2.5); c.fillStyle = "#2a2a2a"; c.fillRect(x - 2, y - TS * 1.9, 4, TS * 1.9); c.fillRect(x - 2, y - TS * 1.9, TS * .4, 3); c.fillStyle = "#3a3a3a"; c.fillRect(x + TS * .3, y - TS * 1.86, 8, 9);
    const aceso = luzesVila() && !apagaUm(i * .4); if (aceso) { c.fillStyle = Math.random() < .03 ? "#5a4a2a" : "#ffe0a0"; c.fillRect(x + TS * .3 + 1, y - TS * 1.84, 6, 6); } }]));
  VBANCOS.forEach(([bx, by]) => obj.push([by, () => { const x = PX(bx), y = PY(by); if (!naTela(x, y)) return; sombra(x, y, TS * .6, TS * .1); c.fillStyle = "#5a3e24"; c.fillRect(x - TS * .6, y - TS * .32, TS * 1.2, TS * .1); c.fillRect(x - TS * .6, y - TS * .6, TS * 1.2, TS * .08); c.fillStyle = "#2a2a2a"; c.fillRect(x - TS * .5, y - TS * .32, 3, TS * .32); c.fillRect(x + TS * .5, y - TS * .32, 3, TS * .32); }]));
  obj.push([VFONTE.y + .7, () => { const x = PX(VFONTE.x), y = PY(VFONTE.y); if (!naTela(x, y, 200)) return; sombra(x, y + TS * .5, TS * 1.4, TS * .35); c.fillStyle = "#8a8478"; c.beginPath(); c.ellipse(x, y + TS * .3, TS * 1.3, TS * .55, 0, 0, 7); c.fill(); c.fillStyle = ehNoite() ? "#2a3a40" : "#3a3428"; c.beginPath(); c.ellipse(x, y + TS * .25, TS * 1.05, TS * .4, 0, 0, 7); c.fill();
    c.fillStyle = "#a8a090"; c.fillRect(x - TS * .14, y - TS * .9, TS * .28, TS * 1.1); c.beginPath(); c.arc(x, y - TS * 1.05, TS * .18, 0, 7); c.fill(); c.fillStyle = "#8a8478"; c.beginPath(); c.moveTo(x - TS * .3, y - TS * .1); c.lineTo(x, y - TS * .85); c.lineTo(x + TS * .3, y - TS * .1); c.fill(); c.fillStyle = "#6a645a"; c.fillRect(x - TS * .1, y - TS * 1.12, TS * .2, TS * .12); }]); // a santa sem rosto
  decorVila(tm, obj);
  obj.push([VCEM.y0, () => { for (let gx = VCEM.x0; gx <= VCEM.x1; gx += .8) { const x = PX(gx), y = PY(VCEM.y0); c.fillStyle = "#1a1a1a"; c.fillRect(x - 1.5, y - TS * .7, 3, TS * .7); } c.strokeStyle = "#1a1a1a"; c.lineWidth = 2; c.beginPath(); c.moveTo(PX(VCEM.x0), PY(VCEM.y0) - TS * .55); c.lineTo(PX(VCEM.x1), PY(VCEM.y0) - TS * .55); c.stroke(); }]);
  VILA.tumulos.forEach(t => obj.push([t.y, () => { const x = PX(t.x), y = PY(t.y); if (!naTela(x, y)) return; if (t.aberta) { c.fillStyle = "#140c06"; c.fillRect(x - TS * .3, y - TS * .2, TS * .6, TS * .9); c.fillStyle = "#5a4a30"; c.fillRect(x + TS * .35, y, TS * .5, TS * .3); c.fillStyle = "#e8e2d0"; c.font = `700 ${Math.round(TS * .14)}px "JetBrains Mono", monospace`; c.fillText("2026", x - TS * .25, y - TS * .3); return; }
    c.fillStyle = t.k > .5 ? "#7a7468" : "#5a564e"; if (t.k > .7) { c.fillRect(x - 2.5, y - TS * .7, 5, TS * .7); c.fillRect(x - TS * .2, y - TS * .55, TS * .4, 4); } else { c.beginPath(); c.moveTo(x - TS * .2, y); c.lineTo(x - TS * .2, y - TS * .4); c.arc(x, y - TS * .4, TS * .2, PI, 0); c.lineTo(x + TS * .2, y); c.fill(); } }]));
  NPCS.forEach(n => { const o = npcOnde(n); if (o.dentro || o.ausente) return; obj.push([o.y, () => { desenharNpc(n, PX(o.x), PY(o.y), TS, tm, { dir: o.dir, anda: o.anda, wx: o.x }); if (dist(o, R.eu) < 3.2) { c.fillStyle = "rgba(240,235,220,.8)"; c.font = `700 ${Math.round(Math.max(10, TS * .2))}px "JetBrains Mono", monospace`; c.textAlign = "center"; c.fillText(n.nome, PX(o.x), PY(o.y) - TS * 1.25); c.textAlign = "start"; } }]); });
  const ou = R.outro; if (ou && ou.lugar === "vila" && !ou.predio) obj.push([ou.eu.y, () => desenharVoce(PX(ou.eu.x), PY(ou.eu.y), tm, { q: ou, nome: R.online === "host" ? "Amigo(a)" : "Yasmin" })]);
  obj.push([R.eu.y, () => desenharVoce(PX(R.eu.x), PY(R.eu.y), tm)]);
  obj.sort((a, b) => a[0] - b[0]).forEach(o => o[1]());
}
// de noite, uma figura parada no fim da rua que some quando você chega perto; e sussurros
function vultoDaVila(tm) {
  if (!ehNoite() || R.predio) { VILA.vu = null; return; }
  if (!VILA.vu && Math.random() < .004) { const pts = [[3, 28], [44, 28], [23, 44], [12, 20.6 + 16], [36, 36.2], [8, 44.6]].filter(([x, y]) => Math.hypot(x - R.eu.x, y - R.eu.y) > 9 && Math.hypot(x - R.eu.x, y - R.eu.y) < 18); if (pts.length) { const [x, y] = pts[Math.floor(Math.random() * pts.length)]; VILA.vu = { x, y, t: 0 }; } }
  const v = VILA.vu; if (v) { v.t += 1 / 30; const d = Math.hypot(v.x - R.eu.x, v.y - R.eu.y); if (d < 6.5 || v.t > 25) { VILA.vu = null; if (d < 6.5) { tocarRuido(.6, { filtro: "highpass", f: 3000, vol: .06, wet: .8 }); efeito("...", "#9aa8c8"); } } else { const x = PX(v.x), y = PY(v.y); if (naTela(x, y)) { c.fillStyle = "rgba(0,0,0,.92)"; c.beginPath(); c.ellipse(x, y - TS * .9, TS * .22, TS * .9, 0, 0, 7); c.fill(); c.beginPath(); c.arc(x, y - TS * 1.9, TS * .17, 0, 7); c.fill(); c.fillStyle = "rgba(240,240,230,.9)"; c.fillRect(x - TS * .08, y - TS * 1.93, 2, 2); c.fillRect(x + TS * .05, y - TS * 1.93, 2, 2); } } }
  if (Math.random() < .0025) { const pn = rnd(-1, 1); for (let i = 0; i < 5; i++) tocarRuido(.12 + Math.random() * .1, { filtro: "bandpass", f: rnd(1800, 3200), q: 4, vol: .05, pan: pn, wet: .7, quando: i * .17 }); } // sussurro
}
function desenharVila(tm) {
  if (!VILA) montarVila();
  cam.x += (R.eu.x - cam.x) * .12; cam.y += (R.eu.y - cam.y) * .12; cam.x = cl(cam.x, W / TS / 2, VW - W / TS / 2); cam.y = cl(cam.y, Math.min(4, VH / 2), VH - H / TS / 2);
  c.fillStyle = "#141a0e"; c.fillRect(0, 0, W, H);
  desenharChaoChunks(CHAO_VILA);
  desenharBueiro(tm); desenharVilaObjetos(tm);
  vultoDaVila(tm);
  if (orelhaoTocando() && performance.now() - ultimoToque > 1300) { ultimoToque = performance.now(); const [v, pn] = somEm(ORELHAO.x, ORELHAO.y); if (v > .05) { tocarTom(1180, .35, { tipo: "square", vol: .035 * v, lp: 2400, pan: pn }); tocarTom(1180, .35, { tipo: "square", vol: .035 * v, lp: 2400, pan: pn, quando: .45 }); } }
}
function desenharLuzVila(tm) {
  const nt = horaNoite(); if (nt <= .02) return; const lw = luzCv.width, lh = luzCv.height, k = lw / W;
  lc.setTransform(1, 0, 0, 1, 0, 0); lc.globalCompositeOperation = "source-over"; lc.clearRect(0, 0, lw, lh); lc.fillStyle = `rgba(4,6,14,${.9 * nt})`; lc.fillRect(0, 0, lw, lh);
  lc.globalCompositeOperation = "destination-out";
  const furo = (x, y, r, f = 1) => { const g = lc.createRadialGradient(x * k, y * k, 0, x * k, y * k, r * k); g.addColorStop(0, `rgba(0,0,0,${f})`); g.addColorStop(1, "rgba(0,0,0,0)"); lc.fillStyle = g; lc.fillRect((x - r) * k, (y - r) * k, r * 2 * k, r * 2 * k); };
  furo(PX(R.eu.x), PY(R.eu.y) - TS * .4, TS * raioLuz(R), R.lanterna ? 1 : .7);
  const ou = R.outro; if (ou && ou.lugar === "vila" && !ou.predio) furo(PX(ou.eu.x), PY(ou.eu.y) - TS * .4, TS * raioLuz(ou), ou.lanterna ? 1 : .7);
  { const m = npcOnde(npc("maria")); if (!m.ausente) furo(PX(m.x), PY(m.y) - TS * .6, TS * 1.6, .8); if (ehNoite()) furo(PX(CAPELINHA.x), PY(CAPELINHA.y) - 6, TS * 1.5, .7); }
  if (luzesVila()) { VPOSTES.forEach(([px, py], i) => { if (!apagaUm(i * .4)) furo(PX(px + .35), PY(py) - TS * 1.5, TS * 2.2, .85); }); VPREDIOS.forEach((p, i) => { if (!apagaUm(i)) furo(PX(p.x + p.w / 2), PY(p.y + p.h * .55), TS * 2.6, .7); }); }
  c.drawImage(luzCv, 0, 0, W, H);
}
// pequenos detalhes que deixam qualquer cômodo vivo (e estranho)
function teias(X, Y, s, w) { c.strokeStyle = "rgba(220,220,220,.22)"; c.lineWidth = 1; [[0, 1], [w, -1]].forEach(([x0, d]) => { for (let i = 1; i < 4; i++) { c.beginPath(); c.moveTo(X(x0 + d * .45 * i / 3), Y(0)); c.quadraticCurveTo(X(x0 + d * .15 * i / 3), Y(.15 * i / 3), X(x0), Y(.45 * i / 3)); c.stroke(); } for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(X(x0), Y(0)); c.lineTo(X(x0 + d * .45 * Math.cos(i * .5)), Y(.45 * Math.sin(i * .5 + .1))); c.stroke(); } }); }
function ratinho(X, Y, s, w, h, tm, sem) { const k = (tm * .07 + sem) % 1; if (k > .12) return; const x = X(mix(-.2, w + .2, k / .12)), y = Y(h - .12); c.fillStyle = "#3a3430"; c.beginPath(); c.ellipse(x, y, .12 * s, .06 * s, 0, 0, 7); c.fill(); c.strokeStyle = "#3a3430"; c.lineWidth = 1; c.beginPath(); c.moveTo(x - .12 * s, y); c.lineTo(x - .3 * s, y - 2); c.stroke(); }
function retrato(X, Y, s, x, y, cor, tm, quemX) { c.fillStyle = "#6a4a1a"; c.beginPath(); c.ellipse(X(x), Y(y), .22 * s, .28 * s, 0, 0, 7); c.fill(); c.fillStyle = "#c8b890"; c.beginPath(); c.ellipse(X(x), Y(y), .17 * s, .22 * s, 0, 0, 7); c.fill(); c.fillStyle = cor; c.beginPath(); c.arc(X(x), Y(y - .05), .08 * s, 0, 7); c.fill(); c.fillRect(X(x - .1), Y(y + .04), .2 * s, .14 * s); const ol = cl((quemX - x) * .02, -.02, .02); c.fillStyle = "#1a1210"; c.fillRect(X(x - .035 + ol), Y(y - .06), 2, 2); c.fillRect(X(x + .02 + ol), Y(y - .06), 2, 2); }
function relogio(X, Y, s, x, tm) { c.fillStyle = "#4a2a14"; c.fillRect(X(x - .18), Y(.02), .36 * s, .86 * s); c.fillStyle = "#e8e0c8"; c.beginPath(); c.arc(X(x), Y(.2), .12 * s, 0, 7); c.fill(); c.strokeStyle = "#1a1a1a"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(X(x), Y(.2)); c.lineTo(X(x) + Math.cos(-1.9) * .09 * s, Y(.2) + Math.sin(-1.9) * .09 * s); c.moveTo(X(x), Y(.2)); c.lineTo(X(x) + .06 * s, Y(.2)); c.stroke(); const pe = Math.sin(tm * 3) * .25; c.beginPath(); c.moveTo(X(x), Y(.36)); c.lineTo(X(x) + Math.sin(pe) * .3 * s, Y(.36) + Math.cos(pe) * .4 * s); c.stroke(); c.fillStyle = "#c8a050"; c.beginPath(); c.arc(X(x) + Math.sin(pe) * .3 * s, Y(.36) + Math.cos(pe) * .4 * s, .05 * s, 0, 7); c.fill(); }
function calendario(X, Y, s, x) { c.fillStyle = "#e8e2d0"; c.fillRect(X(x), Y(.15), .42 * s, .5 * s); c.fillStyle = "#a01e1e"; c.fillRect(X(x), Y(.15), .42 * s, .12 * s); c.fillStyle = "#e8e2d0"; c.font = `700 ${Math.round(s * .08)}px monospace`; c.fillText("NOV 26", X(x + .03), Y(.24)); c.strokeStyle = "#a01e1e"; c.lineWidth = 1; for (let i = 0; i < 12; i++) { const cx = X(x + .05 + (i % 6) * .06), cy = Y(.33 + Math.floor(i / 6) * .1); c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + 3, cy + 3); c.moveTo(cx + 3, cy); c.lineTo(cx, cy + 3); c.stroke(); } }
function cruzParede(X, Y, s, x, y) { c.fillStyle = "#3a2414"; c.fillRect(X(x) - 1.5, Y(y), 3, .3 * s); c.fillRect(X(x) - .08 * s, Y(y + .07), .16 * s, 3); }
function tapete(X, Y, s, x, y, w, h, cor) { c.fillStyle = cor; c.beginPath(); c.ellipse(X(x), Y(y), w * s, h * s, 0, 0, 7); c.fill(); c.strokeStyle = "rgba(230,200,120,.4)"; c.lineWidth = 2; c.beginPath(); c.ellipse(X(x), Y(y), w * s * .8, h * s * .75, 0, 0, 7); c.stroke(); }
function vaso(X, Y, s, x, y, tm, murcho) { c.fillStyle = "#8a4a2a"; c.fillRect(X(x - .14), Y(y - .25), .28 * s, .25 * s); c.strokeStyle = murcho ? "#6a5a2a" : "#3a7a2a"; c.lineWidth = 2; for (let i = -1; i <= 1; i++) { c.beginPath(); c.moveTo(X(x), Y(y - .25)); c.quadraticCurveTo(X(x + i * .15), Y(y - .5), X(x + i * .22) + Math.sin(tm + i) * 1.5, Y(y - (murcho ? .35 : .62))); c.stroke(); } }
function desenharPredio(tm) {
  const p = predio(R.predio), s = Math.min(W / (ROOM.w + 1.2), H / (ROOM.h + 1.4)), ox = W / 2 - ROOM.w / 2 * s, oy = H / 2 - ROOM.h / 2 * s + s * .1, X = x => ox + x * s, Y = y => oy + y * s, A = R.andar, noite = ehNoite() && !luzesVila(), qx = R.int.x, sem = VPREDIOS.indexOf(p) * .37;
  c.fillStyle = "#06070a"; c.fillRect(0, 0, W, H);
  c.fillStyle = A ? "#6a4a30" : p.igreja ? "#6a645a" : p.id === "oficina" ? "#4a4a46" : "#5a4430"; c.fillRect(X(0), Y(.9), ROOM.w * s, (ROOM.h - .9) * s);
  for (let i = 0; i < 12; i++) { c.fillStyle = i % 2 ? "rgba(0,0,0,.08)" : "rgba(255,255,255,.03)"; c.fillRect(X(0), Y(.9 + i * .45), ROOM.w * s, .45 * s); c.strokeStyle = "rgba(0,0,0,.15)"; c.lineWidth = 1; c.beginPath(); c.moveTo(X(((i * 1.7) % 8) + .5), Y(.9 + i * .45)); c.lineTo(X(((i * 1.7) % 8) + .5), Y(1.35 + i * .45)); c.stroke(); }
  c.fillStyle = A ? "#8a7058" : p.igreja ? "#a8a090" : p.cor; c.fillRect(X(0), Y(0), ROOM.w * s, .95 * s); c.fillStyle = "rgba(0,0,0,.2)"; c.fillRect(X(0), Y(.85), ROOM.w * s, .1 * s);
  c.fillStyle = "rgba(0,0,0,.1)"; for (let i = 0; i < 4; i++) c.fillRect(X(((i * 2.3 + sem * 9) % 7) + .3), Y(.1 + (i % 2) * .3), .4 * s, .25 * s); // manchas de umidade
  c.fillStyle = "#3a2a1a"; c.fillRect(X(-.2), Y(0), .2 * s, ROOM.h * s); c.fillRect(X(ROOM.w), Y(0), .2 * s, ROOM.h * s); c.fillRect(X(-.2), Y(ROOM.h), (ROOM.w + .4) * s, .15 * s);
  const caixa = (x, y, w, h, cor, topo) => { c.fillStyle = "rgba(0,0,0,.3)"; c.fillRect(X(x) + 3, Y(y + h) - 2, w * s, 5); c.fillStyle = cor; c.fillRect(X(x), Y(y), w * s, h * s); if (topo) { c.fillStyle = topo; c.fillRect(X(x), Y(y), w * s, .18 * s); } };
  { const ex = X(7.1), ey = Y(.9); for (let i = 0; i < 6; i++) { c.fillStyle = i % 2 ? "#5a3a22" : "#6a4a2a"; c.fillRect(ex, ey + (A ? i : 5 - i) * .25 * s, 1.6 * s, .25 * s); } c.fillStyle = "#3a2414"; c.fillRect(ex - 4, ey, 4, 1.5 * s); for (let i = 0; i < 5; i++) c.fillRect(ex - 4 + i * .38 * s, ey - .15 * s, 2, .2 * s); c.fillStyle = "#e8d8b0"; c.font = `700 ${Math.round(s * .18)}px "JetBrains Mono", monospace`; c.fillText(A ? "▼ DESCE" : "▲ SOBE", ex + 4, ey + 1.7 * s); }
  teias(X, Y, s, ROOM.w);
  if (A === 0) {
    c.fillStyle = "#2a180e"; c.fillRect(X(4), Y(ROOM.h) - 4, s, 8); c.fillStyle = "#e8d8b0"; c.font = `700 ${Math.round(s * .17)}px "JetBrains Mono", monospace`; c.textAlign = "center"; c.fillText("PORTA", X(4.5), Y(ROOM.h) + s * .3); c.textAlign = "start";
    tapete(X, Y, s, 4.5, 5.35, .7, .25, "#5a2a2a");
    if (p.igreja) { caixa(3.2, 1.1, 2.6, .7, "#e8e2d0", "#c8a050"); c.fillStyle = "#c8a050"; c.fillRect(X(4.45), Y(.2), .1 * s, .7 * s); c.fillRect(X(4.2), Y(.38), .6 * s, .08 * s); for (const [bx, by] of [[.9, 3.1], [5.3, 3.1], [.9, 4.2], [5.3, 4.2]]) caixa(bx, by, 2.8, .45, "#5a3e24", "#7a5a32");
      [[1.2, .1], [7.3, .1]].forEach(([sx2]) => { c.fillStyle = "#a8a090"; c.fillRect(X(sx2), Y(.1), .4 * s, .75 * s); c.fillStyle = "#6a645a"; c.beginPath(); c.arc(X(sx2 + .2), Y(.2), .14 * s, 0, 7); c.fill(); });
      for (let i = 0; i < 6; i++) { c.fillStyle = "#e8e2d0"; c.fillRect(X(3.4 + i * .4), Y(1.05), 3, -8); c.fillStyle = `rgba(255,200,90,${.6 + .3 * Math.sin(tm * 11 + i)})`; c.beginPath(); c.ellipse(X(3.4 + i * .4) + 1.5, Y(1.05) - 10, 1.6, 3, 0, 0, 7); c.fill(); }
      c.fillStyle = "#3a2a5a"; c.fillRect(X(2.2), Y(.12), .7 * s, .6 * s); c.fillStyle = "#c8281e"; c.fillRect(X(6.1), Y(.12), .7 * s, .6 * s); c.fillStyle = "rgba(255,255,255,.15)"; c.fillRect(X(2.2), Y(.12), .7 * s, .2 * s); c.fillRect(X(6.1), Y(.12), .7 * s, .2 * s); // vitrais
      tapete(X, Y, s, 4.55, 3.6, .3, 1.6, "#6a1e1e"); }
    else if (p.id === "escola") {
      c.fillStyle = "#2a3a2a"; c.fillRect(X(2.4), Y(.12), 4 * s, .65 * s); c.strokeStyle = "#6a4a2a"; c.lineWidth = 3; c.strokeRect(X(2.4), Y(.12), 4 * s, .65 * s); c.fillStyle = "rgba(240,240,230,.85)"; c.font = `600 ${Math.round(s * .15)}px "Source Serif 4", serif`; c.fillText(ehNoite() || Math.sin(tm * .2) > .8 ? "NÃO OLHEM PELA JANELA" : "Hoje: o ciclo da água", X(2.6), Y(.45)); c.fillText("6 + 6 + 6 =", X(2.6), Y(.65));
      caixa(3.4, 1.9, 2.2, .55, "#6a4a2a", "#8a6a3a"); c.fillStyle = "#c8281e"; c.beginPath(); c.arc(X(5.2), Y(2), .1 * s, 0, 7); c.fill(); // mesa e a maçã
      [[.8, 3.3], [2.2, 3.3], [5.7, 3.3], [.8, 4.5], [2.2, 4.5], [5.7, 4.5]].forEach(([x, y], i) => { caixa(x, y, 1, .55, "#7a5a32", "#9a7a4a"); c.fillStyle = "#e8e2d0"; c.fillRect(X(x + .2), Y(y + .1), .4 * s, .25 * s); if (i === 4) { c.strokeStyle = "#1a1a1a"; c.lineWidth = 1; c.beginPath(); c.arc(X(x + .4), Y(y + .22), .08 * s, 0, 7); c.moveTo(X(x + .4), Y(y + .3)); c.lineTo(X(x + .4), Y(y + .34)); c.stroke(); } });
      c.fillStyle = "#3a6a9a"; c.beginPath(); c.arc(X(.8), Y(1.5), .25 * s, 0, 7); c.fill(); c.fillStyle = "#3a7a3a"; c.fillRect(X(.68), Y(1.4), .18 * s, .12 * s); c.fillStyle = "#6a4a2a"; c.fillRect(X(.78), Y(1.75), 3, .3 * s); // globo
    }
    else if (p.id === "oficina") {
      caixa(5.3, 2.6, 2.2, 1.3, "#3a3a3a", "#5a5a5a"); for (let i = 0; i < 4; i++) { c.fillStyle = "#2a2a2a"; c.fillRect(X(5.5 + i * .5), Y(2.4), .3 * s, .3 * s); } c.fillStyle = "rgba(20,20,20,.5)"; c.beginPath(); c.ellipse(X(6.4), Y(4.2), .8 * s, .25 * s, 0, 0, 7); c.fill(); // motor e mancha de óleo
      for (let i = 0; i < 3; i++) { c.strokeStyle = "#1a1a1a"; c.lineWidth = .16 * s; c.beginPath(); c.ellipse(X(1.05), Y(1.9 - i * .28), .45 * s, .16 * s, 0, 0, 7); c.stroke(); } // pneus
      caixa(.5, 3.7, 1.2, .8, "#6a4a2a", "#8a6a3a"); c.fillStyle = "#8a8a8a"; for (let i = 0; i < 6; i++) c.fillRect(X(.6 + i * .4), Y(.25), 3, .4 * s); // ferramentas penduradas
      c.fillStyle = "#0a0806"; c.fillRect(X(2.6), Y(.05), 1.4 * s, .8 * s); c.strokeStyle = "#4a3018"; c.lineWidth = 2; c.strokeRect(X(2.6), Y(.05), 1.4 * s, .8 * s); if (Math.sin(tm * .6) > .3) { c.fillStyle = "rgba(240,230,210,.8)"; c.fillRect(X(3.1), Y(.35), 3, 3); c.fillRect(X(3.4), Y(.35), 3, 3); } // baia da égua: só os olhos
    }
    else if (p.casa) {
      caixa(.5, 1, 1.3, .8, "#2a2a2a", "#3a3a3a"); c.fillStyle = `rgba(255,${120 + Math.sin(tm * 9) * 30},40,.7)`; c.fillRect(X(.7), Y(1.4), .6 * s, .2 * s); // fogão
      caixa(.6, 3.7, 2.2, .7, "#6a3a3a", "#8a4a4a"); c.fillStyle = "#e8e2d0"; c.fillRect(X(.8), Y(3.8), .4 * s, .25 * s); // sofá com paninho
      caixa(4.2, 2.6, 1.5, .9, "#7a5a32", "#e8e2d8"); c.fillStyle = "#e8e2d0"; c.beginPath(); c.arc(X(4.6), Y(2.9), .1 * s, 0, 7); c.arc(X(5.3), Y(2.9), .1 * s, 0, 7); c.fill(); // mesa com duas xícaras
      caixa(5.9, 1, 1, .7, "#4a2a14"); c.fillStyle = "rgba(180,210,230,.4)"; c.fillRect(X(6), Y(1.05), .8 * s, .5 * s); c.fillStyle = "#e8e2d0"; for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(X(6.15 + i * .25), Y(1.3), .08 * s, 0, 7); c.fill(); } // cristaleira
      retrato(X, Y, s, 2.6, .45, "#3a2a1a", tm, qx); relogio(X, Y, s, 4.6, tm); calendario(X, Y, s, 5.4); cruzParede(X, Y, s, 3.4, .2); tapete(X, Y, s, 3.4, 4.7, 1.2, .45, "#5a3a6a"); vaso(X, Y, s, 8.4, 5.5, tm, true);
      if (p.id === "nena") for (let i = 0; i < 7; i++) { const gx = [1.5, 3.2, 6.4, 7.9, 2.4, 5.8, 3.9][i], gy = [2.6, 2.2, 3.4, 4.8, 5.2, 5.4, 1.4][i]; c.fillStyle = ["#0a0a0c", "#8a6a3a", "#e8e2d8", "#5a5a5a", "#0a0a0c", "#c8803a", "#3a3a3a"][i]; c.beginPath(); c.ellipse(X(gx), Y(gy), .2 * s, .12 * s, 0, 0, 7); c.fill(); c.beginPath(); c.arc(X(gx + .17), Y(gy - .08), .09 * s, 0, 7); c.fill(); c.fillStyle = "#c8f06a"; c.fillRect(X(gx + .14), Y(gy - .1), 1.5, 1.5); c.fillRect(X(gx + .2), Y(gy - .1), 1.5, 1.5); }
      if (p.id === "nena" && R.missoes && R.missoes.novelo === "feita") { c.fillStyle = "#8a8a8a"; c.beginPath(); c.ellipse(X(4.6), Y(4.6), .24 * s, .14 * s, 0, 0, 7); c.fill(); c.beginPath(); c.arc(X(4.8), Y(4.5), .1 * s, 0, 7); c.fill(); }
      if (p.id === "viuva") { const bal = Math.sin(tm * 1.4) * .12; c.save(); c.translate(X(2.6), Y(3.25)); c.rotate(bal); c.fillStyle = "#4a2a18"; c.fillRect(-.3 * s, -.3 * s, .6 * s, .6 * s); c.restore(); c.fillStyle = "#e8e2d0"; c.fillRect(X(4.25), Y(2.65), .2 * s, .12 * s); } // a cadeira do Tobias balança
      if (p.id === "gemeas") { c.fillStyle = "#e8e2d0"; c.beginPath(); c.arc(X(6.6), Y(4.6), .13 * s, 0, 7); c.fill(); c.fillStyle = "#c8a060"; c.beginPath(); c.arc(X(6.6), Y(4.55), .14 * s, PI, 0); c.fill(); c.fillStyle = "#8a3a3a"; c.fillRect(X(6.45), Y(4.7), .3 * s, .35 * s); c.fillStyle = "#1a1a1a"; c.fillRect(X(6.55), Y(4.58), 2, 2); c.fillRect(X(6.64), Y(4.58), 2, 2); } // uma boneca
    }
    else {
      for (let i = 0; i < 3; i++) { caixa(.3 + i * 2.2, .25, 1.9, .6, "#3a2414"); for (let k2 = 0; k2 < 5; k2++) { c.fillStyle = p.vit[(i + k2) % 3]; c.fillRect(X(.4 + i * 2.2 + k2 * .35), Y(.3), .25 * s, .22 * s); c.fillRect(X(.4 + i * 2.2 + k2 * .35), Y(.58), .25 * s, .2 * s); } }
      caixa(1.2, 2.3, 4.6, .6, "#6a4a2a", "#8a6a3a"); c.fillStyle = "#c8a050"; c.beginPath(); c.arc(X(5.4), Y(2.4), .07 * s, PI, 0); c.fill(); // sininho de balcão
      calendario(X, Y, s, 6.65); vaso(X, Y, s, .8, 5.5, tm, false);
      const ex = { armazem: () => { for (let i = 0; i < 4; i++) caixa(6 + (i % 2) * .8, 3.6 + Math.floor(i / 2) * .5, .75, .5, "#c8b080", "#a89060"); c.fillStyle = "#6a6a6a"; c.fillRect(X(1.6), Y(2.15), .5 * s, .2 * s); }, padaria: () => { caixa(6.1, 3.4, 1.3, 1.1, "#8a4a2a", "#6a3a1e"); c.fillStyle = `rgba(255,${120 + Math.sin(tm * 8) * 30},40,.85)`; c.fillRect(X(6.4), Y(3.9), .7 * s, .35 * s); for (let i = 0; i < 5; i++) { c.fillStyle = "#c88a3a"; c.beginPath(); c.ellipse(X(1.6 + i * .8), Y(2.4), .2 * s, .1 * s, 0, 0, 7); c.fill(); } },
        costura: () => { for (let i = 0; i < 2; i++) { c.fillStyle = "#3a3030"; c.fillRect(X(6.4 + i * .8), Y(3.2), .12 * s, .9 * s); c.fillStyle = ["#a02a2a", "#1e1a1e"][i]; c.beginPath(); c.ellipse(X(6.46 + i * .8), Y(3.4), .3 * s, .42 * s, 0, 0, 7); c.fill(); } c.strokeStyle = "#c8c8c8"; c.lineWidth = 1; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(X(1.5 + i * .9), Y(2.35)); c.lineTo(X(1.9 + i * .9), Y(2.5)); c.stroke(); } },
        ferreiro: () => { caixa(5.9, 3.5, 1.4, 1.1, "#3a3a3a", "#5a5a5a"); c.fillStyle = `rgba(255,${100 + Math.sin(tm * 9) * 40},30,.9)`; c.beginPath(); c.arc(X(6.6), Y(3.8), .3 * s, 0, 7); c.fill(); for (let i = 0; i < 4; i++) { c.fillStyle = "rgba(255,160,60,.8)"; c.fillRect(X(6.6) + Math.sin(tm * 7 + i) * 12, Y(3.6) - ((tm * 40 + i * 9) % 30), 2, 2); } },
        botica: () => { caixa(6.2, 3.6, 1, 1, "#2a2a2a"); c.fillStyle = "#5a8a3a"; c.beginPath(); c.ellipse(X(6.7), Y(3.7), .4 * s, .15 * s, 0, 0, 7); c.fill(); for (let i = 0; i < 3; i++) { c.fillStyle = "rgba(150,200,120,.3)"; c.beginPath(); c.arc(X(6.7) + Math.sin(tm * 2 + i) * 6, Y(3.4) - ((tm * 20 + i * 12) % 30), 4, 0, 7); c.fill(); } c.strokeStyle = "#5a7a2a"; c.lineWidth = 2; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(X(1.4 + i * .7), Y(.9)); c.lineTo(X(1.4 + i * .7), Y(1.3) + Math.sin(tm + i) * 2); c.stroke(); } },
        barbearia: () => { caixa(5.9, 3.4, 1, 1, "#8a1e1e", "#a02a2a"); c.fillStyle = "#c8d0d8"; c.fillRect(X(5.6), Y(.15), 1.6 * s, .65 * s); if (Math.sin(tm * .5) > .9) { c.fillStyle = "rgba(0,0,0,.8)"; c.beginPath(); c.arc(X(6.4), Y(.45), .14 * s, 0, 7); c.fill(); } c.fillStyle = "#1a1210"; for (let i = 0; i < 9; i++) c.fillRect(X(5.6 + (i * .31) % 2), Y(4.6 + (i % 3) * .12), 3, 1.5); },
        delegacia: () => { c.fillStyle = "rgba(20,20,20,.5)"; c.fillRect(X(5.6), Y(3.2), 2.8 * s, 2.1 * s); c.strokeStyle = "#5a5a5a"; c.lineWidth = 3; for (let i = 0; i <= 9; i++) { c.beginPath(); c.moveTo(X(5.6 + i * .31), Y(3.2)); c.lineTo(X(5.6 + i * .31), Y(5.3)); c.stroke(); } c.fillStyle = "#e8e2d0"; c.fillRect(X(6.8), Y(4.6), .5 * s, .3 * s); c.strokeStyle = "rgba(230,230,230,.4)"; c.lineWidth = 1; for (let i = 0; i < 8; i++) { c.beginPath(); c.moveTo(X(5.75 + i * .3), Y(3.5)); c.lineTo(X(5.75 + i * .3), Y(3.8)); c.stroke(); } }, // risquinhos na parede da cela
        coveiro: () => { for (let i = 0; i < 2; i++) caixa(5.4 + i * 1.35, 3.5, 1.2, .8, "#3a2414", "#4a3020"); c.strokeStyle = "#6a4a2a"; c.lineWidth = 2; c.beginPath(); c.moveTo(X(8.2), Y(3.1)); c.lineTo(X(8.4), Y(5)); c.stroke(); c.fillStyle = "#5a4a30"; c.beginPath(); c.ellipse(X(3.4), Y(5), .5 * s, .15 * s, 0, 0, 7); c.fill(); },
        correio: () => { caixa(6, 3.6, 1.6, .9, "#c8b080", "#a89060"); for (let i = 0; i < 12; i++) { c.fillStyle = "#3a2414"; c.fillRect(X(.4 + (i % 6) * .5), Y(.2 + Math.floor(i / 6) * .3), .45 * s, .26 * s); if ((i * 7) % 3) { c.fillStyle = "#e8e2d0"; c.fillRect(X(.45 + (i % 6) * .5), Y(.26 + Math.floor(i / 6) * .3), .35 * s, .12 * s); } } },
        pensao: () => { caixa(5.8, 3.7, 2.2, .7, "#6a3a3a", "#8a4a4a"); c.fillStyle = "#3a2414"; c.fillRect(X(.5), Y(.2), 1.4 * s, .5 * s); for (let i = 0; i < 6; i++) { if (i === 2) continue; c.fillStyle = "#c8a050"; c.fillRect(X(.62 + i * .21), Y(.3), 2, .25 * s); } c.fillStyle = "#e8e2d0"; c.font = `700 ${Math.round(s * .08)}px monospace`; c.fillText("1 2 3 4 5 6", X(.58), Y(.66)); c.fillStyle = "#e8e2d0"; c.fillRect(X(2.6), Y(2.35), .5 * s, .3 * s); } }[p.id]; if (ex) ex();
      if (!lojaAberta(p.id) && p.npc && npc(p.npc) && npc(p.npc).loja) { c.fillStyle = "#e8d8b0"; c.font = `800 ${Math.round(s * .26)}px "Big Shoulders Display", sans-serif`; c.fillText("FECHADO", X(2.6), Y(2.8)); } }
  } else { // em cima: o quarto
    tapete(X, Y, s, 3, 3.6, 1.1, .5, "#4a3a5a");
    caixa(.5, 1, 2.2, 1.7, "#e8e2d0", "#c8b8a0"); c.fillStyle = "#8a3a3a"; c.fillRect(X(.5), Y(1.6), 2.2 * s, 1.1 * s); c.fillStyle = "#f2f0e8"; c.fillRect(X(.7), Y(1.1), .8 * s, .4 * s); c.fillStyle = "#020203"; c.fillRect(X(.5), Y(2.7), 2.2 * s, .1 * s);
    if (p.id === "padaria" || p.id === "gemeas") { caixa(3.1, 1, 1.7, 1.4, "#e8e2d0"); c.fillStyle = p.id === "gemeas" ? "#a85a5a" : "#3a6a9a"; c.fillRect(X(3.1), Y(1.5), 1.7 * s, .9 * s); }
    caixa(.4, 4.1, 1, 1.3, "#4a2a18", "#5a3a22"); caixa(4.4, 3.9, 1.3, .8, "#6a4a2a", "#8a6a3a"); c.fillStyle = "#e8e2d0"; c.fillRect(X(4.9), Y(3.95), 4, -9); if (!noite) { c.fillStyle = "rgba(255,200,90,.8)"; c.beginPath(); c.ellipse(X(4.9) + 2, Y(3.95) - 11, 1.6, 3, 0, 0, 7); c.fill(); }
    c.fillStyle = "#c8c8d0"; c.beginPath(); c.ellipse(X(5.35), Y(4.1), .18 * s, .08 * s, 0, 0, 7); c.fill(); c.fillRect(X(5.28), Y(3.85), .14 * s, .22 * s); // bacia e jarra
    c.fillStyle = noite ? "#0a1020" : "#8aa8c0"; c.fillRect(X(3.4), Y(.15), .9 * s, .55 * s); c.strokeStyle = "#2a1a0e"; c.lineWidth = 3; c.strokeRect(X(3.4), Y(.15), .9 * s, .55 * s);
    c.fillStyle = "#7a2a2a"; c.fillRect(X(3.25), Y(.1), .18 * s, .7 * s + Math.sin(tm) * 2); c.fillRect(X(4.27), Y(.1), .18 * s, .7 * s + Math.sin(tm + 1) * 2); // cortinas
    if (noite && Math.sin(tm * .5) > .96) { c.fillStyle = "rgba(240,240,230,.9)"; c.fillRect(X(3.7), Y(.35), 3, 3); c.fillRect(X(3.95), Y(.35), 3, 3); }
    retrato(X, Y, s, 1.6, .45, "#4a2a1a", tm, qx); cruzParede(X, Y, s, 2.4, .25); relogio(X, Y, s, 5.7, tm);
    c.fillStyle = "#c8a070"; c.beginPath(); c.ellipse(X(2.95), Y(3), .1 * s, .05 * s, 0, 0, 7); c.ellipse(X(3.2), Y(3.05), .1 * s, .05 * s, 0, 0, 7); c.fill(); // chinelos
    { const bx = X(6.2), by = Y(4.7), vira = noite ? cl((R.int.x - 6.2) * .4, -.6, .6) : 0; c.fillStyle = "#5a3a22"; c.fillRect(bx - .22 * s, by - .1 * s, .44 * s, .44 * s); c.fillStyle = "#e8e2d0"; c.save(); c.translate(bx, by - .2 * s); c.rotate(vira); c.beginPath(); c.arc(0, 0, .13 * s, 0, 7); c.fill(); c.fillStyle = "#1a1a1a"; c.fillRect(-.06 * s, -.03 * s, 2, 2); c.fillRect(.03 * s, -.03 * s, 2, 2); c.restore(); c.fillStyle = "#a02a2a"; c.fillRect(bx - .12 * s, by - .08 * s, .24 * s, .26 * s); } // a boneca vira a cabeça de noite
  }
  ratinho(X, Y, s, ROOM.w, ROOM.h, tm, sem);
  detalhesPredio(p, A, X, Y, s, tm);
  NPCS.forEach(n => { const o = npcOnde(n); if (!o.dentro || o.predio !== R.predio || o.andar !== A) return;
    if (o.dorme) { const cab = (hx, hy) => { c.fillStyle = n.look.pele; c.beginPath(); c.arc(X(hx), Y(hy), .26 * s, 0, 7); c.fill(); c.fillStyle = "#1a1210"; c.fillRect(X(hx - .07), Y(hy - .02), 3, 1.5); c.fillRect(X(hx + .09), Y(hy - .02), 3, 1.5); if (!n.look.careca) { c.fillStyle = n.look.cabelo; c.beginPath(); c.arc(X(hx), Y(hy - .07), .27 * s, PI, 0); c.fill(); } };
      cab(o.x - .45, o.y - .45); if (n.look.gemeas) cab(3.55, 1.25); c.fillStyle = "rgba(0,0,0,.25)"; c.fillRect(X(o.x - .7), Y(o.y - .2), 1.2 * s, .5 * s);
      c.fillStyle = "rgba(230,230,240,.7)"; c.font = `700 ${Math.round(s * .2)}px "JetBrains Mono", monospace`; c.fillText("z".repeat(1 + Math.floor(tm * 1.5) % 3), X(o.x - .1), Y(o.y - .8)); return; }
    desenharNpc(n, X(o.x), Y(o.y + .35), s * 1.05, tm, { dir: o.dir, wx: o.x }); });
  const ou = R.outro; if (ou && ou.lugar === "vila" && ou.predio === R.predio && ou.andar === A) desenharVoce(X(ou.int.x), Y(ou.int.y), tm, { q: ou, dir: ou.int.dir || 1, s: s * 1.05, nome: R.online === "host" ? "Amigo(a)" : "Yasmin" });
  desenharVoce(X(R.int.x), Y(R.int.y), tm, { dir: R.int.dir || 1, s: s * 1.05 });
  if (noite) { const x = X(R.int.x), y = Y(R.int.y) - s * .4, r = s * (R.lanterna ? 3.6 : 2.4), g = c.createRadialGradient(x, y, r * .2, x, y, r); g.addColorStop(0, "rgba(3,4,8,0)"); g.addColorStop(1, "rgba(3,4,8,.84)"); c.fillStyle = g; c.fillRect(0, 0, W, H); }
  c.fillStyle = "rgba(240,235,220,.6)"; c.font = `700 ${Math.round(Math.max(11, s * .2))}px "JetBrains Mono", monospace`; c.textAlign = "right"; c.fillText(p.nome + (A ? " · quarto" : ""), X(ROOM.w), Y(ROOM.h) + Math.max(14, s * .3)); c.textAlign = "start";
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
function netFechar() { try { if (Net.conn) Net.conn.close(); } catch (e) {} try { if (Net.peer) Net.peer.destroy(); } catch (e) {} try { if (Net.bc) { Net.bc.postMessage({ t: "tchau" }); Net.bc.close(); } } catch (e) {} Net.peer = Net.conn = Net.bc = null; Net.papel = null; Net.ligado = false; Net.codigo = ""; }
function ligarConn(conn, aoAbrir) { Net.conn = conn; conn.on("open", () => aoAbrir && aoAbrir()); conn.on("data", netReceber); conn.on("close", netCaiu); conn.on("error", netCaiu); }
function netCriar(aoCodigo, aoEntrar, aoErro) {
  netFechar(); Net.papel = "host"; const cod = novoCodigo(); Net.codigo = cod;
  if (usarBC()) { Net.bc = new BroadcastChannel("roca-" + cod); Net.bc.onmessage = e => { if (e.data && e.data.t === "oi" && !Net.ligado) { Net.ligado = true; aoEntrar(); } else netReceber(e.data); }; setTimeout(() => aoCodigo(cod), 50); return; }
  if (typeof Peer !== "function") return aoErro("O online não carregou. Confira a internet e tente de novo.");
  const peer = new Peer(PREFIXO + cod, { debug: 0, config: ICE }); Net.peer = peer;
  peer.on("open", () => aoCodigo(cod));
  peer.on("connection", conn => { if (Net.conn && Net.conn.open) { conn.on("open", () => { conn.send({ t: "cheia" }); setTimeout(() => conn.close(), 300); }); return; } ligarConn(conn, () => { Net.ligado = true; aoEntrar(); }); });
  peer.on("disconnected", () => { try { peer.reconnect(); } catch (e) {} });
  peer.on("error", e => { if (e.type === "unavailable-id") return netCriar(aoCodigo, aoEntrar, aoErro); aoErro(e.type === "network" || e.type === "server-error" || e.type === "socket-error" ? "Sem conexão com o servidor do online. Confira a internet." : "Erro no online: " + e.type); });
}
function netEntrar(cod, aoConectar, aoErro) {
  netFechar(); Net.papel = "guest"; cod = cod.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (cod.length !== 5) return aoErro("O código tem 5 letras/números."); Net.codigo = cod;
  if (usarBC()) { Net.bc = new BroadcastChannel("roca-" + cod); Net.bc.onmessage = e => netReceber(e.data); Net.bc.postMessage({ t: "oi" }); aoConectar(); return; }
  if (typeof Peer !== "function") return aoErro("O online não carregou. Confira a internet e tente de novo.");
  const peer = new Peer(undefined, { debug: 0, config: ICE }); Net.peer = peer; let ok = false;
  const desiste = setTimeout(() => { if (!ok) aoErro("Não consegui falar com essa sala. Às vezes a rede (4G ou Wi-Fi) bloqueia; tente outra rede."); }, 20000);
  peer.on("open", () => ligarConn(peer.connect(PREFIXO + cod, { reliable: true, serialization: "json" }), () => { ok = true; clearTimeout(desiste); enviar({ t: "oi" }); aoConectar(); }));
  peer.on("error", e => { clearTimeout(desiste); aoErro(e.type === "peer-unavailable" ? "Não achei essa sala. Confira o código (e se o amigo ainda está esperando)." : e.type === "network" || e.type === "server-error" || e.type === "socket-error" ? "Sem conexão com o servidor do online. Confira a internet." : "Erro no online: " + e.type); });
}
function netCaiu() {
  if (!Net.papel) return; const era = Net.papel;
  if (era === "host" && R && window.rocaAtiva && R.online === "host") {
    // a sala continua aberta: o amigo pode voltar com o mesmo código
    if (!Net.ligado && !Net.conn) return;
    try { if (Net.conn) Net.conn.close(); } catch (e) {} Net.conn = null; Net.ligado = false;
    R.outro = null; abrirChat && el.rcChatBar && !el.rcChatBar.hidden && abrirChat(false); hud();
    efeito(`Seu amigo saiu. A sala ${Net.codigo} continua aberta.`, "#e8e2d4"); return;
  }
  netFechar();
  if (!R || !window.rocaAtiva) return;
  if (era === "host") { R.outro = null; R.online = null; efeito("Seu amigo saiu. Você continua sozinha.", "#e8e2d4"); return; }
  painelAberto = true; el.rcPainel.hidden = false; el.rcPainel.innerHTML = `<div class="rc-caixa"><h2>A conexão caiu</h2><p>Perdemos o contato com a sala do seu amigo.</p><div class="rc-linha"><button type="button" class="rc-op dest" id="rcSair">Voltar</button></div></div>`;
  el.rcPainel.querySelector("#rcSair").addEventListener("click", () => { fecharPainel(); menuInicial(); });
}
const novoOutro = () => ({ eu: { x: 14.2, y: 12.9, dir: 1, anda: 0, fase: 0 }, dentro: false, sala: { x: 5.6, y: 5.6, dir: 1 }, lanterna: false, correndo: false, regando: 0, velaCom: false, pesca: null, perto: 0, caido: null, folego: 100, chapeu: "palha", semente: 0, cor: 1, agua: 5, vidas: 1, lugar: "sitio", predio: null, andar: 0, int: { x: 4.5, y: 5.2, dir: 1 }, roupa: null, garrafada: 0, broa: 0, conv: {} });
function netReceber(d) {
  if (!d || !d.t) return;
  if (d.t === "tchau") return netCaiu();
  if (d.t === "chat") return receberChat(d.txt);
  if (Net.papel === "host") {
    if (!R || !R.outro) return; const o = R.outro;
    if (d.t === "eu") { if (!o.caido) { Object.assign(o.eu, d.eu); o.dentro = d.dentro; o.sala = d.sala; o.lugar = ["vila", "mata", "esgoto"].includes(d.lugar) ? d.lugar : "sitio"; o.predio = d.predio || null; o.andar = d.andar | 0; if (d.int) o.int = d.int; o.conv = d.conv || {}; } o.lanterna = d.lanterna && R.oleo > 0 && !o.caido; o.correndo = d.correndo; o.chapeu = d.chapeu; o.semente = cl(d.semente | 0, 0, R.sementes.length - 1); }
    else if (d.t === "acao") { comJogador(o, () => { const a = oQueFazer(); if (a && !a.loc && a.t.split(" ")[0] === String(d.nome).split(" ")[0]) a.fn(); }); hud(); }
    else if (d.t === "compra") { const op = comJogador(o, () => (d.loja ? opcoesLoja(d.loja) : opcoesBancada())).find(x => x.nome.replace(/^✓ /, "") === d.nome); if (op && op.ok) { R.moedas -= op.preco; comJogador(o, op.fn); S.moedas(); hud(); } }
    else if (d.t === "missao") { comJogador(o, () => aplicarMissao(d.id, d.op, d.alvo)); }
    else if (d.t === "peixe") { R.peixes[d.nome] = (R.peixes[d.nome] || 0) + 1; hud(); }
    return;
  }
  if (Net.papel === "guest") {
    if (d.t === "cheia") { aoErroLobby && aoErroLobby("Essa sala já tem dois jogadores."); netFechar(); return; }
    if (d.t === "inicio") { iniciarJogo("guest", d.volta); return; }
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
  const pl = q => ({ lugar: q.lugar, predio: q.predio, andar: q.andar, int: q.int, roupa: q.roupa, eu: { x: q.eu.x, y: q.eu.y, dir: q.eu.dir, anda: q.eu.anda, fase: q.eu.fase }, dentro: q.dentro, sala: q.sala, lanterna: q.lanterna, regando: q.regando, chapeu: q.chapeu, caido: q.caido ? { quem: q.caido.quem, fora: q.caido.fora } : null, velaCom: q.velaCom, cor: q.cor, perto: q.perto, vidas: q.vidas, agua: q.agua });
  const o = R.outro;
  return { t: "s", T: R.t, dia: R.dia, moedas: R.moedas, agua: R.agua, aguaMax: R.aguaMax, oleo: R.oleo, vel: R.vel, lanternaBoa: R.lanternaBoa, sementes: R.sementes, vara: R.vara, pecas: R.pecas, peneira: R.peneira,
    missoes: R.missoes, mprog: R.mprog, apito: R.apito, guizo: R.guizo, isca: R.isca, medalha: R.medalha, enxada: R.enxada, lampiao: R.lampiao, ferradura: R.ferradura, sal: R.sal, arruda: R.arruda, aguaBenta: R.aguaBenta, inv: R.inv, colheita: R.colheita, peixes: R.peixes, extra: R.extra, ovos: R.ovos, frutas: R.frutas, mel: R.mel, lamparinas: R.lamparinas, pisadeira: R.pisadeira, canteiros: R.canteiros.map(k => [k.aberto, k.covas]),
    gato: R.gato, cachorro: R.cachorro, seco: R.seco, vulto: R.vulto, vela: R.vela, velaEntregue: R.velaEntregue, velaHoje: R.velaHoje, alma: R.alma, galinhas: R.galinhas, porcos: R.porcos,
    aranha: R.aranha, mula: R.mula, saci: R.saci, esp: R.esp, curu: R.curu, cuca: R.cuca, queimado: R.queimado, sinoT: R.sinoT, sinoUsado: R.sinoUsado, fx: R.fx, morto: R.morto, venceu: R.venceu ? { t: R.venceu.t } : null, tempoTotal: R.tempoTotal,
    outro: pl(R), voce: o ? { roupa: o.roupa, garrafada: o.garrafada, broa: o.broa, caido: o.caido ? { quem: o.caido.quem, fora: o.caido.fora } : null, velaCom: o.velaCom, regando: o.regando, agua: o.agua, vidas: o.vidas } : null };
}
const SUAVE = ["gato", "cachorro", "seco", "aranha", "esp", "saci", "vulto", "mula", "curu", "cuca"];
function aplicarEstado(d) {
  const suave = (velho, novo) => { if (velho && novo && novo.x != null && velho.x != null && Math.hypot(novo.x - velho.x, novo.y - velho.y) < 4) { novo.ax = novo.x; novo.ay = novo.y; novo.x = velho.x; novo.y = velho.y; } };
  SUAVE.forEach(k => suave(R[k], d[k])); ["galinhas", "porcos"].forEach(k => d[k] && d[k].forEach((g, i) => suave(R[k] && R[k][i], g)));
  if (d.outro && R.outro) { const a = d.outro.eu, b = R.outro.eu; suave(b, a); if (d.outro.sala && R.outro.sala) suave(R.outro.sala, d.outro.sala); }
  ["missoes", "mprog", "apito", "guizo", "isca", "medalha", "enxada", "lampiao", "ferradura", "sal", "arruda", "aguaBenta", "dia", "moedas", "aguaMax", "oleo", "vel", "lanternaBoa", "sementes", "vara", "pecas", "peneira", "inv", "colheita", "peixes", "extra", "ovos", "frutas", "mel", "lamparinas", "pisadeira",
    "gato", "cachorro", "seco", "vulto", "vela", "velaEntregue", "velaHoje", "alma", "galinhas", "porcos", "aranha", "mula", "saci", "esp", "curu", "cuca", "queimado", "sinoT", "sinoUsado", "outro", "tempoTotal"].forEach(k => { R[k] = d[k]; });
  R.t = d.T; R.fxR = d.fx || []; R.semente = cl(R.semente, 0, R.sementes.length - 1);
  d.canteiros.forEach(([a, cv2], i) => { R.canteiros[i].aberto = a; R.canteiros[i].covas = cv2; });
  if (d.voce) { R.roupa = d.voce.roupa; R.garrafada = d.voce.garrafada; if (d.voce.broa > 0 && !(R.broa > 0)) R.broa = d.voce.broa; R.agua = d.voce.agua; R.vidas = d.voce.vidas; if (d.voce.caido) { cairLocal(d.voce.caido.quem); R.caido.fora = d.voce.caido.fora; } else if (R.caido && R.caido.t > 2.5) R.caido = null; R.velaCom = d.voce.velaCom; if (d.voce.regando > 0) R.regando = d.voce.regando; }
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
  moverLocal(dt); if (R.lugar === "esgoto") atualizarEsgoto(dt); atualizarPesca(dt);
  if (R.oleo <= 0) R.lanterna = false;
  R.perto = calcPerto(); musicaPasso(dt);
  Net.envT -= dt; if (Net.envT <= 0) { Net.envT = .066; enviar({ t: "eu", eu: { x: R.eu.x, y: R.eu.y, dir: R.eu.dir, anda: R.eu.anda, fase: R.eu.fase }, dentro: R.dentro, sala: R.sala, lugar: R.lugar, predio: R.predio, andar: R.andar, int: R.int, conv: R.conv, lanterna: R.lanterna, correndo: R.correndo, chapeu: R.chapeu, semente: R.semente }); }
  if (Math.floor(R.t * 2) !== Math.floor((R.t - dt) * 2)) hud();
  const o = oQueFazer(); el.rcAcao.textContent = o ? o.t : "Ação"; el.rcAcao.style.opacity = o ? 1 : .5;
}

/* ---------- chat do online ---------- */
const CHAT = { meu: null, dele: null, log: [] };
function abrirChat(abrir) { el.rcChatBar.hidden = !abrir; el.rcChatN.hidden = true; if (abrir) { try { el.rcChatIn.focus(); } catch (e) {} setTimeout(() => { try { el.rcChatIn.focus(); } catch (e) {} }, 50); } else try { el.rcChatIn.blur(); } catch (e) {} }
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
/* ---------- tela inicial: o sítio de dia, a Yasmin e a Sombrinha ---------- */
let TIT = null;
function gatoEm(x, y, s, dir, anda, tm, cx = c) {
  const [, corG, corL, corO, listra] = corGato();
  cx.save(); cx.translate(x, y); cx.scale((dir || 1) * s, s); const pa = anda ? Math.sin(tm * 14) * 2 : 0;
  cx.fillStyle = corG; cx.fillRect(-7 + pa, -5, 2.5, 5); cx.fillRect(4 - pa, -5, 2.5, 5);
  cx.beginPath(); cx.ellipse(0, -8, 9, 5, 0, 0, 7); cx.fill(); cx.beginPath(); cx.arc(8, -13, 5, 0, 7); cx.fill();
  cx.beginPath(); cx.moveTo(5, -16); cx.lineTo(6, -21); cx.lineTo(9, -17); cx.moveTo(9, -17); cx.lineTo(12, -21); cx.lineTo(12, -15); cx.fill();
  cx.fillStyle = corL; if (listra) { for (const lx of [-5, -1.5, 2]) { cx.beginPath(); cx.ellipse(lx, -11.5, 1.2, 3, .2, 0, 7); cx.fill(); } cx.fillRect(6.5, -17.5, 1, 2.5); cx.fillRect(8.4, -18, 1, 2.5); } else { cx.globalAlpha = .5; cx.beginPath(); cx.ellipse(0, -6, 6, 2, 0, 0, 7); cx.fill(); cx.globalAlpha = 1; }
  cx.fillStyle = "#f2b0b8"; cx.beginPath(); cx.moveTo(6.2, -17); cx.lineTo(6.6, -19.5); cx.lineTo(8, -17.4); cx.fill(); // dentro da orelha
  cx.strokeStyle = corG; cx.lineWidth = 3; cx.lineCap = "round"; cx.beginPath(); cx.moveTo(-8, -9); cx.quadraticCurveTo(-15, -14 + Math.sin(tm * 2) * 3, -13, -20); cx.stroke();
  cx.fillStyle = corO; cx.fillRect(9, -14, 1.6, Math.sin(tm * .7) > .97 ? .4 : 1.6); cx.fillRect(12, -14, 1.6, Math.sin(tm * .7) > .97 ? .4 : 1.6); cx.fillStyle = "#d88a8a"; cx.fillRect(12.5, -11.5, 1.2, 1);
  cx.fillStyle = "#e86a9a"; cx.beginPath(); cx.moveTo(5, -10); cx.lineTo(2.5, -12.5); cx.lineTo(2.5, -7.5); cx.closePath(); cx.moveTo(5, -10); cx.lineTo(7.5, -12.5); cx.lineTo(7.5, -7.5); cx.closePath(); cx.fill(); cx.fillStyle = "#c84a7a"; cx.beginPath(); cx.arc(5, -10, 1.2, 0, 7); cx.fill();
  cx.strokeStyle = corG === "#eeeae2" ? "rgba(90,90,90,.5)" : "rgba(230,230,230,.5)"; cx.lineWidth = .6; cx.beginPath(); cx.moveTo(12, -12); cx.lineTo(16, -13); cx.moveTo(12, -11.4); cx.lineTo(16, -11); cx.stroke();
  cx.restore();
}
const yasminMenu = () => ({ eu: { dir: 1, anda: 0, fase: 0 }, perto: 0, cor: 0, chapeu: null });
function comCtx(g, fn) { const c0 = c; c = g; try { fn(); } finally { c = c0; } }
// retratinho de quem fala (para a caixa de fala)
const RETRATOS = {};
function retratoFala(quem) {
  const np = typeof NPCS !== "undefined" ? NPCS.find(n => n.nome === quem) : null;
  const k = /yasmin/i.test(quem) ? "y" : /sombrinha/i.test(quem) ? "g" : np ? "n:" + np.id : null; if (!k) return "";
  if (!RETRATOS[k]) { const cv2 = document.createElement("canvas"); cv2.width = cv2.height = 112; const g = cv2.getContext("2d");
    g.fillStyle = k === "y" ? "#f2c66a" : k === "g" ? "#9ac8e8" : ["#b8d89a", "#e8b8a8", "#c8b8e8", "#e8d898"][k.length % 4]; g.fillRect(0, 0, 112, 112); g.fillStyle = "rgba(255,255,255,.25)"; for (let i = 0; i < 112; i += 14) g.fillRect(i, 0, 7, 112);
    if (k === "y") comCtx(g, () => desenharVoce(50, 182, 0, { q: yasminMenu(), s: 150, anda: 0 })); else if (np) { const kk = np.look.crianca ? .8 : np.look.grande ? 1.1 : 1, ss = 150 / kk; comCtx(g, () => { const sb = sombra; desenharNpc(np.look.gemeas ? { ...np, look: { ...np.look, gemeas: 0 } } : np, 50, 182, ss, 0, { uma: 1, wx: -1e9 }); }); } else gatoEm(26, 120, 5.2, 1, 0, 0, g);
    RETRATOS[k] = cv2.toDataURL(); }
  return `<img class="rc-fala-ret" alt="" src="${RETRATOS[k]}">`;
}
function nuvem(g, x, y, r) { g.fillStyle = "#e4eef4"; [[0, .2, 1], [-1, .35, .7], [1, .35, .75], [-.5, 0, .8], [.55, -.05, .7]].forEach(([dx, dy, k]) => { g.beginPath(); g.arc(x + dx * r, y + dy * r + 4, r * k, 0, 7); g.fill(); }); g.fillStyle = "#fff"; [[0, .1, 1], [-1, .3, .7], [1, .3, .75], [-.5, -.1, .8], [.55, -.15, .7]].forEach(([dx, dy, k]) => { g.beginPath(); g.arc(x + dx * r, y + dy * r, r * k, 0, 7); g.fill(); }); }
function desenharTitulo(g, w, h, t) {
  let sd = 3; const r2 = () => { sd = (sd * 16807) % 2147483647; return (sd - 1) / 2147483646; };
  // céu e sol
  const ceu = g.createLinearGradient(0, 0, 0, h * .7); ceu.addColorStop(0, "#5fb4e6"); ceu.addColorStop(.55, "#a8dcf0"); ceu.addColorStop(1, "#fff0c6"); g.fillStyle = ceu; g.fillRect(0, 0, w, h);
  const sx = w * .09, sy = h * .16, sr = h * .07; const gl = g.createRadialGradient(sx, sy, sr * .5, sx, sy, sr * 4); gl.addColorStop(0, "rgba(255,240,170,.9)"); gl.addColorStop(1, "rgba(255,240,170,0)"); g.fillStyle = gl; g.fillRect(0, 0, sx + sr * 4, sy + sr * 4);
  g.save(); g.translate(sx, sy); g.rotate(t * .1); g.fillStyle = "rgba(255,226,120,.55)"; for (let i = 0; i < 12; i++) { g.rotate(PI / 6); g.fillRect(sr * 1.2, -sr * .08, sr * .55, sr * .16); } g.restore();
  g.fillStyle = "#ffe27a"; g.beginPath(); g.arc(sx, sy, sr, 0, 7); g.fill(); g.fillStyle = "#fff3b8"; g.beginPath(); g.arc(sx - sr * .25, sy - sr * .25, sr * .45, 0, 7); g.fill();
  for (let i = 0; i < 6; i++) { const v = 8 + i * 3, x = ((i * 337 + t * v) % (w + 400)) - 200, y = h * (.08 + (i % 3) * .09), r = h * (.035 + (i % 2) * .02); nuvem(g, x, y, r); }
  g.strokeStyle = "#3a4a5a"; g.lineWidth = 2; for (let i = 0; i < 4; i++) { const x = (w * .3 + t * 40 + i * 38) % (w + 100) - 50, y = h * .2 + Math.sin(t * .8 + i) * 12 + i * 9, a = Math.sin(t * 9 + i) * 4; g.beginPath(); g.moveTo(x - 7, y - a); g.lineTo(x, y); g.lineTo(x + 7, y - a); g.stroke(); } // passarinhos
  // serras e morros
  const morro = (base, amp, fr, fase, cor) => { g.fillStyle = cor; g.beginPath(); g.moveTo(0, h); for (let x = 0; x <= w; x += 8) g.lineTo(x, h * base - Math.sin(x / w * fr + fase) * h * amp - Math.sin(x / w * fr * 2.7 + fase) * h * amp * .35); g.lineTo(w, h); g.fill(); };
  morro(.5, .07, 5, 1, "#9cc4d4"); morro(.56, .06, 7, 3, "#86b48e");
  // árvores redondas nos morros
  for (let i = 0; i < 26; i++) { const x = r2() * w, y = h * (.53 + r2() * .06), rr = h * (.018 + r2() * .016); g.fillStyle = "#5a3a22"; g.fillRect(x - 2, y, 4, rr); g.fillStyle = ["#5e9a4a", "#4e8a40", "#6aa852"][i % 3]; g.beginPath(); g.arc(x, y, rr, 0, 7); g.fill(); g.fillStyle = "rgba(255,255,255,.15)"; g.beginPath(); g.arc(x - rr * .3, y - rr * .3, rr * .45, 0, 7); g.fill(); }
  morro(.64, .035, 4, 5, "#7cba52");
  // plantação em fileiras no morro da direita
  g.save(); g.beginPath(); g.moveTo(w * .62, h * .66); g.lineTo(w, h * .6); g.lineTo(w, h * .76); g.lineTo(w * .7, h * .78); g.closePath(); g.clip(); g.fillStyle = "#8ab048"; g.fillRect(0, 0, w, h); g.strokeStyle = "#6a9a3a"; g.lineWidth = 3; for (let i = 0; i < 16; i++) { g.beginPath(); g.moveTo(w * .6, h * (.64 + i * .012)); g.lineTo(w, h * (.58 + i * .014)); g.stroke(); } g.restore();
  // a casa do sítio
  const cx2 = w * .5, cy2 = h * .67, cw = h * .3, chh = h * .17;
  g.fillStyle = "rgba(0,0,0,.15)"; g.beginPath(); g.ellipse(cx2, cy2 + 2, cw * .62, h * .02, 0, 0, 7); g.fill();
  g.fillStyle = "#f4ead6"; g.fillRect(cx2 - cw / 2, cy2 - chh, cw, chh); g.fillStyle = "#d8c8a8"; g.fillRect(cx2 - cw / 2, cy2 - chh * .12, cw, chh * .12);
  g.fillStyle = "#c8583a"; g.beginPath(); g.moveTo(cx2 - cw * .6, cy2 - chh + 2); g.lineTo(cx2 - cw * .4, cy2 - chh * 1.7); g.lineTo(cx2 + cw * .4, cy2 - chh * 1.7); g.lineTo(cx2 + cw * .6, cy2 - chh + 2); g.fill();
  g.strokeStyle = "rgba(90,30,20,.35)"; g.lineWidth = 2; for (let i = 1; i < 5; i++) { const yy = cy2 - chh - i * chh * .14; g.beginPath(); g.moveTo(cx2 - cw * (.6 - i * .04), yy); g.lineTo(cx2 + cw * (.6 - i * .04), yy); g.stroke(); }
  g.fillStyle = "#8a4a2a"; g.fillRect(cx2 + cw * .22, cy2 - chh * 1.95, cw * .08, chh * .4);
  for (let i = 0; i < 4; i++) { const k = ((t * .35 + i * .25) % 1); g.fillStyle = `rgba(255,255,255,${.6 * (1 - k)})`; g.beginPath(); g.arc(cx2 + cw * .26 + Math.sin(k * 6 + i) * 8, cy2 - chh * 2 - k * h * .14, h * (.012 + k * .02), 0, 7); g.fill(); } // fumacinha do fogão
  g.fillStyle = "#6a3a22"; g.fillRect(cx2 - cw * .08, cy2 - chh * .62, cw * .16, chh * .62); g.fillStyle = "#f2c94a"; g.fillRect(cx2 + cw * .04, cy2 - chh * .32, 3, 3);
  [[-.34], [.22]].forEach(([fx]) => { const jx = cx2 + cw * fx, jy = cy2 - chh * .72; g.fillStyle = "#3a6a8a"; g.fillRect(jx, jy, cw * .13, chh * .34); g.fillStyle = "#a8d8f0"; g.fillRect(jx + 2, jy + 2, cw * .13 - 4, chh * .34 - 4); g.fillStyle = "#3a6a8a"; g.fillRect(jx + cw * .063, jy, 2, chh * .34); g.fillStyle = "#2e7a3a"; g.fillRect(jx - 4, jy - 2, 4, chh * .38); g.fillRect(jx + cw * .13, jy - 2, 4, chh * .38); g.fillStyle = "#e86a6a"; for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(jx + 4 + i * cw * .03, jy + chh * .38, 3, 0, 7); g.fill(); } }); // janelas com floreira
  // catavento
  const kx = w * .66, ky = h * .69; g.strokeStyle = "#7a7a7a"; g.lineWidth = 3; g.beginPath(); g.moveTo(kx - h * .03, ky); g.lineTo(kx, ky - h * .22); g.lineTo(kx + h * .03, ky); g.stroke();
  g.save(); g.translate(kx, ky - h * .22); g.rotate(t * 1.6); for (let i = 0; i < 8; i++) { g.rotate(PI / 4); g.fillStyle = i % 2 ? "#e8e4d8" : "#d84a3a"; g.beginPath(); g.moveTo(0, 0); g.lineTo(h * .07, -h * .012); g.lineTo(h * .075, h * .012); g.fill(); } g.fillStyle = "#4a4a4a"; g.beginPath(); g.arc(0, 0, 4, 0, 7); g.fill(); g.restore();
  // cerca
  g.fillStyle = "#c8a06a"; const fy = h * .76; g.fillRect(0, fy - h * .045, w, h * .012); g.fillRect(0, fy - h * .02, w, h * .012); for (let x = 10; x < w; x += h * .07) { g.fillRect(x, fy - h * .07, h * .016, h * .075); g.fillStyle = "#a8804a"; g.fillRect(x, fy - h * .07, h * .016, 3); g.fillStyle = "#c8a06a"; }
  // girassóis balançando
  for (let i = 0; i < 9; i++) { const x = w * (.36 + i * .035), b = Math.sin(t * 1.4 + i) * 4, hh = h * (.13 + (i % 3) * .025), y = fy + h * .02; g.strokeStyle = "#4a8a2a"; g.lineWidth = 3; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + b * .5, y - hh * .5, x + b, y - hh); g.stroke(); g.fillStyle = "#5a9a32"; g.beginPath(); g.ellipse(x + 6, y - hh * .45, 8, 3.5, -.5, 0, 7); g.fill();
    g.save(); g.translate(x + b, y - hh); g.rotate(b * .03); g.fillStyle = "#f6c21e"; for (let p = 0; p < 12; p++) { g.rotate(PI / 6); g.beginPath(); g.ellipse(h * .02, 0, h * .016, h * .006, 0, 0, 7); g.fill(); } g.fillStyle = "#6a3a12"; g.beginPath(); g.arc(0, 0, h * .013, 0, 7); g.fill(); g.restore(); }
  // gramado da frente com caminho de terra
  const gr = g.createLinearGradient(0, h * .74, 0, h); gr.addColorStop(0, "#78b84a"); gr.addColorStop(1, "#4e8e36"); g.fillStyle = gr; g.beginPath(); g.moveTo(0, h * .79); g.quadraticCurveTo(w * .5, h * .75, w, h * .8); g.lineTo(w, h); g.lineTo(0, h); g.fill();
  g.fillStyle = "#c89a62"; g.beginPath(); g.moveTo(cx2 - cw * .06, h * .772); g.quadraticCurveTo(cx2 - cw * .1, h * .86, w * .36, h); g.lineTo(w * .58, h); g.quadraticCurveTo(cx2 + cw * .05, h * .86, cx2 + cw * .06, h * .772); g.fill();
  g.fillStyle = "rgba(255,255,255,.18)"; g.beginPath(); g.moveTo(cx2 - cw * .02, h * .78); g.quadraticCurveTo(cx2 - cw * .03, h * .87, w * .45, h); g.lineTo(w * .5, h); g.quadraticCurveTo(cx2 + cw * .01, h * .87, cx2 + cw * .02, h * .78); g.fill();
  for (let i = 0; i < 26; i++) { const k = r2(), x = mix(cx2, w * .47, k) + (r2() - .5) * (40 + k * 120), y = h * (.78 + k * .21); g.fillStyle = r2() < .5 ? "#a87a48" : "#e0c08a"; g.beginPath(); g.ellipse(x, y, 2 + k * 4, 1.2 + k * 2.2, 0, 0, 7); g.fill(); } // pedrinhas
  for (let i = 0; i < 160; i++) { const x = r2() * w, y = h * (.78 + r2() * .22), k = (y / h - .76) * 4, bb = Math.sin(t * 1.8 + x * .02) * 2 * k; if (x > w * .38 && x < w * .58 && y > h * .8) continue; g.strokeStyle = r2() < .5 ? "#5e9e3a" : "#8acb5a"; g.lineWidth = 1.5 + k; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 3 * k + bb, y - 8 * k - 4); g.moveTo(x, y); g.lineTo(x + 3 * k + bb, y - 7 * k - 3); g.stroke(); }
  for (let i = 0; i < 40; i++) { const x = r2() * w, y = h * (.8 + r2() * .19); if (x > w * .38 && x < w * .58) continue; const cor = ["#fff", "#f6d24a", "#f28ab0", "#c8a0f0"][i % 4], rr = 2.5 + (y / h - .8) * 14; g.fillStyle = cor; for (let p = 0; p < 5; p++) { const a = p / 5 * PI * 2; g.beginPath(); g.arc(x + Math.cos(a) * rr * .8, y + Math.sin(a) * rr * .8, rr * .55, 0, 7); g.fill(); } g.fillStyle = "#f2a020"; g.beginPath(); g.arc(x, y, rr * .45, 0, 7); g.fill(); } // florzinhas
  // a Yasmin e a Sombrinha
  const baixo = h < 480, ys = h * (baixo ? .4 : .36), yx = w * (baixo ? .19 : .25), yy = h * (baixo ? .88 : .93) + Math.abs(Math.sin(t * 2.2)) * -h * .006;
  g.fillStyle = "rgba(0,40,0,.25)"; g.beginPath(); g.ellipse(yx, yy + h * .005, ys * .3, ys * .07, 0, 0, 7); g.fill();
  comCtx(g, () => desenharVoce(yx, yy, t, { q: yasminMenu(), s: ys, anda: 0, dir: 1 }));
  const gx = w * (baixo ? .29 : .34), gy = yy + h * .005; g.fillStyle = "rgba(0,40,0,.25)"; g.beginPath(); g.ellipse(gx, gy, h * .05, h * .012, 0, 0, 7); g.fill(); gatoEm(gx, gy, h * (baixo ? .0072 : .0062), -1, 0, t, g);
  // borboletas
  for (let i = 0; i < 4; i++) { const bx = w * (.15 + i * .14) + Math.sin(t * .7 + i * 2) * w * .05, by = h * (.72 + Math.sin(t * 1.1 + i) * .06), a = Math.abs(Math.sin(t * 12 + i)); g.fillStyle = ["#f28a3a", "#f2e04a", "#8ac8f0", "#f28ab0"][i]; g.beginPath(); g.ellipse(bx - 5 * a, by, 6 * a + 1, 4, -.4, 0, 7); g.ellipse(bx + 5 * a, by, 6 * a + 1, 4, .4, 0, 7); g.fill(); g.fillStyle = "#2a1a10"; g.fillRect(bx - 1, by - 4, 2, 8); }
  // placa de madeira com o nome do jogo, pendurada por cordas
  const lw = Math.min(w * .42, h * .78, 560), lh = lw * .34, lx = Math.max(w * .33 - lw / 2, w * .04), balanca = Math.sin(t * .9) * .012, ly = h * .05;
  g.save(); g.translate(lx + lw / 2, 0); g.rotate(balanca); g.translate(-lw / 2, 0);
  g.strokeStyle = "#7a5a3a"; g.lineWidth = 4; g.beginPath(); g.moveTo(lw * .15, 0); g.lineTo(lw * .15, ly + 6); g.moveTo(lw * .85, 0); g.lineTo(lw * .85, ly + 6); g.stroke();
  g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(10, ly + 10, lw, lh);
  g.fillStyle = "#3a2210"; g.fillRect(-4, ly - 4, lw + 8, lh + 8);
  for (let i = 0; i < 3; i++) { g.fillStyle = ["#a8703e", "#9a6434", "#b07a46"][i]; g.fillRect(0, ly + i * lh / 3, lw, lh / 3 - 2); g.fillStyle = "rgba(60,30,10,.25)"; for (let k = 0; k < 6; k++) g.fillRect(r2() * lw, ly + i * lh / 3 + r2() * lh / 3, lw * (.1 + r2() * .2), 2); }
  g.fillStyle = "#5a5a5a"; [[10, 10], [lw - 16, 10], [10, lh - 16], [lw - 16, lh - 16]].forEach(([x, y]) => { g.fillRect(x, ly + y, 6, 6); g.fillStyle = "#9a9a9a"; g.fillRect(x + 1, ly + y + 1, 2, 2); g.fillStyle = "#5a5a5a"; }); // pregos
  g.textAlign = "center"; g.lineJoin = "round";
  const t1 = Math.round(lh * .52); g.font = `800 ${t1}px "Big Shoulders Display", Impact, sans-serif`; g.lineWidth = Math.max(5, t1 * .14); g.strokeStyle = "#3a1e0a"; g.strokeText("ROÇA", lw / 2, ly + lh * .55); g.fillStyle = "#fff4d8"; g.fillText("ROÇA", lw / 2, ly + lh * .55); g.fillStyle = "rgba(255,255,255,.5)"; g.fillText("ROÇA", lw / 2, ly + lh * .55 - 2); g.fillStyle = "#fff4d8"; g.fillText("ROÇA", lw / 2, ly + lh * .55 - 1);
  const t2 = Math.round(lh * .25); g.font = `800 ${t2}px "Big Shoulders Display", Impact, sans-serif`; g.lineWidth = Math.max(4, t2 * .16); g.strokeText("ASSOMBRADA", lw / 2, ly + lh * .87); g.fillStyle = "#ffd25a"; g.fillText("ASSOMBRADA", lw / 2, ly + lh * .87);
  g.textAlign = "start";
  g.restore();
}
function musicaTitulo(t) { // musiquinha de caixinha de música + passarinhos
  if (!AC || mudo || !TIT) return; const bpm = .32, notas = [0, 4, 7, 12, 9, 7, 4, 7, 5, 9, 12, 9, 7, 4, 2, 4], base = 392;
  while (TIT.prox < t + .3) { const i = TIT.n++ % notas.length, q = TIT.prox - t; tocarTom(base * Math.pow(2, notas[i] / 12), .5, { tipo: "triangle", vol: .035, quando: Math.max(0, q), lp: 3000 }); if (i % 4 === 0) tocarTom(base / 2 * Math.pow(2, [0, 5, 7, 5][(i / 4) % 4] / 12), .9, { tipo: "sine", vol: .03, quando: Math.max(0, q) }); TIT.prox += bpm; }
  if (Math.random() < .006) { const f0 = rnd(2400, 3400); for (let k = 0; k < 3; k++) tocarTom(f0 + k * 120, .07, { vol: .02, ate: f0 * 1.2, quando: k * .1 }); }
}
function mostrarTitulo(on) {
  const d = el.rcTitulo; if (!d) return; d.hidden = !on;
  if (!on) { TIT = null; el.rcTitMenu.innerHTML = ""; return; }
  if (TIT) return; TIT = { t0: performance.now(), n: 0, prox: 0 }; const cv2 = document.getElementById("rcTitCv"), g = cv2.getContext("2d");
  const q = now => { if (!TIT || d.hidden) return; const dpr = Math.min(2, devicePixelRatio || 1), w = cv2.clientWidth || d.clientWidth || innerWidth, h = cv2.clientHeight || d.clientHeight || innerHeight; if (cv2.width !== Math.round(w * dpr) || cv2.height !== Math.round(h * dpr)) { cv2.width = Math.round(w * dpr); cv2.height = Math.round(h * dpr); } g.setTransform(dpr, 0, 0, dpr, 0, 0); const t = (now - TIT.t0) / 1000; if (!TIT.prox) TIT.prox = t + .5; desenharTitulo(g, w, h, t); musicaTitulo(t); requestAnimationFrame(q); };
  requestAnimationFrame(q);
}
const ICS_MENU = { jogar: '<svg viewBox="0 0 16 16"><path d="M4 2h2v2h2v2h2v2h-2v2h-2v2h-2z"/></svg>', online: '<svg viewBox="0 0 16 16"><path d="M3 3h4v4h-4zM9 3h4v4h-4zM2 9h6v4h-6zM8 9h6v4h-6z"/></svg>', hist: '<svg viewBox="0 0 16 16"><path d="M2 3h5v10h-5zM9 3h5v10h-5zM3 5h3v1h-3zM10 5h3v1h-3zM3 7h3v1h-3zM10 7h3v1h-3z"/></svg>', opc: '<svg viewBox="0 0 16 16"><path d="M7 1h2v3h-2zM7 12h2v3h-2zM1 7h3v2h-3zM12 7h3v2h-3zM5 5h6v6h-6zM7 7h2v2h-2z" fill-rule="evenodd"/></svg>', sair: '<svg viewBox="0 0 16 16"><path d="M3 2h7v3h-2v-1h-3v8h3v-1h2v3h-7zM10 6h1v-2h2v2h1v4h-1v2h-2v-2h-1z"/></svg>', voltar: '<svg viewBox="0 0 16 16"><path d="M2 8l4-4v3h8v2h-8v3z"/></svg>', criar: '<svg viewBox="0 0 16 16"><path d="M7 2h2v5h5v2h-5v5h-2v-5h-5v-2h5z"/></svg>', entrar: '<svg viewBox="0 0 16 16"><path d="M2 7h7v-3l5 4-5 4v-3h-7z"/></svg>' };
function telaTituloMenu(sub) {
  const m = el.rcTitMenu, b = (id, ic, txt, sm, cls = "") => `<button type="button" class="rc-tbt ${cls}" id="${id}"><i>${ICS_MENU[ic]}</i><span>${txt}${sm ? `<small>${sm}</small>` : ""}</span></button>`;
  if (sub === "online") m.innerHTML = `<h3>Jogar com amigo</h3>${b("rcCriar", "criar", "Criar sala", "Gera um código")}${b("rcEntrarSala", "entrar", "Entrar numa sala", "Digite o código")}${b("rcTVolta", "voltar", "Voltar")}`;
  else m.innerHTML = `${b("rcSolo", "jogar", "Jogar", "Você e a Sombrinha", "dest")}${b("rcTOn", "online", "Jogar com amigo", "Pela internet")}${b("rcHistBt", "hist", "A história", "Como tudo começou")}${window.ROCA_SOLO ? b("rcOpcoes", "opc", "Opções") : ""}${window.ROCA_SOLO ? (window.PC || (window.Android && Android.sair) ? b("rcTSair", "sair", "Sair do jogo") : "") : b("rcTSair", "voltar", "Voltar ao menu")}`;
  const on = (id, fn) => { const e = document.getElementById(id); if (e) e.addEventListener("click", () => { initAudio(); tocarTom(660, .06, { tipo: "square", vol: .04 }); fn(); }); };
  on("rcSolo", () => iniciarJogo("solo")); on("rcTOn", () => telaTituloMenu("online")); on("rcTVolta", () => telaTituloMenu());
  on("rcCriar", criarSala); on("rcEntrarSala", entrarSala); on("rcHistBt", () => { mostrarTitulo(false); historia(menuInicial); }); on("rcOpcoes", opcoes);
  on("rcTSair", () => { if (window.ROCA_SOLO) { try { if (window.PC) PC.sair(); else if (window.Android && Android.sair) Android.sair(); else window.close(); } catch (e) { window.close(); } return; } mostrarTitulo(false); sairRoca(); });
  const pc = matchMedia("(pointer: fine)").matches;
  el.rcTitRod.classList.toggle("cel", !pc); el.rcTitRod.innerHTML = `<span>versão ${window.ROCA_VERSAO || "1"}</span>${pc ? `<span><b>WASD</b> andar · <b>E</b> ação · <b>R</b> lanterna · <b>Shift</b> correr · <b>M</b> mochila · <b>Q</b> semente · <b>T</b> chat</span>` : ""}`;
  setTimeout(() => { const f = m.querySelector("button"); if (f && (pc || CONTROLE.usado)) f.focus(); }, 30);
}

// o ícone do jogo (gerado a partir dos desenhos do próprio jogo)
function desenharIcone(g, S, modo = "tudo") {
  const bg = modo !== "frente", fg = modo !== "fundo";
  if (bg) {
    const ceu = g.createLinearGradient(0, 0, 0, S); ceu.addColorStop(0, "#120e26"); ceu.addColorStop(.55, "#3a1e3a"); ceu.addColorStop(1, "#b8502a"); g.fillStyle = ceu; g.fillRect(0, 0, S, S);
    let sd = 5; const r = () => { sd = (sd * 16807) % 2147483647; return (sd - 1) / 2147483646; }; for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(255,250,230,${.3 + r() * .6})`; g.fillRect(r() * S, r() * S * .5, S * .004, S * .004); }
    const mx = S * .72, my = S * .27, mr = S * .17, gl = g.createRadialGradient(mx, my, mr * .6, mx, my, mr * 2.4); gl.addColorStop(0, "rgba(255,230,170,.5)"); gl.addColorStop(1, "rgba(255,230,170,0)"); g.fillStyle = gl; g.fillRect(0, 0, S, S);
    g.fillStyle = "#f6e6b8"; g.beginPath(); g.arc(mx, my, mr, 0, 7); g.fill(); g.fillStyle = "rgba(200,170,110,.35)"; [[-.3, -.2, .22], [.25, .15, .16], [-.05, .35, .12]].forEach(([dx, dy, k]) => { g.beginPath(); g.arc(mx + dx * mr, my + dy * mr, k * mr, 0, 7); g.fill(); });
    g.fillStyle = "#1a0e1a"; g.beginPath(); g.moveTo(0, S); for (let x = 0; x <= S; x += S / 40) g.lineTo(x, S * .7 - Math.sin(x / S * 7) * S * .03 - Math.sin(x / S * 17) * S * .012); g.lineTo(S, S); g.fill();
    for (let i = 0; i < 7; i++) { const x = S * (.02 + i * .05), h = S * (.25 + (i % 3) * .06); g.fillStyle = "#0e080e"; g.fillRect(x - S * .008, S * .72 - h * .4, S * .016, h * .4); g.beginPath(); g.arc(x, S * .72 - h * .5, S * .06, 0, 7); g.fill(); }
    g.fillStyle = "rgba(255,40,20,.95)"; g.fillRect(S * .1, S * .5, S * .012, S * .012); g.fillRect(S * .135, S * .5, S * .012, S * .012); // olhos na mata
    const cx = S * .86, cy = S * .74, cw = S * .2; g.fillStyle = "#120a10"; g.fillRect(cx - cw / 2, cy - cw * .45, cw, cw * .45); g.beginPath(); g.moveTo(cx - cw * .62, cy - cw * .43); g.lineTo(cx, cy - cw * .85); g.lineTo(cx + cw * .62, cy - cw * .43); g.fill(); g.fillStyle = "#f2b04a"; g.fillRect(cx - cw * .3, cy - cw * .32, cw * .16, cw * .14); g.fillRect(cx + cw * .12, cy - cw * .32, cw * .16, cw * .14); // casa com luz
    g.fillStyle = "#0a060a"; g.fillRect(0, S * .86, S, S * .14); const nv = g.createLinearGradient(0, S * .7, 0, S); nv.addColorStop(0, "rgba(200,180,200,0)"); nv.addColorStop(1, "rgba(200,180,200,.22)"); g.fillStyle = nv; g.fillRect(0, S * .7, S, S * .3);
  }
  if (fg) {
    const k = modo === "frente" ? .68 : 1, ox = S * (1 - k) / 2, oy = S * (1 - k) / 2 + (modo === "frente" ? S * .04 : 0);
    g.save(); g.translate(ox, oy); g.scale(k, k);
    const lx = S * .58, ly = S * .62, lg = g.createRadialGradient(lx, ly, 0, lx, ly, S * .42); lg.addColorStop(0, "rgba(255,200,110,.55)"); lg.addColorStop(1, "rgba(255,200,110,0)"); g.fillStyle = lg; g.fillRect(0, 0, S, S);
    g.fillStyle = "rgba(0,0,0,.4)"; g.beginPath(); g.ellipse(S * .45, S * .925, S * .2, S * .04, 0, 0, 7); g.fill();
    const q = { eu: { dir: 1, anda: 0, fase: 0 }, perto: .3, cor: 0, chapeu: null, lanterna: true, dentro: false };
    comCtx(g, () => desenharVoce(S * .4, S * .93, 0, { q, s: S * .6, anda: 0, dir: 1 }));
    const c0 = ls("roca_gato_cor"); ls("roca_gato_cor", "preto"); gatoEm(S * .8, S * .93, S * .0095, -1, 0, 1.2, g); ls("roca_gato_cor", c0 || "preto");
    g.restore();
  }
}
function menuInicial() {
  netFechar(); if (!R || !R.menu) { novoJogo(); R.menu = true; R.t = DIA - 20; } hud();
  fecharPainel(); mostrarTitulo(true); telaTituloMenu();
}
function opcoes() { // só na versão separada da Roça (no jogo antigo isso fica no menu principal)
  const lig = v => v ? "ligada" : "desligada", fps = window.fpsAlvo ? fpsAlvo() : 30;
  painelAberto = true; el.rcPainel.hidden = false;
  el.rcPainel.innerHTML = `<div class="rc-caixa"><h2>Opções</h2><div class="rc-grade">
    <button type="button" class="rc-op" id="opSom">Som: ${typeof mudo !== "undefined" && mudo ? "desligado" : "ligado"}</button>
    <button type="button" class="rc-op" id="opVoz">Narração da história: ${lig(window.vozLigada !== false)}</button>
    <button type="button" class="rc-op" id="opFps">Gráfico: ${fps === 60 ? "suave (60 quadros, gasta mais bateria)" : "economia (30 quadros)"}</button>
    ${window.PC ? `<button type="button" class="rc-op" id="opTela">Tela cheia (F11)</button>` : ""}
    <button type="button" class="rc-op" id="opHist">Apagar a história já vista<small>A abertura aparece de novo</small></button></div>
    <p style="font-size:12px;color:#b8b2a4">Roça Assombrada · versão ${window.ROCA_VERSAO || "1"}</p>
    <div class="rc-linha"><button type="button" class="rc-op dest" id="rcFechar">Voltar</button></div></div>`;
  const re = () => opcoes();
  document.getElementById("opSom").addEventListener("click", () => { if (window.alternarSom) alternarSom(); re(); });
  document.getElementById("opVoz").addEventListener("click", () => { if (window.alternarVozSolo) alternarVozSolo(); re(); });
  document.getElementById("opFps").addEventListener("click", () => { try { localStorage.setItem("pv_fps", fps === 60 ? "30" : "60"); } catch (e) {} medir(); re(); });
  const bt2 = document.getElementById("opTela"); if (bt2) bt2.addEventListener("click", () => PC.telaCheia());
  document.getElementById("opHist").addEventListener("click", () => { ls("roca_hist", ""); try { localStorage.removeItem("roca_hist"); } catch (e) {} efeito("A história vai aparecer de novo", "#e8e2d4"); re(); });
  document.getElementById("rcFechar").addEventListener("click", () => { fecharPainel(); menuInicial(); });
  focarPrimeiro();
}
/* ---------- controle (Xbox, PlayStation, Steam Deck) ---------- */
const CONTROLE = { b: [], dx: 0, dy: 0, eixo: 0, usado: false };
const caixaFoco = () => painelAberto || el.rcTitulo.hidden ? el.rcPainel : el.rcTitMenu;
function focarPrimeiro() { if (!CONTROLE.usado) return; setTimeout(() => { const b = caixaFoco().querySelector("button:not([disabled]), input"); if (b) b.focus(); }, 30); }
function moverFoco(d) { const l = [...caixaFoco().querySelectorAll("button:not([disabled]), input")]; if (!l.length) return; let i = l.indexOf(document.activeElement); i = i < 0 ? 0 : (i + d + l.length) % l.length; l[i].focus(); l[i].scrollIntoView({ block: "nearest" }); }
function lerControle() {
  const gps = navigator.getGamepads ? navigator.getGamepads() : []; let g = null; for (const x of gps) if (x && x.connected) { g = x; break; }
  CONTROLE.dx = CONTROLE.dy = 0; if (!g) return;
  const b = i => !!(g.buttons[i] && g.buttons[i].pressed), antes = CONTROLE.b, novo = i => b(i) && !antes[i];
  const ax = g.axes[0] || 0, ay = g.axes[1] || 0; CONTROLE.b = g.buttons.map(x => x.pressed);
  if (CONTROLE.b.some(Boolean) || Math.abs(ax) > .3 || Math.abs(ay) > .3) { if (!CONTROLE.usado) { CONTROLE.usado = true; document.getElementById("roca").classList.add("rc-controle"); } }
  const eixoV = Math.abs(ay) > .6 ? Math.sign(ay) : Math.abs(ax) > .6 ? Math.sign(ax) : 0, eixoNovo = eixoV && eixoV !== CONTROLE.eixo; CONTROLE.eixo = eixoV;
  if (document.querySelector(".rc-hist")) { if (novo(0) && window.rocaHistAvancar) rocaHistAvancar(); if (novo(1) || novo(9)) { const p = document.querySelector(".rc-pular"); if (p) p.click(); } return; }
  if (R && R.msg) { if (novo(0) || novo(1)) proximaFala(); return; }
  if (!el.rcChatBar.hidden) { if (novo(1)) abrirChat(false); return; }
  if (painelAberto) {
    if (novo(12) || novo(14) || (eixoNovo && eixoV < 0)) moverFoco(-1); if (novo(13) || novo(15) || (eixoNovo && eixoV > 0)) moverFoco(1);
    if (novo(0)) { const a = document.activeElement; if (a && el.rcPainel.contains(a) && a.tagName === "BUTTON") a.click(); else moverFoco(0); }
    if (novo(1) || novo(9)) { if (window.rocaVoltar) rocaVoltar(); } return;
  }
  if (!el.rcTitulo.hidden) { if (novo(12) || novo(14) || (eixoNovo && eixoV < 0)) moverFoco(-1); if (novo(13) || novo(15) || (eixoNovo && eixoV > 0)) moverFoco(1); if (novo(0)) { const a = document.activeElement; if (a && el.rcTitMenu.contains(a)) a.click(); else moverFoco(0); } if (novo(1)) { const v = document.getElementById("rcTVolta"); if (v) v.click(); } return; }
  if (!R || R.menu) return;
  let dx = Math.abs(ax) > .22 ? ax : 0, dy = Math.abs(ay) > .22 ? ay : 0; if (b(14)) dx = -1; if (b(15)) dx = 1; if (b(12)) dy = -1; if (b(13)) dy = 1; CONTROLE.dx = dx; CONTROLE.dy = dy;
  if (novo(0)) acao(); if (novo(1)) alternarLanterna(); if (novo(2) || novo(10)) correr(); if (novo(3)) el.rcSem.dispatchEvent(new Event("pointerdown")); if (novo(9)) pausar(); if (novo(8)) abrirMochila(); if (novo(5) && R.online && R.outro) abrirChat(true);
  if (CONTROLE.usado && g.vibrationActuator && R.tremor > .5 && !CONTROLE.vib) { CONTROLE.vib = true; try { g.vibrationActuator.playEffect("dual-rumble", { duration: 300, strongMagnitude: .8, weakMagnitude: .5 }); } catch (e) {} setTimeout(() => CONTROLE.vib = false, 600); }
}
function telaSala(html) { painelAberto = true; el.rcPainel.hidden = false; el.rcPainel.innerHTML = `<div class="rc-caixa">${html}<div class="rc-linha"><button type="button" class="rc-op" id="rcCancelar">Cancelar</button></div></div>`; document.getElementById("rcCancelar").addEventListener("click", () => { netFechar(); menuInicial(); }); }
function criarSala() {
  telaSala(`<h2>Criando sala...</h2><p id="rcSt">Conectando ao servidor do online.</p>`);
  const st = t => { const e = document.getElementById("rcSt"); if (e) e.textContent = t; };
  netCriar(cod => telaSala(`<h2>Sala criada</h2><p>Mande este código para o seu amigo. Ele abre a Roça Assombrada, toca em <b>Entrar numa sala</b> e digita:</p>
      <div class="rc-codigo" id="rcCodigo">${cod}</div><p id="rcSt" style="font-size:13px">Esperando o amigo entrar... (os dois precisam de internet)</p>
      <div class="rc-linha"><button type="button" class="rc-op dest" id="rcComecar">Começar a jogar agora</button></div>
      <p style="font-size:12px;opacity:.8">Pode começar sozinha: o amigo entra depois, no meio do jogo. O código fica no canto da tela.</p>`) || ligarComecar(),
    amigoEntrou, err => st(err));
}
function ligarComecar() { const b = document.getElementById("rcComecar"); if (b) b.addEventListener("click", () => iniciarJogo("host")); }
function amigoEntrou() {
  if (R && window.rocaAtiva && R.online === "host" && el.rcTitulo.hidden) {
    R.outro = novoOutro(); enviar({ t: "inicio", volta: false }); hud();
    S.colher && S.colher(); efeito("Seu amigo entrou na sala!", "#9bd86b"); return;
  }
  iniciarJogo("host");
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
function iniciarJogo(modo, semTutorial) {
  fecharPainel(); mostrarTitulo(false); novoJogo(); R.online = modo === "solo" ? null : modo; R.cor = modo === "guest" ? 1 : 0;
  if (modo === "guest") { R.eu.x = 14.2; R.eu.y = 12.9; }
  if (modo === "host") { R.outro = Net.ligado ? novoOutro() : null; if (R.outro) enviar({ t: "inicio", volta: !!semTutorial }); }
  hud();
  const comeca = () => { if (!R) return; R.menu = false; if (semTutorial) R.tutorial = 1; else tutorial(); };
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
window.rocaMedir = () => medir(); window.rocaEstado = () => R; window.rocaTeste = { zoom: k => { TS = Math.round(TS * k); }, irEsgoto: () => irEsgoto(), folhaMonstros: (g, Wd, Hd, tm = 1.3) => { const cS = c, WS = W, HS = H, TSs = TS, cx = cam.x, cy = cam.y; c = g; W = Wd; H = Hd; TS = 64; cam.x = 0; cam.y = 0; const P = (i, j) => ({ x: (i - 3.5) * 3.2, y: (j - .5) * 4.2 + 1.2 });
    try { g.fillStyle = "#3a4a2a"; g.fillRect(0, 0, Wd, Hd); const L = [[0, 0, () => desenharSeco({ fase: "caca", ...P(0, 0), dir: 1, fase2: 1 }, tm)], [1, 0, () => desenharCachorro({ fase: "anda", anda: 1, ...P(1, 0), dir: 1 }, tm)], [2, 0, () => desenharCachorro({ fase: "lobo", anda: 1, ...P(2, 0), dir: 1 }, tm)], [3, 0, () => desenharEspantalho({ fase: "vivo", ...P(3, 0) }, tm)], [4, 0, () => desenharVulto({ t: 3, ...P(4, 0) }, tm)], [5, 0, () => desenharSaci({ fase: "perto", giro: 2, ...P(5, 0) }, tm)], [6, 0, () => desenharCurupira({ fase: "vem", dir: 1, fase2: 1, ...P(6, 0) }, tm)], [0, 1, () => desenharTinhoso({ fase: "caca", dir: 1, fase2: 1, ...P(0, 1) }, tm)], [2, 1, () => desenharMula({ fase: "corre", ...P(2, 1), dir: 1, t: 1 }, tm)], [4, 1, () => desenharAranha({ fase: "anda", ...P(4, 1), dir: 1, passo: 1 }, tm)], [1, 1, () => desenharCuca({ fase: "ataca", ...P(1, 1), dir: 1, passo: 1 }, tm)], [3, 1, () => desenharEspantalho({ fase: "poste", ...P(3, 1) }, tm)], [6, 1, () => desenharPisadeira({ t: 3, x: 0, y: 0, dir: 1 }, x => PX(P(6, 1).x) + x * 0, y => PY(P(6, 1).y) + y * 0, 64 * 2, tm)]];
      L.forEach(([i, j, f]) => { try { f(); } catch (e) { console.log("erro", i, j, e.message); } }); } finally { c = cS; W = WS; H = HS; TS = TSs; cam.x = cx; cam.y = cy; } }, icone: (g, S, modo) => desenharIcone(g, S, modo), esg: () => ESG, bench: (qual) => { const ch = qual === "vila" ? (montarVila(), CHAO_VILA) : qual === "mata" ? (montarMata(), CHAO_MATA) : CHAO_SITIO, P = 72, out = {}; let t = performance.now(); const pc = document.createElement("canvas"); pc.width = pc.height = CHUNK * P; const g = pc.getContext("2d"); g.scale(P / 32, P / 32); g.translate(-2 * CHUNK * 32, -1 * CHUNK * 32); g.beginPath(); g.rect(2 * CHUNK * 32, 1 * CHUNK * 32, CHUNK * 32, CHUNK * 32); g.clip(); CLIPV = [2 * CHUNK * 32, 1 * CHUNK * 32, 3 * CHUNK * 32, 2 * CHUNK * 32]; ch.pintar(g); CLIPV = null; out.pintar = performance.now() - t; t = performance.now(); pc.ch = ch; detalheChao(g, pc, 2, 1, P); out.det = performance.now() - t; t = performance.now(); ch.base = null; baseChao(ch); out.base = performance.now() - t; return out; }, npcs: () => NPCS, npcEm: (g, n, x, y, s) => comCtx(g, () => desenharNpc(n, x, y, s, 1, { wx: -1e9 })), chao: g => CHAO_SITIO.pintar(g), vila: () => { montarVila(); return VILA; }, chaoVila: g => CHAO_VILA.pintar(g), bancada: () => abrirBancada(), loja: n => abrirLoja(NPCS.find(x => x.id === n)) }; // usado nos testes
window.morrerTeste = () => morrer("seco", "teste", "teste");
window.telaFimTeste = () => telaFim("morreu");
})();

