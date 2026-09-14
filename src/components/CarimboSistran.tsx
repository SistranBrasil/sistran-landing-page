/**
 * CARIMBO SISTRAN — vetorial, configurável, para uso em QUALQUER rota.
 *
 * ── POR QUE ESTE ARQUIVO EXISTE SE JÁ HÁ `CarimboRealizadoSistran` ──
 *
 * São dois carimbos com propósitos diferentes, e a distinção importa antes de
 * escolher qual usar:
 *
 *   `CarimboRealizadoSistran`  — SIS-235. Arte RASTER (`carimbo-realizado-sistran.webp`),
 *                                texto fixo vindo de `EVENT_KIND_META.proprio.label`,
 *                                tombo de −6° medido, batida GSAP na montagem. Serve a
 *                                UM lugar: a tag dos eventos `kind: "proprio"`. Não
 *                                mexer nele — o texto está no lock de cópia e o tamanho
 *                                foi medido contra a foto do cartão.
 *
 *   `CarimboSistran` (aqui)    — vetorial. Texto, cor, forma, acabamento, tamanho e
 *                                inclinação vêm por prop. Nenhum PNG/WebP em produção:
 *                                símbolo, borda e textura usam `currentColor`, então o
 *                                carimbo herda a cor do contexto e escala sem borrar.
 *
 * Regra prática: evento próprio → o de cima. Qualquer outro selo de autoria no site
 * → este.
 *
 * ── SEM `"use client"`, E ISSO É DE PROPÓSITO ──
 *
 * Não há hook, ref nem GSAP: a entrada de impacto é `@keyframes` puro na folha. Assim
 * o componente atravessa a fronteira de servidor sem custo e pode ser usado dentro de
 * Server Components — que é a maioria das páginas desta rota. O preço de fazer isso
 * com CSS em vez de GSAP é não poder orquestrar o carimbo numa linha do tempo maior;
 * se algum lugar precisar disso, envolva com um cliente e desligue `animated`.
 *
 * ── MOVIMENTO REDUZIDO ──
 *
 * A animação é DECORATIVA (o carimbo já está legível no estado final), então a regra é
 * matá-la — e o estado de repouso é o próprio CSS, nunca `opacity: 0`. Ver o
 * `@media (prefers-reduced-motion: reduce)` no fim da folha: ele desliga a animação e
 * o carimbo nasce pronto, sem conteúdo preso invisível.
 *
 * ── O TEXTO CONTINUA TEXTO ──
 *
 * `prefix` e `brand` são nós de texto reais, selecionáveis e indexáveis. O símbolo, o
 * anel de impacto, a textura e o serial são `aria-hidden` — são desenho. O
 * `aria-label` na raiz costura os dois pedaços numa frase única para o leitor de tela,
 * em vez de deixá-lo ler "Realizado pela" e "Sistran" como itens soltos.
 */

import type { CSSProperties } from "react";
import styles from "./CarimboSistran.module.css";

export type FormaCarimbo =
  | "capsule"
  | "seal"
  | "split"
  | "ticket"
  | "signature"
  | "orbit"
  | "monogram"
  | "certificate";

export type AcabamentoCarimbo = "solid" | "outline" | "glass";

export type TamanhoCarimbo = "sm" | "md" | "lg";

export interface CarimboSistranProps {
  /** Linha de cima, em caixa alta e espaçada. */
  prefix?: string;
  /** Linha de baixo, com o peso da marca. */
  brand?: string;
  /** Qualquer cor CSS — inclusive `var(--alguma-coisa)` do tema da rota. */
  color?: string;
  forma?: FormaCarimbo;
  acabamento?: AcabamentoCarimbo;
  tamanho?: TamanhoCarimbo;
  /** Tombo em graus. Negativo tomba para a esquerda, como carimbo batido à mão. */
  rotation?: number;
  /** Liga a batida de entrada. Ignorada sob movimento reduzido. */
  animated?: boolean;
  className?: string;
}

/**
 * O símbolo. Redesenhado em SVG com a lógica da marca — círculo externo e dois traços
 * internos independentes, terminais arredondados — em vez de importar a arte raster:
 * é o que mantém o componente sem dependência de arquivo e permite `currentColor`.
 */
function MarcaSistran() {
  return (
    <svg className={styles.mark} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6.5" />
      <path
        d="M51 38h25l12 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 52l15 12h23"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CarimboSistran({
  prefix = "Realizado pela",
  brand = "Sistran",
  color = "#0757c7",
  forma = "capsule",
  acabamento = "outline",
  tamanho = "md",
  rotation = -3,
  animated = true,
  className = "",
}: CarimboSistranProps) {
  return (
    <span
      className={[
        styles.stamp,
        styles[forma],
        styles[acabamento],
        styles[tamanho],
        animated ? styles.animated : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          "--stamp-color": color,
          "--stamp-rotation": `${rotation}deg`,
        } as CSSProperties
      }
      /* A frase inteira num só rótulo: sem isto o leitor de tela anuncia as duas
         linhas como fragmentos separados. */
      aria-label={`${prefix} ${brand}`}
    >
      <span className={styles.impact} aria-hidden="true" />
      <span className={styles.logoWrap} aria-hidden="true">
        <MarcaSistran />
      </span>
      <span className={styles.copy} aria-hidden="true">
        <span className={styles.eyebrow}>{prefix}</span>
        <span className={styles.brand}>{brand}</span>
      </span>
      {/* Ornamento de carimbo, não informação: fica fora da árvore acessível e só
          aparece nas formas que reservam espaço para ele (`seal`, `monogram`,
          `certificate`). */}
      <span className={styles.serial} aria-hidden="true">
        SIS
      </span>
    </span>
  );
}

export default CarimboSistran;
