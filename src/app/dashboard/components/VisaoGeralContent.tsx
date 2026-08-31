"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

export interface Produto {
  pixelMeta: import("react").JSX.Element;
  pixelGoogle: import("react").JSX.Element;
  id: string;
  titulo: string;
  precoPor: string;
  precoDe: string;
  urlAfiliado: string;
  urlImagem: string;
  ativo?: boolean;
  visualizacoes?: number; // 👈 NOVO
  cliques?: number;       // 👈 NOVO
  dataPublicacao?: any;   // 👈 NOVO
  createdAt?: string;     // 👈 NOVO
  status?: "analise" | "ativo" | "reprovado"; // 👈 ADICIONE ESTA LINHA AQUI
}

interface VisaoGeralContentProps {
  produtos?: Produto[];
  carregando?: boolean;
}

export default function VisaoGeralContent({}: VisaoGeralContentProps) {
  const router = useRouter();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [isVerified, setIsVerified] = useState(false); // Trava de segurança para verificação

  // 👇 ESTADO DO FILTRO DE DIAS
  const [diasFiltro, setDiasFiltro] = useState("7");

  // 👇 FILTRAGEM POR DIAS E VARIÁVEIS DE SOMA ATUALIZADAS
  const produtosFiltrados = produtos.filter((prod) => {
    if (!prod.dataPublicacao?.seconds) return true;
    const dataProd = new Date(prod.dataPublicacao.seconds * 1000);
    const diffDias = (Date.now() - dataProd.getTime()) / (1000 * 3600 * 24);
    return diffDias <= Number(diasFiltro);
  });

  const totalVisualizacoes = produtosFiltrados.reduce((acc, p) => acc + (p.visualizacoes || 0), 0);
  const totalCliques = produtosFiltrados.reduce((acc, p) => acc + (p.cliques || 0), 0);
  const ultimosProdutos = produtosFiltrados.slice(0, 4);

  // Motor de busca direto no Firebase (Produtos + Status de Verificação)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // 1. Busca os dados do usuário para checar se está verificado
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setIsVerified(userDocSnap.data().isVerified === true);
          }

          // 2. Busca os produtos do usuário
          const produtosRef = collection(db, "users", user.uid, "produtos");
          const querySnapshot = await getDocs(produtosRef);
          
          const listaProdutos = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Produto[];
          
          // Inverte a lista para mostrar os recém-adicionados primeiro
          // 👇 NOVA ORDENAÇÃO CRONOLÓGICA
          listaProdutos.sort((a, b) => {
            const tempoA = a.dataPublicacao?.seconds || 0;
            const tempoB = b.dataPublicacao?.seconds || 0;
            return tempoB - tempoA;
          });
          setProdutos(listaProdutos);
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
        } finally {
          setCarregando(false);
        }
      } else {
        setProdutos([]);
        setIsVerified(false);
        setCarregando(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Função de segurança do botão de publicar
  const handlePublicarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isVerified) {
      alert("⚠️ Você precisa verificar sua conta com o YouTube antes de publicar ofertas.");
      router.push("/dashboard/verificacao");
    } else {
      router.push("/dashboard/publicar");
    }
  };

  const totalProdutos = produtos.length;
  // 👇 FUNÇÃO DE FORMATAR DATA
  const formatarData = (data: any) => {
    if (!data) return "Recente";
    if (data.seconds) return new Date(data.seconds * 1000).toLocaleDateString('pt-BR');
    if (typeof data === 'string') return data.split('às')[0].trim(); 
    return "Recente";
  };
  // Lógica para pegar exatamente os 4 produtos mais recentes
  

  return (
    <div className="max-w-6xl mx-auto pb-6 space-y-6">
      
      {/* CABEÇALHO: Substitua o botão solto por esta div com o select do lado */}
<div className="flex items-center gap-3">
  <select
    value={diasFiltro}
    onChange={(e) => setDiasFiltro(e.target.value)}
    className="bg-zinc-900 text-xs text-zinc-300 border border-zinc-700 rounded-lg px-3 py-2 outline-none focus:border-blue-500 cursor-pointer shadow-md"
  >
    <option value="7">Últimos 7 dias</option>
    <option value="15">Últimos 15 dias</option>
    <option value="30">Últimos 30 dias</option>
  </select>

  <button
    onClick={handlePublicarClick}
    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition-colors shadow-lg cursor-pointer"
  >
    ✨ Publicar Nova Oferta
  </button>
</div>

      {/* Cards de Métricas Compactos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-4 shadow-xl">
          <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Produtos na Vitrine</p>
          <p className="text-2xl font-black text-white mt-1">{totalProdutos}</p>
          <p className="text-[10px] text-emerald-400 mt-1 font-medium">● Ativos e prontos para conversão</p>
        </div>

        <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-4 shadow-xl">
          <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Visualizações Totais</p>
          <p className="text-2xl font-black text-white mt-1">{totalVisualizacoes}</p>
          <p className="text-[10px] text-blue-400 mt-1 font-medium">0 nesta semana</p>
        </div>

        <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-4 shadow-xl">
          <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Cliques em Links (CTR)</p>
          <p className="text-2xl font-black text-white mt-1">{totalCliques}</p>
          <p className="text-[10px] text-purple-400 mt-1 font-medium">0% taxa de conversão</p>
        </div>
      </div>

      {/* Seção de Ofertas Recentes (Máximo 4) */}
      <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Suas Últimas 4 Ofertas</h3>
          <span className="text-[11px] text-zinc-500 font-medium">{totalProdutos} cadastradas no total</span>
        </div>

        {carregando ? (
          <div className="py-8 text-center text-xs text-zinc-500 animate-pulse">Carregando dados da vitrine...</div>
        ) : (
          <div className="space-y-2">
            {ultimosProdutos.length === 0 ? (
               <div className="py-6 text-center text-xs text-zinc-500">
                 Nenhuma oferta cadastrada. Clique em "Publicar Nova Oferta" para começar.
               </div>
            ) : (
            ultimosProdutos.map((prod) => (
                <div key={prod.id} className="flex items-center justify-between p-3 bg-zinc-900/60 border border-zinc-800/60 rounded-lg hover:border-zinc-700 transition-colors gap-2">
                  
                  {/* LADO ESQUERDO: Imagem e Título (EXPANDIDO PARA MOBILE) */}
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 overflow-hidden shrink-0 flex items-center justify-center border border-zinc-700">
                      {prod.urlImagem ? (
                        <img src={prod.urlImagem} alt={prod.titulo} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs">📦</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-white truncate">{prod.titulo}</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5 truncate">
                        R$ {prod.precoPor} <span className="line-through ml-1 text-zinc-600 hidden sm:inline">R$ {prod.precoDe}</span>
                      </p>
                    </div>
                  </div>

                  {/* MEIO: Visualizações, Cliques e Data */}
                  <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-zinc-400" title="Visualizações">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                      {prod.visualizacoes || 0}
                    </span>
                    
                    <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-zinc-400" title="Cliques">
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>
                      {prod.cliques || 0}
                    </span>

                    <span className="hidden sm:inline text-[10px] text-zinc-500 font-medium border-l border-zinc-800 pl-4">
                      {formatarData(prod.dataPublicacao || prod.createdAt)}
                    </span>
                  </div>

                  {/* LADO DIREITO: Badges de Rastreio + Ativo (LIMPO E SEM DUPLICAÇÕES) */}
                  <div className="flex justify-end items-center gap-2 shrink-0">
                    
                    {/* BADGE DA META (FACEBOOK) */}
                    {prod.pixelMeta && (
                      <span className="hidden sm:flex px-2 py-1 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded items-center gap-1" title="Pixel da Meta Ativo">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C18.34 21.21 22 17.06 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/></svg>
                        Meta
                      </span>
                    )}

                    {/* BADGE DO GOOGLE ADS (AGORA APARECE SÓ UMA VEZ) */}
                    {prod.pixelGoogle && (
                      <span className="hidden sm:flex px-2 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider rounded items-center gap-1" title="Pixel do Google Ativo">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/></svg>
                        Ads
                      </span>
                    )}

                    {/* BADGE DINÂMICO DE STATUS UNIFICADO */}
                    {prod.status === "analise" ? (
                      <span className="px-2 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-bold rounded uppercase tracking-wider whitespace-nowrap" title="Aguardando liberação">
                        ⏳ Em Análise
                      </span>
                    ) : prod.status === "reprovado" ? (
                      <span className="px-2 py-1 bg-rose-500/10 text-rose-500 text-[10px] font-bold rounded uppercase tracking-wider whitespace-nowrap" title="Bloqueado por violação">
                        ⚠️ Reprovado
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded uppercase tracking-wider whitespace-nowrap">
                        ATIVO
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
            
            {/* Link para ver todos se houver mais de 4 produtos */}
            {totalProdutos > 4 && (
              <div className="pt-3 text-center">
                <Link 
                  href="/dashboard/produtos" 
                  className="text-[11px] text-blue-500 hover:text-blue-400 font-bold hover:underline transition-colors"
                >
                  Ver todos os {totalProdutos} produtos →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}