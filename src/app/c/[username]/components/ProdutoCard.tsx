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
      
      {/* PARTE SUPERIOR (IMAGEM E CONTEÚDO PRINCIPAL) */}
      <div>
        {/* IMAGEM / CAPA COMPACTA */}
        <div 
          onClick={() => onVisualizar(produto)}
          className="relative w-full h-36 bg-zinc-950 cursor-pointer overflow-hidden shrink-0"
        >
          <img 
            src={produto.urlImagem} 
            alt={produto.titulo} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
          {produto.urlVideo && (
            <div className="absolute top-2 left-2 bg-blue-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-md">
              <span>▶</span> Vídeo
            </div>
          )}
        </div>

        {/* DETALHES DO PRODUTO (Mais compacto) */}
        <div className="p-3.5 space-y-2">
          
          {/* TÍTULO */}
          <h3 className="text-xs font-bold text-zinc-100 line-clamp-2 leading-tight tracking-tight h-8">
            {produto.titulo}
          </h3>

          {/* TAG DE OFERTA / CUPOM FUTURO */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-semibold px-1.5 py-0.5 rounded border border-emerald-500/20">
              🔥 Oferta Verificada
            </span>
          </div>

          {/* PREÇO */}
          <div className="flex items-baseline gap-1.5 pt-0.5">
            {produto.precoDe && (
              <span className="text-[10px] text-zinc-500 line-through">R$ {produto.precoDe}</span>
            )}
            <span className="text-xs font-extrabold text-emerald-400">R$ {produto.precoPor}</span>
          </div>

        </div>
      </div>

      {/* RODAPÉ COMPACTO: METADADOS + BOTÃO */}
      <div className="mt-auto">
        
        {/* METADADOS (VISUALIZAÇÕES & DATA) */}
        <div className="px-3.5 pb-2">
          <div className="w-full h-px bg-zinc-800/60 mb-1.5" />
          
          <div className="flex items-center justify-between text-[9px] text-zinc-500 font-medium">
            {/* Visualizações */}
            <div className="flex items-center gap-1 bg-zinc-800/40 px-1.5 py-0.5 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              <span>{produto.visualizacoes || 0} views</span>
            </div>

            {/* Data */}
            {produto.dataPublicacao && (
              <span>{formatarData(produto.dataPublicacao)}</span>
            )}
          </div>
        </div>

        {/* BOTÃO DE COMPRA COLADO DE PONTA A PONTA */}
        <a 
          href={produto.urlAfiliado} 
          target="_blank" 
          rel="noopener noreferrer" 
          onClick={() => onClique(produto)}
          className="flex items-center justify-center gap-1 w-full py-2.5 px-2 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition-colors shadow-lg cursor-pointer rounded-b-2xl rounded-t-none"
        >
          <span>🔥 Garanta o seu com Desconto</span> 
          <span className="text-xs">↗</span>
        </a>
      </div>

    </div>
  );
}