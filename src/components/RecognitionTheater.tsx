'use client';

/**
 * Premiacoes, Certificacoes e Reconhecimentos — "Teatro de Reconhecimentos".
 *
 * Substitui os quatro cartoes claros iguais por um palco navegavel: a trajetoria
 * a esquerda, um reconhecimento aceso por vez a direita, com o asset oficial
 * apoiado num pedestal, a contagem dominante, as miniaturas dos outros tres e a
 * linha do tempo `01 / 04`.
 *
 * FONTE UNICA DE ESTADO: `ativo`. Rolagem, clique na navegacao, miniatura, node
 * da linha do tempo, setas e teclado chamam todos o mesmo `selecionar()` — nao
 * existe estado paralelo por interacao.
 *
 * OS QUATRO PAINEIS ESTAO SEMPRE NO DOM. Quem mostra um por vez é o CSS, e so
 * acima de 1200px sem movimento reduzido; em telas estreitas e em movimento
 * reduzido o mesmo markup vira fluxo natural com os quatro visiveis. Isso
 * atende tres exigencias de uma vez: conteudo completo sem JavaScript, leitura
 * integral em movimento reduzido, e a regra de hidratacao do projeto — o valor
 * de `useReducedMotion` é `false` no servidor e no primeiro render, entao ele
 * nunca pode decidir quais nos existem (ver `src/lib/motion.ts`).
 *
 * O conector luminoso vive no VAO entre as colunas, nao sobre o palco: sao
 * quatro caminhos pre-desenhados num unico SVG, um por indice, que saem na
 * altura da linha correspondente da navegacao, curvam curto e morrem a poucos
 * pixels dentro da borda esquerda do palco — antes do spotlight. Assim a
 * geometria é certa por indice sem medir layout em JS, e nenhum traco cruza
 * trofeu, numero, titulo, miniatura ou linha do tempo.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { VP, easeExpo, prefersReducedMotion } from '@/lib/motion';
import {
  RECONHECIMENTOS,
  REC_EYEBROW,
  REC_NAV_TITULO,
  REC_SELO_ATIVO,
  REC_TITULO,
} from '@/data/reconhecimentos';
import './recognition-theater.css';

const TOTAL = RECONHECIMENTOS.length;

/* Sequencia de entrada, somando ~1.2s. Sao atrasos explicitos porque a ordem
   pedida atravessa niveis do DOM (cabecalho -> navegacao -> molduras -> palco ->
   pedestal -> asset -> numero -> linha do tempo -> miniaturas). */
const ATRASO = {
  eyebrow: 0,
  titulo: 0.1,
  nav: 0.26,
  molduras: 0.44,
  palco: 0.52,
  base: 0.86,
} as const;

function entra(delay: number, y = 18, x = 0) {
  return {
    initial: { opacity: 0, y, x },
    whileInView: { opacity: 1, y: 0, x: 0 },
    viewport: VP,
    transition: { duration: 0.5, ease: easeExpo, delay },
  };
}

/**
 * Conector do item ativo da navegacao ate o premio.
 *
 * Um caminho por indice, todos entrando pela esquerda em alturas diferentes e
 * terminando atras do asset. `key={pulso}` remonta o traco aceso, o que reinicia
 * a animacao de `stroke-dashoffset`: o desenho acontece SO na troca de estado.
 */
