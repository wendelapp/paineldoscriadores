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
  const formatarData = (timestamp: any) => {
    if (!timestamp?.seconds) return "";
    return new Date(timestamp.seconds * 1000).toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-zinc-700 transition-all group h-full">
      
      {/* PARTE SUPERIOR (IMAGEM E CONTEÚDO) */}
      <div>
        {/* IMAGEM / CAPA EM DESTAQUE */}
        <div 
          onClick={() => onVisualizar(produto)}
          className="relative w-full h-44 bg-zinc-950 cursor-pointer overflow-hidden shrink-0"
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
        <div className="p-5 space-y-3">
          
          {/* TÍTULO */}
          <h3 className="text-xs font-bold text-zinc-100 line-clamp-2 leading-relaxed tracking-tight">
            {produto.titulo}
          </h3>

          {/* LINHA DIVISÓRIA SUTIL */}
          <div className="w-full h-px bg-zinc-800/80 my-2" />

          {/* 🌟 ESPAÇO RESERVADO PARA FUTURAS TAGS (Frete Grátis / Cupom) */}
          {/* Aqui você poderá injetar as badges futuramente sem quebrar o layout */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-semibold px-2 py-0.5 rounded border border-emerald-500/20">
              🔥 Oferta Verificada
            </span>
          </div>

          {/* 🌟 PREÇO E DATA NA MESMA ALTURA */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-baseline gap-2">
              {produto.precoDe && (
                <span className="text-[10px] text-zinc-500 line-through">R$ {produto.precoDe}</span>
              )}
              <span className="text-xs font-extrabold text-emerald-400">R$ {produto.precoPor}</span>
            </div>

            {produto.dataPublicacao && (
              <span className="text-[9px] text-zinc-500 font-medium tracking-wide">
                {formatarData(produto.dataPublicacao)}
              </span>
            )}
          </div>

        </div>
      </div>

      {/* RODAPÉ DO CARD: BOTÃO COLADO DE PONTA A PONTA */}
      <div className="mt-auto">
        <a 
          href={produto.urlAfiliado} 
          target="_blank" 
          rel="noopener noreferrer" 
          onClick={() => onClique(produto)}
          className="flex items-center justify-center gap-1.5 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-lg cursor-pointer rounded-b-2xl rounded-t-none"
        >
          <span>🔥 Garanta o seu com Desconto</span> 
          <span className="text-sm">↗</span>
        </a>
      </div>

    </div>
  );
}