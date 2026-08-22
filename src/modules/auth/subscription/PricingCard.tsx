"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function PricingCard() {
  const router = useRouter();
  const [welcomeModal, setWelcomeModal] = useState<'gratis' | 'pro' | null>(null);

  const irParaPainelGratis = () => {
    setWelcomeModal('gratis');
  };

  const entrarNoPainel = () => {
    setWelcomeModal(null);
    router.push("/dashboard");
  };

  const assinarPro = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Você precisa estar logado para assinar.");
        return;
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, email: user.email }),
      });

      const data = await response.json();
      
      if (data.init_point) {
        // Redireciona para o Checkout Pro do Mercado Pago
        window.location.href = data.init_point;
      } else {
        alert("Erro ao gerar link de pagamento.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao conectar com o servidor de pagamentos.");
    }
  };

  return (
    <>
      {/* Container com pt-16 no mobile para garantir que o título nunca fique cortado no topo */}
      <div className="w-full max-w-4xl mx-auto p-4 pt-16 md:pt-8 animate-in fade-in duration-300">
        {/* --- BOTÃO VOLTAR --- */}
        <div className="flex justify-end mb-4 md:mb-0 md:-mt-4 relative z-10">
          <button 
            onClick={() => router.push("/dashboard")} 
            className="text-zinc-400 hover:text-white text-xs md:text-sm flex items-center gap-2 cursor-pointer transition-colors bg-zinc-900/80 px-4 py-1.5 rounded-full border border-zinc-800 hover:bg-zinc-800"
          >
            ✕ Voltar
          </button>
        </div>
        
        {/* Título responsivo */}
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-xl md:text-3xl font-black text-white tracking-tight leading-snug px-2">
            Escolha o plano ideal para você
          </h2>
          <p className="text-zinc-400 text-xs md:text-sm">Comece grátis ou escale suas vendas com o Pro.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* LADO ESQUERDO: PLANO GRÁTIS */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 md:p-6 flex flex-col justify-between shadow-lg">
            <div>
              <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-[10px] font-bold rounded-full uppercase tracking-wider">
                Iniciante
              </span>
              <h3 className="text-lg md:text-xl font-bold text-white mt-4">Plano Grátis</h3>
              <div className="mt-2 mb-6 flex items-baseline">
                <span className="text-3xl md:text-4xl font-black text-white">R$ 0</span>
                <span className="text-zinc-500 ml-2 text-xs md:text-sm font-medium">/ Para Sempre (ótimo para testar)</span>
              </div>
              
              <h4 className="text-[11px] md:text-xs font-bold text-zinc-300 mb-3 uppercase tracking-wider">O que está incluso:</h4>
              <ul className="text-xs md:text-sm text-zinc-400 space-y-3 mb-6">
                <li className="flex items-center gap-2"><span>✓</span> Até 10 produtos publicados na vitrine</li>
                <li className="flex items-center gap-2"><span>✓</span> Integração com Redes Sociais (Link na Bio)</li>
                <li className="flex items-center gap-2"><span>✓</span> Proteção anti-fraude na auditoria</li>
                <li className="flex items-center gap-2 text-zinc-500"><span>💡</span> Gerencie ou delete produtos quando quiser</li>
              </ul>
            </div>

            <button 
              onClick={irParaPainelGratis}
              className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs md:text-sm rounded-xl transition-colors cursor-pointer border border-zinc-700 mt-4"
            >
              Começar Grátis Agora
            </button>
          </div>

          {/* LADO DIREITO: PLANO PRO */}
          <div className="bg-linear-to-b from-blue-950/40 to-zinc-950 border border-blue-600/50 rounded-2xl p-5 md:p-6 flex flex-col justify-between shadow-2xl relative">
            <div className="absolute -top-3 right-6 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
              Recomendado
            </div>
            
            <div>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
                Profissional
              </span>
              <h3 className="text-lg md:text-xl font-bold text-white mt-4">CortCut Pro</h3>
              <div className="mt-2 mb-3">
                <div className="text-xl md:text-2xl font-black text-white">R$ 19,90 <span className="text-xs font-normal text-zinc-400">/mês nos 3 primeiros meses</span></div>
                <div className="mt-1 text-xs font-medium space-y-0.5">
                  <p className="text-blue-400">🔥 Depois: R$ 29,90/mês</p>
                  <p className="text-zinc-500">Economize com a oferta de lançamento</p>
                </div>
              </div>
              <p className="text-emerald-400 text-[11px] font-medium mb-5">✓ Sem fidelidade. Cancele quando quiser.</p>
              
              <h4 className="text-[11px] md:text-xs font-bold text-white mb-3 uppercase tracking-wider">Benefícios Premium (Painel Completo):</h4>
              <ul className="text-xs md:text-sm text-zinc-300 space-y-3 mb-6">
                <li className="flex items-center gap-2"><span className="text-blue-400">✓</span> Produtos Ilimitados na Vitrine</li>
                <li className="flex items-center gap-2"><span className="text-blue-400">✓</span> Métricas Avançadas de Cliques e Visitas</li>
                <li className="flex items-center gap-2"><span className="text-blue-400">✓</span> Integração Avançada com Pixel (Meta/Google)</li>
                <li className="flex items-center gap-2"><span className="text-blue-400">✓</span> Integração com Redes Sociais</li>
                <li className="flex items-center gap-2"><span className="text-blue-400">✓</span> Remoção total da Marca d'água</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 bg-zinc-900/60 py-2 px-3 rounded-lg border border-zinc-800">
                <span>🔒</span> Pagamento Seguro via <strong>Mercado Pago</strong>
              </div>

              <button 
                onClick={assinarPro}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs md:text-sm rounded-xl transition-colors shadow-lg cursor-pointer"
              >
                Assinar Plano Pro Agora
              </button>
            </div>
          </div>
        </div>

        {/* MENSAGEM DE SEGURANÇA E TERMOS */}
        <div className="mt-8 text-center text-[10px] text-zinc-500 max-w-3xl mx-auto leading-relaxed px-2">
          Ao prosseguir, você concorda com nossos Termos de Uso. Em caso de denúncias de fraude na sua vitrine, você será notificado, e sua conta poderá ser suspensa por 30 dias ou permanentemente deletada. O cancelamento da assinatura pode ser feito a qualquer momento no painel, e a conta será desativada por um período de 30 dias após o cancelamento.
        </div>
      </div>

      {/* MODAL DE BOAS-VINDAS DINÂMICO (GRÁTIS vs PRO) */}
      {welcomeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-2xl p-6 sm:p-8 shadow-2xl relative text-center space-y-5">
            
            <div className="w-16 h-16 bg-blue-600/20 text-blue-500 rounded-full flex items-center justify-center mx-auto text-3xl mb-1">
              {welcomeModal === 'pro' ? '🚀' : '🎉'}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white tracking-tight">
                {welcomeModal === 'pro' ? 'Bem-vindo ao CortCut Pro!' : 'Bem-vindo ao CortCut!'}
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {welcomeModal === 'pro' ? (
                  <>Sua assinatura <strong>Profissional</strong> foi ativada com sucesso. Todos os recursos avançados estão liberados!</>
                ) : (
                  <>Seu <strong>Plano Grátis para Sempre</strong> está liberado. Cadastre até 10 produtos e comece a testar.</>
                )}
              </p>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-left space-y-4">
              <div className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <p className="text-xs text-zinc-300">
                  {welcomeModal === 'pro' ? (
                    <><strong>Escala Total:</strong> Produtos ilimitados na vitrine, rastreio avançado de conversão e sem marca d'água.</>
                  ) : (
                    <><strong>Transparência total:</strong> Use o plano gratuito por tempo ilimitado com limite de 10 produtos ativos.</>
                  )}
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-blue-400 font-bold mt-0.5">🛡️</span>
                <p className="text-xs text-zinc-300">
                  <strong>Diretrizes de Segurança:</strong> Contas denunciadas por atividades ilícitas serão investigadas e suspensas.
                </p>
              </div>
            </div>

            <button 
              onClick={entrarNoPainel}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors shadow-lg cursor-pointer text-sm"
            >
              {welcomeModal === 'pro' ? 'Acessar Meu Painel Pro' : 'Conhecer Meu Painel Grátis'}
            </button>
            
          </div>
        </div>
      )}
    </>
  );
}