'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { useReducedMotion } from '@/lib/motion';

/**
 * SIS-140 item 3 — o foguete que acompanha a rolagem atrás das escritas de SOCIAL.
 *
 * O MOTIVO NÃO É INVENTADO (ponto de atenção 6). O selo do Projeto Gerando
 * Talentos, que está nesta mesma seção, tem um ônibus espacial decolando: tanque
 * externo ao centro, dois foguetes auxiliares nas laterais, o orbitador branco à
 * frente e um rastro azul em arco saindo pela esquerda. A silhueta abaixo é esse
 * desenho, simplificado — a issue pede para reaproveitar a silhueta em SVG, e o
 * selo é um `.webp` (raster), então não havia vetor para extrair: o caminho foi
 * traçado a partir dele. O que se preservou é o que identifica o motivo: as três
 * colunas (tanque + dois auxiliares), o nariz único, as três chamas e o arco do
 * rastro. Não é um foguete de foguetinho genérico, é AQUELE.
 *
 * POR QUE ELE ERA SÓ BRANCO, E O QUE MUDOU NA SIS-234. O argumento antigo ficou
 * aqui inteiro porque ele continua sendo a régua — o que a SIS-234 revoga é a
 * conclusão, não a física. A seção é clara (`section-light-blue`: gradiente de
 * `#f2f9fe` a `#cfe7f7`) e o texto dela é navy (`text-ink` #0a1f44) e azul-acinzentado
 * (`text-ink-muted` #3d5a80). Numa seção clara com tinta escura, TODA camada que
 * escurece o fundo derruba o contraste do texto, e toda camada que o clareia só
 * pode aumentá-lo. Daí a silhueta ter nascido em branco translúcido e nada mais.
 *
 * A SIS-234 pede cor e leitura 3D, tomando o `logo-Gerando-Talentos.webp` como
 * referência, e permite atenuar se a cor forte machucar o texto. O que a medida
 * disse (`scripts/medir-foguete-social-sis234.mjs`, máscara de glifos):
 * `text-ink-muted` tem luminância 0,0986, então para 4,5:1 o fundo de cada letra
 * precisa de L ≥ 0,619 — e o fundo desta seção sob o foguete já está em ~0,75.
 * A folga é de ~0,13 de luminância, e é ela que decide a paleta:
 *   · navy `#001849` do selo está FORA. Em qualquer alfa que se veja, ele leva o
 *     fundo abaixo de 0,619 — não há contorno navy, nem sombra, nem placa.
 *   · laranja `#f88633` chega ao limite em alfa 0,25 sobre fundo aberto (L≈0,620,
 *     razão 4,51:1). Ficou em 0,26, e não abaixo: o alfa do degradê é o PICO de
 *     um stop no meio da peça, não uma chapa — a conta de teto vale para tinta
 *     cheia. Quem manda é a medida, e ela dá 4,96:1 no pior ponto.
 *   · azul `#0d8ac4` é mais escuro: o teto de chapa é alfa ~0,12. Ficou em 0,10.
 * Ou seja: as tintas são as MEDIDAS no selo (laranja da moldura, azul do rastro,
 * prata do orbitador), em tinta lavada. O 3D não vem de escurecer, vem de
 * DEGRADÊS por peça — aresta sombreada, faixa de brilho no meio, realce no nariz
 * e anéis nas tubeiras. É volume por variação de tom claro, que é o único volume
 * que esta seção comporta.
 *
 * A 390 a coluna é única e a silhueta cruza texto de ponta a ponta, então lá a
 * camada inteira entra a 60% (`opacity-60 md:opacity-100`). Foi a única atenuação
 * necessária, e ela é a que a issue autoriza — não houve volta ao branco chapado.
 *
 * O NÚMERO, medido com máscara de glifos em 9 passos do trajeto (390/1024/1440),
 * comparando a MESMA página com e sem a silhueta (`SEM_FOGUETE=1`):
 *   sob o foguete, com ele: 4,96 · 4,81 · 5,39 — todos acima de 4,5:1
 *   sob o foguete, sem ele: 3,74 · 5,06 · 5,39
 * Isto é, a 390 o foguete MELHORA o pior ponto (3,74 → 4,96), porque a camada
 * ainda clareia no saldo; a 1440 ele não muda nada. Os 4,33:1 e 4,28:1 que a
 * seção tem no pior ponto GLOBAL a 1024/1440 são iguais com e sem foguete: vêm da
 * placa translúcida do `glass-card` sobre o gradiente, são anteriores a esta
 * issue e estão fora do escopo dela.
 *
 * POR QUE NÃO HÁ `setState` AQUI (ponto de atenção 5, segunda metade). O progresso
 * vira `MotionValue` e o `motion.div` escreve o `transform` direto no nó do DOM,
 * fora do ciclo de render do React — zero commit por quadro. É o mesmo caminho do
 * `TituloAceso`, e é a alternativa ao erro que o `PartnersTrail.tsx` documenta
 * ("Maximum update depth exceeded", de atualizar estado a cada quadro de rolagem).
 *
 * Acessibilidade e movimento reduzido: `aria-hidden` (é decoração, não informa
 * nada), `pointer-events: none` (não rouba clique do que está atrás/à frente) e
 * `z-index: -1` dentro de um pai `isolate`, o que o põe acima do fundo da seção e
 * abaixo de todo o conteúdo em fluxo. Com `prefers-reduced-motion: reduce` ele
 * para — e para VISÍVEL, no meio do trajeto, nunca fora da tela nem transparente.
 */
