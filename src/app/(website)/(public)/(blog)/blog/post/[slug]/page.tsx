import BlogCategoryLabel from "@/components/blog/blog-category-label";
import { CustomMdx } from "@/components/custom-mdx";
import BackButton from "@/components/shared/back-button";
import Container from "@/components/shared/container";
import { urlForImage } from "@/lib/image";
import { portableTextToMarkdown } from "@/lib/mdx";
import { getLocaleDate } from "@/lib/utils";
import { sanityClient } from "@/sanity/lib/client";
import { singlequery } from "@/sanity/lib/queries";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";

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

    return (
        <>
            <Container className="mt-8 pb-16">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Content section */}
                    <div className="lg:w-2/3">
                        {/* blog post title */}
                        <h1 className="text-4xl font-bold mb-4">
                            {post.title}
                        </h1>

                        {/* blog post description */}
                        <p className="text-xl text-muted-foreground mb-8">
                            {post.excerpt}
                        </p>

                        {/* blog post image */}
                        <div className="relative overflow-hidden rounded-lg aspect-[16/9] mb-8">
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

                        {/* blog post content */}
                        <article className="">
                            {markdownContent && <CustomMdx source={markdownContent} />}
                        </article>

                        {/* back button */}
                        <div className="mt-16">
                            <BackButton />
                        </div>
                    </div>

                    {/* Sidebar section */}
                    <div className="lg:w-1/3 space-y-8">
                        {/* author info */}
                        <div className="bg-muted rounded-lg p-6">
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

                        {/* table of contents */}
                        <div className="bg-muted rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
                            <ul className="space-y-2">
                                {/* 这里需要根据实际内容生成目录 */}
                                <li><a href="#section1" className="text-sm hover:underline">Section 1</a></li>
                                <li><a href="#section2" className="text-sm hover:underline">Section 2</a></li>
                                {/* ... 更多目录项 ... */}
                            </ul>
                        </div>

                        {/* categories */}
                        <div className="bg-muted rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Categories</h2>
                            <ul className="space-y-2">
                                {post.categories?.map((category: any) => (
                                    <li key={category._id}>
                                        <Link 
                                            href={`/blog/category/${category.slug.current}`}
                                            className="text-sm hover:underline"
                                        >
                                            {category.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* related posts */}
                        <div className="bg-muted rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Related Posts</h2>
                            <ul className="space-y-4">
                                {/* {relatedPosts.map((relatedPost: any) => (
                                    <li key={relatedPost._id}>
                                        <Link href={`/blog/post/${relatedPost.slug.current}`} className="text-sm hover:underline">
                                            {relatedPost.title}
                                        </Link>
                                    </li>
                                ))} */}
                            </ul>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
}
