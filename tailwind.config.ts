import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  darkMode: "class",

  theme: {
    extend: {
      /* ============================
         DAHDOUH AI COLOR SYSTEM
      ============================ */
      colors: {
        // Existing colors you already had (kept so nothing breaks)
        rtlDark: "#1E1F20",
        rtlLight: "#F0F4F9",
        accentGray: "#94a3b8",
        accentBlue: "#3b82f6",

        // New Dahdouh AI brand colors
        dahdouhPrimary: "#4F46E5",   // Purple
        dahdouhSecondary: "#06B6D4", // Cyan
        dahdouhDark: "#0F172A",
        dahdouhLight: "#F8FAFC",
      },

      /* ============================
         GRADIENTS
      ============================ */
      backgroundImage: {
        "dahdouh-gradient":
          "linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)",

        "dahdouh-text":
          "linear-gradient(90deg, #4F46E5 0%, #06B6D4 100%)",
      },

      /* ============================
         ANIMATIONS
      ============================ */
      animation: {
        fadeIn: "fadeIn 0.3s ease",
        fadeInSection: "fadeInSection 1s ease-in-out",
        gradientShift: "gradientShift 3s ease infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },

        fadeInSection: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },

        gradientShift: {
          "0%": { backgroundPosition: "100% 0%" },
          "100%": { backgroundPosition: "0% 0%" },
        },
      },
    },
  },

  plugins: [],
};

export default config;