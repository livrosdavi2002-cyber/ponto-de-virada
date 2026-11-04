/* ============================================================
   INTERIOR DAS CASAS (com os itens da mochila na cena)
   + LUGARES NOVOS NO MAPA com cenário próprio
   ============================================================ */

/* ---------- lugares novos ---------- */
TIPOS_LUGAR.saque = { nome: "Saque", desc: "Muita coisa para pegar. Muito perigo." };
const NOVOS = {
  zumbi: {
    posto_z: { x: .46, y: .1, nome: "Posto de gasolina", cena: "posto_gas", lugares: [["Loja de conveniência", .4, "loja", [lt("enlatado", 1, 2), lt("sucata", 1, 2), lt("pano", 0, 1)]], ["Oficina mecânica", .35, "rua", [lt("material", 1, 3), lt("sucata", 2, 4)]]] },
    escola_z: { x: .1, y: .36, nome: "Escola municipal", cena: "escola", abrigo: true, lugares: [["Refeitório", .4, "mercado", [lt("enlatado", 1, 3), lt("pao", 0, 1)]], ["Enfermaria escolar", .35, "loja", [lt("bandagem", 1, 2), lt("pano", 1, 2)]]] },
    delegacia_z: { x: .38, y: .4, nome: "Delegacia", cena: "delegacia", lugares: [["Arsenal da delegacia", .65, "loja", [lt("municao", 3, 7), lt("espingarda", 1, 1, .08)]], ["Celas", .5, "presidio", [lt("sucata", 1, 2), lt("material", 0, 2)]]] },
    atacadao_z: { x: .9, y: .45, nome: "Atacadão", cena: "atacadao", lugares: [["Corredores de comida", .55, "mercado", [lt("enlatado", 2, 4), lt("racao", 0, 1, .3)]], ["Depósito dos fundos", .45, "mercado", [lt("material", 1, 3), lt("s_tomate", 1, 1, .3)]]] },
    igreja_z: { x: .58, y: .88, nome: "Igreja da colina", cena: "igreja", abrigo: true, lugares: [["Sacristia", .2, "loja", [lt("pano", 1, 2), lt("enlatado", 0, 1)]]] },
    base_z: { x: .08, y: .94, nome: "Base militar abandonada", cena: "base_militar", lugares: [["Paiol", .75, "presidio", [lt("municao", 4, 9), lt("rifle", 1, 1, .1), lt("kit", 0, 1, .3)]], ["Hangar", .6, "rua", [lt("racao", 1, 2), lt("material", 2, 4)]]] },
    pier_z: { x: .66, y: .16, nome: "Píer do lago", cena: "pier", lugares: [["Pescar no píer", .2, "mata", [lt("peixe", 1, 3)]], ["Barcos encalhados", .35, "mata", [lt("sucata", 1, 3), lt("pano", 0, 1)]]] },
  },
  cherno: {
    estacao_c: { x: .58, y: .7, nome: "Estação Yanov", cena: "estacao_trem", lugares: [["Vagões enferrujados", .4, 12, "duga", [lt("sucata", 2, 4), lt("material", 1, 2)]], ["Sala do chefe da estação", .35, 8, "pripyat", [lt("vodka", 0, 1), lt("pecas", 0, 1, .4)]]] },
    rassokha_c: { x: .08, y: .74, nome: "Cemitério de veículos", cena: "cemiterio_veiculos", lugares: [["Helicópteros abandonados", .45, 24, "duga", [lt("pecas", 1, 2, .6), lt("sucata", 2, 4)]], ["Caminhões dos liquidadores", .4, 20, "duga", [lt("material", 1, 3), lt("filtro", 0, 1)]]] },
    lab_c: { x: .07, y: .42, nome: "Laboratório subterrâneo", cena: "laboratorio", lugares: [["Corredores do laboratório", .65, 30, "usina", [lt("artefato", 1, 2, .6), lt("kit", 0, 1, .4), lt("iodo", 1, 2)]]] },
    torres_c: { x: .9, y: .14, nome: "Torres de resfriamento", cena: "torre_resfriamento", lugares: [["Base das torres", .5, 26, "usina", [lt("pecas", 1, 2, .5), lt("artefato", 1, 1, .3), lt("material", 1, 2)]]] },
    escola_c: { x: .56, y: .14, nome: "Escola nº 3 de Pripyat", cena: "escola", abrigo: true, lugares: [["Salas de aula", .4, 10, "pripyat", [lt("pano", 1, 2), lt("enlatado", 0, 1), lt("filtro", 1, 3)]]] },
    ponte_c: { x: .5, y: .38, nome: "Ponte da Morte", cena: "ponte_ferro", lugares: [["Debaixo da ponte", .45, 18, "floresta", [lt("javali", 0, 1, .5), lt("artefato", 1, 1, .2), lt("sucata", 1, 2)]]] },
    zalissya_c: { x: .28, y: .86, nome: "Vila Zalissya", cena: "vila_madeira", abrigo: true, lugares: [["Quintais", .3, 8, "vila", [lt("batata", 1, 2), lt("s_beterraba", 1, 1, .4), lt("ervas", 1, 2)]], ["Casa do mercado", .35, 6, "vila", [lt("pao", 0, 1), lt("vodka", 0, 1), lt("sucata", 1, 2)]]] },
  },
};
for (const [modo, lista] of Object.entries(NOVOS)) for (const [id, m] of Object.entries(lista)) {
  const ch = modo === "cherno";
  MAPAS[modo][id] = { x: m.x, y: m.y, tipo: "saque", nome: m.nome, cena: m.cena };
  MODOS[modo].locais[id] = { nome: m.nome, cor: MODOS[modo].cor, base: m.nome, canteiros: m.abrigo ? 2 : 0, ic: "porta", especialLugar: "saque", cena: m.cena, abrigo: !!m.abrigo,
    desc: TIPOS_LUGAR.saque.desc, ini: { defesa: 0, inv: {} }, perigo: ch ? 1.05 : 1, radBase: ch ? 3 : 0,
    lugares: m.lugares.map(g => ch ? { nome: g[0], desc: "Saque", risco: g[1], rad: g[2], cena: g[3], loot: g[4] } : { nome: g[0], desc: "Saque", risco: g[1], cena: g[2], loot: g[3] }) };
}
MODOS.zumbi.objetivos.splice(6, 0, { t: "Saqueie a base militar abandonada", ok: s => (s.st.base || 0) >= 1, premio: { kit: 1, municao: 6 } });
MODOS.cherno.objetivos.splice(6, 0, { t: "Explore o laboratório subterrâneo", ok: s => (s.st.lab || 0) >= 1, premio: { artefato: 1, iodo: 2 } });
const _sobVasc = sobVasculhar;
sobVasculhar = function (g) { if (SOB.pos === "base_z") SOB.st.base = (SOB.st.base || 0) + 1; if (SOB.pos === "lab_c") SOB.st.lab = (SOB.st.lab || 0) + 1; return _sobVasc(g); };

