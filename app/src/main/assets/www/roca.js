/* ============================================================
   ROÇA ASSOMBRADA
   Um sítio aconchegante para plantar, regar, pescar e vender...
   até a mata começar a estalar. Mecânicas de sobrevivência com
   regras: cada assombração tem um som e um jeito de escapar.
   Objetivo: consertar a caminhonete e ir embora.
   ============================================================ */
(() => {
const MW = 36, MH = 26;                       // mapa em "quadradinhos"
const CERCA = { x0: 6, y0: 5, x1: 30, y1: 21 };
const CASA = { x: 9, y: 6, w: 5, h: 4, porta: { x: 11.5, y: 10.2 } };
const POCO = { x: 16.5, y: 8.4 }, CAIXOTE = { x: 15, y: 10.6 }, CRUZ = { x: 27.5, y: 7.2 }, CAMINHONETE = { x: 18.2, y: 19.6 };
const DOCA = { x: 24.6, y: 17.6 };
const LAGO = { x0: 25, y0: 15, x1: 29.6, y1: 20.4 };
const CANTEIROS = [
  { x: 8, y: 13, w: 4, h: 3, preco: 0 }, { x: 13.5, y: 13, w: 4, h: 3, preco: 30 },
  { x: 19, y: 13, w: 4, h: 3, preco: 80 }, { x: 20, y: 7, w: 4, h: 3, preco: 150 }];
const PLANTAS = {
  milho: { nome: "Milho", tempo: 7, preco: 4, cor: "#e8c84a" },
  mandioca: { nome: "Mandioca", tempo: 10, preco: 8, cor: "#c89a6a" },
  abobora: { nome: "Abóbora", tempo: 14, preco: 17, cor: "#e07a2a", custo: 40 },
  melancia: { nome: "Melancia", tempo: 18, preco: 30, cor: "#4a9a3a", custo: 90 } };
const PEIXES = [["Lambari", 6, .55], ["Tilápia", 12, .33], ["Traíra", 22, .12]];
const DIA = 150, NOITE = 80, CICLO = DIA + NOITE;
const PLACAS = [
  { x: 7.4, y: 11.2, txt: "Quando a mata estalar, entre em casa. Não olhe para trás." },
  { x: 23.2, y: 11.4, txt: "Não chegue perto do cachorro preto." },
  { x: 26.4, y: 7.9, txt: "Toda noite uma alma pede uma vela. Traga a vela até a cruz antes do sol nascer." },
  { x: 12.8, y: 18.6, txt: "Lamparina apagada, não durma. Ela sobe pelo pé da cama." }];
const COSMETICOS = [["palha", "Chapéu de palha", 0, "#d8b860"], ["vermelho", "Chapéu vermelho", 2, "#b8382a"], ["azul", "Chapéu azul", 3, "#3a5a9a"], ["preto", "Chapéu preto", 4, "#1e1e22"], ["branco", "Chapéu branco", 6, "#e8e4d8"]];

let cv, c, W = 0, H = 0, DPRr = 1, TS = 48, luzCv, lc, chaoCv, rodando = false, ultimo = 0, R = null, painelAberto = false;
const ls = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } };
const rnd = (a, b) => a + Math.random() * (b - a), cl = (v, a, b) => Math.max(a, Math.min(b, v)), mix = (a, b, k) => a + (b - a) * k;
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
let semente = 1; const srnd = () => { semente = (semente * 16807) % 2147483647; return (semente - 1) / 2147483646; };

/* ---------- som (WebAudio, com posição no espaço) ---------- */
function somEm(x, y) { if (!R) return [1, 0]; const p = R.dentro ? { x: 11.5, y: 8 } : R.eu, d = Math.hypot(x - p.x, y - p.y); return [cl(1 - d / 16, 0, 1), cl((x - p.x) / 9, -1, 1)]; }
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
  const bloq = (x0, y0, w, h) => { for (let y = Math.floor(y0); y < y0 + h; y++) for (let x = Math.floor(x0); x < x0 + w; x++) if (solido[y]) solido[y][x] = true; };
  bloq(CASA.x, CASA.y, CASA.w, CASA.h); bloq(16, 8, 1, 1); bloq(25, 15, 5, 6); bloq(17, 19, 3, 2); bloq(27, 7, 1, 1);
  const arvores = [];
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { const fora = solido[y][x] && (x < CERCA.x0 - .5 || x >= CERCA.x1 || y < CERCA.y0 || y >= CERCA.y1); if (fora && !(x >= 16 && x <= 20 && y >= CERCA.y1) && srnd() < .55) arvores.push({ x: x + .5 + (srnd() - .5) * .6, y: y + .5 + (srnd() - .5) * .6, r: .7 + srnd() * .5, c: Math.floor(srnd() * 5) }); }
  [[7.2, 6.4], [28.6, 12.4], [7.4, 19.6], [22.6, 19.8]].forEach(([x, y]) => { arvores.push({ x, y, r: .85, c: 1 }); if (solido[Math.floor(y)]) solido[Math.floor(y)][Math.floor(x)] = true; });
  R = {
    t: 18, dia: 1, eu: { x: 11.5, y: 11.4, dir: 1, anda: 0, fase: 0 }, dentro: false, sala: { x: 3.5, y: 4 },
    solido, arvores, moedas: 0, agua: 5, aguaMax: 5, oleo: 100, lanterna: false, folego: 100, correndo: false, vel: 3.1,
    lanternaBoa: false, sementes: ["milho", "mandioca"], semente: 0, canteiros: CANTEIROS.map((k, i) => ({ ...k, aberto: i === 0, covas: Array.from({ length: k.w * k.h }, () => null) })),
    inv: { graveto: 0, folha: 0 }, colheita: {}, peixes: {}, vara: false, pecas: 0, vela: null, velaCom: false, velaEntregue: false, velaHoje: false,
    gato: { x: 13, y: 11, alvo: null, prox: 25, falando: 0 }, cachorro: null, seco: { prox: 75, fase: "longe", t: 0, x: 0, y: 0 },
    lamparinas: [1, 1, 1], lampT: 0, pisadeira: null, pesca: null, fx: [], msg: null, tutorial: 0, morto: null, venceu: null, tempoTotal: 0, ouro: +(ls("roca_ouro") || 0),
    chapeu: ls("roca_chapeu") || "palha", susto: 0, perto: 0, tremor: 0,
  };
  falar(["Miau. Quer dizer... oi! Eu sou o Fumaça, o gato do sítio.", "Escolha a semente no botão de baixo e plante no canteiro. Depois regue com água do poço.", "Quando crescer, colha e venda no caixote do lado da porta. Com o dinheiro dá para consertar a caminhonete e ir embora.", "Ah... e se ouvir a mata estalar, corre pra dentro de casa. Não pergunta por quê."], () => { R.tutorial = 1; });
  gerarChao();
}
const horaNoite = () => { const k = R.t % CICLO; if (k < DIA - 12) return 0; if (k < DIA) return (k - (DIA - 12)) / 12; if (k > CICLO - 10) return (CICLO - k) / 10; return 1; };
const ehNoite = () => (R.t % CICLO) >= DIA;

