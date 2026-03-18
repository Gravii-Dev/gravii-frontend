export function PrototypeRiskHealthPage() {
  return (
    <div className="page" id="page-risk-health">
      <div
        className="card fade-in fade-d1"
        style={{ textAlign: "center", padding: "32px", marginBottom: "20px" }}
      >
        <div
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "var(--hq)",
            letterSpacing: "1px",
            marginBottom: "12px"
          }}
        >
          GROWTH HEALTH
        </div>
        <div
          style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: "64px",
            fontWeight: 700,
            color: "var(--green)",
            lineHeight: 1
          }}
        >
          A
        </div>
        <div style={{ fontSize: "14px", color: "var(--textM)", marginTop: "8px" }}>
          Net Growth MoM ≥10%, Churn &lt;1%, Sources diversified
        </div>
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            flexWrap: "wrap"
          }}
        >
          <div
            style={{
              padding: "8px 16px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: "12px"
            }}
          >
            <span style={{ color: "var(--textM)" }}>Grade basis:</span>{" "}
            <span style={{ color: "var(--textS)", fontWeight: 600 }}>
              Net Growth Rate (MoM)
            </span>
          </div>
          <div
            style={{
              padding: "8px 16px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: "12px"
            }}
          >
            <span style={{ color: "var(--textM)" }}>Adjusters:</span>{" "}
            <span style={{ color: "var(--textS)", fontWeight: 600 }}>
              Churn, Source Concentration
            </span>
          </div>
        </div>
      </div>

      <div
        className="card fade-in fade-d1"
        style={{ marginBottom: "20px", padding: "16px 20px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <span style={{ color: "var(--hq)", fontSize: "14px" }}>ⓘ</span>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)" }}>
            Grading Criteria
          </span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Grade</th>
                <th>Net Growth MoM</th>
                <th>Conditions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontWeight: 700,
                    color: "var(--green)"
                  }}
                >
                  A
                </td>
                <td className="tbl-mono">≥10%</td>
                <td style={{ fontSize: "12px", color: "var(--textM)" }}>
                  Churn &lt;1% and no single source &gt;60%
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontWeight: 700,
                    color: "var(--green)"
                  }}
                >
                  A-
                </td>
                <td className="tbl-mono">≥10%</td>
                <td style={{ fontSize: "12px", color: "var(--textM)" }}>
                  One or more conditions unmet
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontWeight: 700,
                    color: "var(--teal)"
                  }}
                >
                  B+
                </td>
                <td className="tbl-mono">7~10%</td>
                <td style={{ fontSize: "12px", color: "var(--textM)" }}>—</td>
              </tr>
              <tr>
                <td
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontWeight: 700,
                    color: "var(--textS)"
                  }}
                >
                  B
                </td>
                <td className="tbl-mono">5~7%</td>
                <td style={{ fontSize: "12px", color: "var(--textM)" }}>—</td>
              </tr>
              <tr>
                <td
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontWeight: 700,
                    color: "var(--amber)"
                  }}
                >
                  C
                </td>
                <td className="tbl-mono">1~5%</td>
                <td style={{ fontSize: "12px", color: "var(--textM)" }}>—</td>
              </tr>
              <tr>
                <td
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontWeight: 700,
                    color: "var(--red)"
                  }}
                >
                  D
                </td>
                <td className="tbl-mono">&lt;1% or negative</td>
                <td style={{ fontSize: "12px", color: "var(--textM)" }}>
                  Pool is stagnant or shrinking
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="stat-grid fade-in fade-d2">
        <div className="stat-card" data-accent="green">
          <div className="stat-label">Net ID Growth (30d)</div>
          <div className="stat-value">+46,360</div>
          <div className="stat-sub">48,200 new — 1,840 deleted</div>
        </div>
        <div className="stat-card" data-accent="green">
          <div className="stat-label">Growth Rate (MoM)</div>
          <div className="stat-value">11.2%</div>
          <div className="stat-sub">
            <span className="stat-delta up">▲ 3.0%</span> vs prev month (8.2%)
          </div>
        </div>
        <div className="stat-card" data-accent="teal">
          <div className="stat-label">Source Diversification</div>
          <div className="stat-value">0.74</div>
          <div className="stat-sub">Healthy (max source: 42%) · 1.0 = perfect</div>
        </div>
        <div className="stat-card" data-accent="blue">
          <div className="stat-label">Gold+ Acquisition Rate</div>
          <div className="stat-value">52%</div>
          <div className="stat-sub">Of new IDs in last 30d are Gold+</div>
        </div>
        <div className="stat-card" data-accent="hq">
          <div className="stat-label">Partner Contribution</div>
          <div className="stat-value">66%</div>
          <div className="stat-sub">Of new IDs driven by partners (Drive + Campaign)</div>
        </div>
        <div className="stat-card" data-accent="green">
          <div className="stat-label">
            Churn Rate (30d){" "}
            <span
              className="roi-tip"
              title="Churn = Deleted IDs ÷ Total Pool. Measures how many users leave the ecosystem relative to total pool size."
            >
              i
            </span>
          </div>
          <div className="stat-value">0.38%</div>
          <div className="stat-sub">
            <span className="stat-delta down">▼ 0.04%</span> improving · 1,840 deleted of 487K
          </div>
        </div>
      </div>

      <div className="card fade-in fade-d3" style={{ marginTop: "20px" }}>
        <div className="sec-head">
          <div className="sec-title">Growth Health Trend (12 Weeks)</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Week</th>
                <th>Net Growth</th>
                <th>MoM Rate</th>
                <th>Churn</th>
                <th>Source Div.</th>
                <th>Gold+ Acq.</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="tbl-mono">Mar 10</td>
                <td className="tbl-mono">+12,408</td>
                <td className="tbl-mono">11.2%</td>
                <td className="tbl-mono">0.38%</td>
                <td className="tbl-mono">0.74</td>
                <td className="tbl-mono">52%</td>
                <td
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontWeight: 700,
                    color: "var(--green)"
                  }}
                >
                  A
                </td>
              </tr>
              <tr>
                <td className="tbl-mono">Mar 03</td>
                <td className="tbl-mono">+11,840</td>
                <td className="tbl-mono">10.8%</td>
                <td className="tbl-mono">0.40%</td>
                <td className="tbl-mono">0.72</td>
                <td className="tbl-mono">50%</td>
                <td
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontWeight: 700,
                    color: "var(--green)"
                  }}
                >
                  A
                </td>
              </tr>
              <tr>
                <td className="tbl-mono">Feb 24</td>
                <td className="tbl-mono">+10,200</td>
                <td className="tbl-mono">9.4%</td>
                <td className="tbl-mono">0.41%</td>
                <td className="tbl-mono">0.70</td>
                <td className="tbl-mono">48%</td>
                <td
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontWeight: 700,
                    color: "var(--teal)"
                  }}
                >
                  B+
                </td>
              </tr>
              <tr>
                <td className="tbl-mono">Feb 17</td>
                <td className="tbl-mono">+9,600</td>
                <td className="tbl-mono">8.6%</td>
                <td className="tbl-mono">0.42%</td>
                <td className="tbl-mono">0.68</td>
                <td className="tbl-mono">46%</td>
                <td
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontWeight: 700,
                    color: "var(--teal)"
                  }}
                >
                  B+
                </td>
              </tr>
              <tr>
                <td className="tbl-mono">Feb 10</td>
                <td className="tbl-mono">+8,400</td>
                <td className="tbl-mono">7.8%</td>
                <td className="tbl-mono">0.44%</td>
                <td className="tbl-mono">0.66</td>
                <td className="tbl-mono">44%</td>
                <td
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontWeight: 700,
                    color: "var(--teal)"
                  }}
                >
                  B+
                </td>
              </tr>
              <tr>
                <td className="tbl-mono">Feb 03</td>
                <td className="tbl-mono">+7,200</td>
                <td className="tbl-mono">6.2%</td>
                <td className="tbl-mono">0.46%</td>
                <td className="tbl-mono">0.64</td>
                <td className="tbl-mono">42%</td>
                <td
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontWeight: 700,
                    color: "var(--textS)"
                  }}
                >
                  B
                </td>
              </tr>
              <tr>
                <td className="tbl-mono">Jan 27</td>
                <td className="tbl-mono">+6,800</td>
                <td className="tbl-mono">5.8%</td>
                <td className="tbl-mono">0.48%</td>
                <td className="tbl-mono">0.62</td>
                <td className="tbl-mono">40%</td>
                <td
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontWeight: 700,
                    color: "var(--textS)"
                  }}
                >
                  B
                </td>
              </tr>
              <tr>
                <td className="tbl-mono">Jan 20</td>
                <td className="tbl-mono">+6,100</td>
                <td className="tbl-mono">5.4%</td>
                <td className="tbl-mono">0.50%</td>
                <td className="tbl-mono">0.60</td>
                <td className="tbl-mono">38%</td>
                <td
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontWeight: 700,
                    color: "var(--textS)"
                  }}
                >
                  B
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="g3 fade-in fade-d4" style={{ marginTop: "20px" }}>
        <div className="card" style={{ borderColor: "rgba(86,212,192,0.2)" }}>
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <div
              style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--teal)",
                letterSpacing: "1.5px",
                marginBottom: "8px"
              }}
            >
              REACH
            </div>
            <div
              style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: "32px",
                fontWeight: 700,
                color: "var(--text)"
              }}
            >
              8,420
            </div>
            <div style={{ fontSize: "12px", color: "var(--textM)" }}>
              New IDs via campaigns (30d)
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                padding: "6px 0",
                borderBottom: "1px solid var(--border)"
              }}
            >
              <span style={{ color: "var(--textM)" }}>Active campaigns</span>
              <span style={{ color: "var(--textS)", fontFamily: "'Space Mono',monospace" }}>
                18
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                padding: "6px 0",
                borderBottom: "1px solid var(--border)"
              }}
            >
              <span style={{ color: "var(--textM)" }}>Total engaged</span>
              <span style={{ color: "var(--textS)", fontFamily: "'Space Mono',monospace" }}>
                84,200
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                padding: "6px 0",
                borderBottom: "1px solid var(--border)"
              }}
            >
              <span style={{ color: "var(--textM)" }}>Avg CPA</span>
              <span style={{ color: "var(--green)", fontFamily: "'Space Mono',monospace" }}>
                $0.42
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                padding: "6px 0"
              }}
            >
              <span style={{ color: "var(--textM)" }}>Pool contribution</span>
              <span
                style={{
                  color: "var(--teal)",
                  fontFamily: "'Space Mono',monospace",
                  fontWeight: 700
                }}
              >
                17.5%
              </span>
            </div>
          </div>
        </div>
        <div className="card" style={{ borderColor: "rgba(88,166,255,0.2)" }}>
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <div
              style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--blue)",
                letterSpacing: "1.5px",
                marginBottom: "8px"
              }}
            >
              GATE
            </div>
            <div
              style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: "32px",
                fontWeight: 700,
                color: "var(--text)"
              }}
            >
              142K
            </div>
            <div style={{ fontSize: "12px", color: "var(--textM)" }}>API queries (30d)</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                padding: "6px 0",
                borderBottom: "1px solid var(--border)"
              }}
            >
              <span style={{ color: "var(--textM)" }}>Partners using Gate</span>
              <span style={{ color: "var(--textS)", fontFamily: "'Space Mono',monospace" }}>
                28
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                padding: "6px 0",
                borderBottom: "1px solid var(--border)"
              }}
            >
              <span style={{ color: "var(--textM)" }}>IDs via Drive link</span>
              <span style={{ color: "var(--textS)", fontFamily: "'Space Mono',monospace" }}>
                24,800
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                padding: "6px 0",
                borderBottom: "1px solid var(--border)"
              }}
            >
              <span style={{ color: "var(--textM)" }}>Avg latency</span>
              <span style={{ color: "var(--green)", fontFamily: "'Space Mono',monospace" }}>
                127ms
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                padding: "6px 0"
              }}
            >
              <span style={{ color: "var(--textM)" }}>Pool contribution</span>
              <span
                style={{
                  color: "var(--blue)",
                  fontFamily: "'Space Mono',monospace",
                  fontWeight: 700
                }}
              >
                51.5%
              </span>
            </div>
          </div>
        </div>
        <div className="card" style={{ borderColor: "rgba(188,140,255,0.2)" }}>
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <div
              style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--purple)",
                letterSpacing: "1.5px",
                marginBottom: "8px"
              }}
            >
              LENS
            </div>
            <div
              style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: "32px",
                fontWeight: 700,
                color: "var(--text)"
              }}
            >
              12
            </div>
            <div style={{ fontSize: "12px", color: "var(--textM)" }}>
              Reports delivered (30d)
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                padding: "6px 0",
                borderBottom: "1px solid var(--border)"
              }}
            >
              <span style={{ color: "var(--textM)" }}>Partners using Lens</span>
              <span style={{ color: "var(--textS)", fontFamily: "'Space Mono',monospace" }}>
                22
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                padding: "6px 0",
                borderBottom: "1px solid var(--border)"
              }}
            >
              <span style={{ color: "var(--textM)" }}>Converted to Gate/Reach</span>
              <span style={{ color: "var(--textS)", fontFamily: "'Space Mono',monospace" }}>
                6
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                padding: "6px 0",
                borderBottom: "1px solid var(--border)"
              }}
            >
              <span style={{ color: "var(--textM)" }}>Wallets analyzed</span>
              <span style={{ color: "var(--textS)", fontFamily: "'Space Mono',monospace" }}>
                420K
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                padding: "6px 0"
              }}
            >
              <span style={{ color: "var(--textM)" }}>Entry point role</span>
              <span
                style={{
                  color: "var(--purple)",
                  fontFamily: "'Space Mono',monospace",
                  fontWeight: 700
                }}
              >
                Pipeline
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card fade-in fade-d5" style={{ marginTop: "20px" }}>
        <div className="sec-head">
          <div className="sec-title">Net Pool Effect (30d)</div>
        </div>
        <div className="stat-grid" style={{ marginBottom: 0 }}>
          <div
            style={{
              padding: "16px",
              background: "rgba(63,185,80,0.04)",
              border: "1px solid rgba(63,185,80,0.1)",
              borderRadius: "10px",
              textAlign: "center"
            }}
          >
            <div style={{ fontSize: "12px", color: "var(--textM)", marginBottom: "4px" }}>
              New IDs (All Sources)
            </div>
            <div
              style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: "24px",
                fontWeight: 700,
                color: "var(--green)"
              }}
            >
              +48,200
            </div>
          </div>
          <div
            style={{
              padding: "16px",
              background: "rgba(248,81,73,0.04)",
              border: "1px solid rgba(248,81,73,0.1)",
              borderRadius: "10px",
              textAlign: "center"
            }}
          >
            <div style={{ fontSize: "12px", color: "var(--textM)", marginBottom: "4px" }}>
              Deleted IDs
            </div>
            <div
              style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: "24px",
                fontWeight: 700,
                color: "var(--red)"
              }}
            >
              -1,840
            </div>
          </div>
          <div
            style={{
              padding: "16px",
              background: "rgba(232,168,124,0.04)",
              border: "1px solid rgba(232,168,124,0.1)",
              borderRadius: "10px",
              textAlign: "center"
            }}
          >
            <div style={{ fontSize: "12px", color: "var(--textM)", marginBottom: "4px" }}>
              Net Growth
            </div>
            <div
              style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: "24px",
                fontWeight: 700,
                color: "var(--hq)"
              }}
            >
              +46,360
            </div>
          </div>
          <div
            style={{
              padding: "16px",
              background: "rgba(200,182,255,0.04)",
              border: "1px solid rgba(200,182,255,0.1)",
              borderRadius: "10px",
              textAlign: "center"
            }}
          >
            <div style={{ fontSize: "12px", color: "var(--textM)", marginBottom: "4px" }}>
              Pool Value Change
            </div>
            <div
              style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: "24px",
                fontWeight: 700,
                color: "var(--lav)"
              }}
            >
              +$184M
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
