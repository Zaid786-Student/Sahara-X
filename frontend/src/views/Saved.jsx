import { useStore } from "../store/useStore";
import Icon from "../components/Icon";
import { t } from "../lib/i18n";

// Ported 1:1 from renderSaved() in the original app.
export default function Saved() {
  const savedIdeas = useStore((s) => s.savedIdeas);
  const nav = useStore((s) => s.nav);
  const openOpportunity = useStore((s) => s.openOpportunity);
  const removeSaved = useStore((s) => s.removeSaved);
  const language = useStore((s) => s.profile.language);
  const tt = (key, ...args) => t(language, key, ...args);
  const dateLocale = language === "हिंदी" ? "hi-IN" : "en-IN";

  if (savedIdeas.length === 0) {
    return (
      <>
        <div className="topbar-page"><div><h1 className="page-title">{tt("saved_title")}</h1></div></div>
        <div className="card empty-state">
          <div className="oi"><Icon name="bookmark" /></div>
          <h3 style={{ fontSize: 20 }}>{tt("saved_empty_title")}</h3>
          <p style={{ color: "var(--ink-soft)", marginBottom: 20 }}>{tt("saved_empty_sub")}</p>
          <button className="btn btn-primary" onClick={() => nav("opportunities")}>{tt("browse_opportunities")}</button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="topbar-page">
        <div>
          <h1 className="page-title">{tt("saved_title")}</h1>
          <p className="page-sub">{tt("saved_count", savedIdeas.length)}</p>
        </div>
      </div>
      <div className="grid grid-3" style={{ marginTop: 16 }}>
        {savedIdeas.map((o) => (
          <div className="card" style={{ padding: 24 }} key={o.id}>
            <span className="badge badge-indigo">{o.sector}</span>
            <h3 style={{ fontSize: 18, marginTop: 10 }}>{o.ideaName}</h3>
            <div className="fin-row">
              <div className="fin-item"><div className="l">{tt("card_budget")}</div><div className="v">{o.estimatedBudget.display}</div></div>
              <div className="fin-item"><div className="l">{tt("card_feasibility")}</div><div className="v">{o.feasibilityScore}/10</div></div>
            </div>
            <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: "10px 0" }}>{tt("saved_on")} {new Date(o.savedAt).toLocaleDateString(dateLocale)}</p>
            <div className="card-actions">
              <button className="btn btn-secondary btn-sm" onClick={() => openOpportunity(o.id)}>{tt("explore")}</button>
              <button className="btn-ghost btn-sm" style={{ color: "var(--rust)" }} onClick={() => removeSaved(o.id)}>{tt("remove")}</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
