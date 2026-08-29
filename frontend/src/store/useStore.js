import { create } from "zustand";
import { callClaude, fetchSchemes, fetchSession, saveSession } from "../lib/api";
import { RECO_SYSTEM, REPORT_SYSTEM, VOICE_SYSTEM, SCHEME_MATCH_SYSTEM } from "../lib/prompts";
import { FALLBACK_IDEAS } from "../lib/fallbackIdeas";
import { fmtRupee } from "../lib/format";
import { SECTORS, SKILLS } from "../lib/data";
import { createRecognizer, isSTTSupported, isTTSSupported, speak, stopSpeaking, LANG_MAP } from "../lib/voice";

// Recognizer instance lives outside the store — it's a live browser object,
// not serializable state. Only one utterance is ever in flight at a time.
let recognizer = null;

// ---------------------------------------------------------------
// SESSION ID — replaces the original per-browser window.storage scope.
// Generated once and kept in localStorage; sent as :id on every
// /api/session/:id request. No auth in this demo, per the spec.
// ---------------------------------------------------------------
function getOrCreateSessionId() {
  const KEY = "sahara-x-session-id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = (crypto.randomUUID && crypto.randomUUID()) || `sess-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(KEY, id);
  }
  return id;
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

const DEFAULT_PROFILE = { locationType: "", exactLocation: "", budget: 50000, sectorInterest: [], skills: [], language: "English", name: "" };

