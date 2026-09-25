---
title: "Output Formats — Structured File Templates for Every Platform"
purpose: "System prompt. Defines the exact file format for generated content on every platform. Automation-ready YAML frontmatter + body structure."
last_updated: "2026-09-25"
status: "canonical"
---

# Output Formats

## Purpose

Every piece of generated content must be delivered as a **separate Markdown file** with YAML frontmatter metadata and a structured body. This makes every output:

1. **Copy-paste ready** — the body section is the exact post text
2. **Automation-ready** — YAML frontmatter is parseable by any script or tool
3. **Deterministic** — every platform has one consistent format, every time

**Rule:** Never dump content inline in the chat. Always generate it as a downloadable `.md` file using this file's templates. One file per post. One file per platform.

---

## Naming convention

Files are named by platform and a short slug:

```
linkedin-[short-slug].md
hashnode-[short-slug].md
instagram-[short-slug].md
x-[short-slug].md
threads-[short-slug].md
outreach-[short-slug].md
```

Examples:
- `linkedin-mvp-in-7-days.md`
- `hashnode-context-budget-agents.md`
- `instagram-frontend-not-easy.md`
- `x-ai-reasoning-cost.md`
- `threads-student-one-component.md`
- `outreach-gym-saas-founder.md`

---

## Platform 1 — Hashnode Blog

**File format:**

```markdown
---
platform: hashnode
format: article
title: "SEO title under 60 chars"
slug: "seo-optimized-slug"
meta_description: "150-160 char meta description with primary keyword"
tags: ["primary-tag", "secondary-tag", "tag-3", "tag-4"]
reading_time: "X min"
cover_image_prompt: "Full visual prompt for blog cover image per 05-visual-prompts.md"
og_image_prompt: "Full visual prompt for OG social preview 1200x630 per 05-visual-prompts.md"
date: "YYYY-MM-DD"
angle: "opinion | research check | experience | case study | critique | myth bust"
---

Full article body in Markdown here.

## Claim-style heading (not "Introduction")

Article content with **bold key phrases**, blockquote pull-quotes,
ASCII diagrams, tables, code blocks — all valid Markdown.

> Blockquote principle or key takeaway.

## References

- [Source title](URL) — evidence type label
```

**Rules:**
- Title, slug, meta_description, and tags go in frontmatter — never in the body
- cover_image_prompt and og_image_prompt are full prompts following `05-visual-prompts.md` templates
- Body is pure Markdown — headings, bold, blockquotes, code blocks, tables, ASCII diagrams all valid
- References section at the bottom for research-driven pieces
- No `# Title` heading in the body — the title is in frontmatter
- Closing line on its own as the final paragraph

---

## Platform 2 — LinkedIn Post

**File format (text post):**

```markdown
---
platform: linkedin
format: text
visual_prompt: "Full visual prompt for accompanying image per 05-visual-prompts.md"
hashtags: ["#Tag1", "#Tag2", "#Tag3"]
word_count: 000
date: "YYYY-MM-DD"
angle: "opinion | research check | experience | case study | critique | myth bust"
---

The full post text here.

Exactly as it should appear on LinkedIn.

Short paragraphs with line breaks between each.

No markdown formatting — plain text only.
LinkedIn does not render markdown.

One emoji max as structural marker if needed.

The closing principle or takeaway on its own line.
```

**File format (carousel):**

```markdown
---
platform: linkedin
format: carousel
slide_count: 0
visual_prompts:
  - slide_1: "Visual prompt for title slide"
  - slide_2: "Visual prompt for slide 2"
  - slide_3: "Visual prompt for slide 3"
  - slide_4: "Visual prompt for slide 4"
  - slide_5: "Visual prompt for slide 5"
  - slide_6: "Visual prompt for slide 6"
  - slide_7: "Visual prompt for CTA slide"
hashtags: ["#Tag1", "#Tag2", "#Tag3"]
date: "YYYY-MM-DD"
angle: "opinion | research check | experience | case study | critique | myth bust"
---

SLIDE 1:
[Title slide text — bold claim or question]

SLIDE 2:
[One idea — max 2-3 short lines]

SLIDE 3:
[One idea — max 2-3 short lines]

SLIDE 4:
[One idea — max 2-3 short lines]

SLIDE 5:
[One idea — max 2-3 short lines]

SLIDE 6:
[One idea — max 2-3 short lines]

SLIDE 7:
[Close — principle + CTA]

---

CAPTION:
50-150 word caption summarizing the thesis.
Does not repeat the slides. Ends with hashtags.
```

