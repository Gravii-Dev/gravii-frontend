import type { ReactNode } from "react";

import { getPrototypeWindow } from "@/features/hq/lib/prototype-window";

type SidebarItemProps = {
  active?: boolean;
  children: string;
  page: string;
  svg: ReactNode;
};

function SidebarItem({ active = false, children, page, svg }: Readonly<SidebarItemProps>) {
  return (
    <div
      className={`sb-item${active ? " active" : ""}`}
      data-page={page}
      onClick={(event) => getPrototypeWindow().navTo?.(event.currentTarget)}
    >
      {svg}
      {children}
    </div>
  );
}

export function PrototypeSidebar() {
  return (
    <aside className="sidebar">
      <div className="sb-header">
        <div className="sb-logo">
          Gravii <span className="sb-badge">HQ</span>
        </div>
      </div>

      <nav className="sb-nav">
        <div className="sb-section">
          <SidebarItem
            active
            page="overview"
            svg={
              <svg className="sb-item-icon" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="1" y="1" width="7" height="7" rx="2" />
                <rect x="10" y="1" width="7" height="7" rx="2" />
                <rect x="1" y="10" width="7" height="7" rx="2" />
                <rect x="10" y="10" width="7" height="7" rx="2" />
              </svg>
            }
          >
            Overview
          </SidebarItem>
        </div>

        <div className="sb-section">
          <div className="sb-section-label">User Pool</div>
          <div className="sb-group open">
            <SidebarItem
              page="pool-composition"
              svg={
                <svg className="sb-item-icon" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="9" cy="9" r="7" />
                  <path d="M9 2v14M2 9h14" />
                </svg>
              }
            >
              Composition
            </SidebarItem>
            <SidebarItem
              page="pool-cohort"
              svg={
                <svg className="sb-item-icon" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 14l4-5 3 3 7-9" />
                </svg>
              }
            >
              Cohort Analysis
            </SidebarItem>
            <SidebarItem
              page="pool-explorer"
              svg={
                <svg className="sb-item-icon" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="8" cy="8" r="5" />
                  <path d="M12 12l4 4" />
                </svg>
              }
            >
              User Explorer
            </SidebarItem>
          </div>
        </div>

        <div className="sb-section">
          <div className="sb-section-label">Acquisition</div>
          <div className="sb-group open">
            <SidebarItem
              page="acq-source"
              svg={
                <svg className="sb-item-icon" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 2v6m0 0l4-3m-4 3L5 5" />
                  <rect x="2" y="10" width="14" height="6" rx="2" />
                </svg>
              }
            >
              Source Breakdown
            </SidebarItem>
            <SidebarItem
              page="acq-attribution"
              svg={
                <svg className="sb-item-icon" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 9h3l2-4 3 8 2-4h4" />
                </svg>
              }
            >
              Attribution
            </SidebarItem>
            <SidebarItem
              page="acq-funnel"
              svg={
                <svg className="sb-item-icon" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 3h14l-5 6v5l-4 2v-7z" />
                </svg>
              }
            >
              Funnel
            </SidebarItem>
          </div>
        </div>

        <div className="sb-section">
          <div className="sb-section-label">Partners</div>
          <div className="sb-group open">
            <SidebarItem
              page="partner-list"
              svg={
                <svg className="sb-item-icon" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="3" width="14" height="12" rx="2" />
                  <path d="M2 7h14" />
                </svg>
              }
            >
              Partner List
            </SidebarItem>
            <SidebarItem
              page="partner-perf"
              svg={
                <svg className="sb-item-icon" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 14l4-4 3 2 7-8" />
                  <circle cx="16" cy="4" r="1.5" />
                </svg>
              }
            >
              Performance
            </SidebarItem>
            <SidebarItem
              page="campaigns"
              svg={
                <svg className="sb-item-icon" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="14" height="14" rx="2" />
                  <path d="M6 7h6m-6 4h4" />
                </svg>
              }
            >
              Campaigns
            </SidebarItem>
          </div>
        </div>

        <div className="sb-section">
          <div className="sb-section-label">Risk & Health</div>
          <div className="sb-group open">
            <SidebarItem
              page="risk-sybil"
              svg={
                <svg className="sb-item-icon" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 2l7 12H2z" />
                  <path d="M9 7v3m0 2v1" />
                </svg>
              }
            >
              Sybil Monitor
            </SidebarItem>
            <SidebarItem
              page="risk-health"
              svg={
                <svg className="sb-item-icon" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 9h3l2-4 2 8 2-6 2 4h3" />
                </svg>
              }
            >
              Growth Health
            </SidebarItem>
          </div>
        </div>

        <div className="sb-section" style={{ marginTop: "12px" }}>
          <div className="sb-chat-trigger" onClick={() => getPrototypeWindow().toggleChat?.()}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div className="sb-chat-icon">✦</div>
              <div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--hq)" }}>
                  Gravii Insight
                </div>
                <div style={{ fontSize: "10px", color: "var(--textD)" }}>
                  Ask anything about your data
                </div>
              </div>
            </div>
            <div className="sb-chat-dot" id="chatDot" />
          </div>
        </div>
      </nav>

      <div className="sb-footer">
        <div className="sb-avatar">G</div>
        <div className="sb-user-info">
          <div className="sb-user-name">Gravii Team</div>
          <div className="sb-user-role">Internal · Full Access</div>
        </div>
      </div>
    </aside>
  );
}
