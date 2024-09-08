import { BlogCategoryFilter } from "@/components/blog/blog-category-filter";
import Container from "@/components/shared/container";

export default async function BlogListLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <HeaderSection className="mt-8"
        title="Blog"
        subtitle={""} /> */}

      {/* blog category filter */}
      <BlogCategoryFilter />

      <div>
        {children}
      </div>
    </>
  );
}
