'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useRevealTrigger } from './useRevealTrigger';
import { useRouteLoadGate } from '@/components/loading/RouteLoadGate';

/**
 * SIS-193 — a única fiação entre um trecho de página e os estados de movimento
 * do bloco "SIS-193 · fundação" do `globals.css`. Escreve `data-in` num
 * envelope e sai da frente.
 *
 * Existe para que uma seção que é SERVER COMPONENT continue sendo: os filhos
 * chegam já renderizados no servidor, e o que passa a ser cliente é só o
 * observador. É assim que a grade de marcas (SIS-195) ganha a cascata sem
 * virar componente de estado — o argumento do docblock do `BrandGrid`.
 */
type Props = {
  children: ReactNode;
  className?: string;
  /**
   * SIS-263 (2ª volta) — por onde a ROTA afina duração e curva do reveal, sem
   * tocar nos tokens globais: as custom properties `--reveal-dur` e
   * `--reveal-ease` herdam daqui para os nós marcados. Mudar
   * `--motion-reveal-base` no `:root` mexeria na home e nas outras rotas, que
   * estão fora do escopo da issue; mudar `--motion-ease-out` no escopo mexeria
   * também nos hovers dos cartões que vivem dentro dele.
   */
  style?: CSSProperties;
  /**
   * `true` faz o gatilho esperar a cortina do `RouteLoadGate` levantar antes de
   * observar — ver o motivo medido no docblock de `useRevealTrigger`. Padrão
   * `false`: nenhuma rota já existente muda de comportamento.
   */
  esperarRota?: boolean;
  /** `false` reverte ao sair de cena — o comportamento da parede de logos. */
  umaVez?: boolean;
  /** Reverte apenas ao voltar acima, como `play none none reverse`. */
  reverterSomenteAcima?: boolean;
  /** Fração visível para acender. */
  limiar?: number;
  margem?: string;
  /**
   * SIS-270 — rótulo do escopo para MEDIÇÃO, e nada mais: nenhuma regra de
   * `globals.css` casa com ele. Existe porque o portão da SIS-270
   * (`scripts/medir-reveal-carreira-sis270.mjs`) precisa dizer QUAL escopo
   * acendeu em qual `scrollY` — sem um nome no DOM, uma linha do tempo com dois
   * escopos é uma lista de booleanos anônimos, e o critério da issue é
   * exatamente "não acenderam todos juntos".
   * Opcional, então nenhum uso existente de `RevealScope` muda.
   */
  'data-reveal-nome'?: string;
};

export default function RevealScope({
  children,
  className,
  style,
  esperarRota = false,
  umaVez = true,
  reverterSomenteAcima = false,
  limiar = 0.2,
  margem = '0px 0px -12% 0px',
  'data-reveal-nome': nome,
}: Props) {
  /* O portão devolve `null` fora do `RouteLoadGate` (testes, storybook, rota sem
     cortina). Nesse caso não há o que esperar, e `pronto` tem de ser `true` — do
     contrário o bloco ficaria escondido para sempre, que é o pior defeito
     possível num sistema cuja premissa é "sem JS o conteúdo aparece". */
  const portao = useRouteLoadGate();
  const pronto = esperarRota ? (portao?.liberado ?? true) : true;

  /* `data-in` é escrito no DOM pelo próprio gatilho — ver o docblock de
     `useRevealTrigger`. Aqui só entra a `ref`. */
  const { ref } = useRevealTrigger<HTMLDivElement>({
    limiar,
    umaVez,
    reverterSomenteAcima,
    margem,
    pronto,
  });

  return (
    <div ref={ref} className={className} style={style} data-reveal-nome={nome}>
      {children}
    </div>
  );
}
