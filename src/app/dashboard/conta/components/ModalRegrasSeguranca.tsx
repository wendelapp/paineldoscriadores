"use client";

interface ModalRegrasSegurancaProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalRegrasSeguranca({ isOpen, onClose }: ModalRegrasSegurancaProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/30">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="text-lg">🛡️</span> Segurança e Regras
          </h3>
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          <p className="text-xs text-zinc-400 leading-relaxed">
            Para manter a qualidade da plataforma e proteger os compradores, temos um sistema anti-fraude rigoroso. Leia com atenção as diretrizes da nossa vitrine.
          </p>

          <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
            <h4 className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-2">
              <span>✅</span> Links Permitidos
            </h4>
            <p className="text-[11px] text-zinc-400">
              Apenas produtos de empresas sérias e regulamentadas pelo governo são aceitos. Plataformas liberadas: Mercado Livre, Shopee, Amazon, Hotmart e similares.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-rose-500/5 border border-rose-500/20">
            <h4 className="text-xs font-bold text-rose-400 mb-1 flex items-center gap-2">
              <span>🚫</span> Proibição Absoluta
            </h4>
            <p className="text-[11px] text-zinc-400 font-medium">
              É estritamente proibida a divulgação de jogos de azar, apostas ou produtos ilegais.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/20">
            <h4 className="text-xs font-bold text-orange-400 mb-1 flex items-center gap-2">
              <span>⚠️</span> Denúncias e Punições
            </h4>
            <p className="text-[11px] text-zinc-400">
              Se você receber uma denúncia válida, será avisado por notificação. Sua conta poderá ser suspensa por 30 dias ou permanentemente deletada.
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Entendi e Concordo
          </button>
        </div>
      </div>
    </div>
  );
}