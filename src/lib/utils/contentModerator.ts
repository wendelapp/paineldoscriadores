export function moderarConteudo(titulo: string, url: string) {
  // A lista de palavras base
  const palavrasProibidas = [
    "bet", "blaze", "cassino", "tigrinho", "tiger", "slot", "aposta", "roleta",
    "ganhar dinheiro", "renda extra", "dinheiro facil", "pix", "jogo do bicho"
  ];

  const textoParaAnalisar = `${titulo} ${url}`.toLowerCase();

  // Função para limpar variações comuns (substitui pontos, traços, sublinhados por espaço)
  const textoLimpo = textoParaAnalisar.replace(/[.\-_!@#$%^&*()+=]/g, " ");

  for (let palavra of palavrasProibidas) {
    // Regex avançado:
    // 1. Cria variações: 'bet' vira 'b\s*e\s*t' (pega com espaços ou sem)
    const padraoVariacoes = palavra.split('').join('\\s*');
    const regex = new RegExp(`\\b${padraoVariacoes}\\b`, 'i');

    // Verifica no texto limpo
    if (regex.test(textoLimpo) || textoLimpo.includes(palavra)) {
      return {
        aprovado: false,
        motivo: `Conteúdo bloqueado: identificamos termos de jogos de azar ou promessas enganosas.`
      };
    }
  }

  // Proteção Extra: bloqueia links encurtadores suspeitos comuns
  const linksProibidos = ["bit.ly", "tinyurl", "cutt.ly"];
  if (linksProibidos.some(link => url.toLowerCase().includes(link))) {
    return {
      aprovado: false,
      motivo: "Links encurtadores não são permitidos por segurança."
    };
  }

  return { aprovado: true, motivo: "" };
}