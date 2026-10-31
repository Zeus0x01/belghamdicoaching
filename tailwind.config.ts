import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        graphite: "#10100F",
        obsidian: "#171715",
        surface: "#20201D",
        bone: "#EAE6DD",
        copper: "#B97851",
        "copper-dim": "#8A5A3D",
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
