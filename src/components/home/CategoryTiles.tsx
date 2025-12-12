import Link from "next/link";
import {
  Camera,
  Mic,
  Users,
  Video,
  Star,
  Briefcase,
} from "lucide-react";

const categories = [
  {
    label: "Acting Coaches",
    href: "/category/acting-coaches",
    icon: Mic,
    color: "from-accent-teal/20 to-accent-teal/5",
  },
  {
    label: "Headshot Photographers",
    href: "/category/headshots",
    icon: Camera,
    color: "from-accent-purple/20 to-accent-purple/5",
  },
  {
    label: "Talent Agents",
    href: "/category/agents",
    icon: Users,
    color: "from-accent-blue/20 to-accent-blue/5",
  },
  {
    label: "Audition Prep",
    href: "/category/audition-prep",
    icon: Star,
    color: "from-accent-lemon/20 to-accent-lemon/5",
  },
  {
    label: "Demo Reels",
    href: "/category/demo-reels",
    icon: Video,
    color: "from-accent-salmon/20 to-accent-salmon/5",
  },
  {
    label: "Industry Services",
    href: "/category/services",
    icon: Briefcase,
    color: "from-accent-cranberry/20 to-accent-cranberry/5",
  },
];

export default function CategoryTiles() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-2xl font-semibold text-text-primary mb-8">
        Browse by category
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.label}
            href={cat.href}
            className={`group relative rounded-2xl border border-border-subtle bg-gradient-to-br ${cat.color} p-6 hover:shadow-cardHover transition`}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-bg-dark-3 border border-border-subtle">
                <cat.icon className="w-6 h-6 text-text-primary" />
              </div>

              <span className="text-lg font-medium text-text-primary group-hover:text-accent-teal transition">
                {cat.label}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
