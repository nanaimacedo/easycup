import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "78º Intercolonial de Tênis - Inscrições",
  description: "Sistema de inscrição do 78º Campeonato Intercolonial de Tênis - Coopercotia Atlético Clube",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: '#1e40af',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '78º Intercolonial',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="bg-white border-t border-[var(--color-border)] py-4 sm:py-6 mt-auto safe-bottom">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-[10px] sm:text-xs text-[var(--color-text-muted)] leading-relaxed">
              Coopercotia Atlético Clube - Av. Guilherme Fongaro, 351 - Parque Ipê
            </p>
            <p className="text-[10px] sm:text-xs text-[var(--color-text-muted)] mt-0.5">
              CEP 05571-015 - São Paulo/SP
            </p>
            <p className="text-[10px] sm:text-xs text-[var(--color-text-muted)] mt-1">
              Tel: (11) 3782-0727 | WhatsApp: (11) 99967-7021
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
