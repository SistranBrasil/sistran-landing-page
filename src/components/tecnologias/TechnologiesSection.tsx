'use client';

/**
 * A seção de Tecnologias de `/quem-somos` — SIS-280, contra `docs/tecnologia.md` e
 * o mock `public/imagensexemplo/tecnologia.png`.
 *
 * Ordem da composição, que é a do mock de cima para baixo:
 *   carimbo oficial → faixa superior → destaque central → faixa inferior.
 *
 * ── SEM TÍTULO TEXTUAL, e isto é o primeiro critério de aceite ───────────────
 * «Não inserir o título textual “Tecnologias”» / «O título “Tecnologias” não
 * existir». O nome da seção vem do CARIMBO, que é arte. Não há `h2`, não há
 * eyebrow, não há `sr-only` com a palavra — a `<section>` recebe `aria-label`,
 * que nomeia a região para quem usa leitor de tela sem imprimir tinta nenhuma.
 * O componente anterior (`TechnologyShowcase`) tinha um `motion.h2` com o literal
 * `Tecnologias`, e era um dos defeitos apontados pela issue.
 *
 * ── POR QUE ESTE NÓ É CLIENTE, e os filhos quase não são ─────────────────────
 * Só por uma razão: `visibilitychange`, para «pausar animações quando a aba do
 * navegador não estiver ativa» (item 9). O estado desce de duas formas
 * diferentes, e de propósito:
 *   · para as FAIXAS, como atributo `data-aba` — elas são CSS puro e param com
 *     `animation-play-state`, sem virar cliente e sem re-renderizar;
 *   · para o DESTAQUE, como prop — um `setTimeout` não obedece a atributo.
 *
 * ── O QUE FICOU SEM CONSUMIDOR ──────────────────────────────────────────────
 * `TechnologyShowcase.tsx` e `technology-showcase.css` continuam no repositório,
 * sem ninguém que os importe. Não foram comentados: são ~1170 linhas somadas, e
 * comentá-las não preservaria nada que o arquivo vivo já não preserve melhor. É o
 * mesmo tratamento que `BuildingShowcase` recebe nesta mesma página — «continua no
 * repositório, sem consumidor». O que a issue rejeita naquele componente (fundo
 * azul-marinho, título textual, palco de sete itens, `ChevronLeft`/`Right` e barra
 * de progresso) está descrito aqui e em `src/data/tecnologias.ts`.
 */

import { useEffect, useState } from 'react';
import CarimboBatida from '@/components/CarimboBatida';
import TechnologyMarquee from './TechnologyMarquee';
import TechnologySpotlight from './TechnologySpotlight';
import {
  TECNOLOGIAS_FAIXA_INFERIOR,
  TECNOLOGIAS_FAIXA_SUPERIOR,
} from '@/data/tecnologias';
import './tecnologias.css';

/* Medidas INTRÍNSECAS do arquivo do carimbo, lidas no cabeçalho do PNG:
   `public/carimbo-tecnologias-ticket-outline-0757c7.png` = 978 × 330. São elas que
   `CarimboBatida` transforma em `--carimbo-batida-ar`, e é esse `aspect-ratio` que
   garante o «não modificar proporção» do item 2. A largura de exibição (370/300/245)
   vem do CSS, pela variável `--carimbo-batida-w`. */
const CARIMBO_W = 978;
const CARIMBO_H = 330;

export default function TechnologiesSection() {
  const [abaOculta, setAbaOculta] = useState(false);

  useEffect(() => {
    const ler = () => setAbaOculta(document.visibilityState === 'hidden');
    ler();
    document.addEventListener('visibilitychange', ler);
    return () => document.removeEventListener('visibilitychange', ler);
  }, []);

  return (
    <section
      className="tec-secao"
      /* Nomeia a região SEM imprimir o título que o doc proíbe. */
      aria-label="Tecnologias utilizadas pela Sistran"
      data-aba={abaOculta ? 'oculta' : 'ativa'}
    >
      {/* Os planos decorativos do item 1. Todos `aria-hidden`, como o item 9 pede. */}
      <div className="tec-fundo" aria-hidden="true">
        <span className="tec-fundo__grade" />
        <span className="tec-fundo__brilho" />
        <span className="tec-fundo__orbita" />
        <span className="tec-fundo__orbita" />
        <span className="tec-fundo__orbita" />
        <span className="tec-fundo__pontos" />
      </div>

      <div className="tec-miolo">
        {/* CARIMBO E FAIXA DE CIMA NA MESMA LINHA — pedido da usuária depois de ver
            a seção montada: «quero que a linha de cima das logos fique passando ao
            lado direito do carimbo». Antes eram dois filhos empilhados de
            `.tec-miolo` (carimbo, faixa, destaque, faixa), que é a leitura de cima
            para baixo do mock. Agora os dois primeiros dividem uma linha, e é o
            CSS que faz a faixa começar onde o carimbo termina — a faixa não é
            recortada, ela apenas nasce mais à direita, e a máscara das pontas
            continua sendo a mesma. Abaixo de 768px a linha volta a empilhar: ali
            não cabem os dois lado a lado sem esmagar um dos dois. */}
        <div className="tec-topo">
          <div className="tec-carimbo">
            <CarimboBatida
              className="tec-carimbo__arte"
              src="/carimbo-tecnologias-ticket-outline-0757c7.png"
              alt="Carimbo Sistran Tecnologias"
              larguraIntrinseca={CARIMBO_W}
              alturaIntrinseca={CARIMBO_H}
              /* `viewport`, e não `rota`: a seção nasce bem abaixo da dobra em
                 `/quem-somos`. Com `gatilho="rota"` a batida aconteceria fora da
                 tela (ninguém veria) e o `priority` do `<Image>` disputaria banda
                 com o herói da página. */
              gatilho="viewport"
            />
          </div>

          <TechnologyMarquee
            itens={TECNOLOGIAS_FAIXA_SUPERIOR}
            sentido="esquerda"
            rotulo="Linguagens e bancos de dados"
          />
        </div>

        <TechnologySpotlight abaOculta={abaOculta} />

        <TechnologyMarquee
          itens={TECNOLOGIAS_FAIXA_INFERIOR}
          sentido="direita"
          rotulo="Integração, frameworks e inteligência artificial"
        />
      </div>
    </section>
  );
}
