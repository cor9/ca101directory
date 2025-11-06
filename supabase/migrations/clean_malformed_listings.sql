-- SQL script to clean malformed listings with URLs and HTML
-- Run this in Supabase SQL Editor

BEGIN;

-- Update Book From Tape (Jordan Brooks Robinson)
UPDATE listings
SET what_you_offer = 'Former acting studio (Orlando, FL) now providing private audition coaching, self‑tape services, headshot branding and virtual audition coaching; after the Orlando studio closed, coaches continue to guide actors and provide supportive self‑taping services.'
WHERE id = 'f044cf7a-57cb-4b65-a235-4b71fcc3fc4f';

-- Update CCC Acting Studio (Tameka Cruel)
UPDATE listings
SET what_you_offer = 'Garden Grove acting studio designed to "Create Confident Characters", led by Tameka Cruel. Offers group acting classes, private lessons and online classes for children aged 6‑17, focusing on audition skills, self‑tapes and scene work; emphasises a nurturing, family‑like environment.'
WHERE id = '083fb87a-29b5-42f5-9aef-290f42dfbbb1';

-- Update The Christiansen Acting Academy (Diane Christiansen)
UPDATE listings
SET what_you_offer = 'Award‑winning acting school in Agoura Hills offering in‑person and online acting classes for kids, teens and adults. Programs include "Next Generation" for younger students and Screen Test Live auditions; the academy nurtures talent and provides training to succeed in film and TV.'
WHERE id = 'a20166b7-a56b-463f-b38e-690b9e586502';

-- Update Young Actors Space (Patrick Day)
UPDATE listings
SET what_you_offer = 'Original and premier school for young actors founded in 1979. Offers classes for tykes, children, teens and adults, on‑camera and dialect courses, summer workshops and production conservatory; Patrick Day serves as artistic director and head instructor.'
WHERE id = '0ed13c4a-6887-465c-bfdf-d592f08de39d';

-- Update 3-2-1 Acting Studios (Mae Ross)
UPDATE listings
SET what_you_offer = 'Premier acting school for kids, teens and adults in Los Angeles and online. On‑camera classes taught by professional film & TV actors; sessions nurture beginners and advanced actors, instilling confidence and life skills.'
WHERE id = '1d4853aa-27b5-47dc-a9e1-7ce4c8d32fb1';

-- Update Actors Youth Academy (Yvette Pardo)
UPDATE listings
SET what_you_offer = 'Bilingual acting academy in Duarte, CA offering professional acting classes, on‑camera training, audition technique, scene study, improv, and Spanish language acting. Programs are six‑month sessions for ages 4‑8, 9‑17 and adults; includes headshots, filming days and agent showcase opportunities.'
WHERE id = '97735220-6d93-42f9-84a5-adeb0ba53bfd';

-- Update Align Public Relations
UPDATE listings
SET what_you_offer = 'Entertainment public relations team that crafts and maintains the public image of clients by developing strategic media campaigns, managing press relations and creating engaging content for talent and projects.'
WHERE id = 'cc384626-0802-475a-94f0-f5cb80525583';

-- Update Anderson Group Public Relations
UPDATE listings
SET what_you_offer = 'Worldwide entertainment public relations and brand‑management firm that crafts personalized media campaigns for film & TV actors, emerging stars and productions; the agency provides strategic publicity and digital entertainment PR.'
WHERE id = '566da08d-6bd1-47c1-8d5d-e3f9e0e4c08b';

-- Update Ayers Publicity
UPDATE listings
SET what_you_offer = 'Hollywood publicity firm that crafts narratives and provides media relations, event publicity, influencer relations, media training, crisis management and reputation management for clients.'
WHERE id = '9919f647-fe51-4024-8885-211d6513bd84';

-- Update Deena Freeman Kids & Teens Acting Studio
UPDATE listings
SET what_you_offer = 'Kids and teens acting classes focusing on acting for film and TV using Uta Hagen method and 40+ years of industry experience; offers improvisation workshops, audition prep, script analysis, business of acting, and occasional industry guest visits.'
WHERE id = 'a077f670-fa3b-4c9a-bfe7-2502bd81ff88';

-- Update EKC PR (Eileen Koch & Company)
UPDATE listings
SET what_you_offer = 'Full‑service publicist, branding and digital marketing firm providing publicity, brand development, marketing, advertising, product placement, media relations, photo‑shoots, press‑kit design and crisis/reputation management for actors and creative clients.'
WHERE id = '701a16ed-5178-4c89-89c4-4858b9a2a4c5';

