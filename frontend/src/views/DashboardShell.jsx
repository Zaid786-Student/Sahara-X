import Icon from "../components/Icon";
import ThemeToggle from "../components/ThemeToggle";
import { useStore } from "../store/useStore";
import { NAV_MAIN, NAV_ACCOUNT } from "../lib/data";
import { t } from "../lib/i18n";

import Overview from "./Overview";
import Discover from "./Discover";
import MyOpportunities from "./MyOpportunities";
import OpportunityDetail from "./OpportunityDetail";
import Compare from "./Compare";
import Insights from "./Insights";
import Schemes from "./Schemes";
import Roadmap from "./Roadmap";
import Report from "./Report";
import Voice from "./Voice";
import Saved from "./Saved";
import Profile from "./Profile";
import Settings from "./Settings";

function renderRoute(route) {
  switch (route) {
    case "overview": return <Overview />;
    case "discover": return <Discover />;
    case "opportunities": return <MyOpportunities />;
    case "opportunityDetail": return <OpportunityDetail />;
    case "compare": return <Compare />;
    case "insights": return <Insights />;
    case "schemes": return <Schemes />;
    case "roadmap": return <Roadmap />;
    case "myReport": return <Report />;
    case "voice": return <Voice />;
    case "saved": return <Saved />;
    case "profile": return <Profile />;
    case "settings": return <Settings />;
    default: return <Overview />;
  }
}

const NAV_LABEL_KEY = {
  overview: "nav_overview",
  discover: "nav_discover",
  opportunities: "nav_opportunities",
  insights: "nav_insights",
  schemes: "nav_schemes",
  roadmap: "nav_roadmap",
  myReport: "nav_report",
  voice: "nav_voice",
  saved: "nav_saved",
  profile: "nav_profile",
  settings: "nav_settings",
};

export default function DashboardShell() {
  const route = useStore((s) => s.route) || "overview";
  const sidebarOpen = useStore((s) => s.sidebarOpen);
  const toggleSidebar = useStore((s) => s.toggleSidebar);
  const nav = useStore((s) => s.nav);
  const profile = useStore((s) => s.profile);
  const tt = (key, ...args) => t(profile.language, key, ...args);

  return (
    <>
      <div className="dash">
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="brand"><div className="brand-mark"><Icon name="logomark" /></div>Sahara X</div>
          <div className="brand-tag">{tt("brand_tag")}</div>
          <div className="nav-group-label">{tt("nav_group_main")}</div>
          {NAV_MAIN.map(([r, , icon]) => (
            <div key={r} className={`nav-item ${route === r ? "active" : ""}`} onClick={() => nav(r)}>
              <Icon name={icon} />{tt(NAV_LABEL_KEY[r])}
            </div>
          ))}
          <div className="nav-group-label">{tt("nav_group_account")}</div>
          {NAV_ACCOUNT.map(([r, , icon]) => (
            <div key={r} className={`nav-item ${route === r ? "active" : ""}`} onClick={() => nav(r)}>
              <Icon name={icon} />{tt(NAV_LABEL_KEY[r])}
            </div>
          ))}
        </aside>
        <main className="main" style={{ position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, position: "relative", zIndex: 1 }}>
            <button className="btn-ghost btn-sm" onClick={toggleSidebar} style={{ display: "none" }} id="mobMenuBtn"><Icon name="menu" /> Menu</button>
            <span></span>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <ThemeToggle size="sm" />
              <div className="avatar">{(profile.name || "E")[0].toUpperCase()}</div>
            </div>
          </div>
          {renderRoute(route)}
        </main>
      </div>
      <style>{`@media(max-width:960px){#mobMenuBtn{display:inline-flex !important;}}`}</style>
    </>
  );
}
