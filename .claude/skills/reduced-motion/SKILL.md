---
name: reduced-motion
description: Corrigir animações que travam, conteúdo invisível ou erro de hidratação quando o visitante tem "reduzir movimento" ativado no sistema. Use quando algo funciona num navegador mas não em outro, quando a página "congela", quando texto/números/marquees ficam parados, quando há erro "Expected server HTML to contain a matching <X>", ou quando algo depende de prefers-reduced-motion / useReducedMotion.
---

<!--
═══════════════════════════════════════════════════════════════════════════
  EXPLICAÇÃO PARA HUMANOS (leia isto antes do resto)
═══════════════════════════════════════════════════════════════════════════

O QUE É ESSA OPÇÃO DO WINDOWS?
──────────────────────────────
No Windows existe a configuração:

  Configurações → Acessibilidade → Efeitos visuais
  (ou Facilidade de Acesso → Vídeo)
  → "Efeitos de animação" / "Mostrar animações no Windows"

Quando essa opção está DESLIGADA, o sistema avisa os navegadores:
"esta pessoa prefere menos movimento".

O Chrome, o Edge e o Firefox leem esse aviso de jeitos um pouco diferentes.
Por isso o sintoma clássico: "no Firefox funciona, no Chrome não" (ou o
contrário). Não é bug de compatibilidade do navegador — é a preferência de
movimento reduzido ligada numa máquina e desligada na outra.

No console do navegador você confirma assim:

  window.matchMedia('(prefers-reduced-motion: reduce)').matches

Se der `true` onde está quebrado e `false` onde funciona, o culpado é esse.


O QUE É ESSA "ÁRVORE" DE NÓS?
─────────────────────────────
Pense na página como uma árvore genealógica de caixinhas (nós):

  <main>
    └── <section>          ← pai
          ├── <h1>         ← filho
          └── <div>        ← filho
                └── <p>    ← neto

O React (e o Next.js) monta essa árvore duas vezes:
  1. No SERVIDOR — gera o HTML inicial (não sabe o que o Windows do usuário
     configurou; então assume "movimento ligado", rm = false).
  2. No CLIENTE  — o navegador "hidrata" (encaixa o JavaScript em cima do
     HTML). No primeiro instante, o React ainda usa rm = false para bater
     com o servidor. Só DEPOIS ele lê a preferência real do Windows.

Se o seu código fizer isto:

  if (rm) return <ListaSimples/>;   // árvore A
  return <PilhaComScroll/>;         // árvore B

…no servidor sai a árvore B. No cliente, um instante depois, rm vira true e
o React TROCA a árvore B pela A. Trocar a árvore inteira = desmontar e
remontar tudo: animações do GSAP perdem as medidas, canvases morrem,
contadores param, a página "trava".

Regra de ouro: a árvore de caixinhas tem que ser SEMPRE a mesma. O que pode
mudar é só o ESTILO dentro da caixinha (altura, opacidade, animação ligada
ou não) — nunca quais caixinhas existem.


QUE PROBLEMAS ESSA SKILL RESOLVE?
─────────────────────────────────
1. Página "travada" / efeitos congelados só em alguns navegadores ou PCs.
2. Texto, hero ou seções inteiras invisíveis (opacity 0 para sempre).
3. Marquee de logos / ticker / órbita / contador 0→N parados de forma errada.
4. Erro de hidratação: "Expected server HTML to contain a matching <X>".
5. Troca de layout inteiro (ex.: pilha sticky vira grid) só porque a opção
   do Windows está desligada — o visitante deveria ver a mesma página.

IDEIA CENTRAL EM UMA FRASE:
  JS nunca decide O QUE EXISTE nem O QUE FICA INVISÍVEL com base em
  prefers-reduced-motion. CSS decide "menos movimento"; JS só anima ou não
  anima coisas que já estão na tela.

═══════════════════════════════════════════════════════════════════════════
-->

## Conceito

`prefers-reduced-motion: reduce` é lido de forma diferente por Windows, macOS e cada navegador — por isso um bug "funciona no Firefox mas não no Chrome" (ou vice-versa) é sintoma clássico dessa preferência, não do navegador em si. Antes de investigar "bug só nesse navegador", teste:

```js
window.matchMedia('(prefers-reduced-motion: reduce)').matches
```

