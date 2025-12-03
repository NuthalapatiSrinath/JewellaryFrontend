// src/pages/WeddingCategories/OtherPage.jsx
import React, { useMemo, useState, useRef, useEffect } from "react";
import CategorySelector from "../../../components/CategorySelector/CategorySelector";
import ProductCardAllWhere from "../../../components/ProductsCardAllWhere/ProductsCardAllWhere";
// adjust Filters import path if your Filters component lives elsewhere
import Filters from "../../Filters/Filters";
import styles from "./OtherPage.module.css"; // reuse same CSS

// category list (same as all pages)
const weddingCategories = [
  { name: "ALL", image: "/images/rings/gold.jpg", link: "/wedding" },
  {
    name: "WEDDING",
    image: "/images/rings/diamond.png",
    link: "/wedding/wedding",
  },
  {
    name: "ANNIVERSARY",
    image: "/images/rings/diamond.png",
    link: "/wedding/anniversary",
  },
  {
    name: "ETERNITY",
    image: "/images/rings/diamond.png",
    link: "/wedding/eternity",
  },
  {
    name: "CURVED",
    image: "/images/rings/diamond.png",
    link: "/wedding/curved",
  },
  {
    name: "STACKABLE",
    image: "/images/rings/diamond.png",
    link: "/wedding/stackable",
  },
  { name: "OTHER", image: "/images/rings/diamond.png", link: "/wedding/other" },
];

// sample dynamic data (plain metal bands)
const dynamicOtherProducts = [
  {
    id: "ot-01",
    title: "Plain Platinum Band",
    subtitle: "High Polish Finish — Timeless and Durable",
    price: "$1,499",
    defaultColor: "white",
    variants: {
      gold: "/images/rings/gold.jpg",
      white: "/images/rings/diamond.png",
      rose: "/images/rings/rose.png",
    },
    slug: "plain-platinum-band",
    tags: ["band", "plain", "metal"],
    shape: "band",
  },
  {
    id: "ot-02",
    title: "Classic Yellow Gold Band",
    subtitle: "Simple, Elegant, 14K Yellow Gold",
    price: "$799",
    defaultColor: "gold",
    variants: {
      gold: "/images/rings/gold.jpg",
      white: "/images/rings/diamond.png",
      rose: "/images/rings/rose.png",
    },
    slug: "classic-yellow-gold-band",
    tags: ["band", "classic"],
    shape: "band",
  },
  {
    id: "ot-03",
    title: "Rose Gold Comfort Fit Band",
    subtitle: "Sleek Design with Smooth Edges",
    price: "$899",
    defaultColor: "rose",
    variants: {
      gold: "/images/rings/gold.jpg",
      white: "/images/rings/diamond.png",
      rose: "/images/rings/rose.png",
    },
    slug: "rose-gold-comfort-fit-band",
    tags: ["band", "comfort"],
    shape: "band",
  },
];

// helper: parse price string -> number
function parsePrice(priceStr) {
  if (!priceStr) return Number.MAX_SAFE_INTEGER;
  const m = String(priceStr).match(/[\d,.]+/);
  if (!m) return Number.MAX_SAFE_INTEGER;
  return Math.round(Number(m[0].replace(/,/g, "")));
}

// helper to detect product category membership (fallback to title/tags)
function productHasCategoryKeyword(product, keyword) {
  if (!product) return false;
  const k = String(keyword || "").toLowerCase();
  if (!k) return false;
  if (product.category && String(product.category).toLowerCase().includes(k))
    return true;
  if (
    Array.isArray(product.categories) &&
    product.categories.some((c) =>
      String(c || "")
        .toLowerCase()
        .includes(k)
    )
  )
    return true;
  if (
    Array.isArray(product.tags) &&
    product.tags.some((t) =>
      String(t || "")
        .toLowerCase()
        .includes(k)
    )
  )
    return true;
  if (product.title && String(product.title).toLowerCase().includes(k))
    return true;
  return false;
}

