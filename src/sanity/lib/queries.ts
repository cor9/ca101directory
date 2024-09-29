import groq, { defineQuery } from 'groq';

/**
 * https://www.sanity.io/plugins/next-sanity#using-query-result-types
 * https://www.sanity.io/plugins/next-sanity#generate-typescript-types
 */

// ======================================================================================================================

/**
 * Item Queries
 */
const tagFields = /* groq */ `
  ...,
`;

const categoryFields = /* groq */ `
  ...,
`;

// when change the fields, please also update data/item.ts and data/submission.ts
const itemSimpleFields = /* groq */ `
  _id,
  _createdAt,
  name,
  slug,
  description,
  link,
  image {
    ...,
    "blurDataURL": asset->metadata.lqip,
    "imageColor": asset->metadata.palette.dominant.background,
  },
  publishDate,
  paid,
  order,
  pricePlan,
  freePlanStatus,
  proPlanStatus,
  rejectionReason,
  submitter->,
  categories[]->,
  tags[]->,
`;

const itemFields = /* groq */ `
  ${itemSimpleFields}
  introduction,
`;

const itemFieldsWithRelated = /* groq */ `
  ${itemSimpleFields}
  introduction,
  "related": *[_type == "item" && count(categories[@._ref in ^.^.categories[]._ref]) > 0 && _id != ^._id] 
    | order(publishedDate desc, _createdAt desc) [0...2] {
      ${itemSimpleFields}
  },
`;

export const itemByIdQuery = defineQuery(`*[_type == "item" && _id == $id][0] {
  ${itemSimpleFields}
}`);

export const itemFullInfoBySlugQuery = defineQuery(`*[_type == "item" && slug.current == $slug][0] {
  ${itemFieldsWithRelated}
}`);

export const itemFullInfoByIdQuery = defineQuery(`*[_type == "item" && _id == $id][0] {
  ${itemFields}
}`);

/**
 * NOTICE: this query is not used in the app, 
 * but it is used to generate the ItemListQueryResult type,
 * if you want to change this query, please update data/item.ts
 */
export const itemListQuery = defineQuery(`*[_type == "item" && defined(slug.current) && defined(publishDate)] 
  | order(publishDate desc) {
    ${itemSimpleFields}
}`);

export const itemListOfCategoryQuery = defineQuery(`*[_type == "item" && defined(slug.current) && defined(publishDate)
  && $slug in categories[]->slug.current] 
  | order(publishDate desc) {
    ${itemSimpleFields}
}`);

export const itemListOfTagQuery = defineQuery(`*[_type == "item" && defined(slug.current) && defined(publishDate)
  && $slug in tags[]->slug.current] 
  | order(publishDate desc) {
    ${itemSimpleFields}
}`);

export const categoryListQuery = defineQuery(`*[_type == "category" && defined(slug.current)] 
  | order(priority desc) {
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

// Submissions

/**
 * NOTICE: this query is not used in the app, 
 * but it is used to generate the SubmissionListQueryResult type,
 * if you want to change this query, please update data/submission.ts
 */
export const submissionListQuery = defineQuery(`*[_type == "item" && defined(slug.current)
  && submitter._ref == $userId] 
  | order(_createdAt desc) {
    ${itemSimpleFields}
}`);

// Page Queries
export const pageQuery = defineQuery(`
  *[_type == "page" && slug.current == $slug][0] {
    ...,
    body[]{
      ...,
      markDefs[]{
        ...,
        _type == "internalLink" => {
          "slug": @.reference->slug
        }
      }
    },
  }
`);

// ======================================================================================================================

/**
 * Blog Queries
 * 
 * when change blogPostSimpleFields, please also update buildQuery in data/blog.ts
 */
const blogPostSimpleFields = /* groq */ `
  _id,
  _createdAt,
  title,
  slug,
  excerpt,
  featured,
  image {
    ...,
    "blurDataURL": asset->metadata.lqip,
    "imageColor": asset->metadata.palette.dominant.background,
  },
  publishDate,
  author->,
  categories[]->,
`;

const blogPostFields = /* groq */ `
  ${blogPostSimpleFields}
  relatedPosts[]-> {
    ${blogPostSimpleFields}
  },
  body[]{
    ...,
    markDefs[]{
      ...,
      _type == "internalLink" => {
        "slug": @.reference->slug
      }
    }
  },
  
  // "estReadingTime": round(length(pt::text(body)) / 5 / 180 ),
  // "related": *[_type == "blogPost" && count(categories[@._ref in ^.^.categories[]._ref]) > 0 ] | order(publishedDate desc, _createdAt desc) [0...2] {
  //   slug,
  //   title,
  //   excerpt,
  //   publishDate,
  //   "date": coalesce(publishedDate, _createdAt),
  //   "image": image
  // },
`;

const blogCategoryFields = /* groq */ `
  name,
  slug,
  description,
  priority,
  color,
`;

export const blogCategoryListQuery = defineQuery(`
  *[_type == "blogCategory" && defined(slug.current)] 
  | order(priority desc) {
    ${blogCategoryFields}
}`);

export const blogPostQuery = defineQuery(`
  *[_type == "blogPost" && slug.current == $slug][0] {
    ${blogPostFields}
}`);

/**
 * NOTICE: this query is not directly used in the app, 
 * but it is used to generate the BlogPostListQueryResult type,
 * if you want to change this query, please update data/blog.ts
 */
export const blogPostListQuery = defineQuery(`
  *[_type == "blogPost" && defined(slug.current) && defined(publishDate)] 
  | order(publishDate desc) {
    ${blogPostSimpleFields}
}`);

// ======================================================================================================================

export const userWithAccountsQuery = defineQuery(`
  *[_type == "user" && _id == $id][0] {
    ...,
    accounts[]->,
  }
`);

// ======================================================================================================================

// Get top 5 categories
export const catquery = groq`*[_type == "blogCategory"] {
  ...,
  "count": count(*[_type == "blogPost" && references(^._id)])
} | order(count desc) [0...5]`;

export const searchquery = groq`*[_type == "blogPost" && _score > 0]
| score(title match $query || excerpt match $query || pt::text(body) match $query)
| order(_score desc)
{
  _score,
  _id,
  _createdAt,
  image,
  author->,
  categories[]->,
   title,
   slug
}`;

// Get all posts
export const postquery = groq`
*[_type == "blogPost"] | order(publishedDate desc, _createdAt desc) {
  _id,
  _createdAt,
  publishedDate,
  image {
    ...,
    "blurDataURL": asset->metadata.lqip,
    "ImageColor": asset->metadata.palette.dominant.background,
  },
  featured,
  excerpt,
  slug,
  title,
  author-> {
    _id,
    image,
    "slug": name, // use name as slug
    name
  },
  categories[]->,
}
`;

// Get all posts with 0..limit
export const limitquery = groq`
*[_type == "blogPost"] | order(publishedDate desc, _createdAt desc) [0..$limit] {
  ...,
  author->,
  categories[]->
}
`;

export const paginatedquery = defineQuery(`
*[_type == "blogPost"] | order(publishedDate desc, _createdAt desc) [$pageIndex...$limit] {
  ...,
  author->,
  categories[]->
}
`);
