// src/api/productsService.js
import http from "./http";
import ROUTES from "./routes";

/**
 * Fetch DYO Products
 */
export const fetchDyoProducts = async (filters = {}) => {
  const params = { tab: "design", ...filters };
  const res = await http.get(ROUTES.PRODUCT_LIST_DYO, { params });
  return res.data;
};

export const fetchDyoVariants = async (productId) => {
  const params = { tab: "design", productId };
  const res = await http.get(ROUTES.PRODUCT_VARIANTS_DYO, { params });
  return res.data;
};

export const fetchDyoPrice = async (sku, metal, shapeCode) => {
  const params = { metal, shapeCode };
  const res = await http.get(ROUTES.PRODUCT_PRICE_DYO(sku), { params });
  return res.data;
};

// --- ✅ RTS Functions ---

/**
 * Fetch RTS Products with Filters
 */
export const fetchRtsProducts = async (filters = {}) => {
  const params = { tab: "ready", ...filters };
  const res = await http.get(ROUTES.PRODUCT_LIST_RTS, { params });
  return res.data;
};

/**
 * Fetch RTS Variants (e.g. to get different center stones/prices)
 */
export const fetchRtsVariants = async (productId) => {
  const params = { tab: "ready", productId };
  const res = await http.get(ROUTES.PRODUCT_VARIANTS_RTS, { params });
  return res.data;
};

/**
 * Get Dynamic Price for RTS Product
 */
export const fetchRtsPrice = async (
  id,
  metal,
  shapeCode,
  centerStoneWeight
) => {
  const params = { metal, shapeCode, centerStoneWeight };
  const res = await http.get(ROUTES.PRODUCT_PRICE_RTS(id), { params });
  return res.data;
};

const productsService = {
  fetchDyoProducts,
  fetchDyoVariants,
  fetchDyoPrice,
  fetchRtsProducts,
  fetchRtsVariants,
  fetchRtsPrice,
};

export default productsService;
