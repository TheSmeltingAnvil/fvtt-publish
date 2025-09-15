export default {
  printWidth: 120,
  quoteProps: "as-needed",
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
  overrides: [
    {
      files: "*.json",
      options: {
        singleQuote: false,
      },
    },
    {
      files: ["tsconfig.json", "tsconfig.*.json"],
      options: {
        parser: "jsonc",
        quoteProps: "consistent",
      },
    },
  ],
};
