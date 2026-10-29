/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./eden.js"],
  theme: {
    extend: {
      colors: {
        bg: "#faf9f5",
        surface: "#ffffff",
        "surface-alt": "#f2f0ea",
        border: "#e5e2d9",
        text: "#1a1a1a",
        "text-muted": "#6b6b6b",
        accent: "#c96442",
        "accent-soft": "#f4e4dc",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "sans-serif",
        ],
        serif: ["Georgia", "Times New Roman", "serif"],
      },
      borderRadius: {
        DEFAULT: "12px",
        sm: "8px",
      },
      height: {
        header: "68px",
        footer: "56px",
      },
    },
  },
  plugins: [],
};
