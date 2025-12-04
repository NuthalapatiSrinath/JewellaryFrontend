// src/api/routes.js

const ROUTES = {
  // --- Auth ---
  USER_REGISTER: "/api/auth/register_user",
  USER_LOGIN: "/api/auth/login_user",
  FORGOT_PASS: "/api/auth/forgot_password",
  RESET_PASS: "/api/auth/reset_password",

  // --- Addresses ---
  GET_ADDRESSES: "/api/addresses",
  SAVE_ADDRESS: "/api/addresses",
  UPDATE_ADDRESS: (id) => `/api/addresses/${id}`,
  DELETE_ADDRESS: (id) => `/api/addresses/${id}`,

  // --- Orders ---
  USER_ORDERS: "/api/orders",
  ORDER_CHECKOUT_RTS: "/api/orders/rts/checkout",
  ORDER_CHECKOUT_DYO: "/api/orders/dyo/checkout",

  // --- Cart ---
  CART: "/api/cart",
  CART_ADD_RTS: "/api/cart/rts",
  CART_ADD_DYO: "/api/cart/dyo",
  CART_ITEM: (itemId) => `/api/cart/items/${itemId}`,

  // --- Wishlist ---
  WISHLIST_GET_ALL: "/api/wishlist",
  WISHLIST_ADD: "/api/wishlist",
  WISHLIST_DELETE: "/api/wishlist",

  // --- Features ---
  CONTACT_US: "/api/contact-us",

  // --- Products (General) ---
  PRODUCT_LIST: "/api/products",
  PRODUCT_DETAIL: (idOrSlug) => `/api/products/detail/${idOrSlug}`,

  // --- DYO (Design Your Own) ---
  PRODUCT_LIST_DYO: "/api/products/list",
  PRODUCT_VARIANTS_DYO: "/api/products/list/variants",
  PRODUCT_PRICE_DYO: (sku) => `/api/products/${sku}/price/dyo`,

  // --- ✅ RTS (Ready To Ship) ---
  PRODUCT_LIST_RTS: "/api/products/list", // GET ?tab=ready
  PRODUCT_VARIANTS_RTS: "/api/products/list/variants", // GET ?tab=ready&productId=...
  PRODUCT_PRICE_RTS: (id) => `/api/products/${id}/price/rts`, // GET ?metal=...&shape=...

  // --- Diamonds ---
  DIAMONDS_ALL: "/api/diamonds",
  DIAMOND_BY_ID: (id) => `/api/diamonds/${id}`,
  SHAPES: "/api/diamonds/shapes",
  PRICE_RANGE: "/api/diamonds/price-range",
};

export default ROUTES;
