import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Background from '@/components/Background';
import SmoothScroll from '@/components/ui/SmoothScroll';
import PageTransition from '@/components/ui/PageTransition';
import AnchorFocus from '@/components/ui/AnchorFocus';
import MotionPolicyProvider from '@/components/layout/MotionPolicyProvider';
import { MotionPreferenceIntro } from '@/components/layout/MotionPreferenceIntro';
import {
  DEFAULT_MOTION_PREFERENCE,
  MOTION_PREFERENCE_STORAGE_KEY,
} from '@/lib/motionPreference';

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
  /* Interpolado de \`DEFAULT_MOTION_PREFERENCE\`, e não escrito à mão: era "full"
     literal aqui, e o default mudou para "system". Duas cópias do mesmo default
     é exatamente o tipo de divergência silenciosa que este script já avisa (na
     nota de \`motionPreference.ts\`) que precisa de replicação manual — com a
     interpolação, esta metade deixou de precisar. */
  var DEFAULT_PREFERENCE = "${DEFAULT_MOTION_PREFERENCE}";

  function resolvePreference() {
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    var preference = (stored === "system" || stored === "full" || stored === "reduce") ? stored : DEFAULT_PREFERENCE;
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

/* SIS-155 — O PAR TIPOGRÁFICO DO SITE, e a troca mais espalhada que este arquivo
   já sofreu: saiu `Instrument Serif` + `Inter`, entrou `Geist Sans` + `Geist
   Mono` (`docs/terminal-typography-prompt.md`). São duas camadas:

     • proporcional (`Geist`) — hero, títulos, navegação e parágrafo. Hierarquia
       por TAMANHO e ESPAÇAMENTO, nunca por peso: 400 é a assinatura, 500 existe
       só para navegação e ênfase intencional. É a mesma disciplina da adoção
       anterior, por outro motivo — antes porque a serifa só tinha 400, agora
       porque é a característica da referência.
     • técnica (`Geist Mono` 600) — botão, rótulo curto, categoria, metadado,
       valor, código, estado, timestamp. NUNCA parágrafo, NUNCA título longo.

   Retirar a serifa dos 76 pontos de `font-display` é reversão de identidade, não
   ajuste, e por isso tem aval datado: aprovado em 09/09/2026 por quem responde
   pela marca, registrado no ponto 1 da SIS-155. Não é decisão de implementador e
   não deve ser reaberta aqui.

   `weight` explícito nos dois, e não a variável: pedir `variable` traria o eixo
   100–900 e com ele a porta aberta para qualquer peso, que é justamente o que a
   lista fechada impede. Os cortes carregados são 400/500/600/700 na Sans e 600 na
   Mono — os dois últimos da Sans são desvio do prompt, e o ⚠️ logo acima do
   carregador traz a medição que o obrigou.

   ⚠️ ITÁLICO: a Sans carrega `['normal','italic']` de propósito. A SIS-155
   afirmava que "Geist Sans não tem corte itálico real"; a tabela deste
   carregador (`next/dist/compiled/@next/font/.../font-data.json`) declara
   `styles: ['normal','italic']` para `Geist` e `Geist Mono`, e o build baixa o
   arquivo itálico — ou seja é CORTE, não oblíquo sintetizado, e é por isso que o
   `font-synthesis: none` de `globals.css` não o apaga. Ver a nota de
   `essence-accordion.css`, onde fica o único `font-style: italic` do projeto.

   O carregamento anterior fica abaixo, comentado e não deletado (regra da casa):

     const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
     const serif = Instrument_Serif({
       weight: '400',            // a fonte NÃO é variável; omitir quebrava o build
       style: ['normal', 'italic'],
       subsets: ['latin'],
       variable: '--font-serif',
       display: 'swap',
     });

   O motivo de cada linha dele, para quem precisar reverter: `weight: '400'` era
   obrigatório porque `Instrument Serif` não é variável (`Missing weight for font
   Instrument_Serif`), e era também a razão de a hierarquia de display vir de
   tamanho — qualquer peso acima de 400 seria negrito sintetizado, que engrossa e
   borra serifa. O itálico entrava porque a home e `/transformacao-legado` já o
   usavam quando a serifa era declarada por rota (`--font-legacy-serif`). */
/* ⚠️ DESVIO DECLARADO DO PROMPT, com o número que o obrigou — o prompt pede
   "Geist Sans 400/500", e SÓ esses dois cortes deixariam 285 pontos de texto do
   site sendo desenhados em 500. Não é estimativa: é a contagem de uma sonda de
   navegador sobre o build de produção, varrendo as 12 rotas e listando cada nó de
   texto cujo `font-weight` COMPUTADO passa de 500 na família proporcional —
   600 em 178 pontos, 700 em 95, e 650/720/730/760/800 nos 12 restantes.

   Com `font-synthesis: none` em `html`, nenhum desses 285 vira negrito falso; o
   navegador simplesmente serve o corte mais próximo que existe, que seria o 500.
   Ou seja: o site não ganharia peso fabricado — ele PERDERIA a camada de ênfase
   inteira, de uma vez, calada. O `span` de ênfase do próprio hero da home
   (70,56px, peso 700) e os dois botões "Fale com a gente" (700) ficariam
   indistinguíveis do texto ao lado, e `font-semibold` — 178 dos 285 — passaria a
   não fazer nada em lugar nenhum do projeto.

   A alternativa fiel ao prompt seria RETIRAR o pedido de peso desses 285 pontos e
   passar a ênfase para a camada Mono, caixa alta e `letter-spacing`. Isso é
   redesenho de 285 marcações em JSX e CSS, muda a aparência muito além de
   tipografia, e esta issue é explicitamente "typography only". Não cabe aqui.

   Então entram 600 e 700 como CORTES REAIS (cobrem 273 dos 285; os pesos de eixo
   herdados do Inter variável — 650, 720, 730, 760, 800 — passam a resolver no 700
   real mais próximo, sem síntese). A disciplina do prompt continua valendo para o
   que se ESCREVE de novo: 400 é a assinatura, 500 a navegação, e ênfase nova vai
   para a Mono, não para um 700 a mais. Voltar ao pedido literal do prompt é apagar
   dois itens desta lista — e reabrir os 285. */
const geistSans = Geist({
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});
const geistMono = Geist_Mono({
  weight: '600',
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

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
    /* `suppressHydrationWarning` só aqui, e por um motivo específico: o script
       inline abaixo grava `data-motion` em `<html>` ANTES do primeiro paint, que
       é justamente o que evita o flash de movimento. O atributo não existe no
       HTML do servidor, então a hidratação sempre acusaria divergência nesse nó.
       O escopo é o atributo deste elemento — não silencia os filhos. */
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      {/* O `<head>` manual SAIU daqui, e o script que vivia dentro dele desceu
          para a primeira posição do `<body>`:

            <head>
              <script dangerouslySetInnerHTML={{ __html: REDUCED_MOTION_OVERRIDE_SCRIPT }} />
            </head>

          Por quê: no App Router o `<head>` é gerado pelo Next, e o que se escreve
          num `<head>` manual é hoistado pelo React 19. Na hidratação este
          `<script>` não casava com nenhum nó do HTML do servidor e era RECRIADO no
          cliente — e é esse caminho que dispara o erro "Encountered a script tag
          while rendering React component" (em `react-dom-client`, o `case
          "script"` que troca o nó por um `div` e avisa). O `<script
          type="application/ld+json"` mais abaixo nunca avisou pelo mesmo motivo
          invertido: `isScriptDataBlock` isenta tipos não executáveis.

          Por que NÃO virou `next/script` com `strategy="beforeInteractive"`: no
          app dir o `next/script` embrulha conteúdo inline em
          `(self.__next_s=self.__next_s||[]).push(...)` e deixa o runtime do Next
          executar depois — ou seja DEPOIS do primeiro paint, que é exatamente o
          flash de movimento que este script existe para evitar. Conferido no
          fonte, em `next/dist/client/script.js`.

          Por que a primeira posição do `<body>` preserva a garantia: script
          inline em `<body>` não é hoistável, então ele fica onde está e a
          hidratação o casa (sem recriação, sem aviso). Ele executa durante o
          parse do HTML, quando `<html>` já existe e nenhum elemento visível
          existe ainda — e as duas únicas coisas que ele toca são
          `document.documentElement` e `window.matchMedia`, nenhuma delas
          dependente de estar no `<head>`. As folhas de estilo do `<head>` já
          foram baixadas nesse ponto, mas o paint só acontece depois, então
          `data-motion` continua gravado antes de o CSS resolver a política. */}
      <body className="font-sans antialiased">
        {/* Antes do primeiro paint: grava `data-motion` e intercepta matchMedia.
            Tem de continuar sendo o primeiro filho do body no JSX — ver a nota
            acima. No HTML servido o React põe um `<div hidden>` vazio antes
            dele; é placeholder de Suspense, não conteúdo, e não muda a ordem de
            execução. Conferido no `curl`. */}
        <script dangerouslySetInnerHTML={{ __html: REDUCED_MOTION_OVERRIDE_SCRIPT }} />
        {/* Primeiro foco do documento, antes de qualquer coisa: quem navega por
            teclado ou leitor de tela pula o header e o menu de uma vez.
            Aponta para o `<main id="conteudo" tabIndex={-1}>` de cada rota
            (`PageShell` e a home) — sem o tabIndex o navegador move o foco para
            o body e o Tab seguinte volta ao topo. O `<main>` fica na rota, e
            nao aqui, para nao aninhar dois. */}
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <MotionPreferenceIntro />
        <Background />
        <SmoothScroll />
        <AnchorFocus />
        <MotionPolicyProvider>
          <PageTransition>{children}</PageTransition>
        </MotionPolicyProvider>
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
