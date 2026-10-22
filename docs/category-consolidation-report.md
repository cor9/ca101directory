# Category consolidation report

Branch: `claude/stoic-rubin-87ssik` (preview only; not merged, not deployed to production).

**Nothing in Supabase was modified.** No categories, listing associations, schema
or rows were changed or deleted. All database queries behind this report were
read-only `SELECT`s. The new taxonomy is a TypeScript compatibility layer
(`src/lib/category-taxonomy.ts`) that maps the stored legacy values (names and
UUIDs) onto 13 primary categories at read time.

## How it works

- `listings.categories` still holds whatever it held before (mostly names, one
  UUID). `primariesForListing()` resolves each stored value (name, spelling
  variant or UUID) to a primary category.
- Consolidated filters return every listing stored under any rolled-up legacy
  category. A listing in several primaries stays discoverable under each; one
  deterministic primary (`primary_category_id` first, then stored order) is used
  for the card/profile headline.
- Specialty tags come from `listings.specialties` (preserved as saved) plus the
  few tags a legacy name directly implies (table below). Nothing else is inferred.
- Newly saved listings write the **primary category name** into the existing
  `categories` text[] and chosen specialties into the existing `specialties`
  text[]; both columns already existed and are owner-editable.
- Retired categories are removed from public navigation, the `/category` index,
  the filter dropdown, the sitemap and new-listing selection. Their URLs still
  render (noindex), their listings keep working, and general search still finds
  them.

## The 13 primary categories and what rolls up into them

### Services & Training

**Headshot Photographers** — `/category/headshot-photographers` — profile kind: service

| Legacy category | UUID | Derived specialty |
|---|---|---|
| Headshot Photographers | `e00fab44-e4ab-4834-966c-5058ac1af655` | — |

**Acting Training** — `/category/acting-training` — profile kind: service

| Legacy category | UUID | Derived specialty |
|---|---|---|
| Acting Classes & Coaches | `c0b8d6a5-436a-4004-b6b6-8b58a9f5b3d2` | — |
| Acting Schools | `10159a59-61f7-4375-8770-141b6ddc878f` | — |
| Audition Prep | `e4770486-0c03-4263-8d0b-99c11598ddbf` | Audition Coaching |
| Dialect Coach | `13a2c7ab-2036-4d0e-873c-4f8520e2aa29` | Dialect Coaching |
| Improv Classes | `c5236852-82be-48df-8762-85c2b18f0d76` | Improv |
| Theatre Training | `1f3ec0a8-f2b8-41c4-b5fd-c7b78c266629` | Theatre Training |
| Vocal Coaches | `0a568d20-66cc-45a9-819d-3bb81853fc82` | Vocal Training |
| Voiceover Support | `d4135f3b-1f60-4486-a625-074e8b4253ce` | Voiceover Training |

**Career Coaching & Consulting** — `/category/career-coaching-consulting` — profile kind: service

| Legacy category | UUID | Derived specialty |
|---|---|---|
| Branding Coaches | `c5ab8f4a-46a7-4228-96f7-3dc794144df0` | Personal Branding |
| Business of Acting | `7992d99a-6491-406e-b845-cfdb0986331d` | Business of Acting |
| Career Consulting | `54d02e9e-e984-4de0-97df-28fde1d18344` | Career Strategy |

**Demo Reels & Editing** — `/category/demo-reels-editing` — profile kind: service

| Legacy category | UUID | Derived specialty |
|---|---|---|
| Demo Reel Creators | `fb081d92-f853-47b2-809c-8e99c380b31a` | Demo Reel Production |
| Reel Editors | `3a04d4a2-736f-4f67-abb9-5f3cf917c536` | Reel Editing |

**Actor Marketing Services** — `/category/actor-marketing-services` — profile kind: service

| Legacy category | UUID | Derived specialty |
|---|---|---|
| Actor Websites | `a84faa6e-3deb-44c6-b415-051f73268d10` | Actor Websites |
| Publicists | `d0bf79f8-5c44-4a8e-9867-45f79fae887c` | Public Relations |
| Stylists | `7a6327b8-3de1-4c68-93ad-8927477cb9b3` | Personal Styling |

**Self-Tape Services** — `/category/self-tape-services` — profile kind: service

| Legacy category | UUID | Derived specialty |
|---|---|---|
| Self-Tape Support | `dff32333-23be-4cbc-86e6-9bde617e2ddd` | — |

