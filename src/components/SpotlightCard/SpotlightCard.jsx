import React, { useState } from "react";
import styles from "./SpotlightCard.module.css";

/**
 * SpotlightCard.jsx
 * Props: image, avatar, author, title, excerpt, date, href
 */
export default function SpotlightCard(props) {
  const {
    image = "/images/placeholder-banner.png",
    avatar = "/images/placeholder-avatar.png",
    author = "Unknown",
    title = "Untitled",
    excerpt = "",
    date = "",
    href = "#",
  } = props;

  const [imgLoaded, setImgLoaded] = useState(false);
  const [avatarLoaded, setAvatarLoaded] = useState(false);

  // fallbacks for broken images
  const onImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/images/placeholder-banner.png";
  };
  const onAvatarError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/images/placeholder-avatar.png";
  };

  return (
    <article className={styles.card}>
      <div className={styles.thumb}>
        {/* banner image (has reserved area via aspect-ratio) */}
        <img
          src={image}
          alt={title}
          onError={onImgError}
          onLoad={() => setImgLoaded(true)}
          className={`${styles.bannerImg} ${imgLoaded ? styles.loaded : ""}`}
          loading="lazy"
          decoding="async"
          width="1280" /* approximate natural size to help layout stability */
          height="120"
        />

        {/* avatar wrapper keeps circular placeholder until avatar loads */}
        <div className={styles.avatarWrap} aria-hidden={false}>
          <img
            className={`${styles.avatar} ${avatarLoaded ? styles.loaded : ""}`}
            src={avatar}
            alt={author}
            onError={onAvatarError}
            onLoad={() => setAvatarLoaded(true)}
            loading="lazy"
            decoding="async"
            width="66"
            height="66"
          />
        </div>
      </div>

      <div className={styles.body}>
        <a className={styles.author} href={href}>
          {author}
        </a>

        <div className={styles.titleRow}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.arrow} aria-hidden>
            ↗
          </div>
        </div>

        <p className={styles.excerpt}>{excerpt}</p>
        <div className={styles.date}>{date}</div>
      </div>
    </article>
  );
}
