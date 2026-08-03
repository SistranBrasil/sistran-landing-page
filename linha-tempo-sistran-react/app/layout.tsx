import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nossa História | Sistran",
  description:
    "Linha do tempo interativa da evolução da Sistran no mercado de seguros.",
  other: {
    "codex-preview": "development",
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
      <body>{children}</body>
    </html>
  );
}
