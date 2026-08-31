"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";

interface Produto {
  id: string;
  titulo: string;
  categoria: string;
  descricao: string;
  urlImagem: string;
}

export default function CategoriasEDetalhesPage() {
  const [userUid, setUserUid] = useState<string | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Estados de Paginação e Filtro de Categoria Slim
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>("todas");
  const [itensPorPagina, setItensPorPagina] = useState<number>(10);
  const [paginaAtual, setPaginaAtual] = useState<number>(1);

  // Estados do Modal de Detalhes
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [novaDescricao, setNovaDescricao] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserUid(user.uid);
        carregarProdutos(user.uid);
      } else {
        setUserUid(null);
        setCarregando(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const carregarProdutos = async (uid: string) => {
    setCarregando(true);
    try {
      const q = query(collection(db, "users", uid, "produtos"), orderBy("dataPublicacao", "desc"));
      const querySnapshot = await getDocs(q);
      const lista: Produto[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        lista.push({
          id: doc.id,
          titulo: data.titulo || "Sem Título",
          categoria: data.categoria || "📌 Outros",
          descricao: data.descricao || "",
          urlImagem: data.urlImagem || ""
        });
      });
      setProdutos(lista);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setCarregando(false);
    }
  };

  const abrirModalDetalhes = (produto: Produto) => {
    setProdutoSelecionado(produto);
    setNovaDescricao(produto.descricao);
  };

  const salvarDetalhes = async () => {
    if (!userUid || !produtoSelecionado) return;
    setSalvando(true);
    try {
      const prodRef = doc(db, "users", userUid, "produtos", produtoSelecionado.id);
      await updateDoc(prodRef, { descricao: novaDescricao });
      
      setProdutos(produtos.map(p => p.id === produtoSelecionado.id ? { ...p, descricao: novaDescricao } : p));
      setProdutoSelecionado(null);
      alert("Detalhes salvos com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar detalhes:", error);
      alert("Erro ao salvar os detalhes.");
    } finally {
      setSalvando(false);
    }
  };

  // Extrair lista de categorias únicas
  const categoriasPresentes = Array.from(new Set(produtos.map(p => p.categoria)));

  // Filtrar produtos por categoria selecionada
  const produtosFiltrados = produtos.filter(p => {
    if (categoriaSelecionada === "todas") return true;
    return p.categoria === categoriaSelecionada;
  });

  // Paginação Slim
  const indiceUltimoItem = paginaAtual * itensPorPagina;
  const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
  const produtosPaginados = produtosFiltrados.slice(indicePrimeiroItem, indiceUltimoItem);
  const totalPaginas = Math.ceil(produtosFiltrados.length / itensPorPagina) || 1;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 space-y-4">
      
      {/* CABEÇALHO COMPACTO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-4 shadow-xl">
        <div className="space-y-0.5">
          <h1 className="text-lg md:text-xl font-black text-white tracking-tight">
            Detalhes por Categoria
          </h1>
          <p className="text-xs text-zinc-400">
            Adicione descrições detalhadas aos seus produtos de forma rápida.
          </p>
        </div>

        {/* SELETOR DE QUANTIDADE POR PÁGINA SLIM */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-zinc-400 font-medium">Exibir:</span>
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

      {/* BARRA DE FILTROS DE CATEGORIA SLIM (ABAS HORIZONTAIS) */}
      {!carregando && produtos.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => { setCategoriaSelecionada("todas"); setPaginaAtual(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              categoriaSelecionada === "todas"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800"
            }`}
          >
            Todas ({produtos.length})
          </button>
          {categoriasPresentes.map(cat => {
            const qtd = produtos.filter(p => p.categoria === cat).length;
            return (
              <button
                key={cat}
                onClick={() => { setCategoriaSelecionada(cat); setPaginaAtual(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  categoriaSelecionada === cat
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800"
                }`}
              >
                {cat} ({qtd})
              </button>
            );
          })}
        </div>
      )}

      {/* LISTA DE PRODUTOS COMPACTA (SLIM) */}
      <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl overflow-hidden shadow-xl">
        <div className="px-4 py-3 border-b border-zinc-800/80 bg-zinc-900/30 flex items-center justify-between">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Produtos ({produtosFiltrados.length})
          </h2>
          <span className="text-[10px] text-zinc-500">Página {paginaAtual} de {totalPaginas}</span>
        </div>

        <div className="p-3">
          {carregando ? (
            <div className="p-8 text-center text-zinc-500 text-xs">Carregando produtos...</div>
          ) : produtosFiltrados.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-xs">
              Nenhum produto encontrado nesta categoria.
            </div>
          ) : (
            <div className="space-y-2">
              {produtosPaginados.map(produto => (
                <div 
                  key={produto.id} 
                  className="bg-zinc-900/90 border border-zinc-800/70 rounded-lg p-2.5 flex items-center justify-between gap-3 hover:border-zinc-700 transition-colors"
                >
                  {/* ESQUERDA: IMAGEM E TÍTULO COMPACTOS */}
                  <div className="flex items-center gap-3 min-w-0">
                    {produto.urlImagem ? (
                      <img src={produto.urlImagem} alt={produto.titulo} className="w-10 h-10 rounded-md object-cover bg-zinc-950 border border-zinc-800 shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-zinc-950 border border-zinc-800 flex items-center justify-center text-sm shrink-0">📦</div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{produto.titulo}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-blue-400 font-medium">{produto.categoria}</span>
                        <span className="text-[10px] text-zinc-600">•</span>
                        <span className={`text-[10px] font-semibold ${produto.descricao ? "text-emerald-400" : "text-amber-400"}`}>
                          {produto.descricao ? "✅ Detalhes preenchidos" : "⚠️ Sem detalhes"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* DIREITA: BOTÃO DE EDITAR COMPACTO */}
                  <button 
                    onClick={() => abrirModalDetalhes(produto)}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-[11px] rounded-lg transition-colors cursor-pointer shrink-0 border border-zinc-700/50"
                  >
                    {produto.descricao ? "Editar Detalhes" : "+ Adicionar Detalhes"}
                  </button>
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
              className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-xs font-bold text-white rounded-lg disabled:opacity-30 cursor-pointer hover:bg-zinc-800 transition-colors"
            >
              ← Anterior
            </button>
            <span className="text-xs text-zinc-400 font-bold">
              {paginaAtual} / {totalPaginas}
            </span>
            <button
              disabled={paginaAtual === totalPaginas}
              onClick={() => setPaginaAtual(p => p + 1)}
              className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-xs font-bold text-white rounded-lg disabled:opacity-30 cursor-pointer hover:bg-zinc-800 transition-colors"
            >
              Próxima →
            </button>
          </div>
        )}

      </div>

      {/* MODAL DE EDIÇÃO DE DETALHES */}
      {produtoSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800/80 rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-black text-white">Adicionar Detalhes</h3>
              <button onClick={() => setProdutoSelecionado(null)} className="text-zinc-500 hover:text-white cursor-pointer">✕</button>
            </div>
            
            <div className="p-4 overflow-y-auto space-y-3">
              <p className="text-xs text-zinc-400">
                Produto: <strong className="text-white">{produtoSelecionado.titulo}</strong>
              </p>
              <div>
                <label className="block text-[11px] font-medium text-zinc-300 mb-1">Descrição Completa para a Página de Vendas</label>
                <textarea 
                  value={novaDescricao} 
                  onChange={(e) => setNovaDescricao(e.target.value)} 
                  placeholder="Descreva os benefícios, o que o cliente recebe, diferenciais..." 
                  className="w-full p-3 text-xs bg-zinc-900 border border-zinc-700/80 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-600 min-h-50 resize-y" 
                />
              </div>
            </div>

            <div className="p-4 border-t border-zinc-800 flex gap-3">
              <button 
                onClick={() => setProdutoSelecionado(null)} 
                className="flex-1 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                onClick={salvarDetalhes}
                disabled={salvando}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                {salvando ? "Salvando..." : "Salvar Detalhes"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}