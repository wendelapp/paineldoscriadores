// src/app/dashboard/produtos/components/MeusProdutosContent.tsx
"use client";

import { useState } from "react";

interface Produto {
  id: string;
  titulo: string;
  precoPor: string;
  precoDe: string;
  urlAfiliado: string;
  urlImagem: string;
  urlVideo?: string; // Suporte ao vídeo publicado
  visualizacoes?: number;
  cliques?: number;
  createdAt?: string;
  ativo: boolean;
}

interface MeusProdutosContentProps {
  produtos: Produto[];
  carregando: boolean;
  onDeletar: (id: string) => void;
  onRepublicar: (id: string) => void;
}

export default function MeusProdutosContent({
  produtos,
  carregando,
  onDeletar,
  onRepublicar,
}: MeusProdutosContentProps) {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [menuAbertoId, setMenuAbertoId] = useState<string | null>(null);

  const itensPorPagina = 8;
  const totalPaginas = Math.ceil(produtos.length / itensPorPagina);
  
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const produtosPaginados = produtos.slice(inicio, inicio + itensPorPagina);

  return (
    <div className="max-w-6xl mx-auto pb-12 space-y-6">
      
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Meus Produtos Publicados</h2>
          <p className="text-xs text-zinc-400">
            Gerencie sua vitrine, acompanhe o engajamento e monitore conversões de cliques.
          </p>
        </div>
        <div className="text-xs text-zinc-500 font-medium">
          Total: <span className="text-white font-bold">{produtos.length}</span> produtos
        </div>
      </div>

      {carregando ? (
        <div className="py-20 text-center text-xs text-zinc-500">Carregando seus produtos da vitrine...</div>
      ) : produtos.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-950/40">
          <p className="text-xs text-zinc-400 mb-2">Nenhum produto publicado na sua vitrine ainda.</p>
        </div>
      ) : (
        <>
          {/* Grid de 4 Colunas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {produtosPaginados.map((prod) => (
              <div 
                key={prod.id}
                onClick={() => setProdutoSelecionado(prod)}
                className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl overflow-hidden hover:border-zinc-700 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-lg relative"
              >
                {/* Imagem / Mídia do Card com Indicador de Vídeo */}
                <div className="w-full h-40 bg-zinc-900 relative overflow-hidden">
                  {prod.urlImagem ? (
                    <img 
                      src={prod.urlImagem} 
                      alt={prod.titulo} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">Sem Imagem</div>
                  )}
                  
                  {/* Badge de Status */}
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-md text-[10px] font-bold text-emerald-400 rounded border border-emerald-500/30">
                    Ativo
                  </span>

                  {/* Indicador se tiver vídeo */}
                  {prod.urlVideo && (
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-blue-600/80 backdrop-blur-md text-[10px] font-bold text-white rounded flex items-center gap-1 shadow">
                      🎥 Vídeo 9:16
                    </span>
                  )}

                  {/* Botão de 3 Pontinhos */}
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuAbertoId(menuAbertoId === prod.id ? null : prod.id);
                      }}
                      className="w-8 h-8 rounded-lg bg-black/70 backdrop-blur-md text-white hover:bg-black flex items-center justify-center text-sm font-bold border border-zinc-700/50 transition-colors"
                    >
                      ⋮
                    </button>

                    {/* Menu Dropdown dos 3 Pontinhos */}
                    {menuAbertoId === prod.id && (
                      <div className="absolute right-0 top-10 w-36 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl py-1 z-20">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuAbertoId(null);
                            onRepublicar(prod.id);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-800 transition-colors flex items-center gap-2"
                        >
                          🔄 Republicar
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuAbertoId(null);
                            onDeletar(prod.id);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-2"
                        >
                          🗑️ Deletar
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Informações do Card */}
                <div className="p-3.5 flex flex-col justify-between grow space-y-2">
                  <h3 className="text-xs font-bold text-white line-clamp-2 leading-snug">{prod.titulo}</h3>
                  
                  <div className="flex items-center justify-between pt-1 border-t border-zinc-900">
                    <span className="text-xs font-black text-emerald-400">R$ {prod.precoPor}</span>
                    <div className="flex items-center gap-3 text-[10px] text-zinc-400">
                      <span>👁️ {prod.visualizacoes || 0}</span>
                      <span>🖱️ {prod.cliques || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Paginação */}
          {totalPaginas > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
                disabled={paginaAtual === 1}
                className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white disabled:opacity-40 hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Anterior
              </button>
              <span className="text-xs text-zinc-400 font-medium px-2">
                Página {paginaAtual} de {totalPaginas}
              </span>
              <button
                onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))}
                disabled={paginaAtual === totalPaginas}
                className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white disabled:opacity-40 hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}

      {/* MODAL DE DETALHES COMPACTO E ORGANIZADO */}
      {produtoSelecionado && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-md w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Cabeçalho Fixo do Modal com Botão de Fechar Bem Visível */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-900 bg-zinc-950 sticky top-0 z-10">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Detalhes do Produto</h3>
              <button
                onClick={() => setProdutoSelecionado(null)}
                className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 text-white hover:bg-zinc-800 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Conteúdo com Rolagem Interna */}
            <div className="p-5 overflow-y-auto space-y-4">
              
              {/* Player de Vídeo Publicado ou Imagem */}
              <div className="w-full h-44 bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 relative flex items-center justify-center">
                {produtoSelecionado.urlVideo ? (
                  <video 
                    src={produtoSelecionado.urlVideo} 
                    controls 
                    className="w-full h-full object-cover"
                  />
                ) : produtoSelecionado.urlImagem ? (
                  <img src={produtoSelecionado.urlImagem} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-zinc-500">Nenhuma mídia encontrada</span>
                )}
              </div>

              {/* Informações */}
              <div className="space-y-2">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Título</span>
                <h4 className="text-xs font-bold text-white leading-snug">{produtoSelecionado.titulo}</h4>
              </div>

              {/* Preços */}
              <div className="grid grid-cols-2 gap-3 bg-zinc-900/50 p-3 rounded-xl border border-zinc-900">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Preço Atual</span>
                  <p className="text-xs font-bold text-emerald-400">R$ {produtoSelecionado.precoPor}</p>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Preço Original</span>
                  <p className="text-xs font-medium text-zinc-400 line-through">R$ {produtoSelecionado.precoDe}</p>
                </div>
              </div>

              {/* Métricas */}
              <div className="grid grid-cols-3 gap-2 bg-zinc-900/50 p-3 rounded-xl border border-zinc-900 text-center">
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Visualizações</span>
                  <p className="text-xs font-bold text-white mt-0.5">{produtoSelecionado.visualizacoes || 0}</p>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Cliques</span>
                  <p className="text-xs font-bold text-white mt-0.5">{produtoSelecionado.cliques || 0}</p>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Publicado em</span>
                  <p className="text-[10px] font-bold text-zinc-300 mt-1">{produtoSelecionado.createdAt || "Hoje"}</p>
                </div>
              </div>

              {/* Link de Afiliado */}
              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Link de Afiliado</span>
                <a 
                  href={produtoSelecionado.urlAfiliado} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg p-2.5 truncate hover:underline mt-1"
                >
                  {produtoSelecionado.urlAfiliado}
                </a>
              </div>

            </div>

            {/* Rodapé Fixo do Modal */}
            <div className="px-5 py-3 border-t border-zinc-900 bg-zinc-950 flex justify-end">
              <button
                onClick={() => setProdutoSelecionado(null)}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}