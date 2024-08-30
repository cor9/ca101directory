import { createClient } from 'next-sanity';
import { SanityClient } from 'sanity';
import { apiVersion, dataset, projectId } from './api';
import { token } from './token';


export const sanityClient: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  perspective: "published",
  useCdn: process.env.NODE_ENV === 'production',
  token, // when write data to sanity, token with write permission is required!
  // proxy: 'socks5://127.0.0.1:7890',
  // maxRetries: 1,
  // timeout: 10000,
});


// Blog queries
import { postquery, singlequery, pathquery, authorsquery, postsbyauthorquery, allauthorsquery, catpathquery, postsbycatquery, catquery, paginatedquery } from './queries';
export async function getAllPosts() {
  if (sanityClient) {
    return (await sanityClient.fetch(postquery)) || [];
  }
  return [];
}

// export async function getSettings() {
//   if (sanityClient) {
//     return (await sanityClient.fetch(configQuery)) || [];
//   }
//   return [];
// }

export async function getPostBySlug(slug) {
  if (sanityClient) {
    return (await sanityClient.fetch(singlequery, { slug })) || {};
  }
  return {};
}

export async function getAllPostsSlugs() {
  if (sanityClient) {
    const slugs = (await sanityClient.fetch(pathquery)) || [];
    return slugs.map(slug => ({ slug }));
  }
  return [];
}
// Author
export async function getAllAuthorsSlugs() {
  if (sanityClient) {
    const slugs = (await sanityClient.fetch(authorsquery)) || [];
    return slugs.map(slug => ({ author: slug }));
  }
  return [];
}

export async function getAuthorPostsBySlug(slug) {
  if (sanityClient) {
    return (await sanityClient.fetch(postsbyauthorquery, { slug })) || {};
  }
  return {};
}

export async function getAllAuthors() {
  if (sanityClient) {
    return (await sanityClient.fetch(allauthorsquery)) || [];
  }
  return [];
}

// Category

export async function getAllCategories() {
  if (sanityClient) {
    const slugs = (await sanityClient.fetch(catpathquery)) || [];
    return slugs.map(slug => ({ category: slug }));
  }
  return [];
}

export async function getPostsByCategory(slug) {
  if (sanityClient) {
    return (await sanityClient.fetch(postsbycatquery, { slug })) || {};
  }
  return {};
}

export async function getTopCategories() {
  if (sanityClient) {
    return (await sanityClient.fetch(catquery)) || [];
  }
  return [];
}

export async function getPaginatedPosts({ limit, pageIndex = 0 }) {
  if (sanityClient) {
    return (
      (await sanityClient.fetch(paginatedquery, {
        pageIndex: pageIndex,
        limit: limit
      })) || []
    );
  }
  return [];
}
