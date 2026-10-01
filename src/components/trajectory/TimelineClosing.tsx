import { TrajectoryMetrics } from './TrajectoryMetrics';

/**
 * SIS-202 — encerramento da trajetória (§8 do doc).
 *
 * Os dois indicadores voltam COM contagem (uma vez) e as quatro competências NÃO
 * voltam — o §8 é explícito nos dois pontos. O marcador do ano corrente fecha a
 * linha: é o mesmo desenho do selo da miniatura, o que amarra o fim do fluxo
 * detalhado ao fim da síntese.
 *
 * Fora do palco sticky, no fluxo normal do documento: é ele que «devolve
 * naturalmente o scroll para o restante da página».
 */
export function TimelineClosing({ anoFinal }: { anoFinal: number }) {
  return (
    <div className="trajetoria-fecho">
      <span className="trajetoria-fecho-marcador">
        <span className="trajetoria-fecho-no" aria-hidden />
        <span className="trajetoria-fecho-ano">{anoFinal}</span>
      </span>
      <h4 className="trajetoria-fecho-titulo">Uma trajetória que se transforma em resultado</h4>
      <TrajectoryMetrics contar classe="trajetoria-indicadores--fecho" />
    </div>
  );
}
