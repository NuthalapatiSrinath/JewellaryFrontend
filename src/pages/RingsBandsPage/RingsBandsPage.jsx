// RingsBandsPage.jsx
import React, { useMemo, useState, useRef, useEffect } from "react";
import Filters from "../Filters/Filters"; // adjust path if needed
import CategorySelector from "../../components/CategorySelector/CategorySelector";
import ProductCardAllWhere from "../../components/ProductsCardAllWhere/ProductsCardAllWhere";
import styles from "../JewellaryPage/JewellaryPage.module.css"; // reuse existing CSS
import products from "../../data/products";

const sharedImg = "/images/rings/diamond.png";
const jewelleryCategories = [
  { name: "ALL", image: sharedImg, link: "/jewellery" },
  { name: "EARRINGS", image: sharedImg, link: "/jewellery/earrings" },
  { name: "NECKLACES", image: sharedImg, link: "/jewellery/necklaces" },
  { name: "BRACELETS", image: sharedImg, link: "/jewellery/bracelets" },
  { name: "RINGS & BANDS", image: sharedImg, link: "/jewellery/rings" },
];

// parse price text like "$ 1,234 USD" -> number
function parsePrice(priceStr) {
  if (!priceStr) return Number.MAX_SAFE_INTEGER;
  const m = String(priceStr).match(/[\d,.]+/);
  return m
    ? Math.round(Number(m[0].replace(/,/g, "")))
    : Number.MAX_SAFE_INTEGER;
}

/**
 * Robust helper to determine membership in a category keyword
 * (checks category, categories array, tags, alt fields, meta, title)
 */
function productHasCategoryKeyword(product, keyword) {
  if (!product) return false;
  const k = String(keyword).toLowerCase();

  if (product.category && String(product.category).toLowerCase().includes(k))
    return true;

  if (Array.isArray(product.categories)) {
    if (
      product.categories.some((c) =>
        String(c || "")
          .toLowerCase()
          .includes(k)
      )
    )
      return true;
  }

  if (Array.isArray(product.tags)) {
    if (
      product.tags.some((t) =>
        String(t || "")
          .toLowerCase()
          .includes(k)
      )
    )
      return true;
  }

  const altFields = [
    "type",
    "collection",
    "collections",
    "group",
    "categoryKey",
    "product_type",
  ];
  for (const f of altFields) {
    const v = product[f];
    if (!v) continue;
    if (Array.isArray(v)) {
      if (
        v.some((x) =>
          String(x || "")
            .toLowerCase()
            .includes(k)
        )
      )
        return true;
    } else {
      if (String(v).toLowerCase().includes(k)) return true;
    }
  }

  if (product.meta && product.meta.category) {
    if (String(product.meta.category).toLowerCase().includes(k)) return true;
  }

  if (product.title && String(product.title).toLowerCase().includes(k))
    return true;

  return false;
}

export default function RingsBandsPage() {
  // preselect "RINGS & BANDS" tab (index 4)
  const [selectedIndex, setSelectedIndex] = useState(4);

  // filters state passed to Filters component
  const [filters, setFilters] = useState({
    sort: "best",
    shapes: [],
    metals: [],
    priceMin: "",
    priceMax: "",
  });

  const [showFilters, setShowFilters] = useState(false);

  // sticky filter button sentinel
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

  // filtered products (detect rings/bands robustly)
  const filteredProducts = useMemo(() => {
    const min = filters.priceMin ? Number(filters.priceMin) : -Infinity;
    const max = filters.priceMax
      ? Number(filters.priceMax)
      : Number.MAX_SAFE_INTEGER;

    // prefer strict matches via helper
    const matches = products.filter((p) => {
      const isRing =
        productHasCategoryKeyword(p, "ring") ||
        productHasCategoryKeyword(p, "band");
      if (!isRing) return false;

      // shapes filter (if used)
      if (filters.shapes && filters.shapes.length) {
        const shp = String(p.shape || "").toLowerCase();
        if (!filters.shapes.includes(shp)) return false;
      }

      // metals filter
      if (filters.metals && filters.metals.length) {
        const m = String(p.defaultColor || p.metal || "").toLowerCase();
        if (!filters.metals.includes(m)) return false;
      }

      // price
      const pn = parsePrice(p.price);
      if (pn < min || pn > max) return false;

      return true;
    });

    if (matches.length > 0) return matches;

    // fallback: try title/tag substring for "ring" or "band"
    const fallback = products.filter((p) => {
      const title = String(p.title || "").toLowerCase();
      const tags = Array.isArray(p.tags) ? p.tags.join(" ").toLowerCase() : "";
      return (
        title.includes("ring") ||
        title.includes("band") ||
        tags.includes("ring") ||
        tags.includes("band")
      );
    });

    if (fallback.length > 0) return fallback;

    // last resort: return first N products so UI isn't empty (helpful during development)
    return products.slice(0, 24);
  }, [filters]);

  return (
    <div className={styles.pageWrap}>
      {/* Hero */}
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
          Lab-Grown Diamond Rings & Bands
        </h1>

        <p
          style={{
            maxWidth: 980,
            margin: "0 auto 8px",
            textAlign: "center",
            fontSize: 18,
            lineHeight: 1.8,
            color: "#333",
            padding: "0 12px",
          }}
        >
          Shop our lab-grown fashion rings, perfect for everyday wear, special
          occasions, and statement style. Discover sparkling right-hand rings,
          trendy fashion bands, and unique pinky rings. Designed to reflect your
          personal style, these rings combine luxury with modern design.
        </p>
      </div>

      {/* Category selector */}
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

      {/* sentinel for sticky button */}
      <div ref={sentinelRef} className={styles.sentinel} />

      {/* Top row: items count + big Filter button only */}
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

      {/* Product grid */}
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

      {/* Filters sidebar - pass ring-specific shapes/metals if desired */}
      <Filters
        show={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        setFilters={setFilters}
        shapes={["round", "princess", "emerald", "cushion", "halo", "band"]}
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
