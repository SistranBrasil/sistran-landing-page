'use client';

/**
 * SIS-159 — TRILHA HORIZONTAL DOS PARCEIROS de `/parceiros-e-implementacoes`.
 *
 * Substitui a grade bento de dezesseis cards (`PartnersGrid`), que continua no
 * projeto, comentada na montagem do `page.tsx` com o motivo.
 *
 * O desenho: o palco prende na janela, os dezesseis painéis deslizam na
 * horizontal com o scroll, o ativo em opacidade e escala plenas e os vizinhos
 * reduzidos, contador `01 / 16`, barra de progresso, atalhos por categoria que
 * PULAM (não filtram) e um detalhe que abre DENTRO do painel.
 *
 * ── AS QUATRO TRAVAS DA ISSUE, E COMO CADA UMA FOI RESOLVIDA ────────────────
 *
 * 1. `pin: true` NÃO ENTRA. É `position: sticky`. A proibição está escrita em
 *    seis lugares do repositório (quatro notas no `globals.css` e os cabeçalhos
 *    de `Contact`, `Metrics`, `ProofJourney`, `ui/BuildingShowcase`,
 *    `ui/OfficesScene`), porque `pin` reparenta o nó e dessincroniza com o
 *    Lenis. Consequência direta: NÃO HÁ ScrollTrigger nesta cena, então o item
 *    10 da issue (ponte Lenis↔ScrollTrigger, `refresh()` depois de
 *    `document.fonts.ready` e do `onload` dos logos) deixa de existir em vez de
 *    ser resolvido. Não há `scrollWidth` medido em nenhum lugar: a distância da
 *    trilha é `(N - 1) × (largura + vão)`, e os dois são comprimentos de CSS.
 *    Também não há dois `pin` aninhados com o `PartnersTrail` logo abaixo — ele
 *    faz a própria conta de scroll e continua intacto.
 *
 * 2. A ALTURA VEM DA CONTAGEM, não do `520vh` copiado. Ela não está escrita em
 *    lugar nenhum: é a soma das N sentinelas mais a cauda. `PASSO_SVH` e
 *    `CAUDA_SVH` moram aqui porque é daqui que sai `--par-esc`, e `N` é
 *    `PARTNERS.length`. Trocar o dado ajusta altura, distância e contador de
 *    uma vez.
 *
 * 3. OS FILTROS VIRAM ATALHOS QUE PULAM — a saída (b), que a própria issue
 *    recomenda. Filtrar mudaria a contagem de painéis, logo a distância e a
 *    altura da seção, no meio de uma cena presa: a página saltaria sob quem
 *    rola. Pular preserva a navegação por categoria e a largura da trilha nunca
 *    muda.
 *
 * 4. `short` E `tags` SAEM DO DESENHO. Eram conteúdo novo — uma linha curta e
 *    três etiquetas por parceiro, dezesseis vezes — e inventar texto
 *    institucional sobre parceiro nomeado não é decisão de quem escreve o
 *    código. O critério de aceite abre essa porta ("ou o desenho foi ajustado
 *    para dispensá-los"). No lugar:
 *      • o CHIP é sempre `PARTNER_CATEGORIES[category].label`, conteúdo já
 *        aprovado, e existe nos dezesseis — nenhum painel com campo vazio;
 *      • o `focus` (a linha em negrito do site) entra quando existe: 11 dos 16
 *        têm. Os outros 5 (samplemed, pega, microsoft-azure, virtusa, aws) não
 *        ganham linha inventada — ficam com chip, número, título e placa;
 *      • a Addactis não tem `description` no dado (e o TODO em `partners.ts`
 *        explica: no site ela repete, palavra por palavra, o texto da AWS).
 *        Sem descrição, o painel não mostra o botão de detalhe: não há o que
 *        revelar. Botão que abre um detalhe vazio é pior que a ausência dele.
 *
 * ── O NÚMERO DO PAINEL É DERIVADO ──────────────────────────────────────────
 * `String(i + 1).padStart(2, '0')`, como a grade já fazia. NENHUM campo `num`
 * foi gravado no dado: numeração duplicada é como ela sai de sincronia com a
 * ordem.
 *
 * ── POR QUE `IntersectionObserver` PARA O ÍNDICE ATIVO ──────────────────────
 * O deslocamento é CSS puro (`--par-t`), mas o contador, o `aria` e o estado do
 * painel ativo são JSX e precisam de um inteiro. N sentinelas em fluxo mais um
 * observador com `rootMargin: -50% 0 -50%` reduzem a área observada a UMA LINHA
 * no meio da tela, e a resposta é exatamente "qual painel está no centro".
 * `threshold: 0` de propósito: área de altura zero nunca satisfaria fração.
 *
 * As duas medidas concordam por aritmética, e vale registrar: a sentinela `i`
 * cruza o centro em `t = (i + 0,5) / N`, e o painel `i` está centrado em
 * `t = i / (N - 1)`. Para N = 16 o arredondamento de uma cai sempre no índice da
 * outra (`round((i + 0,5) × 15 / 16) = i` para todo `i` de 0 a 15) — nenhuma
 * troca de destaque acontece com o painel fora do centro.
 *
 * ── MOVIMENTO REDUZIDO E ABAIXO DE 1024px: LAYOUT COMPLETO ──────────────────
 * Item 9 da issue. As duas versões estão na árvore e o CSS liga UMA das duas com
 * `display: none` — que é o que mantém a escondida fora da árvore de
 * acessibilidade (nada é lido duas vezes, nenhuma é `aria-hidden`). A regra está
 * escrita "lista por padrão, trilha como exceção": nenhum painel pode ficar
 * preso em opacidade parcial por causa de uma regra de acessibilidade, que é o
 * defeito clássico apontado no item 9.
 * A MESMA condição governa o hook de progresso (`ativo`): com movimento
 * reduzido ou abaixo de 1024px ele não escreve nada, e o valor de repouso mora
 * no fallback do `var()` — ver a nota de `scrollProgress.ts`.
 *
 * ── DUAS BIBLIOTECAS, UM NÓ (item 7) ───────────────────────────────────────
 * Não há `motion/react` nem GSAP nesta cena. O deslize é `transform` por
 * variável CSS, e a transição do painel ativo é `transition` de CSS. Ninguém
 * disputa o `transform` de nó nenhum — o `useTilt` do card antigo ficou com o
 * card antigo.
 *
 * ── `--font-mono` NÃO EXISTE NO PROJETO (item 6) ────────────────────────────
 * É referenciada uma vez em `legacy.css:2483` e nunca definida; quem define é a
 * SIS-155. Até lá, `MONO` abaixo carrega o fallback EXPLÍCITO, então nenhum
 * texto cai no monospace do sistema por acidente. Quando a SIS-155 entrar, a
 * variável passa a valer e esta constante continua correta sem edição.
 */

