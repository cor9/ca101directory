-- Bulk insert 77 headshot photographers as Free listings
-- Run this in Supabase SQL Editor
-- All listings set to: Live status, Free plan, is_comped=true, is_claimed=false

INSERT INTO listings (
  name,
  slug,
  email,
  website,
  city,
  state,
  country,
  categories,
  status,
  plan,
  is_claimed,
  is_comped,
  created_at,
  updated_at
) VALUES

-- Los Angeles, CA (32 photographers)
('MT Photography (Michael Tari)', 'mt-photography-michael-tari', 'michaeltaristudios@gmail.com', 'https://www.mtphotographs.com/', 'Los Angeles', 'CA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('The Headshot Truck', 'the-headshot-truck', 'hello@capturely.com', 'https://www.headshottruck.com/', 'Los Angeles', 'CA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Actor Photo LA', 'actor-photo-la', 'gbrown777@pipeline.com', 'http://www.actorphotola.com/', 'Los Angeles', 'CA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Budget Headshots', 'budget-headshots', 'budgetheadshots@gmail.com', 'https://www.budgetheadshots.com/', 'Los Angeles', 'CA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Headshot Shop LA', 'headshot-shop-la', 'joseph@puhy.com', 'https://headshotshopla.com/actor-headshots', 'Los Angeles', 'CA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Anthony Mongiello Photography', 'anthony-mongiello-photography', 'anthonymongiello@gmail.com', 'https://www.anthonymongiello.com/', 'Los Angeles', 'CA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Bella Saville', 'bella-saville', 'bellasavillephotography@gmail.com', 'https://www.bellasavillephotography.com/', 'Los Angeles', 'CA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Brad Buckman', 'brad-buckman', 'studio@bradbuckman.com', 'https://www.buckmanheadshots.com/', 'Los Angeles', 'CA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Bradford Rogne', 'bradford-rogne', 'Info@RognePhoto.com', 'https://rognephoto.com/', 'Los Angeles', 'CA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Cathryn Farnsworth', 'cathryn-farnsworth', 'booking@cathrynfarnsworth.com', 'https://www.cathrynfarnsworthheadshots.com/', 'Los Angeles', 'CA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Chris Evan Photography', 'chris-evan-photography', 'cephoto.manager@gmail.com', 'https://www.chrisevanphotography.com/', 'Los Angeles', 'CA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Dana Patrick', 'dana-patrick', 'booking@danapatrickphoto.com', 'https://www.danapatrickphoto.com/', 'Los Angeles', 'CA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('David Muller Photography', 'david-muller-photography', 'studio@davidmullerphotography.com', 'http://www.davidmullerphotography.com/', 'Los Angeles', 'CA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Dylan Patrick', 'dylan-patrick', 'dylan@dylanpatrick.com', 'https://dylanpatrick.com/home/cinematic-headshots', 'Los Angeles', 'CA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('James Depietro', 'james-depietro', 'james_d_123@hotmail.com', 'https://headshotsbyjd.com/', 'Los Angeles', 'CA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Jessica Sherman Headshots', 'jessica-sherman-headshots', 'jessica@jessicashermanphotography.com', 'http://jessicashermanphotography.com/', 'Los Angeles', 'CA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Ken Weingart Photography', 'ken-weingart-photography', 'ken@weingartphoto.com', 'https://www.kenweingart.com/headshot-photographer/', 'Los Angeles', 'CA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Kenneth Dolin', 'kenneth-dolin', 'info@kennethdolin.com', 'https://www.kennethdolin.com/actors', 'Los Angeles', 'CA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('LA PhotoSpot / Todd Tyler', 'la-photospot-todd-tyler', 'info@LAphotoSpot.com', 'https://www.laphotospot.com/', 'Los Angeles', 'CA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Laura Burke', 'laura-burke', 'lauraburkephotography@gmail.com', 'https://www.lauraburkephotography.com/', 'Los Angeles', 'CA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Marc Cartwright Headshots', 'marc-cartwright-headshots', 'HeadshotsByMarc@gmail.com', 'https://www.marccartwrightheadshots.com/', 'Los Angeles', 'CA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Michael Hiller', 'michael-hiller', 'michaelhiller777@gmail.com', 'http://www.michaelhiller.com/', 'Los Angeles', 'CA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Michael Roud Photography', 'michael-roud-photography', 'info@michaelroud.com', 'https://michaelroud.com/', 'Los Angeles', 'CA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Molly Pan Photography', 'molly-pan-photography', 'mollypanphotography@gmail.com', 'https://www.mollypanphoto.com/', 'Los Angeles', 'CA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Monesson Photography / Josh Monesson', 'monesson-photography-josh-monesson', 'joshuamonesson@yahoo.com', 'https://www.monessonphotography.com/', 'Los Angeles', 'CA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Paul Gregory Headshots', 'paul-gregory-headshots', 'paulgregoryphoto@me.com', 'https://www.paulgregoryphotography.com/', 'Los Angeles', 'CA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Sergio Garcia', 'sergio-garcia', 'i.sergiogarcia@me.com', 'https://www.sergiogarciaheadshots.com/', 'Los Angeles', 'CA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Sosa Headshots', 'sosa-headshots', 'sosashotit@gmail.com', 'https://www.shotbysosa.com/', 'Los Angeles', 'CA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Stepanyan Photography / Seda Stepanyan', 'stepanyan-photography-seda-stepanyan', 'seda@stepanyanphotography.com', 'https://stepanyanphotography.com/', 'Los Angeles', 'CA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Stephanie Girard', 'stephanie-girard', 'studio@stephgirardheadshots.com', 'https://www.stephgirardheadshots.com/', 'Los Angeles', 'CA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Studio Roy', 'studio-roy', 'lisa@studioroy.com', 'http://studioroy.com/', 'Los Angeles', 'CA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('The Light Committee', 'the-light-committee', 'rafael@thelightcommittee.com', 'https://thelightcommittee.com/actor-headshots/', 'Los Angeles', 'CA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),

-- New York, NY (38 photographers)
('Baza Productions', 'baza-productions', 'baza4studio@gmail.com', 'https://baza.productions', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Ben Esner Photography', 'ben-esner-photography', 'ben@benesner.com', 'https://benesner.com/', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('CEOportriat', 'ceoportriat', 'info@ceoportrait.com', 'https://www.ceoportrait.com/', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Chris Macke Photography', 'chris-macke-photography', 'chris@mackephotography.com', 'https://www.mackephotography.com/', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Christian Webb', 'christian-webb', 'chris@christianwebbphoto.com', 'https://www.christianwebbphoto.com/projects', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('City Headshots', 'city-headshots', 'info@cityheadshots.com', 'https://www.cityheadshots.com/', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('David Genik', 'david-genik', 'david@davidgenik.com', 'https://www.davidgenik.com/', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('David Noles', 'david-noles', 'hello@davidnoles.com', 'http://www.davidnoles.com/', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Downtown Headshots NYC', 'downtown-headshots-nyc', 'cb@cbimage.com', 'https://downtownheadshotsnyc.com/', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Emily Lambert Photography', 'emily-lambert-photography', 'info@emilylambertphoto.com', 'https://www.emilylambertphoto.com/', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Hancock Headshots', 'hancock-headshots', 'studio@hancockheadshots.com', 'http://www.hancockheadshots.com/', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Jeffrey Mosier Photography', 'jeffrey-mosier-photography', 'jeffreymosierphotography01@gmail.com', 'http://www.jeffreymosierphotography.com/', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Jeremy Folmer Photography', 'jeremy-folmer-photography', 'mail@jeremyfolmer.com', 'https://www.jeremyfolmer.com/', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Jessica Osber Photography', 'jessica-osber-photography', 'info@osberphotos.com', 'https://osberphotos.com/', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Joe Henson', 'joe-henson', 'joe@joehenson.com', 'https://www.joehenson.com/', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Joe Jenkins', 'joe-jenkins', 'info@joejenkinsphoto.com', 'https://www.joejenkinsphoto.com/', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Jordan Matter Studio', 'jordan-matter-studio', 'info@jordanmatter.com', 'https://www.jordanmatter.com/photography/head-shots', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('JW Headshots', 'jw-headshots', 'jamiya@jwheadshots.com', 'https://www.jwheadshots.com/', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Laura Volpacchio Photography', 'laura-volpacchio-photography', 'hello@lauravolpacchiophotography.com', 'https://lauravolpacchiophotography.com/', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Leslie Hassler Studio', 'leslie-hassler-studio', 'leslie@lesliehassler.com', 'https://www.lesliehassler.com/actors', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Lindsay Van Norman Photography', 'lindsay-van-norman-photography', 'lindsayvannormanphoto@gmail.com', 'https://www.lindsayvannorman.com/', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Mark Reay Photography', 'mark-reay-photography', 'markreay66@yahoo.com', 'http://markheadshots.com/', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Melany Bernier', 'melany-bernier', 'info@melanybernier.com', 'http://www.melanybernier.com/', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Melissa Hamburg Photography', 'melissa-hamburg-photography', 'melissahamburgphotography@gmail.com', 'http://www.melissahamburg.com/', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Mia Isabella Photography', 'mia-isabella-photography', 'miaisa@gmail.com', 'https://www.miaisabellaphotography.com/', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Michael Levy Photography', 'michael-levy-photography', 'michael@mjlevy.com', 'https://www.michaellevyphoto.com/', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Nile Scott Studios', 'nile-scott-studios-ny', 'nile@nilescottstudios.com', 'https://nilescottstudios.com/', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Pic Me! Headshots', 'pic-me-headshots', 'contact@picmeheadshots.com', 'https://www.picmeheadshots.com/', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Peter Hurley', 'peter-hurley', 'info@peterhurley.com', 'https://peterhurley.com/', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Philip Kessler Studio', 'philip-kessler-studio', 'philkphotos@gmail.com', 'http://www.philipkesslerphotography.com/', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Ricardo Birnbaum Photographer', 'ricardo-birnbaum-photographer', 'ricardobirnbaumphotography@gmail.com', 'https://www.ricardobirnbaumphotography.com/', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Sub/Urban Photography', 'suburban-photography', 'info@sub-urbanphotography.com', 'http://www.sub-urbanphotography.com/', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Susan Stripling', 'susan-stripling', 'susan@susanstripling.com', 'https://www.susanstripling.com/', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Ted Ely Headshots', 'ted-ely-headshots', 'studio@tedely.com', 'https://tedely.com/', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Tess Steinkolk / Brown Dog Productions', 'tess-steinkolk-brown-dog-productions', 'tess@tsteinkolk.com', 'https://www.tesssteinkolk.com/', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Todd Estrin Photography', 'todd-estrin-photography', 'todd@toddestrinphotography.com', 'https://www.toddestrinphotography.com/', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Xanthe Elbrick Photography', 'xanthe-elbrick-photography', 'xelbrickphotography@gmail.com', 'https://www.xantheelbrickphotography.com/headshots.html', 'New York', 'NY', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),

-- Chicago, IL (14 photographers)
('Aaron Gang', 'aaron-gang', 'hello@aarongang.com', 'https://www.aarongang.com/', 'Chicago', 'IL', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Janna Giacoppo', 'janna-giacoppo', 'oneandotherproductions@gmail.com', 'http://www.jannagiacoppo.com/', 'Chicago', 'IL', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Gretchen Kelley', 'gretchen-kelley', 'Info@GretchenKelley.com', 'https://www.gretchenkelley.com', 'Chicago', 'IL', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Jeff Kurysz', 'jeff-kurysz', 'jeffkurysz@gmail.com', 'https://jeffkuryszphotography.com', 'Chicago', 'IL', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Joe Mazza', 'joe-mazza', 'Joe@bravelux.com', 'https://www.bravelux.com', 'Chicago', 'IL', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Ian McClaren', 'ian-mcclaren', 'ian@ianphillips-mclaren.com', 'https://www.ianmclaren.com', 'Chicago', 'IL', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Brian McConkey', 'brian-mcconkey', 'brian@brianmcconkeyphotography.com', 'https://www.brianmcconkeyphotography.com', 'Chicago', 'IL', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Collin Quinn Rice', 'collin-quinn-rice', 'cquinnheadshots@gmail.com', 'https://www.collinquinnrice.com/photography', 'Chicago', 'IL', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Maia Rosenfeld', 'maia-rosenfeld', 'maia@letsdoshots.com', 'https://www.letsdoshots.com', 'Chicago', 'IL', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Popio Stumpf Photography', 'popio-stumpf-photography', 'info@popiostumpf.com', 'https://www.popiostumpf.com', 'Chicago', 'IL', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('312 Elements Headshot Photography', '312-elements-headshot-photography', 'info@312elements.com', 'https://312elements.com/', 'Chicago', 'IL', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Johnny Knight Photo', 'johnny-knight-photo', 'hello@johnknight.co.uk', 'https://johnnyknightphoto.com', 'Chicago', 'IL', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Kyle Bondeson Photography', 'kyle-bondeson-photography', 'kyle@kylebondeson.com', 'https://www.kylebondeson.com', 'Chicago', 'IL', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Mike Sansone Photography', 'mike-sansone-photography', 'mike@mikesansonephotography.com', 'https://mikesansonephotography.com/', 'Chicago', 'IL', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),

-- Boston, MA (9 photographers)
('Boston Creative Headshots', 'boston-creative-headshots', 'dp@bostoncreativeheadshots.com', 'http://www.bostoncreativeheadshots.com/', 'Boston', 'MA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Dina K Photography', 'dina-k-photography', 'info@dinakphotography.com', 'https://dinakphotography.com', 'Boston', 'MA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Ellen Sargent Korsh Photography', 'ellen-sargent-korsh-photography', 'ellenskorsh@gmail.com', 'http://ellensargentkorsh.com', 'Boston', 'MA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Erica Derrickson', 'erica-derrickson', 'ericaderricka@gmail.com', 'https://ericaseye.com', 'Boston', 'MA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Headshots Photography', 'headshots-photography-boston', 'service@headshotsphoto.com', 'https://www.headshotsphoto.com/', 'Boston', 'MA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Kevin Day Photography', 'kevin-day-photography', 'kevinday710@gmail.com', 'https://kevindayphotography.com/potfolio/headshot', 'Boston', 'MA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Matthew Guillory Photography', 'matthew-guillory-photography', 'matt@mattgphoto.com', 'https://www.mattgphoto.com/galleries/headshots-creatives', 'Boston', 'MA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Maura Wayman', 'maura-wayman', 'maura@maurawayman.com', 'https://www.maurawayman.com/actor-headshots/', 'Boston', 'MA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Niles Scott Studios', 'niles-scott-studios-boston', 'nile@nilescottstudios.com', 'http://nilescottstudios.com/', 'Boston', 'MA', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),

-- Texas Cities (14 photographers)
('Shea Anne Studios', 'shea-anne-studios', 'info@sheaanne.com', 'https://sheaannestudios.com/', 'Dallas', 'TX', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Actors Captured Headshots', 'actors-captured-headshots', 'currycarin@gmail.com', 'https://www.actorscapturedheadshots.com/', 'Dallas', 'TX', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('TRG Headshots', 'trg-headshots', 'travis@trgheadshots.com', 'https://www.trgheadshots.com/', 'Dallas', 'TX', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('2mm Headshots', '2mm-headshots', 'peter@2mmheadshotsandeventphotography.com', 'https://2mmheadshotsandeventphotography.com/', 'Dallas', 'TX', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('MJ Marshall Headshots', 'mj-marshall-headshots', 'mgmarshallphotography@gmail.com', 'https://www.mgmarshallheadshots.com/', 'Dallas', 'TX', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Headshot Professional Photographers', 'headshot-professional-photographers', 'JoeHeadshotPro@gmail.com', 'https://www.headshotprofessional.com/', 'Dallas', 'TX', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Calvin Pennick JR Photography', 'calvin-pennick-jr-photography', 'getinfo@calvinpennickjrphotography.com', 'https://www.calvinpennickjrphotography.com/', 'Houston', 'TX', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Tonya Dailey Headshots', 'tonya-dailey-headshots', 'booking@tonyadailey.com', 'https://tonya-dailey-photography.square.site/', 'Houston', 'TX', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Chris Gillett (liketherazor.com)', 'chris-gillett-liketherazorcom', 'info@liketherazor.com', 'https://liketherazor.com/', 'Houston', 'TX', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Tara Flannery Photography', 'tara-flannery-photography', 'tara@taraflannery.com', 'https://taraflannery.com/actor-and-model-headshots', 'Houston', 'TX', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Fred Taylor Photography', 'fred-taylor-photography', 'fred@fredtaylorphotography.com', 'https://fredtaylorphotography.com/', 'Houston', 'TX', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Ashley Ball Photography', 'ashley-ball-photography', 'ashley@ashleyballphotography.com', 'https://www.ashleyballphotography.com/', 'San Antonio', 'TX', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Steve Noreyko Headshots', 'steve-noreyko-headshots', 'steve@stevenoreyko.com', 'https://www.headshot-photos.com/', 'Austin', 'TX', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW()),
('Austin Headshots (David Price)', 'austin-headshots-david-price', 'info@davidpricephotography.com', 'https://www.austintxheadshots.com/', 'Austin', 'TX', 'United States', ARRAY['Headshot Photographers'], 'Live', 'Free', false, true, NOW(), NOW())

ON CONFLICT (slug) DO NOTHING;

-- Summary
-- Total: 77 headshot photographers
-- Los Angeles: 32
-- New York: 38
-- Chicago: 14
-- Boston: 9
-- Dallas: 6
-- Houston: 5
-- San Antonio: 1
-- Austin: 2
