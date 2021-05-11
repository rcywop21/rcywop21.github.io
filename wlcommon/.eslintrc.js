module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    ignorePatterns: ['build/**/*.js', 'node_modules/**/*.js'],
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
    ],
    env: {
        node: true,
    },
};
