import Link from "next/link";

import ArticleCard from "@/components/ArticleCard";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import { allPostsQuery, featuredPostsQuery } from "@/sanity/lib/queries";
import { safeFetch } from "@/sanity/lib/safeFetch";
import type { PostCard } from "@/sanity/lib/types";

export const revalidate = 30;

export default async function Home() {
  const [featuredPosts, allPosts] = await Promise.all([
    safeFetch<PostCard[]>(featuredPostsQuery, {}, []),
    safeFetch<PostCard[]>(allPostsQuery, {}, []),
  ]);

  const carouselPosts =
    featuredPosts.length > 0 ? featuredPosts : allPosts.slice(0, 5);
  const carouselIds = new Set(carouselPosts.map((p) => p._id));
  const gridPosts = allPosts.filter((p) => !carouselIds.has(p._id)).slice(0, 12);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 via-[var(--background)] to-transparent dark:from-brand-500/10 dark:via-transparent" />
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-16 text-center sm:px-6 sm:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-semibold text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10">
            ✦ Mindset &middot; Intelek &middot; Islamik
          </span>
          <h1 className="mx-auto mt-6 max-w-2xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Everlasting
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-neutral-500 dark:text-neutral-400">
            Kumpulan tulisan seputar cara berpikir, wawasan intelektual, dan
            nilai-nilai Islami — lengkap dengan foto dan cerita di baliknya.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {carouselPosts.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <FeaturedCarousel posts={carouselPosts} />

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
              <div className="mt-6 grid grid-cols-1 gap-6 pb-24 sm:grid-cols-2 lg:grid-cols-3">
                {gridPosts.map((post) => (
                  <ArticleCard key={post._id} post={post} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-24 text-center">
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
