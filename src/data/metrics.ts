import type { Metric } from './types';

/* Os sete indicadores institucionais.
   Fonte dos valores e dos rotulos: `.claude/conteudo-site/00-home.md` (secao 4).

   ⚠️ `clientes` era 150 aqui e a fonte travada diz `| 130+ | Clientes |`. O
   codigo tinha desviado; 130 é o numero certo. A description de SEO em
   `src/app/quem-somos/page.tsx` dizia "mais de 150 clientes" e foi corrigida
   junto, senao a pagina se contradizia.

   ⚠️ As `caption` sao escrita NOVA — nao existem em `.claude/conteudo-site/`.
   Entraram porque foram pedidas junto com o desenho da secao, mas ficam
   marcadas aqui: sao o unico texto desta secao fora da fonte travada, e por
   isso o primeiro lugar a revisar se a Regra Zero (Copy Lock) for reapertada.

   SIS-165 — a Regra Zero FOI reapertada, e as sete estao COMENTADAS abaixo, uma
   por uma, com o texto integral preservado. Nao foram deletadas: o texto é o que
   vai a aprovacao, e reescreve-las depois de perdidas seria escrever copia nova
   — o proprio ato que a regra proibe. O tipo em `src/data/types.ts` passou a ter
   `caption?` para que a fonte possa ficar sem elas; o `<p className="impact-caption">`
   de `Metrics.tsx` esta comentado junto, no mesmo espirito.

   Religar é descomentar os tres lugares: as sete linhas aqui, o `<p>` no TSX e a
   volta de `caption` a obrigatorio no tipo. Nada de CSS muda — `.impact-caption`
   segue declarado em `globals.css`. */
export const METRICS: readonly Metric[] = [
  {
    id: 'membros',
    value: 850,
    suffix: '+',
    label: 'Membros do Grupo Sistran',
    // caption: 'Um time que combina negócio, tecnologia e seguros.',
    visual: 'people-network',
  },
  {
    id: 'premios',
    value: 23,
    suffix: '+',
    label: 'Prêmios e Reconhecimentos',
    // caption: 'Reconhecimento de mercado ao longo da trajetória.',
    visual: 'award-facets',
  },
  {
    id: 'clientes',
    value: 130,
    suffix: '+',
    label: 'Clientes',
    // caption: 'Operações atendidas em toda a América do Sul.',
    visual: 'client-network',
  },
  {
    id: 'horas',
    value: 650,
    suffix: '+',
    label: 'Mil horas de Capacidade Produtiva no Brasil',
    // caption: 'Capacidade produtiva instalada e sustentada no Brasil.',
    visual: 'capacity-pulse',
  },
  {
    id: 'erps',
    value: 230,
    suffix: '+',
    label: 'Implementação de ERPs',
    // caption: 'Implantações completas de sistemas de gestão de seguros.',
    visual: 'erp-layers',
  },
  {
    id: 'seguradoras',
    value: 35,
    suffix: '+',
    label: 'Total de Seguradoras',
    // caption: 'Seguradoras que operam sobre nossas soluções.',
    visual: 'insurer-network',
  },
  {
    id: 'sinistro',
    value: 25,
    suffix: '+',
    label: 'Implantações de Sinistro',
    // caption: 'Do comunicado à regulação, ponta a ponta.',
    visual: 'claims-flow',
  },
] as const;
