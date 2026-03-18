const attributionCards = [
  {
    badge: <span className="tag tag-hq">Primary</span>,
    body:
      'Attributes each user to the first channel that brought them into Gravii. Answers the question: "Who originally brought this user into the ecosystem?"',
    example:
      "User A signs up organically → later joins Partner X campaign → then gets driven by Partner Y",
    exampleResult: "First-Touch = Organic",
    style: {
      background: "rgba(232,168,124,0.04)",
      border: "1px solid rgba(232,168,124,0.15)",
      borderRadius: "12px",
      padding: "16px"
    },
    title: "First-Touch"
  },
  {
    badge: (
      <span className="tag" style={{ background: "rgba(255,255,255,0.04)", color: "var(--textM)" }}>
        Recorded
      </span>
    ),
    body:
      "Records every touchpoint a user passes through. Tracks the full journey across multiple partners and channels. Per-user touch history is available in User Explorer.",
    example: "Same User A's full history",
    exampleResult: "Any-Touch = all 3 recorded",
    style: {
      background: "rgba(255,255,255,0.02)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      padding: "16px"
    },
    title: "Any-Touch (Multi-Touch)"
  }
] as const;

const firstTouchRows = [
  {
    avgValue: "$5,840",
    goldRate: { label: "54%", tone: "green" },
    name: "Partner Drive",
    tone: "var(--teal)",
    totalUsers: "198,420",
    trend: { label: "▲ 3.2%", tone: "up" }
  },
  {
    avgValue: "$4,620",
    goldRate: { label: "46%", tone: "teal" },
    name: "Organic",
    tone: "var(--purple)",
    totalUsers: "121,320",
    trend: { label: "▼ 1.1%", tone: "down" }
  },
  {
    avgValue: "$4,980",
    goldRate: { label: "50%", tone: "green" },
    name: "Campaign (Reach)",
    tone: "var(--blue)",
    totalUsers: "97,200",
    trend: { label: "▲ 5.8%", tone: "up" }
  },
  {
    avgValue: "$2,940",
    goldRate: { label: "34%", tone: "amber" },
    name: "Community Bot",
    tone: "var(--amber)",
    totalUsers: "43,800",
    trend: { label: "▲ 8.1%", tone: "up" }
  },
  {
    avgValue: "$8,420",
    goldRate: { label: "64%", tone: "green" },
    name: "Referral",
    tone: "var(--hq)",
    totalUsers: "18,240",
    trend: { label: "▲ 1.2%", tone: "up" }
  },
  {
    avgValue: "$1,180",
    goldRate: { label: "21%", tone: "red" },
    name: "Unknown / Other",
    tone: "var(--textM)",
    totalUsers: "8,251",
    trend: { label: "▼ 4.2%", tone: "down" }
  }
] as const;

const partnerAttributionRows = [
  {
    anyTouch: "68,400",
    firstTouch: "42,100",
    insight: "Strong at both acquiring and engaging existing",
    insightTone: "var(--textM)",
    name: "Nexus Finance",
    ratio: "1.62×",
    tone: "var(--text)"
  },
  {
    anyTouch: "54,200",
    firstTouch: "31,800",
    insight: "High re-engagement through campaigns",
    insightTone: "var(--textM)",
    name: "ChainVault",
    ratio: "1.70×",
    tone: "var(--text)"
  },
  {
    anyTouch: "39,100",
    firstTouch: "28,400",
    insight: "Mostly new user acquisition focused",
    insightTone: "var(--textM)",
    name: "DeFi Pulse",
    ratio: "1.38×",
    tone: "var(--text)"
  },
  {
    anyTouch: "48,800",
    firstTouch: "22,600",
    insight: "Heavy re-claimer — touches existing users more",
    insightTone: "var(--amber)",
    name: "MetaBridge",
    ratio: "2.16×",
    tone: "var(--text)"
  },
  {
    anyTouch: "21,300",
    firstTouch: "15,200",
    insight: "Balanced acquisition/engagement",
    insightTone: "var(--textM)",
    name: "Orbital Labs",
    ratio: "1.40×",
    tone: "var(--text)"
  }
] as const;