-- Update Empyrean PR & Productions
UPDATE listings
SET what_you_offer = 'Beverly Hills communications firm offering public relations, productions, publications, positioning, event sponsorship, brand management, viral marketing and brand journalism services.'
WHERE id = 'dc92d4bb-4d7c-4ca8-8878-59234bdf0790';

-- Update Giovannie Espiritu – Hollywood Actors Workshop
UPDATE listings
SET what_you_offer = 'Award-winning filmmaker and acting coach offering online one-on-one and group coaching nationwide for kids, teens and young adults. Packages include audition game plans, pro actor coaching, scene study, self‑tape technique, business of acting and career planning.'
WHERE id = 'd139854b-304d-4516-8167-6298a541c633';

-- Update Gloria Garayua
UPDATE listings
SET what_you_offer = 'Los‑Angeles actress and CPS‑permitted acting coach offering private coaching sessions (30 or 60 minutes) and an online video series for true beginner actors. Her coaching helps pre‑teens through adults embrace strong choices and act smart.'
WHERE id = '3f031016-a053-4bbf-9f31-2a8e0cc47fde';

-- Update Holly Gagnier (Playhouse West private coach)
UPDATE listings
SET what_you_offer = 'Top private acting coach and senior staff/director at Playhouse West; trained under Sanford Meisner and other legendary teachers; offers script breakdown, audition coaching and career counseling for actors.'
WHERE id = 'c09d4e43-84cb-405c-bbb2-c5ea05a147d2';

-- Update Howard Fine Acting Studio (Gina Simms)
UPDATE listings
SET what_you_offer = 'Renowned acting studio offering classes and private coaching in acting technique, script analysis, audition technique, voice and speech, on‑camera acting and more. The studio is located at 7404 W Sunset Blvd in Los Angeles and welcomes inquiries for private coaching and audition prep.'
WHERE id = 'b16fab73-3191-4522-94a6-496ec42dd86b';

-- Update Jill Fritzo Public Relations
UPDATE listings
SET what_you_offer = 'Concierge‑level personal PR firm providing services such as personal PR, media relations, talent relations, crisis communications, reputation management, project‑based campaigns, brand management, broadcast/digital/print content strategy, strategic development and implementation, monitoring and measurement.'
WHERE id = '0b078937-6bb8-4f2b-acfd-c9db431a3a83';

-- Update John D'Aquino's Actors Workshop
UPDATE listings
SET what_you_offer = 'Workshops and classes for young actors taught by Disney actor John D''Aquino and team. Curriculum covers audition technique, booking the job, set etiquette and career goal management; many students have booked roles across Disney, Nickelodeon, film and Broadway.'
WHERE id = '0f386e73-f1fe-4df5-acc5-dbbfc1cfe0a1';

-- Update Keep It Real Acting Studios (Judy Kain)
UPDATE listings
SET what_you_offer = 'Acting studio offering small, intensive classes in commercial, TV and film acting for ages 8+; teachers are working industry professionals and emphasize grounded, specific work; training helps actors get audition‑ready.'
WHERE id = '440a2372-a6c1-4745-b900-e7001d1dcf31';

-- Update Khait & Co.
UPDATE listings
SET what_you_offer = 'Boutique entertainment PR firm providing strategic, high‑impact publicity for artists, creatives and entertainment professionals; services include media relations, narrative development, strategy and consulting.'
WHERE id = '4a4a66e6-df55-4539-8eb0-0f121b4cab7d';

-- Update LA Acting Studios (Morgan Hill, David Rountree, Rosie Garcia)
UPDATE listings
SET what_you_offer = 'On‑set, on‑camera acting studio and film production company in North Hollywood. Offers four‑week classes and foundational workshops where actors work every class on real sets with real crews, receiving footage after each session; 10 actors have become series regulars since 2020. Located at 5435 Cahuenga Blvd.'
WHERE id = '4616072d-3a55-45ac-929c-c44788f2f7b8';

-- Update Marnie Cooper School of Acting
UPDATE listings
SET what_you_offer = 'Acting school in Studio City offering classes for kids and teens aged 5‑21, along with private coaching and on‑set coaching. Marnie Cooper brings over 25 years of experience teaching beginners to master level; sessions focus on authentic performance and audition prep.'
WHERE id = '67f1fd73-7c3f-48da-bc1c-16d5dfeef79c';

