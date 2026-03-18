import type { Accent } from "./landing-content";
import styles from "./landing-page.module.css";

export const dashboardHref = "/dashboard";

export type LandingSectionId = "product" | "solutions" | "pricing";

export const accentClassMap: Record<Accent, string> = {
  teal: styles.accentTeal,
  blue: styles.accentBlue,
  purple: styles.accentPurple,
  amber: styles.accentAmber,
  orange: styles.accentOrange,
  red: "",
  cream: "",
};

export const cardAccentClassMap: Record<Accent, string> = {
  teal: styles.cardTeal,
  blue: styles.cardBlue,
  purple: styles.cardPurple,
  amber: styles.cardAmber,
  orange: styles.cardAmber,
  red: "",
  cream: "",
};

export function scrollToSection(sectionId: LandingSectionId): void {
  document.getElementById(sectionId)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}
