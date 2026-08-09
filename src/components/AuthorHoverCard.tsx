"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useAuthorsIndex } from "@/components/AuthorsIndexContext";
import SocialIcon from "@/components/SocialIcon";
import { urlForImage } from "@/sanity/lib/image";

export default function AuthorHoverCard({
  authorSlug,
  children,
}: {
  authorSlug?: string;
  children: React.ReactNode;
}) {
  const authors = useAuthorsIndex();
  const author = authorSlug ? authors.find((a) => a.slug === authorSlug) : undefined;

  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldReduceMotion = useReducedMotion();

  if (!author) return <>{children}</>;

  const clearTimers = () => {
    if (showTimer.current) clearTimeout(showTimer.current);
    if (hideTimer.current) clearTimeout(hideTimer.current);
  };

  const handleEnter = () => {
    clearTimers();
    showTimer.current = setTimeout(() => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (rect) {
        const cardWidth = 288;
        setCoords({
          top: rect.bottom + window.scrollY + 8,
          left: Math.min(
            Math.max(rect.left + window.scrollX, 12),
            window.innerWidth - cardWidth - 12
          ),
        });
      }
      setOpen(true);
    }, 200);
  };

  const handleLeave = () => {
    clearTimers();
    hideTimer.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <span
      ref={triggerRef}
      className="inline-flex"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                initial={
                  shouldReduceMotion
                    ? undefined
                    : { opacity: 0, y: -6, scale: 0.97 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={
                  shouldReduceMotion
                    ? undefined
                    : { opacity: 0, y: -6, scale: 0.97 }
                }
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.18,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  position: "absolute",
                  top: coords.top,
                  left: coords.left,
                  zIndex: 200,
                  width: 288,
                }}
                className="glass-strong rounded-2xl border p-4 shadow-2xl"
                onMouseEnter={clearTimers}
                onMouseLeave={handleLeave}
              >
                <div className="flex items-center gap-3">
                  {author.photo && (
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={urlForImage(author.photo).width(96).height(96).url()}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </span>
                  )}
                  <div>
                    <p className="font-semibold text-[var(--on-glass)]">
                      {author.name}
                    </p>
                    {author.tagline && (
                      <p className="text-xs text-[var(--on-glass-accent)]">
                        {author.tagline}
                      </p>
                    )}
                  </div>
                </div>

                {author.socials && author.socials.length > 0 && (
                  <div className="mt-3 flex gap-1.5">
                    {author.socials.map((s) => (
                      <a
                        key={s.platform}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] text-[var(--on-glass-soft)] transition-colors hover:text-[var(--on-glass-accent)]"
                      >
                        <SocialIcon platform={s.platform} className="h-3.5 w-3.5" />
                      </a>
                    ))}
                  </div>
                )}

                {author.posts.length > 0 && (
                  <div className="mt-3 border-t border-[var(--border)]/40 pt-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--on-glass-soft)]">
                      Tulisan lainnya
                    </p>
                    <ul className="mt-1.5 space-y-1">
                      {author.posts.slice(0, 4).map((p) => (
                        <li key={p.slug}>
                          <Link
                            href={`/artikel/${p.slug}`}
                            className="line-clamp-1 block text-xs text-[var(--on-glass)] transition-colors hover:text-[var(--on-glass-accent)]"
                          >
                            {p.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </span>
  );
}
