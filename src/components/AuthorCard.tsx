import Image from "next/image";

import { urlForImage } from "@/sanity/lib/image";
import type { Author } from "@/sanity/lib/types";

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

export default function AuthorCard({ author }: { author: Author }) {
  return (
    <div className="group flex flex-col items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {author.photo && (
        <div className="relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-brand-100 transition-all group-hover:ring-brand-300 dark:ring-brand-500/20">
          <Image
            src={urlForImage(author.photo).width(160).height(160).url()}
            alt={author.name}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div>
        <h3 className="font-bold">{author.name}</h3>
        {author.tagline && (
          <p className="text-sm text-brand-700">{author.tagline}</p>
        )}
      </div>
      <p className="text-xs text-neutral-400">{author.postCount} artikel</p>
      {author.socials && author.socials.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5">
          {author.socials.map((s) => (
            <a
              key={s.platform}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.platform}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] text-sm transition-colors hover:border-brand-300 hover:bg-brand-50"
            >
              {socialIcon[s.platform] ?? "🔗"}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