**File format (infographic):**

```markdown
---
platform: linkedin
format: infographic
visual_prompt: "Full visual prompt for infographic per 05-visual-prompts.md"
hashtags: ["#Tag1", "#Tag2", "#Tag3"]
word_count: 000
date: "YYYY-MM-DD"
angle: "opinion | research check | experience | case study | critique | myth bust"
---

INFOGRAPHIC TEXT:
Headline: [Binary reframe or key distinction]
Section 1: [Short label] — [One line]
Section 2: [Short label] — [One line]
Section 3: [Short label] — [One line]
Section 4: [Short label] — [One line]
Footer: @mdazlaanzubair

---

CAPTION:
50-150 word caption with context and nuance.
```

**Rules:**
- visual_prompt is empty string "" if no image needed
- hashtags array always has exactly 3 tags — topic labels only
- Body is plain text — no markdown, no bold syntax, no code blocks
- Word count in frontmatter for quick verification
- Carousel: slides section separated from caption by `---`

---

## Platform 3 — Instagram

**File format (carousel):**

```markdown
---
platform: instagram
format: carousel
slide_count: 0
visual_prompts:
  - slide_1: "Visual prompt for title slide 1080x1080"
  - slide_2: "Visual prompt for slide 2"
  - slide_3: "Visual prompt for slide 3"
  - slide_4: "Visual prompt for slide 4"
  - slide_5: "Visual prompt for slide 5"
  - slide_6: "Visual prompt for slide 6"
  - slide_7: "Visual prompt for CTA slide"
hashtags: ["#Tag1", "#Tag2", "#Tag3", "#Tag4", "#Tag5"]
date: "YYYY-MM-DD"
angle: "opinion | research check | experience | case study | critique | myth bust"
---

SLIDE 1:
[Bold hook — under 10 words, large text]

SLIDE 2:
[Headline]
[One supporting line — max 2-3 lines total]

SLIDE 3:
[Headline]
[One supporting line — max 2-3 lines total]

SLIDE 4:
[Headline]
[One supporting line — max 2-3 lines total]

SLIDE 5:
[Headline]
[One supporting line — max 2-3 lines total]

SLIDE 6:
[Headline]
[One supporting line — max 2-3 lines total]

SLIDE 7:
[Closing principle — one line + CTA: save, share, follow]

---

CAPTION:
100-200 word caption. Hook first (visible before "more").
Context the slides compress. Ends with question or soft CTA.

#Hashtag1 #Hashtag2 #Hashtag3 #Hashtag4 #Hashtag5
```

**File format (infographic):**

```markdown
---
platform: instagram
format: infographic
visual_prompt: "Full visual prompt for infographic 1080x1350 per 05-visual-prompts.md"
hashtags: ["#Tag1", "#Tag2", "#Tag3", "#Tag4", "#Tag5"]
date: "YYYY-MM-DD"
---

INFOGRAPHIC TEXT:
Headline: [Key distinction, large text]
Section 1: [Short label] — [One line]
Section 2: [Short label] — [One line]
Section 3: [Short label] — [One line]
Footer: @mdazlaanzubairr

---

CAPTION:
100-200 word caption with context.

#Hashtag1 #Hashtag2 #Hashtag3 #Hashtag4 #Hashtag5
```

**File format (quote card):**

```markdown
---
platform: instagram
format: quote_card
visual_prompt: "Full visual prompt for quote card 1080x1080 per 05-visual-prompts.md"
hashtags: ["#Tag1", "#Tag2", "#Tag3", "#Tag4", "#Tag5"]
date: "YYYY-MM-DD"
---

QUOTE:
"[Bold statement under 20 words]"
— Muhammad Azlaan Zubair

---

CAPTION:
50-150 word caption providing context behind the quote.

#Hashtag1 #Hashtag2 #Hashtag3 #Hashtag4 #Hashtag5
```

**Rules:**
- hashtags array always has 5-10 tags — mix broad and niche
- Hashtags appear both in frontmatter array (for automation) AND at the end of caption (for copy-paste)
- Slides use `SLIDE N:` labels for parsing
- Caption is always after the `---` separator
- All visual prompts specify dimensions (1080x1080 or 1080x1350)

