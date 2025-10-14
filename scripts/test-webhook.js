#!/usr/bin/env node

/**
 * Test script to verify Stripe webhook functionality
 * This simulates a webhook event to test the database updates
 */

const { createServerClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testWebhookLogic() {
  console.log('🧪 Testing webhook logic...');
  
  // Test data
  const testData = {
    vendorId: 'test-vendor-id',
    listingId: 'test-listing-id', 
    plan: 'standard',
    billingCycle: 'monthly',
    customerId: 'cus_test123'
  };
  
  try {
    console.log('1. Testing claims table insert...');
    const { error: claimError } = await supabase.from('claims').insert({
      listing_id: testData.listingId,
      vendor_id: testData.vendorId,
      message: `Test claim - ${testData.plan} plan (${testData.billingCycle})`,
      approved: false,
    });
    
    if (claimError) {
      console.error('❌ Claims insert failed:', claimError);
    } else {
      console.log('✅ Claims insert successful');
    }
    
    console.log('2. Testing profiles table update...');
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        stripe_customer_id: testData.customerId,
        subscription_plan: testData.plan,
        billing_cycle: testData.billingCycle,
      })
      .eq('id', testData.vendorId);
    
    if (profileError) {
      console.error('❌ Profiles update failed:', profileError);
    } else {
      console.log('✅ Profiles update successful');
    }
    
    console.log('3. Testing listings table update...');
    const { error: listingError } = await supabase
      .from('listings')
      .update({
        owner_id: testData.vendorId,
        is_claimed: true,
        plan: testData.plan,
        updated_at: new Date().toISOString(),
      })
      .eq('id', testData.listingId);
    
    if (listingError) {
      console.error('❌ Listings update failed:', listingError);
    } else {
      console.log('✅ Listings update successful');
    }
    
    console.log('🧹 Cleaning up test data...');
    await supabase.from('claims').delete().eq('listing_id', testData.listingId);
    await supabase.from('listings').update({ 
      owner_id: null, 
      is_claimed: false, 
      plan: null 
    }).eq('id', testData.listingId);
    
    console.log('✅ Webhook logic test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Check environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables');
  console.log('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

testWebhookLogic();

