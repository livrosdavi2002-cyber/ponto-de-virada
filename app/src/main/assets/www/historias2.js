/* ============================================================
   FASES DE TERROR + partes novas das fases antigas
   Minijogos novos:
     acao: {tipo: "esconder", dur, folego, ok, falha}  → segure para se esconder quando o monstro olhar
     acao: {tipo: "avancar",  n, limite, ok, falha}    → toque para andar só quando ele estiver de costas
   fx.susto: true → susto na tela
   ============================================================ */

/* cinemáticas extras usadas pelas cenas antigas */
Object.assign(CINE, {
  olhoVidro: { dur: 5.5, f(t, p) {
    mar(t, false);
    const ap = cvSuave(cvSeg(t, .5, 3));
    ctx.save(); ctx.globalAlpha = ap; olho(t); ctx.restore();
    ctx.fillStyle = "#0c0a06"; ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.arc(W / 2, H * .3, Math.min(W, H) * .42, 0, 7, true); ctx.fill();
    ctx.strokeStyle = "#5c4816"; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(W / 2, H * .3, Math.min(W, H) * .42, 0, 7); ctx.stroke();
    if (p.mao) { const k = cvSuave(cvSeg(t, 2.5, 4)); ctx.fillStyle = "rgba(5,7,10,.95)"; ctx.beginPath(); ctx.ellipse(W / 2, H * .62 - k * H * .25, W * .07, H * .07, 0, 0, 7); ctx.fill(); }
  } },
  cidadeLuz: { dur: 6, f(t, p) {
    ceu(false);
    acesas = p.menos ? cvMix(.02, .55, cvSeg(t, 1, 3)) : cvMix(.02, .7, cvSeg(t, 1, 3.2));
    ctx.save(); ctx.translate(0, -H * .12); cidade(); ctx.restore();
    ctx.fillStyle = "#040507"; ctx.fillRect(W * .35, H * .3, W * .3, H * .7);
    if (!p.menos) for (let i = 0; i < 12; i++) { const x = W * .38 + (i % 4) * W * .07, y = H * .34 + Math.floor(i / 4) * H * .08; ctx.fillStyle = `rgba(242,163,58,${.6 * cvSeg(t, 2 + i * .1, 2.2 + i * .1)})`; ctx.fillRect(x, y, W * .04, H * .04); if (p.janelas && t > 3.5) pessoa(x + W * .02, y + H * .04, H * .035, { cor: "#000", aro: "rgba(0,0,0,0)" }); }
    pessoa(W * .5, H * .3, H * .1, {});
  } },
  superficie: { dur: 6, f(t, p) {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#3a4a62"); g.addColorStop(.4, "#a88a7a"); g.addColorStop(.42, "#1d3a48"); g.addColorStop(1, "#04121a");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    luzCor(W * .7, H * .38, H * .3, .4, "255,210,160");
    for (let i = 0; i < 10; i++) { ctx.fillStyle = "rgba(255,230,200,.12)"; ctx.fillRect(((i * 97 + t * 20) % W), H * .43 + i * 8, 40, 2); }
    const s = cvSuave(cvSeg(t, .5, 4.5));
    ctx.fillStyle = "#0d1a20"; ctx.fillRect(W * .25, H * .42 + (1 - s) * H * .3, W * .5, H * .12);
    for (let i = 0; i < 6; i++) { ctx.fillStyle = "rgba(240,180,90,.75)"; ctx.beginPath(); ctx.arc(W * (.3 + i * .08), H * .47 + (1 - s) * H * .3, 5, 0, 7); ctx.fill(); }
    if (p.criatura !== false) { ctx.fillStyle = "rgba(0,4,7,.7)"; ctx.beginPath(); ctx.ellipse(W * .5, H * .62 + (1 - s) * H * .2, W * .6, H * .05, 0, 0, 7); ctx.fill(); for (let i = 0; i < 10; i++) luzCor(W * (.1 + i * .09), H * .63 + (1 - s) * H * .2, 8, .6, "79,220,230"); }
  } },
});

