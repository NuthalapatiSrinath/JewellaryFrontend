import React, { useEffect, useRef, useState } from "react";
import styles from "./HeroSection.module.css";

const slides = [
  {
    id: 1,
    image: "/images/hero1.webp",
    title: "Diamond Rings",
    subtitle: "Specially Crafted for style and elegance",
  },
  {
    id: 2,
    image: "/images/hero2.webp",
  },
  {
    id: 3,
    image: "/images/hero3.webp",
  },
];

export default function HeroSection({ autoplay = true, interval = 3000 }) {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);
  const heroRef = useRef(null);

  // Autoplay loop
  useEffect(() => {
    if (!autoplay) return;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(
      () => setIndex((i) => (i + 1) % slides.length),
      interval
    );
    return () => clearTimeout(timeoutRef.current);
  }, [index, autoplay, interval]);

  // Pause on hover
  useEffect(() => {
    const node = heroRef.current;
    if (!node || !autoplay) return;
    const stop = () => clearTimeout(timeoutRef.current);
    const start = () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(
        () => setIndex((i) => (i + 1) % slides.length),
        interval
      );
    };
    node.addEventListener("mouseenter", stop);
    node.addEventListener("mouseleave", start);
    return () => {
      node.removeEventListener("mouseenter", stop);
      node.removeEventListener("mouseleave", start);
    };
  }, [autoplay, interval]);

  const goTo = (i) => setIndex(i);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.viewport} ref={heroRef}>
          <div
            className={styles.track}
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((s, i) => (
              <div
                key={s.id}
                className={styles.slide}
                style={{ backgroundImage: `url(${s.image})` }}
              >
                <div className={styles.gradient} />
                {/* Show title/subtitle ONLY for the first slide */}
                {i === 0 && (
                  <div className={styles.content}>
                    <h2 className={styles.title}>{s.title}</h2>
                    <div className={styles.underline} />
                    <p className={styles.subtitle}>{s.subtitle}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Dots (optional) */}
          <div className={styles.indicators}>
            {slides.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === index ? styles.active : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
