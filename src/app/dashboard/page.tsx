// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import VisaoGeralContent from "./components/VisaoGeralContent";

interface Produto {
  id: string;
  titulo: string;
  precoPor: string;
  precoDe: string;
  urlAfiliado: string;
  urlImagem: string;
  ativo: boolean;
}

export default function DashboardPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const q = query(collection(db, "produtos"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const lista: Produto[] = [];
        querySnapshot.forEach((doc) => {
          lista.push({ id: doc.id, ...doc.data() } as Produto);
        });
        setProdutos(lista);
        setCarregando(false);
      } else {
        setCarregando(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return <VisaoGeralContent produtos={produtos} carregando={carregando} />;
}