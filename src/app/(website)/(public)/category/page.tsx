export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import { siteConfig } from "@/config/site";
import { getCategories } from "@/data/categories";
import { getPublicListings } from "@/data/listings";
import { constructMetadata } from "@/lib/metadata";
import { CategoryIndexView } from "@/components/directory/CategoryIndexView";

export const metadata = constructMetadata({
  title: "Categories - Child Actor 101 Vendor Directory",
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

  return <CategoryIndexView priority={priority} groups={groups} />;
}
