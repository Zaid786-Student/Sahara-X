import Icon from "../components/Icon";
import { useStore } from "../store/useStore";
import { fmtRupee } from "../lib/format";
import { t } from "../lib/i18n";

export default function Insights() {
  const p = useStore((s) => s.profile);
  const report = useStore((s) => s.report);
  const nav = useStore((s) => s.nav);
  const mi = report?.marketInsights;
  const tt = (key, ...args) => t(p.language, key, ...args);

  return (
    <>
      <div className="topbar-page"><div><h1 className="page-title">{tt("insights_title")}</h1><p className="page-sub">{tt("insights_sub")}</p></div></div>
      <div className="grid grid-4" style={{ margin: "20px 0" }}>
        <div className="card stat-card"><div className="stat-label">{tt("stat_location")}</div><div className="stat-value" style={{ fontFamily: "'Fraunces',serif", fontSize: 19 }}>{p.locationType || "—"}</div></div>
        <div className="card stat-card"><div className="stat-label">{tt("sector")}</div><div className="stat-value" style={{ fontFamily: "'Fraunces',serif", fontSize: 19 }}>{p.sectorInterest[0] || tt("open")}</div></div>
        <div className="card stat-card"><div className="stat-label">{tt("stat_budget")}</div><div className="stat-value mono">{fmtRupee(p.budget)}</div></div>
        <div className="card stat-card"><div className="stat-label">{tt("stat_skills")}</div><div className="stat-value" style={{ fontFamily: "'Fraunces',serif", fontSize: 16 }}>{p.skills.join(", ") || "—"}</div></div>
      </div>
      {mi ? (
        <>
          <div className="grid grid-2">
            <div className="card" style={{ padding: 26 }}>
              <div className="section-label"><Icon name="pin" /> {tt("location_context")}</div>
              <p style={{ fontSize: 14.5, color: "var(--ink-soft)", marginBottom: 18 }}>{mi.locationContext}</p>
              <div className="section-label"><Icon name="user" /> {tt("target_customers")}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {(mi.targetCustomerGroups || []).map((t2, i) => <span key={i} className="badge badge-indigo">{t2}</span>)}
              </div>
            </div>
            <div className="card" style={{ padding: 26 }}>
              <div className="section-label"><Icon name="chart" /> {tt("demand_signals")}</div>
              <p style={{ fontSize: 14.5, color: "var(--ink-soft)", marginBottom: 14 }}>{mi.demandSignals}</p>
              <div className="section-label"><Icon name="sun" /> {tt("seasonality")}</div>
              <p style={{ fontSize: 14.5, color: "var(--ink-soft)", marginBottom: 14 }}>{mi.seasonality}</p>
              <div className="section-label"><Icon name="scale" /> {tt("competition")}</div>
              <p style={{ fontSize: 14.5, color: "var(--ink-soft)" }}>{mi.competition}</p>
            </div>
          </div>
          <div className="card" style={{ padding: "20px 24px", marginTop: 18, background: "var(--card)" }}>
            <p className="tag-note" style={{ fontSize: 13 }}><Icon name="alert" /> {tt("ai_informed_note")} {mi.localConsiderations}</p>
          </div>
        </>
      ) : (
        <div className="card empty-state">
          <div className="oi"><Icon name="chart" /></div>
          <h3 style={{ fontSize: 20 }}>{tt("no_insights_title")}</h3>
          <p style={{ color: "var(--ink-soft)", marginBottom: 20 }}>{tt("no_insights_sub")}</p>
          <button className="btn btn-primary" onClick={() => nav("myReport")}>{tt("generate_report")}</button>
        </div>
      )}
    </>
  );
}