/* ==================== FASE: ALA 4 ==================== */
const ALA4 = {
  inicio: {
    hora: "03:00", lugar: "Hospital São Lázaro · quarto 44", cine: ["quartoHosp", {}],
    texto: "Você acorda numa maca, com a garganta seca. Na pulseira: <span class='msg'>PACIENTE 44 · ALA 4</span>. O hospital está abandonado há trinta anos. No corredor, um carrinho range. E alguém cantarola, baixinho.",
    escolhas: [op("Se esconder debaixo da cama", "debaixo"), op("Espiar pela janelinha da porta", "espiar"), op("Procurar algo útil no quarto", "quarto")],
    fx: { ver: [], sons: ["carrinho", "cantarola"], amb: { drone: .8, zumbido: .3 } },
  },
  quarto: {
    hora: "03:02", lugar: "Quarto 44", ganha: "Prontuário 44", cine: ["quartoHosp", { vazia: true }],
    texto: "Na gaveta, um prontuário com o seu nome. Data de internação: <em>1994</em>. Diagnóstico riscado. Embaixo, à mão: <span class='msg'>não deixe ela te ouvir respirar.</span>",
    escolhas: [op("Espiar pela janelinha", "espiar"), op("Se esconder debaixo da cama", "debaixo")],
    fx: { ver: [], sons: ["papel", "cantarola"], amb: { drone: .8 } },
  },
  espiar: {
    hora: "03:03", lugar: "Porta do quarto 44", cine: ["corredorHosp", { m: "passa" }],
    texto: "Uma figura alta, de touca branca, empurra um carrinho de remédios. O pescoço dobrado para o lado, mais do que deveria. Ela para bem na frente da sua porta.",
    tempo: 6, aoAcabar: "visto",
    escolhas: [op("Se jogar debaixo da cama", "debaixo"), op("Ficar parado, olhando", "visto")],
    fx: { ver: [], sons: ["carrinho", "coracao"], amb: { drone: 1 } },
  },
  visto: {
    hora: "03:04", lugar: "Porta do quarto 44", cine: ["corredorHosp", { m: "olha" }],
    texto: "Ela vira o rosto até o vidro. Não tem olhos. Só uma luz amarelada onde os olhos deveriam estar. A maçaneta começa a girar.",
    acao: { tipo: "tocar", rotulo: "Segure a porta! Toque rápido!", n: 16, limite: 5, ok: "debaixo", falha: "f_pega" },
    fx: { ver: ["vermelho"], sons: ["coracao"], amb: { drone: 1 }, susto: true },
  },
  debaixo: {
    hora: "03:05", lugar: "Debaixo da cama", cine: ["debaixoCama", {}],
    texto: "Pelo vão, você vê os pés dela entrando no quarto. Descalços, compridos, cinzentos. Ela respira fundo, devagar, como quem sente um cheiro.",
    acao: { tipo: "esconder", rotulo: "Segure para prender a respiração quando ela procurar", dur: 9, folego: 3.4, touca: true, pes: true, ok: "saiu", falha: "f_pega" },
    fx: { ver: [], sons: ["respira"], amb: { drone: 1 } },
  },
  saiu: {
    hora: "03:07", lugar: "Quarto 44", ganha: "Crachá da Marta", cine: ["debaixoCama", { sai: true }],
    texto: "Ela sai cantarolando. No chão, onde ela pisou, ficou um crachá molhado: <span class='msg'>ENF. MARTA · MATRÍCULA 0417 · ALA 4</span>.",
    escolhas: [op("Sair para o corredor", "corredor")],
    fx: { ver: [], sons: ["item", "cantarola"], amb: { drone: .8 } },
  },
  corredor: {
    hora: "03:09", lugar: "Corredor da Ala 4", cine: ["corredorHosp", { eu: true }],
    texto: "Trinta metros de corredor. Lâmpadas piscando. Placas: <span class='msg'>← NECROTÉRIO · ELEVADOR →</span>. No fim, a escada, com uma faixa de interdição. O cantarolar vem de algum lugar à esquerda.",
    escolhas: [op("Ir ao elevador", "corredor2"), op("Ir ao necrotério", "necroterio"), op("Entrar na sala das enfermeiras", "posto_enf"), op("Tentar a escada interditada", "escada_h")],
    fx: { ver: [], sons: ["carrinho"], amb: { drone: .8, zumbido: .4 } },
  },
  posto_enf: {
    hora: "03:11", lugar: "Sala das enfermeiras", cine: ["salaEnf", {}],
    texto: "Fichas espalhadas na mesa. Um rádio velho toca a mesma música que ela cantarola. No quadro: <span class='msg'>PLANTÃO · NOV 1994 · ENF. MARTA</span>.",
    escolhas: [op("Ler as fichas", "fichas"), op("Desligar o rádio", "radio_h"), op("Voltar ao corredor", "corredor2")],
    fx: { ver: [], sons: ["cantarola"], amb: { drone: .7 } },
  },
  fichas: {
    hora: "03:12", lugar: "Sala das enfermeiras", ganha: "Ficha da Marta",
    texto: "Marta anotou, noite após noite: pacientes da Ala 4 sumindo. A última ficha é de 13/11/1994: <span class='msg'>Paciente 44. Eu vou tirar você daqui antes do fogo. Matrícula 0417 abre o elevador de serviço.</span>",
    escolhas: [op("Voltar ao corredor", "corredor2"), op("Desligar o rádio antes de sair", "radio_h")],
    fx: { ver: [], sons: ["papel"], amb: { drone: .7 } },
  },
  radio_h: {
    hora: "03:13", lugar: "Sala das enfermeiras", cine: ["salaEnf", { radioOff: true }],
    texto: "Você desliga. Silêncio total. Lá longe, o carrinho para. Ela ouviu a música parar. Passos rápidos vêm pelo corredor. Você se joga embaixo da mesa.",
    acao: { tipo: "esconder", rotulo: "Segure para ficar imóvel quando ela olhar", dur: 10, folego: 3.2, touca: true, ok: "corredor2", falha: "f_pega" },
    fx: { ver: [], sons: ["carrinho", "coracao"], amb: { drone: 1 } },
  },
  corredor2: {
    hora: "03:15", lugar: "Corredor da Ala 4", cine: ["corredorHosp", { m: "costas" }],
    texto: "Ela está no fim do corredor, de costas, parada entre você e o elevador. A cabeça balança de um lado para o outro, escutando. Você precisa passar.",
    acao: { tipo: "avancar", rotulo: "Toque para avançar. Pare quando ela virar!", n: 12, limite: 30, touca: true, ok: "elevador", falha: "f_pega" },
    fx: { ver: [], sons: ["cantarola"], amb: { drone: 1 } },
  },
  elevador: {
    hora: "03:17", lugar: "Elevador de serviço", cine: ["elevador", {}],
    texto: "O elevador está morto. No painel: <span class='msg'>FUSÍVEL AUSENTE</span>. Ao lado, um teclado pede uma matrícula de funcionário.",
    escolhas: [op("Encaixar um fusível", "elevador_on", { req: "Fusível" }), op("Procurar um fusível no necrotério", "necroterio"), op("Tentar a escada interditada", "escada_h")],
    fx: { ver: [], amb: { drone: .8, zumbido: .2 } },
  },
  necroterio: {
    hora: "03:20", lugar: "Necrotério", cine: ["necroterio", {}],
    texto: "Gavetas de metal do chão ao teto. Uma delas está aberta. Dentro, um corpo coberto com um lençol, a pulseira pendurada para fora: <span class='msg'>PACIENTE 44</span>.",
    tempo: 8, aoAcabar: "lencol",
    escolhas: [op("Levantar o lençol", "lencol"), op("Pegar a caixa de fusíveis da parede", "fusivel")],
    fx: { ver: [], sons: ["coracao"], amb: { drone: 1 } },
  },
  lencol: {
    hora: "03:21", lugar: "Necrotério", cine: ["necroterio", { aberta: true }],
    texto: "É você. Mais magro, mais velho, de olhos fechados. Quando você recua, a mão gelada do corpo segura o seu pulso.",
    escolhas: [op("Puxar o braço com força", "fusivel"), op("Ficar parado", "f_gaveta")],
    fx: { ver: ["vermelho"], sons: ["coracao"], amb: { drone: 1 }, susto: true },
  },
  fusivel: {
    hora: "03:22", lugar: "Necrotério", ganha: "Fusível",
    texto: "A caixa está enferrujada, mas um fusível ainda está bom. Atrás de você, uma por uma, as gavetas começam a deslizar sozinhas.",
    escolhas: [op("Correr de volta ao elevador", "corredor3")],
    fx: { ver: ["vermelho"], sons: ["item", "rangido"], amb: { drone: 1 } },
  },
  corredor3: {
    hora: "03:24", lugar: "Corredor da Ala 4", cine: ["corredorHosp", { m: "vem" }],
    texto: "O carrinho vem na sua direção. Rápido. Ela não cantarola mais. Não dá para chegar ao elevador antes dela.",
    tempo: 6, aoAcabar: "f_pega",
    escolhas: [op("Entrar no armário de limpeza", "armario"), op("Deitar numa maca e fingir de morto", "maca")],
    fx: { ver: [], sons: ["carrinho", "coracao"], amb: { drone: 1 } },
  },
  armario: {
    hora: "03:25", lugar: "Armário de limpeza", cine: ["armario", {}],
    texto: "Pelas frestas do armário, você vê ela entrar na sala. Ela não procura com os olhos. Procura com o ouvido.",
    acao: { tipo: "esconder", rotulo: "Segure para não respirar quando ela parar", dur: 11, folego: 3.2, touca: true, ok: "elevador", falha: "f_pega" },
    fx: { ver: [], sons: ["respira"], amb: { drone: 1 } },
  },
  maca: {
    hora: "03:25", lugar: "Corredor · maca",
    texto: "Você deita e cobre o rosto. Ela para do seu lado. Ajeita o lençol com cuidado. \"Paciente 44, hora do remédio.\"",
    acao: { tipo: "segurar", rotulo: "Segure para não se mexer", dur: 5, limite: 10, ok: "elevador", falha: "f_remedio" },
    fx: { ver: [], sons: ["cantarola", "coracao"], amb: { drone: 1 } },
  },
  elevador_on: {
    hora: "03:28", lugar: "Elevador de serviço", cine: ["elevador", { luz: true }],
    texto: "O fusível encaixa. O elevador acorda com um tranco. O teclado pisca, esperando a matrícula.",
    acao: { tipo: "codigo", rotulo: "Digite a matrícula", resposta: "0417", tentativas: 2, ok: "subida", falha: "f_pega" },
    fx: { ver: [], sons: ["religar"], amb: { drone: .8, zumbido: .6 } },
  },
  subida: {
    hora: "03:29", lugar: "Dentro do elevador", cine: ["elevador", { sobe: true }],
    texto: "As portas começam a fechar. No último instante, dedos compridos entram pelo vão e começam a abrir de novo.",
    acao: { tipo: "tocar", rotulo: "Aperte o botão! Toque rápido!", n: 15, limite: 5, ok: "saida", falha: "f_pega" },
    fx: { ver: ["vermelho"], sons: ["coracao"], amb: { drone: 1 }, susto: true },
  },
  saida: {
    hora: "03:31", lugar: "Recepção", cine: ["elevador", { abre: true }],
    texto: "As portas abrem no térreo. Recepção vazia, porta da rua aberta, chuva lá fora. No balcão, um telefone antigo toca.",
    escolhas: [op("Sair para a rua", "f_rua"), op("Atender o telefone", "telefone_h"), op("Lembrar quem você era em 1994", "lembranca_h", { minFinais: 5 })],
    fx: { ver: ["chuva"], sons: ["campainha"], amb: { drone: .5, chuva: .6 } },
  },
  telefone_h: {
    hora: "03:32", lugar: "Recepção",
    texto: "\"Ala 4, boa noite.\" É a voz da Marta. Calma. Humana. \"Você saiu? Saiu mesmo? Então eu posso parar de procurar.\"",
    escolhas: [op("Dizer: \"Saí. Pode ir embora.\"", "f_plantao_h"), op("Perguntar por que ela te procura", "porque")],
    fx: { ver: ["chuva"], amb: { drone: .4, chuva: .6 } },
  },
  porque: {
    hora: "03:33", lugar: "Recepção",
    texto: "\"Porque no incêndio eu voltei pra buscar você, e a porta da Ala 4 estava trancada. Alguém trancou por fora.\" A linha chia. \"Você sabe quem foi.\"",
    escolhas: [op("Desligar e sair correndo", "f_rua"), op("Dizer que foi você", "f_ala4", { minFinais: 5 }), op("Dizer: \"Saí. Pode ir embora.\"", "f_plantao_h")],
    fx: { ver: ["chuva", "vermelho"], sons: ["coracao"], amb: { drone: .8, chuva: .6 } },
  },
  escada_h: {
    hora: "03:18", lugar: "Escada interditada", cine: ["predio", { de: 4, ate: 4, andares: 6 }],
    texto: "Os degraus somem no escuro. Lá em cima, alguém cantarola. Lá embaixo, o carrinho range. Os dois sons estão se aproximando.",
    escolhas: [op("Subir", "telhado"), op("Descer para o porão", "porao_h")],
    fx: { ver: ["escuro"], sons: ["cantarola", "carrinho"], amb: { drone: 1 } },
  },
  telhado: {
    hora: "03:20", lugar: "Telhado do hospital", cine: ["terraco", { lanterna: false }],
    texto: "O telhado. Chuva forte. Uma escada de incêndio enferrujada desce pela fachada. Atrás de você, a porta do telhado se abre devagar.",
    acao: { tipo: "tocar", rotulo: "Toque rápido para descer a escada!", n: 18, limite: 6, ok: "f_fachada", falha: "f_queda_h" },
    fx: { ver: ["chuva"], sons: ["rangido", "coracao"], amb: { drone: .8, chuva: 1, vento: 1 } },
  },
  porao_h: {
    hora: "03:21", lugar: "Porão alagado", cine: ["porao", { atras: true }],
    texto: "A água fria bate no tornozelo. Escuridão total. Algo grande se move na água atrás de você, de quatro, farejando.",
    acao: { tipo: "esconder", rotulo: "Segure para ficar imóvel na água", dur: 9, folego: 3, quatro: true, ok: "tunel", falha: "f_pega" },
    fx: { ver: [], sons: ["respira", "coracao"], amb: { drone: 1, agua: .5 } },
  },
  tunel: {
    hora: "03:26", lugar: "Túnel de serviço",
    texto: "Atrás das caldeiras, um túnel de serviço. Lá no fim, uma grade com luz da rua. E, no meio do caminho, de costas, a coisa de quatro, mastigando algo.",
    acao: { tipo: "avancar", rotulo: "Passe por ela sem ser visto", n: 11, limite: 30, quatro: true, ok: "f_tunel", falha: "f_pega" },
    fx: { ver: ["escuro"], sons: ["coracao"], amb: { drone: 1, agua: .3 } },
  },
  lembranca_h: {
    hora: "03:31", lugar: "Recepção",
    texto: "Você lembra. Você não era paciente. Era o enfermeiro do turno com a Marta, em 1994. Na noite do incêndio, com medo, você trancou a Ala 4 por fora e fugiu. A pulseira 44 era a sua punição.",
    escolhas: [op("Voltar e abrir a Ala 4", "f_ala4")],
    fx: { ver: ["vermelho"], sons: ["fimEstranho"], amb: { drone: .6 } },
  },
  f_pega: { fim: true, tipo: "ruim", titulo: "Encontrado", hora: "03:??", lugar: "Ala 4", cine: ["corredorHosp", { m: "olha" }],
    texto: "Os dedos compridos fecham no seu tornozelo. Ela volta a cantarolar, satisfeita. Amanhã, a Ala 4 terá um paciente a mais. E ninguém vai ouvir você respirar.",
    fx: { ver: ["vermelho"], sons: ["fimRuim"], amb: { drone: 1 } } },
  f_gaveta: { fim: true, tipo: "ruim", titulo: "Gaveta 44", hora: "03:22", lugar: "Necrotério", cine: ["necroterio", { aberta: true }],
    texto: "A mão puxa você para perto. O lençol cobre os dois. A gaveta fecha devagar, com um clique. Na etiqueta, agora: PACIENTES 44.",
    fx: { ver: ["vermelho"], sons: ["fimRuim"], amb: { drone: 1 } } },
  f_remedio: { fim: true, tipo: "ruim", titulo: "Hora do Remédio", hora: "03:26", lugar: "Corredor · maca",
    texto: "Você se mexe. Ela sorri sem boca. \"Agitado de novo.\" A agulha é fria. Quando você acorda, está numa maca, com a garganta seca, e alguém cantarola no corredor.",
    fx: { ver: ["vermelho"], sons: ["fimRuim"], amb: { drone: 1 } } },
  f_rua: { fim: true, tipo: "estranho", titulo: "Alta", hora: "03:33", lugar: "Rua", cine: ["casaFora", { janelas: true }],
    texto: "Você sai na chuva e corre até a esquina. Olha para trás: em todas as janelas da Ala 4, pacientes acenam. Na sua pulseira, a palavra mudou. Agora diz: ALTA.",
    fx: { ver: ["chuva"], sons: ["fimEstranho"], amb: { drone: .6, chuva: 1 } } },
  f_plantao_h: { fim: true, tipo: "bom", titulo: "Fim do Plantão", hora: "03:34", lugar: "Recepção",
    texto: "\"Obrigada.\" A linha fica muda. Pelo vidro, uma enfermeira de touca branca, agora com rosto, atravessa a rua e some na chuva. O cantarolar para. Para sempre.",
    fx: { ver: ["chuva"], sons: ["fimBom"], amb: { drone: .3, chuva: .5 } } },
  f_fachada: { fim: true, tipo: "bom", titulo: "Pela Fachada", hora: "03:23", lugar: "Rua",
    texto: "Seus pés tocam a calçada. Lá em cima, no telhado, uma figura de touca te observa, a cabeça inclinada. Ela não desce. Ela nunca sai da Ala 4.",
    fx: { ver: ["chuva"], sons: ["fimBom"], amb: { drone: .4, chuva: 1 } } },
  f_queda_h: { fim: true, tipo: "ruim", titulo: "Chuva", hora: "03:21", lugar: "Fachada",
    texto: "O degrau enferrujado cede. A queda parece longa demais. Você acorda na maca do quarto 44. Na pulseira, um risco novo, ao lado de muitos outros.",
    fx: { ver: ["chuva", "vermelho"], sons: ["fimRuim"], amb: { drone: 1, chuva: 1 } } },
  f_tunel: { fim: true, tipo: "bom", titulo: "Túnel de Serviço", hora: "03:30", lugar: "Rua dos fundos", cine: ["casaFora", { sai: true }],
    texto: "A grade cede e você sai numa rua de terra atrás do hospital. Ninguém te seguiu. No bolso, sem saber como, o prontuário: o diagnóstico agora está legível. \"Curado.\"",
    fx: { ver: ["chuva"], sons: ["fimBom"], amb: { drone: .3, chuva: .6 } } },
  f_ala4: { fim: true, tipo: "secreto", titulo: "Ala 4", hora: "03:44", lugar: "Porta da Ala 4", cine: ["corredorHosp", { m: "passa", carrinho: false }],
    texto: "Você volta e destranca a porta que trancou trinta anos atrás. Lá dentro, os pacientes se levantam das macas, um a um, e passam por você. A última é a Marta. Ela tira a touca, sorri e diz: \"Agora sim, acabou o plantão.\"",
    fx: { ver: [], sons: ["fimBom"], amb: { drone: .3 } } },
};

