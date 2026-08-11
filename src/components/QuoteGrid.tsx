import Link from "next/link";

import { getColorClasses } from "@/lib/colors";
import { capitalizeFirst } from "@/lib/format";
import type { PostCard } from "@/sanity/lib/types";

export default function QuoteGrid({ posts }: { posts: PostCard[] }) {
  const items = posts.filter((p) => p.excerpt);
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {items.map((post) => {
        const colors = getColorClasses(post.category?.color);
        return (
          <Link
            key={post._id}
            href={`/artikel/${post.slug.current}`}
            className="glass group flex flex-col gap-4 rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] active:duration-100 sm:p-8"
          >
            <span className="font-display text-4xl leading-none text-[var(--on-glass-accent)]">
              &ldquo;
            </span>
            <p className="font-display text-xl italic leading-snug text-[var(--on-glass)] sm:text-2xl">
              {capitalizeFirst(post.excerpt!)}
            </p>
            <div className="mt-auto flex items-center gap-2 border-t border-[var(--border)]/40 pt-4">
              {post.category && (
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${colors.badge}`}
                >
                  {post.category.title}
                </span>
              )}
              <span className="line-clamp-1 text-sm font-semibold text-[var(--on-glass-soft)] transition-colors group-hover:text-[var(--on-glass-accent)]">
                {post.title}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
