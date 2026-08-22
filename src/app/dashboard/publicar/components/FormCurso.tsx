"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { analisarLink } from "@/lib/utils/linkValidator";
import { moderarConteudo } from "@/lib/utils/contentModerator";
import ProgressoAnalise from "./ProgressoAnalise";
import ProTrackingFields from "./ProTrackingFields";
import PricingCard from "@/modules/auth/subscription/PricingCard";
import { useSearchParams } from 'next/navigation';

export default function FormCurso() {
  const [userUid, setUserUid] = useState<string | null>(null);
  
  // Campos focados em CONVERSÃO DE INFOPRODUTO (Presell)
  const [titulo, setTitulo] = useState("");
  const [urlAfiliado, setUrlAfiliado] = useState("");
  const [urlImagem, setUrlImagem] = useState("");
  const [promessa, setPromessa] = useState("");
  const [beneficio1, setBeneficio1] = useState("");
  const [beneficio2, setBeneficio2] = useState("");
  const [textoBotao, setTextoBotao] = useState("Quero Garantir Minha Vaga ➜");
  
  const [statusLink, setStatusLink] = useState({ valido: false, mensagem: "" });
  const [salvando, setSalvando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState(false);

  const [isPro, setIsPro] = useState(false);
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [pixelMeta, setPixelMeta] = useState("");
  const [pixelGoogle, setPixelGoogle] = useState("");

  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [statusAnalise, setStatusAnalise] = useState<"livre" | "analisando" | "aprovado">("livre");
  const [erroModeracao, setErroModeracao] = useState("");
  const [produtoEmAnaliseId, setProdutoEmAnaliseId] = useState<string | null>(null);
  const [produtoEmAnaliseDataCriacao, setProdutoEmAnaliseDataCriacao] = useState<any>(null);
  const [carregandoFila, setCarregandoFila] = useState(true);

  // 1. VERIFICA FILA DE ANÁLISE (ISOLADO APENAS PARA CURSOS)
  useEffect(() => {
    const verificarFilaAnalise = async () => {
      if (!userUid) return;
      setCarregandoFila(true);
      try {
        const produtosRef = collection(db, "users", userUid, "produtos");
        const snapshot = await getDocs(produtosRef);
        let produtoEncontrado = false;

        for (const produtoDoc of snapshot.docs) {
          const dados = produtoDoc.data();
          // 🚨 FILTRO: Só mostra a barra se for do tipo 'curso'
          if (dados.status === "analise" && dados.tipo === "curso") {
            const tempoCriacao = dados.dataCriacao?.toMillis?.() || Date.now();
            const diferencaMinutos = (Date.now() - tempoCriacao) / (1000 * 60);

            if (diferencaMinutos >= 16) { 
              await updateDoc(doc(db, "users", userUid, "produtos", produtoDoc.id), { status: "ativo" });
            } else {
              setProdutoEmAnaliseId(produtoDoc.id);
              setProdutoEmAnaliseDataCriacao(dados.dataCriacao);
              setStatusAnalise("analisando");
              produtoEncontrado = true;
            }
          }
        }
        if (!produtoEncontrado) setStatusAnalise("livre");
      } catch (error) {
        console.error(error);
      } finally {
        setCarregandoFila(false);
      }
    };
    verificarFilaAnalise();
  }, [userUid]);

  // 2. AUTH & LIMITES
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserUid(user.uid);
        const userSnap = await getDoc(doc(db, "users", user.uid));
        if (userSnap.exists()) setIsPro(userSnap.data().isPro || false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const contarProdutos = async () => {
      if (!userUid) return;
      const snapshot = await getDocs(collection(db, "users", userUid, "produtos"));
      setTotalProdutos(snapshot.size);
    };
    contarProdutos();
  }, [userUid]);

  // 3. RASCUNHO SEPARADO (Para não misturar com o Produto Físico)
  useEffect(() => {
    if (!editId && typeof window !== 'undefined') {
      const rascunho = localStorage.getItem("@criadordelink:rascunhoCurso");
      if (rascunho) {
        const dados = JSON.parse(rascunho);
        if (dados.titulo) setTitulo(dados.titulo);
        if (dados.urlAfiliado) setUrlAfiliado(dados.urlAfiliado);
        if (dados.urlImagem) setUrlImagem(dados.urlImagem);
        if (dados.promessa) setPromessa(dados.promessa);
        if (dados.beneficio1) setBeneficio1(dados.beneficio1);
        if (dados.beneficio2) setBeneficio2(dados.beneficio2);
        if (dados.textoBotao) setTextoBotao(dados.textoBotao);
      }
    }
  }, [editId]);

  useEffect(() => {
    if (!editId && titulo.length > 0 && typeof window !== 'undefined') {
      const rascunho = { titulo, urlAfiliado, urlImagem, promessa, beneficio1, beneficio2, textoBotao };
      localStorage.setItem("@criadordelink:rascunhoCurso", JSON.stringify(rascunho));
    }
  }, [titulo, urlAfiliado, urlImagem, promessa, beneficio1, beneficio2, textoBotao, editId]);

  const handleMudancaLink = (e: React.ChangeEvent<HTMLInputElement>) => {
    const novoLink = e.target.value;
    setUrlAfiliado(novoLink);
    setStatusLink(analisarLink(novoLink));
  };

  useEffect(() => {
    if (titulo || urlAfiliado) {
      const analise = moderarConteudo(titulo, urlAfiliado);
      setErroModeracao(analise.aprovado ? "" : analise.motivo);
    }
  }, [titulo, urlAfiliado]);

  // 4. PUBLICAR CURSO
  const handlePublicar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userUid || !titulo) return;

    setSalvando(true);
    const snapshotAtual = await getDocs(collection(db, "users", userUid, "produtos"));
    if (!isPro && snapshotAtual.size >= 10) {
      alert("Você atingiu o limite de 10 itens no plano grátis.");
      setShowPricingModal(true);
      setSalvando(false);
      return;
    }

    try {
      const dadosCurso = {
        titulo,
        urlAfiliado,
        urlImagem,
        promessa,
        beneficios: [beneficio1, beneficio2].filter(Boolean),
        textoBotao,
        pixelMeta: isPro ? pixelMeta : "",
        pixelGoogle: isPro ? pixelGoogle : "",
        tipo: "curso", // 👈 IDENTIFICADOR DE CURSO
        dataPublicacao: serverTimestamp(),
        ativo: true
      };

      if (editId) {
        await updateDoc(doc(db, "users", userUid, "produtos", editId), dadosCurso);
        alert("Curso atualizado com sucesso!");
      } else {
        await addDoc(collection(db, "users", userUid, "produtos"), {
          ...dadosCurso,
          status: "analise",
          dataCriacao: serverTimestamp(),
          visualizacoes: 0,
          cliques: 0
        });
        setStatusAnalise("analisando");
        return;
      }
      
      setTitulo(""); setUrlAfiliado(""); setUrlImagem(""); setPromessa(""); setBeneficio1(""); setBeneficio2("");
      localStorage.removeItem("@criadordelink:rascunhoCurso");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar curso.");
    } finally {
      setSalvando(false);
    }
  };

  const limiteAtingido = !isPro && totalProdutos >= 10;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* CONTROLE DE FILA */}
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
        ) : (
          <form onSubmit={handlePublicar} className="lg:col-span-8 bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-4 shadow-xl space-y-3">
            <div className="border-b border-zinc-800/60 pb-2 mb-2">
              <h2 className="text-sm font-bold text-emerald-400">Configurar Presell (Alta Conversão)</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-zinc-300 mb-1">Nome do Curso</label>
                <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Método Fórmula Online" className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700/80 rounded-lg text-white" required disabled={limiteAtingido} />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-zinc-300 mb-1">Link de Afiliado (Hotmart/KWP)</label>
                <input type="url" value={urlAfiliado} onChange={handleMudancaLink} placeholder="https://..." className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700/80 rounded-lg text-white" required disabled={limiteAtingido} />
                {erroModeracao && <p className="mt-0.5 text-[10px] font-medium text-rose-400">{erroModeracao}</p>}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-300 mb-1">Headline / Promessa Principal</label>
              <input type="text" value={promessa} onChange={(e) => setPromessa(e.target.value)} placeholder="Ex: Aprenda a faturar em dólar trabalhando do celular" className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700/80 rounded-lg text-white focus:border-emerald-500" required disabled={limiteAtingido} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-zinc-300 mb-1">Benefício 1</label>
                <input type="text" value={beneficio1} onChange={(e) => setBeneficio1(e.target.value)} placeholder="Ex: Acesso Vitalício" className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700/80 rounded-lg text-white" disabled={limiteAtingido} />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-zinc-300 mb-1">Benefício 2</label>
                <input type="text" value={beneficio2} onChange={(e) => setBeneficio2(e.target.value)} placeholder="Ex: Suporte VIP" className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700/80 rounded-lg text-white" disabled={limiteAtingido} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-zinc-300 mb-1">Capa do Curso (URL da Imagem)</label>
                <input type="url" value={urlImagem} onChange={(e) => setUrlImagem(e.target.value)} placeholder="https://..." className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700/80 rounded-lg text-white" required disabled={limiteAtingido} />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-zinc-300 mb-1">Texto do Botão</label>
                <input type="text" value={textoBotao} onChange={(e) => setTextoBotao(e.target.value)} placeholder="Ex: Quero Garantir minha Vaga" className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700/80 rounded-lg text-white" required disabled={limiteAtingido} />
              </div>
            </div>

            <ProTrackingFields isPro={isPro} onUpgradeClick={() => setShowPricingModal(true)} pixelMeta={pixelMeta} setPixelMeta={setPixelMeta} pixelGoogle={pixelGoogle} setPixelGoogle={setPixelGoogle} />

            <div className="pt-4 border-t border-zinc-800/80 mt-4">
              {limiteAtingido ? (
                <button type="button" onClick={() => setShowPricingModal(true)} className="w-full py-2.5 bg-emerald-600 font-bold text-xs rounded-lg text-white cursor-pointer">💎 Limite Atingido - Desbloquear Vagas</button>
              ) : (
                <button type="submit" disabled={!titulo || salvando || !!erroModeracao} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer">
                  {salvando ? "Publicando Curso..." : "🚀 Publicar Curso (Presell)"}
                </button>
              )}
            </div>
          </form>
        )}

        {/* PRÉVIA DO PRESELL */}
        <div className="lg:col-span-4 sticky top-4">
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 flex justify-center">
              Prévia da Vitrine (Curso)
            </span>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3 shadow-md">
              <div className="w-full h-36 bg-zinc-800 rounded-lg overflow-hidden flex items-center justify-center border border-zinc-700/50">
                {urlImagem ? <img src={urlImagem} alt="Capa" className="w-full h-full object-cover" /> : <span className="text-xs text-zinc-500">Capa do Curso</span>}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white line-clamp-1">{titulo || "Nome do Curso"}</h3>
                <p className="text-[11px] text-zinc-300 font-medium leading-snug">{promessa || "Promessa transformadora..."}</p>
              </div>
              <div className="space-y-1 pt-1">
                {beneficio1 && <p className="text-[10px] text-emerald-400 flex items-center gap-1.5"><span>✓</span> {beneficio1}</p>}
                {beneficio2 && <p className="text-[10px] text-emerald-400 flex items-center gap-1.5"><span>✓</span> {beneficio2}</p>}
              </div>
              <button className="w-full py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-lg shadow-md cursor-pointer">
                {textoBotao || "Quero Garantir Minha Vaga"}
              </button>
            </div>
          </div>
        </div>

      </div>

      {showPricingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-transparent mt-10">
            <button onClick={() => setShowPricingModal(false)} className="absolute -top-10 right-0 text-zinc-400 bg-zinc-900/50 px-4 py-1 rounded-full border border-zinc-700">Voltar</button>
            <PricingCard />
          </div>
        </div>
      )}
    </div>
  );
}