'use client';

/**
 * Metrics — "Sistran em números" como scrollytelling horizontal.
 *
 * A rolagem é vertical, como no resto do site; o que anda na horizontal é a
 * trilha, empurrada por `transform` para deixar o indicador da vez no centro da
 * tela. Nunca há barra de rolagem horizontal e não há clique: não é carrossel.
 *
 * Desenho da seção, de cima para baixo: uma faixa clara com o sobretítulo, o
 * título e o marcador `03 / 07`; abaixo dela o palco escuro, separado por uma
 * curva larga (não um corte reto); dentro do palco, uma única curva que passa
 * pelos sete indicadores, e o indicador ativo é a própria lente — anéis
 * incompletos, número monumental e um componente contextual.
 *
 * ── Como o progresso é calculado ────────────────────────────────────────────
 * Um ScrollTrigger só, `scrub: 1`, do topo ao fim da seção alta (padrão da casa:
 * seção alta + interior `sticky`, nunca `pin: true`, que remonta o nó e
 * desalinha com o Lenis). Do progresso saem variáveis CSS escritas no nó do
 * palco — nunca estado React, que a 60 Hz re-renderizaria a seção inteira. O
 * único estado é o índice ativo, que muda sete vezes no percurso todo.
 *
 * ── Estado final é o default ────────────────────────────────────────────────
 * Sem JavaScript, abaixo de 1024px ou com movimento reduzido a seção é a lista
 * completa dos sete indicadores, com os valores finais no HTML. O CSS do
 * scrollytelling vive todo atrás de `[data-dirigindo]`, atributo que só o
 * JavaScript escreve: não existe estado em que a seção fique presa sem quem a
 * dirija.
 */

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import { METRICS } from '@/data/metrics';
import { prefersReducedMotion } from '@/lib/motion';
import ImpactVisual from '@/components/ui/impact/ImpactVisuais';
import {
  CAIXA_A,
  CAIXA_L,
  CURVA_D,
  alturaDoIndicador,
  pontoNaCurva,
  posicaoDoIndicador,
} from '@/components/ui/impact/geometria';

const TOTAL = METRICS.length;

/* ── Partitura ──────────────────────────────────────────────────────────────
   Fracoes do percurso da secao. Numeros com nome, nunca soltos no meio do
   codigo. */
/** Entrada: a curva escura sobe, a grade aparece, o primeiro trecho se desenha. */
const ENTRADA_FIM = 0.14;
/** Trecho em que os sete indicadores se sucedem. Sobra folga no fim para o
    estado de conclusao (path todo aceso, `07 / 07`) antes de liberar a rolagem. */
const ETAPAS_INICIO = 0.16;
const ETAPAS_FIM = 0.94;
/** O pulso aparece no meio da passagem entre dois indicadores e some ao chegar. */
const PULSO_SUBIDA = 0.2;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const doisDigitos = (n: number) => String(n).padStart(2, '0');

/**
 * Contador do indicador.
 *
 * O `CountUp` do projeto nao serve aqui, e a razao é concreta: ele dispara por
 * `useInView`, e nesta secao a trilha é mais larga que a tela — os sete numeros
 * estao TODOS dentro da viewport ao mesmo tempo, entao todos contariam juntos no
 * primeiro quadro. O gatilho certo aqui é "virou o indicador ativo".
 *
 * O MotionValue nasce no valor FINAL: é isso que o servidor renderiza, e é o que
 * fica na tela sem JavaScript ou com movimento reduzido. A contagem so acontece
 * quando o indicador fica ativo, e uma unica vez — voltar e reavancar a rolagem
 * nao reinicia o numero.
 */
function ImpactNumero({ valor, ativo }: { valor: number; ativo: boolean }) {
  const conta = useMotionValue(valor);
  const texto = useTransform(conta, (v) => Math.round(v).toString());
  const jaContou = useRef(false);

  useEffect(() => {
    if (!ativo || jaContou.current) return;
    jaContou.current = true;
    if (prefersReducedMotion()) return;
    conta.set(0);
    const controle = animate(conta, valor, { duration: 1.1, ease: [0.22, 1, 0.36, 1] });
    return () => controle.stop();
  }, [ativo, conta, valor]);

  return (
    <motion.span
      aria-hidden
      className="impact-numero"
      /* Largura reservada pelo numero final: contando 0 -> 850 o texto passa de
         um para tres digitos, e sem a reserva o `+` ao lado escorregaria. */
      style={{ minWidth: `${String(valor).length}ch` }}
    >
      {texto}
    </motion.span>
  );
}

