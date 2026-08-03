---
name: pin-sections
description: Fixa seções na viewport durante scroll com ScrollTrigger pin. Use quando o usuário pedir seção fixa, pin sections, ScrollTrigger pin, scroll com seção parada, ou animações dentro de seção fixada.
---

## Conceito
`pin: true` **fixa** uma seção na viewport enquanto o usuário rola, permitindo que animações rodem "dentro" dela. O scroll continua avançando, mas a seção fica parada.

## Uso básico
```javascript
gsap.timeline({
  scrollTrigger: {
    trigger: ".animations",
    pin: true,          // fixa a seção
    scrub: true,
    start: "top top",   // pin quando topo encosta no topo da viewport
    end: "+=2000",      // pin dura 2000px de scroll
  },
})
.to(".obj", { x: 500 })
.to(".obj", { rotate: 360 })
.to(".texto", { opacity: 0 });
```

## Exemplo: transição de barras (WebHub)
Hero fixa enquanto barras sobem cobrindo tudo:
```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: "main",
    scrub: 1,
    pin: true,
    start: "100% 100%",
    end: "+=2000",
  },
});

tl.from(".transition div", {
  height: "0%",
  duration: 1,
  stagger: 0.08,
});
```

HTML:
```html
<div class="transition">
  <div></div>  <!-- 11 barras -->
  <div></div>
  ...
</div>
```

CSS:
```css
.transition {
  position: absolute; inset: 0;
  display: flex;
  z-index: 9;
  pointer-events: none;
}
.transition div {
  width: 100%;
  height: 100%;
  background: #000;
}
```

## Exemplo: cena 3D fixa com scroll animando objeto (WebHub)
```javascript
const tl3d = gsap.timeline({
  scrollTrigger: {
    trigger: ".animations",
    scrub: true,
    pin: true,
    end: "+=2000",
  },
});
tl3d.to(objeto.position, { x: 0, y: 0, duration: 1 });
tl3d.to(objeto.rotation, { x: 1.5 * Math.PI, duration: 1 }, "<");
tl3d.to(objeto.position, { z: 3.2, duration: 0.2 }, "-=.1");
```

## Opções avançadas
```javascript
scrollTrigger: {
  pin: true,
  pinSpacing: true,          // adiciona padding para compensar (default true)
  pinReparent: false,        // move o elemento pinned para body (cuidado)
  anticipatePin: 1,          // evita flicker ao iniciar pin
  pinType: "transform",      // "transform" ou "fixed" (use fixed se houver issues)
}
```

## Pitfalls
- **Elemento com `position: fixed` dentro de seção pinned** pode bugar — mover para fora.
- `pinSpacing: false` faz o conteúdo seguinte "colar" por baixo da seção (útil para transições).
- Em mobile, pin pode causar problemas com barras de URL dinâmicas — testar.
- Evitar aninhar múltiplos pinned triggers; use timeline única.
