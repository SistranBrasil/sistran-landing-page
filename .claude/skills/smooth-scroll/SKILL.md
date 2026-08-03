---
name: smooth-scroll
description: Implementa smooth scroll com ScrollSmoother ou Lenis em landing pages. Use quando o usuário pedir scroll suave, ScrollSmoother, Lenis, smooth scrolling, ou animações de scroll fluidas.
---

## Conceito
Desacopla o scroll nativo do render, aplicando suavização (easing) e habilitando parallax automático via atributo `data-speed`.

## HTML obrigatório
```html
<body>
  <div id="smooth-wrapper">
    <div id="smooth-content">
      <!-- TODO o conteúdo da página aqui -->
      <main>...</main>
      <footer>...</footer>
    </div>
  </div>

  <!-- Elementos fixos (header, preloader) FORA do wrapper -->
  <header>...</header>
</body>
```

## JS
```javascript
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

ScrollSmoother.create({
  smooth: 1.5,      // segundos de "lag" da suavização (1-3)
  effects: true,    // habilita data-speed / data-lag em filhos
  smoothTouch: 0.1, // opcional: suavização em touch (default: off)
});
```

## Parallax automático
Com `effects: true`:
```html
<img src="bg.jpg" data-speed="0.6" />  <!-- mais lento que scroll -->
<img src="fg.jpg" data-speed="1.2" />  <!-- mais rápido -->
<div data-lag="0.5">Texto que atrasa</div>
```

- `data-speed > 1`: elemento se move mais rápido que scroll
- `data-speed < 1`: elemento se move mais lento (efeito parallax clássico)
- `data-speed = "auto"`: calcula para o elemento ficar totalmente visível

## Desabilitar em mobile
```javascript
if (window.innerWidth > 1000) {
  ScrollSmoother.create({ smooth: 2, effects: true });
}

// Reload em resize significativo (evita bugs de recalc)
const larguraInicial = window.innerWidth;
window.addEventListener("resize", () => {
  if (Math.abs(window.innerWidth - larguraInicial) > 300) location.reload();
});
```

## Pitfalls
- Header deve ficar FORA do `#smooth-wrapper` (usa `position: fixed`).
- `body` não pode ter `overflow: hidden` manualmente — ScrollSmoother gerencia.
- ScrollTrigger funciona normalmente; ScrollSmoother integra automaticamente.
- ScrollSmoother é plugin **pago** do GSAP Club — em projetos comerciais avaliar licença. Alternativa free: **Lenis** (biblioteca gratuita com API similar).

## Alternativa: Lenis (gratuita)
```javascript
import Lenis from '@studio-freight/lenis';
const lenis = new Lenis({ duration: 1.2 });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
```
