'use client';

/**
 * SIS-144 — PERCURSO HORIZONTAL DA FAIXA DE INDICADORES de `/contato`.
 *
 * O palco prende na janela, os sete cartões correm para o lado com o scroll e,
 * quando o percurso termina, a página volta a descer. A arquitetura é copiada de
 * `PartnersTrack` + `partners-track.css` (o precedente mais próximo, indicado
 * pela issue), NÃO do `Metrics.tsx` da home.
 *
 * ── UMA DIFERENÇA DELIBERADA EM RELAÇÃO AO PRECEDENTE ───────────────────────
 * `PartnersTrack` monta o conteúdo DUAS VEZES (trilha e lista) e o CSS liga uma
 * das duas com `display: none`. Aqui os nós são OS MESMOS: a `<ul>` da faixa é a
 * grade no estado de repouso e vira a trilha quando o percurso liga. Cabe fazer
 * assim porque, ao contrário de lá, nenhum cartão daqui muda de conteúdo entre as
 * duas formas (lá o painel da trilha ganha `line-clamp`, botão de detalhe e um
 * painel absoluto que a lista não pode ter). Ganhos diretos: nada é montado em
 * dobro, não existe o risco de o leitor de tela ler sete indicadores duas vezes,
 * e a faixa continua saindo do servidor de uma vez só — ver abaixo.
 *
 * ── ESTE COMPONENTE É UMA CASCA, E É POR ISSO QUE `MetricsBand` SEGUE SERVER ─
 * `MetricsBand.tsx` registra, com o motivo, que continua Server Component. Isso
 * não muda: a faixa inteira (o `<ul>`, os sete cartões, os rótulos, o `+`)
 * continua renderizada no servidor e chega aqui como `children`. O que é cliente
 * é só o palco em volta — o `ref`, a leitura de preferências e o relógio que
 * escreve `--mb-p`. Nenhum texto novo viaja como JavaScript por causa desta
 * issue.
 *
 * ── SEM `pin: true` E SEM `ScrollTrigger` ───────────────────────────────────
 * `position: sticky`, como manda a issue e como está escrito em seis componentes
 * desta base (`Metrics.tsx:37`, `Contact.tsx:22`, `EventsSpotlight.tsx:47`,
 * `PartnersTrack.tsx:16`, `ProofJourney.tsx:13`, `ui/BuildingShowcase.tsx:35`,
 * `ui/OfficesScene.tsx:94`): `pin` reparenta o nó e dessincroniza com o Lenis.
 *
 * Consequência que vale declarar, porque a issue pede `ScrollTrigger.refresh()`
 * em `resize` e `invalidateOnRefresh: true` (ponto 5 e um critério de aceite):
 * NÃO HÁ ScrollTrigger nesta cena, então essas duas exigências DEIXAM DE
 * EXISTIR em vez de serem cumpridas — é o mesmo desfecho que a SIS-159 registrou
 * em `partners-track.css`. O que as substitui:
 *   • a distância do deslocamento é uma conta de CSS entre comprimentos de CSS
 *     (largura do cartão, vão, largura da janela), então não há `scrollWidth`
 *     medido para ficar velho quando as fontes carregam;
 *   • `useProgressoDeSecao` relê `getBoundingClientRect` a cada quadro de
 *     rolagem E escuta `resize`, então mudança de layout se corrige sozinha no
 *     quadro seguinte;
 *   • o percurso da home (`Metrics.tsx`, que USA ScrollTrigger) está em OUTRA
 *     rota — não há dois percursos de ScrollTrigger na mesma página para
 *     desalinhar offset. Nesta rota os outros dois movimentos (o mapa e o
 *     `PalcoReativo`) também não usam ScrollTrigger.
 *
 * ── COM JAVASCRIPT DESLIGADO, A FAIXA CONTINUA SENDO A GRADE ────────────────
 * Critério de aceite explícito, e é o motivo de o percurso ser ligado por um
 * atributo escrito daqui (`data-percurso="ligado"`) em vez de só por `@media`.
 * Sem JavaScript o atributo nunca aparece, o CSS do percurso nunca casa e os
 * sete indicadores ficam na grade, todos visíveis — em vez de congelarem no
 * começo de uma trilha que ninguém pode deslocar (seriam três à vista e quatro
 * inalcançáveis). É o mesmo defeito que a SIS-159 mediu quando o espelho do
 * interruptor manual faltava, evitado na origem.
 *
 * O atributo é escrito em efeito, e não no primeiro render, de propósito: a
 * preferência de movimento e a largura só existem no cliente, e decidir no
 * primeiro render divergiria da árvore do servidor (o `useReducedMotion` do
 * projeto nasce `false` justamente por isso — ver `src/lib/motion.ts`).
 */

