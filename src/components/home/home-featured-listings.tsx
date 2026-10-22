import { getCategories } from "@/data/categories";
import { getFeaturedListings } from "@/data/listings";
import {
  type CardData,
  isPhotoCategory,
  listingToCardData,
} from "@/lib/card-data";
import FeaturedListingsClient from "./featured-listings-client";

interface FeaturedListing {
  id: string;
  name: string;
  description: string;
  image: string;
  website: string;
  category: string;
  categorySlug: string;
  tags: string[];
  featured?: boolean;
  isPro?: boolean;
  isFallback?: boolean;
  slug: string;
}

// Fallback featured listings if no Airtable data
const fallbackListings: FeaturedListing[] = [
  {
    id: "1",
    name: "Young Actors Studio",
    description:
      "Professional acting classes for children and teens. Specializing in on-camera technique and audition preparation.",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop",
    website: "https://youngactorsstudio.com",
    category: "Acting Classes & Coaches",
    categorySlug: "acting-classes-coaches",
    tags: ["On-Camera", "Audition Prep", "Teens"],
    featured: true,
    isFallback: true,
    slug: "young-actors-studio",
  },
  {
    id: "2",
    name: "Spotlight Headshots",
    description:
      "Award-winning headshot photographer specializing in child and teen actors. Creating compelling portfolio images.",
    image:
      "https://images.unsplash.com/photo-1529634310410-0c3c5188c374?w=400&h=300&fit=crop",
    website: "https://spotlightheadshots.com",
    category: "Headshot Photographers",
    categorySlug: "headshot-photographers",
    tags: ["Portfolio", "Professional", "Child-Friendly"],
    isFallback: true,
    slug: "spotlight-headshots",
  },
  {
    id: "3",
    name: "Coaching with Corey",
    description:
      "Comprehensive acting coaching including private sessions, self-tape services, and career consultations.",
    image: "/coachingwithcorey.png",
    website: "https://coaching.childactor101.com",
    category: "Acting Classes & Coaches",
    categorySlug: "acting-classes-coaches",
    tags: ["Private Coaching", "Self-Tape", "Career Guidance"],
    featured: true,
    isFallback: true,
    slug: "coaching-with-corey",
  },
];

export default async function HomeFeaturedListings() {
  let cards: CardData[] = [];

  try {
    const [supabaseListings, categories] = await Promise.all([
      getFeaturedListings(),
      getCategories(),
    ]);

    // category UUID -> name, so cards never show or depend on raw UUIDs
    const categoryNames = new Map<string, string>();
    for (const category of categories) {
      categoryNames.set(category.id.toLowerCase(), category.category_name);
    }

    // Weight plans for featured ordering (ranking unchanged)
    const planWeight = (plan?: string | null) => {
      const p = (plan || "").toLowerCase();
      if (p.includes("premium")) return 4;
      if (p.includes("pro")) return 3;
      if (p.includes("standard")) return 2;
      return 1;
    };

    // Include explicitly featured OR PRO/comped listings
    const isPro = (l: (typeof supabaseListings)[0]) => {
      if (l.comped) return true;
      const p = (l.plan || "").toLowerCase();
      return p.includes("pro") || p.includes("premium");
    };

    cards = supabaseListings
      .filter((l) => l.featured === true || isPro(l))
      // Sort: explicit featured first, then priority, then plan weight, then name
      .sort((a, b) => {
        const fa = a.featured === true ? 1 : 0;
        const fb = b.featured === true ? 1 : 0;
        if (fb !== fa) return fb - fa;
        const pa = (a.priority ?? 0) as number;
        const pb = (b.priority ?? 0) as number;
        if (pb !== pa) return pb - pa;
        const wa = planWeight(a.plan);
        const wb = planWeight(b.plan);
        if (wb !== wa) return wb - wa;
        return (a.listing_name || "").localeCompare(b.listing_name || "");
      })
      .slice(0, 12) // Show up to 12 items to reduce accidental trimming
      .map((listing) => listingToCardData(listing, categoryNames));
  } catch (error) {
    console.error("Error fetching featured listings:", error);
  }

  // Use fallback if no Supabase listings
  if (cards.length === 0) {
    cards = fallbackListings.map((l) => ({
      id: l.id,
      name: l.name,
      href: l.website,
      external: true,
      category: l.category,
      location: "",
      online: false,
      imageUrl: l.image,
      imageIsLogo: false,
      photoLed: isPhotoCategory(l.category),
      pills: l.tags.slice(0, 2),
      featured: Boolean(l.featured),
      pro: false,
      approved101: false,
    }));
  }
  return <FeaturedListingsClient listings={cards} />;
}
