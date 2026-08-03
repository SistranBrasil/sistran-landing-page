'use client';

import { Sparkles } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

/**
 * Template base para qualquer nova seção seguindo o padrão Sistran Labs.
 * - Root: <section id="..." className="section-py relative overflow-hidden">
 * - Interior: <div className="container-lp">
 * - Header: eyebrow + h2 font-display text-section + p text-ink-muted
 * - Grid de conteúdo em Reveal com delays escalonados.
 */
export default function ExampleSection() {
  return (
    <section id="exemplo" className="section-py relative overflow-hidden">
      <div className="container-lp">
        <Reveal>
          <span className="eyebrow">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={1.8} />
            Rótulo da seção
          </span>
          <h2 className="mt-4 font-display text-section font-bold text-ink">
            Um título com <span className="text-gradient">destaque</span>
          </h2>
          <p className="mt-4 max-w-2xl text-ink-muted">
            Subtítulo executivo, direto ao ponto, tom estratégico.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Reveal key={i} delay={120 * i}>
              <div className="glass-card-hover p-6">
                <h3 className="font-display text-lg font-bold text-ink">
                  Card {i + 1}
                </h3>
                <p className="mt-2 text-sm text-ink-muted">
                  Descrição curta explicando o valor entregue.
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
