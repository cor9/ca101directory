# FREE Listings Bulk Upload Template

**Purpose:** Quick bulk import of FREE listings only  
**For:** AI research agent collecting vendor data

---

## 🎯 REQUIRED FIELDS (8 Fields Only!)

| Field Name | Data Type | Format | Example |
|------------|-----------|--------|---------|
| `listing_name` | text | String | "ABC Acting Studio" |
| `website` | text | URL | "https://abcacting.com" |
| `email` | text | Email | "info@abcacting.com" |
| `what_you_offer` | text | 100-500 words | "On-camera acting classes for young performers..." |
| `category` | text | **ONE category** | "Acting Classes & Coaches" |
| `city` | text | City name | "Los Angeles" |
| `state` | text | 2-letter code | "CA" |
| `region` | text | **ONE or MORE** | "West Coast" OR "West Coast\|Global (Online Only)" |
| `format` | text | From list | "Hybrid" |

---

## 🏷️ CATEGORY OPTIONS (Pick ONE)

Use these EXACT names (case-sensitive):

```
Acting Classes & Coaches
Headshot Photographers
Talent Managers
Talent Agents
Self-Tape Support
Demo Reel Creators
Audition Prep
Vocal Coaches
Dance Classes
Hair/Makeup Artists
Publicists
Entertainment Lawyers
Reel Editors
Social Media Consultants
Content Creators
Branding Coaches
Business of Acting
Career Consulting
Casting Workshops
Comedy Coaches
Dialect Coach
Improv Classes
Mental Health for Performers
Set Teachers
Stylists
Theatre Training
Videographers
Voiceover Support
Wardrobe Consultant
```

**Pick the PRIMARY category only** (most relevant to their main service)

---

## 🌎 REGION OPTIONS (Multi-Select OK!)

| Region | Cities/Coverage |
|--------|----------------|
| West Coast | LA, San Francisco, San Diego, Seattle, Portland |
| Southwest | Albuquerque, Phoenix, Las Vegas, Austin, Dallas |
| Southeast | Atlanta, Miami, Orlando, Charlotte, New Orleans, Nashville |
| Midwest | Chicago, Detroit, Cleveland, Minneapolis |
| Northeast | New York, Boston, Philadelphia |
| Mid-Atlantic | Washington DC, Baltimore |
| Pacific Northwest | Seattle, Portland |
| Rocky Mountain | Denver, Salt Lake City |
| Canada | Vancouver, Toronto |
| Global (Online Only) | Virtual services, no physical location |

**Format:**
- Single region: `"West Coast"`
- Multiple regions: `"West Coast|Global (Online Only)"`

---

## 📍 FORMAT OPTIONS (Pick ONE)

```
Online Only
In-Person Only
Hybrid
```

**Guidelines:**
- Virtual/remote services → "Online Only"
- Physical location required → "In-Person Only"
- Offers both → "Hybrid"

---

## 📄 CSV TEMPLATE (Simple!)

### Header Row:
```csv
listing_name,website,email,what_you_offer,category,city,state,region,format
```

### Example Row:
```csv
"ABC Acting Studio","https://abcacting.com","info@abcacting.com","On-camera acting classes for young performers ages 8-18. Small class sizes, personalized attention, taught by working industry professionals.","Acting Classes & Coaches","Los Angeles","CA","West Coast","Hybrid"
```

### Example Row (Multi-Region):
```csv
"XYZ Coaching","https://xyzcoach.com","coach@xyz.com","Private audition coaching and self-tape feedback for young actors nationwide.","Audition Prep","Austin","TX","Southwest|Global (Online Only)","Online Only"
```

---

## 📄 JSON TEMPLATE (Alternative)

```json
[
  {
    "listing_name": "ABC Acting Studio",
    "website": "https://abcacting.com",
    "email": "info@abcacting.com",
    "what_you_offer": "On-camera acting classes for young performers ages 8-18. Small class sizes, personalized attention, taught by working industry professionals.",
    "category": "Acting Classes & Coaches",
    "city": "Los Angeles",
    "state": "CA",
    "region": ["West Coast"],
    "format": "Hybrid"
  },
  {
    "listing_name": "XYZ Coaching",
    "website": "https://xyzcoach.com",
    "email": "coach@xyz.com",
    "what_you_offer": "Private audition coaching and self-tape feedback for young actors nationwide.",
    "category": "Audition Prep",
    "city": "Austin",
    "state": "TX",
    "region": ["Southwest", "Global (Online Only)"],
    "format": "Online Only"
  }
]
```

---

## ✅ VALIDATION RULES

### Required (Cannot be empty):
- `listing_name` - Must be unique
- `category` - Must match list exactly
- `what_you_offer` - At least 50 characters

### Recommended (Should provide):
- `website` OR `email` - At least one contact method
- `city` and `state` - For local businesses
- `region` - At least one region

### Auto-Set by System:
- `status` = "Pending" (admin will review)
- `plan` = "Free"
- `is_active` = true
- `is_claimed` = false
- `owner_id` = NULL (vendor claims later)

---

## 🔍 DATA QUALITY CHECKLIST

For each vendor, verify:

- ✅ Website is active (not 404)
- ✅ Business serves child/youth actors
- ✅ Category is accurate (primary service)
- ✅ Location is correct
- ✅ Email is publicly listed (not scraped)
- ✅ Description is clear and professional
- ✅ No duplicates in your list

---

## 🚨 DUPLICATE DETECTION

System will check for duplicates by:
1. Exact `listing_name` match (case-insensitive)
2. Exact `website` match

**If duplicate found:**
- ✅ Skip that row
- 📝 Log: "Skipped: ABC Acting Studio (already exists)"
- ⏭️ Continue with next row

---

## 📊 EXPECTED OUTPUT

**AI Agent should provide:**
- CSV file: `vendors_YYYY-MM-DD.csv`
- 50-200 vendors per batch (manageable size)
- Clean, validated data
- No duplicates in the file itself

**Example filename:** `vendors_2025-10-11.csv`

---

## 🎯 WHAT HAPPENS AFTER UPLOAD

```
1. Admin uploads CSV to system
   ↓
2. System validates each row
   ↓
3. Checks for duplicates (skips if found)
   ↓
4. Inserts valid listings with status="Pending"
   ↓
5. Admin reviews in dashboard
   ↓
6. Admin approves → status="Live"
   ↓
7. Listings appear on public directory
   ↓
8. Vendors can claim and edit later
```

---

## 📝 INSTRUCTIONS FOR AI RESEARCH AGENT

**For each vendor on the referral list:**

1. **Find their official website** - verify it works
2. **Get business name** - as it appears on their website
3. **Find contact email** - from website (not scraped from hidden sources)
4. **Write description** (what_you_offer):
   - What services do they provide?
   - Who is it for? (age ranges, experience levels)
   - What makes them good/special?
   - 100-300 words
5. **Pick ONE primary category** - what they're MOST known for
6. **Determine location** - city, state from website
7. **Determine service area** (region):
   - If physical location only → pick matching region
   - If also online → add "Global (Online Only)"
   - If nationwide travel → multiple regions
8. **Determine format**:
   - In-person studio/office → "In-Person Only"
   - Virtual/Zoom only → "Online Only"
   - Both options → "Hybrid"

**Output:** One CSV with all vendors, ready to upload!

---

## ⚠️ IMPORTANT NOTES

- **ONE category only** (not multiple like paid listings)
- **Region CAN be multiple** (separate with | in CSV)
- **State must be 2 letters** (CA not California)
- **Website must include https://**
- **Description should be professional** (not marketing hype)

---

**This template is ready for your AI agent!** 🚀

