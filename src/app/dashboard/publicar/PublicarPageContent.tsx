"use client";

import { useState } from "react";
import FormProduto from "./components/FormProduto";
import FormCurso from "./components/FormCurso";

export function PublicarProdutoPage() {
  const [tipoPublicacao, setTipoPublicacao] = useState<'produto' | 'curso'>('produto');

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      
      {/* CABEÇALHO */}
      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
          Publicar Oferta na Vitrine
        </h1>
        <p className="text-xs md:text-sm text-zinc-400">
          Escolha o formato ideal para divulgar seus produtos físicos ou infoprodutos.
        </p>
      </div>

      {/* ABAS DE ESCOLHA NO TOPO */}
      <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
        <button
          type="button"
          onClick={() => setTipoPublicacao('produto')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all cursor-pointer flex items-center gap-2 ${
            tipoPublicacao === 'produto'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 border border-blue-500'
              : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
          }`}
        >
          🛒 Produto Físico / Oferta
        </button>

        <button
          type="button"
          onClick={() => setTipoPublicacao('curso')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all cursor-pointer flex items-center gap-2 ${
            tipoPublicacao === 'curso'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 border border-emerald-500'
              : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
          }`}
        >
          🎓 Curso / Infoproduto (Presell)
        </button>
      </div>

      {/* RENDERIZAÇÃO DA ABA SELECIONADA */}
      <div className="w-full">
        {tipoPublicacao === 'produto' ? <FormProduto /> : <FormCurso />}
      </div>

    </div>
  );
}