import Image from "next/image";
import Link from "next/link";

import ArticleCard from "@/components/ArticleCard";
import AuthorHoverCard from "@/components/AuthorHoverCard";
import { Monogram } from "@/components/Logo";
import MorphHero from "@/components/MorphHero";
import QuoteGrid from "@/components/QuoteGrid";
import Reveal from "@/components/Reveal";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import { getColorClasses } from "@/lib/colors";
import { urlForImage } from "@/sanity/lib/image";
import {
  allCategoriesQuery,
  allPostsQuery,
  authorsQuery,
} from "@/sanity/lib/queries";
import { safeFetch } from "@/sanity/lib/safeFetch";
import type { Author, Category, PostCard } from "@/sanity/lib/types";

export const revalidate = 30;

export default async function Home() {
  const [allPosts, categories, authors] = await Promise.all([
    safeFetch<PostCard[]>(allPostsQuery, {}, []),
    safeFetch<Category[]>(allCategoriesQuery, {}, []),
    safeFetch<Author[]>(authorsQuery, {}, []),
  ]);

  const heroPosts = allPosts.slice(0, 5);
  const heroIds = new Set(heroPosts.map((p) => p._id));
  const gridPosts = allPosts.filter((p) => !heroIds.has(p._id)).slice(0, 12);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-16 text-center sm:px-6 sm:pt-24">
          <Reveal className="flex justify-center">
            <Monogram size={72} animated />
          </Reveal>
          <Reveal delay={80}>
            <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-semibold text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10">
              ✦ Mindset &middot; Intelek &middot; Islami
            </span>
          </Reveal>
          <Reveal delay={160}>
            <h1 className="logo-shimmer-text mx-auto mt-6 max-w-2xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Everlasting
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="mx-auto mt-5 max-w-xl text-xl font-medium leading-snug text-neutral-700 dark:text-neutral-200">
              Iman tanpa mikir itu rapuh. Mikir tanpa arah itu kosong.
            </p>
          </Reveal>
        </div>
      </section>

      {heroPosts.length === 0 ? (
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <EmptyState />
        </div>
      ) : (
        <>
          <MorphHero posts={heroPosts} />

          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal className="pt-20">
              <SectionHeading
                eyebrow="Dari Tulisan Kami"
                title="Kutipan yang Bikin Mikir"
              />
              <div className="mt-8">
                <QuoteGrid posts={heroPosts} />
              </div>
            </Reveal>

            {categories.length > 0 && (
              <Reveal className="pt-20">
                <SectionHeading eyebrow="Jelajahi" title="Pilih Genre" />
                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {categories.map((cat) => {
                    const catColors = getColorClasses(cat.color);
                    return (
                      <Link
                        key={cat._id}
                        href={`/genre/${cat.slug.current}`}
                        className="glass group flex flex-col gap-2 rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] active:duration-100"
                      >
                        <span
                          className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${catColors.badge}`}
                        >
                          {cat.title}
                        </span>
                        <span className="mt-1 text-sm text-[var(--on-glass-soft)]">
                          {cat.postCount} artikel
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </Reveal>
            )}

            {gridPosts.length > 0 && (
              <Reveal className="pt-20">
                <div className="flex items-center justify-between">
                  <SectionHeading eyebrow="Terus Bertambah" title="Artikel Terbaru" />
                  <Link
                    href="/genre"
                    className="text-sm font-semibold text-brand-700 hover:underline"
                  >
                    Lihat semua &rarr;
                  </Link>
                </div>
                <StaggerGrid className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {gridPosts.map((post) => (
                    <StaggerItem key={post._id}>
                      <ArticleCard post={post} />
                    </StaggerItem>
                  ))}
                </StaggerGrid>
              </Reveal>
            )}

            {authors.length > 0 && (
              <Reveal className="pb-24 pt-20">
                <SectionHeading eyebrow="Di Balik Tulisan" title="Para Penulis" />
                <div className="mt-8 flex gap-4 overflow-x-auto pb-2">
                  {authors.map((author) => (
                    <AuthorHoverCard
                      key={author._id}
                      authorSlug={author.slug.current}
                      large
                      triggerClassName="shrink-0"
                    >
                      <Link
                        href="/profil"
                        className="glass group flex w-36 shrink-0 flex-col items-center gap-2 rounded-2xl border p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] active:duration-100"
                      >
                        {author.photo && (
                          <span className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-brand-100 dark:ring-brand-500/20">
                            <Image
                              src={urlForImage(author.photo).width(128).height(128).url()}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          </span>
                        )}
                        <span className="line-clamp-1 text-sm font-semibold">
                          {author.name}
                        </span>
                        {author.tagline && (
                          <span className="line-clamp-1 text-xs text-[var(--on-glass-soft)]">
                            {author.tagline}
                          </span>
                        )}
                      </Link>
                    </AuthorHoverCard>
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400">
        {eyebrow}
      </p>
      <h2 className="mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
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
      <p className="text-[var(--on-glass-soft)]">
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