export default function OtherPage() {
  const otherIndex = weddingCategories.findIndex(
    (c) => (c.name || "").toUpperCase() === "OTHER"
  );
  const initialIndex = otherIndex >= 0 ? otherIndex : 6;
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  // Reusable Filters state (shape / metals / priceRange / sort)
  const [filters, setFilters] = useState({
    sort: "best",
    shapes: [],
    metals: [],
    priceRange: { min: "", max: "" },
  });

  // show/hide filters sidebar
  const [showFilters, setShowFilters] = useState(false);

  // sentinel for sticky FILTER button
  const sentinelRef = useRef(null);
  const [stickyFilterBtn, setStickyFilterBtn] = useState(false);
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => setStickyFilterBtn(!e.isIntersecting)),
      { threshold: 0.05 }
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, []);

  // filtered products using selected category + sidebar filters
  const filteredProducts = useMemo(() => {
    const prMin = filters.priceRange?.min
      ? Number(filters.priceRange.min)
      : -Infinity;
    const prMax = filters.priceRange?.max
      ? Number(filters.priceRange.max)
      : Number.MAX_SAFE_INTEGER;

    return dynamicOtherProducts.filter((p) => {
      // category filter (if not ALL)
      const selectedCat = weddingCategories[selectedIndex];
      if (selectedCat && selectedCat.name !== "ALL") {
        if (!productHasCategoryKeyword(p, selectedCat.name)) return false;
      }

      // shapes filter (sidebar)
      if (filters.shapes && filters.shapes.length) {
        const shp = String(p.shape || "").toLowerCase();
        if (!filters.shapes.includes(shp)) return false;
      }

      // metals filter (sidebar)
      if (filters.metals && filters.metals.length) {
        const m = String(p.defaultColor || p.metal || "").toLowerCase();
        if (!filters.metals.includes(m)) return false;
      }

      // price range
      const priceNum = parsePrice(p.price);
      if (priceNum < prMin || priceNum > prMax) return false;

      return true;
    });
  }, [selectedIndex, filters]);

  const onCategoryChange = (idx) => {
    setSelectedIndex(idx);
    const cat = weddingCategories[idx];
    if (cat && cat.link) window.location.href = cat.link;
  };

  return (
    <div className={styles.pageWrap}>
      <div className={styles.hero}>
        <div className={styles.breadcrumb}>ARRA Jewels / Plain Metal Bands</div>
        <h1 className={styles.title}>PLAIN METAL BANDS</h1>
        <p className={styles.subtitle}>
          Crafted from precious gold or platinum, plain metal bands offer a
          classic, refined look that pairs beautifully with any ring or stands
          strong on its own — perfect for those who appreciate understated
          style.
        </p>
      </div>

      <div className={styles.selectorWrap}>
        <CategorySelector
          categories={weddingCategories}
          selectedIndex={selectedIndex}
          setSelectedIndex={onCategoryChange}
          maxVisitedIndex={weddingCategories.length - 1}
        />
      </div>

      <div ref={sentinelRef} className={styles.sentinel} />

      {/* Top row: items count + big FILTER button */}
      <div
        style={{
          width: "100%",
          padding: "0 12px 18px 12px",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: 18, color: "#111", fontWeight: 500 }}>
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

      <main className={styles.content}>
        <section className={styles.productsSection}>
          <div className={styles.productsGrid}>
            {filteredProducts.length === 0 ? (
              <div className={styles.noResults}>
                No plain metal products found.
              </div>
            ) : (
              filteredProducts.map((p) => (
                <ProductCardAllWhere key={p.id} product={p} />
              ))
            )}
          </div>
        </section>
      </main>

      {/* Reusable Filters sidebar */}
      <Filters
        show={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        setFilters={setFilters}
        // example shapes/metals for plain bands page
        shapes={["band", "comfort", "rounded", "flat"]}
        metals={[
          { key: "gold", label: "14K Yellow Gold", color: "#e7d2ad" },
          { key: "white", label: "Platinum / White", color: "#dde0e2" },
          { key: "rose", label: "14K Rose Gold", color: "#e8c4b6" },
        ]}
      />
    </div>
  );
}
