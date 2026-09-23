'use client';

/**
 * SIS-280 — «Sobre nós / A Sistran» de `/quem-somos`, refeita no desenho de
 * `docs/sobrenos.md` mais a mock `public/imagensexemplo/sobrenos.png`.
 *
 * ── O QUE SAIU, E POR QUÊ ──
 *
 * Saíram os TRÊS CARTÕES de indicador (`glass-card` com raio 26px, wash de cor no
 * canto, marca de canto em L, trilha de hover e o detalhe em crossfade com a pista
 * «Passe o mouse»). O documento abre a especificação da estrutura com «crie uma
 * seção SEM CARDS INDIVIDUAIS», e a issue repete no escopo («sem cards»). O
 * conteúdo deles não se perdeu: os mesmos 1988 / 150+ / 18, os mesmos rótulos e as
 * mesmas três frases de detalhe agora vivem na faixa navy, separados por régua em
 * vez de por caixa — e o detalhe passou a ser TEXTO VISÍVEL em vez de aparecer só
 * no hover, que é como a mock o mostra e é ganho de acessibilidade de graça (o
 * crossfade dependia de `:hover`/`:focus-within`, e no toque a pista «Passe o
 * mouse» pedia um gesto que não existe).
 *
 * Saíram também os dois `orb` de fundo e a régua horizontal de gradiente com nove
 * pontos: o fundo desta seção passou a ser o declarado no documento (degradê
 * azul-gelo mais grade técnica de 40px), e um orbe ciano de 380px por baixo dele
 * clarearia a grade justamente onde ela deve ser «extremamente discreta».
 *
 * ── O QUE FICOU, E POR QUÊ ──
 *
 * `CountUpNumber` fica inteiro, com o docblock dele: ele é a leitura de dado da
 * casa (SIS-155 reserva a Geist Mono para número), escreve no DOM dentro do `rAF`
 * em vez de chamar `setState` por quadro, e conta TAMBÉM com movimento reduzido
 * porque a contagem é a informação, não o efeito.
 *
 * A ESCRITA É A MESMA, palavra por palavra, com duas exceções declaradas na issue:
 * o parágrafo «Somos uma empresa…» deixa de compartilhar o `<p>` do lead e passa a
 * ser parágrafo próprio (é como a mock o compõe), e «CONHECEMOS SEGUROS» passa a
 * levar o ponto para dentro da frase manuscrita. Nada foi reescrito.
 *
 * ── «CONHECEMOS SEGUROS.» ──
 *
 * Grafada segundo `docs/fonte2.md`, que o pedido em chat nomeia: Kalam, peso 400,
 * `#123B5D`, tombo de −4° e o traço ciano de ~45px desenhado da esquerda para a
 * direita. Os números e o motivo de cada escolha estão em `sobre-nos.css`.
 */

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import CarimboBatida from '@/components/CarimboBatida';
import RevealScope from '@/components/motion/RevealScope';
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

/* Os acentos tipográficos da borda direita da mock. São DECORAÇÃO — `aria-hidden`
   no consumo — e as oito palavras já são ditas na prosa ao lado. */
