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
  // Headshots (3 posts)
  {
    title: "Getting Multifaceted Shots from a 3-Look Headshot Session",
    link: "https://www.childactor101.com/101-blog/getting-multifaceted-shots-from-a-3-look-headshot-session",
    description:
      "Learn how to maximize your headshot session to get multiple looks that showcase your child's versatility and range.",
    pubDate: "2024-01-15",
    categories: ["Headshots"],
    featuredImage: "http://static1.squarespace.com/static/616e111657e9bc2d5ed77edc/t/6617490825d3af09e49f1b77/1712802060133/Cream+Simple+Minimalist+Photo+Film+Photo+Collage.jpg?format=1500w",
  },
  {
    title: "Headshot Guide",
    link: "https://www.childactor101.com/headshot-guide",
    description:
      "Complete guide to getting professional headshots for your child actor.",
    pubDate: "2024-01-10",
    categories: ["Headshots"],
    featuredImage: "http://static1.squarespace.com/static/616e111657e9bc2d5ed77edc/t/67f8a61e1295da021ce2fa8d/1744348702899/IMG_1100.jpeg?format=1500w",
  },
  {
    title: "Headshot Hacks: Mastering the No-Makeup Look",
    link: "https://www.childactor101.com/101-blog/headshot-hacks-mastering-the-no-makeup-look-for-your-child-actor-essential-makeup-tips-for-perfect-photos",
    description:
      "Professional makeup tips and techniques for achieving the perfect natural look in your child's headshots.",
    pubDate: "2023-12-25",
    categories: ["Headshots"],
    featuredImage: "http://static1.squarespace.com/static/616e111657e9bc2d5ed77edc/t/65cd760420845e02129bb8cb/1707963914249/Spring_makeup_for_teens.png?format=1500w",
  },
  
  // Self Tapes (3 posts)
  {
    title: "Self Tape Guide",
    link: "https://www.childactor101.com/101-blog/pvr68iuo938gsyb250tdh0m4wifk9o",
    description:
      "Essential guide to creating professional self-tape auditions for your child actor.",
    pubDate: "2024-01-12",
    categories: ["Self Tapes"],
    featuredImage: "http://static1.squarespace.com/static/616e111657e9bc2d5ed77edc/t/65fb38c17a47993212f33dda/1710962887502/5+self+tape.jpg?format=1500w",
  },
  {
    title: "Track Your Auditions and Expenses for Free",
    link: "https://www.childactor101.com/101-blog/track-your-auditions-and-expenses-for-free",
    description:
      "Essential tools and strategies to help parents track their child's auditions and manage entertainment industry expenses.",
    pubDate: "2024-01-10",
    categories: ["Self Tapes"],
    featuredImage: "http://static1.squarespace.com/static/616e111657e9bc2d5ed77edc/616fe338cca8f97e6279b2f6/63144ef0e3bb8d1814174251/1662282312893/8940CFFC-FC43-4FF7-893D-8049608264E7.jpeg?format=1500w",
  },
  {
    title: "How to Help Your Child Actor Self-Tape Auditions While Traveling",
    link: "https://www.childactor101.com/101-blog/how-to-help-your-child-actor-self-tape-auditions-while-traveling-a-parents-guide-to-taping-in-a-hotel-room",
    description:
      "A parent's guide to creating professional self-tape auditions while traveling and staying in hotel rooms.",
    pubDate: "2024-01-08",
    categories: ["Self Tapes"],
    featuredImage: "http://static1.squarespace.com/static/616e111657e9bc2d5ed77edc/t/64d5dd7f7781440451f2669a/1691737474283/IMG_1258.jpeg?format=1500w",
  },
  
  // Training (3 posts)
  {
    title: "When Should My Child Start Acting Training?",
    link: "https://www.childactor101.com/101-blog/when-should-my-child-start-acting-training-a-parents-guide-to-the-right-age",
    description:
      "A comprehensive guide for parents on the right age to begin acting training and what to expect at different stages.",
    pubDate: "2024-01-05",
    categories: ["Training"],
    featuredImage: "http://static1.squarespace.com/static/616e111657e9bc2d5ed77edc/t/67ef99bdc2c3e8556bd69b45/1743755709953/8C80EBC0-456E-43E2-BAF2-01EAF8B2EFC3.png?format=1500w",
  },
  {
    title: "The Harsh Truth: If You're Not Taking Training Seriously, Your Kid Is Just a Hobbyist",
    link: "https://www.childactor101.com/101-blog/the-harsh-truth-if-youre-not-taking-training-seriously-your-kid-isnbspjust-a-hobbyist",
    description:
      "Understanding the difference between serious acting training and casual hobby participation in the entertainment industry.",
    pubDate: "2024-01-03",
    categories: ["Training"],
    featuredImage: "http://static1.squarespace.com/static/616e111657e9bc2d5ed77edc/t/67c5ba70b83de534cd555861/1741011576039/feedback3.png?format=1500w",
  },
  {
    title: "The Screen Time That Counts: 8 Reasons Why Child Actors Need to Be Watching TV Shows",
    link: "https://www.childactor101.com/101-blog/the-screen-time-that-counts-8-reasons-why-child-actors-need-to-be-watching-tv-shows",
    description:
      "Why watching quality TV shows is essential training for child actors and how to make screen time educational.",
    pubDate: "2024-01-01",
    categories: ["Training"],
    featuredImage: "http://static1.squarespace.com/static/616e111657e9bc2d5ed77edc/t/64d6dae5a9648c5190bd0b17/1691802344134/c2494462641e6890268445f2c4dc74ae.jpeg?format=1500w",
  },
  
  // Getting Started (3 posts)
  {
    title: "What It Takes",
    link: "https://www.childactor101.com/101-blog/what-it-takes",
    description:
      "Understanding the commitment, dedication, and resources required to pursue a career in child acting.",
    pubDate: "2023-12-30",
    categories: ["Getting Started"],
    featuredImage: "http://static1.squarespace.com/static/616e111657e9bc2d5ed77edc/t/66b58774c6d7eb23692c88ab/1723172730361/FD71A29D-B56E-49AF-81D3-A218029CFA2B.jpeg?format=1500w",
  },
  {
    title: "Is Your Child Ready for an Agent?",
    link: "https://www.childactor101.com/101-blog/is-your-child-ready-for-an-agent-a-guide-for-parents-of-aspiring-young-actors",
    description:
      "A comprehensive guide for parents to determine if their child is ready to work with a talent agent.",
    pubDate: "2023-12-28",
    categories: ["Getting Started"],
    featuredImage: "http://static1.squarespace.com/static/616e111657e9bc2d5ed77edc/t/66b81bf944f1d6095d7c38dc/1723341823230/IMG_0163.png?format=1500w",
  },
  {
    title: "The Critical Conversation",
    link: "https://www.childactor101.com/101-blog/the-critical-conversation",
    description:
      "The essential conversation every parent must have with their child before pursuing acting professionally.",
    pubDate: "2023-12-25",
    categories: ["Getting Started"],
    featuredImage: "http://static1.squarespace.com/static/616e111657e9bc2d5ed77edc/616fe338cca8f97e6279b2f6/64905f6b8b5357646d23273c/1687183965096/mother-talk-child-serious-stock-today-180608-tease.jpg?format=1500w",
  },
  
  // Talent Representation (3 posts)
  {
    title: "Navigating Hollywood: Agent or Manager?",
    link: "https://www.childactor101.com/101-blog/navigating-hollywood-do-you-need-a-talent-agent-or-a-manager",
    description:
      "Understanding the difference between agents and managers and which one your child actor needs for their career.",
    pubDate: "2023-12-22",
    categories: ["Talent Representation"],
    featuredImage: "http://static1.squarespace.com/static/616e111657e9bc2d5ed77edc/t/66b4e4e1f41a8873dd16c7c8/1723131111104/dickwhimsy_Pixar_style_mom_and_her_kid_actor_in_a_dilemma_over__b99a75c2-d819-4b34-89dc-8745a1214bcc.png?format=1500w",
  },
  {
    title: "Hot Topic: Should You Be Your Child's Momager?",
    link: "https://www.childactor101.com/101-blog/hot-topic-should-you-be-your-childs-momager",
    description:
      "Exploring the pros and cons of parents taking on the role of their child's manager in the entertainment industry.",
    pubDate: "2023-12-20",
    categories: ["Talent Representation"],
    featuredImage: "http://static1.squarespace.com/static/616e111657e9bc2d5ed77edc/t/65eeb3a277e726345bc13f98/1710142373639/mommyger.jpeg?format=1500w",
  },
  {
    title: "Ready to Wow Agents and Managers: Inside Tips to Ace Your Meeting",
    link: "https://www.childactor101.com/101-blog/ready-to-wow-agents-and-managers-inside-tips-to-ace-your-meeting",
    description:
      "Professional tips and strategies to make a great impression when meeting with talent agents and managers.",
    pubDate: "2023-12-18",
    categories: ["Talent Representation"],
    featuredImage: "http://static1.squarespace.com/static/616e111657e9bc2d5ed77edc/t/65cecac887b84f040571b59e/1708051147830/5b9d96c7-efca-45a3-ac56-4423942375f8.jpg?format=1500w",
  },
  
  // Working Actor (3 posts)
  {
    title: "On-Set Etiquette for Child Actors",
    link: "https://www.childactor101.com/101-blog/on-set-etiquette-essential-guide-for-child-actors-and-their-parents",
    description:
      "Essential on-set behavior and etiquette that every child actor and their parents should know for professional success.",
    pubDate: "2023-12-15",
    categories: ["Working Actor"],
    featuredImage: "http://static1.squarespace.com/static/616e111657e9bc2d5ed77edc/t/66b32492f7efea50d64e0fdb/1723016343137/IMG_0039.png?format=1500w",
  },
  {
    title: "A Rundown on Child Labor Laws",
    link: "https://www.childactor101.com/101-blog/a-rundown-on-child-labor-laws-in",
    description:
      "Understanding child labor laws and regulations that protect young performers in the entertainment industry.",
    pubDate: "2023-12-12",
    categories: ["Working Actor"],
    featuredImage: "http://static1.squarespace.com/static/616e111657e9bc2d5ed77edc/t/661e3f667a848425d0e8ee23/1713258349605/IMG_1139.png?format=1500w",
  },
  {
    title: "Background Acting: The Pros and Cons for Young Performers",
    link: "https://www.childactor101.com/101-blog/background-acting-the-pros-and-cons-for-young-performers",
    description:
      "Exploring the benefits and drawbacks of background acting for child actors and their families.",
    pubDate: "2023-12-10",
    categories: ["Working Actor"],
    featuredImage: "http://static1.squarespace.com/static/616e111657e9bc2d5ed77edc/t/666a39361938cf0e00430458/1718237501232/IMG_1296.png?format=1500w",
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
            className="h-full flex flex-col overflow-hidden bg-cream border-cream hover:shadow-tomato-red/10"
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
                    className="bg-retro-blue/90 text-cream text-xs px-2 py-1"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            <CardContent className="flex-1 flex flex-col p-6">
              {/* Title */}
              <CardTitle className="text-lg font-semibold text-charcoal mb-3 line-clamp-2">
                {post.title}
              </CardTitle>

              {/* Description */}
              <p className="text-charcoal/70 text-sm mb-4 flex-1 line-clamp-3">
                {post.description}
              </p>

              {/* Author and Date */}
              <div className="flex items-center justify-between text-xs text-charcoal/60 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-retro-blue rounded-full flex items-center justify-center">
                    <span className="text-cream text-xs font-bold">C</span>
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
                className="w-full border-retro-blue text-retro-blue hover:bg-retro-blue hover:text-cream"
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
