// https://gist.github.com/hyoban/5e2270371d743ddb10b4f427017babc3
// ni -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-unicorn @stylistic/eslint-plugin eslint-plugin-antfu eslint-plugin-jsonc
// ni -D @eslint-react/eslint-plugin eslint-plugin-react-hooks
// ni -D @next/eslint-plugin-next
module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  reportUnusedDisableDirectives: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:unicorn/recommended',
    'plugin:@stylistic/recommended-extends',
    'plugin:jsonc/recommended-with-json',
    'plugin:jsonc/recommended-with-jsonc',
    'plugin:jsonc/recommended-with-json5',
    // for React
    'plugin:@eslint-react/all-legacy',
    'plugin:react-hooks/recommended',
    // for Next.js
    'plugin:@next/next/recommended',
  ],
  plugins: ['@typescript-eslint', 'antfu'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  root: true,
  ignorePatterns: [
    '!.vscode',
    '!.github',
    'node_modules',
    'dist',
    'output',
    'out',
  ],
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-restricted-syntax': [
      'error',
      {
        selector: 'TSEnumDeclaration',
        message: 'We should not use Enum',
      },
    ],

    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-non-null-assertion': 'off',

    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/consistent-type-exports': 'error',
    '@typescript-eslint/no-import-type-side-effects': 'error',

    '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],

    // we should not restrict how we name our variables
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/catch-error-name': 'off',
    // https://github.com/sindresorhus/meta/discussions/7
    'unicorn/no-null': 'off',
    // https://github.com/orgs/web-infra-dev/discussions/10
    'unicorn/prefer-top-level-await': 'off',
    'unicorn/no-array-reduce': 'off',

    'prefer-template': 'error',
    'antfu/consistent-list-newline': 'error',
    'antfu/if-newline': 'error',
    'antfu/top-level-function': 'error',

    'antfu/import-dedupe': 'error',
    'antfu/no-import-dist': 'error',
    'antfu/no-import-node-modules-by-path': 'error',

    // for React
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: {
          arguments: false,
          attributes: false,
        },
      },
    ],

    // handled by unicorn/filename-case
    // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/filename-case.md
    '@eslint-react/naming-convention/filename': 'off',
  },
  overrides: [
    {
      files: [
        '*.js',
        '*.jsx',
        '*.mjs',
        '*.cjs',
        '*.json',
        '*.json5',
        '*.jsonc',
        './*.config.ts',
      ],
      extends: ['plugin:@typescript-eslint/disable-type-checked'],
      rules: {
        '@typescript-eslint/consistent-type-assertions': 'off',
      },
    },
    {
      files: ['*.json', '*.json5', '*.jsonc'],
      parser: 'jsonc-eslint-parser',
      rules: {
        'jsonc/auto': 'error',
        'jsonc/no-comments': 'off',
      },
    },
    // for React
    {
      files: ['*.js', '*.jsx', '*.mjs', '*.cjs', '*.ts', '*.tsx'],
      excludedFiles: [
        // https://nextjs.org/docs/getting-started/project-structure#routing-files
        'src/app/**/{layout,page,loading,not-found,error,global-error,route,template,default}.tsx',
        '*.config.{js,cjs,mjs,ts}',
      ],
      rules: {
        // disable export * and export default
        'no-restricted-syntax': [
          'error',
          {
            selector: ':matches(ExportAllDeclaration)',
            message: 'Export only modules you need.',
          },
        ],
        'no-restricted-exports': [
          'error',
          {
            restrictDefaultExports: { direct: true },
          },
        ],
      },
    },
  ],
}
