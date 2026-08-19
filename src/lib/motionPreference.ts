export type MotionPreference = 'system' | 'full' | 'reduce';

export const MOTION_PREFERENCE_STORAGE_KEY = 'sistran-motion-preference';
export const MOTION_PREFERENCE_SEEN_KEY = 'sistran-motion-preference-seen';
export const DEFAULT_MOTION_PREFERENCE: MotionPreference = 'full';

function isMotionPreference(value: unknown): value is MotionPreference {
  return value === 'system' || value === 'full' || value === 'reduce';
}

export function readMotionPreference(): MotionPreference {
  try {
    const stored = localStorage.getItem(MOTION_PREFERENCE_STORAGE_KEY);
    if (isMotionPreference(stored)) return stored;
  } catch {
    /* storage é opcional */
  }
  return DEFAULT_MOTION_PREFERENCE;
}

export function writeMotionPreference(preference: MotionPreference): void {
  try {
    localStorage.setItem(MOTION_PREFERENCE_STORAGE_KEY, preference);
  } catch {
    /* storage é opcional */
  }
}

export function hasSeenMotionPrompt(): boolean {
  try {
    return localStorage.getItem(MOTION_PREFERENCE_SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

export function markMotionPromptSeen(): void {
  try {
    localStorage.setItem(MOTION_PREFERENCE_SEEN_KEY, '1');
  } catch {
    /* storage é opcional */
  }
}

/**
 * ATENÇÃO — algoritmo espelhado à mão no script inline de `app/layout.tsx`.
 * Aquele script não pode fazer `import` (é injetado como texto via
 * `dangerouslySetInnerHTML` e roda antes de qualquer bundle), então duplica
 * esta mesma resolução em JS puro. Qualquer mudança aqui precisa ser
 * replicada manualmente lá.
 *
 * Não chame isto em componentes React passando `window.matchMedia(...)` como
 * `systemPrefersReduced`: a essa altura `matchMedia` já foi sobrescrito pelo
 * script inline e devolveria o valor já resolvido, não o real do SO. A única
 * leitura confiável do SO acontece dentro do próprio script, antes dele
 * redefinir `window.matchMedia`.
 */
export function resolveReducedMotion(
  preference: MotionPreference,
  systemPrefersReduced: boolean,
): boolean {
  if (preference === 'reduce') return true;
  if (preference === 'full') return false;
  return systemPrefersReduced;
}

export type MotionPreferenceOption = {
  id: MotionPreference;
  label: string;
  hint: string;
};

/** Cópia do banner. O projeto não tem `@/content/site`, então mora aqui. */
export const motionPreferenceCopy = {
  title: 'Preferências de movimento',
  note: 'Esta página utiliza animações. Se isso causa desconforto/enjoo, tontura ou sensibilidade à luz, escolha "Sistema" ou "Reduzidas" em "Mais opções".',
  accept: 'Aceitar',
  moreOptions: 'Mais opções',
  fewerOptions: 'Menos opções',
  close: 'Fechar',
  alternativeNote:
    'Esta página tem animações bastante dinâmicas. Ao escolher uma preferência diferente de "Ativas", é possível que, ocasionalmente, algum elemento apareça posicionado de forma inesperada.',
  footerTrigger: 'Preferências de movimento',
  options: [
    { id: 'full', label: 'Ativas', hint: 'Toda a animação e o vídeo conduzido por scroll, sem alteração.' },
    { id: 'system', label: 'Sistema', hint: 'Segue a preferência de movimento já configurada neste dispositivo.' },
    { id: 'reduce', label: 'Reduzidas', hint: 'Reduz a animação nesta página, mesmo que o dispositivo não peça.' },
  ] as MotionPreferenceOption[],
};
