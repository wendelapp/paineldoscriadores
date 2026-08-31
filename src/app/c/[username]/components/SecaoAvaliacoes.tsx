"use client";

import { useState } from "react";
import FormularioAvaliacao from "./FormularioAvaliacao";

interface Avaliacao {
  id: string;
  nomeCliente: string;
  comentario: string;
  nota: number;
  respostaCriador?: string;
  dataCriacao?: any;
}

interface SecaoAvaliacoesProps {
  avaliacoes: Avaliacao[];
  userId: string;
  nomeCriador: string; // 👈 Adicionada a propriedade do nome real
  onAvaliacaoEnviada: () => void;
}

export default function SecaoAvaliacoes({ avaliacoes, userId, nomeCriador, onAvaliacaoEnviada }: SecaoAvaliacoesProps) {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  const indexOfLastItem = paginaAtual * itensPorPagina;
  const indexOfFirstItem = indexOfLastItem - itensPorPagina;
  const avaliacoesAtuais = avaliacoes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPaginas = Math.ceil(avaliacoes.length / itensPorPagina);

  const formatarDataHora = (timestamp: any) => {
    if (!timestamp?.seconds) return "Recentemente";
    return new Date(timestamp.seconds * 1000).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto w-full">
      <div className="text-center space-y-1">
        <h2 className="text-sm font-bold text-zinc-300">Experiência de Compra dos Clientes</h2>
        <p className="text-[11px] text-zinc-500">Veja o feedback de quem já comprou com este criador ou deixe sua avaliação.</p>
      </div>

      <FormularioAvaliacao userId={userId} onAvaliacaoEnviada={onAvaliacaoEnviada} />

      <div className="space-y-3">
        {avaliacoes.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 bg-zinc-950/80 rounded-xl border border-zinc-800 text-xs">
            Ainda não há avaliações publicadas. Seja o primeiro a avaliar!
          </div>
        ) : (
          <>
            {avaliacoesAtuais.map((av) => (
              <div key={av.id} className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl space-y-2 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{av.nomeCliente || "Cliente Verificado"}</span>
                  <span className="text-[10px] text-zinc-500">{formatarDataHora(av.dataCriacao)}</span>
                </div>
                <div className="text-yellow-500 text-xs">
                  {"★".repeat(av.nota || 5)}{"☆".repeat(5 - (av.nota || 5))}
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">"{av.comentario}"</p>

                {/* EXIBE A RESPOSTA COM O NOME REAL DO CRIADOR */}
                {av.respostaCriador && (
                  <div className="ml-4 pl-3 border-l-2 border-blue-500 bg-blue-950/20 p-2 rounded-r-lg space-y-0.5 mt-2">
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                      Resposta de {nomeCriador || "Criador"}:
                    </p>
                    <p className="text-xs text-zinc-300 leading-relaxed">{av.respostaCriador}</p>
                  </div>
                )}
              </div>
            ))}

            {totalPaginas > 1 && (
              <div className="flex justify-center gap-3 pt-4">
                <button
                  disabled={paginaAtual === 1}
                  onClick={() => setPaginaAtual(p => p - 1)}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-xs font-bold text-white rounded-lg disabled:opacity-30 cursor-pointer hover:bg-zinc-800"
                >
                  ← Anterior
                </button>
                <span className="text-xs text-zinc-400 self-center font-bold">
                  Página {paginaAtual} de {totalPaginas}
                </span>
                <button
                  disabled={paginaAtual === totalPaginas}
                  onClick={() => setPaginaAtual(p => p + 1)}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-xs font-bold text-white rounded-lg disabled:opacity-30 cursor-pointer hover:bg-zinc-800"
                >
                  Próxima →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}