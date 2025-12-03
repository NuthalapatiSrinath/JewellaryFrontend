import React from "react";
import { Link } from "react-router-dom";
import styles from "./CollectionsSection.module.css";
import PillBadge from "../../components/PillBadge/PillBadge";

const collections = [
  {
    id: 1,
    title: "Engagement Rings",
    image: "images/engagement.webp",
    link: "/engagement",
  },
  {
    id: 2,
    title: "Bracelet",
    image: "images/bracelet.webp",
    link: "/jewellery/bracelets",
  },
  {
    id: 3,
    title: "Necklace",
    image: "images/necklace.webp",
    link: "/jewellery/necklaces",
  },
  {
    id: 4,
    title: "Diamonds",
    image: "images/diamondimage.webp",
    link: "/diamonds",
  },
  {
    id: 5,
    title: "Fine Jewellery",
    image: "images/finejewellary1.webp",
    link: "/jewellery",
  },
];

const areaClassByIndex = (i) => {
  if (i === 0) return styles.areaLarge; // first = large
  if (i === 1) return styles.areaB;
  if (i === 2) return styles.areaC;
  if (i === 3) return styles.areaD;
  return styles.areaE; // i === 4
};

export default function CollectionsSection() {
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <PillBadge
          text="Explore Our Collections"
          color="#a020f0"
          bgColor="#f3e8ff"
        />
      </div>

      <div className={styles.grid}>
        {collections.map((item, i) => (
          <div
            key={item.id}
            className={`${styles.card} ${areaClassByIndex(i)}`}
          >
            <div className={styles.imageWrap}>
              <img src={item.image} alt={item.title} />
            </div>
            {/* Only the title is clickable */}
            <Link to={item.link} className={styles.title}>
              {item.title} <span>↗</span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
