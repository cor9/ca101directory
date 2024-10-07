import { BlogPostListQueryResult, ItemListQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import { blogPostListOfLatestQuery, itemListOfFeaturedQuery, itemListOfLatestQuery } from '@/sanity/lib/queries';
import { ArrowRightIcon, BookTextIcon, SparklesIcon, StarIcon } from 'lucide-react';
import Link from 'next/link';
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
      {/* latest products */}
      {latestItems && latestItems.length > 0 && (
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-indigo-500" />
              <h2 className="text-lg font-semibold text-gradient_indigo-purple">
                Latest Products
              </h2>
            </div>

            <Link href="/search" className="text-lg group flex items-center gap-2 hover:text-primary">
              <span>More</span>
              <ArrowRightIcon className="size-4 icon-scale" />
            </Link>
          </div>

          <ItemGrid items={latestItems} />
        </div>
      )}

      {/* featured products */}
      {featuredItems && featuredItems.length > 0 && (
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <StarIcon className="w-4 h-4 text-indigo-500" />
              <h2 className="text-lg font-semibold text-gradient_indigo-purple">
                Featured Products
              </h2>
            </div>

            <Link href="/search" className="text-lg group flex items-center gap-2 hover:text-primary">
              <span>More</span>
              <ArrowRightIcon className="size-4 icon-scale" />
            </Link>
          </div>

          <ItemGrid items={featuredItems} />
        </div>
      )}

      {/* latest posts */}
      {latestBlogPosts && latestBlogPosts.length > 0 && (
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <BookTextIcon className="w-4 h-4 text-indigo-500" />
              <h2 className="text-lg font-semibold text-gradient_indigo-purple">
                Latest Posts
              </h2>
            </div>

            <Link href="/blog" className="text-lg group flex items-center gap-2 hover:text-primary">
              <span>More</span>
              <ArrowRightIcon className="size-4 icon-scale" />
            </Link>
          </div>

          <BlogGrid posts={latestBlogPosts} />
        </div>
      )}
    </div>
  );
}