-- Update Persona PR
UPDATE listings
SET what_you_offer = 'Full‑service public relations firm representing talent in film, television, music and more; services include awards‑season campaigns, event support, fashion and brand alignments, industry positioning, media relations, media tours, media training, nonprofit partnerships, online reputation management and crisis management.'
WHERE id = 'a54403dc-f719-45cb-95fd-e727cce072dd';

-- Update Press Kitchen
UPDATE listings
SET what_you_offer = 'Woman‑owned boutique PR agency providing creative strategy at the intersection of technology and entertainment; services include reputation management, media relations, brand strategy, thought leadership, speaking engagements, social‑media strategy, community management, start‑up launches and media coaching.'
WHERE id = '678efe59-8587-47d8-a71e-f703718e4c0a';

-- Update Revolver PR
UPDATE listings
SET what_you_offer = 'Female‑founded communications and marketing agency that specializes in lifestyle, sports and entertainment brands and figures, creating media attention and serving as an extension of clients'' teams.'
WHERE id = '06e3386c-b74a-4b30-b868-86094a1aa78c';

-- Update Sanguine PR
UPDATE listings
SET what_you_offer = 'Los‑Angeles‑based boutique public relations, marketing and management agency specializing in music and fashion PR that helps clients expand their brand by creating strategies that connect them with their target market.'
WHERE id = '4c1d87cd-588c-4a79-a204-0370e15dad5d';

-- Update Shari Shaw Acting & Performance Studios
UPDATE listings
SET what_you_offer = 'Studio City acting studio offering acting and performance training, including private consultations to assess training needs and evaluate materials. Students bring a one‑minute scene and receive a 15‑minute consultation; classes emphasize acting craft and self‑awareness.'
WHERE id = 'fff71e06-fe8d-4325-b0f3-a96dc827f597';

-- Update The Initiative Group
UPDATE listings
SET what_you_offer = 'Bi‑coastal entertainment and corporate lifestyle PR collective offering media relations, talent PR, special events, consumer products, fashion and lifestyle, hospitality/destination, brand/influencer partnerships, crisis & reputation management, social media, risk assessment and cause‑related PR.'
WHERE id = 'babc3251-6c21-4c30-b5e6-e14ac04b9967';

-- Update Turk PR (Turk Entertainment PR)
UPDATE listings
SET what_you_offer = 'Boutique full‑service public relations and productions firm representing Hollywood television and film actors, events and theatrical productions; the firm elevates clients'' public persona by promoting them on television, internet, radio, print and at Hollywood events and offers one‑on‑one attention.'
WHERE id = '65533550-7c42-4883-bd88-f4407fe1a2e3';

-- Update Tyler Barnett Public Relations (TBPR)
UPDATE listings
SET what_you_offer = 'Los Angeles‑based public relations agency specializing in innovation, strategy and results; offers public relations and marketing services for consumer brands and entertainment personalities.'
WHERE id = '0f7e19c9-9b3f-4a58-9080-ca7cd3cccc80';

-- Update Valerie Allen Public Relations (VAPR)
UPDATE listings
SET what_you_offer = 'Entertainment and lifestyle public relations and crisis‑communications firm offering full‑service PR, crisis communications, event publicity, media relations, media training, public affairs and strategic brand management for clients.'
WHERE id = '65516b0e-54bd-40f3-b958-90072cc0a729';

-- Update Young Actor's Studio (Jeff Alan‑Lee)
UPDATE listings
SET what_you_offer = 'Acting studio established in 1996 offering classes for kids, teens and young adults. Uses techniques from various acting methods; fosters a supportive environment where each student develops unique characters and builds confidence.'
WHERE id = '63fc8bc5-1d91-499c-8053-947b5d186d0c';

-- Update Young Actors Workspace (Lisa Picotte)
UPDATE listings
SET what_you_offer = 'Acting school founded by actor/coach Lisa Picotte; offers classes and workshops for kids and teens, focusing on audition technique and on‑camera performance. Provides supportive environment; located at 5571 Pico Blvd, Los Angeles.'
WHERE id = 'a502a0eb-21af-4c16-b71c-c61610d4fe7c';

-- Update Zak Barnett Studios
UPDATE listings
SET what_you_offer = 'Acting studio in Los Angeles focusing on the development of the whole self; offers classes, intensives and coaching for actors of all ages, including on‑camera and in‑person instruction; uses a holistic approach and encourages actors to grow personally and professionally.'
WHERE id = '171613e3-d2be-4ebc-88a9-c2a90cbb5e8b';

