// src/app/dashboard/publicar/page.tsx
"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { analisarLink } from "@/lib/utils/linkValidator";
import { extrairCapaVideo } from "@/lib/utils/videoUtils";
import PreviewCard from "./components/PreviewCard";

export default function PublicarProdutoPage() {
  const [userUid, setUserUid] = useState<string | null>(null);
  
  // Estados do formulário
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserUid(user.uid);
    });
    return () => unsubscribe();
  }, []);

  const handleMudancaLink = (e: React.ChangeEvent<HTMLInputElement>) => {
    const novoLink = e.target.value;
    setUrlAfiliado(novoLink);
    setStatusLink(analisarLink(novoLink));
  };

  const handleBlurVideo = () => {
    if (!urlImagem) {
      const capaAuto = extrairCapaVideo(urlVideo);
      if (capaAuto) {
        setUrlImagem(capaAuto);
      }
    }
  };

  const handlePublicar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusLink.valido || !userUid || !titulo) return;

    setSalvando(true);
    try {
      await addDoc(collection(db, "produtos"), {
        userId: userUid,
        titulo,
        urlAfiliado,
        urlVideo,
        urlImagem,
        precoDe,
        precoPor,
        textoBotao,
        dataPublicacao: serverTimestamp(),
        ativo: true
      });

      setMensagemSucesso(true);
      setTitulo("");
      setUrlAfiliado("");
      setUrlVideo("");
      setUrlImagem("");
      setStatusLink({ valido: false, mensagem: "" });
      
      setTimeout(() => setMensagemSucesso(false), 4000);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao publicar o produto.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-6">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white tracking-tight">Publicar Oferta na Vitrine</h2>
        <p className="text-xs text-zinc-400">
          Cadastre sua oferta com gatilho de preço e prévia em tempo real de forma rápida e organizada.
        </p>
      </div>

      {/* Grid Principal: Formulário (Esquerda) e Prévia (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* FORMULÁRIO (OCUPA 8 COLUNAS) */}
        <form onSubmit={handlePublicar} className="lg:col-span-8 bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-4 shadow-xl space-y-3">
          
          {/* Título & Link lado a lado para economizar altura */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-zinc-300 mb-1">Título do Produto</label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Smartwatch Ultra Série 9"
                maxLength={60}
                className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700/80 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-zinc-300 mb-1">Link de Afiliado ou Oferta (URL)</label>
              <input
                type="url"
                value={urlAfiliado}
                onChange={handleMudancaLink}
                placeholder="https://mercadolivre.com.br/..."
                className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700/80 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
              {statusLink.mensagem && (
                <p className={`mt-0.5 text-[10px] font-medium ${statusLink.valido ? "text-emerald-400" : "text-rose-400"}`}>
                  {statusLink.mensagem}
                </p>
              )}
            </div>
          </div>

          {/* Mídias: Imagem e Vídeo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-zinc-300 mb-1">Link da Imagem do/produto/capa (URL)</label>
              <input
                type="url"
                value={urlImagem}
                onChange={(e) => setUrlImagem(e.target.value)}
                placeholder="https://exemplo.com/foto.jpg"
                className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700/80 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-zinc-300 mb-1">Link do Vídeo (Seu Canal/youtube)</label>
              <input
                type="url"
                value={urlVideo}
                onChange={(e) => setUrlVideo(e.target.value)}
                onBlur={handleBlurVideo}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700/80 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Preços e Botão */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-zinc-300 mb-1">Preço "De" (R$)</label>
              <input
                type="text"
                value={precoDe}
                onChange={(e) => setPrecoDe(e.target.value)}
                placeholder="97,00"
                className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700/80 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-zinc-300 mb-1">Preço "Por" (R$)</label>
              <input
                type="text"
                value={precoPor}
                onChange={(e) => setPrecoPor(e.target.value)}
                placeholder="29,00"
                className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700/80 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-zinc-300 mb-1">Texto do Botão de Ação</label>
              <input
                type="text"
                value={textoBotao}
                onChange={(e) => setTextoBotao(e.target.value)}
                placeholder="Ex: 🔥 Garanta com Desconto"
                className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700/80 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          {mensagemSucesso && (
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs font-medium text-center">
              🎉 Produto publicado com sucesso na sua vitrine!
            </div>
          )}

          <button
            type="submit"
            disabled={!statusLink.valido || !titulo || salvando}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer mt-1"
          >
            {salvando ? "Publicando na Vitrine..." : "Publicar Oferta na Vitrine"}
          </button>
        </form>

        {/* PRÉVIA AO VIVO (OCUPA 4 COLUNAS NA DIREITA) */}
        <div className="lg:col-span-4 sticky top-4">
          <PreviewCard 
            titulo={titulo} 
            urlImagem={urlImagem}
            urlVideo={urlVideo} // <--- Adicione esta linha! 
            precoDe={precoDe} 
            precoPor={precoPor} 
            textoBotao={textoBotao} 
          />
        </div>

      </div>
    </div>
  );
}