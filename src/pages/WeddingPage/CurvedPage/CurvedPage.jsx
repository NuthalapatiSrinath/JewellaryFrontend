// src/pages/WeddingCategories/CurvedPage.jsx
import React, { useMemo, useState, useRef, useEffect } from "react";
import CategorySelector from "../../../components/CategorySelector/CategorySelector";
import ProductCardAllWhere from "../../../components/ProductsCardAllWhere/ProductsCardAllWhere";
// Reusable Filters sidebar
import Filters from "../../Filters/Filters";
import styles from "./CurvedPage.module.css"; // reuse the same CSS

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

// local dynamic curved products — replace with API/props as needed
const dynamicCurvedProducts = [
  {
    id: "cv-01",
    title: "Contour Curved Band",
    subtitle: "14K White Gold — Designed to Nest with Solitaire Rings",
    price: "$749",
    defaultColor: "white",
    variants: {
      gold: "/images/rings/gold.jpg",
      white: "/images/rings/diamond.png",
      rose: "/images/rings/rose.png",
    },
    slug: "contour-curved-band",
    tags: ["curved", "band"],
    shape: "contour",
  },
  {
    id: "cv-02",
    title: "Soft Wave Curved Band",
    subtitle: "18K Yellow Gold with Micro Pave",
    price: "$949",
    defaultColor: "gold",
    variants: {
      gold: "/images/rings/gold.jpg",
      white: "/images/rings/diamond.png",
      rose: "/images/rings/rose.png",
    },
    slug: "soft-wave-curved-band",
    tags: ["curved", "wave"],
    shape: "wave",
  },
  {
    id: "cv-03",
    title: "Slim Curved Stackable",
    subtitle: "Rose Gold Slim Curve for Stacking",
    price: "$549",
    defaultColor: "rose",
    variants: {
      gold: "/images/rings/gold.jpg",
      white: "/images/rings/diamond.png",
      rose: "/images/rings/rose.png",
    },
    slug: "slim-curved-stackable",
    tags: ["curved", "stackable"],
    shape: "slim",
  },
];

// helper: parse price like "$749" -> 749
function parsePrice(priceStr) {
  if (!priceStr) return Number.MAX_SAFE_INTEGER;
  const m = String(priceStr).match(/[\d,.]+/);
  if (!m) return Number.MAX_SAFE_INTEGER;
  return Math.round(Number(m[0].replace(/,/g, "")));
}

// helper to check product category/tag match
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

export default function CurvedPage() {
  const curvedIndex = weddingCategories.findIndex(
    (c) => (c.name || "").toUpperCase() === "CURVED"
  );
  const initialIndex = curvedIndex >= 0 ? curvedIndex : 4;
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  // Reusable Filters state (passed to sidebar)
  const [filters, setFilters] = useState({
    sort: "best",
    shapes: [],
    metals: [],
    priceRange: { min: "", max: "" },
  });

  // sidebar toggle
  const [showFilters, setShowFilters] = useState(false);

  // sentinel for sticky filter button
  const sentinelRef = useRef(null);
  const [stickyFilterBtn, setStickyFilterBtn] = useState(false);
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const obs = new IntersectionObserver((entries) =>
      entries.forEach((e) => setStickyFilterBtn(!e.isIntersecting))
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, []);

  // filtered products
  const filteredProducts = useMemo(() => {
    const prMin = filters.priceRange?.min
      ? Number(filters.priceRange.min)
      : -Infinity;
    const prMax = filters.priceRange?.max
      ? Number(filters.priceRange.max)
      : Number.MAX_SAFE_INTEGER;

    return dynamicCurvedProducts.filter((p) => {
      // category filter (if not ALL)
      const selectedCat = weddingCategories[selectedIndex];
      if (selectedCat && selectedCat.name !== "ALL") {
        if (!productHasCategoryKeyword(p, selectedCat.name)) return false;
      }

      // shape filter
      if (filters.shapes && filters.shapes.length) {
        const shp = String(p.shape || "").toLowerCase();
        if (!filters.shapes.includes(shp)) return false;
      }

      // metal filter
      if (filters.metals && filters.metals.length) {
        const m = String(p.defaultColor || p.metal || "").toLowerCase();
        if (!filters.metals.includes(m)) return false;
      }

      // price filter
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
        <div className={styles.breadcrumb}>ARRA Jewels / Curved Bands</div>
        <h1 className={styles.title}>CURVED BANDS</h1>
        <p className={styles.subtitle}>
          Designed to contour beautifully with your engagement ring, curved
          bands offer a seamless, elegant fit. Customize yours with lab-grown
          diamonds and your choice of recycled precious metal—for a refined
          stack that’s effortlessly you.
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

      {/* Top row: item count + big FILTER button */}
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
              <div className={styles.noResults}>No curved products found.</div>
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
        shapes={["contour", "wave", "slim"]}
        metals={[
          { key: "gold", label: "14K Yellow Gold", color: "#e7d2ad" },
          {
            key: "white",
            label: "14K White Gold / Platinum",
            color: "#dde0e2",
          },
          { key: "rose", label: "14K Rose Gold", color: "#e8c4b6" },
        ]}
      />
    </div>
  );
}
