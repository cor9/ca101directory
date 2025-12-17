/**
 * Category Icon Mapping
 * Keys match category slugs/names exactly.
 * Uses Lucide React icons.
 */

import {
  GraduationCap,
  Clapperboard,
  Compass,
  Film,
  Camera,
  Video,
  Handshake,
  Briefcase,
  School,
  Globe,
  Users,
  Megaphone,
  TrendingUp,
  ClipboardList,
  UsersRound,
  ShieldCheck,
  Languages,
  Wand2,
  Hash,
  Brain,
  Newspaper,
  Scissors,
  Baby,
  Apple,
  Shirt,
  Star,
  Drama,
  Mic,
  Headphones,
  Building,
  type LucideIcon,
} from "lucide-react";

export const categoryIcons: Record<string, LucideIcon> = {
  // Featured Categories
  "Acting Classes & Coaches": GraduationCap,
  "Acting Coach": GraduationCap,
  "Audition Prep": Clapperboard,
  "Career Consultation": Compass,
  "Demo Reel Creators": Film,
  "Headshot Photographers": Camera,
  "Photographer": Camera,
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
  "Publicists": Newspaper,
  "Reel Editors": Scissors,
  "Editor": Scissors,
  "Set Sitters": Baby,
  "Set Teachers": Apple,
  "Stylists": Shirt,
  "Talent Showcases": Star,
  "Theatre Training": Drama,
  "Vocal Coaches": Mic,
  "Voiceover Support": Headphones,
  "Studio": Building,
};

/** Default icon for unknown categories */
export const DefaultCategoryIcon = Briefcase;

/**
 * Get the Lucide icon component for a category
 */
export function getCategoryIcon(category: string | null | undefined): LucideIcon {
  if (!category) return DefaultCategoryIcon;
  return categoryIcons[category] || DefaultCategoryIcon;
}
