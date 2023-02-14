/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light_hover: "#485577",
          light_active: "#3D4062",
          light: "#3C435C",
          medium: "#1B1B22",
          dark: "#151517",
        },
      },
      keyframes: {
        appear: {
          "0%": {
            transform: "scaleY(0.5)",
            opacity: 0,
            transformOrigin: "top",
          },
          "50%": { transform: "scaleY(1)", opacity: 1 },
        },
      },
      animation: {
        appear: "appear 300ms ease-in-out",
      },
    },
  },
  plugins: [],
};
