import React from 'react'
import CollectionsSection from '../../sections/CollectionsSection/CollectionsSection'
import FooterPage from '../FooterPage/FooterPage'
import SpotlightSection from '../../sections/SpotlightSection/SpotlightSection'
import CustomerReviews from '../../sections/CustomerReviews/CustomerReviews'
import ShopByShape from '../../sections/ShopByShape/ShopByShape'
import GiftShowcase from '../../sections/GiftShowcase/GiftShowcase'
import ChooseDiamonds from '../../sections/ChooseDiamonds/ChooseDiamonds'
import HeroSection from '../../sections/HeroSection/HeroSection'

import CollectionsPage from "../CollectionsPage/CollectionsPage"
const EngagementPage = () => {
  return (
    <div>
      <HeroSection/>
      <CollectionsSection />
      {/* <FeaturedCollection/> */}
      <CollectionsPage/>
      <ChooseDiamonds/>
      <GiftShowcase/>
      <ShopByShape/>
      <CustomerReviews />
      <div>
        <SpotlightSection />
      </div>

      <FooterPage />
    </div>
  );
}

export default EngagementPage
