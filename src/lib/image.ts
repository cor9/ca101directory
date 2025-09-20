/**
 * Simplified image utilities for Child Actor 101 Directory
 * Since we're using Airtable, images are direct URLs
 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const urlForImage = (source: any) => {
  // For Airtable, source is a direct URL string
  if (typeof source === 'string') {
    return {
      src: source,
      width: 800, // Default width
      height: 600, // Default height
    };
  }
  
  // Fallback for Sanity-style objects (if any remain)
  if (source && source.asset) {
    return {
      src: source.asset._ref || source.asset.url,
      width: 800,
      height: 600,
    };
  }
  
  return null;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const urlForIcon = (source: any) => {
  // For Airtable, source is a direct URL string
  if (typeof source === 'string') {
    return {
      src: source,
      width: 64,
      height: 64,
    };
  }
  
  // Fallback for Sanity-style objects (if any remain)
  if (source && source.asset) {
    return {
      src: source.asset._ref || source.asset.url,
      width: 64,
      height: 64,
    };
  }
  
  return null;
};
