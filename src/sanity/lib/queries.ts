import { groq } from "next-sanity";

export const postCardFields = groq`
  _id,
  title,
  slug,
  excerpt,
  mainImage,
  publishedAt,
  featured,
  "category": category->{title, slug, color},
  "author": author->{name, photo, "slug": slug.current},
  "plainBody": pt::text(body)
`;

export const allPostsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    ${postCardFields}
  }
`;

export const featuredPostsQuery = groq`
  *[_type == "post" && featured == true] | order(publishedAt desc) [0...8] {
    ${postCardFields}
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    excerpt,
    deck,
    mainImage,
    body,
    "plainBody": pt::text(body),
    publishedAt,
    "category": category->{title, slug, color},
    "author": author->{name, tagline, photo, socials, "slug": slug.current},
    "nextRead": nextRead->{
      ${postCardFields}
    }
  }
`;

export const postsByCategoryQuery = groq`
  *[_type == "post" && category->slug.current == $slug] | order(publishedAt desc) {
    ${postCardFields}
  }
`;

export const allCategoriesQuery = groq`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    color,
    "postCount": count(*[_type == "post" && references(^._id)])
  }
`;

export const categoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id, title, slug, description, color
  }
`;

export const siteInfoQuery = groq`
  *[_type == "siteInfo"][0] {
    about,
    vision,
    mission
  }
`;

export const authorsQuery = groq`
  *[_type == "author"] | order(name asc) {
    _id,
    name,
    slug,
    tagline,
    photo,
    bio,
    email,
    socials,
    "postCount": count(*[_type == "post" && references(^._id)])
  }
`;

export const authorsIndexQuery = groq`
  *[_type == "author"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    tagline,
    photo,
    socials,
    "posts": *[_type == "post" && references(^._id)] | order(publishedAt desc) [0...6] {
      title,
      "slug": slug.current
    }
  }
`;

export const searchIndexQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    "category": category->{title, color}
  }
`;

export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)][].slug.current
`;

export const categorySlugsQuery = groq`
  *[_type == "category" && defined(slug.current)][].slug.current
`;
