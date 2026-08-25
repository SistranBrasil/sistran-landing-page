import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sistran-river-park-3d.sistran-5825.chatgpt.site"),
  title: "Sistran River Park 3D",
  description:
    "Modelo 3D interativo do edifício Sistran River Park com visualização completa em 360 graus.",
  openGraph: {
    title: "Sistran River Park 3D",
    description: "Explore o edifício em um modelo 3D interativo com giro completo em 360°.",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/og.png",
        width: 1734,
        height: 907,
        alt: "Sistran River Park 3D — modelo interativo em 360 graus",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sistran River Park 3D",
    description: "Explore o edifício em um modelo 3D interativo com giro completo em 360°.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
