"use client";

interface ModalResponderAvaliacaoProps {
  isOpen: boolean;
  onClose: () => void;
  textoResposta: string;
  setTextoResposta: (texto: string) => void;
  onEnviar: () => void;
  salvando: boolean;
}

export default function ModalResponderAvaliacao({
  isOpen,
  onClose,
  textoResposta,
  setTextoResposta,
  onEnviar,
  salvando
}: ModalResponderAvaliacaoProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl p-5 space-y-4">
        
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="text-sm font-black text-white">Responder Avaliação do Cliente</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white cursor-pointer">✕</button>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-zinc-300 mb-1">Sua Resposta</label>
          <textarea
            value={textoResposta}
            onChange={(e) => setTextoResposta(e.target.value)}
            placeholder="Digite sua resposta oficial que aparecerá na sua vitrine pública..."
            className="w-full p-3 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-600 min-h-30 resize-y"
            autoFocus
          />
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs font-bold rounded-lg cursor-pointer transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onEnviar}
            disabled={salvando || !textoResposta.trim()}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-lg"
          >
            {salvando ? "Enviando..." : "Publicar Resposta"}
          </button>
        </div>

      </div>
    </div>
  );
}