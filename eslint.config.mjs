import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: ["next-env.d.ts", "src/components/ai-elements/**", "src/components/ui/**"]
  },
  {
    rules: {
      "no-console": ["warn", { allow: ["error", "warn"] }]
    }
  }
];
