/**
 * Padrão de analytics do projeto. Copiar para src/lib/analytics.ts.
 * Chamar `track.ctaContact('hero')` nos onClick — nunca chamar gtag direto no JSX.
 * Precisa do gtag global (via `@next/third-parties/google` no layout.tsx).
 */

declare const window: Window & { gtag?: (...args: unknown[]) => void };

export const track = {
  ctaContact: (location: string) =>
    window.gtag?.('event', 'cta_contact', { location }),
  ctaPlatform: (location: string) =>
    window.gtag?.('event', 'cta_platform', { location }),
  navLink: (label: string) =>
    window.gtag?.('event', 'nav_link', { label }),
  sectionView: (section: string) =>
    window.gtag?.('event', 'section_view', { section }),
  externalLink: (url: string) =>
    window.gtag?.('event', 'external_link', { url }),
};
