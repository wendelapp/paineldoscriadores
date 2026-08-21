"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

interface PlanoAtualProps {
  isPro: boolean;
  cancelouRenovacao?: boolean; 
}

export default function PlanoAtual({ isPro, cancelouRenovacao = false }: PlanoAtualProps) {
  const [processando, setProcessando] = useState(false);

  const handleUpgrade = async () => {
    setProcessando(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Você precisa estar logado para assinar.");
        setProcessando(false);
        return;
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, email: user.email }),
      });

      const data = await response.json();
      
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert("Erro ao gerar link de pagamento.");
        setProcessando(false);
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao conectar com o servidor de pagamentos.");
      setProcessando(false);
    }
  };

  const handleCancelarAssinatura = async () => {
    const confirmar = confirm(
      "Deseja cancelar sua assinatura PRO?\n\n" +
      "• Você continuará com acesso total aos recursos PRO até o fim do seu ciclo atual (ou fim dos 30 dias grátis).\n" +
      "• Após essa data, sua conta retornará automaticamente para o plano Grátis e não haverá novas cobranças.\n\n" +
      "Confirmar cancelamento?"
    );

    if (confirmar) {
      setProcessando(true);
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, {
            cancelouRenovacao: true,
            dataCancelamento: serverTimestamp(),
          });
          
          alert("Cancelamento programado com sucesso! Você continuará PRO até o fim do ciclo.");
          window.location.reload(); 
        }
      } catch (error) {
        console.error("Erro ao cancelar:", error);
        alert("Erro ao processar sua solicitação.");
        setProcessando(false);
      }
    }
  };

  const handleReativarAssinatura = async () => {
    const confirmar = confirm("Deseja reativar sua assinatura PRO e manter seus benefícios contínuos?");
    
    if (confirmar) {
      setProcessando(true);
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, {
            cancelouRenovacao: false, // Tira o status de cancelamento
          });
          
          alert("Assinatura reativada com sucesso!");
          window.location.reload(); 
        }
      } catch (error) {
        console.error("Erro ao reativar:", error);
        alert("Erro ao processar sua solicitação.");
        setProcessando(false);
      }
    }
  };

  return (
    <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-6 shadow-xl flex flex-col h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>{isPro ? "💎" : "📦"}</span> Plano Atual
          </h3>
          <p className="text-xs font-bold mt-1">
            {isPro ? (
              <span className="text-emerald-400">Status: Ativo (PRO)</span>
            ) : (
              <span className="text-zinc-400">Status: Grátis (Limitado)</span>
            )}
          </p>
        </div>
        <span className={`px-3 py-1 text-[10px] font-black rounded uppercase tracking-widest border ${
          isPro 
            ? "bg-blue-600/20 text-blue-400 border-blue-500/30" 
            : "bg-zinc-800 text-zinc-400 border-zinc-700"
        }`}>
          {isPro ? "PRO" : "GRÁTIS"}
        </span>
      </div>

      {/* RENDERIZAÇÃO INTELIGENTE: SE FOR GRÁTIS */}
      {!isPro && (
        <div className="flex-1 flex flex-col">
          <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
            Seu plano atual permite publicar até <strong>10 produtos</strong> na vitrine, sem acesso às métricas avançadas (Pixels da Meta e Google).
          </p>
          
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800/50 mb-4">
            <p className="text-[11px] text-zinc-400 uppercase tracking-wider font-bold mb-2">Oferta de Upgrade</p>
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm text-white font-medium">3 Primeiros Meses:</span>
              <span className="text-lg text-emerald-400 font-black">R$ 1,99 <span className="text-[10px] text-zinc-500 font-normal">/mês</span></span>
            </div>
            <div className="flex justify-between items-center text-xs text-zinc-500 border-t border-zinc-800/80 pt-2">
              <span>Após os 3 meses:</span>
              <span>R$ 29,90 / mês</span>
            </div>
          </div>

          <button
            onClick={handleUpgrade}
            disabled={processando}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50 mb-3"
          >
            {processando ? "Conectando ao Mercado Pago..." : "🚀 Fazer Upgrade para PRO"}
          </button>
        </div>
      )}

      {/* RENDERIZAÇÃO INTELIGENTE: SE FOR PRO */}
      {isPro && (
        <div className="flex-1 flex flex-col">
          <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
            Você tem <strong>produtos ilimitados</strong> e acesso total aos rastreios (Pixels).
          </p>

          <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800/50 mb-6">
            <div className="flex justify-between items-center text-sm mb-3">
              <span className="text-zinc-400">Plano Ativo:</span>
              <span className="text-white font-bold">CortCut Pro</span>
            </div>
            <div className="flex justify-between items-center text-sm border-t border-zinc-800/80 pt-3">
              <span className="text-zinc-400">Próxima Renovação:</span>
              {cancelouRenovacao ? (
                <span className="text-amber-400 font-bold text-xs">Cancelada (Expira no fim do ciclo)</span>
              ) : (
                <span className="text-zinc-300 font-mono text-xs">Automática (Mercado Pago)</span>
              )}
            </div>
          </div>

          {/* BOTÕES: CANCELAR OU REATIVAR ASSINATURA */}
          <div className="mt-auto pt-4 border-t border-zinc-800/50 flex flex-col gap-3">
            {cancelouRenovacao ? (
              <div className="space-y-3">
                <p className="text-amber-500 text-center text-[11px] font-bold bg-amber-500/10 py-2 rounded-lg border border-amber-500/20">
                  ⚠️ Cancelamento programado.
                </p>
                <button
                  onClick={handleReativarAssinatura}
                  disabled={processando}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {processando ? "Processando..." : "Reativar Assinatura PRO"}
                </button>
              </div>
            ) : (
              <button
                onClick={handleCancelarAssinatura}
                disabled={processando}
                className="w-full py-2.5 bg-transparent border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                {processando ? "Processando..." : "Cancelar Assinatura"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* SELO DE GARANTIA (Visível para ambos) */}
      <div className="mt-4 flex items-center justify-center gap-1.5 opacity-80">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
          Pagamento Seguro (Mercado Pago)
        </span>
      </div>
    </div>
  );
}