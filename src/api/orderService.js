// src/api/orderService.js
import http from "./http";
import ROUTES from "./routes";

export const placeOrderRTS = async (payload) => {
  // This uses the new route we defined above
  const res = await http.post(ROUTES.ORDER_CHECKOUT_RTS, payload);
  return res.data;
};

export const placeOrderDYO = async (payload) => {
  const res = await http.post(ROUTES.ORDER_CHECKOUT_DYO, payload);
  return res.data;
};

export const fetchOrders = async () => {
  const res = await http.get(ROUTES.USER_ORDERS);
  return res.data;
};
