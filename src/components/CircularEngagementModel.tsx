'use client';

/**
 * Modelos de atuacao — quatro formas de contratacao em orbita (SIS-99).
 *
 * ── Por que deixou de ser uma fila de cartoes numerados ─────────────────────
 * A versao anterior eram quatro `glass-card` com `01`..`04` em cima. A numeracao
 * mentia: Consultoria nao vem "antes" de Outsourcing, e ninguem contrata os
 * quatro em sequencia. Sao modelos de ENGAJAMENTO em volta da mesma capacidade,
 * e a orbita é a unica forma que diz isso sem legenda — quatro estacoes
 * equidistantes de um nucleo, sem inicio e sem fim.
 *
 * ── O React guarda dois ids, e nada mais ────────────────────────────────────
 * `selecionado` (o que persiste, do clique) e `previa` (o que o ponteiro ou o
 * foco esta espiando). O ativo é `previa ?? selecionado`. Tirar o ponteiro apaga
 * a previa e revela de novo a selecao — nunca volta para "Projetos", que é so o
 * valor INICIAL.
 *
 * Todo o visual é CSS lendo `data-ativo` / `data-pos`: elevacao, borda, brilho,
 * luz correndo pela linha radial, lado em que o painel abre. Nao ha um `useState`
 * por quadro em lugar nenhum, e a esfera da orbita nao passa pelo React — ela é
 * um `<animateMotion>` do proprio SVG, percorrendo a MESMA elipse do anel, o que
 * dispensa acertar seno e cosseno a 60fps.
 *
 * ── Duas geometrias, nenhuma distorcao ──────────────────────────────────────
 * Desktop e tablet usam uma elipse larga (perspectiva leve); celular usa um
 * circulo. Sao dois `<svg>` com `viewBox` proprio, trocados por media query —
 * NAO um `viewBox` esticado com `preserveAspectRatio="none"`, que engrossaria o
 * traco num eixo so. As duas artes saem da mesma funcao, entao a geometria existe
 * uma vez.
 *
 * ── Acessibilidade ─────────────────────────────────────────────────────────
 * As estacoes sao `<button>` de verdade: Tab entra, Enter e Espaco selecionam,
 * as setas andam pela orbita. `aria-pressed` diz qual esta selecionado,
 * `aria-label` carrega o nome completo mesmo quando a tela mostra o curto, e o
 * painel é `role="status"` — trocar de modelo é anunciado sem roubar o foco. O
 * estado ativo nunca é so cor: tambem é escala, borda e elevacao.
 */

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { ICONES_MODELOS } from '@/components/ui/ModelosIcones';
import { MODELOS_ATUACAO, MODELO_INICIAL, type ModeloAtuacao } from '@/data/modelosAtuacao';
import './circular-engagement-model.css';

/* ── Geometria ────────────────────────────────────────────────────────────────
   As estacoes ficam no angulo parametrico de 45° de cada quadrante, e a linha
   radial vai dali ate a borda do nucleo NO MESMO angulo parametrico — é o que
   mantem as quatro linhas visualmente radiais numa elipse, onde "45°" de angulo
   real e "45°" de parametro nao coincidem. */
const K = Math.SQRT1_2;
const arr = (n: number) => Number(n.toFixed(2));

type Geometria = {
  w: number;
  h: number;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rxIn: number;
  ryIn: number;
  nucleoRx: number;
  nucleoRy: number;
  /** Raio da esfera que corre a orbita, em unidades do `viewBox`. */
  orbe: number;
};

const LARGO: Geometria = {
  w: 1120,
  h: 600,
  cx: 560,
  cy: 300,
  rx: 330,
  ry: 200,
  rxIn: 262,
  ryIn: 158,
  nucleoRx: 150,
  nucleoRy: 100,
  orbe: 6,
};

const COMPACTO: Geometria = {
  w: 360,
  h: 360,
  cx: 180,
  cy: 180,
  rx: 132,
  ry: 132,
  rxIn: 104,
  ryIn: 104,
  nucleoRx: 60,
  nucleoRy: 60,
  orbe: 5,
};

