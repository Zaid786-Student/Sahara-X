import Icon from "./Icon";
import { useStore } from "../store/useStore";
import { matchSchemes } from "../lib/format";
import { t } from "../lib/i18n";

// Ported 1:1 from opportunityCard(o, opts) in the original app.
export default function OpportunityCard({ o, compare = false }) {
  const schemes = useStore((s) => s.schemes);
  const savedIdeas = useStore((s) => s.savedIdeas);
  const compareSelection = useStore((s) => s.compareSelection);
  const openOpportunity = useStore((s) => s.openOpportunity);
  const toggleSave = useStore((s) => s.toggleSave);
  const toggleCompare = useStore((s) => s.toggleCompare);
  const language = useStore((s) => s.profile.language);
  const tt = (key, ...args) => t(language, key, ...args);

  const matched = matchSchemes(schemes, o.governmentSchemeCategories);
  const isSaved = savedIdeas.some((s) => s.id === o.id);

  return (
    <div className="card opp-card fade-in">
      <div className="opp-head">
        <div>
          <span className="badge badge-indigo">{o.sector}</span>
          <h3 className="opp-title" style={{ marginTop: 8 }}>{o.ideaName}</h3>
        </div>
        <div className="score-ring">
          {o.feasibilityScore}
          <br />
          <span style={{ fontSize: 9, fontWeight: 500 }}>/10</span>
        </div>
      </div>
      <p style={{ color: "var(--ink-soft)", fontSize: 14.5 }}>{o.description}</p>
      <div>
        <div className="section-label"><Icon name="sparkle" /> {tt("why_fits")}</div>
        <ul className="bullet-list">
          {(o.whyThisFits || []).map((w, i) => (
            <li key={i}><Icon name="check" />{w}</li>
          ))}
        </ul>
      </div>
      <div className="fin-row">
        <div className="fin-item"><div className="l">{tt("card_budget")}</div><div className="v">{o.estimatedBudget.display}</div></div>
        <div className="fin-item"><div className="l">{tt("card_feasibility")}</div><div className="v">{o.feasibilityScore} / 10</div></div>
        <div className="fin-item"><div className="l">{tt("card_growth")}</div><div className="v" style={{ color: "var(--green)" }}>{o.growthPotential}</div></div>
      </div>
      <div>
        <div className="section-label"><Icon name="bank" /> {tt("gov_support_card")}</div>
        <p style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>
          {tt("schemes_relevant", matched.length)}{" "}
          <span style={{ color: "var(--indigo-text)", fontWeight: 600 }}>{matched[0] ? matched[0].name.split("—")[0].trim() : ""}</span>
        </p>
      </div>
      <div>
        <div className="section-label"><Icon name="alert" /> {tt("risk_factors")}</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(o.riskFactors || []).map((r, i) => (
            <span key={i} className="badge badge-rust"><Icon name="alert" />{r}</span>
          ))}
        </div>
      </div>
      <div className="card" style={{ background: "var(--green-dim)", border: "none", padding: "14px 16px" }}>
        <div className="tag-note" style={{ color: "var(--green)", fontStyle: "normal", fontWeight: 600, marginBottom: 4 }}>
          <Icon name="leaf" /> {tt("future_advice_label")}
        </div>
        <p style={{ fontSize: 13.5, color: "var(--ink)" }}>{o.futureAdvice}</p>
      </div>
      <div className="card-actions">
        <button className="btn btn-primary btn-sm" onClick={() => openOpportunity(o.id)}>{tt("explore")} <Icon name="arrow" /></button>
        <button className="btn btn-secondary btn-sm" onClick={() => toggleSave(o.id)}>{isSaved ? tt("saved_check") : tt("save")}</button>
        {compare && (
          <button className="btn-ghost btn-sm" onClick={() => toggleCompare(o.id)}>
            {compareSelection.includes(o.id) ? tt("remove_compare") : tt("add_compare")}
          </button>
        )}
      </div>
    </div>
  );
}
