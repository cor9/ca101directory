"use client";

import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Youtube, 
  ExternalLink,
  Music, // For TikTok since lucide doesn't have TikTok icon
  PenTool // For Blog
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Listing } from "@/data/listings";

interface SocialMediaIconsProps {
  listing: Listing;
  className?: string;
  iconSize?: number;
  showLabels?: boolean;
}

interface SocialLinkProps {
  url: string;
  icon: React.ReactNode;
  label: string;
  color: string;
  className?: string;
}

const SocialLink = ({ url, icon, label, color, className }: SocialLinkProps) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className={cn(
      "inline-flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-md",
      color,
      className
    )}
    title={`Visit ${label}`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </a>
);

const SocialMediaIcons = ({ 
  listing, 
  className = "",
  iconSize = 20,
  showLabels = true 
}: SocialMediaIconsProps) => {
  // Only show for paid tiers: Pro, Premium, Founding Pro, or Comped treated as Pro
  const plan = (listing.plan || '').toLowerCase();
  const isPaidTier =
    listing.comped === true ||
    plan.includes('pro') ||
    plan.includes('premium');
  if (!isPaidTier) return null;

  const socialLinks = [];

  // Facebook
  if (listing.facebook_url) {
    socialLinks.push({
      url: listing.facebook_url,
      icon: <Facebook size={iconSize} />,
      label: 'Facebook',
      color: 'bg-blue-600 hover:bg-blue-700 text-white'
    });
  }

  // Instagram  
  if (listing.instagram_url) {
    socialLinks.push({
      url: listing.instagram_url,
      icon: <Instagram size={iconSize} />,
      label: 'Instagram',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
    });
  }

  // TikTok (using Music icon as substitute)
  if (listing.tiktok_url) {
    socialLinks.push({
      url: listing.tiktok_url,
      icon: <Music size={iconSize} />,
      label: 'TikTok',
      color: 'bg-black hover:bg-gray-800 text-white'
    });
  }

  // YouTube
  if (listing.youtube_url) {
    socialLinks.push({
      url: listing.youtube_url,
      icon: <Youtube size={iconSize} />,
      label: 'YouTube',
      color: 'bg-red-600 hover:bg-red-700 text-white'
    });
  }

  // LinkedIn
  if (listing.linkedin_url) {
    socialLinks.push({
      url: listing.linkedin_url,
      icon: <Linkedin size={iconSize} />,
      label: 'LinkedIn',
      color: 'bg-blue-700 hover:bg-blue-800 text-white'
    });
  }

  // Blog
  if (listing.blog_url) {
    socialLinks.push({
      url: listing.blog_url,
      icon: <PenTool size={iconSize} />,
      label: 'Blog',
      color: 'bg-green-600 hover:bg-green-700 text-white'
    });
  }

  // Custom Link
  if (listing.custom_link_url && listing.custom_link_name) {
    socialLinks.push({
      url: listing.custom_link_url,
      icon: <ExternalLink size={iconSize} />,
      label: listing.custom_link_name,
      color: 'bg-gray-600 hover:bg-gray-700 text-white'
    });
  }

  // Don't render if no social links
  if (socialLinks.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <h4 className="text-sm font-semibold text-paper uppercase tracking-wider">
        Connect With Us
      </h4>
      <div className="flex flex-wrap gap-2">
        {socialLinks.map((link, index) => (
          <SocialLink
            key={index}
            url={link.url}
            icon={link.icon}
            label={showLabels ? link.label : ''}
            color={link.color}
          />
        ))}
      </div>
    </div>
  );
};

export default SocialMediaIcons;