/** Sinal de cada quadrante, na ordem `data-pos`. */
const QUADRANTE: Record<ModeloAtuacao['posicao'], { sx: number; sy: number }> = {
  'top-left': { sx: -1, sy: -1 },
  'top-right': { sx: 1, sy: -1 },
  'bottom-right': { sx: 1, sy: 1 },
  'bottom-left': { sx: -1, sy: 1 },
};

/** Elipse inteira como `path`, para o `<animateMotion>` da esfera. Dois arcos de
    meia volta: um arco de 360° é degenerado em SVG. */
function caminhoOrbita(g: Geometria) {
  const dir = arr(g.cx + g.rx);
  const esq = arr(g.cx - g.rx);
  return `M ${dir},${g.cy} A ${g.rx},${g.ry} 0 1 1 ${esq},${g.cy} A ${g.rx},${g.ry} 0 1 1 ${dir},${g.cy}`;
}

/* ── Arte ─────────────────────────────────────────────────────────────────────
   Sem interacao e sem estado: `aria-hidden`, porque nada aqui é conteudo. O que
   muda com o modelo ativo sao atributos `data-*` que o CSS le. */
function Palco({ g, variante, ativo }: { g: Geometria; variante: string; ativo: string }) {
  const orbita = useMemo(() => caminhoOrbita(g), [g]);

  return (
    <svg
      aria-hidden
      focusable="false"
      className="cem-arte"
      data-variante={variante}
      viewBox={`0 0 ${g.w} ${g.h}`}
    >
      {/* Anel externo. `pathLength` normalizado em 1000 para o desenho de entrada
          usar o mesmo `stroke-dasharray` nas duas geometrias. */}
      <ellipse
        className="cem-anel"
        cx={g.cx}
        cy={g.cy}
        rx={g.rx}
        ry={g.ry}
        pathLength={1000}
      />
      <ellipse
        className="cem-anel cem-anel--interno"
        cx={g.cx}
        cy={g.cy}
        rx={g.rxIn}
        ry={g.ryIn}
        pathLength={1000}
      />

      {/* Trecho claro do anel, perto da estacao ativa. É a MESMA elipse com um
          traco unico de 200/1000 do perimetro; quem escolhe o quadrante é o
          `stroke-dashoffset`, escrito no CSS a partir do `data-pos` do palco. Um
          arco por quadrante desenhado a mao daria quatro elementos e quatro
          chances de desalinhar. */}
      <ellipse
        className="cem-realce"
        cx={g.cx}
        cy={g.cy}
        rx={g.rx}
        ry={g.ry}
        pathLength={1000}
      />

      {/* Linhas radiais: a de baixo é o trilho apagado, a de cima é a luz que
          corre para o nucleo quando o modelo é ativado. */}
      {MODELOS_ATUACAO.map((m) => {
        const { sx, sy } = QUADRANTE[m.posicao];
        const x1 = arr(g.cx + sx * g.rx * K);
        const y1 = arr(g.cy + sy * g.ry * K);
        const x2 = arr(g.cx + sx * g.nucleoRx * K);
        const y2 = arr(g.cy + sy * g.nucleoRy * K);
        const aceso = ativo === m.id;
        return (
          <g key={m.id} className="cem-radial" data-ativo={aceso}>
            <line className="cem-radial-trilho" x1={x1} y1={y1} x2={x2} y2={y2} />
            {/* Sem `key` extra: a animacao reinicia porque a REGRA passa a casar
                quando `data-ativo` vira `true`, e ela nao repete. */}
            <line
              className="cem-radial-luz"
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              pathLength={100}
            />
          </g>
        );
      })}

      {/* Nucleo: tres camadas de vidro, as duas de baixo deslocadas. */}
      <g className="cem-nucleo-vidro">
        <ellipse
          className="cem-nucleo-camada cem-nucleo-camada--3"
          cx={g.cx}
          cy={g.cy + (variante === 'largo' ? 12 : 8)}
          rx={g.nucleoRx}
          ry={g.nucleoRy}
        />
        <ellipse
          className="cem-nucleo-camada cem-nucleo-camada--2"
          cx={g.cx}
          cy={g.cy + (variante === 'largo' ? 6 : 4)}
          rx={g.nucleoRx}
          ry={g.nucleoRy}
        />
        <ellipse
          className="cem-nucleo-camada cem-nucleo-camada--1"
          cx={g.cx}
          cy={g.cy}
          rx={g.nucleoRx}
          ry={g.nucleoRy}
        />
      </g>

      {/* Esfera da orbita. `<animateMotion>` e nao `@keyframes`: o caminho é o
          mesmo `path` da elipse, entao a esfera nunca sai do anel, e a
          parametrizacao por comprimento de arco do SMIL da velocidade constante
          — girar em CSS exigiria esticar o circulo e depois desesticar a esfera,
          o que so fecha nos polos. Sob movimento reduzido o CSS a esconde. */}
      <circle className="cem-orbe" r={g.orbe}>
        <animateMotion
          dur={variante === 'largo' ? '15s' : '13s'}
          repeatCount="indefinite"
          calcMode="linear"
          path={orbita}
        />
      </circle>
    </svg>
  );
}

