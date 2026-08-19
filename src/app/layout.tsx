import type { Metadata, Viewport } from 'next';
import { Inter, Sora } from 'next/font/google';
import './globals.css';
import Background from '@/components/Background';
import SmoothScroll from '@/components/ui/SmoothScroll';
import PageTransition from '@/components/ui/PageTransition';
import { MotionPreferenceIntro } from '@/components/layout/MotionPreferenceIntro';
import { MOTION_PREFERENCE_STORAGE_KEY } from '@/lib/motionPreference';

/**
 * Roda antes do primeiro paint, por isso é texto inline e não módulo: precisa
 * gravar `data-motion` em `<html>` antes de qualquer folha de estilo resolver a
 * política de movimento, e antes de qualquer bundle ler `matchMedia`.
 *
 * Faz duas coisas:
 * 1. grava/remove `data-motion="reduce"` em `<html>` (o CSS lê isso);
 * 2. embrulha `window.matchMedia` para que toda consulta a
 *    `prefers-reduced-motion` devolva a preferência RESOLVIDA. É o que faz o
 *    `useReducedMotion` de `src/lib/motion.ts` e o `SmoothScroll` honrarem a
 *    escolha do visitante sem alterar uma linha deles.
 *
 * O algoritmo de resolução é espelhado de `resolveReducedMotion()` em
 * `src/lib/motionPreference.ts` — mudar lá exige mudar aqui.
 */
const REDUCED_MOTION_OVERRIDE_SCRIPT = `
(function () {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
  var originalMatchMedia = window.matchMedia.bind(window);
  var FEATURE_PATTERN = /prefers-reduced-motion/i;
  var NO_PREFERENCE_PATTERN = /prefers-reduced-motion\\s*:\\s*no-preference/i;
  var STORAGE_KEY = "${MOTION_PREFERENCE_STORAGE_KEY}";

  function resolvePreference() {
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    var preference = (stored === "system" || stored === "full" || stored === "reduce") ? stored : "full";
    if (preference === "reduce") return true;
    if (preference === "full") return false;
    try { return originalMatchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; }
  }

  var resolvedReduced = resolvePreference();

  try {
    if (resolvedReduced) document.documentElement.setAttribute("data-motion", "reduce");
    else document.documentElement.removeAttribute("data-motion");
  } catch (e) {}

  function wrapEvent(realEvent, fakeList, forcedMatches) {
    return {
      matches: forcedMatches,
      media: realEvent.media,
      target: fakeList,
      currentTarget: fakeList,
      type: realEvent.type,
      bubbles: realEvent.bubbles,
      cancelable: realEvent.cancelable,
      timeStamp: realEvent.timeStamp,
      preventDefault: function () { if (realEvent.preventDefault) realEvent.preventDefault(); },
      stopPropagation: function () { if (realEvent.stopPropagation) realEvent.stopPropagation(); },
    };
  }

  window.matchMedia = function (query) {
    var realList = originalMatchMedia(query);
    if (typeof query !== "string" || !FEATURE_PATTERN.test(query)) return realList;

    var forcedMatches = NO_PREFERENCE_PATTERN.test(query) ? !resolvedReduced : resolvedReduced;
    var wrappedListeners = new Map();
    var fakeList = {};

    Object.defineProperties(fakeList, {
      media: { get: function () { return realList.media; }, enumerable: true },
      matches: { get: function () { return forcedMatches; }, enumerable: true },
      onchange: {
        get: function () { return realList.onchange; },
        set: function (fn) {
          if (typeof fn !== "function") { realList.onchange = fn; return; }
          realList.onchange = function (event) { fn.call(fakeList, wrapEvent(event, fakeList, forcedMatches)); };
        },
        enumerable: true,
      },
      addEventListener: {
        value: function (type, listener, options) {
          if (type !== "change" || typeof listener !== "function") {
            return realList.addEventListener(type, listener, options);
          }
          var wrapped = function (event) { listener.call(fakeList, wrapEvent(event, fakeList, forcedMatches)); };
          wrappedListeners.set(listener, wrapped);
          realList.addEventListener(type, wrapped, options);
        },
      },
      removeEventListener: {
        value: function (type, listener, options) {
          if (type !== "change" || typeof listener !== "function") {
            return realList.removeEventListener(type, listener, options);
          }
          var wrapped = wrappedListeners.get(listener);
          if (wrapped) { realList.removeEventListener(type, wrapped, options); wrappedListeners.delete(listener); }
        },
      },
      addListener: {
        value: function (listener) {
          if (typeof listener !== "function") return;
          var wrapped = function (event) { listener.call(fakeList, wrapEvent(event, fakeList, forcedMatches)); };
          wrappedListeners.set(listener, wrapped);
          if (realList.addListener) realList.addListener(wrapped);
        },
      },
      removeListener: {
        value: function (listener) {
          var wrapped = wrappedListeners.get(listener);
          if (wrapped && realList.removeListener) { realList.removeListener(wrapped); wrappedListeners.delete(listener); }
        },
      },
      dispatchEvent: { value: function (event) { return realList.dispatchEvent(event); } },
    });

    return fakeList;
  };
})();
`;

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const sora = Sora({ subsets: ['latin'], variable: '--font-sora', display: 'swap' });

const SITE_TITLE = 'Sistran · Beyond Technology';
const SITE_DESCRIPTION =
  'Sistran: tecnologia, serviços e consultoria para o mercado de seguros. Entrega com alta performance e comprometimento.';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.sistran.com.br'),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: 'Sistran',
  authors: [{ name: 'Sistran' }],
  keywords: [
    'Sistran',
    'seguros',
    'tecnologia',
    'consultoria',
    'seguradoras',
    'sustentação',
    'staff augmentation',
    'ERP seguros',
  ],
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Sistran',
    images: [{ url: '/images/sistran-corp-logo.png', alt: 'Sistran' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/images/sistran-corp-logo.png'],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/images/sistran-logo.png',
    shortcut: '/images/sistran-logo.png',
    apple: '/images/sistran-logo.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#004D8A',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${sora.variable}`}>
      <head>
        {/* Antes do primeiro paint: grava `data-motion` e intercepta matchMedia. */}
        <script dangerouslySetInnerHTML={{ __html: REDUCED_MOTION_OVERRIDE_SCRIPT }} />
      </head>
      <body className="font-sans antialiased">
        <MotionPreferenceIntro />
        <Background />
        <SmoothScroll />
        <PageTransition>{children}</PageTransition>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Sistran',
              url: 'https://www.sistran.com.br',
              logo: 'https://www.sistran.com.br/images/sistran-corp-logo.png',
              description: SITE_DESCRIPTION,
              sameAs: ['https://www.linkedin.com/company/sistran/'],
              foundingDate: '1988',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'R. Dr. Geraldo Campos Moreira, 240',
                addressLocality: 'São Paulo',
                addressRegion: 'SP',
                addressCountry: 'BR',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+55-11-2192-4400',
                contactType: 'customer service',
                areaServed: 'BR',
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
