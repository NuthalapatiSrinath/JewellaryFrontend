import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import styles from "./SpotlightSection.module.css";
import SpotlightCard from "../../components/SpotlightCard/SpotlightCard";
import PillBadge from "../../components/PillBadge/PillBadge";

const DEFAULT_CARDS = [
  {
    image: "/images/blog-1.png",
    avatar: "/images/team1.jpg",
    author: "Sophie lee",
    title: "How Technology is Shaping Our World",
    excerpt:
      "Technology is revolutionizing every aspect of our lives. From how we communicate to how we work. AI is advancing at an exponential rate.",
    date: "19 Jan 2002",
    href: "#",
  },
  {
    image: "/images/blog-1.png",
    avatar: "/images/team1.jpg",
    author: "Rahul Sharma",
    title: "AI: Transforming Everyday Apps",
    excerpt:
      "Small intelligent features deliver big improvements in usability. The next phase of AI is revolutionizing the way we use applications.",
    date: "04 Mar 2023",
    href: "#",
  },
  {
    image: "/images/blog-1.png",
    avatar: "/images/team1.jpg",
    author: "Maya Singh",
    title: "Design Systems and Scale",
    excerpt:
      "Design systems help teams stay consistent. Scalability is crucial when working on large projects. Improve your workflow and efficiency with good systems.",
    date: "12 Jul 2024",
    href: "#",
  },
  {
    image: "/images/blog-1.png",
    avatar: "/images/team1.jpg",
    author: "Arjun K",
    title: "Privacy-first Product Decisions",
    excerpt:
      "Privacy by design is a competitive advantage. It’s important to build trust with users. Data privacy is becoming the key issue for businesses.",
    date: "02 Feb 2024",
    href: "#",
  },
  {
    image: "/images/blog-1.png",
    avatar: "/images/team1.jpg",
    author: "Priya R",
    title: "Serverless for Side Projects",
    excerpt:
      "Serverless lets you prototype quickly. Only pay for what you use. It's the ideal solution for small and side projects that scale.",
    date: "29 Nov 2022",
    href: "#",
  },
  {
    image: "/images/blog-1.png",
    avatar: "/images/team1.jpg",
    author: "David Li",
    title: "Building Accessible Experiences",
    excerpt:
      "Accessibility ensures your product works for everyone. Not just a subset. It's time to make your experiences inclusive for all users.",
    date: "10 Jun 2021",
    href: "#",
  },
];

export default function SpotlightSection({
  title = "Spotlight",
  subtitle = `Stay ahead in the digital age with insights on how technology is reshaping industries, enhancing our daily lives, and driving future innovations.`,
  cards = DEFAULT_CARDS,
}) {
  const scrollerRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const updateEnds = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 2);
    setCanNext(el.scrollLeft < max - 2);
  }, []);

  useEffect(() => {
    updateEnds();
    const onResize = () => updateEnds();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [updateEnds, cards]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateEnds, { passive: true });
    return () => el.removeEventListener("scroll", updateEnds);
  }, [updateEnds]);

  const getStep = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return 0;
    const item = el.querySelector("[data-card-index]");
    const width = item ? item.offsetWidth : el.clientWidth / 3;
    const gap = 16;
    return width + gap;
  }, []);

  const scrollLeft = () => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: -getStep(), behavior: "smooth" });
  };

  const scrollRight = () => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: +getStep(), behavior: "smooth" });
  };

  // 🔁 Auto-scroll every 4s; snap to start at the end (same behavior as your previous version)
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let intervalId = null;
    let isAnimating = false;

    const stepOnce = () => {
      if (!el || isPaused || isAnimating) return;

      const advance = getStep();
      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      const next = Math.min(el.scrollLeft + advance, maxScrollLeft);

      if (next >= maxScrollLeft - 2) {
        isAnimating = true;
        el.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
        // after the smooth scroll finishes, jump back to start
        setTimeout(() => {
          el.scrollTo({ left: 0, behavior: "auto" });
          isAnimating = false;
          updateEnds();
        }, 600);
      } else {
        el.scrollTo({ left: next, behavior: "smooth" });
      }
    };

    intervalId = setInterval(stepOnce, 4000);
    return () => clearInterval(intervalId);
  }, [cards, isPaused, getStep, updateEnds]);

  return (
    <section className={styles.section}>
      <div className={styles.headingWrap}>
        <PillBadge text={title} highlightChars={6} verticalShrink={1} />
      </div>
      <p className={styles.subtext}>{subtitle}</p>

      <div className={styles.container}>
        {/* viewport anchors the absolute-positioned arrows (ShopByShape style) */}
        <div className={styles.viewport}>
          <div
            className={styles.scroller}
            ref={scrollerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            <div className={styles.scrollerInner}>
              {cards.map((c, idx) => (
                <div
                  key={idx}
                  data-card-index={idx}
                  className={styles.scrollerItem}
                >
                  <SpotlightCard {...c} />
                </div>
              ))}
            </div>
          </div>

          {/* ShopByShape-like nav buttons */}
          <button
            type="button"
            className={`${styles.nav} ${styles.left}`}
            onClick={scrollLeft}
            disabled={!canPrev}
            aria-label="Previous"
          >
            ‹
          </button>

          <button
            type="button"
            className={`${styles.nav} ${styles.right}`}
            onClick={scrollRight}
            disabled={!canNext}
            aria-label="Next"
          >
            ›
          </button>
        </div>

        <div className={styles.linkWrap}>
          <Link to="/journal" className={styles.link}>
            Go to Blogs Page &gt;&gt;
          </Link>
        </div>
      </div>
    </section>
  );
}