function getStoredAuth() {
  try {
    const raw = localStorage.getItem("sahara-x-auth");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

// ---------------------------------------------------------------
// STATE — identical shape/fields to the original global `state` object,
// plus a few additions required by the client/server split:
//   sessionId, schemes, schemesLoaded, sessionLoaded
// ---------------------------------------------------------------
export const useStore = create((set, get) => ({
  view: "landing",
  onboardStep: 1,
  sidebarOpen: false,
  profile: { ...DEFAULT_PROFILE },
  loadingChecks: 0,
  recommendations: null,
  overallProfileFit: null,
  fitBreakdown: null,
  report: null,
  reportLoading: false,
  activeOpportunity: null,
  savedIdeas: [],
  compareSelection: [],
  toast: null,
  voiceListening: false,
  voiceProcessing: false,
  voiceInterim: "",
  voiceError: null,
  voiceLog: [],
  voiceSupported: isSTTSupported(),
  voiceTTSSupported: isTTSSupported(),
  discoverError: null,
  theme: "dark",

  suggestedSchemes: null, // [{id, whyRelevant}] | null (not yet run)
  suggestedSchemesLoading: false,
  suggestedSchemesError: null,

  route: "overview",
  sessionId: getOrCreateSessionId(),
  schemes: [],
  schemesLoaded: false,
  sessionLoaded: false,

  // ---------- AUTH (lightweight client-side demo auth — no backend user
  // table yet; gates access to onboarding/dashboard, persisted in
  // localStorage only) ----------
  authed: !!getStoredAuth(),
  authUser: getStoredAuth(),
  authMode: "login", // "login" | "signup"
  pendingAfterLogin: null,

  // ---------- generic patch helper (mirrors setState(patch)) ----------
  setState: (patch) => set(patch),

  // ---------- INIT — replaces loadPersisted() + applyTheme() + first render ----------
  init: async () => {
    const { sessionId } = get();
    try {
      const [session, schemes] = await Promise.all([fetchSession(sessionId), fetchSchemes()]);
      set({
        profile: session.profile && Object.keys(session.profile).length ? session.profile : { ...DEFAULT_PROFILE },
        savedIdeas: session.savedIdeas || [],
        recommendations: session.recommendations?.recommendations || null,
        overallProfileFit: session.recommendations?.overallProfileFit ?? null,
        fitBreakdown: session.recommendations?.fitBreakdown ?? null,
        report: session.report || null,
        theme: session.theme || get().theme,
        schemes,
        schemesLoaded: true,
        sessionLoaded: true,
      });
    } catch (e) {
      console.error("Failed to load session/schemes", e);
      set({ sessionLoaded: true, schemesLoaded: true });
    }
    applyTheme(get().theme);
  },

  // ---------- persist() replacement ----------
  persist: (patch) => {
    const { sessionId } = get();
    saveSession(sessionId, patch).catch((e) => console.error("persist failed", e));
  },

  // ---------- toast ----------
  showToast: (msg) => {
    set({ toast: msg });
    setTimeout(() => {
      if (get().toast === msg) set({ toast: null });
    }, 2600);
  },

  // ---------- theme ----------
  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    set({ theme: next });
    applyTheme(next);
    get().persist({ theme: next });
  },

  // ---------- ONBOARDING / PROFILE actions ----------
  // Gate: unauthenticated users are routed to login first; on success we
  // resume straight into onboarding (see loginUser/signupUser below).
  startOnboarding: () => {
    if (get().authed) {
      set({ view: "onboarding", onboardStep: 1 });
    } else {
      set({ view: "login", authMode: "login", pendingAfterLogin: "onboarding" });
    }
  },
  goLanding: () => set({ view: "landing" }),
  goLogin: (mode = "login") => set({ view: "login", authMode: mode, pendingAfterLogin: null }),
  setAuthMode: (mode) => set({ authMode: mode }),

  loginUser: ({ email, password }) => {
    if (!email || !password) {
      get().showToast("Please fill in all fields");
      return false;
    }
    const user = { email, name: email.split("@")[0] };
    localStorage.setItem("sahara-x-auth", JSON.stringify(user));
    set({ authed: true, authUser: user });
    const pending = get().pendingAfterLogin;
    set({ pendingAfterLogin: null });
    if (pending === "onboarding") set({ view: "onboarding", onboardStep: 1 });
    else set({ view: "dashboard" });
    return true;
  },

  signupUser: ({ name, email, password }) => {
    if (!name || !email || !password) {
      get().showToast("Please fill in all fields");
      return false;
    }
    const user = { email, name };
    localStorage.setItem("sahara-x-auth", JSON.stringify(user));
    set((s) => ({ authed: true, authUser: user, profile: { ...s.profile, name } }));
    const pending = get().pendingAfterLogin;
    set({ pendingAfterLogin: null });
    if (pending === "onboarding") set({ view: "onboarding", onboardStep: 1 });
    else set({ view: "dashboard" });
    return true;
  },

  logoutUser: () => {
    localStorage.removeItem("sahara-x-auth");
    set({ authed: false, authUser: null, view: "landing" });
  },

  setLocation: (val) => set((s) => ({ profile: { ...s.profile, locationType: val } })),
  setExactLocation: (val) => set((s) => ({ profile: { ...s.profile, exactLocation: val } })),
  setLang: (val) => set((s) => ({ profile: { ...s.profile, language: val } })),
  toggleSector: (val) =>
    set((s) => {
      const has = s.profile.sectorInterest.includes(val);
      return { profile: { ...s.profile, sectorInterest: has ? s.profile.sectorInterest.filter((x) => x !== val) : [...s.profile.sectorInterest, val] } };
    }),
  clearSectors: () => set((s) => ({ profile: { ...s.profile, sectorInterest: [] } })),
  toggleSkill: (val) =>
    set((s) => {
      const has = s.profile.skills.includes(val);
      return { profile: { ...s.profile, skills: has ? s.profile.skills.filter((x) => x !== val) : [...s.profile.skills, val] } };
    }),
  setBudget: (val) => set((s) => ({ profile: { ...s.profile, budget: val } })),
  setName: (val) => set((s) => ({ profile: { ...s.profile, name: val } })),

  nextStep: () => {
    const { onboardStep, profile, showToast } = get();
    if (onboardStep === 2 && !profile.locationType) {
      showToast(profile.language === "हिंदी" ? "कृपया अपना स्थान चुनें" : "Please select a location type");
      return;
    }
    set({ onboardStep: onboardStep + 1 });
  },
  prevStep: () => set((s) => ({ onboardStep: s.onboardStep - 1 })),

  submitOnboarding: () => {
    const { profile, showToast, runDiscovery } = get();
    if (!profile.locationType) {
      set({ view: "onboarding", onboardStep: 2 });
      showToast(profile.language === "हिंदी" ? "कृपया पहले अपना स्थान चुनें" : "Please select a location type first");
      return;
    }
    runDiscovery();
  },

  saveProfile: () => {
    const { profile, persist, showToast } = get();
    persist({ profile });
    showToast("Profile saved");
  },

  // ---------- NAVIGATION ----------
  nav: (route) => set({ route, sidebarOpen: false }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  openOpportunity: (id) => set({ route: "opportunityDetail", activeOpportunity: id }),

  // ---------- SAVE / COMPARE ----------
  toggleSave: (id) => {
    const { recommendations, savedIdeas, persist, showToast } = get();
    const idea = (recommendations || []).find((o) => o.id === id) || savedIdeas.find((s) => s.id === id);
    if (!idea) return;
    const exists = savedIdeas.some((s) => s.id === id);
    const next = exists ? savedIdeas.filter((s) => s.id !== id) : [...savedIdeas, { ...idea, savedAt: new Date().toISOString() }];
    set({ savedIdeas: next });
    persist({ savedIdeas: next });
    showToast(exists ? "Removed from saved" : "Saved to My Saved Ideas");
  },
  removeSaved: (id) => {
    const next = get().savedIdeas.filter((s) => s.id !== id);
    set({ savedIdeas: next });
    get().persist({ savedIdeas: next });
  },
  toggleCompare: (id) => {
    const { compareSelection, showToast } = get();
    if (compareSelection.includes(id)) {
      set({ compareSelection: compareSelection.filter((x) => x !== id) });
    } else if (compareSelection.length < 3) {
      set({ compareSelection: [...compareSelection, id] });
    } else {
      showToast("You can compare up to 3 opportunities");
    }
  },

  // ---------- DISCOVERY (Claude call + fallback) ----------
  runDiscovery: async () => {
    set({ view: "loading", loadingChecks: 0, discoverError: null });
    const steps = 4;
    const timer = setInterval(() => {
      if (get().loadingChecks < steps - 1) set((s) => ({ loadingChecks: s.loadingChecks + 1 }));
    }, 650);

    let data;
    let usedFallback = false;
    try {
      data = await generateRecommendations(get().profile);
    } catch (e) {
      console.error(e);
      data = fallbackRecommendationSet(get().profile);
      usedFallback = true;
    }
    clearInterval(timer);
    set({ loadingChecks: steps });
    await new Promise((r) => setTimeout(r, 500));

    set({
      recommendations: data.recommendations,
      overallProfileFit: data.overallProfileFit,
      fitBreakdown: data.fitBreakdown,
      report: null, // invalidate old report
    });
    get().persist({
      recommendations: { recommendations: data.recommendations, overallProfileFit: data.overallProfileFit, fitBreakdown: data.fitBreakdown },
      profile: get().profile,
    });
    if (usedFallback) {
      set({ discoverError: "Claude AI was unavailable, so Sahara X showed curated demo opportunities instead. Recommendations will use live AI once available." });
    }
    set({ view: "dashboard", route: "overview" });
  },

  // ---------- REPORT (Claude call + fallback) ----------
  generateReport: async () => {
    const { recommendations, profile } = get();
    if (!recommendations) return;
    set({ reportLoading: true, route: "myReport", view: "dashboard" });
    const top = recommendations[0];
    let synth;
    try {
      const userMsg = `Profile: ${JSON.stringify(profile)}\nTop opportunity: ${JSON.stringify(top)}\nAll opportunities considered: ${JSON.stringify(recommendations.map((r) => ({ name: r.ideaName, feasibility: r.feasibilityScore, budget: r.estimatedBudget.display })))}`;
      synth = await callClaude(REPORT_SYSTEM, userMsg);
    } catch (e) {
      console.error(e);
      synth = {
        executiveSummary: `Based on a budget of ${fmtRupee(profile.budget)} in a ${profile.locationType || "your"} location, "${top.ideaName}" is estimated to be the strongest fit at a feasibility of ${top.feasibilityScore}/10. The main opportunity is ${(top.whyThisFits && top.whyThisFits[0]) || "a strong budget match"}, while the main concern is ${(top.riskFactors && top.riskFactors[0]) || "market validation"}. The recommended next step is to validate local demand before committing full capital.`,
        budgetAnalysis: { availableBudget: profile.budget, estimatedStartupRequirement: top.estimatedBudget.min, note: "AI-estimated based on typical setup costs for this category." },
        riskAnalysis: { overallRisk: "Medium", breakdown: { competition: "Medium", seasonality: "Medium", capitalRisk: "Low", operations: "Medium", supplyChain: "Low", regulatoryRisk: "Low" } },
        marketInsights: { locationContext: `${profile.locationType || "Local"} area context based on your profile.`, targetCustomerGroups: ["Nearby households", "Local small businesses"], demandSignals: "AI-informed assessment — not verified market statistics.", seasonality: "May vary by season depending on the business category.", competition: "Estimated to be moderate based on typical market density.", localConsiderations: "Verify local demand directly before committing capital." },
        localityAnalysis: {
          areaName: profile.exactLocation || profile.locationType || "your area",
          whatsInDemandAroundYou: `Without a more specific location on file, this is a general estimate — typical demand in a ${profile.locationType || "similar"} area centers on everyday household needs, food, and basic services.`,
          howThisIdeaFitsLocally: `"${top.ideaName}" is a reasonable general fit for a ${profile.locationType || "this type of"} area, but confirm real local demand directly before investing.`,
          confidence: profile.exactLocation ? "Medium" : "Low",
        },
        aiVerdict: `"${top.ideaName}" currently appears to be the strongest fit for your budget, skills and location, offering a practical entry point with manageable risk and room to grow.`,
        actionPlan: { next3Actions: ["Validate local demand by speaking to 10 potential customers", "Get an exact quote for setup costs and equipment", "Check current eligibility for relevant government support"], next30Days: "Finalise location, supplies, and any required registrations.", next90Days: "Launch, gather customer feedback, and plan your first expansion step." },
        isFallback: true,
      };
    }
    const report = { ...synth, generatedAt: new Date().toISOString(), topOpportunity: top };
    set({ report, reportLoading: false });
    get().persist({ report });
  },

  // ---------- SCHEMES: AI suggestion ----------
  // Ranks the curated (non-AI) scheme list against the user's profile so
  // they don't have to search manually. AI only picks/ranks from the given
  // ids — falls back to a deterministic keyword-overlap ranking if the
  // Claude call fails, so the feature never just breaks.
  suggestSchemes: async () => {
    const { profile, schemes, recommendations, suggestedSchemesLoading } = get();
    if (suggestedSchemesLoading || !schemes || schemes.length === 0) return;
    set({ suggestedSchemesLoading: true, suggestedSchemesError: null });
    try {
      const top = recommendations ? recommendations[0] : null;
      const userMsg = `User profile: ${JSON.stringify(profile)}\nTop AI-recommended opportunity (if any): ${JSON.stringify(top ? { name: top.ideaName, sector: top.sector, categories: top.governmentSchemeCategories } : null)}\nCurated schemes to choose from (ONLY use these ids):\n${JSON.stringify(schemes.map((s) => ({ id: s.id, name: s.name, categories: s.categories, eligibility: s.eligibility, purpose: s.purpose })))}`;
      const data = await callClaude(SCHEME_MATCH_SYSTEM, userMsg);
      const suggested = Array.isArray(data?.suggested)
        ? data.suggested.filter((x) => x && x.id && schemes.some((s) => s.id === x.id))
        : [];
      if (suggested.length === 0) throw new Error("empty AI suggestion");
      set({ suggestedSchemes: suggested, suggestedSchemesLoading: false });
    } catch (e) {
      console.error("Scheme AI suggestion failed, using fallback ranking", e);
      set({ suggestedSchemes: fallbackSchemeRanking(profile, schemes, recommendations), suggestedSchemesLoading: false, suggestedSchemesError: null });
    }
  },

  // ---------- SETTINGS ----------
  clearData: () => {
    set({ savedIdeas: [], report: null, recommendations: null, route: "overview" });
    get().persist({ savedIdeas: [] });
    get().showToast("Local data cleared");
  },

  // ---------- VOICE ----------
  // Real pipeline: browser SpeechRecognition (STT) -> Claude query-processing
  // (extract profile fields + compose a reply) -> browser SpeechSynthesis (TTS).
  startVoice: () => {
    if (get().voiceListening) return;
    if (!isSTTSupported()) {
      set({ voiceError: "Voice input isn't supported in this browser. Try Chrome, Edge, or Safari, or fill in your profile manually instead." });
      return;
    }
    stopSpeaking();
    set({ voiceError: null, voiceInterim: "" });
    const lang = LANG_MAP[get().profile.language] || "en-IN";

    recognizer = createRecognizer({
      lang,
      onInterim: (text) => set({ voiceInterim: text }),
      onFinal: (text) => {
        set({ voiceInterim: "" });
        get().handleVoiceUtterance(text);
      },
      onError: (code) => {
        let msg = "Something went wrong with voice recognition. Please try again.";
        if (code === "no-speech") msg = "Didn't catch that — tap the mic and try again.";
        else if (code === "not-allowed" || code === "service-not-allowed") msg = "Microphone access was blocked. Please allow microphone permission in your browser and try again.";
        else if (code === "audio-capture") msg = "No microphone was found on this device.";
        set({ voiceListening: false, voiceInterim: "", voiceError: msg });
      },
      onEnd: () => set({ voiceListening: false }),
    });
    if (!recognizer) return;
    try {
      recognizer.start();
      set({ voiceListening: true });
    } catch (e) {
      set({ voiceListening: false, voiceError: "Couldn't start the microphone." });
    }
  },

  stopVoice: () => {
    if (recognizer) {
      try {
        recognizer.stop();
      } catch (e) {
        /* no-op — already stopped */
      }
    }
    set({ voiceListening: false, voiceInterim: "" });
  },

  toggleVoice: () => {
    if (get().voiceListening) get().stopVoice();
    else get().startVoice();
  },

  // "Query Processing" stage: send the finalized transcript to Claude,
  // merge whatever profile facts it confidently extracted, log + speak the reply.
  handleVoiceUtterance: async (text) => {
    if (!text || !text.trim()) return;
    const langTag = LANG_MAP[get().profile.language] || "en-IN";
    set((s) => ({ voiceLog: [...s.voiceLog, { role: "user", text }], voiceProcessing: true, voiceError: null }));

    try {
      const profile = get().profile;
      const userMsg = `Current profile (may be partly empty): ${JSON.stringify(profile)}\n\nSpoken utterance, already transcribed by speech recognition: "${text}"`;
      const data = await callClaude(VOICE_SYSTEM, userMsg);
      const extracted = (data && data.extracted) || {};
      const reply = (data && data.reply && String(data.reply).trim()) || "Got it.";

      set((s) => {
        const updated = { ...s.profile };
        if (extracted.locationType && ["Rural", "Semi-Urban", "Urban"].includes(extracted.locationType)) {
          updated.locationType = extracted.locationType;
        }
        if (typeof extracted.budget === "number" && extracted.budget > 0) {
          updated.budget = Math.round(extracted.budget);
        }
        if (Array.isArray(extracted.sectorInterest) && extracted.sectorInterest.length) {
          const valid = extracted.sectorInterest.filter((v) => SECTORS.includes(v));
          if (valid.length) updated.sectorInterest = [...new Set([...updated.sectorInterest, ...valid])];
        }
        if (Array.isArray(extracted.skills) && extracted.skills.length) {
          const valid = extracted.skills.filter((v) => SKILLS.includes(v));
          if (valid.length) updated.skills = [...new Set([...updated.skills, ...valid])];
        }
        if (extracted.name && typeof extracted.name === "string") {
          updated.name = extracted.name;
        }
        return {
          profile: updated,
          voiceLog: [...s.voiceLog, { role: "ai", text: reply }],
          voiceProcessing: false,
        };
      });
      get().persist({ profile: get().profile });
      speak(reply, langTag);
    } catch (e) {
      console.error("Voice query processing failed", e);
      const fallback =
        get().profile.language === "हिंदी"
          ? "माफ़ कीजिए, अभी मैं इसे समझ नहीं पाया। कृपया दोबारा कोशिश करें।"
          : "Sorry, I couldn't process that just now. Please try again.";
      set((s) => ({ voiceLog: [...s.voiceLog, { role: "ai", text: fallback }], voiceProcessing: false }));
      speak(fallback, langTag);
    }
  },

  setVoiceLang: (lang) => set((s) => ({ profile: { ...s.profile, language: lang } })),
}));

// ---------------------------------------------------------------
// Claude call helpers — module-level, mirroring the original free
// functions (generateRecommendations / fallbackRecommendationSet).
// ---------------------------------------------------------------
async function generateRecommendations(profile) {
  const userMsg = `User profile:\n${JSON.stringify(profile)}\n\nGenerate personalized business opportunity recommendations as per your instructions.`;
  const data = await callClaude(RECO_SYSTEM, userMsg);
  if (!data || !Array.isArray(data.recommendations) || data.recommendations.length === 0) throw new Error("invalid AI response");
  return data;
}

// Deterministic fallback for the scheme AI-suggestion feature: scores each
// curated scheme by keyword overlap with the user's sector/skills/location
// and the top opportunity's scheme categories, so the UI still shows
// something useful if the Claude call fails.
function fallbackSchemeRanking(profile, schemes, recommendations) {
  const top = recommendations ? recommendations[0] : null;
  const wantedCats = (top?.governmentSchemeCategories || []).map((c) => c.toLowerCase());
  const keywords = [
    profile.locationType,
    ...(profile.sectorInterest || []),
    ...(profile.skills || []),
    ...wantedCats,
  ]
    .filter(Boolean)
    .map((k) => String(k).toLowerCase());

  const scored = schemes.map((s) => {
    const hay = (s.name + " " + s.categories.join(" ") + " " + s.eligibility + " " + s.purpose).toLowerCase();
    let score = 0;
    keywords.forEach((k) => { if (hay.includes(k)) score += wantedCats.includes(k) ? 3 : 1; });
    return { s, score };
  });
  scored.sort((a, b) => b.score - a.score);
  const picked = scored.filter((x) => x.score > 0).slice(0, 5);
  const finalPicks = picked.length ? picked : scored.slice(0, 3);
  return finalPicks.map(({ s }) => ({
    id: s.id,
    whyRelevant:
      profile.language === "हिंदी"
        ? `आपकी प्रोफ़ाइल (${profile.locationType || "सामान्य"}${profile.sectorInterest?.[0] ? ", " + profile.sectorInterest[0] : ""}) से मेल खाती है — आवेदन से पहले पात्रता ज़रूर जांचें।`
        : `Matches your profile (${profile.locationType || "general"}${profile.sectorInterest?.[0] ? ", " + profile.sectorInterest[0] : ""}) — verify current eligibility before applying.`,
  }));
}

function fallbackRecommendationSet(profile) {
  let pool = FALLBACK_IDEAS.filter((f) => f.estimatedBudget.max >= profile.budget * 0.3 && f.estimatedBudget.min <= profile.budget * 3);
  if (pool.length < 3) pool = FALLBACK_IDEAS;
  const areaLabel = profile.exactLocation || profile.locationType || "your area";
  const picks = pool.slice(0, 3).map((f, i) => ({
    ...f,
    id: "idea-" + (i + 1),
    localityInsight: `Demand for this type of business around ${areaLabel} typically depends on local footfall and existing competition — worth confirming directly before committing capital.`,
    roadmap: {
      setupSteps: ["Assess local demand", "Arrange initial capital", "Source equipment/supplies"],
      estimatedTimeline: "4–8 weeks",
      licenses: ["Local trade permission (verify locally)"],
      applicationPointer: "Check nearest District Industries Centre / bank branch for scheme details.",
      growthPlan: ["Stabilise operations", "Expand to a second location or product line"],
    },
  }));
  return {
    profileSummary: { locationType: profile.locationType, budget: profile.budget, sector: profile.sectorInterest[0] || "General", skills: profile.skills },
    overallProfileFit: 74,
    fitBreakdown: { budgetFit: 70, skillFit: 72, locationFit: 78, marketPotential: 70, growthPotential: 75 },
    recommendations: picks,
    isFallback: true,
  };
}
