import { getPrototypeWindow } from "@/features/hq/lib/prototype-window";

export function PrototypePartnerDetailPage() {
  return (
    <div className="page" id="page-partner-detail">
      <div
        style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}
        className="fade-in"
      >
        <button
          onClick={() => getPrototypeWindow().navToPage?.("partner-list")}
          style={{
            padding: "6px 14px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--textM)",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Outfit',sans-serif",
            transition: "all 0.15s"
          }}
        >
          ← Back to List
        </button>
      </div>
      <div className="card fade-in fade-d1" style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "16px"
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Sora',sans-serif",
                fontSize: "24px",
                fontWeight: 800,
                color: "var(--text)",
                marginBottom: "8px"
              }}
              id="pd-name"
            >
              —
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              <span className="tag tag-green" id="pd-status">
                —
              </span>
              <span className="tag tag-hq" id="pd-plan">
                —
              </span>
              <span id="pd-products" />
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "12px", color: "var(--textM)" }}>Joined</div>
            <div
              style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: "14px",
                color: "var(--textS)"
              }}
              id="pd-joined"
            >
              —
            </div>
            <div style={{ fontSize: "12px", color: "var(--textM)", marginTop: "4px" }}>
              Last Active
            </div>
            <div
              style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: "14px",
                color: "var(--green)"
              }}
              id="pd-lastactive"
            >
              —
            </div>
          </div>
        </div>
      </div>
      <div className="stat-grid fade-in fade-d2" id="pd-stats" />
      <div className="g2 fade-in fade-d3" style={{ marginTop: "20px" }}>
        <div className="card">
          <div className="sec-head">
            <div className="sec-title">User Pool — Tier Distribution</div>
          </div>
          <div id="pd-tiers" />
        </div>
        <div className="card">
          <div className="sec-head">
            <div className="sec-title">Drive Source Breakdown</div>
          </div>
          <div id="pd-drives" />
        </div>
      </div>
      <div className="g2 fade-in fade-d4" style={{ marginTop: "20px" }}>
        <div className="card">
          <div className="sec-head">
            <div className="sec-title">Campaigns</div>
          </div>
          <div id="pd-campaigns" />
        </div>
        <div className="card">
          <div className="sec-head">
            <div className="sec-title">Gate API Usage (30d)</div>
          </div>
          <div id="pd-api" />
        </div>
      </div>
      <div className="card fade-in fade-d5" style={{ marginTop: "20px" }}>
        <div className="sec-head">
          <div className="sec-title">Revenue History</div>
        </div>
        <div id="pd-revenue" />
      </div>
    </div>
  );
}
