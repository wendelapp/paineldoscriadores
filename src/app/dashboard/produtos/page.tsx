// src/app/dashboard/produtos/page.tsx
"use client";

import MeusProdutosContent from "./components/MeusProdutosContent";

export default function MeusProdutosPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6">
      <MeusProdutosContent />
    </div>
  );
}