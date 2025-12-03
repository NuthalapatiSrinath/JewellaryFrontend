// src/pages/WeddingCategories/EternityPage.jsx
import React, { useMemo, useState, useRef, useEffect } from "react";
import CategorySelector from "../../../components/CategorySelector/CategorySelector";
import ProductCardAllWhere from "../../../components/ProductsCardAllWhere/ProductsCardAllWhere";
// Reusable Filters sidebar - adjust path if necessary
import Filters from "../../Filters/Filters";
import styles from "./EternityPage.module.css"; // reuse the same CSS

// category list same as other wedding pages
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

// local dynamic data (replace later with API/props)
const dynamicEternityProducts = [
  {
    id: "et-01",
    title: "Full Eternity Diamond Band",
    subtitle: "Round Brilliant Cut Diamonds, 14K Gold",
    price: "$1,599",
    defaultColor: "gold",
    variants: {
      gold: "/images/rings/gold.jpg",
      white: "/images/rings/diamond.png",
      rose: "/images/rings/rose.png",
    },
    slug: "full-eternity-diamond-band",
    tags: ["eternity", "band", "diamond"],
    shape: "band",
  },
  {
    id: "et-02",
    title: "Infinity Loop Eternity Ring",
    subtitle: "18K White Gold, Continuous Diamond Loop",
    price: "$2,250",
    defaultColor: "white",
    variants: {
      gold: "/images/rings/gold.jpg",
      white: "/images/rings/diamond.png",
      rose: "/images/rings/rose.png",
    },
    slug: "infinity-loop-eternity-ring",
    tags: ["eternity", "infinity"],
    shape: "band",
  },
  {
    id: "et-03",
    title: "Rose Gold Half Eternity Band",
    subtitle: "14K Rose Gold, Half Circle Diamond Design",
    price: "$1,099",
    defaultColor: "rose",
    variants: {
      gold: "/images/rings/gold.jpg",
      white: "/images/rings/diamond.png",
      rose: "/images/rings/rose.png",
    },
    slug: "rose-gold-half-eternity-band",
    tags: ["eternity", "half-eternity"],
    shape: "band",
  },
];

// small helper: parse price like "$1,599" -> number (1599)
function parsePrice(priceStr) {
  if (!priceStr) return Number.MAX_SAFE_INTEGER;
  const m = String(priceStr).match(/[\d,.]+/);
  if (!m) return Number.MAX_SAFE_INTEGER;
  return Math.round(Number(m[0].replace(/,/g, "")));
}

// helper to test product belongs to a category keyword (title/tags fallback)
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

export default function EternityPage() {
  const eternityIndex = weddingCategories.findIndex(
    (c) => (c.name || "").toUpperCase() === "ETERNITY"
  );
  const initialIndex = eternityIndex >= 0 ? eternityIndex : 3;
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  // Reusable Filters state (passed to Filters component)
  const [filters, setFilters] = useState({
    sort: "best",
    shapes: [], // e.g. ['band']
    metals: [], // e.g. ['gold','white','rose']
    priceRange: { min: "", max: "" },
  });

  // show/hide Filters sidebar
  const [showFilters, setShowFilters] = useState(false);

  // sentinel for sticky big FILTER button
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

  // filtered products applying selected category + sidebar filters
  const filteredProducts = useMemo(() => {
    const prMin = filters.priceRange?.min
      ? Number(filters.priceRange.min)
      : -Infinity;
    const prMax = filters.priceRange?.max
      ? Number(filters.priceRange.max)
      : Number.MAX_SAFE_INTEGER;

    return dynamicEternityProducts.filter((p) => {
      // category filter (if not ALL)
      const selectedCat = weddingCategories[selectedIndex];
      if (selectedCat && selectedCat.name !== "ALL") {
        if (!productHasCategoryKeyword(p, selectedCat.name)) return false;
      }

      // shapes filter
      if (filters.shapes && filters.shapes.length) {
        const shp = String(p.shape || "").toLowerCase();
        if (!filters.shapes.includes(shp)) return false;
      }

      // metals filter
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
        <div className={styles.breadcrumb}>
          ARRA Jewels / Lab-Grown Diamond Eternity Bands
        </div>
        <h1 className={styles.title}>LAB-GROWN DIAMOND ETERNITY BANDS</h1>
        <p className={styles.subtitle}>
          Celebrate forever with brilliance. ARRA Jewels lab-grown diamond
          eternity bands feature a continuous circle of sparkling
          diamonds—crafted in recycled precious metals and designed to last.
          Whether worn alone or paired with your engagement ring, each band
          reflects enduring beauty and modern elegance.
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
                No eternity products found.
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
        // sensible defaults for eternity rings
        shapes={["band", "half-eternity", "full-eternity"]}
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
