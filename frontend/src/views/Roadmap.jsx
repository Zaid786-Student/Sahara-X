import Icon from "../components/Icon";
import Journey from "../components/Journey";
import EmptyDiscoverPrompt from "../components/EmptyDiscoverPrompt";
import { useStore } from "../store/useStore";
import { t } from "../lib/i18n";

export default function Roadmap() {
  const recommendations = useStore((s) => s.recommendations);
  const activeOpportunity = useStore((s) => s.activeOpportunity);
  const language = useStore((s) => s.profile.language);
  const tt = (key, ...args) => t(language, key, ...args);

  const o = recommendations && (recommendations.find((r) => r.id === activeOpportunity) || recommendations[0]);
  if (!o) return <EmptyDiscoverPrompt />;

  const rm = o.roadmap || {};
  const steps = [
    [tt("step_validate_title"), "target", tt("step_validate_desc"), "1–2 " + (language === "हिंदी" ? "सप्ताह" : "weeks"), (rm.setupSteps || []).slice(0, 2)],
    [tt("step_setup_title"), "wrench", tt("step_setup_desc"), rm.estimatedTimeline || "2–4 " + (language === "हिंदी" ? "सप्ताह" : "weeks"), rm.setupSteps || []],
    [tt("step_register_title"), "file", tt("step_register_desc"), "1–2 " + (language === "हिंदी" ? "सप्ताह" : "weeks"), rm.licenses || [tt("step_register_default")]],
    [tt("step_launch_title"), "sparkle", tt("step_launch_desc"), tt("step_launch_week"), [tt("step_launch_item1"), tt("step_launch_item2")]],
    [tt("step_grow_title"), "leaf", tt("step_grow_desc"), tt("step_grow_ongoing"), rm.growthPlan || [tt("step_grow_item1"), tt("step_grow_item2")]],
  ];

  return (
    <>
      <div className="topbar-page"><div><h1 className="page-title">{tt("roadmap_title")}</h1><p className="page-sub">{tt("roadmap_sub")} <b style={{ color: "var(--indigo-text)" }}>{o.ideaName}</b></p></div></div>
      <div className="card" style={{ padding: "28px 28px 8px", margin: "18px 0 24px" }}>
        <Journey stages={steps.map((s) => s[0])} activeIdx={1} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {steps.map(([title, icon, desc, timeline, items], i) => (
          <div className="card" style={{ padding: 24, display: "flex", gap: 20 }} key={title}>
            <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 12, background: "var(--indigo)", color: "var(--marigold)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700 }}>0{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <h3 style={{ fontSize: 18 }}>{title}</h3>
                <span className="badge badge-marigold">{timeline}</span>
              </div>
              <p style={{ fontSize: 14, color: "var(--ink-soft)", margin: "8px 0 10px" }}>{desc}</p>
              <ul className="bullet-list">{items.map((it, idx) => <li key={idx}><Icon name="check" />{it}</li>)}</ul>
            </div>
          </div>
        ))}
      </div>
      <div className="card" style={{ padding: "20px 24px", marginTop: 18, background: "var(--card)" }}>
        <p className="tag-note"><Icon name="alert" /> {tt("requirements_vary_note")}</p>
      </div>

      <div className="card" style={{ padding: 28, marginTop: 24 }}>
        <div className="section-label" style={{ color: "var(--green)" }}><Icon name="leaf" /> {tt("growth_plan_label")}</div>
        <div className="grid grid-3" style={{ marginTop: 12 }}>
          <div className="card" style={{ background: "var(--green-dim)", border: "none", padding: 18 }}>
            <b style={{ color: "var(--green)" }}>{tt("rm_year1")}</b>
            <p style={{ fontSize: 13.5, color: "var(--ink)", marginTop: 6 }}>{tt("rm_year1_desc")}</p>
          </div>
          <div className="card" style={{ background: "var(--green-dim)", border: "none", padding: 18 }}>
            <b style={{ color: "var(--green)" }}>{tt("rm_year2")}</b>
            <p style={{ fontSize: 13.5, color: "var(--ink)", marginTop: 6 }}>{tt("rm_year2_desc")}</p>
          </div>
          <div className="card" style={{ background: "var(--green-dim)", border: "none", padding: 18 }}>
            <b style={{ color: "var(--green)" }}>{tt("rm_year3")}</b>
            <p style={{ fontSize: 13.5, color: "var(--ink)", marginTop: 6 }}>{tt("rm_year3_desc")}</p>
          </div>
        </div>
      </div>
    </>
  );
}
