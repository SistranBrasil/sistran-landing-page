# Typography system

## Identified families

The current Waabi site is documented as pairing:

| Role | Exact family | Weight | Primary use |
| --- | --- | --- | --- |
| Display | F37 Zagma | 400 | Hero, section titles, editorial statements |
| Body/UI | Neue Haas Grotesk | 400, 500 | Paragraphs, navigation, buttons, labels, metadata |

Official acquisition pages:

- F37 Zagma: https://f37.com/buying-options/f37-zagma
- F37 trial access: https://f37.com/account/trial-downloads
- F37 licence information: https://f37.com/information
- Neue Haas Grotesk: https://commercialtype.com/catalog/neue_haas_grotesk

Both exact families are commercial. For a public website, obtain a licence that explicitly permits web embedding. Do not copy files served by `waabi.ai`, use third-party download mirrors, or hotlink Waabi's font URLs.

## Open-source substitute pair

| Role | Substitute | Weight | Source |
| --- | --- | --- | --- |
| Display | Instrument Serif | 400 | https://fonts.google.com/specimen/Instrument+Serif |
| Body/UI | Inter | 400, 500 | https://fonts.google.com/specimen/Inter |

This substitute recreates the contrast between expressive editorial headlines and neutral interface copy. It is not a pixel-identical replacement for the commercial pair.

## Role tokens

Use these values as a practical Waabi-inspired system. The large sizes and compact leading are the most important visual characteristics.

| Token | Family | Fluid size | Line height | Letter spacing | Weight |
| --- | --- | --- | --- | --- | --- |
| `display-xl` | Display | `clamp(4rem, 10.4vw, 9.375rem)` | `0.85` | `-0.048em` | 400 |
| `display` | Display | `clamp(3.5rem, 7vw, 5rem)` | `0.90` | `-0.040em` | 400 |
| `heading-lg` | Display | `clamp(2.75rem, 5vw, 3.75rem)` | `1.05` | `-0.030em` | 400 |
| `heading` | Display | `clamp(2rem, 3.5vw, 2.5rem)` | `1.10` | `-0.020em` | 400 |
| `heading-sm` | Display | `clamp(1.5rem, 2.5vw, 2rem)` | `1.20` | `-0.015em` | 400 |
| `body-lg` | Body/UI | `clamp(1.125rem, 1.5vw, 1.5rem)` | `1.45` | `0` | 400 |
| `body` | Body/UI | `1rem` | `1.60` | `0.005em` | 400 |
| `label` | Body/UI | `0.75rem` | `1.40` | `0.020em` | 500 |
| `caption` | Body/UI | `0.625rem` | `1.40` | `0.010em` | 400 |

The Waabi reference reaches roughly 130–150px for major headlines, 40–80px for content headings, and 10–15px for compact interface text. The fluid tokens above retain that contrast while protecting smaller screens and ordinary reading text.

## Composition rules

- Keep hero copy concise enough to form one to three sculptural lines.
- Use `text-wrap: balance` for titles and `text-wrap: pretty` for paragraphs when supported.
- Cap display measure around `8ch`–`12ch`; cap body measure around `55ch`–`68ch`.
- Prefer regular display weight. The personality comes from the face, scale, tracking, and line height—not boldness.
- Use `font-synthesis: none` on the document to prevent fake bold or italic faces.
- Use optical kerning: `font-kerning: normal` and `text-rendering: optimizeLegibility` where appropriate.
- If a heading clips, fix its container or overflow. Do not loosen the headline until its compact silhouette is actually the cause.
- Avoid uppercase for large display headlines. Uppercase is acceptable for short UI labels with slightly open tracking.
- Test `ã`, `á`, `é`, `í`, `ó`, `ú`, `ç`, quotation marks, numerals, and punctuation before adopting a purchased or trial cut.

## Responsive behavior

- Below 768px, allow display sizes to fall through `clamp()`; do not hardcode the desktop 150px value.
- On narrow screens, relax `display-xl` tracking to about `-0.035em` only if letter collisions occur.
- Never reduce paragraph text merely to preserve a desktop line break.
- Avoid manual `<br>` tags in localized content. If an art-directed hero requires one, make it responsive and keep the unbroken text accessible.

## Acceptance checklist

- DevTools shows the intended face on each semantic role.
- No faux 600/700 weight appears when only 400/500 are loaded.
- The hero has compact stacked lines without overlapping ascenders or descenders.
- Portuguese accents and punctuation render correctly.
- Mobile headings remain inside the viewport at 320px width.
- There is no noticeable flash-induced layout jump beyond the chosen fallback behavior.
- Paragraphs, forms, navigation, and buttons remain readable.
