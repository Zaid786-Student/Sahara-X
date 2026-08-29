import { useState } from "react";
import Icon from "../components/Icon";
import ThemeToggle from "../components/ThemeToggle";
import { useStore } from "../store/useStore";
import { t } from "../lib/i18n";

// Lightweight client-side demo auth: no backend user table exists yet, so
// this just gates access to onboarding/dashboard and remembers the user in
// localStorage. Swap loginUser/signupUser in useStore.js for real API calls
// (POST /api/auth/login etc.) whenever a backend auth endpoint is added.
export default function Login() {
  const mode = useStore((s) => s.authMode);
  const setAuthMode = useStore((s) => s.setAuthMode);
  const loginUser = useStore((s) => s.loginUser);
  const signupUser = useStore((s) => s.signupUser);
  const goLanding = useStore((s) => s.goLanding);
  const language = useStore((s) => s.profile.language);
  const tt = (key, ...args) => t(language, key, ...args);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isLogin = mode === "login";

  const submit = (e) => {
    e.preventDefault();
    if (isLogin) loginUser({ email, password });
    else signupUser({ name, email, password });
  };

  return (
    <div className="onboard-wrap">
      <div className="onboard-top"><div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="brand" style={{ fontSize: 17 }}><div className="brand-mark" style={{ width: 28, height: 28 }}><Icon name="logomark" /></div>Sahara X</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <ThemeToggle size="sm" />
          <button className="btn-ghost btn-sm" onClick={goLanding}><Icon name="close" /> {tt("close")}</button>
        </div>
      </div></div>
      <div className="onboard-body"><div className="onboard-card card fade-in" style={{ maxWidth: 420 }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}><Icon name="user" /> {isLogin ? tt("nav_login") : tt("nav_signup")}</div>
        <h2>{isLogin ? tt("login_title") : tt("signup_title")}</h2>
        <p className="onboard-sub">{isLogin ? tt("login_sub") : tt("signup_sub")}</p>

        <form onSubmit={submit} style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          {!isLogin && (
            <input
              type="text"
              className="text-input"
              placeholder={tt("name_label")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="email"
            className="text-input"
            placeholder={tt("email_label")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="text-input"
            placeholder={tt("password_label")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" style={{ marginTop: 6, justifyContent: "center" }}>
            {isLogin ? tt("login_btn") : tt("signup_btn")} <Icon name="arrow" />
          </button>
        </form>

        <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 18, textAlign: "center" }}>
          {isLogin ? (
            <a href="#" onClick={(e) => { e.preventDefault(); setAuthMode("signup"); }} style={{ color: "var(--indigo-text)", fontWeight: 600 }}>{tt("toggle_to_signup")}</a>
          ) : (
            <a href="#" onClick={(e) => { e.preventDefault(); setAuthMode("login"); }} style={{ color: "var(--indigo-text)", fontWeight: 600 }}>{tt("toggle_to_login")}</a>
          )}
        </p>
      </div></div>
    </div>
  );
}
