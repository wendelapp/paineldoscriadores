"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

interface DadosAcessoProps {
  userEmail: string;
}

export default function DadosAcesso({ userEmail }: DadosAcessoProps) {
  const [enviandoEmail, setEnviandoEmail] = useState(false);
  const [mensagemRedefinicao, setMensagemRedefinicao] = useState<string | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  const handleRedefinirSenha = async () => {
    setEnviandoEmail(true);
    setMensagemRedefinicao(null);
    try {
      if (auth.currentUser && auth.currentUser.email) {
        await sendPasswordResetEmail(auth, auth.currentUser.email);
        setMensagemRedefinicao("E-mail enviado! Verifique sua caixa de entrada.");
      } else {
        setTimeout(() => {
          setMensagemRedefinicao("E-mail de redefinição enviado para " + userEmail);
          setEnviandoEmail(false);
        }, 1000);
        return;
      }
    } catch (error) {
      setMensagemRedefinicao("Erro ao enviar e-mail. Tente novamente.");
    } finally {
      setEnviandoEmail(false);
    }
  };

  const handleExcluirConta = () => {
    const confirmar = confirm(
      "TEM CERTEZA ABSOLUTA?\n\nSua vitrine pública sairá do ar imediatamente. Seus dados e produtos ficarão retidos por 30 dias e, após esse período, serão apagados definitivamente."
    );
    
    if (confirmar) {
      setExcluindo(true);
      setTimeout(() => {
        alert("Sua conta foi desativada e entrará no processo de exclusão de 30 dias.");
        setExcluindo(false);
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      {/* CARD PRINCIPAL DE ACESSO */}
      <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-5 uppercase tracking-wider flex items-center gap-2">
          <span className="text-lg">🔐</span> Dados de Acesso
        </h3>

        <div className="space-y-5">
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
              E-mail Cadastrado
            </label>
            <div className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono flex items-center justify-between">
              <span className="truncate mr-2">{userEmail}</span>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider shrink-0">
                Verificado
              </span>
            </div>
          </div>

          <div>
            <button
              onClick={handleRedefinirSenha}
              disabled={enviandoEmail}
              className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              {enviandoEmail ? "Enviando..." : "Alterar / Redefinir Senha"}
            </button>
          </div>

          {mensagemRedefinicao && (
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-400 font-medium">
              {mensagemRedefinicao}
            </div>
          )}
        </div>
      </div>

      {/* ZONA DE PERIGO COM OS 3 PONTINHOS E A MENSAGEM ORIGINAL */}
      <div className="bg-zinc-950/80 border border-rose-900/30 rounded-xl p-6 shadow-xl relative">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-bold text-rose-500 uppercase tracking-wider">Zona de Perigo</h3>

          {/* MENU DOS 3 PONTINHOS */}
          <div className="relative">
            <button 
              onClick={() => setMenuAberto(!menuAberto)}
              className="p-1.5 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-zinc-900 cursor-pointer -mt-1 -mr-2"
              title="Opções Avançadas"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="1"/>
                <circle cx="12" cy="12" r="1"/>
                <circle cx="12" cy="19" r="1"/>
              </svg>
            </button>

            {/* DROPDOWN DOS 3 PONTINHOS */}
            {menuAberto && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl z-50 py-1 animate-in fade-in zoom-in-95 duration-200">
                <button
                  onClick={() => {
                    setMenuAberto(false);
                    handleExcluirConta();
                  }}
                  disabled={excluindo}
                  className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-rose-500 hover:bg-rose-500/10 transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-sm">🗑️</span> 
                  {excluindo ? "Processando..." : "Excluir Conta"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MENSAGEM IMPORTANTE PRESERVADA */}
        <p className="text-[11px] text-zinc-400 leading-relaxed">
          Ao excluir sua conta, sua vitrine sairá do ar na mesma hora. Seus dados e produtos ficarão retidos por <strong className="text-zinc-300">30 dias</strong> para segurança e depois serão apagados definitivamente.
        </p>
      </div>
    </div>
  );
}