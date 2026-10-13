import type { CodegenConfig } from "@graphql-codegen/cli"

import { deafcsHeaders } from "./headers"

try {
  process.loadEnvFile(".env.local")
} catch {}

const config: CodegenConfig = {
  schema: {
    [process.env.DEAFCS_API_URL!]: {
      headers: deafcsHeaders(),
    },
  },
  documents: ["app/api/**/*.ts"],
  generates: {
    "lib/deafcs/schema.graphql": {
      plugins: ["schema-ast"],
      config: { sort: true },
    },
    "lib/deafcs/generated/": {
      preset: "client",
      presetConfig: { fragmentMasking: false },
      config: {
        documentMode: "string",
        enumsAsTypes: true,
        onlyOperationTypes: true,
        useTypeImports: true,
        scalars: {
          bigint: "string",
          float8: { input: "number", output: "string" },
          jsonb: "unknown",
          timestamptz: "string",
          uuid: "string",
        },
      },
    },
  },
}

export default config
