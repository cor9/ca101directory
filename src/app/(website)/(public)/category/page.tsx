export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import { siteConfig } from "@/config/site";
import { getCategories } from "@/data/categories";
import { getPublicListings } from "@/data/listings";
import { constructMetadata } from "@/lib/metadata";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "Categories - Child Actor 101 Directory",
  description:
    "Browse acting professionals by category to find the perfect match for your child's needs",
  canonicalUrl: `${siteConfig.url}/category`,
});

// Priority categories shown first, as large cards.
const PRIORITY_CATEGORIES = [
  {
    name: "Headshot Photographers",
    slug: "headshot-photographers",
    blurb: "Portfolio-led photographers who specialize in kids and teens.",
  },
  {
    name: "Acting Classes & Coaches",
    slug: "acting-classes-coaches",
    blurb: "Classes, private coaching and training for young actors.",
  },
  {
    name: "Talent Agents",
    slug: "talent-agents",
    blurb: "Agencies that represent young talent for TV, film and commercials.",
  },
  {
    name: "Talent Managers",
    slug: "talent-managers",
    blurb: "Managers who guide a young actor's career.",
  },
] as const;

/**
 * Browsing groups. Purely presentational: matched by category-name keywords so
 * no records, slugs or taxonomy rows change. Anything unmatched falls into
 * "More Specialties" so every category stays reachable.
 */
const CATEGORY_GROUPS: Array<{ title: string; match: RegExp }> = [
  {
    title: "Photo & Video",
    match: /photograph|video|reel|self.?tape|portfolio|content creator/i,
  },
  {
    title: "Training & Coaching",
    match:
      /class|coach|audition|improv|comedy|vocal|dialect|voice|theat|dance|stunt|workshop|teacher|school|acting|singing|music/i,
  },
  {
    title: "Representation & Casting",
    match: /agent|manager|casting|publicist|lawyer|attorney|legal/i,
  },
  {
    title: "Career & Business",
    match: /career|business|website|social media|branding|financial|consult/i,
  },
  {
    title: "Wellness, Style & On-Set Support",
    match:
      /mental|therapy|speech|set sitter|advocacy|hair|makeup|stylist|wardrobe|dent|health|tutor/i,
  },
];

