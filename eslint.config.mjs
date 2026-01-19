import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier/recommended";

export default tseslint.config(
  {
    // Ignore build artifacts globally
    ignores: ["**/dist/**", "**/.next/**", "**/node_modules/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    rules: {
      "no-console": "warn",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
);
