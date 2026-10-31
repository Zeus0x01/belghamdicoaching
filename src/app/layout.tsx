import type { Metadata } from "next";
import { Space_Grotesk, Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Belghamdi Coaching — Anatomy of Performance",
  description:
    "Premium online fitness coaching. Personalized programs, measurable progress, science-backed training.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${display.variable} ${body.variable} ${serif.variable}`}>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
