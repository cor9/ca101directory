import { createServerClient } from "@/lib/supabase";
import {
  isFavoritesEnabled,
  isReviewsEnabled,
  isParentDashboardEnabled
} from "@/config/feature-flags";

export default async function DebugParentFeatures() {
  const supabase = createServerClient();

  // Check feature flags
  const flags = {
    parentDashboard: isParentDashboardEnabled(),
    favorites: isFavoritesEnabled(),
    reviews: isReviewsEnabled(),
  };

  // Check if tables exist
  let favoritesTableExists = false;
  let reviewsTableExists = false;
  let favoritesError = null;
  let reviewsError = null;

  try {
    const { error } = await supabase
      .from("favorites")
      .select("id")
      .limit(1);

    favoritesTableExists = !error || error.code !== "PGRST204";
    if (error) favoritesError = error.message;
  } catch (e: any) {
    favoritesError = e.message;
  }

  try {
    const { error } = await supabase
      .from("reviews")
      .select("id")
      .limit(1);

    reviewsTableExists = !error || error.code !== "PGRST204";
    if (error) reviewsError = error.message;
  } catch (e: any) {
    reviewsError = e.message;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-paper">Parent Features Debug</h1>

        {/* Feature Flags */}
        <div className="bg-surface p-6 rounded-lg border">
          <h2 className="text-xl font-semibold text-paper mb-4">Feature Flags</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-paper">Parent Dashboard Enabled:</span>
              <span className={`font-bold ${flags.parentDashboard ? 'text-green-500' : 'text-red-500'}`}>
                {flags.parentDashboard ? '✅ YES' : '❌ NO'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-paper">Favorites Enabled:</span>
              <span className={`font-bold ${flags.favorites ? 'text-green-500' : 'text-red-500'}`}>
                {flags.favorites ? '✅ YES' : '❌ NO'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-paper">Reviews Enabled:</span>
              <span className={`font-bold ${flags.reviews ? 'text-green-500' : 'text-red-500'}`}>
                {flags.reviews ? '✅ YES' : '❌ NO'}
              </span>
            </div>
          </div>
        </div>

        {/* Database Tables */}
        <div className="bg-surface p-6 rounded-lg border">
          <h2 className="text-xl font-semibold text-paper mb-4">Database Tables</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-paper font-medium">Favorites Table:</span>
                <span className={`font-bold ${favoritesTableExists ? 'text-green-500' : 'text-red-500'}`}>
                  {favoritesTableExists ? '✅ EXISTS' : '❌ MISSING'}
                </span>
              </div>
              {favoritesError && (
                <div className="bg-red-900/20 text-red-300 p-3 rounded text-sm">
                  Error: {favoritesError}
                </div>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-paper font-medium">Reviews Table:</span>
                <span className={`font-bold ${reviewsTableExists ? 'text-green-500' : 'text-red-500'}`}>
                  {reviewsTableExists ? '✅ EXISTS' : '❌ MISSING'}
                </span>
              </div>
              {reviewsError && (
                <div className="bg-red-900/20 text-red-300 p-3 rounded text-sm">
                  Error: {reviewsError}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Environment Variables */}
        <div className="bg-surface p-6 rounded-lg border">
          <h2 className="text-xl font-semibold text-paper mb-4">Environment Variables</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-paper">NEXT_PUBLIC_DIRECTORY_LITE:</span>
              <code className="text-highlight">{process.env.NEXT_PUBLIC_DIRECTORY_LITE || 'not set'}</code>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-paper">NEXT_PUBLIC_ENABLE_FAVORITES:</span>
              <code className="text-highlight">{process.env.NEXT_PUBLIC_ENABLE_FAVORITES || 'not set (defaults to true)'}</code>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-paper">NEXT_PUBLIC_ENABLE_REVIEWS:</span>
              <code className="text-highlight">{process.env.NEXT_PUBLIC_ENABLE_REVIEWS || 'not set (defaults to true)'}</code>
            </div>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="bg-primary-orange/10 border border-primary-orange p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-paper mb-4">Diagnosis</h2>
          <div className="space-y-2 text-paper">
            {!favoritesTableExists && (
              <div className="flex items-start gap-2">
                <span className="text-red-500">❌</span>
                <div>
                  <p className="font-medium">Favorites table is missing</p>
                  <p className="text-sm opacity-80">Run the database migration to create the favorites table</p>
                </div>
              </div>
            )}
            {!reviewsTableExists && (
              <div className="flex items-start gap-2">
                <span className="text-red-500">❌</span>
                <div>
                  <p className="font-medium">Reviews table is missing</p>
                  <p className="text-sm opacity-80">Run the database migration to create the reviews table</p>
                </div>
              </div>
            )}
            {favoritesTableExists && reviewsTableExists && flags.favorites && flags.reviews && (
              <div className="flex items-start gap-2">
                <span className="text-green-500">✅</span>
                <div>
                  <p className="font-medium">All systems operational!</p>
                  <p className="text-sm opacity-80">Parent features should be fully functional</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Next Steps */}
        {(!favoritesTableExists || !reviewsTableExists) && (
          <div className="bg-surface p-6 rounded-lg border">
            <h2 className="text-xl font-semibold text-paper mb-4">Next Steps</h2>
            <div className="space-y-3 text-paper">
              <p>To fix the missing tables, run this SQL in your Supabase SQL Editor:</p>
              <pre className="bg-background p-4 rounded overflow-x-auto text-sm">
{`-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stars INTEGER CHECK (stars >= 1 AND stars <= 5) NOT NULL,
  text TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- Enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for favorites
CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own favorites" ON favorites
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for reviews
CREATE POLICY "Anyone can view approved reviews" ON reviews
  FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can view own reviews" ON reviews
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pending reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_listing_id ON favorites(listing_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_listing_id ON reviews(listing_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

