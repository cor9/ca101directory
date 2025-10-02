"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface BlogPost {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  categories: string[];
  featuredImage: string;
}

const BLOG_CATEGORIES = [
  "All",
  "Headshots",
  "Self Tapes",
  "Training",
  "Getting Started",
  "Talent Representation",
  "Working Actor",
];

const BLOG_POSTS: BlogPost[] = [
  {
    title: "Getting Multifaceted Shots from a 3-Look Headshot Session",
    link: "https://www.childactor101.com/101-blog/getting-multifaceted-shots-from-a-3-look-headshot-session",
    description:
      "Learn how to maximize your headshot session to get multiple looks that showcase your child's versatility and range.",
    pubDate: "2024-01-15",
    categories: ["Headshots"],
    featuredImage: "https://www.childactor101.com/wp-content/uploads/2024/01/3-look-headshot-session.jpg",
  },
  {
    title: "Track Your Auditions and Expenses for Free",
    link: "https://www.childactor101.com/101-blog/track-your-auditions-and-expenses-for-free",
    description:
      "Essential tools and strategies to help parents track their child's auditions and manage entertainment industry expenses.",
    pubDate: "2024-01-10",
    categories: ["Self Tapes", "Getting Started"],
    featuredImage: "https://www.childactor101.com/wp-content/uploads/2024/01/track-auditions-expenses.jpg",
  },
  {
    title: "When Should My Child Start Acting Training?",
    link: "https://www.childactor101.com/101-blog/when-should-my-child-start-acting-training-a-parents-guide-to-the-right-age",
    description:
      "A comprehensive guide for parents on the right age to begin acting training and what to expect at different stages.",
    pubDate: "2024-01-05",
    categories: ["Training", "Getting Started"],
    featuredImage: "https://www.childactor101.com/wp-content/uploads/2024/01/acting-training-age.jpg",
  },
  {
    title: "Navigating Hollywood: Agent or Manager?",
    link: "https://www.childactor101.com/101-blog/navigating-hollywood-do-you-need-a-talent-agent-or-a-manager",
    description:
      "Understanding the difference between agents and managers and which one your child actor needs for their career.",
    pubDate: "2024-01-01",
    categories: ["Talent Representation"],
    featuredImage: "https://www.childactor101.com/wp-content/uploads/2024/01/agent-vs-manager.jpg",
  },
  {
    title: "On-Set Etiquette for Child Actors",
    link: "https://www.childactor101.com/101-blog/on-set-etiquette-essential-guide-for-child-actors-and-their-parents",
    description:
      "Essential on-set behavior and etiquette that every child actor and their parents should know for professional success.",
    pubDate: "2023-12-28",
    categories: ["Working Actor"],
    featuredImage: "https://www.childactor101.com/wp-content/uploads/2023/12/on-set-etiquette.jpg",
  },
  {
    title: "Headshot Hacks: Mastering the No-Makeup Look",
    link: "https://www.childactor101.com/101-blog/headshot-hacks-mastering-the-no-makeup-look-for-your-child-actor-essential-makeup-tips-for-perfect-photos",
    description:
      "Professional makeup tips and techniques for achieving the perfect natural look in your child's headshots.",
    pubDate: "2023-12-25",
    categories: ["Headshots"],
    featuredImage: "https://www.childactor101.com/wp-content/uploads/2023/12/no-makeup-headshot-look.jpg",
  },
];

export function BlogSection() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(BLOG_POSTS);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredPosts(BLOG_POSTS);
    } else {
      setFilteredPosts(
        BLOG_POSTS.filter((post) => post.categories.includes(selectedCategory)),
      );
    }
  }, [selectedCategory]);

  return (
    <div className="py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 text-brand-purple">BLOG</h2>
        <h3 className="text-2xl font-semibold text-foreground">
          Read our latest blog posts
        </h3>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {BLOG_CATEGORIES.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={`rounded-full ${
              selectedCategory === category
                ? "bg-brand-purple text-white hover:bg-brand-purple/90"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <Card
            key={post.link}
            className="h-full flex flex-col overflow-hidden bg-gray-900 border-gray-700"
          >
            {/* Featured Image */}
            <div className="relative h-48 overflow-hidden">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
              {/* Category Overlays */}
              <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                {post.categories.map((category) => (
                  <Badge
                    key={category}
                    className="bg-gray-800/90 text-white text-xs px-2 py-1"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            <CardContent className="flex-1 flex flex-col p-6">
              {/* Title */}
              <CardTitle className="text-lg font-semibold text-white mb-3 line-clamp-2">
                {post.title}
              </CardTitle>

              {/* Description */}
              <p className="text-gray-300 text-sm mb-4 flex-1 line-clamp-3">
                {post.description}
              </p>

              {/* Author and Date */}
              <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-brand-purple rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">C</span>
                  </div>
                  <span>Child Actor 101</span>
                </div>
                <span>
                  {new Date(post.pubDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </span>
              </div>

              {/* Read More Button */}
              <Button
                asChild
                variant="outline"
                size="sm"
                className="w-full border-gray-600 text-white hover:bg-gray-800"
              >
                <Link
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read More
                  <ExternalLinkIcon className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-12">
        <Button
          asChild
          variant="outline"
          className="border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white"
        >
          <Link
            href="https://childactor101.com/101-blog/"
            target="_blank"
            rel="noopener noreferrer"
          >
            View All Blog Posts
            <ExternalLinkIcon className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
