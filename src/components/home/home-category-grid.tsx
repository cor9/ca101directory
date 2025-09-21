import { Icons } from "@/components/icons/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Category {
  name: string;
  slug: string;
  icon: keyof typeof Icons;
  description: string;
  count?: number;
}

const categories: Category[] = [
  {
    name: "Acting Classes & Coaches",
    slug: "acting-classes-coaches",
    icon: "theater",
    description: "Professional acting instruction and coaching",
    count: 12,
  },
  {
    name: "Headshot Photographers",
    slug: "headshot-photographers",
    icon: "camera",
    description: "Professional headshot and portfolio photography",
    count: 8,
  },
  {
    name: "Demo Reel Editors",
    slug: "demo-reel-editors",
    icon: "video",
    description: "Video editing and demo reel production",
    count: 6,
  },
  {
    name: "Talent Agents",
    slug: "talent-agents",
    icon: "users",
    description: "Licensed talent representation",
    count: 15,
  },
  {
    name: "Casting Directors",
    slug: "casting-directors",
    icon: "star",
    description: "Professional casting services",
    count: 9,
  },
  {
    name: "Voice Coaches",
    slug: "voice-coaches",
    icon: "mic",
    description: "Voice training and accent coaching",
    count: 7,
  },
];

export default function HomeCategoryGrid() {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Find the perfect professional for your child's acting journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {categories.map((category) => {
          const IconComponent = Icons[category.icon];
          return (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group"
            >
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    {category.count && (
                      <p className="text-sm text-muted-foreground">
                        {category.count} professionals
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  {category.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <Link
          href="/search"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          View All Categories
          <Icons.arrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
