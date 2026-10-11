import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import ts from "typescript-eslint";
import next from "@next/eslint-plugin-next";
import hooks from "eslint-plugin-react-hooks";
import globals from "globals";
export default defineConfig([
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "next-env.d.ts",
    "tests/fixtures/**",
  ]),
  {
    files: ["**/*.mjs"],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [js.configs.recommended, ...ts.configs.recommended],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    files: ["src/**/*.tsx"],
    plugins: { "@next/next": next, "react-hooks": hooks },
    rules: {
      ...next.configs.recommended.rules,
      ...next.configs["core-web-vitals"].rules,
      ...hooks.configs.flat.recommended.rules,
    },
  },
]);
