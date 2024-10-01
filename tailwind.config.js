const BACKDROP_WIDTH = "960px";
const PROSE_CONTENT_WIDTH = "39rem";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    backgroundColor: {
      default: "var(--bg-default)",
      subtle: "var(--bg-subtle)",
      canvas: "var(--bg-canvas)",
      footer: "var(--bg-footer)",
      inverse: "var(--bg-inverse)",
      stripe: "var(--bg-stripe)",
      unset: "unset",
    },
    borderColor: {
      default: "var(--border-default)",
    },
    colors: {
      accent: "var(--fg-accent)",
      border: "var(--border-default)",
      "border-accent": "var(--border-accent)",
      default: "var(--fg-default)",
      muted: "var(--fg-muted)",
      inverse: "var(--fg-inverse)",
      subtle: "var(--fg-subtle)",
      inherit: "inherit",
      emphasis: "var(--fg-emphasis)",
      progress: "var(--fg-progress)",
    },
    letterSpacing: {
      normal: "0",
      wide: ".8px",
      "serif-wide": ".6px",
      prose: ".3px",
      wider: "1.1px",
      widest: "2px",
    },
    screens: {
      tablet: "768px",
      "tablet-landscape": "1024px",
      desktop: "1280px",
      max: "1696px",
    },
    extend: {
      aspectRatio: {
        cover: "1 / 1.5",
      },
      boxShadow: {
        all: "0 0 0 1px var(--border-default)",
        bottom: "0px 1px var(--border-default)",
      },
      fontFamily: {
        sans: "var(--font-sans)",
        serif: "var(--font-serif)",
      },
      fontSize: {
        "2.5xl": "1.625rem",
        md: ["1.125rem", "1.5rem"],
        xxs: "0.6875rem",
      },
      maxWidth: {
        prose: PROSE_CONTENT_WIDTH,
        popout: `calc(64px + ${PROSE_CONTENT_WIDTH})`,
        unset: "unset",
        button: "430px",
      },
      padding: {
        container: "var(--container-padding)",
      },
      width: {
        "list-item-cover": "var(--list-item-cover-width)",
      },
    },
  },
};
