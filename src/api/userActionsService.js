import http from "./http";
import ROUTES from "./routes";

// --- Addresses & Profile ---
export const fetchAddresses = async () => {
  const res = await http.get(ROUTES.GET_ADDRESSES);
  return res.data;
};

export const saveAddress = async (payload) => {
  if (payload._id) {
    const url = ROUTES.UPDATE_ADDRESS(payload._id);
    // Exclude _id from body for PUT requests
    const { _id, ...body } = payload;
    const res = await http.put(url, body);
    return res.data;
  } else {
    const res = await http.post(ROUTES.SAVE_ADDRESS, payload);
    return res.data;
  }
};

// --- Orders ---
export const fetchOrders = async () => {
  // Expects response: { success: true, orders: [...] }
  const res = await http.get(ROUTES.USER_ORDERS);
  return res.data;
};

// --- Other ---
export const addToFavourites = (productId) =>
  http.post(ROUTES.WISHLIST_ADD, { productId });

export const placeOrder = (payload) => http.post("/api/orders/place", payload);

export const submitContact = (payload) => http.post(ROUTES.CONTACT_US, payload);
