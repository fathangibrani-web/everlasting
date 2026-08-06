import type { PortableTextBlock } from "next-sanity";
import type { Image } from "sanity";

export type CategoryRef = {
  title: string;
  slug: { current: string };
  color?: string;
};

export type AuthorRef = {
  name: string;
  tagline?: string;
  photo?: Image;
  socials?: { platform: string; url: string }[];
};

export type PostCard = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage: Image;
  publishedAt: string;
  featured?: boolean;
  category: CategoryRef;
  author?: AuthorRef;
};

export type PostDetail = Omit<PostCard, "author"> & {
  body: PortableTextBlock[];
  author?: AuthorRef;
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

export type SiteInfo = {
  about?: PortableTextBlock[];
  vision?: string;
  mission?: string[];
};
