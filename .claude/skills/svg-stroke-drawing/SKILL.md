---
name: svg-stroke-drawing
description: Animar paths SVG para criar efeito de desenho progressivo usando stroke-dashoffset. Use para ilustrações animadas e line drawing em landing pages.
---

## Conceito
Animar `stroke-dashoffset` faz o path SVG se "desenhar" progressivamente. Técnica padrão para efeitos de "line drawing".

## Fórmula
```
stroke-dasharray  = comprimento_total   → linha tracejada com 1 traço = todo path
stroke-dashoffset = comprimento_total   → traço fora de view (path invisível)
stroke-dashoffset = 0                   → path totalmente visível
```

## Implementação (Pringles)
```html
<div class="linhaVetorial">
  <svg viewBox="0 0 1822 1966">
    <path d="M2.81 121.88C410.43..." stroke="white" stroke-width="57" fill="none" />
  </svg>
</div>
```

```javascript
const path = document.querySelector(".linhaVetorial svg path");
const len = path.getTotalLength();  // calcula comprimento exato

gsap.set(path, {
  strokeDasharray: len,
  strokeDashoffset: len,   // começa invisível
});

gsap.to(path, {
  strokeDashoffset: 0,     // anima até totalmente visível
  scrollTrigger: {
    trigger: ".secao2",
    start: "30% 80%",
    end: "bottom 50%",
    scrub: 3,
  },
});
```

## Preloader Stranger Things
Com comprimento fixo no CSS:
```css
#preloader path {
  fill: rgba(168, 19, 19, 0.364);
  stroke: rgb(168, 19, 19);
  stroke-dasharray: 640;
  stroke-dashoffset: 640;
}
```

```javascript
const tl = gsap.timeline({ onComplete: animarPagina });
tl.to("#preloader path", { strokeDashoffset: 0, duration: 1 });
tl.to("#preloader path", { fill: "rgb(168, 19, 19)", duration: 0.5 });
```

## Múltiplos paths com comprimentos diferentes
```javascript
document.querySelectorAll("svg path").forEach((p) => {
  const len = p.getTotalLength();
  p.style.strokeDasharray = len;
  p.style.strokeDashoffset = len;
  gsap.to(p, {
    strokeDashoffset: 0,
    duration: 2,
    scrollTrigger: { trigger: p, start: "top 80%" },
  });
});
```

## CSS-only (sem GSAP)
```css
@keyframes draw {
  to { stroke-dashoffset: 0; }
}
path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw 2s forwards ease-out;
}
```

## Pitfalls
- `getTotalLength()` só funciona APÓS o SVG estar no DOM.
- `fill` do path: se não quiser preenchimento durante desenho, `fill="none"` ou `fill-opacity: 0` e animar depois.
- `stroke-linecap: round` suaviza as pontas.
- Em paths muito longos, `stroke-dasharray` pode precisar ser `Math.ceil(len)`.
