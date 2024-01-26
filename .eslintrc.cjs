module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:tailwindcss/recommended",
  ],
  settings: {
    tailwindcss: {
      callees: ["classnames", "clsx", "ctl", "cn"],
    },
  },
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],

    "@typescript-eslint/no-non-null-assertion": "off",

    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/consistent-type-exports": "error",
    "@typescript-eslint/no-import-type-side-effects": "error",

    "no-console": ["warn", { allow: ["warn", "error"] }],

    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: {
          arguments: false,
          attributes: false,
        },
      },
    ],

    "no-restricted-syntax": [
      "error",
      {
        selector: "TSEnumDeclaration",
        message: "We should not use Enum",
      },
    ],

    "tailwindcss/classnames-order": "off",
  },
}
