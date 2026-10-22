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
    <section id="categories" className="surface-canvas py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Browse</p>
            <h2 className="heading-display mt-3 text-3xl text-ink md:text-4xl">
              Find the service you need
            </h2>
          </div>
          <Link
            href="/category"
            className="text-sm font-semibold !text-brass-dark underline underline-offset-4"
          >
            All 13 categories →
          </Link>
        </div>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/category/${category.slug}`}
                className="group flex h-full min-h-[7rem] flex-col justify-between rounded-2xl border border-canvas-line bg-white p-5 !text-ink shadow-[0_1px_2px_rgba(18,22,29,0.04)] transition hover:-translate-y-0.5 hover:border-brass-dark hover:shadow-[0_14px_28px_-16px_rgba(18,22,29,0.3)] focus-ring"
              >
                <span className="heading-display text-xl">{category.name}</span>
                <span className="mt-4 flex items-center justify-between text-sm !text-ink-soft">
                  <span>{categoryCounts[category.slug] ?? 0} listings</span>
                  <span
                    aria-hidden="true"
                    className="text-lg !text-brass-dark transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