/* ---------- mapa maior ---------- */
const _abrirMapa = abrirMapa;
abrirMapa = function () { document.body.classList.add("sob-mapa"); setTimeout(medirPalco, 60); _abrirMapa(); };
const _sobDiaM = sobDia;
sobDia = function (msg) { if (document.body.classList.contains("sob-mapa")) { document.body.classList.remove("sob-mapa"); setTimeout(medirPalco, 60); } return _sobDiaM(msg); };

/* ---------- cenários dos lugares novos ---------- */
function predioSimples(x, y, w, h, cor, janelas = .2) {
  ctx.fillStyle = cor; ctx.fillRect(x, y - h, w, h);
  const cols = Math.max(2, Math.floor(w / 22)), rows = Math.max(2, Math.floor(h / 26));
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { ctx.fillStyle = cvRnd(x + r * 7 + c * 3) < janelas ? "rgba(240,200,130,.5)" : "rgba(8,9,11,.85)"; ctx.fillRect(x + 6 + c * (w - 12) / cols, y - h + 8 + r * (h - 12) / rows, (w - 12) / cols - 6, (h - 12) / rows - 8); }
}
function carroVelho(x, y, s, cor = "#3a3e44") {
  ctx.fillStyle = cor; ctx.beginPath(); ctx.moveTo(x - 30 * s, y - 6 * s); ctx.lineTo(x - 26 * s, y - 16 * s); ctx.lineTo(x - 12 * s, y - 18 * s); ctx.lineTo(x - 6 * s, y - 28 * s); ctx.lineTo(x + 14 * s, y - 28 * s); ctx.lineTo(x + 22 * s, y - 18 * s); ctx.lineTo(x + 32 * s, y - 16 * s); ctx.lineTo(x + 32 * s, y - 6 * s); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "rgba(120,140,160,.2)"; ctx.fillRect(x - 4 * s, y - 26 * s, 16 * s, 8 * s);
  ctx.fillStyle = "#0a0a0a"; [x - 18 * s, x + 20 * s].forEach(r => { ctx.beginPath(); ctx.arc(r, y - 5 * s, 6 * s, 0, 7); ctx.fill(); });
}
const CENAS_NOVAS = {
  posto_gas(t, chao, ch) {
    ctx.fillStyle = "#24272c"; ctx.fillRect(W * .15, chao - H * .2, W * .7, H * .03); ctx.fillRect(W * .2, chao - H * .2, 6, H * .2); ctx.fillRect(W * .78, chao - H * .2, 6, H * .2);
    letreiro("POSTO", W * .4, chao - H * .21, "rgba(242,80,50,A)", Math.min(W * .06, 24));
    for (let i = 0; i < 3; i++) { ctx.fillStyle = "#c8402a"; ctx.fillRect(W * (.32 + i * .14), chao - H * .07, W * .04, H * .07); ctx.fillStyle = "#111"; ctx.fillRect(W * (.325 + i * .14), chao - H * .06, W * .03, H * .015); }
    predioSimples(W * .02, chao, W * .14, H * .1, "#2a2420", .3); carroVelho(W * .88, chao + 2, 1.2, "#5a2a20");
    luzCor(W * .5, chao - H * .17, W * .4, .12 + .05 * Math.sin(t * 9), "255,240,200");
  },
  escola(t, chao, ch) {
    predioSimples(W * .1, chao, W * .62, H * .16, ch ? "#2a2c24" : "#3a3028", .15);
    ctx.fillStyle = "#e0d8c0"; ctx.beginPath(); ctx.arc(W * .41, chao - H * .19, 12, 0, 7); ctx.fill(); ctx.strokeStyle = "#222"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(W * .41, chao - H * .19); ctx.lineTo(W * .41 + Math.cos(t * .1) * 8, chao - H * .19 + Math.sin(t * .1) * 8); ctx.moveTo(W * .41, chao - H * .19); ctx.lineTo(W * .41, chao - H * .19 - 6); ctx.stroke();
    letreiro(ch ? "ШКОЛА №3" : "ESCOLA", W * .14, chao - H * .17, "rgba(230,225,210,.7)", 14, false);
    ctx.strokeStyle = "#3a3e44"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(W * .78, chao); ctx.lineTo(W * .82, chao - H * .1); ctx.lineTo(W * .92, chao - H * .1); ctx.lineTo(W * .96, chao); ctx.stroke();
    const bal = Math.sin(t * 1.5) * .4; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(W * .87, chao - H * .1); ctx.lineTo(W * .87 + Math.sin(bal) * H * .07, chao - H * .1 + Math.cos(bal) * H * .07); ctx.stroke();
    ctx.fillStyle = "#3a3e44"; ctx.fillRect(W * .87 + Math.sin(bal) * H * .07 - 8, chao - H * .1 + Math.cos(bal) * H * .07, 16, 3);
    ctx.strokeStyle = "#555"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(W * .06, chao); ctx.lineTo(W * .06, chao - H * .26); ctx.stroke(); ctx.fillStyle = ch ? "#8a2a20" : "#2a6a3a"; ctx.fillRect(W * .06, chao - H * .26, 24 + Math.sin(t * 3) * 3, 14);
  },
  delegacia(t, chao, ch) {
    predioSimples(W * .12, chao, W * .5, H * .17, "#22262e", .1);
    ctx.fillStyle = "#1a3a6a"; ctx.fillRect(W * .2, chao - H * .2, W * .34, H * .03); letreiro("POLÍCIA", W * .24, chao - H * .178, "rgba(230,240,255,A)", 15);
    carroVelho(W * .78, chao + 2, 1.3, "#d8d8d0"); const pis = Math.sin(t * 8) > 0;
    ctx.fillStyle = pis ? "rgba(255,60,50,.9)" : "rgba(60,90,255,.9)"; ctx.fillRect(W * .78 - 6, chao - 40, 12, 5); luzCor(W * .78, chao - 38, 50, .4, pis ? "255,60,50" : "60,90,255");
    for (let i = 0; i < 5; i++) { ctx.fillStyle = "#5a4a30"; ctx.beginPath(); ctx.ellipse(W * (.04 + i * .035), chao - 6 - (i % 2) * 8, 12, 7, 0, 0, 7); ctx.fill(); }
  },
  atacadao(t, chao, ch) {
    ctx.fillStyle = "#26282c"; ctx.fillRect(W * .04, chao - H * .18, W * .92, H * .18);
    for (let i = 0; i < 12; i++) { ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.fillRect(W * .04 + i * W * .077, chao - H * .18, 2, H * .18); }
    ctx.fillStyle = "#c8402a"; ctx.fillRect(W * .2, chao - H * .22, W * .6, H * .045); letreiro("ATACADÃO", W * .32, chao - H * .185, "rgba(255,230,120,A)", Math.min(W * .065, 26));
    ctx.fillStyle = "#0a0b0d"; ctx.fillRect(W * .4, chao - H * .09, W * .2, H * .09);
    ctx.strokeStyle = "#8a9098"; ctx.lineWidth = 1.5; for (let i = 0; i < 3; i++) { const x = W * (.66 + i * .07); ctx.strokeRect(x, chao - 20, 22, 14); ctx.beginPath(); ctx.arc(x + 4, chao - 3, 3, 0, 7); ctx.arc(x + 18, chao - 3, 3, 0, 7); ctx.stroke(); }
  },
  igreja(t, chao, ch) {
    const cx = W * .5; ctx.fillStyle = "#2a2622"; ctx.fillRect(cx - W * .18, chao - H * .14, W * .36, H * .14);
    ctx.beginPath(); ctx.moveTo(cx - W * .2, chao - H * .14); ctx.lineTo(cx, chao - H * .22); ctx.lineTo(cx + W * .2, chao - H * .14); ctx.fill();
    ctx.fillRect(cx - W * .05, chao - H * .32, W * .1, H * .18); ctx.beginPath(); ctx.moveTo(cx - W * .06, chao - H * .32); ctx.lineTo(cx, chao - H * .4); ctx.lineTo(cx + W * .06, chao - H * .32); ctx.fill();
    ctx.strokeStyle = "#c8c0a8"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(cx, chao - H * .4); ctx.lineTo(cx, chao - H * .45); ctx.moveTo(cx - 6, chao - H * .43); ctx.lineTo(cx + 6, chao - H * .43); ctx.stroke();
    const b = Math.sin(t * 2) * .3; ctx.save(); ctx.translate(cx, chao - H * .29); ctx.rotate(b); ctx.fillStyle = "#8a6a2a"; ctx.beginPath(); ctx.arc(0, 6, 7, PI, 0); ctx.fill(); ctx.restore();
    ctx.fillStyle = "rgba(255,200,120,.6)"; ctx.beginPath(); ctx.arc(cx, chao - H * .08, 10, PI, 0); ctx.fill(); ctx.fillRect(cx - 10, chao - H * .08, 20, H * .08); luzCor(cx, chao - H * .05, 60, .25, "255,200,120");
    for (let i = 0; i < 5; i++) { ctx.fillStyle = "#3a3530"; ctx.fillRect(W * (.08 + i * .04), chao - 14, 3, 14); ctx.fillRect(W * (.08 + i * .04) - 5, chao - 10, 13, 3); }
  },
  base_militar(t, chao, ch) {
    ctx.strokeStyle = "#4a4e44"; ctx.lineWidth = 1; for (let x = 0; x < W; x += 10) { ctx.beginPath(); ctx.moveTo(x, chao - H * .08); ctx.lineTo(x + 10, chao); ctx.moveTo(x + 10, chao - H * .08); ctx.lineTo(x, chao); ctx.stroke(); }
    ctx.strokeStyle = "#6a6e64"; for (let i = 0; i < 40; i++) { ctx.beginPath(); ctx.arc(i * W / 40, chao - H * .085, 4, 0, 7); ctx.stroke(); }
    ctx.fillStyle = "#2a2e24"; ctx.fillRect(W * .76, chao - H * .3, W * .14, H * .3); ctx.fillRect(W * .73, chao - H * .32, W * .2, H * .03);
    const a = Math.sin(t * .7) * .8; const g = ctx.createLinearGradient(W * .83, chao - H * .3, W * .83 + Math.sin(a) * W, chao); g.addColorStop(0, "rgba(240,245,255,.22)"); g.addColorStop(1, "rgba(240,245,255,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(W * .83, chao - H * .29); ctx.lineTo(W * .83 + Math.sin(a - .15) * W, chao + H * .05); ctx.lineTo(W * .83 + Math.sin(a + .15) * W, chao + H * .05); ctx.fill();
    ctx.fillStyle = "#33382c"; ctx.fillRect(W * .12, chao - H * .06, W * .3, H * .05); ctx.fillRect(W * .2, chao - H * .09, W * .12, H * .035); ctx.fillRect(W * .3, chao - H * .08, W * .2, 5);
    ctx.fillStyle = "#1a1c18"; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(W * (.14 + i * .06), chao - H * .012, H * .014, 0, 7); ctx.fill(); }
    ctx.save(); ctx.translate(W * .58, chao - 8); ctx.rotate(-.15); ctx.fillStyle = "#2a2e28"; ctx.beginPath(); ctx.ellipse(0, 0, W * .09, H * .022, 0, 0, 7); ctx.fill(); ctx.fillRect(W * .08, -3, W * .1, 5); ctx.strokeStyle = "#2a2e28"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-W * .1, -H * .03); ctx.lineTo(W * .1, -H * .03); ctx.stroke(); ctx.restore();
  },
  pier(t, chao, ch) {
    ctx.fillStyle = "#1c2a36"; ctx.fillRect(0, chao - H * .06, W, H);
    for (let i = 0; i < 14; i++) { ctx.fillStyle = `rgba(200,220,240,${.06 + .05 * Math.sin(t * 2 + i)})`; ctx.fillRect(((i * 47 + t * 12) % W), chao - H * .04 + (i % 4) * 8, 30, 1.5); }
    ctx.fillStyle = "#4a3420"; ctx.fillRect(W * .3, chao - H * .065, W * .7, 8); for (let i = 0; i < 6; i++) ctx.fillRect(W * (.32 + i * .12), chao - H * .06, 5, H * .06);
    const by = chao - H * .05 + Math.sin(t * 1.2) * 3; ctx.fillStyle = "#6a4a2a"; ctx.beginPath(); ctx.moveTo(W * .08, by); ctx.lineTo(W * .26, by); ctx.lineTo(W * .23, by + 12); ctx.lineTo(W * .11, by + 12); ctx.fill();
    for (let i = 0; i < 6; i++) arvore(W * (.05 + i * .18), chao - H * .07, H * .12, "#14181a", .25);
  },
  estacao_trem(t, chao, ch) {
    predioSimples(W * .05, chao - H * .03, W * .3, H * .14, "#2a2c24", .05); letreiro("ЯНОВ", W * .1, chao - H * .18, "rgba(220,220,200,.6)", 14, false);
    ctx.fillStyle = "#3a3a34"; ctx.fillRect(0, chao - H * .03, W, H * .03);
    for (let i = 0; i < 3; i++) { const x = W * (.4 + i * .22); ctx.fillStyle = ["#4a2a20", "#3a3a2a", "#2a3a30"][i]; ctx.fillRect(x, chao - H * .11, W * .2, H * .08); ctx.fillStyle = "rgba(0,0,0,.4)"; for (let k = 0; k < 3; k++) ctx.fillRect(x + 6 + k * W * .06, chao - H * .1, W * .04, H * .03); ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(x + W * .04, chao - H * .028, H * .012, 0, 7); ctx.arc(x + W * .16, chao - H * .028, H * .012, 0, 7); ctx.fill(); }
    ctx.strokeStyle = "#5a5a50"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, chao); ctx.lineTo(W, chao); ctx.stroke();
  },
  cemiterio_veiculos(t, chao, ch) {
    for (let r = 0; r < 3; r++) for (let i = 0; i < 6; i++) { const x = W * (.05 + i * .17) + r * 12, y = chao - r * H * .05; carroVelho(x, y, .9 - r * .15, ["#3a3a2a", "#4a3a2a", "#2a3a2a"][(i + r) % 3]); }
    ctx.save(); ctx.translate(W * .72, chao - H * .2); ctx.fillStyle = "#3a3e34"; ctx.beginPath(); ctx.ellipse(0, 0, W * .12, H * .03, 0, 0, 7); ctx.fill(); ctx.fillRect(W * .1, -4, W * .12, 6); ctx.strokeStyle = "#3a3e34"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-W * .16, -H * .04); ctx.lineTo(W * .16, -H * .045); ctx.stroke(); ctx.restore();
    trevoRad(W * .1, chao - H * .2, 12);
  },
  laboratorio(t, chao, ch) {
    ctx.fillStyle = "#1a1c16"; ctx.beginPath(); ctx.moveTo(0, chao); ctx.quadraticCurveTo(W * .5, chao - H * .3, W, chao); ctx.fill();
    ctx.fillStyle = "#2a2c26"; ctx.fillRect(W * .35, chao - H * .14, W * .3, H * .14);
    for (let i = 0; i < 8; i++) { ctx.fillStyle = i % 2 ? "#e8c020" : "#111"; ctx.fillRect(W * .35 + i * W * .0375, chao - H * .15, W * .0375, 6); }
    const g = .5 + .3 * Math.sin(t * 2); ctx.fillStyle = `rgba(140,255,120,${g * .5})`; ctx.fillRect(W * .43, chao - H * .1, W * .14, H * .1); luzCor(W * .5, chao - H * .05, W * .3, g * .4, "140,255,120");
    trevoRad(W * .3, chao - H * .1, 10); trevoRad(W * .7, chao - H * .1, 10);
  },
  torre_resfriamento(t, chao, ch) {
    [[.3, .38], [.68, .32]].forEach(([fx, fh]) => { const x = W * fx, w = W * .26, h = H * fh;
      ctx.fillStyle = "#2a2c26"; ctx.beginPath(); ctx.moveTo(x - w / 2, chao); ctx.quadraticCurveTo(x - w * .2, chao - h * .6, x - w * .35, chao - h); ctx.lineTo(x + w * .35, chao - h); ctx.quadraticCurveTo(x + w * .2, chao - h * .6, x + w / 2, chao); ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,.3)"; for (let i = 1; i < 8; i++) { ctx.beginPath(); ctx.moveTo(x - w * .5, chao - h * i / 8); ctx.lineTo(x + w * .5, chao - h * i / 8); ctx.stroke(); } });
    ctx.strokeStyle = "#5a4a20"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(W * .9, chao); ctx.lineTo(W * .9, chao - H * .42); ctx.lineTo(W * .55, chao - H * .42); ctx.stroke(); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(W * .6, chao - H * .42); ctx.lineTo(W * .6, chao - H * .3 + Math.sin(t) * 6); ctx.stroke();
  },
  ponte_ferro(t, chao, ch) {
    ctx.fillStyle = "#18242a"; ctx.fillRect(0, chao - H * .02, W, H);
    for (let i = 0; i < 10; i++) { ctx.fillStyle = `rgba(160,200,220,${.06 + .04 * Math.sin(t + i)})`; ctx.fillRect(((i * 61 + t * 10) % W), chao + i * 4, 30, 1.5); }
    const py = chao - H * .12; ctx.strokeStyle = "#3a3a34"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W, py); ctx.moveTo(0, py - H * .1); ctx.lineTo(W, py - H * .1); ctx.stroke(); ctx.lineWidth = 2;
    for (let i = 0; i <= 10; i++) { const x = i * W / 10; ctx.beginPath(); ctx.moveTo(x, py); ctx.lineTo(x + W / 20, py - H * .1); ctx.lineTo(x + W / 10, py); ctx.stroke(); }
    for (let i = 0; i < 3; i++) { ctx.fillStyle = "#2a2a26"; ctx.fillRect(W * (.15 + i * .35), py, 10, H * .14); }
  },
  vila_madeira(t, chao, ch) {
    for (let i = 0; i < 3; i++) { const x = W * (.06 + i * .32), w = W * .22, h = H * .1; ctx.fillStyle = "#3a2a18"; ctx.fillRect(x, chao - h, w, h); ctx.fillStyle = "#2a1c10"; ctx.beginPath(); ctx.moveTo(x - 8, chao - h); ctx.lineTo(x + w / 2, chao - h - H * .07); ctx.lineTo(x + w + 8, chao - h); ctx.fill();
      ctx.fillStyle = "#6a8aa0"; ctx.fillRect(x + w * .3, chao - h * .7, w * .2, h * .3); ctx.strokeStyle = "#c8b890"; ctx.lineWidth = 1.5; ctx.strokeRect(x + w * .3, chao - h * .7, w * .2, h * .3); }
    ctx.fillStyle = "#4a4a4a"; ctx.fillRect(W * .85, chao - H * .05, W * .08, H * .05); ctx.strokeStyle = "#3a2a18"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(W * .85, chao - H * .05); ctx.lineTo(W * .89, chao - H * .1); ctx.lineTo(W * .93, chao - H * .05); ctx.stroke();
  },
};
const _desenhaEspecial = desenhaEspecial;
desenhaEspecial = function (t, p) {
  const l = L(), ch = SOB.modo === "cherno";
  if (ehCasa() && !p.fora && !p.noite) return desenhaInterior(t, p);
  if (!CENAS_NOVAS[l.cena]) return _desenhaEspecial(t, p);
  const f = fundoLugar(t, p.noite), chao = H * .6;
  for (let i = 0; i < 6; i++) (ch ? pinheiroVermelho : (x, b, h) => arvore(x, b, h, "#14181a", .24))(W * (i / 5) + cvRnd(i) * 30, chao - H * .02, H * (.14 + cvRnd(i) * .1), i);
  CENAS_NOVAS[l.cena](t, chao, ch);
  ctx.fillStyle = ch ? "#11120e" : "#0f1013"; ctx.fillRect(0, chao, W, H);
  if (!p.semEu) { pessoa(W * .45, chao + H * .045, H * .2, { cabeca: Math.sin(t * .5) > .7 ? -1 : 0 }); if (!ehCasa()) fogueira(W * .3, chao + H * .045, t, .35); }
  if (ch) particulasRad(t, 10 + Math.round(SOB.rad / 6));
  if (f > .6) { ctx.fillStyle = `rgba(5,7,10,${(f - .6) * .9})`; ctx.fillRect(0, 0, W, H); }
};

