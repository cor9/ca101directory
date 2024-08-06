import { groq } from "next-sanity";

/**
 * Fields used in queries
 */
const tagFields = /* groq */ `
  ...,
  // "slug": slug.current,
  // "name": coalesce(name[$locale], name[$defaultLocale]),
  // "description": coalesce(description[$locale], description[$defaultLocale]),
`;

const categoryFields = /* groq */ `
  ...,
  // "slug": slug.current,
  // "name": coalesce(name[$locale], name[$defaultLocale]),
  // "description": coalesce(description[$locale], description[$defaultLocale]),
`;

const itemFields = /* groq */ `
  ...,
  // "slug": slug.current,
  // "name": coalesce(name[$locale], name[$defaultLocale]),
  // "description": coalesce(description[$locale], description[$defaultLocale]),
`;

/**
 * Queries
 */
export const itemListQuery = groq`*[_type == "item" && defined(slug.current)] {
  ${itemFields}
}`;

export const itemQuery = groq`*[_type == "item" && slug.current == $slug][0] {
  ${itemFields}
}`;

export const searchItemQuery = groq`*[_type == "item" && defined(slug.current)] {
  ${itemFields}
}`;

export const itemListOfCategoryQuery = groq`*[_type == "item" && defined(slug.current) 
  && $slug in categories[]->slug.current] | order(_createdAt asc) {
  ${itemFields}
}`;

export const categoryListQuery = groq`*[_type == "category" && defined(slug.current)] {
  ${categoryFields}
}`;

export const categoryQuery = groq`*[_type == "category" && slug.current == $slug][0] {
  ${categoryFields}
}`;

export const tagListQuery = groq`*[_type == "tag" && defined(slug.current)] {
  ${tagFields}
}`;

export const tagQuery = groq`*[_type == "tag" && slug.current == $slug][0] {
  ${tagFields}
}`;
