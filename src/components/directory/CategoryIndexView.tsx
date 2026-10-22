import {
  type PrimaryCategory,
  SECTIONS,
  getPrimaryBySlug,
  sectionPrimaries,
} from "@/lib/category-taxonomy";
import { cn } from "@/lib/utils";
import {
  Building2,
  Camera,
  Clapperboard,
  GraduationCap,
  Handshake,
  Megaphone,
  Mic2,
  School,
  Shield,
  Sparkles,
  Star,
  Users,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

const ICONS: Record<string, LucideIcon> = {
  "headshot-photographers": Camera,
  "acting-training": GraduationCap,
  "career-coaching-consulting": Sparkles,
  "demo-reels-editing": Clapperboard,
  "actor-marketing-services": Megaphone,
  "self-tape-services": Video,
  "set-sitters": Users,
  "talent-agents": Handshake,
  "talent-managers": Building2,
  "influencer-agents": Star,
  "background-casting": Mic2,
  "child-advocacy": Shield,
  "set-teachers": School,
};

function Count({ n, dark = false }: { n: number; dark?: boolean }) {
  return (
    <span
      className={cn(
        "shrink-0 tabular-nums text-sm font-semibold",
        dark ? "text-brass" : "text-brass-dark",
      )}
    >
      {n.toLocaleString()}
    </span>
  );
}

/** Large card for the two headline service categories. */
function FeatureCard({ c, count }: { c: PrimaryCategory; count: number }) {
  const Icon = ICONS[c.slug];
  return (
    <Link
      href={`/category/${c.slug}`}
      className="group flex items-start gap-5 rounded-2xl border border-canvas-line bg-white p-6 !text-ink shadow-[0_1px_2px_rgba(18,22,29,0.04)] transition hover:-translate-y-0.5 hover:border-brass-dark hover:shadow-[0_18px_34px_-20px_rgba(18,22,29,0.35)] focus-ring"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink text-brass">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-3">
          <span className="heading-display text-2xl">{c.name}</span>
          <Count n={count} />
        </span>
        <span className="mt-1.5 block text-[15px] leading-snug !text-ink-soft">
          {c.blurb}
        </span>
      </span>
    </Link>
  );
}

/** Compact row used for every other category. */
function RowCard({
  c,
  count,
  note,
  dark = false,
}: {
  c: PrimaryCategory;
  count: number;
  note?: boolean;
  dark?: boolean;
}) {
  const Icon = ICONS[c.slug];
  return (
    <Link
      href={`/category/${c.slug}`}
      className={cn(
        "group flex items-start gap-3 rounded-xl border px-4 py-3.5 transition focus-ring",
        dark
          ? "border-white/15 bg-white/[0.06] !text-white hover:border-brass hover:bg-white/10"
          : "border-canvas-line bg-white !text-ink hover:border-brass-dark hover:shadow-[0_10px_22px_-16px_rgba(18,22,29,0.35)]",
      )}
    >
      <Icon
        className={cn("mt-0.5 h-5 w-5 shrink-0", dark ? "text-brass" : "text-brass-dark")}
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-3">
          <span className="font-semibold">{c.name}</span>
          <Count n={count} dark={dark} />
        </span>
        {note && (
          <span
            className={cn(
              "mt-0.5 block text-sm leading-snug",
              dark ? "!text-zinc-300" : "!text-ink-soft",
            )}
          >
            {c.blurb}
          </span>
        )}
      </span>
    </Link>
  );
}

function SectionHeader({
  title,
  description,
  eyebrow,
  dark = false,
}: {
  title: string;
  description: string;
  eyebrow: string;
  dark?: boolean;
}) {
  return (
    <div className="mb-6">
      <p className="eyebrow">{eyebrow}</p>
      <h2
        className={cn(
          "heading-display mt-3 text-3xl",
          dark ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      <p
        className={cn(
          "mt-2 max-w-3xl text-[15px]",
          dark ? "!text-zinc-300" : "!text-ink-soft",
        )}
      >
        {description}
      </p>
    </div>
  );
}

/**
 * /category discovery: dark editorial header, then three clearly different
 * bands so a parent can tell at a glance whether they are shopping for a
 * service (warm white), researching representation (navy) or finding on-set
 * professionals (tinted).
 */
export function CategoryIndexView({ counts }: { counts: Record<string, number> }) {
  const n = (slug: string) => counts[slug] ?? 0;
  const [services, representation, resources] = SECTIONS;
  const featured = ["headshot-photographers", "acting-training"]
    .map((s) => getPrimaryBySlug(s))
    .filter((c): c is PrimaryCategory => Boolean(c));
  const otherServices = sectionPrimaries("services").filter(
    (c) => !featured.includes(c),
  );

  return (
    <div>
      <header className="surface-hero">
        <div className="mx-auto w-full max-w-6xl px-5 pb-14 pt-12 sm:px-8 md:pt-16">
          <p className="eyebrow">Categories</p>
          <h1 className="heading-display mt-4 text-4xl text-white sm:text-5xl">
            Browse the Vendor Directory
          </h1>
          <p className="mt-4 max-w-2xl text-lg !text-zinc-300">
            Looking for a service, talent representation, or industry and
            on-set professionals? Start here.
          </p>
        </div>
      </header>

      {/* A. Services & Training */}
      <section aria-labelledby="sec-services" className="surface-canvas">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
          <div id="sec-services">
            <SectionHeader
              eyebrow="Services"
              title={services.title}
              description={services.description}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {featured.map((c) => (
              <FeatureCard key={c.slug} c={c} count={n(c.slug)} />
            ))}
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {otherServices.map((c) => (
              <RowCard key={c.slug} c={c} count={n(c.slug)} />
            ))}
          </div>
        </div>
      </section>

      {/* B. Talent Representation: visibly separate from purchasable services */}
      <section aria-labelledby="sec-rep" className="surface-navy">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
          <div id="sec-rep">
            <SectionHeader
              dark
              eyebrow="Representation"
              title={representation.title}
              description={representation.description}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {sectionPrimaries("representation").map((c) => (
              <RowCard key={c.slug} c={c} count={n(c.slug)} note dark />
            ))}
          </div>
          <p className="mt-5 text-sm !text-zinc-400">
            Policies for contacting agencies and managers vary. Check each
            company’s own website.
          </p>
        </div>
      </section>

      {/* C. Industry & On-Set Resources */}
      <section aria-labelledby="sec-res" className="surface-canvas-2">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
          <div id="sec-res">
            <SectionHeader
              eyebrow="Resources"
              title={resources.title}
              description={resources.description}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {sectionPrimaries("resources").map((c) => (
              <RowCard key={c.slug} c={c} count={n(c.slug)} note />
            ))}
          </div>
          <p className="mt-10 text-sm !text-ink-soft">
            Can’t find it here? Every listing is also searchable in the{" "}
            <Link
              href="/directory"
              className="font-semibold !text-brass-dark underline underline-offset-4"
            >
              full directory
            </Link>
            , or you can{" "}
            <Link
              href="/suggest-vendor"
              className="font-semibold !text-brass-dark underline underline-offset-4"
            >
              suggest a vendor
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
