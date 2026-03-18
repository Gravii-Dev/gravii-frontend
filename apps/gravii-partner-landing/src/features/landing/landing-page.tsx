"use client";

import { useRef } from "react";
import { SiteNav } from "./landing-navigation";
import {
  ClosingSection,
  EngineSection,
  HeroSection,
  PricingSection,
  ProblemsSection,
  ProductSection,
  SolutionsSection,
  WhyNowSection,
} from "./landing-sections";
import { useLandingEffects } from "./use-landing-effects";
import styles from "./landing-page.module.css";

export function LandingPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const { isScrolled } = useLandingEffects(pageRef);

  return (
    <div className={styles.page} ref={pageRef}>
      <div className={styles.grain} />
      <SiteNav isScrolled={isScrolled} />
      <HeroSection />
      <ProblemsSection />
      <EngineSection />
      <ProductSection />
      <SolutionsSection />
      <PricingSection />
      <WhyNowSection />
      <ClosingSection />
    </div>
  );
}
