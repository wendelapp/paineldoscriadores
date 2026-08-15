"use client";

import Link from "next/link";

interface Produto {
  id: string;
  titulo: string;
  precoPor: string;
  precoDe: string;
  urlAfiliado: string;
  urlImagem: string;
  ativo: boolean;
}

interface VisaoGeralContentProps {
  produtos: Produto[];
  carregando: boolean;
}

// 📦 DADOS FAKE PARA TESTE DE VISUALIZAÇÃO
const PRODUTOS_FAKE: Produto[] = [
  {
    id: "1",
    titulo: "Kit Cápsulas Detox Turbo - 5 Meses",
    precoDe: "147,90",
    precoPor: "79,90",
    urlImagem: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop",
    urlAfiliado: "#",
    ativo: true
  },
  {
    id: "2",
    titulo: "Fone Bluetooth Gamer Pro Sem Fio",
    precoDe: "119,90",
    precoPor: "49,90",
    urlImagem: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop",
    urlAfiliado: "#",
    ativo: true
  },
  {
    id: "3",
    titulo: "Sérum Facial Anti-Idade Vitamina C",
    precoDe: "89,90",
    precoPor: "39,90",
    urlImagem: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop",
    urlAfiliado: "#",
    ativo: true
  },
  {
    id: "4",
    titulo: "Smartwatch Esportivo 2026",
    precoDe: "299,90",
    precoPor: "149,90",
    urlImagem: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=200&h=200&fit=crop",
    urlAfiliado: "#",
    ativo: true
  },
  {
    id: "5",
    titulo: "Microfone Lapela Sem Fio para Celular",
    precoDe: "99,90",
    precoPor: "59,90",
    urlImagem: "https://images.unsplash.com/photo-1516280440544-3075c3f81e35?w=200&h=200&fit=crop",
    urlAfiliado: "#",
    ativo: true
  }
];

export default function VisaoGeralContent({ produtos, carregando }: VisaoGeralContentProps) {
  // Truque: Se não vier produto real, usa os Fakes para o visual funcionar!
  const produtosExibicao = produtos.length > 0 ? produtos : PRODUTOS_FAKE;
  
  const totalProdutos = produtosExibicao.length;
  
  // Lógica para pegar exatamente os 4 produtos mais recentes
  const ultimosProdutos = produtosExibicao.slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto pb-6 space-y-6">
      
      {/* Cabeçalho de Ações da Visão Geral */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Resumo de Desempenho</h2>
          <p className="text-xs text-zinc-400">
            Acompanhe as métricas da sua vitrine e o status das suas últimas ofertas.
          </p>
        </div>
        <Link
          href="/dashboard/publicar"
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition-colors shadow-lg cursor-pointer"
        >
          ✨ Publicar Nova Oferta
        </Link>
      </div>

      {/* Cards de Métricas Compactos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-4 shadow-xl">
          <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Produtos na Vitrine</p>
          <p className="text-2xl font-black text-white mt-1">{totalProdutos}</p>
          <p className="text-[10px] text-emerald-400 mt-1 font-medium">● Ativos e prontos para conversão</p>
        </div>

        <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-4 shadow-xl">
          <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Visualizações Totais</p>
          <p className="text-2xl font-black text-white mt-1">1.240</p>
          <p className="text-[10px] text-blue-400 mt-1 font-medium">+12% esta semana</p>
        </div>

        <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-4 shadow-xl">
          <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Cliques em Links (CTR)</p>
          <p className="text-2xl font-black text-white mt-1">348</p>
          <p className="text-[10px] text-purple-400 mt-1 font-medium">28% taxa de conversão</p>
        </div>
      </div>

      {/* Seção de Ofertas Recentes (Máximo 4) */}
      <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Suas Últimas 4 Ofertas</h3>
          <span className="text-[11px] text-zinc-500 font-medium">{totalProdutos} cadastradas no total</span>
        </div>

        {carregando ? (
          <div className="py-8 text-center text-xs text-zinc-500">Carregando dados da vitrine...</div>
        ) : (
          <div className="space-y-2">
            {ultimosProdutos.map((prod) => (
              <div key={prod.id} className="flex items-center justify-between p-3 bg-zinc-900/60 border border-zinc-800/60 rounded-lg hover:border-zinc-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 overflow-hidden shrink-0 flex items-center justify-center">
                    {prod.urlImagem ? (
                      <img src={prod.urlImagem} alt={prod.titulo} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs">📦</span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{prod.titulo}</h4>
                    <p className="text-[10px] text-zinc-500">Por: R$ {prod.precoPor} <span className="line-through ml-1 text-zinc-600">R$ {prod.precoDe}</span></p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded uppercase tracking-wider">
                  Ativo
                </span>
              </div>
            ))}
            
            {/* Link para ver todos se houver mais de 4 produtos */}
            {totalProdutos > 4 && (
              <div className="pt-3 text-center">
                <Link 
                  href="/dashboard/produtos" 
                  className="text-[11px] text-blue-500 hover:text-blue-400 font-bold hover:underline transition-colors"
                >
                  Ver todos os {totalProdutos} produtos →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}