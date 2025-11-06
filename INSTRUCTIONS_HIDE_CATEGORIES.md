# Hide Categories - Setup Instructions

## Step 1: Add the 'hidden' column to Supabase

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run the SQL in `ADD_HIDDEN_COLUMN.sql`

OR manually:

1. Go to **Table Editor** → **categories** table
2. Click **"Add Column"**
3. Fill in:
   - **Name:** `hidden`
   - **Type:** `bool`
   - **Default value:** `false`
   - **Is nullable:** ✅ (checked)
4. Click **Save**

## Step 2: Run the update script

After adding the column, run:

```bash
npx tsx scripts/hide-categories.ts
```

This will mark these categories as hidden:

1. Stunt Training
2. Modeling/Print Agents
3. Modeling Portfolios
4. Lifestyle Photographers
5. Financial Advisors
6. Event Calendars
7. Entertainment Lawyers
8. Dance Classes
9. Cosmetic Dentistry
10. Content Creators
11. Comedy Coaches

## How it works

Once the `hidden` column is added and categories are marked as hidden:

- ✅ Hidden categories will NOT appear in category dropdowns/filters
- ✅ Hidden categories will NOT appear on the `/category` page
- ✅ Existing listings with hidden categories will still work (they just won't be filterable by that category)
- ✅ You can unhide categories later by setting `hidden = false` in the database

## To unhide a category later

Run this SQL in Supabase:

```sql
UPDATE categories 
SET hidden = FALSE 
WHERE category_name = 'Category Name Here';
```

