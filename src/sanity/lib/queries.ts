import {defineQuery} from 'groq';

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
  categories[]->{
    ...,
  },
  tags[]->{
    ...,
  }
`;

/**
 * Queries
 */
export const itemQuery = defineQuery(`*[_type == "item" && slug.current == $slug][0] {
  ${itemFields}
}`);

export const itemListQuery = defineQuery(`*[_type == "item" && defined(slug.current) && defined(publishDate)] 
  | order(publishDate desc) {
  ${itemFields}
}`);

export const itemListOfCategoryQuery = defineQuery(`*[_type == "item" && defined(slug.current) && defined(publishDate)
  && $slug in categories[]->slug.current] 
  | order(publishDate desc) {
  ${itemFields}
}`);

export const itemListOfTagQuery = defineQuery(`*[_type == "item" && defined(slug.current) && defined(publishDate)
  && $slug in tags[]->slug.current] 
  | order(publishDate desc) {
  ${itemFields}
}`);

export const categoryListQuery = defineQuery(`*[_type == "category" && defined(slug.current)] 
  | order(order desc) {
  ${categoryFields}
}`);

export const categoryQuery = defineQuery(`*[_type == "category" && slug.current == $slug][0] {
  ${categoryFields}
}`);

export const tagListQuery = defineQuery(`*[_type == "tag" && defined(slug.current)] 
  | order(slug.current asc) {
  ${tagFields}
}`);

export const tagQuery = defineQuery(`*[_type == "tag" && slug.current == $slug][0] {
  ${tagFields}
}`);
