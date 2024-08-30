import groq, { defineQuery } from 'groq';

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


// Blog Queries
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
// [(($pageIndex - 1) * 10)...$pageIndex * 10]{
// Get subsequent paginated posts
export const paginatedquery = groq`
*[_type == "blogPost"] | order(publishedDate desc, _createdAt desc) [$pageIndex...$limit] {
  ...,
  author->,
  categories[]->
}
`;

// Get Site Config
// export const configQuery = groq`
// *[_type == "settings"][0] {
//   ...,
// }
// `;

// Single Post
export const singlequery = groq`
*[_type == "blogPost" && slug.current == $slug][0] {
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
  author->,
  categories[]->,
  "estReadingTime": round(length(pt::text(body)) / 5 / 180 ),
  "related": *[_type == "blogPost" && count(categories[@._ref in ^.^.categories[]._ref]) > 0 ] | order(publishedDate desc, _createdAt desc) [0...5] {
    title,
    slug,
    "date": coalesce(publishedDate,_createdAt),
    "image": image
  },
}
`;

// Paths for generateStaticParams
export const pathquery = groq`
*[_type == "blogPost" && defined(slug.current)][].slug.current
`;
export const catpathquery = groq`
*[_type == "blogCategory" && defined(slug.current)][].slug.current
`;
// export const authorsquery = groq`
// *[_type == "author" && defined(slug.current)][].slug.current
// `;

// Get Posts by Authors
export const postsbyauthorquery = groq`
*[_type == "blogPost" && $slug match author->slug.current ] {
  ...,
  author->,
  categories[]->,
}
`;

// Get Posts by Category
export const postsbycatquery = groq`
*[_type == "blogPost" && $slug in categories[]->slug.current ] {
  ...,
  author->,
  categories[]->,
}
`;

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

// Get all Authors
// export const allauthorsquery = groq`
// *[_type == "author"] {
//  ...,
//  'slug': slug.current,
// }
// `;

// get everything from sanity
// to test connection
export const getAll = groq`*[]`;
