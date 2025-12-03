import React from "react";
import styles from "./ChooseDiamonds.module.css";

export default function ChooseDiamonds({
  title = "Choose Diamonds",
  // default options: exactly two items (Lab Grown + Natural)
  options = [
    {
      label: "LAB GROWN DIAMONDS",
      image: "/images/diamonds/lab.jpg",
      href: "diamonds/labgrown?type=natural",
    },
    {
      label: "NATURAL DIAMONDS",
      image: "/images/diamonds/natural.jpg",
      href: "diamonds/natural?type=natural",
    },
  ],
}) {
  // Only render the first two options — defensive in case user passes more
  const visible = options.slice(0, 2);

  return (
    <section className={styles.section} aria-labelledby="choose-diamonds-title">
      <h2 id="choose-diamonds-title" className={styles.title}>
        {title}
      </h2>

      <div className={styles.grid}>
        {visible.map((opt, i) => (
          <a
            key={i}
            href={opt.href}
            className={styles.card}
            aria-label={opt.label}
          >
            <img className={styles.img} src={opt.image} alt={opt.label} />
            <div className={styles.overlay} aria-hidden="true" />
            <div className={styles.label}>
              <span className={styles.labelText}>{opt.label}</span>
              <span className={styles.arrow} aria-hidden="true">
                ↗
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
