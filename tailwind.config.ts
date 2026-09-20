import type { Config } from "tailwindcss";

export default {
  // hover só onde existe hover de verdade: no toque, o :hover gruda depois do tap (botão ficava erguido)
  future: { hoverOnlyWhenSupported: true },
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      fontFamily: {
        display: ["Google Sans", "Google Sans Fallback", "Roboto", "Arial", "sans-serif"],
        body: ["Google Sans", "Google Sans Fallback", "Roboto", "Arial", "sans-serif"],
        sans: ["Google Sans", "Google Sans Fallback", "Roboto", "Arial", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Identidade NSM = design system NotebookLM (~/Projetos/NSM/nsm-brand/tokens.css)
        nlm: {
          blue: "#4259ff",
          "blue-strong": "#384acf",
          page: "#edeffa",
          stroke: "#dde1eb",
          title: "#1b1b1c",
          body: "#303030",
          secondary: "#5e5e5e",
          // o #777 do DS dá 4,48:1 no branco; #757575 é o cinza mais próximo que passa AA
          placeholder: "#757575",
          positive: "#128937",
          "positive-bg": "#e1f1e5",
          negative: "#db372d",
          "negative-bg": "#f7edeb",
          "tile-blue": "#edeffa",
          "on-tile-blue": "#224484",
          "tile-green": "#e1f1e5",
          "on-tile-green": "#0f5223",
          "tile-yellow": "#f2f2e8",
          "on-tile-yellow": "#796731",
          "tile-pink": "#f0e9ef",
          "on-tile-pink": "#802272",
          "tile-cyan": "#def1f7",
          "on-tile-cyan": "#056a95",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        // plano; sombra só no que flutua (diálogo)
        "nlm-float": "0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12)",
      },
      keyframes: {
        "marquee-scroll": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-scroll-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "quiz-fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "quiz-slide-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "marquee-scroll": "marquee-scroll 25s linear infinite",
        "marquee-scroll-fast": "marquee-scroll 15s linear infinite",
        "marquee-scroll-slow": "marquee-scroll 30s linear infinite",
        "marquee-scroll-reverse": "marquee-scroll-reverse 25s linear infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "quiz-fade-in": "quiz-fade-in 300ms ease-out",
        "quiz-slide-up": "quiz-slide-up 400ms ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
