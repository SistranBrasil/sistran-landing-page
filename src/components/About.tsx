'use client';

/**
 * SIS-280 — «Sobre nós / A Sistran» de `/quem-somos`, refeita no desenho de
 * `docs/sobrenos.md` mais a mock `public/imagensexemplo/sobrenos.png`.
 *
 * ── O QUE SAIU, E POR QUÊ ──
 *
 * Saíram os TRÊS CARTÕES de indicador (`glass-card` com raio 26px, wash de cor no
 * canto, marca de canto em L, trilha de hover e o detalhe em crossfade com a pista
 * «Passe o mouse»). O documento abre a especificação da estrutura com «crie uma
 * seção SEM CARDS INDIVIDUAIS», e a issue repete no escopo («sem cards»). O
 * conteúdo deles não se perdeu: os mesmos 1988 / 150+ / 18, os mesmos rótulos e as
 * mesmas três frases de detalhe agora vivem na faixa navy, separados por régua em
 * vez de por caixa — e o detalhe passou a ser TEXTO VISÍVEL em vez de aparecer só
 * no hover, que é como a mock o mostra e é ganho de acessibilidade de graça (o
 * crossfade dependia de `:hover`/`:focus-within`, e no toque a pista «Passe o
 * mouse» pedia um gesto que não existe).
 *
 * Saíram também os dois `orb` de fundo e a régua horizontal de gradiente com nove
 * pontos: o fundo desta seção passou a ser o declarado no documento (degradê
 * azul-gelo mais grade técnica de 40px), e um orbe ciano de 380px por baixo dele
 * clarearia a grade justamente onde ela deve ser «extremamente discreta».
 *
 * ── O QUE FICOU, E POR QUÊ ──
 *
 * `CountUpNumber` fica inteiro, com o docblock dele: ele é a leitura de dado da
 * casa (SIS-155 reserva a Geist Mono para número), escreve no DOM dentro do `rAF`
 * em vez de chamar `setState` por quadro, e conta TAMBÉM com movimento reduzido
 * porque a contagem é a informação, não o efeito.
 *
 * A ESCRITA É A MESMA, palavra por palavra, com duas exceções declaradas na issue:
 * o parágrafo «Somos uma empresa…» deixa de compartilhar o `<p>` do lead e passa a
 * ser parágrafo próprio (é como a mock o compõe), e «CONHECEMOS SEGUROS» passa a
 * levar o ponto para dentro da frase manuscrita. Nada foi reescrito.
 *
 * ── «CONHECEMOS SEGUROS.» ──
 *
 * Grafada segundo `docs/fonte2.md`, que o pedido em chat nomeia: Kalam, peso 400,
 * `#123B5D`, tombo de −4° e o traço ciano de ~45px desenhado da esquerda para a
 * direita. Os números e o motivo de cada escolha estão em `sobre-nos.css`.
 */

import Image from 'next/image';
// SIS-272 — `useEffect`/`useRef`/`useState` saíram daqui junto com a faixa: os três
// eram do `IntersectionObserver` do contador e do `rAF` dele, e agora vivem em
// `FaixaIndicadores`. O que resta nesta seção é a parte editorial, sem estado.
// import { useEffect, useRef, useState } from 'react';
import CarimboBatida from '@/components/CarimboBatida';
import FaixaIndicadores from '@/components/FaixaIndicadores';
import RevealScope from '@/components/motion/RevealScope';
import './sobre-nos.css';

/* SIS-272 — `HIGHLIGHTS`, `IconeIndicador`, `easeOut` e `CountUpNumber` NÃO foram
   apagados: foram MOVIDOS, sem alteração de valor nenhuma, para
   `src/components/FaixaIndicadores.tsx`, porque a home passou a montar a mesma
   faixa. Não ficam comentados aqui como a casa faz com código retirado — o motivo
   da regra é não perder o que saiu de cena, e nada saiu: o arquivo novo é o mesmo
   código, vivo, e duas cópias (uma viva e uma comentada) são exatamente a
   divergência calada que a extração existe para evitar.
   O `<span className="sr-only">` com o valor real, o `on-dark` e as classes
   `sobre-*` seguem lá, idênticos. */

/* Os acentos tipográficos da borda direita da mock. São DECORAÇÃO — `aria-hidden`
   no consumo — e as oito palavras já são ditas na prosa ao lado. */
const ACENTOS_TOPO = ['Tecnologia', 'Pessoas', 'Seguros', 'Resultados'];
const ACENTOS_BASE = ['Mais', 'Seguros', 'Para', 'Pessoas'];

