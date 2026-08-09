import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { ViewTransition } from "react";

import AnimatedBackground from "@/components/AnimatedBackground";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { SITE_URL } from "@/lib/site";
import { allCategoriesQuery } from "@/sanity/lib/queries";
import { safeFetch } from "@/sanity/lib/safeFetch";
import type { Category } from "@/sanity/lib/types";

import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const title = "Everlasting — Mindset, Intelek, Islami";
const description =
  "Kumpulan artikel bergambar seputar mindset, intelektual, dan wawasan Islami.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  keywords: [
    "Everlasting",
    "mindset",
    "intelek",
    "islami",
    "artikel islami",
    "blog islami",
    "refleksi",
    "opini",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: "Everlasting",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await safeFetch<Category[]>(allCategoriesQuery, {}, []);

  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-full focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Lewati ke konten
        </a>
        <AnimatedBackground />
        <div className="relative z-10 flex min-h-full flex-1 flex-col">
          <Navbar categories={categories} />
          <main id="main-content" className="flex-1">
            <ViewTransition enter="page-enter" exit="page-exit">
              {children}
            </ViewTransition>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
