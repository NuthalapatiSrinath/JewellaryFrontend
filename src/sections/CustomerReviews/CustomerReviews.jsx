import React, { useState } from "react";
import styles from "./CustomerReviews.module.css";
import PillBadge from "../../components/PillBadge/PillBadge";

const DEFAULT_IMAGES = [
  "/images/reviews/rev-1.webp",
  "/images/reviews/rev-2.webp",
  "/images/reviews/rev-3.webp",
];

const DEFAULT_REVIEW = {
  author: "Varun",
  rating: 5,
  title: "Absolutely stunning engagement ring!",
  body: "The ring feels like it was made just for me.I couldn't be happier with my engagement ring. The quality is exceptional, and it's even more beautiful in person.The shine, the fit, the finish — everything feels luxurious and beautifully made.",
  images: ["/images/rings/gold.jpg", "/images/rings/diamond.png"],
};

export default function CustomerReviews({
  title = "Customer Reviews",
  blurb = `Our jewellery is more than just adornment — it’s a reflection of timeless elegance and trust. Every piece is crafted with care, and every review is a sparkle of love from our valued customers. Discover what makes our jewels truly precious through the voices of those who wear them.Our jewellery is more than just adornment — it’s a reflection of timeless elegance and trust.`,
  images = DEFAULT_IMAGES,
  review = DEFAULT_REVIEW,
}) {
  const [hovered, setHovered] = useState(null);

  const mid = Math.max(1, Math.floor(images.length / 2));
  const leftImg = images[mid - 1] || images[0];
  const centerImg = images[mid] || images[0];
  const rightImg = images[mid + 1] || images[images.length - 1] || images[0];
  const display = [leftImg, centerImg, rightImg];

  const thumbSrc =
    review.images && review.images.length > 0 ? review.images[0] : null;
  const extraCount =
    review.images && review.images.length > 1 ? review.images.length - 1 : 0;

  return (
    <section className={styles.wrap} aria-label={title}>
      <div className={styles.header}>
        <PillBadge text={title} highlightChars={8} verticalShrink={1} />
      </div>

      <p className={styles.blurb}>{blurb}</p>

      <div className={styles.row3}>
        {display.map((src, i) => (
          <figure
            key={i}
            className={`${styles.card} ${
              i === 1 ? styles.center : styles.side
            }`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <img
              src={src}
              alt={`Customer review ${i + 1}`}
              style={{
                opacity: hovered === i ? 0 : 1,
                transition: "opacity 0.25s ease",
              }}
            />

            <div
              className={`${styles.preview} ${
                hovered === i ? styles.previewVisible : ""
              }`}
            >
              <div className={styles.previewInner}>
                <div>
                  <div className={styles.previewHeader}>
                    <div className={styles.previewAuthor}>{review.author}</div>
                    <div>
                      <span className={styles.previewStars}>
                        {"★".repeat(review.rating)}
                      </span>
                      <span className={styles.previewCount}>
                        &nbsp;({review.rating})
                      </span>
                    </div>
                  </div>

                  <h4 className={styles.previewTitle}>{review.title}</h4>
                  <p className={styles.previewBody}>{review.body}</p>
                </div>

                <div>
                  <hr className={styles.previewSep} />
                  <div className={styles.previewFooter}>
                    {thumbSrc && (
                      <img
                        className={styles.previewThumb}
                        src={thumbSrc}
                        alt="thumb"
                      />
                    )}
                    {extraCount > 0 && (
                      <div className={styles.previewExtra}>+{extraCount}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}
