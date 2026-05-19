/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Vert profond (principal)
        primary: "#003322",
        // Or métallisé (actions, survols)
        secondary: "#D4AF37",
        // Blanc cassé (fond clair)
        background: "#F8F9FA",
        // Noir anthracite (textes)
        foreground: "#1A1A1A",
        border: "#D4AF37",
        card: {
          DEFAULT: "#F8F9FA",
          foreground: "#1A1A1A",
        },
        // Pour les composants shadcn
        accent: {
          DEFAULT: "#D4AF37",
          foreground: "#003322",
        },
      },
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};