export function PrototypeAcqAttributionPage() {
  return (
    <div className="page" id="page-acq-attribution">
      <div className="card fade-in fade-d1" style={{ marginBottom: "20px" }}>
        <div style={{ color: "var(--hq)", fontSize: "14px", fontWeight: 700, marginBottom: "12px" }}>
          Attribution Model
        </div>
        <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "1fr 1fr", marginBottom: "16px" }}>
          {attributionCards.map((card) => (
            <div key={card.title} style={card.style}>
              <div style={{ alignItems: "center", display: "flex", gap: "8px", marginBottom: "8px" }}>
                {card.badge}
                <span style={{ color: "var(--text)", fontSize: "15px", fontWeight: 700 }}>{card.title}</span>
              </div>
              <div style={{ color: "var(--textS)", fontSize: "13px", lineHeight: 1.7, marginBottom: "10px" }}>
                {card.body.includes("first channel") ? (
                  <>
                    Attributes each user to the <strong style={{ color: "var(--text)" }}>first channel that brought them into Gravii</strong>. Answers the question: &quot;Who originally brought this user into the ecosystem?&quot;
                  </>
                ) : (
                  <>
                    Records <strong style={{ color: "var(--text)" }}>every touchpoint a user passes through</strong>. Tracks the full journey across multiple partners and channels. Per-user touch history is available in User Explorer.
                  </>
                )}
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: "8px",
                  color: "var(--textM)",
                  fontSize: "12px",
                  lineHeight: 1.6,
                  padding: "10px"
                }}
              >
                <strong style={{ color: "var(--textS)" }}>Example:</strong> {card.example}
                <br />
                {card.title === "First-Touch" ? (
                  <>
                    → <span style={{ color: "var(--hq)", fontWeight: 600 }}>{card.exampleResult}</span>{" "}
                    (earliest touchpoint)
                  </>
                ) : (
                  <>
                    → Organic (1st) → Partner X Campaign (2nd) → Partner Y Drive (3rd)
                    <br />→{" "}
                    <span style={{ color: "var(--textS)", fontWeight: 600 }}>{card.exampleResult}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            alignItems: "flex-start",
            background: "rgba(232,168,124,0.04)",
            border: "1px solid rgba(232,168,124,0.1)",
            borderRadius: "10px",
            color: "var(--textS)",
            display: "flex",
            gap: "12px",
            lineHeight: 1.7,
            padding: "12px 16px"
          }}
        >
          <span style={{ color: "var(--hq)", flexShrink: 0, fontSize: "14px", marginTop: "1px" }}>ⓘ</span>
          <div style={{ fontSize: "13px" }}>
            <strong style={{ color: "var(--text)" }}>Why hybrid?</strong> — First-Touch is essential
            for measuring pool growth contribution (who brought users in). Any-Touch is needed to show
            partners that their campaigns also re-engage existing users. The tables below show
            First-Touch aggregation alongside Any-Touch comparison.
          </div>
        </div>
      </div>

      <div className="card fade-in fade-d2">
        <div className="sec-head">
          <div className="sec-title">First-Touch Attribution — Who Brought Users In</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Source (1st Touch)</th>
                <th>Total Users</th>
                <th>Gold+ Rate</th>
                <th>Avg Value</th>
                <th>Trend (30d)</th>
              </tr>
            </thead>
            <tbody>
              {firstTouchRows.map((row) => (
                <tr key={row.name}>
                  <td style={{ color: row.tone, fontWeight: 600 }}>{row.name}</td>
                  <td className="tbl-mono">{row.totalUsers}</td>
                  <td>
                    <span className={`tag tag-${row.goldRate.tone}`}>{row.goldRate.label}</span>
                  </td>
                  <td className="tbl-mono">{row.avgValue}</td>
                  <td>
                    <span className={`stat-delta ${row.trend.tone}`}>{row.trend.label}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card fade-in fade-d3" style={{ marginTop: "20px" }}>
        <div className="sec-head">
          <div className="sec-title">First-Touch vs Any-Touch — Partner Attribution</div>
        </div>
        <div style={{ color: "var(--textM)", fontSize: "13px", marginBottom: "16px" }}>
          Compare how many users a partner &quot;brought in&quot; (1st touch) vs &quot;touched&quot; (any touch).
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Partner</th>
                <th>As 1st Touch</th>
                <th>As Any Touch</th>
                <th>Ratio</th>
                <th>Insight</th>
              </tr>
            </thead>
            <tbody>
              {partnerAttributionRows.map((row) => (
                <tr key={row.name}>
                  <td style={{ color: row.tone, fontWeight: 600 }}>{row.name}</td>
                  <td className="tbl-mono">{row.firstTouch}</td>
                  <td className="tbl-mono">{row.anyTouch}</td>
                  <td className="tbl-mono">{row.ratio}</td>
                  <td style={{ color: row.insightTone, fontSize: "12px" }}>
                    {row.insight}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          style={{
            background: "rgba(227,179,65,0.04)",
            border: "1px solid rgba(227,179,65,0.1)",
            borderRadius: "10px",
            color: "var(--textS)",
            fontSize: "12px",
            marginTop: "14px",
            padding: "10px 14px"
          }}
        >
          Ratio &gt; 2.0× may indicate partner is &quot;claiming&quot; existing users rather than
          bringing new ones. Worth monitoring for attribution fairness.
        </div>
      </div>
    </div>
  );
}
