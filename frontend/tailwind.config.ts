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
            '0%': { height: '' },
            '100%': { height : '100px' },
        },
        turnBackToInput:{
            '0%': { height: '100px' },
            '100%': { height : '' },
        }
      },
      animation: {
        becomeTextArea: 'becomeTextArea 0.5s ease-out',
        turnBackToInput: 'turnBackToInput 0.5s ease-out',
      }
    },
  },
  plugins: [],
};
export default config;
