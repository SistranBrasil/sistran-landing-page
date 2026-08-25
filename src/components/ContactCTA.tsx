'use client';

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef } from 'react';
import { vFadeUp, VP, useReducedMotion, prefersReducedMotion } from '@/lib/motion';
import TypewriterOnView from './ui/TypewriterOnView';
import TechnicalCursorReveal from './ui/TechnicalCursorReveal';

type Props = {
  title?: string;
  description?: string;
  /** Opcional: o bloco do site nao tem sobretitulo. */
  eyebrow?: string;
  /**
   * Liga a digitacao do titulo, a entrada encadeada e o grafismo tecnico.
   * Opt-in: o bloco é o mesmo em dez paginas, e o efeito foi pedido somente
   * para o CTA da home, logo antes do rodape.
   */
  motionShowcase?: boolean;
};

/** Encadeamento pedido depois que o titulo termina de ser digitado. */
const ATRASO_PARAGRAFO_MS = 120;
const ATRASO_BOTAO_MS = 100;

/* Bloco final "Fale com a Gente!" da home, verbatim.
   Fonte: .claude/conteudo-site/00-home.md (secao 8) */
export default function ContactCTA({
  eyebrow,
  title = 'Fale com a Gente!',
  description = 'Quer conversar com um de nossos especialistas? Então fale com a gente. Temos uma equipe qualificada para atender as suas necessidades.',
  motionShowcase = false,
}: Props) {
  const rm = useReducedMotion();
  const secaoRef = useRef<HTMLElement>(null);

  /* O encadeamento vive num atributo no cartao, nao em estado do React: o
     servidor e o primeiro render saem SEM o atributo, logo paragrafo e botao
     nascem visiveis, e armar depois nao custa um render novo. A arvore é
     sempre a mesma — muda so o `data-cta-etapa`. */
  const cartaoRef = useRef<HTMLDivElement>(null);
  const etapa = useCallback((valor: string | null) => {
    const cartao = cartaoRef.current;
    if (!cartao) return;
    if (valor) cartao.dataset.ctaEtapa = valor;
    else delete cartao.dataset.ctaEtapa;
  }, []);

  /* Os dois temporizadores do encadeamento ficam num ref para que a limpeza do
     desmonte alcance ambos: sem isso uma etapa chegaria depois da secao sair da
     arvore. */
  const temporizadores = useRef<number[]>([]);

  useEffect(() => {
    if (!motionShowcase || prefersReducedMotion()) return;
    // O array é lido aqui, e nao na limpeza: o ref nunca é reatribuido, entao a
    // mesma lista continua valendo no desmonte.
    const pendentes = temporizadores.current;
    etapa('armado');
    return () => {
      pendentes.forEach((t) => window.clearTimeout(t));
      // Desmontar no meio do encadeamento nao pode deixar nada invisivel.
      etapa(null);
    };
  }, [motionShowcase, etapa]);

  const aoFimDaDigitacao = useCallback(() => {
    temporizadores.current.push(
      window.setTimeout(() => etapa('paragrafo'), ATRASO_PARAGRAFO_MS),
      window.setTimeout(() => etapa('botao'), ATRASO_PARAGRAFO_MS + ATRASO_BOTAO_MS),
    );
  }, [etapa]);

  return (
    <section ref={secaoRef} className="section-py relative overflow-hidden">
      <div className="container-lp">
        <motion.div
          ref={cartaoRef}
          variants={vFadeUp}
          initial={rm ? false : 'hidden'}
          whileInView="visible"
          viewport={VP}
          className="relative overflow-hidden rounded-3xl border border-white/12 p-10 md:p-14"
          style={{
            background:
              'linear-gradient(135deg, rgba(0,77,138,0.9) 0%, rgba(0,121,203,0.75) 50%, rgba(124,58,237,0.5) 100%)',
            boxShadow: '0 30px 80px -30px rgba(0,77,138,0.8)',
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/12 blur-[110px]"
          />
          {motionShowcase && <TechnicalCursorReveal className="tcr-raiz" />}
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              {eyebrow && (
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B8DDF6]">
                  {eyebrow}
                </span>
              )}
              <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-white md:text-4xl">
                {/* O texto do titulo nao muda em nenhum caminho: com o efeito, o
                    TypewriterOnView renderiza a MESMA string em tres camadas
                    sobrepostas; sem o efeito, ela é impressa direto. */}
                {motionShowcase ? (
                  <TypewriterOnView
                    texto={title}
                    gatilhoRef={secaoRef}
                    onFim={aoFimDaDigitacao}
                  />
                ) : (
                  title
                )}
              </h2>
              <p className="cta-entrada cta-entrada-p mt-3 max-w-xl text-base leading-relaxed text-white/85">
                {description}
              </p>
            </div>
            <Link
              href="/#contato"
              className="cta-entrada cta-entrada-b inline-flex flex-none items-center gap-3 self-start rounded-full bg-white px-6 py-3 text-sm font-bold md:self-auto"
              style={{ color: '#0b2550', boxShadow: '0 10px 30px rgba(0,0,0,0.24)' }}
            >
              Fale com a SISTRAN
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
