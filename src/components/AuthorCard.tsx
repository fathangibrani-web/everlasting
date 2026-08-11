import Image from "next/image";

import { urlForImage } from "@/sanity/lib/image";
import type { Author } from "@/sanity/lib/types";

// Deliberately a glance only — name, tagline, output. The bio, socials and
// article list live in the hover card (see AuthorHoverCard), so repeating
// them here would just make the grid heavy.
export default function AuthorCard({ author }: { author: Author }) {
  return (
    <div className="glass group flex h-full w-full flex-col items-center gap-2 rounded-2xl border p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {author.photo && (
        <div className="relative h-16 w-16 overflow-hidden rounded-full ring-4 ring-brand-100 transition-all group-hover:ring-brand-300 dark:ring-brand-500/20">
          <Image
            src={urlForImage(author.photo).width(128).height(128).url()}
            alt={author.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
      )}
      <div>
        <h3 className="text-sm font-bold">{author.name}</h3>
        {author.tagline && (
          <p className="line-clamp-1 text-xs text-[var(--on-glass-accent)]">
            {author.tagline}
          </p>
        )}
      </div>
      <p className="text-xs text-[var(--on-glass-soft)]">{author.postCount} artikel</p>
    </div>
  );
}
