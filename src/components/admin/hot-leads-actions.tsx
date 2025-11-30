"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Mail, ExternalLink, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Props = {
  listingId: string;
  listingName: string;
  email: string;
  slug: string;
  viewCount: number;
};

export function HotLeadActions({
  listingId,
  listingName,
  email,
  slug,
  viewCount,
}: Props) {
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateMockup = async (tier: "standard" | "pro", sendEmail: boolean = false) => {
    setGenerating(true);

    try {
      const response = await fetch("/api/admin/generate-mockup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId,
          tier,
          sendEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate mockup");
      }

      toast({
        title: sendEmail ? "Mockup sent!" : "Mockup generated!",
        description: sendEmail
          ? `Sent ${tier === "pro" ? "Pro" : "Standard"} mockup email to ${email}`
          : `${tier === "pro" ? "Pro" : "Standard"} mockup ready. Check console for details.`,
      });

      if (!sendEmail) {
        // Open mockup in new window or download
        console.log("Mockup data:", data.mockup);
        // TODO: Show mockup preview modal
      }
    } catch (error) {
      console.error("Error generating mockup:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate mockup",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const manualEmailTemplate = `Hi,

I noticed your listing for ${listingName} on Child Actor 101 — and saw you've gotten ${viewCount} parent views in the last week!

That tells me parents are actively searching for your services and finding you.

Quick question: What kind of parents are your best fit?
(Age range? Experience level? Specific goals?)

I'm working with a small group of founding vendors to optimize their listings before we open the floodgates, and I'd love to help tune yours up.

No catch — just want to make sure you're set up to capture those parent inquiries.

Let me know if you're open to a quick listing review?

Best,
Corey
Child Actor 101

P.S. Your listing has gotten more views than 80% of vendors in your category. You're sitting on gold — let's not waste it.`;

  return (
    <div className="flex items-center gap-2 justify-end">
      {/* Generate Mockup Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="default"
            disabled={generating}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {generating ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3 mr-1" />
                Generate Mockup
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Auto-Generate & Send</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => handleGenerateMockup("pro", true)}
            disabled={generating}
          >
            <Sparkles className="h-4 w-4 mr-2 text-purple-600" />
            Pro Mockup + Email
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleGenerateMockup("standard", true)}
            disabled={generating}
          >
            <Sparkles className="h-4 w-4 mr-2 text-blue-600" />
            Standard Mockup + Email
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Generate Only (No Email)</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => handleGenerateMockup("pro", false)}
            disabled={generating}
          >
            Pro Preview
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleGenerateMockup("standard", false)}
            disabled={generating}
          >
            Standard Preview
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Manual Email Button */}
      <Button size="sm" variant="outline" asChild>
        <a
          href={`mailto:${email}?subject=${encodeURIComponent(
            `Your ${listingName} listing - ${viewCount} views this week!`
          )}&body=${encodeURIComponent(manualEmailTemplate)}`}
        >
          <Mail className="h-3 w-3 mr-1" />
          Manual Email
        </a>
      </Button>

      {/* View Listing Button */}
      <Button size="sm" variant="ghost" asChild>
        <a href={`/listing/${slug}`} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="h-3 w-3" />
        </a>
      </Button>
    </div>
  );
}
