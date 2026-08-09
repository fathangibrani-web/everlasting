import Link from "next/link";

import ArticleCard from "@/components/ArticleCard";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import { Monogram } from "@/components/Logo";
import Reveal from "@/components/Reveal";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import { getColorClasses } from "@/lib/colors";
import {
  allCategoriesQuery,
  allPostsQuery,
  featuredPostsQuery,
} from "@/sanity/lib/queries";
import { safeFetch } from "@/sanity/lib/safeFetch";
import type { Category, PostCard } from "@/sanity/lib/types";

export const revalidate = 30;

export default async function Home() {
  const [featuredPosts, allPosts, categories] = await Promise.all([
    safeFetch<PostCard[]>(featuredPostsQuery, {}, []),
    safeFetch<PostCard[]>(allPostsQuery, {}, []),
    safeFetch<Category[]>(allCategoriesQuery, {}, []),
  ]);

  const carouselPosts =
    featuredPosts.length > 0 ? featuredPosts : allPosts.slice(0, 5);
  const carouselIds = new Set(carouselPosts.map((p) => p._id));
  const gridPosts = allPosts.filter((p) => !carouselIds.has(p._id)).slice(0, 12);

  return (
    <div>
      <section className="relative overflow-hidden">
        <Reveal className="mx-auto max-w-6xl px-4 pb-10 pt-16 text-center sm:px-6 sm:pt-24">
          <div className="flex justify-center">
            <Monogram size={72} animated />
          </div>
          <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-semibold text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10">
            ✦ Mindset &middot; Intelek &middot; Islami
          </span>
          <h1 className="logo-shimmer-text mx-auto mt-6 max-w-2xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Everlasting
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-xl font-medium leading-snug text-neutral-700 dark:text-neutral-200">
            Iman tanpa mikir itu rapuh. Mikir tanpa arah itu kosong.
          </p>
        </Reveal>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {carouselPosts.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <Reveal delay={100}>
              <FeaturedCarousel posts={carouselPosts} />
            </Reveal>

            {categories.length > 0 && (
              <Reveal delay={150} className="mt-10">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400">
                  Jelajahi Genre
                </p>
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {categories.map((cat) => {
                    const catColors = getColorClasses(cat.color);
                    return (
                      <Link
                        key={cat._id}
                        href={`/genre/${cat.slug.current}`}
                        className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${catColors.badge}`}
                      >
                        {cat.title}
                      </Link>
                    );
                  })}
                </div>
              </Reveal>
            )}

            <div className="mt-16 flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">
                Artikel Terbaru
              </h2>
              <Link
                href="/genre"
                className="text-sm font-semibold text-brand-700 hover:underline"
              >
                Lihat semua genre &rarr;
              </Link>
            </div>

            {gridPosts.length > 0 && (
              <StaggerGrid className="mt-6 grid grid-cols-1 gap-6 pb-16 sm:grid-cols-2 lg:grid-cols-3">
                {gridPosts.map((post) => (
                  <StaggerItem key={post._id}>
                    <ArticleCard post={post} />
                  </StaggerItem>
                ))}
              </StaggerGrid>
            )}

            <Reveal className="border-t border-[var(--border)] px-4 py-16 text-center sm:px-6">
              <p className="mx-auto max-w-2xl font-display text-2xl italic leading-snug text-neutral-600 sm:text-3xl dark:text-neutral-300">
                &ldquo;Bukan buat nambah followers. Buat nambah alasan mikir lebih dalam.&rdquo;
              </p>
            </Reveal>
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="glass mx-auto flex max-w-lg flex-col items-center gap-4 rounded-3xl border px-8 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-3xl dark:bg-brand-500/10">
        📝
      </div>
      <h2 className="text-xl font-bold">Belum ada artikel</h2>
      <p className="text-neutral-500">
        Buka Sanity Studio untuk mulai menulis artikel pertamamu, lengkap dengan
        gambar dan kategori.
      </p>
      <Link
        href="/studio"
        className="rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
      >
        Buka Studio
      </Link>
    </div>
  );
}
