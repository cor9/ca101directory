import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = constructMetadata({
  title: "Categories - Child Actor 101 Directory",
  description: "Browse acting professionals by category to find the perfect match for your child's needs",
  canonicalUrl: `${siteConfig.url}/category`,
});

// Define the main categories for child acting professionals
const categories = [
  {
    name: "Acting Coaches",
    slug: "acting-coaches",
    description: "Professional acting coaches and instructors",
    icon: "🎭",
    count: "12+"
  },
  {
    name: "Headshot Photographers",
    slug: "headshot-photographers", 
    description: "Specialized photographers for professional headshots",
    icon: "📸",
    count: "8+"
  },
  {
    name: "Voice Coaches",
    slug: "voice-coaches",
    description: "Voice training and accent coaching",
    icon: "🎤",
    count: "6+"
  },
  {
    name: "Dance Instructors",
    slug: "dance-instructors",
    description: "Dance training for musical theater and performance",
    icon: "💃",
    count: "10+"
  },
  {
    name: "Agents & Managers",
    slug: "agents-managers",
    description: "Professional representation and career guidance",
    icon: "🤝",
    count: "15+"
  },
  {
    name: "Casting Directors",
    slug: "casting-directors",
    description: "Industry professionals who cast child actors",
    icon: "🎬",
    count: "5+"
  },
  {
    name: "Acting Schools",
    slug: "acting-schools",
    description: "Educational institutions and programs",
    icon: "🏫",
    count: "7+"
  },
  {
    name: "Workshop Leaders",
    slug: "workshop-leaders",
    description: "Specialized workshops and intensive programs",
    icon: "🎪",
    count: "9+"
  }
];

export default async function CategoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Browse by Category
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Find trusted acting professionals organized by specialty. Each category contains 
          verified professionals ready to help your child succeed in the entertainment industry.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {categories.map((category) => (
          <Link key={category.slug} href={`/category/${category.slug}`}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-200 border-brand-blue/20 hover:border-brand-blue/40">
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{category.icon}</div>
                <CardTitle className="text-lg text-brand-blue">
                  {category.name}
                </CardTitle>
                <Badge variant="secondary" className="w-fit mx-auto">
                  {category.count} professionals
                </Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  {category.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gradient-to-r from-brand-orange/5 via-brand-yellow/5 to-brand-blue/5 rounded-2xl p-8 border border-brand-blue/20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Don't See Your Category?
        </h2>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          We're constantly adding new categories and professionals. If you don't see 
          what you're looking for, try our search feature or submit a listing request.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/search"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-brand-blue text-brand-blue font-semibold rounded-lg hover:bg-brand-blue hover:text-white transition-colors"
          >
            Search All Professionals
          </Link>
          <Link
            href="/submit"
            className="inline-flex items-center justify-center px-6 py-3 bg-brand-orange text-white font-semibold rounded-lg hover:bg-brand-orange-dark transition-colors"
          >
            Submit Your Listing
          </Link>
        </div>
      </div>
    </div>
  );
}