import Icon from "../components/Icon";
import { useStore } from "../store/useStore";
import { t } from "../lib/i18n";

export default function Loading() {
  const loadingChecks = useStore((s) => s.loadingChecks);
  const language = useStore((s) => s.profile.language);
  const tt = (key, ...args) => t(language, key, ...args);
  const STEPS = [tt("load_step_1"), tt("load_step_2"), tt("load_step_3"), tt("load_step_4")];
  return (
    <div className="loading-wrap"><div className="loading-card fade-in">
      <div className="eyebrow" style={{ justifyContent: "center" }}><Icon name="sparkle" /> SAHARA X</div>
      <h2 className="load-title" style={{ marginTop: 14 }}>{tt("loading_title")}</h2>
      <div className="check-list">
        {STEPS.map((s, i) => (
          <div key={s} className={`check-item ${i < loadingChecks ? "done" : i === loadingChecks ? "active" : ""}`}>
            <div className="check-mark">{i < loadingChecks ? <Icon name="check" /> : ""}</div>
            {s}
          </div>
        ))}
      </div>
    </div></div>
  );
}
