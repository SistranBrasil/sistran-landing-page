'use client';

/**
 * ProofJourney — Números → Parceiros como UMA jornada.
 *
 * Antes eram três seções independentes em sequência, cada uma com o seu próprio
 * `ScrollTrigger` e o seu próprio `sticky`. Visualmente funcionava, mas cada
 * emenda era um recomeço: a régua de progresso de uma seção morria, a página
 * voltava ao fluxo normal por alguns pixels e a seguinte montava o seu palco de
 * novo. É o "três seções independentes em sequência" que a refatoração proibiu.
 *
 * Aqui há UM percurso de rolagem (esta seção alta), UM palco preso à janela
 * (`.pj-stage`, `position: sticky` — nunca `pin: true`, que remonta o nó e
 * desalinha com o Lenis) e UM relógio (o `ScrollTrigger` deste arquivo). Os
 * capítulos são camadas absolutas dentro do palco, e nenhum deles tem gatilho
 * próprio: eles se INSCREVEM aqui e recebem o seu progresso local já recortado.
 *
 * ── Partitura ────────────────────────────────────────────────────────────────
 * As fronteiras são medidas a partir dos capítulos efetivamente inscritos. Cada capítulo recebe
 * `0..1` DENTRO da sua faixa, então `Metrics` não precisa saber
 * que existe uma jornada em volta: o número que chega neles é o mesmo `progress`
 * que os gatilhos antigos entregavam.
 *
 * A janela de handoff não é uma faixa separada com dono próprio: ela é o TRECHO
 * FINAL do capítulo de Soluções (`--sol-saida`, que já existia). Faixa própria
 * significaria uma quarta camada disputando a mesma altura de tela com as duas
 * que ela emenda — e é justamente a emenda que precisa ser contínua.
 *
 * ── Estado final é o default ─────────────────────────────────────────────────
 * Abaixo de 1024px, sem JavaScript ou com movimento reduzido, `dirigindo` é
 * falso: nada aqui é sticky, nada é camada absoluta, e os capítulos voltam a ser
 * três seções empilhadas no fluxo natural — cada uma já sabe ser lista, porque é
 * o que elas servem hoje quando o `data-dirigindo` delas não aparece.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/lib/motion';
import { criarConsultaDeMedia } from '@/lib/mediaStore';

/* A string fica escrita aqui para ser conferida contra a media query do palco. */
const useJornadaLarga = criarConsultaDeMedia('(min-width: 1024px)');

export type CapituloJornada = 'metrics' | 'partners';

/** Ordem de leitura dos capítulos. */
export const ORDEM: readonly CapituloJornada[] = ['metrics', 'partners'];

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * SIS-89 — quanto a chegada de um capítulo INVADE a saída do anterior, em frações
 * de janela.
 *
 * A aproximação sozinha (uma janela de rolagem, ver `medir`) já bastaria para
 * acabar com o trecho morto, mas deixaria saída e entrada apenas ADJACENTES: a
 * máscara de "Soluções de Negócios" terminaria no mesmo pixel em que "Escala que
 * transforma…" começasse a subir. O pedido é que as duas se sobreponham.
 *
 * 0.35 recua o início da chegada 35% de janela para dentro do percurso preso do
 * capítulo anterior — em 900px de altura, 315px, cerca dos dois últimos terços da
 * janela de saída de Soluções (`--sol-saida`, ~54vh). Sobrepõe o suficiente para
 * ler como um movimento só, e não tanto que a entrada comece antes de a saída
 * estar em curso.
 */
const SOBREPOSICAO = 0.35;

