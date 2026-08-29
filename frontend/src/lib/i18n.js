// i18n for Sahara X. profile.language stores the human label
// ("English" | "हिंदी"); LANG_KEY maps that to a dict key used below.
// Covers: auth (login/signup), onboarding, and the dashboard shell +
// Overview page. AI-generated content (recommendations/reports) is
// produced by Claude directly and is a separate concern from this file.
export const LANG_KEY = { English: "en", "हिंदी": "hi" };

const en = {
  nav_login: "Log In",
  nav_signup: "Sign Up",
  nav_find: "Find My Opportunity",
  step_of: (n, total) => `STEP ${n} OF ${total}`,

  lang_title: "Choose your language",
  lang_sub: "Sahara X will respond in your preferred language — you'll see it applied right away.",
  lang_note: "More Indian languages are on the way.",

  loc_title: "Where are you based?",
  loc_sub: "This helps us understand your local market context.",
  loc_rural: "Rural",
  loc_semiurban: "Semi-Urban",
  loc_urban: "Urban",
  exact_location_label: "Your exact location",
  exact_location_placeholder: "e.g. Sitapur, Uttar Pradesh or your village/town name",
  exact_location_note: "Optional, but helps Sahara X analyze real local demand around you instead of general assumptions.",

  budget_title: "What's your budget?",
  budget_sub: "The maximum amount you could realistically invest to start.",
  budget_placeholder: "Or enter an exact amount",

  sector_title: "Which sectors interest you?",
  sector_sub: "Optional — select as many as you like, or skip if you have no preference.",
  sector_none: "No preference",

  skills_title: "What skills do you bring?",
  skills_sub: "Optional — this helps us match businesses you can realistically run.",

  back: "Back",
  continue: "Continue",
  discover: "Discover My Opportunities",
  close: "Close",

  login_title: "Welcome back",
  login_sub: "Log in to continue to Sahara X.",
  signup_title: "Create your account",
  signup_sub: "Sign up to start discovering your opportunity.",
  name_label: "Full name",
  email_label: "Email",
  password_label: "Password",
  login_btn: "Log In",
  signup_btn: "Create Account",
  toggle_to_signup: "Don't have an account? Sign up",
  toggle_to_login: "Already have an account? Log in",
  fill_required: "Please fill in all fields",

  // ---- dashboard: sidebar ----
  nav_overview: "Overview",
  nav_discover: "Discover Ideas",
  nav_opportunities: "My Opportunities",
  nav_insights: "Market Insights",
  nav_schemes: "Government Schemes",
  nav_roadmap: "Business Roadmap",
  nav_report: "My Report",
  nav_voice: "Voice Assistant",
  nav_saved: "Saved Ideas",
  nav_profile: "My Profile",
  nav_settings: "Settings",
  nav_group_main: "Main",
  nav_group_account: "Account",
  brand_tag: "Bridging Ideas to Opportunities",

  // ---- dashboard: overview ----
  greeting: (part, name) => `Good ${part}, ${name} 👋`,
  greeting_sub: "Let's turn your resources into your next opportunity.",
  stat_budget: "Budget",
  stat_location: "Location",
  stat_interest: "Interest",
  stat_profile_fit: "Profile Fit",
  open: "Open",
  best_opportunity: "YOUR BEST OPPORTUNITY",
  feasibility: "Feasibility",
  explore_opportunity: "Explore Opportunity",
  no_opps_title: "No opportunities discovered yet",
  no_opps_sub: "Run your first AI analysis to see personalized business opportunities.",
  gov_support_title: "GOVERNMENT SUPPORT FOR YOU",
  relevant_schemes: (n) => `${n} potentially relevant schemes`,
  explore_schemes: "Explore Schemes",
  gov_support_empty: "Discover your opportunities to see relevant government support.",
  your_report: "YOUR REPORT",
  report_ready_title: "Last generated: Today",
  report_ready_sub: "Your full personalized entrepreneur report is ready.",
  view_report: "View Report",
  report_cta_sub: "Generate your complete personalized entrepreneur report.",
  generate_report: "Generate Report",
  report_empty: "Discover opportunities first to unlock your report.",
  your_journey: "YOUR JOURNEY",
  day_morning: "morning",
  day_afternoon: "afternoon",
  day_evening: "evening",
  entrepreneur: "Entrepreneur",
};

