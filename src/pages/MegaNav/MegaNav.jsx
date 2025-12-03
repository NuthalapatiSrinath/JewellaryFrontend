import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import mstyles from "./MegaNav.module.css";

/**
 * Fully updated MegaNav:
 * - closes on mouse leave / outside
 * - passes shape filter via ?shape=round
 */

function NavMenuWithPanel({ to, label, isActiveFlag, megaProps }) {
  if (!megaProps) {
    return (
      <li>
        <NavLink
          to={to}
          className={({ isActive }) =>
            `${mstyles.navItem} ${
              isActive || isActiveFlag ? mstyles.active : ""
            }`
          }
          onClick={() => document.documentElement.classList.add("mega-closed")}
        >
          {label}
        </NavLink>
      </li>
    );
  }

  return (
    <li
      className={mstyles.navLiWithPanel}
      onMouseLeave={() => document.documentElement.classList.add("mega-closed")}
      onMouseEnter={() =>
        document.documentElement.classList.remove("mega-closed")
      }
    >
      <NavLink
        to={to}
        className={({ isActive }) =>
          `${mstyles.navItem} ${isActive || isActiveFlag ? mstyles.active : ""}`
        }
        onClick={() => document.documentElement.classList.add("mega-closed")}
      >
        {label}
      </NavLink>

      <div
        className={mstyles.panelWrap}
        id={megaProps.id}
        role="region"
        aria-label={`${label} menu`}
      >
        <div className={mstyles.megaPanel}>
          <div className={mstyles.megaInner}>
            {megaProps.columns.map((col, ci) => (
              <div className={mstyles.column} key={ci}>
                {col.title && <h4>{col.title}</h4>}
                <ul>
                  {col.items.map((it, ii) => (
                    <li key={ii}>
                      <Link
                        to={it.to}
                        onClick={() =>
                          document.documentElement.classList.add("mega-closed")
                        }
                      >
                        {it.icon && (
                          <img
                            src={it.icon}
                            alt=""
                            aria-hidden="true"
                            className={mstyles.itemIcon}
                          />
                        )}
                        <span className={mstyles.itemLabel}>{it.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {megaProps.image && (
              <div className={mstyles.panelImage}>
                <img src={megaProps.image.src} alt={megaProps.image.alt} />
                {megaProps.image.ctaLabel && (
                  <Link
                    to={megaProps.image.ctaTo || "#"}
                    className={mstyles.panelCta}
                    onClick={() =>
                      document.documentElement.classList.add("mega-closed")
                    }
                  >
                    {megaProps.image.ctaLabel}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

export default function MegaNav() {
  const location = useLocation();
  const isEngagementActive =
    location.pathname === "/engagement" ||
    location.pathname.startsWith("/engagement/");

  return (
    <ul className={mstyles.navList}>
      {/* ENGAGEMENT */}
      <NavMenuWithPanel
        to="/engagement"
        label="ENGAGEMENT"
        isActiveFlag={isEngagementActive}
        megaProps={{
          id: "mega-engagement",
          columns: [
            {
              title: "BY STYLE",
              items: [
                { label: "Solitaire", to: "/engagement/solitaire" },
                { label: "Side Stone", to: "/engagement/side-stone" },
                { label: "Halo", to: "/engagement/halo" },
                { label: "Hidden Halo", to: "/engagement/hidden-halo" },
                { label: "Three Stone", to: "/engagement/three-stone" },
                { label: "Vintage", to: "/engagement/vintage" },
                { label: "Bridal Sets", to: "/engagement/bridal-sets" },
                { label: "Shop All", to: "/engagement" },
              ],
            },
            {
              title: "BY SHAPE",
              items: [
                {
                  label: "Round",
                  to: "/diamonds?shape=round",
                  icon: "/images/shapes/round.svg",
                },
                {
                  label: "Oval",
                  to: "/diamonds?shape=oval",
                  icon: "/images/shapes/oval.svg",
                },
                {
                  label: "Emerald",
                  to: "/diamonds?shape=emerald",
                  icon: "/images/shapes/emerald.svg",
                },
                {
                  label: "Cushion",
                  to: "/diamonds?shape=cushion",
                  icon: "/images/shapes/cushion.svg",
                },
                {
                  label: "Marquise",
                  to: "/diamonds?shape=marquise",
                  icon: "/images/shapes/marquise.svg",
                },
                {
                  label: "Radiant",
                  to: "/diamonds?shape=radiant",
                  icon: "/images/shapes/radient.svg",
                },
                {
                  label: "Pear",
                  to: "/diamonds?shape=pear",
                  icon: "/images/shapes/pear.svg",
                },
                {
                  label: "Princess",
                  to: "/diamonds?shape=princess",
                  icon: "/images/shapes/princess.svg",
                },
                {
                  label: "Asscher",
                  to: "/diamonds?shape=asscher",
                  icon: "/images/shapes/asscher.svg",
                },
                {
                  label: "Heart",
                  to: "/diamonds?shape=heart",
                  icon: "/images/shapes/heart.svg",
                },
              ],
            },
            {
              title: "FEATURED",
              items: [
                { label: "New Arrivals", to: "/engagement/new-arrivals" },
                { label: "Ready to Ship", to: "/engagement" },
                { label: "Custom Design", to: "/custom-design" },
              ],
            },
          ],
          image: {
            src: "/images/hover/engagementpanel1.png",
            alt: "Engagement guide",
          },
        }}
      />

      {/* WEDDING */}
      <NavMenuWithPanel
        to="/wedding/all"
        label="WEDDING"
        megaProps={{
          id: "mega-wedding",
          columns: [
            {
              title: "BY STYLE",
              items: [
                { label: "Wedding", to: "/wedding/aa" },
                { label: "Anniversary", to: "/wedding/anniversary" },
                { label: "Eternity", to: "/wedding/eternity" },
                { label: "Curved", to: "/wedding/curved" },
                { label: "Stackable", to: "/wedding/stackable" },
                { label: "Men's", to: "/wedding/all" },
                { label: "Shop All", to: "/wedding/all" },
              ],
            },
            {
              title: "FEATURED",
              items: [
                { label: "New Wedding Arrivals", to: "/wedding/new-arrivals" },
                { label: "Wedding Day Must-Haves", to: "/wedding/must-haves" },
                {
                  label: "Custom Bridal Sets and Bands",
                  to: "/wedding/custom-bridal",
                },
                {
                  label: "Ready to Ship Wedding",
                  to: "/wedding/ready-to-ship",
                },
              ],
            },
          ],
          image: {
            src: "/images/hover/engagementpanel.png",
            alt: "Wedding hero",
          },
        }}
      />

      {/* JEWELLERY */}
      <NavMenuWithPanel
        to="/jewellery/all"
        label="JEWELLERY"
        megaProps={{
          id: "mega-jewellery",
          columns: [
            {
              title: "EARRINGS",
              items: [
                { label: "Studs", to: "/jewellery/earrings/studs" },
                { label: "Hoops & Huggies", to: "/jewellery/earrings/hoops" },
                { label: "Dangles & Drops", to: "/jewellery/earrings/dangles" },
                {
                  label: "Climbers, Jackets & Cuffs",
                  to: "/jewellery/earrings/climbers",
                },
                { label: "Ready to Ship", to: "/jewellery/earrings/ready" },
                { label: "Shop All", to: "/jewellery/earrings" },
              ],
            },
            {
              title: "NECKLACES",
              items: [
                { label: "Tennis", to: "/jewellery/necklaces/tennis" },
                { label: "Pendants", to: "/jewellery/necklaces/pendants" },
                { label: "Fashion", to: "/jewellery/necklaces/fashion" },
                { label: "Ready to Ship", to: "/jewellery/necklaces/ready" },
                { label: "Shop All", to: "/jewellery/necklaces" },
              ],
            },
            {
              title: "BRACELETS",
              items: [
                { label: "Tennis", to: "/jewellery/bracelets/tennis" },
                {
                  label: "Bangles & Cuffs",
                  to: "/jewellery/bracelets/bangles",
                },
                { label: "Fashion", to: "/jewellery/bracelets/fashion" },
                { label: "Ready to Ship", to: "/jewellery/bracelets/ready" },
                { label: "Shop All", to: "/jewellery/bracelets" },
              ],
            },
            {
              title: "RINGS & BANDS",
              items: [
                { label: "Pinky", to: "/jewellery/rings/pinky" },
                { label: "Fashion", to: "/jewellery/rings/fashion" },
                { label: "Ready to Ship", to: "/jewellery/rings/ready" },
                { label: "Shop All", to: "/jewellery/rings" },
              ],
            },
          ],
          image: {
            src: "/images/hover/engagementpanel1.png",
            alt: "Jewellery hero",
          },
        }}
      />

      {/* DIAMONDS */}
      <NavMenuWithPanel
        to="/diamonds"
        label="DIAMONDS"
        megaProps={{
          id: "mega-diamonds",
          columns: [
            {
              title: "LOOSE LAB DIAMONDS",
              items: [
                {
                  label: "Round",
                  to: "/diamonds?shape=round",
                  icon: "/images/shapes/round.svg",
                },
                {
                  label: "Oval",
                  to: "/diamonds?shape=oval",
                  icon: "/images/shapes/oval.svg",
                },
                {
                  label: "Emerald",
                  to: "/diamonds?shape=emerald",
                  icon: "/images/shapes/emerald.svg",
                },
                {
                  label: "Cushion",
                  to: "/diamonds?shape=cushion",
                  icon: "/images/shapes/cushion.svg",
                },
                {
                  label: "Princess",
                  to: "/diamonds?shape=princess",
                  icon: "/images/shapes/princess.svg",
                },
                {
                  label: "Asscher",
                  to: "/diamonds?shape=asscher",
                  icon: "/images/shapes/asscher.svg",
                },
                {
                  label: "Heart",
                  to: "/diamonds?shape=heart",
                  icon: "/images/shapes/heart.svg",
                },
              ],
            },
            {
              title: "FEATURED",
              items: [
                { label: "Lab Diamond Jewelry", to: "/diamonds" },
                // {
                //   label: "Lab-Diamond Engagement Rings",
                //   to: "/diamonds/engagement-rings",
                // },
                { label: "The Gift Guide", to: "/gifts" },
              ],
            },
            // {
            //   title: "LEARN",
            //   items: [
            //     { label: "Lab Grown Diamond Guide", to: "/learn/lab-grown" },
            //     { label: "Learn About the 4 Cs", to: "/learn/4cs" },
            //     { label: "Diamond Financing Options", to: "/financing" },
            //   ],
            // },
          ],
          image: { src: "/images/hover/diamondspanel.png", alt: "Diamonds" },
        }}
      />

      {/* GEMSTONE */}
      {/* GEMSTONE */}
      <NavMenuWithPanel
        to="/gemstone"
        label="GEMSTONE"
        megaProps={{
          id: "mega-gemstone",
          columns: [
            {
              title: "BY SHAPE",
              items: [
                {
                  label: "Round",
                  to: "/gemstone?shape=round",
                  icon: "/images/shapes/round.svg",
                },
                {
                  label: "Oval",
                  to: "/gemstone?shape=oval",
                  icon: "/images/shapes/oval.svg",
                },
                {
                  label: "Princess",
                  to: "/gemstone?shape=princess",
                  icon: "/images/shapes/princess.svg",
                },
                {
                  label: "Cushion",
                  to: "/gemstone?shape=cushion",
                  icon: "/images/shapes/cushion.svg",
                },
                {
                  label: "Emerald",
                  to: "/gemstone?shape=emerald",
                  icon: "/images/shapes/emerald.svg",
                },
                {
                  label: "Pear",
                  to: "/gemstone?shape=pear",
                  icon: "/images/shapes/pear.svg",
                },
                {
                  label: "Heart",
                  to: "/gemstone?shape=heart",
                  icon: "/images/shapes/heart.svg",
                },
              ],
            },
            {
              title: "BY COLOR",
              items: [
                { label: "Ruby", to: "/gemstone?color=Ruby" },
                { label: "Emerald", to: "/gemstone?color=Emerald" },
                {
                  label: "Blue Sapphire",
                  to: "/gemstone?color=Blue%20Sapphire",
                },
                {
                  label: "Pink Sapphire",
                  to: "/gemstone?color=Pink%20Sapphire",
                },
                { label: "Alexandrite", to: "/gemstone?color=Alexandrite" },
              ],
            },
            // {
            //   title: "LEARN",
            //   items: [
            //     { label: "What is a Lab-Grown Gem?", to: "/learn/gems" },
            //     { label: "The Science Behind Our Gems", to: "/learn/science" },
            //   ],
            // },
          ],
          image: { src: "/images/hover/gemstonepanel.png", alt: "Gemstone" },
        }}
      />

      {/* GIFTS */}
      <NavMenuWithPanel
        to="/gifts"
        label="GIFTS"
        megaProps={{
          id: "mega-gifts",
          columns: [
            {
              title: "GIFT GUIDES",
              items: [
                { label: "Engagement Gifts", to: "/engagement" },
                { label: "Most Gifted", to: "/gifts" },
                { label: "Classic Jewelry Must-Haves", to: "/jewellery" },
                { label: "Personalized Gifts", to: "/gifts" },
                { label: "Ready To Ship Jewelry", to: "/jewellery" },
              ],
            },
            // {
            //   title: "BY RECIPIENT",
            //   items: [
            //     { label: "Gifts For Her", to: "/gifts/for-her" },
            //     { label: "Gifts For Him", to: "/gifts/for-him" },
            //     { label: "Gifts For The Bride", to: "/gifts/for-bride" },
            //   ],
            // },
            // {
            //   title: "EARRINGS",
            //   items: [
            //     { label: "Studs", to: "/jewellery/earrings/studs" },
            //     { label: "Hoops & Huggies", to: "/jewellery/earrings/hoops" },
            //     { label: "Dangles & Drops", to: "/jewellery/earrings/dangles" },
            //     {
            //       label: "Climbers, Jackets & Cuffs",
            //       to: "/jewellery/earrings/climbers",
            //     },
            //     { label: "Ready to Ship", to: "/jewellery/earrings/ready" },
            //   ],
            // },
          ],
          image: { src: "/images/hover/giftpanel.png", alt: "Gifts" },
        }}
      />

      {/* ABOUT */}
      <NavMenuWithPanel
        to="/about"
        label="ABOUT"
        megaProps={{
          id: "mega-about",
          columns: [
            // {
            //   title: "ABOUT",
            //   items: [
            //     { label: "Story", to: "/about/story" },
            //     { label: "Mission", to: "/about/mission" },
            //     { label: "Reviews", to: "/about/reviews" },
            //     { label: "Press", to: "/about/press" },
            //   ],
            // },
            {
              title: "ABOUT",
              items: [
                { label: "Visit Us", to: "/visit" },
                { label: "Contact", to: "/contact" },
                { label: "Our Journel", to: "/journal" },
                // {
                //   label: "Conflict Diamond Facts",
                //   to: "/about/conflict-facts",
                // },
              ],
            },
            {
              title: "OUR MATERIALS",
              items: [
                {
                  label: "Lab Grown Diamonds",
                  to: "/diamonds",
                },
                { label: "Lab Created Gemstones", to: "/gemstone" },
                // {
                //   label: "Recycled Metal Guide",
                //   to: "/about/materials/recycled",
                // },
              ],
            },
          ],
          image: { src: "/images/store.jpg", alt: "About" },
        }}
      />
    </ul>
  );
}
