'use client';

/**
 * FaixaIndicadores — SIS-272. A faixa navy de 1988 / 150+ / 18.
 *
 * ── POR QUE ELA EXISTE COMO PEÇA PRÓPRIA ────────────────────────────────────
 *
 * A issue pede que a seção «Números» da HOME leia como esta faixa de `/quem-somos`
 * e dá duas saídas: reusar o CSS/as classes de `sobre-nos.css` OU extrair uma faixa
 * compartilhada — em qualquer caso «sem duplicar o visual à mão». Esta é a segunda
 * saída, escolhida porque o desenho não é só CSS: há DADO (`HIGHLIGHTS`), há três
 * SVGs de ícone, há um contador com `IntersectionObserver` e há a camada de
 * atmosfera. Reusar apenas as classes obrigaria a recopiar tudo isso no nó da home,
 * e é exatamente aí que os dois lados começariam a divergir calados.
 *
 * O CÓDIGO É O MESMO DE ANTES, MOVIDO: cada linha abaixo saiu de `About.tsx`
 * (SIS-280) sem alteração de valor — mesmos literais, mesmas classes `sobre-*`,
 * mesmo `import './sobre-nos.css'`, mesmo `on-dark`, mesma ordem de nós. Isso é o
 * que cumpre «quem-somos Sobre nós não deve regredir»: com `aresta` no default, o
 * DOM que `/quem-somos` renderiza é idêntico ao de antes da extração.
 *
 * As classes NÃO foram renomeadas para `faixa-*`. Renomear significaria mexer nas
 * ~270 linhas de `sobre-nos.css` que descrevem esta faixa (e nas notas medidas que
 * vivem nelas) para não ganhar nada visível — a issue proíbe justamente o retrabalho
 * do visual. O prefixo `sobre-` passa a nomear a FAIXA, não a rota.
 *
 * ── A ESCRITA ───────────────────────────────────────────────────────────────
 *
 * `HIGHLIGHTS` é a fonte única dos três indicadores, e a issue é explícita: a copy
 * da home passa a ser a MESMA da referência, e uma terceira versão não se inventa.
 * Então «150+» aqui vale para as duas rotas — é o número que a faixa de referência
 * mostra, e o `detail` dele é frase do próprio texto do site. A divergência antiga
 * («130» na cópia da home) está registrada em `src/app/page.tsx` e em
 * `ui/HeroPitch.tsx`; resolvê-la é decisão de conteúdo, de uma issue de conteúdo,
 * não desta — e, se vier, muda AQUI e cai nas duas rotas de uma vez, que é o outro
 * ganho de a faixa ser uma só.
 */

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/motion';
import AtmosferaFaixaNavy from '@/components/ui/AtmosferaFaixaNavy';
import { ICONE_POR_VISUAL } from '@/components/ui/impact/ImpactIcones';
import { METRICS } from '@/data/metrics';
import './sobre-nos.css';

/* Numeros e frases da secao "Sobre nós" da pagina A Sistran — nada aqui é
   redacao nova: cada `detail` é uma frase do proprio texto do site.
   Fonte: .claude/conteudo-site/01-a-sistran.md (secao 1) */
const HIGHLIGHTS = [
  {
    value: '1988',
    label: 'Estabelecida no Brasil',
    detail: 'Processamos um terço de todos os prêmios de Seguro de Vida no país.',
    num: 1988,
    suffix: '',
    start: 1900,
    color: '#0ed8f6',
    icone: 'calendario',
  },
  {
    value: '150+',
    label: 'Clientes',
    detail: 'Ampla presença na América do Sul, com mais de 150 clientes e 850 colaboradores.',
    num: 150,
    suffix: '+',
    start: 0,
    color: '#0ed8f6',
    icone: 'pessoas',
  },
  {
    value: '18',
    label: 'Países',
    detail:
      'Nossas soluções e serviços estão presentes em 18 países, com qualidade e confiabilidade.',
    num: 18,
    suffix: '',
    start: 0,
    color: '#0ed8f6',
    icone: 'globo',
  },
] as const;

