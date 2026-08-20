"use client";

interface ProTrackingFieldsProps {
  isPro: boolean;
  onUpgradeClick: () => void;
  pixelMeta: string;
  setPixelMeta: (valor: string) => void;
  pixelGoogle: string;
  setPixelGoogle: (valor: string) => void;
}

export default function ProTrackingFields({ 
  isPro, 
  onUpgradeClick, 
  pixelMeta, 
  setPixelMeta, 
  pixelGoogle, 
  setPixelGoogle 
}: ProTrackingFieldsProps) {
  return (
    <div className="relative mt-6 p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-xl overflow-hidden">
      <div className="mb-3">
        <h3 className="text-[13px] font-bold text-white flex items-center gap-2">
          <span className="text-blue-500 text-base">📊</span> Otimização e Rastreio de Vendas
        </h3>
        <p className="text-[11px] text-zinc-400">Insira seus Pixels para rastrear cliques e conversões na sua vitrine.</p>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${!isPro ? 'opacity-30 blur-[2px] pointer-events-none' : ''}`}>
        <div>
          <label className="block text-[11px] font-medium text-zinc-300 mb-1">ID do Pixel da Meta (Facebook)</label>
          <input 
            type="text" 
            value={pixelMeta}
            onChange={(e) => setPixelMeta(e.target.value)}
            placeholder="Ex: 123456789012345" 
            className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-700/80 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-600" 
            disabled={!isPro} 
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-zinc-300 mb-1">ID do Google Ads (AW-)</label>
          <input 
            type="text" 
            value={pixelGoogle}
            onChange={(e) => setPixelGoogle(e.target.value)}
            placeholder="Ex: AW-123456789" 
            className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-700/80 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-600" 
            disabled={!isPro} 
          />
        </div>
      </div>

      {/* OVERLAY COM O CADEADO PARA CONTAS GRÁTIS */}
      {!isPro && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-950/30 backdrop-blur-[1px]">
          <div className="text-3xl mb-1 drop-shadow-lg">🔒</div>
          <button
            type="button"
            onClick={onUpgradeClick}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-[11px] rounded-lg border border-zinc-700 shadow-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            💎 Seja Pro para Rastrear Conversões
          </button>
        </div>
      )}
    </div>
  );
}