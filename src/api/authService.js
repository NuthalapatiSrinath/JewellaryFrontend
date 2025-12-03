import http from "./http";
import ROUTES from "./routes";

export const loginUser = async (email, password) => {
  // If you have a specific admin login route, you can switch logic here
  // But usually, one login endpoint handles both.
  const response = await http.post(ROUTES.USER_LOGIN, { email, password });
  return response.data; // Should return { token: "...", user: { role: "admin", ... } }
};

export const registerUser = async (userData) => {
  const response = await http.post(ROUTES.USER_REGISTER, userData);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await http.post(ROUTES.FORGOT_PASS, { email });
  return response.data;
};

export const logoutService = () => {
  // Local storage cleanup is handled by utils/userAuth
};

const authService = {
  loginUser,
  registerUser,
  forgotPassword,
  logoutService,
};

export default authService;
