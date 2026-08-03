---
name: preloader
description: Cria telas de carregamento (preloaders) para landing pages com contador de progresso ou animação SVG. Use quando o usuário pedir preloader, loading screen, splash screen, ou animação de carregamento inicial.
---

## Conceito
Tela de carregamento sobre a página que esconde até assets estarem prontos. Duas abordagens comuns: **progresso simulado** (contador %) ou **animação SVG stroke**.

## Abordagem 1: Contador % simulado (WebHub)
```html
<div id="preloader">
  <div class="preloader-text">0%</div>
</div>
```

```css
#preloader {
  position: fixed; inset: 0;
  background: #111;
  display: flex; justify-content: center; align-items: center;
  z-index: 9999;
}
.preloader-text { font-size: 50px; color: #fff; }
```

```javascript
const preloaderText = document.querySelector(".preloader-text");
const preloader = document.getElementById("preloader");
let count = 0;

const interval = setInterval(() => {
  if (document.readyState === "complete") count = 100;
  else count += Math.random() * 5;
  if (count >= 100) count = 100;

  preloaderText.textContent = `${Math.floor(count)}%`;

  if (count === 100) {
    clearInterval(interval);
    gsap.to(preloader, {
      opacity: 0, duration: 0.5,
      onComplete: () => preloader.remove(),
    });
  }
}, 50);
```

## Abordagem 2: SVG Stroke Drawing (projeto-amigos-4)
Ver habilidade [11-svg-stroke-drawing](11-svg-stroke-drawing.md).

```html
<div id="preloader">
  <svg viewBox="0 0 302 110">
    <path d="M..." fill="#E92A2D" />
  </svg>
</div>
```

```css
#preloader {
  position: fixed; inset: 0;
  background: #0c0102;
  display: flex; justify-content: center; align-items: center;
  z-index: 9999;
}
#preloader svg path {
  fill: rgba(168, 19, 19, 0.364);
  stroke: rgb(168, 19, 19);
  stroke-dasharray: 640;      /* comprimento estimado do path */
  stroke-dashoffset: 640;     /* começa com stroke "oculto" */
}
```

```javascript
const tl = gsap.timeline({
  onComplete() {
    animarPagina();
    gsap.to("#preloader", { opacity: 0, display: "none" });
  },
});

// Fase 1: desenha stroke
tl.to("#preloader path", { duration: 1, strokeDashoffset: 0 });
// Fase 2: preenche fill
tl.to("#preloader path", { fill: "rgb(168, 19, 19)", duration: 0.5 });
```

## Padrão: chamar animações após preloader
```javascript
const tl = gsap.timeline({
  onComplete: animarPagina,  // só anima depois do preloader
});
```

## Pitfalls
- `stroke-dasharray` precisa ser >= comprimento do path. Usar `path.getTotalLength()` em JS para precisão.
- Preloader deve ficar FORA do `#smooth-wrapper`.
- `display: none` no final para não reter eventos de pointer.
