import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Acervo Andarilho — Artefatos de Universos Infinitos",
  description:
    "Colecionáveis artesanais numerados inspirados em universos de ficção. Cada peça, uma relíquia.",
  openGraph: {
    title: "Acervo Andarilho",
    description: "Artefatos únicos de universos que você ama",
    siteName: "Acervo Andarilho",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full bg-[#0d0f10] text-[#e8eaeb] antialiased">
        {children}
      </body>
    </html>
  );
}