/* ---------- chão desenhado uma vez ---------- */
function gerarChao() {
  const P = 32; chaoCv = document.createElement("canvas"); chaoCv.width = MW * P; chaoCv.height = MH * P; const g = chaoCv.getContext("2d");
  g.fillStyle = "#2e3a1e"; g.fillRect(0, 0, MW * P, MH * P);
  g.fillStyle = "#6a7a36"; g.fillRect(CERCA.x0 * P, CERCA.y0 * P, (CERCA.x1 - CERCA.x0) * P, (CERCA.y1 - CERCA.y0) * P);
  semente = 99;
  for (let i = 0; i < 900; i++) { const x = srnd() * MW * P, y = srnd() * MH * P, dentro = x > CERCA.x0 * P && x < CERCA.x1 * P && y > CERCA.y0 * P && y < CERCA.y1 * P; g.fillStyle = dentro ? (srnd() < .5 ? "rgba(140,150,70,.35)" : "rgba(60,80,30,.3)") : "rgba(20,30,12,.4)"; g.beginPath(); g.ellipse(x, y, 6 + srnd() * 22, 4 + srnd() * 12, srnd() * 3, 0, 7); g.fill(); }
  for (let i = 0; i < 1600; i++) { const x = srnd() * MW * P, y = srnd() * MH * P; g.strokeStyle = srnd() < .5 ? "rgba(150,160,80,.5)" : "rgba(50,70,30,.5)"; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (srnd() - .5) * 3, y - 3 - srnd() * 3); g.stroke(); }
  for (let i = 0; i < 380; i++) { const x = srnd() * MW * P, y = srnd() * MH * P; g.fillStyle = ["#c8662a", "#d89a2a", "#a8401e", "#e0b040"][Math.floor(srnd() * 4)]; g.beginPath(); g.ellipse(x, y, 2.2, 1.4, srnd() * 3, 0, 7); g.fill(); } // folhas secas
  // caminhos de terra
  const trilha = (pts, w) => { g.strokeStyle = "#8a6a44"; g.lineWidth = w * P; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x * P, y * P) : g.moveTo(x * P, y * P)); g.stroke(); g.strokeStyle = "rgba(160,130,90,.4)"; g.lineWidth = w * P * .5; g.stroke(); };
  trilha([[11.5, 10.4], [11.5, 12], [18.2, 12], [18.2, 18.6]], 1.1); trilha([[11.5, 12], [15.6, 11], [16.5, 9.4]], .8); trilha([[18.2, 12], [24.5, 12], [26.6, 8.4]], .7); trilha([[18.2, 16.8], [24, 17.6]], .7);
  trilha([[18.2, 21], [18.2, 26]], 1.3); // estrada que sai pelo portão
  // lago
  g.fillStyle = "#4a5a2a"; g.beginPath(); g.ellipse((LAGO.x0 + LAGO.x1) / 2 * P, (LAGO.y0 + LAGO.y1) / 2 * P, (LAGO.x1 - LAGO.x0) / 2 * P + 8, (LAGO.y1 - LAGO.y0) / 2 * P + 8, 0, 0, 7); g.fill();
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
    if (s.y > 5.3 && Math.abs(s.x - 3.5) < 1) return { t: "Sair", fn: sair };
    if (s.x > 5 && s.y < 2.4) return { t: "Bancada", fn: abrirBancada };
    if (Math.hypot(s.x - 3.5, s.y - 3) < 1 && !R.lamparinas.every(v => v)) return { t: "Acender", fn: () => { if (R.oleo >= 10 && !R.lamparinas.every(v => v)) { R.oleo -= 10; R.lamparinas = R.lamparinas.map(() => 1); R.lampT = 0; S.colher(); efeito("Lamparinas acesas", "#f2c94a"); } else efeito(R.lamparinas.every(v => v) ? "Ainda não dá sono..." : "Sem óleo para acender", "#e8e2d4"); } };
    return null;
  }
  const p = R.eu;
  if (dist(p, CASA.porta) < 1.1) return { t: "Entrar", fn: entrar };
  if (R.venceu) return null;
  if (dist(p, CAIXOTE) < 1.2) { const v = valorVenda(); return { t: v ? `Vender ${v}` : "Caixote", fn: vender }; }
  if (dist(p, POCO) < 1.4) return { t: "Tirar água", fn: tirarAgua };
  if (R.vela && !R.velaCom && dist(p, R.vela) < 1.1) return { t: "Pegar vela", fn: pegarVela };
  if (dist(p, CRUZ) < 1.4 && R.velaCom) return { t: "Deixar vela", fn: entregarVela };
  if (dist(p, CAMINHONETE) < 2) return { t: R.pecas >= 3 ? "Ir embora!" : "Caminhonete", fn: () => R.pecas >= 3 ? irEmbora() : efeito(`Faltam ${3 - R.pecas} peças (na bancada)`, "#e8e2d4") };
  if (dist(p, DOCA) < 1.3) return { t: R.vara ? "Pescar" : "Sem vara", fn: () => R.vara ? pescar() : efeito("Faça uma vara na bancada: 3 gravetos e 2 folhas", "#e8e2d4") };
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
function valorVenda() { let v = 0; for (const [k, n] of Object.entries(R.colheita)) v += PLANTAS[k].preco * n; for (const [k, n] of Object.entries(R.peixes)) v += PEIXES.find(p => p[0] === k)[1] * n; if (R.vara) v += R.inv.graveto + R.inv.folha; return v; } // gravetos e folhas só são vendidos depois de fazer a vara
function vender() { const v = valorVenda(); if (!v) return efeito("Nada para vender", "#e8e2d4"); R.moedas += v; R.colheita = {}; R.peixes = {}; if (R.vara) { R.inv.graveto = 0; R.inv.folha = 0; } S.moedas(); efeito(`+${v} moedas`, "#f2c94a"); hud(); }
function abrirCanteiro(k) { if (R.moedas < k.preco) return efeito(`Precisa de ${k.preco} moedas`, "#e8e2d4"); R.moedas -= k.preco; k.aberto = true; S.moedas(); efeito("Canteiro novo!"); hud(); }
function entrar() { R.dentro = true; R.sala = { x: 3.5, y: 5 }; S.porta(); hud(); }
function sair() { R.dentro = false; R.eu.x = CASA.porta.x; R.eu.y = CASA.porta.y + .55; S.porta(); if (R.pisadeira) R.pisadeira = null; hud(); }
function alternarLanterna() { if (!R || R.morto) return; if (!R.lanterna && R.oleo <= 0) return efeito("Sem óleo na lanterna", "#f2a33a"); R.lanterna = !R.lanterna; tocarTom(R.lanterna ? 900 : 500, .05, { vol: .05 }); hud(); }
function correr() { if (!R || R.correndo || R.folego < 25) return; R.correndo = true; hud(); }
function pescar() { R.pesca = { t: 0, morde: rnd(2.2, 5.5), fisgou: false }; tocarRuido(.3, { filtro: "highpass", f: 1800, vol: .05 }); }
function puxarPeixe() { const r = Math.random(); let acc = 0, pe = PEIXES[0]; for (const p of PEIXES) { acc += p[2]; if (r < acc) { pe = p; break; } } R.peixes[pe[0]] = (R.peixes[pe[0]] || 0) + 1; R.pesca = null; S.peixe(); efeito(`Pegou um ${pe[0].toLowerCase()}!`, "#5ab0e0"); hud(); }
function pegarVela() { R.velaCom = true; S.colher(); efeito("Leve a vela até a cruz", "#f2c94a"); hud(); }
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
    if (sala) return x > .6 && x < 6.4 && y > 1.2 && y < 5.6 && !(x < 2.6 && y < 2.7 && x > .6) && !(x > 5 && y < 2) ;
    for (const [ox, oy] of [[-rr, 0], [rr, 0], [0, -rr * .6], [0, rr * .4]]) { const tx = Math.floor(x + ox), ty = Math.floor(y + oy); if (ty < 0 || ty >= MH || tx < 0 || tx >= MW || R.solido[ty][tx]) return false; } return true; };
  const nx = p.x + dx * vel * dt, ny = p.y + dy * vel * dt;
  if (livre(nx, p.y)) p.x = nx; if (livre(p.x, ny)) p.y = ny;
}
function atualizar(dt) {
  if (painelAberto) return;
  R.fx.forEach(f => f.t += dt); R.fx = R.fx.filter(f => f.t < 1.8);
  if (R.susto > 0) R.susto -= dt;
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
  if (R.correndo) { R.folego -= 34 * dt; if (R.folego <= 0) { R.folego = 0; R.correndo = false; } } else R.folego = Math.min(100, R.folego + 14 * dt);
  const vel = R.vel * (R.correndo ? 1.75 : 1) * (R.dentro ? .8 : 1);
  if (R.dentro) anda(R.sala, dx, dy, vel, dt, true); else anda(R.eu, dx, dy, vel, dt, false);
  const pp = R.dentro ? R.sala : R.eu;
  if (m > .1) { pp.dir = dx < -.1 ? -1 : dx > .1 ? 1 : (pp.dir || 1); R.eu.fase += dt * vel * 3.2; R.eu.anda = Math.min(1, m); if ((R.eu.fase % PI) < dt * vel * 3.2) S.passo(); } else R.eu.anda = 0;
  if (R.regando > 0) R.regando -= dt;
  // lanterna
  if (R.lanterna) { R.oleo -= (R.lanternaBoa ? .55 : .95) * dt; if (R.oleo <= 0) { R.oleo = 0; R.lanterna = false; efeito("A lanterna apagou", "#f2a33a"); } }
  // plantas
  for (const k of R.canteiros) k.covas.forEach((cv2, i) => { if (!cv2 || cv2.seca || cv2.est >= 3) return; cv2.t += dt; if (cv2.t >= PLANTAS[cv2.tipo].tempo) { cv2.est++; cv2.t = 0; if (cv2.est < 3) cv2.seca = true; else S.pronto(k.x + i % k.w, k.y + Math.floor(i / k.w)); } });
  // pesca
  if (R.pesca) { R.pesca.t += dt; if (!R.pesca.fisgou && R.pesca.t > R.pesca.morde) { R.pesca.fisgou = true; R.pesca.ft = 0; S.fisga(); } if (R.pesca.fisgou) { R.pesca.ft += dt; if (R.pesca.ft > .9) { R.pesca = null; efeito("O peixe escapou", "#e8e2d4"); } } }
  atualizarGato(dt); atualizarSeco(dt); atualizarCachorro(dt); atualizarAlma(dt); atualizarCasa(dt);
  // quanto perigo por perto (muda a cara do personagem)
  let perto = 0; if (R.seco.fase === "anda") perto = Math.max(perto, 1 - dist(R.eu, R.seco) / 8); if (R.cachorro && R.cachorro.fase === "lobo") perto = 1; if (R.pisadeira) perto = 1; R.perto = R.dentro && !R.pisadeira ? 0 : cl(perto, 0, 1);
  musicaPasso(dt);
  if (Math.floor(R.t * 2) !== Math.floor((R.t - dt) * 2)) hud();
  const o = oQueFazer(); el.rcAcao.textContent = o ? o.t : "Ação"; el.rcAcao.style.opacity = o ? 1 : .5;
}
function comecaNoite() { R.velaHoje = true; R.velaEntregue = false; R.velaT = rnd(8, 18); efeito("Anoiteceu", "#9aa8c8"); tocarTom(220, 2, { vol: .04, ate: 165, wet: .8 }); }
function amanhece() {
  if (R.velaHoje && !R.velaEntregue && R.dia >= 1) { R.alma = { t: 0 }; return; } // a alma vem cobrar
  R.dia++; R.velaHoje = false; R.vela = null; R.velaCom = false; efeito(`Dia ${R.dia}`, "#f2c94a"); tocarTom(523, 1.5, { tipo: "triangle", vol: .04, wet: .6 }); tocarTom(659, 1.5, { tipo: "triangle", vol: .035, quando: .2, wet: .6 });
  if (R.dia === 2 && !R.cachorro) { R.cachorro = { x: 24, y: 11, fase: "calmo", t: 0 }; setTimeout(() => R && S.uivo(R.cachorro.x, R.cachorro.y), 1200); }
}
function atualizarGato(dt) {
  const g = R.gato; if (R.tutorial === 0) return;
  g.prox -= dt;
  if (!g.alvo && g.prox <= 0 && !R.dentro) { g.alvo = { x: cl(R.eu.x + rnd(-2, 2), CERCA.x0 + 1, CERCA.x1 - 1), y: cl(R.eu.y + rnd(-1.5, 1.5), CERCA.y0 + 1, CERCA.y1 - 1) }; }
  if (g.alvo) { const d = dist(g, g.alvo); if (d > .2) { g.x += (g.alvo.x - g.x) / d * 2.6 * dt; g.y += (g.alvo.y - g.y) / d * 2.6 * dt; g.dir = g.alvo.x > g.x ? 1 : -1; g.anda = 1; }
    else { const r = Math.random(); let q; if (r < .05) { q = "dourada"; R.ouro++; ls("roca_ouro", R.ouro); } else if (r < .2) { q = "moedas"; R.moedas += 3; } else if (r < .58) { q = "graveto"; R.inv.graveto++; } else { q = "folha"; R.inv.folha++; }
      R.fx.push({ txt: q === "dourada" ? "Moeda dourada!" : q === "moedas" ? "+3 moedas" : `+1 ${q}`, cor: q === "dourada" ? "#ffe680" : "#e8e2d4", t: 0, x: g.x, y: g.y }); S.miau(g.x, g.y); S.queda(); g.alvo = null; g.prox = rnd(20, 30); g.anda = 0; hud(); } }
}
function atualizarSeco(dt) {
  const s = R.seco; if (R.tutorial === 0) return;
  if (s.fase === "longe") { s.prox -= dt; if (s.prox <= 0) { s.fase = "aviso"; s.t = 0; const lado = Math.random() < .5; s.x = lado ? CERCA.x0 - 1.5 : CERCA.x1 + 1.5; s.y = rnd(CERCA.y0 + 3, CERCA.y1 - 3); S.estalos(s.x, s.y); efeito("A mata estalou...", "#e2483d"); } return; }
  s.t += dt;
  if (s.fase === "aviso") { if (s.t > 1 && s.t % 2.4 < dt) S.estalos(s.x, s.y); if (s.t > 7) { s.fase = "anda"; s.t = 0; } return; }
  if (s.fase === "anda") {
    const alvo = R.dentro ? CASA.porta : R.eu, d = dist(s, alvo), v = 2.35;
    if (d > .05) { s.x += (alvo.x - s.x) / d * v * dt; s.y += (alvo.y - s.y) / d * v * dt; s.dir = alvo.x > s.x ? 1 : -1; }
    if (s.t % 3 < dt) tocarTom(60, 1, { tipo: "sawtooth", vol: .05 * somEm(s.x, s.y)[0], ate: 48, lp: 260, pan: somEm(s.x, s.y)[1] });
    if (!R.dentro && dist(s, R.eu) < .8) morrer("seco", "O Corpo-Seco te pegou no meio da roça.", "Quando a mata estalar, corra para dentro de casa e espere o suspiro.");
    if (s.t > 24) { s.fase = "sai"; s.t = 0; S.suspiro(s.x, s.y); }
    return;
  }
  if (s.fase === "sai") { const dd = s.x < 18 ? -1 : 1; s.x += dd * 2.6 * dt; if (s.t > 5) { s.fase = "longe"; s.prox = rnd(150, 210) - Math.min(60, R.dia * 8); efeito("Ouviu o suspiro. Já pode sair.", "#9aa8c8"); } }
}
function atualizarCachorro(dt) {
  const k = R.cachorro; if (!k) return; k.t += dt;
  const alvo = R.eu, d = dist(k, alvo);
  if (k.fase === "calmo") {
    const quer = 6.5; if (!R.dentro && d > quer + .5) { k.x += (alvo.x - k.x) / d * 1.4 * dt; k.y += (alvo.y - k.y) / d * 1.4 * dt; k.dir = alvo.x > k.x ? 1 : -1; k.anda = 1; } else k.anda = 0;
    k.x = cl(k.x, CERCA.x0 + .6, CERCA.x1 - .6); k.y = cl(k.y, CERCA.y0 + .6, CERCA.y1 - .6);
    if (!R.dentro && d < 2.8) { k.fase = "vira"; k.t = 0; S.rosnado(k.x, k.y); }
  } else if (k.fase === "vira") { if (k.t > 1.2) { k.fase = "lobo"; k.t = 0; S.uivo(k.x, k.y); } }
  else if (k.fase === "lobo") {
    const alvo2 = R.dentro ? { x: CASA.porta.x, y: CASA.porta.y + 1 } : alvo, d2 = dist(k, alvo2);
    if (d2 > .1) { k.x += (alvo2.x - k.x) / d2 * 5.9 * dt; k.y += (alvo2.y - k.y) / d2 * 5.9 * dt; k.dir = alvo2.x > k.x ? 1 : -1; k.anda = 1; }
    if (k.t % 1.3 < dt) S.rosnado(k.x, k.y);
    if (!R.dentro && d < .75) morrer("lobo", "O cachorro preto virou lobisomem.", "Fique longe do cachorro. Se ele virar, corra para casa: em 8 segundos ele volta ao normal.");
    if (k.t > 8) { k.fase = "calmo"; k.t = 0; }
  }
}
function atualizarAlma(dt) {
  if (R.alma) { R.alma.t += dt; if (R.alma.t > 1.4) morrer("alma", "Ninguém levou a vela até a cruz. A alma veio buscar.", "Toda noite, siga o som do sino, pegue a vela e deixe na cruz antes de amanhecer."); return; }
  if (!ehNoite() || !R.velaHoje || R.velaEntregue) return;
  if (!R.vela && !R.velaCom) { R.velaT -= dt; if (R.velaT <= 0) { let x, y; do { x = rnd(CERCA.x0 + 1, CERCA.x1 - 1); y = rnd(CERCA.y0 + 1, CERCA.y1 - 1); } while (R.solido[Math.floor(y)][Math.floor(x)] || dist({ x, y }, R.eu) < 6); R.vela = { x, y, som: 0 }; efeito("Um sino tocou em algum lugar...", "#e8e2d4"); } }
  if (R.vela && !R.velaCom) { R.vela.som -= dt; if (R.vela.som <= 0) { S.sino(R.vela.x, R.vela.y); R.vela.som = 3.2; } }
}
function atualizarCasa(dt) {
  if (R.dentro) {
    if (!R.pisadeira) { R.lampT += dt; if (R.lampT > 20) { R.lampT = 0; const i = R.lamparinas.lastIndexOf(1); if (i >= 0) { R.lamparinas[i] = 0; S.apaga(); if (i === 0) { R.pisadeira = { t: 0, x: 1.4, y: 1.9 }; S.respira(); efeito("Algo se mexe debaixo da cama", "#e2483d"); } } } }
    else { const p = R.pisadeira; p.t += dt; if (p.t > 1.6) { const d = dist(p, R.sala); if (d > .05) { p.x += (R.sala.x - p.x) / d * 2.1 * dt; p.y += (R.sala.y - p.y) / d * 2.1 * dt; } if (p.t % 2.2 < dt) S.respira(); if (d < .55) morrer("pisadeira", "A Pisadeira saiu de baixo da cama.", "Não fique muito tempo dentro de casa: quando as lamparinas apagam, saia. Elas acendem de novo com o tempo."); } if (p.t > 30) R.pisadeira = null; }
  } else { R.lampT += dt; if (R.lampT > 12) { R.lampT = 0; const i = R.lamparinas.indexOf(0); if (i >= 0) R.lamparinas[i] = 1; } }
}

