/**
 * Category Icon Mapping
 * Keys match category slugs/names exactly.
 * Uses Lucide React icons.
 */

import {
  Apple,
  Baby,
  Brain,
  Briefcase,
  Building,
  Camera,
  Clapperboard,
  ClipboardList,
  Compass,
  Drama,
  Film,
  Globe,
  GraduationCap,
  Handshake,
  Hash,
  Headphones,
  Languages,
  type LucideIcon,
  Megaphone,
  Mic,
  Newspaper,
  School,
  Scissors,
  ShieldCheck,
  Shirt,
  Star,
  TrendingUp,
  Users,
  UsersRound,
  Video,
  Wand2,
} from "lucide-react";

export const categoryIcons: Record<string, LucideIcon> = {
  // Featured Categories
  "Acting Classes & Coaches": GraduationCap,
  "Acting Coach": GraduationCap,
  "Audition Prep": Clapperboard,
  "Career Consultation": Compass,
  "Demo Reel Creators": Film,
  "Headshot Photographers": Camera,
  Photographer: Camera,
  "Self Tape Support": Video,
  "Talent Agents": Handshake,
  "Talent Agent": Handshake,
  "Talent Managers": Briefcase,
  "Talent Manager": Briefcase,

  // Other Categories
  "Acting Schools": School,
  "Actor Websites": Globe,
  "Background Casting": Users,
  "Branding Coaches": Megaphone,
  "Business of Acting": TrendingUp,
  "Career Consulting": ClipboardList,
  "Casting Workshops": UsersRound,
  "Child Advocacy": ShieldCheck,
  "Dialect Coach": Languages,
  "Improv Classes": Wand2,
  "Influencer Agents": Hash,
  "Mental Health for Performers": Brain,
  Publicists: Newspaper,
  "Reel Editors": Scissors,
  Editor: Scissors,
  "Set Sitters": Baby,
  "Set Teachers": Apple,
  Stylists: Shirt,
  "Talent Showcases": Star,
  "Theatre Training": Drama,
  "Vocal Coaches": Mic,
  "Voiceover Support": Headphones,
  Studio: Building,
};

/** Default icon for unknown categories */
export const DefaultCategoryIcon = Briefcase;

/**
 * Normalize category string for flexible matching
 */
function normalizeCategory(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Build normalized lookup map
const normalizedCategoryIcons: Record<string, LucideIcon> = {};
for (const [key, icon] of Object.entries(categoryIcons)) {
  normalizedCategoryIcons[normalizeCategory(key)] = icon;
}

/**
 * Get the Lucide icon component for a category
 * Handles variations in naming (slugs, display names, etc.)
 */
export function getCategoryIcon(
  category: string | null | undefined,
): LucideIcon {
  if (!category) return DefaultCategoryIcon;

  // Try exact match first
  if (categoryIcons[category]) return categoryIcons[category];

  // Try normalized match
  const normalized = normalizeCategory(category);
  return normalizedCategoryIcons[normalized] || DefaultCategoryIcon;
}
