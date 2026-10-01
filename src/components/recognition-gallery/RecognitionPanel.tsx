/**
 * Um dos quatro painéis da galeria de reconhecimentos (SIS-238).
 *
 * `docs/trofeus.md` manda separar responsabilidades e proíbe `div` clicável sem
 * semântica de botão. A estrutura aqui resolve os dois de uma vez:
 *
 *   <li>                      ← o painel, a superfície
 *     <div id={corpoId}>      ← a região que o botão controla (a arte)
 *     <button aria-controls={corpoId} aria-expanded>
 *       <h3 id={tituloId}>    ← o título, que é o rótulo acessível
 *
 * O botão é o ÚNICO alvo de ponteiro e ele se estica por cima do painel inteiro
 * pelo `::after` (`.rgal-botao::after`, no CSS) — é o padrão de «link esticado»:
 * o alvo tem a largura e a altura do painel (nunca menos que os 44×44px que a
 * issue exige, nem no painel fechado em 82vw do mobile), e continua sendo um
 * `button` de verdade, com `Enter`/`Espaço` nativos e anel de foco.
 *
 * A arte fica FORA do botão de propósito: `aria-controls` tem de apontar para
 * algo que não seja descendente do próprio controle, senão a relação não diz
 * nada. E o `alt` do selo entra como conteúdo da região, não do botão — dentro
 * do botão ele passaria a fazer parte do nome acessível, que já é o título.
 *
 * TODO o conteúdo existe no DOM em todos os estados, aberto ou fechado. Nada
 * aqui é montado por condição: o que muda é `data-ativo`, e o CSS faz o resto.
 * O componente continua sem ESTADO — quem tem é a galeria.
 *
 * ── POR QUE ELE PASSOU A SER `'use client'` (pedido de 24/09) ────────────────
 *
 * A pedido da usuária o fundo atrás do troféu ganhou a MALHA DE QUADRADOS
 * interativa da casa, e «interativa» aqui é o idioma que o repositório já tem:
 * `usePonteiroNaSecao` (`ui/PalcoReativo`) publica a posição do ponteiro como
 * `--sx`/`--sy` (0..1) no elemento, e o CSS consome. Não é estado — o hook
 * escreve por `ref`, num `requestAnimationFrame` coalescido, sem um único
 * re-render por movimento do mouse. É o mesmo desenho de `#SomosSistraners` e do
 * fechamento de `/contato`.
 *
 * O LISTENER SÓ EXISTE NO PAINEL ABERTO, e isso não é economia: o efeito só é
 * visível ali (as camadas nascem em `opacity: 0` nos fechados), então um listener
 * nos outros três seria trabalho por quadro para pintar nada. Como a galeria
 * mantém um único painel ativo, há no máximo UM listener na seção a cada
 * instante — menos que o `PalcoReativo`, que registra um por seção.
 *
 * Movimento reduzido: o hook não é registrado (o `!rm` abaixo, canal da consulta
 * de mídia) E o CSS prende a máscara no centro sob `html[data-motion='reduce']`
 * (canal do alternador do site). Os dois canais, como manda a casa — e no
 * repouso as variáveis já valem 0.5/0.5 pelo CSS, então «sem ponteiro» é um
 * estado desenhado, não um buraco.
 */
'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { useReducedMotion } from '@/lib/motion';
import { usePonteiroNaSecao } from '@/components/ui/PalcoReativo';
import type { ReconhecimentoGaleria } from '@/data/reconhecimentos';