function RecognitionConnector({ ativo, pulso }: { ativo: number; pulso: number }) {
  /* Alturas de saida em unidades do viewBox, uma por linha da navegacao: a lista
     de quatro itens de ~78px fica centrada no palco, entao as linhas caem em
     torno do meio (200). O traco termina em x=200 de 200 — a borda direita do
     proprio SVG, que o CSS para a ~24px dentro do palco. */
  const saida = [116, 172, 228, 284];
  const caminho = (y: number) => `M2 ${y} C74 ${y} 118 ${y + (200 - y) * 0.6} 198 200`;
  return (
    <div className="rec-conector" aria-hidden>
      <svg viewBox="0 0 200 400" preserveAspectRatio="none" focusable="false">
        {saida.map((y, i) => (
          <path
            key={i}
            className="rec-conector-base"
            d={caminho(y)}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <path
          key={pulso}
          className="rec-conector-ativo"
          d={caminho(saida[ativo])}
          vectorEffect="non-scaling-stroke"
        />
        <circle className="rec-conector-no" cx="198" cy="200" r="3.5" />
      </svg>
    </div>
  );
}

export default function RecognitionTheater() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(0);
  /* Contador de trocas: serve de `key` para reexecutar o wipe, o desenho do
     conector e a resposta do pedestal. */
  const [pulso, setPulso] = useState(0);
  /* Espelho em ref: o guarda de "mudou?" nao pode viver no updater de
     `setAtivo` — em modo estrito o React chama o updater duas vezes e o pulso
     contaria dobrado. */
  const ativoRef = useRef(0);

  /** Rola ate a faixa correspondente, quando a experiencia sticky esta ativa. */
  const rolarAte = useCallback((i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    /* Consulta em tempo de evento, nao de render: aqui ler a preferencia e a
       largura é seguro, e nao afeta a arvore. */
    const sticky = window.matchMedia('(min-width: 1200px)').matches && !prefersReducedMotion();
    if (!sticky) return;
    const percorrivel = el.offsetHeight - window.innerHeight;
    if (percorrivel <= 0) return;
    const topo = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: topo + ((i + 0.5) / TOTAL) * percorrivel,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }, []);

  /** Unico caminho de mudanca de estado, para todas as interacoes. */
  const selecionar = useCallback(
    (i: number, rolar = true) => {
      const alvo = Math.min(TOTAL - 1, Math.max(0, i));
      if (rolar) rolarAte(alvo);
      if (ativoRef.current === alvo) return;
      ativoRef.current = alvo;
      setAtivo(alvo);
      setPulso((p) => p + 1);
    },
    [rolarAte],
  );

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end'],
  });

  /* Rolagem -> indice inteiro. Quatro faixas de 25%; o `safeProgress` evita que
     o fim exato do percurso caia no indice 4. O `setState` só é chamado quando o
     indice muda, nao a cada pixel. */
  useEffect(() => {
    const avaliar = (p: number) => {
      const safeProgress = Math.min(p, 0.999999);
      const idx = Math.min(TOTAL - 1, Math.max(0, Math.floor(safeProgress * TOTAL)));
      if (idx === ativoRef.current) return;
      selecionar(idx, false);
    };
    avaliar(scrollYProgress.get());
    return scrollYProgress.on('change', avaliar);
  }, [scrollYProgress, selecionar]);

  const atual = RECONHECIMENTOS[ativo];
  const progresso = ((ativo + 1) / TOTAL) * 100;

  return (
    <div ref={scrollRef} className="rec-scroll">
      <div className="rec-sticky">
        <div aria-hidden className="rec-fundo" />
        <div aria-hidden className="rec-grade" />
        <div aria-hidden className="rec-diagonais" />
        <div aria-hidden className="rec-vinheta" />

        <div className="rec-wrap">
          {/* Cabecalho */}
          <header className="rec-header">
            <motion.p className="rec-eyebrow" {...entra(ATRASO.eyebrow, 10)}>
              <span>{REC_EYEBROW}</span>
            </motion.p>
            <motion.h2 id="premiacoes" className="rec-titulo" {...entra(ATRASO.titulo)}>
              {REC_TITULO.linha1}
              <br />
              {REC_TITULO.linha2}
            </motion.h2>
          </header>

          <div className="rec-layout">
            {/* Navegacao editorial */}
            <motion.div className="rec-nav" {...entra(ATRASO.nav, 0, -16)}>
              <p className="rec-nav-titulo">{REC_NAV_TITULO}</p>
              <ul className="rec-nav-lista">
                {RECONHECIMENTOS.map((r, i) => (
                  <li key={r.index}>
                    <button
                      type="button"
                      className={`rec-nav-item ${
                        i === ativo ? 'is-ativo' : i < ativo ? 'is-feito' : 'is-futuro'
                      }`}
                      aria-current={i === ativo ? 'step' : undefined}
                      onClick={() => selecionar(i)}
                    >
                      <span className="rec-nav-indice">{r.index}</span>
                      <span className="rec-nav-nome">{r.title}</span>
                      <span aria-hidden className="rec-nav-seta">
                        <ArrowRight strokeWidth={1.6} />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              {/* Progresso da navegacao */}
              <div className="rec-progresso">
                <span className="rec-progresso-num">{atual.index}</span>
                <span className="rec-progresso-total">
                  / {String(TOTAL).padStart(2, '0')}
                </span>
                <span aria-hidden className="rec-progresso-trilha">
                  <span className="rec-progresso-fill" style={{ width: `${progresso}%` }} />
                </span>
              </div>
            </motion.div>

            {/* Palco */}
            <div className="rec-theater-wrap">
              <motion.div aria-hidden className="rec-frame rec-frame-1" {...entra(ATRASO.molduras, 0)} />
              <motion.div aria-hidden className="rec-frame rec-frame-2" {...entra(ATRASO.molduras + 0.08, 0)} />

              {/* O conector mora AQUI, no wrapper, e nao dentro do palco: ele
                  atravessa o vao entre as colunas e so encosta na borda
                  esquerda do card. Dentro do palco ele cruzaria o conteudo. */}
              <RecognitionConnector ativo={ativo} pulso={pulso} />

              <motion.div className="rec-theater" {...entra(ATRASO.palco, 24)}>
                <span key={pulso} aria-hidden className="rec-wipe" />

                {/* Os quatro paineis ficam no DOM; o CSS acende um. */}
                <div className="rec-palco">
                  {RECONHECIMENTOS.map((r, i) => (
                    <article
                      key={r.index}
                      className={`rec-cena ${i === ativo ? 'is-ativo' : ''}`}
                      style={{ ['--rec-h' as string]: `${r.alturaPalco}px` }}
                    >
                      {/* Area 1: spotlight, aneis, arte e plataforma. */}
                      <div className={`rec-peca rec-placa-${r.placa}`}>
                        <span aria-hidden className="rec-spot" />
                        <span aria-hidden className="rec-anel rec-anel-1" />
                        <span aria-hidden className="rec-anel rec-anel-2" />
                        <span aria-hidden className="rec-anel rec-anel-3" />
                        <div className="rec-arte">
                          <Image
                            src={r.image}
                            alt={r.alt}
                            width={r.largura}
                            height={r.altura}
                            /* Só a primeira peca é prioritaria; as outras tres
                               ficam `lazy` (o padrao quando `priority` é falso) e
                               nao disputam o carregamento inicial. Passar
                               `loading` junto com `priority` anula a prioridade —
                               o `loading` vence —, entao aqui vai so `priority`. */
                            priority={i === 0}
                            sizes="(max-width: 767px) 70vw, (max-width: 1199px) 32vw, 380px"
                          />
                        </div>
                        {/* Plataforma: tampo, base intermediaria e halo sao as
                            tres camadas — as duas de baixo vem de `::before` e
                            `::after`, para nao inflar o DOM. */}
                        <span aria-hidden className="rec-pedestal" />
                      </div>

                      {/* Area 2: numero, titulo e estado. */}
                      <div className="rec-dados">
                        <span className="rec-contagem">{r.count}</span>
                        <h3 className="rec-nome">{r.title}</h3>
                        <p className="rec-selo">{REC_SELO_ATIVO}</p>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Area 3: miniaturas. Os quatro botoes ficam no DOM na ordem
                    01–04 para o leitor de tela; o CSS esconde o da peca acesa.
                    A rail é uma so, compartilhada pelas quatro cenas, entao ela
                    fica posicionada na terceira faixa em vez de ser coluna de
                    grade dentro de cada cena — as cenas se sobrepoem. A cena
                    reserva a faixa por `padding-right`, e o resultado de layout
                    é o mesmo. */}
                <ul className="rec-rail">
                  {RECONHECIMENTOS.map((r, i) => (
                    <li key={r.index} className={i === ativo ? 'is-ativo' : ''}>
                      <button
                        type="button"
                        className={`rec-mini rec-placa-${r.placa}`}
                        title={`${r.index} — ${r.title}`}
                        style={{ ['--rec-hm' as string]: `${r.alturaMini}px` }}
                        onClick={() => selecionar(i)}
                      >
                        <Image
                          src={r.image}
                          alt=""
                          width={r.largura}
                          height={r.altura}
                          loading="lazy"
                          sizes="120px"
                        />
                        <span className="sr-only">{`${r.count} ${r.title}`}</span>
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Base: seta anterior, linha do tempo, seta proxima */}
                <motion.div className="rec-base" {...entra(ATRASO.base, 12)}>
                  <button
                    type="button"
                    className="rec-ctrl"
                    aria-label="Reconhecimento anterior"
                    disabled={ativo === 0}
                    onClick={() => selecionar(ativo - 1)}
                  >
                    <ArrowLeft strokeWidth={1.8} aria-hidden />
                  </button>

                  <ol className="rec-timeline">
                    {RECONHECIMENTOS.map((r, i) => (
                      <li
                        key={r.index}
                        className={
                          i === ativo ? 'is-ativo' : i < ativo ? 'is-feito' : 'is-futuro'
                        }
                      >
                        <button
                          type="button"
                          className="rec-node"
                          aria-current={i === ativo ? 'step' : undefined}
                          onClick={() => selecionar(i)}
                        >
                          <span aria-hidden className="rec-node-ponto" />
                          <span className="rec-node-indice">{r.index}</span>
                          <span className="sr-only">{r.title}</span>
                        </button>
                      </li>
                    ))}
                  </ol>

                  <button
                    type="button"
                    className="rec-ctrl"
                    aria-label="Próximo reconhecimento"
                    disabled={ativo === TOTAL - 1}
                    onClick={() => selecionar(ativo + 1)}
                  >
                    <ArrowRight strokeWidth={1.8} aria-hidden />
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