/* ==================== FASE: O INQUILINO ==================== */
const INQUILINO = {
  inicio: {
    hora: "00:12", lugar: "Rua das Acácias, 19 · quarto", cine: ["quartoCasa", {}],
    texto: "A casa era barata demais. O contrato tinha regras estranhas, e você assinou sem ler direito. Agora, à meia-noite, algo arranha por dentro da parede. Devagar. Andando de um lado para o outro.",
    escolhas: [op("Ler o contrato de novo", "contrato"), op("Bater na parede", "bater"), op("Ir até a cozinha", "cozinha")],
    fx: { ver: [], sons: ["arranhar"], amb: { drone: .8 } },
  },
  contrato: {
    hora: "00:14", lugar: "Quarto", ganha: "Contrato",
    texto: "<span class='msg'>3. Se ouvir alguém chamar seu nome, não responda. 4. Se a porta do porão abrir sozinha, se esconda até ela fechar. 5. O cofre abre com a data em que você chegou.</span> Você chegou hoje: 13 de novembro.",
    escolhas: [op("Bater na parede", "bater"), op("Ir até a cozinha", "cozinha")],
    fx: { ver: [], sons: ["papel", "arranhar"], amb: { drone: .8 } },
  },
  bater: {
    hora: "00:15", lugar: "Quarto", cine: ["quartoCasa", { rosto: true }],
    texto: "Você bate três vezes. Do outro lado, três batidas respondem. Depois uma quarta. Não na parede. No vidro da janela, atrás de você.",
    escolhas: [op("Fugir do quarto", "corredor"), op("Se esconder no guarda-roupa", "guarda")],
    fx: { ver: [], sons: ["batidas", "coracao"], amb: { drone: 1 }, susto: true },
  },
  cozinha: {
    hora: "00:18", lugar: "Cozinha", cine: ["cozinha", {}],
    texto: "A porta do porão está aberta. Você não abriu. Degraus descem no escuro. E algo está subindo. Um degrau por vez. Sem pressa.",
    tempo: 7, aoAcabar: "visto",
    escolhas: [op("Se esconder embaixo da mesa", "mesa"), op("Fechar a porta do porão", "fechar")],
    fx: { ver: [], sons: ["passos", "coracao"], amb: { drone: 1 } },
  },
  fechar: {
    hora: "00:19", lugar: "Porta do porão",
    texto: "Você empurra a porta. Do outro lado, algo empurra de volta. Forte. Os dedos aparecem pela fresta.",
    acao: { tipo: "segurar", rotulo: "Segure a porta fechada!", dur: 5, limite: 9, ok: "trancou", falha: "visto" },
    fx: { ver: ["vermelho"], sons: ["coracao"], amb: { drone: 1 } },
  },
  trancou: {
    hora: "00:20", lugar: "Cozinha",
    texto: "A porta fecha. Algo do outro lado arranha a madeira e para. Então você vê: a chave está na fechadura. Do lado de dentro do porão.",
    escolhas: [op("Voltar para o quarto", "corredor"), op("Olhar pelo buraco da fechadura", "fechadura")],
    fx: { ver: [], sons: ["arranhar"], amb: { drone: .9 } },
  },
  fechadura: {
    hora: "00:21", lugar: "Porta do porão",
    texto: "Pelo buraco, um olho olha de volta. Muito perto. Ele pisca. Depois, uma voz de criança: \"Desce. Tá escuro aqui.\"",
    escolhas: [op("Recuar devagar", "corredor"), op("Responder", "f_responde")],
    fx: { ver: ["vermelho"], sons: ["sussurro"], amb: { drone: 1 }, susto: true },
  },
  mesa: {
    hora: "00:19", lugar: "Debaixo da mesa", cine: ["debaixoCama", { casa: true }],
    texto: "Por baixo da toalha, você vê aquilo atravessar a cozinha. Anda de quatro, com braços compridos demais, cheirando o chão.",
    acao: { tipo: "esconder", rotulo: "Segure para não respirar quando ele parar", dur: 10, folego: 3.2, pes: true, ok: "cozinha2", falha: "f_pego" },
    fx: { ver: [], sons: ["respira"], amb: { drone: 1 } },
  },
  visto: {
    hora: "00:19", lugar: "Cozinha", cine: ["cozinha", {}],
    texto: "A cabeça aparece no último degrau e vira de lado, inteira, como coruja. Ele te vê.",
    acao: { tipo: "tocar", rotulo: "Corra! Toque rápido!", n: 16, limite: 5, ok: "corredor", falha: "f_pego" },
    fx: { ver: ["vermelho"], sons: ["coracao"], amb: { drone: 1 }, susto: true },
  },
  cozinha2: {
    hora: "00:24", lugar: "Cozinha", ganha: "Foto de 1962",
    texto: "Ele sai pela porta dos fundos, para o quintal. Na mesa, ficou uma foto antiga: esta casa em 1962 e uma família de cinco. Quatro rostos foram riscados. O quinto, uma criança, não.",
    escolhas: [op("Descer ao porão enquanto ele está fora", "porao"), op("Ir para o quarto", "corredor")],
    fx: { ver: [], sons: ["item"], amb: { drone: .8 } },
  },
  corredor: {
    hora: "00:26", lugar: "Corredor", cine: ["corredorCasa", { m: "costas" }],
    texto: "O corredor até o quarto tem quatro portas. Na do meio, alguém está parado de costas, com a cabeça encostada na madeira. Ouvindo.",
    acao: { tipo: "avancar", rotulo: "Passe por ele sem ser visto", n: 12, limite: 30, ok: "quarto", falha: "f_pego" },
    fx: { ver: [], sons: ["coracao"], amb: { drone: 1 } },
  },
  guarda: {
    hora: "00:16", lugar: "Guarda-roupa", cine: ["armario", { casa: true }],
    texto: "Pelas frestas, você vê aquilo entrar no quarto, alto, encurvado. Ele senta na sua cama. E espera.",
    acao: { tipo: "esconder", rotulo: "Segure para ficar quieto quando ele olhar", dur: 11, folego: 3.2, ok: "quarto", falha: "f_pego" },
    fx: { ver: [], sons: ["respira"], amb: { drone: 1 } },
  },
  quarto: {
    hora: "00:31", lugar: "Quarto", cine: ["quartoCasa", {}],
    texto: "No quarto, atrás do quadro torto, um cofre antigo embutido na parede. O arranhar recomeçou. Agora no teto.",
    escolhas: [op("Abrir o cofre", "cofre"), op("Ligar para o dono da casa", "dono"), op("Ir até a janela", "voz")],
    fx: { ver: [], sons: ["arranhar"], amb: { drone: .9 } },
  },
  voz: {
    hora: "00:33", lugar: "Janela do quarto", cine: ["quartoCasa", { rosto: true }],
    texto: "Lá fora, a voz da sua mãe: \"Filho, abre, tá frio aqui fora.\" A sua mãe mora a 600 km daqui.",
    tempo: 7, aoAcabar: "f_responde",
    escolhas: [op("Responder", "f_responde"), op("Tapar a boca e se afastar", "cofre")],
    fx: { ver: [], sons: ["sussurro", "coracao"], amb: { drone: 1 } },
  },
  dono: {
    hora: "00:34", lugar: "Quarto",
    texto: "O dono atende rindo. \"Ah, ele apareceu? Segue o contrato que dá tudo certo. Ninguém nunca durou até as seis da manhã. Mas vai que você dura.\"",
    escolhas: [op("Abrir o cofre", "cofre"), op("Esperar as seis da manhã", "espera")],
    fx: { ver: [], sons: ["vibrarJa"], amb: { drone: .8 } },
  },
  cofre: {
    hora: "00:36", lugar: "Cofre",
    texto: "O cofre tem quatro dígitos. Em cima dele, alguém gravou com a unha: <span class='msg'>dia e mês</span>.",
    acao: { tipo: "codigo", rotulo: "Digite o código do cofre", resposta: "1311", tentativas: 2, ok: "cofre_ok", falha: "corredor_teto" },
    fx: { ver: [], sons: ["arranhar"], amb: { drone: .9 } },
  },
  corredor_teto: {
    hora: "00:38", lugar: "Corredor", cine: ["corredorCasa", { m: "teto", eu: false }],
    texto: "O cofre apita alto. O arranhar para. No corredor, ele vem pelo teto, de quatro, de cabeça para baixo, direto para o quarto.",
    acao: { tipo: "esconder", rotulo: "Segure para ficar parado no escuro", dur: 9, folego: 3, quatro: true, ok: "cofre", falha: "f_pego" },
    fx: { ver: [], sons: ["coracao"], amb: { drone: 1 }, susto: true },
  },
  cofre_ok: {
    hora: "00:40", lugar: "Cofre", ganha: "Chave do porão",
    texto: "Dentro, uma chave e um bilhete do primeiro dono: <span class='msg'>Ele é o caçula. Ficou trancado no porão em 1962, de castigo, e a gente se mudou sem ele. Só quer que alguém desça e acenda a luz.</span>",
    escolhas: [op("Descer ao porão", "porao"), op("Esperar as seis da manhã", "espera")],
    fx: { ver: [], sons: ["item"], amb: { drone: .7 } },
  },
  porao: {
    hora: "00:45", lugar: "Porão", cine: ["porao", { atras: true }],
    texto: "O porão cheira a terra. Uma lâmpada pendurada, apagada. No canto, um colchão velho e brinquedos de 1962. Atrás de você, na escada, um degrau range.",
    escolhas: [op("Se esconder atrás da caldeira", "caldeira"), op("Colocar a foto ao lado do colchão", "f_familia", { req: "Foto de 1962" }), op("Acender a lâmpada", "lampada")],
    fx: { ver: [], sons: ["rangido", "coracao"], amb: { drone: 1 } },
  },
  caldeira: {
    hora: "00:46", lugar: "Atrás da caldeira",
    texto: "Ele desce. Rodeia o colchão, cheirando os brinquedos, chorando baixinho como uma criança. Depois, começa a procurar.",
    acao: { tipo: "esconder", rotulo: "Segure para ficar escondido", dur: 10, folego: 3, ok: "lampada", falha: "f_pego" },
    fx: { ver: [], sons: ["sussurro"], amb: { drone: 1 } },
  },
  lampada: {
    hora: "00:50", lugar: "Porão",
    texto: "A lâmpada está frouxa no bocal. Você estica o braço no escuro. Algo respira ao seu lado, esperando o que você vai fazer.",
    escolhas: [op("Rosquear a lâmpada", "f_luz_c"), op("Lembrar da foto de 1962", "lembranca_c", { minFinais: 4 })],
    fx: { ver: ["escuro"], sons: ["respira"], amb: { drone: 1 } },
  },
  espera: {
    hora: "05:58", lugar: "Quarto", cine: ["quartoCasa", {}],
    texto: "03:40. 04:50. O arranhar circula o quarto a noite inteira. Às 05:58, a porta do quarto abre sozinha, bem devagar.",
    acao: { tipo: "esconder", rotulo: "Segure para ficar imóvel embaixo do cobertor", dur: 11, folego: 3.4, ok: "f_seis", falha: "f_pego" },
    fx: { ver: [], sons: ["rangido", "coracao"], amb: { drone: 1 } },
  },
  lembranca_c: {
    hora: "00:51", lugar: "Porão",
    texto: "Você lembra de cada noite nesta casa. E entende o que sempre esteve na foto: o quinto rosto, o que não foi riscado. É o seu rosto, criança. Você nunca alugou esta casa. Você voltou para ela.",
    escolhas: [op("Acender a luz e chamar seu irmão pelo nome", "f_irmao")],
    fx: { ver: [], sons: ["fimEstranho"], amb: { drone: .6 } },
  },
  f_pego: { fim: true, tipo: "ruim", titulo: "O Inquilino", hora: "00:??", lugar: "Rua das Acácias, 19", cine: ["casaFora", {}],
    texto: "Dedos compridos te puxam para dentro da parede. Está quente lá dentro, e apertado. Na semana seguinte, um novo inquilino assina o contrato. À meia-noite, você começa a arranhar.",
    fx: { ver: ["vermelho"], sons: ["fimRuim"], amb: { drone: 1 } } },
  f_responde: { fim: true, tipo: "ruim", titulo: "Voz de Mãe", hora: "00:34", lugar: "Rua das Acácias, 19", cine: ["casaFora", { janelas: true }],
    texto: "Você responde. Lá fora, a voz ri, mas não é a sua mãe que ri. A porta da frente se abre sozinha. Regra 3. Você leu. Você só não acreditou.",
    fx: { ver: ["vermelho"], sons: ["fimRuim"], amb: { drone: 1 } } },
  f_familia: { fim: true, tipo: "bom", titulo: "Retrato de Família", hora: "00:47", lugar: "Porão", cine: ["porao", { luz: true }],
    texto: "Você deixa a foto no colchão. O choro para. Uma mão pequena, de criança, pega a foto com cuidado. Quando você olha de novo, o porão está vazio, e a foto tem cinco rostos sorrindo.",
    fx: { ver: [], sons: ["fimBom"], amb: { drone: .3 } } },
  f_luz_c: { fim: true, tipo: "bom", titulo: "Luz no Porão", hora: "00:51", lugar: "Porão", cine: ["porao", { luz: true }],
    texto: "A luz acende. Ao seu lado, um menino magro, de pijama antigo, aperta os olhos. \"Demoraram\", ele diz. E some, como poeira na luz. A casa, enfim, fica em silêncio.",
    fx: { ver: [], sons: ["fimBom"], amb: { drone: .3 } } },
  f_seis: { fim: true, tipo: "estranho", titulo: "Seis da Manhã", hora: "06:00", lugar: "Rua das Acácias, 19", cine: ["casaFora", { manha: true }],
    texto: "O sol entra pela janela. Você sobreviveu. Na mesa da cozinha, o contrato renovado, assinado com a sua letra, por mais um ano. Você não lembra de ter assinado.",
    fx: { ver: [], sons: ["fimEstranho"], amb: { drone: .3 } } },
  f_irmao: { fim: true, tipo: "secreto", titulo: "O Quinto Rosto", hora: "00:52", lugar: "Porão", cine: ["porao", { luz: true }],
    texto: "\"Tito.\" A luz acende. O monstro encolhe até virar um menino de sete anos. \"Você voltou\", ele diz. \"Vocês prometeram que voltavam.\" Desta vez, quando você sobe a escada, ele sobe junto.",
    fx: { ver: [], sons: ["fimBom"], amb: { drone: .3 } } },
};

