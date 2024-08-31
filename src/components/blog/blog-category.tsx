import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function CategoryLabel({
  categories
}) {
  return (
    <div className="flex gap-3">
      {categories?.length &&
        categories.slice(0).map((category, index) => (
          <Link
            href={`/blog/category/${category.slug.current}`}
            key={index}>
            <Label color={category.color}>
              {category.title}
            </Label>
          </Link>
        ))}
    </div>
  );
}
