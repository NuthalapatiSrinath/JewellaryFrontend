// src/pages/WeddingCategories/StackablePage.jsx
import React, { useMemo, useState, useRef, useEffect } from "react";
import CategorySelector from "../../../components/CategorySelector/CategorySelector";
import ProductCardAllWhere from "../../../components/ProductsCardAllWhere/ProductsCardAllWhere";
// adjust Filters import path if your Filters component lives elsewhere
import Filters from "../../Filters/Filters";
import styles from "./StackablePage.module.css"; // reuse the same CSS

// category list (same as other pages)
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

// sample dynamic stackable products — replace with API or props as needed
const dynamicStackableProducts = [
  {
    id: "st-01",
    title: "Slim Stackable Band",
    subtitle: "14K Yellow Gold — Perfect for Stacking",
    price: "$349",
    defaultColor: "gold",
    variants: {
      gold: "/images/rings/gold.jpg",
      white: "/images/rings/diamond.png",
      rose: "/images/rings/rose.png",
    },
    slug: "slim-stackable-band",
    shape: "round",
    tags: ["stackable", "band"],
  },
  {
    id: "st-02",
    title: "Pave Stackable Band",
    subtitle: "18K White Gold with Micro Pave Diamonds",
    price: "$699",
    defaultColor: "white",
    variants: {
      gold: "/images/rings/gold.jpg",
      white: "/images/rings/diamond.png",
      rose: "/images/rings/rose.png",
    },
    slug: "pave-stackable-band",
    shape: "pave",
    tags: ["stackable", "pave"],
  },
  {
    id: "st-03",
    title: "Textured Stackable Ring",
    subtitle: "Rose Gold Textured Finish for a Modern Stack",
    price: "$399",
    defaultColor: "rose",
    variants: {
      gold: "/images/rings/gold.jpg",
      white: "/images/rings/diamond.png",
      rose: "/images/rings/rose.png",
    },
    slug: "textured-stackable-ring",
    shape: "textured",
    tags: ["stackable", "textured"],
  },
];

// helper: parse price string -> number
function parsePrice(priceStr) {
  if (!priceStr) return Number.MAX_SAFE_INTEGER;
  const m = String(priceStr).match(/[\d,.]+/);
  if (!m) return Number.MAX_SAFE_INTEGER;
  return Math.round(Number(m[0].replace(/,/g, "")));
}

// simple detector to check if product matches selected category name
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

export default function StackablePage() {
  const stackableIndex = weddingCategories.findIndex(
    (c) => (c.name || "").toUpperCase() === "STACKABLE"
  );
  const initialIndex = stackableIndex >= 0 ? stackableIndex : 5;
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  // Reusable Filters state object (used by Filters sidebar)
  const [filters, setFilters] = useState({
    sort: "best",
    shapes: [],
    metals: [],
    priceRange: { min: "", max: "" },
  });

  // show / hide sidebar
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

  // filtered products: apply selected category and Filters state
  const filteredProducts = useMemo(() => {
    const prMin = filters.priceRange?.min
      ? Number(filters.priceRange.min)
      : -Infinity;
    const prMax = filters.priceRange?.max
      ? Number(filters.priceRange.max)
      : Number.MAX_SAFE_INTEGER;

    return dynamicStackableProducts.filter((p) => {
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

      // price range filter (sidebar)
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
        <div className={styles.breadcrumb}>ARRA Jewels / Stackable</div>
        <h1 className={styles.title}>STACKABLE WEDDING BANDS</h1>
        <p className={styles.subtitle}>
          Explore our collection of stackable wedding bands — thoughtfully
          crafted to pair perfectly with your engagement ring or create a
          personalized look all your own.
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

      {/* top row: only items count + big FILTER button */}
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
                No stackable products found.
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
        // custom options for stackable page
        shapes={["round", "pave", "textured", "princess", "cushion"]}
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
