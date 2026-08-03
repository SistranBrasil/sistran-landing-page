/**
 * Paleta canônica Sistran — tons aprovados para uso em textos, ícones,
 * bordas, glows e detalhes de destaque. Não usar cores fora desta lista
 * em novos componentes.
 */
export const TONES = {
  brandBlue: '#007bff',
  vividBlue: '#0693e3',
  brightBlue: '#0e80f6',
  cyan: '#0ed8f6',
  paleCyan: '#8ed1fc',
} as const;

export type ToneKey = keyof typeof TONES;

/** Cor de destaque principal (usada em eyebrows, glows, dots). */
export const ACCENT = TONES.cyan;

/** Azul institucional (CTAs, ícones primários). */
export const PRIMARY = TONES.brightBlue;
