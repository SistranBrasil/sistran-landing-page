'use client';

/**
 * Indicadores de "Resultados", logo abaixo do Método (`#sistema`).
 *
 * Antes eles fechavam o percurso do hero, presos na faixa que o card desocupava
 * no alto da tela. Saíram de lá a pedido: o lugar deles é depois do método, como
 * na apresentação de legado (`MetricsStrip` de `apresentação/site`) — primeiro o
 * método em quatro movimentos, depois as evidências que o comprovam.
 *
 * Inversão de superfície: os cartões são CLAROS sobre a seção navy. A paleta da
 * marca é branco + azuis e não admite cor nova, então o contraste vem de onde
 * pode vir sem inventar hex — a superfície troca de lado.
 *
 * O número anima quando entra na tela (`CountUp`), e o valor lido por leitor de
 * tela é sempre o final. Sem JavaScript ou com movimento reduzido o cartão nasce
 * completo: a contagem é apresentação, nunca conteúdo.
 */

import './legacy.css';
import { motion } from 'motion/react';
import { CountUp } from '@/components/primitives/CountUp';
import { SectionIntro } from './SectionIntro';
import { TechnicalBackdrop } from './TechnicalBackdrop';
import { metrics, metricsIntro } from '@/data/legacy';

export function MetricsStrip() {
  return (
    <section id="resultados-legado" className="lp-section lp-section--dark" aria-labelledby="resultados-legado-title">
      <TechnicalBackdrop density={9} />
      <div className="lp-container" style={{ position: 'relative' }}>
        <SectionIntro
          id="resultados-legado-title"
          kicker={metricsIntro.kicker}
          title={metricsIntro.title}
          text={metricsIntro.text}
        />

        <div className="lp-metrics-grid">
          {metrics.map((metric, index) => (
            <motion.article
              key={metric.label}
              className="lp-metric"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              /* `once`: a entrada é apresentação, e repeti-la a cada passagem
                 chamaria atenção para si em vez de para o número. */
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: index * 0.08 }}
            >
              <p className="lp-metric-value lp-numeric">
                {/* `srText={null}`: o valor completo (número + unidade) vive no
                    `.sr-only` abaixo, então quem ouve escuta "10 dias" uma vez
                    — não o número correndo. */}
                <CountUp value={metric.value} className="lp-metric-count" srText={null} duration={1.1} />
                <span className="lp-metric-unit">{metric.unit}</span>
                <span className="sr-only">
                  {metric.value} {metric.unit}
                </span>
              </p>
              {/* `h3`: o `h2` da seção é o título de `SectionIntro`. */}
              <h3 className="lp-metric-label">{metric.label}</h3>
              <p className="lp-metric-note">{metric.note}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
