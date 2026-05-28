/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#f4f6f1",
          100: "#e5eee7",
          200: "#dbe3dc",
          300: "#cfd9d2",
          500: "#2f775d",
          600: "#28684f",
          700: "#315b4b",
          800: "#244b3d",
          900: "#1f3d32"
        },
        ink: "#17211c"
      },
      boxShadow: {
        soft: "0 14px 30px rgba(34, 50, 42, 0.08)"
      }
    }
  },
  plugins: []
};
