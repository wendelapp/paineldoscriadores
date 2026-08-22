"use client";

import React, { useState } from "react";

export default function LandingLoginView() {
  const [modalPlanosAberto, setModalPlanosAberto] = useState(false);

  return (
    <div className="w-full text-white space-y-6 text-center lg:text-left relative overflow-hidden">
      
      {/* 🏷️ LOGO / MARCA NO TOPO ESQUERDA */}
      <div className="flex items-center justify-center lg:justify-start gap-2.5 pb-2">
        <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-600/30 border border-blue-400/30">
          <span className="text-white font-black text-base">⚡</span>
        </div>
        <div className="text-left">
          <span className="text-lg font-black tracking-tight bg-linear-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Criador<span className="text-blue-500">Link</span>
          </span>
          <span className="block text-[9px] uppercase tracking-widest text-zinc-500 font-semibold -mt-1">
            Vitrines & Afiliados
          </span>
        </div>
      </div>

      {/* 🌟 GLOW DE FUNDO EM DEGRADÉ (DÁ VIDA À LANDING PAGE) */}
      <div className="absolute -top-20 left-1/2 lg:left-0 -translate-x-1/2 lg:translate-x-0 w-72 h-72 bg-linear-to-tr from-blue-600/30 via-indigo-500/20 to-emerald-500/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />

      {/* BADGE DE DESTAQUE */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-linear-to-r from-blue-500/10 via-indigo-500/10 to-emerald-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-wide uppercase shadow-lg shadow-blue-950/50">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        ⚡ Plataforma Definitiva para Afiliados e Criadores
      </div>

      {/* TÍTULO COM DEGRADÉ VIBRANTE */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15]">
        Monetize sua audiência com{" "}
        <span className="bg-linear-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-sm">
          vitrines profissionais
        </span>{" "}
        de alto padrão.
      </h1>

      {/* DESCRIÇÃO ENVOLVENTE */}
      <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
        Crie sua estrutura de conversão em segundos e divulgue produtos das maiores plataformas do mercado com total segurança jurídica:{" "}
        <span className="text-blue-400 font-semibold">Mercado Livre</span>,{" "}
        <span className="text-amber-400 font-semibold">Shopee</span>,{" "}
        <span className="text-orange-400 font-semibold">Amazon</span>,{" "}
        <span className="text-emerald-400 font-semibold">Hotmart</span>,{" "}
        <span className="text-sky-400 font-semibold">Magazine Luiza</span> e muito mais!{" "}
        Tudo <strong>100% legalizado e autorizado</strong>.
      </p>

      {/* CARD DE DESTAQUE DAS PLATAFORMAS */}
      <div className="py-2 flex flex-wrap items-center justify-center lg:justify-start gap-2 max-w-lg mx-auto lg:mx-0">
        <span className="px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-300 font-medium shadow-sm">🛒 Mercado Livre</span>
        <span className="px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-300 font-medium shadow-sm">📦 Shopee</span>
        <span className="px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-300 font-medium shadow-sm">🚀 Amazon</span>
        <span className="px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-300 font-medium shadow-sm">🔥 Hotmart</span>
        <span className="px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-300 font-medium shadow-sm">magazine luiza</span>
      </div>

      {/* BLOCOS DE BENEFÍCIOS RÁPIDOS COM ÍCONES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 max-w-lg mx-auto lg:mx-0">
        <div className="flex items-center gap-3 p-3.5 bg-linear-to-r from-zinc-900/80 to-zinc-950 border border-zinc-800/80 rounded-2xl shadow-md">
          <span className="text-blue-400 text-lg bg-blue-500/10 p-2 rounded-xl border border-blue-500/20">💻📱</span>
          <div className="text-left">
            <p className="text-xs font-bold text-white">Gestão Omnichannel</p>
            <p className="text-[11px] text-zinc-400">Gerencie pelo PC ou Celular</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3.5 bg-linear-to-r from-zinc-900/80 to-zinc-950 border border-zinc-800/80 rounded-2xl shadow-md">
          <span className="text-emerald-400 text-lg bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">🛡️</span>
          <div className="text-left">
            <p className="text-xs font-bold text-white">Anti-Fraude Nativo</p>
            <p className="text-[11px] text-zinc-400">Proteção total para seu negócio</p>
          </div>
        </div>
      </div>

      {/* BOTÃO DE CHAMADA PARA AÇÃO (CTA) */}
      <div className="pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
        <button
          type="button"
          onClick={() => setModalPlanosAberto(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white font-black text-xs sm:text-sm rounded-2xl transition-all duration-300 shadow-xl shadow-blue-900/40 border border-blue-400/30 cursor-pointer transform hover:-translate-y-0.5"
        >
          💎 Ver Planos (Grátis para Sempre & Pro)
        </button>
        <p className="text-[11px] text-zinc-400 font-medium">✨ Comece grátis. Sem fidelidade.</p>
      </div>

      {/* MODAL DE COMPARAÇÃO DE PLANOS */}
      {modalPlanosAberto && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            <div className="text-center space-y-2">
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-500/20">
                Transparência e Flexibilidade
              </span>
              <h3 className="text-xl font-black text-white">Escolha o plano ideal para o seu momento</h3>
              <p className="text-xs text-zinc-400">Evolua sua estrutura de criador com segurança jurídica e alta conversão.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* PLANO GRÁTIS */}
              <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-lg">
                <div className="space-y-3">
                  <span className="px-2.5 py-1 bg-zinc-800 text-zinc-300 text-[10px] font-bold rounded-full uppercase tracking-wider">Iniciante</span>
                  <h4 className="text-lg font-black text-white">Plano Grátis</h4>
                  <p className="text-2xl font-black text-white">R$ 0 <span className="text-xs font-normal text-zinc-400">/ Para Sempre</span></p>
                  <ul className="text-xs text-zinc-300 space-y-2.5 pt-2">
                    <li className="flex items-center gap-2"><span>✓</span> Até 10 produtos na vitrine</li>
                    <li className="flex items-center gap-2"><span>✓</span> Acesso vitalício ao painel</li>
                    <li className="flex items-center gap-2"><span>✓</span> Sistema anti-fraude incluso</li>
                    <li className="flex items-center gap-2"><span className="text-blue-400">✓</span> Integração com Redes Sociais</li>
                     <li className="flex items-center gap-2"><span className="text-blue-400">✓</span> Marca d'água</li>
                  </ul>
                </div>
                <div className="pt-3 border-t border-zinc-900">
                  <p className="text-[11px] text-zinc-400 text-center font-medium">Ótimo para testar sem compromisso</p>
                </div>
              </div>

              {/* PLANO PRO */}
              <div className="bg-linear-to-b from-blue-950/50 via-zinc-950 to-zinc-950 border border-blue-600/60 rounded-2xl p-5 flex flex-col justify-between space-y-4 relative shadow-2xl">
                <div className="absolute -top-3 right-5 bg-blue-600 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-md">Recomendado</div>
                <div className="space-y-3">
                  <span className="px-2.5 py-1 bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded-full uppercase tracking-wider">Profissional</span>
                  <h4 className="text-lg font-black text-white">Plano Pro</h4>
                  <div className="space-y-0.5">
                    <p className="text-xl font-black text-white">R$ 19,99 <span className="text-[11px] font-normal text-zinc-400">/mês nos 3 primeiros meses</span></p>
                    <span className="text-zinc-500 text-[10px] block">Depois R$ 29,90 / mês</span>
                  </div>
                  <ul className="text-xs text-zinc-200 space-y-2.5 pt-1">
                     <li className="flex items-center gap-2"><span className="text-blue-400">✓</span> Produtos Ilimitados na Vitrine</li>
                <li className="flex items-center gap-2"><span className="text-blue-400">✓</span> Métricas Avançadas de Cliques e Visitas</li>
                <li className="flex items-center gap-2"><span className="text-blue-400">✓</span> Integração Avançada com Pixel (Meta/Google)</li>
                <li className="flex items-center gap-2"><span className="text-blue-400">✓</span> Integração com Redes Sociais</li>
                <li className="flex items-center gap-2"><span className="text-blue-400">✓</span> Remoção total da Marca d'água</li>
                    <li className="text-emerald-400 font-semibold flex items-center gap-2"><span>✓</span> 7 dias de garantia (CDC)</li>
                    <li className="text-emerald-400 font-semibold flex items-center gap-2"><span>✓</span> Cancele a qualquer momento</li>
                  </ul>
                </div>
                <div className="pt-3 border-t border-blue-950/60 flex items-center justify-center gap-1.5 text-[10px] text-zinc-300 bg-zinc-900/60 py-2 rounded-xl border">
                  <span>🔒</span> Pagamento Seguro via <strong>Mercado Pago</strong>
                </div>
              </div>

            </div>

            <div className="text-center pt-2">
              <button 
                type="button"
                onClick={() => setModalPlanosAberto(false)} 
                className="w-full sm:w-auto px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-md"
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