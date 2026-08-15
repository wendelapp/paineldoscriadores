// src/app/dashboard/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  onCloseMobile?: () => void;
}

export default function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  
  // Vamos forçar como TRUE para derrubar o cadeado e liberar a sua tela!
  const isVerified = true;
  
  // Verificação exata para a raiz (/dashboard) não conflitar com as outras rotas
  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <aside className="w-64 h-full border-r border-zinc-800 bg-[#111111] flex flex-col justify-between select-none">
      
      {/* TOPO: LOGO E BOTÃO FECHAR */}
      <div>
        <div className="p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-blue-500 tracking-tight">CortCut</h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Painel do Criador</p>
          </div>
          {/* Botão de fechar no mobile */}
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
          {/* MENU PUBLICAR COM TRAVA DE CADEADO 🔒 */}
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

      

      

      {/*dentro do Sidebar.tsx, substitua o bloco do rodapé8*/}
      <div className="p-3 space-y-1.5 border-t border-zinc-800/50 mt-auto">
        
        {/* Vitrine Pública (Compacto) */}
        <Link href="/c/seunome" target="_blank" className="flex items-center gap-3 p-2 rounded-lg border bg-blue-600/5 border-blue-900/30 hover:bg-blue-600/10 group">
          <div className="w-7 h-7 rounded-md bg-blue-600/20 flex items-center justify-center text-blue-400 group-hover:text-blue-300">🌐</div>
          <div>
            <p className="text-xs font-bold text-white">Vitrine Pública</p>
          </div>
        </Link>

        {/* Perfil (Compacto) */}
        <Link href="/dashboard/perfil" className={`flex items-center gap-3 p-2 rounded-lg border ${isActive('/dashboard/perfil') ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-900/50 border-zinc-800/50'}`}>
          <div className="w-7 h-7 rounded-md bg-zinc-800 flex items-center justify-center text-purple-400">👤</div>
          <p className="text-xs font-bold text-white">Meu Perfil</p>
        </Link>

        {/* Conta (Compacto) */}
        <Link href="/dashboard/conta" className={`flex items-center gap-3 p-2 rounded-lg border ${isActive('/dashboard/conta') ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-900/50 border-zinc-800/50'}`}>
          <div className="w-7 h-7 rounded-md bg-zinc-800 flex items-center justify-center text-zinc-300">⚙️</div>
          <p className="text-xs font-bold text-white">Gerenciar Conta</p>
        </Link>
      </div>
    </aside>
  );
}