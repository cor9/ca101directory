import Airtable from 'airtable';

// Initialize Airtable only if API key is available
let airtable: Airtable | null = null;
let base: Airtable.Base | null = null;

// Check if environment variables are available
const hasAirtableConfig = process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID;

if (hasAirtableConfig) {
  try {
    airtable = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY,
    });
    base = airtable.base(process.env.AIRTABLE_BASE_ID);
    console.log('✅ Airtable initialized successfully');
  } catch (error) {
    console.warn('❌ Airtable initialization failed:', error);
  }
} else {
  console.warn('⚠️ Airtable not configured - missing API key or base ID');
}

// Types for our data
export interface Listing {
  id: string;
  businessName: string;
  email: string;
  phone: string;
  website?: string;
  instagram?: string;
  servicesOffered?: string;
  description: string;
  category: string[];
  gallery?: string[];
  logo?: string;
  location: string;
  virtual: boolean;
  ageRange: string[];
  plan: 'Basic' | 'Pro' | 'Premium' | 'Add-On';
  featured: boolean;
  approved101: boolean;
  status: 'Pending' | 'Approved' | 'Rejected';
  dateSubmitted: string;
  dateApproved?: string;
}

export interface Category {
  id: string;
  categoryName: string;
  description?: string;
  icon?: string;
}

// Helper function to convert Airtable record to our interface
function recordToListing(record: any): Listing {
  return {
    id: record.id,
    businessName: record.get('Business Name') || '',
    email: record.get('Email') || '',
    phone: record.get('Phone') || '',
    website: record.get('Website'),
    instagram: record.get('Instagram'),
    servicesOffered: record.get('Services Offered'),
    description: record.get('Description') || '',
    category: record.get('Category') || [],
    gallery: record.get('Gallery')?.map((attachment: any) => attachment.url) || [],
    logo: record.get('Logo')?.[0]?.url,
    location: record.get('Location') || '',
    virtual: record.get('Virtual') || false,
    ageRange: record.get('Age Range') || [],
    plan: record.get('Plan') || 'Basic',
    featured: record.get('Featured') || false,
    approved101: record.get('101 Approved') || false,
    status: record.get('Status') || 'Pending',
    dateSubmitted: record.get('Date Submitted') || '',
    dateApproved: record.get('Date Approved'),
  };
}

function recordToCategory(record: any): Category {
  return {
    id: record.id,
    categoryName: record.get('Category Name') || '',
    description: record.get('Description'),
    icon: record.get('Icon')?.[0]?.url,
  };
}

// API functions
export async function getListings(): Promise<Listing[]> {
  if (!base) {
    console.warn('Airtable not initialized - returning empty listings');
    return [];
  }
  
  try {
    const records = await base('Listings')
      .select({
        filterByFormula: "{Status} = 'Approved'",
        sort: [{ field: 'Featured', direction: 'desc' }, { field: 'Date Approved', direction: 'desc' }],
      })
      .all();

    return records.map(recordToListing);
  } catch (error) {
    console.error('Error fetching listings:', error);
    return [];
  }
}

export async function getListingById(id: string): Promise<Listing | null> {
  if (!base) {
    console.warn('Airtable not initialized - returning null');
    return null;
  }
  
  try {
    const record = await base('Listings').find(id);
    return recordToListing(record);
  } catch (error) {
    console.error('Error fetching listing:', error);
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!base) {
    console.warn('Airtable not initialized - returning empty categories');
    return [];
  }
  
  try {
    const records = await base('Categories')
      .select()
      .all();

    return records.map(recordToCategory);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function createListing(data: Partial<Listing>): Promise<string | null> {
  if (!base) {
    console.warn('Airtable not initialized - cannot create listing');
    return null;
  }
  
  try {
    const record = await base('Listings').create({
      'Business Name': data.businessName,
      'Email': data.email,
      'Phone': data.phone,
      'Website': data.website,
      'Instagram': data.instagram,
      'Services Offered': data.servicesOffered,
      'Description': data.description,
      'Location': data.location,
      'Virtual': data.virtual || false,
      'Age Range': data.ageRange || [],
      'Plan': data.plan || 'Basic',
      'Status': 'Pending',
      'Date Submitted': new Date().toISOString(),
    });

    return record.id;
  } catch (error) {
    console.error('Error creating listing:', error);
    return null;
  }
}