import './partners-track.css';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { PARTNERS, PARTNER_CATEGORIES, type PartnerCategory } from '@/data/partners';
import { getIcon } from '@/lib/icons';
import { prefersReducedMotion, useReducedMotion } from '@/lib/motion';
import { useProgressoDeSecao } from '@/lib/scrollProgress';

/* Contagem em UM lugar só, derivada do dado: contador, `aria-valuemax`,
   sentinelas e a escala do progresso leem daqui. */
const TOTAL = PARTNERS.length;

/* Quanto de rolagem cada painel consome. É o ÚNICO número livre desta geometria;
   os três seguintes saem dele. Mora aqui, e não no CSS, porque é daqui que sai
   `ESCALA` — o mesmo número em dois lugares é como os dois divergem. */
const PASSO_SVH = 30;

/* ── A GEOMETRIA, E POR QUE ELA NÃO TEM FOLGA PARA CALIBRAR ─────────────────
 * A primeira versão desta cena escolheu a cauda a olho (60svh) e as duas
 * medidas divergiram: a sonda (`tmp-sonda/parceiros.mjs`) mostrou o décimo sexto
 * painel 406px fora do centro quando a décima sexta sentinela cruzava a linha do
 * meio, com `--par-t` em 0,943 e não em 1. É EXATAMENTE a armadilha da SIS-156 —
 * o gatilho percorrendo uma caixa e o `sticky` percorrendo outra — e ela não se
 * resolve escolhendo melhor o número: resolve-se derivando os três.
 *
 * Duas condições, e elas fecham a conta sozinhas:
 *   (a) a sentinela `i` cruza o centro da janela exatamente quando o painel `i`
 *       está centrado, para TODO i;
 *   (b) o último painel chega ao centro no mesmo instante em que o palco solta
 *       do topo — nem antes (chegaria fora de quadro) nem depois (sobraria
 *       rolagem parada).
 *
 * De (b): o percurso preso é `H - 100svh` e tem de valer `(N-1) × passo`, logo
 *   H = (N-1) × passo + 100   →   CAUDA = H - N × passo = 100 - passo
 * De (a): a sentinela 0 tem de cruzar o centro em `p = 0` (o instante em que o
 * palco prende), então a faixa de sentinelas começa `50 - passo/2` abaixo do topo
 * da seção. O recuo do fim cai no MESMO valor, por simetria da conta acima.
 *
 * Com passo 30 e N 16: H = 550svh e recuo 35svh — o MESMO nas duas pontas, e as
 * duas somadas são os `100 - passo` de sobra que a condição (b) pede. Não existe
 * "cauda" como número escolhido: ela é consequência, e mexer em `PASSO_SVH`
 * reacerta tudo. A altura da seção continua NÃO ESCRITA em lugar nenhum — é a
 * soma das sentinelas mais os dois recuos. */
