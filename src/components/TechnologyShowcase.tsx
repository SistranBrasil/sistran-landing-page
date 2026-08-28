'use client';

/**
 * Vitrine de tecnologias — três planos em profundidade, uma tecnologia em foco.
 *
 * ── Divisão de trabalho entre CSS e React ───────────────────────────────────
 * Os dois trilhos contínuos são 100% CSS (`@keyframes` em `transform`): movimento
 * sem evento nenhum, sem render, sem timer. O React cuida apenas de QUAL
 * tecnologia está ativa no carrossel central — e mesmo aí ele não escreve
 * `transform`: publica `data-pos` (a posição de cada card em relação ao ativo) e
 * o CSS tem uma regra por posição. A `transition` faz a interpolação. Resultado:
 * uma re-renderização a cada ~4s, nenhuma por quadro.
 *
 * A biblioteca de animação instalada (`motion`) entra só na ENTRADA da seção,
 * que precisa de sequência com atrasos diferentes por camada.
 *
 * ── Um timer só ─────────────────────────────────────────────────────────────
 * `useEffect` com `[ativo, pausado]`: cada troca agenda o próximo passo e limpa o
 * anterior. Não existe intervalo rodando em paralelo. O único outro temporizador é
 * o que devolve o autoplay ~5s depois de uma interação manual, e ele vive num ref
 * que é limpo antes de cada novo agendamento e no desmonte.
 */

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { easeExpo, useReducedMotion } from '@/lib/motion';
import {
  TECNOLOGIAS_PALCO,
  TECNOLOGIAS_TRILHO_INFERIOR,
  TECNOLOGIAS_TRILHO_SUPERIOR,
  TECNOLOGIA_INICIAL,
  type Tecnologia,
} from '@/data/tecnologias';
import './technology-showcase.css';

/** Intervalo do autoplay. Dentro da faixa 3,6–4,2s pedida. */
const AUTOPLAY_MS = 3600;
/** Espera antes de devolver o autoplay depois de uma ação do usuário. */
const RETOMADA_MS = 5000;
/** Distância mínima de arrasto para valer como troca. */
const LIMIAR_ARRASTO = 50;

const TOTAL = TECNOLOGIAS_PALCO.length;
/** Com sete tecnologias e alcance ±3, o anel cobre todas: ninguém fica "fora". */
const ALCANCE = Math.floor(TOTAL / 2);

/**
 * Posição de um card em relação ao ativo, no anel.
 *
 * Circular de propósito: passar do último para o primeiro é um passo, e não um
 * salto de seis posições — é o que dá a sensação de fluxo contínuo.
 */
function posicao(indice: number, ativo: number): number | 'fora' {
  const d = ((indice - ativo + ALCANCE + TOTAL * 2) % TOTAL) - ALCANCE;
  return Math.abs(d) <= 3 ? d : 'fora';
}

/** A logo, sempre sobre a placa clara — nunca com fundo ou filtro próprio. */
function Logo({ tec, prioridade }: { tec: Tecnologia; prioridade: boolean }) {
  return (
    <span className="tech-card__placa">
      <Image
        className="tech-logo"
        src={tec.image}
        alt={tec.alt}
        width={480}
        height={280}
        sizes="(max-width: 767px) 78vw, (max-width: 1279px) 240px, 380px"
        priority={prioridade}
        style={tec.larguraMax ? ({ '--tech-logo-max': tec.larguraMax } as React.CSSProperties) : undefined}
      />
    </span>
  );
}

/**
 * Trilho contínuo.
 *
 * Dois grupos idênticos. O primeiro é o conteúdo de verdade; o segundo existe só
 * para a emenda e leva `aria-hidden` — sem isso o leitor de tela anunciaria cada
 * tecnologia duas vezes.
 */
