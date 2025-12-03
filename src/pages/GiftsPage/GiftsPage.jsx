// src/pages/Gifts/GiftsPage.jsx
import React, { useMemo, useRef, useState, useEffect } from "react";
import ProductCardAllWhere from "../../components/ProductsCardAllWhere/ProductsCardAllWhere";
import Filters from "../Filters/Filters"; // reusable Filters sidebar
import styles from "./GiftsPage.module.css"; // reuse same CSS
import { NavLink } from "react-router-dom";

// sample dynamic products for Gifts (replace with API/props)
const dynamicGiftProducts = [
  {
    id: "g-01",
    title: "Dazzling Solitaire Pendant",
    subtitle: "14K White Gold — 0.25ct Lab-Grown Diamond",
    price: "$299",
    defaultColor: "white",
    variants: {
      gold: "/images/rings/gold.jpg",
      white: "/images/rings/diamond.png",
      rose: "/images/rings/rose.png",
    },
    slug: "dazzling-solitaire-pendant",
    shape: "pendant",
    tags: ["pendant", "gift", "necklace"],
  },
  {
    id: "g-01",
    title: "Dazzling Solitaire Pendant",
    subtitle: "14K White Gold — 0.25ct Lab-Grown Diamond",
    price: "$299",
    defaultColor: "white",
    variants: {
      gold: "/images/rings/gold.jpg",
      white: "/images/rings/diamond.png",
      rose: "/images/rings/rose.png",
    },
    slug: "dazzling-solitaire-pendant",
    shape: "pendant",
    tags: ["pendant", "gift", "necklace"],
  },
  {
    id: "g-01",
    title: "Dazzling Solitaire Pendant",
    subtitle: "14K White Gold — 0.25ct Lab-Grown Diamond",
    price: "$299",
    defaultColor: "white",
    variants: {
      gold: "/images/rings/gold.jpg",
      white: "/images/rings/diamond.png",
      rose: "/images/rings/rose.png",
    },
    slug: "dazzling-solitaire-pendant",
    shape: "pendant",
    tags: ["pendant", "gift", "necklace"],
  },
  {
    id: "g-01",
    title: "Dazzling Solitaire Pendant",
    subtitle: "14K White Gold — 0.25ct Lab-Grown Diamond",
    price: "$299",
    defaultColor: "white",
    variants: {
      gold: "/images/rings/gold.jpg",
      white: "/images/rings/diamond.png",
      rose: "/images/rings/rose.png",
    },
    slug: "dazzling-solitaire-pendant",
    shape: "pendant",
    tags: ["pendant", "gift", "necklace"],
  },
  {
    id: "g-02",
    title: "Classic Hoop Earrings",
    subtitle: "14K Yellow Gold — Polished Finish",
    price: "$199",
    defaultColor: "gold",
    variants: {
      gold: "/images/rings/gold.jpg",
      white: "/images/rings/diamond.png",
      rose: "/images/rings/rose.png",
    },
    slug: "classic-hoop-earrings",
    shape: "hoop",
    tags: ["earrings", "hoop", "gift"],
  },
  {
    id: "g-03",
    title: "Radiant Tennis Bracelet",
    subtitle: "Lab-Grown Diamond Accents — 7 inch",
    price: "$1,099",
    defaultColor: "white",
    variants: {
      gold: "/images/rings/gold.jpg",
      white: "/images/rings/diamond.png",
      rose: "/images/rings/rose.png",
    },
    slug: "radiant-tennis-bracelet",
    shape: "bracelet",
    tags: ["bracelet", "tennis", "gift"],
  },
  {
    id: "g-04",
    title: "Signet Ring",
    subtitle: "14K Rose Gold — Personalize with Engraving",
    price: "$399",
    defaultColor: "rose",
    variants: {
      gold: "/images/rings/gold.jpg",
      white: "/images/rings/diamond.png",
      rose: "/images/rings/rose.png",
    },
    slug: "signet-ring",
    shape: "ring",
    tags: ["ring", "signet", "gift"],
  },
];

// small helper to parse price string -> number
function parsePrice(priceStr) {
  if (!priceStr) return Number.MAX_SAFE_INTEGER;
  const m = String(priceStr).match(/[\d,.]+/);
  if (!m) return Number.MAX_SAFE_INTEGER;
  return Math.round(Number(m[0].replace(/,/g, "")));
}

// helper to test if product matches the search query
function productMatchesSearch(product, q) {
  if (!q) return true;
  const hay = `${product.title || ""} ${product.subtitle || ""} ${(
    product.tags || []
  ).join(" ")}`.toLowerCase();
  return hay.includes(q);
}

