import Icon from "../components/Icon";
import { useStore } from "../store/useStore";
import { t } from "../lib/i18n";

const EXAMPLE = { English: "\"I have fifty thousand rupees and I live in a village.\"", "हिंदी": "\"मेरे पास पचास हजार रुपये हैं और मैं गांव में रहता हूं।\"" };

export default function Voice() {
  const voiceListening = useStore((s) => s.voiceListening);
  const voiceProcessing = useStore((s) => s.voiceProcessing);
  const voiceInterim = useStore((s) => s.voiceInterim);
  const voiceError = useStore((s) => s.voiceError);
  const voiceLog = useStore((s) => s.voiceLog);
  const voiceSupported = useStore((s) => s.voiceSupported);
  const voiceTTSSupported = useStore((s) => s.voiceTTSSupported);
  const toggleVoice = useStore((s) => s.toggleVoice);
  const setVoiceLang = useStore((s) => s.setVoiceLang);
  const language = useStore((s) => s.profile.language);
  const tt = (key, ...args) => t(language, key, ...args);

  const statusLabel = voiceListening ? tt("listening") : voiceProcessing ? tt("thinking") : tt("tap_to_speak");

  return (
    <>
      <div className="topbar-page">
        <div>
          <h1 className="page-title">{tt("ask_sahara")}</h1>
          <p className="page-sub">{tt("voice_page_sub")}</p>
        </div>
      </div>

      <div className="card" style={{ padding: "48px 24px", marginTop: 16, textAlign: "center" }}>
        <button
          className={`mic-btn ${voiceListening ? "listening" : ""}`}
          onClick={toggleVoice}
          disabled={!voiceSupported || voiceProcessing}
          aria-label={voiceListening ? "Stop listening" : "Start listening"}
        >
          <div className="mic-ring"></div>
          <Icon name="mic" />
        </button>

        <p style={{ marginTop: 20, fontWeight: 600, color: "var(--indigo-text)" }}>{statusLabel}</p>

        {voiceInterim ? (
          <p className="hi" style={{ fontSize: 14, color: "var(--indigo-text)", marginTop: 6, minHeight: 18 }}>{voiceInterim}</p>
        ) : (
          <p className="hi" style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 6, minHeight: 18 }}>
            {language === "हिंदी" ? EXAMPLE["हिंदी"] : EXAMPLE.English}
          </p>
        )}

        {voiceSupported && (
          <div className="voice-lang-row">
            <button
              className={`chip-toggle ${language === "English" ? "sel" : ""}`}
              onClick={() => setVoiceLang("English")}
              disabled={voiceListening || voiceProcessing}
              type="button"
            >
              English
            </button>
            <button
              className={`chip-toggle hi ${language === "हिंदी" ? "sel" : ""}`}
              onClick={() => setVoiceLang("हिंदी")}
              disabled={voiceListening || voiceProcessing}
              type="button"
            >
              हिंदी
            </button>
          </div>
        )}
      </div>

      {voiceError && (
        <div className="voice-error">
          <Icon name="alert" /> {voiceError}
        </div>
      )}

      {voiceLog.length > 0 && (
        <div className="voice-log" style={{ marginTop: 24 }}>
          {voiceLog.map((v, i) => (
            <div key={i} className={`voice-bubble ${v.role}`}>{v.text}</div>
          ))}
          {voiceProcessing && (
            <div className="voice-bubble ai">
              <span className="voice-typing"><span></span><span></span><span></span></span>
            </div>
          )}
        </div>
      )}

      {!voiceSupported ? (
        <p className="tag-note" style={{ textAlign: "center", marginTop: 10 }}>
          <Icon name="alert" /> {tt("voice_unsupported")}
        </p>
      ) : (
        <p className="tag-note" style={{ textAlign: "center", marginTop: 10 }}>
          <Icon name="alert" /> {tt("voice_supported_note")}
          {!voiceTTSSupported ? tt("voice_no_tts") : ""}
        </p>
      )}
    </>
  );
}
