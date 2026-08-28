import { canonicalIgnores } from './tools/quality/workspace-policy.mjs';

export default {
  extends: ['stylelint-config-standard'],
  ignoreFiles: canonicalIgnores,
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'apply',
          'config',
          'custom-variant',
          'plugin',
          'reference',
          'source',
          'theme',
          'utility',
          'variant',
        ],
      },
    ],
    'at-rule-no-deprecated': [true, { ignoreAtRules: ['apply'] }],
    'import-notation': null,
    'lightness-notation': null,
    'hue-degree-notation': null,
    'custom-property-empty-line-before': null,
    'custom-property-pattern': null,
    'selector-class-pattern': null,
    'color-hex-length': 'long',
  },
};
