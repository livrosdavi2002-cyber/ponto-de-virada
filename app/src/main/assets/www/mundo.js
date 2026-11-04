/* ============================================================
   MUNDO DOS MODOS INFINITOS
   mapa e viagens · lugares que precisam de conserto · fabricação
   armas · casas novas em terrenos · cenários de cada lugar · desenhos dos itens
   ============================================================ */

/* ---------- itens novos ---------- */
Object.assign(ITENS, {
  tomate: { nome: "Tomate", tipo: "comida", fome: 20, ic: "horta", desc: "Suculento. Cresce rápido." },
  abobora: { nome: "Abóbora", tipo: "comida", fome: 50, ic: "horta", desc: "Enorme. Alimenta muito." },
  alface: { nome: "Alface", tipo: "comida", fome: 12, ic: "horta", desc: "Leve. Fica pronta em 1 dia." },
  s_tomate: { nome: "Sementes de tomate", tipo: "semente", planta: "tomate", dias: 2, rende: 4, ic: "semente" },
  s_abobora: { nome: "Sementes de abóbora", tipo: "semente", planta: "abobora", dias: 5, rende: 2, ic: "semente" },
  s_alface: { nome: "Sementes de alface", tipo: "semente", planta: "alface", dias: 1, rende: 3, ic: "semente" },
  pano: { nome: "Panos limpos", tipo: "recurso", ic: "material", desc: "Para fazer bandagens." },
  ervas: { nome: "Ervas medicinais", tipo: "recurso", ic: "horta", desc: "Para fazer remédios." },
  virote: { nome: "Virotes", tipo: "recurso", ic: "municao", desc: "Flechas da besta. Não fazem barulho." },
  faca: { nome: "Faca improvisada", tipo: "arma", ic: "caca", desc: "Dá para lutar sem gastar munição." },
  espingarda: { nome: "Espingarda de cano duplo", tipo: "arma", ic: "municao", desc: "Dois tiros de uma vez: gasta metade da munição." },
  rifle: { nome: "Rifle com mira", tipo: "arma", ic: "municao", desc: "Metade da munição e menos barulho." },
  besta: { nome: "Besta", tipo: "arma", ic: "caca", desc: "Usa virotes. Silenciosa: não atrai inimigos." },
});
GRUPOS_MOCHILA.splice(3, 0, ["arma", "Armas"]);

/* desenhos coloridos dos itens (inventário) */
const DESENHO = {
  cenoura: '<path d="M8 25L22 9l3 3L9 26z" fill="#e8822a"/><path d="M22 9l4-6M23 10l6-3M21 8l1-6" stroke="#5aa03a" stroke-width="2.2"/><path d="M13 19l2 2M17 15l2 2" stroke="#b85a1a" stroke-width="1.4"/>',
  cebola: '<path d="M16 6c-1 4-9 7-9 14a9 7 0 0 0 18 0c0-7-8-10-9-14z" fill="#e0c592"/><path d="M16 6v-3" stroke="#7aa04a" stroke-width="2"/><path d="M12 14c-2 3-2 8 0 11M20 14c2 3 2 8 0 11" stroke="#b8975a" stroke-width="1.2" fill="none"/>',
  batata: '<ellipse cx="16" cy="17" rx="11" ry="8" fill="#b08858"/><circle cx="11" cy="15" r="1" fill="#6a4a2a"/><circle cx="19" cy="19" r="1" fill="#6a4a2a"/><circle cx="21" cy="13" r="1" fill="#6a4a2a"/>',
  milho: '<ellipse cx="16" cy="16" rx="6" ry="11" fill="#f0c840"/><path d="M10 26c-4-6-3-14 2-20M22 26c4-6 3-14-2-20" stroke="#6aa03a" stroke-width="2.4" fill="none"/>',
  beterraba: '<circle cx="16" cy="19" r="8" fill="#8a1a40"/><path d="M16 27v3M16 11l-4-8M16 11l4-8" stroke="#5a8a3a" stroke-width="2"/>',
  tomate: '<circle cx="16" cy="18" r="10" fill="#d8322a"/><path d="M11 9l5 3 5-3-3 4h-4z" fill="#3a8a2a"/><ellipse cx="12" cy="15" rx="2" ry="1.5" fill="#ff8a7a"/>',
  abobora: '<ellipse cx="16" cy="19" rx="13" ry="9" fill="#e07a1a"/><path d="M16 10v18M9 11c-2 5-2 11 0 16M23 11c2 5 2 11 0 16" stroke="#b05a10" stroke-width="1.4" fill="none"/><path d="M16 10l2-5" stroke="#5a7a2a" stroke-width="2.4"/>',
  alface: '<path d="M16 6c-8 2-11 9-9 16 5 5 13 5 18 0 2-7-1-14-9-16z" fill="#7ac04a"/><path d="M16 9v17M11 13l5 6 5-6" stroke="#4a8a2a" stroke-width="1.4" fill="none"/>',
  enlatado: '<rect x="8" y="6" width="16" height="21" rx="2" fill="#9aa4ac"/><rect x="8" y="11" width="16" height="10" fill="#c8402a"/><path d="M8 8h16M8 25h16" stroke="#6a747c" stroke-width="1.5"/><circle cx="16" cy="16" r="3" fill="#f0d070"/>',
  racao: '<rect x="6" y="8" width="20" height="17" rx="2" fill="#5a6a3a"/><rect x="10" y="12" width="12" height="6" fill="#d8d0a8"/><path d="M6 11h20" stroke="#3a4a24" stroke-width="1.5"/>',
  pao: '<path d="M5 20c0-8 22-8 22 0v3H5z" fill="#4a2e18"/><path d="M10 15l2 3M16 14v4M22 15l-2 3" stroke="#2a1a0c" stroke-width="1.4"/>',
  peixe: '<path d="M4 16c6-8 16-8 20 0-4 8-14 8-20 0z" fill="#8aa4b8"/><path d="M24 16l5-5v10z" fill="#6a8498"/><circle cx="9" cy="15" r="1.4" fill="#1a2a3a"/>',
  carne: '<path d="M8 22c-4-8 4-16 12-14s8 10 2 14-10 6-14 0z" fill="#a83a2a"/><path d="M12 12c3 2 6 2 8 6" stroke="#e8a090" stroke-width="2" fill="none"/><path d="M22 22l5 5" stroke="#e8e0d0" stroke-width="3"/>',
  javali: '<path d="M8 22c-4-8 4-16 12-14s8 10 2 14-10 6-14 0z" fill="#7a3a2a"/><path d="M12 12c3 2 6 2 8 6" stroke="#b8e05a" stroke-width="2" fill="none"/><circle cx="24" cy="9" r="3" fill="#b8e05a" opacity=".7"/>',
  cogumelo: '<path d="M4 15c0-7 24-7 24 0z" fill="#b8e05a"/><rect x="13" y="15" width="6" height="11" rx="2" fill="#e8e0c8"/><circle cx="10" cy="12" r="1.6" fill="#f8f8e8"/><circle cx="20" cy="11" r="1.6" fill="#f8f8e8"/>',
  bandagem: '<circle cx="14" cy="16" r="9" fill="#f0ece2"/><circle cx="14" cy="16" r="3.5" fill="#c8c0b0"/><path d="M22 18l7 4-2 3-7-4z" fill="#f0ece2"/>',
  remedio: '<rect x="9" y="9" width="14" height="18" rx="3" fill="#e8a02a"/><rect x="8" y="5" width="16" height="5" rx="1.5" fill="#f0ece2"/><rect x="11" y="15" width="10" height="7" fill="#f8f4ea"/><path d="M16 16v5M13.5 18.5h5" stroke="#d8322a" stroke-width="1.6"/>',
  kit: '<rect x="4" y="9" width="24" height="17" rx="3" fill="#d8322a"/><path d="M12 9V6h8v3" stroke="#a82020" stroke-width="2" fill="none"/><path d="M16 12v11M10.5 17.5h11" stroke="#fff" stroke-width="3.4"/>',
  iodo: '<rect x="5" y="9" width="22" height="14" rx="3" fill="#c8ccd0"/><circle cx="11" cy="16" r="3" fill="#e8d84a"/><circle cx="21" cy="16" r="3" fill="#e8d84a"/><path d="M16 10v12" stroke="#9aa0a8"/>',
  vodka: '<path d="M13 4h6v6l3 4v14H10V14l3-4z" fill="#cfe0e8" opacity=".9"/><rect x="10" y="17" width="12" height="6" fill="#d8322a"/><rect x="13" y="3" width="6" height="3" fill="#5a6a7a"/>',
  material: '<rect x="3" y="9" width="26" height="5" rx="1" fill="#a87a48"/><rect x="5" y="16" width="24" height="5" rx="1" fill="#8a603a"/><rect x="3" y="23" width="22" height="4" rx="1" fill="#a87a48"/><circle cx="7" cy="11.5" r="1" fill="#3a3a3a"/><circle cx="25" cy="18.5" r="1" fill="#3a3a3a"/>',
  municao: '<path d="M8 27V13l2-6 2 6v14zM15 27V13l2-6 2 6v14zM22 27V13l2-6 2 6v14z" fill="#d8a83a"/><path d="M8 22h4M15 22h4M22 22h4" stroke="#8a6a1a" stroke-width="2"/>',
  sucata: '<circle cx="12" cy="14" r="7" fill="#7a8088"/><circle cx="12" cy="14" r="2.5" fill="#3a3e44"/><path d="M12 5v3M12 20v3M3 14h3M18 14h3" stroke="#7a8088" stroke-width="3"/><rect x="17" y="19" width="11" height="7" rx="1" fill="#a86a3a"/>',
  filtro: '<circle cx="16" cy="16" r="10" fill="#3a4a3a"/><circle cx="16" cy="16" r="6" fill="#5a6a5a"/><path d="M12 16h8M16 12v8" stroke="#2a342a" stroke-width="1.6"/><rect x="13" y="3" width="6" height="4" fill="#5a5a5a"/>',
  artefato: '<path d="M16 3l8 12-8 14-8-14z" fill="#a8f0e0"/><path d="M16 3l3 12-3 14-3-14z" fill="#e8fff8" opacity=".8"/><circle cx="16" cy="15" r="13" fill="#a8f0e0" opacity=".15"/>',
  pecas: '<rect x="5" y="8" width="22" height="16" rx="2" fill="#2a6a3a"/><path d="M9 12h6M9 16h10M9 20h4M20 12v8" stroke="#d8c84a" stroke-width="1.6"/><circle cx="22" cy="12" r="1.6" fill="#c8c8c8"/>',
  geiger: '<rect x="5" y="9" width="17" height="17" rx="3" fill="#d8c040"/><rect x="8" y="12" width="11" height="6" fill="#1a2a1a"/><path d="M9 16l2-2 2 3 2-4 2 3" stroke="#8af05a" stroke-width="1" fill="none"/><path d="M22 14h4l1 8" stroke="#3a3a3a" stroke-width="2" fill="none"/>',
  pano: '<path d="M5 9h22v15H5z" fill="#e8e4f0"/><path d="M5 13h22M5 19h22" stroke="#a8b0d0" stroke-width="1.5"/>',
  ervas: '<path d="M16 28V12" stroke="#4a7a2a" stroke-width="2"/><ellipse cx="11" cy="14" rx="5" ry="2.5" fill="#6ab04a" transform="rotate(-30 11 14)"/><ellipse cx="21" cy="12" rx="5" ry="2.5" fill="#6ab04a" transform="rotate(30 21 12)"/><ellipse cx="12" cy="21" rx="5" ry="2.5" fill="#5a9a3a" transform="rotate(-20 12 21)"/><ellipse cx="20" cy="20" rx="5" ry="2.5" fill="#5a9a3a" transform="rotate(20 20 20)"/>',
  virote: '<path d="M4 28L26 6" stroke="#8a6a3a" stroke-width="2.4"/><path d="M26 6l-6 1 5 5z" fill="#a8b0b8"/><path d="M4 28l1-6M4 28l6-1" stroke="#d8322a" stroke-width="2"/>',
  faca: '<path d="M6 26l4-4 14-16c2 4 1 9-3 13L12 26z" fill="#c8ccd2"/><rect x="3" y="23" width="9" height="4" rx="1" transform="rotate(-45 7 25)" fill="#6a4a2a"/>',
  espingarda: '<rect x="2" y="12" width="20" height="3" fill="#3a3e44"/><rect x="2" y="16" width="20" height="3" fill="#3a3e44"/><path d="M20 11h4l6 6v7h-5l-3-4h-2z" fill="#7a4a2a"/><circle cx="3" cy="13.5" r="1" fill="#111"/><circle cx="3" cy="17.5" r="1" fill="#111"/>',
  rifle: '<rect x="1" y="14" width="22" height="3" fill="#2a2e34"/><rect x="9" y="9" width="10" height="3" rx="1.5" fill="#1a1e24"/><path d="M21 13h4l6 5v5h-5l-3-3h-2z" fill="#6a4a2a"/><path d="M14 17v4" stroke="#2a2e34" stroke-width="2"/>',
  besta: '<path d="M6 8c6 4 14 4 20 0" stroke="#6a4a2a" stroke-width="3" fill="none"/><path d="M6 8l10 6 10-6" stroke="#e8e0d0" stroke-width="1"/><rect x="14" y="10" width="4" height="18" fill="#7a5a32"/><path d="M16 4v10" stroke="#a8b0b8" stroke-width="2"/>',
};
DESENHO.s_cenoura = DESENHO.s_cebola = DESENHO.s_batata = DESENHO.s_milho = DESENHO.s_beterraba = DESENHO.s_tomate = DESENHO.s_abobora = DESENHO.s_alface = null;
function desenhoItem(id) {
  const it = ITENS[id] || {};
  if (it.tipo === "semente") { // pacotinho de sementes com a planta desenhada
    const p = DESENHO[it.planta] || "";
    return `<svg class="di" viewBox="0 0 32 32"><rect x="5" y="3" width="22" height="27" rx="2" fill="#e8dcc0"/><rect x="5" y="3" width="22" height="5" fill="#b8a880"/><g transform="translate(7 8) scale(.56)">${p}</g><circle cx="10" cy="26" r="1" fill="#6a5a3a"/><circle cx="14" cy="27" r="1" fill="#6a5a3a"/><circle cx="18" cy="26" r="1" fill="#6a5a3a"/></svg>`;
  }
  return `<svg class="di" viewBox="0 0 32 32">${DESENHO[id] || '<circle cx="16" cy="16" r="9" fill="#5a6070"/>'}</svg>`;
}

