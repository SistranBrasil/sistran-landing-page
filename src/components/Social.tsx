'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Linkedin } from 'lucide-react';
import { LINKEDIN_URL } from '@/data/contact';
import { vHeader, vTitle, vSubtitle, VP, useReducedMotion } from '@/lib/motion';

/**
 * Posição do ponteiro publicada na seção como duas custom properties
 * (`--sx`/`--sy`, ambas 0..1), que o CSS consome nas camadas de luz e nos orbs.
 *
 * Escreve no DOM por `ref`, e não por `setState`: um `setState` por
 * `pointermove` re-renderizaria a seção inteira dezenas de vezes por segundo. O
 * evento só guarda o número; quem escreve é um único `requestAnimationFrame`
 * coalescido, então no máximo uma escrita por quadro.
 *
 * O gesto só existe onde há cursor de verdade e movimento é bem-vindo — em toque
 * e em movimento reduzido o listener nem é registrado, e as variáveis ficam no
 * default de repouso (0.5, 0.5) declarado no CSS.
 */
function usePonteiroNaSecao(alvo: React.RefObject<HTMLElement | null>, ativo: boolean) {
  useEffect(() => {
    const el = alvo.current;
    if (!el || !ativo) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let x = 0.5;
    let y = 0.5;
    let quadro = 0;

    const escrever = () => {
      quadro = 0;
      el.style.setProperty('--sx', x.toFixed(4));
      el.style.setProperty('--sy', y.toFixed(4));
    };
    const mover = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x = (e.clientX - r.left) / r.width;
      y = (e.clientY - r.top) / r.height;
      if (!quadro) quadro = requestAnimationFrame(escrever);
    };
    /* Ao sair, volta ao repouso pelo centro — sem isso a luz ficaria parada na
       borda onde o cursor abandonou a seção. */
    const sair = () => {
      x = 0.5;
      y = 0.5;
      if (!quadro) quadro = requestAnimationFrame(escrever);
    };

    el.addEventListener('pointermove', mover);
    el.addEventListener('pointerleave', sair);
    return () => {
      if (quadro) cancelAnimationFrame(quadro);
      el.removeEventListener('pointermove', mover);
      el.removeEventListener('pointerleave', sair);
    };
  }, [alvo, ativo]);
}

export default function Social() {
  const rm = useReducedMotion();
  const palcoRef = useRef<HTMLElement>(null);
  usePonteiroNaSecao(palcoRef, !rm);
  return (
    /* O fundo saiu do `style` inline para `.social-palco` no `globals.css`: as
       camadas de luz precisam ler `--sx`/`--sy`, e o violeta que havia aqui
       (`rgba(124,58,237,0.30)`) não é da marca — virou ciano/azul. */
    <section
      ref={palcoRef}
      id="social"
      className="social-palco relative overflow-hidden py-24 md:py-32"
    >
      {/* Camadas de luz que seguem o ponteiro. Duas, com amplitudes e tempos
          diferentes, para o fundo ganhar profundidade em vez de deslizar em
          bloco. Só `transform` — a posição do gradiente não é animada, o que
          seria repinte a cada quadro. */}
      <div aria-hidden className="social-luz social-luz-a" />
      <div aria-hidden className="social-luz social-luz-b" />
      {/* Ghost background text */}
      <span
        aria-hidden
        className="social-fantasma pointer-events-none absolute inset-x-0 top-1/2 select-none text-center font-display font-black uppercase leading-none"
        style={{
          fontSize: 'clamp(4rem, 18vw, 18rem)',
          letterSpacing: '-0.05em',
          // Sem mix-blend-screen (que apagava tudo no fundo claro) e com
          // contorno: o texto fantasma volta a ser legivel como marca d'agua.
          color: 'rgba(255,255,255,0.05)',
          WebkitTextStroke: '1px rgba(14,216,246,0.20)',
          animation: rm ? undefined : 'gradient-shift 20s ease-in-out infinite',
        }}
      >
        #SomosSistraners
      </span>

      {/* Orbs ambientes. `orb-violet` saiu: violeta não é da marca — o segundo
          orb passa a ser azul. Os dois reagem ao ponteiro em sentidos opostos
          (`.social-orb-a` / `.social-orb-b`), o que separa os planos. */}
      <div
        aria-hidden
        className="orb orb-cyan orb-drift-slow social-orb social-orb-a pointer-events-none absolute -left-24 top-0 h-[480px] w-[480px] opacity-40"
      />
      <div
        aria-hidden
        className="orb orb-blue orb-drift social-orb social-orb-b pointer-events-none absolute -right-24 bottom-0 h-[420px] w-[420px] opacity-30"
      />

      <div className="container-lp relative lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
        <motion.div
          variants={vHeader}
          initial={rm ? false : 'hidden'}
          whileInView="visible"
          viewport={VP}
          className="social-copy max-w-3xl"
        >
          {/* .tag-section (chip com moldura), igual Serviços e Clientes */}
          <motion.span variants={vSubtitle} className="tag-section">
            #sistran
          </motion.span>
          <motion.h2
            variants={vTitle}
            className="mt-5 font-display text-section font-bold text-white"
          >
            Siga a Sistran no LinkedIn{' '}
            <span className="text-gradient-brand">#SomosSistraners</span>
          </motion.h2>
          <motion.p
            variants={vSubtitle}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl"
          >
            Conecte-se ao futuro! Siga nossa página no LinkedIn e fique por dentro das últimas
            tendências e oportunidades do mercado.
          </motion.p>
          <motion.div variants={vSubtitle} className="mt-8">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <Linkedin className="h-4 w-4" strokeWidth={1.8} />
              {/* Rotulo do botao como escrito no site. */}
              Siga nossa página no Linkedin
            </a>
          </motion.div>
        </motion.div>

        {/* Card do LinkedIn com revelação das duas faces. O gesto está todo em
            CSS (`.linkedin-card` no `globals.css`) e não em Motion: hover e
            `:focus-visible` são estados do próprio elemento, e resolvê-los na
            folha de estilo evita um `useState` por evento de ponteiro.

            O card é um link, então o nome acessível vem do conteúdo — sem
            `aria-label`, que faria o leitor de tela ler destino e texto duas
            vezes. Só o ícone é decorativo. */}
        <motion.a
          variants={vSubtitle}
          initial={rm ? false : 'hidden'}
          whileInView="visible"
          viewport={VP}
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="social-card-reativo linkedin-card mt-14 lg:mt-0"
        >
          <span className="linkedin-card-face linkedin-card-frente">
            <Linkedin strokeWidth={1.6} aria-hidden />
            <span className="linkedin-card-frente-rotulo">#SomosSistraners</span>
            <span className="linkedin-card-frente-destino">LinkedIn da Sistran</span>
          </span>
          <span className="linkedin-card-face linkedin-card-verso">
            <span className="linkedin-card-verso-titulo">Conecte-se ao futuro</span>
            <span className="linkedin-card-verso-texto">
              Tendências, vagas e o dia a dia de quem move a tecnologia do mercado de
              seguros.
            </span>
            <span className="linkedin-card-verso-cta">Seguir a Sistran</span>
          </span>
        </motion.a>
      </div>
    </section>
  );
}
