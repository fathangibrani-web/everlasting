"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

import StaticHeroCards from "@/components/StaticHeroCards";
import type { PostCard } from "@/sanity/lib/types";

const MorphHero = dynamic(() => import("@/components/MorphHero"), {
  ssr: false,
});

// "Are we past hydration?", same idiom as AuthorHoverCard. The device check
// below can only run in the browser, and this keeps the server and first
// client render identical instead of guessing.
const noopSubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Phones that will not cope with the 3D gallery.
 *
 * MorphHero already falls back when WebGL is missing, but that check runs
 * *inside* the 3D bundle — so a weak device still had to download 235KB
 * gzipped, parse ~888KB of three.js/fiber/drei, and allocate a WebGL context
 * before it could decide to bail out. On a low-end phone that parse alone is
 * roughly a second of blocked main thread. Deciding out here means the import
 * never fires and none of that cost is paid.
 *
 * `deviceMemory` is Chrome/Android only and reports GB capped at 8; when it is
 * missing (Safari, Firefox) we fall through to the core count and otherwise
 * assume the device is capable, so no capable device is ever downgraded.
 */
function isLowEndDevice() {
  if (typeof navigator === "undefined") return false;
  const memoryGb = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (typeof memoryGb === "number" && memoryGb <= 4) return true;
  if (typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4) {
    return true;
  }
  return false;
}

export default function MorphHeroLoader({ posts }: { posts: PostCard[] }) {
  const mounted = useSyncExternalStore(
    noopSubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  // Rendering nothing pre-hydration matches what this component already
  // produced on the server (MorphHero is ssr:false), so capable devices lose
  // nothing and hydration stays clean.
  if (!mounted) return null;
  if (isLowEndDevice()) return <StaticHeroCards posts={posts} />;
  return <MorphHero posts={posts} />;
}
