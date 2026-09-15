# Guia: revelar conteúdo conforme a página rola

Como instalar, marcar e calibrar o sistema de reveal em um projeto real.
Sem dependências no caso base; GSAP só quando o caso justificar.

---

## 1. O que você está instalando

Dois arquivos e um atributo no HTML.

```
reveal.css   →  estados inicial e final de cada variante
reveal.js    →  observa os elementos e adiciona a classe .rv-in
```

O JavaScript não anima nada. Ele só decide **quando** adicionar uma classe;
a animação inteira acontece no CSS. Isso importa por dois motivos: a animação
roda no compositor do navegador (não trava a página) e, se o JS falhar ou não
carregar, basta uma linha de fallback pra tudo continuar visível.

---

## 2. Instalação

### 2.1 `reveal.css`

```css
:root {
  --rv-ease: cubic-bezier(.19, 1, .22, 1);
  --rv-dur: .75s;
}

[data-reveal] {
  opacity: 0;
  transition:
    opacity   var(--rv-dur) var(--rv-ease),
    transform var(--rv-dur) var(--rv-ease),
    clip-path calc(var(--rv-dur) * 1.2) var(--rv-ease),
    filter    var(--rv-dur) var(--rv-ease);
  transition-delay: var(--rv-delay, 0ms);
  will-change: opacity, transform;
}

/* variantes — o valor do atributo escolhe o estado inicial */
[data-reveal="up"],
[data-reveal=""]      { transform: translateY(34px) }
[data-reveal="down"]  { transform: translateY(-28px) }
[data-reveal="left"]  { transform: translateX(-40px) }
[data-reveal="right"] { transform: translateX(40px) }
[data-reveal="scale"] { transform: scale(.93) }
[data-reveal="blur"]  { filter: blur(12px); transform: translateY(20px) }
[data-reveal="mask"]  { clip-path: inset(0 0 100% 0); transform: translateY(14px) }
[data-reveal="fade"]  { transform: none }

/* estado final, único para todas as variantes */
[data-reveal].rv-in {
  opacity: 1;
  transform: none;
  filter: none;
  clip-path: inset(0 0 0 0);
}

/* depois da entrada, libera a GPU */
[data-reveal].rv-done { will-change: auto }

/* caminho estático equivalente — obrigatório */
@media (prefers-reduced-motion: reduce) {
  [data-reveal] {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
    clip-path: none !important;
    transition: none !important;
  }
}
```

### 2.2 `reveal.js`

```js
export function initReveal(root = document) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // stagger: o container distribui o atraso entre os filhos marcados
  root.querySelectorAll('[data-reveal-stagger]').forEach((parent) => {
    const step = parseInt(parent.dataset.revealStagger, 10) || 90;
    parent.querySelectorAll('[data-reveal]').forEach((el, i) => {
      if (!el.style.getPropertyValue('--rv-delay')) {
        el.style.setProperty('--rv-delay', `${i * step}ms`);
      }
    });
  });

  const els = [...root.querySelectorAll('[data-reveal]')];

  if (reduced) {
    els.forEach((el) => el.classList.add('rv-in'));
    return () => {};
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('rv-in');
        io.unobserve(e.target);
        setTimeout(() => e.target.classList.add('rv-done'), 1400);
      });
    },
    {
      threshold: 0,
      rootMargin: '0px 0px -8% 0px', // ← o parâmetro que você vai calibrar
    }
  );

  els.forEach((el) => io.observe(el));
  return () => io.disconnect();          // cleanup
}
```

### 2.3 Fallback sem JavaScript

Se o script não rodar, nada aparece. Resolva com uma linha no `<head>`:

```html
<script>document.documentElement.classList.add('js')</script>
<style>html:not(.js) [data-reveal]{opacity:1;transform:none;clip-path:none}</style>
```

Agora o estado invisível só existe quando o JS está vivo pra desfazê-lo.

---

## 3. Marcando o HTML

```html
<section>
  <p  data-reveal="fade">rótulo</p>
  <h2 data-reveal="mask">Título da seção</h2>
  <p  data-reveal="up" style="--rv-delay:150ms">Texto de apoio.</p>

  <div class="cards" data-reveal-stagger="110">
    <article data-reveal="up">…</article>   <!--   0ms -->
    <article data-reveal="up">…</article>   <!-- 110ms -->
    <article data-reveal="up">…</article>   <!-- 220ms -->
  </div>
</section>
```

Regras de marcação:

- **Marque blocos, não palavras.** Um `data-reveal` por elemento visual — um
  título, um parágrafo, um card. Marcar cada `<span>` incha o DOM sem ganho.
