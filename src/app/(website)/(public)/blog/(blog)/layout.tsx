import { BlogCategoryFilter } from "@/components/blog/blog-category-filter";
import Container from "@/components/shared/container";
import { HeaderSection } from "@/components/shared/header-section";

export default async function BlogListLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <div className="mt-8">
        <div className="w-full flex flex-col items-center justify-center gap-8">
          <HeaderSection
            label="Blog"
            title="Explore our blog posts"
          />

          <BlogCategoryFilter />
        </div>
      </div>

      <Container className="mt-8 pb-16">
        {children}
      </Container>
    </section>
  );
}
