import type { Metadata } from "next";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: '--font-roboto-mono' // Esta variable se conecta con tailwind.config
});

export const metadata: Metadata = {
  title: "Product Traceability DApp",
  description: "A decentralized application for product traceability",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${robotoMono.variable} font-sans antialiased`}
      >
        <Providers>
          <Header />
          {/* pt-16 compensa la altura del Header fijo */}
          <main className="flex-grow pt-16 w-full">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
