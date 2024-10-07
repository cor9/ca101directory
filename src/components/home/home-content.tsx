import { BlogPostListQueryResult, ItemListQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import { blogPostListOfLatestQuery, itemListOfFeaturedQuery, itemListOfLatestQuery } from '@/sanity/lib/queries';
import { BookTextIcon, SparklesIcon, StarIcon } from 'lucide-react';
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
      {latestItems && latestItems.length > 0 && (
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-4 h-4 text-indigo-500" />
            <h2 className="text-lg font-semibold text-gradient_indigo-purple">
              Latest Products
            </h2>
          </div>

          <ItemGrid items={latestItems} />
        </div>
      )}

      {featuredItems && featuredItems.length > 0 && (
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <StarIcon className="w-4 h-4 text-indigo-500" />
            <h2 className="text-lg font-semibold text-gradient_indigo-purple">
              Featured Products
            </h2>
          </div>

          <ItemGrid items={featuredItems} />
        </div>
      )}

      {latestBlogPosts && latestBlogPosts.length > 0 && (
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <BookTextIcon className="w-4 h-4 text-indigo-500" />
            <h2 className="text-lg font-semibold text-gradient_indigo-purple">
              Latest Posts
            </h2>
          </div>

          <BlogGrid posts={latestBlogPosts} />
        </div>
      )}
    </div>
  );
}
