import React from "react";
import PillBadge from "../../components/PillBadge/PillBadge";
import styles from "./AboutUsSection.module.css";

const AboutUsSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* ----------- Row 1 : Our Story ----------- */}
        <div className={styles.storyRow}>
          <img
            className={`${styles.storyImg} ${styles.leftImg}`}
            src="/images/aboutus/ourstory1.png"
            alt="Holding jewellery box"
          />

          <div className={styles.storyText}>
            <PillBadge text="Our Story" highlightChars={6} verticalShrink={1} />
            <p>
              At the heart of our journey lies a passion for timeless elegance
              and craftsmanship. What began as a small vision to create
              jewellery that celebrates life’s most precious moments has grown
              into a trusted name for artistry, authenticity, and beauty. Each
              piece we design is more than just an ornament—it is a symbol of
              love, tradition, and individuality.
            </p>
          </div>

          <img
            className={`${styles.storyImg} ${styles.rightImg}`}
            src="/images/aboutus/ourstory2.png"
            alt="Ring in jewellery box"
          />
        </div>

        {/* ----------- Row 2 : Founder ----------- */}
        <div className={styles.founderRow}>
          <div className={styles.founderMediaWrap}>
            <div className={styles.purplePlate} aria-hidden="true" />
            <img
              className={styles.founderImg}
              src="/images/aboutus/founder.jpg"
              alt="Founder portrait"
            />
          </div>

          <div className={styles.founderText}>
            <div className={styles.founderNameLine}>
              <span className={styles.founderName}>Founder Name</span>
              <span className={styles.founderRole}>—Founder</span>
            </div>

            <p>
              When I started this journey, my dream was simple—to create
              jewellery that speaks from the heart. For me, every design is not
              just about sparkle and shine, but about capturing emotions,
              memories, and the beauty of life’s special moments. I believe
              jewellery should be timeless, meaningful, and crafted with care so
              that it becomes part of your story for generations to come.
            </p>
          </div>
        </div>

        {/* Duplicate section (optional for two founders layout) */}
        {/* <div className={`${styles.founderRow} ${styles.reverse}`}>
          <div className={styles.founderText}>
            <div className={styles.founderNameLine}>
              <span className={styles.founderName}>Founder Name</span>
              <span className={styles.founderRole}>—Founder</span>
            </div>

            <p>
              When I started this journey, my dream was simple—to create
              jewellery that speaks from the heart. For me, every design is not
              just about sparkle and shine, but about capturing emotions,
              memories, and the beauty of life’s special moments. I believe
              jewellery should be timeless, meaningful, and crafted with care so
              that it becomes part of your story for generations to come.
            </p>
          </div>

          <div className={styles.founderMediaWrap}>
            <div className={styles.purplePlate} aria-hidden="true" />
            <img
              className={styles.founderImg}
              src="/images/aboutus/founder.jpg"
              alt="Founder portrait"
            />
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default AboutUsSection;
