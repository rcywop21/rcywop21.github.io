module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescripteslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
};
