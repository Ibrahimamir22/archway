import type { Config } from "tailwindcss";

const config: Config = {
  // Enable Just-in-Time mode for faster builds
  mode: 'jit',
  // Speed up development by only enabling needed features
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#102339',
        'brand-blue-light': '#355075',
        'brand-blue-dark': '#0A1826',
        'brand-light': '#EDF2F7',
        'brand-accent': '#F59E0B',
        'brand-dark': '#102339',
        'brand-gray': '#718096',
      },
      fontFamily: {
        heading: ['var(--font-playfair)', 'Noto Serif Arabic', 'serif'],
        body: ['var(--font-nunito)', 'Noto Sans Arabic', 'sans-serif'],
        cairo: ['var(--font-cairo)', 'sans-serif'],
        tajawal: ['var(--font-tajawal)', 'sans-serif'],
        nunito: ['var(--font-nunito)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
        'scale': 'scale 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scale: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
        },
      },
    },
  },
  plugins: [
    // No external RTL plugin; using Tailwind's built‑in RTL support via dir="rtl" and rtl: variants.
  ],
} as Config;

export default config; 