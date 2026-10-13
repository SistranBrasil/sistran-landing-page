'use client';

import Image from 'next/image';
import { useCarimboDoLugar } from '@/components/carimbo/CarimbosEmUsoProvider';

/**
 * O CARIMBO DE UM LUGAR QUE **NÃO** USA `CarimboBatida`.
 *
 * Hoje há um só caso, e ele é especial por desenho: o «Como Agimos» de
 * `/quem-somos`, onde a arte É O TÍTULO da seção — ela vive dentro do
 * `<h2 id="como-agimos">` e carrega o nome da seção no `alt`, exatamente como o
 * docblock daquele arquivo registra («O CARIMBO JÁ É O TÍTULO»). Por isso ele
 * nunca passou por `CarimboBatida`: não há batida, não há portão de rota, não há
 * tombo em CSS — é uma imagem de manchete.
 *
 * ⚠️ POR QUE NÃO REAPROVEITAR `CarimboDoLugar`: porque aquele componente delega a
 * `CarimboBatida`, que traz a animação de entrada, o `IntersectionObserver` e o
 * `aspect-ratio` inline. Enfiar uma manchete lá dentro significaria animar o
 * título da seção e sujeitar a arte a um tombo que ela não deve ter. Esta casca
 * faz uma coisa só: troca o arquivo se houver troca no catálogo.
 *
 * As medidas e o `alt` continuam vindo de quem chama, pela mesma razão do outro
 * componente: a arte original fica legível no JSX da seção, e o `alt` descreve o
 * papel da peça naquele ponto — aqui ele é o NOME DA SEÇÃO, e trocar a arte não
 * pode mudar isso.
 */
export default function ArteDoLugar({
  lugar,
  src,
  alt,
  largura,
  altura,
  className,
  sizes,
}: {
  lugar: string;
  src: string;
  alt: string;
  largura: number;
  altura: number;
  className?: string;
  sizes?: string;
}) {
  const trocado = useCarimboDoLugar(lugar);

  return (
    <Image
      src={trocado?.src ?? src}
      alt={alt}
      /* Largura e altura vêm JUNTAS com o `src`, do mesmo objeto: elas são a
         proporção que o `next/image` reserva, e misturar as medidas de uma arte
         com o arquivo de outra achata o desenho. */
      width={trocado?.largura ?? largura}
      height={trocado?.altura ?? altura}
      className={className}
      sizes={sizes}
    />
  );
}
