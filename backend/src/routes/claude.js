const express = require("express");
   const { callAI } = require("../lib/groq");

const router = express.Router();

// POST /api/claude  { system, user } -> parsed JSON object from the AI model
// Route path/name kept as-is so the frontend (generateRecommendations /
// generateReport) needs zero changes — only the backend implementation
// swapped from Anthropic to Gemini (free tier).
router.post("/", async (req, res) => {
  const { system, user } = req.body || {};
  if (!system || !user) {
    return res.status(400).json({ error: "Both 'system' and 'user' fields are required." });
  }
  try {
    const parsed = await callAI(system, user);
    res.json(parsed);
  } catch (err) {
    console.error("AI API error:", err.message);
    res.status(502).json({ error: err.message || "AI API error" });
  }
});

module.exports = router;
