import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        graphite: "#131110",
        obsidian: "#1C1916",
        surface: "#26211C",
        bone: "#EAE6DD",
        copper: "#E8793F",
        "copper-dim": "#B45A26",
        amber: "#D8A84E",
        wgray: "#77746E",
        "wgray-dim": "#4A4844",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
      },
      letterSpacing: {
        tightest: "-0.05em",
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
