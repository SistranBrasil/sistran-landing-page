import Header from './Header';
import Footer from './Footer';
import ScrollSpy from './ui/ScrollSpy';

export default function PageShell({ children }: { children: React.ReactNode }) {
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
      <main id="conteudo" tabIndex={-1} className="pt-28 md:pt-36">{children}</main>
      <Footer />
    </>
  );
}
