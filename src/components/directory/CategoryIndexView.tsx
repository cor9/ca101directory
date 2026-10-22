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

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1117]";

function Count({ n }: { n: number }) {
  return (
    <span className="shrink-0 tabular-nums text-sm font-medium text-zinc-300">
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
      className={cn(
        "group flex items-start gap-5 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.03] p-6 transition hover:border-white/40 hover:from-white/[0.11]",
        focusRing,
      )}
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-zinc-900">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-3">
          <span className="text-xl font-bold text-white">{c.name}</span>
          <Count n={count} />
        </span>
        <span className="mt-1 block text-[15px] leading-snug text-zinc-300">
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
}: {
  c: PrimaryCategory;
  count: number;
  note?: boolean;
}) {
  const Icon = ICONS[c.slug];
  return (
    <Link
      href={`/category/${c.slug}`}
      className={cn(
        "group flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 transition hover:border-white/40 hover:bg-white/[0.08]",
        focusRing,
      )}
    >
      <Icon
        className="mt-0.5 h-5 w-5 shrink-0 text-zinc-300 transition-colors group-hover:text-white"
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-3">
          <span className="font-semibold text-white">{c.name}</span>
          <Count n={count} />
        </span>
        {note && (
          <span className="mt-0.5 block text-sm leading-snug text-zinc-400">
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
}: {
  title: string;
  description: string;
  eyebrow?: string;
}) {
  return (
    <div className="mb-4">
      {eyebrow && (
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-400">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <p className="mt-1 max-w-3xl text-[15px] text-zinc-300">{description}</p>
    </div>
  );
}

/**
 * /category discovery: three clearly different sections so a parent can tell
 * at a glance whether they are shopping for a service, researching talent
 * representation, or finding industry / on-set professionals.
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
    <div className="min-h-screen bg-bg-dark">
      <section className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
        <header className="mb-10 max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Browse the Vendor Directory
          </h1>
          <p className="mt-3 text-lg text-zinc-300">
            Looking for a service, talent representation, or industry and
            on-set professionals? Start here.
          </p>
        </header>

        {/* A. Services & Training */}
        <section aria-labelledby="sec-services" className="mb-12">
          <div id="sec-services">
            <SectionHeader
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
        </section>

        {/* B. Talent Representation: visibly separate from purchasable services */}
        <section
          aria-labelledby="sec-rep"
          className="mb-12 rounded-2xl border border-white/20 bg-white/[0.05] p-5 sm:p-7"
        >
          <div id="sec-rep">
            <SectionHeader
              eyebrow="Find"
              title={representation.title}
              description={representation.description}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {sectionPrimaries("representation").map((c) => (
              <RowCard key={c.slug} c={c} count={n(c.slug)} note />
            ))}
          </div>
          <p className="mt-4 text-sm text-zinc-400">
            Policies for contacting agencies and managers vary. Check each
            company’s own website.
          </p>
        </section>

        {/* C. Industry & On-Set Resources */}
        <section aria-labelledby="sec-res">
          <div id="sec-res">
            <SectionHeader
              title={resources.title}
              description={resources.description}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {sectionPrimaries("resources").map((c) => (
              <RowCard key={c.slug} c={c} count={n(c.slug)} note />
            ))}
          </div>
        </section>

        <p className="mt-12 text-sm text-zinc-400">
          Can’t find it here? Every listing is also searchable in the{" "}
          <Link
            href="/directory"
            className="font-semibold !text-white underline underline-offset-4 hover:no-underline"
          >
            full directory
          </Link>
          , or you can{" "}
          <Link
            href="/suggest-vendor"
            className="font-semibold !text-white underline underline-offset-4 hover:no-underline"
          >
            suggest a vendor
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
