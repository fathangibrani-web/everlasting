"use client";

import dynamic from "next/dynamic";

import type { PostCard } from "@/sanity/lib/types";

const MorphHero = dynamic(() => import("@/components/MorphHero"), {
  ssr: false,
});

export default function MorphHeroLoader({ posts }: { posts: PostCard[] }) {
  return <MorphHero posts={posts} />;
}