export default function FogueteScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const reduzido = useReducedMotion();

  /* `start end` → `end start`: o progresso cobre toda a travessia da seção pela
     janela, então o foguete tem curso inteiro em vez de só o pedaço central. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  /* SIS-207 — POR QUE O TRAJETO É `sticky` E NÃO `absolute`, e este é o conserto
     do "sumiu no meio da seção".
     A camada era `absolute inset-0` sobre a seção inteira: uma caixa de 1622px
     (medido a 1440) que rola junto com a página. Uma silhueta de 580px dentro dela
     só cruza a janela num trecho da travessia — medido antes: em 5 dos 11 passos com
     a seção em quadro (a 1440), 6 de 12 (a 1366) e 11 de 17 (a 390) NÃO havia
     foguete nenhum na tela. O foguete aparecia por volta do miolo da seção e ia
     embora; a leitura era "está preso perto do selo".
     E não é questão de calibrar `y`: a conta não fecha. Com a caixa rolando à
     velocidade da página, a posição do foguete na janela é `(altura da janela − s) +
     y(p)`, e para ela ficar dentro de `[0, altura da janela]` durante os `H + janela`
     pixels da travessia o `y` teria de crescer à mesma velocidade do scroll — que é
     dizer `position: fixed`. `sticky top-0` é esse comportamento, LIMITADO à seção:
     antes de a seção encostar no topo o âncora acompanha a borda de cima dela (que é
     justo onde a parte visível da seção está, entrando pela base da janela); depois
     ele prega no topo da janela e fica lá até a seção ir embora. Presença do começo
     ao fim, sem vazar para ENVIRONMENT nem para GOVERNANCE.
     A caixa `sticky` tem altura ZERO de propósito: é âncora, não moldura. Com
     `h-[100svh]` ela desprega uma janela ANTES do fim da seção (a caixa tem de caber
     no pai), e o trecho final voltaria a ficar sem foguete — o mesmo defeito com
     outro nome.
     E o `overflow-hidden` de fora saiu: `hidden` cria um scrollport, e `sticky`
     dentro de um scrollport que não rola não prega em nada. Ficou `overflow-clip`
     (os DOIS eixos), que recorta sem criar scrollport — a mesma razão escrita no
     `body` (globals.css) e no `overflow-x-clip` desta seção (SIS-184).
     Recortar no eixo Y também não é preciosismo: medido com `overflow-x-clip`, a
     silhueta pintava acima da borda de cima da seção em 6 dos 11 passos a 1440 (no
     primeiro deles, 178px dela caíam dentro do ENVIRONMENT). O `sticky` prega no topo
     da JANELA, então em parte da travessia o foguete está fora da caixa da seção por
     construção — quem confina é o recorte, não a coordenada. */

  /* O `y` é em `svh` porque o curso é medido na JANELA, não na altura da silhueta:
     é a janela que define o que está em quadro. O joelho em 0,34 é onde o âncora
     acaba de pregar no topo (`janela / (altura da seção + janela)` ≈ 0,36 a 1440,
     0,33 a 1366): antes dele o âncora ainda desce com a borda da seção, então o `y`
     sai de um valor negativo para não empurrar a silhueta abaixo da janela. Somando
     as duas parcelas, a subida na tela é monótona de ~68svh a −6svh — decolagem, e
     não vaivém.
     Com movimento reduzido os três viram constantes: `12svh` deixa a silhueta
     inteira em quadro, e no trecho pregado ela fica literalmente imóvel na janela.
     A árvore renderizada é a MESMA nos dois casos (só os números do `useTransform`
     mudam), que é o que evita o mismatch de hidratação — `useReducedMotion` só
     conhece a preferência no cliente. */
  const y = useTransform(
    scrollYProgress,
    [0, 0.34, 1],
    reduzido ? ['12svh', '12svh', '12svh'] : ['-34svh', '28svh', '-6svh'],
  );
  /* Deriva lateral pequena: um voo reto lê como sprite subindo, um voo com desvio
     lê como trajetória. 4% da largura da caixa, não mais. */
  const x = useTransform(scrollYProgress, [0, 0.5, 1], reduzido ? ['0%', '0%', '0%'] : ['0%', '4%', '0%']);
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], reduzido ? [8, 8, 8] : [14, 6, 2]);

  return (
    <div
      ref={ref}
      aria-hidden
      data-foguete="social"
      className="pointer-events-none absolute inset-0 -z-10 overflow-clip"
    >
      {/* Âncora de altura zero. `top-0` prega no topo da janela; o `sticky` só vale
          dentro do pai, e o pai é a seção — daí o confinamento. */}
      <div className="sticky top-0 h-0 w-full">
        <motion.div
          /* Encostada na borda DIREITA da seção, e não no `right-[9%]` de antes.
             O `.container-lp` satura em 1180px, então a 1440 o conteúdo vai de x=130 a
             x=1310 e a faixa de fundo aberto tem só 130px de cada lado — mais estreita
             que a silhueta. Encostar na borda é o que garante que uma parte dela caia
             sempre sobre fundo aberto, em vez de ficar inteira atrás das fotos das
             turmas (opacas), que era o outro motivo de "não se vê". O que passa por
             trás de TEXTO continua legível por construção: a camada só clareia. */
          className="absolute right-[-2%] top-0 w-[168px] opacity-60 md:right-[-1%] md:w-[232px] md:opacity-100"
          style={{ x, y, rotate }}
        >
          <svg viewBox="0 0 120 300" fill="none" className="h-auto w-full">
            {/* SIS-234 — os degradês. Todos os alfas obedecem ao teto medido no
                JSDoc (laranja 0,26 no pico; azul 0,10), e cada peça tem aresta mais
                fraca e miolo mais forte: é isso que dá cilindro em vez de recorte
                chapado. As peças SEGUEM sobrepostas, como antes — a união é a
                silhueta, e o encaixe não precisa ser exato. */}
            <defs>
              {/* Tanque central: prata do selo, luz vindo da esquerda. */}
              <linearGradient id="foguete-social-tanque" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#d6dce3" stopOpacity="0.30" />
                <stop offset="0.34" stopColor="#fefdff" stopOpacity="0.94" />
                <stop offset="0.62" stopColor="#fefdff" stopOpacity="0.70" />
                <stop offset="1" stopColor="#0d8ac4" stopOpacity="0.10" />
              </linearGradient>
              {/* Auxiliares: a moldura laranja do selo. É a peça mais colorida. */}
              <linearGradient id="foguete-social-auxiliar" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#fefdff" stopOpacity="0.72" />
                <stop offset="0.45" stopColor="#f88633" stopOpacity="0.26" />
                <stop offset="1" stopColor="#0d8ac4" stopOpacity="0.10" />
              </linearGradient>
              {/* Orbitador: branco do selo, com o topo mais aceso que a barriga —
                  o nariz é a parte que pega luz primeiro na decolagem. */}
              <linearGradient id="foguete-social-orbitador" x1="0" y1="0" x2="0.75" y2="1">
                <stop offset="0" stopColor="#fefdff" stopOpacity="0.96" />
                <stop offset="0.55" stopColor="#fefdff" stopOpacity="0.74" />
                <stop offset="1" stopColor="#2087ad" stopOpacity="0.10" />
              </linearGradient>
              {/* Chama: laranja em cima, azul lavado na ponta, dissolvendo. */}
              <linearGradient id="foguete-social-chama" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f88633" stopOpacity="0.26" />
                <stop offset="0.5" stopColor="#f38835" stopOpacity="0.18" />
                <stop offset="1" stopColor="#0d8ac4" stopOpacity="0.04" />
              </linearGradient>
              {/* Rastro: o arco azul do selo, esteira e não estrutura. */}
              <linearGradient id="foguete-social-rastro" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#2087ad" stopOpacity="0.10" />
                <stop offset="1" stopColor="#0d8ac4" stopOpacity="0.02" />
              </linearGradient>
              {/* Realce do nariz: é o que faz o cone ler como redondo. */}
              <radialGradient id="foguete-social-brilho" cx="0.4" cy="0.3" r="0.7">
                <stop offset="0" stopColor="#fefdff" stopOpacity="0.9" />
                <stop offset="1" stopColor="#fefdff" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* O rastro em arco do selo, saindo pela esquerda e para baixo. */}
            <path d="M50 214c-16 14-34 22-49 21 15 12 37 9 56-4z" fill="url(#foguete-social-rastro)" />
            {/* As três chamas, abaixo do corpo e as partes mais fracas. */}
            <g fill="url(#foguete-social-chama)">
              <path d="M38 188c4.5 11 4.5 24 0 37-4.5-13-4.5-26 0-37z" />
              <path d="M82 188c4.5 11 4.5 24 0 37-4.5-13-4.5-26 0-37z" />
              <path d="M60 202c5.5 13 5.5 28 0 43-5.5-15-5.5-30 0-43z" />
            </g>
            {/* Corpo: os dois auxiliares, o tanque e o orbitador à frente. */}
            <path d="M38 62c4.5 0 8 6 8 13v115H30V75c0-7 3.5-13 8-13z" fill="url(#foguete-social-auxiliar)" />
            <path d="M82 62c4.5 0 8 6 8 13v115H74V75c0-7 3.5-13 8-13z" fill="url(#foguete-social-auxiliar)" />
            <path d="M60 24c7.5 0 13 9 13 21v157H47V45c0-12 5.5-21 13-21z" fill="url(#foguete-social-tanque)" />
            <path d="M60 40c6 0 10 12 10 26v72l17 27H33l17-27V66c0-14 4-26 10-26z" fill="url(#foguete-social-orbitador)" />
            {/* Profundidade por tom claro, nunca por tinta escura: o realce do
                nariz e os anéis das tubeiras. Os anéis são traço de 1 unidade em
                azul lavado — sem eles as três colunas terminam em corte reto e a
                peça volta a ler como adesivo. */}
            <ellipse cx="56" cy="52" rx="9" ry="14" fill="url(#foguete-social-brilho)" />
            <g stroke="#2087ad" strokeOpacity="0.06" strokeWidth="1" fill="none">
              <path d="M30 184h16M74 184h16M47 178h26" />
            </g>
          </svg>
        </motion.div>
      </div>
    </div>
  );
}
