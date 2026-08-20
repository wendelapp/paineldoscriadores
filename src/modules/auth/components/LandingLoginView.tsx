"use client";

import React, { useState } from "react";

export default function LandingLoginView() {
  const [modalPlanosAberto, setModalPlanosAberto] = useState(false);

  return (
    <div className="w-full text-white space-y-6 text-center lg:text-left">
      
      {/* COPY DE CONVERSÃO E VALOR */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide uppercase">
        ⚡ Plataforma Definitiva para Criadores
      </div>

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
        Monetize sua audiência com vitrines profissionais de afiliados.
      </h1>

      <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
        Feito sob medida tanto para quem está <strong>começando do zero</strong> quanto para <strong>veteranos</strong> que querem escalar. Tenha total controle e baixo investimento, gerenciando suas ofertas e conversões <strong>tanto pelo PC quanto na palma da mão pelo celular</strong>.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-w-lg mx-auto lg:mx-0">
        <div className="flex items-center gap-3 p-3 bg-zinc-900/50 border border-zinc-800/80 rounded-xl">
          <span className="text-blue-400 text-lg">💻📱</span>
          <span className="text-xs font-medium text-zinc-300">Gestão Completa (PC e Celular)</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-zinc-900/50 border border-zinc-800/80 rounded-xl">
          <span className="text-emerald-400 text-lg">🚀</span>
          <span className="text-xs font-medium text-zinc-300">Baixo Investimento & Alta Performance</span>
        </div>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
        <button
          type="button"
          onClick={() => setModalPlanosAberto(true)}
          className="inline-flex items-center justify-center px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl transition-all border border-zinc-700 shadow-lg cursor-pointer"
        >
          💎 Ver Planos (Grátis e Pro)
        </button>
        <p className="text-[11px] text-zinc-500">Comece grátis. Mude de plano ou cancele a qualquer momento.</p>
      </div>

      {/* MODAL DE COMPARAÇÃO DE PLANOS (INFORMATIVO) */}
      {modalPlanosAberto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">Escolha o plano ideal para o seu momento</h3>
              <p className="text-xs text-zinc-400">Evolua sua estrutura de criador com total transparência e segurança jurídica.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* PLANO GRÁTIS */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 text-[10px] font-bold rounded uppercase">Iniciante</span>
                  <h4 className="text-base font-black text-white">Plano Grátis</h4>
                  <p className="text-2xl font-black text-white">R$ 0 <span className="text-xs font-normal text-zinc-500">/ grátis para sempre</span></p>
                  <ul className="text-xs text-zinc-400 space-y-2 pt-2">
                    <li>✓ Até 10 produtos na vitrine</li>
                    <li>✓ Acesso vitalício ao painel</li>
                    <li>✓ Sistema anti-fraude inclusa</li>
                  </ul>
                </div>
                <div className="pt-2 border-t border-zinc-900">
                  <p className="text-[11px] text-zinc-500 text-center">Ideal para testar sem compromisso</p>
                </div>
              </div>

              {/* PLANO PRO */}
              <div className="bg-linear-to-b from-blue-950/40 to-zinc-950 border border-blue-600/50 rounded-xl p-5 flex flex-col justify-between space-y-4 relative shadow-lg">
                <div className="absolute -top-2.5 right-4 bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Recomendado</div>
                <div className="space-y-2">
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded uppercase">Profissional</span>
                  <h4 className="text-base font-black text-white">Plano Pro</h4>
                  <div className="space-y-0.5">
                    <span className="text-zinc-500 line-through text-[10px] block">De R$ 97,99 por R$ 19,99 / 3 meses</span>
                    <p className="text-xl font-black text-white">R$ 29,99 <span className="text-xs font-normal text-zinc-400">/ mês após promo</span></p>
                  </div>
                  <ul className="text-xs text-zinc-300 space-y-2 pt-2">
                    <li>✓ Produtos ilimitados na vitrine</li>
                    <li>✓ Integração com Pixel (Meta/Google Ads)</li>
                    <li className="text-emerald-400 font-medium">✓ 7 dias de garantia (Lei do Consumidor)</li>
                    <li className="text-emerald-400 font-medium">✓ Cancele a qualquer momento</li>
                  </ul>
                </div>
                <div className="pt-2 border-t border-blue-950 flex items-center justify-center gap-1.5 text-[10px] text-zinc-400 bg-zinc-900/40 py-1.5 rounded border">
                  <span>🔒</span> Pagamento Seguro via <strong>Mercado Pago</strong>
                </div>
              </div>

            </div>

            <div className="text-center pt-2">
              <button 
                type="button"
                onClick={() => setModalPlanosAberto(false)} 
                className="w-full sm:w-auto px-8 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-md"
              >
                Entendido / Fechar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}