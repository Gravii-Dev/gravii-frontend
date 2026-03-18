"use client";

import { useEffect, useRef } from "react";

import { PrototypeAppShell } from "@/features/hq/components/app-shell";
import { PrototypeAcqAttributionPage } from "@/features/hq/pages/acq-attribution";
import { PrototypeAcqFunnelPage } from "@/features/hq/pages/acq-funnel";
import { PrototypeAcqSourcePage } from "@/features/hq/pages/acq-source";
import { PrototypeCampaignsPage } from "@/features/hq/pages/campaigns";
import { PrototypeOverviewPage } from "@/features/hq/pages/overview";
import { PrototypePartnerDetailPage } from "@/features/hq/pages/partner-detail";
import { PrototypePartnerListPage } from "@/features/hq/pages/partner-list";
import { PrototypePartnerPerfPage } from "@/features/hq/pages/partner-perf";
import { PrototypePoolCohortPage } from "@/features/hq/pages/pool-cohort";
import { PrototypePoolCompositionPage } from "@/features/hq/pages/pool-composition";
import { PrototypePoolExplorerPage } from "@/features/hq/pages/pool-explorer";
import { PrototypeRiskHealthPage } from "@/features/hq/pages/risk-health";
import { PrototypeRiskSybilPage } from "@/features/hq/pages/risk-sybil";
import type { Campaign, DashboardPageId, Partner } from "@/features/hq/types";

type PrototypeRuntimeProps = {
  campaigns: Campaign[];
  chatResponses: Record<string, string>;
  insights: Record<string, string[]>;
  pageTitles: Record<DashboardPageId, string>;
  partners: Partner[];
  styleContent: string;
};

