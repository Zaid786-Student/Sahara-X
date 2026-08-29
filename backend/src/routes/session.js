const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

const DEFAULT_PROFILE = {
  locationType: "",
  budget: 50000,
  sectorInterest: [],
  skills: [],
  language: "English",
  name: "",
};

// GET /api/session/:id
// Replaces window.storage.get('profile'|'savedIdeas'|'recommendations'|'report').
// Auto-creates a fresh row with defaults on first visit (no auth in this demo).
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let session = await prisma.session.findUnique({ where: { id } });
    if (!session) {
      session = await prisma.session.create({
        data: { id, profile: DEFAULT_PROFILE, savedIdeas: [] },
      });
    }
    res.json(session);
  } catch (err) {
    console.error("Failed to load session:", err.message);
    res.status(500).json({ error: "Failed to load session" });
  }
});

// POST /api/session/:id
// Replaces window.storage.set(...) calls. Body may include any subset of
// { profile, recommendations, savedIdeas, report, theme } — each provided
// field fully replaces the stored value (matching the original persist()
// semantics, which always wrote the whole key).
router.post("/:id", async (req, res) => {
  const { id } = req.params;
  const { profile, recommendations, savedIdeas, report, theme } = req.body || {};
  const data = {};
  if (profile !== undefined) data.profile = profile;
  if (recommendations !== undefined) data.recommendations = recommendations;
  if (savedIdeas !== undefined) data.savedIdeas = savedIdeas;
  if (report !== undefined) data.report = report;
  if (theme !== undefined) data.theme = theme;

  try {
    const session = await prisma.session.upsert({
      where: { id },
      update: data,
      create: { id, profile: profile ?? DEFAULT_PROFILE, savedIdeas: savedIdeas ?? [], ...data },
    });
    res.json(session);
  } catch (err) {
    console.error("Failed to save session:", err.message);
    res.status(500).json({ error: "Failed to save session" });
  }
});

module.exports = router;
