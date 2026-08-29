import Icon from "../components/Icon";
import Journey from "../components/Journey";
import { useStore } from "../store/useStore";
import { fmtRupee, dayPart, matchSchemes } from "../lib/format";
import { t } from "../lib/i18n";

export default function Overview() {
  const p = useStore((s) => s.profile);
  const recommendations = useStore((s) => s.recommendations);
  const overallProfileFit = useStore((s) => s.overallProfileFit);
  const report = useStore((s) => s.report);
  const schemes = useStore((s) => s.schemes);
  const nav = useStore((s) => s.nav);
  const openOpportunity = useStore((s) => s.openOpportunity);

  const tt = (key, ...args) => t(p.language, key, ...args);
  const hasReco = !!recommendations;
  const top = hasReco ? recommendations[0] : null;
  const schemesForTop = top ? matchSchemes(schemes, top.governmentSchemeCategories) : [];
  const dayKey = { morning: "day_morning", afternoon: "day_afternoon", evening: "day_evening" }[dayPart()];

  return (
    <>
      <div className="topbar-page"><div>
        <h1 className="page-title">{tt("greeting", tt(dayKey), p.name ? p.name : tt("entrepreneur"))}</h1>
        <p className="page-sub">{tt("greeting_sub")}</p>
      </div></div>

      <div className="grid grid-4" style={{ margin: "26px 0" }}>
        <div className="card stat-card"><div className="stat-label"><Icon name="rupee" /> {tt("stat_budget")}</div><div className="stat-value mono">{p.budget ? fmtRupee(p.budget) : "—"}</div></div>
        <div className="card stat-card"><div className="stat-label"><Icon name="pin" /> {tt("stat_location")}</div><div className="stat-value" style={{ fontFamily: "'Fraunces',serif" }}>{p.locationType || "—"}</div>{p.exactLocation && <div style={{ fontSize: 11.5, color: "var(--ink-soft)", marginTop: 4 }}>{p.exactLocation}</div>}</div>
        <div className="card stat-card"><div className="stat-label"><Icon name="target" /> {tt("stat_interest")}</div><div className="stat-value" style={{ fontFamily: "'Fraunces',serif", fontSize: 19 }}>{p.sectorInterest[0] || tt("open")}</div></div>
        <div className="card stat-card"><div className="stat-label"><Icon name="scale" /> {tt("stat_profile_fit")}</div><div className="stat-value mono">{overallProfileFit != null ? overallProfileFit + "%" : "—"}</div></div>
      </div>

      {hasReco ? (
        <div className="feat-card" style={{ marginBottom: 24 }}>
          <div className="eyebrow" style={{ color: "var(--marigold)" }}><Icon name="sparkle" /> {tt("best_opportunity")}</div>
          <h3>{top.ideaName}</h3>
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", margin: "10px 0 4px" }}>
            <span className="badge" style={{ background: "rgba(255,255,255,.14)", color: "#fff" }}>{top.sector}</span>
            <span style={{ color: "#c7d3e2", fontFamily: "'IBM Plex Mono',monospace" }}>{top.estimatedBudget.display}</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 22, marginTop: 14, flexWrap: "wrap" }}>
            <div><div className="feat-score">{top.feasibilityScore}<span style={{ fontSize: 16, color: "#c7d3e2" }}>/10</span></div><div style={{ fontSize: 12, color: "#9fb3cc" }}>{tt("feasibility")}</div></div>
            <button className="btn btn-primary" onClick={() => openOpportunity(top.id)}>{tt("explore_opportunity")} <Icon name="arrow" /></button>
          </div>
        </div>
      ) : (
        <div className="card empty-state" style={{ marginBottom: 24 }}>
          <div className="oi"><Icon name="sparkle" /></div>
          <h3 style={{ fontSize: 20, marginBottom: 8 }}>{tt("no_opps_title")}</h3>
          <p style={{ color: "var(--ink-soft)", marginBottom: 20 }}>{tt("no_opps_sub")}</p>
          <button className="btn btn-primary" onClick={() => nav("discover")}><Icon name="sparkle" /> {tt("discover")}</button>
        </div>
      )}

      <div className="grid grid-2" style={{ marginBottom: 24 }}>
        <div className="card" style={{ padding: 26 }}>
          <div className="section-label"><Icon name="bank" /> {tt("gov_support_title")}</div>
          {hasReco ? (
            <>
              <h3 style={{ fontSize: 19, marginBottom: 14 }}>{tt("relevant_schemes", schemesForTop.length)}</h3>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                {schemesForTop.map((s) => <span key={s.id} className="badge badge-indigo">{s.name.split("—")[0].trim()}</span>)}
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => nav("schemes")}>{tt("explore_schemes")} <Icon name="arrow" /></button>
            </>
          ) : <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>{tt("gov_support_empty")}</p>}
        </div>
        <div className="card" style={{ padding: 26 }}>
          <div className="section-label"><Icon name="file" /> {tt("your_report")}</div>
          {report ? (
            <>
              <h3 style={{ fontSize: 19, marginBottom: 6 }}>{tt("report_ready_title")}</h3>
              <p style={{ color: "var(--ink-soft)", fontSize: 14, marginBottom: 16 }}>{tt("report_ready_sub")}</p>
              <button className="btn btn-secondary btn-sm" onClick={() => nav("myReport")}>{tt("view_report")} <Icon name="arrow" /></button>
            </>
          ) : hasReco ? (
            <>
              <p style={{ color: "var(--ink-soft)", fontSize: 14, marginBottom: 16 }}>{tt("report_cta_sub")}</p>
              <button className="btn btn-secondary btn-sm" onClick={() => nav("myReport")}>{tt("generate_report")} <Icon name="arrow" /></button>
            </>
          ) : <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>{tt("report_empty")}</p>}
        </div>
      </div>

      <div className="card" style={{ padding: 28 }}>
        <div className="section-label"><Icon name="map" /> {tt("your_journey")}</div>
        <Journey stages={["Discover", "Validate", "Fund", "Launch", "Grow"]} activeIdx={hasReco ? 1 : 0} />
      </div>
    </>
  );
}
