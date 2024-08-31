import BlogCategoryList from "@/components/blog/blog-category";
import { MdxRemoteClient } from "@/components/mdx-remote-client";
import MaxWidthContainer from "@/components/shared/max-width-container";
import { buttonVariants } from "@/components/ui/button";
import { urlForImage } from "@/lib/image";
import { cn } from "@/lib/utils";
import { sanityClient } from "@/sanity/lib/client";
import { singlequery } from "@/sanity/lib/queries";
import toMarkdown from '@sanity/block-content-to-markdown';
import { ArrowLeftIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
    params: { slug: string };
};

export default async function PostPage({ params }: Props) {
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

    console.log("PostPage, post", post);

    const imageProps = post?.image
        ? urlForImage(post?.image)
        : null;

    const publishDate = post.publishDate || post._createdAt;
    const date = new Date(publishDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const markdownContent = toMarkdown(post.body);
    console.log("markdownContent", markdownContent);

    return (
        <>
            {/* set max width to keep blog post content in the middle of screen */}
            <MaxWidthContainer className="max-w-screen-lg mt-4">
                <div className="relative z-0 mx-auto aspect-video overflow-hidden rounded-lg">
                    {imageProps && (
                        <Image
                            src={imageProps.src}
                            alt={post.image?.alt || `image for blog post`}
                            loading="eager"
                            fill
                            sizes="100vw"
                            className="object-cover"
                        />
                    )}
                </div>

                <div className="mt-8 mx-auto max-w-screen-md">
                    {/* blog post categories */}
                    <div className="flex justify-center">
                        <BlogCategoryList categories={post.categories} />
                    </div>

                    {/* blog post title */}
                    <h1 className="mt-8 text-center text-3xl font-semibold">
                        {post.title}
                    </h1>

                    <div className="mt-8 flex items-center justify-center text-muted-foreground">
                        <div className="w-full flex items-center justify-center gap-4">

                            {/* author avatar and name */}
                            <div className="flex items-center justify-start gap-2">
                                <div className="relative h-8 w-8 flex-shrink-0">
                                    {post.author?.image && (
                                        <Image
                                            src={post?.author?.image}
                                            alt={`avatar for ${post.author.name}`}
                                            className="rounded-full object-cover border"
                                            fill
                                            sizes="40px"
                                        />
                                    )}
                                </div>

                                <p className="">
                                    {post.author.name}
                                </p>
                            </div>

                            {/* published date and reading time */}
                            <span>&bull;</span>
                            <div>
                                <div className="flex items-center space-x-2 text-sm">
                                    <time
                                        className=""
                                        dateTime={post?.publishDate || post._createdAt}>
                                        {date}
                                    </time>
                                </div>
                            </div>
                            <span>&bull;</span>
                            <span>{post.estReadingTime || "5"} min read</span>
                        </div>
                    </div>

                    {/* blog post content */}
                    {/* https://github.com/tailwindlabs/tailwindcss-typography */}
                    {/* https://github.com/tailwindlabs/tailwindcss-typography?tab=readme-ov-file#overriding-max-width */}
                    {/* 使用 PortableText 组件的话，需要额外加上 prose prose-slate dark:prose-invert 作为样式 */}
                    {/* 使用 MdxRemoteClient 组件的话，不需要额外加样式，因为组件内都是自定义组件了 */}
                    {/* <article className="max-w-none mx-auto mt-8 prose prose-slate dark:prose-invert">
                        {post.body && <PortableText value={post.body} />}
                    </article> */}
                    <article className="mt-4 mx-auto">
                        {post.body &&
                            <MdxRemoteClient
                                source={markdownContent}
                            />
                        }
                    </article>

                    {/* back to all posts button */}
                    {/* TODO: back to last page? add animations */}
                    <div className="my-16 flex justify-center">
                        <Link href="/blog"
                            className={cn(
                                buttonVariants({ variant: "outline", size: "lg" }),
                                "flex items-center gap-2"
                            )}>
                            <ArrowLeftIcon className="w-5 h-5" />
                            Back to all posts
                        </Link>
                    </div>
                </div>
            </MaxWidthContainer>
        </>
    );
}
