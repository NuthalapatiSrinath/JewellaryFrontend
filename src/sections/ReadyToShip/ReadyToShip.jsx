import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ReadyToShip.module.css";

// Components
import Dropdown from "../../components/Dropdown/Dropdown";
import ProductCard from "../../components/ProductCard/ProductCard";
import ProductDetail from "./ProductDetail/ProductDetail"; // Local import

// Actions
import { fetchReadyProducts } from "../../redux/slices/productsSlice";

// Helpers
function uniq(arr = []) {
  return Array.from(new Set(arr.filter((x) => x != null && x !== "")));
}

function parseMetals(metalsExpanded = "") {
  if (!metalsExpanded) return [];
  return metalsExpanded
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function ReadyToShip() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux State
  const { items, loading, error } = useSelector((state) => state.products);

  // Local UI State
  const [subView, setSubView] = useState("list"); // "list" | "detail"
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    shape: "All",
    style: "All",
    metal: "All",
    price: "All",
  });

  // 1. Fetch Products on Mount
  useEffect(() => {
    dispatch(fetchReadyProducts());
  }, [dispatch]);

  // 2. Derive Filter Options dynamically
  const shapeOptions = useMemo(() => {
    const shapes = items
      .map((p) => p.defaultShape || p.main_shape || p.shapeCode)
      .filter(Boolean);
    return ["All", ...uniq(shapes)];
  }, [items]);

  const styleOptions = useMemo(() => {
    const stylesList = items.map((p) => p.style).filter(Boolean);
    return ["All", ...uniq(stylesList)];
  }, [items]);

  const metalOptions = useMemo(() => {
    let allMetals = [];
    items.forEach((p) => {
      if (p.metalsExpanded) allMetals.push(...parseMetals(p.metalsExpanded));
      // Use logic to extract metals if string format differs
    });
    if (allMetals.length === 0)
      return [
        "All",
        "14k Rose Gold",
        "14k Yellow Gold",
        "14k White Gold",
        "18k White Gold",
        "Platinum",
      ];
    return ["All", ...uniq(allMetals)];
  }, [items]);

  const priceBuckets = [
    "All",
    "Under $1000",
    "$1000 - $2000",
    "$2000 - $5000",
    "Above $5000",
  ];

  // 3. Filter Logic
  const filteredProducts = useMemo(() => {
    return items.filter((p) => {
      // Shape
      if (filters.shape !== "All") {
        const pShape = (p.defaultShape || p.main_shape || "").toLowerCase();
        if (!pShape.includes(filters.shape.toLowerCase())) return false;
      }

      // Style
      if (filters.style !== "All") {
        const pStyle = (p.style || "").toLowerCase();
        if (!pStyle.includes(filters.style.toLowerCase())) return false;
      }

      // Metal (Simple string match for demo)
      if (filters.metal !== "All") {
        // Logic depends on data structure, usually metal is inside variant or expanded field
        return true;
      }

      // Price
      if (filters.price !== "All") {
        const price = Number(p.defaultPrice || p.price || 0);
        if (filters.price === "Under $1000" && price >= 1000) return false;
        if (filters.price === "$1000 - $2000" && (price < 1000 || price > 2000))
          return false;
        if (filters.price === "$2000 - $5000" && (price < 2000 || price > 5000))
          return false;
        if (filters.price === "Above $5000" && price <= 5000) return false;
      }
      return true;
    });
  }, [items, filters]);

  // Handlers
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setSubView("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToGallery = () => {
    setSelectedProduct(null);
    setSubView("list");
  };

  return (
    <div className={styles.page}>
      {/* LIST VIEW */}
      {subView === "list" && (
        <>
          <div className={styles.header}>
            <h2 className={styles.title}>Ready To Ship Engagement Rings</h2>
            <p className={styles.desc}>
              Explore our curated collection of ready-to-ship rings.
            </p>
          </div>

          <div className={styles.filters}>
            <Dropdown
              label="Shape"
              options={shapeOptions}
              value={filters.shape}
              onChange={(v) => handleFilterChange("shape", v)}
            />
            <Dropdown
              label="Style"
              options={styleOptions}
              value={filters.style}
              onChange={(v) => handleFilterChange("style", v)}
            />
            <Dropdown
              label="Metal"
              options={metalOptions}
              value={filters.metal}
              onChange={(v) => handleFilterChange("metal", v)}
            />
            <Dropdown
              label="Price"
              options={priceBuckets}
              value={filters.price}
              onChange={(v) => handleFilterChange("price", v)}
            />
          </div>

          <div className={styles.count}>{filteredProducts.length} Results</div>

          <div className={styles.grid}>
            {loading && <p>Loading...</p>}
            {!loading &&
              filteredProducts.map((p) => (
                <div key={p._id || p.id} className={styles.cardWrapper}>
                  <ProductCard
                    product={{
                      ...p,
                      title: p.productName || p.title,
                      price: p.defaultPrice || p.price,
                      image: p.imageUrl1 || p.image,
                    }}
                    onCardClick={() => handleCardClick(p)}
                  />
                </div>
              ))}
            {!loading && filteredProducts.length === 0 && (
              <div className={styles.noResults}>No products found.</div>
            )}
          </div>
        </>
      )}

      {/* DETAIL VIEW */}
      {subView === "detail" && selectedProduct && (
        <div id="ready-detail">
          <ProductDetail
            product={selectedProduct}
            onBack={handleBackToGallery}
          />
        </div>
      )}
    </div>
  );
}
