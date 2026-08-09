import type { PortableTextBlock } from "next-sanity";
import type { Image } from "sanity";

export type CategoryRef = {
  title: string;
  slug: { current: string };
  color?: string;
};

export type AuthorRef = {
  name: string;
  slug?: string;
  tagline?: string;
  photo?: Image;
  socials?: { platform: string; url: string }[];
};

export type PostCard = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage: Image & { alt?: string };
  publishedAt: string;
  featured?: boolean;
  category: CategoryRef;
  author?: AuthorRef;
  plainBody?: string;
};

export type PostDetail = Omit<PostCard, "author"> & {
  body: PortableTextBlock[];
  author?: AuthorRef;
  deck?: string;
  nextRead?: PostCard | null;
};

export type Category = {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  color?: string;
  postCount: number;
};

export type Author = {
  _id: string;
  name: string;
  slug: { current: string };
  tagline?: string;
  photo?: Image;
  bio?: PortableTextBlock[];
  email?: string;
  socials?: { platform: string; url: string }[];
  postCount: number;
};

export type AuthorIndexEntry = {
  _id: string;
  name: string;
  slug: string;
  tagline?: string;
  bio?: string;
  photo?: Image;
  socials?: { platform: string; url: string }[];
  posts: { title: string; slug: string }[];
};

export type SearchPost = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  category?: { title: string; color?: string };
};

export type SiteInfo = {
  about?: PortableTextBlock[];
  vision?: string;
  mission?: string[];
};
