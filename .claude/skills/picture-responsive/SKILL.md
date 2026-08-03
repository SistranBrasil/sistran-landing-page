---
name: picture-responsive
description: Implementar elemento picture com srcset, sizes, formatos modernos (webp, avif) e lazy loading para servir imagens responsivas otimizadas em landing pages
---

## Conceito
`<picture>` serve imagens diferentes conforme viewport/DPR/formato suportado, economizando bandwidth e melhorando LCP (Largest Contentful Paint).

## Sintaxe básica (projeto-amigos-4)
```html
<picture data-speed="0.6">
  <source media="(max-width: 600px)" srcset="imagens/bg-1-mobile.webp" />
  <img src="imagens/bg-1.webp" alt="" />
</picture>
```

- Browser avalia `<source>` de cima para baixo; primeiro match vence.
- `<img>` é fallback obrigatório.

## Múltiplos formatos
```html
<picture>
  <source type="image/avif" srcset="foto.avif" />
  <source type="image/webp" srcset="foto.webp" />
  <img src="foto.jpg" alt="" />
</picture>
```

Prioridade: AVIF > WebP > JPG (tamanho crescente, suporte decrescente).

## Densidade de pixels (retina)
```html
<img
  src="foto.jpg"
  srcset="foto.jpg 1x, foto@2x.jpg 2x, foto@3x.jpg 3x"
  alt=""
/>
```

## `srcset` + `sizes` (flexível)
```html
<img
  srcset="small.jpg 400w, medium.jpg 800w, large.jpg 1200w"
  sizes="(max-width: 600px) 100vw,
         (max-width: 1024px) 50vw,
         33vw"
  src="medium.jpg"
  alt=""
/>
```

- `srcset` lista arquivos + largura real
- `sizes` diz qual tamanho o browser deve escolher baseado em viewport
- Browser escolhe o menor arquivo que ainda renderiza com boa qualidade

## Lazy loading nativo
```html
<img src="..." loading="lazy" alt="" />
<img src="..." loading="eager" alt="" />  <!-- above the fold -->
```

## Decoding hints
```html
<img src="..." decoding="async" alt="" />  <!-- não bloqueia -->
<img src="..." decoding="sync" alt="" />   <!-- bloqueia (hero critical) -->
```

## Aspect-ratio + object-fit
```css
img {
  width: 100%;
  aspect-ratio: 16/9;   /* reserva espaço antes de carregar (evita CLS) */
  object-fit: cover;    /* preenche sem distorcer */
  object-position: center;
}
```

## `fetchpriority`
```html
<img src="hero.webp" fetchpriority="high" alt="" />   <!-- LCP -->
<img src="below.webp" fetchpriority="low" alt="" />
```

## Preload crítico
```html
<link rel="preload" as="image" href="hero.webp"
      imagesrcset="hero-400.webp 400w, hero-800.webp 800w"
      imagesizes="100vw" />
```

## Formatos modernos — conversão
```bash
# JPG → WebP
cwebp -q 80 input.jpg -o output.webp

# JPG → AVIF (via avifenc ou Squoosh CLI)
npx @squoosh/cli --avif '{"cqLevel":33}' input.jpg
```

## Pitfalls
- `<source>` sem `media` é sempre um fallback — coloque por último antes do `<img>`.
- `srcset` com `w` exige `sizes` (caso contrário é ignorado).
- Safari antigo não suporta AVIF — sempre ter JPG fallback.
- `object-fit` não funciona em IE11 (se ainda suportar, usar polyfill).
- Esquecer `alt=""` quebra acessibilidade — mesmo para decorativas use `alt=""` (vazio).
