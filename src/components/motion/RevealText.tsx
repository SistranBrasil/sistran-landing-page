'use client';

import type { CSSProperties, ElementType } from 'react';
import { useRevealTrigger } from './useRevealTrigger';

/**
 * SIS-194 — título que sobe por baixo de uma máscara, palavra por palavra
 * (`docs/efeitos-scroll-terminal-industries.md`, Efeito 2).
 *
 * ── Palavras, e não linhas ─────────────────────────────────────────────────
 * O doc aceita os dois ("usar palavras ou linhas") e a casa tem um motivo forte
 * para escolher palavra: dividir por LINHA exige medir a quebra depois de a
 * fonte carregar e remedir a cada resize, e os títulos daqui têm
 * `text-wrap: balance` com largura em `ch` — a contagem de linhas muda entre
 * 1440 e 320 (está medido em `globals.css`, na nota da SIS-155). Uma divisão
 * por linha medida errado corta o título ao meio. Palavra é estável em
 * qualquer largura: cada máscara é do tamanho da própria palavra, e a quebra
 * continua sendo do navegador.
 *
 * ── O que o leitor de tela ouve ────────────────────────────────────────────
 * O texto inteiro UMA vez, via `aria-label` no elemento pai; as máscaras são
 * `aria-hidden`. Sem isso a leitura sai palavra por palavra, com pausa entre
 * cada uma.
 *
 * ── Onde NÃO usar ──────────────────────────────────────────────────────────
 * • Parágrafos. O doc proíbe e a razão é a leitura, não o custo.
 * • Título com degradê em `background-clip: text` — a manchete do hero
 *   (`Alta Performance`, SIS-192). Fatiar em `inline-block` faz cada palavra
 *   receber o degradê inteiro, e a rampa de cor recomeça em cada pedaço: o
 *   efeito da marca vira listras. Aquele título fica de fora, declaradamente.
 */
type Props = {
  /** O título, em texto puro. É ele que vai para o `aria-label`. */
  children: string;
  /** Elemento do título. Default `h2` — a hierarquia é de quem chama. */
  as?: ElementType;
  className?: string;
  id?: string;
};

export default function RevealText({
  children,
  as: Tag = 'h2',
  className,
  id,
}: Props) {
  /* `top 82%` do doc: o título acende pouco depois de encostar na tela. Uma vez
     só — reversão é da parede de logos, não de título de seção. */
  const { ref } = useRevealTrigger<HTMLElement>({
    limiar: 0.1,
    umaVez: true,
    margem: '0px 0px -18% 0px',
  });

  /* `split(/(\s+)/)` guarda os separadores: o espaço fica FORA da máscara, senão
     ele entra no `inline-block` e a linha deixa de poder quebrar ali. */
  const pedacos = children.split(/(\s+)/);
  /* A ordem de cada palavra é calculada ANTES do JSX, e não com um contador
     mutável dentro do `map`: reatribuir variável durante o render é erro de
     lint aqui (`react-hooks/…`, "Cannot reassign variable after render
     completes") porque o compilador do React pode reexecutar o corpo. Um
     `reduce` puro dá o mesmo resultado sem estado. */
  const ordens = pedacos.reduce<number[]>((acc, pedaco, i) => {
    acc[i] = i === 0 ? 0 : acc[i - 1] + (pedacos[i - 1].trim() ? 1 : 0);
    return acc;
  }, []);

  return (
    <Tag ref={ref} id={id} className={className} aria-label={children}>
      {pedacos.map((pedaco, i) => {
        if (!pedaco.trim()) return pedaco;
        const ordem = ordens[i];
        return (
          <span className="reveal-line" aria-hidden="true" key={`${pedaco}-${i}`}>
            <span
              className="reveal-line__inner"
              style={{ '--word-i': ordem } as CSSProperties}
            >
              {pedaco}
            </span>
          </span>
        );
      })}
    </Tag>
  );
}