nos navegadores onde funciona e onde não funciona. Se o valor difere, o problema é motion reduzido, não compatibilidade.

Esse projeto tem (ou deve ter) uma regra global de acessibilidade em `globals.css` que zera **toda** animação/transição quando essa preferência está ativa:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Isso quebra de formas distintas — trate cada uma separadamente.

## Causa 1: animação de CONTEÚDO ficando parada

Se a regra global for legítima para aquele elemento (reveal, pulse, tilt, blur de entrada), não faça nada — é o comportamento esperado.

Se o elemento é **conteúdo contínuo, não efeito decorativo**, congelar é o comportamento errado: o conteúdo fica inacessível. Exemplos de conteúdo:

- marquee de logos / texto
- ticker de indicadores
- órbita / carrossel autoplay que mostra itens
- contador numérico 0 → N (a contagem É a informação)
- rodízio de palavras na headline (as outras palavras ficariam invisíveis)

Isente só esses elementos da regra global via custom property, com especificidade maior que o `!important` genérico:

```css
.marquee-track {
  animation-name: marquee-scroll;
  animation-duration: var(--mq-duration, 40s);
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@media (prefers-reduced-motion: reduce) {
  /* Isenção cirúrgica: só este elemento */
  .marquee-track {
    animation-duration: var(--mq-duration, 40s) !important;
    animation-iteration-count: infinite !important;
  }
}
```

No JSX, a duração vai na custom property — **nunca** em `animationDuration` / `animation:` inline:

```tsx
// ERRADO — estilo inline perde para o !important global
style={{ animationDuration: `${speed}s` }}

// CORRETO — a classe CSS consome a variável e pode reafirmar com !important
style={{ '--mq-duration': `${speed}s` } as React.CSSProperties}
```

No JS (contadores, intervals de rodízio), **não** desligue com `if (rm) return` — rode a lógica mesmo com a preferência ligada. O que fica desligado é o efeito decorativo ao redor (blur, translate de entrada), não o conteúdo em si.

## Causa 2: trocar a ÁRVORE de nós com base em `rm`

**Nunca** faça isto:

```tsx
// ERRADO — árvore diferente no servidor vs cliente / pós-hidratação
const rm = useReducedMotion();
if (rm) return <>{children}</>;
return <motion.div>{children}</motion.div>;

// ERRADO — layout inteiro da seção muda
if (!isDesktop || rm) return <GridSimples/>;
return <PilhaStickyComScroll/>;
```

O servidor sempre renderiza com `rm = false` (não tem `matchMedia`). O hook correto também começa em `false` e só atualiza **depois** da hidratação. Quando `rm` vira `true`, o React desmonta a árvore A e monta a árvore B → GSAP/ScrollTrigger perdem medidas, canvases morrem, a página "trava". Isso pode acontecer **sem** mensagem de hidratação no console — só com remount silencioso.

**Regras:**

1. O hook deve começar em `false` e só atualizar depois da montagem. Preferir `useSyncExternalStore` com `getServerSnapshot: () => false` (ou `useState(false)` + `useEffect`). Nunca lazy-init síncrono `useState(() => matchMedia(...).matches)`.
2. Nunca condicione **a existência de nós** a `rm` (`if (rm) return <A/>; return <B/>`, `{!rm && <X/>}`, `return null`).
3. Quem decide layout crítico (altura do hero, sticky, esconder peek) deve ser **CSS** via `@media (prefers-reduced-motion: reduce)` — o browser resolve antes de qualquer JS.
4. Condicione apenas **estilos/props** dentro do nó já existente:

```tsx
// CORRETO — mesma árvore sempre
return (
  <div ref={ref} style={{ height: rm ? 'auto' : '200vh', position: 'relative' }}>
    <motion.div style={rm ? undefined : { position: 'sticky', top: 0, scale, opacity, y }}>
      {children}
    </motion.div>
  </div>
);
```

Layouts diferentes (mobile vs desktop) podem depender de **largura** (`matchMedia('(min-width: …)')`), nunca de `prefers-reduced-motion`.

## Causa 3: JS esconde e ninguém revela (conteúdo invisível)

Padrão clássico com GSAP / Motion:

