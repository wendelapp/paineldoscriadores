"use client";

import { useState } from "react";

interface VitrineAbasProps {
  abaAtiva: 'home' | 'categorias' | 'avaliacoes';
  setAbaAtiva: (aba: 'home' | 'categorias' | 'avaliacoes') => void;
  totalAvaliacoes: number;
  categoriasDisponiveis: string[];
  categoriaSelecionada: string | null;
  setCategoriaSelecionada: (cat: string | null) => void;
}

export default function VitrineAbas({ 
  abaAtiva, 
  setAbaAtiva, 
  totalAvaliacoes, 
  categoriasDisponiveis, 
  categoriaSelecionada, 
  setCategoriaSelecionada 
}: VitrineAbasProps) {
  
  const [modalCategoriasAberto, setModalCategoriasAberto] = useState(false);

  const handleCliqueCategorias = () => {
    setAbaAtiva('categorias');
    setModalCategoriasAberto(true);
  };

  return (
    <>
      <div className="flex items-center justify-center gap-2 border-b border-zinc-800/80 pb-4 w-full">
        <button
          onClick={() => {
            setAbaAtiva('home');
            setCategoriaSelecionada(null);
          }}
          className={`px-5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            abaAtiva === 'home'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 border border-blue-500'
              : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
          }`}
        >
          🏠 Home
        </button>
        
        <button
          onClick={handleCliqueCategorias}
          className={`px-5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            abaAtiva === 'categorias'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 border border-blue-500'
              : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
          }`}
        >
          🏷️ {categoriaSelecionada ? `Cat: ${categoriaSelecionada}` : 'Categorias'}
        </button>

        <button
          onClick={() => {
            setAbaAtiva('avaliacoes');
            setCategoriaSelecionada(null);
          }}
          className={`px-5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            abaAtiva === 'avaliacoes'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 border border-blue-500'
              : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
          }`}
        >
          ⭐ Avaliações ({totalAvaliacoes})
        </button>
      </div>

      {/* MODAL DE ESCOLHA DE CATEGORIAS */}
      {modalCategoriasAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col p-5 space-y-4">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-black text-white">Escolha uma Categoria</h3>
              <button 
                onClick={() => setModalCategoriasAberto(false)} 
                className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              <button
                onClick={() => {
                  setCategoriaSelecionada(null);
                  setModalCategoriasAberto(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-between ${
                  !categoriaSelecionada 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                <span>🔥 Ver Todas as Categorias</span>
                <span>→</span>
              </button>

              {categoriasDisponiveis.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategoriaSelecionada(cat);
                    setModalCategoriasAberto(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-between ${
                    categoriaSelecionada === cat 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  <span>{cat}</span>
                  <span>→</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setModalCategoriasAberto(false)}
              className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Fechar
            </button>

          </div>
        </div>
      )}
    </>
  );
}