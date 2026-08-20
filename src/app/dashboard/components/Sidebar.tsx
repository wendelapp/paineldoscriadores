"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface SidebarProps {
  onCloseMobile?: () => void;
}

export default function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const [userUid, setUserUid] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false); 
  
  // Novo estado para guardar o Primeiro Nome do criador
  const [firstName, setFirstName] = useState<string>("CortCut"); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserUid(user.uid);
        
        let extractedName = user.displayName; // Tenta pegar do Auth do Google/Firebase primeiro

        // Vai no Firebase olhar o documento do usuário logado
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            
            // Checa a verificação
            if (data.isVerified === true) {
              setIsVerified(true);
            } else {
              setIsVerified(false);
            }

            // Se não tinha nome no Auth, tenta pegar do Firestore (caso você salve como 'nome', 'name' ou 'displayName')
            if (!extractedName) {
              extractedName = data.nome || data.name || data.displayName;
            }
          }
        } catch (error) {
          console.error("Erro ao checar banco de dados:", error);
        }

        // Se encontrou o nome, separa apenas o primeiro
        if (extractedName) {
          const first = extractedName.trim().split(" ")[0];
          setFirstName(`Olá, ${first}`);
        } else {
          setFirstName("CortCut"); // Fallback de segurança
        }

      } else {
        setUserUid(null);
        setIsVerified(false);
        setFirstName("CortCut");
      }
    });
    return () => unsubscribe();
  }, []);

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <aside className="w-64 h-full border-r border-zinc-800 bg-[#111111] flex flex-col justify-between select-none">
      
      {/* TOPO: NOME DO USUÁRIO E BOTÃO FECHAR */}
      <div>
        <div className="p-6 flex items-center justify-between">
          <div className="overflow-hidden pr-2">
            {/* Adicionado truncate para o layout não quebrar com nomes grandes */}
            <h1 className="text-xl font-black text-blue-500 tracking-tight truncate max-w-40" title={firstName}>
              {firstName}
            </h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Painel do Criador</p>
          </div>
          {onCloseMobile && (
            <button onClick={onCloseMobile} className="lg:hidden text-zinc-400 hover:text-white p-2 cursor-pointer">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ÁREA DE ROLAGEM PRINCIPAL */}
      <div className="px-4 grow overflow-y-auto">
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-3 px-2">Menu Principal</p>
        
        <nav className="space-y-1">
          {/* MENU PUBLICAR COM TRAVA DINÂMICA DO FIREBASE 🔒 */}
          <Link 
            href={isVerified ? "/dashboard/publicar" : "/dashboard/verificacao"} 
            onClick={onCloseMobile}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive('/dashboard/publicar') ? 'bg-blue-600/10 text-blue-500 border-l-2 border-blue-500' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'}`}
          >
            <div className="flex items-center gap-3">
              <span>📢</span>
              <span>Publicar</span>
            </div>
            {!isVerified && <span title="Verifique sua conta para publicar">🔒</span>}
          </Link>

          <Link 
            href="/dashboard" 
            onClick={onCloseMobile}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive('/dashboard') ? 'bg-emerald-500/10 text-emerald-500 border-l-2 border-emerald-500' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'}`}
          >
            <span>📊</span> Visão Geral
          </Link>

          <Link 
            href="/dashboard/produtos" 
            onClick={onCloseMobile}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive('/dashboard/produtos') ? 'bg-blue-600/10 text-blue-500 border-l-2 border-blue-500' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'}`}
          >
            <span>📦</span> Meus Produtos
          </Link>
        </nav>
      </div>

      {/* RODAPÉ DO MENU */}
      <div className="p-3 space-y-1.5 border-t border-zinc-800/50 mt-auto">
        
        {/* Vitrine Pública (Dinâmico com o ID do usuário) */}
        <Link 
          href={userUid ? `/c/${userUid}` : "#"} 
          target="_blank" 
          className="flex items-center gap-3 p-2 rounded-lg border bg-blue-600/5 border-blue-900/30 hover:bg-blue-600/10 group cursor-pointer"
        >
          <div className="w-7 h-7 rounded-md bg-blue-600/20 flex items-center justify-center text-blue-400 group-hover:text-blue-300">🌐</div>
          <div>
            <p className="text-xs font-bold text-white">Vitrine Pública</p>
          </div>
        </Link>

        {/* Perfil */}
        <Link href="/dashboard/perfil" className={`flex items-center gap-3 p-2 rounded-lg border ${isActive('/dashboard/perfil') ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-900/50 border-zinc-800/50'}`}>
          <div className="w-7 h-7 rounded-md bg-zinc-800 flex items-center justify-center text-purple-400">👤</div>
          <p className="text-xs font-bold text-white">Meu Perfil</p>
        </Link>

        {/* Conta */}
        <Link href="/dashboard/conta" className={`flex items-center gap-3 p-2 rounded-lg border ${isActive('/dashboard/conta') ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-900/50 border-zinc-800/50'}`}>
          <div className="w-7 h-7 rounded-md bg-zinc-800 flex items-center justify-center text-zinc-300">⚙️</div>
          <p className="text-xs font-bold text-white">Gerenciar Conta</p>
        </Link>
      </div>
    </aside>
  );
}