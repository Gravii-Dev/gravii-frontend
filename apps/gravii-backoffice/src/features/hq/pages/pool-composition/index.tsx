import { getPrototypeWindow } from "@/features/hq/lib/prototype-window";

const compositionStats = [
  { accent: "hq", label: "Classic", sub: "39.0% of pool", value: "189,921" },
  { accent: "amber", label: "Gold", sub: "25.0% of pool", value: "121,808" },
  { accent: "purple", label: "Platinum", sub: "21.0% of pool", value: "102,319" },
  { accent: "blue", label: "Black", sub: "15.0% of pool", value: "73,183" }
] as const;

const personaRows = [
  { color: "var(--lav)", label: "Diamond Hands", textColor: "var(--lav)", value: "14.2%", width: "71%" },
  { color: "var(--teal)", label: "Steady Earner", textColor: "var(--teal)", value: "12.8%", width: "64%" },
  { color: "var(--blue)", label: "Chain Believer", textColor: "var(--blue)", value: "10.1%", width: "50.5%" },
  { color: "var(--amber)", label: "Fast Mover", textColor: "var(--amber)", value: "8.6%", width: "43%" },
  { color: "var(--purple)", label: "Yield Explorer", textColor: "var(--purple)", value: "7.9%", width: "39.5%" },
  { color: "var(--hq)", label: "Pool Builder", textColor: "var(--hq)", value: "6.4%", width: "32%" },
  { color: "var(--green)", label: "Rising Star", textColor: "var(--green)", value: "5.8%", width: "29%" },
  { color: "var(--textD)", label: "Fresh Start", textColor: "var(--textM)", value: "5.2%", width: "26%" }
] as const;

const chainRows = [
  { color: "var(--blue)", label: "Ethereum", value: "38.4%", width: "76.8%" },
  { color: "var(--teal)", label: "Arbitrum", value: "18.2%", width: "36.4%" },
  { color: "var(--purple)", label: "Base", value: "14.7%", width: "29.4%" },
  { color: "var(--lav)", label: "Polygon", value: "11.3%", width: "22.6%" },
  { color: "var(--red)", label: "Optimism", value: "8.1%", width: "16.2%" },
  { color: "var(--textD)", label: "Others (12 chains)", value: "9.3%", width: "18.6%" }
] as const;

const valueCards = [
  {
    color: "var(--teal)",
    label: "Total Deployed Value",
    sub: "Stables + Tokens in active use",
    value: "$1.42B"
  },
  {
    color: "var(--amber)",
    label: "Total Available (Idle)",
    sub: "Partner opportunity pool",
    value: "$720M"
  },
  {
    color: "var(--hq)",
    label: "Avg Value / User",
    sub: "Deployed + Idle combined",
    value: "$4,392"
  },
  {
    color: "var(--lav)",
    label: "Avg Value / Gold+ User",
    sub: "2.56× pool average",
    value: "$11,240"
  }
] as const;

const sybilRows = [
  { color: "var(--green)", label: "Clean", value: "74.8% (364,449)", width: "74.8%" },
  { color: "var(--amber)", label: "Suspect", value: "11.0% (53,595)", width: "11%" },
  { color: "var(--red)", label: "Flagged (Sybil)", value: "14.2% (69,187)", width: "14.2%" }
] as const;

