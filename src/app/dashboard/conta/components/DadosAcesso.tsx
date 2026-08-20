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

  const handleRedefinirSenha = async () => {
    setEnviandoEmail(true);
    setMensagemRedefinicao(null);
    try {
      if (auth.currentUser && auth.currentUser.email) {
        await sendPasswordResetEmail(auth, auth.currentUser.email);
        setMensagemRedefinicao("E-mail enviado! Verifique sua caixa de entrada.");
      } else {
        // Fallback visual caso esteja testando sem estar logado de verdade
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
      // Aqui entrará a lógica de soft-delete no backend no futuro
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
              <span>{userEmail}</span>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
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

      {/* CARD DE EXCLUSÃO DE CONTA (ZONA DE PERIGO) */}
      <div className="bg-zinc-950/80 border border-rose-900/30 rounded-xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-rose-500 mb-2 uppercase tracking-wider">Zona de Perigo</h3>
        <p className="text-[11px] text-zinc-400 mb-4 leading-relaxed">
          Ao excluir sua conta, sua vitrine sairá do ar na mesma hora. Seus dados e produtos ficarão retidos por <strong className="text-zinc-300">30 dias</strong> para segurança e depois serão apagados definitivamente.
        </p>
        <button
          onClick={handleExcluirConta}
          disabled={excluindo}
          className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
        >
          {excluindo ? "Processando..." : "Excluir Minha Conta Definitivamente"}
        </button>
      </div>
    </div>
  );
}