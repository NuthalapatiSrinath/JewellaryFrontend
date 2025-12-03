import React from "react";
import styles from "./ShopByShape.module.css";
import PillBadge from "../../components/PillBadge/PillBadge";

const DEFAULT_SHAPES = [
  {
    name: "Pear",
    icon: "/images/shapes/pear.svg",
    hover: "/images/hover/pear.svg",
    href: "diamonds?shape=pear",
  },
  {
    name: "Princess",
    icon: "/images/shapes/princess.svg",
    hover: "/images/hover/princess.jpg",
    href: "/diamonds?shape=princess",
  },
  {
    name: "Asscher",
    icon: "/images/shapes/asscher.svg",
    hover: "/images/hover/asscher.jpg",
    href: "/diamonds?shape=asscher",
  },
  {
    name: "Heart",
    icon: "/images/shapes/heart.svg",
    hover: "/images/hover/heart.jpg",
    href: "/diamonds?shape=heart",
  },
  {
    name: "Round",
    icon: "/images/shapes/round.svg",
    hover: "/images/hover/round.jpg",
    href: "/diamonds?shape=round",
  },
  {
    name: "Emerald",
    icon: "/images/shapes/emerald.svg",
    hover: "/images/hover/emerald.jpg",
    href: "/diamonds?shape=emerald",
  },
  {
    name: "Oval",
    icon: "/images/shapes/oval.svg",
    hover: "/images/hover/oval.jpg",
    href: "/diamonds?shape=oval",
  },
  {
    name: "Cushion",
    icon: "/images/shapes/cushion.svg",
    hover: "/images/hover/cushion.jpg",
    href: "/diamonds?shape=cushion",
  },
  {
    name: "Marquise",
    icon: "/images/shapes/marquise.svg",
    hover: "/images/hover/marquise.jpg",
    href: "diamonds?shape=marquise",
  },
  {
    name: "Radiant",
    icon: "/images/shapes/radient.svg",
    hover: "/images/hover/radient.jpg",
    href: "diamonds?shape=radient",
  },
];

export default function ShopByShape({
  title = "Shop by shape for rings",
  shapes = DEFAULT_SHAPES,
}) {
  return (
    <section className={styles.wrap} aria-labelledby="shape-title">
      <div className={styles.header}>
        <PillBadge id="shape-title" text={title} highlightChars={7} />
      </div>

      <div className={styles.grid}>
        {shapes.slice(0, 10).map((s, idx) => {
          const Card = (
            <div className={styles.card}>
              {/* decorative line-icon (visible by default) */}
              <img
                className={styles.icon}
                src={s.icon}
                alt=""
                aria-hidden="true"
              />

              {/* replacement hover image (hidden by default) */}
              <img
                className={styles.hoverImg}
                src={s.hover}
                alt=""
                aria-hidden="true"
              />

              {/* label — switches style on hover */}
              <span className={styles.label}>{s.name}</span>
            </div>
          );

          // always link to /engagement (or shape-specific page if you later want)
          return (
            <a
              key={idx}
              href={s.href || "/engagement"}
              className={styles.item}
              aria-label={s.name}
            >
              {Card}
            </a>
          );
        })}
      </div>
    </section>
  );
}