/* ---------- mapas ---------- */
const TIPOS_LUGAR = {
  armas: { nome: "Armas", conserto: { material: 10, sucata: 6 }, desc: "Conserte para fabricar armas." },
  agro: { nome: "Agropecuária", conserto: { material: 6, sucata: 3 }, desc: "Conserte para conseguir sementes novas." },
  hospital: { nome: "Hospital", conserto: { material: 8, sucata: 5 }, desc: "Conserte para fabricar remédios." },
  mercado: { nome: "Mercado", desc: "Sempre tem alguém vendendo." },
  terreno: { nome: "Terreno", obra: { material: 15, sucata: 6 }, desc: "Construa uma casa nova aqui." },
};
const MAPAS = {
  zumbi: {
    cidade: { x: .3, y: .32 }, floresta: { x: .8, y: .22 }, fazenda: { x: .72, y: .72 }, presidio: { x: .2, y: .78 },
    armas_z: { x: .4, y: .24, tipo: "armas", nome: "Loja de armas do centro", cena: "loja_armas" },
    hospital_z: { x: .26, y: .52, tipo: "hospital", nome: "Hospital regional", cena: "hospital" },
    agro_z: { x: .62, y: .64, tipo: "agro", nome: "Agropecuária da BR", cena: "agro" },
    mercado_z: { x: .5, y: .45, tipo: "mercado", nome: "Feira do viaduto", cena: "feira" },
    terreno_lago: { x: .58, y: .28, tipo: "terreno", nome: "Terreno do lago", cena: "terreno" },
    terreno_hosp: { x: .16, y: .55, tipo: "terreno", nome: "Terreno ao lado do hospital", cena: "terreno" },
  },
  cherno: {
    pripyat: { x: .64, y: .3 }, kopachi: { x: .42, y: .48 }, bunker: { x: .16, y: .2 }, vermelha: { x: .4, y: .24 },
    armas_c: { x: .24, y: .3, tipo: "armas", nome: "Depósito militar Chernobyl-2", cena: "deposito" },
    hospital_c: { x: .72, y: .36, tipo: "hospital", nome: "Hospital nº 126", cena: "hospital" },
    agro_c: { x: .52, y: .58, tipo: "agro", nome: "Kolkhoz Yanov", cena: "agro" },
    mercado_c: { x: .3, y: .62, tipo: "mercado", nome: "Posto do comerciante", cena: "feira" },
    terreno_rio: { x: .78, y: .58, tipo: "terreno", nome: "Margem do rio Pripyat", cena: "terreno" },
    terreno_hosp_c: { x: .8, y: .26, tipo: "terreno", nome: "Clareira perto do hospital", cena: "terreno" },
  },
};
// cada lugar especial vira um "local" do modo (assim vasculhar, energia e desenho funcionam igual)
for (const [modo, mapa] of Object.entries(MAPAS)) for (const [id, m] of Object.entries(mapa)) {
  if (!m.tipo) { MODOS[modo].locais[id].abrigo = true; continue; }
  const ch = modo === "cherno", lot = {
    armas: [lt("municao", 1, 3), lt("sucata", 1, 3), lt("material", 0, 2)],
    hospital: [lt("pano", 1, 3), lt("ervas", 0, 2, .5), lt(ch ? "iodo" : "bandagem", 0, 1, .6), lt("remedio", 0, 1, .3)],
    agro: [lt("s_tomate", 1, 1, .3), lt("s_alface", 1, 1, .35), lt("ervas", 1, 2, .5), lt("material", 0, 2)],
    mercado: [lt("sucata", 1, 3), lt("pano", 0, 2), lt("enlatado", 0, 1, .5)],
    terreno: [lt("material", 1, 3), lt("ervas", 0, 1, .4)],
  }[m.tipo];
  MODOS[modo].locais[id] = { nome: m.nome, cor: MODOS[modo].cor, base: m.nome, canteiros: 0, ic: "porta", especialLugar: m.tipo, cena: m.cena,
    desc: TIPOS_LUGAR[m.tipo].desc, ini: { defesa: 0, inv: {} }, perigo: ch ? 1.05 : 1, radBase: ch ? 3 : 0,
    lugares: [{ nome: "Arredores", desc: "Procurar por perto", risco: .4, rad: ch ? 10 : 0, cena: ch ? "pripyat" : "rua", loot: lot }] };
}
// panos e ervas aparecem também nos lugares antigos
[["zumbi", "cidade", 1], ["zumbi", "floresta", 3], ["zumbi", "fazenda", 0], ["cherno", "kopachi", 2], ["cherno", "pripyat", 1]].forEach(([m, l, i]) => {
  const lug = MODOS[m].locais[l].lugares[i]; lug.loot.push(l === "cidade" || l === "pripyat" ? lt("pano", 1, 2, .6) : lt("ervas", 1, 2, .6));
});
const RECEITAS = {
  armas: [
    { faz: "faca", n: 1, usa: { material: 1, sucata: 2 } },
    { faz: "espingarda", n: 1, usa: { material: 3, sucata: 5 } },
    { faz: "rifle", n: 1, usa: { material: 2, sucata: 7, pecas: 1 } },
    { faz: "besta", n: 1, usa: { material: 4, sucata: 3 } },
    { faz: "virote", n: 5, usa: { material: 2 } },
    { faz: "municao", n: 4, usa: { sucata: 3 } } ],
  hospital: [
    { faz: "bandagem", n: 2, usa: { pano: 2 } },
    { faz: "remedio", n: 1, usa: { ervas: 2, sucata: 1 } },
    { faz: "kit", n: 1, usa: { bandagem: 2, remedio: 1 } },
    { faz: "iodo", n: 2, usa: { ervas: 1, sucata: 2 }, so: "cherno" } ],
  agro: [
    { faz: "s_tomate", n: 2, usa: { sucata: 2 } }, { faz: "s_abobora", n: 2, usa: { sucata: 3 } }, { faz: "s_alface", n: 3, usa: { sucata: 1 } },
    { faz: "s_cenoura", n: 3, usa: { cenoura: 1 } }, { faz: "s_batata", n: 3, usa: { batata: 1 } }, { faz: "s_milho", n: 3, usa: { milho: 1 } },
    { faz: "s_beterraba", n: 3, usa: { beterraba: 1 } }, { faz: "s_tomate", n: 4, usa: { tomate: 1 } } ],
};
// objetivos novos (os 3 primeiros ativos aparecem por vez)
const objExtra = [
  { t: "Viaje para outro lugar do mapa", ok: s => (s.st.viagens || 0) >= 1, premio: { enlatado: 1 } },
  { t: "Conserte a loja de armas", ok: s => !!(s.consertos || {})[s.modo === "cherno" ? "armas_c" : "armas_z"], premio: { municao: 6 } },
  { t: "Fabrique uma espingarda de cano duplo", ok: s => (s.inv.espingarda || 0) >= 1, premio: { municao: 8 } },
  { t: "Conserte a agropecuária", ok: s => !!(s.consertos || {})[s.modo === "cherno" ? "agro_c" : "agro_z"], premio: { s_abobora: 2 } },
  { t: "Conserte o hospital", ok: s => !!(s.consertos || {})[s.modo === "cherno" ? "hospital_c" : "hospital_z"], premio: { kit: 1 } },
  { t: "Fabrique um kit médico", ok: s => (s.st.kits || 0) >= 1, premio: { pano: 3 } },
  { t: "Construa uma casa nova num terreno", ok: s => Object.keys(s.casas || {}).length >= 2, premio: { material: 6 } },
  { t: "Colha uma abóbora", ok: s => (s.st.abobora || 0) >= 1, premio: { s_abobora: 1, s_tomate: 2 } },
];
MODOS.zumbi.objetivos.splice(3, 0, ...objExtra);
MODOS.cherno.objetivos.splice(3, 0, ...objExtra.map(o => ({ ...o, t: o.t.replace("loja de armas", "depósito militar") })));

