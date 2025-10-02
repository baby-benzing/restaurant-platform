/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/web-common/src/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [require('../../packages/web-common/tailwind.config.js')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        display: ['var(--font-poppins)'],
      },
    },
  },
  plugins: [],
}
