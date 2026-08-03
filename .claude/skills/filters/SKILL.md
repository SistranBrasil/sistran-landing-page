---
name: filters
description: Implementar efeitos visuais com filter e backdrop-filter CSS (blur, saturate, drop-shadow, grayscale). Use quando precisar desfoque, saturação animada, sombras em PNG, glassmorphism ou reveals com blur.
---

## Conceito
`filter` aplica efeitos visuais ao elemento (e ao seu conteúdo). Animáveis via CSS/GSAP. Usados em hover, reveal, sombras PNG.

## Valores mais usados

### `blur(px)` — desfoque
```css
.elemento { filter: blur(10px); }
```
Usado em reveals (de blur para 0):
```javascript
gsap.from(".card", { filter: "blur(10px)", opacity: 0, duration: 0.8 });
```

### `saturate(%)` — saturação
```css
img { filter: saturate(0); }   /* preto e branco */
img:hover { filter: saturate(1); }
```

Usado no WebHub: projetos começam sem cor e ganham saturação no scroll:
```javascript
gsap.to(imgProjeto, {
  filter: "saturate(100%)",
  scrollTrigger: { trigger: projeto, start: "0% 70%", end: "50% 50%", scrub: 1 },
});
```

### `drop-shadow()` — sombra que respeita transparência
Diferente de `box-shadow`, `drop-shadow` segue o canal alpha (PNG/SVG):
```css
.lata {
  filter: drop-shadow(32px 46px 32px rgba(0,0,0,0.35));
}
```
Perfeito para latas, ícones, imagens recortadas.

### Outros valores
```css
filter: grayscale(100%);
filter: brightness(1.5);       /* 1 = normal, 0 = preto, 2 = dobro do brilho */
filter: contrast(1.2);
filter: hue-rotate(90deg);
filter: invert(1);
filter: sepia(0.8);
filter: opacity(0.5);          /* alternativa a opacity */
```

### Combinar filtros
```css
filter: blur(5px) saturate(1.5) brightness(1.1);
```
Aplicados na ordem listada.

## `backdrop-filter` — filtro no fundo
Aplica filtro ao que está ATRÁS do elemento (efeito "glassmorphism"):
```css
.card {
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(10px) saturate(1.5);
  -webkit-backdrop-filter: blur(10px) saturate(1.5);  /* Safari */
}
```

## Performance
- `filter: blur()` é dos mais pesados (GPU intensivo). Evitar em muitos elementos simultaneamente.
- `drop-shadow` é mais leve que `box-shadow` para imagens transparentes.
- `backdrop-filter` requer compositor GPU — falha silenciosamente em alguns browsers antigos.

## Animações
```javascript
// GSAP anima filters como string
gsap.to(".el", { filter: "blur(0px) saturate(1)", duration: 1 });

// CSS
.el { transition: filter 0.4s; }
.el:hover { filter: blur(0) saturate(1.5); }
```

## Pitfalls
- `filter` cria novo **stacking context** e afeta `position: fixed` dos filhos (eles ficam fixos ao elemento filtrado, não ao viewport).
- Combinar `filter` com `mix-blend-mode` pode quebrar o blend-mode em alguns casos.
- `backdrop-filter` não funciona se o elemento/pai tiver `transform` (bug comum).
- `will-change: filter` pode ajudar, mas é caro — use só em animações recorrentes.
