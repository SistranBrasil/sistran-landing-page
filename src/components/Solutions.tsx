'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SOLUTIONS } from '@/data/solutions';
import { getIcon } from '@/lib/icons';
import { vHeader, vTitle, vSubtitle, VP, useReducedMotion } from '@/lib/motion';

/**
 * Card branco com profundidade 3D. Segue a receita de tilt do MetricCard
 * (.claude/skills/sistran-labs-pattern/reference/dynamic-components.md):
 * perspective + rotateX/rotateY pelo cursor, orb de luz seguindo o mouse e
 * sombra em camadas para dar volume real.
 */
function useTilt(enabled: boolean) {
  const [hover, setHover] = useState(false);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  const handlers = enabled
    ? {
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => {
          setHover(false);
          setMouse({ x: 0.5, y: 0.5 });
        },
        onMouseMove: (e: React.MouseEvent) => {
          const r = e.currentTarget.getBoundingClientRect();
          setMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
        },
      }
    : {};

  return { hover, mouse, handlers };
}

function SolutionPanel({
  s,
  index,
  rm,
  isActive = true,
}: {
  s: (typeof SOLUTIONS)[number];
  index: number;
  rm: boolean;
  isActive?: boolean;
}) {
  const Icon = getIcon(s.icon);
  // Tilt só no card da frente: nos cards do fundo o cursor nem chega neles.
  const { hover, mouse, handlers } = useTilt(!rm && isActive);
  // Accent escurecido: o card e branco, tons claros perderiam contraste.
  const accent = s.colorOnLight;
  const num = String(index + 1).padStart(2, '0');

  return (
    /* Duas camadas: a externa faz a animacao de entrada (motion controla
       transform), a interna faz o tilt. Num unico elemento o style.transform do
       tilt sobrescreveria o `y` do motion. */
    <motion.div
      /* Sem animação de entrada própria: o baralho (transform/opacity no
         wrapper) já faz a transição entre cards. */
      initial={false}
      className="w-full"
    >
    <article
      {...handlers}
      className="relative w-full overflow-hidden rounded-3xl bg-white p-10"
      style={{
        transform:
          hover && !rm
            ? `translateY(-8px) perspective(900px) rotateX(${(mouse.y - 0.5) * -6}deg) rotateY(${
                (mouse.x - 0.5) * 8
              }deg)`
            : 'translateY(0) perspective(900px)',
        transition: hover
          ? 'box-shadow .25s ease'
          : 'transform .5s cubic-bezier(.22,1,.36,1), box-shadow .5s ease',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        // Sombra em camadas: contato curto + difusa longa + halo do accent.
        // E um brilho interno no topo que sugere a face iluminada do card.
        boxShadow: hover
          ? `0 2px 4px rgba(4,32,64,0.10), 0 18px 32px -12px rgba(4,32,64,0.28), 0 46px 80px -30px rgba(4,32,64,0.38), 0 0 60px -18px ${accent}66, inset 0 1px 0 rgba(255,255,255,0.9)`
          : `0 1px 2px rgba(4,32,64,0.08), 0 10px 20px -10px rgba(4,32,64,0.20), 0 30px 60px -26px rgba(4,32,64,0.30), inset 0 1px 0 rgba(255,255,255,0.9)`,
      }}
    >
      {/* Orb de luz seguindo o cursor (receita MetricCard). O nó existe sempre;
          com movimento reduzido ele só nunca acende. */}
      <div
        aria-hidden
        className="pointer-events-none absolute h-[180px] w-[180px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)`,
          top: `calc(${mouse.y * 100}% - 90px)`,
          left: `calc(${mouse.x * 100}% - 90px)`,
          opacity: hover && !rm ? 1 : 0,
          transition: 'opacity .3s ease',
        }}
      />

      {/* Linha de acento no topo */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          opacity: hover ? 1 : 0.5,
          transition: 'opacity .35s ease',
        }}
      />

      {/* Numero fantasma */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-6 top-4 select-none font-display font-black leading-none"
        style={{
          color: `${accent}1a`,
          fontSize: 'clamp(5rem, 8vw, 7.5rem)',
        }}
      >
        {num}
      </span>

      <div
        className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${accent}1f, ${accent}0a)`,
          border: `1px solid ${accent}40`,
          boxShadow: `0 10px 24px -12px ${accent}80`,
          transform: 'translateZ(30px)',
        }}
      >
        <Icon className="h-8 w-8" style={{ color: accent }} strokeWidth={1.6} />
      </div>
      <h3
        className="relative max-w-2xl font-display text-2xl font-bold leading-tight text-[#062B52] md:text-3xl"
        style={{ transform: 'translateZ(20px)' }}
      >
        {s.title}
      </h3>
      <p
        className="relative mt-4 max-w-2xl text-base leading-relaxed text-[#3C5A7A] md:text-lg"
        style={{ transform: 'translateZ(12px)' }}
      >
        {s.description}
      </p>
    </article>
    </motion.div>
  );
}

export default function Solutions() {
  const rm = useReducedMotion();
  const [active, setActive] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [openMobile, setOpenMobile] = useState<number | null>(0);
  const listRef = useRef<HTMLOListElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    gsap.registerPlugin(ScrollTrigger);
    const track = trackRef.current;
    if (!track) return;
    /* UM trigger sobre a trilha inteira, com o indice derivado do progresso.
       Antes havia um trigger por espacador com start/end diferentes (70%/30%):
       na subida os intervalos nao eram simetricos e o onEnterBack de um card
       disparava antes do outro sair, fazendo o ativo pular (4 -> 2). Faixas
       iguais calculadas do progresso sao reversiveis por construcao. */
    const N = SOLUTIONS.length;
    const trigger = ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const idx = Math.min(N - 1, Math.max(0, Math.floor(self.progress * N)));
        setActive((prev) => (prev === idx ? prev : idx));
      },
    });
    const triggers = [trigger];
    /* As fontes carregam com `display: swap`: o texto reflui depois dos
       triggers serem medidos, deixando os `start`/`end` em posicoes velhas —
       o card ativo entao para de trocar. Refresh apos o layout estabilizar. */
    ScrollTrigger.refresh();
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);
    document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {});

    return () => {
      window.removeEventListener('resize', onResize);
      triggers.forEach((t) => t.kill());
    };
  }, [isDesktop]);

  const onKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setActive((v) => Math.min(SOLUTIONS.length - 1, v + 1));
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setActive((v) => Math.max(0, v - 1));
      }
    },
    [],
  );

  return (
    /* lg:pb-0: o padding inferior de .section-py somaria ao final do pin e
       criaria um vazio depois do ultimo card. */
    /* overflow-clip, NAO overflow-hidden: hidden faria da secao o scrollport
       mais proximo e o `sticky` do pin pararia de funcionar. clip apara os
       orbs sem criar container de scroll. */
    <section id="servicos" className="section-py relative overflow-clip lg:pb-0">
      {/* Atmosfera: mesma receita do hero (orbs em drift + grade mascarada +
          linhas tracejadas em marcha), em intensidade menor para nao competir
          com os cards brancos. Fica atras de tudo e nao capta ponteiro. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 28% 30%, rgba(4,32,66,0.38), transparent 64%)',
          }}
        />
        <div className="absolute inset-0 grid-mask opacity-40" />
        <div
          className="orb orb-drift left-[-6%] top-[8%] h-[460px] w-[460px]"
          style={{
            background:
              'radial-gradient(circle, rgba(14,216,246,0.34), rgba(14,216,246,0.06) 55%, transparent 72%)',
          }}
        />
        <div
          className="orb orb-drift-slow right-[-8%] top-[42%] h-[540px] w-[540px]"
          style={{
            background:
              'radial-gradient(circle, rgba(87,183,238,0.30), transparent 70%)',
          }}
        />
        <div
          className="orb orb-drift bottom-[-4%] left-[38%] hidden h-[380px] w-[380px] lg:block"
          style={{
            background: 'radial-gradient(circle, rgba(0,180,255,0.26), transparent 68%)',
          }}
        />
        <svg
          viewBox="0 0 1440 1200"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          style={{ mixBlendMode: 'screen' }}
        >
          <defs>
            <linearGradient id="sol-lg1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0ed8f6" stopOpacity="0" />
              <stop offset="35%" stopColor="#57B7EE" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#78C9F8" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M -100 980 Q 320 420 760 620 T 1540 260"
            fill="none"
            stroke="url(#sol-lg1)"
            strokeWidth="1.3"
            strokeDasharray="6 6"
            opacity="0.4"
            style={{ animation: 'dash-march 3s linear infinite' }}
          />
          <path
            d="M -80 260 Q 420 820 860 600 T 1520 1020"
            fill="none"
            stroke="url(#sol-lg1)"
            strokeWidth="1.1"
            strokeDasharray="6 6"
            opacity="0.28"
            style={{ animation: 'dash-march-rev 4.6s linear infinite' }}
          />
          <line x1="0" y1="700" x2="1440" y2="360" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        </svg>
      </div>
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 brand-line opacity-50" />
      {/* Em lg+ assume a mesma caixa da navbar (min(1240px,100%-32px) + px-5),
          como o hero: em telas grandes o conteúdo deixa de parecer estreito e
          fica na vertical do logo. */}
      <div className="container-lp lg:w-[min(1240px,calc(100%-32px))] lg:max-w-none lg:px-5">
        {/* Pin da seção inteira: em lg+ o bloco (titulo + descricao + lista +
            card) congela na viewport e o scroll passa a trocar os cards. A
            altura do pin vem da trilha de espacadores irma, logo abaixo. */}
        <div className="lg:relative">
        <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center">
        <motion.div
          variants={vHeader}
          initial={rm ? false : 'hidden'}
          whileInView="visible"
          viewport={VP}
          className="mb-10 max-w-3xl lg:mb-8"
        >
          {/* .tag-section (chip com moldura) em vez de .eyebrow: mesma marcação
              das outras seções e legível sobre o fundo azul. */}
          <motion.span variants={vSubtitle} className="tag-section">Serviços</motion.span>
          <motion.h2 variants={vTitle} className="mt-5 font-display text-section font-bold text-ink">
            Integradora de sistemas <span className="text-gradient-brand">100% focada em Seguros</span>
          </motion.h2>
          <motion.p variants={vSubtitle} className="mt-4 text-lg leading-relaxed text-ink-muted">
            Dedicada ao mercado segurador, com experiência em todos os ramos. A Sistran atua como
            integradora de sistemas para clientes com grandes carteiras. Somos uma empresa de TI
            100% focada no segmento de Seguros no Brasil, com mais de 30 implementações de ERP
            bem-sucedidas.
          </motion.p>
        </motion.div>

        {/* Desktop: sticky list + panel */}
        <div className="hidden lg:grid lg:grid-cols-[minmax(280px,340px)_1fr] lg:gap-12 xl:grid-cols-[minmax(320px,400px)_1fr] xl:gap-20">
          <div className="relative">
            {/* Sem sticky proprio: quem congela agora e a secao inteira (pin).
                pt acompanha o mesmo recuo da coluna do baralho. */}
            <div className="flex flex-col pt-24">
              <ol
                ref={listRef}
                role="tablist"
                aria-orientation="vertical"
                onKeyDown={onKey}
                className="flex flex-col gap-2"
              >
                {SOLUTIONS.map((s, i) => {
                  const num = String(i + 1).padStart(2, '0');
                  const isActive = i === active;
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => {
                          setActive(i);
                          itemRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                        className={`group relative flex w-full cursor-pointer items-baseline gap-4 rounded-xl py-3 pl-5 pr-3 text-left transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0ed8f6] ${
                          isActive
                            ? 'translate-x-1 text-white'
                            : 'text-white/55 hover:translate-x-1 hover:bg-white/[0.06] hover:text-white/85'
                        }`}
                        style={{
                          // Ativo ganha placa de vidro + halo na cor do item:
                          // muito mais legível que a variação sutil de opacidade.
                          background: isActive
                            ? `linear-gradient(90deg, ${s.color}2e, ${s.color}08 60%, transparent)`
                            : undefined,
                          boxShadow: isActive ? `inset 0 0 0 1px ${s.color}33` : undefined,
                        }}
                      >
                        <span
                          aria-hidden
                          className="absolute left-0 top-1/2 w-[3px] -translate-y-1/2 rounded-full transition-all duration-500"
                          style={{
                            background: isActive ? s.color : 'rgba(255,255,255,0.22)',
                            boxShadow: isActive ? `0 0 16px 2px ${s.color}` : 'none',
                            height: isActive ? '100%' : '1rem',
                            width: isActive ? '4px' : '3px',
                          }}
                        />
                        <span
                          className="font-display text-sm font-bold tabular-nums transition-colors duration-500"
                          style={{ color: isActive ? s.color : 'rgba(255,255,255,0.5)' }}
                        >
                          {num}
                        </span>
                        <span
                          className={`flex-1 font-display font-bold leading-tight transition-all duration-500 ${
                            isActive ? 'text-xl' : 'text-lg'
                          }`}
                        >
                          {s.title}
                        </span>
                        {/* Seta: fixa no item ativo (marca onde o scroll está),
                            e surge no hover nos demais como pista de clique. */}
                        <span
                          aria-hidden
                          className={`self-center text-base transition-all duration-300 ${
                            isActive
                              ? 'translate-x-0 opacity-100'
                              : 'translate-x-[-6px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                          }`}
                          style={{ color: s.color }}
                        >
                          →
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
              {/* Barra de progresso */}
              <div className="mt-8 h-[3px] w-full overflow-hidden rounded-full bg-[#0079CB]/10">
                <div
                  aria-hidden
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${((active + 1) / SOLUTIONS.length) * 100}%`,
                    background: 'linear-gradient(90deg, #0079CB, #0ed8f6, #7DD3FC)',
                  }}
                />
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                {String(active + 1).padStart(2, '0')} / {String(SOLUTIONS.length).padStart(2, '0')}
              </p>
            </div>
          </div>

          {/* pt-24 (96px): reserva espaco para as camadas recuadas do baralho.
              Com 3 camadas a 34px o topo sobe ~102px, mas a escala menor
              (0.055/camada) encolhe o card e devolve a folga — 96px cobre.
              Nao reduzir mais: abaixo disto as camadas de tras sao cortadas. */}
          <div className="relative flex items-start pt-24">
                {/* Baralho: todos os cards coexistem. O ativo fica na frente; os
                    que já passaram recuam para tras (escala menor + deslocamento
                    para cima), deixando as bordas/sombras visiveis. Os futuros
                    aguardam embaixo, fora de vista. */}
                <div className="relative w-full" style={{ perspective: '1400px' }}>
                  {SOLUTIONS.map((s, i) => {
                  const offset = i - active;
                  const passed = offset < 0;
                  // Só as 3 camadas imediatamente atras continuam renderizadas.
                  const depth = Math.min(-offset, 3);
                  return (
                    <div
                      key={s.id}
                      className={i === active ? 'relative' : 'absolute inset-x-0 top-0'}
                      style={{
                        zIndex: SOLUTIONS.length - Math.abs(offset),
                        transform: passed
                          ? `translateY(${-depth * 34}px) scale(${1 - depth * 0.055})`
                          : offset > 0
                            ? 'translateY(40px) scale(0.96)'
                            : 'none',
                        opacity: offset === 0 ? 1 : passed ? Math.max(0, 0.78 - depth * 0.16) : 0,
                        filter: passed ? `blur(${depth * 0.4}px)` : 'none',
                        pointerEvents: offset === 0 ? 'auto' : 'none',
                        transition: rm
                          ? 'none'
                          : 'transform .7s cubic-bezier(.22,1,.36,1), opacity .6s ease, filter .6s ease',
                        willChange: 'transform, opacity',
                      }}
                    >
                      <SolutionPanel s={s} index={i} rm={rm} isActive={i === active} />
                    </div>
                  );
                })}
                </div>
          </div>
        </div>
        </div>

        {/* Trilha de scroll do pin: fica FORA do bloco fixado e e ela que da
            altura a secao. Cada espacador tambem e o trigger que troca o card.
            O -mt-[100vh] devolve a tela consumida pelo `h-screen` do sticky,
            senao a secao ganharia uma viewport extra de vazio no fim. */}
        <div ref={trackRef} aria-hidden className="hidden lg:-mt-[100vh] lg:block">
          {SOLUTIONS.map((s, i) => (
            <div
              key={s.id}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              data-idx={i}
              /* Alturas IGUAIS: o indice ativo vem de floor(progress * N), logo
                 cada card precisa ocupar a mesma fatia da trilha — senao a
                 troca acontece fora do espacador correspondente. */
              className="min-h-[75vh]"
            />
          ))}
        </div>
        </div>


        {/* Mobile: acordeão */}
        <ol className="flex flex-col gap-3 lg:hidden">
          {SOLUTIONS.map((s, i) => {
            const Icon = getIcon(s.icon);
            const num = String(i + 1).padStart(2, '0');
            const isOpen = openMobile === i;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`solution-panel-${s.id}`}
                  onClick={() => setOpenMobile(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 rounded-2xl bg-white p-5 text-left transition-shadow"
                  style={{
                    boxShadow: isOpen
                      ? `0 2px 4px rgba(4,32,64,0.10), 0 16px 30px -14px rgba(4,32,64,0.30), 0 0 40px -16px ${s.color}66, inset 0 1px 0 rgba(255,255,255,0.9)`
                      : '0 1px 2px rgba(4,32,64,0.08), 0 10px 20px -12px rgba(4,32,64,0.22), inset 0 1px 0 rgba(255,255,255,0.9)',
                  }}
                >
                  <span className="flex items-center gap-4">
                    <span
                      className="font-display text-sm font-bold tabular-nums"
                      style={{ color: s.colorOnLight }}
                    >
                      {num}
                    </span>
                    <span className="font-display text-base font-bold leading-tight text-[#062B52]">
                      {s.title}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="ml-2 flex h-8 w-8 flex-none items-center justify-center rounded-full transition-transform"
                    style={{
                      background: `${s.colorOnLight}1a`,
                      color: s.colorOnLight,
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
                    }}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div
                    id={`solution-panel-${s.id}`}
                    className="mt-2 rounded-2xl bg-white p-5"
                    style={{
                      boxShadow:
                        '0 1px 2px rgba(4,32,64,0.08), 0 12px 24px -14px rgba(4,32,64,0.24), inset 0 1px 0 rgba(255,255,255,0.9)',
                    }}
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <span
                        className="flex h-11 w-11 items-center justify-center rounded-xl"
                        style={{
                          background: `linear-gradient(135deg, ${s.colorOnLight}1f, ${s.colorOnLight}0a)`,
                          border: `1px solid ${s.colorOnLight}40`,
                        }}
                      >
                        <Icon className="h-5 w-5" style={{ color: s.colorOnLight }} strokeWidth={1.8} />
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-[#3C5A7A]">{s.description}</p>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
