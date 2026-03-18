"use client";

import { useEffect, useState } from "react";

import {
  CHAT_RESPONSES,
  CHAT_SUGGESTIONS,
  INSIGHTS_BY_PAGE,
  NAVIGATION,
  PAGE_TITLES,
  PERIOD_OPTIONS
} from "@/features/hq/data";
import { DashboardSectionView } from "@/features/hq/section-view";
import {
  filterCampaigns,
  filterPartners,
  getAllPartners,
  getPartnerByName
} from "@/features/hq/selectors";
import type {
  DashboardPageId,
  InsightKey,
  NavigationItem
} from "@/features/hq/types";
import styles from "@/features/hq/dashboard.module.css";

type ChatMessage = {
  role: "assistant" | "user";
  text: string;
};

const INITIAL_PAGE: DashboardPageId = "overview";

function detectInsightIntent(text: string): InsightKey | null {
  const lower = text.toLowerCase();

  if (
    lower.includes("summary") ||
    lower.includes("overview") ||
    lower.includes("brief") ||
    lower.includes("snapshot")
  ) {
    return "summary";
  }

  if (lower.includes("sybil") || lower.includes("fraud") || lower.includes("bot")) {
    return "sybil";
  }

  if (
    lower.includes("revenue") ||
    lower.includes("mrr") ||
    lower.includes("money") ||
    lower.includes("earning")
  ) {
    return "revenue";
  }

  if (lower.includes("partner") || lower.includes("upsell")) {
    return "partners";
  }

  if (
    lower.includes("campaign") ||
    lower.includes("cpa") ||
    lower.includes("engage") ||
    lower.includes("reach")
  ) {
    return "campaigns";
  }

  if (
    lower.includes("growth") ||
    lower.includes("health") ||
    lower.includes("churn") ||
    lower.includes("grade")
  ) {
    return "growth";
  }

  return null;
}

function toggleSelection(current: string[], nextValue: string): string[] {
  return current.includes(nextValue)
    ? current.filter((value) => value !== nextValue)
    : [...current, nextValue];
}

function formatLiveTime(date: Date): string {
  return `${date.toLocaleTimeString("en-US", {
    hour12: false,
    timeZone: "Asia/Seoul"
  })} KST`;
}

