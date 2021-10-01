module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    container: {
      screens: {
         sm: "100%",
         md: "100%",
         lg: "768px",
         xl: "768px"
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
