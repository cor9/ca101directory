import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: resolve(__dirname, "../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface Photographer {
  name: string;
  website: string;
  email: string;
  city: string;
  state: string;
}

const photographers: Photographer[] = [
  // Los Angeles, CA
  { name: "MT Photography (Michael Tari)", website: "https://www.mtphotographs.com/", email: "michaeltaristudios@gmail.com", city: "Los Angeles", state: "CA" },
  { name: "The Headshot Truck", website: "https://www.headshottruck.com/", email: "hello@capturely.com", city: "Los Angeles", state: "CA" },
  { name: "Actor Photo LA", website: "http://www.actorphotola.com/", email: "gbrown777@pipeline.com", city: "Los Angeles", state: "CA" },
  { name: "Budget Headshots", website: "https://www.budgetheadshots.com/", email: "budgetheadshots@gmail.com", city: "Los Angeles", state: "CA" },
  { name: "Headshot Shop LA", website: "https://headshotshopla.com/actor-headshots", email: "joseph@puhy.com", city: "Los Angeles", state: "CA" },
  { name: "Anthony Mongiello Photography", website: "https://www.anthonymongiello.com/", email: "anthonymongiello@gmail.com", city: "Los Angeles", state: "CA" },
  { name: "Bella Saville", website: "https://www.bellasavillephotography.com/", email: "bellasavillephotography@gmail.com", city: "Los Angeles", state: "CA" },
  { name: "Brad Buckman", website: "https://www.buckmanheadshots.com/", email: "studio@bradbuckman.com", city: "Los Angeles", state: "CA" },
  { name: "Bradford Rogne", website: "https://rognephoto.com/", email: "Info@RognePhoto.com", city: "Los Angeles", state: "CA" },
  { name: "Cathryn Farnsworth", website: "https://www.cathrynfarnsworthheadshots.com/", email: "booking@cathrynfarnsworth.com", city: "Los Angeles", state: "CA" },
  { name: "Chris Evan Photography", website: "https://www.chrisevanphotography.com/", email: "cephoto.manager@gmail.com", city: "Los Angeles", state: "CA" },
  { name: "Dana Patrick", website: "https://www.danapatrickphoto.com/", email: "booking@danapatrickphoto.com", city: "Los Angeles", state: "CA" },
  { name: "David Muller Photography", website: "http://www.davidmullerphotography.com/", email: "studio@davidmullerphotography.com", city: "Los Angeles", state: "CA" },
  { name: "Dylan Patrick", website: "https://dylanpatrick.com/home/cinematic-headshots", email: "dylan@dylanpatrick.com", city: "Los Angeles", state: "CA" },
  { name: "James Depietro", website: "https://headshotsbyjd.com/", email: "james_d_123@hotmail.com", city: "Los Angeles", state: "CA" },
  { name: "Jessica Sherman Headshots", website: "http://jessicashermanphotography.com/", email: "jessica@jessicashermanphotography.com", city: "Los Angeles", state: "CA" },
  { name: "Ken Weingart Photography", website: "https://www.kenweingart.com/headshot-photographer/", email: "ken@weingartphoto.com", city: "Los Angeles", state: "CA" },
  { name: "Kenneth Dolin", website: "https://www.kennethdolin.com/actors", email: "info@kennethdolin.com", city: "Los Angeles", state: "CA" },
  { name: "LA PhotoSpot / Todd Tyler", website: "https://www.laphotospot.com/", email: "info@LAphotoSpot.com", city: "Los Angeles", state: "CA" },
  { name: "Laura Burke", website: "https://www.lauraburkephotography.com/", email: "lauraburkephotography@gmail.com", city: "Los Angeles", state: "CA" },
  { name: "Marc Cartwright Headshots", website: "https://www.marccartwrightheadshots.com/", email: "HeadshotsByMarc@gmail.com", city: "Los Angeles", state: "CA" },
  { name: "Michael Hiller", website: "http://www.michaelhiller.com/", email: "michaelhiller777@gmail.com", city: "Los Angeles", state: "CA" },
  { name: "Michael Roud Photography", website: "https://michaelroud.com/", email: "info@michaelroud.com", city: "Los Angeles", state: "CA" },
  { name: "Molly Pan Photography", website: "https://www.mollypanphoto.com/", email: "mollypanphotography@gmail.com", city: "Los Angeles", state: "CA" },
  { name: "Monesson Photography / Josh Monesson", website: "https://www.monessonphotography.com/", email: "joshuamonesson@yahoo.com", city: "Los Angeles", state: "CA" },
  { name: "Paul Gregory Headshots", website: "https://www.paulgregoryphotography.com/", email: "paulgregoryphoto@me.com", city: "Los Angeles", state: "CA" },
  { name: "Sergio Garcia", website: "https://www.sergiogarciaheadshots.com/", email: "i.sergiogarcia@me.com", city: "Los Angeles", state: "CA" },
  { name: "Sosa Headshots", website: "https://www.shotbysosa.com/", email: "sosashotit@gmail.com", city: "Los Angeles", state: "CA" },
  { name: "Stepanyan Photography / Seda Stepanyan", website: "https://stepanyanphotography.com/", email: "seda@stepanyanphotography.com", city: "Los Angeles", state: "CA" },
  { name: "Stephanie Girard", website: "https://www.stephgirardheadshots.com/", email: "studio@stephgirardheadshots.com", city: "Los Angeles", state: "CA" },
  { name: "Studio Roy", website: "http://studioroy.com/", email: "lisa@studioroy.com", city: "Los Angeles", state: "CA" },
  { name: "The Light Committee", website: "https://thelightcommittee.com/actor-headshots/", email: "rafael@thelightcommittee.com", city: "Los Angeles", state: "CA" },

  // New York, NY
  { name: "Baza Productions", website: "https://baza.productions", email: "baza4studio@gmail.com", city: "New York", state: "NY" },
  { name: "Ben Esner Photography", website: "https://benesner.com/", email: "ben@benesner.com", city: "New York", state: "NY" },
  { name: "CEOportriat", website: "https://www.ceoportrait.com/", email: "info@ceoportrait.com", city: "New York", state: "NY" },
  { name: "Chris Macke Photography", website: "https://www.mackephotography.com/", email: "chris@mackephotography.com", city: "New York", state: "NY" },
  { name: "Christian Webb", website: "https://www.christianwebbphoto.com/projects", email: "chris@christianwebbphoto.com", city: "New York", state: "NY" },
  { name: "City Headshots", website: "https://www.cityheadshots.com/", email: "info@cityheadshots.com", city: "New York", state: "NY" },
  { name: "David Genik", website: "https://www.davidgenik.com/", email: "david@davidgenik.com", city: "New York", state: "NY" },
  { name: "David Noles", website: "http://www.davidnoles.com/", email: "hello@davidnoles.com", city: "New York", state: "NY" },
  { name: "Downtown Headshots NYC", website: "https://downtownheadshotsnyc.com/", email: "cb@cbimage.com", city: "New York", state: "NY" },
  { name: "Emily Lambert Photography", website: "https://www.emilylambertphoto.com/", email: "info@emilylambertphoto.com", city: "New York", state: "NY" },
  { name: "Hancock Headshots", website: "http://www.hancockheadshots.com/", email: "studio@hancockheadshots.com", city: "New York", state: "NY" },
  { name: "Jeffrey Mosier Photography", website: "http://www.jeffreymosierphotography.com/", email: "jeffreymosierphotography01@gmail.com", city: "New York", state: "NY" },
  { name: "Jeremy Folmer Photography", website: "https://www.jeremyfolmer.com/", email: "mail@jeremyfolmer.com", city: "New York", state: "NY" },
  { name: "Jessica Osber Photography", website: "https://osberphotos.com/", email: "info@osberphotos.com", city: "New York", state: "NY" },
  { name: "Joe Henson", website: "https://www.joehenson.com/", email: "joe@joehenson.com", city: "New York", state: "NY" },
  { name: "Joe Jenkins", website: "https://www.joejenkinsphoto.com/", email: "info@joejenkinsphoto.com", city: "New York", state: "NY" },
  { name: "Jordan Matter Studio", website: "https://www.jordanmatter.com/photography/head-shots", email: "info@jordanmatter.com", city: "New York", state: "NY" },
  { name: "JW Headshots", website: "https://www.jwheadshots.com/", email: "jamiya@jwheadshots.com", city: "New York", state: "NY" },
  { name: "Laura Volpacchio Photography", website: "https://lauravolpacchiophotography.com/", email: "hello@lauravolpacchiophotography.com", city: "New York", state: "NY" },
  { name: "Leslie Hassler Studio", website: "https://www.lesliehassler.com/actors", email: "leslie@lesliehassler.com", city: "New York", state: "NY" },
  { name: "Lindsay Van Norman Photography", website: "https://www.lindsayvannorman.com/", email: "lindsayvannormanphoto@gmail.com", city: "New York", state: "NY" },
  { name: "Mark Reay Photography", website: "http://markheadshots.com/", email: "markreay66@yahoo.com", city: "New York", state: "NY" },
  { name: "Melany Bernier", website: "http://www.melanybernier.com/", email: "info@melanybernier.com", city: "New York", state: "NY" },
  { name: "Melissa Hamburg Photography", website: "http://www.melissahamburg.com/", email: "melissahamburgphotography@gmail.com", city: "New York", state: "NY" },
  { name: "Mia Isabella Photography", website: "https://www.miaisabellaphotography.com/", email: "miaisa@gmail.com", city: "New York", state: "NY" },
  { name: "Michael Levy Photography", website: "https://www.michaellevyphoto.com/", email: "michael@mjlevy.com", city: "New York", state: "NY" },
  { name: "Nile Scott Studios", website: "https://nilescottstudios.com/", email: "nile@nilescottstudios.com", city: "New York", state: "NY" },
  { name: "Pic Me! Headshots", website: "https://www.picmeheadshots.com/", email: "contact@picmeheadshots.com", city: "New York", state: "NY" },
  { name: "Peter Hurley", website: "https://peterhurley.com/", email: "info@peterhurley.com", city: "New York", state: "NY" },
  { name: "Philip Kessler Studio", website: "http://www.philipkesslerphotography.com/", email: "philkphotos@gmail.com", city: "New York", state: "NY" },
  { name: "Ricardo Birnbaum Photographer", website: "https://www.ricardobirnbaumphotography.com/", email: "ricardobirnbaumphotography@gmail.com", city: "New York", state: "NY" },
  { name: "Sub/Urban Photography", website: "http://www.sub-urbanphotography.com/", email: "info@sub-urbanphotography.com", city: "New York", state: "NY" },
  { name: "Susan Stripling", website: "https://www.susanstripling.com/", email: "susan@susanstripling.com", city: "New York", state: "NY" },
  { name: "Ted Ely Headshots", website: "https://tedely.com/", email: "studio@tedely.com", city: "New York", state: "NY" },
  { name: "Tess Steinkolk / Brown Dog Productions", website: "https://www.tesssteinkolk.com/", email: "tess@tsteinkolk.com", city: "New York", state: "NY" },
  { name: "Todd Estrin Photography", website: "https://www.toddestrinphotography.com/", email: "todd@toddestrinphotography.com", city: "New York", state: "NY" },
  { name: "Xanthe Elbrick Photography", website: "https://www.xantheelbrickphotography.com/headshots.html", email: "xelbrickphotography@gmail.com", city: "New York", state: "NY" },

  // Chicago, IL
  { name: "Aaron Gang", website: "https://www.aarongang.com/", email: "hello@aarongang.com", city: "Chicago", state: "IL" },
  { name: "Janna Giacoppo", website: "http://www.jannagiacoppo.com/", email: "oneandotherproductions@gmail.com", city: "Chicago", state: "IL" },
  { name: "Gretchen Kelley", website: "https://www.gretchenkelley.com", email: "Info@GretchenKelley.com", city: "Chicago", state: "IL" },
  { name: "Jeff Kurysz", website: "https://jeffkuryszphotography.com", email: "jeffkurysz@gmail.com", city: "Chicago", state: "IL" },
  { name: "Joe Mazza", website: "https://www.bravelux.com", email: "Joe@bravelux.com", city: "Chicago", state: "IL" },
  { name: "Ian McClaren", website: "https://www.ianmclaren.com", email: "ian@ianphillips-mclaren.com", city: "Chicago", state: "IL" },
  { name: "Brian McConkey", website: "https://www.brianmcconkeyphotography.com", email: "brian@brianmcconkeyphotography.com", city: "Chicago", state: "IL" },
  { name: "Collin Quinn Rice", website: "https://www.collinquinnrice.com/photography", email: "cquinnheadshots@gmail.com", city: "Chicago", state: "IL" },
  { name: "Maia Rosenfeld", website: "https://www.letsdoshots.com", email: "maia@letsdoshots.com", city: "Chicago", state: "IL" },
  { name: "Popio Stumpf Photography", website: "https://www.popiostumpf.com", email: "info@popiostumpf.com", city: "Chicago", state: "IL" },
  { name: "312 Elements Headshot Photography", website: "https://312elements.com/", email: "info@312elements.com", city: "Chicago", state: "IL" },
  { name: "Johnny Knight Photo", website: "https://johnnyknightphoto.com", email: "hello@johnknight.co.uk", city: "Chicago", state: "IL" },
  { name: "Kyle Bondeson Photography", website: "https://www.kylebondeson.com", email: "kyle@kylebondeson.com", city: "Chicago", state: "IL" },
  { name: "Mike Sansone Photography", website: "https://mikesansonephotography.com/", email: "mike@mikesansonephotography.com", city: "Chicago", state: "IL" },

  // Boston, MA
  { name: "Boston Creative Headshots", website: "http://www.bostoncreativeheadshots.com/", email: "dp@bostoncreativeheadshots.com", city: "Boston", state: "MA" },
  { name: "Dina K Photography", website: "https://dinakphotography.com", email: "info@dinakphotography.com", city: "Boston", state: "MA" },
  { name: "Ellen Sargent Korsh Photography", website: "http://ellensargentkorsh.com", email: "ellenskorsh@gmail.com", city: "Boston", state: "MA" },
  { name: "Erica Derrickson", website: "https://ericaseye.com", email: "ericaderricka@gmail.com", city: "Boston", state: "MA" },
  { name: "Headshots Photography", website: "https://www.headshotsphoto.com/", email: "service@headshotsphoto.com", city: "Boston", state: "MA" },
  { name: "Kevin Day Photography", website: "https://kevindayphotography.com/potfolio/headshot", email: "kevinday710@gmail.com", city: "Boston", state: "MA" },
  { name: "Matthew Guillory Photography", website: "https://www.mattgphoto.com/galleries/headshots-creatives", email: "matt@mattgphoto.com", city: "Boston", state: "MA" },
  { name: "Maura Wayman", website: "https://www.maurawayman.com/actor-headshots/", email: "maura@maurawayman.com", city: "Boston", state: "MA" },
  { name: "Niles Scott Studios", website: "http://nilescottstudios.com/", email: "nile@nilescottstudios.com", city: "Boston", state: "MA" },

  // Texas Cities
  { name: "Shea Anne Studios", website: "https://sheaannestudios.com/", email: "info@sheaanne.com", city: "Dallas", state: "TX" },
  { name: "Actors Captured Headshots", website: "https://www.actorscapturedheadshots.com/", email: "currycarin@gmail.com", city: "Dallas", state: "TX" },
  { name: "TRG Headshots", website: "https://www.trgheadshots.com/", email: "travis@trgheadshots.com", city: "Dallas", state: "TX" },
  { name: "2mm Headshots", website: "https://2mmheadshotsandeventphotography.com/", email: "peter@2mmheadshotsandeventphotography.com", city: "Dallas", state: "TX" },
  { name: "MJ Marshall Headshots", website: "https://www.mgmarshallheadshots.com/", email: "mgmarshallphotography@gmail.com", city: "Dallas", state: "TX" },
  { name: "Headshot Professional Photographers", website: "https://www.headshotprofessional.com/", email: "JoeHeadshotPro@gmail.com", city: "Dallas", state: "TX" },
  { name: "Calvin Pennick JR Photography", website: "https://www.calvinpennickjrphotography.com/", email: "getinfo@calvinpennickjrphotography.com", city: "Houston", state: "TX" },
  { name: "Tonya Dailey Headshots", website: "https://tonya-dailey-photography.square.site/", email: "booking@tonyadailey.com", city: "Houston", state: "TX" },
  { name: "Chris Gillett (liketherazor.com)", website: "https://liketherazor.com/", email: "info@liketherazor.com", city: "Houston", state: "TX" },
  { name: "Tara Flannery Photography", website: "https://taraflannery.com/actor-and-model-headshots", email: "tara@taraflannery.com", city: "Houston", state: "TX" },
  { name: "Fred Taylor Photography", website: "https://fredtaylorphotography.com/", email: "fred@fredtaylorphotography.com", city: "Houston", state: "TX" },
  { name: "Ashley Ball Photography", website: "https://www.ashleyballphotography.com/", email: "ashley@ashleyballphotography.com", city: "San Antonio", state: "TX" },
  { name: "Steve Noreyko Headshots", website: "https://www.headshot-photos.com/", email: "steve@stevenoreyko.com", city: "Austin", state: "TX" },
  { name: "Austin Headshots (David Price)", website: "https://www.austintxheadshots.com/", email: "info@davidpricephotography.com", city: "Austin", state: "TX" },
];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

