import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CategorySelector.module.css";

/**
 * Props:
 * - categories: [{ name, image, link }]
 * - selectedIndex: number (optional)
 * - setSelectedIndex: func (optional)
 * - initialIndex: number (optional)
 * - maxVisitedIndex: number (optional) // controls forward navigation
 */
const CategorySelector = ({
  categories = [],
  selectedIndex,
  setSelectedIndex,
  initialIndex = 0,
  maxVisitedIndex = Infinity,
}) => {
  const navigate = useNavigate();
  const activeIndex =
    typeof selectedIndex === "number" ? selectedIndex : initialIndex;

  // store refs for the buttons so we can scroll active into view
  const itemRefs = useRef([]);

  // ensure ref array length matches categories
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, categories.length);
  }, [categories.length]);

  useEffect(() => {
    // keep controlled + uncontrolled consistent (only calls when uncontrolled)
    if (typeof selectedIndex !== "number" && setSelectedIndex) {
      setSelectedIndex(activeIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // whenever activeIndex changes, bring the item to center of the scroll container
  useEffect(() => {
    try {
      const el = itemRefs.current[activeIndex];
      const scrollContainer = el?.closest(`.${styles.header}`);
      if (!el || !scrollContainer) return;

      // compute center scrollLeft to center the element
      const elRect = el.getBoundingClientRect();
      const parentRect = scrollContainer.getBoundingClientRect();
      const offset = elRect.left - parentRect.left;
      const centerPosition = offset - parentRect.width / 2 + elRect.width / 2;

      // smooth scroll; fall back to simple scrollLeft assignment
      if (typeof scrollContainer.scrollTo === "function") {
        scrollContainer.scrollTo({
          left: scrollContainer.scrollLeft + centerPosition,
          behavior: "smooth",
        });
      } else {
        scrollContainer.scrollLeft =
          scrollContainer.scrollLeft + centerPosition;
      }

      // also ensure the DOM element receives focus for keyboard users
      el.focus?.();
    } catch (err) {
      // ignore errors (defensive)
    }
  }, [activeIndex]);

  const handleClick = (index, link) => {
    // allow going back freely; block clicking ahead of progress if limited
    if (index <= maxVisitedIndex) {
      if (setSelectedIndex) setSelectedIndex(index);
      // navigate to page if link provided
      if (link) navigate(link);
    } else {
      // optional: you could show a tooltip or animation here
      return;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerWrap}>
        <nav className={styles.header} aria-label="Category selector">
          {categories.map((cat, idx) => {
            const isActive = idx === activeIndex;
            const isCompleted = idx < activeIndex;
            const itemClass = `${styles.stepItem} ${
              isActive
                ? styles.activeStep
                : isCompleted
                ? styles.completedStep
                : ""
            }`;

            return (
              <div key={`${cat.name}-${idx}`} className={styles.stepWrap}>
                <button
                  ref={(el) => (itemRefs.current[idx] = el)}
                  type="button"
                  className={itemClass}
                  onClick={() => handleClick(idx, cat.link)}
                  aria-current={isActive ? "true" : undefined}
                >
                  <div className={styles.stepImage}>
                    <img src={cat.image} alt={cat.name} />
                  </div>
                  <div className={styles.stepLabel}>{cat.name}</div>
                </button>

                <span className={styles.divider} aria-hidden="true" />
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default CategorySelector;
