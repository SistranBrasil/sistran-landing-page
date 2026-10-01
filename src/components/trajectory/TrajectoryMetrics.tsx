import { CountUp } from '@/components/primitives/CountUp';
import { TRAJECTORY_METRICS } from '@/data/trajectory';

type Props = {
  /**
   * Contagem animada. Ligada só no encerramento (§8: «somente uma vez, quando
   * entrarem na viewport»); na preview os números são estáticos, porque lá eles
   * existem para dimensionar a trajetória ANTES de a pessoa rolar — animar um
   * número que já está na primeira tela é animar o que ninguém viu entrar.
   */
  contar?: boolean;
  classe?: string;
};

/**
 * SIS-202 — `40 Seguradoras` / `26 Implantações de Sinistros`, separados por uma
 * linha vertical fina (§1).
 *
 * O separador é `border-inline-start` do segundo item, e não um nó próprio: assim
 * ele desaparece de graça quando os indicadores quebram em duas linhas no mobile,
 * onde uma régua vertical entre blocos empilhados não separaria nada.
 *
 * `<dl>` porque é exatamente isto: valor e o que ele nomeia. Com o número no `<dt>`
 * e o rótulo no `<dd>` o leitor de tela ouve os dois em par.
 */
export function TrajectoryMetrics({ contar = false, classe }: Props) {
  return (
    <dl className={classe ? `trajetoria-indicadores ${classe}` : 'trajetoria-indicadores'}>
      {TRAJECTORY_METRICS.map((indicador) => (
        <div key={indicador.rotulo} className="trajetoria-indicador">
          <dt className="trajetoria-indicador-valor">
            {contar ? (
              /* `srText` fica no padrão (o valor): o número visível do primitivo é
                 `aria-hidden` — quem o desliga deixa o indicador SEM número para
                 leitor de tela. O `<dd>` ao lado dá a unidade. */
              <CountUp value={String(indicador.valor)} once />
            ) : (
              indicador.valor
            )}
          </dt>
          <dd className="trajetoria-indicador-rotulo">{indicador.rotulo}</dd>
        </div>
      ))}
    </dl>
  );
}
