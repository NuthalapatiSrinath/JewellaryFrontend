// src/pages/WeddingPage/WeddingPage.jsx
import React, { useMemo, useState, useRef, useEffect } from "react";
import CategorySelector from "../../components/CategorySelector/CategorySelector";
import ProductCardAllWhere from "../../components/ProductsCardAllWhere/ProductsCardAllWhere";
import Filters from "../Filters/Filters"; // reuse your Filters sidebar component
import styles from "./WeddingPage.module.css";
import products from "../../data/products"; // your products dataset

const weddingCategories = [
  { name: "ALL", image: "/images/rings/gold.jpg", link: "/wedding/all" },
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

// price parsing util
function parsePrice(priceStr) {
  if (!priceStr) return Number.MAX_SAFE_INTEGER;
  const m = String(priceStr).match(/[\d,.]+/);
  if (!m) return Number.MAX_SAFE_INTEGER;
  return Math.round(Number(m[0].replace(/,/g, "")));
}

/**
 * Simple utility to detect whether a product belongs to a category key.
 * It checks product.category, product.categories, product.tags and title.
 */
function productHasCategoryKeyword(product, keyword) {
  if (!product) return false;
  const k = String(keyword).toLowerCase();
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

export default function WeddingPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Reusable Filters state shape (passed to Filters)
  const [filters, setFilters] = useState({
    sort: "best",
    shapes: [],
    metals: [],
    priceRange: { min: "", max: "" },
  });

  // Filters sidebar open state
  const [showFilters, setShowFilters] = useState(false);

  // sentinel for sticky big filter button
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

  // compute filtered products based on selected category + applied sidebar filters
  const filteredProducts = useMemo(() => {
    const prMin = filters.priceRange?.min
      ? Number(filters.priceRange.min)
      : -Infinity;
    const prMax = filters.priceRange?.max
      ? Number(filters.priceRange.max)
      : Number.MAX_SAFE_INTEGER;

    return products.filter((p) => {
      // category filter (if not ALL)
      const selectedCat = weddingCategories[selectedIndex];
      if (selectedCat && selectedCat.name !== "ALL") {
        // robust detection: check tags/categories/title
        if (!productHasCategoryKeyword(p, selectedCat.name)) return false;
      }

      // shapes from sidebar
      if (filters.shapes && filters.shapes.length) {
        const shp = String(p.shape || "").toLowerCase();
        if (!filters.shapes.includes(shp)) return false;
      }

      // metals from sidebar
      if (filters.metals && filters.metals.length) {
        const m = String(p.defaultColor || p.metal || "").toLowerCase();
        if (!filters.metals.includes(m)) return false;
      }

      // price filter (sidebar)
      const priceNum = parsePrice(p.price);
      if (priceNum < prMin || priceNum > prMax) return false;

      // optional: extra sorts/filters (like availability) would go here

      return true;
    });
  }, [selectedIndex, filters]);

  // helper: when category is changed via selector, navigate to its link (if present)
  const onCategoryChange = (idx) => {
    setSelectedIndex(idx);
    const cat = weddingCategories[idx];
    if (cat && cat.link) {
      // keep existing behaviour used on other pages
      window.location.href = cat.link;
    }
  };

  return (
    <div className={styles.pageWrap}>
      <div className={styles.hero}>
        <div className={styles.breadcrumb}>
          ARRA Jewels &nbsp;/&nbsp; Shop All Wedding
        </div>
        <h1 className={styles.title}>SHOP ALL WEDDING</h1>
        <p className={styles.subtitle}>
          Celebrate your love story. ARRA Jewels’s curated collection of wedding
          bands and rings includes everything from classic to contemporary.
          Explore lab-grown diamond bands in timeless silhouettes, contemporary
          styles, and designs crafted in recycled precious metals to reflect
          your commitment—today and always.
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

      {/* sentinel controls sticky filter button */}
      <div ref={sentinelRef} className={styles.sentinel} />

      {/* Top row - only items count + big FILTER button (small dropdowns removed as requested) */}
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
                No products match your filters.
              </div>
            ) : (
              filteredProducts.map((p) => (
                <ProductCardAllWhere key={p.id} product={p} />
              ))
            )}
          </div>
        </section>
      </main>

      {/* Reusable Filters sidebar (used here) */}
      <Filters
        show={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        setFilters={setFilters}
        // optional: pass wedding-specific shapes and metals
        shapes={[
          "round",
          "oval",
          "princess",
          "emerald",
          "cushion",
          "pear",
          "baguette",
        ]}
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
