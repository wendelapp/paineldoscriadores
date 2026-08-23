export function moderarConteudo(titulo: string, url: string) {
  const tituloLower = (titulo || "").toLowerCase();
  const urlLower = (url || "").toLowerCase();

  // 1. Normalização pesada anti-burla
  const normalizarTexto = (texto: string) => {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") 
      .replace(/1/g, "i")
      .replace(/3/g, "e")
      .replace(/4/g, "a")
      .replace(/0/g, "o")
      .replace(/5/g, "s")
      .replace(/[.\-_!@#$%^&*()+=0-9\/\\|]/g, " "); 
  };

  const textoLimpo = normalizarTexto(`${tituloLower} ${urlLower}`);
  const palavrasNoTexto = textoLimpo.split(/\s+/).filter(Boolean);

  // 2. LISTA COLOSSAL EXPANDIDA (Termos diretos que dão ban na hora)
  const termosProibidosDiretos = [
    "bet", "blaze", "cassino", "casino", "tigrinho", "tiger", "fortune", "slot", "slots", 
    "aposta", "apostas", "aposte", "roleta", "jogo do bicho", "betano", "bet365", "vaidebet", 
    "1xbet", "pinup", "parimatch", "kubet", "pg soft", "mines", "aviator", "spaceman", 
    "penalty", "double", "crash", "poker", "bingo", "caca niquel", "odd", "odds", "palpite",
    "sportingbet", "pixbet", "kto", "superbet", "novibet", "f12bet", "jili", "spribe",
    "brazino", "brazino777", "esportiva", "betfair", "betway", "rivalo", "bodog", "bwin",
    "esportesdasorte", "galerabet", "midas", "sweet bonanza", "gates of olympus", "roletinha",
    "foguetinho", "foguete", "crash game", "jetx", "plinko", "minesweeper", "blackjack",
    "baccarat", "croupier", "jackpot", "megaways", "spin", "spins", "freespin", "giros gratis",
    "rodadas gratis", "bonus de boas vindas", "rollover", "cashback cassino", "betvip", "betfiery",
    "ponzi", "piramide", "marketing multinivel", "mmn", "hinode", "telexfree", "unick", 
    "atlas quantum", "cripto facil", "bitcoin gratis", "minerar bitcoin", "pump and dump",
    "sinal de cripto", "sala de sinais", "grupo vip telegram", "trader esportivo", "tipster",
    "banca alavancada", "alavancagem", "lucro 100%", "dobrar banca", "gestao de banca",
    "robo do pix", "pix premiado", "pix em dobro", "multiplicador de pix", "urubu do pix",
    "jogo da frutinha", "renda passiva absurda", "dinheiro infinito", "bug do pix",
    "falha no sistema", "brecha no app", "metodo infalivel", "lucro certo", "renda automatica",
    "hack", "hacker", "gerador", "cc valida", "cvv", "full docus", "documento falso", 
    "rg falso", "cnh falsa", "fake pix", "extrato falso", "limpar nome", "score alto",
    "comprar seguidores", "comprar likes", "bot de instagram", "bot de visualizacao",
    "contas netflix", "iptv pirata", "tv box pirata", "sky gato", "curso vazado",
    "drive de cursos", "cartao clonado", "clonagem", "nota falsa", "dinheiro falso",
    "venda de cnh", "diploma falso", "comprovante fake", "app espião", "clonar whatsapp",
    "onlyfans", "privacy", "beagle", "chaturanga", "vazado", "vazados", "pack de", 
    "fotos intimas", "conteudo adulto", "mais de 18", "proibido para menores", "xvideos",
    "pornhub", "camgirl", "sugar daddy", "sugar baby"
  ];

  for (let termo of termosProibidosDiretos) {
    const padraoVariacoes = termo.split('').join('\\s*');
    const regex = new RegExp(`\\b${padraoVariacoes}\\b`, 'i');

    if (regex.test(textoLimpo) || textoLimpo.includes(termo)) {
      return {
        aprovado: false,
        motivo: "Conteúdo bloqueado: identificamos termos restritos, ilegais ou contra as políticas da plataforma."
      };
    }
  }

  // 3. Matriz de Combinações de Golpes
  const raizesDeGolpe = [
    { acao: ["ficar", "fica", "ficando", "ficou", "fique", "tornar"], alvo: ["rico", "milionario", "milionaria", "bilionario"] },
    { acao: ["ganhar", "ganhe", "fazendo", "fazer", "fature", "faturar", "multiplicar"], alvo: ["dinheiro", "grana", "milhoes", "renda", "lucro"] },
    { acao: ["dinheiro", "renda", "lucro"], alvo: ["facil", "rapido", "garantido", "automatico", "dormindo", "sem esforco"] },
    { acao: ["robo", "robos", "sinal", "sinais", "sala", "grupo", "bot"], alvo: ["pix", "cassino", "apostas", "milionario", "vip", "trader"] },
    { acao: ["metodo", "formula", "sistema", "investimento", "segredo"], alvo: ["milagroso", "secreto", "lucrativo", "garantido", "escondido", "proibido"] },
    { acao: ["ganhe", "receba", "saque"], alvo: ["agora", "hoje", "imediato"] }
  ];

  for (let grupo of raizesDeGolpe) {
    const temAcao = grupo.acao.some(a => palavrasNoTexto.includes(a));
    const temAlvo = grupo.alvo.some(al => palavrasNoTexto.includes(al));

    if (temAcao && temAlvo) {
      return {
        aprovado: false,
        motivo: "Conteúdo bloqueado: promessas enganosas, sensacionalismo ou promessa de enriquecimento irreal."
      };
    }
  }

  return { aprovado: true, motivo: "" };
}