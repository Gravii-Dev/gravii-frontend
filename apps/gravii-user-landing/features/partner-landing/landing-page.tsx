'use client'

import { useRef, useState } from 'react'
import { SiteNav } from './landing-navigation'
import {
  ClosingSection,
  EngineSection,
  HeroSection,
  PricingSection,
  ProblemsSection,
  ProductSection,
  SolutionsSection,
  WhyNowSection,
} from './landing-sections'
import { useLandingEffects } from './use-landing-effects'
import styles from './landing-page.module.css'

export type LandingDimension = 'human' | 'agent'

export function LandingPage() {
  const pageRef = useRef<HTMLDivElement>(null)
  const [dimension, setDimension] = useState<LandingDimension>('human')
  const { isScrolled } = useLandingEffects(pageRef)

  return (
    <div className={styles.page} ref={pageRef}>
      <div className={styles.grain} />
      <SiteNav isScrolled={isScrolled} />
      <HeroSection />
      <ProblemsSection />
      <EngineSection dimension={dimension} />
      <ProductSection dimension={dimension} onDimensionChange={setDimension} />
      <SolutionsSection dimension={dimension} />
      <PricingSection dimension={dimension} />
      <WhyNowSection />
      <ClosingSection />
    </div>
  )
}