const hi = {
  nav_login: "लॉग इन",
  nav_signup: "साइन अप",
  nav_find: "मेरा अवसर खोजें",
  step_of: (n, total) => `चरण ${n} / ${total}`,

  lang_title: "अपनी भाषा चुनें",
  lang_sub: "Sahara X आपकी पसंदीदा भाषा में जवाब देगा — यह तुरंत लागू हो जाएगा।",
  lang_note: "और भारतीय भाषाएं जल्द आ रही हैं।",

  loc_title: "आप कहाँ रहते हैं?",
  loc_sub: "इससे हमें आपके स्थानीय बाज़ार को समझने में मदद मिलती है।",
  loc_rural: "ग्रामीण",
  loc_semiurban: "अर्ध-शहरी",
  loc_urban: "शहरी",
  exact_location_label: "आपका सटीक स्थान",
  exact_location_placeholder: "जैसे सीतापुर, उत्तर प्रदेश या आपके गांव/शहर का नाम",
  exact_location_note: "वैकल्पिक, लेकिन इससे Sahara X सामान्य अनुमानों की बजाय आपके आसपास की वास्तविक मांग का विश्लेषण कर पाएगा।",

  budget_title: "आपका बजट क्या है?",
  budget_sub: "वह अधिकतम राशि जो आप वास्तव में शुरू करने के लिए लगा सकते हैं।",
  budget_placeholder: "या सटीक राशि दर्ज करें",

  sector_title: "आपकी रुचि किन क्षेत्रों में है?",
  sector_sub: "वैकल्पिक — जितने चाहें उतने चुनें, या कोई पसंद न होने पर छोड़ दें।",
  sector_none: "कोई पसंद नहीं",

  skills_title: "आपके पास कौन-सी स्किल्स हैं?",
  skills_sub: "वैकल्पिक — इससे हमें ऐसे व्यवसाय सुझाने में मदद मिलती है जिन्हें आप वास्तव में चला सकें।",

  back: "पीछे",
  continue: "आगे बढ़ें",
  discover: "मेरे अवसर खोजें",
  close: "बंद करें",

  login_title: "वापसी पर स्वागत है",
  login_sub: "Sahara X जारी रखने के लिए लॉग इन करें।",
  signup_title: "अपना खाता बनाएं",
  signup_sub: "अपने अवसर खोजना शुरू करने के लिए साइन अप करें।",
  name_label: "पूरा नाम",
  email_label: "ईमेल",
  password_label: "पासवर्ड",
  login_btn: "लॉग इन",
  signup_btn: "खाता बनाएं",
  toggle_to_signup: "खाता नहीं है? साइन अप करें",
  toggle_to_login: "पहले से खाता है? लॉग इन करें",
  fill_required: "कृपया सभी फ़ील्ड भरें",

  // ---- dashboard: sidebar ----
  nav_overview: "अवलोकन",
  nav_discover: "विचार खोजें",
  nav_opportunities: "मेरे अवसर",
  nav_insights: "बाज़ार जानकारी",
  nav_schemes: "सरकारी योजनाएं",
  nav_roadmap: "व्यवसाय रोडमैप",
  nav_report: "मेरी रिपोर्ट",
  nav_voice: "वॉइस असिस्टेंट",
  nav_saved: "सेव किए विचार",
  nav_profile: "मेरी प्रोफ़ाइल",
  nav_settings: "सेटिंग्स",
  nav_group_main: "मुख्य",
  nav_group_account: "खाता",
  brand_tag: "विचारों को अवसरों से जोड़ना",

  // ---- dashboard: overview ----
  greeting: (part, name) => `शुभ ${part}, ${name} 👋`,
  greeting_sub: "आइए आपके संसाधनों को आपके अगले अवसर में बदलें।",
  stat_budget: "बजट",
  stat_location: "स्थान",
  stat_interest: "रुचि",
  stat_profile_fit: "प्रोफ़ाइल फिट",
  open: "खुला",
  best_opportunity: "आपका सर्वश्रेष्ठ अवसर",
  feasibility: "व्यवहार्यता",
  explore_opportunity: "अवसर देखें",
  no_opps_title: "अभी तक कोई अवसर नहीं मिला",
  no_opps_sub: "व्यक्तिगत व्यावसायिक अवसर देखने के लिए अपना पहला AI विश्लेषण चलाएं।",
  gov_support_title: "आपके लिए सरकारी सहायता",
  relevant_schemes: (n) => `${n} संभावित रूप से प्रासंगिक योजनाएं`,
  explore_schemes: "योजनाएं देखें",
  gov_support_empty: "प्रासंगिक सरकारी सहायता देखने के लिए अपने अवसर खोजें।",
  your_report: "आपकी रिपोर्ट",
  report_ready_title: "अंतिम बार तैयार: आज",
  report_ready_sub: "आपकी पूरी व्यक्तिगत उद्यमी रिपोर्ट तैयार है।",
  view_report: "रिपोर्ट देखें",
  report_cta_sub: "अपनी पूरी व्यक्तिगत उद्यमी रिपोर्ट तैयार करें।",
  generate_report: "रिपोर्ट तैयार करें",
  report_empty: "अपनी रिपोर्ट अनलॉक करने के लिए पहले अवसर खोजें।",
  your_journey: "आपकी यात्रा",
  day_morning: "सुबह",
  day_afternoon: "दोपहर",
  day_evening: "शाम",
  entrepreneur: "उद्यमी",
};

const DICT = { en, hi };

export function t(langLabel, key, ...args) {
  const k = LANG_KEY[langLabel] || "en";
  const entry = (DICT[k] && DICT[k][key]) ?? DICT.en[key];
  return typeof entry === "function" ? entry(...args) : entry;
}
