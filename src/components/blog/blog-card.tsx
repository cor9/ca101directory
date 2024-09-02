import BlogCategoryList from "@/components/blog/blog-category";
import { urlForImage } from "@/lib/image";
import { cn, getLocaleDate } from "@/lib/utils";
import { PostInfo } from "@/types";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type BlogCardProps = {
  post: PostInfo;
};

export default function BlogCard({ post }: BlogCardProps) {
  const imageProps = post?.image
    ? urlForImage(post.image)
    : null;
  // const imageProps = null; // for testing
  const publishDate = post.publishDate || post._createdAt;
  const date = getLocaleDate(publishDate);

  return (
    <>
      <div
        className="group cursor-pointer">
        {/* bg-muted is used when imageProps is null */}
        <div
          className={cn(
            "overflow-hidden rounded-md bg-muted",
            "transition-all hover:scale-105"
          )}>
          <Link
            className={cn(
              "relative block",
              "aspect-square"
            )}
            href={`/blog/${post.slug.current}`}>
            {imageProps ? (
              <Image
                src={imageProps.src}
                // {...(post.image.blurDataURL && {
                //   placeholder: "blur",
                //   blurDataURL: post.image.blurDataURL
                // })}
                alt={post.image.alt || "image for blog post"}
                className="object-cover transition-all"
                fill
                sizes="(max-width: 768px) 30vw, 33vw"
              />
            ) : (
              // show image icon when no image is found
              <span className={cn(
                "absolute w-16 h-16 text-muted-foreground",
                "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              )}>
                <ImageIcon className="w-16 h-16" />
              </span>
            )}
          </Link>
        </div>

        {/* post info */}
        <div className="mt-4">
          <div>
            {/* post categories */}
            <BlogCategoryList categories={post.categories} />

            {/* post title */}
            <h2 className="mt-4 text-lg line-clamp-2 font-medium font-serif">
              <Link
                href={`/blog/${post.slug.current}`}>
                <span
                  className="bg-gradient-to-r from-green-200 to-green-100 
                    bg-[length:0px_10px] bg-left-bottom bg-no-repeat
                    transition-[background-size]
                    duration-500
                    hover:bg-[length:100%_3px]
                    group-hover:bg-[length:100%_10px]
                    dark:from-purple-800 dark:to-purple-900">
                  {post.title}
                </span>
              </Link>
            </h2>

            {/* post excerpt, hidden for now */}
            <div className="hidden">
              {post.excerpt && (
                <p className="mt-2 line-clamp-3 text-sm text-gray-500 dark:text-gray-400">
                  <Link
                    href={`/blog/${post.slug.current}`}>
                    {post.excerpt}
                  </Link>
                </p>
              )}
            </div>

            {/* post author & date */}
            <div className="mt-4 flex items-center justify-between space-x-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="relative h-5 w-5 flex-shrink-0">
                  {post?.author?.image && (
                    <Image
                      src={post?.author?.image}
                      alt={`avatar for ${post?.author?.name}`}
                      className="rounded-full object-cover border"
                      fill
                      sizes="24px"
                    />
                  )}
                </div>
                <span className="truncate text-sm">
                  {post?.author?.name}
                </span>
              </div>

              <time className="truncate text-sm"
                dateTime={post?.publishDate || post._createdAt}>
                {date}
              </time>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
