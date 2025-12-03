// src/redux/slices/productsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as productService from "../../api/productService";

/**
 * fetchDesignProducts
 * payload -> { page = 1, limit = 200, tab = "design", ... }
 */
export const fetchDesignProducts = createAsyncThunk(
  "products/fetchDesignProducts",
  async (payload = { page: 1, limit: 200, tab: "design" }, { rejectWithValue }) => {
    console.log("[productsSlice] fetchDesignProducts -> calling with payload:", payload);
    try {
      const data = await productService.listDesignProducts(payload);
      console.log("[productsSlice] fetchDesignProducts -> received meta:", {
        total: data.total,
        page: data.page,
        pages: data.pages,
        tab: data.tab,
      });
      return data;
    } catch (err) {
      console.error("[productsSlice] fetchDesignProducts -> error:", err?.response?.status, err?.message);
      return rejectWithValue(err?.response?.data || { message: err.message });
    }
  }
);

/**
 * fetchReadyProducts
 * payload -> { page = 1, limit = 200, tab = "ready", ... }
 * Uses same service function (listDesignProducts accepts params obj)
 */
export const fetchReadyProducts = createAsyncThunk(
  "products/fetchReadyProducts",
  async (payload = { page: 1, limit: 200, tab: "ready" }, { rejectWithValue }) => {
    console.log("[productsSlice] fetchReadyProducts -> calling with payload:", payload);
    try {
      const data = await productService.listDesignProducts(payload); // service is generic
      console.log("[productsSlice] fetchReadyProducts -> received meta:", {
        total: data.total,
        page: data.page,
        pages: data.pages,
        tab: data.tab,
      });
      return data;
    } catch (err) {
      console.error("[productsSlice] fetchReadyProducts -> error:", err?.response?.status, err?.message);
      return rejectWithValue(err?.response?.data || { message: err.message });
    }
  }
);

const initialState = {
  items: [], // list of products (raw backend objects)
  meta: { total: 0, page: 1, pages: 0, tab: null, counts: {} },
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProducts(state) {
      state.items = [];
      state.meta = initialState.meta;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Design fetch
    builder
      .addCase(fetchDesignProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("[productsSlice] fetchDesignProducts.pending");
      })
      .addCase(fetchDesignProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const payload = action.payload || {};
        state.items = Array.isArray(payload.data) ? payload.data : [];
        state.meta = {
          total: payload.total ?? 0,
          page: payload.page ?? 1,
          pages: payload.pages ?? 0,
          tab: payload.tab ?? null,
          counts: payload.counts ?? {},
        };
        console.log("[productsSlice] fetchDesignProducts.fulfilled -> items count:", state.items.length);
      })
      .addCase(fetchDesignProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error;
        console.error("[productsSlice] fetchDesignProducts.rejected ->", state.error);
      });

    // Ready fetch
    builder
      .addCase(fetchReadyProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("[productsSlice] fetchReadyProducts.pending");
      })
      .addCase(fetchReadyProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const payload = action.payload || {};
        state.items = Array.isArray(payload.data) ? payload.data : [];
        state.meta = {
          total: payload.total ?? 0,
          page: payload.page ?? 1,
          pages: payload.pages ?? 0,
          tab: payload.tab ?? null,
          counts: payload.counts ?? {},
        };
        console.log("[productsSlice] fetchReadyProducts.fulfilled -> items count:", state.items.length);
      })
      .addCase(fetchReadyProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error;
        console.error("[productsSlice] fetchReadyProducts.rejected ->", state.error);
      });
  },
});

export const { clearProducts } = productsSlice.actions;
export default productsSlice.reducer;
