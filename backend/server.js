require("dotenv").config();
const express = require("express");
const cors = require("cors");

const claudeRoute = require("./src/routes/claude");
const schemesRoute = require("./src/routes/schemes");
const sessionRoute = require("./src/routes/session");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/claude", claudeRoute);
app.use("/api/schemes", schemesRoute);
app.use("/api/session", sessionRoute);

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  console.log(`Sahara X backend listening on port ${PORT}`);
});
