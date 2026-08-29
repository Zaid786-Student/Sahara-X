/**
 * Server-side AI call, backed by Groq's free API running OpenAI's
 * open-weight gpt-oss-120b model. Drop-in replacement for gemini.js —
 * keeps the exact same contract the frontend already expects:
 *   callAI(system, user) -> parsed JSON object.
 *
 * Get a free API key at https://console.groq.com/keys (no credit card
 * required). Set it as GROQ_API_KEY in your backend .env.
 */
async function callAI(system, user) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not configured on the server");

  const model = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
  const url = "https://api.groq.com/openai/v1/chat/completions";

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 55000);
  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        // Groq's free/on-demand tier caps each request at 8000 tokens
        // TOTAL (system + user prompt + response). Sahara X's system
        // prompts run ~2500-3000 tokens, so the response budget has to
        // leave room for that — 5000 keeps total requests safely under
        // the 8000 TPM limit. Raise this only if you upgrade to a paid
        // Groq tier (see console.groq.com/settings/billing).
        max_tokens: 5000,
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });
  } catch (e) {
    if (e.name === "AbortError") throw new Error("Timed out reaching the Groq API — check outbound network access from this server.");
    throw new Error(`Could not reach the Groq API: ${e.message}`);
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Groq API error ${res.status} ${errText}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || "";
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

module.exports = { callAI };
