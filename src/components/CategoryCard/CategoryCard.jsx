// src/components/CategoryCard/CategoryCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";

export default function CategoryCard({
  title,
  img,
  to,
  whatsappNumber, // e.g. "919876543210"
  whatsappText,
  classes, // ← pass styles from CategoriesSection.module.css
}) {
  const waHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}${
        whatsappText ? `?text=${encodeURIComponent(whatsappText)}` : ""
      }`
    : null;

  const Wrapper = to ? Link : "div";
  const wrapperProps = to ? { to } : {};

  return (
    <article className={classes.card}>
      <Wrapper {...wrapperProps} aria-label={title} className={classes.link}>
        <div className={classes.imageWrap}>
          <img src={img} alt={title} className={classes.img} loading="lazy" />

          {waHref && (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className={classes.whatsapp}
              onClick={(e) => e.stopPropagation()}
              aria-label={`Chat on WhatsApp about ${title}`}
              title="Chat on WhatsApp"
            >
              <FaWhatsapp />
            </a>
          )}
        </div>

        <span className={classes.caption}>{title}</span>
      </Wrapper>
    </article>
  );
}