type Inscricao = {
  /**
   * Raiz do capítulo. É dela que sai a faixa de rolagem do capítulo — e é por
   * isso que ela é obrigatória.
   *
   * As frações da partitura (0–46% Soluções, 46–91% Números, 91–100% parceiros)
   * descrevem o percurso PRETENDIDO, não o percurso que o CSS produz: as alturas
   * saem de `min-height` em `vh` que mudam a cada ajuste. Fixar as fronteiras em
   * números literais aqui faria o capítulo trocar de cena enquanto o palco dele
   * ainda não estivesse preso à janela — o defeito exato que a jornada existe
   * para não ter. Então a faixa é MEDIDA, e a partitura é o que se confere nas
   * medições, não o que se hardcoda no relógio.
   */
  alvo: () => HTMLElement | null;
  /**
   * Progresso local, 0..1. Chamado por quadro enquanto a jornada rola.
   *
   * `chegada` é a fração da APROXIMAÇÃO do capítulo — ver `SOBREPOSICAO` e a nota
   * de SIS-89 em `medir`. Vale 1 durante todo o percurso preso do capítulo, então
   * quem não se interessa por ela pode ignorá-la.
   */
  aplicar: (p: number, chegada: number) => void;
  /** Verdadeiro enquanto o capítulo é o que está na tela. */
  aoAlternar?: (ativo: boolean) => void;
};

type Contexto = {
  /** Falso fora da jornada e no modo lista: o capítulo então cria o gatilho dele. */
  dirigindo: boolean;
  /** Devolve a função de baixa. */
  registrar: (nome: CapituloJornada, inscricao: Inscricao) => () => void;
  /**
   * Altura de rolagem em que `p` local do capítulo `nome` é o quadro da vez.
   *
   * Existe para os atalhos (a faixa `01..07` de Números) continuarem navegando:
   * eles precisavam de `start`/`end` do gatilho, e dentro da jornada o gatilho é
   * daqui. Sai do gatilho VIVO, nunca de `offsetTop` recalculado à mão — se o
   * percurso mudar por resize ou `refresh`, o atalho acompanha sem uma segunda
   * fonte de verdade para desincronizar. `null` antes de o gatilho existir.
   */
  alturaDe: (nome: CapituloJornada, p: number) => number | null;
};

const JornadaContext = createContext<Contexto | null>(null);

/**
 * Usado pelos capítulos. Fora de uma `ProofJourney` devolve `dirigindo: false`,
 * e é isso que faz `Metrics` continuar funcionando sozinha em
 * qualquer outra página onde estejam montadas.
 */
export function useJornada(): Contexto {
  return (
    useContext(JornadaContext) ?? {
      dirigindo: false,
      registrar: () => () => {},
      alturaDe: () => null,
    }
  );
}

