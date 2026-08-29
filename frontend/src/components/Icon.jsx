import { I } from "../lib/icons";

/**
 * Renders one of the icons from lib/icons.js. Uses dangerouslySetInnerHTML
 * so the exact SVG markup from the original app is preserved 1:1 (same
 * paths, same `class="icon"` sizing hooks used throughout globals.css).
 */
export default function Icon({ name, style, className }) {
  const svg = I[name];
  if (!svg) return null;
  return (
    <span
      style={{ display: "inline-flex", ...style }}
      className={className}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
