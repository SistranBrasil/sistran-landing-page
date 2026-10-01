import { TRAJECTORY_CATEGORY_META, type MilestoneCategory } from '@/data/trajectory';

const ORDEM: readonly MilestoneCategory[] = ['large-company', 'sme', 'solution'];

/**
 * SIS-202 — legenda das três categorias (§1 do doc).
 *
 * `<ul>` e não uma fileira de `<span>`: são três itens de mesma natureza e o
 * leitor de tela anuncia a contagem. Os chips «funcionam apenas como
 * identificação visual» — o doc é explícito em não pedir filtro nesta versão —,
 * então NÃO são botões: um `<button>` que não faz nada é pior que um rótulo.
 *
 * A bolinha de cor é decorativa (`aria-hidden`) e a cor nunca é o único sinal: o
 * nome da categoria está escrito ao lado, e nos cards o chip também traz o texto.
 */
export function CategoryLegend() {
  return (
    <ul className="trajetoria-legenda">
      {ORDEM.map((id) => {
        const meta = TRAJECTORY_CATEGORY_META[id];
        return (
          <li key={id} className="trajetoria-legenda-item">
            <span
              className="trajetoria-legenda-ponto"
              style={{ background: meta.color }}
              aria-hidden
            />
            {meta.label}
          </li>
        );
      })}
    </ul>
  );
}
