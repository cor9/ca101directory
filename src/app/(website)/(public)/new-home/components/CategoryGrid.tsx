import {
  Camera,
  Video,
  Users,
  Mic,
  BookOpen,
  Palette,
  Building2,
  HelpCircle,
  Theater,
  Briefcase,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

// Brand color palette for category tiles
const tileColors = [
  "from-[#0D9488] to-[#0F766E]", // teal
  "from-[#F59E0B] to-[#D97706]", // lemon/amber
  "from-[#DC2626] to-[#B91C1C]", // cranberry
  "from-[#7C3AED] to-[#6D28D9]", // purple
  "from-[#64748B] to-[#475569]", // stone
  "from-[#F97316] to-[#EA580C]", // salmon/orange
  "from-[#3B82F6] to-[#2563EB]", // muted-blue
  "from-[#EC4899] to-[#DB2777]", // pink
];

// Map category names to icons
const categoryIcons: Record<string, LucideIcon> = {
  "acting classes": Theater,
  coaches: BookOpen,
  photographers: Camera,
  "headshot photographers": Camera,
  "talent agents": Briefcase,
  "talent managers": Users,
  "demo reels": Video,
  "demo reel creators": Video,
  "reel editors": Video,
  studios: Building2,
  resources: HelpCircle,
  "vocal coaches": Mic,
  stylists: Palette,
  default: HelpCircle,
};

interface Category {
  id: string;
  category_name: string;
  description?: string;
  icon?: string;
}

interface CategoryGridProps {
  categories: Category[];
}

// Get icon for a category based on its name
function getCategoryIcon(categoryName: string): LucideIcon {
  const normalizedName = categoryName.toLowerCase().trim();

  // Check for exact match first
  if (categoryIcons[normalizedName]) {
    return categoryIcons[normalizedName];
  }

  // Check for partial matches
  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return icon;
    }
  }

  return categoryIcons.default;
}

// Main category tiles to show (limited set for homepage)
const mainCategoryNames = [
  "Acting Classes & Coaches",
  "Headshot Photographers",
  "Talent Agents",
  "Talent Managers",
  "Demo Reel Creators",
  "Coaches",
  "Studios",
  "Resources",
];

export default function CategoryGrid({ categories }: CategoryGridProps) {
  // Filter to main categories or use first 8 if no matches
  let displayCategories = categories.filter((cat) =>
    mainCategoryNames.some(
      (name) => cat.category_name?.toLowerCase() === name.toLowerCase()
    )
  );

  // If we don't have enough, use the first 8 categories
  if (displayCategories.length < 4) {
    displayCategories = categories.slice(0, 8);
  }

  // Limit to 8 categories
  displayCategories = displayCategories.slice(0, 8);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {displayCategories.map((category, index) => {
        const Icon = getCategoryIcon(category.category_name);
        const colorClass = tileColors[index % tileColors.length];

        return (
          <Link
            key={category.id}
            href={`/category/${category.category_name
              ?.toLowerCase()
              .replace(/[&]/g, "and")
              .replace(/\s+/g, "-")}`}
            className={`tile-accent group relative overflow-hidden rounded-xl p-5 bg-gradient-to-br ${colorClass} transition-all duration-300 hover:scale-105 hover:shadow-lg`}
          >
            {/* Category Name */}
            <h3 className="text-white font-bold text-sm md:text-base leading-tight mb-8">
              {category.category_name}
            </h3>

            {/* Icon at bottom right */}
            <div className="absolute bottom-3 right-3 opacity-70 group-hover:opacity-100 transition-opacity">
              <Icon className="w-8 h-8 text-white/80" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
