/**
 * Starting values for the CV header and summaries. The CV prefers what is
 * saved in Sanity's Site settings; these fill any field left empty, and the
 * seed-cv-profile migration copies them into Sanity once.
 *
 * Claims stay within brand-knowledge-base/02-azlaan-profile.md.
 */
export const CV_PROFILE_DEFAULTS = {
  headline: "Software Engineer",
  location: "Karachi, Pakistan",
  email: "mdazlaan1996@gmail.com",
  // For hiring managers and recruiters: role, stack, current work, proof.
  resumeSummary:
    "Software engineer with 5+ years of experience building web applications with React, Next.js and TypeScript. Currently building the product interface for a US AI startup, including real-time tracking of AI jobs and Slack, Google Drive and file-upload integrations. Previously delivered e-commerce, insurance and enterprise apps with a focus on speed, payments and secure sign-in. Have also published peer-reviewed research on AI in software testing.",
  // For professors and research committees: research focus, record, path.
  academicSummary:
    "Software engineer and researcher studying how AI, especially large language models (LLMs), can improve software engineering. Published work includes a peer-reviewed study comparing GPT-4o, OpenAI o1 models and human testers at writing software test cases; ongoing work covers lightweight computer vision for content moderation and fire and smoke detection. Completing an MS in Software Engineering at FAST (December 2026), and bringing 5+ years of industry experience building web and AI products.",
} as const
