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
  if (ehCasa() && !p.fora) return desenhaInterior(t, p);
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
const FORA = ["plantar", "colher", "regar", "cacar", "vigiar", "saquear"];
const _desenhaFundoAtual = desenhaFundoAtual;
desenhaFundoAtual = function (t, p) {
  const ac = sobCena && sobCena.tipo === "acao" ? sobCena.acao : null;
  if (ehCasa() && !FORA.includes(ac)) return desenhaInterior(t, p);
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
/* ---------- interior em corte (vista de lado): corredor/lado de fora à esquerda,
   parede com a porta, cômodo com mesa e cadeiras, janela à direita ---------- */
window.sobEmCasaT = 0; // enquanto a cena é dentro de casa, a chuva só aparece lá fora
function ceuSimples(f, ch) {
  const dia = ch ? [120, 130, 110] : [140, 165, 185], tarde = [190, 120, 80], noite = [10, 14, 24];
  const mix = (a, b, k) => a.map((v, i) => Math.round(v + (b[i] - v) * k));
  return `rgb(${(f < .5 ? mix(dia, tarde, f * 2) : mix(tarde, noite, Math.min(1, (f - .5) * 2.2))).join(",")})`;
}
function chuvaNaArea(t, x, y, w, h, n = 26, a = .45) {
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.strokeStyle = `rgba(190,205,225,${a})`; ctx.lineWidth = 1; ctx.beginPath();
  for (let i = 0; i < n; i++) { const yy = y + ((i * 53.7 + t * 420) % (h + 30)) - 15, xx = x + ((i * 37.3 + t * 60) % (w + 20)) - 10; ctx.moveTo(xx, yy); ctx.lineTo(xx - 3, yy + 10); }
  ctx.stroke(); ctx.restore();
}
function cadeira(x, chao, h, dir) { // encosto do lado de trás de quem senta
  const s = h * .28; ctx.fillStyle = "#3a2616"; ctx.fillRect(x - h * .1, chao - s, h * .22, 4);
  ctx.fillRect(x - h * .08, chao - s, 3, s); ctx.fillRect(x + h * .1, chao - s, 3, s);
  const ex = dir > 0 ? x - h * .1 : x + h * .1; ctx.fillRect(ex, chao - s - h * .3, 4, h * .3);
}
function desenhaInterior(t, p) {
  window.sobEmCasaT = performance.now();
  const est = estiloCasa(), ch = SOB.modo === "cherno", chao = H * .6, noite = !!p.noite, c = sobCena || {};
  const f = noite ? 1 : Math.min(.95, SOB.gasta / Math.max(3, energiaMax()) * .9), escuroFora = f > .55, chove = SOB.clima === "chuva";
  const fora = ["cabana", "fazenda"].includes(est), wx = W * .25, wt = 10, dh = H * .27, pe = chao + H * .045, hp = H * .2;
  const P = { apartamento: ["#2a2a32", "#33333c", "#1c1a1a"], sovietico: ["#3a3424", "#4a4230", "#22201a"], cabana: ["#3a2614", "#4a3018", "#22160c"], fazenda: ["#4a3a28", "#5a4a32", "#2a2014"], cela: ["#2a2c2e", "#34373a", "#1a1b1c"], bunker: ["#262a26", "#2e332e", "#161816"] }[est];
  const quem = c.tipo === "visita" ? c.quem : c.porta || null, segura = c.segura !== false;

  /* ===== lado de fora / corredor (esquerda) ===== */
  if (fora) {
    const g = ctx.createLinearGradient(0, 0, 0, chao); g.addColorStop(0, ceuSimples(Math.min(1, f + .15), ch)); g.addColorStop(1, ceuSimples(f, ch));
    ctx.fillStyle = g; ctx.fillRect(0, 0, wx, chao);
    if (f > .7) { ctx.fillStyle = "rgba(230,230,210,.8)"; ctx.beginPath(); ctx.arc(wx * .35, H * .12, 6, 0, 7); ctx.fill(); }
    else if (!chove) { luzCor(wx * .3, H * .1, wx * .6, .35, "255,230,170"); }
    for (let i = 0; i < 4; i++) (ch ? pinheiroVermelho : (x, b, h) => arvore(x, b, h, f > .7 ? "#06080a" : "#161a1c", .3))(wx * (i / 3) - 4, chao - H * .03, H * (.2 + cvRnd(i + 9) * .14), i + 3);
    ctx.fillStyle = est === "fazenda" ? "#24200f" : "#161a10"; ctx.fillRect(0, chao - H * .035, wx, H);
    ctx.fillStyle = "#3a2816"; ctx.fillRect(0, chao - 5, wx, 7); for (let x = 4; x < wx; x += 14) { ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.fillRect(x, chao - 5, 1, 7); } // varanda
    for (let i = 0; i < 5; i++) { ctx.fillStyle = f > .7 ? "#05070a" : (ch ? "#2a160e" : "#141a12"); ctx.beginPath(); ctx.ellipse(wx * (i / 4), chao - H * .04, wx * .2, H * .045, 0, 0, 7); ctx.fill(); } // moita
    ctx.fillStyle = "#3a2816"; for (let x = 6; x < wx; x += 16) ctx.fillRect(x, chao - H * .07, 4, H * .07); ctx.fillRect(0, chao - H * .06, wx, 3); // cerquinha da varanda
    if (chove) chuvaNaArea(t, 0, 0, wx, chao + H * .1, 18, .5);
  } else if (est === "cela") {
    ctx.fillStyle = "#1e2022"; ctx.fillRect(0, 0, wx, chao); ctx.fillStyle = "#2c2e30"; for (let y = 0; y < chao; y += 22) for (let x = (y / 22) % 2 * 18; x < wx; x += 36) ctx.fillRect(x, y, 34, 20);
    ctx.strokeStyle = "#45484c"; ctx.lineWidth = 2; for (let x = 6; x < wx * .6; x += 9) { ctx.beginPath(); ctx.moveTo(x, chao - H * .28); ctx.lineTo(x, chao); ctx.stroke(); } // cela da frente
    const pis = cvRnd(Math.floor(t * 4)) < .12 ? .2 : 1; ctx.fillStyle = `rgba(230,240,255,${.8 * pis})`; ctx.fillRect(wx * .3, H * .04, wx * .4, 3); luzCor(wx * .5, H * .1, wx, .3 * pis, "230,240,255");
  } else if (est === "bunker") {
    ctx.fillStyle = "#0e100e"; ctx.fillRect(0, 0, wx, chao);
    ctx.strokeStyle = "#2a302a"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, H * .12); ctx.lineTo(wx, H * .12); ctx.moveTo(0, H * .16); ctx.lineTo(wx, H * .16); ctx.stroke();
    ctx.fillStyle = "#1a1e1a"; for (let i = 0; i < 3; i++) ctx.fillRect(wx * (.1 + i * .3), H * .2, 4, chao - H * .2);
    luzCor(wx * .5, H * .25, wx * .8, .3 + .2 * Math.sin(t * 3), "255,40,30"); ctx.fillStyle = `rgba(255,60,40,${.6 + .3 * Math.sin(t * 3)})`; ctx.fillRect(wx * .45, H * .22, 8, 5);
  } else { // corredor do prédio
    ctx.fillStyle = est === "sovietico" ? "#3a3a2c" : "#1e1e26"; ctx.fillRect(0, 0, wx, chao);
    ctx.fillStyle = est === "sovietico" ? "#2a3a2c" : "#26262e"; ctx.fillRect(0, chao * .58, wx, chao * .42); ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.fillRect(0, chao * .58, wx, 3);
    ctx.fillStyle = est === "sovietico" ? "#4a2a20" : "#2e2620"; ctx.fillRect(wx * .12, chao - H * .25, wx * .42, H * .25); // porta do vizinho
    ctx.fillStyle = "rgba(220,210,180,.55)"; ctx.font = `700 9px "JetBrains Mono", monospace`; ctx.fillText(est === "sovietico" ? "46" : "301", wx * .22, chao - H * .2);
    if (est === "sovietico") { ctx.fillStyle = "#4a4a3a"; for (let i = 0; i < 3; i++) ctx.fillRect(wx * .62, H * .2 + i * 12, wx * .3, 9); ctx.fillStyle = "rgba(160,40,30,.5)"; ctx.font = `800 10px "Big Shoulders Display", sans-serif`; ctx.fillText("СТАЛКЕР", wx * .05, H * .15); } // caixas de correio e pichação
    else { ctx.strokeStyle = "#4a4e56"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(wx * .62, chao - H * .14); ctx.lineTo(wx * .95, chao - H * .14); ctx.stroke(); ctx.fillStyle = "#c83a2a"; ctx.fillRect(wx * .7, chao - H * .32, 8, 14); } // corrimão e extintor
    const pis = cvRnd(Math.floor(t * 5)) < .12 ? .15 : 1; ctx.fillStyle = `rgba(255,240,200,${.75 * pis})`; ctx.fillRect(wx * .3, H * .03, wx * .4, 3); luzCor(wx * .5, H * .1, wx * 1.1, .28 * pis, "255,235,190");
    ctx.fillStyle = "#2a2a2e"; ctx.fillRect(0, chao, wx, H); // chão cinza do corredor
  }
  detalhesFora(t, est, wx, chao, fora);
  if (noite) { ctx.fillStyle = "rgba(2,3,8,.35)"; ctx.fillRect(0, 0, wx, H); }
  if (quem === "horda") { const pis = cvRnd(Math.floor(t * 7)) < .3 ? .3 : 1; luzCor(wx * .5, chao - H * .2, wx * 1.2, .4 * pis, ch ? "190,255,140" : "255,120,90"); }

  // quem está do lado de fora
  const k = cvSuave(cvSeg(t, .2, 2.2)), alvo = wx - W * .07, agoraMs = performance.now();
  const ab = c.abrir ? Math.min(1, (agoraMs - c.abrir) / 550) : 0, entrando = (quem === "pessoa" || quem === "mercador") && c.abrir ? cvSuave(Math.max(0, Math.min(1, (agoraMs - c.abrir - 450) / 1300))) : 0;
  const bate = k >= 1 && !c.abrir && !c.fresta && (t % 3.2) < 1.1 ? 1 : 0;
  if (quem === "pessoa" || quem === "mercador" || quem === "bandidos") {
    const n = quem === "bandidos" ? 3 : 1;
    for (let i = n - 1; i >= 0; i--) { const x = cvMix(-W * .12 - i * W * .08, alvo - i * W * .065, k); if (i === 0 && entrando > 0) continue;
      pessoa(x, pe, hp * (1 - i * .03), { fase: t * 4 + i, anda: k < 1 ? .85 : 0, dir: 1, bater: i === 0 && quem !== "bandidos" ? bate : 0, mochila: quem !== "bandidos", capacete: ch, luz: noite || (quem === "bandidos" && i === 1), luzRgb: "255,230,200",
        cor: quem === "bandidos" ? "#030303" : "#07080b", aro: quem === "bandidos" ? "rgba(226,72,61,.35)" : quem === "mercador" ? "rgba(255,200,110,.35)" : "rgba(200,210,230,.25)" }); }
    if (quem === "pessoa" && c.crianca && entrando <= 0) pessoa(cvMix(-W * .2, alvo - W * .08, k), pe, hp * .6, { fase: t * 4 + 1, anda: k < 1 ? .85 : 0, dir: 1 });
    if (bate && (t % 3.2) < 1.1) { ctx.fillStyle = "rgba(230,225,210,.55)"; ctx.font = `800 ${Math.max(10, hp * .1)}px "Big Shoulders Display", sans-serif`; ctx.fillText("TOC TOC", wx - W * .09, pe - hp * 1.12); }
    if (quem === "mercador" && entrando <= 0) { const lx = cvMix(-W * .12, alvo, k) + hp * .12; luzCor(lx, pe - hp * .5, wx * .8, .5, "255,200,110"); ctx.fillStyle = "rgba(255,210,120,.95)"; ctx.fillRect(lx - 2, pe - hp * .52, 5, 7); }
  } else if (quem === "horda") {
    const rec = c.recuam ? cvSuave(Math.min(1, (performance.now() - c.recuam) / 1400)) : 0;
    for (let i = 0; i < 4; i++) { const bx = wx * (.15 + i * .22) + Math.sin(t * 2.2 + i) * 4 - rec * W * (.25 + i * .05);
      if (ch) monstro(bx, pe - 2, H * .12, { quatro: true, dir: 1, olhosRgb: "190,255,120", cor: "#0b0d08" }); else zumbi(bx, pe, hp * (.95 - (i % 2) * .06), { dir: 1, olhos: .6 }); }
    if (!segura && !c.segurando && !c.recuam && !ch) zumbi(wx + W * .06 + Math.sin(t * 3) * 3, pe, hp, { dir: 1, olhos: .8 }); // um já está entrando
  } else if (quem === "barulho") {
    const x = ((t * .2) % 1.3) * wx - wx * .15; ctx.fillStyle = "rgba(0,0,0,.75)"; ctx.beginPath(); ctx.ellipse(x, pe - hp * .5, hp * .14, hp * .5, 0, 0, 7); ctx.fill();
  } else if (noite && (t % 18) < 7) { // à noite, às vezes algo passa lá fora
    const k2 = (t % 18) / 7, x = k2 < .5 ? cvMix(-W * .1, alvo, k2 * 2) : cvMix(alvo, -W * .1, (k2 - .5) * 2);
    if (ch) monstro(x, pe - 2, H * .1, { quatro: true, dir: k2 < .5 ? 1 : -1, olhosRgb: "190,255,120", cor: "#050604" }); else zumbi(x, pe, hp * .95, { dir: k2 < .5 ? 1 : -1, olhos: .3, fase: t * 3, anda: .5 });
  }

  /* ===== o cômodo (direita) ===== */
  ctx.save(); ctx.beginPath(); ctx.rect(wx, 0, W - wx, H); ctx.clip();
  ctx.fillStyle = P[0]; ctx.fillRect(wx, 0, W, chao);
  if (est === "cabana") { for (let i = 0; i < 12; i++) { const y = i * chao / 12; ctx.fillStyle = i % 2 ? P[0] : P[1]; ctx.fillRect(wx, y, W, chao / 12); ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.fillRect(wx, y + chao / 12 - 2, W, 2); ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.beginPath(); ctx.arc(W - 6 - (i % 2) * 6, y + chao / 24, chao / 28, 0, 7); ctx.fill(); } }
  else if (est === "apartamento" || est === "sovietico") { ctx.fillStyle = P[1]; ctx.globalAlpha = .35; for (let x = wx; x < W; x += 26) for (let y = 0; y < chao; y += 26) { ctx.beginPath(); ctx.arc(x + ((y / 26) % 2) * 13, y, 3, 0, 7); ctx.fill(); } ctx.globalAlpha = 1; ctx.fillStyle = "rgba(0,0,0,.2)"; ctx.fillRect(wx, chao * .72, W, 4); ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.fillRect(wx, chao - 8, W, 8); }
  else if (est === "cela" || est === "bunker") { ctx.fillStyle = P[1]; for (let y = 0; y < chao; y += 22) for (let x = (y / 22) % 2 * 20; x < W; x += 40) ctx.fillRect(wx + x, y, 38, 20); if (est === "bunker") { ctx.fillStyle = "#3a4038"; ctx.fillRect(wx, H * .03, W, 8); } }
  else { ctx.fillStyle = P[1]; for (let x = wx; x < W; x += 18) ctx.fillRect(x, 0, 9, chao); }
  ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.fillRect(wx, 0, W, H * .025); // teto

  // janela (direita) com chuva só do lado de fora
  const cel = est === "cela", jx = cel ? W * .72 : W * .66, jy = cel ? H * .16 : H * .17, jw = cel ? W * .2 : W * .3, jh = cel ? H * .1 : H * .18;
  ctx.save(); ctx.beginPath(); ctx.rect(jx, jy, jw, jh); ctx.clip();
  ctx.translate(jx - W * .1, jy - H * .02); ctx.scale(.55, .55);
  if (ch) chernoCeu(f, SOB.clima === "emissao"); else sobCeu(f);
  if (est === "apartamento") { acesas = .02; ctx.translate(0, -H * .2); cidade(); }
  else if (est === "sovietico") { rodaGigante(W * .5, H * .4, H * .1, t); blocoSovietico(W * .1, H * .62, W * .3, H * .3, t, 0, "#1c1e18"); }
  else if (est === "cabana") { for (let i = 0; i < 8; i++) (ch ? pinheiroVermelho : (x, b, h) => arvore(x, b, h, "#14181a", .26))(W * (i / 7) * 1.6, H * .62, H * .3, i); }
  else if (est === "fazenda") { ctx.fillStyle = "#2a2a18"; ctx.fillRect(0, H * .5, W * 2, H); for (let i = 0; i < 12; i++) plantinha(W * i * .15, H * .52, 2); }
  ctx.restore();
  if (quem === "horda") for (let i = 0; i < 3; i++) { const hx = jx + jw * (.2 + i * .3) + Math.sin(t * 1.5 + i) * 5, hy = jy + jh * .78; ctx.fillStyle = "rgba(4,5,4,.9)"; ctx.beginPath(); ctx.arc(hx, hy, jh * .17, 0, 7); ctx.fill(); ctx.fillRect(hx - jh * .22, hy + jh * .1, jh * .44, jh * .2); ctx.fillStyle = ch ? "rgba(190,255,120,.7)" : "rgba(230,220,200,.45)"; ctx.fillRect(hx - 4, hy - 2, 2, 2); ctx.fillRect(hx + 2, hy - 2, 2, 2); }
  if (chove) { chuvaNaArea(t, jx, jy, jw, jh, 22, .55); ctx.strokeStyle = "rgba(200,215,235,.35)"; ctx.lineWidth = 1.2; for (let i = 0; i < 6; i++) { const gx = jx + 6 + cvRnd(i) * (jw - 12), gy = jy + ((t * 14 + i * 23) % jh); ctx.beginPath(); ctx.moveTo(gx, gy - 6); ctx.lineTo(gx, gy); ctx.stroke(); } }
  ctx.strokeStyle = "#1a120a"; ctx.lineWidth = 6; ctx.strokeRect(jx, jy, jw, jh); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(jx + jw / 2, jy); ctx.lineTo(jx + jw / 2, jy + jh); ctx.stroke();
  ctx.fillStyle = "#2a1c10"; ctx.fillRect(jx - 6, jy + jh, jw + 12, 5); // parapeito
  if (cel) { ctx.strokeStyle = "#555"; ctx.lineWidth = 3; for (let i = 1; i < 6; i++) { ctx.beginPath(); ctx.moveTo(jx + jw * i / 6, jy); ctx.lineTo(jx + jw * i / 6, jy + jh); ctx.stroke(); } }
  else if (est === "apartamento" || est === "sovietico") { ctx.fillStyle = est === "sovietico" ? "rgba(200,190,150,.35)" : "rgba(150,40,40,.35)"; ctx.fillRect(jx - 12, jy - 6, 10, jh + 10); ctx.fillRect(jx + jw + 2, jy - 6, 10, jh + 10); } // cortinas
  sobTabuas(jx, jy, jw, jh, Math.min(4, Math.round(SOB.defesa / 15)));
  if (!escuroFora && !chove) { const g = ctx.createLinearGradient(jx, jy, jx - W * .15, chao); g.addColorStop(0, "rgba(255,240,210,.1)"); g.addColorStop(1, "rgba(255,240,210,0)"); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(jx, jy + jh); ctx.lineTo(jx + jw, jy + jh); ctx.lineTo(jx + jw - W * .05, chao); ctx.lineTo(jx - W * .2, chao); ctx.fill(); }
  // vasos da horta no parapeito (cidade e Pripyat)
  if ((est === "apartamento" || est === "sovietico") && (SOB.horta || []).length) SOB.horta.forEach((h, i) => { const vx = jx + 8 + i * 28; ctx.fillStyle = "#8a4a2a"; ctx.fillRect(vx, jy + jh - 9, 16, 9); if (h) plantinha(vx + 8, jy + jh - 9, h.dias <= 0 ? .8 : .45); });

  // chão do cômodo
  ctx.fillStyle = P[2]; ctx.fillRect(wx, chao, W, H);
  ctx.strokeStyle = "rgba(255,255,255,.04)"; for (let x = wx; x < W; x += 30) { ctx.beginPath(); ctx.moveTo(x, chao); ctx.lineTo(x - 20, H); ctx.stroke(); }
  if (est === "apartamento" || est === "sovietico") { ctx.fillStyle = est === "sovietico" ? "#5a2a20" : "#3a2a3a"; ctx.beginPath(); ctx.ellipse(W * .65, chao + H * .04, W * .24, H * .025, 0, 0, 7); ctx.fill(); }

  // decoração de cada tipo de casa (perto da parede)
  const dx0 = W * .28;
  if (est === "apartamento") { ctx.fillStyle = "#1a1a1e"; ctx.fillRect(dx0, chao - H * .22, W * .09, H * .22); ctx.fillStyle = "#24242a"; ctx.fillRect(dx0 + 2, chao - H * .21, W * .09 - 4, H * .06); ctx.fillStyle = "rgba(255,255,255,.12)"; ctx.fillRect(dx0 + W * .07, chao - H * .14, 3, H * .03); /* geladeira */
    ctx.fillStyle = "#e0d8c0"; ctx.fillRect(W * .44, H * .08, W * .06, H * .05); ctx.fillStyle = "#2a2a2a"; ctx.fillRect(W * .445, H * .085, W * .05, H * .03); /* quadro */ }
  if (est === "sovietico") { ctx.fillStyle = "#7a2a20"; ctx.fillRect(dx0, H * .06, W * .14, H * .1); ctx.strokeStyle = "#c8a040"; ctx.lineWidth = 1; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(dx0 + W * .07, H * .11, 5 + i * 5, 0, 7); ctx.stroke(); }
    ctx.fillStyle = "#e0d8c0"; ctx.fillRect(dx0 + W * .02, chao - H * .2, W * .07, H * .08); ctx.fillStyle = "#8a2a20"; ctx.font = `800 8px "JetBrains Mono", monospace`; ctx.fillText("1986", dx0 + W * .025, chao - H * .17); ctx.fillText("АПР", dx0 + W * .025, chao - H * .14);
    ctx.fillStyle = "#3a2a1c"; ctx.fillRect(dx0, chao - H * .1, W * .1, H * .1); ctx.fillStyle = "#1a1a14"; ctx.fillRect(dx0 + 4, chao - H * .09, W * .1 - 8, H * .05); /* rádio velho */ }
  if (est === "cabana") { ctx.fillStyle = "#3a3028"; ctx.fillRect(dx0, chao - H * .2, W * .13, H * .2); ctx.fillStyle = "#1a1410"; ctx.fillRect(dx0 + W * .02, chao - H * .1, W * .09, H * .1); fogueira(dx0 + W * .065, chao - H * .01, t, .4); ctx.fillStyle = "#3a3028"; ctx.fillRect(dx0 + W * .035, 0, W * .06, chao - H * .2);
    ctx.strokeStyle = "#d8c8a8"; ctx.lineWidth = 2.5; const ax = W * .47, ay = H * .09; ctx.beginPath(); ctx.moveTo(ax - 2, ay); ctx.lineTo(ax - 6, ay - 7); ctx.moveTo(ax + 2, ay); ctx.lineTo(ax + 6, ay - 7); ctx.stroke(); ctx.fillStyle = "#4a3020"; ctx.beginPath(); ctx.ellipse(ax, ay + 3, 6, 8, 0, 0, 7); ctx.fill(); /* chifres */
    for (let i = 0; i < 6; i++) { ctx.fillStyle = i % 2 ? "#5a3a1a" : "#6a4a2a"; ctx.beginPath(); ctx.arc(dx0 + W * .15 + (i % 3) * 9, chao - 5 - Math.floor(i / 3) * 9, 5, 0, 7); ctx.fill(); } /* lenha */ }
  if (est === "fazenda") { ctx.fillStyle = "#2a2a2a"; ctx.fillRect(dx0, chao - H * .14, W * .13, H * .14); ctx.fillStyle = "#1a1a1a"; ctx.fillRect(dx0 + 4, chao - H * .16, W * .13 - 8, H * .02); fogueira(dx0 + W * .065, chao - H * .03, t, .22); ctx.fillStyle = "#3a3a3a"; ctx.fillRect(dx0 + W * .05, 0, 7, chao - H * .16);
    for (let i = 0; i < 5; i++) { ctx.fillStyle = "#e0c592"; ctx.beginPath(); ctx.arc(W * .47, H * .07 + i * 8, 4, 0, 7); ctx.fill(); } ctx.strokeStyle = "#7aa04a"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(W * .47, H * .03); ctx.lineTo(W * .47, H * .07); ctx.stroke(); /* trança de cebolas */ }
  if (est === "cela") { ctx.fillStyle = "#3a3e44"; ctx.fillRect(dx0, chao - H * .2, W * .2, 5); ctx.fillRect(dx0, chao - H * .08, W * .2, 5); ctx.fillRect(dx0, chao - H * .2, 4, H * .2); ctx.fillRect(dx0 + W * .2 - 4, chao - H * .2, 4, H * .2); ctx.fillStyle = "#5a5e64"; ctx.fillRect(dx0 + 4, chao - H * .215, W * .2 - 8, 4); ctx.fillRect(dx0 + 4, chao - H * .095, W * .2 - 8, 4); /* beliche */ }
  if (est === "bunker") { for (let i = 0; i < 2; i++) { ctx.fillStyle = "#1a2a1a"; ctx.fillRect(dx0 + i * W * .075, H * .3, W * .065, H * .1); for (let q = 0; q < 4; q++) { ctx.fillStyle = cvRnd(Math.floor(t * 3) + i * 4 + q) < .5 ? "rgba(120,255,120,.8)" : "rgba(255,80,60,.6)"; ctx.fillRect(dx0 + i * W * .075 + 4 + q * 5, H * .32, 3, 3); } }
    ctx.fillStyle = "#2a3a2a"; ctx.fillRect(dx0, H * .41, W * .15, H * .03); ctx.strokeStyle = "#3a4038"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(W, H * .06); ctx.lineTo(wx, H * .06); ctx.stroke(); }

  detalhesCasa(t, est, wx, chao, noite);
  // prateleiras de comida (os itens que você tem)
  const comidas = Object.entries(SOB.inv).filter(([q, v]) => ITENS[q] && ITENS[q].tipo === "comida" && v > 0).flatMap(([q, v]) => Array(Math.min(v, 3)).fill(q)).slice(0, 8);
  const sx = est === "apartamento" || est === "fazenda" || est === "cabana" ? W * .5 : W * .44, sw = W * .62 - sx + W * .04, sy = H * .25;
  ctx.fillStyle = "#4a3220"; ctx.fillRect(sx, sy, sw, 5); ctx.fillRect(sx, sy + H * .08, sw, 5);
  comidas.forEach((q, i) => desenhaItemCena(q, sx + 10 + (i % 4) * (sw - 16) / 4, sy - 10 + Math.floor(i / 4) * H * .08 + 1, 20));
  // armas penduradas embaixo da janela
  ["espingarda", "rifle", "besta", "faca"].filter(q => qtd(q)).forEach((q, i) => desenhaItemCena(q, jx + 18 + i * (jw / 4), jy + jh + H * .07 + (i % 2) * 8, 32, -.2));
  // lâmpada sobre a mesa
  const mx = W * .525, mw = W * .135, my = chao - H * .075, lmp = (noite ? .55 : .8) + .2 * Math.sin(t * 7) * Math.sin(t * 2.3), lx = mx + mw / 2;
  ctx.strokeStyle = "#111"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(lx, H * .025); ctx.lineTo(lx, H * .1); ctx.stroke();
  ctx.fillStyle = "#2a2a2a"; ctx.beginPath(); ctx.moveTo(lx - 9, H * .11); ctx.lineTo(lx + 9, H * .11); ctx.lineTo(lx + 4, H * .095); ctx.lineTo(lx - 4, H * .095); ctx.fill();
  ctx.fillStyle = `rgba(255,210,140,${lmp})`; ctx.beginPath(); ctx.arc(lx, H * .112, 3.5, 0, 7); ctx.fill(); luzCor(lx, H * .22, H * .42, .22 * lmp, "255,200,130");
  // cadeiras e mesa no meio
  const g = SOB.grupo, cx1 = mx - W * .035, cx2 = mx + mw + W * .035;
  cadeira(cx1, chao, H * .17, 1); cadeira(cx2, chao, H * .17, -1);
  ctx.fillStyle = "#4a3220"; ctx.fillRect(mx, my, mw, 6); ctx.fillRect(mx + 5, my, 5, H * .075); ctx.fillRect(mx + mw - 10, my, 5, H * .075);
  const mesa = ["kit", "remedio", "bandagem", "iodo", "geiger", "vodka", "artefato", "pecas", "filtro"].filter(q => qtd(q)).slice(0, 4);
  mesa.forEach((q, i) => desenhaItemCena(q, mx + 12 + i * (mw - 18) / 4, my - 9, 19));
  if (qtd("artefato")) luzCor(mx + 12 + mesa.indexOf("artefato") * (mw - 18) / 4, my - 9, 28, .5 + .3 * Math.sin(t * 3), "160,255,230");
  ctx.fillStyle = "rgba(240,230,210,.7)"; ctx.fillRect(mx + mw - 22, my - 7, 8, 7); luzCor(mx + mw - 18, my - 9, 18, .4 * lmp, "255,200,120"); // vela
  // a cama embaixo da janela (onde você dorme)
  const bx0 = W * .705, bx1 = W * .985, btop = chao - H * .062;
  const investiga = c.investiga ? Math.min(1, (performance.now() - c.investiga) / 1500) : -1;
  const dorme = p.dorme || (c.tipo === "base" && c.noite && (!c.porta || (c.porta === "barulho" && investiga < 0)) ? 1 : 0);
  cama(est, bx0, bx1, btop, chao, t, dorme);
  // chão: madeira, munição, sucata, sementes
  for (let i = 0; i < Math.min(5, Math.ceil(qtd("material") / 3)); i++) { ctx.fillStyle = i % 2 ? "#6a4a2a" : "#5a3c22"; ctx.fillRect(W * .275 + (i % 2) * 3, chao + H * .045 - i * 5, W * .12, 4); ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.fillRect(W * .275 + (i % 2) * 3, chao + H * .045 - i * 5 + 3, W * .12, 1); }
  if (qtd("municao")) desenhaItemCena("municao", W * .66, chao + H * .04, 20);
  if (qtd("sucata")) desenhaItemCena("sucata", W * .6, chao + H * .045, 18);
  Object.keys(SOB.inv).filter(q => ITENS[q] && ITENS[q].tipo === "semente" && SOB.inv[q] > 0).slice(0, 3).forEach((q, i) => desenhaItemCena(q, W * (.46 + i * .04), chao + H * .035, 15, (i - 1) * .2));
  ctx.restore();

  /* ===== parede com a porta ===== */
  const wallCor = { apartamento: "#121216", sovietico: "#1c1a12", cabana: "#2a1a0c", fazenda: "#2e2212", cela: "#2a2c30", bunker: "#1c201c" }[est];
  ctx.fillStyle = wallCor; ctx.fillRect(wx - wt / 2, 0, wt, chao - dh); ctx.fillRect(wx - wt / 2 - 3, chao - dh - 4, wt + 6, 5); // parede e batente de cima
  ctx.fillStyle = "rgba(0,0,0,.4)"; ctx.fillRect(wx - wt / 2 - 3, chao - 1, wt + 6, 3); // soleira
  // (o número do apartamento fica só na porta do vizinho, no corredor)
  // quanto a porta está aberta
  let abre = 0; // a porta fica sempre fechada
  if (c.tipo === "acao" && c.acao === "dormir") abre = cvMix(.35, 0, cvSeg(t, .2, 1));
  if (c.tipo === "visita") abre = c.abrir ? cvSuave(ab) * .95 : c.fresta ? .22 : 0; // só abre se você deixar
  if (quem === "horda") abre = segura ? Math.abs(Math.sin(t * 9)) * .05 : .65 + Math.sin(t * 13) * .08;
  if (quem === "barulho") abre = .08 + Math.sin(t * 1.3) * .03;
  if (c.segurando) abre = Math.abs(Math.sin(t * 11)) * .06;
  const dCor = { apartamento: "#3a2c22", sovietico: "#5a2e22", cabana: "#4a3018", fazenda: "#5a3a22", cela: null, bunker: "#3a403a" }[est];
  const lw = Math.max(wt - 2, W * .13 * Math.sin(abre * PI / 2)), x0 = wx + wt / 2 - 2, top = chao - dh;
  if (cel) { ctx.strokeStyle = "#6a6e74"; ctx.lineWidth = 3; const n = Math.max(1, Math.round(lw / 8)); for (let i = 0; i <= n; i++) { const x = x0 + lw * i / n; ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, chao); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(x0, top + 3); ctx.lineTo(x0 + lw, top + 3); ctx.moveTo(x0, top + dh * .5); ctx.lineTo(x0 + lw, top + dh * .5); ctx.stroke(); }
  else {
    ctx.fillStyle = dCor; ctx.beginPath(); ctx.moveTo(x0, top); ctx.lineTo(x0 + lw, top - lw * .06); ctx.lineTo(x0 + lw, chao + lw * .04); ctx.lineTo(x0, chao); ctx.fill();
    if (lw > 14) {
      if (fora) { ctx.strokeStyle = "rgba(0,0,0,.35)"; ctx.lineWidth = 1; for (let i = 1; i < 3; i++) { ctx.beginPath(); ctx.moveTo(x0 + lw * i / 3, top); ctx.lineTo(x0 + lw * i / 3, chao); ctx.stroke(); } ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, top + dh * .2); ctx.lineTo(x0 + lw, top + dh * .8); ctx.stroke(); }
      else if (est === "sovietico") { ctx.fillStyle = "rgba(200,160,90,.6)"; for (let r = 0; r < 5; r++) for (let q = 0; q < 2; q++) { ctx.beginPath(); ctx.arc(x0 + lw * (.3 + q * .4), top + dh * (.15 + r * .17), 1.6, 0, 7); ctx.fill(); } }
      else if (est === "bunker") { ctx.strokeStyle = "#6a706a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x0 + lw * .5, top + dh * .45, Math.min(lw * .3, 9), 0, 7); ctx.stroke(); }
      else { ctx.fillStyle = "rgba(255,255,255,.07)"; ctx.fillRect(x0 + lw * .15, top + dh * .1, lw * .7, dh * .3); ctx.fillRect(x0 + lw * .15, top + dh * .5, lw * .7, dh * .38); }
    }
    ctx.fillStyle = "#c8b080"; ctx.beginPath(); ctx.arc(x0 + lw - 3, top + dh * .55, 2.5, 0, 7); ctx.fill(); // maçaneta
  }
  // barricada na porta durante a horda, mãos pela fresta quando arrebenta
  if (quem === "horda") {
    if (segura || c.segurando) for (let i = 0; i < 3; i++) { ctx.save(); ctx.translate(wx + 14, top + dh * (.25 + i * .25) + Math.sin(t * 9 + i) * 1.5); ctx.rotate(i % 2 ? .5 : -.45); ctx.fillStyle = i % 2 ? "#6a4a2a" : "#5a3c22"; ctx.fillRect(-18, -4, 36, 8); ctx.restore(); }
    else { ctx.strokeStyle = "#0a0c08"; ctx.lineWidth = 4; ctx.lineCap = "round"; for (let i = 0; i < 3; i++) { const yy = top + dh * (.35 + i * .14), r = Math.sin(t * 6 + i) * 6; ctx.beginPath(); ctx.moveTo(wx - 6, yy); ctx.lineTo(wx + 16 + r, yy + 4); ctx.stroke(); } ctx.lineCap = "butt"; }
  }
  // luz que entra pela porta aberta
  if (abre > .1) { const rgb = fora && !noite ? "255,230,190" : est === "bunker" ? "255,60,40" : "220,225,240"; const gg = ctx.createLinearGradient(wx, 0, wx + W * .2, 0); gg.addColorStop(0, `rgba(${rgb},${noite ? .06 : .12})`); gg.addColorStop(1, `rgba(${rgb},0)`); ctx.fillStyle = gg; ctx.beginPath(); ctx.moveTo(wx, top); ctx.lineTo(wx, chao); ctx.lineTo(wx + W * .25, chao + H * .06); ctx.lineTo(wx + W * .2, chao); ctx.fill(); }
  // mercador: mercadoria num pano na entrada
  if (c.tipo === "visita" && quem === "mercador" && c.abrir) {
    const kk = cvSuave(ab), cx = wx + W * .135, y = chao + H * .04;
    ctx.fillStyle = `rgba(110,40,30,${.9 * kk})`; ctx.beginPath(); ctx.ellipse(cx, y, W * .085, H * .013, 0, 0, 7); ctx.fill();
    (c.ofertas || (ch ? ["iodo", "filtro", "vodka"] : ["enlatado", "municao", "kit"])).slice(0, 3).forEach((id, i) => { ctx.globalAlpha = kk; desenhaItemCena(id, cx + (i - 1) * W * .05, y - 7 - (1 - kk) * 10, 18); ctx.globalAlpha = 1; });
  }

  /* ===== pessoas dentro ===== */
  const sent = [[cx1, 1], [cx2, -1], [W * .76, 1]];
  if (dorme > .5) g.forEach((q, i) => { if (i < 3) { const mx0 = W * (.3 + i * .14); ctx.fillStyle = "#2a2430"; ctx.fillRect(mx0 - 4, chao + H * .03, W * .13, 5); ctx.save(); ctx.translate(mx0 + W * .12, chao + H * .03); ctx.rotate(-PI / 2); pessoa(0, 0, H * .12, { cor: "#08090c", aro: "rgba(255,200,130,.15)" }); ctx.restore(); ctx.fillStyle = "#3a3448"; ctx.fillRect(mx0 + W * .03, chao + H * .022, W * .09, 6); } }); else
  g.forEach((q, i) => { if (i < 3) { pessoa(sent[i][0], i === 2 ? btop + H * .17 * .28 : pe - H * .045, H * .17, { sentado: true, dir: sent[i][1], cor: "#08090c", aro: "rgba(255,200,130,.25)", cabeca: Math.sin(t * .4 + i) > .6 ? 1 : 0 }); } });
  if (entrando > 0) { const ex = cvMix(alvo, wx + W * (quem === "mercador" ? .07 : .1), entrando); if (quem === "mercador") { luzCor(ex + hp * .12, pe - hp * .5, W * .2, .45, "255,200,110"); ctx.fillStyle = "rgba(255,210,120,.95)"; ctx.fillRect(ex + hp * .12 - 2, pe - hp * .52, 5, 7); }
    pessoa(ex, pe, hp, { fase: entrando * 22, anda: entrando < 1 ? .85 : 0, dir: 1, mochila: true, capacete: ch, luz: noite, luzRgb: "255,230,200", cor: "#07080b", aro: "rgba(200,210,230,.25)" }); if (c.crianca) pessoa(ex - W * .07, pe, hp * .6, { fase: entrando * 22 + 1, anda: entrando < 1 ? .85 : 0, dir: 1 }); }
  if (!p.semEu) {
    if (c.segurando || c.recuam) pessoa(wx + W * .075 + (c.recuam ? 0 : Math.sin(t * 30) * 1.5), pe, hp, { dir: -1, inclina: c.recuam ? .05 : .32, empurrar: 1 });
    else if (investiga >= 0) { const ix = cvMix(W * .72, wx + W * .09, cvSuave(investiga)); pessoa(ix, pe, hp, { dir: -1, fase: investiga * 24, anda: investiga < 1 ? .9 : 0, luz: true, luzRgb: "255,240,200" }); }
    else if (!dorme) pessoa(W * .42, pe, hp, { dir: -1, cabeca: quem ? 0 : Math.sin(t * .5) > .7 ? 1 : 0, aro: "rgba(255,200,130,.3)" });
  }
  if (ch && SOB.rad > 30) particulasRad(t, Math.round(SOB.rad / 8));
  if (noite) { ctx.fillStyle = "rgba(3,5,12,.4)"; ctx.fillRect(wx, 0, W, H); luzCor(lx, H * .22, H * .3, .14 * lmp, "255,200,130"); if (quem === "horda" && !segura) { ctx.fillStyle = `rgba(160,20,10,${.08 + .06 * Math.sin(t * 6)})`; ctx.fillRect(0, 0, W, H); } }
}

