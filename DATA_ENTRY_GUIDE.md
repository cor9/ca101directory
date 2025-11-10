# 📝 Data Entry Guide for Child Actor 101 Directory

**Last Updated:** January 25, 2025
**Purpose:** Comprehensive guide for exact data entry format for Listings and Profiles tables

---

## 📋 Table of Contents

1. [Listings Table](#listings-table)
2. [Profiles Table](#profiles-table)
3. [General Rules](#general-rules)
4. [Common Mistakes to Avoid](#common-mistakes-to-avoid)

---

## 🏢 LISTINGS TABLE

### Required Fields (Must Have Data)

#### **listing_name**
- **Type:** Text
- **Format:** Any text, but proper capitalization recommended
- **Examples:**
  - ✅ "Joe's Reels"
  - ✅ "The Avenue Model & Talent Agency, LLC"
  - ✅ "ABC Acting Studio"
- **Notes:** This is used to auto-generate slugs

#### **email**
- **Type:** Text (email format)
- **Format:** Valid email address
- **Examples:**
  - ✅ sendmailtojoe@gmail.com
  - ✅ coaching@childactor101.com
- **Validation:** Must be valid email format
- **Notes:**
  - REQUIRED for all new listings (per Jan 25, 2025 session log)
  - Used to send claim emails
  - Case insensitive

#### **website**
- **Type:** Text (URL)
- **Format:** Full URL including protocol
- **Examples:**
  - ✅ https://www.joesreels.com
  - ✅ https://coaching.childactor101.com
  - ✅ http://example.com
- **Notes:** Must include `http://` or `https://`

#### **what_you_offer**
- **Type:** Text (description)
- **Format:** Plain text description
- **Examples:**
  - ✅ "Premier editing service specializing in sizzle reels, demo reels and airchecks; led by Emmy-nominated editor Joe Gressis"
  - ✅ "Private audition coaching, self-tape strategy, and charisma-building for young actors."
- **Length:** No strict limit, but aim for 150-300 characters for best display

---

### Status Field (Critical)

#### **status**
- **Type:** Text (enum-like constraint)
- **Accepted Values ONLY:**
  - `Live` (capital L, lowercase rest)
  - `Pending` (capital P, lowercase rest)
  - `Rejected` (capital R, lowercase rest)
  - `Draft` (capital D, lowercase rest)
  - `Archived` (capital A, lowercase rest)
- **Default:** `Pending` for new submissions
- **Examples:**
  - ✅ "Live"
  - ✅ "Pending"
  - ❌ "LIVE" (wrong case)
  - ❌ "live" (wrong case)
  - ❌ "Active" (not valid)
- **Notes:** Exact capitalization required - database has CHECK constraint

---

### Plan Field

#### **plan**
- **Type:** Text
- **Accepted Values:**
  - `Free` (capital F)
  - `free` (lowercase - some legacy data)
  - `Standard`
  - `Pro`
  - `Founding Pro`
  - `founding-standard` (legacy format)
- **Examples:**
  - ✅ "Free"
  - ✅ "Pro"
  - ✅ "Founding Pro"
- **Notes:** Capitalization inconsistent in database - be consistent going forward

---

### Format Field

#### **format**
- **Type:** Text
- **Accepted Values (standardized):**
  - `Online`
  - `In-person`
  - `Hybrid`
- **Legacy Values (avoid for new entries):**
  - `In-Person Only`
  - Empty string
- **Examples:**
  - ✅ "Online"
  - ✅ "In-person" (note lowercase "p")
  - ✅ "Hybrid"
  - ❌ "In-Person Only" (old format)
  - ❌ "Virtual" (not valid)

---

### Region Field (Array)

#### **region**
- **Type:** PostgreSQL Array of Text
- **Format:** `["Region 1", "Region 2"]`
- **Accepted Values (10 regions only):**
  1. `Canada`
  2. `Global (Online Only)`
  3. `Mid-Atlantic`
  4. `Midwest`
  5. `Northeast`
  6. `Pacific Northwest`
  7. `Rocky Mountain`
  8. `Southeast`
  9. `Southwest`
  10. `West Coast`
- **Examples:**
  - ✅ `["West Coast"]`
  - ✅ `["Southeast", "Mid-Atlantic"]`
  - ✅ `["Global (Online Only)"]`
  - ❌ `["California"]` (too specific)
  - ❌ `["global-online"]` (wrong format - use "Global (Online Only)")
- **In CSV:** Use comma-separated if multiple: `West Coast,Pacific Northwest`
- **Notes:**
  - Can have multiple regions
  - Must match exactly (case-sensitive)
  - Old format "global-online" exists but use standard format for new entries

---

### Categories Field (Array)

#### **categories**
- **Type:** PostgreSQL Array of Text
- **Format:** `["Category 1", "Category 2"]`
- **Accepted Values (44 categories - see full list below):**

**Active Categories (33 shown):**
1. Acting Classes & Coaches
2. Acting Schools
3. Actor Websites
4. Audition Prep
5. Background Casting
6. Branding Coaches
7. Business of Acting
8. Career Consulting
9. Casting Workshops
10. Child Advocacy
11. Demo Reel Creators
12. Dialect Coach
13. Headshot Photographers
14. Improv Classes
15. Influencer Agents
16. Mental Health for Performers
17. Publicists
18. Reel Editors
19. Self-Tape Support
20. Set Teachers
21. Stylists
22. Talent Agents
23. Talent Managers
24. Talent Showcases
25. Theatre Training
26. Vocal Coaches
27. Voiceover Support
28. Hair/Makeup Artists
29. Set Sitters
30. Social Media Consultants
31. Speech Therapy
32. Videographers
33. Wardrobe Consultant

**Hidden Categories (11 - still valid but not shown in filters):**
34. Comedy Coaches
35. Content Creators
36. Cosmetic Dentistry
37. Dance Classes
38. Entertainment Lawyers
39. Event Calendars
40. Financial Advisors
41. Lifestyle Photographers
42. Modeling Portfolios
43. Modeling/Print Agents
44. Stunt Training

**Legacy Values in Database (avoid):**
- "Acting Coach" (use "Acting Classes & Coaches")
- "Acting School" (use "Acting Schools")
- "Acting School/Coach" (use "Acting Classes & Coaches")
- "Headshot Photographer" (use "Headshot Photographers")
- "Self Tape Support" (use "Self-Tape Support")
- "Aircheck" (specific, avoid)
- UUID values (old system)

**Examples:**
- ✅ `["Talent Agents"]`
- ✅ `["Headshot Photographers", "Actor Websites"]`
- ✅ `["Reel Editors"]`
- ❌ `["Headshot Photographer"]` (missing 's')
- ❌ `["Acting Coach"]` (use "Acting Classes & Coaches")

**In CSV:** Use comma-separated: `Talent Agents,Talent Managers`

**Notes:**
- Must match EXACTLY (case-sensitive)
- Can have multiple categories
- Singular vs plural matters

---

### Age Range Tags (Array)

#### **age_range**
- **Type:** PostgreSQL Array of Text
- **Format:** `["5-8", "9-12"]`
- **Accepted Values:**
  - `5-8`
  - `9-12`
  - `13-17`
  - `18+`
- **Examples:**
  - ✅ `["9-12", "13-17"]`
  - ✅ `["5-8"]`
  - ✅ `["18+"]`
  - ❌ `["kids"]` (not valid)
  - ❌ `["teen"]` (not valid)
  - ❌ `["5-12"]` (not valid - use two ranges)
- **In CSV:** Use comma-separated: `9-12,13-17`
- **Notes:** Optional field but recommended for targeting

---

### Tags Field (Array)

#### **tags**
- **Type:** PostgreSQL Array of Text
- **Format:** `["tag1", "tag2"]`
- **Guidelines:**
  - Free-form text tags
  - Use for additional searchable keywords
  - Lowercase recommended
  - Hyphenated phrases work: "self-tape", "on-camera"
- **Examples:**
  - ✅ `["on-camera", "commercial", "theatrical"]`
  - ✅ `["beginner-friendly", "professional"]`
- **Notes:** Optional, flexible format

---

### Location Fields

#### **city**
- **Type:** Text
- **Format:** City name in proper case
- **Examples:**
  - ✅ "Los Angeles"
  - ✅ "DECATUR" (uppercase acceptable but not preferred)
  - ✅ "New York"
- **Notes:** Used with state for location display

#### **state**
- **Type:** Text
- **Format:** 2-letter state code (uppercase preferred)
- **Examples:**
  - ✅ "CA"
  - ✅ "NY"
  - ✅ "GA"
- **Notes:** Use postal abbreviations

#### **zip**
- **Type:** Integer
- **Format:** 5-digit ZIP code (no +4 extension)
- **Examples:**
  - ✅ 90066
  - ✅ 10001
  - ❌ "90066" (should be number, not text)
  - ❌ 90066-1234 (no extensions)

---

### Contact Fields

#### **phone**
- **Type:** Text (varchar)
- **Format:** Flexible, but US format preferred
- **Examples:**
  - ✅ "(407) 310-4469"
  - ✅ "323-593-6442"
  - ✅ "8009865133"
- **Notes:** Optional field, formats vary in database

---

### Description Fields

#### **who_is_it_for**
- **Type:** Text
- **Format:** Plain text description
- **Purpose:** Target audience description
- **Examples:**
  - ✅ "Kids and teens, ages 7–17, working in TV and film."
  - ✅ "Beginning actors ages 5-12"

#### **why_is_it_unique**
- **Type:** Text
- **Format:** Plain text description
- **Purpose:** Unique value proposition
- **Examples:**
  - ✅ "My Prep101 system and bold choice framework make kids stand out to casting — fast."

#### **extras_notes**
- **Type:** Text
- **Format:** Plain text, additional details
- **Purpose:** Additional information, disclaimers, special offers
- **Examples:**
  - ✅ "Includes a printed guide and self-tape feedback option. Coaching is based on 25+ years in the industry."

---

### Image Fields

#### **profile_image**
- **Type:** Text (URL)
- **Format:** Full Supabase Storage URL
- **Examples:**
  - ✅ "https://[project].supabase.co/storage/v1/object/public/listing-images/logo-1705872013372.jpg"
- **Upload Specs:**
  - File types: JPEG, PNG, WebP, HEIC
  - Max size: 10MB
  - Auto-cropped to: 1200x1200 (1:1 aspect ratio)
  - Stored in: `listing-images` bucket
- **Notes:**
  - Only available on Standard and Pro plans
  - Free plans cannot have profile images

#### **gallery**
- **Type:** Text (JSON string)
- **Format:** JSON array of URLs as string
- **Examples:**
  - ✅ `"[\"https://[project].supabase.co/storage/.../image1.jpg\",\"https://[project].supabase.co/storage/.../image2.jpg\"]"`
  - ✅ `"[]"` (empty array)
- **Upload Specs:**
  - File types: JPEG, PNG, WebP, HEIC
  - Max size: 10MB per image
  - Auto-cropped to: 1200x800 (3:2 aspect ratio)
  - Max images: 4
  - Stored in: `listing-images` bucket
- **Notes:**
  - Only available on Pro plans
  - Must be valid JSON string

---

### Social Media Links

#### **facebook_url**
- **Type:** Text
- **Format:** Full Facebook URL
- **Examples:**
  - ✅ "https://facebook.com/username"
  - ✅ "https://www.facebook.com/businessname"

#### **instagram_url**
- **Type:** Text
- **Format:** Full Instagram URL
- **Examples:**
  - ✅ "https://instagram.com/username"
  - ✅ "https://www.instagram.com/businessname"

#### **tiktok_url**
- **Type:** Text
- **Format:** Full TikTok URL
- **Examples:**
  - ✅ "https://tiktok.com/@username"

#### **youtube_url**
- **Type:** Text
- **Format:** Full YouTube URL (channel or video)
- **Examples:**
  - ✅ "https://youtube.com/@channelname"
  - ✅ "https://youtube.com/c/channelname"

#### **linkedin_url**
- **Type:** Text
- **Format:** Full LinkedIn URL
- **Examples:**
  - ✅ "https://linkedin.com/in/username"
  - ✅ "https://linkedin.com/company/businessname"

#### **blog_url**
- **Type:** Text
- **Format:** Full blog/website URL
- **Examples:**
  - ✅ "https://blog.example.com"
  - ✅ "https://example.com/blog"

#### **custom_link_url** & **custom_link_name**
- **Type:** Text (both fields)
- **Format:**
  - URL: Full URL
  - Name: Display text for the link
- **Examples:**
  - URL: ✅ "https://calendly.com/username"
  - Name: ✅ "Book a Session"

**Notes for Social Links:**
- Only available on Pro plans
- Must include full URL with protocol
- All optional fields

---

### Slug Field

#### **slug**
- **Type:** Text
- **Format:** URL-friendly string
- **Auto-Generated:** Yes (via database trigger)
- **Generation Rules:**
  1. Take `listing_name`
  2. Convert to lowercase
  3. Replace spaces with hyphens
  4. Remove all non-alphanumeric characters except hyphens
  5. Remove consecutive hyphens
  6. Remove leading/trailing hyphens
  7. If duplicate, append `-1`, `-2`, etc.
- **Examples:**
  - "Joe's Reels" → `joes-reels`
  - "The Avenue Model & Talent Agency, LLC" → `the-avenue-model-talent-agency-llc`
  - "ABC Acting Studio" → `abc-acting-studio`
  - If duplicate → `abc-acting-studio-1`
- **Manual Entry:** Not recommended - let database generate
- **With City:** Some older entries include city in slug: `joe-s-reels-los-angeles`

---

### Boolean Flags

#### **is_claimed**
- **Type:** Boolean
- **Default:** `false`
- **Values:** `true` or `false`
- **Purpose:** Whether listing has been claimed by vendor
- **Notes:** Set to `true` after successful claim/payment

#### **ca_permit_required**
- **Type:** Boolean
- **Default:** `false`
- **Values:** `true` or `false`
- **Purpose:** Whether California work permit is required

#### **is_bonded**
- **Type:** Boolean
- **Default:** `false`
- **Values:** `true` or `false`
- **Purpose:** Whether business is bonded

#### **badge_approved** (or **is_approved_101**)
- **Type:** Boolean
- **Default:** `false`
- **Values:** `true` or `false`
- **Purpose:** Whether listing has "101 Approved" badge
- **Notes:** Only for Pro+ plans, requires approval process

#### **comped**
- **Type:** Boolean
- **Default:** `false`
- **Values:** `true` or `false`
- **Purpose:** Whether listing is complimentary (free upgrade)

#### **featured**
- **Type:** Boolean
- **Default:** `false`
- **Values:** `true` or `false`
- **Purpose:** Whether listing is featured (priority placement)

#### **is_active**
- **Type:** Boolean
- **Default:** `true`
- **Values:** `true` or `false`
- **Purpose:** Whether listing is active in system

#### **has_gallery**
- **Type:** Boolean
- **Default:** `false`
- **Values:** `true` or `false`
- **Purpose:** Whether listing has gallery images

---

### Metadata Fields

#### **bond_number**
- **Type:** Text (varchar)
- **Format:** Alphanumeric bond number
- **Examples:**
  - ✅ "2346732"
- **Notes:** Only if `is_bonded` is true

#### **priority**
- **Type:** Integer
- **Default:** 0
- **Format:** Numeric priority value
- **Purpose:** Higher number = higher placement in directory
- **Examples:**
  - ✅ 0 (default)
  - ✅ 1, 2, 3, etc. (higher priority)

#### **verification_status**
- **Type:** Text
- **Purpose:** Internal verification tracking
- **Notes:** Not currently used in public display

---

### Claim-Related Fields

#### **claimed_by_email**
- **Type:** Text
- **Purpose:** Email of user who claimed listing
- **Notes:** Populated after successful claim

#### **date_claimed**
- **Type:** Text (legacy) or Timestamp
- **Purpose:** When listing was claimed
- **Notes:** Format varies in database

#### **pending_claim_email**
- **Type:** Text
- **Purpose:** Email of user who paid but hasn't created account yet
- **Notes:** Used for payment → account creation flow

#### **stripe_session_id**
- **Type:** Text
- **Purpose:** Stripe session ID for pending claim verification
- **Notes:** Used to verify payment before account creation

#### **stripe_plan_id**
- **Type:** Text (varchar)
- **Purpose:** Stripe plan/price ID
- **Examples:**
  - ✅ "price_1234567890"
- **Notes:** Links to Stripe subscription

---

### Owner/Relationship Fields

#### **owner_id**
- **Type:** UUID
- **Format:** UUID string
- **Purpose:** References `profiles.id` of listing owner
- **Examples:**
  - ✅ "9075a53c-f56b-4c3b-b1fd-e49bde8da3c2"
- **Notes:** Set after vendor claims listing

#### **primary_category_id**
- **Type:** UUID
- **Format:** UUID string
- **Purpose:** Primary category for sorting/display
- **Notes:** Links to `categories.id`

---

### Timestamp Fields

#### **created_at**
- **Type:** Timestamp with timezone
- **Default:** `now()`
- **Format:** ISO 8601 timestamp
- **Examples:**
  - ✅ "2025-01-25T14:30:00.000Z"
- **Notes:** Auto-populated on insert

#### **updated_at**
- **Type:** Timestamp with timezone
- **Default:** `now()`
- **Format:** ISO 8601 timestamp
- **Notes:** Auto-updated on edit

---

## 👤 PROFILES TABLE

### Required Fields

#### **id**
- **Type:** UUID
- **Format:** UUID string
- **Purpose:** Primary key, links to `auth.users.id`
- **Examples:**
  - ✅ "9075a53c-f56b-4c3b-b1fd-e49bde8da3c2"
- **Notes:** Auto-generated, references Supabase Auth

#### **email**
- **Type:** Text
- **Format:** Valid email address
- **Constraint:** Unique
- **Examples:**
  - ✅ studio@rwrightpix.com
  - ✅ myra@myrafablingphotography.com
- **Notes:**
  - Must be unique across all profiles
  - Case insensitive
  - Links to Supabase Auth user

---

### Name Field

#### **full_name**
- **Type:** Text
- **Format:** Full name of person/business
- **Examples:**
  - ✅ "Richard Wright"
  - ✅ "Myra Fabling"
  - ✅ "Jessica"
- **Notes:**
  - **NOT** `name` (common mistake)
  - Field name is `full_name`

---

### Role Field (Critical)

#### **role**
- **Type:** Text
- **Default:** `parent`
- **Accepted Values (CHECK constraint):**
  - `vendor`
  - `parent`
  - `admin`
- **Examples:**
  - ✅ "vendor"
  - ✅ "parent"
  - ✅ "admin"
  - ❌ "user" (not valid)
  - ❌ "USER" (not valid)
  - ❌ "Vendor" (wrong case)
- **Notes:**
  - Exact lowercase required
  - Database has CHECK constraint
  - Determines dashboard access

---

### Subscription Fields

#### **subscription_plan**
- **Type:** Text
- **Accepted Values:**
  - `Free`
  - `Standard`
  - `Pro`
  - `Founding Standard`
  - `Founding Pro`
  - `null` (no active plan)
- **Examples:**
  - ✅ "Pro"
  - ✅ "Founding Standard"
  - ✅ null (for parents or free vendors)
- **Notes:** Matches Stripe subscription plan

#### **billing_cycle**
- **Type:** Text
- **Accepted Values:**
  - `monthly`
  - `annual`
  - `semi-annual` (for Founding plans)
  - `null` (no active subscription)
- **Examples:**
  - ✅ "monthly"
  - ✅ "annual"
  - ✅ "semi-annual"
  - ✅ null
- **Notes:** Determined by Stripe subscription

---

### Stripe Integration

#### **stripe_customer_id**
- **Type:** Text
- **Format:** Stripe customer ID
- **Examples:**
  - ✅ "cus_1234567890"
- **Notes:**
  - Starts with `cus_`
  - Links to Stripe customer record
  - Populated after first payment

---

### Profile Customization

#### **avatar_url**
- **Type:** Text (URL)
- **Format:** Full URL to profile image
- **Examples:**
  - ✅ "https://[project].supabase.co/storage/v1/object/public/avatars/profile.jpg"
  - ✅ null (no avatar)
- **Notes:**
  - Optional
  - Different from listing `profile_image`
  - For user account, not business listing

#### **link**
- **Type:** Text (URL)
- **Format:** Full URL to personal/business site
- **Examples:**
  - ✅ "https://example.com"
  - ✅ null
- **Notes:** Optional personal link field

---

### Timestamp Fields

#### **created_at**
- **Type:** Timestamp with timezone
- **Default:** `now()`
- **Format:** ISO 8601 timestamp
- **Notes:** Auto-populated when profile created

#### **updated_at**
- **Type:** Timestamp with timezone
- **Default:** `timezone('utc'::text, now())`
- **Format:** ISO 8601 timestamp
- **Notes:** Auto-updated on changes

---

## 📏 GENERAL RULES

### Capitalization Standards

1. **Status Values:** First letter capital, rest lowercase
   - "Live", "Pending", "Rejected"

2. **Plan Values:** Match standard format
   - "Free", "Pro", "Founding Pro"

3. **Roles:** All lowercase
   - "vendor", "parent", "admin"

4. **Categories:** Title Case (capitalize each major word)
   - "Headshot Photographers", "Talent Agents"

5. **Regions:** Title Case
   - "West Coast", "Mid-Atlantic"

6. **Format:** First letter capital
   - "Online", "In-person", "Hybrid"

### Array Formatting

**In Database:**
```json
["Value 1", "Value 2", "Value 3"]
```

**In CSV:**
```
Value 1,Value 2,Value 3
```

**Notes:**
- No spaces after commas in CSV (unless part of value)
- Case-sensitive - must match exactly
- Empty arrays allowed: `[]`

### URL Formatting

**All URLs must include protocol:**
- ✅ https://example.com
- ✅ http://example.com
- ❌ example.com (missing protocol)
- ❌ www.example.com (missing protocol)

### Date/Time Formatting

**Timestamps:**
- Format: ISO 8601 with timezone
- Example: `2025-01-25T14:30:00.000Z`
- Auto-generated by database

### UUID Formatting

**UUIDs:**
- Format: 8-4-4-4-12 hex digits
- Example: `9075a53c-f56b-4c3b-b1fd-e49bde8da3c2`
- Auto-generated by database
- Do not manually create

### Boolean Values

**In Database:**
- Use: `true` or `false` (lowercase)
- Not: `TRUE`, `FALSE`, `1`, `0`, `"true"`, `"false"`

**In CSV:**
- Accept: `true`, `false`, `TRUE`, `FALSE`, `1`, `0`
- Converts to boolean on import

---

## ⚠️ COMMON MISTAKES TO AVOID

### 1. Wrong Field Names
- ❌ `name` → ✅ `full_name` (in profiles)
- ❌ `description` → ✅ `what_you_offer` (in listings)

### 2. Wrong Capitalization
- ❌ "live" → ✅ "Live" (status)
- ❌ "Vendor" → ✅ "vendor" (role)
- ❌ "TALENT AGENTS" → ✅ "Talent Agents" (category)

### 3. Invalid Enum Values
- ❌ "Active" → ✅ "Live" (status)
- ❌ "user" → ✅ "parent" or "vendor" (role)
- ❌ "Virtual" → ✅ "Online" (format)

### 4. Array Format Issues
- ❌ `"West Coast"` → ✅ `["West Coast"]` (single value still needs array)
- ❌ `West Coast, Midwest` → ✅ `["West Coast", "Midwest"]` (proper array syntax)

### 5. URL Format Issues
- ❌ `example.com` → ✅ `https://example.com` (missing protocol)
- ❌ `www.example.com` → ✅ `https://www.example.com` (missing protocol)

### 6. Wrong Table Usage
- ❌ Querying `users` table for roles → ✅ Query `profiles` table
- Per November 2, 2025 fixes: `profiles` is the authoritative table

### 7. Category Typos
- ❌ "Headshot Photographer" → ✅ "Headshot Photographers" (plural)
- ❌ "Self Tape Support" → ✅ "Self-Tape Support" (hyphenated)
- ❌ "Acting Coach" → ✅ "Acting Classes & Coaches"

### 8. Region Mistakes
- ❌ "California" → ✅ "West Coast" (use broad region)
- ❌ "NYC" → ✅ "Northeast" (use broad region)
- ❌ "global-online" → ✅ "Global (Online Only)" (use standard format)

### 9. Boolean as String
- ❌ `"true"` → ✅ `true` (boolean, not string)
- ❌ `1` → ✅ `true` (use boolean)

### 10. Missing Required Fields
- Must have: `listing_name`, `email`, `website`, `what_you_offer`
- Must have: `id`, `email`, `role` (profiles)

---

## 📊 CSV IMPORT FORMAT

### Listings CSV Template

```csv
name,website,email,phone,city,state,format,region,categories,tags,description
"Joe's Reels",https://www.joesreels.com,sendmailtojoe@gmail.com,(323) 555-1234,Los Angeles,CA,Online,West Coast,Reel Editors,"editing,demo-reel","Premier editing service specializing in sizzle reels and demo reels"
```

### Field Mapping:
- `name` → `listing_name`
- `description` → `what_you_offer`
- `region` → comma-separated to array
- `categories` → comma-separated to array
- `tags` → comma-separated to array

### CSV Rules:
1. Enclose fields with commas in quotes
2. Use comma to separate multiple array values
3. Empty fields allowed (except required ones)
4. No header row in import (or skip header)

---

## 🔍 VALIDATION CHECKLIST

Before importing data, verify:

### Listings:
- [ ] `listing_name` is not empty
- [ ] `email` is valid email format
- [ ] `website` includes http:// or https://
- [ ] `status` is one of: Live, Pending, Rejected, Draft, Archived
- [ ] `format` is one of: Online, In-person, Hybrid
- [ ] `region` values match the 10 approved regions exactly
- [ ] `categories` values match the 44 approved categories exactly
- [ ] `age_range` values are: 5-8, 9-12, 13-17, 18+
- [ ] `plan` matches: Free, Standard, Pro, Founding Pro, founding-standard
- [ ] Arrays are properly formatted
- [ ] URLs include protocol
- [ ] Boolean values are true/false

### Profiles:
- [ ] `email` is unique and valid
- [ ] `role` is one of: vendor, parent, admin (lowercase)
- [ ] `full_name` is populated (not `name`)
- [ ] `subscription_plan` matches plan names if present
- [ ] `billing_cycle` is: monthly, annual, semi-annual, or null

---

## 📚 REFERENCE LISTS

### Complete Categories List (44 total)

```
Acting Classes & Coaches
Acting Schools
Actor Websites
Audition Prep
Background Casting
Branding Coaches
Business of Acting
Career Consulting
Casting Workshops
Child Advocacy
Comedy Coaches (hidden)
Content Creators (hidden)
Cosmetic Dentistry (hidden)
Dance Classes (hidden)
Demo Reel Creators
Dialect Coach
Entertainment Lawyers (hidden)
Event Calendars (hidden)
Financial Advisors (hidden)
Hair/Makeup Artists
Headshot Photographers
Improv Classes
Influencer Agents
Lifestyle Photographers (hidden)
Mental Health for Performers
Modeling Portfolios (hidden)
Modeling/Print Agents (hidden)
Publicists
Reel Editors
Self-Tape Support
Set Sitters
Set Teachers
Social Media Consultants
Speech Therapy
Stunt Training (hidden)
Stylists
Talent Agents
Talent Managers
Talent Showcases
Theatre Training
Videographers
Vocal Coaches
Voiceover Support
Wardrobe Consultant
```

### Complete Regions List (10 total)

```
Canada
Global (Online Only)
Mid-Atlantic
Midwest
Northeast
Pacific Northwest
Rocky Mountain
Southeast
Southwest
West Coast
```

### Age Ranges (4 total)

```
5-8
9-12
13-17
18+
```

### Status Values (5 total)

```
Live
Pending
Rejected
Draft
Archived
```

### Format Values (3 standard)

```
Online
In-person
Hybrid
```

### Plan Values

```
Free
Standard
Pro
Founding Pro
Founding Standard
founding-standard (legacy)
```

### Role Values (3 total)

```
vendor
parent
admin
```

### Billing Cycles

```
monthly
annual
semi-annual
```

---

## 💳 STRIPE PAYMENT LINKS

### Regular Plans

**Monthly:**
- Standard ($25/mo): https://pay.childactor101.com/b/4gM00i3V79jbb25fAg8Vi0e
- Pro ($50/mo): https://pay.childactor101.com/b/3cIcN4gHTcvneeh2Nu8Vi0h

**Annual:**
- Standard ($250/yr): https://pay.childactor101.com/b/14A8wO0IVfHz3zDewc8Vi0f
- Pro ($500/yr): https://pay.childactor101.com/b/aFa6oG63f3YR2vz4VC8Vi0g

### Founding Member Plans (6-month specials)

- Founding Standard ($101 for 6mo): https://pay.childactor101.com/b/7sY4gy2R3eDv9Y12Nu8Vi0d
- Founding Pro ($199 for 6mo): https://pay.childactor101.com/b/4gMcN477jeDveeh4VC8Vi0i
- Founding Standard + 101 Badge ($156 for 6mo): https://pay.childactor101.com/b/14AbJ0crDdzrb254VC8Vi0j

### 101 Badge Add-ons

- Monthly ($10/mo): https://pay.childactor101.com/b/4gM7sK3V77b33zD1Jq8Vi0l
- Annual ($100/yr): https://pay.childactor101.com/b/14A9AScrD66Z2vz2Nu8Vi0k

---

## 🛠️ TROUBLESHOOTING

### Email Not Sending
- Verify email is valid format
- Check: RESEND_EMAIL_FROM = corey@childactor101.com
- Check Vercel environment variables for newlines
- Use `printf` command when setting env vars

### Listing Not Appearing
- Check `status` is "Live" (not "live" or "LIVE")
- Verify `is_active` is true
- Check category is not hidden

### User Can't Login
- Verify role in `profiles` table (not `users` table)
- Role must be lowercase: vendor, parent, admin
- Check email is confirmed in Supabase Auth

### Images Not Uploading
- Check file size < 10MB
- Verify file type: JPEG, PNG, WebP, HEIC
- Ensure user is authenticated
- Check Storage RLS policies exist

### Array Fields Not Working
- Ensure proper JSON array format in database
- In CSV: comma-separated values convert to array
- Verify no typos in values (case-sensitive)

---

## 📝 CHANGELOG

### January 25, 2025
- Initial guide created
- Based on cursor session logs and Supabase schema
- Documented all 44 categories
- Documented 10 regions (corrected from code)
- Added exact accepted values for all enum-like fields
- Clarified profiles table vs users table usage
- Added Stripe payment links
- Documented image upload specifications

---

## 📞 SUPPORT

For questions or issues with data entry:
1. Check this guide first
2. Review cursor logs: `cursor/session-log-2025-01-25.md`
3. Review November 2 fixes: `NOVEMBER_2_2025_FIXES.md`
4. Check Supabase dashboard for current schema

**Remember:**
- Always use `profiles` table for user data (not `users`)
- Exact capitalization matters for enum-like fields
- Arrays must match exact values
- URLs must include protocol

---

**Last Updated:** January 25, 2025
**Status:** ✅ Complete and Production-Ready
**Version:** 1.0



