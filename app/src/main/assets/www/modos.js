/* ============================================================
   MODOS INFINITOS · motor comum
   - Apocalipse Zumbi e Zona de Exclusão (Chernobyl)
   - dia em turnos (energia), saúde, fome, defesa e (na Zona) radiação
   - mochila com comidas de saciedade diferente, sementes e cura
   - horta: planta hoje, colhe depois de alguns dias
   - objetivos com recompensa, clima que muda a cada dia
   Salvo em localStorage "pv_inf_<modo>" a cada ação.
   ============================================================ */
Object.assign(SOB_ICONES, {
  rad: '<circle cx="12" cy="12" r="2"/><path d="M12 10L8.5 4a8 8 0 0 0-5 8.5h7M14 12h7a8 8 0 0 0-5-8.5L12.5 10M11 14l-3.5 6a8 8 0 0 0 9 0L13 14"/>',
  mochila: '<path d="M6 8a6 6 0 0 1 12 0v12H6zM9 8V6a3 3 0 0 1 6 0v2M9 13h6"/>',
  objetivo: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>', semente: '<path d="M12 21c-5-3-6-9-1-15 5 6 4 12 1 15zM12 21V10"/>',
  geiger: '<rect x="4" y="7" width="12" height="12" rx="2"/><path d="M16 11h3l1 6M8 11h4M8 15h2"/>', artefato: '<path d="M12 3l6 9-6 9-6-9z"/>',
  chuva: '<path d="M6 14a4 4 0 0 1 1-8 6 6 0 0 1 11 2 3 3 0 0 1 0 6zM8 18l-1 3M12 18l-1 3M16 18l-1 3"/>', sol: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>',
  nuvem: '<path d="M6 18a4 4 0 0 1 1-8 6 6 0 0 1 11 2 3 3 0 0 1 0 6z"/>', nevoa: '<path d="M3 9h18M5 13h14M3 17h18"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>',
});

/* ---------- itens ---------- */
const ITENS = {
  enlatado: { nome: "Enlatado", tipo: "comida", fome: 40, ic: "comida", desc: "Feijão em lata. Enche bem." },
  racao: { nome: "Ração militar", tipo: "comida", fome: 55, ic: "comida", desc: "Pesada e sem gosto. Sustenta o dia inteiro." },
  cenoura: { nome: "Cenoura", tipo: "comida", fome: 35, ic: "horta", desc: "Doce e firme. Mata bem a fome." },
  cebola: { nome: "Cebola", tipo: "comida", fome: 15, ic: "horta", desc: "Ardida. Engana pouco a fome." },
  batata: { nome: "Batata", tipo: "comida", fome: 30, ic: "horta", desc: "Cozida na brasa, rende uma refeição." },
  milho: { nome: "Milho", tipo: "comida", fome: 25, ic: "horta", desc: "Assado é ótimo." },
  beterraba: { nome: "Beterraba", tipo: "comida", fome: 25, ic: "horta", desc: "Terra pura, mas alimenta." },
  peixe: { nome: "Peixe", tipo: "comida", fome: 35, ic: "comida", desc: "Pescado no rio." },
  carne: { nome: "Carne de caça", tipo: "comida", fome: 45, ic: "comida", desc: "Assada na fogueira." },
  pao: { nome: "Pão preto", tipo: "comida", fome: 30, ic: "comida", desc: "Duro como pedra. Ainda serve." },
  cogumelo: { nome: "Cogumelo da Zona", tipo: "comida", fome: 20, rad: 10, ic: "comida", desc: "Cresce bem demais aqui. Traz radiação." },
  javali: { nome: "Carne de javali", tipo: "comida", fome: 45, rad: 14, ic: "comida", desc: "Muita carne, muita radiação." },
  s_cenoura: { nome: "Sementes de cenoura", tipo: "semente", planta: "cenoura", dias: 3, rende: 3, ic: "semente" },
  s_cebola: { nome: "Sementes de cebola", tipo: "semente", planta: "cebola", dias: 2, rende: 3, ic: "semente" },
  s_batata: { nome: "Batata-semente", tipo: "semente", planta: "batata", dias: 4, rende: 4, ic: "semente" },
  s_milho: { nome: "Sementes de milho", tipo: "semente", planta: "milho", dias: 3, rende: 3, ic: "semente" },
  s_beterraba: { nome: "Sementes de beterraba", tipo: "semente", planta: "beterraba", dias: 3, rende: 3, ic: "semente" },
  bandagem: { nome: "Bandagem", tipo: "cura", saude: 15, ic: "remedio", desc: "Estanca o sangue." },
  remedio: { nome: "Remédio", tipo: "cura", saude: 30, cura: true, ic: "remedio", desc: "Antibiótico. Cura mordida e infecção." },
  kit: { nome: "Kit médico", tipo: "cura", saude: 55, cura: true, ic: "remedio", desc: "Completo. Vale ouro." },
  iodo: { nome: "Pílulas de iodo", tipo: "cura", rad: -25, ic: "rad", desc: "Baixam a radiação no corpo." },
  vodka: { nome: "Vodka", tipo: "cura", rad: -10, saude: -4, ic: "rad", desc: "Dizem que ajuda contra a radiação. Ajuda pouco." },
  material: { nome: "Materiais", tipo: "recurso", ic: "material", desc: "Tábuas, pregos, fita. Para fortificar." },
  municao: { nome: "Munição", tipo: "recurso", ic: "municao", desc: "Para se defender." },
  sucata: { nome: "Sucata", tipo: "recurso", ic: "sucata", desc: "Moeda de troca com mercadores." },
  filtro: { nome: "Filtro de máscara", tipo: "recurso", ic: "rad", desc: "Gasto sozinho ao vasculhar: corta a radiação pela metade." },
  artefato: { nome: "Artefato", tipo: "recurso", ic: "artefato", desc: "Pedra que brilha no escuro. Mercadores pagam muito." },
  pecas: { nome: "Peças de rádio", tipo: "recurso", ic: "porta", desc: "Junte 3 para consertar o rádio." },
  geiger: { nome: "Contador Geiger", tipo: "ferramenta", ic: "geiger", desc: "Mostra a radiação de cada lugar antes de ir." },
};
const GRUPOS_MOCHILA = [["comida", "Comida"], ["semente", "Sementes"], ["cura", "Cura"], ["recurso", "Recursos"], ["ferramenta", "Ferramentas"]];

