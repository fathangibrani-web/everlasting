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
  large = false,
  triggerClassName = "inline-flex",
  children,
}: {
  authorSlug?: string;
  large?: boolean;
  triggerClassName?: string;
  children: React.ReactNode;
}) {
  const authors = useAuthorsIndex();
  const author = authorSlug ? authors.find((a) => a.slug === authorSlug) : undefined;

  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, flip: false });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldReduceMotion = useReducedMotion();

  if (!author) return <>{children}</>;

  const cardWidth = large ? 380 : 288;
  const estimatedHeight = large ? 420 : 220;
  const photoSize = large ? "h-20 w-20" : "h-12 w-12";
  const photoPx = large ? 160 : 96;

  const clearTimers = () => {
    if (showTimer.current) clearTimeout(showTimer.current);
    if (hideTimer.current) clearTimeout(hideTimer.current);
  };

  const handleEnter = () => {
    clearTimers();
    showTimer.current = setTimeout(() => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (rect) {
        const fitsAbove = rect.top > estimatedHeight + 20;
        setCoords({
          top: fitsAbove
            ? rect.top + window.scrollY - 10
            : rect.bottom + window.scrollY + 10,
          left: Math.min(
            Math.max(rect.left + window.scrollX, 12),
            window.innerWidth - cardWidth - 12
          ),
          flip: !fitsAbove,
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
      className={triggerClassName}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: coords.top,
              left: coords.left,
              zIndex: 200,
              width: cardWidth,
              transform: coords.flip ? undefined : "translateY(-100%)",
            }}
          >
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={
                    shouldReduceMotion
                      ? undefined
                      : { opacity: 0, y: coords.flip ? -8 : 8, scale: 0.97 }
                  }
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={
                    shouldReduceMotion
                      ? undefined
                      : { opacity: 0, y: coords.flip ? -8 : 8, scale: 0.97 }
                  }
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.22,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`glass-strong rounded-2xl border shadow-2xl ${large ? "p-6" : "p-4"} ${coords.flip ? "mt-2" : "mb-2"}`}
                  onMouseEnter={clearTimers}
                  onMouseLeave={handleLeave}
                >
                <div className="flex items-center gap-3">
                  {author.photo && (
                    <span
                      className={`relative ${photoSize} shrink-0 overflow-hidden rounded-full`}
                    >
                      <Image
                        src={urlForImage(author.photo).width(photoPx).height(photoPx).url()}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </span>
                  )}
                  <div>
                    <p
                      className={`font-semibold text-[var(--on-glass)] ${large ? "text-lg" : ""}`}
                    >
                      {author.name}
                    </p>
                    {author.tagline && (
                      <p
                        className={`text-[var(--on-glass-accent)] ${large ? "text-sm" : "text-xs"}`}
                      >
                        {author.tagline}
                      </p>
                    )}
                  </div>
                </div>

                {large && author.bio && (
                  <p className="mt-4 text-sm leading-relaxed text-[var(--on-glass-soft)]">
                    {author.bio}
                  </p>
                )}

                {author.socials && author.socials.length > 0 && (
                  <div className={`flex gap-1.5 ${large ? "mt-4" : "mt-3"}`}>
                    {author.socials.map((s) => (
                      <a
                        key={s.platform}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center rounded-full border border-[var(--border)] text-[var(--on-glass-soft)] transition-colors hover:text-[var(--on-glass-accent)] ${
                          large ? "h-9 w-9" : "h-7 w-7"
                        }`}
                      >
                        <SocialIcon
                          platform={s.platform}
                          className={large ? "h-4 w-4" : "h-3.5 w-3.5"}
                        />
                      </a>
                    ))}
                  </div>
                )}

                {author.posts.length > 0 && (
                  <div
                    className={`border-t border-[var(--border)]/40 ${large ? "mt-4 pt-4" : "mt-3 pt-3"}`}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--on-glass-soft)]">
                      {large ? "Karya lainnya" : "Tulisan lainnya"}
                    </p>
                    <ul className={large ? "mt-2 space-y-1.5" : "mt-1.5 space-y-1"}>
                      {author.posts.slice(0, large ? 6 : 4).map((p) => (
                        <li key={p.slug}>
                          <Link
                            href={`/artikel/${p.slug}`}
                            className={`line-clamp-1 block text-[var(--on-glass)] transition-colors hover:text-[var(--on-glass-accent)] ${
                              large ? "text-sm" : "text-xs"
                            }`}
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
            </AnimatePresence>
          </div>,
          document.body
        )}
    </span>
  );
}
