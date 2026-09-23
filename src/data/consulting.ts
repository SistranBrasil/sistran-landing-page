import type { IconName } from '@/lib/icons';

/* Textos verbatim de /solucoes-servicos-e-consultoria/, secao "Consultoria".
   Fonte: .claude/conteudo-site/04-solucoes-servicos-e-consultoria.md */

/* SIS-204 — `tone` SAIU DO TIPO. Os quatro valores (`#0ed8f6`, `#57B7EE`,
   `#A78BFA`, `#C4A0FB`) foram escolhidos para o card navy do layout anterior, e o
   próprio `Consulting.tsx` já os ignorava desde que a seção virou azul claro:
   aquela versão trazia uma tabela própria de acentos, com a nota de que os tons
   daqui desapareciam sobre fundo claro. Com a grade aberta de `docs/consultoria.md`
   não há acento por item nenhum — o traço do ícone é o mesmo ciano nos quatro. Um
   campo que ninguém lê é armadilha para a próxima issue, que pode tomá-lo por
   contrato. `CONSULTING_AREAS` tem um consumidor só (`Consulting.tsx`, conferido),
   então a remoção não alcança mais ninguém. */
export type ConsultingArea = {
  id: string;
  title: string;
  description: string;
  icon: IconName;
};

export const CONSULTING_AREAS: readonly ConsultingArea[] = [
  {
    id: 'bancassurance-embedded',
    title: 'Bancassurance: Benchmarking e Embedded Insurance / Digital',
    description:
      'Exploramos as melhores práticas do mercado e as adaptamos à sua realidade, identificando oportunidades para o crescimento do seu negócio. Ajudamos a implementar soluções de embedded insurance e digitais, otimizando a experiência do cliente e expandindo seus canais de distribuição.',
    /* SIS-204 — os quatro ícones passam a ser os que `docs/consultoria.md` lista,
       nome por nome. Aqui era `Boxes` (caixas), que não dizia nada sobre
       bancassurance; o documento pede `UsersRound` «ou equivalente», e a mock
       desenha um agrupamento de três pessoas. */
    icon: 'UsersRound',
  },
  {
    id: 'bancassurance-excelencia',
    title: 'Bancassurance: Excelência Operacional e Tecnológica',
    description:
      'Oferecemos consultoria especializada para otimizar seus processos, implementar tecnologias de ponta e garantir a máxima eficiência em suas operações.',
    icon: 'Cog',
  },
  {
    id: 'politica-ai',
    /* SIS-204 — «Política de IA», com a sigla em português, porque é assim que
       `docs/consultoria.md` escreve o título e é assim que a mock o desenha; a
       própria descrição logo abaixo já dizia «inteligência artificial (IA)», então
       o «AI» do título era a única sigla inglesa da seção. O documento é a fonte
       declarada pela issue, e isto muda o `copy-lock`. */
    title: 'Política de IA (Governança/Gestão)',
    description:
      'Auxiliamos na formulação e implementação de políticas de inteligência artificial (IA) robustas e eficazes, garantindo a governança adequada e a gestão responsável dessa tecnologia em sua empresa.',
    icon: 'ShieldCheck',
  },
  {
    id: 'analises-mercado',
    title: 'Análises e Estudos Econômicos para o Mercado Segurador',
    description:
      'Fornecemos análises e estudos econômicos detalhados, que permitem a você tomar decisões estratégicas embasadas em dados e informações precisas sobre o mercado segurador.',
    /* `BriefcaseBusiness` e não o `ChartNoAxesCombined` que o documento oferece na
       mesma linha: a mock desenha uma maleta COM barras dentro, e é essa a peça do
       Lucide que corresponde. Era `Briefcase` (maleta lisa). */
    icon: 'BriefcaseBusiness',
  },
];