export function HqDashboard() {
  const [currentPage, setCurrentPage] = useState<DashboardPageId>(INITIAL_PAGE);
  const [selectedPeriod, setSelectedPeriod] = useState<(typeof PERIOD_OPTIONS)[number]>(
    "7d"
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [clock, setClock] = useState(formatLiveTime(new Date()));
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedPartnerName, setSelectedPartnerName] = useState("Nexus Finance");
  const [partnerSearch, setPartnerSearch] = useState("");
  const [partnerStatusFilters, setPartnerStatusFilters] = useState<string[]>([]);
  const [partnerPlanFilters, setPartnerPlanFilters] = useState<string[]>([]);
  const [partnerProductFilters, setPartnerProductFilters] = useState<string[]>([]);
  const [campaignStatusFilters, setCampaignStatusFilters] = useState<string[]>([]);
  const [campaignScopeFilters, setCampaignScopeFilters] = useState<string[]>([]);
  const [campaignPartnerFilters, setCampaignPartnerFilters] = useState<string[]>([]);
  const [explorerQueryDraft, setExplorerQueryDraft] = useState("");
  const [explorerQuery, setExplorerQuery] = useState("");
  const [explorerSearchTick, setExplorerSearchTick] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setClock(formatLiveTime(new Date()));
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const filteredPartners = filterPartners({
    searchText: partnerSearch,
    statuses: partnerStatusFilters,
    plans: partnerPlanFilters,
    products: partnerProductFilters
  });

  const filteredCampaigns = filterCampaigns({
    statuses: campaignStatusFilters,
    scopes: campaignScopeFilters,
    partnerMatches: campaignPartnerFilters
  });

  const selectedPartner =
    getPartnerByName(selectedPartnerName) ??
    filteredPartners[0] ??
    getAllPartners()[0];

  const pageTitle =
    currentPage === "partner-detail" && selectedPartner
      ? `${selectedPartner.name} — Detail`
      : PAGE_TITLES[currentPage];

  const primaryInsight =
    INSIGHTS_BY_PAGE[currentPage][0] ??
    "I can help you interpret pool health, partner performance, and acquisition quality.";

  const initializeChat = () => {
    setMessages([
      {
        role: "assistant",
        text: `Welcome to Gravii Insight. ${primaryInsight}`
      }
    ]);
  };

  const handleNavigate = (pageId: DashboardPageId) => {
    setCurrentPage(pageId);
    setSidebarOpen(false);
  };

  const handleOpenPartnerDetail = (partnerName: string) => {
    setSelectedPartnerName(partnerName);
    setCurrentPage("partner-detail");
    setSidebarOpen(false);
  };

  const handleToggleChat = () => {
    setChatOpen((open) => {
      const next = !open;
      if (next && messages.length === 0) {
        initializeChat();
      }
      return next;
    });
  };

  const pushInsightResponse = (userText: string, key: InsightKey | null) => {
    setMessages((current) => [
      ...current,
      { role: "user", text: userText },
      {
        role: "assistant",
        text:
          key === null
            ? "I can help with weekly summary, sybil analysis, revenue breakdown, partner health, campaign performance, or growth metrics."
            : CHAT_RESPONSES[key]
      }
    ]);
  };

  const handleSendChat = () => {
    const text = chatInput.trim();
    if (text.length === 0) {
      return;
    }

    const intent = detectInsightIntent(text);
    setChatInput("");
    pushInsightResponse(text, intent);
  };

  const handleSuggestion = (key: InsightKey, label: string) => {
    pushInsightResponse(label, key);
  };

  const renderNavigationItem = (item: NavigationItem) => {
    const isActive =
      currentPage === item.id ||
      (currentPage === "partner-detail" && item.id === "partner-list");

    return (
      <button
        key={item.id}
        type="button"
        className={`${styles.navButton} ${isActive ? styles.navButtonActive : ""}`}
        onClick={() => handleNavigate(item.id)}
        aria-current={isActive ? "page" : undefined}
      >
        <span className={styles.navLabel}>{item.label}</span>
        <span className={styles.navDescription}>{item.description}</span>
      </button>
    );
  };

  return (
    <div className={styles.shell}>
      <div
        className={`${styles.mobileBackdrop} ${sidebarOpen ? styles.mobileBackdropOpen : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logoRow}>
            <div className={styles.logo}>Gravii</div>
            <span className={styles.logoBadge}>HQ</span>
          </div>
          <p className={styles.sidebarLead}>
            Productized operating dashboard built from the original prototype and organized for
            real feature growth.
          </p>
        </div>

        <nav className={styles.navigation} aria-label="Primary">
          {NAVIGATION.map((group) => (
            <section key={group.label} className={styles.navSection}>
              <p className={styles.navSectionLabel}>{group.label}</p>
              <div className={styles.navSectionItems}>{group.items.map(renderNavigationItem)}</div>
            </section>
          ))}
        </nav>

        <button type="button" className={styles.chatTrigger} onClick={handleToggleChat}>
          <div>
            <div className={styles.chatTriggerTitle}>Gravii Insight</div>
            <div className={styles.chatTriggerSub}>Ask about data quality, growth, and revenue</div>
          </div>
          <span className={styles.chatTriggerBadge}>{messages.length > 0 ? "LIVE" : "AI"}</span>
        </button>

        <div className={styles.sidebarFooter}>
          <div className={styles.userAvatar}>G</div>
          <div>
            <div className={styles.userName}>Gravii Team</div>
            <div className={styles.userRole}>Internal · Full Access</div>
          </div>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerPrimary}>
            <button
              type="button"
              className={styles.menuButton}
              onClick={() => setSidebarOpen((open) => !open)}
              aria-label="Toggle navigation"
            >
              <span />
              <span />
              <span />
            </button>
            <div>
              <h1 className={styles.headerTitle}>{pageTitle}</h1>
              <p className={styles.headerSubtitle}>{primaryInsight}</p>
            </div>
          </div>

          <div className={styles.headerMeta}>
            <div className={styles.periodSelector} role="tablist" aria-label="Period selector">
              {PERIOD_OPTIONS.map((period) => (
                <button
                  key={period}
                  type="button"
                  className={`${styles.periodButton} ${
                    selectedPeriod === period ? styles.periodButtonActive : ""
                  }`}
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period}
                </button>
              ))}
            </div>
            <span className={styles.statusPill}>Live</span>
            <span className={styles.clock}>{clock}</span>
          </div>
        </header>

        <div className={styles.pageContent}>
          <DashboardSectionView
            currentPage={currentPage}
            selectedPeriod={selectedPeriod}
            filteredPartners={filteredPartners}
            filteredCampaigns={filteredCampaigns}
            selectedPartner={selectedPartner}
            partnerSearch={partnerSearch}
            partnerStatusFilters={partnerStatusFilters}
            partnerPlanFilters={partnerPlanFilters}
            partnerProductFilters={partnerProductFilters}
            campaignStatusFilters={campaignStatusFilters}
            campaignScopeFilters={campaignScopeFilters}
            campaignPartnerFilters={campaignPartnerFilters}
            explorerQuery={explorerQuery}
            explorerQueryDraft={explorerQueryDraft}
            onNavigate={handleNavigate}
            onOpenPartnerDetail={handleOpenPartnerDetail}
            onPartnerSearchChange={setPartnerSearch}
            onTogglePartnerStatus={(value) =>
              setPartnerStatusFilters((current) => toggleSelection(current, value))
            }
            onTogglePartnerPlan={(value) =>
              setPartnerPlanFilters((current) => toggleSelection(current, value))
            }
            onTogglePartnerProduct={(value) =>
              setPartnerProductFilters((current) => toggleSelection(current, value))
            }
            onResetPartnerFilters={() => {
              setPartnerSearch("");
              setPartnerStatusFilters([]);
              setPartnerPlanFilters([]);
              setPartnerProductFilters([]);
            }}
            onToggleCampaignStatus={(value) =>
              setCampaignStatusFilters((current) => toggleSelection(current, value))
            }
            onToggleCampaignScope={(value) =>
              setCampaignScopeFilters((current) => toggleSelection(current, value))
            }
            onToggleCampaignPartner={(value) =>
              setCampaignPartnerFilters((current) => toggleSelection(current, value))
            }
            onResetCampaignFilters={() => {
              setCampaignStatusFilters([]);
              setCampaignScopeFilters([]);
              setCampaignPartnerFilters([]);
            }}
            onExplorerQueryDraftChange={setExplorerQueryDraft}
            onExplorerSearch={() => {
              setExplorerQuery(explorerQueryDraft.trim());
              setExplorerSearchTick((value) => value + 1);
            }}
            explorerSearchTick={explorerSearchTick}
          />
        </div>
      </main>

      <div className={`${styles.drawerBackdrop} ${chatOpen ? styles.drawerBackdropOpen : ""}`} onClick={handleToggleChat} />
      <aside className={`${styles.drawer} ${chatOpen ? styles.drawerOpen : ""}`}>
        <div className={styles.drawerHeader}>
          <div>
            <div className={styles.drawerTitle}>Gravii Insight</div>
            <div className={styles.drawerSubtitle}>AI-powered operating analysis assistant</div>
          </div>
          <button type="button" className={styles.drawerClose} onClick={handleToggleChat}>
            Close
          </button>
        </div>

        <div className={styles.drawerMessages}>
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`${styles.chatMessage} ${
                message.role === "assistant" ? styles.chatMessageAssistant : styles.chatMessageUser
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>

        <div className={styles.drawerSuggestions}>
          {CHAT_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion.key}
              type="button"
              className={styles.suggestionChip}
              onClick={() => handleSuggestion(suggestion.key, suggestion.label)}
            >
              {suggestion.label}
            </button>
          ))}
        </div>

        <div className={styles.drawerComposer}>
          <input
            value={chatInput}
            onChange={(event) => setChatInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSendChat();
              }
            }}
            className={styles.drawerInput}
            placeholder="Ask about summary, sybil, revenue, partners, campaigns, or growth"
          />
          <button type="button" className={styles.drawerSend} onClick={handleSendChat}>
            Send
          </button>
        </div>
      </aside>
    </div>
  );
}
