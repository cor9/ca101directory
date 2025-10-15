"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AwardIcon, CheckCircleIcon, ShieldIcon, StarIcon } from "lucide-react";
import Link from "next/link";

interface Collection {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
  count: number;
  href: string;
  featured?: boolean;
}

export function CollectionsSection() {
  const collections: Collection[] = [
    {
      id: "101-approved",
      name: "101 Approved",
      description:
        "Professionals personally vetted by the Child Actor 101 team for safety, credentials, and proven results.",
      icon: <CheckCircleIcon className="h-6 w-6 text-green-600" />,
      badge: "Vetted",
      count: 45,
      href: "/directory?approved101=true",
      featured: true,
    },
    {
      id: "founding-vendors",
      name: "Founding Vendors",
      description:
        "The original professionals who helped build our directory and continue to set the standard for excellence.",
      icon: <AwardIcon className="h-6 w-6 text-yellow-600" />,
      badge: "Founding",
      count: 12,
      href: "/directory?founding=true",
      featured: true,
    },
    {
      id: "premium-partners",
      name: "Premium Partners",
      description:
        "Top-tier professionals offering premium services with advanced features and priority placement.",
      icon: <StarIcon className="h-6 w-6 text-blue-600" />,
      badge: "Premium",
      count: 28,
      href: "/directory?plan=Premium",
    },
    {
      id: "local-favorites",
      name: "Local Favorites",
      description:
        "Highly-rated professionals in your area, recommended by local families and industry professionals.",
      icon: <ShieldIcon className="h-6 w-6 text-purple-600" />,
      badge: "Local",
      count: 67,
      href: "/directory?local=true",
    },
    {
      id: "new-listings",
      name: "New This Month",
      description:
        "Fresh additions to our directory, recently verified and ready to help your child's acting journey.",
      icon: <StarIcon className="h-6 w-6 text-orange-600" />,
      badge: "New",
      count: 23,
      href: "/directory?new=true",
    },
    {
      id: "online-services",
      name: "Online Services",
      description:
        "Virtual coaching, online classes, and remote services perfect for busy families and remote learning.",
      icon: <CheckCircleIcon className="h-6 w-6 text-teal-600" />,
      badge: "Online",
      count: 34,
      href: "/directory?format=Online",
    },
  ];

  return (
    <div className="py-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Featured Collections</h2>
        <p className="text-gray-900 max-w-2xl mx-auto">
          Discover curated groups of professionals, each carefully selected for
          their expertise and proven track record.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <Card
            key={collection.id}
            className="h-full flex flex-col hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {collection.icon}
                  <div>
                    <CardTitle className="text-lg">{collection.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={collection.featured ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {collection.badge}
                      </Badge>
                      <span className="text-sm text-gray-900">
                        {collection.count} professionals
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <p className="text-gray-900 mb-4 flex-1">
                {collection.description}
              </p>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href={collection.href}>Browse Collection</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-8">
        <Button asChild variant="outline">
          <Link href="/directory">View All Collections</Link>
        </Button>
      </div>
    </div>
  );
}
