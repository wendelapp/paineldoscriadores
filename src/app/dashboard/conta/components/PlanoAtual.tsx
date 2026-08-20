"use client";

import { useState } from "react";

interface PlanoAtualProps {
  isPro: boolean;
}

export default function PlanoAtual({ isPro }: PlanoAtualProps) {
  const [processando, setProcessando] = useState(false);

  const handleUpgrade = () => {
    setProcessando(true);
    // Lógica futura para gerar o Pix Copia e Cola / QR Code do Mercado Pago/Asaas
    setTimeout(() => {
      alert("Redirecionando para o pagamento via Pix...");
      setProcessando(false);
    }, 1500);
  };

  const handleCancelarAssinatura = () => {
    const confirmar = confirm(
      "Deseja cancelar sua assinatura PRO?\n\n" +
      "• Se estiver dentro dos 7 dias: Você recebe reembolso automático e volta para o Grátis.\n" +
      "• Após 7 dias: Você usa o plano até o vencimento e não será cobrado novamente.\n\n" +
      "Confirmar cancelamento?"
    );

    if (confirmar) {
      setProcessando(true);
      // Lógica futura para cancelar recorrência no backend
      setTimeout(() => {
        alert("Assinatura cancelada com sucesso. As regras foram aplicadas.");
        setProcessando(false);
      }, 1500);
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
              <span>R$ 29,99 / mês</span>
            </div>
          </div>

          <button
            onClick={handleUpgrade}
            disabled={processando}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50 mb-3"
          >
            {processando ? "Gerando Pix..." : "🚀 Fazer Upgrade para PRO (Via Pix)"}
          </button>
        </div>
      )}

      {/* RENDERIZAÇÃO INTELIGENTE: SE FOR PRO */}
      {isPro && (
        <div className="flex-1 flex flex-col">
          <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
            Você tem <strong>produtos ilimitados</strong> e acesso total aos rastreios (Pixels). Sua assinatura é renovada via Pix Recorrente.
          </p>

          <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800/50 mb-6">
            <div className="flex justify-between items-center text-sm mb-3">
              <span className="text-zinc-400">Valor Mensal:</span>
              <span className="text-white font-bold">R$ 19,99</span>
            </div>
            <div className="flex justify-between items-center text-sm border-t border-zinc-800/80 pt-3">
              <span className="text-zinc-400">Próxima Renovação:</span>
              <span className="text-zinc-300 font-mono text-xs">Aguardando Pagamento Pix</span>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-zinc-800/50 flex justify-between items-center">
            <button
              onClick={handleCancelarAssinatura}
              disabled={processando}
              className="text-xs font-bold text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
            >
              Cancelar Assinatura
            </button>
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
          Garantia de 7 Dias
        </span>
      </div>
    </div>
  );
}