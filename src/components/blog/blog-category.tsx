import Link from "next/link";

interface Category {
  slug: {
    current: string;
  };
  color: string;
  name: string;
}

interface CategoryLabelProps {
  categories: Category[];
}

export default function CategoryLabel({
  categories
}: CategoryLabelProps) {
  console.log("categories", categories);

  return (
    <div className="flex gap-3">
      {categories?.length &&
        categories.slice(0).map((category, index) => (
          <Link key={index}
            href={`/blog?category=${category.slug.current}`}>
            <span className="text-md font-medium"
              style={{ color: category.color }}>
              {category.name}
            </span>
          </Link>
        ))}
    </div>
  );
}
