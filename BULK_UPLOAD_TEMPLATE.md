# Bulk Vendor Upload Template - For AI Research Agent

## 🎯 OUTPUT FORMAT: CSV or JSON

**Provide data in CSV format with these exact column headers:**

---

## 📋 REQUIRED FIELDS (Must Have)

| Field Name | Data Type | Format | Example | Notes |
|------------|-----------|--------|---------|-------|
| `listing_name` | text | String | "ABC Acting Studio" | Business name (will check for duplicates) |
| `website` | text | URL | "https://abcacting.com" | Full URL with https:// |
| `what_you_offer` | text | Long text | "On-camera acting classes for ages 8-18..." | Description of services (100-500 words) |
| `categories` | array | Comma-separated | "Acting Classes & Coaches,Audition Prep" | See category list below |
| `city` | text | String | "Los Angeles" | City name |
| `state` | text | 2-letter code | "CA" | US state code |
| `region` | **array** | **Pipe-separated** | "West Coast\|Southwest" | See region list below - CAN BE MULTIPLE! |

---

## 📋 HIGHLY RECOMMENDED FIELDS

| Field Name | Data Type | Format | Example | Notes |
|------------|-----------|--------|---------|-------|
| `email` | text | Email | "info@abcacting.com" | Contact email |
| `phone` | text | Phone | "(310) 555-1234" | US phone format |
| `format` | text | String | "Hybrid" | See format options below |
| `who_is_it_for` | text | Text | "Young actors ages 8-18" | Target audience |
| `why_is_it_unique` | text | Text | "20+ years experience with Disney stars" | What makes them special |

---

## 📋 OPTIONAL FIELDS (Nice to Have)

| Field Name | Data Type | Format | Example | Notes |
|------------|-----------|--------|---------|-------|
| `zip` | integer | Number | 90028 | Zip code (numbers only) |
| `instagram_url` | text | URL | "https://instagram.com/abcacting" | Full URL |
| `facebook_url` | text | URL | "https://facebook.com/abcacting" | Full URL |
| `tiktok_url` | text | URL | "https://tiktok.com/@abcacting" | Full URL |
| `youtube_url` | text | URL | "https://youtube.com/@abcacting" | Full URL |
| `linkedin_url` | text | URL | "https://linkedin.com/company/abc" | Full URL |
| `blog_url` | text | URL | "https://blog.abcacting.com" | Full URL |
| `extras_notes` | text | Text | "Also offers private coaching" | Additional info |
| `bond_number` | text | Text | "123456" | If bonded |

---

## 📋 AUTOMATIC FIELDS (System Will Set)

These will be automatically set - **DO NOT include in your CSV:**
- `id` - Auto-generated UUID
- `status` - Will be set to "Pending" (admin reviews before Live)
- `plan` - Will be set to "Free"
- `is_active` - Will be set to true
- `is_claimed` - Will be set to false
- `owner_id` - Will be NULL (vendor must claim later)
- `created_at` - Auto timestamp
- `updated_at` - Auto timestamp
- `featured` - Will be false
- `priority` - Will be 0

---

## 🏷️ VALID CATEGORY OPTIONS (Exact Names)

**Use these EXACT names (case-sensitive, with punctuation):**

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
Comedy Coaches
Content Creators
Cosmetic Dentistry
Dance Classes
Demo Reel Creators
Dialect Coach
Entertainment Lawyers
Event Calendars
Financial Advisors
Hair/Makeup Artists
Headshot Photographers
Improv Classes
Influencer Agents
Lifestyle Photographers
Mental Health for Performers
Modeling Portfolios
Modeling/Print Agents
Publicists
Reel Editors
Self-Tape Support
Set Sitters
Set Teachers
Social Media Consultants
Speech Therapy
Stunt Training
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

**Format:** Separate multiple categories with commas  
**Example:** `"Acting Classes & Coaches,Audition Prep,Self-Tape Support"`

---

## 🌎 VALID REGION OPTIONS (Multi-Select!)

**IMPORTANT:** Region is now **MULTI-SELECT** - vendors can serve multiple regions!

**Use these EXACT names (pipe-separated for multiple):**

```
West Coast
Southwest
Southeast
Midwest
Northeast
Mid-Atlantic
Pacific Northwest
Rocky Mountain
Canada
Global (Online Only)
```

**Format for Multiple Regions:**
- Single region: `"West Coast"`
- Multiple regions: `"West Coast|Southwest|Global (Online Only)"`
- Online-only: `"Global (Online Only)"`
- Hybrid business: `"West Coast|Southwest"` (where they physically are + online reach)

**Geographic Coverage:**
- **West Coast:** LA, San Francisco, San Diego, Portland, Seattle
- **Southwest:** Albuquerque, Phoenix, Las Vegas, Austin, Dallas
- **Southeast:** Atlanta, Miami, Orlando, Charlotte, New Orleans, Wilmington, Nashville
- **Midwest:** Chicago, Detroit, Cleveland, Minneapolis
- **Northeast:** New York, Boston, Philadelphia  
- **Mid-Atlantic:** Washington DC, Baltimore
- **Pacific Northwest:** Seattle, Portland
- **Rocky Mountain:** Denver, Salt Lake City
- **Canada:** Vancouver, Toronto
- **Global (Online Only):** Virtual services, no physical location required

