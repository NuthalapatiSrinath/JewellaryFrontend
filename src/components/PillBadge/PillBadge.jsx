// PillBadge.jsx - partial-only LG pill
import React from "react";
import styles from "./PillBadge.module.css";

/**
 * PillBadge (partial-only, LG)
 *
 * Props:
 *  - text (string) required
 *  - highlightChars (number) optional: how many characters to cover (default 4)
 *  - verticalShrink (number | string) optional: px to shrink highlight vertically (default 8)
 *
 * Example:
 *  <PillBadge text="Spotlight" highlightChars={4} />
 */
export default function PillBadge({
  text,
  highlightChars = 6,
  verticalShrink = 1,
  ...rest
}) {
  const safeChars = Math.max(
    1,
    Math.min(12, Math.round(Number(highlightChars) || 4))
  );
  // allow verticalShrink to be passed as number (px) or string ("8px")
  const safeShrink =
    typeof verticalShrink === "number" ? `${verticalShrink}px` : verticalShrink;

  const style = {
    // set CSS variables consumed by the module css
    ["--highlight-chars"]: safeChars,
    ["--highlight-vertical-shrink"]: safeShrink,
  };

  return (
    <span
      {...rest}
      className={`${styles.pill} ${styles.lg}`}
      style={style}
      aria-label={text}
    >
      <span className={styles.text}>{text}</span>
    </span>
  );
}
