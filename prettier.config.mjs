/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  trailingComma: 'es5',
  tabWidth: 2,
  useTabs: false,
  printWidth: 80,
  useTabs: false,
  semi: false,
  singleQuote: true,
  plugins: ['prettier-plugin-tailwindcss'],
}

export default config
