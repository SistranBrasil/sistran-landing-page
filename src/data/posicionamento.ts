/**
 * Perfil & Posicionamento — dados da secao "Ecossistema Sistran".
 *
 * Toda a escrita desta secao mora aqui: o JSX de `PositioningEcosystem` nao
 * carrega texto nenhum. Os itens vem do diagrama institucional de perfil e
 * posicionamento (conhecimento em seguros, negocio e consultoria, tecnologia e
 * servicos, e as solucoes que atendem toda a cadeia de seguros) — nada foi
 * reescrito, apenas redistribuido e com a capitalizacao normalizada.
 */

import {
  Blocks,
  BookMarked,
  BrainCircuit,
  Building2,
  ClipboardList,
  Code2,
  FileSearch,
  Globe,
  Layers,
  LifeBuoy,
  Lightbulb,
  RefreshCw,
  Rocket,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react';

export type EcoItem = { texto: string; icon: LucideIcon };

export type EcoModulo = {
  /** Numero exibido no canto do cartao; tambem alimenta o progresso. */
  indice: string;
  /** Chave de estilo/aria, nao aparece na tela. */
  tipo: 'consulting' | 'services';
  titulo: string;
  itens: EcoItem[];
};

export const ECO_EYEBROW = 'Perfil & posicionamento';

/** O titulo é partido para a ultima palavra receber o ciano da marca. */
export const ECO_TITULO = {
  inicio: 'Onde seguros, negócio e tecnologia',
  destaque: 'convergem',
} as const;

export type EcoPilar = {
  linhas: readonly string[];
  /** Indices das linhas que recebem o ciano. */
  destaques: readonly number[];
  texto: string;
  icon: LucideIcon;
};

export const ECO_PILAR_VALOR: EcoPilar = {
  linhas: ['Agregamos', 'valor', 'a toda', 'cadeia de seguros'],
  destaques: [1],
  texto: 'Da estratégia à operação, geramos valor em cada etapa da cadeia de seguros.',
  icon: ShieldCheck,
};

export const ECO_PILAR_CONHECIMENTO: EcoPilar = {
  linhas: ['Sólido', 'conhecimento', 'em Seguros'],
  destaques: [1],
  texto: 'Profundo domínio do mercado e das práticas que impulsionam resultados reais.',
  icon: BookMarked,
};

export const ECO_SOLUCOES_TITULO = 'Soluções';

export const ECO_SOLUCOES = [
  { titulo: 'Plataformas de ERP', texto: 'Apólice e Sinistros', icon: Layers },
  {
    titulo: 'Aceleradores',
    texto: 'Connect API, Guru de Seguros, Smart Miner, Fast Claims',
    icon: Rocket,
  },
  { titulo: 'Portais', texto: 'Jornadas de Vendas, Serviços e Sinistros', icon: Globe },
] as const;

export const ECO_MODULOS: EcoModulo[] = [
  {
    indice: '01',
    tipo: 'consulting',
    titulo: 'Negócio & Consultoria',
    itens: [
      { texto: 'Consultoria de Negócios', icon: Users },
      { texto: 'Design Thinking', icon: Lightbulb },
      { texto: 'Inovação / Arquitetura', icon: Building2 },
      { texto: 'Integrações de Soluções', icon: Blocks },
      { texto: 'Data Science / IA', icon: BrainCircuit },
    ],
  },
  {
    indice: '02',
    tipo: 'services',
    titulo: 'Vilas Ágeis & Serviços',
    itens: [
      { texto: 'Desenvolvimento', icon: Code2 },
      { texto: 'Projetos', icon: ClipboardList },
      { texto: 'Análise Funcional', icon: FileSearch },
      { texto: 'Quality Assurance', icon: ShieldCheck },
      { texto: 'Migrações / Conversões', icon: RefreshCw },
      { texto: 'Sustentação', icon: LifeBuoy },
    ],
  },
];

export const ECO_NUCLEO = {
  frase: 'Falamos segurês!',
  /** Simbolo oficial (branco sobre transparente) — usado como mascara alpha. */
  simbolo: '/images/sistran-logo.png',
} as const;
