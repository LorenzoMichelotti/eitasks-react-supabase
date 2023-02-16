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
            opacity: 0,
            transformOrigin: "top",
          },
          "50%": { opacity: 1 },
        },
      },
      animation: {
        appear: "appear 100ms ease-in-out",
      },
      boxShadow: {
        border:
          "--tw-shadow: 0 0 0 5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1); --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color); box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);",
      },
    },
  },
  plugins: [],
};