/* ── OS SETE, NO MESMO DESENHO ────────────────────────────────────────────────
   Correção de curso de 29/09: a home mostra os SETE indicadores institucionais
   («850+ Membros do Grupo Sistran» … «25+ Implantações de Sinistro») desenhados
   NESTA faixa — ícone e número na mesma linha, rótulo em caixa alta, régua de 1px
   entre um e outro, sem moldura de cartão e sem trilho de pontos. É layout da
   faixa com a escrita da `Metrics`, e não a escrita de 1988/150+/18.

   A ESCRITA VEM DE `METRICS`, não daqui. Nenhum literal de conteúdo é escrito
   neste arquivo para os sete: valor, sufixo e rótulo são lidos de
   `src/data/metrics.ts`, que é a fonte já conferida contra a tabela da issue. É o
   que mantém o portão de copy-lock calado — `src/data/` é o lugar onde o extrator
   espera conteúdo, e uma segunda cópia dos sete rótulos aqui entraria no relatório
   como sete textos novos do site.

   SEM `detail`: as sete legendas de contexto estão comentadas uma a uma em
   `metrics.ts` pela Regra Zero, e a issue proíbe inventar legendas novas. Por isso
   `detail` é opcional no tipo abaixo — a faixa de três tem frase, a de sete não, e
   nenhuma das duas ganha texto que não exista na fonte travada.

   O ÍCONE É O QUE A `Metrics` JÁ ATRIBUI, via `ICONE_POR_VISUAL[m.visual]`. Não há
   sete SVGs novos: o mapa é o mesmo que a fileira de sete usava, então os ícones da
   tela não mudam com a troca de layout. `visual` é campo de DADO e não de conteúdo
   (ver a nota longa em `metrics.ts` sobre por que o nome do ícone não mora lá). */
const ITENS_METRICS = METRICS.map((m) => ({
  value: `${m.value}${m.suffix}`,
  label: m.label,
  detail: undefined,
  num: m.value,
  suffix: m.suffix,
  /* Todos partem de 0: o `start: 1900` da faixa de três existe porque «1988» é um
     ANO, e contar um ano desde zero passa por 0743 — nenhum dos sete é ano. */
  start: 0,
  color: '#0ed8f6',
  icone: ICONE_POR_VISUAL[m.visual],
}));

type Item = {
  value: string;
  label: string;
  detail?: string;
  num: number;
  suffix: string;
  start: number;
  color: string;
  /* String = um dos três SVGs desenhados neste arquivo (faixa de três). Componente =
     ícone do mapa da `Metrics` (faixa de sete). Os dois caminhos existem porque os
     três SVGs da mock de `/quem-somos` não estão no mapa da `Metrics`, e trocá-los
     pelos de lá mudaria o desenho daquela rota — que a issue manda não mexer. */
  icone: string | React.ComponentType<{ className?: string; strokeWidth?: number }>;
};

function IconeIndicador({ nome }: { nome: string }) {
  const comum = {
    className: 'sobre-metrica-icone',
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    focusable: 'false' as const,
  };
  if (nome === 'calendario') {
    return (
      <svg {...comum}>
        <rect x="7" y="11" width="34" height="30" rx="5" />
        <path d="M7 20h34M16 6v8M32 6v8" />
        <path d="M15 27h4M22 27h4M29 27h4M15 34h4M22 34h4" />
      </svg>
    );
  }
  if (nome === 'pessoas') {
    return (
      <svg {...comum}>
        <circle cx="24" cy="16" r="6" />
        <path d="M13 40v-3a11 11 0 0 1 22 0v3" />
        <circle cx="9" cy="21" r="4.5" />
        <circle cx="39" cy="21" r="4.5" />
        <path d="M2 38v-2a7.5 7.5 0 0 1 7-7.5M46 38v-2a7.5 7.5 0 0 0-7-7.5" />
      </svg>
    );
  }
  return (
    <svg {...comum}>
      <circle cx="24" cy="24" r="17" />
      <path d="M7 24h34M24 7c4.5 4.6 7 10.7 7 17s-2.5 12.4-7 17c-4.5-4.6-7-10.7-7-17s2.5-12.4 7-17Z" />
    </svg>
  );
}

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Contador crescente. Escreve direto no DOM dentro do rAF em vez de chamar
 * setState por frame — evita ~96 re-renders por número durante a contagem.
 */
