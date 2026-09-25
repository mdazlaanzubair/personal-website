---
title: "Visual Prompts — Identity, Templates & Quality Gate"
purpose: "Generates image-creation prompts that match Azlaan's visual brand. The AI writes the prompt — you feed it to your image tool."
last_updated: "2026-09-16"
status: "canonical"
---

# Visual Prompts

---

## A — Visual Identity Rules

**Palette.** Primary: charcoal/black + white + orange. Orange is semantic — it marks the important path, the changed state, the control boundary, the key term. Never decorative. Secondary: blue, teal, or purple as differentiators when a visual needs more than one category.

**Typography.** Clean sans-serif. Large, bold headings. High contrast against background. If text isn't readable at mobile width, the font is too small or the words are too many.

**Style.** Minimal and conceptual, never literal. No stock-photo realism. No clip-art clutter. Text, whitespace, and one visual anchor (icon, shape, simple illustration) do the work. Soft gradient backgrounds (white → orange, white → blue) are the default canvas. Flat geometric shapes over detailed illustrations.

**Anti-text-heavy rule.** Maximum 15 words per section or slide in any visual. If the idea needs more words, those words belong in the caption or article body — not burned into the image. Diagrams use short labels and arrows, not sentences. Every visual must communicate its point through structure, color, and hierarchy before a single word is read.

**Placement.** Images appear after conceptual context, not before. The visual consolidates a mental model the prose already established. Horizontal rules (`---`) separate images as argument beats.

---

## B — Prompt Templates by Visual Type

### Blog Cover Image
`Minimal conceptual illustration for a tech blog post about [TOPIC]. Charcoal/black background or soft gradient (white-to-orange or white-to-blue). One central visual metaphor: [METAPHOR]. Large bold sans-serif title text: "[SHORT TITLE]". Orange accent on [KEY TERM]. Clean, modern, no stock imagery. Aspect ratio 1600×840.`

### OG Image (Social Preview)
`Social sharing preview, 1200×630. Bold sans-serif title "[TITLE]" in white or black, readable at thumbnail size. Background: [charcoal / soft gradient]. Orange accent on one key phrase. Minimal — no icons or illustrations competing with the title. Leave safe margins for platform cropping.`

### Carousel Slide
`Single carousel slide, 1080×1080. Background: [soft gradient / dark charcoal / clean white]. One statement in large bold sans-serif: "[SLIDE TEXT — max 12 words]". Orange highlight on [KEY TERM]. Optional: one simple icon, shape, or label below. Slide [N] of [TOTAL] indicator top-right. No paragraph text.`

### Infographic
`Structured vertical infographic, 1080×1350. Title at top in bold sans-serif: "[TITLE]". [N] sections, visually separated by whitespace or thin dividers. Each section: short label + one data point or icon. Color-code sections: orange for [primary category], blue/teal for [secondary]. White or light background. No section exceeds 15 words.`

### Quote Card
`Quote card, 1080×1080. Clean [white / charcoal] background. One statement in large bold sans-serif: "[QUOTE — max 15 words]". Orange accent on [one key phrase]. Attribution: "— Muhammad Azlaan Zubair" in smaller type below. No decorative elements. Whitespace carries the design.`

### Diagram
`System diagram translating this ASCII flow: [PASTE ASCII]. Nodes as rounded rectangles with short labels. Directional arrows between nodes. Orange for [critical path / changed state / decision point]. Grey or white for standard nodes. Dark background or clean white. No paragraph text inside nodes — labels only.`

---

## C — Quality Gate

Before finalizing any visual prompt, verify all five:

1. **3-second test.** Can the visual be understood without reading body text?
2. **15-word cap.** Does every section/slide stay under 15 words of text?
3. **Palette check.** Is orange used semantically (key term, boundary, changed state) — not as decoration?
4. **Mobile legibility.** Would the text and structure survive a phone screen at scroll speed?
5. **Anti-template test.** Does it look like *this* brand, or like a generic Canva template anyone could have made?

If any check fails, revise the prompt before generating.
