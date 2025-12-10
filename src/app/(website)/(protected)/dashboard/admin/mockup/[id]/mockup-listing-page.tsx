"use client";

import { useState, useMemo } from "react";
import { Gallery } from "@/components/listing/gallery";
import { ListingContactSection } from "@/components/listing/listing-contact-section";
import { ListingDetailsSection } from "@/components/listing/listing-details-section";
import { ListingHero } from "@/components/listing/listing-hero";
import type { DisplayCategory } from "@/components/listing/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { Listing } from "@/data/listings";
import { getCategoryIconUrl } from "@/lib/image-urls";
import {
  AlertTriangle,
  Sparkles,
  Image as ImageIcon,
  FileText,
  Award,
  Star,
  X,
  Settings,
} from "lucide-react";
import Link from "next/link";

// Placeholder gallery images for headshot photographers
const PLACEHOLDER_GALLERY_HEADSHOTS = [
  "/mockups/headshot/placeholder-1.jpg",
  "/mockups/headshot/placeholder-2.jpg",
  "/mockups/headshot/placeholder-3.jpg",
  "/mockups/headshot/placeholder-4.jpg",
];

// Generic placeholder description for missing descriptions
const PLACEHOLDER_DESCRIPTION =
  "Providing professional headshot photography for young performers focusing on natural expression and confidence.";

// Extended bio placeholder for mockup
const EXTENDED_BIO_PLACEHOLDER = `Our studio specializes in capturing authentic moments that showcase each performer's unique personality. We work closely with families to create a comfortable, professional environment where young actors can shine.

With years of experience in the entertainment industry, we understand what casting directors are looking for and help performers present their best selves through carefully crafted imagery.`;

// Mock badges for Pro tier preview
const MOCKUP_BADGES = ["Pro Tier Preview", "Example Founding Vendor Badge"];

interface MockupListingPageProps {
  dbListing: Listing;
}

interface MockupControls {
  injectPlaceholderGallery: boolean;
  addExtendedBio: boolean;
  showProBadges: boolean;
  enableFeaturedHighlight: boolean;
}

