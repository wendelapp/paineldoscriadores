"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

interface Pagamento {
  id: string;
  data: string;
  descricao: string;
  metodo: string;
  valor: string;
  status: string;
  timestamp: number; // Usado internamente para ordenar
}

export default function HistoricoPagamentos() {
  const [historico, setHistorico] = useState<Pagamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  
  const ITENS_POR_PAGINA = 12;

  useEffect(() => {
    const buscarHistorico = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setLoading(false);
          return;
        }

        // 1. Busca os pagamentos PRO reais no Firebase
        const q = query(
          collection(db, "pagamentos"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pagamentosPro: any[] = [];
        querySnapshot.forEach((doc) => {
          pagamentosPro.push({ id: doc.id, ...doc.data() });
        });

        // 2. Descobre o mês e ano em que a conta foi criada
        // Se a data de criação não estiver disponível por algum motivo, usa a data atual
        const dataCriacao = new Date(user.metadata.creationTime || Date.now());
        const dataAtual = new Date();

        const historicoGerado: Pagamento[] = [];
        let anoLoop = dataCriacao.getFullYear();
        let mesLoop = dataCriacao.getMonth();
        let idCounter = 1;

        // 3. Loop: Da data de criação da conta ATÉ o mês atual
        while (
          anoLoop < dataAtual.getFullYear() ||
          (anoLoop === dataAtual.getFullYear() && mesLoop <= dataAtual.getMonth())
        ) {
          // Filtra se existe algum pagamento PRO feito neste mês e ano exato do loop
          const pagamentosDoMes = pagamentosPro.filter(p => {
            if (!p.dataCriacao) return false;
            const d = new Date(p.dataCriacao.toDate());
            return d.getMonth() === mesLoop && d.getFullYear() === anoLoop;
          });

          if (pagamentosDoMes.length > 0) {
            // Se achou pagamento(s) no mês, adiciona os dados reais do Pro
            pagamentosDoMes.forEach(pagPro => {
              const dataPagamento = new Date(pagPro.dataCriacao.toDate());
              historicoGerado.push({
                id: pagPro.id,
                data: dataPagamento.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
                descricao: pagPro.descricao || "CortCut Pro",
                metodo: pagPro.metodo || "Mercado Pago",
                valor: pagPro.valor ? parseFloat(pagPro.valor).toFixed(2).replace('.', ',') : "0,00",
                status: pagPro.status || "PAGO",
                timestamp: dataPagamento.getTime()
              });
            });
          } else {
            // Se NÃO tem pagamento no mês, ele preenche automaticamente como Plano Grátis
            const dataBase = new Date(anoLoop, mesLoop);
            const nomeMes = dataBase.toLocaleDateString('pt-BR', { month: 'long' });
            // Deixa a primeira letra do mês maiúscula (ex: Agosto de 2026)
            const mesFormatado = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1) + " de " + anoLoop;
            
            historicoGerado.push({
              id: `gratis-${idCounter}`,
              data: mesFormatado,
              descricao: "Plano Grátis (Para Sempre)",
              metodo: "Sistema",
              valor: "0,00",
              status: "ATIVO",
              timestamp: dataBase.getTime()
            });
          }

          // Avança para o próximo mês
          mesLoop++;
          if (mesLoop > 11) {
            mesLoop = 0;
            anoLoop++;
          }
          idCounter++;
        }

        // 4. Ordena o histórico do mais recente (topo) para o mais antigo (fundo)
        historicoGerado.sort((a, b) => b.timestamp - a.timestamp);

        setHistorico(historicoGerado);
      } catch (error) {
        console.error("Erro ao montar histórico:", error);
      } finally {
        setLoading(false);
      }
    };

    buscarHistorico();
  }, []);

  const indiceUltimoItem = paginaAtual * ITENS_POR_PAGINA;
  const indicePrimeiroItem = indiceUltimoItem - ITENS_POR_PAGINA;
  const itensAtuais = historico.slice(indicePrimeiroItem, indiceUltimoItem);
  const totalPaginas = Math.ceil(historico.length / ITENS_POR_PAGINA);

  return (
    <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-6 shadow-xl h-full flex flex-col">
      <h3 className="text-sm font-bold text-white mb-5 uppercase tracking-wider flex items-center gap-2">
        <span className="text-lg">📄</span> Histórico
      </h3>

      <div className="space-y-3 flex-1 overflow-y-auto pr-2 overflow-x-hidden scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-xs text-zinc-400 font-medium animate-pulse">Calculando faturas...</p>
          </div>
        ) : itensAtuais.length > 0 ? (
          itensAtuais.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center justify-between p-3.5 bg-zinc-900/40 border border-zinc-800/60 rounded-lg hover:bg-zinc-900/60 transition-colors"
            >
              <div>
                <p className="text-xs font-bold text-white mb-0.5 capitalize">{item.data}</p>
                <p className="text-[10px] text-zinc-400">
                  {item.descricao} <span className="mx-1">•</span> {item.metodo}
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-xs font-mono font-bold text-zinc-300 mb-1">
                  R$ {item.valor}
                </p>
                <span className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border ${
                  item.status === 'ATIVO' || item.status === 'PAGO' || item.status === 'APROVADO'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-70 py-6">
            <span className="text-2xl mb-2">🧾</span>
            <p className="text-xs text-zinc-400 font-medium">Nenhum registro encontrado.</p>
          </div>
        )}
      </div>

      {totalPaginas > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800/50">
          <button 
            onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
            disabled={paginaAtual === 1}
            className="text-[10px] font-bold px-3 py-1.5 bg-zinc-900 text-zinc-300 rounded border border-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
          >
            ← Anterior
          </button>
          <span className="text-[10px] text-zinc-500 font-medium">
            Página {paginaAtual} de {totalPaginas}
          </span>
          <button 
            onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
            disabled={paginaAtual === totalPaginas}
            className="text-[10px] font-bold px-3 py-1.5 bg-zinc-900 text-zinc-300 rounded border border-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
          >
            Próxima →
          </button>
        </div>
      )}

      {(!totalPaginas || totalPaginas <= 1) && (
        <div className="mt-4 pt-4 border-t border-zinc-800/50">
          <p className="text-[10px] text-zinc-500 text-center leading-relaxed">
            Os comprovantes e a renovação via Mercado Pago são enviados automaticamente para o seu e-mail.
          </p>
        </div>
      )}
    </div>
  );
}