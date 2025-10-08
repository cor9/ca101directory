# 🧭 Child Actor 101 Directory — SEO Maintenance Guide
**Version 2.0 | Updated October 2025**  
Maintains: Technical SEO ✔ | Content Freshness ✔ | Authority Growth ✔  

---

## 🔁 Maintenance Schedule

| Component | Frequency | Purpose |
|------------|------------|----------|
| **Sitemap** | Weekly (auto) / Monthly (review) | Keep all vendors + categories indexed |
| **Schema Markup** | Quarterly | Ensure structured data matches live fields |
| **Category Content** | Monthly | Refresh intros, counts, and FAQs |
| **Meta Descriptions** | Quarterly | Preserve CTR-friendly copy |
| **Canonical Tags** | Quarterly | Prevent duplicate-content conflicts |
| **Internal Links & Breadcrumbs** | Monthly | Strengthen link equity across pages |
| **Location Pages** | Monthly | Expand geographic reach |
| **Structural Audit** | Every 6 months | Optimize for latest Next.js + Supabase updates |

---

## ⚙️ Cursor Prompts & Checks

### 🗺 1. Sitemap Refresh
Review `/app/sitemap.ts`.  
Confirm all current categories, vendors, and city pages are included from Supabase.  
Deduplicate URLs and verify accurate lastModified timestamps and priorities.  

**Verify:** visit `/sitemap.xml` → valid XML, no duplicates.

---

### 🧩 2. Schema Markup Audit
Open `src/components/seo/listing-schema.tsx` and `category-schema.tsx`.  
Confirm LocalBusiness, CollectionPage, and BreadcrumbList JSON-LD reflect all live fields (name, website, location, rating).  
Update properties if new Supabase fields exist.  

**Verify:** run [Schema Validator](https://validator.schema.org) → no errors.

---

### 🧱 3. Category SEO Content Update
Edit `src/components/seo/category-content.tsx`.  
Refresh listing counts, rewrite intros to include current totals, and ensure each category has ≥ 200 words and 3–5 FAQs.  

**Verify:** top 5 categories show accurate vendor counts and keyword-rich copy.

---

### 🧾 4. Meta Description Optimization
Audit `generateMetadata()` functions across all routes.  
Titles < 60 chars; meta descriptions < 160 chars; include action verbs + primary keywords.  

**Verify:** test snippet display in Google Search Console → “View Crawled Page.”

---

### 🧩 5. Canonical Tags Review
In `/app/category/[slug]/page.tsx` and `/app/listing/[slug]/page.tsx`,  
ensure `<link rel="canonical">` matches the live URL exactly.  

**Verify:** page source → one canonical tag only.

---

### 🔗 6. Internal Links & Breadcrumbs
Add or refresh “You May Also Need” related-category sections.  
On vendor pages, link back to parent category + location page.  
Validate breadcrumb component (Home → Category → Vendor).  

**Verify:** all internal links resolve; crawl with Screaming Frog → full internal map.

---

### 📍 7. Location Pages Expansion
Generate `/category/[slug]/[location]/page.tsx` for new cities.  
Pull vendors by location and add 1-paragraph local intro.  
Include in sitemap with priority 0.7.  

**Verify:** URLs load unique content; indexed within 2–3 weeks.

---

### 🧰 8. Structural Audit / Refactor
Run a 6-month SEO code health check.  
Remove unused imports, outdated Next.js patterns, and redundant Supabase queries.  
Confirm sitemap + schema components conform to current Next.js API.  

**Verify:** no build warnings; all lint checks pass.

---

## 🧪 Post-Update Checklist
- [ ] `/sitemap.xml` valid and up to date  
- [ ] Rich Results Test passes for listings + categories  
- [ ] Mobile PageSpeed ≥ 90  
- [ ] All canonical tags present  
- [ ] Internal links and breadcrumbs functioning  
- [ ] New location pages indexed  

---

## 🧩 Tools & Resources
- [Google Search Console](https://search.google.com/search-console) — coverage + indexing  
- [Schema Validator](https://validator.schema.org) — structured data test  
- [PageSpeed Insights](https://pagespeed.web.dev) — core web vitals  
- [Ubersuggest](https://neilpatel.com/ubersuggest/) — keyword refresh  
- [Screaming Frog (Free)](https://www.screamingfrog.co.uk/seo-spider/) — link audit  

---

## 🤖 Optional Automation
Add a **GitHub Action** to ping Google’s sitemap endpoint weekly after build:  
`https://www.google.com/ping?sitemap=https://directory.childactor101.com/sitemap.xml`

---

### ✅ Goal
Maintain a technically flawless, content-rich, and constantly refreshed directory that Google recognizes as the **authoritative resource for child-actor professionals.**
