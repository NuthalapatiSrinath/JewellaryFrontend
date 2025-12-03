// src/sections/DiamondFinder/DiamondFinder.jsx
import React, { useMemo, useState } from "react";
import TabSelector from "../../components/TabSelector/TabSelector";
import TickSlider from "../../components/TickSlider/TickSlider";
import Dropdown from "../../components/Dropdown/Dropdown";
import DoubleRangeSlider from "../../components/DoubleRangeSlider/DoubleRangeSlider";
import ProductCardDetails from "../../components/ProductCardDetails/ProductCardDetails";

import styles from "./DiamondFinder.module.css";

const clarityTicks = ["S12", "S11", "VS2", "VS1", "VVS2", "VVS1", "IF", "FL"];
const cutTicks = ["Good", "Very Good", "Excellent", "Astor"];
const colorTicks = ["k", "J", "I", "H", "G", "F", "E", "D"];

function friendlyLabel(name) {
  if (!name) return "";
  const map = { radient: "Radiant" };
  const key = name.toLowerCase();
  if (map[key]) return map[key];
  return key
    .split(/[-_\s]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// formatting helpers
const fmt = new Intl.NumberFormat("en-US");
const fmtCarat = (v) => Number(v).toFixed(2);

/**
 * DiamondFinder
 * - Props:
 *   - onSelectDiamond(product) optional: called when a diamond/product card is clicked
 *
 * Behavior:
 * - Calls onSelectDiamond(product) when a card is clicked.
 * - Also dispatches a DOM event "diamond:selected" with product in detail as a fallback.
 */
export default function DiamondFinder({ onSelectDiamond }) {
  const shapeNames = useMemo(
    () => [
      "princess",
      "pear",
      "radient",
      "heart",
      "asscher",
      "round",
      "emerald",
      "oval",
      "cushion",
      "marquise",
    ],
    []
  );

  const [activeTab, setActiveTab] = useState(0);
  const [selectedShape, setSelectedShape] = useState(null);

  // Carat: min/max double slider
  const [caratMin, setCaratMin] = useState(0.05);
  const [caratMax, setCaratMax] = useState(30);

  // Price: min/max double slider
  const [priceMin, setPriceMin] = useState(200);
  const [priceMax, setPriceMax] = useState(20000);

  // ticks
  const [clarityIndex, setClarityIndex] = useState(4);
  const [cutIndex, setCutIndex] = useState(2);
  const [colorIndex, setColorIndex] = useState(3);

  // bottom controls state
  const [fastShipping, setFastShipping] = useState(false);

  const onToggleShape = (name) => {
    setSelectedShape((prev) => (prev === name ? null : name));
  };

  const resetAll = () => {
    setSelectedShape(null);
    setCaratMin(0.05);
    setCaratMax(30);
    setPriceMin(200);
    setPriceMax(20000);
    setClarityIndex(4);
    setCutIndex(2);
    setColorIndex(3);
    setFastShipping(false);
  };

  // --- DYNAMIC PRODUCTS (mock). Replace with API call when ready ---
  const products = useMemo(() => {
    // Example: create 12 demo products
    const colors = ["gold", "white", "rose"];
    const baseTitle = "Solitaire Diamond Engagement Ring";
    return Array.from({ length: 12 }).map((_, i) => {
      const id = `prod-${i + 1}`;
      const defaultColor = colors[i % colors.length];
      // example variants: provide images that match your public /images folder or external urls
      const variants = {
        gold: `/images/rings/gold.jpg`,
        white: `/images/rings/rose.png`,
        rose: `/images/rings/gold.jpg`,
      };
      return {
        id,
        slug: `solitaire-${i + 1}`,
        title: baseTitle,
        subtitle: "classical Rose Gold model",
        price: `$ ${500 + i * 25} USD`,
        defaultColor,
        variants,
      };
    });
  }, []);

  // Optionally apply simple front-end filters to products (e.g., fastShipping)
  const visibleProducts = useMemo(() => {
    // For now we just return all products; add filter logic if products have attributes
    return products;
  }, [products, fastShipping]);

  // called when a product card is clicked
  const handleCardClick = (product) => {
    // call prop if provided
    try {
      if (typeof onSelectDiamond === "function") onSelectDiamond(product);
    } catch (err) {
      // swallow
    }

    // dispatch a DOM event as fallback/decoupled signal
    try {
      if (
        typeof window !== "undefined" &&
        typeof window.CustomEvent === "function"
      ) {
        window.dispatchEvent(
          new CustomEvent("diamond:selected", { detail: product })
        );
      }
    } catch (err) {
      // ignore
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Diamond Finder</h1>
        <p className={styles.lead}>
          Real. Rare. Responsible. Discover a more intelligent diamond
          experience with gemologist-level tools, advanced filtering, and 100x
          magnification.
        </p>

        {/* Tabs only remain at top */}
        <div className={styles.topRow}>
          <TabSelector
            tabs={["Natural", "Lab Grown"]}
            activeIndex={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </header>

      <section className={styles.filtersSection}>
        <div className={styles.filtersGrid}>
          {/* LEFT column */}
          <div className={styles.col}>
            {/* Shape */}
            <div className={styles.block}>
              <div className={styles.blockHeader}>
                <h3 className={styles.blockTitle}>
                  Shape <span className={styles.info}>ⓘ</span>
                </h3>
              </div>

              <div className={styles.shapeGrid}>
                {shapeNames.map((name) => {
                  const src = `/images/shapes/${name}.svg`;
                  const isActive = selectedShape === name;
                  return (
                    <button
                      key={name}
                      className={`${styles.shapeBtn} ${
                        isActive ? styles.shapeActive : ""
                      }`}
                      title={friendlyLabel(name)}
                      onClick={() => onToggleShape(name)}
                      aria-pressed={isActive}
                    >
                      <img
                        src={src}
                        alt={friendlyLabel(name)}
                        className={styles.shapeImg}
                        onError={(e) =>
                          (e.currentTarget.style.display = "none")
                        }
                      />
                      <div className={styles.shapeLabel}>
                        {friendlyLabel(name)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Carat (double-thumb) */}
            <div className={styles.block}>
              <div className={styles.blockHeader}>
                <h3 className={styles.blockTitle}>
                  Carat <span className={styles.info}>ⓘ</span>
                </h3>
              </div>

              <div className={styles.rowBetween}>
                <div className={styles.caratLabel}>
                  Min Carat{" "}
                  <span className={styles.pill}>{fmtCarat(caratMin)}</span>
                </div>
                <div className={styles.caratLabel}>
                  Max Carat{" "}
                  <span className={styles.pill}>{fmtCarat(caratMax)}</span>
                </div>
              </div>

              <div className={styles.sliderWrap}>
                <DoubleRangeSlider
                  min={0.05}
                  max={30}
                  step={0.01}
                  valueMin={caratMin}
                  valueMax={caratMax}
                  onChange={({ min, max }) => {
                    setCaratMin(min);
                    setCaratMax(max);
                  }}
                />
              </div>
            </div>

            {/* Clarity */}
            <div className={styles.block}>
              <div className={styles.blockHeader}>
                <h3 className={styles.blockTitle}>
                  Clarity <span className={styles.info}>ⓘ</span>
                </h3>
              </div>

              <TickSlider
                ticks={clarityTicks}
                selectedIndex={clarityIndex}
                onChange={setClarityIndex}
              />
            </div>
          </div>

          {/* RIGHT column */}
          <div className={styles.col}>
            {/* Price (double-thumb) */}
            <div className={styles.block}>
              <div className={styles.blockHeader}>
                <h3 className={styles.blockTitle}>Price</h3>
              </div>

              <div className={styles.rowBetween}>
                <div className={`${styles.pricePill} ${styles.priceLeft}`}>
                  $ {fmt.format(priceMin)}
                </div>
                <div className={`${styles.pricePill} ${styles.priceRight}`}>
                  $ {fmt.format(priceMax)}
                </div>
              </div>

              <div className={styles.sliderWrap}>
                <DoubleRangeSlider
                  min={200}
                  max={20000}
                  step={50}
                  valueMin={priceMin}
                  valueMax={priceMax}
                  onChange={({ min, max }) => {
                    setPriceMin(min);
                    setPriceMax(max);
                  }}
                />
              </div>
            </div>

            {/* Color */}
            <div className={styles.block}>
              <div className={styles.blockHeader}>
                <h3 className={styles.blockTitle}>
                  Color <span className={styles.info}>ⓘ</span>
                </h3>
              </div>

              <TickSlider
                ticks={colorTicks}
                selectedIndex={colorIndex}
                onChange={setColorIndex}
              />
            </div>

            {/* Cut */}
            <div className={styles.block}>
              <div className={styles.blockHeader}>
                <h3 className={styles.blockTitle}>
                  Cut <span className={styles.info}>ⓘ</span>
                </h3>
              </div>

              <TickSlider
                ticks={cutTicks}
                selectedIndex={cutIndex}
                onChange={setCutIndex}
              />
            </div>
          </div>
        </div>
      </section>
      <div className={styles.bottomControls}>
        <div className={styles.bottomLeft}>
          <label className={styles.fastShipping}>
            <input
              type="checkbox"
              checked={fastShipping}
              onChange={(e) => setFastShipping(e.target.checked)}
            />
            <span>Fast Shipping</span>
          </label>
        </div>

        <div className={styles.bottomRight}>
          <button className={styles.resetBtn} onClick={resetAll}>
            Reset ⭮
          </button>

          <Dropdown
            label="Sort"
            options={[
              "Recommended",
              "Price: Low to High",
              "Price: High to Low",
            ]}
            className={styles.smallDd}
          />

          <Dropdown
            label="Ship date"
            options={["Anytime", "Next 5 days", "Next 10 days"]}
            className={styles.smallDd}
          />

          <button className={styles.advBtn}>Advanced Filters +</button>
        </div>
      </div>
      {/* --- PRODUCTS (dynamic) — placed below the features --- */}
      <section className={styles.productsSection} aria-label="Product results">
        <div className={styles.productsHeader}>
          <h2 className={styles.productsTitle}>Results</h2>
          <p className={styles.productsCount}>{visibleProducts.length} items</p>
        </div>

        {/* Products grid — pass onCardClick so ProductCardDetails never navigates */}
        <div className={styles.productGrid}>
          {visibleProducts.map((p) => (
            <ProductCardDetails
              key={p.id}
              product={p}
              onCardClick={() => handleCardClick(p)}
              disableNavigation={true} // ensures URL never changes
            />
          ))}
        </div>
      </section>

      {/* BOTTOM CONTROLS ROW */}
    </div>
  );
}
