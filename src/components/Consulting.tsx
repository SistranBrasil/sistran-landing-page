import type { CSSProperties } from 'react';
import Image from 'next/image';
import { Crosshair } from 'lucide-react';
import CarimboBatida from '@/components/CarimboBatida';
import RevealScope from '@/components/motion/RevealScope';
import { CONSULTING_AREAS } from '@/data/consulting';
import { getIcon } from '@/lib/icons';
import './consultoria.css';

/**
 * SIS-204 — a seção «Consultoria» de `/solucoes`, refeita sobre
 * `docs/consultoria.md` (a issue declara o documento como fonte da verdade) e a
 * mock `public/imagensexemplo/consultoria.png`. Os números vivem em
 * `consultoria.css`, junto do motivo de cada um.
 *
 * ── O QUE SAIU, E POR QUE ─────────────────────────────────────────────────────
 * O layout anterior era uma lista de LINHAS NUMERADAS com estado de hover: cada
 * frente trazia um ordinal `01..04` em Geist Mono, um contador `01 / 04` na borda
 * direita, uma barra de acento que crescia em `scaleY` e um preenchimento branco
 * que entrava em `scaleX` na linha ativa; o cabeçalho ficava `sticky` numa coluna
 * de 20rem ao lado. O documento proíbe nominalmente número, seta, paginação, card
 * e sombra nas frentes, e pede uma grade 2×2 aberta — não havia o que reaproveitar
 * daquele arranjo, então ele saiu inteiro, junto com o `useState` que o servia.
 *
 * ── E POR ISSO A SEÇÃO DEIXOU DE SER COMPONENTE DE CLIENTE ────────────────────
 * Sem linha ativa não há estado, e sem estado não há motivo para `'use client'`
 * aqui: o que precisa de cliente é o observador do reveal (`RevealScope`) e a
 * batida do carimbo (`CarimboBatida`), que já são clientes por conta própria. Os
 * ícones do Lucide atravessam a fronteira do servidor sem cerimônia — é o que
 * `Footer.tsx` já faz nesta base.
 *
 * ── AS DUAS ARTES SÃO AS QUE A ISSUE NOMEIA ───────────────────────────────────
 * A fotografia é `/images/solucoes/consultoria-img.png` (1536×1024) e NÃO
 * `/images/consultoria.png`, que já é consumida pela introdução desta mesma rota
 * (`solucoes/page.tsx`) — duas seções da mesma página com a mesma arte seria
 * repetição visível. O carimbo é
 * `/images/carimbo-consultoria-ticket-outline-0757c7.png` (963×348).
 *
 * `width`/`height` no `next/image` são as dimensões INTRÍNSECAS dos arquivos: com
 * `images.unoptimized` (SIS-154) elas só reservam a caixa e evitam o salto de
 * layout, o arquivo é servido como está.
 */
export default function Consulting() {
  return (
    <section id="consultoria" className="consultoria-secao">
      <RevealScope className="consultoria-conteudo">
        <div className="consultoria-topo">
          <div className="consultoria-texto" data-reveal="fade-up">
            <CarimboBatida
              src="/images/carimbo-consultoria-ticket-outline-0757c7.png"
              alt="Carimbo Sistran — Consultoria"
              larguraIntrinseca={963}
              alturaIntrinseca={348}
              className="consultoria-carimbo"
              /* `viewport` e não `rota`: esta seção vive a milhares de pixels do
                 topo do documento, e bater na montagem seria bater com a peça fora
                 de quadro — quem rolasse até aqui acharia o carimbo já assentado.
                 É a distinção que o próprio componente documenta. */
              gatilho="viewport"
            />
            <h2 className="consultoria-titulo">Consultoria</h2>
            {/* Os dois parágrafos verbatim do documento — nenhum corte, nenhuma
                reescrita. */}
            <p className="consultoria-paragrafo">
              Nossa expertise abrange consultoria personalizada, projetada para impulsionar o
              crescimento e a eficiência de sua empresa:
            </p>
            <p className="consultoria-paragrafo">
              Nosso time de consultores está preparado para entender as necessidades e desafios do
              seu negócio, para oferecer soluções personalizadas que impulsionam a inovação, a
              eficiência e o crescimento da sua empresa.
            </p>
          </div>

          <figure
            className="consultoria-foto"
            data-reveal="fade-up"
            style={{ '--reveal-i': 1 } as CSSProperties}
          >
            <Image
              src="/images/solucoes/consultoria-img.png"
              alt="Três consultores em volta de uma mesa de escritório, analisando relatórios impressos ao lado de um notebook, com a cidade ao fundo pela janela."
              width={1536}
              height={1024}
              sizes="(min-width: 64rem) 56vw, 92vw"
              className="consultoria-foto-img"
            />
            {/* A cápsula é `figcaption` porque ela LEGENDA a fotografia, e o ícone
                é decorativo: quem lê em voz alta ouve a frase uma vez. */}
            <figcaption className="consultoria-selo">
              <Crosshair className="consultoria-selo-icone" strokeWidth={1.8} aria-hidden="true" />
              Estratégia sob medida
            </figcaption>
          </figure>
        </div>

        <div className="consultoria-divisor" data-reveal="fade-up">
          <h3 className="consultoria-divisor-titulo">Frentes de atuação</h3>
          {/* A única linha decorativa que o documento permite nesta área. */}
          <span aria-hidden="true" className="consultoria-divisor-linha" />
        </div>

        <ul className="consultoria-frentes">
          {CONSULTING_AREAS.map((frente, indice) => {
            const Icone = getIcon(frente.icon);
            return (
              <li
                key={frente.id}
                className="consultoria-frente"
                data-reveal="fade-up"
                /* A cascata é o índice na grade; o passo é o token da casa. */
                style={{ '--reveal-i': indice + 1 } as CSSProperties}
              >
                <span className="consultoria-frente-icone">
                  <Icone strokeWidth={1.7} aria-hidden="true" />
                </span>
                <div>
                  <h4 className="consultoria-frente-titulo">{frente.title}</h4>
                  <p className="consultoria-frente-texto">{frente.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </RevealScope>
    </section>
  );
}
