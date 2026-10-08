/**
 * Tom do fundo SOB UM PONTO DA TELA, para elementos `fixed` que a cascata do CSS
 * não alcança (o `ScrollSpy` é o caso).
 *
 * ⚠️ POR QUE NÃO BASTA DECLARAR O TOM POR SEÇÃO. O `ScrollSpy` decidia a cor da
 * letra por um campo `tom` escrito por seção em `pageSections.ts`. Medido em
 * `/parceiros-e-implementacoes`, esse modelo não cabe no que a página faz:
 * `#parceiros` é UMA seção de 16.680px cujo fundo, na margem onde a coluna vive,
 * alterna entre branco e azul-marinho quatro vezes. Qualquer tom declarado fica
 * errado em parte do percurso — e o sintoma é o rótulo branco a 1,1:1 sobre
 * trecho claro. O tom é propriedade do PONTO, não da seção.
 *
 * O que esta função faz: olha a pilha de elementos sob o ponto, acha a primeira
 * superfície que realmente PINTA e classifica. O que ela não faz: adivinhar. Sobre
 * imagem ela responde `'midia'` em vez de escolher uma tinta — ver a nota do
 * `'midia'` abaixo.
 */

/** Tons que o chamador sabe pintar. `'midia'` é "não há cor, há imagem". */
export type TomDoFundo = 'claro' | 'medio' | 'escuro' | 'midia';

type RGB = readonly [number, number, number];

/* As três tintas que o `ScrollSpy` já usava, com o tom a que cada uma pertence.
   A ORDEM É A PREFERÊNCIA DE DESENHO, e é ela que faz esta função reproduzir as
   escolhas que foram feitas à mão antes (ver `escolherTom`): navy nas superfícies
   claras, branco nas escuras, e o quase-preto só onde nenhuma das duas fecha —
   que é exatamente o caso que a SIS-181 documentou para o azul intermediário
   rgb(21,125,196). */
const TINTAS: readonly { tom: TomDoFundo; rgb: RGB }[] = [
  { tom: 'claro', rgb: [10, 31, 68] }, // #0a1f44
  { tom: 'escuro', rgb: [255, 255, 255] },
  { tom: 'medio', rgb: [2, 7, 14] }, // #02070e
];

/** Mínimo da WCAG 1.4.3 para texto pequeno — o rótulo tem 11px. */
const CONTRASTE_MINIMO = 4.5;

function luminancia([r, g, b]: RGB): number {
  const canal = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

export function contraste(a: RGB, b: RGB): number {
  const [claro, escuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (claro + 0.05) / (escuro + 0.05);
}

/** `rgb()` / `rgba()` do `getComputedStyle` → canais + alfa. Só este formato
 *  aparece em valor COMPUTADO; `getComputedStyle` nunca devolve hex nem nome. */
function lerCor(valor: string): { rgb: RGB; alfa: number } | null {
  const n = valor.match(/[\d.]+/g);
  if (!n || n.length < 3) return null;
  return {
    rgb: [Number(n[0]), Number(n[1]), Number(n[2])] as const,
    alfa: n.length > 3 ? Number(n[3]) : 1,
  };
}

/**
 * A tinta de melhor desenho que ainda fecha 4,5:1 — e, se nenhuma fechar, a de
 * maior contraste possível.
 *
 * ⚠️ É ESTE CRITÉRIO QUE PRESERVA O DESENHO em vez de só maximizar número. Numa
 * superfície creme (rgb 226,239,250) o quase-preto dá 17,3:1 contra 13,9:1 do
 * navy; maximizar escolheria o quase-preto e trocaria a cor que a rota usa hoje
 * sem necessidade. Preferindo a primeira que PASSA, o navy ganha — e o
 * quase-preto fica reservado para onde ele é a única saída, que é como ele
 * entrou na paleta.
 */
function escolherTom(fundo: RGB): TomDoFundo {
  for (const t of TINTAS) if (contraste(t.rgb, fundo) >= CONTRASTE_MINIMO) return t.tom;
  return TINTAS.reduce((melhor, t) =>
    contraste(t.rgb, fundo) > contraste(melhor.rgb, fundo) ? t : melhor,
  ).tom;
}

/** Elemento que pinta IMAGEM (foto, vídeo, gradiente) e não cor chapada. */
function pintaMidia(el: Element, estilo: CSSStyleDeclaration): boolean {
  if (el.tagName === 'IMG' || el.tagName === 'VIDEO' || el.tagName === 'CANVAS') return true;
  return estilo.backgroundImage !== 'none';
}

/**
 * Classifica o fundo sob (`x`, `y`) da JANELA, ignorando a subárvore de `ignorar`
 * (o próprio elemento que pergunta — senão ele se mede a si mesmo).
 *
 * Devolve `null` quando a pilha veio vazia (ponto fora da janela), para o chamador
 * manter o tom anterior em vez de piscar.
 */
export function tomDoFundoEm(x: number, y: number, ignorar?: Element | null): TomDoFundo | null {
  if (typeof document === 'undefined') return null;
  const pilha = document.elementsFromPoint(x, y);
  if (pilha.length === 0) return null;

  for (const el of pilha) {
    if (ignorar?.contains(el)) continue;
    const estilo = getComputedStyle(el);
    if (estilo.visibility === 'hidden' || estilo.opacity === '0') continue;

    /* ⚠️ MÍDIA ANTES DE COR, e nesta ordem de propósito. Um elemento pode ter
       `background-color` E `background-image`: a imagem é pintada EM CIMA, então
       é ela que o olho vê. Ler a cor nesse caso daria a resposta do que está
       escondido — e é literalmente o caso de `.trajetoria-palco`, que declara
       `rgb(226,239,250)` sob um gradiente. */
    if (pintaMidia(el, estilo)) return 'midia';

    const cor = lerCor(estilo.backgroundColor);
    /* Alfa > 0,5: abaixo disso a superfície não é dela, é do que está atrás, e
       classificar por uma camada translúcida erraria por composição. Translúcido
       segue a busca para baixo, que é o comportamento certo. */
    if (cor && cor.alfa > 0.5) return escolherTom(cor.rgb);
  }
  return null;
}