**Set Sitters** — `/category/set-sitters` — profile kind: service

| Legacy category | UUID | Derived specialty |
|---|---|---|
| Set Sitters | `27c206de-8539-44d7-8e7c-ff14c99bec3e` | — |


### Talent Representation

**Talent Agents** — `/category/talent-agents` — profile kind: representation

| Legacy category | UUID | Derived specialty |
|---|---|---|
| Talent Agents | `78b32c61-a10e-478f-a464-a84ad9eaa075` | — |

**Talent Managers** — `/category/talent-managers` — profile kind: representation

| Legacy category | UUID | Derived specialty |
|---|---|---|
| Talent Managers | `472f7c28-e5cf-405e-82bd-f55b93407ae9` | — |

**Influencer Agents** — `/category/influencer-agents` — profile kind: representation

| Legacy category | UUID | Derived specialty |
|---|---|---|
| Influencer Agents | `22ffa1e8-394c-41c9-8f68-7e82d8656229` | — |


### Industry & On-Set Resources

**Background Casting** — `/category/background-casting` — profile kind: background_casting

| Legacy category | UUID | Derived specialty |
|---|---|---|
| Background Casting | `7019a3fc-ad32-43ff-9dc8-66cba7e15bb6` | — |

**Child Advocacy** — `/category/child-advocacy` — profile kind: child_advocacy

| Legacy category | UUID | Derived specialty |
|---|---|---|
| Child Advocacy | `573b762c-7c7a-44ab-8a33-f2caddb5e018` | — |

**Set Teachers** — `/category/set-teachers` — profile kind: set_teacher

| Legacy category | UUID | Derived specialty |
|---|---|---|
| Set Teachers | `bb4d85d6-334e-4bbe-848c-4948b42b6511` | — |


Spelling variants that are also stored in listings and resolve to the same
primary: `Headshot Photographer` (6), `Acting Coach` (15), `Acting School/Coach`
(3), `Acting School` (1), `Self Tape Support` (7). The UUID
`e00fab44-e4ab-4834-966c-5058ac1af655` (Headshot Photographers) is stored on one
listing and also resolves.

All UUIDs in the taxonomy were cross-checked against the live `categories` table
(zero mismatches).

## Legacy URL handling

| Legacy URL | Behavior |
|---|---|
| `/category/<primary-slug>` | Renders |
| `/category/acting-classes-coaches`, `/acting-schools`, `/theatre-training` etc. | 308 to `/category/acting-training` |
| `/category/audition-prep` | 308 to `/category/acting-training?specialty=Audition+Coaching` (same pattern for Improv, Dialect, Vocal, Voiceover, Reel Editors, Publicists, ...) |
| `/category/self-tape-support` | 308 to `/category/self-tape-services` |
| `/category/talent-showcases`, `/mental-health-for-performers`, `/casting-workshops` | Still render (noindex, not linked, not in sitemap); no redirect to an unrelated category |
| Unknown slug | 404 |

Query parameters (state, city, specialty) are preserved on redirect. `?page=`
is intentionally dropped. Only the 13 primaries are in the sitemap, so there are
no duplicate indexable pages.

## Retired categories: verified counts

| Retired category | UUID | Listings |
|---|---|---|
| Talent Showcases | `ca25586e-8cb2-40db-a06b-f6570a8952f9` | 1 |
| Mental Health for Performers | `a1f986a0-67ae-4d64-a725-2a936e928b5f` | 25 |
| Casting Workshops | `3aa69f4d-a391-4e22-92a3-9f49663e49e6` | 2 |
| **Total** | | **28** |

(Verified with read-only SQL against production; matches the expected 1/25/2 = 28.)

### Talent Showcases (1)

| Listing | ID | Plan | Other categories on the listing |
|---|---|---|---|
| Actorsite | `da084a22-5f0a-4a7b-8de7-1b05f6479667` | Founding Pro | Acting Classes & Coaches, Acting Schools, Audition Prep, Career Consulting, Business of Acting, Improv Classes, Theatre Training, Comedy Coaches, Self-Tape Support |

Stays discoverable under Acting Training, Career Coaching & Consulting and
Self-Tape Services. Recommendation: nothing to reassign.

### Casting Workshops (2) — only category on each listing

