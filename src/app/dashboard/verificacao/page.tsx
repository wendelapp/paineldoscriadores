// src/app/dashboard/verificacao/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, db } from "@/lib/firebase"; 
import { doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function VerificacaoPage() {
  const router = useRouter();
  
  // Controle de qual tela mostrar (1 = Informativa, 2 = Desafio do Código)
  const [etapa, setEtapa] = useState<1 | 2>(1);
  
  const [codigoDesafio, setCodigoDesafio] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [verificando, setVerificando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);
  const [userUid, setUserUid] = useState<string | null>(null);

  // Função para gerar um código aleatório novo
  const gerarNovoCodigo = () => {
    const novoCodigo = "CORTCUT-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    setCodigoDesafio(novoCodigo);
  };

  useEffect(() => {
    gerarNovoCodigo(); // Gera o primeiro código quando a página carrega

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserUid(user.uid);
    });
    return () => unsubscribe();
  }, []);

  const handleCopiarCodigo = () => {
    navigator.clipboard.writeText(codigoDesafio);
    alert("Código copiado! Cole na descrição do seu vídeo.");
  };

  const handleVerificar = async () => {
    if (!youtubeUrl) {
      setMensagem({ tipo: "erro", texto: "Por favor, cole o link do vídeo do YouTube." });
      return;
    }

    setVerificando(true);
    setMensagem(null);

    try {
      const resposta = await fetch("/api/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: youtubeUrl, codigo: codigoDesafio }),
      });

      const dados = await resposta.json();

      if (resposta.ok && dados.verificado) {
        if (userUid) {
          await updateDoc(doc(db, "users", userUid), {
            isVerified: true,
            youtubeCanal: youtubeUrl
          });
        }
        setMensagem({ tipo: "sucesso", texto: "Canal verificado com sucesso! Selo ativado." });
        setTimeout(() => router.push("/dashboard/publicar"), 2000);
      } else {
        setMensagem({ tipo: "erro", texto: dados.error || "Código não encontrado. Verifique se salvou a descrição do vídeo." });
      }
    } catch (error) {
      setMensagem({ tipo: "erro", texto: "Erro ao conectar com o servidor da API do YouTube." });
    } finally {
      setVerificando(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-12 space-y-6">
      
      {/* Botão de Voltar Dinâmico */}
      {etapa === 1 ? (
        <Link 
          href="/dashboard/perfil"
          className="inline-flex items-center text-xs font-bold text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          ← Voltar para o Perfil
        </Link>
      ) : (
        <button 
          onClick={() => setEtapa(1)}
          className="inline-flex items-center text-xs font-bold text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer bg-transparent border-none p-0"
        >
          ← Voltar
        </button>
      )}

      {/* ETAPA 1: TELA INFORMATIVA (VISUAL BONITÃO) */}
      {etapa === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Verificação de Criador</h2>
            <p className="text-xs text-zinc-400 mb-6">
              Vincule seu canal do YouTube para provar sua identidade e desbloquear a publicação de produtos.
            </p>
          </div>

          <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-8 shadow-xl text-center">
            <div className="w-20 h-20 mx-auto bg-rose-500/10 rounded-full flex items-center justify-center mb-6 border border-rose-500/20">
              <span className="text-4xl">▶️</span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">Conecte seu Canal do YouTube</h3>
            <p className="text-sm text-zinc-400 max-w-lg mx-auto mb-8">
              O CortCut exige a verificação do canal para manter a plataforma segura e livre de fraudes. 
              Isso garante que apenas criadores reais possam divulgar links de afiliados.
            </p>

            <div className="space-y-4 max-w-sm mx-auto">
              <button
                onClick={() => setEtapa(2)}
                className="w-full py-3.5 px-4 bg-white hover:bg-zinc-200 text-black text-sm font-black rounded-lg transition-colors flex items-center justify-center gap-3 cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
                </svg>
                Iniciar Verificação
              </button>
              <p className="text-[10px] text-zinc-500 font-medium">
                Nós não postaremos nada no seu canal. Apenas verificaremos sua identidade.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ETAPA 2: DESAFIO DO CÓDIGO */}
      {etapa === 2 && (
        <div className="animate-in fade-in slide-in-from-right-8 duration-300">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Selo de Verificação Oficial</h2>
            <p className="text-xs text-zinc-400 mb-6">
              Para proteger seu perfil e provar que você é dono do canal, complete o desafio abaixo.
            </p>
          </div>

          <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-8 shadow-xl">
            <div className="space-y-8">
              
              {/* Passo 1 - Com botão de gerar novo código */}
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center font-black shrink-0 border border-blue-500/30">
                  1
                </div>
                <div className="w-full">
                  <h3 className="text-sm font-bold text-white mb-1">Copie seu código exclusivo</h3>
                  <p className="text-xs text-zinc-400 mb-3">Este código prova que esta conta do CortCut pertence a você.</p>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden grow">
                      <span className="px-4 py-3 bg-zinc-900 text-emerald-400 font-mono text-sm tracking-widest font-bold grow select-all flex items-center">
                        {codigoDesafio}
                      </span>
                      <button 
                        onClick={handleCopiarCodigo}
                        className="px-5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Copiar
                      </button>
                    </div>
                    {/* Botão de Atualizar Código */}
                    <button 
                      onClick={gerarNovoCodigo}
                      title="Gerar novo código"
                      className="px-4 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      <span>🔄</span> Gerar Novo
                    </button>
                  </div>
                </div>
              </div>

              {/* Passo 2 */}
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center font-black shrink-0 border border-blue-500/30">
                  2
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">Cole na descrição de um vídeo</h3>
                  <p className="text-xs text-zinc-400">
                    Vá até o seu canal do YouTube, escolha um vídeo seu (pode ser Público ou Não Listado) e cole o código acima na descrição do vídeo e salve.
                  </p>
                </div>
              </div>

              {/* Passo 3 */}
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center font-black shrink-0 border border-blue-500/30">
                  3
                </div>
                <div className="w-full">
                  <h3 className="text-sm font-bold text-white mb-1">Informe o link do vídeo e verifique</h3>
                  <p className="text-xs text-zinc-400 mb-3">Cole abaixo a URL do vídeo onde você colocou o código.</p>
                  
                  <input
                    type="text"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="Ex: https://youtube.com/watch?v=..."
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-colors mb-4"
                  />

                  {mensagem && (
                    <div className={`p-3 rounded-lg mb-4 text-xs font-bold ${mensagem.tipo === 'sucesso' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                      {mensagem.tipo === 'sucesso' ? '✅ ' : '⚠️ '} 
                      {mensagem.texto}
                    </div>
                  )}

                  <button
                    onClick={handleVerificar}
                    disabled={verificando}
                    className="w-full py-3.5 px-4 bg-white hover:bg-zinc-200 text-black text-sm font-black rounded-lg transition-colors flex items-center justify-center gap-3 cursor-pointer disabled:opacity-70"
                  >
                    {verificando ? "Conectando com YouTube..." : "Verificar Canal Agora"}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}