'use client';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { useState, useEffect, Suspense } from "react";
// ... (mantenha o restante das suas importações logo abaixo)


import { auth, db } from "../../../lib/firebase";
// 1. Cirurgia aqui: Adicionamos o getDocs para contar os produtos
import { collection, addDoc, serverTimestamp, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { analisarLink } from "@/lib/utils/linkValidator";
import { extrairCapaVideo } from "@/lib/utils/videoUtils";
import PreviewCard from "./components/PreviewCard";

import { useSearchParams } from 'next/navigation';

import { moderarConteudo } from "@/lib/utils/contentModerator";

import ProgressoAnalise from "./components/ProgressoAnalise";







// 2. Cirurgia aqui: Importamos nosso novo arquivo e o PricingCard
import ProTrackingFields from "./components/ProTrackingFields";
// ATENÇÃO: Verifique se o caminho do PricingCard está correto na sua estrutura!
import PricingCard from "../../../modules/auth/subscription/PricingCard"; 

export function PublicarProdutoPage() {
  const [userUid, setUserUid] = useState<string | null>(null);
  
  const [titulo, setTitulo] = useState("");
  const [urlAfiliado, setUrlAfiliado] = useState("");
  const [urlVideo, setUrlVideo] = useState("");
  const [urlImagem, setUrlImagem] = useState("");
  const [precoDe, setPrecoDe] = useState("97,00");
  const [precoPor, setPrecoPor] = useState("29,00");
  const [textoBotao, setTextoBotao] = useState("🔥 Garanta o seu com Desconto");
  
  const [statusLink, setStatusLink] = useState({ valido: false, mensagem: "" });
  const [salvando, setSalvando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState(false);

  // 3. Cirurgia aqui: Novos estados de PLG (Crescimento e Monetização)
  const [isPro, setIsPro] = useState(false);
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [showPricingModal, setShowPricingModal] = useState(false);

  const [pixelMeta, setPixelMeta] = useState("");
  const [pixelGoogle, setPixelGoogle] = useState("");

  // Adicione estas linhas logo no início do seu componente PublicarProdutoPage:
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [statusAnalise, setStatusAnalise] = useState<"livre" | "analisando" | "aprovado">("livre");
  const [erroModeracao, setErroModeracao] = useState("");

  const [produtoEmAnaliseId, setProdutoEmAnaliseId] = useState<string | null>(null);
  const [produtoEmAnaliseDataCriacao, setProdutoEmAnaliseDataCriacao] = useState<any>(null);

  const [carregandoFila, setCarregandoFila] = useState(true);

  // 4. Cirurgia aqui: Busca a quantidade de produtos publicados pelo usuário
 // 4. Busca a quantidade de produtos e gerencia a Fila de Auditoria dos 15 minutos
  // 4. Busca a quantidade de produtos e gerencia a Fila de Auditoria
  useEffect(() => {
    const verificarFilaAnalise = async () => {
      if (!userUid) return;
      
      setCarregandoFila(true); // Começou a ler
      try {
        const produtosRef = collection(db, "users", userUid, "produtos");
        const snapshot = await getDocs(produtosRef);
        
        let produtoEncontrado = false;

        for (const produtoDoc of snapshot.docs) {
          const dados = produtoDoc.data();
          
          if (dados.status === "analise") {
            const tempoCriacao = dados.dataCriacao?.toMillis?.() || Date.now();
            const tempoAtual = Date.now();
            const diferencaMinutos = (tempoAtual - tempoCriacao) / (1000 * 60);

            if (diferencaMinutos >= 15) {
              await updateDoc(doc(db, "users", userUid, "produtos", produtoDoc.id), { status: "ativo" });
            } else {
              setProdutoEmAnaliseId(produtoDoc.id);
              setProdutoEmAnaliseDataCriacao(dados.dataCriacao);
              setStatusAnalise("analisando"); // Força o estado correto
              produtoEncontrado = true;
            }
          }
        }
        
        if (!produtoEncontrado) setStatusAnalise("livre");
        
      } catch (error) {
        console.error(error);
      } finally {
        setCarregandoFila(false); // Terminou de ler
      }
    };

    verificarFilaAnalise();
  }, [userUid]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserUid(user.uid);
        
        try {
          // Busca os dados do usuário no Firestore para verificar se ele é Pro
          const userDocRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userDocRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            // Atualiza o estado com o valor real salvo no banco
            setIsPro(userData.isPro || false);
          }
        } catch (error) {
          console.error("Erro ao verificar status Pro do usuário:", error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Busca a contagem real de produtos para travar o limite
  useEffect(() => {
    const contarProdutos = async () => {
      if (!userUid) return;
      const produtosRef = collection(db, "users", userUid, "produtos");
      const snapshot = await getDocs(produtosRef);
      setTotalProdutos(snapshot.size);
    };
    contarProdutos();
  }, [userUid]);

  const handleMudancaLink = (e: React.ChangeEvent<HTMLInputElement>) => {
    const novoLink = e.target.value;
    setUrlAfiliado(novoLink);
    setStatusLink(analisarLink(novoLink));
  };

  // CAMADA 1: O "Espião" em tempo real
  useEffect(() => {
    if (titulo || urlAfiliado) {
      const analise = moderarConteudo(titulo, urlAfiliado);
      setErroModeracao(analise.aprovado ? "" : analise.motivo);
    }
  }, [titulo, urlAfiliado]);
  
  const handleBlurVideo = () => {
    if (!urlImagem && urlVideo) {
      const capaAuto = extrairCapaVideo(urlVideo);
      if (capaAuto) {
        setUrlImagem(capaAuto);
      }
    }
  };

 const handlePublicar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userUid || !titulo) return;

    setSalvando(true);
    
    // CHECAGEM DE SEGURANÇA FINAL (dentro do clique do botão)
    const snapshotAtual = await getDocs(collection(db, "users", userUid, "produtos"));
    if (!isPro && snapshotAtual.size >= 10) {
      alert("Você atingiu o limite de 10 produtos no plano grátis.");
      setShowPricingModal(true);
      setSalvando(false);
      return;
    }

    try {
      const dadosProduto = {
        titulo,
        urlAfiliado,
        urlVideo,
        urlImagem,
        precoDe,
        precoPor,
        textoBotao,
        pixelMeta: isPro ? pixelMeta : "",
        pixelGoogle: isPro ? pixelGoogle : "",
        dataPublicacao: serverTimestamp(), // Joga o produto para o topo da vitrine!
        ativo: true
      };

      if (editId) {
        // MODO REPUBLICAR / EDITAR: Atualiza o documento existente
        const prodRef = doc(db, "users", userUid, "produtos", editId);
        await updateDoc(prodRef, dadosProduto);
        alert("Oferta republicada e atualizada com sucesso!");
      } else {
        // MODO NOVO: Verifica o limite do plano grátis
        if (!isPro && totalProdutos >= 10) {
          setShowPricingModal(true);
          setSalvando(false);
          return;
        }
        
        // 1. Salva no banco com o carimbo de "analise"
        // 1. Salva no banco
       // NO SEU handlePublicar:
await addDoc(collection(db, "users", userUid, "produtos"), {
  ...dadosProduto,
  status: "analise",
  dataCriacao: serverTimestamp(), // O Firebase coloca o tempo real do servidor
  visualizacoes: 0,
  cliques: 0
});

// Apenas setamos o status para disparar a renderização
setStatusAnalise("analisando");
        return; // Encerra o fluxo aqui com sucesso
      }

      // Limpa os campos após salvar edição (caso seja editId)
      setTitulo("");
      setUrlAfiliado("");
      setUrlVideo("");
      setUrlImagem("");
      setPixelMeta("");
      setPixelGoogle("");

      localStorage.removeItem("@criadordelink:rascunhoPublicar");

    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar o produto.");
    } finally {
      setSalvando(false);
    }
  };

  // 1. CARREGAR RASCUNHO SALVO
 useEffect(() => {
    if (!editId && typeof window !== 'undefined') {
      const rascunhoSalvo = localStorage.getItem("@criadordelink:rascunhoPublicar");
      if (rascunhoSalvo) {
        try {
          const dados = JSON.parse(rascunhoSalvo);
          if (dados.titulo) setTitulo(dados.titulo);
          if (dados.urlAfiliado) setUrlAfiliado(dados.urlAfiliado);
          if (dados.urlVideo) setUrlVideo(dados.urlVideo);
          if (dados.urlImagem) setUrlImagem(dados.urlImagem);
          if (dados.precoDe) setPrecoDe(dados.precoDe);
          if (dados.precoPor) setPrecoPor(dados.precoPor);
          if (dados.textoBotao) setTextoBotao(dados.textoBotao);
          if (dados.pixelMeta) setPixelMeta(dados.pixelMeta);
          if (dados.pixelGoogle) setPixelGoogle(dados.pixelGoogle);
        } catch (error) {
          console.error("Erro ao ler rascunho:", error);
        }
      }
    }
  }, [editId]);

  // 2. SALVAR RASCUNHO AUTOMATICAMENTE
  useEffect(() => {
    if (!editId && titulo.length > 0 && typeof window !== 'undefined') {
      const dadosRascunho = {
        titulo, urlAfiliado, urlVideo, urlImagem, precoDe, precoPor, textoBotao, pixelMeta, pixelGoogle
      };
      localStorage.setItem("@criadordelink:rascunhoPublicar", JSON.stringify(dadosRascunho));
    }
  }, [titulo, urlAfiliado, urlVideo, urlImagem, precoDe, precoPor, textoBotao, pixelMeta, pixelGoogle, editId]);
  // Adicione esta função e o useEffect logo abaixo do seu editId:
  const carregarProdutoParaEdicao = async (id: string) => {
    if (!userUid) return;
    try {
      const docRef = doc(db, "users", userUid, "produtos", id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitulo(data.titulo || "");
        setUrlAfiliado(data.urlAfiliado || "");
        setUrlVideo(data.urlVideo || "");
        setUrlImagem(data.urlImagem || "");
        setPrecoDe(data.precoDe || "");
        setPrecoPor(data.precoPor || "");
        setTextoBotao(data.textoBotao || "");
        setPixelMeta(data.pixelMeta || "");
        setPixelGoogle(data.pixelGoogle || "");
      }
    } catch (error) {
      console.error("Erro ao carregar produto para edição:", error);
    }
  };

  useEffect(() => {
    if (editId && userUid) {
      carregarProdutoParaEdicao(editId);
    }
  }, [editId, userUid]);

  // Variáveis para as cores de alerta
  const limiteAtingido = !isPro && totalProdutos >= 10;
  const alertaQuaseLimite = !isPro && totalProdutos === 9;

  return (
    <Suspense fallback={<div className="p-10 text-center text-zinc-400">Carregando painel...</div>}>
      <>
        <div className="max-w-6xl mx-auto pb-6">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-white tracking-tight">Publicar Oferta na Vitrine</h2>
            <p className="text-xs text-zinc-400">
              Cadastre sua oferta com gatilho de preço e prévia em tempo real de forma rápida e organizada.
            </p>
          </div>

          {searchParams.get('status') === 'sucesso' && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-emerald-400 text-xs font-medium text-center mb-4">
              🎉 Pagamento realizado com sucesso! Sua conta Pro está sendo ativada.
            </div>
          )}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* CAMADA DO PORTEIRO: Verifica se carregou os dados antes de exibir */}
          {carregandoFila ? (
            <div className="lg:col-span-8 bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-12 shadow-xl flex items-center justify-center text-zinc-500">
               Carregando auditoria...
            </div>
          ) : statusAnalise === "analisando" ? (
            <ProgressoAnalise 
              status="analise" 
              produtoId={produtoEmAnaliseId || ""} 
              userUid={userUid || ""} 
              dataCriacao={produtoEmAnaliseDataCriacao} 
              onVoltarEdicao={() => setStatusAnalise("livre")}
            />
          ) : statusAnalise === "aprovado" ? (
            <ProgressoAnalise 
              status="aprovado" 
            />
          ) : (
            <form onSubmit={handlePublicar} className="lg:col-span-8 bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-4 shadow-xl space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-300 mb-1">Título do Produto</label>
                  <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Smartwatch Ultra Série 9" maxLength={60} className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700/80 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-600" required disabled={limiteAtingido} />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-300 mb-1">Link de Afiliado ou Oferta (URL)</label>
                  <input type="url" value={urlAfiliado} onChange={handleMudancaLink} placeholder="https://mercadolivre.com.br/..." className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700/80 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-600" required disabled={limiteAtingido} />
                  {statusLink.mensagem && (
                    <p className={`mt-0.5 text-[10px] font-medium ${statusLink.valido ? "text-emerald-400" : "text-rose-400"}`}>
                      {statusLink.mensagem}
                    </p>
                  )}
                  {erroModeracao && <p className="mt-0.5 text-[10px] font-medium text-rose-400">{erroModeracao}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-300 mb-1">Link da Imagem (URL)</label>
                  <input type="url" value={urlImagem} onChange={(e) => setUrlImagem(e.target.value)} placeholder="https://exemplo.com/foto.jpg" className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700/80 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-600" disabled={limiteAtingido} />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-300 mb-1">Link do Vídeo (YouTube)</label>
                  <input type="url" value={urlVideo} onChange={(e) => setUrlVideo(e.target.value)} onBlur={handleBlurVideo} placeholder="https://youtube.com/watch?v=..." className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700/80 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-600" disabled={limiteAtingido} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-300 mb-1">Preço "De" (R$)</label>
                  <input type="text" value={precoDe} onChange={(e) => setPrecoDe(e.target.value)} placeholder="97,00" className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700/80 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-600" disabled={limiteAtingido} />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-300 mb-1">Preço "Por" (R$)</label>
                  <input type="text" value={precoPor} onChange={(e) => setPrecoPor(e.target.value)} placeholder="29,00" className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700/80 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-600" disabled={limiteAtingido} />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-300 mb-1">Texto do Botão</label>
                  <input type="text" value={textoBotao} onChange={(e) => setTextoBotao(e.target.value)} placeholder="Ex: 🔥 Garanta com Desconto" className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700/80 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-600" disabled={limiteAtingido} />
                </div>
              </div>

              <ProTrackingFields 
                isPro={isPro} 
                onUpgradeClick={() => setShowPricingModal(true)} 
                pixelMeta={pixelMeta} setPixelMeta={setPixelMeta}
                pixelGoogle={pixelGoogle} setPixelGoogle={setPixelGoogle}
              />

              {mensagemSucesso && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs font-medium text-center mt-3">
                  🎉 Produto publicado com sucesso na sua vitrine!
                </div>
              )}

              <div className="pt-4 border-t border-zinc-800/80 mt-4">
                {limiteAtingido ? (
                  <button type="button" onClick={() => setShowPricingModal(true)} className="w-full py-2.5 bg-blue-600 font-bold text-xs rounded-lg text-white cursor-pointer">💎 Limite Atingido - Desbloquear Vagas</button>
                ) : (
                  <button type="submit" disabled={!titulo || salvando || !!erroModeracao} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer">
                    {salvando ? "Publicando..." : "Publicar Oferta na Vitrine"}
                  </button>
                )}
              </div>
            </form>
          )}

          <div className="lg:col-span-4 sticky top-4">
            <PreviewCard titulo={titulo} urlImagem={urlImagem} urlVideo={urlVideo} precoDe={precoDe} precoPor={precoPor} textoBotao={textoBotao} />
          </div>
        </div>
      </div>

      {showPricingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-4xl bg-transparent mt-10">
              <button onClick={() => setShowPricingModal(false)} className="absolute -top-10 right-0 text-zinc-400 bg-zinc-900/50 px-4 py-1 rounded-full border border-zinc-700 cursor-pointer">Voltar</button>
              <PricingCard />
            </div>
          </div>
        )}
      </>
    </Suspense>
  );
}