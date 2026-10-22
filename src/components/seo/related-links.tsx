import Link from "next/link";

interface RelatedLinksProps {
  categoryNames?: string[];
}

/** Same slug rule as /category/[slug] so every link resolves. */
function categoryNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const pill =
  "inline-flex items-center rounded-full border border-white/25 px-4 py-2 text-sm font-medium !text-zinc-100 transition-colors hover:border-white hover:bg-white hover:!text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1117]";

/**
 * Closing section of a vendor profile: neutral related-category pills (internal
 * links for SEO) and one secondary "browse" action.
 */
export function RelatedLinks({ categoryNames = [] }: RelatedLinksProps) {
  const seen = new Set<string>();
  const categories = categoryNames
    .map((c) => c.trim())
    .filter((c) => {
      const slug = categoryNameToSlug(c);
      if (!slug || seen.has(slug)) return false;
      seen.add(slug);
      return true;
    });

  return (
    <nav
      aria-label="Related categories and browsing"
      className="mt-12 rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {categories.length > 1 && (
          <div className="min-w-0">
            <h2 className="mb-3 text-lg font-semibold text-white">
              Related categories
            </h2>
            <ul className="flex flex-wrap gap-2">
              {categories.map((name) => (
                <li key={name}>
                  <Link
                    href={`/category/${categoryNameToSlug(name)}`}
                    className={pill}
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link
          href="/directory"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-white/40 px-5 py-3 text-sm font-semibold !text-white transition-colors hover:bg-white hover:!text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1117] md:ml-auto"
        >
          Browse All Professionals
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </nav>
  );
}