function CountUpNumber({
  target,
  start,
  suffix,
  active,
  color,
  emLoop = false,
  atraso = 0,
}: {
  target: number;
  start: number;
  suffix: string;
  active: boolean;
  color: string;
  /** Recontar enquanto a faixa estiver em vista (ver o docblock do efeito). */
  emLoop?: boolean;
  /** Defasagem em ms, para os sete não pularem em bloco. */
  atraso?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const rm = useReducedMotion();

  /* A contagem é a informação em si, não um efeito decorativo: roda também com
     movimento reduzido. É este o «padrão CountUp da casa» que o item 6 da SIS-272
     cita — o número FINAL fica legível com movimento reduzido porque a contagem
     chega ao fim normalmente, e o valor real já está no `<span class="sr-only">`
     ao lado desde o primeiro quadro, sem depender de rAF nenhum. */
  /* ── O LOOP («quero que esses números fiquem se movimentando») ──────────────
     Pedido em chat para a faixa dos sete. A contagem, que rodava UMA vez ao entrar
     em vista, passa a repetir enquanto a faixa estiver visível: conta, para no valor
     final por `PAUSA`, e reconta.

     ⚠️ O VALOR FINAL É O ESTADO DE REPOUSO, e a pausa é bem maior que a contagem
     (3600ms contra 1800ms). Isso não é estética: o número é a INFORMAÇÃO da seção, e
     um dígito em movimento perpétuo não se lê. Dois terços do tempo o texto está
     parado em «850+». Se a pausa fosse curta, a faixa viraria um painel de dígitos
     girando e o dado sairia ilegível — seria movimento no lugar de conteúdo.

     A DEFASAGEM (`atraso`) existe porque sete contadores em uníssono leem como
     falha de renderização, não como efeito. Escalonados de 140 em 140ms, a leitura
     é de uma onda atravessando a faixa.

     ⚠️ COM MOVIMENTO REDUZIDO NÃO HÁ LOOP, e o número fica no valor FINAL, não no
     inicial. A régua é a da casa: movimento que revela conteúdo se preserva, efeito
     se mata — mas matar um efeito nunca pode deixar o conteúdo escondido. Aqui o
     conteúdo é o total, então com `reduce` o nó recebe `target` de uma vez e para.
     Repare que `rm` não decide QUAIS NÓS EXISTEM (o hook nasce `false` no servidor e
     converge depois de hidratar); ele só decide o que este efeito escreve. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!active) {
      el.textContent = `${start}${suffix}`;
      return;
    }
    if (rm) {
      el.textContent = `${target}${suffix}`;
      return;
    }
    const dur = 1800;
    const PAUSA = 3600;
    let id = 0;
    let timer = 0;
    let t0 = performance.now() + atraso;
    const tick = (now: number) => {
      /* Antes de `t0` o nó fica no valor inicial: é a defasagem da onda. */
      const p = Math.min(1, Math.max(0, (now - t0) / dur));
      el.textContent = `${Math.round(start + (target - start) * easeOut(p))}${suffix}`;
      if (p < 1) {
        id = requestAnimationFrame(tick);
        return;
      }
      if (!emLoop) return;
      timer = window.setTimeout(() => {
        t0 = performance.now();
        id = requestAnimationFrame(tick);
      }, PAUSA);
    };
    id = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(id);
      window.clearTimeout(timer);
    };
  }, [active, start, target, suffix, emLoop, atraso, rm]);

  return (
    <span
      ref={ref}
      aria-hidden
      /* SIS-155 — VALOR na camada técnica: `font-display` virou `font-mono`. É o
         número de 96px do bloco, e o papel dele (dado, não escrita) é justamente o
         que a issue reserva para a Mono. */
      /* SIS-155 — `font-semibold` NÃO é ênfase: a utilitária `font-mono` só troca a
         família, e sem peso declarado este nó pedia 400 — peso que o único corte
         carregado da Geist Mono (600) não tem. O navegador servia o 600 e o código
         dizia 400: se um dia entrar um corte 400 na Mono, oito pontos como este
         mudariam de aparência calados. Medido em 600 computado pela sonda. */
      /* `sobre-metrica-valor` — o pulso pedido em chat («que os numeros fiquem se
         movimentando ou pulsando tanto em quem somos quanto home»). A animação inteira
         mora em `sobre-nos.css`, inclusive o escalonamento por `nth-child` e os dois
         canais de movimento reduzido; aqui só entra o gancho. Vale para os DOIS
         conjuntos, que é o que cobre as duas rotas — ver a nota longa na folha sobre
         por que a faixa de três pulsa em vez de recontar. */
      className="sobre-metrica-valor font-mono font-semibold leading-none tabular-nums"
      style={{
        /* SIS-280 — era `clamp(3.25rem, 7.5vw, 6rem)`, a medida de quando o número
           era a peça solitária de um cartão de 26px de raio. Na faixa navy ele
           divide a linha com o ícone de até 52px dentro de um terço da largura, e
           96px ali empurravam «150+» para fora da coluna a 1024. O teto novo é o
           tamanho medido na mock (~72px a 1440). */
        /* ⚠️ O VALOR FICA NUMA VARIÁVEL, e não é preciosismo: este `style` é inline,
           e inline vence qualquer classe. Enquanto o número estava escrito aqui,
           nenhum modificador de CSS conseguia reescalá-lo — a faixa de SETE teria de
           mostrar 72px numa coluna de ~164px a 1440 e o número sairia por fora.
           O fallback é o valor ORIGINAL, byte por byte: quem não declara
           `--sobre-num-tam` (isto é, `/quem-somos` e qualquer consumidor futuro da
           faixa de três) recebe exatamente o que recebia antes desta mudança. */
        fontSize: 'var(--sobre-num-tam, clamp(2.5rem, 5.2vw, 4.5rem))',
        /* Calibrado contra proporcional; em monoespaçada aperta mais, porque o avanço
           já é fixo. Fica: o transbordo deste número foi medido depois da troca. */
        letterSpacing: '-0.05em',
        fontFeatureSettings: '"tnum" 1',
        background: `linear-gradient(135deg, ${color} 0%, #a5f0ff 60%, #ffffff 100%)`,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: 'transparent',
      }}
    >
      {`${start}${suffix}`}
    </span>
  );
}

