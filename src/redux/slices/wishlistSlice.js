import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import wishlistService from "../../api/wishlistService";

// Async Thunk: Fetches wishlist from API
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, thunkAPI) => {
    try {
      const items = await wishlistService.fetchWishlist();
      return items;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlist(state) {
      state.items = [];
      state.error = null;
    },
    // NEW: Instantly remove item from Redux state
    removeItem(state, action) {
      const idToRemove = action.payload; // expect wishlistId
      state.items = state.items.filter(
        (item) => String(item.wishlistId) !== String(idToRemove)
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        // Only set loading true if we have no items to avoid flickering
        if (state.items.length === 0) state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWishlist, removeItem } = wishlistSlice.actions;
export default wishlistSlice.reducer;
