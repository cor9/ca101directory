# Airtable Setup Guide for Child Actor 101 Directory

## Required Tables

### 📄 Listings Table

| Field Name | Type | Options/Notes |
|------------|------|---------------|
| Business Name | Single Line Text | Required |
| Email | Email | Required |
| Phone | Phone | Required |
| Website | URL | Optional |
| Instagram | URL | Optional |
| Services Offered | Long Text | Optional |
| Description | Long Text | Required |
| Category | Linked to Categories | Multi-select |
| Location | Single Line Text | Required |
| Virtual | Checkbox | Default: false |
| Age Range | Multi-select | Options: "5-8", "9-12", "13-17", "18+" |
| Plan | Single Select | Options: "Basic", "Pro", "Premium", "Add-On" |
| Featured | Checkbox | Default: false |
| 101 Approved | Checkbox | Default: false |
| Status | Single Select | Options: "Pending", "Approved", "Rejected" |
| Logo | Attachment | Single file |
| Gallery | Attachment | Multiple files |
| Stripe Checkout ID | Single Line Text | For tracking payments |
| Date Submitted | Date | Auto-filled |
| Date Approved | Date | Manual entry |

### 🏷️ Categories Table

| Field Name | Type | Options/Notes |
|------------|------|---------------|
| Category Name | Single Line Text | Required |
| Description | Long Text | Optional |
| Icon | Attachment | Optional |

## Sample Categories

- Acting Coaches
- Headshot Photographers  
- Demo Reel Editors
- Voice Coaches
- Casting Directors
- Talent Agents
- Industry Services

## Environment Variables Needed

```
AIRTABLE_API_KEY=your_airtable_api_key_here
AIRTABLE_BASE_ID=your_airtable_base_id_here
```

## API Integration

The Airtable integration is already set up in `/src/lib/airtable.ts` with the following functions:
- `getListings()` - Fetch approved listings
- `getListingById(id)` - Fetch single listing
- `getCategories()` - Fetch all categories
- `createListing(data)` - Create new listing

## Next Steps

1. Create the Airtable base with the tables above
2. Add sample data for testing
3. Update environment variables
4. Test the integration