// o interior também vale para as casas nos lugares originais
const _sobBase = sobBase, _chernoBase = chernoBase;
sobBase = function (t, p) { if (SOB && ehCasa() && !(sobCena && sobCena.tipo === "acao" && FORA.includes(sobCena.acao))) return desenhaInterior(t, p); return _sobBase(t, p); };
chernoBase = function (t, p) { if (SOB && ehCasa() && !(sobCena && sobCena.tipo === "acao" && FORA.includes(sobCena.acao))) return desenhaInterior(t, p); return _chernoBase(t, p); };
// pré-carrega os desenhos dos itens para a cena
Object.keys(ITENS).forEach(k => imgItem(k));

const _sobVisitaC = sobVisita, _chernoVisitaC = chernoVisita;
sobVisita = function (t, p) { if (SOB && ehCasa()) return desenhaInterior(t, { noite: p.noite }); return _sobVisitaC(t, p); };
chernoVisita = function (t, p) { if (SOB && ehCasa()) return desenhaInterior(t, { noite: p.noite }); return _chernoVisitaC(t, p); };
const _sobHordaC = sobHorda;
sobHorda = function (pos) { _sobHordaC(pos); if (SOB && ehCasa()) { const segura = document.querySelectorAll("#sobAcoes .sb-acao").length <= 1; sobLigarCena({ tipo: "base", noite: true, porta: "horda", segura }); } };
const _sobBarulhoC = sobBarulho;
sobBarulho = function (pos) { _sobBarulhoC(pos); if (SOB && ehCasa()) sobLigarCena({ tipo: "base", noite: true, porta: "barulho" }); };
const _sobMiniTocarC = sobMiniTocar;
sobMiniTocar = function (n, limite, fim) {
  const naPorta = sobCena && sobCena.porta === "horda"; if (naPorta) sobCena.segurando = true;
  return _sobMiniTocarC(n, limite, ok => {
    if (!sobCena) return fim(ok);
    sobCena.segurando = false;
    if (naPorta && ok && ehCasa()) { sobCena.recuam = performance.now(); tocar("gemido"); sobBotoes([]); return setTimeout(() => fim(ok), 1600); } // os zumbis desistem e vão embora
    fim(ok);
  });
};

