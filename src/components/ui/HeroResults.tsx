'use client';

import { type MotionValue, motion, useTransform } from 'motion/react';
import { useReducedMotion } from '@/lib/motion';
import { CountUp } from '@/components/primitives/CountUp';
import { HERO_RESULTS, HERO_RESULTS_INTRO } from '@/data/heroResults';

/**
 * Indicadores de "Resultados" no fim do percurso do hero.
 *
 * Vem da apresentacao de legado, onde eram uma secao propria. Aqui eles fecham o
 * hero: a cena de video recua e vira card, e é na faixa que o card desocupa no
 * alto da tela que os numeros entram.
 *
 * O relogio é o MESMO `scrollYProgress` do hero — nao um gatilho proprio. Por
 * isso a entrada nao pode brigar com a saida da cena: a partitura do hero é
 * legendas 0 -> 0.55, pastilha saindo 0.55 -> 0.78, card fechando 0.62 -> 0.96 e
 * descendo 0.84 -> 1. Os indicadores comecam depois de o card ja ter descido o
 * bastante para liberar o alto.
 *
 * A camada é `sticky` com `margin-bottom: -100svh`, o mesmo arranjo da folha
 * clara: ela divide a vaga da cena em vez de somar altura ao percurso.
 *
 * Sem JavaScript, abaixo de 1024px ou com movimento reduzido nada disto é
 * requisito: o CSS deixa o bloco em fluxo normal, opaco e completo, com as notas
 * de cada indicador — que é o estado final de qualquer forma.
 */

/* Fracoes do percurso do hero. O card fecha em 0.96 e desce entre 0.84 e 1: os
   numeros entram dentro dessa descida, para o alto da tela nunca ficar vazio nem
   disputado. */
const ENTRADA_INICIO = 0.86;
const ENTRADA_FIM = 0.95;

type Props = {
  /** `scrollYProgress` do hero. Relogio unico — ver o comentario acima. */
  progress: MotionValue<number>;
};

export default function HeroResults({ progress }: Props) {
  const rm = useReducedMotion();

  const opacity = useTransform(progress, [ENTRADA_INICIO, ENTRADA_FIM], [0, 1]);
  /* Sobe 2.5rem, nao mais: é uma entrada, nao um deslocamento que chame atencao
     para si. `transform`, entao nao move layout. */
  const y = useTransform(progress, [ENTRADA_INICIO, ENTRADA_FIM], ['2.5rem', '0rem']);

  return (
    <motion.aside
      className="hero-results"
      aria-labelledby="hero-resultados-titulo"
      style={rm ? undefined : { opacity, y, willChange: 'transform, opacity' }}
    >
      <div className="hero-results-inner container-lp">
        <p className="hero-results-kicker">{HERO_RESULTS_INTRO.kicker}</p>
        {/* `h2` de proposito: o `h1` da home é o do hero, que continua no lugar
            (invisivel, mas presente). */}
        <h2 id="hero-resultados-titulo" className="hero-results-titulo">
          {HERO_RESULTS_INTRO.title}
        </h2>
        <p className="hero-results-texto">{HERO_RESULTS_INTRO.text}</p>

        <ol className="hero-results-lista">
          {HERO_RESULTS.map((r) => (
            <li className="hero-results-item" key={r.label}>
              <p className="hero-results-valor">
                {/* O valor completo (numero + unidade) vive no `.sr-only` que o
                    proprio `CountUp` desliga aqui: quem le por leitor de tela
                    ouve "10 dias" uma vez, nao o numero correndo. */}
                <CountUp value={r.value} srText={null} duration={1.1} />
                <span className="hero-results-unidade">{r.unit}</span>
                <span className="sr-only">
                  {r.value} {r.unit}
                </span>
              </p>
              <p className="hero-results-rotulo">{r.label}</p>
              {/* A nota é o que cumpre a promessa do texto de abertura ("devem
                  ser lidos com seu contexto"). Sem ela o numero grande fica sem
                  o escopo que o torna verdadeiro. */}
              <p className="hero-results-nota">{r.note}</p>
            </li>
          ))}
        </ol>
      </div>
    </motion.aside>
  );
}
