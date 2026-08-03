import type { Metadata, Viewport } from 'next';
import { Inter, Sora } from 'next/font/google';
import './globals.css';
import Background from '@/components/Background';
import SmoothScroll from '@/components/ui/SmoothScroll';
import PageTransition from '@/components/ui/PageTransition';

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
      <body className="font-sans antialiased">
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
