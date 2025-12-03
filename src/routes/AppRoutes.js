import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";

import EngagementPage from "../pages/EngagementPage/EngagementPage";
import AboutUsPage from "../pages/AboutUsPage/AboutUsPage";
import VisitUsPage from "../pages/VisitUsPage/VisitUsPage";
import ContactUsPage from "../pages/ContactUsPage/ContactUsPage";
import CheckoutHostPage from "../pages/CheckoutHost/CheckoutHostPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import OrdersPage from "../pages/OrdersPage/OrdersPage";
import Journelpage from "../pages/JournelPage/JournelPage";
import WishlistPage from "../pages/WishlistPage/WishlistPage";
import SearchResults from "../pages/SearchResults/SearchResults";
import PaymentSuccess from "../pages/PaymentSuccess/PaymentSuccess";
import SelectionSection from "../sections/SelectionSection/SelectionSection";
import ProductDetail from "../sections/ReadyToShip/ProductDetail/ProductDetail";
import ProductDetailforSetting from "../sections/DesignYourOwn/ProductDetailforSetting/ProductDetailforSetting";
import DiamondFinder from "../sections/DiamondFinder/DiamondFinder";

// collection product detail page (inline / stand-alone)
import CollectionProductDetail from "../sections/CollectionProductDetail/CollectionProductDetail";

// your new landing page at root
import ArraJewelsPage from "../pages/ArraJewelsPage/ArraJewelsPage";
import WeddingPage from "../pages/WeddingPage/WeddingPage";
import AnniversaryPage from "../pages/WeddingPage/AnniversaryPage/AnniversaryPage";
import EternityPage from "../pages/WeddingPage/EternityPage/EternityPage";
import CurvedPage from "../pages/WeddingPage/CurvedPage/CurvedPage";
import StackablePage from "../pages/WeddingPage/StackablePage/StackablePage";
import OtherPage from "../pages/WeddingPage/OtherPage/OtherPage";
import WeddingBandsPage from "../pages/WeddingPage/WeddingBandsPage/WeddingBandsPage";
import GiftsPage from "../pages/GiftsPage/GiftsPage";
import GemStonePage from "../pages/GemStonePage/GemStonePage";
import DiamondPage from "../pages/DiamondPage/DiamondPage";
import JewellaryPage from "../pages/JewellaryPage/JewellaryPage";
import EarringsPage from "../pages/EarringsPage/EarringsPage";
import NecklacesPage from "../pages/NecklacesPage/NecklacesPage";
import BraceletsPage from "../pages/BraceletsPage/BraceletsPage";
import RingsBandsPage from "../pages/RingsBandsPage/RingsBandsPage";
import ReadyToShip from "../sections/ReadyToShip/ReadyToShip";





function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        {/* Root shows ArraJewels landing page (no nav tab active by default) */}
        <Route index element={<ArraJewelsPage />} />

        {/* Engagement: legacy/explicit route */}
       <Route path="engagement" element={<Navigate to="/engagement/design" replace />} />
<Route path="engagement/:tab" element={<SelectionSection />} />

         
{/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
{/* <Route path="/reset-password" element={<ResetPasswordPage />} /> */}
        <Route path="/wedding" element={<WeddingPage />} />
        <Route path="/wedding/wedding" element={<WeddingBandsPage />} />
        <Route path="/wedding/anniversary" element={<AnniversaryPage />} />
        <Route path="/wedding/eternity" element={<EternityPage />} />
        <Route path="/wedding/curved" element={<CurvedPage />} />
        <Route path="/wedding/stackable" element={<StackablePage />} />
        <Route path="/wedding/other" element={<OtherPage />} />
     
        {/* 💎 JEWELLERY ROUTES */}
<Route path="/jewellery" element={<JewellaryPage />} />
<Route path="/jewellery/earrings" element={<EarringsPage />} />
<Route path="/jewellery/necklaces" element={<NecklacesPage />} />
<Route path="/jewellery/bracelets" element={<BraceletsPage />} />
<Route path="/jewellery/rings" element={<RingsBandsPage />} />



        <Route path="diamonds" element={<DiamondPage />} />
          <Route path="/diamonds/labgrown" element={<DiamondPage />} />
        <Route path="/diamonds/natural" element={<DiamondPage />} />
        <Route path="gemstone" element={<GemStonePage />} />
        <Route path="gifts" element={<GiftsPage />} />

        {/* product detail */}
        <Route path="product/:slug" element={<ProductDetail />} />

        {/* collection product detail routes */}
        <Route path="collection-product" element={<CollectionProductDetail />} />
        <Route path="/wedding/collection-product/:slug" element={<CollectionProductDetail />} />
 <Route path="collection-product/:slug" element={<CollectionProductDetail />} />
        <Route path="about" element={<AboutUsPage />} />
        <Route path="visit" element={<VisitUsPage />} />
        <Route path="contact" element={<ContactUsPage />} />
        {/* <Route path="journal" element={<Journelpage />} /> */}
        <Route path="/checkout/success" element={<PaymentSuccess />} />
        <Route path="/search" element={<SearchResults />} />

        <Route path="profile" element={<ProfilePage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="wishlist" element={<WishlistPage />} />

        <Route path="cart" element={<CheckoutHostPage />} />
        <Route path="checkout" element={<CheckoutHostPage initialStep={1} />} />
        <Route path="payment" element={<CheckoutHostPage initialStep={2} />} />

        {/* design flow */}
        <Route path="design" element={<ProductDetailforSetting />} />
      </Route>

      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default AppRoutes;
