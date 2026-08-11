"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { getColorClasses } from "@/lib/colors";
import { capitalizeFirst } from "@/lib/format";
import { urlForImage } from "@/sanity/lib/image";
import type { PostCard } from "@/sanity/lib/types";
import type { MotionValue } from "motion/react";

export default function MorphHero({ posts }: { posts: PostCard[] }) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const count = posts.length;
  if (count === 0) return null;

  if (shouldReduceMotion) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 sm:px-6">
        {posts.map((post) => (
          <StaticHeroCard key={post._id} post={post} />
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ height: `${count * 100}vh` }} className="relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {posts.map((post, i) => (
          <MorphSlide
            key={post._id}
            post={post}
            index={i}
            count={count}
            scrollYProgress={scrollYProgress}
          />
        ))}

        <div className="pointer-events-none absolute inset-x-0 bottom-8 z-20 flex justify-center gap-2">
          {posts.map((_, i) => (
            <Dot key={i} index={i} count={count} scrollYProgress={scrollYProgress} />
          ))}
        </div>

        <ScrollHint scrollYProgress={scrollYProgress} />
      </div>
    </div>
  );
}

function MorphSlide({
  post,
  index,
  count,
  scrollYProgress,
}: {
  post: PostCard;
  index: number;
  count: number;
  scrollYProgress: MotionValue<number>;
}) {
  const step = 1 / count;
  const start = index * step;
  const end = (index + 1) * step;
  const fadeIn = start + step * 0.18;
  const fadeOutStart = end - step * 0.18;

  const opacity = useTransform(
    scrollYProgress,
    [start, fadeIn, fadeOutStart, end],
    [index === 0 ? 1 : 0, 1, 1, index === count - 1 ? 1 : 0]
  );
  const pointerEvents = useTransform(opacity, (o) => (o > 0.5 ? "auto" : "none"));
  const scale = useTransform(scrollYProgress, [start, fadeIn], [1.08, 1]);
  const blur = useTransform(scrollYProgress, [start, fadeIn], [8, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  const colors = getColorClasses(post.category?.color);

  return (
    <motion.div
      style={{ opacity, pointerEvents }}
      className="absolute inset-0"
      aria-hidden={index !== 0}
    >
      <Link
        href={`/artikel/${post.slug.current}`}
        className="relative block h-full w-full"
      >
        {post.mainImage && (
          <motion.div style={{ scale, filter }} className="absolute inset-0">
            <Image
              src={urlForImage(post.mainImage).width(1600).height(1200).url()}
              alt={post.mainImage.alt || post.title}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />

        <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-24 sm:px-12 sm:pb-28">
          {post.category && (
            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${colors.badge}`}
            >
              {post.category.title}
            </span>
          )}
          <h2 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="mt-3 max-w-xl text-base text-white/80 line-clamp-2 sm:text-lg">
              {capitalizeFirst(post.excerpt)}
            </p>
          )}
          <span className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-white">
            Baca selengkapnya
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 01.75-.75h10.638L11.29 6.15a.75.75 0 111.08-1.04l4.5 4.5a.75.75 0 010 1.04l-4.5 4.5a.75.75 0 11-1.08-1.04l3.098-3.1H3.75A.75.75 0 013 10z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

function Dot({
  index,
  count,
  scrollYProgress,
}: {
  index: number;
  count: number;
  scrollYProgress: MotionValue<number>;
}) {
  const step = 1 / count;
  const start = index * step;
  const mid = start + step * 0.5;
  const end = (index + 1) * step;
  const width = useTransform(scrollYProgress, [start, mid, end], [6, 24, 6]);
  const opacity = useTransform(scrollYProgress, [start, mid, end], [0.4, 1, 0.4]);

  return (
    <motion.span
      style={{ width, opacity }}
      className="h-1.5 rounded-full bg-white"
    />
  );
}

function ScrollHint({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const opacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none absolute inset-x-0 top-[calc(100%-4.5rem)] z-20 flex flex-col items-center gap-1.5 text-white/70"
    >
      <span className="text-[11px] font-medium uppercase tracking-[0.2em]">
        Scroll
      </span>
      <motion.svg
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 17a.75.75 0 01-.53-.22l-6-6a.75.75 0 111.06-1.06L10 15.19l5.47-5.47a.75.75 0 111.06 1.06l-6 6A.75.75 0 0110 17zM10 3a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V3.75A.75.75 0 0110 3z"
          clipRule="evenodd"
        />
      </motion.svg>
    </motion.div>
  );
}

function StaticHeroCard({ post }: { post: PostCard }) {
  const colors = getColorClasses(post.category?.color);
  return (
    <Link
      href={`/artikel/${post.slug.current}`}
      className="glass group relative block aspect-[4/3] overflow-hidden rounded-3xl border shadow-sm"
    >
      {post.mainImage && (
        <Image
          src={urlForImage(post.mainImage).width(900).height(675).url()}
          alt={post.mainImage.alt || post.title}
          fill
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="relative z-10 flex h-full flex-col justify-end p-6">
        {post.category && (
          <span
            className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${colors.badge}`}
          >
            {post.category.title}
          </span>
        )}
        <h2 className="mt-3 text-xl font-bold leading-snug text-white">
          {post.title}
        </h2>
      </div>
    </Link>
  );
}
