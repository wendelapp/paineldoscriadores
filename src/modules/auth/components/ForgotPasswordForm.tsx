// src/modules/auth/components/ForgotPasswordForm.tsx
"use client";

import { useState } from "react";
import { auth, sendPasswordResetEmail } from "../../../lib/firebase";

export default function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage({
        type: "success",
        text: "E-mail de redefinição enviado! Verifique sua caixa de entrada.",
      });
    } catch (error: any) {
      setMessage({
        type: "error",
        text: "Não conseguimos enviar o e-mail. Verifique se o endereço está correto.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-zinc-900 rounded-xl shadow-xl border border-zinc-800">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Recuperar Senha</h2>
        <p className="text-zinc-400 text-sm mt-2">Enviaremos um link de recuperação para seu e-mail.</p>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm font-medium ${message.type === "success" ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800" : "bg-rose-950/80 text-rose-400 border border-rose-800"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
            placeholder="seu@email.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg shadow-md transition-colors"
        >
          {loading ? "Enviando..." : "Enviar link de recuperação"}
        </button>
      </form>

      <button onClick={onBack} className="w-full text-sm text-zinc-400 hover:text-white transition-colors">
        Voltar para o Login
      </button>
    </div>
  );
}