/* abre a porta para o visitante (só quando você deixa) e espera ele entrar antes de seguir */
window.abrirPortaE = function (fn) {
  if (!(sobCena && sobCena.tipo === "visita") || !ehCasa()) return fn && fn();
  if (!sobCena.abrir) { sobCena.abrir = performance.now(); tocar("porta"); }
  if (!fn) return;
  sobBotoes([]); setTimeout(fn, sobCena.quem === "pessoa" ? 1900 : 700);
};

/* ---------- cama de cada casa ---------- */
function cama(est, x0, x1, top, chao, t, dorme) {
  const w = x1 - x0, cor = { apartamento: ["#3a2a20", "#5a6a8a", "#e0dcd0"], sovietico: ["#4a4e54", "#8a2a24", "#d8d0bc"], cabana: ["#4a3018", "#6a5038", "#d0c4a8"], fazenda: ["#5a3a22", "#7a5a2a", "#e0d8c0"], cela: ["#5a5e64", "#4a5048", "#a8a898"], bunker: ["#3a4232", "#4a5a3a", "#b8b8a0"] }[est];
  // estrutura e pés
  ctx.fillStyle = cor[0]; ctx.fillRect(x0, top + H * .022, w, H * .016); ctx.fillRect(x0 + 2, top + H * .03, 5, chao - top - H * .03); ctx.fillRect(x1 - 7, top + H * .03, 5, chao - top - H * .03);
  ctx.fillRect(x0 - 2, top - H * .05, 6, chao - top + H * .05); // cabeceira
  if (est === "sovietico" || est === "cela") { ctx.strokeStyle = cor[0]; ctx.lineWidth = 2; for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x0 + 1, top - H * .05 + i * H * .012); ctx.lineTo(x0 + 1, top); ctx.stroke(); } }
  // colchão e travesseiro
  ctx.fillStyle = "#c8c0b0"; ctx.fillRect(x0 + 2, top + H * .006, w - 4, H * .018);
  ctx.fillStyle = cor[2]; ctx.beginPath(); ctx.ellipse(x0 + w * .12, top + H * .002, w * .1, H * .012, 0, 0, 7); ctx.fill();
  // você deitado
  if (dorme > 0) { ctx.save(); ctx.globalAlpha = Math.min(1, dorme * 2); ctx.translate(x1 - 4, top + H * .004); ctx.rotate(-PI / 2); pessoa(0, 0, w * .9, { aro: "rgba(255,200,130,.2)" }); ctx.restore(); }
  // cobertor (dobrado quando ninguém dorme)
  ctx.fillStyle = cor[1];
  if (dorme > 0) { ctx.beginPath(); ctx.moveTo(x0 + w * .24, top - H * .012 - Math.sin(t * 1.4) * 1.2); ctx.quadraticCurveTo(x0 + w * .6, top - H * .022, x1 - 2, top - H * .006); ctx.lineTo(x1 - 2, top + H * .024); ctx.lineTo(x0 + w * .24, top + H * .024); ctx.fill(); }
  else { ctx.fillRect(x0 + w * .45, top + H * .004, w * .53, H * .02); ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.fillRect(x0 + w * .45, top + H * .016, w * .53, 2); }
  if (est === "fazenda" || est === "apartamento") { ctx.fillStyle = "rgba(255,255,255,.12)"; for (let i = 0; i < 4; i++) ctx.fillRect(x0 + w * (.5 + i * .12), top + H * .006, 3, H * .015); } // listras/retalhos
}
/* dormir e descansar dentro de casa: vai até a cama e deita */
const _desenhaAcaoCasa = desenhaAcao;
desenhaAcao = function (t, c) {
  if (SOB && ehCasa() && c.acao === "comprar") { // a troca acontece na porta, com o mercador do lado de fora
    const antes = sobCena; sobCena = { tipo: "visita", quem: "mercador", abrir: performance.now() - 2000, ofertas: (window.__ultimasOfertas || null), noite: false };
    try { desenhaInterior(t, {}); } finally { sobCena = antes; } return;
  }
  if (!(SOB && ehCasa() && (c.acao === "dormir" || c.acao === "descansar"))) return _desenhaAcaoCasa(t, c);
  const dormir = c.acao === "dormir", chao = H * .6, pe = chao + H * .045, hp = H * .2;
  const anda = cvSuave(cvSeg(t, .1, 1.3)), deita = cvSeg(t, 1.3, 1.7), noite = dormir && t > 1.9;
  desenhaInterior(t, { semEu: true, noite, dorme: deita });
  if (deita <= 0) pessoa(cvMix(W * .42, W * .7, anda), pe, hp, { fase: t * 9, anda: anda < 1 ? .9 : 0, dir: 1 });
  if (deita > 0) { ctx.fillStyle = "rgba(230,230,240,.8)"; ctx.font = `800 ${Math.max(12, hp * .1)}px "Big Shoulders Display", sans-serif`; for (let i = 0; i < 3; i++) { const k = (t * .5 + i / 3) % 1; ctx.globalAlpha = (1 - k) * Math.min(1, deita * 2); ctx.fillText("z", W * .74 + k * 16, chao - H * .09 - k * H * .12); } ctx.globalAlpha = 1; }
  if (dormir) { ctx.fillStyle = `rgba(0,0,0,${.4 * cvSeg(t, 1.8, 2.8)})`; ctx.fillRect(0, 0, W, H); }
};