| Listing | ID | Plan | Recommendation |
|---|---|---|---|
| Stone Acting Studio | `af4fabe9-413a-4a2f-9d41-671914991019` | Free | Review. Name suggests Acting Training; confirm with owner. |
| Talent House Academy | `fadf6a05-b4d1-4c04-9ad3-e36344257661` | Free | Review. Name suggests Acting Training; confirm with owner. |

### Mental Health for Performers (25)

Three listings also carry other categories and remain discoverable there:

| Listing | ID | Plan | Other categories |
|---|---|---|---|
| Gloria Garayua Coaching | `13c97f23-62e7-458d-903f-c7890908fa52` | Founding Pro | Acting Classes & Coaches, Business of Acting, Comedy Coaches, Theatre Training, Self-Tape Support, Career Consulting, Audition Prep |
| The Wholehearted Actor with Clare Lopez | `1226038b-5a08-4fa6-bd5d-8e3fcd16a4b4` | Pro | Acting Classes & Coaches, Business of Acting, Self-Tape Support, Acting Schools, Audition Prep, Branding Coaches, Career Consulting, Child Advocacy, Stylists, Theatre Training, Actor Websites, Voiceover Support |
| Entertainment Community Fund | `92aff27f-6a61-485a-bd81-6b361f6f3c82` | Free | Child Advocacy |

The other **22** have Mental Health for Performers as their *only* category (all
Free), so they are no longer reachable from any category page, only from general
search and their own URLs:

| Listing | ID |
|---|---|
| Actors' Equity Association (UK) / BAPAM | `35e71b2e-7e0f-4a38-bfa7-5cffaeb3651c` |
| Adolph & Esther Gottlieb Emergency Grants | `15cda8d4-a1d2-4265-9b95-71b2d515a0e5` |
| Backline | `d5a95670-1631-43a5-a197-5afca799417e` |
| Behind the Scenes | `e58852f6-4f55-4025-8875-cc631a235087` |
| Clarity Therapy NYC | `9d871456-7254-44dd-ba69-09157547fc2b` |
| Creatives Care | `13d37c49-57df-4eff-9d40-92874d675fc7` |
| Jazz Foundation of America | `f4fae857-48a8-4364-8fd3-15dbb6d252f9` |
| Lauren Maher - Therapy for Artists and Creatives | `ea20e46d-fb7f-447b-94c8-fb3d7ec21439` |
| Max's Kansas City Project | `1aab3e14-2c11-4adf-ae7f-8af9bc36880f` |
| MusiCares | `006872d4-e4a3-49b7-8a59-ffc776a4fc94` |
| Nashville Therapy Group | `5326799b-c756-4773-be29-473f4e09358b` |
| ODC's Healthy Dancers' Clinic | `17a52fcd-bc50-480f-9f20-6133fc072c8f` |
| Psychology Today Therapy Directory | `1d4de1a9-a7f0-484d-9f24-e870eb1eb20d` |
| Rauschenberg Medical Emergency Grants (NYFA) | `7ccd0798-f852-4207-ab81-54bf9ec1c96a` |
| SAG-AFTRA Health Plan (via Carelon) | `13481892-8d34-4d60-b79e-c5a156142ca5` |
| Sweet Relief Musicians Fund | `1659ea6a-82f8-42f0-9d97-1d8696e29aad` |
| The Art Therapy Nest | `dbecddec-5017-46f6-afc7-395bcff48b25` |
| The Blues Foundation - HART Fund | `fac3b9da-a6c8-4972-bc9f-b1c712e265a7` |
| The Dancers' Resource (ECF) | `735ee737-bbd8-4e85-b0b5-b9da79cea8c0` |
| The Keely Group | `19132d3b-794a-4bb2-85f0-007ec519a113` |
| The Society for Neurodiversity | `6a3c9cd7-3a63-47b5-91b6-cca3beade293` |
| Zencare | `24c10be5-9b03-4f27-8c41-3a95c9465b15` |

Recommendation: none of the 13 categories fits these (therapy practices, grant
funds, health plans). Options for a human decision: leave as general-search-only,
or add a future "Wellness & Financial Support" resource category. They should
**not** be pushed into Child Advocacy or any unrelated category.

**Listings whose only category is retired: 24** (22 Mental Health + 2 Casting
Workshops).

## Ambiguous mappings (decisions to confirm)

