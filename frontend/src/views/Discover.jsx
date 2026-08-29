import Icon from "../components/Icon";
import { useStore } from "../store/useStore";
import { SECTORS, SKILLS } from "../lib/data";
import { fmtRupee } from "../lib/format";
import { t } from "../lib/i18n";

export default function Discover() {
  const p = useStore((s) => s.profile);
  const setLocation = useStore((s) => s.setLocation);
  const setBudget = useStore((s) => s.setBudget);
  const toggleSector = useStore((s) => s.toggleSector);
  const clearSectors = useStore((s) => s.clearSectors);
  const toggleSkill = useStore((s) => s.toggleSkill);
  const setLang = useStore((s) => s.setLang);
  const submitOnboarding = useStore((s) => s.submitOnboarding);
  const tt = (key, ...args) => t(p.language, key, ...args);

  const LOCS = [
    ["Rural", tt("loc_rural")],
    ["Semi-Urban", tt("loc_semiurban")],
    ["Urban", tt("loc_urban")],
  ];

  return (
    <>
      <div className="topbar-page"><div><h1 className="page-title">{tt("discover_title")}</h1><p className="page-sub">{tt("discover_sub")}</p></div></div>
      <div className="card fade-in" style={{ padding: 34, maxWidth: 680, marginTop: 10 }}>
        <div className="section-label"><Icon name="pin" /> {tt("location_type")}</div>
        <div className="option-grid" style={{ marginBottom: 26 }}>
          {LOCS.map(([loc, label]) => (
            <div key={loc} className={`opt-tile ${p.locationType === loc ? "sel" : ""}`} onClick={() => setLocation(loc)}>
              <div className="oi"><Icon name="pin" /></div>
              <div className="t">{label}</div>
            </div>
          ))}
        </div>
        <div className="section-label"><Icon name="rupee" /> {tt("budget_label")}</div>
        <div className="budget-display mono">{fmtRupee(p.budget)}</div>
        <input type="range" min="10000" max="1000000" step="5000" value={p.budget} onChange={(e) => setBudget(parseInt(e.target.value, 10))} />
        <div style={{ marginBottom: 26 }}></div>
        <div className="section-label"><Icon name="target" /> {tt("sector_interest")}</div>
        <div className="chip-grid" style={{ marginBottom: 26 }}>
          <div className={`chip-toggle ${p.sectorInterest.length === 0 ? "sel" : ""}`} onClick={clearSectors}>{tt("no_preference")}</div>
          {SECTORS.map((s) => (
            <div key={s} className={`chip-toggle ${p.sectorInterest.includes(s) ? "sel" : ""}`} onClick={() => toggleSector(s)}>{s}</div>
          ))}
        </div>
        <div className="section-label"><Icon name="wrench" /> {tt("skills_label")}</div>
        <div className="chip-grid" style={{ marginBottom: 26 }}>
          {SKILLS.map((s) => (
            <div key={s} className={`chip-toggle ${p.skills.includes(s) ? "sel" : ""}`} onClick={() => toggleSkill(s)}>{s}</div>
          ))}
        </div>
        <div className="section-label"><Icon name="book" /> {tt("language_label")}</div>
        <div className="lang-row" style={{ marginBottom: 30, maxWidth: 340 }}>
          <div className={`opt-tile lang-tile ${p.language === "English" ? "sel" : ""}`} onClick={() => setLang("English")}><div className="t">English</div></div>
          <div className={`opt-tile lang-tile ${p.language === "हिंदी" ? "sel" : ""}`} onClick={() => setLang("हिंदी")}><div className="t hi">हिंदी</div></div>
        </div>
        <button className="btn btn-primary" onClick={submitOnboarding} style={{ width: "100%", justifyContent: "center", padding: 16 }}>
          <Icon name="sparkle" /> {tt("discover")}
        </button>
      </div>
    </>
  );
}
