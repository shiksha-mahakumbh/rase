import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "custom-bg": "url('/bg.png')",
      },
      colors: {
        /** Global brand — deep navy primary */
        primary: "#0B1F3B",
        "primary-legacy": "#502a2a",
        brand: {
          navy: "#0B1F3B",
          "navy-light": "#1E3A5F",
          blue: "#1A56DB",
          "blue-light": "#3B82F6",
          saffron: "#FF9933",
          "saffron-dark": "#E67E00",
          emerald: "#059669",
          surface: "#F8FAFC",
          "surface-warm": "#FFFBF5",
        },
        "pastel-orange": "#FFA351",
        peach: "#FFBE7B",
        custard: "#EED971",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
