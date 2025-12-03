import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./JournelPageSection.module.css";
import PillBadge from "../../components/PillBadge/PillBadge";
import BlogCard from "../../components/BlogCard/BlogCard";

const POPULAR = [
  {
    image: "/images/journal/journal1.jpg",
    title: "New Jewellery Trends year 2025",
    date: "Jan 2025, 10:00 PM",
    content:
      "An engagement ring is more than just jewelry—it’s a timeless symbol of love, commitment, and a promise to share life’s journey together. From colored gemstones to artisanal metalwork, 2025 embraces individuality. Expect bold silhouettes, stackable rings, and conscious sourcing to define the year’s most-loved designs.",
  },
  {
    image: "/images/journal/journal2.jpg",
    title: "New Jewellery Trends year 2025",
    date: "Jan 2025, 10:00 PM",
    content:
      "An engagement ring is more than just jewelry—it’s a timeless symbol of love, commitment, and a promise to share life’s journey together. Minimalist bands are getting a sculptural twist, while lab-grown diamonds continue to gain traction for their value and sustainability credentials.",
  },
  {
    image: "/images/journal/journal3.jpg",
    title: "New Jewellery Trends year 2025",
    date: "Jan 2025, 10:00 PM",
    content:
      "An engagement ring is more than just jewelry—it’s a timeless symbol of love, commitment, and a promise to share life’s journey together. Look for warmer gold tones, mixed textures, and sentimental charms that layer easily for personal stories.",
  },
  {
    image: "/images/journal/journal1.jpg",
    title: "Sculptural Minimal Bands",
    date: "Jan 2025, 10:00 PM",
    content:
      "Clean lines meet soft curves for pieces you can wear every day. Designers explore negative space and soft geometry to create silhouettes that feel both modern and timeless.",
  },
  {
    image: "/images/journal/journal2.jpg",
    title: "Lab-Grown Diamonds Rise",
    date: "Jan 2025, 10:00 PM",
    content:
      "Ethical sourcing and strong value keep these in the spotlight. Expect more colored lab stones and fancy cuts as technology improves clarity and consistency.",
  },
  {
    image: "/images/journal/journal3.jpg",
    title: "The Charm Revival",
    date: "Jan 2025, 10:00 PM",
    content:
      "Personal storytelling returns with meaningful charms and talismans. Layer light chains, mini medallions and engraved motifs to build a signature stack.",
  },
];

const OTHER = [
  {
    image: "/images/journal/journal1.jpg",
    title: "Statement Earrings",
    date: "Jan 2025, 10:00 PM",
    content:
      "Statement earrings with airy silhouettes and stone clusters keep the look light yet luxurious. Mix sizes and textures for dimension.",
  },
  {
    image: "/images/journal/journal2.jpg",
    title: "Modern Bridal Shapes",
    date: "Jan 2025, 10:00 PM",
    content:
      "Pear cuts, ovals, and unique halos continue to be favorites for modern brides. Sleek bands give focus to the center stone.",
  },
  {
    image: "/images/journal/journal3.jpg",
    title: "Earth-First Materials",
    date: "Jan 2025, 10:00 PM",
    content:
      "Sustainable materials and recycled gold are now a must-have for conscious shoppers. Transparency builds trust.",
  },
];

/** Reusable carousel for both sections (fixed arrows + 5s autoplay) */
function CarouselDeck({ items, truncateAt = 220 }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const getPageSize = () => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1440;
    if (w <= 640) return 1;
    if (w <= 1024) return 2;
    return 3;
  };
  const [pageSize, setPageSize] = useState(getPageSize());

  const pages = useMemo(
    () => Math.max(1, Math.ceil(items.length / pageSize)),
    [items.length, pageSize]
  );

  const next = () => setPageIndex((i) => (i + 1) % pages);
  const prev = () => setPageIndex((i) => (i - 1 + pages) % pages);

  // 5s autoplay
  useEffect(() => {
    if (paused) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 5000);
    return () => clearInterval(timerRef.current);
  }, [paused, pages, pageIndex, pageSize]);

  // re-calc on resize, keep arrows fixed via CSS (top: var(--navY))
  useEffect(() => {
    const onResize = () => setPageSize(getPageSize());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const start = pageIndex * pageSize;
  const visible = items.slice(start, start + pageSize);

  return (
    <div
      className={styles.viewport}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <button
        type="button"
        className={`${styles.nav} ${styles.left}`}
        onClick={prev}
        aria-label="Previous"
      >
        ‹
      </button>

      <div className={styles.grid}>
        {visible.map((p, i) => (
          <BlogCard key={`card-${start + i}`} {...p} truncateAt={truncateAt} />
        ))}
      </div>

      <button
        type="button"
        className={`${styles.nav} ${styles.right}`}
        onClick={next}
        aria-label="Next"
      >
        ›
      </button>
    </div>
  );
}

export default function JournelPageSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Most Popular */}
        <div className={styles.badgeLeft}>
          <PillBadge
            text="Most Popular"
            highlightChars={6}
            verticalShrink={1}
          />
        </div>
        <CarouselDeck items={POPULAR} />

        {/* Other categories */}
        <div className={styles.badgeCenter}>
          <PillBadge
            text="Other categories"
            highlightChars={6}
            verticalShrink={1}
          />
        </div>
        <CarouselDeck items={OTHER} />
      </div>
    </section>
  );
}