export function PrototypePoolCompositionPage() {
  const handleFilterClick = (element: HTMLElement) => {
    getPrototypeWindow().togF?.(element);
  };

  return (
    <div className="page" id="page-pool-composition">
      <div className="filter-bar fade-in">
        <div className="filter-bar-label">Filter</div>
        <div className="filter-group">
          <span className="fbtn f-active" onClick={(event) => handleFilterClick(event.currentTarget)}>
            All Chains
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Ethereum
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Arbitrum
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Base
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Polygon
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Optimism
          </span>
        </div>
        <div className="filter-sep" />
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
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Referral
          </span>
        </div>
        <div className="filter-sep" />
        <div className="toggle-wrap">
          <div className="toggle t-on" onClick={(event) => event.currentTarget.classList.toggle("t-on")} />
          <span>Include Sybil</span>
        </div>
        <button
          className="fbtn-reset"
          onClick={(event) => getPrototypeWindow().resetF?.(event.currentTarget)}
        >
          Reset
        </button>
      </div>

      <div className="stat-grid fade-in fade-d1">
        {compositionStats.map((stat) => (
          <div key={stat.label} className="stat-card" data-accent={stat.accent}>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-sub">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="g2 fade-in fade-d2">
        <div className="card">
          <div className="sec-head">
            <div className="sec-title">Top Personas (All Tiers)</div>
          </div>
          <div id="personaBars">
            {personaRows.map((row) => (
              <div key={row.label} className="hbar-wrap">
                <div className="hbar-header">
                  <span className="hbar-label">{row.label}</span>
                  <span className="hbar-val" style={{ color: row.textColor }}>
                    {row.value}
                  </span>
                </div>
                <div className="hbar-track">
                  <div className="hbar-fill" style={{ background: row.color, width: row.width }} />
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              color: "var(--textD)",
              fontSize: "12px",
              fontStyle: "italic",
              marginTop: "12px"
            }}
          >
            Showing top 8 of 20 personas · Remaining 12 personas account for 29.0%
          </div>
        </div>

        <div className="card">
          <div className="sec-head">
            <div className="sec-title">Primary Chain Distribution</div>
          </div>
          <div>
            {chainRows.map((row) => (
              <div key={row.label} className="hbar-wrap">
                <div className="hbar-header">
                  <span className="hbar-label">{row.label}</span>
                  <span className="hbar-val" style={{ color: row.color }}>
                    {row.value}
                  </span>
                </div>
                <div className="hbar-track">
                  <div className="hbar-fill" style={{ background: row.color, width: row.width }} />
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              marginTop: "20px",
              padding: "14px"
            }}
          >
            <div style={{ color: "var(--textM)", fontSize: "12px", fontWeight: 600, marginBottom: "8px" }}>
              Multi-Chain Users
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              <div>
                <span
                  style={{
                    color: "var(--text)",
                    fontFamily: "'Space Mono',monospace",
                    fontSize: "18px",
                    fontWeight: 700
                  }}
                >
                  62%
                </span>
                <div style={{ color: "var(--textM)", fontSize: "12px" }}>2+ chains</div>
              </div>
              <div>
                <span
                  style={{
                    color: "var(--text)",
                    fontFamily: "'Space Mono',monospace",
                    fontSize: "18px",
                    fontWeight: 700
                  }}
                >
                  28%
                </span>
                <div style={{ color: "var(--textM)", fontSize: "12px" }}>4+ chains</div>
              </div>
              <div>
                <span
                  style={{
                    color: "var(--text)",
                    fontFamily: "'Space Mono',monospace",
                    fontSize: "18px",
                    fontWeight: 700
                  }}
                >
                  3.4
                </span>
                <div style={{ color: "var(--textM)", fontSize: "12px" }}>Avg chains/user</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card fade-in fade-d3" style={{ marginTop: "20px" }}>
        <div className="sec-head">
          <div className="sec-title">Value Distribution</div>
        </div>
        <div className="stat-grid" style={{ marginBottom: 0 }}>
          {valueCards.map((card) => (
            <div
              key={card.label}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                padding: "16px"
              }}
            >
              <div style={{ color: "var(--textM)", fontSize: "12px", marginBottom: "4px" }}>{card.label}</div>
              <div
                style={{
                  color: card.color,
                  fontFamily: "'Space Mono',monospace",
                  fontSize: "24px",
                  fontWeight: 700
                }}
              >
                {card.value}
              </div>
              <div style={{ color: "var(--textM)", fontSize: "12px", marginTop: "2px" }}>{card.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card fade-in fade-d4" style={{ marginTop: "20px" }}>
        <div className="sec-head">
          <div className="sec-title">Sybil Status in Pool</div>
        </div>
        <div style={{ alignItems: "center", display: "flex", gap: "20px" }}>
          <div style={{ flex: 1 }}>
            {sybilRows.map((row) => (
              <div key={row.label} className="hbar-wrap">
                <div className="hbar-header">
                  <span className="hbar-label">{row.label}</span>
                  <span className="hbar-val" style={{ color: row.color }}>
                    {row.value}
                  </span>
                </div>
                <div className="hbar-track">
                  <div className="hbar-fill" style={{ background: row.color, width: row.width }} />
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              flexShrink: 0,
              padding: "16px 24px",
              textAlign: "center"
            }}
          >
            <div style={{ color: "var(--textM)", fontSize: "12px", marginBottom: "4px" }}>Total Including Sybil</div>
            <div
              style={{
                color: "var(--text)",
                fontFamily: "'Space Mono',monospace",
                fontSize: "28px",
                fontWeight: 700
              }}
            >
              487,231
            </div>
            <div style={{ color: "var(--red)", fontSize: "12px", marginTop: "4px" }}>
              69,187 flagged (separately noted)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