/* ==================== partes novas das fases antigas ==================== */
// APAGÃO: a coisa que conta as luzes
Object.assign(APAGAO, {
  andar7: {
    hora: "22:59", lugar: "7º andar", cine: ["corredorHosp", { m: "passa", carrinho: false }],
    texto: "No 7º andar, uma figura alta anda pelo corredor contando as portas em voz baixa. <span class='msg'>Um. Dois. Três.</span> Ela está chegando na porta onde você se encostou.",
    acao: { tipo: "esconder", rotulo: "Segure para não respirar quando ela parar", dur: 9, folego: 3.4, ok: "andar7b", falha: "f_contado" },
    fx: { ver: [], sons: ["passos", "coracao"], amb: { drone: 1 } },
  },
  andar7b: {
    hora: "23:01", lugar: "7º andar", cine: ["predio", { de: 7, ate: 7, andares: 14, outro: { de: 7, ate: 12, ini: .2, mov: 4.5 } }],
    texto: "Ela passa contando. \"Doze apartamentos. Doze luzes. Falta uma.\" E sobe a escada, devagar. Para o 12º. Para o seu andar.",
    escolhas: [op("Subir atrás dela", "perseguir"), op("Descer até o 3º andar", "andar3")],
    fx: { ver: [], sons: ["passos"], amb: { drone: 1 } },
  },
  perseguir: {
    hora: "23:06", lugar: "12º andar", cine: ["corredorHosp", { m: "costas", carrinho: false }],
    texto: "Ela para na frente do 1207. A sua porta. E encosta o rosto no olho mágico, por fora, como quem espera alguém olhar de dentro.",
    acao: { tipo: "avancar", rotulo: "Chegue perto sem ela virar", n: 11, limite: 30, ok: "perto", falha: "f_contado" },
    fx: { ver: [], sons: ["coracao"], amb: { drone: 1 } },
  },
  perto: {
    hora: "23:07", lugar: "Porta do 1207",
    texto: "De perto você vê: a figura tem a sua altura, a sua roupa, o seu celular na mão. Ela digita devagar: <span class='msg'>NÃO ABRA A PORTA.</span> O polegar está sobre o botão de enviar.",
    escolhas: [op("Arrancar o celular da mão dela", "f_remetente"), op("Voltar em silêncio para a escada", "sobe_terraco")],
    fx: { ver: ["vermelho"], sons: ["coracao"], amb: { drone: 1 } },
  },
  esconde_celia: {
    hora: "23:03", lugar: "Apto 1207 · atrás do sofá", cine: ["feixe", {}],
    texto: "Vocês se encolhem atrás do sofá. O feixe entra pela janela e varre a sala, devagar, procurando. Dona Célia segura sua mão com força.",
    acao: { tipo: "esconder", rotulo: "Segure para ficar fora da luz", dur: 9, folego: 3.4, ok: "f_escondido", falha: "f_contado" },
    fx: { ver: [], sons: ["feixe", "coracao"], amb: { drone: 1, vento: .4 } },
  },
  f_contado: { fim: true, tipo: "ruim", titulo: "Contado", hora: "23:08", lugar: "12º andar", cine: ["lanternas", {}],
    texto: "Ela para na sua frente e sorri. \"Treze.\" No mesmo instante, todas as luzes do prédio acendem. Menos a sua. E nunca mais acende.",
    fx: { ver: ["vermelho"], sons: ["fimRuim"], amb: { drone: 1 } } },
  f_remetente: { fim: true, tipo: "estranho", titulo: "O Remetente", hora: "23:07", lugar: "Porta do 1207", cine: ["janela", { apaga: true }],
    texto: "Você arranca o celular. A figura se desfaz como fumaça. Na tela, a mensagem está pronta, esperando. E você percebe que o seu dedo já apertou enviar.",
    fx: { ver: [], sons: ["vibrarJa", "fimEstranho"], amb: { drone: .7 } } },
});
APAGAO.chamar.escolhas.push(op("Se esconder no 7º andar", "andar7"));
APAGAO.entrar.escolhas[0].ir = "esconde_celia";

