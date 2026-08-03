'use client';

import { ArrowRight, Rocket, Sparkles, Zap } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

/**
 * Página exemplo mínima para validar visualmente o padrão Sistran Labs.
 * Estrutura: Hero (dark) → Features (light) → CTA (dark).
 * Copiar para src/app/page.tsx (ou nova rota) como ponto de partida.
 */
export default function ExamplePage() {
  return (
    <main>
      {/* HERO */}
      <section id="top" className="relative flex min-h-screen items-center overflow-hidden pt-24">
        <div className="container-lp grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <span className="eyebrow">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.8} />
              Novo produto
            </span>
            <h1 className="mt-4 font-display text-hero font-black text-ink">
              Construa mais rápido com <span className="text-gradient">o padrão Sistran</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink-muted">
              Uma base pronta em Next 14 + Tailwind com identidade visual navy/violet,
              glass cards e animações suaves. Componentes reutilizáveis e dados tipados.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#features" className="btn-primary">
                Ver recursos
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </a>
              <a href="#cta" className="btn-ghost">Falar com o time</a>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div className="glass-card-hover p-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl"
                   style={{ background: '#0079CB14', border: '1px solid #0079CB40' }}>
                <Zap className="h-7 w-7" style={{ color: '#0099E6' }} strokeWidth={1.8} />
              </div>
              <h3 className="font-display text-2xl font-bold text-ink">
                Pré-configurado
              </h3>
              <p className="mt-3 text-ink-muted">
                Tokens, utilities e componentes já alinhados com a marca — comece pelo conteúdo,
                não pelo CSS.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FEATURES (light) */}
      <div className="section-light">
        <section id="features" className="section-py relative overflow-hidden">
          <div className="container-lp">
            <Reveal>
              <span className="eyebrow">
                <Rocket className="h-3.5 w-3.5" strokeWidth={1.8} />
                Recursos
              </span>
              <h2 className="mt-4 font-display text-section font-bold">
                Tudo que uma LP executiva precisa
              </h2>
              <p className="mt-4 max-w-2xl">
                Da tipografia fluida ao ritmo dark/light das seções, cada peça já está no lugar.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                { title: 'Design tokens', desc: 'Paleta, tipografia e sombras em Tailwind + CSS vars.' },
                { title: 'Componentes prontos', desc: 'Hero, cards, pills, botões e reveals.' },
                { title: 'Motion sutil', desc: 'Reveal-on-scroll, count-up e float — respeitando reduced-motion.' },
              ].map((f, i) => (
                <Reveal key={f.title} delay={120 * i}>
                  <div
                    className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                    style={{
                      background: 'rgba(255,255,255,0.88)',
                      border: '1px solid rgba(120,201,248,0.22)',
                      boxShadow: '0 8px 32px -8px rgba(0,121,203,0.12)',
                    }}
                  >
                    <h3 className="font-display text-lg font-bold">{f.title}</h3>
                    <p className="mt-2 text-sm">{f.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* CTA (dark) */}
      <section id="cta" className="section-py relative overflow-hidden">
        <div className="container-lp text-center">
          <Reveal>
            <h2 className="mx-auto max-w-3xl font-display text-section font-bold text-ink">
              Pronto para começar?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-muted">
              Copie a skill, escolha os dados, publique.
            </p>
            <a href="#top" className="btn-primary mt-8">
              Começar agora
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
