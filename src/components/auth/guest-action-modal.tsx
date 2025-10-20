"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Heart, Star } from "lucide-react";
import Link from "next/link";

interface GuestActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: "favorite" | "review";
  listingName?: string;
}

export function GuestActionModal({
  isOpen,
  onClose,
  action,
  listingName,
}: GuestActionModalProps) {
  const getActionText = () => {
    if (action === "favorite") {
      return {
        title: "Save This Vendor",
        description:
          "Create a free parent account to save vendors and write reviews.",
        icon: <Heart className="h-6 w-6 text-red-500" />,
      };
    }
    return {
      title: "Write a Review",
      description:
        "Create a free parent account to save vendors and write reviews.",
      icon: <Star className="h-6 w-6 text-yellow-500" />,
    };
  };

  const { title, description, icon } = getActionText();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {icon}
            <DialogTitle className="text-xl">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-4">
          <Button asChild className="w-full" size="lg">
            <Link href="/auth/register?role=parent">Sign Up</Link>
          </Button>

          <Button asChild variant="outline" className="w-full" size="lg">
            <Link href="/auth/login">Log In</Link>
          </Button>
        </div>

        <p className="text-sm text-paper text-center pt-2">
          Free to join • No credit card required
        </p>
      </DialogContent>
    </Dialog>
  );
}
