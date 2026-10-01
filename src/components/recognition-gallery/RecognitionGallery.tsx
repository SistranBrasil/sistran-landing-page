'use client';

/**
 * RECONHECIMENTOS — a galeria editorial expansível de `/quem-somos` (SIS-238).
 *
 * Substitui por completo o «Teatro de Reconhecimentos». O teatro continua no
 * repositório (`RecognitionTheater.tsx` + `recognition-theater.css`, 531 + 1873
 * linhas) porque não há como comentar isso dentro de um arquivo — é o mesmo
 * tratamento que `EssenceAccordion` e `Differentials` receberam nesta rota: o que
 * se comenta é a MONTAGEM e o import, com o motivo escrito lá. A issue foi
 * reaberta em 24/09 com o corpo reescrito, e a própria issue declara a entrega
 * anterior (a capa Celent, de 11/09) «supersedida por esta galeria» — é por isso
 * que `REC_CELENT` sai de cena junto e não aparece aqui.
 *
 * ── O MECANISMO ──────────────────────────────────────────────────────────────
 * O relógio é UM só: `useScroll` sobre a rampa externa, `offset` de
 * `['start start', 'end end']`. O progresso de 0…1 vira índice por
 * `floor(min(p, 0.999999) * 4)` — o `min` existe porque `p === 1` no fim daria
 * índice 4, fora do array. O `setState` só acontece quando o índice MUDA, então
 * não há re-render por pixel de rolagem: são no máximo quatro re-renders no
 * percurso inteiro. É o mesmo mecanismo que o teatro usava
 * (`RecognitionTheater.tsx:150-167`) — a issue proíbe reaproveitar a estrutura
 * visual, não o relógio, e trocá-lo por um listener próprio seria justamente o
 * `scroll` sem `requestAnimationFrame` que ela veta.
 *
 * O ESTADO ATIVO tem três origens, em ordem de precedência: o ponteiro (hover,
 * que antecipa), o clique (que fixa) e a rolagem (que é o padrão). Quando a
 * rolagem muda de etapa ela LIMPA o que estava fixado — é o que a issue pede
 * com «quando o usuário voltar a rolar, o estado volta a acompanhar o progresso
 * do scroll». Sem essa limpeza um clique prenderia a galeria para sempre.
 *
 * ── A RAMPA NÃO EXISTE SEMPRE ────────────────────────────────────────────────
 * Abaixo de 64rem e com movimento reduzido não há sticky longo: a lista cai no
 * fluxo, vira carrossel de `scroll-snap` no mobile e quatro painéis empilhados
 * no movimento reduzido. Isso é decidido em CSS (duas consultas de mídia + o
 * espelho `html[data-motion='reduce']` que o alternador do site escreve antes da
 * primeira pintura). O JS só desliga a ASSINATURA do progresso — `rampaAtiva`
 * nasce `false`, é lido em `useEffect` e nunca decide quais nós existem, que é a
 * regra de hidratação de `src/lib/motion.ts`.
 *
 * ── AS VARIANTS SÃO LOCAIS, E POR MEDIDA ─────────────────────────────────────
 * O conjunto da casa (`vHeader`/`vEyebrow`/`vTitle`/`vSubtitle`) não serve aqui:
 * com `staggerChildren: 0.12` e durações de 0,8/0,9/0,8 a entrada termina em
 * 1,04s, e a issue dá teto de 900ms. As variants abaixo são as mesmas em forma,
 * com o orçamento refeito — terminam em 0,62s. A curva é a `easeExpo` da casa,
 * importada, não copiada.
 */

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { easeExpo, VP } from '@/lib/motion';
import {
  RECONHECIMENTOS_GALERIA,
  REC_GAL_APOIO,
  REC_GAL_DECORATIVO,
  REC_GAL_DICA,
  REC_GAL_EYEBROW,
  REC_GAL_TITULO,
  // SIS-177 — `REC_GAL_TOP5` saiu junto com o `<p>` do apoio forte: a frase virou o
  // título da faixa Celent desta rota, e importar sem usar quebraria o lint.
  // REC_GAL_TOP5,
} from '@/data/reconhecimentos';
import { PREMIACOES_NOTAS } from '@/data/aSistran';
import TituloAceso from '@/components/ui/TituloAceso';
import RecognitionPanel from './RecognitionPanel';
import './recognition-gallery.css';

const TOTAL = RECONHECIMENTOS_GALERIA.length;

