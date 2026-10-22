import { Camera, Drama, Handshake, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

export type CategoryTile = { name: string; slug: string; count: number };
export type PriorityTile = CategoryTile & { blurb: string };
export type CategoryGroup = { title: string; items: CategoryTile[] };

const PRIORITY_ICONS: Record<string, LucideIcon> = {
  "headshot-photographers": Camera,
  "acting-classes-coaches": Drama,
  "talent-agents": Handshake,
  "talent-managers": Users,
};

/** Presentational markup for /category (data is assembled by the page). */
export function CategoryIndexView({
  priority,
  groups,
}: {
  priority: PriorityTile[];
  groups: CategoryGroup[];
}) {
  return (
    <div className="min-h-screen bg-bg-dark">
      <section className="mx-auto w-full max-w-[1480px] px-5 py-12 sm:px-8 lg:px-12">
        <div className="mb-12 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Browse the Vendor Directory
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-300 sm:text-xl">
            Find the professionals young performers rely on — photographers,
            coaches, agents and managers — organized by what you need.
          </p>
        </div>

        {/* Priority categories */}
        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {priority.map((category) => {
            const Icon = PRIORITY_ICONS[category.slug];
            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group flex min-h-[260px] flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-8 transition duration-200 hover:-translate-y-1 hover:border-[#E4572E] hover:shadow-xl hover:shadow-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E4572E]"
              >
                <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#E4572E]/15 text-[#F28A63] transition-colors group-hover:bg-[#E4572E] group-hover:text-white">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </span>
                <h2 className="text-2xl font-bold leading-snug text-white">
                  {category.name}
                </h2>
                <p className="mt-3 flex-1 text-base leading-relaxed text-slate-300">
                  {category.blurb}
                </p>
                <p className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-sm font-semibold text-slate-200">
                  <span>
                    {category.count > 0 ? `${category.count} listed` : "Browse"}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-lg text-[#F28A63] transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </p>
              </Link>
            );
          })}
        </div>

        {/* More specialties: compact, grouped */}
        <h2 className="mb-6 text-2xl font-bold text-white">More specialties</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
          {groups.map((group) => (
            <div
              key={group.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <h3 className="mb-4 text-lg font-semibold text-white">
                {group.title}
              </h3>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {group.items.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/category/${category.slug}`}
                      className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium text-slate-100 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E4572E]"
                    >
                      <span>{category.name}</span>
                      {category.count > 0 && (
                        <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-200">
                          {category.count}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-2xl border border-white/10 bg-white/[0.04] p-8 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Don’t see what you need?
            </h2>
            <p className="mt-2 max-w-2xl text-slate-300">
              Search every professional in the directory, or suggest a vendor we
              should add.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link
              href="/directory"
              className="inline-flex items-center justify-center rounded-md bg-[#C2441F] px-5 py-3 text-sm font-semibold !text-white hover:bg-[#A93A19] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Search the Directory
            </Link>
            <Link
              href="/suggest-vendor"
              className="inline-flex items-center justify-center rounded-md border border-white/40 px-5 py-3 text-sm font-semibold !text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Suggest a Vendor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
