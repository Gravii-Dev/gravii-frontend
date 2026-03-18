"use client";

import { useMemo, useState } from "react";

import DiscoveryFilters from "@/features/discovery/components/discovery-filters";
import DiscoveryPartnerCard from "@/features/discovery/components/discovery-partner-card";
import DiscoveryPartnerDetail from "@/features/discovery/components/discovery-partner-detail";
import {
  DISCOVERY_STATUS_OPTIONS,
  filterDiscoveryPartners,
  getDiscoveryPartner,
} from "@/features/discovery/discovery-view-model";
import { launchMockRepository } from "@/features/launch-app/mock-repository";
import type { SharedContentProps } from "@/features/launch-app/types";

import styles from "./discovery-content.module.css";

export default function DiscoveryContent({ connected, onConnect, onNavigate }: SharedContentProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeStatus, setActiveStatus] = useState<(typeof DISCOVERY_STATUS_OPTIONS)[number]>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);

  const categories = launchMockRepository.getBenefitCategories();
  const filteredPartners = useMemo(
    () =>
      filterDiscoveryPartners({
        searchQuery,
        category: activeCategory,
        status: activeStatus,
      }),
    [activeCategory, activeStatus, searchQuery],
  );
  const selectedPartner = getDiscoveryPartner(selectedPartnerId);

  return (
    <div className={styles.root}>
      <div className={styles.intro}>
        <p className={styles.lead}>Discover the Full Spectrum of Benefits.</p>
        <p className={styles.copy}>Browse diverse offers across the ecosystem. Claim available benefits, or fulfill the requirements to qualify for exclusive privileges.</p>
      </div>

      <DiscoveryFilters
        categories={categories}
        activeCategory={activeCategory}
        statuses={DISCOVERY_STATUS_OPTIONS}
        activeStatus={activeStatus}
        searchQuery={searchQuery}
        onCategoryChange={setActiveCategory}
        onStatusChange={(status) => setActiveStatus(status as (typeof DISCOVERY_STATUS_OPTIONS)[number])}
        onSearchChange={setSearchQuery}
      />

      <div className={styles.panelBody}>
        <div className={`${styles.resultsState} ${connected ? "" : styles.resultsStateLocked}`.trim()}>
          {selectedPartner ? (
            <DiscoveryPartnerDetail
              partner={selectedPartner}
              connected={connected}
              onConnect={onConnect}
              onNavigate={onNavigate}
              onBack={() => setSelectedPartnerId(null)}
            />
          ) : (
            <>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>
                  {filteredPartners.length} partner{filteredPartners.length === 1 ? "" : "s"} matched
                </span>
                {searchQuery ? <span className={styles.summaryHint}>Search: {searchQuery}</span> : null}
              </div>

              <div className={styles.resultsGrid}>
                {filteredPartners.map((partner) => (
                  <DiscoveryPartnerCard key={partner.id} partner={partner} onOpen={setSelectedPartnerId} />
                ))}
              </div>
            </>
          )}
        </div>

        {!connected ? (
          <div className={styles.lockedOverlay}>
          <div className={styles.lockedCard}>
              <p className={styles.lockedTitle} role="button" tabIndex={0} onClick={() => onNavigate?.("profile")} onKeyDown={(e) => e.key === "Enter" && onNavigate?.("profile")}>GET YOUR GRAVII ID</p>
              <p className={styles.lockedCopy}>Unlock benefits curated just for you.</p>
              <p className={styles.lockedItalic}>Complimentary — no strings.</p>
              <p className={styles.lockedConnect} role="button" tabIndex={0} onClick={onConnect} onKeyDown={(e) => e.key === "Enter" && onConnect?.()}>Already have one? <span className={styles.lockedConnectLink}>Connect →</span></p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
