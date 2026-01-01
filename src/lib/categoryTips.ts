/**
 * Micro-Learning Tips by Category
 * Static mapping for Safety Tips / Quick Guides
 */

export interface CategoryTip {
  title: string;
  content: string;
  type: "safety" | "guide" | "info";
}

export const categoryTips: Record<string, CategoryTip> = {
  // Featured categories
  "Talent Managers": {
    title: "What to Know About Talent Managers",
    content:
      "Legitimate managers in California should be bonded and never charge upfront fees. Red flags: requiring you to use their photographer, charging 'admin fees,' or pressuring quick decisions. Standard commission is 10-15% of earnings.",
    type: "safety",
  },
  "Talent Manager": {
    title: "What to Know About Talent Managers",
    content:
      "Legitimate managers in California should be bonded and never charge upfront fees. Red flags: requiring you to use their photographer, charging 'admin fees,' or pressuring quick decisions. Standard commission is 10-15% of earnings.",
    type: "safety",
  },
  "Talent Agents": {
    title: "Agent Commission & Fee Rules",
    content:
      "Licensed talent agents can only charge commission (typically 10%) AFTER you book work. No legitimate agent charges upfront fees. In California, agents must be licensed by the Labor Commissioner. Ask to see their license.",
    type: "safety",
  },
  "Talent Agent": {
    title: "Agent Commission & Fee Rules",
    content:
      "Licensed talent agents can only charge commission (typically 10%) AFTER you book work. No legitimate agent charges upfront fees. In California, agents must be licensed by the Labor Commissioner. Ask to see their license.",
    type: "safety",
  },
  "Headshot Photographers": {
    title: "Headshot Basics for Young Actors",
    content:
      "Kids under 14 should update headshots every 6-12 months as they change quickly. You need two types: commercial (warm, approachable smile) and theatrical (neutral, serious). Natural lighting and minimal retouching work best for young actors.",
    type: "guide",
  },
  "Photographer": {
    title: "Headshot Basics for Young Actors",
    content:
      "Kids under 14 should update headshots every 6-12 months as they change quickly. You need two types: commercial (warm, approachable smile) and theatrical (neutral, serious). Natural lighting and minimal retouching work best for young actors.",
    type: "guide",
  },

  // Other categories
  "Acting Classes & Coaches": {
    title: "Choosing the Right Acting Coach",
    content:
      "Look for coaches with professional experience (IMDb credits, union work). A good coach focuses on technique, not just booking. Ask about class size—smaller is better for kids. Trial classes are standard; be wary of long-term contracts.",
    type: "guide",
  },
  "Acting Coach": {
    title: "Choosing the Right Acting Coach",
    content:
      "Look for coaches with professional experience (IMDb credits, union work). A good coach focuses on technique, not just booking. Ask about class size—smaller is better for kids. Trial classes are standard; be wary of long-term contracts.",
    type: "guide",
  },
  "Self Tape Support": {
    title: "Self-Tape Quality Matters",
    content:
      "Good lighting, clean audio, and a neutral backdrop are essential. Frame from chest up unless instructed otherwise. Keep slates brief (name, age, role). Many casting directors prefer self-tapes now—quality investment pays off.",
    type: "guide",
  },
  "Demo Reel Creators": {
    title: "Demo Reel Tips",
    content:
      "Keep reels under 2 minutes—lead with your strongest work. For kids with limited credits, a well-produced scene from class can work. Update annually. Quality over quantity: 3 strong clips beat 10 mediocre ones.",
    type: "guide",
  },
  "Casting Workshops": {
    title: "Casting Director Workshops",
    content:
      "Pay-to-meet workshops are legal but controversial. The value is education, not guaranteed auditions. Never pay for an 'audition'—that's a scam. Research the casting director's credits before paying.",
    type: "info",
  },
  "Set Sitters": {
    title: "On-Set Care Requirements",
    content:
      "California law requires studio teachers for minors on set. Set sitters provide additional supervision during non-school hours. Verify they have background checks and set experience. Your child should never be left alone with strangers on set.",
    type: "safety",
  },
  "Set Teachers": {
    title: "Studio Teacher Requirements",
    content:
      "In California, studio teachers must be credentialed and certified by the Labor Commissioner. They protect work hours, ensure education requirements, and advocate for your child's welfare. Verify credentials before any production.",
    type: "safety",
  },
  "Mental Health for Performers": {
    title: "Protecting Your Child's Wellbeing",
    content:
      "Rejection is part of acting—help kids separate self-worth from bookings. Watch for signs of burnout or anxiety. Take breaks when needed. A therapist familiar with the industry can help navigate unique pressures.",
    type: "info",
  },
};

/**
 * Get the tip for a category (handles variations in naming)
 */
export function getCategoryTip(category: string | null | undefined): CategoryTip | null {
  if (!category) return null;
  return categoryTips[category] || null;
}





