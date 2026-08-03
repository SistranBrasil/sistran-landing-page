---
name: reveal-on-scroll
description: Implementar animações reveal on scroll com fade, blur, slide in usando GSAP ScrollTrigger ou IntersectionObserver. Use para elementos que aparecem quando entram no viewport em landing pages.
---

## Conceito
Elementos aparecem quando entram no viewport. Três vetores comuns: **opacity**, **blur**, **translate (y/x)**.

## Padrão básico (fade + slide)
```javascript
gsap.from(".elemento", {
  opacity: 0,
  y: 50,
  duration: 0.8,
  scrollTrigger: {
    trigger: ".elemento",
    start: "top 85%",
    toggleActions: "play none none reverse",
  },
});
```

## Blur reveal (Stranger Things)
```javascript
gsap.from(".card", {
  opacity: 0,
  filter: "blur(10px)",
  stagger: 0.3,
  scrollTrigger: {
    trigger: ".cards",
    start: "0% 80%",
    end: "100% 70%",
    scrub: true,   // scrub faz animação "acompanhar" scroll
  },
});
```

## Slide lateral com stagger
```javascript
gsap.from(".lista li", {
  opacity: 0,
  x: 40,                 // vem da esquerda (+40px)
  filter: "blur(10px)",
  stagger: 0.1,
  scrollTrigger: {
    trigger: ".lista",
    start: "0% 80%",
    end: "100% 50%",
    scrub: true,
  },
});
```

## IntersectionObserver (alternativa sem GSAP)
```javascript
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("visible");
  });
}, { threshold: 0.2 });

document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
```

```css
.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s, transform 0.8s;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

## Escolher scrub vs toggleActions
| Caso | Usar |
|------|------|
| Elemento aparece e some com scroll (reversível) | `scrub: true` |
| Elemento aparece e fica (disparado 1x) | `toggleActions: "play none none none"` |
| Elemento aparece/reinicia ao reentrar | `toggleActions: "play none restart none"` |

## Pitfalls
- `gsap.from()` define o **estado inicial**; CSS é o estado final.
- Em mobile, usar `start: "top 90%"` para antecipar entrada.
- Evitar `filter: blur()` em muitos elementos simultaneamente (pesado em GPU).
