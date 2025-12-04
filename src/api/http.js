// src/api/http.js
import axios from "axios";
import { getUserToken } from "../utils/userAuth";

// ✅ Point to the Domain Root (Backend hosting URL)
const API_BASE = "https://jewellery-gules-one.vercel.app";

const http = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Token to every request if logged in
http.interceptors.request.use(
  (config) => {
    const token = getUserToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Log errors for easier debugging
http.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("HTTP Error:", error.response?.status, error.config?.url);
    return Promise.reject(error);
  }
);

export default http;
