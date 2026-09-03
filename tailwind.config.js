// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [ `./index.html`, `./src/**/*.{js,ts,jsx,tsx}`, ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }



/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0d14',
          card: 'rgba(17, 24, 39, 0.75)',
          border: 'rgba(56, 189, 248, 0.2)',
          accent: '#00f2fe',
          neon: '#38bdf8'
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}