export default function ProofJourney({ children }: { children: ReactNode }) {
  const secaoRef = useRef<HTMLElement>(null);
  const palcoRef = useRef<HTMLDivElement>(null);
  /* `Map` num ref, não estado: a inscrição acontece em `useEffect` dos filhos e
     não pode provocar re-render do pai — seria um laço de montagem. */
  const inscritos = useRef(new Map<CapituloJornada, Inscricao>());
  const ativoRef = useRef<CapituloJornada | null>(null);
  /* SIS-182 — era `useState(false)` + o efeito comentado abaixo. */
  const isDesktop = useJornadaLarga();
  const rm = useReducedMotion();
  const dirigindo = isDesktop && !rm;

  /* SIS-182 — substituído por `useJornadaLarga()`. O `atualizar()` de abertura é
     `setState` síncrono no efeito: um segundo render em toda montagem.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const atualizar = () => setIsDesktop(mq.matches);
    atualizar();
    mq.addEventListener('change', atualizar);
    return () => mq.removeEventListener('change', atualizar);
  }, []);
  */

  const gatilhoRef = useRef<ScrollTrigger | null>(null);
  /* Faixa de rolagem de cada capítulo, em pixels de documento. Medida, não
     suposta (ver `Inscricao.alvo`), e revalidada a cada `refresh`. */
  const faixas = useRef(
    new Map<CapituloJornada, { inicio: number; fim: number; chegadaDe: number }>(),
  );

  const medir = useCallback(() => {
    const vh = window.innerHeight;
    let anteriorFim: number | null = null;
    for (const nome of ORDEM) {
      const inscricao = inscritos.current.get(nome);
      if (!inscricao) continue;
      const el = inscricao.alvo();
      if (!el) continue;
      const topo = el.getBoundingClientRect().top + window.scrollY;
      /* Mesma convenção dos gatilhos que estas seções tinham: `top top` até
         `bottom bottom`. Capítulo mais baixo que a janela não tem percurso —
         guarda-se uma faixa degenerada e ele fica sempre em `p = 1`. */
      const fim = topo + Math.max(0, el.offsetHeight - vh);
      /* ── SIS-89 · a aproximação deixou de ser rolagem morta ──────────────────
         O `sticky` de um capítulo solta quando o RODAPÉ dele encosta na base da
         janela — uma janela inteira antes de o capítulo seguinte começar. Medido
         em 1440×900: Soluções ia de 3888 a 5724 e Números começava em 6624, ou
         seja 900px de rolagem em que `--sol-p` estava cravado em 1 e `--impact-p`
         em 0. Nesse trecho as duas seções estão na tela ao mesmo tempo, e era
         justamente aí que nada acontecia: a saída de Soluções já tinha terminado
         e a entrada de Números só começava quando o palco dela prendia. O
         sintoma reportado — "abrupta/travada" — era essa janela de nada, com o
         quadro de Soluções já esvaziado subindo e o navy de Números chegando
         vazio.
         A faixa presa não muda (a partitura de cada capítulo depende dela). O que
         passa a existir é a fração da APROXIMAÇÃO, para o capítulo poder ENTRAR
         enquanto chega — que é o que a rolagem já está mostrando. */
      /* SIS-196 — o PRIMEIRO capítulo também tem corredor de chegada.
         ERA: `anteriorFim === null ? topo : ...`, o que dava corredor zero ao
         primeiro capítulo e cravava a fração de chegada dele em 1. Não aparecia
         porque o primeiro capítulo era Soluções, e Soluções não usa `chegada`.
         Com Soluções desacoplada (ver a nota em `page.tsx`), o primeiro é
         Números — e ela entra INTEIRA por `--impact-entrada`, que é essa fração:
         corredor zero apagaria a entrada da seção, que passaria a chegar pronta
         no primeiro quadro. O corredor é o mesmo `SOBREPOSICAO` de janela, agora
         medido a partir do topo do próprio capítulo quando não há capítulo antes
         dele para invadir. */
      const chegadaDe =
        anteriorFim === null
          ? topo - SOBREPOSICAO * vh
          : Math.min(topo, anteriorFim - SOBREPOSICAO * vh);
      faixas.current.set(nome, { inicio: topo, fim, chegadaDe });
      anteriorFim = fim;
    }
  }, []);

  const alturaDe = useCallback((nome: CapituloJornada, p: number) => {
    const faixa = faixas.current.get(nome);
    if (!faixa) return null;
    return faixa.inicio + clamp01(p) * (faixa.fim - faixa.inicio);
  }, []);

  const registrar = useCallback((nome: CapituloJornada, inscricao: Inscricao) => {
    inscritos.current.set(nome, inscricao);
    if (gatilhoRef.current) ScrollTrigger.refresh();
    return () => {
      faixas.current.delete(nome);
      if (inscritos.current.get(nome) === inscricao) inscritos.current.delete(nome);
    };
  }, []);

  /* Memoizado porque os capítulos têm o contexto nas dependências do efeito de
     inscrição: um objeto novo por render daria baixa e nova inscrição a cada
     render do pai, sem nada ter mudado. */
  const contexto = useMemo<Contexto>(
    () => ({ dirigindo, registrar, alturaDe }),
    [dirigindo, registrar, alturaDe],
  );

  useEffect(() => {
    if (!dirigindo) return;
    const secao = secaoRef.current;
    const palco = palcoRef.current;
    if (!secao || !palco) return;

    gsap.registerPlugin(ScrollTrigger);

    const gatilho = ScrollTrigger.create({
      trigger: secao,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;
        /* Progresso da jornada, publicado por `ref` no nó do palco: é o único
           canal contínuo que atravessa os três capítulos, e nenhum deles precisa
           dele para funcionar — quem precisa é a régua da jornada. */
        palco.style.setProperty('--pj-p', p.toFixed(4));

        const y = self.scroll();
        /* SIS-196 — o primeiro INSCRITO, não o primeiro da `ORDEM`: com Soluções
           desacoplada, `ORDEM[0]` é um capítulo que não está montado, e o palco
           ficaria com `data-capitulo="solutions"` até a rolagem alcançar Números
           — sem nunca avisar Números de que ela é a da vez (`aoAlternar`). */
        let atual: CapituloJornada =
          ORDEM.find((n) => inscritos.current.has(n)) ?? ORDEM[0];
        for (const nome of ORDEM) {
          const inscricao = inscritos.current.get(nome);
          const faixa = faixas.current.get(nome);
          if (!inscricao || !faixa) continue;
          const vao = faixa.fim - faixa.inicio;
          const local = vao > 0 ? clamp01((y - faixa.inicio) / vao) : y >= faixa.inicio ? 1 : 0;
          palco.style.setProperty(`--pj-${nome}`, local.toFixed(4));
          /* SIS-89 — fração da aproximação: 0 onde a chegada começa (dentro da
             saída do capítulo anterior), 1 no pixel em que o palco deste prende.
             Daí para frente fica em 1 pelo percurso todo, então o capítulo pode
             usá-la como "quanto já cheguei" sem precisar saber que existe uma
             emenda. Publicada também em CSS: a saída do capítulo ANTERIOR lê esta
             variável para não terminar antes de a entrada começar. */
          const corrida = faixa.inicio - faixa.chegadaDe;
          const chegada = corrida > 0 ? clamp01((y - faixa.chegadaDe) / corrida) : 1;
          palco.style.setProperty(`--pj-chegada-${nome}`, chegada.toFixed(4));
          inscricao.aplicar(local, chegada);
          /* Capítulo da vez: o último cujo palco já começou. A comparação é por
             início e não por "está dentro da faixa" porque as faixas se tocam
             sem sobrepor, e no pixel exato da emenda nenhuma delas conteria a
             posição. */
          if (y >= faixa.inicio) atual = nome;
        }

        /* Como atributo, porque é estado discreto: é o que o CSS lê para decidir
           qual camada recebe eventos de ponteiro e qual superfície está no ar. */
        if (ativoRef.current !== atual) {
          const anterior = ativoRef.current;
          ativoRef.current = atual;
          palco.dataset.capitulo = atual;
          if (anterior) inscritos.current.get(anterior)?.aoAlternar?.(false);
          inscritos.current.get(atual)?.aoAlternar?.(true);
        }
      },
      onToggle: (self) => {
        palco.dataset.visivel = self.isActive ? '1' : '';
      },
    });

    gatilhoRef.current = gatilho;

    /* As faixas são remedidas SEMPRE que o GSAP remede qualquer coisa — resize,
       troca de fonte, mudança de altura de outra seção. Pendurar em `refreshInit`
       em vez de num listener próprio de resize garante que a medição aconteça
       antes de o gatilho recalcular o percurso, e não um quadro depois. */
    ScrollTrigger.addEventListener('refresh', medir);
    ScrollTrigger.refresh();
    medir();
    document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {});

    return () => {
      ScrollTrigger.removeEventListener('refresh', medir);
      gatilho.kill();
      gatilhoRef.current = null;
      /* Só o que este componente escreveu. As camadas limpam o que é delas. */
      for (const nome of [
        '--pj-p',
        '--pj-metrics',
        '--pj-partners',
        '--pj-chegada-metrics',
        '--pj-chegada-partners',
      ]) {
        palco.style.removeProperty(nome);
      }
      delete palco.dataset.capitulo;
      delete palco.dataset.visivel;
      ativoRef.current = null;
      faixas.current.clear();
    };
  }, [dirigindo, medir]);

  return (
    <JornadaContext.Provider value={contexto}>
      {/* `aria-hidden` em nenhuma camada e nenhum `display: none`: a jornada é a
          ordem de leitura de três seções reais, e o leitor de tela percorre as
          três independentemente de qual está pintada na tela. */}
      <section
        ref={secaoRef}
        className="proof-journey"
        data-dirigindo={dirigindo ? '' : undefined}
      >
        <div ref={palcoRef} className="pj-stage" data-capitulo="metrics">
          {children}
        </div>
      </section>
    </JornadaContext.Provider>
  );
}
