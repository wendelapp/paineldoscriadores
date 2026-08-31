"use client";

interface Produto {
  id: string;
  titulo: string;
  precoPor: string;
  precoDe: string;
  urlAfiliado: string;
  urlImagem: string;
  urlVideo?: string;
  categoria?: string;
  descricao?: string;
  textoBotao?: string;
}

interface ProdutoDetalheModalProps {
  produto: Produto | null;
  onFechar: () => void;
  onClique: (produto: Produto) => void;
  onAbrirVideo: (urlVideo: string) => void; // Nova função para disparar o player de vídeo
}

export default function ProdutoDetalheModal({ produto, onFechar, onClique, onAbrirVideo }: ProdutoDetalheModalProps) {
  if (!produto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8">
        
        {/* TOPO DO MODAL */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <span className="text-[10px] bg-blue-600/20 text-blue-400 font-bold px-2 py-0.5 rounded border border-blue-500/30">
            {produto.categoria || "Detalhes do Produto"}
          </span>
          <button 
            onClick={onFechar} 
            className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>

        {/* CORPO DO MODAL */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          
          {/* IMAGEM EM DESTAQUE */}
          <div className="w-full h-64 sm:h-72 rounded-xl bg-zinc-900 overflow-hidden border border-zinc-800 relative">
            <img src={produto.urlImagem} alt={produto.titulo} className="w-full h-full object-cover" />
            
            {/* BOTÃO FLUTUANTE DENTRO DA IMAGEM CASO TENHA VÍDEO */}
            {produto.urlVideo && (
              <button
                onClick={() => onAbrirVideo(produto.urlVideo!)}
                className="absolute bottom-3 right-3 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xl transition-all hover:scale-105 cursor-pointer border border-blue-400/40"
              >
                <span>▶ Assistir Vídeo</span>
              </button>
            )}
          </div>

          {/* TÍTULO E PREÇO */}
          <div className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-white leading-tight">
              {produto.titulo}
            </h2>
            
            <div className="flex items-baseline gap-3 pt-1">
              {produto.precoDe && (
                <span className="text-xs text-zinc-500 line-through">R$ {produto.precoDe}</span>
              )}
              <span className="text-base font-black text-emerald-400">R$ {produto.precoPor}</span>
            </div>
          </div>

          {/* DESCRIÇÃO COMPLETA */}
          <div className="space-y-2 pt-2 border-t border-zinc-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Sobre o produto</h3>
            <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/60">
              {produto.descricao || "Nenhuma descrição detalhada informada pelo criador para este item."}
            </div>
          </div>

        </div>

        {/* RODAPÉ COM BOTÃO DE DESTINO */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 flex gap-3">
          <button 
            onClick={onFechar} 
            className="px-5 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Voltar
          </button>
          <a 
            href={produto.urlAfiliado} 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={() => onClique(produto)}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors cursor-pointer"
          >
            <span>{produto.textoBotao || "🔥 Garanta o seu com Desconto"}</span>
            <span>↗</span>
          </a>
        </div>

      </div>
    </div>
  );
}