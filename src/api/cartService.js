import http from "./http";
import ROUTES from "./routes";

export const fetchCart = async () => {
  const res = await http.get(ROUTES.CART);
  return res.data;
};

export const addToCart = async (payload) => {
  const res = await http.post(ROUTES.CART, payload);
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

const cartService = {
  fetchCart,
  addToCart,
  updateCartItemQty,
  removeCartItem,
};

export default cartService;
