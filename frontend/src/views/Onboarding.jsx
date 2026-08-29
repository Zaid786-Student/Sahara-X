import Icon from "../components/Icon";
import ThemeToggle from "../components/ThemeToggle";
import { useStore } from "../store/useStore";
import { SECTORS, SKILLS } from "../lib/data";
import { fmtRupee } from "../lib/format";
import { t } from "../lib/i18n";

const TOTAL_STEPS = 5;
// Order: 1 language (asked first, so every step after it renders in the
// chosen language) -> 2 location -> 3 budget -> 4 sectors -> 5 skills.

export default function Onboarding() {
  const p = useStore((s) => s.profile);
  const step = useStore((s) => s.onboardStep);
  const setLocation = useStore((s) => s.setLocation);
  const setExactLocation = useStore((s) => s.setExactLocation);
  const setBudget = useStore((s) => s.setBudget);
  const toggleSector = useStore((s) => s.toggleSector);
  const clearSectors = useStore((s) => s.clearSectors);
  const toggleSkill = useStore((s) => s.toggleSkill);
  const setLang = useStore((s) => s.setLang);
  const nextStep = useStore((s) => s.nextStep);
  const prevStep = useStore((s) => s.prevStep);
  const submitOnboarding = useStore((s) => s.submitOnboarding);
  const goLanding = useStore((s) => s.goLanding);

  const lang = p.language; // "English" | "हिंदी" — drives t(lang, key) below
  const tt = (key, ...args) => t(lang, key, ...args);

  let body = null;
  if (step === 1) {
    body = (
      <>
        <h2>{tt("lang_title")}</h2>
        <p className="onboard-sub">{tt("lang_sub")}</p>
        <div className="lang-row">
          <div className={`opt-tile lang-tile ${p.language === "English" ? "sel" : ""}`} onClick={() => setLang("English")}><div className="t">English</div></div>
          <div className={`opt-tile lang-tile ${p.language === "हिंदी" ? "sel" : ""}`} onClick={() => setLang("हिंदी")}><div className="t hi">हिंदी</div></div>
        </div>
        <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 16 }}>{tt("lang_note")}</p>
      </>
    );
  } else if (step === 2) {
    const LOCS = [
      ["Rural", tt("loc_rural")],
      ["Semi-Urban", tt("loc_semiurban")],
      ["Urban", tt("loc_urban")],
    ];
    body = (
      <>
        <h2>{tt("loc_title")}</h2>
        <p className="onboard-sub">{tt("loc_sub")}</p>
        <div className="option-grid">
          {LOCS.map(([loc, label]) => (
            <div key={loc} className={`opt-tile ${p.locationType === loc ? "sel" : ""}`} onClick={() => setLocation(loc)}>
              <div className="oi"><Icon name="pin" /></div>
              <div className="t">{label}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-soft)", display: "block", marginBottom: 8 }}>
            {tt("exact_location_label")}
          </label>
          <input
            type="text"
            className="text-input"
            placeholder={tt("exact_location_placeholder")}
            value={p.exactLocation}
            onChange={(e) => setExactLocation(e.target.value)}
          />
          <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 8 }}>{tt("exact_location_note")}</p>
        </div>
      </>
    );
  } else if (step === 3) {
    body = (
      <>
        <h2>{tt("budget_title")}</h2>
        <p className="onboard-sub">{tt("budget_sub")}</p>
        <div className="budget-display mono">{fmtRupee(p.budget)}</div>
        <input type="range" min="10000" max="1000000" step="5000" value={p.budget} onChange={(e) => setBudget(parseInt(e.target.value, 10))} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--ink-soft)", marginTop: 6 }}>
          <span>₹10,000</span><span>₹10,00,000+</span>
        </div>
        <div style={{ marginTop: 20 }}>
          <input
            type="number"
            className="text-input"
            placeholder={tt("budget_placeholder")}
            value={p.budget}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!isNaN(v) && v > 0) setBudget(v);
            }}
          />
        </div>
      </>
    );
  } else if (step === 4) {
    body = (
      <>
        <h2>{tt("sector_title")}</h2>
        <p className="onboard-sub">{tt("sector_sub")}</p>
        <div className="chip-grid">
          <div className={`chip-toggle ${p.sectorInterest.length === 0 ? "sel" : ""}`} onClick={clearSectors}>{tt("sector_none")}</div>
          {SECTORS.map((s) => (
            <div key={s} className={`chip-toggle ${p.sectorInterest.includes(s) ? "sel" : ""}`} onClick={() => toggleSector(s)}>{s}</div>
          ))}
        </div>
      </>
    );
  } else if (step === 5) {
    body = (
      <>
        <h2>{tt("skills_title")}</h2>
        <p className="onboard-sub">{tt("skills_sub")}</p>
        <div className="chip-grid">
          {SKILLS.map((s) => (
            <div key={s} className={`chip-toggle ${p.skills.includes(s) ? "sel" : ""}`} onClick={() => toggleSkill(s)}>{s}</div>
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="onboard-wrap">
      <div className="onboard-top"><div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="brand" style={{ fontSize: 17 }}><div className="brand-mark" style={{ width: 28, height: 28 }}><Icon name="logomark" /></div>Sahara X</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <ThemeToggle size="sm" />
          <button className="btn-ghost btn-sm" onClick={goLanding}><Icon name="close" /> {tt("close")}</button>
        </div>
      </div></div>
      <div className="onboard-body"><div className="onboard-card card fade-in">
        <div className="step-track">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => <span key={i} className={i < step ? "on" : ""}></span>)}
        </div>
        <div className="eyebrow" style={{ marginBottom: 14 }}>{tt("step_of", step, TOTAL_STEPS)}</div>
        {body}
        <div className="onboard-nav">
          {step > 1 ? (
            <button className="btn-ghost" onClick={prevStep}><Icon name="arrow" style={{ transform: "rotate(180deg)" }} /> {tt("back")}</button>
          ) : <span></span>}
          {step < TOTAL_STEPS ? (
            <button className="btn btn-primary" onClick={nextStep}>{tt("continue")} <Icon name="arrow" /></button>
          ) : (
            <button className="btn btn-primary" onClick={submitOnboarding}><Icon name="sparkle" /> {tt("discover")}</button>
          )}
        </div>
      </div></div>
    </div>
  );
}