function Trilho({
  itens,
  variante,
  repeticoes,
}: {
  itens: Tecnologia[];
  variante: 'superior' | 'inferior';
  /**
   * Quantas vezes o conjunto se repete DENTRO de cada grupo.
   *
   * Duas cópias do conjunto só bastam se um conjunto for mais largo que a tela.
   * O trilho de cima tem quatro tecnologias (~900px): as duas cópias couberam
   * juntas no quadro, e o resultado era ver "React" duas vezes ao mesmo tempo,
   * com a emenda no meio da tela. Repetindo o conjunto até o grupo passar de
   * 1920px a emenda volta para fora do campo de visão.
   */
  repeticoes: number;
}) {
  const conjunto = Array.from({ length: repeticoes }, () => itens).flat();

  /*
    Só a PRIMEIRA passagem do conjunto é conteúdo acessível. Todo o resto — as
    repetições que preenchem o grupo e o grupo clonado inteiro — existe apenas
    para o loop, e leva `aria-hidden`: sem isso o leitor de tela anunciaria cada
    tecnologia seis vezes.
  */
  const grupo = (clone: boolean) => (
    <ul className="tech-trilho__grupo">
      {conjunto.map((tec, i) => (
        <li
          key={`${clone ? 'c' : 'a'}-${i}-${tec.id}`}
          className="tech-card"
          style={{ '--i': i % itens.length } as React.CSSProperties}
          aria-hidden={clone || i >= itens.length || undefined}
        >
          <Logo tec={tec} prioridade={false} />
        </li>
      ))}
    </ul>
  );

  return (
    <div className={`tech-trilho tech-trilho--${variante}`}>
      <div className="tech-trilho__fita">
        {grupo(false)}
        {grupo(true)}
      </div>
    </div>
  );
}

