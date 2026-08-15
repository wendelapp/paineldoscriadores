// src/app/dashboard/perfil/components/PerfilContent.tsx
"use client";

import { useState } from "react";

interface PerfilData {
  nome: string;
  usuario: string; // ex: @joaocortcut
  bio: string;
  isVerified: boolean;
  totalProdutos?: number;
}

interface PerfilContentProps {
  dadosPerfil: PerfilData | null;
  carregando: boolean;
  onSalvar: (novosDados: Partial<PerfilData>) => void;
}

export default function PerfilContent({ dadosPerfil, carregando, onSalvar }: PerfilContentProps) {
  const [nome, setNome] = useState(dadosPerfil?.nome || "");
  const [usuario, setUsuario] = useState(dadosPerfil?.usuario || "");
  const [bio, setBio] = useState(dadosPerfil?.bio || "");
  const [salvando, setSalvando] = useState(false);

  const handleSalvar = async () => {
    setSalvando(true);
    await onSalvar({ nome, usuario, bio });
    setSalvando(false);
    alert("Perfil atualizado com sucesso!");
  };

  const copiarLink = () => {
    navigator.clipboard.writeText(`cortcut.com/c/${usuario || "seu-usuario"}`);
    alert("Link da sua vitrine copiado! Cole na bio do Instagram ou TikTok.");
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-6">
      
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Meu Perfil</h2>
        <p className="text-xs text-zinc-400">
          Gerencie como sua vitrine pública aparece para os seus seguidores e compradores.
        </p>
      </div>

      {carregando ? (
        <div className="py-20 text-center text-xs text-zinc-500">Carregando dados do perfil...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* COLUNA ESQUERDA: Formulário de Identidade */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Identidade Pública</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1">Nome de Exibição</label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: João Imports"
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1">Nome de Usuário (URL)</label>
                  <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden focus-within:border-blue-500 transition-colors">
                    <span className="px-4 py-2.5 bg-zinc-900/50 text-zinc-500 text-sm border-r border-zinc-800 select-none">
                      cortcut.com/c/
                    </span>
                    <input
                      type="text"
                      value={usuario}
                      onChange={(e) => setUsuario(e.target.value)}
                      placeholder="joaoimports"
                      className="w-full px-4 py-2.5 bg-transparent text-white text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1">Biografia Curta</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Falo sobre tecnologia e importação. Clique nos links abaixo!"
                    rows={3}
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  />
                </div>

                <button
                  onClick={handleSalvar}
                  disabled={salvando}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors cursor-pointer"
                >
                  {salvando ? "Salvando..." : "Salvar Perfil"}
                </button>
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA: Link, Vitrine e Selo */}
          <div className="space-y-6">
            
            {/* Link da Vitrine */}
            <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-5 shadow-xl text-center">
              <div className="w-16 h-16 mx-auto bg-zinc-800 rounded-full flex items-center justify-center text-2xl mb-3 border-2 border-zinc-700">
                👤
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{nome || "Seu Nome"}</h4>
              <p className="text-[10px] text-zinc-500 mb-4">{bio || "Sua biografia aparecerá aqui na sua vitrine."}</p>
              
              <button
                onClick={copiarLink}
                className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                🔗 Copiar Link da Vitrine
              </button>
            </div>

            {/* Status de Verificação */}
            <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-5 shadow-xl">
              <h3 className="text-[10px] font-bold text-zinc-500 mb-3 uppercase tracking-wider">Status da Conta</h3>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-black/50">
                  {dadosPerfil?.isVerified ? "✅" : "⚠️"}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    {dadosPerfil?.isVerified ? "Criador Verificado" : "Não Verificado"}
                  </p>
                  <p className="text-[9px] text-zinc-400 mt-0.5">
                    {dadosPerfil?.isVerified ? "Selo oficial ativado na vitrine" : "Vincule seu YouTube para ganhar o selo"}
                  </p>
                </div>
              </div>

              {!dadosPerfil?.isVerified && (
                <a 
                  href="/dashboard/verificacao"
                  className="block text-center mt-3 text-[10px] text-blue-400 font-bold hover:underline"
                >
                  Verificar conta agora →
                </a>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}