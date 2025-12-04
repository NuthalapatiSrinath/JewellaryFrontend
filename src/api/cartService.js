import http from "./http";
import ROUTES from "./routes";

export const fetchCart = async () => {
  const res = await http.get(ROUTES.CART);
  return res.data;
};

// Add Ready-To-Ship Item
export const addToCartRTS = async (payload) => {
  const res = await http.post(ROUTES.CART_ADD_RTS, payload);
  return res.data;
};

// Add Design-Your-Own Item
export const addToCartDYO = async (payload) => {
  const res = await http.post(ROUTES.CART_ADD_DYO, payload);
  return res.data;
};

export const updateCartItemQty = async (itemId, qty) => {
  const res = await http.put(ROUTES.CART_ITEM(itemId), { quantity: qty });
  return res.data;
};

export const removeCartItem = async (itemId) => {
  const res = await http.delete(ROUTES.CART_ITEM(itemId));
  return res.data;
};

export const clearCart = async () => {
  const res = await http.delete(ROUTES.CART);
  return res.data;
};

const cartService = {
  fetchCart,
  addToCartRTS,
  addToCartDYO,
  updateCartItemQty,
  removeCartItem,
  clearCart,
};

export default cartService;
