import { BlogCategoryInfo } from "@/types";

interface BlogCategoryListProps {
  categories: BlogCategoryInfo[];
}

export default function BlogCategoryList({
  categories
}: BlogCategoryListProps) {
  console.log("BlogCategoryList, categories", categories);

  return (
    <div className="flex gap-4">
      {categories?.length &&
        categories.slice(0).map((category, index) => (
          // href={`/blog?category=${category.slug.current}`}
          <div key={index}>
            <span className="text-md font-medium uppercase transition-colors duration-200 ease-in-out"
              style={{ color: category.color }}>
              {category.name}
            </span>
          </div>
        ))}
    </div>
  );
}
