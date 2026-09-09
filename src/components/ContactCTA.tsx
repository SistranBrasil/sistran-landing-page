'use client';

import { motion } from 'motion/react';
import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { vFadeUp, VP, useReducedMotion, prefersReducedMotion } from '@/lib/motion';
import TypewriterOnView from './ui/TypewriterOnView';
import TechnicalCursorReveal from './ui/TechnicalCursorReveal';
import ContactModal from './ContactModal';

type Props = {
  title?: string;
  description?: string;
  /** Opcional: o bloco do site nao tem sobretitulo. */
  eyebrow?: string;
  /**
   * Liga a digitacao do titulo, a entrada encadeada e o grafismo tecnico.
   * Opt-in: o bloco é o mesmo em OITO paginas, e o efeito foi pedido somente
   * para o CTA da home, logo antes do rodape.
   *
   * A CONTAGEM DESTE ARQUIVO, num lugar só, porque ela aparece em cinco notas aqui
   * e envelheceu duas vezes: são dez chamadas de `<ContactCTA>` no repositório,
   * DUAS COMENTADAS — a da home (SIS-54) e a de `/eventos-inovacao` (SIS-152).
   * Logo OITO telas montam o bloco hoje, e SETE delas usam o `<Link>` (só `/esg`
   * usa o modal, via `contatoNoModal`). Conferido com `grep '<ContactCTA' src/app`;
   * quem comentar ou religar mais uma tem de reconferir aqui.
   */
  motionShowcase?: boolean;
  /**
   * Classe extra na `<section>`. Existe para EMENDA DE COR: este bloco é o mesmo
   * em oito páginas e a seção acima dele muda em cada uma, então quem sabe qual
   * cor precisa ser recebida no topo é a rota, não o componente.
   */
  className?: string;
  /**
   * SIS-142 · item 1 — o azul claro ATRÁS do cartão, como halo dentro da
   * `<section>`, não como superfície do cartão. Opt-in, desligado por padrão:
   * são oito telas montando este bloco e o pedido é de uma.
   *
   * A issue manda registrar qual dos dois desenhos é: é o (b). O item 1 pede
   * "azul clarinho **atrás** do bloco", e ler ao pé da letra é também a escolha
   * mais barata em contraste — trocar o degradê do cartão por azul claro
   * obrigaria a repintar `h2`, parágrafo e sobretítulo (o ponto de atenção 3) e
   * a remedir tudo, para chegar no mesmo efeito visual de "não fecha mais no
   * navy chapado".
   *
   * Uma ressalva medida, para não repetir o erro: o halo NÃO é neutro em
   * contraste, como esta nota dizia antes. O fundo do cartão é translúcido, então
   * luz colocada atrás da área dele atravessa e clareia o fundo do texto — com o
   * halo centrado o `h2` caiu para 2,1:1. Por isso o `.cta-halo-claro` acende só
   * acima e abaixo do cartão, e aí as medidas ficam melhores que as de hoje
   * (h2 4,66:1 e parágrafo 3,98:1, contra 4,09 e 3,33 nas telas intocadas). Ver o
   * comentário do `.cta-halo-claro` no `globals.css`.
   */
  haloClaro?: boolean;
  /**
   * SIS-142 · itens 2 e 3 — o cartão reage ao ponteiro e ganha o grafismo
   * técnico. Opt-in pelo mesmo motivo. Ver `.cta-reativo` no `globals.css`.
   */
  reativo?: boolean;
  /**
   * SIS-142 · item 4 — o botão deixa de ser `<Link href="/#contato">` e passa a
   * ser `<button>` que abre o `ContactModal` que já existe. Opt-in: nas outras
   * SETE telas o botão continua sendo o link de hoje, byte por byte.
   */
  contatoNoModal?: boolean;
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
  className,
  haloClaro = false,
  reativo = false,
  contatoNoModal = false,
}: Props) {
  const rm = useReducedMotion();
  /* SIS-142 · item 4 — o estado do modal vive AQUI, e não na rota. O ponto de
     atenção 6 sugere o contrário (a rota monta o `ContactModal` e o componente
     recebe um `onContato`), e a razão dada é "respeitar o ponto 1", isto é, não
     mexer nas oito telas. Esta versão respeita o ponto 1 do mesmo jeito, porque a
     prop nasce desligada e o `<Link>` de hoje continua sendo o caminho das outras
     sete. O que o caminho da rota custaria a mais: `src/app/esg/page.tsx` é
     componente de servidor, então montar um `<dialog>` lá exigiria criar um
     invólucro `'use client'` só para segurar um booleano — arquivo novo, uma
     fronteira de cliente nova, para um estado que este componente (que já é
     `'use client'`) segura sem nada. Nenhum `<dialog>` novo é criado: o
     `ContactModal` é o mesmo do `Header.tsx:594`. */
  const [modalAberto, setModalAberto] = useState(false);
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
    <section
      ref={secaoRef}
      className={clsx('section-py relative overflow-hidden', haloClaro && 'cta-halo-claro', className)}
    >
      {/* SIS-142 — o realce de ponteiro NÃO pode morar no `motion.div`: a entrada
          dele escreve `transform` EM LINHA (o `vFadeUp` deixa `transform: none`
          ao terminar), e estilo em linha vence regra de classe. A primeira versão
          disto tinha `.cta-reativo` no próprio cartão e o hover não mexia um pixel
          — medido no navegador, `transform` continuava `none` com o ponteiro em
          cima. Daí o invólucro: quem levanta é ele, que não tem estilo em linha
          nenhum; o cartão continua dono da sua entrada. É a mesma armadilha de
          cascata já registrada em `.esg-apoio > :first-child` na SIS-140 (animação
          rodando vence declaração normal de `transform`), agora na versão "em
          linha vence classe".
          O invólucro só existe quando `reativo` está ligado, para as outras sete
          telas não ganharem nem um `<div>` a mais. */}
      <div className={clsx('container-lp', reativo && 'cta-reativo')}>
        <motion.div
          ref={cartaoRef}
          variants={vFadeUp}
          initial={rm ? false : 'hidden'}
          whileInView="visible"
          viewport={VP}
          className={clsx(
            'relative overflow-hidden rounded-3xl border border-white/12 p-10 md:p-14',
            reativo && 'cta-reativo-cartao',
          )}
          style={{
            /* A terceira parada do degradê era `rgba(124,58,237,0.5)`, violeta.
               A paleta da marca é branco + azuis e não admite roxo
               (`.claude/skills/sistran-marca`) — trocada pelo ciano da marca na
               mesma opacidade: o cartão continua clareando na diagonal, dentro
               da família de cor certa.

               SIS-157 — O DEGRADÊ ESCURECEU, e é a tinta que NÃO mudou.
               O valor de antes, guardado inteiro porque é ele que a issue mede:
               | 'linear-gradient(135deg, rgba(0,77,138,0.9) 0%, rgba(0,121,203,0.75) 50%, rgba(14,216,246,0.5) 100%)'
               Com ele o parágrafo (`text-white/85`, 16px) media 3,30:1 no pior
               pixel a 1440 — piso AA de texto normal é 4,5:1. O culpado era a
               TERCEIRA parada: o ciano a 0,5 clareia o canto inferior direito
               justamente onde o parágrafo termina. Consertar pela tinta não
               resolve — a própria issue registra que branco puro chega a ~3,8:1
               ali, e subir a tinta ainda por cima apagaria a hierarquia entre
               `h2` (branco) e apoio (branco/85).
               O que mudou, então, foram as três paradas, sempre para baixo e
               dentro de branco + azuis da marca (nada de roxo, e o ciano
               continua na terceira parada — só mais escuro e mais transparente,
               de `14,216,246 @ 0,5` para `14,160,220 @ 0,35`). O cartão continua
               clareando na diagonal; clareia menos.

               MEDIDO, não estimado, com `p157.mjs` pelo método de
               `docs/medidas/COMO-MEDIR-CONTRASTE.md` (1440×900, `header.fixed` e
               avisos do `next dev` escondidos, tinta do bloco de texto INTEIRO
               apagada com `color: transparent`, pior pixel do retângulo do
               elemento, mínimo entre seis quadros depois de 3,5s de
               assentamento, alfa 0,85 composto sobre cada pixel de fundo):

                 rota                  parágrafo (piso 4,5)   h2 (piso 3,0, 36px)
                 /solucoes             3,30 → 4,80  pior pixel rgb(7,102,171)
                 /solucoes/[slug]      3,30 → 4,80
                 /sistran-university   3,30 → 4,80
                 /sistran-labs         3,30 → 4,80
                 /blog                 3,30 → 4,80
                 /blog/[slug]          3,30 → 4,80
                 /quem-somos           3,30 → 4,80
                 /esg                  3,97 → 5,45  pior pixel rgb(5,93,157)
                 e o `h2`, que não podia piorar: 4,20 → 6,43 nas sete, e
                 4,66 → 6,26 em `/esg` (onde o halo da SIS-142 muda o fundo).

               SÃO OITO TELAS, e não dez como a issue conta: a chamada da home e a
               de `/eventos-inovacao` estão comentadas (SIS-54 e SIS-152) e não
               chegam ao DOM — é a mesma contagem que já está escrita no alto
               deste arquivo. Quando qualquer uma das duas for religada, ela
               herda este degradê e não precisa de medida nova: o pior pixel do
               parágrafo é do cartão, não da seção acima. */
            background:
              'linear-gradient(135deg, rgba(0,62,118,0.95) 0%, rgba(0,88,155,0.9) 50%, rgba(14,160,220,0.35) 100%)',
            boxShadow: '0 30px 80px -30px rgba(0,77,138,0.8)',
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/12 blur-[110px]"
          />
          {/* SIS-142 · ponto de atenção 5 cumprido ao pé da letra: o efeito de
              ponteiro NÃO é novo. É o `TechnicalCursorReveal` que já estava neste
              arquivo (montado só com `motionShowcase`), agora também alcançável
              por `reativo`. Ele revela as rotas de dados sob o cursor, já respeita
              `prefers-reduced-motion` (o canvas some, o SVG estático fica) e pinta
              num canvas do tamanho do cartão — nada de `box-shadow` nem de
              `filter: blur()` em transição. O `PalcoReativo` do `/contato` foi
              descartado por ser desenho de outra seção (luzes de palco atrás de um
              formulário), não de cartão. */}
          {(motionShowcase || reativo) && <TechnicalCursorReveal className="tcr-raiz" />}
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              {eyebrow && (
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B8DDF6]">
                  {eyebrow}
                </span>
              )}
              <h2 className="mt-3 font-display text-3xl leading-tight text-white md:text-4xl">
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
            {/* SIS-142 · item 4. Os dois caminhos usam a MESMA aparência: o que
                muda é o elemento, e é ele que muda porque o alvo mudou. Link que
                abre modal é link mentiroso — o leitor de tela anuncia "link" e a
                pessoa espera navegar, além de `Ctrl+clique` e "abrir em nova aba"
                prometerem um destino que não existe. Daí `<button>` quando o
                destino é o `<dialog>`.

                O QUE O `/#contato` PERDE, e a decisão registrada (ponto de
                atenção 8): a âncora era destino navegável, compartilhável e
                funcionava sem JS; o modal não é nenhuma das três. Em `/esg` ela
                sai de cena, e a saída navegável continua existindo em dois
                lugares que já estão na tela e não custam palavra nova — o
                "Contato" do cabeçalho e o do rodapé, ambos apontando para
                `/contato`, que tem o formulário inteiro. Um segundo link dentro
                do cartão exigiria escrever um rótulo novo, e a escrita deste
                bloco é travada no `copy-lock.json` (ponto de atenção 9). Nas
                outras sete telas nada disso acontece: `contatoNoModal` nasce
                desligada e o `<Link>` abaixo é literalmente o de antes. */}
            {contatoNoModal ? (
              <button
                type="button"
                onClick={() => setModalAberto(true)}
                className="cta-entrada cta-entrada-b inline-flex flex-none items-center gap-3 self-start rounded-full bg-white px-6 py-3 text-sm font-bold md:self-auto"
                style={{ color: '#0b2550', boxShadow: '0 10px 30px rgba(0,0,0,0.24)' }}
              >
                Fale com a SISTRAN
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </button>
            ) : (
              <Link
                href="/#contato"
                className="cta-entrada cta-entrada-b inline-flex flex-none items-center gap-3 self-start rounded-full bg-white px-6 py-3 text-sm font-bold md:self-auto"
                style={{ color: '#0b2550', boxShadow: '0 10px 30px rgba(0,0,0,0.24)' }}
              >
                Fale com a SISTRAN
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
            )}
          </div>
        </motion.div>
      </div>
      {/* Montado só quando o gatilho existe: sem isto, as oito telas passariam a
          carregar o painel de contato inteiro sem ninguém para abri-lo. */}
      {contatoNoModal && (
        <ContactModal open={modalAberto} onClose={() => setModalAberto(false)} />
      )}
    </section>
  );
}