/* ---------- utilidades do mundo ---------- */
const lugarAqui = () => MAPAS[SOB.modo][SOB.pos] || {};
const tipoAqui = () => lugarAqui().tipo || null;
const consertado = id => !!(SOB.consertos || {})[id];
const ehCasa = () => !!(SOB.casas || {})[SOB.pos];
function diasAte(dest) {
  const a = MAPAS[SOB.modo][SOB.pos], b = MAPAS[SOB.modo][dest]; if (!a || !b) return 1;
  const d = Math.hypot(a.x - b.x, a.y - b.y);
  return d < .17 ? 0 : d < .42 ? 1 : 2;
}
function temTudo(req) { return Object.entries(req).every(([k, v]) => qtd(k) >= v); }
function gastaTudo(req) { for (const [k, v] of Object.entries(req)) sobMuda(k, -v, false); }
const listaReq = req => Object.entries(req).map(([k, v]) => `<span class="${qtd(k) >= v ? "tem" : "falta"}">${qtd(k)}/${v} ${ITENS[k].nome.toLowerCase()}</span>`).join(" ");
function migrarMundo() {
  if (SOB.pos) return;
  SOB.pos = SOB.local; SOB.casas = { [SOB.local]: { defesa: SOB.defesa, horta: SOB.horta } }; SOB.consertos = {}; SOB.st.viagens = 0;
}
function sairDaqui() { if (ehCasa()) SOB.casas[SOB.pos] = { defesa: SOB.defesa, horta: SOB.horta }; }
function chegarEm(dest) {
  SOB.pos = dest; SOB.local = dest;
  const c = SOB.casas[dest];
  if (c) { SOB.defesa = c.defesa; SOB.horta = c.horta; } else { SOB.defesa = 5; SOB.horta = []; }
}

/* ---------- armas nos combates ---------- */
const armaTiro = () => qtd("rifle") ? "rifle" : qtd("espingarda") ? "espingarda" : null;
function custoTiro(n) { const a = armaTiro(); return a ? Math.ceil(n / 2) : n; }

/* ---------- ambiente do clima (corrige o som de chuva com céu limpo) ---------- */
function sobAmbiente(noite) {
  if (!SOB) return;
  const chove = SOB.clima === "chuva";
  setVer(chove ? ["chuva"] : []);
  setAmb({ drone: noite ? .9 : .35 + SOB.gasta * .1, vento: chove ? .5 : .35, chuva: chove ? (noite ? .8 : .7) : 0, fogo: 0, motor: 0, estatica: 0, agua: 0, zumbido: 0 });
}
function sobLigarCena(c) { sobCena = c; cineAtual = { def: CINE.sobrevivencia, p: {}, dur: 0, chave: "sob" + Math.random(), t0: performance.now(), vel: 1, fim: null }; sobAmbiente(c && c.noite); }

/* ---------- o dia (com viagens e lugares) ---------- */
function sobDia(msg) {
  if (!SOB) return;
  migrarMundo();
  fecharPainel(); sobChecarObjetivos(); sobGravar(); sobHud(); sobLigarCena({ tipo: "base" });
  const l = L(), sem = SOB.energia <= 0, tipo = tipoAqui();
  const frase = ["O dia nasce cinza.", "O sol está alto.", "A tarde avança.", "O céu começa a escurecer.", "Logo vai anoitecer."][Math.min(4, SOB.gasta)];
  const onde = ehCasa() ? l.base + "." : tipo ? `${l.nome}.` : `${l.nome}. Você está longe de casa: aqui só dá para acampar.`;
  sobTexto(msg || (sem ? `Você está exausto. Não dá para fazer mais nada hoje.` : `${onde} ${frase} ${SOB.clima === "emissao" ? "<span class='msg'>O rádio avisa: emissão chegando esta noite.</span>" : ""}`), !!msg);
  const b = [];
  if (!sem) {
    b.push({ t: "Vasculhar", sub: "Buscar suprimentos", icone: "busca", custo: 1, on: sobEscolherLugar });
    if (tipo && TIPOS_LUGAR[tipo].conserto && !consertado(SOB.pos)) b.push({ t: "Consertar", sub: "Precisa de materiais", icone: "martelo", custo: 1, cls: "dourado", on: abrirConserto });
    else if (tipo && RECEITAS[tipo]) b.push({ t: tipo === "agro" ? "Sementes" : "Fabricar", sub: tipo === "armas" ? "Armas e munição" : tipo === "hospital" ? "Bandagens, remédios, kits" : "Comprar e separar sementes", icone: tipo === "agro" ? "semente" : "martelo", cls: "dourado", on: abrirFabricar });
    else if (tipo === "mercado") b.push({ t: "Negociar", sub: "Mercadores sempre aqui", icone: "sucata", custo: 1, cls: "dourado", on: () => { sobGastar(); sobMercador(); } });
    else if (tipo === "terreno" && !ehCasa()) b.push({ t: "Construir casa", sub: "Casa nova com horta", icone: "porta", custo: 1, cls: "dourado", on: abrirObra });
    else if (!ehCasa() && l.abrigo) b.push({ t: "Ocupar abrigo", sub: "6 materiais · vira sua casa", icone: "porta", custo: 1, cls: "dourado", desat: qtd("material") < 6, on: ocuparAbrigo });
    else b.push({ t: "Fortificar", sub: ehCasa() ? (qtd("material") >= 2 ? "2 materiais · +12 defesa" : "Sem materiais: +4") : "Barricada de acampamento", icone: "martelo", custo: 1, on: sobFortificar });
    if (l.especial && ehCasa()) b.push({ t: l.especial.nome, sub: l.especial.desc, icone: l.especial.ic, custo: 1, on: sobEspecial });
    else b.push({ t: "Descansar", sub: "+12 saúde", icone: "cama", custo: 1, on: sobDescansar });
    b.push({ t: "Viajar", sub: "Abrir o mapa", icone: "objetivo", on: abrirMapa });
  }
  const prontas = (SOB.horta || []).filter(c => c && c.dias <= 0).length;
  b.push({ t: "Mochila", sub: prontas ? `${prontas} para colher` : "Comer, plantar, curar", icone: "mochila", cls: "mini" + (prontas ? " alerta" : ""), on: () => abrirMochila() });
  b.push({ t: "Objetivos", sub: `${SOB.obj.length}/${M().objetivos.length}`, icone: "objetivo", cls: "mini", on: abrirObjetivos });
  b.push({ t: "Dormir", sub: sem ? "Passar a noite" : "Encerrar o dia", icone: "lua", cls: sem ? "destaque" : "mini", on: sobNoite });
  sobBotoes(b);
}

