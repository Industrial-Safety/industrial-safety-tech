import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/providers/cart-provider";
import { AuthProvider } from "@/components/providers/session-provider";
import { NotificationsProvider } from "@/components/providers/notifications-provider";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Industrial Safety — Gestión de Seguridad Inteligente",
  description:
    "Plataforma SaaS para gestión de seguridad industrial: detección de EPP por IA y cumplimiento normativo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-scroll-behavior="smooth" className={`${inter.variable} h-full bg-background antialiased`}>
      <body className="min-h-full flex flex-col font-sans text-foreground">
        <AuthProvider>
          <NotificationsProvider>
            <CartProvider>
              {children}
            </CartProvider>
            <Toaster richColors position="bottom-right" />
          </NotificationsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