export function PrototypeRuntime({
  campaigns,
  chatResponses,
  insights,
  pageTitles,
  partners,
  styleContent
}: Readonly<PrototypeRuntimeProps>) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    let chatOpen = false;
    let currentChatPage = "overview";
    const intervals: number[] = [];
    const timeouts: number[] = [];

    const byId = <T extends HTMLElement>(id: string) =>
      root.querySelector<T>(`#${id}`);

    const query = <T extends Element>(selector: string) => root.querySelector<T>(selector);

    const queryAll = <T extends Element>(selector: string) =>
      Array.from(root.querySelectorAll<T>(selector));

    const restartAnimation = (element: HTMLElement) => {
      element.style.animation = "none";
      void element.offsetHeight;
      element.style.animation = "";
    };

    const animateStats = (container?: ParentNode | null) => {
      const target = container ?? root;

      Array.from(target.querySelectorAll<HTMLElement>(".stat-value")).forEach((element) => {
        const raw = element.textContent?.trim() ?? "";
        const hasPercent = raw.includes("%");
        const hasDollar = raw.startsWith("$");
        const hasPlus = raw.startsWith("+");
        const cleaned = raw.replace(/[$%+,]/g, "");
        const value = Number.parseFloat(cleaned);

        if (Number.isNaN(value) || value === 0) {
          return;
        }

        const duration = 800;
        const start = performance.now();

        const formatValue = (currentValue: number) => {
          let formatted = "";

          if (hasDollar) {
            formatted += "$";
          }

          if (hasPlus && currentValue > 0) {
            formatted += "+";
          }

          if (value >= 1000) {
            formatted += Math.round(currentValue).toLocaleString();
          } else if (value < 10) {
            formatted += currentValue.toFixed(value % 1 !== 0 ? 2 : 0);
          } else {
            formatted += currentValue.toFixed(value % 1 !== 0 ? 1 : 0);
          }

          if (hasPercent) {
            formatted += "%";
          }

          return formatted;
        };

        element.textContent = formatValue(0);

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          element.textContent = formatValue(value * eased);

          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            element.textContent = raw;
          }
        };

        requestAnimationFrame(tick);
      });
    };

    const updateChatContext = (pageId: string) => {
      currentChatPage = pageId;
    };

    const navTo = (element: HTMLElement) => {
      queryAll<HTMLElement>(".sb-item").forEach((item) => item.classList.remove("active"));
      element.classList.add("active");

      const pageId = element.dataset.page ?? "";
      queryAll<HTMLElement>(".page").forEach((page) => page.classList.remove("active"));
      const target = byId<HTMLElement>(`page-${pageId}`);

      if (target) {
        target.classList.add("active");
      }

      const pageTitle = byId<HTMLElement>("pageTitle");
      if (pageTitle) {
        pageTitle.textContent = pageTitles[pageId as DashboardPageId] ?? pageId;
      }

      target?.querySelectorAll<HTMLElement>(".fade-in").forEach(restartAnimation);

      const main = query<HTMLElement>(".main");
      if (main) {
        main.scrollTop = 0;
      }

      animateStats(target);
      updateChatContext(pageId);
    };

    const navToPage = (pageId: string) => {
      const item = query<HTMLElement>(`.sb-item[data-page="${pageId}"]`);
      if (item) {
        navTo(item);
      }
    };

    const updateTime = () => {
      const now = new Date();
      const liveTime = byId<HTMLElement>("liveTime");

      if (liveTime) {
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const seconds = now.getSeconds().toString().padStart(2, "0");
        liveTime.textContent = `${hours}:${minutes}:${seconds} KST`;
      }
    };

    const renderGrowthChart = () => {
      const chart = byId<HTMLElement>("growthChart");

      if (!chart) {
        return;
      }

      chart.innerHTML = "";

      const data = [
        42, 38, 45, 52, 48, 55, 60, 58, 63, 67, 62, 70, 75, 72, 78, 82, 80, 85,
        88, 84, 90, 95, 92, 98, 100, 96, 105, 110, 108, 115
      ];
      const max = Math.max(...data);

      data.forEach((value, index) => {
        const bar = document.createElement("div");
        bar.className = "mini-bar";
        bar.style.height = "0%";
        bar.style.background =
          "linear-gradient(180deg,var(--hq) 0%,rgba(232,168,124,0.3) 100%)";

        const timeout = window.setTimeout(() => {
          bar.style.height = `${(value / max) * 90}%`;
        }, 100 + index * 30);

        timeouts.push(timeout);
        chart.appendChild(bar);
      });
    };

    const renderSourceTrend = () => {
      const chart = byId<HTMLElement>("sourceTrendChart");

      if (!chart) {
        return;
      }

      chart.innerHTML = "";

      const weeks = [
        [34, 18, 22, 8, 3],
        [36, 19, 20, 9, 3],
        [38, 20, 19, 10, 3],
        [35, 22, 18, 10, 4],
        [37, 23, 18, 10, 3],
        [39, 21, 19, 9, 4],
        [40, 22, 18, 10, 3],
        [38, 24, 17, 10, 4],
        [40, 23, 18, 10, 3],
        [41, 24, 18, 10, 4],
        [42, 24, 17, 11, 4],
        [42, 24, 18, 10, 4]
      ];
      const colors = ["var(--teal)", "var(--blue)", "var(--purple)", "var(--amber)", "var(--hq)"];

      weeks.forEach((week, weekIndex) => {
        const column = document.createElement("div");
        column.style.cssText =
          "flex:1;display:flex;flex-direction:column-reverse;gap:1px;height:100%";

        const total = week.reduce((sum, value) => sum + value, 0);

        week.forEach((value, segmentIndex) => {
          const segment = document.createElement("div");
          segment.style.cssText = `height:0%;background:${colors[segmentIndex]};border-radius:2px;transition:height 0.8s cubic-bezier(0.34,1.56,0.64,1);opacity:0.85`;

          const timeout = window.setTimeout(() => {
            segment.style.height = `${(value / total) * 100}%`;
          }, 200 + weekIndex * 60);

          timeouts.push(timeout);
          column.appendChild(segment);
        });

        chart.appendChild(column);
      });
    };

    const animateHorizontalBars = () => {
      const timeout = window.setTimeout(() => {
        queryAll<HTMLElement>(".hbar-fill").forEach((bar) => {
          const width = bar.style.width;
          bar.style.width = "0%";

          const nestedTimeout = window.setTimeout(() => {
            bar.style.width = width;
          }, 100);

          timeouts.push(nestedTimeout);
        });
      }, 200);

      timeouts.push(timeout);
    };

    const getActiveFilters = (bar: HTMLElement) => {
      const filters: string[][] = [];

      bar.querySelectorAll<HTMLElement>(".filter-group").forEach((group) => {
        const active: string[] = [];

        group.querySelectorAll<HTMLElement>(".fbtn.f-active").forEach((button) => {
          const text = button.textContent?.trim() ?? "";
          if (!text.startsWith("All")) {
            active.push(text);
          }
        });

        filters.push(active);
      });

      return filters;
    };

    const applyFilters = (bar: HTMLElement) => {
      const page = bar.closest<HTMLElement>(".page");
      if (!page) {
        return;
      }

      const filters = getActiveFilters(bar);

      page.querySelectorAll<HTMLTableElement>(".tbl").forEach((table) => {
        table.querySelectorAll<HTMLTableRowElement>("tbody tr").forEach((row) => {
          const cells = Array.from(row.querySelectorAll<HTMLTableCellElement>("td")).map((cell) =>
            cell.textContent?.trim() ?? ""
          );
          const allText = cells.join(" ").toLowerCase();

          let show = true;

          filters.forEach((filterGroup) => {
            if (filterGroup.length === 0) {
              return;
            }

            const match = filterGroup.some((value) => allText.includes(value.toLowerCase()));
            if (!match) {
              show = false;
            }
          });

          row.style.display = show ? "" : "none";
        });
      });
    };

    const renderPartnerList = (filtered?: Partner[]) => {
      const data = filtered ?? partners;
      const statsElement = byId<HTMLElement>("pl-stats");
      const tableElement = byId<HTMLElement>("pl-table");
      const footerElement = byId<HTMLElement>("pl-footer");

      if (!statsElement || !tableElement || !footerElement) {
        return;
      }

      const total = data.length;
      const usingGate = data.filter((partner) => partner.products.includes("G")).length;
      const usingReach = data.filter((partner) => partner.products.includes("R")).length;
      const usingLens = data.filter((partner) => partner.products.includes("L")).length;

      statsElement.innerHTML = `
        <div class="stat-card" data-accent="hq"><div class="stat-label">Partners</div><div class="stat-value">${total}</div><div class="stat-sub">Matching filters</div></div>
        <div class="stat-card" data-accent="green"><div class="stat-label">Using Gate</div><div class="stat-value">${usingGate}</div><div class="stat-sub">${total ? `${Math.round((usingGate / total) * 100)}%` : "-"}</div></div>
        <div class="stat-card" data-accent="teal"><div class="stat-label">Using Reach</div><div class="stat-value">${usingReach}</div><div class="stat-sub">${total ? `${Math.round((usingReach / total) * 100)}%` : "-"}</div></div>
        <div class="stat-card" data-accent="purple"><div class="stat-label">Using Lens</div><div class="stat-value">${usingLens}</div><div class="stat-sub">${total ? `${Math.round((usingLens / total) * 100)}%` : "-"}</div></div>`;

      const productTag = (products: Partner["products"]) =>
        products
          .map(
            (product) =>
              `<span class="tag tag-${product === "R" ? "teal" : product === "G" ? "blue" : "purple"}" style="margin-right:2px">${product}</span>`
          )
          .join("");
      const statusColor = (status: string) =>
        status === "Active" ? "green" : status === "Review" ? "amber" : "red";
      const totalEngaged = (partner: Partner) =>
        partner.campaignList.reduce((sum, campaign) => sum + campaign.engaged, 0);
      const engagementRate = (partner: Partner) => {
        const engaged = totalEngaged(partner);
        const users = partner.users1st;
        return users > 0 && engaged > 0 ? `${((engaged / users) * 100).toFixed(1)}%` : "—";
      };

      tableElement.innerHTML = `<table class="tbl">
        <thead><tr><th>Partner</th><th>Status</th><th>Plan</th><th>Products</th><th>Users</th><th>Engaged</th><th>Eng. Rate</th><th>Gold+</th><th>Sybil</th><th>Campaigns</th><th>Joined</th></tr></thead>
        <tbody>${data
          .map(
            (partner) => `<tr style="cursor:pointer" onclick="showPartnerDetail('${partner.name}')">
          <td style="font-weight:600;color:var(--text)">${partner.name}</td>
          <td><span class="tag tag-${statusColor(partner.status)}">${partner.status}</span></td>
          <td class="tbl-mono">${partner.plan}</td>
          <td>${productTag(partner.products)}</td>
          <td class="tbl-mono">${partner.users1st ? partner.users1st.toLocaleString() : "0"}</td>
          <td class="tbl-mono">${totalEngaged(partner) ? totalEngaged(partner).toLocaleString() : "0"}</td>
          <td class="tbl-mono">${engagementRate(partner)}</td>
          <td class="tbl-mono">${partner.goldRate ? `${partner.goldRate}%` : "—"}</td>
          <td class="tbl-mono">${partner.sybilRate ? `${partner.sybilRate}%` : "—"}</td>
          <td class="tbl-mono">${partner.campaigns}</td>
          <td class="tbl-mono">${partner.joined}</td>
        </tr>`
          )
          .join("")}</tbody></table>`;

      footerElement.textContent = `Showing ${data.length} of ${partners.length} partners · R = Reach, G = Gate, L = Lens`;
      animateStats(byId("page-partner-list"));
    };

    const filterPartnerList = () => {
      const bar = query<HTMLElement>("#page-partner-list .filter-bar");
      if (!bar) {
        return;
      }

      const filters = getActiveFilters(bar);
      const search = (byId<HTMLInputElement>("pl-search")?.value ?? "").toLowerCase().trim();
      let data = [...partners];

      if (search) {
        data = data.filter((partner) => partner.name.toLowerCase().includes(search));
      }

      if (filters[0]?.length) {
        data = data.filter((partner) =>
          filters[0].some((value) => partner.status.toLowerCase() === value.toLowerCase())
        );
      }

      if (filters[1]?.length) {
        data = data.filter((partner) =>
          filters[1].some((value) => partner.plan.toLowerCase() === value.toLowerCase())
        );
      }

      if (filters[2]?.length) {
        data = data.filter((partner) =>
          filters[2].some((value) => {
            const product = value === "Reach" ? "R" : value === "Gate" ? "G" : "L";
            return partner.products.includes(product);
          })
        );
      }

      renderPartnerList(data);
    };

    const renderCampaigns = (filtered?: Campaign[]) => {
      const data = filtered ?? campaigns;
      const statsElement = byId<HTMLElement>("camp-stats");
      const tableElement = byId<HTMLElement>("camp-table");
      const footerElement = byId<HTMLElement>("camp-footer");

      if (!statsElement || !tableElement || !footerElement) {
        return;
      }

      const live = data.filter((campaign) => campaign.status === "Live").length;
      const totalEngaged = data.reduce((sum, campaign) => sum + campaign.engaged, 0);
      const totalNewIds = data.reduce((sum, campaign) => sum + campaign.newIds, 0);
      const totalCost = data.reduce((sum, campaign) => sum + campaign.cost, 0);
      const averageCpa = totalEngaged > 0 ? totalCost / totalEngaged : 0;

      statsElement.innerHTML = `
        <div class="stat-card" data-accent="green"><div class="stat-label">Live</div><div class="stat-value">${live}</div><div class="stat-sub">${data.length} total matching</div></div>
        <div class="stat-card" data-accent="teal"><div class="stat-label">Total Engaged</div><div class="stat-value">${totalEngaged.toLocaleString()}</div><div class="stat-sub">Across filtered campaigns</div></div>
        <div class="stat-card" data-accent="blue"><div class="stat-label">New IDs</div><div class="stat-value">${totalNewIds.toLocaleString()}</div><div class="stat-sub">First entered through Reach</div></div>
        <div class="stat-card" data-accent="hq"><div class="stat-label">Avg CPA <span class="roi-tip" title="CPA = Cost ÷ Engaged (cost per user acquired)">i</span></div><div class="stat-value">$${averageCpa.toFixed(2)}</div><div class="stat-sub">Lower is better</div></div>
        <div class="stat-card" data-accent="green"><div class="stat-label">Total Cost</div><div class="stat-value">$${totalCost.toLocaleString()}</div><div class="stat-sub">Across filtered campaigns</div></div>`;

      const scopeColor = (scope: string) =>
        scope === "Users" ? "blue" : scope === "Gravii Pool" ? "purple" : "teal";
      const statusTag = (status: string) =>
        status === "Live"
          ? '<span class="tag tag-green">Live</span>'
          : status === "Ending"
            ? '<span class="tag tag-amber">Ending</span>'
            : `<span style="color:var(--textD)">${status}</span>`;

      tableElement.innerHTML = `<table class="tbl">
        <thead><tr><th>Campaign</th><th>Partner</th><th>Scope</th><th>Engaged</th><th>New IDs</th><th>Cost</th><th>CPA <span class="roi-tip" title="CPA = Cost ÷ Engaged (cost per user acquired)">i</span></th><th>Status</th></tr></thead>
        <tbody>${data
          .map(
            (campaign) => `<tr>
          <td style="font-weight:600;color:var(--text)">${campaign.name}</td>
          <td>${campaign.partner}</td>
          <td><span class="tag tag-${scopeColor(campaign.scope)}">${campaign.scope}</span></td>
          <td class="tbl-mono">${campaign.engaged.toLocaleString()}</td>
          <td class="tbl-mono">${campaign.newIds.toLocaleString()}</td>
          <td class="tbl-mono">$${campaign.cost.toLocaleString()}</td>
          <td class="tbl-mono">$${campaign.cpa.toFixed(2)}</td>
          <td>${statusTag(campaign.status)}</td>
        </tr>`
          )
          .join("")}</tbody></table>`;

      footerElement.textContent = `Showing ${data.length} of ${campaigns.length} campaigns · Scope: Users = partner pool only, Gravii Pool = full pool, Both = combined`;
      animateStats(byId("page-campaigns"));
    };

    const filterCampaigns = () => {
      const bar = query<HTMLElement>("#page-campaigns .filter-bar");
      if (!bar) {
        return;
      }

      const filters = getActiveFilters(bar);
      let data = [...campaigns];

      if (filters[0]?.length) {
        data = data.filter((campaign) =>
          filters[0].some((value) => campaign.status.toLowerCase() === value.toLowerCase())
        );
      }

      if (filters[1]?.length) {
        data = data.filter((campaign) =>
          filters[1].some((value) =>
            campaign.scope.toLowerCase().includes(value.toLowerCase())
          )
        );
      }

      if (filters[2]?.length) {
        data = data.filter((campaign) =>
          filters[2].some((value) =>
            campaign.partner.toLowerCase().includes(value.toLowerCase())
          )
        );
      }

      renderCampaigns(data);
    };

    const showPartnerDetail = (name: string) => {
      const partner = partners.find((item) => item.name === name);
      if (!partner) {
        return;
      }

      const page = byId<HTMLElement>("page-partner-detail");
      if (!page) {
        return;
      }

      const partnerName = byId<HTMLElement>("pd-name");
      const partnerStatus = byId<HTMLElement>("pd-status");
      const partnerPlan = byId<HTMLElement>("pd-plan");
      const partnerProducts = byId<HTMLElement>("pd-products");
      const partnerJoined = byId<HTMLElement>("pd-joined");
      const partnerLastActive = byId<HTMLElement>("pd-lastactive");
      const statsElement = byId<HTMLElement>("pd-stats");
      const tierElement = byId<HTMLElement>("pd-tiers");
      const driveElement = byId<HTMLElement>("pd-drives");
      const campaignElement = byId<HTMLElement>("pd-campaigns");
      const apiElement = byId<HTMLElement>("pd-api");
      const revenueElement = byId<HTMLElement>("pd-revenue");

      if (
        !partnerName ||
        !partnerStatus ||
        !partnerPlan ||
        !partnerProducts ||
        !partnerJoined ||
        !partnerLastActive ||
        !statsElement ||
        !tierElement ||
        !driveElement ||
        !campaignElement ||
        !apiElement ||
        !revenueElement
      ) {
        return;
      }

      partnerName.textContent = partner.name;
      partnerStatus.textContent = partner.status;
      partnerStatus.className = `tag tag-${
        partner.status === "Active" ? "green" : partner.status === "Review" ? "amber" : "red"
      }`;
      partnerPlan.textContent = partner.plan;
      partnerPlan.className = "tag tag-hq";
      partnerProducts.innerHTML = partner.products
        .map(
          (product) =>
            `<span class="tag tag-${product === "R" ? "teal" : product === "G" ? "blue" : "purple"}">${product === "R" ? "Reach" : product === "G" ? "Gate" : "Lens"}</span>`
        )
        .join("");
      partnerJoined.textContent = partner.joined;
      partnerLastActive.textContent = partner.lastActive;
      partnerLastActive.style.color = partner.lastActive.includes("ago")
        ? "var(--green)"
        : "var(--textS)";

      statsElement.innerHTML = `
        <div class="stat-card" data-accent="hq"><div class="stat-label">Total Users</div><div class="stat-value">${partner.totalUsers.toLocaleString()}</div><div class="stat-sub">Currently connected</div></div>
        <div class="stat-card" data-accent="hq"><div class="stat-label">Users (1st Touch)</div><div class="stat-value">${partner.users1st.toLocaleString()}</div><div class="stat-sub">Primary source</div></div>
        <div class="stat-card" data-accent="teal"><div class="stat-label">Users (Any Touch)</div><div class="stat-value">${partner.usersAny.toLocaleString()}</div><div class="stat-sub">${partner.users1st > 0 ? `${(partner.usersAny / partner.users1st).toFixed(2)}× ratio` : "—"}</div></div>
        <div class="stat-card" data-accent="green"><div class="stat-label">Gold+ Rate</div><div class="stat-value">${partner.goldRate}%</div><div class="stat-sub">${partner.goldRate > 61 ? "Above" : "Below"} pool avg (61%)</div></div>
        <div class="stat-card" data-accent="${partner.sybilRate <= 8 ? "green" : partner.sybilRate <= 15 ? "amber" : "red"}"><div class="stat-label">Sybil Rate</div><div class="stat-value">${partner.sybilRate}%</div><div class="stat-sub">${partner.sybilRate < 14.2 ? "Below" : "Above"} pool avg (14.2%)</div></div>
        <div class="stat-card" data-accent="blue"><div class="stat-label">API Queries (30d)</div><div class="stat-value">${partner.apiQueries.toLocaleString()}</div><div class="stat-sub">${partner.products.includes("G") ? "Active" : "Not using Gate"}</div></div>
        <div class="stat-card" data-accent="teal"><div class="stat-label">Campaign Engaged</div><div class="stat-value">${partner.campaignList.reduce((sum, campaign) => sum + campaign.engaged, 0).toLocaleString()}</div><div class="stat-sub">Across ${partner.campaigns} campaigns (${partner.liveCampaigns} live)</div></div>
        <div class="stat-card" data-accent="purple"><div class="stat-label">Monthly Revenue</div><div class="stat-value">$${partner.revenue.toLocaleString()}</div><div class="stat-sub">${[
          partner.revGate ? `Gate $${partner.revGate.toLocaleString()}` : "",
          partner.revReach ? `Reach $${partner.revReach.toLocaleString()}` : "",
          partner.revLens ? `Lens $${partner.revLens.toLocaleString()}` : ""
        ]
          .filter(Boolean)
          .join(" + ") || "Free plan"}</div></div>`;

      tierElement.innerHTML = `
        <div class="hbar-wrap"><div class="hbar-header"><span class="hbar-label">Black</span><span class="hbar-val" style="color:var(--lav)">${partner.tierDist.black}%</span></div><div class="hbar-track"><div class="hbar-fill" style="width:${partner.tierDist.black}%;background:var(--lav)"></div></div></div>
        <div class="hbar-wrap"><div class="hbar-header"><span class="hbar-label">Platinum</span><span class="hbar-val" style="color:var(--amber)">${partner.tierDist.platinum}%</span></div><div class="hbar-track"><div class="hbar-fill" style="width:${partner.tierDist.platinum}%;background:var(--amber)"></div></div></div>
        <div class="hbar-wrap"><div class="hbar-header"><span class="hbar-label">Gold</span><span class="hbar-val" style="color:var(--cream)">${partner.tierDist.gold}%</span></div><div class="hbar-track"><div class="hbar-fill" style="width:${partner.tierDist.gold}%;background:var(--cream)"></div></div></div>
        <div class="hbar-wrap"><div class="hbar-header"><span class="hbar-label">Classic</span><span class="hbar-val" style="color:var(--textM)">${partner.tierDist.classic}%</span></div><div class="hbar-track"><div class="hbar-fill" style="width:${partner.tierDist.classic}%;background:var(--textD)"></div></div></div>
        <div style="margin-top:14px;padding:10px 14px;background:rgba(${partner.tierDist.black + partner.tierDist.platinum + partner.tierDist.gold >= 61 ? "63,185,80" : "227,179,65"},0.04);border:1px solid rgba(${partner.tierDist.black + partner.tierDist.platinum + partner.tierDist.gold >= 61 ? "63,185,80" : "227,179,65"},0.1);border-radius:10px;font-size:12px;color:var(--textS)">Gold+ rate (${partner.tierDist.black + partner.tierDist.platinum + partner.tierDist.gold}%) is ${partner.tierDist.black + partner.tierDist.platinum + partner.tierDist.gold >= 61 ? "above" : "below"} pool average</div>`;

      driveElement.innerHTML = `
        <div class="hbar-wrap"><div class="hbar-header"><span class="hbar-label">X-RAY Users Link</span><span class="hbar-val" style="color:var(--teal)">${partner.driveSources.xray}%</span></div><div class="hbar-track"><div class="hbar-fill" style="width:${partner.driveSources.xray}%;background:var(--teal)"></div></div></div>
        <div class="hbar-wrap"><div class="hbar-header"><span class="hbar-label">Reach Campaign</span><span class="hbar-val" style="color:var(--blue)">${partner.driveSources.campaign}%</span></div><div class="hbar-track"><div class="hbar-fill" style="width:${partner.driveSources.campaign}%;background:var(--blue)"></div></div></div>
        <div class="hbar-wrap"><div class="hbar-header"><span class="hbar-label">Community Bot</span><span class="hbar-val" style="color:var(--purple)">${partner.driveSources.bot}%</span></div><div class="hbar-track"><div class="hbar-fill" style="width:${partner.driveSources.bot}%;background:var(--purple)"></div></div></div>
        <div class="hbar-wrap"><div class="hbar-header"><span class="hbar-label">Agent API</span><span class="hbar-val" style="color:var(--amber)">${partner.driveSources.agent}%</span></div><div class="hbar-track"><div class="hbar-fill" style="width:${partner.driveSources.agent}%;background:var(--amber)"></div></div></div>`;

      const scopeColor = (scope: string) =>
        scope === "Users" ? "blue" : scope === "Gravii Pool" ? "purple" : "teal";
      if (partner.products.includes("R") && partner.campaignList.length > 0) {
        campaignElement.innerHTML = `<table class="tbl">
        <thead><tr><th>Campaign</th><th>Scope</th><th>Engaged</th><th>New IDs</th><th>Cost</th><th>CPA <span class="roi-tip" title="CPA = Cost ÷ Engaged (cost per user acquired)">i</span></th><th>Status</th></tr></thead>
        <tbody>${partner.campaignList
          .map(
            (campaign) => `<tr><td style="font-weight:600;color:var(--text)">${campaign.name}</td><td><span class="tag tag-${scopeColor(campaign.scope)}">${campaign.scope}</span></td><td class="tbl-mono">${campaign.engaged.toLocaleString()}</td><td class="tbl-mono">${campaign.newIds.toLocaleString()}</td><td class="tbl-mono">$${campaign.cost.toLocaleString()}</td><td class="tbl-mono">$${campaign.cpa.toFixed(2)}</td><td>${campaign.status === "Live" ? '<span class="tag tag-green">Live</span>' : campaign.status === "Ending" ? '<span class="tag tag-amber">Ending</span>' : `<span style="color:var(--textD)">${campaign.status}</span>`}</td></tr>`
          )
          .join("")}
        </tbody></table>
        <div style="margin-top:12px;padding:10px 14px;background:rgba(86,212,192,0.04);border:1px solid rgba(86,212,192,0.1);border-radius:10px;font-size:12px;color:var(--textS)">Avg CPA: <span style="font-family:'Space Mono',monospace;font-weight:700;color:var(--green)">$${partner.avgCpa.toFixed(2)}</span>/user</div>`;
      } else if (partner.products.includes("R")) {
        campaignElement.innerHTML =
          '<div style="padding:20px;text-align:center;color:var(--textD);font-size:13px">No campaigns launched yet</div>';
      } else {
        campaignElement.innerHTML =
          '<div style="padding:24px;text-align:center;border:1px dashed var(--border);border-radius:10px"><div style="font-size:13px;color:var(--textD);margin-bottom:4px">Not using Reach</div><div style="font-size:12px;color:var(--textD);opacity:0.6">This partner has no campaign access</div></div>';
      }

      let apiHtml = "";

      if (partner.products.includes("G")) {
        apiHtml += `
        <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px">
          <div style="display:flex;justify-content:space-between;padding:10px 14px;background:rgba(255,255,255,0.02);border-radius:8px;border:1px solid var(--border)"><span style="font-size:13px;color:var(--textM)">Total Queries</span><span style="font-family:'Space Mono',monospace;font-size:14px;font-weight:700;color:var(--blue)">${partner.apiQueries.toLocaleString()}</span></div>
          <div style="display:flex;justify-content:space-between;padding:10px 14px;background:rgba(255,255,255,0.02);border-radius:8px;border:1px solid var(--border)"><span style="font-size:13px;color:var(--textM)">Avg Latency</span><span style="font-family:'Space Mono',monospace;font-size:14px;font-weight:700;color:var(--green)">${partner.apiLatency}ms</span></div>
          <div style="display:flex;justify-content:space-between;padding:10px 14px;background:rgba(255,255,255,0.02);border-radius:8px;border:1px solid var(--border)"><span style="font-size:13px;color:var(--textM)">Plan Limit</span><span style="font-family:'Space Mono',monospace;font-size:14px;color:var(--textS)">${partner.apiPlanLimit}</span></div>
          <div style="display:flex;justify-content:space-between;padding:10px 14px;background:rgba(255,255,255,0.02);border-radius:8px;border:1px solid var(--border)"><span style="font-size:13px;color:var(--textM)">Error Rate</span><span style="font-family:'Space Mono',monospace;font-size:14px;font-weight:700;color:${partner.apiErrorRate < 1 ? "var(--green)" : "var(--red)"}">${partner.apiErrorRate}%</span></div>
        </div>`;
      } else {
        apiHtml +=
          '<div style="padding:24px;text-align:center;border:1px dashed var(--border);border-radius:10px;margin-bottom:16px"><div style="font-size:13px;color:var(--textD);margin-bottom:4px">Not using Gate</div><div style="font-size:12px;color:var(--textD);opacity:0.6">No API integration</div></div>';
      }

      apiHtml +=
        '<div style="font-size:14px;font-weight:700;color:var(--textS);margin-bottom:10px">Lens Reports</div>';

      if (partner.products.includes("L") && partner.lensReports.length > 0) {
        apiHtml += partner.lensReports
          .map(
            (report) => `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:rgba(188,140,255,0.04);border:1px solid rgba(188,140,255,0.08);border-radius:8px;margin-bottom:6px"><div><span style="font-size:13px;font-weight:600;color:var(--text)">${report.name}</span><div style="font-size:12px;color:var(--textM)">${report.wallets.toLocaleString()} wallets · Delivered ${report.date}</div></div><span class="tag tag-green">Delivered</span></div>`
          )
          .join("");
      } else if (partner.products.includes("L")) {
        apiHtml +=
          '<div style="padding:16px;text-align:center;color:var(--textD);font-size:13px">No reports yet</div>';
      } else {
        apiHtml +=
          '<div style="padding:24px;text-align:center;border:1px dashed var(--border);border-radius:10px"><div style="font-size:13px;color:var(--textD);margin-bottom:4px">Not using Lens</div><div style="font-size:12px;color:var(--textD);opacity:0.6">No reports requested</div></div>';
      }

      apiElement.innerHTML = apiHtml;

      revenueElement.innerHTML = `<table class="tbl">
        <thead><tr><th>Month</th><th>Gate</th><th>Reach</th><th>Lens</th><th>Total</th><th>Change</th></tr></thead>
        <tbody>${partner.revenueHistory
          .map(
            (item, index) => `<tr><td style="font-weight:600;color:var(--text)">${item.month}</td><td class="tbl-mono">$${item.gate.toLocaleString()}</td><td class="tbl-mono">$${item.reach.toLocaleString()}</td><td class="tbl-mono">$${item.lens.toLocaleString()}</td><td style="font-family:'Space Mono',monospace;font-weight:700;color:${index === 0 ? "var(--green)" : "var(--textS)"}">$${item.total.toLocaleString()}</td><td>${item.change.startsWith("+") ? `<span class="stat-delta up">▲ ${item.change}</span>` : `<span class="stat-delta neutral">${item.change}</span>`}</td></tr>`
          )
          .join("")}
        </tbody></table>
        <div style="margin-top:14px;padding:10px 14px;background:rgba(232,168,124,0.04);border:1px solid rgba(232,168,124,0.1);border-radius:10px;font-size:13px;color:var(--textS)">LTV to date: <span style="font-family:'Space Mono',monospace;font-weight:700;color:var(--hq)">$${partner.revenueHistory.reduce((sum, item) => sum + item.total, 0).toLocaleString()}</span></div>`;

      queryAll<HTMLElement>(".sb-item").forEach((item) => item.classList.remove("active"));
      queryAll<HTMLElement>(".page").forEach((item) => item.classList.remove("active"));
      page.classList.add("active");

      const pageTitle = byId<HTMLElement>("pageTitle");
      if (pageTitle) {
        pageTitle.textContent = `${name} — Detail`;
      }

      const main = query<HTMLElement>(".main");
      if (main) {
        main.scrollTop = 0;
      }

      const timeout = window.setTimeout(() => animateStats(page), 100);
      timeouts.push(timeout);
    };

    const togF = (element: HTMLElement) => {
      const group = element.closest<HTMLElement>(".filter-group");
      const bar = element.closest<HTMLElement>(".filter-bar");
      const isAll = element.textContent?.trim().startsWith("All");

      if (!group || !bar) {
        return;
      }

      if (isAll) {
        group.querySelectorAll<HTMLElement>(".fbtn").forEach((button) =>
          button.classList.remove("f-active")
        );
        element.classList.add("f-active");
      } else {
        const allButton = group.querySelector<HTMLElement>(".fbtn");
        if (allButton && allButton.textContent?.trim().startsWith("All")) {
          allButton.classList.remove("f-active");
        }

        element.classList.toggle("f-active");

        if (!group.querySelectorAll(".fbtn.f-active").length && allButton) {
          allButton.classList.add("f-active");
        }
      }

      const page = bar.closest<HTMLElement>(".page");
      if (page?.id === "page-partner-list") {
        filterPartnerList();
      } else if (page?.id === "page-campaigns") {
        filterCampaigns();
      } else {
        applyFilters(bar);
      }
    };

    const resetF = (button: HTMLElement) => {
      const bar = button.closest<HTMLElement>(".filter-bar");
      if (!bar) {
        return;
      }

      bar.querySelectorAll<HTMLElement>(".filter-group").forEach((group) => {
        group.querySelectorAll<HTMLElement>(".fbtn").forEach((filterButton, index) => {
          if (index === 0) {
            filterButton.classList.add("f-active");
          } else {
            filterButton.classList.remove("f-active");
          }
        });
      });

      bar.querySelectorAll<HTMLElement>(".toggle").forEach((toggle) => {
        toggle.classList.add("t-on");
      });

      const page = bar.closest<HTMLElement>(".page");
      if (page?.id === "page-partner-list") {
        renderPartnerList();
      } else if (page?.id === "page-campaigns") {
        renderCampaigns();
      } else {
        applyFilters(bar);
      }
    };

    const searchUser = () => {
      const result = byId<HTMLElement>("userResult");
      if (result) {
        result.style.animation = "none";
        void result.offsetHeight;
        result.style.animation = "fadeIn 0.4s ease forwards";
      }
    };

    const addChatMessage = (type: "ai" | "user", text: string) => {
      const messages = byId<HTMLElement>("chatMessages");
      if (!messages) {
        return;
      }

      const div = document.createElement("div");
      div.className = `chat-msg chat-msg-${type}`;

      if (type === "ai") {
        div.innerHTML = `<div class="chat-msg-label">✦ GRAVII INSIGHT</div>${text.replace(/\n/g, "<br>")}`;
      } else {
        div.textContent = text;
      }

      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    };

    const initChat = () => {
      const messages = byId<HTMLElement>("chatMessages");
      const suggestions = byId<HTMLElement>("chatSuggestions");
      if (!messages || !suggestions) {
        return;
      }

      const insight = (insights[currentChatPage] ?? insights.overview)[0];
      messages.innerHTML = "";
      addChatMessage(
        "ai",
        `Welcome to Gravii Insight. I have access to all HQ data.\n\n${insight}\n\nWhat would you like to know?`
      );

      const items = [
        { label: "Weekly summary", key: "summary" },
        { label: "Sybil status", key: "sybil" },
        { label: "Revenue breakdown", key: "revenue" },
        { label: "Partner health", key: "partners" },
        { label: "Campaign performance", key: "campaigns" },
        { label: "Growth health", key: "growth" }
      ];

      suggestions.innerHTML = items
        .map(
          (item) =>
            `<span class="chat-sug" onclick="handleSuggestion('${item.key}')">${item.label}</span>`
        )
        .join("");
    };

    const toggleChat = () => {
      chatOpen = !chatOpen;
      byId<HTMLElement>("chatPanel")?.classList.toggle("open", chatOpen);
      byId<HTMLElement>("chatOverlay")?.classList.toggle("open", chatOpen);

      const dot = byId<HTMLElement>("chatDot");
      if (dot) {
        dot.style.display = chatOpen ? "none" : "block";
      }

      if (chatOpen && (byId<HTMLElement>("chatMessages")?.children.length ?? 0) === 0) {
        initChat();
      }

      if (chatOpen) {
        byId<HTMLInputElement>("chatInput")?.focus();
      }
    };

    const handleSuggestion = (key: string) => {
      const labels: Record<string, string> = {
        summary: "Weekly summary",
        sybil: "Sybil status",
        revenue: "Revenue breakdown",
        partners: "Partner health",
        campaigns: "Campaign performance",
        growth: "Growth health"
      };
      addChatMessage("user", labels[key] ?? key);

      const timeout = window.setTimeout(() => {
        const response = chatResponses[key];
        addChatMessage(
          "ai",
          response
            ? response
            : "I don't have specific data on that yet. Try asking about summary, sybil, revenue, partners, campaigns, or growth."
        );
      }, 400);

      timeouts.push(timeout);
    };

    const sendChat = () => {
      const input = byId<HTMLInputElement>("chatInput");
      const text = input?.value.trim() ?? "";

      if (!input || !text) {
        return;
      }

      input.value = "";
      addChatMessage("user", text);

      const timeout = window.setTimeout(() => {
        const lower = text.toLowerCase();
        let key: string | null = null;

        if (
          lower.includes("summar") ||
          lower.includes("overview") ||
          lower.includes("brief") ||
          lower.includes("snapshot")
        ) {
          key = "summary";
        } else if (
          lower.includes("sybil") ||
          lower.includes("fraud") ||
          lower.includes("bot")
        ) {
          key = "sybil";
        } else if (
          lower.includes("revenue") ||
          lower.includes("mrr") ||
          lower.includes("money") ||
          lower.includes("earning")
        ) {
          key = "revenue";
        } else if (lower.includes("partner") || lower.includes("upsell")) {
          key = "partners";
        } else if (
          lower.includes("campaign") ||
          lower.includes("cpa") ||
          lower.includes("engage") ||
          lower.includes("reach")
        ) {
          key = "campaigns";
        } else if (
          lower.includes("growth") ||
          lower.includes("health") ||
          lower.includes("churn") ||
          lower.includes("grade")
        ) {
          key = "growth";
        }

        if (key) {
          addChatMessage(
            "ai",
            chatResponses[key] ??
              "I don't have specific data on that yet. Try asking about summary, sybil, revenue, partners, campaigns, or growth."
          );
        } else {
          addChatMessage(
            "ai",
            'I can help with: weekly summary, sybil analysis, revenue breakdown, partner health, campaign performance, or growth metrics.\n\nTry asking something like "How\'s our revenue?" or "Which partners need attention?"'
          );
        }
      }, 500);

      timeouts.push(timeout);
    };

    queryAll<HTMLButtonElement>(".period-btn").forEach((button) => {
      button.addEventListener("click", function handleClick() {
        queryAll<HTMLElement>(".period-btn").forEach((item) => item.classList.remove("active"));
        this.classList.add("active");
      });
    });

    updateTime();
    intervals.push(window.setInterval(updateTime, 1000));

    queryAll<HTMLElement>(".sec-action").forEach((element) => {
      const text = element.textContent?.trim().toLowerCase() ?? "";

      if (text.includes("cohort")) {
        element.onclick = () => navToPage("pool-cohort");
      } else if (text.includes("details") || text.includes("source")) {
        element.onclick = () => navToPage("acq-source");
      } else if (text.includes("partners") || text.includes("all partners")) {
        element.onclick = () => navToPage("partner-list");
      } else if (text.includes("campaigns") || text.includes("all campaigns")) {
        element.onclick = () => navToPage("campaigns");
      } else if (text.includes("performance")) {
        element.onclick = () => navToPage("partner-perf");
      } else if (text.includes("flywheel") || text.includes("full view")) {
        element.onclick = () => navToPage("risk-health");
      }

      if (element.onclick) {
        element.style.cursor = "pointer";
      }
    });

    window.navTo = navTo;
    window.navToPage = navToPage;
    window.toggleChat = toggleChat;
    window.showPartnerDetail = showPartnerDetail;
    window.togF = togF;
    window.resetF = resetF;
    window.searchUser = searchUser;
    window.filterPartnerList = filterPartnerList;
    window.handleSuggestion = handleSuggestion;
    window.sendChat = sendChat;

    renderGrowthChart();
    renderSourceTrend();
    renderPartnerList();
    renderCampaigns();
    animateHorizontalBars();

    const timeout = window.setTimeout(() => animateStats(byId("page-overview")), 200);
    timeouts.push(timeout);

    return () => {
      intervals.forEach((id) => window.clearInterval(id));
      timeouts.forEach((id) => window.clearTimeout(id));

      delete window.navTo;
      delete window.navToPage;
      delete window.toggleChat;
      delete window.showPartnerDetail;
      delete window.togF;
      delete window.resetF;
      delete window.searchUser;
      delete window.filterPartnerList;
      delete window.handleSuggestion;
      delete window.sendChat;
    };
  }, [campaigns, chatResponses, insights, pageTitles, partners]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styleContent }} />
      <div ref={rootRef} style={{ display: "contents" }}>
        <PrototypeAppShell>
          <PrototypeOverviewPage />
          <PrototypePoolCompositionPage />
          <PrototypePoolCohortPage />
          <PrototypePoolExplorerPage />
          <PrototypeAcqSourcePage />
          <PrototypeAcqAttributionPage />
          <PrototypeAcqFunnelPage />
          <PrototypePartnerListPage />
          <PrototypePartnerPerfPage />
          <PrototypePartnerDetailPage />
          <PrototypeRiskSybilPage />
          <PrototypeRiskHealthPage />
          <PrototypeCampaignsPage />
        </PrototypeAppShell>
      </div>
    </>
  );
}
