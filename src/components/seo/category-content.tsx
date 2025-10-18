/**
 * SEO-rich content for category pages
 * Bauhaus theme with proper text contrast
 */

interface CategoryContentProps {
  categoryName: string;
  listingCount: number;
}

export function CategoryContent({ categoryName, listingCount }: CategoryContentProps) {
  const content = getCategoryContent(categoryName, listingCount);

  if (!content) return null;

  return (
    <div className="space-y-8 mb-12">
      {/* Intro Section - Bauhaus cream card with dark text */}
      <div className="bg-paper rounded-lg p-8 border-2 border-surface/20">
        <p className="text-lg leading-relaxed text-paper">
          {content.intro}
        </p>
      </div>

      {/* Why You Need This Section */}
      <div className="bg-surface rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-paper">
          Why You Need {categoryName}
        </h2>
        <ul className="space-y-3">
          {content.whyYouNeed.map((item, index) => (
            <li key={index} className="flex items-start gap-3 text-paper/90">
              <span className="text-primary-orange text-xl mt-1">✓</span>
              <span className="flex-1">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* What to Look For Section */}
      <div className="bg-paper rounded-lg p-8 border-2 border-surface/20">
        <h2 className="text-2xl font-bold mb-4 text-paper">
          What to Look For
        </h2>
        <ul className="space-y-3">
          {content.whatToLookFor.map((item, index) => (
            <li key={index} className="flex items-start gap-3 text-paper/90">
              <span className="text-primary-orange text-xl mt-1">•</span>
              <span className="flex-1">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function getCategoryContent(categoryName: string, listingCount: number) {
  const contentMap: Record<string, {
    intro: string;
    whyYouNeed: string[];
    whatToLookFor: string[];
  }> = {
    "Headshot Photographers": {
      intro: `Finding the right headshot photographer is crucial for your child's acting career. A great headshot captures your child's personality, range, and authenticity—helping them stand out in auditions and catch casting directors' attention. Browse ${listingCount} professional headshot photographers who specialize in child actors and understand the unique needs of young performers.`,
      whyYouNeed: [
        "First impression for casting directors and agents",
        "Shows your child's range, personality, and castability",
        "Required for agent submissions and casting profiles",
        "Should be updated every 6-12 months as your child grows",
        "Professional quality makes a significant difference in callbacks",
      ],
      whatToLookFor: [
        "Experience working with child actors and understanding their needs",
        "Natural, authentic style that captures personality",
        "Multiple looks and outfit changes included",
        "Quick turnaround time for busy families",
        "Reasonable pricing with digital files included",
        "Portfolio showing range of ages and types",
      ],
    },
    "Acting Classes & Coaches": {
      intro: `Quality acting training is the foundation of your child's success in the industry. Whether you're looking for group classes or private coaching, the right instruction helps young actors develop confidence, technique, and professional skills. Explore ${listingCount} trusted acting coaches and classes specializing in child and teen performers.`,
      whyYouNeed: [
        "Builds confidence and stage presence",
        "Develops essential acting techniques and skills",
        "Prepares for auditions and on-set work",
        "Provides industry knowledge and connections",
        "Creates a supportive community of young actors",
      ],
      whatToLookFor: [
        "Experience teaching child and teen actors",
        "Age-appropriate curriculum and teaching methods",
        "Focus on both technique and confidence building",
        "Flexible scheduling for school and auditions",
        "Positive, encouraging teaching environment",
        "Track record of student success in the industry",
      ],
    },
    "Talent Managers": {
      intro: `A dedicated talent manager can be instrumental in guiding your child's acting career. Unlike agents who focus on bookings, managers provide career strategy, industry guidance, and long-term development. Compare ${listingCount} professional talent managers who specialize in representing young performers.`,
      whyYouNeed: [
        "Strategic career planning and guidance",
        "Industry connections and networking opportunities",
        "Help selecting the right agents and projects",
        "Support with contract negotiations and career decisions",
        "Long-term relationship focused on career development",
      ],
      whatToLookFor: [
        "Licensed and bonded (required in California)",
        "Experience managing child actors specifically",
        "Strong industry relationships and track record",
        "Clear communication and accessibility",
        "Reasonable commission rates (typically 10-15%)",
        "References from current or past clients",
      ],
    },
    "Self-Tape Support": {
      intro: `Self-taping has become essential in modern auditions, especially for child actors. Professional self-tape services provide quality equipment, coaching, and technical support to help your child submit competitive auditions. Discover ${listingCount} self-tape studios and services designed for young performers.`,
      whyYouNeed: [
        "Professional quality video and audio for auditions",
        "Expert coaching and direction during taping",
        "Quick turnaround for last-minute auditions",
        "Eliminates technical stress for busy families",
        "Increases chances of callbacks with quality submissions",
      ],
      whatToLookFor: [
        "Professional camera and audio equipment",
        "Experienced reader/coach for scene work",
        "Fast editing and delivery turnaround",
        "Flexible scheduling including evenings/weekends",
        "Affordable rates for multiple takes",
        "Easy file delivery for submissions",
      ],
    },
    "Mental Health for Performers": {
      intro: `The entertainment industry can be challenging for young performers, making mental health support essential. Specialized therapists and counselors understand the unique pressures child actors face—from rejection to balancing work and school. Find ${listingCount} mental health professionals who specialize in supporting young performers and their families.`,
      whyYouNeed: [
        "Navigate rejection and industry pressures healthily",
        "Maintain balance between acting and childhood",
        "Process the unique challenges of being a child performer",
        "Support family dynamics in the entertainment industry",
        "Build resilience and emotional intelligence",
      ],
      whatToLookFor: [
        "Experience with performers and entertainment industry",
        "Understanding of child development and psychology",
        "Flexible scheduling around auditions and shoots",
        "Family therapy options when needed",
        "Confidential, supportive environment",
        "Licensed and credentialed professionals",
      ],
    },
  };

  return contentMap[categoryName] || null;
}
