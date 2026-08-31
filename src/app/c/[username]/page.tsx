"use client";

import { useState, useEffect, use } from "react"; 
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc, increment, updateDoc, orderBy } from "firebase/firestore";
import Script from "next/script";

import Footer from "./components/Footer";
import ProdutoCard from "./components/ProdutoCard";
import VideoModal from "./components/VideoModal";
import VitrineAbas from "./components/VitrineAbas";
import ProdutoDetalheModal from "./components/ProdutoDetalheModal";
import SecaoAvaliacoes from "./components/SecaoAvaliacoes";

interface Produto {
  id: string;
  titulo: string;
  precoPor: string;
  precoDe: string;
  urlAfiliado: string;
  urlImagem: string;
  urlVideo?: string;
  pixelMeta?: string;
  pixelGoogle?: string;
  visualizacoes?: number;
  dataPublicacao?: any;
  categoria?: string;
  descricao?: string;
  textoBotao?: string;
}

interface Avaliacao {
  id: string;
  nomeCliente: string;
  comentario: string;
  nota: number;
  dataCriacao?: any;
}

interface RedesSociais {
  youtube?: string;
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  twitter?: string;
  telegram?: string;
}

interface CriadorData {
  nome: string;
  usuario: string;
  bio: string;
  avatarUrl?: string;
  bannerUrl?: string;
  isVerified?: boolean;
  redesSociais?: RedesSociais;
}

