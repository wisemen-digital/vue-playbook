module.exports = {
  extends: ["plugin:prettier/recommended", "plugin:md/recommended"],
  overrides: [
    {
      files: ["*.md.ts", "*.md.vue"], // Will match js code inside *.md files
      rules: {
        "no-unused-vars": "off",
        "no-undef": "off",
      },
    },
    {
      files: ["*.md.vue"], // Will match js code inside *.md files
      extends: [
        "plugin:vue/vue3-recommended",
        "eslint:recommended",
        "@vue/eslint-config-typescript",
        "@vue/eslint-config-prettier",
      ],
      rules: {
        "no-undefined": "off",
        "no-undef": "off",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "vue/no-parsing-error": "off",
        "vue/require-v-for-key": "off",
        "vue/no-useless-template-attributes": "off",
      },
    },
    {
      files: ["*.md"],
      parser: "markdown-eslint-parser",
      rules: {
        "md/remark": [
          "error",
          {
            plugins: [["lint-maximum-line-length", false]],
          },
        ],
        "prettier/prettier": [
          "error",
          {
            semi: false,
            tabWidth: 2,
            singleQuote: true,
            jsxSingleQuote: true,
            bracketSpacing: true,
            printWidth: 120,
            trailingComma: "es5",
            bracketSameLine: false,
            useTabs: false,
            parser: "markdown",
            arrowParens: "always",
            singleAttributePerLine: true,
            endOfLine: "auto",
            quoteProps: "consistent",
          },
        ],
      },
    },
  ],
};
