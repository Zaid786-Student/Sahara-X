import Icon from "../components/Icon";
import OpportunityCard from "../components/OpportunityCard";
import EmptyDiscoverPrompt from "../components/EmptyDiscoverPrompt";
import { useStore } from "../store/useStore";
import { t } from "../lib/i18n";

// Ported 1:1 from renderOpportunities() in the original app (route: "opportunities").
export default function MyOpportunities() {
  const recommendations = useStore((s) => s.recommendations);
  const compareSelection = useStore((s) => s.compareSelection);
  const discoverError = useStore((s) => s.discoverError);
  const nav = useStore((s) => s.nav);
  const language = useStore((s) => s.profile.language);
  const tt = (key, ...args) => t(language, key, ...args);

  if (!recommendations) return <EmptyDiscoverPrompt />;

  return (
    <>
      <div className="topbar-page">
        <div><h1 className="page-title">{tt("opp_page_title")}</h1><p className="page-sub">{tt("opp_page_sub")}</p></div>
        {compareSelection.length >= 2 && (
          <button className="btn btn-primary btn-sm" onClick={() => nav("compare")}>{tt("compare_btn", compareSelection.length)} <Icon name="arrow" /></button>
        )}
      </div>
      {discoverError && (
        <div className="card" style={{ padding: "14px 18px", background: "var(--rust-dim)", border: "none", marginBottom: 18, fontSize: 13.5, color: "var(--rust)", display: "flex", gap: 8, alignItems: "center" }}>
          <Icon name="alert" />{discoverError}
        </div>
      )}
      <div className="grid grid-3">
        {recommendations.map((o) => <OpportunityCard key={o.id} o={o} compare />)}
      </div>
    </>
  );
}