// ÚLTIMO ÔNIBUS: a parada no meio do nada, o mato e o fundo do ônibus
Object.assign(ONIBUS, {
  mato: {
    hora: "00:00", lugar: "Mato na beira da estrada", cine: ["ponto", { sem: false }],
    texto: "Você pula no mato. O ônibus para bem na sua frente. A porta abre. O cobrador desce e fica parado na chuva, com a cabeça inclinada, escutando o mato.",
    acao: { tipo: "esconder", rotulo: "Segure para não se mexer quando ele olhar", dur: 9, folego: 3.4, ok: "posto", falha: "f_passageiro" },
    fx: { ver: ["chuva"], sons: ["coracao"], amb: { drone: 1, chuva: 1, motor: .5 } },
  },
  parada: {
    hora: "00:24", lugar: "Linha 13 · curva da serra", cine: ["dentroOnibus", { ate: "frente" }],
    texto: "O ônibus para numa curva no meio do nada. Sobe uma mulher encharcada, de cabelo comprido na frente do rosto. Ela senta bem do seu lado. A água dela pinga no seu pé.",
    escolhas: [op("Fingir que está dormindo", "dorme"), op("Olhar para o rosto dela", "f_rosto")],
    fx: { ver: ["chuva"], sons: ["porta", "coracao"], amb: { drone: 1, motor: .6 } },
  },
  dorme: {
    hora: "00:25", lugar: "Linha 13",
    texto: "Você fecha os olhos e respira devagar. Ela chega o rosto bem perto do seu, cheirando. O cabelo molhado encosta na sua bochecha.",
    acao: { tipo: "segurar", rotulo: "Segure para fingir que dorme", dur: 5, limite: 10, ok: "frente", falha: "f_rosto" },
    fx: { ver: [], sons: ["respira"], amb: { drone: 1, motor: .6 } },
  },
  banco: {
    hora: "00:17", lugar: "Embaixo do banco", cine: ["dentroOnibus", { ate: "fundo", viram: true }],
    texto: "No escuro, você se enfia embaixo do banco. Passos molhados andam pelo corredor. Mãos frias tateiam os bancos, um por um, vindo para o fundo.",
    acao: { tipo: "esconder", rotulo: "Segure para ficar imóvel", dur: 10, folego: 3.2, ok: "porta_tras", falha: "f_passageiro" },
    fx: { ver: ["escuro"], sons: ["coracao"], amb: { drone: 1, motor: .6 } },
  },
  f_rosto: { fim: true, tipo: "ruim", titulo: "Sem Rosto", hora: "00:25", lugar: "Curva da serra", cine: ["ponto", { sem: true }],
    texto: "Ela vira. Onde deveria estar o rosto, há o seu reflexo, molhado. Quando você pisca, está na curva da serra, encharcado, esperando a 13 passar.",
    fx: { ver: ["chuva", "vermelho"], sons: ["fimRuim"], amb: { drone: 1, chuva: 1 } } },
});
ONIBUS.celular.escolhas.push(op("Se esconder no mato", "mato"));
ONIBUS.paga.escolhas[0] = op("Sentar na frente", "parada");
ONIBUS.rasga.escolhas.push(op("Se esconder embaixo do banco", "banco"));

