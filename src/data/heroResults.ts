/**
 * Indicadores de "Resultados" no fim do percurso do hero.
 *
 * A escrita e os valores vem da apresentacao de legado
 * (`apresentação/site/content/site.ts`, `metricsIntro` e `metrics`) — nada aqui
 * foi reescrito.
 *
 * ⚠️ Os valores sao 10 / 1 / 2 / 6. Copiados da TELA da apresentacao eles
 * aparecem como 100 / 10 / 20 / 60, porque lá o numero é um contador animado e a
 * captura traz o digito em curso junto com o final. A fonte é o arquivo, nao a
 * tela.
 */

export type HeroResult = {
  value: string;
  unit: string;
  label: string;
  note: string;
};

export const HERO_RESULTS_INTRO = {
  kicker: 'Resultados | evidências dos casos',
  title: 'Resultados que conectam velocidade, qualidade e contexto.',
  text: 'Os indicadores abaixo vêm de entregas reais e devem ser lidos com seu contexto: escopo da prova, arquitetura construída, automação de qualidade e estágio de implantação.',
} as const;

export const HERO_RESULTS: readonly HeroResult[] = [
  {
    value: '10',
    unit: 'dias',
    label: 'Prova tecnológica do Gateway de Pagamentos',
    note: 'Prova tecnológica que levou o Gateway de Pagamentos de Java 7 e Struts em ambiente local para .NET 10, React, Azure SQL e Azure, com identidade visual do cliente, entrega contínua e Playwright validando os PRs.',
  },
  {
    value: '1',
    unit: 'semana',
    label: 'Prova tecnológica do Aceite Digital',
    note: 'Prova tecnológica que reinterpretou o SAD em Java e Spring, orientado ao padrão AWS, e adicionou um Portal Administrativo inexistente no legado.',
  },
  {
    value: '2',
    unit: 'destinos tecnológicos',
    label: 'Um método',
    note: 'O Gateway de Pagamentos seguiu para .NET, React e Azure; o Aceite Digital, para Java, Spring e AWS. A consistência está no método de decisão, não na preferência por uma linguagem.',
  },
  {
    value: '6',
    unit: 'etapas',
    label: 'Do legado à evolução',
    note: 'Entender, decidir, transformar, validar, entregar e evoluir. Nenhuma delas começa na primeira linha de código.',
  },
] as const;
