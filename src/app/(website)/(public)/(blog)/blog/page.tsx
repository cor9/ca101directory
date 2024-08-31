import { Suspense } from "react";
import Archive from "@/components/blog/blog-archive";
import Container from "@/components/shared/container";
import Loading from "../loading";
import { HeaderSection } from "@/components/shared/header-section";

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
      <Container className="pb-16">
        {/* blog header section */}
        <HeaderSection className="mt-8"
          title="Blog"
          subtitle="See all posts we have ever written." />

        {/* TODO: add loading */}
        <Suspense fallback={<Loading />}
          key={pageIndex}>
          <Archive searchParams={searchParams} />
        </Suspense>
      </Container>
    </>
  );
}
