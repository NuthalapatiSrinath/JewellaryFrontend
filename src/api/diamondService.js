// src/api/diamondService.js
import ROUTES from "./routes";

/**
 * diamondService
 * - fetchAllDiamonds() -> gets all diamonds
 * - fetchDiamonds(filters) -> tries server-side filtering (if backend supports it)
 * - fetchDiamondById(id)
 * - fetchFilterOptions() -> optional; tries shapes/colors endpoints
 *
 * Notes:
 * - Uses REACT_APP_API_BASE (create .env) or falls back to window origin.
 */
const BASE = process.env.REACT_APP_API_BASE || window?.__API_BASE__ || "https://jewellery-gules-one.vercel.app/api";

function buildQuery(filters = {}) {
  const params = new URLSearchParams();

  // Only append keys that are defined and not null/empty
  Object.entries(filters).forEach(([k, v]) => {
    if (v === undefined || v === null) return;

    // If value is boolean -> string
    if (typeof v === "boolean") {
      params.set(k, String(v));
      return;
    }

    // If it's an array (like color range indices) serialize intelligently
    if (Array.isArray(v)) {
      // backend might expect 'colorFrom' & 'colorTo' or 'colors=G,F'
      // We'll join with comma by default
      params.set(k, v.join(","));
      return;
    }

    // otherwise simple set
    params.set(k, String(v));
  });

  const q = params.toString();
  return q ? `?${q}` : "";
}

async function safeFetch(url, opts = {}) {
  try {
    const res = await fetch(url, opts);
    const text = await res.text();
    // Attempt to parse JSON, but give helpful logs if server returned HTML (404 page)
    try {
      const json = JSON.parse(text);
      if (!res.ok) {
        throw { status: res.status, data: json };
      }
      return json;
    } catch (e) {
      if (!res.ok) {
        // res not ok and body not JSON
        console.error("[diamondService] error response (non-json):", res.status, text);
        throw { status: res.status, data: text };
      }
      // body was plain text but OK — unlikely, but return text
      return text;
    }
  } catch (err) {
    console.error("[diamondService] network/error:", err);
    throw err;
  }
}

const diamondService = {
  // get all diamonds (no filters). Returns array or {diamonds:[], pagination?, filters?}
  async fetchAllDiamonds() {
    const url = `${BASE}${ROUTES.DIAMONDS_ALL}`;
    try {
      const data = await safeFetch(url);
      // Some APIs return { diamonds: [...], pagination: {...} }
      if (data && data.diamonds) return data.diamonds;
      if (Array.isArray(data)) return data;
      // fallback: normalize single object to array if needed
      return Array.isArray(data?.diamonds) ? data.diamonds : [];
    } catch (err) {
      // on error return empty array (page can still render)
      return [];
    }
  },

  // server-side fetch with filters (if your backend supports query params)
  // filters should be a plain object: { shape, minPrice, maxPrice, caratMin, caratMax, color, ... }
  async fetchDiamonds(filters = {}) {
    const query = buildQuery(filters);
    const url = `${BASE}${ROUTES.DIAMONDS_ALL}${query}`;
    try {
      const data = await safeFetch(url);
      if (data && data.diamonds) return data.diamonds;
      if (Array.isArray(data)) return data;
      return [];
    } catch (err) {
      // If 404/route not found, fallback to fetchAllDiamonds (client-side filtering)
      console.warn("[diamondService] fetchDiamonds failed, falling back to all diamonds", err);
      return this.fetchAllDiamonds();
    }
  },

  async fetchDiamondById(id) {
    if (!id) return null;
    try {
      const data = await safeFetch(`${BASE}${ROUTES.DIAMOND_BY_ID(id)}`);
      // backend may return diamond object directly or wrapped
      if (data?.diamond) return data.diamond;
      return data;
    } catch (err) {
      return null;
    }
  },

  // optional endpoints (if backend exposes them)
  async fetchShapes() {
    try {
      const data = await safeFetch(`${BASE}${ROUTES.SHAPES}`);
      return data?.shapes || data || [];
    } catch (err) {
      return [];
    }
  },

  async fetchPriceRange() {
    try {
      const data = await safeFetch(`${BASE}${ROUTES.PRICE_RANGE}`);
      return data || null;
    } catch (err) {
      return null;
    }
  },
};

export default diamondService;
