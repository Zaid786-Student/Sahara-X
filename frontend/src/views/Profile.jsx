import Icon from "../components/Icon";
import { useStore } from "../store/useStore";
import { SECTORS, SKILLS } from "../lib/data";
import { fmtRupee } from "../lib/format";
import { t } from "../lib/i18n";

// Ported 1:1 from renderProfile() in the original app.
export default function Profile() {
  const p = useStore((s) => s.profile);
  const setName = useStore((s) => s.setName);
  const setLocation = useStore((s) => s.setLocation);
  const setBudget = useStore((s) => s.setBudget);
  const toggleSector = useStore((s) => s.toggleSector);
  const toggleSkill = useStore((s) => s.toggleSkill);
  const setLang = useStore((s) => s.setLang);
  const saveProfile = useStore((s) => s.saveProfile);
  const tt = (key, ...args) => t(p.language, key, ...args);

  const LOCS = [
    ["Rural", tt("loc_rural")],
    ["Semi-Urban", tt("loc_semiurban")],
    ["Urban", tt("loc_urban")],
  ];

  return (
    <>
      <div className="topbar-page">
        <div>
          <h1 className="page-title">{tt("profile_title")}</h1>
          <p className="page-sub">{tt("profile_sub")}</p>
        </div>
      </div>
      <div className="card fade-in" style={{ padding: 34, maxWidth: 600, marginTop: 16 }}>
        <div className="section-label">{tt("name_field")}</div>
        <input className="text-input" style={{ marginBottom: 22 }} value={p.name} placeholder={tt("name_placeholder")} onChange={(e) => setName(e.target.value)} />

        <div className="section-label"><Icon name="pin" /> {tt("location_type")}</div>
        <div className="option-grid" style={{ marginBottom: 22 }}>
          {LOCS.map(([loc, label]) => (
            <div key={loc} className={`opt-tile ${p.locationType === loc ? "sel" : ""}`} onClick={() => setLocation(loc)}>
              <div className="t">{label}</div>
            </div>
          ))}
        </div>

        <div className="section-label"><Icon name="rupee" /> {tt("budget_label")}</div>
        <div className="budget-display mono" style={{ fontSize: 26 }}>{fmtRupee(p.budget)}</div>
        <input type="range" min="10000" max="1000000" step="5000" value={p.budget} onChange={(e) => setBudget(parseInt(e.target.value, 10))} style={{ marginBottom: 22 }} />

        <div className="section-label"><Icon name="target" /> {tt("interests_label")}</div>
        <div className="chip-grid" style={{ marginBottom: 22 }}>
          {SECTORS.map((s) => (
            <div key={s} className={`chip-toggle ${p.sectorInterest.includes(s) ? "sel" : ""}`} onClick={() => toggleSector(s)}>{s}</div>
          ))}
        </div>

        <div className="section-label"><Icon name="wrench" /> {tt("skills_label")}</div>
        <div className="chip-grid" style={{ marginBottom: 22 }}>
          {SKILLS.map((s) => (
            <div key={s} className={`chip-toggle ${p.skills.includes(s) ? "sel" : ""}`} onClick={() => toggleSkill(s)}>{s}</div>
          ))}
        </div>

        <div className="section-label"><Icon name="book" /> {tt("language_label")}</div>
        <div className="lang-row" style={{ maxWidth: 340, marginBottom: 26 }}>
          <div className={`opt-tile lang-tile ${p.language === "English" ? "sel" : ""}`} onClick={() => setLang("English")}><div className="t">English</div></div>
          <div className={`opt-tile lang-tile ${p.language === "हिंदी" ? "sel" : ""}`} onClick={() => setLang("हिंदी")}><div className="t hi">हिंदी</div></div>
        </div>

        <button className="btn btn-primary" onClick={saveProfile}>{tt("save_profile")}</button>
      </div>
    </>
  );
}
