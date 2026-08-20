"use client";

import { useState } from "react";
import { auth, db, createUserWithEmailAndPassword, doc, setDoc, collection, query, where, getDocs } from "../../../lib/firebase";
import TermsModal, { LegalType } from "./TermsModal"; 

// O SEGREDO ESTÁ AQUI: Avisar ao TypeScript que o onOpenLegal existe!
interface RegisterFormProps {
  onRegisterSuccess: () => void;
  onOpenLegal?: (type: LegalType) => void;
}

export default function RegisterForm({ onRegisterSuccess, onOpenLegal }: RegisterFormProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const isPasswordValid = password.length >= 6 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "Este e-mail já está cadastrado. Faça login em vez de criar conta.";
      case "auth/invalid-email":
        return "Por favor, insira um e-mail válido.";
      default:
        return "Ocorreu um erro ao tentar criar a conta. Tente novamente.";
    }
  };

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) return;
    
    setLoading(true);
    setMessage(null);

    try {
      // --- CÓDIGO NOVO: VERIFICAÇÃO DE SLUG ---
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("slug", "==", slug));
      const querySnapshot = await getDocs(q);

      // Se encontrar algum documento (!empty) com esse slug, barra o cadastro
      if (!querySnapshot.empty) {
        setMessage({
          type: "error",
          text: "Este link já está em uso. Por favor, escolha outro.",
        });
        setLoading(false);
        return; // O "return" faz a função parar aqui e não criar a conta
      }
      // --- FIM DO CÓDIGO NOVO ---

      // 1. Passa na "Catraca": Cria o login com e-mail e senha
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Preenche a "Ficha Cadastral": Salva os dados no banco Firestore
      // Estamos criando uma pasta chamada "users" e guardando os dados lá
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        slug: slug,
        email: email,
        createdAt: new Date().toISOString()
      });
      
      setMessage({
        type: "success",
        text: "Conta criada e dados salvos com sucesso!",
      });

      // 3. Espera 1 segundo para o usuário ler a mensagem verde e vai para a tela de preços
      setTimeout(() => {
        onRegisterSuccess();
      }, 1000);

    } catch (error: any) {
      setMessage({
        type: "error",
        text: getErrorMessage(error.code),
      });
      setLoading(false);
    }
  };
  return (
    <>
      <div className="w-full max-w-md p-8 space-y-6 bg-zinc-900 rounded-xl shadow-xl border border-zinc-800">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Criar Conta</h2>
          <p className="text-zinc-400 text-sm mt-2">Crie seu perfil e escolha seu plano.</p>
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-sm font-medium ${message.type === "success" ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800" : "bg-rose-950/80 text-rose-400 border border-rose-800"}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Novos Campos: Nome e Link/Slug */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Nome de Exibição</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Seu Nome" className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Link (Slug)</label>
              <input type="text" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, ''))} required placeholder="seunome" className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">E-mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="seu@email.com" className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors" />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Senha</label>
            <div className="relative flex items-center">
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors pr-12" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 p-1 text-zinc-400 hover:text-zinc-100 transition-colors focus:outline-none">
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {/* Texto discreto e dinâmico */}
            <p className={`text-[11px] mt-1.5 transition-colors ${password.length === 0 ? "text-zinc-500" : isPasswordValid ? "text-emerald-400" : "text-rose-400"}`}>
              {password.length > 0 && isPasswordValid ? "✓ Senha forte e segura" : "Mínimo de 6 caracteres, contendo letras e números."}
            </p>
          </div>

          <div className="flex items-start mt-4">
            <input type="checkbox" id="terms" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-1 w-4 h-4 text-blue-600 bg-zinc-800 border-zinc-700 rounded focus:ring-blue-500" />
            <label htmlFor="terms" className="ml-2 text-sm text-zinc-400">
              Eu concordo com os <button type="button" onClick={() => setIsTermsModalOpen(true)} className="text-blue-400 hover:underline">Termos de Uso</button>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={loading || !termsAccepted || !isPasswordValid} 
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors mt-4"
          >
            {loading ? "Salvando..." : "Criar Minha Conta"}
          </button>
        </form>
      </div>

      <TermsModal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} type={"termos"} />
    </>
  );
}