// ABISMO: algo entrou na estação e os cabos com coisas penduradas
Object.assign(ABISMO, {
  invasor: {
    hora: "−450 m", lugar: "Estação · corredor", cine: ["doca", {}],
    texto: "No corredor, a escotilha atrás de você abre sozinha. Algo molhado e comprido rasteja para dentro, tateando as paredes. Você se enfia atrás de um armário.",
    acao: { tipo: "esconder", rotulo: "Segure para ficar imóvel no escuro", dur: 10, folego: 3.2, quatro: true, ok: "controle", falha: "f_visitante" },
    fx: { ver: ["alarme"], sons: ["respira", "coracao"], amb: { drone: 1, agua: .5 }, susto: true },
  },
  cabos: {
    hora: "−795 m", lugar: "Entre os cabos", cine: ["fenda", {}], custo: 5,
    texto: "Entre os cabos, coisas pálidas dormem penduradas, como morcegos. Dezenas. Se o motor fizer barulho demais, elas acordam.",
    acao: { tipo: "avancar", rotulo: "Avance devagar. Pare quando elas se mexerem!", n: 12, limite: 30, quatro: true, ok: "nucleo", falha: "f_despertar" },
    fx: { ver: ["escuro"], sons: ["coracao"], amb: { drone: 1, agua: .6 } },
  },
  f_visitante: { fim: true, tipo: "ruim", titulo: "Visitante", hora: "−450 m", lugar: "Estação", cine: ["salaControle", { capsulas: true }],
    texto: "Os dedos encontram seu rosto no escuro. Frios, curiosos. Na manhã seguinte, a estação tem um tripulante a mais, que não lembra de ter descido.",
    fx: { ver: ["vermelho"], sons: ["fimRuim"], amb: { drone: 1 } } },
});
ABISMO.doca.escolhas[0].ir = "invasor";
ABISMO.fenda.escolhas[0].ir = "cabos";

