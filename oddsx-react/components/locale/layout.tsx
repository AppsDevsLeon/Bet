// app/[locale]/layout.tsx
import type {Metadata} from 'next';
import {NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import {ReactNode} from 'react';
import {locales} from '@/i18n';

export const metadata: Metadata = {
  title: 'Tu Sitio',
  description: 'Sports betting...'
};

async function getMessages(locale: string) {
  try {
    const msgs = (await import(`@/messages/${locale}.json`)).default;
    return msgs;
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
  params: {locale}
}: {
  children: ReactNode;
  params: {locale: string};
}) {
  if (!locales.includes(locale as any)) notFound();

  const messages = await getMessages(locale);
  if (!messages) notFound();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
