import { getPrototypeWindow } from "@/features/hq/lib/prototype-window";

const explorerStats = [
  { color: "var(--text)", label: "Total Value", value: "$84,230" },
  { color: "var(--teal)", label: "Deployed", value: "$61,400" },
  { color: "var(--amber)", label: "Available (Idle)", value: "$22,830" },
  { color: "var(--blue)", label: "Active Chains", value: "5" },
  { color: "var(--green)", label: "Activity Grade", value: "A" },
  { color: "var(--textS)", label: "Wallet Age", value: "847d" }
] as const;

const touchHistory = [
  {
    badge: { label: "1st Touch · Primary", tone: "hq" },
    color: "var(--hq)",
    date: "2025-11-14",
    subtitle: "Created Gravii ID via direct site visit",
    title: "Organic — Direct Visit"
  },
  {
    badge: { label: "2nd Touch", tone: "teal" },
    color: "var(--teal)",
    date: "2025-12-03",
    subtitle: "Opted into &quot;ETH Stakers Welcome&quot; campaign",
    title: "Nexus Finance — Campaign"
  },
  {
    badge: { label: "3rd Touch", tone: "blue" },
    color: "var(--blue)",
    date: "2026-01-18",
    subtitle: "Driven via X-RAY Users link, auto-tagged to ChainVault pool",
    title: "ChainVault — Partner Drive"
  },
  {
    badge: { label: "4th Touch", tone: "purple" },
    color: "var(--purple)",
    date: "2026-02-25",
    subtitle: "Connected wallet via Discord bot, auto-role assigned: Platinum",
    title: "DeFi Pulse — Community Bot"
  }
] as const;

export function PrototypePoolExplorerPage() {
  const handleFilterClick = (element: HTMLElement) => {
    getPrototypeWindow().togF?.(element);
  };

  return (
    <div className="page" id="page-pool-explorer">
      <div className="filter-bar fade-in">
        <div className="filter-bar-label">Filter</div>
        <div className="filter-group">
          <span className="fbtn f-active" onClick={(event) => handleFilterClick(event.currentTarget)}>
            All Tiers
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Classic
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Gold
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Platinum
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Black
          </span>
        </div>
        <div className="filter-sep" />
        <div className="filter-group">
          <span className="fbtn f-active" onClick={(event) => handleFilterClick(event.currentTarget)}>
            All Personas
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Diamond Hands
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Yield Explorer
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Fast Mover
          </span>
        </div>
        <div className="filter-sep" />
        <div className="filter-group">
          <span className="fbtn f-active" onClick={(event) => handleFilterClick(event.currentTarget)}>
            All Status
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Clean
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Suspect
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Sybil
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
        </div>
        <div className="filter-sep" />
        <div className="filter-group">
          <span className="fbtn f-active" onClick={(event) => handleFilterClick(event.currentTarget)}>
            All Sources
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Partner
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Campaign
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Organic
          </span>
        </div>
        <button
          className="fbtn-reset"
          onClick={(event) => getPrototypeWindow().resetF?.(event.currentTarget)}
        >
          Reset
        </button>
      </div>

      <div className="card fade-in fade-d1" style={{ marginBottom: "20px", padding: "16px 20px" }}>
        <div style={{ alignItems: "center", display: "flex", gap: "12px" }}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="var(--textM)"
            strokeWidth="1.5"
          >
            <circle cx="8" cy="8" r="5" />
            <path d="M12 12l4 4" />
          </svg>
          <input
            type="text"
            placeholder="Search by wallet address, Gravii ID, or persona..."
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text)",
              flex: 1,
              fontFamily: "'Outfit',sans-serif",
              fontSize: "14px",
              outline: "none"
            }}
            id="userSearchInput"
          />
          <button
            onClick={() => getPrototypeWindow().searchUser?.()}
            style={{
              background: "rgba(232,168,124,0.12)",
              border: "1px solid rgba(232,168,124,0.25)",
              borderRadius: "8px",
              color: "var(--hq)",
              cursor: "pointer",
              fontFamily: "'Outfit',sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              padding: "8px 20px"
            }}
          >
            Search
          </button>
        </div>
      </div>

      <div className="card fade-in fade-d2" id="userResult">
        <div
          style={{
            alignItems: "flex-start",
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            justifyContent: "space-between",
            marginBottom: "20px"
          }}
        >
          <div>
            <div
              style={{
                color: "var(--textM)",
                fontFamily: "'Space Mono',monospace",
                fontSize: "14px",
                marginBottom: "6px"
              }}
            >
              0x742d35Cc6634C0532925a3b844Bc9e7595f3f8a
            </div>
            <div style={{ alignItems: "center", display: "flex", gap: "8px" }}>
              <span
                style={{
                  color: "var(--text)",
                  fontFamily: "'Sora',sans-serif",
                  fontSize: "20px",
                  fontWeight: 700
                }}
              >
                Gravii ID #28,401
              </span>
              <span className="tag tag-purple">Platinum</span>
              <span className="tag tag-green">Clean</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <span className="tag tag-hq">Diamond Hands</span>
            <span className="tag tag-blue">Chain Believer</span>
          </div>
        </div>

        <div className="stat-grid" style={{ marginBottom: "20px" }}>
          {explorerStats.map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                padding: "14px"
              }}
            >
              <div style={{ color: "var(--textM)", fontSize: "12px", marginBottom: "4px" }}>{stat.label}</div>
              <div
                style={{
                  color: stat.color,
                  fontFamily: "'Space Mono',monospace",
                  fontSize: "18px",
                  fontWeight: 700
                }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "4px" }}>
          <div style={{ color: "var(--textS)", fontSize: "14px", fontWeight: 700, marginBottom: "12px" }}>
            Touch History (Multi-Touch)
          </div>
          <div style={{ borderLeft: "2px solid var(--border)", paddingLeft: "24px", position: "relative" }}>
            {touchHistory.map((item, index) => (
              <div
                key={`${item.title}-${item.date}`}
                style={{ marginBottom: index < touchHistory.length - 1 ? "16px" : 0, position: "relative" }}
              >
                <div
                  style={{
                    background: item.color,
                    border: "2px solid var(--bg)",
                    borderRadius: "50%",
                    height: "12px",
                    left: "-29px",
                    position: "absolute",
                    top: "2px",
                    width: "12px"
                  }}
                />
                <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ color: "var(--text)", fontSize: "13px", fontWeight: 600 }}>{item.title}</span>{" "}
                    <span className={`tag tag-${item.badge.tone}`} style={{ fontSize: "10px" }}>
                      {item.badge.label}
                    </span>
                  </div>
                  <span
                    style={{
                      color: "var(--textD)",
                      fontFamily: "'Space Mono',monospace",
                      fontSize: "12px"
                    }}
                  >
                    {item.date}
                  </span>
                </div>
                <div
                  style={{ color: "var(--textM)", fontSize: "12px", marginTop: "2px" }}
                  dangerouslySetInnerHTML={{ __html: item.subtitle }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