| Item | Decision made | Why / risk |
|---|---|---|
| Stylists (48 listings) | Actor Marketing Services, derived tag "Personal Styling" | The brief lists Stylists there. Fits publicists/websites loosely; many are wardrobe/hair styling. Tag is flagged ambiguous. |
| Comedy Coaches (2: Actorsite, Gloria Garayua Coaching) | Left **unmapped** (value kept) | Not in the brief. Both listings are covered by other categories. Could become an Acting Training specialty "Comedy". |
| Aircheck (5 listings) | Left **unmapped** (value kept) | Not in the brief and not an obvious fit. See manual review list. |
| Theatre Training | Acting Training, derived tag "Theatre Training" | Brief says Acting Training; the tag was added so the distinction is not lost. |
| Acting Schools | Acting Training, **no** derived tag | A school is not a specialty. |
| Self-Tape Support → Self-Tape Services | Renamed, no derived tags | Brief: replaces Self-Tape Support. |
| Voiceover Support / Vocal Coaches | Acting Training with tags "Voiceover Training" / "Vocal Training" | As specified. |
| Business of Acting | Career Coaching & Consulting, tag "Business of Acting" | As specified. |
| Dance Classes | Unmapped; 0 listings use it | No action needed. |

Unused `categories` rows (0 listings): Content Creators, Cosmetic Dentistry,
Entertainment Lawyers, Event Calendars, Financial Advisors, Hair/Makeup Artists,
Lifestyle Photographers, Modeling Portfolios, Modeling/Print Agents, Social Media
Consultants, Speech Therapy, Stunt Training, Videographers, Wardrobe Consultant,
Dance Classes. They are not offered anywhere in the new UI.

## Listings needing manual review

- **Aircheck (5):** Act On This TV Actors' Network `6a70e94e-318c-4d7d-b94d-bd8532abf82a`, Actors Access `f3d458e2-d32a-4444-bae2-5c5c06eabebd`, Daily Actor (Aircheck) `89c1773f-a7f9-47e4-80fe-49e3ad51e8a9`, Master of Radio (Airchecks List) `29723d12-6ead-4f08-95e8-72a9ec76c082`, NYCastings `f1530ba4-08f3-416e-9ddc-6c2c870ab0dd`. Their only category is unmapped, so they appear in general search only. Recommendation: owner/admin decides (casting-notice sites do not fit any of the 13).
- **Casting Workshops (2):** Stone Acting Studio, Talent House Academy (above).
- **Mental Health for Performers, retired-only (22):** above.
- **No category at all (4):** unchanged; general search only.
- **Whitespace in slug (2 listings):** e.g. Actorsite has slug `"actorsite "` (trailing space). The listing page lookup tolerates this today; fix the data when convenient.
- **TEST listing:** a live listing named like a test record exists in production; consider unpublishing (not touched).

## Persistence limitations (documented, not migrated)

1. `categories` is a text[] of names. Saving from the new picker writes primary
   names, so a listing saved after this release may carry both an old legacy name
   and nothing else, or only the new primary name. Both resolve identically.
2. Free plan still allows one category; the picker counts every stored value
   against that limit so nothing is dropped silently. A Free listing that still
   carries a retired value must remove it (explicit "Remove" button) before it
   can choose a new one.
3. `updateListing` (dashboard edit) has no server-side category-count check
   (unchanged; the Free limit is enforced in the form and, for new submissions,
   in `submitToSupabase`). Entitlement logic was deliberately left alone.
4. Specialty tags are free text in `listings.specialties`; the picker offers a
   fixed list per category and shows any other saved tag so it can be removed.
5. The admin screens still use the raw legacy category list.
6. `/directory?category=<legacy name or UUID>` still works: it resolves to the
   primary (or retired) category through the same layer.

## Proposed future migration (NOT executed; needs separate approval)

Only if you later want the database itself to match the new taxonomy:

1. Add `categories` rows for the new names (Acting Training, Career Coaching &
   Consulting, Demo Reels & Editing, Actor Marketing Services, Self-Tape Services).
2. Backfill `listings.primary_category_id` from `primaryCategoryOf()` and merge
   derived tags into `listings.specialties`, in a transaction, after a dump of the
   affected rows.
3. Decide the fate of the 24 retired-only and 5 Aircheck listings first.
4. Remove the compatibility layer only after the backfill is verified.

None of this is required for the current behavior.
