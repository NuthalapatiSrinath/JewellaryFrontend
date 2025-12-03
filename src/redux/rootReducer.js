// src/redux/rootReducer.js

import navBarSlice from "./slices/navBarSlice";
import modalSlice from "./slices/modalSlice";
import authSlice from "./slices/authSlice";
import wishlistReducer from "./slices/wishlistSlice";
// ✅ Import the new products slice
import productsSlice from "./slices/productsSlice";

const rootReducer = {
  navBar: navBarSlice,
  modal: modalSlice,
  auth: authSlice,
  wishlist: wishlistReducer,

  // ✅ Add this new reducer for products
  products: productsSlice,
};

export default rootReducer;
