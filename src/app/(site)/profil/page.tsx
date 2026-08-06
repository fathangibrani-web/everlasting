import Link from "next/link";
import type { Metadata } from "next";

import ArticleCard from "@/components/ArticleCard";
import AuthorCard from "@/components/AuthorCard";
import Logo from "@/components/Logo";
import PortableTextRenderer from "@/components/PortableTextRenderer";
import Reveal from "@/components/Reveal";
import {
  allPostsQuery,
  authorsQuery,
  siteInfoQuery,
} from "@/sanity/lib/queries";
import { safeFetch } from "@/sanity/lib/safeFetch";
import type { Author, PostCard, SiteInfo } from "@/sanity/lib/types";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Profil — Everlasting",
  description: "Kenali Everlasting: visi, misi, dan para penulis di baliknya.",
};

export default async function ProfilPage() {
  const [siteInfo, authors, posts] = await Promise.all([
    safeFetch<SiteInfo | null>(siteInfoQuery, {}, null),
    safeFetch<Author[]>(authorsQuery, {}, []),
    safeFetch<PostCard[]>(allPostsQuery, {}, []),
  ]);

  const recentPosts = posts.slice(0, 3);
  const hasVisionOrMission =
    Boolean(siteInfo?.vision) || Boolean(siteInfo?.mission?.length);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 to-transparent dark:from-brand-500/10" />
        <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center sm:px-6">
          <Logo variant="hero" />
        </div>
      </section>

      <Reveal className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
          Apa itu Everlasting?
        </h1>

        {siteInfo?.about && siteInfo.about.length > 0 ? (
          <div className="mt-6">
            <PortableTextRenderer value={siteInfo.about} />
          </div>
        ) : (
          <p className="mt-6 text-center text-neutral-500">
            Cerita tentang Everlasting akan tampil di sini. Isi lewat{" "}
            <Link
              href="/studio"
              className="font-semibold text-brand-700 hover:underline"
            >
              Studio
            </Link>{" "}
            &rarr; Tentang Everlasting.
          </p>
        )}

        {hasVisionOrMission && (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {siteInfo?.vision && (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-600">
                  Visi
                </h2>
                <p className="mt-3 text-neutral-600 dark:text-neutral-300">
                  {siteInfo.vision}
                </p>
              </div>
            )}
            {siteInfo?.mission && siteInfo.mission.length > 0 && (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-600">
                  Misi
                </h2>
                <ul className="mt-3 space-y-2">
                  {siteInfo.mission.map((point, i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-sm text-neutral-600 dark:text-neutral-300"
                    >
                      <span className="text-brand-600">&#10022;</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Reveal>

      <Reveal className="mx-auto max-w-6xl px-4 py-16 sm:px-6" delay={100}>
        <h2 className="text-center text-2xl font-bold tracking-tight">
          Penulis
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-neutral-500 dark:text-neutral-400">
          Orang-orang di balik tulisan Everlasting.
        </p>

        {authors.length === 0 ? (
          <p className="mt-8 text-center text-neutral-500">
            Belum ada penulis terdaftar. Tambahkan lewat{" "}
            <Link
              href="/studio"
              className="font-semibold text-brand-700 hover:underline"
            >
              Studio
            </Link>{" "}
            &rarr; Penulis.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {authors.map((author) => (
              <AuthorCard key={author._id} author={author} />
            ))}
          </div>
        )}
      </Reveal>

      {recentPosts.length > 0 && (
        <Reveal className="mx-auto max-w-6xl px-4 pb-24 sm:px-6" delay={100}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">
              Tulisan Terbaru
            </h2>
            <Link
              href="/"
              className="text-sm font-semibold text-brand-700 hover:underline"
            >
              Lihat semua &rarr;
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <ArticleCard key={post._id} post={post} />
            ))}
          </div>
        </Reveal>
      )}
    </div>
  );
}
