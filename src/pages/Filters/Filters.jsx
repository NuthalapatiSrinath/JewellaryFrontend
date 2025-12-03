import React, { useRef, useEffect, useState } from "react";
import styles from "./Filters.module.css";
import RangeSlider from "../../components/RangeSlider/RangeSlider"; // use your slider or the one I gave earlier

const defaultShapes = [
  "round",
  "oval",
  "emerald",
  "cushion",
  "marquise",
  "pear",
  "princess",
  "asscher",
  "heart",
];

const defaultMetals = [
  { key: "white", label: "14K White Gold", color: "#e6e6e6" },
  { key: "gold", label: "14K Yellow Gold", color: "#e9d3a1" },
  { key: "rose", label: "14K Rose Gold", color: "#eac6b6" },
  { key: "platinum", label: "Platinum", color: "#cfcfcf" },
];

export default function Filters({
  show,
  onClose,
  filters,
  setFilters,
  // data-driven style tiles: array of { key, label, link?, img? }
  stylesList = [
    {
      key: "earrings",
      label: "Earrings",
      link: "/jewelry/earrings",
      img: "/images/rings/diamond.png",
    },
    {
      key: "necklaces",
      label: "Necklaces",
      link: "/jewelry/necklaces",
      img: "/images/rings/diamond.png",
    },
    {
      key: "bracelets",
      label: "Bracelets",
      link: "/jewelry/bracelets",
      img: "/images/rings/diamond.png",
    },
    {
      key: "rings",
      label: "Rings & Bands",
      link: "/jewelry/rings",
      img: "/images/rings/diamond.png",
    },
    {
      key: "all",
      label: "Shop All",
      link: "/jewelry/all",
      img: "/images/rings/diamond.png",
    },
    {
      key: "ready",
      label: "Ready to Ship",
      link: "/jewelry/ready",
      img: "/images/rings/diamond.png",
    },
  ],
  // which style keys to display on this page (if undefined -> show all)
  stylesToShow = undefined,
  shapes = defaultShapes,
  metals = defaultMetals,
}) {
  const sidebarRef = useRef(null);
  const [local, setLocal] = useState(
    filters ?? {
      sort: "best",
      styles: [],
      shapes: [],
      metals: [],
      priceRange: { min: "", max: "" },
    }
  );

  useEffect(() => setLocal(filters), [filters]);

  useEffect(() => {
    if (!show) return;
    const onDoc = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target))
        onClose();
    };
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [show, onClose]);

  const toggleArray = (key, val) => {
    setLocal((s) => {
      const arr = s[key] || [];
      return {
        ...s,
        [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val],
      };
    });
  };

  const apply = () => {
    setFilters(local);
    onClose();
  };
  const resetAll = () => {
    setLocal({
      sort: "best",
      styles: [],
      shapes: [],
      metals: [],
      priceRange: { min: "", max: "" },
    });
  };

  const onPriceChange = ({ min, max }) => {
    setLocal((s) => ({ ...s, priceRange: { min, max } }));
  };

  // filtered styles to show on this page
  const visibleStyles = stylesToShow
    ? stylesList.filter((s) => stylesToShow.includes(s.key))
    : stylesList;

  return (
    <>
      <div
        className={`${styles.overlay} ${show ? styles.visible : ""}`}
        onClick={onClose}
      />
      <aside
        ref={sidebarRef}
        className={`${styles.sidebarWrap} ${show ? styles.open : ""}`}
        aria-hidden={!show}
      >
        <div className={styles.sidebarHeader}>
          <h2>FILTER</h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close filters"
          >
            ✕
          </button>
        </div>

        <div className={styles.sidebarContent}>
          <div className={styles.detailsWrap}>
            <details open>
              <summary>Sort By</summary>
              <div className="panelInner">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    paddingTop: 8,
                  }}
                >
                  {["best", "low", "high", "new"].map((k) => (
                    <label key={k} style={{ cursor: "pointer", fontSize: 15 }}>
                      <input
                        type="radio"
                        name="filter-sort"
                        checked={local.sort === k}
                        onChange={() => setLocal((s) => ({ ...s, sort: k }))}
                        style={{ marginRight: 10 }}
                      />
                      {k === "best"
                        ? "Best Selling"
                        : k === "low"
                        ? "Price, Low to High"
                        : k === "high"
                        ? "Price, High to Low"
                        : "Newest First"}
                    </label>
                  ))}
                </div>
              </div>
            </details>
          </div>

          <div className={styles.detailsWrap}>
            <details>
              <summary>Style</summary>
              <div className="panelInner">
                <div className={styles.styleGrid}>
                  {visibleStyles.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      className={styles.tile}
                      onClick={() => {
                        // prefer router in your app; fallback to href
                        if (s.link) window.location.href = s.link;
                      }}
                    >
                      <img
                        src={s.img || "/images/rings/diamond.png"}
                        alt={s.label}
                      />
                      <div className={styles.tileLabel}>{s.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </details>
          </div>

          <div className={styles.detailsWrap}>
            <details>
              <summary>Shape</summary>
              <div className="panelInner">
                <div className={styles.shapeGridLarge}>
                  {shapes.map((s) => {
                    const active = (local.shapes || []).includes(s);
                    return (
                      <button
                        key={s}
                        className={`${styles.tile} ${
                          active ? styles.tileActive : ""
                        }`}
                        onClick={() => toggleArray("shapes", s)}
                        aria-pressed={active}
                      >
                        <img src={`/images/shapes/${s}.svg`} alt={s} />
                        <div className={styles.tileLabel}>{s}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </details>
          </div>

          <div className={styles.detailsWrap}>
            <details>
              <summary>Metal</summary>
              <div className="panelInner">
                <div className={styles.swatchesGrid}>
                  {metals.map((m) => {
                    const active = (local.metals || []).includes(m.key);
                    return (
                      <button
                        key={m.key}
                        className={`${styles.metalTile} ${
                          active ? styles.metalTileActive : ""
                        }`}
                        onClick={() => toggleArray("metals", m.key)}
                        aria-pressed={active}
                      >
                        <div
                          className={styles.metalDot}
                          style={{
                            background: m.color || "#eee",
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                          }}
                          aria-hidden
                        />
                        <div className={styles.metalLabel}>{m.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </details>
          </div>

          <div className={styles.detailsWrap}>
            <details>
              <summary>Price</summary>
              <div className="panelInner">
                <div className={styles.priceRange}>
                  <RangeSlider
                    min={0}
                    max={20000}
                    step={10}
                    valueMin={local.priceRange?.min || 0}
                    valueMax={local.priceRange?.max || 20000}
                    onChange={({ min, max }) => onPriceChange({ min, max })}
                  />
                </div>
              </div>
            </details>
          </div>
        </div>

        <div className={styles.sidebarFooter}>
          <button className={styles.resetBtn} onClick={resetAll}>
            RESET
          </button>
          <button className={styles.applyBtn} onClick={apply}>
            APPLY
          </button>
        </div>
      </aside>
    </>
  );
}
