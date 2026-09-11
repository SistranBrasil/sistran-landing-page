import type { IconName } from '@/lib/icons';

/* Nomes e textos verbatim de /solucoes-servicos-e-consultoria/ (secao "Soluções
   — Tecnologia Disruptiva"). No site atual o nome do produto existe APENAS
   dentro da imagem do logo, sem alt: invisivel para busca e leitor de tela.
   Aqui o nome é texto. Nao ha subtitulo/tagline escrito no site — o card tem
   nome + descricao e nada mais, então o tipo tambem nao tem.
   Fonte: .claude/conteudo-site/04-solucoes-servicos-e-consultoria.md */
export type Accelerator = {
  id: string;
  name: string;
  description: string;
  /* SIS-217 — a placa do produto, servida de `public/images/logos/`. O card de
     `/solucoes` mostra a logo; o glifo `icon` continua em uso pela vitrine de
     `/sistran-labs`, que é cartão claro e não recebeu placa. */
  logo: string;
  /* Dimensão INTRÍNSECA do PNG, em pixels — não a caixa em que ele aparece.
     Serve ao `next/image`, que a usa para reservar o espaço antes do arquivo
     chegar. Não é redundante com um par fixo para todos: as sete logos vão de
     1,8:1 (Connect API) a 6,7:1 (Match AI), e um par único faria a caixa
     encolher ou esticar no momento em que a imagem carrega. Medidas pelo
     cabeçalho IHDR em `scripts/medir-logos-aceleradores-sis217.mjs`. */
  logoWidth: number;
  logoHeight: number;
  icon: IconName;
  tone: string;
};

export const ACCELERATORS: readonly Accelerator[] = [
  {
    id: 'match-ai',
    name: 'Match AI',
    description:
      'Permite a seguradora empoderar o corretor/agente nas jornadas de ofertas personalizadas, gerando propostas inteligentes e individualização do discurso explicativo.',
    /* `MatchAIlogo.png`, e não o `matchlogo.png` que mora na mesma pasta: são
       duas artes da MESMA marca, e o de-para da SIS-217 escolhe esta. Não é
       questão de contraste — medidas contra o navy do card, as duas passam
       (7,64:1 esta, 6,37:1 a outra); é a arte aprovada. */
    logo: '/images/logos/MatchAIlogo.png',
    logoWidth: 2338,
    logoHeight: 350,
    icon: 'Users',
    tone: '#0ed8f6',
  },
  {
    id: 'lumina-ai',
    name: 'Lumina AI',
    description:
      'Solução integrada com uso de IA generativa que orquestra toda a esteira do DEVOPs, gerando maior produtividade em toda cadeia, especialmente na codificação, integrada às ferramentas líderes de mercado.',
    logo: '/images/logos/Lumina-AI-horizontal-branca.png',
    logoWidth: 2535,
    logoHeight: 820,
    icon: 'Code2',
    tone: '#57B7EE',
  },
  {
    id: 'fast',
    name: 'Fast',
    description:
      'Automatiza e acelera processos de sinistros, reduzindo erros humanos, melhorando a eficiência e garantindo conformidade com as regulamentações.',
    logo: '/images/logos/Fastlogo.png',
    logoWidth: 2000,
    logoHeight: 688,
    icon: 'ShieldCheck',
    tone: '#A78BFA',
  },
  {
    id: 'qa-integrado',
    name: 'QA Integrado',
    description: 'Altos padrões de qualidade, mantendo constância na melhoria, evolução e inovação.',
    logo: '/images/logos/QA-2-logo.png',
    logoWidth: 1567,
    logoHeight: 396,
    icon: 'Workflow',
    tone: '#7CCBF3',
  },
  {
    id: 'connect-api',
    name: 'Connect API',
    description:
      'Jornada de Distribuição de Vida Individual, Empresarial e Grupo; Venda Consultiva; Auto-gestão do faturamento pelo estipulante.',
    logo: '/images/logos/logoConnectAPI.png',
    logoWidth: 635,
    logoHeight: 350,
    icon: 'HeartHandshake',
    tone: '#C4A0FB',
  },
  {
    id: 'smart-miner',
    name: 'Smart Miner',
    description:
      'Solução poderosa para identificar documentos em arquivos com múltiplas imagens, tipificação e extração de dados para Onboarding (Aceitação da Proposta) e Abertura de Sinistros.',
    logo: '/images/logos/Logo-Smart-Miner-1.png',
    logoWidth: 2996,
    logoHeight: 816,
    icon: 'Layers',
    tone: '#6EE7B7',
  },
  {
    id: 'guru-de-seguros',
    name: 'Guru de Seguros',
    /* Site escreve "Quizes" e "FAC"; corrigido para quizzes e FAQ — erro de
       digitacao nao é conteudo a replicar. */
    description:
      'Assistente conversacional via Alexa (com LLM) para educação de corretores e segurados (quizzes, FAQ), turbinado com aplicações transacionais.',
    logo: '/images/logos/Guru-de-Seguros-letra-clara-2.png',
    logoWidth: 1405,
    logoHeight: 717,
    icon: 'Cpu',
    tone: '#0ed8f6',
  },
];
