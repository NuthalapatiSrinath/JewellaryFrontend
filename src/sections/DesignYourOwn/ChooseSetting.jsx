// src/sections/ChooseSetting/ChooseSetting.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../../components/ProductCard/ProductCard";
import Dropdown from "../../components/Dropdown/Dropdown";
import ProductDetailForSetting from "../../sections/DesignYourOwn/ProductDetailforSetting/ProductDetailforSetting";
import styles from "./ChooseSetting.module.css";
import { fetchDesignProducts } from "../../redux/slices/productsSlice";

export default function ChooseSetting() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // URL helper
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  // filters
  const [activeStyle, setActiveStyle] = useState("All");
  const [selectedShape, setSelectedShape] = useState(null);
  const [selectedMetal, setSelectedMetal] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);

  const [subView, setSubView] = useState("list");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // redux
  const productsState = useSelector((s) => s.products || {});
  const items = productsState.items || [];
  const loading = productsState.loading;
  const error = productsState.error;

  useEffect(() => {
    dispatch(fetchDesignProducts({ tab: "design", page: 1, limit: 200 }));
  }, [dispatch]);

  // derive filter options dynamically from API
  const { styleOptions, shapeOptions, metalOptions, priceOptions } =
    useMemo(() => {
      const styleSet = new Set();
      const shapeSet = new Set();
      const metalSet = new Set();

      const splitAndAdd = (str, set) => {
        if (!str) return;
        String(str)
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean)
          .forEach((v) => set.add(v));
      };

      for (const p of items) {
        if (p.style) styleSet.add(p.style.trim());
        if (p.main_shape) shapeSet.add(p.main_shape.trim());
        if (p.shapesExpanded) splitAndAdd(p.shapesExpanded, shapeSet);
        if (p.metalsExpanded) splitAndAdd(p.metalsExpanded, metalSet);
      }

      return {
        styleOptions: ["All", ...Array.from(styleSet).sort()],
        shapeOptions: ["All", ...Array.from(shapeSet).sort()],
        metalOptions: ["All", ...Array.from(metalSet).sort()],
        priceOptions: [
          "All",
          "$0 - $5,000",
          "$5,000 - $15,000",
          "Above $15,000",
        ],
      };
    }, [items]);

  // map API data to product cards
  const products = items.map((p) => ({
    id: p._id,
    title: p.productName,
    subtitle: p.style,
    price: p.default_price,
    slug: p.slug,
    __raw: p,
  }));

  const priceToNumber = (p = "") =>
    Number(String(p).replace(/[^0-9.-]+/g, "")) || 0;

  // filter logic
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const hay = (p.title + " " + (p.subtitle || "")).toLowerCase();

      if (activeStyle && activeStyle !== "All") {
        if (
          !(p.subtitle || "").toLowerCase().includes(activeStyle.toLowerCase())
        )
          return false;
      }

      if (selectedShape && selectedShape !== "All") {
        const shape = selectedShape.toLowerCase();
        const allShapes = (p.__raw?.shapesExpanded || "").toLowerCase();
        if (
          !allShapes.includes(shape) &&
          !(p.__raw?.main_shape || "").toLowerCase().includes(shape)
        )
          return false;
      }

      if (selectedMetal && selectedMetal !== "All") {
        const metal = selectedMetal.toLowerCase();
        const metals = (p.__raw?.metalsExpanded || "").toLowerCase();
        if (!metals.includes(metal)) return false;
      }

      if (selectedPrice && selectedPrice !== "All") {
        const price = priceToNumber(p.price);
        if (selectedPrice === "$0 - $5,000" && price > 5000) return false;
        if (
          selectedPrice === "$5,000 - $15,000" &&
          (price < 5000 || price > 15000)
        )
          return false;
        if (selectedPrice === "Above $15,000" && price <= 15000) return false;
      }

      return true;
    });
  }, [products, activeStyle, selectedShape, selectedMetal, selectedPrice]);

  // query param helper
  const updateQueryParam = (key, value) => {
    const next = new URLSearchParams(location.search || "");
    if (!value || value === "All") next.delete(key);
    else next.set(key, value);
    const search = next.toString();
    const to = `${location.pathname}${search ? `?${search}` : ""}`;
    navigate(to, { replace: false });
  };

  // event handlers
  const handleStyleClick = (style) => {
    setActiveStyle(style);
    updateQueryParam("style", style === "All" ? "" : style);
  };
  const handleShapeChange = (val) => {
    setSelectedShape(val);
    updateQueryParam("shape", val === "All" ? "" : val);
  };
  const handleMetalChange = (val) => {
    setSelectedMetal(val);
    updateQueryParam("metal", val === "All" ? "" : val);
  };
  const handlePriceChange = (val) => {
    setSelectedPrice(val);
    updateQueryParam("price", val === "All" ? "" : val);
  };

  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setSubView("detail");
  };

  const handleBack = () => {
    setSelectedProduct(null);
    setSubView("list");
  };

  return (
    <section className={styles.section}>
      {subView === "list" && (
        <>
          <div className={styles.header}>
            <h2 className={styles.heading}>CHOOSE SETTING</h2>
            <p className={styles.subtext}>
              Refine your search and find the perfect ring setting that matches
              your style.
            </p>
          </div>

          {/* Dynamic styles (only from API) */}
          <div className={styles.filterBar}>
            <div className={styles.tabsRow}>
              {styleOptions.map((s) => (
                <button
                  key={s}
                  className={`${styles.tab} ${
                    activeStyle === s ? styles.activeTab : ""
                  }`}
                  onClick={() => handleStyleClick(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Dropdowns */}
          <div className={styles.filteredPage}>
            <div className={styles.dropdownRow}>
              <Dropdown
                label="Shape"
                options={shapeOptions}
                onChange={handleShapeChange}
                value={selectedShape || "All"}
              />
              <Dropdown
                label="Metal"
                options={metalOptions}
                onChange={handleMetalChange}
                value={selectedMetal || "All"}
              />
              <Dropdown
                label="Price"
                options={priceOptions}
                onChange={handlePriceChange}
                value={selectedPrice || "All"}
              />
            </div>

            <div className={styles.resultsCount}>{filtered.length} Results</div>

            <div className={styles.grid}>
              {loading && <p>Loading products...</p>}
              {error && !loading && (
                <div style={{ color: "red" }}>
                  Failed to load products. Check console.
                </div>
              )}
              {!loading &&
                filtered.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onCardClick={() => handleCardClick(p)}
                  />
                ))}
              {!loading && filtered.length === 0 && <div>0 Results</div>}
            </div>
          </div>
        </>
      )}

      {subView === "detail" && selectedProduct && (
        <ProductDetailForSetting
          product={selectedProduct.__raw || selectedProduct}
          onBack={handleBack}
          onProceed={(sel) => console.log("Proceed:", sel)}
        />
      )}
    </section>
  );
}
