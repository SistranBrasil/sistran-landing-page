import type { CSSProperties } from 'react';
import { pontoDaTrilha, type NoDaTrilha } from './trajectoryGeometry';

/**
 * O marcador de fim ABERTO da trilha — pedido de 01/10: «apos esse card coloque algo
 * como estar em evolução».
 *
 * ── O PROBLEMA QUE ELE RESOLVE ────────────────────────────────────────────────
 * A trilha termina no último marco (`Assurant`, ver `src/data/timeline.ts`) e o traço
 * simplesmente para. Um percurso que para no último cliente se lê como «a história
 * acabou aqui» — e não acabou. Este selo diz que o trecho seguinte existe e ainda está
 * sendo escrito, que é a informação que faltava no fim da linha.
 *
 * ⚠️ NÃO É O MESMO QUE `TimelineContinue`, e os dois convivem de propósito. O
 * `Continue` é NAVEGAÇÃO: fica no pé do palco, fixo, e diz «há mais PÁGINA abaixo» —
 * resolve o momento em que a pessoa não sabe se a rolagem travou. Este é CONTEÚDO: fica
 * SOBRE a linha, na coordenada do último nó, e diz «há mais HISTÓRIA». Trocar um pelo
 * outro perderia uma das duas informações.
 *
 * ── A COORDENADA ──────────────────────────────────────────────────────────────
 * `pontoDaTrilha(nos, ultimo)` — a MESMA cúbica que o `d` do caminho emite, pelo mesmo
 * motivo dos selos de competência: escrever a posição à mão quebraria na primeira vez
 * que `PASSO` mudasse. E vai em VARIÁVEL, não em `top`/`left` inline, porque o bloco
 * base desarma o palco com `inset: auto !important` e estilo inline venceria a folha —
 * é a armadilha documentada em `TrajectoryScrollytelling`.
 *
 * ── O TEXTO ───────────────────────────────────────────────────────────────────
 * ⚠️ «Em evolução» é literal NOVO no site, e portanto entra no `copy-lock` (Regra
 * Zero). Não é frase inventada aqui: é a palavra do pedido de 01/10 («algo como estar
 * em evolução»), reduzida a duas palavras para caber na pílula do selo. Quem é dono do
 * conteúdo decide se fica assim; o `npm run test:copy` vai apontar a entrada nova até
 * que o lock seja regerado deliberadamente.
 *
 * `aria-hidden` NÃO entra aqui, ao contrário dos selos de competência: aqueles repetem
 * texto que a preview já escreve por extenso, e este não está escrito em lugar nenhum.
 * Esconder do leitor de tela apagaria a informação.
 */
export function TimelineEvolving({
  nos,
  ultimo,
  visivel,
}: {
  nos: readonly NoDaTrilha[];
  ultimo: number;
  visivel: boolean;
}) {
  const ponto = pontoDaTrilha(nos, ultimo);

  return (
    <div
      className="trajetoria-evolucao"
      data-revelado={visivel ? 'sim' : 'nao'}
      /* O lado segue a mesma paridade dos selos (`Math.floor(p) % 2`), para o marcador
         cair no lado em que a curva tem espaço no último nó, e não por cima do card. */
      data-lado={ultimo % 2 === 0 ? 'direita' : 'esquerda'}
      style={
        {
          '--evolucao-x': `${ponto.x.toFixed(1)}px`,
          '--evolucao-y': `${ponto.y.toFixed(1)}px`,
        } as CSSProperties
      }
    >
      {/* Haste pontilhada que CONTINUA depois do ponto, em vez de encostar nele como a
          dos selos: é o desenho do «ainda não terminou». */}
      <span className="trajetoria-evolucao-haste" aria-hidden />
      <span className="trajetoria-evolucao-pilula">Em evolução</span>
    </div>
  );
}
