// src/pages/WeddingCategories/AnniversaryPage.jsx
import React, { useMemo, useState, useRef, useEffect } from "react";
import CategorySelector from "../../../components/CategorySelector/CategorySelector";
import ProductCardAllWhere from "../../../components/ProductsCardAllWhere/ProductsCardAllWhere";
// Reusable sidebar filters
import Filters from "../../Filters/Filters";
import styles from "./AnniversaryPage.module.css"; // reuse same CSS

// category list same as main
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

// mock dynamic anniversary data
const dynamicAnniversaryProducts = [
  {
    id: "an-01",
    title: "Timeless Anniversary Band",
    subtitle: "14K White Gold with Round Cut Lab Diamonds",
    price: "$1,150",
    defaultColor: "white",
    variants: {
      gold: "/images/rings/gold.jpg",
      white: "/images/rings/diamond.png",
      rose: "/images/rings/rose.png",
    },
    slug: "timeless-anniversary-band",
    tags: ["anniversary", "band"],
    shape: "classic",
  },
  {
    id: "an-02",
    title: "Milestone Eternity Band",
    subtitle: "Platinum Channel Set with Lab-Grown Diamonds",
    price: "$2,499",
    defaultColor: "white",
    variants: {
      gold: "/images/rings/gold.jpg",
      white: "/images/rings/diamond.png",
      rose: "/images/rings/rose.png",
    },
    slug: "milestone-eternity-band",
    tags: ["anniversary", "eternity"],
    shape: "channel",
  },
  {
    id: "an-03",
    title: "Rose Gold Anniversary Band",
    subtitle: "Rose Gold with Pave Diamonds",
    price: "$1,299",
    defaultColor: "rose",
    variants: {
      gold: "/images/rings/gold.jpg",
      white: "/images/rings/diamond.png",
      rose: "/images/rings/rose.png",
    },
    slug: "rose-gold-anniversary-band",
    tags: ["anniversary", "pave"],
    shape: "pave",
  },
];

// helpers
function parsePrice(priceStr) {
  if (!priceStr) return Number.MAX_SAFE_INTEGER;
  const m = String(priceStr).match(/[\d,.]+/);
  if (!m) return Number.MAX_SAFE_INTEGER;
  return Math.round(Number(m[0].replace(/,/g, "")));
}

function productHasCategoryKeyword(product, keyword) {
  const k = String(keyword || "").toLowerCase();
  if (!k) return false;
  if (product.category && product.category.toLowerCase().includes(k))
    return true;
  if (product.tags && product.tags.some((t) => t.toLowerCase().includes(k)))
    return true;
  if (product.title && product.title.toLowerCase().includes(k)) return true;
  return false;
}

export default function AnniversaryPage() {
  const anniversaryIndex = weddingCategories.findIndex(
    (c) => (c.name || "").toUpperCase() === "ANNIVERSARY"
  );
  const initialIndex = anniversaryIndex >= 0 ? anniversaryIndex : 2;
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  // Sidebar filter state
  const [filters, setFilters] = useState({
    sort: "best",
    shapes: [],
    metals: [],
    priceRange: { min: "", max: "" },
  });

  const [showFilters, setShowFilters] = useState(false);

  // Sticky filter button sentinel
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

  // filter logic
  const filteredProducts = useMemo(() => {
    const prMin = filters.priceRange?.min
      ? Number(filters.priceRange.min)
      : -Infinity;
    const prMax = filters.priceRange?.max
      ? Number(filters.priceRange.max)
      : Number.MAX_SAFE_INTEGER;

    return dynamicAnniversaryProducts.filter((p) => {
      const selectedCat = weddingCategories[selectedIndex];
      if (selectedCat && selectedCat.name !== "ALL") {
        if (!productHasCategoryKeyword(p, selectedCat.name)) return false;
      }

      if (filters.shapes && filters.shapes.length) {
        const shp = String(p.shape || "").toLowerCase();
        if (!filters.shapes.includes(shp)) return false;
      }

      if (filters.metals && filters.metals.length) {
        const m = String(p.defaultColor || "").toLowerCase();
        if (!filters.metals.includes(m)) return false;
      }

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
      {/* HERO SECTION */}
      <div className={styles.hero}>
        <div className={styles.breadcrumb}>
          ARRA Jewels / Wedding / Anniversary
        </div>
        <h1 className={styles.title}>ANNIVERSARY</h1>
        <p className={styles.subtitle}>
          Mark every milestone with brilliance. ARRA Jewels lab-grown diamond
          anniversary bands are crafted to honor your journey— whether worn
          alone, stacked, or paired with your engagement ring. Each band blends
          modern elegance, expert craftsmanship, and lasting beauty in fine
          precious metals and brilliant lab-grown diamonds.
        </p>
      </div>

      {/* CATEGORY SELECTOR */}
      <div className={styles.selectorWrap}>
        <CategorySelector
          categories={weddingCategories}
          selectedIndex={selectedIndex}
          setSelectedIndex={onCategoryChange}
          maxVisitedIndex={weddingCategories.length - 1}
        />
      </div>

      <div ref={sentinelRef} className={styles.sentinel} />

      {/* TOP FILTER BUTTON + COUNT */}
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
            >
              <span className={styles.filterIcon}>☰</span> FILTER
            </button>
          )}
        </div>
      </div>

      {/* PRODUCT GRID */}
      <main className={styles.content}>
        <section className={styles.productsSection}>
          <div className={styles.productsGrid}>
            {filteredProducts.length === 0 ? (
              <div className={styles.noResults}>
                No anniversary products found.
              </div>
            ) : (
              filteredProducts.map((p) => (
                <ProductCardAllWhere key={p.id} product={p} />
              ))
            )}
          </div>
        </section>
      </main>

      {/* FILTER SIDEBAR */}
      <Filters
        show={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        setFilters={setFilters}
        shapes={["classic", "channel", "pave"]}
        metals={[
          { key: "gold", label: "14K Yellow Gold", color: "#e7d2ad" },
          { key: "white", label: "White Gold / Platinum", color: "#dde0e2" },
          { key: "rose", label: "Rose Gold", color: "#e8c4b6" },
        ]}
      />
    </div>
  );
}
