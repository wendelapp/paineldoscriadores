// src/app/dashboard/publicar/components/ProgressoAnalise.tsx
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

interface ProgressoAnaliseProps {
  status: "analise" | "aprovado" | "reprovado";
  produtoId?: string;
  userUid?: string;
  dataCriacao?: any;
  motivoReprovacao?: string;
  onVoltarEdicao?: () => void;
}

export default function ProgressoAnalise({ 
  status, 
  produtoId, 
  userUid, 
  dataCriacao, 
  motivoReprovacao, 
  onVoltarEdicao 
}: ProgressoAnaliseProps) {
  
  // Calcula os segundos iniciais (15 minutos = 900 segundos)
  const calcularTempoInicial = () => {
    if (dataCriacao) {
      const milisCriacao = typeof dataCriacao.toMillis === 'function' ? dataCriacao.toMillis() : new Date(dataCriacao).getTime();
      const agora = Date.now();
      const segundosPassados = Math.floor((agora - milisCriacao) / 1000);
      const restante = 900 - segundosPassados;
      return restante > 0 ? restante : 0;
    }
    return 900;
  };

  const [tempoRestante, setTempoRestante] = useState<number>(calcularTempoInicial);

  useEffect(() => {
    if (status !== "analise") return;

    // Se o tempo já acabou ao carregar a página
    if (tempoRestante <= 0 && produtoId && userUid) {
      updateDoc(doc(db, "users", userUid, "produtos", produtoId), { status: "ativo" })
        .then(() => window.location.reload())
        .catch((err) => console.error("Erro ao atualizar status:", err));
      return;
    }

    const timer = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          
          // Quando o relógio zerar, muda para ativo no banco e recarrega
          if (produtoId && userUid) {
            updateDoc(doc(db, "users", userUid, "produtos", produtoId), {
              status: "ativo"
            }).then(() => {
              window.location.reload();
            });
          } else {
            window.location.reload();
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, tempoRestante, produtoId, userUid]);

  // Formata os segundos em MM:SS
  const minutos = Math.floor(tempoRestante / 60);
  const segundos = tempoRestante % 60;
  const tempoFormatado = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;

  // Porcentagem da barra
  const progressoPorcentagem = Math.min(100, Math.max(0, ((900 - tempoRestante) / 900) * 100));

  let etapaTexto = "Análise Inicial de Termos e Integridade";
  let etapaCor = "bg-amber-500";
  if (tempoRestante < 600 && tempoRestante >= 300) {
    etapaTexto = "Verificação de Direitos Autorais e Mídia";
    etapaCor = "bg-blue-500";
  } else if (tempoRestante < 300) {
    etapaTexto = "Homologação Final e Inclusão na Vitrine";
    etapaCor = "bg-indigo-500";
  }

  return (
    <div className="lg:col-span-8 bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-8 shadow-xl flex flex-col items-center justify-center space-y-6 text-center min-h-112.5">
      
      {status === "analise" && (
        <>
          {/* Ícone de loading pequeno e discreto no lugar do relógio gigante */}
          

          <div className="w-full max-w-md space-y-2">
            <div className="flex justify-between text-xs font-medium text-zinc-400">
              <span>Status: Em Fila de Auditoria</span>
              <span className="text-amber-400 font-bold">{Math.round(progressoPorcentagem)}%</span>
            </div>
            
            <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
              <div 
                className={`h-full transition-all duration-1000 ${etapaCor}`} 
                style={{ width: `${progressoPorcentagem}%` }}
              ></div>
            </div>

            <p className="text-xs text-zinc-300 font-semibold pt-2">🔄 Etapa Atual: {etapaTexto}</p>
          </div>

          <p className="text-xs text-zinc-500 max-w-sm mt-4">
            Para garantir uma vitrine segura, sua oferta passa por uma checagem automatizada,  verificando as diretrizes, e termo de uso.  Você pode fechar a aba se quiser, voltar mais tarde , tomar aquele cafezinho; o processo continua!
          </p>
        </>
      )}

      {status === "aprovado" && (
        <div className="space-y-4">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 text-5xl mx-auto shadow-[0_0_30px_rgba(16,185,129,0.2)]">✓</div>
          <div>
            <h3 className="text-2xl font-black text-white mb-2">Oferta Aprovada com Sucesso!</h3>
            <p className="text-sm text-zinc-400">A auditoria foi concluída e seu produto já está ativo na sua vitrine pública.</p>
          </div>
        </div>
      )}

      {status === "reprovado" && (
        <div className="space-y-4">
          <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 text-4xl mx-auto shadow-[0_0_30px_rgba(244,63,94,0.2)]">✕</div>
          <div>
            <h3 className="text-2xl font-black text-white mb-2">Oferta Reprovada na Auditoria</h3>
            <p className="text-sm text-zinc-400 max-w-md mx-auto mb-4">
              {motivoReprovacao || "O conteúdo não cumpriu todas as diretrizes de segurança da plataforma."}
            </p>
            {onVoltarEdicao && (
              <button 
                onClick={onVoltarEdicao}
                className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Editar Oferta e Enviar Novamente
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}