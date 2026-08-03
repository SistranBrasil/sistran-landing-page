---
name: scrolltrigger-scrub
description: Implementa animações sincronizadas com scroll usando ScrollTrigger e scrub. Use quando o usuário pedir animações de scroll, ScrollTrigger, scrub, animações controladas pelo scroll, ou parallax manual.
---

## Conceito
`scrub` liga o **progresso da animação** à **posição de scroll**, em vez de usar tempo/duração. O usuário controla a timeline com o scroll.

## Anatomia
```javascript
gsap.to(".elemento", {
  x: 300,
  rotate: 90,
  scrollTrigger: {
    trigger: ".elemento",   // elemento que dispara
    start: "top 80%",       // quando topo do trigger = 80% da viewport
    end: "bottom 20%",      // fim: quando base do trigger = 20% da viewport
    scrub: true,            // true ou número (segundos de lag, ex: 1-3)
    markers: true,          // útil para debug
  },
});
```

## Variações de scrub
- `scrub: true` → animação sincroniza 1:1 com o scroll (sem inércia)
- `scrub: 1` → animação tem 1s de "peso"/inércia (mais suave)
- `scrub: 2` ou `3` → efeito de peso mais evidente (usado em marquee, parallax)

## Sintaxe de start/end
```
"top bottom"  → topo do trigger alinha com a base da viewport (ainda abaixo)
"top 80%"     → topo do trigger em 80% da altura da viewport
"top center"  → topo do trigger no meio da viewport
"top top"     → topo do trigger no topo da viewport
"bottom top"  → base do trigger alinha com o topo (trigger saiu da tela)
"+=2000"      → end é 2000px APÓS o start (útil com pin)
```

## Exemplos reais

### Parallax de latas (Pringles)
```javascript
gsap.to(".laranja .lataEtapa", {
  rotate: "0deg",
  y: -80,
  scrollTrigger: {
    trigger: ".laranja",
    start: "top 70%",
    end: "bottom top",
    scrub: 2,
  },
});
```

### Desenho de linha SVG com timeline
```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".secao2",
    start: "30% 80%",
    end: "bottom 50%",
    scrub: 3,
  }
});
tl.fromTo(path, { strokeDashoffset: len }, { strokeDashoffset: 0 });
tl.to(".secao3", { backgroundColor: "#fff" }, "-=0.6");
```

### Cards aparecendo com blur (Stranger Things)
```javascript
gsap.from(".card", {
  opacity: 0,
  filter: "blur(10px)",
  stagger: 0.3,
  scrollTrigger: {
    trigger: ".cards",
    start: "0% 80%",
    end: "100% 70%",
    scrub: true,
  },
});
```

## toggleActions (alternativa ao scrub)
Quando você quer animação com DURATION fixa disparada por scroll (não scrub):
```javascript
scrollTrigger: {
  trigger: texto,
  start: "top 80%",
  toggleActions: "play none restart none",
  // onEnter, onLeave, onEnterBack, onLeaveBack
}
```

Valores: `play | pause | resume | reverse | restart | reset | complete | none`

## Pitfalls
- `scrub: true` + `duration` → a duração é ignorada (o scroll dita o tempo).
- Com `pin: true`, use `end: "+=2000"` para controlar quanto scroll é "consumido".
- Em resize grande, chamar `ScrollTrigger.refresh()` ou reload da página.
