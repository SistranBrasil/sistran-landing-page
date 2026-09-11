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
   segue declarado em `globals.css`.

   ── SIS-200: o icone de cada celula NAO mora aqui, e a razao é o copy-lock ───
   A issue pede um icone por indicador na fileira, e o lugar obvio seria um campo
   `icon` ao lado de `visual`, neste arquivo. Foi tentado, e o portao reprovou: o
   extrator do lock trata `src/data/` como conteudo e ali TODO literal conta
   (`scripts/copy-lock.mjs`, na regra por posicao — "`src/data` é conteudo, e ali
   todo literal conta"). Sete `icon: 'Users'` entraram no relatorio como sete
   textos novos do site, ao lado de "Clientes" e "Premios e Reconhecimentos".

   Atualizar o lock faria a reprovacao passar, e é a saida errada: o lock deixaria
   de descrever o que o visitante le e passaria a incluir nomes de componente.
   Ninguem consegue revisar uma lista de copy em que "Workflow" e "Mil horas de
   Capacidade Produtiva no Brasil" sao a mesma coisa — e o alarme que grita por
   ruido é o alarme que se aprende a ignorar.

   Entao o mapa vive na camada de componente, chaveado pelo `visual` que ja esta
   aqui: `src/components/ui/impact/ImpactIcones.ts`. Os valores de lá sao
   COMPONENTES importados, nao literais, e por isso nenhum deles é texto para o
   extrator — o lock continua descrevendo so o que a tela escreve.

   ⚠️ Consequencia para quem acrescentar um indicador: `visual` é a chave dos
   DOIS mapas (o grafismo de `ImpactVisuais.tsx` e o icone de `ImpactIcones.ts`),
   e os dois sao `Record<ImpactVisual, …>` completos — esquecer um deles é erro de
   tipo, nao celula sem icone em producao. Foi por isso que a chave é `visual` e
   nao `id`. */
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