/* ---------- desenho ---------- */
const PX = x => (x - cam.x) * TS + W / 2, PY = y => (y - cam.y) * TS + H / 2;
let cam = { x: 11, y: 11 };
function sombra(x, y, rx, ry, a = .32) { c.fillStyle = `rgba(0,0,0,${a})`; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, 7); c.fill(); }
function desenharArvore(a, tm) {
  const x = PX(a.x), y = PY(a.y), r = a.r * TS; if (x < -r * 2 || x > W + r * 2 || y < -r * 3 || y > H + r * 2) return;
  sombra(x + r * .2, y + r * .05, r * .9, r * .35, .35);
  c.fillStyle = "#3a2a1a"; c.fillRect(x - r * .12, y - r * 1.1, r * .24, r * 1.1);
  const cores = [["#a8401e", "#c8662a", "#e09a3a"], ["#5a6a2a", "#6a7a36", "#8a9a46"], ["#b8862a", "#d8a83a", "#e8c85a"], ["#7a2a1e", "#9a3a24", "#b85a2a"], ["#3a4a24", "#4a5a2a", "#5a6a32"]][a.c];
  const bal = Math.sin(tm * 1.1 + a.x) * r * .04;
  [[0, -1.5, 1], [-.45, -1.25, .75], [.45, -1.3, .72], [0, -1.95, .7]].forEach(([ox, oy, s], i) => { c.fillStyle = cores[i % 3]; c.beginPath(); c.arc(x + ox * r + bal, y + oy * r, r * .62 * s, 0, 7); c.fill(); });
  c.fillStyle = "rgba(255,240,200,.12)"; c.beginPath(); c.arc(x - r * .2 + bal, y - r * 1.9, r * .28, 0, 7); c.fill();
}
function desenharCasa(tm) {
  const x = PX(CASA.x), y = PY(CASA.y), w = CASA.w * TS, h = CASA.h * TS;
  sombra(x + w / 2, y + h + 4, w * .58, TS * .3, .35);
  c.fillStyle = "#6a4a2a"; c.fillRect(x, y + h * .2, w, h * .8); // parede de madeira
  c.strokeStyle = "rgba(0,0,0,.25)"; c.lineWidth = 1; for (let i = 1; i < 8; i++) { c.beginPath(); c.moveTo(x, y + h * .2 + i * h * .1); c.lineTo(x + w, y + h * .2 + i * h * .1); c.stroke(); }
  c.fillStyle = "#4a2a1a"; c.beginPath(); c.moveTo(x - TS * .3, y + h * .26); c.lineTo(x + w / 2, y - h * .32); c.lineTo(x + w + TS * .3, y + h * .26); c.closePath(); c.fill(); // telhado
  c.fillStyle = "#5a3220"; for (let i = 0; i < 6; i++) { c.fillRect(x - TS * .2 + i * w / 5.4, y + h * .2, 3, -h * (.06 + .4 * (1 - Math.abs(i - 2.6) / 2.6))); }
  c.fillStyle = "#3a3a3a"; c.fillRect(x + w * .72, y - h * .2, TS * .4, h * .3); // chaminé
  for (let i = 0; i < 4; i++) { const k = (tm * .3 + i / 4) % 1; c.fillStyle = `rgba(200,200,200,${.25 * (1 - k)})`; c.beginPath(); c.arc(x + w * .72 + TS * .2 + Math.sin(tm + i) * 6, y - h * .25 - k * TS * 1.6, 6 + k * 14, 0, 7); c.fill(); }
  const lit = R.lamparinas.filter(v => v).length / 3;
  [[.16, .45], [.66, .45]].forEach(([fx, fy]) => { c.fillStyle = `rgba(255,${190 + lit * 30},110,${.25 + lit * .65})`; c.fillRect(x + w * fx, y + h * fy, w * .18, h * .22); c.strokeStyle = "#2a1a0e"; c.lineWidth = 3; c.strokeRect(x + w * fx, y + h * fy, w * .18, h * .22); c.beginPath(); c.moveTo(x + w * (fx + .09), y + h * fy); c.lineTo(x + w * (fx + .09), y + h * (fy + .22)); c.stroke(); });
  c.fillStyle = "#3a2214"; c.fillRect(x + w * .42, y + h * .52, w * .16, h * .48); c.fillStyle = "#c8a860"; c.beginPath(); c.arc(x + w * .55, y + h * .78, 2.5, 0, 7); c.fill(); // porta
  c.fillStyle = "#5a3a22"; c.fillRect(x + w * .36, y + h, w * .28, TS * .12); // degrau
}
function desenharCerca() {
  const post = (tx, ty) => { const x = PX(tx), y = PY(ty); if (x < -20 || x > W + 20 || y < -40 || y > H + 20) return; c.fillStyle = "#6a4a2a"; c.fillRect(x - 3, y - TS * .55, 6, TS * .55); c.fillStyle = "#4a3018"; c.fillRect(x - 3, y - TS * .58, 6, 4); };
  const trilho = (x0, y0, x1, y1) => { c.strokeStyle = "#7a5a32"; c.lineWidth = 3; c.beginPath(); c.moveTo(PX(x0), PY(y0) - TS * .42); c.lineTo(PX(x1), PY(y1) - TS * .42); c.moveTo(PX(x0), PY(y0) - TS * .22); c.lineTo(PX(x1), PY(y1) - TS * .22); c.stroke(); };
  return { post, trilho };
}
function desenharPlanta(cv2, x, y, tm) {
  const p = PLANTAS[cv2.tipo], s = TS, e = cv2.est;
  if (cv2.seca && e < 3) { c.fillStyle = "rgba(200,170,120,.35)"; c.beginPath(); c.arc(x, y, s * .22, 0, 7); c.fill(); }
  else { c.fillStyle = "rgba(40,24,14,.5)"; c.beginPath(); c.arc(x, y, s * .22, 0, 7); c.fill(); }
  const bal = Math.sin(tm * 2 + x * .05) * 1.5;
  if (e === 0) { c.fillStyle = "#7a9a3a"; c.fillRect(x - 1, y - s * .12, 2, s * .12); c.beginPath(); c.ellipse(x + 3, y - s * .12, 3, 1.6, -.4, 0, 7); c.fill(); return; }
  if (cv2.tipo === "milho") { const hh = s * (.25 + e * .2); c.strokeStyle = "#6a8a2a"; c.lineWidth = 3; c.beginPath(); c.moveTo(x, y); c.lineTo(x + bal, y - hh); c.stroke(); c.lineWidth = 2; c.beginPath(); c.moveTo(x, y - hh * .5); c.quadraticCurveTo(x - s * .2, y - hh * .6, x - s * .26 + bal, y - hh * .4); c.moveTo(x, y - hh * .7); c.quadraticCurveTo(x + s * .2, y - hh * .8, x + s * .24 + bal, y - hh * .62); c.stroke(); if (e >= 3) { c.fillStyle = p.cor; c.beginPath(); c.ellipse(x + 4, y - hh * .62, 3, 6, .3, 0, 7); c.fill(); } }
  else if (cv2.tipo === "mandioca") { c.fillStyle = "#4a7a2a"; for (let i = 0; i < 3 + e; i++) { const a = i / (3 + e) * PI * 2; c.beginPath(); c.ellipse(x + Math.cos(a) * s * .1 * e + bal * .5, y - s * .1 * e - 2 + Math.sin(a) * s * .05, s * .07, s * .03, a, 0, 7); c.fill(); } c.strokeStyle = "#8a3a2a"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - s * .1 * e); c.stroke(); if (e >= 3) { c.fillStyle = p.cor; c.beginPath(); c.ellipse(x - 4, y + 1, 5, 2.4, .2, 0, 7); c.fill(); } }
  else { const r = s * (.05 + e * .06); c.strokeStyle = "#5a8a2a"; c.lineWidth = 2; c.beginPath(); c.moveTo(x - s * .25, y - 2); c.quadraticCurveTo(x, y - s * .12, x + s * .25, y - 1); c.stroke(); c.fillStyle = "#4a7a2a"; c.beginPath(); c.ellipse(x - s * .16, y - 4, s * .07, s * .04, 0, 0, 7); c.ellipse(x + s * .16, y - 4, s * .07, s * .04, 0, 0, 7); c.fill();
    if (e >= 2) { c.fillStyle = e >= 3 ? p.cor : "#8aa84a"; c.beginPath(); c.ellipse(x, y - r * .8, r * (cv2.tipo === "melancia" ? 1.25 : 1.05), r * .85, 0, 0, 7); c.fill(); c.strokeStyle = cv2.tipo === "melancia" ? "rgba(20,60,20,.6)" : "rgba(120,50,10,.5)"; c.lineWidth = 1.2; for (let i = -1; i <= 1; i++) { c.beginPath(); c.ellipse(x + i * r * .4, y - r * .8, r * .2, r * .8, 0, 0, 7); c.stroke(); } c.fillStyle = "#4a6a2a"; c.fillRect(x - 1, y - r * 1.7, 2, r * .3); } }
  if (e >= 3) { c.fillStyle = `rgba(255,240,180,${.35 + .25 * Math.sin(tm * 4 + x)})`; c.beginPath(); c.arc(x, y - s * .5, 2, 0, 7); c.fill(); }
}
function desenharVoce(x, y, tm, o = {}) {
  const s = TS / 48, e = R.eu, dir = o.dir ?? (R.dentro ? R.sala.dir || 1 : e.dir), andaK = o.anda ?? e.anda, f = e.fase, p = R.perto;
  const ch = (COSMETICOS.find(k => k[0] === R.chapeu) || COSMETICOS[0])[3];
  sombra(x, y, 13 * s, 4.5 * s);
  c.save(); c.translate(x, y); c.scale(dir * s, s);
  const sw = Math.sin(f) * 7 * andaK, bob = Math.abs(Math.cos(f)) * 2 * andaK;
  c.fillStyle = "#3a2a1e"; c.fillRect(-6 + sw * .4, -12, 5, 12); c.fillRect(1 - sw * .4, -12, 5, 12); // pernas
  c.fillStyle = "#2a1a12"; c.fillRect(-7 + sw * .4, -3, 7, 3); c.fillRect(0 - sw * .4, -3, 7, 3);
  c.fillStyle = "#3a5a8a"; c.beginPath(); c.roundRect ? c.roundRect(-9, -31 - bob, 18, 21, 5) : c.rect(-9, -31 - bob, 18, 21); c.fill(); // macacão
  c.fillStyle = "#c8a070"; c.fillRect(-9, -31 - bob, 18, 6); c.fillStyle = "#3a5a8a"; c.fillRect(-6, -31 - bob, 3, 6); c.fillRect(3, -31 - bob, 3, 6); // camisa e alças
  c.fillStyle = "#e8c8a0"; const braco = R.regando > 0 ? -1.1 : Math.sin(f + PI) * .5 * andaK; c.save(); c.translate(7, -27 - bob); c.rotate(braco); c.fillRect(-2, 0, 4, 12); c.restore(); c.save(); c.translate(-7, -27 - bob); c.rotate(-Math.sin(f + PI) * .5 * andaK); c.fillRect(-2, 0, 4, 12); c.restore();
  if (R.regando > 0) { c.fillStyle = "#8a9aa8"; c.fillRect(12, -24 - bob, 9, 6); c.fillRect(20, -25 - bob, 6, 2); c.fillStyle = "rgba(120,190,230,.8)"; for (let i = 0; i < 4; i++) c.fillRect(25 + i * 2, -22 - bob + ((tm * 60 + i * 5) % 14), 1.5, 3); }
  else if (R.lanterna && !R.dentro) { c.strokeStyle = "#2a2a2a"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(10, -16 - bob); c.lineTo(10, -12 - bob); c.stroke(); c.fillStyle = "#3a3a3a"; c.fillRect(7, -12 - bob, 7, 8); c.fillStyle = "rgba(255,220,140,.95)"; c.fillRect(8.5, -10.5 - bob, 4, 5); }
  // cabeça e rosto (fica com medo quando tem assombração perto)
  c.fillStyle = "#e8c8a0"; c.beginPath(); c.arc(0, -38 - bob, 8.5, 0, 7); c.fill();
  c.fillStyle = "#1a1210"; const ol = 1.3 + p * 1.2; c.beginPath(); c.arc(3, -39 - bob, ol, 0, 7); c.arc(7, -39 - bob, ol * .9, 0, 7); c.fill();
  if (p > .45) { c.beginPath(); c.ellipse(5, -34 - bob, 1.6, 2.2, 0, 0, 7); c.fill(); c.fillStyle = "rgba(160,200,230,.8)"; c.fillRect(-4, -40 - bob + ((tm * 20) % 6), 1.5, 2.5); }
  else { c.strokeStyle = "#7a3a2a"; c.lineWidth = 1.2; c.beginPath(); c.arc(5, -35 - bob, 2, .2, PI - .2); c.stroke(); }
  c.fillStyle = "rgba(220,120,100,.35)"; c.beginPath(); c.arc(1, -35 - bob, 2, 0, 7); c.fill();
  // chapéu
  c.fillStyle = ch; c.beginPath(); c.ellipse(0, -44 - bob, 15, 4, 0, 0, 7); c.fill(); c.beginPath(); c.ellipse(0, -48 - bob, 8, 6, 0, PI, 0); c.fill(); c.fillRect(-8, -48 - bob, 16, 4);
  c.fillStyle = "rgba(0,0,0,.2)"; c.fillRect(-8, -46 - bob, 16, 2);
  c.restore();
}
function desenharGato(g, tm) {
  const s = TS / 48, x = PX(g.x), y = PY(g.y); sombra(x, y, 9 * s, 3 * s);
  c.save(); c.translate(x, y); c.scale((g.dir || 1) * s, s); const pa = g.anda ? Math.sin(tm * 14) * 2 : 0;
  c.fillStyle = "#2a2a30"; c.fillRect(-7 + pa, -5, 2.5, 5); c.fillRect(4 - pa, -5, 2.5, 5);
  c.beginPath(); c.ellipse(0, -8, 9, 5, 0, 0, 7); c.fill(); c.beginPath(); c.arc(8, -13, 5, 0, 7); c.fill();
  c.beginPath(); c.moveTo(5, -16); c.lineTo(6, -21); c.lineTo(9, -17); c.moveTo(9, -17); c.lineTo(12, -21); c.lineTo(12, -15); c.fill();
  c.strokeStyle = "#2a2a30"; c.lineWidth = 3; c.lineCap = "round"; c.beginPath(); c.moveTo(-8, -9); c.quadraticCurveTo(-15, -14 + Math.sin(tm * 2) * 3, -13, -20); c.stroke();
  c.fillStyle = "#c8e86a"; c.fillRect(9, -14, 1.6, 1.6); c.fillRect(12, -14, 1.6, 1.6);
  c.restore();
}
function desenharSeco(s, tm) {
  const sc = TS / 48, x = PX(s.x), y = PY(s.y); if (s.fase === "longe" || s.fase === "aviso") return;
  sombra(x, y, 12 * sc, 4 * sc, .4); c.save(); c.translate(x, y); c.scale((s.dir || 1) * sc, sc);
  const f = tm * 4, sw = Math.sin(f) * 5;
  c.strokeStyle = "#4a3a26"; c.lineCap = "round"; c.lineWidth = 4;
  c.beginPath(); c.moveTo(0, -34); c.lineTo(-4 + sw, -16); c.lineTo(-3 + sw, 0); c.moveTo(0, -34); c.lineTo(4 - sw, -16); c.lineTo(3 - sw, 0); c.stroke(); // pernas secas
  c.fillStyle = "#4a3a26"; c.beginPath(); c.moveTo(-6, -34); c.quadraticCurveTo(-8, -50, -2, -64); c.lineTo(8, -63); c.quadraticCurveTo(7, -48, 5, -34); c.closePath(); c.fill(); // tronco
  c.strokeStyle = "rgba(20,14,8,.6)"; c.lineWidth = 1; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(-4, -56 + i * 5); c.quadraticCurveTo(1, -54 + i * 5, 6, -57 + i * 5); c.stroke(); } // costelas
  c.strokeStyle = "#4a3a26"; c.lineWidth = 3.5; c.beginPath(); c.moveTo(6, -60); c.lineTo(14, -46 + Math.sin(f) * 2); c.lineTo(18, -30); c.moveTo(-1, -60); c.lineTo(8, -45 - Math.sin(f) * 2); c.lineTo(14, -32); c.stroke(); // braços compridos
  c.lineWidth = 1.4; for (let d = -1; d <= 1; d++) { c.beginPath(); c.moveTo(18, -30); c.lineTo(20 + d * 2, -24); c.stroke(); }
  c.fillStyle = "#3e3020"; c.beginPath(); c.ellipse(5, -71, 7, 9, .25, 0, 7); c.fill();
  c.fillStyle = "rgba(255,170,90,.95)"; c.beginPath(); c.arc(7, -73, 1.6, 0, 7); c.arc(11, -72, 1.4, 0, 7); c.fill(); c.fillStyle = "#120a06"; c.beginPath(); c.ellipse(9, -66, 2.4, 1.6 + Math.abs(Math.sin(tm * 3)) * 1.4, 0, 0, 7); c.fill();
  c.strokeStyle = "#2a1e12"; c.lineWidth = 1; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(-1 + i * 2, -79); c.lineTo(-4 + i * 2, -70 + (i % 2) * 3); c.stroke(); }
  c.restore();
}
function desenharCachorro(k, tm) {
  const sc = TS / 48, x = PX(k.x), y = PY(k.y), lobo = k.fase === "lobo", vira = k.fase === "vira";
  sombra(x, y, (lobo ? 15 : 11) * sc, 4 * sc, .4); c.save(); c.translate(x, y); c.scale((k.dir || 1) * sc, sc);
  const f = tm * (lobo ? 14 : 8), sw = Math.sin(f) * (k.anda ? 4 : 0), tre = vira ? Math.sin(tm * 50) * 1.5 : 0;
  if (!lobo) { // cachorro preto, calmo demais
    c.fillStyle = "#0e0e10"; c.fillRect(-9 + sw, -9, 3, 9); c.fillRect(6 - sw, -9, 3, 9); c.fillRect(-5 - sw, -9, 3, 9); c.fillRect(2 + sw, -9, 3, 9);
    c.beginPath(); c.ellipse(0 + tre, -12, 12, 6, 0, 0, 7); c.fill(); c.beginPath(); c.ellipse(12 + tre, -18, 6, 5, .2, 0, 7); c.fill(); c.beginPath(); c.moveTo(14, -17); c.lineTo(21, -15); c.lineTo(15, -13); c.fill();
    c.beginPath(); c.moveTo(9, -22); c.lineTo(10, -27); c.lineTo(13, -22); c.fill(); c.strokeStyle = "#0e0e10"; c.lineWidth = 3; c.beginPath(); c.moveTo(-11, -13); c.quadraticCurveTo(-17, -16, -18, -10); c.stroke();
    c.fillStyle = `rgba(230,40,30,${vira ? 1 : .8})`; c.fillRect(14, -20, 1.8, 1.8); if (vira) { c.fillStyle = "rgba(230,40,30,.2)"; c.beginPath(); c.arc(0, -16, 22 + Math.sin(tm * 30) * 4, 0, 7); c.fill(); }
  } else { // lobisomem: corcunda, braços compridos, boca aberta
    c.fillStyle = "#16120f"; c.strokeStyle = "#16120f"; c.lineCap = "round"; c.lineWidth = 6;
    c.beginPath(); c.moveTo(-2, -30); c.lineTo(-7 + sw, -14); c.lineTo(-3 + sw, 0); c.moveTo(2, -30); c.lineTo(6 - sw, -14); c.lineTo(10 - sw, 0); c.stroke();
    c.beginPath(); c.ellipse(4, -42, 12, 16, .5, 0, 7); c.fill();
    c.lineWidth = 5; c.beginPath(); c.moveTo(10, -50); c.lineTo(20, -36 + sw); c.lineTo(25, -24); c.moveTo(4, -50); c.lineTo(12, -34 - sw); c.lineTo(16, -22); c.stroke();
    c.lineWidth = 1.5; c.strokeStyle = "#d8d0c0"; for (let d = -1; d <= 1; d++) { c.beginPath(); c.moveTo(25, -24); c.lineTo(28 + d, -19); c.stroke(); }
    c.fillStyle = "#16120f"; c.beginPath(); c.ellipse(17, -58, 8, 7, .3, 0, 7); c.fill(); c.beginPath(); c.moveTo(20, -58); c.lineTo(31, -55); c.lineTo(21, -52); c.fill(); c.beginPath(); c.moveTo(12, -63); c.lineTo(11, -72); c.lineTo(17, -64); c.fill();
    c.fillStyle = "#e8e0d0"; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(22 + i * 3, -55); c.lineTo(23 + i * 3, -52); c.lineTo(24 + i * 3, -55); c.fill(); }
    c.fillStyle = "rgba(255,40,30,1)"; c.beginPath(); c.arc(19, -60, 1.8, 0, 7); c.fill(); c.fillStyle = "rgba(255,40,30,.25)"; c.beginPath(); c.arc(19, -60, 8, 0, 7); c.fill();
    for (let i = 0; i < 6; i++) { c.strokeStyle = "#16120f"; c.lineWidth = 2; c.beginPath(); c.moveTo(-4 + i * 3, -54 + i); c.lineTo(-8 + i * 3, -60 + i); c.stroke(); } // pelo
  }
  c.restore();
}
function desenharVela(x, y, tm) { c.fillStyle = "#e8e2d0"; c.fillRect(x - 3, y - 14, 6, 14); c.fillStyle = `rgba(255,${200 + Math.sin(tm * 20) * 30},90,.95)`; c.beginPath(); c.ellipse(x + Math.sin(tm * 9) * .8, y - 18, 2.6, 4.5, 0, 0, 7); c.fill(); }
function desenharCruz(tm) {
  const x = PX(CRUZ.x), y = PY(CRUZ.y); sombra(x, y, TS * .3, TS * .1);
  c.fillStyle = "#5a4028"; c.fillRect(x - 3, y - TS * 1.1, 6, TS * 1.1); c.fillRect(x - TS * .3, y - TS * .85, TS * .6, 6);
  c.fillStyle = "rgba(240,235,220,.6)"; c.fillRect(x - TS * .22, y - TS * .7, TS * .1, TS * .25); // fita
  if (R.velaEntregue) desenharVela(x + TS * .3, y, tm);
  for (let i = 0; i < 3; i++) { c.fillStyle = ["#c83a2a", "#e8c84a", "#e8e2d4"][i]; c.beginPath(); c.arc(x - TS * .25 + i * TS * .2, y + 2, 3, 0, 7); c.fill(); } // flores
}
function desenharMundo(tm) {
  const offC = R.venceu ? Math.max(0, R.venceu.t - 1.5) * 2.2 : 0, alvo = R.venceu ? { x: CAMINHONETE.x, y: CAMINHONETE.y + offC } : R.eu; cam.x = mix(cam.x, alvo.x, .12); cam.y = mix(cam.y, alvo.y - .6, .12);
  if (R.tremor > 0) { cam.x += rnd(-.05, .05); cam.y += rnd(-.05, .05); }
  // chão
  c.fillStyle = "#1e2614"; c.fillRect(0, 0, W, H);
  c.drawImage(chaoCv, PX(0), PY(0), MW * TS, MH * TS);
  // lago com reflexo e ondinhas
  const lx = PX((LAGO.x0 + LAGO.x1) / 2), ly = PY((LAGO.y0 + LAGO.y1) / 2), lrx = (LAGO.x1 - LAGO.x0) / 2 * TS, lry = (LAGO.y1 - LAGO.y0) / 2 * TS;
  const lg = c.createRadialGradient(lx, ly, 4, lx, ly, lrx); lg.addColorStop(0, "#3a6a7a"); lg.addColorStop(1, "#2a4a5a"); c.fillStyle = lg; c.beginPath(); c.ellipse(lx, ly, lrx, lry, 0, 0, 7); c.fill();
  c.strokeStyle = "rgba(200,230,240,.25)"; c.lineWidth = 1.2; for (let i = 0; i < 6; i++) { const r = ((tm * .25 + i / 6) % 1); c.beginPath(); c.ellipse(lx + Math.sin(i * 3) * lrx * .4, ly + Math.cos(i * 2) * lry * .4, r * TS * .7, r * TS * .25, 0, 0, 7); c.stroke(); }
  c.fillStyle = "#3a6a2a"; [[.8, .1], [-.6, .7], [.3, -.8]].forEach(([fx, fy]) => { c.beginPath(); c.ellipse(lx + fx * lrx * .8, ly + fy * lry * .8, TS * .18, TS * .1, 0, 0, 7); c.fill(); }); // vitórias-régias
  // doca
  c.fillStyle = "#7a5a32"; c.fillRect(PX(DOCA.x - .2), PY(DOCA.y - .3), TS * 1.3, TS * .6); c.strokeStyle = "rgba(0,0,0,.3)"; c.lineWidth = 1; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(PX(DOCA.x - .2 + i * .26), PY(DOCA.y - .3)); c.lineTo(PX(DOCA.x - .2 + i * .26), PY(DOCA.y + .3)); c.stroke(); }
  // canteiros
  R.canteiros.forEach(k => {
    const x = PX(k.x), y = PY(k.y);
    if (k.aberto) { c.fillStyle = "#5a3a22"; c.fillRect(x - 3, y - 3, k.w * TS + 6, k.h * TS + 6); c.fillStyle = "#4a2e1a"; for (let r = 0; r < k.h; r++) c.fillRect(x, y + r * TS + TS * .38, k.w * TS, TS * .24); }
    else { c.fillStyle = "rgba(60,50,30,.5)"; c.fillRect(x, y, k.w * TS, k.h * TS); c.strokeStyle = "rgba(240,230,200,.35)"; c.setLineDash([6, 6]); c.lineWidth = 2; c.strokeRect(x, y, k.w * TS, k.h * TS); c.setLineDash([]);
      c.fillStyle = "rgba(240,230,200,.8)"; c.font = `700 ${Math.round(TS * .3)}px "JetBrains Mono", monospace`; c.textAlign = "center"; c.fillText(`${k.preco} moedas`, x + k.w * TS / 2, y + k.h * TS / 2 + 4); c.textAlign = "start";
      for (let i = 0; i < 8; i++) { c.strokeStyle = "#4a5a2a"; c.lineWidth = 2; const gx = x + ((i * 37) % (k.w * TS)), gy = y + ((i * 23) % (k.h * TS)); c.beginPath(); c.moveTo(gx, gy + 6); c.lineTo(gx - 3, gy - 4); c.moveTo(gx, gy + 6); c.lineTo(gx + 4, gy - 3); c.stroke(); } }
  });
  // objetos ordenados pela altura (quem está mais embaixo na tela fica na frente)
  const obj = [];
  R.arvores.forEach(a => obj.push([a.y, () => desenharArvore(a, tm)]));
  obj.push([CASA.y + CASA.h, () => desenharCasa(tm)]);
  R.canteiros.forEach(k => k.aberto && k.covas.forEach((cv2, i) => cv2 && obj.push([k.y + Math.floor(i / k.w) + .55, () => desenharPlanta(cv2, PX(k.x + i % k.w + .5), PY(k.y + Math.floor(i / k.w) + .55), tm)])));
  obj.push([POCO.y + .3, () => { const x = PX(POCO.x), y = PY(POCO.y + .3); sombra(x, y, TS * .55, TS * .2); c.fillStyle = "#6a6a6a"; c.beginPath(); c.ellipse(x, y - TS * .3, TS * .45, TS * .18, 0, 0, 7); c.fill(); c.fillRect(x - TS * .45, y - TS * .3, TS * .9, TS * .3); c.fillStyle = "#0a0c10"; c.beginPath(); c.ellipse(x, y - TS * .32, TS * .34, TS * .12, 0, 0, 7); c.fill(); c.fillStyle = "#5a3a22"; c.fillRect(x - TS * .42, y - TS * 1.1, 5, TS * .8); c.fillRect(x + TS * .38, y - TS * 1.1, 5, TS * .8); c.fillRect(x - TS * .46, y - TS * 1.15, TS * .92, 6); c.strokeStyle = "#ccc"; c.lineWidth = 1; c.beginPath(); c.moveTo(x, y - TS * 1.1); c.lineTo(x, y - TS * .6); c.stroke(); c.fillStyle = "#7a7a7a"; c.fillRect(x - 5, y - TS * .62, 10, 8); }]);
  obj.push([CAIXOTE.y, () => { const x = PX(CAIXOTE.x), y = PY(CAIXOTE.y); sombra(x, y, TS * .4, TS * .12); c.fillStyle = "#8a6a3a"; c.fillRect(x - TS * .35, y - TS * .5, TS * .7, TS * .5); c.strokeStyle = "#5a3a1a"; c.lineWidth = 2; c.strokeRect(x - TS * .35, y - TS * .5, TS * .7, TS * .5); c.beginPath(); c.moveTo(x - TS * .35, y - TS * .25); c.lineTo(x + TS * .35, y - TS * .25); c.stroke(); c.fillStyle = "#f2c94a"; c.font = `800 ${Math.round(TS * .22)}px "Big Shoulders Display", sans-serif`; c.textAlign = "center"; c.fillText("VENDA", x, y - TS * .56); c.textAlign = "start"; }]);
  obj.push([CRUZ.y, () => desenharCruz(tm)]);
  obj.push([CAMINHONETE.y + .9 + offC, () => { const x = PX(CAMINHONETE.x), y = PY(CAMINHONETE.y + .9 + offC), w = TS * 2.6, h = TS * 1; sombra(x, y, w * .55, TS * .2, .4); c.fillStyle = "#8a2a1e"; c.fillRect(x - w / 2, y - h * .9, w, h * .6); c.fillRect(x - w * .1, y - h * 1.35, w * .5, h * .5); c.fillStyle = "rgba(150,180,200,.5)"; c.fillRect(x + w * .02, y - h * 1.28, w * .32, h * .32); c.fillStyle = "#3a1a14"; c.fillRect(x - w / 2, y - h * .9, w * .42, 4); c.fillStyle = "#111"; [-.32, .32].forEach(o => { c.beginPath(); c.arc(x + o * w, y - h * .26, h * .26, 0, 7); c.fill(); });
    c.fillStyle = "rgba(110,60,30,.6)"; c.fillRect(x - w * .3, y - h * .62, w * .2, h * .2); if (R.pecas < 3) { c.fillStyle = "rgba(240,230,200,.8)"; c.font = `700 ${Math.round(TS * .26)}px "JetBrains Mono", monospace`; c.textAlign = "center"; c.fillText(`${R.pecas}/3 peças`, x, y - h * 1.5); c.textAlign = "start"; } }]);
  PLACAS.forEach(pl => obj.push([pl.y, () => { const x = PX(pl.x), y = PY(pl.y); sombra(x, y, TS * .2, TS * .07); c.fillStyle = "#5a3a22"; c.fillRect(x - 2, y - TS * .7, 4, TS * .7); c.fillStyle = "#8a6a3a"; c.fillRect(x - TS * .3, y - TS * .85, TS * .6, TS * .32); c.fillStyle = "rgba(30,20,10,.7)"; for (let i = 0; i < 3; i++) c.fillRect(x - TS * .22, y - TS * .78 + i * TS * .08, TS * (.3 + (i % 2) * .14), 2); }]));
  // decoração: espantalho e fardos de feno
  [[21.5, 16.6], [12.8, 16.8]].forEach(([fx, fy]) => obj.push([fy, () => { const x = PX(fx), y = PY(fy); sombra(x, y, TS * .4, TS * .12); c.fillStyle = "#d8b860"; c.beginPath(); c.ellipse(x, y - TS * .25, TS * .38, TS * .28, 0, 0, 7); c.fill(); c.strokeStyle = "rgba(120,90,30,.6)"; c.lineWidth = 1.5; c.beginPath(); c.ellipse(x, y - TS * .25, TS * .22, TS * .28, 0, 0, 7); c.stroke(); }]));
  obj.push([16.6, () => { const x = PX(25.6), y = PY(12.8); sombra(x, y, TS * .3, TS * .1); c.fillStyle = "#5a3a22"; c.fillRect(x - 2, y - TS * 1.2, 4, TS * 1.2); c.fillRect(x - TS * .4, y - TS * .95, TS * .8, 4); c.fillStyle = "#4a6a8a"; c.fillRect(x - TS * .18, y - TS * .95, TS * .36, TS * .42); c.fillStyle = "#e8d8a0"; c.beginPath(); c.arc(x, y - TS * 1.1, TS * .14, 0, 7); c.fill(); c.fillStyle = "#c8a050"; c.beginPath(); c.ellipse(x, y - TS * 1.2, TS * .26, TS * .06, 0, 0, 7); c.fill(); c.fillStyle = "#1a1a1a"; c.fillRect(x - 3, y - TS * 1.12, 2, 2); c.fillRect(x + 2, y - TS * 1.12, 2, 2); }]); // espantalho
  // cerca
  const ce = desenharCerca();
  for (let x = CERCA.x0; x <= CERCA.x1; x++) { obj.push([CERCA.y0, () => ce.post(x, CERCA.y0)]); if (x < CERCA.x1) obj.push([CERCA.y0, () => ce.trilho(x, CERCA.y0, x + 1, CERCA.y0)]); obj.push([CERCA.y1, () => ce.post(x, CERCA.y1)]); if (x < CERCA.x1 && (x < 17 || x > 19)) obj.push([CERCA.y1, () => ce.trilho(x, CERCA.y1, x + 1, CERCA.y1)]); }
  for (let y = CERCA.y0; y <= CERCA.y1; y++) { obj.push([y, () => ce.post(CERCA.x0, y)]); obj.push([y, () => ce.post(CERCA.x1, y)]); if (y < CERCA.y1) { obj.push([y + 1, () => ce.trilho(CERCA.x0, y, CERCA.x0, y + 1)]); obj.push([y + 1, () => ce.trilho(CERCA.x1, y, CERCA.x1, y + 1)]); } }
  // gente e bichos
  obj.push([R.gato.y, () => desenharGato(R.gato, tm)]);
  if (R.cachorro) obj.push([R.cachorro.y, () => desenharCachorro(R.cachorro, tm)]);
  obj.push([R.seco.y, () => desenharSeco(R.seco, tm)]);
  if (R.vela && !R.velaCom) obj.push([R.vela.y, () => desenharVela(PX(R.vela.x), PY(R.vela.y), tm)]);
  if (!R.dentro && !(R.venceu && R.venceu.t > 1)) obj.push([R.eu.y, () => { desenharVoce(PX(R.eu.x), PY(R.eu.y), tm); if (R.velaCom) desenharVela(PX(R.eu.x) - TS * .28, PY(R.eu.y) - TS * .35, tm); }]);
  obj.sort((a, b) => a[0] - b[0]).forEach(o => o[1]());
  // pesca: linha e boia
  if (R.pesca) { const bx = PX(DOCA.x + 1.6), by = PY(DOCA.y + .3) + Math.sin(tm * 3) * 2 + (R.pesca.fisgou ? 6 : 0); c.strokeStyle = "rgba(230,230,230,.6)"; c.lineWidth = 1; c.beginPath(); c.moveTo(PX(R.eu.x) + TS * .3, PY(R.eu.y) - TS * .7); c.quadraticCurveTo(bx, by - TS, bx, by); c.stroke(); c.fillStyle = "#e2483d"; c.beginPath(); c.arc(bx, by, 4, 0, 7); c.fill(); if (R.pesca.fisgou) { c.fillStyle = "#f2c94a"; c.font = `900 ${Math.round(TS * .6)}px "Big Shoulders Display", sans-serif`; c.fillText("!", bx - 5, by - TS * .6); } }
  // folhas caindo de dia, vaga-lumes de noite
  const nt = horaNoite();
  for (let i = 0; i < 18; i++) { const k = (tm * .08 + i / 18) % 1, x = ((i * 137 + tm * 18) % (W + 40)) - 20, y = k * H; if (nt < .5) { c.fillStyle = ["#c8662a", "#d89a2a", "#a8401e"][i % 3]; c.save(); c.translate(x + Math.sin(tm * 2 + i) * 10, y); c.rotate(tm * 2 + i); c.fillRect(-3, -1.5, 6, 3); c.restore(); } }
}
function desenharLuz(tm) {
  const nt = horaNoite(), lw = luzCv.width, lh = luzCv.height, k = lw / W;
  const tarde = cl(1 - Math.abs(((R.t % CICLO) - (DIA - 14)) / 22), 0, 1) * (1 - nt);
  if (tarde > .02) { c.fillStyle = `rgba(255,140,60,${.16 * tarde})`; c.fillRect(0, 0, W, H); }
  if (nt <= .02) return;
  lc.setTransform(1, 0, 0, 1, 0, 0); lc.globalCompositeOperation = "source-over"; lc.clearRect(0, 0, lw, lh);
  lc.fillStyle = `rgba(6,10,24,${.9 * nt})`; lc.fillRect(0, 0, lw, lh);
  lc.globalCompositeOperation = "destination-out";
  const furo = (x, y, r, a = 1) => { const g = lc.createRadialGradient(x * k, y * k, 0, x * k, y * k, r * k); g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(.55, `rgba(0,0,0,${a * .7})`); g.addColorStop(1, "rgba(0,0,0,0)"); lc.fillStyle = g; lc.beginPath(); lc.arc(x * k, y * k, r * k, 0, 7); lc.fill(); };
  const ex = PX(R.eu.x), ey = PY(R.eu.y) - TS * .4;
  furo(ex, ey, TS * (R.lanterna ? (R.lanternaBoa ? 5.4 : 4.4) : 1.7) * (1 + Math.sin(tm * 9) * .01), R.lanterna ? 1 : .75);
  const lit = R.lamparinas.filter(v => v).length / 3;
  if (lit) [[.25, .55], [.75, .55]].forEach(([fx, fy]) => furo(PX(CASA.x + CASA.w * fx), PY(CASA.y + CASA.h * fy) + TS * .6, TS * 1.6 * lit, .8));
  if (R.vela && !R.velaCom) furo(PX(R.vela.x), PY(R.vela.y) - 16, TS * 1.4, .9);
  if (R.velaEntregue) furo(PX(CRUZ.x), PY(CRUZ.y) - 20, TS * 1.6, .9);
  for (let i = 0; i < 14; i++) { const fx = CERCA.x0 + 1 + (i * 7.3) % (CERCA.x1 - CERCA.x0 - 2) + Math.sin(tm * .4 + i) * 1.2, fy = CERCA.y0 + 1 + (i * 5.1) % (CERCA.y1 - CERCA.y0 - 2) + Math.cos(tm * .5 + i * 2) * .8, a = .5 + .5 * Math.sin(tm * 3 + i * 1.7); if (a > .3) furo(PX(fx), PY(fy), TS * .35, a * .8); }
  c.drawImage(luzCv, 0, 0, W, H);
  // brilhos quentes por cima
  c.globalCompositeOperation = "lighter";
  const brilho = (x, y, r, rgb, a) => { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); };
  if (R.lanterna) brilho(ex, ey, TS * 3, "255,200,120", .14 * nt);
  if (R.vela && !R.velaCom) brilho(PX(R.vela.x), PY(R.vela.y) - 16, TS * .9, "255,190,90", .35 * nt);
  for (let i = 0; i < 14; i++) { const fx = CERCA.x0 + 1 + (i * 7.3) % (CERCA.x1 - CERCA.x0 - 2) + Math.sin(tm * .4 + i) * 1.2, fy = CERCA.y0 + 1 + (i * 5.1) % (CERCA.y1 - CERCA.y0 - 2) + Math.cos(tm * .5 + i * 2) * .8, a = .5 + .5 * Math.sin(tm * 3 + i * 1.7); if (a > .3) brilho(PX(fx), PY(fy), 6, "200,255,140", a * nt); }
  c.globalCompositeOperation = "source-over";
  // olhos na mata no escuro
  if (nt > .6) for (let i = 0; i < 4; i++) { const on = Math.sin(tm * .7 + i * 2.3) > .8; if (!on) continue; const ox = PX(i % 2 ? CERCA.x0 - 1.5 : CERCA.x1 + 1.5), oy = PY(CERCA.y0 + 3 + i * 3.5); c.fillStyle = "rgba(255,80,60,.8)"; c.fillRect(ox - 4, oy, 2.5, 2.5); c.fillRect(ox + 2, oy, 2.5, 2.5); }
}
/* ---------- dentro de casa (vista de cima) ---------- */
function desenharDentro(tm) {
  const s = Math.min(W / 8.2, H / 6.6), ox = W / 2 - 3.5 * s, oy = H / 2 - 3.3 * s, X = x => ox + x * s, Y = y => oy + y * s;
  c.fillStyle = "#06070a"; c.fillRect(0, 0, W, H);
  c.fillStyle = "#5a3e26"; c.fillRect(X(.5), Y(1), 6 * s, 5 * s);
  c.strokeStyle = "rgba(0,0,0,.25)"; c.lineWidth = 1; for (let i = 1; i < 10; i++) { c.beginPath(); c.moveTo(X(.5), Y(1 + i * .5)); c.lineTo(X(6.5), Y(1 + i * .5)); c.stroke(); }
  c.fillStyle = "#3a2a1a"; c.fillRect(X(.3), Y(.4), 6.4 * s, .6 * s); c.fillRect(X(.3), Y(.4), .2 * s, 5.8 * s); c.fillRect(X(6.5), Y(.4), .2 * s, 5.8 * s); c.fillRect(X(.3), Y(6), 2.6 * s, .2 * s); c.fillRect(X(4.1), Y(6), 2.6 * s, .2 * s); // paredes
  c.fillStyle = "#7a3a3a"; c.beginPath(); c.ellipse(X(3.5), Y(3.8), 1.4 * s, .8 * s, 0, 0, 7); c.fill(); // tapete
  // cama (de onde ela sai)
  c.fillStyle = "#4a3020"; c.fillRect(X(.7), Y(1.1), 1.7 * s, 1.4 * s); c.fillStyle = "#c8c0b0"; c.fillRect(X(.8), Y(1.15), 1.5 * s, 1.25 * s); c.fillStyle = "#6a5a8a"; c.fillRect(X(.8), Y(1.6), 1.5 * s, .8 * s); c.fillStyle = "#e8e2d8"; c.fillRect(X(.9), Y(1.2), .8 * s, .35 * s);
  c.fillStyle = "#020203"; c.fillRect(X(.7), Y(2.5), 1.7 * s, .12 * s);
  // bancada
  c.fillStyle = "#6a4a2a"; c.fillRect(X(5), Y(1.1), 1.4 * s, .8 * s); c.fillStyle = "#8a8a8a"; c.fillRect(X(5.2), Y(1.25), .3 * s, .15 * s); c.fillStyle = "#c8a050"; c.fillRect(X(5.7), Y(1.3), .45 * s, .3 * s);
  c.fillStyle = "rgba(242,201,74,.9)"; c.font = `700 ${Math.round(s * .18)}px "JetBrains Mono", monospace`; c.fillText("BANCADA", X(5.05), Y(2.1));
  // mesa, fogão
  c.fillStyle = "#6a4a2a"; c.beginPath(); c.arc(X(3.5), Y(2.4), .45 * s, 0, 7); c.fill(); c.fillStyle = "#2a2a2a"; c.fillRect(X(2.8), Y(.6), .9 * s, .5 * s);
  // lamparinas
  const L = [[X(3.3), Y(2.3)], [X(.6), Y(4.4)], [X(6.4), Y(4.4)]];
  R.lamparinas.forEach((v, i) => { const [lx, ly] = L[i]; c.fillStyle = "#3a3a3a"; c.fillRect(lx - 4, ly - 6, 8, 10); if (v) { c.fillStyle = "rgba(255,210,120,.95)"; c.beginPath(); c.ellipse(lx, ly - 9, 3, 5, 0, 0, 7); c.fill(); } });
  // porta
  c.fillStyle = "#2a1a0e"; c.fillRect(X(2.9), Y(5.95), 1.2 * s, .3 * s); c.fillStyle = "rgba(240,230,200,.7)"; c.font = `700 ${Math.round(s * .16)}px "JetBrains Mono", monospace`; c.fillText("PORTA", X(3.05), Y(6.6));
  // você
  desenharVoce(X(R.sala.x), Y(R.sala.y), tm, { dir: R.sala.dir || 1 });
  // escuridão conforme as lamparinas
  const lit = R.lamparinas.filter(v => v).length;
  c.fillStyle = `rgba(4,5,10,${[.72, .55, .32, .08][lit]})`; c.fillRect(0, 0, W, H);
  c.globalCompositeOperation = "lighter"; R.lamparinas.forEach((v, i) => { if (!v) return; const [lx, ly] = L[i], g = c.createRadialGradient(lx, ly, 0, lx, ly, s * 1.6); g.addColorStop(0, "rgba(255,190,110,.3)"); g.addColorStop(1, "rgba(255,190,110,0)"); c.fillStyle = g; c.beginPath(); c.arc(lx, ly, s * 1.6, 0, 7); c.fill(); }); c.globalCompositeOperation = "source-over";
  // pisadeira
  if (R.pisadeira) { const p = R.pisadeira, sai = Math.min(1, p.t / 1.6), px2 = X(p.x), py2 = Y(p.y); c.save(); c.globalAlpha = sai; c.fillStyle = "#0a0806"; c.beginPath(); c.ellipse(px2, py2, s * .32, s * .26, 0, 0, 7); c.fill();
    c.strokeStyle = "#0a0806"; c.lineWidth = s * .06; c.lineCap = "round"; for (let i = 0; i < 4; i++) { const a = i * 1.6 + Math.sin(tm * 6 + i) * .3; c.beginPath(); c.moveTo(px2, py2); c.lineTo(px2 + Math.cos(a) * s * .5, py2 + Math.sin(a) * s * .5); c.lineTo(px2 + Math.cos(a + .4) * s * .7, py2 + Math.sin(a + .4) * s * .7); c.stroke(); }
    c.strokeStyle = "#1a1410"; c.lineWidth = 1.2; for (let i = 0; i < 10; i++) { c.beginPath(); c.moveTo(px2 - s * .2 + i * s * .04, py2 - s * .15); c.lineTo(px2 - s * .3 + i * s * .06, py2 + s * .3); c.stroke(); }
    c.fillStyle = "rgba(240,220,170,.95)"; c.beginPath(); c.arc(px2 - s * .07, py2 - s * .05, 2.5, 0, 7); c.arc(px2 + s * .07, py2 - s * .05, 2.5, 0, 7); c.fill(); const g2 = c.createRadialGradient(px2, py2, 0, px2, py2, s * .5); g2.addColorStop(0, "rgba(240,220,170,.25)"); g2.addColorStop(1, "rgba(240,220,170,0)"); c.fillStyle = g2; c.beginPath(); c.arc(px2, py2, s * .5, 0, 7); c.fill(); c.restore(); }
  c.fillStyle = "rgba(240,230,210,.6)"; c.font = `600 ${Math.round(Math.max(11, s * .15))}px "JetBrains Mono", monospace`; c.textAlign = "center"; c.fillText(lit === 3 ? "Lá fora você ouve o vento." : lit ? `Uma lamparina apagou. Restam ${lit}.` : "Saia. Agora.", W / 2, Y(.2)); c.textAlign = "start";
}
function desenharSusto(tm) {
  // rosto que aparece quando você morre (e no fundo do poço)
  const quem = R.morto ? R.morto.quem : R.rostoPoco ? "poco" : null; if (!quem) return;
  const k = R.morto ? Math.min(1, R.morto.t / .25) : cl(R.susto / 1.1, 0, 1); if (k <= 0) { R.rostoPoco = 0; return; }
  const cores = { seco: ["#3e3020", "255,170,90"], lobo: ["#16120f", "255,40,30"], alma: ["#d8dce4", "20,20,30"], pisadeira: ["#1a1410", "240,220,170"], poco: ["#c8ccd2", "10,10,14"] }[quem];
  c.fillStyle = `rgba(0,0,0,${.85 * k})`; c.fillRect(0, 0, W, H);
  const tr = R.morto && R.morto.t < 1 ? rnd(-8, 8) : 0, r = Math.min(W, H) * .36 * (.8 + .2 * k), x = W / 2 + tr, y = H / 2 + tr;
  c.save(); c.globalAlpha = k; c.fillStyle = cores[0]; c.beginPath(); c.ellipse(x, y, r * .78, r, 0, 0, 7); c.fill();
  c.fillStyle = "rgba(0,0,0,.6)"; c.beginPath(); c.ellipse(x - r * .3, y - r * .15, r * .2, r * .24, 0, 0, 7); c.ellipse(x + r * .3, y - r * .15, r * .2, r * .24, 0, 0, 7); c.fill();
  c.fillStyle = `rgb(${cores[1]})`; c.beginPath(); c.arc(x - r * .3, y - r * .13, r * .06, 0, 7); c.arc(x + r * .3, y - r * .13, r * .06, 0, 7); c.fill();
  c.fillStyle = "#080404"; c.beginPath(); c.ellipse(x, y + r * .42, r * .3, r * .3 * (1 + Math.sin(tm * 30) * .08), 0, 0, 7); c.fill();
  c.fillStyle = "#e8e0d0"; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(x - r * .25 + i * r * .1, y + r * .16); c.lineTo(x - r * .2 + i * r * .1, y + r * .3); c.lineTo(x - r * .15 + i * r * .1, y + r * .16); c.fill(); }
  if (quem === "lobo") { c.fillStyle = cores[0]; c.beginPath(); c.moveTo(x - r * .6, y - r * .6); c.lineTo(x - r * .4, y - r * 1.2); c.lineTo(x - r * .2, y - r * .8); c.moveTo(x + r * .6, y - r * .6); c.lineTo(x + r * .4, y - r * 1.2); c.lineTo(x + r * .2, y - r * .8); c.fill(); }
  if (quem === "pisadeira" || quem === "alma") { c.strokeStyle = quem === "alma" ? "rgba(230,230,240,.8)" : "#0a0806"; c.lineWidth = 3; for (let i = 0; i < 16; i++) { c.beginPath(); c.moveTo(x - r * .7 + i * r * .09, y - r * .9); c.lineTo(x - r * .85 + i * r * .11, y + r * 1.1); c.stroke(); } }
  c.restore();
  if (R.morto) { c.fillStyle = `rgba(226,40,30,${.25 * Math.max(0, 1 - R.morto.t)})`; c.fillRect(0, 0, W, H); }
}
function desenharFx() {
  R.fx.forEach(f => { const a = 1 - f.t / 1.8, x = f.x == null ? W / 2 : PX(f.x), y = (f.y == null ? H * .3 : PY(f.y) - TS * 1.3) - f.t * 30; c.globalAlpha = Math.max(0, a); c.fillStyle = f.cor; c.font = `800 ${Math.round(Math.max(14, TS * .32))}px "Big Shoulders Display", sans-serif`; c.textAlign = "center"; c.strokeStyle = "rgba(0,0,0,.7)"; c.lineWidth = 3; c.strokeText(f.txt, x, y); c.fillText(f.txt, x, y); c.textAlign = "start"; c.globalAlpha = 1; });
  // dica do que fazer agora
  el.rcDica.textContent = R.dentro ? "" : R.seco.fase === "anda" || R.seco.fase === "aviso" ? "A mata estalou. Entre em casa!" : R.cachorro && R.cachorro.fase === "lobo" ? "Corra para casa!" : R.vela && !R.velaCom ? "Siga o som do sino e ache a vela" : R.velaCom ? "Leve a vela até a cruz" : "";
}
function desenharVitoria(tm) {
  if (!R.venceu) return; const k = R.venceu.t;
  if (k < 1) return; // o personagem entra na caminhonete
  c.fillStyle = `rgba(0,0,0,${cl((k - 3) / 1.4, 0, 1)})`; c.fillRect(0, 0, W, H);
}
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
