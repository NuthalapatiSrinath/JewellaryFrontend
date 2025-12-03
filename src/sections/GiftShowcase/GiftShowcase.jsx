import React, { useState } from "react";
import styles from "./GiftShowcase.module.css";
import PillBadge from "../../components/PillBadge/PillBadge";

export default function GiftShowCase({
  title = "For every need and day",
  images = [
    "/images/gifts/g1.jpg",
    "/images/gifts/g2.jpg",
    "/images/gifts/g3.jpg",
    "/images/gifts/g4.jpg",
    "/images/gifts/g5.jpg",
    "/images/gifts/g1.jpg",
    "/images/gifts/g2.jpg",
    "/images/gifts/g3.jpg",
    "/images/gifts/g4.jpg",
    "/images/gifts/g5.jpg",
  ],
  ctaText = "Gift Jewellery",
  ctaHref = "/gifts", // wire your link later
  loop = false, // set true if you ever want infinite
}) {
  const [center, setCenter] = useState(2); // middle image to start

  const move = (dir) => {
    setCenter((prev) => {
      const next = prev + dir;
      if (loop) {
        const m = images.length;
        return ((next % m) + m) % m;
      }
      if (next < 0 || next >= images.length) return prev; // non-looping
      return next;
    });
  };

  const atStart = !loop && center === 0;
  const atEnd = !loop && center === images.length - 1;

  return (
    <section className={styles.section} aria-labelledby="gift-title">
      <div className={styles.header}>
        <PillBadge
          id="gift-title"
          text={title}
          highlightChars={6}
          verticalShrink={1}
        />
      </div>

      <div className={styles.stage}>
        <button
          className={`${styles.nav} ${styles.left}`}
          onClick={() => move(-1)}
          disabled={atStart}
          aria-label="Previous"
        >
          ‹
        </button>

        <div className={styles.deck}>
          {images.map((src, i) => {
            const pos = i - center; // -2,-1,0,1,2
            if (pos < -2 || pos > 2) return null; // only 5 visible
            const cls =
              pos === 0
                ? styles.s0
                : pos === -1
                ? styles.s_1
                : pos === -2
                ? styles.s_2
                : pos === 1
                ? styles.s1
                : styles.s2;

            return (
              <figure key={i} className={`${styles.card} ${cls}`}>
                <img src={src} alt={`Gift ${i + 1}`} />
              </figure>
            );
          })}
        </div>

        <button
          className={`${styles.nav} ${styles.right}`}
          onClick={() => move(1)}
          disabled={atEnd}
          aria-label="Next"
        >
          ›
        </button>
      </div>

      <div className={styles.ctaWrap}>
        <a href={ctaHref} className={styles.cta}>
          {ctaText} <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