async function createListings() {
  console.log(`\n🎬 Creating ${photographers.length} headshot photographer listings...\n`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const photographer of photographers) {
    const slug = generateSlug(photographer.name);

    try {
      // Check if listing already exists
      const { data: existing } = await supabase
        .from("listings")
        .select("id, name")
        .eq("slug", slug)
        .single();

      if (existing) {
        console.log(`⏭️  SKIP: "${photographer.name}" (already exists)`);
        skipped++;
        continue;
      }

      // Create the listing
      const { data, error } = await supabase
        .from("listings")
        .insert({
          name: photographer.name,
          slug: slug,
          email: photographer.email,
          website: photographer.website,
          city: photographer.city,
          state: photographer.state,
          country: "United States",
          categories: ["Headshot Photographers"],
          status: "Live",
          plan: "Free",
          is_claimed: false,
          is_comped: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error(`❌ ERROR creating "${photographer.name}":`, error.message);
        errors++;
      } else {
        console.log(`✅ CREATED: "${photographer.name}" in ${photographer.city}, ${photographer.state}`);
        created++;
      }

      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (err) {
      console.error(`❌ EXCEPTION for "${photographer.name}":`, err);
      errors++;
    }
  }

  console.log(`\n📊 SUMMARY:`);
  console.log(`   ✅ Created: ${created}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`   📝 Total: ${photographers.length}\n`);

  console.log(`\n🎯 BREAKDOWN BY CITY:`);
  const cityCounts: Record<string, number> = {};
  photographers.forEach(p => {
    const key = `${p.city}, ${p.state}`;
    cityCounts[key] = (cityCounts[key] || 0) + 1;
  });
  Object.entries(cityCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([city, count]) => {
      console.log(`   ${city}: ${count} photographers`);
    });
}

createListings()
  .then(() => {
    console.log("\n✨ Script completed successfully!\n");
    process.exit(0);
  })
  .catch((err) => {
    console.error("\n💥 Script failed:", err);
    process.exit(1);
  });
