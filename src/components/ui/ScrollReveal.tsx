'use client';

import { motion } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';
import { easeExpo, useReducedMotion } from '@/lib/motion';

/**
 * Entrada por rolagem para blocos de conteudo.
 *
 * Duas regras vindas de `.claude/skills/scroll-orchestrated-lp`:
 *
 * 1. `whileInView` com `once`, nunca `initial` puro. Cartao e lista sao
 *    conteudo: se a animacao morrer no meio, o estado final tem de ser o
 *    visivel, senao o texto desaparece para sempre.
 * 2. A arvore nao muda com a preferencia de movimento. Com movimento reduzido
 *    as variantes viram o mesmo objeto (opacidade 1, sem deslocamento) — mesmo
 *    DOM, mesmos nos, sem risco de hidratacao.
 *
 * So `transform` e `opacity` sao animados. O `indice` escalona a cascata sem
 * precisar de um pai orquestrador, o que deixa cada item independente do
 * momento em que entra na tela.
 */

const PASSO = 0.07; // atraso entre itens vizinhos
const ATRASO_MAX = 0.42; // teto: com 10 cartoes o ultimo nao pode chegar tarde

type Props = {
  children: ReactNode;
  /** Posicao do item na lista; define o atraso da cascata. */
  indice?: number;
  /** Distancia percorrida na entrada, em pixels. Eixo Y. */
  distancia?: number;
  /** Deslocamento HORIZONTAL da entrada, em pixels. SIS-177 — `docs/celen.md` §
      «Animação de entrada» pede, para a coluna textual, «`opacity: 0` para `1` e
      pequeno deslocamento horizontal da esquerda»; o componente só sabia mover em
      Y. Negativo entra pela esquerda. Padrão `0`: aditivo, nenhum consumidor
      existente muda de quadro. */
  distanciaX?: number;
  /** Tag semantica do no animado; o elemento certo depende do contexto (li em
      lista, article em cartao autonomo), e trocar a tag nao muda a animacao. */
  as?: keyof typeof TAGS;
  /** Cortina (`clip-path`) na entrada. 23/09 — passou a ser desligável, e não por
      gosto: `clip-path` recorta TAMBÉM a sombra projetada do elemento, e
      `inset(0% 0% 0% 0%)`, o estado final, continua recortando na borda da caixa.
      Num cartão de canto reto isso não se vê; num cartão com sombra atrás (os
      Diferenciais de `/quem-somos`) a sombra simplesmente não existe, com o CSS
      dela intacto no computado — foi medido. Desligada, a entrada continua por
      opacidade, deslocamento e escala; o que sai é só a revelação de cima para
      baixo. Por padrão fica LIGADA, para nenhum consumidor existente mudar. */
  cortina?: boolean;
  /* ⚠️ SIS-177 — `cortinaLado?: 'baixo' | 'direita'` existiu e saiu. A cortina pela
     direita partiria de `inset(0 0 0 100%)` para revelar a arte da Celent da direita
     para a esquerda; medido, o recorte inicial zera (100%) ou reduz a 12% (88%) o
     rácio de interseção do nó observado, abaixo do `amount: 0.2` do `viewport`, e o
     `whileInView` nunca dispara — a imagem ficaria invisível para sempre. A medida
     completa e o caminho de volta estão no ⚠️ ao lado do `clipPath`, no corpo. */
  /** Duração da entrada, em segundos. SIS-277 — `docs/comagimos.md` §9 fecha a
      entrada dos cards de «Como Agimos» entre 450ms e 600ms, e o padrão daqui é
      700ms; sem este parâmetro a alternativa era um segundo componente de reveal
      só para uma seção, que é o oposto do que o documento manda («reutilize o
      componente de reveal já existente»). O padrão fica em 0.7 de propósito: é
      aditivo, e nenhum dos consumidores existentes muda de comportamento. */
  duracao?: number;
  className?: string;
  style?: CSSProperties;
};

