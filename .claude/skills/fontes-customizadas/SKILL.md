---
name: fontes-customizadas
description: Implementar fontes customizadas com @font-face (woff2, ttf), Google Fonts, variable fonts, preload e font-display para tipografia de marca em landing pages
---

## Conceito
Carregar fontes próprias (`.ttf`, `.woff2`) locais ou do Google Fonts para tipografia de marca.

## `@font-face` local (WebHub, projeto-amigos-4)
```css
@font-face {
  font-family: "Clash";
  src: url("assets/fonts/ClashDisplay-Bold.ttf") format("truetype");
  font-weight: 700;
  font-style: normal;
  font-display: swap;   /* importante! */
}

@font-face {
  font-family: "Clash";
  src: url("assets/fonts/ClashDisplay-Medium.ttf") format("truetype");
  font-weight: 500;
}

/* Múltiplos pesos registrados com mesmo font-family */
```

Uso:
```css
h1 { font-family: "Clash", "Inter", sans-serif; font-weight: 700; }
```

## `font-display` values
| Valor | Comportamento |
|-------|---------------|
| `auto` | Padrão do browser |
| `block` | Texto invisível até font carregar (FOIT) |
| `swap` | Mostra fallback, troca quando carregar (FOUT) |
| `fallback` | Breve bloqueio, depois fallback |
| `optional` | Usa fonte só se baixar rápido |

**Recomendação**: `swap` para body, `optional` para decorativas.

## Google Fonts
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet" />
```

Ou via `@import` no CSS (menos performático):
```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap");
```

## Formatos (preferência)
1. **WOFF2** — menor (~30% menos que WOFF), suporte universal moderno
2. **WOFF** — fallback para browsers antigos
3. **TTF/OTF** — maior, evitar na web

```css
@font-face {
  font-family: "Clash";
  src:
    url("Clash.woff2") format("woff2"),
    url("Clash.woff") format("woff");
  font-weight: 400;
  font-display: swap;
}
```

Converter TTF → WOFF2:
```bash
# Via fonttools (Python)
pip install fonttools brotli
pyftsubset input.ttf --flavor=woff2 --output-file=output.woff2
```

Ou via [fontsquirrel.com/tools/webfont-generator](https://www.fontsquirrel.com/tools/webfont-generator).

## Variable fonts
Um arquivo com múltiplos pesos/larguras:
```css
@font-face {
  font-family: "Inter";
  src: url("Inter.var.woff2") format("woff2-variations");
  font-weight: 100 900;   /* range suportado */
  font-stretch: 50% 200%;
}
```

Uso:
```css
h1 { font-family: "Inter"; font-weight: 347; }  /* qualquer valor no range */
```

## Preload crítico
```html
<link rel="preload" href="Clash-Bold.woff2" as="font" type="font/woff2" crossorigin />
```

Evita FOUT (flash of unstyled text) para fonte principal.

## `font-feature-settings` (recursos OpenType)
```css
.texto {
  font-feature-settings: "kern" 1, "liga" 1, "ss01" 1;  /* stylistic set */
}
```

## Fallback stack robusto
```css
body {
  font-family:
    "Clash",
    "Inter",
    -apple-system,          /* Safari/iOS */
    BlinkMacSystemFont,     /* Chrome Mac */
    "Segoe UI",             /* Windows */
    Roboto,                 /* Android */
    sans-serif;
}
```

## Pitfalls
- `font-display: block` sem fallback causa "texto invisível" por até 3s (ruim para UX).
- Carregar muitos pesos pesa — limitar a 2-3 essenciais.
- Self-hosting é mais rápido que Google Fonts (1 request a menos).
- Em `font-family`, nomes com espaço precisam de aspas: `"Clash Display"`.
- CORS: fontes hospedadas em domínio diferente precisam de header `Access-Control-Allow-Origin`.
