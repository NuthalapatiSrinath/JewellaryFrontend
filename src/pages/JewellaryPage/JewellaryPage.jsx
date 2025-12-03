// JewelleryAllPage.jsx
import React, { useMemo, useState, useRef, useEffect } from "react";
import Filters from "../Filters/Filters";
import CategorySelector from "../../components/CategorySelector/CategorySelector";
import ProductCardAllWhere from "../../components/ProductsCardAllWhere/ProductsCardAllWhere";
import styles from "./JewellaryPage.module.css";
import products from "../../data/products";

const sharedImg = "/images/rings/diamond.png";
const jewelleryCategories = [
  { name: "ALL", image: sharedImg, link: "/jewellery/all" },
  { name: "EARRINGS", image: sharedImg, link: "/jewellery/earrings" },
  { name: "NECKLACES", image: sharedImg, link: "/jewellery/necklaces" },
  { name: "BRACELETS", image: sharedImg, link: "/jewellery/bracelets" },
  { name: "RINGS & BANDS", image: sharedImg, link: "/jewellery/rings" },
];

function parsePrice(priceStr) {
  if (!priceStr) return Number.MAX_SAFE_INTEGER;
  const m = String(priceStr).match(/[\d,.]+/);
  return m
    ? Math.round(Number(m[0].replace(/,/g, "")))
    : Number.MAX_SAFE_INTEGER;
}

export default function JewelleryPage() {
  const [selectedIndex, setSelectedIndex] = useState(0); // “ALL” selected
  const [filters, setFilters] = useState({
    sort: "best",
    shapes: [],
    metals: [],
    priceMin: "",
    priceMax: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Sticky filter button handling
  const sentinelRef = useRef(null);
  const [stickyFilterBtn, setStickyFilterBtn] = useState(false);
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const obs = new IntersectionObserver(
      (entries) => setStickyFilterBtn(!entries[0].isIntersecting),
      { threshold: 0.05 }
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, []);

  // Filter logic
  const filteredProducts = useMemo(() => {
    const min = filters.priceMin ? Number(filters.priceMin) : -Infinity;
    const max = filters.priceMax
      ? Number(filters.priceMax)
      : Number.MAX_SAFE_INTEGER;

    return products.filter((p) => {
      // apply optional filters
      if (filters.shapes.length) {
        const shp = String(p.shape || "").toLowerCase();
        if (!filters.shapes.includes(shp)) return false;
      }
      if (filters.metals.length) {
        const m = String(p.defaultColor || p.metal || "").toLowerCase();
        if (!filters.metals.includes(m)) return false;
      }
      const pn = parsePrice(p.price);
      if (pn < min || pn > max) return false;
      return true;
    });
  }, [filters]);

  return (
    <div className={styles.pageWrap}>
      {/* ✅ HERO */}
      <div className={styles.hero}>
        <h1
          style={{
            fontFamily: "serif",
            fontSize: 36,
            fontWeight: 500,
            margin: "12px 0",
            textAlign: "center",
          }}
        >
          Lab-Grown Diamond Jewelry
        </h1>
        <p
          style={{
            maxWidth: 980,
            margin: "0 auto",
            textAlign: "center",
            fontSize: 18,
            lineHeight: 1.8,
            color: "#333",
            padding: "0 12px",
          }}
        >
          Featuring eternity bands, tennis bracelets, pendants, and earrings,
          our lab-made jewelry collection is crafted exclusively with the finest{" "}
          <span style={{ textDecoration: "underline", fontWeight: 600 }}>
            Lab-Grown Diamonds
          </span>{" "}
          and 100% recycled precious metals to provide a truly ethical and
          affordable accessory option. Explore our broad range of traditional
          and contemporary styles to find the perfect piece that speaks to you.
        </p>
      </div>

      {/* ✅ Category Selector */}
      <div className={styles.selectorWrap} style={{ paddingBottom: 8 }}>
        <CategorySelector
          categories={jewelleryCategories}
          selectedIndex={selectedIndex}
          setSelectedIndex={(idx) => {
            setSelectedIndex(idx);
            const c = jewelleryCategories[idx];
            if (c && c.link) window.location.href = c.link;
          }}
          maxVisitedIndex={jewelleryCategories.length - 1}
        />
      </div>

      {/* Sentinel for sticky button */}
      <div ref={sentinelRef} className={styles.sentinel} />

      {/* ✅ Top Controls: only “Items count” + big FILTER button */}
      <div
        style={{
          width: "100%",
          padding: "0 12px 18px 12px",
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 500 }}>
          {filteredProducts.length} Items
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {!showFilters && (
            <button
              className={`${styles.bigFilterBtn} ${
                stickyFilterBtn ? styles.sticky : ""
              }`}
              onClick={() => setShowFilters(true)}
              aria-expanded={showFilters}
              aria-controls="filterSidebar"
              title="Open filters"
            >
              <span className={styles.filterIcon}>☰</span> FILTER
            </button>
          )}
        </div>
      </div>

      {/* ✅ Product Grid */}
      <main className={styles.content}>
        <section className={styles.productsSection}>
          <div className={styles.productsGrid}>
            {filteredProducts.length ? (
              filteredProducts.map((p) => (
                <ProductCardAllWhere key={p.id} product={p} />
              ))
            ) : (
              <div className={styles.noResults}>
                No products match your filters.
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ✅ Filters Sidebar (Reusable) */}
      <Filters
        show={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        setFilters={setFilters}
        shapes={[
          "round",
          "oval",
          "emerald",
          "cushion",
          "pear",
          "princess",
          "marquise",
        ]}
        metals={[
          { key: "14k-rose", label: "14K Rose Gold", color: "#e8c4b6" },
          { key: "14k-white", label: "14K White Gold", color: "#dde0e2" },
          { key: "14k-yellow", label: "14K Yellow Gold", color: "#e7d2ad" },
          { key: "platinum", label: "Platinum", color: "#d6d6d6" },
        ]}
      />
    </div>
  );
}
