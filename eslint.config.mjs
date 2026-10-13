import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    settings: {
      react: { version: "19.3" },
    },
  },
  {
    files: ["app/opengraph-image.tsx"],
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
  {
    // headers.ts reads DEAFCS_WIDGET_TOKEN and can't import "server-only" (codegen runs it in plain
    // Node), so only the server-only client and codegen may import it.
    ignores: ["lib/deafcs/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/deafcs/headers"],
              message: "Import from @/lib/deafcs instead; headers.ts holds a server-only secret.",
            },
          ],
        },
      ],
    },
  },
  globalIgnores([".next/**", "build/**", "next-env.d.ts", "lib/deafcs/generated/**"]),
])

export default eslintConfig
