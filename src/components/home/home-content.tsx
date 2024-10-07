import { BlogPostListQueryResult, ItemListQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import { blogPostListOfLatestQuery, itemListOfFeaturedQuery, itemListOfLatestQuery } from '@/sanity/lib/queries';
import BlogGrid from '../blog/blog-grid';
import ItemGrid from '../item/item-grid';

export async function HomeContent() {
  const [featuredItems, latestItems, latestBlogPosts] = await Promise.all([
    sanityFetch<ItemListQueryResult>({
      query: itemListOfFeaturedQuery
    }),
    sanityFetch<ItemListQueryResult>({
      query: itemListOfLatestQuery
    }),
    sanityFetch<BlogPostListQueryResult>({
      query: blogPostListOfLatestQuery
    })
  ]);

  return (
    <div className="flex flex-col gap-8">
      <ItemGrid items={featuredItems} />
      <ItemGrid items={latestItems} />
      <BlogGrid posts={latestBlogPosts} />
    </div>
  );
}
