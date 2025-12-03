// src/data/products.js
function slugify(text = "") {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");
}

const raw = [

    {
      id: "r1",
      title: "Solitaire Diamond Engagement Ring",
      subtitle: "Classic 6-prong round model",
      price: "$500 USD",
      defaultColor: "gold",
      variants: {
        gold: "/images/rings/gold.jpg",
        white: "/images/rings/diamond.png",
        rose: "/images/rings/rose.png",
      },
    },
    {
      id: "r2",
      title: "Elegant White Gold Diamond Ring",
      subtitle: "Simple pave band design",
      price: "$650 USD",
      defaultColor: "white",
      variants: {
        gold: "/images/rings/gold.jpg",
        white: "/images/rings/diamond.png",
        rose: "/images/rings/rose.png",
      },
    },
    {
      id: "r3",
      title: "Rose Gold Solitaire Engagement Ring",
      subtitle: "Delicate rose tone finish",
      price: "$550 USD",
      defaultColor: "rose",
      variants: {
        gold: "/images/rings/gold.jpg",
        white: "/images/rings/diamond.png",
        rose: "/images/rings/rose.png",
      },
    },
    {
      id: "r4",
      title: "Classic Yellow Gold Ring",
      subtitle: "Round cut diamond brilliance",
      price: "$500 USD",
      defaultColor: "gold",
      variants: {
        gold: "/images/rings/gold.jpg",
        white: "/images/rings/diamond.png",
        rose: "/images/rings/rose.png",
      },
    },
    {
      id: "r5",
      title: "White Diamond Halo Ring",
      subtitle: "Sparkling stone accent design",
      price: "$720 USD",
      defaultColor: "white",
      variants: {
        gold: "/images/rings/gold.jpg",
        white: "/images/rings/diamond.png",
        rose: "/images/rings/rose.png",
      },
    },
    {
      id: "r6",
      title: "Rose Gold Vintage Engagement Ring",
      subtitle: "Old charm inspired look",
      price: "$580 USD",
      defaultColor: "rose",
      variants: {
        gold: "/images/rings/gold.jpg",
        white: "/images/rings/diamond.png",
        rose: "/images/rings/rose.png",
      },
    },
    {
      id: "r7",
      title: "Luxury Gold Solitaire Diamond Ring",
      subtitle: "Elegant handcrafted finish",
      price: "$600 USD",
      defaultColor: "gold",
      variants: {
        gold: "/images/rings/gold.jpg",
        white: "/images/rings/diamond.png",
        rose: "/images/rings/rose.png",
      },
    },
    {
      id: "r8",
      title: "Minimalist White Gold Ring",
      subtitle: "Sleek modern aesthetic",
      price: "$640 USD",
      defaultColor: "white",
      variants: {
        gold: "/images/rings/gold.jpg",
        white: "/images/rings/diamond.png",
        rose: "/images/rings/rose.png",
      },
    },
    {
      id: "r9",
      title: "Classic Rose Gold Engagement Ring",
      subtitle: "Romantic design for her",
      price: "$560 USD",
      defaultColor: "rose",
      variants: {
        gold: "/images/rings/gold.jpg",
        white: "/images/rings/diamond.png",
        rose: "/images/rings/rose.png",
      },
    },
  
  /* paste the 9 product objects you already used (same shape) */
];

export const allProducts = raw.map(p => ({ ...p, slug: slugify(p.title) }));
export default allProducts;
