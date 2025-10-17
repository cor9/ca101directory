
Bauhaus Mid-Century Modern Hollywood Design System

This design system implements the aesthetic guidelines from FOR CURSOR/Guardrails.md to create a cohesive Bauhaus-inspired, mid-century modern Hollywood experience.

⸻

🎨 Color Philosophy

Cinema Backdrop
	•	Navy (--navy: #0C1A2B) — Primary background
	•	Deep Charcoal (--charcoal: #1E1F23) — Secondary dark surfaces

Screen / Card Canvas
	•	Soft Cream (--cream: #FFFDD0) — Card backgrounds
	•	Cream Ink (--cream-ink: #1B1F29) — Text color on cream cards

Bauhaus Retro Primaries
	•	Muted Mustard Yellow (--mustard-yellow: #D4A574)
	•	Faded Red-Orange (--faded-red-orange: #CC5A47)
	•	Robin’s Egg Blue (--robin-egg-blue: #7AB8CC)

Contrast Rules:
	•	Cream backgrounds → use Navy or Charcoal text.
	•	Navy backgrounds → use Cream or Robin’s Egg text.
	•	Never use light text on Cream or dark text on Navy.

⸻

🔧 Usage Guidelines

Rule 1: Never Flood Sections with Cream

✅ Correct: Use Cream only for cards or highlights.

<div className="bg-navy-900 p-8">
  <BauhausCard>Content goes here</BauhausCard>
</div>

❌ Incorrect: Full-width Cream sections.

<div className="bg-cream p-8"> <!-- Don’t do this -->

Rule 2: Strong Grid Alignment

Use the Bauhaus grid system for disciplined layouts.

<BauhausGrid columns={3}>
  <BauhausCard>Card 1</BauhausCard>
  <BauhausCard>Card 2</BauhausCard>
  <BauhausCard>Card 3</BauhausCard>
</BauhausGrid>

Rule 3: Geometric Typography

<h1 className="bauhaus-heading">Movie Poster Style Heading</h1>
<p className="bauhaus-body">Clean, airy body text with proper line height.</p>

Rule 4: Bold Button Contrast

<BauhausButton variant="primary">Primary Action</BauhausButton>
<BauhausButton variant="secondary">Secondary Action</BauhausButton>

Rule 5: Avoid Unintended Color Combos

❌ Avoid: Orange + Black (reads Halloween).
✅ Use: Orange + Cream or Mustard + Charcoal.

⸻

🎬 Hollywood References

Subtle Clapperboard Motif

Include one tasteful Hollywood cue per section.

<BauhausCard withHollywoodAccent>
  Content with subtle clapperboard accent
</BauhausCard>

Rule: One Hollywood reference per section — never overuse.

⸻

🧱 Component Library

BauhausCard

<BauhausCard
  variant="mustard"
  withHollywoodAccent
  className="p-6"
>
  Card content
</BauhausCard>

BauhausButton

<BauhausButton variant="primary" onClick={handleClick}>
  Call to Action
</BauhausButton>

BauhausChip

<BauhausChip variant="orange">Category Tag</BauhausChip>

BauhausGrid

<BauhausGrid columns={2}>
  <div>Item 1</div>
  <div>Item 2</div>
</BauhausGrid>


⸻

🎯 CSS Utility Classes

Typography
	•	.bauhaus-heading — Bold headers reminiscent of vintage movie posters
	•	.bauhaus-body — Clean, open, high-legibility body text

Cards
	•	.bauhaus-card — Base card styling with geometric shadows
	•	.bauhaus-card:hover — Adds accent border or lift effect

Buttons
	•	.bauhaus-btn-primary — Faded Red-Orange background with Cream text
	•	.bauhaus-btn-secondary — Mustard background with Charcoal text

Text Colors
	•	.text-bauhaus-mustard → #D4A574
	•	.text-bauhaus-orange → #CC5A47
	•	.text-bauhaus-blue → #7AB8CC

Background Colors
	•	.bg-bauhaus-mustard → #D4A574
	•	.bg-bauhaus-orange → #CC5A47
	•	.bg-bauhaus-blue → #7AB8CC

Hollywood Accent
	•	.hollywood-accent — Adds a subtle clapperboard stripe motif

⸻

📐 Design Principles
	1.	Minimal & Clean — Simple, uncluttered interfaces.
	2.	Strong Grid Alignment — Bauhaus-style structure and balance.
	3.	Geometric Shadows — Layered, architectural depth.
	4.	Bold Contrast — Clear legibility on all devices.
	5.	Mobile-First — Fully responsive layouts.

⸻

🚀 Implementation Examples

Directory Card

<BauhausCard className="p-6">
  <h3 className="bauhaus-heading text-lg mb-2">Acting Studio Name</h3>
  <p className="bauhaus-body text-sm mb-4">
    Description text with proper line height.
  </p>
  <div className="flex gap-2 mb-4">
    <BauhausChip variant="orange">Acting</BauhausChip>
    <BauhausChip variant="mustard">Classes</BauhausChip>
  </div>
  <BauhausButton variant="primary">View Listing →</BauhausButton>
</BauhausCard>

Page Header with Hollywood Accent

<div className="bg-navy-900 py-16">
  <div className="container mx-auto">
    <BauhausCard withHollywoodAccent className="p-8">
      <h1 className="bauhaus-heading text-4xl mb-4">
        Find Trusted Professionals
      </h1>
      <p className="bauhaus-body text-lg">
        Discover verified child acting professionals.
      </p>
    </BauhausCard>
  </div>
</div>


⸻

This design system ensures visual cohesion with the Bauhaus / Mid-Century Modern / Hollywood aesthetic while maintaining accessibility and functional clarity for the Child Actor 101 Directory.
