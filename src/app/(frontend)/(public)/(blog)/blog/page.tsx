import { Suspense } from "react";
import Archive from "@/components/blog/blog-archive";
import Container from "@/components/shared/container";
import Loading from "../loading";

export default async function ArchivePage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { page } = searchParams as { [key: string]: string };
  const pageIndex = parseInt(page, 10) || 1;
  console.log("ArchivePage, page", pageIndex);

  return (
    <>
      <Container className="relative pb-16">
        <h1 className="mt-4 text-center text-3xl font-semibold tracking-tight lg:text-4xl lg:leading-snug">
          Blog
        </h1>
        <div className="text-center">
          <p className="mt-2 text-lg">
            See all posts we have ever written.
          </p>
        </div>

        {/* TODO: add loading */}
        <Suspense fallback={<Loading />}
          key={pageIndex}>
          <Archive searchParams={searchParams} />
        </Suspense>
      </Container>
    </>
  );
}
