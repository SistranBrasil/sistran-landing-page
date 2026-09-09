/**
 * HeroImageBackdrop — foto de fundo atrás de um bloco de abertura.
 *
 * SIS-113 — irmão estático do `HeroVideoBackdrop`, e por isso reaproveita as
 * MESMAS classes (`.hero-backdrop*`): o que a abertura de `/esg` precisava já
 * estava resolvido lá e não valia resolver de novo — o empilhamento fechado
 * (`isolation: isolate`, para a mídia não disputar camada com o cabeçalho fixo),
 * o `-7rem/-9rem` que faz a mídia subir por trás do header em vez de nascer
 * embaixo dele, o véu de contraste calibrado na SIS-94 e a pluma da SIS-112, que
 * é justamente o que a issue pede quando fala de "sombra leve, sem aresta".
 *
 * A diferença é só a mídia: `next/image` em vez de `<video>`. Por ser imagem,
 * não há laço, não há autoplay e não há nada a pausar com
 * `prefers-reduced-motion` — daí o componente ser de servidor, sem estado e sem
 * `'use client'`. A abertura fica idêntica com a preferência ligada ou desligada,
 * o que é o comportamento que a preferência pede.
 *
 * Não é um `HeroVideoBackdrop` com prop `tipo`: seriam dois corpos diferentes
 * dentro de um `if`, um deles carregando o efeito de pausa que o outro nunca usa
 * — e obrigaria a rota estática a virar cliente sem precisar.
 */

import Image from 'next/image';
import type { ReactNode } from 'react';

type Props = {
  src: string;
  alt: string;
  /**
   * `object-position` da foto. O assunto raramente está no centro do quadro, e a
   * caixa da abertura é muito mais larga que alta — o `cover` corta em cima e
   * embaixo, então é o valor VERTICAL que decide o que sobrevive ao recorte.
   */
  foco?: string;
  /** Classe extra no wrapper, para ajustes de véu/layout de uma página. */
  className?: string;
  children: ReactNode;
};

export default function HeroImageBackdrop({ src, alt, foco, className, children }: Props) {
  return (
    <div className={className ? `hero-backdrop ${className}` : 'hero-backdrop'}>
      <div aria-hidden className="hero-backdrop-midia">
        <Image
          className="hero-backdrop-video"
          src={src}
          alt={alt}
          /* `fill`, e não `width`/`height`: a caixa é a da abertura, que muda de
             altura com o comprimento do título (ver `escalaDoTitulo` no
             `PageHero`) — não há proporção fixa a declarar. */
          fill
          /* Cobre a largura da janela inteira: a mídia é `inset: … 0 0 0`, então
             qualquer `sizes` menor faria o navegador baixar um arquivo estreito
             para uma caixa full-bleed. */
          sizes="100vw"
          /* É a maior imagem acima da dobra — sem `priority` ela entra na fila do
             `lazy` e a abertura abre em navy chapado por um instante. */
          priority
          style={foco ? { objectPosition: foco } : undefined}
        />
      </div>
      {/* O par de camadas de escurecimento do `HeroVideoBackdrop`: o gradiente
          vertical segura o contraste do título sobre os trechos claros da foto e
          o chapado devolve o navy da página. A pluma do topo (SIS-112) vem de
          `.hero-backdrop-veu::before`, junto. */}
      <div aria-hidden className="hero-backdrop-veu" />
      <div className="hero-backdrop-conteudo">{children}</div>
    </div>
  );
}
