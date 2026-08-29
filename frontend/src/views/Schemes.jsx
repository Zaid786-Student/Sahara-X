import { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import SchemeCard from "../components/SchemeCard";
import Icon from "../components/Icon";

export default function Schemes() {
  const schemes = useStore((s) => s.schemes);
  const profile = useStore((s) => s.profile);
  const suggestedSchemes = useStore((s) => s.suggestedSchemes);
  const suggestedSchemesLoading = useStore((s) => s.suggestedSchemesLoading);
  const suggestSchemes = useStore((s) => s.suggestSchemes);
  const [query, setQuery] = useState("");
  const q = query.toLowerCase();
  const isHindi = profile.language === "हिंदी";

  // Auto-run the AI suggestion once, as soon as the user has enough
  // profile info to make it meaningful — this is the whole point: they
  // shouldn't have to search, AI does it for them by default.
  useEffect(() => {
    if (!suggestedSchemes && !suggestedSchemesLoading && schemes.length > 0 && profile.locationType) {
      suggestSchemes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schemes.length, profile.locationType]);

  const suggestedList = (suggestedSchemes || [])
    .map((sug) => ({ sug, scheme: schemes.find((s) => s.id === sug.id) }))
    .filter((x) => x.scheme);
  const suggestedIds = new Set(suggestedList.map((x) => x.scheme.id));

  return (
    <>
      <div className="topbar-page"><div>
        <h1 className="page-title">{isHindi ? "सरकारी योजनाएं" : "Government Schemes"}</h1>
        <p className="page-sub">{isHindi ? "एक क्यूरेटेड, गैर-AI-जनित लाइब्रेरी। आवेदन से पहले हमेशा वर्तमान पात्रता जांचें।" : "A curated, non-AI-generated library. Always verify current eligibility before applying."}</p>
      </div></div>

      {/* AI-suggested section — replaces the need to search manually */}
      <div className="card" style={{ padding: 24, margin: "18px 0 26px", background: "linear-gradient(135deg, rgba(156,140,255,.1), rgba(232,163,61,.06))" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 4 }}>
          <div className="eyebrow" style={{ color: "var(--marigold)" }}>
            <Icon name="sparkle" /> {isHindi ? "आपके लिए AI-सुझाई गई योजनाएं" : "AI-SUGGESTED FOR YOU"}
          </div>
          <button className="btn btn-secondary btn-sm" onClick={suggestSchemes} disabled={suggestedSchemesLoading}>
            <Icon name="sparkle" /> {suggestedSchemesLoading ? (isHindi ? "खोज रहे हैं..." : "Finding matches...") : (isHindi ? "फिर से सुझाएं" : "Re-suggest for me")}
          </button>
        </div>

        {!profile.locationType ? (
          <p style={{ color: "var(--ink-soft)", fontSize: 14, marginTop: 10 }}>
            {isHindi ? "AI आपके लिए सबसे प्रासंगिक योजनाएं सुझाएगा — पहले अपनी प्रोफ़ाइल पूरी करें (स्थान, बजट, क्षेत्र)।" : "AI will surface the most relevant schemes for you automatically — complete your profile (location, budget, sector) first."}
          </p>
        ) : suggestedSchemesLoading ? (
          <p style={{ color: "var(--ink-soft)", fontSize: 14, marginTop: 10 }}>
            {isHindi ? "आपकी प्रोफ़ाइल के आधार पर योजनाओं का मिलान किया जा रहा है..." : "Matching schemes to your profile — no need to search, AI is doing this for you..."}
          </p>
        ) : suggestedList.length > 0 ? (
          <div className="grid grid-2" style={{ marginTop: 16 }}>
            {suggestedList.map(({ sug, scheme }) => (
              <SchemeCard key={scheme.id} s={scheme} reason={sug.whyRelevant} aiPick />
            ))}
          </div>
        ) : (
          <p style={{ color: "var(--ink-soft)", fontSize: 14, marginTop: 10 }}>
            {isHindi ? "कोई सुझाव नहीं मिला — नीचे सूची ब्राउज़ करें।" : "No suggestions yet — browse the full list below."}
          </p>
        )}
      </div>

      {/* Full list — still browsable/searchable for anyone who wants to look further */}
      <div className="section-label" style={{ marginBottom: 10 }}>{isHindi ? "सभी योजनाएं ब्राउज़ करें" : "BROWSE ALL SCHEMES"}</div>
      <input
        className="text-input"
        placeholder={isHindi ? "नाम या श्रेणी से खोजें..." : "Search schemes by name or category..."}
        style={{ maxWidth: 420, margin: "10px 0 22px" }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="grid grid-2" id="schemeGrid">
        {schemes
          .filter((s) => (s.name + " " + s.categories.join(" ")).toLowerCase().includes(q))
          .map((s) => <SchemeCard key={s.id} s={s} aiPick={suggestedIds.has(s.id)} reason={suggestedList.find((x) => x.scheme.id === s.id)?.sug.whyRelevant} />)}
      </div>
    </>
  );
}
