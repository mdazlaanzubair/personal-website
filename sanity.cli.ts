import { defineCliConfig } from "sanity/cli"

import { dataset, projectId, studioHost } from "./sanity/env"

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  studioHost,
  deployment: {
    autoUpdates: true,
  },
  typegen: {
    enabled: true,
    path: "./src/**/*.{ts,tsx,js,jsx}",
    schema: "./schema.json",
    generates: "./sanity.types.ts",
    overloadClientMethods: true,
  },
})
