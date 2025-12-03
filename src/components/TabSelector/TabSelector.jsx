import React, { useEffect, useRef, useState } from "react";
import styles from "./TabSelector.module.css";

/**
 * TabSelector (no routing)
 * - measures the active tab DOM node and positions the indicator to match exactly
 * Props:
 * - tabs: array of { label } or strings
 * - activeIndex?: number (controlled)
 * - onTabChange?: (index) => void
 */
export default function TabSelector({
  tabs = [],
  activeIndex: controlledIndex,
  onTabChange,
}) {
  const isControlled = typeof controlledIndex === "number";
  const [internalIndex, setInternalIndex] = useState(controlledIndex ?? 0);
  const activeIndex = isControlled ? controlledIndex : internalIndex;

  const containerRef = useRef(null);
  const tabRefs = useRef([]);
  tabRefs.current = tabs.map((_, i) => tabRefs.current[i] ?? React.createRef());

  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    borderRadius: 999,
  });

  // measure active tab and position indicator
  useEffect(() => {
    function update() {
      const container = containerRef.current;
      const activeEl = tabRefs.current[activeIndex]?.current;
      if (!container || !activeEl) return;

      const cRect = container.getBoundingClientRect();
      const tRect = activeEl.getBoundingClientRect();

      // compute coordinates relative to container
      const left = Math.round(tRect.left - cRect.left + container.scrollLeft);
      const top = Math.round(tRect.top - cRect.top + container.scrollTop);
      const width = Math.round(tRect.width);
      const height = Math.round(tRect.height);

      // borderRadius: make it pill-like relative to height
      const borderRadius = Math.round(height / 2);

      setIndicatorStyle({ left, top, width, height, borderRadius });
    }

    // initial and on resize
    update();
    window.addEventListener("resize", update);
    // also observe font/load changes
    const ro = new ResizeObserver(() => update());
    // observe container and each tab
    if (containerRef.current) ro.observe(containerRef.current);
    tabRefs.current.forEach((r) => r.current && ro.observe(r.current));

    return () => {
      window.removeEventListener("resize", update);
      ro.disconnect();
    };
  }, [activeIndex, tabs]);

  useEffect(() => {
    if (!isControlled) return;
    setInternalIndex(controlledIndex);
  }, [controlledIndex, isControlled]);

  const changeIndex = (idx) => {
    if (idx < 0) idx = 0;
    if (idx > tabs.length - 1) idx = tabs.length - 1;
    if (!isControlled) setInternalIndex(idx);
    if (typeof onTabChange === "function") onTabChange(idx);
    // focus new tab for keyboard users
    const el = tabRefs.current[idx]?.current;
    if (el) el.focus();
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      changeIndex(activeIndex - 1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      changeIndex(activeIndex + 1);
    }
    if (e.key === "Home") {
      e.preventDefault();
      changeIndex(0);
    }
    if (e.key === "End") {
      e.preventDefault();
      changeIndex(tabs.length - 1);
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      changeIndex(activeIndex);
    }
  };

  return (
    <div
      className={styles.TabSelector}
      ref={containerRef}
      role="tablist"
      aria-label="Tabs"
      onKeyDown={onKeyDown}
    >
      {/* indicator anchored to the exact tab rect */}
      <div
        className={styles.indicator}
        style={{
          left: indicatorStyle.left ? `${indicatorStyle.left}px` : undefined,
          top: indicatorStyle.top ? `${indicatorStyle.top}px` : undefined,
          width: indicatorStyle.width ? `${indicatorStyle.width}px` : undefined,
          height: indicatorStyle.height
            ? `${indicatorStyle.height}px`
            : undefined,
          borderRadius: indicatorStyle.borderRadius
            ? `${indicatorStyle.borderRadius}px`
            : undefined,
        }}
        aria-hidden="true"
      />

      <div className={styles.TabOptionsContainer}>
        {tabs.map((t, i) => {
          const label = typeof t === "string" ? t : t.label;
          const isActive = i === activeIndex;
          return (
            <button
              key={i}
              ref={(el) => (tabRefs.current[i].current = el)}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              className={`${styles.TabOption} ${isActive ? styles.active : ""}`}
              onClick={() => changeIndex(i)}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
