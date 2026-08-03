---
name: parallax-data-speed
description: Cria efeitos parallax com data-speed ou ScrollTrigger para landing pages. Use quando o usuário pedir parallax, data-speed, efeito de profundidade, camadas com velocidades diferentes, ou movimento parallax.
---

## Conceito
Elementos se movem em **velocidades diferentes** do scroll criando sensação de profundidade. Pode ser via ScrollSmoother (`data-speed`) ou manual com ScrollTrigger.

## Método 1: data-speed (ScrollSmoother)
Pré-requisito: `ScrollSmoother.create({ effects: true })`.

```html
<section class="hero">
  <picture data-speed="0.6">
    <img src="bg-distante.webp" />
  </picture>
  <picture>  <!-- velocidade normal -->
    <img src="bg-proximo.webp" />
  </picture>
</section>
```

- `data-speed="0.6"` → move 60% do scroll (fica "para trás" = parece mais distante)
- `data-speed="1.2"` → move 120% do scroll (fica "à frente")
- `data-speed="auto"` → elemento é totalmente visível na rolagem

## Método 2: ScrollTrigger manual
```javascript
gsap.to(".camada-fundo", {
  y: -200,
  ease: "none",
  scrollTrigger: {
    trigger: ".secao",
    start: "top bottom",
    end: "bottom top",
    scrub: true,
  },
});

gsap.to(".camada-frente", {
  y: 100,   // move no sentido oposto
  ease: "none",
  scrollTrigger: { trigger: ".secao", start: "top bottom", end: "bottom top", scrub: true },
});
```

## Método 3: Parallax de footer (Stranger Things)
Footer começa "subindo" com scroll:
```javascript
gsap.from("footer", {
  y: "-30%",
  immediateRender: false,
  scrollTrigger: {
    trigger: "footer",
    scrub: true,
    invalidateOnRefresh: true,
    end: "100% 100%",
  },
});
```

## CSS de suporte
Elemento parallax geralmente é `position: absolute` dentro de um container:
```css
.hero { position: relative; overflow: hidden; }
.hero picture {
  position: absolute;
  inset: 0;
  width: 100%; height: 100%;
}
.hero picture img {
  width: 100%; height: 100%;
  object-fit: cover;
}
```

## Pitfalls
- Sem `overflow: hidden` no container, o elemento parallax pode "vazar".
- `ease: "none"` é essencial em scrub para movimento linear (senão fica travado no início/fim).
- Em mobile, parallax pesado pode causar jank — desabilitar ou usar `data-speed` menos agressivo.
- `invalidateOnRefresh: true` recalcula posições quando o layout muda.