import './metrics-band-track.css';
import { useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react';
import { METRICS } from '@/data/metrics';
import { useReducedMotion } from '@/lib/motion';
import { useProgressoDeSecao } from '@/lib/scrollProgress';

/* Contagem derivada do dado, num lugar só — a mesma fonte que a faixa usa. Sete
   hoje; acrescentar um indicador em `metrics.ts` ajusta altura, distância e
   escala sem tocar em número escrito à mão. */
const TOTAL = METRICS.length;

/* Quanto de rolagem cada cartão consome. É o ÚNICO número livre desta geometria,
   e `ESCALA` sai dele — por isso mora aqui e não no CSS: o mesmo número em dois
   lugares é como os dois divergem.
   30 não é chute: o percurso preso fica em `(7 - 1) × 30 = 180svh`, que a
   1440×900 são 1620px de rolagem para ~1515px de transbordo medido (ver o
   relatório da issue). Perto de 1:1, então o cartão anda aproximadamente o que o
   dedo anda. */
const PASSO_SVH = 30;

/* `useProgressoDeSecao` em modo `saida` devolve 0..1 sobre a SEÇÃO INTEIRA, mas o
   palco solta 100svh antes do fim dela. Esta escala converte um no outro, e é o
   que leva `--mb-t` a exatamente 1 no instante em que o palco desprende.
   Sem ela o último cartão pararia antes do fim e sobraria rolagem morta — é a
   armadilha que a SIS-156 mediu e que a SIS-159 documentou.

   CONFERIDA NO NAVEGADOR, e o número que prova é o de 1024×768: no último quadro
   em que o palco ainda está preso a trilha marca −1115,6px de um total de
   −1116,2px, ou seja o percurso fecha 0,6px antes de soltar. `--mb-p` nesse quadro
   é 0,643, que é exatamente 1 ÷ 1,5556 — o inverso desta escala.
   A 1440 e a 1920 a mesma leitura sobra 34,5px e 17,6px, e isso é a AMOSTRAGEM, não
   a cena: com passo de 60px e 70px, um quadro de folga vale 45px e 30px de trilha,
   que é a ordem exata das sobras. Quem repetir a medição use passo menor. */
const ESCALA = ((TOTAL - 1) * PASSO_SVH + 100) / ((TOTAL - 1) * PASSO_SVH);

/* ── A CONDIÇÃO DE LARGURA, NO FORMATO DA CASA ───────────────────────────────
 * Tem de ser IDÊNTICA à `@media` de `metrics-band-track.css`: divergir faz o hook
 * escrever progresso para uma cena que o CSS não ligou (custo sem efeito) ou
 * deixa a cena parada com o CSS ligado (defeito visível).
 *
 * `useSyncExternalStore`, e não `matchMedia` dentro de `useEffect` com
 * `setState` — a forma que oito componentes desta base ainda usam e que o
 * `react-hooks/set-state-in-effect` acusa (são a maior parte dos 24 avisos de
 * lint do projeto). O molde é o do próprio `src/lib/motion.ts`, com o
 * `MediaQueryList` guardado no módulo e instantâneo de servidor `false`. */
const LARGURA_PERCURSO = '(min-width: 1024px)';

let mqLargura: MediaQueryList | null = null;
function pegarMq(): MediaQueryList {
  mqLargura ??= window.matchMedia(LARGURA_PERCURSO);
  return mqLargura;
}
function assinar(avisar: () => void) {
  const mq = pegarMq();
  mq.addEventListener('change', avisar);
  return () => mq.removeEventListener('change', avisar);
}
function ler(): boolean {
  return pegarMq().matches;
}

export default function PercursoIndicadores({ children }: { children: ReactNode }) {
  const secaoRef = useRef<HTMLDivElement>(null);
  const rm = useReducedMotion();
  const largo = useSyncExternalStore(assinar, ler, () => false);
  const ativo = largo && !rm;

  useProgressoDeSecao(secaoRef, '--mb-p', ativo, 'saida');

  /* O atributo, e não uma classe: ele é o que o CSS exige para ligar o percurso,
     e escrever daqui é o que garante o parágrafo "com JavaScript desligado" do
     cabeçalho. Removido — e não posto em `"nao"` — quando o percurso não vale,
     para que o seletor do CSS seja uma condição só. */
  useEffect(() => {
    const el = secaoRef.current;
    if (!el) return;
    if (ativo) el.setAttribute('data-percurso', 'ligado');
    else el.removeAttribute('data-percurso');
    return () => el.removeAttribute('data-percurso');
  }, [ativo]);

  /* A conversão fica FORA do JSX de propósito, e o motivo é o extrator de cópia:
     `scripts/copy-lock.mjs` varre a marcação e leu `as React.CSSProperties`
     escrito dentro do `style={...}` como texto novo da página (é a 14ª ocorrência
     do mesmo ruído na base). Nada de cópia mudou nesta issue — nenhuma palavra
     visível foi tocada — então em vez de destravar o lock por ruído de código, o
     molde sai da marcação. A conversão em si é necessária: `CSSProperties` não
     aceita chaves `--*`. */
  const estilo = {
    '--mb-n': TOTAL,
    '--mb-passo': `${PASSO_SVH}svh`,
    '--mb-esc': ESCALA.toFixed(4),
  } as React.CSSProperties;

  return (
    <div ref={secaoRef} className="mb-percurso" style={estilo}>
      <div className="mb-palco">{children}</div>
      {/* A ALTURA DA SEÇÃO NÃO ESTÁ ESCRITA EM LUGAR NENHUM: ela é este espaçador,
          `(N - 1) × passo`, mais os 100svh do palco preso. Trocar a contagem em
          `metrics.ts` ou o passo acima reacerta tudo — não há um `280svh` para
          divergir do dado.
          Caixa vazia de medição, sem uma palavra dentro: `aria-hidden` aqui é
          legítimo pelo mesmo critério das sentinelas de `PartnersTrack`. */}
      <div className="mb-espaco" aria-hidden="true" />
    </div>
  );
}
