import Link from "next/link";

import { getColorClasses } from "@/lib/colors";
import { urlForImage } from "@/sanity/lib/image";
import type { PostCard } from "@/sanity/lib/types";

// The gallery's no-WebGL / low-end fallback. It deliberately lives in its own
// module, importing nothing from three.js, so MorphHeroLoader can render it
// WITHOUT pulling in the 3D bundle at all — see the note there.
export default function StaticHeroCards({ posts }: { posts: PostCard[] }) {
  if (posts.length === 0) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 sm:px-6">
      {posts.map((post) => (
        <StaticHeroCard key={post._id} post={post} />
      ))}
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