---

## 📍 VALID FORMAT OPTIONS

**Use ONE of these:**

```
Online Only
In-Person Only
Hybrid
```

**If unknown, use:** `"Hybrid"`

---

## 📄 CSV TEMPLATE (Copy This Header Row)

```csv
listing_name,website,what_you_offer,who_is_it_for,why_is_it_unique,categories,email,phone,city,state,zip,region,format,instagram_url,facebook_url,tiktok_url,youtube_url,linkedin_url,blog_url,extras_notes,bond_number
```

---

## 📄 EXAMPLE CSV ROW

```csv
"ABC Acting Studio","https://abcacting.com","Professional on-camera acting classes for young performers ages 8-18. Classes include scene study, audition technique, self-tape coaching, and industry preparation. Small class sizes ensure personalized attention.","Young actors ages 8-18 preparing for TV and film auditions","Founded by former Disney casting director with 20+ years experience. Alumni have booked roles on major network shows.","Acting Classes & Coaches,Audition Prep","info@abcacting.com","(310) 555-1234","Los Angeles","CA",90028,"Los Angeles","Hybrid","https://instagram.com/abcacting","https://facebook.com/abcacting","","","","","Also offers private coaching sessions","" 
```

---

## 🔍 DUPLICATE DETECTION

**System will check for duplicates using:**
1. Exact `listing_name` match (case-insensitive)
2. Exact `website` match (if provided)

**If duplicate found:**
- ✅ Skip that row
- ⏭️ Continue with next row
- 📝 Log skipped duplicates

**AI Agent should:**
- Clean up business names (remove extra spaces, LLC, Inc, etc.)
- Standardize URLs (add https:// if missing)
- Check for obvious duplicates before submitting

---

## 🚀 BULK UPLOAD PROCESS

### Option A: CSV File Upload (Preferred)
```
1. AI generates: vendors.csv
2. Admin runs: node scripts/bulk-upload-listings.js vendors.csv
3. Script validates each row
4. Inserts non-duplicates
5. Reports: "Inserted 45, Skipped 5 duplicates"
```

### Option B: JSON Format
```json
[
  {
    "listing_name": "ABC Acting Studio",
    "website": "https://abcacting.com",
    "what_you_offer": "Professional on-camera acting classes...",
    "who_is_it_for": "Young actors ages 8-18",
    "why_is_it_unique": "Founded by former Disney casting director...",
    "categories": ["Acting Classes & Coaches", "Audition Prep"],
    "region": ["West Coast", "Southwest"],
    "email": "info@abcacting.com",
    "phone": "(310) 555-1234",
    "city": "Los Angeles",
    "state": "CA",
    "zip": 90028,
    "region": "Los Angeles",
    "format": "Hybrid",
    "instagram_url": "https://instagram.com/abcacting",
    "facebook_url": "https://facebook.com/abcacting"
  }
]
```

---

## ✅ VALIDATION RULES

### Required Fields:
- `listing_name` - Must not be empty
- `categories` - At least 1 category
- `region` - Must match valid region list

### Recommended Fields:
- `website` OR `email` - At least one contact method
- `what_you_offer` - At least 50 characters
- `city` and `state` - For local businesses

### Data Cleaning:
- Remove leading/trailing spaces
- Standardize URLs (add https://)
- Validate email format
- Clean phone numbers (remove formatting)
- Capitalize city names properly

---

## 📝 INSTRUCTIONS FOR AI RESEARCH AGENT

**For each vendor, research and provide:**

1. **listing_name** - Official business name from their website
2. **website** - Official website URL (verify it works!)
3. **what_you_offer** - 100-300 word description of their services  
   - What services do they provide?
   - What age ranges do they work with?
   - What formats (online/in-person)?
   - Any specialties?

4. **who_is_it_for** - 1-2 sentences about ideal client
5. **why_is_it_unique** - 1-2 sentences about what makes them special
6. **categories** - Pick 1-3 from the list above
7. **email** - Contact email from website
8. **phone** - Phone number if available
9. **city, state** - Primary business location
10. **region** - Pick from region list
11. **format** - Online Only / In-Person Only / Hybrid
12. **Social media** - Get Instagram, Facebook if public on their site

**Verification:**
- ✅ Website must be active (not 404)
- ✅ Business must serve child/youth actors
- ✅ Must be appropriate for kids (safe, professional)
- ✅ Verify location is accurate

**Output:**
- CSV file with all fields
- One row per vendor
- Clean, validated data ready to upload

---

## 🚀 UPLOAD COMMAND (For You)

Once AI provides the CSV:

```bash
# Option 1: Use upload script (if exists)
node scripts/bulk-upload-listings.js vendors.csv

# Option 2: Direct SQL (I can write this for you)
# Will create script that:
# - Reads CSV
# - Validates each row
# - Checks for duplicates
# - Inserts to Supabase
# - Reports results
```

---

**Give this document to your AI research agent - they'll know exactly what to provide!** 📋

