---
name: texto-infinito-loop
description: Criar efeito marquee de texto rolando continuamente em loop horizontal ou vertical usando CSS keyframes ou GSAP. Use para títulos infinitos e banners animados em landing pages.
---

## Conceito
Texto que rola continuamente em loop horizontal (ou vertical). Clássico "marquee" modernizado.

## Método 1: CSS Keyframes (Stranger Things)
```html
<div class="textoInfinito">
  <h3>THE EXPERIENCE</h3>
  <h3>THE EXPERIENCE</h3>
  <h3>THE EXPERIENCE</h3>
</div>
```

```css
.textoInfinito {
  width: max-content;     /* largura natural, sem quebrar */
  display: flex;
}
.textoInfinito h3 {
  font-size: 12vw;
  padding-left: 8vw;
  mix-blend-mode: color-dodge;  /* efeito luminoso opcional */
  animation: textoInfinito 10s infinite linear;
}
@keyframes textoInfinito {
  100% { transform: translateX(-100%); }
}
```

### Por que 3 cópias?
- Quando o primeiro sai à esquerda, o segundo já está visível.
- `translateX(-100%)` move o container inteiro pela largura de UM item (porque o container tem `width: max-content` e 3 copias).
- Ajuste: para loop perfeito, `translateX(-33.33%)` se os 3 filhos são iguais e você quer voltar ao primeiro.

## Método 2: GSAP com xPercent
```javascript
gsap.to(".textoInfinito", {
  xPercent: -50,   // metade (se tiver 2 cópias)
  repeat: -1,
  duration: 10,
  ease: "none",
});
```

## Método 3: SVG TextPath curvo (Pringles)
Texto seguindo caminho SVG, animado via `startOffset`:
```html
<svg viewBox="0 0 1400 400">
  <defs>
    <path id="curve" d="M-71 400 Q 100 50 720 190 Q 1000 250 1511 200" />
  </defs>
  <text>
    <textPath href="#curve" startOffset="20%">
      Gustavo Campelo · DevArt · Projetos ·
    </textPath>
  </text>
</svg>
```

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

## Hover: pausar loop
```css
.textoInfinito:hover h3 { animation-play-state: paused; }
```

## Pitfalls
- Se o texto for curto, duplicar até preencher a tela (senão aparece gap).
- `ease: linear` é obrigatório para loop suave.
- Para direção inversa, use `translateX(100%)` com texto invertido ou `animation-direction: reverse`.
- Em mobile, reduzir fonte e/ou duração para evitar performance issues.
