/**
 * Uma faixa horizontal contínua de cápsulas (itens 3 e 6 de `docs/tecnologia.md`).
 *
 * ── ZERO JAVASCRIPT ─────────────────────────────────────────────────────────
 * O movimento é `@keyframes` em `transform` — nenhum timer, nenhum `useEffect`,
 * nenhuma re-renderização por quadro. O componente não é `'use client'`: ele só
 * imprime a marcação, e é o CSS que anima. É o «priorizar animações feitas em
 * CSS» do item 9 levado à letra, e é o que permite que a faixa comece a se mover
 * antes da hidratação.
 *
 * As duas coisas que dependem de JS — pausar com a aba inativa e o canal
 * `html[data-motion='reduce']` — são resolvidas por ATRIBUTO em um ancestral
 * (`TechnologiesSection` escreve `data-aba`, o `layout.tsx` escreve `data-motion`),
 * de modo que nenhuma delas obriga este nó a virar cliente.
 *
 * ── A EMENDA ────────────────────────────────────────────────────────────────
 * Dois grupos IDÊNTICOS dentro da fita, e a fita anda de `0` a `-50%`. Para que
 * `-50%` caia exatamente sobre a cabeça do segundo grupo, cada grupo carrega
 * `padding-right` igual ao próprio `gap` (está em `tecnologias.css`) — senão falta
 * meio vão por volta e o salto aparece a cada ciclo.
 *
 * `repeticoes` multiplica a lista DENTRO de cada grupo, e tem dois papéis:
 *   1. o grupo precisa ser mais largo que a janela, senão a emenda passa no meio
 *      da tela em vez de fora dela;
 *   2. com a lista repetida, a emenda encosta o ÚLTIMO item da lista no PRIMEIRO —
 *      que são tecnologias diferentes. É assim que o doc é cumprido sem truque:
 *      «duplicar internamente os itens apenas para construir o loop, mas evitar
 *      tecnologias duplicadas visíveis lado a lado». Com `repeticoes={1}` numa
 *      lista de cinco isso ainda valeria, mas o grupo ficaria estreito demais.
 *
 * O segundo grupo é `aria-hidden`: ele é cópia visual, e sem a marca o leitor de
 * tela anunciaria as catorze logos duas vezes. É também por ele que a regra de
 * movimento reduzido pergunta (`[aria-hidden='true'] { display: none }`) ao
 * transformar a faixa em tira rolável.
 */
import TechnologyLogo from './TechnologyLogo';
import type { Tecnologia } from '@/data/tecnologias';

/** As cápsulas são pequenas nas três faixas de largura — a logo nunca passa de ~190px. */
const TAMANHOS = '(max-width: 767px) 128px, (max-width: 1023px) 150px, 190px';

function Grupo({
  itens,
  repeticoes,
  clone,
}: {
  itens: Tecnologia[];
  repeticoes: number;
  clone: boolean;
}) {
  return (
    <div className="tec-faixa__grupo" aria-hidden={clone || undefined}>
      {Array.from({ length: repeticoes }).flatMap((_, volta) =>
        itens.map((tec) => (
          /* A chave carrega a volta: `id` sozinho repetiria entre as repetições. */
          <span className="tec-capsula" key={`${volta}-${tec.id}`}>
            <TechnologyLogo tec={tec} className="tec-capsula__logo" tamanhos={TAMANHOS} />
          </span>
        )),
      )}
    </div>
  );
}

export default function TechnologyMarquee({
  itens,
  sentido,
  repeticoes = 2,
  rotulo,
}: {
  itens: Tecnologia[];
  /** `'esquerda'` = da direita para a esquerda (faixa de cima, item 3). */
  sentido: 'esquerda' | 'direita';
  repeticoes?: number;
  /** Nome da faixa para quem navega por leitor de tela. */
  rotulo: string;
}) {
  return (
    /* `role="group"` com nome acessível em vez de `<ul>`: a faixa não é uma lista
       ordenada de conteúdo — é uma vitrine, e as cápsulas não levam texto algum
       («nenhum texto adicional»). O nome de cada item é o `alt` da logo. */
    <div className="tec-faixa" data-sentido={sentido} role="group" aria-label={rotulo}>
      <div className="tec-faixa__fita">
        <Grupo itens={itens} repeticoes={repeticoes} clone={false} />
        <Grupo itens={itens} repeticoes={repeticoes} clone />
      </div>
    </div>
  );
}