-- Update Clare Lopez – The Wholehearted Actor
UPDATE listings
SET what_you_offer = 'The WholeHearted Actor, led by Clare Lopez, provides private coaching, audition preparation, and on-camera training designed to support the whole performer—mind, body, and spirit. Focus on both the craft and the business of acting, offering guidance on mindset, branding, and self-tape execution.'
WHERE id = '1226038b-5a08-4fa6-bd5d-8e3fcd16a4b4';

-- Update Coaching with Corey
UPDATE listings
SET what_you_offer = 'Private audition coaching, self-tape strategy, and charisma-building for young actors. Each session is tailored to the actor''s current goals and upcoming auditions — whether preparing for a network comedy, streaming drama, or feature film. Helps kids make smart, specific, and emotionally connected choices on camera.'
WHERE id = '8f702a4f-1124-49c6-af8c-610fe2d687f1';

COMMIT;

-- Verification: Check that all listings were updated
SELECT
  id,
  listing_name,
  LEFT(what_you_offer, 100) as cleaned_text,
  CASE
    WHEN what_you_offer LIKE '%http%' THEN '❌ Still has URL'
    WHEN what_you_offer LIKE '%www.%' THEN '❌ Still has www'
    WHEN what_you_offer LIKE '%<p>%' THEN '❌ Still has HTML'
    ELSE '✅ Clean'
  END as status
FROM listings
WHERE id = ANY(ARRAY[
  'f044cf7a-57cb-4b65-a235-4b71fcc3fc4f',
  '083fb87a-29b5-42f5-9aef-290f42dfbbb1',
  'a20166b7-a56b-463f-b38e-690b9e586502',
  '0ed13c4a-6887-465c-bfdf-d592f08de39d',
  '1d4853aa-27b5-47dc-a9e1-7ce4c8d32fb1',
  '97735220-6d93-42f9-84a5-adeb0ba53bfd',
  'cc384626-0802-475a-94f0-f5cb80525583',
  '566da08d-6bd1-47c1-8d5d-e3f9e0e4c08b',
  '9919f647-fe51-4024-8885-211d6513bd84',
  'a077f670-fa3b-4c9a-bfe7-2502bd81ff88',
  '701a16ed-5178-4c89-89c4-4858b9a2a4c5',
  'dc92d4bb-4d7c-4ca8-8878-59234bdf0790',
  'd139854b-304d-4516-8167-6298a541c633',
  '3f031016-a053-4bbf-9f31-2a8e0cc47fde',
  'c09d4e43-84cb-405c-bbb2-c5ea05a147d2',
  'b16fab73-3191-4522-94a6-496ec42dd86b',
  '0b078937-6bb8-4f2b-acfd-c9db431a3a83',
  '0f386e73-f1fe-4df5-acc5-dbbfc1cfe0a1',
  '440a2372-a6c1-4745-b900-e7001d1dcf31',
  '4a4a66e6-df55-4539-8eb0-0f121b4cab7d',
  '4616072d-3a55-45ac-929c-c44788f2f7b8',
  '67f1fd73-7c3f-48da-bc1c-16d5dfeef79c',
  'a54403dc-f719-45cb-95fd-e727cce072dd',
  '678efe59-8587-47d8-a71e-f703718e4c0a',
  '06e3386c-b74a-4b30-b868-86094a1aa78c',
  '4c1d87cd-588c-4a79-a204-0370e15dad5d',
  'fff71e06-fe8d-4325-b0f3-a96dc827f597',
  'babc3251-6c21-4c30-b5e6-e14ac04b9967',
  '65533550-7c42-4883-bd88-f4407fe1a2e3',
  '0f7e19c9-9b3f-4a58-9080-ca7cd3cccc80',
  '65516b0e-54bd-40f3-b958-90072cc0a729',
  '63fc8bc5-1d91-499c-8053-947b5d186d0c',
  'a502a0eb-21af-4c16-b71c-c61610d4fe7c',
  '171613e3-d2be-4ebc-88a9-c2a90cbb5e8b',
  '1226038b-5a08-4fa6-bd5d-8e3fcd16a4b4',
  '8f702a4f-1124-49c6-af8c-610fe2d687f1'
]::uuid[])
ORDER BY listing_name;
