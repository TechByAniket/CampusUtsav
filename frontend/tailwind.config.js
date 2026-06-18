/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // 1️⃣ Primary Color — Deep Coral/Terracotta
        primary: {
          DEFAULT: "#ea580c", // Orange 700: Warm, high-end primary brand color
          foreground: "#ffffff", // White text
        },
        primaryLight: "#f97316", // Orange 600: Lighter hover state
        primaryDark: "#c2410c", // Orange 800: Deeper active state

        // 2️⃣ Accent Color — Deep Charcoal (Used for secondary buttons/structuring data)
        accent: {
          DEFAULT: "#111827", // Dark Charcoal/Slate 900: Used for black CTAs and structural contrast
          foreground: "#ffffff",
        },
        accentLight: "#374151", // Gray 700: Lighter structural elements
        accentDark: "#0f172a", // Slate 950: Deepest black

        // 3️⃣ Secondary Color — Soft Rose (Used for subtle data visualization)
        secondary: {
          DEFAULT: "#f43f5e", // Rose 500: Soft Pink/Rose for supporting data visualization
          foreground: "#ffffff",
        },

        // 4️⃣ Neutrals (Based on the high-contrast white background)
        background: "#ffffff", // Pure white base
        surface: "#ffffff", // Pure white cards (as seen in image)

        foreground: "#111827", // Dark Charcoal/Slate 900: Main reading text

        muted: {
          DEFAULT: "#6b7280", // Gray 500: Subdued gray for titles/metadata
          foreground: "#9ca3af", // Gray 400: Placeholder/icons
        },

        // Standard UI Elements
        border: "#f3f4f6", // Gray 100: Very subtle separation lines (mimics the image)
        input: "#f8fafc", // Slate 50: Light input background
        ring: "#ea580c", // Focus ring matches Primary

        card: {
          DEFAULT: "#ffffff",
          foreground: "#111827",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#111827",
        },

        // 5️⃣ Destructive / Alerts
        destructive: {
          DEFAULT: "#dc2626", // Red 600
          foreground: "#ffffff",
        },

        // 6️⃣ Chart Colors (Harmonized)
        chart: {
          1: "#ea580c", // Deep Coral (Primary Data Focus)
          2: "#f43f5e", // Soft Rose (Secondary Data)
          3: "#111827", // Charcoal (Structural Data/Base)
          4: "#fb7185", // Rose 400 (Lighter gradient data)
          5: "#9ca3af", // Gray 400 (Muted data)
        },
      },
      borderRadius: {
        xl: "1rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        soft: "0 4px 12px rgba(0, 0, 0, 0.06)",
        medium: "0 6px 20px rgba(0, 0, 0, 0.10)",
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      fontFamily: {
        sans: ["'DM Sans'", "sans-serif"],
      },
	  screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