type Props = {
  /**
   * A aresta em degrau e os três pontos da mock de `/quem-somos`.
   *
   * Default `true` — é assim que a faixa nasceu e é o que mantém aquela rota
   * idêntica. A home passa `false`, e a razão é GEOMÉTRICA, não de gosto: o degrau
   * é um `clip-path: polygon(0 0, 36% 0, 38% 22px, …)` cujas porcentagens, diz a
   * nota em `sobre-nos.css:454`, «acompanham a coluna da foto (54% do vão útil)»,
   * e os três pontos estão em `left: 6% / 30% / 56%` pela mesma régua. Na home não
   * existe foto acima da faixa: o corte diagonal não acompanharia nada, e os 22px
   * vazados mostrariam o fundo do capítulo anterior num talho sem origem.
   */
  aresta?: boolean;
  /** Modificador de encaixe (a home usa `sobre-metricas--avulsa`). */
  className?: string;
  /**
   * Qual conjunto a faixa desenha. O layout é o MESMO nos dois — muda a escrita e,
   * com ela, a escala (ver `.sobre-metricas--sete` em `sobre-nos.css`).
   *
   * `'sobre'` (default) = 1988 / 150+ / 18, com as frases de contexto. É o que
   * `/quem-somos` monta, e o default existe para aquela rota não mudar de nada.
   *
   * `'metricas'` = os sete de `src/data/metrics.ts`, sem frase.
   *
   * ⚠️ POR QUE UM DISCRIMINADOR E NÃO UMA PROP `itens`. Passar os itens de fora
   * seria mais flexível e NÃO COMPILA no caminho que importa: `src/app/page.tsx` é
   * componente de servidor, este arquivo é `'use client'`, e cada item carrega um
   * COMPONENTE de ícone — componentes não atravessam a fronteira servidor→cliente,
   * que só aceita valores serializáveis. Uma string atravessa; a lista, não. Por
   * isso os dois conjuntos se montam aqui dentro.
   */
  fonte?: 'sobre' | 'metricas';
};

