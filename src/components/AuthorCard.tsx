import Image from "next/image";

import SocialIcon from "@/components/SocialIcon";
import { urlForImage } from "@/sanity/lib/image";
import type { Author } from "@/sanity/lib/types";

export default function AuthorCard({ author }: { author: Author }) {
  return (
    <div className="glass group flex flex-col items-center gap-3 rounded-2xl border p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
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
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-neutral-600 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-700 hover:shadow-sm dark:text-neutral-300"
            >
              <SocialIcon platform={s.platform} className="h-4 w-4" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
