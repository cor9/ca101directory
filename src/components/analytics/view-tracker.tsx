"use client";

import { useEffect } from "react";

type Props = {
  listingId: string;
};

/**
 * Client component to track listing page views
 * Calls API endpoint to record view in database
 */
export function ViewTracker({ listingId }: Props) {
  useEffect(() => {
    if (!listingId) return;

    // Generate session ID (or use existing from localStorage)
    let sessionId = "";
    if (typeof window !== "undefined") {
      sessionId = localStorage.getItem("session_id") || "";
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem("session_id", sessionId);
      }
    }

    // Track view after a short delay (to avoid bots/bounces)
    const timer = setTimeout(() => {
      fetch("/api/track-view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId,
          sessionId,
        }),
      }).catch((error) => {
        // Silent fail - don't disrupt user experience
        console.error("Failed to track view:", error);
      });
    }, 2000); // 2 second delay

    return () => clearTimeout(timer);
  }, [listingId]);

  // This component renders nothing
  return null;
}