export default function FaixaIndicadores({ aresta = true, className, fonte = 'sobre' }: Props) {
  const itens: readonly Item[] = fonte === 'metricas' ? ITENS_METRICS : HIGHLIGHTS;
  const railRef = useRef<HTMLDivElement>(null);
  const [countActive, setCountActive] = useState(false);
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        setCountActive(e.isIntersecting);
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    /* ── A FAIXA INSTITUCIONAL NAVY ──────────────────────────────────────────
        `on-dark` não é decoração: `/quem-somos` monta esta faixa dentro de uma
        `div.section-light`, e os overrides de texto sobre fundo claro de
        `globals.css:1099` pintam todo `p` de `#0a1f44` com um seletor de (0,1,1).
        A sonda mediu o rótulo e o detalhe desta faixa saindo NAVY SOBRE NAVY,
        1,07:1 e 1,01:1 — invisíveis. `on-dark` é a classe que a própria casa criou
        para ilha escura dentro de seção clara e devolve o branco com `!important`;
        o número do contador escapa porque leva cor no `style` inline e o override
        de `on-dark` traz `:not([style*="color"])`.
        Fica também na home, onde não há `.section-light` em volta: ali a classe é
        inócua no pior caso e correta no melhor — ela força BRANCO, que é a cor que
        este navy próprio pede de qualquer modo. */
    <div ref={railRef} className={['sobre-metricas on-dark', className].filter(Boolean).join(' ')}>
      {/* A aresta em degrau da mock, com a linha ciano e os três pontos. */}
      {aresta ? (
        <>
          <svg
            aria-hidden
            className="sobre-metricas-aresta"
            viewBox="0 0 1440 24"
            preserveAspectRatio="none"
            focusable="false"
          >
            <path d="M0 1H518L548 23H1440" />
          </svg>
          <span aria-hidden className="sobre-metricas-ponto" style={{ left: '6%', top: '-3px' }} />
          <span aria-hidden className="sobre-metricas-ponto" style={{ left: '30%', top: '-3px' }} />
          <span aria-hidden className="sobre-metricas-ponto" style={{ left: '56%', top: '19px' }} />
        </>
      ) : null}

      {/* ── QUADRADOS E LINHAS, DINÂMICOS, ATRÁS DOS NÚMEROS ──────────────────
          Pedido em chat para ESTA faixa, e a peça nasceu inline aqui. SAIU PARA
          `ui/AtmosferaFaixaNavy.tsx` sem mudar um valor: «Por que SISTRAN?»
          passou a pedir o mesmo fundo desta faixa, e trinta e cinco linhas de SVG
          com seis retângulos em coordenadas medidas não se copiam — a segunda
          cópia para de acompanhar esta no dia em que alguém mexer numa calha. As
          razões de cada medida (por que não é a `AtmosferaQuadrados` de SIS-204,
          o raio 28, o `non-scaling-stroke`, os dois `z-index`) foram junto com
          ela, no docblock do componente.

          O que continua sendo problema DAQUI: o contraste dos rótulos, remedido
          pixel a pixel depois que ela entrou. A camada não mudou, então a medida
          segue de pé. */}
      <AtmosferaFaixaNavy />

      <ul className="sobre-metricas-grade">
        {itens.map((h, i) => (
          <li key={h.label} className="sobre-metrica">
            <div className="sobre-metrica-topo">
              {typeof h.icone === 'string' ? (
                <IconeIndicador nome={h.icone} />
              ) : (
                /* O traço 1.6 é o mesmo que a fileira de sete usava
                   (`Metrics.tsx:1408`): o padrão do Lucide é 2, e a 2 o traço lê
                   grosso ao lado de um número de peso 600. A classe é a da faixa, e
                   é ela que dá tamanho e cor — o ícone entra no desenho daqui, não
                   traz o de lá. */
                <h.icone className="sobre-metrica-icone" strokeWidth={1.6} />
              )}
              <CountUpNumber
                target={h.num}
                start={h.start}
                suffix={h.suffix}
                active={countActive}
                color={h.color}
                /* Só os sete recontam. A faixa de três de `/quem-somos` conta uma
                   vez, como sempre fez — o pedido foi para esta seção da home, e
                   «1988» recontando sem parar leria como relógio quebrado num número
                   que é ANO, não contagem. */
                emLoop={fonte === 'metricas'}
                atraso={fonte === 'metricas' ? i * 140 : 0}
              />
              {/* Valor real para leitores de tela — o contador é aria-hidden */}
              <span className="sr-only">{h.value}</span>
            </div>
            <p className="sobre-metrica-rotulo">{h.label}</p>
            {/* Condicional, e não `{h.detail}` solto: sem frase, um `<p>` vazio ainda
                ocuparia `margin-top: 0.5rem` mais uma linha de altura, e as sete
                células ganhariam um rodapé em branco que a faixa de três não tem. */}
            {h.detail ? <p className="sobre-metrica-detalhe">{h.detail}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
