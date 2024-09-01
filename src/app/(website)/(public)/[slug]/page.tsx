import { CustomMdx } from "@/components/custom-mdx";
import Container from "@/components/shared/container";
import { portableTextToMarkdown } from "@/lib/mdx";
import { sanityClient } from "@/sanity/lib/client";
import { pageQuery } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";

interface CustomPageProps {
  params: { slug: string };
};

export default async function CustomPage({ params }: CustomPageProps) {
  console.log(`CustomPage, params: ${JSON.stringify(params)}`);
  const page = await sanityClient.fetch(pageQuery, {
    slug: params.slug,
  });

  if (!page) {
    return notFound();
  }

  console.log(`CustomPage, page title: ${page.title}`);
  console.log('CustomPage, page body: ', page.body);
  const markdownContent = portableTextToMarkdown(page.body);
  console.log("markdownContent", markdownContent);

  return (
    <Container>
      <article className="py-6 lg:py-12">
        <div className="space-y-4">
          <h1 className="inline-block font-heading text-4xl lg:text-5xl">
            {page.title}
          </h1>
          {page.excerpt && (
            <p className="text-xl text-muted-foreground">
              {page.excerpt}
            </p>
          )}
        </div>
        <hr className="my-4" />
        {markdownContent &&
          <CustomMdx source={markdownContent} />
        }
      </article>
    </Container>
  );
}
