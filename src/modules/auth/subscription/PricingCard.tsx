// src/modules/subscription/components/PricingCard.tsx
"use client";

export default function PricingCard() {
  return (
    <div className="w-full max-w-sm p-6 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl flex flex-col items-center">
      {/* Selo de Promoção */}
      <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-wider mb-4">
        Oferta de Lançamento
      </span>

      <h2 className="text-2xl font-bold text-white mb-2">CortCut Premium</h2>
      
      <div className="text-center mb-6">
        <span className="text-zinc-500 line-through text-lg">R$ 97,00</span>
        <div className="flex items-baseline justify-center">
          <span className="text-4xl font-bold text-white">R$ 29,99</span>
          <span className="text-zinc-400 ml-1">/mês</span>
        </div>
        <p className="text-zinc-500 text-xs mt-2 italic">Cancele a qualquer momento</p>
      </div>

      <button className="w-full py-3 bg-white hover:bg-zinc-200 text-black font-bold rounded-lg transition-colors mb-4">
        Assinar Agora
      </button>

      <button className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors mb-6">
        Saiba mais
      </button>

      <div className="w-full pt-6 border-t border-zinc-800 text-center">
        <p className="text-zinc-400 text-sm mb-2">Ou continue com:</p>
        <button className="text-blue-400 hover:text-blue-300 font-medium text-sm">
          Conta Gratuita (limitada) 30 Dias
        </button>
      </div>
    </div>
  );
}