const RECUO_SVH = 50 - PASSO_SVH / 2;

/* `useProgressoDeSecao` em modo `saida` devolve 0..1 sobre a SEÇÃO INTEIRA, mas o
   percurso preso é 100svh mais curto. Esta escala converte um no outro, e com a
   geometria acima ela leva `--par-t` a exatamente 1 no instante em que a última
   sentinela cruza o centro. */
const ESCALA = ((TOTAL - 1) * PASSO_SVH + 100) / ((TOTAL - 1) * PASSO_SVH);

/* Ver a nota do cabeçalho: `--font-mono` não existe neste projeto até a SIS-155. */
const MONO = 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)';

/* ── A CONDIÇÃO DE LARGURA, NO FORMATO DA CASA ───────────────────────────────
 * Esta string tem de ser IDÊNTICA à `@media` de `partners-track.css`: divergir
 * faz o `useProgressoDeSecao` escrever progresso para uma cena em
 * `display: none` (custo sem efeito) ou deixar a cena parada com o CSS ligado
 * (defeito visível).
 *
 * A leitura é `useSyncExternalStore`, e não `matchMedia` dentro de um `useEffect`
 * com `setState` — que é a forma que oito componentes deste repositório ainda
 * usam (`Contact.tsx:120`, `Metrics.tsx:353`, `ProofJourney.tsx:147`,
 * `Solutions.tsx:93`, `ui/BuildingShowcase.tsx:79`, `ui/MosaicHandoff.tsx:99`,
 * `ui/ScrollSpy.tsx:37`, `RecognitionTheater.tsx:122`) e que o
 * `react-hooks/set-state-in-effect` acusa: `setState` síncrono num efeito
 * dispara render em cascata. O molde adotado aqui é o do próprio
 * `src/lib/motion.ts` (`useReducedMotion`), com o `MediaQueryList` guardado no
 * módulo e instantâneo de servidor `false` — a preferência real só existe no
 * cliente, então `false` no SSR é o que impede divergência de hidratação.
 *
 * Como em `motion.ts`, o valor só decide ESTILO e o `ativo` do hook de
 * progresso: nunca QUAIS NÓS EXISTEM. As duas versões do conteúdo estão sempre
 * na árvore; quem escolhe entre elas é a media query do CSS. */
const LARGURA_TRILHA = '(min-width: 1024px)';

let mqLargura: MediaQueryList | null = null;
function pegarMqLargura(): MediaQueryList {
  mqLargura ??= window.matchMedia(LARGURA_TRILHA);
  return mqLargura;
}
function assinarLargura(avisar: () => void) {
  const mq = pegarMqLargura();
  mq.addEventListener('change', avisar);
  return () => mq.removeEventListener('change', avisar);
}
function lerLargura(): boolean {
  return pegarMqLargura().matches;
}

const CATEGORY_TONES: Record<PartnerCategory, string> = {
  seguros: '#0ed8f6',
  plataforma: '#57B7EE',
  cloud: '#A78BFA',
  gestao: '#7CCBF3',
  dados: '#C4A0FB',
  inteligencia: '#6EE7B7',
};