- **`--rv-delay` é para relações pontuais** (o subtítulo entra depois do
  título). Para listas e grids, use `data-reveal-stagger` no pai.
- **Nunca marque o conteúdo acima da dobra com atraso longo.** O texto do hero
  é o LCP da página; escondê-lo por 600 ms piora a métrica de verdade.

---

## 4. Calibração

### 4.1 `rootMargin` — quando dispara

É o ajuste que mais muda a sensação da página.

| Valor | Efeito |
|---|---|
| `0px 0px -8% 0px` | dispara pouco depois de entrar. Discreto. |
| `0px 0px 0px 0px` | dispara exatamente na borda inferior. |
| `0px 0px 20% 0px` | começa quando ainda falta 20% da tela. **É o "já vai surgindo antes de chegar".** |
| `0px 0px -30% 0px` | só quando o elemento está bem dentro da tela. Dramático, arriscado. |

Valores negativos atrasam, positivos antecipam. Comece em `15%` se o objetivo
é o conteúdo da próxima seção já estar emergindo.

### 4.2 Distância e duração por tamanho de elemento

Quanto maior o elemento, menor o deslocamento e maior a duração. Um bloco de
400 px subindo 34 px parece nervoso.

```css
.hero-media[data-reveal] { --rv-dur: 1.1s; transform: translateY(16px) scale(.97) }
.card[data-reveal]       { --rv-dur: .7s }
.tag[data-reveal]        { --rv-dur: .45s }
```

### 4.3 Stagger

- 70–120 ms entre itens: legível e rápido.
- Acima de 150 ms, uma lista de 6 itens leva quase 1 s para terminar. O
  visitante que rola rápido vê a página se montando atrasada.
- Em grids com mais de 8 itens, escalone só as primeiras linhas ou reduza o
  passo para 50 ms.

### 4.4 Easing

`cubic-bezier(.19, 1, .22, 1)` (expo out) sai rápido e assenta devagar — é o
que dá a sensação "cara". Evite `ease-in` e `linear` em entradas: parecem
travadas.

---

## 5. Frameworks

### 5.1 React / Next

Um hook que roda depois da montagem e limpa no unmount:

```jsx
// useReveal.js
import { useEffect, useRef } from 'react';
import { initReveal } from './reveal';

export function useReveal(deps = []) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    return initReveal(ref.current);   // initReveal devolve o cleanup
  }, deps);
  return ref;
}
```

```jsx
export default function Page() {
  const ref = useReveal();
  return (
    <main ref={ref}>
      <h2 data-reveal="mask">Título</h2>
      <p data-reveal="up">Texto</p>
    </main>
  );
}
```

Cuidados específicos:

- Em Next com App Router, o componente precisa de `'use client'`.
- Conteúdo que chega depois (fetch, paginação, filtro) não está no DOM quando
  o observer roda. Passe a dependência no hook ou chame `initReveal` de novo
  no container novo.
- Em navegação client-side, o `IntersectionObserver` antigo continua vivo se
  você não devolver o cleanup. Daí o `return` no `useEffect`.

Componente alternativo, se preferir declarativo:

```jsx
export function Reveal({ as: Tag = 'div', variant = 'up', delay, children, ...rest }) {
  return (
    <Tag data-reveal={variant} style={delay ? { '--rv-delay': `${delay}ms` } : undefined} {...rest}>
      {children}
    </Tag>
  );
}
```

### 5.2 Vue / Nuxt

Uma diretiva global resolve sem wrapper:

```js
// plugins/reveal.client.js
export default defineNuxtPlugin((nuxtApp) => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const io = !reduced && new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('rv-in');
      io.unobserve(e.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });

  nuxtApp.vueApp.directive('reveal', {
    mounted(el, binding) {
      el.setAttribute('data-reveal', binding.value || 'up');
      if (binding.arg) el.style.setProperty('--rv-delay', `${binding.arg}ms`);
      if (reduced) { el.classList.add('rv-in'); return; }
      io.observe(el);
    },
    unmounted(el) { io && io.unobserve(el); },
  });
});
```

```vue
<h2 v-reveal="'mask'">Título</h2>
<p v-reveal:150="'up'">Texto</p>
```

O sufixo `.client` no nome do arquivo evita que o plugin rode no SSR, onde
`IntersectionObserver` não existe.

---

## 6. Quando trocar por GSAP ScrollTrigger

O sistema acima cobre reveal. Ele **não** cobre:

