// src/lib/utils/linkValidator.ts

const PLATAFORMAS_PERMITIDAS = [
  "mercadolivre.com",
  "shopee", 
  "amazon",
  "hotmart.com",
  "eduzz.com",
  "monetizze.com",
  "kiwify.com",
  "magazineluiza.com",
  "tiktok.com",     // Adicionado para aceitar links de vídeos do TikTok
  "instagram.com"   // Adicionado para aceitar vídeos do Insta
];

const PALAVRAS_PROIBIDAS = [
  "bet", "cassino", "apostas", "blaze", "tigrinho", "fortune", "crash", "rolet", "spin"
];

export function analisarLink(url: string) {
  if (!url || url.trim() === "") {
    return { valido: false, mensagem: "" };
  }

  try {
    const urlObj = new URL(url);
    const dominio = urlObj.hostname.toLowerCase();
    const linkCompleto = url.toLowerCase();

    const contemProibido = PALAVRAS_PROIBIDAS.some(palavra => linkCompleto.includes(palavra));
    if (contemProibido) {
      return { 
        valido: false, 
        mensagem: "Bloqueado: Não permitimos links de jogos de azar ou apostas." 
      };
    }

    const plataformaAutorizada = PLATAFORMAS_PERMITIDAS.some(plat => dominio.includes(plat));
    if (plataformaAutorizada) {
      return { 
        valido: true, 
        mensagem: "✅ Link seguro e autorizado!" 
      };
    } else {
      return { 
        valido: false, 
        mensagem: "Plataforma não reconhecida. Use parceiros oficiais ou redes sociais permitidas." 
      };
    }
  } catch (error) {
    return { 
      valido: false, 
      mensagem: "Digite um link válido (começando com http:// ou https://)" 
    };
  }
}