const TAGS = {
  div: motion.div,
  li: motion.li,
  article: motion.article,
  section: motion.section,
} as const;

export default function ScrollReveal({
  children,
  indice = 0,
  distancia = 22,
  distanciaX = 0,
  as = 'div',
  cortina = true,
  duracao = 0.7,
  className,
  style,
}: Props) {
  const reduzido = useReducedMotion();
  const Tag = TAGS[as];

  /* Sem cortina a propriedade nem entra nas variantes — declarar
     `clipPath: 'none'` deixaria o recorte ativo em `inset(0%)` durante a
     interpolacao e o problema da sombra voltaria no meio da entrada. */
  const fim = {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    ...(cortina ? { clipPath: 'inset(0% 0% 0% 0%)' } : {}),
  };

  return (
    <Tag
      className={className}
      style={style}
      initial={
        reduzido
          ? fim
          : {
              opacity: 0,
              y: distancia,
              x: distanciaX,
              scale: 0.97,
              /* Cortina: o cartao é revelado de cima para baixo. Mesmo tipo de
                 forma no inicio e no fim (`inset`), senao a interpolacao nao
                 acontece. O valor de 32% nao é estetico: é o teto de recorte que
                 ainda deixa o nó com 68% de area intersectando a janela, acima do
                 `amount: 0.2` do `viewport` logo abaixo. Ver o ⚠️ de `cortinaLado`. */
              ...(cortina ? { clipPath: 'inset(0% 0% 32% 0%)' } : {}),
              /* ⚠️ SIS-177 — A CORTINA PELA DIREITA FOI RETIRADA, E É UM IMPASSE
                 MEDIDO, não um gosto. A intenção era `cortinaLado === 'direita'`
                 partir de `inset(0% 0% 0% 100%)` para a arte da Celent nascer na
                 borda direita. O que foi medido no navegador:

                   • a 100%: o `IntersectionObserver` do próprio motion devolve
                     rácio 0 — o nó observado está recortado a nada. O
                     `whileInView` nunca dispara, o estado inicial fica para
                     sempre, e a `<img>` `lazy` nem chega a carregar
                     (`complete: false`, natural 0×0).
                   • a 88% (experimento): a `<img>` carrega (natural 1672×941), e
                     um observador meu sobre o mesmo nó registrou rácio 12% —
                     abaixo do `amount: 0.2` desta linha. O `whileInView`
                     legitimamente não dispara. A arte continua invisível.

                 Ou seja: o recorte inicial que deveria esconder o nó é o mesmo que
                 faz o observador encarregado de liberá-lo nunca acionar. Esconder
                 conteúdo para sempre é o defeito que a régua da casa proíbe, então
                 a arte passou a entrar por opacidade + deslocamento horizontal
                 dentro da moldura com `overflow: hidden` — caminho que
                 `docs/celen.md` autoriza por escrito («máscara, `clip-path` ou o
                 componente de reveal já existente»).

                 Se um dia a máscara literal voltar a ser exigida, o caminho NÃO é
                 mexer nesta linha: é o `clip-path` morar num nó INTERNO, que não
                 seja o observado, com o nó de fora inteiro para o observador. */
            }
      }
      whileInView={fim}
      /* SIS-71: viewport proprio, e nao o `VP` de `motion.ts`, de proposito. `VP`
         usa `margin: '-80px'` e nenhum `amount`, o que serve a um bloco unico
         entrando em cena. Aqui cada item se observa sozinho para escalonar a
         cascata pelo `indice`: com -80px o ultimo cartao de uma grade de quatro
         so dispararia bem depois de ja estar visivel, e o `amount: 0.2` e o que
         faz um cartao alto comecar a entrar sem esperar 20% da tela. */
      viewport={{ once: true, amount: 0.2, margin: '-40px' }}
      transition={
        reduzido
          ? { duration: 0 }
          : {
              duration: duracao,
              ease: easeExpo,
              delay: Math.min(indice * PASSO, ATRASO_MAX),
            }
      }
    >
      {children}
    </Tag>
  );
}
