/**
 * Server-side AI call, backed by Google's Gemini API (free tier — no
 * credit card required). Keeps the exact same contract the frontend
 * already expects: callAI(system, user) -> parsed JSON object.
 */
async function callAI(system, user) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured on the server");

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig: {
          // 2048 was too small for the RECO/REPORT JSON shapes (3 full
          // recommendation objects with roadmap arrays, or full report
          // sections) — Gemini's output was getting cut off mid-JSON,
          // producing invalid JSON and this exact "Expected ',' or '}'"
          // parse error → 502. Raised to give it enough room to finish.
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
        },
      }),
      signal: controller.signal,
    });
  } catch (e) {
    if (e.name === "AbortError") throw new Error("Timed out reaching the Gemini API — check outbound network access from this server.");
    throw new Error(`Could not reach the Gemini API: ${e.message}`);
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Gemini API error ${res.status} ${errText}`);
  }

  const data = await res.json();
  const text = (data.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("\n");
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

module.exports = { callAI };
