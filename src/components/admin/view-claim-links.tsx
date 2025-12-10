"use client";

import { adminGetClaimLinks } from "@/actions/admin-get-claim-links";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Copy, Link as LinkIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ViewClaimLinksProps {
  listingId: string;
  listingName: string;
}

export function ViewClaimLinks({
  listingId,
  listingName,
}: ViewClaimLinksProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [links, setLinks] = useState<{
    claimUrl: string;
    upgradeUrl: string;
    manageUrl: string;
    optOutUrl: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleOpen = async () => {
    if (!links) {
      setIsLoading(true);
      const result = await adminGetClaimLinks(listingId);
      setIsLoading(false);
      if (result.success && result.links) {
        setLinks(result.links);
      } else {
        toast.error(result.message || "Failed to get claim links");
        return;
      }
    }
    setIsOpen(true);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          onClick={handleOpen}
          disabled={isLoading}
        >
          <LinkIcon className="w-4 h-4 mr-1" />
          View Links
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Claim & Upgrade Links</DialogTitle>
          <DialogDescription>
            Links for {listingName || "this listing"}
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="py-8 text-center">Loading links...</div>
        ) : links ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="claim-url">Claim URL</Label>
              <div className="flex gap-2">
                <Input
                  id="claim-url"
                  value={links.claimUrl}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(links.claimUrl, "claim")}
                >
                  {copiedField === "claim" ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Primary link for vendors to claim their listing
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="upgrade-url">Upgrade URL</Label>
              <div className="flex gap-2">
                <Input
                  id="upgrade-url"
                  value={links.upgradeUrl}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(links.upgradeUrl, "upgrade")}
                >
                  {copiedField === "upgrade" ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Direct link to upgrade page with UTM tracking
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="manage-url">Manage URL</Label>
              <div className="flex gap-2">
                <Input
                  id="manage-url"
                  value={links.manageUrl}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(links.manageUrl, "manage")}
                >
                  {copiedField === "manage" ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Link to vendor dashboard for managing the listing
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="optout-url">Opt-Out URL</Label>
              <div className="flex gap-2">
                <Input
                  id="optout-url"
                  value={links.optOutUrl}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(links.optOutUrl, "optout")}
                >
                  {copiedField === "optout" ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Link for vendors to remove themselves from the directory
              </p>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No links available
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
