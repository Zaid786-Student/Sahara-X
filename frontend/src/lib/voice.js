// Thin wrapper around the browser's native Web Speech API.
// Replaces the old setTimeout() simulation with real
// speech-to-text (SpeechRecognition) and text-to-speech (SpeechSynthesis).
// No server round-trip is needed for the audio itself — only the
// transcribed text is sent to the backend for query processing.
//
// Browser support: Chrome, Edge, and Safari (iOS/macOS) implement
// SpeechRecognition (Safari/Chrome need the `webkit` prefix). Firefox does
// not implement it as of this writing — isSTTSupported() will correctly
// report false there, and the UI should fall back to a "type instead" flow.

const SpeechRecognitionImpl =
  typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

export function isSTTSupported() {
  return !!SpeechRecognitionImpl;
}

export function isTTSSupported() {
  return typeof window !== "undefined" && !!window.speechSynthesis;
}

// profile.language ("English" | "हिंदी") -> BCP-47 recognition/synthesis tag.
export const LANG_MAP = { English: "en-IN", "हिंदी": "hi-IN" };

/**
 * Creates a one-shot recognizer. Call .start() to begin listening;
 * it stops automatically on a pause in speech (continuous: false) or when
 * .stop() is called manually.
 *
 * lang: BCP-47 tag, e.g. "en-IN" or "hi-IN"
 * onInterim(text): fired repeatedly with the best-guess partial transcript
 * onFinal(text): fired once with the finalized transcript for an utterance
 * onError(code): fired on failure (e.g. "no-speech", "not-allowed")
 * onEnd(): fired when the recognizer session ends, for any reason
 */
export function createRecognizer({ lang, onInterim, onFinal, onError, onEnd }) {
  if (!SpeechRecognitionImpl) return null;
  const rec = new SpeechRecognitionImpl();
  rec.lang = lang;
  rec.continuous = false;
  rec.interimResults = true;
  rec.maxAlternatives = 1;

  rec.onresult = (event) => {
    let interim = "";
    let final = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      if (result.isFinal) final += result[0].transcript;
      else interim += result[0].transcript;
    }
    if (interim) onInterim && onInterim(interim);
    if (final.trim()) onFinal && onFinal(final.trim());
  };
  rec.onerror = (event) => onError && onError(event.error);
  rec.onend = () => onEnd && onEnd();
  return rec;
}

let voicesCache = [];
if (isTTSSupported()) {
  const loadVoices = () => {
    voicesCache = window.speechSynthesis.getVoices();
  };
  loadVoices();
  // Voices load asynchronously in most browsers.
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

function pickVoice(lang) {
  if (!voicesCache.length) voicesCache = window.speechSynthesis.getVoices();
  const exact = voicesCache.find((v) => v.lang === lang);
  if (exact) return exact;
  const prefix = lang.split("-")[0];
  return voicesCache.find((v) => v.lang && v.lang.startsWith(prefix)) || null;
}

export function speak(text, lang) {
  if (!isTTSSupported() || !text) return;
  window.speechSynthesis.cancel(); // don't let utterances stack
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  const voice = pickVoice(lang);
  if (voice) utter.voice = voice;
  utter.rate = 0.98;
  window.speechSynthesis.speak(utter);
}

export function stopSpeaking() {
  if (isTTSSupported()) window.speechSynthesis.cancel();
}
