"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { getColorClasses } from "@/lib/colors";
import { capitalizeFirst, formatDate } from "@/lib/format";
import { urlForImage } from "@/sanity/lib/image";
import type { PostCard } from "@/sanity/lib/types";

export default function FeaturedCarousel({ posts }: { posts: PostCard[] }) {
  const [index, setIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const didDrag = useRef(false);
  const paused = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const count = posts.length;

  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => {
      if (!paused.current) setIndex((i) => (i + 1) % count);
    }, 6000);
    return () => clearInterval(id);
  }, [count]);

  if (count === 0) return null;

  const goTo = (i: number) => setIndex(((i % count) + count) % count);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setDragging(true);
    didDrag.current = false;
    paused.current = true;
    startX.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const delta = e.clientX - startX.current;
    if (Math.abs(delta) > 12) didDrag.current = true;
    setDragOffset(delta);
  };

  const endDrag = () => {
    if (!dragging) return;
    const width = containerRef.current?.offsetWidth ?? 1;
    const threshold = width * 0.15;
    if (dragOffset < -threshold) goTo(index + 1);
    else if (dragOffset > threshold) goTo(index - 1);
    setDragging(false);
    setDragOffset(0);
    paused.current = false;
  };

  return (
    <div
      className="glass group/carousel relative overflow-hidden rounded-3xl border shadow-sm"
      ref={containerRef}
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <div
        className="flex touch-pan-y select-none"
        style={{
          transform: `translateX(calc(${-index * 100}% + ${dragOffset}px))`,
          transition: dragging ? "none" : "transform 500ms ease",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={(e) => {
          if (didDrag.current) {
            e.preventDefault();
            e.stopPropagation();
            didDrag.current = false;
          }
        }}
      >
        {posts.map((post, i) => (
          <div key={post._id} className="w-full shrink-0">
            <Slide post={post} isActive={i === index} />
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Sebelumnya"
            onClick={() => goTo(index - 1)}
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--card)]/80 text-lg text-[var(--on-glass-accent)] opacity-0 shadow-md backdrop-blur transition-opacity hover:bg-white/10 group-hover/carousel:opacity-100"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Berikutnya"
            onClick={() => goTo(index + 1)}
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--card)]/80 text-lg text-[var(--on-glass-accent)] opacity-0 shadow-md backdrop-blur transition-opacity hover:bg-white/10 group-hover/carousel:opacity-100"
          >
            ›
          </button>

          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {posts.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Slide ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all hover:bg-brand-600/70 ${
                  i === index ? "w-6 bg-brand-600" : "w-1.5 bg-brand-600/30"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Slide({ post, isActive }: { post: PostCard; isActive: boolean }) {
  const colors = getColorClasses(post.category?.color);

  return (
    <Link
      href={`/artikel/${post.slug.current}`}
      draggable={false}
      className="grid grid-cols-1 md:grid-cols-2"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 md:aspect-auto dark:bg-neutral-900">
        {post.mainImage && (
          <Image
            src={urlForImage(post.mainImage).width(900).height(600).url()}
            alt={post.mainImage.alt || post.title}
            fill
            draggable={false}
            priority={isActive}
            loading={isActive ? undefined : "lazy"}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        )}
      </div>
      <div className="flex flex-col justify-center gap-4 p-6 sm:p-10">
        {post.category && (
          <span
            className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${colors.badge}`}
          >
            {post.category.title}
          </span>
        )}
        <h2 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="line-clamp-3 text-[var(--on-glass-soft)]">
            {capitalizeFirst(post.excerpt)}
          </p>
        )}
        <div className="flex items-center gap-2 text-sm text-[var(--on-glass-soft)]">
          <span>{formatDate(post.publishedAt)}</span>
          <span>&middot;</span>
          <span className="font-semibold text-[var(--on-glass-accent)]">Baca selengkapnya</span>
        </div>
      </div>
    </Link>
  );
}