const vAbertura = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const vLinha = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: easeExpo } },
};
/**
 * SIS-98 — a MESMA variant, SEM o canal de opacidade, e só para o título.
 *
 * O título deixou de ser um `motion.h2` e passou a ser `TituloAceso`, que acende
 * cada palavra por ROLAGEM. As duas coisas escrevem `opacity` no mesmo eixo: a
 * entrada levaria o bloco inteiro de 0 a 1 em 0,42s enquanto a cascata leva cada
 * palavra de 0,18 a 1 conforme o curso, e o que se vê é o produto das duas — a
 * cascata medida ficaria multiplicada por um fator que nada tem a ver com a
 * rolagem. Aqui sobra só o `y`, que é o que dava ao cabeçalho o ritmo escalonado
 * (eyebrow → título → apoio) e não disputa nada com o acendimento.
 */
const vLinhaSoY = {
  hidden: { y: 22 },
  visible: { y: 0, transition: { duration: 0.42, ease: easeExpo } },
};

export default function RecognitionGallery() {
  const rampaRef = useRef<HTMLDivElement | null>(null);
  const botoes = useRef<Array<HTMLButtonElement | null>>([]);

  /* `porRolagem` é o estado de base; `fixado` é o clique; `apontado` é o hover.
     Três estados e não um só porque eles têm tempos de vida diferentes: o hover
     morre ao sair o ponteiro e tem de devolver o painel que havia antes, o que é
     impossível se hover e clique gravarem na mesma caixa. */
  const [porRolagem, setPorRolagem] = useState(0);
  const [fixado, setFixado] = useState<number | null>(null);
  const [apontado, setApontado] = useState<number | null>(null);
  const [rampaAtiva, setRampaAtiva] = useState(false);

  const ativo = apontado ?? fixado ?? porRolagem;

  /* Espelho do índice de rolagem para o assinante do progresso não depender do
     fechamento de um render antigo — e para o duplo-invoke do StrictMode não
     disparar um `setState` redundante. */
  const rolagemRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: rampaRef,
    offset: ['start start', 'end end'],
  });

  /* A rampa só vale onde ela existe. As duas condições são as mesmas do CSS —
     se divergirem, o índice passa a andar sobre um wrapper sem altura extra e
     salta de 0 a 3 em poucos pixels. */
  useEffect(() => {
    const largura = window.matchMedia('(min-width: 64rem)');
    const movimento = window.matchMedia('(prefers-reduced-motion: reduce)');
    const avaliar = () => {
      const reduz = movimento.matches || document.documentElement.dataset.motion === 'reduce';
      setRampaAtiva(largura.matches && !reduz);
    };
    avaliar();
    largura.addEventListener('change', avaliar);
    movimento.addEventListener('change', avaliar);
    /* O alternador do site escreve `data-motion` no `<html>` e isso não dispara
       nenhuma media query — sem observar o atributo, quem troca a preferência no
       próprio site fica com a rampa ligada e a lista no fluxo ao mesmo tempo. */
    const obs = new MutationObserver(avaliar);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] });
    return () => {
      largura.removeEventListener('change', avaliar);
      movimento.removeEventListener('change', avaliar);
      obs.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!rampaAtiva) return;
    const avaliar = (p: number) => {
      const seguro = Math.min(p, 0.999999);
      const idx = Math.min(TOTAL - 1, Math.max(0, Math.floor(seguro * TOTAL)));
      if (idx === rolagemRef.current) return;
      rolagemRef.current = idx;
      setPorRolagem(idx);
      /* Rolar retoma o comando: o que estava preso por clique ou por ponteiro
         solta. */
      setFixado(null);
      setApontado(null);
    };
    avaliar(scrollYProgress.get());
    return scrollYProgress.on('change', avaliar);
  }, [rampaAtiva, scrollYProgress]);

  /* O deslocamento do texto decorativo: 36px no percurso inteiro, dentro do teto
     de «30 ou 40 pixels» da issue. Vai direto no DOM pelo `motion` — nenhum
     re-render de React participa disto. */
  const decorX = useTransform(scrollYProgress, [0, 1], [0, -36]);

  const selecionar = useCallback((i: number) => {
    setFixado(i);
    setApontado(null);
  }, []);

  const apontar = useCallback((i: number) => setApontado(i), []);
  const sairDoPonteiro = useCallback(() => setApontado(null), []);

  /* Teclado na LISTA e não em cada botão: as setas movem entre irmãos, e é a
     lista que conhece os irmãos. `Enter`/`Espaço` não aparecem aqui porque são
     nativos do `button` e já chegam por `onClick`. */
  const naTecla = useCallback(
    (e: React.KeyboardEvent<HTMLUListElement>) => {
      const atual = botoes.current.findIndex((b) => b === document.activeElement);
      if (atual < 0) return;
      let alvo: number | null = null;
      if (e.key === 'ArrowRight') alvo = Math.min(TOTAL - 1, atual + 1);
      else if (e.key === 'ArrowLeft') alvo = Math.max(0, atual - 1);
      else if (e.key === 'Home') alvo = 0;
      else if (e.key === 'End') alvo = TOTAL - 1;
      if (alvo === null) return;
      /* Só aqui, e só para estas quatro teclas: `Home`/`End` rolariam a página e
         as setas moveriam a barra horizontal do carrossel. */
      e.preventDefault();
      botoes.current[alvo]?.focus();
      setFixado(alvo);
      setApontado(null);
    },
    [],
  );

  const baseId = useId();

  return (
    <section className="rgal-secao" aria-labelledby="premiacoes">
      {/* O FUNDO: papel claro e as duas manchas fraquíssimas. Pintura, e por isso
          um irmão `aria-hidden` em vez de `background` na `section` — a rampa
          precisa que a `section` fique sem `isolation`/`transform`, que matariam
          o `position: sticky` de dentro. */}
      <div className="rgal-fundo" aria-hidden />

      <div className="rgal-rampa" ref={rampaRef}>
        <div className="rgal-quadro">
          {/* ── CABEÇALHO EDITORIAL ─────────────────────────────────────────── */}
          <motion.div
            className="container-lp rgal-cabecalho"
            variants={vAbertura}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            <motion.p className="rgal-eyebrow" variants={vLinha}>
              {REC_GAL_EYEBROW}
            </motion.p>
            {/* ── O TÍTULO ACENDE POR ROLAGEM (SIS-98) ──────────────────────────
                Era um `motion.h2` com a variant de linha: aparecia de uma vez, ao
                entrar na janela. Agora é o `TituloAceso` da casa — o mesmo
                componente de «Diferenciais» —, que acende unidade por unidade
                conforme o curso da rolagem.

                PALAVRA POR PALAVRA, E NÃO `porLetra`. A issue aponta o call site
                de `DiferenciaisSeis` como referência, e lá o `porLetra` está
                ligado; mas o próprio componente documenta por que ele existe:
                «Diferenciais» é UMA palavra, tem UM passo de cascata, e sem
                quebrar em letras não há por onde cascatear. Aqui a frase é
                «Reconhecimentos que marcam nossa trajetória» — CINCO palavras,
                cinco passos, contra os SEIS de «Entrega com Alta Performance e
                Comprometimento», que é o título para o qual o mecanismo foi
                escrito. O efeito de referência já está aqui sem trocar a unidade,
                e `porLetra` daria 42 `inline-block` numa frase que quebra em duas
                linhas, com palavra podendo partir no meio da virada — que é
                exatamente a ressalva escrita em `TituloAceso.tsx`. A issue
                autoriza «mesmo componente ou equivalente medido igual»: é o mesmo
                componente, na unidade que o próprio componente prescreve para
                título longo.

                `id="premiacoes"` continua no `h2` (o `TituloAceso` repassa o `id`
                para ele): é o alvo do `aria-labelledby` da seção e a âncora do
                ScrollSpy (`src/data/pageSections.ts`). A classe `.rgal-h2`
                também é repassada, então a tipografia da seção não muda. E o
                `aria-label` do heading entrega a frase inteira — a copy de
                `REC_GAL_TITULO` fica intacta, letra por letra. */}
            <motion.div variants={vLinhaSoY}>
              <TituloAceso id="premiacoes" texto={REC_GAL_TITULO} className="rgal-h2" />
            </motion.div>

            {/* ── APOIO ─────────────────────────────────────────────────────────
                SIS-177 — A NOTA TOP 5 SAIU DAQUI, e o par virou frase única.

                A nota da SIS-98 fica registrada, com a premissa que caducou: «A
                segunda frase não é escrita nova: é `REC_GAL_TOP5`, que era a
                primeira entrada de `PREMIACOES_NOTAS` e vivia no rodapé desta mesma
                seção. Subiu para cá porque a issue a quer ao lado do apoio e em
                negrito, e saiu de lá no mesmo movimento para não ficar duas vezes na
                mesma seção.» O motivo de sair agora é o MESMO princípio, um nível
                acima: a frase virou o TÍTULO da faixa Celent que a SIS-177 monta
                logo abaixo desta seção, e o aceite proíbe que ela apareça nas duas
                («retirar da galeria para aparecer uma vez só — preferência: na
                seção nova»). O literal não se perdeu: continua em
                `REC_GAL_TOP5`, agora com um consumidor só.

                A `div.rgal-apoio-par` de duas colunas FICA, com um filho. Ela é
                `grid` de `1fr` no mobile e de duas colunas a partir de 64rem; com um
                único `<p>` as duas larguras resolvem para o mesmo layout de antes do
                par existir, e mantê-la deixa a volta atrás em uma linha. O que saiu
                junto foi só o modificador `.rgal-apoio-forte`, que era o negrito da
                segunda frase.
                Para religar: devolver o segundo `<motion.p>` abaixo e o import de
                `REC_GAL_TOP5`, e retirar o título da faixa Celent.

                <motion.p className="rgal-apoio rgal-apoio-forte" variants={vLinha}>
                  {REC_GAL_TOP5}
                </motion.p>
            */}
            <div className="rgal-apoio-par">
              <motion.p className="rgal-apoio" variants={vLinha}>
                {REC_GAL_APOIO}
              </motion.p>
            </div>
          </motion.div>

          {/* ── TEXTO DECORATIVO ────────────────────────────────────────────── */}
          <motion.div className="rgal-decorativo" aria-hidden style={{ x: decorX }}>
            {REC_GAL_DECORATIVO.map((linha) => (
              <span key={linha}>{linha}</span>
            ))}
          </motion.div>

          {/* ── A GALERIA ───────────────────────────────────────────────────── */}
          {/* `ul` sem `role` de widget: são quatro painéis com um botão cada, não
              uma `tablist` — uma `tablist` obrigaria foco único com setas e
              `aria-selected`, e a issue pede `aria-expanded`/`aria-controls`, que
              é a gramática de divulgação, não de aba. */}
          <ul className="rgal-lista" data-ativo={ativo} onKeyDown={naTecla}>
            {RECONHECIMENTOS_GALERIA.map((item, i) => (
              <RecognitionPanel
                key={item.id}
                item={item}
                indice={i}
                ativo={i === ativo}
                corpoId={`${baseId}-corpo-${item.id}`}
                tituloId={`${baseId}-titulo-${item.id}`}
                onSelecionar={selecionar}
                onApontar={apontar}
                onSairDoPonteiro={sairDoPonteiro}
                refBotao={(el) => {
                  botoes.current[i] = el;
                }}
              />
            ))}
          </ul>

          {/* A dica de interação. NÃO é `aria-hidden`: ela informa como operar a
              galeria, e some por CSS exatamente onde deixa de ser verdade — no
              mobile, que não tem cursor nem rampa. */}
          <p className="container-lp rgal-dica">{REC_GAL_DICA}</p>
        </div>
      </div>

      {/* O RODAPÉ DE NOTAS — hoje sem nenhuma nota para mostrar.
          `PREMIACOES_NOTAS` tinha duas, e as duas subiram para a abertura da
          seção, cada uma na issue que pediu: a da Celent virou `REC_CELENT`
          (SIS-230) e a Top 5 virou `REC_GAL_TOP5` (SIS-98, aqui). Nada foi
          perdido — a escrita continua na página, mais alto.

          A minha nota anterior aqui dizia que apagar a lista «seria perda
          silenciosa de conteúdo que ninguém pediu». Continua verdade, e é por
          isso que este bloco FICA: a guarda `.length > 0` faz dele um rodapé que
          volta sozinho quando alguém escrever uma nota nova de premiação em
          `aSistran.ts`. O que caducou é só a leitura de que a lista estaria
          cheia — a SIS-98 pede por nome que a frase não fique nos dois lugares. */}
      {PREMIACOES_NOTAS.length > 0 && (
        <div className="container-lp rgal-notas">
          {PREMIACOES_NOTAS.map((n) => (
            <p key={n.slice(0, 24)}>{n}</p>
          ))}
        </div>
      )}
    </section>
  );
}
