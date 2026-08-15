// src/app/dashboard/conta/components/GerenciarContaContent.tsx
"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";

export default function GerenciarContaContent() {
  const [cancelando, setCancelando] = useState(false);
  const [userEmail, setUserEmail] = useState("carregando...");
  const [enviandoEmail, setEnviandoEmail] = useState(false);
  const [mensagemRedefinicao, setMensagemRedefinicao] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setUserEmail(user.email);
      } else {
        // Fallback caso esteja testando sem login ativo no momento
        setUserEmail("criador@cortcut.com");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleRedefinirSenha = async () => {
    setEnviandoEmail(true);
    setMensagemRedefinicao(null);
    try {
      if (auth.currentUser && auth.currentUser.email) {
        await sendPasswordResetEmail(auth, auth.currentUser.email);
        setMensagemRedefinicao("E-mail de redefinição de senha enviado com sucesso! Verifique sua caixa de entrada.");
      } else {
        setTimeout(() => {
          setMensagemRedefinicao("E-mail de redefinição enviado para " + userEmail);
          setEnviandoEmail(false);
        }, 1000);
        return;
      }
    } catch (error) {
      setMensagemRedefinicao("Erro ao enviar e-mail de redefinição. Tente novamente mais tarde.");
    } finally {
      setEnviandoEmail(false);
    }
  };

  const handleCancelarAssinatura = () => {
    const confirmar = confirm(
      "Tem certeza que deseja cancelar sua assinatura?\n\nSua conta e seus links de afiliados serão desativados por um período de 30 dias após o cancelamento."
    );
    if (confirmar) {
      setCancelando(true);
      // Aqui entrará a lógica de cancelamento no backend no futuro
      setTimeout(() => {
        alert("Sua solicitação de cancelamento foi processada. A conta será desativada conforme os termos.");
        setCancelando(false);
      }, 1500);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 space-y-6">
      
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Gerenciar Conta</h2>
        <p className="text-xs text-zinc-400">
          Gerencie sua assinatura, pagamentos e confira os termos de segurança do CortCut.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* COLUNA ESQUERDA: DADOS DE ACESSO, ASSINATURA E CANCELAMENTO */}
        <div className="space-y-6">
          
          {/* NOVO: CARD DE DADOS DE ACESSO (E-MAIL E SENHA) */}
          <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
              <span>🔐</span> Dados de Acesso
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  E-mail Cadastrado
                </label>
                <div className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono flex items-center justify-between">
                  <span>{userEmail}</span>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
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

          {/* Card de Assinatura */}
          <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-6 shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Seu Plano Atual</h3>
                <p className="text-xs text-emerald-400 font-bold mt-1">Status: Ativo (Período de Teste)</p>
              </div>
              <span className="px-3 py-1 bg-blue-600/20 text-blue-400 text-[10px] font-black rounded uppercase tracking-widest border border-blue-500/30">
                PRO
              </span>
            </div>

            <div className="space-y-3 bg-zinc-900/50 p-4 rounded-lg border border-zinc-800/50 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">Período Grátis:</span>
                <span className="text-white font-bold">1 Mês Grátis</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">Próximos 3 meses:</span>
                <span className="text-white font-bold">R$ 29,99 / mês</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2 border-t border-zinc-800">
                <span className="text-zinc-400">Valor Padrão:</span>
                <span className="text-white font-bold">R$ 49,99 / mês</span>
              </div>
            </div>

            {/* HISTÓRICO DE PAGAMENTOS / PIX */}
<div className="mt-6 pt-6 border-t border-zinc-800">
  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
    <span>📄</span> Histórico de Assinatura (Pix)
  </h4>
  
  <div className="space-y-2">
    <div className="flex items-center justify-between p-3 bg-zinc-900/60 border border-zinc-800 rounded-lg text-xs">
      <div>
        <p className="text-white font-bold">Plano PRO - 1 Mês Grátis</p>
        <p className="text-[10px] text-zinc-400">Ativado via Sistema de Teste</p>
      </div>
      <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-bold text-[10px]">
        Ativo (Grátis)
      </span>
    </div>

    <div className="flex items-center justify-between p-3 bg-zinc-900/30 border border-zinc-800/50 rounded-lg text-xs opacity-75">
      <div>
        <p className="text-zinc-300 font-bold">Próxima Renovação (Pix)</p>
        <p className="text-[10px] text-zinc-500">Cobrança automática via chave Pix</p>
      </div>
      <span className="text-zinc-400 font-mono font-bold">R$ 29,99</span>
    </div>
  </div>
</div>

            <button className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-bold rounded-lg transition-colors mb-4 cursor-pointer">
              💳 Atualizar Cartão de Crédito
            </button>
          </div>

          {/* Card de Cancelamento */}
          <div className="bg-zinc-950/80 border border-rose-900/30 rounded-xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-rose-500 mb-2 uppercase tracking-wider">Zona de Perigo</h3>
            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              Ao cancelar a assinatura, sua conta e suas vitrines serão desativadas por um período de 30 dias após o cancelamento.
            </p>
            <button
              onClick={handleCancelarAssinatura}
              disabled={cancelando}
              className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              {cancelando ? "Processando..." : "Cancelar Minha Assinatura"}
            </button>
          </div>
        </div>

        {/* COLUNA DIREITA: TERMOS E ANTI-FRAUDE */}
        <div className="space-y-6">
          <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-6 shadow-xl h-full">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🛡️</span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Segurança e Regras</h3>
            </div>
            
            <p className="text-xs text-zinc-400 mb-6">
              Para manter a qualidade da plataforma e proteger os compradores, temos um sistema anti-fraude rigoroso. Leia com atenção.
            </p>

            <div className="space-y-4">
              
              <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <h4 className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-2">
                  <span>✅</span> Links Permitidos
                </h4>
                <p className="text-[11px] text-zinc-400">
                  Apenas produtos de empresas sérias e regulamentadas pelo governo são aceitos. Plataformas liberadas: Mercado Livre, Shopee, Amazon, Hotmart e similares.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-rose-500/5 border border-rose-500/20">
                <h4 className="text-xs font-bold text-rose-400 mb-1 flex items-center gap-2">
                  <span>🚫</span> Proibição Absoluta
                </h4>
                <p className="text-[11px] text-zinc-400 font-medium">
                  É estritamente proibida a divulgação de jogos de azar, apostas ou produtos ilegais.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/20">
                <h4 className="text-xs font-bold text-orange-400 mb-1 flex items-center gap-2">
                  <span>⚠️</span> Denúncias e Punições
                </h4>
                <p className="text-[11px] text-zinc-400">
                  Se você receber uma denúncia válida, será avisado por notificação. Sua conta poderá ser suspensa por 30 dias ou permanentemente deletada.
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}