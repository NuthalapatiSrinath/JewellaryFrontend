import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ReadyToShip.module.css";
import Dropdown from "../../components/Dropdown/Dropdown";
import ProductCard from "../../components/ProductCard/ProductCard";
import ProductDetail from "../../sections/ReadyToShip/ProductDetail/ProductDetail";
import { fetchReadyProducts } from "../../redux/slices/productsSlice";

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");
}

function uniq(arr = []) {
  return Array.from(
    new Set(arr.filter((x) => x !== null && x !== undefined && x !== ""))
  );
}

function parseMetals(metalsExpanded = "") {
  if (!metalsExpanded) return [];
  return metalsExpanded
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function fmtCurrency(n) {
  if (Number.isFinite(n))
    return `$${Number(n).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })}`;
  return String(n);
}

/**
 * compute 25/50/75 percentiles for price bucket boundaries (simple)
 */
function quartiles(values = []) {
  if (!values || values.length === 0) return [];
  const arr = values.slice().sort((a, b) => a - b);
  const q = (p) => {
    const pos = (arr.length - 1) * p;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (arr[base + 1] !== undefined)
      return arr[base] + rest * (arr[base + 1] - arr[base]);
    return arr[base];
  };
  return [q(0.25), q(0.5), q(0.75)];
}

export default function ReadyToShip() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // redux products slice
  const productsState = useSelector((s) => s.products || {});
  const items = productsState.items || [];
  const meta = productsState.meta || {};
  const loading = productsState.loading;
  const error = productsState.error;

  // local filters UI state
  const [filters, setFilters] = useState({
    shape: null,
    style: null,
    metal: "All",
    price: null,
    type: "All",
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // local view state
  const [subView, setSubView] = useState("list"); // "list" | "detail"
  const [selectedProduct, setSelectedProduct] = useState(null);

  // transform backend items -> UI product shape
  const products = useMemo(() => {
    return items.map((p) => ({
      id: p._id || p.productId || p.id,
      title: p.title || p.productName || p.name,
      subtitle: p.style || p.main_shape || "",
      price:
        p.default_price !== undefined && p.default_price !== null
          ? `$${Number(p.default_price).toFixed(2)}`
          : p.price || "",
      priceRaw: Number(p.default_price || p.price || 0),
      defaultColor: "", // not present in DYO payload
      slug: p.slug || slugify(p.title || p.productName || p.productId),
      __raw: p,
    }));
  }, [items]);

  // --- derive dynamic filter option lists from API data ---
  const styleOptions = useMemo(() => {
    return ["All"].concat(uniq(items.map((p) => p.style).filter(Boolean)));
  }, [items]);

  const shapeOptions = useMemo(() => {
    // prefer main_shape, fallback to shapesExpanded
    const fromMain = items.map((p) => p.main_shape).filter(Boolean);
    const fromExpanded = items
      .flatMap((p) =>
        (p.shapesExpanded || "").split(",").map((s) => s && s.trim())
      )
      .filter(Boolean);
    const cleaned = uniq(fromMain.concat(fromExpanded));
    return ["All"].concat(cleaned);
  }, [items]);

  const metalOptions = useMemo(() => {
    const all = items.flatMap((p) => parseMetals(p.metalsExpanded));
    const uniqMetals = uniq(all);
    // present a readable fallback if no metals found
    if (uniqMetals.length === 0)
      return ["All", "14W", "14Y", "14R", "18W", "18Y", "P"];
    return ["All"].concat(uniqMetals);
  }, [items]);

  const priceBuckets = useMemo(() => {
    const prices = products
      .map((p) => Number(p.priceRaw || 0))
      .filter((v) => v > 0);
    if (prices.length === 0) {
      return ["All", "Below $500", "$500–$1000", "$1000+"];
    }
    const [q1, q2, q3] = quartiles(prices);
    const b1 = Math.round(q1);
    const b2 = Math.round(q2);
    const b3 = Math.round(q3);
    return [
      "All",
      `Under ${fmtCurrency(b1)}`,
      `${fmtCurrency(b1)} - ${fmtCurrency(b2)}`,
      `${fmtCurrency(b2)} - ${fmtCurrency(b3)}`,
      `Above ${fmtCurrency(b3)}`,
    ];
  }, [products]);

  // on mount -> fetch ready products from backend
  useEffect(() => {
    console.log("[ReadyToShip] requesting ready-to-ship products...");
    dispatch(fetchReadyProducts({ tab: "ready", page: 1, limit: 200 }));
  }, [dispatch]);

  // monitor changes
  useEffect(() => {
    console.log("[ReadyToShip] redux items changed -> count:", items.length);
    console.log("[ReadyToShip] meta:", meta);
    console.log("[ReadyToShip] loading:", loading, "error:", error);
  }, [items, meta, loading, error]);

  // filtering logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // shape filter: check main_shape (p.__raw.main_shape) or shapesExpanded includes shape
      if (filters.shape && filters.shape !== "All") {
        const main = String(p.__raw?.main_shape || "").toLowerCase();
        const expanded = String(p.__raw?.shapesExpanded || "").toLowerCase();
        const needle = String(filters.shape).toLowerCase();
        if (!(main === needle || expanded.includes(needle))) return false;
      }

      // style
      if (filters.style && filters.style !== "All") {
        const st = String(p.__raw?.style || p.subtitle || "").toLowerCase();
        if (!st.includes(String(filters.style).toLowerCase())) return false;
      }

      // metal: check metalsExpanded contains selected code
      if (filters.metal && filters.metal !== "All") {
        const metalsRaw = String(p.__raw?.metalsExpanded || "").toLowerCase();
        const sel = String(filters.metal || "")
          .toLowerCase()
          .replace(/\s/g, "");
        if (!metalsRaw.includes(sel)) return false;
      }

      // price buckets
      if (filters.price && filters.price !== "All") {
        const priceNum = Number(p.priceRaw || 0);
        // match the generated buckets
        if (filters.price.startsWith("Under ")) {
          const v = Number(String(filters.price).replace(/[^\d]/g, "")) || 0;
          if (!(priceNum < v)) return false;
        } else if (filters.price.startsWith("Above ")) {
          const v = Number(String(filters.price).replace(/[^\d]/g, "")) || 0;
          if (!(priceNum > v)) return false;
        } else if (filters.price.includes("-")) {
          // range like $x - $y
          const parts = filters.price
            .split("-")
            .map((s) => Number(String(s).replace(/[^0-9.-]+/g, "")) || 0);
          const low = Math.min(parts[0], parts[1]);
          const high = Math.max(parts[0], parts[1]);
          if (priceNum < low || priceNum > high) return false;
        }
      }

      // type filter (ready vs dyo) — for RTS page keep All/Ready
      if (filters.type && filters.type !== "All") {
        // products are readyToShip true; for future use
        const ready = !!p.__raw?.readyToShip;
        if (filters.type === "Ready" && !ready) return false;
        if (filters.type === "DYO" && ready) return false;
      }

      return true;
    });
  }, [products, filters]);

  // scrolling / detail handlers
  const scrollElementBelowStepsById = (id, extraGap = 150, smooth = true) => {
    const el = document.getElementById(id);
    if (!el) return;

    const stepSelectors = [
      ".design-steps",
      ".design-progress",
      ".progress",
      ".progress-bar",
      ".design-flow",
      ".designStep",
      ".steps",
      ".stepper",
      ".choose-steps",
    ];
    let stepsEl = null;
    for (const sel of stepSelectors) {
      const s = document.querySelector(sel);
      if (s) {
        stepsEl = s;
        break;
      }
    }

    const stepHeight = stepsEl ? stepsEl.getBoundingClientRect().height : 0;
    const headerEl = document.querySelector("header");
    const headerHeight = headerEl ? headerEl.offsetHeight : 0;

    const desiredOffset = (stepHeight || headerHeight) + extraGap;

    const rect = el.getBoundingClientRect();
    const elementTopDoc = window.scrollY + rect.top;

    const targetTop = Math.max(0, Math.round(elementTopDoc - desiredOffset));
    try {
      window.scrollTo({ top: targetTop, behavior: smooth ? "smooth" : "auto" });
    } catch (err) {
      window.scrollTo(0, targetTop);
    }
  };

  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setSubView("detail");
    setTimeout(() => {
      scrollElementBelowStepsById("ready-detail", 150, true);
    }, 90);
  };

  const handleBackFromDetail = () => {
    setSelectedProduct(null);
    setSubView("list");
    const gridEl = document.querySelector(`.${styles.grid}`);
    if (gridEl) gridEl.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const handler = () => handleBackFromDetail();
    window.addEventListener("product:back", handler);
    return () => window.removeEventListener("product:back", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // location.state product open (kept)
  useEffect(() => {
    if (location?.state?.product) {
      const p = location.state.product;
      if (p && typeof p === "object" && p.id) {
        setSelectedProduct(p);
        setSubView("detail");
        setTimeout(
          () => scrollElementBelowStepsById("ready-detail", 150, false),
          80
        );
      } else if (typeof p === "string") {
        const resolved = products.find((x) => x.slug === p || x.id === p);
        if (resolved) {
          setSelectedProduct(resolved);
          setSubView("detail");
          setTimeout(
            () => scrollElementBelowStepsById("ready-detail", 150, false),
            80
          );
        }
      }
      try {
        navigate(location.pathname, { replace: true, state: {} });
      } catch (err) {
        // ignore
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.state, products]);

  return (
    <div className={styles.page}>
      {subView === "list" && (
        <>
          <div className={styles.header}>
            <h2 className={styles.title}>Ready To Ship Engagement Rings</h2>
            <p className={styles.desc}>
              After applying all the filters that you love and like, you will
              see a refined list of options that match your preferences.
            </p>
          </div>

          <div className={styles.filters}>
            <Dropdown
              label="Shape"
              options={shapeOptions}
              onChange={(v) => handleFilterChange("shape", v)}
              value={filters.shape || "All"}
            />
            <Dropdown
              label="Style"
              options={styleOptions}
              onChange={(v) => handleFilterChange("style", v)}
              value={filters.style || "All"}
            />
            <Dropdown
              label="Metal"
              options={metalOptions}
              onChange={(v) => handleFilterChange("metal", v)}
              value={filters.metal || "All"}
            />
            <Dropdown
              label="Price"
              options={priceBuckets}
              onChange={(v) => handleFilterChange("price", v)}
              value={filters.price || "All"}
            />
            <Dropdown
              label="Type"
              options={["All", "Ready", "DYO"]}
              onChange={(v) => handleFilterChange("type", v)}
              value={filters.type || "All"}
            />
          </div>

          <div className={styles.count}>{filteredProducts.length} Results</div>
        </>
      )}

      {subView === "list" && (
        <div className={styles.grid}>
          {loading && <p>Loading products...</p>}
          {!loading && error && (
            <div style={{ color: "red" }}>
              Failed to load products from server. See console for details.
            </div>
          )}

          {!loading &&
            filteredProducts.map((p) => (
              <div
                key={p.id}
                role="button"
                tabIndex={0}
                className={styles.cardClickable}
                onClick={() => handleCardClick(p)}
              >
                <ProductCard
                  product={p}
                  onCardClick={() => handleCardClick(p)}
                />
              </div>
            ))}

          {!loading && filteredProducts.length === 0 && <div>0 Results</div>}
        </div>
      )}

      {subView === "detail" && selectedProduct && (
        <div id="ready-detail" style={{ marginTop: 0 }}>
          <ProductDetail
            product={
              selectedProduct.__raw ? selectedProduct.__raw : selectedProduct
            }
            onBack={handleBackFromDetail}
          />
        </div>
      )}
    </div>
  );
}