export default async function CategoryPage() {
  // Get real categories from Supabase
  let categories: Array<{
    name: string;
    slug: string;
    description: string;
    count: number;
  }> = [];

  try {
    const [supabaseCategories, listings] = await Promise.all([
      getCategories(),
      getPublicListings(),
    ]);

    console.log("CategoryPage Debug:", {
      supabaseCategoriesCount: supabaseCategories?.length || 0,
      listingsCount: listings?.length || 0,
      supabaseCategories: supabaseCategories,
      sampleListing: listings?.[0],
    });

    const normalize = (v: string) =>
      v.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    // Synonyms map to unify variant names under canonical category keys
    const synonyms: Record<string, string> = {
      // Headshots
      [normalize("Headshot Photographers")]: normalize(
        "Headshot Photographers",
      ),
      [normalize("Headshot Photographer")]: normalize("Headshot Photographers"),
      // Self Tape
      [normalize("Self Tape Support")]: normalize("Self Tape Support"),
      [normalize("Self-Tape Support")]: normalize("Self Tape Support"),
      // Demo Reel
      [normalize("Demo Reel Editors")]: normalize("Demo Reel Editors"),
      [normalize("Reel Editors")]: normalize("Demo Reel Editors"),
    };

    // Map category IDs to names for UUID-based listings
    const idToName: Record<string, string> = {};
    for (const c of supabaseCategories || []) {
      if (c?.id && c?.category_name) idToName[c.id] = c.category_name;
    }

    // Count listings per normalized canonical category (resolve UUIDs)
    const categoryCounts: Record<string, number> = {};
    const isUuidLike = (v: string) =>
      /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.test(
        v.trim(),
      );
    for (const listing of listings) {
      const cats = listing.categories || [];
      for (const cat of cats) {
        if (!cat) continue;
        const resolvedName = isUuidLike(cat) ? idToName[cat] : cat;
        if (!resolvedName) continue;
        const keyNorm = normalize(resolvedName);
        const canonical = synonyms[keyNorm] || keyNorm;
        categoryCounts[canonical] = (categoryCounts[canonical] || 0) + 1;
      }
    }

    console.log("Category counts (normalized):", categoryCounts);

    // For accuracy, compute counts using the same filter as the category detail page
    const countsAccurate = await Promise.all(
      supabaseCategories.map(async (category) => {
        try {
          const result = await getPublicListings({
            category: category.category_name,
          });
          return { name: category.category_name, count: result.length };
        } catch {
          const key = normalize(category.category_name);
          return {
            name: category.category_name,
            count: categoryCounts[key] || 0,
          };
        }
      }),
    );
    const accurateByName: Record<string, number> = {};
    for (const { name, count } of countsAccurate) accurateByName[name] = count;

    categories = supabaseCategories.map((category) => ({
      name: category.category_name,
      slug: category.category_name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, ""),
      description:
        category.description ||
        (() => {
          const customDescriptions: Record<string, string> = {
            "Acting Classes & Coaches": "Acting coaching services",
            "Comedy Coaches": "Comedy coaching services",
            "Vocal Coaches": "Vocal coaching services",
            "Hair/Makeup Artists": "Hair and makeup services",
            "Modeling/Print Agents":
              "Modeling and print representation services",
            "Talent Agents": "Talent representation services",
            "Influencer Agents": "Influencer representation services",
            "Talent Managers": "Talent management services",
          };
          return (
            customDescriptions[category.category_name] ||
            `${category.category_name} services`
          );
        })(),
      count:
        accurateByName[category.category_name] ??
        (() => {
          const key = normalize(category.category_name);
          return categoryCounts[key] || 0;
        })(),
    }));

    console.log("Final categories:", categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  // Helper to generate slug from category name (matches the logic used in categories)
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const prioritySlugs = new Set<string>(PRIORITY_CATEGORIES.map((c) => c.slug));
  const bySlug = new Map(
    categories.map((c) => [c.slug || generateSlug(c.name), c]),
  );
  const priority = PRIORITY_CATEGORIES.map((p) => ({
    ...p,
    count: bySlug.get(p.slug)?.count ?? 0,
  }));

  // Everything else, grouped. Every category lands in exactly one group.
  const rest = categories.filter(
    (c) => !prioritySlugs.has(c.slug || generateSlug(c.name)),
  );
  const grouped: Array<{ title: string; items: typeof rest }> = [
    ...CATEGORY_GROUPS.map((g) => ({ title: g.title, items: [] as typeof rest })),
    { title: "More Specialties", items: [] as typeof rest },
  ];
  for (const c of rest) {
    const idx = CATEGORY_GROUPS.findIndex((g) => g.match.test(c.name));
    grouped[idx === -1 ? grouped.length - 1 : idx].items.push(c);
  }
  const groups = grouped.filter((g) => g.items.length > 0);

  return (
    <div className="min-h-screen bg-bg-dark">
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-10 text-center">
          <h1 className="mb-4 text-4xl font-semibold text-white">
            Browse by Category
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-slate-300">
            Find trusted professionals for young performers, organized by what
            you need.
          </p>
        </div>

        {/* Priority categories */}
        <div className="mb-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {priority.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group flex flex-col rounded-xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-0.5 hover:border-[#E4572E] hover:bg-white/[0.07]"
            >
              <h2 className="text-xl font-bold text-white">{category.name}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-300">
                {category.blurb}
              </p>
              <p className="mt-4 text-sm font-semibold text-[#F28A63] group-hover:text-white">
                {category.count > 0
                  ? `${category.count} providers →`
                  : "Browse →"}
              </p>
            </Link>
          ))}
        </div>

        {/* Everything else, grouped */}
        <div className="space-y-10">
          {groups.map((group) => (
            <div key={group.title}>
              <h2 className="mb-4 border-b border-white/10 pb-2 text-lg font-semibold text-white">
                {group.title}
              </h2>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.items.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/category/${category.slug}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-slate-100 transition hover:border-[#E4572E] hover:text-white"
                    >
                      <span>{category.name}</span>
                      {category.count > 0 && (
                        <span className="shrink-0 text-xs text-slate-400">
                          {category.count}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-xl border border-white/10 bg-white/[0.04] p-8 text-center">
          <h2 className="mb-3 text-2xl font-semibold text-white">
            Don’t see what you need?
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-slate-300">
            Search every professional in the directory, or suggest a vendor we
            should add.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/directory"
              className="inline-flex items-center justify-center rounded-md bg-[#E4572E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#CC4E2A]"
            >
              Search the Directory
            </Link>
            <Link
              href="/suggest-vendor"
              className="inline-flex items-center justify-center rounded-md border border-white/25 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Suggest a Vendor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
