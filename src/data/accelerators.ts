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
  icon: IconName;
  tone: string;
};

export const ACCELERATORS: readonly Accelerator[] = [
  {
    id: 'match-ai',
    name: 'Match AI',
    description:
      'Permite a seguradora empoderar o corretor/agente nas jornadas de ofertas personalizadas, gerando propostas inteligentes e individualização do discurso explicativo.',
    icon: 'Users',
    tone: '#0ed8f6',
  },
  {
    id: 'lumina-ai',
    name: 'Lumina AI',
    description:
      'Solução integrada com uso de IA generativa que orquestra toda a esteira do DEVOPs, gerando maior produtividade em toda cadeia, especialmente na codificação, integrada às ferramentas líderes de mercado.',
    icon: 'Code2',
    tone: '#57B7EE',
  },
  {
    id: 'fast',
    name: 'Fast',
    description:
      'Automatiza e acelera processos de sinistros, reduzindo erros humanos, melhorando a eficiência e garantindo conformidade com as regulamentações.',
    icon: 'ShieldCheck',
    tone: '#A78BFA',
  },
  {
    id: 'qa-integrado',
    name: 'QA Integrado',
    description: 'Altos padrões de qualidade, mantendo constância na melhoria, evolução e inovação.',
    icon: 'Workflow',
    tone: '#7CCBF3',
  },
  {
    id: 'connect-api',
    name: 'Connect API',
    description:
      'Jornada de Distribuição de Vida Individual, Empresarial e Grupo; Venda Consultiva; Auto-gestão do faturamento pelo estipulante.',
    icon: 'HeartHandshake',
    tone: '#C4A0FB',
  },
  {
    id: 'smart-miner',
    name: 'Smart Miner',
    description:
      'Solução poderosa para identificar documentos em arquivos com múltiplas imagens, tipificação e extração de dados para Onboarding (Aceitação da Proposta) e Abertura de Sinistros.',
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
    icon: 'Cpu',
    tone: '#0ed8f6',
  },
];
