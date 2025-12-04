// src/api/addressService.js
import http from "./http";
import ROUTES from "./routes";

export const fetchAddresses = async () => {
  const res = await http.get(ROUTES.GET_ADDRESSES);
  return res.data;
};

export const addAddress = async (payload) => {
  const res = await http.post(ROUTES.SAVE_ADDRESS, payload);
  return res.data;
};

export const deleteAddress = async (id) => {
  const res = await http.delete(ROUTES.DELETE_ADDRESS(id));
  return res.data;
};
