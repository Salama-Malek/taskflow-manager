/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: {
          light: "#f8fafc",
          dark: "#0f172a"
        },
        surface: {
          light: "#ffffff",
          dark: "#1e293b"
        },
        accent: {
          light: "#0ea5e9",
          dark: "#38bdf8"
        }
      },
      fontFamily: {
        en: ["Inter", "Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
        ar: ["Cairo", "Tajawal", "ui-sans-serif", "system-ui", "sans-serif"],
        ru: ["Roboto", "Noto Sans", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms")
  ]
};
