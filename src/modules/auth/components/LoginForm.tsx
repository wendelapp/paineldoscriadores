// src/modules/auth/components/LoginForm.tsx
"use client";

import { useState } from "react";
import { auth, signInWithEmailAndPassword } from "../../../lib/firebase";

import { useRouter } from "next/navigation";

interface LoginFormProps {
  onForgotPassword: () => void;
}

export default function LoginForm({ onForgotPassword }: LoginFormProps) {
  const router = useRouter(); // <-- Adicione esta linha
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "auth/invalid-email":
        return "Por favor, insira um e-mail válido.";
      case "auth/user-not-found":
      case "auth/invalid-credential":
      case "auth/wrong-password":
        return "E-mail ou senha incorretos. Verifique seus dados.";
      case "auth/too-many-requests":
        return "Muitas tentativas malsucedidas. Aguarde alguns minutos.";
      default:
        return "Ocorreu um erro ao tentar entrar. Tente novamente.";
    }
  };
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      setMessage({
        type: "success",
        text: "Login realizado com sucesso! Redirecionando...",
      });

      // --- CÓDIGO NOVO: REDIRECIONAMENTO PARA O PAINEL ---
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
      // --- FIM DO CÓDIGO NOVO ---

    } catch (error: any) {
      setMessage({
        type: "error",
        text: getErrorMessage(error.code),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-zinc-900 rounded-xl shadow-xl border border-zinc-800">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Acessar Painel</h2>
        <p className="text-zinc-400 text-sm mt-2">Bem-vindo de volta, criador.</p>
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
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Senha</label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors pr-12"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 p-1 text-zinc-400 hover:text-zinc-100 transition-colors focus:outline-none"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg shadow-md transition-colors mt-2"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      {/* Botão de Esqueceu a Senha integrado com segurança */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          Esqueceu a senha?
        </button>
      </div>
    </div>
  );
}