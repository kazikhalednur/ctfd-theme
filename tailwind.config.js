/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./assets/**/*.{js,jsx,vue,html}",
    "./templates/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        info: '#5c728f',
      },
    },
  },
  plugins: [],
}