/* ── Estacao ──────────────────────────────────────────────────────────────── */
function Estacao({
  modelo,
  ativo,
  selecionado,
  painelId,
  indice,
  onPrevia,
  onSelecionar,
  onNavegar,
  refBotao,
}: {
  modelo: ModeloAtuacao;
  ativo: boolean;
  selecionado: boolean;
  painelId: string;
  indice: number;
  onPrevia: (id: string | null) => void;
  onSelecionar: (id: string) => void;
  onNavegar: (indice: number, tecla: string) => void;
  refBotao: (el: HTMLButtonElement | null) => void;
}) {
  const Icone = ICONES_MODELOS[modelo.icone];

  return (
    <button
      ref={refBotao}
      type="button"
      className="cem-estacao"
      data-pos={modelo.posicao}
      data-ativo={ativo}
      style={{ '--cem-ordem': indice } as React.CSSProperties}
      aria-pressed={selecionado}
      aria-controls={painelId}
      aria-label={modelo.label}
      onPointerEnter={() => onPrevia(modelo.id)}
      onPointerLeave={() => onPrevia(null)}
      onFocus={() => onPrevia(modelo.id)}
      onBlur={() => onPrevia(null)}
      onClick={() => onSelecionar(modelo.id)}
      onKeyDown={(e) => {
        if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
          e.preventDefault();
          onNavegar(indice, e.key);
        }
      }}
    >
      {/* Segunda base: só aparece no estado ativo, e é ela que da a impressao de
          a estacao ter subido do plano em vez de so mudar de cor. */}
      <span className="cem-base cem-base--fundo" aria-hidden />
      <span className="cem-base" aria-hidden />
      <span className="cem-icone" aria-hidden>
        <Icone className="cem-icone-svg" />
      </span>
      {/* `aria-hidden`: o nome já vem pelo `aria-label` do botao, e sem isto o
          leitor de tela diria "Especialistas Alocação de Especialistas". */}
      <span className="cem-label" aria-hidden>
        <span className="cem-label-cheio">{modelo.label}</span>
        {modelo.shortLabel ? (
          <span className="cem-label-curto">{modelo.shortLabel}</span>
        ) : null}
      </span>
    </button>
  );
}

