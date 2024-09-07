import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#0AE980",
          DEFAULT: "#09C870",
          dark: "#08A660",
        },
        gray: {
          900: "#121212",
          800: "#1F1F1F",
          700: "#2E2E2E",
          600: "#3D3D3D",
          300: "#B0B0B0",
        },
      },
      fontFamily: {
        sans: ["Inter", "var", "sans-serif"],
      },
      boxShadow: {
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
