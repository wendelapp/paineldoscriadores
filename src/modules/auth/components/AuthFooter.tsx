"use client";

// Importa direto do modal para usar exatamente o mesmo tipo em todo o sistema
import { LegalType } from "@/modules/auth/components/TermsModal";

interface AuthFooterProps {
  onOpenLegal: (type: LegalType) => void;
}

const footerLinks: { label: string; type: LegalType }[] = [
  { label: "Termos", type: "termos" },
  { label: "Privacidade", type: "privacidade" },
  { label: "Cookies", type: "cookies" },
  { label: "FAQ", type: "faq" },
  { label: "Suporte", type: "suporte" },
  { label: "Denúncia", type: "denuncia" },
  { label: "Assinatura e Reembolso", type: "assinatura" },
  { label: "Quem Somos", type: "quem_somos" }, // <--- Adicionado aqui
];

export default function AuthFooter({ onOpenLegal }: AuthFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full flex flex-col items-center justify-center gap-4 py-6 border-t border-zinc-800">
      
      {/* Links Legais e de Suporte Mapeados Automaticamente */}
      <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-sm text-zinc-500">
        {footerLinks.map((link, index) => (
          <div key={link.type} className="flex items-center gap-3 sm:gap-6">
            <button 
              onClick={() => onOpenLegal(link.type)} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              {link.label}
            </button>
            {index < footerLinks.length - 1 && (
              <span className="text-zinc-700 text-[8px] hidden sm:inline">⚫</span>
            )}
          </div>
        ))}
      </div>

      {/* Informações da Empresa */}
      <div className="flex flex-col items-center gap-1 text-[11px] text-zinc-600 text-center mt-2">
        <p>© {currentYear} CortCut. Todos os direitos reservados.</p>
        
        <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
          <span>CNPJ: 00.000.000/0001-00</span>
          <span className="hidden sm:inline">•</span>
          
          <a href="mailto:suporte@cortcut.com" className="hover:text-zinc-400 transition-colors">
            suporte@cortcut.com
          </a>
          <span className="hidden sm:inline">•</span>
          
          <span className="text-zinc-700 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 font-mono">
            v1.0.0
          </span>
        </div>
      </div>

    </footer>
  );
}