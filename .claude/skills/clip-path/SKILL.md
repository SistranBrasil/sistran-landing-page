---
name: clip-path
description: Implementar formas customizadas e máscaras com clip-path CSS. Use quando precisar recortes circulares, polígonos, transições de reveal, overlays assimétricos ou máscaras de imagem animadas.
---

## Conceito
`clip-path` recorta um elemento em formas arbitrárias. Usado para transições, overlays assimétricos, máscaras de imagem.

## Formas básicas
```css
/* Círculo */
clip-path: circle(50%);
clip-path: circle(120% at 89% 50%);  /* raio 120%, centro em (89%, 50%) */

/* Elipse */
clip-path: ellipse(50% 30% at 50% 50%);

/* Retângulo com cantos */
clip-path: inset(10px 20px 30px 40px);   /* top right bottom left */
clip-path: inset(10px round 20px);        /* com border-radius */

/* Polígono arbitrário */
clip-path: polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%);

/* SVG path */
clip-path: path("M 0,0 L 100,0 L 100,100 Z");

/* Referência a <clipPath> SVG */
clip-path: url(#meuClip);
```

## Overlay com clip-path (Pringles marquee)
```css
.marquee-overlay {
  clip-path: polygon(66% 40%, 100% 50%, 100% 100%, 0 100%, 0 50%);
  background: #c2c2c2;
}
```

## Transição de slide circular
```css
.slide {
  clip-path: circle(0% at 89% 50%);
  transition: clip-path 1s;
}
.slide.active {
  clip-path: circle(120% at 89% 50%);
}
```

## Reveal com inset (cortina horizontal)
```css
.elemento {
  clip-path: inset(0 100% 0 0);  /* totalmente cortado à direita */
  transition: clip-path 1s;
}
.elemento.visible {
  clip-path: inset(0 0 0 0);     /* revela da esquerda para direita */
}
```

## Com GSAP
```javascript
gsap.from(".img", {
  clipPath: "inset(0 100% 0 0)",  // começa cortado
  duration: 1.2,
  ease: "power3.out",
});

gsap.to(".overlay", {
  clipPath: "circle(0% at 50% 50%)",
  duration: 1,
});
```

## Gerador visual
[bennettfeely.com/clippy](https://bennettfeely.com/clippy) — clica e exporta CSS.

## Clip-path animado com keyframes
```css
@keyframes pulseCircle {
  0%, 100% { clip-path: circle(40%); }
  50% { clip-path: circle(60%); }
}
.elemento { animation: pulseCircle 2s infinite; }
```

## Combinação com mask (suporte mais amplo)
```css
.elemento {
  -webkit-mask: radial-gradient(circle at 50% 50%, black 50%, transparent 51%);
  mask: radial-gradient(circle at 50% 50%, black 50%, transparent 51%);
}
```

## Pitfalls
- Safari antigo exige `-webkit-clip-path`.
- `clip-path: circle(120%)` > 100% para garantir cobertura em containers largos.
- Elementos clipados não captam pointer events fora da área visível.
- Anim de `clip-path: polygon()` requer mesmo número de pontos no from/to.
- `transition` em clip-path entre formas diferentes (circle ↔ polygon) NÃO funciona — precisa ser o mesmo tipo.
