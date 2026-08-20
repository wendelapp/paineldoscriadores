"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Importando o auth do seu Firebase
import Sidebar from "./components/Sidebar";
import NotificationBell from "./components/NotificationBell"; // IMPORTAMOS O SININHO AQUI

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const router = useRouter(); // Iniciando o roteador para poder trocar de página

  // FUNÇÃO DE LOGOUT NOVA AQUI
  const handleLogout = async () => {
    try {
      await signOut(auth); // Desloga do Firebase
      router.push("/");    // Redireciona para a raiz (página inicial/login)
      router.refresh();    // Atualiza a página para limpar o cache visual
    } catch (error) {
      console.error("Erro ao sair:", error);
      alert("Erro ao tentar sair da conta.");
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-zinc-300 font-sans overflow-hidden">
      
      {/* SIDEBAR PARA DESKTOP (FIXA) */}
      <div className="hidden lg:block h-full">
        <Sidebar />
      </div>

      {/* SIDEBAR PARA MOBILE (MODAL DESLIZANTE) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-64 h-full bg-[#111111] z-10 shadow-2xl">
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* ÁREA PRINCIPAL DA DIREITA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOP BAR RESPONSIVA */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b border-zinc-800/50 bg-[#0a0a0a] shrink-0">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-lg border border-zinc-800"
              aria-label="Abrir Menu"
            >
              ☰
            </button>

            <span className="text-xs font-medium text-zinc-500 hidden sm:inline">
              Painel / <span className="text-zinc-300 font-bold">Visão Geral</span>
            </span>
            
            <div className="flex items-center gap-2 sm:ml-4">
              <span className="flex items-center gap-1.5 px-2 py-1 sm:px-2.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Ativa
              </span>
              <span className="px-2 py-1 sm:px-2.5 rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-wider border border-zinc-700 hidden xs:inline">
                30 Dias Grátis
              </span>
            </div>
          </div>

          {/* LADO DIREITO DO TOPO */}
          <div className="flex items-center gap-3 relative">
            
            {/* SUBSTITUÍMOS O BOTÃO ESTÁTICO PELO COMPONENTE AQUI */}
            <NotificationBell />

            <div className="relative">
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors text-zinc-300 text-xs font-bold cursor-pointer"
              >
                <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white text-[10px]">
                  👤
                </div>
                <span className="hidden sm:inline"></span>
                <span className="text-[10px] text-zinc-500">▼</span>
              </button>

              {/* Dropdown flutuante */}
              {userDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl py-1.5 z-50">
                    <div className="px-3 py-2 border-b border-zinc-800">
                      <p className="text-[11px] font-bold text-white">Minha Conta</p>
                    </div>
                    {/* BOTÃO DE SAIR CHAMANDO A FUNÇÃO handleLogout */}
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-zinc-800 transition-colors flex items-center gap-2 font-medium cursor-pointer"
                    >
                      🚪 Sair do Painel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

        </header>

        {/* CONTEÚDO DA PÁGINA COM SCROLL */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>

      </div>
    </div>
  );
}