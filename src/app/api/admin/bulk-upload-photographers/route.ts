import { createServerClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const photographers = [
  { name: "MT Photography (Michael Tari)", website: "https://www.mtphotographs.com/", city: "Los Angeles", state: "CA" },
  { name: "The Headshot Truck", website: "https://www.headshottruck.com/", city: "Los Angeles", state: "CA" },
  { name: "Actor Photo LA", website: "http://www.actorphotola.com/", city: "Los Angeles", state: "CA" },
  { name: "Budget Headshots", website: "https://www.budgetheadshots.com/", city: "Los Angeles", state: "CA" },
  { name: "Headshots Only, Ken Wood", website: "http://www.headshotsonly.com/", city: "Los Angeles", state: "CA" },
  { name: "Headshot Shop LA", website: "https://headshotshopla.com/actor-headshots", city: "Los Angeles", state: "CA" },
  { name: "Alisa Banks", website: "http://www.alisabanksphotography.com/", city: "Los Angeles", state: "CA" },
  { name: "Anthony Mongiello Photography", website: "https://www.anthonymongiello.com/", city: "Los Angeles", state: "CA" },
  { name: "Bella Saville", website: "https://www.bellasavillephotography.com/", city: "Los Angeles", state: "CA" },
  { name: "Brad Buckman", website: "https://www.buckmanheadshots.com/", city: "Los Angeles", state: "CA" },
  { name: "Bradford Rogne", website: "https://rognephoto.com/", city: "Los Angeles", state: "CA" },
  { name: "Cathryn Farnsworth", website: "https://www.cathrynfarnsworthheadshots.com/", city: "Los Angeles", state: "CA" },
  { name: "Chris Evan Photography", website: "https://www.chrisevanphotography.com/", city: "Los Angeles", state: "CA" },
  { name: "Dana Patrick", website: "https://www.danapatrickphoto.com/", city: "Los Angeles", state: "CA" },
  { name: "David La Porte", website: "http://davidlaporte.com/", city: "Los Angeles", state: "CA" },
  { name: "David Muller Photography", website: "http://www.davidmullerphotography.com/", city: "Los Angeles", state: "CA" },
  { name: "Dylan Patrick", website: "https://dylanpatrick.com/home/cinematic-headshots", city: "Los Angeles", state: "CA" },
  { name: "James Depietro", website: "https://headshotsbyjd.com/", city: "Los Angeles", state: "CA" },
  { name: "Jessica Sherman Headshots", website: "http://jessicashermanphotography.com/", city: "Los Angeles", state: "CA" },
  { name: "Ken Weingart Photography", website: "https://www.kenweingart.com/headshot-photographer/", city: "Los Angeles", state: "CA" },
  { name: "Kenneth Dolin", website: "https://www.kennethdolin.com/adult-actors", city: "Los Angeles", state: "CA" },
  { name: "LA PhotoSpot / Todd Tyler", website: "https://www.laphotospot.com/", city: "Los Angeles", state: "CA" },
  { name: "Laura Burke", website: "https://www.lauraburkephotography.com/", city: "Los Angeles", state: "CA" },
  { name: "Lionfly Studios", website: "https://www.lionfly.tv/", city: "Los Angeles", state: "CA" },
  { name: "Marc Cartwright Headshots", website: "https://www.marccartwrightheadshots.com/", city: "Los Angeles", state: "CA" },
  { name: "Marisa Q Photography", website: "https://www.marisaqphotography.com/", city: "Los Angeles", state: "CA" },
  { name: "Matt Hotsinpiller Photography", website: "https://www.matthphotography.com/", city: "Los Angeles", state: "CA" },
  { name: "Michael Hiller", website: "http://www.michaelhiller.com/", city: "Los Angeles", state: "CA" },
  { name: "Michael Roud Photography", website: "https://michaelroud.com/", city: "Los Angeles", state: "CA" },
  { name: "Molly Pan Photography", website: "https://www.mollypanphoto.com/", city: "Los Angeles", state: "CA" },
  { name: "Monesson Photography / Josh Monesson", website: "https://www.monessonphotography.com/", city: "Los Angeles", state: "CA" },
  { name: "Paul Gregory Headshots", website: "https://www.paulgregoryphotography.com/", city: "Los Angeles", state: "CA" },
  { name: "Sergio Garcia", website: "https://www.sergiogarciaheadshots.com/", city: "Los Angeles", state: "CA" },
  { name: "Sosa Headshots", website: "https://www.shotbysosa.com/", city: "Los Angeles", state: "CA" },
  { name: "Stepanyan Photography / Seda Stepanyan", website: "https://stepanyanphotography.com/", city: "Los Angeles", state: "CA" },
  { name: "Stephanie Girard", website: "https://www.stephgirardheadshots.com/", city: "Los Angeles", state: "CA" },
  { name: "Studio Roy", website: "http://studioroy.com/", city: "Los Angeles", state: "CA" },
  { name: "The Light Committee", website: "https://thelightcommittee.com/actor-headshots/", city: "Los Angeles", state: "CA" },
  { name: "Baza Productions", website: "https://www.baza.productions/", city: "New York", state: "NY" },
  { name: "Ben Esner Photography", website: "https://benesner.com/", city: "New York", state: "NY" },
  { name: "CEOportriat", website: "https://www.ceoportrait.com/", city: "New York", state: "NY" },
  { name: "Chris Macke Photography", website: "https://www.mackephotography.com/", city: "New York", state: "NY" },
  { name: "Christian Webb", website: "https://www.christianwebbphoto.com/projects", city: "New York", state: "NY" },
  { name: "City Headshots", website: "https://www.cityheadshots.com/", city: "New York", state: "NY" },
  { name: "David Genik", website: "https://www.davidgenik.com/", city: "New York", state: "NY" },
  { name: "David Noles", website: "http://www.davidnoles.com/", city: "New York", state: "NY" },
  { name: "Downtown Headshots NYC", website: "https://downtownheadshotsnyc.com/", city: "New York", state: "NY" },
  { name: "Emily Lambert Photography", website: "https://www.emilylambertphoto.com/", city: "New York", state: "NY" },
  { name: "Hancock Headshots", website: "http://www.hancockheadshots.com/", city: "New York", state: "NY" },
  { name: "Jeffrey Mosier Photography", website: "http://www.jeffreymosierphotography.com/", city: "New York", state: "NY" },
  { name: "Jeremy Folmer Photography", website: "https://www.jeremyfolmer.com/", city: "New York", state: "NY" },
  { name: "Jessica Osber Photography", website: "https://osberphotos.com/", city: "New York", state: "NY" },
  { name: "Joe Henson", website: "https://www.joehenson.com/", city: "New York", state: "NY" },
  { name: "Joe Jenkins", website: "https://www.joejenkinsphoto.com/", city: "New York", state: "NY" },
  { name: "Jordan Matter Studio", website: "https://www.jordanmatter.com/photography/head-shots", city: "New York", state: "NY" },
  { name: "JW Headshots", website: "https://www.jwheadshots.com/", city: "New York", state: "NY" },
  { name: "Laura Volpacchio Photography", website: "https://lauravolpacchiophotography.com/", city: "New York", state: "NY" },
  { name: "Leslie Hassler Studio", website: "https://www.lesliehassler.com/actors", city: "New York", state: "NY" },
  { name: "Lindsay Van Norman Photography", website: "https://www.lindsayvannorman.com/", city: "New York", state: "NY" },
  { name: "Mark Reay Photography", website: "http://markheadshots.com/", city: "New York", state: "NY" },
  { name: "Melany Bernier", website: "http://www.melanybernier.com/", city: "New York", state: "NY" },
  { name: "Melissa Hamburg Photography", website: "http://www.melissahamburg.com/", city: "New York", state: "NY" },
  { name: "Mia Isabella Photography", website: "https://www.miaisabellaphotography.com/", city: "New York", state: "NY" },
  { name: "Michael Levy Photography", website: "https://www.michaellevyphoto.com/", city: "New York", state: "NY" },
  { name: "Nile Scott Studios", website: "https://nilescottstudios.com/", city: "New York", state: "NY" },
  { name: "Pic Me! Headshots", website: "https://www.picmeheadshots.com/", city: "New York", state: "NY" },
  { name: "Peter Hurley", website: "https://peterhurley.com/", city: "New York", state: "NY" },
  { name: "Philip Kessler Studio", website: "http://www.philipkesslerphotography.com/", city: "New York", state: "NY" },
  { name: "ReliveThis", website: "http://relivethis.com/", city: "New York", state: "NY" },
  { name: "Ricardo Birnbaum Photographer", website: "https://www.ricardobirnbaumphotography.com/", city: "New York", state: "NY" },
  { name: "Sub/Urban Photography", website: "http://www.sub-urbanphotography.com/", city: "New York", state: "NY" },
  { name: "Susan Stripling", website: "https://www.susanstripling.com/", city: "New York", state: "NY" },
  { name: "Ted Ely Headshots", website: "https://tedely.com/", city: "New York", state: "NY" },
  { name: "Tess Steinkolk / Brown Dog Productions", website: "https://www.tesssteinkolk.com/", city: "New York", state: "NY" },
  { name: "Todd Estrin Photography", website: "https://www.toddestrinphotography.com/", city: "New York", state: "NY" },
  { name: "Xanthe Elbrick Photography", website: "https://www.xantheelbrickphotography.com/headshots.html", city: "New York", state: "NY" },
];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET() {
  try {
    console.log("=== BULK UPLOAD PHOTOGRAPHERS ===");
    
    const supabase = createServerClient();
    
    const created: string[] = [];
    const skipped: string[] = [];
    const errors: Array<{ name: string; error: string }> = [];
    
    for (const photographer of photographers) {
      try {
        // Check for duplicates by website
        const { data: existing } = await supabase
          .from("listings")
          .select("id, listing_name, website")
          .eq("website", photographer.website)
          .maybeSingle();
        
        if (existing) {
          console.log(`⏭️  Skipping ${photographer.name} - already exists`);
          skipped.push(photographer.name);
          continue;
        }
        
        // Determine region based on state
        const region = photographer.state === "CA" ? ["West Coast"] : ["Northeast"];
        
        // Generate slug
        const slug = generateSlug(photographer.name);
        
        // Create listing
        const { error: insertError } = await supabase
          .from("listings")
          .insert({
            listing_name: photographer.name,
            slug,
            website: photographer.website,
            city: photographer.city,
            state: photographer.state,
            what_you_offer: `Professional headshot photography for actors and performers in ${photographer.city}.`,
            categories: ["Headshot Photographers"],
            region,
            format: "In-Person Only",
            plan: "Free",
            status: "Live",
            is_active: true,
            is_claimed: false,
          });
        
        if (insertError) {
          console.error(`❌ Error creating ${photographer.name}:`, insertError);
          errors.push({ name: photographer.name, error: insertError.message });
        } else {
          console.log(`✅ Created ${photographer.name}`);
          created.push(photographer.name);
        }
      } catch (error) {
        console.error(`❌ Error processing ${photographer.name}:`, error);
        errors.push({ 
          name: photographer.name, 
          error: error instanceof Error ? error.message : "Unknown error" 
        });
      }
    }
    
    console.log("=== UPLOAD COMPLETE ===");
    console.log(`Created: ${created.length}`);
    console.log(`Skipped: ${skipped.length}`);
    console.log(`Errors: ${errors.length}`);
    
    return NextResponse.json({
      success: true,
      summary: {
        total: photographers.length,
        created: created.length,
        skipped: skipped.length,
        errors: errors.length,
      },
      created,
      skipped,
      errors,
    });
    
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}

