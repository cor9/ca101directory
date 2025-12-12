import {
  Camera,
  Video,
  Users,
  Mic,
  BookOpen,
  Palette,
  Building2,
  HelpCircle,
  Heart,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

// UI Kit accent colors for category tiles
const tileColors = [
  "#1CC8B0", // teal
  "#FF8A7A", // salmon
  "#C57CFF", // purple
  "#D9476D", // cranberry
  "#4EA3FF", // blue
  "#A8ACB9", // stone
  "#F5E76A", // lemon
  "#1CC8B0", // teal (repeat)
];

// Map category names to icons
const categoryIcons: Record<string, LucideIcon> = {
  "acting classes": Users,
  "acting coaches": Users,
  coaches: BookOpen,
  photographers: Camera,
  "headshot photographers": Camera,
  "talent agents": Users,
  "talent managers": Users,
  "demo reels": Video,
  "demo reel creators": Video,
  "reel editors": Video,
  studios: Building2,
  resources: HelpCircle,
  "vocal coaches": Mic,
  stylists: Palette,
  "branding": Palette,
  "voice": Mic,
  "advocacy": Heart,
  "workshops": Sparkles,
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

export default function CategoryGrid({ categories }: CategoryGridProps) {
  // Use first 8 categories
  const displayCategories = categories.slice(0, 8);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
      {displayCategories.map((category, index) => {
        const Icon = getCategoryIcon(category.category_name);
        const bgColor = tileColors[index % tileColors.length];

        return (
          <Link
            key={category.id}
            href={`/category/${category.category_name
              ?.toLowerCase()
              .replace(/[&]/g, "and")
              .replace(/\s+/g, "-")}`}
            className="tile group"
            style={{ background: bgColor }}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-text-primary font-semibold">
                {category.category_name}
              </span>
              <Icon className="h-6 w-6 opacity-80 text-text-primary" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
