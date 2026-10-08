'use client';

/**
 * HeroCanvas — a parte cinematográfica do hero: o que antes era o `<video>` raspado.
 *
 * Dois irmãos na mesma caixa, pôster embaixo e canvas em cima:
 *
 *   <picture>  quadro 1 da sequência (AVIF, por tier) com `poster.webp` como fallback.
 *              É o elemento do LCP (`fetchPriority="high"` + `<link rel="preload">` por tier) e
 *              é marcado `data-route-critical-media`: o `RouteLoadGate` espera por ele, como
 *              esperava pelo pôster do vídeo. Fica no DOM o tempo todo — com movimento reduzido
 *              ou sem AVIF é o que o visitante vê.
 *   <canvas>   invisível até o primeiro quadro ser desenhado (`data-estado="ativo"`, ver o CSS
 *              em `globals.css`), porque um contexto `alpha: false` nasce preto.
 *
 * As media queries do `<picture>` e dos preloads são a MESMA regra de `escolherTier`
 * (`heroFrameConfig`), para o quadro 1 do pôster ser o arquivo que a fila vai pedir primeiro.
 * Nenhum texto aqui: o que é escrita do hero vive em `HeroCaptions`/`HeroPitch`, em HTML.
 */
import type { RefObject } from 'react';
import {
  CONSULTA_HD,
  LARGURA_MINIMA_HD,
  PONTO_DE_QUEBRA_DESKTOP,
  tier,
  urlDoPoster,
  urlDoQuadro,
} from './heroFrameConfig';
import { useHeroFrameSequence } from './useHeroFrameSequence';

type Props = {
  gatilho: RefObject<HTMLElement | null>;
  carregar: boolean;
};

const MQ_HD_DPR = `${PONTO_DE_QUEBRA_DESKTOP} and ${CONSULTA_HD}`;
const MQ_HD_LARGO = `(min-width: ${LARGURA_MINIMA_HD}px)`;
/* Complemento de `(min-width: 1024px)`; o `.98` é a folga de praxe para larguras fracionárias. */
const MQ_MOBILE = '(max-width: 1023.98px)';

export default function HeroCanvas({ gatilho, carregar }: Props) {
  const { caixa, canvas, poster } = useHeroFrameSequence({ gatilho, carregar });

  /* Degrada enquanto um tier não foi gerado (mesma regra de `escolherTier`): o que faltar
     cai para o vizinho disponível. Sem tier nenhum não há cena — só a base navy do pai. */
  const mobile = tier('mobile') ?? tier('desktop') ?? tier('desktop-hd');
  const desktop = tier('desktop') ?? mobile;
  const hd = tier('desktop-hd') ?? desktop;
  if (!mobile || !desktop || !hd) return null;

  return (
    <div ref={caixa} className="hero-canvas-caixa" aria-hidden="true">
      {/* React 19 iça `<link>` para o `<head>`. Só o quadro 1 de cada tier é preload — nunca a
          sequência — e o `type` faz quem não decodifica AVIF ignorar o pedido. */}
      <link rel="preload" as="image" type="image/avif" href={urlDoQuadro(hd, 0)} media={MQ_HD_DPR} fetchPriority="high" />
      <link rel="preload" as="image" type="image/avif" href={urlDoQuadro(hd, 0)} media={MQ_HD_LARGO} fetchPriority="high" />
      <link rel="preload" as="image" type="image/avif" href={urlDoQuadro(desktop, 0)} media={PONTO_DE_QUEBRA_DESKTOP} fetchPriority="high" />
      <link rel="preload" as="image" type="image/avif" href={urlDoQuadro(mobile, 0)} media={MQ_MOBILE} fetchPriority="high" />
      <picture>
        <source type="image/avif" media={MQ_HD_DPR} srcSet={urlDoQuadro(hd, 0)} />
        <source type="image/avif" media={MQ_HD_LARGO} srcSet={urlDoQuadro(hd, 0)} />
        <source type="image/avif" media={PONTO_DE_QUEBRA_DESKTOP} srcSet={urlDoQuadro(desktop, 0)} />
        <source type="image/avif" srcSet={urlDoQuadro(mobile, 0)} />
        <source type="image/webp" media={PONTO_DE_QUEBRA_DESKTOP} srcSet={urlDoPoster(desktop)} />
        <img
          ref={poster}
          className="hero-poster"
          src={urlDoPoster(mobile)}
          alt=""
          width={mobile.largura}
          height={mobile.altura}
          decoding="async"
          fetchPriority="high"
          data-route-critical-media=""
        />
      </picture>
      <canvas ref={canvas} className="hero-canvas" data-estado="inicial" />
    </div>
  );
}
