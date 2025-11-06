/**
 * One-time script to bulk insert 53 talent managers into Supabase
 * Run with: npx tsx scripts/insert-talent-managers.ts
 */

import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const talentManagers = [
  { name: 'The Zachary Co', website: 'https://www.facebook.com/thezacharyco/', email: null, phone: null, city: 'Los Angeles', state: 'CA', region: ['West Coast'] },
  { name: 'Zero Gravity', website: 'https://www.zerogravitymanagement.com/', email: 'zerogravitytalent@gmail.com', phone: '818-783-3131', city: 'Los Angeles', state: 'CA', region: ['West Coast'] },
  { name: 'Vanguard Management Group', website: 'https://www.vmgtalent.com/', email: 'vanguardmgt@gmail.com', phone: '818-264-1020', city: 'Los Angeles', state: 'CA', region: ['West Coast'] },
  { name: 'TANDM Management', website: 'https://tandmtalent.com/', email: 'info@tandmtalent.com', phone: '818-888-2137', city: 'Burbank', state: 'CA', region: ['West Coast'] },
  { name: 'TalentINK', website: 'https://www.talentinkmanagement.com/', email: 'kari@talentinkmanagement.com', phone: '213-284-6423', city: 'Los Angeles', state: 'CA', region: ['West Coast'] },
  { name: 'Stein Entertainment Group', website: 'http://steinent.com/', email: 'steinentertainmentgroup@sbcglobal.net', phone: '818-763-3830', city: 'Los Angeles', state: 'CA', region: ['West Coast'] },
  { name: 'Serendipity Entertainment', website: 'https://www.facebook.com/serendipityent/', email: 'serendipitykids101@gmail.com', phone: null, city: 'Studio City', state: 'CA', region: ['West Coast'] },
  { name: 'Monroe Talent Management', website: 'https://www.monroetm.com/', email: null, phone: '305-985-5500', city: 'Miami Beach', state: 'FL', region: ['Southeast'] },
  { name: 'Merging Artists', website: 'http://www.mergingartists.com/', email: 'info@mergingartists.com', phone: '818-262-5656', city: 'Burbank', state: 'CA', region: ['West Coast'] },
  { name: "Lil' Angels Unlimited", website: 'https://lilangelskids.com/', email: 'lilangelsunlimitedinc@gmail.com', phone: '404-394-1800', city: 'Fayetteville', state: 'GA', region: ['Southeast'] },
  { name: 'Gregg Baker Management', website: 'http://www.gbmmanagement.com/', email: 'info@gbmmanagement.com', phone: '310-260-0040', city: 'Los Angeles', state: 'CA', region: ['West Coast'] },
  { name: 'Five Star Talent Management', website: 'https://www.facebook.com/pages/Five-Star-Talent-Management/133799206669990', email: 'kkupsick@bellsouth.net', phone: '404-667-1021', city: 'Roswell', state: 'GA', region: ['Southeast'] },
  { name: 'Entertainment Lab', website: 'https://www.entertainmentlab.com/', email: 'entertainmentlab@earthlink.net', phone: '818-508-1005', city: 'Los Angeles', state: 'CA', region: ['West Coast'] },
  { name: 'DWKing Talent', website: 'http://www.dwkingtalent.com/', email: 'office@dwkingtalent.com', phone: '323-965-2603', city: 'Los Angeles', state: 'CA', region: ['West Coast'] },
  { name: 'Dream Talent Management', website: 'http://www.dreamtalentmgmt.com/', email: 'info@dreamtalentmgmt.com', phone: '818-760-4160', city: 'Burbank', state: 'CA', region: ['West Coast'] },
  { name: 'Discover Management', website: 'http://www.discovermgmt.com/', email: 'office@discovermgmt.com', phone: '310-651-1117', city: 'West Hollywood', state: 'CA', region: ['West Coast'] },
  { name: 'Barney Oldfield', website: 'http://barneyoldfield.com/', email: 'barneyoldfield@earthlink.net', phone: '310-274-9174', city: 'Los Angeles', state: 'CA', region: ['West Coast'] },
  { name: 'Brilliant Talent Management', website: 'http://brillianttalent.com/', email: 'submissions@brillianttalent.com', phone: '818-508-5530', city: 'Studio City', state: 'CA', region: ['West Coast'] },
  { name: 'Bicoastal Mgmt', website: 'http://bicoastalmgmt.com/', email: 'office@bicoastalmgmt.com', phone: '818-752-7400', city: 'Studio City', state: 'CA', region: ['West Coast'] },
  { name: 'BAM Management', website: 'http://bam-mgmt.com/', email: 'submissions@bam-mgmt.com', phone: '323-658-7500', city: 'Los Angeles', state: 'CA', region: ['West Coast'] },
  { name: 'BAC Talent', website: 'http://www.bactalent.com/', email: 'bac.talent@gmail.com', phone: '818-760-4113', city: 'Burbank', state: 'CA', region: ['West Coast'] },
  { name: 'Aspire Talent Management', website: 'http://www.aspire-talent-mgt.com/', email: 'info@aspire-talent-mgt.com', phone: '424-653-7990', city: 'Los Angeles', state: 'CA', region: ['West Coast'] },
  { name: 'Apollo Talent Management', website: 'http://www.apollotalent.net/', email: null, phone: '818-850-9933', city: 'Sherman Oaks', state: 'CA', region: ['West Coast'] },
  { name: 'Apex Talent Group', website: 'http://www.apextalentgroup.org/', email: 'talent@apextalentgroup.org', phone: '818-298-6599', city: 'Burbank', state: 'CA', region: ['West Coast'] },
  { name: 'Ally Taylor Artists', website: 'http://www.allytaylorartists.com/', email: 'clients@allytaylorartists.com', phone: '818-508-3383', city: 'Burbank', state: 'CA', region: ['West Coast'] },
  { name: 'Agency Talent Group', website: 'https://www.agencytalentgroup.com/', email: 'info@agencytalentgroup.com', phone: '310-866-0196', city: 'Los Angeles', state: 'CA', region: ['West Coast'] },
  { name: '5J Management', website: 'https://www.5jmanagement.com/', email: 'info@5jmanagement.com', phone: '818-887-1834', city: 'Burbank', state: 'CA', region: ['West Coast'] },
  { name: "Adele's Kids", website: 'http://www.adeleskids.com/', email: 'idelahunt@aol.com', phone: '404-522-8154', city: 'Atlanta', state: 'GA', region: ['Southeast'] },
  { name: 'Alison Caiola Management', website: 'http://www.alisoncaiola.com/', email: null, phone: '973-366-0333', city: 'Wayne', state: 'NJ', region: ['Mid-Atlantic'] },
  { name: 'Anthony & Associates', website: 'http://www.anthonyandassociates.com/', email: 'anthonyandassoc@verizon.net', phone: '609-737-8882', city: 'Lawrenceville', state: 'NJ', region: ['Mid-Atlantic'] },
  { name: 'Breakaway Talent', website: 'http://breakawaytalent.com/', email: 'mgmt@breakawaytalent.com', phone: '718-878-1111', city: 'Brooklyn', state: 'NY', region: ['Mid-Atlantic'] },
  { name: 'CP Talent Management', website: 'http://www.cptalentmgmt.com/', email: 'cptalentmgt@aol.com', phone: '818-881-2026', city: 'Northridge', state: 'CA', region: ['West Coast'] },
  { name: 'CPM Talent Management', website: 'https://www.cpmtalentmanagement.com/', email: 'cpmtalentmanagement@gmail.com', phone: '818-906-3999', city: 'Van Nuys', state: 'CA', region: ['West Coast'] },
  { name: 'Dream Maker Talent Management', website: 'http://dreammakertalent.com/', email: 'dreammakertalent@yahoo.com', phone: '404-394-9933', city: 'Fayetteville', state: 'GA', region: ['Southeast'] },
  { name: 'Harvest Talent Management', website: 'http://harvesttalentmanagement.com/', email: 'harvesttalentmanagement@gmail.com', phone: '818-914-7914', city: 'Van Nuys', state: 'CA', region: ['West Coast'] },
  { name: 'Ingrid French Management', website: 'http://www.ingridfrenchtalent.com/', email: 'ingridfrenchtalent@gmail.com', phone: '818-506-8388', city: 'Los Angeles', state: 'CA', region: ['West Coast'] },
  { name: 'Ken Park Management', website: 'https://www.kenparkmanagement.com/', email: 'office@kenparkmanagement.com', phone: '818-760-4414', city: 'Burbank', state: 'CA', region: ['West Coast'] },
  { name: 'Lampiasi Talent Management', website: 'http://lampiasitalent.com/', email: 'lampiasitalent@gmail.com', phone: '805-987-3366', city: 'Camarillo', state: 'CA', region: ['West Coast'] },
  { name: 'Noveaux', website: 'http://www.noveaux.com/', email: 'office@noveaux.com', phone: '310-281-1950', city: 'West Hollywood', state: 'CA', region: ['West Coast'] },
  { name: 'Parkside Talent', website: 'http://www.parksidetalent.com/', email: 'suechildcare@yahoo.com', phone: '818-914-6633', city: 'Van Nuys', state: 'CA', region: ['West Coast'] },
  { name: 'Persona Management', website: 'http://www.personamgmt.com/', email: 'info@personamgmt.com', phone: '818-907-6846', city: 'Studio City', state: 'CA', region: ['West Coast'] },
  { name: 'Prestige Management Group', website: 'http://www.pmgkids.com/', email: 'info@pmgkids.com', phone: '818-884-0700', city: 'North Hollywood', state: 'CA', region: ['West Coast'] },
  { name: 'RAVE Talent Management', website: 'http://www.ravetalentmanagement.com/', email: 'ravetalentmgmt@mac.com', phone: '818-762-6283', city: 'Burbank', state: 'CA', region: ['West Coast'] },
  { name: 'Roger Paul', website: 'http://www.rogerpaul.com/', email: 'rogerpaul@rogerpaul.com', phone: '818-509-1010', city: 'Studio City', state: 'CA', region: ['West Coast'] },
  { name: 'Rybin Talent Management', website: 'http://rybintalent.com/', email: 'office@rybintalent.com', phone: '818-380-5677', city: 'Los Angeles', state: 'CA', region: ['West Coast'] },
  { name: 'SquarePeg Group', website: 'http://squarepeggroup.com/', email: 'office@squarepeggroup.com', phone: '818-345-5510', city: 'Studio City', state: 'CA', region: ['West Coast'] },
  { name: 'Talent Express', website: 'http://www.talentexpress.net/', email: 'info@talentexpress.net', phone: '818-883-5650', city: 'Northridge', state: 'CA', region: ['West Coast'] },
  { name: "Tannen's Talent", website: 'http://www.tannenstalent.com/', email: 'tannenstalent@att.net', phone: '818-762-3191', city: 'North Hollywood', state: 'CA', region: ['West Coast'] },
  { name: 'Terrific Talent', website: 'http://terrifictalent.com/', email: 'info@terrifictalent.com', phone: '818-789-2002', city: 'Studio City', state: 'CA', region: ['West Coast'] },
  { name: 'TM Talent', website: 'http://www.tmtalent.biz/', email: 'tmtalent2@aol.com', phone: '818-509-2000', city: 'Sherman Oaks', state: 'CA', region: ['West Coast'] },
  { name: 'Tsu Tsu Unlimited', website: 'http://www.tsutsumgmt.com/', email: 'mike@tsutsumgmt.com', phone: '818-760-4660', city: 'Studio City', state: 'CA', region: ['West Coast'] },
  { name: 'WSM Talent', website: 'http://www.wsmtalent.com/', email: 'info@wsmtalent.com', phone: '818-760-4545', city: 'Burbank', state: 'CA', region: ['West Coast'] },
  { name: 'Zanee Entertainment', website: 'http://www.zaneeent.com/', email: 'zanee@zaneeent.com', phone: '818-887-1994', city: 'Burbank', state: 'CA', region: ['West Coast'] },
];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function insertTalentManagers() {
  console.log(`Preparing to insert ${talentManagers.length} talent managers...`);

  const listings = talentManagers.map(tm => ({
    slug: generateSlug(tm.name),
    listing_name: tm.name,
    website: tm.website,
    email: tm.email,
    phone: tm.phone,
    city: tm.city,
    state: tm.state,
    region: tm.region,
    categories: ['Talent Managers'],
    plan: 'Free',
    status: 'Pending',
    is_claimed: false,
    is_active: true,
  }));

  console.log('Sample listing:', listings[0]);

  const { data, error } = await supabase
    .from('listings')
    .insert(listings)
    .select();

  if (error) {
    console.error('Error inserting talent managers:', error);
    process.exit(1);
  }

  console.log(`✅ Successfully inserted ${data?.length || 0} talent managers!`);
  console.log('First 3 inserted:', data?.slice(0, 3).map(d => d.listing_name));
}

insertTalentManagers();
