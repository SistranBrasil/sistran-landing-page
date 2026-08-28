'use client';

/**
 * Perfil & Posicionamento — "Ecossistema Sistran".
 *
 * Substitui o diagrama de circulos sobrepostos do material antigo por uma
 * composicao navegavel: dois pilares institucionais nas laterais, o trilho de
 * Solucoes no topo, dois modulos de capacidade em volta do nucleo da marca e as
 * conexoes em SVG. A escrita toda vem de `@/data/posicionamento` — aqui nao ha
 * texto literal.
 *
 * Estado: um unico `ativo` (0 | 1); nunca dois modulos acesos. Muda por clique,
 * por teclado (os cartoes SAO botoes, entao Enter/Space vem de graca) e pelo
 * progresso de rolagem da propria secao — sem `sticky` prolongado, para nao
 * mexer no fluxo da pagina: a troca acontece UMA vez, quando o indice derivado
 * do progresso muda.
 *
 * Conexoes: tres SVGs pequenos em vez de um unico esticado sobre o palco. Cada
 * um mora exatamente no vao que representa (trilho -> nucleo, modulo <-> nucleo),
 * entao as pontas caem nos pontos certos em qualquer largura, sem depender de
 * medir o layout em JS — e nenhuma linha atravessa texto.
 *
 * Movimento reduzido: resolvido em CSS (`.eco-*` em globals.css). O componente
 * nunca troca de arvore por preferencia — so estilos —, para a hidratacao nao
 * divergir.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { VP, easeExpo, useReducedMotion } from '@/lib/motion';
import {
  ECO_EYEBROW,
  ECO_MODULOS,
  ECO_NUCLEO,
  ECO_PILAR_CONHECIMENTO,
  ECO_PILAR_VALOR,
  ECO_SOLUCOES,
  ECO_SOLUCOES_TITULO,
  ECO_TITULO,
  type EcoPilar,
} from '@/data/posicionamento';
import './positioning-ecosystem.css';

/* Sequencia de entrada: cada peca tem seu atraso, somando ~1.4s. Sao numeros e
   nao `staggerChildren` porque a ordem pedida atravessa niveis do DOM
   (cabecalho -> pilares -> trilho -> nucleo -> modulos -> progresso). */
const ATRASO = {
  eyebrow: 0,
  titulo: 0.12,
  pilar: 0.28,
  trilho: 0.44,
  nucleo: 0.6,
  modulo: 0.76,
  progresso: 1.0,
} as const;

function entra(delay: number, y = 16, x = 0) {
  return {
    initial: { opacity: 0, y, x },
    whileInView: { opacity: 1, y: 0, x: 0 },
    viewport: VP,
    transition: { duration: 0.55, ease: easeExpo, delay },
  };
}

/** Tres curvas do trilho de Solucoes descendo para o eixo do nucleo. */
function RailLinks() {
  return (
    <div className="eco-rail-links" aria-hidden>
      <svg viewBox="0 0 1000 72" preserveAspectRatio="none" focusable="false">
        <path d="M200 0 C200 44 500 26 500 72" vectorEffect="non-scaling-stroke" />
        <path d="M500 0 L500 72" vectorEffect="non-scaling-stroke" />
        <path d="M800 0 C800 44 500 26 500 72" vectorEffect="non-scaling-stroke" />
        <circle cx="200" cy="2" r="3" />
        <circle cx="500" cy="2" r="3" />
        <circle cx="800" cy="2" r="3" />
      </svg>
    </div>
  );
}

/**
 * Conexao horizontal entre um modulo e o nucleo.
 *
 * `pulso` remonta a linha acesa e a particula (via `key`), o que reinicia as
 * animacoes CSS: é assim que o desenho acontece SO na troca de estado, e nao em
 * laco infinito.
 */
function ModuleLink({
  ativo,
  pulso,
  paraEsquerda,
}: {
  ativo: boolean;
  pulso: number;
  /** A particula caminha do modulo para o nucleo; no lado direito é ao contrario. */
  paraEsquerda: boolean;
}) {
  return (
    <div className={`eco-link ${ativo ? 'is-ativo' : ''}`} aria-hidden>
      <svg viewBox="0 0 120 44" preserveAspectRatio="none" focusable="false">
        <line className="eco-link-base" x1="0" y1="22" x2="120" y2="22" vectorEffect="non-scaling-stroke" />
        {ativo && (
          <line
            key={pulso}
            className="eco-link-ativa"
            x1="0"
            y1="22"
            x2="120"
            y2="22"
            vectorEffect="non-scaling-stroke"
          />
        )}
        <circle className="eco-node" cx="3" cy="22" r="3" />
        <circle className="eco-node" cx="117" cy="22" r="3" />
      </svg>
      {ativo && (
        <span
          key={pulso}
          className={`eco-particula ${paraEsquerda ? 'eco-particula-dir' : 'eco-particula-esq'}`}
        />
      )}
    </div>
  );
}

