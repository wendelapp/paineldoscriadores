"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase"; // Agora importamos o db
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore"; // Importando funções do Firestore

// Importando nossos componentes modulares
import DadosAcesso from "./DadosAcesso";
import PlanoAtual from "./PlanoAtual";
import HistoricoPagamentos from "./HistoricoPagamentos";
import ModalRegrasSeguranca from "./ModalRegrasSeguranca";
import LegalModal, { LegalType } from "@/modules/auth/components/TermsModal";
import AuthFooter from "@/modules/auth/components/AuthFooter"; 

export default function GerenciarContaContent() {
  const [userEmail, setUserEmail] = useState("carregando...");
  const [isPro, setIsPro] = useState(false); // Agora começa falso e o Firebase decide
  const [cancelouRenovacao, setCancelouRenovacao] = useState(false); // Novo estado
  
  // Estados para os Modals
  const [isModalSegurancaOpen, setIsModalSegurancaOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [activeLegalType, setActiveLegalType] = useState<LegalType>('termos');

  useEffect(() => {
    let unsubscribeSnapshot: () => void;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setUserEmail(user.email);

        // Escuta o documento do usuário no Firebase em TEMPO REAL
        const userRef = doc(db, 'users', user.uid);
        unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setIsPro(data.isPro || false);
            setCancelouRenovacao(data.cancelouRenovacao || false);
          }
        });

      } else {
        setUserEmail("criador@cortcut.com");
        setIsPro(false);
        setCancelouRenovacao(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  const handleOpenLegal = (type: LegalType) => {
    setActiveLegalType(type);
    setIsLegalModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 space-y-6">
      
      {/* CABEÇALHO DA TELA */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Gerenciar Conta</h2>
        <p className="text-xs text-zinc-400 mt-1">
          Gerencie sua assinatura, seus dados de acesso e confira o histórico de pagamentos.
        </p>
      </div>

      {/* GRID INTELIGENTE (3 COLUNAS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        <div className="lg:col-span-1">
          <DadosAcesso userEmail={userEmail} />
        </div>
        
        <div className="lg:col-span-1">
          {/* Agora o componente filho recebe os dados reais do Firebase! */}
          <PlanoAtual isPro={isPro} cancelouRenovacao={cancelouRenovacao} />
        </div>
        
        <div className="lg:col-span-1">
          <HistoricoPagamentos />
        </div>

      </div>

      {/* BOTÃO DISCRETO PARA AS DIRETRIZES DE SEGURANÇA */}
      <div className="flex justify-end pt-2">
        <button 
          onClick={() => setIsModalSegurancaOpen(true)}
          className="text-[11px] font-bold text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span className="text-sm">🛡️</span> Diretrizes de Segurança e Anti-Fraude
        </button>
      </div>

      {/* RODAPÉ REUTILIZÁVEL */}
      <div className="mt-12">
        <AuthFooter onOpenLegal={handleOpenLegal} />
      </div>

      {/* MODAL DE SEGURANÇA E REGRAS */}
      <ModalRegrasSeguranca 
        isOpen={isModalSegurancaOpen} 
        onClose={() => setIsModalSegurancaOpen(false)} 
      />

      {/* MODAL LEGAL UNIFICADO */}
      <LegalModal 
        isOpen={isLegalModalOpen} 
        onClose={() => setIsLegalModalOpen(false)} 
        type={activeLegalType} 
      />

    </div>
  );
}