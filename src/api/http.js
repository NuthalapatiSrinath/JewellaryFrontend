// src/api/http.js
import axios from "axios";
import { getUserToken } from "../utils/userAuth";

// FIX: Point to ROOT. (We will add /api in the routes file)
const API_BASE = "https://jewellery-gules-one.vercel.app";

const http = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config) => {
  const token = getUserToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  else delete config.headers.Authorization;
  return config;
});

http.interceptors.response.use(
  (resp) => resp,
  (err) => {
    console.error("[http] error:", err.config?.url, err.response?.status);
    return Promise.reject(err);
  }
);

export default http;
