import Link from "next/link";
import type { Metadata } from "next";

import Reveal from "@/components/Reveal";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import { getColorClasses } from "@/lib/colors";
import { allCategoriesQuery } from "@/sanity/lib/queries";
import { safeFetch } from "@/sanity/lib/safeFetch";
import type { Category } from "@/sanity/lib/types";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Genre Artikel — Everlasting",
  description: "Jelajahi artikel berdasarkan genre / kategori.",
};

export default async function GenrePage() {
  const categories = await safeFetch<Category[]>(allCategoriesQuery, {}, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <Reveal className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Genre Artikel
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-neutral-500 dark:text-neutral-400">
          Bank artikel yang dikelompokkan per jenis — pilih genre untuk melihat
          semua tulisannya.
        </p>
      </Reveal>

      {categories.length === 0 ? (
        <p className="mt-12 text-center text-neutral-500">
          Belum ada genre. Buat lewat{" "}
          <Link href="/studio" className="font-semibold text-brand-700 hover:underline">
            Studio
          </Link>
          .
        </p>
      ) : (
        <StaggerGrid className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const colors = getColorClasses(cat.color);
            return (
              <StaggerItem key={cat._id}>
                <Link
                  href={`/genre/${cat.slug.current}`}
                  className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-20 blur-2xl ${colors.gradient} transition-opacity group-hover:opacity-40`}
                  />
                  <div className="relative flex items-start justify-between">
                    <h2 className="text-xl font-bold transition-colors group-hover:text-brand-700">
                      {cat.title}
                    </h2>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${colors.badge}`}
                    >
                      {cat.postCount} artikel
                    </span>
                  </div>
                  {cat.description && (
                    <p className="relative mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                      {cat.description}
                    </p>
                  )}
                  <span className="relative mt-4 flex items-center gap-1 text-sm font-semibold text-brand-700">
                    Lihat artikel
                    <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L11.29 6.15a.75.75 0 111.08-1.04l4.5 4.5a.75.75 0 010 1.04l-4.5 4.5a.75.75 0 11-1.08-1.04l3.098-3.1H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                    </svg>
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerGrid>
      )}
    </div>
  );
}
