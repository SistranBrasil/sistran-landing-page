---
name: gradientes-layers
description: Implementar composição visual com gradientes CSS (linear, radial, conic), layering com pseudo-elementos, z-index e overlays para criar profundidade em landing pages sem assets extras
---

## Conceito
Composição de camadas visuais com gradientes, pseudo-elementos e z-index para criar profundidade sem precisar de imagens/assets extras.

## Gradientes lineares
```css
/* Sintaxe básica */
background: linear-gradient(100deg, #2ac4ff 2.57%, #0d88bb 95.91%);

/* Direções */
background: linear-gradient(to right, red, blue);
background: linear-gradient(180deg, #000 12%, transparent 62%);  /* fade down */
background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
```

**Uso comum**: darken gradient sobre hero para legibilidade do texto:
```css
.hero .midiaBackground::before {
  content: "";
  position: absolute; inset: 0;
  background: linear-gradient(180deg, #000 12%, rgba(0,0,0,0) 62%);
  z-index: 1;
}
```

## Gradientes radiais
```css
background: radial-gradient(circle at center, #fff, #000);
background: radial-gradient(ellipse at 20% 50%, red, transparent 70%);
```

## Gradientes cônicos (conic)
```css
background: conic-gradient(from 0deg, red, yellow, green, blue, red);
```
Útil para loading spinners, gráficos de pizza.

## Múltiplas camadas de background
```css
.elemento {
  background:
    linear-gradient(to top, rgba(0,0,0,0.7), transparent),
    url("imagem.jpg");
  background-size: cover;
}
```
Primeira listada fica no topo. Separe com vírgula.

## Layering com pseudo-elementos
```css
.hero {
  position: relative;
}
.hero::before {
  content: "";
  position: absolute; inset: 0;
  background: linear-gradient(180deg, #000, transparent 60%);
  z-index: 1;
  pointer-events: none;
}
.hero::after {
  content: "";
  position: absolute; inset: 0;
  background: url("grain.png") repeat;
  mix-blend-mode: overlay;
  opacity: 0.4;
  z-index: 2;
  pointer-events: none;
}
.hero .conteudo { position: relative; z-index: 3; }
```

## Box-shadow inset (bordas suaves)
```css
.cardSubtitulo::before {
  content: "";
  position: absolute; inset: 0;
  box-shadow:
    -1px -2px 0 0 rgba(255, 216, 194, 0.2) inset,
    1px 2px 0 0 rgba(255, 216, 194, 0.2) inset;
  border-radius: inherit;
  pointer-events: none;
}
```
Cria "luz/sombra" interna sem border.

## Gradiente animado com keyframes
```css
@keyframes flow {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}
.banner {
  background: linear-gradient(90deg, red, blue, green, red);
  background-size: 300% 100%;
  animation: flow 8s infinite linear;
}
```

## Z-index: stacking orders
```css
.hero picture     { z-index: 1; }  /* fundo */
.hero .overlay    { z-index: 2; }  /* gradient darken */
.hero .conteudo   { z-index: 3; }  /* texto */
.hero .transition { z-index: 9; }  /* efeito topo */
```

Boas práticas:
- Usar valores baixos em incremento (1, 2, 3)
- Reservar 9+ para overlays globais (menu, modal, preloader)
- Agrupar em "camadas lógicas" no CSS

## Pitfalls
- Pseudo-elementos precisam de `content: ""` e `position: absolute` para cobrir o pai.
- `pointer-events: none` em overlays para não bloquear cliques no conteúdo.
- `position: relative` no pai é necessário para filhos `absolute`.
- Gradientes animados pesados: prefira `background-position` em vez de gradient strings.
