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
  "author": author->{name, photo}
`;

export const allPostsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    ${postCardFields}
  }
`;

export const featuredPostQuery = groq`
  *[_type == "post" && featured == true] | order(publishedAt desc)[0] {
    ${postCardFields}
  }
`;

export const latestPostsQuery = groq`
  *[_type == "post" && !(featured == true && _id == $featuredId)] | order(publishedAt desc) [0...12] {
    ${postCardFields}
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    excerpt,
    mainImage,
    body,
    publishedAt,
    "category": category->{title, slug, color},
    "author": author->{name, tagline, photo, socials}
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

export const profileQuery = groq`
  *[_type == "profile"][0] {
    name,
    tagline,
    photo,
    bio,
    email,
    socials
  }
`;

export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)][].slug.current
`;

export const categorySlugsQuery = groq`
  *[_type == "category" && defined(slug.current)][].slug.current
`;
