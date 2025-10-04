import { getCategoryIconUrl, getListingImageUrl } from "@/lib/image-urls";
import type { ItemInfo } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default function ListingCard({ item, categoryIconMap }: { item: ItemInfo; categoryIconMap?: Record<string, string> }) {
  const iconAny = (item as unknown as { icon?: unknown }).icon;
  const profileRef =
    (iconAny && typeof iconAny === "object" && (iconAny as { asset?: { _ref?: string } }).asset?.
      _ref) || (typeof iconAny === "string" ? (iconAny as string) : null);
  const profileUrl = profileRef ? getListingImageUrl(profileRef) : null;
  const primaryCategory = item.categories?.[0]?.name || "";
  const localMap: Record<string, string> = {
    "Acting Classes & Coaches": "/categories/masks.png",
    "Headshot Photographers": "/categories/camera.png",
    "Self-Tape Studios": "/categories/selftape.png",
    "Demo Reel Creators": "/categories/reelcreator.png",
    "Vocal Coaches": "/categories/singer.png",
    "Talent Managers": "/categories/rep.png",
    "Casting Workshops": "/categories/handwriting.png",
    "Reels Editors": "/categories/reel_editor.png",
    "Social Media Consultants": "/categories/socialmedia.png",
    "Acting Camps": "/categories/theatre.png",
    "Acting Schools": "/categories/masks.png",
    "Audition Prep": "/categories/audprep.png",
    "Voiceover Studios": "/categories/mic.png",
    "Theatre Training": "/categories/kidstheatre.png",
    "Entertainment Lawyers": "/categories/legalfile.png",
    "Financial Advisors": "/categories/moneybag.png",
    Publicists: "/categories/publicist.png",
    "Hair/Makeup Artists": "/categories/makeup.png",
    "Wardrobe Stylists": "/categories/wardrobe.png",
    "Branding Coaches": "/categories/colowheel.png",
    "Mental Health for Performers": "/categories/mentalhealth.png",
    "On-Set Tutors": "/categories/tutor.png",
    "Reel Creator": "/categories/reelcreator.png",
    Feedback: "/categories/play1.png",
    "Career Consultation": "/categories/consult.png",
    "Dance Classes": "/categories/danceclass.png",
    Reel: "/categories/filmreel.png",
    "Scene Writing": "/categories/script.png",
  };
  const fileFromProps = categoryIconMap?.[primaryCategory];
  const fileFromLocal = localMap[primaryCategory];
  const picked = fileFromProps || fileFromLocal;
  const fallbackIcon = picked
    ? getCategoryIconUrl((picked.includes("/") ? picked.split("/").pop() : picked) || "")
    : undefined;
  const planLabel =
    item.pricePlan ||
    (item.proPlanStatus
      ? "Pro"
      : item.freePlanStatus
        ? "Free"
        : item.paid
          ? "Pro"
          : "Free");
  const approved = Array.isArray(item.tags)
    ? item.tags.some(
        (t) =>
          (t?.name && String(t.name).toLowerCase().includes("101")) ||
          (t?.slug?.current &&
            String(t.slug.current).toLowerCase().includes("101")) ||
          (t?.name && String(t.name).toLowerCase().includes("approved")),
      )
    : false;
  return (
    <article className="bg-[color:var(--cream)] text-[color:var(--cream-ink)] rounded-2xl border border-[color:var(--card-border)] shadow-[var(--shadow-cream)] overflow-hidden transition-transform hover:-translate-y-0.5 hover:shadow-[var(--shadow-cream-lg)]">
      <div className="aspect-[16/9] bg-[#EDE6C8] relative overflow-hidden z-[10]">
        {profileUrl ? (
          <Image src={profileUrl} alt={item.name} fill className="object-cover" />
        ) : fallbackIcon ? (
          <Image
            src={fallbackIcon}
            alt={primaryCategory || item.name}
            fill
            className="object-contain p-6"
          />
        ) : null}
      </div>

      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          {approved && (
            <span className="rounded-full bg-[color:var(--success)]/18 text-[color:var(--success)] text-xs font-semibold px-2 py-1">
              101 Approved
            </span>
          )}
        </div>

        <h3 className="text-lg md:text-xl font-bold line-clamp-2">
          {item.name}
        </h3>

        {item.description && (
          <p className="text-sm opacity-85 line-clamp-2">{item.description}</p>
        )}

        {/* Optional meta row can be added when structured location fields exist */}

        {item.categories && item.categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.categories.slice(0, 3).map((c) => (
              <span
                key={c._id}
                className="rounded-full bg-[color:var(--chip-bg)] border border-[color:var(--card-border)] px-2 py-1 text-xs"
              >
                {c.name}
              </span>
            ))}
          </div>
        )}

        <div className="pt-2 flex items-center gap-3">
          <Link
            href={`/listing/${item._id}`}
            className="rounded-full bg-[color:var(--orange)] text-white px-4 py-2 text-sm hover:bg-[#e25403]"
          >
            View Listing →
          </Link>
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-[color:var(--card-border)] px-3 py-2 text-sm hover:text-[color:var(--orange)]"
            >
              Website
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
