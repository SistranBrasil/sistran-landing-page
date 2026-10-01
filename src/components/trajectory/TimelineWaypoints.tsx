import Image from 'next/image';
import type { CSSProperties } from 'react';
/* `TRAJECTORY_ITEMS` saiu do import junto com `logoNoVao` — era o único consumidor.
   Deixá-lo importado seria erro de lint (`no-unused-vars`), não só sobra. */
import { TRAJECTORY_WAYPOINTS, seloRevelado } from '@/data/trajectory';
import { pontoDaTrilha, type NoDaTrilha } from './trajectoryGeometry';

/* ⚠️ A LOGO SAIU DO SELO — pedido de 01/10: «aumente bastante os icones e retire as
   logos e ficou estranho».

   E o motivo de ter ficado estranho está escrito na própria linha abaixo: a logo do
   selo era `logoNoVao`, «a mesma arte da placa do card». O selo nasce encostado na
   linha, a um vão de distância do card — então a mesma marca aparecia DUAS VEZES
   lado a lado, em duas caixas de proporção diferente (4,25rem 3:1 no selo, 136×66 na
   placa). Repetição, não informação nova.

   ⚠️ ISTO NÃO DESFAZ o pedido de 30/09 («coloque as logos em cada card»): a placa do
   card continua intacta em `MilestoneCard`. O que sai é a cópia que o selo fazia dela.

   A função fica comentada, e não apagada, porque voltar é uma linha no JSX:
/** Logo já derivada no marco do vão — a mesma arte da placa do card. *\/
function logoNoVao(p: number): string | undefined {
  const indices = [Math.floor(p), Math.ceil(p)];
  for (const i of indices) {
    const item = TRAJECTORY_ITEMS[i];
    if (item?.type === 'milestone' && item.data.logo) return item.data.logo;
  }
  return undefined;
}
*/

/**
 * Os selos de competência sobre a linha — pedido de 30/09: «na linha mesmo puxar um
 * ponto do qual deve aparecer», com os ícones de cada trecho.
 *
 * ── POR QUE ELES NÃO SÃO CARDS ────────────────────────────────────────────────
 * Até 30/09 as quatro competências eram paradas da fila, com título e descrição, e
 * consumiam um turno do palco cada uma. Agora são nós pendurados no traço, entre dois
 * cards. O texto delas não se perdeu: continua no painel de competências da preview,
 * acima — ver a nota em `src/data/trajectory.ts`.
 *
 * ── POR QUE A POSIÇÃO VEM DE `pontoDaTrilha` E NÃO DE UM `top`/`left` ─────────
 * O selo tem de encostar no traço, e o traço é uma cúbica. Escrever a coordenada à
 * mão funcionaria até a primeira vez que `PASSO` mudasse — e `PASSO` mudou nesta
 * mesma leva. `pontoDaTrilha` avalia a MESMA curva que o `d` do caminho emite, então
 * o selo está sobre a linha por construção, em qualquer passo.
 *
 * O cálculo acontece UMA VEZ, no render, não por quadro: `p` de cada selo é fixo
 * (vem dos dados), ao contrário do `p` do marcador viajante, que é a rolagem. Cinco
 * avaliações de Bézier na montagem é custo nenhum, e é por isso que aqui pode ser
 * atributo e lá tem de ser variável CSS escrita por `ref`.
 *
 * ── A REVELAÇÃO ───────────────────────────────────────────────────────────────
 * `data-revelado` sai de `seloRevelado`, que compara com o índice ATIVO — inteiro,
 * ~24 mudanças no percurso inteiro. É a mesma economia que os cards fazem: o que
 * muda por quadro é `--p`, que não passa pelo React.
 *
 * `aria-hidden` no conjunto: as quatro competências estão escritas por extenso, com
 * título e descrição, no painel da preview da mesma seção. Anunciar os ícones aqui
 * seria ler o mesmo conteúdo uma segunda vez, em forma pior.
 */
export function TimelineWaypoints({
  nos,
  ativo,
}: {
  nos: readonly NoDaTrilha[];
  ativo: number;
}) {
  return (
    <>
      {TRAJECTORY_WAYPOINTS.map((selo, i) => {
        const ponto = pontoDaTrilha(nos, selo.p);
        return (
          <div
            key={selo.id}
            className="trajetoria-selo"
            data-revelado={seloRevelado(selo, ativo) ? 'sim' : 'nao'}
            /* ⚠️ ALTERNA PELO ÍNDICE DO SELO, e não por `Math.floor(selo.p) % 2` — 01/10
               (noite): «intercalando os lados que eles aparecem». A conta antiga parecia
               alternar e não alternava: ela lia a paridade do NÓ de onde o vão sai, e os
               `p` dos selos restantes são 3,5 / 9,5 / 15,5 / 19,5 — pisos 3, 9, 15 e 19,
               todos ímpares. Os quatro caíam do MESMO lado, e era isso que a captura
               mostrava. Pela ordem em que aparecem na rolagem a alternância é real, e é o
               que o pedido descreve. */
            data-lado={i % 2 === 0 ? 'direita' : 'esquerda'}
            /* Coordenada como VARIÁVEL, pelo mesmo motivo das células: em `left`/`top`
               inline ela entraria em disputa com o `inset: auto !important` que o
               bloco base (coluna estática) usa para desarmar o palco, e a folha não
               teria como devolver o valor. Ver a nota longa em
               `TrajectoryScrollytelling`. */
            style={
              {
                '--selo-x': `${ponto.x.toFixed(1)}px`,
                '--selo-y': `${ponto.y.toFixed(1)}px`,
              } as CSSProperties
            }
            aria-hidden
          >
            <span className="trajetoria-selo-haste" />
            <span className="trajetoria-selo-corpo">
              {/* A placa de marca ficava aqui. Ver a nota no topo do arquivo — ela
                  repetia a placa do card vizinho, e é o que saiu em 01/10:
              {logo ? (
                <span className="trajetoria-selo-marca">
                  <Image src={logo} alt="" width={240} height={80} loading="lazy" decoding="async" />
                </span>
              ) : null} */}
              {selo.rotulo ? <span className="trajetoria-selo-rotulo">{selo.rotulo}</span> : null}
              <span className="trajetoria-selo-icones">
                {selo.icones.map((ic) => (
                  <span key={ic.src} className="trajetoria-selo-icone" title={ic.titulo}>
                    <Image
                      src={ic.src}
                      alt=""
                      /* Intrínsecos generosos, só para reservar a caixa — o tamanho de
                         desenho é do CSS. Mesmo padrão dos chips da miniatura.
                         Subiram de 96 para 160 em 01/10 junto com o aumento do desenho:
                         a pastilha passou a 76px e o glifo a 50px, e em tela de DPR 2
                         isso pede 100px de arte. Com `images: { unoptimized: true }`
                         (SIS-154) estes dois números não mudam o que baixa — o arquivo
                         do disco é servido cru — então subir é de graça. */
                      width={160}
                      height={160}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                ))}
              </span>
            </span>
          </div>
        );
      })}
    </>
  );
}