export default function About() {
  /* SIS-272 — o `railRef` e o `IntersectionObserver` (threshold 0.25) que ligavam a
     contagem saíram com a faixa: quem observa a própria entrada em quadro é
     `FaixaIndicadores`, e tem de ser ele — o observador mede O NÓ DA FAIXA, que na
     home nem é filho desta seção. */

  return (
    <section id="quem-somos" className="sobre-secao">
      <RevealScope className="sobre-conteudo">
        {/* A COLUNA DA IMAGEM. O carimbo é irmão da foto e não filho dela: a foto
            tem `overflow: hidden` para o recorte funcionar, e um carimbo dentro
            dela seria cortado exatamente na parte que deve sobrar para fora. */}
        <div className="sobre-visual" data-reveal="fade-up">
          <div className="sobre-carimbo-caixa">
            <CarimboBatida
              src="/carimbo-sobre-nos-capsule-outline-0757c7.png"
              alt="Carimbo Sistran — Sobre nós"
              larguraIntrinseca={873}
              alturaIntrinseca={327}
              className="sobre-carimbo"
              /* `viewport` e não `rota`: esta seção nasce abaixo da dobra (a
                 abertura em vídeo da rota vem antes), e bater na montagem seria
                 bater com a peça fora de quadro — quem rolasse até aqui
                 encontraria o carimbo já assentado. É a distinção que o próprio
                 componente documenta. */
              gatilho="viewport"
            />
          </div>
          <div className="sobre-foto">
            <Image
              src="/sobre.png"
              alt="Profissionais da Sistran analisando informações durante uma reunião"
              fill
              /* A coluna da imagem é ~52% do vão útil em telas largas e a largura
                 inteira abaixo de 900px — os dois valores do documento. */
              sizes="(max-width: 900px) 100vw, 52vw"
              className="sobre-foto-arte"
            />
          </div>
        </div>

        {/* A COLUNA DE TEXTO */}
        <div className="sobre-copy" data-reveal="fade-up">
          {/* SIS-280 (2ª passada, a pedido): o título VISÍVEL «A Sistran» saiu
              daqui — a capa da rota já o diz em manchete, logo acima, e repetido a
              uma rolagem de distância ele era o mesmo nome duas vezes.

              O `h2` NÃO foi apagado: virou `sr-only`. A seção é um `<section
              id="quem-somos">` que o `ScrollSpy` lista e para onde a âncora do
              navegador lateral leva — sem cabeçalho ela sairia do sumário do
              documento e chegaria sem nome para quem navega por títulos, o que
              trocaria uma repetição visual por uma perda de estrutura. O texto
              continua o mesmo, palavra por palavra; só deixou de pintar.
              Para voltar a ver: trocar `sr-only` por `sobre-titulo`. */}
          <h2 className="sr-only">A Sistran</h2>

          <p className="sobre-lead">
            Com ampla presença na América do Sul, contando com mais de 150 clientes e 850
            colaboradores, a Sistran é referência em soluções tecnológicas para o setor de
            Seguros.
          </p>

          <p className="sobre-paragrafo">
            Somos uma empresa que entrega soluções em TI de forma inovadora e personalizada,
            transformando ideias em resultados tangíveis.
          </p>

          <p className="sobre-paragrafo">
            Estabelecida em 1988 no Brasil, processamos um terço de todos os prêmios de Seguro de
            Vida no país. Nossas soluções e serviços estão presentes em 18 países, com qualidade e
            confiabilidade. Construímos relacionamentos sólidos e duradouros com o cliente,
            trabalhando no aperfeiçoamento contínuo de tudo que fazemos em benefício dos usuários
            finais.
          </p>

          {/* A citação da mock: barra ciano à esquerda, sem caixa em volta. */}
          <blockquote className="sobre-citacao">
            <p>
              Com profunda especialização em Seguros e sólida compreensão das necessidades do
              mercado, oferecemos também consultoria especializada em inteligência artificial e
              DEVOPS, criando ofertas personalizadas que impulsionam o sucesso das Seguradoras.
              Aqui, realmente
            </p>
            {/* A assinatura manuscrita de `docs/fonte2.md`. Duas linhas por
                `display: block` num `span`: continua UMA frase para leitor de
                tela. */}
            <p className="sobre-assinatura">
              <span className="sobre-assinatura-linha">CONHECEMOS</span>
              <span className="sobre-assinatura-linha">SEGUROS.</span>
              <svg
                aria-hidden
                className="sobre-assinatura-traco"
                viewBox="0 0 45 8"
                focusable="false"
              >
                <path
                  className="sobre-assinatura-risco"
                  pathLength="1"
                  d="M1 6.2C9 3.6 24 2.2 44 1.8"
                />
              </svg>
            </p>
          </blockquote>
        </div>

        {/* Os acentos tipográficos da borda direita da mock. */}
        <div aria-hidden className="sobre-acentos">
          <span className="sobre-acento-grupo">
            {ACENTOS_TOPO.map((p) => (
              <span key={p} className="sobre-acento-palavra">
                {p}
              </span>
            ))}
            <span className="sobre-acento-regua" />
          </span>
          <span className="sobre-acento-grupo">
            {ACENTOS_BASE.map((p) => (
              <span key={`base-${p}`} className="sobre-acento-palavra">
                {p}
              </span>
            ))}
          </span>
        </div>
      </RevealScope>

      {/* ── A FAIXA INSTITUCIONAL NAVY ──────────────────────────────────────────
          SIS-272 — o mesmo bloco de antes, agora em `FaixaIndicadores`: dado,
          ícones, contador, observador, camada de atmosfera e as classes `sobre-*`
          foram para lá inteiros, porque a home passou a montar esta mesma faixa e a
          issue proíbe reproduzir o visual à mão do outro lado.
          Sem props: `aresta` é `true` por default, então o que esta rota renderiza é
          o DOM idêntico ao de antes da extração — o degrau, a linha ciano e os três
          pontos continuam aqui, e o `on-dark` que salva rótulo e detalhe de sair navy
          sobre navy dentro da `div.section-light` da rota vive dentro da peça. */}
      <FaixaIndicadores />
    </section>
  );
}
