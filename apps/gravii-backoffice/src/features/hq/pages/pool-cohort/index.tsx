import { getPrototypeWindow } from "@/features/hq/lib/prototype-window";

type RetentionCell = {
  label: string;
  textTone?: string;
  tone?: string;
};

const cohortSummaryStats = [
  {
    accent: "green",
    label: "30d Retention (All)",
    sub: (
      <>
        <span className="stat-delta up">▲ 2.1%</span> vs prev cohort
      </>
    ),
    value: "64.2%"
  },
  {
    accent: "teal",
    label: "30d Retention (Gold+)",
    sub: (
      <>
        <span className="stat-delta up">▲ 1.4%</span> vs prev cohort
      </>
    ),
    value: "82.7%"
  },
  {
    accent: "amber",
    label: "Avg Days Active (30d)",
    sub: (
      <>
        <span className="stat-delta neutral">—</span> stable
      </>
    ),
    value: "12.4"
  }
] as const;

const cohortRetentionRows = [
  {
    cohort: "Mar 2026",
    month2: { label: "—", textTone: "var(--textD)" },
    month3: { label: "—", textTone: "var(--textD)" },
    size: "48,200",
    week1: { label: "89%", tone: "green" },
    week2: { label: "76%", tone: "green" },
    week3: { label: "68%", tone: "green" },
    week4: { label: "64%", tone: "green" }
  },
  {
    cohort: "Feb 2026",
    month2: { label: "52%", tone: "teal" },
    month3: { label: "—", textTone: "var(--textD)" },
    size: "44,800",
    week1: { label: "87%", tone: "green" },
    week2: { label: "73%", tone: "green" },
    week3: { label: "65%", tone: "green" },
    week4: { label: "61%", tone: "green" }
  },
  {
    cohort: "Jan 2026",
    month2: { label: "48%", tone: "teal" },
    month3: { label: "41%", tone: "amber" },
    size: "41,300",
    week1: { label: "85%", tone: "green" },
    week2: { label: "71%", tone: "green" },
    week3: { label: "62%", tone: "teal" },
    week4: { label: "58%", tone: "teal" }
  },
  {
    cohort: "Dec 2025",
    month2: { label: "44%", tone: "amber" },
    month3: { label: "37%", tone: "amber" },
    size: "38,600",
    week1: { label: "83%", tone: "green" },
    week2: { label: "68%", tone: "green" },
    week3: { label: "59%", tone: "teal" },
    week4: { label: "54%", tone: "teal" }
  },
  {
    cohort: "Nov 2025",
    month2: { label: "42%", tone: "amber" },
    month3: { label: "35%", tone: "amber" },
    size: "35,100",
    week1: { label: "81%", tone: "green" },
    week2: { label: "66%", tone: "teal" },
    week3: { label: "56%", tone: "teal" },
    week4: { label: "51%", tone: "teal" }
  },
  {
    cohort: "Oct 2025",
    month2: { label: "39%", tone: "amber" },
    month3: { label: "32%", tone: "red" },
    size: "32,400",
    week1: { label: "80%", tone: "green" },
    week2: { label: "64%", tone: "teal" },
    week3: { label: "54%", tone: "teal" },
    week4: { label: "49%", tone: "amber" }
  }
] as const;

const tierActivityRows = [
  { activeRate: "91.2%", avgSessions: "22.1", avgTx: "48.3", name: "Black", tone: "var(--lav)" },
  { activeRate: "84.6%", avgSessions: "16.8", avgTx: "32.7", name: "Platinum", tone: "var(--amber)" },
  { activeRate: "72.1%", avgSessions: "10.2", avgTx: "18.4", name: "Gold", tone: "var(--cream)" },
  { activeRate: "41.3%", avgSessions: "3.8", avgTx: "6.2", name: "Classic", tone: "var(--textM)" }
] as const;

export function PrototypePoolCohortPage() {
  const handleFilterClick = (element: HTMLElement) => {
    getPrototypeWindow().togF?.(element);
  };

  const renderRetentionCell = (cell: RetentionCell) => {
    if (cell.textTone) {
      return <td style={{ color: cell.textTone }}>{cell.label}</td>;
    }

    return (
      <td>
        <span className={`tag tag-${cell.tone}`}>{cell.label}</span>
      </td>
    );
  };

  return (
    <div className="page" id="page-pool-cohort">
      <div className="filter-bar fade-in">
        <div className="filter-bar-label">Filter</div>
        <div className="filter-group">
          <span className="fbtn f-active" onClick={(event) => handleFilterClick(event.currentTarget)}>
            All Sources
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Partner Drive
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Campaign
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Organic
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Bot
          </span>
        </div>
        <div className="filter-sep" />
        <div className="filter-group">
          <span className="fbtn f-active" onClick={(event) => handleFilterClick(event.currentTarget)}>
            All Tiers
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Gold+
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Platinum+
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Black
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
        {cohortSummaryStats.map((stat) => (
          <div key={stat.label} className="stat-card" data-accent={stat.accent}>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-sub">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="card fade-in fade-d2">
        <div className="sec-head">
          <div className="sec-title">Monthly Cohort Retention</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Cohort</th>
                <th>Size</th>
                <th>Week 1</th>
                <th>Week 2</th>
                <th>Week 3</th>
                <th>Week 4</th>
                <th>Month 2</th>
                <th>Month 3</th>
              </tr>
            </thead>
            <tbody>
              {cohortRetentionRows.map((row) => (
                <tr key={row.cohort}>
                  <td style={{ color: "var(--text)", fontWeight: 600 }}>{row.cohort}</td>
                  <td className="tbl-mono">{row.size}</td>
                  {renderRetentionCell(row.week1)}
                  {renderRetentionCell(row.week2)}
                  {renderRetentionCell(row.week3)}
                  {renderRetentionCell(row.week4)}
                  {renderRetentionCell(row.month2)}
                  {renderRetentionCell(row.month3)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          style={{
            color: "var(--textD)",
            fontSize: "12px",
            fontStyle: "italic",
            marginTop: "12px"
          }}
        >
          Trend: Retention improving month-over-month — newest cohorts show strongest stickiness
        </div>
      </div>

      <div className="fade-in fade-d3" style={{ marginTop: "20px" }}>
        <div className="card">
          <div className="sec-head">
            <div className="sec-title">Activity by Tier (30d)</div>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th>Tier</th>
                <th>Active Rate</th>
                <th>Avg Tx/User</th>
                <th>Avg Sessions</th>
              </tr>
            </thead>
            <tbody>
              {tierActivityRows.map((row) => (
                <tr key={row.name}>
                  <td style={{ color: row.tone, fontWeight: 600 }}>{row.name}</td>
                  <td className="tbl-mono">{row.activeRate}</td>
                  <td className="tbl-mono">{row.avgTx}</td>
                  <td className="tbl-mono">{row.avgSessions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
