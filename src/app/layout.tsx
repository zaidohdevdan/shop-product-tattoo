import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Opcional, mas comum em PWAs para parecer mais nativo
};


export const metadata: Metadata = {
  title: {
    template: "%s | ShopTattoo",
    default: "ShopTattoo | Produtos de Qualidade",
  },
  description: "O maior e mais bem equipado estúdio e supply de tatuagem de Fortaleza. Tradição, precisão estética e produtos aprovados por profissionais.",
  keywords: ["tatuagem fortaleza", "tattoo supply", "tinta de tatuagem", "equipamentos de tattoo", "estúdio premium", "shoptattoo", "material para tatuagem", "estúdio de tatuagem fortaleza"],
  authors: [{ name: "ShopTattoo Team" }],
  metadataBase: new URL("https://shoptattoo.com.br"),
  openGraph: {
    title: "ShopTattoo | O Mais Completo Hub de Tatuagem",
    description: "Produtos de qualidade para tatuadores e agendamento no estúdio mais sofisticado da região.",
    url: "https://shoptattoo.com.br",
    siteName: "ShopTattoo",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ShopTattoo - Produtos de Qualidade",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopTattoo | Produtos de Qualidade",
    description: "Referência em tatuagem e suprimentos em Fortaleza.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/",
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
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ShopTattoo",
    // startupImage: [] // Pode ser adicionado futuramente
  },
  formatDetection: {
    telephone: false,
  },
};


import { CartDrawer } from "@/components/shared/CartDrawer";
import { Toaster } from "sonner";
import { PromoBanner } from "@/components/shared/PromoBanner";
import { FloatingWhatsApp } from "@/components/shared/FloatingWhatsApp";
import { DevCacheReset } from "@/components/shared/DevCacheReset";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${bebasNeue.variable} ${inter.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black">
        <PromoBanner />
        {children}
        <CartDrawer />
        <FloatingWhatsApp />
        <Toaster theme="dark" richColors position="top-right" />
        <DevCacheReset />
      </body>
    </html>
  );
}
