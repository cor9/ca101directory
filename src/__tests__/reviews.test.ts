import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getListingReviews,
  getUserReviews,
  submitReview,
  hasUserReviewed,
  getListingAverageRating,
} from "@/data/reviews";
import { supabase } from "@/lib/supabase";

// Mock the supabase module
vi.mock("@/lib/supabase");

describe("Reviews Functionality", () => {
  const mockUserId = "user-123";
  const mockListingId = "listing-456";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getListingReviews", () => {
    it("should fetch approved reviews for a listing", async () => {
      const mockReviews = [
        {
          id: "review-1",
          listing_id: mockListingId,
          user_id: mockUserId,
          stars: 5,
          text: "Great service!",
          status: "approved",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
      ];

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockReviews, error: null }),
      } as any);

      const reviews = await getListingReviews(mockListingId);

      expect(reviews).toEqual(mockReviews);
      expect(supabase.from).toHaveBeenCalledWith("reviews");
    });

    it("should throw error on database error", async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: null,
          error: { message: "Database error" },
        }),
      } as any);

      await expect(getListingReviews(mockListingId)).rejects.toThrow();
    });
  });

  describe("getUserReviews", () => {
    it("should fetch all reviews by a user", async () => {
      const mockReviews = [
        {
          id: "review-1",
          listing_id: "listing-1",
          user_id: mockUserId,
          stars: 5,
          text: "Great!",
          status: "approved",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          listing: {
            id: "listing-1",
            slug: "test-listing",
            listing_name: "Test Listing",
          },
        },
        {
          id: "review-2",
          listing_id: "listing-2",
          user_id: mockUserId,
          stars: 4,
          text: "Good!",
          status: "pending",
          created_at: "2024-01-02T00:00:00Z",
          updated_at: "2024-01-02T00:00:00Z",
          listing: {
            id: "listing-2",
            slug: "test-listing-2",
            listing_name: "Test Listing 2",
          },
        },
      ];

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockReviews, error: null }),
      } as any);

      const reviews = await getUserReviews(mockUserId);

      expect(reviews).toEqual(mockReviews);
      expect(reviews).toHaveLength(2);
    });

    it("should return empty array when user has no reviews", async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      } as any);

      const reviews = await getUserReviews(mockUserId);

      expect(reviews).toEqual([]);
    });
  });

  describe("submitReview", () => {
    it("should submit a review with pending status", async () => {
      const mockReview = {
        id: "review-1",
        listing_id: mockListingId,
        user_id: mockUserId,
        stars: 5,
        text: "Great service!",
        status: "pending",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      };

      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockReview, error: null }),
      } as any);

      const review = await submitReview(mockListingId, mockUserId, 5, "Great service!");

      expect(review).toEqual(mockReview);
      expect(review.status).toBe("pending");
    });

    it("should validate star rating range (1-5)", async () => {
      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { message: "Invalid star rating" },
        }),
      } as any);

      await expect(
        submitReview(mockListingId, mockUserId, 6, "Invalid stars")
      ).rejects.toThrow();
    });

    it("should handle empty review text", async () => {
      const mockReview = {
        id: "review-1",
        listing_id: mockListingId,
        user_id: mockUserId,
        stars: 5,
        text: "",
        status: "pending",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      };

      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockReview, error: null }),
      } as any);

      const review = await submitReview(mockListingId, mockUserId, 5, "");

      expect(review.text).toBe("");
    });
  });

  describe("hasUserReviewed", () => {
    it("should return true when user has reviewed listing", async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { id: "review-1" },
          error: null,
        }),
      } as any);

      const result = await hasUserReviewed(mockUserId, mockListingId);

      expect(result).toBe(true);
    });

    it("should return false when user has not reviewed listing", async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { code: "PGRST116" }, // Not found
        }),
      } as any);

      const result = await hasUserReviewed(mockUserId, mockListingId);

      expect(result).toBe(false);
    });
  });

  describe("getListingAverageRating", () => {
    it("should calculate average rating from approved reviews", async () => {
      const mockReviews = [
        { stars: 5 },
        { stars: 4 },
        { stars: 5 },
      ];

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
      } as any);

      // Mock the second eq call to resolve with data
      vi.mocked(supabase.from().select().eq).mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: mockReviews, error: null }),
      } as any);

      const result = await getListingAverageRating(mockListingId);

      expect(result.average).toBeCloseTo(4.67, 1); // Use 1 decimal place for precision
      expect(result.count).toBe(3);
    });

    it("should return 0 when no reviews exist", async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
      } as any);

      vi.mocked(supabase.from().select().eq).mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
      } as any);

      const result = await getListingAverageRating(mockListingId);

      expect(result.average).toBe(0);
      expect(result.count).toBe(0);
    });

    it("should handle all 5-star reviews", async () => {
      const mockReviews = [
        { stars: 5 },
        { stars: 5 },
        { stars: 5 },
      ];

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
      } as any);

      vi.mocked(supabase.from().select().eq).mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: mockReviews, error: null }),
      } as any);

      const result = await getListingAverageRating(mockListingId);

      expect(result.average).toBe(5);
      expect(result.count).toBe(3);
    });
  });

  describe("Review Status Management", () => {
    it("should only return approved reviews for public display", async () => {
      const approvedReviews = [
        {
          id: "review-1",
          status: "approved",
          stars: 5,
          text: "Great!",
        },
      ];

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: approvedReviews, error: null }),
      } as any);

      const reviews = await getListingReviews(mockListingId);

      expect(reviews.every((r) => r.status === "approved")).toBe(true);
    });

    it("should include all statuses for user's own reviews", async () => {
      const userReviews = [
        { id: "review-1", status: "approved" },
        { id: "review-2", status: "pending" },
        { id: "review-3", status: "rejected" },
      ];

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: userReviews, error: null }),
      } as any);

      const reviews = await getUserReviews(mockUserId);

      expect(reviews).toHaveLength(3);
      expect(reviews.some((r) => r.status === "pending")).toBe(true);
      expect(reviews.some((r) => r.status === "rejected")).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("should handle extremely long review text", async () => {
      const longText = "a".repeat(10000);
      const mockReview = {
        id: "review-1",
        listing_id: mockListingId,
        user_id: mockUserId,
        stars: 5,
        text: longText,
        status: "pending",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      };

      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockReview, error: null }),
      } as any);

      const review = await submitReview(mockListingId, mockUserId, 5, longText);

      expect(review.text).toHaveLength(10000);
    });

    it("should handle special characters in review text", async () => {
      const specialText = "Great! <script>alert('xss')</script> 😊 🎭";
      const mockReview = {
        id: "review-1",
        listing_id: mockListingId,
        user_id: mockUserId,
        stars: 5,
        text: specialText,
        status: "pending",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      };

      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockReview, error: null }),
      } as any);

      const review = await submitReview(mockListingId, mockUserId, 5, specialText);

      expect(review.text).toBe(specialText);
    });
  });
});
