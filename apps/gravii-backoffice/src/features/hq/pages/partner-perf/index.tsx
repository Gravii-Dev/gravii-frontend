const partnerScoreRows = [
  {
    campaigns: "6",
    cpa: "$0.31",
    driveAny: "68,400",
    driveFirst: "42,100",
    goldRate: { label: "68%", tone: "green" },
    name: "Nexus Finance",
    sybilRate: { label: "4%", tone: "green" }
  },
  {
    campaigns: "4",
    cpa: "$0.36",
    driveAny: "52,100",
    driveFirst: "38,900",
    goldRate: { label: "61%", tone: "green" },
    name: "ZenProtocol",
    sybilRate: { label: "5%", tone: "green" }
  },
  {
    campaigns: "3",
    cpa: "$0.48",
    driveAny: "54,200",
    driveFirst: "31,800",
    goldRate: { label: "52%", tone: "green" },
    name: "ChainVault",
    sybilRate: { label: "11%", tone: "amber" }
  },
  {
    campaigns: "2",
    cpa: "$0.53",
    driveAny: "39,100",
    driveFirst: "28,400",
    goldRate: { label: "45%", tone: "teal" },
    name: "DeFi Pulse",
    sybilRate: { label: "7%", tone: "green" }
  },
  {
    campaigns: "2",
    cpa: "$0.71",
    driveAny: "48,800",
    driveFirst: "22,600",
    goldRate: { label: "41%", tone: "teal" },
    name: "MetaBridge",
    sybilRate: { label: "15%", tone: "amber" }
  },
  {
    campaigns: "0",
    cpa: "—",
    driveAny: "21,300",
    driveFirst: "15,200",
    goldRate: { label: "33%", tone: "amber" },
    name: "Orbital Labs",
    sybilRate: { label: "22%", tone: "red" }
  }
] as const;

const revenueRows = [
  { color: "var(--green)", label: "ZenProtocol", textColor: "var(--green)", value: "$8,200", width: "100%" },
  { color: "var(--green)", label: "Nexus Finance", textColor: "var(--green)", value: "$6,800", width: "83%" },
  { color: "var(--teal)", label: "ChainVault", textColor: "var(--teal)", value: "$3,400", width: "41%" },
  { color: "var(--teal)", label: "DeFi Pulse", textColor: "var(--teal)", value: "$2,800", width: "34%" },
  { color: "var(--textD)", label: "Others (30)", value: "$12,600", width: "60%", textColor: "var(--textM)" }
] as const;

const adoptionCards = [
  {
    bg: "rgba(86,212,192,0.04)",
    border: "1px solid rgba(86,212,192,0.1)",
    color: "var(--teal)",
    label: "Reach Only",
    sublabel: "Using campaigns only",
    value: "4",
    valueColor: "var(--text)"
  },
  {
    bg: "rgba(88,166,255,0.04)",
    border: "1px solid rgba(88,166,255,0.1)",
    color: "var(--blue)",
    label: "Gate Only",
    sublabel: "API verification only",
    value: "10",
    valueColor: "var(--text)"
  },
  {
    bg: "rgba(188,140,255,0.04)",
    border: "1px solid rgba(188,140,255,0.1)",
    color: "var(--purple)",
    label: "Lens Only",
    sublabel: "Report analysis only",
    value: "6",
    valueColor: "var(--text)"
  },
  {
    bg: "rgba(232,168,124,0.04)",
    border: "1px solid rgba(232,168,124,0.1)",
    color: "var(--hq)",
    label: "Multi-Product",
    sublabel: "2+ products active",
    value: "14",
    valueColor: "var(--hq)"
  }
] as const;

export function PrototypePartnerPerfPage() {
  return (
    <div className="page" id="page-partner-perf">
      <div className="card fade-in fade-d1">
        <div className="sec-head">
          <div className="sec-title">Partner Performance Scorecard</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Partner</th>
                <th>Drive (1st Touch)</th>
                <th>Drive (Any Touch)</th>
                <th>Gold+ Rate</th>
                <th>Sybil Rate</th>
                <th>Campaigns</th>
                <th>
                  Avg CPA{" "}
                  <span className="roi-tip" title="CPA = Cost ÷ Engaged (cost per user acquired)">
                    i
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {partnerScoreRows.map((row) => (
                <tr key={row.name}>
                  <td style={{ color: "var(--text)", fontWeight: 600 }}>{row.name}</td>
                  <td className="tbl-mono">{row.driveFirst}</td>
                  <td className="tbl-mono">{row.driveAny}</td>
                  <td>
                    <span className={`tag tag-${row.goldRate.tone}`}>{row.goldRate.label}</span>
                  </td>
                  <td>
                    <span className={`tag tag-${row.sybilRate.tone}`}>{row.sybilRate.label}</span>
                  </td>
                  <td className="tbl-mono">{row.campaigns}</td>
                  <td className="tbl-mono">{row.cpa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="g2 fade-in fade-d2" style={{ marginTop: "20px" }}>
        <div className="card">
          <div className="sec-head">
            <div className="sec-title">Revenue by Partner (30d)</div>
          </div>
          <div>
            {revenueRows.map((row) => (
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
              background: "rgba(255,255,255,0.02)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "var(--textS)",
              fontSize: "13px",
              marginTop: "14px",
              padding: "10px"
            }}
          >
            Total MRR:{" "}
            <span
              style={{ color: "var(--green)", fontFamily: "'Space Mono',monospace", fontWeight: 700 }}
            >
              $33,800
            </span>
          </div>
        </div>

        <div className="card">
          <div className="sec-head">
            <div className="sec-title">Product Adoption</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {adoptionCards.map((card) => (
              <div
                key={card.label}
                style={{
                  alignItems: "center",
                  background: card.bg,
                  border: card.border,
                  borderRadius: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "14px"
                }}
              >
                <div>
                  <div style={{ color: card.color, fontSize: "13px", fontWeight: 600 }}>{card.label}</div>
                  <div style={{ color: "var(--textM)", fontSize: "12px" }}>{card.sublabel}</div>
                </div>
                <div
                  style={{
                    color: card.valueColor,
                    fontFamily: "'Space Mono',monospace",
                    fontSize: "18px",
                    fontWeight: 700
                  }}
                >
                  {card.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