export default function TechnologyShowcase() {
  const tituloId = useId();
  const secaoRef = useRef<HTMLElement | null>(null);
  const carrosselRef = useRef<HTMLUListElement | null>(null);

  const [ativo, setAtivo] = useState(TECNOLOGIA_INICIAL);
  const [visivel, setVisivel] = useState(false);
  const [entrou, setEntrou] = useState(false);
  const [sobre, setSobre] = useState(false);
  const [comFoco, setComFoco] = useState(false);
  const [arrastando, setArrastando] = useState(false);
  const [abaOculta, setAbaOculta] = useState(false);
  const [esperandoRetomada, setEsperandoRetomada] = useState(false);
  const [compacto, setCompacto] = useState(false);

  const semMovimento = useReducedMotion();
  /** Modo lista: nada se move, tudo aparece de uma vez. */
  const estatico = semMovimento;

  const retomadaRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const arrastoRef = useRef<{ x: number; ativo: boolean }>({ x: 0, ativo: false });

  /* ── Visibilidade da seção ──────────────────────────────────────────────── */
  useEffect(() => {
    const alvo = secaoRef.current;
    if (!alvo) return;

    const obs = new IntersectionObserver(
      ([entrada]) => {
        setVisivel(entrada.isIntersecting);
        if (entrada.isIntersecting && entrada.intersectionRatio >= 0.25) {
          setEntrou(true);
        }
      },
      { threshold: [0, 0.25] },
    );
    obs.observe(alvo);
    return () => obs.disconnect();
  }, []);

  /* ── Aba em segundo plano ───────────────────────────────────────────────── */
  useEffect(() => {
    const ler = () => setAbaOculta(document.hidden);
    ler();
    document.addEventListener('visibilitychange', ler);
    return () => document.removeEventListener('visibilitychange', ler);
  }, []);

  /* ── Largura: abaixo de 768px quem navega é o gesto nativo ──────────────── */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const ler = () => setCompacto(mq.matches);
    ler();
    mq.addEventListener('change', ler);
    return () => mq.removeEventListener('change', ler);
  }, []);

  /**
   * Modo faixa (abaixo de 768px): centraliza o card ativo.
   *
   * Isso é o que faz o estado inicial (PEGA) abrir centralizado no celular, e o
   * que mantém as setas funcionando lá — elas trocam o ativo, e a faixa
   * acompanha. `scrollLeft` em vez de `scrollIntoView` de propósito:
   * `scrollIntoView` arrastaria a PÁGINA na vertical.
   */
  useEffect(() => {
    if (!compacto) return;
    const faixa = carrosselRef.current;
    const card = faixa?.children[ativo] as HTMLElement | undefined;
    if (!faixa || !card) return;
    faixa.scrollTo({
      left: card.offsetLeft - (faixa.clientWidth - card.offsetWidth) / 2,
      behavior: estatico ? 'auto' : 'smooth',
    });
  }, [ativo, compacto, estatico]);

  /* ── Autoplay: um único timeout, reagendado a cada troca ────────────────── */
  const pausado =
    estatico ||
    compacto ||
    !visivel ||
    abaOculta ||
    sobre ||
    comFoco ||
    arrastando ||
    esperandoRetomada;

  useEffect(() => {
    if (pausado) return;
    const t = setTimeout(() => setAtivo((i) => (i + 1) % TOTAL), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [ativo, pausado]);

  /** Toda ação manual passa por aqui: troca, segura o autoplay, devolve depois. */
  const irPara = useCallback((proximo: number) => {
    setAtivo(((proximo % TOTAL) + TOTAL) % TOTAL);
    setEsperandoRetomada(true);
    if (retomadaRef.current) clearTimeout(retomadaRef.current);
    retomadaRef.current = setTimeout(() => setEsperandoRetomada(false), RETOMADA_MS);
  }, []);

  useEffect(
    () => () => {
      if (retomadaRef.current) clearTimeout(retomadaRef.current);
    },
    [],
  );

  const anterior = useCallback(() => irPara(ativo - 1), [ativo, irPara]);
  const proxima = useCallback(() => irPara(ativo + 1), [ativo, irPara]);

  /* ── Teclado (só quando o carrossel tem o foco) ─────────────────────────── */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      anterior();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      proxima();
    }
  };

  /* ── Arrasto de mouse e swipe ───────────────────────────────────────────── */
  const onPointerDown = (e: React.PointerEvent) => {
    if (compacto || estatico) return;
    arrastoRef.current = { x: e.clientX, ativo: true };
    setArrastando(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const arrasto = arrastoRef.current;
    if (!arrasto.ativo) return;
    const dx = e.clientX - arrasto.x;
    if (Math.abs(dx) < LIMIAR_ARRASTO) return;
    arrasto.ativo = false;
    setArrastando(false);
    if (dx < 0) proxima();
    else anterior();
  };
  const encerrarArrasto = () => {
    if (!arrastoRef.current.ativo) return;
    arrastoRef.current.ativo = false;
    setArrastando(false);
  };

  /* ── Entrada, uma vez só ────────────────────────────────────────────────── */
  const entrada = (atraso: number, deslocamento = 18) =>
    estatico
      ? { initial: undefined, animate: undefined }
      : {
          initial: { opacity: 0, y: deslocamento },
          animate: entrou ? { opacity: 1, y: 0 } : { opacity: 0, y: deslocamento },
          transition: { duration: 0.52, delay: atraso, ease: easeExpo },
        };

  const restantes = [...TECNOLOGIAS_TRILHO_SUPERIOR, ...TECNOLOGIAS_TRILHO_INFERIOR];

  /*
    `on-dark` no elemento raiz: `.section-light h2` (globals.css) pinta todo
    titulo de navy, porque a pagina toda ali é fundo claro — e o titulo desta
    seção ficava navy sobre navy, invisivel. `on-dark` é a saida que o projeto ja
    usa nos cards escuros de PartnersGrid/EventsGrid para devolver o branco.
  */
  return (
    <section
      ref={secaoRef}
      className="tech-showcase on-dark"
      aria-labelledby={tituloId}
      data-visivel={visivel && !estatico ? '1' : '0'}
      data-entrou={entrou ? '1' : '0'}
      data-estatico={estatico ? '1' : '0'}
    >
      {/* Fundo: só camadas decorativas, nenhuma delas com conteúdo. */}
      <div className="tech-bg" aria-hidden>
        <div className="tech-bg__grade" />
        <div className="tech-bg__linha tech-bg__linha--1" />
        <div className="tech-bg__linha tech-bg__linha--2" />
        <div className="tech-bg__linha tech-bg__linha--3" />
        <span className="tech-bg__node" style={{ left: '18%', top: '26%' }} />
        <span className="tech-bg__node" style={{ left: '74%', top: '26%' }} />
        <span className="tech-bg__node" style={{ left: '31%', top: '62%' }} />
        <span className="tech-bg__node" style={{ left: '86%', top: '62%' }} />
        <span className="tech-bg__node" style={{ left: '12%', top: '84%' }} />
        <span className="tech-bg__node" style={{ left: '62%', top: '84%' }} />
        <div className="tech-bg__glow" />
        <div className="tech-bg__vinheta" />
      </div>

      <div className="tech-container">
        <motion.h2 id={tituloId} className="tech-titulo" {...entrada(0.28, 12)}>
          Tecnologias
        </motion.h2>

        <motion.div className="tech-palco" {...entrada(0.52, 24)}>
          {/* 4 x 3 = 12 cards (~2700px) e 6 x 2 = 12 (~2700px): em qualquer um
              dos dois a emenda cai fora da tela. */}
          <Trilho itens={TECNOLOGIAS_TRILHO_SUPERIOR} variante="superior" repeticoes={3} />

          <ul
            ref={carrosselRef}
            className="tech-carrossel"
            aria-label="Tecnologias em destaque"
            tabIndex={0}
            onKeyDown={onKeyDown}
            onMouseEnter={() => setSobre(true)}
            onMouseLeave={() => {
              setSobre(false);
              encerrarArrasto();
            }}
            onFocus={() => setComFoco(true)}
            onBlur={() => setComFoco(false)}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={encerrarArrasto}
            onPointerCancel={encerrarArrasto}
          >
            {TECNOLOGIAS_PALCO.map((tec, i) => {
              const pos = posicao(i, ativo);
              const eAtivo = pos === 0;
              return (
                <li
                  key={tec.id}
                  className="tech-card"
                  data-pos={pos}
                  style={{ '--i': i } as React.CSSProperties}
                  aria-current={eAtivo ? 'true' : undefined}
                >
                  {/* Reinicia a passagem de luz a cada troca: a `key` muda com o ativo. */}
                  {eAtivo && !estatico ? (
                    <span key={ativo} className="tech-card__ponto" aria-hidden />
                  ) : null}
                  <Logo tec={tec} prioridade={pos !== 'fora' && Math.abs(pos) <= 1} />
                </li>
              );
            })}
          </ul>

          <Trilho itens={TECNOLOGIAS_TRILHO_INFERIOR} variante="inferior" repeticoes={2} />
        </motion.div>

        {/*
          Abaixo de 768px e em movimento reduzido os trilhos saem de cena, e é esta
          lista que garante que as dezessete continuem alcançáveis. Acima disso o
          CSS a esconde — as mesmas logos já estão nos trilhos, e mostrá-las duas
          vezes seria duplicar conteúdo.
        */}
        <ul className="tech-restantes">
          {restantes.map((tec) => (
            <li key={tec.id} className="tech-card">
              <Logo tec={tec} prioridade={false} />
            </li>
          ))}
        </ul>

        <motion.div className="tech-controles" {...entrada(0.84, 10)}>
          <button
            type="button"
            className="tech-botao"
            aria-label="Tecnologia anterior"
            onClick={anterior}
          >
            <ChevronLeft size={20} strokeWidth={1.5} aria-hidden />
          </button>

          <div className="tech-progresso" aria-hidden>
            {TECNOLOGIAS_PALCO.map((tec, i) => (
              <span
                key={tec.id}
                className="tech-progresso__seg"
                data-estado={i === ativo ? 'ativo' : 'inativo'}
              />
            ))}
          </div>

          <button
            type="button"
            className="tech-botao"
            aria-label="Próxima tecnologia"
            onClick={proxima}
          >
            <ChevronRight size={20} strokeWidth={1.5} aria-hidden />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