/* ---------- mapa e viagem ---------- */
function abrirMapa() {
  sobLigarCena({ tipo: "mapa" });
  const mapa = MAPAS[SOB.modo];
  const itens = Object.entries(mapa).filter(([id]) => id !== SOB.pos).map(([id, m]) => {
    const l = M().locais[id], d = diasAte(id), tipo = m.tipo, casa = SOB.casas[id];
    const estado = casa ? "Sua casa" : tipo && TIPOS_LUGAR[tipo].conserto ? (consertado(id) ? "Consertado" : "Precisa de conserto") : tipo === "terreno" ? "Terreno livre" : tipo === "mercado" ? "Mercado" : tipo === "saque" ? (l.abrigo ? "Saque · dá pra morar" : "Saque") : "Abrigo abandonado";
    return { id, d, l, estado, casa };
  }).sort((a, b) => a.d - b.d);
  sobTexto("Para onde você vai? Viagens longas passam dias na estrada, com fome e perigo.", false);
  sobBotoes([...itens.map(o => ({ t: o.l.nome, sub: `${o.d ? o.d + (o.d > 1 ? " dias" : " dia") + " de viagem" : "Perto · mesmo dia"} · ${o.estado}`, icone: o.casa ? "porta" : "objetivo", cls: "local" + (o.casa ? " casa" : ""), desat: o.d === 0 && SOB.energia < 1, on: () => viajar(o.id, o.d) })),
    { t: "Voltar", icone: "porta", cls: "mini", on: () => sobDia() }]);
}
function viajar(dest, dias) {
  const l = M().locais[dest];
  sairDaqui(); SOB.st.viagens = (SOB.st.viagens || 0) + 1;
  if (dias === 0) {
    sobGastar(); tocar("passos");
    return sobFazer("viajar", 2800, () => { chegarEm(dest); sobGravar(); sobDia(`Você chega: ${l.nome}.`); }, { destino: dest, dias: 0 });
  }
  let dia = 0; const eventos = [];
  const passo = () => {
    dia++;
    sobMuda("fome", -25, false); if (SOB.fome <= 0) sobMuda("saude", -12, false);
    if (M().radiacao) sobMuda("rad", 6, false);
    // as hortas de todas as casas continuam crescendo
    Object.values(SOB.casas).forEach(c => (c.horta || []).forEach(h => { if (h && h.dias > 0) h.dias--; }));
    const r = Math.random();
    if (r < .3) { const d = sobRnd(6, 16); sobMuda("saude", -d, false); eventos.push(M().radiacao ? `No ${dia}º dia, cães mutantes atacam o acampamento (−${d} saúde).` : `No ${dia}º dia, zumbis cercam o acampamento (−${d} saúde).`); }
    else if (r < .55) { const a = sobLoot(M().radiacao ? [lt("enlatado", 0, 1), lt("filtro", 0, 1), lt("sucata", 1, 2)] : [lt("enlatado", 0, 1), lt("sucata", 1, 2), lt("material", 0, 2)]); eventos.push(`No ${dia}º dia, um carro abandonado na estrada: ${a}.`); }
    else eventos.push(`No ${dia}º dia, a estrada fica em silêncio.`);
    SOB.dia++;
  };
  sobFazer("viagem", 2600 + dias * 2200, () => {
    for (let i = 0; i < dias; i++) passo();
    chegarEm(dest); SOB.gasta = 0; SOB.energia = Math.max(1, energiaMax() - 1);
    try { if (SOB.dia > sobRecorde(SOB.modo)) localStorage.setItem("pv_rec_" + SOB.modo, SOB.dia); } catch (e) {}
    sobHud(); sobGravar();
    if (sobFim()) return;
    sobDia(`${eventos.join(" ")} Você chega: <em>${l.nome}</em>.`);
  }, { destino: dest, dias });
}

/* ---------- consertar, construir, ocupar ---------- */
function abrirConserto() {
  const req = TIPOS_LUGAR[tipoAqui()].conserto, ok = temTudo(req);
  painel("Consertar", `<p class="pn-sub">${L().nome}. Para voltar a funcionar, você precisa de:</p><div class="pn-req">${listaReq(req)}</div>` +
    `<p class="pn-sub">${{ armas: "Depois de consertado, dá para fabricar armas e munição aqui.", agro: "Depois de consertada, dá para comprar e separar sementes, inclusive tomate, abóbora e alface.", hospital: "Depois de consertado, dá para fazer bandagens, remédios e kits médicos." }[tipoAqui()]}</p>` +
    `<button type="button" class="pn-grande" id="btnConsertar" ${ok && SOB.energia > 0 ? "" : "disabled"}>${ok ? "Consertar (1 de energia)" : "Faltam materiais"}</button>`);
  $s("btnConsertar").addEventListener("click", () => {
    gastaTudo(req); sobGastar(); SOB.consertos[SOB.pos] = true; repetir(() => tocar("toque"), 380, .2, 7);
    sobFazer("consertar", 3000, () => { tocar("sucesso"); sobDia(`Você troca as peças, prega, solda e limpa. ${L().nome} voltou a funcionar.`); });
  });
}
function abrirObra() {
  const req = TIPOS_LUGAR.terreno.obra, ok = temTudo(req);
  painel("Construir casa", `<p class="pn-sub">${L().nome}. Uma casa aqui tem defesa própria, 3 canteiros de horta e deixa os lugares de perto a menos de um dia de viagem.</p><div class="pn-req">${listaReq(req)}</div>` +
    `<button type="button" class="pn-grande" id="btnObra" ${ok && SOB.energia > 0 ? "" : "disabled"}>${ok ? "Construir (1 de energia)" : "Faltam materiais"}</button>`);
  $s("btnObra").addEventListener("click", () => {
    gastaTudo(req); sobGastar(); SOB.casas[SOB.pos] = { defesa: 25, horta: [null, null, null] }; chegarEm(SOB.pos); repetir(() => tocar("toque"), 380, .2, 8);
    sobFazer("construir", 3400, () => { tocar("sucesso"); sobDia("Paredes de pé, telhado no lugar, uma porta que tranca. Você tem uma casa nova."); });
  });
}
function ocuparAbrigo() {
  sobMuda("material", -6, false); sobGastar(); SOB.casas[SOB.pos] = { defesa: 18, horta: Array(Math.max(1, L().canteiros || 2)).fill(null) }; chegarEm(SOB.pos);
  sobFazer("fortificar", 2300, () => sobDia(`Você limpa o lugar, prega as janelas e acende o fogo. ${L().base} agora é uma das suas casas.`));
}
function abrirFabricar() {
  const tipo = tipoAqui(), lista = RECEITAS[tipo].filter(r => !r.so || r.so === SOB.modo);
  painel(tipo === "agro" ? "Sementes" : "Fabricar", `<p class="pn-sub">${L().nome}. Fabricar não gasta energia.</p>` + lista.map((r, i) => {
    const it = ITENS[r.faz], ok = temTudo(r.usa);
    return `<div class="pn-item">${desenhoItem(r.faz)}<div class="pn-it"><b>${r.n > 1 ? r.n + " " : ""}${it.nome} <span>tem ${qtd(r.faz)}</span></b><small>${it.desc || ""}</small><small class="pn-req">${listaReq(r.usa)}</small></div><button type="button" data-rec="${i}" ${ok ? "" : "disabled"}>${tipo === "agro" && r.usa.sucata ? "Comprar" : "Fazer"}</button></div>`;
  }).join(""));
  $s("sobPainel").querySelectorAll("[data-rec]").forEach(bt => bt.addEventListener("click", () => {
    const r = lista[+bt.dataset.rec]; gastaTudo(r.usa); sobMuda(r.faz, r.n, false); if (r.faz === "kit") SOB.st.kits = (SOB.st.kits || 0) + 1;
    repetir(() => tocar("toque"), 380, .2, 4);
    sobFazer("fabricar", 2200, () => { tocar("item"); sobChecarObjetivos(); sobHud(); sobGravar(); sobDia(`Pronto: ${r.n > 1 ? r.n + " " : ""}${ITENS[r.faz].nome.toLowerCase()}.`); abrirFabricar(); }, { item: r.faz });
  }));
}