export default function VitrinePublicaPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = use(params);
  const paramUrl = resolvedParams.username.trim();

  const [criador, setCriador] = useState<CriadorData | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [videoAberto, setVideoAberto] = useState<string | null>(null);

  const [abaAtiva, setAbaAtiva] = useState<'home' | 'categorias' | 'avaliacoes'>('home');
  const [produtoDetalheAberto, setProdutoDetalheAberto] = useState<Produto | null>(null);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 12; 
  const [userId, setUserId] = useState("");

  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);

  const registrarClique = async (produto: Produto) => {
    if (!userId) return;
    const prodRef = doc(db, "users", userId, "produtos", produto.id);
    await updateDoc(prodRef, { cliques: increment(1) });

    if (produto.pixelMeta && typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase', { content_name: produto.titulo });
    }
  };

  const registrarVisualizacao = async (produto: Produto) => {
    setProdutoDetalheAberto(produto);
    
    if (userId) {
      const prodRef = doc(db, "users", userId, "produtos", produto.id);
      await updateDoc(prodRef, { visualizacoes: increment(1) });
      
      setProdutos(prev => prev.map(p => 
        p.id === produto.id ? { ...p, visualizacoes: (p.visualizacoes || 0) + 1 } : p
      ));
    }
  };

  useEffect(() => {
    async function buscarDadosDaVitrine() {
      try {
        let userDocData: CriadorData | null = null;
        let userIdDoc = "";

        try {
          const docRef = doc(db, "users", paramUrl);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            userDocData = docSnap.data() as CriadorData;
            userIdDoc = docSnap.id;
          }
        } catch (e) {}

        if (!userDocData) {
          const usersRef = collection(db, "users");
          const qUsuario = query(usersRef, where("usuario", "==", paramUrl));
          let querySnapshot = await getDocs(qUsuario);

          if (querySnapshot.empty) {
            const qUsuarioLower = query(usersRef, where("usuario", "==", paramUrl.toLowerCase()));
            querySnapshot = await getDocs(qUsuarioLower);
          }

          if (querySnapshot.empty) {
            const qSlug = query(usersRef, where("slug", "==", paramUrl.toLowerCase()));
            querySnapshot = await getDocs(qSlug);
          }

          if (!querySnapshot.empty) {
            const matchedDoc = querySnapshot.docs[0];
            userDocData = matchedDoc.data() as CriadorData;
            userIdDoc = matchedDoc.id;
          }
        }

        if (userDocData && userIdDoc) {
          setCriador(userDocData);
          setUserId(userIdDoc); 
          
          const produtosRef = collection(db, "users", userIdDoc, "produtos");
          const qProdutos = query(produtosRef, where("status", "==", "aprovado"));
          const produtosSnapshot = await getDocs(qProdutos);
          const listaProdutos = produtosSnapshot.docs.map(docProd => ({
            id: docProd.id,
            ...docProd.data()
          })) as Produto[];

          listaProdutos.sort((a, b) => {
            const tempoA = a.dataPublicacao?.seconds || 0;
            const tempoB = b.dataPublicacao?.seconds || 0;
            return tempoB - tempoA; 
          });
          setProdutos(listaProdutos);

          try {
            const avalRef = collection(db, "users", userIdDoc, "avaliacoes");
            const qAval = query(avalRef, orderBy("dataCriacao", "desc"));
            const avalSnapshot = await getDocs(qAval);
            const listaAval = avalSnapshot.docs.map(docAval => ({
              id: docAval.id,
              ...docAval.data()
            })) as Avaliacao[];
            setAvaliacoes(listaAval);
          } catch (err) {}
        }
      } catch (error) {
        console.error("Erro crítico ao carregar vitrine:", error);
      } finally {
        setCarregando(false);
      }
    }

    if (paramUrl) buscarDadosDaVitrine();
  }, [paramUrl]);

  if (carregando) return <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center"><p className="text-xs text-zinc-500 animate-pulse">Carregando...</p></div>;

  if (!criador) return <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-4 text-center space-y-2"><h1 className="text-lg font-bold">Criador não encontrado</h1></div>;

  const categoriasPresentes = Array.from(new Set(produtos.map(p => p.categoria || "📌 Outros")));

  return (
    <div className="min-h-screen bg-[#09090be6] text-white flex flex-col items-center py-10 px-4 relative isolate">
      
      {/* PIXELS */}
      {produtos.map((p) => (
        <div key={p.id}>
          {p.pixelMeta && (
            <Script id={`fb-pixel-${p.id}`} strategy="afterInteractive">
              {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '${p.pixelMeta}'); fbq('track', 'PageView');`}
            </Script>
          )}
          {p.pixelGoogle && (
            <Script id={`g-pixel-${p.id}`} strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${p.pixelGoogle}`} />
          )}
        </div>
      ))}

      <div className="w-full max-w-5xl space-y-8">
        
        {/* CABEÇALHO COM BANNER */}
        <div className="bg-zinc-900 border border-zinc-800/80 rounded-3xl overflow-hidden shadow-2xl text-center relative">
          <div className="h-44 w-full relative bg-zinc-950">
            {criador.bannerUrl ? <img src={criador.bannerUrl} alt="Banner" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-linear-to-r from-blue-900/50 via-indigo-900/40 to-purple-900/50" />}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-zinc-950/40 to-zinc-900" />
          </div>
          <div className="px-6 pb-6 relative -mt-14">
            <div className="relative inline-block">
              <div className="w-28 h-28 mx-auto bg-zinc-800 rounded-full flex items-center justify-center border-4 border-zinc-900 overflow-hidden shadow-2xl relative z-10 text-3xl">
                {criador.avatarUrl ? <img src={criador.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : "👤"}
              </div>
              {criador.isVerified && <div className="absolute bottom-1 right-1 w-7 h-7 bg-blue-600 rounded-full border-2 border-zinc-900 flex items-center justify-center text-white z-20 shadow-md">✓</div>}
            </div>
            <h1 className="text-2xl font-black tracking-tight mt-3 text-white relative z-10">{criador.nome}</h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 leading-relaxed max-w-md mx-auto px-2 relative z-10">{criador.bio}</p>
          </div>
        </div>

        {/* COMPONENTE FILHO: ABAS */}
        <VitrineAbas 
  abaAtiva={abaAtiva} 
  setAbaAtiva={setAbaAtiva} 
  totalAvaliacoes={avaliacoes.length} 
  categoriasDisponiveis={categoriasPresentes}
  categoriaSelecionada={categoriaSelecionada}
  setCategoriaSelecionada={setCategoriaSelecionada}
/>

        {/* ABA HOME */}
        {abaAtiva === 'home' && (
          <div className="space-y-6">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 text-center">Ofertas Recomendadas</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {produtos.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina).map((produto) => (
                <ProdutoCard 
                  key={produto.id} 
                  produto={produto} 
                  onVisualizar={registrarVisualizacao} 
                  onClique={registrarClique} 
                />
              ))}
            </div>

            {produtos.length > itensPorPagina && (
              <div className="flex justify-center gap-4 pt-6">
                <button 
                  disabled={paginaAtual === 1}
                  onClick={() => setPaginaAtual(p => p - 1)}
                  className="px-5 py-2.5 bg-zinc-900 border border-zinc-800 text-xs font-bold text-white rounded-xl disabled:opacity-20 cursor-pointer hover:bg-zinc-800 transition-colors shadow-md"
                >
                  ← Anterior
                </button>
                <span className="text-xs text-zinc-400 self-center font-bold">Página {paginaAtual}</span>
                <button 
                  disabled={paginaAtual * itensPorPagina >= produtos.length}
                  onClick={() => setPaginaAtual(p => p + 1)}
                  className="px-5 py-2.5 bg-zinc-900 border border-zinc-800 text-xs font-bold text-white rounded-xl disabled:opacity-20 cursor-pointer hover:bg-zinc-800 transition-colors shadow-md"
                >
                  Próxima →
                </button>
              </div>
            )}
          </div>
        )}

       {/* ABA CATEGORIAS */}
        {abaAtiva === 'categorias' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-zinc-950/60 border border-zinc-800/80 p-3 rounded-xl">
              <h2 className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                {categoriaSelecionada ? `Categoria: ${categoriaSelecionada}` : "Todas as Categorias (Selecione no Menu Acima)"}
              </h2>
              {categoriaSelecionada && (
                <button 
                  onClick={() => { setCategoriaSelecionada(null); setPaginaAtual(1); }}
                  className="text-xs text-zinc-400 hover:text-white underline cursor-pointer font-medium"
                >
                  Ver todas
                </button>
              )}
            </div>

            {produtos.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 bg-zinc-950/80 rounded-xl border border-zinc-800">
                Nenhum produto publicado ainda.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {produtos
                    .filter(p => !categoriaSelecionada || (p.categoria || "📌 Outros") === categoriaSelecionada)
                    .slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina)
                    .map(produto => (
                      <ProdutoCard 
                        key={produto.id} 
                        produto={produto} 
                        onVisualizar={registrarVisualizacao} 
                        onClique={registrarClique} 
                      />
                    ))}
                </div>

                {/* PAGINAÇÃO DA ABA CATEGORIAS */}
                {produtos.filter(p => !categoriaSelecionada || (p.categoria || "📌 Outros") === categoriaSelecionada).length > itensPorPagina && (
                  <div className="flex justify-center gap-4 pt-6">
                    <button 
                      disabled={paginaAtual === 1}
                      onClick={() => setPaginaAtual(p => p - 1)}
                      className="px-5 py-2.5 bg-zinc-900 border border-zinc-800 text-xs font-bold text-white rounded-xl disabled:opacity-20 cursor-pointer hover:bg-zinc-800 transition-colors shadow-md"
                    >
                      ← Anterior
                    </button>
                    <span className="text-xs text-zinc-400 self-center font-bold">Página {paginaAtual}</span>
                    <button 
                      disabled={paginaAtual * itensPorPagina >= produtos.filter(p => !categoriaSelecionada || (p.categoria || "📌 Outros") === categoriaSelecionada).length}
                      onClick={() => setPaginaAtual(p => p + 1)}
                      className="px-5 py-2.5 bg-zinc-900 border border-zinc-800 text-xs font-bold text-white rounded-xl disabled:opacity-20 cursor-pointer hover:bg-zinc-800 transition-colors shadow-md"
                    >
                      Próxima →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ABA AVALIAÇÕES */}
        {/* ABA AVALIAÇÕES */}
{abaAtiva === 'avaliacoes' && (
  <SecaoAvaliacoes 
    avaliacoes={avaliacoes} 
    userId={userId} 
    nomeCriador={criador.nome} 
    onAvaliacaoEnviada={() => {
      // Recarrega ou gerencia o estado se necessário
    }} 
  />
)}

        <Footer />
      </div>

      {/* COMPONENTE FILHO: MODAL DE DETALHES */}
      <ProdutoDetalheModal 
  produto={produtoDetalheAberto} 
  onFechar={() => setProdutoDetalheAberto(null)} 
  onClique={registrarClique} 
  onAbrirVideo={(url) => setVideoAberto(url)} 
/>

      <VideoModal videoAberto={videoAberto} onFechar={() => setVideoAberto(null)} />
    </div>
  );
}