const ACENTOS_TOPO = ['Tecnologia', 'Pessoas', 'Seguros', 'Resultados'];
const ACENTOS_BASE = ['Mais', 'Seguros', 'Para', 'Pessoas'];

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
}: {
  target: number;
  start: number;
  suffix: string;
  active: boolean;
  color: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  /* A contagem é a informação em si, não um efeito decorativo: roda também com
     movimento reduzido. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!active) {
      el.textContent = `${start}${suffix}`;
      return;
    }
    const dur = 1800;
    const t0 = performance.now();
    let id = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      el.textContent = `${Math.round(start + (target - start) * easeOut(p))}${suffix}`;
      if (p < 1) id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [active, start, target, suffix]);

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
      className="font-mono font-semibold leading-none tabular-nums"
      style={{
        /* SIS-280 — era `clamp(3.25rem, 7.5vw, 6rem)`, a medida de quando o número
           era a peça solitária de um cartão de 26px de raio. Na faixa navy ele
           divide a linha com o ícone de até 52px dentro de um terço da largura, e
           96px ali empurravam «150+» para fora da coluna a 1024. O teto novo é o
           tamanho medido na mock (~72px a 1440). */
        fontSize: 'clamp(2.5rem, 5.2vw, 4.5rem)',
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

export default function About() {
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
    <section id="quem-somos" className="sobre-secao">
      <RevealScope className="sobre-conteudo">
        {/* A COLUNA DA IMAGEM. O carimbo é irmão da foto e não filho dela: a foto
            tem `overflow: hidden` para o recorte funcionar, e um carimbo dentro
            dela seria cortado exatamente na parte que deve sobrar para fora. */}
        <div className="sobre-visual" data-reveal="fade-up">
          <div className="sobre-carimbo-caixa">
            <CarimboBatida
              src="/carimbo-sobre-nos-capsule-outline-0757c7.png"
              alt="Carimbo Sistran — Sobre nós"
              larguraIntrinseca={873}
              alturaIntrinseca={327}
              className="sobre-carimbo"
              /* `viewport` e não `rota`: esta seção nasce abaixo da dobra (a
                 abertura em vídeo da rota vem antes), e bater na montagem seria
                 bater com a peça fora de quadro — quem rolasse até aqui
                 encontraria o carimbo já assentado. É a distinção que o próprio
                 componente documenta. */
              gatilho="viewport"
            />
          </div>
          <div className="sobre-foto">
            <Image
              src="/sobre.png"
              alt="Profissionais da Sistran analisando informações durante uma reunião"
              fill
              /* A coluna da imagem é ~52% do vão útil em telas largas e a largura
                 inteira abaixo de 900px — os dois valores do documento. */
              sizes="(max-width: 900px) 100vw, 52vw"
              className="sobre-foto-arte"
            />
          </div>
        </div>

        {/* A COLUNA DE TEXTO */}
        <div className="sobre-copy" data-reveal="fade-up">
          {/* SIS-280 (2ª passada, a pedido): o título VISÍVEL «A Sistran» saiu
              daqui — a capa da rota já o diz em manchete, logo acima, e repetido a
              uma rolagem de distância ele era o mesmo nome duas vezes.

              O `h2` NÃO foi apagado: virou `sr-only`. A seção é um `<section
              id="quem-somos">` que o `ScrollSpy` lista e para onde a âncora do
              navegador lateral leva — sem cabeçalho ela sairia do sumário do
              documento e chegaria sem nome para quem navega por títulos, o que
              trocaria uma repetição visual por uma perda de estrutura. O texto
              continua o mesmo, palavra por palavra; só deixou de pintar.
              Para voltar a ver: trocar `sr-only` por `sobre-titulo`. */}
          <h2 className="sr-only">A Sistran</h2>

          <p className="sobre-lead">
            Com ampla presença na América do Sul, contando com mais de 150 clientes e 850
            colaboradores, a Sistran é referência em soluções tecnológicas para o setor de
            Seguros.
          </p>

          <p className="sobre-paragrafo">
            Somos uma empresa que entrega soluções em TI de forma inovadora e personalizada,
            transformando ideias em resultados tangíveis.
          </p>

          <p className="sobre-paragrafo">
            Estabelecida em 1988 no Brasil, processamos um terço de todos os prêmios de Seguro de
            Vida no país. Nossas soluções e serviços estão presentes em 18 países, com qualidade e
            confiabilidade. Construímos relacionamentos sólidos e duradouros com o cliente,
            trabalhando no aperfeiçoamento contínuo de tudo que fazemos em benefício dos usuários
            finais.
          </p>

          {/* A citação da mock: barra ciano à esquerda, sem caixa em volta. */}
          <blockquote className="sobre-citacao">
            <p>
              Com profunda especialização em Seguros e sólida compreensão das necessidades do
              mercado, oferecemos também consultoria especializada em inteligência artificial e
              DEVOPS, criando ofertas personalizadas que impulsionam o sucesso das Seguradoras.
              Aqui, realmente
            </p>
            {/* A assinatura manuscrita de `docs/fonte2.md`. Duas linhas por
                `display: block` num `span`: continua UMA frase para leitor de
                tela. */}
            <p className="sobre-assinatura">
              <span className="sobre-assinatura-linha">CONHECEMOS</span>
              <span className="sobre-assinatura-linha">SEGUROS.</span>
              <svg
                aria-hidden
                className="sobre-assinatura-traco"
                viewBox="0 0 45 8"
                focusable="false"
              >
                <path
                  className="sobre-assinatura-risco"
                  pathLength="1"
                  d="M1 6.2C9 3.6 24 2.2 44 1.8"
                />
              </svg>
            </p>
          </blockquote>
        </div>

        {/* Os acentos tipográficos da borda direita da mock. */}
        <div aria-hidden className="sobre-acentos">
          <span className="sobre-acento-grupo">
            {ACENTOS_TOPO.map((p) => (
              <span key={p} className="sobre-acento-palavra">
                {p}
              </span>
            ))}
            <span className="sobre-acento-regua" />
          </span>
          <span className="sobre-acento-grupo">
            {ACENTOS_BASE.map((p) => (
              <span key={`base-${p}`} className="sobre-acento-palavra">
                {p}
              </span>
            ))}
          </span>
        </div>
      </RevealScope>

      {/* ── A FAIXA INSTITUCIONAL NAVY ──────────────────────────────────────────
          `on-dark` não é decoração: a rota monta esta seção dentro de uma
          `div.section-light`, e os overrides de texto sobre fundo claro de
          `globals.css:1099` pintam todo `p` de `#0a1f44` com um seletor de (0,1,1).
          A sonda mediu o rótulo e o detalhe desta faixa saindo NAVY SOBRE NAVY,
          1,07:1 e 1,01:1 — invisíveis. `on-dark` é a classe que a própria casa criou
          para ilha escura dentro de seção clara e devolve o branco com `!important`;
          o número do contador escapa porque leva cor no `style` inline e o override
          de `on-dark` traz `:not([style*="color"])`. */}
      <div ref={railRef} className="sobre-metricas on-dark">
        {/* A aresta em degrau da mock, com a linha ciano e os três pontos. */}
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

        {/* ── QUADRADOS E LINHAS, DINÂMICOS, ATRÁS DOS NÚMEROS ──────────────────
            Pedido em chat para ESTA faixa. É o mesmo motivo de
            `ui/AtmosferaQuadrados.tsx` (SIS-204) — retângulos de canto redondo e
            linhas finas —, mas a peça é OUTRA por duas razões medidas, não por
            gosto: aquela é `position: fixed` na janela inteira com `z-index: -1`,
            então não existe como camada dentro de um bloco; e a tinta dela é
            branco translúcido calibrado para fundo CLARO, que sobre este navy ou
            desaparece ou vira névoa. Aqui a tinta é ciano da marca em alfa baixo.

            O raio 28 e o `vector-effect: non-scaling-stroke` vêm de lá de
            propósito: a forma que a atmosfera da casa usa é esta, e o fio de 1px
            não pode engrossar quando o `slice` escala a arte para cobrir a faixa.

            «NÃO ATRAPALHAR A ESCRITA» é o que decide o resto: a camada é
            `aria-hidden`, não recebe ponteiro, vive em `z-index: 0` enquanto a
            grade de indicadores sobe para `z-index: 1`, e as peças foram postas
            nos VÃOS medidos da faixa — as duas calhas entre as três colunas e as
            margens — em vez de atrás dos glifos. O contraste dos rótulos foi
            remedido pixel a pixel depois dela entrar. */}
        <div aria-hidden className="sobre-atmosfera">
          <svg viewBox="0 0 1440 332" preserveAspectRatio="xMidYMid slice" focusable="false">
            {/* As linhas longas: duas horizontais e as duas verticais que caem nas
                calhas entre as colunas (x=490 e x=950 na grade de 216px de recuo). */}
            <g
              stroke="rgba(120, 214, 245, 0.16)"
              strokeWidth="1"
              fill="none"
              vectorEffect="non-scaling-stroke"
            >
              <path d="M-40 74H1480" vectorEffect="non-scaling-stroke" />
              <path d="M-40 268H1480" vectorEffect="non-scaling-stroke" />
              <path d="M490 -40V372" vectorEffect="non-scaling-stroke" />
              <path d="M950 -40V372" vectorEffect="non-scaling-stroke" />
            </g>

            {/* Os quadrados. Dois grupos com derivas independentes e lentas, para o
                movimento não ler como um bloco só escorregando. */}
            <g
              className="sobre-atmosfera-deriva-a"
              fill="rgba(120, 214, 245, 0.05)"
              stroke="rgba(120, 214, 245, 0.13)"
              strokeWidth="1"
            >
              <rect x="56" y="34" width="150" height="150" rx="28" vectorEffect="non-scaling-stroke" />
              <rect x="1216" y="150" width="190" height="190" rx="28" vectorEffect="non-scaling-stroke" />
              <rect x="560" y="212" width="118" height="118" rx="28" vectorEffect="non-scaling-stroke" />
            </g>
            <g
              className="sobre-atmosfera-deriva-b"
              fill="rgba(120, 214, 245, 0.035)"
              stroke="rgba(120, 214, 245, 0.10)"
              strokeWidth="1"
            >
              <rect x="1020" y="-30" width="164" height="164" rx="28" vectorEffect="non-scaling-stroke" />
              <rect x="300" y="238" width="132" height="132" rx="28" vectorEffect="non-scaling-stroke" />
              <rect x="792" y="12" width="96" height="96" rx="28" vectorEffect="non-scaling-stroke" />
            </g>
          </svg>
        </div>

        <ul className="sobre-metricas-grade">
          {HIGHLIGHTS.map((h) => (
            <li key={h.label} className="sobre-metrica">
              <div className="sobre-metrica-topo">
                <IconeIndicador nome={h.icone} />
                <CountUpNumber
                  target={h.num}
                  start={h.start}
                  suffix={h.suffix}
                  active={countActive}
                  color={h.color}
                />
                {/* Valor real para leitores de tela — o contador é aria-hidden */}
                <span className="sr-only">{h.value}</span>
              </div>
              <p className="sobre-metrica-rotulo">{h.label}</p>
              <p className="sobre-metrica-detalhe">{h.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
