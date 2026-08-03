---
name: texto-svg-path
description: Fazer texto seguir um caminho SVG curvo, ondulado ou circular usando textPath. Use para layouts criativos com texto em curva em landing pages.
---

## Conceito
`<textPath>` é um elemento SVG que faz um texto seguir um caminho (`<path>`). Permite texto curvo, ondulado, circular.

## Estrutura
```html
<svg viewBox="0 0 1400 400">
  <defs>
    <path id="curve" d="M-71 400 Q 100 50 720 190 Q 1000 250 1511 200" />
  </defs>
  <text>
    <textPath href="#curve" startOffset="20%">
      TEXTO QUE SEGUE A CURVA
    </textPath>
  </text>
</svg>
```

## CSS
```css
svg text {
  fill: white;            /* cor do texto */
  font-size: 5rem;
  font-weight: 600;
  text-transform: uppercase;
}
```

## Atributos importantes
- `href="#idDoPath"` → referência ao path
- `startOffset` → posição inicial do texto ao longo do path (px ou %)
- `side="right"` → texto do outro lado do path (invertido)
- `textLength` → força comprimento específico
- `lengthAdjust="spacingAndGlyphs"` → ajusta espaçamento

## Animação com GSAP (scroll-driven)
```javascript
gsap.to("textPath", {
  attr: { startOffset: "-20%" },
  scrollTrigger: {
    trigger: ".marquee-inner",
    start: "top 70%",
    end: "bottom top",
    scrub: 2,
  },
});
```

## Texto circular
```html
<svg viewBox="0 0 200 200">
  <defs>
    <path id="circ" d="M 100,100 m -50,0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0" />
  </defs>
  <text><textPath href="#circ">TEXTO EM CIRCULO • TEXTO EM CIRCULO • </textPath></text>
</svg>
```

## Sobrepor path visível e path do texto
Truque do Pringles: dois SVGs na mesma grid, um com o path como stroke (visível), outro com o texto invisível seguindo o mesmo path:
```html
<div class="marquee-inner">
  <svg class="marquee-bg-svg" viewBox="...">
    <path stroke="#c71729" stroke-width="120" d="..." fill="none" />
  </svg>
  <svg class="marquee-text-svg" viewBox="...">
    <defs><path id="curve" d="..." /></defs>
    <text><textPath href="#curve">...</textPath></text>
  </svg>
</div>
```
```css
.marquee-inner { display: grid; grid-template: 1fr/1fr; }
.marquee-inner svg { grid-area: 1/1; }
```

## Pitfalls
- `d` do path deve ser idêntico nos dois SVGs para texto alinhar ao stroke.
- `viewBox` deve ser igual para manter proporções.
- Não use `transform` em `<textPath>` — anime via `attr: startOffset`.
