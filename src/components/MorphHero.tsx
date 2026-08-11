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

// Camera sits at this z and looks at the origin (react-three-fiber's default).
// CardNode's distance-from-camera math below depends on this value.
const CAMERA_Z = 5;

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
          camera={{ position: [0, 0, CAMERA_Z], fov: 50 }}
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

    // How far into its entrance this card is: 0 = not reached yet, 1 = fully
    // swung into its centered resting spot. It ramps up once and then holds
    // — no more shrinking back down at the halfway point of its segment,
    // which used to leave it prominent for only an instant.
    const ENTER_RAMP = 0.2;
    const centeredness = local <= 0 ? 0 : THREE.MathUtils.clamp(local / ENTER_RAMP, 0, 1);

    // Distance from camera is kept well clear of zero at every step, so the
    // card can never swell up or blur out from being scaled too close.
    const CLOSEST = 5; // distance once fully entered and centered
    const FARTHEST = 10; // distance while still entering
    const activeDistance = THREE.MathUtils.lerp(FARTHEST, CLOSEST, centeredness);
    const activeX = direction * 2.4 * (1 - centeredness);
    const activeZ = CAMERA_Z - activeDistance;
    const activeRotY = direction * THREE.MathUtils.degToRad(20) * (1 - centeredness);

    // Once a card has held its centered spot for a while, ease it into a
    // small "parked" slot in a row along the bottom instead of fading away —
    // it stays there, visible and clickable, for the rest of the scroll.
    const PARK_START = 0.7;
    const PARK_DISTANCE = 8;
    const PARK_SCALE = 0.5;
    const parkT = THREE.MathUtils.clamp((local - PARK_START) / (1 - PARK_START), 0, 1);
    const parkX = (index - (count - 1) / 2) * 1.3;
    const parkY = -1.8;
    const parkZ = CAMERA_Z - PARK_DISTANCE;

    const x = THREE.MathUtils.lerp(activeX, parkX, parkT);
    const y = THREE.MathUtils.lerp(0, parkY, parkT);
    const z = THREE.MathUtils.lerp(activeZ, parkZ, parkT);
    const rotY = THREE.MathUtils.lerp(activeRotY, 0, parkT);
    const scale = THREE.MathUtils.lerp(1, PARK_SCALE, parkT);

    if (groupRef.current) {
      groupRef.current.position.set(x, y, z);
      groupRef.current.rotation.y = rotY;
      groupRef.current.scale.setScalar(scale);
    }

    // Fades in once on entry, then stays fully visible (and clickable) for
    // good — including once parked. It never fades back out.
    const opacity = local <= 0 ? 0 : local < ENTER_RAMP ? local / ENTER_RAMP : 1;
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
            className="glass block w-[150px] overflow-hidden rounded-xl border shadow-2xl sm:w-[190px]"
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
            <div className="flex flex-col gap-1 p-2.5">
              {post.category && (
                <span
                  className={`w-fit rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${colors.badge}`}
                >
                  {post.category.title}
                </span>
              )}
              <h2 className="text-xs font-extrabold leading-tight text-[var(--on-glass)] sm:text-sm">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="line-clamp-2 text-[10px] text-[var(--on-glass-soft)]">
                  {capitalizeFirst(post.excerpt)}
                </p>
              )}
              <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--on-glass-accent)]">
                Baca selengkapnya
                <svg className="h-2.5 w-2.5" viewBox="0 0 20 20" fill="currentColor">
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
