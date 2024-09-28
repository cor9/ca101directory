import { BlogCategoryFilter } from "@/components/blog/blog-category-filter";
import Container from "@/components/shared/container";
import { HeaderSection } from "@/components/shared/header-section";

export default async function BlogListLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* blog category filter */}
      <div className="mt-8">
        <section className="w-full flex flex-col gap-8 justify-center">
          <HeaderSection
            label="Blog"
            title="Explore our blog posts"
          />

          <div className="flex items-center justify-center">
            <BlogCategoryFilter />
          </div>
        </section>
      </div>

      <Container className="mt-8 pb-16">
        {children}
      </Container>
    </>
  );
}
