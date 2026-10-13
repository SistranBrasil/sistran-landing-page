'use client';

import CarimboBatida from '@/components/CarimboBatida';
import { useCarimboDoLugar } from '@/components/carimbo/CarimbosEmUsoProvider';

/**
 * O CARIMBO DE UM LUGAR DO INVENTÁRIO — o nó que substitui `<CarimboBatida>` nos
 * vinte pontos de `LUGARES_CARIMBO`.
 *
 * Ele é uma CASCA FINA de propósito: pergunta ao contexto se há troca para este
 * lugar e repassa tudo para `CarimboBatida`, que continua sendo o dono da batida,
 * do portão de rota, do observador de quadro e dos dois canais de movimento
 * reduzido. Nada daquele componente mudou — e é isso que mantém a animação, o
 * `priority` do topo e o calibre de revelação idênticos ao que já estava medido.
 *
 * ⚠️ AS PROPS DE ARTE CONTINUAM OBRIGATÓRIAS, e isso é o desenho, não sobra:
 * elas são a arte ORIGINAL, o que o site mostra quando ninguém trocou nada. Fazer
 * o componente buscar o padrão no inventário pareceria mais limpo e teria dois
 * defeitos: quem lê `About.tsx` deixaria de ver qual carimbo está naquela seção
 * (precisaria abrir outro arquivo), e o site passaria a depender do inventário
 * para pintar — um erro de digitação em `lugar` apagaria o carimbo da página em
 * vez de só deixar de aplicar a troca.
 *
 * ⚠️ O `alt` NUNCA VEM DO CATÁLOGO. O texto alternativo descreve o papel da peça
 * NAQUELE ponto da página, e vários lugares usam `alt=""` justamente porque há um
 * `<h2>` ao lado dizendo a mesma frase — trocar a arte não muda isso. Se o `alt`
 * viesse do carimbo, uma troca poderia fazer o leitor de tela anunciar a marca
 * duas vezes, ou nomear uma peça que é decorativa. Quem responde pelo `alt` é o
 * JSX da seção.
 */
export default function CarimboDoLugar({
  lugar,
  src,
  alt,
  larguraIntrinseca,
  alturaIntrinseca,
  className,
  gatilho,
}: {
  /** O `id` em `LUGARES_CARIMBO`. É a chave que o admin atribui. */
  lugar: string;
  src: string;
  alt: string;
  larguraIntrinseca: number;
  alturaIntrinseca: number;
  className?: string;
  gatilho?: 'rota' | 'viewport';
}) {
  const trocado = useCarimboDoLugar(lugar);

  return (
    <CarimboBatida
      src={trocado?.src ?? src}
      alt={alt}
      /* As medidas vêm JUNTAS com o `src`, do mesmo objeto, e nunca misturadas:
         `CarimboBatida` monta o `aspect-ratio` com elas, e um carimbo novo quase
         nunca tem a proporção do que estava ali. Herdar a largura do original com
         a arte nova é exatamente como se achata uma imagem. */
      larguraIntrinseca={trocado?.largura ?? larguraIntrinseca}
      alturaIntrinseca={trocado?.altura ?? alturaIntrinseca}
      className={className}
      gatilho={gatilho}
    />
  );
}
