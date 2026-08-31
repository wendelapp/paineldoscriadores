"use client";

interface Produto {
  id: string;
  titulo: string;
  precoPor: string;
  precoDe: string;
  urlAfiliado: string;
  urlImagem: string;
  urlVideo?: string;
  visualizacoes?: number;
  dataPublicacao?: any;
  textoBotao?: string; // 👈 Adicionado aqui para o TypeScript reconhecer
}

interface ProdutoCardProps {
  produto: Produto;
  onVisualizar: (produto: Produto) => void;
  onClique: (produto: Produto) => void;
}

export default function ProdutoCard({ produto, onVisualizar, onClique }: ProdutoCardProps) {
  const formatarData = (timestamp: any) => {
    if (!timestamp?.seconds) return "";
    return new Date(timestamp.seconds * 1000).toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-zinc-700 transition-all group h-full">
      
      {/* CORPO DO CARD */}
      <div className="flex flex-row md:flex-col h-full">
        
        {/* IMAGEM / CAPA */}
        <div 
          onClick={() => onVisualizar(produto)}
          className="relative w-32 min-w-32 md:w-full h-36 md:h-36 bg-zinc-950 cursor-pointer overflow-hidden shrink-0"
        >
          <img 
            src={produto.urlImagem} 
            alt={produto.titulo} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
          
          {/* BOTÃO / TAG DE VÍDEO SEPARADO */}
          {produto.urlVideo && (
            <div 
              onClick={(e) => {
                e.stopPropagation();
                onVisualizar(produto);
              }}
              className="absolute top-2 left-2 bg-blue-600 hover:bg-blue-500 text-white text-[9px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-lg cursor-pointer transition-colors"
            >
              <span>▶ Assistir Vídeo</span>
            </div>
          )}
        </div>

        {/* DETALHES DO PRODUTO */}
        <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-zinc-100 line-clamp-2 leading-tight tracking-tight">
              {produto.titulo}
            </h3>

            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-semibold px-1.5 py-0.5 rounded border border-emerald-500/20">
                🔥 Oferta Verificada
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 pt-0.5">
              {produto.precoDe && (
                <span className="text-[10px] text-zinc-500 line-through">R$ {produto.precoDe}</span>
              )}
              <span className="text-xs font-extrabold text-emerald-400">R$ {produto.precoPor}</span>
            </div>
          </div>

          <button
            onClick={() => onVisualizar(produto)}
            className="w-full py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Ver Detalhes</span>
            <span>›</span>
          </button>
        </div>
      </div>

      {/* ÁREA DE ESTATÍSTICAS */}
      <div className="mt-auto">
        <div className="px-3.5 pb-2 pt-2 md:pt-0">
          <div className="w-full h-px bg-zinc-800/60 mb-2 md:mb-1.5" />
          <div className="flex items-center justify-between text-[9px] text-zinc-500 font-medium">
            <div className="flex items-center gap-1 bg-zinc-800/40 px-1.5 py-0.5 rounded">
              <span>{produto.visualizacoes || 0} views</span>
            </div>
            {produto.dataPublicacao && (
              <span>{formatarData(produto.dataPublicacao)}</span>
            )}
          </div>
        </div>

        {/* BOTÃO DO PC DINÂMICO */}
        <div className="hidden md:block">
          <a 
            href={produto.urlAfiliado} 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={() => onClique(produto)}
            className="flex items-center justify-center gap-1 w-full py-2.5 px-2 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition-colors shadow-lg cursor-pointer rounded-b-2xl rounded-t-none"
          >
            <span className="truncate">{produto.textoBotao || "🔥 Garanta o seu com Desconto"}</span> 
            <span className="text-xs shrink-0">↗</span>
          </a>
        </div>

        {/* BOTÃO DO MOBILE DINÂMICO */}
        <div className="md:hidden p-2 bg-zinc-950/40 border-t border-zinc-800/80">
          <a 
            href={produto.urlAfiliado} 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={() => onClique(produto)}
            className="flex items-center justify-center gap-1 w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-lg shadow cursor-pointer"
          >
            <span className="truncate">{produto.textoBotao || "Comprar com Desconto"}</span> 
            <span className="shrink-0">↗</span>
          </a>
        </div>
      </div>

    </div>
  );
}