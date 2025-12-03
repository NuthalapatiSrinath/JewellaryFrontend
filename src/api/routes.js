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

  // --- Orders ---
  USER_ORDERS: "/api/orders",

  // --- Cart ---
  CART: "/api/cart", // GET, POST
  CART_ITEM: (itemId) => `/api/cart/items/${itemId}`, // PUT, DELETE

  // --- Wishlist ---
  WISHLIST_GET_ALL: "/api/wishlist",
  WISHLIST_ADD: "/api/wishlist",
  WISHLIST_DELETE: "/api/wishlist",

  // --- Features ---
  CONTACT_US: "/api/contact-us",

  // --- Products ---
  PRODUCT_LIST: "/api/products",
  PRODUCT_DETAIL: (idOrSlug) => `/api/products/detail/${idOrSlug}`,

  // --- Diamonds ---
  DIAMONDS_ALL: "/diamonds",
  DIAMOND_BY_ID: (id) => `/diamonds/${id}`,
  SHAPES: "/diamonds/shapes",
  PRICE_RANGE: "/diamonds/price-range",
};

export default ROUTES;
