"use client";

import { useState, useTransition } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, Loader2, Mail, MoreHorizontal } from "lucide-react";

interface HotLeadActionsProps {
  listingId: string;
  listingName: string;
  email: string;
  slug: string;
  viewCount: number;
}

export function HotLeadActions({ listingId, listingName, email, slug, viewCount }: HotLeadActionsProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const triggerMockup = (tier: "standard" | "pro", sendEmail: boolean) => {
    if (sendEmail && !email) {
      toast({
        title: "No email on file",
        description: "This listing is missing an email address.",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/admin/generate-mockup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listingId, tier, sendEmail }),
        });

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        const data = await response.json();
        const action = sendEmail ? "sent" : "generated";

        toast({
          title: `Mockup ${action}`,
          description: sendEmail
            ? `${tier === "pro" ? "Pro" : "Standard"} mockup emailed to ${email}.`
            : `${tier === "pro" ? "Pro" : "Standard"} mockup generated successfully.`,
        });

        if (!sendEmail && data?.mockup) {
          console.log("Mockup preview", data.mockup);
        }
      } catch (error) {
        console.error("Failed to generate mockup", error);
        toast({
          title: "Unable to generate mockup",
          description: "Please try again or email manually.",
          variant: "destructive",
        });
      }
    });
  };

  const mailtoHref = `mailto:${email}?subject=${encodeURIComponent(
    `${listingName} listing — ${viewCount} views this week`,
  )}&body=${encodeURIComponent(
    `Hi,

Your listing "${listingName}" had ${viewCount} views this week. Parents are finding you, but you're still on the free plan.

Want me to publish a polished mockup for you? I can turn it on in one click.

- Corey
Child Actor 101 Directory`,
  )}`;

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Generate & Send</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => triggerMockup("pro", true)}>
          <Mail className="mr-2 h-4 w-4" /> Pro mockup + email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => triggerMockup("standard", true)}>
          <Mail className="mr-2 h-4 w-4" /> Standard mockup + email
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Preview only</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => triggerMockup("pro", false)}>
          <ExternalLink className="mr-2 h-4 w-4" /> Pro preview
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => triggerMockup("standard", false)}>
          <ExternalLink className="mr-2 h-4 w-4" /> Standard preview
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href={mailtoHref} onClick={() => setIsMenuOpen(false)}>
            <Mail className="mr-2 h-4 w-4" /> Manual email
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={`/listing/${slug}`} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" /> View listing
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
