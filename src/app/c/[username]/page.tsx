"use client";

import { useState, useEffect, use } from "react"; 
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc, increment, updateDoc } from "firebase/firestore";
import Script from "next/script";

import Footer from "./components/Footer";

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
}

// 1. CORREÇÃO CIRÚRGICA: Adicionado RedesSociais na Interface
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
  redesSociais?: RedesSociais; // 👈 Agora a vitrine reconhece os links!
}

export default function VitrinePublicaPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = use(params);
  const paramUrl = resolvedParams.username.trim();

  const [criador, setCriador] = useState<CriadorData | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [videoAberto, setVideoAberto] = useState<string | null>(null);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  const [userId, setUserId] = useState("");

  const registrarClique = async (produto: Produto, userId: string) => {
    const prodRef = doc(db, "users", userId, "produtos", produto.id);
    await updateDoc(prodRef, { cliques: increment(1) });

    if (produto.pixelMeta && typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase', { content_name: produto.titulo });
    }
  };

  const registrarVisualizacao = async (produto: Produto) => {
    setVideoAberto(produto.urlVideo || produto.urlImagem);
    
    if (userId) {
      const prodRef = doc(db, "users", userId, "produtos", produto.id);
      await updateDoc(prodRef, { visualizacoes: increment(1) });
      
      setProdutos(prev => prev.map(p => 
        p.id === produto.id ? { ...p, visualizacoes: (p.visualizacoes || 0) + 1 } : p
      ));
    }
  };

  const formatarData = (timestamp: any) => {
    if (!timestamp?.seconds) return "";
    return new Date(timestamp.seconds * 1000).toLocaleDateString('pt-BR');
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` 
      : url;
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
          const produtosSnapshot = await getDocs(produtosRef);
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

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center py-12 px-4 relative selection:bg-blue-500/30">
      
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

      <div className="w-full max-w-md space-y-6">
        
        {/* CABEÇALHO */}
        <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl text-center relative">
          <div className="h-32 w-full relative bg-zinc-950">
            {criador.bannerUrl ? <img src={criador.bannerUrl} alt="Banner" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-linear-to-r from-blue-900/40 to-purple-900/40" />}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-zinc-950/50 to-zinc-900" />
          </div>
          <div className="px-6 pb-6 relative -mt-12">
            <div className="relative inline-block">
              <div className="w-24 h-24 mx-auto bg-zinc-800 rounded-full flex items-center justify-center border-4 border-zinc-900 overflow-hidden shadow-xl relative z-10 text-2xl">
                {criador.avatarUrl ? <img src={criador.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : "👤"}
              </div>
              {criador.isVerified && <div className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 rounded-full border-2 border-zinc-900 flex items-center justify-center text-white z-20 shadow-md">✓</div>}
            </div>
            <h1 className="text-xl font-black tracking-tight mt-3 text-white relative z-10">{criador.nome}</h1>
            <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed px-2 relative z-10">{criador.bio}</p>
            
            {/* 2. CORREÇÃO CIRÚRGICA: BLOCO DE REDES SOCIAIS NA VITRINE */}
            {criador.redesSociais && (
              <div className="flex items-center justify-center gap-3 mt-4 relative z-10">
                {criador.redesSociais.youtube && (
                  <a href={criador.redesSociais.youtube} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-zinc-950 hover:bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-800 text-red-500 transition-all hover:scale-110 shadow-sm" title="YouTube">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                )}
                {criador.redesSociais.instagram && (
                  <a href={criador.redesSociais.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-zinc-950 hover:bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-800 text-pink-500 transition-all hover:scale-110 shadow-sm" title="Instagram">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                )}
                {criador.redesSociais.tiktok && (
                  <a href={criador.redesSociais.tiktok} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-zinc-950 hover:bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-800 text-white transition-all hover:scale-110 shadow-sm" title="TikTok">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                  </a>
                )}
                {criador.redesSociais.facebook && (
                  <a href={criador.redesSociais.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-zinc-950 hover:bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-800 text-blue-500 transition-all hover:scale-110 shadow-sm" title="Facebook">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                  </a>
                )}
                {criador.redesSociais.twitter && (
                  <a href={criador.redesSociais.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-zinc-950 hover:bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-800 text-white transition-all hover:scale-110 shadow-sm" title="Twitter/X">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L5.09 21.75H1.78l7.869-8.99L1.508 2.25h6.814l4.715 6.182zM16.96 19.76h1.83L7.14 4.14H5.19z"/></svg>
                  </a>
                )}
                {criador.redesSociais.telegram && (
                  <a href={criador.redesSociais.telegram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-zinc-950 hover:bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-800 text-blue-400 transition-all hover:scale-110 shadow-sm" title="Telegram">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z"/></svg>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* PRODUTOS COM PAGINAÇÃO */}
        <div className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-center">Ofertas Recomendadas</p>
          
          {produtos.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina).map((produto) => (
            <div key={produto.id} className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 shadow-md flex gap-4 items-center">
              <button 
                onClick={() => registrarVisualizacao(produto)}
                className="relative w-20 h-20 shrink-0 cursor-pointer group hover:opacity-90 transition-opacity"
              >
                <img src={produto.urlImagem} alt={produto.titulo} className="w-full h-full object-cover rounded-lg border border-zinc-700" />
                {produto.urlVideo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg group-hover:bg-black/40 transition-all">
                    <span className="text-[12px] ml-1">▶️</span>
                  </div>
                )}
              </button>

              <div className="grow min-w-0 flex flex-col justify-between h-20">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-xs font-bold text-zinc-200 line-clamp-2 leading-tight">{produto.titulo}</h3>
                    <span className="text-[9px] text-zinc-600 whitespace-nowrap mt-0.5">{formatarData(produto.dataPublicacao)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[9px] text-zinc-500 line-through">R$ {produto.precoDe}</span>
                      <span className="text-[12px] font-black text-emerald-400">R$ {produto.precoPor}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-medium text-zinc-400 bg-zinc-800/50 px-1.5 py-0.5 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                      {produto.visualizacoes || 0}
                    </div>
                  </div>
                </div>
                
                <a 
                  href={produto.urlAfiliado} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={() => registrarClique(produto, userId)}
                  className="block w-full text-center py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-lg transition-colors mt-auto"
                >
                  🔥 Garanta o seu com Desconto ↗
                </a>
              </div>
            </div>
          ))}

          {/* CONTROLES DE PAGINAÇÃO */}
          {produtos.length > itensPorPagina && (
            <div className="flex justify-center gap-4 pt-4">
              <button 
                disabled={paginaAtual === 1}
                onClick={() => setPaginaAtual(p => p - 1)}
                className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-white rounded-lg disabled:opacity-20 cursor-pointer hover:bg-zinc-800"
              >
                ← Anterior
              </button>
              <span className="text-[10px] text-zinc-500 self-center font-bold">Página {paginaAtual}</span>
              <button 
                disabled={paginaAtual * itensPorPagina >= produtos.length}
                onClick={() => setPaginaAtual(p => p + 1)}
                className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-white rounded-lg disabled:opacity-20 cursor-pointer hover:bg-zinc-800"
              >
                Próxima →
              </button>
            </div>
          )}
        </div>

        {/* RODAPÉ */}
        <Footer />
      </div>

      {/* MODAL */}
      {videoAberto && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <button onClick={() => setVideoAberto(null)} className="absolute top-6 left-6 text-white bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-700 cursor-pointer">Voltar</button>
          <div className="w-full max-w-100 aspect-9/16 bg-black rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl flex items-center justify-center">
            {videoAberto.includes("youtube.com") || videoAberto.includes("youtu.be") ? (
              <iframe src={getYouTubeEmbedUrl(videoAberto)} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            ) : (
              <img src={videoAberto} className="w-full h-full object-contain" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}