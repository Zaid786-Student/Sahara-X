import Icon from "../components/Icon";
import Journey from "../components/Journey";
import OpportunityCard from "../components/OpportunityCard";
import SchemeCard from "../components/SchemeCard";
import EmptyDiscoverPrompt from "../components/EmptyDiscoverPrompt";
import { useStore } from "../store/useStore";
import { fmtRupee, matchSchemes } from "../lib/format";
import { t } from "../lib/i18n";

const FIT_KEYS = ["fit_budget_fit", "fit_skill_fit", "fit_location_fit", "fit_market_potential", "fit_growth_potential"];
const FIT_DATA_KEYS = ["budgetFit", "skillFit", "locationFit", "marketPotential", "growthPotential"];

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
  const tt = (key, ...args) => t(profile.language, key, ...args);

  if (!recommendations) return <EmptyDiscoverPrompt />;

  if (reportLoading) {
    return (
      <div className="loading-wrap" style={{ minHeight: "60vh" }}>
        <div className="loading-card">
          <div className="eyebrow" style={{ justifyContent: "center" }}><Icon name="sparkle" /> SAHARA X</div>
          <h2 className="load-title" style={{ marginTop: 14 }}>{tt("report_loading_title")}</h2>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="card empty-state">
        <div className="oi"><Icon name="file" /></div>
        <h3 style={{ fontSize: 22 }}>{tt("report_empty_title")}</h3>
        <p style={{ color: "var(--ink-soft)", marginBottom: 22 }}>{tt("report_empty_sub")}</p>
        <button className="btn btn-primary" onClick={generateReport}><Icon name="sparkle" /> {tt("generate_my_report")}</button>
      </div>
    );
  }

  const r = report;
  const top = r.topOpportunity;
  const fit = fitBreakdown || {};
  const matched = matchSchemes(schemes, top.governmentSchemeCategories);
  const budgetGap = r.budgetAnalysis.estimatedStartupRequirement - r.budgetAnalysis.availableBudget;
  const dateLocale = profile.language === "हिंदी" ? "hi-IN" : "en-IN";

  return (
    <>
      <div className="report-cover fade-in">
        <div className="eyebrow" style={{ color: "var(--marigold)" }}><Icon name="file" /> {tt("report_eyebrow")}</div>
        <h1>{tt("report_h1")}</h1>
        <p style={{ maxWidth: 560 }}>{tt("report_lead")}</p>
        <div style={{ display: "flex", gap: 26, marginTop: 18, flexWrap: "wrap" }}>
          <div><div style={{ fontSize: 11.5, color: "#9fb3cc" }}>{tt("generated_label")}</div><div style={{ fontWeight: 600 }}>{new Date(r.generatedAt).toLocaleDateString(dateLocale, { day: "numeric", month: "long", year: "numeric" })}</div></div>
          <div><div style={{ fontSize: 11.5, color: "#9fb3cc" }}>{tt("profile_fit_label")}</div><div style={{ fontWeight: 600, color: "var(--marigold)" }}>{overallProfileFit}%</div></div>
        </div>
        <div className="card-actions" style={{ marginTop: 20 }}>
          <button className="btn btn-primary btn-sm" onClick={() => window.print()}><Icon name="file" /> {tt("download_report")}</button>
          <button className="btn-ghost btn-sm" style={{ color: "#fff" }} onClick={generateReport}>{tt("regenerate")}</button>
        </div>
      </div>

      <div className="report-section">
        <div className="sec-eyebrow">{tt("sec01")}</div>
        <h2>{tt("exec_summary_h2")}</h2>
        <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.7 }}>{r.executiveSummary}</p>
      </div>

      <div className="report-section">
        <div className="sec-eyebrow">{tt("sec02")}</div>
        <h2>{tt("your_profile_h2")}</h2>
        <div className="grid grid-4">
          <div className="card stat-card"><div className="stat-label">{tt("stat_location")}</div><div className="stat-value" style={{ fontFamily: "'Fraunces',serif", fontSize: 18 }}>{profile.locationType}</div></div>
          <div className="card stat-card"><div className="stat-label">{tt("stat_budget")}</div><div className="stat-value mono">{fmtRupee(profile.budget)}</div></div>
          <div className="card stat-card"><div className="stat-label">{tt("sector_interest")}</div><div className="stat-value" style={{ fontFamily: "'Fraunces',serif", fontSize: 16 }}>{profile.sectorInterest.join(", ") || tt("open")}</div></div>
          <div className="card stat-card"><div className="stat-label">{tt("stat_skills")}</div><div className="stat-value" style={{ fontFamily: "'Fraunces',serif", fontSize: 16 }}>{profile.skills.join(", ") || "—"}</div></div>
        </div>
      </div>

      <div className="report-section">
        <div className="sec-eyebrow">{tt("sec03")}</div>
        <h2>{tt("profile_fit_pct", overallProfileFit)} <span className="tag-note" style={{ fontSize: 12 }}>{tt("ai_estimated")}</span></h2>
        {FIT_KEYS.map((k, i) => (
          <div className="bar-row" key={k}>
            <div className="bar-label">{tt(k)}</div>
            <div className="bar-track"><div className="bar-fill" style={{ width: `${fit[FIT_DATA_KEYS[i]] || 0}%`, background: "var(--marigold)" }}></div></div>
            <div className="bar-val">{fit[FIT_DATA_KEYS[i]] || 0}</div>
          </div>
        ))}
      </div>

      <div className="report-section">
        <div className="sec-eyebrow">{tt("sec04")}</div>
        <h2>{tt("top_opps_h2")}</h2>
        <div className="grid grid-3">{recommendations.map((o) => <OpportunityCard key={o.id} o={o} />)}</div>
      </div>

      <div className="report-section">
        <div className="sec-eyebrow">{tt("sec05")}</div>
        <h2>{tt("comparison_h2")}</h2>
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
        <div className="sec-eyebrow">{tt("sec06")}</div>
        <h2>{tt("budget_analysis_h2")}</h2>
        <div className="grid grid-3">
          <div className="card stat-card"><div className="stat-label">{tt("available_budget")}</div><div className="stat-value mono">{fmtRupee(r.budgetAnalysis.availableBudget)}</div></div>
          <div className="card stat-card"><div className="stat-label">{tt("est_startup_req")}</div><div className="stat-value mono">{fmtRupee(r.budgetAnalysis.estimatedStartupRequirement)}</div></div>
          <div className="card stat-card"><div className="stat-label">{budgetGap > 0 ? tt("funding_gap") : tt("remaining_buffer")}</div><div className="stat-value mono" style={{ color: budgetGap > 0 ? "var(--rust)" : "var(--green)" }}>{fmtRupee(Math.abs(budgetGap))}</div></div>
        </div>
        <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 14 }}>{r.budgetAnalysis.note}</p>
        {budgetGap > 0 && <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 8 }}>{tt("funding_note")}</p>}
      </div>

      <div className="report-section">
        <div className="sec-eyebrow">{tt("sec07")}</div>
        <h2>{tt("overall_risk_h2")} <span className={`risk-pill risk-${r.riskAnalysis.overallRisk}`}>{r.riskAnalysis.overallRisk}</span></h2>
        <div className="grid grid-3" style={{ marginTop: 16 }}>
          {Object.entries(r.riskAnalysis.breakdown).map(([k, v]) => (
            <div className="card" style={{ padding: 16 }} key={k}>
              <div style={{ fontSize: 13, color: "var(--ink-soft)", textTransform: "capitalize", marginBottom: 8 }}>{k.replace(/([A-Z])/g, " $1")}</div>
              <span className={`risk-pill risk-${v}`}>{v}</span>
            </div>
          ))}
        </div>
        <p className="tag-note" style={{ marginTop: 14 }}><Icon name="alert" /> {tt("ai_estimated_risk")}</p>
      </div>

      <div className="report-section">
        <div className="sec-eyebrow">{tt("sec08")}</div>
        <h2>{tt("market_insights_h2")}</h2>
        <p style={{ fontSize: 14.5, color: "var(--ink-soft)", marginBottom: 8 }}><b style={{ color: "var(--indigo-text)" }}>{tt("location_colon")}</b> {r.marketInsights.locationContext}</p>
        <p style={{ fontSize: 14.5, color: "var(--ink-soft)", marginBottom: 8 }}><b style={{ color: "var(--indigo-text)" }}>{tt("demand_colon")}</b> {r.marketInsights.demandSignals}</p>
        <p style={{ fontSize: 14.5, color: "var(--ink-soft)", marginBottom: 8 }}><b style={{ color: "var(--indigo-text)" }}>{tt("seasonality_colon")}</b> {r.marketInsights.seasonality}</p>
        <p style={{ fontSize: 14.5, color: "var(--ink-soft)", marginBottom: 14 }}><b style={{ color: "var(--indigo-text)" }}>{tt("competition_colon")}</b> {r.marketInsights.competition}</p>
        <p className="tag-note"><Icon name="alert" /> {tt("ai_informed_note")}</p>
      </div>

      <div className="report-section">
        <div className="sec-eyebrow">{tt("sec09")}</div>
        <h2>{tt("relevant_schemes_h2")}</h2>
        <div className="grid grid-2">{matched.map((s) => <SchemeCard key={s.id} s={s} />)}</div>
      </div>

      <div className="report-section">
        <div className="sec-eyebrow">{tt("sec10")}</div>
        <h2>{tt("roadmap_h2")}</h2>
        <Journey stages={[tt("stage_validate"), tt("stage_setup"), tt("stage_register"), tt("stage_launch"), tt("stage_grow")]} activeIdx={1} />
        <button className="btn btn-secondary btn-sm" onClick={() => nav("roadmap")} style={{ marginTop: 16 }}>{tt("view_full_roadmap")} <Icon name="arrow" /></button>
      </div>

      <div className="report-section">
        <div className="sec-eyebrow">{tt("sec11")}</div>
        <h2>{tt("growth_outlook_h2")}</h2>
        <div className="grid grid-3">
          <div className="card" style={{ background: "var(--green-dim)", border: "none", padding: 18 }}><b style={{ color: "var(--green)" }}>{tt("year1_foundation")}</b><p style={{ fontSize: 13.5, marginTop: 6 }}>{tt("year1_foundation_desc")}</p></div>
          <div className="card" style={{ background: "var(--green-dim)", border: "none", padding: 18 }}><b style={{ color: "var(--green)" }}>{tt("year2_expansion")}</b><p style={{ fontSize: 13.5, marginTop: 6 }}>{tt("year2_expansion_desc")}</p></div>
          <div className="card" style={{ background: "var(--green-dim)", border: "none", padding: 18 }}><b style={{ color: "var(--green)" }}>{tt("year3_scaling")}</b><p style={{ fontSize: 13.5, marginTop: 6 }}>{top.futureAdvice}</p></div>
        </div>
      </div>

      <div className="report-section">
        <div className="sec-eyebrow">{tt("sec12")}</div>
        <h2>{tt("verdict_h2")}</h2>
        <div className="verdict-box">{r.aiVerdict}</div>
      </div>

      <div className="report-section">
        <div className="sec-eyebrow">{tt("sec13")}</div>
        <h2>{tt("next3_h2")}</h2>
        <div className="grid grid-3" style={{ marginBottom: 20 }}>
          {(r.actionPlan.next3Actions || []).map((a, i) => (
            <div className="card" style={{ padding: 18 }} key={i}>
              <div className="action-num">0{i + 1}</div>
              <p style={{ fontSize: 14, marginTop: 8 }}>{a}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-2">
          <div className="card" style={{ padding: 18 }}><b style={{ color: "var(--indigo-text)" }}>{tt("next30_days")}</b><p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 6 }}>{r.actionPlan.next30Days}</p></div>
          <div className="card" style={{ padding: 18 }}><b style={{ color: "var(--indigo-text)" }}>{tt("next90_days")}</b><p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 6 }}>{r.actionPlan.next90Days}</p></div>
        </div>
      </div>
      <div style={{ textAlign: "center", padding: "30px 0 10px" }}>
        <button className="btn btn-primary" onClick={() => window.print()}><Icon name="file" /> {tt("download_report")}</button>
      </div>
    </>
  );
}
