import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { ViewTransition } from "react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
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

export const metadata: Metadata = {
  title: "Everlasting — Mindset, Intelek, Islami",
  description:
    "Kumpulan artikel bergambar seputar mindset, intelektual, dan wawasan Islami.",
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
        <Navbar categories={categories} />
        <main className="flex-1">
          <ViewTransition enter="page-enter" exit="page-exit">
            {children}
          </ViewTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
