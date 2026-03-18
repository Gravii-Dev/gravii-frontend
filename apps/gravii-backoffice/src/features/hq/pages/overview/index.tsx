export function PrototypeOverviewPage() {
  return (
    <div className="page active" id="page-overview">
      <div className="stat-grid fade-in fade-d1">
        <div className="stat-card" data-accent="hq">
          <div className="stat-label">Total Gravii IDs</div>
          <div className="stat-value">487,231</div>
          <div className="stat-sub">
            <span className="stat-delta up">▲ 3.2%</span> vs prev period
          </div>
        </div>
        <div className="stat-card" data-accent="green">
          <div className="stat-label">New IDs (7d)</div>
          <div className="stat-value">12,408</div>
          <div className="stat-sub">
            <span className="stat-delta up">▲ 8.1%</span> vs prev 7d
          </div>
        </div>
        <div className="stat-card" data-accent="teal">
          <div className="stat-label">Active Partners</div>
          <div className="stat-value">34</div>
          <div className="stat-sub">
            <span className="stat-delta up">▲ 2</span> new this month
          </div>
        </div>
        <div className="stat-card" data-accent="blue">
          <div className="stat-label">Total Pool Value</div>
          <div className="stat-value">$2.14B</div>
          <div className="stat-sub">
            <span className="stat-delta up">▲ 5.6%</span> deployed + idle
          </div>
        </div>
        <div className="stat-card" data-accent="amber">
          <div className="stat-label">Active Campaigns</div>
          <div className="stat-value">18</div>
          <div className="stat-sub">
            <span className="stat-delta neutral">—</span> across 12 partners
          </div>
        </div>
        <div className="stat-card" data-accent="red">
          <div className="stat-label">Sybil Rate</div>
          <div className="stat-value">14.2%</div>
          <div className="stat-sub">
            <span className="stat-delta down">▼ 1.1%</span> improving
          </div>
        </div>
      </div>

      <div className="g23 fade-in fade-d2">
        <div className="card">
          <div className="sec-head">
            <div className="sec-title">User Growth</div>
            <span className="sec-action">View Cohort →</span>
          </div>
          <div className="mini-chart" id="growthChart" />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "12px",
              fontSize: "12px",
              color: "var(--textD)"
            }}
          >
            <span>30d ago</span>
            <span>Today</span>
          </div>
        </div>
        <div className="card">
          <div className="sec-head">
            <div className="sec-title">Tier Distribution</div>
          </div>
          <div className="donut-wrap">
            <div className="donut">
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle
                  cx="70"
                  cy="70"
                  r="56"
                  fill="none"
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="16"
                />
                <circle
                  cx="70"
                  cy="70"
                  r="56"
                  fill="none"
                  stroke="var(--cream)"
                  strokeWidth="16"
                  strokeDasharray="88 264"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />
                <circle
                  cx="70"
                  cy="70"
                  r="56"
                  fill="none"
                  stroke="var(--amber)"
                  strokeWidth="16"
                  strokeDasharray="74 278"
                  strokeDashoffset="-88"
                  strokeLinecap="round"
                />
                <circle
                  cx="70"
                  cy="70"
                  r="56"
                  fill="none"
                  stroke="var(--lav)"
                  strokeWidth="16"
                  strokeDasharray="53 299"
                  strokeDashoffset="-162"
                  strokeLinecap="round"
                />
                <circle
                  cx="70"
                  cy="70"
                  r="56"
                  fill="none"
                  stroke="var(--textD)"
                  strokeWidth="16"
                  strokeDasharray="137 215"
                  strokeDashoffset="-215"
                  strokeLinecap="round"
                />
              </svg>
              <div className="donut-center">
                <div className="donut-center-val">487K</div>
                <div className="donut-center-label">Total IDs</div>
              </div>
            </div>
            <div className="donut-legend">
              <div className="donut-legend-item">
                <div className="donut-legend-dot" style={{ background: "var(--textD)" }} />
                Classic — 39% (189.9K)
              </div>
              <div className="donut-legend-item">
                <div className="donut-legend-dot" style={{ background: "var(--cream)" }} />
                Gold — 25% (121.8K)
              </div>
              <div className="donut-legend-item">
                <div className="donut-legend-dot" style={{ background: "var(--amber)" }} />
                Platinum — 21% (102.3K)
              </div>
              <div className="donut-legend-item">
                <div className="donut-legend-dot" style={{ background: "var(--lav)" }} />
                Black — 15% (73.1K)
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="g2 fade-in fade-d3" style={{ marginTop: "20px" }}>
        <div className="card">
          <div className="sec-head">
            <div className="sec-title">Acquisition Source Mix (7d)</div>
            <span className="sec-action">Details →</span>
          </div>
          <div id="sourceBars">
            <div className="hbar-wrap">
              <div className="hbar-header">
                <span className="hbar-label">Partner Drive</span>
                <span className="hbar-val" style={{ color: "var(--teal)" }}>
                  42%
                </span>
              </div>
              <div className="hbar-track">
                <div className="hbar-fill" style={{ width: "42%", background: "var(--teal)" }} />
              </div>
            </div>
            <div className="hbar-wrap">
              <div className="hbar-header">
                <span className="hbar-label">Campaign (Reach)</span>
                <span className="hbar-val" style={{ color: "var(--blue)" }}>
                  24%
                </span>
              </div>
              <div className="hbar-track">
                <div className="hbar-fill" style={{ width: "24%", background: "var(--blue)" }} />
              </div>
            </div>
            <div className="hbar-wrap">
              <div className="hbar-header">
                <span className="hbar-label">Organic</span>
                <span className="hbar-val" style={{ color: "var(--purple)" }}>
                  18%
                </span>
              </div>
              <div className="hbar-track">
                <div
                  className="hbar-fill"
                  style={{ width: "18%", background: "var(--purple)" }}
                />
              </div>
            </div>
            <div className="hbar-wrap">
              <div className="hbar-header">
                <span className="hbar-label">Community Bot</span>
                <span className="hbar-val" style={{ color: "var(--amber)" }}>
                  10%
                </span>
              </div>
              <div className="hbar-track">
                <div className="hbar-fill" style={{ width: "10%", background: "var(--amber)" }} />
              </div>
            </div>
            <div className="hbar-wrap">
              <div className="hbar-header">
                <span className="hbar-label">Referral</span>
                <span className="hbar-val" style={{ color: "var(--hq)" }}>
                  4%
                </span>
              </div>
              <div className="hbar-track">
                <div className="hbar-fill" style={{ width: "4%", background: "var(--hq)" }} />
              </div>
            </div>
            <div className="hbar-wrap">
              <div className="hbar-header">
                <span className="hbar-label">Other / Unknown</span>
                <span className="hbar-val" style={{ color: "var(--textD)" }}>
                  2%
                </span>
              </div>
              <div className="hbar-track">
                <div
                  className="hbar-fill"
                  style={{ width: "2%", background: "var(--textD)" }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="sec-head">
            <div className="sec-title">Top Partners by Drive (7d)</div>
            <span className="sec-action">All Partners →</span>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th>Partner</th>
                <th>Users</th>
                <th>Gold+</th>
                <th>Sybil</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600, color: "var(--text)" }}>Nexus Finance</td>
                <td className="tbl-mono">2,840</td>
                <td>
                  <span className="tag tag-green">68%</span>
                </td>
                <td>
                  <span className="tag tag-green">4%</span>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: "var(--text)" }}>ChainVault</td>
                <td className="tbl-mono">2,210</td>
                <td>
                  <span className="tag tag-green">52%</span>
                </td>
                <td>
                  <span className="tag tag-amber">11%</span>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: "var(--text)" }}>DeFi Pulse</td>
                <td className="tbl-mono">1,680</td>
                <td>
                  <span className="tag tag-teal">45%</span>
                </td>
                <td>
                  <span className="tag tag-green">7%</span>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: "var(--text)" }}>MetaBridge</td>
                <td className="tbl-mono">1,340</td>
                <td>
                  <span className="tag tag-teal">41%</span>
                </td>
                <td>
                  <span className="tag tag-amber">15%</span>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: "var(--text)" }}>Orbital Labs</td>
                <td className="tbl-mono">980</td>
                <td>
                  <span className="tag tag-amber">33%</span>
                </td>
                <td>
                  <span className="tag tag-red">22%</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="fade-in fade-d4" style={{ marginTop: "20px" }}>
        <div className="card">
          <div className="sec-head">
            <div className="sec-title">Active Campaigns</div>
            <span className="sec-action">All Campaigns →</span>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Partner</th>
                <th>Type</th>
                <th>Engaged</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600, color: "var(--text)" }}>ETH Stakers Welcome</td>
                <td>Nexus Finance</td>
                <td>
                  <span className="tag tag-teal">Reach</span>
                </td>
                <td className="tbl-mono">4,280</td>
                <td>
                  <span className="tag tag-green">Live</span>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: "var(--text)" }}>Diamond Hands Bonus</td>
                <td>ChainVault</td>
                <td>
                  <span className="tag tag-teal">Reach</span>
                </td>
                <td className="tbl-mono">2,190</td>
                <td>
                  <span className="tag tag-green">Live</span>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: "var(--text)" }}>New User Onboarding</td>
                <td>MetaBridge</td>
                <td>
                  <span className="tag tag-teal">Reach</span>
                </td>
                <td className="tbl-mono">1,820</td>
                <td>
                  <span className="tag tag-green">Live</span>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: "var(--text)" }}>Yield Explorer Week</td>
                <td>DeFi Pulse</td>
                <td>
                  <span className="tag tag-teal">Reach</span>
                </td>
                <td className="tbl-mono">960</td>
                <td>
                  <span className="tag tag-amber">Ending</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="g2 fade-in fade-d5" style={{ marginTop: "20px" }}>
        <div className="card">
          <div className="sec-head">
            <div className="sec-title">Revenue (30d)</div>
            <span className="sec-action">View Performance →</span>
          </div>
          <div
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "flex-end",
              marginBottom: "16px"
            }}
          >
            <div>
              <div style={{ fontSize: "12px", color: "var(--textM)", marginBottom: "4px" }}>
                Total MRR
              </div>
              <div
                style={{
                  fontFamily: "'Space Mono',monospace",
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "var(--green)"
                }}
              >
                $33,800
              </div>
            </div>
            <div style={{ marginBottom: "4px" }}>
              <span className="stat-delta up" style={{ fontSize: "14px" }}>
                ▲ 18.2%
              </span>
              <span style={{ fontSize: "12px", color: "var(--textM)", marginLeft: "6px" }}>
                MoM
              </span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px" }}>
            <div
              style={{
                padding: "12px",
                background: "rgba(88,166,255,0.04)",
                border: "1px solid rgba(88,166,255,0.1)",
                borderRadius: "10px"
              }}
            >
              <div style={{ fontSize: "12px", color: "var(--textM)", marginBottom: "4px" }}>
                Gate (API)
              </div>
              <div
                style={{
                  fontFamily: "'Space Mono',monospace",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "var(--blue)"
                }}
              >
                $22,400
              </div>
              <div style={{ fontSize: "12px", color: "var(--textM)", marginTop: "2px" }}>
                66% of MRR
              </div>
            </div>
            <div
              style={{
                padding: "12px",
                background: "rgba(86,212,192,0.04)",
                border: "1px solid rgba(86,212,192,0.1)",
                borderRadius: "10px"
              }}
            >
              <div style={{ fontSize: "12px", color: "var(--textM)", marginBottom: "4px" }}>
                Reach (Campaign)
              </div>
              <div
                style={{
                  fontFamily: "'Space Mono',monospace",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "var(--teal)"
                }}
              >
                $8,200
              </div>
              <div style={{ fontSize: "12px", color: "var(--textM)", marginTop: "2px" }}>
                24% of MRR
              </div>
            </div>
            <div
              style={{
                padding: "12px",
                background: "rgba(188,140,255,0.04)",
                border: "1px solid rgba(188,140,255,0.1)",
                borderRadius: "10px"
              }}
            >
              <div style={{ fontSize: "12px", color: "var(--textM)", marginBottom: "4px" }}>
                Lens (Report)
              </div>
              <div
                style={{
                  fontFamily: "'Space Mono',monospace",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "var(--purple)"
                }}
              >
                $3,200
              </div>
              <div style={{ fontSize: "12px", color: "var(--textM)", marginTop: "2px" }}>
                10% of MRR
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="sec-head">
            <div className="sec-title">Revenue by Top Partners</div>
          </div>
          <div>
            <div className="hbar-wrap">
              <div className="hbar-header">
                <span className="hbar-label">ZenProtocol</span>
                <span className="hbar-val" style={{ color: "var(--green)" }}>
                  $8,200
                </span>
              </div>
              <div className="hbar-track">
                <div className="hbar-fill" style={{ width: "100%", background: "var(--green)" }} />
              </div>
            </div>
            <div className="hbar-wrap">
              <div className="hbar-header">
                <span className="hbar-label">Nexus Finance</span>
                <span className="hbar-val" style={{ color: "var(--green)" }}>
                  $6,800
                </span>
              </div>
              <div className="hbar-track">
                <div className="hbar-fill" style={{ width: "83%", background: "var(--green)" }} />
              </div>
            </div>
            <div className="hbar-wrap">
              <div className="hbar-header">
                <span className="hbar-label">ChainVault</span>
                <span className="hbar-val" style={{ color: "var(--teal)" }}>
                  $3,400
                </span>
              </div>
              <div className="hbar-track">
                <div className="hbar-fill" style={{ width: "41%", background: "var(--teal)" }} />
              </div>
            </div>
            <div className="hbar-wrap">
              <div className="hbar-header">
                <span className="hbar-label">DeFi Pulse</span>
                <span className="hbar-val" style={{ color: "var(--teal)" }}>
                  $2,800
                </span>
              </div>
              <div className="hbar-track">
                <div className="hbar-fill" style={{ width: "34%", background: "var(--teal)" }} />
              </div>
            </div>
            <div className="hbar-wrap">
              <div className="hbar-header">
                <span className="hbar-label">Others (30)</span>
                <span className="hbar-val" style={{ color: "var(--textM)" }}>
                  $12,600
                </span>
              </div>
              <div className="hbar-track">
                <div className="hbar-fill" style={{ width: "60%", background: "var(--textD)" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
