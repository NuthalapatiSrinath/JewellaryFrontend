// ChooseDiamond.jsx
import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/slices/modalSlice";

import TabSelector from "../../components/TabSelector/TabSelector";
import ProductCardDetails from "../../components/ProductCardDetails/ProductCardDetails";
import RangeSlider from "../../components/RangeSlider/RangeSlider";
import TickSlider from "../../components/TickSlider/TickSlider";
import Dropdown from "../../components/Dropdown/Dropdown"; // <- your dropdown component

import styles from "./ChooseDiamond.module.css";
import { allProducts } from "../../data/products";

import { FiRefreshCw } from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";
import { IoChevronDownOutline } from "react-icons/io5";

const clarityTicks = ["S12", "S11", "VS2", "VS1", "VVS2", "VVS1", "IF", "FL"];
const cutTicks = ["Good", "Very Good", "Excellent", "Astor"];
const colorTicks = ["K", "J", "I", "H", "G", "F", "E", "D"];

export default function ChooseDiamond() {
  const dispatch = useDispatch();

  // Tab: 0 -> Natural, 1 -> Lab Grown
  const [activeTab, setActiveTab] = useState(0);

  // Filter state (example)
  const [carat, setCarat] = useState(1.0); // single value slider used as example
  const [clarityIndex, setClarityIndex] = useState(4);
  const [cutIndex, setCutIndex] = useState(2);
  const [colorIndex, setColorIndex] = useState(3);

  // Controls row state
  const [fastShipping, setFastShipping] = useState(false);
  const [sortOption, setSortOption] = useState(null);
  const [shipDateOption, setShipDateOption] = useState(null);

  // For demo: split products roughly by id parity to simulate Natural vs Lab Grown
  const naturalProducts = useMemo(
    () => allProducts.filter((p, i) => i % 2 === 0),
    []
  );
  const labProducts = useMemo(
    () => allProducts.filter((p, i) => i % 2 === 1),
    []
  );

  // Create a filtered list using the simple local filters (replace with real logic as needed)
  const visibleProducts = useMemo(() => {
    const base = activeTab === 0 ? naturalProducts : labProducts;
    // example filter: use carat and indexes to simulate filtering
    // (products don't have carat/color/cut fields in your data, so this is illustrative)
    return base.filter((p) => {
      // apply a basic "fastShipping" filter simulation if desired
      if (fastShipping) {
        // if your product has shipping attribute, filter here. For demo we keep all.
      }
      return true;
    });
  }, [activeTab, naturalProducts, labProducts, fastShipping]);

  // --------- NEW: scroll helper to position start 150px below top/steps ---------
  const scrollToStartWithGap = (extraGap = 500, behavior = "smooth") => {
    // choose a target element to align (root of this section)
    const target =
      document.getElementById("choose-diamond-start") ||
      document.querySelector(".page") ||
      document.body;

    // try to measure a design/steps element (if present) to keep consistent with SelectSettingPanel behavior
    const stepSelectors = [
      ".design-steps",
      ".design-progress",
      ".progress",
      ".progress-bar",
      ".design-flow",
      ".designStep",
      ".steps",
      ".stepper",
      ".choose-steps",
    ];
    let stepsEl = null;
    for (const sel of stepSelectors) {
      const el = document.querySelector(sel);
      if (el) {
        stepsEl = el;
        break;
      }
    }

    const stepHeight = stepsEl ? stepsEl.getBoundingClientRect().height : 0;

    // header fallback
    const headerEl = document.querySelector("header");
    const headerHeight = headerEl ? headerEl.offsetHeight : 0;

    const rect = target.getBoundingClientRect
      ? target.getBoundingClientRect()
      : { top: 0 };

    const targetTopDoc = window.scrollY + (rect.top || 0);

    // desiredOffset: prefer stepHeight if found, otherwise headerHeight
    const desiredOffset = (stepHeight || headerHeight) + extraGap;

    const scrollTo = Math.max(0, Math.round(targetTopDoc - desiredOffset));
    window.scrollTo({ top: scrollTo, behavior });
  };
  // ----------------------------------------------------------------------

  const onViewProducts = () => {
    // scroll page so the content sits with extra 150px top gap
    scrollToStartWithGap(150, "smooth");

    // small timeout so scroll starts and any listeners can react before modal opens
    setTimeout(() => {
      dispatch(openModal({ type: "VIEW_PRODUCTS", data: visibleProducts }));
    }, 60);
  };

  const resetFilters = () => {
    setCarat(1.0);
    setClarityIndex(4);
    setCutIndex(2);
    setColorIndex(3);
    setFastShipping(false);
    setSortOption(null);
    setShipDateOption(null);
    // if you have other filters, reset them here
  };

  return (
    <div id="choose-diamond-start" className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Diamond Finder</h1>

        <div className={styles.tabRow}>
          <TabSelector
            tabs={["Natural", "Lab Grown"]}
            activeIndex={activeTab}
            onTabChange={(i) => setActiveTab(i)}
          />

          <button
            className={styles.viewProductsBtn}
            onClick={onViewProducts}
            aria-label="View products in this selection"
          >
            View Products
          </button>
        </div>

        <p className={styles.lead}>
          Real. Rare. Responsible. Discover a more intelligent diamond
          experience.
        </p>
      </header>

      <div className={styles.content}>
        <aside className={styles.filters}>
          <section className={styles.filterBlock}>
            <h3 className={styles.filterTitle}>
              Carat <span className={styles.help}>ⓘ</span>
            </h3>
            <div style={{ marginTop: 8 }}>
              <RangeSlider
                min={0.05}
                max={30}
                step={0.01}
                value={carat}
                onChange={setCarat}
                showLabels
              />
            </div>
          </section>

          <section className={styles.filterBlock}>
            <h3 className={styles.filterTitle}>
              Clarity <span className={styles.help}>ⓘ</span>
            </h3>
            <TickSlider
              ticks={clarityTicks}
              selectedIndex={clarityIndex}
              onChange={setClarityIndex}
              showLabelsAbove
            />
          </section>

          <section className={styles.filterBlock}>
            <h3 className={styles.filterTitle}>
              Cut <span className={styles.help}>ⓘ</span>
            </h3>
            <TickSlider
              ticks={cutTicks}
              selectedIndex={cutIndex}
              onChange={setCutIndex}
              showLabelsAbove={false}
            />
          </section>

          <section className={styles.filterBlock}>
            <h3 className={styles.filterTitle}>
              Color <span className={styles.help}>ⓘ</span>
            </h3>
            <TickSlider
              ticks={colorTicks}
              selectedIndex={colorIndex}
              onChange={setColorIndex}
            />
          </section>
        </aside>

        <main className={styles.gridWrap}>
          <div className={styles.grid}>
            {visibleProducts.map((p) => (
              <ProductCardDetails
                key={p.id}
                product={p}
                onCardClick={() => {
                  // scroll same as above so the page is aligned with 150px extra gap,
                  // then open the product details modal.
                  scrollToStartWithGap(150, "smooth");
                  setTimeout(() => {
                    dispatch(openModal({ type: "VIEW_DETAILS", data: p }));
                  }, 60);
                }}
              />
            ))}

            {/* If no products */}
            {visibleProducts.length === 0 && (
              <div className={styles.empty}>
                No diamonds found for these filters.
              </div>
            )}
          </div>

          {/* Last row controls (left: checkbox, right: filters) */}
          <div className={styles.controlsRow}>
            <div className={styles.controlsLeft}>
              <label className={styles.checkboxWrap}>
                <input
                  type="checkbox"
                  checked={fastShipping}
                  onChange={(e) => setFastShipping(e.target.checked)}
                />
                <span className={styles.checkboxBox} aria-hidden="true" />
                <span className={styles.checkboxLabel}>Fast Shipping</span>
              </label>
            </div>

            <div className={styles.controlsRight}>
              <button
                className={styles.resetBtn}
                onClick={resetFilters}
                aria-label="Reset filters"
              >
                <FiRefreshCw size={16} />
                <span className={styles.resetText}>Reset</span>
              </button>

              <div className={styles.pillGroup}>
                <Dropdown
                  label={sortOption ?? "Sort"}
                  options={[
                    "Relevance",
                    "Price: Low to High",
                    "Price: High to Low",
                    "Newest",
                  ]}
                  onChange={(val) => setSortOption(val)}
                  className={styles.pillDropdown}
                  bgColor="#f3e6f6"
                />

                <Dropdown
                  label={shipDateOption ?? "Ship date"}
                  options={[
                    "Anytime",
                    "Within 3 days",
                    "Within 7 days",
                    "Preorder",
                  ]}
                  onChange={(val) => setShipDateOption(val)}
                  className={styles.pillDropdown}
                  bgColor="#f3e6f6"
                />

                <button
                  className={styles.advancedBtn}
                  onClick={() => {
                    // toggle/open advanced filter panel in your app
                    dispatch(openModal({ type: "ADVANCED_FILTERS" }));
                  }}
                >
                  <AiOutlinePlus size={14} />
                  <span className={styles.advancedText}>Advanced Filters</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
