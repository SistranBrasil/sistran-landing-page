import type { Differential } from './types';

/* Os 4 titulos sao os "Valores" da pagina A Sistran, tambem usados nos 4 boxes
   da home ("Entrega com Alta Performance e Comprometimento"). No site esses
   boxes sao SO titulo, sem descricao — as descricoes abaixo vem, verbatim, dos
   blocos correspondentes de "Por que SISTRAN?" (A Sistran, secao 13), para nao
   inventar texto e ainda assim o card ter conteudo.
   Fonte: .claude/conteudo-site/01-a-sistran.md (secoes 6 e 13) */
export const DIFFERENTIALS: readonly (Differential & { description: string })[] = [
  {
    id: 'conhecimento-seguros',
    title: 'Conhecimento em Seguros',
    icon: 'Shield',
    color: '#0ed8f6',
    // "Especialistas em Seguridade (BRASIL)"
    description:
      'Foco é Solução de Seguridade: melhor "blend" entre consultoria e desenvolvedor de aplicações. Conhecemos a realidade deste mercado local e seus detalhes: Ofertas, Jornadas completas, Gestão de Contratos, Aspectos Regulatórios/legais, Financeiros e Contábeis.',
  },
  {
    id: 'flexibilidade',
    title: 'Flexibilidade',
    icon: 'Zap',
    color: '#57B7EE',
    /* "Sem amarras: Flexibilidade". A primeira oracao do site ("A Sistran nao
       escraviza seus clientes com contratos e codigos fechados") ficou fora:
       vocabulario que a propria auditoria de conteudo marcou como improprio
       para institucional. O resto é verbatim. */
    description:
      'Sem amarras: a tecnologia é aberta e padrão de mercado, além de possibilidades de aquisição do código fonte.',
  },
  {
    id: 'tecnologia',
    title: 'Tecnologia',
    icon: 'Cpu',
    color: '#A78BFA',
    // "Tecnologia / Solução sob medida / produtos"
    description:
      'Especialistas em Tecnologia e Negócios, com o uso de aceleradores escaláveis e comprovados, desenvolvidos e mantidos por nós; a partir deles construiremos solução específica, isto se traduz em menor risco, valor agregado, timing.',
  },
  {
    id: 'solidez-permanencia',
    title: 'Solidez e permanência',
    icon: 'Building2',
    color: '#C4A0FB',
    // "Continuidade/Confiabilidade (\"Future Proof\")"
    description:
      'Nossa história de 45+ anos Latam comprova a seriedade e competência através de mais de 150 clientes.',
  },
] as const;
