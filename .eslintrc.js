module.exports = {
    'env': {
        'browser': true,
        'es2021': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier'
    ],
    'ignorePatterns': ['src/generated/**/*'],
    'overrides': [
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module'
    },
    'plugins': [
        '@typescript-eslint'
    ],
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'never'
        ]
    }
}
//
//   "rules": {
//   "@typescript-eslint/explicit-member-accessibility": 0,
//     "@typescript-eslint/explicit-function-return-type": 0,
//     "@typescript-eslint/no-parameter-properties": 0,
//     "@typescript-eslint/interface-name-prefix": 0,
//     "@typescript-eslint/explicit-module-boundary-types": 0,
//     "@typescript-eslint/no-explicit-any": "off",
//     "@typescript-eslint/ban-types": "off",
//     "@typescript-eslint/no-var-requires": "off"
// }
// }
