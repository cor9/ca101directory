import { cn } from "@/lib/utils";
import Link from "next/link";

interface ResultsPaginationProps {
  basePath: string;
  currentPage: number;
  totalPages: number;
  /** Current URL params; every active filter is carried onto each page link. */
  searchParams?: Record<string, string | string[] | undefined>;
  /** Fragment appended to each link so the user lands on the results. */
  anchor?: string;
}

function pageWindow(current: number, total: number): Array<number | "…"> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set<number>([1, total, current - 1, current, current + 1]);
  const sorted = Array.from(pages)
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const out: Array<number | "…"> = [];
  for (const p of sorted) {
    const prev = out[out.length - 1];
    if (typeof prev === "number" && p - prev > 1) out.push("…");
    out.push(p);
  }
  return out;
}

export default function ResultsPagination({
  basePath,
  currentPage,
  totalPages,
  searchParams = {},
  anchor = "search-results",
}: ResultsPaginationProps) {
  if (totalPages <= 1) return null;

  const hrefFor = (page: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (key === "page" || value === undefined) continue;
      params.set(key, Array.isArray(value) ? value.join(",") : value);
    }
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return `${basePath}${qs ? `?${qs}` : ""}#${anchor}`;
  };

  const base =
    "inline-flex h-10 min-w-10 items-center justify-center rounded-md border px-3 text-sm font-semibold transition-colors";
  const idle =
    "border-white/20 bg-white/5 text-white hover:border-[#E4572E] hover:text-[#E4572E]";

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      {currentPage > 1 && (
        <Link
          href={hrefFor(currentPage - 1)}
          className={cn(base, idle)}
          rel="prev"
        >
          ← Prev
        </Link>
      )}
      {pageWindow(currentPage, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-white/50">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={hrefFor(p)}
            aria-current={p === currentPage ? "page" : undefined}
            className={cn(
              base,
              p === currentPage
                ? "border-[#E4572E] bg-[#E4572E] text-white"
                : idle,
            )}
          >
            {p}
          </Link>
        ),
      )}
      {currentPage < totalPages && (
        <Link
          href={hrefFor(currentPage + 1)}
          className={cn(base, idle)}
          rel="next"
        >
          Next →
        </Link>
      )}
    </nav>
  );
}
