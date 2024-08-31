import { Suspense } from "react";
import Archive from "@/components/blog/blog-archive";
import MaxWidthContainer from "@/components/shared/max-width-container";

export default async function ArchivePage({ searchParams }) {
  return (
    <>
      <MaxWidthContainer className="relative pb-16">
        <h1 className="mt-4 text-center text-3xl font-semibold tracking-tight dark:text-white lg:text-4xl lg:leading-snug">
          Blog
        </h1>
        <div className="text-center">
          <p className="mt-2 text-lg">
            See all posts we have ever written.
          </p>
        </div>

        {/* TODO: add loading */}
        <Suspense fallback={null}
          key={searchParams.page || "1"}>
          <Archive searchParams={searchParams} />
        </Suspense>
      </MaxWidthContainer>
    </>
  );
}
