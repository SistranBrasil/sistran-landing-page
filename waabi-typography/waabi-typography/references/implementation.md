# Implementation

Use only the section matching the project's stack. File names for commercial fonts are examples; preserve the names and formats supplied by the foundry unless the project's licence permits otherwise.

## CSS with licensed local files

Place licensed `.woff2` files in the project's own font directory, such as `public/fonts/`. Never point `src` to Waabi's servers.

```css
@font-face {
  font-family: "F37 Zagma";
  src: url("/fonts/F37Zagma-Regular.woff2") format("woff2");
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: "Neue Haas Grotesk";
  src: url("/fonts/NeueHaasGrotesk-Regular.woff2") format("woff2");
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: "Neue Haas Grotesk";
  src: url("/fonts/NeueHaasGrotesk-Medium.woff2") format("woff2");
  font-style: normal;
  font-weight: 500;
  font-display: swap;
}
```

## CSS with open-source substitutes

For production, either load the families through the framework or self-host the official Google Fonts downloads. A direct stylesheet import is acceptable for a quick prototype:

```css
@import url("https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500&display=swap");
```

## Shared tokens and classes

```css
:root {
  --font-display: "F37 Zagma", "Instrument Serif", Georgia, serif;
  --font-sans: "Neue Haas Grotesk", Inter, "Helvetica Neue", Arial, sans-serif;
}

html {
  font-family: var(--font-sans);
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

.type-display-xl {
  max-width: 10ch;
  font-family: var(--font-display);
  font-size: clamp(4rem, 10.4vw, 9.375rem);
  font-weight: 400;
  line-height: 0.85;
  letter-spacing: -0.048em;
  text-wrap: balance;
}

.type-display {
  max-width: 12ch;
  font-family: var(--font-display);
  font-size: clamp(3.5rem, 7vw, 5rem);
  font-weight: 400;
  line-height: 0.9;
  letter-spacing: -0.04em;
  text-wrap: balance;
}

.type-heading {
  font-family: var(--font-display);
  font-size: clamp(2rem, 3.5vw, 2.5rem);
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

.type-body {
  max-width: 65ch;
  font-family: var(--font-sans);
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.6;
  letter-spacing: 0.005em;
  text-wrap: pretty;
}

.type-label {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: 0.02em;
}

@media (max-width: 48rem) {
  .type-display-xl {
    letter-spacing: -0.035em;
  }
}
```

## Next.js with open-source substitutes

In `app/layout.tsx` or `src/app/layout.tsx`:

```tsx
import { Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-sans",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

When `next/font` defines the variables, do not redeclare them in `:root`. Use them directly in typography classes.

## Next.js with licensed local files

Store the licensed files under `src/app/fonts/` when the layout is `src/app/layout.tsx`, then use `next/font/local`:

```tsx
import localFont from "next/font/local";

const display = localFont({
  src: "./fonts/F37Zagma-Regular.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-display",
  display: "swap",
});

const sans = localFont({
  src: [
    { path: "./fonts/NeueHaasGrotesk-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/NeueHaasGrotesk-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});
```

Apply both variable classes to `<html>` exactly as in the open-source example.

## Tailwind CSS v4

After the font variables exist, expose semantic families in the global stylesheet. To avoid a custom-property name collision, use `--font-waabi-display` and `--font-waabi-sans` as the variables created by the font loader, then map them:

```css
@import "tailwindcss";

@theme inline {
  --font-display: var(--font-waabi-display);
  --font-sans: var(--font-waabi-sans);
}
```

Example usage:

```tsx
<h1 className="max-w-[10ch] text-balance font-display text-[clamp(4rem,10.4vw,9.375rem)] font-normal leading-[.85] tracking-[-.048em]">
  Inteligência que transforma.
</h1>

<p className="max-w-[65ch] font-sans text-base font-normal leading-[1.6] tracking-[.005em]">
  Texto de apoio legível e objetivo.
</p>
```

For Tailwind v3, extend `fontFamily` in `tailwind.config` instead of using `@theme`.
