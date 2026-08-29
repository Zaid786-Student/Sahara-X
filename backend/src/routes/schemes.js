const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/schemes -> curated government scheme list (seeded, never AI-generated)
router.get("/", async (_req, res) => {
  try {
    const schemes = await prisma.scheme.findMany({ orderBy: { id: "asc" } });
    res.json(schemes);
  } catch (err) {
    console.error("Failed to load schemes:", err.message);
    res.status(500).json({ error: "Failed to load schemes" });
  }
});

module.exports = router;
