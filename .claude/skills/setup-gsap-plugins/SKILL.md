---
name: setup-gsap-plugins
description: Configura GSAP e seus plugins (ScrollTrigger, ScrollSmoother, SplitText) em landing pages. Use quando o usuário mencionar GSAP, animações web, ScrollTrigger, ScrollSmoother ou precisar configurar bibliotecas de animação.
---

## Conceito
GSAP é a biblioteca padrão de animações web. Seus plugins (ScrollTrigger, ScrollSmoother, SplitText) adicionam funcionalidades avançadas. **Devem ser registrados antes de usar.**

## CDN (ordem importa)
```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.1/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.1/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.1/dist/ScrollSmoother.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.1/dist/SplitText.min.js"></script>
```

Para SplitText gratuito alternativo: `https://unpkg.com/split-type` (SplitType, API similar).

## Registro
```javascript
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);
```

Sem registro, plugins falham silenciosamente ou geram erro "plugin not found".

## Estrutura base de uma animação
```javascript
// gsap.from = anima DE um estado ATÉ o natural (CSS atual)
gsap.from(".elemento", {
  opacity: 0,
  y: 50,
  duration: 1,
  delay: 0.3,
  ease: "power2.out",
});

// gsap.to = anima DO estado atual ATÉ um novo estado
gsap.to(".elemento", { x: 100, duration: 1 });

// gsap.fromTo = define os dois estados
gsap.fromTo(".elemento", { opacity: 0 }, { opacity: 1, duration: 1 });

// timeline = sequencia animações
const tl = gsap.timeline();
tl.from(".a", { y: 50 })
  .from(".b", { y: 50 }, "-=0.3"); // começa 0.3s antes do anterior terminar
```

## Padrão usado nos projetos analisados
```javascript
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

// Smooth scroll só em desktop
if (window.innerWidth > 1000) {
  ScrollSmoother.create({ smooth: 2, effects: true });
}

function animarPagina() {
  // todas as animações de scroll
}

// chamar após preloader
```

## Pitfalls
- Registrar plugins SEMPRE antes de chamar qualquer função do plugin.
- ScrollSmoother requer wrapper HTML específico (ver habilidade 02).
- Não instanciar ScrollTrigger antes do DOM estar pronto.