/* ---------- combates com armas ---------- */
function sobEncontro(g) {
  const n = sobRnd(1, Math.min(5, 1 + Math.floor(SOB.dia / 4))), mut = M().inimigo === "mutante";
  sobLigarCena({ tipo: "lugar", cena: g.cena, zumbis: mut ? 0 : n, inimigos: mut ? Math.min(3, n) : 0, rad: g.rad });
  tocar(mut ? "criaturaSom" : "gemido"); vibrar(120);
  const quem = mut ? (n > 1 ? `${n} cães mutantes, sem pelo, com olhos verdes,` : "Um cão mutante, sem pelo, com olhos verdes,") : (n > 1 ? `${n} zumbis` : "Um zumbi");
  sobTexto(`${quem} ${n > 1 ? "aparecem" : "aparece"} e ${n > 1 ? "vêm" : "vem"} na sua direção.`);
  const volta = () => sobFim() || sobBotoes([{ t: "Voltar", icone: "porta", cls: "destaque", on: () => sobDia() }]);
  const venceu = (txt, barulho) => { const a = sobLoot(g.loot, 1.2); sobChecarObjetivos(); sobHud(); sobTexto(`${txt} Você pega o que veio buscar: <em>${a}</em>.${barulho ? " O barulho atrai mais deles para perto." : ""}`); if (barulho) SOB.barulho = (SOB.barulho || 0) + 1; volta(); };
  const arma = armaTiro(), custo = custoTiro(n), b = [];
  b.push({ t: arma ? `Atirar · ${ITENS[arma].nome.split(" ")[0]}` : "Atirar", sub: `Gasta ${custo} munição · tem ${qtd("municao")}${arma === "espingarda" ? " · 2 por tiro" : ""}`, icone: "municao", desat: qtd("municao") < custo, on: () => {
    sobMuda("municao", -custo); tocar("impacto"); if (arma === "espingarda") setTimeout(() => tocar("impacto"), 120); tremer(0, .3);
    sobFazer("atirar", 1500, () => venceu(arma === "espingarda" ? "Os dois canos disparam juntos e derrubam dois de uma vez." : arma === "rifle" ? "Tiros precisos, um por um." : "Os tiros ecoam longe.", arma !== "rifle"), { arma: arma || "pistola", n, mut }); } });
  if (qtd("besta") && qtd("virote") >= n) b.push({ t: "Besta", sub: `Gasta ${n} virotes · silenciosa`, icone: "caca", on: () => { sobMuda("virote", -n); sobFazer("atirar", 1500, () => venceu("Os virotes voam sem barulho nenhum.", false), { arma: "besta", n, mut }); } });
  if (qtd("faca")) b.push({ t: "Lutar com a faca", sub: "Sem munição · arriscado", icone: "caca", on: () => { const ok = sobChance(.55 + SOB.grupo.length * .08 - n * .05); sobFazer("faca", 1500, () => { if (ok) venceu("Golpe certeiro. Silêncio.", false); else { sobMuda("saude", -sobRnd(10, 20)); sobHud(); sobTexto("Você erra o golpe e leva uma mordida de raspão antes de fugir."); volta(); } }, { n, mut }); } });
  b.push({ t: "Se esconder", sub: "Segure quando olharem", icone: "busca", on: () => sobMiniEsconder(n, mut, ok => { if (ok) { const a = sobLoot(g.loot, .8); sobChecarObjetivos(); sobTexto(`Eles passam sem te ver. Quando somem, você pega <em>${a}</em>.`); } else { sobMuda("saude", -sobRnd(18, 30)); const m = !mut && sobChance(.25); if (m) SOB.mordido = SOB.dia; sobTexto(`${mut ? "Os dentes rasgam sua perna" : "Um deles te agarra pelo braço"}. Você se solta e foge, sangrando. ${m ? "<span class='msg'>Tem uma marca de dente no seu braço. Use um remédio.</span>" : ""}`); } sobHud(); volta(); }) });
  b.push({ t: "Fugir", sub: "Volta sem nada", icone: "porta", on: () => { if (sobChance(.75)) sobTexto("Você corre sem olhar para trás."); else { sobMuda("saude", -sobRnd(8, 15)); sobTexto("Na fuga, você cai e se corta feio."); } sobHud(); volta(); } });
  sobBotoes(b);
}
function sobHorda(pos) {
  const n = sobRnd(3, 6 + Math.floor(SOB.dia / 2)), mut = M().inimigo === "mutante";
  tocar("batidas"); tocar(mut ? "criaturaSom" : "gemido"); vibrar(300);
  const forca = n * 9, segura = SOB.defesa >= forca, nome = mut ? `uma matilha de ${n} cães mutantes` : `uma horda de ${n} zumbis`;
  if (segura) { sobMuda("defesa", -Math.round(forca / 3)); sobTexto(`Você acorda com ${nome} batendo nas paredes. As barricadas aguentam, mas ficam danificadas.`); return sobBotoes([{ t: "Esperar amanhecer", icone: "lua", cls: "destaque", on: () => pos("Eles se dispersam com o sol.") }]); }
  sobMuda("defesa", -Math.round(forca / 2));
  sobTexto(`${nome[0].toUpperCase() + nome.slice(1)} ${ehCasa() ? "arrebenta a barricada" : "cerca o acampamento"}. Eles estão vindo!`);
  const a = Math.ceil(custoTiro(n) / 2), arma = armaTiro();
  sobBotoes([
    { t: arma ? `Atirar · ${ITENS[arma].nome.split(" ")[0]}` : "Atirar", sub: `Gasta ${a} munição`, icone: "municao", desat: qtd("municao") < a, on: () => { sobMuda("municao", -a); sobMuda("saude", -sobRnd(0, 8)); tocar("impacto"); sobHud(); sobFim() || pos("Você atira até o último cair."); } },
    { t: "Segurar a porta", sub: "Toque rápido!", icone: "defesa", on: () => sobMiniTocar(14 + Math.floor(n / 2), 5, ok => { sobMuda("saude", ok ? -sobRnd(0, 8) : -sobRnd(25, 40)); sobHud(); sobFim() || pos(ok ? "Você segura até eles desistirem." : "Eles te derrubam. Você luta no escuro e sobrevive, por pouco."); }) },
    { t: "Fugir", sub: "Perde metade das coisas", icone: "porta", on: () => { Object.keys(SOB.inv).forEach(k => { if (!["ferramenta", "arma"].includes(ITENS[k].tipo)) sobMuda(k, -Math.ceil(SOB.inv[k] / 2), false); }); sobHud(); pos("Você foge e volta de manhã. Metade de tudo sumiu."); } },
  ]);
}
// colheita de abóbora conta para objetivo; sementes extras do clima
const _sobAmanhecer = sobAmanhecer;
sobAmanhecer = function (msg) { _sobAmanhecer(msg); if (SOB) { sobAmbiente(false); Object.entries(SOB.casas || {}).forEach(([id, c]) => { if (id !== SOB.pos) (c.horta || []).forEach(h => { if (h && h.dias > 0) h.dias--; }); }); } };
const _sobInicio = sobInicio;
sobInicio = function (modo) {
  _sobInicio(modo);
  const m = MODOS[modo];
  sobBotoes(Object.entries(m.locais).filter(([k, l]) => !l.especialLugar).map(([k, l]) => ({ t: l.nome, sub: l.desc, icone: l.ic, cls: "local", on: () => { sobNovo(modo, k); migrarMundo(); sobDia(`Você chega: ${l.base}. Por enquanto, está vivo. Abra a mochila para ver o que trouxe, e o mapa para ver para onde dá para ir.`); } })));
};

/* ---------- mochila com desenhos ---------- */
const _abrirMochila = abrirMochila;
abrirMochila = function (msg) {
  _abrirMochila(msg);
  const p = $s("sobPainel"); if (!p) return;
  p.querySelectorAll(".pn-item").forEach(el => {
    const bt = el.querySelector("button[data-comer],button[data-plantar],button[data-usar]");
    const nome = el.querySelector(".pn-it b").firstChild.textContent.trim();
    const id = bt ? (bt.dataset.comer || bt.dataset.plantar || bt.dataset.usar) : Object.keys(ITENS).find(k => ITENS[k].nome === nome);
    const ico = el.querySelector("svg.ic"); if (id && ico) ico.outerHTML = desenhoItem(id);
  });
  if (!(SOB.horta || []).length) { const h = p.querySelector(".pn-horta"); if (h) h.outerHTML = `<p class="pn-sub">Aqui não tem horta. Plante numa das suas casas.</p>`; }
  p.querySelectorAll(".pn-can span").forEach(s => { const id = Object.keys(ITENS).find(k => ITENS[k].nome === s.textContent); if (id) s.insertAdjacentHTML("beforebegin", desenhoItem(id)); });
  p.querySelectorAll("[data-colher]").forEach(bt => bt.addEventListener("click", () => { const c = SOB.horta[+bt.dataset.colher]; if (c && c.planta === "abobora") SOB.st.abobora = (SOB.st.abobora || 0) + 1; }, { capture: true }));
};

