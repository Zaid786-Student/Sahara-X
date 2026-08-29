// Ported 1:1 from the FORMAT HELPERS section of the original sahara-x.html.
// Note: the original esc() helper existed to safely inject strings into
// innerHTML; React escapes text content by default, so it's unnecessary
// here and has been dropped (see README "Behavior notes").

export function fmtRupee(n) {
  if (n >= 100000) return "₹" + (n / 100000).toFixed(n % 100000 === 0 ? 0 : 1) + "L";
  if (n >= 1000) return "₹" + Math.round(n / 1000) + "K";
  return "₹" + n;
}

export function riskColor(level) {
  return level === "Low" ? "green" : level === "High" ? "rust" : "marigold";
}

export function dayPart() {
  const h = new Date().getHours();
  return h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
}

// SCHEME MATCHER (curated, deterministic — never AI-generated)
// `schemes` is the list fetched from GET /api/schemes.
export function matchSchemes(schemes, categories) {
  if (!schemes) return [];
  if (!categories || categories.length === 0) categories = ["general", "micro-enterprise"];
  const cats = categories.map((c) => c.toLowerCase());
  let matched = schemes.filter((s) => s.categories.some((c) => cats.includes(c)));
  if (matched.length === 0) {
    matched = schemes.filter((s) => s.categories.includes("general") || s.categories.includes("micro-enterprise"));
  }
  return matched.slice(0, 4);
}
