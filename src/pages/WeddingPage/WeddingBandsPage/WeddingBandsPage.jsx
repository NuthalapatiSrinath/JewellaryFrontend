// src/pages/WeddingPage/WeddingBandsPage.jsx
import React, { useMemo, useState, useRef, useEffect } from "react";
import CategorySelector from "../../../components/CategorySelector/CategorySelector";
import ProductCardAllWhere from "../../../components/ProductsCardAllWhere/ProductsCardAllWhere";
import Filters from "../../Filters/Filters"; // <- adjust path if needed
import styles from "./WeddingBandsPage.module.css"; // reuse same CSS

// category list
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

// local mock/dynamic products (replace later with API or props)
const dynamicWeddingProducts = [
  {
    id: "wb-01",
    title: "Classic Wedding Band",
    subtitle: "14K Yellow Gold, Lab-Grown Diamond",
    price: "$899",
    defaultColor: "gold",
    variants: {
      gold: "/images/rings/gold.jpg",
      white: "/images/rings/diamond.png",
      rose: "/images/rings/rose.png",
    },
    slug: "classic-wedding-band",
    shape: "round",
    tags: ["wedding", "band"],
  },
  {
    id: "wb-02",
    title: "Eternal Love Diamond Band",
    subtitle: "18K White Gold with Brilliant Cut Stones",
    price: "$1,299",
    defaultColor: "white",
    variants: {
      gold: "/images/rings/gold.jpg",
      white: "/images/rings/diamond.png",
      rose: "/images/rings/rose.png",
    },
    slug: "eternal-love-diamond-band",
    shape: "cushion",
    tags: ["wedding", "diamond"],
  },
  {
    id: "wb-03",
    title: "Modern Stacked Wedding Band",
    subtitle: "Dual Tone Design with Micro Pave Diamonds",
    price: "$1,049",
    defaultColor: "rose",
    variants: {
      gold: "/images/rings/gold.jpg",
      white: "/images/rings/diamond.png",
      rose: "/images/rings/rose.png",
    },
    slug: "modern-stacked-wedding-band",
    shape: "princess",
    tags: ["stackable", "modern"],
  },
];

// small helper: parse price string -> number
function parsePrice(priceStr) {
  if (!priceStr) return Number.MAX_SAFE_INTEGER;
  const m = String(priceStr).match(/[\d,.]+/);
  if (!m) return Number.MAX_SAFE_INTEGER;
  return Math.round(Number(m[0].replace(/,/g, "")));
}

// robust category detector (reused pattern)
function productHasCategoryKeyword(product, keyword) {
  if (!product || !keyword) return false;
  const k = String(keyword).toLowerCase();
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

export default function WeddingBandsPage() {
  // pre-select WEDDING tab (index where name === "WEDDING")
  const [selectedIndex, setSelectedIndex] = useState(
    weddingCategories.findIndex((c) => c.name === "WEDDING")
  );

  // Reusable Filters state (shared with Filters sidebar)
  const [filters, setFilters] = useState({
    sort: "best",
    shapes: [],
    metals: [],
    priceRange: { min: "", max: "" },
  });

  // show/hide sidebar
  const [showFilters, setShowFilters] = useState(false);

  // sentinel for sticky filter button
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

  // filtered products (applies category selection + Filters state)
  const filteredProducts = useMemo(() => {
    const prMin = filters.priceRange?.min
      ? Number(filters.priceRange.min)
      : -Infinity;
    const prMax = filters.priceRange?.max
      ? Number(filters.priceRange.max)
      : Number.MAX_SAFE_INTEGER;

    return dynamicWeddingProducts.filter((p) => {
      // category filter (if not ALL)
      const selectedCat = weddingCategories[selectedIndex];
      if (selectedCat && selectedCat.name !== "ALL") {
        if (!productHasCategoryKeyword(p, selectedCat.name)) return false;
      }

      // shapes (sidebar)
      if (filters.shapes && filters.shapes.length) {
        const shp = String(p.shape || "").toLowerCase();
        if (!filters.shapes.includes(shp)) return false;
      }

      // metals (sidebar)
      if (filters.metals && filters.metals.length) {
        const m = String(p.defaultColor || p.metal || "").toLowerCase();
        if (!filters.metals.includes(m)) return false;
      }

      // price (sidebar)
      const priceNum = parsePrice(p.price);
      if (priceNum < prMin || priceNum > prMax) return false;

      return true;
    });
  }, [selectedIndex, filters]);

  // when user switches category via CategorySelector, keep same behaviour as others
  const onCategoryChange = (idx) => {
    setSelectedIndex(idx);
    const cat = weddingCategories[idx];
    if (cat && cat.link) window.location.href = cat.link;
  };

  return (
    <div className={styles.pageWrap}>
      <div className={styles.hero}>
        <div className={styles.breadcrumb}>
          ARRA Jewels / Wedding / Wedding Bands
        </div>
        <h1 className={styles.title}>WEDDING BANDS</h1>
        <p className={styles.subtitle}>
          Whether worn solo, stacked, or alongside an engagement ring, ARRA
          Jewels lab-grown diamond wedding bands offer timeless elegance and
          modern beauty. Thoughtfully crafted from fine precious metals and
          brilliant lab-grown diamonds, each ring is designed to shine with
          lasting quality and effortless sophistication.
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

      {/* sentinel to control sticky FILTER button */}
      <div ref={sentinelRef} className={styles.sentinel} />

      {/* Top row: only item count + big FILTER button (small dropdowns removed) */}
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
              <div className={styles.noResults}>No products found.</div>
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
        // pass wedding-specific options
        shapes={["round", "princess", "cushion", "baguette", "emerald", "pear"]}
        metals={[
          { key: "gold", label: "14K Yellow Gold", color: "#e7d2ad" },
          { key: "white", label: "14K White Gold", color: "#dde0e2" },
          { key: "rose", label: "14K Rose Gold", color: "#e8c4b6" },
          { key: "platinum", label: "Platinum", color: "#d6d6d6" },
        ]}
      />
    </div>
  );
}
