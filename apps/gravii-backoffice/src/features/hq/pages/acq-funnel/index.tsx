const funnelSteps = [
  {
    bg: "rgba(232,168,124,0.06)",
    border: "1px solid rgba(232,168,124,0.15)",
    radius: "12px 12px 0 0",
    subtitle: "Unique wallets that touched Gravii",
    title: "Site Visits / Wallet Connections",
    tone: "var(--hq)",
    value: "186,400",
    valueSub: "100%"
  },
  {
    bg: "rgba(86,212,192,0.04)",
    border: "1px solid rgba(86,212,192,0.1)",
    radius: "0",
    subtitle: "Completed onboarding & ID generation",
    title: "Gravii ID Created",
    tone: "var(--teal)",
    value: "48,200",
    valueSub: "25.9% conversion"
  },
  {
    bg: "rgba(88,166,255,0.04)",
    border: "1px solid rgba(88,166,255,0.1)",
    radius: "0",
    subtitle: "Opted into at least one campaign",
    title: "Campaign Participation",
    tone: "var(--blue)",
    value: "18,640",
    valueSub: "38.7% of IDs"
  },
  {
    bg: "rgba(188,140,255,0.04)",
    border: "1px solid rgba(188,140,255,0.1)",
    radius: "0 0 12px 12px",
    subtitle: "Active again within 30 days of ID creation",
    title: "30d Retained",
    tone: "var(--purple)",
    value: "30,940",
    valueSub: "64.2% retention"
  }
] as const;

const funnelSourceRows = [
  {
    bestStage: { label: "Retention", tone: "green" },
    idToCampaign: "44.1%",
    idToRetained: "71.0%",
    name: "Partner Drive",
    tone: "var(--teal)",
    visitsToId: "32.4%"
  },
  {
    bestStage: { label: "Engagement", tone: "green" },
    idToCampaign: "62.3%",
    idToRetained: "66.0%",
    name: "Campaign",
    tone: "var(--blue)",
    visitsToId: "28.8%"
  },
  {
    bestStage: { label: "Retention", tone: "teal" },
    idToCampaign: "28.4%",
    idToRetained: "68.0%",
    name: "Organic",
    tone: "var(--purple)",
    visitsToId: "21.6%"
  },
  {
    bestStage: { label: "Top-Funnel", tone: "teal" },
    idToCampaign: "22.1%",
    idToRetained: "54.0%",
    name: "Community Bot",
    tone: "var(--amber)",
    visitsToId: "38.2%"
  },
  {
    bestStage: { label: "All Stages", tone: "green" },
    idToCampaign: "38.8%",
    idToRetained: "78.0%",
    name: "Referral",
    tone: "var(--hq)",
    visitsToId: "41.6%"
  }
] as const;

export function PrototypeAcqFunnelPage() {
  return (
    <div className="page" id="page-acq-funnel">
      <div className="card fade-in fade-d1">
        <div className="sec-head">
          <div className="sec-title">Acquisition Funnel (Last 30d)</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {funnelSteps.map((step, index) => (
            <div key={step.title}>
              <div
                style={{
                  alignItems: "center",
                  background: step.bg,
                  border: step.border,
                  borderRadius: step.radius,
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "20px"
                }}
              >
                <div>
                  <div style={{ color: "var(--text)", fontSize: "16px", fontWeight: 700 }}>{step.title}</div>
                  <div style={{ color: "var(--textM)", fontSize: "12px", marginTop: "2px" }}>
                    {step.subtitle}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      color: step.tone,
                      fontFamily: "'Space Mono',monospace",
                      fontSize: "28px",
                      fontWeight: 700
                    }}
                  >
                    {step.value}
                  </div>
                  <div style={{ color: step.tone === "var(--hq)" ? "var(--textM)" : step.tone, fontSize: "12px" }}>
                    {step.valueSub}
                  </div>
                </div>
              </div>
              {index < funnelSteps.length - 1 ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
                  <div style={{ background: "var(--border)", height: "16px", width: "2px" }} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="card fade-in fade-d2" style={{ marginTop: "20px" }}>
        <div className="sec-head">
          <div className="sec-title">Funnel Conversion by Source</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Source</th>
                <th>Visits→ID</th>
                <th>ID→Campaign</th>
                <th>ID→Retained</th>
                <th>Best Stage</th>
              </tr>
            </thead>
            <tbody>
              {funnelSourceRows.map((row) => (
                <tr key={row.name}>
                  <td style={{ color: row.tone, fontWeight: 600 }}>{row.name}</td>
                  <td className="tbl-mono">{row.visitsToId}</td>
                  <td className="tbl-mono">{row.idToCampaign}</td>
                  <td className="tbl-mono">{row.idToRetained}</td>
                  <td>
                    <span className={`tag tag-${row.bestStage.tone}`}>{row.bestStage.label}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