export function MockupListingPage({ dbListing }: MockupListingPageProps) {
  const [controls, setControls] = useState<MockupControls>({
    injectPlaceholderGallery: !dbListing.gallery || dbListing.gallery === "YES",
    addExtendedBio: !dbListing.what_you_offer,
    showProBadges: true,
    enableFeaturedHighlight: true,
  });

  const [showControlsPanel, setShowControlsPanel] = useState(true);

  // Build the mocked listing object in-memory
  const mockedListing = useMemo(() => {
    const mock: Listing & { mock_badges?: string[]; is_mockup?: boolean } = {
      ...dbListing,
      plan: "pro",
      featured: controls.enableFeaturedHighlight,
      is_mockup: true,
    };

    // Auto-fill description if missing
    if (!mock.what_you_offer || mock.what_you_offer.trim() === "") {
      mock.what_you_offer = PLACEHOLDER_DESCRIPTION;
    }

    // Add extended bio if enabled
    if (controls.addExtendedBio) {
      const existingDescription = mock.what_you_offer || "";
      if (!existingDescription.includes(EXTENDED_BIO_PLACEHOLDER)) {
        mock.what_you_offer = `${existingDescription}\n\n${EXTENDED_BIO_PLACEHOLDER}`;
      }
    }

    // Inject placeholder gallery if enabled and no real gallery
    if (controls.injectPlaceholderGallery) {
      const hasRealGallery =
        dbListing.gallery &&
        dbListing.gallery !== "YES" &&
        dbListing.gallery.trim() !== "";

      if (!hasRealGallery) {
        // Determine category for placeholder selection
        const isHeadshotPhotographer = (dbListing.categories || []).some((cat) =>
          cat.toLowerCase().includes("headshot")
        );

        // Use headshot placeholders for headshot photographers
        if (isHeadshotPhotographer) {
          mock.gallery = JSON.stringify(PLACEHOLDER_GALLERY_HEADSHOTS);
        } else {
          // Generic placeholders for other categories
          mock.gallery = JSON.stringify(PLACEHOLDER_GALLERY_HEADSHOTS);
        }
        mock.has_gallery = true;
      }
    }

    // Add mock badges if enabled
    if (controls.showProBadges) {
      mock.mock_badges = MOCKUP_BADGES;
      mock.badge_approved = true;
    }

    return mock;
  }, [dbListing, controls]);

  // Build display categories
  const displayCategories: DisplayCategory[] = useMemo(() => {
    const localIconMap: Record<string, string> = {
      "Acting Classes & Coaches": "/categories/masks.png",
      "Headshot Photographers": "/categories/camera.png",
      "Self-Tape Studios": "/categories/selftape.png",
      "Demo Reel Creators": "/categories/reelcreator.png",
      "Vocal Coaches": "/categories/singer.png",
      "Talent Managers": "/categories/rep.png",
      "Casting Workshops": "/categories/handwriting.png",
      "Reels Editors": "/categories/reel_editor.png",
      "Social Media Consultants": "/categories/socialmedia.png",
      "Acting Camps": "/categories/theatre.png",
      "Acting Schools": "/categories/masks.png",
    };

    const normalizeCategory = (value: string) =>
      value.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

    const categories: DisplayCategory[] = [];
    const seen = new Set<string>();

    for (const cat of dbListing.categories || []) {
      const key = normalizeCategory(cat);
      if (seen.has(key)) continue;
      seen.add(key);

      const localIcon = Object.entries(localIconMap).find(
        ([name]) => normalizeCategory(name) === key
      )?.[1];

      const iconUrl =
        localIcon ||
        getCategoryIconUrl(`${cat.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.png`);

      categories.push({
        key,
        displayName: cat,
        iconUrl,
      });
    }

    return categories;
  }, [dbListing.categories]);

  const updateControl = <K extends keyof MockupControls>(
    key: K,
    value: MockupControls[K]
  ) => {
    setControls((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="relative">
      {/* Mockup Banner - Fixed at top */}
      <div className="mb-6 rounded-lg border-2 border-amber-500 bg-amber-50 p-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0" />
          <div>
            <h2 className="font-bold text-amber-800 text-lg">
              PRO LISTING MOCKUP
            </h2>
            <p className="text-sm text-amber-700">
              This version is NOT live and NOT visible to the public. All changes
              are in-memory only.
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-4 text-sm">
          <Link
            href={`/listing/${dbListing.slug || dbListing.id}`}
            className="text-amber-700 hover:text-amber-900 underline"
          >
            View Live Listing →
          </Link>
          <Link
            href="/dashboard/admin/listings"
            className="text-amber-700 hover:text-amber-900 underline"
          >
            Back to Listings →
          </Link>
        </div>
      </div>

      {/* Mock Badges Display */}
      {controls.showProBadges && mockedListing.mock_badges && (
        <div className="mb-6 flex flex-wrap gap-2">
          {mockedListing.mock_badges.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-sm"
            >
              <Sparkles className="h-3 w-3" />
              {badge}
            </span>
          ))}
        </div>
      )}

      {/* Floating Controls Panel */}
      {showControlsPanel && (
        <div className="fixed right-4 top-32 z-50 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-gray-500" />
              <h3 className="font-semibold text-gray-900">Mockup Controls</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowControlsPanel(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Inject Placeholder Gallery */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <ImageIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <Label htmlFor="gallery" className="text-sm font-medium">
                    Placeholder Gallery
                  </Label>
                  <p className="text-xs text-gray-500">
                    Show sample headshot images
                  </p>
                </div>
              </div>
              <Switch
                id="gallery"
                checked={controls.injectPlaceholderGallery}
                onCheckedChange={(v) => updateControl("injectPlaceholderGallery", v)}
              />
            </div>

            {/* Add Extended Bio */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <Label htmlFor="bio" className="text-sm font-medium">
                    Extended Bio
                  </Label>
                  <p className="text-xs text-gray-500">
                    Add professional bio text
                  </p>
                </div>
              </div>
              <Switch
                id="bio"
                checked={controls.addExtendedBio}
                onCheckedChange={(v) => updateControl("addExtendedBio", v)}
              />
            </div>

            {/* Show Pro Badges */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <Award className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <Label htmlFor="badges" className="text-sm font-medium">
                    Pro Badges
                  </Label>
                  <p className="text-xs text-gray-500">
                    Display mockup tier badges
                  </p>
                </div>
              </div>
              <Switch
                id="badges"
                checked={controls.showProBadges}
                onCheckedChange={(v) => updateControl("showProBadges", v)}
              />
            </div>

            {/* Enable Featured Highlight */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <Star className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <Label htmlFor="featured" className="text-sm font-medium">
                    Featured Highlight
                  </Label>
                  <p className="text-xs text-gray-500">
                    Show as featured listing
                  </p>
                </div>
              </div>
              <Switch
                id="featured"
                checked={controls.enableFeaturedHighlight}
                onCheckedChange={(v) => updateControl("enableFeaturedHighlight", v)}
              />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              No database writes - preview only
            </p>
          </div>
        </div>
      )}

      {/* Toggle button when panel is closed */}
      {!showControlsPanel && (
        <button
          type="button"
          onClick={() => setShowControlsPanel(true)}
          className="fixed right-4 top-32 z-50 flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-lg border border-gray-200 hover:bg-gray-50"
        >
          <Settings className="h-4 w-4" />
          Controls
        </button>
      )}

      {/* Render the listing using same components as public listing page */}
      <div className="listing-page">
        <ListingHero
          listing={mockedListing}
          averageRating={{ average: 4.8, count: 12 }} // Mock rating for preview
          isOwner={false}
          showFavorite={false} // Disabled for mockup
          showReviews={false} // Disabled for mockup
          categories={displayCategories}
        />

        <div className="listing-layout">
          <div className="listing-layout__main">
            <ListingDetailsSection
              listing={mockedListing}
              hasPremiumAccess={true} // Always show premium content in mockup
            />
            {/* Reviews section disabled for mockup */}
          </div>
          <aside className="listing-layout__aside">
            <Gallery listing={mockedListing} />
            <ListingContactSection
              listing={mockedListing}
              showClaimCallout={false} // Disabled for mockup
              showUpgradePrompt={false} // Disabled for mockup
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
