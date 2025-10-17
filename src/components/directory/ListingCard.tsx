import { urlForImage, urlForIcon } from "@/lib/image";
import type { ItemInfo } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default function ListingCard({ item }: { item: ItemInfo }) {
  const imageProps = item?.image
    ? urlForImage(item.image)
    : item?.icon
      ? urlForIcon(item.icon)
      : null;
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
      <div className="aspect-[16/9] bg-[#EDE6C8] relative">
        {imageProps && (
          <Image
            src={imageProps.src}
            alt={item.image.alt || item.name}
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[color:var(--mustard)]/20 text-[color:var(--cream-ink)] text-xs font-semibold px-2 py-1">
            {planLabel}
          </span>
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
