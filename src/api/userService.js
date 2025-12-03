// src/api/userService.js
import http from "./http";
import ROUTES from "./routes";

export const getProfile = async () => {
  const response = await http.get(ROUTES.USER_PROFILE);
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await http.put(ROUTES.USER_UPDATE, profileData);
  return response.data;
};

export const getMyOrders = async () => {
  const response = await http.get(ROUTES.USER_ORDERS);
  return response.data;
};

export const sendContactMessage = async (messageData) => {
  const response = await http.post(ROUTES.CONTACT_US, messageData);
  return response.data;
};

const userService = {
  getProfile,
  updateProfile,
  getMyOrders,
  sendContactMessage,
};

export default userService;
