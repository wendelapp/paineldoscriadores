// src/modules/auth/components/TermsModal.tsx
"use client";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Cabeçalho do Modal */}
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Termos de Uso e Políticas</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Corpo do Texto (Com rolagem) */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-zinc-300">
          <p>
            Ao criar sua conta, você concorda com as diretrizes de funcionamento, 
            segurança e conduta da plataforma.
          </p>

          <h4 className="font-semibold text-white mt-4">1. Integrações Permitidas</h4>
          <p>
            Nossa plataforma é focada em ecossistemas de vendas regulamentados e seguros. 
            É permitido vincular produtos e ofertas de empresas sérias e validadas, como 
            <strong> Mercado Livre, Shopee, Amazon, Hotmart </strong> e similares.
          </p>

          <h4 className="font-semibold text-rose-400 mt-4">2. Tolerância Zero para Jogos de Azar</h4>
          <p>
            É <strong>terminantemente proibida</strong> a divulgação, indexação ou promoção de 
            jogos de azar, apostas não regulamentadas, cassinos online ou esquemas fraudulentos.
          </p>

          <h4 className="font-semibold text-white mt-4">3. Sistema de Denúncias e Moderação</h4>
          <p>
            A plataforma monitora o conteúdo ativamente. Caso o usuário receba uma denúncia válida 
            sobre violação de regras, ele será avisado por notificação oficial. A conta 
            poderá ser <strong>suspensa preventivamente por 30 dias</strong> ou, dependendo da 
            gravidade, deletada permanentemente sem aviso prévio.
          </p>

          <h4 className="font-semibold text-white mt-4">4. Assinatura e Cancelamento</h4>
          <p>
            Você possui um período de 30 dias gratuitos para testar as ferramentas. Após o cancelamento 
            da assinatura, a conta e a vitrine do usuário serão desativadas e mantidas em um período 
            de carência por 30 dias no banco de dados.
          </p>
        </div>

        {/* Rodapé do Modal */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Entendi e concordo
          </button>
        </div>
      </div>
    </div>
  );
}