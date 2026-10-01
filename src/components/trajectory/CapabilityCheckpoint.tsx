import Image from 'next/image';
import type { CapabilityCheckpointData } from '@/data/trajectory';
import type { EstadoDoItem } from './MilestoneCard';

/**
 * SIS-202 — a competência como PASSAGEM da narrativa (§7 do doc), e não como
 * bloco lateral: ela ocupa o mesmo lugar da fila que um card de cliente, e a linha
 * ciano entra pela esquerda e sai pela direita porque o nó dela está no eixo da
 * faixa (ver `trajectoryGeometry.ts`, âncora `eixo`). O critério 6 é este — as
 * quatro competências aparecem na preview E atravessam a narrativa.
 *
 * Card CLARO num palco claro, ao contrário dos cards de cliente, que são navy. É a
 * distinção que faz a passagem se ler como outra coisa: não é mais um cliente, é
 * algo que ficou.
 */
export function CapabilityCheckpoint({
  data,
  estado,
}: {
  data: CapabilityCheckpointData;
  estado: EstadoDoItem;
}) {
  return (
    <article className="trajetoria-passagem" data-estado={estado}>
      <p className="trajetoria-passagem-eyebrow">Competência conquistada</p>
      <span className="trajetoria-passagem-icone">
        {/* Mesmos arquivos e mesmo tratamento da preview: sem filtro, sem
            recolorir, sem sombra, `next/image` com medidas declaradas. `alt=""`
            porque o título logo abaixo é o texto do ícone. */}
        <Image src={data.icon} alt="" width={64} height={64} sizes="64px" aria-hidden />
      </span>
      <h4 className="trajetoria-passagem-titulo">{data.title}</h4>
      <p className="trajetoria-passagem-texto">{data.description}</p>
    </article>
  );
}
