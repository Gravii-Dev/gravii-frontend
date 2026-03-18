import { getPrototypeWindow } from "@/features/hq/lib/prototype-window";

export function PrototypeRiskSybilPage() {
  const handleFilterClick = (element: HTMLElement) => {
    getPrototypeWindow().togF?.(element);
  };

  return (
    <div className="page" id="page-risk-sybil">
      <div className="filter-bar fade-in">
        <div className="filter-bar-label">Filter</div>
        <div className="filter-group">
          <span className="fbtn f-active" onClick={(event) => handleFilterClick(event.currentTarget)}>
            All Severity
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Critical
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Suspect
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Clean
          </span>
        </div>
        <div className="filter-sep" />
        <div className="filter-group">
          <span className="fbtn f-active" onClick={(event) => handleFilterClick(event.currentTarget)}>
            All Partners
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Orbital Labs
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            MetaBridge
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            ChainVault
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Nexus
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
        <div className="stat-card" data-accent="red">
          <div className="stat-label">Total Flagged</div>
          <div className="stat-value">69,187</div>
          <div className="stat-sub">
            14.2% of pool · <span className="stat-delta down">▼ 1.1%</span> improving
          </div>
        </div>
        <div className="stat-card" data-accent="amber">
          <div className="stat-label">Suspect (Watchlist)</div>
          <div className="stat-value">53,595</div>
          <div className="stat-sub">11.0% of pool</div>
        </div>
        <div className="stat-card" data-accent="red">
          <div className="stat-label">Critical Clusters</div>
          <div className="stat-value">8</div>
          <div className="stat-sub">Shared funding source detected</div>
        </div>
        <div className="stat-card" data-accent="green">
          <div className="stat-label">Auto-Filtered (30d)</div>
          <div className="stat-value">3,420</div>
          <div className="stat-sub">Blocked from campaigns</div>
        </div>
      </div>

      <div className="fade-in fade-d2">
        <div className="card">
          <div className="sec-head">
            <div className="sec-title">Sybil by Partner</div>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th>Partner</th>
                <th>Flagged</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600, color: "var(--text)" }}>Orbital Labs</td>
                <td className="tbl-mono">3,344</td>
                <td>
                  <span className="tag tag-red">22%</span>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: "var(--text)" }}>MetaBridge</td>
                <td className="tbl-mono">3,390</td>
                <td>
                  <span className="tag tag-amber">15%</span>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: "var(--text)" }}>ChainVault</td>
                <td className="tbl-mono">3,498</td>
                <td>
                  <span className="tag tag-amber">11%</span>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: "var(--text)" }}>SwapHub</td>
                <td className="tbl-mono">756</td>
                <td>
                  <span className="tag tag-green">9%</span>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: "var(--text)" }}>DeFi Pulse</td>
                <td className="tbl-mono">1,988</td>
                <td>
                  <span className="tag tag-green">7%</span>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: "var(--text)" }}>Nexus Finance</td>
                <td className="tbl-mono">1,684</td>
                <td>
                  <span className="tag tag-green">4%</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="card fade-in fade-d3" style={{ marginTop: "20px" }}>
        <div className="sec-head">
          <div className="sec-title">Sybil Distribution by Chain</div>
        </div>
        <div>
          <div className="hbar-wrap">
            <div className="hbar-header">
              <span className="hbar-label">Ethereum</span>
              <span className="hbar-val" style={{ color: "var(--red)" }}>
                42% of flagged
              </span>
            </div>
            <div className="hbar-track">
              <div className="hbar-fill" style={{ width: "42%", background: "var(--red)" }} />
            </div>
          </div>
          <div className="hbar-wrap">
            <div className="hbar-header">
              <span className="hbar-label">Arbitrum</span>
              <span className="hbar-val" style={{ color: "var(--orange)" }}>
                22%
              </span>
            </div>
            <div className="hbar-track">
              <div className="hbar-fill" style={{ width: "22%", background: "var(--orange)" }} />
            </div>
          </div>
          <div className="hbar-wrap">
            <div className="hbar-header">
              <span className="hbar-label">Base</span>
              <span className="hbar-val" style={{ color: "var(--amber)" }}>
                18%
              </span>
            </div>
            <div className="hbar-track">
              <div className="hbar-fill" style={{ width: "18%", background: "var(--amber)" }} />
            </div>
          </div>
          <div className="hbar-wrap">
            <div className="hbar-header">
              <span className="hbar-label">Polygon</span>
              <span className="hbar-val" style={{ color: "var(--textM)" }}>
                12%
              </span>
            </div>
            <div className="hbar-track">
              <div className="hbar-fill" style={{ width: "12%", background: "var(--textD)" }} />
            </div>
          </div>
          <div className="hbar-wrap">
            <div className="hbar-header">
              <span className="hbar-label">Others</span>
              <span className="hbar-val" style={{ color: "var(--textD)" }}>
                6%
              </span>
            </div>
            <div className="hbar-track">
              <div
                className="hbar-fill"
                style={{ width: "6%", background: "rgba(255,255,255,0.06)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
