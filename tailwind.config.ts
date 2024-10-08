// tailwind.config.js
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Include all files in src
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-bg': "url('/bg.png')", // Make sure the path is correct
      },
      colors: {
        primary: '#502a2a',
        'pastel-orange': '#FFA351',
        peach: '#FFBE7B',
        custard: '#EED971',
      },
    },
  },
  plugins: [],
};

export default config;
