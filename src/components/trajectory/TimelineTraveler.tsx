import Image from 'next/image';

/**
 * O marcador que percorre a linha — a pílula da Luminna da captura de 30/09.
 *
 * A trilha antiga desta rota (`RoadmapTrail`) tinha este marcador e o fluxo
 * detalhado nasceu sem ele; o pedido é que «a linha atrás» volte a ser como na
 * versão publicada, e o marcador é metade daquele desenho — é ele que faz a
 * fronteira entre o traço percorrido e o que falta ter um lugar, em vez de a linha
 * simplesmente mudar de cor no vazio.
 *
 * ── POR QUE ELE NÃO SE POSICIONA SOZINHO ──
 *
 * A posição vem de `--viajante-x` / `--viajante-y`, escritas pelo
 * `TrajectoryScrollytelling` no MESMO quadro em que `--p` é escrita, a partir de
 * `pontoDaTrilha` (pura matemática, sem tocar no DOM). Nenhum cálculo aqui: este
 * componente não re-renderiza durante a rolagem, e é isso que mantém o custo por
 * quadro em duas atribuições de string — a regra do §12.
 *
 * `aria-hidden`: é a posição de leitura, que já está dita em texto pela barra de
 * capítulos e pelo card ativo.
 */
export function TimelineTraveler({ arte }: { arte: string }) {
  return (
    <div className="trajetoria-viajante" aria-hidden>
      {/* ⚠️ 234×200 É A RAZÃO MEDIDA DO ARQUIVO NOVO, e a troca de arte de 30/09
          mudou a FORMA, não só o desenho. `luminnadoisnn.png` era 2172×724 — uma
          pílula de 3,00:1, e era daí que vinham os 258×86 daqui e o `width: 168px`
          do CSS. `imagens/luminna-latam.png` é 889×760, ou seja 1,17:1: quase
          quadrado. Herdar os números antigos esticaria a arte em 2,6× na
          horizontal.

          Medido do cabeçalho do PNG, não estimado da tela — é o único lugar onde a
          razão do arquivo existe sem opinião. O tamanho de DESENHO continua sendo do
          CSS; este par só reserva a caixa (`images: { unoptimized: true }`, SIS-154). */}
      <Image src={arte} alt="" width={234} height={200} loading="lazy" decoding="async" />
    </div>
  );
}
