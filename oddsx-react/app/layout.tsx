import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/public/scss/style.scss";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import HeadMain from "@/components/Shared/MainHeader";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "olympiabet",

};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <I18nProvider defaultLocale="es">
          {/* Si quieres que el header también vaya al 80%, déjalo dentro */}
          <div className="viewport-80">
            <HeadMain />
            <main className="page-main">{children}</main>
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}

