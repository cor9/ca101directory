import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getUserFavorites,
  isListingFavorited,
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
} from "@/data/favorites";
import { supabase } from "@/lib/supabase";

// Mock the supabase module
vi.mock("@/lib/supabase");

describe("Favorites Functionality", () => {
  const mockUserId = "user-123";
  const mockListingId = "listing-456";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getUserFavorites", () => {
    it("should fetch favorites for a user", async () => {
      const mockFavorites = [
        {
          id: "fav-1",
          user_id: mockUserId,
          listing_id: "listing-1",
          created_at: "2024-01-01T00:00:00Z",
          listing: {
            id: "listing-1",
            slug: "test-listing",
            listing_name: "Test Listing",
            what_you_offer: "Test service",
          },
        },
      ];

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockFavorites, error: null }),
      } as any);

      const favorites = await getUserFavorites(mockUserId);

      expect(favorites).toEqual(mockFavorites);
      expect(supabase.from).toHaveBeenCalledWith("favorites");
    });

    it("should return empty array when table doesn't exist", async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: null,
          error: { code: "PGRST205" },
        }),
      } as any);

      const favorites = await getUserFavorites(mockUserId);

      expect(favorites).toEqual([]);
    });

    it("should return empty array on error", async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: null,
          error: { code: "UNKNOWN_ERROR" },
        }),
      } as any);

      const favorites = await getUserFavorites(mockUserId);

      expect(favorites).toEqual([]);
    });
  });

  describe("isListingFavorited", () => {
    it("should return true when listing is favorited", async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { id: "fav-1" },
          error: null,
        }),
      } as any);

      const result = await isListingFavorited(mockUserId, mockListingId);

      expect(result).toBe(true);
    });

    it("should return false when listing is not favorited", async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { code: "PGRST116" }, // Not found error
        }),
      } as any);

      const result = await isListingFavorited(mockUserId, mockListingId);

      expect(result).toBe(false);
    });

    it("should return false when table doesn't exist", async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { code: "PGRST205" },
        }),
      } as any);

      const result = await isListingFavorited(mockUserId, mockListingId);

      expect(result).toBe(false);
    });
  });

  describe("addToFavorites", () => {
    it("should add a listing to favorites", async () => {
      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      } as any);

      await expect(
        addToFavorites(mockUserId, mockListingId)
      ).resolves.toBeUndefined();

      expect(supabase.from).toHaveBeenCalledWith("favorites");
    });

    it("should throw error when table doesn't exist", async () => {
      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn().mockResolvedValue({
          data: null,
          error: { code: "PGRST205" },
        }),
      } as any);

      await expect(addToFavorites(mockUserId, mockListingId)).rejects.toThrow(
        "Favorites feature is not available yet"
      );
    });

    it("should throw error on database error", async () => {
      const mockError = { code: "UNKNOWN_ERROR", message: "Database error" };
      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      } as any);

      await expect(
        addToFavorites(mockUserId, mockListingId)
      ).rejects.toThrow();
    });
  });

  describe("removeFromFavorites", () => {
    it("should remove a listing from favorites", async () => {
      const eqMock = vi.fn().mockResolvedValue({
        data: null,
        error: null,
      });
      vi.mocked(supabase.from).mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: eqMock,
          }),
        }),
      } as any);

      await expect(
        removeFromFavorites(mockUserId, mockListingId)
      ).resolves.toBeUndefined();

      expect(supabase.from).toHaveBeenCalledWith("favorites");
    });

    it("should throw error when table doesn't exist", async () => {
      const eqMock = vi.fn().mockResolvedValue({
        data: null,
        error: { code: "PGRST205" },
      });
      vi.mocked(supabase.from).mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: eqMock,
          }),
        }),
      } as any);

      await expect(
        removeFromFavorites(mockUserId, mockListingId)
      ).rejects.toThrow("Favorites feature is not available yet");
    });
  });

  describe("toggleFavorite", () => {
    it("should add favorite when not favorited", async () => {
      // First call to check if favorited (returns false)
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { code: "PGRST116" },
        }),
      } as any);

      // Second call to add favorite
      vi.mocked(supabase.from).mockReturnValueOnce({
        insert: vi.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      } as any);

      const result = await toggleFavorite(mockUserId, mockListingId);

      expect(result).toBe(true);
    });

    it("should remove favorite when already favorited", async () => {
      // First call to check if favorited (returns true)
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { id: "fav-1" },
          error: null,
        }),
      } as any);

      // Second call to remove favorite
      const eqMock = vi.fn().mockResolvedValue({
        data: null,
        error: null,
      });
      vi.mocked(supabase.from).mockReturnValueOnce({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: eqMock,
          }),
        }),
      } as any);

      const result = await toggleFavorite(mockUserId, mockListingId);

      expect(result).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty user ID", async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      } as any);

      const favorites = await getUserFavorites("");

      expect(favorites).toEqual([]);
    });

    it("should handle invalid listing ID when adding", async () => {
      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn().mockResolvedValue({
          data: null,
          error: { code: "FOREIGN_KEY_VIOLATION" },
        }),
      } as any);

      await expect(addToFavorites(mockUserId, "invalid-id")).rejects.toThrow();
    });
  });
});
