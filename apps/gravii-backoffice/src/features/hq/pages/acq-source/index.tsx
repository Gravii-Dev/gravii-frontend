import { getPrototypeWindow } from "@/features/hq/lib/prototype-window";

const sourceStats = [
  {
    accent: "teal",
    label: "Partner Drive",
    sub: (
      <>
        42% of new IDs (7d) · <span className="stat-delta up">▲ 6%</span>
      </>
    ),
    value: "5,211"
  },
  {
    accent: "blue",
    label: "Campaign (Reach)",
    sub: (
      <>
        24% · <span className="stat-delta up">▲ 12%</span>
      </>
    ),
    value: "2,978"
  },
  {
    accent: "purple",
    label: "Organic",
    sub: (
      <>
        18% · <span className="stat-delta down">▼ 3%</span>
      </>
    ),
    value: "2,233"
  },
  {
    accent: "amber",
    label: "Community Bot",
    sub: (
      <>
        10% · <span className="stat-delta up">▲ 22%</span>
      </>
    ),
    value: "1,241"
  }
] as const;

const sourceQualityRows = [
  {
    avgValue: "$6,840",
    goldRate: { label: "58%", tone: "green" },
    name: "Partner Drive",
    newIds: "5,211",
    retention: "71%",
    sybilRate: { label: "6%", tone: "green" },
    tone: "var(--teal)",
    trend: { label: "▲", tone: "up" }
  },
  {
    avgValue: "$5,210",
    goldRate: { label: "52%", tone: "green" },
    name: "Campaign (Reach)",
    newIds: "2,978",
    retention: "66%",
    sybilRate: { label: "8%", tone: "green" },
    tone: "var(--blue)",
    trend: { label: "▲", tone: "up" }
  },
  {
    avgValue: "$4,920",
    goldRate: { label: "44%", tone: "teal" },
    name: "Organic",
    newIds: "2,233",
    retention: "68%",
    sybilRate: { label: "5%", tone: "green" },
    tone: "var(--purple)",
    trend: { label: "▼", tone: "down" }
  },
  {
    avgValue: "$3,180",
    goldRate: { label: "36%", tone: "amber" },
    name: "Community Bot",
    newIds: "1,241",
    retention: "54%",
    sybilRate: { label: "14%", tone: "amber" },
    tone: "var(--amber)",
    trend: { label: "▲", tone: "up" }
  },
  {
    avgValue: "$8,120",
    goldRate: { label: "62%", tone: "green" },
    name: "Referral",
    newIds: "497",
    retention: "78%",
    sybilRate: { label: "3%", tone: "green" },
    tone: "var(--hq)",
    trend: { label: "—", tone: "neutral" }
  },
  {
    avgValue: "$1,040",
    goldRate: { label: "22%", tone: "red" },
    name: "Other / Unknown",
    newIds: "248",
    retention: "32%",
    sybilRate: { label: "28%", tone: "red" },
    tone: "var(--textM)",
    trend: { label: "▼", tone: "down" }
  }
] as const;

const trendLegend = [
  { color: "var(--teal)", label: "Partner Drive" },
  { color: "var(--blue)", label: "Campaign" },
  { color: "var(--purple)", label: "Organic" },
  { color: "var(--amber)", label: "Bot" },
  { color: "var(--hq)", label: "Referral" }
] as const;

export function PrototypeAcqSourcePage() {
  const handleFilterClick = (element: HTMLElement) => {
    getPrototypeWindow().togF?.(element);
  };

  return (
    <div className="page" id="page-acq-source">
      <div className="filter-bar fade-in">
        <div className="filter-bar-label">Filter</div>
        <div className="filter-group">
          <span className="fbtn f-active" onClick={(event) => handleFilterClick(event.currentTarget)}>
            All Tiers
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Gold+ Only
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Platinum+
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Black
          </span>
        </div>
        <div className="filter-sep" />
        <div className="filter-group">
          <span className="fbtn f-active" onClick={(event) => handleFilterClick(event.currentTarget)}>
            All Chains
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            ETH
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            ARB
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            BASE
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            POLY
          </span>
        </div>
        <button
          className="fbtn-reset"
          onClick={(event) => getPrototypeWindow().resetF?.(event.currentTarget)}
        >
          Reset
        </button>
      </div>

      <div className="stat-grid fade-in fade-d1">
        {sourceStats.map((stat) => (
          <div key={stat.label} className="stat-card" data-accent={stat.accent}>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-sub">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="card fade-in fade-d2">
        <div className="sec-head">
          <div className="sec-title">Source Quality Comparison (7d New Users)</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Source</th>
                <th>New IDs</th>
                <th>Gold+ %</th>
                <th>Sybil %</th>
                <th>30d Retention</th>
                <th>Avg Value</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {sourceQualityRows.map((row) => (
                <tr key={row.name}>
                  <td style={{ color: row.tone, fontWeight: 600 }}>{row.name}</td>
                  <td className="tbl-mono">{row.newIds}</td>
                  <td>
                    <span className={`tag tag-${row.goldRate.tone}`}>{row.goldRate.label}</span>
                  </td>
                  <td>
                    <span className={`tag tag-${row.sybilRate.tone}`}>{row.sybilRate.label}</span>
                  </td>
                  <td className="tbl-mono">{row.retention}</td>
                  <td className="tbl-mono">{row.avgValue}</td>
                  <td>
                    <span className={`stat-delta ${row.trend.tone}`}>{row.trend.label}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          style={{
            background: "rgba(232,168,124,0.04)",
            border: "1px solid rgba(232,168,124,0.1)",
            borderRadius: "10px",
            color: "var(--textS)",
            fontSize: "13px",
            marginTop: "14px",
            padding: "10px 14px"
          }}
        >
          Highest quality source:{" "}
          <span style={{ color: "var(--hq)", fontWeight: 700 }}>Referral</span> (62% Gold+, 3%
          sybil, 78% retention) — lowest volume but best per-user metrics
        </div>
      </div>

      <div className="card fade-in fade-d3" style={{ marginTop: "20px" }}>
        <div className="sec-head">
          <div className="sec-title">Source Mix Trend (12 Weeks)</div>
        </div>
        <div
          style={{ alignItems: "flex-end", display: "flex", gap: "3px", height: "160px", padding: "16px 0" }}
          id="sourceTrendChart"
        />
        <div style={{ display: "flex", gap: "16px", marginTop: "12px", flexWrap: "wrap" }}>
          {trendLegend.map((item) => (
            <div
              key={item.label}
              style={{ alignItems: "center", color: "var(--textM)", display: "flex", fontSize: "12px", gap: "6px" }}
            >
              <div
                style={{ background: item.color, borderRadius: "2px", height: "10px", width: "10px" }}
              />
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
