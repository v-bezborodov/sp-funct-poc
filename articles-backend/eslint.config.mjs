import rootConfig from "../eslint.config.mjs";

export default [
  ...rootConfig,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
];
