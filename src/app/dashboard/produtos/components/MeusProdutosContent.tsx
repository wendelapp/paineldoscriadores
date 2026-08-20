"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface Produto {
  pixelGoogle: import("react").JSX.Element;
  pixelMeta: import("react").JSX.Element;
  id: string;
  titulo: string;
  precoPor: string;
  precoDe: string;
  urlAfiliado: string;
  urlImagem: string;
  urlVideo?: string;
  visualizacoes?: number;
  cliques?: number;
  createdAt?: string;
  ativo: boolean;
  dataPublicacao?: any;
  status?: "analise" | "ativo" | "reprovado"; // <--- ADICIONE ESTA LINHA
}

interface MeusProdutosContentProps {}

export default function MeusProdutosContent({}: MeusProdutosContentProps) {
  const router = useRouter();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [menuAbertoId, setMenuAbertoId] = useState<string | null>(null);
  const [userUid, setUserUid] = useState<string | null>(null);

  // Conversor cirúrgico para YouTube Embed
  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` 
      : url;
  };

  const formatarData = (data: any) => {
    if (!data) return "Recente";
    if (data.seconds) return new Date(data.seconds * 1000).toLocaleDateString('pt-BR');
    if (typeof data === 'string') return data.split('às')[0].trim(); 
    return "Recente";
  };

  const buscarProdutos = async (uid: string) => {
    try {
      const produtosRef = collection(db, "users", uid, "produtos");
      const querySnapshot = await getDocs(produtosRef);
      
      const listaProdutos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Produto[];
      
      listaProdutos.sort((a, b) => {
        const tempoA = a.dataPublicacao?.seconds || 0;
        const tempoB = b.dataPublicacao?.seconds || 0;
        return tempoB - tempoA;
      });
      
      setProdutos(listaProdutos);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserUid(user.uid);
        buscarProdutos(user.uid);
      } else {
        setUserUid(null);
        setProdutos([]);
        setCarregando(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const onDeletar = async (id: string) => {
    if (!userUid) return;
    
    const confirmacao = window.confirm("Tem certeza que deseja apagar esta oferta?");
    if (confirmacao) {
      try {
        await deleteDoc(doc(db, "users", userUid, "produtos", id));
        setProdutos(prev => prev.filter(p => p.id !== id));
        alert("Oferta removida com sucesso!");
      } catch (error) {
        console.error("Erro ao deletar:", error);
        alert("Erro ao remover a oferta.");
      }
    }
  };

  const onRepublicar = (id: string) => {
    router.push(`/dashboard/publicar?edit=${id}`);
  };

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
        <div className="py-20 text-center text-xs text-zinc-500 animate-pulse">Carregando seus produtos da vitrine...</div>
      ) : produtos.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-950/0">
          <p className="text-xs text-zinc-400 mb-2">Nenhum produto publicado na sua vitrine ainda.</p>
        </div>
      ) : (
        <>
          {/* Grid de 4 Colunas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
            {produtosPaginados.map((prod) => (
              <div 
                key={prod.id}
                onClick={() => setProdutoSelecionado(prod)}
                className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl overflow-hidden hover:border-zinc-700 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-lg relative"
              >
                {/* Imagem / Mídia do Card */}
                <div className="w-full h-35 bg-zinc-900 relative overflow-hidden">
                  {prod.urlImagem ? (
                    <img 
                      src={prod.urlImagem} 
                      alt={prod.titulo} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">Sem Imagem</div>
                  )}
                  
                  {/* Container dos Badges no topo esquerdo da Imagem */}
                  <div className="absolute top-2 left-2 flex gap-1 z-10">
                    
                    {/* Badge Dinâmico de Status */}
                    {prod.status === "analise" ? (
                      <span className="px-2 py-0.5 bg-black/70 backdrop-blur-md text-[10px] font-bold text-amber-400 rounded border border-amber-500/30" title="Aguardando liberação">
                        ⏳ Em Análise
                      </span>
                    ) : prod.status === "reprovado" ? (
                      <span className="px-2 py-0.5 bg-black/70 backdrop-blur-md text-[10px] font-bold text-rose-400 rounded border border-rose-500/30" title="Bloqueado por violação">
                        ⚠️ Reprovado
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-black/70 backdrop-blur-md text-[10px] font-bold text-emerald-400 rounded border border-emerald-500/30">
                        ✓ Ativo
                      </span>
                    )}

                    {/* Ícone Pixel Meta */}
                    {prod.pixelMeta && (
                      <span className="px-1.5 py-0.5 bg-black/70 backdrop-blur-md text-blue-400 rounded border border-blue-500/30 flex items-center justify-center" title="Pixel da Meta Ativo">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C18.34 21.21 22 17.06 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
                        </svg>
                      </span>
                    )}

                    {/* Ícone Google Ads */}
                    {prod.pixelGoogle && (
                      <span className="px-1.5 py-0.5 bg-black/70 backdrop-blur-md text-amber-400 rounded border border-amber-500/30 flex items-center justify-center" title="Pixel do Google Ativo">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
                        </svg>
                      </span>
                    )}
                  </div>

                  {prod.urlVideo && (
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-blue-600/80 backdrop-blur-md text-[10px] font-bold text-white rounded flex items-center gap-1 shadow">
                      🎥 Vídeo 9:16
                    </span>
                  )}

                 {/* Menu de Opções (3 pontinhos) no topo direito */}
                  <div className="absolute top-2 right-2 z-20">
                    
                    {/* BOTÃO DOS 3 PONTINHOS QUE TINHA SUMIDO */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuAbertoId(menuAbertoId === prod.id ? null : prod.id);
                      }}
                      className="w-8 h-8 rounded-lg bg-black/70 backdrop-blur-md text-white hover:bg-black flex items-center justify-center text-sm font-bold border border-zinc-700/50 transition-colors"
                    >
                      ⋮
                    </button>

                    {/* O MENU SUSPENSO (Só aparece se clicar nos 3 pontinhos) */}
                    {menuAbertoId === prod.id && (
                      <div className="absolute right-0 top-10 w-40 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl py-1 z-30 overflow-hidden">
                        
                        {/* Trava de Segurança */}
                        {prod.status === "analise" ? (
                          <div className="px-3 py-3 text-[10px] text-amber-500 font-medium text-center bg-amber-500/5">
                            ⏳ Ações bloqueadas na auditoria
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setMenuAbertoId(null);
                                onRepublicar(prod.id);
                              }}
                              className="w-full text-left px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-800 transition-colors flex items-center gap-2 cursor-pointer"
                            >
                              {prod.status === "reprovado" ? "✏️ Corrigir Oferta" : "🔄 Republicar"}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setMenuAbertoId(null);
                                onDeletar(prod.id);
                              }}
                              className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-2 cursor-pointer"
                            >
                              🗑️ Deletar
                            </button>
                          </>
                        )}
                        
                      </div>
                    )}
                  </div>
                </div>

                {/* Informações do Card */}
                <div className="p-3.5 flex flex-col justify-between grow space-y-2">
                  <h3 className="text-xs font-bold text-white line-clamp-2 leading-snug">{prod.titulo}</h3>
                  
                  <div className="flex items-end justify-between pt-2 border-t border-zinc-900 mt-2">
                    <span className="text-xs font-black text-emerald-400 mb-0.5">R$ {prod.precoPor}</span>
                    
                    <div className="flex flex-col items-end gap-1.5">
                      <div className="flex items-center gap-3 text-[10px] text-zinc-400">
                        
                        {/* ÍCONE DE VISUALIZAÇÕES */}
                        <span className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          {prod.visualizacoes || 0}
                        </span>
                        
                        {/* ÍCONE DE CLIQUES */}
                        <span className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
                            <path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
                          </svg>
                          {prod.cliques || 0}
                        </span>
                        
                      </div>
                      
                      {/* A DATA FICA AQUI EMBAIXO DOS ÍCONES */}
                      <span className="text-[8.5px] text-zinc-600 font-medium uppercase tracking-widest">
                        {formatarData(prod.dataPublicacao || prod.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

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

      {/* MODAL DE DETALHES */}
      {produtoSelecionado && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-md w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-900 bg-zinc-950 sticky top-0 z-10">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Detalhes do Produto</h3>
              <button
                onClick={() => setProdutoSelecionado(null)}
                className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 text-white hover:bg-zinc-800 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              
              <div className="w-full aspect-9/16 max-h-64 bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 relative flex items-center justify-center">
                {produtoSelecionado.urlVideo ? (
                  produtoSelecionado.urlVideo.includes("youtube.com") || produtoSelecionado.urlVideo.includes("youtu.be") ? (
                    <iframe 
                      src={getYouTubeEmbedUrl(produtoSelecionado.urlVideo)} 
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video 
                      src={produtoSelecionado.urlVideo} 
                      controls 
                      className="w-full h-full object-cover"
                    />
                  )
                ) : produtoSelecionado.urlImagem ? (
                  <img src={produtoSelecionado.urlImagem} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-zinc-500">Nenhuma mídia encontrada</span>
                )}
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Título</span>
                <h4 className="text-xs font-bold text-white leading-snug">{produtoSelecionado.titulo}</h4>
              </div>

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
                  {/* DATA CORRIGIDA AQUI NO MODAL */}
                  <p className="text-[10px] font-bold text-zinc-300 mt-1">
                    {formatarData(produtoSelecionado.dataPublicacao || produtoSelecionado.createdAt)}
                  </p>
                </div>
              </div>

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