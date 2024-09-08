import { BlogCategoryInfo } from "@/types";
import Link from "next/link";

interface BlogCategoryLabelProps {
  categories: BlogCategoryInfo[];
}

export default function BlogCategoryLabel({
  categories
}: BlogCategoryLabelProps) {
  // console.log("BlogCategoryLabelProps, categories", categories);

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
