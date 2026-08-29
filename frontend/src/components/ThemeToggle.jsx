import Icon from "./Icon";
import { useStore } from "../store/useStore";

// Ported 1:1 from themeToggleButton(size) in the original app.
export default function ThemeToggle({ size }) {
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const sm = size === "sm";
  return (
    <button
      className={`theme-toggle ${theme === "dark" ? "is-dark" : ""}`}
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      style={sm ? { transform: "scale(.88)" } : undefined}
    >
      <span className="theme-toggle-track">
        <span className="theme-toggle-thumb">
          <Icon name={theme === "dark" ? "moon" : "sun"} />
        </span>
      </span>
    </button>
  );
}
