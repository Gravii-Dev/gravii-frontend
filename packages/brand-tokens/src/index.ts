export const graviiColors = {
  ink: "#090907",
  paper: "#fffdf7",
  canvas: "#f7f0e6",
  canvasDim: "#ece2d5",
  blue: "#5aa9ff",
  gold: "#f4d23a",
  green: "#55db9c",
  violet: "#ecd7ff",
  orange: "#f15a24",
} as const;

export const graviiRadii = {
  card: "1.7rem",
  container: "2.25rem",
  pill: "999px",
} as const;

export const graviiMotion = {
  elastic: "0.75s var(--gravii-ease-elastic)",
  emphasized: "420ms cubic-bezier(0.2, 0, 0, 1)",
  standard: "240ms cubic-bezier(0.2, 0, 0, 1)",
} as const;

export const graviiShadows = {
  pop: "0 18px 42px rgba(21, 18, 11, 0.12)",
  soft: "0 24px 84px rgba(39, 31, 20, 0.13)",
  outline: "0 0 0 1.5px var(--gravii-ink)",
} as const;

export const graviiFonts = {
  ui: "var(--gravii-font-ui)",
  display: "var(--gravii-font-display)",
  heading: "var(--gravii-font-heading)",
  mono: "var(--gravii-font-mono)",
} as const;
