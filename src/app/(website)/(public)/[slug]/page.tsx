import "@/styles/mdx.css";

import Container from "@/components/shared/container";
import { getBlurDataURL } from "@/lib/utils";
import { notFound } from "next/navigation";

// export async function generateStaticParams() {
//   return allPages.map((page) => ({
//     slug: page.slugAsParams,
//   }));
// }

// export async function generateMetadata({
//   params,
// }: {
//   params: { slug: string };
// }): Promise<Metadata | undefined> {
//   const page = allPages.find((page) => page.slugAsParams === params.slug);
//   if (!page) {
//     return;
//   }

//   const { title, description } = page;

//   return constructMetadata({
//     title: `${title}`,
//     description: description,
//   });
// }

export default async function PagePage({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  // const page = allPages.find((page) => page.slugAsParams === params.slug);

  // if (!page) {
  //   notFound();
  // }

  // const images = await Promise.all(
  //   page.images.map(async (src: string) => ({
  //     src,
  //     blurDataURL: await getBlurDataURL(src),
  //   })),
  // );

  // console.log(`PagePage, page.body.code: ${page.body.code}`);

  return (
    <Container>
      <article className="py-6 lg:py-12">
        <div className="space-y-4">
          {/* <h1 className="inline-block font-heading text-4xl lg:text-5xl">
            {page.title}
          </h1> */}
          {/* {page.description && (
            <p className="text-xl text-muted-foreground">{page.description}</p>
          )} */}
        </div>
        {/* <hr className="my-4" /> */}
        {/* <Mdx code={page.body.code} images={images} /> */}
      </article>
    </Container>
  );
}
