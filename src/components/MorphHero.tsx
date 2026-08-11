"use client";

import { Html } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import { getColorClasses } from "@/lib/colors";
import { capitalizeFirst } from "@/lib/format";
import { urlForImage } from "@/sanity/lib/image";
import type { PostCard } from "@/sanity/lib/types";
import type { MotionValue } from "motion/react";

function checkWebglSupport() {
  if (typeof document === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

export default function MorphHero({ posts }: { posts: PostCard[] }) {
  const shouldReduceMotion = useReducedMotion();
  const [webglOk] = useState(checkWebglSupport);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const count = posts.length;
  if (count === 0) return null;

  if (shouldReduceMotion || !webglOk) {
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
      <div className="gallery-gradient-bg sticky top-0 h-screen w-full overflow-hidden">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{ alpha: true, antialias: true }}
          style={{ width: "100%", height: "100%" }}
        >
          <ambientLight intensity={1.2} />
          {posts.map((post, i) => (
            <CardNode
              key={post._id}
              post={post}
              index={i}
              count={count}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </Canvas>

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

function CardNode({
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
  const groupRef = useRef<THREE.Group>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const step = 1 / count;
  const start = index * step;
  const direction = index % 2 === 0 ? 1 : -1;

  useFrame(() => {
    const progress = scrollYProgress.get();
    const local = (progress - start) / step;

    const clamped = THREE.MathUtils.clamp(local, 0, 1);
    const z = THREE.MathUtils.lerp(7, -4, clamped);
    const centeredness = 1 - Math.min(Math.abs(local - 0.5) * 2, 1);
    const x = direction * 2.4 * (1 - centeredness);
    const rotY = direction * THREE.MathUtils.degToRad(20) * (1 - centeredness);

    if (groupRef.current) {
      groupRef.current.position.set(x, 0, z);
      groupRef.current.rotation.y = rotY;
    }

    let opacity = 1;
    if (local < 0.15) opacity = THREE.MathUtils.clamp(local / 0.15, 0, 1);
    else if (local > 0.85) opacity = THREE.MathUtils.clamp((1 - local) / 0.15, 0, 1);
    if (local < 0 || local > 1) opacity = 0;

    const blur = (1 - opacity) * 6;

    if (cardRef.current) {
      cardRef.current.style.opacity = String(opacity);
      cardRef.current.style.filter = blur > 0.1 ? `blur(${blur}px)` : "none";
      cardRef.current.style.pointerEvents = opacity > 0.6 ? "auto" : "none";
    }
  });

  const colors = getColorClasses(post.category?.color);

  return (
    <group ref={groupRef} position={[0, 0, 7]}>
      <Html transform occlude={false} center>
        <div
          ref={cardRef}
          style={{
            opacity: index === 0 ? 1 : 0,
            pointerEvents: index === 0 ? "auto" : "none",
          }}
          className="transition-[filter] duration-100"
        >
          <Link
            href={`/artikel/${post.slug.current}`}
            className="glass block w-[280px] overflow-hidden rounded-2xl border shadow-2xl sm:w-[360px]"
          >
            {post.mainImage && (
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={urlForImage(post.mainImage).width(760).height(475).url()}
                  alt={post.mainImage.alt || post.title}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </div>
            )}
            <div className="flex flex-col gap-2 p-5">
              {post.category && (
                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${colors.badge}`}
                >
                  {post.category.title}
                </span>
              )}
              <h2 className="text-lg font-extrabold leading-tight text-[var(--on-glass)] sm:text-xl">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="line-clamp-2 text-sm text-[var(--on-glass-soft)]">
                  {capitalizeFirst(post.excerpt)}
                </p>
              )}
              <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--on-glass-accent)]">
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
        </div>
      </Html>
    </group>
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
  const ref = useRef<HTMLSpanElement>(null);
  const step = 1 / count;
  const start = index * step;
  const mid = start + step * 0.5;
  const end = (index + 1) * step;
  const width = useTransform(scrollYProgress, [start, mid, end], [6, 24, 6]);
  const opacity = useTransform(scrollYProgress, [start, mid, end], [0.5, 1, 0.5]);

  useEffect(() => {
    const unsubWidth = width.on("change", (v) => {
      if (ref.current) ref.current.style.width = `${v}px`;
    });
    const unsubOpacity = opacity.on("change", (v) => {
      if (ref.current) ref.current.style.opacity = String(v);
    });
    return () => {
      unsubWidth();
      unsubOpacity();
    };
  }, [width, opacity]);

  return (
    <span
      ref={ref}
      style={{ width: width.get(), opacity: opacity.get() }}
      className="h-1.5 rounded-full bg-white"
    />
  );
}

function ScrollHint({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const ref = useRef<HTMLDivElement>(null);
  const opacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  useEffect(() => {
    return opacity.on("change", (v) => {
      if (ref.current) ref.current.style.opacity = String(v);
    });
  }, [opacity]);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-x-0 top-[calc(100%-4.5rem)] z-20 flex flex-col items-center gap-1.5 text-white/70"
    >
      <span className="text-[11px] font-medium uppercase tracking-[0.2em]">Scroll</span>
      <svg
        className="h-4 w-4 animate-bounce"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 17a.75.75 0 01-.53-.22l-6-6a.75.75 0 111.06-1.06L10 15.19l5.47-5.47a.75.75 0 111.06 1.06l-6 6A.75.75 0 0110 17zM10 3a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V3.75A.75.75 0 0110 3z"
          clipRule="evenodd"
        />
      </svg>
    </div>
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
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={urlForImage(post.mainImage).width(900).height(675).url()}
          alt={post.mainImage.alt || post.title}
          className="absolute inset-0 h-full w-full object-cover"
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
        <h2 className="mt-3 text-xl font-bold leading-snug text-white">{post.title}</h2>
      </div>
    </Link>
  );
}