/* ---------- interior das casas ---------- */
const FORA = ["plantar", "colher", "regar", "cacar", "vigiar", "saquear", "comprar"];
const _desenhaFundoAtual = desenhaFundoAtual;
desenhaFundoAtual = function (t, p) {
  const ac = sobCena && sobCena.tipo === "acao" ? sobCena.acao : null;
  if (ehCasa() && !p.noite && !FORA.includes(ac) && sobCena.tipo !== "visita") return desenhaInterior(t, p);
  if (L().especialLugar) return desenhaEspecial(t, { ...p, fora: true });
  return _desenhaFundoAtual(t, p);
};
function estiloCasa() {
  const id = SOB.pos;
  if (["cidade", "escola_z", "escola_c"].includes(id)) return SOB.modo === "cherno" ? "sovietico" : "apartamento";
  if (id === "pripyat") return "sovietico";
  if (["floresta", "vermelha", "terreno_lago", "terreno_rio", "terreno_hosp", "terreno_hosp_c"].includes(id)) return "cabana";
  if (["fazenda", "kopachi", "zalissya_c", "igreja_z"].includes(id)) return "fazenda";
  if (id === "presidio") return "cela";
  if (id === "bunker") return "bunker";
  return "cabana";
}
function desenhaItemCena(id, x, y, s, rot = 0) { const img = imgItem(id); if (!img) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.drawImage(img, -s / 2, -s / 2, s, s); ctx.restore(); }
function desenhaInterior(t, p) {
  const est = estiloCasa(), ch = SOB.modo === "cherno", chao = H * .6, f = Math.min(.95, SOB.gasta / Math.max(3, energiaMax()) * .9), noiteFora = f > .55;
  const P = { apartamento: ["#2a2a32", "#33333c", "#1c1a1a"], sovietico: ["#3a3424", "#4a4230", "#22201a"], cabana: ["#3a2614", "#4a3018", "#22160c"], fazenda: ["#4a3a28", "#5a4a32", "#2a2014"], cela: ["#2a2c2e", "#34373a", "#1a1b1c"], bunker: ["#262a26", "#2e332e", "#161816"] }[est];
  // parede
  ctx.fillStyle = P[0]; ctx.fillRect(0, 0, W, chao);
  if (est === "cabana") { for (let i = 0; i < 12; i++) { const y = i * chao / 12; ctx.fillStyle = i % 2 ? P[0] : P[1]; ctx.fillRect(0, y, W, chao / 12); ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.fillRect(0, y + chao / 12 - 2, W, 2); ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.beginPath(); ctx.arc(6 + (i % 2) * 6, y + chao / 24, chao / 28, 0, 7); ctx.arc(W - 6 - (i % 2) * 6, y + chao / 24, chao / 28, 0, 7); ctx.fill(); } }
  else if (est === "apartamento" || est === "sovietico") { ctx.fillStyle = P[1]; for (let x = 0; x < W; x += 26) for (let y = 0; y < chao; y += 26) { ctx.globalAlpha = .35; ctx.beginPath(); ctx.arc(x + ((y / 26) % 2) * 13, y, 3, 0, 7); ctx.fill(); } ctx.globalAlpha = 1; ctx.fillStyle = "rgba(0,0,0,.2)"; ctx.fillRect(0, chao * .72, W, 4); }
  else if (est === "cela" || est === "bunker") { ctx.fillStyle = P[1]; for (let y = 0; y < chao; y += 22) for (let x = (y / 22) % 2 * 20; x < W; x += 40) ctx.fillRect(x, y, 38, 20); if (est === "bunker") { ctx.fillStyle = "#3a4038"; ctx.fillRect(0, H * .03, W, 8); ctx.fillRect(W * .9, 0, 8, chao); } }
  else { ctx.fillStyle = P[1]; for (let x = 0; x < W; x += 18) ctx.fillRect(x, 0, 9, chao); }
  // janela com o lado de fora (hora do dia) e tábuas da defesa
  const jx = est === "cela" ? W * .62 : W * .58, jy = H * .1, jw = est === "cela" ? W * .2 : W * .32, jh = est === "cela" ? H * .1 : H * .2;
  ctx.save(); ctx.beginPath(); ctx.rect(jx, jy, jw, jh); ctx.clip();
  const H0 = H; ctx.translate(jx - W * .1, jy - H * .02); ctx.scale(.55, .55);
  if (ch) chernoCeu(f, SOB.clima === "emissao"); else sobCeu(f);
  if (est === "apartamento") { acesas = .02; ctx.translate(0, -H * .2); cidade(); }
  else if (est === "sovietico") { rodaGigante(W * .5, H * .4, H * .1, t); blocoSovietico(W * .1, H * .62, W * .3, H * .3, t, 0, "#1c1e18"); }
  else if (est === "cabana") { for (let i = 0; i < 8; i++) (ch ? pinheiroVermelho : (x, b, h) => arvore(x, b, h, "#14181a", .26))(W * (i / 7) * 1.6, H * .62, H * .3, i); }
  else if (est === "fazenda") { ctx.fillStyle = "#2a2a18"; ctx.fillRect(0, H * .5, W * 2, H); for (let i = 0; i < 12; i++) plantinha(W * i * .15, H * .52, 2); }
  ctx.restore();
  ctx.strokeStyle = "#1a120a"; ctx.lineWidth = 6; ctx.strokeRect(jx, jy, jw, jh); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(jx + jw / 2, jy); ctx.lineTo(jx + jw / 2, jy + jh); ctx.stroke();
  if (est === "cela") { ctx.strokeStyle = "#555"; ctx.lineWidth = 3; for (let i = 1; i < 6; i++) { ctx.beginPath(); ctx.moveTo(jx + jw * i / 6, jy); ctx.lineTo(jx + jw * i / 6, jy + jh); ctx.stroke(); } }
  sobTabuas(jx, jy, jw, jh, Math.min(4, Math.round(SOB.defesa / 15)));
  if (!noiteFora) { const g = ctx.createLinearGradient(jx, jy, jx - W * .2, chao); g.addColorStop(0, "rgba(255,240,210,.12)"); g.addColorStop(1, "rgba(255,240,210,0)"); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(jx, jy); ctx.lineTo(jx + jw, jy); ctx.lineTo(jx + jw - W * .1, chao); ctx.lineTo(jx - W * .3, chao); ctx.fill(); }
  // chão
  ctx.fillStyle = P[2]; ctx.fillRect(0, chao, W, H);
  ctx.strokeStyle = "rgba(255,255,255,.03)"; for (let x = 0; x < W; x += 30) { ctx.beginPath(); ctx.moveTo(x, chao); ctx.lineTo(x - 20, H); ctx.stroke(); }
  if (est === "apartamento" || est === "sovietico") { ctx.fillStyle = est === "sovietico" ? "#5a2a20" : "#3a2a3a"; ctx.beginPath(); ctx.ellipse(W * .48, chao + H * .05, W * .28, H * .03, 0, 0, 7); ctx.fill(); }
  // decoração do estilo
  if (est === "apartamento") { ctx.fillStyle = "#1a1a1e"; ctx.fillRect(W * .04, chao - H * .2, W * .1, H * .2); ctx.fillStyle = "#2a2a30"; ctx.fillRect(W * .045, chao - H * .19, W * .09, H * .06); ctx.fillStyle = "rgba(255,255,255,.1)"; ctx.fillRect(W * .12, chao - H * .15, 3, H * .03); /* geladeira */
    ctx.fillStyle = "#1e1e22"; ctx.fillRect(W * .74, chao - H * .055, W * .12, H * .055); ctx.fillStyle = "#0c0c0e"; ctx.fillRect(W * .755, chao - H * .05, W * .09, H * .04); /* tv */ }
  if (est === "sovietico") { ctx.fillStyle = "#7a2a20"; ctx.fillRect(W * .06, H * .1, W * .2, H * .14); ctx.strokeStyle = "#c8a040"; ctx.lineWidth = 1; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(W * .16, H * .17, 6 + i * 6, 0, 7); ctx.stroke(); } /* tapete na parede */
    ctx.fillStyle = "#e0d8c0"; ctx.fillRect(W * .3, H * .12, W * .08, H * .09); ctx.fillStyle = "#8a2a20"; ctx.font = `800 9px "JetBrains Mono", monospace`; ctx.fillText("1986", W * .31, H * .15); ctx.fillText("АПР", W * .31, H * .18); }
  if (est === "cabana") { const lx = W * .06; ctx.fillStyle = "#3a3028"; ctx.fillRect(lx, chao - H * .2, W * .18, H * .2); ctx.fillStyle = "#1a1410"; ctx.fillRect(lx + W * .03, chao - H * .1, W * .12, H * .1); fogueira(lx + W * .09, chao - H * .01, t, .45);
    ctx.strokeStyle = "#d8c8a8"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(W * .38, H * .1); ctx.lineTo(W * .34, H * .04); ctx.moveTo(W * .38, H * .1); ctx.lineTo(W * .36, H * .05); ctx.moveTo(W * .42, H * .1); ctx.lineTo(W * .46, H * .04); ctx.moveTo(W * .42, H * .1); ctx.lineTo(W * .44, H * .05); ctx.stroke(); ctx.fillStyle = "#4a3020"; ctx.beginPath(); ctx.ellipse(W * .4, H * .12, 8, 10, 0, 0, 7); ctx.fill(); /* chifres */
    for (let i = 0; i < 6; i++) { ctx.fillStyle = i % 2 ? "#5a3a1a" : "#6a4a2a"; ctx.beginPath(); ctx.arc(W * .27 + (i % 3) * 10, chao - 6 - Math.floor(i / 3) * 10, 5, 0, 7); ctx.fill(); } /* lenha */ }
  if (est === "fazenda") { ctx.fillStyle = "#2a2a2a"; ctx.fillRect(W * .04, chao - H * .14, W * .16, H * .14); ctx.fillStyle = "#1a1a1a"; ctx.fillRect(W * .06, chao - H * .16, W * .12, H * .02); fogueira(W * .12, chao - H * .03, t, .25); ctx.fillStyle = "#3a3a3a"; ctx.fillRect(W * .1, 0, 8, chao - H * .16);
    for (let i = 0; i < 5; i++) { ctx.fillStyle = "#e0c592"; ctx.beginPath(); ctx.arc(W * .3, H * .08 + i * 9, 4, 0, 7); ctx.fill(); } ctx.strokeStyle = "#7aa04a"; ctx.beginPath(); ctx.moveTo(W * .3, H * .04); ctx.lineTo(W * .3, H * .08); ctx.stroke(); /* trança de cebolas */ }
  if (est === "cela") { ctx.fillStyle = "#3a3e44"; ctx.fillRect(W * .04, chao - H * .12, W * .26, 6); ctx.fillRect(W * .04, chao - H * .04, W * .26, 6); ctx.fillRect(W * .04, chao - H * .12, 4, H * .12); ctx.fillRect(W * .29, chao - H * .12, 4, H * .12); ctx.strokeStyle = "#555"; ctx.lineWidth = 3; for (let i = 0; i < 10; i++) { ctx.beginPath(); ctx.moveTo(W * (.88 + (i % 2) * .05), 0); ctx.lineTo(W * (.88 + (i % 2) * .05), chao); ctx.stroke(); } }
  if (est === "bunker") { for (let i = 0; i < 3; i++) { ctx.fillStyle = "#1a2a1a"; ctx.fillRect(W * (.04 + i * .1), H * .14, W * .08, H * .12); for (let k = 0; k < 4; k++) { ctx.fillStyle = cvRnd(Math.floor(t * 3) + i * 4 + k) < .5 ? "rgba(120,255,120,.8)" : "rgba(255,80,60,.6)"; ctx.fillRect(W * (.05 + i * .1) + k * 6, H * .16, 3, 3); } }
    ctx.fillStyle = "#2a3a2a"; ctx.fillRect(W * .04, H * .28, W * .28, H * .04); }
  // luz da casa
  const lamp = .8 + .2 * Math.sin(t * 7) * Math.sin(t * 2.3);
  ctx.strokeStyle = "#111"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(W * .45, 0); ctx.lineTo(W * .45, H * .08); ctx.stroke();
  ctx.fillStyle = `rgba(255,210,140,${lamp})`; ctx.beginPath(); ctx.arc(W * .45, H * .09, 5, 0, 7); ctx.fill(); luzCor(W * .45, H * .2, H * .45, .22 * lamp, "255,200,130");
  // prateleira de comida (os itens que você tem)
  const comidas = Object.entries(SOB.inv).filter(([k, v]) => ITENS[k] && ITENS[k].tipo === "comida" && v > 0).flatMap(([k, v]) => Array(Math.min(v, 3)).fill(k)).slice(0, 9);
  const sx = W * .2, sy = H * .24, sw = W * .32;
  ctx.fillStyle = "#4a3220"; ctx.fillRect(sx, sy, sw, 5); ctx.fillRect(sx, sy + H * .085, sw, 5);
  comidas.forEach((k, i) => desenhaItemCena(k, sx + 12 + (i % 5) * (sw - 20) / 5, sy - 10 + Math.floor(i / 5) * H * .085 + 1, 22));
  // armas na parede
  ["espingarda", "rifle", "besta", "faca"].filter(k => qtd(k)).forEach((k, i) => desenhaItemCena(k, W * (.6 + i * .09), chao - H * .17 - (i % 2) * 12, 36, -.25));
  // mesa com cura e ferramentas
  const mx = W * .55, my = chao - H * .07;
  ctx.fillStyle = "#4a3220"; ctx.fillRect(mx, my, W * .3, 6); ctx.fillRect(mx + 6, my, 5, H * .07); ctx.fillRect(mx + W * .3 - 11, my, 5, H * .07);
  const mesa = ["kit", "remedio", "bandagem", "iodo", "geiger", "vodka", "artefato", "pecas", "filtro"].filter(k => qtd(k)).slice(0, 5);
  mesa.forEach((k, i) => desenhaItemCena(k, mx + 14 + i * (W * .3 - 20) / 5, my - 9, 20));
  if (qtd("artefato")) luzCor(mx + 14 + mesa.indexOf("artefato") * (W * .3 - 20) / 5, my - 9, 30, .5 + .3 * Math.sin(t * 3), "160,255,230");
  // chão: madeira, munição, sucata, sementes
  for (let i = 0; i < Math.min(5, Math.ceil(qtd("material") / 3)); i++) { ctx.fillStyle = i % 2 ? "#6a4a2a" : "#5a3c22"; ctx.fillRect(W * .04, chao + H * .02 - i * 5, W * .16, 4); }
  if (qtd("municao")) desenhaItemCena("municao", W * .9, chao + H * .02, 22);
  if (qtd("sucata")) desenhaItemCena("sucata", W * .82, chao + H * .03, 20);
  const sem = Object.keys(SOB.inv).filter(k => ITENS[k] && ITENS[k].tipo === "semente" && SOB.inv[k] > 0).slice(0, 3);
  sem.forEach((k, i) => desenhaItemCena(k, W * (.24 + i * .05), chao + H * .025, 18, (i - 1) * .2));
  // vasos da horta perto da janela (cidade e Pripyat)
  if ((est === "apartamento" || est === "sovietico") && (SOB.horta || []).length) SOB.horta.forEach((h, i) => { const vx = jx + 10 + i * 30; ctx.fillStyle = "#8a4a2a"; ctx.fillRect(vx, jy + jh + 2, 18, 12); if (h) plantinha(vx + 9, jy + jh + 2, h.dias <= 0 ? .9 : .5); });
  // companheiros sentados e você
  SOB.grupo.forEach((g, i) => pessoa(W * (.12 + i * .09), chao + H * .045, H * .17, { sentado: true, cor: "#08090c", aro: "rgba(255,200,130,.25)", cabeca: Math.sin(t * .4 + i) > .6 ? 1 : 0 }));
  if (!p.semEu) pessoa(W * .45, chao + H * .045, H * .2, { cabeca: Math.sin(t * .5) > .7 ? -1 : 0, aro: "rgba(255,200,130,.3)" });
  if (ch && SOB.rad > 30) particulasRad(t, Math.round(SOB.rad / 8));
}
// o interior também vale para as casas nos lugares originais
const _sobBase = sobBase, _chernoBase = chernoBase;
sobBase = function (t, p) { if (SOB && ehCasa() && !p.noite && !(sobCena && sobCena.tipo === "visita") && !(sobCena && sobCena.tipo === "acao" && FORA.includes(sobCena.acao))) return desenhaInterior(t, p); return _sobBase(t, p); };
chernoBase = function (t, p) { if (SOB && ehCasa() && !p.noite && !(sobCena && sobCena.tipo === "visita") && !(sobCena && sobCena.tipo === "acao" && FORA.includes(sobCena.acao))) return desenhaInterior(t, p); return _chernoBase(t, p); };
// pré-carrega os desenhos dos itens para a cena
Object.keys(ITENS).forEach(k => imgItem(k));