```tsx
useEffect(() => {
  if (rm) return; // no 2º passe: sai sem revelar
  gsap.set(el, { opacity: 0, y: 34, filter: 'blur(10px)' });
  gsap.to(el, { opacity: 1, ... });
}, [rm]);
```

Linha do tempo do bug:

1. Primeiro effect: `rm` ainda é `false` (snapshot do servidor) → `gsap.set` esconde o elemento.
2. Preferência real chega → `rm = true` → effect limpa e roda de novo.
3. Early return → ninguém coloca `opacity: 1` de volta → texto some para sempre.

**Como evitar:**

1. Dentro do effect, leia a preferência de forma **síncrona** antes de esconder:

```tsx
import { prefersReducedMotion, useReducedMotion } from '@/lib/motion';

useEffect(() => {
  // rm sozinho NÃO basta no 1º passe — ainda é false
  if (rm || prefersReducedMotion()) return;
  // só agora pode esconder e animar
}, [rm]);
```

2. Coloque o `gsap.set` **dentro** de `gsap.context(...)`. No cleanup use `ctx.revert()`, **nunca** só `tl.kill()` — matar a timeline deixa o elemento no estado oculto do `set`.

3. No CSS global, force estado final visível para qualquer seletor que o JS esconde:

```css
@media (prefers-reduced-motion: reduce) {
  [data-hero-chip],
  [data-hero-headline],
  [data-reveal],
  .reveal {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }
}
```

Atenção: o `!important` no **pai** (`[data-hero-headline]`) **não** salva os filhos se o GSAP escreveu `opacity: 0` nos spans internos. Ou o CSS cobre os filhos, ou o JS não esconde quando a preferência está ligada.

4. Wrapper de página (`PageTransition` no layout) **nunca** troca Fragment ↔ `motion.div` com base em `rm` — isso remonta o site inteiro.

## Hook recomendado (`@/lib/motion`)

```ts
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false, // server snapshot — SEMPRE false
  );
}
```

- **No render:** use só o hook (`rm`) para props/estilos.
- **No `useEffect` antes de esconder/animar:** use `rm || prefersReducedMotion()`.
- Cacheie a `MediaQueryList` se houver dezenas de consumidores.

## Diagnóstico

1. `tsc --noEmit` limpo não prova ausência do bug — é runtime/CSS.
2. Reproduza: Windows → desligar "Efeitos de animação" / "Mostrar animações", depois `matchMedia('(prefers-reduced-motion: reduce)').matches` em cada browser.
3. Procure em todo o código: `useReducedMotion`, `if (rm)`, `{!rm &&`, `return null` ligado a `rm`, `gsap.set` + early return, `PageTransition` / wrappers de layout.
4. Sintomas sem mensagem de hidratação ainda podem ser Causa 2 (remount pós-hidratação) ou Causa 3 (opacity 0 permanente).
5. Se só o marquee/contador/órbita param e o resto da página está ok → Causa 1 (isenção cirúrgica).

## Checklist rápido

- [ ] Nenhuma árvore de nós (`if (rm) return …`) depende de `rm`
- [ ] Layout crítico (altura sticky, hero) vive em CSS `@media`, não em JSX condicional
- [ ] Effects que escondem leem `prefersReducedMotion()` de forma síncrona
- [ ] GSAP: `set` dentro de `context`; cleanup com `revert()`, não só `kill()`
- [ ] Conteúdo contínuo (marquee, ticker, count-up, rodízio) isento / não desligado por `rm`
- [ ] Duração de animação CSS via custom property + classe, não inline
- [ ] CSS global força opacidade 1 nos seletores que o JS revela

## Pitfalls

- `maskMode` / `WebkitMaskComposite` em wrappers não são interoperáveis entre Chromium/Firefox/Safari — para máscara alpha de degradê, `mask` / `mask-image` simples basta.
- Medir largura de marquee uma vez no mount via `scrollWidth` falha se fontes/imagens ainda não carregaram. Use `ResizeObserver` + `document.fonts.ready` + `load` das `<img>`.
- Ao duplicar conteúdo para loop infinito, coloque o espaçamento como `padding-right` (ou `pr-*`) de cada cópia, não como `gap` no container pai — assim `-50%` fecha o loop sem salto.
- Não pausar `gsap.globalTimeline` em `visibilitychange`: se o componente desmontar com a aba oculta, o resume nunca acontece e a página fica estática para sempre.
