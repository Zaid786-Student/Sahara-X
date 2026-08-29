import Icon from "../components/Icon";
import EmptyDiscoverPrompt from "../components/EmptyDiscoverPrompt";
import { useStore } from "../store/useStore";
import { matchSchemes } from "../lib/format";

export default function OpportunityDetail() {
  const recommendations = useStore((s) => s.recommendations);
  const activeOpportunity = useStore((s) => s.activeOpportunity);
  const schemes = useStore((s) => s.schemes);
  const savedIdeas = useStore((s) => s.savedIdeas);
  const nav = useStore((s) => s.nav);
  const toggleSave = useStore((s) => s.toggleSave);

  const o = recommendations && recommendations.find((r) => r.id === activeOpportunity);
  if (!o) return <EmptyDiscoverPrompt />;

  const matched = matchSchemes(schemes, o.governmentSchemeCategories);
  const isSaved = savedIdeas.some((s) => s.id === o.id);

  return (
    <>
      <button className="btn-ghost btn-sm" onClick={() => nav("opportunities")} style={{ marginBottom: 14 }}>
        <Icon name="arrow" style={{ transform: "rotate(180deg)" }} /> Back to opportunities
      </button>
      <div className="topbar-page"><div>
        <span className="badge badge-indigo">{o.sector}</span>
        <h1 className="page-title" style={{ marginTop: 10 }}>{o.ideaName}</h1>
        <p className="page-sub">{o.description}</p>
      </div>
      <div className="score-ring" style={{ width: 72, height: 72, fontSize: 18 }}>{o.feasibilityScore}<br /><span style={{ fontSize: 10 }}>/10</span></div>
      </div>

      <div className="grid grid-3" style={{ margin: "24px 0" }}>
        <div className="card stat-card"><div className="stat-label">Budget Range</div><div className="stat-value mono">{o.estimatedBudget.display}</div></div>
        <div className="card stat-card"><div className="stat-label">Growth Potential</div><div className="stat-value" style={{ color: "var(--green)", fontFamily: "'Fraunces',serif" }}>{o.growthPotential}</div></div>
        <div className="card stat-card"><div className="stat-label">Timeline</div><div className="stat-value" style={{ fontSize: 17 }}>{o.roadmap?.estimatedTimeline || "4–8 weeks"}</div></div>
      </div>

      <div className="grid grid-2">
        <div className="card" style={{ padding: 26 }}>
          <div className="section-label"><Icon name="sparkle" /> WHY THIS FITS YOU</div>
          <ul className="bullet-list">{(o.whyThisFits || []).map((w, i) => <li key={i}><Icon name="check" />{w}</li>)}</ul>
          <div className="hr" style={{ margin: "18px 0" }}></div>
          <div className="section-label"><Icon name="chart" /> DEMAND SIGNAL</div>
          <p style={{ fontSize: 14, color: "var(--ink-soft)" }}>{o.demandSignal} <span className="tag-note"><Icon name="alert" />AI-informed estimate</span></p>
          {o.localityInsight && (
            <>
              <div className="hr" style={{ margin: "18px 0" }}></div>
              <div className="section-label"><Icon name="pin" /> DEMAND AROUND YOU</div>
              <p style={{ fontSize: 14, color: "var(--ink-soft)" }}>{o.localityInsight}</p>
            </>
          )}
        </div>
        <div className="card" style={{ padding: 26 }}>
          <div className="section-label"><Icon name="alert" /> RISK FACTORS</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
            {(o.riskFactors || []).map((r, i) => <span key={i} className="badge badge-rust"><Icon name="alert" />{r}</span>)}
          </div>
          <div className="hr" style={{ margin: "18px 0" }}></div>
          <div className="section-label" style={{ color: "var(--green)" }}><Icon name="leaf" /> FUTURE ADVICE</div>
          <p style={{ fontSize: 14, color: "var(--ink)" }}>{o.futureAdvice}</p>
        </div>
      </div>

      <div className="card" style={{ padding: 26, marginTop: 20 }}>
        <div className="section-label"><Icon name="bank" /> POTENTIALLY RELEVANT GOVERNMENT SUPPORT</div>
        <div className="grid grid-2" style={{ marginTop: 12 }}>
          {matched.map((s) => (
            <div key={s.id} className="card" style={{ padding: 16 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: "var(--indigo-text)" }}>{s.name}</div>
              <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 4 }}>{s.purpose}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card-actions" style={{ marginTop: 24 }}>
        <button className="btn btn-primary" onClick={() => nav("roadmap")}>See Business Roadmap <Icon name="arrow" /></button>
        <button className="btn btn-secondary" onClick={() => toggleSave(o.id)}>{isSaved ? "Saved ✓" : "Save Opportunity"}</button>
        <button className="btn-ghost" onClick={() => nav("myReport")}>View Full Report <Icon name="arrow" /></button>
      </div>
    </>
  );
}
