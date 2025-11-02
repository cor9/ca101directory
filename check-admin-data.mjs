#!/usr/bin/env node
/**
 * Check what data is actually available for admin dashboard
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://crkrittfvylvbtjetxoa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNya3JpdHRmdnlsdmJ0amV0eG9hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODQ5ODM0NywiZXhwIjoyMDc0MDc0MzQ3fQ.0uyFclfdU4HxFgM-kJECsViQGCi-icXb-yYXdutbD3Q';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAdminData() {
  console.log('📊 ADMIN DASHBOARD DATA AUDIT\n');
  console.log('='.repeat(60));

  // 1. Users
  console.log('\n👥 USERS (from profiles):');
  const { data: users, error: usersError } = await supabase
    .from('profiles')
    .select('id, email, role, created_at');

  if (!usersError) {
    console.log(`   Total: ${users.length}`);
    const roleCounts = users.reduce((acc, u) => {
      acc[u.role] = (acc[u.role] || 0) + 1;
      return acc;
    }, {});
    Object.entries(roleCounts).forEach(([role, count]) => {
      console.log(`   - ${role}: ${count}`);
    });
  }

  // 2. Listings
  console.log('\n📋 LISTINGS:');
  const { data: listings, error: listingsError } = await supabase
    .from('listings')
    .select('id, listing_name, status, is_claimed, plan, owner_id, created_at');

  if (!listingsError) {
    console.log(`   Total: ${listings.length}`);

    const statusCounts = listings.reduce((acc, l) => {
      acc[l.status || 'null'] = (acc[l.status || 'null'] || 0) + 1;
      return acc;
    }, {});
    console.log('   By Status:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   - ${status}: ${count}`);
    });

    const claimedCount = listings.filter(l => l.is_claimed).length;
    const unclaimedCount = listings.filter(l => !l.is_claimed).length;
    console.log(`   Claimed: ${claimedCount}`);
    console.log(`   Unclaimed: ${unclaimedCount}`);

    const planCounts = listings.reduce((acc, l) => {
      acc[l.plan || 'None'] = (acc[l.plan || 'None'] || 0) + 1;
      return acc;
    }, {});
    console.log('   By Plan:');
    Object.entries(planCounts).forEach(([plan, count]) => {
      console.log(`   - ${plan}: ${count}`);
    });
  }

  // 3. Claims
  console.log('\n🔐 CLAIMS:');
  const { data: claims, error: claimsError } = await supabase
    .from('claims')
    .select('id, listing_id, vendor_id, status, created_at');

  if (!claimsError) {
    console.log(`   Total: ${claims?.length || 0}`);
    if (claims && claims.length > 0) {
      const claimStatusCounts = claims.reduce((acc, c) => {
        acc[c.status || 'null'] = (acc[c.status || 'null'] || 0) + 1;
        return acc;
      }, {});
      console.log('   By Status:');
      Object.entries(claimStatusCounts).forEach(([status, count]) => {
        console.log(`   - ${status}: ${count}`);
      });
    }
  } else {
    console.log('   Error or no claims table');
  }

  // 4. Badge Applications
  console.log('\n🏅 BADGE APPLICATIONS:');
  const { data: badges, error: badgesError } = await supabase
    .from('badge_applications')
    .select('id, listing_id, status, created_at');

  if (!badgesError) {
    console.log(`   Total: ${badges?.length || 0}`);
    if (badges && badges.length > 0) {
      const badgeStatusCounts = badges.reduce((acc, b) => {
        acc[b.status || 'null'] = (acc[b.status || 'null'] || 0) + 1;
        return acc;
      }, {});
      console.log('   By Status:');
      Object.entries(badgeStatusCounts).forEach(([status, count]) => {
        console.log(`   - ${status}: ${count}`);
      });
    }
  } else {
    console.log('   Error or no badge_applications table');
  }

  // 5. Reviews
  console.log('\n⭐ REVIEWS:');
  const { data: reviews, error: reviewsError } = await supabase
    .from('reviews')
    .select('id, listing_id, user_id, status, created_at');

  if (!reviewsError) {
    console.log(`   Total: ${reviews?.length || 0}`);
    if (reviews && reviews.length > 0) {
      const reviewStatusCounts = reviews.reduce((acc, r) => {
        acc[r.status || 'null'] = (acc[r.status || 'null'] || 0) + 1;
        return acc;
      }, {});
      console.log('   By Status:');
      Object.entries(reviewStatusCounts).forEach(([status, count]) => {
        console.log(`   - ${status}: ${count}`);
      });
    }
  } else {
    console.log('   Error or no reviews table');
  }

  // 6. Vendor Suggestions
  console.log('\n💡 VENDOR SUGGESTIONS:');
  const { data: suggestions, error: suggestionsError } = await supabase
    .from('vendor_suggestions')
    .select('id, business_name, status, created_at');

  if (!suggestionsError) {
    console.log(`   Total: ${suggestions?.length || 0}`);
    if (suggestions && suggestions.length > 0) {
      const suggestionStatusCounts = suggestions.reduce((acc, s) => {
        acc[s.status || 'null'] = (acc[s.status || 'null'] || 0) + 1;
        return acc;
      }, {});
      console.log('   By Status:');
      Object.entries(suggestionStatusCounts).forEach(([status, count]) => {
        console.log(`   - ${status}: ${count}`);
      });
    }
  } else {
    console.log('   Error or no vendor_suggestions table');
  }

  // 7. Recent Activity
  console.log('\n📅 RECENT ACTIVITY:');
  console.log('   Last 5 listings created:');
  const recentListings = listings?.slice(0, 5) || [];
  recentListings.forEach(l => {
    console.log(`   - ${l.listing_name} (${l.status}) - ${new Date(l.created_at).toLocaleDateString()}`);
  });

  console.log('\n='.repeat(60));
  console.log('\n✅ AUDIT COMPLETE\n');
}

checkAdminData().catch(console.error);

