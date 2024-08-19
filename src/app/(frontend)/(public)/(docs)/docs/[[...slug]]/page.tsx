import "@/styles/mdx.css";

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { constructMetadata, getBlurDataURL } from "@/lib/utils";
import { getTableOfContents } from "@/lib/toc";
import { Mdx } from "@/components/content/mdx-components";
import { DocsPageHeader } from "@/components/docs/docs-page-header";
import { DocsPagination } from "@/components/docs/docs-pagination";
import { TableOfContentsLayout } from "@/components/shared/toc";
import { allDocs } from "contentlayer/generated";

interface DocPageProps {
  params: {
    slug: string[];
  };
}

async function getDocFromParams(params) {
  const slug = params.slug?.join("/") || "";
  const doc = allDocs.find((doc) => doc.slugAsParams === slug);

  if (!doc) return null;
  return doc;
}

export async function generateMetadata({
  params,
}: DocPageProps): Promise<Metadata> {
  const doc = await getDocFromParams(params);
  if (!doc) return {};

  const { title, description } = doc;
  return constructMetadata({
    title: `${title}`,
    description: description,
  });
}

export async function generateStaticParams(): Promise<
  DocPageProps["params"][]
> {
  return allDocs.map((doc) => ({
    slug: doc.slugAsParams.split("/"),
  }));
}

export default async function DocPage({ params }: DocPageProps) {
  const doc = await getDocFromParams(params);

  if (!doc) {
    return notFound();
  }

  const toc = await getTableOfContents(doc.body.raw);

  const images = await Promise.all(
    doc.images.map(async (src: string) => ({
      src,
      blurDataURL: await getBlurDataURL(src),
    })),
  );

  return (
    <main className="relative w-full py-6 xl:grid xl:grid-cols-[1fr_150px] xl:gap-10">
      <div className="w-full min-w-0">
        <DocsPageHeader heading={doc.title} text={doc.description} />
        <div className="pb-4 pt-8">
          <Mdx code={doc.body.code} images={images} />
        </div>
        <hr className="my-6" />
        <DocsPagination doc={doc} />
      </div>

      {/* set toc width to 150px, show in xl */}
      <div className="hidden text-sm xl:block">
        <div className="sticky top-16 -mt-10 max-h-[calc(var(--vh)-4rem)] overflow-y-auto pt-8">
          <TableOfContentsLayout toc={toc} />
        </div>
      </div>
    </main>
  );
}
