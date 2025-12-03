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

// 🔹 Price parser
function parsePrice(priceStr) {
  if (!priceStr) return Number.MAX_SAFE_INTEGER;
  const m = String(priceStr).match(/[\d,.]+/);
  if (!m) return Number.MAX_SAFE_INTEGER;
  return Math.round(Number(m[0].replace(/,/g, "")));
}

// 🔹 Detect if product belongs to "bracelet"
function productHasCategoryKeyword(product, keyword) {
  if (!product) return false;
  const k = String(keyword || "").toLowerCase();

  // Direct category field
  if (product.category && String(product.category).toLowerCase().includes(k))
    return true;

  // Categories array
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

  // Tags
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

  // Other common fields
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

  // Nested meta
  if (product.meta && product.meta.category) {
    if (String(product.meta.category).toLowerCase().includes(k)) return true;
  }

  // Fallback: title text
  if (product.title && String(product.title).toLowerCase().includes(k))
    return true;

  return false;
}

export default function BraceletsPage() {
  const [selectedIndex, setSelectedIndex] = useState(3); // Preselect BRACELETS
  const [filters, setFilters] = useState({
    sort: "best",
    shapes: [],
    metals: [],
    priceMin: "",
    priceMax: "",
  });

  const [showFilters, setShowFilters] = useState(false);

  // Sticky filter button
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

  // 🔹 Filtered product list
  const filteredProducts = useMemo(() => {
    const min = filters.priceMin ? Number(filters.priceMin) : -Infinity;
    const max = filters.priceMax
      ? Number(filters.priceMax)
      : Number.MAX_SAFE_INTEGER;

    const strictMatches = products.filter((p) => {
      if (!productHasCategoryKeyword(p, "bracelet")) return false;

      // Metals filter
      if (filters.metals && filters.metals.length) {
        const m = String(p.defaultColor || p.metal || "").toLowerCase();
        if (!filters.metals.includes(m)) return false;
      }

      // Price filter
      const pn = parsePrice(p.price);
      if (pn < min || pn > max) return false;

      return true;
    });

    if (strictMatches.length > 0) return strictMatches;

    // Fallback detection
    const relaxed = products.filter((p) => {
      const titleHas = String(p.title || "")
        .toLowerCase()
        .includes("bracelet");
      const tagsHave =
        Array.isArray(p.tags) &&
        p.tags.some((t) =>
          String(t || "")
            .toLowerCase()
            .includes("bracelet")
        );
      return titleHas || tagsHave;
    });

    if (relaxed.length > 0) {
      console.warn("[BraceletsPage] Fallback used - check product schema.");
      return relaxed;
    }

    console.warn(
      "[BraceletsPage] No bracelets detected - returning sample products."
    );
    return products.slice(0, 24);
  }, [filters]);

  return (
    <div className={styles.pageWrap}>
      {/* 🔹 Hero Section */}
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
          Lab-Grown Diamond Bracelets
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
          Indulge yourself or a loved one with exquisite lab-grown diamond
          bracelets, meticulously crafted with premium recycled metals and
          ethical diamonds or gemstones. Discover an array of designs, from
          understated to opulent. Select from our ready-to-wear collection or
          let them spark your creativity for bespoke pieces.
        </p>
      </div>

      {/* Category Selector */}
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

      {/* Sentinel */}
      <div ref={sentinelRef} className={styles.sentinel} />

      {/* Items count + filter button */}
      <div
        style={{
          width: "100%",
          padding: "0 12px 18px 12px",
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
            >
              <span className={styles.filterIcon}>☰</span> FILTER
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
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

      {/* Filters Sidebar */}
      <Filters
        show={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        setFilters={setFilters}
        shapes={["tennis", "bangle", "chain", "cuff", "link"]}
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
