import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

const nextConfig = require("@next/eslint-plugin-next/configs/recommended");

module.exports = [

  {
    ...nextConfig,
    files: ["src/**/*.{ts,tsx}"],
  
    rules: {
      ...nextConfig.rules, 
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],
      'indent': ['error', 2]
    }
  }
];

export default eslintConfig;
