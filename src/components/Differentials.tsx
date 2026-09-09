'use client';

import { DIFFERENTIALS } from '@/data/differentials';
import { getIcon } from '@/lib/icons';
import ScrollReveal from '@/components/ui/ScrollReveal';
import TituloAceso from '@/components/ui/TituloAceso';

/**
 * "Entrega com Alta Performance e Comprometimento" — os quatro valores.
 *
 * Era uma pilha de cartoes presa a rolagem: um wrapper de 400vh, um filho
 * `sticky`, ScrollTrigger do GSAP escrevendo progresso em estado do React e
 * duas arvores diferentes (desktop e mobile) decididas por media query. Isso
 * trazia junto quatro problemas que nao eram de gosto:
 *
 * - o cartao ativo escrevia `text-white` sobre vidro claro, e o titulo da
 *   secao usava `text-ink` — em cima do fundo escuro que aparece enquanto a
 *   pilha esta presa, os dois trocavam de lado e o contraste ia embora;
 * - a numeracao (marca "01 / 04", numero monumental atras e o `id` do item
 *   impresso no pe do cartao) dizia que ha ordem entre os valores, e nao ha;
 * - `solidez-permanencia` era o slug do dado vazando como texto visivel;
 * - quatro telas de rolagem para ler quatro paragrafos curtos.
 *
 * Agora ela segue o padrao das outras secoes de /quem-somos, o mesmo dos
 * "Diferenciais" logo acima: `TituloAceso`, grade de `glass-card notch-card
 * barra-sinal` e entrada por `ScrollReveal`. A escrita é a mesma, palavra por
 * palavra; o que saiu foi so a numeracao e o slug.
 */
export default function Differentials() {
  return (
    <section id="diferenciais" aria-labelledby="entrega-performance" className="section-py">
      <div className="container-lp">
        {/* O destaque é a mesma expressao que o site ja destacava. */}
        <TituloAceso
          id="entrega-performance"
          texto="Entrega com Alta Performance e"
          destaque="Comprometimento"
          className="font-display text-section text-ink"
        />
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">
          Empresas que aderem a tecnologia em seus processos estão sempre a frente no mercado!
        </p>

        <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          {DIFFERENTIALS.map((d, i) => {
            const Icon = getIcon(d.icon);
            return (
              <ScrollReveal
                as="li"
                indice={i}
                key={d.id}
                className="glass-card notch-card barra-sinal flex flex-col p-6 md:p-7"
              >
                {/* Selo do icone igual nos quatro: dois dos tons do dado eram
                    claros demais para viver sobre vidro claro, e a diferenca de
                    cor entre cartoes nao carregava informacao nenhuma. */}
                <span
                  aria-hidden
                  className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{
                    background: 'rgba(14, 216, 246, 0.12)',
                    border: '1px solid rgba(14, 216, 246, 0.3)',
                  }}
                >
                  <Icon className="h-6 w-6" style={{ color: '#004d8a' }} strokeWidth={1.7} />
                </span>
                <h3 className="font-display text-xl leading-snug text-ink">{d.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted md:text-base">
                  {d.description}
                </p>
              </ScrollReveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