/* ---------- conteúdo dos modos ---------- */
const lt = (id, a, b, c = 1) => [id, a, b, c]; // item, mínimo, máximo, chance
const MODOS = {
  zumbi: {
    nome: "Apocalipse Zumbi", cor: "#e2483d", radiacao: false, abertura: "O mundo acabou há três semanas. Escolha onde você vai tentar sobreviver.",
    inimigo: "zumbi", horda: "uma horda", climas: [["limpo", .45], ["nublado", .25], ["chuva", .2], ["neblina", .1]],
    locais: {
      cidade: { nome: "Cidade", cor: "#f2a33a", base: "Apartamento no 4º andar", canteiros: 2, ic: "porta",
        desc: "Muito para saquear, muitos zumbis. Pouca defesa. Dá para plantar em vasos na varanda.",
        ini: { defesa: 15, inv: { enlatado: 3, bandagem: 1, material: 2, municao: 4, sucata: 6 } }, perigo: 1.3,
        especial: { nome: "Saquear o prédio", desc: "Vizinhos, pouco risco", ic: "porta", loot: [lt("enlatado", 0, 2), lt("bandagem", 0, 1, .5), lt("sucata", 1, 2), lt("s_cebola", 1, 1, .2)] },
        lugares: [
          { nome: "Supermercado", desc: "Muita comida, muitos zumbis", risco: .5, cena: "mercado", loot: [lt("enlatado", 1, 3), lt("pao", 0, 1, .4), lt("s_cebola", 1, 1, .3), lt("sucata", 0, 2)] },
          { nome: "Farmácia", desc: "Remédios", risco: .55, cena: "loja", loot: [lt("remedio", 1, 2), lt("bandagem", 1, 2, .7), lt("kit", 1, 1, .1)] },
          { nome: "Delegacia", desc: "Munição, perigosa", risco: .65, cena: "loja", loot: [lt("municao", 2, 6), lt("kit", 1, 1, .15)] },
          { nome: "Construção", desc: "Materiais", risco: .35, cena: "rua", loot: [lt("material", 2, 4), lt("sucata", 0, 2)] } ] },
      floresta: { nome: "Floresta", cor: "#9bd86b", base: "Cabana de caça", canteiros: 2, ic: "caca",
        desc: "Poucos zumbis, comida na mata. Remédio e munição são raros.",
        ini: { defesa: 10, inv: { peixe: 2, carne: 1, material: 3, municao: 2, sucata: 3, s_batata: 1 } }, perigo: .8,
        especial: { nome: "Caçar", desc: "Carne, mas pode se ferir", ic: "caca", caca: true },
        lugares: [
          { nome: "Rio", desc: "Peixe", risco: .2, cena: "mata", loot: [lt("peixe", 1, 3)] },
          { nome: "Acampamento", desc: "Um pouco de tudo", risco: .4, cena: "mata", loot: [lt("enlatado", 0, 2), lt("bandagem", 0, 1), lt("municao", 0, 2), lt("sucata", 1, 3), lt("s_batata", 1, 1, .3)] },
          { nome: "Torre de vigia", desc: "Munição e ferramentas", risco: .45, cena: "mata", loot: [lt("municao", 1, 3), lt("material", 1, 2)] },
          { nome: "Mata fechada", desc: "Ervas que curam", risco: .35, cena: "mata", loot: [lt("bandagem", 1, 2), lt("remedio", 0, 1, .4), lt("s_cenoura", 1, 1, .25)] } ] },
      fazenda: { nome: "Fazenda", cor: "#e3b46b", base: "Casa da fazenda", canteiros: 4, ic: "horta",
        desc: "Horta grande e sementes. Muita gente passa pela estrada.",
        ini: { defesa: 20, inv: { milho: 2, cenoura: 2, cebola: 2, s_cenoura: 2, s_cebola: 1, bandagem: 1, material: 3, municao: 2, sucata: 4 } }, perigo: 1,
        especial: { nome: "Cuidar da horta", desc: "Rega: tudo cresce 1 dia", ic: "horta", rega: true },
        lugares: [
          { nome: "Celeiro", desc: "Materiais e sementes", risco: .3, cena: "campo", loot: [lt("material", 1, 3), lt("s_milho", 1, 2, .5), lt("s_cenoura", 1, 1, .4)] },
          { nome: "Vila vizinha", desc: "Um pouco de tudo", risco: .55, cena: "rua", loot: [lt("enlatado", 0, 2), lt("remedio", 0, 1, .5), lt("municao", 0, 3), lt("sucata", 1, 3)] },
          { nome: "Plantação", desc: "Milho e cebola", risco: .25, cena: "campo", loot: [lt("milho", 1, 3), lt("cebola", 1, 2, .6), lt("s_cebola", 1, 1, .3)] },
          { nome: "Posto da estrada", desc: "Sucata e munição", risco: .45, cena: "rua", loot: [lt("sucata", 2, 4), lt("municao", 0, 2)] } ] },
      presidio: { nome: "Presídio", cor: "#4fcfd9", base: "Bloco C", canteiros: 2, ic: "torre",
        desc: "Muros altos e arsenal. Quase nada para comer.",
        ini: { defesa: 45, inv: { racao: 1, remedio: 1, material: 2, municao: 8, sucata: 4 } }, perigo: 1.1,
        especial: { nome: "Vigiar a muralha", desc: "Menos ataques à noite", ic: "torre", vigia: true },
        lugares: [
          { nome: "Enfermaria", desc: "Remédios", risco: .5, cena: "presidio", loot: [lt("remedio", 1, 2), lt("bandagem", 1, 2), lt("kit", 1, 1, .12)] },
          { nome: "Arsenal", desc: "Muita munição", risco: .55, cena: "presidio", loot: [lt("municao", 2, 6)] },
          { nome: "Refeitório", desc: "Enlatados e ração", risco: .5, cena: "presidio", loot: [lt("enlatado", 1, 2), lt("racao", 0, 1, .5)] },
          { nome: "Oficina", desc: "Materiais", risco: .35, cena: "presidio", loot: [lt("material", 2, 3)] } ] },
    },
    mercador: [["enlatado", 2, "sucata", 4], ["remedio", 1, "sucata", 4], ["municao", 6, "enlatado", 1], ["material", 3, "sucata", 3], ["sucata", 4, "municao", 3], ["s_cenoura", 2, "sucata", 2], ["kit", 1, "sucata", 9], ["racao", 2, "municao", 4]],
    objetivos: [
      { t: "Sobreviva 3 dias", ok: s => s.dia >= 3, premio: { enlatado: 2 } },
      { t: "Plante qualquer semente", ok: s => s.st.plantou >= 1, premio: { s_cenoura: 1 } },
      { t: "Faça sua primeira colheita", ok: s => s.st.colheu >= 1, premio: { material: 3 } },
      { t: "Chegue a 50 de defesa", ok: s => s.defesa >= 50, premio: { municao: 4 } },
      { t: "Compre algo de um mercador", ok: s => s.st.comprou >= 1, premio: { sucata: 5 } },
      { t: "Tenha 2 companheiros no grupo", ok: s => s.grupo.length >= 2, premio: { kit: 1 } },
      { t: "Vasculhe 12 vezes", ok: s => s.st.vasculhou >= 12, premio: { racao: 2 } },
      { t: "Sobreviva 10 dias", ok: s => s.dia >= 10, premio: { kit: 1, municao: 6 } },
      { t: "Colha 15 alimentos da horta", ok: s => s.st.colhidos >= 15, premio: { s_milho: 2, s_batata: 2 } },
      { t: "Sobreviva 20 dias", ok: s => s.dia >= 20, premio: { racao: 3, kit: 1 } },
      { t: "Sobreviva 40 dias", ok: s => s.dia >= 40, premio: { kit: 2 } },
    ],
  },
  cherno: {
    nome: "Zona de Exclusão", cor: "#b8e05a", radiacao: true, abertura: "Chernobyl, Ucrânia. A Zona fechou de novo. Escolha onde montar seu abrigo.",
    inimigo: "mutante", horda: "uma matilha de cães mutantes", climas: [["limpo", .4], ["nublado", .3], ["chuva", .15], ["emissao", .15]],
    locais: {
      pripyat: { nome: "Pripyat", cor: "#b8e05a", base: "Apartamento no bloco 7", canteiros: 2, ic: "porta",
        desc: "A cidade fantasma. Prédios cheios de coisas, radiação média.",
        ini: { defesa: 20, inv: { enlatado: 2, pao: 1, iodo: 1, filtro: 2, bandagem: 1, material: 2, municao: 3, sucata: 5 } }, perigo: 1.1, radBase: 2,
        especial: { nome: "Vigiar do telhado", desc: "Binóculo: busca mais segura amanhã", ic: "torre", vigia: true },
        lugares: [
          { nome: "Supermercado Raduga", desc: "Enlatados de 1986", risco: .4, rad: 8, cena: "pripyat", loot: [lt("enlatado", 1, 3), lt("vodka", 0, 1, .5), lt("sucata", 0, 2)] },
          { nome: "Hospital nº 126", desc: "Remédios, radiação alta no porão", risco: .5, rad: 18, cena: "pripyat", loot: [lt("iodo", 1, 2), lt("remedio", 0, 1, .6), lt("kit", 1, 1, .12)] },
          { nome: "Parque de diversões", desc: "Peças e artefatos perto da roda-gigante", risco: .45, rad: 14, cena: "parque", loot: [lt("pecas", 1, 1, .5), lt("artefato", 1, 1, .25), lt("sucata", 1, 3)] },
          { nome: "Usina · Reator 4", desc: "O melhor saque. A pior radiação", risco: .6, rad: 35, cena: "usina", usina: true, loot: [lt("artefato", 1, 2, .6), lt("pecas", 1, 2, .5), lt("kit", 1, 1, .3), lt("municao", 2, 5)] } ] },
      kopachi: { nome: "Vila Kopachi", cor: "#e3b46b", base: "Casa de madeira", canteiros: 4, ic: "horta",
        desc: "Vila abandonada com quintais. Terra boa, um pouco contaminada.",
        ini: { defesa: 15, inv: { batata: 2, beterraba: 1, s_batata: 2, s_beterraba: 1, iodo: 1, filtro: 1, material: 3, municao: 2, sucata: 3 } }, perigo: .9, radBase: 3,
        especial: { nome: "Cuidar da horta", desc: "Rega: tudo cresce 1 dia", ic: "horta", rega: true },
        lugares: [
          { nome: "Casas vizinhas", desc: "Comida e ferramentas", risco: .35, rad: 6, cena: "vila", loot: [lt("pao", 0, 2), lt("s_batata", 1, 1, .35), lt("material", 1, 2), lt("vodka", 0, 1, .4)] },
          { nome: "Jardim de infância", desc: "Assombroso. Peças e remédios", risco: .45, rad: 16, cena: "vila", loot: [lt("bandagem", 1, 2), lt("pecas", 1, 1, .4), lt("iodo", 0, 1, .5)] },
          { nome: "Pântano", desc: "Peixe e cogumelos", risco: .4, rad: 12, cena: "floresta", loot: [lt("peixe", 1, 2), lt("cogumelo", 1, 2)] },
          { nome: "Fazenda coletiva", desc: "Sementes e materiais", risco: .3, rad: 8, cena: "vila", loot: [lt("s_beterraba", 1, 2, .6), lt("material", 1, 3), lt("sucata", 1, 2)] } ] },
      bunker: { nome: "Radar Duga", cor: "#4fcfd9", base: "Bunker militar", canteiros: 1, ic: "torre",
        desc: "Concreto e aço: muita defesa e pouca radiação. Comida quase nenhuma.",
        ini: { defesa: 50, inv: { racao: 1, iodo: 2, filtro: 3, municao: 8, material: 2, sucata: 4, geiger: 1 } }, perigo: 1, radBase: 1,
        especial: { nome: "Operar o rádio", desc: "Chama mercadores e escuta a Zona", ic: "porta", radio: true },
        lugares: [
          { nome: "Antenas do radar", desc: "Peças e sucata", risco: .4, rad: 10, cena: "duga", loot: [lt("pecas", 1, 2, .6), lt("sucata", 2, 4)] },
          { nome: "Quartel", desc: "Munição e ração", risco: .5, rad: 8, cena: "duga", loot: [lt("municao", 2, 5), lt("racao", 0, 1, .5), lt("filtro", 0, 2)] },
          { nome: "Floresta Vermelha", desc: "Caça e artefatos. Muita radiação", risco: .5, rad: 28, cena: "floresta", loot: [lt("javali", 1, 1, .6), lt("artefato", 1, 1, .4), lt("cogumelo", 1, 2)] },
          { nome: "Posto de controle", desc: "Remédios e suprimentos", risco: .45, rad: 6, cena: "pripyat", loot: [lt("iodo", 1, 2), lt("bandagem", 1, 2), lt("enlatado", 0, 2)] } ] },
      vermelha: { nome: "Floresta Vermelha", cor: "#e2483d", base: "Cabana do guarda florestal", canteiros: 2, ic: "caca",
        desc: "Modo difícil. Pinheiros mortos e ruivos, muita caça, muita radiação.",
        ini: { defesa: 10, inv: { javali: 1, cogumelo: 2, iodo: 2, filtro: 2, material: 3, municao: 3, sucata: 2 } }, perigo: 1.2, radBase: 5,
        especial: { nome: "Caçar javali", desc: "Muita carne, muita radiação", ic: "caca", caca: true, cacaItem: "javali" },
        lugares: [
          { nome: "Pinheiros mortos", desc: "Artefatos entre as raízes", risco: .45, rad: 22, cena: "floresta", loot: [lt("artefato", 1, 1, .5), lt("cogumelo", 1, 2)] },
          { nome: "Torre de vigia", desc: "Munição e filtros", risco: .4, rad: 12, cena: "floresta", loot: [lt("municao", 1, 3), lt("filtro", 1, 2, .6)] },
          { nome: "Vila enterrada", desc: "O que sobrou de uma vila", risco: .45, rad: 15, cena: "vila", loot: [lt("pao", 0, 1), lt("s_beterraba", 1, 1, .4), lt("vodka", 0, 1, .5), lt("material", 1, 2)] },
          { nome: "Rio Pripyat", desc: "Peixe", risco: .3, rad: 10, cena: "floresta", loot: [lt("peixe", 1, 3)] } ] },
    },
    mercador: [["iodo", 2, "sucata", 4], ["filtro", 2, "sucata", 3], ["enlatado", 2, "sucata", 3], ["sucata", 10, "artefato", 1], ["kit", 1, "artefato", 1], ["municao", 6, "sucata", 4], ["racao", 2, "sucata", 5], ["geiger", 1, "sucata", 6], ["s_batata", 2, "sucata", 2]],
    objetivos: [
      { t: "Encontre um contador Geiger", ok: s => (s.inv.geiger || 0) >= 1, premio: { iodo: 1 } },
      { t: "Plante qualquer semente", ok: s => s.st.plantou >= 1, premio: { s_batata: 1 } },
      { t: "Vede o abrigo: chegue a 45 de defesa", ok: s => s.defesa >= 45, premio: { filtro: 2 } },
      { t: "Encontre um artefato", ok: s => s.st.artefatos >= 1, premio: { sucata: 4 } },
      { t: "Fique 3 dias seguidos com radiação abaixo de 30", ok: s => s.st.diasRadBaixa >= 3, premio: { kit: 1 } },
      { t: "Faça sua primeira colheita", ok: s => s.st.colheu >= 1, premio: { material: 3 } },
      { t: "Conserte o rádio: junte 3 peças", ok: s => (s.inv.pecas || 0) >= 3 || s.st.radio, premio: { racao: 2 }, aoCumprir: s => { s.st.radio = 1; s.inv.pecas = Math.max(0, (s.inv.pecas || 0) - 3); } },
      { t: "Entre no Reator 4 e volte vivo", ok: s => s.st.usina >= 1, premio: { kit: 1, iodo: 2 } },
      { t: "Sobreviva a uma Emissão", ok: s => s.st.emissoes >= 1, premio: { filtro: 3 } },
      { t: "Sobreviva 10 dias na Zona", ok: s => s.dia >= 10, premio: { artefato: 1 } },
      { t: "Sobreviva 25 dias na Zona", ok: s => s.dia >= 25, premio: { kit: 2 } },
    ],
  },
};

