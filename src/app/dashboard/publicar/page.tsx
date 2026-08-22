"use client";

import { Suspense } from "react";
import FormProduto from "./components/FormProduto";

export default function PublicarPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-zinc-400">Carregando painel de publicação...</div>}>
      <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        
        {/* CABEÇALHO */}
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Publicar Oferta na Vitrine
          </h1>
          <p className="text-xs md:text-sm text-zinc-400">
            Cadastre sua oferta com gatilho de preço e prévia em tempo real de forma rápida e organizada.
          </p>
        </div>

        {/* FORMULÁRIO DE PRODUTOS FÍSICOS DIRETO NA TELA */}
        <div className="w-full">
          <FormProduto />
        </div>

      </div>
    </Suspense>
  );
}