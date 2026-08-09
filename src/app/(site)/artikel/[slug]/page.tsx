import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import ArticleCard from "@/components/ArticleCard";
import AuthorHoverCard from "@/components/AuthorHoverCard";
import PortableTextRenderer from "@/components/PortableTextRenderer";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import Reveal from "@/components/Reveal";
import ShareRow from "@/components/ShareRow";
import SocialIcon from "@/components/SocialIcon";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import { getColorClasses } from "@/lib/colors";
import { formatDate, getReadingTime } from "@/lib/format";
import { SITE_URL } from "@/lib/site";
import { urlForImage } from "@/sanity/lib/image";
import {
  allPostsQuery,
  postBySlugQuery,
  postSlugsQuery,
  postsByCategoryQuery,
} from "@/sanity/lib/queries";
import { safeFetch } from "@/sanity/lib/safeFetch";
import type { PostCard, PostDetail } from "@/sanity/lib/types";

export const revalidate = 30;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const slugs = await safeFetch<string[]>(postSlugsQuery, {}, []);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await safeFetch<PostDetail | null>(
    postBySlugQuery,
    { slug },
    null
  );

  if (!post) return {};

  const title = `${post.title} — Everlasting`;

  return {
    title,
    description: post.excerpt,
    alternates: {
      canonical: `/artikel/${slug}`,
    },
    openGraph: {
      type: "article",
      title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      images: post.mainImage
        ? [
            {
              url: urlForImage(post.mainImage).width(1200).height(630).url(),
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: post.excerpt,
    },
  };
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params;

  const post = await safeFetch<PostDetail | null>(
    postBySlugQuery,
    { slug },
    null
  );

  if (!post) notFound();

  const relatedAll = await safeFetch<PostCard[]>(
    postsByCategoryQuery,
    { slug: post.category.slug.current },
    []
  );
  const related = relatedAll.filter((p) => p._id !== post._id).slice(0, 4);

  let nextReadPost: PostCard | null = post.nextRead ?? related[0] ?? null;

  if (!nextReadPost) {
    // No same-category article to suggest — fall back to the latest
    // other post site-wide so "Baca Berikutnya" isn't left empty.
    const latest = await safeFetch<PostCard[]>(allPostsQuery, {}, []);
    nextReadPost = latest.find((p) => p._id !== post._id) ?? null;
  }

  const relatedGrid = related
    .filter((p) => p._id !== nextReadPost?._id)
    .slice(0, 3);

  const colors = getColorClasses(post.category?.color);
  const readingTime = getReadingTime(post.plainBody);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.mainImage
      ? [urlForImage(post.mainImage).width(1200).url()]
      : undefined,
    datePublished: post.publishedAt,
    author: post.author
      ? { "@type": "Person", name: post.author.name }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "Everlasting",
      url: SITE_URL,
    },
  };

  return (
    <article>
      <ReadingProgressBar targetId="article-body" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Reveal className="mx-auto max-w-3xl px-4 pt-10 sm:px-6">
        <p className="text-sm text-neutral-400">
          <Link href="/genre" className="hover:text-brand-700">
            Genre
          </Link>
          <span className="mx-1.5">/</span>
          <Link
            href={`/genre/${post.category.slug.current}`}
            className="hover:text-brand-700"
          >
            {post.category.title}
          </Link>
        </p>

        <Link
          href={`/genre/${post.category.slug.current}`}
          className={`mt-3 inline-block w-fit rounded-full px-3 py-1 text-xs font-semibold ${colors.badge}`}
        >
          {post.category.title}
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        {(post.deck || post.excerpt) && (
          <p className="mt-3 text-lg text-neutral-500 dark:text-neutral-400">
            {post.deck || post.excerpt}
          </p>
        )}

        <div className="mt-5 flex items-center gap-3">
          <AuthorHoverCard authorSlug={post.author?.slug}>
            <div className="flex items-center gap-3">
              {post.author?.photo && (
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={urlForImage(post.author.photo).width(80).height(80).url()}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              {post.author?.name && (
                <p className="text-sm font-semibold">{post.author.name}</p>
              )}
            </div>
          </AuthorHoverCard>
          <p className="text-sm text-neutral-400">
            {formatDate(post.publishedAt)}
            <span className="mx-1.5">&middot;</span>
            {readingTime} menit baca
          </p>
        </div>

        <ShareRow title={post.title} />
      </Reveal>

      {post.mainImage && (
        <div className="relative mx-auto mt-8 aspect-[16/9] w-full max-w-4xl overflow-hidden rounded-2xl px-0 sm:px-6">
          <Image
            src={urlForImage(post.mainImage).width(1400).height(800).url()}
            alt={post.mainImage.alt || post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 900px"
            className="object-cover sm:rounded-2xl"
          />
        </div>
      )}

      <div id="article-body" className="mx-auto max-w-[680px] px-4 pb-10 pt-8 sm:px-6">
        {post.body ? (
          <PortableTextRenderer value={post.body} />
        ) : (
          <p className="text-neutral-500">{post.excerpt}</p>
        )}
      </div>

      {post.author?.socials && post.author.socials.length > 0 && (
        <div className="mx-auto max-w-3xl border-t border-[var(--border)] px-4 py-8 sm:px-6">
          <p className="text-sm font-semibold text-neutral-500">
            Ditulis oleh {post.author.name}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {post.author.socials.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium transition-colors hover:border-brand-300 hover:text-brand-700"
              >
                <SocialIcon platform={s.platform} className="h-3.5 w-3.5" />
                {s.platform}
              </a>
            ))}
          </div>
        </div>
      )}

      {nextReadPost && (
        <Reveal className="mx-auto max-w-4xl px-4 pt-12 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-600">
            Baca Berikutnya
          </p>
          <Link
            href={`/artikel/${nextReadPost.slug.current}`}
            className="glass group mt-4 grid grid-cols-1 overflow-hidden rounded-3xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:grid-cols-2"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
              {nextReadPost.mainImage && (
                <Image
                  src={urlForImage(nextReadPost.mainImage)
                    .width(700)
                    .height(440)
                    .url()}
                  alt={nextReadPost.mainImage.alt || nextReadPost.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
            </div>
            <div className="flex flex-col justify-center gap-3 p-6 sm:p-8">
              {nextReadPost.category && (
                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                    getColorClasses(nextReadPost.category.color).badge
                  }`}
                >
                  {nextReadPost.category.title}
                </span>
              )}
              <h2 className="text-xl font-bold leading-snug tracking-tight transition-colors group-hover:text-[var(--on-glass-accent)] sm:text-2xl">
                {nextReadPost.title}
              </h2>
              <span className="flex items-center gap-1 text-sm font-semibold text-[var(--on-glass-accent)]">
                Baca artikel
                <svg
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 01.75-.75h10.638L11.29 6.15a.75.75 0 111.08-1.04l4.5 4.5a.75.75 0 010 1.04l-4.5 4.5a.75.75 0 11-1.08-1.04l3.098-3.1H3.75A.75.75 0 013 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
          </Link>
        </Reveal>
      )}

      {relatedGrid.length > 0 && (
        <div className="mx-auto max-w-6xl px-4 pb-24 pt-12 sm:px-6">
          <h2 className="text-xl font-bold tracking-tight">
            Artikel Terkait
          </h2>
          <StaggerGrid className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedGrid.map((p) => (
              <StaggerItem key={p._id}>
                <ArticleCard post={p} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      )}
    </article>
  );
}
