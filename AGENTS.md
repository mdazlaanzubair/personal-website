<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Brand Knowledge Base

Before making changes that affect copy, messaging, profile claims, content strategy, SEO metadata, public-facing UI text, or AI assistant knowledge, read the canonical brand references in this repo:

- `brand-knowledge-base/01-brand-foundation.md` — source of truth for Muhammad Azlaan Zubair's brand positioning, voice, rhetorical patterns, audience map, content strategy, and platform adaptation rules.
- `src/ai/knowledge.ts` — source of truth for the portfolio assistant's in-app knowledge documents and how public profile, principles, experience, projects, publications, and posts are selected for answers.

Brand-sensitive changes must preserve the known brand:

- Write as Muhammad Azlaan Zubair in first person when generating authored content.
- Use calibrated confidence, evidence-backed claims, clear caveats, and the investigative "show the system underneath" framing from the brand foundation.
- Do not invent or inflate credentials, roles, expertise, project outcomes, experience, contact details, or publication claims.
- Treat the brand knowledge base as canonical over general model knowledge or assumptions from older repository names such as `the-chronicles-of-UI-UX`.
- When adding or changing assistant knowledge, keep the facts aligned with `brand-knowledge-base/01-brand-foundation.md` and the portfolio data sources queried from Sanity and Hashnode.
- If a requested claim is not supported by the repo's knowledge base or data sources, either omit it or phrase it explicitly as an unsupported draft assumption for the user to verify.

