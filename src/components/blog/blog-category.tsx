import { BlogCategoryInfo } from "@/types";
import Link from "next/link";

interface BlogCategoryListProps {
  categories: BlogCategoryInfo[];
}

export default function BlogCategoryList({
  categories
}: BlogCategoryListProps) {
  // console.log("BlogCategoryList, categories", categories);

  return (
    <div className="flex gap-4">
      {categories?.length &&
        categories.slice(0).map((category, index) => (
          <Link key={index} href={`/blog?category=${category.slug.current}`}>
            <span className="text-sm font-medium uppercase"
              style={{ color: category.color }}>
              {category.name}
            </span>
          </Link>
        ))}
    </div>
  );
}
