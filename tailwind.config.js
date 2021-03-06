const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["General Sans", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        gray: colors.trueGray,
      },
      fontSize: {
        "2xs": ["0.65rem", "0.9rem"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
