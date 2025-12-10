# Mockup Placeholder Images

This folder contains placeholder images used in the Pro Listing Mockup generator (`/dashboard/admin/mockup/[id]`).

## Directory Structure

```
mockups/
├── headshot/           # Placeholder headshot photography samples
│   ├── placeholder-1.jpg
│   ├── placeholder-2.jpg
│   ├── placeholder-3.jpg
│   └── placeholder-4.jpg
├── acting-coach/       # Placeholder images for acting coaches (future)
├── self-tape/          # Placeholder images for self-tape studios (future)
└── README.md
```

## Image Guidelines

### Headshot Placeholders (`/headshot/`)
- Resolution: 800x1000px (portrait orientation)
- Style: Professional child actor headshots
- Content: Neutral, appropriate images of young performers
- Format: JPEG, optimized for web

### Adding New Placeholders

1. Create category-specific folder (e.g., `/mockups/acting-coach/`)
2. Add 3-4 representative images
3. Update `PLACEHOLDER_GALLERY_*` constants in:
   `/src/app/(website)/(protected)/dashboard/admin/mockup/[id]/mockup-listing-page.tsx`

## Usage

These images are ONLY used in the admin mockup preview tool to demonstrate
how a listing would look with Pro tier gallery features. They are never
displayed on live public listings.
