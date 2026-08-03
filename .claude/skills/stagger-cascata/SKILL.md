---
name: stagger-cascata
description: Implementar animações em cascata (stagger) com GSAP para múltiplos elementos, usando delays sequenciais, grid stagger, ordem aleatória ou overlap. Use quando precisar animar cards, caracteres ou elementos múltiplos com delay entre cada um.
---

## Conceito
`stagger` anima múltiplos elementos com um delay entre cada um, criando efeito de "onda"/cascata.

## Sintaxe básica
```javascript
gsap.from(".card", {
  opacity: 0,
  y: 50,
  duration: 0.5,
  stagger: 0.2,   // 200ms entre cada card
});
```

## Sintaxe avançada (objeto)
```javascript
stagger: {
  each: 0.05,        // tempo entre cada item
  from: "start",     // origem: start | end | center | edges | random | [x,y]
  amount: 1,         // tempo total (distribui entre todos)
  grid: [5, 4],      // layout em grid (linhas, colunas)
  axis: "y",         // eixo predominante
  ease: "power1.in", // easing aplicado ao stagger
  overlap: 0.1,      // sobrepõe X% da duração do anterior
}
```

## `each` vs `amount`
- `each: 0.1` → 0.1s entre cada item (total = N * 0.1)
- `amount: 1` → total de 1s distribuído entre todos (each = 1/N)

## Exemplos reais

### Cards em cascata (Stranger Things)
```javascript
gsap.from(".card", {
  opacity: 0,
  filter: "blur(10px)",
  stagger: 0.3,
  scrollTrigger: { trigger: ".cards", start: "0% 80%", end: "100% 70%", scrub: true },
});
```

### Chars com ordem aleatória (WebHub)
```javascript
gsap.from(split.chars, {
  filter: "blur(20px)",
  opacity: 0,
  duration: 0.3,
  stagger: { each: 0.02, from: "random" },
});
```

### Chars com overlap (Pringles)
```javascript
gsap.from(text.chars, {
  y: "100%",
  opacity: 0,
  duration: 0.5,
  stagger: { each: 0.05, overlap: 0.1 },
});
```

### Barras subindo em sequência (WebHub)
```javascript
tl.from(".transition div", {
  height: "0%",
  duration: 1,
  stagger: 0.08,
});
```

### Grid stagger (cards em tabela)
```javascript
gsap.from(".item", {
  opacity: 0, scale: 0.5,
  duration: 0.6,
  stagger: {
    grid: [4, 5],       // 4 linhas, 5 colunas
    from: "center",     // do centro para fora
    amount: 1.5,
  },
});
```

## From values
- `"start"` (default) — índice 0 começa primeiro
- `"end"` — último começa primeiro
- `"center"` — centro começa, bordas depois
- `"edges"` — bordas começam, centro depois
- `"random"` — ordem aleatória
- número (0-1) — índice normalizado como origem
- `[x, y]` em grid — posição específica

## Pitfalls
- `stagger` funciona apenas em targets múltiplos (array de elementos).
- Combinar com `scrub` distribui o tempo ao longo do scroll — quanto maior `stagger`, mais scroll necessário.
- Em grids responsivos, `grid` pode calcular errado; prefira `from: "center"` com `axis`.
