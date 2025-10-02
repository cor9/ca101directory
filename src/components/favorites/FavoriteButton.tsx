"use client";

import { Button } from "@/components/ui/button";
import { GuestActionModal } from "@/components/auth/guest-action-modal";
import { toggleFavorite } from "@/data/favorites";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

interface FavoriteButtonProps {
  listingId: string;
  isFavorited?: boolean;
  onToggle?: (isFavorited: boolean) => void;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
  listingName?: string;
}

export function FavoriteButton({
  listingId,
  isFavorited: initialIsFavorited = false,
  onToggle,
  className,
  size = "default",
  variant = "outline",
  listingName,
}: FavoriteButtonProps) {
  const { data: session } = useSession();
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isLoading, setIsLoading] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);

  const handleToggle = async () => {
    if (!session?.user?.id) {
      // Show modal for guest users
      setShowGuestModal(true);
      return;
    }

    setIsLoading(true);
    try {
      const newIsFavorited = await toggleFavorite(session.user.id, listingId);
      setIsFavorited(newIsFavorited);
      onToggle?.(newIsFavorited);

      toast.success(
        newIsFavorited ? "Added to favorites!" : "Removed from favorites",
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorites");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleToggle}
        disabled={isLoading}
        className={cn(
          "transition-colors",
          isFavorited && "text-red-500 hover:text-red-600",
          className,
        )}
      >
        <Heart className={cn("h-4 w-4", isFavorited && "fill-current")} />
        <span className="sr-only">
          {isFavorited ? "Remove from favorites" : "Add to favorites"}
        </span>
      </Button>

      <GuestActionModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        action="favorite"
        listingName={listingName}
      />
    </>
  );
}
