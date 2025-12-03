import React from "react";
import styles from "./HeroBanner.module.css";

export default function HeroBanner({
  imageSrc,
  title,
  subtitle,
  fullWidth = false,
}) {
  if (!imageSrc && !title && !subtitle) return null;
  return (
    <header
      className={`${styles.hero} ${fullWidth ? styles.fullWidth : ""}`}
      aria-label="Page hero"
    >
      {imageSrc && (
        <img
          src={imageSrc}
          alt={title || "Hero image"}
          className={styles.heroImg}
        />
      )}
      <div className={styles.heroOverlay} />
      <div className={styles.heroText}>
        {title && <h2 className={styles.heroTitle}>{title}</h2>}
        {subtitle && <p className={styles.heroSubtitle}>{subtitle}</p>}
      </div>
    </header>
  );
}
