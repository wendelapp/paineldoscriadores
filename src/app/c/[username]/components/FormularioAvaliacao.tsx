"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface FormularioAvaliacaoProps {
  userId: string;
  onAvaliacaoEnviada: () => void;
}

export default function FormularioAvaliacao({ userId, onAvaliacaoEnviada }: FormularioAvaliacaoProps) {
  const [nomeCliente, setNomeCliente] = useState("");
  const [comentario, setComentario] = useState("");
  const [nota, setNota] = useState(5);
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !nomeCliente.trim() || !comentario.trim()) return;

    setEnviando(true);
    try {
      await addDoc(collection(db, "users", userId, "avaliacoes"), {
        nomeCliente: nomeCliente.trim(),
        comentario: comentario.trim(),
        nota: Number(nota),
        dataCriacao: serverTimestamp()
      });

      setNomeCliente("");
      setComentario("");
      setNota(5);
      setSucesso(true);
      onAvaliacaoEnviada(); // Atualiza a lista na tela

      setTimeout(() => setSucesso(false), 4000);
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      alert("Erro ao enviar sua avaliação. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-5 shadow-xl mb-6 space-y-4">
      <h3 className="text-xs font-bold text-white uppercase tracking-wider">Deixe sua experiência de compra</h3>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-[11px] font-medium text-zinc-300 mb-1">Seu Nome</label>
          <input 
            type="text" 
            value={nomeCliente}
            onChange={(e) => setNomeCliente(e.target.value)}
            placeholder="Ex: João da Silva"
            maxLength={40}
            required
            className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700/80 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-4">
          <div>
            <label className="block text-[11px] font-medium text-zinc-300 mb-1">Nota (Estrelas)</label>
            <select 
              value={nota}
              onChange={(e) => setNota(Number(e.target.value))}
              className="px-3 py-2 text-xs bg-zinc-900 border border-zinc-700/80 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value={5}>★★★★★ (5/5)</option>
              <option value={4}>★★★★☆ (4/5)</option>
              <option value={3}>★★★☆☆ (3/5)</option>
              <option value={2}>★★☆☆☆ (2/5)</option>
              <option value={1}>★☆☆☆☆ (1/5)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-zinc-300 mb-1">Seu Comentário / Experiência</label>
          <textarea 
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="O produto chegou rápido? O suporte ajudou? Conte como foi..."
            maxLength={300}
            required
            className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700/80 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-600 min-h-20 resize-y"
          />
        </div>

        {sucesso && (
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs font-medium text-center">
            🎉 Avaliação enviada com sucesso! Obrigado pelo feedback.
          </div>
        )}

        <button 
          type="submit" 
          disabled={enviando || !nomeCliente.trim() || !comentario.trim()}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-lg"
        >
          {enviando ? "Enviando..." : "Enviar Avaliação"}
        </button>
      </form>
    </div>
  );
}