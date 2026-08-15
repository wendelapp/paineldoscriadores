// src/app/page.tsx
"use client";

import { useState } from "react";
import LoginForm from "../modules/auth/components/LoginForm";
import RegisterForm from "../modules/auth/components/RegisterForm";
import ForgotPasswordForm from "../modules/auth/components/ForgotPasswordForm";
import PricingCard from "../modules/auth/subscription/PricingCard";

export default function Home() {
  const [view, setView] = useState<"login" | "register" | "forgot" | "pricing">("login");

  return (
    <main className="flex min-h-screen items-center justify-center bg-black p-4 flex-col">
      {view === "login" && <LoginForm onForgotPassword={() => setView("forgot")} />}
      {view === "register" && <RegisterForm onRegisterSuccess={() => setView("pricing")} />}
      {view === "forgot" && <ForgotPasswordForm onBack={() => setView("login")} />}
      {view === "pricing" && <PricingCard />}

      {(view === "login" || view === "register") && (
        <button 
          onClick={() => setView(view === "login" ? "register" : "login")}
          className="mt-6 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          {view === "login" ? "Não tem uma conta? Cadastre-se" : "Já tem uma conta? Faça login"}
        </button>
      )}

      {view === "pricing" && (
        <button 
          onClick={() => setView("login")}
          className="mt-6 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          Voltar para o login
        </button>
      )}
    </main>
  );
}