import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import ArticleCard from "@/components/ArticleCard";
import { getColorClasses } from "@/lib/colors";
import {
  categoryBySlugQuery,
  categorySlugsQuery,
  postsByCategoryQuery,
} from "@/sanity/lib/queries";
import { safeFetch } from "@/sanity/lib/safeFetch";
import type { Category, PostCard } from "@/sanity/lib/types";

export const revalidate = 30;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const slugs = await safeFetch<string[]>(categorySlugsQuery, {}, []);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await safeFetch<Category | null>(
    categoryBySlugQuery,
    { slug },
    null
  );

  if (!category) return {};

  return {
    title: `${category.title} — Everlasting`,
    description:
      category.description ?? `Kumpulan artikel genre ${category.title}.`,
  };
}

export default async function GenreDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;

  const category = await safeFetch<Category | null>(
    categoryBySlugQuery,
    { slug },
    null
  );

  if (!category) notFound();

  const posts = await safeFetch<PostCard[]>(postsByCategoryQuery, { slug }, []);

  const colors = getColorClasses(category.color);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div
          className={`absolute inset-0 -z-10 bg-gradient-to-br opacity-10 ${colors.gradient}`}
        />
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <Link
            href="/genre"
            className="text-sm font-semibold text-neutral-400 hover:text-brand-700"
          >
            &larr; Semua genre
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {category.title}
            </h1>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${colors.badge}`}>
              {posts.length} artikel
            </span>
          </div>
          {category.description && (
            <p className="mt-3 max-w-xl text-neutral-500 dark:text-neutral-400">
              {category.description}
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {posts.length === 0 ? (
          <p className="text-center text-neutral-500">
            Belum ada artikel di genre ini.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 pb-12 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <ArticleCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
