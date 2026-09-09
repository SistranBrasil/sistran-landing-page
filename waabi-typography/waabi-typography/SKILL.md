---
name: waabi-typography
description: Reproduce the Waabi-inspired editorial typography system in web projects using either the exact licensed fonts or close open-source substitutes. Use for typography audits, font installation, type tokens, responsive hierarchy, and implementation in CSS, Next.js, or Tailwind; do not use to copy Waabi's full visual identity or obtain proprietary font files from third-party sites.
---

# Waabi Typography

Apply the typographic character of `waabi.ai` without changing the project's content, colors, layout, components, or motion unless the user asks for those changes.

## Working modes

Choose one mode before editing:

- **Exact/licensed:** `F37 Zagma` Regular 400 for display text and `Neue Haas Grotesk` 400/500 for body and UI. Use only font files and web rights supplied by the project owner.
- **Open-source:** `Instrument Serif` 400 for display text and `Inter` 400/500 for body and UI. Use this mode by default when licensed files are absent and the user has not required an exact match.

Never download, extract, hotlink, redistribute, convert, or commit proprietary font files obtained from another website. A trial font is for evaluation only unless its trial licence explicitly permits the intended use.

## Workflow

1. Inspect the framework, global styles, current font loading, existing design tokens, and reusable heading/text components.
2. Select the exact or open-source mode. If the exact mode was requested but licensed files are absent, explain what must be purchased and stop only the font-file-dependent part; typography tokens and integration scaffolding may still be prepared.
3. Read [references/typography-system.md](references/typography-system.md) for the roles, scale, spacing, responsive behavior, and quality rules.
4. Read only the relevant implementation section in [references/implementation.md](references/implementation.md): CSS, Next.js, or Tailwind.
5. Apply fonts centrally through variables/tokens. Avoid scattered one-off `font-family`, size, and tracking declarations.
6. Map semantic roles rather than globally turning every heading into display type. Reserve the serif display face for `h1`–`h3`, editorial statements, and intentionally large copy; use the grotesk/sans face for paragraphs, navigation, buttons, labels, forms, metadata, and captions.
7. Preserve text, hierarchy, accessibility, and localization. Do not force line breaks in translations; use controlled wrappers only when the design requires them.
8. Verify desktop and mobile rendering, font loading, fallback behavior, synthetic weights, clipping, layout shifts, accented Portuguese characters, and long words.

## Required outcome

- A two-family system with a dramatic editorial display face and a restrained grotesk UI face.
- Display text uses regular weight, tight tracking, and compact line height; it must not become artificially bold.
- UI text uses 400/500 with modest positive tracking at small sizes.
- Responsive `clamp()` values preserve the hierarchy without 150px text overflowing small screens.
- `font-display: swap` or the framework equivalent is enabled.
- Only the weights actually used by the project are loaded.
- Fallback stacks remain usable if a webfont fails.

## Boundaries

- Do not claim that an open-source substitute is the exact Waabi font.
- Do not install fonts from unofficial download aggregators.
- Do not alter brand colors, imagery, component geometry, or page copy under a typography-only request.
- Do not use the display serif below 24px for paragraphs or controls.
- Do not use body text smaller than 15px for ordinary reading; the small 10–12px treatment is limited to captions, metadata, and compact UI.

For a standalone copy-and-paste implementation request, use [references/claude-code-prompt.md](references/claude-code-prompt.md).
