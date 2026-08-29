import Icon from "./Icon";
import { useStore } from "../store/useStore";
import { t } from "../lib/i18n";

// Ported 1:1 from schemeCard(s) in the original app, plus an optional
// `reason` (AI-suggestion rationale) and `aiPick` badge for the new
// AI-suggested schemes section.
export default function SchemeCard({ s, reason, aiPick }) {
  const language = useStore((st) => st.profile.language);
  const tt = (key, ...args) => t(language, key, ...args);
  return (
    <div className="card scheme-card" data-search={(s.name + " " + s.categories.join(" ")).toLowerCase()}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <h3 style={{ fontSize: 17 }}>{s.name}</h3>
        <span className={`badge ${s.verification === "verified" ? "badge-green" : "badge-marigold"}`}>
          <Icon name={s.verification === "verified" ? "check" : "alert"} />
          {s.verification === "verified" ? tt("verified") : tt("curated")}
        </span>
      </div>
      {aiPick && reason && (
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: "var(--marigold-dim)", border: "1px solid rgba(232,163,61,.3)", borderRadius: 10, padding: "10px 12px", margin: "10px 0" }}>
          <Icon name="sparkle" style={{ color: "var(--marigold)", flexShrink: 0, marginTop: 2 }} />
          <span style={{ fontSize: 13, color: "var(--ink)" }}>{reason}</span>
        </div>
      )}
      <p style={{ fontSize: 14, color: "var(--ink-soft)", margin: "10px 0" }}>{s.purpose}</p>
      <div className="hr" style={{ margin: "12px 0" }}></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13.5 }}>
        <div><b style={{ color: "var(--indigo-text)" }}>{tt("eligibility_label")}</b> <span style={{ color: "var(--ink-soft)" }}>{s.eligibility}</span></div>
        <div><b style={{ color: "var(--indigo-text)" }}>{tt("support_label")}</b> <span style={{ color: "var(--ink-soft)" }}>{s.supportType}</span></div>
        <div><b style={{ color: "var(--indigo-text)" }}>{tt("how_to_apply_label")}</b> <span style={{ color: "var(--ink-soft)" }}>{s.applicationPointer}</span></div>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 14 }}>
        {s.categories.slice(0, 4).map((c) => (
          <span key={c} className="badge badge-indigo" style={{ textTransform: "capitalize" }}>{c}</span>
        ))}
      </div>
    </div>
  );
}
