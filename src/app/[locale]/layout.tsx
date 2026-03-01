import type { Metadata } from "next";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Playfair_Display, Inter } from "next/font/google";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "../globals.css";

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Роштиљ месара Шишко — Чајетина | Златибор",
    template: "%s | Месара Шишко",
  },
  description:
    "Свеже месо, традиционални укус, породична атмосфера. Чајетина, Србија.",
  keywords: [
    "роштиљ Златибор",
    "месара Чајетина",
    "roštilj Zlatibor",
    "mesara Čajetina",
    "grill Zlatibor",
    "Serbian grill",
    "ćevapi",
    "pljeskavica",
  ],
  openGraph: {
    title: "Роштиљ месара Шишко — Чајетина",
    description: "Свеже месо, традиционални укус, породична атмосфера. Чајетина.",
    type: "website",
    locale: "sr_RS",
    alternateLocale: "en_US",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "sr" | "en")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="min-h-screen bg-cream text-text-dark font-[family-name:var(--font-body)]">
        <NextIntlClientProvider messages={messages}>
          <div className="noise-overlay" aria-hidden="true" />
          <Header />
          <main id="main-content" className="min-h-screen">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
