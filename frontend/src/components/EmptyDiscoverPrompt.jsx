import Icon from "./Icon";
import { useStore } from "../store/useStore";
import { t } from "../lib/i18n";

// Ported 1:1 from emptyDiscoverPrompt() in the original app.
export default function EmptyDiscoverPrompt() {
  const nav = useStore((s) => s.nav);
  const language = useStore((s) => s.profile.language);
  const tt = (key, ...args) => t(language, key, ...args);
  return (
    <div className="card empty-state">
      <div className="oi"><Icon name="bulb" /></div>
      <h3 style={{ fontSize: 20, marginBottom: 8 }}>{tt("no_opps_title2")}</h3>
      <p style={{ color: "var(--ink-soft)", marginBottom: 20 }}>{tt("no_opps_sub2")}</p>
      <button className="btn btn-primary" onClick={() => nav("discover")}><Icon name="sparkle" /> {tt("discover_ideas_btn")}</button>
    </div>
  );
}
