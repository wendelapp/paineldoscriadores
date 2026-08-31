"use client";

import { useState, useEffect, useRef } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, deleteDoc, doc, updateDoc, getDoc, query, orderBy, serverTimestamp } from "firebase/firestore";
import ModalResponderAvaliacao from "../../c/[username]/components/ModalResponderAvaliacao";

interface Avaliacao {
  id: string;
  nomeCliente: string;
  comentario: string;
  nota: number;
  respostaCriador?: string;
  dataResposta?: any;
  dataCriacao?: any;
}

export default function DashboardAvaliacoesPage() {
  const [userUid, setUserUid] = useState<string | null>(null);
  const [nomeCriador, setNomeCriador] = useState<string>("Criador");
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Estados de Filtro e Paginação
  const [filtroPeriodo, setFiltroPeriodo] = useState<'todos' | '15' | '30'>('todos');
  const [itensPorPagina, setItensPorPagina] = useState<number>(10);
  const [paginaAtual, setPaginaAtual] = useState<number>(1);

  // Estados do Menu e Modal de Resposta
  const [menuAbertoId, setMenuAbertoId] = useState<string | null>(null);
  const [produtoRespondendo, setProdutoRespondendo] = useState<Avaliacao | null>(null);
  const [textoResposta, setTextoResposta] = useState("");
  const [salvandoResposta, setSalvandoResposta] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuAbertoId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserUid(user.uid);
        carregarDadosPerfil(user.uid);
        carregarAvaliacoes(user.uid);
      } else {
        setUserUid(null);
        setCarregando(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const carregarDadosPerfil = async (uid: string) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        if (data.nome) {
          setNomeCriador(data.nome);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar perfil do criador:", error);
    }
  };

  const carregarAvaliacoes = async (uid: string) => {
    setCarregando(true);
    try {
      const q = query(collection(db, "users", uid, "avaliacoes"), orderBy("dataCriacao", "desc"));
      const querySnapshot = await getDocs(q);
      const lista: Avaliacao[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        lista.push({
          id: docSnap.id,
          nomeCliente: data.nomeCliente || "Cliente",
          comentario: data.comentario || "",
          nota: data.nota || 5,
          respostaCriador: data.respostaCriador || "",
          dataResposta: data.dataResposta,
          dataCriacao: data.dataCriacao
        });
      });
      setAvaliacoes(lista);
    } catch (error) {
      console.error("Erro ao carregar avaliações:", error);
    } finally {
      setCarregando(false);
    }
  };

  const handleExcluir = async (id: string) => {
    if (!userUid) return;
    const confirmar = window.confirm("Deseja realmente excluir esta avaliação?");
    if (!confirmar) return;

    try {
      await deleteDoc(doc(db, "users", userUid, "avaliacoes", id));
      setAvaliacoes(avaliacoes.filter(av => av.id !== id));
      setMenuAbertoId(null);
    } catch (error) {
      console.error("Erro ao excluir avaliação:", error);
      alert("Erro ao excluir.");
    }
  };

  const handleSalvarResposta = async () => {
    if (!userUid || !produtoRespondendo || !textoResposta.trim()) return;
    setSalvandoResposta(true);
    try {
      const avRef = doc(db, "users", userUid, "avaliacoes", produtoRespondendo.id);
      await updateDoc(avRef, {
        respostaCriador: textoResposta.trim(),
        nomeCriadorResposta: nomeCriador, // Salva o nome real do criador no banco
        dataResposta: serverTimestamp()
      });

      setAvaliacoes(avaliacoes.map(av => av.id === produtoRespondendo.id ? { ...av, respostaCriador: textoResposta.trim() } : av));
      setProdutoRespondendo(null);
      setTextoResposta("");
    } catch (error) {
      console.error("Erro ao responder:", error);
      alert("Erro ao enviar resposta.");
    } finally {
      setSalvandoResposta(false);
    }
  };

  // Filtragem por Período
  const agora = Date.now();
  const avaliacoesFiltradas = avaliacoes.filter(av => {
    if (filtroPeriodo === 'todos') return true;
    if (!av.dataCriacao?.seconds) return true;

    const dataAvaliacao = av.dataCriacao.seconds * 1000;
    const diasAtras = (agora - dataAvaliacao) / (1000 * 60 * 60 * 24);

    if (filtroPeriodo === '15') return diasAtras <= 15;
    if (filtroPeriodo === '30') return diasAtras <= 30;
    return true;
  });

  const indiceUltimoItem = paginaAtual * itensPorPagina;
  const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
  const avaliacoesPaginadas = avaliacoesFiltradas.slice(indicePrimeiroItem, indiceUltimoItem);
  const totalPaginas = Math.ceil(avaliacoesFiltradas.length / itensPorPagina) || 1;

  const mediaNotas = avaliacoes.length > 0 
    ? (avaliacoes.reduce((acc, curr) => acc + (curr.nota || 5), 0) / avaliacoes.length).toFixed(1) 
    : "5.0";

  const formatarDataHora = (timestamp: any) => {
    if (!timestamp?.seconds) return "Recentemente";
    return new Date(timestamp.seconds * 1000).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 space-y-4">
      
      {/* CABEÇALHO COMPACTO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-4 shadow-xl">
        <div className="space-y-0.5">
          <h1 className="text-lg md:text-xl font-black text-white tracking-tight">
            Avaliações de Clientes
          </h1>
          <p className="text-xs text-zinc-400">
            Acompanhe o feedback e interaja com os depoimentos dos compradores.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl flex items-center gap-4 shrink-0">
          <div>
            <p className="text-[9px] text-zinc-400 uppercase font-bold">Média</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-sm font-black text-white">{mediaNotas}</span>
              <span className="text-yellow-500 text-xs">★</span>
            </div>
          </div>
          <div className="h-6 w-px bg-zinc-800" />
          <div>
            <p className="text-[9px] text-zinc-400 uppercase font-bold">Total</p>
            <p className="text-sm font-black text-blue-500">{avaliacoes.length}</p>
          </div>
        </div>
      </div>

      {/* BARRA DE FILTROS E PAGINAÇÃO SLIM */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-zinc-950/60 border border-zinc-800/80 p-2.5 rounded-xl">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button 
            onClick={() => { setFiltroPeriodo('todos'); setPaginaAtual(1); }}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer flex-1 sm:flex-none ${filtroPeriodo === 'todos' ? 'bg-blue-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}
          >
            Todas
          </button>
          <button 
            onClick={() => { setFiltroPeriodo('15'); setPaginaAtual(1); }}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer flex-1 sm:flex-none ${filtroPeriodo === '15' ? 'bg-blue-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}
          >
            15 Dias
          </button>
          <button 
            onClick={() => { setFiltroPeriodo('30'); setPaginaAtual(1); }}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer flex-1 sm:flex-none ${filtroPeriodo === '30' ? 'bg-blue-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}
          >
            30 Dias
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-zinc-400 font-medium">Exibir:</span>
          <select 
            value={itensPorPagina}
            onChange={(e) => { setItensPorPagina(Number(e.target.value)); setPaginaAtual(1); }}
            className="px-2.5 py-1 text-xs bg-zinc-900 border border-zinc-700/80 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
          >
            <option value={5}>5 por pág</option>
            <option value={10}>10 por pág</option>
            <option value={20}>20 por pág</option>
            <option value={50}>50 por pág</option>
          </select>
        </div>
      </div>

      {/* LISTA SLIM COM 3 PONTINHOS */}
      <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl overflow-hidden shadow-xl">
        <div className="px-4 py-3 border-b border-zinc-800/80 bg-zinc-900/30 flex items-center justify-between">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">Mensagens ({avaliacoesFiltradas.length})</h2>
          <span className="text-[10px] text-zinc-500">Página {paginaAtual} de {totalPaginas}</span>
        </div>

        <div className="p-3">
          {carregando ? (
            <div className="p-8 text-center text-zinc-500 text-xs">Carregando mensagens...</div>
          ) : avaliacoesFiltradas.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-xs">
              Nenhuma avaliação encontrada neste período.
            </div>
          ) : (
            <div className="space-y-2">
              {avaliacoesPaginadas.map((av) => (
                <div key={av.id} className="bg-zinc-900/90 border border-zinc-800/70 rounded-lg p-3 flex flex-col gap-2 relative">
                  
                  {/* CABEÇALHO DO ITEM */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{av.nomeCliente}</span>
                      <span className="text-yellow-500 text-xs">
                        {"★".repeat(av.nota || 5)}{"☆".repeat(5 - (av.nota || 5))}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-zinc-500">{formatarDataHora(av.dataCriacao)}</span>
                      
                      {/* BOTÃO 3 PONTINHOS */}
                      <div className="relative" ref={menuRef}>
                        <button
                          onClick={() => setMenuAbertoId(menuAbertoId === av.id ? null : av.id)}
                          className="w-7 h-7 bg-zinc-800 hover:bg-zinc-700 rounded-md text-zinc-300 flex items-center justify-center font-bold cursor-pointer transition-colors"
                          title="Opções"
                        >
                          ⋮
                        </button>

                        {/* MENU POPUP DOS 3 PONTINHOS */}
                        {menuAbertoId === av.id && (
                          <div className="absolute right-0 mt-1 w-36 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl z-20 py-1 overflow-hidden">
                            <button
                              onClick={() => {
                                setProdutoRespondendo(av);
                                setTextoResposta(av.respostaCriador || "");
                                setMenuAbertoId(null);
                              }}
                              className="w-full text-left px-3 py-2 text-xs text-zinc-200 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer flex items-center gap-2"
                            >
                              <span>💬</span> Responder
                            </button>
                            <button
                              onClick={() => handleExcluir(av.id)}
                              className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer flex items-center gap-2"
                            >
                              <span>🗑️</span> Excluir
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* COMENTÁRIO DO CLIENTE */}
                  <p className="text-xs text-zinc-300 bg-zinc-950/40 p-2.5 rounded border border-zinc-800/40 leading-relaxed">
                    "{av.comentario}"
                  </p>

                  {/* RESPOSTA DO CRIADOR COM O NOME REAL */}
                  {av.respostaCriador && (
                    <div className="ml-4 pl-3 border-l-2 border-blue-500 bg-blue-950/20 p-2 rounded-r-lg space-y-0.5">
                      <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Resposta de {nomeCriador}:</p>
                      <p className="text-xs text-zinc-300 leading-relaxed">{av.respostaCriador}</p>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>

        {/* PAGINAÇÃO INFERIOR COMPACTA */}
        {totalPaginas > 1 && (
          <div className="p-3 border-t border-zinc-800/80 bg-zinc-900/30 flex items-center justify-center gap-3">
            <button
              disabled={paginaAtual === 1}
              onClick={() => setPaginaAtual(p => p - 1)}
              className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-xs font-bold text-white rounded-lg disabled:opacity-30 cursor-pointer hover:bg-zinc-800"
            >
              ← Anterior
            </button>
            <span className="text-xs text-zinc-400 font-bold">{paginaAtual} / {totalPaginas}</span>
            <button
              disabled={paginaAtual === totalPaginas}
              onClick={() => setPaginaAtual(p => p + 1)}
              className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-xs font-bold text-white rounded-lg disabled:opacity-30 cursor-pointer hover:bg-zinc-800"
            >
              Próxima →
            </button>
          </div>
        )}

      </div>

      {/* MODAL DE RESPOSTA */}
      <ModalResponderAvaliacao
        isOpen={Boolean(produtoRespondendo)}
        onClose={() => setProdutoRespondendo(null)}
        textoResposta={textoResposta}
        setTextoResposta={setTextoResposta}
        onEnviar={handleSalvarResposta}
        salvando={salvandoResposta}
      />

    </div>
  );
}