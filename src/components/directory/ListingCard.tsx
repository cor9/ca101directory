import { getCategoryIconUrl, getListingImageUrl } from "@/lib/image-urls";
import type { ItemInfo } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default function ListingCard({
  item,
  categoryIconMap,
  allCategories = [],
}: {
  item: ItemInfo;
  categoryIconMap?: Record<string, string>;
  allCategories?: string[];
}) {
  const iconAny = (item as unknown as { icon?: unknown }).icon;
  const profileRef =
    (iconAny &&
      typeof iconAny === "object" &&
      (iconAny as { asset?: { _ref?: string } }).asset?._ref) ||
    (typeof iconAny === "string" ? (iconAny as string) : null);
  const profileUrl = profileRef ? getListingImageUrl(profileRef) : null;
  // Normalize category to full name (avoid splitting words like "Acting Classes & Coaches")
  const rawFirst = item.categories?.[0]?.name || "";
  // Map by startsWith to avoid partial tokens like "Acting"
  const primaryCategory =
    allCategories.find((full) =>
      full.toLowerCase().startsWith(rawFirst.toLowerCase()),
    ) || rawFirst;
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
  const fallbackIcon = fileFromProps
    ? getCategoryIconUrl(
        (fileFromProps.includes("/")
          ? fileFromProps.split("/").pop()
          : fileFromProps) || "",
      )
    : fileFromLocal || "/categories/clapperboard.png";
  const approved = Array.isArray(item.tags)
    ? item.tags.some(
        (t) =>
          (t?.name && String(t.name).toLowerCase().includes("101")) ||
          (t?.slug?.current &&
            String(t.slug.current).toLowerCase().includes("101")) ||
          (t?.name && String(t.name).toLowerCase().includes("approved")),
      )
    : false;
  const isUuidLike = (value: string | undefined): boolean => {
    if (!value) return false;
    return /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.test(
      value.trim(),
    );
  };
  return (
    <article className="bauhaus-card overflow-hidden p-0">
      <div className="aspect-[16/9] bg-[#EDE6C8] relative overflow-hidden">
        {profileUrl ? (
          <Image
            src={profileUrl}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : fallbackIcon ? (
          <Image
            src={fallbackIcon}
            alt={primaryCategory || item.name}
            fill
            className="object-contain p-6"
          />
        ) : null}
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          {approved && (
            <span className="bauhaus-chip bauhaus-chip-mustard text-xs font-semibold">
              101 APPROVED
            </span>
          )}
        </div>

        <h3 className="bauhaus-heading text-lg md:text-xl line-clamp-2">
          {item.name}
        </h3>

        {item.description && (
          <p className="bauhaus-body text-sm opacity-85 line-clamp-2">{item.description}</p>
        )}

        {item.categories && item.categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.categories
              .filter((c) => c?.name && !isUuidLike(c.name))
              .slice(0, 3)
              .map((c) => {
                const name = c.name || "";
                const full =
                  allCategories.find((candidate) =>
                    candidate.toLowerCase().startsWith(name.toLowerCase()),
                  ) || name;
                return (
                  <span
                    key={c._id}
                    className="bauhaus-chip text-xs"
                  >
                    {full.toUpperCase()}
                  </span>
                );
              })}
          </div>
        )}

        <div className="pt-2 flex items-center gap-3">
          <Link
            href={`/listing/${item._id}`}
            className="bauhaus-btn-primary text-sm"
          >
            VIEW LISTING →
          </Link>
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="bauhaus-btn-secondary text-sm"
            >
              WEBSITE
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
