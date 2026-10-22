import { getFeaturedListings } from "@/data/listings";
import { parseGalleryItems } from "@/lib/gallery";
import { getListingImageUrl } from "@/lib/image-urls";
import { primaryCategoryOf } from "@/lib/category-taxonomy";
import Image from "next/image";
import Link from "next/link";

type Tile = { id: string; name: string; category: string; href: string; src: string };

const GRAPHIC = /logo|icon|badge|banner|flyer|poster/i;

/**
 * Real portfolio photography from featured professionals only: the first
 * gallery image, else a profile photo that is not a logo/graphic. Nothing is
 * invented; with fewer than three photos the hero is simply text.
 */
async function heroTiles(): Promise<Tile[]> {
  try {
    const featured = await getFeaturedListings();
    const tiles: Tile[] = [];
    for (const l of featured) {
      if (tiles.length >= 4) break;
      const gallery = parseGalleryItems(l.gallery)[0]?.url;
      const profile =
        l.profile_image && !GRAPHIC.test(l.profile_image)
          ? getListingImageUrl(l.profile_image)
          : null;
      const src = gallery || profile;
      if (!src || !l.slug) continue;
      tiles.push({
        id: l.id,
        name: l.listing_name || "Listing",
        category: primaryCategoryOf(l)?.name || "",
        href: `/listing/${l.slug.trim()}`,
        src,
      });
    }
    return tiles.length >= 3 ? tiles : [];
  } catch {
    return [];
  }
}

export default async function HomeHero() {
  const tiles = await heroTiles();
  return (
    <section className="surface-hero">
      <div
        className={`mx-auto grid max-w-7xl items-center gap-12 px-6 pb-16 pt-14 lg:pb-20 lg:pt-20 ${
          tiles.length ? "lg:grid-cols-[1.05fr_1fr]" : ""
        }`}
      >
        <div>
          <p className="eyebrow">The Child Actor 101 Vendor Directory</p>
          <h1 className="heading-display mt-5 text-4xl text-white sm:text-5xl lg:text-6xl">
            Find the right professionals for your young performer.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed !text-zinc-300">
            Headshot photographers, acting coaches, agents, set teachers and
            more, curated by working industry professionals, not advertisers.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link href="/directory" className="btn-brass focus-ring">
              Browse the Directory
            </Link>
            <Link
              href="/suggest-vendor"
              className="font-medium !text-white underline decoration-brass underline-offset-[6px] hover:decoration-white"
            >
              Suggest a vendor
            </Link>
          </div>
        </div>

        {tiles.length > 0 && (
          <ul
            aria-label="Featured professionals"
            className="grid grid-cols-2 gap-3 sm:gap-4"
          >
            {tiles.map((t, i) => (
              <li key={t.id} className={i % 2 === 1 ? "mt-6 sm:mt-10" : ""}>
                <Link
                  href={t.href}
                  className="group relative block overflow-hidden rounded-2xl bg-navy-2 ring-1 ring-white/10 focus-ring"
                >
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={t.src}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 22vw, 45vw"
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    {t.category && (
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] !text-brass">
                        {t.category}
                      </p>
                    )}
                    <p className="mt-0.5 text-base font-semibold leading-snug !text-white">
                      {t.name}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
