"use client";

import { useState } from "react";
import LegalModal, { LegalType } from "@/modules/auth/components/TermsModal";

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeType, setActiveType] = useState<LegalType>('termos');

  const handleOpenLegal = (type: LegalType) => {
    setActiveType(type);
    setIsModalOpen(true);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-10 text-center space-y-6 border-t border-zinc-800 mt-12">
      
      {/* 1. AVISO LEGAL PARA PROTEGER A PLATAFORMA */}
      <div className="max-w-xl mx-auto px-6">
        <p className="text-[10px] text-zinc-500 leading-relaxed">
          Os produtos e links exibidos nesta vitrine são de responsabilidade exclusiva do criador de conteúdo. O CortCut é uma plataforma fornecedora de tecnologia e não realiza vendas diretas ou intermediação de pagamentos.
        </p>
      </div>

      {/* 2. LINKS ENXUTOS PARA O COMPRADOR */}
      <div className="flex flex-wrap justify-center gap-6 px-4 text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
        <button 
          onClick={() => handleOpenLegal('termos')} 
          className="hover:text-white transition-colors cursor-pointer"
        >
          Termos
        </button>
        <button 
          onClick={() => handleOpenLegal('privacidade')} 
          className="hover:text-white transition-colors cursor-pointer"
        >
          Privacidade
        </button>
        <button 
          onClick={() => handleOpenLegal('denuncia')} 
          className="transition-colors cursor-pointer text-rose-500/70 hover:text-rose-500"
        >
          Denunciar Vitrine
        </button>
      </div>
      
      {/* 3. COPYRIGHT VOLTADO PARA MARCA */}
      <p className="text-[9px] text-zinc-600">
        Desenvolvido com <span className="font-bold text-zinc-500">CortCut</span> © {currentYear}
      </p>

      <LegalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        type={activeType} 
      />
    </footer>
  );
}