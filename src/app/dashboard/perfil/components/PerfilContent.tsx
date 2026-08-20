"use client";

import { useState, useEffect } from "react";

// 1. Atualizando as Interfaces para aceitar Redes Sociais
interface RedesSociais {
  youtube?: string;
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  twitter?: string;
  telegram?: string;
}

interface PerfilData {
  slug: string;
  nome: string;
  usuario: string;
  bio: string;
  bannerUrl?: string;
  avatarUrl?: string;
  isVerified: boolean;
  redesSociais?: RedesSociais;
}

interface PerfilContentProps {
  dadosPerfil: PerfilData | null;
  carregando: boolean;
  onSalvar: (novosDados: Partial<PerfilData>) => void;
}

export default function PerfilContent({ dadosPerfil, carregando, onSalvar }: PerfilContentProps) {
  const [nome, setNome] = useState("");
  const [usuario, setUsuario] = useState("");
  const [bio, setBio] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  
  // 2. Novo estado para as redes sociais
  const [redesSociais, setRedesSociais] = useState<RedesSociais>({
    youtube: "", instagram: "", tiktok: "", facebook: "", twitter: "", telegram: ""
  });
  
  const [salvando, setSalvando] = useState(false);

  // Sincroniza os estados locais assim que os dados do Firebase chegam
  useEffect(() => {
    if (dadosPerfil) {
      setNome(dadosPerfil.nome || "");
      setUsuario(dadosPerfil.slug || dadosPerfil.usuario || "");
      setBio(dadosPerfil.bio || "");
      setBannerUrl(dadosPerfil.bannerUrl || "");
      setAvatarUrl(dadosPerfil.avatarUrl || "");
      
      // Sincroniza as redes se existirem no banco
      if (dadosPerfil.redesSociais) {
        setRedesSociais({
          youtube: dadosPerfil.redesSociais.youtube || "",
          instagram: dadosPerfil.redesSociais.instagram || "",
          tiktok: dadosPerfil.redesSociais.tiktok || "",
          facebook: dadosPerfil.redesSociais.facebook || "",
          twitter: dadosPerfil.redesSociais.twitter || "",
          telegram: dadosPerfil.redesSociais.telegram || ""
        });
      }
    }
  }, [dadosPerfil]);

  const handleRedeChange = (rede: keyof RedesSociais, valor: string) => {
    setRedesSociais(prev => ({ ...prev, [rede]: valor }));
  };

  const handleSalvar = async () => {
    setSalvando(true);
    // 3. Enviando as redes sociais junto no salvamento
    await onSalvar({ nome, bio, bannerUrl, avatarUrl, redesSociais });
    setSalvando(false);
    alert("Perfil atualizado com sucesso!");
  };

  const copiarLink = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://cortcut.com';
    const linkCompleto = `${baseUrl}/c/${usuario || "seu-usuario"}`;
    
    navigator.clipboard.writeText(linkCompleto);
    alert("Link copiado! Cole no navegador para ver sua vitrine.");
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
          
          {/* LADO ESQUERDO: FORMULÁRIOS */}
          <div className="md:col-span-2 space-y-6">
            
            {/* BLOCO 1: Identidade Pública */}
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
                  <label className="block text-xs font-bold text-zinc-500 mb-1">
                    Nome de Usuário (URL Fixa)
                  </label>
                  <div className="flex bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden opacity-75">
                    <span className="px-4 py-2.5 bg-zinc-900 text-zinc-500 text-sm border-r border-zinc-800 select-none">
                      cortcut.com/c/
                    </span>
                    <input
                      type="text"
                      value={usuario}
                      disabled
                      className="w-full px-4 py-2.5 bg-transparent text-zinc-400 text-sm focus:outline-none cursor-not-allowed"
                      title="O nome de usuário é fixo após o cadastro."
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1">O link da sua vitrine é permanente e não pode ser alterado por aqui.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 mb-1">Link da Foto (Avatar)</label>
                    <input
                      type="text"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="URL da sua foto"
                      className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-500 mb-1">Link do Banner (Capa)</label>
                    <input
                      type="text"
                      value={bannerUrl}
                      onChange={(e) => setBannerUrl(e.target.value)}
                      placeholder="URL do banner"
                      className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1">Biografia Curta</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Falo sobre tecnologia e importação..."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* BLOCO 2: Redes Sociais */}
            <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-6 shadow-xl">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Redes Sociais</h3>
                <p className="text-xs text-zinc-500 mt-1">Deixe em branco as que não quiser exibir na sua vitrine.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Inputs de Redes */}
                {[
                  { id: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@seu_canal' },
                  { id: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/seu_perfil' },
                  { id: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@seu_perfil' },
                  { id: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/sua_pagina' },
                  { id: 'twitter', label: 'Twitter (X)', placeholder: 'https://x.com/seu_perfil' },
                  { id: 'telegram', label: 'Telegram', placeholder: 'https://t.me/seu_grupo' },
                ].map((rede) => (
                  <div key={rede.id}>
                    <label className="block text-xs font-bold text-zinc-500 mb-1">{rede.label}</label>
                    <input
                      type="text"
                      value={redesSociais[rede.id as keyof RedesSociais] || ""}
                      onChange={(e) => handleRedeChange(rede.id as keyof RedesSociais, e.target.value)}
                      placeholder={rede.placeholder}
                      className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* BOTÃO SALVAR MOVIDO PARA O FINAL PARA SALVAR TUDO */}
            <button
              onClick={handleSalvar}
              disabled={salvando}
              className="w-full px-6 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl shadow-lg transition-colors cursor-pointer flex justify-center items-center"
            >
              {salvando ? "Salvando Alterações..." : "💾 Salvar Perfil Completo"}
            </button>

          </div>

          {/* LADO DIREITO: PREVIEW LATERAL */}
          <div className="space-y-6">
            <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl shadow-xl overflow-hidden text-center relative">
              <div className="h-28 w-full relative bg-zinc-900">
                {bannerUrl ? (
                  <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-linear-to-r from-blue-900/40 to-purple-900/40" />
                )}
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-zinc-950/60 to-zinc-950" />
              </div>

              <div className="px-5 pb-5 relative -mt-10">
                <div className="relative inline-block">
                  <div className="w-20 h-20 mx-auto bg-zinc-800 rounded-full flex items-center justify-center text-3xl border-4 border-zinc-950 overflow-hidden shadow-lg relative z-10">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      "👤"
                    )}
                  </div>
                  
                  {dadosPerfil?.isVerified && (
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-600 rounded-full border-2 border-zinc-950 flex items-center justify-center text-white z-20 shadow-sm" title="Criador Verificado">
                      ✓
                    </div>
                  )}
                </div>

                <h4 className="text-sm font-bold text-white mt-2 relative z-10">{nome || "Seu Nome"}</h4>
                <p className="text-[10px] text-zinc-400 mt-1 mb-3 relative z-10">{bio || "Sua biografia aparecerá aqui."}</p>
                
                {/* PREVIEW DAS REDES SOCIAIS (SÓ APARECE SE TIVER ALGO PREENCHIDO) */}
                <div className="flex items-center justify-center gap-3 mb-4 relative z-10">
                  {redesSociais.youtube && (
                    <div className="w-6 h-6 bg-zinc-900 rounded-md flex items-center justify-center border border-zinc-800 text-red-500" title="YouTube">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    </div>
                  )}
                  {redesSociais.instagram && (
                    <div className="w-6 h-6 bg-zinc-900 rounded-md flex items-center justify-center border border-zinc-800 text-pink-500" title="Instagram">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </div>
                  )}
                  {redesSociais.tiktok && (
                    <div className="w-6 h-6 bg-zinc-900 rounded-md flex items-center justify-center border border-zinc-800 text-white" title="TikTok">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                    </div>
                  )}
                  {redesSociais.twitter && (
                    <div className="w-6 h-6 bg-zinc-900 rounded-md flex items-center justify-center border border-zinc-800 text-white" title="Twitter/X">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L5.09 21.75H1.78l7.869-8.99L1.508 2.25h6.814l4.715 6.182zM16.96 19.76h1.83L7.14 4.14H5.19z"/></svg>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={copiarLink}
                  className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer relative z-10"
                >
                  🔗 Copiar Link da Vitrine
                </button>
              </div>
            </div>

           {/* STATUS */}
            <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-5 shadow-xl">
              <h3 className="text-[10px] font-bold text-zinc-500 mb-3 uppercase tracking-wider">Status da Conta</h3>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-black/50">
                    {dadosPerfil?.isVerified ? "✅" : "⚠️"}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">
                      {dadosPerfil?.isVerified ? "Criador Verificado" : "Não Verificado"}
                    </p>
                    <p className="text-[9px] text-zinc-400 mt-0.5">
                      {dadosPerfil?.isVerified ? "Selo oficial ativado na vitrine" : "Vincule seu canal para poder publicar"}
                    </p>
                  </div>
                </div>

                {!dadosPerfil?.isVerified && (
                  <div className="pt-2 border-t border-zinc-800/50">
                    <button
                      onClick={() => window.location.href = "/dashboard/verificacao"}
                      className="w-full py-2.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Verificar Minha Conta Agora
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}