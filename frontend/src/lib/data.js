// Ported 1:1 from the ONBOARDING and DASHBOARD SHELL sections of the
// original sahara-x.html. Icons are referenced by name (string) instead of
// raw JSX so this stays a plain data module; components resolve the name
// through <Icon name="..." />.

export const SECTORS = ["Agriculture", "Food", "Retail", "Services", "Energy", "Manufacturing", "Tourism", "Education", "Healthcare", "Technology", "Logistics", "Other"];

export const SKILLS = ["Farming", "Cooking", "Repair", "Teaching", "Sales", "Driving", "Technology", "Handicrafts", "Management", "Other"];

export const SECTOR_ICON = {
  Agriculture: "seed",
  Food: "heart",
  Retail: "bulb",
  Services: "wrench",
  Energy: "sun",
  Manufacturing: "cog",
  Tourism: "map",
  Education: "book",
  Healthcare: "shield",
  Technology: "chip",
  Logistics: "truck",
  Other: "more",
};

// [route, label, iconName]
export const NAV_MAIN = [
  ["overview", "Overview", "home"],
  ["discover", "Discover Ideas", "sparkle"],
  ["opportunities", "My Opportunities", "bulb"],
  ["insights", "Market Insights", "chart"],
  ["schemes", "Government Schemes", "bank"],
  ["roadmap", "Business Roadmap", "map"],
  ["myReport", "My Report", "file"],
  ["voice", "Voice Assistant", "mic"],
  ["saved", "Saved Ideas", "bookmark"],
];

export const NAV_ACCOUNT = [
  ["profile", "My Profile", "user"],
  ["settings", "Settings", "gear"],
];
