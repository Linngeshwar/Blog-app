import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        container: "#ecc4ff",
        buttonPink: "#ff53c0",
        buttonPurple: "#cc5fff",
        inputBorder : "#d16dff",
      },
      fontFamily: {
        'rubik': ['Rubik', 'sans-serif'],
      },
      keyframes: {
        becomeTextArea:{
            '0%': { height: '40px' },
            '100%': { height : '' },
        },
        turnBackToInput:{
            '0%': { height: '100px' },
            '100%': { height : '' },
        },
        fadeIn: {
          '0%': { opacity: "0" },
          '100%': { opacity: "1" },
        },
        fadeOut: {
          '0%': { opacity: "1" },
          '100%': { opacity: "0" },
        },
      },
      animation: {
        becomeTextArea: 'becomeTextArea 0.3s ease-out',
        turnBackToInput: 'turnBackToInput 0.3s ease-out',
        fadeIn: 'fadeIn 0.3s ease-out',
        fadeOut: 'fadeOut 5s ease-out',
      }
    },
  },
  plugins: [],
};
export default config;
