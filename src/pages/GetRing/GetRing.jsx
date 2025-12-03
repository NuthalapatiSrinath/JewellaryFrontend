import React from "react";
import "./GetRing.css";
import ContactInformation from "../../sections/ContactInformation/ContactInformation";
import ShippingBillingForm from "../../sections/ShippingBillingForm/ShippingBillingForm";
import FooterPage from "../FooterPage/FooterPage";
import OrderSummaryCard from "../../components/OrderSummarryCard/OrderSummarryCard";

const GetRing = () => {
  const demoItems = [
    {
      id: "ring-1",
      name: "Solitaire Diamond Engagement Ring",
      image: "/images/rings/rosering.jpg",
      price: 6000,
      qty: 1,
    },
    {
      id: "ring-2",
      name: "Solitaire Diamond Engagement Ring",
      image: "/images/rings/whitering.jpg",
      price: 6000,
      qty: 1,
    },
  ];

  return (
    <div className="getring-wrapper">
      <div className="getring-container">
        <div className="getring-left">
          <ContactInformation />
          <ShippingBillingForm />
        </div>

        <div className="getring-right">
          <div className="getring-sticky">
            <OrderSummaryCard
              items={demoItems}
              shippingCharges={100}
              otherCharges={100}
            />
          </div>
        </div>
      </div>

      <FooterPage />
    </div>
  );
};

export default GetRing;
