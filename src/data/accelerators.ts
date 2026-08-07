import type { IconName } from '@/lib/icons';

export type Accelerator = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: IconName;
  tone: string;
};

export const ACCELERATORS: readonly Accelerator[] = [
  {
    id: 'guru',
    name: 'Guru',
    tagline: 'Ofertas personalizadas para corretores',
    description:
      'Permite à seguradora empoderar o corretor ou agente nas jornadas de ofertas personalizadas, gerando propostas inteligentes e individualização do discurso explicativo.',
    icon: 'Users',
    tone: '#0ed8f6',
  },
  {
    id: 'devops-ai',
    name: 'DevOps AI',
    tagline: 'IA generativa na esteira de desenvolvimento',
    description:
      'Solução integrada com uso de IA generativa que orquestra toda a esteira de DevOps, gerando maior produtividade em toda a cadeia, especialmente na codificação, integrada às ferramentas líderes de mercado.',
    icon: 'Code2',
    tone: '#57B7EE',
  },
  {
    id: 'smart-sinistros',
    name: 'Smart Sinistros',
    tagline: 'Automação e conformidade em sinistros',
    description:
      'Automatiza e acelera processos de sinistros, reduzindo erros humanos, melhorando a eficiência e garantindo conformidade com as regulamentações.',
    icon: 'ShieldCheck',
    tone: '#A78BFA',
  },
  {
    id: 'update-service',
    name: 'Update Service',
    tagline: 'Qualidade contínua e evolução',
    description:
      'Altos padrões de qualidade, mantendo constância na melhoria, evolução e inovação das plataformas em produção.',
    icon: 'Workflow',
    tone: '#7CCBF3',
  },
  {
    id: 'connect',
    name: 'Connect',
    tagline: 'Distribuição de vida e autogestão',
    description:
      'Jornada de distribuição de Vida Individual, Empresarial e Grupo, com venda consultiva e autogestão do faturamento pelo estipulante.',
    icon: 'HeartHandshake',
    tone: '#C4A0FB',
  },
  {
    id: 'smart-docs',
    name: 'Smart Docs',
    tagline: 'Tipificação e extração de documentos',
    description:
      'Solução poderosa para identificar documentos em arquivos com múltiplas imagens, tipificação e extração de dados para Onboarding (Aceitação da Proposta) e Abertura de Sinistros.',
    icon: 'Layers',
    tone: '#6EE7B7',
  },
  {
    id: 'guru-voice',
    name: 'Guru Voice',
    tagline: 'Assistente conversacional com LLM',
    description:
      'Assistente conversacional via Alexa (com LLM) para educação de corretores e segurados, com quizzes e FAQ, turbinado com aplicações transacionais.',
    icon: 'Cpu',
    tone: '#0ed8f6',
  },
];
