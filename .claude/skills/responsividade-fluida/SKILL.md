---
name: responsividade-fluida
description: Implementar design fluido com clamp(), unidades viewport (vw, vh, dvh), media queries e técnicas de responsividade moderna para landing pages que escalam entre breakpoints
---

## Conceito
Design fluido usa unidades relativas (`vw`, `%`, `em`) com `clamp()` para escalonar entre limites — reduzindo dependência de muitos breakpoints.

## `clamp(min, preferred, max)`
```css
font-size: clamp(16px, 1.1vw, 24px);    /* nunca < 16px, nunca > 24px, senão 1.1vw */
margin: clamp(32px, 5vw, 120px);
width: clamp(280px, 50%, 600px);
```

## Unidades
| Unidade | Significado |
|---------|-------------|
| `vw` | 1% da largura da viewport |
| `vh` | 1% da altura da viewport |
| `vmin` / `vmax` | menor/maior entre vw e vh |
| `dvh` / `svh` / `lvh` | dynamic/small/large viewport height (mobile browsers) |
| `%` | relativo ao pai |
| `em` | relativo ao font-size do pai |
| `rem` | relativo ao root font-size |
| `ch` | largura do char "0" |

## Fonte fluida
```css
/* Header escalona entre 32px e 120px */
h1 {
  font-size: clamp(2rem, 8vw, 7.5rem);
  line-height: 1.1;
}

/* Em projetos analisados: fontes em vw sem clamp (aceita ficar gigante) */
h2 { font-size: 3.8vw; line-height: 5vw; }
```

## Spacing fluido
```css
section { padding: clamp(4rem, 8vw, 10rem) clamp(1rem, 5vw, 4rem); }
```

## Media queries como fallback
```css
@media (max-width: 1385px) { /* tablets grandes */ }
@media (max-width: 1200px) { /* tablets */ }
@media (max-width: 1004px) { /* tablets pequenos */ }
@media (max-width: 900px)  { /* mobile landscape */ }
@media (max-width: 600px)  { /* mobile portrait */ }
```

### Exemplo (WebHub mobile)
```css
@media (max-width: 600px) {
  .transition div:nth-child(n+6) { display: none; }  /* menos barras */
  .projetos .projeto { width: 100%; }
  .botoes { flex-direction: column; }
}
```

### Exemplo (Pringles mobile)
```css
@media screen and (max-width: 820px) {
  .slide {
    flex-wrap: wrap;
    align-items: end;
  }
  .slide .conteudo {
    order: -1;           /* flexbox reorder */
    width: 100%;
  }
  .bullets { display: none; }
  .slide h2 { font-size: 12vw; }  /* aumenta proporção em mobile */
}
```

## `<picture>` para responsive images
```html
<picture data-speed="0.6">
  <source media="(max-width: 600px)" srcset="bg-mobile.webp" />
  <img src="bg-desktop.webp" alt="" />
</picture>
```

## `aspect-ratio` (manter proporção)
```css
.card {
  aspect-ratio: 16/9;   /* largura fluida, altura = largura * 9/16 */
  background-size: cover;
}
```

## Container queries (moderno)
```css
.card-container { container-type: inline-size; }

@container (min-width: 400px) {
  .card { display: grid; grid-template-columns: 1fr 2fr; }
}
```

## Scroll-smoother responsivo
```javascript
if (window.innerWidth > 1000) {
  ScrollSmoother.create({ smooth: 2, effects: true });
}

// Reload ao redimensionar muito (evita quebras)
const lInit = window.innerWidth;
window.addEventListener("resize", () => {
  if (Math.abs(window.innerWidth - lInit) > 300) location.reload();
});
```

## Pitfalls
- `vh` em mobile: com barra de URL, altura muda. Use `dvh` (dynamic) para acompanhar.
- Fonte em `vw` pura fica ilegível em telas muito pequenas/grandes — sempre usar `clamp`.
- Media queries + animações GSAP: chamar `ScrollTrigger.refresh()` em resize para recalcular triggers.
