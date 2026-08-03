import Header from './Header';
import Footer from './Footer';

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="pt-28 md:pt-36">{children}</main>
      <Footer />
    </>
  );
}
