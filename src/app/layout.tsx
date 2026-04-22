import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/providers/cart-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Industrial Safety — Gestión de Seguridad Inteligente",
  description:
    "Plataforma SaaS para gestión de seguridad industrial: certificados, detección de EPP por IA e inventario.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-scroll-behavior="smooth" className={`${inter.variable} h-full bg-background antialiased`}>
      <body className="min-h-full flex flex-col font-sans text-foreground">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
