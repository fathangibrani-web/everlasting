import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import ArticleCard from "@/components/ArticleCard";
import PortableTextRenderer from "@/components/PortableTextRenderer";
import { urlForImage } from "@/sanity/lib/image";
import { allPostsQuery, profileQuery } from "@/sanity/lib/queries";
import { safeFetch } from "@/sanity/lib/safeFetch";
import type { PostCard, Profile } from "@/sanity/lib/types";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Profil — ArtikelSaya",
  description: "Kenali penulis di balik ArtikelSaya.",
};

const socialIcon: Record<string, string> = {
  Instagram: "📷",
  "Twitter / X": "🐦",
  GitHub: "💻",
  LinkedIn: "💼",
  YouTube: "▶️",
  TikTok: "🎵",
  Facebook: "📘",
  Website: "🌐",
};

export default async function ProfilPage() {
  const [profile, posts] = await Promise.all([
    safeFetch<Profile | null>(profileQuery, {}, null),
    safeFetch<PostCard[]>(allPostsQuery, {}, []),
  ]);

  if (!profile) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-3xl dark:bg-rose-500/10">
          👤
        </div>
        <h1 className="text-xl font-bold">Profil belum diisi</h1>
        <p className="text-neutral-500">
          Lengkapi dokumen &quot;Profil Saya&quot; di Sanity Studio agar
          halaman ini menampilkan foto, bio, dan sosial media kamu.
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

  const recentPosts = posts.slice(0, 3);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-rose-50 to-transparent dark:from-rose-500/10" />
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 py-16 text-center sm:px-6">
          {profile.photo && (
            <div className="relative h-32 w-32 overflow-hidden rounded-full ring-4 ring-white shadow-lg dark:ring-neutral-800">
              <Image
                src={urlForImage(profile.photo).width(256).height(256).url()}
                alt={profile.name}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {profile.name}
            </h1>
            {profile.tagline && (
              <p className="mt-1 font-medium text-rose-600">
                {profile.tagline}
              </p>
            )}
          </div>

          {profile.socials && profile.socials.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {profile.socials.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-rose-300 hover:text-rose-600 hover:shadow-md"
                >
                  <span>{socialIcon[s.platform] ?? "🔗"}</span>
                  {s.platform}
                </a>
              ))}
            </div>
          )}

          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="text-sm text-neutral-400 hover:text-rose-600"
            >
              {profile.email}
            </a>
          )}
        </div>
      </section>

      {profile.bio && profile.bio.length > 0 && (
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <PortableTextRenderer value={profile.bio} />
        </div>
      )}

      {recentPosts.length > 0 && (
        <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">
              Tulisan Terbaru
            </h2>
            <Link
              href="/"
              className="text-sm font-semibold text-rose-600 hover:underline"
            >
              Lihat semua &rarr;
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <ArticleCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
