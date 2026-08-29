import Icon from "../components/Icon";
import Journey from "../components/Journey";
import OpportunityCard from "../components/OpportunityCard";
import SchemeCard from "../components/SchemeCard";
import EmptyDiscoverPrompt from "../components/EmptyDiscoverPrompt";
import { useStore } from "../store/useStore";
import { fmtRupee, matchSchemes } from "../lib/format";

const FIT_KEYS = ["budgetFit", "skillFit", "locationFit", "marketPotential", "growthPotential"];

function labelize(k) {
  return k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

export default function Report() {
  const recommendations = useStore((s) => s.recommendations);
  const report = useStore((s) => s.report);
  const reportLoading = useStore((s) => s.reportLoading);
  const overallProfileFit = useStore((s) => s.overallProfileFit);
  const fitBreakdown = useStore((s) => s.fitBreakdown);
  const profile = useStore((s) => s.profile);
  const schemes = useStore((s) => s.schemes);
  const generateReport = useStore((s) => s.generateReport);
  const nav = useStore((s) => s.nav);

  if (!recommendations) return <EmptyDiscoverPrompt />;

  if (reportLoading) {
    return (
      <div className="loading-wrap" style={{ minHeight: "60vh" }}>
        <div className="loading-card">
          <div className="eyebrow" style={{ justifyContent: "center" }}><Icon name="sparkle" /> SAHARA X</div>
          <h2 className="load-title" style={{ marginTop: 14 }}>Building your complete report...</h2>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="card empty-state">
        <div className="oi"><Icon name="file" /></div>
        <h3 style={{ fontSize: 22 }}>Your report isn't generated yet</h3>
        <p style={{ color: "var(--ink-soft)", marginBottom: 22 }}>Sahara X will synthesize your profile, opportunities, budget, risk and scheme matches into one complete report.</p>
        <button className="btn btn-primary" onClick={generateReport}><Icon name="sparkle" /> Generate My Report</button>
      </div>
    );
  }

  const r = report;
  const top = r.topOpportunity;
  const fit = fitBreakdown || {};
  const matched = matchSchemes(schemes, top.governmentSchemeCategories);
  const budgetGap = r.budgetAnalysis.estimatedStartupRequirement - r.budgetAnalysis.availableBudget;

  return (
    <>
      <div className="report-cover fade-in">
        <div className="eyebrow" style={{ color: "var(--marigold)" }}><Icon name="file" /> PERSONALIZED REPORT</div>
        <h1>Your Sahara X Opportunity Report</h1>
        <p style={{ maxWidth: 560 }}>A personalized analysis based on your budget, skills, interests and local context.</p>
        <div style={{ display: "flex", gap: 26, marginTop: 18, flexWrap: "wrap" }}>
          <div><div style={{ fontSize: 11.5, color: "#9fb3cc" }}>GENERATED</div><div style={{ fontWeight: 600 }}>{new Date(r.generatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</div></div>
          <div><div style={{ fontSize: 11.5, color: "#9fb3cc" }}>PROFILE FIT</div><div style={{ fontWeight: 600, color: "var(--marigold)" }}>{overallProfileFit}%</div></div>
        </div>
        <div className="card-actions" style={{ marginTop: 20 }}>
          <button className="btn btn-primary btn-sm" onClick={() => window.print()}><Icon name="file" /> Download Report</button>
          <button className="btn-ghost btn-sm" style={{ color: "#fff" }} onClick={generateReport}>Regenerate</button>
        </div>
      </div>

      <div className="report-section">
        <div className="sec-eyebrow">01 · EXECUTIVE SUMMARY</div>
        <h2>AI Executive Summary</h2>
        <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.7 }}>{r.executiveSummary}</p>
      </div>

      <div className="report-section">
        <div className="sec-eyebrow">02 · ENTREPRENEUR PROFILE</div>
        <h2>Your Profile</h2>
        <div className="grid grid-4">
          <div className="card stat-card"><div className="stat-label">Location</div><div className="stat-value" style={{ fontFamily: "'Fraunces',serif", fontSize: 18 }}>{profile.locationType}</div>{profile.exactLocation && <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 4 }}>{profile.exactLocation}</div>}</div>
          <div className="card stat-card"><div className="stat-label">Budget</div><div className="stat-value mono">{fmtRupee(profile.budget)}</div></div>
          <div className="card stat-card"><div className="stat-label">Sector Interest</div><div className="stat-value" style={{ fontFamily: "'Fraunces',serif", fontSize: 16 }}>{profile.sectorInterest.join(", ") || "Open"}</div></div>
          <div className="card stat-card"><div className="stat-label">Skills</div><div className="stat-value" style={{ fontFamily: "'Fraunces',serif", fontSize: 16 }}>{profile.skills.join(", ") || "—"}</div></div>
        </div>
      </div>

      <div className="report-section">
        <div className="sec-eyebrow">03 · OPPORTUNITY SCORE</div>
        <h2>{overallProfileFit}% Profile Fit <span className="tag-note" style={{ fontSize: 12 }}>AI-estimated</span></h2>
        {FIT_KEYS.map((k) => (
          <div className="bar-row" key={k}>
            <div className="bar-label">{labelize(k)}</div>
            <div className="bar-track"><div className="bar-fill" style={{ width: `${fit[k] || 0}%`, background: "var(--marigold)" }}></div></div>
            <div className="bar-val">{fit[k] || 0}</div>
          </div>
        ))}
      </div>

      <div className="report-section">
        <div className="sec-eyebrow">04 · TOP OPPORTUNITIES</div>
        <h2>Top Opportunities</h2>
        <div className="grid grid-3">{recommendations.map((o) => <OpportunityCard key={o.id} o={o} />)}</div>
      </div>

      <div className="report-section">
        <div className="sec-eyebrow">05 · OPPORTUNITY COMPARISON</div>
        <h2>Comparison</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {recommendations.map((o) => (
            <div key={o.id}>
              <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 4 }}>{o.ideaName}</div>
              <div className="bar-row">
                <div className="bar-track"><div className="bar-fill" style={{ width: `${o.feasibilityScore * 10}%`, background: "var(--indigo)" }}></div></div>
                <div className="bar-val">{o.feasibilityScore}/10</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="report-section">
        <div className="sec-eyebrow">06 · BUDGET ANALYSIS</div>
        <h2>Budget Analysis</h2>
        <div className="grid grid-3">
          <div className="card stat-card"><div className="stat-label">Available Budget</div><div className="stat-value mono">{fmtRupee(r.budgetAnalysis.availableBudget)}</div></div>
          <div className="card stat-card"><div className="stat-label">Estimated Startup Requirement</div><div className="stat-value mono">{fmtRupee(r.budgetAnalysis.estimatedStartupRequirement)}</div></div>
          <div className="card stat-card"><div className="stat-label">{budgetGap > 0 ? "Funding Gap" : "Remaining Buffer"}</div><div className="stat-value mono" style={{ color: budgetGap > 0 ? "var(--rust)" : "var(--green)" }}>{fmtRupee(Math.abs(budgetGap))}</div></div>
        </div>
        <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 14 }}>{r.budgetAnalysis.note}</p>
        {budgetGap > 0 && <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 8 }}>Consider the potentially relevant funding options below — Sahara X does not guarantee approval of any loan or subsidy.</p>}
      </div>

      <div className="report-section">
        <div className="sec-eyebrow">07 · RISK ANALYSIS</div>
        <h2>Overall Risk <span className={`risk-pill risk-${r.riskAnalysis.overallRisk}`}>{r.riskAnalysis.overallRisk}</span></h2>
        <div className="grid grid-3" style={{ marginTop: 16 }}>
          {Object.entries(r.riskAnalysis.breakdown).map(([k, v]) => (
            <div className="card" style={{ padding: 16 }} key={k}>
              <div style={{ fontSize: 13, color: "var(--ink-soft)", textTransform: "capitalize", marginBottom: 8 }}>{k.replace(/([A-Z])/g, " $1")}</div>
              <span className={`risk-pill risk-${v}`}>{v}</span>
            </div>
          ))}
        </div>
        <p className="tag-note" style={{ marginTop: 14 }}><Icon name="alert" /> AI-estimated risk factors</p>
      </div>

      <div className="report-section">
        <div className="sec-eyebrow">08 · MARKET INSIGHTS</div>
        <h2>Market Insights</h2>
        <p style={{ fontSize: 14.5, color: "var(--ink-soft)", marginBottom: 8 }}><b style={{ color: "var(--indigo-text)" }}>Location:</b> {r.marketInsights.locationContext}</p>
        <p style={{ fontSize: 14.5, color: "var(--ink-soft)", marginBottom: 8 }}><b style={{ color: "var(--indigo-text)" }}>Demand:</b> {r.marketInsights.demandSignals}</p>
        <p style={{ fontSize: 14.5, color: "var(--ink-soft)", marginBottom: 8 }}><b style={{ color: "var(--indigo-text)" }}>Seasonality:</b> {r.marketInsights.seasonality}</p>
        <p style={{ fontSize: 14.5, color: "var(--ink-soft)", marginBottom: 8 }}><b style={{ color: "var(--indigo-text)" }}>Competition:</b> {r.marketInsights.competition}</p>
        {r.marketInsights.localConsiderations && (
          <p style={{ fontSize: 14.5, color: "var(--ink-soft)", marginBottom: 14 }}><b style={{ color: "var(--indigo-text)" }}>Local considerations:</b> {r.marketInsights.localConsiderations}</p>
        )}
        <p className="tag-note"><Icon name="alert" /> AI-informed assessment — not verified market statistics.</p>
      </div>

      {r.localityAnalysis && (
        <div className="report-section">
          <div className="sec-eyebrow">08b · LOCALITY DEMAND ANALYSIS</div>
          <h2>How This Idea Fits {r.localityAnalysis.areaName}</h2>
          <div className="card" style={{ padding: 22, background: "linear-gradient(135deg, rgba(156,140,255,.1), rgba(232,163,61,.06))" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
              <div className="eyebrow" style={{ color: "var(--marigold)" }}><Icon name="pin" /> {r.localityAnalysis.areaName}</div>
              <span className={`badge ${r.localityAnalysis.confidence === "High" ? "badge-green" : r.localityAnalysis.confidence === "Low" ? "badge-rust" : "badge-marigold"}`}>
                {r.localityAnalysis.confidence} confidence
              </span>
            </div>
            <p style={{ fontSize: 14.5, color: "var(--ink)", marginBottom: 12 }}><b style={{ color: "var(--indigo-text)" }}>What's likely in demand around you:</b> {r.localityAnalysis.whatsInDemandAroundYou}</p>
            <p style={{ fontSize: 14.5, color: "var(--ink)" }}><b style={{ color: "var(--indigo-text)" }}>How this idea fits that demand:</b> {r.localityAnalysis.howThisIdeaFitsLocally}</p>
          </div>
          <p className="tag-note" style={{ marginTop: 12 }}><Icon name="alert" /> AI-informed reasoning about the general profile of this area — not verified local market data. Confirm demand directly before investing.</p>
        </div>
      )}

      <div className="report-section">
        <div className="sec-eyebrow">09 · GOVERNMENT SCHEME MATCH</div>
        <h2>Potentially Relevant Schemes</h2>
        <div className="grid grid-2">{matched.map((s) => <SchemeCard key={s.id} s={s} />)}</div>
      </div>

      <div className="report-section">
        <div className="sec-eyebrow">10 · BUSINESS ROADMAP</div>
        <h2>Roadmap</h2>
        <Journey stages={["Validate", "Setup", "Register", "Launch", "Grow"]} activeIdx={1} />
        <button className="btn btn-secondary btn-sm" onClick={() => nav("roadmap")} style={{ marginTop: 16 }}>View Full Roadmap <Icon name="arrow" /></button>
      </div>

      <div className="report-section">
        <div className="sec-eyebrow">11 · GROWTH OUTLOOK</div>
        <h2>Growth Outlook</h2>
        <div className="grid grid-3">
          <div className="card" style={{ background: "var(--green-dim)", border: "none", padding: 18 }}><b style={{ color: "var(--green)" }}>Year 1 — Foundation</b><p style={{ fontSize: 13.5, marginTop: 6 }}>Validate and establish your first customers.</p></div>
          <div className="card" style={{ background: "var(--green-dim)", border: "none", padding: 18 }}><b style={{ color: "var(--green)" }}>Year 2 — Expansion</b><p style={{ fontSize: 13.5, marginTop: 6 }}>Grow capacity and offerings.</p></div>
          <div className="card" style={{ background: "var(--green-dim)", border: "none", padding: 18 }}><b style={{ color: "var(--green)" }}>Year 3 — Scaling</b><p style={{ fontSize: 13.5, marginTop: 6 }}>{top.futureAdvice}</p></div>
        </div>
      </div>

      <div className="report-section">
        <div className="sec-eyebrow">12 · AI VERDICT</div>
        <h2>Sahara X Verdict</h2>
        <div className="verdict-box">{r.aiVerdict}</div>
      </div>

      <div className="report-section">
        <div className="sec-eyebrow">13 · ACTION PLAN</div>
        <h2>Your Next 3 Actions</h2>
        <div className="grid grid-3" style={{ marginBottom: 20 }}>
          {(r.actionPlan.next3Actions || []).map((a, i) => (
            <div className="card" style={{ padding: 18 }} key={i}>
              <div className="action-num">0{i + 1}</div>
              <p style={{ fontSize: 14, marginTop: 8 }}>{a}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-2">
          <div className="card" style={{ padding: 18 }}><b style={{ color: "var(--indigo-text)" }}>Next 30 Days</b><p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 6 }}>{r.actionPlan.next30Days}</p></div>
          <div className="card" style={{ padding: 18 }}><b style={{ color: "var(--indigo-text)" }}>Next 90 Days</b><p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 6 }}>{r.actionPlan.next90Days}</p></div>
        </div>
      </div>
      <div style={{ textAlign: "center", padding: "30px 0 10px" }}>
        <button className="btn btn-primary" onClick={() => window.print()}><Icon name="file" /> Download Report</button>
      </div>
    </>
  );
}
