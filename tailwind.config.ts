import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        desk: "#E6DFD1",
        deskDark: "#D8CFBC",
        paper: "#FFFDF8",
        paperEdge: "#F1E9DA",
        ink: "#463A31",
        inkSoft: "#8B7E6F",
        twine: "#B08968",
        rose: {
          fresh: "#E88C9A",
          dried: "#C08A6E",
        },
        tulip: {
          fresh: "#E14F63",
          dried: "#B56A55",
        },
        jasmine: {
          fresh: "#FBFBF0",
          dried: "#D8CBA0",
        },
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "serif"],
        hand: ["var(--font-caveat)", "cursive"],
        ui: ["var(--font-nunito)", "sans-serif"],
      },
      boxShadow: {
        paper: "0 2px 6px rgba(70, 58, 49, 0.08), 0 18px 40px -12px rgba(70, 58, 49, 0.25)",
        soft: "0 1px 3px rgba(70, 58, 49, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
