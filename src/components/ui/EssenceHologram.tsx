'use client';

/**
 * EssenceHologram — a arte de cada faixa de "Nossa essência" num palco 3D que o
 * visitante gira com o dedo, o mouse ou o teclado.
 *
 * ── Sem fundo: só a peça e a sombra ────────────────────────────────────────
 * Os três renders são PNG de quatro canais, com o fundo já transparente — o que
 * parecia preto era o alfa composto sobre preto por quem abriu o arquivo. Então
 * não há placa, cartão nem moldura: a peça flutua recortada sobre a faixa clara.
 * A profundidade vem de `drop-shadow` na própria imagem (segue o contorno, ao
 * contrário de `box-shadow`, que sairia no retângulo da tag), do halo que pulsa
 * atrás dela e da sombra deitada no chão. Ver o `.css`.
 *
 * ── Duas camadas de transformação, e o motivo ───────────────────────────────
 * `.eh-orbita` leva a flutuação em `@keyframes` e `.eh-carta` leva a rotação que
 * vem do gesto. Fossem o mesmo nó, CSS e JavaScript escreveriam na MESMA
 * propriedade `transform` e um apagaria o outro a cada quadro — o resultado é a
 * animação travando ou o arrasto pulando de volta. Aninhadas, as duas se
 * compõem.
 *
 * ── Nada re-renderiza durante o gesto ──────────────────────────────────────
 * A rotação viaja por variável CSS escrita num ref. Estado do React para ângulo
 * seria um re-render por movimento de ponteiro, e a árvore inteira da faixa
 * junto. O único estado aqui é "está arrastando", que muda duas vezes por gesto.
 *
 * ── Movimento reduzido ─────────────────────────────────────────────────────
 * Sai a flutuação e sai o pulso — tudo que se move sozinho. O arrasto FICA: ele só acontece porque a pessoa pediu, e é o meio de ver a peça
 * de outro ângulo. Desligar interação pedida não é reduzir movimento, é remover
 * função.
 */

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import './essence-hologram.css';

/* Limites da inclinação. Passando disto a peça se achata em perspectiva e a arte
   fica ilegível — girar é para dar volume, não para virar o objeto de costas. */
const LIMITE_X = 22;
const LIMITE_Y = 30;
/* Graus por pixel arrastado, e por tecla. A 0.38 (primeiro valor testado) 80px de
   arrasto ja batiam no limite dos 30° — o curso inteiro caberia num gesto curto e
   a peca parecia presa. A 0.24 o limite chega em ~125px, que é um gesto de
   verdade. */
const SENSIBILIDADE = 0.24;
const PASSO_TECLA = 6;

const preso = (v: number, limite: number) => Math.min(limite, Math.max(-limite, v));

type Props = {
  /** Base do arquivo, sem largura nem extensão: `missao` → `missao-560.webp`. */
  arte: string;
  /** Descrição da peça. Vai para `aria-label` — a arte não é decoração vazia. */
  alt: string;
  /* Proporção real do arquivo, por peça — não é a mesma nas três: a Missão é 3:2
     e as outras duas são quadradas. Fixar um valor só reservaria a altura errada
     em duas delas e a página pularia quando a imagem chegasse. */
  largura: number;
  altura: number;
};

export default function EssenceHologram({ arte, alt, largura, altura }: Props) {
  const palco = useRef<HTMLDivElement>(null);
  const angulo = useRef({ x: -6, y: 0 });
  const arrasto = useRef<{ id: number; px: number; py: number } | null>(null);
  const [girando, setGirando] = useState(false);
  const dicaId = useId();

  const aplicar = useCallback(() => {
    const el = palco.current;
    if (!el) return;
    el.style.setProperty('--eh-rx', `${angulo.current.x}deg`);
    el.style.setProperty('--eh-ry', `${angulo.current.y}deg`);
  }, []);

  /* Pose inicial já inclinada: uma placa perfeitamente de frente não anuncia que
     tem profundidade, e ninguém tenta girar o que parece plano. */
  useEffect(aplicar, [aplicar]);

  const girar = useCallback(
    (dx: number, dy: number) => {
      angulo.current = {
        x: preso(angulo.current.x - dy, LIMITE_X),
        y: preso(angulo.current.y + dx, LIMITE_Y),
      };
      aplicar();
    },
    [aplicar],
  );

  const aoDescer = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    /* `setPointerCapture` é o que faz o arrasto continuar quando o ponteiro sai
       da placa — sem ele, mover rápido solta o objeto no meio do gesto. */
    e.currentTarget.setPointerCapture(e.pointerId);
    arrasto.current = { id: e.pointerId, px: e.clientX, py: e.clientY };
    setGirando(true);
  }, []);

  const aoMover = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const a = arrasto.current;
      if (!a || a.id !== e.pointerId) return;
      girar((e.clientX - a.px) * SENSIBILIDADE, (e.clientY - a.py) * SENSIBILIDADE);
      a.px = e.clientX;
      a.py = e.clientY;
    },
    [girar],
  );

  const aoSoltar = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (arrasto.current?.id !== e.pointerId) return;
    arrasto.current = null;
    setGirando(false);
  }, []);

  const aoTeclar = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const passos: Record<string, [number, number]> = {
        ArrowLeft: [-PASSO_TECLA, 0],
        ArrowRight: [PASSO_TECLA, 0],
        ArrowUp: [0, -PASSO_TECLA],
        ArrowDown: [0, PASSO_TECLA],
      };
      const passo = passos[e.key];
      if (passo) {
        e.preventDefault();
        girar(passo[0], passo[1]);
        return;
      }
      /* Volta à pose inicial: sem isto, quem girou de mais no teclado não tem
         como desfazer a não ser contando teclas ao contrário. */
      if (e.key === 'Home' || e.key === 'Escape') {
        e.preventDefault();
        angulo.current = { x: -6, y: 0 };
        aplicar();
      }
    },
    [aplicar, girar],
  );

  return (
    <div className="eh-raiz">
      <div
        ref={palco}
        className="eh-palco"
        data-girando={girando ? '1' : '0'}
        /* `role="img"` com rótulo: para o leitor de tela isto é uma imagem, e o
           que ela mostra está no `alt`. A dica de teclado é descrição, não nome —
           por isso vai em `aria-describedby` e não colada no rótulo. */
        role="img"
        aria-label={alt}
        aria-describedby={dicaId}
        tabIndex={0}
        onPointerDown={aoDescer}
        onPointerMove={aoMover}
        onPointerUp={aoSoltar}
        onPointerCancel={aoSoltar}
        onKeyDown={aoTeclar}
      >
        <div className="eh-orbita">
          <div className="eh-carta">
            <span aria-hidden className="eh-brilho" />
            {/* Tag simples porque o projeto roda com `images: { unoptimized: true }`:
                o componente do framework não geraria variante nenhuma, e o srcSet
                escrito à mão é o que de fato entrega o arquivo menor no celular. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="eh-arte"
              src={`/images/essencia/${arte}-1120.webp`}
              srcSet={`/images/essencia/${arte}-560.webp 560w, /images/essencia/${arte}-1120.webp 1120w`}
              sizes="(min-width: 1280px) 34vw, (min-width: 768px) 40vw, 88vw"
              width={largura}
              height={altura}
              alt=""
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </div>
          {/* Sombra no chão, num plano próprio: é ela que faz a peça parecer
              apoiada sobre a página em vez de colada nela. */}
          <span aria-hidden className="eh-sombra" />
        </div>
      </div>
      <p className="eh-dica" id={dicaId}>
        Arraste para girar — ou use as setas do teclado.
      </p>
    </div>
  );
}
