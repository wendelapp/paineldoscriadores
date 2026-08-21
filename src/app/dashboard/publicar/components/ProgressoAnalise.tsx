"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";



interface ProgressoAnaliseProps {
  status: "analise" | "aprovado" | "reprovado";
  produtoId?: string;
  userUid?: string;
  dataCriacao?: any;
  motivoReprovacao?: string;
  onVoltarEdicao?: () => void;
}

export default function ProgressoAnalise({ 
  status, 
  produtoId, 
  userUid, 
  dataCriacao, 
  motivoReprovacao, 
  onVoltarEdicao 
}: ProgressoAnaliseProps) {
  
  const calcularTempoInicial = () => {
    if (dataCriacao) {
      const milisCriacao = typeof dataCriacao.toMillis === 'function' ? dataCriacao.toMillis() : new Date(dataCriacao).getTime();
      const agora = Date.now();
      const segundosPassados = Math.floor((agora - milisCriacao) / 1000);
      const restante = 900 - segundosPassados;
      return restante > 0 ? restante : 0;
    }
    return 900;
  };

  const [tempoRestante, setTempoRestante] = useState<number>(calcularTempoInicial);
  const [cancelando, setCancelando] = useState(false);
  const [finalizado, setFinalizado] = useState(false);

  useEffect(() => {
    if (status !== "analise") return;

    const timer = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setFinalizado(true);
          if (produtoId && userUid) {
            updateDoc(doc(db, "users", userUid, "produtos", produtoId), { status: "aprovado" });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, produtoId, userUid]);

  const handleCancelar = async () => {
    // 1. Pergunta primeiro, antes de mexer em qualquer estado visual
    const confirmado = window.confirm("Tem certeza que deseja cancelar esta publicação? O produto será descartado.");
    if (!confirmado) return;

    // 2. Só muda o estado para "Cancelando..." se ele realmente confirmou
    setCancelando(true);

    if (produtoId && userUid) {
      try {
        await deleteDoc(doc(db, "users", userUid, "produtos", produtoId));
        window.location.reload();
      } catch (err) {
        console.error("Erro ao excluir produto:", err);
        setCancelando(false);
      }
    }
  };

  const minutos = Math.floor(tempoRestante / 60);
  const segundos = tempoRestante % 60;
  const tempoFormatado = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
  const progressoPorcentagem = Math.min(100, Math.max(0, ((900 - tempoRestante) / 900) * 100));

  let etapaTexto = "Análise Inicial de Termos e Integridade";
  let etapaCor = "bg-amber-500";
  if (tempoRestante < 600 && tempoRestante >= 300) {
    etapaTexto = "Verificação de Direitos Autorais e Mídia";
    etapaCor = "bg-blue-500";
  } else if (tempoRestante < 300) {
    etapaTexto = "Homologação Final e Inclusão na Vitrine";
    etapaCor = "bg-indigo-500";
  }

  return (
    <div className="lg:col-span-8 bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-8 shadow-xl flex flex-col items-center justify-center space-y-6 text-center min-h-112.5">
      
      {/* ESTADO DE ANÁLISE */}
      {status === "analise" && !finalizado ? (
        <>
          <div className="text-4xl font-mono font-bold text-white tracking-widest">{tempoFormatado}</div>
          
          <div className="w-full max-w-md space-y-2">
            <div className="flex justify-between text-xs font-medium text-zinc-400">
              <span>Status: Em Fila de Auditoria</span>
              <span className="text-amber-400 font-bold">{Math.round(progressoPorcentagem)}%</span>
            </div>
            
            <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
              <div 
                className={`h-full transition-all duration-1000 ${etapaCor}`} 
                style={{ width: `${progressoPorcentagem}%` }}
              ></div>
            </div>

            <p className="text-xs text-zinc-300 font-semibold pt-2">🔄 Etapa Atual: {etapaTexto}</p>
          </div>

          <p className="text-xs text-zinc-500 max-w-sm mt-4">
            Para garantir uma vitrine segura, sua oferta passa por uma checagem automatizada, verificando as diretrizes e termo de uso.
          </p>

          <button
    onClick={handleCancelar}
    disabled={cancelando}
    className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 text-[10px] font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
  >
    {cancelando ? "Cancelando..." : "✕ Cancelar Publicação"}
  </button>
        </>
      ) : (finalizado || status === "aprovado") ? (
        <div className="space-y-4 animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 text-5xl mx-auto">🎉</div>
          <div>
            <h3 className="text-2xl font-black text-white mb-2">Parabéns! Oferta Publicada</h3>
            <p className="text-sm text-zinc-400">A auditoria foi concluída com sucesso e seu produto já está ativo.</p>
          </div>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-emerald-600 rounded-lg text-white font-bold text-xs cursor-pointer">Ver minha vitrine</button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 text-4xl mx-auto">✕</div>
          <div>
            <h3 className="text-2xl font-black text-white mb-2">Oferta Reprovada</h3>
            <p className="text-sm text-zinc-400 max-w-md mx-auto mb-4">{motivoReprovacao || "O conteúdo não cumpriu as diretrizes."}</p>
            {onVoltarEdicao && (
              <button onClick={onVoltarEdicao} className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-lg cursor-pointer">
                Editar Oferta e Enviar Novamente
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}