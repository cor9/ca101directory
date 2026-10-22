export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import Container from "@/components/container";
import ResultsPagination from "@/components/directory/ResultsPagination";
import CategoryClient from "@/components/directory/CategoryClient";
import { CategoryEducationTip } from "@/components/directory/CategoryEducationTip";
import { ActivityBar } from "@/components/home/ActivityBar";
import { CategoryContent } from "@/components/seo/category-content";
import EmptyGrid from "@/components/shared/empty-grid";
import { siteConfig } from "@/config/site";
import { getItems } from "@/data/item-service";
import { stateNames, statesList } from "@/data/regions";
import {
  PRIMARY_CATEGORIES,
  type ProfileKind,
  nameToSlug,
  resolveCategoryRef,
  resolveSpecialty,
} from "@/lib/category-taxonomy";
import { DIRECTORY_ITEMS_PER_PAGE } from "@/lib/constants";
import { categoryCopyData } from "@/data/category-copy";
import { constructMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";

/**
 * Category URLs resolve through the taxonomy compatibility layer:
 *  - a primary slug renders the page
 *  - a consolidated legacy slug permanently redirects to its parent (keeping
 *    the specialty as ?specialty= and any other params)
 *  - a retired slug still renders (noindex, not promoted) so old links work
 *  - anything else is a 404
 */
type PageProps = {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

const first = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v[0] : v)?.trim() || undefined;

export async function generateStaticParams() {
  return PRIMARY_CATEGORIES.map((c) => ({ slug: c.slug }));
}

const SUBTEXT: Record<ProfileKind, string> = {
  service:
    "Professionals experienced with young performers in TV, film, and commercial work.",
  representation:
    "Listings for research. Agencies and managers set their own submission policies, so check each company's website before reaching out.",
  background_casting:
    "Companies that cast background performers. Research each company's registration process and policies on its own website.",
  child_advocacy:
    "Professionals who support the wellbeing and rights of young performers on set.",
  set_teacher:
    "Studio teachers and on-set educators for young performers. Families can ask the production which teacher is assigned.",
};

function subtextFor(kind: ProfileKind, slug: string): string {
  if (slug === "headshot-photographers") {
    return "Professional headshot photographers specializing in child and teen actors.";
  }
  return SUBTEXT[kind];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata | undefined> {
  const ref = resolveCategoryRef(params.slug);
  if (ref.kind === "unknown") {
    return constructMetadata({
      title: "Category Not Found - Child Actor 101 Vendor Directory",
      description: "The requested category could not be found",
      canonicalUrl: `${siteConfig.url}/category/${params.slug}`,
      noIndex: true,
    });
  }
  if (ref.kind === "legacy") {
    return constructMetadata({
      title: `${ref.primary.name} - Child Actor 101 Vendor Directory`,
      canonicalUrl: `${siteConfig.url}/category/${ref.primary.slug}`,
    });
  }
  if (ref.kind === "retired") {
    return constructMetadata({
      title: `${ref.retired.name} - Child Actor 101 Vendor Directory`,
      description: `Listings previously filed under ${ref.retired.name}.`,
      canonicalUrl: `${siteConfig.url}/category/${ref.retired.slug}`,
      noIndex: true,
    });
  }
  try {
    const { totalCount } = await getItems({
      category: ref.primary.slug,
      currentPage: 1,
      excludeFeatured: false,
    });
    return constructMetadata({
      title: `${ref.primary.name} for Child Actors - ${totalCount} Listings | Child Actor 101`,
      description: `${ref.primary.blurb} Read reviews and compare ${totalCount} listings for child actors, in Los Angeles, New York & nationwide.`,
      canonicalUrl: `${siteConfig.url}/category/${ref.primary.slug}`,
    });
  } catch (error) {
    console.error("generateMetadata error:", error);
    return constructMetadata({
      title: `${ref.primary.name} - Child Actor 101 Vendor Directory`,
      description: ref.primary.blurb,
      canonicalUrl: `${siteConfig.url}/category/${ref.primary.slug}`,
    });
  }
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const ref = resolveCategoryRef(params.slug);
  if (ref.kind === "unknown") return notFound();

  if (ref.kind === "legacy") {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams ?? {})) {
      if (v === undefined || k === "page") continue;
      qs.set(k, Array.isArray(v) ? v.join(",") : v);
    }
    if (ref.specialty && !qs.has("specialty")) {
      qs.set("specialty", ref.specialty);
    }
    const query = qs.toString();
    permanentRedirect(`/category/${ref.primary.slug}${query ? `?${query}` : ""}`);
  }

  const primary = ref.kind === "primary" ? ref.primary : null;
  const categoryName = primary ? primary.name : ref.kind === "retired" ? ref.retired.name : "";
  const basePath = `/category/${primary ? primary.slug : ref.kind === "retired" ? ref.retired.slug : params.slug}`;

  try {
    const rawPage = searchParams?.page;
    const currentPage = Math.max(
      1,
      Number.parseInt(Array.isArray(rawPage) ? rawPage[0] : rawPage || "1", 10) || 1,
    );
    const stateFilter = first(searchParams?.state);
    const cityFilter = first(searchParams?.city);
    const specialtyFilter = first(searchParams?.specialty);
    const { items, totalCount, itemsPerPage, specialtyFacets } = await getItems({
      category: primary ? primary.slug : ref.kind === "retired" ? ref.retired.slug : params.slug,
      state: stateFilter && stateFilter !== "all" ? stateFilter : undefined,
      city: cityFilter,
      specialty: specialtyFilter,
      currentPage,
      itemsPerPage: DIRECTORY_ITEMS_PER_PAGE,
      excludeFeatured: false, // Show featured listings on category pages
    });

    const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

    // DEBUG: Log raw query results
    console.log(
      `[CategoryPage:${params.slug}] Total listings returned:`,
      totalCount,
    );
    console.log(`[CategoryPage:${params.slug}] Items on page 1:`, items.length);
    console.log(
      `[CategoryPage:${params.slug}] Sample data:`,
      items.slice(0, 3),
    );

    const subtext = primary
      ? subtextFor(primary.kind, primary.slug)
      : "This category is no longer part of the main directory navigation. Its listings remain available.";

    // Prewritten guide copy lives under the legacy names; use the first one that has copy.
    const copyName = primary
      ? [primary.name, ...primary.legacyNames].find((n) =>
          categoryCopyData.some(
            (c) => c.category_name?.toLowerCase() === n.toLowerCase(),
          ),
        )
      : categoryName;

    const filtersActive = Boolean(
      (stateFilter && stateFilter !== "all") || cityFilter || specialtyFilter,
    );

    // "Audition Prep" in the URL highlights the one approved chip, Audition Coaching
    const activeSpecialty =
      (primary && specialtyFilter
        ? resolveSpecialty(primary.slug, specialtyFilter)
        : null) ?? specialtyFilter;
    const chipHref = (name?: string) => {
      const qs = new URLSearchParams();
      if (stateFilter && stateFilter !== "all") qs.set("state", stateFilter);
      if (cityFilter) qs.set("city", cityFilter);
      if (name) qs.set("specialty", name);
      const q = qs.toString();
      return `${basePath}${q ? `?${q}` : ""}#category-results`;
    };
    const chipClass = (active: boolean) =>
      `rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass ${
        active
          ? "border-brass bg-brass !text-ink"
          : "border-white/25 bg-white/5 !text-white hover:border-brass"
      }`;

    return (
      <div className="flex flex-col bg-canvas-2">
        {/* Dark editorial header: heading, filters and specialty chips */}
        <header className="surface-hero">
        <div className="mx-auto w-full max-w-[1480px] px-5 pb-10 pt-10 sm:px-8 lg:px-12">
          <nav className="mb-4 text-sm !text-zinc-400">
            <Link href="/category" className="!text-zinc-300 hover:!text-white hover:underline">
              All categories
            </Link>
            <span className="mx-2">/</span>
            <span className="text-zinc-100">{categoryName}</span>
          </nav>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="eyebrow">Category</p>
              <h1 className="heading-display mt-3 text-4xl text-white md:text-5xl">
                {categoryName} for Kids &amp; Teens
              </h1>
              <p className="mt-4 text-lg !text-zinc-300">
                {subtext}{" "}
                <span className="!text-brass">
                  {totalCount} listed
                  {filtersActive ? " for this search" : ""}.
                </span>
              </p>
            </div>

            <form
              action={basePath}
              method="get"
              className="flex flex-wrap items-end gap-3"
            >
              {specialtyFilter && (
                <input type="hidden" name="specialty" value={specialtyFilter} />
              )}
              <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-zinc-200">
                State
                <select
                  name="state"
                  defaultValue={stateFilter || "all"}
                  className="mt-1 h-11 min-w-[11rem] rounded-md border border-zinc-400 bg-white px-3 text-sm font-medium normal-case text-zinc-900"
                >
                  <option value="all">All states</option>
                  {statesList.map((st) => (
                    <option key={st} value={st}>
                      {stateNames[st]} ({st})
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-zinc-200">
                City
                <input
                  name="city"
                  defaultValue={cityFilter || ""}
                  placeholder="e.g. Dallas, LA"
                  className="mt-1 h-11 w-44 rounded-md border border-zinc-400 bg-white px-3 text-sm font-medium normal-case text-zinc-900 placeholder:text-zinc-500"
                />
              </label>
              <button
                type="submit"
                className="h-11 rounded-full bg-brass px-6 text-sm font-semibold text-ink transition-colors hover:bg-[#d8b97f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Search
              </button>
              {filtersActive && (
                <Link
                  href={basePath}
                  className="flex h-11 items-center px-2 text-sm font-semibold text-slate-200 underline hover:text-white"
                >
                  Clear
                </Link>
              )}
            </form>
          </div>

          {specialtyFacets.length > 0 && (
            <div
              className="mt-6 flex flex-wrap items-center gap-2"
              aria-label="Filter by specialty"
            >
              <Link
                href={chipHref(undefined)}
                aria-current={!activeSpecialty ? "true" : undefined}
                className={chipClass(!activeSpecialty)}
              >
                All
              </Link>
              {specialtyFacets.slice(0, 14).map((f) => (
                <Link
                  key={f.name}
                  href={chipHref(f.name)}
                  aria-current={activeSpecialty === f.name ? "true" : undefined}
                  className={chipClass(activeSpecialty === f.name)}
                >
                  {f.name} <span className="opacity-70">({f.count})</span>
                </Link>
              ))}
            </div>
          )}
        </div>
        </header>

        {/* RESULTS FIRST: white cards on warm paper */}
        <div className="surface-canvas">
        <section
          id="category-results"
          className="mx-auto w-full max-w-[1480px] px-5 py-12 sm:px-8 lg:px-12"
        >
          {items?.length === 0 && <EmptyGrid />}

          {items && items.length > 0 && (
            <CategoryClient
              initialItems={items}
              initialTotalCount={totalCount}
              initialTotalPages={totalPages}
              categoryName={categoryName}
            />
          )}

          <ResultsPagination
            basePath={basePath}
            currentPage={currentPage}
            totalPages={totalPages}
            searchParams={searchParams}
            anchor="category-results"
          />
        </section>
        </div>

        <ActivityBar />

        {/* Educational / SEO content: below the results, collapsed by default
            (still in the page HTML). */}
        <div className="surface-canvas-2">
        <section className="mx-auto w-full max-w-[1480px] px-5 py-12 sm:px-8 lg:px-12">
          <details className="group rounded-2xl border border-canvas-line bg-white">
            <summary className="heading-display flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-xl text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-dark">
              <span>
                Guide: why you need {categoryName.toLowerCase()} and what to look
                for
              </span>
              <span
                aria-hidden="true"
                className="text-2xl text-brass-dark transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <div className="px-6 pb-6">
              <CategoryContent
                categoryName={categoryName}
                copyName={copyName}
                listingCount={totalCount}
              />
              <CategoryEducationTip
                categorySlug={nameToSlug(copyName ?? categoryName)}
              />
            </div>
          </details>
        </section>
        </div>
      </div>
    );
  } catch (error) {
    console.error("CategoryPage error:", error);
    return notFound();
  }
}
