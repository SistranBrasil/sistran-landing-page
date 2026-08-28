'use client';

import { useSyncExternalStore } from 'react';
import { type MotionValue, useTransform } from 'motion/react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Design system de motion do padrão Sistran Labs.
 * Importar de `@/lib/motion` (copiar este arquivo para src/lib/motion.ts).
 *
 * Uso típico:
 *   <motion.div variants={vHeader} initial="hidden" whileInView="visible" viewport={VP}>
 *     <motion.span variants={vEyebrow}>...</motion.span>
 *     <motion.h2  variants={vTitle}>...</motion.h2>
 *   </motion.div>
 */

export const ease = [0.25, 0.46, 0.45, 0.94] as const;
/**
 * A curva de saída da marca. Fonte única — em JS.
 *
 * SIS-71: o valor estava certo em todo lugar e importado em nenhum. Havia dez
 * cópias do literal `[0.22, 1, 0.36, 1]` espalhadas por nove componentes, uma
 * delas redeclarando o próprio `const easeExpo` (`PartnersGrid`) e outra com
 * nome diferente (`EASE_MARCA`, em `ScrollReveal`). Nenhuma divergia — e é
 * exatamente por isso que a próxima divergiria sem ninguém notar. Agora todas
 * importam daqui.
 *
 * O lado CSS da mesma curva é `--ease-out`, no `:root` do `globals.css`. Quem
 * escreve `transitionTimingFunction` em estilo inline usa `var(--ease-out)`, não
 * o `cubic-bezier()` escrito à mão: são dois tokens porque são duas linguagens,
 * e não dois valores.
 */
export const easeExpo = [0.22, 1, 0.36, 1] as const;

export const VP = { once: true, margin: '-80px' } as const;
export const VP0 = { once: true } as const;

/* SIS-71 — o que a auditoria dos cinco efeitos encontrou, para não ser refeita:
   • Fade-up expo, stagger de grade, contador e Lenis: já existiam e estão em uso
     (`vFadeUp`/`vTitle`/`vSubtitle`/`vEyebrow`, `vGrid`+`vCard`, `CountUp`,
     `window.__lenis`). O que faltava era o easing vir daqui — corrigido.
   • Marquee: `SignalMarquee` + `.marquee-*` do `globals.css` JÁ resolvem os dois
     defeitos previstos. O gap vive DENTRO da cópia (`gap` + `padding-right` em
     `.marquee-copy`, trilha sem gap), então `translate3d(-50%)` fecha o loop sem
     salto; e com movimento reduzido a faixa não congela — a viewport vira lista
     rolável e a cópia `aria-hidden` sai de cena. Nada a fazer.
   • `whileHover`/`whileTap` padronizados NÃO foram acrescentados: o projeto tem
     zero ocorrências das duas props — o hover de cartão é `transition` de CSS
     (`hover:-translate-y-1`, `.barra-sinal`). Uma primitiva sem consumidor é
     código morto, e migrar hovers de CSS para JS pioraria o custo por quadro.
   • `Solutions` foi avaliada como candidata a `vGrid`/`vCard` e DESCARTADA por
     estrutura: não é grade de cartões, é palco preso à rolagem coreografado por
     `--sol-p`/`--sol-i`. Somar entrada por `whileInView` ali seria a segunda
     animação disputando o mesmo nó — o defeito que a validação do issue proíbe.
   • Números de `RecognitionTheater` (12/3/5/3) ficam estáticos: são um a um
     dígito dentro de um carrossel, e `CountUp` observa a entrada em cena uma
     vez só — contaria na primeira lâmina e nunca mais. */

/** Container que orquestra stagger nos filhos (eyebrow/title/subtitle). */
export const vHeader = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export const vEyebrow = {
  hidden: { opacity: 0, y: 34, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: easeExpo },
  },
};

export const vTitle = {
  hidden: { opacity: 0, y: 34, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: easeExpo },
  },
};

export const vSubtitle = {
  hidden: { opacity: 0, y: 34, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: easeExpo },
  },
};

/** Container de grid com stagger para cards. */
export const vGrid = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export const vCard = {
  hidden: { opacity: 0, y: 34, scale: 0.97, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: easeExpo },
  },
};

export const vFadeUp = {
  hidden: { opacity: 0, y: 34, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: easeExpo },
  },
};

/** Enter/exit para conteúdo de tabs (usar com AnimatePresence mode="wait"). */
export const tabContent = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease } },
};

/** Gradient de texto assinatura — usar como className em <span>. */
export const grad =
  'bg-gradient-to-r from-[#0079CB] via-[#1e8fe0] to-[#0ed8f6] bg-clip-text text-transparent';

/* Uma única MediaQueryList para toda a aplicação. Sem o cache, cada render de
   cada componente que chama o hook alocaria um objeto novo — `getSnapshot` roda
   em todo render, e são dezenas de consumidores. */
let mediaQuery: MediaQueryList | null = null;

function getMediaQuery(): MediaQueryList {
  if (!mediaQuery) mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  return mediaQuery;
}

/**
 * Leitura síncrona da preferência. Use dentro de `useEffect`, nunca durante o
 * render: no render o valor precisa ser o mesmo do servidor (`false`), senão a
 * hidratação diverge.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return getMediaQuery().matches;
}

/**
 * Hook: retorna true se o usuário prefere motion reduzido.
 *
 * O snapshot do servidor é sempre `false` e o primeiro render do cliente também
 * — o valor real só chega depois da hidratação. Por isso o consumidor NUNCA
 * pode usar `rm` para decidir quais nós existem (`if (rm) return <A/>`): quando
 * o valor vira `true`, a subárvore inteira é desmontada e remontada. Condicione
 * apenas estilos e props, ou resolva a diferença em CSS.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);
}

function subscribeReducedMotion(onChange: () => void): () => void {
  const mq = getMediaQuery();
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

function getReducedMotion(): boolean {
  return getMediaQuery().matches;
}

/**
 * Opacidade presa a um progresso de scroll, sem aceleração nativa.
 *
 * `useTransform(progress, [a, b], [de, para])` na prop `opacity` é um caso que o
 * `motion` 12 tenta acelerar: em vez de escrever o valor a cada frame, ele
 * registra uma `Animation` nativa com `ViewTimeline`. E uma `ViewTimeline` mede
 * a visibilidade DO PRÓPRIO elemento no scrollport — nada a ver com o relógio
 * que passamos.
 *
 * Nas camadas do hero (`.hero-cue`, e antes dela a dos indicadores de
 * "Resultados"), que são `sticky`/`fixed` — a dos indicadores com
 * `margin-bottom: -100svh` —, os dois relógios divergem por completo: a
 * camada subia até ~0.8 e VOLTAVA para ~0.1 no fim do percurso, e a pastilha de
 * scroll nunca saía de cena. Só a opacidade sofria disso — `y`/`scale` em `rem`
 * e `svh` não são aceleráveis e continuavam corretas, o que faz o sintoma
 * parecer inexplicável.
 *
 * A forma de função não é analisável como keyframes, então o `motion` mantém o
 * cálculo em JS, no relógio certo. Interpolação linear entre dois pontos, com
 * clamp nas pontas — é tudo o que a forma de array fazia.
 */
export function useScrollOpacity(
  progress: MotionValue<number>,
  [inicio, fim]: readonly [number, number],
  [de, para]: readonly [number, number] = [0, 1],
): MotionValue<number> {
  return useTransform(() => {
    const t = (progress.get() - inicio) / (fim - inicio);
    if (t <= 0) return de;
    if (t >= 1) return para;
    return de + (para - de) * t;
  });
}
