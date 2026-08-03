---
name: carousel-clip-path
description: Criar carousel com transição circular usando clip-path para revelação radial entre slides. Use para carousels modernos com efeitos de máscara em landing pages.
---

## Conceito
Transição entre slides usando máscara circular que expande a partir de um ponto. Cria efeito de "revelação radial" mais moderno que fade/slide tradicional.

## Estrutura (Pringles)
```html
<div class="slides">
  <div class="slide active"> ... </div>
  <div class="slide"> ... </div>
  <div class="slide"> ... </div>
  <div class="slide"> ... </div>
</div>
<div class="navSlides">
  <ul class="bullets"><li class="active"></li><li></li>...</ul>
  <button class="botaoPrev"><img src="setaPrev.svg"/></button>
  <button class="botaoNext"><img src="setaNext.svg"/></button>
</div>
```

## CSS mágico
```css
.slides { position: relative; width: 100%; height: 100%; }

.slide {
  position: absolute; inset: 0;
  clip-path: circle(0% at 89% 50%);   /* círculo invisível à direita */
  opacity: 0;
  transition: clip-path 0s 1s, opacity 0s 1s;  /* sem transição, delay de 1s */
}

.slide.active {
  clip-path: circle(120% at 89% 50%); /* círculo cobre toda a viewport */
  opacity: 1;
  transition: clip-path 1s 0s, opacity 0.1s 0s;
  z-index: 1;
}
```

**Truque das transições simétricas**:
- Slide ativo: transition 1s (anima entrada)
- Slide inativo: transition 0s com delay 1s (fica visível até a entrada terminar, depois some instantâneamente)

## JS mínimo
```javascript
const slides = document.querySelectorAll(".slide");
const bullets = document.querySelectorAll(".bullets li");
let i = 0;

function passarSlide() {
  slides[i].classList.remove("active");
  bullets[i].classList.remove("active");
  i = (i + 1) % slides.length;
  slides[i].classList.add("active");
  bullets[i].classList.add("active");
  animacaoTexto();  // ver habilidade SplitText
}

document.querySelector(".botaoNext").onclick = passarSlide;
```

## Elementos internos com transitions escalonadas
Dentro do slide, cada elemento tem delay próprio:
```css
.slide p {
  opacity: 0;
  transition: opacity 0.6s 0.8s;    /* 0.8s delay */
}
.slide .botaoPrimario {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s 1s, transform 0.6s 1s;  /* 1s delay */
}
.slide.active p { opacity: 1; }
.slide.active .botaoPrimario { opacity: 1; transform: translateY(0); }
```

## Variações de clip-path
```css
clip-path: circle(120% at 50% 50%);     /* centro */
clip-path: circle(120% at 0% 0%);       /* canto superior esquerdo */
clip-path: inset(0 0 0 0);              /* retângulo */
clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
clip-path: ellipse(50% 30% at 50% 50%);
```

## Com GSAP
```javascript
gsap.fromTo(".slide",
  { clipPath: "circle(0% at 89% 50%)" },
  { clipPath: "circle(120% at 89% 50%)", duration: 1, ease: "power2.inOut" }
);
```

## Pitfalls
- `clip-path` circular: usar % > 100% garante cobertura total mesmo em containers largos.
- Safari antigo não suporta `clip-path` — usar `-webkit-clip-path` também.
- Elementos com `clip-path` não captam eventos fora da área visível → útil para não disparar hovers indesejados.
