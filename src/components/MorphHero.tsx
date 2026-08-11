"use client";

import { Html } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import Reveal from "@/components/Reveal";
import { getColorClasses } from "@/lib/colors";
import { capitalizeFirst } from "@/lib/format";
import { urlForImage } from "@/sanity/lib/image";
import type { PostCard } from "@/sanity/lib/types";
import type { MotionValue } from "motion/react";

// The gallery renders through an ORTHOGRAPHIC camera, which applies no
// perspective foreshortening at all — drei's <Html transform> leaves the
// CSS `perspective` empty for one. That is what lets the cards sit in a row
// without the off-centre ones skewing like a fanned-out deck, which is what
// a perspective camera did to them.
//
// It also makes sizing exactly predictable instead of guesswork: <Html
// transform> divides an object's scale by 400/distanceFactor (= 40 by
// default) and then multiplies the whole layer by the camera's zoom. So at
// zoom 40 a card renders at precisely its CSS pixel size, and one world
// unit is precisely 40 screen pixels.
const PX_PER_UNIT = 40;
const CARD_WIDTH_PX = 300;
const CARD_GAP_PX = 42;
// Distance between the centres of two neighbouring slots, in world units.
// Wider than a card, so cards in the row can never touch, let alone stack.
const SLOT_SPACING = (CARD_WIDTH_PX + CARD_GAP_PX) / PX_PER_UNIT;

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
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Drag state lives in refs, in world units, and is read straight from
  // useFrame — a gesture never re-renders React mid-drag.
  const dragOffset = useRef(0);
  const gesture = useRef({ active: false, pointerX: 0, startOffset: 0, moved: false });

  const count = posts.length;
  const maxDrag = Math.max(count - 1, 0) * SLOT_SPACING;

  // Swallow the click that ends a drag, so letting go after a swipe doesn't
  // also open an article. This has to be a native capture listener on the
  // stage: drei's <Html> mounts its own React root on a descendant node, so
  // a React onClickCapture here would not reliably beat that root's own
  // handler, but DOM capture on an ancestor always does.
  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    const swallowDragClick = (e: MouseEvent) => {
      if (!gesture.current.moved) return;
      e.preventDefault();
      e.stopPropagation();
    };
    node.addEventListener("click", swallowDragClick, true);
    return () => node.removeEventListener("click", swallowDragClick, true);
  }, [webglOk, shouldReduceMotion]);

  const startDrag = (e: React.PointerEvent) => {
    gesture.current = {
      active: true,
      pointerX: e.clientX,
      startOffset: dragOffset.current,
      moved: false,
    };
  };

  const moveDrag = (e: React.PointerEvent) => {
    const g = gesture.current;
    if (!g.active) return;
    const dxPx = e.clientX - g.pointerX;
    if (Math.abs(dxPx) > 4) g.moved = true;
    dragOffset.current = THREE.MathUtils.clamp(
      g.startOffset + dxPx / PX_PER_UNIT,
      -maxDrag,
      maxDrag,
    );
  };

  const endDrag = () => {
    gesture.current.active = false;
  };

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
      <div
        ref={stageRef}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        // pan-y keeps vertical page scrolling native while we take over
        // horizontal dragging ourselves.
        style={{ touchAction: "pan-y" }}
        className="sticky top-0 h-screen w-full cursor-grab overflow-hidden active:cursor-grabbing"
      >
        {/* Animated backdrop lives on its own z-0 layer — separate from the
            heading/canvas/dots above it — so its top-edge fade mask (see
            .gallery-gradient-bg in globals.css) only softens the background,
            never the content sitting on top of it. */}
        <div className="gallery-gradient-bg absolute inset-0 z-0" />

        <div className="pointer-events-none absolute inset-x-0 top-8 z-20 px-6 text-center sm:top-12">
          <Reveal>
            <h2 className="logo-shimmer-text mx-auto max-w-xs font-display text-xl font-bold drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)] sm:max-w-xl sm:text-3xl md:max-w-2xl md:text-4xl">
              Temukan jawaban dari masalah-masalahmu di tulisan-tulisan ini
            </h2>
          </Reveal>
        </div>

        <Canvas
          className="relative z-10"
          orthographic
          camera={{ position: [0, 0, 10], zoom: PX_PER_UNIT }}
          gl={{ alpha: true, antialias: true }}
          style={{ width: "100%", height: "100%" }}
        >
          {posts.map((post, i) => (
            <CardNode
              key={post._id}
              post={post}
              index={i}
              count={count}
              scrollYProgress={scrollYProgress}
              dragOffset={dragOffset}
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
  dragOffset,
}: {
  post: PostCard;
  index: number;
  count: number;
  scrollYProgress: MotionValue<number>;
  dragOffset: React.RefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    // Every card owns one fixed slot in a single long row. Scrolling slides
    // the whole row sideways rather than swapping cards in and out, so a
    // card that has appeared simply stays put — always visible, always at
    // full opacity, and never landing on top of a sibling. Dragging nudges
    // the same row, which is why it shares one coordinate with scrolling.
    const focus = THREE.MathUtils.clamp(
      scrollYProgress.get() * (count - 1) - dragOffset.current / SLOT_SPACING,
      0,
      count - 1,
    );
    const slotsFromFocus = index - focus;

    // Gentle size emphasis on whichever card is centred. Deliberately small:
    // even fully scaled up, a card stays narrower than SLOT_SPACING, so the
    // emphasis can never close the gap to its neighbours.
    const emphasis = 1 - Math.min(Math.abs(slotsFromFocus), 1);

    if (groupRef.current) {
      groupRef.current.position.x = slotsFromFocus * SLOT_SPACING;
      groupRef.current.scale.setScalar(0.86 + 0.14 * emphasis);
    }
  });

  const colors = getColorClasses(post.category?.color);

  return (
    <group ref={groupRef}>
      <Html transform occlude={false} center>
        <Link
          href={`/artikel/${post.slug.current}`}
          draggable={false}
          style={{ width: CARD_WIDTH_PX }}
          className="glass block overflow-hidden rounded-xl border shadow-2xl"
        >
          {post.mainImage && (
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={urlForImage(post.mainImage).width(660).height(413).url()}
                alt={post.mainImage.alt || post.title}
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>
          )}
          <div className="flex flex-col gap-2 p-4">
            {post.category && (
              <span
                className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors.badge}`}
              >
                {post.category.title}
              </span>
            )}
            <h2 className="text-base font-extrabold leading-tight text-[var(--on-glass)]">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="line-clamp-2 text-sm text-[var(--on-glass-soft)]">
                {capitalizeFirst(post.excerpt)}
              </p>
            )}
            <span className="mt-0.5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--on-glass-accent)]">
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
