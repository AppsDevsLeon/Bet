import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/public/scss/style.scss";
import MainFooter from "@/components/Shared/MainFooter";
import FooterCard from "@/components/Shared/FooterCard";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import HeadBlue from "@/components/Shared/HeaderBlue";
import Head from "@/components/Shared/Head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Oddsx - Sports Betting React Next",
  description: "Made with nextjs bootstrap 5 & Sass",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* Proveedor global: envuelve TODO el sitio */}
        <I18nProvider defaultLocale="es">
          {/* CABECERAS GLOBALES (arriba en todas las páginas) */}
          <HeadBlue />
          <Head />

          {/* CONTENIDO DE CADA PÁGINA */}
          <main>{children}</main>

          {/* FOOTERS GLOBALES (abajo en todas las páginas) */}
          <FooterCard />
          <MainFooter />
        </I18nProvider>
      </body>
    </html>
  );
}
