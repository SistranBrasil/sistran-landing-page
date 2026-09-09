'use client';

import { motion } from 'motion/react';
import { Linkedin } from 'lucide-react';
import { LINKEDIN_URL } from '@/data/contact';
import { vHeader, vTitle, vSubtitle, VP, useReducedMotion } from '@/lib/motion';
import PalcoReativo from '@/components/ui/PalcoReativo';
import CartaoDuasFaces from '@/components/ui/CartaoDuasFaces';

/**
 * SIS-130 — o palco (marca d'água, luzes de ponteiro, orbs, deslize por scroll) e
 * o cartão de duas faces saíram deste arquivo para `ui/PalcoReativo` e
 * `ui/CartaoDuasFaces`, porque o fechamento de `/contato` passou a usar os dois.
 * O que sobrou aqui é só o que é da seção do LinkedIn: a escrita e o botão.
 *
 * `className` continua chegando de fora — o que está ACIMA desta seção muda de
 * página para página e é isso que decide a borda de cima dela:
 *
 * • home — vem de `#contato`, que fecha num azul-claríssimo (#D2E5ED). Quem
 *   recebe o claro é esta seção (`.palco-emenda-de-claro`), porque o fim do
 *   contato tem texto escuro que não admite fundo mais escuro.
 * • /eventos-inovacao e /trabalhe-conosco — vem seção ESCURA. Ali aquele mesmo
 *   degradê claro era uma faixa clara nascendo do nada em cima de navy: é o
 *   "segundo corte" relatado na SIS-107, e a correção foi tornar a emenda de
 *   claro opcional em vez de recalibrá-la.
 */
type Props = { className?: string };

export default function Social({ className }: Props) {
  const rm = useReducedMotion();
  return (
    <PalcoReativo marca="#SomosSistraners" id="social" className={className}>
      <div className="container-lp relative lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
        <motion.div
          variants={vHeader}
          initial={rm ? false : 'hidden'}
          whileInView="visible"
          viewport={VP}
          className="palco-copy max-w-3xl"
        >
          {/* .tag-section (chip com moldura), igual Serviços e Clientes */}
          <motion.span variants={vSubtitle} className="tag-section">
            #sistran
          </motion.span>
          {/* SIS-180 — `text-palco`, e não `text-section`: degrau próprio, um
              passo acima das seções de meio de página e um abaixo do hero. O
              motivo e os três tamanhos medidos estão em `tailwind.config.ts`.
              Só ESTA seção mudou de degrau. O fechamento de /contato
              (`#timeSISTRAN`) continua em `text-section` de propósito: lá o
              título divide a rota com o `PageHero` e com o painel do formulário,
              e subir o degrau dele criaria dois títulos disputando a mesma
              página — o pedido era sobre a seção do LinkedIn. */}
          <motion.h2
            variants={vTitle}
            className="mt-5 font-display text-palco text-white"
          >
            Siga a Sistran no LinkedIn{' '}
            <span className="text-gradient-brand">#SomosSistraners</span>
          </motion.h2>
          {/* SIS-180 — `text-white`, e não `text-white/85`. Não é preferência
              estética: com o véu removido, o fundo sob o parágrafo é o azul da
              base, e a última parada do gradiente (`#1273bc`) contra branco a 85%
              dá 4,08:1 — reprova em AA por si só, com TODAS as luzes apagadas.
              Nenhum confinamento alcança 4,5:1 enquanto a tinta for translúcida;
              branco cheio sobre esse mesmo azul dá 5,00:1. O pedido era
              justamente "escrita branca, maior e mais destacada". */}
          <motion.p
            variants={vSubtitle}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-white md:text-xl"
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

        <CartaoDuasFaces
          href={LINKEDIN_URL}
          externo
          icone={<Linkedin strokeWidth={1.6} aria-hidden />}
          rotulo="#SomosSistraners"
          destino="LinkedIn da Sistran"
          versoTitulo="Conecte-se ao futuro"
          versoTexto="Tendências, vagas e o dia a dia de quem move a tecnologia do mercado de seguros."
          versoCta="Seguir a Sistran"
          className="mt-14 lg:mt-0"
        />
      </div>
    </PalcoReativo>
  );
}
