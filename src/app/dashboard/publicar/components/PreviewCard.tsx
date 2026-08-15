"use client";

import { getYoutubeEmbedUrl } from "@/lib/utils/videoUtils";

interface PreviewCardProps {
  titulo: string;
  urlImagem: string;
  urlVideo: string; // Adicionamos essa nova propriedade
  precoDe: string;
  precoPor: string;
  textoBotao: string;
}

export default function PreviewCard({ titulo, urlImagem, urlVideo, precoDe, precoPor, textoBotao }: PreviewCardProps) {
  const embedUrl = getYoutubeEmbedUrl(urlVideo);

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-xl sticky top-6">
      <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3 text-center">
        📱 Prévia da Vitrine
      </h3>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden max-w-xs mx-auto">
        
        {/* LOGICA DE MÍDIA: VÍDEO OU IMAGEM */}
        <div className="w-full h-48 bg-zinc-800 flex items-center justify-center relative overflow-hidden">
          {embedUrl ? (
            <iframe 
              src={embedUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : urlImagem ? (
            <img src={urlImagem} alt="Capa" className="w-full h-full object-cover" />
          ) : (
            <div className="text-zinc-600 text-xs flex flex-col items-center gap-1">
              <span>🖼️</span> Sem mídia selecionada
            </div>
          )}
        </div>

        {/* Informações do Produto */}
        <div className="p-3">
          <h4 className="text-white font-medium text-xs line-clamp-2 mb-2 leading-tight">
            {titulo || "Título do produto aparecerá aqui..."}
          </h4>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-[10px] text-zinc-500 line-through">R$ {precoDe || "0,00"}</span>
            <span className="text-emerald-400 font-bold text-sm">R$ {precoPor || "0,00"}</span>
          </div>

          <div className="w-full py-2 bg-blue-600 text-white text-xs font-bold text-center rounded-md shadow">
            {textoBotao || "Garanta o seu"}
          </div>
        </div>
      </div>
    </div>
  );
}