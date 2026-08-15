// src/lib/utils/videoUtils.ts

// 1. Função para extrair a capa do YouTube
export function extrairCapaVideo(url: string): string | null {
  if (!url) return null;

  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
  const ytMatch = url.match(ytRegex);
  
  if (ytMatch && ytMatch[1]) {
    return `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`;
  }
  return null;
}

// 2. Função para pegar o link de embed (para rodar o vídeo)
export function getYoutubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return null;
}