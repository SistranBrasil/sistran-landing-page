import { TRAJECTORY_CHAPTERS, type TrajectoryChapterId } from '@/data/trajectory';

/**
 * SIS-202 — barra superior de progresso (§4 do doc).
 *
 * ⚠️ NÃO É NAVEGAÇÃO, e isso decide a marcação: nada aqui é `<button>`, `<a>` nem
 * `role="tab"`. O doc pede orientação e diz «Não deve parecer um menu principal»;
 * clicar num capítulo levaria a rolar a página por conta própria, que é o
 * `window.scrollTo` que o §3 proíbe. É uma legenda de estado — daí `<ol>` com
 * `aria-current` no capítulo corrente, que é como leitor de tela entende «você está
 * aqui» sem prometer um destino.
 *
 * A parte percorrida da linha é um `::after` escalado por `--trilho`, calculado no
 * pai: um único valor de 0 a 1, sem nó extra por capítulo.
 */
export function TimelineProgress({ ativo }: { ativo: TrajectoryChapterId }) {
  const indiceAtivo = TRAJECTORY_CHAPTERS.findIndex((c) => c.id === ativo);

  return (
    <nav className="trajetoria-barra" aria-label="Capítulos da trajetória">
      <ol className="trajetoria-barra-lista">
        {TRAJECTORY_CHAPTERS.map((capitulo, i) => {
          const estado = i === indiceAtivo ? 'ativo' : i < indiceAtivo ? 'vencido' : 'adiante';
          return (
            <li
              key={capitulo.id}
              className="trajetoria-barra-item"
              data-estado={estado}
              aria-current={i === indiceAtivo ? 'step' : undefined}
            >
              <span className="trajetoria-barra-ponto" aria-hidden />
              <span className="trajetoria-barra-rotulo">{capitulo.label}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
