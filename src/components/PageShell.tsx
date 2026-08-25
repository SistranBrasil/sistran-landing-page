import Header from './Header';
import Footer from './Footer';

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="conteudo" tabIndex={-1} className="pt-28 md:pt-36">{children}</main>
      <Footer />
    </>
  );
}
