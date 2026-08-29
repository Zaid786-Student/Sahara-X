import { useState } from "react";
import ThemeToggle from "../components/ThemeToggle";
import { useStore } from "../store/useStore";
import { t } from "../lib/i18n";

// Ported 1:1 from renderSettings() in the original app. The Notifications
// and "Voice by default" switches are purely cosmetic in the original
// (el.classList.toggle('on'), no state write) — reproduced here with local
// component state so their on/off behavior matches exactly.
function Switch({ defaultOn = false }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className={`switch ${on ? "on" : ""}`} onClick={() => setOn((v) => !v)}>
      <div className="knob"></div>
    </div>
  );
}

export default function Settings() {
  const clearData = useStore((s) => s.clearData);
  const logoutUser = useStore((s) => s.logoutUser);
  const authed = useStore((s) => s.authed);
  const authUser = useStore((s) => s.authUser);
  const language = useStore((s) => s.profile.language);
  const tt = (key, ...args) => t(language, key, ...args);

  return (
    <>
      <div className="topbar-page"><div><h1 className="page-title">{tt("settings_title")}</h1></div></div>
      <div className="card fade-in" style={{ padding: "8px 28px", maxWidth: 600, marginTop: 16 }}>
        {authed && (
          <div className="toggle-row">
            <div>
              <b>{tt("account_label")}</b>
              <p style={{ fontSize: 13, color: "var(--ink-soft)" }}>{tt("signed_in_as")} {authUser?.email || authUser?.name}.</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={logoutUser}>{tt("log_out")}</button>
          </div>
        )}
        <div className="toggle-row">
          <div>
            <b>{tt("dark_theme_label")}</b>
            <p style={{ fontSize: 13, color: "var(--ink-soft)" }}>{tt("dark_theme_sub")}</p>
          </div>
          <ThemeToggle />
        </div>
        <div className="toggle-row">
          <div>
            <b>{tt("notifications_label")}</b>
            <p style={{ fontSize: 13, color: "var(--ink-soft)" }}>{tt("notifications_sub")}</p>
          </div>
          <Switch defaultOn />
        </div>
        <div className="toggle-row">
          <div>
            <b>{tt("voice_default_label")}</b>
            <p style={{ fontSize: 13, color: "var(--ink-soft)" }}>{tt("voice_default_sub")}</p>
          </div>
          <Switch />
        </div>
        <div className="toggle-row" style={{ borderBottom: "none" }}>
          <div>
            <b>{tt("data_controls_label")}</b>
            <p style={{ fontSize: 13, color: "var(--ink-soft)" }}>{tt("data_controls_sub")}</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={clearData}>{tt("clear_my_data")}</button>
        </div>
      </div>
    </>
  );
}
