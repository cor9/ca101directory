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
            {/* set max width to keep blog post content in the middle of screen */}
            <Container className="max-w-screen-lg mt-4">
                <div className="relative z-0 mx-auto aspect-video overflow-hidden rounded-lg">
                    {/* https://ui.shadcn.com/docs/components/aspect-ratio */}
                    {/* TODO: use aspect ratio component to make the image responsive */}
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
                        <BlogCategoryLabel categories={post.categories} />
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
                    <article className="mt-8 mx-auto">
                        {markdownContent && <CustomMdx source={markdownContent} /> }
                    </article>

                    {/* back button */}
                    <div className="my-16 flex justify-center">
                        <BackButton />
                    </div>
                </div>
            </Container>
        </>
    );
}