/* ---------- cenários dos lugares ---------- */
function letreiro(txt, x, y, cor, tam, pisca = true) {
  const a = pisca && cvRnd(Math.floor(performance.now() / 180) + x) < .08 ? .2 : 1;
  ctx.fillStyle = cor.replace("A", a); ctx.font = `800 ${tam}px "Big Shoulders Display", sans-serif`; ctx.fillText(txt, x, y);
}
function entulho(x, y, n, t) { for (let i = 0; i < n; i++) { ctx.save(); ctx.translate(x + cvRnd(i) * 120 - 60, y - cvRnd(i * 3) * 6); ctx.rotate(cvRnd(i * 7) * 3); ctx.fillStyle = ["#3a3a3a", "#4a3a2a", "#2a2e34"][i % 3]; ctx.fillRect(-8, -3, 16, 6); ctx.restore(); } }
function fundoLugar(t, noite) {
  const ch = SOB.modo === "cherno", f = noite ? 1 : Math.min(.95, SOB.gasta / Math.max(3, energiaMax()) * .9);
  if (ch) chernoCeu(f, SOB.clima === "emissao"); else sobCeu(f);
  return f;
}
function desenhaEspecial(t, p) {
  const l = L(), cena = l.cena, chao = H * .6, ok = consertado(SOB.pos), casa = ehCasa(), ch = SOB.modo === "cherno";
  const f = fundoLugar(t, p.noite), luz = f > .55;
  ctx.fillStyle = ch ? "#11120e" : "#0e0f12";
  if (cena === "loja_armas" || cena === "deposito") {
    if (ch) { // hangar militar com estrela
      ctx.fillStyle = "#23261f"; ctx.beginPath(); ctx.moveTo(W * .12, chao); ctx.lineTo(W * .12, chao - H * .2); ctx.quadraticCurveTo(W * .5, chao - H * .38, W * .88, chao - H * .2); ctx.lineTo(W * .88, chao); ctx.fill();
      ctx.fillStyle = "#8a2a20"; ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = i * PI / 5 - PI / 2, r = i % 2 ? 7 : 16; ctx.lineTo(W * .5 + Math.cos(a) * r, chao - H * .25 + Math.sin(a) * r); } ctx.fill();
    } else { ctx.fillStyle = "#1e2026"; ctx.fillRect(W * .1, chao - H * .26, W * .8, H * .26); letreiro("ARMAS & CAÇA", W * .2, chao - H * .2, ok ? "rgba(242,163,58,A)" : "rgba(120,110,90,.6)", Math.min(W * .08, 34), ok); }
    const px = W * .3, pw = W * .4, ph = H * .14;
    ctx.fillStyle = ok ? "rgba(255,200,120,.25)" : "#0a0b0d"; ctx.fillRect(px, chao - ph, pw, ph);
    if (ok) { luzCor(W * .5, chao - ph * .5, pw, .3, "255,200,120"); for (let i = 0; i < 4; i++) { ctx.save(); ctx.translate(px + pw * (.15 + i * .22), chao - ph * .6); ctx.rotate(-.3); ctx.fillStyle = "#2a2e34"; ctx.fillRect(-18, -2, 36, 4); ctx.fillStyle = "#6a4a2a"; ctx.fillRect(12, -2, 10, 6); ctx.restore(); } ctx.fillStyle = "#5a3a20"; ctx.fillRect(px + pw * .1, chao - H * .035, pw * .8, H * .035); }
    else { ctx.strokeStyle = "#3a3e44"; ctx.lineWidth = 2; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(px, chao - ph + i * ph / 9 + (i > 5 ? 6 : 0)); ctx.lineTo(px + pw * (i > 5 ? .6 : 1), chao - ph + i * ph / 9); ctx.stroke(); } entulho(W * .5, chao, 7, t); }
    for (let i = 0; i < 3; i++) { ctx.fillStyle = "#3a3220"; ctx.fillRect(W * (.08 + i * .05), chao - H * .04 * (i + 1), W * .045, H * .04); }
    ctx.fillStyle = ch ? "#11120e" : "#0e0f12"; ctx.fillRect(0, chao, W, H);
  } else if (cena === "hospital") {
    ctx.fillStyle = ch ? "#24261f" : "#1c1f26"; ctx.fillRect(W * .08, chao - H * .34, W * .84, H * .34);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) { const on = ok && cvRnd(r * 9 + c) < .5; ctx.fillStyle = on ? "rgba(220,240,230,.55)" : cvRnd(r * 5 + c * 3) < .3 ? "#050607" : "#101318"; ctx.fillRect(W * (.12 + c * .11), chao - H * (.31 - r * .07), W * .07, H * .04); }
    const cr = ok ? (Math.sin(t * 2) > -.5 ? 1 : .4) : .25;
    ctx.fillStyle = `rgba(226,60,50,${cr})`; ctx.fillRect(W * .47, chao - H * .42, W * .06, H * .07); ctx.fillRect(W * .44, chao - H * .395, W * .12, H * .02);
    if (ok) luzCor(W * .5, chao - H * .385, 60, .4, "226,60,50");
    ctx.fillStyle = "#d8d8d0"; ctx.fillRect(W * .66, chao - H * .07, W * .2, H * .06); ctx.fillStyle = "#d8322a"; ctx.fillRect(W * .66, chao - H * .05, W * .2, H * .008);
    ctx.fillStyle = "#111"; [W * .7, W * .82].forEach(x => { ctx.beginPath(); ctx.arc(x, chao - H * .008, H * .012, 0, 7); ctx.fill(); });
    if (ok) luzCor(W * .76, chao - H * .075, 30, Math.sin(t * 6) > 0 ? .6 : .1, "80,120,255");
    letreiro(ch ? "БОЛЬНИЦА" : "HOSPITAL", W * .12, chao - H * .355, ok ? "rgba(230,240,235,A)" : "rgba(120,125,120,.5)", Math.min(W * .06, 24), ok);
    ctx.fillStyle = ch ? "#11120e" : "#0e0f12"; ctx.fillRect(0, chao, W, H); if (!ok) entulho(W * .3, chao + 6, 6, t);
  } else if (cena === "agro") {
    ctx.fillStyle = "#2a2418"; ctx.fillRect(W * .06, chao - H * .2, W * .42, H * .2);
    letreiro(ch ? "КОЛХОЗ" : "AGROPECUÁRIA", W * .08, chao - H * .21, ok ? "rgba(155,216,107,A)" : "rgba(110,110,90,.5)", Math.min(W * .055, 22), ok);
    for (let i = 0; i < 5; i++) { ctx.fillStyle = ["#a89a6a", "#8a7a4a"][i % 2]; ctx.beginPath(); ctx.ellipse(W * (.1 + i * .07), chao - H * .03, W * .03, H * .03, 0, 0, 7); ctx.fill(); }
    const gx = W * .55, gw = W * .4, gh = H * .17;
    ctx.fillStyle = ok ? "rgba(150,220,160,.18)" : "rgba(120,130,120,.1)"; ctx.beginPath(); ctx.moveTo(gx, chao); ctx.lineTo(gx, chao - gh * .6); ctx.quadraticCurveTo(gx + gw / 2, chao - gh * 1.3, gx + gw, chao - gh * .6); ctx.lineTo(gx + gw, chao); ctx.fill();
    ctx.strokeStyle = "rgba(200,220,200,.35)"; ctx.lineWidth = 1.5; for (let i = 0; i <= 6; i++) { ctx.beginPath(); ctx.moveTo(gx + gw * i / 6, chao); ctx.lineTo(gx + gw * i / 6, chao - gh * (.6 + .4 * Math.sin(i / 6 * PI))); ctx.stroke(); }
    if (ok) { for (let i = 0; i < 8; i++) plantinha(gx + gw * (.08 + i * .12), chao - 2, .8 + .1 * Math.sin(t + i), i % 3 ? "#5aa03a" : "#d8322a"); luzCor(gx + gw / 2, chao - gh * .4, gw * .6, .2, "190,255,160"); }
    else { ctx.strokeStyle = "#111"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(gx + gw * .3, chao - gh * .9); ctx.lineTo(gx + gw * .45, chao - gh * .5); ctx.lineTo(gx + gw * .38, chao - gh * .3); ctx.stroke(); }
    ctx.fillStyle = ch ? "#13110b" : "#14120c"; ctx.fillRect(0, chao, W, H);
  } else if (cena === "feira") {
    ctx.fillStyle = "#18191d"; if (!ch) { ctx.fillRect(0, chao - H * .32, W, H * .05); for (let i = 0; i < 5; i++) ctx.fillRect(W * (.05 + i * .22), chao - H * .27, W * .04, H * .27); }
    [["#8a2a20", .02], ["#2a5a7a", .36], ["#7a6a20", .68]].forEach(([cor, fx], i) => {
      const x = W * fx, w = W * .3; ctx.fillStyle = cor; ctx.beginPath(); ctx.moveTo(x, chao - H * .14); ctx.lineTo(x + w / 2, chao - H * .19); ctx.lineTo(x + w, chao - H * .14); ctx.fill();
      ctx.fillStyle = "#2a2018"; ctx.fillRect(x + 6, chao - H * .06, w - 12, H * .04); ctx.fillRect(x + 8, chao - H * .14, 3, H * .14); ctx.fillRect(x + w - 11, chao - H * .14, 3, H * .14);
      for (let k = 0; k < 4; k++) { ctx.fillStyle = ["#d8a83a", "#a8b0b8", "#7a4a2a", "#5aa03a"][(k + i) % 4]; ctx.fillRect(x + 14 + k * (w - 28) / 4, chao - H * .075, 8, 8); }
      luzCor(x + w / 2, chao - H * .13, 40, .35 + .1 * Math.sin(t * 5 + i), "255,200,110");
      pessoa(x + w / 2 + Math.sin(t * .6 + i) * 8, chao + H * .005, H * .15, { cor: "#060606", dir: i % 2 ? 1 : -1, capacete: ch, cabeca: Math.sin(t + i) });
    });
    ctx.fillStyle = ch ? "#11120e" : "#101114"; ctx.fillRect(0, chao, W, H);
  } else { // terreno: vazio, em obra ou casa pronta
    if (ch) for (let i = 0; i < 8; i++) pinheiroVermelho(W * (i / 7), chao, H * (.2 + cvRnd(i) * .12), i); else for (let i = 0; i < 9; i++) arvore(W * (i / 8), chao, H * (.16 + cvRnd(i) * .12), "#151a12", .26);
    if (SOB.pos.includes("lago") || SOB.pos.includes("rio")) { ctx.fillStyle = "rgba(90,120,150,.35)"; ctx.fillRect(0, chao - H * .015, W, H * .02); for (let i = 0; i < 6; i++) { ctx.fillStyle = "rgba(200,220,240,.15)"; ctx.fillRect(((t * 15 + i * 60) % W), chao - H * .01, 20, 1.5); } }
    ctx.fillStyle = ch ? "#13110b" : "#121410"; ctx.fillRect(0, chao, W, H);
    if (casa) {
      const cx = W * .55, cw = W * .36, chh = H * .13;
      ctx.fillStyle = "#3a2a1c"; ctx.fillRect(cx - cw / 2, chao - chh, cw, chh); ctx.fillStyle = "#2a1c12"; ctx.beginPath(); ctx.moveTo(cx - cw / 2 - 10, chao - chh); ctx.lineTo(cx, chao - chh - H * .08); ctx.lineTo(cx + cw / 2 + 10, chao - chh); ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,.35)"; for (let i = 1; i < 6; i++) { ctx.beginPath(); ctx.moveTo(cx - cw / 2, chao - chh + i * chh / 6); ctx.lineTo(cx + cw / 2, chao - chh + i * chh / 6); ctx.stroke(); }
      ctx.fillStyle = luz ? "rgba(255,200,120,.8)" : "rgba(160,170,180,.3)"; ctx.fillRect(cx - cw * .32, chao - chh * .7, cw * .2, chh * .35); sobTabuas(cx - cw * .32, chao - chh * .7, cw * .2, chh * .35, Math.min(4, Math.round(SOB.defesa / 15)));
      ctx.fillStyle = "#1a120a"; ctx.fillRect(cx + cw * .1, chao - chh * .7, cw * .16, chh * .7);
      ctx.fillStyle = "#2a2a2a"; ctx.fillRect(cx + cw * .25, chao - chh - H * .06, 10, H * .05);
      for (let i = 0; i < 6; i++) { const k = ((t * .4 + i / 6) % 1); ctx.fillStyle = `rgba(150,150,150,${.2 * (1 - k)})`; ctx.beginPath(); ctx.arc(cx + cw * .25 + 5 + k * 15, chao - chh - H * .06 - k * H * .12, 4 + k * 12, 0, 7); ctx.fill(); }
      (SOB.horta || []).forEach((h, i) => { ctx.fillStyle = "#2a1c10"; ctx.fillRect(W * (.05 + i * .1), chao + 4, W * .08, 6); if (h) plantinha(W * (.09 + i * .1), chao + 4, h.dias <= 0 ? 1 : .5); });
    } else {
      ctx.strokeStyle = "#8a6a3a"; ctx.lineWidth = 3; [[.4, .02], [.7, .02], [.4, .07], [.7, .07]].forEach(([fx, fy]) => { ctx.beginPath(); ctx.moveTo(W * fx, chao + H * fy); ctx.lineTo(W * fx, chao + H * fy - 18); ctx.stroke(); });
      ctx.strokeStyle = "rgba(240,240,240,.4)"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]); ctx.strokeRect(W * .4, chao + H * .02 - 14, W * .3, H * .05); ctx.setLineDash([]);
      ctx.fillStyle = "#5a4028"; for (let i = 0; i < 4; i++) ctx.fillRect(W * .12, chao - 4 - i * 5, W * .14, 4);
      letreiro(ch ? "ЗЕМЛЯ" : "VENDE-SE", W * .76, chao - H * .06, "rgba(220,220,210,.6)", 13, false); ctx.fillStyle = "#3a2a1a"; ctx.fillRect(W * .8, chao - H * .055, 3, H * .055);
    }
  }
  if (!p.semEu) pessoa(W * .45, chao + H * .045, H * .2, { cabeca: Math.sin(t * .5) > .7 ? -1 : 0 });
  if (!casa && !p.semEu) fogueira(W * .3, chao + H * .045, t, .35); // acampamento
  particulasRad && ch && particulasRad(t, 10 + Math.round(SOB.rad / 6));
  if (f > .6) { ctx.fillStyle = `rgba(5,7,10,${(f - .6) * .9})`; ctx.fillRect(0, 0, W, H); }
}
function desenhaFundoAtual(t, p) { if (L().especialLugar) return desenhaEspecial(t, p); (SOB.modo === "cherno" ? chernoBase : sobBase)(t, p); }
function desenhaMapa(t) {
  const ch = SOB.modo === "cherno", mapa = MAPAS[SOB.modo];
  ctx.fillStyle = ch ? "#1a1c14" : "#16181a"; ctx.fillRect(0, 0, W, H);
  const mx = W * .04, my = H * .1, mw = W * .92, mh = H * .54;
  const P = m => [mx + m.x * mw, my + m.y * mh];
  ctx.fillStyle = ch ? "#24271c" : "#1f2422"; ctx.fillRect(mx, my, mw, mh);
  ctx.strokeStyle = "rgba(255,255,255,.04)"; for (let i = 1; i < 8; i++) { ctx.beginPath(); ctx.moveTo(mx + mw * i / 8, my); ctx.lineTo(mx + mw * i / 8, my + mh); ctx.moveTo(mx, my + mh * i / 8); ctx.lineTo(mx + mw, my + mh * i / 8); ctx.stroke(); }
  ctx.strokeStyle = "rgba(90,130,170,.55)"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(mx + mw * .95, my); ctx.bezierCurveTo(mx + mw * .6, my + mh * .4, mx + mw * .9, my + mh * .6, mx + mw * .55, my + mh); ctx.stroke();
  for (let i = 0; i < 18; i++) { ctx.fillStyle = ch ? "rgba(90,40,30,.5)" : "rgba(40,70,40,.5)"; ctx.beginPath(); ctx.arc(mx + mw * (.3 + cvRnd(i) * .65), my + mh * (cvRnd(i * 3) * .4), 6 + cvRnd(i * 2) * 6, 0, 7); ctx.fill(); }
  const aqui = P(mapa[SOB.pos]);
  ctx.strokeStyle = "rgba(220,200,150,.25)"; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
  Object.entries(mapa).forEach(([id, m]) => { if (id === SOB.pos) return; const [x, y] = P(m); ctx.beginPath(); ctx.moveTo(aqui[0], aqui[1]); ctx.lineTo(x, y); ctx.stroke(); });
  ctx.setLineDash([]);
  Object.entries(mapa).forEach(([id, m]) => {
    const [x, y] = P(m), l = M().locais[id], casa = SOB.casas[id], tipo = m.tipo;
    const cor = casa ? "#9bd86b" : tipo === "armas" ? "#e2483d" : tipo === "hospital" ? "#f0f0f0" : tipo === "agro" ? "#e3b46b" : tipo === "mercado" ? "#4fcfd9" : tipo === "terreno" ? "#b8a880" : tipo === "saque" ? "#c890e0" : "#9aa0b0";
    ctx.fillStyle = cor; ctx.beginPath(); ctx.arc(x, y, casa ? 7 : 5, 0, 7); ctx.fill();
    if (tipo && TIPOS_LUGAR[tipo].conserto && !consertado(id)) { ctx.strokeStyle = "#e2483d"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x - 4, y - 4); ctx.lineTo(x + 4, y + 4); ctx.stroke(); }
    ctx.fillStyle = "rgba(233,228,216,.85)"; ctx.font = `600 ${Math.max(9, H * .013)}px "JetBrains Mono", monospace`;
    const nome = l.nome.length > 16 ? l.nome.split(" ").slice(0, 2).join(" ") : l.nome; ctx.fillText(nome, Math.min(x + 8, mx + mw - nome.length * 6), y + 3);
  });
  const pul = .5 + .5 * Math.sin(t * 4); ctx.strokeStyle = `rgba(255,210,77,${pul})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(aqui[0], aqui[1], 10 + pul * 6, 0, 7); ctx.stroke();
  pessoa(aqui[0], aqui[1] - 2, H * .05, { aro: "rgba(255,210,77,.5)" });
  ctx.fillStyle = "rgba(233,228,216,.5)"; ctx.font = `600 11px "JetBrains Mono", monospace`; ctx.fillText(ch ? "ZONA DE EXCLUSÃO · 30 KM" : "REGIÃO · MAPA DO SOBREVIVENTE", mx, my - 8);
}
function desenhaViagem(t, c) {
  const ch = SOB.modo === "cherno", dur = 2.6 + c.dias * 2.2, k = Math.min(1, t / dur);
  const ciclo = c.dias ? (k * c.dias * 1.0) % 1 : .2, noite = c.dias && ciclo > .55 && ciclo < .95;
  const f = noite ? 1 : ciclo < .55 ? ciclo * 1.2 : .3;
  if (ch) chernoCeu(f, false); else sobCeu(f);
  const chao = H * .6, sc = t * W * .35;
  if (ch) for (let i = 0; i < 14; i++) pinheiroVermelho(((i * W * .18 - sc * .5) % (W * 1.4) + W * 1.4) % (W * 1.4) - W * .2, chao, H * (.2 + cvRnd(i) * .12), i);
  else for (let i = 0; i < 14; i++) arvore(((i * W * .18 - sc * .5) % (W * 1.4) + W * 1.4) % (W * 1.4) - W * .2, chao, H * (.16 + cvRnd(i) * .12), "#14181a", .26);
  ctx.fillStyle = "#18191c"; ctx.fillRect(0, chao, W, H); ctx.fillStyle = "rgba(220,210,170,.35)"; for (let i = 0; i < 10; i++) ctx.fillRect(((i * W * .18 - sc) % (W * 1.8) + W * 1.8) % (W * 1.8) - W * .2, chao + H * .05, W * .07, 3);
  if (noite) { ctx.fillStyle = "#5a3a20"; ctx.beginPath(); ctx.moveTo(W * .55, chao + H * .04); ctx.lineTo(W * .65, chao - H * .05); ctx.lineTo(W * .75, chao + H * .04); ctx.fill(); fogueira(W * .4, chao + H * .04, t, .5); pessoa(W * .5, chao + H * .045, H * .18, { sentado: true, dir: -1 }); }
  else { pessoa(W * .4, chao + H * .045, H * .2, { fase: sc / (H * .04), anda: 1, luz: f > .55, mochila: true }); SOB.grupo.forEach((g, i) => pessoa(W * (.28 - i * .09), chao + H * .045, H * .18, { fase: sc / (H * .04) - i - 1, anda: 1, cor: "#06080c" })); }
  const destino = M().locais[c.destino]; ctx.fillStyle = "rgba(233,228,216,.85)"; ctx.font = `600 12px "JetBrains Mono", monospace`;
  ctx.fillText(`→ ${destino ? destino.nome.toUpperCase() : ""}${c.dias ? " · DIA " + Math.min(c.dias, Math.floor(k * c.dias) + 1) + " DE " + c.dias : ""}`, W * .05, H * .1);
  ctx.fillStyle = "rgba(255,210,77,.8)"; ctx.fillRect(W * .05, H * .115, W * .9 * k, 3);
}

/* desenho geral: acrescenta mapa, viagem e os lugares especiais */
const _desenhaAcao = desenhaAcao;
desenhaAcao = function (t, c) {
  if (["consertar", "construir", "fabricar"].includes(c.acao)) {
    desenhaFundoAtual(t, { semEu: true });
    const chao = H * .6, y = chao + H * .045, h = H * .2, x = W * .42;
    ctx.fillStyle = "#4a3220"; ctx.fillRect(x + h * .2, y - h * .3, h * .7, h * .06); ctx.fillRect(x + h * .25, y - h * .25, 5, h * .25); ctx.fillRect(x + h * .82, y - h * .25, 5, h * .25);
    if (c.acao === "fabricar" && c.item) { ctx.save(); ctx.translate(x + h * .45, y - h * .42); const img = imgItem(c.item); if (img) ctx.drawImage(img, -h * .12, -h * .12, h * .24, h * .24); ctx.restore(); }
    if (c.acao === "construir") { const n = Math.min(6, Math.floor(t / .5)); for (let i = 0; i < n; i++) { ctx.fillStyle = i % 2 ? "#6a4a2a" : "#5a3c22"; ctx.fillRect(W * .6, y - 8 - i * 9, W * .3, 7); } }
    pessoa(x, y, h, {});
    const ph = (t * 2.6) % 1, ang = ph < .55 ? cvMix(-1.9, -.2, ph / .55) : cvMix(-.2, -1.9, (ph - .55) / .45);
    ferramenta(x + h * .06, y - h * .66, ang + 1.2, h * .36, "#7a5a32", "#2a2e34");
    if (ph > .5 && ph < .62) particulas(x + h * .4, y - h * .35, t * 3, "rgba(255,210,120,A)", 7, .6);
    return;
  }
  if (c.acao === "atirar" || c.acao === "faca") {
    const ch = SOB.modo === "cherno"; (ch ? chernoLugar : sobLugar)(t + 4, { cena: sobCena.cena || L().lugares[0].cena });
    const chao = H * .6, y = chao + H * .03, h = H * .24, x = W * .3;
    for (let i = 0; i < Math.min(3, c.n || 1); i++) { const cai = t > .5 + i * .3 ? 1 : 0, zx = W * (.7 + i * .1);
      ctx.save(); ctx.translate(zx, y); ctx.rotate(cai * (c.mut ? .4 : 1.3)); if (c.mut) monstro(0, 0, H * .16, { quatro: true, dir: -1, olhos: cai ? 0 : 1, olhosRgb: "190,255,120", cor: "#0b0d08" }); else zumbi(0, 0, H * .2, { dir: -1, olhos: cai ? 0 : .4 }); ctx.restore(); }
    pessoa(x, y, h, { luz: c.acao !== "faca", luzRgb: "255,240,200", inclina: .05 });
    if (c.acao === "faca") ferramenta(x + h * .15, y - h * .6, -.3 + Math.sin(t * 12) * .5, h * .22, "#c8ccd2");
    else { const fl = (t * 3) % 1 < .15; if (fl) { luzCor(x + h * .42, y - h * .62, 50, .9, "255,220,140"); if (c.arma === "espingarda") luzCor(x + h * .42, y - h * .56, 40, .8, "255,220,140"); } ferramenta(x + h * .15, y - h * .62, 0, h * .3, "#2a2e34", c.arma === "espingarda" ? "#2a2e34" : null); }
    return;
  }
  return _desenhaAcao(t, c);
};
const _imgCache = {};
function imgItem(id) { if (_imgCache[id]) return _imgCache[id].complete ? _imgCache[id] : null; const im = new Image(); im.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(desenhoItem(id).replace('<svg class="di"', '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"')); _imgCache[id] = im; return null; }
function sobDesenhar(t) {
  if (!sobTopoPainel) medirPalco();
  const hv = sobHv(), H0 = H;
  if (hv) H = hv;
  try {
    if (!SOB) {
      if (sobModo === "cherno") { chernoCeu(.3, false); reator(W * .7, H * .6, W * .5, t); ctx.fillStyle = "#11120e"; ctx.fillRect(0, H * .6, W, H); particulasRad(t, 20); pessoa(W * .3, H * .645, H * .2, {}); }
      else { sobCeu(.4); acesas = .02; ctx.save(); ctx.translate(0, -H * .1); cidade(); ctx.restore(); ctx.fillStyle = "#0d0e12"; ctx.fillRect(0, H * .6, W, H); sobZumbis(t, H * .63, 5); pessoa(W * .3, H * .645, H * .2, {}); }
    } else {
      const c = sobCena, ch = SOB.modo === "cherno";
      if (c.tipo === "mapa") desenhaMapa(t);
      else if (c.tipo === "acao" && c.acao === "viagem") desenhaViagem((performance.now() - c.t0) / 1000, c);
      else if (c.tipo === "acao" && c.acao === "viajar") desenhaViagem((performance.now() - c.t0) / 1000, { ...c, dias: 0 });
      else if (c.tipo === "acao") desenhaAcao((performance.now() - c.t0) / 1000, c);
      else if (c.tipo === "lugar") (ch ? chernoLugar : sobLugar)(t, c);
      else if (c.tipo === "visita") { if (L().especialLugar) { desenhaEspecial(t, { noite: c.noite }); const chao = H * .6, k = cvSuave(cvSeg(t, .3, 3)); pessoa(cvMix(W * 1.1, W * .72, k), chao + H * .02, H * .22, { fase: t * 4, anda: k < 1 ? .8 : 0, dir: -1, mochila: true }); } else (ch ? chernoVisita : sobVisita)(t, c); }
      else desenhaFundoAtual(t, c);
      if (SOB.clima === "neblina") sobNevoa(t, .12);
    }
    const g = ctx.createLinearGradient(0, sobTopoPainel - 40, 0, sobTopoPainel);
    g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,.5)"); ctx.fillStyle = g; ctx.fillRect(0, sobTopoPainel - 40, W, 40);
  } finally { H = H0; }
}
// rótulos das novas ações
const _sobFazer = sobFazer;
sobFazer = function (acao, ms, depois, extra) {
  _sobFazer(acao, ms, depois, extra);
  const r = { viajar: "A caminho…", viagem: "Viajando…", consertar: "Consertando…", construir: "Construindo a casa…", fabricar: "Fabricando…", atirar: "Atirando…", faca: "Lutando…" }[acao];
  if (r) $s("sobTexto").innerHTML = `<span class="sb-fazendo">${r}</span>`;
};
