import Icon from "../components/Icon";
import ThemeToggle from "../components/ThemeToggle";
import { useStore } from "../store/useStore";

const HOW_ITEMS = [
  ["user", "Tell us about yourself", "Share your location type, budget, skills and interests — takes under two minutes."],
  ["chip", "AI analyzes your context", "Sahara X weighs budget fit, local demand, skills and risk — not just what's trending."],
  ["bulb", "Discover personalized opportunities", "Get three ranked business ideas built around your specific reality."],
  ["bank", "Understand funding and risk", "See potentially relevant government schemes and a clear risk breakdown."],
  ["map", "Follow your roadmap", "Move from validation to registration to launch with a concrete step-by-step plan."],
];

const WHY_LEFT = [
  ["target", "Personalization", "Recommendations built around your specific profile, not a one-size-fits-all list."],
  ["rupee", "Budget Fit", "We never recommend businesses beyond what you can realistically afford."],
  ["pin", "Local Context", "Location-aware suggestions that account for rural, semi-urban or urban realities."],
];

const WHY_RIGHT = [
  ["bank", "Scheme Awareness", "We connect opportunities to potentially relevant government support."],
  ["alert", "Risk Awareness", "Clear, honest visibility into what could go wrong before you invest."],
  ["map", "Complete Roadmap", "A full decision-support report — not just a list of ideas."],
];

const GOV_CHIPS = ["PMEGP", "MUDRA", "Stand-Up India", "ODOP", "NABARD", "PM SVANidhi", "CSC"];

