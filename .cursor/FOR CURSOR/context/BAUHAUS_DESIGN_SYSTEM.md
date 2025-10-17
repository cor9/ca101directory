# Bauhaus Mid-Century Modern Hollywood Design System

This design system implements the aesthetic guidelines from `FOR CURSOR/Guardrails.md` to create a cohesive Bauhaus-inspired, mid-century modern Hollywood experience.

## 🎨 Color Philosophy

### Cinema Backdrop
- **Navy**: `--navy` (#0C1A2B) - Primary background
- **Deep Charcoal**: `--charcoal` (#1E1F23) - Secondary dark surfaces

### Screen/Card Canvas  
- **Soft Cream**: `--cream` (#FFFDD0) - Card backgrounds
- **Cream Ink**: `--cream-ink` (#1B1F29) - Text on cream

### Bauhaus Retro Primaries
- **Muted Mustard Yellow**: `--mustard-yellow` (#D4A574)
- **Faded Red-Orange**: `--faded-red-orange` (#CC5A47)  
- **Robin's Egg Blue**: `--robin-egg-blue` (#7AB8CC)

## 🔧 Usage Guidelines

### Rule 1: Never Flood Sections with Cream
✅ **Correct**: Use cream only for content cards or highlights
```tsx
<div className="bg-navy-900 p-8">
  <BauhausCard>Content goes here</BauhausCard>
</div>
```

❌ **Incorrect**: Full sections in cream
```tsx
<div className="bg-cream p-8"> <!-- Don't do this -->
```

### Rule 2: Strong Grid Alignment
Use the Bauhaus grid system for disciplined layouts:

```tsx
<BauhausGrid columns={3}>
  <BauhausCard>Card 1</BauhausCard>
  <BauhausCard>Card 2</BauhausCard>
  <BauhausCard>Card 3</BauhausCard>
</BauhausGrid>
```

### Rule 3: Geometric Typography
Apply Bauhaus typography classes:

```tsx
<h1 className="bauhaus-heading">Movie Poster Style Heading</h1>
<p className="bauhaus-body">Clean, airy body text with proper line height</p>
```

### Rule 4: Bold Button Contrast
Use Bauhaus buttons with proper color combinations:

```tsx
<BauhausButton variant="primary">Primary Action</BauhausButton>
<BauhausButton variant="secondary">Secondary Action</BauhausButton>
```

### Rule 5: Avoid Unintended Color Combinations
❌ **Avoid**: Orange + Black (Halloween theme)
✅ **Use**: Orange + Cream or Mustard + Charcoal

## 🎬 Hollywood References

### Subtle Clapperboard Motif
Add one Hollywood reference per page section:

```tsx
<BauhausCard withHollywoodAccent>
  Content with subtle clapperboard accent
</BauhausCard>
```

### Rule: One Hollywood Reference Per Section
Don't overload with kitsch - use sparingly for classic Hollywood homage.

## 🧱 Component Library

### BauhausCard
```tsx
<BauhausCard 
  variant="mustard" 
  withHollywoodAccent
  className="p-6"
>
  Card content
</BauhausCard>
```

### BauhausButton  
```tsx
<BauhausButton 
  variant="primary"
  onClick={handleClick}
>
  Call to Action
</BauhausButton>
```

### BauhausChip
```tsx
<BauhausChip variant="orange">
  Category Tag
</BauhausChip>
```

### BauhausGrid
```tsx
<BauhausGrid columns={2}>
  <div>Item 1</div>
  <div>Item 2</div>
</BauhausGrid>
```

## 🎯 CSS Utility Classes

### Typography
- `.bauhaus-heading` - Bold headers evoking movie posters
- `.bauhaus-body` - Clean, airy body text

### Cards
- `.bauhaus-card` - Base card styling with geometric shadows
- `.bauhaus-card:hover` - Hover effects with accent borders

### Buttons
- `.bauhaus-btn-primary` - Faded red-orange with cream text
- `.bauhaus-btn-secondary` - Mustard yellow with charcoal text

### Colors
- `.text-bauhaus-mustard` - Muted mustard yellow text
- `.text-bauhaus-orange` - Faded red-orange text  
- `.text-bauhaus-blue` - Robin's egg blue text
- `.bg-bauhaus-mustard` - Mustard background
- `.bg-bauhaus-orange` - Orange background
- `.bg-bauhaus-blue` - Blue background

### Hollywood Accent
- `.hollywood-accent` - Adds subtle clapperboard stripe

## 📐 Design Principles

1. **Minimal & Clean**: Simple, uncluttered interface
2. **Strong Grid Alignment**: Bauhaus discipline in layout
3. **Geometric Shadows**: Stronger, more architectural shadows
4. **Bold Contrast**: High contrast for accessibility and impact
5. **Mobile-First**: Responsive design that works on all devices

## 🚀 Implementation Examples

### Directory Card
```tsx
<BauhausCard className="p-6">
  <h3 className="bauhaus-heading text-lg mb-2">
    Acting Studio Name
  </h3>
  <p className="bauhaus-body text-sm mb-4">
    Description text with proper line height
  </p>
  <div className="flex gap-2 mb-4">
    <BauhausChip variant="orange">Acting</BauhausChip>
    <BauhausChip variant="mustard">Classes</BauhausChip>
  </div>
  <BauhausButton variant="primary">
    View Listing →
  </BauhausButton>
</BauhausCard>
```

### Page Header with Hollywood Accent
```tsx
<div className="bg-navy-900 py-16">
  <div className="container mx-auto">
    <BauhausCard withHollywoodAccent className="p-8">
      <h1 className="bauhaus-heading text-4xl mb-4">
        Find Trusted Professionals
      </h1>
      <p className="bauhaus-body text-lg">
        Discover verified child acting professionals
      </p>
    </BauhausCard>
  </div>
</div>
```

This design system ensures consistency with the Bauhaus/mid-century modern Hollywood aesthetic while maintaining the functional requirements of the Child Actor 101 Directory.
