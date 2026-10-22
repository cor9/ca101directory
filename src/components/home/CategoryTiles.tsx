import { getPublicListings } from "@/data/listings";
import { countByPrimary, getPrimaryBySlug } from "@/lib/category-taxonomy";
import Link from "next/link";

// Homepage featured categories (primary taxonomy slugs, parent-facing order)
const HOME_CATEGORIES = [
  { slug: "acting-training", color: "#2DD4BF", opacity: 20 },
  { slug: "headshot-photographers", color: "#FACC15", opacity: 18 },
  { slug: "self-tape-services", color: "#84CC16", opacity: 20 },
  { slug: "demo-reels-editing", color: "#D946EF", opacity: 20 },
  { slug: "career-coaching-consulting", color: "#3B82F6", opacity: 22 },
  { slug: "actor-marketing-services", color: "#FB923C", opacity: 18 },
  { slug: "talent-agents", color: "#6366F1", opacity: 22 },
  { slug: "talent-managers", color: "#EF4444", opacity: 18 },
] as const;

export default async function CategoryTiles() {
  let categoryCounts: Record<string, number> = {};
  try {
    categoryCounts = countByPrimary(await getPublicListings());
  } catch (error) {
    console.error("Error fetching category counts:", error);
  }

  const categories = HOME_CATEGORIES.flatMap((h) => {
    const primary = getPrimaryBySlug(h.slug);
    return primary ? [{ ...h, name: primary.name }] : [];
  });

  return (
    <section id="categories" className="bg-bg-dark py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="category-tile"
              style={
                {
                  "--accent": category.color,
                  "--accent-opacity": category.opacity,
                } as React.CSSProperties
              }
            >
              <div className="category-title">{category.name}</div>
              <div className="category-count">
                {categoryCounts[category.slug] ?? 0} listings
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
