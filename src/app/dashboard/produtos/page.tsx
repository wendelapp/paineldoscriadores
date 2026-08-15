// src/app/dashboard/produtos/page.tsx
"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import MeusProdutosContent from "./components/MeusProdutosContent";

interface Produto {
  id: string;
  titulo: string;
  precoPor: string;
  precoDe: string;
  urlAfiliado: string;
  urlImagem: string;
  visualizacoes?: number;
  cliques?: number;
  createdAt?: string;
  ativo: boolean;
}

// PRODUTOS FAKE PARA TESTE VISUAL IMEDIATO
const PRODUTOS_FAKE: Produto[] = [
  {
    id: "fake-1",
    titulo: "Kit Cápsulas Detox Turbo - 5 Meses de Tratamento Avançado",
    precoPor: "147,90",
    precoDe: "297,00",
    urlAfiliado: "https://pay.hotmart.com/exemplo1",
    urlImagem: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60",
    visualizacoes: 420,
    cliques: 85,
    createdAt: "12/03/2026",
    ativo: true,
  },
  {
    id: "fake-2",
    titulo: "Curso Fórmula Lucrando em Casa do Zero ao Avançado",
    precoPor: "97,00",
    precoDe: "497,00",
    urlAfiliado: "https://pay.hotmart.com/exemplo2",
    urlImagem: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60",
    visualizacoes: 1250,
    cliques: 310,
    createdAt: "10/03/2026",
    ativo: true,
  },
  {
    id: "fake-3",
    titulo: "Sérum Facial Anti-Idade Vitamina C Pura 30ml",
    precoPor: "89,90",
    precoDe: "159,90",
    urlAfiliado: "https://amzn.to/exemplo3",
    urlImagem: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=60",
    visualizacoes: 210,
    cliques: 45,
    createdAt: "08/03/2026",
    ativo: true,
  },
  {
    id: "fake-4",
    titulo: "Fone Bluetooth Gamer Esportivo Pro Sem Fio TWS",
    precoPor: "119,90",
    precoDe: "249,90",
    urlAfiliado: "https://shopee.com.br/exemplo4",
    urlImagem: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60",
    visualizacoes: 890,
    cliques: 192,
    createdAt: "05/03/2026",
    ativo: true,
  },
  {
    id: "fake-5",
    titulo: "Smartwatch Relógio Inteligente D20 Y68 Bluetooth",
    precoPor: "69,90",
    precoDe: "129,90",
    urlAfiliado: "https://mercadolivre.com.br/exemplo5",
    urlImagem: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
    visualizacoes: 540,
    cliques: 98,
    createdAt: "01/03/2026",
    ativo: true,
  }
];

export default function MeusProdutosPage() {
  // Já inicia com os produtos fake e carregamento falso para ser INSTANTÂNEO!
  const [produtos, setProdutos] = useState<Produto[]>(PRODUTOS_FAKE);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const q = query(collection(db, "produtos"), where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const lista: Produto[] = [];
          querySnapshot.forEach((docSnap) => {
            lista.push({ id: docSnap.id, ...docSnap.data() } as Produto);
          });
          
          // Se o usuário tiver produtos reais, usamos eles. Senão, injetamos os fakes para visualização!
          if (lista.length > 0) {
            setProdutos(lista);
          } else {
            setProdutos(PRODUTOS_FAKE);
          }
        } catch (error) {
          console.error("Erro ao carregar produtos:", error);
          setProdutos(PRODUTOS_FAKE); // Fallback em caso de erro
        } finally {
          setCarregando(false);
        }
      } else {
        // Se não estiver logado, exibe os fakes para teste de layout
        setProdutos(PRODUTOS_FAKE);
        setCarregando(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleDeletar = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este produto da sua vitrine?")) return;
    try {
      if (!id.startsWith("fake-")) {
        await deleteDoc(doc(db, "produtos", id));
      }
      setProdutos((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      alert("Erro ao deletar produto.");
    }
  };

  const handleRepublicar = (id: string) => {
    alert(`Produto ${id} pronto para republicação rápida!`);
  };

  return (
    <MeusProdutosContent
      produtos={produtos}
      carregando={carregando}
      onDeletar={handleDeletar}
      onRepublicar={handleRepublicar}
    />
  );
}