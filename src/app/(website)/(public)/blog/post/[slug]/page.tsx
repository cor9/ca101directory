import { BlogToc } from "@/components/blog/blog-toc";
import { CustomMdx } from "@/components/custom-mdx";
import { buttonVariants } from "@/components/ui/button";
import { urlForImage } from "@/lib/image";
import { portableTextToMarkdown } from "@/lib/mdx";
import { getTableOfContents } from "@/lib/toc";
import { cn, getLocaleDate } from "@/lib/utils";
import { sanityClient } from "@/sanity/lib/client";
import { singlequery } from "@/sanity/lib/queries";
import { ArrowLeftIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PostPageProps {
    params: { slug: string };
};

export default async function PostPage({ params }: PostPageProps) {
    const slug = params.slug;
    const queryParams = { slug };
    const post = await sanityClient.fetch(
        singlequery,
        queryParams,
        {
            useCdn: false,
            next: {
                revalidate: 0,
            }
        }
    );
    if (!post) {
        console.error("PostPage, post not found");
        return notFound();
    }

    // console.log("PostPage, post", post);
    const imageProps = post?.image
        ? urlForImage(post?.image)
        : null;
    const publishDate = post.publishDate || post._createdAt;
    const date = getLocaleDate(publishDate);
    const markdownContent = portableTextToMarkdown(post.body);
    // console.log("markdownContent", markdownContent);

    const toc = await getTableOfContents(markdownContent);

    return (
        <div className="flex flex-col gap-8">
            {/* Content section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left column */}
                <div className="lg:col-span-2 space-y-8 flex flex-col">
                    {/* Basic information */}
                    <div className="order-1 space-y-8">
                        {/* blog post image */}
                        <div className="relative overflow-hidden rounded-lg aspect-[16/9]">
                            {imageProps && (
                                <Image
                                    src={imageProps.src}
                                    alt={post.image?.alt || `image for blog post`}
                                    loading="eager"
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 1024px"
                                    className="object-cover"
                                />
                            )}
                        </div>

                        {/* blog post title */}
                        <h1 className="text-4xl font-bold">
                            {post.title}
                        </h1>

                        {/* blog post description */}
                        <p className="text-xl text-muted-foreground">
                            {post.excerpt}
                        </p>                        
                    </div>

                    {/* blog post content */}
                    <div className="order-3">
                        {markdownContent && <CustomMdx source={markdownContent} />}
                    </div>
                </div>

                {/* Right column (sidebar) */}
                <div className="order-2 lg:order-none">
                    <div className="space-y-4 lg:sticky lg:top-24">
                        {/* author info */}
                        <div className="bg-muted/50 rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Written by</h2>
                            <div className="flex items-center gap-4">
                                <div className="relative h-16 w-16 flex-shrink-0">
                                    {post.author?.image && (
                                        <Image
                                            src={post?.author?.image}
                                            alt={`avatar for ${post.author.name}`}
                                            className="rounded-full object-cover border"
                                            fill
                                            sizes="64px"
                                        />
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-lg">{post.author.name}</p>
                                    <p className="text-sm text-muted-foreground">{date}</p>
                                </div>
                            </div>
                        </div>

                        {/* categories */}
                        <div className="bg-muted/50 rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Categories</h2>
                            <ul className="flex flex-wrap gap-4">
                                {post.categories?.map((category: any) => (
                                    <li key={category._id}>
                                        <Link href={`/blog/${category.slug.current}`}
                                            className="text-sm hover:underline underline-offset-4">
                                            {category.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* table of contents */}
                        <div className="bg-muted/50 rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
                            <div className="max-h-[calc(100vh-18rem)] overflow-y-auto">
                                <BlogToc toc={toc} />
                            </div>
                        </div>

                        {/* related posts */}
                        {/* ... (if you have related posts, you can add them here) ... */}
                    </div>
                </div>
            </div>

            {/* back button */}
            <div className="flex justify-start items-center mt-8">
                <Link
                    href="/blog"
                    className={cn(
                        buttonVariants({ variant: "default", size: "lg" }),
                        "inline-flex items-center gap-2 group"
                    )}
                >
                    <ArrowLeftIcon className="w-5 h-5
                            transition-transform duration-200 group-hover:-translate-x-1" />
                    All Posts
                </Link>
            </div>
        </div>
    );
}
