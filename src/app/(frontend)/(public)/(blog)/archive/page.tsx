import { Suspense } from "react";
// import Container from "@/components/container";
import Archive from "./archive";
// import Loading from "@/components/loading";
import MaxWidthContainer from "@/components/shared/max-width-container";

export default async function ArchivePage({ searchParams }) {
  return (
    <>
      <MaxWidthContainer className="relative pb-16">
        <h1 className="text-center text-3xl font-semibold tracking-tight dark:text-white lg:text-4xl lg:leading-snug">
          Archive
        </h1>
        <div className="text-center">
          <p className="mt-2 text-lg">
            See all posts we have ever written.
          </p>
        </div>
        <Suspense
          key={searchParams.page || "1"}
          fallback={null}>
          <Archive searchParams={searchParams} />
        </Suspense>
      </MaxWidthContainer>
    </>
  );
}

// export const revalidate = 60;