/* ---------- estado e utilidades ---------- */
let SOB = null, sobModo = "zumbi", sobCena = { tipo: "base" }, sobOcupado = false;
const sobRnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const sobChance = p => Math.random() < p;
const M = () => MODOS[SOB ? SOB.modo : sobModo];
const L = () => M().locais[SOB.local];
const energiaMax = () => 3 + Math.min(2, SOB.grupo.length);
const horaNome = () => ["Manhã", "Meio-dia", "Tarde", "Fim de tarde", "Anoitecer", "Noite"][Math.min(5, SOB.gasta)];
const chaveSave = m => "pv_inf_" + m;
const sobLer = m => { try { const d = JSON.parse(localStorage.getItem(chaveSave(m))); return d && d.versao === 2 ? d : null; } catch (e) { return null; } };
const sobGravar = () => { if (SOB) try { localStorage.setItem(chaveSave(SOB.modo), JSON.stringify(SOB)); } catch (e) {} };
const sobRecorde = m => { try { return +(localStorage.getItem("pv_rec_" + m) || 0); } catch (e) { return 0; } };
window.temPremium = () => { try { if (window.Android && Android.premium) return !!Android.premium(); return localStorage.getItem("pv_premium") === "1"; } catch (e) { return false; } };
const qtd = id => SOB.inv[id] || 0;
const totalTipo = tipo => Object.entries(SOB.inv).reduce((n, [k, v]) => n + (ITENS[k] && ITENS[k].tipo === tipo ? v : 0), 0);
const CLIMA = { limpo: ["Céu limpo", "sol"], nublado: ["Nublado", "nuvem"], chuva: ["Chuva", "chuva"], neblina: ["Neblina", "nevoa"], emissao: ["Alerta de emissão", "rad"] };

function sobNovo(modo, local) {
  const l = MODOS[modo].locais[local];
  SOB = { versao: 2, modo, local, dia: 1, gasta: 0, energia: 3, saude: 100, fome: 80, rad: MODOS[modo].radiacao ? 5 : 0, defesa: l.ini.defesa,
    inv: { ...l.ini.inv }, horta: Array(l.canteiros).fill(null), grupo: [], obj: [], clima: "limpo", vigia: false,
    st: { plantou: 0, colheu: 0, colhidos: 0, comprou: 0, vasculhou: 0, artefatos: 0, diasRadBaixa: 0, usina: 0, emissoes: 0 } };
  sobGravar();
}
function sobMuda(campo, v, mostrar = true) {
  let antes, d;
  if (["saude", "fome", "defesa", "rad"].includes(campo)) { antes = SOB[campo]; SOB[campo] = Math.max(0, Math.min(100, antes + v)); d = SOB[campo] - antes; }
  else { antes = qtd(campo); SOB.inv[campo] = Math.max(0, antes + v); if (!SOB.inv[campo]) delete SOB.inv[campo]; d = qtd(campo) - antes; if (campo === "artefato" && d > 0) SOB.st.artefatos += d; }
  if (mostrar && d) sobFlutua((d > 0 ? "+" : "") + d + " " + ({ saude: "Saúde", fome: "Fome", defesa: "Defesa", rad: "Radiação" }[campo] || ITENS[campo].nome), campo === "rad" ? d < 0 : d > 0);
  return d;
}
function sobLoot(tabela, mult = 1) {
  const g = [];
  tabela.forEach(([id, a, b, c]) => { if (!sobChance(c)) return; const n = Math.max(0, Math.round(sobRnd(a, b) * mult)); if (n) { sobMuda(id, n); g.push(n + " " + ITENS[id].nome.toLowerCase()); } });
  return g.length ? g.join(", ") : "nada que preste";
}
const $s = id => document.getElementById(id);

