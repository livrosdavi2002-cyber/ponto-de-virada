/* ============================================================
   GRUPO: cada sobrevivente é bom em alguma coisa
   + quem vai com você vasculhar
   + investigar barulho saindo da cama
   + som ambiente: música baixinha, chuva só quando chove
   ============================================================ */

const FUNCOES = {
  carpinteiro: { nome: "Carpinteiro", bom: "pregar barricadas", efeito: "Barricadas mais fortes", ic: "martelo" },
  coletor: { nome: "Coletor", bom: "achar coisas", efeito: "Traz bem mais itens quando vai junto", ic: "busca" },
  cacador: { nome: "Caçador", bom: "caçar", efeito: "A caça rende mais", ic: "caca" },
  medico: { nome: "Médico", bom: "cuidar de feridas", efeito: "Cura um pouco toda manhã", ic: "remedio" },
  vigia: { nome: "Vigia", bom: "vigiar a noite", efeito: "As hordas fazem menos estrago", ic: "lua" },
};
const LISTA_FUNCOES = ["coletor", "cacador", "medico", "vigia", "carpinteiro"];
function funcaoDe(nome) { let h = 0; for (const c of String(nome)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return LISTA_FUNCOES[h % LISTA_FUNCOES.length]; }
function funcaoDo(g) { if (!g.funcao) g.funcao = funcaoDe(g.nome); return g.funcao; }
function temFuncao(f) { if (!SOB) return false; if ((SOB.minhaFuncao || "carpinteiro") === f) return true; return SOB.grupo.some(g => funcaoDo(g) === f); }
const quantosFazem = f => !SOB ? 0 : ((SOB.minhaFuncao || "carpinteiro") === f ? 1 : 0) + SOB.grupo.filter(g => funcaoDo(g) === f).length;

// quem bate na porta conta no que é bom
const _sobVisitanteG = sobVisitante;
sobVisitante = function (noite, depois) {
  _sobVisitanteG(noite, depois);
  const el = $s("sobTexto"), m = el && el.textContent.match(/É ([^.]+)\./);
  if (m) { const f = FUNCOES[funcaoDe(m[1])]; el.insertAdjacentHTML("beforeend", ` <span class="sb-funcao">${ic(f.ic)}${f.nome}: bom em ${f.bom}.</span>`); }
};

// carpinteiros pregam barricadas melhores (você é carpinteiro)
const _sobFortificarG = sobFortificar;
sobFortificar = function () { const tinha = qtd("material") >= 2; _sobFortificarG(); const b = quantosFazem("carpinteiro") * (tinha ? 5 : 2); if (b) sobMuda("defesa", b); };

// médico cuida do grupo de manhã
const _sobAmanhecerG = sobAmanhecer;
sobAmanhecer = function (msg) { _sobAmanhecerG(msg); if (SOB && temFuncao("medico") && SOB.saude < 100) sobMuda("saude", 6); };

// vigia segura melhor a noite
const _sobHordaG = sobHorda;
sobHorda = function (pos) { const v = temFuncao("vigia") ? 10 : 0; if (SOB) SOB.defesa += v; try { _sobHordaG(pos); } finally { if (SOB) SOB.defesa = Math.max(0, SOB.defesa - v); } };

/* ---------- quem vai com você vasculhar ---------- */
const _sobVasculharG = sobVasculhar;
sobVasculhar = function (g) {
  if (!SOB.grupo.length) { SOB.acompanha = null; return _sobVasculharG(g); }
  sobTexto(`Quem vai com você até <em>${g.nome}</em>?`, false);
  sobBotoes([
    { t: "Ir sozinho", sub: "Ninguém se arrisca além de você", icone: "porta", on: () => { SOB.acompanha = null; _sobVasculharG(g); } },
    ...SOB.grupo.map(q => { const f = FUNCOES[funcaoDo(q)]; return { t: `Levar ${q.nome}`, sub: `${f.nome} · ${funcaoDo(q) === "coletor" ? "+60% de itens" : "+20% de itens"} · menos risco`, icone: f.ic, on: () => { SOB.acompanha = q; _sobVasculharG(g); } }; }),
    { t: "Voltar", icone: "porta", cls: "mini", on: () => sobDia() }]);
};
const _sobLootG = sobLoot;
sobLoot = function (tabela, mult = 1) { const a = SOB && SOB.acompanha; if (a) mult *= funcaoDo(a) === "coletor" ? 1.6 : 1.2; return _sobLootG(tabela, mult); };
const _sobRiscoG = sobRisco;
sobRisco = function (base) { const r = _sobRiscoG(base); return SOB && SOB.acompanha ? r * .75 : r; };
const _sobDiaG = sobDia;
sobDia = function (msg) { if (SOB) SOB.acompanha = null; return _sobDiaG(msg); };
// o companheiro aparece andando atrás de você nos lugares
const comCompanheiro = fn => function (t, p) {
  const a = SOB && SOB.acompanha; if (!a) return fn(t, p);
  const _p = pessoa; let feito = false;
  pessoa = (x, y, h, o = {}) => { _p(x, y, h, o); if (!feito && o.mochila) { feito = true; _p(x - (o.dir || 1) * h * .38, y + 2, h * .95, { ...o, luz: false, fase: (o.fase || 0) + 1.4, aro: "rgba(155,216,107,.3)" }); } };
  try { return fn(t, p); } finally { pessoa = _p; }
};
sobLugar = comCompanheiro(sobLugar); chernoLugar = comCompanheiro(chernoLugar);

/* ---------- mochila: o grupo e no que cada um é bom ---------- */
const _abrirMochilaG = abrirMochila;
abrirMochila = function (msg) {
  _abrirMochilaG(msg);
  const corpo = document.querySelector("#sobPainel .pn-corpo"); if (!corpo || !SOB) return;
  const linha = (nome, f) => `<div class="pn-item">${ic(FUNCOES[f].ic)}<div class="pn-it"><b>${nome} <span>${FUNCOES[f].nome}</span></b><small>${FUNCOES[f].efeito}</small></div></div>`;
  corpo.insertAdjacentHTML("afterbegin", `<h3>${ic("grupo")}Grupo</h3>` + linha("Você", SOB.minhaFuncao || "carpinteiro") + SOB.grupo.map(g => linha(g.nome, funcaoDo(g))).join(""));
};

/* ---------- investigar o barulho: levanta da cama e vai até a porta ---------- */
function animarAntesDe(regex, ms, prep) {
  const box = $s("sobAcoes"); if (!box) return;
  let passa = false;
  box.addEventListener("click", function h(e) {
    const b = e.target.closest(".sb-acao"); if (!b || passa) return;
    if (!regex.test(b.textContent)) return box.removeEventListener("click", h, true);
    e.stopPropagation(); e.preventDefault(); box.removeEventListener("click", h, true);
    prep(); [...box.querySelectorAll(".sb-acao")].forEach(x => x.disabled = true);
    setTimeout(() => { passa = true; b.disabled = false; b.click(); }, ms);
  }, true);
}
const _sobBarulhoG = sobBarulho;
sobBarulho = function (pos) {
  _sobBarulhoG(pos);
  if (ehCasa()) animarAntesDe(/Investigar/, 1600, () => { if (sobCena) sobCena.investiga = performance.now(); tocar("passoLeve"); });
};

/* ---------- som: chuva só quando chove, música baixinha no fundo ---------- */
const _sobAmbienteG = sobAmbiente;
sobAmbiente = function (noite) {
  _sobAmbienteG(noite);
  if (!SOB || !AC) return;
  const chove = SOB.clima === "chuva";
  setAmb({ drone: noite ? .55 : .2, vento: chove ? .45 : 0, chuva: chove ? (noite ? .8 : .7) : 0, fogo: 0, motor: 0, estatica: 0, agua: 0, zumbido: 0 });
  musicaSob(true);
};
let musicaId = null, musicaPasso = 0;
const ACORDES = [[110, 130.8, 164.8], [87.3, 130.8, 174.6], [73.4, 110, 146.8], [82.4, 123.5, 164.8]]; // Lá menor, Fá, Ré menor, Mi
const MELODIA = [440, 523.3, 493.9, 392, 440, 349.2, 329.6, 392];
function musicaSob(liga) {
  if (!liga) { if (musicaId) clearInterval(musicaId); musicaId = null; return; }
  if (musicaId) return;
  const toca = () => {
    if (!SOB || !AC || mudo || document.hidden || !document.body.classList.contains("modo-sob")) return;
    const ac = ACORDES[musicaPasso % ACORDES.length];
    ac.forEach((f, i) => tom(f, 6.4, { tipo: i ? "sine" : "triangle", vol: i ? .012 : .016, atk: 1.9, wet: .75, lp: 650 }));
    if (musicaPasso % 2 === 0 || Math.random() < .4) { const n = MELODIA[(musicaPasso * 3 + Math.floor(Math.random() * 2)) % MELODIA.length]; tom(n, 2.6, { tipo: "sine", vol: .006, atk: .04, wet: .95, quando: 1.2 + Math.random() * 2 }); }
    musicaPasso++;
  };
  toca(); musicaId = setInterval(toca, 4800);
}
const _sairSobG = window.sairSob;
window.sairSob = function () { musicaSob(false); return _sairSobG.apply(this, arguments); };
