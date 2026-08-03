---
name: splittext
description: Animar texto caractere por caractere, palavra por palavra ou linha por linha usando SplitText ou SplitType. Use para títulos e efeitos tipográficos avançados em landing pages.
---

## Conceito
Bibliotecas que quebram texto em `<span>` individuais para cada char/word/line, permitindo animar cada pedaço independentemente.

## Opções
- **GSAP SplitText** (plugin pago Club GSAP) — mais poderoso
- **SplitType** (gratuito, API semelhante) — usado no Pringles

## SplitType (gratuito)
```html
<script src="https://unpkg.com/split-type"></script>
```
```javascript
const text = new SplitType(".titulo", { types: "words, chars" });
// text.chars = array de spans de char
// text.words = array de spans de palavra
// text.lines = array de spans de linha (se "lines" incluso)

gsap.from(text.chars, {
  y: "100%",
  opacity: 0,
  duration: 0.5,
  stagger: { each: 0.05, overlap: 0.1 },
  delay: 0.3,
});
```

## GSAP SplitText (premium)
```javascript
const split = SplitText.create(".textoSplit", {
  type: "lines, words, chars",
  mask: "lines",   // adiciona clip-path para cada linha (útil com y: 100%)
});

gsap.from(split.chars, {
  y: 40,
  opacity: 0,
  duration: 0.3,
  stagger: 0.03,
  scrollTrigger: { trigger: ".textoSplit", start: "top 80%" },
});
```

## Padrão loop para múltiplos textos
```javascript
document.querySelectorAll(".textoAnimado").forEach((el) => {
  const split = new SplitText(el, { types: "lines, words, chars" });
  gsap.from(split.chars, {
    filter: "blur(20px)",
    opacity: 0,
    duration: 0.3,
    stagger: { each: 0.02, from: "random" },  // ordem aleatória
    scrollTrigger: { trigger: el, start: "top 80%" },
  });
});
```

## CSS essencial
```css
.titulo {
  overflow: hidden;  /* esconde chars que saem do container */
}
/* SplitText cria spans assim: */
.char, .word { display: inline-block; }
```

Com `mask: "lines"`, cada linha ganha `overflow: hidden` automaticamente → ideal para animações `y: 100%` (palavras surgem de baixo).

## Variações de stagger
```javascript
stagger: 0.05                           // tempo entre cada
stagger: { each: 0.03, from: "random" } // ordem aleatória
stagger: { each: 0.03, from: "center" } // do centro para as pontas
stagger: { amount: 1, from: "end" }     // do fim para o começo, total 1s
stagger: { grid: [10, 5], from: "center", axis: "y" } // em grade
```

## Pitfalls
- Texto responsivo: ao **redimensionar a janela**, chamar `split.revert()` e recriar, senão os spans ficam com quebra errada.
- Acessibilidade: screen readers leem cada span separadamente. Considerar `aria-label` no elemento pai e `aria-hidden="true"` nos spans.
- SplitText é custoso: não aplicar em textos longos de parágrafo (use em títulos/subtítulos).
