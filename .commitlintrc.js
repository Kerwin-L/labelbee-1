module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [2, 'always', ['sentence-case']],
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'update',
        'fix',
        'refactor',
        'optimize',
        'style',
        'docs',
        'chore',
        'test',
        'perf',
        'revert',
      ],
    ],
    "scope-empty": [
      2,
      "never"
    ]
  },
};