function Pilar({ dados, lado }: { dados: EcoPilar; lado: 'esq' | 'dir' }) {
  const Icone = dados.icon;
  return (
    <motion.div
      className={`eco-pilar eco-pilar-${lado}`}
      {...entra(ATRASO.pilar, 0, lado === 'esq' ? -18 : 18)}
    >
      <p className="eco-pilar-titulo">
        {dados.linhas.map((linha, i) => (
          <span
            key={linha}
            className={(dados.destaques as readonly number[]).includes(i) ? 'eco-ciano' : undefined}
          >
            {linha}
          </span>
        ))}
      </p>
      <span aria-hidden className="eco-regua" />
      <Icone aria-hidden className="eco-pilar-icone" strokeWidth={1.4} />
      <p className="eco-pilar-texto">{dados.texto}</p>
    </motion.div>
  );
}

export default function PositioningEcosystem() {
  const rm = useReducedMotion();
  const secaoRef = useRef<HTMLElement>(null);
  const [ativo, setAtivo] = useState(0);
  /* Contador de ativacoes: serve de `key` para redesenhar linha e particula. */
  const [pulso, setPulso] = useState(0);
  const ultimoScroll = useRef(0);
  /* Espelho do estado em ref: o guarda de "mudou?" nao pode viver dentro do
     updater de `setAtivo` — o React chama o updater duas vezes em modo estrito e
     o pulso contaria dobrado. */
  const ativoRef = useRef(0);

  const trocar = useCallback((i: number) => {
    if (ativoRef.current === i) return;
    ativoRef.current = i;
    setAtivo(i);
    setPulso((p) => p + 1);
  }, []);

  const { scrollYProgress } = useScroll({
    target: secaoRef,
    offset: ['start 85%', 'end 15%'],
  });

  /* Profundidade: deslocamentos de 3 a 5px presos ao progresso da rolagem, nunca
     ao ponteiro. Com movimento reduzido o valor é fixo em 0. */
  const yGrade = useTransform(scrollYProgress, [0, 1], rm ? [0, 0] : [-3, 3]);
  const yTrilho = useTransform(scrollYProgress, [0, 1], rm ? [0, 0] : [4, -4]);
  const yModulos = useTransform(scrollYProgress, [0, 1], rm ? [0, 0] : [5, -5]);
  const yNucleo = useTransform(scrollYProgress, [0, 1], rm ? [0, 0] : [-3, 3]);

  /* Troca por rolagem: primeira metade da travessia = 01, segunda = 02. O
     `setState` só é chamado quando o indice derivado muda, nao a cada pixel. */
  useEffect(() => {
    const avaliar = (p: number) => {
      const idx = p < 0.5 ? 0 : 1;
      if (idx === ultimoScroll.current) return;
      ultimoScroll.current = idx;
      trocar(idx);
    };
    /* Leitura inicial: quem chega com a pagina ja rolada (recarga, link com
       ancora) precisa do estado certo antes do primeiro evento de rolagem. */
    avaliar(scrollYProgress.get());
    return scrollYProgress.on('change', avaliar);
  }, [scrollYProgress, trocar]);

  const progresso = ((ativo + 1) / ECO_MODULOS.length) * 100;

  return (
    <section
      ref={secaoRef}
      id="posicionamento"
      aria-labelledby="posicionamento-titulo"
      className="eco-secao"
    >
      <motion.div aria-hidden className="eco-grade" style={{ y: yGrade }} />

      <div className="eco-wrap">
        {/* Cabecalho */}
        <header className="eco-header">
          <motion.p className="eco-eyebrow" {...entra(ATRASO.eyebrow, 10)}>
            <span>{ECO_EYEBROW}</span>
          </motion.p>
          <motion.h2 id="posicionamento-titulo" className="eco-titulo" {...entra(ATRASO.titulo)}>
            {ECO_TITULO.inicio} <span className="eco-ciano">{ECO_TITULO.destaque}</span>
          </motion.h2>
        </header>

        <div className="eco-layout">
          <Pilar dados={ECO_PILAR_VALOR} lado="esq" />

          <div className="eco-stage">
            {/* Trilho de Solucoes */}
            <motion.div className="eco-rail" style={{ y: yTrilho }} {...entra(ATRASO.trilho)}>
              <h3 className="eco-rail-titulo">{ECO_SOLUCOES_TITULO}</h3>
              <ul className="eco-rail-grupos">
                {ECO_SOLUCOES.map((g, i) => {
                  const Icone = g.icon;
                  return (
                    <li key={g.titulo} className="eco-rail-grupo">
                      <Icone aria-hidden className="eco-rail-icone" strokeWidth={1.5} />
                      <div>
                        <p className="eco-rail-nome">{g.titulo}</p>
                        <p className="eco-rail-texto">{g.texto}</p>
                      </div>
                      {i < ECO_SOLUCOES.length - 1 && <span aria-hidden className="eco-rail-node" />}
                    </li>
                  );
                })}
              </ul>
            </motion.div>

            <RailLinks />

            {/* Rede: modulo 01 — nucleo — modulo 02.
                No DOM o nucleo vem PRIMEIRO: é a ordem de leitura (a marca, e
                depois as duas frentes) e é exatamente a ordem do mobile. As
                colunas do desktop sao dadas por `grid-column`, sem `order`. */}
            <div className="eco-network">
              <motion.div className="eco-nucleo-cel" style={{ y: yNucleo }} {...entra(ATRASO.nucleo)}>
                <span aria-hidden className="eco-descida" />
                <div key={pulso} className="eco-nucleo">
                  <span aria-hidden className="eco-halo" />
                  <span aria-hidden className="eco-anel eco-anel-1" />
                  <span aria-hidden className="eco-anel eco-anel-2" />
                  <div className="eco-nucleo-disco">
                    <span aria-hidden className="eco-simbolo" />
                    <p className="eco-nucleo-frase">{ECO_NUCLEO.frase}</p>
                  </div>
                </div>
              </motion.div>

              {ECO_MODULOS.map((m, i) => {
                const estaAtivo = ativo === i;
                const link = (
                  <ModuleLink
                    key={`link-${m.indice}`}
                    ativo={estaAtivo}
                    pulso={pulso}
                    paraEsquerda={i === 1}
                  />
                );
                const cartao = (
                  <motion.div
                    key={m.indice}
                    className={`eco-modulo eco-modulo-${m.tipo} ${estaAtivo ? 'is-ativo' : ''}`}
                    style={{ y: yModulos }}
                    {...entra(ATRASO.modulo + i * 0.12)}
                  >
                    <button
                      type="button"
                      className="eco-modulo-head"
                      aria-current={estaAtivo ? 'step' : undefined}
                      onClick={() => trocar(i)}
                    >
                      <span className="eco-modulo-num">{m.indice}</span>
                      <span className="eco-modulo-titulo">{m.titulo}</span>
                      <span aria-hidden className="eco-modulo-seta">
                        <ArrowRight strokeWidth={2} />
                      </span>
                    </button>
                    <ul className="eco-modulo-itens">
                      {m.itens.map((item, j) => {
                        const Icone = item.icon;
                        return (
                          <li
                            key={item.texto}
                            className="eco-item"
                            style={{ ['--eco-i' as string]: j }}
                          >
                            <Icone aria-hidden strokeWidth={1.6} />
                            <span>{item.texto}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </motion.div>
                );

                return i === 0 ? (
                  <div key={m.indice} className="eco-net-cel eco-net-cel-esq">
                    {cartao}
                    {link}
                  </div>
                ) : (
                  <div key={m.indice} className="eco-net-cel eco-net-cel-dir">
                    {link}
                    {cartao}
                  </div>
                );
              })}
            </div>

            {/* Progresso 01 / 02 */}
            <motion.div className="eco-progresso" {...entra(ATRASO.progresso, 10)}>
              <span className="eco-progresso-num">{ECO_MODULOS[ativo].indice}</span>
              <span className="eco-progresso-total">/ {ECO_MODULOS.length.toString().padStart(2, '0')}</span>
              <span aria-hidden className="eco-progresso-trilha">
                <span className="eco-progresso-fill" style={{ width: `${progresso}%` }} />
              </span>
            </motion.div>
          </div>

          <Pilar dados={ECO_PILAR_CONHECIMENTO} lado="dir" />
        </div>
      </div>
    </section>
  );
}
