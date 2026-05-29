/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/*.{js,jsx}",
    "./src/features/{auth,bookings,cabins,calendar,campsites,dashboard,public,reservations,resources}/**/*.{js,jsx}",
    "./src/services/**/*.{js,jsx}",
    "./src/shared/**/*.{js,jsx}",
    "./src/store/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Raleway", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
        display: ["Cormorant Garamond", "Georgia", "serif"]
      },
      colors: {
        forest: {
          50: "#f2ede4",
          100: "#ede7dc",
          200: "#ded3c4",
          300: "#cab99f",
          500: "#b8933f",
          600: "#8f6f2e",
          700: "#1b3d2c",
          800: "#14301f",
          900: "#0e1c13"
        },
        ink: "#0e1c13",
        gold: "#b8933f",
        gilded: "#d4aa5a",
        parch: "#f2ede4",
        cream: "#ede7dc",
        muted: "#6b6460"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(14, 28, 19, 0.12)",
        glow: "0 24px 70px rgba(14, 28, 19, 0.2)"
      }
    }
  },
  plugins: []
};
