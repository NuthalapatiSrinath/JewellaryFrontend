// src/api/userAuthService.js
import http from "./http";
import ROUTES from "./routes";

function normalizeAuth(data) {
  // Accept multiple server shapes: { user_token, token } or { token } and user
  const token = data?.user_token || data?.token || data?.accessToken;
  const user = data?.user || data?.user_data || null;
  const role = user?.role || data?.role || "customer";

  if (!token) {
    console.error("Auth response missing token:", data);
    throw new Error("Authentication failed. Token missing.");
  }

  return { token, user, role };
}

export async function registerUser({ firstName, lastName, email, password }) {
  console.log("[AUTH] register payload:", { firstName, lastName, email, password: "***" });
  const { data } = await http.post(ROUTES.USER_REGISTER, {
    firstName,
    lastName,
    email,
    password,
  });
  console.log("[AUTH] register response:", data);
  return normalizeAuth(data);
}

export async function loginUser(email, password) {
  console.log("[AUTH] login payload:", { email, password: "***" });
  const { data } = await http.post(ROUTES.USER_LOGIN, { email, password });
  console.log("[AUTH] login response:", data);
  return normalizeAuth(data);
}

export async function forgotPassword(email) {
  const { data } = await http.post(ROUTES.FORGOT_PASS, { email });
  return data;
}

export async function resetPassword(token, newPassword) {
  const { data } = await http.post(ROUTES.RESET_PASS, { token, newPassword });
  return data;
}
