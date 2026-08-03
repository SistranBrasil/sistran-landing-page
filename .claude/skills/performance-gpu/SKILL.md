---
name: performance-gpu
description: Otimizar animações e rendering com GPU acceleration (transform, opacity, will-change), evitar reflows, lazy-load e técnicas de performance para landing pages fluidas em 60fps+
---

## Conceito
Animações fluidas (60fps / 120fps) dependem de usar **propriedades que rodam na GPU** e evitar reflows/repaints.

## Propriedades GPU-friendly (cheap)
Apenas estas são compositadas pela GPU sem reflow:
- `transform` (translate, scale, rotate, skew, matrix)
- `opacity`
- `filter` (relativamente — blur é pesado)

## Propriedades que causam reflow (caro)
Evitar animar:
- `width`, `height`
- `top`, `left`, `right`, `bottom` (use `transform: translate` em vez)
- `margin`, `padding`
- `font-size`
- `display`, `flex-basis`

## `will-change` — hint para o browser
```css
.elemento-animado {
  will-change: transform, opacity;
}
```

- Avisa o browser para criar uma layer de compositor ANTES da animação começar.
- **Usar com cuidado**: cada `will-change` aloca memória GPU. Aplicar apenas a elementos que REALMENTE serão animados.
- Remover após animação se ela roda uma única vez:
```javascript
el.style.willChange = "auto";  // libera memória
```

## `transform: translate3d()` — força camada GPU
```css
.el {
  transform: translate3d(0, 0, 0);  /* hack clássico pre-will-change */
}
```

Moderno: preferir `will-change: transform`.

## `backface-visibility: hidden`
Evita flickering em transformações 3D:
```css
.el {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
```

## `contain` — isola elementos
```css
.card {
  contain: layout style paint;
}
```
Browser pode otimizar sabendo que mudanças no card não afetam o resto.

## `content-visibility` — render on demand
```css
.sectiona-abaixo-do-fold {
  content-visibility: auto;
  contain-intrinsic-size: 500px;  /* reserva espaço */
}
```
Seção não renderiza até estar próxima do viewport (grande ganho em landing pages longas).

## Lazy-load imagens
```html
<img src="..." loading="lazy" decoding="async" />
```

## Debounce em resize / scroll
```javascript
let timeout;
window.addEventListener("resize", () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 200);
});
```

## `requestAnimationFrame` em loops
```javascript
function tick() {
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
tick();
```
Nunca use `setInterval` para animação — dessincroniza com o refresh rate.

## Capar `devicePixelRatio`
```javascript
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
```
Retina displays podem ter DPR 3+, render em 9x pixels. Cap em 2.

## Three.js — tips
```javascript
renderer.antialias = window.innerWidth > 1000;  // desabilita em mobile
renderer.shadowMap.enabled = false;             // sombras são caras
texture.anisotropy = 4;                          // balance qualidade/custo

// Dispose quando trocar de cena
geometry.dispose();
material.dispose();
texture.dispose();
```

## Reduzir SplitText em mobile
```javascript
if (window.innerWidth > 768) {
  // split e anima
} else {
  // só fade-in do bloco inteiro
}
```

## Imagens
- WebP >= JPG (~30% menor)
- AVIF > WebP (mais novo, ~50% menor)
- Comprimir antes: TinyPNG, Squoosh, ImageOptim

## Vídeos
- Sem áudio em backgrounds
- H.264 com CRF 28-32 para bom tamanho
- `-movflags +faststart` para progressive download

## Detectar `prefers-reduced-motion`
```javascript
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  // pular animações complexas
  gsap.globalTimeline.timeScale(100);  // termina tudo instantaneamente
}
```

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Ferramentas de profiling
- Chrome DevTools → Performance tab → grave e procure "long tasks"
- Chrome DevTools → Rendering → "Paint flashing" (mostra repaints)
- Lighthouse → Performance audit

## Pitfalls
- `will-change` em tudo = pior que nada (consome memória inutilmente).
- `filter: blur()` em múltiplos elementos = FPS drop grave.
- `position: fixed` com muitos filhos animados = repaint custoso.
- ScrollTrigger com muitos triggers: usar `batch()` ou consolidar.
- Animar `box-shadow` força repaint — prefira `filter: drop-shadow` em alguns casos.