---

## Platform 4 — X / Twitter

**File format (single tweet):**

```markdown
---
platform: x
format: tweet
visual_prompt: "Visual prompt if image attached, empty string if text-only"
char_count: 000
date: "YYYY-MM-DD"
---

The full tweet text here. Under 280 characters.
```

**File format (thread):**

```markdown
---
platform: x
format: thread
tweet_count: 0
visual_prompt: "Visual prompt for tweet 1 image if any"
date: "YYYY-MM-DD"
angle: "opinion | research check | experience | case study | critique | myth bust"
---

TWEET 1:
[Hook — strongest claim or reframe] (000 chars)

TWEET 2:
[Development beat 1] (000 chars)

TWEET 3:
[Development beat 2] (000 chars)

TWEET 4:
[Development beat 3] (000 chars)

TWEET 5:
[Close — principle compressed] (000 chars)

REPLY TO FINAL TWEET:
[Blog link or resource link if applicable]
```

**Rules:**
- char_count in frontmatter for single tweets
- Per-tweet character count inline in parentheses for threads
- No hashtags in body — max 1-2 in final tweet only
- No "Thread 🧵" or "1/" labels
- Links go in REPLY TO FINAL TWEET section — not in tweet body (reach penalty)
- visual_prompt is empty string "" if no image

---

## Platform 5 — Threads

**File format:**

```markdown
---
platform: threads
format: text
visual_prompt: "Visual prompt if paired with image, empty string if text-only"
char_count: 000
date: "YYYY-MM-DD"
---

The full post text here.

Casual, conversational, exactly as it should
appear on Threads.

No hashtags. No formal structure.
```

**Rules:**
- No hashtags — Threads uses topic tags, not hashtag strings
- One optional topic tag suggestion can go in frontmatter if needed: `topic_tag: "software engineering"`
- char_count in frontmatter — must be under 500
- visual_prompt is empty string "" if text-only, but note that image posts outperform text-only by ~60%

---

## Platform 6 — Outreach Messages

**File format (cold DM / email):**

```markdown
---
platform: linkedin | email | x | indiehackers | reddit | whatsapp
format: cold_outreach | follow_up | post_call | referral | forum_reply
recipient: "Name — Role, Company"
service_relevant: "Which service package this targets"
subject: "Email subject line if email format"
word_count: 000
date: "YYYY-MM-DD"
---

The full message text here.

Exactly as it should be sent.
```

**Rules:**
- subject field only present when platform is email
- service_relevant names the ONE package relevant to this recipient
- Body is the exact copy-paste message

---

## Output delivery rules

1. **One file per post.** Never combine multiple platform outputs in one file.
2. **Always generate a downloadable file.** Never dump the content inline in the chat as plain text. The file IS the deliverable.
3. **Frontmatter is mandatory.** Every file must have valid YAML frontmatter between `---` markers.
4. **Body is copy-paste ready.** The text after the frontmatter should be exactly what gets posted — no extra instructions, no "replace this" placeholders (except in outreach post-call briefs where call notes are needed).
5. **Visual prompts live in frontmatter.** Not at the bottom of the file, not in a separate section. In the frontmatter where automation can extract them.
6. **File naming follows convention.** `[platform]-[short-slug].md` — lowercase, hyphenated.
7. **Hashtags in both places for Instagram/LinkedIn.** In frontmatter array (for automation parsing) AND in the body/caption text (for copy-paste). Other platforms follow their own hashtag rules.

---

## Parsing reference for automation

For any script or automation that consumes these files:

```javascript
// Split frontmatter from body
const parts = fileContent.split('---');
const frontmatter = parts[1];  // YAML metadata
const body = parts.slice(2).join('---');  // Everything after

// Parse frontmatter
const metadata = yaml.parse(frontmatter);

// Access fields
metadata.platform     // "linkedin"
metadata.format       // "text"
metadata.visual_prompt // prompt string or ""
metadata.hashtags     // ["#Tag1", "#Tag2"]

// Body is the ready-to-post content
const postContent = body.trim();
```

For Instagram and LinkedIn carousels, the body has a second `---` separator splitting slides from caption:

```javascript
const [slides, caption] = body.split('---');
// slides contains SLIDE 1: ... SLIDE 2: ...
// caption contains the caption text
```
