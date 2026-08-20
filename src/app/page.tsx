"use client";

import { useState } from "react";
import LoginForm from "../modules/auth/components/LoginForm";
import LandingLoginView from "../modules/auth/components/LandingLoginView";
import RegisterForm from "../modules/auth/components/RegisterForm"; 
import ForgotPasswordForm from "../modules/auth/components/ForgotPasswordForm";
import PricingCard from "../modules/auth/subscription/PricingCard";
import AuthFooter from "../modules/auth/components/AuthFooter";
import LegalModal, { LegalType } from "../modules/auth/components/TermsModal";



export default function Home() {
  const [view, setView] = useState<"login" | "register" | "forgot" | "pricing">("login");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeType, setActiveType] = useState<LegalType>('termos');

  const handleOpenLegal = (type: LegalType) => {
    setActiveType(type);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen flex flex-col justify-between bg-[#09090b] text-white p-4 overflow-x-hidden">
      
      {/* SEÇÃO CENTRAL */}
      <div className="grow flex items-center justify-center w-full my-auto py-8">
        
        {/* Container flex: No mobile vira coluna (flex-col), no PC fica lado a lado (md:flex-row) */}
        <div className={`w-full max-w-6xl flex items-center justify-center ${view === 'register' ? 'flex-col md:flex-row gap-12' : ''}`}>
          
          {/* Lado Esquerdo (Landing de Texto) - AGORA APARECE NO CELULAR! */}
          {view === 'register' && (
            <div className="flex w-full md:w-1/2 flex-col justify-center mb-6 md:mb-0">
              <LandingLoginView />
            </div>
          )}

          {/* Lado Direito (Formulários reais) */}
          <div className={`${view === 'register' ? 'w-full md:w-1/2 flex flex-col items-center' : 'w-full flex flex-col items-center'}`}>
            {view === "login" && <LoginForm onForgotPassword={() => setView("forgot")} />}
            
            {view === "register" && <RegisterForm onRegisterSuccess={() => setView("pricing")} onOpenLegal={handleOpenLegal} />}
            
            {view === "forgot" && <ForgotPasswordForm onBack={() => setView("login")} />}
            {view === "pricing" && <PricingCard />}

            {/* Botão de Alternar */}
            {(view === "login" || view === "register") && (
              <div className="text-center mt-6">
                <button 
                  onClick={() => setView(view === "login" ? "register" : "login")}
                  className="text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  {view === "login" ? "Não tem uma conta? Conheça a plataforma e cadastre-se" : "Já tem uma conta? Faça login"}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* RODAPÉ FIXO NA BASE */}
      <div className="w-full mt-8">
        <AuthFooter onOpenLegal={handleOpenLegal} />
      </div>

      <LegalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        type={activeType} 
      />
    </main>
  );
}