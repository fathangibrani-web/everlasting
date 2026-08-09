"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { getColorClasses } from "@/lib/colors";
import { capitalizeFirst } from "@/lib/format";
import type { SearchPost } from "@/sanity/lib/types";

export default function SearchOverlay({
  posts,
  scrolled = false,
}: {
  posts: SearchPost[];
  scrolled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    const id = requestAnimationFrame(() => inputRef.current?.focus());

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      cancelAnimationFrame(id);
    };
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return posts
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q) ||
          p.category?.title.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [posts, query]);

  return (
    <>
      <button
        type="button"
        aria-label="Cari artikel"
        onClick={() => setOpen(true)}
        className={`flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] transition-colors hover:border-brand-300 ${
          scrolled
            ? "text-[var(--on-glass-soft)] hover:text-[var(--on-glass-accent)]"
            : "text-neutral-600 hover:text-brand-700 dark:text-neutral-300"
        }`}
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor">
          <circle cx="9" cy="9" r="6" strokeWidth="2" />
          <path d="M17 17l-4-4" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-20 sm:pt-28">
          <button
            type="button"
            aria-label="Tutup pencarian"
            onClick={close}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <div className="glass-strong relative w-full max-w-xl overflow-hidden rounded-2xl border shadow-2xl">
            <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3">
              <svg
                className="h-4 w-4 shrink-0 text-[var(--on-glass-soft)]"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="9" cy="9" r="6" strokeWidth="2" />
                <path d="M17 17l-4-4" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari artikel..."
                className="w-full bg-transparent text-sm text-[var(--on-glass)] outline-none placeholder:text-[var(--on-glass-soft)]"
              />
              <button
                type="button"
                aria-label="Tutup"
                onClick={close}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[var(--on-glass-soft)] hover:bg-white/10 hover:text-[var(--on-glass-accent)]"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {query.trim() === "" && (
                <p className="px-3 py-6 text-center text-sm text-[var(--on-glass-soft)]">
                  Ketik judul, ringkasan, atau genre artikel.
                </p>
              )}
              {query.trim() !== "" && results.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-[var(--on-glass-soft)]">
                  Tidak ada hasil untuk &ldquo;{query}&rdquo;.
                </p>
              )}
              {results.map((post) => {
                const colors = getColorClasses(post.category?.color);
                return (
                  <Link
                    key={post._id}
                    href={`/artikel/${post.slug.current}`}
                    onClick={close}
                    className="flex flex-col gap-1 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/10"
                  >
                    <div className="flex items-center gap-2">
                      {post.category && (
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${colors.badge}`}
                        >
                          {post.category.title}
                        </span>
                      )}
                      <span className="line-clamp-1 text-sm font-semibold">
                        {post.title}
                      </span>
                    </div>
                    {post.excerpt && (
                      <p className="line-clamp-1 text-xs text-[var(--on-glass-soft)]">
                        {capitalizeFirst(post.excerpt)}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