- **Pin** — fixar uma seção na tela enquanto uma animação avança.
- **Scrub** — animação amarrada à posição da barra, que volta ao rolar pra cima.
- **Timelines encadeadas** — três coisas em ordem dentro do mesmo trecho de scroll.
- **Scroll horizontal** dentro de uma seção vertical.

Se você precisa de algum desses, vale os ~70 kB:

```js
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

gsap.to('.bar', {
  scaleY: 1,
  stagger: 0.06,
  ease: 'none',
  scrollTrigger: {
    trigger: '#secao',
    start: 'top top',
    end: '+=150%',
    pin: true,
    scrub: 0.6,
  },
});
```

Em React, use `useGSAP` (do pacote `@gsap/react`) — ele faz o cleanup dos
ScrollTriggers no unmount, que é o erro mais comum de quem usa GSAP em SPA:

```jsx
import { useGSAP } from '@gsap/react';

useGSAP(() => {
  gsap.to('.bar', { /* … */ });
}, { scope: containerRef });
```

Se depois de montar o layout o ScrollTrigger errar as posições (fontes que
carregam depois, imagens sem dimensão), chame `ScrollTrigger.refresh()`.

**Não misture os dois no mesmo elemento.** Ou o elemento é reveal por CSS, ou
é timeline do GSAP.

---

## 7. Alternativa: CSS puro, sem JS

Se o projeto puder tratar o efeito como melhoria progressiva:

```css
@supports (animation-timeline: view()) {
  @keyframes rv-rise {
    from { opacity: 0; transform: translateY(30px) }
    to   { opacity: 1; transform: none }
  }
  [data-reveal] {
    animation: rv-rise linear both;
    animation-timeline: view();
    animation-range: entry 8% cover 34%;
  }
}
```

Zero JavaScript, zero listener. Suporte está em Chrome e Edge; Safari e
Firefox ainda parciais — por isso o `@supports`: quem não tem, vê a página
estática e íntegra, que é um resultado aceitável.

---

## 8. Checklist antes de publicar

1. [ ] Com `prefers-reduced-motion: reduce` ligado (DevTools → Rendering), a
       página aparece inteira, sem movimento e sem atraso.
2. [ ] Com JavaScript desabilitado, todo o conteúdo está visível.
3. [ ] Entrando pelo meio da página por âncora ou botão "voltar", nada fica
       invisível.
4. [ ] Ctrl+F encontra texto que ainda não foi revelado (ele está no DOM —
       `opacity: 0` não remove; `display: none` removeria, não use).
5. [ ] Nenhum elemento acima da dobra tem atraso maior que ~200 ms.
6. [ ] Rolando rápido até o rodapé, nada fica preso invisível.
7. [ ] Só `opacity`, `transform`, `filter` e `clip-path` são animados —
       nada de `height`, `top` ou `margin`.
8. [ ] Em SPA, trocar de rota duas vezes não deixa observers órfãos
       (confira em Performance → contagem de listeners).
9. [ ] No mobile, o efeito não some atrás do teclado nem quebra em telas
       curtas (`100svh` em vez de `100vh` onde houver sticky).

---

## 9. Erros que custam caro

| Erro | Consequência | Correção |
|---|---|---|
| Animar `height`, `top`, `margin` | reflow a cada frame, scroll travado | só `transform` e `opacity` |
| Animar dentro do handler de `scroll` | jank em telas de 120 Hz | guarde o valor, desenhe em `requestAnimationFrame` |
| Reveal em toda seção da página | nada chama atenção, leitura cansa | escolha 2–3 momentos |
| `display: none` como estado inicial | some do Ctrl+F e de leitores de tela | use `opacity: 0` |
| Atraso longo no hero | piora o LCP de verdade | hero entra em ≤ 200 ms, ou entra estático |
| Sem cleanup do observer em SPA | vazamento a cada navegação | devolva `io.disconnect()` do efeito |
| `will-change` permanente | memória de GPU presa em páginas longas | remova depois da entrada (`.rv-done`) |
| Só encurtar transições no reduced motion | não é experiência equivalente | desligue o efeito por completo |

---

## 10. Ordem de implementação sugerida

1. Cole o CSS e o JS, adicione o fallback sem JS. Marque **uma** seção.
2. Calibre o `rootMargin` rolando a página de verdade, em velocidade normal
   e em velocidade rápida.
3. Estenda para as seções que merecem — não todas.
4. Ajuste duração e distância dos elementos grandes.
5. Rode o checklist da seção 8.
6. Só então avalie se algum momento específico pede GSAP.