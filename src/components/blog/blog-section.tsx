"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ExternalLinkIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface BlogPost {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  categories?: string[];
}

export function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        // Use a CORS proxy to fetch the RSS feed
        const response = await fetch(
          `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
            "https://childactor101.com/101-blog/feed/"
          )}`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch blog posts");
        }
        
        const data = await response.json();
        
        if (data.status === "ok" && data.items) {
          // Take the first 3 posts as featured posts
          const featuredPosts = data.items.slice(0, 3).map((item: {
            title: string;
            link: string;
            description?: string;
            pubDate: string;
            categories?: string[];
          }) => ({
            title: item.title,
            link: item.link,
            description: `${item.description?.replace(/<[^>]*>/g, "").substring(0, 150)}...`,
            pubDate: item.pubDate,
            categories: item.categories || [],
          }));
          
          setPosts(featuredPosts);
        } else {
          throw new Error("Invalid RSS feed data");
        }
      } catch (err) {
        console.error("Error fetching blog posts:", err);
        setError("Failed to load blog posts");
        // Set dummy data as fallback
        setPosts([
          {
            title: "How to Prepare Your Child for Their First Audition",
            link: "https://childactor101.com/101-blog/prepare-child-first-audition/",
            description: "Essential tips and strategies to help your child feel confident and prepared for their first acting audition...",
            pubDate: new Date().toISOString(),
            categories: ["Auditions", "Tips"],
          },
          {
            title: "Understanding Child Labor Laws in Entertainment",
            link: "https://childactor101.com/101-blog/child-labor-laws-entertainment/",
            description: "A comprehensive guide to child labor laws, work permits, and legal requirements for young performers...",
            pubDate: new Date(Date.now() - 86400000).toISOString(),
            categories: ["Legal", "Parents"],
          },
          {
            title: "Building Your Child's Acting Portfolio",
            link: "https://childactor101.com/101-blog/building-acting-portfolio/",
            description: "Learn how to create a professional acting portfolio that showcases your child's talent and experience...",
            pubDate: new Date(Date.now() - 172800000).toISOString(),
            categories: ["Portfolio", "Career"],
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  if (loading) {
    return (
      <div className="py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Latest from Our Blog</h2>
          <p className="text-muted-foreground">Loading latest articles...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={`loading-${i}`} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Latest from Our Blog</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Stay updated with the latest tips, industry news, and insights for child actors and their families.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.link} className="h-full flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg line-clamp-2">
                  {post.title}
                </CardTitle>
                <ExternalLinkIcon className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                <span>
                  {new Date(post.pubDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <p className="text-muted-foreground mb-4 flex-1">
                {post.description}
              </p>
              <div className="space-y-3">
                {post.categories && post.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.categories.slice(0, 2).map((category) => (
                      <Badge key={category} variant="secondary" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                )}
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={post.link} target="_blank" rel="noopener noreferrer">
                    Read More
                    <ExternalLinkIcon className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-8">
        <Button asChild variant="outline">
          <Link href="https://childactor101.com/101-blog/" target="_blank" rel="noopener noreferrer">
            View All Blog Posts
            <ExternalLinkIcon className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
