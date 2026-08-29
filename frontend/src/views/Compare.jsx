import Icon from "../components/Icon";
import { useStore } from "../store/useStore";
import { matchSchemes } from "../lib/format";
import { t } from "../lib/i18n";

export default function Compare() {
  const compareSelection = useStore((s) => s.compareSelection);
  const recommendations = useStore((s) => s.recommendations);
  const profile = useStore((s) => s.profile);
  const schemes = useStore((s) => s.schemes);
  const nav = useStore((s) => s.nav);
  const tt = (key, ...args) => t(profile.language, key, ...args);

  const ids = compareSelection;
  const items = (recommendations || []).filter((o) => ids.includes(o.id));

  if (items.length < 2) {
    return (
      <div className="card empty-state">
        <div className="oi"><Icon name="scale" /></div>
        <h3 style={{ fontSize: 20 }}>{tt("compare_empty_title")}</h3>
        <p style={{ color: "var(--ink-soft)", marginBottom: 20 }}>{tt("compare_empty_sub")}</p>
        <button className="btn btn-primary" onClick={() => nav("opportunities")}>{tt("go_to_opportunities")}</button>
      </div>
    );
  }

  const rows = [
    [tt("budget_fit"), (o) => Math.max(20, 100 - (Math.abs(o.estimatedBudget.min - profile.budget) / Math.max(profile.budget, 1)) * 60)],
    [tt("card_feasibility"), (o) => o.feasibilityScore * 10],
    [tt("growth_potential"), (o) => ({ High: 90, Medium: 65, Low: 40 }[o.growthPotential] || 60)],
    [tt("gov_support_row"), (o) => Math.min(100, matchSchemes(schemes, o.governmentSchemeCategories).length * 25)],
    [tt("risk_level"), (o) => Math.max(15, 100 - (o.riskFactors || []).length * 22)],
  ];

  return (
    <>
      <div className="topbar-page"><div><h1 className="page-title">{tt("compare_title")}</h1><p className="page-sub">{tt("compare_sub", items.length)}</p></div></div>
      <div className="card" style={{ padding: 28, overflowX: "auto", marginTop: 10 }}>
        <table className="compare-table">
          <thead><tr><th>{tt("criteria")}</th>{items.map((o) => <th key={o.id}>{o.ideaName}</th>)}</tr></thead>
          <tbody>
            <tr><td>{tt("sector")}</td>{items.map((o) => <td key={o.id}>{o.sector}</td>)}</tr>
            <tr><td>{tt("card_budget")}</td>{items.map((o) => <td key={o.id} className="mono">{o.estimatedBudget.display}</td>)}</tr>
            {rows.map(([label, fn]) => (
              <tr key={label}>
                <td>{label}</td>
                {items.map((o) => {
                  const v = Math.round(fn(o));
                  return (
                    <td key={o.id}>
                      <div className="bar-row" style={{ marginBottom: 0 }}>
                        <div className="bar-track" style={{ width: 80 }}><div className="bar-fill" style={{ width: `${v}%`, background: "var(--indigo)" }}></div></div>
                        <span className="bar-val">{v}</span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
