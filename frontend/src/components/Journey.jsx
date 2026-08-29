import Icon from "./Icon";

// Ported 1:1 from journeyComponent(stages, activeIdx) in the original app.
export default function Journey({ stages, activeIdx }) {
  return (
    <div className="journey">
      {stages.map((s, i) => (
        <div key={s} className={`journey-step ${i < activeIdx ? "done" : ""} ${i === activeIdx ? "active" : ""}`}>
          <div className="journey-line"></div>
          <div className="journey-dot">{i < activeIdx ? <Icon name="check" /> : i + 1}</div>
          <div className="journey-label">{s}</div>
        </div>
      ))}
    </div>
  );
}
