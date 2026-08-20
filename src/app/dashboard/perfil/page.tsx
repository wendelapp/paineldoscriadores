"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import PerfilContent from "./components/PerfilContent";

export default function PerfilPage() {
  const [dadosPerfil, setDadosPerfil] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);
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
            // ...
  setDadosPerfil({
    nome: "",
    usuario: "",
    bio: "",
    avatarUrl: "",
    bannerUrl: "",
    isVerified: false,
    redesSociais: {
      youtube: "",
      instagram: "",
      tiktok: "",
      facebook: "",
      twitter: "",
      telegram: ""
    }
  });
  // ...
          }
        } catch (error) {
          console.error("Erro ao buscar perfil:", error);
        } finally {
          setCarregando(false);
        }
      } else {
        setCarregando(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSalvarPerfil = async (novosDados: any) => {
    if (userUid) {
      try {
        const docRef = doc(db, "users", userUid);
        // Atualiza no Firebase Firestore
        await updateDoc(docRef, novosDados);
        setDadosPerfil({ ...dadosPerfil, ...novosDados });
      } catch (error) {
        console.error("Erro ao salvar:", error);
        alert("Erro ao salvar perfil no banco de dados.");
      }
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