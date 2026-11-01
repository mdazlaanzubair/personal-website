export type ResumeVariant = "professional" | "academic"

/** Where each generated CV is served, shared by the routes and the links. */
export const RESUME_FILES = {
  professional: {
    path: "/resume.pdf",
    fileName: "Muhammad Azlaan Zubair - Resume.pdf",
    label: "Resume",
    description: "2 pages, for industry and hiring roles",
  },
  academic: {
    path: "/academic-cv.pdf",
    fileName: "Muhammad Azlaan Zubair - Academic CV.pdf",
    label: "Academic CV",
    description: "Full record with education and publications",
  },
} as const satisfies Record<
  ResumeVariant,
  { path: string; fileName: string; label: string; description: string }
>