export default function Metrics() {
  /* -1 antes de a rolagem entrar nas etapas; no modo lista fica em 0, e o CSS
     do modo lista ignora `data-estado` de qualquer forma. */
  const [ativo, setAtivo] = useState(0);
  const [dirigindo, setDirigindo] = useState(false);
  const secaoRef = useRef<HTMLElement>(null);
  const palcoRef = useRef<HTMLDivElement>(null);
  const ativoRef = useRef(0);

  /* Mesma decisao do `OfficesScene`: o scrollytelling é de tela larga e sem
     movimento reduzido. A avaliacao vive num efeito porque durante o render o
     valor precisa ser o do servidor. */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const avaliar = () => setDirigindo(mq.matches && !prefersReducedMotion());
    avaliar();
    mq.addEventListener('change', avaliar);
    return () => mq.removeEventListener('change', avaliar);
  }, []);

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
      /* Movimento interno da lente pausado fora da tela: sem isso os aneis
         girariam pela pagina toda, gastando compositor por nada. */
      onToggle: (self) => {
        palco.dataset.visivel = self.isActive ? '1' : '';
      },
      onUpdate: (self) => {
        const p = self.progress;
        palco.style.setProperty('--impact-p', String(p));
        palco.style.setProperty('--impact-entrada', String(clamp01(p / ENTRADA_FIM)));

        /* Posicao continua na sequencia, em indices: 0 = primeiro indicador,
           TOTAL-1 = ultimo. É dela que sai TUDO — deslocamento da trilha, trecho
           aceso da curva, pulso e indice ativo. Um progresso, uma fonte. */
        const etapa =
          clamp01((p - ETAPAS_INICIO) / (ETAPAS_FIM - ETAPAS_INICIO)) * (TOTAL - 1);

        /* Fracao horizontal do centro da tela na caixa da curva: o mesmo
           (i + 0.5) / TOTAL da geometria, agora com i continuo. */
        const pos = (etapa + 0.5) / TOTAL;
        palco.style.setProperty('--impact-pos', String(pos));
        /* O trecho aceso termina no centro da tela: para tras é histórico, para
           frente é só a linha-base. */
        palco.style.setProperty('--impact-aceso', String(pos));

        /* Pulso: só durante a passagem, seguindo a curva, sumindo ao chegar.
           Nao é laco — a opacidade zera nas duas pontas da passagem. */
        const passagem = etapa - Math.floor(etapa);
        const opacidade =
          etapa >= TOTAL - 1
            ? 0
            : passagem < 0.5
              ? clamp01((passagem - 0.05) / PULSO_SUBIDA)
              : clamp01((0.95 - passagem) / PULSO_SUBIDA);
        const ponto = pontoNaCurva(pos);
        palco.style.setProperty('--impact-pulso-x', String(ponto.x));
        palco.style.setProperty('--impact-pulso-y', String(ponto.y));
        palco.style.setProperty('--impact-pulso-op', String(opacidade));

        /* Unica coisa que vira estado React: muda sete vezes na secao inteira. */
        const indice = Math.min(TOTAL - 1, Math.round(etapa));
        if (indice === ativoRef.current) return;
        ativoRef.current = indice;
        setAtivo(indice);
      },
    });

    const atualizar = () => ScrollTrigger.refresh();
    window.addEventListener('resize', atualizar);
    return () => {
      window.removeEventListener('resize', atualizar);
      gatilho.kill();
      delete palco.dataset.visivel;
      for (const nome of [
        '--impact-p',
        '--impact-entrada',
        '--impact-pos',
        '--impact-aceso',
        '--impact-pulso-x',
        '--impact-pulso-y',
        '--impact-pulso-op',
      ]) {
        palco.style.removeProperty(nome);
      }
    };
  }, [dirigindo]);

  return (
    <section
      id="resultados"
      ref={secaoRef}
      className="impact-scroll"
      aria-labelledby="impact-titulo"
      /* O CSS do scrollytelling inteiro pende deste atributo. Sem JavaScript ele
         nunca aparece, e a secao é a lista completa. */
      data-dirigindo={dirigindo ? '1' : undefined}
    >
      <div ref={palcoRef} className="impact-sticky">
        <div className="impact-topo">
          <div className="container-lp impact-topo-inner">
            <div>
              <p className="impact-eyebrow">Sistran em números</p>
              {/* O ponto final em ciano é um `span` proprio: é pontuacao, nao
                  palavra, e nao deve entrar no gradiente do titulo. */}
              <h2 id="impact-titulo" className="impact-titulo">
                Escala que transforma o mercado de seguros
                <span className="impact-ponto">.</span>
              </h2>
            </div>

            {/* Marcador de etapa. O numero em texto é o que cumpre "nao indicar
                o item ativo so por cor"; os pontos sao reforco visual. */}
            <div className="impact-marcador">
              <p className="impact-marcador-num">
                <span className="impact-marcador-atual">{doisDigitos(ativo + 1)}</span>
                <span aria-hidden> / </span>
                <span className="impact-marcador-total">{doisDigitos(TOTAL)}</span>
              </p>
              <div aria-hidden className="impact-trilho">
                <span className="impact-trilho-aceso" />
                {METRICS.map((m, i) => (
                  <span
                    key={m.id}
                    className="impact-trilho-ponto"
                    data-estado={i === ativo ? 'ativo' : i < ativo ? 'feito' : 'proximo'}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="impact-palco">
          {/* Fronteira claro/escuro em curva larga e organica — nao chanfro (o
              `NotchDivider` do projeto) e nao linha reta. O preenchimento é a cor
              clara: o que sobra abaixo da curva é o palco. */}
          <svg
            aria-hidden
            className="impact-borda"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <path d="M0 0 H1440 V44 C 1180 96 980 22 720 52 C 470 80 250 118 0 74 Z" />
          </svg>

          <span aria-hidden className="impact-grade" />

          <div className="impact-track">
            {/* Duas camadas sobre o MESMO `d`: linha-base e trecho aceso. O
                aceso é revelado por `clip-path` a partir de `--impact-aceso`, e
                nao por `stroke-dasharray`: a caixa é esticada com
                `preserveAspectRatio="none"` e o traco usa
                `non-scaling-stroke`, combinacao em que o comprimento do dash nao
                corresponde ao comprimento visivel. O corte é exato. */}
            <svg
              aria-hidden
              className="impact-curva"
              viewBox={`0 0 ${CAIXA_L} ${CAIXA_A}`}
              preserveAspectRatio="none"
            >
              <path className="impact-curva-base" d={CURVA_D} vectorEffect="non-scaling-stroke" />
            </svg>
            <div aria-hidden className="impact-curva-recorte">
              <svg
                className="impact-curva"
                viewBox={`0 0 ${CAIXA_L} ${CAIXA_A}`}
                preserveAspectRatio="none"
              >
                <path className="impact-curva-viva" d={CURVA_D} vectorEffect="non-scaling-stroke" />
              </svg>
            </div>

            <span aria-hidden className="impact-pulso" />

            <ol className="impact-lista" aria-label="Indicadores institucionais da Sistran">
              {METRICS.map((m, i) => (
                <li
                  key={m.id}
                  className="impact-item"
                  data-estado={i === ativo ? 'ativo' : i < ativo ? 'feito' : 'proximo'}
                  /* Posicao vai por variavel, nao por `left`/`top` inline: estilo
                     inline venceria o CSS do modo lista, e ai a lista vertical
                     nasceria com os itens espalhados. */
                  style={
                    {
                      '--impact-x': posicaoDoIndicador(i, TOTAL),
                      '--impact-y': alturaDoIndicador(i),
                    } as React.CSSProperties
                  }
                >
                  <span aria-hidden className="impact-no" />

                  {/* A lente: aneis incompletos, ticks radiais e o contextual.
                      Centro transparente — o numero fica por cima dela. */}
                  <span aria-hidden className="impact-lente">
                    <svg className="impact-aneis" viewBox="0 0 200 200" focusable="false">
                      <path className="impact-anel impact-anel-1" d="M100 14 A 86 86 0 0 1 186 100" />
                      <path className="impact-anel impact-anel-1" d="M100 186 A 86 86 0 0 1 14 100" />
                      <path className="impact-anel impact-anel-2" d="M28 128 A 76 76 0 0 0 172 128" />
                      <path className="impact-anel impact-anel-2" d="M172 72 A 76 76 0 0 0 28 72" />
                      <g className="impact-ticks">
                        {Array.from({ length: 36 }, (_, t) => {
                          const a = (t / 36) * Math.PI * 2;
                          const r1 = 92;
                          const r2 = 92 + (t % 3 === 0 ? 7 : 3.5);
                          return (
                            <line
                              key={t}
                              x1={100 + Math.cos(a) * r1}
                              y1={100 + Math.sin(a) * r1}
                              x2={100 + Math.cos(a) * r2}
                              y2={100 + Math.sin(a) * r2}
                            />
                          );
                        })}
                      </g>
                    </svg>
                    <span className="impact-contextual">
                      <ImpactVisual nome={m.visual} />
                    </span>
                  </span>

                  <p className="impact-indice">
                    <span aria-hidden>{doisDigitos(i + 1)}</span>
                    <span className="sr-only">Indicador {i + 1} de {TOTAL}</span>
                  </p>

                  <p className="impact-valor">
                    <ImpactNumero valor={m.value} ativo={i === ativo} />
                    {/* Fora da contagem de proposito: dentro dela o `+` entraria
                        no MotionValue e piscaria a cada quadro. */}
                    <span aria-hidden className="impact-mais">
                      {m.suffix}
                    </span>
                    <span className="sr-only">
                      {m.value}
                      {m.suffix}
                    </span>
                  </p>

                  <p className="impact-rotulo">{m.label}</p>
                  <p className="impact-caption">{m.caption}</p>
                </li>
              ))}
            </ol>
          </div>

          <span aria-hidden className="impact-vinheta" />
        </div>
      </div>
    </section>
  );
}