// TURNO DA NOITE: os vultos procuram no pátio e alguém desce a torre
Object.assign(TURNO, {
  transformador: {
    hora: "02:19", lugar: "Atrás do transformador", cine: ["patio", { vultos: true }],
    texto: "Os capacetes viram para cá. Um deles anda entre os equipamentos, procurando, com a lanterna apontada para o chão. Você se encolhe atrás do transformador.",
    acao: { tipo: "esconder", rotulo: "Segure para ficar fora da lanterna", dur: 9, folego: 3.4, ok: "torre", falha: "f_achado" },
    fx: { ver: ["chuva"], sons: ["coracao"], amb: { drone: .8, chuva: 1, zumbido: 1 } },
  },
  meio: {
    hora: "02:45", lugar: "Meio da torre 7", cine: ["torre", { subindo: true }],
    texto: "No meio da torre, um dos homens desce na sua direção. De cabeça para baixo, pelos ferros, como aranha. Ele só vê o que se mexe.",
    acao: { tipo: "esconder", rotulo: "Segure para ficar imóvel na escada", dur: 8, folego: 3.2, quatro: true, ok: "topo", falha: "f_queda" },
    fx: { ver: ["chuva"], sons: ["raio", "coracao"], amb: { drone: 1, chuva: 1, vento: 1 }, susto: true },
  },
  f_achado: { fim: true, tipo: "ruim", titulo: "Turma de Seis", hora: "02:20", lugar: "Pátio", cine: ["patio", { vultos: true }],
    texto: "A lanterna para no seu rosto. \"Achamos o sexto\", diz uma voz. Agora, em toda tempestade, são seis lanternas subindo a torre 7.",
    fx: { ver: ["chuva", "vermelho"], sons: ["fimRuim"], amb: { drone: 1, chuva: 1 } } },
});
TURNO.patio.escolhas.push(op("Se esconder atrás do transformador", "transformador"));
TURNO.subir.acao.ok = "meio";

// A TRILHA: o tronco oco
Object.assign(TRILHA, {
  tronco: {
    hora: "21:44", lugar: "Trilha norte · tronco oco", cine: ["trilha", { para: true }],
    texto: "Galhos quebram adiante. Algo alto vem pela trilha, na sua direção, chamando com a voz do Téo. Ao lado, um tronco oco, grande o bastante para você.",
    acao: { tipo: "esconder", rotulo: "Segure para não respirar dentro do tronco", dur: 10, folego: 3.2, ok: "cabana", falha: "f_tronco" },
    fx: { ver: [], sons: ["galho", "coracao"], amb: { drone: 1, vento: .5 } },
  },
  f_tronco: { fim: true, tipo: "ruim", titulo: "Tronco Oco", hora: "21:45", lugar: "Trilha norte", cine: ["trilha", { para: true }],
    texto: "Ela enfia a mão no tronco devagar, como quem procura algo no bolso. E encontra. Na manhã seguinte, o tronco chama o seu nome para quem passa.",
    fx: { ver: ["vermelho"], sons: ["fimRuim"], amb: { drone: 1 } } },
});
TRILHA.voz1.escolhas[1].ir = "tronco";
TRILHA.cima.escolhas[1].ir = "tronco";

