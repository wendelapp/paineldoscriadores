"use client";

export default function HistoricoPagamentos() {
  // Dados fictícios simulando o histórico do criador. 
  // No futuro, isso virá automático do banco de dados (Stripe, Mercado Pago, etc).
  const historico = [
    {
      id: 1,
      data: "18 de Agosto, 2026",
      descricao: "Plano PRO - Mensalidade",
      metodo: "Pix",
      valor: "19,99",
      status: "PAGO"
    },
    {
      id: 2,
      data: "18 de Julho, 2026",
      descricao: "Plano PRO - Mensalidade",
      metodo: "Pix",
      valor: "19,99",
      status: "PAGO"
    },
    {
      id: 3,
      data: "18 de Junho, 2026",
      descricao: "Plano PRO - Mês de Teste",
      metodo: "Sistema",
      valor: "0,00",
      status: "PAGO"
    }
  ];

  return (
    <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-6 shadow-xl h-full flex flex-col">
      <h3 className="text-sm font-bold text-white mb-5 uppercase tracking-wider flex items-center gap-2">
        <span className="text-lg">📄</span> Histórico (Pix)
      </h3>

      <div className="space-y-3 flex-1">
        {historico.map((item) => (
          <div 
            key={item.id} 
            className="flex items-center justify-between p-3.5 bg-zinc-900/40 border border-zinc-800/60 rounded-lg hover:bg-zinc-900/60 transition-colors"
          >
            <div>
              <p className="text-xs font-bold text-white mb-0.5">{item.data}</p>
              <p className="text-[10px] text-zinc-400">
                {item.descricao} <span className="mx-1">•</span> Via {item.metodo}
              </p>
            </div>
            
            <div className="text-right">
              <p className="text-xs font-mono font-bold text-zinc-300 mb-1">
                R$ {item.valor}
              </p>
              <span className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border ${
                item.status === 'PAGO' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-800/50">
        <p className="text-[10px] text-zinc-500 text-center leading-relaxed">
          Os comprovantes e a renovação via Pix são enviados automaticamente para o seu e-mail.
        </p>
      </div>
    </div>
  );
}