/* ── Secao ────────────────────────────────────────────────────────────────── */
export default function CircularEngagementModel() {
  const tituloId = useId();
  const painelId = useId();
  const secaoRef = useRef<HTMLElement | null>(null);
  const botoesRef = useRef<(HTMLButtonElement | null)[]>([]);

  const [selecionado, setSelecionado] = useState<string>(MODELO_INICIAL);
  const [previa, setPrevia] = useState<string | null>(null);
  const [entrou, setEntrou] = useState(false);

  /* O hover é EMPRESTADO: quando o ponteiro sai, volta o que estava selecionado
     — nunca o valor inicial. */
  const ativoId = previa ?? selecionado;
  const ativo = MODELOS_ATUACAO.find((m) => m.id === ativoId) ?? MODELOS_ATUACAO[0];

  /* Entrada uma vez só, a 25% de visibilidade — mesmo padrao do
     `EssenceAccordion`. O observador se desliga ao disparar: a coreografia nao
     reinicia quando a pessoa rola de volta. */
  useEffect(() => {
    const alvo = secaoRef.current;
    if (!alvo) return;
    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.intersectionRatio >= 0.25) {
          setEntrou(true);
          obs.disconnect();
        }
      },
      { threshold: [0.25] },
    );
    obs.observe(alvo);
    return () => obs.disconnect();
  }, []);

  /** Setas andam pela orbita na ordem visual (sentido horario, a partir do alto
      a esquerda) e SELECIONAM, porque `focus` ja mostra a previa e um foco que
      nao seleciona deixaria o `aria-pressed` mentindo. */
  const navegar = useCallback((indice: number, tecla: string) => {
    const ultimo = MODELOS_ATUACAO.length - 1;
    const destino =
      tecla === 'Home'
        ? 0
        : tecla === 'End'
          ? ultimo
          : tecla === 'ArrowRight' || tecla === 'ArrowDown'
            ? (indice + 1) % MODELOS_ATUACAO.length
            : (indice - 1 + MODELOS_ATUACAO.length) % MODELOS_ATUACAO.length;

    setSelecionado(MODELOS_ATUACAO[destino].id);
    botoesRef.current[destino]?.focus();
  }, []);

  return (
    <section
      ref={secaoRef}
      className="cem-secao section-py"
      aria-labelledby={tituloId}
      data-entrou={entrou ? '1' : '0'}
    >
      <div className="container-lp">
        <header className="cem-cabecalho">
          <p className="cem-eyebrow">Modelos de atuação</p>
          {/* Duas linhas declaradas, e nao medidas: o pedido era o titulo entrando
              "por linhas", e quebrar onde o sentido quebra é melhor do que onde a
              largura da janela decidir. Em telas estreitas cada bloco reflui
              normalmente. */}
          <h2 id={tituloId} className="cem-titulo">
            <span className="cem-titulo-linha">Temos uma abordagem completa de projetos</span>{' '}
            <span className="cem-titulo-linha">para o mercado Segurador</span>
          </h2>
          <p className="cem-dica">Passe o cursor para explorar</p>
        </header>

        <div className="cem-area">
          {/* `data-pos` aqui e nao dentro do SVG: é o palco que sabe qual
              quadrante esta ativo, e é por ele que o CSS decide onde clarear o
              trecho do anel. */}
          <div className="cem-palco" data-pos={ativo.posicao}>
            <Palco g={LARGO} variante="largo" ativo={ativo.id} />
            <Palco g={COMPACTO} variante="compacto" ativo={ativo.id} />

            <p className="cem-nucleo-texto" aria-hidden>
              <span>Abordagem completa</span>
              <span className="cem-nucleo-texto-2">Mercado Segurador</span>
            </p>

            {MODELOS_ATUACAO.map((m, i) => (
              <Estacao
                key={m.id}
                modelo={m}
                indice={i}
                ativo={ativo.id === m.id}
                selecionado={selecionado === m.id}
                painelId={painelId}
                onPrevia={setPrevia}
                onSelecionar={setSelecionado}
                onNavegar={navegar}
                refBotao={(el) => {
                  botoesRef.current[i] = el;
                }}
              />
            ))}
          </div>

          {/* Um unico painel, e um unico `role="status"`. No desktop ele é
              absoluto ao lado da estacao ativa; no celular volta ao fluxo,
              abaixo da orbita. Duplicar o elemento por breakpoint faria o leitor
              de tela anunciar a troca duas vezes. */}
          <div className="cem-painel" id={painelId} role="status" data-pos={ativo.posicao}>
            {/* `key` remonta o conteudo, e é o que reinicia a animacao de troca
                sem `setTimeout` nem classe temporaria. */}
            <div className="cem-painel-corpo" key={ativo.id}>
              <p className="cem-painel-titulo">{ativo.label}</p>
              <p className="cem-painel-texto">{ativo.description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
