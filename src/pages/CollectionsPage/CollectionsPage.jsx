// pages/CollectionsPage.jsx
import React from "react";
import FeaturedCollection from "../../sections/FeaturedCollectionSection/FeaturedCollectionSection";

const products = [
  {
    id: 1,
    title: "Solitaire Diamond Engagement Ring",
    subtitle: "classical Rose Gold model",
    price: "$ 500 USD",
    variants: {
      gold: "/images/rings/gold.jpg",
      white: "/images/rings/diamond.png",
      rose: "/images/rings/rose.png",
    },
    defaultColor: "gold",
    gif360: "/images/360/ring360.gif",
  },
  {
    id: 2,
    title: "Elegant Halo Diamond Ring",
    subtitle: "vintage Rose Gold model",
    price: "$ 720 USD",
    variants: {
      gold: "/images/rings/gold.jpg",
      white: "/images/rings/diamond.png",
      rose: "/images/rings/rose.png",
    },
    defaultColor: "white",
    gif360: "/images/360/ring360.gif",
  },
  {
    id: 3,
    title: "Classic Bezel Ring",
    subtitle: "minimal rose design",
    price: "$ 450 USD",
    variants: {
      gold: "/images/rings/gold.jpg",
      white: "/images/rings/diamond.png",
      rose: "/images/rings/rose.png",
    },
    defaultColor: "rose",
  },
  {
    id: 4,
    title: "Radiant Three-Stone Ring",
    subtitle: "luxury inspired cut",
    price: "$ 950 USD",
    variants: {
      gold: "/images/rings/gold.jpg",
      white: "/images/rings/diamond.png",
      rose: "/images/rings/rose.png",
    },
    defaultColor: "gold",
  },
  {
    id: 5,
    title: "Radiant Three-Stone Ring",
    subtitle: "luxury inspired cut",
    price: "$ 950 USD",
    variants: {
      gold: "/images/rings/gold.jpg",
      white: "/images/rings/diamond.png",
      rose: "/images/rings/rose.png",
    },
    defaultColor: "gold",
  },
  {
    id: 6,
    title: "Radiant Three-Stone Ring",
    subtitle: "luxury inspired cut",
    price: "$ 950 USD",
    variants: {
      gold: "/images/rings/gold.jpg",
      white: "/images/rings/diamond.png",
      rose: "/images/rings/rose.png",
    },
    defaultColor: "gold",
  },
  {
    id: 7,
    title: "Radiant Three-Stone Ring",
    subtitle: "luxury inspired cut",
    price: "$ 950 USD",
    variants: {
      gold: "/images/rings/gold.jpg",
      white: "/images/rings/diamond.png",
      rose: "/images/rings/rose.png",
    },
    defaultColor: "gold",
  },
];

export default function CollectionsPage() {
  return <FeaturedCollection products={products} />;
}
