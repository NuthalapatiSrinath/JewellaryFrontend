// NecklacesPage.jsx
import React, { useMemo, useState, useRef, useEffect } from "react";
import Filters from "../Filters/Filters"; // adjust path if needed
import CategorySelector from "../../components/CategorySelector/CategorySelector";
import ProductCardAllWhere from "../../components/ProductsCardAllWhere/ProductsCardAllWhere";
import styles from "../JewellaryPage/JewellaryPage.module.css"; // reuse your jewellery page CSS
import products from "../../data/products"; // your product dataset

const sharedImg = "/images/rings/diamond.png";
const jewelleryCategories = [
  { name: "ALL", image: sharedImg, link: "/jewellery" },
  { name: "EARRINGS", image: sharedImg, link: "/jewellery/earrings" },
  { name: "NECKLACES", image: sharedImg, link: "/jewellery/necklaces" },
  { name: "BRACELETS", image: sharedImg, link: "/jewellery/bracelets" },
  { name: "RINGS & BANDS", image: sharedImg, link: "/jewellery/rings" },
];

function parsePrice(priceStr) {
  if (!priceStr) return Number.MAX_SAFE_INTEGER;
  const m = String(priceStr).match(/[\d,.]+/);
  if (!m) return Number.MAX_SAFE_INTEGER;
  return Math.round(Number(m[0].replace(/,/g, "")));
}

/**
 * Robust helper: determine if product relates to the `keyword`.
 * Checks many common product fields and falls back to title substring.
 */
function productHasCategoryKeyword(product, keyword) {
  if (!product) return false;
  const k = String(keyword || "").toLowerCase();

  // 1) direct string category
  if (product.category && String(product.category).toLowerCase().includes(k))
    return true;

  // 2) categories array
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

  // 3) tags array
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

  // 4) other common fields (type, collection, collections, group, categoryKey)
  const altFields = [
    "type",
    "collection",
    "collections",
    "group",
    "categoryKey",
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

  // 5) nested meta
  if (product.meta && product.meta.category) {
    if (String(product.meta.category).toLowerCase().includes(k)) return true;
  }

  // 6) fallback: title substring
  if (product.title && String(product.title).toLowerCase().includes(k))
    return true;

  return false;
}

export default function NecklacesPage() {
  // preselect NECKLACES tab
  const [selectedIndex, setSelectedIndex] = useState(2);

  const [filters, setFilters] = useState({
    sort: "best",
    shapes: [], // not super-relevant for necklaces, but available
    metals: [],
    priceMin: "",
    priceMax: "",
  });

  const [showFilters, setShowFilters] = useState(false);

  // sentinel + sticky filter button
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

  // filteredProducts: detect necklaces robustly
  const filteredProducts = useMemo(() => {
    const min = filters.priceMin ? Number(filters.priceMin) : -Infinity;
    const max = filters.priceMax
      ? Number(filters.priceMax)
      : Number.MAX_SAFE_INTEGER;

    // 1) strict matches using helper
    const strictMatches = products.filter((p) => {
      if (!productHasCategoryKeyword(p, "necklace")) return false;

      // metals filter
      if (filters.metals && filters.metals.length) {
        const m = String(p.defaultColor || p.metal || "").toLowerCase();
        if (!filters.metals.includes(m)) return false;
      }

      // price filter
      const pn = parsePrice(p.price);
      if (pn < min || pn > max) return false;

      return true;
    });

    if (strictMatches.length > 0) return strictMatches;

    // 2) relaxed fallback: look for "necklace" in title/tags
    const relaxed = products.filter((p) => {
      const titleHas = String(p.title || "")
        .toLowerCase()
        .includes("necklace");
      const tagsHave =
        Array.isArray(p.tags) &&
        p.tags.some((t) =>
          String(t || "")
            .toLowerCase()
            .includes("necklace")
        );
      return titleHas || tagsHave;
    });

    if (relaxed.length > 0) {
      console.warn(
        "[NecklacesPage] Using relaxed fallback (title/tags contains 'necklace'). Consider normalizing product schema for more reliable filtering."
      );
      return relaxed;
    }

    // 3) final fallback: show a sample to avoid empty page
    console.warn(
      "[NecklacesPage] No necklaces detected; returning sample products. Inspect your dataset fields and update detection helper if needed."
    );
    return products.slice(0, 24);
  }, [filters]);

  return (
    <div className={styles.pageWrap}>
      {/* Hero (text from your screenshot) */}
      <div className={styles.hero} style={{ background: "transparent" }}>
        <h1
          style={{
            fontFamily: "serif",
            fontSize: 36,
            fontWeight: 500,
            margin: "12px 0",
            textAlign: "center",
          }}
        >
          Lab-Grown Diamond Necklaces
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
          From understated bar necklaces to lavish lab-grown diamond pendants,
          our sustainable lab-grown diamond necklaces come crafted in your
          choice of recycled precious metal.
        </p>
      </div>

      {/* Category selector (NECKLACES selected) */}
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

      {/* sentinel that controls sticky filter button */}
      <div ref={sentinelRef} className={styles.sentinel} />

      {/* Top row: results count + big FILTER button only */}
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

      {/* Reusable filters sidebar */}
      <Filters
        show={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        setFilters={setFilters}
        // optional: tailor shapes/metals for necklaces page
        shapes={["pendant", "bar", "station", "bezel", "halo"]}
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
