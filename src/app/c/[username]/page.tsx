"use client";

import { use, useState } from "react";

// Dados mockados com vídeos de exemplo para o teste
const DADOS_CREATOR_FAKE = {
  nome: "João Cortes PRO",
  bio: "Especialista em achar os melhores produtos com desconto!",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
  isVerified: true,
  produtos: [
    {
      id: "1",
      titulo: "Kit Cápsulas Detox Turbo - 5 Meses de Tratamento",
      precoDe: "147,90",
      precoPor: "79,90",
      imagem: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop",
      linkAfiliado: "https://mercadolivre.com",
      textoBotao: "🔥 Garanta o seu com Desconto",
      // Vídeo de exemplo para teste (formato vertical)
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" 
    },
    {
      id: "2",
      titulo: "Fone Bluetooth Gamer Esportivo Pro Sem Fio TWS",
      precoDe: "119,90",
      precoPor: "49,90",
      imagem: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop",
      linkAfiliado: "https://shopee.com.br",
      textoBotao: "🛒 Comprar na Shopee",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
    }
  ]
};

export default function VitrinePublicaPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = use(params);
  const username = resolvedParams.username;

  const [criador] = useState(DADOS_CREATOR_FAKE);
  
  // Estado para controlar se o modal de vídeo está aberto e qual vídeo tocar
  const [videoAberto, setVideoAberto] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center py-12 px-4 relative">
      <div className="w-full max-w-md space-y-6">
        
        {/* CABEÇALHO DO PERFIL */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 text-center backdrop-blur-md shadow-xl space-y-4">
          <div className="relative w-24 h-24 mx-auto">
            <img 
              src={criador.avatar} 
              alt={criador.nome} 
              className="w-full h-full object-cover rounded-full border-2 border-blue-500/50 shadow-lg"
            />
            {criador.isVerified && (
              <span className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full text-xs" title="Criador Verificado">✓</span>
            )}
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">{criador.nome}</h1>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed px-2">{criador.bio}</p>
          </div>
        </div>

        {/* LISTAGEM DE PRODUTOS */}
        <div className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-center">Ofertas Recomendadas</p>

          {criador.produtos.map((produto) => (
            <div key={produto.id} className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 shadow-md flex gap-4 items-center">
              
              {/* ÁREA CLICÁVEL DO VÍDEO (Abre o Modal) */}
              <button 
                onClick={() => setVideoAberto(produto.videoUrl)}
                className="relative w-20 h-20 shrink-0 cursor-pointer group hover:opacity-90 transition-opacity"
              >
                <img src={produto.imagem} alt={produto.titulo} className="w-full h-full object-cover rounded-lg border border-zinc-700" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg group-hover:bg-black/40 transition-all">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg group-hover:scale-110 transition-transform">
                    <span className="text-[12px] ml-1">▶️</span>
                  </div>
                </div>
              </button>

              {/* ÁREA CLICÁVEL DA COMPRA (Vai para a loja) */}
              <div className="grow min-w-0 flex flex-col justify-between h-20">
                <div>
                  <h3 className="text-xs font-bold text-zinc-200 line-clamp-1">{produto.titulo}</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-[10px] text-zinc-500 line-through">R$ {produto.precoDe}</span>
                    <span className="text-sm font-black text-emerald-400">R$ {produto.precoPor}</span>
                  </div>
                </div>
                
                <a 
                  href={produto.linkAfiliado} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full text-center py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-lg transition-colors shadow-sm"
                >
                  {produto.textoBotao} ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🎬 MODAL DE VÍDEO 9:16 TELA CHEIA */}
      {videoAberto && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
          
          {/* Botão Voltar */}
          <button 
            onClick={() => setVideoAberto(null)}
            className="absolute top-6 left-6 flex items-center gap-2 text-white bg-zinc-900/50 hover:bg-zinc-800 px-4 py-2 rounded-full border border-zinc-700 transition-colors z-50"
          >
            <span>←</span> <span className="text-xs font-bold uppercase tracking-wider">Voltar</span>
          </button>

          {/* Player de Vídeo em Formato de Celular */}
          <div className="w-full max-w-90 aspect-9/16 bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl relative">
            <video 
              src={videoAberto} 
              autoPlay 
              controls 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}