import { BlogCategoryFilter } from "@/components/blog/blog-category-filter";

export default async function BlogListLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* blog category filter */}
      <BlogCategoryFilter />

      <div>
        {children}
      </div>
    </>
  );
}