/* ---------- desenho: Zona de Exclusão ---------- */
function chernoCeu(f, emissao) {
  const top = emissao && f > .5 ? [90, 20, 20] : [cvMix(120, 10, f), cvMix(128, 12, f), cvMix(110, 16, f)];
  const bot = emissao && f > .5 ? [200, 70, 40] : [cvMix(196, 30, f), cvMix(190, 32, f), cvMix(150, 40, f)];
  const g = ctx.createLinearGradient(0, 0, 0, H * .62); g.addColorStop(0, `rgb(${top.map(Math.round)})`); g.addColorStop(1, `rgb(${bot.map(Math.round)})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  if (f < .7) { luzCor(W * .7, H * (.15 + f * .4), H * .18, .3 * (1 - f), "240,240,190"); ctx.fillStyle = `rgba(240,240,200,${.6 * (1 - f)})`; ctx.beginPath(); ctx.arc(W * .7, H * (.15 + f * .4), H * .025, 0, 7); ctx.fill(); }
  if (emissao) { const a = .3 + .2 * Math.sin(performance.now() / 300); ctx.fillStyle = `rgba(255,60,40,${a * (f > .5 ? 1 : .3)})`; ctx.fillRect(0, 0, W, H * .5); }
  for (let i = 0; i < 3; i++) { const x = ((performance.now() / 1000 * (4 + i * 2) + cvRnd(i) * W * 2) % (W * 1.8)) - W * .4; ctx.fillStyle = `rgba(60,64,50,${.25 + f * .2})`; ctx.beginPath(); ctx.ellipse(x, H * (.07 + i * .06), W * .3, H * .02, 0, 0, 7); ctx.fill(); }
}
function trevoRad(x, y, r, a = 1) {
  ctx.save(); ctx.translate(x, y); ctx.fillStyle = `rgba(240,210,40,${a})`; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill();
  ctx.fillStyle = "#111"; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r * .85, i * 2.094 - .5, i * 2.094 + .5); ctx.closePath(); ctx.fill(); }
  ctx.fillStyle = `rgba(240,210,40,${a})`; ctx.beginPath(); ctx.arc(0, 0, r * .22, 0, 7); ctx.fill(); ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(0, 0, r * .14, 0, 7); ctx.fill(); ctx.restore();
}
function blocoSovietico(x, y, w, h, t, luzes = 0, cor = "#24261f") {
  ctx.fillStyle = cor; ctx.fillRect(x, y - h, w, h);
  const cols = Math.max(3, Math.floor(w / 16)), rows = Math.max(4, Math.floor(h / 18));
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const on = cvRnd(x * .1 + r * 13 + c) < luzes; ctx.fillStyle = on ? "rgba(230,200,130,.6)" : "rgba(10,11,9,.8)"; ctx.fillRect(x + 4 + c * (w - 8) / cols, y - h + 6 + r * (h - 10) / rows, (w - 8) / cols - 4, (h - 10) / rows - 6); }
  ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.fillRect(x + w * .48, y - h, 2, h);
}
function rodaGigante(x, y, r, t) {
  ctx.strokeStyle = "rgba(30,32,26,.95)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke(); ctx.lineWidth = 1.5;
  const rot = Math.sin(t * .2) * .02;
  for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283 + rot; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); ctx.stroke(); ctx.fillStyle = i % 4 ? "rgba(30,32,26,.95)" : "rgba(160,140,40,.7)"; ctx.fillRect(x + Math.cos(a) * r - 5, y + Math.sin(a) * r, 10, 9); }
  ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - r * .6, y + r * 1.25); ctx.lineTo(x, y); ctx.lineTo(x + r * .6, y + r * 1.25); ctx.stroke();
}
function reator(x, y, s, t) {
  ctx.fillStyle = "#1c1d19"; ctx.fillRect(x - s * .6, y - s * .45, s * 1.2, s * .45);
  ctx.beginPath(); ctx.moveTo(x - s * .65, y - s * .45); ctx.quadraticCurveTo(x, y - s * .85, x + s * .65, y - s * .45); ctx.fill(); // arco do sarcófago
  ctx.fillStyle = "#2a2b25"; ctx.fillRect(x + s * .25, y - s * 1.1, s * .1, s * .65);
  for (let i = 0; i < 5; i++) { ctx.fillStyle = i % 2 ? "#8a2a20" : "#d9d2c2"; ctx.fillRect(x + s * .25, y - s * 1.1 + i * s * .06, s * .1, s * .03); }
  luzVermelha(x + s * .3, y - s * 1.12, 10, Math.sin(t * 2) > 0 ? .9 : .2);
}
function particulasRad(t, n = 18) {
  for (let i = 0; i < n; i++) { const x = ((cvRnd(i) * W + t * 6 * (1 + cvRnd(i * 2))) % W), y = ((cvRnd(i * 3) * H - t * 9 * (1 + cvRnd(i))) % H + H) % H, a = .25 + .25 * Math.sin(t * 3 + i);
    luzCor(x, y, 6, a * .5, "180,255,90"); ctx.fillStyle = `rgba(200,255,120,${a})`; ctx.fillRect(x, y, 1.6, 1.6); }
}
function pinheiroVermelho(x, base, h, sem) { arvore(x, base, h, cvRnd(sem) < .5 ? "#3a1a10" : "#2a120c", .28); }
function chernoBase(t, p) {
  const f = p.noite ? 1 : Math.min(.95, SOB.gasta / Math.max(3, energiaMax()) * .9), chao = H * .6, nivel = Math.round(SOB.defesa / 15), luz = f > .55, emissao = SOB.clima === "emissao";
  chernoCeu(f, emissao);
  const lc = SOB.local;
  if (lc === "pripyat") {
    rodaGigante(W * .18, H * .36, H * .08, t); reator(W * .9, chao - H * .12, W * .22, t);
    blocoSovietico(W * .02, chao - H * .02, W * .2, H * .2, t, 0, "#1c1e18"); blocoSovietico(W * .62, chao - H * .03, W * .18, H * .18, t, 0, "#1c1e18");
    const bx = W * .26, bw = W * .4, bh = H * .34;
    blocoSovietico(bx, chao, bw, bh, t, 0); const wx = bx + bw * .36, wy = chao - bh * .62;
    ctx.fillStyle = luz ? "rgba(240,200,120,.8)" : "rgba(170,190,160,.35)"; ctx.fillRect(wx, wy, bw * .2, bh * .1); sobTabuas(wx, wy, bw * .2, bh * .1, Math.min(4, nivel)); if (luz) luzCor(wx + 12, wy + 10, 50, .35, "240,200,120");
    ctx.fillStyle = "rgba(240,240,220,.6)"; ctx.font = `800 ${Math.max(10, H * .014)}px "Big Shoulders Display", sans-serif`; ctx.fillText("ПРИПЯТЬ", bx + 4, chao - bh - 6);
    ctx.fillStyle = "#11120e"; ctx.fillRect(0, chao, W, H);
  } else if (lc === "kopachi") {
    for (let i = 0; i < 9; i++) arvore(W * (i / 8), chao - H * .02, H * (.18 + cvRnd(i) * .1), "#151a12", .25);
    [[.08, .18], [.6, .2]].forEach(([fx, fw], i) => { const x = W * fx, w = W * fw, h = H * .1; ctx.fillStyle = "#2a2015"; ctx.fillRect(x, chao - h, w, h); ctx.fillStyle = "#1a140c"; ctx.beginPath(); ctx.moveTo(x - 8, chao - h); ctx.lineTo(x + w / 2, chao - h - H * .07); ctx.lineTo(x + w + 8, chao - h); ctx.fill();
      ctx.strokeStyle = "rgba(200,180,140,.25)"; ctx.lineWidth = 1; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(x, chao - h + k * h / 4); ctx.lineTo(x + w, chao - h + k * h / 4); ctx.stroke(); }
      ctx.fillStyle = i === 0 ? (luz ? "rgba(240,200,120,.8)" : "rgba(160,170,150,.3)") : "#0c0a07"; ctx.fillRect(x + w * .3, chao - h * .7, w * .25, h * .35); if (i === 0) sobTabuas(x + w * .3, chao - h * .7, w * .25, h * .35, Math.min(4, nivel)); });
    ctx.fillStyle = "#14120c"; ctx.fillRect(0, chao, W, H);
    ctx.strokeStyle = "#3a2c1c"; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i < 14; i++) { ctx.moveTo(i * W / 13, chao + 4); ctx.lineTo(i * W / 13, chao - H * .03); } ctx.stroke();
    trevoRad(W * .9, chao - H * .05, 10, .85);
  } else if (lc === "bunker") {
    ctx.strokeStyle = "rgba(30,34,30,.9)"; ctx.lineWidth = 2;
    for (let i = 0; i < 26; i++) { const x = W * .05 + i * W * .035; ctx.beginPath(); ctx.moveTo(x, chao - H * .05); ctx.lineTo(x, chao - H * .32); ctx.stroke(); }
    for (let k = 0; k < 8; k++) { ctx.beginPath(); ctx.moveTo(W * .05, chao - H * (.05 + k * .034)); ctx.lineTo(W * .95, chao - H * (.05 + k * .034)); ctx.stroke(); }
    ctx.fillStyle = "#1f211d"; ctx.beginPath(); ctx.moveTo(W * .25, chao); ctx.lineTo(W * .32, chao - H * .1); ctx.lineTo(W * .68, chao - H * .1); ctx.lineTo(W * .75, chao); ctx.fill();
    ctx.fillStyle = "#0c0d0b"; ctx.fillRect(W * .44, chao - H * .07, W * .12, H * .07); sobTabuas(W * .44, chao - H * .07, W * .12, H * .07, Math.min(5, Math.round(nivel / 2)));
    ctx.fillStyle = luz ? "rgba(230,80,60,.9)" : "rgba(230,80,60,.4)"; ctx.fillRect(W * .495, chao - H * .085, 6, 4);
    ctx.fillStyle = "#121310"; ctx.fillRect(0, chao, W, H);
  } else {
    for (let i = 0; i < 12; i++) pinheiroVermelho(W * (i / 11) + cvRnd(i) * 20, chao + (i % 2) * 4, H * (.24 + cvRnd(i * 3) * .18), i);
    const cx = W * .52, cw = W * .36, ch = H * .12;
    ctx.fillStyle = "#22160c"; ctx.fillRect(cx - cw / 2, chao - ch, cw, ch); ctx.beginPath(); ctx.moveTo(cx - cw / 2 - 10, chao - ch); ctx.lineTo(cx, chao - ch - H * .07); ctx.lineTo(cx + cw / 2 + 10, chao - ch); ctx.fill();
    ctx.fillStyle = luz ? "rgba(240,190,100,.8)" : "rgba(160,150,140,.3)"; ctx.fillRect(cx - cw * .3, chao - ch * .7, cw * .2, ch * .35); sobTabuas(cx - cw * .3, chao - ch * .7, cw * .2, ch * .35, Math.min(4, nivel));
    ctx.fillStyle = "#120c08"; ctx.fillRect(0, chao, W, H); trevoRad(W * .1, chao - H * .05, 10, .85);
  }
  const sx = W * .45 + Math.sin(t * .3) * W * .02;
  if (!p.semEu) pessoa(sx, chao + H * .045, H * .2, { cabeca: Math.sin(t * .5) > .7 ? -1 : 0 });
  SOB.grupo.forEach((g2, i) => pessoa(sx - W * .12 - i * W * .1, chao + H * .045, H * (.17 + (i % 2) * .02), { cor: "#06080c", dir: i % 2 ? -1 : 1, aro: "rgba(175,190,215,.22)" }));
  const nm = Math.min(4, Math.floor(SOB.dia / 4) + (p.noite ? 2 : 0));
  for (let i = 0; i < nm; i++) { const k = ((t * (.02 + cvRnd(i) * .02) + cvRnd(i * 7)) % 1), dir = cvRnd(i) < .5 ? 1 : -1; monstro(W * (dir > 0 ? k * 1.3 - .15 : 1.15 - k * 1.3), chao + H * .07, H * .14, { quatro: true, fase: t * 5 + i, anda: .9, dir, olhos: .8, olhosRgb: "190,255,120", cor: "#0b0d08", aro: "rgba(180,220,120,.2)" }); }
  particulasRad(t, 10 + Math.round(SOB.rad / 6));
  if (f > .6) { ctx.fillStyle = `rgba(5,7,6,${(f - .6) * .9})`; ctx.fillRect(0, 0, W, H); }
}
function chernoLugar(t, p) {
  const chao = H * .6, k = cvSuave(cvSeg(t, .3, 3.5)), x = cvMix(-W * .05, W * .4, k), c = p.cena;
  chernoCeu(Math.min(.9, SOB.gasta / Math.max(3, energiaMax()) * .9), SOB.clima === "emissao");
  if (c === "usina") { reator(W * .62, chao, W * .6, t); ctx.fillStyle = "#101110"; ctx.fillRect(0, chao, W, H); trevoRad(W * .15, chao - H * .06, 14); }
  else if (c === "parque") { rodaGigante(W * .62, H * .3, H * .14, t); ctx.fillStyle = "#151610"; ctx.fillRect(0, chao, W, H); for (let i = 0; i < 4; i++) { ctx.fillStyle = "#3a3a20"; ctx.fillRect(W * (.1 + i * .2), chao - H * .03, W * .1, H * .03); } }
  else if (c === "duga") { ctx.strokeStyle = "rgba(30,34,30,.9)"; ctx.lineWidth = 2; for (let i = 0; i < 30; i++) { const xx = i * W / 25 - k * W * .3; ctx.beginPath(); ctx.moveTo(xx, chao); ctx.lineTo(xx, chao - H * .42); ctx.stroke(); } for (let j = 0; j < 10; j++) { ctx.beginPath(); ctx.moveTo(0, chao - H * j * .042); ctx.lineTo(W, chao - H * j * .042); ctx.stroke(); } ctx.fillStyle = "#121310"; ctx.fillRect(0, chao, W, H); }
  else if (c === "floresta") { for (let i = 0; i < 14; i++) pinheiroVermelho(((i / 12) * W * 1.3 - k * W * .5) % (W * 1.3), chao + (i % 3) * 4, H * (.25 + cvRnd(i * 3) * .2), i); ctx.fillStyle = "#120c08"; ctx.fillRect(0, chao, W, H); }
  else if (c === "vila") { for (let i = 0; i < 4; i++) { const xx = W * (i * .32) - k * W * .3, w = W * .22; ctx.fillStyle = "#241a10"; ctx.fillRect(xx, chao - H * .09, w, H * .09); ctx.beginPath(); ctx.moveTo(xx - 6, chao - H * .09); ctx.lineTo(xx + w / 2, chao - H * .15); ctx.lineTo(xx + w + 6, chao - H * .09); ctx.fill(); } ctx.fillStyle = "#13110b"; ctx.fillRect(0, chao, W, H); }
  else { for (let i = 0; i < 5; i++) blocoSovietico(W * (i * .26) - k * W * .35, chao, W * .2, H * (.24 + cvRnd(i) * .1), t, 0, "#1d1f19"); ctx.fillStyle = "#11120e"; ctx.fillRect(0, chao, W, H); }
  pessoa(x, chao + H * .03, H * .24, { fase: passo(x, H * .24), anda: k > 0 && k < 1 ? .9 : 0, luz: true, mochila: true });
  if (p.inimigos && !ameaca) for (let i = 0; i < p.inimigos; i++) monstro(W * (.7 + i * .1) + Math.sin(t * 2 + i) * 10, chao + H * .03, H * .16, { quatro: true, fase: t * 4 + i, anda: .7, dir: -1, olhos: 1, olhosRgb: "190,255,120", cor: "#0b0d08" });
  particulasRad(t, 8 + Math.round((p.rad || 0) / 2));
}
function chernoVisita(t, p) {
  chernoBase(t, { noite: p.noite });
  const chao = H * .6, k = cvSuave(cvSeg(t, .3, 3)), x = cvMix(W * 1.1, W * .72, k);
  const n = p.quem === "bandidos" ? 3 : 1;
  for (let i = 0; i < n; i++) { pessoa(x + i * W * .07, chao + H * .02, H * .22, { fase: t * 4 + i, anda: k < 1 ? .8 : 0, dir: -1, luz: p.quem !== "bandidos" || i === 1, capacete: true, mochila: true, cor: p.quem === "bandidos" ? "#030303" : "#06080c" }); }
  if (p.quem === "mercador") { luzCor(x - W * .05, chao - H * .1, 60, .45, "255,200,110"); ctx.fillStyle = "#3a2c1c"; ctx.fillRect(x + W * .04, chao - H * .05, W * .12, H * .05); }
}
function sobNevoa(t, a) { for (let i = 0; i < 4; i++) { const y = H * (.3 + i * .1), x = ((t * 8 * (i + 1)) % (W * 2)) - W * .5; const g = ctx.createLinearGradient(0, y - 40, 0, y + 40); g.addColorStop(0, "rgba(180,185,190,0)"); g.addColorStop(.5, `rgba(180,185,190,${a})`); g.addColorStop(1, "rgba(180,185,190,0)"); ctx.fillStyle = g; ctx.fillRect(x - W, y - 40, W * 3, 80); } }
function sobDesenhar(t) {
  if (!SOB) { if (sobModo === "cherno") { chernoCeu(.3, false); reator(W * .7, H * .6, W * .5, t); ctx.fillStyle = "#11120e"; ctx.fillRect(0, H * .6, W, H); particulasRad(t, 20); } else { sobCeu(.4); acesas = .02; ctx.save(); ctx.translate(0, -H * .1); cidade(); ctx.restore(); ctx.fillStyle = "#0d0e12"; ctx.fillRect(0, H * .6, W, H); sobZumbis(t, H * .63, 5); } return; }
  const c = sobCena, ch = SOB.modo === "cherno";
  if (c.tipo === "lugar") (ch ? chernoLugar : sobLugar)(t, c);
  else if (c.tipo === "visita") (ch ? chernoVisita : sobVisita)(t, c);
  else (ch ? chernoBase : sobBase)(t, c);
  if (SOB.clima === "neblina") sobNevoa(t, .12);
}
CINE.sobrevivencia = { dur: 0, f(t) { sobDesenhar(t); } };

/* ---------- interface ---------- */
function sobLigarCena(c) { sobCena = c; cineAtual = { def: CINE.sobrevivencia, p: {}, dur: 0, chave: "sob" + Math.random(), t0: performance.now(), vel: 1, fim: null }; }
function sobHud() {
  if (!SOB) return;
  const barra = (n, v, cor, icone, txt, ruimAlto) => `<div class="sb-barra ${(ruimAlto ? v > 70 : v < 25) ? "baixo" : ""}"><span class="sb-l">${ic(icone)}${n}</span><span class="sb-b"><i style="width:${Math.max(0, Math.min(100, v))}%;background:${cor}"></i></span><span class="sb-v">${txt ?? Math.round(v)}</span></div>`;
  const pips = Array.from({ length: energiaMax() }, (_, i) => `<i class="${i < SOB.energia ? "on" : ""}">${ic("energia")}</i>`).join("");
  const cl = CLIMA[SOB.clima] || CLIMA.limpo;
  const chips = [["comida", totalTipo("comida"), "Comida"], ["remedio", totalTipo("cura"), "Cura"], ["material", qtd("material"), "Mat."], ["municao", qtd("municao"), "Munição"], ["sucata", qtd("sucata"), "Sucata"]];
  if (M().radiacao) chips.push(["rad", qtd("filtro"), "Filtros"]);
  chips.push(["grupo", SOB.grupo.length, "Grupo"]);
  $s("sobHud").innerHTML =
    `<div class="sb-topo"><span class="sb-dia">Dia ${SOB.dia}</span><span class="sb-hora">${horaNome()} · ${L().nome}<br><span class="sb-clima">${ic(cl[1])}${cl[0]}</span></span><span class="sb-en" aria-label="Energia ${SOB.energia} de ${energiaMax()}">${pips}</span></div>` +
    barra("Saúde", SOB.saude, "#d9473b", "saude") + barra("Fome", SOB.fome, "#e39a3a", "fome", SOB.fome < 25 ? "Faminto" : Math.round(SOB.fome)) +
    (M().radiacao ? barra("Radiação", SOB.rad, "#a8d84a", "rad", SOB.rad > 70 ? "Perigo" : Math.round(SOB.rad), true) : "") + barra("Defesa", SOB.defesa, "#4fb8c4", "defesa") +
    `<div class="sb-inv">${chips.map(([i, n, t]) => `<span class="sb-chip">${ic(i)}<b>${n}</b><small>${t}</small></span>`).join("")}</div>`;
}
function sobFlutua(txt, bom = true) { const el = document.createElement("div"); el.className = "sb-flutua " + (bom ? "bom" : "ruim"); el.textContent = txt; el.style.left = (14 + Math.random() * 46) + "%"; el.style.top = (34 + Math.random() * 10) + "%"; $s("sob").appendChild(el); setTimeout(() => el.remove(), 1700); }
function sobTexto(html, falar = true) { const el = $s("sobTexto"); el.classList.remove("in"); void el.offsetWidth; el.innerHTML = html; el.classList.add("in"); if (falar && typeof narrar === "function") narrar(html); }
function sobBotoes(lista) {
  const box = $s("sobAcoes"); box.innerHTML = "";
  lista.forEach((b, i) => {
    const e = document.createElement("button"); e.type = "button"; e.className = "sb-acao " + (b.cls || ""); e.disabled = !!b.desat;
    e.innerHTML = `${b.icone ? ic(b.icone) : ""}<span class="sb-at"><b>${b.t}</b>${b.sub ? `<small>${b.sub}</small>` : ""}</span>${b.custo ? `<span class="sb-custo">${ic("energia")}${b.custo}</span>` : ""}`;
    e.addEventListener("click", ev => { ev.stopPropagation(); if (sobOcupado) return; tocar("clique"); b.on(); });
    box.appendChild(e); setTimeout(() => e.classList.add("show"), 50 * i);
  });
}
function sobAnimar(cena, ms, depois) { sobOcupado = true; sobLigarCena(cena); setTimeout(() => { sobOcupado = false; depois(); }, reduz ? 0 : ms); }

/* ---------- objetivos ---------- */
function objetivosAtivos() { return M().objetivos.map((o, i) => ({ ...o, i })).filter(o => !SOB.obj.includes(o.i)).slice(0, 3); }
function sobChecarObjetivos() {
  if (!SOB) return;
  objetivosAtivos().forEach(o => {
    if (!o.ok(SOB)) return;
    SOB.obj.push(o.i); if (o.aoCumprir) o.aoCumprir(SOB);
    for (const [k, v] of Object.entries(o.premio)) sobMuda(k, v, false);
    setTimeout(() => { aviso("Objetivo concluído: " + o.t); tocar("sucesso"); vibrar(60); sobFlutua("Objetivo!", true); }, 500);
  });
}
function abrirObjetivos() {
  const lista = M().objetivos, feitos = SOB.obj.length, ativos = objetivosAtivos();
  const premio = p => Object.entries(p).map(([k, v]) => v + " " + ITENS[k].nome.toLowerCase()).join(", ");
  painel("Objetivos", `<p class="pn-sub">${feitos} de ${lista.length} concluídos. Cumpra para ganhar recompensas.</p>` +
    ativos.map(o => `<div class="pn-obj">${ic("objetivo")}<div><b>${o.t}</b><small>Recompensa: ${premio(o.premio)}</small></div></div>`).join("") +
    (ativos.length ? "" : `<p class="pn-sub">Você cumpriu todos os objetivos. Agora é só sobreviver.</p>`) +
    lista.filter((o, i) => SOB.obj.includes(i)).map(o => `<div class="pn-obj ok">${ic("objetivo")}<div><b>${o.t}</b><small>Concluído</small></div></div>`).join(""));
}

/* ---------- mochila e horta ---------- */
function painel(titulo, html) {
  let p = $s("sobPainel");
  if (!p) { p = document.createElement("div"); p.id = "sobPainel"; p.className = "sb-painel"; $s("sob").appendChild(p); }
  p.innerHTML = `<div class="pn-in"><div class="pn-top"><h2>${titulo}</h2><button type="button" class="pn-x" aria-label="Fechar">${ic("x")}</button></div><div class="pn-corpo">${html}</div></div>`;
  p.querySelector(".pn-x").addEventListener("click", () => { fecharPainel(); sobDia(); });
  p.classList.add("on");
}
function fecharPainel() { const p = $s("sobPainel"); if (p) p.classList.remove("on"); }
function abrirMochila(msg) {
  const livres = SOB.horta.filter(h => !h).length;
  let h = msg ? `<p class="pn-msg">${msg}</p>` : "";
  h += `<h3>${ic("horta")}Horta · ${SOB.horta.length - livres}/${SOB.horta.length} canteiros</h3><div class="pn-horta">` + SOB.horta.map((c, i) => {
    if (!c) return `<div class="pn-can vazio"><span>Vazio</span><small>Plante uma semente da mochila</small></div>`;
    const it = ITENS[c.planta], pronto = c.dias <= 0;
    return `<div class="pn-can ${pronto ? "pronto" : ""}"><span>${it.nome}</span><small>${pronto ? "Pronta para colher" : "Falta" + (c.dias > 1 ? "m " : " ") + c.dias + (c.dias > 1 ? " dias" : " dia")}</small><i class="pn-cresce" style="width:${pronto ? 100 : (1 - c.dias / c.total) * 100}%"></i>${pronto ? `<button type="button" data-colher="${i}">Colher</button>` : ""}</div>`;
  }).join("") + `</div>`;
  for (const [tipo, nome] of GRUPOS_MOCHILA) {
    const itens = Object.entries(SOB.inv).filter(([k, v]) => v > 0 && ITENS[k] && ITENS[k].tipo === tipo);
    if (!itens.length) continue;
    h += `<h3>${nome}</h3>` + itens.map(([k, v]) => {
      const it = ITENS[k];
      let efeito = "", botao = "";
      if (tipo === "comida") { efeito = `+${it.fome} fome${it.rad ? ` · +${it.rad} radiação` : ""}`; botao = `<button type="button" data-comer="${k}" ${SOB.fome >= 100 ? "disabled" : ""}>Comer</button>`; }
      if (tipo === "semente") { efeito = `Planta ${ITENS[it.planta].nome.toLowerCase()} · ${it.dias} dias · rende ${it.rende}`; botao = `<button type="button" data-plantar="${k}" ${livres ? "" : "disabled"}>Plantar</button>`; }
      if (tipo === "cura") { efeito = [it.saude ? `${it.saude > 0 ? "+" : ""}${it.saude} saúde` : "", it.rad ? `${it.rad} radiação` : "", it.cura ? "cura mordida" : ""].filter(Boolean).join(" · "); botao = `<button type="button" data-usar="${k}">Usar</button>`; }
      if (tipo === "recurso" || tipo === "ferramenta") efeito = it.desc;
      return `<div class="pn-item">${ic(it.ic)}<div class="pn-it"><b>${it.nome} <span>×${v}</span></b><small>${efeito}</small></div>${botao}</div>`;
    }).join("");
  }
  painel("Mochila", h);
  const p = $s("sobPainel");
  p.querySelectorAll("[data-comer]").forEach(b => b.addEventListener("click", () => { const k = b.dataset.comer, it = ITENS[k]; sobMuda(k, -1, false); sobMuda("fome", it.fome); if (it.rad && M().radiacao) sobMuda("rad", it.rad); tocar("item"); sobHud(); sobGravar(); sobFazer("comer", 1800, () => sobDia(`Você come ${it.nome.toLowerCase()}. ${it.fome >= 35 ? "Matou bem a fome." : it.fome <= 15 ? "Mal deu para enganar o estômago." : ""}`), { item: k }); }));
  p.querySelectorAll("[data-plantar]").forEach(b => b.addEventListener("click", () => { const k = b.dataset.plantar, it = ITENS[k], i = SOB.horta.findIndex(c => !c); if (i < 0) return; sobMuda(k, -1, false); SOB.horta[i] = { planta: it.planta, dias: it.dias, total: it.dias, rende: it.rende }; SOB.st.plantou++; tocar("item"); sobChecarObjetivos(); sobHud(); sobGravar(); sobFazer("plantar", 2200, () => sobDia(`Você planta ${it.nome.toLowerCase()}. Em ${it.dias} dias dá para colher.`)); }));
  p.querySelectorAll("[data-colher]").forEach(b => b.addEventListener("click", () => { const i = +b.dataset.colher, c = SOB.horta[i]; const n = c.rende + (SOB.clima === "chuva" ? 1 : 0); sobMuda(c.planta, n); SOB.horta[i] = null; SOB.st.colheu++; SOB.st.colhidos += n; tocar("sucesso"); sobChecarObjetivos(); sobHud(); sobGravar(); sobFazer("colher", 2000, () => sobDia(`Você colhe ${n} ${ITENS[c.planta].nome.toLowerCase()}${n > 1 ? "s" : ""}.`), { item: c.planta }); }));
  p.querySelectorAll("[data-usar]").forEach(b => b.addEventListener("click", () => { const k = b.dataset.usar, it = ITENS[k]; sobMuda(k, -1, false); if (it.saude) sobMuda("saude", it.saude); if (it.rad && M().radiacao) sobMuda("rad", it.rad); if (it.cura) SOB.mordido = null; tocar("sucesso"); sobHud(); sobGravar(); if (!sobFim()) sobFazer("curar", 1800, () => sobDia(`Você usa ${it.nome.toLowerCase()}.`)); }));
}

/* ---------- o dia ---------- */
function sobDia(msg) {
  if (!SOB) return;
  fecharPainel(); sobChecarObjetivos(); sobGravar(); sobHud(); sobLigarCena({ tipo: "base" });
  setVer(SOB.clima === "chuva" ? ["chuva"] : []);
  setAmb({ drone: .35 + SOB.gasta * .1, vento: SOB.clima === "chuva" ? .5 : .35, chuva: SOB.clima === "chuva" ? .7 : 0 });
  const l = L(), sem = SOB.energia <= 0;
  const frase = ["O dia nasce cinza.", "O sol está alto.", "A tarde avança.", "O céu começa a escurecer.", "Logo vai anoitecer."][Math.min(4, SOB.gasta)];
  sobTexto(msg || (sem ? `Você está exausto. Não dá para fazer mais nada hoje.` : `${l.base}. ${frase} ${SOB.clima === "emissao" ? "<span class='msg'>O rádio avisa: emissão chegando esta noite.</span>" : ""}`), !!msg);
  const b = [];
  if (!sem) {
    b.push({ t: "Vasculhar", sub: "Buscar suprimentos", icone: "busca", custo: 1, on: sobEscolherLugar });
    b.push({ t: "Fortificar", sub: qtd("material") >= 2 ? "2 materiais · +12 defesa" : "Sem materiais: +4", icone: "martelo", custo: 1, on: sobFortificar });
    b.push({ t: l.especial.nome, sub: l.especial.desc, icone: l.especial.ic, custo: 1, on: sobEspecial });
    b.push({ t: "Descansar", sub: "+12 saúde", icone: "cama", custo: 1, on: sobDescansar });
  }
  const prontas = SOB.horta.filter(c => c && c.dias <= 0).length;
  b.push({ t: "Mochila", sub: prontas ? `${prontas} para colher` : "Comer, plantar, curar", icone: "mochila", cls: "mini" + (prontas ? " alerta" : ""), on: () => abrirMochila() });
  b.push({ t: "Objetivos", sub: `${SOB.obj.length}/${M().objetivos.length}`, icone: "objetivo", cls: "mini", on: abrirObjetivos });
  b.push({ t: "Dormir", sub: sem ? "Passar a noite" : "Encerrar o dia", icone: "lua", cls: sem ? "destaque" : "mini", on: sobNoite });
  sobBotoes(b);
}
function sobGastar() { SOB.energia--; SOB.gasta++; sobMuda("fome", -5, false); }
function sobRisco(base) { return Math.min(.92, (base * L().perigo * (1 + SOB.dia * .045)) + (SOB.clima === "neblina" ? .08 : 0) - (SOB.clima === "chuva" ? .06 : 0) - (SOB.vigiaHoje ? .15 : 0)); }
function sobEscolherLugar() {
  const l = L(), geiger = qtd("geiger") > 0;
  sobTexto("Para onde você vai?", false);
  sobBotoes([...l.lugares.map(g => ({ t: g.nome, sub: g.desc + " · risco " + (g.risco < .35 ? "baixo" : g.risco < .5 ? "médio" : "alto") + (M().radiacao ? " · rad " + (geiger ? g.rad : "?") : ""), icone: M().radiacao && g.rad >= 20 ? "rad" : "busca", on: () => sobVasculhar(g) })),
    { t: "Voltar", icone: "porta", cls: "mini", on: () => sobDia() }]);
}
function sobVasculhar(g) {
  sobGastar(); SOB.st.vasculhou++; tocar("passos");
  let radTxt = "";
  if (M().radiacao) {
    let r = g.rad + (SOB.clima === "chuva" ? 5 : 0) + (SOB.clima === "emissao" ? 6 : 0);
    if (qtd("filtro")) { sobMuda("filtro", -1, false); r = Math.round(r / 2); radTxt = " O filtro da máscara segurou boa parte da radiação."; }
    sobMuda("rad", r); repetir(() => tocar("geiger"), 260, 0, Math.min(12, Math.round(r / 3)));
  }
  sobGravar();
  sobTexto(`Você sai em direção a: <em>${g.nome}</em>…`, false); $s("sobAcoes").innerHTML = "";
  sobAnimar({ tipo: "lugar", cena: g.cena, rad: g.rad }, 3200, () => {
    if (g.usina) SOB.st.usina++;
    if (sobFim()) return;
    if (sobChance(sobRisco(g.risco))) return sobEncontro(g);
    const achou = sobLoot(g.loot);
    const extras = M().radiacao ? ["O contador estala sem parar perto de uma poça escura.", "Num quarto, um calendário parado em abril de 1986.", "Uma boneca sem olhos sentada numa cadeira, de frente para a porta.", "Ao longe, um uivo que não é de lobo."] : ["Silêncio total. Só o vento nas janelas quebradas.", "Você encontra um bilhete: \"fomos para o norte\".", "Um cachorro magro te segue por um tempo e some.", "Marcas de unha na porta. Faz tempo que ninguém passa aqui."];
    tocar("item"); sobChecarObjetivos(); sobHud();
    sobTexto(`${extras[sobRnd(0, extras.length - 1)]} Você volta com <em>${achou}</em>.${radTxt}`);
    sobBotoes([{ t: "Voltar para a base", icone: "porta", cls: "destaque", on: () => sobDia() }]);
  });
}
function sobEncontro(g) {
  const n = sobRnd(1, Math.min(5, 1 + Math.floor(SOB.dia / 4))), mut = M().inimigo === "mutante";
  sobLigarCena({ tipo: "lugar", cena: g.cena, zumbis: mut ? 0 : n, inimigos: mut ? Math.min(3, n) : 0, rad: g.rad });
  tocar(mut ? "criaturaSom" : "gemido"); vibrar(120);
  const quem = mut ? (n > 1 ? `${n} cães mutantes, sem pelo, com olhos verdes,` : "Um cão mutante, sem pelo, com olhos verdes,") : (n > 1 ? `${n} zumbis` : "Um zumbi");
  sobTexto(`${quem} ${n > 1 ? "aparecem" : "aparece"} e ${n > 1 ? "vêm" : "vem"} na sua direção.`);
  const volta = () => sobFim() || sobBotoes([{ t: "Voltar para a base", icone: "porta", cls: "destaque", on: () => sobDia() }]);
  sobBotoes([
    { t: "Atirar", sub: `Gasta ${n} munição · tem ${qtd("municao")}`, icone: "municao", desat: qtd("municao") < n, on: () => { sobMuda("municao", -n); tocar("impacto"); tremer(0, .3); const a = sobLoot(g.loot, 1.2); sobChecarObjetivos(); sobHud(); sobTexto(`Os tiros ecoam longe. Você pega o que veio buscar: <em>${a}</em>. O barulho atrai mais deles para perto da base.`); SOB.barulho = (SOB.barulho || 0) + 1; volta(); } },
    { t: "Se esconder", sub: "Segure quando olharem", icone: "busca", on: () => sobMiniEsconder(n, mut, ok => { if (ok) { const a = sobLoot(g.loot, .8); sobChecarObjetivos(); sobTexto(`Eles passam sem te ver. Quando somem, você pega <em>${a}</em>.`); } else { sobMuda("saude", -sobRnd(18, 30)); const m = !mut && sobChance(.25); if (m) SOB.mordido = SOB.dia; sobTexto(`${mut ? "Os dentes rasgam sua perna" : "Um deles te agarra pelo braço"}. Você se solta e foge, sangrando. ${m ? "<span class='msg'>Tem uma marca de dente no seu braço. Use um remédio.</span>" : ""}`); } sobHud(); volta(); }) },
    { t: "Fugir", sub: "Volta sem nada", icone: "porta", on: () => { if (sobChance(.75)) sobTexto("Você corre sem olhar para trás até a base."); else { sobMuda("saude", -sobRnd(8, 15)); sobTexto("Na fuga, você cai e se corta feio."); } sobHud(); volta(); } },
  ]);
}
function sobFortificar() {
  sobGastar(); tocar("batidas");
  let g; if (qtd("material") >= 2) { sobMuda("material", -2, false); g = sobMuda("defesa", 12); } else g = sobMuda("defesa", 4);
  repetir(() => tocar("toque"), 385, .2, 5);
  sobFazer("fortificar", 2300, () => sobDia(g > 4 ? (M().radiacao ? "Você veda as janelas com plástico e tábuas. Menos poeira radioativa entra, e menos bichos também." : "Você prega tábuas nas janelas e reforça a porta.") : "Sem materiais, você só arrasta móveis para a porta."));
}
function sobDescansar() { sobGastar(); sobMuda("saude", 12); tocar("respira"); sobFazer("descansar", 2200, () => sobDia("Você fecha os olhos por algumas horas perto do fogo.")); }
function sobEspecial() {
  sobGastar(); const e = L().especial;
  if (e.loot) { const a = sobLoot(e.loot); return sobFazer("saquear", 3400, () => { tocar("item"); sobDia(`Você arromba os apartamentos vizinhos, um por um. Encontra <em>${a}</em>.`); }); }
  if (e.caca) { const ok = sobChance(.7); return sobFazer("cacar", 2800, () => { if (ok) { const it = e.cacaItem || "carne", n = sobRnd(1, 2); sobMuda(it, n); if (it === "javali" && M().radiacao) sobMuda("rad", 4); tocar("sucesso"); return sobDia(it === "javali" ? "Um javali enorme, com manchas estranhas no couro. Muita carne." : "Você volta com carne de caça para uns dias."); } sobMuda("saude", -sobRnd(8, 14)); tocar("erro"); sobDia("O bicho escapa. Na correria, você escorrega num barranco e volta mancando."); }); }
  if (e.rega) { let n = 0; SOB.horta.forEach(c => { if (c && c.dias > 0) { c.dias--; n++; } }); return sobFazer("regar", 2400, () => { tocar("item"); sobDia(n ? `Você rega e capina os canteiros. ${n} planta${n > 1 ? "s cresceram" : " cresceu"} um dia.` : "Você prepara a terra. Plante sementes pela mochila."); }); }
  if (e.radio) { SOB.radioChama = true; tocar("radio"); const ouviu = ["\"…quem estiver ouvindo, o comerciante passa amanhã pela estrada do radar…\"", "\"…emissão prevista, fiquem nos abrigos…\"", "\"…grupo de saqueadores visto perto do posto…\""]; return sobFazer("radio", 2400, () => sobDia(`Você gira o dial até achar uma voz: ${ouviu[sobRnd(0, 2)]}`)); }
  if (e.vigia) { SOB.vigia = true; SOB.vigiaAmanha = true; return sobFazer("vigiar", 2600, () => sobDia(M().radiacao ? "Do telhado, com o binóculo, você marca os caminhos seguros e as manchas de radiação." : "Você sobe na torre e marca as brechas no muro. Esta noite vai ser mais tranquila.")); }
}

/* ---------- noite ---------- */
function sobNoite() {
  sobOcupado = true; $s("sobAcoes").innerHTML = ""; fecharPainel();
  sobTexto("Você tranca tudo e apaga as luzes.", false);
  sobCena = { tipo: "acao", acao: "dormir", t0: performance.now() }; cineAtual = { def: CINE.sobrevivencia, p: {}, dur: 0, chave: "dormir", t0: performance.now(), vel: 1, fim: null };
  setAmb({ drone: .9, vento: .6, chuva: SOB.clima === "chuva" ? .8 : 0 });
  setTimeout(() => {
    sobLigarCena({ tipo: "base", noite: true });
    sobOcupado = false;
    let fugiu = null;
    SOB.grupo.forEach(g => { const comida = Object.keys(SOB.inv).find(k => ITENS[k] && ITENS[k].tipo === "comida" && SOB.inv[k] > 0); if (comida) sobMuda(comida, -1, false); else g.fome = (g.fome || 0) + 1; });
    const sai = SOB.grupo.find(g => g.fome >= 2); if (sai) { SOB.grupo = SOB.grupo.filter(g => g !== sai); fugiu = sai.nome; }
    sobMuda("fome", -25, false);
    SOB.horta.forEach(c => { if (c && c.dias > 0) c.dias -= SOB.clima === "chuva" ? 2 : 1; if (c && c.dias < 0) c.dias = 0; });
    const pos = msg => sobAmanhecer((fugiu ? `${fugiu} foi embora durante a noite: não tinha comida para todos. ` : "") + msg);
    if (SOB.clima === "emissao") return sobEmissao(pos);
    const chance = .4 * L().perigo * (1 + SOB.dia * .06) + (SOB.barulho || 0) * .15 - SOB.defesa / 260 - (SOB.vigia ? .2 : 0);
    const inf = SOB.grupo.find(g => g.mordido), r = Math.random();
    if (inf && sobChance(.7)) return sobInfectado(inf, pos);
    if (r < Math.max(.08, chance)) return sobHorda(pos);
    if (r < chance + .14) return sobBarulho(pos);
    if (r < chance + .24) return sobVisitante(true, pos);
    sobMuda("saude", 5, false);
    pos(M().radiacao ? "A noite passa com o contador estalando baixinho." : "A noite passa sem nada além de gemidos ao longe.");
  }, reduz ? 0 : 2200);
}
function sobEmissao(pos) {
  SOB.st.emissoes++; tocar("tremor"); vibrar(400); tremer(0, 2);
  const r = SOB.defesa >= 40 ? sobRnd(6, 12) : sobRnd(22, 35);
  sobMuda("rad", r);
  sobTexto(`O céu fica vermelho e o chão treme. A Emissão atravessa a Zona inteira. ${SOB.defesa >= 40 ? "As janelas vedadas seguram o pior." : "<span class='msg'>As frestas deixam a radiação entrar.</span>"}`);
  sobBotoes([{ t: "Esperar passar", icone: "lua", cls: "destaque", on: () => sobFim() || pos("De manhã, tudo parece igual. Só os bichos ficaram mais quietos.") }]);
}
function sobHorda(pos) {
  const n = sobRnd(3, 6 + Math.floor(SOB.dia / 2)), mut = M().inimigo === "mutante";
  tocar("batidas"); tocar(mut ? "criaturaSom" : "gemido"); vibrar(300);
  const forca = n * 9, segura = SOB.defesa >= forca, nome = mut ? `uma matilha de ${n} cães mutantes` : `uma horda de ${n} zumbis`;
  if (segura) { sobMuda("defesa", -Math.round(forca / 3)); sobTexto(`Você acorda com ${nome} batendo nas paredes. As barricadas aguentam, mas ficam danificadas.`); return sobBotoes([{ t: "Esperar amanhecer", icone: "lua", cls: "destaque", on: () => pos("Eles se dispersam com o sol.") }]); }
  sobMuda("defesa", -Math.round(forca / 2));
  sobTexto(`${nome[0].toUpperCase() + nome.slice(1)} arrebenta a barricada. Eles estão entrando!`);
  const a = Math.ceil(n / 2);
  sobBotoes([
    { t: "Atirar", sub: `Gasta ${a} munição`, icone: "municao", desat: qtd("municao") < a, on: () => { sobMuda("municao", -a); sobMuda("saude", -sobRnd(0, 10)); tocar("impacto"); sobHud(); sobFim() || pos("Você atira até o último cair na porta."); } },
    { t: "Segurar a porta", sub: "Toque rápido!", icone: "defesa", on: () => sobMiniTocar(14 + Math.floor(n / 2), 5, ok => { sobMuda("saude", ok ? -sobRnd(0, 8) : -sobRnd(25, 40)); sobHud(); sobFim() || pos(ok ? "Você segura a porta com o ombro até eles desistirem." : "Eles te derrubam. Você luta no escuro e sobrevive, por pouco."); }) },
    { t: "Fugir pelos fundos", sub: "Perde metade das coisas", icone: "porta", on: () => { Object.keys(SOB.inv).forEach(k => { if (ITENS[k].tipo !== "ferramenta") sobMuda(k, -Math.ceil(SOB.inv[k] / 2), false); }); sobHud(); pos("Você foge e volta de manhã. Metade de tudo sumiu."); } },
  ]);
}
function sobBarulho(pos) {
  tocar("arranhar");
  sobTexto(M().radiacao ? "Um barulho lá fora. Algo arranhando a porta. Ou alguém." : "Um barulho no quintal. Algo arrastando, metal batendo em metal.");
  sobBotoes([
    { t: "Investigar", icone: "busca", on: () => { if (sobChance(.55)) { const a = sobLoot(M().radiacao ? [lt("iodo", 0, 1), lt("filtro", 0, 2), lt("enlatado", 0, 1), lt("municao", 0, 2)] : [lt("enlatado", 0, 2), lt("municao", 0, 2), lt("material", 1, 2)]); tocar("item"); sobHud(); pos(`Era a mochila de alguém que não teve sorte. Você pega ${a}.`); } else sobMiniEsconder(2, M().inimigo === "mutante", ok => { if (!ok) sobMuda("saude", -sobRnd(15, 25)); sobHud(); sobFim() || pos(ok ? "Era um deles. Você volta sem ser visto." : "Era um deles. Ele te pega antes de você trancar a porta."); }); } },
    { t: "Ignorar", icone: "lua", on: () => pos("Você cobre a cabeça e espera o barulho passar.") },
  ]);
}
function sobInfectado(g, pos) {
  tocar("susto"); susto = performance.now(); vibrar(400);
  SOB.grupo = SOB.grupo.filter(x => x !== g); sobMuda("saude", -sobRnd(15, 30)); sobHud();
  sobTexto(`No meio da noite, ${g.nome} levanta da cama. Os olhos estão brancos. A mordida que ninguém viu.`);
  sobBotoes([{ t: "…", icone: "lua", cls: "destaque", on: () => sobFim() || pos(`De manhã, você enterra ${g.nome} no quintal.`) }]);
}
function sobAmanhecer(msgNoite) {
  if (sobFim()) return;
  if (SOB.fome <= 0) sobMuda("saude", -18, false); else if (SOB.fome < 25) sobMuda("saude", -6, false);
  if (M().radiacao) { if (SOB.rad >= 70) sobMuda("saude", -10, false); sobMuda("rad", -3 + (L().radBase || 0), false); SOB.st.diasRadBaixa = SOB.rad < 30 ? SOB.st.diasRadBaixa + 1 : 0; }
  if (SOB.mordido && SOB.dia - SOB.mordido >= 1) { const cura = ["remedio", "kit"].find(k => qtd(k)); if (cura) { sobMuda(cura, -1, false); SOB.mordido = null; } else { sobMuda("saude", -25, false); SOB.mordido = null; } }
  if (sobFim()) return;
  SOB.dia++; SOB.gasta = 0; SOB.energia = energiaMax(); SOB.vigia = false; SOB.barulho = 0;
  SOB.vigiaHoje = !!SOB.vigiaAmanha; SOB.vigiaAmanha = false;
  sobMuda("defesa", -4, false);
  const r = Math.random(); let acc = 0; SOB.clima = "limpo";
  for (const [c, p] of M().climas) { acc += p; if (r < acc) { SOB.clima = c; break; } }
  try { if (SOB.dia > sobRecorde(SOB.modo)) localStorage.setItem("pv_rec_" + SOB.modo, SOB.dia); } catch (e) {}
  sobChecarObjetivos(); sobGravar(); sobHud();
  const cl = CLIMA[SOB.clima];
  sobTexto(`${msgNoite}<br><b class="sb-novo-dia">Dia ${SOB.dia}</b><span class="sb-clima-dia">${ic(cl[1])}${cl[0]}</span>`);
  sobBotoes([{ t: "Começar o dia", icone: "energia", cls: "destaque", on: sobManha }]);
}
function sobManha() {
  const r = Math.random();
  if ((SOB.dia > 2 && r < .17) || (SOB.radioChama && r < .5)) { SOB.radioChama = false; return sobMercador(); }
  if (SOB.dia > 2 && r < .3) return sobVisitante(false, m => sobDia(m));
  if (SOB.dia > 4 && r < .4) return sobBandidos();
  if (r < .48) { const a = sobLoot(M().radiacao ? [lt("iodo", 0, 2), lt("racao", 0, 1), lt("filtro", 0, 2), lt("enlatado", 0, 2)] : [lt("enlatado", 1, 2), lt("remedio", 0, 1), lt("municao", 0, 3), lt("s_cenoura", 1, 1, .3)]); tocar("item"); sobHud(); return sobDia(`${M().radiacao ? "Um drone do exército larga uma caixa de ajuda perto do abrigo." : "Um helicóptero passa baixo e larga uma caixa de suprimentos."} Dentro: ${a}.`); }
  sobDia();
}
function sobVisitante(noite, depois) {
  const nomes = M().radiacao ? ["Oksana", "Dmitri", "Lev", "Irina", "o velho Mykola", "Yuri", "Katya", "Pavlo"] : ["Rita", "Jonas", "Dona Lurdes", "Caio", "Bia", "Seu Antônio", "Marcela", "Tiago", "Nina", "Paulo"];
  const nome = nomes[sobRnd(0, nomes.length - 1)], mordido = !M().radiacao && sobChance(.3), doente = M().radiacao && sobChance(.25);
  sobLigarCena({ tipo: "visita", quem: "pessoa", noite, crianca: sobChance(.25) }); tocar("batidas");
  sobTexto(`${noite ? "No meio da noite, alguém" : "Alguém"} bate na porta. É ${nome}. ${mordido ? "Está com o braço enrolado num pano sujo." : doente ? "Tosse sem parar e tem manchas na pele." : "Está magro, mas parece bem."} Pede para entrar.`);
  const cheio = SOB.grupo.length >= 3;
  const entra = (m, msg) => abrirPortaE(() => { SOB.grupo.push({ nome, mordido: m }); if (sobChance(.5)) sobLoot([lt("enlatado", 0, 2), lt("municao", 0, 2)]); if (doente) sobMuda("rad", 8, false); tocar("sucesso"); sobChecarObjetivos(); sobHud(); depois(msg); });
  sobBotoes([
    { t: "Deixar entrar", sub: cheio ? "Grupo cheio" : "+1 energia por dia, mas come", icone: "grupo", desat: cheio, on: () => entra(mordido, `${nome} entra e agradece. Agora vocês são ${SOB.grupo.length + 2}.`) },
    { t: "Revistar antes", sub: "Ver se tem mordida", icone: "busca", desat: cheio, on: () => { if (sobCena) sobCena.fresta = true; if (mordido) { sobTexto(`Debaixo do pano, uma mordida roxa. ${nome} implora.`); sobBotoes([{ t: "Mandar embora", icone: "porta", on: () => depois(`${nome} vai embora sem olhar para trás.`) }, { t: "Deixar entrar mesmo assim", icone: "grupo", on: () => entra(true, `${nome} entra. Você tenta não pensar na mordida.`) }]); } else entra(false, `Tudo certo. ${nome} entra para o grupo.`); } },
    { t: "Mandar embora", icone: "porta", on: () => depois(`${nome} some ${noite ? "no escuro" : "pela estrada"}.`) },
  ]);
}
function sobMercador() {
  sobLigarCena({ tipo: "visita", quem: "mercador" }); tocar("campainha");
  const ofertas = [...M().mercador].sort(() => Math.random() - .5).slice(0, 3); sobCena.ofertas = ofertas.map(o => o[0]); window.__ultimasOfertas = sobCena.ofertas;
  const mostrar = msg => {
    sobTexto(msg || (M().radiacao ? "Um comerciante de máscara e sobretudo para na porta. \"Iodo, filtros, comida. Aceito artefatos.\"" : "Um mercador chega puxando uma carroça, com um lampião pendurado. \"Tenho o que você precisa.\""), !msg);
    sobBotoes([...ofertas.map(([da, n, paga, custo]) => ({ t: `${n} ${ITENS[da].nome}`, sub: `Paga ${custo} ${ITENS[paga].nome.toLowerCase()} · tem ${qtd(paga)}`, icone: ITENS[da].ic, desat: qtd(paga) < custo, on: () => { abrirPortaE(null); sobMuda(paga, -custo); sobMuda(da, n); SOB.st.comprou++; tocar("item"); sobChecarObjetivos(); sobHud(); sobFazer("comprar", 1500, () => { sobLigarCena({ tipo: "visita", quem: "mercador", abrir: performance.now() - 2000, ofertas: window.__ultimasOfertas }); mostrar("Negócio fechado. \"Mais alguma coisa?\""); }); } })),
      { t: "Dispensar", icone: "porta", cls: "mini", on: () => sobDia("O mercador vai embora pela estrada.") }]);
  };
  mostrar();
}
function sobBandidos() {
  sobLigarCena({ tipo: "visita", quem: "bandidos" }); tocar("passos"); vibrar(80);
  const total = totalTipo("comida");
  sobTexto(M().radiacao ? "Três saqueadores de máscara param na frente do abrigo. \"Metade do que você tem, e ninguém se machuca.\"" : "Três homens armados param na frente da base. \"Metade da sua comida, e ninguém se machuca.\"");
  sobBotoes([
    { t: "Entregar comida", sub: `Perde metade (${Math.ceil(total / 2)})`, icone: "comida", on: () => { let falta = Math.ceil(total / 2); for (const k of Object.keys(SOB.inv)) { if (!falta) break; if (ITENS[k].tipo === "comida") { const t2 = Math.min(falta, SOB.inv[k]); sobMuda(k, -t2, false); falta -= t2; } } sobHud(); sobDia("Eles pegam a comida e vão embora rindo."); } },
    { t: "Ameaçar com a arma", sub: "Precisa de 3 munição", icone: "municao", desat: qtd("municao") < 3, on: () => { if (sobChance(.6 + SOB.grupo.length * .1)) { sobMuda("municao", -1); tocar("impacto"); sobDia("Um tiro para o alto. Eles recuam e somem."); } else { sobMuda("municao", -3); sobMuda("saude", -sobRnd(15, 30)); tocar("impacto"); sobHud(); sobFim() || sobDia("Troca de tiros. Eles fogem, mas você leva um tiro de raspão."); } } },
    { t: "Oferecer sucata", sub: "Paga 4 sucata", icone: "sucata", desat: qtd("sucata") < 4, on: () => { sobMuda("sucata", -4); sobHud(); sobDia("\"Serve.\" Eles pegam a sucata e seguem."); } },
  ]);
}

/* ---------- minijogos ---------- */
function sobMiniEsconder(n, mutante, fim) {
  const dur = 7 + Math.min(5, n);
  sobTexto("Você se encolhe atrás do que encontra. Segure quando eles olharem.", false);
  const box = $s("sobAcoes"); box.innerHTML = `<button type="button" class="big sb-big" id="sobBig"><i class="fill"></i><span>Segure</span></button><div class="timer"><i></i></div>`;
  const b = $s("sobBig"), bar = box.querySelector(".timer i");
  ameaca = mutante ? { tipo: "esconder", estado: "anda", ate: performance.now() + 1500, passo: Math.random() * 6, escondido: false, quatro: true, cor: "#0b0d08", aro: "rgba(180,220,120,.22)", olhosRgb: "190,255,120" }
                   : { tipo: "esconder", estado: "anda", ate: performance.now() + 1500, passo: Math.random() * 6, escondido: false, zumbi: true };
  let seg = false, folego = 1, bloq = 0, ult = performance.now(); const t0 = ult;
  b.addEventListener("pointerdown", e => { e.preventDefault(); if (performance.now() > bloq) seg = true; try { b.setPointerCapture(e.pointerId); } catch (_) {} });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach(ev => b.addEventListener(ev, () => { seg = false; }));
  b.addEventListener("contextmenu", e => e.preventDefault());
  const acaba = ok => { ameaca = null; tocar(ok ? "sucesso" : "susto"); if (!ok) { susto = performance.now(); vibrar(350); } setTimeout(() => fim(ok), 400); };
  (function loop(now) {
    if (!ameaca) return;
    const dt = Math.min(.1, (now - ult) / 1000); ult = now;
    if (now > ameaca.ate) {
      if (ameaca.estado === "anda") { ameaca.estado = "aviso"; ameaca.ate = now + 700; tocar("aviso"); vibrar(60); }
      else if (ameaca.estado === "aviso") { ameaca.estado = "olha"; ameaca.ate = now + 1000 + Math.random() * 800; tocar(mutante ? "criaturaSom" : "gemido"); }
      else { ameaca.estado = "anda"; ameaca.ate = now + 1200 + Math.random() * 1600; }
    }
    if (ameaca.estado === "anda") ameaca.passo += dt;
    if (seg) folego -= dt / 3.3; else folego = Math.min(1, folego + dt / 2.2);
    if (seg && folego <= 0) { seg = false; bloq = now + 900; tocar("respira"); }
    ameaca.escondido = seg;
    if (ameaca.estado === "olha" && !seg) return acaba(false);
    b.firstChild.style.width = Math.max(0, folego) * 100 + "%";
    b.lastChild.textContent = seg ? (folego < .3 ? "Sem ar!" : "Escondido") : ameaca.estado === "aviso" ? "Esconda-se!" : now < bloq ? "Sem fôlego…" : "Segure";
    b.classList.toggle("perigo", ameaca.estado !== "anda" && !seg);
    const rest = 1 - (now - t0) / 1000 / dur; bar.style.width = Math.max(0, rest) * 100 + "%";
    if (rest <= 0) return acaba(true);
    requestAnimationFrame(loop);
  })(ult);
}
function sobMiniTocar(n, limite, fim) {
  const box = $s("sobAcoes"); box.innerHTML = `<button type="button" class="big sb-big" id="sobBig"><i class="fill"></i><span>0 / ${n}</span></button><div class="timer"><i></i></div>`;
  const b = $s("sobBig"), bar = box.querySelector(".timer i"); let c = 0, acabou = false; const t0 = performance.now();
  const acaba = ok => { if (acabou) return; acabou = true; tocar(ok ? "sucesso" : "erro"); setTimeout(() => fim(ok), 300); };
  b.addEventListener("pointerdown", e => { e.preventDefault(); if (acabou) return; c++; tocar("toque"); tremer(0, .06); b.firstChild.style.width = c / n * 100 + "%"; b.lastChild.textContent = c + " / " + n; b.classList.remove("bate"); void b.offsetWidth; b.classList.add("bate"); if (c >= n) acaba(true); });
  (function loop(now) { if (acabou) return; const rest = 1 - (now - t0) / 1000 / limite; bar.style.width = Math.max(0, rest) * 100 + "%"; if (rest <= 0) return acaba(false); requestAnimationFrame(loop); })(t0);
}

/* ---------- morte, início e entrada ---------- */
function sobFim() {
  if (!SOB) return false;
  const radMorte = M().radiacao && SOB.rad >= 100;
  if (SOB.saude > 0 && !radMorte) return false;
  const dias = SOB.dia, modo = SOB.modo, rec = Math.max(sobRecorde(modo), dias), lugar = L().nome, grupo = SOB.grupo.length;
  try { localStorage.setItem("pv_rec_" + modo, rec); localStorage.removeItem(chaveSave(modo)); } catch (e) {}
  tocar("fimRuim"); vibrar(500); fecharPainel(); ameaca = null;
  sobLigarCena({ tipo: "base", noite: true });
  $s("sobHud").innerHTML = `<div class="sb-morte"><span>${radMorte ? "Envenenamento por radiação" : "Você não resistiu"}</span><b>${dias} ${dias === 1 ? "dia" : "dias"}</b><small>Recorde: ${rec} dias · ${lugar}</small></div>`;
  sobTexto(radMorte ? "A pele queima, o cabelo cai, o corpo desiste. A Zona leva mais um." : `Sua saúde chegou a zero. ${grupo ? "O grupo te enterra e segue viagem." : "Ninguém fica sabendo."}`);
  SOB = null;
  sobBotoes([{ t: "Começar de novo", icone: "energia", cls: "destaque", on: () => sobInicio(modo) }, { t: "Voltar ao menu", icone: "porta", cls: "destaque", on: () => abrirHub() }]);
  return true;
}
function sobInicio(modo) {
  sobModo = modo; SOB = null; sobLigarCena({ tipo: "base" }); setVer([]);
  const m = MODOS[modo];
  $s("sobHud").innerHTML = `<div class="sb-titulo"><span>Modo infinito</span><b>${m.nome}</b><small>Recorde: ${sobRecorde(modo)} dias</small></div>`;
  sobTexto(m.abertura, false);
  sobBotoes(Object.entries(m.locais).map(([k, l]) => ({ t: l.nome, sub: l.desc, icone: l.ic, cls: "local", on: () => { sobNovo(modo, k); sobDia(`Você chega: ${l.base}. Por enquanto, está vivo. Abra a mochila para ver o que trouxe.`); } })));
}
function entrarSob(modo = "zumbi") {
  if (!temPremium()) { $s("premium").dataset.modo = modo; return $s("premium").hidden = false; }
  tok++; pararTudo(); calar(); S = null; NOS = null; ameaca = null;
  $s("hub").hidden = true; $s("drawer").hidden = true; $s("premium").hidden = true;
  document.body.classList.remove("no-hub", "cine"); document.body.classList.add("modo-sob");
  document.body.dataset.modo = modo;
  $s("sobModoNome").textContent = MODOS[modo].nome;
  $s("sob").hidden = false; medirPalco();
  try { initAudio(); } catch (e) {}
  corDestaque(MODOS[modo].cor);
  sobModo = modo; SOB = sobLer(modo);
  if (SOB) { sobLigarCena({ tipo: "base" }); sobDia(`Dia ${SOB.dia}. Você volta para ${L().base.toLowerCase()}. Tudo está como você deixou.`); }
  else sobInicio(modo);
}
window.sairSob = () => { if ($s("sob").hidden) return; sobGravar(); fecharPainel(); ameaca = null; $s("sob").hidden = true; document.body.classList.remove("modo-sob"); setVer([]); };
$s("btnSobMenu").addEventListener("click", () => abrirHub());
/* compra do premium pela Google Play */
const ehTeste = () => { try { return !window.Android || !Android.depuracao || Android.depuracao(); } catch (e) { return false; } };
const notaPremium = txt => { $s("premiumNota").textContent = txt; };
const NOTA_PADRAO = $s("premiumNota").textContent;
window.precoPremium = p => { $s("btnPremiumComprar").textContent = p ? `Desbloquear por ${p}` : "Desbloquear"; };
const liberarPremium = () => { $s("premium").hidden = true; tocar("sucesso"); vibrar(60); entrarSob($s("premium").dataset.modo || "zumbi"); };
window.premiumComprado = () => { if (!$s("premium").hidden) liberarPremium(); };
window.premiumErro = tipo => notaPremium(tipo === "cancelado" ? "Compra cancelada. Quando quiser, é só tocar de novo." : tipo === "pendente" ? "Pagamento pendente. Assim que a Google Play confirmar, os modos são liberados sozinhos." : "Não deu para concluir a compra agora. Confira a internet e tente de novo.");
new MutationObserver(() => { if ($s("premium").hidden) return; notaPremium(NOTA_PADRAO); $s("btnPremiumTeste").hidden = !ehTeste(); try { window.precoPremium(window.Android && Android.precoPremium ? Android.precoPremium() : ""); } catch (e) {} }).observe($s("premium"), { attributes: true, attributeFilter: ["hidden"] });
$s("btnPremiumComprar").addEventListener("click", () => {
  let ok = false; try { ok = !!(window.Android && Android.comprarPremium && Android.comprarPremium()); } catch (e) {}
  if (ok) notaPremium("Abrindo a Google Play…");
  else notaPremium(window.Android ? "A loja da Google Play ainda não respondeu. Confira a internet e tente de novo em alguns segundos." : "A compra só funciona no app instalado pela Play Store.");
});
$s("btnPremiumTeste").addEventListener("click", () => { if (!ehTeste()) return; try { localStorage.setItem("pv_premium", "1"); if (window.Android && Android.liberarTeste) Android.liberarTeste(); } catch (e) {} liberarPremium(); });
$s("btnPremiumFechar").addEventListener("click", () => { $s("premium").hidden = true; });
// salvo antigo (versão 1) do modo zumbi: descartado com segurança
try { localStorage.removeItem("pv_sob"); } catch (e) {}

// imagens dos cartões dos modos (o menu foi montado antes deste arquivo carregar)
if (typeof gerarMiniaturasModos === "function") { gerarMiniaturasModos(); if (!$s("hub").hidden) abrirHub(); }
