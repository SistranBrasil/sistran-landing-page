/**
 * Separador em chanfro entre duas secoes.
 *
 * Da skill `build-terminal-industrial-sites`: a fronteira entre claro e escuro é
 * um corte reto em SVG, nao uma curva organica nem `border-radius`. A cor é a do
 * bloco que avanca sobre a secao seguinte, entao ela vem por prop.
 *
 * Sem `use client` e sem JavaScript: é forma, nao movimento. `aria-hidden`
 * porque nao ha nada a ler aqui.
 */
export default function NotchDivider({
  cor,
  invertido = false,
}: {
  /** Cor do bloco que avanca. */
  cor: string;
  /** Aponta o chanfro para o outro lado. */
  invertido?: boolean;
}) {
  return (
    <svg
      aria-hidden
      className="notch-divider"
      viewBox="0 0 1440 48"
      preserveAspectRatio="none"
      focusable="false"
    >
      <path
        fill={cor}
        d={
          invertido
            ? /* bloco vindo de baixo: a base é cheia e o topo recua nos cantos */
              'M0 48H1440V26L1344 0H96L0 26Z'
            : /* bloco vindo de cima: o topo é cheio e a base recua nos cantos */
              'M0 0H1440V22L1344 48H96L0 22Z'
        }
      />
    </svg>
  );
}
