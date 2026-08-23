"use client";

export type LegalType = "termos" | "privacidade" | "cookies" | "faq" | "suporte" | "denuncia" | "assinatura" | "quem_somos";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: LegalType;
}

const CONTENT_MAP = {
  termos: {
    title: "Termos de Uso e Condições",
    body: (
      <div className="space-y-5 text-zinc-300 text-sm leading-relaxed">
        <p>Bem-vindo ao CortCut. Estes Termos regulam o uso da nossa infraestrutura tecnológica por Criadores de Conteúdo e o acesso por Consumidores Finais.</p>
        
        <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
          <h4 className="font-bold text-white mb-2 uppercase text-xs tracking-wider">1. Natureza do Serviço (Para Consumidores)</h4>
          <p className="mb-2">O CortCut atua <strong>exclusivamente como provedor de infraestrutura tecnológica (SaaS)</strong>. Não somos fornecedores, distribuidores, fabricantes ou vendedores dos produtos e serviços exibidos nas vitrines.</p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-400">
            <li><strong>Garantia e Reembolso:</strong> O Direito de Arrependimento (Art. 49 do Código de Defesa do Consumidor - CDC), que garante 7 dias para devolução, deve ser exercido diretamente contra o Criador ou a plataforma de pagamento terceira (ex: Mercado Livre, Hotmart).</li>
            <li><strong>Propaganda Enganosa:</strong> Toda promessa de valor, prazo de entrega e qualidade é de inteira responsabilidade do Criador de Conteúdo que publicou a oferta.</li>
          </ul>
        </div>

        <div className="p-4 bg-blue-900/10 rounded-lg border border-blue-900/30">
          <h4 className="font-bold text-blue-400 mb-2 uppercase text-xs tracking-wider">2. Regras e Conduta (Para Criadores)</h4>
          <p className="mb-2">Ao criar uma conta, o Criador atesta a veracidade de seus dados. É terminantemente proibido o uso de falsidade ideológica, falsificação de documentos ou usurpação de identidade para criar vitrines.</p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-400">
            <li><strong>Plataformas Permitidas:</strong> Apenas links de empresas regulamentadas e verificadas são aceitos (Mercado Livre, Shopee, Amazon, Hotmart e similares).</li>
            <li><span className="text-rose-400 font-bold">Proibição Absoluta:</span> É estritamente proibida a divulgação de <strong>jogos de azar, apostas (bets), esquemas de pirâmide, produtos falsificados, ou comercialização de conteúdo sem autorização de direitos autorais.</strong></li>
          </ul>
        </div>

        <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
          <h4 className="font-bold text-white mb-2 uppercase text-xs tracking-wider">3. Segurança, Transparência e Diretrizes de Ofertas</h4>
          <p className="mb-3 text-zinc-300">
            A nossa vitrine atua como uma ponte segura entre você e as melhores ofertas da internet. Para garantir uma experiência confiável, adotamos políticas rigorosas:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-zinc-400 mb-3">
            <li>
              <strong>Ambiente Seguro:</strong> Não processamos pagamentos diretamente. Os links direcionam você para finalizar a compra apenas em empresas sérias, validadas e consolidadas no mercado (como Mercado Livre, Shopee, Amazon, Hotmart, entre outras).
            </li>
            <li>
              <strong>Tolerância Zero:</strong> Contamos com rigorosos sistemas anti-fraude. É terminantemente proibido o uso da nossa plataforma para a divulgação de jogos de azar, apostas ou qualquer conteúdo enganoso.
            </li>
          </ul>
          <p className="mt-3 text-rose-400 font-medium text-sm">
            Caso identifique uma violação, denuncie. O criador será notificado e a conta responsável poderá ser suspensa por 30 dias ou deletada permanentemente.
          </p>
        </div>
      </div>
    )
  },
  privacidade: {
    title: "Política de Privacidade (LGPD)",
    body: (
      <div className="space-y-4 text-zinc-300 text-sm leading-relaxed">
        <p>O CortCut respeita a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018). Coletamos apenas os dados estritamente necessários para a prestação do serviço.</p>
        <h4 className="font-bold text-white mt-4">Para Criadores:</h4>
        <p>Armazenamos seu e-mail, nome e dados de cobrança em ambiente criptografado e seguro. Não vendemos ou repassamos sua base de dados para terceiros.</p>
        <h4 className="font-bold text-white mt-4">Para Consumidores:</h4>
        <p>O CortCut não coleta seus dados financeiros. Contudo, informamos que os Criadores podem utilizar tecnologias de rastreamento de terceiros (como Pixel da Meta/Facebook e Google Ads) nas vitrines para fins de métricas e publicidade. Ao navegar nas vitrines, você está sujeito às políticas destas redes.</p>
      </div>
    )
  },
  cookies: {
    title: "Política de Cookies",
    body: (
      <div className="space-y-4 text-zinc-300 text-sm leading-relaxed">
        <p>Cookies são pequenos arquivos de texto armazenados no seu dispositivo. No CortCut, categorizamos nossos cookies da seguinte forma:</p>
        <ul className="list-disc pl-5 space-y-2 text-zinc-400">
          <li><strong>Estritamente Necessários:</strong> Usados para manter sua sessão (login) segura, balanceamento de carga de servidores e prevenção contra fraudes/ataques DDoS. Não podem ser desativados.</li>
          <li><strong>Cookies de Terceiros (Vitrines):</strong> Se você é um consumidor visitando uma vitrine, o Criador pode ter ativado Pixels de rastreamento (Meta/Google). Esses cookies medem a eficácia de anúncios e não são controlados pelo CortCut.</li>
        </ul>
      </div>
    )
  },
 faq: {
    title: "Perguntas Frequentes (FAQ)",
    body: (
      <div className="space-y-6 text-zinc-300 text-sm leading-relaxed">
        
        <div>
          <h4 className="font-bold text-white text-base mb-1">Como verifico minha conta?</h4>
          <p className="text-zinc-400">Para garantir a máxima segurança da sua audiência e manter nossa plataforma apenas com criadores 100% legítimos, fazemos a verificação através do seu canal do YouTube. É rápido, simples e prova a sua autenticidade para quem compra de você!</p>
          <p className="text-zinc-400 mt-2">🤝 <strong>Dica de parceiro:</strong> Lembre-se de que você é o dono da sua vitrine e responsável pelas imagens que publica. Use sempre imagens com permissão ou respeite os direitos autorais das marcas para o seu negócio crescer seguro e sem surpresas.</p>
        </div>

        <div>
          <h4 className="font-bold text-white text-base mb-1">Onde posso divulgar o link da minha vitrine?</h4>
          <p className="text-zinc-400">Sua criatividade não tem limites! Você pode espalhar o link da sua vitrine em todas as suas redes sociais e canais de comunicação:</p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-400 mt-2">
            <li><strong>Redes Sociais:</strong> Biografia e postagens no Instagram, TikTok, Kwai, Facebook e Shorts do YouTube.</li>
            <li><strong>Mensagens e Grupos:</strong> Grupos de WhatsApp, Telegram, listas de transmissão e direct.</li>
            <li><strong>Conteúdo Orgânico ou Tráfego:</strong> Blogs, sites próprios, artigos e páginas de resenha.</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-base mb-1">O que posso publicar e quais empresas são autorizadas?</h4>
          <p className="text-zinc-400">Você pode divulgar uma enorme variedade de conteúdos de alta conversão, como <strong>cursos online, infoprodutos, serviços digitais e produtos físicos em alta</strong>. Aceitamos links de grandes empresas regulamentadas e consolidadas no mercado, tais como:</p>
          <p className="text-zinc-300 font-medium mt-2">🛒 Mercado Livre, Shopee, Amazon, Hotmart, Monetizze, Eduzz e similares.</p>
          <div className="p-3 bg-rose-950/30 rounded-lg border border-rose-900/50 mt-3">
            <p className="text-rose-400 font-bold text-xs uppercase tracking-wider mb-1">⚠️ Proibição Absoluta</p>
            <p className="text-zinc-300 text-xs">Jogos de azar, cassinos online, apostas (bets), pirâmides financeiras ou produtos falsificados são <strong>estritamente proibidos</strong> e resultam em banimento sumário.</p>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-white text-base mb-1">Se eu cancelar o plano Pro, perco meus produtos extras?</h4>
          <p className="text-zinc-400">Não! Se você cadastrou 30 produtos no plano Pro e decidiu voltar para o Plano Grátis, os seus 30 produtos <strong>continuam ativos</strong> na sua vitrine. Você batalhou para montá-los e não vai perder seu trabalho! O que acontece é que as ferramentas avançadas (como os Pixels de rastreio) ficarão bloqueadas e você só não poderá adicionar *novos* produtos até baixar para menos de 10 cadastrados.</p>
        </div>

        <div>
          <h4 className="font-bold text-white text-base mb-1">Posso fazer anúncios pagos (Meta/Google Ads) para minha vitrine?</h4>
          <p className="text-zinc-400">Com certeza! O CortCut foi feito para você escalar. Você pode fazer tráfego pago para a sua vitrine, desde que os produtos divulgados respeitem as nossas regras de proibição e sigam rigorosamente as políticas de anúncios da plataforma onde estiver investindo (Facebook Ads, Google Ads, TikTok Ads, etc.).</p>
        </div>

      </div>
    )
  },
  suporte: {
    title: "Central de Suporte",
    body: (
      <div className="space-y-4 text-zinc-300 text-sm leading-relaxed">
        <p>Nossa equipe está pronta para auxiliar Criadores de Conteúdo com questões técnicas, falhas de sistema ou dúvidas sobre faturamento.</p>
        <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
          <p className="font-bold text-white mb-1">Horário de Atendimento:</p>
          <p className="text-zinc-400 mb-4">Segunda a Sexta, das 09h às 18h (Horário de Brasília).</p>
          <p className="font-bold text-white mb-1">E-mail Direto:</p>
          <p className="text-blue-400 font-mono">suporte@cortcut.com</p>
        </div>
        <p className="text-xs text-zinc-500">Nota para consumidores: Não possuímos acesso a rastreio de pedidos, estornos ou logística de produtos comprados através dos links das vitrines.</p>
      </div>
    )
  },
  denuncia: {
    title: "Canal de Denúncias, Compliance e Punições",
    body: (
      <div className="space-y-6 text-zinc-300 text-sm leading-relaxed">
        <p>O CortCut adota uma política de <strong>tolerância zero</strong> para fraudes, pirataria e infrações legais. Para garantir total transparência, dividimos nossas diretrizes de denúncia em duas frentes:</p>
        
        <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 space-y-3">
          <h4 className="font-bold text-white uppercase text-xs tracking-wider flex items-center gap-2">
            <span>👥</span> 1. Para Consumidores (Como Denunciar uma Vitrine)
          </h4>
          <p className="text-zinc-400 text-xs">Se você identificou uma vitrine irregular ou comportamento suspeito na internet, reporte imediatamente para nossa equipe.</p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-400 text-xs">
            <li>Venda de produtos falsificados ou ilegais.</li>
            <li>Links direcionando para Jogos de Azar, Cassinos ou Apostas (Bets).</li>
            <li>Uso não autorizado de imagem, marca ou direitos autorais.</li>
            <li>Golpes ou propagandas com promessas sabidamente falsas.</li>
          </ul>
          <div className="pt-2 border-t border-zinc-700/50 mt-3">
            <p className="text-zinc-300 text-xs mb-1 font-medium">Envie sua denúncia (com o link da vitrine e prints) para:</p>
            <p className="text-blue-400 font-mono text-xs font-bold">denuncias@cortcut.com</p>
            <p className="text-[10px] text-zinc-500 mt-1">Garantimos total anonimato ao denunciante.</p>
          </div>
        </div>

        <div className="p-4 bg-rose-950/20 rounded-lg border border-rose-900/40 space-y-3">
          <h4 className="font-bold text-rose-400 uppercase text-xs tracking-wider flex items-center gap-2">
            <span>🛡️</span> 2. Para Criadores (Regras de Compliance e Punições)
          </h4>
          <p className="text-zinc-400 text-xs">Como criador na plataforma, você é responsável pela integridade dos links que publica em sua vitrine.</p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-400 text-xs">
            <li><strong>Aviso por Notificação:</strong> Se a sua vitrine receber uma denúncia procedente, você será avisado imediatamente por uma notificação no topo do seu painel.</li>
            <li><strong>Suspensão Temporária:</strong> A conta e a vitrine poderão ser suspensas preventivamente por um período de até <strong>30 dias</strong> para auditoria e regularização.</li>
            <li><strong>Exclusão Definitiva:</strong> Em casos graves de fraude, reincidência ou recusa em remover links proibidos (como jogos de azar), a conta será deletada permanentemente do sistema.</li>
          </ul>
        </div>
      </div>
    )
  },
  assinatura: {
    title: "Planos, Assinaturas e Política de Reembolso",
    body: (
      <div className="space-y-5 text-zinc-300 text-sm leading-relaxed">
        <p>O CortCut foi desenvolvido para criadores que buscam escalar suas vendas com segurança e previsibilidade.</p>
        
        <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
  <h4 className="font-bold text-white mb-2 uppercase text-xs tracking-wider">💎 1. Ciclo de Assinatura e Valores</h4>
  <p className="text-zinc-400 text-xs mb-2">Trabalhamos com planos transparentes e sem surpresas:</p>
  <ul className="list-disc pl-5 space-y-1 text-zinc-400 text-xs">
    <li><strong>Plano Grátis:</strong> Grátis para sempre, permitindo publicar e manter até 10 produtos ativos na vitrine.</li>
    <li><strong>Plano PRO:</strong> R$ 19,90 nos primeiros 3 meses, passando para R$ 29,90/mês após esse período, com produtos e recursos ilimitados.</li>
    <li><strong>Renovação Automática:</strong> Garantimos controle total do criador sobre suas cobranças e cancelamentos a qualquer momento.</li>
  </ul>
</div>

        <div className="p-4 bg-emerald-950/25 rounded-lg border border-emerald-900/40">
          <h4 className="font-bold text-emerald-400 mb-2 uppercase text-xs tracking-wider">🛡️ 2. Garantia Incondicional de 7 Dias</h4>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Conforme o Código de Defesa do Consumidor, todo criador tem direito a <strong>7 dias de garantia</strong> ao assinar o plano PRO. Se você assinar e sentir que a ferramenta não atendeu às suas expectativas dentro desse prazo, o reembolso do valor pago é integral e processado de forma automática.
          </p>
        </div>

        <div className="p-4 bg-blue-950/25 rounded-lg border border-blue-900/40">
          <h4 className="font-bold text-blue-400 mb-2 uppercase text-xs tracking-wider">🔒 3. Segurança de Pagamento (Mercado Pago)</h4>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Todas as transações e cobranças via Pix do CortCut são processadas por meio de infraestruturas de pagamento altamente seguras e regulamentadas, como o <strong>Mercado Pago</strong>. Nós não armazenamos dados confidenciais do seu banco ou chaves Pix em nossos servidores.
          </p>
        </div>
      </div>
    )
  },

  quem_somos: {
    title: "Quem Somos",
    body: (
      <div className="space-y-6 text-zinc-300 text-sm leading-relaxed">
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-5">
          <h4 className="font-bold text-white mb-2 uppercase text-xs tracking-wider flex items-center gap-2">
            <span className="text-blue-500">⚡</span> Nossa Essência
          </h4>
          <p className="text-zinc-300 text-xs leading-relaxed">
            Nascemos com o propósito claro de revolucionar o ecossistema de vendas digitais e vitrines de afiliados. Combinamos arquitetura de software de alta performance com rigor técnico e conformidade regulatória, entregando um ambiente onde criadores de conteúdo escalam seus negócios com total tranquilidade, previsibilidade e estabilidade operacional.
          </p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-5">
          <h4 className="font-bold text-white mb-2 uppercase text-xs tracking-wider flex items-center gap-2">
            <span className="text-blue-500">🎯</span> Nossa Missão
          </h4>
          <p className="text-zinc-300 text-xs leading-relaxed">
            Contribuir ativamente para a construção de uma sociedade e de um mercado digital mais seguros. Fornecemos infraestrutura tecnológica confiável, de alta disponibilidade e sustentável, em estrita observância à legislação brasileira e aos marcos regulatórios federais aplicáveis. Nosso compromisso é blindar o criador contra fraudes e vulnerabilidades, assegurando um ecossistema digital íntegro, eficiente e pautado nas melhores práticas globais de engenharia de software.
          </p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-5">
          <h4 className="font-bold text-white mb-2 uppercase text-xs tracking-wider flex items-center gap-2">
            <span className="text-blue-500">💎</span> Nossos Valores
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div className="p-3 bg-zinc-950/50 border border-zinc-800 rounded-lg">
              <h5 className="font-semibold text-white text-[11px] uppercase tracking-wider mb-1">Sustentabilidade Tecnológica</h5>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Desenvolvimento de sistemas escaláveis e eficientes, focados na durabilidade da infraestrutura e no baixo impacto operacional.
              </p>
            </div>
            <div className="p-3 bg-zinc-950/50 border border-zinc-800 rounded-lg">
              <h5 className="font-semibold text-[11px] uppercase tracking-wider mb-1 text-blue-400">Respeito à Comunidade</h5>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Compromisso inegociável com a ética, transparência e proteção de dados, promovendo um ambiente digital saudável e seguro para todos.
              </p>
            </div>
            <div className="p-3 bg-zinc-950/50 border border-zinc-800 rounded-lg">
              <h5 className="font-semibold text-[11px] uppercase tracking-wider mb-1 text-blue-400">Conformidade e Rigor Legal</h5>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Alinhamento absoluto com as leis do país, blindando a plataforma contra abusos, fraudes e práticas comerciais nocivas.
              </p>
            </div>
            <div className="p-3 bg-zinc-950/50 border border-zinc-800 rounded-lg">
              <h5 className="font-semibold text-[11px] uppercase tracking-wider mb-1 text-blue-400">Inovação Orientada a Dados</h5>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Evolução contínua baseada em engenharia de ponta, garantindo velocidade, segurança e usabilidade impecável.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  },
};


export default function TermsModal({ isOpen, onClose, type }: LegalModalProps) {
  if (!isOpen) return null;

  const content = CONTENT_MAP[type];

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Cabeçalho */}
        <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/80 sticky top-0">
          <h3 className="text-lg font-black text-white tracking-tight">{content?.title}</h3>
          <button 
            onClick={onClose} 
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Corpo (Scrollável) */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {content?.body}
        </div>

        {/* Rodapé */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-zinc-100 hover:bg-white text-zinc-900 font-bold rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            Estou ciente e concordo
          </button>
        </div>
      </div>
    </div>
  );
}