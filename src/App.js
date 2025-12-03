import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./App.css";

import AppRoutes from "./routes/AppRoutes";
import RenderModal from "./modals/RenderModal/RenderModal";
// import { initAutoLogout } from "./utils/autoLogout";
import { isLoggedIn } from "./utils/userAuth";
import { fetchWishlist } from "./redux/slices/wishlistSlice";

function App() {
  const dispatch = useDispatch();
  const isModalOpen = useSelector((state) => state.modal.isOpen);

  useEffect(() => {
    // 1. Fetch Wishlist on App Load (if user is logged in)
    if (isLoggedIn()) {
      dispatch(fetchWishlist());
    }

    // 2. Listen for "wishlist:changed" events (triggered by add/remove in Service)
    // This keeps the Redux state in sync when you click hearts on ProductCards
    const handleWishlistChange = () => {
      if (isLoggedIn()) {
        dispatch(fetchWishlist());
      }
    };

    // 3. Optional: Initialize auto-logout
    // if (isLoggedIn()) {
    //   initAutoLogout();
    // }

    window.addEventListener("wishlist:changed", handleWishlistChange);

    return () => {
      window.removeEventListener("wishlist:changed", handleWishlistChange);
    };
  }, [dispatch]);

  return (
    <div className="App">
      <AppRoutes />
      {isModalOpen && <RenderModal />}
    </div>
  );
}

export default App;
