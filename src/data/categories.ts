import { supabase } from "@/lib/supabase";

export async function getCategoryIconsMap(): Promise<Record<string, string>> {
  try {
    const normalize = (v: string) => (v || "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    // Static CSV-based overrides by normalized name
    const staticFallbackByName: Record<string, string> = {
      [normalize("Content Creators")]: "content_creators.png",
      [normalize("Vocal Coaches")]: "singer.png",
      [normalize("Acting Schools")]: "acting_schools.png",
      [normalize("Dialect Coach")]: "dialect_coach.png",
      [normalize("Dance Classes")]: "danceclass.png",
      [normalize("Event Calendars")]: "event_calendar.png",
      [normalize("Theatre Training")]: "theatre_training.png",
      [normalize("Influencer Agents")]: "influencer_agent.png",
      [normalize("Set Sitters")]: "set_sitter.png",
      [normalize("Speech Therapy")]: "speech_therapy.png",
      [normalize("Social Media Consultants")]: "socialmedia.png",
      [normalize("Reel Editors")]: "reel_editors.png",
      [normalize("Casting Workshops")]: "casting_workshop.png",
      [normalize("Hair/Makeup Artists")]: "makeup.png",
      [normalize("Cosmetic Dentistry")]: "cosmetic_dentistry.png",
      [normalize("Talent Managers")]: "talent_managers.png",
      [normalize("Videographers")]: "videographer.png",
      [normalize("Career Consulting")]: "consult.png",
      [normalize("Child Advocacy")]: "child_advocacy.png",
      [normalize("Modeling Portfolios")]: "modeling_portfolios.png",
      [normalize("Modeling/Print Agents")]: "print_agent.png",
      [normalize("Stunt Training")]: "stunt_trainer.png",
      [normalize("Background Casting")]: "background_casting.png",
      [normalize("Financial Advisors")]: "moneybag.png",
      [normalize("Talent Agents")]: "agent.png",
      [normalize("Business of Acting")]: "biz_acting.png",
      [normalize("Stylists")]: "stylist.png",
      [normalize("Mental Health for Performers")]: "mentalhealth.png",
      [normalize("Lifestyle Photographers")]: "lifestyle_photographers.png",
      [normalize("Actor Websites")]: "actor_website.png",
      [normalize("Set Teachers")]: "set_teachers.png",
      [normalize("Acting Classes & Coaches")]: "masks.png",
      [normalize("Improv Classes")]: "improv_classes.png",
      [normalize("Branding Coaches")]: "branding_coaches.png",
      [normalize("Talent Showcases")]: "talent_showcase.png",
      [normalize("Publicists")]: "publicist.png",
      [normalize("Voiceover Support")]: "mic.png",
      [normalize("Self-Tape Support")]: "selftape.png",
      [normalize("Headshot Photographers")]: "camera.png",
      [normalize("Audition Prep")]: "audprep.png",
      [normalize("Comedy Coaches")]: "comedy_coaches.png",
      [normalize("Entertainment Lawyers")]: "legalfile.png",
      [normalize("Demo Reel Creators")]: "play.png",
      [normalize("Wardrobe Consultant")]: "wardrobe.png",
    };

    // 1) Use category_pngs table (current mapping table)
    const pngs = await supabase
      .from("category_pngs")
      .select("category_name, category_pngs");

    const map: Record<string, string> = {};
    if (!pngs.error && Array.isArray(pngs.data) && pngs.data.length) {
      for (const row of pngs.data) {
        if (row?.category_name && row?.category_pngs) {
          map[row.category_name] = row.category_pngs;
          map[normalize(row.category_name)] = row.category_pngs; // normalized name lookup
        }
      }
      // Override name-based entries with CSV mapping
      for (const [nKey, filename] of Object.entries(staticFallbackByName)) {
        map[nKey] = filename;
      }
      return map;
    }

    // 2) Fallback to category_icons table (legacy)
    const primary = await supabase
      .from("category_icons")
      .select("category_name, filename");

    if (!primary.error && Array.isArray(primary.data) && primary.data.length) {
      for (const row of primary.data) {
        if (row?.category_name && row?.filename) {
          map[row.category_name] = row.filename;
          map[normalize(row.category_name)] = row.filename; // normalized name lookup
        }
      }
      // Override name-based entries with CSV mapping
      for (const [nKey, filename] of Object.entries(staticFallbackByName)) {
        map[nKey] = filename;
      }
      return map;
    }

    // Fallback: infer from categories table (supports icon or category_icon columns)
    const fallback = await supabase
      .from("categories")
      .select('category_name, icon, category_icon, "Category Name"');

    if (!fallback.error && Array.isArray(fallback.data)) {
      for (const row of fallback.data) {
        const name = row?.category_name || row?.["Category Name"]; // support Airtable import
        const filename = row?.icon || row?.category_icon;
        if (name && filename) {
          map[name] = filename;
          map[normalize(name)] = filename;
        }
      }
    }
    // Merge/override with static mapping
    for (const [nKey, filename] of Object.entries(staticFallbackByName)) {
      map[nKey] = filename;
    }

    return map;
  } catch (e) {
    console.error("getCategoryIconsMap error", e);
    return {};
  }
}

export async function getCategories() {
  console.log("getCategories: Starting fetch from categories table");

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("category_name", { ascending: true });

    console.log("getCategories: Result:", { data, error });

    if (error) {
      console.error("getCategories: Error:", error);
      throw error;
    }

    // Transform the data to match expected format
    const transformedData =
      data?.map((category) => ({
        id: category.id,
        category_name: category["Category Name"] || category.category_name,
        description: category.description || null,
        icon: category.icon || null,
        created_at: category["Created Time"] || category.created_at || null,
        updated_at: category.updated_at || null,
      })) || [];

    console.log(
      "getCategories: Returning",
      transformedData.length,
      "categories",
    );
    return transformedData;
  } catch (error) {
    console.error("getCategories: Error fetching categories:", error);
    // Return empty array as fallback
    return [];
  }
}
