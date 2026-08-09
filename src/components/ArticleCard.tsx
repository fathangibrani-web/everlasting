import Image from "next/image";
import Link from "next/link";

import { getColorClasses } from "@/lib/colors";
import { capitalizeFirst, formatDate, getReadingTime } from "@/lib/format";
import { urlForImage } from "@/sanity/lib/image";
import type { PostCard } from "@/sanity/lib/types";

export default function ArticleCard({ post }: { post: PostCard }) {
  const colors = getColorClasses(post.category?.color);
  const readingTime = getReadingTime(post.plainBody);

  return (
    <Link
      href={`/artikel/${post.slug.current}`}
      className="glass group flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
        {post.mainImage && (
          <Image
            src={urlForImage(post.mainImage).width(600).height(375).url()}
            alt={post.mainImage.alt || post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {post.category && (
          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur ${colors.badge}`}
          >
            {post.category.title}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="line-clamp-2 text-lg font-bold leading-snug transition-colors group-hover:text-brand-700">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="line-clamp-2 flex-1 text-sm text-neutral-500 dark:text-neutral-400">
            {capitalizeFirst(post.excerpt)}
          </p>
        )}
        <div className="mt-2 flex items-center justify-between text-xs text-neutral-400">
          <span>
            {formatDate(post.publishedAt)}
            <span className="mx-1.5">&middot;</span>
            {readingTime} menit baca
          </span>
          <span className="flex items-center gap-1 font-semibold text-brand-700 opacity-0 transition-opacity group-hover:opacity-100">
            Baca
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 01.75-.75h10.638L11.29 6.15a.75.75 0 111.08-1.04l4.5 4.5a.75.75 0 010 1.04l-4.5 4.5a.75.75 0 11-1.08-1.04l3.098-3.1H3.75A.75.75 0 013 10z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
