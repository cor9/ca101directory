"use client";

import { Gallery } from "@/components/listing/gallery";
import { ListingContactSection } from "@/components/listing/listing-contact-section";
import { ListingDetailsSection } from "@/components/listing/listing-details-section";
import { ListingHero } from "@/components/listing/listing-hero";
import type { DisplayCategory } from "@/components/listing/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { Listing } from "@/data/listings";
import { getCategoryIconUrl } from "@/lib/image-urls";
import {
  AlertTriangle,
  Award,
  ChevronDown,
  ChevronUp,
  FileText,
  Globe,
  Image as ImageIcon,
  Link as LinkIcon,
  Mail,
  MapPin,
  Phone,
  Plus,
  Settings,
  Sparkles,
  Star,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

// Mock badges for Pro tier preview
const MOCKUP_BADGES = ["Pro Tier Preview", "Example Founding Vendor Badge"];

interface MockupListingPageProps {
  dbListing: Listing;
}

interface MockupControls {
  showProBadges: boolean;
  enableFeaturedHighlight: boolean;
  show101Approved: boolean;
}

interface GalleryImage {
  url: string;
  caption?: string;
  isPlaceholder?: boolean;
}

interface MockupEdits {
  listing_name: string;
  what_you_offer: string;
  why_is_it_unique: string;
  format: string;
  extras_notes: string;
  profile_image: string | null;
  gallery: GalleryImage[];
  video_url: string;
  website: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  facebook_url: string;
  instagram_url: string;
  tiktok_url: string;
  youtube_url: string;
  linkedin_url: string;
  custom_link_url: string;
  custom_link_name: string;
}

export function MockupListingPage({ dbListing }: MockupListingPageProps) {
  // Parse existing gallery
  const parseExistingGallery = (): GalleryImage[] => {
    if (!dbListing.gallery || dbListing.gallery === "YES") return [];
    try {
      const parsed = JSON.parse(dbListing.gallery);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => {
          if (typeof item === "string") return { url: item };
          return { url: item.url || item.src || "", caption: item.caption };
        });
      }
    } catch {
      return [];
    }
    return [];
  };

  const [controls, setControls] = useState<MockupControls>({
    showProBadges: true,
    enableFeaturedHighlight: true,
    show101Approved: dbListing.badge_approved || false,
  });

  const [edits, setEdits] = useState<MockupEdits>({
    listing_name: dbListing.listing_name || "",
    what_you_offer: dbListing.what_you_offer || "",
    why_is_it_unique: dbListing.why_is_it_unique || "",
    format: dbListing.format || "",
    extras_notes: dbListing.extras_notes || "",
    profile_image: dbListing.profile_image || null,
    gallery: parseExistingGallery(),
    video_url: "",
    website: dbListing.website || "",
    email: dbListing.email || "",
    phone: dbListing.phone || "",
    city: dbListing.city || "",
    state: dbListing.state || "",
    facebook_url: dbListing.facebook_url || "",
    instagram_url: dbListing.instagram_url || "",
    tiktok_url: dbListing.tiktok_url || "",
    youtube_url: dbListing.youtube_url || "",
    linkedin_url: dbListing.linkedin_url || "",
    custom_link_url: dbListing.custom_link_url || "",
    custom_link_name: dbListing.custom_link_name || "",
  });

  const [showControlsPanel, setShowControlsPanel] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    basicInfo: true,
    description: false,
    gallery: false,
    contact: false,
    social: false,
  });

  // Handle image upload (converts to base64 data URL for preview)
  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "gallery") => {
      const files = e.target.files;
      if (!files) return;

      for (const file of Array.from(files)) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          if (type === "logo") {
            setEdits((prev) => ({ ...prev, profile_image: dataUrl }));
          } else {
            setEdits((prev) => ({
              ...prev,
              gallery: [...prev.gallery, { url: dataUrl }],
            }));
          }
        };
        reader.readAsDataURL(file);
      }

      // Reset input
      e.target.value = "";
    },
    [],
  );

  const removeGalleryImage = (index: number) => {
    setEdits((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  const updateGalleryCaption = (index: number, caption: string) => {
    setEdits((prev) => ({
      ...prev,
      gallery: prev.gallery.map((img, i) =>
        i === index ? { ...img, caption } : img,
      ),
    }));
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Build the mocked listing object in-memory
  const mockedListing = useMemo(() => {
    const mock: Listing & { mock_badges?: string[]; is_mockup?: boolean } = {
      ...dbListing,
      // Override with edits
      listing_name: edits.listing_name,
      what_you_offer: edits.what_you_offer,
      who_is_it_for: edits.who_is_it_for,
      why_is_it_unique: edits.why_is_it_unique,
      format: edits.format,
      extras_notes: edits.extras_notes,
      profile_image: edits.profile_image,
      website: edits.website,
      email: edits.email,
      phone: edits.phone,
      city: edits.city,
      state: edits.state,
      facebook_url: edits.facebook_url,
      instagram_url: edits.instagram_url,
      tiktok_url: edits.tiktok_url,
      youtube_url: edits.youtube_url,
      linkedin_url: edits.linkedin_url,
      custom_link_url: edits.custom_link_url,
      custom_link_name: edits.custom_link_name,
      // Pro features
      plan: "pro",
      featured: controls.enableFeaturedHighlight,
      badge_approved: controls.show101Approved,
      is_mockup: true,
      // Gallery as JSON string
      gallery: edits.gallery.length > 0 ? JSON.stringify(edits.gallery) : null,
      has_gallery: edits.gallery.length > 0,
    };

    // Add mock badges if enabled
    if (controls.showProBadges) {
      mock.mock_badges = MOCKUP_BADGES;
    }

    return mock;
  }, [dbListing, edits, controls]);

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
        ([name]) => normalizeCategory(name) === key,
      )?.[1];

      const iconUrl =
        localIcon ||
        getCategoryIconUrl(
          `${cat.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.png`,
        );

      categories.push({
        key,
        displayName: cat,
        iconUrl,
      });
    }

    return categories;
  }, [dbListing.categories]);

  const updateEdit = <K extends keyof MockupEdits>(
    key: K,
    value: MockupEdits[K],
  ) => {
    setEdits((prev) => ({ ...prev, [key]: value }));
  };

  const updateControl = <K extends keyof MockupControls>(
    key: K,
    value: MockupControls[K],
  ) => {
    setControls((prev) => ({ ...prev, [key]: value }));
  };

  const SectionHeader = ({
    title,
    icon: Icon,
    section,
  }: {
    title: string;
    icon: React.ElementType;
    section: keyof typeof expandedSections;
  }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="flex w-full items-center justify-between py-2 text-left"
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-purple-600" />
        <span className="font-semibold text-gray-900">{title}</span>
      </div>
      {expandedSections[section] ? (
        <ChevronUp className="h-4 w-4 text-gray-500" />
      ) : (
        <ChevronDown className="h-4 w-4 text-gray-500" />
      )}
    </button>
  );

  return (
    <div className="relative">
      {/* Mockup Banner */}
      <div className="mb-6 rounded-lg border-2 border-amber-500 bg-amber-50 p-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 flex-shrink-0 text-amber-600" />
          <div>
            <h2 className="text-lg font-bold text-amber-800">
              PRO LISTING MOCKUP EDITOR
            </h2>
            <p className="text-sm text-amber-700">
              Edit all fields below to create a custom mockup. Nothing is saved
              to the database.
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-4 text-sm">
          <Link
            href={`/listing/${dbListing.slug || dbListing.id}`}
            className="text-amber-700 underline hover:text-amber-900"
          >
            View Live Listing →
          </Link>
          <Link
            href="/dashboard/admin/listings"
            className="text-amber-700 underline hover:text-amber-900"
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

      {/* Floating Editor Panel */}
      {showControlsPanel && (
        <div className="fixed right-4 top-24 z-50 max-h-[calc(100vh-120px)] w-80 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Mockup Editor</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowControlsPanel(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-1 p-4">
            {/* Quick Toggles */}
            <div className="mb-4 space-y-3 rounded-lg bg-purple-50 p-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Pro Badges</Label>
                <Switch
                  checked={controls.showProBadges}
                  onCheckedChange={(v) => updateControl("showProBadges", v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Featured</Label>
                <Switch
                  checked={controls.enableFeaturedHighlight}
                  onCheckedChange={(v) =>
                    updateControl("enableFeaturedHighlight", v)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">101 Approved</Label>
                <Switch
                  checked={controls.show101Approved}
                  onCheckedChange={(v) => updateControl("show101Approved", v)}
                />
              </div>
            </div>

            {/* Basic Info Section */}
            <div className="border-b pb-2">
              <SectionHeader
                title="Basic Info"
                icon={FileText}
                section="basicInfo"
              />
              {expandedSections.basicInfo && (
                <div className="mt-3 space-y-3">
                  <div>
                    <Label className="text-xs text-gray-600">
                      Business Name
                    </Label>
                    <Input
                      value={edits.listing_name}
                      onChange={(e) =>
                        updateEdit("listing_name", e.target.value)
                      }
                      placeholder="Business name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Logo</Label>
                    <div className="mt-1 flex items-center gap-2">
                      {edits.profile_image && (
                        <div className="relative h-12 w-12 overflow-hidden rounded-lg border">
                          <Image
                            src={
                              edits.profile_image.startsWith("data:")
                                ? edits.profile_image
                                : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listing-images/${edits.profile_image}`
                            }
                            alt="Logo"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <label className="flex cursor-pointer items-center gap-1 rounded-md border border-dashed px-3 py-2 text-xs text-gray-600 hover:bg-gray-50">
                        <Upload className="h-3 w-3" />
                        Upload Logo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, "logo")}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Description Section */}
            <div className="border-b pb-2">
              <SectionHeader
                title="Description"
                icon={FileText}
                section="description"
              />
              {expandedSections.description && (
                <div className="mt-3 space-y-3">
                  <div>
                    <Label className="text-xs text-gray-600">
                      What You Offer
                    </Label>
                    <Textarea
                      value={edits.what_you_offer}
                      onChange={(e) =>
                        updateEdit("what_you_offer", e.target.value)
                      }
                      placeholder="Describe your services..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">
                      Why Is It Unique
                    </Label>
                    <Textarea
                      value={edits.why_is_it_unique}
                      onChange={(e) =>
                        updateEdit("why_is_it_unique", e.target.value)
                      }
                      placeholder="What makes you different..."
                      rows={2}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Format</Label>
                    <Input
                      value={edits.format}
                      onChange={(e) => updateEdit("format", e.target.value)}
                      placeholder="In-person, Online, Hybrid..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Extra Notes</Label>
                    <Textarea
                      value={edits.extras_notes}
                      onChange={(e) =>
                        updateEdit("extras_notes", e.target.value)
                      }
                      placeholder="Additional information..."
                      rows={2}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Gallery Section */}
            <div className="border-b pb-2">
              <SectionHeader
                title="Gallery & Media"
                icon={ImageIcon}
                section="gallery"
              />
              {expandedSections.gallery && (
                <div className="mt-3 space-y-3">
                  <div>
                    <Label className="text-xs text-gray-600">
                      Gallery Images
                    </Label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {edits.gallery.map((img, idx) => (
                        <div
                          key={`gallery-${img.url.slice(-20)}-${idx}`}
                          className="group relative aspect-square overflow-hidden rounded-lg border"
                        >
                          <Image
                            src={
                              img.url.startsWith("data:") ||
                              img.url.startsWith("http")
                                ? img.url
                                : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listing-images/${img.url}`
                            }
                            alt={`Gallery ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(idx)}
                            className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed text-gray-400 hover:border-purple-400 hover:text-purple-500">
                        <Plus className="h-6 w-6" />
                        <span className="mt-1 text-xs">Add Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, "gallery")}
                        />
                      </label>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">
                      Video URL (YouTube/Vimeo)
                    </Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Video className="h-4 w-4 text-gray-400" />
                      <Input
                        value={edits.video_url}
                        onChange={(e) =>
                          updateEdit("video_url", e.target.value)
                        }
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Section */}
            <div className="border-b pb-2">
              <SectionHeader
                title="Contact Info"
                icon={Phone}
                section="contact"
              />
              {expandedSections.contact && (
                <div className="mt-3 space-y-3">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <Input
                      value={edits.website}
                      onChange={(e) => updateEdit("website", e.target.value)}
                      placeholder="https://yoursite.com"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <Input
                      value={edits.email}
                      onChange={(e) => updateEdit("email", e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <Input
                      value={edits.phone}
                      onChange={(e) => updateEdit("phone", e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <Input
                      value={edits.city}
                      onChange={(e) => updateEdit("city", e.target.value)}
                      placeholder="City"
                      className="w-1/2"
                    />
                    <Input
                      value={edits.state}
                      onChange={(e) => updateEdit("state", e.target.value)}
                      placeholder="State"
                      className="w-1/2"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Social Links Section */}
            <div className="pb-2">
              <SectionHeader
                title="Social Links"
                icon={LinkIcon}
                section="social"
              />
              {expandedSections.social && (
                <div className="mt-3 space-y-2">
                  <Input
                    value={edits.facebook_url}
                    onChange={(e) => updateEdit("facebook_url", e.target.value)}
                    placeholder="Facebook URL"
                  />
                  <Input
                    value={edits.instagram_url}
                    onChange={(e) =>
                      updateEdit("instagram_url", e.target.value)
                    }
                    placeholder="Instagram URL"
                  />
                  <Input
                    value={edits.tiktok_url}
                    onChange={(e) => updateEdit("tiktok_url", e.target.value)}
                    placeholder="TikTok URL"
                  />
                  <Input
                    value={edits.youtube_url}
                    onChange={(e) => updateEdit("youtube_url", e.target.value)}
                    placeholder="YouTube URL"
                  />
                  <Input
                    value={edits.linkedin_url}
                    onChange={(e) => updateEdit("linkedin_url", e.target.value)}
                    placeholder="LinkedIn URL"
                  />
                  <div className="flex gap-2">
                    <Input
                      value={edits.custom_link_name}
                      onChange={(e) =>
                        updateEdit("custom_link_name", e.target.value)
                      }
                      placeholder="Link name"
                      className="w-1/3"
                    />
                    <Input
                      value={edits.custom_link_url}
                      onChange={(e) =>
                        updateEdit("custom_link_url", e.target.value)
                      }
                      placeholder="Custom link URL"
                      className="w-2/3"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="sticky bottom-0 border-t bg-gray-50 p-3">
            <p className="text-center text-xs text-gray-400">
              ⚠️ Changes are preview only — not saved
            </p>
          </div>
        </div>
      )}

      {/* Toggle button when panel is closed */}
      {!showControlsPanel && (
        <button
          type="button"
          onClick={() => setShowControlsPanel(true)}
          className="fixed right-4 top-32 z-50 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-lg hover:bg-gray-50"
        >
          <Settings className="h-4 w-4" />
          Open Editor
        </button>
      )}

      {/* Render the listing using same components as public listing page */}
      <div className="listing-page">
        <ListingHero
          listing={mockedListing}
          averageRating={{ average: 4.8, count: 12 }}
          isOwner={false}
          showFavorite={false}
          showReviews={false}
          categories={displayCategories}
        />

        <div className="listing-layout">
          <div className="listing-layout__main">
            <ListingDetailsSection
              listing={mockedListing}
              hasPremiumAccess={true}
            />
          </div>
          <aside className="listing-layout__aside">
            <Gallery listing={mockedListing} />
            <ListingContactSection
              listing={mockedListing}
              showClaimCallout={false}
              showUpgradePrompt={false}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
