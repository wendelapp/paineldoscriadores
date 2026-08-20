'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Esse é o porteiro! Ele esconde o seu arquivo grandão da Vercel.
const PublicarContentDynamic = dynamic(
  () => import('./PublicarPageContent').then((mod) => mod.PublicarProdutoPage),
  { ssr: false } 
);

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-zinc-400">Carregando módulo de publicação...</div>}>
      <PublicarContentDynamic />
    </Suspense>
  );
}