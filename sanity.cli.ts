import { defineCliConfig } from "sanity/cli"

import { dataset, projectId, studioHost } from "./sanity/env"

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  studioHost,
  deployment: {
    appId: "twcajeah8axruv59h576qt3l",
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