/* ---------- detalhes da casa: rachaduras, manchas, teia, relógio, interruptor, coisas de cada estilo ---------- */
function detalhesCasa(t, est, wx, chao, noite) {
  // manchas de umidade e rachaduras
  for (let i = 0; i < 4; i++) { ctx.fillStyle = "rgba(0,0,0,.07)"; ctx.beginPath(); ctx.ellipse(wx + W * (.08 + cvRnd(i + 3) * .65), H * (.05 + cvRnd(i + 7) * .2), W * (.03 + cvRnd(i) * .04), H * (.02 + cvRnd(i + 1) * .03), 0, 0, 7); ctx.fill(); }
  ctx.strokeStyle = "rgba(0,0,0,.28)"; ctx.lineWidth = 1; for (let i = 0; i < 2; i++) { let cx = wx + W * (.2 + i * .35), cy = H * .03; ctx.beginPath(); ctx.moveTo(cx, cy); for (let k = 0; k < 6; k++) { cx += (cvRnd(i * 9 + k) - .5) * 12; cy += H * .018; ctx.lineTo(cx, cy); } ctx.stroke(); }
  // teias nos cantos do teto
  const teia = (x, y, r, lado) => { ctx.strokeStyle = "rgba(220,220,230,.13)"; ctx.lineWidth = .7; for (let k = 0; k < 5; k++) { const a = lado * (k / 4) * PI / 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * r * lado, y + Math.sin(Math.abs(a)) * r); ctx.stroke(); } for (let q = 1; q < 4; q++) { ctx.beginPath(); ctx.arc(x, y, r * q / 4, lado > 0 ? 0 : PI / 2, lado > 0 ? PI / 2 : PI); ctx.stroke(); } };
  teia(wx + 6, H * .025, 26, 1); teia(W - 2, H * .025, 30, -1);
  // interruptor e tomada
  if (est !== "cabana" && est !== "cela") { ctx.fillStyle = "#d8d2c0"; ctx.fillRect(wx + 16, chao - H * .17, 7, 10); ctx.fillStyle = "#888"; ctx.fillRect(wx + 18.5, chao - H * .165, 2, 4); ctx.fillStyle = "#cfc8b4"; ctx.fillRect(W * .43, chao - H * .035, 7, 7); ctx.fillStyle = "#555"; ctx.fillRect(W * .43 + 2, chao - H * .032, 1, 2); ctx.fillRect(W * .43 + 4, chao - H * .032, 1, 2); }
  // relógio de parede que ainda funciona
  if (est !== "cela") { const rx = W * .58, ry = H * .1, r = 10; ctx.fillStyle = est === "bunker" ? "#2a302a" : "#e4dccb"; ctx.beginPath(); ctx.arc(rx, ry, r, 0, 7); ctx.fill(); ctx.strokeStyle = "#2a2018"; ctx.lineWidth = 2; ctx.stroke();
    ctx.lineWidth = 1.2; ctx.strokeStyle = est === "bunker" ? "#8aff8a" : "#1a1a1a"; const sg = t * .6, mn = t * .01; ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx + Math.sin(mn) * 6, ry - Math.cos(mn) * 6); ctx.moveTo(rx, ry); ctx.lineTo(rx + Math.sin(sg) * 8, ry - Math.cos(sg) * 8); ctx.stroke(); }
  // coisas de cada tipo de casa
  if (est === "apartamento") { ctx.fillStyle = "#e8e2d2"; ctx.fillRect(W * .52, H * .14, W * .045, H * .05); ctx.fillStyle = "#c83a2a"; ctx.fillRect(W * .52, H * .14, W * .045, H * .012); ctx.fillStyle = "rgba(0,0,0,.4)"; for (let i = 0; i < 9; i++) ctx.fillRect(W * .523 + (i % 3) * W * .013, H * .158 + Math.floor(i / 3) * H * .01, 3, 2); /* calendário */
    ctx.fillStyle = "#1e3a22"; ctx.beginPath(); ctx.ellipse(W * .655, chao - H * .045, 7, 9, 0, 0, 7); ctx.fill(); ctx.fillStyle = "#6a3a22"; ctx.fillRect(W * .645, chao - H * .03, 9, H * .03); /* vaso de planta */ }
  if (est === "sovietico") { ctx.fillStyle = "#c8b890"; ctx.fillRect(W * .5, H * .13, W * .05, H * .07); ctx.fillStyle = "#8a2a20"; ctx.beginPath(); ctx.arc(W * .525, H * .155, 6, 0, 7); ctx.fill(); /* cartaz */ ctx.fillStyle = "#3a5a3a"; ctx.fillRect(W * .64, chao - H * .03, 9, H * .03); ctx.fillStyle = "#2a4a2a"; ctx.beginPath(); ctx.ellipse(W * .655, chao - H * .045, 8, 9, 0, 0, 7); ctx.fill(); }
  if (est === "cabana") { ctx.strokeStyle = "#5a3a1a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(W * .5, H * .12); ctx.lineTo(W * .62, H * .12); ctx.stroke(); for (let i = 0; i < 4; i++) { ctx.fillStyle = ["#5a7a3a", "#7a6a2a", "#4a6a2a", "#8a5a2a"][i]; ctx.beginPath(); ctx.moveTo(W * (.51 + i * .03), H * .12); ctx.lineTo(W * (.505 + i * .03), H * .16); ctx.lineTo(W * (.52 + i * .03), H * .16); ctx.fill(); } /* ervas secando */
    ctx.fillStyle = "#5a4030"; ctx.beginPath(); ctx.ellipse(W * .6, chao + H * .045, W * .13, H * .018, 0, 0, 7); ctx.fill(); ctx.fillStyle = "#4a3426"; ctx.beginPath(); ctx.arc(W * .48, chao + H * .045, 6, 0, 7); ctx.fill(); /* tapete de pele */
    ctx.fillStyle = "#3a3a3a"; ctx.fillRect(W * .62, H * .2, 8, 12); luzCor(W * .62 + 4, H * .2 + 7, 22, .35 + .1 * Math.sin(t * 6), "255,190,110"); /* lampião */ }
  if (est === "fazenda") { for (let i = 0; i < 3; i++) { ctx.fillStyle = "#3a3a3e"; ctx.beginPath(); ctx.arc(W * (.52 + i * .04), H * .16, 6 + i, 0, PI); ctx.fill(); ctx.fillRect(W * (.52 + i * .04) - 1, H * .12, 2, H * .04); } /* panelas penduradas */
    ctx.fillStyle = "#6a4a2a"; ctx.fillRect(W * .63, chao - H * .05, 10, H * .05); ctx.fillStyle = "#8aa0b0"; ctx.fillRect(W * .632, chao - H * .055, 8, 4); /* balde */ }
  if (est === "cela") { ctx.strokeStyle = "rgba(220,220,210,.35)"; ctx.lineWidth = 1.2; for (let g = 0; g < 4; g++) { const gx = W * (.47 + g * .035), gy = H * .12; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(gx + i * 3, gy); ctx.lineTo(gx + i * 3, gy + 12); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(gx - 2, gy + 9); ctx.lineTo(gx + 12, gy + 3); ctx.stroke(); } /* risquinhos dos dias */ }
  if (est === "bunker") { for (let i = 0; i < 2; i++) { const mx = W * (.5 + i * .05), my = H * .15; ctx.fillStyle = "#2a2e26"; ctx.beginPath(); ctx.ellipse(mx, my, 7, 9, 0, 0, 7); ctx.fill(); ctx.fillStyle = "rgba(160,200,200,.4)"; ctx.beginPath(); ctx.arc(mx - 3, my - 2, 2.4, 0, 7); ctx.arc(mx + 3, my - 2, 2.4, 0, 7); ctx.fill(); ctx.fillStyle = "#1a1e18"; ctx.beginPath(); ctx.arc(mx, my + 6, 4, 0, 7); ctx.fill(); } /* máscaras de gás */ }
  // poeira flutuando na luz
  ctx.fillStyle = noite ? "rgba(255,210,150,.25)" : "rgba(255,240,210,.35)";
  for (let i = 0; i < 14; i++) { const k = ((t * .02 + cvRnd(i) * 7) % 1), px = wx + W * .05 + cvRnd(i + 20) * W * .65 + Math.sin(t * .5 + i) * 6, py = H * (.12 + k * .4); ctx.fillRect(px, py, 1.4, 1.4); }
}
function detalhesFora(t, est, wx, chao, fora) {
  // capacho na frente da porta
  ctx.fillStyle = "#3a2a1e"; ctx.fillRect(wx - W * .1, chao - 3, W * .09, 4); ctx.fillStyle = "rgba(0,0,0,.3)"; for (let i = 0; i < 5; i++) ctx.fillRect(wx - W * .1 + i * W * .018, chao - 3, 1, 4);
  if (fora) { // lenha empilhada na varanda e lampião
    for (let i = 0; i < 5; i++) { ctx.fillStyle = i % 2 ? "#5a3a1a" : "#6a4a2a"; ctx.beginPath(); ctx.arc(W * .03 + (i % 3) * 8, chao - 6 - Math.floor(i / 3) * 8, 4.5, 0, 7); ctx.fill(); ctx.fillStyle = "#8a6a3a"; ctx.beginPath(); ctx.arc(W * .03 + (i % 3) * 8, chao - 6 - Math.floor(i / 3) * 8, 2, 0, 7); ctx.fill(); }
    ctx.fillStyle = "#2a2a2a"; ctx.fillRect(wx - 14, chao - H * .2, 7, 10); luzCor(wx - 10, chao - H * .19, 30, .3 + .1 * Math.sin(t * 5), "255,200,120");
  } else if (est === "apartamento" || est === "sovietico") { // saco de lixo e tênis
    ctx.fillStyle = "#121418"; ctx.beginPath(); ctx.ellipse(W * .035, chao - 9, 10, 10, 0, 0, 7); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,.06)"; ctx.beginPath(); ctx.ellipse(W * .03, chao - 13, 3, 4, 0, 0, 7); ctx.fill();
    ctx.fillStyle = "#3a3a44"; ctx.fillRect(wx - W * .03, chao - 4, 8, 4); ctx.fillRect(wx - W * .03 + 10, chao - 4, 8, 4);
  }
}
