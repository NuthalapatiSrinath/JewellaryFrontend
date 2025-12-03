// src/api/productService.js
import http from "./http"; // your axios instance
// Note: previously you had listProducts/getProductDetail — keep them, we add listDesignProducts

/**
 * listProducts(params) - returns axios response (res.data expected to be { data: [...], total, ... })
 */
export const listProducts = async (params = {}) => {
  console.log("[productService] listProducts -> params:", params);
  const query = new URLSearchParams(params).toString();
  const url = `/api/products/list${query ? `?${query}` : ""}`;
  console.log("[productService] GET", url);
  const res = await http.get(url);
  console.log("[productService] listProducts -> response:", res && res.data);
  return res.data;
};

/**
 * getProductDetail(id) - returns axios response data
 */
export const getProductDetail = async (id) => {
  console.log("[productService] getProductDetail -> id:", id);
  const url = `/api/products/detail/${id}`;
  const res = await http.get(url);
  console.log("[productService] getProductDetail -> response:", res && res.data);
  return res.data;
};

/**
 * listDesignProducts(params) - convenience wrapper that forces tab=design
 */
export const listDesignProducts = async (params = {}) => {
  const final = { tab: "design", page: 1, limit: 24, ...params };
  console.log("[productService] listDesignProducts -> params:", final);
  return listProducts(final); // returns res.data
};

const productService = {
  listProducts,
  getProductDetail,
  listDesignProducts,
};

export default productService;