// mais trechos de perseguição
Object.assign(ABISMO, {
  alagado: {
    hora: "−452 m", lugar: "Estação · corredor alagado", cine: ["salaControle", {}],
    texto: "O corredor até a sala de controle está meio alagado. Na água escura, a coisa que entrou nada em círculos, de costas para você, farejando.",
    acao: { tipo: "avancar", rotulo: "Atravesse sem ela perceber", n: 10, limite: 30, quatro: true, ok: "controle", falha: "f_visitante" },
    fx: { ver: ["alarme"], sons: ["coracao"], amb: { drone: 1, agua: .8 } },
  },
});
ABISMO.invasor.acao.ok = "alagado";
Object.assign(TRILHA, {
  ponte_corda: {
    hora: "22:12", lugar: "Ponte de corda", cine: ["trilha", { para: true }],
    texto: "Uma ponte de corda sobre a ravina. Do outro lado, a coisa está parada de costas, olhando a cabana. A ponte range a cada passo.",
    acao: { tipo: "avancar", rotulo: "Atravesse quando ela não estiver ouvindo", n: 12, limite: 30, ok: "cabana", falha: "f_riacho" },
    fx: { ver: [], sons: ["rangido", "coracao"], amb: { drone: 1, vento: .8 } },
  },
  estrada_quase: {
    hora: "22:36", lugar: "Fim da trilha", cine: ["trilha", { para: true }],
    texto: "Os faróis da estrada estão logo ali. Mas no meio da trilha, entre você e o asfalto, ela está parada. Ouvindo. Você se joga atrás de uma pedra.",
    acao: { tipo: "esconder", rotulo: "Segure para não respirar", dur: 9, folego: 3, ok: "f_estrada", falha: "f_breu" },
    fx: { ver: [], sons: ["respira", "coracao"], amb: { drone: 1, vento: .5 }, susto: true },
  },
});
TRILHA.guarita.escolhas[1].ir = "ponte_corda";
TRILHA.trilha.acao.ok = "estrada_quase";

/* ==================== animação em toda cena ==================== */
const CINE_EXTRA = {
  apagao: { prova: ["janela", {}], gaveta: ["janela", {}], bloqueio: ["olhoMagico", {}], celia_conta: ["portaAbre", { entra: true }], forcar: ["casaMaquinas", {}],
    lembranca_ap: ["casaMaquinas", { terraco: true }], tvs_off: ["tvs", { sofa: true }], silencio: ["olhoMagico", {}], sintonia: ["terraco", {}], sinal: ["lanternas", { voce: true }],
    radio: ["terraco", {}], f_porta: ["portaAbre", {}], f_sozinho: ["lanternas", {}], f_outro: ["tvs", { sofa: true }], f_escuro: ["cidadeLuz", { menos: true }],
    f_luz: ["cidadeLuz", { janelas: true }], f_frequencia: ["cidadeLuz", {}], f_alcancado: ["predio", { de: 13, ate: 13, andares: 14, outro: { de: 11, ate: 13, vermelha: true, ini: .3, mov: 3 } }], f_multidao: ["rua", {}], perto: ["olhoMagico", { vira: true }] },
  onibus: { horario: ["ponto", { sem: true }], telefone: ["posto", {}], historia: ["posto", {}], velho: ["posto", {}], paga: ["dentroOnibus", { ate: "catraca" }],
    conversa: ["ponte", {}], lembranca_on: ["dentroOnibus", { ate: "frente", viram: true }], garota: ["dentroOnibus", { ate: "cordinha" }], porta_tras: ["dentroOnibus", { ate: "fundo", viram: true }],
    f_cidade: ["ponto", { sem: true }], f_pulo: ["ponte", {}], f_jornal: ["posto", {}], f_reflexo: ["ponte", {}], f_laco: ["ponto", { entra: true }], f_linha: ["posto", {}], dorme: ["dentroOnibus", { ate: "frente" }] },
  abismo: { sonar: ["descida", { de: 410, ate: 412 }], gravar: ["criaturaPerto", {}], espera: ["criaturaPerto", {}], passou: ["descida", { de: 410, ate: 450 }], olho: ["olhoVidro", { mao: true }],
    flare: ["doca", {}], ataque: ["criaturaPerto", { boca: true }], nucleo: ["fenda", {}], painel: ["salaControle", { capsulas: true }], diario: ["salaControle", {}], ar: ["salaControle", {}],
    lembranca_ab: ["olhoVidro", {}], f_resgate: ["superficie", {}], f_relatorio: ["superficie", { criatura: false }], f_despertar: ["fenda", {}], f_casco: ["criaturaPerto", { boca: true }], f_ar: ["olhoVidro", {}], f_vinculo: ["olhoVidro", { mao: true }] },
  turno: { supervisor: ["subestacao", {}], livro: ["painelUsina", {}], chamar: ["painelUsina", { alerta: true, vulto: true }], aberto: ["painelUsina", {}], gritar: ["torre", {}], topo: ["torre", { subindo: true }],
    lembranca_tu: ["torre", { vazia: true }], f_queda: ["torre", { subindo: true }], f_turno: ["torre", {}], f_liberados: ["subestacao", {}] },
  trilha: { cerco: ["acampamento", { passos: true, vozes: false }], apelido: ["acampamento", { passos: true, vozes: false }], cima: ["trilha", { para: true, mochila: true }], gravacao: ["trilha", { para: true, mochila: true }],
    apaga: ["trilha", { para: true, riacho: true }], passou: ["trilha", { para: true }], radio: ["cabana", { guarita: true }], fora: ["cabana", {}], dentro: ["cabana", {}], porta: ["cabana", {}], original: ["cabana", {}],
    lembranca_tr: ["acampamento", { vozes: false }], f_mao: ["acampamento", { fraca: true, passos: true }], f_riacho: ["trilha", { para: true, riacho: true }], f_sinal: ["cabana", {}], f_pratos: ["cabana", {}], f_breu: ["trilha", { corre: true }] },
  ala4: { fichas: ["salaEnf", {}], fusivel: ["necroterio", { aberta: true }], maca: ["corredorHosp", { m: "olha" }], telefone_h: ["elevador", { abre: true }], porque: ["elevador", { abre: true }],
    tunel: ["porao", {}], lembranca_h: ["corredorHosp", { m: "nada" }], f_remedio: ["corredorHosp", { m: "olha" }], f_plantao_h: ["casaFora", { manha: true }], f_fachada: ["casaFora", { sai: true }], f_queda_h: ["terraco", { lanterna: false }] },
  inquilino: { contrato: ["quartoCasa", {}], fechar: ["cozinha", {}], trancou: ["cozinha", { sobe: false }], fechadura: ["cozinha", { sobe: false }], cozinha2: ["cozinha", { sobe: false }],
    dono: ["quartoCasa", {}], cofre: ["quartoCasa", {}], cofre_ok: ["quartoCasa", {}], caldeira: ["porao", {}], lampada: ["porao", {}], lembranca_c: ["porao", { luz: true }] },
};

/* ==================== registro das fases (ordem do menu) ==================== */
(() => {
  const novas = {
    ala4: { titulo: "Ala 4", genero: "Terror", cor: "#ff6b8a", libera: 3,
      gancho: "Você acorda num hospital abandonado. Algo de touca branca anda pelos corredores, ouvindo quem respira.",
      mec: "Esconder · passar sem ser visto · código", nos: ALA4, terror: true },
    inquilino: { titulo: "O Inquilino", genero: "Terror", cor: "#9ec1ff", libera: 7,
      gancho: "O contrato da casa barata tem uma regra: se a porta do porão abrir sozinha, se esconda até ela fechar.",
      mec: "Esconder · segurar a porta · cofre", nos: INQUILINO, terror: true },
  };
  const tudo = Object.assign({}, FASES, novas);
  for (const k of Object.keys(FASES)) delete FASES[k];
  ["apagao", "onibus", "abismo", "ala4", "turno", "inquilino", "trilha"].forEach(k => { FASES[k] = tudo[k]; FASES[k].terror = true; });
  for (const [k, mapa] of Object.entries(CINE_EXTRA)) for (const [id, c] of Object.entries(mapa)) if (FASES[k].nos[id] && !FASES[k].nos[id].cine) FASES[k].nos[id].cine = c;
})();
