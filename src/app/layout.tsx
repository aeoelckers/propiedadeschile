import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Buscador de Predios SII",
  description: "Consulta direcciones, roles, avalúos y superficies de propiedades en Chile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
