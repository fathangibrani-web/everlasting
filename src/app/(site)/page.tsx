import Image from "next/image";
import Link from "next/link";

import ArticleCard from "@/components/ArticleCard";
import { getColorClasses } from "@/lib/colors";
import { formatDate } from "@/lib/format";
import { urlForImage } from "@/sanity/lib/image";
import {
  allPostsQuery,
  featuredPostQuery,
  latestPostsQuery,
} from "@/sanity/lib/queries";
import { safeFetch } from "@/sanity/lib/safeFetch";
import type { PostCard } from "@/sanity/lib/types";

export const revalidate = 30;

export default async function Home() {
  const [featured, allPosts] = await Promise.all([
    safeFetch<PostCard | null>(featuredPostQuery, {}, null),
    safeFetch<PostCard[]>(allPostsQuery, {}, []),
  ]);

  const latest = featured
    ? await safeFetch<PostCard[]>(
        latestPostsQuery,
        { featuredId: featured._id },
        []
      )
    : allPosts.slice(0, 12);

  const heroFeatured = featured ?? allPosts[0] ?? null;
  const gridPosts = heroFeatured
    ? latest.filter((p) => p._id !== heroFeatured._id)
    : latest;

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-rose-50 via-white to-transparent dark:from-rose-500/10 dark:via-transparent" />
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-16 text-center sm:px-6 sm:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-xs font-semibold text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10">
            ✦ Berita, cerita, dan opini pilihan
          </span>
          <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Artikel <span className="text-rose-600">Saya</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-neutral-500 dark:text-neutral-400">
            Kumpulan tulisan terbaru — dari berita hangat sampai opini pribadi,
            lengkap dengan foto dan cerita di baliknya.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {!heroFeatured ? (
          <EmptyState />
        ) : (
          <>
            <FeaturedArticle post={heroFeatured} />

            <div className="mt-16 flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">
                Artikel Terbaru
              </h2>
              <Link
                href="/genre"
                className="text-sm font-semibold text-rose-600 hover:underline"
              >
                Lihat semua genre &rarr;
              </Link>
            </div>

            {gridPosts.length === 0 ? (
              <p className="mt-6 text-neutral-500">
                Belum ada artikel lain. Tambahkan lebih banyak lewat Studio.
              </p>
            ) : (
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

function FeaturedArticle({ post }: { post: PostCard }) {
  const colors = getColorClasses(post.category?.color);

  return (
    <Link
      href={`/artikel/${post.slug.current}`}
      className="group grid grid-cols-1 gap-6 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition-shadow hover:shadow-2xl md:grid-cols-2"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 md:aspect-auto dark:bg-neutral-900">
        {post.mainImage && (
          <Image
            src={urlForImage(post.mainImage).width(900).height(600).url()}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-col justify-center gap-4 p-6 sm:p-10">
        {post.category && (
          <span
            className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${colors.badge}`}
          >
            {post.category.title}
          </span>
        )}
        <h2 className="text-2xl font-extrabold leading-tight tracking-tight transition-colors group-hover:text-rose-600 sm:text-3xl">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="line-clamp-3 text-neutral-500 dark:text-neutral-400">
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <span>{formatDate(post.publishedAt)}</span>
          <span>&middot;</span>
          <span className="font-semibold text-rose-600">Baca selengkapnya</span>
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-3xl dark:bg-rose-500/10">
        📝
      </div>
      <h2 className="text-xl font-bold">Belum ada artikel</h2>
      <p className="text-neutral-500">
        Buka Sanity Studio untuk mulai menulis artikel pertamamu, lengkap dengan
        gambar dan kategori.
      </p>
      <Link
        href="/studio"
        className="rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-700"
      >
        Buka Studio
      </Link>
    </div>
  );
}
