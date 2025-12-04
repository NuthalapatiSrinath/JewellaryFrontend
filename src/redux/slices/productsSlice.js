// src/redux/slices/productsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productsService from "../../api/productsService";

// --- DYO Thunk ---
export const fetchDesignProducts = createAsyncThunk(
  "products/fetchDesignProducts",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const data = await productsService.fetchDyoProducts(filters);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// --- RTS Thunk ---
export const fetchReadyProducts = createAsyncThunk(
  "products/fetchReadyProducts",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const data = await productsService.fetchRtsProducts(filters);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

const initialState = {
  items: [],
  meta: { total: 0, page: 1, pages: 0, tab: null },
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
    // --- DYO ---
    builder
      .addCase(fetchDesignProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDesignProducts.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload || {};
        state.items = Array.isArray(payload.data)
          ? payload.data
          : payload.products || [];
        state.meta = {
          total: payload.total ?? 0,
          page: payload.page ?? 1,
          pages: payload.pages ?? 0,
          tab: "design",
        };
      })
      .addCase(fetchDesignProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

    // --- RTS ---
    builder
      .addCase(fetchReadyProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReadyProducts.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload || {};
        state.items = Array.isArray(payload.data)
          ? payload.data
          : payload.products || [];
        state.meta = {
          total: payload.total ?? 0,
          page: payload.page ?? 1,
          pages: payload.pages ?? 0,
          tab: "ready",
        };
      })
      .addCase(fetchReadyProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearProducts } = productsSlice.actions;
export default productsSlice.reducer;
