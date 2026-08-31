export type MotionPreference = 'system' | 'full' | 'reduce';

export const MOTION_PREFERENCE_STORAGE_KEY = 'sistran-motion-preference';
export const MOTION_PREFERENCE_SEEN_KEY = 'sistran-motion-preference-seen';
/**
 * Padrão: SEGUIR O SISTEMA.
 *
 * Era `'full'`, e isso fazia a página ignorar `prefers-reduced-motion` de quem
 * nunca abriu o banner — ou seja, de quase todo mundo. A preferência do SO é uma
 * declaração de necessidade, não uma sugestão a ser sobrescrita por um default;
 * `prefers-reduced-motion: reduce` é padrão em muitos perfis corporativos do
 * Windows e no modo de economia de bateria, então o público afetado não é caso
 * de borda.
 *
 * `'full'` continua existindo como escolha EXPLÍCITA — quem tem a preferência
 * ligada no sistema mas quer a experiência completa aqui marca "Ativas" e a
 * escolha persiste em `localStorage`. O que mudou é só de quem é o benefício da
 * dúvida.
 *
 * Consequência a lembrar: o script inline de `app/layout.tsx` espelha
 * `resolveReducedMotion` à mão, mas lê ESTE default por nome — ver a nota lá.
 */
export const DEFAULT_MOTION_PREFERENCE: MotionPreference = 'system';

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
  note: 'Esta página utiliza animações e, por padrão, segue a preferência de movimento deste dispositivo. Se as animações causam desconforto/enjoo, tontura ou sensibilidade à luz, escolha "Reduzidas" em "Mais opções".',
  /* Era "Aceitar", e o botão gravava `'full'`. Com o default seguindo o sistema,
     aquele par virava uma armadilha: o botão grande e destacado do banner
     sobrescreveria a preferência de movimento de quem a tem ligada no SO —
     justamente quem o banner existe para proteger. Agora o botão CONFIRMA o
     default respeitoso (grava `'system'`, ver `MotionPreferenceDialog.finish`), e
     "Ativas" continua alcançável em "Mais opções" como escolha explícita. */
  accept: 'Continuar',
  moreOptions: 'Mais opções',
  fewerOptions: 'Menos opções',
  close: 'Fechar',
  /**
   * O texto anterior avisava que, fora de "Ativas", "algum elemento pode
   * aparecer posicionado de forma inesperada". Saiu por dois motivos.
   *
   * O primeiro é que a refatoração de narrativa tornou-o falso: o modo reduzido
   * não é a mesma página com as animações desligadas, é um layout estático
   * completo — sem trilha alta, sem `sticky` dirigido, sem scrub, e com todo
   * conteúdo no estado final (é o default do CSS, e o modo dirigido é que se
   * adiciona por `[data-dirigindo]`).
   *
   * O segundo é que um aviso de possível defeito na opção acessível empurra quem
   * precisa dela de volta para a opção que causa desconforto. A acessibilidade
   * não é um modo degradado que se aceita sob ressalva.
   */
  alternativeNote:
    'Em "Sistema" e "Reduzidas" a página é apresentada em layout estático: todo o conteúdo fica visível de uma vez, sem percursos de rolagem nem vídeo conduzido pelo gesto.',
  footerTrigger: 'Preferências de movimento',
  options: [
    { id: 'full', label: 'Ativas', hint: 'Toda a animação e o vídeo conduzido por scroll, sem alteração.' },
    { id: 'system', label: 'Sistema', hint: 'Segue a preferência de movimento já configurada neste dispositivo.' },
    { id: 'reduce', label: 'Reduzidas', hint: 'Reduz a animação nesta página, mesmo que o dispositivo não peça.' },
  ] as MotionPreferenceOption[],
};