export default function RecognitionPanel({
  item,
  ativo,
  indice,
  corpoId,
  tituloId,
  onSelecionar,
  onApontar,
  onSairDoPonteiro,
  refBotao,
}: {
  item: ReconhecimentoGaleria;
  ativo: boolean;
  indice: number;
  corpoId: string;
  tituloId: string;
  onSelecionar: (indice: number) => void;
  onApontar: (indice: number) => void;
  onSairDoPonteiro: () => void;
  refBotao: (el: HTMLButtonElement | null) => void;
}) {
  const refPainel = useRef<HTMLLIElement>(null);
  const rm = useReducedMotion();
  /* `--sx`/`--sy` são publicadas no `<li>` e herdadas pela janela e pelas camadas
     de dentro — é por isso que o alvo é o painel e não a malha: a coordenada tem
     de ser relativa ao retângulo que o visitante vê, e o painel aberto ocupa
     ~metade da faixa (medir na faixa poria o destaque no lugar errado). */
  usePonteiroNaSecao(refPainel, ativo && !rm);

  return (
    <li
      ref={refPainel}
      className="rgal-painel"
      data-ativo={ativo}
      data-tinta={item.tintaEscura ? 'escura' : 'clara'}
      onPointerEnter={() => onApontar(indice)}
      onPointerLeave={onSairDoPonteiro}
    >
      {/* A JANELA DE MÁSCARA. O `overflow: hidden` está nela e não no painel: a
          issue pede que o logo «suba por uma máscara», e máscara no painel
          cortaria também o título e o fio ciano. Mantida como elemento próprio
          porque é ela que define o retângulo por onde a arte entra. */}
      <div className="rgal-janela" id={corpoId} role="group" aria-labelledby={tituloId}>
        {/* A BASE ELÍPTICA da issue, com os círculos técnicos finos. Eram dois
            («um ou dois», dizia `docs/trofeus.md`); o pedido de 24/09 pediu
            explicitamente o fundo mais rico da referência, com anéis
            concêntricos, e passaram a três. São pintura: `aria-hidden`.
            A força da base vem de `data-tinta` no painel (ver
            `src/data/reconhecimentos.ts`, nota de `tintaEscura`): o troféu claro
            recebe só o brilho ciano da mock, os três selos de tinta escura
            recebem papel de verdade, senão desapareceriam ao virar marinho. */}
        {/* ── O FUNDO ATRÁS DO TROFÉU (pedido de 24/09) ──────────────────────
            Estas três camadas vêm ANTES da base e vivem em `z-index: 0`, um
            degrau abaixo dela. Não é arrumação: a base é o PAPEL que dá 5,6:1
            ao selo da ABNT sobre o marinho (ver nota de `tintaEscura` em
            `src/data/reconhecimentos.ts`). Qualquer coisa pintada POR CIMA dela
            comeria esse contraste; pintada por baixo, não toca nele.

            `rgal-fitas` são as fitas de luz — dois varrimentos radiais largos,
            em ciano e gelo, que dão a curvatura do fundo.
            `rgal-malha` é a malha de quadrados da casa, no mesmo idioma de
            `AtmosferaQuadrados` (linha fina, passo regular), aqui em gradiente
            porque é repetição e não geometria.
            `rgal-malha-luz` é a MESMA malha, mais acesa, recortada por uma
            máscara redonda que segue o ponteiro (`--sx`/`--sy`): é o «quadrado
            interativo» — o que se move é a máscara, não a malha. */}
        <span className="rgal-fitas" aria-hidden />
        <span className="rgal-malha" aria-hidden />
        <span className="rgal-malha-luz" aria-hidden />
        <span className="rgal-base" aria-hidden />
        {/* Três aros, não dois: a referência do pedido mostra anéis concêntricos
            atrás do troféu, e o terceiro é o que fecha a leitura de «alvo». */}
        <span className="rgal-aro rgal-aro-1" aria-hidden />
        <span className="rgal-aro rgal-aro-2" aria-hidden />
        <span className="rgal-aro rgal-aro-3" aria-hidden />
        <Image
          className="rgal-arte"
          src={item.image}
          alt={item.imageAlt}
          width={item.largura}
          height={item.altura}
          /* A seção nasce bem abaixo da primeira dobra desta rota — a issue
             autoriza carregamento tardio, e é o padrão do repositório. */
          loading="lazy"
          sizes="(min-width: 64rem) 50vw, 82vw"
        />
      </div>

      <button
        ref={refBotao}
        type="button"
        className="rgal-botao"
        aria-expanded={ativo}
        aria-controls={corpoId}
        onClick={() => onSelecionar(indice)}
      >
        <h3 className="rgal-titulo" id={tituloId}>
          {item.title}
        </h3>
        {/* O fio ciano de sinal do painel ativo. Cresce da esquerda para a
            direita por `scaleX`, como a issue descreve. Decoração: quem diz que
            o painel está aberto é o `aria-expanded` do botão. */}
        <span className="rgal-fio" aria-hidden />
      </button>
    </li>
  );
}
