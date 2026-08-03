import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

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

export const metadata: Metadata = {
  title: "ArtikelSaya — Berita & Cerita Pilihan",
  description:
    "Blog artikel bergambar seputar berita, teknologi, olahraga, hiburan, dan opini.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Navbar categories={categories} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