export default function Landing() {
  const startOnboarding = useStore((s) => s.startOnboarding);
  const goLogin = useStore((s) => s.goLogin);
  const authed = useStore((s) => s.authed);

  const scrollHow = (e) => { e.preventDefault(); document.getElementById("how")?.scrollIntoView({ behavior: "smooth" }); };
  const scrollGov = (e) => { e.preventDefault(); document.getElementById("gov")?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <>
      <nav className="nav-top"><div className="container">
        <div className="brand"><div className="brand-mark"><Icon name="logomark" /></div>Sahara X</div>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          <a href="#" onClick={scrollHow} style={{ fontSize: 14.5, fontWeight: 500, color: "var(--ink-soft)" }}>How it works</a>
          <a href="#" onClick={scrollGov} style={{ fontSize: 14.5, fontWeight: 500, color: "var(--ink-soft)" }}>Government support</a>
          <ThemeToggle />
          {!authed && (
            <>
              <button className="btn-ghost btn-sm" onClick={() => goLogin("login")}>Log In</button>
              <button className="btn btn-secondary btn-sm" onClick={() => goLogin("signup")}>Sign Up</button>
            </>
          )}
          <button className="btn btn-primary btn-sm" onClick={startOnboarding}>Find My Opportunity</button>
        </div>
      </div></nav>

      <section className="hero"><div className="container">
        <div className="eyebrow"><Icon name="sparkle" /> AI-POWERED BUSINESS DISCOVERY</div>
        <h1>Your next business starts with the right opportunity.</h1>
        <p className="lead">Tell us where you are, what you can invest, what you know, and what you want to build. Sahara X helps you discover businesses that fit your reality — not someone else's.</p>
        <div className="hero-ctas">
          <button className="btn btn-primary" onClick={startOnboarding}>Find My Opportunity <Icon name="arrow" /></button>
          <button className="btn btn-secondary" onClick={scrollHow}>How Sahara X Works</button>
        </div>
        <div className="reality-strip">
          <div className="reality-chip"><Icon name="pin" /> Your location</div>
          <div className="reality-chip"><Icon name="rupee" /> Your budget</div>
          <div className="reality-chip"><Icon name="wrench" /> Your skills</div>
          <div className="reality-chip"><Icon name="target" /> Your interests</div>
          <div className="reality-chip" style={{ background: "var(--indigo)", color: "#fff", borderColor: "var(--indigo-text)" }}><Icon name="sparkle" /> → Real opportunities</div>
        </div>
      </div></section>

      <section className="section" id="how"><div className="container">
        <div className="section-head">
          <div className="eyebrow"><Icon name="map" /> THE PATH</div>
          <h2>How Sahara X works</h2>
          <p>Five steps from your reality to a decision-ready business plan.</p>
        </div>
        <div className="grid grid-3">
          {HOW_ITEMS.map(([icon, t, d], i) => (
            <div className="card how-card" key={t}>
              <div className="how-num">0{i + 1}</div>
              <div className="oi" style={{ color: "var(--indigo-text)", marginBottom: 10 }}><Icon name={icon} /></div>
              <h3 style={{ fontSize: 17, color: "var(--ink)", marginBottom: 8 }}>{t}</h3>
              <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>{d}</p>
            </div>
          ))}
        </div>
      </div></section>

      <section className="section" style={{ background: "var(--card)" }}><div className="container">
        <div className="section-head">
          <div className="eyebrow"><Icon name="scale" /> WHY SAHARA X</div>
          <h2>We don't tell everyone to start the same business.</h2>
          <p>We identify what makes sense for you — grounded in reality, not trends.</p>
        </div>
        <div className="grid grid-2">
          <div>
            {WHY_LEFT.map(([icon, t, d]) => (
              <div className="why-item" key={t}>
                <div className="why-icon"><Icon name={icon} /></div>
                <div><h3 style={{ fontSize: 16, color: "var(--ink)" }}>{t}</h3><p style={{ color: "var(--ink-soft)", fontSize: 14, marginTop: 4 }}>{d}</p></div>
              </div>
            ))}
          </div>
          <div>
            {WHY_RIGHT.map(([icon, t, d]) => (
              <div className="why-item" key={t}>
                <div className="why-icon"><Icon name={icon} /></div>
                <div><h3 style={{ fontSize: 16, color: "var(--ink)" }}>{t}</h3><p style={{ color: "var(--ink-soft)", fontSize: 14, marginTop: 4 }}>{d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div></section>

      <section className="section" id="gov"><div className="container">
        <div className="gov-strip">
          <div className="eyebrow" style={{ color: "var(--marigold)" }}><Icon name="bank" /> GOVERNMENT SUPPORT</div>
          <h2 style={{ marginTop: 12 }}>Recommendations connected to real support programs.</h2>
          <p style={{ maxWidth: 600, marginTop: 10 }}>Where relevant, Sahara X maps your opportunity to schemes like PMEGP, MUDRA, Stand-Up India, ODOP and NABARD-linked programs — from a curated, non-AI-generated database. Always verify current eligibility before applying.</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 22 }}>
            {GOV_CHIPS.map((s) => <div className="scheme-chip" key={s}>{s}</div>)}
          </div>
        </div>
      </div></section>

      <section className="section"><div className="container">
        <div className="card voice-panel">
          <div className="mic-static"><Icon name="mic" /></div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div className="eyebrow"><Icon name="mic" /> VOICE ACCESSIBILITY</div>
            <h2 style={{ fontSize: 24, marginTop: 8 }}>Speak in Hindi. Sahara X listens.</h2>
            <p style={{ color: "var(--ink-soft)", marginTop: 8, fontSize: 15 }} className="hi">"मेरे पास पचास हजार रुपये हैं और मैं गांव में रहता हूं।" — Sahara X understands budget, location and language directly from speech, built for users with varying digital literacy.</p>
          </div>
        </div>
      </div></section>

      <section className="final-cta"><div className="container">
        <div className="eyebrow" style={{ justifyContent: "center" }}><Icon name="sparkle" /> BRIDGING IDEAS TO OPPORTUNITIES</div>
        <h2>Discover the business that actually fits your reality.</h2>
        <div style={{ marginTop: 28 }}><button className="btn btn-primary" onClick={startOnboarding} style={{ padding: "16px 32px", fontSize: 16 }}>Start Your Journey <Icon name="arrow" /></button></div>
      </div></section>

      <footer><div className="container" style={{ display: "flex", justifyContent: "space-between", width: "100%", flexWrap: "wrap", gap: 10 }}>
        <div className="brand" style={{ fontSize: 16 }}>Sahara X</div>
        <div>Bridging Ideas to Opportunities. AI-informed guidance — always verify scheme eligibility independently.</div>
      </div></footer>
    </>
  );
}
