import Header from './Header';
import Footer from './Footer';
import ScrollSpy from './ui/ScrollSpy';

/* SIS-204 — `classeDoMain` existe para uma rota poder pintar o PRÓPRIO plano de
   fundo no `<main>`, e é uma prop e não um `<div>` novo de propósito: o plano é
   `background-attachment: fixed` e a camada de atmosfera é `position: fixed`, então
   um invólucro a mais entre o `<main>` e as seções não quebraria nada hoje, mas
   seria um nó sem função — e `#conteudo` já é o embrulho de tudo o que a rota tem
   entre o Header e o Footer. A home faz o mesmo sem esta prop porque monta o
   próprio `<main>` (`page.tsx`, `home-canvas`), fora deste shell.
   Rota que não passa nada fica IDÊNTICA ao que era: a classe base continua sendo
   só o `padding` do topo. */
export default function PageShell({
  children,
  classeDoMain,
}: {
  children: React.ReactNode;
  classeDoMain?: string;
}) {
  return (
    <>
      <Header />
      {/* SIS-100 — o navegador lateral de seções passa a existir em TODAS as
          rotas que usam este shell, sem prop nenhuma: ele lê o `pathname` e
          busca as seções em `src/data/pageSections.ts`. Rota sem entrada no mapa
          (página curta, legal, ou dinâmica como `/blog/[slug]`) não renderiza
          nada — é o critério de "3+ seções", decidido no mapa e não aqui.

          Fica irmão do `<main>`, e nunca dentro dele: é `position: fixed`, que
          morre sob ancestral com `transform`/`filter`, e várias rotas têm seções
          animadas embrulhando conteúdo. */}
      <ScrollSpy />
      <main
        id="conteudo"
        tabIndex={-1}
        className={`pt-28 md:pt-36${classeDoMain ? ` ${classeDoMain}` : ''}`}
      >
        {children}
      </main>
      <Footer />
    </>
  );
}
