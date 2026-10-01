import RevealScope from '@/components/motion/RevealScope';
import { CapabilityList } from './CapabilityList';
import { CategoryLegend } from './CategoryLegend';
import { MiniTimeline } from './MiniTimeline';
import { TrajectoryMetrics } from './TrajectoryMetrics';

/**
 * SIS-202 — a preview da trajetória (§1 do doc): duas áreas, ~65% e ~35%.
 *
 * Componente de SERVIDOR, e é de propósito: nada aqui depende de rolagem, clique
 * ou medição. É o bloco que o critério 2 («o primeiro ano visível for 1988») e o
 * item «conteúdo acessível mesmo com JavaScript desabilitado» do §11 apoiam — sem
 * JavaScript, a preview inteira está na tela, com os dois indicadores, as quatro
 * competências, a legenda e a miniatura em SVG.
 *
 * O `anoFinal` vem por prop, calculado uma vez no pai, em vez de cada peça chamar
 * `new Date()`: dois relógios diferentes na mesma tela poderiam discordar na
 * virada do ano, e o selo da miniatura tem de ser o mesmo marcador do fim da linha.
 */
export function TrajectoryOverview({ anoFinal }: { anoFinal: number }) {
  return (
    <div className="trajetoria-preview">
      <div className="trajetoria-preview-principal">
        {/* SIS-205 — A TAG «Nossa trajetória» SAIU DAQUI, e a razão é o carimbo:

              <p className="trajetoria-eyebrow">Nossa trajetória</p>

            A arte que a issue manda montar no cabeçalho da seção diz «NOSSA
            Trajetória». Mantida, esta tag repetiria a MESMA frase a poucos pixels
            da arte, em corpo de 12px — a redundância que o relatório da SIS-277
            registrou como pendência no carimbo da capa («a tag textual já dizia a
            mesma frase») e que aqui é resolvível, porque a arte assumiu o papel de
            rótulo visual da seção. O texto não se perdeu do documento: ele é o
            `<h2>` `sr-only` que o pai passou a emitir.

            ⚠️ COM ESTA SAÍDA, `.trajetoria-eyebrow` FICOU SEM NENHUM CONSUMIDOR
            (conferido: os dois usos eram este e o do cabeçalho). A regra fica na
            folha, com o aviso escrito lá — é o mesmo tratamento do JSX preservado
            em comentário, e apagá-la agora obrigaria a reescrever a tinta para
            fundo claro caso o cabeçalho volte a ter texto. Quem for limpar folha
            morta nesta rota resolve as duas coisas de uma vez. */}
        {/* `<h3>`: o `<h2>` desta seção é o `sr-only` «Nossa trajetória», montado
            pelo pai (era o cabeçalho visível «Linha do tempo» até a SIS-205, e a
            hierarquia não mudou com a troca — o nível 2 continua existindo).
            Descer um nível aqui é o que mantém a hierarquia correta do §11 — a
            preview é uma parte da seção, não uma seção irmã. */}
        <h3 className="trajetoria-titulo">De 1988 ao presente</h3>
        <p className="trajetoria-subtitulo">Uma história construída junto ao mercado segurador.</p>

        <MiniTimeline anoFinal={anoFinal} />
        <CategoryLegend />
      </div>

      {/* SIS-205 — a ENTRADA do painel. O `RevealScope` é o único nó de cliente que
          entra aqui, e é por isso que ele foi escolhido em vez de uma animação CSS
          solta: `animation` dispara no carregamento, mesmo com a seção a dois mil
          pixels abaixo da dobra, e o movimento teria acabado antes de alguém ver.
          O observador precisa ser cliente; o CONTEÚDO não vira cliente — o `<aside>`
          e os quatro ícones continuam vindo renderizados do servidor, que é o
          argumento do docblock acima e do §11 («conteúdo acessível mesmo com
          JavaScript desabilitado»). Sem JavaScript o `data-in` nunca é escrito, o
          seletor `[data-in='false']` não casa, e o painel está simplesmente na tela.

          ⚠️ O ENVELOPE `<div>` É O 2º FILHO DA GRADE, exatamente onde o `<aside>`
          estava — a coluna de 35fr continua sendo dele. Trocar a ordem dos filhos
          aqui move o painel para a coluna de 65fr. */}
      <RevealScope>
        <aside
          className="trajetoria-painel"
          aria-label="Indicadores e competências"
          data-reveal="fade-up"
        >
          <TrajectoryMetrics />
          <CapabilityList />
        </aside>
      </RevealScope>

      {/* Chamada de rolagem. A seta é um SVG inline de traço fino (o §14 proíbe
          setas grandes) e é `aria-hidden`: quem não vê a tela não rola por seta, e
          a frase ao lado já diz o que fazer. O movimento vertical sutil está no
          CSS e para sob movimento reduzido. */}
      <p className="trajetoria-role">
        Role para explorar a trajetória
        <svg viewBox="0 0 24 34" className="trajetoria-role-seta" aria-hidden focusable="false">
          <path
            d="M12 2v27M5 22l7 7 7-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </p>
    </div>
  );
}
