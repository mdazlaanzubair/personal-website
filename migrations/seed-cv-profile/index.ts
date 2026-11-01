import { at, defineMigration, setIfMissing } from "sanity/migrate"

import { CV_PROFILE_DEFAULTS } from "../../src/resume/defaults"

// Copies the CV header and summaries into Site settings so they can be
// edited in Studio. Fields that already have a value are left alone.
export default defineMigration({
  title: "Seed CV header and summaries",
  documentTypes: ["siteSettings"],
  migrate: {
    document() {
      return Object.entries(CV_PROFILE_DEFAULTS).map(([field, value]) =>
        at(field, setIfMissing(value))
      )
    },
  },
})
