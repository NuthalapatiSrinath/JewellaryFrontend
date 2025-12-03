// src/api/services/productService.js
import http from "./http";
import ROUTES from "./routes";

/**
 * Fetch list of products from the backend.
 * Returns the raw payload exactly as the server returned it (so callers can read items, total, page, pages, filters).
 *
 * Example server response shape (based on your sample):
 * {
 *   items: [ ... ],
 *   total: 250,
 *   page: 1,
 *   pages: 13,
 *   filters: { ... }
 * }
 */
export const fetchProductList = async (params = {}) => {
  try {
    console.log("[productService] fetchProductList params:", params);
    const res = await http.get(ROUTES.PRODUCT_LIST, { params });
    console.log("[productService] fetchProductList response:", res.data);
    // return the payload exactly, caller can decide to use payload.items or payload directly
    return res.data;
  } catch (err) {
    console.error("[productService] fetchProductList error:", err?.response?.data || err.message || err);
    throw err;
  }
};

/**
 * Fetch product detail (if needed). Note your ROUTES.PRODUCT_DETAIL uses /products/detail/:id
 */
export const fetchProductDetail = async (idOrSlug) => {
  try {
    console.log("[productService] fetchProductDetail:", idOrSlug);
    const res = await http.get(ROUTES.PRODUCT_DETAIL(idOrSlug));
    console.log("[productService] fetchProductDetail response:", res.data);
    return res.data;
  } catch (err) {
    console.error("[productService] fetchProductDetail error:", err?.response?.data || err.message || err);
    throw err;
  }
};

/* ----------------- Mapping helpers ----------------- */

/**
 * Best-effort map from backend product object -> UI product shape expected by FeaturedCollectionSection
 * Output shape:
 * {
 *   id,
 *   title,
 *   subtitle,
 *   price,            // string like "$ 7,985.60"
 *   variants: { gold, white, rose }, // image urls or fallbacks
 *   defaultColor,
 *   gif360,           // gif url fallback
 *   __raw             // original product object
 * }
 *
 * NOTE: Your sample products have default_images: [] (empty). If your real API returns image paths,
 * this mapper will prefer them. If not, it falls back to placeholder images in /images/rings/.
 * Adjust the `ensureAbsoluteImage` helper below if your images are served from a CDN or need a prefix.
 */
export const mapProductToUi = (p) => {
  if (!p) return null;
  const id = p._id || p.productId || p.id || p.productSku || `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const title = p.productName || p.title || p.productSku || "Untitled product";
  const subtitle = (Array.isArray(p.categories) && p.categories.join(", ")) || p.style || p.description || "";
  const priceRaw = p.default_price ?? p.defaultPrice ?? p.price ?? 0;

  // Normalize images: backend may return [] or array of strings or array of objects
  const defaultImages = Array.isArray(p.default_images) ? p.default_images : [];
  const imageUrls = defaultImages
    .map((it) => {
      if (!it) return null;
      if (typeof it === "string") return it;
      // if object like { url: '...', path: '...' } try common keys
      return it.url || it.path || it.filename || null;
    })
    .filter(Boolean);

  // If no default_images available, you can try to build a path using basePath + filenameTemplate.
  // filenameTemplate looks like "{sku}_{shape}_{metal}_{angle}.jpg" — building a reliable filename requires knowing values.
  // For now we fall back to placeholders. Update ensureAbsoluteImage() if your server stores images at known urls.
  const ensureAbsoluteImage = (p) => (img) => {
    if (!img) return null;
    // if already absolute URL
    if (typeof img === "string" && img.match(/^https?:\/\//i)) return img;
    // If your server exposes images under e.g. https://your-base/uploads/<path>, update below:
    // return `${http.defaults.baseURL}/${img.replace(/^\//, "")}`;
    // For now just return as-is:
    return img;
  };

  const ensure = ensureAbsoluteImage(p);

  const variants = {
    gold: ensure(imageUrls[0]) || "/images/rings/gold.jpg",
    white: ensure(imageUrls[1]) || ensure(imageUrls[0]) || "/images/rings/diamond.png",
    rose: ensure(imageUrls[2]) || ensure(imageUrls[0]) || "/images/rings/rose.png",
  };

  const defaultColor = Object.keys(variants)[0];

  const price = `$ ${Number(priceRaw || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

  // gif360: attempt to use basePath to build a gif path if you host them at predictable location
  const gif360 = p.gif360 || (p.basePath ? `${http.defaults.baseURL}/${p.basePath}/360.gif` : "/images/360/ring360.gif");

  return {
    id,
    title,
    subtitle,
    price,
    variants,
    defaultColor,
    gif360,
    __raw: p,
  };
};

/**
 * Map an array of backend products to the UI shape.
 * Useful: const uiItems = mapProductListToUi(payload.items || []);
 */
export const mapProductListToUi = (items = []) => {
  if (!Array.isArray(items)) return [];
  return items.map(mapProductToUi).filter(Boolean);
};
