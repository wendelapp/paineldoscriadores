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
}

interface ProdutoCardProps {
  produto: Produto;
  onVisualizar: (produto: Produto) => void;
  onClique: (produto: Produto) => void;
}

export default function ProdutoCard({ produto, onVisualizar, onClique }: ProdutoCardProps) {
  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-zinc-700 transition-all group">
      <div>
        {/* IMAGEM / CAPA EM DESTAQUE */}
        <div 
          onClick={() => onVisualizar(produto)}
          className="relative w-full h-44 bg-zinc-950 cursor-pointer overflow-hidden"
        >
          <img 
            src={produto.urlImagem} 
            alt={produto.titulo} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
          {produto.urlVideo && (
            <div className="absolute top-2 left-2 bg-blue-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-md">
              <span>▶</span> Vídeo 9:16
            </div>
          )}
        </div>

        {/* DETALHES DO PRODUTO */}
        <div className="p-4 space-y-2">
          <h3 className="text-xs font-bold text-zinc-100 line-clamp-2 leading-snug h-8">
            {produto.titulo}
          </h3>

          <div className="flex items-baseline gap-2 pt-1">
            {produto.precoDe && (
              <span className="text-[10px] text-zinc-500 line-through">R$ {produto.precoDe}</span>
            )}
            <span className="text-sm font-black text-emerald-400">R$ {produto.precoPor}</span>
          </div>
        </div>
      </div>

      {/* BOTÃO DE AÇÃO */}
      <div className="p-4 pt-0">
        <a 
          href={produto.urlAfiliado} 
          target="_blank" 
          rel="noopener noreferrer" 
          onClick={() => onClique(produto)}
          className="block w-full text-center py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors shadow-lg cursor-pointer"
        >
          🔥 Garanta o seu com Desconto ↗
        </a>
      </div>
    </div>
  );
}