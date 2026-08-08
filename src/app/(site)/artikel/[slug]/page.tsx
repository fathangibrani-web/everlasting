import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import ArticleCard from "@/components/ArticleCard";
import PortableTextRenderer from "@/components/PortableTextRenderer";
import Reveal from "@/components/Reveal";
import SocialIcon from "@/components/SocialIcon";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import { getColorClasses } from "@/lib/colors";
import { formatDate } from "@/lib/format";
import { urlForImage } from "@/sanity/lib/image";
import {
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

  return {
    title: `${post.title} — Everlasting`,
    description: post.excerpt,
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
  const related = relatedAll.filter((p) => p._id !== post._id).slice(0, 3);

  const colors = getColorClasses(post.category?.color);

  return (
    <article>
      <Reveal className="mx-auto max-w-3xl px-4 pt-10 sm:px-6">
        <Link
          href={`/genre/${post.category.slug.current}`}
          className={`inline-block w-fit rounded-full px-3 py-1 text-xs font-semibold ${colors.badge}`}
        >
          {post.category.title}
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          {post.title}
        </h1>

        <div className="mt-5 flex items-center gap-3">
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
          <div className="text-sm">
            {post.author?.name && (
              <p className="font-semibold">{post.author.name}</p>
            )}
            <p className="text-neutral-400">{formatDate(post.publishedAt)}</p>
          </div>
        </div>
      </Reveal>

      {post.mainImage && (
        <div className="relative mx-auto mt-8 aspect-[16/9] w-full max-w-4xl overflow-hidden rounded-2xl px-0 sm:px-6">
          <Image
            src={urlForImage(post.mainImage).width(1400).height(800).url()}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 900px"
            className="object-cover sm:rounded-2xl"
          />
        </div>
      )}

      <div className="mx-auto max-w-3xl px-4 pb-10 pt-8 sm:px-6">
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

      {related.length > 0 && (
        <div className="mx-auto max-w-6xl px-4 pb-24 pt-12 sm:px-6">
          <h2 className="text-xl font-bold tracking-tight">
            Artikel Terkait
          </h2>
          <StaggerGrid className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
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
