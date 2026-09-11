import type { LucideIcon } from 'lucide-react';
import { ICONS } from '@/lib/icons';
import type { ImpactVisual } from '@/data/types';

/**
 * SIS-200 — o ícone de cada célula da fileira "Sistran em números".
 *
 * ── Por que este mapa existe fora de `src/data/metrics.ts` ──────────────────
 * Porque `src/data/` é território do copy-lock: o extrator trata aquela pasta como
 * conteúdo e ali TODO literal entra no lock como texto do site. Um campo
 * `icon: 'Users'` em cada métrica fez o `npm run test:copy` reportar sete "textos
 * novos" — nomes de componente misturados com "Clientes" e "Prêmios e
 * Reconhecimentos". A nota longa, com a decisão inteira, está no cabeçalho de
 * `metrics.ts`.
 *
 * Aqui os valores são COMPONENTES, não strings: `Users`, e não `'Users'`. Nenhuma
 * das posições que o extrator varre (nó de texto do JSX e props declaradas) tem
 * literal novo, então o lock segue descrevendo só o que a tela escreve. É a razão
 * técnica de o arquivo ser `.ts` e não parte do `.tsx` do componente.
 *
 * ── Por que ícone LITERAL, ao contrário de `ImpactVisuais.tsx` ──────────────
 * O cabeçalho daquele arquivo diz por extenso que os sete grafismos NÃO são ícones
 * literais: "sem usuário, sem troféu, sem mapa, sem velocímetro, sem cubo, sem
 * escudo, sem checkmark". Aquilo continua valendo para a lente do modo dirigido,
 * onde um desenho de 200x200 tem espaço para sugerir em vez de nomear.
 *
 * A fileira estática pede o oposto, e por uma restrição de tamanho: numa caixa de
 * ~52px com glifo de 28px não há espaço para sugerir. Reduzir aqueles sete a essa
 * escala não daria sete ícones discretos — `ClientNetwork` tem 14 esferas com
 * traço de 0,8 e `CapacityPulse` tem 24 barras radiais; a 28px os traços caem
 * abaixo de meio pixel e os sete convergem para a mesma mancha ciano, que é
 * exatamente o "sete ícones idênticos" que a issue proíbe. Some-se que o
 * vocabulário CSS `.iv*` que os pinta vive todo dentro do
 * `@media (min-width: 1024px)` do modo dirigido — reusá-los pediria republicar
 * aquele bloco, que a SIS-165 declarou inerte de propósito.
 *
 * Os dois coexistem, então, com papéis separados: `visual` desenha a lente,
 * este mapa desenha a célula. A CHAVE é a mesma (`ImpactVisual`) para que
 * acrescentar um indicador obrigue a preencher os dois — `Record` completo, sem
 * `Partial` e sem valor de reserva: célula sem ícone é a desigualdade que a
 * SIS-200 existe para fechar, e um `?? Sparkles` a esconderia num ícone genérico
 * em produção em vez de reprovar no `tsc`.
 *
 * ── Catálogo, nunca `lucide-react` direto ──────────────────────────────────
 * Os sete saem de `ICONS` (`src/lib/icons.ts`), que é o catálogo da casa, e os
 * sete JÁ estavam lá — o catálogo não cresceu nesta passada. Ícone novo entra
 * primeiro lá, como em `Differentials`/`getIcon`.
 *
 * `getIcon` não é usado aqui de propósito: ele recebe `IconName` e devolve um
 * componente, o que serve a quem já tem o nome em mão (o caso de `Differentials`,
 * cujo `icon` vem do dado). Aqui a origem é o `visual`, não um `IconName`, e
 * passar por `getIcon` exigiria um mapa intermediário de `ImpactVisual` para
 * `IconName` — os mesmos sete pares, com um salto no meio.
 */
export const ICONE_POR_VISUAL: Record<ImpactVisual, LucideIcon> = {
  /* Membros do Grupo Sistran — pessoas. */
  'people-network': ICONS.Users,
  /* Prêmios e Reconhecimentos. */
  'award-facets': ICONS.Award,
  /* Clientes — a relação, não a multidão: `Users` já é o indicador de membros, e
     dois ícones de pessoas na mesma fileira seriam os "ícones idênticos" que a
     issue proíbe, com sete células para comparar lado a lado. */
  'client-network': ICONS.Handshake,
  /* Mil horas de Capacidade Produtiva — horas. */
  'capacity-pulse': ICONS.Clock,
  /* Implementação de ERPs — camadas de sistema, o mesmo vocabulário do grafismo
     `ErpLayers`, que também são planos empilhados. */
  'erp-layers': ICONS.Layers,
  /* Total de Seguradoras — seguro. `ShieldCheck` e não `Shield`: o escudo puro é
     usado como ícone de segurança em `Differentials`, e o par escudo/escudo entre
     seções lidas na mesma rolagem confundiria os dois assuntos. */
  'insurer-network': ICONS.ShieldCheck,
  /* Implantações de Sinistro — o fluxo do comunicado à regulação. */
  'claims-flow': ICONS.Workflow,
};
