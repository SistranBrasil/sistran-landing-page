import type { Metadata, Viewport } from 'next';
import { Inter, Sora } from 'next/font/google';
import './globals.css';
import Background from '@/components/Background';
import CursorGlow from '@/components/ui/CursorGlow';

// Fontes: Inter (body) + Sora (display) via next/font.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
});

const SITE_TITLE = 'Sistran Labs — Resumo do Semestre';
const SITE_DESCRIPTION =
  'Visão executiva das principais entregas da Sistran Labs no semestre: IA aplicada, modernização, cloud, segurança, automação, QA, UI/UX e produtos digitais.';

export const metadata: Metadata = {
  metadataBase: new URL('https://sistran-labs.sistran.com.br'),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: 'Sistran Labs',
  authors: [{ name: 'Sistran' }],
  icons: { icon: '/favicon-icon.png', shortcut: '/favicon-icon.png', apple: '/favicon-icon.png' },
  keywords: [
    'Sistran Labs',
    'Luminna',
    'IA aplicada',
    'modernização de sistemas',
    'cloud',
    'AWS',
    'segurança',
    'QA',
    'UI/UX',
    'produtos digitais',
    'resumo do semestre',
  ],
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Sistran Labs',
    images: [{ url: '/images/sistran-labs.png', alt: 'Sistran Labs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/images/sistran-labs.png'],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#050816',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${sora.variable}`}>
      <body className="font-sans antialiased">
        <Background />
        <CursorGlow />
        {children}
      </body>
    </html>
  );
}
