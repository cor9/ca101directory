import BlogCategoryList from "@/components/blog/blog-category";
import { CustomMdx } from "@/components/custom-mdx";
import Container from "@/components/shared/container";
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
    
    // https://github.com/sanity-io/block-content-to-markdown
    // https://github.com/skillrecordings/products/blob/dcfd9e9b339b178b297f1f0932ecc0e73e25fbaf/apps/epic-web/migrations/pt-to-md.ts#L84
    const serializers = {
        types: {
          image: ({node}: any) => {
            // don't use toMarkdown.getImageUrl, because it doesn't work
            // const imageUrl = toMarkdown.getImageUrl({options: {}, node});
            const imageUrl = urlForImage(node);
            // console.log("node", node);
            console.log("imageUrl", imageUrl);
            return `![${node.alt || 'image'}](${imageUrl.src})`;
          },
          code: ({node}: any) => {
            // From @sanity/code-input
            return `\`\`\`${node.language || ''}\n${node.code}\n\`\`\``;
          },
        },
      }

    const markdownContent = toMarkdown(post.body, { serializers });
    // console.log("markdownContent", markdownContent);

    return (
        <>
            {/* set max width to keep blog post content in the middle of screen */}
            <Container className="max-w-screen-lg mt-4">
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
                    <article className="mt-4 mx-auto">
                        {markdownContent && <CustomMdx source={markdownContent} /> }
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
            </Container>
        </>
    );
}
