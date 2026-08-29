// Thin fetch wrappers for the Express backend. Replaces the original
// window.storage.get/set calls and the direct api.anthropic.com fetch.

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8787";
const REQUEST_TIMEOUT_MS = 60000; // matches backend's own ~55s timeout to
// the AI provider, plus headroom — must be >= the backend's timeout or the
// frontend gives up first and masks the real (slow, not stuck) response.

async function request(path, options) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      ...options,
    });
  } catch (e) {
    if (e.name === "AbortError") {
      throw new Error(`Request to ${path} timed out after ${REQUEST_TIMEOUT_MS / 1000}s — is the backend running at ${API_BASE}?`);
    }
    throw new Error(`Could not reach ${API_BASE}${path} — is the backend running? (${e.message})`);
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request to ${path} failed (${res.status})`);
  }
  return res.json();
}

// POST /api/claude — server-side replacement for the original callClaude().
// Same contract: pass {system, user}, get back the parsed JSON object.
export function callClaude(system, user) {
  return request("/api/claude", {
    method: "POST",
    body: JSON.stringify({ system, user }),
  });
}

// GET /api/schemes — curated government scheme list.
export function fetchSchemes() {
  return request("/api/schemes");
}

// GET /api/session/:id — replaces loadPersisted().
export function fetchSession(id) {
  return request(`/api/session/${id}`);
}

// POST /api/session/:id — replaces persist(key, value). Pass any subset of
// { profile, recommendations, savedIdeas, report, theme }.
export function saveSession(id, patch) {
  return request(`/api/session/${id}`, {
    method: "POST",
    body: JSON.stringify(patch),
  });
}
