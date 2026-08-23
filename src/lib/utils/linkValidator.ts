// src/lib/utils/linkValidator.ts

export const PLATAFORMAS_PERMITIDAS = [
  // Grandes Marketplaces de Produtos Físicos
  "mercadolivre.com",
  "mercadolivre.com.br",
  "shopee.com",
  "shopee.com.br",
  "amazon.com",
  "amazon.com.br",
  "amzn.to", 
  "magazineluiza.com.br",

  // Principais Plataformas de Infoprodutos e Afiliados
  "hotmart.com",
  "go.hotmart.com", // <--- Adicionado aqui para liberar o link oficial de afiliado
  "hotm.art", 
  "eduzz.com",
  "app.eduzz.com",
  "monetizze.com.br",
  "kiwify.com.br",
  "pay.kiwify.com.br",

  // Plataformas Especializadas em Produtos Físicos / Encapsulados
  "doppus.com",
  "braip.com",

  // Redes Sociais e Mídias para Direcionamento
  "tiktok.com",
  "instagram.com",
  "youtube.com",
  "youtu.be"
];

const PALAVRAS_PROIBIDAS = [
  "bet", "cassino", "apostas", "blaze", "tigrinho", "fortune", "crash", "rolet", "spin", "roleta", "aviator"
];

// 🚨 NOVA TRAVA: Encurtadores Genéricos Proibidos
export const ENCURTADORES_PROIBIDOS = [
  "bit.ly",
  "tinyurl.com",
  "cutt.ly",
  "ow.ly",
  "buff.ly",
  "shorturl.at"
];

// 1. VALIDADOR DE LINK DE AFILIADO (Blindagem contra Black Hat)
export function analisarLink(url: string) {
  if (!url || url.trim() === "") {
    return { valido: false, mensagem: "" };
  }

  try {
    const urlObj = new URL(url);
    const dominio = urlObj.hostname.toLowerCase();
    const linkCompleto = url.toLowerCase();

    // Trava 1: Verificação Cirúrgica de Domínio (Validado PRIMEIRO para liberar links oficiais de redirecionamento como go.hotmart.com)
    const plataformaAutorizada = PLATAFORMAS_PERMITIDAS.some(
      plat => dominio === plat || dominio.endsWith(`.${plat}`)
    );
    
    if (!plataformaAutorizada) {
      return { 
        valido: false, 
        mensagem: "Plataforma não reconhecida. Use parceiros oficiais ou redes sociais permitidas." 
      };
    }

    // Trava 2: Bloqueio de Encurtadores Genéricos Maliciosos (bit.ly, tinyurl, etc., excluindo os oficiais)
    const usaEncurtador = ENCURTADORES_PROIBIDOS.some(enc => dominio.includes(enc));
    if (usaEncurtador) {
      return {
        valido: false,
        mensagem: "Segurança: Encurtadores de link (ex: bit.ly) são proibidos. Use o link oficial da plataforma."
      };
    }

    // Trava 3: Filtro de Palavras Proibidas
    const contemProibido = PALAVRAS_PROIBIDAS.some(palavra => linkCompleto.includes(palavra));
    if (contemProibido) {
      return { 
        valido: false, 
        mensagem: "Bloqueado: Identificamos termos de jogos de azar ou promessas enganosas." 
      };
    }

    return { 
      valido: true, 
      mensagem: "✅ Link seguro e autorizado!" 
    };

  } catch (error) {
    return { 
      valido: false, 
      mensagem: "Digite um link válido (começando com http:// ou https://)." 
    };
  }
}

// 2. VALIDADOR DE VÍDEO (Apenas YouTube)
export function analisarLinkVideo(url: string) {
  if (!url || url.trim() === "") return { valido: true, mensagem: "" }; // Vídeo é opcional

  try {
    const urlObj = new URL(url);
    const dominio = urlObj.hostname.toLowerCase();
    
    // Aceita apenas variações oficiais do YouTube
    const ehYoutube = dominio === "youtube.com" || dominio.endsWith(".youtube.com") || dominio === "youtu.be";
    
    if (!ehYoutube) {
      return { valido: false, mensagem: "Segurança: O link de vídeo deve ser exclusivamente do YouTube." };
    }
    
    return { valido: true, mensagem: "✅ Vídeo válido." };
  } catch (error) {
    return { valido: false, mensagem: "URL de vídeo inválida." };
  }
}

// 3. VALIDADOR DE IMAGEM (Obriga uso de HTTPS para evitar alertas no navegador do cliente)
// 3. VALIDADOR DE IMAGEM TURBINADO (Obriga HTTPS e extensão de imagem)
export function analisarLinkImagem(url: string) {
  if (!url || url.trim() === "") return { valido: true, mensagem: "" };

  try {
    const urlObj = new URL(url);
    
    // Trava 1: Protocolo seguro
    if (urlObj.protocol !== "https:") {
      return { valido: false, mensagem: "Segurança: A imagem deve usar um link seguro (https://)." };
    }

    // Trava 2: Verifica se é um arquivo de imagem (termina com .jpg, .png, etc)
    const caminho = urlObj.pathname.toLowerCase();
    const extensoesValidas = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    const ehArquivoImagem = extensoesValidas.some(ext => caminho.endsWith(ext));

    if (!ehArquivoImagem) {
       return { 
         valido: false, 
         mensagem: "Cole o endereço direto da imagem (deve terminar em .jpg, .png ou .webp)." 
       };
    }
    
    return { valido: true, mensagem: "✅ Imagem válida." };
  } catch (error) {
    return { valido: false, mensagem: "URL de imagem inválida." };
  }
}