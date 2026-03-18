"use client";

import { useState } from "react";

export type MySpaceSectionKey = "benefits" | "almostThere" | "inviteOnly";
export type MySpaceSectionState = Record<MySpaceSectionKey, boolean>;

const INITIAL_OPEN_SECTIONS: MySpaceSectionState = {
  benefits: true,
  almostThere: true,
  inviteOnly: true,
};

export function useMySpaceState() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openSections, setOpenSections] = useState<MySpaceSectionState>(INITIAL_OPEN_SECTIONS);
  const [optedIn, setOptedIn] = useState<Record<string, boolean>>({});
  const [expandedCardKey, setExpandedCardKey] = useState<string | null>(null);

  const toggleSection = (section: MySpaceSectionKey) => {
    setOpenSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  };

  const toggleCard = (cardKey: string) => {
    setExpandedCardKey((current) => (current === cardKey ? null : cardKey));
  };

  const markOptedIn = (cardKey: string) => {
    setOptedIn((current) => ({
      ...current,
      [cardKey]: true,
    }));
  };

  return {
    activeCategory,
    setActiveCategory,
    openSections,
    toggleSection,
    expandedCardKey,
    toggleCard,
    optedIn,
    markOptedIn,
  };
}
