// src/app/dashboard/perfil/page.tsx
"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import PerfilContent from "./components/PerfilContent";

// Dados de exemplo para aparecer rápido no teste
const PERFIL_FAKE = {
  nome: "Seu Nome Aqui",
  usuario: "seunome",
  bio: "Especialista em achar os melhores produtos com desconto!",
  isVerified: false,
};

export default function PerfilPage() {
  // Já inicia com os dados fake e carregamento falso para ser INSTANTÂNEO!
  const [dadosPerfil, setDadosPerfil] = useState<any>(PERFIL_FAKE); 
  const [carregando, setCarregando] = useState(false);
  const [userUid, setUserUid] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserUid(user.uid);
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setDadosPerfil(docSnap.data());
          } else {
            setDadosPerfil(PERFIL_FAKE); // Se não tiver no banco, usa o fake
          }
        } catch (error) {
          console.error("Erro ao buscar perfil:", error);
          setDadosPerfil(PERFIL_FAKE);
        } finally {
          setCarregando(false);
        }
      } else {
        setDadosPerfil(PERFIL_FAKE);
        setCarregando(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSalvarPerfil = async (novosDados: any) => {
    if (userUid) {
      try {
        const docRef = doc(db, "users", userUid);
        await updateDoc(docRef, novosDados);
        setDadosPerfil({ ...dadosPerfil, ...novosDados });
      } catch (error) {
        console.error("Erro ao salvar:", error);
      }
    } else {
      // Atualiza apenas localmente se for o perfil fake
      setDadosPerfil({ ...dadosPerfil, ...novosDados });
    }
  };

  return (
    <PerfilContent 
      dadosPerfil={dadosPerfil} 
      carregando={carregando} 
      onSalvar={handleSalvarPerfil} 
    />
  );
}