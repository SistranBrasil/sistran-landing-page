import { useSyncExternalStore } from 'react';

/**
 * SIS-182 — o molde da casa para ler uma media query em React, extraído.
 *
 * ── POR QUE ISTO EXISTE ─────────────────────────────────────────────────────
 * A forma errada, que oito componentes deste repositório usavam, é:
 *
 *     const [largo, setLargo] = useState(false);
 *     useEffect(() => {
 *       const mq = window.matchMedia('(min-width: 1024px)');
 *       const ler = () => setLargo(mq.matches);
 *       ler();                                   // ← `setState` síncrono no efeito
 *       mq.addEventListener('change', ler);
 *       return () => mq.removeEventListener('change', ler);
 *     }, []);
 *
 * O `ler()` de abertura é um `setState` síncrono dentro do efeito: o React
 * termina a montagem, roda o efeito, recebe estado novo e RENDERIZA DE NOVO
 * antes de pintar. É render em cascata em toda montagem, em telas onde o valor
 * nunca muda. `react-hooks/set-state-in-effect` é o sintoma; o defeito é ler
 * assinatura externa fora do formato que o React tem para isso.
 *
 * `useSyncExternalStore` resolve porque o React lê o valor DURANTE o render, uma
 * vez, direto da fonte — não há segundo render, e a assinatura de `change`
 * continua sendo a mesma de antes.
 *
 * ── POR QUE UMA FÁBRICA, E NÃO UM MAPA DE BREAKPOINTS ───────────────────────
 * A SIS-182 proíbe (com razão) inventar um hook genérico de breakpoint com nomes
 * — `useBreakpoint('desktop')` — porque os limiares desta base são diferentes de
 * verdade (1024, 1280, 1280×760, 767) e cada um espelha uma `@media` de CSS
 * específica. Um nome no meio esconde qual string é, e é exatamente aí que a
 * string do JS desgarra da do CSS.
 *
 * Esta fábrica não tem nomes: ela recebe a **string literal**, que fica escrita
 * no arquivo que a usa, ao lado do comentário que diz de qual `@media` ela é
 * espelho. O que ela compartilha é só a mecânica — cache do `MediaQueryList`,
 * `subscribe`, `getSnapshot`, instantâneo de servidor. Preferi isto a copiar as
 * mesmas dez linhas em nove arquivos porque `(min-width: 1024px)` aparece em
 * cinco deles: nove cópias do molde são nove lugares para a mecânica divergir,
 * enquanto a string — o que de fato precisa ser conferido contra o CSS — segue
 * uma por arquivo.
 *
 * ── DUAS REGRAS QUE VÊM DE `src/lib/motion.ts` ──────────────────────────────
 * 1. **`window.matchMedia` é chamado tarde, e nunca guardado.** `layout.tsx`
 *    substitui `window.matchMedia` num script antes do primeiro paint, para
 *    resolver a política de movimento. Guardar uma referência à função original
 *    (ou chamá-la em tempo de import de módulo) fura esse embrulho. Aqui a
 *    chamada acontece na primeira LEITURA, que é sempre depois da hidratação.
 * 2. **O instantâneo de servidor é `false`.** Media query não existe no
 *    servidor; qualquer outro valor divergiria na hidratação. Consequência que o
 *    consumidor precisa respeitar: o valor nasce `false` e converge depois de
 *    montar, então ele pode decidir ESTILO, atributo e `ativo` de hook de
 *    progresso — nunca QUAIS NÓS EXISTEM (`if (largo) return <A/>`), porque a
 *    subárvore seria desmontada e remontada na convergência. É a mesma restrição
 *    que o `useReducedMotion` já tinha, e é por isso que a troca desta issue é
 *    de canal de leitura, e não de comportamento: `useState(false)` + efeito
 *    também nascia `false`.
 *
 * O cache é por string de consulta, num `Map` de módulo: dois componentes com a
 * mesma media compartilham um `MediaQueryList` e um só listener por consumidor,
 * como `motion.ts` já fazia para `prefers-reduced-motion`.
 */
const listas = new Map<string, MediaQueryList>();

function pegarLista(consulta: string): MediaQueryList {
  let lista = listas.get(consulta);
  if (!lista) {
    /* Tarde de propósito — ver a regra 1 do cabeçalho. */
    lista = window.matchMedia(consulta);
    listas.set(consulta, lista);
  }
  return lista;
}

/** Leitura síncrona, para uso DENTRO de efeito/handler — nunca no render. */
export function consultaCombina(consulta: string): boolean {
  if (typeof window === 'undefined') return false;
  return pegarLista(consulta).matches;
}

/**
 * Devolve um hook que acompanha `consulta`. Chame no escopo do MÓDULO, uma vez
 * por consulta, para que `subscribe`/`getSnapshot` sejam estáveis entre renders
 * (funções novas a cada render fariam o `useSyncExternalStore` reassinar).
 *
 *     const useLargo = criarConsultaDeMedia('(min-width: 1024px)');
 *     // ...
 *     const largo = useLargo();
 */
export function criarConsultaDeMedia(consulta: string): () => boolean {
  const assinar = (avisar: () => void) => {
    const lista = pegarLista(consulta);
    lista.addEventListener('change', avisar);
    return () => lista.removeEventListener('change', avisar);
  };
  const ler = () => pegarLista(consulta).matches;
  const lerNoServidor = () => false;

  return function useConsultaDeMedia(): boolean {
    return useSyncExternalStore(assinar, ler, lerNoServidor);
  };
}