export default function GiftsPage() {
  // top-level search (kept outside Filters — optional; you can move search into Filters if preferred)
  const [search, setSearch] = useState("");

  // Filters (shape, metals, priceRange, sort) - passed to Filters component
  const [filters, setFilters] = useState({
    sort: "best",
    shapes: [], // e.g. ['hoop', 'pendant']
    metals: [], // keys like 'gold','white','rose'
    priceRange: { min: "", max: "" },
  });

  // sidebar open state
  const [showFilters, setShowFilters] = useState(false);

  // sentinel for sticky behaviour (optional)
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

  // compute filtered products using search + Filters state
  const filteredProducts = useMemo(() => {
    const q = String(search || "")
      .trim()
      .toLowerCase();

    const min =
      filters.priceRange && filters.priceRange.min
        ? Number(filters.priceRange.min)
        : -Infinity;
    const max =
      filters.priceRange && filters.priceRange.max
        ? Number(filters.priceRange.max)
        : Number.MAX_SAFE_INTEGER;

    return dynamicGiftProducts.filter((p) => {
      // search
      if (q && !productMatchesSearch(p, q)) return false;

      // shapes
      if (filters.shapes && filters.shapes.length) {
        const shp = String(p.shape || "").toLowerCase();
        if (!filters.shapes.includes(shp)) return false;
      }

      // metals
      if (filters.metals && filters.metals.length) {
        const m = String(p.defaultColor || p.metal || "").toLowerCase();
        if (!filters.metals.includes(m)) return false;
      }

      // price
      const pn = parsePrice(p.price);
      if (pn < min || pn > max) return false;

      // sort: not altering the array here — sort can be applied later if desired
      return true;
    });
  }, [search, filters]);

  // quick top-clear for search only (we still rely on Filters Reset inside the Filters component)
  const clearTopSearch = () => setSearch("");

  return (
    <div className={styles.pageWrap}>
      <div className={styles.hero}>
        <div className={styles.breadcrumb}>
          ARRA Jewels &nbsp;/&nbsp; Jewelry Gifts
        </div>
        <h1 className={styles.title}>JEWELRY GIFTS</h1>
        <p className={styles.subtitle}>
          Just for you, our jewelry experts have curated a collection of
          handcrafted, ethical fine jewelry gifts. From solid recycled gold to
          glittering lab-grown diamonds and radiant lab-created gemstones,
          there's something for everyone and every occasion.
          <br />
          <span className={styles.linktitle}>
            Shopping for a last minute gift?{" "}
            <NavLink
              to="/jewellery/all"
              className={styles.link}
            >
              Click here
            </NavLink>{" "}
            to view our Ready-To-Ship Jewelry.
          </span>
        </p>
      </div>

      {/* sentinel used for sticky filter button */}
      <div ref={sentinelRef} className={styles.sentinel} />

      {/* Top row: left = count, right = search + FILTER button */}
      <div
        style={{
          width: "100%",
          padding: "0 12px",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 8,
        }}
      >
        <div style={{ flex: "1 1 0" }}>
          <div className={styles.itemsCount} style={{ marginTop: 8 }}>
            {filteredProducts.length} Items
          </div>
        </div>

        {/* small top search (optional, compact) */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="search"
            placeholder="Search gifts, styles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.filterInput}
            style={{ width: 240, padding: "10px 12px", borderRadius: 28 }}
          />
          <button
            onClick={clearTopSearch}
            className={styles.clearBtn}
            title="Clear search"
            style={{ padding: "10px 14px" }}
          >
            Clear
          </button>

          {/* Big FILTER button (opens the reusable Filters sidebar) */}
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
      <main className={styles.content} style={{ marginTop: 8 }}>
        <section className={styles.productsSection}>
          <div className={styles.productsGrid}>
            {filteredProducts.length === 0 ? (
              <div className={styles.noResults}>
                No gifts found that match your filters.
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
        filters={{
          // adapt structure expected by Filters component:
          sort: filters.sort || "best",
          shapes: filters.shapes || [],
          metals: filters.metals || [],
          priceRange: {
            min: filters.priceRange?.min || "",
            max: filters.priceRange?.max || "",
          },
        }}
        setFilters={(incoming) => {
          // incoming is expected to be object shaped like the Filters component uses:
          // { sort, shapes[], metals[], priceRange: {min,max} }
          setFilters({
            sort: incoming.sort || "best",
            shapes: incoming.shapes || [],
            metals: incoming.metals || [],
            priceRange: {
              min: incoming.priceRange?.min ?? "",
              max: incoming.priceRange?.max ?? "",
            },
          });
          // close comes from Filters.apply() via its own onClose -> but we close when user clicks Apply inside Filters
        }}
        // optional: send shapes & metals specific to Gifts
        shapes={["pendant", "hoop", "bracelet", "ring", "stud", "drop"]}
        metals={[
          { key: "gold", label: "14K Yellow Gold", color: "#e7d2ad" },
          { key: "white", label: "14K White Gold / Diamond", color: "#dde0e2" },
          { key: "rose", label: "14K Rose Gold", color: "#e8c4b6" },
          { key: "platinum", label: "Platinum", color: "#d6d6d6" },
        ]}
      />
    </div>
  );
}
