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
import { getCategories } from "@/data/categories";
import { getItems } from "@/data/item-service";
import { stateNames, statesList } from "@/data/regions";
import { DIRECTORY_ITEMS_PER_PAGE } from "@/lib/constants";
import { constructMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

/**
 * Generate a URL-safe slug from a category name.
 * Treats hyphens as word separators (so "Self-Tape" becomes "self-tape").
 */
function categoryNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/-/g, " ") // Treat hyphens as spaces first
    .replace(/[^a-z0-9\s]/g, "") // Remove other special characters
    .replace(/\s+/g, "-") // Then replace spaces with dashes
    .replace(/-+/g, "-") // Replace multiple dashes with single dash
    .replace(/^-|-$/g, ""); // Remove leading/trailing dashes
}

/**
 * Generate static params for all category pages
 * This tells Next.js which category pages to pre-build
 */
export async function generateStaticParams() {
  try {
    const categories = await getCategories();

    // Convert category names to slugs
    return categories.map((category) => ({
      slug: categoryNameToSlug(category.category_name),
    }));
  } catch (error) {
    console.error("generateStaticParams error:", error);
    // Return empty array if Supabase is not configured
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  try {
    const categories = await getCategories();

    const category = categories.find(
      (cat) => categoryNameToSlug(cat.category_name) === params.slug,
    );

    if (!category) {
      return constructMetadata({
        title: "Category Not Found - Child Actor 101 Vendor Directory",
        description: "The requested category could not be found",
        canonicalUrl: `${siteConfig.url}/category/${params.slug}`,
      });
    }

    // Get listing count for this category
    const { totalCount } = await getItems({
      category: category.category_name,
      currentPage: 1,
      excludeFeatured: false,
    });
    const count = totalCount;

    return constructMetadata({
      title: `${category.category_name} for Child Actors - ${count}+ Professionals | Child Actor 101`,
      description: `Compare ${count} professional ${category.category_name.toLowerCase()} specializing in child actors. Read reviews, compare services, and find the perfect match in Los Angeles, New York & nationwide.`,
      canonicalUrl: `${siteConfig.url}/category/${params.slug}`,
    });
  } catch (error) {
    console.error("generateMetadata error:", error);
    return constructMetadata({
      title: "Category - Child Actor 101 Vendor Directory",
      description: "Find acting professionals for your child",
      canonicalUrl: `${siteConfig.url}/category/${params.slug}`,
    });
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  try {
    // Get categories to validate the slug and find category name
    const categories = await getCategories();

    const category = categories.find(
      (cat) => categoryNameToSlug(cat.category_name) === params.slug,
    );

    if (!category) {
      console.log("CategoryPage: No category found for slug:", params.slug);
      return notFound();
    }

    const categoryName = category.category_name;

    // Get listings for this category using the same method as directory page
    const rawPage = searchParams?.page;
    const currentPage = Math.max(
      1,
      Number.parseInt(Array.isArray(rawPage) ? rawPage[0] : rawPage || "1", 10) || 1,
    );
    const rawState = searchParams?.state;
    const rawCity = searchParams?.city;
    const stateFilter =
      (Array.isArray(rawState) ? rawState[0] : rawState)?.trim() || undefined;
    const cityFilter =
      (Array.isArray(rawCity) ? rawCity[0] : rawCity)?.trim() || undefined;
    const { items, totalCount, itemsPerPage } = await getItems({
      category: categoryName,
      state: stateFilter && stateFilter !== "all" ? stateFilter : undefined,
      city: cityFilter,
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

    // Generate category subtext (1 line, factual)
    const getCategorySubtext = (name: string): string => {
      const lower = name.toLowerCase();
      if (lower.includes("coach") || lower.includes("class")) {
        return "Professionals experienced with young performers in TV, film, and commercial work.";
      }
      if (lower.includes("photographer")) {
        return "Professional headshot photographers specializing in child and teen actors.";
      }
      if (lower.includes("agent") || lower.includes("manager")) {
        return "Talent representation for young actors in television, film, and commercial work.";
      }
      return "Professionals experienced with young performers in TV, film, and commercial work.";
    };

    const filtersActive = Boolean(
      (stateFilter && stateFilter !== "all") || cityFilter,
    );

    return (
      <div className="flex min-h-screen flex-col bg-bg-dark">
        {/* Heading + essential filters, then straight to the results */}
        <section className="mx-auto w-full max-w-[1480px] px-5 pb-2 pt-10 sm:px-8 lg:px-12">
          <nav className="mb-3 text-sm text-slate-400">
            <Link href="/category" className="hover:text-white hover:underline">
              All categories
            </Link>
            <span className="mx-2">/</span>
            <span className="text-slate-200">{categoryName}</span>
          </nav>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
                {categoryName} for Kids &amp; Teens
              </h1>
              <p className="mt-3 text-lg text-slate-300">
                {getCategorySubtext(categoryName)}{" "}
                <span className="text-slate-400">
                  {totalCount} listed
                  {filtersActive ? " for this search" : ""}.
                </span>
              </p>
            </div>

            <form
              action={`/category/${params.slug}`}
              method="get"
              className="flex flex-wrap items-end gap-3"
            >
              <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-slate-300">
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
              <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-slate-300">
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
                className="h-11 rounded-md bg-[#C2441F] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#A93A19] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Search
              </button>
              {filtersActive && (
                <Link
                  href={`/category/${params.slug}`}
                  className="flex h-11 items-center px-2 text-sm font-semibold text-slate-200 underline hover:text-white"
                >
                  Clear
                </Link>
              )}
            </form>
          </div>
        </section>

        {/* RESULTS FIRST */}
        <section
          id="category-results"
          className="mx-auto w-full max-w-[1480px] px-5 py-8 sm:px-8 lg:px-12"
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
            basePath={`/category/${params.slug}`}
            currentPage={currentPage}
            totalPages={totalPages}
            searchParams={searchParams}
            anchor="category-results"
          />
        </section>

        <ActivityBar />

        {/* Educational / SEO content: below the results, collapsed by default
            (still in the page HTML). */}
        <section className="mx-auto w-full max-w-[1480px] px-5 py-10 sm:px-8 lg:px-12">
          <details className="group rounded-2xl border border-white/10 bg-white/[0.03]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-lg font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E4572E]">
              <span>
                Guide: why you need {categoryName.toLowerCase()} and what to look
                for
              </span>
              <span
                aria-hidden="true"
                className="text-2xl text-slate-300 transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <div className="px-6 pb-6">
              <CategoryContent
                categoryName={categoryName}
                listingCount={totalCount}
              />
              <CategoryEducationTip categorySlug={params.slug} />
            </div>
          </details>
        </section>
      </div>
    );
  } catch (error) {
    console.error("CategoryPage error:", error);
    return notFound();
  }
}
