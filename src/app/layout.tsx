import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | ShopTattoo",
    default: "ShopTattoo | Equipamentos de Elite & Tatuagem Premium",
  },
  description: "O maior e mais bem equipado estúdio e supply de tatuagem de Fortaleza. Tradição, precisão estética e produtos aprovados por profissionais.",
  keywords: ["tatuagem fortaleza", "tattoo supply", "tinta de tatuagem", "equipamentos de tattoo", "estúdio premium", "shoptattoo"],
  openGraph: {
    title: "ShopTattoo | O Mais Completo Hub de Tatuagem",
    description: "Equipamentos profissionais para tatuadores e agendamento no estúdio mais sofisticado da região.",
    url: "https://shoptattoo.com.br",
    siteName: "ShopTattoo",
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { CartDrawer } from "@/components/shared/CartDrawer";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${bebasNeue.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black">
        {children}
        <CartDrawer />
        <Toaster theme="dark" richColors position="top-right" />
      </body>
    </html>
  );
}