export default function PartnersTrack() {
  const [ativo, setAtivo] = useState(0);
  const [aberto, setAberto] = useState<string | null>(null);
  const secaoRef = useRef<HTMLDivElement>(null);
  const trilhaRef = useRef<HTMLDivElement>(null);
  const rm = useReducedMotion();
  /* A MESMA condição da media query que liga a trilha (ver `LARGURA_TRILHA`). Se
     as duas divergirem, o hook escreve progresso para uma cena em
     `display: none` (custo sem efeito) ou a cena fica parada com o CSS ligado
     (defeito visível). */
  const desktop = useSyncExternalStore(assinarLargura, lerLargura, () => false);

  useProgressoDeSecao(secaoRef, '--par-p', desktop && !rm, 'saida');

  /* Qual sentinela cruza o centro da janela — ver a nota do cabeçalho sobre por
     que este inteiro e o `--par-t` do CSS concordam por aritmética. */
  useEffect(() => {
    const trilha = trilhaRef.current;
    if (!trilha) return;
    const sentinelas = Array.from(trilha.querySelectorAll<HTMLElement>('[data-parceiro-i]'));
    if (!sentinelas.length) return;

    const io = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          const i = Number((entrada.target as HTMLElement).dataset.parceiroI);
          if (Number.isFinite(i)) setAtivo(i);
        }
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    );
    sentinelas.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  /* Pular para o painel N. `window.scrollTo`, e NÃO `scrollIntoView`: a rota usa
     rolagem suave por biblioteca (Lenis), que intercepta a segunda — apuração
     registrada na SIS-151. O alvo é o CENTRO da sentinela no centro da janela,
     que é o mesmo critério do observador acima; mirar o topo cairia meia
     sentinela antes de aquele painel virar o ativo. */
  const irPara = useCallback((i: number) => {
    const alvo = trilhaRef.current?.querySelector<HTMLElement>(`[data-parceiro-i="${i}"]`);
    if (!alvo) return;
    const caixa = alvo.getBoundingClientRect();
    const y = window.scrollY + caixa.top + caixa.height / 2 - window.innerHeight / 2;
    window.scrollTo({
      top: Math.max(0, Math.round(y)),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }, []);

  /* ── O ANÚNCIO ESPERA A ROLAGEM PARAR ────────────────────────────────────
     `aria-live="polite"` ligado direto em `ativo` enfileira dezesseis anúncios
     numa rolagem contínua: o leitor de tela termina de ler nomes de parceiros
     que já passaram há três telas. `polite` não atropela a leitura, mas também
     não descarta o que ficou na fila.
     Este atraso faz o texto vivo só mudar quando o destaque se ASSENTA. Quem
     atravessa a seção rolando ouve um anúncio, o do painel onde parou; quem
     navega painel por painel (atalho, Tab) ouve cada um, porque em cada parada o
     tempo expira. O valor é o menor que sobrevive a uma rolagem de roda comum. */
  const [anunciado, setAnunciado] = useState(0);
  useEffect(() => {
    const t = window.setTimeout(() => setAnunciado(ativo), 350);
    return () => window.clearTimeout(t);
  }, [ativo]);

  /* Primeiro parceiro de cada categoria: é para onde o atalho pula. Derivado da
     ordem do dado, então nenhuma lista de destinos a manter à mão. */
  const atalhos = useMemo(
    () =>
      (Object.keys(PARTNER_CATEGORIES) as PartnerCategory[])
        .map((cat) => ({
          cat,
          label: PARTNER_CATEGORIES[cat].label,
          i: PARTNERS.findIndex((p) => p.category === cat),
        }))
        .filter((a) => a.i >= 0),
    [],
  );

  const painel = (p: (typeof PARTNERS)[number], i: number, naTrilha: boolean) => {
    const tone = CATEGORY_TONES[p.category];
    const Icon = getIcon(p.icon);
    const estaAberto = aberto === p.id;
    const detalheId = `parceiro-detalhe-${p.id}`;

    return (
      <article
        key={p.id}
        /* `on-dark`: o painel mantém fundo navy dentro da seção clara. Sem isso
           os overrides de `.section-light` pintariam `h3`/`p` de navy sobre
           navy. Ver `globals.css`. */
        className={
          'on-dark relative flex flex-col overflow-hidden rounded-3xl border border-white/12 p-7' +
          (naTrilha ? ' parceiros-painel' : '') +
          (naTrilha && i === ativo ? ' parceiros-painel--ativo' : '')
        }
        style={{
          /* Gradiente, e NENHUM `backdrop-filter` (item 12): num painel deste
             tamanho que se move, o blur de fundo é repaint caro a cada quadro. */
          background:
            'linear-gradient(135deg, rgba(8,49,86,0.94), rgba(6,38,69,0.90) 55%, rgba(4,29,55,0.94))',
          boxShadow:
            '0 1px 3px rgba(3,26,52,0.16), 0 12px 26px -14px rgba(3,26,52,0.34), 0 30px 60px -30px rgba(3,26,52,0.40), inset 0 1px 0 rgba(255,255,255,0.16)',
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${tone}33, ${tone}10)`,
              border: `1px solid ${tone}66`,
            }}
          >
            <Icon className="h-7 w-7" style={{ color: tone }} strokeWidth={1.8} />
          </div>
          <div className="flex flex-col items-end gap-2">
            {/* Número DERIVADO do índice — nenhum campo `num` no dado. */}
            <span
              aria-hidden
              className="font-display text-4xl leading-none"
              style={{ color: 'rgba(255,255,255,0.30)', fontVariantNumeric: 'tabular-nums' }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            {/* Chip de categoria: conteúdo já aprovado, e existe nos dezesseis. */}
            <span
              className="inline-flex items-center rounded-full border border-white/12 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: tone, fontFamily: MONO }}
            >
              {PARTNER_CATEGORIES[p.category].label}
            </span>
          </div>
        </div>

        <h3 className="mt-6 font-display text-2xl leading-tight text-white">{p.title}</h3>

        {/* A linha em negrito do site, quando existe (11 dos 16). Os outros cinco
            não ganham texto inventado. */}
        {p.focus && (
          <p
            className="mt-1 text-xs font-semibold uppercase tracking-[0.14em]"
            style={{ color: tone, fontFamily: MONO }}
          >
            {p.focus}
          </p>
        )}

        {/* ⚠️ O RECORTE DE QUATRO LINHAS SÓ EXISTE NA TRILHA, e o motivo é de
            acessibilidade, não de estética: no painel a altura é fixa (`62svh`) e
            o que o recorte esconde é alcançável pelo botão de detalhe. NA LISTA
            não há painel de detalhe montado (ver abaixo), então um `line-clamp`
            aqui deixaria a descrição de quinze parceiros truncada sem NENHUMA
            forma de ler o resto — conteúdo inalcançável. A primeira versão desta
            cena tinha esse defeito, e a sonda (`tmp-sonda/p3.mjs`) o pegou junto
            com o botão morto. Na lista o texto entra inteiro e o cartão cresce. */}
        {p.description && (
          <p
            className={
              'mt-3 text-sm leading-relaxed text-white/85' + (naTrilha ? ' line-clamp-4' : '')
            }
          >
            {p.description}
          </p>
        )}

        {p.logo && (
          <div className="mt-6 flex flex-1 items-end" aria-hidden={p.logoAlt ? undefined : true}>
            <div className="flex h-20 w-full items-center justify-center rounded-2xl border border-white/40 bg-white px-6 py-4">
              <Image
                src={p.logo}
                alt={p.logoAlt ?? ''}
                width={240}
                height={80}
                /* `sizes` RECALIBRADO (item 11): a placa deixou de ser a largura
                   de um card de grade e passou a ser a de um painel de até
                   36rem. `lazy` continua nos dezesseis — a maioria nasce fora da
                   janela, na horizontal.
                   ⚠️ Hoje isto não muda o download: `next.config.mjs` está com
                   `images: { unoptimized: true }` (SIS-154), então não há
                   `srcset` e o arquivo do disco é o que baixa. O valor fica
                   correto para o dia em que a otimização voltar — é a SIS-154
                   que decide. */
                loading="lazy"
                sizes="(max-width: 1023px) 80vw, 240px"
                className="max-h-14 w-auto object-contain"
              />
            </div>
          </div>
        )}
        {!p.logo && <div className="flex-1" />}

        {/* ── O GATILHO DO DETALHE ────────────────────────────────────────────
            `<button>` DE VERDADE (item 8): o `<article>` clicável da referência
            não recebe foco, não responde a Enter/Space e não é anunciado como
            controle — o próprio código de referência avisava. `aria-expanded` e
            `aria-controls` moram AQUI, no elemento que é o controle.
            Só aparece quando há descrição: sem ela o detalhe abriria vazio (o
            caso da Addactis, ver o cabeçalho).
            ⚠️ E SÓ NA TRILHA. Na lista o detalhe não é montado — o texto já está
            inteiro no corpo do cartão —, então o botão apontaria `aria-controls`
            para um id inexistente e não abriria nada. Botão morto anunciado como
            controle é pior que a ausência dele; a sonda contou quinze deles na
            primeira versão. */}
        {naTrilha && p.description && (
          <button
            type="button"
            className="mt-5 inline-flex items-center gap-2 self-start rounded-full border border-white/20 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90 transition-colors hover:border-white/50 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ fontFamily: MONO, outlineColor: tone }}
            aria-expanded={estaAberto}
            aria-controls={detalheId}
            onClick={() => setAberto(estaAberto ? null : p.id)}
            /* ── TABULAR NAVEGA A CENA (WCAG 2.4.3 e 2.4.7) ──────────────────
               Defeito medido na primeira volta: os gatilhos dos painéis não
               ativos continuavam na ordem de tabulação, e o navegador NÃO
               conseguia trazê-los para a tela — o botão 8 recebia foco em
               x=2939 e o 14 em x=5387, os dois fora da janela, com o `scrollY`
               parado. É consequência do desenho: a posição do painel é um
               `transform` governado pela ROLAGEM, e o palco é `overflow: clip`,
               então não há contêiner que o navegador possa rolar para revelar o
               elemento focado. Foco invisível é foco perdido.
               A saída é fazer o foco mover a CENA, que é o que a rolagem faria:
               `irPara(i)` é o mesmo salto dos atalhos de categoria, então
               tabular atravessa os dezesseis em ordem e cada um aparece
               centrado. Preferido a `inert` nos não ativos, que resolveria o
               foco fechando o conteúdo para leitor de tela — trocaria um
               problema de acessibilidade por outro.
               Sem `if (i === ativo) return`: o salto para o painel já centrado é
               um `scrollTo` de zero pixel, inofensivo, e a guarda só criaria
               caminho não exercitado. */
            onFocus={() => irPara(i)}
          >
            {estaAberto ? 'fechar' : 'ver detalhe'}
            {estaAberto ? (
              <X className="h-3.5 w-3.5" aria-hidden strokeWidth={2} />
            ) : (
              <ArrowRight className="h-3.5 w-3.5" aria-hidden strokeWidth={2} />
            )}
          </button>
        )}

        {/* O detalhe é ABSOLUTO dentro do painel (ver o CSS): abrir não muda o
            tamanho do painel, então a distância da trilha não muda e a cena não
            pula. Fora da trilha (a lista) o `position: absolute` da regra não se
            aplica, e o mesmo texto já está no corpo — por isso o detalhe só é
            montado na trilha. */}
        {naTrilha && p.description && (
          <div
            id={detalheId}
            className="parceiros-painel-detalhe"
            data-aberto={estaAberto}
            /* `inert` enquanto fechado: `visibility: hidden` já tira do foco na
               maioria dos navegadores, mas `inert` é a garantia declarada — sem
               ele o Tab podia entrar num painel invisível. */
            inert={!estaAberto}
            /* `overflow-y: auto` no CSS torna esta caixa uma região rolável, e
               região rolável sem foco só rola com o mouse. `tabIndex` 0 enquanto
               aberta dá a ela as setas e o Page Up/Down do teclado; fechada ela
               fica fora da tabulação de novo (o `inert` acima já garantiria, mas
               deixar o `tabIndex` só no estado aberto diz a intenção). */
            tabIndex={estaAberto ? 0 : undefined}
          >
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: tone, fontFamily: MONO }}
            >
              {PARTNER_CATEGORIES[p.category].label}
            </span>
            <h4 className="font-display text-xl leading-tight text-white">{p.title}</h4>
            {p.focus && (
              <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: tone }}>
                {p.focus}
              </p>
            )}
            <p className="text-sm leading-relaxed text-white/90">{p.description}</p>
            <button
              type="button"
              className="mt-2 inline-flex items-center gap-2 self-start rounded-full border border-white/20 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90 transition-colors hover:border-white/50 hover:text-white"
              style={{ fontFamily: MONO }}
              onClick={() => setAberto(null)}
            >
              <X className="h-3.5 w-3.5" aria-hidden strokeWidth={2} />
              fechar
            </button>
          </div>
        )}
      </article>
    );
  };

  /* O texto vivo lê o destaque ASSENTADO, não o que está passando (ver a nota do
     `setTimeout` acima). O contador visual continua em `ativo`, porque ali o
     atraso seria percebido como travamento. */
  const atualAnunciado = PARTNERS[anunciado];

  return (
    <>
      {/* ── DESKTOP, MOVIMENTO PERMITIDO: a trilha ───────────────────────────
          As custom properties inline são a ÚNICA ponte entre o dado e o CSS:
          contagem, passo, cauda e a escala do progresso. É por elas que o CSS
          não tem um `16` nem um `520vh` para divergir de `partners.ts`. */}
      <div
        ref={secaoRef}
        className="parceiros-trilha"
        style={
          {
            '--par-n': TOTAL,
            '--par-esc': ESCALA.toFixed(4),
          } as React.CSSProperties
        }
      >
        <div className="parceiros-trilha-palco">
          <header className="container-lp text-center">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ink/60"
              style={{ fontFamily: MONO }}
            >
              {/* Contador `01 / 16`, com a contagem derivada de `PARTNERS.length`. */}
              {String(ativo + 1).padStart(2, '0')}
              <span aria-hidden> / </span>
              <span className="sr-only">de</span>
              {String(TOTAL).padStart(2, '0')}
            </p>
            {/* A troca de destaque é percebida por quem ouve. `polite`, e não
                `assertive`, porque a troca acompanha a rolagem — interromper a
                leitura dezesseis vezes seria pior que o silêncio. */}
            <p className="sr-only" aria-live="polite" aria-atomic="true">
              {atualAnunciado.title} —{' '}
              {PARTNER_CATEGORIES[atualAnunciado.category].label}
            </p>

            {/* A barra de progresso: `scaleX` do MESMO `--par-t` que move a
                trilha, então ela não pode discordar da posição. */}
            <div
              className="mx-auto mt-3 h-px w-40 overflow-hidden bg-ink/15"
              role="progressbar"
              aria-label="Progresso da lista de parceiros"
              aria-valuemin={1}
              aria-valuemax={TOTAL}
              aria-valuenow={ativo + 1}
            >
              <span
                className="parceiros-trilha-barra-preenche block h-full w-full"
                style={{ background: 'linear-gradient(90deg, #0ed8f6, #57B7EE)' }}
              />
            </div>

            <div className="parceiros-trilha-atalhos">
              {atalhos.map((a) => (
                <button
                  key={a.cat}
                  type="button"
                  className="rounded-full border border-ink/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/70 transition-colors hover:border-ink/40 hover:text-ink"
                  style={{ fontFamily: MONO }}
                  onClick={() => irPara(a.i)}
                >
                  {a.label}
                  <span className="sr-only"> — ir para o primeiro parceiro desta categoria</span>
                </button>
              ))}
            </div>
          </header>

          <div className="relative">
            <div className="parceiros-trilha-track">
              {PARTNERS.map((p, i) => painel(p, i, true))}
            </div>
          </div>

          <p
            className="text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-ink/45"
            style={{ fontFamily: MONO }}
          >
            ROLE PARA EXPLORAR
          </p>
        </div>

        {/* AS SENTINELAS. Uma por parceiro: são elas que dão altura à seção e é
            nelas que o observador se prende.
            A faixa sobe para dentro do palco — `-(100 - RECUO)svh` — e é isso que
            faz o percurso do `sticky` e o das sentinelas serem a MESMA caixa, sem
            a divergência que a SIS-156 mediu. O recuo é o mesmo nas duas pontas,
            por construção; a apuração está no bloco de constantes acima.
            `aria-hidden` aqui é o único do arquivo e é legítimo: são caixas
            vazias de medição, sem uma palavra dentro. */}
        <div
          ref={trilhaRef}
          aria-hidden="true"
          style={{
            position: 'relative',
            marginTop: `-${100 - RECUO_SVH}svh`,
            zIndex: 0,
            pointerEvents: 'none',
            paddingBottom: `${RECUO_SVH}svh`,
          }}
        >
          {PARTNERS.map((p, i) => (
            <span
              key={p.id}
              data-parceiro-i={i}
              style={{ display: 'block', height: `${PASSO_SVH}svh` }}
            />
          ))}
        </div>
      </div>

      {/* ── ABAIXO DE 1024px OU COM MOVIMENTO REDUZIDO: os dezesseis em fluxo ─
          Layout COMPLETO, não versão pobre: os dezesseis visíveis, nenhum preso
          em opacidade parcial, sem palco, sem contador e sem atalhos (navegar por
          categoria não faz sentido quando a lista inteira está à vista). */}
      <div className="parceiros-lista container-lp mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PARTNERS.map((p, i) => painel(p, i, false))}
      </div>
    </>
  );
}
