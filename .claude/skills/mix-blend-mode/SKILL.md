---
name: mix-blend-mode
description: Implementar efeitos de fusão de camadas com mix-blend-mode e background-blend-mode. Use quando precisar header adaptativo, texto luminoso/neon, texturas, overlays criativos ou efeitos de contraste.
---

## Conceito
`mix-blend-mode` define como um elemento se funde com a camada abaixo. Usado para efeitos de texto luminoso, header adaptativo, overlays criativos.

## Valores mais usados em landing pages

### `difference` — Header adaptativo
```css
header {
  position: fixed;
  inset: 0 0 auto 0;
  mix-blend-mode: difference;
  color: white;
  z-index: 9;
}
```
Resultado: texto branco sobre fundo branco vira preto automaticamente. Ideal para header que passa sobre fundos variados.

### `color-dodge` — Texto luminoso/neon
```css
.textoInfinito h3 {
  color: rgb(191, 191, 191);
  mix-blend-mode: color-dodge;
}
```
Resultado: texto "queima" cores do fundo, ficando brilhante/saturado.

Também usado em Pringles:
```css
.pringlesFundo {
  mix-blend-mode: color-dodge;
  opacity: 0.8;
}
```

### `multiply` — Texturas/tingir
```css
.textura {
  background: url("grain.png");
  mix-blend-mode: multiply;
}
```
Mantém pretos, clareia brancos. Usado para papel, grão, sujeira.

### `screen` — Inverso de multiply
Clareia. Útil para luz, partículas brancas.

### `overlay` — Contraste
Combina multiply + screen. Aumenta contraste.

## Tabela de referência
| Modo | Efeito |
|------|--------|
| `normal` | Sem mistura (default) |
| `multiply` | Escurece (branco = transparente) |
| `screen` | Clareia (preto = transparente) |
| `overlay` | Contraste (meio cinza = transparente) |
| `darken` | Mantém só pixels escuros |
| `lighten` | Mantém só pixels claros |
| `color-dodge` | Efeito luminoso forte |
| `color-burn` | Queima cores escuras |
| `difference` | Inverte baseado no fundo |
| `exclusion` | Como difference mas menos intenso |
| `hue` | Usa matiz do topo, saturação/luminância do fundo |
| `saturation` | Usa saturação do topo |
| `color` | Hue + saturation |
| `luminosity` | Inverso de color |

## `background-blend-mode` vs `mix-blend-mode`
- `mix-blend-mode`: mistura o elemento com a camada abaixo
- `background-blend-mode`: mistura múltiplas images/gradients no mesmo background do elemento

```css
.div {
  background:
    url("img.jpg"),
    linear-gradient(red, blue);
  background-blend-mode: multiply;
}
```

## Pitfalls
- `mix-blend-mode` **NÃO funciona** se o elemento ou ancestral tem `isolation: isolate`, `z-index` com novo stacking context, ou `transform`/`filter` aplicados (às vezes).
- Em alguns browsers, `position: fixed` com blend-mode pode flickar — teste em Safari.
- Performance: blend modes usam GPU compositor — evite em elementos grandes animados constantemente.
- Legibilidade: texto com `color-dodge` pode ficar ilegível sobre fundos claros.
