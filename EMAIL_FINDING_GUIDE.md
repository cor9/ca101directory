# Email Finding Guide for Listings

This guide explains how to find and add email addresses to listings that don't have them yet using OSINT (Open Source Intelligence) and other public sources.

## 📊 Overview

We have 3 automated scripts to help find and import email addresses:

1. **Export** - Extract listings without emails to CSV
2. **Find** - Automatically find emails using public sources
3. **Import** - Import found emails back into database

---

## 🚀 Quick Start

### Step 1: Export Listings Without Emails

```bash
npm run export-listings-without-email
```

This creates `listings_without_email.csv` with columns:
- ID, Slug, Listing Name
- Website, Phone, City, State
- Categories, Is Active, Owner ID
- **Found Email** (empty - you'll fill this)
- **Notes** (for research notes)

### Step 2: Automatically Find Emails

```bash
npm run find-emails-auto
```

This script will:
- ✅ Scrape business websites for email addresses
- ✅ Check common contact pages (/contact, /about, etc.)
- ✅ Generate common email patterns (info@, contact@, etc.)
- ✅ Update the CSV with found emails
- ⏱️  Process 50 listings at a time (to be nice to servers)

**What it finds:**
- **High confidence**: Emails found on website (likely valid)
- **Medium confidence**: Emails from WHOIS data
- **Low confidence**: Generated patterns (need verification)

### Step 3: Manual Research (for listings with no emails)

For listings where automatic search failed, manually research using:

#### 🌐 Website Research
1. Visit the listing's website
2. Look for:
   - Contact page
   - About page
   - Footer
   - Privacy policy
3. Copy any email addresses to the CSV

#### 🔍 Google Search
```
"[Business Name]" email contact
"[Business Name]" [city] email
site:[website.com] email
```

#### 📱 Social Media
- **LinkedIn**: Find the business page, look for contact info
- **Facebook**: Check "About" section
- **Instagram**: Bio or business contact button
- **IMDb Pro**: For entertainment industry professionals

#### 🌐 WHOIS Lookup
```bash
whois [domain.com]
```
Look for registrant email (but be aware many use privacy protection)

#### 🔧 Other Tools (Use Ethically)

**Free Tools:**
- Hunter.io (free tier: 25 searches/month)
- Voila Norbert (50 free searches)
- Find That Email (50 free searches)

**Paid Tools:**
- Apollo.io (email finding + verification)
- ZoomInfo (B2B contact database)
- Clearbit Connect (Chrome extension)
- RocketReach (entertainment industry contacts)

**IMDb Pro** (for entertainment):
- Search for the person/company
- View contact & representation
- Great for agents, managers, casting directors

### Step 4: Import Found Emails

```bash
npm run import-found-emails
```

This will:
- ✅ Read the CSV file
- ✅ Validate email formats
- ✅ Update listings in database
- ✅ Skip invalid emails with warnings
- ✅ Show success/error counts

---

## 📝 CSV Format

```csv
ID,Slug,Listing Name,Website,Phone,City,State,Categories,Is Active,Owner ID,Found Email,Notes
"abc-123","acting-coach-la","LA Acting Coach","https://example.com","555-1234","Los Angeles","CA","Acting Coaches","Yes","","contact@example.com","Found on contact page"
```

**Columns you'll fill:**
- **Found Email**: The email address you found
- **Notes**: Where you found it (for verification)

---

## 🎯 Research Strategies

### For Acting Coaches / Teachers
1. Check their website's contact page
2. Look for resume/bio pages (often have contact)
3. Search IMDb Pro if they have acting credits
4. Check Facebook business page
5. Look for Backstage or Actors Access profiles

### For Headshot Photographers
1. Website contact page (photographers usually have this)
2. Instagram bio (often has business email)
3. Facebook page "About" section
4. Google "[name] photography contact"
5. Check photography association directories

### For Casting Directors
1. **IMDb Pro** is best source
2. Breakdown Services listings
3. Casting Society of America directory
4. LinkedIn profiles
5. Agency websites (if affiliated)

### For Talent Managers/Agents
1. **IMDb Pro** (primary source)
2. Check if they're franchised with SAG-AFTRA
3. Look at client testimonials on website
4. LinkedIn company page
5. Agency/management association directories

### For Other Services
1. Google Business Profile
2. Yelp business listing
3. Better Business Bureau
4. Chamber of Commerce listings
5. Industry-specific directories

---

## ⚠️ Important Guidelines

### ✅ DO:
- Use publicly available information
- Check official business websites
- Use legitimate B2B contact databases
- Verify emails before importing
- Respect rate limits on websites
- Add source notes for accountability

### ❌ DON'T:
- Scrape aggressively (respect robots.txt)
- Use personal emails without consent
- Spam or harass contacts
- Share/sell found contact information
- Use harvested emails for unsolicited marketing
- Violate GDPR/CCPA regulations

### 📧 Email Verification

Before adding emails to CSV, verify they:
- ✅ Are business emails (not personal)
- ✅ Are publicly listed
- ✅ Follow proper format
- ✅ Are associated with the business

---

## 🛠️ Troubleshooting

### "No listings found"
- All listings may already have emails
- Check if listings table has data
- Verify database connection

### "Invalid email format"
```
Invalid: john.doe@gmail (missing TLD)
Valid: john.doe@gmail.com
```

### "Import failed"
- Check database permissions
- Verify listing IDs match
- Check for duplicate emails

### "Rate limiting"
The auto-finder waits 2 seconds between requests to avoid overwhelming servers. If you still get rate limited:
- Reduce batch size in the script
- Increase delay between requests
- Spread research over multiple days

---

## 📊 Expected Success Rates

Based on typical results:

| Source | Success Rate | Confidence |
|--------|--------------|------------|
| Website scraping | 60-70% | High |
| Contact pages | 50-60% | High |
| Pattern generation | 10-20% | Low (needs verification) |
| Manual research | 80-90% | High |
| IMDb Pro | 90%+ | Very High (ent. industry) |

**Combined approach**: ~70-80% success rate

---

## 📈 Progress Tracking

Keep track of your research:

```csv
Date,Listings Processed,Emails Found,Source,Time Spent
2024-11-07,50,35,Auto-scraper,10 min
2024-11-07,15,12,Manual research,45 min
```

---

## 🔒 Privacy & Compliance

### GDPR/CCPA Considerations:
- Only collect business contact emails
- Provide opt-out mechanisms
- Document source of information
- Use for legitimate business purposes only
- Don't share with third parties

### Email Use Cases:
✅ **Legitimate:**
- Helping businesses claim their listings
- Correcting listing information
- Business partnership inquiries
- Platform notifications

❌ **Not Allowed:**
- Unsolicited marketing
- Selling contact lists
- Spam or phishing
- Sharing with third parties

---

## 📚 Additional Resources

### Tools
- [Hunter.io](https://hunter.io) - Email finder & verifier
- [WHOIS Lookup](https://whois.domaintools.com) - Domain registration data
- [IMDb Pro](https://pro.imdb.com) - Entertainment industry contacts
- [LinkedIn Sales Navigator](https://business.linkedin.com/sales-solutions) - B2B contacts

### APIs (for automation)
- Hunter.io API
- Clearbit API
- Pipl API
- FullContact API

### Guides
- [OSINT Email Finding](https://osintframework.com/)
- [Email Format Patterns](https://github.com/letsconnectvpn/email-format)
- [IMDb Pro Tutorial](https://help.imdb.com/article/imdbpro)

---

## 💡 Pro Tips

1. **Start with high-confidence sources** (websites, IMDb Pro)
2. **Batch your work** (do 20-30 listings at a time)
3. **Cross-reference multiple sources** for accuracy
4. **Document your process** (helps with GDPR compliance)
5. **Verify before importing** (test emails if possible)
6. **Use industry-specific directories** (high success rates)
7. **Check social media** (many businesses list contacts there)
8. **Look for press releases** (often include PR contact emails)

---

## 🎯 Quick Reference Commands

```bash
# 1. Export listings without emails
npm run export-listings-without-email

# 2. Auto-find emails (scrapes websites)
npm run find-emails-auto

# 3. Edit CSV manually with found emails
# open listings_without_email.csv

# 4. Import emails back to database
npm run import-found-emails

# 5. Verify success
npm run export-listings-without-email  # Should show fewer listings
```

---

## ✅ Success Checklist

- [ ] Exported listings to CSV
- [ ] Ran automatic email finder
- [ ] Reviewed auto-found emails
- [ ] Manually researched remaining listings
- [ ] Verified email formats
- [ ] Added source notes
- [ ] Imported emails to database
- [ ] Verified import success
- [ ] Documented process for compliance

---

**Need help?** Check the script comments or contact the development team.

**Found a bug?** Open an issue in the repository.
